import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

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
    res.status(200).json({ ...rest, access_token: token });
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
      res.status(200).json({ ...rest, access_token: token });
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
      res.status(200).json({ ...rest, access_token: token });
    }
  } catch (error) {
    next(error);
  }
};

export const forgotpassword = async (req, res) => {
  try {
    const existedUser = await User.findOne({ email: req.body.email });
    if (!existedUser) {
      return res
        .status(404)
        .json({ success: false, message: "Email not found" });
    }
    if (existedUser.wrongCount > 5) {
      if (Date.now() - existedUser.lastWrongAttempt < 3600000) {
        return res
          .status(403)
          .json({ success: false, message: "Please try again later!" });
      } else {
        await User.findByIdAndUpdate(
          existedUser._id,
          {
            $set: {
              wrongCount: 0,
              lastWrongAttempt: Date.now() - 360000000,
            },
          },
          { new: true }
        );
      }
    }
    const OTPCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    const hashedOTPCode = bcryptjs.hashSync(OTPCode.toString(), 10);
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_GMAIL,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    var mailOptions = {
      from: process.env.MAIL_GMAIL,
      to: req.body.email,
      subject: "Verification",
      html: `<div style='width: 700px; border: 1px solid #ccc;'>

      <div style='background: #228be6; color: white; text-align: center; padding: 20px;'><h1>Verification</h1></div>
  
      <p style='padding: 0 20px;'>Dear users!</p>
  
      <p style='padding: 0 20px;'>The verification code you need to use to recover your account password (${req.body.email}) is:</p>
  
      <h2 style='text-align: center;'>${OTPCode}</h2>
  
      <p style='padding: 0 10px;'>Best regards!</p>
  
  </div>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    await User.findByIdAndUpdate(
      existedUser._id,
      {
        $set: {
          OTPcode: hashedOTPCode,
        },
      },
      { new: true }
    );
    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

export const verifyOTP = async (req, res) => {
  const { OTP, email } = req.body;
  try {
    const existedUser = await User.findOne({ email });
    if (!existedUser) {
      return res
        .status(404)
        .json({ success: false, message: "Email not found" });
    }
    if (existedUser.wrongCount > 5) {
      if (Date.now() - existedUser.lastWrongAttempt < 3600000) {
        return res
          .status(403)
          .json({ success: false, message: "Please try again later!" });
      } else {
        await User.findByIdAndUpdate(
          existedUser._id,
          {
            $set: {
              wrongCount: 0,
              lastWrongAttempt: Date.now() - 360000000,
            },
          },
          { new: true }
        );
      }
    }
    const validOTP = bcryptjs.compareSync(OTP.toString(), existedUser.OTPcode);
    if (!validOTP) {
      await User.findByIdAndUpdate(
        existedUser._id,
        {
          $set: {
            wrongCount: existedUser.wrongCount + 1,
            lastWrongAttempt: Date.now(),
          },
        },
        { new: true }
      );
      return res.status(404).json({ success: false, message: "Invalid OTP" });
    }
    res.status(200).json({ success: true, message: "Recovered successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

export const resetpassword = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existedUser = await User.findOne({ email });

    const newPassword = bcryptjs.hashSync(password, 10);
    await User.findByIdAndUpdate(
      existedUser._id,
      {
        $set: {
          password: newPassword,
          wrongCount: 0,
          lastWrongAttempt: null,
        },
      },
      { new: true }
    );
    res.status(200).json({ success: true, message: "Recovered successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

export const signout = (res) => {
  return res.status(200).json("Signout successfully");
};
