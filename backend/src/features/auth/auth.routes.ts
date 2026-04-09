import { auth } from "@/utils/auth";
import { toNodeHandler } from "better-auth/node";
import { Router } from "express";

const router = Router();

router.all("/*", toNodeHandler(auth));

export const authRoutes = router;
