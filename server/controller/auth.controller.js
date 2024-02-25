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

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: hashedPassword, ...rest } = user._doc;
      const expiryDate = new Date(Date.now() + 3600000); // 1 hour
      res
        .cookie("access_token", token, {
          httpOnly: true,
          expires: expiryDate,
        })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        profilePicture: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: hashedPassword2, ...rest } = newUser._doc;
      const expiryDate = new Date(Date.now() + 3600000); // 1 hour
      res
        .cookie("access_token", token, {
          httpOnly: true,
          expires: expiryDate,
        })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res) => {
  res.clearCookie("access_token").status(200).json("Signout successfully");
};
