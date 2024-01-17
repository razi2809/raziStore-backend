import { ErrorRequestHandler } from "express";
import { myError } from "./errorType";

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
  return res.status(500).json({
    message: err.message,
  });
};
export { errorHandler };
