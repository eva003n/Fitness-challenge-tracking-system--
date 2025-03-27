import { io } from "socket.io-client";
import { createContext, useContext } from "react";
import { Fetch, WebSocket } from "engine.io-client";


//function to establish a socket connection with backend server

const getSocket = () => {
    const token = localStorage.getItem("token")
    return io(import.meta.env.VITE_SOCKET_SERVER_URI,
        {
            // transports:[Fetch],
            withCredentials: true,
            auth:{token},


        }

    )

}
//create a context to hold the socket instance
const SocketContext = createContext({
    socket: null,
    unRead: null, // keeep track on unread notifications count,
    handleMarkAsRead: () => {} ,//update the notification count once a notification is read
    isConnected: false,
    notifications: null,
});

//custom hook that will read socket instance from  the context
const useSocket = () => useContext(SocketContext);
//servers domain


export {
    SocketContext,
    useSocket,
    getSocket
}

