import { db } from "../config/db.js";
import { favoritesTable } from "../db/schema.js";
import { and, eq } from "drizzle-orm";

export const addFavorite = async (req, res) => {
    try {
        const { userId, recipeId, title, image, cookTime, servings } = req.body;

        if (!userId || !recipeId || !title) {
            return res.status(400).json({ error: "Missing required fields" });
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
        res.status(500).json({ error: "Something went wrong" });
    }
};

export const getFavoritesByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const userFavorites = await db.select().from(favoritesTable).where(eq(favoritesTable.userId, userId));
        res.status(200).json(userFavorites);
    } catch (error) {
        console.log("Error fetching favorites", error);
        res.status(500).json({ error: "Something went wrong" });
    }
};

export const deleteFavorite = async (req, res) => {
    try {
        const { userId, recipeId } = req.params;
        const userFavoritesCheck = await db.select().from(favoritesTable).where(
            and(eq(favoritesTable.userId, userId), eq(favoritesTable.recipeId, parseInt(recipeId)))
        );

        if (!userFavoritesCheck.length) {
            return res.status(404).json({ error: "Favorite not found" });
        }

        await db.delete(favoritesTable).where(
            and(eq(favoritesTable.userId, userId), eq(favoritesTable.recipeId, parseInt(recipeId)))
        );

        res.status(200).json({ message: "Favorite removed successfully" });
    } catch (error) {
        console.log("Error removing favorite", error);
        res.status(500).json({ error: "Something went wrong" });
    }
};
