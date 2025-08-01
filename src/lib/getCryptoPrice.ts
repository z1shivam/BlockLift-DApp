import { promises as fs } from "fs";
import path from "path";

// Define interfaces for CoinGecko API response
interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: unknown | null;
  last_updated: string;
}

// Simplified price interface for getPrice
interface SimplifiedPrice {
  name: string;
  symbol: string;
  current_price: number;
}

// Cache file path and duration
const CACHE_FILE: string = path.join(process.cwd(), "crypto_cache.json");
const CACHE_DURATION: number = 3600 * 1000; // 1 hour in milliseconds

// Check if cache is valid
async function isCacheValid(): Promise<boolean> {
  try {
    const stats = await fs.stat(CACHE_FILE);
    const fileAge = Date.now() - stats.mtimeMs;
    return fileAge < CACHE_DURATION;
  } catch {
    return false;
  }
}

// Read cache from file
async function readCache(): Promise<CryptoPrice[] | null> {
  try {
    const data = await fs.readFile(CACHE_FILE, "utf-8");
    return JSON.parse(data) as CryptoPrice[];
  } catch {
    return null;
  }
}

// Write cache to file
async function writeCache(data: CryptoPrice[]): Promise<void> {
  try {
    await fs.writeFile(CACHE_FILE, JSON.stringify(data, null, 2));
  } catch (error: unknown) {
    console.error("Error writing cache:", error);
  }
}

// Fetch crypto prices from CoinGecko API
async function fetchCryptoPrices(): Promise<CryptoPrice[]> {
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr`;
  const options: RequestInit = {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-cg-demo-api-key": process.env.COIN_GECKO_API_KEY!,
    },
  };

  try {
    const res: Response = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return (await res.json()) as CryptoPrice[];
  } catch (error: unknown) {
    console.error("Error fetching crypto prices:", error);
    throw error;
  }
}

// Load or fetch prices with caching
async function loadOrFetchPrices(): Promise<CryptoPrice[]> {
  if (await isCacheValid()) {
    const cachedData = await readCache();
    if (cachedData) return cachedData;
  }

  const freshData: CryptoPrice[] = await fetchCryptoPrices();
  await writeCache(freshData);
  return freshData;
}

// Get simplified price data
export async function getPrice(): Promise<SimplifiedPrice[]> {
  try {
    const data: CryptoPrice[] = await loadOrFetchPrices();
    return data.map(({ name, symbol, current_price }) => ({
      name,
      symbol,
      current_price,
    }));
  } catch (error: unknown) {
    console.error("Error in getPrice:", error);
    throw error;
  }
}

// Get detailed price data
export async function getDetailedPrice(): Promise<CryptoPrice[]> {
  try {
    return await loadOrFetchPrices();
  } catch (error: unknown) {
    console.error("Error in getDetailedPrice:", error);
    throw error;
  }
}
