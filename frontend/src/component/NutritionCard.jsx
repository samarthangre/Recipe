import React from "react";
// import { useNavigate } from "react-router-dom";

const NutritionCard = ({ data }) => {
    // const navigate = useNavigate();

    if (!data) return <p>Loading...</p>;
    if (data.error) return <p className="text-red-500">{data.error}</p>;

    

    return (
        <div className="mt-4 bg-gray-100 text-black p-4 rounded-lg w-full shadow-md ">
            <h2 className="font-bold text-lg mb-2">Nutrition Info</h2>
            <ul className="space-y-1">
                <li>Calories: {data.totals.calories}</li>
                <li>Protein: {data.totals.protein} g</li>
                <li>Carbs: {data.totals.carbs} g</li>
                <li>Fat: {data.totals.fat} g</li>
            </ul>

            {data.breakdown && (
                <div className="mt-4">
                    <h3 className="font-semibold mb-2">Per Ingredient:</h3>
                    <ul className="space-y-1">
                        {data.breakdown.map((item, idx) => (
                            <li key={idx}>
                                {item.ingredient}: {item.calories} cal, {item.protein}g protein, {item.carbs}g carbs, {item.fat}g fat
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            
        </div>
    );
};

export default NutritionCard;
