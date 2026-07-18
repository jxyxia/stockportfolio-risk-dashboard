"use client";

import { useState } from "react";

interface Props {
  onSubmit: (tickers: string, weights: string) => void | Promise<void>;
}

export default function PortfolioForm({ onSubmit }: Props) {
  const [tickers, setTickers] = useState("AAPL,MSFT,GOOGL");
  const [weights, setWeights] = useState("0.4,0.3,0.3");

  return (
    <div className="flex flex-col gap-4 p-5 bg-surface border border-border rounded-md">
      <label className="flex flex-col gap-1.5">
        <span className="text-xs uppercase tracking-wider text-muted font-sans">
          Tickers
        </span>
        <input
          className="bg-base border border-border rounded px-3 py-2.5 font-mono text-sm focus:outline-none focus:border-gold transition-colors"
          value={tickers}
          onChange={(e) => setTickers(e.target.value)}
          placeholder="AAPL,MSFT,GOOGL"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-xs uppercase tracking-wider text-muted font-sans">
          Weights (sum to 1)
        </span>
        <input
          className="bg-base border border-border rounded px-3 py-2.5 font-mono text-sm focus:outline-none focus:border-gold transition-colors"
          value={weights}
          onChange={(e) => setWeights(e.target.value)}
          placeholder="0.4,0.3,0.3"
        />
      </label>
      <button
        type="button"
        className="bg-gold text-base font-semibold rounded px-4 py-2.5 mt-1 hover:opacity-90 transition-opacity"
        onClick={() => {
          void onSubmit(tickers, weights);
        }}
      >
        Analyze Portfolio
      </button>
    </div>
  );
}