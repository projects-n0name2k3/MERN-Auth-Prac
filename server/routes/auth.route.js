import express from "express";
import { login, register, signout } from "../controller/auth.controller.js";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/logout", signout);
export default router;
