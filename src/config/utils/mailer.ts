import  config  from "config"
import nodemailer, { SendMailOptions } from "nodemailer"
import log from "./logger";
const smpt={
   user: process.env.SMTP_USER!,
   pass: process.env.SMTP_PASS!,
   host: process.env.SMTP_HOST!,
   port: Number(process.env.SMTP_PORT!),
   secure: process.env.SMTP_SECURE!=="false",
   
}
const transporter=nodemailer.createTransport({
    ...smpt,  
      auth:{
        user:smpt.user,pass:smpt.pass
    } 
})
async function sendEmail(payload:SendMailOptions) {
    transporter.sendMail(payload,(err,info)=>{
        if(err){
            log.error(err, "error sending mail")
            return
        }
     log.info(`preview url:${nodemailer.getTestMessageUrl(info)}`)    
    })
}
export {
    sendEmail
}