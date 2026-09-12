import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";

export const workspace = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { name } = req.body;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        message: "Invalid workspace name",
      });
    }

    const workspace = await prisma.workspace.create({
      data: {
        name: name.trim(),
        userId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    return res.status(201).json({
      message: "Workspace created successfully",
      workspace,
    });
  } catch (error) {
    console.error("Create workspace error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getWorkspaces = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const workspaces = await prisma.workspace.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({
      message: "Workspaces fetched successfully",
      workspaces,
    });
  } catch (error) {
    console.error("Get workspaces error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const editWorkspace = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { workspaceId } = req.params as { workspaceId: string };
    const { name } = req.body;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!workspaceId) {
      return res.status(400).json({
        message: "Workspace ID is required",
      });
    }

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        message: "Invalid name",
      });
    }

    const workspace = await prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        userId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    const updatedWorkspace = await prisma.workspace.update({
      where: {
        id: workspaceId,
      },
      data: {
        name: name.trim(),
      },
      select: {
        id: true,
        name: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({
      message: "Workspace updated successfully",
      workspace: updatedWorkspace,
    });
  } catch (error) {
    console.error("Edit workspace error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteWorkspace = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { workspaceId } = req.params as { workspaceId: string };

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!workspaceId) {
      return res.status(400).json({
        message: "Workspace ID is required",
      });
    }

    const workspace = await prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        userId,
      },
      select: {
        id: true,
      },
    });

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    await prisma.workspace.delete({
      where: {
        id: workspaceId,
      },
    });

    return res.status(200).json({
      message: "Workspace deleted successfully",
    });
  } catch (error) {
    console.error("Delete workspace error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const createBoard = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { workspaceId } = req.params as { workspaceId: string };
    const { title } = req.body;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!workspaceId) {
      return res.status(400).json({
        message: "Workspace ID is required",
      });
    }

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        message: "Invalid title",
      });
    }

    const workspace = await prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        userId,
      },
    });

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    const board = await prisma.$transaction(async (tx) => {
    const newBoard = await tx.board.create({
        data: {
            title: title.trim(),
            workspaceId,
        },
    });

    await tx.boardMember.create({
        data: {
            userId,
            boardId: newBoard.id,
        },
    });

    return newBoard;
});

    return res.status(201).json({
      message: "Board created successfully",
      board,
    });
  } catch (error) {
    console.error("Create board error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getBoards = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const { workspaceId } = req.params as { workspaceId: string };

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        if (!workspaceId) {
            return res.status(400).json({
                message: "Workspace ID is required",
            });
        }

        const workspace = await prisma.workspace.findFirst({
            where: {
                id: workspaceId,
                userId,
            },
        });

        if (!workspace) {
            return res.status(404).json({
                message: "Workspace not found",
            });
        }

        const boards = await prisma.board.findMany({
            where: {
                workspaceId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return res.status(200).json({
            message: "Boards fetched successfully",
            boards,
        });

    } catch (error) {
        console.error("Get boards error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
