/**
 * Email - Envoi notifications (mock par défaut)
 */
const PROVIDER = process.env.EMAIL_PROVIDER || 'mock';

export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  if (PROVIDER === 'mock') {
    console.log('[MOCK EMAIL]', { to, subject, body: html.slice(0, 100) });
    return true;
  }
  if (PROVIDER === 'resend' && process.env.RESEND_API_KEY) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'noreply@achat-location.com',
        to,
        subject,
        html,
      }),
    });
    return res.ok;
  }
  return false;
}
