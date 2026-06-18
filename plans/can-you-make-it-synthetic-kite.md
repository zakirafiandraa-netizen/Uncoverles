# Plan: Desktop-Polished UI + Smooth UX for Uncoverles

## Context

The app currently renders all 14 screens inside a `max-w-sm` mobile shell. On a desktop viewport this leaves a narrow phone-sized strip centered on a grey background — it looks unfinished. The user wants the desktop experience to feel slick and intentional, with smooth transitions between screens. The `motion` package (v12, Framer Motion API) is already installed but unused.

---

## Approach

### 1. Responsive Layout Shell

Replace the fixed `max-w-sm` mobile wrapper with a two-zone desktop layout:

```
┌──────────────────────────────────────────────────────┐
│  Left Sidebar (desktop only)  │  Main Content Panel  │
│  w-64 — app brand, current    │  flex-1, scrollable  │
│  screen label, step progress  │                      │
└──────────────────────────────────────────────────────┘
```

- On **mobile** (`< lg`): sidebar hidden, current layout preserved
- On **desktop** (`lg+`): sidebar visible, content panel fills remaining width
- Sidebar content: logo + app name, current screen title, step indicator (for setup flows), decorative medical illustration / teal gradient panel
- Max content width: `max-w-4xl` centered inside the content zone

### 2. Animated Page Transitions (motion library)

Wrap every screen render with `<AnimatePresence mode="wait">` and apply `motion.div` to each screen with:
- `initial={{ opacity: 0, y: 16 }}`
- `animate={{ opacity: 1, y: 0 }}`
- `exit={{ opacity: 0, y: -12 }}`
- `transition={{ duration: 0.2, ease: "easeOut" }}`

Use a `key={screen}` on the motion wrapper so transitions fire on every screen change.

### 3. Desktop-Specific Grid Expansions

| Screen | Mobile | Desktop (lg+) |
|---|---|---|
| Home cards | 1 column stack | `lg:grid-cols-3` side by side |
| Category tiles | 3 cols | `lg:grid-cols-4` |
| Player grid (lobby) | 2 cols | `lg:grid-cols-4` |
| Final Submissions | 1 column | `lg:grid-cols-3` side by side |
| Summary roles | 3 cols | unchanged (already works) |
| Game Over | stacked | `lg:grid-cols-[1fr_1.2fr]` (splash left, leaderboard right) |
| Discussion / Voting | stacked | `lg:grid-cols-[1fr_380px]` (content + persistent chat sidebar) |

### 4. Polished Component Micro-interactions

- **Cards**: add `hover:-translate-y-1 hover:shadow-xl transition-all duration-200` to all clickable cards
- **Buttons**: upgrade to `hover:scale-[1.02] active:scale-[0.97]`
- **Avatar chips**: subtle `hover:ring-2 ring-primary/30` on player pills
- **Vote button**: animate count badge with `motion` number tween
- **StepBar**: animate the progress fill with `motion` width transition
- **Role cards** (choose-role screen): stagger-in on mount with `motion` `staggerChildren: 0.08`
- **Leaderboard rows**: stagger-in with 50ms delay per row
- **ChatSection**: new messages slide in from bottom

### 5. Visual Polish Upgrades

- Increase `--radius` to `1rem` in theme.css for a more modern feel
- Add a subtle teal mesh / dot-grid CSS background to the left sidebar
- NavBar on desktop becomes invisible (sidebar handles navigation context); on mobile stays as-is
- Screens that are currently full-height (`min-h-screen`) get `lg:min-h-0 lg:py-8` so they feel like panels, not forced full-page

### 6. Persistent Chat Sidebar (Discussion + Voting screens)

On `lg+`, the Discussion and Voting screens render in two columns:
- **Left** (`flex-1`): phase banner, input / player list
- **Right** (`w-96 border-l`): chat panel, always visible, no scroll-to-find

---

## Files to Modify

| File | What changes |
|---|---|
| `src/app/App.tsx` | Sidebar layout shell, `AnimatePresence` wrapper, all screen components for responsive grids and micro-interactions |
| `src/styles/theme.css` | `--radius: 1rem`, optional sidebar gradient token |
| `src/styles/fonts.css` | Already correct, no changes needed |

**No new files needed** — all changes are in-place edits to App.tsx and theme.css.

---

## Implementation Notes

- Import `motion` and `AnimatePresence` from `"motion/react"` (already installed)
- Use Tailwind `lg:` prefix for all desktop-only layout overrides — no media query JS needed
- The existing `NavBar`, `Avatar`, `StepBar`, `ChatSection` shared components are reused and extended, not replaced
- `canvas-confetti` (already installed) — optionally fire on Game Over screen for delight

---

## Verification

1. Open the preview at the default Figma Make URL
2. At desktop width: confirm sidebar is visible, home shows 3-column card grid, category grid is 4 cols
3. Navigate through all 14 screens: confirm smooth fade+slide transitions fire on every change
4. On Discussion and Voting screens: confirm chat panel is side-by-side on desktop
5. Resize to mobile width: confirm sidebar hides, layout collapses correctly, no layout breakage
6. Check hover states on cards, buttons, and player avatars across all screens
