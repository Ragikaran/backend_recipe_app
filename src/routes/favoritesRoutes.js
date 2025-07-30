import express from "express";
import { addFavorite, getFavoritesByUser, deleteFavorite } from "../controllers/favoritesController.js";

const router = express.Router();

router.post("/", addFavorite);
router.get("/:userId", getFavoritesByUser);
router.delete("/:userId/:recipeId", deleteFavorite);

export default router;
