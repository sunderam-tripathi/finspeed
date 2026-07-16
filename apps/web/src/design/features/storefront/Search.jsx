// Finspeed storefront — Search results
import React from 'react';
import { ProductCard, Breadcrumb, Tag, EmptyState, Button } from '../../ui/index.js';
import { productImage, productImageSrcSet, products } from '../../data/storefront.js';
import { useLucideIcons } from '../../lib/useLucideIcons.js';

function Search({ query, setQuery, onAdd, onProduct, onNav }) {
  const P = products;
  const inputRef = React.useRef(null);
  React.useEffect(()=>{ if(inputRef.current) inputRef.current.focus(); }, []);
  useLucideIcons();

  const q = (query||'').trim().toLowerCase();
  const results = q ? P.filter(p =>
    [p.name, p.series, p.sub, p.tag, p.desc].join(' ').toLowerCase().includes(q)
  ) : [];
  const suggestions = ['Mako Shark','Mountain','Hybrid','29 inch','Best value'];

  return (
    <div style={{ background:'var(--bg-page)', minHeight:'70vh' }}>
      <div style={{ maxWidth:'var(--container-max)', margin:'0 auto', padding:'var(--space-5) var(--space-7) var(--space-9)' }}>
        <div style={{ padding:'var(--space-4) 0' }}>
          <Breadcrumb items={[{label:'Home',onClick:()=>onNav('home')},{label:'Search'}]} />
        </div>

        {/* search field */}
        <div style={{ position:'relative', display:'flex', alignItems:'center', margin:'4px 0 var(--space-6)' }}>
          <i data-lucide="search" style={{ width:22, height:22, position:'absolute', left:20, color:'var(--text-faint)' }}></i>
          <input ref={inputRef} value={query||''} onChange={e=>setQuery(e.target.value)} placeholder="Search the fleet — model, series, terrain…"
            style={{ width:'100%', height:64, padding:'0 24px 0 56px', border:'2px solid var(--border-strong)', borderRadius:'var(--radius-lg)', font:'var(--fw-semibold) var(--fs-xl)/1 var(--font-display)', letterSpacing:'-0.01em', color:'var(--ink-900)', outline:'none', background:'var(--surface-card)' }}
            onFocus={e=>{e.currentTarget.style.borderColor='var(--focus-ring)';e.currentTarget.style.boxShadow='0 0 0 4px var(--cyan-100)';}}
            onBlur={e=>{e.currentTarget.style.borderColor='var(--border-strong)';e.currentTarget.style.boxShadow='none';}} />
          {query && <button onClick={()=>setQuery('')} aria-label="Clear" style={{ position:'absolute', right:18, background:'none', border:'none', cursor:'pointer', color:'var(--text-faint)', display:'flex' }}><i data-lucide="x" style={{width:20,height:20}}></i></button>}
        </div>

        {!q && (
          <div>
            <div style={{ font:'var(--fw-medium) var(--fs-2xs)/1 var(--font-mono)', letterSpacing:'var(--tracking-wide)', textTransform:'uppercase', color:'var(--text-faint)', marginBottom:'var(--space-3)' }}>Popular searches</div>
            <div style={{ display:'flex', gap:'var(--space-2)', flexWrap:'wrap' }}>
              {suggestions.map(s=><Tag key={s} onClick={()=>setQuery(s)}>{s}</Tag>)}
            </div>
          </div>
        )}

        {q && (
          <React.Fragment>
            <div style={{ font:'var(--fw-regular) var(--fs-sm)/1 var(--font-mono)', color:'var(--text-muted)', marginBottom:'var(--space-5)' }}>
              {results.length} {results.length===1?'result':'results'} for <span style={{ color:'var(--ink-900)', fontWeight:600 }}>"{query}"</span>
            </div>
            {results.length===0 ? (
              <EmptyState icon={<i data-lucide="search-x" style={{width:30,height:30}}></i>} title="No cycles match that search" message="Try a model name, series, or terrain like “mountain” or “hybrid”." action={<Button variant="dark" onClick={()=>onNav('shop')}>Browse all bikes</Button>} />
            ) : (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(270px,1fr))', gap:'var(--space-5)' }}>
                {results.map(p=>(
                  <ProductCard key={p.id} name={p.name} series={p.series} image={productImage(p.id, 960)} imageSrcSet={productImageSrcSet(p.id)} price={p.price} mrp={p.mrp} rating={p.rating} ratingCount={p.reviews} badge={p.badge} badgeTone={p.badge==='New'?'success':(p.badge==='Best value'?'ink':'brand')} soldOut={p.stock===0} onAdd={()=>onAdd(p.id)} onClick={()=>onProduct(p.id)} />
                ))}
              </div>
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
}
export default Search;
