// import nodemailer from "nodemailer";
import path from "path";
import nodemailer, { SendMailOptions } from "nodemailer";

interface EmailAttachment {
  filename: string;
  content: string;
  encoding: "base64";
  cid: string;
}

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  attachments: SendMailOptions["attachments"] = [] // ✅ correct type for attachments
) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"MovieTicketing 🎟️" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
    attachments,
  });
}