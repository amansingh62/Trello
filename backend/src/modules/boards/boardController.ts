import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";

export const getBoard = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const { boardId } = req.params as { boardId: string };

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        if (!boardId) {
            return res.status(400).json({
                message: "Board ID is required",
            });
        }

        const board = await prisma.board.findFirst({
            where: {
                id: boardId,
                workspace: {
                    userId,
                },
            },
        });

        if (!board) {
            return res.status(404).json({
                message: "Board not found",
            });
        }

        return res.status(200).json({
            message: "Board fetched successfully",
            board,
        });

    } catch (error) {
        console.error("Get board error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const updateBoard = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const { boardId } = req.params as { boardId: string };
        const { title } = req.body;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        if (!boardId) {
            return res.status(400).json({
                message: "Board ID is required",
            });
        }

        if (typeof title !== "string" || !title.trim()) {
            return res.status(400).json({
                message: "Invalid title",
            });
        }

        const board = await prisma.board.findFirst({
            where: {
                id: boardId,
                workspace: {
                    userId,
                },
            },
        });

        if (!board) {
            return res.status(404).json({
                message: "Board not found",
            });
        }

        const updatedBoard = await prisma.board.update({
            where: {
                id: boardId,
            },
            data: {
                title: title.trim(),
            },
        });

        return res.status(200).json({
            message: "Board updated successfully",
            board: updatedBoard,
        });

    } catch (error) {
        console.error("Update board error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const deleteBoard = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const { boardId } = req.params as { boardId: string };

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        if (!boardId) {
            return res.status(400).json({
                message: "Board ID is required",
            });
        }

        const board = await prisma.board.findFirst({
            where: {
                id: boardId,
                workspace: {
                    userId,
                },
            },
        });

        if (!board) {
            return res.status(404).json({
                message: "Board not found",
            });
        }

        await prisma.board.delete({
            where: {
                id: boardId,
            },
        });

        return res.status(200).json({
            message: "Board deleted successfully",
        });

    } catch (error) {
        console.error("Delete board error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};