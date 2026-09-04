import nodemailer from "nodemailer";

interface SendConfirmationEmailParams {
  to: string;
  name: string;
  token: string;
  locale: "de" | "en";
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT) || 465;
  const secure = process.env.SMTP_SECURE !== "false";

  if (!host || !user || !pass) {
    throw new Error(
      "Missing required SMTP configuration (SMTP_HOST, SMTP_USER, SMTP_PASS)"
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

export async function sendConfirmationEmail({
  to,
  name,
  token,
  locale,
}: SendConfirmationEmailParams): Promise<{ success: boolean; error?: string }> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    return { success: false, error: "NEXT_PUBLIC_APP_URL is not configured" };
  }

  const isEn = locale === "en";
  const fromName = isEn
    ? process.env.SMTP_FROM_NAME_EN
    : process.env.SMTP_FROM_NAME_DE;
  const fromAddress = process.env.SMTP_FROM_EMAIL;
  const replyTo = process.env.SMTP_REPLY_TO;

  if (!fromName || !fromAddress || !replyTo) {
    return { success: false, error: "Missing required sender email configuration" };
  }

  const confirmUrl = isEn
    ? `${appUrl}/en/confirm?token=${token}`
    : `${appUrl}/bestaetigung?token=${token}`;

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
              <img src="${logoUrl}" alt="Trustolino" width="165" style="display: block; max-width: 165px; height: auto;" />
            </td>
          </tr>

          <!-- Main Content Body -->
          <tr>
            <td style="padding: 36px 32px 32px 32px;">
              <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #458893;">Hello ${name},</h2>
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
              <img src="${logoUrl}" alt="Trustolino" width="165" style="display: block; max-width: 165px; height: auto;" />
            </td>
          </tr>

          <!-- Main Content Body -->
          <tr>
            <td style="padding: 36px 32px 32px 32px;">
              <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #458893;">Hallo ${name},</h2>
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

  const textContent = isEn
    ? `Hello ${name},

Thank you for your interest in the Trustolino waitlist!

Notice: This confirmation link is valid for 30 minutes. If you did not sign up or let this period expire, simply ignore this message – your information will be automatically and permanently removed from our database after 30 minutes.

Confirm your email address here:
${confirmUrl}

By clicking the confirmation link, you agree to our Privacy Policy (${privacyUrl}).

If the button does not work, you can also copy and paste the following link into your browser:
${confirmUrl}

Please do not reply to this email as it is an automatically generated message.`
    : `Hallo ${name},

vielen Dank für dein Interesse an der Trustolino Warteliste!

Hinweis: Dieser Bestätigungslink ist aus Sicherheitsgründen 30 Minuten gültig. Falls du dich nicht angemeldet hast oder den Link verstreichen lässt, kannst du diese Nachricht einfach ignorieren – deine Daten werden nach Ablauf der 30 Minuten automatisch und vollständig gelöscht.

Bestätige deine E-Mail-Adresse hier:
${confirmUrl}

Mit dem Klick auf den Bestätigungslink stimmst du unserer Datenschutzerklärung (${privacyUrl}) zu.

Falls die Schaltfläche nicht funktioniert, kannst du auch den folgenden Link kopieren und in deinen Browser einfügen:
${confirmUrl}

Bitte antworte nicht auf diese E-Mail, da es sich um eine automatisch generierte Nachricht handelt.`;

  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"${fromName}" <${fromAddress}>`,
      replyTo,
      to,
      subject,
      text: textContent,
      html: htmlContent,
    });
    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to send email";
    return { success: false, error: message };
  }
}
