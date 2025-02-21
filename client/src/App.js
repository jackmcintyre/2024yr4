import { useState, useEffect } from "react";
import { Loader } from "lucide-react";

export default function App() {
  const [impactProbability, setImpactProbability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://yr2024.onrender.com/api/asteroid/2024%20YR4")
      .then((response) => response.json())
      .then((data) => {
        if (data.summary && data.summary.ip) {
          const probability = parseFloat(data.summary.ip) * 100;
          setImpactProbability(probability.toFixed(2));
        } else {
          setError("Data format unexpected");
        }
      })
      .catch(() => setError("Failed to fetch data"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a1f44] text-white">
      <div className="p-8 bg-gray-900 rounded-2xl shadow-2xl text-center border border-gray-700">
        <h1 className="text-3xl font-bold mb-6 uppercase tracking-wide text-gray-300">Asteroid Impact Probability</h1>
        {loading ? (
          <Loader className="animate-spin mx-auto" size={48} />
        ) : error ? (
          <p className="text-red-500 text-lg">{error}</p>
        ) : (
          <p className="text-8xl font-extrabold text-white drop-shadow-lg">{impactProbability}%</p>
        )}
      </div>
      <footer className="mt-8 text-gray-400 text-sm">
        Made by <a href="https://www.linkedin.com/in/jackmcintyre" className="text-gray-300 hover:text-white underline" target="_blank" rel="noopener noreferrer">Jack McIntyre</a> & ChatGPT 🚀
      </footer>
    </div>
  );
}
