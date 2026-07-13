// Finspeed storefront — Auth (sign in / create account)
import React from 'react';
import { Button, Input, Tabs } from '../../ui/index.js';
import { demoUser } from '../../data/storefront.js';
import { useLucideIcons } from '../../lib/useLucideIcons.js';

function Auth({ mode='signin', onAuth, onNav }) {
  const [tab, setTab] = React.useState(mode);
  useLucideIcons();

  function submit(e){ e.preventDefault(); onAuth && onAuth(demoUser); }

  const link = { background:'none', border:'none', padding:0, cursor:'pointer', font:'var(--fw-semibold) var(--fs-sm)/1 var(--font-body)', color:'var(--brand-ink)' };

  return (
    <div style={{ minHeight:'calc(100vh - 74px)', display:'grid', gridTemplateColumns:'1.05fr 1fr', background:'var(--bg-page)' }}>
      {/* left — dark performance panel */}
      <div style={{ position:'relative', overflow:'hidden', background:'var(--fin-dark, var(--ink-900))', display:'flex', flexDirection:'column', justifyContent:'space-between', padding:'var(--space-9) var(--space-8)' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(120% 90% at 70% 40%, rgba(25,213,242,0.22), transparent 60%)', pointerEvents:'none' }}></div>
        <div style={{ position:'relative', display:'flex', alignItems:'center', gap:10 }}>
          <img src="/assets/logos/finspeed-mark-light.png" alt="Finspeed" style={{ height:34 }} onError={(e)=>{e.currentTarget.src='/assets/logos/finspeed-mark.png';}} />
          <span style={{ font:'var(--fw-bold) 22px/1 var(--font-display)', letterSpacing:'0.06em', textTransform:'uppercase', color:'#fff' }}>Finspeed</span>
        </div>
        <div style={{ position:'relative' }}>
          <span style={{ font:'var(--fw-medium) var(--fs-2xs)/1 var(--font-mono)', letterSpacing:'var(--tracking-wider)', textTransform:'uppercase', color:'var(--cyan-electric)' }}>Members ride further</span>
          <h2 style={{ font:'var(--fw-bold) var(--fs-4xl)/1.02 var(--font-display)', letterSpacing:'-0.02em', color:'#fff', margin:'var(--space-4) 0 var(--space-4)' }}>Ride Beyond<br/>Boundaries.</h2>
          <p style={{ font:'var(--text-body-md)', color:'rgba(255,255,255,0.7)', maxWidth:380, margin:0 }}>Track orders, save your garage and check out faster. One account for everything Finspeed.</p>
          <div style={{ display:'flex', gap:'var(--space-6)', marginTop:'var(--space-7)' }}>
            {[['truck','Free delivery'],['shield-check','1-yr warranty'],['wrench','Free first service']].map(([ic,t])=>(
              <div key={t} style={{ display:'flex', alignItems:'center', gap:8, color:'rgba(255,255,255,0.82)' }}>
                <i data-lucide={ic} style={{width:18,height:18,color:'var(--cyan-electric)'}}></i>
                <span style={{ font:'var(--fw-medium) var(--fs-xs)/1 var(--font-body)' }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position:'relative', font:'var(--fw-regular) var(--fs-2xs)/1 var(--font-mono)', letterSpacing:'var(--tracking-wide)', color:'rgba(255,255,255,0.4)' }}>FINSPEED · MK ELECTRIC · GREATER NOIDA</div>
      </div>

      {/* right — form */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'var(--space-8) var(--space-7)' }}>
        <div style={{ width:'100%', maxWidth:400 }}>
          <h1 style={{ font:'var(--fw-bold) var(--fs-3xl)/1 var(--font-display)', letterSpacing:'-0.02em', color:'var(--ink-900)', margin:'0 0 var(--space-2)' }}>{tab==='signin'?'Welcome back':'Create your account'}</h1>
          <p style={{ font:'var(--text-body-sm)', color:'var(--text-muted)', margin:'0 0 var(--space-6)' }}>{tab==='signin'?'Sign in to your Finspeed account.':'Join the network in under a minute.'}</p>

          <div style={{ marginBottom:'var(--space-6)' }}>
            <Tabs tabs={[{value:'signin',label:'Sign in'},{value:'register',label:'Create account'}]} value={tab} onChange={setTab} />
          </div>

          <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:'var(--space-4)' }}>
            {tab==='register' && <Input label="Full name" placeholder="Arjun Mehta" autoComplete="name" required />}
            <Input label="Email" type="email" placeholder="you@email.com" defaultValue={tab==='signin'?'arjun.mehta@email.com':''} autoComplete="email" required iconLeft={<i data-lucide="mail" style={{width:17,height:17}}></i>} />
            {tab==='register' && <Input label="Phone" placeholder="+91 98765 43210" autoComplete="tel" required iconLeft={<i data-lucide="phone" style={{width:17,height:17}}></i>} />}
            <Input label="Password" type="password" placeholder="••••••••" defaultValue={tab==='signin'?'password':''} autoComplete={tab==='signin'?'current-password':'new-password'} required iconLeft={<i data-lucide="lock" style={{width:17,height:17}}></i>} />
            {tab==='signin' && (
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'calc(-1 * var(--space-1))' }}>
                <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', font:'var(--fw-regular) var(--fs-sm)/1 var(--font-body)', color:'var(--text-body)' }}>
                  <input type="checkbox" defaultChecked style={{ accentColor:'var(--brand)', width:16, height:16 }} /> Remember me
                </label>
                <button type="button" style={link}>Forgot password?</button>
              </div>
            )}
            <div style={{ marginTop:'var(--space-2)' }}>
              <Button type="submit" variant="primary" size="lg" full iconRight={<i data-lucide="arrow-right" style={{width:18,height:18}}></i>}>{tab==='signin'?'Sign in':'Create account'}</Button>
            </div>
          </form>

          <div style={{ display:'flex', alignItems:'center', gap:'var(--space-3)', margin:'var(--space-6) 0' }}>
            <span style={{ flex:1, height:1, background:'var(--border-subtle)' }}></span>
            <span style={{ font:'var(--fw-regular) var(--fs-2xs)/1 var(--font-mono)', letterSpacing:'var(--tracking-wide)', textTransform:'uppercase', color:'var(--text-faint)' }}>or</span>
            <span style={{ flex:1, height:1, background:'var(--border-subtle)' }}></span>
          </div>
          <Button variant="outline" size="lg" full onClick={()=>onNav && onNav('shop')} iconLeft={<i data-lucide="store" style={{width:17,height:17}}></i>}>Continue as guest</Button>

          <p style={{ font:'var(--fw-regular) var(--fs-xs)/1.5 var(--font-body)', color:'var(--text-faint)', textAlign:'center', margin:'var(--space-6) 0 0' }}>
            Looking for the dealer portal? <a href="/distributor/sign-in" style={{ color:'var(--brand-ink)', fontWeight:600, textDecoration:'none' }}>Distributor sign in →</a>
          </p>
        </div>
      </div>
    </div>
  );
}
export default Auth;
