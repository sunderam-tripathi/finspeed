// Finspeed Distributor Portal — Account (business profile, credit, addresses, team)
import React from 'react';
import { Button, Input, Badge, IconButton } from '../../ui/index.js';
import { distributorAccount, distributorTeam, formatInr } from '../../data/distributor.js';
import { useLucideIcons } from '../../lib/useLucideIcons.js';

function Field({ label, value }) {
  return (
    <div>
      <div style={{ font:'var(--fw-semibold) var(--fs-3xs)/1 var(--font-mono)', letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--text-faint)', marginBottom:6 }}>{label}</div>
      <div style={{ font:'var(--fw-medium) var(--fs-sm)/1.3 var(--font-body)', color:'var(--text-strong)' }}>{value}</div>
    </div>
  );
}

function Card({ title, action, children, pad=22 }) {
  return (
    <div style={{ background:'var(--surface-card)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-md)' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, padding:'16px 22px', borderBottom:'1px solid var(--border-subtle)' }}>
        <h3 style={{ font:'var(--fw-bold) var(--fs-lg)/1 var(--font-display)', color:'var(--ink-900)', margin:0 }}>{title}</h3>
        {action}
      </div>
      <div style={{ padding:pad }}>{children}</div>
    </div>
  );
}

function Account({ notify }) {
  const INR = formatInr;
  const A = distributorAccount;
  const team = distributorTeam;
  const [editing, setEditing] = React.useState(false);
  const [form, setForm] = React.useState({ contact:A.contact, phone:A.phone, email:A.email });

  useLucideIcons();

  const usedPct = Math.min((A.creditUsed / A.creditLimit) * 100, 100);
  const available = A.creditLimit - A.creditUsed;

  function set(k,v){ setForm(f=>({ ...f, [k]:v })); }
  function save(){ setEditing(false); notify && notify('Account details saved', 'success'); }

  return (
    <div style={{ padding:'28px 32px', display:'flex', flexDirection:'column', gap:24 }}>
      {/* identity banner */}
      <div style={{ display:'flex', alignItems:'center', gap:18, background:'var(--cyan-50)', border:'1px solid var(--cyan-200)', borderRadius:'var(--radius-md)', padding:'22px 26px', flexWrap:'wrap' }}>
        <div style={{ width:58, height:58, flex:'none', borderRadius:'50%', background:'linear-gradient(135deg,var(--cyan-400),var(--cyan-700))', display:'flex', alignItems:'center', justifyContent:'center', font:'var(--fw-bold) 22px/1 var(--font-display)', color:'var(--ink-900)' }}>RS</div>
        <div style={{ flex:'1 1 240px', minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
            <span style={{ font:'var(--fw-bold) var(--fs-2xl)/1.1 var(--font-display)', color:'var(--ink-900)', whiteSpace:'nowrap' }}>{A.legalName}</span>
            <span style={{ font:'var(--fw-bold) 10px/1 var(--font-mono)', letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--ink-900)', background:'var(--cyan-electric)', padding:'4px 9px', borderRadius:'var(--radius-pill)' }}>{A.tier}</span>
          </div>
          <div style={{ font:'var(--fw-regular) var(--fs-xs)/1.4 var(--font-mono)', color:'var(--text-muted)', marginTop:8 }}>{A.tradeName} · GSTIN {A.gstin} · Distributor since {A.since}</div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ font:'var(--fw-regular) var(--fs-2xs)/1 var(--font-mono)', color:'var(--text-muted)' }}>Payment terms</div>
          <div style={{ font:'var(--fw-bold) var(--fs-xl)/1 var(--font-mono)', color:'var(--brand-strong)', marginTop:6 }}>{A.terms}</div>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:24, alignItems:'start' }}>
        {/* business profile */}
        <Card title="Business profile" action={
          editing
            ? <div style={{ display:'flex', gap:8 }}><Button variant="ghost" size="sm" onClick={()=>{setForm({contact:A.contact,phone:A.phone,email:A.email});setEditing(false);}}>Cancel</Button><Button variant="primary" size="sm" onClick={save}>Save</Button></div>
            : <Button variant="outline" size="sm" iconLeft={<i data-lucide="pencil" style={{width:14,height:14}}></i>} onClick={()=>setEditing(true)}>Edit</Button>
        }>
          {editing ? (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              <Input label="Contact person" value={form.contact} onChange={e=>set('contact',e.target.value)} />
              <Input label="Phone" value={form.phone} onChange={e=>set('phone',e.target.value)} />
              <Input label="Email" value={form.email} onChange={e=>set('email',e.target.value)} style={{ gridColumn:'1 / -1' }} />
              <div style={{ gridColumn:'1 / -1', display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, paddingTop:4 }}>
                <Field label="GSTIN" value={A.gstin} />
                <Field label="PAN" value={A.pan} />
              </div>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px 16px' }}>
              <Field label="Contact person" value={form.contact} />
              <Field label="Phone" value={form.phone} />
              <Field label="Email" value={form.email} />
              <Field label="GSTIN" value={A.gstin} />
              <Field label="PAN" value={A.pan} />
              <Field label="Trade name" value={A.tradeName} />
            </div>
          )}
        </Card>

        {/* credit */}
        <Card title="Credit & terms">
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:10 }}>
            <span style={{ font:'var(--fw-regular) var(--fs-xs)/1 var(--font-body)', color:'var(--text-muted)' }}>Credit used</span>
            <span style={{ font:'var(--fw-bold) var(--fs-md)/1 var(--font-mono)', color:'var(--ink-900)' }}>{INR(A.creditUsed)}</span>
          </div>
          <div style={{ height:10, borderRadius:'var(--radius-pill)', background:'var(--surface-sunken)', overflow:'hidden' }}>
            <div style={{ width:usedPct+'%', height:'100%', background:'linear-gradient(90deg,var(--cyan-700),var(--cyan-electric))' }}></div>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:8, font:'var(--fw-regular) var(--fs-2xs)/1 var(--font-mono)', color:'var(--text-faint)' }}>
            <span>{usedPct.toFixed(0)}% utilised</span><span>{INR(A.creditLimit)} limit</span>
          </div>
          <div style={{ height:1, background:'var(--border-subtle)', margin:'18px 0' }}></div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ font:'var(--fw-regular) var(--fs-2xs)/1 var(--font-mono)', color:'var(--text-muted)' }}>Available to spend</div>
              <div style={{ font:'var(--fw-bold) var(--fs-2xl)/1 var(--font-mono)', color:'var(--price-accent)', marginTop:6 }}>{INR(available)}</div>
            </div>
            <Button variant="outline" size="sm" onClick={()=>notify&&notify('Credit-increase request sent to your success manager','info')}>Request increase</Button>
          </div>
        </Card>
      </div>

      {/* addresses */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
        {[['Billing address','receipt-text',A.billing],['Shipping / warehouse','truck',A.shipping]].map(([t,icon,addr],i)=>(
          <Card key={i} title={t} action={<IconButton variant="ghost" size="sm" aria-label="Edit address" icon={<i data-lucide="pencil" style={{width:14,height:14}}></i>} />}>
            <div style={{ display:'flex', gap:12 }}>
              <i data-lucide={icon} style={{width:18,height:18,color:'var(--brand-strong)',flex:'none',marginTop:2}}></i>
              <div style={{ font:'var(--fw-regular) var(--fs-sm)/1.6 var(--font-body)', color:'var(--text-body)' }}>
                <div style={{ fontWeight:600, color:'var(--ink-900)' }}>{A.legalName}</div>
                {addr.line1}<br/>{addr.line2}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* team */}
      <Card title="Team & access" pad={0} action={<Button variant="outline" size="sm" iconLeft={<i data-lucide="user-plus" style={{width:14,height:14}}></i>} onClick={()=>notify&&notify('Invite a teammate by email','info')}>Add user</Button>}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <tbody>
            {team.map((m,i)=>(
              <tr key={i} style={{ borderTop: i===0?'none':'1px solid var(--border-subtle)' }}>
                <td style={{ padding:'14px 22px', width:'1%', whiteSpace:'nowrap' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:36, height:36, flex:'none', borderRadius:'50%', background:'var(--surface-sunken)', display:'flex', alignItems:'center', justifyContent:'center', font:'var(--fw-bold) 13px/1 var(--font-display)', color:'var(--text-strong)' }}>{m.name.split(' ').map(w=>w[0]).join('')}</div>
                    <div>
                      <div style={{ font:'var(--fw-semibold) var(--fs-sm)/1.2 var(--font-body)', color:'var(--ink-900)' }}>{m.name}{m.you && <span style={{ font:'var(--fw-regular) var(--fs-3xs)/1 var(--font-mono)', color:'var(--text-faint)', marginLeft:8 }}>YOU</span>}</div>
                      <div style={{ font:'var(--fw-regular) var(--fs-2xs)/1 var(--font-mono)', color:'var(--text-muted)', marginTop:3 }}>{m.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding:'14px 8px', font:'var(--fw-medium) var(--fs-sm)/1 var(--font-body)', color:'var(--text-body)' }}>{m.role}</td>
                <td style={{ padding:'14px 8px' }}><Badge tone="neutral">{m.access}</Badge></td>
                <td style={{ padding:'14px 22px', textAlign:'right' }}>
                  <IconButton variant="ghost" size="sm" aria-label="Manage" icon={<i data-lucide="more-horizontal" style={{width:16,height:16}}></i>} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
export default Account;
