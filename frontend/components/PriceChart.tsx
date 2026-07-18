"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { PricePoint } from "@/types/portfolio";

interface Props {
  data: PricePoint[];
  tickers: string[];
}

const COLORS = ["#D4A857", "#4ADE80", "#60A5FA", "#F87171", "#A78BFA"];

export default function PriceChart({ data, tickers }: Props) {
  return (
    <div className="bg-surface border border-border rounded-md p-4">
      <h3 className="text-xs uppercase tracking-wider text-muted font-sans mb-3">
        Price History
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1C2230" />
          <XAxis dataKey="Date" tick={{ fontSize: 10, fill: "#8B92A5" }} />
          <YAxis tick={{ fontSize: 10, fill: "#8B92A5" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#12161F",
              border: "1px solid #1C2230",
              borderRadius: "6px",
              fontSize: "12px",
              fontFamily: "var(--font-mono)",
            }}
            labelStyle={{ color: "#8B92A5" }}
            formatter={(value, name) => [`$${Number(value ?? 0).toFixed(2)}`, name as string]}
          />
          <Legend wrapperStyle={{ fontSize: "12px", fontFamily: "var(--font-sans)" }} />
          {tickers.map((ticker, i) => (
            <Line
              key={ticker}
              type="monotone"
              dataKey={ticker}
              stroke={COLORS[i % COLORS.length]}
              dot={false}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}