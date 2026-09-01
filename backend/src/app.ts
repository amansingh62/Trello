import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./modules/auth/authRoutes.js";
import { env } from "./config/db.js";
import { workspace } from "./modules/workspaces/workspaceController.js";
import workspaceRoutes from "./modules/workspaces/workspaceRoutes.js";

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

export default app;