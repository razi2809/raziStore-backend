import { config } from "dotenv";
import log from "./utils/logger";
const configEnv = () => {
  config({
    path: `src/config/.env`,
  });
  const Mode = process.env.MODE;
  config({
    path: `src/config/${Mode}.env`,
  });

  log.info(`app is ruuning in ${Mode} mode at port ${process.env.PORT}`);
};
export { configEnv };
