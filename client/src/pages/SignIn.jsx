import {
  Box,
  Button,
  Checkbox,
  Group,
  PasswordInput,
  TextInput,
} from "@mantine/core";
import usePageTitle from "../hooks/useTitle";
import { useForm } from "@mantine/form";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";
import { useEffect } from "react";
import OAuth from "../components/OAuth";
const SignIn = () => {
  usePageTitle("Sign In");
  const { currentUser, error } = useSelector((state) => state.user);
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (currentUser) navigate("/");
    dispatch(signInFailure(null));
  }, []);
  const handleLogin = async (values) => {
    if (values.email === "" && values.password === "") {
      dispatch(signInFailure({ message: "Please enter your credentials" }));
      return;
    }
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error));
    }
  };

  return (
    <>
      <div className="bg-gray-100 font-sans">
        <div className="max-w-[1440px] mx-auto h-screen grid place-content-center ">
          <Box
            mx="auto"
            className="shadow-lg p-8 rounded-lg w-[440px] bg-white"
          >
            <h1 className="text-center text-2xl font-bold my-3">Login</h1>
            {error && (
              <div className="bg-red-100 p-3 my-4 rounded-lg">
                <span className="text-sm font-medium text-red-500">
                  {error.message}
                </span>
              </div>
            )}
            <form
              onSubmit={form.onSubmit((values) => handleLogin(values))}
              className="space-y-4"
            >
              <TextInput
                label="Email"
                placeholder="your@email.com"
                {...form.getInputProps("email")}
                className="placeholder-black"
              />

              <PasswordInput
                label="Password"
                placeholder="Enter your Password"
                {...form.getInputProps("password")}
              />

              <Group justify="flex-end" mt="md">
                <Button type="submit" fullWidth>
                  Login
                </Button>
              </Group>
            </form>
            <p className="text-sm text-center mt-4">
              Dont have an account?{" "}
              <Link to={"/register"} className="text-blue-500">
                Signup
              </Link>
            </p>
            <div class="flex items-center my-4">
              <div class="grow border-b border-slate-400"></div>
              <span class="shrink px-1 pb-1 text-slate-400 text-sm">Or</span>
              <div class="grow border-b border-slate-400"></div>
            </div>
            <OAuth title="Login with Google" />
          </Box>
        </div>
      </div>
    </>
  );
};

export default SignIn;
