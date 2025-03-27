import { config } from "dotenv";

config({
//   path: `./.env`,
});
console.log(process.env.NODE_ENV);
export const { PORT } = process.env;
