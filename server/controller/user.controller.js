import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

const checkExistedUser = async (field) => {
  const fieldCheck = Object.keys(field)[0];
  const existedUser = await User.findOne(field);
  if (existedUser) {
    if (fieldCheck === "email") {
      return { success: false, message: "Email is already used" };
    } else if (fieldCheck === "username") {
      return { success: false, message: "Username is already used" };
    }
  }
  return true;
};
export const editProfile = async (req, res) => {
  const { email, username, password, profilePicture } = req.body;
  if (req.user.id !== req.params.id) {
    return res
      .status(403)
      .json({ success: false, message: "You can only edit your own profile" });
  }
  try {
    const user = await User.findById(req.user.id);
    if (email) {
      if (email !== user.email) {
        const emailCheck = await checkExistedUser({ email: email });
        if (emailCheck !== true) {
          return res.status(409).json(emailCheck);
        }
      }
      user.email = email;
    }
    if (username) {
      if (username !== user.username) {
        const usernameCheck = await checkExistedUser({ username: username });
        if (usernameCheck !== true) {
          return res.status(409).json(usernameCheck);
        }
      }
      user.username = username;
    }
    if (password) {
      if (password.trim().length >= 6) {
        const hashedPassword = bcryptjs.hashSync(password, 10);
        user.password = hashedPassword;
      } else {
        return res.status(403).json({
          success: false,
          message: "Password must be has atleast 6 characters a",
        });
      }
    }
    if (profilePicture) {
      user.profilePicture = profilePicture;
    }
    await user.save();
    const { password: hashedPassword, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the profile",
    });
  }
};
