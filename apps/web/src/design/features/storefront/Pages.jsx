// Finspeed storefront — content pages: About, Contact, Warranty, Assembly, Stores
import React from 'react';
import { Button, Input, Textarea, Select, Badge, Tag, Accordion, Breadcrumb } from '../../ui/index.js';
import { stores } from '../../data/storefront.js';
import { useLucideIcons } from '../../lib/useLucideIcons.js';

// shared light page-head band
function PageHead({ crumb, eyebrow, title, intro, onNav }) {
  return (
    <div style={{ background:'var(--surface-card)', borderBottom:'1px solid var(--border-subtle)' }}>
      <div style={{ maxWidth:'var(--container-max)', margin:'0 auto', padding:'var(--space-6) var(--space-7) var(--space-7)' }}>
        <div style={{ marginBottom:'var(--space-4)' }}>
          <Breadcrumb items={[{label:'Home',onClick:()=>onNav('home')},{label:crumb}]} />
        </div>
        {eyebrow && <span className="fin-eyebrow">{eyebrow}</span>}
        <h1 style={{ font:'var(--fw-bold) var(--fs-5xl)/1 var(--font-display)', letterSpacing:'-0.02em', color:'var(--ink-900)', margin:'8px 0 0' }}>{title}</h1>
        {intro && <p style={{ font:'var(--fw-regular) var(--fs-lg)/1.55 var(--font-body)', color:'var(--text-muted)', maxWidth:640, margin:'var(--space-4) 0 0' }}>{intro}</p>}
      </div>
    </div>
  );
}

// striped media placeholder
function Placeholder({ label, height=320, radius='var(--radius-lg)' }) {
  return (
    <div style={{ height, borderRadius:radius, border:'1px solid var(--border-subtle)',
      background:'repeating-linear-gradient(135deg, var(--steel-50) 0 14px, var(--surface-card) 14px 28px)',
      display:'flex', alignItems:'center', justifyContent:'center' }}>
      <span style={{ font:'var(--fw-medium) var(--fs-2xs)/1 var(--font-mono)', letterSpacing:'var(--tracking-wide)', textTransform:'uppercase', color:'var(--text-faint)' }}>{label}</span>
    </div>
  );
}

const wrap = { maxWidth:'var(--container-max)', margin:'0 auto', padding:'var(--space-9) var(--space-7)' };
const cardBox = { background:'var(--surface-card)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-lg)', padding:'var(--space-6)' };

/* ─────────────────────────── ABOUT ─────────────────────────── */
function About({ onNav }) {
  useLucideIcons();
  const stats = [['2019','Founded'],['12','Models in the fleet'],['6','States with dealers'],['85%','Pre-assembled, ride within the hour']];
  const values = [
    ['compass','Engineered for exploration','Every frame is tuned for the long way round — geometry, gearing and rubber chosen for real terrain, not the showroom.'],
    ['gauge','Performance you can feel','High-tensile steel, disc-brake confidence and broad all-terrain tyres. Spec that earns its place, never a number for the sheet.'],
    ['anchor','Built to take the hit','Oceanic-predator durability. We test to failure so your ride keeps rolling long after the trail gets rough.'],
  ];
  return (
    <div>
      {/* dark performance hero */}
      <section style={{ position:'relative', overflow:'hidden', background:'var(--fin-dark, var(--ink-900))', color:'#fff' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(110% 90% at 80% 20%, rgba(25,213,242,0.20), transparent 60%)' }}></div>
        <div style={{ ...wrap, position:'relative' }}>
          <span style={{ font:'var(--fw-medium) var(--fs-2xs)/1 var(--font-mono)', letterSpacing:'var(--tracking-wider)', textTransform:'uppercase', color:'var(--cyan-electric)' }}>About Finspeed</span>
          <h1 style={{ font:'var(--fw-bold) var(--fs-6xl)/0.98 var(--font-display)', letterSpacing:'-0.02em', color:'#fff', margin:'var(--space-4) 0 var(--space-5)', maxWidth:760 }}>Beyond limits,<br/>beyond boundaries.</h1>
          <p style={{ font:'var(--fw-regular) var(--fs-lg)/1.55 var(--font-body)', color:'rgba(255,255,255,0.72)', maxWidth:560, margin:0 }}>
            Finspeed builds performance cycles for riders who seek adventure and push their limits. Operated by MK Electric in Greater Noida, we ship a fleet named for the fastest things in the water — direct to riders and dealers across India.
          </p>
        </div>
      </section>

      {/* stats */}
      <section style={{ borderBottom:'1px solid var(--border-subtle)', background:'var(--surface-card)' }}>
        <div style={{ maxWidth:'var(--container-max)', margin:'0 auto', padding:'var(--space-7) var(--space-7)', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'var(--space-6)' }}>
          {stats.map((s,i)=>(
            <div key={i}>
              <div style={{ font:'var(--fw-bold) var(--fs-4xl)/1 var(--font-mono)', color:'var(--price-accent)' }}>{s[0]}</div>
              <div style={{ font:'var(--fw-regular) var(--fs-sm)/1.4 var(--font-body)', color:'var(--text-muted)', marginTop:8, maxWidth:160 }}>{s[1]}</div>
            </div>
          ))}
        </div>
      </section>

      {/* story */}
      <section style={wrap}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--space-8)', alignItems:'center' }}>
          <div>
            <span className="fin-eyebrow">Our story</span>
            <h2 style={{ font:'var(--fw-bold) var(--fs-3xl)/1.05 var(--font-display)', letterSpacing:'-0.02em', color:'var(--ink-900)', margin:'8px 0 var(--space-5)' }}>The commute, turned expedition.</h2>
            <p style={{ font:'var(--fw-regular) var(--fs-md)/1.7 var(--font-body)', color:'var(--text-body)', margin:'0 0 var(--space-4)' }}>
              We started with a simple conviction: a bicycle should be built to go further than the route you bought it for. So we engineered a fleet around real terrain — trail-ready hardtails, all-weather commuters and quick 700C hybrids.
            </p>
            <p style={{ font:'var(--fw-regular) var(--fs-md)/1.7 var(--font-body)', color:'var(--text-body)', margin:0 }}>
              You're not just riding a bike — you're experiencing freedom. Every Finspeed ships 85% pre-assembled with a one-year warranty, ready to ride within the hour.
            </p>
            <div style={{ display:'flex', gap:'var(--space-3)', marginTop:'var(--space-6)' }}>
              <Button variant="primary" onClick={()=>onNav('shop')} iconRight={<i data-lucide="arrow-right" style={{width:18,height:18}}></i>}>Explore the fleet</Button>
              <Button variant="outline" onClick={()=>onNav('stores')} iconLeft={<i data-lucide="map-pin" style={{width:17,height:17}}></i>}>Find a store</Button>
            </div>
          </div>
          <Placeholder label="Brand / workshop photo" height={400} />
        </div>
      </section>

      {/* values */}
      <section style={{ background:'var(--steel-50)', borderTop:'1px solid var(--border-subtle)' }}>
        <div style={wrap}>
          <span className="fin-eyebrow">What we build for</span>
          <h2 style={{ font:'var(--fw-bold) var(--fs-3xl)/1 var(--font-display)', letterSpacing:'-0.02em', color:'var(--ink-900)', margin:'8px 0 var(--space-7)' }}>The Finspeed difference</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'var(--space-5)' }}>
            {values.map((v,i)=>(
              <div key={i} style={cardBox}>
                <span style={{ display:'inline-flex', width:48, height:48, borderRadius:'var(--radius-md)', alignItems:'center', justifyContent:'center', background:'var(--cyan-50)', color:'var(--brand-strong)', marginBottom:'var(--space-4)' }}>
                  <i data-lucide={v[0]} style={{width:22,height:22}}></i>
                </span>
                <h3 style={{ font:'var(--fw-semibold) var(--fs-xl)/1.15 var(--font-display)', color:'var(--ink-900)', margin:'0 0 8px' }}>{v[1]}</h3>
                <p style={{ font:'var(--fw-regular) var(--fs-sm)/1.6 var(--font-body)', color:'var(--text-muted)', margin:0 }}>{v[2]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* distributor CTA */}
      <section style={{ ...wrap, paddingTop:'var(--space-9)', paddingBottom:'var(--space-9)' }}>
        <div style={{ position:'relative', overflow:'hidden', borderRadius:'var(--radius-lg)', background:'var(--fin-dark, var(--ink-900))', color:'#fff', padding:'var(--space-8)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'var(--space-6)', flexWrap:'wrap' }}>
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(90% 120% at 90% 50%, rgba(25,213,242,0.18), transparent 60%)' }}></div>
          <div style={{ position:'relative', maxWidth:520 }}>
            <span style={{ font:'var(--fw-medium) var(--fs-2xs)/1 var(--font-mono)', letterSpacing:'var(--tracking-wider)', textTransform:'uppercase', color:'var(--cyan-electric)' }}>For retailers</span>
            <h2 style={{ font:'var(--fw-bold) var(--fs-3xl)/1.05 var(--font-display)', letterSpacing:'-0.02em', color:'#fff', margin:'10px 0 8px' }}>Join the Network.</h2>
            <p style={{ font:'var(--fw-regular) var(--fs-md)/1.6 var(--font-body)', color:'rgba(255,255,255,0.72)', margin:0 }}>Healthy margins, Net-30 terms and ex-works dispatch. Stock the fleet riders ask for by name.</p>
          </div>
          <a href="/distributor/sign-in" style={{ position:'relative', textDecoration:'none' }}>
            <Button variant="primary" size="lg" bevel iconRight={<i data-lucide="arrow-right" style={{width:18,height:18}}></i>}>Become a dealer</Button>
          </a>
        </div>
      </section>
    </div>
  );
}

/* ─────────────────────────── CONTACT ─────────────────────────── */
function Contact({ onNav }) {
  const [sent, setSent] = React.useState(false);
  useLucideIcons([sent]);
  const info = [
    ['map-pin','Flagship store','Shop No. 20, Sarin Farm Society Market,\nSurajpur, Greater Noida – 201306'],
    ['phone','Phone & WhatsApp','+91 99580 11234'],
    ['mail','Email','hello@finspeed.online'],
    ['instagram','Social','@finspeed001 · finspeed.online'],
    ['clock','Hours','Mon–Sat · 10:00–20:00 IST'],
  ];
  return (
    <div style={{ background:'var(--bg-page)' }}>
      <PageHead onNav={onNav} crumb="Contact" eyebrow="We're listening" title="Get in touch" intro="Questions about a model, your order, or becoming a dealer? Reach the Finspeed team — we reply within one business day." />
      <div style={{ ...wrap, display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--space-8)', alignItems:'start' }}>
        {/* form */}
        <div style={cardBox}>
          {sent ? (
            <div style={{ textAlign:'center', padding:'var(--space-7) var(--space-2)' }}>
              <span style={{ display:'inline-flex', width:64, height:64, borderRadius:'50%', alignItems:'center', justifyContent:'center', background:'var(--success-bg)', color:'var(--success)', marginBottom:'var(--space-4)' }}><i data-lucide="check" style={{width:30,height:30}}></i></span>
              <h3 style={{ font:'var(--fw-bold) var(--fs-2xl)/1 var(--font-display)', color:'var(--ink-900)', margin:'0 0 8px' }}>Message sent</h3>
              <p style={{ font:'var(--text-body-sm)', color:'var(--text-muted)', margin:'0 0 var(--space-5)' }}>Thanks for reaching out — we'll be in touch shortly.</p>
              <Button variant="outline" onClick={()=>setSent(false)}>Send another</Button>
            </div>
          ) : (
            <form onSubmit={(e)=>{e.preventDefault();setSent(true);window.scrollTo(0,0);}} style={{ display:'flex', flexDirection:'column', gap:'var(--space-4)' }}>
              <h3 style={{ font:'var(--fw-semibold) var(--fs-xl)/1 var(--font-display)', color:'var(--ink-900)', margin:0 }}>Send us a message</h3>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--space-4)' }}>
                <Input label="Name" placeholder="Your name" required />
                <Input label="Phone" placeholder="+91 ……" />
              </div>
              <Input label="Email" type="email" placeholder="you@email.com" required />
              <Select label="Topic" options={['Product question','Order or delivery','Warranty & service','Become a dealer','Something else']} />
              <Textarea label="Message" rows={4} placeholder="How can we help?" required />
              <Button type="submit" variant="primary" size="lg" full iconRight={<i data-lucide="send" style={{width:17,height:17}}></i>}>Send message</Button>
            </form>
          )}
        </div>
        {/* details */}
        <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-5)' }}>
          <div style={cardBox}>
            <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-5)' }}>
              {info.map((it,i)=>(
                <div key={i} style={{ display:'flex', gap:'var(--space-4)', alignItems:'flex-start' }}>
                  <span style={{ width:42, height:42, flex:'none', borderRadius:'var(--radius-md)', background:'var(--cyan-50)', color:'var(--brand-strong)', display:'inline-flex', alignItems:'center', justifyContent:'center' }}><i data-lucide={it[0]} style={{width:19,height:19}}></i></span>
                  <div>
                    <div style={{ font:'var(--fw-medium) var(--fs-2xs)/1 var(--font-mono)', letterSpacing:'var(--tracking-wide)', textTransform:'uppercase', color:'var(--text-faint)', marginBottom:6 }}>{it[1]}</div>
                    <div style={{ font:'var(--fw-regular) var(--fs-sm)/1.5 var(--font-body)', color:'var(--text-strong)', whiteSpace:'pre-line' }}>{it[2]}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Placeholder label="Map — Surajpur, Greater Noida" height={220} />
          <button onClick={()=>onNav('stores')} style={{ ...cardBox, cursor:'pointer', textAlign:'left', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'var(--space-4)' }}>
            <span style={{ font:'var(--fw-semibold) var(--fs-md)/1.3 var(--font-body)', color:'var(--ink-900)' }}>Prefer to visit? Find a store near you.</span>
            <i data-lucide="arrow-right" style={{width:20,height:20,color:'var(--brand-strong)'}}></i>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── WARRANTY ─────────────────────────── */
function Warranty({ onNav }) {
  useLucideIcons();
  const coverage = [
    ['shield-check','5-year frame warranty','Structural frame & fork against manufacturing defects, from date of purchase.'],
    ['settings','1-year components','Gears, brakes, wheels and fittings against defects in material or workmanship.'],
    ['wrench','Free first service','One complimentary tune-up within 90 days — gears, brakes and bolt-torque check.'],
  ];
  const claim = [
    ['Register your ride','Keep your order number or invoice handy — that\'s your proof of purchase.'],
    ['Tell us what happened','Raise a request via Contact with the model, a short description and a photo or two.'],
    ['We assess & approve','Our team reviews within 2 working days and confirms the fix or replacement.'],
    ['Repair or replace','Approved parts dispatch free; your nearest service centre handles the fitting.'],
  ];
  const faq = [
    { title:'What\'s covered under warranty?', content:'Manufacturing and material defects in the frame, fork and original components. The frame and fork carry 5 years of structural cover; fitted components carry 12 months.' },
    { title:'What\'s not covered?', content:'Normal wear (tyres, brake pads, cables, grips), accident or impact damage, corrosion from neglect, unsupported modifications, and damage from improper assembly or use beyond the cycle\'s intended terrain.' },
    { title:'How long does a claim take?', content:'Most claims are assessed within 2 working days of receiving photos and your proof of purchase. Approved replacement parts dispatch within 5 working days.' },
    { title:'Is transit damage covered?', content:'Yes — report any transit damage within 48 hours of delivery with photos and we\'ll replace the affected unit or part free of charge.' },
    { title:'Does servicing affect my warranty?', content:'Keep to the recommended service intervals at a Finspeed store or service centre and your warranty stays intact. Hold on to your service records.' },
  ];
  return (
    <div style={{ background:'var(--bg-page)' }}>
      <PageHead onNav={onNav} crumb="Warranty" eyebrow="Ride with confidence" title="Warranty & service" intro="Every Finspeed is built to take the hit — and backed accordingly. Here's exactly what's covered and how to make a claim." />
      <section style={wrap}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'var(--space-5)', marginBottom:'var(--space-9)' }}>
          {coverage.map((c,i)=>(
            <div key={i} style={cardBox}>
              <span style={{ display:'inline-flex', width:48, height:48, borderRadius:'var(--radius-md)', alignItems:'center', justifyContent:'center', background:'var(--cyan-50)', color:'var(--brand-strong)', marginBottom:'var(--space-4)' }}><i data-lucide={c[0]} style={{width:22,height:22}}></i></span>
              <h3 style={{ font:'var(--fw-semibold) var(--fs-xl)/1.15 var(--font-display)', color:'var(--ink-900)', margin:'0 0 8px' }}>{c[1]}</h3>
              <p style={{ font:'var(--fw-regular) var(--fs-sm)/1.6 var(--font-body)', color:'var(--text-muted)', margin:0 }}>{c[2]}</p>
            </div>
          ))}
        </div>

        {/* claim steps */}
        <span className="fin-eyebrow">Making a claim</span>
        <h2 style={{ font:'var(--fw-bold) var(--fs-3xl)/1 var(--font-display)', letterSpacing:'-0.02em', color:'var(--ink-900)', margin:'8px 0 var(--space-6)' }}>Four steps to a fix</h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'var(--space-5)', marginBottom:'var(--space-9)' }}>
          {claim.map((s,i)=>(
            <div key={i}>
              <span style={{ display:'inline-flex', width:40, height:40, borderRadius:'var(--radius-sm)', background:'var(--ink-900)', color:'var(--cyan-electric)', alignItems:'center', justifyContent:'center', font:'var(--fw-bold) var(--fs-md)/1 var(--font-mono)', marginBottom:'var(--space-4)' }}>{i+1}</span>
              <h3 style={{ font:'var(--fw-semibold) var(--fs-md)/1.2 var(--font-display)', color:'var(--ink-900)', margin:'0 0 6px' }}>{s[0]}</h3>
              <p style={{ font:'var(--fw-regular) var(--fs-sm)/1.55 var(--font-body)', color:'var(--text-muted)', margin:0 }}>{s[1]}</p>
            </div>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1.3fr 0.7fr', gap:'var(--space-7)', alignItems:'start' }}>
          <div>
            <span className="fin-eyebrow">Good to know</span>
            <h2 style={{ font:'var(--fw-bold) var(--fs-2xl)/1 var(--font-display)', letterSpacing:'-0.02em', color:'var(--ink-900)', margin:'8px 0 var(--space-5)' }}>Warranty FAQ</h2>
            <Accordion defaultOpen={0} items={faq} />
          </div>
          <div style={{ ...cardBox, background:'var(--cyan-50)', border:'1px solid var(--cyan-200)' }}>
            <h3 style={{ font:'var(--fw-semibold) var(--fs-lg)/1.2 var(--font-display)', color:'var(--ink-900)', margin:'0 0 8px' }}>Need to make a claim?</h3>
            <p style={{ font:'var(--fw-regular) var(--fs-sm)/1.6 var(--font-body)', color:'var(--text-body)', margin:'0 0 var(--space-5)' }}>Start with your order number and a couple of photos. We'll take it from there.</p>
            <Button variant="primary" full onClick={()=>onNav('contact')} iconRight={<i data-lucide="arrow-right" style={{width:17,height:17}}></i>}>Start a claim</Button>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─────────────────────────── ASSEMBLY ─────────────────────────── */
function Assembly({ onNav }) {
  useLucideIcons();
  const tools = ['5/6 mm Allen keys (in the box)','15 mm pedal spanner','Track / floor pump with gauge','15 minutes & a flat surface'];
  const steps = [
    ['package-open','Unbox & inspect','Lift the cycle out by the frame, not the cables. Check off every part against the packing list and inspect for transit damage before you start.'],
    ['circle-dot','Fit the front wheel','Seat the axle in the dropouts, tighten the quick-release or axle nuts firmly, then spin to confirm the wheel runs true and centred.'],
    ['move-horizontal','Set the handlebar','Align the stem square to the front wheel, then torque the faceplate bolts evenly in a cross pattern. The bar should not twist under firm pressure.'],
    ['footprints','Thread the pedals','Pedals are marked L and R. The right pedal threads clockwise, the left anti-clockwise — start by hand to avoid cross-threading, then snug with the spanner.'],
    ['arrow-up-down','Saddle height','Set the saddle so your leg is almost straight at the bottom of the stroke. Keep the seatpost above its minimum-insertion line.'],
    ['disc','Brakes & gears','Squeeze each brake — firm, not spongy — and shift through the gears on the stand. Adjust the barrel adjusters if shifting hesitates.'],
    ['gauge','Tyre pressure','Inflate to the PSI printed on the sidewall. Correct pressure protects the rims and transforms how the bike rolls.'],
    ['shield-check','Pre-ride safety check','Run the ABC check — Air, Brakes, Chain — and re-check every bolt after your first short ride.'],
  ];
  return (
    <div style={{ background:'var(--bg-page)' }}>
      <PageHead onNav={onNav} crumb="Assembly guide" eyebrow="Ride within the hour" title="Assembly guide" intro="Your Finspeed arrives 85% pre-assembled. Eight quick steps take it from the box to the road — no bike-shop trip required." />
      <section style={wrap}>
        <div style={{ display:'grid', gridTemplateColumns:'1.4fr 0.6fr', gap:'var(--space-7)', alignItems:'start' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-4)' }}>
            {steps.map((s,i)=>(
              <div key={i} style={{ ...cardBox, display:'flex', gap:'var(--space-5)', alignItems:'flex-start' }}>
                <span style={{ display:'inline-flex', width:44, height:44, flex:'none', borderRadius:'var(--radius-md)', background:'var(--ink-900)', color:'var(--cyan-electric)', alignItems:'center', justifyContent:'center', font:'var(--fw-bold) var(--fs-md)/1 var(--font-mono)' }}>{String(i+1).padStart(2,'0')}</span>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
                    <i data-lucide={s[0]} style={{width:19,height:19,color:'var(--brand-strong)'}}></i>
                    <h3 style={{ font:'var(--fw-semibold) var(--fs-lg)/1.2 var(--font-display)', color:'var(--ink-900)', margin:0 }}>{s[1]}</h3>
                  </div>
                  <p style={{ font:'var(--fw-regular) var(--fs-sm)/1.65 var(--font-body)', color:'var(--text-muted)', margin:0 }}>{s[2]}</p>
                </div>
              </div>
            ))}
          </div>
          {/* sidebar */}
          <div style={{ position:'sticky', top:'var(--space-5)', display:'flex', flexDirection:'column', gap:'var(--space-5)' }}>
            <Placeholder label="Assembly video" height={180} />
            <div style={cardBox}>
              <h3 style={{ font:'var(--fw-semibold) var(--fs-md)/1 var(--font-display)', color:'var(--ink-900)', margin:'0 0 var(--space-4)' }}>What you'll need</h3>
              <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:'var(--space-3)' }}>
                {tools.map((t,i)=>(
                  <li key={i} style={{ display:'flex', gap:10, alignItems:'flex-start', font:'var(--fw-regular) var(--fs-sm)/1.4 var(--font-body)', color:'var(--text-body)' }}>
                    <i data-lucide="check" style={{width:16,height:16,color:'var(--brand-strong)',marginTop:3,flex:'none'}}></i>{t}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ ...cardBox, background:'var(--cyan-50)', border:'1px solid var(--cyan-200)' }}>
              <h3 style={{ font:'var(--fw-semibold) var(--fs-md)/1.2 var(--font-display)', color:'var(--ink-900)', margin:'0 0 6px' }}>Rather not DIY?</h3>
              <p style={{ font:'var(--fw-regular) var(--fs-sm)/1.55 var(--font-body)', color:'var(--text-body)', margin:'0 0 var(--space-4)' }}>Drop into any Finspeed store for a free assembly and safety check.</p>
              <Button variant="dark" full onClick={()=>onNav('stores')} iconLeft={<i data-lucide="map-pin" style={{width:16,height:16}}></i>}>Find a store</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─────────────────────────── STORES ─────────────────────────── */
function Stores({ onNav }) {
  const S = stores;
  const [city, setCity] = React.useState('all');
  useLucideIcons();
  const cities = ['all', ...Array.from(new Set(S.map(s=>s.city)))];
  const list = city==='all' ? S : S.filter(s=>s.city===city);
  const toneFor = (t)=> t==='Flagship' ? 'brand' : t==='Service centre' ? 'neutral' : 'ink';
  return (
    <div style={{ background:'var(--bg-page)' }}>
      <PageHead onNav={onNav} crumb="Find a store" eyebrow="Visit us" title="Find a store" intro="Test-ride the bikes, collect an order or book a service at a Finspeed store near you." />
      <div style={{ ...wrap, display:'grid', gridTemplateColumns:'1fr 1.1fr', gap:'var(--space-7)', alignItems:'start' }}>
        {/* list */}
        <div>
          <div style={{ display:'flex', gap:'var(--space-2)', flexWrap:'wrap', marginBottom:'var(--space-5)' }}>
            {cities.map(c=>(
              <Tag key={c} selected={city===c} onClick={()=>setCity(c)}>{c==='all'?'All cities':c}</Tag>
            ))}
          </div>
          <div style={{ font:'var(--fw-regular) var(--fs-sm)/1 var(--font-mono)', color:'var(--text-muted)', marginBottom:'var(--space-4)' }}>{list.length} {list.length===1?'location':'locations'}</div>
          <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-4)' }}>
            {list.map(s=>(
              <div key={s.id} style={cardBox}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'var(--space-3)', marginBottom:'var(--space-3)' }}>
                  <h3 style={{ font:'var(--fw-bold) var(--fs-lg)/1.15 var(--font-display)', color:'var(--ink-900)', margin:0 }}>{s.name}</h3>
                  <Badge tone={toneFor(s.type)}>{s.type}</Badge>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  <StoreDetailRow icon="map-pin">{s.addr}, {s.city}, {s.state} {s.pin}</StoreDetailRow>
                  <StoreDetailRow icon="phone">{s.phone}</StoreDetailRow>
                  <StoreDetailRow icon="clock">{s.hours}</StoreDetailRow>
                </div>
                <div style={{ display:'flex', gap:'var(--space-3)', marginTop:'var(--space-5)', borderTop:'1px solid var(--border-subtle)', paddingTop:'var(--space-4)' }}>
                  <Button variant="outline" size="sm" iconLeft={<i data-lucide="navigation" style={{width:15,height:15}}></i>}>Directions</Button>
                  <Button variant="ghost" size="sm" onClick={()=>onNav('contact')} iconLeft={<i data-lucide="phone" style={{width:15,height:15}}></i>}>Call store</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* map */}
        <div style={{ position:'sticky', top:'var(--space-5)' }}>
          <Placeholder label="Interactive store map" height={560} />
        </div>
      </div>
    </div>
  );
}
function StoreDetailRow({ icon, children }) {
  return (
    <div style={{ display:'flex', gap:10, alignItems:'flex-start', font:'var(--fw-regular) var(--fs-sm)/1.5 var(--font-body)', color:'var(--text-body)' }}>
      <i data-lucide={icon} style={{width:16,height:16,color:'var(--text-faint)',marginTop:3,flex:'none'}}></i>{children}
    </div>
  );
}

export { About, Contact, Warranty, Assembly, Stores };
