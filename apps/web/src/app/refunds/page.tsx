import type { Metadata } from 'next';
import { LegalPage, Section } from '@/components/legal-page';

export const metadata: Metadata = {
  title: 'Finspeed — Returns & refunds',
  description: 'Finspeed returns, cancellation and refund policy, including transit damage, warranty claims and refund timelines.',
};

export default function RefundsPage() {
  return (
    <LegalPage
      title="Returns & refunds"
      intro="What you can return, how to raise a claim, and when to expect a refund."
    >
      <Section heading="Cancellations">
        <p>An order can be cancelled at no cost any time before it is dispatched — contact us with your order reference. Once a bicycle has been dispatched, cancellation is handled as a return under the terms below.</p>
      </Section>

      <Section heading="Damage in transit">
        <p>Report transit damage within <strong>48 hours</strong> of delivery, with photographs of the packaging and the bicycle. Confirmed transit damage is replaced or refunded in full at no cost to you, including return collection.</p>
      </Section>

      <Section heading="Returns">
        <ul>
          <li>Unused bicycles in their original packaging may be returned within <strong>7 days</strong> of delivery.</li>
          <li>The bicycle must be unridden and complete, with all accessories, documentation and fittings included.</li>
          <li>Return shipping is payable by you unless the return is due to damage, a defect, or our error.</li>
          <li>Assembled, used, or customer-customised bicycles cannot be returned except under warranty.</li>
        </ul>
      </Section>

      <Section heading="Custom builds">
        <p>Custom build requests are quoted and confirmed with you before any payment is taken. Because they are prepared to your specification, a confirmed custom build cannot be returned for change of mind — warranty and transit-damage protections still apply in full.</p>
      </Section>

      <Section heading="Warranty claims">
        <p>Frames carry a five-year structural warranty and components twelve months, from the date of delivery. Warranty covers manufacturing defects; it does not cover wear, accident damage, or damage from misuse or unauthorised modification. Raise a claim with your order reference, the model and variant, and photographs of the issue.</p>
      </Section>

      <Section heading="How to raise a return or claim">
        <p>Contact us with your order reference and a description of the issue, with photographs where relevant. We confirm the outcome and, where a return is approved, arrange collection or give you a return address.</p>
      </Section>

      <Section heading="Refund timelines">
        <p>Approved refunds are issued to the original payment method. Refunds are initiated within <strong>5 working days</strong> of the returned bicycle being received and inspected, or of a transit-damage claim being confirmed. Your bank or card issuer may take a further 5–10 working days to credit the amount. We confirm by email when a refund has been initiated.</p>
      </Section>
    </LegalPage>
  );
}
