import React from "react";
import logo from "../assets/broadcast.svg";
import { useNavigate } from "react-router-dom";
import { Avatar, Button, Menu } from "@mantine/core";
import { useSelector } from "react-redux";
const Header = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="h-12 border-b-[1px]">
      <div className="max-w-[1440px] mx-auto h-full flex items-center justify-between">
        <img
          src={logo}
          alt=""
          className="cursor-pointer"
          onClick={() => navigate("/")}
        />
        {currentUser ? (
          <Menu shadow="md" width={150}>
            <Menu.Target>
              <Avatar
                src={currentUser.profilePicture}
                className="cursor-pointer"
              ></Avatar>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Hi {currentUser.username}</Menu.Label>
              <Menu.Divider />
              <Menu.Item>Profile</Menu.Item>
              <Menu.Divider />
              <Menu.Item color="red">Sign Out</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default Header;
