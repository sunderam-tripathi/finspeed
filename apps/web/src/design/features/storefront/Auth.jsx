// Finspeed storefront — honest mock account access for the design runtime.
import React from 'react';
import Image from 'next/image';
import { Button, Input } from '../../ui/index.js';
import { demoUser } from '../../data/storefront.js';
import { useLucideIcons } from '../../lib/useLucideIcons.js';
import styles from './Auth.module.css';

const accountTabs = [
  { value: 'signin', label: 'Sign in' },
  { value: 'register', label: 'Create account' },
];

const SUPPORT_EMAIL = 'support@finspeed.online';
const SUPPORT_PHONE = '+91 96506 08982';
const SUPPORT_WHATSAPP = 'https://wa.me/919650608982';

function Auth({ mode = 'signin', onAuth, onNav }) {
  const [tab, setTab] = React.useState(mode === 'register' ? 'register' : 'signin');
  const [recoveryOpen, setRecoveryOpen] = React.useState(false);
  const tabRefs = React.useRef({});
  const recoveryEmailRef = React.useRef(null);
  useLucideIcons();

  function submit(event) {
    event.preventDefault();
    if (!onAuth) return;

    const fields = new FormData(event.currentTarget);
    const email = String(fields.get('email') || '').trim();
    if (tab === 'register') {
      const name = String(fields.get('name') || '').trim();
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

    onAuth({ ...demoUser, email: email || demoUser.email });
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
    setRecoveryOpen(false);
  }

  React.useEffect(() => {
    if (recoveryOpen) recoveryEmailRef.current?.focus();
  }, [recoveryOpen]);

  const isSigningIn = tab === 'signin';

  return (
    <div className={styles.page}>
      <section className={styles.story} aria-labelledby="auth-story-title">
        <div className={styles.brand} aria-label="Finspeed">
          <Image src="/assets/logos/finspeed-mark.png" alt="" aria-hidden="true" width={50} height={50} priority />
          <Image src="/assets/logos/finspeed-wordmark-dark.svg" alt="Finspeed" width={178} height={36} priority />
        </div>

        <div className={styles.storyCopy}>
          <p className={styles.kicker}>Owners / Account</p>
          <span className={styles.rule} aria-hidden="true" />
          <h2 id="auth-story-title">Your ride,<br />remembered.</h2>
          <p className={styles.intro}>
            Keep every order, saved build and service detail in one considered place.
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

        <p className={styles.origin}>Finspeed · MK Electric · Greater Noida</p>
      </section>

      <section className={styles.formPanel} aria-labelledby="auth-heading">
        <div className={styles.formShell}>
          <p className={styles.formIndex}>Account access / 01</p>
          <h1 id="auth-heading">{isSigningIn ? 'Welcome back.' : 'Begin your garage.'}</h1>
          <p className={styles.formIntro}>
            {isSigningIn
              ? 'Sign in to continue with your saved rides and orders.'
              : 'Add your details to preview the Finspeed owner account.'}
          </p>

          <div className={styles.tabs} role="tablist" aria-label="Account access" aria-orientation="horizontal">
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
              {!isSigningIn && (
                <Input id="auth-name" name="name" label="Full name" placeholder="Arjun Mehta" autoComplete="name" required />
              )}
              <Input
                id="auth-email"
                name="email"
                label="Email"
                type="email"
                placeholder="you@email.com"
                defaultValue={isSigningIn ? demoUser.email : ''}
                autoComplete="email"
                required
                iconLeft={<i data-lucide="mail" aria-hidden="true" />}
              />
              {!isSigningIn && (
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
              )}
              <Input
                id="auth-password"
                name="password"
                label="Password"
                type="password"
                placeholder="••••••••"
                defaultValue={isSigningIn ? 'password' : ''}
                autoComplete={isSigningIn ? 'current-password' : 'new-password'}
                minLength={8}
                required
                iconLeft={<i data-lucide="lock" aria-hidden="true" />}
              />

              {isSigningIn && (
                <div className={styles.formOptions}>
                  <button
                    type="button"
                    aria-expanded={recoveryOpen}
                    aria-controls="auth-recovery-help"
                    onClick={() => setRecoveryOpen((current) => !current)}
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {isSigningIn && recoveryOpen && (
                <div id="auth-recovery-help" className={styles.recoveryHelp} role="status" aria-live="polite">
                  <p>
                    Online password reset is not connected in this preview. Rider support can help restore access.
                  </p>
                  <div>
                    <a ref={recoveryEmailRef} href={`mailto:${SUPPORT_EMAIL}?subject=Finspeed%20account%20access`}>
                      {SUPPORT_EMAIL}
                    </a>
                    <a href={SUPPORT_WHATSAPP} target="_blank" rel="noreferrer">
                      WhatsApp {SUPPORT_PHONE}
                    </a>
                    <button type="button" onClick={() => navigate('support', '/support')}>Open rider support</button>
                  </div>
                </div>
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
                {isSigningIn ? 'Sign in' : 'Create sample account'}
              </Button>
            </form>
          </div>

          <p id="auth-preview-note" className={styles.previewNote}>
            <i data-lucide="info" aria-hidden="true" />
            This design preview opens a local sample rider profile. No live account is created and no credentials are sent.
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
