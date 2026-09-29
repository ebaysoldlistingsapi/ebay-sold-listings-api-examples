"""eBay sold listings in Python: search, fair price, batch jobs.

pip install requests
export EBAY_SOLD_API_KEY="eb_..."
python sold.py "shure sm7b"
"""
import os
import statistics
import sys
import time

import requests

API = "https://api.ebaysoldlistingsapi.com"
HEADERS = {"Authorization": f"Bearer {os.environ['EBAY_SOLD_API_KEY']}"}
RETRY = {429, 502, 503, 504}  # failed requests are never billed, so retrying is free


def sold(keyword, **params):
    for attempt in range(4):
        r = requests.get(f"{API}/scrape", params={"keyword": keyword, **params}, headers=HEADERS, timeout=90)
        if r.status_code not in RETRY:
            r.raise_for_status()
            return r.json()["results"]
        time.sleep(int(r.headers.get("Retry-After", 2 ** attempt)))
    r.raise_for_status()


def fair_price(rows, trim=0.1):
    prices = sorted(float(r["soldPrice"]) for r in rows if r.get("soldPrice"))
    if not prices:
        return None
    k = int(len(prices) * trim)
    core = prices[k:len(prices) - k] or prices
    return {"n": len(prices), "median": statistics.median(core), "low": core[0], "high": core[-1]}


def batch(keywords, **params):
    job = requests.post(f"{API}/scrape/batch", headers=HEADERS, json={"keywords": keywords, **params}, timeout=30).json()
    while True:
        status = requests.get(f"{API}/scrape/batch/{job['jobId']}", headers=HEADERS, timeout=30).json()
        if status["status"] == "complete":
            return status["results"]
        time.sleep(5)


if __name__ == "__main__":
    keyword = " ".join(sys.argv[1:]) or "shure sm7b"
    print(keyword, fair_price(sold(keyword, itemCondition="used")))
