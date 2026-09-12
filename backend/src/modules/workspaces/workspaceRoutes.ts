import { Router } from "express";
import { createBoard, deleteWorkspace, editWorkspace, getBoards, getWorkspaces, workspace } from "./workspaceController.js";
import { isAuthenticated } from "../../middlewares/authMiddleware.js";

const router = Router();

router.get("/", isAuthenticated, getWorkspaces);

router.post("/", isAuthenticated, workspace);
router.patch("/:workspaceId", isAuthenticated, editWorkspace);
router.delete("/:workspaceId", isAuthenticated, deleteWorkspace);

router.post("/:workspaceId/boards", isAuthenticated, createBoard);
router.get("/:workspaceId/boards", isAuthenticated, getBoards);

export default router;