import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";

export const getCard = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params as { id: string };

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!id) {
      return res.status(400).json({
        message: "Invalid Card",
      });
    }

    const card = await prisma.card.findUnique({
      where: {
        id,
      },
      include: {
        list: true,
      },
    });

    if (!card) {
      return res.status(404).json({
        message: "Card not found",
      });
    }

    const boardMember = await prisma.boardMember.findUnique({
      where: {
        userId_boardId: {
          userId,
          boardId: card.list.boardId,
        },
      },
    });

    if (!boardMember) {
      return res.status(403).json({
        message: "Not a board member",
      });
    }

    return res.status(200).json({
      card,
    });
  } catch (error) {
    console.error("Get card error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const editCard = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params as { id: string };
    const { title, description, position } = req.body;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!id) {
      return res.status(400).json({
        message: "Invalid Card",
      });
    }

    if (
      title === undefined &&
      description === undefined &&
      position === undefined
    ) {
      return res.status(400).json({
        message: "No fields to update",
      });
    }

    const card = await prisma.card.findUnique({
      where: {
        id,
      },
      include: {
        list: true,
      },
    });

    if (!card) {
      return res.status(404).json({
        message: "Card not found",
      });
    }

    const boardMember = await prisma.boardMember.findUnique({
      where: {
        userId_boardId: {
          userId,
          boardId: card.list.boardId,
        },
      },
    });

    if (!boardMember) {
      return res.status(403).json({
        message: "Not a board member",
      });
    }

    const updatedCard = await prisma.card.update({
      where: {
        id,
      },
      data: {
        ...(title !== undefined && {
          title: title.trim(),
        }),
        ...(description !== undefined && {
          description: description?.trim() || null,
        }),
        ...(position !== undefined && {
          position,
        }),
      },
    });

    return res.status(200).json({
      message: "Card edited successfully",
      card: updatedCard,
    });
  } catch (error) {
    console.error("Edit card error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteCard = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params as { id: string };

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!id) {
      return res.status(400).json({
        message: "Invalid Card",
      });
    }

    const card = await prisma.card.findUnique({
      where: {
        id,
      },
      include: {
        list: true,
      },
    });

    if (!card) {
      return res.status(404).json({
        message: "Card not found",
      });
    }

    const boardMember = await prisma.boardMember.findUnique({
      where: {
        userId_boardId: {
          userId,
          boardId: card.list.boardId,
        },
      },
    });

    if (!boardMember) {
      return res.status(403).json({
        message: "Not a board member",
      });
    }

    await prisma.card.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      message: "Card deleted successfully",
    });
  } catch (error) {
    console.error("Delete card error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
