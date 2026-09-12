import { Router } from "express";
import { isAuthenticated } from "../../middlewares/authMiddleware.js";
import { deleteBoard, getBoard, updateBoard } from "./boardController.js";

const router = Router();

router.get("/:boardId", isAuthenticated, getBoard);
router.patch("/:boardId", isAuthenticated, updateBoard);
router.delete("/:boardId", isAuthenticated, deleteBoard);

export default router;