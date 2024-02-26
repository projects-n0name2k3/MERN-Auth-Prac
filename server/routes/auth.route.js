import express from "express";
import {
  forgotpassword,
  google,
  login,
  register,
  resetpassword,
  signout,
  verifyOTP,
} from "../controller/auth.controller.js";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/google", google);
router.post("/forgotpassword", forgotpassword);
router.post("/verifyOTP", verifyOTP);
router.post("/resetpassword", resetpassword);
router.get("/logout", signout);
export default router;
