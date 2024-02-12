import { ErrorRequestHandler } from "express";
import { myError } from "./errorType";
import { ZodError } from "zod";
import log from "../config/utils/logger";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof myError) {
    return res.status(err.status).json({
      message: err.message,
    });
  }
  if (err.code && err.code == 11000 && err.keyPattern && err.keyValue) {
    const duplicateField = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      message: `already exist - ${duplicateField} must be unique,`,
      property: err.keyValue,
      index: err.keyPattern,
    });
  }
  if (err instanceof SyntaxError) {
    return res.status(400).json({
      message: "invalid json",
    });
  }
  if (err instanceof ZodError) {
    log.info(err);
    return res.status(400).json({
      message:
        "Validation error " +
        err.issues.map((issue) => issue.message + " path:" + issue.path),
    });
  }
  return res.status(500).json({
    message: err.message,
  });
};
export { errorHandler };
