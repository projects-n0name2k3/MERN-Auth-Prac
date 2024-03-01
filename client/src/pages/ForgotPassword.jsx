import {
  ActionIcon,
  Box,
  Button,
  Group,
  PasswordInput,
  PinInput,
  TextInput,
  Tooltip,
  useComputedColorScheme,
} from "@mantine/core";
import usePageTitle from "../hooks/useTitle";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";

import {
  forgotFailure,
  forgotStart,
  forgotSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import { useEffect, useState } from "react";
const ForgotPassword = () => {
  usePageTitle("Forget Password");
  const { currentUser, error } = useSelector((state) => state.user);
  const [isSuccess, setIsSuccess] = useState(false);
  const colorScheme = useComputedColorScheme();

  const [isVerified, setIsVerified] = useState(false);
  const [isResended, setIsResended] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [tempEmail, setTempEmail] = useState("");
  const form = useForm({
    initialValues: {
      email: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });
  const form2 = useForm({
    initialValues: {
      OTP: "",
    },
    validate: {
      OTP: (value) =>
        /^(1000|[1-9]\d{3})$/.test(value) ? null : "Invalid OTP",
    },
  });
  const form3 = useForm({
    initialValues: {
      password: "",
    },
    validate: {
      password: (value) =>
        /^[A-Za-z0-9]{6,}$/.test(value) ? null : "Invalid password",
    },
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (currentUser) navigate("/");

    dispatch(signInFailure(null));
  }, []);

  const handleForgotPassword = async (values) => {
    if (values.email === "") {
      dispatch(forgotFailure({ message: "Please enter your credentials" }));
      return;
    }
    try {
      dispatch(forgotStart());
      setTempEmail(values.email);
      const res = await fetch(
        `https://mern-auth-prac.vercel.app/api/auth/forgotpassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );
      const data = await res.json();
      if (data.success === false) {
        dispatch(forgotFailure(data));
        return;
      }
      dispatch(forgotSuccess());
      setIsSuccess(true);
    } catch (error) {
      dispatch(forgotFailure(error));
    }
  };

  const handleResendCode = async () => {
    let timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(timer);

      setIsResended(false);

      setCountdown(30);
    }, 30000);
    try {
      dispatch(forgotStart());
      const res = await fetch(`/api/auth/forgotpassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: tempEmail }),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(forgotFailure(data));
        return;
      }
      dispatch(forgotSuccess());
      setIsResended(true);
    } catch (error) {
      dispatch(forgotFailure(error));
    }
  };

  const handleVerify = async (values) => {
    if (values.OTP === "") {
      dispatch(forgotFailure({ message: "Please enter your OTP" }));
      return;
    }
    try {
      dispatch(forgotStart());
      const res = await fetch(`/api/auth/verifyOTP`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ OTP: +values.OTP, email: tempEmail }),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(forgotFailure(data));
        return;
      }
      dispatch(forgotSuccess());
      setIsVerified(true);
    } catch (error) {
      dispatch(forgotFailure(error));
      console.log(error);
    }
  };
  const handleResetPassword = async (values) => {
    if (values.password === "") {
      dispatch(forgotFailure({ message: "Please enter your password" }));
      return;
    }
    try {
      dispatch(forgotStart());
      const res = await fetch(`/api/auth/resetpassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: values.password, email: tempEmail }),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(forgotFailure(data));
        return;
      }
      dispatch(forgotSuccess());
      navigate("/login");
    } catch (error) {
      dispatch(forgotFailure(error));
    }
  };

  return (
    <>
      <div className={` ${colorScheme !== "dark" && "bg-gray-100"} font-sans`}>
        <div
          className={`max-w-[1440px] mx-auto h-screen grid place-content-center `}
        >
          {isSuccess ? (
            <Box
              mx="auto"
              className={`shadow-lg p-8 rounded-lg w-[440px]  ${
                colorScheme === "dark" ? "border border-white/20" : "bg-white"
              }`}
            >
              <Tooltip label="Back">
                <ActionIcon
                  size={40}
                  variant="default"
                  onClick={() => setIsSuccess(false)}
                >
                  <MdOutlineKeyboardArrowLeft size={24} />
                </ActionIcon>
              </Tooltip>

              <h1 className="text-center text-2xl font-bold my-3">Verify</h1>
              <p className="text-center text-sm  my-3">
                Enter your new password
              </p>
              {error && (
                <div
                  className={`${
                    colorScheme === "dark"
                      ? "border border-red-500"
                      : "bg-red-100"
                  } p-3 my-4 rounded-lg`}
                >
                  <span className="text-sm font-medium text-red-500">
                    {error.message}
                  </span>
                </div>
              )}
              {isVerified ? (
                <form
                  onSubmit={form3.onSubmit((values) =>
                    handleResetPassword(values)
                  )}
                  className="space-y-4 w-full"
                >
                  <PasswordInput
                    withAsterisk
                    label="New Password"
                    placeholder="Enter your Password"
                    {...form3.getInputProps("password")}
                  />
                  <Group justify="flex-end" mt="md">
                    <Button type="submit" fullWidth>
                      Confirm
                    </Button>
                  </Group>
                </form>
              ) : (
                <form
                  onSubmit={form2.onSubmit((values) => handleVerify(values))}
                  className="space-y-4 w-full flex flex-col items-center"
                >
                  <PinInput
                    size="md"
                    placeholder=""
                    type="number"
                    className="my-4"
                    {...form2.getInputProps("OTP")}
                  />
                  <Group justify="flex-end" mt="md">
                    <Button type="submit">Verify</Button>
                  </Group>
                  <p className="text-sm">
                    Didn&rsquo;t receive code?{" "}
                    <span
                      className={`text-blue-500 ${
                        !isResended && "cursor-pointer"
                      }`}
                      onClick={() => handleResendCode()}
                    >
                      {isResended ? (
                        <span>{countdown > 0 ? countdown : "0"} seconds</span>
                      ) : (
                        "Resend Code"
                      )}
                    </span>
                  </p>
                </form>
              )}
            </Box>
          ) : (
            <Box
              mx="auto"
              className={`shadow-lg p-8 rounded-lg w-[440px] ${
                colorScheme === "dark" ? "border border-white/20" : "bg-white"
              }`}
            >
              <h1 className="text-center text-2xl font-bold my-3">
                Find Your Account
              </h1>
              {error && (
                <div
                  className={`${
                    colorScheme === "dark"
                      ? "border border-red-500"
                      : "bg-red-100"
                  } p-3 my-4 rounded-lg`}
                >
                  <span className="text-sm font-medium text-red-500">
                    {error.message}
                  </span>
                </div>
              )}
              <form
                onSubmit={form.onSubmit((values) =>
                  handleForgotPassword(values)
                )}
                className="space-y-4"
              >
                <TextInput
                  label="Email"
                  placeholder="your@email.com"
                  {...form.getInputProps("email")}
                  className="placeholder-black"
                />
                <Group justify="flex-end" mt="md">
                  <Button
                    variant="outline"
                    className={`border-slate-300 ${
                      colorScheme !== "dark" && "text-slate-500"
                    }`}
                    onClick={() => navigate("/login")}
                  >
                    Back
                  </Button>
                  <Button type="submit">Search</Button>
                </Group>
              </form>
            </Box>
          )}
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
