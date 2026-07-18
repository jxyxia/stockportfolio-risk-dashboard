from fastapi import APIRouter
from app.services.data_fetcher import fetch_prices
from app.config import DEFAULT_PERIOD

router = APIRouter()

@router.get("/api/prices")
def get_prices(tickers: str, period: str = DEFAULT_PERIOD):
    ticker_list = [t.strip().upper() for t in tickers.split(",")]
    prices = fetch_prices(ticker_list, period)
    return prices.reset_index().to_dict(orient="records")