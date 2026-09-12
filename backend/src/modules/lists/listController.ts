import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";

export const editList = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { listId } = req.params as { listId: string };
    const { name, position } = req.body;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!listId) {
      return res.status(400).json({
        message: "Invalid List",
      });
    }

    if (!name || !name.trim() || position === undefined) {
      return res.status(400).json({
        message: "Invalid Inputs",
      });
    }

    const list = await prisma.list.findUnique({
      where: {
        id: listId,
      },
    });

    if (!list) {
      return res.status(404).json({
        message: "List not found",
      });
    }

    const boardMember = await prisma.boardMember.findUnique({
      where: {
        userId_boardId: {
          userId,
          boardId: list.boardId,
        },
      },
    });

    if (!boardMember) {
      return res.status(403).json({
        message: "Not a board member",
      });
    }

    const updatedList = await prisma.list.update({
      where: {
        id: listId,
      },
      data: {
        name: name.trim(),
        position,
      },
    });

    return res.status(200).json({
      message: "List edited successfully",
      list: updatedList,
    });
  } catch (error) {
    console.error("Edit list error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteList = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { listId } = req.params as { listId: string };

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!listId) {
      return res.status(400).json({
        message: "Invalid List",
      });
    }

    const list = await prisma.list.findUnique({
      where: {
        id: listId,
      },
    });

    if (!list) {
      return res.status(404).json({
        message: "List not found",
      });
    }

    const boardMember = await prisma.boardMember.findUnique({
      where: {
        userId_boardId: {
          userId,
          boardId: list.boardId,
        },
      },
    });

    if (!boardMember) {
      return res.status(403).json({
        message: "Not a board member",
      });
    }

    await prisma.list.delete({
      where: {
        id: listId,
      },
    });

    return res.status(200).json({
      message: "List deleted successfully",
    });
  } catch (error) {
    console.error("Delete list error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
