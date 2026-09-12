import { Router } from "express";
import { isAuthenticated } from "../../middlewares/authMiddleware.js";
import { createCard, deleteList, editList, getCards } from "./listController.js";

const router = Router();

router.get("/:listId/cards", isAuthenticated, getCards);

router.patch("/:listId", isAuthenticated, editList);
router.delete("/:listId", isAuthenticated, deleteList);

router.post("/:listId/cards", isAuthenticated, createCard);

export default router;
