import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      min: 6,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    profilePicture: {
      type: String,
      default:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vhv.rs%2Fviewpic%2Fhmbwbwx_empty-avatar-png-user-icon-png-transparent-png%2F&psig=AOvVaw3zd_sZkMQVKFUH-isUKouI&ust=1708917258233000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCPjzzobDxYQDFQAAAAAdAAAAABAJ",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
