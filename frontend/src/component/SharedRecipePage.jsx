import React, { useEffect, useState } from "react";

function SharedRecipePage() {
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get the encoded data from URL hash
    const hash = window.location.hash.substring(1); // Remove '#'

    if (!hash) {
      setError("No recipe data found.");
      return;
    }

    try {
      // Decode base64 and parse JSON
      const decoded = atob(hash);
      const recipeData = JSON.parse(decoded);
      setRecipe(recipeData);
    } catch (err) {
      setError("Failed to decode recipe data.");
    }
  }, []);

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  if (!recipe) {
    return <div className="p-6">Loading recipe...</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{recipe.name}</h1>
      {recipe.image && <img src={recipe.image} alt={recipe.name} className="mb-4 rounded" />}
      <p className="whitespace-pre-line mb-4">{recipe.content}</p>
      {recipe.videoLink && (
        <p>
          Video:{" "}
          <a href={recipe.videoLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            Watch here
          </a>
        </p>
      )}
      {recipe.orderLink && (
        <p>
          Order Ingredients:{" "}
          <a href={recipe.orderLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            Click here
          </a>
        </p>
      )}
    </div>
  );
}

export default SharedRecipePage;
