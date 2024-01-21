import sgMail from "@sendgrid/mail";
const SENDGRID_API_KEY =
  "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";
sgMail.setApiKey(SENDGRID_API_KEY);
export class MSQ {
  to: string;
  from: string;
  subject: string;
  text: string;
  constructor(to: string, from: string, subject: string, text: string) {
    this.to = to;
    this.from = from;
    this.subject = subject;
    this.text = text;
  }
  // Method to send the email
  sendEmail() {
    const msg = {
      to: this.to,
      from: this.from,
      subject: this.subject,
      text: this.text,
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

/* const msg = {
  to: "test@example.com", // Change to your recipient
  from: "test@example.com", // Change to your verified sender
  subject: "Sending with SendGrid is Fun",
  text: "and easy to do anywhere, even with Node.js",
};
sgMail
  .send(msg)
  .then(() => {
    console.log("Email sent");
  })
  .catch((error) => {
    console.error(error);
  });
 */
