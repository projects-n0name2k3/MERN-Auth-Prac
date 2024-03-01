import {
  Box,
  Button,
  Checkbox,
  Group,
  PasswordInput,
  TextInput,
  useComputedColorScheme,
} from "@mantine/core";
import usePageTitle from "../hooks/useTitle";
import { useForm } from "@mantine/form";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import {
  signUpFailure,
  signUpStart,
  signUpSuccess,
} from "../redux/user/userSlice";
import { useEffect } from "react";
import OAuth from "../components/OAuth";
import ErrorBanner from "../components/ErrorBanner";

const SignUp = () => {
  usePageTitle("Sign Up");
  const { currentUser, error } = useSelector((state) => state.user);
  const colorScheme = useComputedColorScheme();
  const form = useForm({
    initialValues: {
      email: "",
      username: "",
      password: "",
      termsOfService: false,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      username: (value) =>
        /^[\p{L}\s]+$/u.test(value)
          ? null
          : "Username must be has atleast 6 characters",
      password: (value) =>
        /^[A-Za-z0-9]{6,}$/.test(value) ? null : "Invalid password",
    },
  });
  useEffect(() => {
    if (currentUser) navigate("/");
    dispatch(signUpFailure(null));
  }, []);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSignUp = async (values) => {
    try {
      dispatch(signUpStart());
      const res = await fetch(
        "https://mern-auth-u15p.onrender.com/api/auth/register",
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
        dispatch(signUpFailure(data));
        return;
      }
      dispatch(signUpSuccess());
      navigate("/login");
    } catch (error) {
      dispatch(signUpFailure(error));
    }
  };
  return (
    <>
      <Box className={`font-sans ${colorScheme !== "dark" && "bg-gray-100"}`}>
        <div className="max-w-[1440px] mx-auto h-screen grid place-content-center ">
          <Box
            mx="auto"
            className={`shadow-lg p-8 rounded-lg w-[440px] ${
              colorScheme === "dark" ? "border border-white/20" : "bg-white"
            }`}
          >
            <h1 className="text-center text-2xl font-bold my-3">Sign Up</h1>

            {error && <ErrorBanner message={error.message} />}

            <form
              onSubmit={form.onSubmit((values) => handleSignUp(values))}
              className="space-y-4"
            >
              <TextInput
                withAsterisk
                label="Email"
                placeholder="your@email.com"
                {...form.getInputProps("email")}
              />

              <TextInput
                withAsterisk
                label="Username"
                placeholder="Enter your Username"
                {...form.getInputProps("username")}
              />
              <PasswordInput
                withAsterisk
                label="Password"
                placeholder="Enter your Password"
                {...form.getInputProps("password")}
              />

              <Checkbox
                mt="md"
                label="I agree to sell my privacy"
                {...form.getInputProps("termsOfService", { type: "checkbox" })}
              />

              <Group justify="flex-end" mt="md">
                <Button type="submit" fullWidth>
                  Sign Up
                </Button>
              </Group>
            </form>
            <p className="text-sm text-center mt-4">
              Already have an account?{" "}
              <Link to={"/login"} className="text-blue-500">
                Signin
              </Link>
            </p>
            <div class="flex items-center my-4">
              <div class="grow border-b border-slate-400"></div>
              <span class="shrink px-1 pb-1 text-slate-400 text-sm">Or</span>
              <div class="grow border-b border-slate-400"></div>
            </div>
            <OAuth title="Continue with Google" />
          </Box>
        </div>
      </Box>
    </>
  );
};

export default SignUp;
