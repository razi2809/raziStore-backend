import jwt from "jsonwebtoken";
import { JWTpayload } from "../@types/types";
import { myError } from "../errors/errorType";
import { Request } from "express";

const jwtServices={
    generateToken:(payLoad:JWTpayload)=>{
        const secret = process.env.JWT_SECRET as string;
        return jwt.sign(payLoad, secret);

    }, validateToken: (token: string) => {
        const secret = process.env.JWT_SECRET as string;
    
        try {
          const payload = jwt.verify(token, secret);
    
          return payload as JWTpayload;
        } catch (err) {
          return new myError("invalid token", 401);
        }
      }, extractToken:(req: Request) => {
        const authHeader = req.header("Authorization");
        if (
          authHeader &&
          authHeader.length > 7 &&
          authHeader.toLowerCase().startsWith("bearer")
        ) {
          return jwtServices.validateToken(authHeader.substring(7));
        }
        return null;
      }
}
export {
    jwtServices
}