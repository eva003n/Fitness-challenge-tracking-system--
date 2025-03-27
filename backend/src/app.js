import express from "express";
import {createServer} from "http"
import cookieParser from "cookie-parser";
import {Server} from "socket.io"
import { rateLimit } from 'express-rate-limit'
import cors from "cors";
import helmet from "helmet";
import morganMiddleware from "./logger/morgan.js";
import ApiError from "./utils/ApiError.js";
import swaggerui from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

import { fileURLToPath } from "url";

const __fileName = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__fileName)

// dotenv.config({
//   path: path.resolve(__dirname, ".env")
// })



const app = express();
//create a new http server and pass express app
const httpServer = createServer(app)

//intergrate socket io with the server
const io = new Server(httpServer,{
    /*options */
    pingTimeout: 60000,//i minute
    cors: {
        origin: process.env.CORS_ORIGIN_URL,
        credentials: true
    }
})

app.set("io", io)
//global middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: ApiError.tooManyRequest(429, "Too many requests, please try again later"),
})
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
//logging request data
app.use(morganMiddleware);
//enable reading resources from diff origin
app.use(
  cors({
    origin: process.env.CORS_ORIGIN_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    optionsSuccessStatus: 200,
    credentials: true,
  })
);
app.use(limiter)
//parse cookies
app.use(cookieParser());
//parse json payloads
app.use(express.json({ limit: "16kb" }));
//parse url encoded payloads
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
//serve static files
app.use(express.static("public"));
//parse cookie header

//health check endpoint
import homeRouter from "./routes/home.routes.js";
import healthCheckRouter from "./routes/healthCheck.routes.js";
//authentication endpoint
import authenticationRouter from "./routes/authentication.routes.js";
//routers
import challengeRouter from "./routes/challenge.routes.js";
import activityRouter from "./routes/activity.routes.js";
import notificationRouter from "./routes/notification.routes.js";
import userRouter from "./routes/user.routes.js";
//must always be the kast endpoint since it matches all undefined endpoints
import notFoundRouter from "./routes/404.routes.js";
//api endpoints
//redirecting to the router then to handler
app.use("/api/v1", homeRouter);
app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/auth", authenticationRouter);
app.use("/api/v1/challenges", challengeRouter);
app.use("/api/v1/activities", activityRouter);
app.use("/api/v1/notifications", notificationRouter);
//users management routes
app.use("/api/v1/users", userRouter);


//socket io initialization
import { initializeSocket } from "./socket/index.js";
initializeSocket(io)
const emitSocketEvent = ( roomId, event, payload) => {
try {
  io.to(roomId.toString()).emit(event, payload);
} catch (e) {
  console.log(e.message)
}


};
//get path of current file but convert it from url  to  file path

const swaggerDocs = YAML.load(`${__dirname}/swagger.yaml`)

//Swagger API documentation
app.use("/",
  swaggerui.serve,
  swaggerui.setup(swaggerDocs)
)
//comes after all middleware have being defined
app.use("*", notFoundRouter);
//error handling middleware
import { apiErrorHandlerMiddleware } from "./middlewares/errorHandler.middleware.js";
app.use(apiErrorHandlerMiddleware);

export { httpServer, emitSocketEvent };
