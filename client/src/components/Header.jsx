import React from "react";
import logo from "../assets/broadcast.svg";
import { useNavigate } from "react-router-dom";
import { Button } from "@mantine/core";
const Header = () => {
  const navigate = useNavigate();
  return (
    <div className="h-12 border-b-[1px]">
      <div className="max-w-[1440px] mx-auto h-full flex items-center justify-between">
        <img
          src={logo}
          alt=""
          className="cursor-pointer"
          onClick={() => navigate("/")}
        />
        <div className="space-x-4">
          <Button
            variant="outline"
            size="xs"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
          <Button size="xs" onClick={() => navigate("/register")}>
            Sign up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
