import dayjs from "dayjs";
import pino from "pino";
import logger from "pino";
const level = "info";

const log = pino({
  transport: {
    target: "pino-pretty",
  },
  level,
  base: {
    pid: false,
  },
  timestamp: () => `,"time":"${dayjs().format()}"`,
});
export default log;
