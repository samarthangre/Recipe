import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const SharedRecipePage = () => {
    const { recipeId } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const res = await fetch(
                    `http://localhost:8080/api/recipes/share/${recipeId}`
                );

                if (!res.ok) {
                    throw new Error("Recipe not found");
                }
                const data = await res.json();
                setRecipe(data.recipe);
            } catch (error) {
                console.error("Error fetching recipe:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [recipeId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-white">
                Loading recipe...
            </div>
        );
    }

    if (!recipe) {
        return (
            <div className="flex justify-center items-center h-screen text-red-500">
                ❌ Recipe not found
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
            <h1 className="text-3xl font-bold mb-4">{recipe.name}</h1>
            <img
                src={recipe.image}
                alt={recipe.name}
                className="w-96 h-96 object-cover rounded-lg shadow-lg mb-6"
            />
            <p className="text-lg">✨ Saved recipe that was shared with you!</p>
        </div>
    );
};

export default SharedRecipePage;