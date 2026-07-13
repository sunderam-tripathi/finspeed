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
    <header className={`store-header ${dark ? 'store-header--dark fin-dark' : 'store-header--light'}`} style={{
      position:'sticky', top:0, zIndex:100,
      display:'flex', alignItems:'center', justifyContent:'space-between',
      background:dark ? 'rgba(2,5,8,0.96)' : 'rgba(255,255,255,0.86)', backdropFilter:'blur(14px)',
      borderBottom:dark ? '1px solid rgba(255,255,255,0.06)' : '1px solid var(--border-subtle)',
    }}>
      <div className="store-header-main" style={{ display:'flex', alignItems:'center' }}>
        <button className="store-brand" aria-label="Finspeed home" onClick={() => onNav('home')} style={{ display:'inline-flex', alignItems:'center', background:'none', border:'none', cursor:'pointer', padding:0 }}>
          <img src={dark ? '/assets/logos/finspeed-mark-light.png' : '/assets/logos/finspeed-mark.png'} alt="" />
          <span className="store-brand-name" style={{ color:dark ? 'var(--white)' : 'var(--ink-900)' }}>Finspeed</span>
        </button>
        <nav className="store-primary-nav" aria-label="Store categories" style={{ display:'flex', alignItems:'center' }}>
          {links.map((l,i) => (
            <button key={i} onClick={() => onNav('shop', l.filter)}
              style={{ background:'none', border:'none', cursor:'pointer', padding:'4px 0',
                color:dark ? 'var(--text-inverse)' : 'var(--ink-700)',
                borderBottom:'2px solid transparent', transition:'var(--transition-base)' }}
              onMouseEnter={e=>e.currentTarget.style.color=dark ? 'var(--brand)' : 'var(--ink-900)'}
              onMouseLeave={e=>e.currentTarget.style.color=dark ? 'var(--text-inverse)' : 'var(--ink-700)'}>
              {l.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="store-header-actions" style={{ display:'flex', alignItems:'center' }}>
        <IconButton variant="ghost" aria-label="Search" onClick={onSearch} icon={<i data-lucide="search" style={{width:22,height:22}}></i>} style={{ color:dark ? 'var(--white)' : 'var(--ink-900)' }} />
        <IconButton variant="ghost" aria-label="Account" onClick={onAccount} icon={<i data-lucide="user" style={{width:22,height:22}}></i>} style={{ color:dark ? 'var(--white)' : 'var(--ink-900)' }} />
        <IconButton variant="ghost" aria-label="Cart" count={cartCount||null} onClick={onCart} icon={<i data-lucide="shopping-cart" style={{width:22,height:22}}></i>} style={{ color:dark ? 'var(--white)' : 'var(--ink-900)' }} />
      </div>
    </header>
  );
}
export default Header;
