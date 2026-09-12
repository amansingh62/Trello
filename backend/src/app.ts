import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./modules/auth/authRoutes.js";
import { env } from "./config/db.js";
import workspaceRoutes from "./modules/workspaces/workspaceRoutes.js";
import boardRoutes from "./modules/boards/boardRoutes.js";
import listRoutes from "./modules/lists/listRoutes.js";

const app = express();

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/workspace", workspaceRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/lists", listRoutes);

export default app;