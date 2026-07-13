// Finspeed storefront — Product detail page
import React from 'react';
import { Button, Badge, PriceTag, SpecPill, Rating, QuantityStepper, Breadcrumb, Accordion, Modal } from '../../ui/index.js';
import { productImage, products } from '../../data/storefront.js';

function ProductDetail({ id, onAdd, onNav, onProduct }) {
  const P = products;
  const p = P.find(x=>x.id===id) || P[0];
  const [qty, setQty] = React.useState(1);
  const [color, setColor] = React.useState(0);
  const [sizeOpen, setSizeOpen] = React.useState(false);
  const related = P.filter(x=>x.tag===p.tag && x.id!==p.id).slice(0,3);
  const I = (n) => <i data-lucide={n} style={{width:15,height:15}}></i>;
  const susp = p.tag==='mountain' ? 'Front suspension' : 'Rigid fork';
  const soldOut = p.stock===0;
  const lowStock = p.stock>0 && p.stock<=3;
  const specGroups = [
    { title:'Frame & fork', icon:I('shield'), rows:[['Frame','High-tensile steel'],['Fork',susp],['Finish','Powder-coat'],['Series',p.series]] },
    { title:'Drivetrain', icon:I('settings'), rows:[['Gears', p.speed==='Single'?'Single speed':p.speed],['Shifters', p.speed==='Single'?'—':'Easy Fire 3×7'],['Brakes', p.brakes+' brakes']] },
    { title:'Wheels & tyres', icon:I('circle-dot'), rows:[['Wheel size', p.wheels],['Rims','Double-walled alloy'],['Tyres','Broad all-terrain']] },
  ];

  return (
    <div style={{ background:'var(--bg-page)' }}>
      <div className="store-page-shell store-product-page" style={{ maxWidth:'var(--container-max)', margin:'0 auto', padding:'var(--space-5) var(--space-7) var(--space-9)' }}>
        {/* breadcrumb */}
        <div style={{ padding:'var(--space-4) 0' }}>
          <Breadcrumb items={[{label:'Home',onClick:()=>onNav('home')},{label:'Shop',onClick:()=>onNav('shop')},{label:p.name}]} />
        </div>

        <div className="store-product-layout" style={{ display:'grid', gridTemplateColumns:'1.1fr 1fr', gap:'var(--space-8)', alignItems:'start' }}>
          {/* gallery */}
          <div className="store-product-gallery" style={{ position:'relative', background:'linear-gradient(180deg,#fff,var(--steel-50))', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-lg)', padding:'var(--space-7)', display:'flex', alignItems:'center', justifyContent:'center', minHeight:440 }}>
            {p.badge && <span style={{ position:'absolute', top:16, left:16 }}><Badge tone="brand" solid>{p.badge}</Badge></span>}
            <img src={productImage(p.id)} alt={p.name} style={{ maxWidth:'100%', maxHeight:420, objectFit:'contain', mixBlendMode:'multiply' }} />
          </div>

          {/* info */}
          <div className="store-product-info">
            <span className="fin-eyebrow">{p.series}</span>
            <h1 style={{ font:'var(--fw-bold) var(--fs-4xl)/1 var(--font-display)', letterSpacing:'-0.02em', color:'var(--ink-900)', margin:'8px 0 6px' }}>{p.name}</h1>
            <p style={{ font:'var(--fw-medium) var(--fs-md)/1.4 var(--font-body)', color:'var(--text-muted)', margin:'0 0 var(--space-4)' }}>{p.sub}</p>
            <Rating value={p.rating} count={p.reviews} />
            <div style={{ margin:'var(--space-5) 0' }}><PriceTag price={p.price} mrp={p.mrp} size="lg" /></div>
            <p style={{ font:'var(--fw-regular) var(--fs-md)/1.65 var(--font-body)', color:'var(--text-body)', margin:'0 0 var(--space-5)', maxWidth:440 }}>{p.desc}</p>

            <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:'var(--space-6)' }}>
              <SpecPill icon={I('circle-dot')}>{p.wheels} wheels</SpecPill>
              <SpecPill icon={I('settings')}>{p.speed}</SpecPill>
              <SpecPill icon={I('disc')}>{p.brakes} brakes</SpecPill>
            </div>

            {/* colour */}
            <div style={{ marginBottom:'var(--space-6)' }}>
              <div style={{ font:'var(--fw-semibold) var(--fs-xs)/1 var(--font-body)', color:'var(--text-strong)', marginBottom:10 }}>Colourway</div>
              <div style={{ display:'flex', gap:10 }}>
                {p.colors.map((c,i)=>(
                  <button key={i} onClick={()=>setColor(i)} aria-label={'colour '+(i+1)} style={{ width:38, height:38, borderRadius:'50%', background:c, cursor:'pointer', border:'2px solid '+(color===i?'var(--ink-900)':'transparent'), outline:'1px solid var(--border-subtle)', outlineOffset:2 }}></button>
                ))}
              </div>
              <button type="button" onClick={()=>setSizeOpen(true)} style={{ marginTop:14, display:'inline-flex', alignItems:'center', gap:7, background:'transparent', border:'none', padding:0, cursor:'pointer', font:'var(--fw-semibold) var(--fs-xs)/1 var(--font-body)', color:'var(--brand-ink)' }}>
                <i data-lucide="ruler" style={{width:15,height:15}}></i> Size guide
              </button>
            </div>

            {/* buy row */}
            {soldOut ? (
              <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-3)', maxWidth:440 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, font:'var(--fw-semibold) var(--fs-xs)/1 var(--font-mono)', letterSpacing:'var(--tracking-wide)', textTransform:'uppercase', color:'var(--danger)' }}>
                  <i data-lucide="x-circle" style={{width:16,height:16}}></i> Sold out
                </div>
                <div style={{ display:'flex', gap:'var(--space-3)', flexWrap:'wrap' }}>
                  <Button variant="dark" size="lg" disabled>Add to cart</Button>
                  <Button variant="outline" size="lg" iconLeft={<i data-lucide="bell" style={{width:18,height:18}}></i>}>Notify me</Button>
                </div>
              </div>
            ) : (
              <div>
                {lowStock && (
                  <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:'var(--space-4)', font:'var(--fw-semibold) var(--fs-xs)/1 var(--font-mono)', letterSpacing:'var(--tracking-wide)', textTransform:'uppercase', color:'var(--warning)' }}>
                    <i data-lucide="alert-triangle" style={{width:15,height:15}}></i> Only {p.stock} left in stock
                  </div>
                )}
                <div className="store-product-actions" style={{ display:'flex', gap:'var(--space-4)', alignItems:'center', flexWrap:'wrap' }}>
                  <QuantityStepper value={qty} min={1} max={Math.min(5, p.stock||5)} onChange={setQty} />
                  <Button variant="primary" size="lg" onClick={()=>onAdd(p.id, qty)} iconLeft={<i data-lucide="shopping-cart" style={{width:18,height:18}}></i>}>Add to cart</Button>
                  <Button variant="dark" size="lg">Buy now</Button>
                </div>
              </div>
            )}

            <div className="store-product-benefits" style={{ display:'flex', gap:'var(--space-5)', marginTop:'var(--space-6)', font:'var(--fw-regular) var(--fs-xs)/1.4 var(--font-body)', color:'var(--text-muted)' }}>
              <span style={{display:'inline-flex',alignItems:'center',gap:6}}><i data-lucide="truck" style={{width:15,height:15,color:'var(--brand-strong)'}}></i> Free delivery</span>
              <span style={{display:'inline-flex',alignItems:'center',gap:6}}><i data-lucide="shield-check" style={{width:15,height:15,color:'var(--brand-strong)'}}></i> 1-year warranty</span>
              <span style={{display:'inline-flex',alignItems:'center',gap:6}}><i data-lucide="wrench" style={{width:15,height:15,color:'var(--brand-strong)'}}></i> 85% pre-assembled</span>
            </div>
          </div>
        </div>

        {/* specifications */}
        <div className="store-product-specifications" style={{ marginTop:'var(--space-9)', maxWidth:760 }}>
          <h2 style={{ font:'var(--fw-bold) var(--fs-2xl)/1 var(--font-display)', letterSpacing:'-0.02em', color:'var(--ink-900)', margin:'0 0 var(--space-5)' }}>Specifications</h2>
          <Accordion defaultOpen={0} items={specGroups.map(g=>({ title:g.title, icon:g.icon, content:<SpecTable rows={g.rows} /> }))} />
        </div>

        {/* related */}
        <div style={{ marginTop:'var(--space-9)' }}>
          <h2 style={{ font:'var(--fw-bold) var(--fs-2xl)/1 var(--font-display)', letterSpacing:'-0.02em', color:'var(--ink-900)', margin:'0 0 var(--space-5)' }}>You might also like</h2>
          <div className="store-related-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'var(--space-5)' }}>
            {related.map(r=>(
              <RelatedCard key={r.id} p={r} onProduct={onProduct} />
            ))}
          </div>
        </div>

        <Modal open={sizeOpen} onClose={()=>setSizeOpen(false)} eyebrow="Find your fit" title="Size guide" width={560}>
          <p style={{ font:'var(--text-body-md)', color:'var(--text-muted)', margin:'0 0 var(--space-5)' }}>Match your height to a frame. When between sizes, size down for control, up for reach.</p>
          <SizeGuideTable />
        </Modal>
      </div>
    </div>
  );
}

function RelatedCard({ p, onProduct }) {
  return (
    <button className="store-related-card" onClick={()=>onProduct(p.id)} style={{ display:'flex', gap:14, alignItems:'center', textAlign:'left', cursor:'pointer', background:'var(--surface-card)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-md)', padding:12, transition:'var(--transition-base)' }}
      onMouseEnter={e=>e.currentTarget.style.boxShadow='var(--shadow-sm)'}
      onMouseLeave={e=>e.currentTarget.style.boxShadow='none'}>
      <div style={{ width:96, height:80, flex:'none', background:'linear-gradient(180deg,#fff,var(--steel-50))', borderRadius:'var(--radius-sm)', display:'flex', alignItems:'center', justifyContent:'center', padding:6 }}>
        <img src={productImage(p.id)} alt={p.name} style={{ maxWidth:'100%', maxHeight:'100%', objectFit:'contain', mixBlendMode:'multiply' }} />
      </div>
      <div>
        <div style={{ font:'var(--fw-regular) var(--fs-3xs)/1 var(--font-mono)', letterSpacing:'var(--tracking-wider)', textTransform:'uppercase', color:'var(--brand-ink)' }}>{p.series}</div>
        <div style={{ font:'var(--fw-bold) var(--fs-md)/1.1 var(--font-display)', color:'var(--ink-900)', margin:'4px 0 6px' }}>{p.name}</div>
        <div style={{ font:'var(--fw-bold) var(--fs-sm)/1 var(--font-mono)', color:'var(--price-accent)' }}>₹{p.price.toLocaleString('en-IN')}</div>
      </div>
    </button>
  );
}

function SpecTable({ rows }) {
  return (
    <div className="store-spec-table-grid" style={{ display:'grid', gridTemplateColumns:'170px 1fr', rowGap:12, columnGap:20 }}>
      {rows.map(([k,v],i)=>(
        <React.Fragment key={i}>
          <div style={{ font:'var(--fw-medium) var(--fs-2xs)/1.4 var(--font-mono)', letterSpacing:'var(--tracking-wide)', textTransform:'uppercase', color:'var(--text-muted)' }}>{k}</div>
          <div style={{ font:'var(--fw-regular) var(--fs-sm)/1.4 var(--font-body)', color:'var(--text-strong)' }}>{v}</div>
        </React.Fragment>
      ))}
    </div>
  );
}

function SizeGuideTable() {
  const cols = ['Size','Wheel','Rider height','Inseam'];
  const rows = [
    ['XS','24"','142–155 cm','67–73 cm'],
    ['S','26"','155–168 cm','71–78 cm'],
    ['M','27.5"','168–178 cm','76–83 cm'],
    ['L','29"','178–188 cm','81–88 cm'],
  ];
  const cell = { padding:'12px 14px', textAlign:'left', borderBottom:'1px solid var(--border-subtle)' };
  return (
    <div className="store-size-table-wrap">
    <table style={{ width:'100%', borderCollapse:'collapse', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-md)', overflow:'hidden' }}>
      <thead>
        <tr style={{ background:'var(--surface-sunken)' }}>
          {cols.map(c=>(<th key={c} style={{ ...cell, font:'var(--fw-semibold) var(--fs-3xs)/1 var(--font-mono)', letterSpacing:'var(--tracking-wider)', textTransform:'uppercase', color:'var(--text-strong)' }}>{c}</th>))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r,i)=>(
          <tr key={i}>
            {r.map((v,j)=>(<td key={j} style={{ ...cell, font:j===0?'var(--fw-bold) var(--fs-sm)/1 var(--font-display)':'var(--fw-regular) var(--fs-sm)/1 var(--font-body)', color:j===0?'var(--brand-ink)':'var(--text-body)' }}>{v}</td>))}
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}
export default ProductDetail;
