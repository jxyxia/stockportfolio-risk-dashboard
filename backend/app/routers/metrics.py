from fastapi import APIRouter, HTTPException
from app.services.data_fetcher import fetch_prices
from app.services.risk_calculations import (
    calculate_returns, portfolio_returns, volatility,
    sharpe_ratio, historical_var, max_drawdown
)
from app.models.schemas import MetricsResponse
from app.config import RISK_FREE_RATE, DEFAULT_PERIOD

router = APIRouter()

@router.get("/api/metrics", response_model=MetricsResponse)
def get_metrics(tickers: str, weights: str, period: str = DEFAULT_PERIOD):
    ticker_list = [t.strip().upper() for t in tickers.split(",")]
    weight_list = [float(w.strip()) for w in weights.split(",")]

    if len(ticker_list) != len(weight_list):
        raise HTTPException(
            status_code=400,
            detail=f"Number of tickers ({len(ticker_list)}) must match number of weights ({len(weight_list)})."
        )

    weight_sum = sum(weight_list)
    if abs(weight_sum - 1.0) > 0.01:
        raise HTTPException(
            status_code=400,
            detail=f"Weights must sum to 1.0 (currently sum to {weight_sum:.2f})."
        )

    prices = fetch_prices(ticker_list, period)
    returns = calculate_returns(prices)
    port_returns = portfolio_returns(returns, weight_list)

    return MetricsResponse(
        annualized_volatility=volatility(port_returns),
        sharpe_ratio=sharpe_ratio(port_returns, RISK_FREE_RATE),
        var_95=historical_var(port_returns, 0.95),
        var_99=historical_var(port_returns, 0.99),
        max_drawdown=max_drawdown(port_returns),
    )

@router.get("/api/drawdown")
def get_drawdown_series(tickers: str, weights: str, period: str = DEFAULT_PERIOD):
    ticker_list = [t.strip().upper() for t in tickers.split(",")]
    weight_list = [float(w.strip()) for w in weights.split(",")]

    prices = fetch_prices(ticker_list, period)
    returns = calculate_returns(prices)
    port_returns = portfolio_returns(returns, weight_list)

    cumulative = (1 + port_returns).cumprod()
    running_max = cumulative.cummax()
    drawdown = (cumulative - running_max) / running_max

    result = drawdown.reset_index()
    result.columns = ["Date", "Drawdown"]
    return result.to_dict(orient="records")