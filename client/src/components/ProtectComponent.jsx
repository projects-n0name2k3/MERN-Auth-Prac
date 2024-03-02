import React from "react";
import { isMobile } from "react-device-detect";
import { Outlet } from "react-router-dom";
import Home from "../pages/Home";
const ProtectComponent = () => {
  return !isMobile ? <Outlet /> : <Home />;
};

export default ProtectComponent;
