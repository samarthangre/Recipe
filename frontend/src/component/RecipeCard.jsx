import React from "react";
import { FaBookmark } from "react-icons/fa";

const RecipeCard = ({
  recipes,
  savedRecipes,
  onCardClick,
  onSaveClick,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10 max-w-6xl mx-auto">
      {recipes.map((recipe) => (
        <div
          key={recipe.id}
          onClick={() => onCardClick(recipe)}
          className="cursor-pointer rounded-lg overflow-hidden shadow-lg hover:scale-105 transform transition duration-300 flex flex-col"
          style={{ height: "300px" }}
        >
          {/* Image & Save */}
          <div className="w-full h-40 overflow-hidden flex-shrink-0 relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSaveClick(recipe);
              }}
              className="absolute top-2 right-2 flex items-center justify-center text-white bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-80 transition"
            >
              {savedRecipes.has(recipe.id) ? (
                <FaBookmark className="text-yellow-400" />
              ) : (
                <FaBookmark className="text-white" />
              )}
            </button>

            <img
              alt={recipe.name}
              src={recipe.image}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col bg-gray-800 p-4 flex-grow gap-0">
            <div className="text-center">
              <h2
                className="text-lg font-bold text-white truncate underline hover:text-yellow-300 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onCardClick(recipe);
                }}
              >
                {recipe.name}
              </h2>

            </div>

          </div>
        </div>
      ))}
    </div>
  );
};

export default RecipeCard;
