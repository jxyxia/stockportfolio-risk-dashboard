import axios from "axios";

const API_BASE = "https://risk-dashboard-api-kue0.onrender.com";

function extractErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err) && err.response?.data?.detail) {
    return err.response.data.detail;
  }
  return "Something went wrong. Please check your inputs and try again.";
}

export async function getPrices(tickers: string, period = "1y") {
  try {
    const res = await axios.get(`${API_BASE}/api/prices`, {
      params: { tickers, period },
    });
    return res.data;
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
}

export async function getMetrics(tickers: string, weights: string, period = "1y") {
  try {
    const res = await axios.get(`${API_BASE}/api/metrics`, {
      params: { tickers, weights, period },
    });
    return res.data;
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
}

export async function getDrawdown(tickers: string, weights: string, period = "1y") {
  try {
    const res = await axios.get(`${API_BASE}/api/drawdown`, {
      params: { tickers, weights, period },
    });
    return res.data;
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
}