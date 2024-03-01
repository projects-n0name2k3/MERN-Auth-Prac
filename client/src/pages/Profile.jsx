import React, { useEffect, useRef, useState } from "react";
import usePageTitle from "../hooks/useTitle";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Input,
  Menu,
  Modal,
  PasswordInput,
  Progress,
  TextInput,
  useComputedColorScheme,
} from "@mantine/core";
import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { MdModeEdit, MdOutlineRemoveRedEye } from "react-icons/md";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { modals } from "@mantine/modals";
import { checkPassword } from "../utils/helper";
import {
  editProfileFailure,
  editProfileStart,
  editProfileSuccess,
} from "../redux/user/userSlice";
import ErrorBanner from "../components/ErrorBanner";
const Profile = () => {
  usePageTitle("Profile");
  const { currentUser, error } = useSelector((state) => state.user);
  const [image, setImage] = useState(undefined);
  const [preImage, setPreImage] = useState(undefined);
  const [preImageSrc, setPreImageSrc] = useState(undefined);
  const [imageSrc, setImageSrc] = useState(undefined);
  const imgRef = useRef(null);
  const [imagePercentage, setImagePercentage] = useState(undefined);
  const [imageError, setImageError] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const deactiveBtn = useRef(null);
  const colorScheme = useComputedColorScheme();

  const dispatch = useDispatch();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setPreImage(e.target.result); // Update the state with the image source
      };

      reader.readAsDataURL(file);
    }
  };
  const handleFileUpload = (image) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);

      const fileName = new Date().getTime() + image.name;

      const storageRef = ref(storage, fileName);

      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",

        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          setImagePercentage(Math.round(progress));
        },

        (error) => {
          setImageError(true);

          reject(error);
        },

        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageSrc(downloadURL);

            resolve(downloadURL); // Resolve the promise with the downloadURL
          });
        }
      );
    });
  };

  const form = useForm({
    initialValues: {
      email: "",
      username: "",
      password: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      username: (value) =>
        /^[\p{L}\s]+$/u.test(value)
          ? null
          : "Username must be has atleast 6 characters",
    },
  });

  const navigate = useNavigate();
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    dispatch(editProfileFailure(null));
    form.setValues({
      email: currentUser?.email,
      username: currentUser?.username,
    });
  }, []);

  const handleEditProfile = async (values, image) => {
    try {
      dispatch(editProfileStart());
      if (values.password.length > 0 && !checkPassword(values.password)) {
        form.setErrors({
          password: "Password is shorter than 6 characters or invalid",
        });
        return;
      }

      if (image) {
        if (image.name !== preImageSrc) {
          const downloadURL = await handleFileUpload(image);
          const res = await fetch(
            `https://mern-auth-u15p.onrender.com/api/user/edit/${currentUser._id}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ ...values, profilePicture: downloadURL }),
            }
          );
          const data = await res.json();
          if (data.success === false) {
            dispatch(editProfileFailure(data));
            return;
          }
          dispatch(editProfileSuccess(data));
          setPreImageSrc(image.name);
        } else {
          console.log("Duplicate image");
          return;
        }
      }
      const res = await fetch(
        `https://mern-auth-u15p.onrender.com/api/user/edit/${currentUser._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );
      const data = await res.json();
      if (data.success === false) {
        dispatch(editProfileFailure(data));
        return;
      }
      dispatch(editProfileSuccess(data));
    } catch (error) {
      dispatch(editProfileFailure(error));
    }
  };

  return (
    <div className="font-sans">
      <div className="max-w-[1440px] mx-auto h-[calc(100vh-56px)] flex gap-4 items-center justify-center">
        <Box
          className={`w-[30%] shadow-lg rounded-lg flex flex-col items-center py-4 ${
            colorScheme === "dark" ? "border border-white/20" : "bg-white"
          }`}
        >
          <input
            type="file"
            ref={imgRef}
            hidden
            accept="image/*"
            onChange={(e) => {
              setImage(e.target.files[0]);
              handleFileChange(e);
            }}
          />
          <Menu shadow="md">
            <Menu.Target>
              <Avatar
                src={preImage || imageSrc || currentUser?.profilePicture}
                className="cursor-pointer relative border border-slate-300"
                size="xl"
              ></Avatar>
            </Menu.Target>
            {imagePercentage < 100 && imagePercentage > 0 && (
              <div className="w-full flex items-center justify-center flex-col">
                <span className="text-sm">Uploading...</span>
                <Progress value={imagePercentage} className="w-[40%] my-2" />
              </div>
            )}
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

          <span
            className={`${
              colorScheme !== "dark" && "text-gray-700"
            } font-semibold text-md mt-4`}
          >
            {currentUser?.username}
          </span>
          <span
            className={`${
              colorScheme !== "dark" && "text-gray-400"
            } text-sm mt-4`}
          >
            {currentUser?.email}
          </span>
          <Divider my="md" className="w-full" />
          {error && <ErrorBanner message={error.message} />}
          <form
            onSubmit={form.onSubmit((values) =>
              handleEditProfile(values, image)
            )}
            className="space-y-4 w-[70%]"
          >
            <TextInput label="Email" {...form.getInputProps("email")} />
            <TextInput label="Fullname" {...form.getInputProps("username")} />
            <PasswordInput
              label="Password"
              {...form.getInputProps("password")}
            />

            <Button
              type="submit"
              fullWidth
              disabled={
                imagePercentage === undefined
                  ? false
                  : imagePercentage < 100
                  ? true
                  : false
              }
            >
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
        </Box>
      </div>
      <Modal opened={opened} onClose={close}>
        <img
          src={preImage || imageSrc || currentUser?.profilePicture}
          alt=""
          className="w-full h-full object-fit"
        />
      </Modal>
    </div>
  );
};

export default Profile;
