import express from "express";
import { verifyToken } from "../middleware/middleware.js";
import { editProfile } from "../controller/user.controller.js";

const router = express.Router();
router.patch("/edit/:id", verifyToken, editProfile);
export default router;
