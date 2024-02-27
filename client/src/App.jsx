import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import Header from "./components/Header";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import { ModalsProvider } from "@mantine/modals";
import DeactiveConfirm from "./pages/DeactiveConfirm";
const App = () => {
  return (
    <BrowserRouter>
      <MantineProvider
        theme={{
          fontFamily: "Montserrat",
        }}
      >
        <ModalsProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/deactive/confirm" element={<DeactiveConfirm />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </ModalsProvider>
      </MantineProvider>
    </BrowserRouter>
  );
};

export default App;
