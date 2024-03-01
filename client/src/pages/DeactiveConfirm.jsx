import { Button, Divider, PasswordInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  deactiveFailure,
  deactiveStart,
  deactiveSuccess,
} from "../redux/user/userSlice";

const DeactiveConfirm = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const form = useForm({
    initialValues: {
      password: "",
    },
  });
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
  }, []);
  const handleSubmit = async (values) => {
    if (values.password === "") {
      dispatch(deactiveFailure({ message: "Please enter your credentials" }));
      return;
    }
    try {
      dispatch(deactiveStart());
      const res = await fetch(`/api/user/deactive/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values, email: currentUser.email }),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deactiveFailure(data));
        return;
      }
      dispatch(deactiveSuccess());
      navigate("/login");
    } catch (error) {
      dispatch(deactiveFailure(error));
    }
  };
  return (
    <div className="bg-slate-100 h-[calc(100vh-48px)] grid place-content-center">
      <div className="max-w-[1440px] w-[500px] min-h-48 shadow-lg rounded-lg bg-white p-3 flex flex-col items-center gap-4">
        <h1 className="text-center text-2xl ">Confirm access</h1>
        <Divider className="w-full" />
        <span className="text-sm text-slate-500">
          To confirm deactive your account please type your password below
        </span>
        <form
          onSubmit={form.onSubmit((values) => handleSubmit(values))}
          className="space-y-4 w-[60%] flex flex-col items-center"
        >
          <PasswordInput
            label="Password"
            placeholder="Enter your Password"
            {...form.getInputProps("password")}
            className="w-full"
          />

          <div className="flex items-center gap-4">
            <Button
              variant="transparent"
              color="gray"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button type="submit">Confirm</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeactiveConfirm;
