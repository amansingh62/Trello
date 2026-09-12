import { Router } from "express";
import { isAuthenticated } from "../../middlewares/authMiddleware.js";
import { deleteCard, editCard, getCard } from "./cardController.js";

const router = Router();

router.get("/:id", isAuthenticated, getCard);

router.patch("/:id", isAuthenticated, editCard);
router.delete("/:id", isAuthenticated, deleteCard);

export default router;