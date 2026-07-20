// Finspeed storefront — honest mock account access for the design runtime.
import React from 'react';
import Image from 'next/image';
import { Button, Input } from '../../ui/index.js';
import { demoUser } from '../../data/storefront.js';
import { useLucideIcons } from '../../lib/useLucideIcons.js';
import styles from './Auth.module.css';

const accountTabs = [
  { value: 'signin', label: 'Sample rider' },
  { value: 'register', label: 'New profile preview' },
];

function Auth({ mode = 'signin', onAuth, onNav }) {
  const [tab, setTab] = React.useState(mode === 'register' ? 'register' : 'signin');
  const tabRefs = React.useRef({});
  useLucideIcons();

  function submit(event) {
    event.preventDefault();
    if (!onAuth) return;

    const fields = new FormData(event.currentTarget);
    if (tab === 'register') {
      const name = String(fields.get('name') || '').trim();
      const email = String(fields.get('email') || '').trim();
      const phone = String(fields.get('phone') || '').trim();
      onAuth({
        ...demoUser,
        name: name || demoUser.name,
        email: email || demoUser.email,
        phone: phone || demoUser.phone,
        since: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
      });
      return;
    }

    onAuth({ ...demoUser });
  }

  function navigate(destination, fallback) {
    if (onNav) {
      onNav(destination);
      return;
    }
    window.location.assign(fallback);
  }

  function handleTabKeyDown(event, index) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();

    let nextIndex = index;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = accountTabs.length - 1;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % accountTabs.length;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + accountTabs.length) % accountTabs.length;

    const nextTab = accountTabs[nextIndex].value;
    selectTab(nextTab);
    tabRefs.current[nextTab]?.focus();
  }

  function selectTab(nextTab) {
    setTab(nextTab);
  }

  const isSigningIn = tab === 'signin';

  return (
    <div className={styles.page}>
      <section className={styles.story} aria-labelledby="auth-story-title">
        <div className={styles.brand} aria-label="Finspeed">
          <span className={`${styles.brandLockup} ${styles.brandLight}`}>
            <Image src="/assets/logos/finspeed-mark.png" alt="" aria-hidden="true" width={50} height={50} priority />
            <Image src="/assets/logos/finspeed-wordmark-light.svg" alt="Finspeed" width={178} height={36} priority />
          </span>
          <span className={`${styles.brandLockup} ${styles.brandDark}`}>
            <Image src="/assets/logos/finspeed-mark-light.png" alt="" aria-hidden="true" width={50} height={50} priority />
            <Image src="/assets/logos/finspeed-wordmark-dark.svg" alt="Finspeed" width={178} height={36} priority />
          </span>
        </div>

        <div className={styles.storyCopy}>
          <p className={styles.kicker}>Owners / Account</p>
          <span className={styles.rule} aria-hidden="true" />
          <h2 id="auth-story-title">Your ride,<br />remembered.</h2>
          <p className={styles.intro}>
            Preview how orders, saved builds and service details can live in one considered place.
          </p>
        </div>

        <ul className={styles.promises} aria-label="Owner care included with your bicycle">
          <li>
            <i data-lucide="shield-check" aria-hidden="true" />
            <span className={styles.promiseCopy}>
              <strong>2-year</strong>
              <span>Frame warranty</span>
            </span>
          </li>
          <li>
            <i data-lucide="wrench" aria-hidden="true" />
            <span className={styles.promiseCopy}>
              <strong>Two complimentary</strong>
              <span>Services in the first six months</span>
            </span>
          </li>
        </ul>

        <p className={styles.policyNote}>Published summary only. Ask Finspeed for current eligibility, exclusions and full terms.</p>

        <p className={styles.origin}>Finspeed · MK Electric · Greater Noida</p>
      </section>

      <section className={styles.formPanel} aria-labelledby="auth-heading">
        <div className={styles.formShell}>
          <p className={styles.formIndex}>Owner experience preview / 01</p>
          <h1 id="auth-heading">{isSigningIn ? 'Explore the owner space.' : 'Personalise your preview.'}</h1>
          <p className={styles.formIntro}>
            {isSigningIn
              ? 'Open a clearly marked sample profile to explore saved rides, orders and service details.'
              : 'Use your details to personalise a local preview. This does not create or register a Finspeed account.'}
          </p>

          <div className={styles.tabs} role="tablist" aria-label="Owner account preview" aria-orientation="horizontal">
            {accountTabs.map((item, index) => {
              const selected = item.value === tab;
              return (
                <button
                  key={item.value}
                  id={`auth-tab-${item.value}`}
                  ref={(node) => { tabRefs.current[item.value] = node; }}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="auth-form-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => selectTab(item.value)}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                >
                  <span>0{index + 1}</span>
                  {item.label}
                </button>
              );
            })}
          </div>

          <div
            id="auth-form-panel"
            className={styles.tabPanel}
            role="tabpanel"
            aria-labelledby={`auth-tab-${tab}`}
            tabIndex={0}
          >
            <form key={tab} className={styles.form} aria-describedby="auth-preview-note" onSubmit={submit}>
              {isSigningIn ? (
                <div className={styles.sampleProfile} aria-label="Sample rider profile">
                  <span aria-hidden="true">AM</span>
                  <div>
                    <strong>{demoUser.name}</strong>
                    <small>Sample orders and delivery details</small>
                  </div>
                </div>
              ) : (
                <>
                  <Input id="auth-name" name="name" label="Full name" placeholder="Arjun Mehta" autoComplete="name" required />
                  <Input
                    id="auth-email"
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="you@email.com"
                    autoComplete="email"
                    required
                    iconLeft={<i data-lucide="mail" aria-hidden="true" />}
                  />
                <Input
                  id="auth-phone"
                  name="phone"
                  label="Phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  autoComplete="tel"
                  required
                  iconLeft={<i data-lucide="phone" aria-hidden="true" />}
                />
                </>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                full
                bevel
                disabled={!onAuth}
                style={{ borderRadius: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-sm)' }}
                iconRight={<i data-lucide="arrow-right" aria-hidden="true" />}
              >
                {isSigningIn ? 'Open sample profile' : 'Open personalised preview'}
              </Button>
            </form>
          </div>

          <p id="auth-preview-note" className={styles.previewNote}>
            <i data-lucide="info" aria-hidden="true" />
            Preview only. No authentication is performed, no password is requested, and no live account is created. Profile details stay in this browser.
          </p>

          <div className={styles.divider} aria-hidden="true"><span>or</span></div>

          <Button
            variant="outline"
            size="lg"
            full
            onClick={() => navigate('shop', '/shop')}
            style={{ borderRadius: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-sm)' }}
            iconLeft={<i data-lucide="store" aria-hidden="true" />}
          >
            Continue as guest
          </Button>

          <p className={styles.dealerLink}>
            Looking for the dealer portal?{' '}
            <a href="/distributor/sign-in">Distributor sign in <span aria-hidden="true">→</span></a>
          </p>
        </div>
      </section>
    </div>
  );
}

export default Auth;
