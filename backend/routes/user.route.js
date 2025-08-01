import express from "express";
import { getUsersForSiderbar } from "../controllers/user.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/", protectRoute, getUsersForSiderbar);

export default router;