import { Router } from "express";
import { isAuthenticated } from "../../middlewares/authMiddleware.js";
import { createList, deleteBoard, getBoard, getLists, updateBoard } from "./boardController.js";

const router = Router();

router.get("/:boardId", isAuthenticated, getBoard);
router.get("/:boardId/lists", isAuthenticated, getLists);

router.patch("/:boardId", isAuthenticated, updateBoard);
router.delete("/:boardId", isAuthenticated, deleteBoard);

router.post("/:boardId/lists", isAuthenticated, createList);

export default router;