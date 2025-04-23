import React from "react";

const StartupCard = ({ startup, maxVotes, isFavorite, toggleFavorite }) => {
  return (
    <div className="relative bg-white rounded-2xl shadow-md p-4 border hover:shadow-lg transition-transform hover:-translate-y-1 duration-300">
      <a
        href={startup.product_url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="flex items-center gap-4 mb-4">
          <img
            src={startup.logo_url}
            alt={startup.name}
            className="w-14 h-14 rounded-full object-cover border"
          />
          <div>
            <h2 className="text-xl font-semibold">{startup.name}</h2>
            <p className="text-sm text-gray-500">
              {startup.category}
              {startup.votes === maxVotes && (
                <span className="text-yellow-600 font-semibold ml-2">🌟 Top Voted</span>
              )}
            </p>
          </div>
        </div>
        <p className="text-gray-700 text-sm mb-2">{startup.tagline}</p>
        <div className="text-sm font-medium text-gray-600">
          🔥 {startup.votes} votes
        </div>
      </a>
      <button
        onClick={toggleFavorite}
        className={`absolute top-2 right-2 text-lg ${
          isFavorite ? "text-red-500" : "text-gray-400"
        } hover:scale-110 transition`}
        title={isFavorite ? "Remove from favorites" : "Save to favorites"}
      >
        {isFavorite ? "❤️" : "🤍"}
      </button>
    </div>
  );
};

export default StartupCard;
