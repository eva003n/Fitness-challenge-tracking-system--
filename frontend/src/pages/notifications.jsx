import { useEffect, useState } from "react";
import { SOCKETEVENTENUM } from "../../contants";
import { getDateByDay, getTimeFromNow } from "../services/formatDate";
import { useSocket } from "../context/socket.io/socketContext";
import { Bell, Loader2, Trophy, HeartCrack, BellRing } from "lucide-react";
import { useAuth } from "../context/authProvider";
import Button from "../components/common/Button";
import Container from "../components/common/Container";
import List from "../components/common/List";
import ListItem from "../components/common/ListItem";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { getNotifications } from "../services";
const NOTIFICATIONS = [
  {
    _id: 3,
    message: "You have gained 10 streaks today",
    createdAt: "2-2-2025",
    seen: false,
    notifyType: "sreaks",
  },
  {
    _id: 2,

    message: "Woow you have completed a challenge",
    createdAt: "2-3-2025",
    seen: false,
    notifyType: "achievement",
  },
  {
    _id: 3,
    message: "1oo steps challenge is due in 2 days",
    createdAt: "12-3-2025",
    seen: false,
    notifyType: "remainder",
  },
];

const Notifications = () => {
  const { user } = useAuth();
  const { socket, handleMarkAsRead, notifications } = useSocket();
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  useEffect(() => {
    const getUserNotifications = async () => {
      try {
        setIsLoading(true);
        const response = await getNotifications(user._id);
        if (response.success) {
          setNotification(response.data);
        }
      } catch (e) {
        console.log(e.message);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };
    getUserNotifications();
    const timer = setTimeout(() => {
      getUserNotifications();
    }, 5000)
    return () => {
      setIsLoading(false);
      clearTimeout(timer);
    };
  }, [notifications]);
  return (
    <Container>
      <div className="mx-auto grid max-w-[48rem] items-start gap-4 rounded-md dark:bg-gray-800/10 px-1 dark:outline-1 outline-gray-700">
        <div className="p-4">
          <p className="sm:text-1xl text-[1.3rem] font-medium text-gray-400">
            Notifications
          </p>
        </div>
        <motion.ul
          animate={{ height: "auto" }}
          transition={{ duration: 0.3 }}
          className="grid gap-2 py-4 transition-all duration-300 sm:px-9"
        >
          {isLoading && !notification &&  (
            <div className="flex justify-center">
              <Loader2 className={isLoading && "animate-spin text-gray-200"} />
            </div>
          )}
          {!isLoading && notification === null && (
            <div className="text-center text-gray-400">
              <p className="">No notifications yet</p>
            </div>
          )}
          {notification &&
            notification.map((notification) => (
              <ListItem
                className="flex items-center gap-4 rounded-2xl bg-slate-100 p-4 dark:outline-1 outline-gray-700 transition-all duration-300 dark:bg-gray-900 hover:dark:bg-gray-800"
                key={notification._id}
              >
                <div className="flex items-center gap-2">
                  {!notification.seen && (
                    <div>
                      <Bell
                        size={10}
                        strokeWidth={0}
                        className="fill-violet-500"
                      />
                    </div>
                  )}
                  <div>
                    {notification.notifyType === "streaks" && (
                      <div>
                        <HeartCrack
                          size={24}
                          strokeWidth={0}
                          className="fill-rose-500"
                        />
                      </div>
                    )}
                    {notification.notifyType === "remainder" && (
                      <div>
                        <BellRing
                          size={24}
                          strokeWidth={0}
                          className="fill-violet-500"
                        />
                      </div>
                    )}
                    {notification.notifyType === "achievement" && (
                      <div>
                        <Trophy
                          size={24}
                          strokeWidth={0}
                          className="fill-amber-500"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <Link
                  to={`#`}
                  title="Tap to mark as read"
                  className="w-full"
                  onClick={() => handleMarkAsRead(notification._id)}
                  // onContextMenu={() => handleMarkAsRead(notification._id)}
                >
                  <div className="flex items-center justify-end gap-4 text-gray-500">
                    <p className="text-[.8rem]">
                      {getTimeFromNow(notification.createdAt)}
                    </p>
                  </div>
                  <div className="mt-2 flex flex-col gap-2">
                    <p className="text-[1rem] text-gray-400">
                      {notification.message}
                    </p>
                  </div>
                </Link>
              </ListItem>
            ))}
        </motion.ul>
      </div>
    </Container>
  );
};

export default Notifications;
