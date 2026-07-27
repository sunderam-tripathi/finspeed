import type { Metadata } from 'next';
import { LegalPage, Section } from '@/components/legal-page';

export const metadata: Metadata = {
  title: 'Finspeed — Privacy policy',
  description: 'How Finspeed collects, uses, stores and protects personal information, and the choices available to you.',
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      intro="This policy explains what information Finspeed collects when you use finspeed.online, why we collect it, and the control you have over it."
    >
      <Section heading="Information we collect">
        <p>We collect only what a request or order needs:</p>
        <ul>
          <li><strong>Information you give us</strong> — name, email address, phone number, and delivery or billing address when you place an order, request a custom build, or contact support.</li>
          <li><strong>Business information</strong> — for distributor enquiries, your business name, GSTIN, and contact details.</li>
          <li><strong>Analytics</strong> — anonymised usage events, and only after you accept analytics in the consent banner. Decline and no analytics events are sent.</li>
          <li><strong>Local browser storage</strong> — your cart, saved build configuration, and theme preference are stored in your browser. They are not transmitted to us until you submit an order or request.</li>
        </ul>
      </Section>

      <Section heading="How we use it">
        <p>To fulfil and support orders and custom-build requests, to answer enquiries, to arrange delivery and warranty service, to meet tax and accounting obligations, and — where you have consented — to understand how the site is used so we can improve it. We do not sell personal information.</p>
      </Section>

      <Section heading="Sharing">
        <p>We share information only with parties that help us deliver the service: payment processors, logistics and delivery partners, and authorised Finspeed dealers handling your order or service request. Each receives only what their task requires. We also disclose information where the law requires it.</p>
      </Section>

      <Section heading="Payments">
        <p>Card, UPI and netbanking details are entered directly with our payment provider and are never received or stored on Finspeed systems. We retain only the transaction reference and status needed to service your order.</p>
      </Section>

      <Section heading="Retention">
        <p>Order and invoice records are retained as long as tax and accounting law requires. Enquiry and support correspondence is kept only as long as needed to resolve the matter and any follow-up. Analytics data is retained in aggregate.</p>
      </Section>

      <Section heading="Your choices">
        <ul>
          <li>Accept or decline analytics at any time through the consent banner; a declined choice is remembered and honoured on later visits.</li>
          <li>Request a copy, correction, or deletion of the personal information we hold about you.</li>
          <li>Ask us to stop contacting you about anything other than an order already in progress.</li>
        </ul>
        <p>To exercise any of these, contact us using the details on our contact page. We respond within a reasonable period and will confirm what action we have taken.</p>
      </Section>

      <Section heading="Security">
        <p>The site is served over HTTPS, dealer pricing and portal records are held behind a server boundary rather than in the public browser bundle, and access to customer data is limited to staff who need it. No system is perfectly secure, and we will tell affected people promptly if a breach materially affects them.</p>
      </Section>

      <Section heading="Children">
        <p>Finspeed does not knowingly collect personal information from children. Purchases of bicycles sized for children are made by an adult, whose details we hold.</p>
      </Section>

      <Section heading="Changes and contact">
        <p>If this policy changes materially we will update the date above and, where the change affects existing orders, tell affected customers directly. Questions about this policy, or about the information we hold, should go to the contact details on our contact page.</p>
      </Section>
    </LegalPage>
  );
}
