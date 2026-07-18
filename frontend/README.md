# Portfolio Risk Dashboard

A full-stack web application that calculates real-time risk and performance metrics for a user-defined stock portfolio — built to demonstrate practical understanding of quantitative risk analysis alongside modern full-stack engineering.

**Live demo:** [https://portfolio-risk-dashboard-dusky.vercel.app/(https://portfolio-risk-dashboard-dusky.vercel.app/)
**API:** [https://risk-dashboard-api-kue0.onrender.com/docs](https://risk-dashboard-api-kue0.onrender.com/docs)

> Note: the backend is hosted on Render's free tier, which spins down after inactivity. The first request after idle time may take 30-50 seconds to respond.

---

## What it does

Enter any set of stock tickers and portfolio weights, and the dashboard returns:

- **Annualized Volatility** — how much the portfolio's returns fluctuate
- **Sharpe Ratio** — risk-adjusted return (return earned per unit of risk taken)
- **Value at Risk (95% and 99%)** — the maximum expected daily loss at a given confidence level, calculated using the historical method
- **Maximum Drawdown** — the largest peak-to-trough decline over the lookback period
- **Price history** and **drawdown curve**, visualized as interactive charts

---

## Why these metrics

I chose the **historical VaR method** over parametric/Monte Carlo approaches deliberately: it makes no assumption that returns are normally distributed, which matters because real stock returns tend to have "fat tails" — more extreme moves than a normal distribution would predict. It's also more transparent and easier to explain, since it's just ranking real historical returns rather than fitting a distribution.

With more time, I'd extend this to include:
- **Conditional VaR (CVaR / Expected Shortfall)** — averages the losses beyond the VaR cutoff, giving a fuller picture of tail risk
- **Monte Carlo VaR** — simulates thousands of hypothetical return paths for a probabilistic view that doesn't rely solely on historical data
- **Portfolio optimization** — suggesting weights that maximize Sharpe ratio for a given set of tickers

---

## Tech stack

**Backend**
- FastAPI (Python)
- `yfinance` for live and historical market data
- `pandas` / `numpy` for return calculations and risk math
- Deployed on Render

**Frontend**
- Next.js (TypeScript, App Router)
- Tailwind CSS v4
- Recharts for data visualization
- Deployed on Vercel

---

## Architecture

### Folder structure

```
risk-dashboard/
│
├── backend/
│   ├── app/
│   │   ├── main.py                    # FastAPI app entrypoint, CORS setup
│   │   ├── routers/
│   │   │   ├── prices.py              # /api/prices endpoint
│   │   │   └── metrics.py             # /api/metrics and /api/drawdown endpoints
│   │   ├── services/
│   │   │   ├── data_fetcher.py        # yfinance calls, error handling for bad tickers
│   │   │   └── risk_calculations.py   # pure functions: volatility, sharpe, VaR, drawdown
│   │   ├── models/
│   │   │   └── schemas.py             # Pydantic request/response models
│   │   └── config.py                  # risk-free rate, default period, constants
│   ├── tests/
│   │   └── test_risk_calculations.py  # unit tests for the risk math
│   └── requirements.txt
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx                   # main dashboard page
│   │   ├── layout.tsx                 # fonts, dark mode setup
│   │   └── globals.css                # dark theme tokens (Tailwind v4 @theme)
│   ├── components/
│   │   ├── PortfolioForm.tsx          # ticker + weight input form
│   │   ├── MetricCard.tsx             # single metric tile (with tone-based coloring)
│   │   ├── MetricsGrid.tsx            # lays out all MetricCards
│   │   ├── PriceChart.tsx             # historical price line chart (Recharts)
│   │   └── DrawdownChart.tsx          # drawdown area chart (Recharts)
│   ├── lib/
│   │   └── api.ts                     # axios calls to the FastAPI backend
│   └── types/
│       └── portfolio.ts               # shared TypeScript types
│
├── .gitignore
└── README.md
```

### Design decisions

**Routers vs. services split (backend)** — routers only handle HTTP concerns (parsing query params, returning JSON); the actual math lives in `services/risk_calculations.py` as pure functions with no FastAPI dependency. This makes the risk calculations independently unit-testable, separate from the API layer.

**Component-per-visual (frontend)** — each chart and metric tile is its own component rather than one large page file, so pieces like `MetricCard` can be reused with different props (label, value, tone) instead of duplicating JSX.

**Centralized API client** — all backend calls go through `lib/api.ts` rather than being scattered across components, so the base URL (local vs. deployed) only needs to change in one place.

### Request flow

```
User fills in tickers + weights
        │
        ▼
PortfolioForm (frontend)
        │
        ▼
lib/api.ts  ──────────────►  FastAPI routers (prices / metrics / drawdown)
                                     │
                                     ▼
                            services/data_fetcher.py
                                     │
                                     ▼
                              yfinance (Yahoo Finance)
                                     │
                                     ▼
                        services/risk_calculations.py
                        (returns, volatility, Sharpe,
                         historical VaR, max drawdown)
                                     │
                                     ▼
                          Pydantic response models
                                     │
                                     ▼
        JSON  ◄──────────────────────
        │
        ▼
MetricsGrid / PriceChart / DrawdownChart (frontend)
```

---

## Running locally

**Backend**
```bash
cd backend
python -m venv venv
venv\Scripts\Activate.ps1        # Windows PowerShell
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

The frontend expects the backend running at `http://localhost:8000` by default (see `frontend/lib/api.ts`).

---

## API Endpoints

| Endpoint | Description |
|---|---|
| `GET /api/prices?tickers=AAPL,MSFT&period=1y` | Historical closing prices |
| `GET /api/metrics?tickers=AAPL,MSFT&weights=0.5,0.5&period=1y` | Volatility, Sharpe, VaR, max drawdown |
| `GET /api/drawdown?tickers=AAPL,MSFT&weights=0.5,0.5&period=1y` | Full drawdown series for charting |

Full interactive docs available at `/docs` (Swagger UI, auto-generated by FastAPI).

---

## Error handling

- Invalid or delisted tickers return a clean `400` error naming the specific ticker, instead of a raw server crash
- Weight/ticker count mismatches are validated and rejected with a descriptive message
- Weights that don't sum to 1.0 are rejected before any calculation runs

---

## Built by

Jayesh — built as a portfolio project to demonstrate applied quantitative finance and full-stack engineering.
