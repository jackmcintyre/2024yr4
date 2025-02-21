import express from "express";
import cors from "cors";


const app = express();
const PORT = 3001;

// Enable CORS for local development
app.use(cors());

// Root route for testing
app.get("/", (req, res) => {
  res.send("NASA Asteroid Proxy Server is running!");
});

// Proxy route
app.get('/api/asteroid/:designation', async (req, res) => {
  const { designation } = req.params;
  const apiUrl = `https://ssd-api.jpl.nasa.gov/sentry.api?des=${encodeURIComponent(designation)}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`NASA API request failed with status ${response.status}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data from NASA API:', error);
    res.status(500).json({ error: 'Failed to fetch data from NASA API' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});
