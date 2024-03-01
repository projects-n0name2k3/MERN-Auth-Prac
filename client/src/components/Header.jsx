import React, { useEffect, useState } from "react";
import logo from "../assets/broadcast.svg";
import { Link, useNavigate } from "react-router-dom";
import {
  ActionIcon,
  Avatar,
  Button,
  Group,
  Menu,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { signOutSuccess } from "../redux/user/userSlice";
import { IoSunnyOutline } from "react-icons/io5";
import Logo from "../assets/Logo";

const Header = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const { setColorScheme } = useMantineColorScheme({ keepTransitions: true });
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });
  const colorScheme = useComputedColorScheme();

  const dispatch = useDispatch();
  const handleSignOut = async () => {
    try {
      await fetch("https://mern-auth-prac.vercel.app/api/auth/logout");
      dispatch(signOutSuccess());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      className={`h-14 border-b-[1px]  ${
        colorScheme === "dark" && "border-[#383838]"
      } ${window.location.pathname === "/" && "relative z-50 "}`}
    >
      <div className="max-w-[1440px] mx-auto h-full flex items-center justify-between ">
        <Link
          to="/"
          className={`${window.location.pathname === "/" && "text-white "}`}
        >
          <Logo className="cursor-pointer" />
        </Link>
        {currentUser ? (
          <Group>
            <Menu shadow="md">
              <Menu.Target>
                <Avatar
                  src={currentUser.profilePicture}
                  className="cursor-pointer border"
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
            <ActionIcon
              size={32}
              variant="default"
              aria-label="ActionIcon with size as a number"
              onClick={() =>
                setColorScheme(
                  computedColorScheme === "light" ? "dark" : "light"
                )
              }
            >
              <IoSunnyOutline size={20} />
            </ActionIcon>
          </Group>
        ) : (
          <div className="space-x-4 flex items-center">
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
            <ActionIcon
              size={32}
              variant="default"
              aria-label="ActionIcon with size as a number"
              onClick={() =>
                setColorScheme(
                  computedColorScheme === "light" ? "dark" : "light"
                )
              }
            >
              <IoSunnyOutline size={20} />
            </ActionIcon>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
