import { TypeOf, date, object, string } from "zod";

export const loginSchema=object({
    body:object({
        email:string({
            required_error:"email is required"
        }).email(),
        password:string({
            required_error:"pssword is required"
    }).min(6,"invalid email or password")
    })
})