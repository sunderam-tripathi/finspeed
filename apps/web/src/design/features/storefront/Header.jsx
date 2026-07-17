import React from 'react';
import { ArrowRight, createIcons, Moon, Sun, User } from 'lucide';

const menuIcons = { ArrowRight, Moon, Sun, User };

const menuItems = [
  { id: 'bikes', number: '01', label: 'The Bikes', route: 'shop' },
  { id: 'build', number: '02', label: 'Build Your Ride', route: 'build' },
  { id: 'engineering', number: '03', label: 'Our Engineering', route: 'engineering' },
  { id: 'visit', number: '04', label: 'Visit Finspeed', route: 'stores' },
];

const menuContext = {
  bikes: {
    eyebrow: 'Eleven bikes. Three ways to ride.',
    body: 'A tightly edited range for mountain, city, and hybrid riding. Compare by intent, then go deeper on the model that feels right.',
    links: [
      ['Explore all bikes', 'shop'],
      ['Mountain collection', 'shop', 'mountain'],
      ['City collection', 'shop', 'city'],
    ],
    image: '/assets/products/upscaled/bull-shark-1600.webp',
    imageAlt: 'Finspeed Bull Shark mountain bicycle',
  },
  build: {
    eyebrow: 'One frame. Your spec.',
    body: 'Tailor every detail to your ride. Choose components, dial in your fit, and build a bike that is uniquely yours. Saved automatically as you go.',
    links: [
      ['Open the ride studio', 'build'],
      ['Explore the complete range', 'shop'],
      ['See our engineering', 'engineering'],
    ],
    image: '/assets/products/cutouts/mako-shark-side-transparent.png',
    imageAlt: 'Finspeed Mako Shark bicycle in profile',
  },
  engineering: {
    eyebrow: 'Built around the rider.',
    body: 'See how geometry, material, braking, and drivetrain choices become a ride that feels assured from the first turn.',
    links: [
      ['Our design principles', 'engineering'],
      ['Assembly guide', 'assembly'],
      ['Warranty standards', 'warranty'],
    ],
    image: '/assets/products/upscaled/shark-blue-1600.webp',
    imageAlt: 'Finspeed Shark Blue performance bicycle',
  },
  visit: {
    eyebrow: 'Meet the bikes in person.',
    body: 'Find an authorised Finspeed store, speak with a ride specialist, and choose the right frame and setup with confidence.',
    links: [
      ['Find a store', 'stores'],
      ['Talk to Finspeed', 'contact'],
      ['Owner support', 'support'],
    ],
    image: '/assets/products/upscaled/red-snapper-1600.webp',
    imageAlt: 'Finspeed Red Snapper city bicycle',
  },
};

function defaultMenuItem(route) {
  if (route === 'build') return 'build';
  if (route === 'engineering' || route === 'about' || route === 'assembly' || route === 'warranty') return 'engineering';
  if (route === 'stores' || route === 'dealers' || route === 'contact' || route === 'support') return 'visit';
  return 'bikes';
}

function Header({ cartCount, theme, route, onNav, onCart, onAccount, onSearch, onThemeToggle }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [activeItem, setActiveItem] = React.useState(() => defaultMenuItem(route));
  const menuButtonRef = React.useRef(null);
  const dialogRef = React.useRef(null);
  const isDark = theme === 'dark';
  const context = menuContext[activeItem];

  React.useEffect(() => {
    setActiveItem(defaultMenuItem(route));
    setMenuOpen(false);
  }, [route]);

  React.useEffect(() => {
    if (menuOpen) createIcons({ icons: menuIcons });
  }, [activeItem, isDark, menuOpen]);

  React.useEffect(() => {
    if (!menuOpen) return undefined;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    const appRoot = dialogRef.current?.closest('.store-app');
    const backgroundRegions = appRoot
      ? [...appRoot.querySelectorAll('.store-main, .store-newsletter-section, .store-footer')]
      : [];
    const backgroundState = backgroundRegions.map((element) => ({
      element,
      hadInert: element.hasAttribute('inert'),
      ariaHidden: element.getAttribute('aria-hidden'),
    }));
    backgroundRegions.forEach((element) => {
      element.setAttribute('inert', '');
      element.setAttribute('aria-hidden', 'true');
    });
    const focusTarget = dialogRef.current?.querySelector('[data-menu-primary="true"]');
    focusTarget?.focus();

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        setMenuOpen(false);
        window.requestAnimationFrame(() => menuButtonRef.current?.focus());
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])')]
        .filter((element) => !element.disabled && element.getAttribute('aria-hidden') !== 'true');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.documentElement.style.overflow = previousOverflow;
      backgroundState.forEach(({ element, hadInert, ariaHidden }) => {
        if (!hadInert) element.removeAttribute('inert');
        if (ariaHidden === null) element.removeAttribute('aria-hidden');
        else element.setAttribute('aria-hidden', ariaHidden);
      });
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  function go(destination, category) {
    setMenuOpen(false);
    onNav(destination, category);
  }

  return (
    <>
      <header className={`store-header editorial-header editorial-header--${isDark ? 'dark' : 'light'}`}>
        <button
          ref={menuButtonRef}
          type="button"
          className="editorial-header__menu-trigger"
          aria-label={menuOpen ? 'Close' : 'Menu'}
          aria-expanded={menuOpen}
          aria-controls="editorial-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <i data-lucide="menu" aria-hidden="true" />
          <span>Menu</span>
        </button>

        <button type="button" className="editorial-brand" aria-label="Finspeed home" onClick={() => go('home')}>
          <img className="editorial-brand__mark" src={isDark ? '/assets/logos/finspeed-mark-light.png' : '/assets/logos/finspeed-mark.png'} alt="" />
          <img className="editorial-brand__wordmark" src={isDark ? '/assets/logos/finspeed-wordmark-dark.svg' : '/assets/logos/finspeed-wordmark-light.svg'} alt="Finspeed" />
        </button>

        <div className="editorial-header__actions">
          <button type="button" className="editorial-header__build" onClick={() => go('build')}>Build your ride</button>
          <button type="button" className="editorial-icon-button" aria-label="Search" onClick={onSearch}>
            <i data-lucide="search" aria-hidden="true" />
          </button>
          <button type="button" className="editorial-icon-button editorial-header__cart" aria-label="Cart" onClick={onCart}>
            <i data-lucide="shopping-cart" aria-hidden="true" />
            {cartCount > 0 && <span className="editorial-header__cart-count">{cartCount}</span>}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div
          id="editorial-navigation"
          ref={dialogRef}
          className={`editorial-menu editorial-menu--${isDark ? 'dark' : 'light'}`}
          role="dialog"
          aria-modal="true"
          aria-label="Finspeed menu"
        >
          <div className="editorial-menu__primary">
            <nav aria-label="Main navigation" className="editorial-menu__index">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  data-menu-primary={activeItem === item.id ? 'true' : undefined}
                  className={`editorial-menu__item${activeItem === item.id ? ' is-active' : ''}`}
                  aria-current={defaultMenuItem(route) === item.id ? 'page' : undefined}
                  onMouseEnter={() => setActiveItem(item.id)}
                  onFocus={() => setActiveItem(item.id)}
                  onClick={() => go(item.route)}
                >
                  <span className="editorial-menu__number">{item.number}</span>
                  <span className="editorial-menu__label">{item.label}</span>
                  <i data-lucide="arrow-right" aria-hidden="true" />
                </button>
              ))}
            </nav>

            <div className="editorial-menu__secondary" aria-label="Company links">
              <button type="button" onClick={() => go('about')}>Our Story</button>
              <span aria-hidden="true" />
              <button type="button" onClick={() => go('journal')}>Journal</button>
              <span aria-hidden="true" />
              <button type="button" onClick={() => go('contact')}>Contact</button>
            </div>
          </div>

          <aside className="editorial-menu__feature" aria-live="polite">
            <div className="editorial-menu__feature-copy">
              <p className="editorial-menu__eyebrow">{context.eyebrow}</p>
              <p className="editorial-menu__body">{context.body}</p>
              <div className="editorial-menu__feature-links">
                {context.links.map(([label, destination, category]) => (
                  <button key={label} type="button" onClick={() => go(destination, category)}>
                    <i data-lucide="arrow-right" aria-hidden="true" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="editorial-menu__image-well">
              <img src={context.image} alt={context.imageAlt} />
            </div>

            <div className="editorial-menu__owners">
              <span className="editorial-menu__owners-label">Owners</span>
              <button type="button" onClick={() => go('assembly')}>Assembly Guide</button>
              <span aria-hidden="true" />
              <button type="button" onClick={() => go('warranty')}>Warranty</button>
              <span aria-hidden="true" />
                <button type="button" onClick={() => go('support')}>Support</button>
              <button
                type="button"
                className="editorial-menu__utility"
                aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
                onClick={onThemeToggle}
              >
                <i data-lucide={isDark ? 'sun' : 'moon'} aria-hidden="true" />
              </button>
              <button type="button" className="editorial-menu__utility" aria-label="Account" onClick={onAccount}>
                <i data-lucide="user" aria-hidden="true" />
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

export default Header;
