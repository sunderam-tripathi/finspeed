#!/usr/bin/env node
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';

const [id, domain] = process.argv.slice(2);
if (!id || !domain) {
  console.error('Usage: generate-plan.mjs <SLICE-ID> <domain>');
  process.exit(2);
}

const dir = `specs/notes/plans/${domain}`;
mkdirSync(dir, { recursive: true });
const path = `${dir}/${id}.md`;
if (existsSync(path)) {
  console.log('Plan already exists:', path);
  process.exit(0);
}
const template = `# Plan — ${id}\n\n- Context:\n- Goals:\n- Risks:\n\n## Steps\n1. \n2. \n3. \n\n## Execution Checklist\n- [ ] Proof artefacts captured\n- [ ] Progress telemetry updated\n`;
writeFileSync(path, template);
console.log('Plan created at', path);

