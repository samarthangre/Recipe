import express from "express";
import Groq from "groq-sdk";

const router = express.Router();

router.post("/chat", async (req, res) => {
    try {
        const { history } = req.body;

        if (!history || !Array.isArray(history)) {
            return res.status(400).json({ error: "Chat history is required" });
        }

        const client = new Groq({ apiKey: process.env.GROQ_API_KEY }); // ✅ moved inside handler


        const response = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `You are a smart assistant. Answer **only using the data provided in the chat history** (recipes, ingredients, nutrition info). 
Do not make up answers.If hi or hello is said- reply using a good welcome line  . If the question cannot be answered using the given data and  give contact information, reply: "❌ I can only answer questions related to dumbchef. For further help kindly contact -." 
.Keep your answers as short and concise (1–2 sentences).`
                },
                ...history
            ],
        });


        const reply =
            response.choices[0]?.message?.content?.trim() || "⚠️ No response";

        res.json({ reply });
    } catch (err) {
        console.error("Groq Chat Error:", err);
        res.status(500).json({ error: "Failed to fetch response from Groq" });
    }
});

export default router;
