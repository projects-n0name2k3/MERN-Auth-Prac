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
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const SignIn = () => {
  usePageTitle("Sign In");
  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        /^[A-Za-z0-9]{6,}$/.test(value) ? null : "Invalid password",
    },
  });
  return (
    <>
      <div className="bg-gray-100 font-sans">
        <div className="max-w-[1440px] mx-auto h-screen grid place-content-center ">
          <Box
            mx="auto"
            className="shadow-lg p-8 rounded-lg w-[440px] bg-white"
          >
            <h1 className="text-center text-2xl font-bold my-3">Login</h1>
            <form
              onSubmit={form.onSubmit((values) => console.log(values))}
              className="space-y-4"
            >
              <TextInput
                withAsterisk
                label="Email"
                placeholder="your@email.com"
                {...form.getInputProps("email")}
                className="placeholder-black"
              />

              <PasswordInput
                withAsterisk
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
            <Button
              justify="space-between"
              fullWidth
              leftSection={<FcGoogle size={24} />}
              rightSection={<span />}
              mt="md"
              variant="default"
            >
              <span className="text-gray-500">Login with Google</span>
            </Button>
          </Box>
        </div>
      </div>
    </>
  );
};

export default SignIn;
