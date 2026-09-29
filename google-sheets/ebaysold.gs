// Google Sheets: Extensions > Apps Script, paste, then add the EBAY_SOLD_API_KEY script property.
const API = "https://api.ebaysoldlistingsapi.com/scrape";
const KEY = PropertiesService.getScriptProperties().getProperty("EBAY_SOLD_API_KEY");

function fetchSold_(keyword, site) {
  const cache = CacheService.getScriptCache();
  const ck = (site || "ebay.com") + "|" + keyword;
  const hit = cache.get(ck);
  if (hit) return JSON.parse(hit);
  const url = API + "?keyword=" + encodeURIComponent(keyword) + "&ebaySite=" + (site || "ebay.com");
  const res = UrlFetchApp.fetch(url, { headers: { Authorization: "Bearer " + KEY }, muteHttpExceptions: true });
  if (res.getResponseCode() !== 200) throw new Error(JSON.parse(res.getContentText()).error);
  const prices = JSON.parse(res.getContentText()).results
    .map((r) => Number(r.soldPrice)).filter((n) => n > 0).sort((a, b) => a - b);
  cache.put(ck, JSON.stringify(prices), 21600); // 6 hours
  return prices;
}

/**
 * Median eBay sold price for a keyword.
 * @param {string} keyword Search term, e.g. "steam deck oled"
 * @param {string} site Optional marketplace, e.g. "ebay.co.uk"
 * @customfunction
 */
function EBAYSOLD(keyword, site) {
  const p = fetchSold_(keyword, site);
  if (!p.length) return "no sales";
  const m = Math.floor(p.length / 2);
  return p.length % 2 ? p[m] : (p[m - 1] + p[m]) / 2;
}

/** Number of completed sales found. @customfunction */
function EBAYSOLDCOUNT(keyword, site) {
  return fetchSold_(keyword, site).length;
}
