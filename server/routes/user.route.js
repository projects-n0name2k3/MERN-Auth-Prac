import express from "express";
import { verifyToken } from "../middleware/middleware.js";
import { deactiveAccount, editProfile } from "../controller/user.controller.js";

const router = express.Router();
router.patch("/edit/:id", verifyToken, editProfile);
router.post("/deactive/:id", verifyToken, deactiveAccount);
export default router;
