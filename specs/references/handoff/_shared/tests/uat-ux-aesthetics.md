---
title: UAT — UX & Aesthetics Quality Model
last_reviewed: 2025-11-19
status: Draft
owner: Finspeed Product + Design
---

This guide extends the functional UAT plan so that every test run also evaluates usability, visual quality, and basic accessibility. Use it alongside the SCN acceptance packs and the Playwright-based smoke tests.

## 1. Objectives & Scope

### 1.1 Objectives
- Validate that visitors understand what each page is for and how to complete key actions without guidance.
- Ensure the interface is visually consistent, on-brand, and not distracting.
- Confirm that critical flows feel smooth: minimal friction, clear feedback, and understandable error states.

### 1.2 Scope
- Navigation and information architecture (menus, breadcrumbs, search, footer links).
- Visual consistency (colors, typography, spacing, components) across pages.
- Responsiveness on mobile, tablet, and desktop viewports.
- Basic accessibility (keyboard navigation, labels, focus, contrast).
- Microcopy: labels, tooltips, helper text, error and empty states.

> Functional: “Can I do it?”  
> UX + aesthetics: “Do I know how to do it, and does it feel sane and trustworthy?”

## 2. UX & Aesthetic Quality Criteria

### 2.1 Usability
For each page/flow, check:
- **Clarity** — Purpose of the page and primary action are obvious.
- **Discoverability** — Key actions/links are easy to find without hunting.
- **Feedback** — Interactions show clear loading, success, or failure states.
- **Error handling** — Messages are human, specific, and help recovery.
- **Efficiency** — Common tasks complete with minimal unnecessary steps.
- **Consistency** — Similar things look and behave consistently across the site.

Record a short UX note per flow when something feels confusing or slow.

### 2.2 Visual design
- **Visual hierarchy** — Primary content and CTAs stand out appropriately.
- **Typography** — Fonts, sizes, and spacing are consistent and readable.
- **Color usage** — Brand palette only; sufficient contrast for text and key UI.
- **Spacing & alignment** — Elements align to a grid; whitespace is intentional.
- **Imagery & icons** — Crisp, consistent style; no mismatched icon sets.
- **States** — Buttons/links show clear hover, active, disabled, and loading states.

### 2.3 Responsiveness & layout
- Test at minimum:
  - Mobile: 360–414px width.
  - Tablet.
  - Desktop.
- No horizontal scrolling on standard pages.
- Navigation and primary CTAs remain visible and discoverable at all breakpoints.

### 2.4 Accessibility basics
- Core flows are keyboard-navigable (Tab/Shift+Tab, Enter, Space).
- All interactive elements look interactive.
- Form fields have labels; required fields are identified.
- Key images used as controls or brand marks have appropriate alternative text.
- Avoid low-contrast text (no “light grey on slightly lighter grey”).

## 3. Test Design Extensions

### 3.1 Enrich existing test cases
For each UAT test case:
- Keep the functional expected result.
- Add UX checks such as:
  - Is the main CTA visually dominant and clearly labelled?
  - Are errors clearly visible and near the relevant fields?
  - Are related pieces of information grouped and easy to scan?
- Add fields:
  - **UX Rating**: Good / Acceptable / Poor.
  - **Aesthetic notes**: free-text comments (e.g., “button text too small”).

### 3.2 UX‑specific scenarios
Run these qualitatively during UAT:
- **First-time visitor** — “What does this company do and how do I get started?”
- **Navigation & orientation** — Move across multiple pages and back home; confirm users never feel lost.
- **Error & edge cases** — Intentionally trigger validation errors or outage states; verify copy and layout remain reassuring.
- **Mobile-first pass** — Redo key journeys on mobile only; check tap targets, font sizes, and stickiness of headers/footers.

## 4. Aesthetic Review Process

### 4.1 Roles
- UX/UI designer or brand owner — final say on look & feel.
- Product owner — ensures alignment with brand story and messaging.
- 1–2 business stakeholders — sanity-check that the experience “feels like Finspeed”.

### 4.2 Templates/pages to review
- Home and key marketing landings.
- Catalog and model detail.
- Dealer locator.
- Support hub.
- Blog landing + representative article.

For each, apply an “Aesthetic Checklist”:
- Brand logo placement/size consistent.
- Color palette and gradients match the spec.
- Typography and spacing follow the style guide.
- Reused components (buttons, cards, modals, inputs) look and behave consistently.
- No obvious misalignments, overlaps, or truncated content.

### 4.3 Output
Per template/page, record:
- Verdict: **Pass** / **Needs minor tweaks** / **Needs major rework**.
- List of issues with screenshots.
- Whether each issue is **pre‑go‑live** or **post‑go‑live**.

## 5. Execution & Defect Management

### 5.1 During UAT runs
For each journey:
- Execute functional steps.
- Assign:
  - **UX score** (1–5).
  - **Aesthetics score** (1–5).
- Log issues with:
  - Type: Functional / Usability / Visual / Content.
  - Severity: P0–P3.

### 5.2 Severity guidance
- **P0 (Critical)** — UX/layout issue blocks key tasks on common devices.
- **P1 (Major)** — High confusion or high abandonment risk; or visual issue that seriously harms trust.
- **P2 (Minor)** — Usability annoyance or visible but low-impact visual defect.
- **P3 (Cosmetic)** — Pure polish/pixel-pushing.

Tag issues with `UX`, `Visual`, or `Content` labels in the tracker.

## 6. Cross-device / cross-browser

Minimum combinations:
- Desktop: latest Chrome/Edge.
- Mobile: Chrome on Android, Safari on iOS.

For each, perform:
- Core functional checks for the relevant flows.
- Quick UX/aesthetics scan (layout, fonts, tap targets, nav).

## 7. Reporting & Sign‑off

Include UX/aesthetic signals in UAT reporting:
- Counts of UX/visual issues opened vs closed, by severity.
- Themes (e.g., “navigation unclear on mobile”, “forms feel cramped”).
- Before/after screenshots for major UX/UI fixes.
- Average UX/aesthetic scores per key journey.

Exit criteria:
- No open P0 or P1 UX/visual issues on core journeys.
- UX/aesthetics checklist complete for all key templates.
- Design/brand owner sign‑off recorded in the slice proof:
  - “Visuals and interaction patterns are acceptable for launch.”
- Product owner explicitly accepts any remaining lower‑severity UX debts.

