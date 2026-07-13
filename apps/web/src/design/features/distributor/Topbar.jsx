// Finspeed Distributor Portal — top bar
import React from 'react';
import { IconButton, Button } from '../../ui/index.js';

function Topbar({ title, subtitle, onSearch, query }) {
  return (
    <div className="dist-topbar" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:24, padding:'22px 32px', borderBottom:'1px solid var(--border-subtle)', background:'var(--surface-card)', position:'sticky', top:0, zIndex:50 }}>
      <div className="dist-topbar-copy">
        <h1 style={{ font:'var(--fw-bold) var(--fs-2xl)/1 var(--font-display)', letterSpacing:'-0.02em', color:'var(--ink-900)', margin:0 }}>{title}</h1>
        {subtitle && <p style={{ font:'var(--fw-regular) var(--fs-sm)/1 var(--font-body)', color:'var(--text-muted)', margin:'6px 0 0' }}>{subtitle}</p>}
      </div>
      <div className="dist-topbar-actions" style={{ display:'flex', alignItems:'center', gap:14 }}>
        <div className="dist-search-wrap" style={{ position:'relative', display:'flex', alignItems:'center' }}>
          <i data-lucide="search" style={{ width:17, height:17, position:'absolute', left:13, color:'var(--text-faint)' }}></i>
          <input className="dist-search" value={query||''} onChange={e=>onSearch&&onSearch(e.target.value)} placeholder="Search models…" style={{ height:42, width:240, padding:'0 14px 0 38px', border:'1px solid var(--border-strong)', borderRadius:'var(--radius-sm)', font:'var(--fw-regular) var(--fs-sm)/1 var(--font-body)', color:'var(--text-strong)', outline:'none', background:'var(--surface-card)' }}
            onFocus={e=>{e.currentTarget.style.borderColor='var(--focus-ring)';e.currentTarget.style.boxShadow='0 0 0 3px var(--cyan-100)';}}
            onBlur={e=>{e.currentTarget.style.borderColor='var(--border-strong)';e.currentTarget.style.boxShadow='none';}} />
        </div>
        <IconButton variant="ghost" aria-label="Notifications" icon={<i data-lucide="bell" style={{width:19,height:19}}></i>} />
        <Button className="dist-catalog-button" aria-label="Download catalog PDF" variant="dark" iconLeft={<i data-lucide="download" style={{width:16,height:16}}></i>}><span className="dist-catalog-label">Catalog PDF</span></Button>
      </div>
    </div>
  );
}
export default Topbar;
