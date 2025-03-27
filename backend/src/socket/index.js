import logger from "../logger/logger.winston.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { SOCKETEVENTENUM } from "../constants.js";
import ApiError from "../utils/ApiError.js";
import Notification from "../models/notificstion.model.js";
import { markAsRead } from "../controllers/notification.controller.js";


const initializeSocket = (io) => {
return  io.on("connection",  async (socket) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      throw new  ApiError(
          401,
          "Unauthorized handshake, token is missing"
        )
    }
    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);


    const user = await User.findById(decodeToken.userId);

    if (!user) {
      throw  new ApiError(
          401,
          "Unauthorized handshake, user not found"
        )
      
    }
    //if no call next middleware
    socket.user = user;
    //create a room for the user so we can send notifications to the user
    socket.join(String(socket.user._id));

    // const notifications = await getNotifications(socket.user._id)
    // socket
    //   .to(String(socket.user._id))
    //   .emit(SOCKETEVENTENUM.NOTIFY_EVENT, notifications)

    //send a ontime envent to update users streaks
    socket.to(String(socket.user._id)).emit("streaks");
    socket.to(String(socket.user._id)).emit("hello", "world")

      //onetime event listener for read notifications
    socket.on(SOCKETEVENTENUM.NOTIFICATION_READ_EVENT,  async(notificationId, callback) => {
      try {
         await markAsRead(notificationId);
        
        //acknowledge the event
        callback({
          success: true,
        })
      } catch (e) {
        console.log(e.message)
        callback({
          success: false,
        })
        
      }
    });

    //  await streakDateUpdate(socket)
    // socket.on(SOCKETEVENTENUM.UPDATE_STREAK_DATE,  (date, callback) => {
    //   console.log(date)
    //   callback({
    //     success: true
    //   })
      
    // })
    socket.on(SOCKETEVENTENUM.DISCONNETING, () => {
      for(const room of socket.rooms) {
        if (room !== socket.id) {
          socket.to(room).emit("user has left " + socket.id);
        }
      }
        
      });
    

    socket.on(SOCKETEVENTENUM.DISCONNECT, (reason) => {
      logger.info(reason);
      logger.info("user " + socket.user._id + " disconnected");
      if (socket.user._id) {
        socket.leave(socket.user._id);
      }
      socket.emit(SOCKETEVENTENUM.DiSCONNECTED_EVENT, "User disconnected");
    });

  } catch (e) {
    socket.emit(
      SOCKETEVENTENUM.SOCKET_ERROR_EVENT,
      e.message || "Something went wrong while connecting to socket"
    );
  }
}
 )

''}

const onConnectUpdateStreak =  async (socket) => {
  socket.to(socket._id).emit(SOCKETEVENTENUM)


}


const getNotifications = async (userId) => {
  
    const notifications = await Notification.find({ userId }).sort({createdAt: -1});

    return notifications;

    logger.error(e.message);
  
};



export { initializeSocket };
