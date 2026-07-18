"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

interface DrawdownPoint {
  Date: string;
  Drawdown: number;
}

interface Props {
  data: DrawdownPoint[];
}

export default function DrawdownChart({ data }: Props) {
  return (
    <div className="bg-surface border border-border rounded-md p-4">
      <h3 className="text-xs uppercase tracking-wider text-muted font-sans mb-3">
        Portfolio Drawdown
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1C2230" />
          <XAxis dataKey="Date" tick={{ fontSize: 10, fill: "#8B92A5" }} />
          <YAxis
            tick={{ fontSize: 10, fill: "#8B92A5" }}
            tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#12161F",
              border: "1px solid #1C2230",
              borderRadius: "6px",
              fontSize: "12px",
              fontFamily: "var(--font-mono)",
            }}
            labelStyle={{ color: "#8B92A5" }}
            formatter={(value) => {
              const resolvedValue =
                typeof value === "number"
                  ? value
                  : Array.isArray(value)
                    ? Number(value[0] ?? 0)
                    : Number(value ?? 0);
              return [`${(resolvedValue * 100).toFixed(2)}%`, "Drawdown"];
            }}
          />
          <Area
            type="monotone"
            dataKey="Drawdown"
            stroke="#F87171"
            fill="#F87171"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}