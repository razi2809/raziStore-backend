import dayjs from "dayjs";
import pino from "pino";
import logger from "pino"
require('dotenv').config({ path:  'src/config/dev.env' });
const level=process.env.logLevel 

const log = pino({
    transport: {
      target: 'pino-pretty'
    },
    level,
    base: {
      pid: false
    },
    timestamp: () => `,"time":"${dayjs().format()}"`
  });
export default log