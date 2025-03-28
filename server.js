import express from "express";
import cors from "cors";


const app = express();
const PORT = 3001;

// Simple in-memory cache
const cache = new Map();
const CACHE_TTL = 3600000; // Cache time-to-live: 1 hour in milliseconds

// Enable CORS for local development
app.use(cors());

// Root route for testing
app.get("/", (req, res) => {
  res.send("NASA Asteroid Proxy Server is running!");
});

// Proxy route with caching
app.get('/api/asteroid/:designation', async (req, res) => {
  const { designation } = req.params;
  const cacheKey = `asteroid_${designation}`;
  const apiUrl = `https://ssd-api.jpl.nasa.gov/sentry.api?des=${encodeURIComponent(designation)}`;

  // Check if we have a valid cache entry
  if (cache.has(cacheKey)) {
    const cacheEntry = cache.get(cacheKey);
    if (cacheEntry.timestamp > Date.now() - CACHE_TTL) {
      return res.json(cacheEntry.data);
    }
  }

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`NASA API request failed with status ${response.status}`);
    }
    const data = await response.json();
    
    // Store in cache
    cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching data from NASA API:', error);
    res.status(500).json({ error: 'Failed to fetch data from NASA API' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});
