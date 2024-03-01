import {
  Box,
  Button,
  Center,
  Container,
  Group,
  PasswordInput,
  TextInput,
  useComputedColorScheme,
} from "@mantine/core";
import usePageTitle from "../hooks/useTitle";
import { useForm } from "@mantine/form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";
import { useEffect } from "react";
import OAuth from "../components/OAuth";
import ErrorBanner from "../components/ErrorBanner";
const SignIn = () => {
  usePageTitle("Sign In");
  const { currentUser, error } = useSelector((state) => state.user);
  const colorScheme = useComputedColorScheme();
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
      <Box className={`font-sans ${colorScheme !== "dark" && "bg-gray-100"}`}>
        <Center className="max-w-[1440px] mx-auto h-screen grid place-content-center ">
          <Box
            mx={"auto"}
            className={`shadow-xl p-8 rounded-lg w-[440px] ${
              colorScheme === "dark" ? "border border-white/20" : "bg-white"
            }`}
          >
            <h1 className="text-center text-2xl font-bold my-3 dark:text-white">
              Login
            </h1>
            {error && <ErrorBanner message={error.message} />}
            <form
              onSubmit={form.onSubmit((values) => handleLogin(values))}
              className="space-y-4"
            >
              <TextInput
                label="Email"
                placeholder="your@email.com"
                {...form.getInputProps("email")}
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
            <Link
              className="text-[13px] hover:opacity-60 text-blue-500"
              to={"/forgotpassword"}
            >
              Forgotten password?
            </Link>
            <p className="text-sm text-center mt-4 ">
              Dont have an account?{" "}
              <Link to={"/register"} className="text-blue-500 hover:opacity-60">
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
        </Center>
      </Box>
    </>
  );
};

export default SignIn;
