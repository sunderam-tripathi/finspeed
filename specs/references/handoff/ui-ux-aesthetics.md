Here’s a full UI–UX spec you can hand directly to a designer/developer for Finspeed.

---

# FINSPEED Web UI / UX Aesthetic & Flow Spec

Tagline: **“Turning Pedals into Power”** / **“पैडल से बने ताक़त”** (can tune copy, but keep spirit identical).

---

## 1. Brand Identity & Design Philosophy

### 1.1 Brand pillars

Design decisions should always line up with these three pillars:

1. **Engineering** – precise, efficient, technical.

   * Clean lines, grid-aligned layouts, no visual clutter.
   * Components feel “engineered”, not ornamental.

2. **Accessibility (Affordability + Ease)** – bikes for everyone.

   * Readable typography, strong contrast, clear CTAs.
   * UI should be understandable by someone new to web shopping.

3. **Sustainability** – bikes as green mobility.

   * Fresh, breathable colors (aqua, white, soft neutrals).
   * Visual metaphors: air, water, greenery, sunlight.

Keywords: **fast, reliable, urban, fresh, minimal, human, Indian.**

---

## 2. Visual Design System

### 2.1 Color palette

Base this on the logo you shared (aqua ring + black/white).

**Core colors**

| Token name           | Hex       | Usage                                                       |
| -------------------- | --------- | ----------------------------------------------------------- |
| `--fs-primary`       | `#40B0D0` | Aqua ring / main accent, links, primary buttons, highlights |
| `--fs-primary-dark`  | `#104050` | Dark teal for hover states, gradients, secondary sections   |
| `--fs-ink`           | `#111827` | Main text on light backgrounds                              |
| `--fs-bg-dark`       | `#02030A` | Hero background, dark sections                              |
| `--fs-surface`       | `#FFFFFF` | Cards, panels, main content background                      |
| `--fs-surface-muted` | `#F3F4F6` | Muted section background, filters, alternating rows         |

**Support / semantic colors**

| Token             | Hex       | Usage                                |
| ----------------- | --------- | ------------------------------------ |
| `--fs-eco`        | `#7DDB6A` | Sustainability badges, small accents |
| `--fs-warning`    | `#F97316` | Alert banners, rare warnings         |
| `--fs-border`     | `#E5E7EB` | Card borders, dividers               |
| `--fs-muted-text` | `#6B7280` | Secondary text, meta info            |

**Gradients**

* **Hero gradient (dark mode):**
  `background: radial-gradient(circle at top left, #40B0D0 0%, #02030A 55%, #000000 100%);`
* **CTA background (light):**
  `linear-gradient(135deg, #40B0D0 0%, #104050 100%);`

**Color usage rule of thumb**

* 70% whites / light surfaces
* 20% darks (ink, dark hero)
* 10% accent (aqua + eco green)

This keeps the bikes and photography visually dominant.

---

### 2.2 Typography

Goal: simple, legible, works equally well in English and Hindi.

**Font stack (web)**

```css
font-family: "Inter", "Hind", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

* **Inter** (Latin) – clean, modern for English UI.
* **Hind** (Devanagari) – pairs well, good legibility in Hindi.
* Use `lang="hi"` on Hindi blocks so browsers pick Hind where available.

**Type scale (desktop)**

| Style        | Size | Weight | Line height | Usage                                      |
| ------------ | ---- | ------ | ----------- | ------------------------------------------ |
| H1           | 48px | 700    | 120%        | Homepage hero headline                     |
| H2           | 36px | 600    | 120%        | Section titles                             |
| H3           | 28px | 600    | 130%        | Subsection titles, product detail headings |
| H4           | 22px | 600    | 130%        | Card titles, blog titles                   |
| Body / P     | 16px | 400    | 150%        | All standard text                          |
| Body strong  | 16px | 500    | 150%        | Emphasised body text                       |
| Small / Meta | 14px | 400    | 150%        | Labels, filters, timestamps                |
| Button text  | 15px | 600    | 130%        | All CTAs                                   |

**Mobile**

* H1: 32px, H2: 26px, H3: 22px.
* All body stays 16px; never go below 14px.

**Bilingual parity rule**

* Every key piece of content must exist in **both** languages.
* For headings, show primary language first + secondary just below in smaller size, or provide a global language toggle (see bilingual section).

---

### 2.3 Layout & grid

* **Max content width (desktop):** 1200–1280px centered.
* **Grid:** 12 columns, 24px gutters.
* **Base spacing unit:** 8px. (Everything is multiples of 8px.)
* **Section vertical padding:** 64px desktop, 40px mobile.

**Responsive breakpoints**

* Mobile: `< 640px` (single column, stacked).
* Tablet: `640–1024px` (2 columns where relevant).
* Desktop: `> 1024px`.

---

### 2.4 Core components

#### 2.4.1 Buttons

**Primary button**

* Background: `--fs-primary`
* Hover: `--fs-primary-dark`
* Text: white
* Border-radius: 999px (pill)
* Padding: `12px 24px`
* Shadow on hover: `0 10px 24px rgba(0,0,0,0.25)`
* Examples: “View Bicycles”, “Find a Dealer”, “WhatsApp Us”.

**Secondary button**

* Background: transparent
* Border: `1.5px solid #40B0D0`
* Text: `--fs-primary`
* Hover: subtle primary-tinted background (`rgba(64,176,208,0.08)`)

**Ghost / text button**

* No border, text in `--fs-muted-text`
* Underline on hover only.

#### 2.4.2 Cards

**Product card**

* Width: responsive; desktop grid 3 per row.
* Border-radius: 16px.
* Background: `--fs-surface`.
* Border: `1px solid --fs-border`.
* Content structure:

  * Top: product image (3:2 ratio).
  * Middle: model name (H4), short spec snippet.
  * Bottom: price band, tags (“City”, “Hybrid”, “Electric”), CTA “View details”.

Hover behavior:

* Slight scale: `transform: translateY(-4px);`
* Shadow increases: `0 12px 30px rgba(0,0,0,0.18)`.
* Thin aqua highlight border: `border-color: #40B0D0`.

**Blog card**

* Similar structure but with category pill and date.
* On hover: image implements a slow zoom-in (scale 1.03) masked in rounded corners.

#### 2.4.3 Navigation bar

* Height: 72px desktop, 64px mobile.
* Left: logo.
* Center: navigation links.
* Right: language toggle & WhatsApp mini-CTA.

Desktop layout:

* Logo left, nav links center: “Bicycles”, “Dealer Locator”, “Blog”, “Brand Story”, “Support”.
* Right: Language toggle + “WhatsApp” pill.

Language toggle:

* Compact segmented control:

  * `EN` | `हिंदी`
  * Active segment background: `--fs-primary`, text white.
  * Inactive: `--fs-surface-muted`, text `--fs-muted-text`.
* On hover: slight elevation.

Mobile:

* Logo left, hamburger right.
* When opened: full-height overlay from the right, background `--fs-bg-dark`, links stacked with large tappable targets.

#### 2.4.4 Language toggle behavior

* Toggles **entire site language** while preserving route.
* State persisted in local storage.
* Smooth fade transition (200ms opacity crossfade) for text content to avoid jarring jumps.

#### 2.4.5 Inputs & forms

* Background: white.
* Border: `1px solid --fs-border` (focus state: `2px solid --fs-primary`).
* Border-radius: 12px.
* Padding: 10px vertical, 12px horizontal.
* Placeholder: `--fs-muted-text`.
* Labels above each field (14px, medium).
* Error message in `--fs-warning` 13px below.

Used in filters, dealer search, newsletter signup.

State guidance:

* Inline validation fires on blur and shows an icon + message in the selected language.
* Success state adds a thin `--fs-eco` underline and replaces helper text with confirmation copy.
* Loading states (e.g., dealer lookup) display a pill-shaped progress bar with aqua shimmer.
* Form CTAs stay disabled until all mandatory fields validate; disabled buttons keep full opacity but add `cursor: not-allowed` for clarity.
* If the user switches languages mid-form, keep their input values and only translate labels/helpers.

#### 2.4.6 Map markers (Dealer locator)

* Round pin with Finspeed aqua outline and white fill.
* Currently selected dealer: filled aqua pin with a small white bicycle icon.
* Hover/active: slight bounce animation and drop shadow.

#### 2.4.7 WhatsApp CTA

* Persistent floating button bottom-right (desktop/tablet), bottom-center (mobile).
* Shape: round (56px).
* Background: gradient from `#25D366` to `--fs-primary`.
* Icon: WhatsApp logo in white.
* Tooltip / label on hover (desktop): “Chat on WhatsApp / व्हाट्सऐप पर बात करें”.

Click → opens `wa.me` link in new tab.

---

### 2.5 Imagery & iconography

**Photography pillars**

* Shoot/curate in real Indian environments—densely packed streets, metro backdrops, monsoon light.
* Balance three shot families:
  * **Hero lifestyle**: riders in motion, wide angle, ample negative space for bilingual copy blocks.
  * **Detail engineering**: macro shots of welds, drivetrain, leaf-inspired frame elements.
  * **Community/documentary**: service centers, support staff, dealer storefronts.

**Hero & product imagery**

* Maintain 3:2 aspect ratio for product bikes; keep drivetrain visible for authenticity.
* Heroes can use atmospheric haze overlays (radial gradient `rgba(2,3,10,0.55)` at bottom 30%) to protect text contrast.
* Avoid harsh drop shadows; instead use subtle ground reflections (blurred gradient) to imply depth.

**People imagery**

* Represent diverse genders, age groups, and attire typical of urban India (workwear, casual, kurta).
* Encourage helmet usage to reinforce safety.
* Capture bilingual signage or local cues when possible to help orient visitors.

**File prep**

* Export hero assets at 2880px width (webp + fallback jpg) and product detail at 1600px.
* Compress to <300 KB for heroes and <180 KB for catalog tiles.
* Provide dark-mode alternatives when backgrounds disappear against `--fs-bg-dark`.

**Icon system**

* 24px artboard, 2px rounded strokes, optical alignment to the 12-column grid.
* Use filled shapes sparingly (only for emphasis states such as dealer availability).
* Icons conveying states (warning, success) must include the semantic color plus text label to satisfy accessibility.
* For bilingual labels, align icon left, English text first, Hindi below at 90% size.

---

### 2.6 Motion & microinteractions

General motion rules:

* Durations: 150–300ms for UI transitions.
* Easing: `cubic-bezier(0.4, 0.0, 0.2, 1)` (standard material-like).
* Keep motion subtle: “fast and smooth” not “flashy”.

**Specific interactions**

* **Hero load:** text slides up 8px with fade-in; bike image slides in from right with 250ms delay.

* **Scroll effects:**

  * Section titles fade up as they enter viewport.
  * Background aqua arcs / waves slightly parallax on scroll.

* **Button hover:** subtle scale 1.03; background color transition 150ms.

* **Language toggle:** active pill glides horizontally between EN/हिंदी with 200ms animation.

* **Dealer locator:** when user searches, markers drop in with tiny bounce.

**Reduced-motion handling**

* Respect `prefers-reduced-motion`: disable translations/parallax, fall back to opacity fades only.
* Carousel autoplay pauses entirely; show an explicit “Play animation” button.
* Persist the setting in local storage so the site remembers the preference beyond OS defaults.

**Feedback patterns**

* Form errors shake horizontally 4px at 200ms to mimic tactile feedback (skip when reduced motion is on).
* WhatsApp floating CTA pulses every 10 s (scale 1.05) but halts when user scrolls beyond 75% of page.
* Map pins animate once when entering viewport; repeated queries stagger drop-ins by 50ms increments to avoid chaos.

**Page transitions**

* Between main routes, fade the body background (120ms) before sliding in the new hero to keep continuity.
* If a route is data-heavy (catalog filters, dealer search), use skeleton loaders that shimmer diagonally at 45°.

---

### 2.7 Metrics, data viz & badges

Use minimalist infographics to support sustainability and impact stories.

* **KPI tiles:** 3-up cards with numeric headline (48px) + bilingual descriptor. Background: translucent `rgba(64,176,208,0.08)` with thin border.
* **Progress rings:** use the logo ring motif; outer stroke `--fs-primary`, inner `--fs-primary-dark`. Display percentage plus short label in both languages.
* **Line/area charts:** single-series gradients from aqua → teal; markers use small filled circles with white stroke for legibility.
* **Badges:** warranty/service/EMI badges share pill shape, `--fs-radius-pill`, icon left, text stack EN/Hindi.
* All chart text follows Body strong (16px, 500) and lives within 90% contrast backgrounds to stay AA compliant.

---

### 2.8 Surfaces, depth & glassmorphism

**Layering principles**

* Always maintain three layers per hero/section: background gradient, ambient glow/texture, and foreground glass cards.
* Foreground surfaces must stay ≥6:1 contrast relative to text; if the gradient is too bright, fade it with `rgba(2,3,10,0.45)` overlay.
* Restrict glass surfaces to navigation, hero copy blocks, CTA strips, testimonial carousel, and dealer/map overlays so the effect feels intentional.

**Glass card recipe (dark mode hero example)**

```css
.fs-glass-card {
  background: linear-gradient(135deg, rgba(2,3,10,0.72), rgba(16,64,80,0.58));
  border: 1px solid rgba(255,255,255,0.14);
  box-shadow: 0 20px 45px rgba(0,0,0,0.45);
  backdrop-filter: blur(var(--fs-glass-blur, 24px));
  -webkit-backdrop-filter: blur(var(--fs-glass-blur, 24px));
  border-radius: var(--fs-radius-lg);
}
```

* Light sections invert the recipe: use `rgba(255,255,255,0.72)` background, `rgba(2,3,10,0.08)` border, and soften the shadow.
* Add a 1px inner highlight (`box-shadow: inset 0 1px 0 rgba(255,255,255,0.12)`) to sell depth without heavy gradients.

**Ambient glows & accents**

* Use blurred aqua circles (512–640px diameter) with 15% opacity behind key objects to echo the logo ring.
* Limit glows to two per viewport to prevent muddiness.
* Introduce a subtle noise texture (2% opacity PNG) on large dark surfaces to avoid color banding.

**Depth choreography**

* Nav + floating CTAs sit on z-layer 3 with stronger blur; cards and accordions stay on z-layer 2.
* Dealer map overlays slide in on z-layer 4 with `drop-shadow(0 20px 60px rgba(0,0,0,0.35))`.
* When components focus or expand, increase blur by 4px and add a 200ms brightness bump so the interaction feels tactile.

**Theming guidance**

* Tie glass gradients back to core tokens: pair `--fs-primary` with `--fs-primary-dark` for dark surfaces, or `--fs-surface` with `rgba(64,176,208,0.08)` for light sections.
* Always check the effect against bilingual text blocks; Hindi strings often have more vertical strokes, so avoid overly busy backgrounds behind them.

---

### 2.9 Navigation, CTA, and tab states

**Global navigation states**

* Default link text: `--fs-muted-text`, underline hidden.
* Hover: fade text to `--fs-ink` (light backgrounds) or `rgba(255,255,255,0.85)` (dark) and show a 2px aqua underline that animates from center out in 200ms.
* Active page: keep underline visible plus add a faint `rgba(64,176,208,0.18)` pill background to aid keyboard users.
* Focus: draw `0 0 0 3px rgba(64,176,208,0.35)` outline outside the pill, never rely on color alone.
* When nav collapses to a drawer, mirror the same states; focus outlines must remain visible against dark overlays.

**Primary & secondary CTA states**

| State     | Primary button                                             | Secondary button                                           |
| --------- | ---------------------------------------------------------- | ---------------------------------------------------------- |
| Default   | `background: var(--fs-primary); color: white;`             | `border: 1.5px solid var(--fs-primary); color: var(--fs-primary);` |
| Hover     | `background: var(--fs-primary-dark); box-shadow: var(--fs-shadow-strong);` | `background: rgba(64,176,208,0.08); color: var(--fs-primary-dark);` |
| Active    | `transform: translateY(1px); shadow reduced 50%`           | `border-color: var(--fs-primary-dark); transform: translateY(1px)` |
| Disabled  | `background: rgba(64,176,208,0.25); color: rgba(255,255,255,0.6); cursor: not-allowed` | `border-color: rgba(17,24,39,0.15); color: rgba(17,24,39,0.35)` |
| Loading   | Replace label with bilingual “Loading / लोड हो रहा है…” spinner + keep width fixed | Same as primary, spinner uses outline style |

* CTA labels follow the bilingual stack (English on top, Hindi directly below at 90% size) when vertical space allows; on smaller buttons show `EN / हिंदी` separated by `/`.
* WhatsApp CTA inherits the same states but uses gradient backgrounds and bright focus outlines to stay visible atop imagery.

**Tab bars & filter chips**

* Tabs use pill shapes with `border-radius: var(--fs-radius-pill)`, 14px/500 text.
* Default state: transparent background, `--fs-muted-text` text, 1px `--fs-border` outline.
* Hover: add faint aqua fill (`rgba(64,176,208,0.12)`) and icon tint.
* Selected: solid `--fs-primary` fill, white text, optional check icon for filters.
* Focus: same ring as navigation (3px aqua halo). Maintain 16px minimum gap between pills so bilingual labels don’t collide.
* Loading/async filters show an indeterminate top border (2px) that animates left-to-right.

**Keyboard & accessibility**

* Every interactive component described above must support `Enter` and `Space` activation.
* Provide `aria-pressed` on toggle pills (language, autoplay, filters) so assistive tech reports the state.
* Never remove outlines unless replacing them with the specified focus ring token; dark mode drawers require lighter ring variants to meet contrast.

---

## 3. Information Architecture

Top-level navigation (desktop):

1. **Home**
2. **Bicycles**
3. **Dealer Locator**
4. **Blog**
5. **Brand Story**
6. **Support / Contact**

Footer links:

* FAQs, Warranty & Service, Privacy, Terms, Careers (future), Social links (YouTube, Instagram).

---

## 4. Page-level Layout Specs

### 4.1 Global header & footer

**Header**

* Sticky at top.
* On scroll: background changes from transparent/dark gradient to solid `rgba(2,3,10,0.95)` (if hero is dark) or white with subtle shadow.

**Footer**

* Dark background: `--fs-bg-dark`.
* Columns (desktop):

  * Logo + short sustainability message.
  * Product categories.
  * Support links.
  * Contact: email, phone, WhatsApp, address.
* Social icons in `--fs-primary` on circular ghost buttons.

---

### 4.2 Home page

**Goal:** Introduce brand, show bikes at a glance, drive to catalog & dealer locator, tell the sustainability story.

Sections (in order):

1. **Hero**

   * Background: dark gradient (`--fs-bg-dark` → `--fs-primary-dark`).
   * Left column:

     * H1: “Engineered Bicycles for India’s New Commute.”
     * Below: Hindi version same width: “भारत की नई सवारी के लिए इंजीनियर साइकिलें।”
     * Short body copy line in both languages.
     * Primary CTA: “View Bicycles” (`EN/हिंदी` label changes with language).
     * Secondary CTA: “Find a Dealer”.
   * Right column:

     * Large bike image with subtle reflection shadow.
     * Behind it: semi-transparent aqua circle echoing logo ring.

2. **Product highlights**

   * 3–4 featured bikes in a horizontal scroll (mobile) / 3-column grid (desktop).
   * Each card shows name, type, price band, “Best for…” tag.

3. **Engineering & performance section**

   * Split layout: left text, right technical illustration or photos.
   * Icons line-up: “Lightweight Frames”, “Disc Brakes”, “Hybrid Geometry” etc.
   * Each point has English + Hindi label stacked.

4. **Accessibility / pricing**

   * Simple banded layout on white.
   * 3 cards: “Daily Commute”, “Leisure & Fitness”, “Kids & Teens” with typical price ranges.

5. **Sustainability banner**

   * Full-width aqua background.
   * Statistic and copy: e.g., “Every 10 km on a Finspeed can save up to X g CO₂ compared to a car.” (Numbers can change later.)
   * Leaf icon + link to “Why bicycles matter” blog/brand story.

6. **Dealer locator teaser**

   * Map thumbnail or illustration with CTA: “Find a dealer near you” + input for pincode.

7. **Blog teaser**

   * Grid of 3 recent posts: “How to choose your first hybrid bike”, “Cycling in Indian cities” etc.
   * “View all stories” button.

8. **Brand story teaser**

   * Short snippet and a ‘Read our story’ link leading to Brand Story page.

---

### 4.3 Bicycles – Product Catalog

URL: `/bicycles`

**Layout**

* Top bar with page title & description: “Choose your Finspeed ride / अपनी फिनस्पीड सवारी चुनें”.
* Left side (desktop): filters sidebar.
* Right side: grid of product cards.

**Filters**

* Type (City, Hybrid, MTB, Kids, Electric) – checkbox chips.
* Rider height / frame size – radio group or slider.
* Price range – dual handle slider.
* Use sticky filter bar on mobile above the product list; open filters in bottom sheet.

**Grid**

* Desktop: 3 columns, 24px gutter.
* Mobile: 1 per row.

Each card:

* Product photo, name, key specs (e.g., “21-speed, Alloy Frame, Disc Brakes”), price band.
* Small tag chips: “New”, “Eco Choice”, “Best Seller”.
* CTA: “View details”.

Clicking card → Product detail page: `/bicycles/{model-name}`.

---

### 4.4 Product Detail Page

URL: `/bicycles/{slug}`

**Above the fold**

* Left: image gallery (main image + thumbnails).
* Right:

  * Model name (H2).
  * Short tagline.
  * Price band (₹xx,xxx – ₹yy,yyy).
  * Key specs list.
  * Primary CTA: “Find this bike near me” (scrolls / jumps to dealer section).
  * Secondary CTA: “WhatsApp about this model” (pre-filled message with model name).

**Below**

Sections:

1. **Specs & features**

   * Two-column layout on desktop:

     * Left: text spec list grouped (Frame, Drivetrain, Brakes, Wheels, Comfort etc).
     * Right: icons & simple diagrams explaining geometry/technology.

2. **Riding scenarios**

   * Cards: “Best for”: “City commute”, “Weekend rides”, etc.
   * Photos of those scenarios.

3. **Sustainability highlight**

   * How much CO₂ saved per year vs a car for typical usage.

4. **Find a dealer for this bike**

   * Pincode search input inline: user enters pincode → list of dealers carrying this model.
   * Each dealer card: name, distance, address, phone, WhatsApp CTA.

5. **Suggested bikes**

   * Carousel of similar or alternative models.

---

### 4.5 Dealer Locator

URL: `/dealers`

**Goal:** Easy for a user anywhere in India to find the closest physical dealer.

**Layout**

* Top search bar:

  * Input: “Enter pincode or city” (+ Hindi hint beneath).
  * Button: “Search”.

* Main content (desktop):

  * Left: list of dealers (scrollable).
  * Right: interactive map of India.

**Dealer list item**

* Name (bold).
* Address, city, pincode.
* Distance from user location (if user allows geolocation).
* Phone, WhatsApp, “Get directions” (opens maps).
* Badge: “Premium dealer” optional.

**Interactions**

* Search triggers:

  * Pin the area on the map.
  * Populate list with nearest results.
* Clicking on list item centers map on that marker and expands card.
* Clicking marker highlights item in list.

Empty state:

* Icon + message: “No dealers found in this area yet. Chat with us and we’ll help.”
* WhatsApp CTA right there.

---

### 4.6 Blog

**Blog listing (`/blog`)**

* Title + small description.
* Category tabs: “Tips”, “Stories”, “Tech”, “Sustainability”.
* Cards as defined earlier.

**Blog article (`/blog/{slug}`)**

* Wide content with ~720px readable width.
* Hero image, title, author meta.
* Language parity: same slug but language toggles content text.
* Inline callouts to relevant bikes and dealer locator.

---

### 4.7 Brand Story

URL: `/brand-story`

* Hero visual with Finspeed logo and maybe a timeline of brand origins.
* Sections:

  * “Why Finspeed” – mission & tagline.
  * “Engineering in India” – manufacturing, testing.
  * “Sustainability” – how bicycles fit into urban future.
  * “The fin & the wave” – meaning of logo.
* Conclude with CTA: “Explore our bicycles” + “Join the ride” (newsletter / WhatsApp community later).

---

### 4.8 Support / Contact

URL: `/support`

* FAQ accordion: Warranty, Service, Common issues.
* Contact cards:

  * Email support.
  * Phone support.
  * WhatsApp direct.

Simple contact form with Name, Email, City, Message.

---

### 4.9 System pages

* **404:**

  * Illustration of a rider looking at a signboard.
  * Text: “Lost your way?” / “रास्ता भटक गए?”
  * CTA back home or to dealer locator.

* **Loading / skeletons:**

  * Use skeleton cards for product lists and blog lists (rounded rectangles with grey shimmer).

---

## 5. Bilingual Experience (English / Hindi Parity)

Bilingual is not a translation add-on, it’s a first-class feature.

**Key rules**

1. **Global language toggle in header** controls entire UI content language.
2. All critical content (navigation labels, section headings, buttons, dealer info labels, form labels, FAQ titles) must exist in both languages.
3. Data like addresses, names, and numbers remain as-is (English script is fine for them).

**Implementation guidance**

* Text resources stored in a structured locale file (`en`, `hi`).
* URL paths should remain the same; only content changes.
* User preference saved locally so next visit loads same language.
* For accessibility, set `<html lang="en">` or `<html lang="hi">` as appropriate.
* Layout spacing accounts for longer Hindi strings; allow headings to wrap to two rows without reducing size.
* When both languages appear together (e.g., CTA stacks), keep English first but at the same weight as Hindi to avoid hierarchy bias.
* Inline components (filters, pill buttons) should swap to stacked labels on mobile in Hindi mode to reduce truncation.
* Validation and system messages mirror tone between languages—no playful copy in one language unless both share the same energy.
* Provide locale fallbacks: if a field lacks Hindi copy yet, display `—` placeholder plus tooltip indicating “Translation in progress / अनुवाद जारी है”.

---

## 6. UX Flows & Notes

### Flow 1: Discover → Explore Product → Contact via WhatsApp

1. **User lands on Home** (default language English or based on browser/user preference).
2. Sees hero with CTA “View Bicycles”.
3. Clicks “View Bicycles” → goes to `/bicycles`.
4. Uses filters to narrow down by type & budget.
5. Clicks a product card → product detail page.
6. Reads specs, likes product.
7. Clicks “WhatsApp about this model” button.
8. New tab opens WhatsApp chat with pre-filled message:

   * “Hi Finspeed, I’m interested in [Model Name]. I’m in [City]. Please suggest a nearby dealer.”
   * Hindi equivalent when in Hindi mode.
9. User converses with Finspeed support.

**Notes**

* Keep all necessary product info above the fold to reduce drop-off.
* Make sure WhatsApp CTA is visually strong but not overwhelming (primary on product detail, floating FAB globally).

---

### Flow 2: Dealer Locator – user finding nearest shop

1. User opens `Dealer Locator` from main nav or hero CTA.
2. Page asks permission to detect location (optional).
3. If allowed: map recenters on approximate user area, auto-populates nearby dealers.
4. If not allowed: user types pincode/city in search bar.
5. Dealer list and map update.
6. User taps a dealer:

   * Dealer card expands showing phone & WhatsApp.
   * “Get directions” opens Google Maps.
7. Optional: “Filter by bike type” toggle (e.g., show only dealers selling electric bikes).

**Notes**

* Loading state should show skeleton list and map placeholder.
* On mobile, show list first, with “View on map” toggle.

---

### Flow 3: Blog → Product → Dealer

1. User lands directly on a blog post (from search/social).
2. Reads article.
3. Inline “Recommended bikes for city commuting” component with 2–3 bike cards.
4. Clicks one card → product detail page.
5. From product detail, uses “Find this bike near me” or WhatsApp CTA.

**Notes**

* This flow is important for SEO.
* Ensure breadcrumb navigation is present: `Home / Blog / Article title`.

---

## 7. Accessibility & Performance

* Minimum color contrast ratio 4.5:1 for body text.
* Interactive elements 44x44px touch targets.
* Keyboard navigable (tab index logical).
* Use `<alt>` text on all product and content images.
* Lazy-load images (especially blog & product lists) to keep performance high.
* SVG logo for crisp scaling.

---

## 8. Quick Design Token Summary (for dev)

**Colors (CSS custom properties)**

```css
:root {
  --fs-primary: #40B0D0;
  --fs-primary-dark: #104050;
  --fs-ink: #111827;
  --fs-bg-dark: #02030A;
  --fs-surface: #FFFFFF;
  --fs-surface-muted: #F3F4F6;
  --fs-eco: #7DDB6A;
  --fs-warning: #F97316;
  --fs-border: #E5E7EB;
  --fs-muted-text: #6B7280;
}
```

**Radii / spacing**

```css
:root {
  --fs-radius-sm: 8px;
  --fs-radius-md: 12px;
  --fs-radius-lg: 16px;
  --fs-radius-pill: 999px;

  --fs-space-1: 8px;
  --fs-space-2: 16px;
  --fs-space-3: 24px;
  --fs-space-4: 32px;
  --fs-space-5: 48px;
}
```

**Shadows**

```css
:root {
  --fs-shadow-soft: 0 6px 18px rgba(0,0,0,0.12);
  --fs-shadow-strong: 0 12px 30px rgba(0,0,0,0.18);
}
```

**Surfaces / glass tokens**

```css
:root {
  --fs-glass-dark-bg: rgba(2,3,10,0.72);
  --fs-glass-light-bg: rgba(255,255,255,0.72);
  --fs-glass-dark-border: rgba(255,255,255,0.14);
  --fs-glass-light-border: rgba(2,3,10,0.08);
  --fs-glass-highlight: rgba(255,255,255,0.12);
  --fs-glass-blur: 24px;
  --fs-glow-aqua: rgba(64,176,208,0.35);
  --fs-noise-opacity: 0.02;
  --fs-focus-ring-color: rgba(64,176,208,0.35);
  --fs-focus-ring-shadow: 0 0 0 3px rgba(64,176,208,0.35);
  --fs-nav-active: rgba(64,176,208,0.18);
  --fs-tab-hover: rgba(64,176,208,0.12);
}
```

---

This is the core aesthetic and UX blueprint. A designer can translate this into Figma screens, and a developer can map it directly into components and pages with a clear idea of how Finspeed should look and feel: fast, engineered, approachable, and ready in both English and Hindi.

Let’s flip the switch to **Finspeed: Light Mode** – same personality, different lighting.

I’ll focus only on what changes from the previous spec so your dev can implement this as an alternate theme.

---

## 1. Light Theme Concept

Dark theme mood was: **night ride in the city**.
Light theme mood is: **early-morning ride in clear air**.

Principles stay the same:

* Engineering → clean, grid-based, no noise.
* Accessibility → high contrast, clear hierarchy.
* Sustainability → airy whites, aqua accents, subtle greens.

Overall ratio:

* ~80% white / very light grey
* ~15% soft neutrals
* ~5% aqua + green accents

---

## 2. Light Theme Color System

Use a theme switcher approach:

```css
:root[data-theme='light'] { /* values below */ }
:root[data-theme='dark']  { /* previous values */ }
```

### 2.1 Core tokens (light)

```css
:root[data-theme='light'] {
  --fs-bg-page: #F9FAFB;       /* overall page background */
  --fs-hero-bg: #F3FAFD;       /* light hero section */
  --fs-surface: #FFFFFF;       /* cards, nav bar, panels */
  --fs-surface-muted: #F3F4F6; /* alternate section bg */

  --fs-primary: #2FA7CC;       /* slightly softer aqua for light bg */
  --fs-primary-strong: #107091;/* deeper aqua for text/borders */
  --fs-ink: #111827;           /* main text */
  --fs-muted-text: #6B7280;    /* secondary text */

  --fs-eco: #4CC768;           /* more saturated eco green */
  --fs-warning: #F97316;
  --fs-border: #E5E7EB;
  --fs-shadow-soft: 0 6px 18px rgba(15, 23, 42, 0.08);
  --fs-shadow-strong: 0 16px 40px rgba(15, 23, 42, 0.15);
}
```

You can keep the earlier dark values under `data-theme="dark"`.

### 2.2 Gradients (light)

* **Hero gradient (light):**

```css
background: radial-gradient(circle at top left, #E0F7FF 0%, #F9FAFB 55%, #FFFFFF 100%);
```

* **Primary CTA gradient:**

```css
background-image: linear-gradient(135deg, #2FA7CC 0%, #107091 100%);
```

* **Eco/Sustainability banner:**

```css
background-image: linear-gradient(135deg, #E7FBE9 0%, #F9FFFB 100%);
```

---

## 3. Component Adaptations for Light Theme

### 3.1 Header

* Background: solid `--fs-surface` from the start (no transparent header).
* Bottom border: `1px solid rgba(15,23,42,0.06)` instead of drop shadow.
* Logo: use the **dark-text on light** version you provided.
* Navigation links:

  * Default: `color: --fs-muted-text;`
  * Hover/active: `color: --fs-primary-strong; border-bottom: 2px solid --fs-primary;`

On scroll, header stays the same; just add a subtle shadow:

```css
box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
```

### 3.2 Hero Section (Home)

* Background: `--fs-hero-bg` gradient (very light aqua to white).
* Left column text remains dark (`--fs-ink`).
* Right column:

  * Bike image on a pale aqua circle (token: `#D6F2FA`) echoing the logo’s ring.
  * No hard black; keep everything in cool greys and aquas.

Primary CTA:

* Filled pill with gradient CTA background.
* Text always white.
* On hover: slight darkening towards `--fs-primary-strong`, increased shadow.

Secondary CTA:

```css
background-color: transparent;
border: 1.5px solid rgba(47,167,204,0.6);
color: var(--fs-primary-strong);
background-color: rgba(47,167,204,0.04) on hover;
```

### 3.3 Sections & Surfaces

* Alternate sections:

  * Section 1 (Hero) – `--fs-hero-bg`
  * Section 2 (Product highlights) – `--fs-bg-page`
  * Section 3 (Engineering) – `--fs-surface`
  * Section 4 (Accessibility/pricing) – `--fs-surface-muted`
  * Section 5 (Eco banner) – eco gradient
  * etc.

This keeps the long scroll visually segmented without heaviness.

* Dividers between sections: use either 48px of whitespace or a very soft border (`1px solid rgba(15,23,42,0.04)`).

### 3.4 Cards (products, blog, dealers)

Same structure as previous spec; only styling adjusts:

```css
background-color: var(--fs-surface);
border-radius: 16px;
border: 1px solid var(--fs-border);
box-shadow: var(--fs-shadow-soft);
```

**Hover state (desktop):**

* `transform: translateY(-4px);`
* `box-shadow: var(--fs-shadow-strong);`
* `border-color: rgba(47,167,204,0.5);`

Text colors:

* Titles: `--fs-ink`
* Meta info (category, date): `--fs-muted-text`

### 3.5 Dealer Locator (light)

* Page background: `--fs-bg-page`.
* Map panel: soft rounded container with a thin border.

```css
border-radius: 20px;
border: 1px solid rgba(148, 163, 184, 0.3);
overflow: hidden;
background-color: #E5F4FA; /* underlay behind map tiles */
```

* Dealer list: each card as above; highlight active card with left accent bar:

```css
border-left: 3px solid var(--fs-primary);
background-color: rgba(47,167,204,0.04);
```

* Pins on light map:

  * Default pin: white fill, `--fs-primary` outline.
  * Active pin: filled `--fs-primary`, white bicycle icon inside.

### 3.6 Footer (light theme decision)

Two options; I’d recommend **keeping footer dark**, even in light theme, for strong visual anchor:

* Background: `#02030A` (from dark theme).
* Text: `#E5E7EB` / `#9CA3AF`.
* Links: white → aqua on hover.

This also keeps your dark version’s palette alive somewhere.

If you prefer entirely light:

* Use `--fs-bg-page` with a slight top border, and invert colors (links in `--fs-primary-strong`).

---

## 4. Typography in Light Theme

Typography tokens remain identical; just ensure:

* Default body text: `color: var(--fs-ink);`
* Secondary text: `color: var(--fs-muted-text);`
* Links: `color: var(--fs-primary-strong);` with underline on hover.

Headings can optionally get a slight color variation:

```css
h1, h2, h3, h4 {
  color: #020617; /* slightly deeper than body */
}
```

---

## 5. Light Theme Motion & Feedback

Same durations and easing as before; just tweak how feedback looks on light backgrounds:

* **Focus states** (for a11y):

  * Add an outline ring around focused elements:

```css
outline: 2px solid rgba(47,167,204,0.7);
outline-offset: 3px;
```

* **Language toggle:**

  * Track background: `#E5F2F7`.
  * Pill (active): `--fs-primary`.
  * Label colors: inactive `--fs-muted-text`, active white.

* **Scrolling animation:**

  * Section titles fade up from 10px with small opacity animation; keep shadows subtle to avoid “dirty” white.

---

## 6. Light Theme Home Layout Snapshot (for dev)

Rough structure in HTML-ish form so implementation is straightforward:

```html
<body data-theme="light">
  <header class="fs-header fs-header--light">...</header>

  <main>
    <section class="fs-hero fs-hero--light">...</section>

    <section class="fs-section fs-section--bg-page"> <!-- product highlights --> </section>

    <section class="fs-section fs-section--surface"> <!-- engineering/performance --> </section>

    <section class="fs-section fs-section--muted"> <!-- accessibility/pricing --> </section>

    <section class="fs-section fs-section--eco"> <!-- sustainability banner --> </section>

    <!-- etc... -->
  </main>

  <footer class="fs-footer fs-footer--dark">...</footer>
</body>
```

Then in CSS:

```css
.fs-hero--light {
  background: var(--fs-hero-bg);
}

.fs-section--bg-page {
  background-color: var(--fs-bg-page);
}

.fs-section--surface {
  background-color: var(--fs-surface);
}

.fs-section--muted {
  background-color: var(--fs-surface-muted);
}

.fs-section--eco {
  background-image: linear-gradient(135deg, #E7FBE9 0%, #F9FFFB 100%);
}
```

---

## 7. Theme Switching Logic (optional but recommended)

If you want both light and dark:

* Add a theme toggle (icon: sun/moon) in the header, opposite the language toggle.
* Persist choice in `localStorage`.
* On load:

  * If user has OS preference (`prefers-color-scheme`), use that as default.
  * Then override with saved preference if present.

No UX copy changes needed; just swap `data-theme` and rely on the tokens above.

---

This gives you a **1:1 light counterpart** to the earlier dark aesthetic: same engineering-driven structure, now in daylight colors. Developers can treat this as a second token set and wire it up via `data-theme='light'` without rewriting any layout logic.

