import mongoose from 'mongoose';

const savedRecipeSchema = new mongoose.Schema({
    recipeId: String,
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
    nutrition: {
        calories: String,
        protein: String,
        fat: String,
        carbs: String,
    }
});

const userModel = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    savedRecipes: [savedRecipeSchema]
},{timestamps: true});

export const User = mongoose.model('User', userModel);