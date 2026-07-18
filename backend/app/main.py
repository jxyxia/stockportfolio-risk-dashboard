from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import prices, metrics

app = FastAPI(title="Risk Dashboard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # temporary, will lock down after Vercel deploy
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(prices.router)
app.include_router(metrics.router)

@app.get("/")
def root():
    return {"status": "ok"}