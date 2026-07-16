// Finspeed storefront — Shop / collection
import React from 'react';
import { Tag, Select, ProductCard, Breadcrumb, Pagination } from '../../ui/index.js';
import { productImage, productImageSrcSet, products } from '../../data/storefront.js';
const SHOP_PAGE_SIZE = 6;

function Shop({ filter, setFilter, onAdd, onProduct, onNav }) {
  const P = products;
  const [sort, setSort] = React.useState('featured');
  const [page, setPage] = React.useState(1);
  const cats = [['all','All bikes'],['mountain','Mountain'],['city','City'],['hybrid','Hybrid']];
  let list = P.filter(p => filter==='all' || !filter ? true : p.tag===filter);
  if (sort==='low') list = [...list].sort((a,b)=>a.price-b.price);
  if (sort==='high') list = [...list].sort((a,b)=>b.price-a.price);
  if (sort==='rating') list = [...list].sort((a,b)=>b.rating-a.rating);
  React.useEffect(()=>{ setPage(1); }, [filter, sort]);
  const pageCount = Math.ceil(list.length / SHOP_PAGE_SIZE) || 1;
  const safePage = Math.min(page, pageCount);
  const pageList = list.slice((safePage-1)*SHOP_PAGE_SIZE, safePage*SHOP_PAGE_SIZE);

  return (
    <div className="store-shop-page" style={{ background:'var(--bg-page)', minHeight:'70vh' }}>
      {/* page head */}
      <div style={{ background:'var(--surface-card)', borderBottom:'1px solid var(--border-subtle)' }}>
        <div className="store-page-shell store-shop-page-head" style={{ maxWidth:'var(--container-max)', margin:'0 auto', padding:'var(--space-7) var(--space-7) var(--space-6)' }}>
          <div style={{ marginBottom:'var(--space-4)' }}>
            <Breadcrumb items={[{label:'Home',onClick:()=>onNav&&onNav('home')},{label:'Shop'}]} />
          </div>
          <span className="fin-eyebrow">The full fleet</span>
          <h1 style={{ font:'var(--fw-bold) var(--fs-4xl)/1 var(--font-display)', letterSpacing:'-0.02em', color:'var(--ink-900)', margin:'8px 0 0' }}>Shop all cycles</h1>
        </div>
      </div>

      <div className="store-page-shell store-shop-content" style={{ maxWidth:'var(--container-max)', margin:'0 auto', padding:'var(--space-6) var(--space-7) var(--space-9)' }}>
        {/* toolbar */}
        <div className="store-shop-toolbar" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'var(--space-4)', marginBottom:'var(--space-6)', flexWrap:'wrap' }}>
          <div style={{ display:'flex', gap:'var(--space-2)', flexWrap:'wrap' }}>
            {cats.map(([k,l])=>(
              <Tag key={k} selected={(filter||'all')===k} onClick={()=>setFilter(k)}>{l}</Tag>
            ))}
          </div>
          <div className="store-shop-sort" style={{ minWidth:230 }}>
            <Select options={[{value:'featured',label:'Sort: Featured'},{value:'low',label:'Price: Low to High'},{value:'high',label:'Price: High to Low'},{value:'rating',label:'Top rated'}]} value={sort} onChange={e=>setSort(e.target.value)} />
          </div>
        </div>

        <div style={{ font:'var(--fw-regular) var(--fs-sm)/1 var(--font-mono)', color:'var(--text-muted)', marginBottom:'var(--space-5)' }}>{list.length} cycles</div>

        {list.length===0 ? (
          <div style={{ textAlign:'center', padding:'var(--space-9) var(--space-5)', border:'1px dashed var(--border-strong)', borderRadius:'var(--radius-lg)', color:'var(--text-muted)' }}>
            <i data-lucide="search-x" style={{width:34,height:34}}></i>
            <h3 style={{ font:'var(--fw-bold) var(--fs-xl)/1.1 var(--font-display)', color:'var(--text-strong)', margin:'var(--space-4) 0 var(--space-2)' }}>No cycles in this category yet</h3>
            <p style={{ font:'var(--text-body-sm)', margin:'0 0 var(--space-5)' }}>Try another terrain — the full fleet is one tap away.</p>
            <Tag selected onClick={()=>setFilter('all')}>View all bikes</Tag>
          </div>
        ) : (
          <React.Fragment>
            <div className="store-product-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(270px,1fr))', gap:'var(--space-5)' }}>
              {pageList.map(p=>(
                <ProductCard key={p.id} name={p.name} series={p.series} image={productImage(p.id, 960)} imageSrcSet={productImageSrcSet(p.id)} price={p.price} mrp={p.mrp} rating={p.rating} ratingCount={p.reviews} badge={p.badge} badgeTone={p.badge==='New'?'success':(p.badge==='Best value'?'ink':'brand')} soldOut={p.stock===0} onAdd={()=>onAdd(p.id)} onClick={()=>onProduct(p.id)} />
              ))}
            </div>
            {pageCount > 1 && (
              <div style={{ display:'flex', justifyContent:'center', marginTop:'var(--space-7)' }}>
                <Pagination page={safePage} pageCount={pageCount} onChange={(pg)=>{ setPage(pg); window.scrollTo({top:0,behavior:'smooth'}); }} />
              </div>
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
}
export default Shop;
