# eBay Sold Listings API examples

Copy-paste examples for the [eBay Sold Listings API](https://ebaysoldlistingsapi.com): real completed (sold) eBay listings as JSON or CSV, up to 240 sales per keyword, across 8 marketplaces (US, UK, DE, AU, CA, FR, IT, ES).

A drop-in replacement for eBay's retired Finding API `findCompletedItems` call.

| Folder | What it shows |
| --- | --- |
| [python](python) | Search with retries, a fair (trimmed median) price, batch jobs |
| [node](node) | Typed TypeScript client with native fetch, retries, median helper |
| [google-sheets](google-sheets) | `=EBAYSOLD()` custom function and a CSV comps tab (Apps Script) |

## Quick start

1. Get a free API key (50 requests a month, no card) at https://ebaysoldlistingsapi.com
2. `export EBAY_SOLD_API_KEY="eb_..."`
3. Run an example:

```bash
curl "https://api.ebaysoldlistingsapi.com/scrape?keyword=nintendo+switch+oled" \
  -H "Authorization: Bearer $EBAY_SOLD_API_KEY"
```

```bash
pip install requests && python python/sold.py "shure sm7b"
npx tsx node/sold.ts "steam deck oled"
```

## Useful parameters

`ebaySite` (ebay.com, ebay.co.uk, ebay.de, ebay.com.au, ebay.ca, ebay.fr, ebay.it, ebay.es), `sold=false` for active listings, `format=csv`, `itemCondition`, `buyingFormat`, `minPrice`, `maxPrice`, `soldAfter`, `soldBefore`, `itemLocation`, `categoryId`.

Batch up to 100 keywords with `POST /scrape/batch`. Full reference: https://ebaysoldlistingsapi.com/docs

## MCP (Claude, Cursor)

Hosted connector: `https://mcp.ebaysoldlistingsapi.com/mcp`, or run locally with `npx ebaysoldlistingsapi`.

## Guides

- [findCompletedItems replacement](https://ebaysoldlistingsapi.com/blog/ebay-findcompleteditems-replacement)
- [eBay sold listings in Python](https://ebaysoldlistingsapi.com/blog/ebay-sold-listings-api-python)
- [eBay sold listings in Node.js](https://ebaysoldlistingsapi.com/blog/ebay-sold-listings-api-nodejs)
- [eBay sold prices in Google Sheets](https://ebaysoldlistingsapi.com/blog/ebay-sold-prices-google-sheets)

## License

MIT
