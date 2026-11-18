import nodemailer from 'nodemailer';

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  to: string;
}

export interface ContactEmailPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export class SmtpNotConfiguredError extends Error {
  constructor(message = 'SMTP delivery credentials are not configured on the server.') {
    super(message);
    this.name = 'SmtpNotConfiguredError';
  }
}

export function getSmtpConfig(): SmtpConfig | null {
  const host = process.env.SMTP_HOST?.trim() || '';
  const user = process.env.SMTP_USER?.trim() || '';
  const pass = process.env.SMTP_PASS?.trim() || '';

  if (!host || !user || !pass) {
    return null;
  }

  const port = Number(process.env.SMTP_PORT) || 587;
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const from = process.env.SMTP_FROM?.trim() || user;
  const to = process.env.CONTACT_TO_EMAIL?.trim() || 'sunbulbroter@gmail.com';

  return { host, port, secure, user, pass, from, to };
}

export function isSmtpConfigured(): boolean {
  return getSmtpConfig() !== null;
}

function escapeHtml(input: string): string {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export async function sendContactEmail(payload: ContactEmailPayload): Promise<{ messageId: string }> {
  const config = getSmtpConfig();
  if (!config) {
    throw new SmtpNotConfiguredError();
  }

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  const safeName = escapeHtml(payload.name);
  const safeEmail = escapeHtml(payload.email);
  const safeSubject = escapeHtml(payload.subject);
  const safeMessage = escapeHtml(payload.message).replaceAll('\n', '<br />');

  const info = await transporter.sendMail({
    from: `"Portfolio Contact" <${config.from}>`,
    to: config.to,
    replyTo: payload.email,
    subject: `[Portfolio] ${payload.subject}`,
    text: [
      `New message from Ateeq Ur Rehman's Portfolio`,
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      `Subject: ${payload.subject}`,
      '',
      payload.message,
    ].join('\n'),
    html: `
      <div style="font-family: sans-serif; line-height: 1.6; color: #111827; max-width: 600px;">
        <h2 style="margin-bottom: 12px;">New Portfolio Enquiry</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Subject:</strong> ${safeSubject}</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
        <p style="white-space: normal;">${safeMessage}</p>
      </div>
    `,
  });

  return { messageId: info.messageId };
}
