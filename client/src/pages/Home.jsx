import React, { useEffect } from "react";
import usePageTitle from "../hooks/useTitle";

export default function Home() {
  usePageTitle("Home");
  useEffect(() => {
    window.history.pushState("object or string", "Home", "/");
  }, []);
  return (
    <div className="px-4 py-12 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold  mb-4 text-slate-800">
        Welcome to my App!
      </h1>
    </div>
  );
}
