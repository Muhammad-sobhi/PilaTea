# PILATEA — Rebuild & Extend Guide

A pixel-spec, component-based landing page built with **Next.js (App Router) + TypeScript + Tailwind CSS v4 + Framer Motion + Lucide Icons**.

This file is everything you need to **recreate the design from scratch** and to **add more content/sections**.

---

## 1. Prerequisites
- Node.js ≥ 18 (tested on Node 24)
- npm
- Network access (fonts + npm install at build time)

## 2. Scaffold from zero
```bash
npx create-next-app@latest pilatea --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack --use-npm
cd pilatea
npm install framer-motion lucide-react
```

> Note: `create-next-app@latest` currently installs **Next 16**. The code here uses only stable App-Router APIs, so it also works on Next 15. To pin: `npm install next@15 react@18 react-dom@18` (then adjust `eslint-config-next` if needed).

## 3. Project structure
```
pilatea/
  public/
    logo.png                 ← brand logo (replaces the old cup character)
  src/
    app/
      layout.tsx             ← fonts (Cormorant / Poppins / Allura) + SEO metadata
      globals.css            ← Tailwind v4 @theme tokens + keyframes + glass classes
      page.tsx               ← composes all sections
    components/
      AuroraBackground.tsx   ← animated aurora + holographic background
      Navbar.tsx             ← 82px glass nav, centered menu, hover underline
      Hero.tsx               ← 45/55 split: heading + script + 3 buttons | visual
      CupVisual.tsx          ← logo + big glass sphere + 6 floating glass bubbles
      Features.tsx           ← "About" 4 glass cards
      EventsTea.tsx          ← Events (left) + Tea Menu (right) glass cards
      SecondHero.tsx         ← wide banner: image + content + location pills
      Instagram.tsx          ← 5 rounded-square images, hover scale
      Footer.tsx             ← 4-col glass footer + newsletter
      Button.tsx             ← gradient pill button (reusable)
      Reveal.tsx             ← Framer Motion fade-up + stagger wrapper
    lib/
      data.ts                ← ★ ALL EDITABLE CONTENT LIVES HERE
  next.config.ts             ← image remote domains
```

## 4. How the design maps to code (spec reference)
| Spec | Where |
|------|-------|
| Container 1320px, outer 48px, section 72px, gap 24px, radius 24px | `page.tsx` / each section uses `max-w-[1320px]`, `px-12`, `py-[72px]`, `gap-6`, `rounded-[24px]` |
| Background `#F8F4F8` + aurora (8–15%) + holo, 45s | `globals.css` `--color-bg` + `AuroraBackground.tsx` |
| Navbar 82px, `rgba(255,255,255,.55)`, blur 30px, radius 28px, underline 300ms | `Navbar.tsx` |
| Fonts: Cormorant (headings) / Poppins (body) / Allura (script) | `layout.tsx` + `globals.css` `--font-*` |
| Colors: primary `#E8A6F4`, secondary `#CDB7FF`, accent `#BFEAFF`, dark `#2B2535` | `globals.css` `@theme` |
| Title 80px / ls 2px, script 58px, body 18px, small 15px | `Hero.tsx` inline styles |
| Button 52px, radius 999px, gradient `#E8A6F4→#B7B8FF`, hover `-2px scale1.03 brightness+7%` | `Button.tsx` |
| Hero 45/55, 780px, 3 buttons | `Hero.tsx` |
| Cup→logo, big bubble 620px (reflections, 18s), 6 glass bubbles 96px (±18/±22/±4°, 7–12s) | `CupVisual.tsx` |
| Glass cards 65%→45% opacity, blur 18–22px, radius 26px, shadow, padding 30px | `globals.css` `.glass-panel` + components |
| Events 3 rows / Tea 3 rows w/ tags | `EventsTea.tsx` + `data.ts` |
| Second hero banner, Instagram 5 (gap 18px, hover 1.05), Footer 4 cols | respective components |
| Scroll fade-up 30px / 0.8s / stagger 0.12 | `Reveal.tsx` |

## 5. ★ Adding / editing content (no code logic needed)
Everything textual and list-like is in **`src/lib/data.ts`**. Edit the arrays:

```ts
// Navigation
export const navLinks = [{ label: "Home", href: "#home" }, /* add more */];

// 6 floating bubbles (icon + title + position + timing)
export const floatBubbles: FloatBubble[] = [
  { icon: Leaf, title: "Outdoor Wellness", top: "4%", left: "44%", delay: 0, duration: 9 },
  // add a 7th/8th bubble the same way — just keep positions inside the 620px stage
];

// Events — add a 4th row by appending an object
export const events: EventItem[] = [
  { title, location, time, seats, day, month, image },
];

// Tea menu — add a 4th tea
export const teas: TeaItem[] = [
  { title, description, tags: ["Relax","Sleep"], image },
];

// Instagram — swap / add image URLs
export const instagramImages = [ "https://picsum.photos/seed/x/400/400", /* ... */ ];
```

To change the **logo**, replace `public/logo.png`.
To change **photos**, replace the `picsum.photos` URLs in `data.ts` / `SecondHero.tsx` (or allow your own domain in `next.config.ts` `images.remotePatterns`).

## 6. Adding a brand-new section
1. Create `src/components/MySection.tsx` (copy `Features.tsx` as a template — it already uses the `Reveal`/`RevealItem` + `.glass-panel` patterns).
2. Add your content (use `.glass-panel glass-shine` for glass cards, `Button` for CTAs, `motion.*` for any animation).
3. Import and drop it into `src/app/page.tsx`:
   ```tsx
   import { MySection } from "@/components/MySection";
   // inside <main>: <MySection />
   ```
4. Add a nav link in `data.ts` `navLinks` pointing to its `id`.

## 7. Changing theme tokens
Edit `src/app/globals.css` `@theme { ... }`:
```css
--color-primary: #e8a6f4;
--color-secondary: #cdb7ff;
--color-accent: #bfeaff;
--color-dark: #2b2535;
--color-bg: #f8f4f8;
```
All `bg-primary`, `text-dark`, `border-secondary`, etc. update automatically.

## 8. Run
```bash
npm run dev      # http://localhost:3000
npm run build    # production build (also type-checks)
npm run lint     # eslint
```

## 9. Notes / deviations
- Brand social icons (`Twitter`/`Instagram`/`Youtube`) were **removed in lucide v1**; footer uses `Camera / X / Globe / Mail`. Swap freely from `lucide-react`.
- Photos use `picsum.photos` placeholders (themed seeds) — replace with real assets.
- `prefers-reduced-motion` is honored globally (animations collapse).
- Fully responsive (desktop → tablet → mobile breakpoints built in).
