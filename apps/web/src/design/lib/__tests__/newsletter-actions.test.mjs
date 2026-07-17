import assert from 'node:assert/strict';
import test from 'node:test';
import {
  NEWSLETTER_CONTACT_EMAIL,
  buildNewsletterMailto,
  deliverNewsletterSubscription,
} from '../newsletter-actions.mjs';

test('newsletter fallback is an honest pre-addressed email action', () => {
  const href = buildNewsletterMailto();
  const url = new URL(href);

  assert.match(href, new RegExp(`^mailto:${NEWSLETTER_CONTACT_EMAIL.replace('.', '\\.')}`));
  assert.equal(url.searchParams.get('subject'), 'Finspeed ride updates');
  assert.match(url.searchParams.get('body'), /Please send me updates/);
});

test('configured newsletter delivery posts the normalized address to the endpoint', async () => {
  let request;
  const response = { ok: true };
  const result = await deliverNewsletterSubscription({
    email: '  rider@example.com  ',
    endpoint: 'https://example.test/newsletter',
    fetcher: async (url, options) => {
      request = { url, options };
      return response;
    },
  });

  assert.equal(result, response);
  assert.equal(request.url, 'https://example.test/newsletter');
  assert.equal(request.options.method, 'POST');
  assert.equal(request.options.headers.Accept, 'application/json');
  assert.equal(request.options.body.get('email'), 'rider@example.com');
  assert.equal(request.options.body.get('source'), 'finspeed-storefront-newsletter');
});

test('newsletter delivery never reports success for a rejected request', async () => {
  await assert.rejects(
    deliverNewsletterSubscription({
      email: 'rider@example.com',
      endpoint: 'https://example.test/newsletter',
      fetcher: async () => ({ ok: false }),
    }),
    /SUBMISSION_FAILED/,
  );

  await assert.rejects(
    deliverNewsletterSubscription({
      email: 'rider@example.com',
      onSubmit: async () => false,
    }),
    /SUBMISSION_REJECTED/,
  );
});
