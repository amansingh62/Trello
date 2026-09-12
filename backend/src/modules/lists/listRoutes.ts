import { Router } from "express";
import { isAuthenticated } from "../../middlewares/authMiddleware.js";
import { deleteList, editList } from "./listController.js";

const router = Router();

router.patch("/:listId", isAuthenticated, editList);
router.delete("/:listId", isAuthenticated, deleteList);

export default router;
