"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import nodemailer from "nodemailer";
import { LOGO_PNG_BASE64 } from "./assets/logo";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  if (!host) {
    throw new Error("Missing required environment variable: SMTP_HOST");
  }

  const user = process.env.SMTP_USER;
  if (!user) {
    throw new Error("Missing required environment variable: SMTP_USER");
  }

  const pass = process.env.SMTP_PASS;
  if (!pass) {
    throw new Error("Missing required environment variable: SMTP_PASS");
  }

  const portStr = process.env.SMTP_PORT;
  if (!portStr) {
    throw new Error("Missing required environment variable: SMTP_PORT");
  }
  const port = Number(portStr);
  if (isNaN(port)) {
    throw new Error("Invalid environment variable: SMTP_PORT must be a valid number");
  }

  const secure = port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    requireTLS: !secure,
    auth: { user, pass },
  });
}

export const sendConfirmationEmail = internalAction({
  args: {
    to: v.string(),
    name: v.string(),
    token: v.string(),
    locale: v.union(v.literal("de"), v.literal("en")),
  },
  handler: async (_ctx, args) => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl) {
      throw new Error("Missing required environment variable: NEXT_PUBLIC_APP_URL");
    }

    const fromAddress = process.env.EMAIL_FROM;
    if (!fromAddress) {
      throw new Error("Missing required environment variable: EMAIL_FROM");
    }

    const replyTo = process.env.EMAIL_REPLY_TO || fromAddress;

    // Prevent SMTP header injection
    if (/[\r\n]/.test(args.to)) {
      throw new Error("Invalid characters in recipient email");
    }

    const isEn = args.locale === "en";
    const fromName = isEn ? "Selim at Trustolino" : "Selim von Trustolino";
    const from = `"${fromName}" <${fromAddress}>`;

    const safeName = escapeHtml(args.name.replace(/[\r\n\t]/g, " ").trim());
    const confirmUrl = isEn
      ? `${appUrl}/en/confirm?token=${encodeURIComponent(args.token)}`
      : `${appUrl}/bestaetigung?token=${encodeURIComponent(args.token)}`;

    const privacyUrl = isEn
      ? `${appUrl}/en/privacy`
      : `${appUrl}/datenschutz`;

    const subject = isEn
      ? "Please confirm your email address for Trustolino"
      : "Bitte bestätige deine E-Mail-Adresse für Trustolino";

    const logoUrl = `${appUrl}/logo.png`;

    const htmlContent = isEn
      ? `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF7F2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1d1d1b; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF7F2; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 560px; background-color: #ffffff; border-radius: 18px; border: 1px solid #e4ede6; overflow: hidden;">
          <!-- Header with Logo -->
          <tr>
            <td align="center" style="background-color: #f6faf7; padding: 32px 24px; border-bottom: 1px solid #e4ede6;">
              <img src="cid:trustolino-logo" alt="Trustolino" width="165" style="display: block; max-width: 165px; height: auto;" />
            </td>
          </tr>

          <!-- Main Content Body -->
          <tr>
            <td style="padding: 36px 32px 32px 32px;">
              <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #458893;">Hello ${safeName},</h2>
              <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #1d1d1b;">
                Thank you for your interest in the Trustolino waitlist! We are thrilled to welcome you to our community.
              </p>

              <!-- Expiration Notice (Above CTA link) -->
              <div style="background-color: #f2f8f4; border-left: 4px solid #a6cfb3; border-radius: 6px; padding: 14px 16px; margin: 24px 0 28px 0;">
                <p style="margin: 0; font-size: 13.5px; line-height: 1.55; color: #234731;">
                  <strong>Notice:</strong> For security reasons, this confirmation link is valid for <strong>30 minutes</strong>. If you did not sign up or allow this period to expire, simply ignore this message – your information will be automatically and permanently removed from our database after 30 minutes.
                </p>
              </div>

              <!-- CTA Button (Solid, No Glow) -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 20px 0 12px 0;">
                <tr>
                  <td align="center">
                    <a href="${confirmUrl}" target="_blank" style="display: inline-block; background-color: #fdc82b; color: #1d1d1b; font-size: 15px; font-weight: 700; text-decoration: none; padding: 13px 28px; border-radius: 8px; text-align: center;">
                      Confirm Email Address Now
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Privacy Notice (Directly below link) -->
              <p style="margin: 0 0 20px 0; font-size: 12.5px; line-height: 1.5; color: #555555; text-align: center;">
                By clicking the confirmation link, you agree to our <a href="${privacyUrl}" target="_blank" style="color: #458893; text-decoration: underline; font-weight: 600;">Privacy Policy</a>.
              </p>

              <!-- Fallback Link (If button does not work) -->
              <p style="margin: 0 0 24px 0; font-size: 12.5px; line-height: 1.55; color: #666666; text-align: center;">
                If the button does not work, you can also copy and paste the following link into your browser:<br />
                <a href="${confirmUrl}" target="_blank" style="color: #458893; word-break: break-all; text-decoration: underline; font-size: 12px; font-weight: 500;">${confirmUrl}</a>
              </p>

              <!-- Automated Message Notice (At the very bottom) -->
              <p style="margin: 0; padding-top: 18px; border-top: 1px solid #edf2ee; font-size: 12px; line-height: 1.5; color: #888888; text-align: center;">
                Please do not reply to this email as it is an automatically generated message.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
      : `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF7F2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1d1d1b; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF7F2; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 560px; background-color: #ffffff; border-radius: 18px; border: 1px solid #e4ede6; overflow: hidden;">
          <!-- Header with Logo -->
          <tr>
            <td align="center" style="background-color: #f6faf7; padding: 32px 24px; border-bottom: 1px solid #e4ede6;">
              <img src="cid:trustolino-logo" alt="Trustolino" width="165" style="display: block; max-width: 165px; height: auto;" />
            </td>
          </tr>

          <!-- Main Content Body -->
          <tr>
            <td style="padding: 36px 32px 32px 32px;">
              <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #458893;">Hallo ${safeName},</h2>
              <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #1d1d1b;">
                vielen Dank für dein Interesse an der Trustolino Warteliste! Wir freuen uns sehr, dass du dabei bist.
              </p>

              <!-- Expiration Notice (Above CTA link) -->
              <div style="background-color: #f2f8f4; border-left: 4px solid #a6cfb3; border-radius: 6px; padding: 14px 16px; margin: 24px 0 28px 0;">
                <p style="margin: 0; font-size: 13.5px; line-height: 1.55; color: #234731;">
                  <strong>Hinweis:</strong> Dieser Bestätigungslink ist aus Sicherheitsgründen <strong>30 Minuten</strong> gültig. Falls du dich nicht angemeldet hast oder den Link verstreichen lässt, kannst du diese Nachricht einfach ignorieren – deine Daten werden nach Ablauf der 30 Minuten automatisch und vollständig gelöscht.
                </p>
              </div>

              <!-- CTA Button (Solid, No Glow) -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 20px 0 12px 0;">
                <tr>
                  <td align="center">
                    <a href="${confirmUrl}" target="_blank" style="display: inline-block; background-color: #fdc82b; color: #1d1d1b; font-size: 15px; font-weight: 700; text-decoration: none; padding: 13px 28px; border-radius: 8px; text-align: center;">
                      Jetzt E-Mail-Adresse bestätigen
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Privacy Notice (Directly below link) -->
              <p style="margin: 0 0 20px 0; font-size: 12.5px; line-height: 1.5; color: #555555; text-align: center;">
                Mit dem Klick auf den Bestätigungslink stimmst du unserer <a href="${privacyUrl}" target="_blank" style="color: #458893; text-decoration: underline; font-weight: 600;">Datenschutzerklärung</a> zu.
              </p>

              <!-- Fallback Link (If button does not work) -->
              <p style="margin: 0 0 24px 0; font-size: 12.5px; line-height: 1.55; color: #666666; text-align: center;">
                Falls die Schaltfläche nicht funktioniert, kannst du auch den folgenden Link kopieren und in deinen Browser einfügen:<br />
                <a href="${confirmUrl}" target="_blank" style="color: #458893; word-break: break-all; text-decoration: underline; font-size: 12px; font-weight: 500;">${confirmUrl}</a>
              </p>

              <!-- Automated Message Notice (At the very bottom) -->
              <p style="margin: 0; padding-top: 18px; border-top: 1px solid #edf2ee; font-size: 12px; line-height: 1.5; color: #888888; text-align: center;">
                Bitte antworte nicht auf diese E-Mail, da es sich um eine automatisch generierte Nachricht handelt.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    const safeTextName = args.name.replace(/[\r\n\t]/g, " ").trim();

    const textContent = isEn
      ? `Hello ${safeTextName},

Thank you for your interest in the Trustolino waitlist!

Notice: For security reasons, this confirmation link is valid for 30 minutes. If you did not sign up or let this period expire, simply ignore this message – your information will be automatically and permanently removed from our database after 30 minutes.

Confirm your email address here:
${confirmUrl}

By clicking the confirmation link, you agree to our Privacy Policy (${privacyUrl}).

If the button does not work, you can also copy and paste the following link into your browser:
${confirmUrl}

Please do not reply to this email as it is an automatically generated message.`
      : `Hallo ${safeTextName},

vielen Dank für dein Interesse an der Trustolino Warteliste!

Hinweis: Dieser Bestätigungslink ist aus Sicherheitsgründen 30 Minuten gültig. Falls du dich nicht angemeldet hast oder den Link verstreichen lässt, kannst du diese Nachricht einfach ignorieren – deine Daten werden nach Ablauf der 30 Minuten automatisch und vollständig gelöscht.

Bestätige deine E-Mail-Adresse hier:
${confirmUrl}

Mit dem Klick auf den Bestätigungslink stimmst du unserer Datenschutzerklärung (${privacyUrl}) zu.

Falls die Schaltfläche nicht funktioniert, kannst du auch den folgenden Link kopieren und in deinen Browser einfügen:
${confirmUrl}

Bitte antworte nicht auf diese E-Mail, da es sich um eine automatisch generierte Nachricht handelt.`;

    const transporter = getTransporter();
    await transporter.sendMail({
      from,
      replyTo,
      to: args.to,
      subject,
      text: textContent,
      html: htmlContent,
      attachments: [
        {
          filename: "logo.png",
          content: LOGO_PNG_BASE64,
          encoding: "base64",
          cid: "trustolino-logo",
        },
      ],
    });
  },
});
