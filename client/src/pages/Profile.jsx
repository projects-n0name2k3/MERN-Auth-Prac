import React, { useEffect, useRef, useState } from "react";
import usePageTitle from "../hooks/useTitle";
import {
  Avatar,
  Button,
  Divider,
  Input,
  Menu,
  Modal,
  PasswordInput,
  TextInput,
} from "@mantine/core";
import { useSelector } from "react-redux";
import { MdModeEdit, MdOutlineRemoveRedEye } from "react-icons/md";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { modals } from "@mantine/modals";
const Profile = () => {
  usePageTitle("Profile");
  const { currentUser } = useSelector((state) => state.user);
  const [image, setImage] = useState(undefined);
  const imgRef = useRef(null);
  const [opened, { open, close }] = useDisclosure(false);
  const deactiveBtn = useRef(null);

  const form = useForm({
    initialValues: {
      email: "",
      username: "",
      password: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      username: (value) =>
        /^[A-Za-z0-9\s]{6,}$/.test(value)
          ? null
          : "Username must be has atleast 6 characters",
      password: (value) =>
        /^[A-Za-z0-9]{6,}$/.test(value)
          ? null
          : "Password must be has atleast 6 characters",
    },
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setImage(e.target.result); // Update the state with the image source
      };

      reader.readAsDataURL(file);
    }
  };
  const navigate = useNavigate();
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    form.setValues({
      email: currentUser?.email,
      username: currentUser?.username,
    });
  }, []);
  return (
    <div className="bg-gray-100 font-sans">
      <div className="max-w-[1440px] mx-auto h-[calc(100vh-48px)] flex gap-4 items-center justify-center">
        <div className="w-[30%] shadow-lg rounded-lg bg-white flex flex-col items-center py-4">
          <input
            type="file"
            ref={imgRef}
            hidden
            accept="image/*"
            onChange={handleFileChange}
          />
          <Menu shadow="md">
            <Menu.Target>
              <Avatar
                src={image || currentUser?.profilePicture}
                className="cursor-pointer relative border border-slate-300"
                size="xl"
              ></Avatar>
            </Menu.Target>

            <Menu.Dropdown className="min-w-36">
              <Menu.Item leftSection={<MdOutlineRemoveRedEye />} onClick={open}>
                View avatar
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                leftSection={<MdModeEdit />}
                onClick={() => imgRef.current.click()}
              >
                Edit avatar
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>

          <span className="text-gray-700 font-semibold text-md mt-4">
            {currentUser?.username}
          </span>
          <span className="text-gray-400 text-sm mt-4">
            {currentUser?.email}
          </span>
          <Divider my="md" className="w-full" />

          <form
            onSubmit={form.onSubmit((values) => handleSignUp(values))}
            className="space-y-4 w-[70%]"
          >
            <TextInput label="Email" {...form.getInputProps("email")} />
            <TextInput label="Username" {...form.getInputProps("username")} />
            <PasswordInput
              label="Password"
              {...form.getInputProps("password")}
            />

            <Button type="submit" fullWidth>
              Save Changes
            </Button>
          </form>

          <Divider my="md" className="w-full" />
          <div className="flex items-center justify-between w-full px-3">
            <p className="text-sm font-semibold">Deactivate your account</p>
            <Button
              variant="outline"
              color="red"
              onClick={() => {
                setTimeout(() => {
                  deactiveBtn.current.disabled = true;
                }, 10);
                modals.open({
                  title: "Deactive Account",
                  children: (
                    <>
                      <Divider className="w-full" />
                      <div className="p-3">
                        <Input.Wrapper
                          label={`To confirm, type "${currentUser.email}" in the box below`}
                        >
                          <Input
                            onChange={(e) => {
                              if (e.target.value === currentUser.email) {
                                deactiveBtn.current.disabled = false;
                              } else {
                                deactiveBtn.current.disabled = true;
                              }
                            }}
                          />
                        </Input.Wrapper>

                        <Button
                          variant=""
                          color="red"
                          fullWidth
                          className="mt-3"
                          ref={deactiveBtn}
                          onClick={() => {
                            navigate("/deactive/confirm");
                            modals.closeAll();
                          }}
                        >
                          Deactive my account
                        </Button>
                      </div>
                    </>
                  ),
                });
              }}
            >
              Deactivate
            </Button>
          </div>
        </div>
      </div>
      <Modal opened={opened} onClose={close}>
        <img
          src={image || currentUser?.profilePicture}
          alt=""
          className="w-full h-full object-fit"
        />
      </Modal>
    </div>
  );
};

export default Profile;
