import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
export const register = async (req, res) => {
  const { email, password, username } = req.body;
  try {
    const existedEmail = await User.findOne({ email });
    if (existedEmail) {
      return res
        .status(409)
        .json({ success: false, message: "Email is already used" });
    }
    const existedUsername = await User.findOne({ username });
    if (existedUsername) {
      return res
        .status(409)
        .json({ success: false, message: "Username is already used" });
    }
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ email, username, password: hashedPassword });
    await newUser.save();
    res
      .status(201)
      .json({ success: true, message: "User created successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email: email });
    if (!validUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid Credentials" });
    }
    const { password: hashedPassword, ...rest } = validUser._doc;
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const expiryDate = new Date(Date.now() + 3600000);
    res
      .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
      .status(200)
      .json(rest);
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

export const signout = (req, res) => {
  res.clearCookie("access_token").status(200).json("Signout successfully");
};
