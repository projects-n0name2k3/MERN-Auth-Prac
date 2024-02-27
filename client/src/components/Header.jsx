import React from "react";
import logo from "../assets/broadcast.svg";
import { useNavigate } from "react-router-dom";
import { Avatar, Button, Menu } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { signOutSuccess } from "../redux/user/userSlice";
const Header = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const handleSignOut = async () => {
    try {
      await fetch("./api/auth/logout");
      dispatch(signOutSuccess());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };
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
          <Menu shadow="md">
            <Menu.Target>
              <Avatar
                src={currentUser.profilePicture}
                className="cursor-pointer"
                referrerPolicy="no-referrer"
              ></Avatar>
            </Menu.Target>

            <Menu.Dropdown className="min-w-36">
              <Menu.Label>Hi {currentUser.username}</Menu.Label>
              <Menu.Divider />
              <Menu.Item onClick={() => navigate("/profile")}>
                Profile
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item color="red" onClick={handleSignOut}>
                Sign Out
              </Menu.Item>
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
