import express from "express";
import { User } from "../models/userModel.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import Rating from "../models/ratingModel.js"; // ✅ import the model

const router = express.Router();

// Save a recipe for a logged-in user
router.post("/save", isAuthenticated, async (req, res) => {
    try {
        const { recipeId, name, image } = req.body;
        const userId = req.id; // req.id set by isAuthenticated

        if (!recipeId || !name || !image) {
            return res.status(400).json({ message: "RecipeId, name, and image are required." });
        }

        // Find user
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found." });

        // Check if recipe is already saved
        const alreadySaved = user.savedRecipes.some(r => r.recipeId === recipeId);
        if (alreadySaved) {
            return res.status(400).json({ message: "Recipe already saved." });
        }

        // Save recipe
        user.savedRecipes.push({ recipeId, name, image });
        await user.save();

        res.status(200).json({
            message: "Recipe saved successfully.",
            savedRecipes: user.savedRecipes
        });
    } catch (error) {
        console.error("Error saving recipe:", error);
        res.status(500).json({ message: "Server error while saving recipe." });
    }
});

// Unsave a recipe for a logged-in user
router.post("/unsave", isAuthenticated, async (req, res) => {
    const { recipeId } = req.body;
    const userId = req.id; // req.id is set by isAuthenticated middleware

    if (!recipeId) {
        return res.status(400).json({ message: "Recipe ID is required." });
    }

    try {
        await User.findByIdAndUpdate(userId, {
            $pull: { savedRecipes: { recipeId: recipeId } }
        });

        return res.status(200).json({ message: "Recipe unsaved successfully." });
    } catch (error) {
        console.error("Unsave recipe error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
});



// Get all saved recipes for logged-in user
router.get("/saved", isAuthenticated, async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: "User not found." });

        res.status(200).json({ savedRecipes: user.savedRecipes });
    } catch (error) {
        console.error("Error fetching saved recipes:", error);
        res.status(500).json({ message: "Server error while fetching recipes." });
    }
});


router.get("/share/:recipeId", async (req, res) => {
    try {
        const { recipeId } = req.params;

        // Find a user who has saved this recipe
        const user = await User.findOne({ "savedRecipes.recipeId": recipeId });
        if (!user) {
            return res.status(404).json({ message: "Recipe not found." });
        }

        // Extract the recipe details
        const recipe = user.savedRecipes.find(r => r.recipeId === recipeId);

        res.status(200).json({ recipe });
    } catch (error) {
        console.error("Error sharing recipe:", error);
        res.status(500).json({ message: "Server error while sharing recipe." });
    }
});






// Rate a recipe
router.post("/rate", isAuthenticated, async (req, res) => {
    const { recipeId, rating } = req.body;
    const userId = req.id; // comes from your isAuthenticated middleware

    if (!userId || !recipeId || rating == null) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        // Upsert: update if exists, insert if not
        await Rating.findOneAndUpdate(
            { userId, recipeId },
            { rating },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return res.status(200).json({ message: "Rating saved!" });
    } catch (err) {
        console.error("Rating error:", err);
        return res.status(500).json({ message: "Server error" });
    }
});




export default router;
