import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import RecipeCard from "./RecipeCard";

function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [savedRecipeSet, setSavedRecipeSet] = useState(new Set());
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSavedRecipes, setShowSavedRecipes] = useState(false);
  const [myRatings, setMyRatings] = useState([]);
  const [showMyRatings, setShowMyRatings] = useState(false);
  const [loadingRatings, setLoadingRatings] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (!storedUser || !storedToken) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [navigate]);

  // Fetch user's saved recipes
  const fetchSavedRecipes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/recipes/saved", {
        withCredentials: true,
      });

      const recipes = response.data.savedRecipes || [];
      setSavedRecipes(recipes);
      setSavedRecipeSet(new Set(recipes.map((r) => r.recipeId)));
      setShowSavedRecipes(true);
    } catch (error) {
      console.error("Failed to fetch saved recipes:", error);
    }
  };

  const toggleSaveRecipe = async (recipe) => {
    const isAlreadySaved = savedRecipeSet.has(recipe.id);

    const url = isAlreadySaved
      ? "http://localhost:5000/api/recipes/unsave"
      : "http://localhost:5000/api/recipes/save";

    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipeId: recipe.id,
        name: recipe.name,
        image: recipe.image,
      }),
    });

    if (response.ok) {
      const updated = new Set(savedRecipeSet);
      if (isAlreadySaved) {
        updated.delete(recipe.id);
      } else {
        updated.add(recipe.id);
      }
      setSavedRecipeSet(updated);
    }
  };

  // fetch recipe
  const fetchFullRecipe = async (recipe) => {
  setSelectedRecipe({
    name: recipe.name,
    content: "",
    videoLink: recipe.videoLink || `https://www.youtube.com/results?search_query=${encodeURIComponent(recipe.name + " recipe")}`,
    orderLink: recipe.orderLink || `https://www.zomato.com/search?q=${encodeURIComponent(recipe.name)}`
  });

  setLoading(true);

  try {
    const params = new URLSearchParams({ name: recipe.name });

    const response = await fetch(`http://localhost:5000/recipestream?${params.toString()}`);

    if (!response.ok || !response.body) throw new Error("Failed to fetch recipe");

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let fullContent = "";

    const processLine = (line) => {
      if (line.startsWith("data:")) {
        try {
          const data = JSON.parse(line.replace("data:", "").trim());
          if (data.action === "chunk" && data.chunk) {
            fullContent += data.chunk;
            setSelectedRecipe((prev) => ({
              ...prev,
              content: fullContent,
            }));
          }
          if (data.action === "close") setLoading(false);
        } catch (err) {
          console.error("Error parsing line:", line, err);
        }
      }
    };

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true }).trim().split("\n\n");
      chunk.forEach(processLine);
    }
  } catch (err) {
    console.error("Fetch recipe error:", err);
    setSelectedRecipe((prev) => ({
      ...prev,
      content: "⚠️ Failed to generate recipe. Please try again.",
    }));
  } finally {
    setLoading(false);
  }
};


  // Fetch user's ratings
  const handleMyRatings = async () => {
    setShowSavedRecipes(false); // hide saved recipes section
    setShowMyRatings(true); // show ratings section
    setLoadingRatings(true);

    try {
      const response = await axios.get("http://localhost:5000/api/recipes/userratings", {
        withCredentials: true,
      });

      setMyRatings(response.data.ratedRecipes || []);
    } catch (error) {
      console.error("Failed to fetch user ratings:", error);
    } finally {
      setLoadingRatings(false);
    }
  };
  

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="w-64 bg-orange-500 text-white flex flex-col items-center py-6">
        <div className="flex flex-col items-center mb-10 text-black">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-black text-3xl mb-2">
            {user.username ? user.username[0].toUpperCase() : "U"}
          </div>
          <span className="text-lg font-semibold">{user.username}</span>
        </div>

        <div className="flex flex-col justify-between h-full w-full p-5">
          <div className="flex flex-col gap-6 text-center">
            <button className="py-2 bg-slate-300 w-full text-black">My Info</button>
            <button
              onClick={fetchSavedRecipes}
              className="py-2 bg-slate-300 w-full text-black"
            >
              Saved Recipes
            </button>

            <button
              onClick={handleMyRatings}
              className="py-2 bg-slate-300 w-full text-black">My Ratings</button>

            <button className="py-2 bg-slate-300 w-full text-black">Settings</button>

            <button onClick={() => navigate("/HomePage")} className="py-2 bg-slate-300 w-full text-black">Home</button>
          </div>

          <div className="text-center">
            <button
              onClick={handleLogout}
              className="py-2 bg-slate-300 w-full text-black"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-4">Welcome, {user.username}</h1>
        <p>👤 {user.fullName}</p>
        <p>📧 {user.email}</p>

        {showSavedRecipes && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">Saved Recipes</h2>
            {savedRecipes.length === 0 ? (
              <p>No saved recipes found.</p>
            ) : (
              <RecipeCard
                recipes={savedRecipes.map((r) => ({
                  ...r,
                  id: r.recipeId, // normalize
                }))}
                savedRecipes={savedRecipeSet}
                onCardClick={fetchFullRecipe}
                onSaveClick={toggleSaveRecipe}
              />
            )}
          </div>
        )}

        {showMyRatings && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">My Ratings</h2>
            {loadingRatings ? (
              <p>Loading your ratings...</p>
            ) : myRatings.length === 0 ? (
              <p>You haven't rated any recipes yet.</p>
            ) : (
              <ul>
                {myRatings.map(({ recipeId, rating, name, image }) => (
                  <li key={recipeId} className="flex items-center mb-3 gap-3">
                    <img
                      src={image || "/default-recipe.jpg"}
                      alt={name || "Recipe"}
                      width={50}
                      height={50}
                      className="rounded-md"
                    />
                    <span>{name || "Recipe Name"}</span>
                    <span className="ml-auto font-semibold">{rating} ⭐</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

      </div>

      {/* Full Recipe Modal (same as HomePage, or extract to <FullRecipeModal />) */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white text-black rounded-2xl shadow-lg max-w-2xl w-full p-6 pr-8 overflow-y-auto max-h-[80vh]">
            <h2 className="text-2xl font-bold mb-4">{selectedRecipe.name}</h2>
            {loading ? (
              <p className="text-gray-500">⏳ Generating recipe...</p>
            ) : (
              <p className="whitespace-pre-line text-gray-700">{selectedRecipe.content}</p>
            )}


            <button
              onClick={() => setSelectedRecipe(null)}
              className="mt-4 bg-yellow-500 px-4 py-2 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
