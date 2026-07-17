export const NEWSLETTER_CONTACT_EMAIL = 'support@finspeed.online';

export function buildNewsletterMailto(recipient = NEWSLETTER_CONTACT_EMAIL) {
  const params = new URLSearchParams({
    subject: 'Finspeed ride updates',
    body: 'Hello Finspeed,\n\nPlease send me updates about new bicycles, restocks, and rider stories.\n\nThank you.',
  });

  return `mailto:${recipient}?${params.toString()}`;
}

export async function deliverNewsletterSubscription({
  email,
  endpoint,
  onSubmit,
  fetcher = globalThis.fetch,
}) {
  const normalizedEmail = email.trim();
  if (!normalizedEmail) throw new Error('EMAIL_REQUIRED');

  if (onSubmit) {
    const result = await onSubmit(normalizedEmail);
    if (result === false || result?.ok === false) throw new Error('SUBMISSION_REJECTED');
    return result;
  }

  if (!endpoint || typeof fetcher !== 'function') throw new Error('ENDPOINT_UNAVAILABLE');

  const payload = new FormData();
  payload.append('email', normalizedEmail);
  payload.append('source', 'finspeed-storefront-newsletter');
  payload.append('_subject', 'Finspeed storefront newsletter signup');

  const response = await fetcher(endpoint, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: payload,
  });

  if (!response?.ok) throw new Error('SUBMISSION_FAILED');
  return response;
}
