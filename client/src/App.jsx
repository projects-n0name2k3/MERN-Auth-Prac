import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import PrivateRoute from "./components/PrivateRoute";
import "@mantine/core/styles.css";

import { MantineProvider } from "@mantine/core";
import Header from "./components/Header";
const App = () => {
  return (
    <BrowserRouter>
      <MantineProvider
        theme={{
          fontFamily: "Montserrat",
        }}
      >
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<SignUp />} />
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Home />} />
          </Route>
        </Routes>
      </MantineProvider>
    </BrowserRouter>
  );
};

export default App;
