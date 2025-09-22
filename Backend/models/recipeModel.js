import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
    recipeId: {
        type: String,
        required: true,
        unique: true,
    },
    name: String,
    image: String,
    content: String,
    ingredientsList: [String],
    videoLink: String,
    orderLink: String,
    cuisine: String,
    mealType: String,
    diet: String,
    cookingTime: String,
    complexity: String,
}, { timestamps: true });

const Recipe = mongoose.model("Recipe", recipeSchema);
export default Recipe;
