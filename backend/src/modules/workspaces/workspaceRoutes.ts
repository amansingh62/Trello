import { Router } from "express";
import { deleteWorkspace, editWorkspace, getWorkspaces, workspace } from "./workspaceController.js";
import { isAuthenticated } from "../../middlewares/authMiddleware.js";

const router = Router();

router.get("/", isAuthenticated, getWorkspaces);

router.post("/", isAuthenticated, workspace);
router.patch("/:workspaceId", isAuthenticated, editWorkspace);
router.delete("/:workspaceId", isAuthenticated, deleteWorkspace);

export default router;