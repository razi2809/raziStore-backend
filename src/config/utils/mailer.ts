import nodemailer, { SendMailOptions } from "nodemailer";
import log from "./logger";
const smpt = {
  user: "gavrwh4oeexuuf6y@ethereal.email",
  pass: "kRXSwhedTFXk7Mvjqe",
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
};

const transporter = nodemailer.createTransport({
  ...smpt,
  auth: {
    user: smpt.user,
    pass: smpt.pass,
  },
});
async function sendEmail(payload: SendMailOptions) {
  transporter.sendMail(payload, (err, info) => {
    if (err) {
      log.error(err, "error sending mail");
      return;
    }
    log.info(`preview url:${nodemailer.getTestMessageUrl(info)}`);
  });
}
export { sendEmail };
