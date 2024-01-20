import mongoose from "mongoose";
import log from "../utils/logger";

async function connectToDB() {
  const dbUrl = process.env.DB_CONNECTION_STRING;
  log.info(dbUrl);
  try {
    if (dbUrl) {
      await mongoose.connect(dbUrl);

      log.info("MongoDB connected");
    } else {
      console.log("connectionString is undefined");
    }
  } catch (error) {
    console.log(error);
  }
}
export { connectToDB };
