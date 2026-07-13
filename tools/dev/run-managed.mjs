#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';

const name = process.argv[2] || 'process';
const cmd = process.argv[3];
if (!cmd) {
  console.error('Usage: run-managed.mjs <name> <command> [args...]');
  process.exit(2);
}
const args = process.argv.slice(4);
const isWindowsCommandShim = process.platform === 'win32' && /\.(cmd|bat)$/i.test(cmd);
const executable = isWindowsCommandShim ? (process.env.ComSpec || 'cmd.exe') : cmd;
const executableArgs = isWindowsCommandShim ? ['/d', '/s', '/c', cmd, ...args] : args;

mkdirSync('tmp/process-logs', { recursive: true });
mkdirSync('specs/working-memory', { recursive: true });

const ts = new Date().toISOString().replace(/[:.]/g, '-');
const logPath = `tmp/process-logs/${name}-${ts}.log`;
const out = [];
const child = spawn(executable, executableArgs, { stdio: ['ignore', 'pipe', 'pipe'] });
child.stdout.on('data', d => out.push(d.toString()));
child.stderr.on('data', d => out.push(d.toString()));
child.on('close', code => {
  writeFileSync(logPath, out.join(''));
  const ledgerPath = 'specs/working-memory/dev-processes.json';
  let ledger = { processes: [] };
  if (existsSync(ledgerPath)) try { ledger = JSON.parse(readFileSync(ledgerPath, 'utf8')); } catch {}
  ledger.processes.push({ name, cmd, args, logPath, exitCode: code, ended_at: new Date().toISOString() });
  writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2));
  console.log('Process finished. Log:', logPath, 'exit', code);
  process.exit(code);
});

