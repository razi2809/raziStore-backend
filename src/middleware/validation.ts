import { Request, Response, NextFunction, query } from "express";
import { AnyZodObject } from "zod";

const validate=(schema:AnyZodObject)=>{
    return (req: Request, res: Response, next: NextFunction) => {
        try {
          schema.parse({
            body: req.body,
            query:req.query,
            params:req.params
          });
          next();
        } catch (error:any) {
          res.status(400).send(error.errors);
        }
      };
}
export {validate}
