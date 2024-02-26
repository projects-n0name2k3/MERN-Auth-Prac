import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 6,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePicture: {
      type: String,
      default:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vhv.rs%2Fviewpic%2Fhmbwbwx_empty-avatar-png-user-icon-png-transparent-png%2F&psig=AOvVaw3zd_sZkMQVKFUH-isUKouI&ust=1708917258233000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCPjzzobDxYQDFQAAAAAdAAAAABAJ",
    },
    OTPcode: {
      type: String,
      minlength: 4,
      maxlength: 4,
    },
    wrongCount: {
      type: Number,
      default: 0,
    },
    lastWrongAttempt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
