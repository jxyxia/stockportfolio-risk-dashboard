from pydantic import BaseModel

class MetricsResponse(BaseModel):
    annualized_volatility: float
    sharpe_ratio: float
    var_95: float
    var_99: float
    max_drawdown: float