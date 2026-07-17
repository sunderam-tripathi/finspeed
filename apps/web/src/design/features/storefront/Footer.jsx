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
    heading: 'Visit & Owners',
    items: [
      { label: 'Find a store', href: '/stores', route: 'stores' },
      { label: 'Our story', href: '/about', route: 'about' },
      { label: 'Contact', href: '/contact', route: 'contact' },
      { label: 'Distributors', href: '/distributor' },
    ],
  },
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
            We build cycles for dreamers who seek adventure and push their limits. Beyond limits, beyond boundaries.
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

      <div className="store-footer-bottom">
        <span>Ride Beyond Boundaries</span>
        <span>&copy; 2026 Finspeed &middot; MK Electric &middot; Greater Noida</span>
      </div>
    </footer>
  );
}

export default Footer;
