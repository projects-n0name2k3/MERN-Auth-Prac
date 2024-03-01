import { Button, useComputedColorScheme } from "@mantine/core";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
const OAuth = ({ title }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const colorScheme = useComputedColorScheme();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      const res = await fetch(
        "https://mern-auth-prac.vercel.app/api/auth/google",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: result.user.displayName,
            email: result.user.email,
            photo: result.user.photoURL,
          }),
        }
      );
      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Button
      justify="space-between"
      fullWidth
      leftSection={<FcGoogle size={24} />}
      rightSection={<span />}
      mt="md"
      variant="default"
      onClick={handleGoogleClick}
    >
      <span
        className={`${
          colorScheme === "dark" ? "text-white/70" : "text-gray-500"
        }`}
      >
        {title}
      </span>
    </Button>
  );
};

export default OAuth;
