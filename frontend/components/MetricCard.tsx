"use client";

import { useEffect, useState } from "react";

interface Props {
  label: string;
  value: string;
  hint?: string;
  tone?: "positive" | "negative" | "neutral";
}

export default function MetricCard({ label, value, hint, tone = "neutral" }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(false);
    const timer = setTimeout(() => setShow(true), 30);
    return () => clearTimeout(timer);
  }, [value]);

  const borderColor =
    tone === "positive" ? "border-t-positive" :
    tone === "negative" ? "border-t-negative" :
    "border-t-gold";

  return (
    <div
      className={`bg-surface border border-border border-t-2 ${borderColor} rounded-md p-4 flex flex-col gap-1.5 transition-all hover:border-gold/40`}
    >
      <span className="text-xs uppercase tracking-wider text-muted font-sans">
        {label}
      </span>
      <span
        className={`text-2xl font-mono font-semibold tabular-nums ${show ? "animate-count-up" : "opacity-0"}`}
      >
        {value}
      </span>
      {hint && <span className="text-xs text-muted font-sans">{hint}</span>}
    </div>
  );
}