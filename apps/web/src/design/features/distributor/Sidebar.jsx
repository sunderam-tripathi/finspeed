// Finspeed Distributor Portal — sidebar (dark performance chrome)
import React from 'react';

function Sidebar({ route, onNav, orderCount, onSignOut }) {
  const items = [
    { k:'dashboard', label:'Dashboard', icon:'layout-dashboard' },
    { k:'pricelist', label:'Price list', icon:'list' },
    { k:'orders', label:'Order builder', icon:'clipboard-list', badge:orderCount },
    { k:'orderhistory', label:'Orders', icon:'package' },
  ];
  const sub = [
    { k:'invoices', label:'Invoices', icon:'file-text' },
    { k:'account',  label:'Account',  icon:'building-2' },
    { k:'support',  label:'Support',  icon:'life-buoy' },
  ];
  return (
    <aside className="dist-sidebar" style={{ width:248, flex:'none', background:'var(--surface-card)', borderRight:'1px solid var(--border-subtle)', display:'flex', flexDirection:'column', position:'sticky', top:0, height:'100vh' }}>
      <div className="dist-brand" style={{ display:'flex', alignItems:'center', gap:10, padding:'22px 22px', borderBottom:'1px solid var(--border-subtle)' }}>
        <img src="/assets/logos/finspeed-mark.png" alt="Finspeed" style={{ height:34 }} />
        <div className="dist-brand-copy">
          <div style={{ font:'var(--fw-bold) 18px/1 var(--font-display)', letterSpacing:'0.06em', textTransform:'uppercase', color:'var(--ink-900)' }}>Finspeed</div>
          <div style={{ font:'var(--fw-medium) 9px/1.2 var(--font-mono)', letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--brand-strong)', marginTop:3 }}>Distributor portal</div>
        </div>
      </div>
      <nav className="dist-nav" style={{ padding:'16px 14px', display:'flex', flexDirection:'column', gap:4 }}>
        {items.map(it=>{
          const active = route===it.k;
          return (
            <button className="dist-nav-item" key={it.k} aria-label={it.label} aria-current={active?'page':undefined} title={it.label} onClick={()=>onNav(it.k)} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 14px', borderRadius:'var(--radius-sm)', border:'none', cursor:'pointer', textAlign:'left',
              background:active?'var(--cyan-50)':'transparent', color:active?'var(--ink-900)':'var(--text-muted)', transition:'var(--transition-base)',
              boxShadow:active?'inset 2px 0 0 var(--brand-strong)':'none' }}
              onMouseEnter={e=>{ if(!active) e.currentTarget.style.color='var(--ink-900)'; }}
              onMouseLeave={e=>{ if(!active) e.currentTarget.style.color='var(--text-muted)'; }}>
              <i data-lucide={it.icon} style={{width:18,height:18,color:active?'var(--brand-strong)':'inherit'}}></i>
              <span className="dist-nav-label" style={{ font:'var(--fw-medium) var(--fs-sm)/1 var(--font-body)', flex:1 }}>{it.label}</span>
              {it.badge>0 && <span className="dist-nav-badge" style={{ minWidth:20, height:20, padding:'0 6px', display:'inline-flex', alignItems:'center', justifyContent:'center', background:'var(--brand-strong)', color:'#fff', font:'var(--fw-bold) 11px/1 var(--font-mono)', borderRadius:'var(--radius-pill)' }}>{it.badge}</span>}
            </button>
          );
        })}
        <div className="dist-nav-divider" style={{ height:1, background:'var(--border-subtle)', margin:'14px 14px' }}></div>
        {sub.map((it,i)=>{
          const active = route===it.k;
          return (
          <button className="dist-nav-item" key={i} aria-label={it.label} aria-current={active?'page':undefined} title={it.label} onClick={()=>onNav(it.k)} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 14px', borderRadius:'var(--radius-sm)', border:'none', cursor:'pointer', textAlign:'left',
            background:active?'var(--cyan-50)':'transparent', color:active?'var(--ink-900)':'var(--text-muted)', transition:'var(--transition-base)',
            boxShadow:active?'inset 2px 0 0 var(--brand-strong)':'none' }}
            onMouseEnter={e=>{ if(!active) e.currentTarget.style.color='var(--ink-900)'; }}
            onMouseLeave={e=>{ if(!active) e.currentTarget.style.color='var(--text-muted)'; }}>
            <i data-lucide={it.icon} style={{width:18,height:18,color:active?'var(--brand-strong)':'inherit'}}></i>
            <span className="dist-nav-label" style={{ font:'var(--fw-medium) var(--fs-sm)/1 var(--font-body)' }}>{it.label}</span>
          </button>
          );
        })}
      </nav>
      <div className="dist-user" style={{ marginTop:'auto', padding:'18px 20px', borderTop:'1px solid var(--border-subtle)', display:'flex', alignItems:'center', gap:12 }}>
        <div className="dist-user-avatar" style={{ width:38, height:38, borderRadius:'50%', background:'linear-gradient(135deg,var(--cyan-400),var(--cyan-700))', display:'flex', alignItems:'center', justifyContent:'center', font:'var(--fw-bold) 14px/1 var(--font-display)', color:'var(--ink-900)' }}>RS</div>
        <div className="dist-user-copy" style={{ flex:1, minWidth:0 }}>
          <div style={{ font:'var(--fw-semibold) var(--fs-sm)/1 var(--font-body)', color:'var(--ink-900)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>Ravi Stores</div>
          <div style={{ font:'var(--fw-regular) 11px/1.2 var(--font-mono)', color:'var(--text-muted)', marginTop:3 }}>Tier 1 · Noida</div>
        </div>
        <button className="dist-signout" onClick={onSignOut} aria-label="Sign out" title="Sign out" style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', display:'flex', padding:6, borderRadius:'var(--radius-sm)', transition:'var(--transition-base)' }}
          onMouseEnter={e=>{e.currentTarget.style.color='var(--ink-900)';e.currentTarget.style.background='var(--steel-50)';}}
          onMouseLeave={e=>{e.currentTarget.style.color='var(--text-muted)';e.currentTarget.style.background='none';}}>
          <i data-lucide="log-out" style={{width:17,height:17}}></i>
        </button>
      </div>
    </aside>
  );
}
export default Sidebar;
