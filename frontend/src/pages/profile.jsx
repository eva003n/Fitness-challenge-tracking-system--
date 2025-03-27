import { useEffect, useState } from "react";

import Avatar from "../components/common/avatar";
import Input from "../components/common/input";
import Label from "../components/common/label";
import { Mail, Flame } from "lucide-react";
import { Twitter } from "lucide-react";
import Button from "../components/common/Button";
import { User } from "lucide-react";
import { Instagram } from "lucide-react";
import { Pen, Trash2, Loader2, Camera } from "lucide-react";
import { motion } from "motion/react";
import StatsCard from "../components/business/StatsCard";
import {
  deleteUserAccount,
  getUserProfile,
  updateUserProfile,
} from "../services";
import { toast } from "react-toastify";
import Loader from "../components/common/Loader";
import { useParams } from "react-router-dom";
import TextArea from "../components/common/textArea";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authProvider";
import Container from "../components/common/Container";
import { useSocket } from "../context/socket.io/socketContext";

//container mx-auto grid md:grid-cols-[300px_1fr] gap-4
const Profile = () => {
  const { user, logOut } = useAuth();
  const { socket } = useSocket();
  const [update, setUpdate] = useState(false);

  const [data, setData] = useState({
    email: user.email,
    userName: user.email.split("@")[0] || "",
    bio: user.bio,
    name: " ",
    weight: 0,
    socialsLinks: {
      twitter: "http",
      instagram: "http",
      tiktok: "http",
    },

    avatar: "",
    // placeHolder:""
  });
  const [isPlaceholder, setIsPlaceholder] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const getProfile = async () => {
      try {
        // setIsLoading(true);
        const response = await getUserProfile(user._id);
        if (response.success) {
          localStorage.setItem("user", JSON.stringify(response.data));
          // setIsLoading(false);
          //  toast.info(response.message)
          setData(response.data);
        }
      } catch (e) {
        // setIsLoading(false);
        console.log(e);
      }
    };
    getProfile();
  }, [isLoading]);

  const handleChange = (e) => {
    try {
      const { files, name, value } = e.target;

      // const [file] = files;
      const reader = new FileReader();
      if (files && files.length) {
        reader.onload = () => {
          setData({
            ...data,
            [name]: files[0],
          });
          setIsPlaceholder(() => reader.result);
        };
        reader.readAsDataURL(files[0]);
      }

      setData({
        ...data,
        [name]: value,
      });

      console.log(data);
    } catch (e) {
      console.log(e.message);
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    setUpdate(true);
  };
  const handleProfileUpdate = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      const response = await updateUserProfile(user._id, data);
      //   // setData(response.data)
      setIsLoading(false);
      setUpdate(false);
      toast.info(response.message);
    } catch (e) {
      setIsLoading(false);
      console.log(e);
      toast.error(e.message);
    }
  };
  const handleAccountDeletion = async (e) => {
    try {
      e.stopPropagation();
      e.preventDefault();
      setIsLoading(true);
      const response = await deleteUserAccount(user._id);

      if (response.success) {
        await logOut();

        toast.info(response.message);
        setIsLoading(false);
      }
    } catch (e) {
      setIsLoading(false);
      toast.error(e.message);
    }
  };
  return (
    <Container>
      {/* {isLoading ? (
        <Loader />
      ) : ( */}
      <>
        <form
          className="mx-auto grid gap-4 sm:grid-cols-2 sm:gap-12"
          onSubmit={handleProfileUpdate}
        >
          <Button
            htmlFor="edit-profile"
            className="justify-e flex cursor-pointer items-center rounded-full text-violet-600"
            icon={Pen}
            name={"Edit Profile"}
            onClick={handleClick}
          ></Button>

          <div className="col-start-1 flex flex-col gap-4">
            <div className="grid grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] gap-4">
              <StatsCard
                title={"Current streaks"}
                count={data.streaks ? data.streaks.current : 0}
                icon={Flame}
                color={"fill-rose-600 text-rose-600"}
              />

              <StatsCard
                title={"Longest streak"}
                count={data.streaks ? data.streaks.best : 0}
                icon={Flame}
                color={"fill-violet-600 text-violet-600"}
              />
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mx-auto flex flex-col items-center gap-4 md:flex-row"
            >
              <div className="">
                <div className="relative aspect-square w-40 overflow-hidden rounded-full dark:bg-gray-800">
                  {/* <ProfileAvatar width={10}  /> */}
                  {isPlaceholder ? (
                    <img
                      src={isPlaceholder}
                      className={`h-full w-full transition duration-300`}
                    />
                  ) : (
                    <Avatar
                      width={10}
                      className="hover:cursor-pointer hover:brightness-50"
                    />
                  )}

                  <Label
                    htmlFor="edit-profile"
                    className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center justify-center gap-4 rounded-full sm:flex-row"
                    icon={Camera}
                  ></Label>
                </div>

                <Input
                  type="file"
                  id="edit-profile"
                  className="hidden w-min"
                  disabled={!update}
                  name="avatar"
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="gaP-4 grid">
                <Label name={"Username"} />
                <Input
                  id="email"
                  type="text"
                  name="userName"
                  value={data.userName}
                  className="px-2 text-2xl dark:bg-slate-700"
                  onChange={(e) => handleChange(e)}
                  disabled={!update}
                />
              </div>
            </motion.div>
          </div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            // className="col-start-2 grid gap-4"
          >
            <div className="grid gap-4">
              <Label name={"Email"} />
              <Input
                icon={Mail}
                id="email"
                type="email"
                name="email"
                value={data.email}
                className="pl-10 dark:bg-slate-700"
                onChange={(e) => handleChange(e)}
                disabled={!update}
              />

              <Label name={"Name"} />

              <Input
                icon={User}
                id="text"
                type="text"
                name="name"
                value={data.name}
                className="pl-10 dark:bg-slate-700"
                onChange={(e) => handleChange(e)}
                disabled={!update}
              />
              <Label name={"Weight"} />
              <Input
                id="text"
                type="text"
                name="weight"
                value={data.weight}
                className="px-2 dark:bg-slate-700"
                onChange={(e) => handleChange(e)}
                disabled={!update}
              />
              <Label name={"Bio"} />
              <TextArea
                value={data.bio}
                name="bio"
                disabled={!update}
                onChange={(e) => handleChange(e)}
              />

              {update && (
                <div>
                  <Button
                    name={isLoading ? "Saving" : "Save changes"}
                    className="float-right bg-violet-600 tracking-wide"
                    icon={isLoading && Loader2}
                    isLoading={isLoading}
                    loader={true}
                    disabled={isLoading}
                  />
                </div>
              )}
            </div>
          </motion.div>
        </form>
        <div className="mx-auto flex w-[90%] max-w-[65rem] justify-end p-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex w-full items-center justify-between sm:w-[48%]"
          >
            <p className="flex flex-col gap-4 text-2xl text-rose-700">
              Danger zone <span className="text-[1rem]">Delete account</span>
            </p>
            <Button
              icon={isLoading ? Loader2 : Trash2}
              name={isLoading ? "Deleting" : "Delete "}
              className="float-right bg-rose-600 tracking-wide"
              onClick={handleAccountDeletion}
              loader={isLoading ? true : false}
              isLoading={isLoading}
              disabled={isLoading}
            ></Button>
          </motion.div>
        </div>
      </>

      {/* )} */}
    </Container>
  );
};

export default Profile;
