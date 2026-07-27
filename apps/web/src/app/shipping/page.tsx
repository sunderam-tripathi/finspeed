import type { Metadata } from 'next';
import { LegalPage, Section } from '@/components/legal-page';

export const metadata: Metadata = {
  title: 'Finspeed — Shipping policy',
  description: 'How Finspeed dispatches, delivers and tracks bicycles, including timelines, charges and delivery checks.',
};

export default function ShippingPage() {
  return (
    <LegalPage
      title="Shipping policy"
      intro="How and when your bicycle reaches you, and what to check when it arrives."
    >
      <Section heading="Dispatch">
        <p>Orders are dispatched ex-works from Greater Noida, Uttar Pradesh. In-stock bicycles are typically dispatched within <strong>3–5 working days</strong> of payment confirmation. Custom builds are dispatched to the timeline confirmed in your quote. We tell you the dispatch date and tracking details by email.</p>
      </Section>

      <Section heading="Delivery timelines">
        <p>Delivery is typically <strong>3–7 working days</strong> after dispatch within India, depending on destination. Remote and hill destinations may take longer. These are estimates from our logistics partners, not guarantees; we keep you informed if a consignment is delayed.</p>
      </Section>

      <Section heading="Charges">
        <p>Shipping charges are shown before payment and depend on destination and consignment size. Where an order qualifies for free delivery, that is stated at checkout. Distributor consignments ship on the terms in your dealer agreement.</p>
      </Section>

      <Section heading="Delivery and inspection">
        <ul>
          <li>Someone aged 18 or over must be available to receive the consignment.</li>
          <li>Inspect the packaging before signing. If it is visibly damaged, note this on the delivery receipt and photograph it.</li>
          <li>Report any transit damage within <strong>48 hours</strong> — see our returns and refunds policy.</li>
        </ul>
      </Section>

      <Section heading="Assembly">
        <p>Bicycles ship partly assembled and require final assembly — handlebars, front wheel, pedals and seat height — before riding. Our assembly guide covers the steps. If you would prefer a professional build, an authorised Finspeed dealer can complete it; the dealer locator lists nearby locations.</p>
      </Section>

      <Section heading="Address changes and failed delivery">
        <p>Tell us before dispatch if your address changes; afterwards we can only request redirection through the carrier and cannot guarantee it. If delivery fails because nobody is available or the address is incorrect, we contact you to arrange redelivery; repeated failed attempts may incur a further shipping charge.</p>
      </Section>

      <Section heading="Serviceable areas">
        <p>We currently deliver within India. For enquiries about destinations we do not yet serve, contact us and we will tell you what is possible.</p>
      </Section>
    </LegalPage>
  );
}
