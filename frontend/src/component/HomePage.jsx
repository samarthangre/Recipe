import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { FaUserCircle, FaRobot } from "react-icons/fa";
import { FaBookmark, FaShareAlt, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import NutritionCard from "./NutritionCard.jsx";
import Chatbot from "./Chatbot.jsx";

function HomePage() {
    const [ingredients, setIngredients] = useState("");
    const [recipes, setRecipes] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState(null);
    const [nutritionData, setNutritionData] = useState(null);
    const [selectedFilterOption, setSelectedFilterOption] = useState({
        Cuisine: "",
        Mealtype: "",
        Recipetime: "",
        Diet: "",
        Rating: "",
    });
    const [showNutrition, setShowNutrition] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);

    const filterOptions = {
        Cuisine: ["Indian", "Italian", "Chinese", "Mexican"],
        Mealtype: ["Breakfast", "Lunch", "Dinner", "Snack"],
        Recipetime: ["<30 min", "30-60 min", ">60 min"],
        Diet: ["Vegan", "Vegetarian", "Non-Veg", "Keto"],
        Rating: ["⭐ 1+", "⭐ 2+", "⭐ 3+", "⭐ 4+", "⭐ 5"],
    };



    const fetchNutrition = async (ingredients) => {
        try {
            console.log("Fetching nutrition for ingredients:", ingredients);

            const res = await fetch("http://localhost:5000/nutrition", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ingredients }),
            });

            const data = await res.json();
            console.log("Nutrition response:", data);
            setNutritionData(data);
        } catch (err) {
            console.error("❌ Nutrition fetch error:", err);
        }
    };


    // ===== Fetch recipes list =====
    const handleGenerate = async () => {
        const trimmedIngredients = ingredients.trim();
        if (!trimmedIngredients) return;

        let maxReadyTime = "";
        switch (selectedFilterOption.Recipetime) {
            case "<30 min": maxReadyTime = "30"; break;
            case "30-60 min": maxReadyTime = "60"; break;
            case ">60 min": maxReadyTime = "180"; break;
            default: maxReadyTime = "";
        }

        try {
            setLoading(true);

            const params = new URLSearchParams({
                ingredients: trimmedIngredients.split(",").map(i => i.trim()).join("\n") // ✅ use input ingredients directly
            });

            if (selectedFilterOption.Cuisine) params.append("cuisine", selectedFilterOption.Cuisine.trim());
            if (selectedFilterOption.Diet) params.append("diet", selectedFilterOption.Diet.trim());
            if (selectedFilterOption.Mealtype) params.append("type", selectedFilterOption.Mealtype.trim());
            if (maxReadyTime) params.append("maxReadyTime", maxReadyTime);

            const res = await fetch(`http://localhost:5000/recipesearch?${params.toString()}`);
            const data = await res.json();

            if (data.recipes) {
                setRecipes(data.recipes.map(r => ({
                    id: r.id,
                    name: r.title,
                    ingredientsList: trimmedIngredients.split(",").map(i => i.trim()), // ✅ store as array
                    image: r.image,
                    orderLink: `https://www.zomato.com/search?q=${encodeURIComponent(r.title)}`, // Zomato search link
                    videoLink: `https://www.youtube.com/results?search_query=${encodeURIComponent(r.title + " recipe")}` // YouTube search
                })));
            } else {
                setRecipes([]);
            }
        } catch (err) {
            console.error("Error fetching recipes:", err);
            setRecipes([]);
        } finally {
            setLoading(false);
        }
    };

    // ===== Save recipe =====
    const saveRecipe = async (recipe) => {
        const token = localStorage.getItem("token"); // or your auth token
        const response = await fetch("http://localhost:5000/api/recipes/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                recipeId: recipe.id,
                name: recipe.name,
                image: recipe.image,
            }),
        });

        const data = await response.json();
        if (response.ok) {
            alert("Recipe saved!");
        } else {
            alert(data.message);
        }
    };

    // ===== Fetch full recipe =====
    const fetchFullRecipe = async (recipe) => {
        setSelectedRecipe({
            name: recipe.name, content: "", ingredientsList: recipe.ingredientsList, videoLink: recipe.videoLink,
            orderLink: recipe.orderLink
        });
        setLoading(true);

        try {
            const params = new URLSearchParams({
                ingredients: recipe.ingredientsList.join("\n"),
                mealType: selectedFilterOption.Mealtype || "dinner",
                cuisine: selectedFilterOption.Cuisine || "any",
                diet: selectedFilterOption.Diet || "balanced",
                cookingTime: selectedFilterOption.Recipetime || "30 minutes",
                complexity: "easy",
            });

            const response = await fetch(
                `http://localhost:5000/recipestream?${params}`,
                { method: "GET" }
            );

            if (!response.ok || !response.body)
                throw new Error("Failed to fetch recipe");

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

    return (
        <div className="min-h-screen bg-black text-white p-6 relative">

            <div className={activeFilter ? "filter blur-sm" : ""}>
                {/* Navbar & Search */}
                <div className="flex items-center p-3 rounded-3xl max-w-8xl mx-auto pt-5">
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
                    </div>

                    <div className="flex items-center flex-grow mx-6 bg-slate-200 rounded-3xl rounded-tl-none rounded-br-none px-4 py-2">
                        <FiSearch className="text-gray-500 text-xl" />
                        <input
                            type="text"
                            placeholder="Search ingredients..."
                            value={ingredients}
                            onChange={(e) => setIngredients(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleGenerate();
                            }}
                            className="bg-transparent outline-none px-3 text-black w-full"
                        />
                        <button
                            onClick={handleGenerate}
                            className="ml-2 bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition"
                        >
                            Generate
                        </button>
                    </div>

                    <div className="flex gap-4 text-4xl text-white flex-shrink-0">
                        <Link to="/profilePage">
                            <FaUserCircle className="cursor-pointer hover:text-orange-500" />
                        </Link>
                        {/* ✅ Use FaRobot to toggle chatbot */}
                        <FaRobot
                            className="cursor-pointer hover:text-orange-500"
                            onClick={() => setIsChatOpen(true)}
                        />
                    </div>
                </div>

                {/* Filters */}
                <div className="flex justify-center gap-6 mt-8 flex-wrap">
                    {Object.keys(filterOptions).map((btn, idx) => (
                        <button
                            key={idx}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-xl text-lg transition-transform transform hover:scale-105"
                            onClick={() => setActiveFilter(btn)}
                        >
                            {btn} {selectedFilterOption[btn] && `: ${selectedFilterOption[btn]}`}
                        </button>
                    ))}
                </div>

                {/* Recipes Grid */}
                {recipes.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10 max-w-6xl mx-auto">
                        {recipes.map((recipe) => (
                            <div
                                key={recipe.id}
                                onClick={() => fetchFullRecipe(recipe)}
                                className="cursor-pointer rounded-lg overflow-hidden shadow-lg hover:scale-105 transform transition duration-300 flex flex-col"
                                style={{ height: "300px" }} // you can adjust this if needed
                            >
                                {/* Image */}
                                <div className="w-full h-40 overflow-hidden flex-shrink-0 relative">
                                    {/* Save button at top-right */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            saveRecipe(recipe);
                                        }}
                                        className="absolute top-2 right-2 flex items-center justify-center text-white bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-80 transition"
                                    >
                                        <FaBookmark />
                                    </button>
                                    {/* Recipe image */}
                                    <img
                                        alt={recipe.name}
                                        src={recipe.image}
                                        className="w-full h-full object-cover"
                                    />
                                </div>


                                {/* Content */}
                                <div className="flex flex-col bg-gray-800 p-4 flex-grow gap-0">
                                    {/* Recipe Name */}
                                    <div className="text-center">
                                        <h2 className="text-lg font-bold text-white truncate">
                                            {recipe.name}
                                        </h2>
                                    </div>

                                    {/* Actions at the bottom */}
                                    <div className="flex justify-between mt-auto text-xl text-yellow-500">


                                        {/* Share */}
                                        <button className="flex items-center gap-1 hover:text-white transition  bg-black p-2 rounded-lg">
                                            <FaShareAlt />
                                        </button>

                                        {/* Rate */}
                                        <button className="flex items-center gap-1 hover:text-white transition  bg-black p-2 rounded-lg">
                                            <FaStar />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                ) : (
                    <div className="mt-10 space-y-10">
                        {/* Placeholder scrolling images */}
                        <div className="overflow-hidden relative max-w-6xl mx-auto h-60 md:h-64 my-6">
                            <div className="flex whitespace-nowrap animate-scroll-left">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                    <img
                                        key={i}
                                        src={`/images/recipe${i}.jpg`}
                                        alt={`Recipe ${i}`}
                                        className="h-56 w-56 md:h-64 md:w-64 object-cover rounded-xl shadow-lg inline-block mr-6"
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="text-yellow-200 text-4xl text-center font-abril font-bold">
                            Adventure of Delicacies
                        </div>
                        <div className="overflow-hidden relative max-w-6xl mx-auto h-60 md:h-64 my-6">
                            <div className="flex whitespace-nowrap animate-scroll-right">
                                {[9, 10, 11, 12, 13, 14, 15, 16].map((i) => (
                                    <img
                                        key={`right-${i}`}
                                        src={`/images/recipe${i}.jpg`}
                                        alt={`Recipe ${i}`}
                                        className="h-56 w-56 md:h-64 md:w-64 object-cover rounded-xl shadow-lg inline-block mr-6"
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="text-yellow-100 text-2xl text-center font-pacifo pt-3">
                            Unlock the world of culinary recipes and unleash your inner chef
                            the easy way with Flavoriz.
                        </div>
                    </div>
                )}
            </div>


            {/* Full Recipe Modal */}
            {selectedRecipe && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
                    <div className="bg-white text-black rounded-2xl shadow-lg max-w-2xl w-full p-6 pr-8 overflow-y-auto max-h-[80vh]">

                        <h2 className="text-2xl font-bold mb-4">{selectedRecipe.name}</h2>

                        {loading ? (
                            <p className="text-gray-500">⏳ Generating recipe...</p>
                        ) : selectedRecipe.content ? (
                            <>
                                {/* YouTube Link below recipe content */}
                                {selectedRecipe.videoLink && (
                                    <a
                                        href={selectedRecipe.videoLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-red-500 underline mt-4 inline-block"
                                    >
                                        Watch Recipe Video
                                    </a>
                                )}

                                <p className="whitespace-pre-line text-gray-700">{selectedRecipe.content}</p>

                                {/* Zomato Link at the bottom before buttons */}
                                {selectedRecipe.orderLink && (
                                    <div className=" p-2 gap-2 justify-between flex">
                                        <a
                                            href={selectedRecipe.orderLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-red-500 underline mt-4 inline-block"
                                        >
                                            Buy Now
                                        </a>
                    
                                        <a
                                            href="https://blinkit.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-red-500 underline mt-4 inline-block"
                                        >
                                            Buy missing ingredients
                                        </a>
                                    </div>
                                    )}
                </>
                        ) : (
                            <p className="text-gray-400">No recipe generated yet.</p>
                        )}

                        {/* Nutrition Card */}
                        {showNutrition && nutritionData && (
                            <div className="mt-4 w-full">
                                <NutritionCard data={nutritionData} />
                            </div>
                        )}

                        {/* Buttons */}
                        {!loading && (
                            <div className="flex justify-between gap-2 mt-6">
                                <button
                                    onClick={async () => {
                                        if (!showNutrition) {
                                            await fetchNutrition(selectedRecipe.ingredientsList);
                                        }
                                        setShowNutrition(!showNutrition);
                                    }}
                                    className="bg-yellow-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-yellow-600 transition flex-1"
                                >
                                    {showNutrition ? "Hide Nutrition" : "Show Nutrition"}
                                </button>

                                <button
                                    onClick={() => {
                                        setSelectedRecipe(null);
                                        setShowNutrition(false);
                                        setNutritionData(null);
                                    }}
                                    className="bg-yellow-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-yellow-600 transition flex-1"
                                >
                                    Back
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}





            {/* Cooking Tips Section */}
            <div className="mt-16 max-w-3xl mx-auto bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-yellow-400 mb-4 text-center">
                    🍳 Cooking Tips
                </h2>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li>Always taste your food while cooking and adjust seasonings accordingly.</li>
                    <li>Prep all ingredients before you start cooking for better results.</li>
                    <li>Fresh herbs should be added at the end of cooking for maximum flavor.</li>
                </ul>
            </div>

            {/* Filter Overlay */}
            {activeFilter && (
                <div className="fixed inset-0 z-50 flex justify-center items-start pt-40">
                    <div className="bg-white text-black p-6 rounded-xl shadow-lg">
                        <h3 className="text-xl font-bold mb-4">{activeFilter} Options</h3>
                        <div className="flex flex-col gap-3">
                            {filterOptions[activeFilter].map((option) => (
                                <button
                                    key={option}
                                    onClick={() => {
                                        setSelectedFilterOption((prev) => ({
                                            ...prev,
                                            [activeFilter]: option,
                                        }));
                                        setActiveFilter(null);
                                    }}
                                    className="py-2 px-4 rounded-lg hover:bg-orange-500 hover:text-white transition"
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setActiveFilter(null)}
                            className="mt-4 text-red-500 hover:underline"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}




            {/* ✅ Chatbot Window (modal style) */}
            {isChatOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="relative w-full max-w-lg">
                        <Chatbot onClose={() => setIsChatOpen(false)} />
                    </div>
                </div>
            )}


        </div>
    );
}

export default HomePage;
