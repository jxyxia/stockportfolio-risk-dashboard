export interface PricePoint {
  Date: string;
  [ticker: string]: string | number;
}

export interface Metrics {
  annualized_volatility: number;
  sharpe_ratio: number;
  var_95: number;
  var_99: number;
  max_drawdown: number;
}