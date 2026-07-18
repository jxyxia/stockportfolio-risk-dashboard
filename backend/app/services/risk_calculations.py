import numpy as np
import pandas as pd
from app.config import TRADING_DAYS_PER_YEAR

def calculate_returns(prices: pd.DataFrame) -> pd.DataFrame:
    return prices.pct_change().dropna()

def portfolio_returns(returns: pd.DataFrame, weights: list[float]) -> pd.Series:
    return (returns * weights).sum(axis=1)

def volatility(returns: pd.Series, annualized: bool = True) -> float:
    vol = returns.std()
    return vol * np.sqrt(TRADING_DAYS_PER_YEAR) if annualized else vol

def sharpe_ratio(returns: pd.Series, risk_free_rate: float) -> float:
    annualized_return = returns.mean() * TRADING_DAYS_PER_YEAR
    annualized_vol = volatility(returns)
    return (annualized_return - risk_free_rate) / annualized_vol

def historical_var(returns: pd.Series, confidence: float = 0.95) -> float:
    percentile = (1 - confidence) * 100
    return np.percentile(returns, percentile)

def max_drawdown(returns: pd.Series) -> float:
    cumulative = (1 + returns).cumprod()
    running_max = cumulative.cummax()
    drawdown = (cumulative - running_max) / running_max
    return drawdown.min()