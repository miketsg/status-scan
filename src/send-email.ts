import nodemailer from "nodemailer";

import { config } from "./config";
import { ChangeEvent } from "./db";

// Create reusable transporter using SMTP
const transporter = nodemailer.createTransport({
  host: config.smtpHost,
  port: config.smtpPort,
  secure: config.smtpPort === 465,
  auth: {
    user: config.smtpUser,
    pass: config.smtpPass,
  },
});

export async function sendEmail(
  url: string,
  changeEvent: ChangeEvent
): Promise<void> {
  const subject = `Website Change Detected: ${url}`;

  const textContent = `
Website Change Detected: ${url}
  
A change was detected on ${url} at ${changeEvent.timestamp}.
HTTP Status: ${changeEvent.status}
Loading Time: ${changeEvent.loadingTime}ms
  
Hashes:
- Previous: ${changeEvent.previousHash}
- New: ${changeEvent.newHash}
  `;

  const htmlContent = `
<html>
  <body>
    <h1>Website Change Detected: ${url}</h1>
    <p>A change was detected on ${url} at ${changeEvent.timestamp}.</p>
    <p>HTTP Status: ${changeEvent.status}</p>
    <p>Loading Time: ${changeEvent.loadingTime}ms</p>
    <p>Hashes:</p>
    <ul>
      <li>Previous: ${changeEvent.previousHash}</li>
      <li>New: ${changeEvent.newHash}</li>
    </ul>
  </body>
</html>
  `.trim();

  try {
    const info = await transporter.sendMail({
      from: `"Website Monitor" <${config.smtpUser}>`,
      to: config.emailRecipients.join(","),
      subject,
      text: textContent,
      html: htmlContent,
      replyTo: config.smtpUser,
    });

    console.log("✅ Email sent successfully:", info.messageId);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
}
