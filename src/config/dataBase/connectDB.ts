import mongoose from "mongoose";
import { configEnv } from "../envExtractor";
import log from "../utils/logger";

async function connectToDB() {
const dbUrl=process.env.DB_CONNECTION_STRING

try {
    if (dbUrl) {
      await mongoose.connect(dbUrl);
    //   console.log();
    
      log.info("MongoDB connected")
    } else {
      console.log("connectionString is undefined");
    }
  } catch (error) {
    console.log(error);
  }
}
export{connectToDB}