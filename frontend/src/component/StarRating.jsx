import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { MdClear } from "react-icons/md"; // Clear icon

const StarRating = ({ recipeId, initialRating = 0, onRate, recipeName, recipeImage, disabled = false }) => {

    const [selectedRating, setSelectedRating] = useState(initialRating);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setSelectedRating(initialRating);
    }, [initialRating]);

    const handleStarClick = (rating) => {
        if (disabled) return;
        setSelectedRating(rating);
        onRate(recipeId, rating, recipeName, recipeImage);
        setIsOpen(false);
    };

    const handleClearRating = (e) => {
        e.stopPropagation();
        setSelectedRating(0);
        onRate(recipeId, 0, recipeName, recipeImage);
        setIsOpen(false);
    };

    return (
        <div
            className={`flex items-center gap-1 p-2 rounded-lg cursor-pointer ${disabled ? "opacity-70 cursor-not-allowed" : "bg-black"
                }`}
            onClick={(e) => {
                e.stopPropagation();
                if (!disabled) setIsOpen(true);
            }}
        >
            {isOpen ? (
                <>
                    {/* Clear/Reset Rating */}
                    <MdClear
                        title="Clear rating"
                        onClick={handleClearRating}
                        className="text-white hover:text-red-500 text-lg transition"
                    />
                    {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                            key={star}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleStarClick(star);
                            }}
                            className={`text-lg transition ${selectedRating >= star ? "text-yellow-400" : "text-gray-400"
                                } hover:text-yellow-500`}
                        />
                    ))}
                </>
            ) : (
                <>
                    <span className="text-white">
                        {selectedRating > 0 && selectedRating}
                    </span>
                    <FaStar
                        className={`text-lg ${selectedRating > 0 ? "text-yellow-400" : "text-gray-400"}
                        hover:text-yellow-500 transition }` }
                    />
                </>
            )}
        </div>
    );
};

export default StarRating;
