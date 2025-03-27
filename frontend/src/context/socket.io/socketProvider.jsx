import { useEffect, useRef, useState } from "react";
import { SocketContext, getSocket } from "./socketContext";
import { useAuth } from "../authProvider";
import { SOCKETEVENTENUM } from "../../../contants";
import { markNotificationAsRead } from "../../services";

//create a new socket instance
//creating a new socket intance outside the component to prevent a new instance being created each time during render
const SocketProvider = ({ children }) => {
  const [socket, setSoket] = useState(() => {
    return getSocket();
  });
  const [unRead, setUnRead] = useState(0);

  const [notifications, setNotifications] = useState(() => {
    return JSON.parse(localStorage.getItem("notifications")) || [];
  });
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  //functions
  const onConnect = () => {
    setIsConnected(true);
  };

  const onDisconnect = (reason, details) => {
    setIsConnected(false);
  };

  const onNotificatiion = (data) => {
    const newNotifications = [data, ...notifications];
    setNotifications(newNotifications);
    localStorage.setItem("notifications", JSON.stringify(newNotifications));
    console.log(data);
  };

  //state to store the socket instance
  //   //the moment this component mounts  setup  the socket state
  useEffect(() => {
    socket.on(SOCKETEVENTENUM.CONNECTED_EVENT, onConnect);

    //handle incoming notifications
    socket.on(SOCKETEVENTENUM.NOTIFY_EVENT, onNotificatiion);
    // socket.on(SOCKETEVENTENUM.SOCKET_ERROR_EVENT, onUnAuthorized);
    socket.on(SOCKETEVENTENUM.DISCONNECT, onDisconnect);

    //clean up to make sure we unsubscribe or remove the event listeners  on umount to prevent pilling up listeners on remount
    return () => {
      // socket.off(SOCKETEVENTENUM.SOCKET_ERROR_EVENT, onUnAuthorized);
      socket.off(SOCKETEVENTENUM.CONNECTED_EVENT, onConnect);
      socket.off(SOCKETEVENTENUM.NOTIFY_EVENT, onNotificatiion);
      socket.off(SOCKETEVENTENUM.DISCONNECT, onDisconnect);
    };
  }, [socket]); // run when socket instance changes

  //handle notifications count
  const handleMarkAsRead = async (notificationId) => {
    //update the local state of the notification
    const updatedNotifications = notifications.map((notification) => {
      if (notification._id === notificationId) {
        notification.seen = true;
        return notification;
      }
      return notification;
    });
    //update local storage
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));

    setNotifications(updatedNotifications);
    await markNotificationAsRead(notificationId);

  };

  return (
    //provide the the socket instance to be used by the children via context
    <SocketContext.Provider
      value={{ socket, unRead, notifications, handleMarkAsRead, isConnected }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
