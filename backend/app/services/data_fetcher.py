import yfinance as yf
import pandas as pd
from fastapi import HTTPException

def fetch_prices(tickers: list[str], period: str = "1y") -> pd.DataFrame:
    """Fetch historical closing prices for given tickers."""
    data = yf.download(tickers, period=period)["Close"]

    if isinstance(data, pd.Series):
        data = data.to_frame(name=tickers[0])

    data = data.dropna(how="all")

    if data.empty:
        raise HTTPException(
            status_code=400,
            detail=f"No price data found for tickers: {', '.join(tickers)}. Check for typos or delisted symbols."
        )

    missing = [t for t in tickers if t not in data.columns]
    if missing:
        raise HTTPException(
            status_code=400,
            detail=f"No data found for: {', '.join(missing)}. Check for typos or delisted symbols."
        )

    return data.dropna()