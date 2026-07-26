import React from 'react';

const footerColumns = [
  {
    heading: 'The Bikes',
    items: [
      { label: 'Signature range', href: '/shop', route: 'shop', category: 'all' },
      { label: 'Mountain', href: '/shop?category=mountain', route: 'shop', category: 'mountain' },
      { label: 'City', href: '/shop?category=city', route: 'shop', category: 'city' },
      { label: 'Hybrid', href: '/shop?category=hybrid', route: 'shop', category: 'hybrid' },
    ],
  },
  {
    heading: 'Build & Engineering',
    items: [
      { label: 'Build your ride', href: '/build', route: 'build' },
      { label: 'Our engineering', href: '/engineering', route: 'engineering' },
      { label: 'Assembly guide', href: '/assembly', route: 'assembly' },
      { label: 'Warranty', href: '/warranty', route: 'warranty' },
    ],
  },
  {
    heading: 'Visit & Support',
    items: [
      { label: 'Find a store', href: '/stores', route: 'stores' },
      { label: 'Dealer locator', href: '/dealers', route: 'dealers' },
      { label: 'Our story', href: '/about', route: 'about' },
      { label: 'Contact', href: '/contact', route: 'contact' },
      { label: 'Rider support', href: '/support', route: 'support' },
    ],
  },
];

const guidanceLinks = [
  { label: 'Warranty summary', href: '/warranty', route: 'warranty' },
  { label: 'Delivery & returns questions', href: 'mailto:support@finspeed.online?subject=Finspeed%20delivery%20and%20returns' },
  { label: 'Privacy enquiries', href: 'mailto:support@finspeed.online?subject=Finspeed%20privacy%20enquiry' },
  { label: 'Order terms questions', href: 'mailto:support@finspeed.online?subject=Finspeed%20order%20terms' },
];

function shouldUseClientNavigation(event) {
  return event.button === 0
    && !event.defaultPrevented
    && !event.metaKey
    && !event.ctrlKey
    && !event.shiftKey
    && !event.altKey;
}

function Footer({ onNav, tone = 'light' }) {
  const dark = tone === 'dark';

  function navigate(event, route, category) {
    if (!route || typeof onNav !== 'function' || !shouldUseClientNavigation(event)) return;
    event.preventDefault();
    onNav(route, category);
  }

  return (
    <footer className={`store-footer ${dark ? 'fin-dark store-footer--dark' : 'fin-light store-footer--light'}`}>
      <div className="store-footer-grid">
        <div className="store-footer-brand">
          <a
            className="store-footer-brand__lockup"
            href="/"
            aria-label="Finspeed home"
            onClick={(event) => navigate(event, 'home')}
          >
            <img src={dark ? '/assets/logos/finspeed-mark-light.png' : '/assets/logos/finspeed-mark.png'} alt="" />
            <img src={dark ? '/assets/logos/finspeed-wordmark-dark.svg' : '/assets/logos/finspeed-wordmark-light.svg'} alt="Finspeed" />
          </a>
          <p className="store-footer-brand__statement">
            A focused range of bicycles for everyday streets, mixed routes and trails—supported from Greater Noida.
          </p>
          <nav className="store-footer-contact" aria-label="Contact Finspeed">
            <a href="https://wa.me/919650608982" target="_blank" rel="noreferrer">
              <i data-lucide="message-square" aria-hidden="true" />
              <span>WhatsApp</span>
            </a>
            <a href="mailto:support@finspeed.online">
              <i data-lucide="mail" aria-hidden="true" />
              <span>Email</span>
            </a>
          </nav>
        </div>

        {footerColumns.map((column) => (
          <nav className="store-footer-column" key={column.heading} aria-labelledby={`footer-${column.heading.toLowerCase().replace(/[^a-z]+/g, '-')}`}>
            <h2 id={`footer-${column.heading.toLowerCase().replace(/[^a-z]+/g, '-')}`}>{column.heading}</h2>
            <ul>
              {column.items.map((item) => (
                <li key={item.label}>
                  <a href={item.href} onClick={(event) => navigate(event, item.route, item.category)}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <section className="store-footer-guidance" aria-labelledby="footer-buying-guidance">
        <div>
          <p className="store-footer-guidance__eyebrow">Before you order</p>
          <h2 id="footer-buying-guidance">Confirm the details that matter.</h2>
          <p>Ask Finspeed to confirm the final specification, price, availability, delivery, returns and warranty terms for your bicycle before relying on them.</p>
        </div>
        <nav aria-label="Buying and policy guidance">
          {guidanceLinks.map((item) => (
            <a key={item.label} href={item.href} onClick={(event) => navigate(event, item.route)}>{item.label}</a>
          ))}
        </nav>
      </section>

      <div className="store-footer-bottom">
        <span>Finspeed bicycles</span>
        <span>&copy; 2026 Finspeed &middot; Greater Noida</span>
      </div>
    </footer>
  );
}

export default Footer;
