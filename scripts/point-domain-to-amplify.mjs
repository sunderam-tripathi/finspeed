// Steward tool: point finspeed.online back to AWS Amplify via the Cloudflare API.
//
// Run this yourself with your Cloudflare token in the environment — the token
// never leaves your machine:
//   $env:CLOUDFLARE_API_TOKEN = "<your token>"     (PowerShell)
//   node scripts/point-domain-to-amplify.mjs           # dry run: shows current + planned records
//   node scripts/point-domain-to-amplify.mjs --apply   # captures before-state, then applies
//
// The token needs Zone.DNS edit permission for finspeed.online. Records are
// created/updated as DNS-only (proxied: false) — Amplify requires direct
// resolution for certificate validation and serving. Before-state is written
// to cloudflare-records-before.json next to this script's output directory.
import { writeFileSync } from 'node:fs';

const TOKEN = process.env.CLOUDFLARE_API_TOKEN;
if (!TOKEN) {
  console.error('Set CLOUDFLARE_API_TOKEN in this shell first (never share it elsewhere).');
  process.exit(1);
}
const APPLY = process.argv.includes('--apply');
const ZONE_NAME = 'finspeed.online';

// Filled in from the Amplify domain association (get-domain-association):
// Issued by `aws amplify get-domain-association` on 2026-07-27 for app
// d2h8tz7elv2xy8 (captured in the restoration proof):
const PLANNED = [
  { type: 'CNAME', name: '_0d29163ac070a2d50996634796dc559b.finspeed.online', content: '_e08e0b74c5947b5085e80da85b273288.xlfgrmvvlj.acm-validations.aws' },
  { type: 'CNAME', name: 'finspeed.online', content: 'da7jb35eyom86.cloudfront.net' },
  { type: 'CNAME', name: 'www.finspeed.online', content: 'da7jb35eyom86.cloudfront.net' },
];

const api = async (path, init = {}) => {
  const response = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json', ...(init.headers || {}) },
  });
  const body = await response.json();
  if (!body.success) throw new Error(`${path}: ${JSON.stringify(body.errors).slice(0, 300)}`);
  return body.result;
};

const zones = await api(`/zones?name=${ZONE_NAME}`);
if (!zones.length) throw new Error(`zone ${ZONE_NAME} not found for this token`);
const zone = zones[0];
console.log('zone:', zone.name, zone.id);

const existing = await api(`/zones/${zone.id}/dns_records?per_page=100`);
const relevant = existing.filter((r) => ['finspeed.online', 'www.finspeed.online', '_acme-challenge.finspeed.online'].some((n) => r.name === n || r.name.endsWith('.finspeed.online') && PLANNED.some((p) => p.name === r.name)));
console.log('\ncurrent records (relevant):');
for (const r of existing.filter((r) => ['A', 'AAAA', 'CNAME'].includes(r.type))) {
  console.log(`  ${r.type.padEnd(6)} ${r.name.padEnd(32)} -> ${String(r.content).slice(0, 60)} ${r.proxied ? '(proxied)' : '(dns-only)'}`);
}

console.log('\nplanned records:');
for (const p of PLANNED) console.log(`  ${p.type.padEnd(6)} ${p.name.padEnd(32)} -> ${p.content} (dns-only)`);

if (!APPLY) {
  console.log('\nDry run only. Re-run with --apply to capture before-state and apply.');
  process.exit(0);
}

writeFileSync('cloudflare-records-before.json', JSON.stringify(existing, null, 2) + '\n');
console.log('\nbefore-state captured: cloudflare-records-before.json');

for (const p of PLANNED) {
  const match = existing.find((r) => r.name === p.name && ['A', 'AAAA', 'CNAME'].includes(r.type));
  const payload = { type: p.type, name: p.name, content: p.content, ttl: 1, proxied: false };
  if (match) {
    await api(`/zones/${zone.id}/dns_records/${match.id}`, { method: 'PUT', body: JSON.stringify(payload) });
    console.log(`updated ${p.name} (${match.type} -> ${p.type})`);
  } else {
    await api(`/zones/${zone.id}/dns_records`, { method: 'POST', body: JSON.stringify(payload) });
    console.log(`created ${p.name}`);
  }
}
const after = await api(`/zones/${zone.id}/dns_records?per_page=100`);
writeFileSync('cloudflare-records-after.json', JSON.stringify(after, null, 2) + '\n');
console.log('after-state captured: cloudflare-records-after.json\nDone. Amplify will validate the certificate and begin serving once DNS propagates.');
