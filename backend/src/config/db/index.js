import mongoose from "mongoose";
import { DB_NAME } from "../../constants.js";
import logger from "../../logger/logger.winston.js"

const connectMongoDB = async () => {
  try {
    //when using await no need to listen for conection and open events since they have already been emmited in the past
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: DB_NAME,
      // autoCreate:process.env.NODE_ENV === "development",
      // autoIndex: process.env.NODE_ENV === "development",

    });
    //cussessfull connection readystate === 1
    if (mongoose.connection.readyState)
      logger.info("Mongoose successfully connected to Mongodb server");

    //error after initial connection to server
    mongoose.connection.on("error", (e) => {
      logger.error(
        `Mongoose error after initial connection to MongoDB server${e.message}`
      );
    });
    //disconnectiing from mongodb server
    mongoose.connection.on("disconnecting", () => {
      logger.warn(`Disconnecting from MongoDB server...`);
    });
    //disconnection from mongodb server
    mongoose.connection.on("disconnected", () => {
      logger.error("Mongoose disconnected from Mongodb server");
    });
    //reconnected to mongo db server
    mongoose.connection.on("reconnected", () => {
      logger.info("Mongoose reconnected to MongoDB server successfully");
    });
  } catch (e) {
    //any other connection errors
    logger.error(`Mongo db connection error ${e.message}`);
    process.exit(1); //exit process
  }
};

export default connectMongoDB;
