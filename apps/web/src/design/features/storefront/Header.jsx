// Finspeed storefront — Header / top nav
import React from 'react';
import { IconButton } from '../../ui/index.js';

function Header({ cartCount, onNav, onCart, onAccount, onSearch, route }) {
  const dark = route === 'home';
  const links = [
    { k:'shop', label:'Shop' },
    { k:'shop', label:'Mountain', filter:'mountain' },
    { k:'shop', label:'City', filter:'city' },
    { k:'shop', label:'Hybrid', filter:'hybrid' },
  ];
  return (
    <header className={`store-header${dark ? ' store-header--dark fin-dark' : ''}`} style={{
      position:'sticky', top:0, zIndex:100,
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'0 var(--space-7)', height:74,
      background:dark ? 'rgba(2,5,8,0.96)' : 'rgba(255,255,255,0.86)', backdropFilter:'blur(14px)',
      borderBottom:dark ? '1px solid rgba(255,255,255,0.06)' : '1px solid var(--border-subtle)',
    }}>
      <div className="store-header-main" style={{ display:'flex', alignItems:'center', gap:'var(--space-7)' }}>
        <button className="store-brand" onClick={() => onNav('home')} style={{ display:'inline-flex', alignItems:'center', gap:10, background:'none', border:'none', cursor:'pointer', padding:0 }}>
          <img src={dark ? '/assets/logos/finspeed-mark-light.png' : '/assets/logos/finspeed-mark.png'} alt="Finspeed" style={{ height:38 }} />
          <span className="store-brand-name" style={{ font:'var(--fw-bold) 22px/1 var(--font-display)', letterSpacing:'0.06em', textTransform:'uppercase', color:dark ? 'var(--white)' : 'var(--ink-900)' }}>Finspeed</span>
        </button>
        <nav className="store-primary-nav" aria-label="Store categories" style={{ display:'flex', alignItems:'center', gap:'var(--space-5)' }}>
          {links.map((l,i) => (
            <button key={i} onClick={() => onNav('shop', l.filter)}
              style={{ background:'none', border:'none', cursor:'pointer', padding:'4px 0',
                font:'var(--fw-medium) var(--fs-sm)/1 var(--font-body)', color:dark ? 'var(--text-inverse)' : 'var(--text-body)',
                borderBottom:'2px solid transparent', transition:'var(--transition-base)' }}
              onMouseEnter={e=>e.currentTarget.style.color=dark ? 'var(--brand)' : 'var(--ink-900)'}
              onMouseLeave={e=>e.currentTarget.style.color=dark ? 'var(--text-inverse)' : 'var(--text-body)'}>
              {l.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="store-header-actions" style={{ display:'flex', alignItems:'center', gap:'var(--space-3)' }}>
        <IconButton variant="ghost" aria-label="Search" onClick={onSearch} icon={<i data-lucide="search" style={{width:dark?24:19,height:dark?24:19}}></i>} style={dark ? { color:'var(--white)' } : undefined} />
        <IconButton variant="ghost" aria-label="Account" onClick={onAccount} icon={<i data-lucide="user" style={{width:dark?24:19,height:dark?24:19}}></i>} style={dark ? { color:'var(--white)' } : undefined} />
        <IconButton variant="ghost" aria-label="Cart" count={cartCount||null} onClick={onCart} icon={<i data-lucide="shopping-cart" style={{width:dark?24:19,height:dark?24:19}}></i>} style={dark ? { color:'var(--white)' } : undefined} />
      </div>
    </header>
  );
}
export default Header;
