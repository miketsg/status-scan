import sgMail from "@sendgrid/mail";
import twilio from "twilio";

import { config } from "./config";
import { ChangeEvent } from "./db";

sgMail.setApiKey(config.sendgridApiKey);
const twilioClient = twilio(config.twilio.accountSid, config.twilio.authToken);

export async function sendNotifications(
  url: string,
  changeEvent: ChangeEvent
): Promise<void> {
  const subject = `Website Change Detected: ${url}`;
  const text = `
A change was detected on ${url} at ${changeEvent.timestamp}.
HTTP Status: ${changeEvent.status}
Loading Time: ${changeEvent.loadingTime}ms

Hashes:
- Previous: ${changeEvent.previousHash}
- New: ${changeEvent.newHash}
  `.trim();

  // Send Email via SendGrid
  const emailMsg = {
    to: config.emailRecipients,
    from: config.sendgridSender,
    subject,
    text,
  };
  try {
    await sgMail.send(emailMsg);
    console.log("Email notification sent.");
  } catch (error: any) {
    console.error("Error sending email:", error.message);
  }

  // Send SMS via Twilio
  try {
    for (const recipient of config.twilio.to) {
      await twilioClient.messages.create({
        body: `Change on ${url}: Status ${changeEvent.status}, Time ${changeEvent.loadingTime}ms.`,
        from: config.twilio.from,
        to: recipient,
      });
      console.log(`SMS sent to ${recipient}`);
    }
  } catch (error: any) {
    console.error("Error sending SMS:", error.message);
  }
}
