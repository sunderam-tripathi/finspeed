import { readFileSync, existsSync } from 'node:fs';

const CONVENTIONAL_RE = /^(feat|fix|docs|chore|refactor|test|build|ci|perf|style|revert)(\(.+\))?:\s.+/;
const SLICE_ID_RE = /[A-Z]{2,}-\d+/;

export function loadActiveSlice(path = 'specs/working-memory/active-slice.json') {
  if (!existsSync(path)) return { state: 'IDLE' };
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return { state: 'IDLE' };
  }
}

export function validateCommitMessage(message, options = {}) {
  const errors = [];
  const trimmed = (message || '').trim();
  if (!CONVENTIONAL_RE.test(trimmed)) {
    errors.push({ code: 'conventional', message: 'Missing conventional commit prefix (e.g., "docs(scope): message")' });
  }
  const { activeId, requireIdPattern } = options;
  if (activeId) {
    if (!trimmed.includes(activeId)) {
      errors.push({ code: 'active-id', message: `Active slice ${activeId} missing from commit message` });
    }
  } else if (requireIdPattern) {
    if (!SLICE_ID_RE.test(trimmed)) {
      errors.push({ code: 'pattern', message: 'No slice ID pattern (e.g., ABC-123) found in commit message' });
    }
  }
  return {
    ok: errors.length === 0,
    error: errors[0] || null,
    errors
  };
}
