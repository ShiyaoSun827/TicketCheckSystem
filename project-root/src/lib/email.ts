import nodemailer from "nodemailer";


interface EmailAttachment {
  filename: string;
  content: string;
  encoding: "base64";
  cid: string;
}
export async function sendEmail(to: string, subject: string, html: string, attachments: EmailAttachment[] = []) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD, 
    },
  });
  console.log("GMAIL_USER:", process.env.GMAIL_USER);
  console.log("GMAIL_APP_PASSWORD length:", process.env.GMAIL_APP_PASSWORD?.length);

  try {
    await transporter.sendMail({
      from: `"Movie Ticketing" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
      attachments,
    });
    console.log("✅ Email sent successfully");
  } catch (err) {
    console.error("❌ Failed to send email:", err);
  }
}
