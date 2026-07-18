import MetricCard from "./MetricCard";
import { Metrics } from "@/types/portfolio";

interface Props {
  metrics: Metrics;
}

export default function MetricsGrid({ metrics }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <MetricCard
        label="Annualized Volatility"
        value={`${(metrics.annualized_volatility * 100).toFixed(2)}%`}
        hint="Spread of returns"
        tone="neutral"
      />
      <MetricCard
        label="Sharpe Ratio"
        value={metrics.sharpe_ratio.toFixed(2)}
        hint="Return per unit of risk"
        tone={metrics.sharpe_ratio > 0 ? "positive" : "negative"}
      />
      <MetricCard
        label="VaR (95%)"
        value={`${(metrics.var_95 * 100).toFixed(2)}%`}
        hint="Worst daily loss, 95% confidence"
        tone="negative"
      />
      <MetricCard
        label="VaR (99%)"
        value={`${(metrics.var_99 * 100).toFixed(2)}%`}
        hint="Worst daily loss, 99% confidence"
        tone="negative"
      />
      <MetricCard
        label="Max Drawdown"
        value={`${(metrics.max_drawdown * 100).toFixed(2)}%`}
        hint="Largest peak-to-trough decline"
        tone="negative"
      />
    </div>
  );
}