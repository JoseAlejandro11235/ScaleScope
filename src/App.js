import React, { useEffect, useState } from "react";
import axios from "axios";
import StartupCard from "./Components/StartupCard";

function App() {
  const [startups, setStartups] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || []
  );
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/fetch-startups/")
      .then((res) => setStartups(res.data))
      .catch((err) => {
        console.error(err);
        if (err.response && err.response.status === 429) {
          setError("🚫 Rate limit reached. Please try again in a few minutes.");
        } else {
          setError("❌ Failed to fetch startups. Please try again later.");
        }
      });
  }, []);

  const toggleFavorite = (startup) => {
    const exists = favorites.find((f) => f.name === startup.name);
    let updatedFavorites;
    if (exists) {
      updatedFavorites = favorites.filter((f) => f.name !== startup.name);
    } else {
      updatedFavorites = [...favorites, startup];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const allCategories = ["All", ...new Set(startups.map((s) => s.category))];

  const topTags = Object.entries(
    startups.reduce((acc, cur) => {
      acc[cur.category] = (acc[cur.category] || 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag]) => tag);

  const maxVotes = Math.max(...startups.map((s) => s.votes), 0);

  const filteredStartups = (showFavorites ? favorites : startups)
    .filter((s) => {
      if (selectedCategory === "All") return true;
      return s.category === selectedCategory;
    })
    .filter((s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const exportToCSV = () => {
    const header = "Name,Category,Votes\n";
    const rows = filteredStartups.map(s => `${s.name},${s.category},${s.votes}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "startups.csv";
    link.click();
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-600 text-xl">{error}</p>
      </div>
    );
  }

  if (startups.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-xl animate-pulse">Fetching startups…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-2">
        🚀 ScaleScope – Startup Tracker
      </h1>
      <div className="text-center text-sm text-gray-600 mb-4">
        🔥 <span className="font-semibold">Trending:</span> {topTags.join(", ")}
      </div>

      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search startups..."
          className="px-4 py-2 border rounded-lg shadow-sm w-full max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex justify-center gap-2 mb-6 flex-wrap">
        <button
          className={`px-4 py-2 rounded-full border ${
            showFavorites ? "bg-blue-600 text-white" : "bg-white text-gray-700"
          } hover:shadow`}
          onClick={() => setShowFavorites(!showFavorites)}
        >
          {showFavorites ? "Show All" : "❤️ My Favorites"}
        </button>
        <button
          onClick={exportToCSV}
          className="px-4 py-2 rounded-full border bg-white text-gray-700 hover:shadow"
        >
          📥 Export Favorites to CSV
        </button>
      </div>

      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        {allCategories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full border ${
              selectedCategory === category
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700"
            } hover:shadow transition`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStartups.map((startup, idx) => (
          <StartupCard
            key={idx}
            startup={startup}
            maxVotes={maxVotes}
            isFavorite={favorites.some(f => f.name === startup.name)}
            toggleFavorite={() => toggleFavorite(startup)}
          />
        ))}
      </div>

      <p className="text-center text-xs text-gray-400 mt-8">
        Data from Product Hunt API • Updated Live
      </p>
    </div>
  );
}

export default App;
