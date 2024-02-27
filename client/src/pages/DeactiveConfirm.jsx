import { Button, Divider, PasswordInput } from "@mantine/core";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const DeactiveConfirm = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
  }, []);
  return (
    <div className="bg-slate-100 h-[calc(100vh-48px)] grid place-content-center">
      <div className="max-w-[1440px] w-[500px] min-h-48 shadow-lg rounded-lg bg-white p-3 flex flex-col items-center gap-4">
        <h1 className="text-center text-2xl ">Confirm access</h1>
        <Divider className="w-full" />
        <span className="text-sm text-slate-500">
          To confirm deactive your account please type your password below
        </span>
        <PasswordInput label="Password" className="w-[50%] " />
        <div className="flex items-center gap-4">
          <Button
            variant="transparent"
            color="gray"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button>Confirm</Button>
        </div>
      </div>
    </div>
  );
};

export default DeactiveConfirm;
