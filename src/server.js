import express from "express";
import { ENV } from "./config/env.js";
import { db } from "./config/db.js";
import { favoritesTable } from "./db/schema.js";
import { and, eq } from "drizzle-orm";


const app = express();
const PORT = ENV.PORT || 5000;

app.use(express.json());

app.get("/api/health", (req, res) => {
    res.status(200).json({ success: true })
})
// Add Data
app.post("/api/favorites", async (req,res) => {
    try {
        const { userId, recipeId, title, image, cookTime, servings } = req.body;

        if (!userId || !recipeId || !title) {
            return res.status(400).json({error: "Missing required fields"});
        }
        const newFavorite = await db.insert(favoritesTable).values({
            userId,
            recipeId,
            title,
            image,
            cookTime,
            servings,
        }).returning();
        res.status(201).json(newFavorite[0]);
        
    } catch (error) {
        console.log("Error adding favorite", error);
        res.status(500).json({error: "Error went wrong"}); 
    }
})

// Get Data
app.get("/api/favorites/:userId", async (req,res) => {
    try {
        const {userId} = req.params;
        const userFovorites = await db.select().from(favoritesTable).where(eq(favoritesTable.userId,userId));
        res.status(200).json(userFovorites);
    } catch (error) {
        console.log("Error fetching favorite", error);
        res.status(500).json({error: "Error went wrong"}); 
    }
})

// Delete Data
app.delete("/api/favorites/:userId/:recipeId", async (req,res) => {
    try {
        const {userId,recipeId} = req.params;
        await db.delete(favoritesTable).where(
            and(eq(favoritesTable.userId,userId),eq(favoritesTable.recipeId,parseInt(recipeId)))
        );
        res.status(200).json({message:"Favorite Removed Successfully"});
        
    } catch (error) {
        console.log("Error removing favorite", error);
        res.status(500).json({error: "Error went wrong"}); 
    }
})

app.listen(PORT, () => {
    console.log("server running on port", PORT);

})