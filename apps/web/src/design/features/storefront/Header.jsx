// Finspeed storefront — Header / top nav
import React from 'react';
import { IconButton } from '../../ui/index.js';

function Header({ cartCount, theme, onNav, onCart, onAccount, onSearch, onThemeToggle }) {
  const isDark = theme === 'dark';
  const foreground = isDark ? 'var(--white)' : 'var(--ink-900)';
  const navigationForeground = isDark ? '#f0f4f6' : 'var(--steel-700)';
  const links = [
    { k:'shop', label:'Shop' },
    { k:'shop', label:'Mountain', filter:'mountain' },
    { k:'shop', label:'City', filter:'city' },
    { k:'shop', label:'Hybrid', filter:'hybrid' },
  ];
  return (
    <header className={`store-header store-header--${isDark ? 'dark fin-dark' : 'light'}`} style={{
      position:'sticky', top:0, zIndex:100,
      display:'flex', alignItems:'center', justifyContent:'space-between',
      background:isDark ? 'rgba(2,5,8,0.96)' : 'rgba(255,255,255,0.94)',
      backdropFilter:'blur(14px)', WebkitBackdropFilter:'blur(14px)',
      borderBottom:`1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(2,5,8,0.10)'}`,
    }}>
      <div className="store-header-main" style={{ display:'flex', alignItems:'center' }}>
        <button className="store-brand" aria-label="Finspeed home" onClick={() => onNav('home')} style={{ display:'inline-flex', alignItems:'center', background:'none', border:'none', cursor:'pointer', padding:0 }}>
          <img src={isDark ? '/assets/logos/finspeed-mark-light.png' : '/assets/logos/finspeed-mark.png'} alt="" />
          <span className="store-brand-name" style={{ color:foreground }}>Finspeed</span>
        </button>
        <nav className="store-primary-nav" aria-label="Store categories" style={{ display:'flex', alignItems:'center' }}>
          {links.map((l,i) => (
            <button key={i} onClick={() => onNav('shop', l.filter)}
              style={{ background:'none', border:'none', cursor:'pointer', padding:'4px 0',
                color:navigationForeground,
                borderBottom:'2px solid transparent', transition:'var(--transition-base)' }}
              onMouseEnter={e=>e.currentTarget.style.color='var(--brand)'}
              onMouseLeave={e=>e.currentTarget.style.color=navigationForeground}>
              {l.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="store-header-actions" style={{ display:'flex', alignItems:'center' }}>
        <IconButton variant="ghost" aria-label="Search" onClick={onSearch} icon={<i data-lucide="search" style={{width:22,height:22}}></i>} style={{ color:foreground }} />
        <IconButton
          variant="ghost"
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          aria-pressed={theme === 'light'}
          onClick={onThemeToggle}
          icon={<i data-lucide={theme === 'dark' ? 'sun' : 'moon'} style={{width:22,height:22}}></i>}
          style={{ color:foreground }}
        />
        <IconButton variant="ghost" aria-label="Account" onClick={onAccount} icon={<i data-lucide="user" style={{width:22,height:22}}></i>} style={{ color:foreground }} />
        <IconButton variant="ghost" aria-label="Cart" count={cartCount||null} onClick={onCart} icon={<i data-lucide="shopping-cart" style={{width:22,height:22}}></i>} style={{ color:foreground }} />
      </div>
    </header>
  );
}
export default Header;
