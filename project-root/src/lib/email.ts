import nodemailer from "nodemailer";

export async function sendVerificationEmail(to: string, subject: string, html: string) {
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
    });
    console.log("✅ Email sent successfully");
  } catch (err) {
    console.error("❌ Failed to send email:", err);
  }
}
