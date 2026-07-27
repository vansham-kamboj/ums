# UMS — Design System & Style Guide

**Direction:** Calm, trustworthy, data-dense-but-uncluttered. This is a tool people use every day (teachers marking attendance, guardians checking fees, admins running finance) — the design's job is to get out of the way and make information scannable at a glance, not to impress. One confident brand color, generous whitespace, quiet surfaces, and status color used sparingly so it actually means something when it appears.

---

## 1. Design Principles

1. **Clarity over decoration.** Every color, shadow, and border must carry meaning (status, hierarchy, action) — nothing is there just to look nice.
2. **Calm density.** This system displays a lot of tabular/record data. Favor whitespace and clear grouping over compressing everything to fit — but don't waste space either.
3. **Role-aware hierarchy.** Admin/Staff screens are data-first (tables, filters, bulk actions). Student/Guardian screens are glance-first (cards, summaries, big numbers) — same tokens, different density.
4. **Status color is sacred.** Green/amber/red are reserved only for real status (paid/due/overdue, present/absent, approved/pending) — never used decoratively elsewhere.
5. **Consistent, not maximal.** One display typeface used sparingly, one accent, one radius scale. Restraint is what makes it feel premium, not busy.

---

## 2. Color System

### Brand & Neutrals

| Token | Hex | Usage |
|---|---|---|
| `--color-ink-900` | `#101B33` | Primary text, sidebar background |
| `--color-ink-700` | `#26365C` | Secondary headings, hover states on dark surfaces |
| `--color-brand-600` | `#2F5FE0` | Primary buttons, active nav item, links, focus ring |
| `--color-brand-500` | `#4A74EA` | Hover state on brand elements |
| `--color-brand-100` | `#E8EEFD` | Selected row / subtle brand background |
| `--color-accent-500` | `#F2994A` | Secondary accent — highlights, callouts, "new" badges (used sparingly) |
| `--color-surface` | `#FFFFFF` | Cards, modals, table rows |
| `--color-bg` | `#F5F7FB` | App background |
| `--color-border` | `#E3E7EF` | Dividers, input borders, table lines |
| `--color-text-primary` | `#1A2333` | Body text |
| `--color-text-secondary` | `#67718A` | Captions, helper text, placeholders |
| `--color-text-disabled` | `#A3ABBF` | Disabled labels |

### Status Colors (reserved — do not reuse elsewhere)

| Token | Hex | Meaning |
|---|---|---|
| `--color-success-600` | `#1E9E6B` | Paid, present, approved, active |
| `--color-success-100` | `#E3F7EE` | Success badge background |
| `--color-warning-600` | `#D3902B` | Due soon, pending, half-day, in-review |
| `--color-warning-100` | `#FBF0DD` | Warning badge background |
| `--color-danger-600` | `#D14343` | Overdue, absent, rejected, error |
| `--color-danger-100` | `#FBE7E7` | Danger badge background |
| `--color-info-600` | `#2F6FE0` | Informational notices (reuses brand) |

**Why this palette:** navy-indigo reads institutional and trustworthy without being cold; the single warm orange accent keeps it from feeling like generic "SaaS blue," and stays out of the way of status colors so red/green/amber remain unambiguous.

---

## 3. Typography

| Role | Typeface | Weight(s) | Usage |
|---|---|---|---|
| Display / Page titles | **Lexend** | 600 | Dashboard titles, section headers, empty-state headlines |
| UI / Body | **Inter** | 400, 500, 600 | All body text, labels, table content, buttons |
| Numeric / Data | **Inter (tabular-nums)** | 500, 600 | Fee amounts, stats, attendance %, table numbers — always tabular figures so columns align |

### Type Scale

| Token | Size / Line-height | Weight | Usage |
|---|---|---|---|
| `--text-display` | 28px / 36px | 600 (Lexend) | Page title (e.g. "Student Directory") |
| `--text-h2` | 20px / 28px | 600 (Lexend) | Section headers, card titles |
| `--text-h3` | 16px / 24px | 600 (Inter) | Sub-section headers, modal titles |
| `--text-body` | 14px / 20px | 400 (Inter) | Default body/table text |
| `--text-body-strong` | 14px / 20px | 600 (Inter) | Emphasized cell/label |
| `--text-caption` | 12px / 16px | 400 (Inter) | Helper text, timestamps, table meta |
| `--text-stat` | 32px / 38px | 600 (Inter, tabular) | Dashboard big numbers |

---

## 4. Spacing & Grid

- Base unit: **4px**. All spacing values are multiples of 4 (4, 8, 12, 16, 24, 32, 48, 64).
- App grid: 12-column, 24px gutter, 24px page margin (16px on mobile).
- Card/section internal padding: 24px desktop, 16px mobile.
- Default vertical rhythm between sections: 32px.

## 5. Elevation & Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 6px | Inputs, buttons, badges |
| `--radius-md` | 10px | Cards, modals, dropdowns |
| `--radius-lg` | 16px | Large hero/summary panels |
| `--shadow-sm` | `0 1px 2px rgba(16,27,51,0.06)` | Resting cards, inputs |
| `--shadow-md` | `0 4px 12px rgba(16,27,51,0.08)` | Dropdowns, popovers |
| `--shadow-lg` | `0 12px 32px rgba(16,27,51,0.12)` | Modals, dialogs |

No heavy neumorphism, no glassmorphism blur — flat surfaces with a single soft shadow step on elevation change only.

## 6. Iconography

- Line-style icons, 1.5px stroke, 20px default size (24px in nav/sidebar).
- One consistent icon set across the app (e.g. Lucide/Feather-style) — never mix icon families.
- Icons always paired with a text label in navigation; icon-only is allowed only in dense table row-actions (with tooltip).

---

## 7. Small Components

### Buttons

| Variant | Style | Usage |
|---|---|---|
| Primary | Solid `--color-brand-600`, white text, `--radius-sm` | Main action per screen (Save, Pay Now, Submit) |
| Secondary | White surface, `--color-border` outline, ink text | Secondary actions (Cancel, Export) |
| Tertiary / Ghost | No border/fill, brand-colored text | Low-emphasis actions (View details) |
| Danger | Solid `--color-danger-600`, white text | Destructive actions (Delete, Reject) |
| Sizes | `sm` 32px height / `md` 40px height / `lg` 48px height | Use `md` as default; `lg` only for primary CTAs on public/guest pages |

States: default → hover (8% darken) → active (12% darken) → focus (2px `--color-brand-600` ring, 2px offset) → disabled (40% opacity, no pointer).

### Form Inputs

- Height 40px, `--radius-sm`, 1px `--color-border`, 12px horizontal padding.
- Focus: border becomes `--color-brand-600` + 3px brand-100 outer glow.
- Error state: border `--color-danger-600`, helper text below in danger-600, 12px.
- Labels: 12px, `--color-text-secondary`, positioned above field (never placeholder-only labels).
- Include: text input, select, date picker, toggle switch, checkbox, radio, multi-step form stepper, file upload (drag zone with dashed border).

### Badges / Status Chips
Small pill, 4px/10px padding, 12px medium text, colored background from status tokens (100-level bg + 600-level text). Examples:
- Fee: **Paid** (success) / **Due** (warning) / **Overdue** (danger)
- Attendance: **Present** (success) / **Absent** (danger) / **Half Day** (warning) / **Leave** (info)
- Approval: **Approved** (success) / **Pending** (warning) / **Rejected** (danger)

### Avatars
Circular, 3 sizes (24 / 32 / 40px). Photo if available, else initials on a muted brand-100 background with ink-900 text. Small colored dot overlay for online/attendance-today status where relevant.

### Tooltips
Dark (`--color-ink-900`) background, white text, 12px, `--radius-sm`, 200ms fade, appears after 400ms hover delay.

---

## 8. Mid-Level Components

### Cards
White surface, `--radius-md`, `--shadow-sm`, 24px padding, 1px border in `--color-border` (border + shadow together, not double-heavy). Used for dashboard widgets, profile summary blocks, form sections.

### Tables
- Header row: `--color-bg` background, 12px uppercase-tracked `--color-text-secondary` labels, sticky on scroll.
- Row height 48px, 1px bottom border `--color-border`, no vertical lines (cleaner, less noisy than full grid).
- Hover: row background → `--color-bg`.
- Row-selected: `--color-brand-100` background.
- Row actions: icon buttons revealed on hover, right-aligned.
- Numeric columns right-aligned with tabular figures; text columns left-aligned.
- Empty state: centered icon + one-line message + primary action (e.g. "No students yet — Add Student").

### Tabs
Underline style: 14px medium text, 2px `--color-brand-600` underline on active, `--color-text-secondary` on inactive, 8px gap between tabs, no boxed/pill tabs (keeps top-of-page uncluttered).

### Modals / Dialogs
`--radius-md`, `--shadow-lg`, max-width 480px (form) or 720px (detail), 24px padding, header with title + close icon, footer right-aligned with Secondary + Primary button pair.

### Alerts / Toasts
Left-accent bar (4px, status color) + icon + message, `--radius-sm`, surface background tinted to matching 100-level status color. Toasts slide in from top-right, auto-dismiss 4s (persist for errors until dismissed).

### Pagination
Simple numbered + prev/next, 32px touch targets, current page as filled brand-600 circle.

---

## 9. Navigation & Layout

### App Shell (Admin / Staff / Teacher)
```
┌─────────────┬──────────────────────────────────────────┐
│             │  Topbar: search · notifications · profile │
│  Sidebar    ├──────────────────────────────────────────┤
│  (240px,    │                                            │
│  ink-900    │  Page title + primary action               │
│  bg, icon+  │                                            │
│  label nav, │  Content (cards / tables / forms)          │
│  collapsible│                                            │
│  to 72px)   │                                            │
└─────────────┴──────────────────────────────────────────┘
```
- Sidebar: dark (`--color-ink-900`) for visual anchor against light content area; active item gets brand-600 left-bar + lighter text.
- Topbar: white, `--shadow-sm`, houses global search, notification bell (with unread dot), profile menu.
- Breadcrumbs shown under page title on nested pages (e.g. Students / Batch 10-A / Ramesh Kumar).

### App Shell (Student / Guardian) — lighter, glance-first
Same shell, but content area leads with a **summary card row** (attendance %, fee due, next exam) before any tables — mobile-first single column, cards stack.

### Guest / Public Pages
No sidebar. Simple centered topbar (logo + Login button) + full-width hero for enquiry/registration/job listing, footer with quick links. Slightly warmer tone allowed here (accent-500 can lead a hero CTA) since this is the outward-facing "front door."

---

## 10. Page Templates

| Template | Structure |
|---|---|
| **Dashboard** | Summary stat cards row (4-up desktop, stacked mobile) → chart/list split row → activity/announcements feed |
| **List/Table page** | Page title + primary action (top-right) → filter bar → table → pagination |
| **Detail/Profile page** | Header card (avatar, name, key facts, status badges) → tabbed sections (Overview / Attendance / Fees / Documents) |
| **Multi-step form (Registration/Admission)** | Horizontal stepper at top, one section per step, sticky footer with Back/Next, progress persists on refresh |
| **Auth pages** | Centered card, 400px max-width, logo above, minimal — no marketing content |

---

## 11. Motion

- Standard transition: 150–200ms ease-out for hover/focus states.
- Page/modal enter: 200ms fade + 8px slide-up, respect `prefers-reduced-motion`.
- No decorative animation (no bouncing, no parallax) — this is a daily-use tool, not a landing page.

## 12. Accessibility

- Minimum contrast 4.5:1 for body text, 3:1 for large text/icons.
- All interactive elements keyboard-reachable with visible focus ring (`--color-brand-600`, 2px offset).
- Status never conveyed by color alone — always paired with text/icon (e.g. "Overdue" badge, not just red).
- Touch targets minimum 40×40px on mobile views (Student/Guardian app).

---

## 13. Developer Handoff — CSS Variables

```css
:root {
  /* Brand & neutrals */
  --color-ink-900: #101B33;
  --color-ink-700: #26365C;
  --color-brand-600: #2F5FE0;
  --color-brand-500: #4A74EA;
  --color-brand-100: #E8EEFD;
  --color-accent-500: #F2994A;
  --color-surface: #FFFFFF;
  --color-bg: #F5F7FB;
  --color-border: #E3E7EF;
  --color-text-primary: #1A2333;
  --color-text-secondary: #67718A;
  --color-text-disabled: #A3ABBF;

  /* Status */
  --color-success-600: #1E9E6B;
  --color-success-100: #E3F7EE;
  --color-warning-600: #D3902B;
  --color-warning-100: #FBF0DD;
  --color-danger-600: #D14343;
  --color-danger-100: #FBE7E7;

  /* Radius */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;

  /* Shadow */
  --shadow-sm: 0 1px 2px rgba(16,27,51,0.06);
  --shadow-md: 0 4px 12px rgba(16,27,51,0.08);
  --shadow-lg: 0 12px 32px rgba(16,27,51,0.12);

  /* Type */
  --font-display: 'Lexend', sans-serif;
  --font-body: 'Inter', sans-serif;
}
```

**Fonts:** Lexend (Google Fonts, headings only, weight 600) + Inter (Google Fonts, weights 400/500/600, everything else). Both are free, highly legible at small sizes, and well-suited to dense dashboard UI.
