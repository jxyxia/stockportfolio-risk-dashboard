"use client";

import { useState } from "react";
import PortfolioForm from "@/components/PortfolioForm";
import MetricsGrid from "@/components/MetricsGrid";
import PriceChart from "@/components/PriceChart";
import DrawdownChart from "@/components/DrawdownChart";
import { getPrices, getMetrics, getDrawdown } from "@/lib/api";
import { PricePoint, Metrics } from "@/types/portfolio";

interface DrawdownPoint {
  Date: string;
  Drawdown: number;
}

export default function Home() {
  const [prices, setPrices] = useState<PricePoint[] | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [drawdown, setDrawdown] = useState<DrawdownPoint[] | null>(null);
  const [tickerList, setTickerList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(tickers: string, weights: string) {
    setLoading(true);
    setError("");
    try {
      const priceData = await getPrices(tickers);
      const metricsData = await getMetrics(tickers, weights);
      setPrices(priceData);
      setMetrics(metricsData);
      setTickerList(tickers.split(",").map((t) => t.trim().toUpperCase()));
      const drawdownData = await getDrawdown(tickers, weights);
      setDrawdown(drawdownData);
    } catch (err) {
     setError(err instanceof Error ? err.message : "Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-4xl mx-auto p-8 flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Portfolio Risk Dashboard</h1>
      <PortfolioForm onSubmit={handleSubmit} />

      {loading && (
      <div className="flex items-center gap-2 text-gray-400">
        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
        <span>Fetching data and calculating metrics...</span>
      </div>
    )}
      {error && <p className="text-red-600">{error}</p>}

      {metrics && <MetricsGrid metrics={metrics} />}
      {prices && tickerList.length > 0 && (
        <>
          <PriceChart data={prices} tickers={tickerList} />
          {drawdown && <DrawdownChart data={drawdown} />}
        </>
      )}
    </main>
  );
}