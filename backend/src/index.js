// import path from "path"
// import { fileURLToPath } from "url";
// const __fileName = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__fileName)

// import dotenv from "dotenv"
// dotenv.config({
//     path:path.resolve(__dirname, ".env")
// }
// )

import { httpServer } from "./app.js";
import connectMongoDB from "./config/db/index.js";
import logger from "./logger/logger.winston.js";





const port = process.env.PORT || 8080;

connectMongoDB().then(() => {
    httpServer.listen(port, () => {
  
        logger.info(`Server listening on http://localhost:${port}...`);
    })
})


