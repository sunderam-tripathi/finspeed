import type { Metadata } from 'next';
import { LegalPage, Section } from '@/components/legal-page';

export const metadata: Metadata = {
  title: 'Finspeed — Terms of service',
  description: 'The terms on which Finspeed sells bicycles and provides finspeed.online, including orders, pricing, warranty and liability.',
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of service"
      intro="These terms govern your use of finspeed.online and any order you place through it."
    >
      <Section heading="Who we are">
        <p>Finspeed designs and sells bicycles from Greater Noida, Uttar Pradesh, India, and supplies them directly and through authorised dealers. Using this site means you accept these terms.</p>
      </Section>

      <Section heading="Orders">
        <p>An order placed on the site is an offer to buy. It is accepted when we confirm dispatch. We may decline an order — for example where a bicycle is unavailable, a price or specification is shown in error, or we cannot deliver to the address given — and any payment taken for a declined order is refunded in full.</p>
      </Section>

      <Section heading="Custom builds">
        <p>Configurations outside our catalogue specification are handled as custom build requests, not immediate purchases. We confirm compatibility, appearance, availability and final price with you before any payment is taken. Preview imagery for uncatalogued combinations is a reference, not a guarantee of exact appearance.</p>
      </Section>

      <Section heading="Pricing and payment">
        <p>Prices are in Indian Rupees and include applicable taxes unless stated otherwise. Shipping charges are shown before payment. We may change prices at any time, but never after accepting your order. Payment is processed by our payment provider; we do not receive or store your card details.</p>
      </Section>

      <Section heading="Product information">
        <p>We work to describe models, specifications and finishes accurately. Photography is representative; colour reproduction varies between screens, and components may change where a supplier part is superseded by an equivalent or better one. Where a specification is provisional we say so on the product.</p>
      </Section>

      <Section heading="Delivery, returns and warranty">
        <p>Delivery is covered by our shipping policy. Cancellations, returns, refunds and warranty claims are covered by our returns and refunds policy. Both form part of these terms.</p>
      </Section>

      <Section heading="Safe use">
        <p>Bicycles ship partly assembled and must be correctly assembled and checked before riding. Ride within your ability and the law, and wear appropriate protective equipment. We are not responsible for injury or damage arising from incorrect assembly, unauthorised modification, inadequate maintenance, or use beyond the intended purpose of the bicycle.</p>
      </Section>

      <Section heading="Distributor portal">
        <p>The distributor portal is for invited partners. Access credentials are personal to your business and must not be shared. Pricing and account information shown there is confidential and provided for your business use only.</p>
      </Section>

      <Section heading="Site availability and content">
        <p>We aim to keep the site available but do not guarantee uninterrupted access, and we may change or withdraw features. Site content, imagery and branding belong to Finspeed and may not be reproduced commercially without permission.</p>
      </Section>

      <Section heading="Liability">
        <p>Nothing in these terms limits liability that cannot be limited by law, including for death or personal injury caused by our negligence, or for fraud. Subject to that, our liability for any order is limited to the amount you paid for it.</p>
      </Section>

      <Section heading="Governing law and changes">
        <p>These terms are governed by the laws of India and disputes are subject to the courts of Uttar Pradesh. We may update these terms; the version in force when you place an order is the one that applies to it.</p>
      </Section>
    </LegalPage>
  );
}
