import { useComputedColorScheme } from "@mantine/core";
import React from "react";

const ErrorBanner = ({ message }) => {
  const colorScheme = useComputedColorScheme();

  return (
    <div
      className={`${
        colorScheme === "dark" ? "border border-red-500" : "bg-red-100"
      } p-3 my-4 rounded-lg w-[80%]`}
    >
      <span className="text-sm font-medium text-red-500">{message}</span>
    </div>
  );
};

export default ErrorBanner;
