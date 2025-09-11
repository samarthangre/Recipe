import express from "express";
import { User } from "../models/userModel.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

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

export default router;
