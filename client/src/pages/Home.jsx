import React, { useEffect } from "react";
import usePageTitle from "../hooks/useTitle";
import { Button, Group } from "@mantine/core";
import { Link } from "react-router-dom";
import { isMobile } from "react-device-detect";
import MobileBg from "../assets/MobileBg";
import { GooglePlayButton, AppStoreButton } from "react-mobile-app-button";
export default function Home() {
  usePageTitle("Home");

  useEffect(() => {
    window.history.pushState("object or string", "Home", "/");
  }, []);
  return !isMobile ? (
    <div className="min-h-screen top-[-56px] relative ">
      <img
        src="https://images.unsplash.com/photo-1585225464481-3bfa73da5fc9?q=80&w=2067&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt=""
        className="w-full h-[125%] object-cover absolute filter brightness-[0.6] top-[10]"
      />
      <div className="absolute top-[35%] left-[15%] ">
        <h1 className={`text-3xl font-bold  mb-4 text-white/70`}>
          Welcome to my app !
        </h1>
        <h1 className={`text-3xl font-bold  mb-4 text-white`}>
          This is my Fullstack Auth Website
        </h1>
        <p className="max-w-[400px] text-white">
          A full-stack auth website allows users to securely log in, register,
          and manage their accounts, offering comprehensive authentication
          functionality across multiple layers of the application.
        </p>
        <Group className="mt-4">
          <Button
            variant="outline"
            c={"white"}
            color="white"
            className="hover:opacity-60"
          >
            <Link to="/login">Get Started</Link>
          </Button>
        </Group>
      </div>
      <span className="text-white/50 text-xl left-[50%] translate-x-[-50%] fixed bottom-[10%]">
        Created by n0name2k3
      </span>
    </div>
  ) : (
    <div className="min-h-screen flex items-center justify-center flex-col text-center relative px-4">
      <MobileBg className="absolute" />
      <div className="absolute z-50 flex flex-col items-center justify-between h-[60%]">
        <h1 className={`text-3xl font-bold  text-white`}>
          Welcome to my app !
        </h1>

        <div>
          <p className="max-w-[400px] text-white text-sm">
            For a better{" "}
            <span className="h-2 bg-black text-white p-1 rounded-lg">
              Experience
            </span>
            , please get the app on
          </p>
          <p className="mt-4 font-bold text-white">
            {" "}
            Google Play <span className="font-thin">or</span> Apple Store
          </p>
        </div>
        <Group className="mt-12">
          <GooglePlayButton url={""} theme={"dark"} className={"scale-[.85]"} />
          <AppStoreButton url={""} theme={"dark"} className={"scale-[.85]"} />
        </Group>
        <span className="text-white/50 text-sm left-[50%] translate-x-[-50%] fixed bottom-[10%]">
          Created by n0name2k3
        </span>
      </div>
    </div>
  );
}
