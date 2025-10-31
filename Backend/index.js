import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/database.js";
import userRoute from "./routes/userRoute.js";
import cookieParser from "cookie-parser";
import Groq from "groq-sdk";
import helmet from "helmet";
import axios from "axios";
import recipeRoute from "./routes/recipeRoute.js";
import chatRoute from "./routes/chatRoute.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

// ========= Middleware ========= //
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

// ========= CORS setup ========= //
const corsOptions = {
    origin: "https://recipe-backend-gd16.onrender.com",
    credentials: true,
};
app.use(cors(corsOptions));

// =====CHatbot Route ====== //
app.use("/api", chatRoute);

// ========= Recipe Save Route ========= //
app.use("/api/recipes", recipeRoute);


// ========= User Routes ========= //
app.use("/api/v1/user", userRoute);



// ========= Recipe Search Route ========= //
app.get("/recipesearch", async (req, res) => {
    const { ingredients = "", cuisine = "", diet = "", type = "", maxReadyTime = "" } = req.query;

    console.log("Query received:", req.query);
    console.log("Spoonacular API Key:", process.env.SPOONACULAR_API_KEY ? "exists" : "missing");

    if (!ingredients.trim()) {
        return res.status(400).json({ error: "Ingredients are required" });
    }

    try {
        const response = await axios.get(
            "https://api.spoonacular.com/recipes/complexSearch",
            {
                params: {
                    apiKey: process.env.SPOONACULAR_API_KEY,
                    includeIngredients: ingredients.trim(),
                    cuisine: cuisine?.trim() || undefined,
                    diet: diet?.trim() || undefined,
                    type: type?.trim() || undefined,
                    maxReadyTime: maxReadyTime?.trim() || undefined,
                    number: 5, // Limit to 4 recipes
                    addRecipeInformation: true,
                },
            }
        );

        // Safely check if response.data.results exists
        const results = Array.isArray(response.data.results)
            ? response.data.results.map((r) => ({
                id: r.id,
                title: r.title || "Untitled Recipe",
                image: r.image || "/images/default-recipe.jpg",
            }))
            : [];

        console.log(`Recipes fetched: ${results.length}`);
        res.json({ recipes: results });
    } catch (error) {
        // More detailed error logging
        if (error.response) {
            console.error("Spoonacular API Error:", error.response.data);
        } else {
            console.error("Recipe Search Error:", error.message);
        }

        res.status(500).json({
            error: "Failed to fetch recipes. Please check Spoonacular API key or try again later.",
        });
    }
});

// ========= Recipe Generator Route ========= //
app.get("/recipestream", async (req, res) => {
    const { ingredients, mealType, cuisine, cookingTime, complexity, name } = req.query;

    let prompt = [];

    // 🧠 If recipe name is provided, generate based on name only
    if (name && name.trim()) {
        prompt = [
            `Generate a detailed recipe for "${name}" but as short as possible`,
            "Include the following sections:",
            "- Recipe Name",
            "- Short Description",
            "- Ingredients List",
            "- Cooking Time",
            "- Servings",
            "- Preparation Steps",
            "- Cooking Steps (at least 200 words)",
            "- Nutritional Info (Calories, Protein, Carbs, Fat, Fiber)",
            "- If no authentic recipe is found, say: No authentic recipe found.",
        ];
    }
    // 🍳 Else, use ingredient-based generation
    else if (ingredients && ingredients.trim()) {
        prompt = [
            "Generate a recipe that incorporates the following details:",
            `[Ingredients: ${ingredients}]`,
            `[Meal type: ${mealType || "any"}]`,
            `[Cuisine preference: ${cuisine || "Indian"}]`,
            `[Cooking time: ${cookingTime || "least possible"}]`,
            `[Complexity: ${complexity || "easy"}]`,
            "Provide:- Recipe Name- Short Description- Ingredients (only from provided list)- Cooking Time- Servings- Preparation Steps- Cooking Steps, at least 200 words",
            
            "- If no authentic recipe is possible, say: No authentic recipe found with the given inputs."
        ];

    }
    // ❌ Neither name nor ingredients sent
    else {
        return res.status(400).json({ error: "Either recipe name or ingredients are required" });
    }

    const messages = [
        { role: "system", content: "You are a helpful chef assistant." },
        { role: "user", content: prompt.join("\n") },
    ];

    try {
        const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const aiModel = "llama-3.3-70b-versatile";

        const completion = await client.chat.completions.create({
            model: aiModel,
            messages,
            stream: true,
        });

        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.flushHeaders?.();

        for await (const chunk of completion) {
            if (chunk.choices[0]?.delta?.content) {
                res.write(
                    `data: ${JSON.stringify({ action: "chunk", chunk: chunk.choices[0].delta.content })}\n\n`
                );
            }
            if (chunk.choices[0]?.finish_reason === "stop") {
                res.write(`data: ${JSON.stringify({ action: "close" })}\n\n`);
                res.end();
            }
        }
    } catch (err) {
        console.error("Groq API Error:", err);
        res.write(`data: ${JSON.stringify({ action: "error", error: err.message })}\n\n`);
        res.end();
    }

    req.on("close", () => res.end());
});


//====== Nutrition Analysis Route ======//

app.post("/nutrition", async (req, res) => {
    let { recipeContent } = req.body;

    if (!recipeContent || typeof recipeContent !== "string" || recipeContent.trim() === "") {
        return res.status(400).json({ error: "Recipe content is required" });
    }

    try {
        const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const aiModel = "llama-3.3-70b-versatile";

        const prompt = [
            "You are a nutrition expert.",
            `Given the following recipe, extract the list of ingredients and provide nutrition information (calories, protein, carbs, fat) for 1 serving:`,
            `"${recipeContent}"`,
            "Return a JSON object ONLY in this format, no extra text:",
            `{
        "totals": { "calories": 0, "protein": 0, "carbs": 0, "fat": 0 },
        "breakdown": [
        { "ingredient": "example", "calories": 0, "protein": 0, "carbs": 0, "fat": 0 }
        ]
    }`
        ];

        const messages = [
            { role: "system", content: "You are a helpful nutrition assistant." },
            { role: "user", content: prompt.join("\n") },
        ];

        const completion = await client.chat.completions.create({
            model: aiModel,
            messages,
            stream: false,
        });

        const aiResponse = completion.choices[0]?.message?.content || "";

        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.error("No JSON found in AI response:", aiResponse);
            return res.status(500).json({ error: "Failed to parse nutrition data from AI" });
        }

        let nutritionData;
        try {
            nutritionData = JSON.parse(jsonMatch[0]);
        } catch (err) {
            console.error("Error parsing JSON:", err, "AI Response:", aiResponse);
            return res.status(500).json({ error: "Failed to parse nutrition data from AI" });
        }

        res.json(nutritionData);
    } catch (err) {
        console.error("Groq nutrition fetch error:", err);
        res.status(500).json({ error: "Failed to fetch nutrition from Groq" });
    }
});


// ========= Start Server ========= //
app.listen(PORT, async () => {
    try {
        await connectDB();
        console.log(`✅ Server is running on port ${PORT}`);
    } catch (err) {
        console.error("❌ Database connection failed:", err);
        process.exit(1);
    }
});



