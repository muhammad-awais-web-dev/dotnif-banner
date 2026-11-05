# DotNif Redesign Banner & Floating Live Orb Card

A centralized, luxury dark-tech concept redesign card and interactive WebGL Live Orb widget for **DotNif Engineering Studio**.

Paste one line into any client website, and control design, messaging, and destination URLs across all concept sites from this single GitHub repository.

---

## 1. Quick Start & Content Modes

The script supports 3 distinct content presentations:

### Mode 1: Redesign Concept (Name, Title, & Original URL)
For redesigns of existing brand websites. You have full control over the client brand name, redesign card title, and original comparison link:
```html
<script 
  src="https://<your-username>.github.io/dotnif-banner/banner.js" 
  data-name="Zero Lifestyle" 
  data-title="Concept Redesign" 
  data-original="https://zerolifestyle.co" 
  async>
</script>
```
- **Name Field** (`data-name`): `Zero Lifestyle`
- **Title Field** (`data-title`): `Concept Redesign` (or `Storefront Re-Architecture`, `Next.js Redesign`, etc.)
- **Original URL** (`data-original`): `https://zerolifestyle.co` (enables the `Original Site ↗` comparison button)

---

### Mode 2: New Concept Experience
For brand-new concepts, flagship prototypes, or greenfield builds where there is no existing original site to link to:
```html
<script 
  src="https://<your-username>.github.io/dotnif-banner/banner.js" 
  data-concept="Avelo Carbon" 
  data-title="New Concept" 
  async>
</script>
```
- **Eyebrow**: `NEW CONCEPT`
- **Headline**: `Avelo Carbon`
- **Actions**: `Book a Call` & `DotNif Studio ↗`

---

### Mode 3: Plain Simple Text Version (Zero Parameters)
For pure studio showcases, general portfolio outreach, or minimal presentation:
```html
<script src="https://<your-username>.github.io/dotnif-banner/banner.js" async></script>
```
- **Eyebrow**: `STUDIO SHOWCASE`
- **Headline**: `Websites engineered for growth.`
- **Actions**: `Book a Call` & `Our Portfolio ↗`

---

### Alternatively via jsDelivr CDN
```html
<script 
  src="https://cdn.jsdelivr.net/gh/<your-username>/dotnif-banner@main/banner.js" 
  data-name="Zero Lifestyle" 
  data-original="https://zerolifestyle.co" 
  async>
</script>
```

---

## 2. Animated Open / Close Lifecycle & Close Timer Process

- **First Default Open on Page Load**: 450ms after the host page loads, the widget executes an animated entry:
  - The ambient radial backdrop fades in.
  - The luxury glass card springs into the viewport center (`scale: 0.92 -> 1, translateY: 12px -> 0`).
  - The Live Orb glides from the bottom-right corner (`60px`) to crown the card (`72px`) with Apple-like spring cubic-bezier elasticity.
- **Visual Close Timer Process (Progress Track)**:
  - An ultra-refined, glowing cyan-to-blue hairline progress bar (`3px`) runs along the bottom curved chassis of the card.
  - Automatically drains linearly over **7 seconds** (configurable via `data-auto-close="7000"`, or disabled with `data-auto-open="false"`).
  - **Interactive Pause on Hover**: When the visitor moves their mouse over the card, the timer freezes instantly in place with tactile brightness feedback (`timer-paused`).
  - **Resume on Unhover**: If the mouse leaves the card, the countdown resumes seamlessly from the exact remaining millisecond.
  - **Permanent Dismiss on Click**: Clicking anywhere inside the card (or interacting with links/buttons) permanently cancels the auto-close process and fades out the timer bar.
- **Animated Closing**: If untouched when the timer drains to 0, the card smoothly scales down and fades out, while the Live Orb glides gracefully back down to its parked position at `bottom: 24px, right: 24px`, where its emerald radar beacon activates.
- **Manual Re-Open Stays Open**: Clicking the parked orb at any time re-opens the card permanently without any timer or countdown bar.

---

## 3. The Modified Live Orb WebGL Widget

Integrated directly into the Web Component with zero external dependencies:

- **Natural Gaze Tracking**: Mathematical raymarching / spherical distortion shader on HTML `<canvas>` with real-time lerp easing that accurately tracks the cursor and touch coordinates across the host page without inverted axis jitter.
- **Spontaneous Blinks**: Organic blinks trigger every 3–6 seconds automatically, with tactile blink reactions when clicked or opened.
- **Park & Perch Glide Physics**: 
  - **Parked (Closed)**: Floats at the bottom-right corner (`60px`), keeping watch with an active emerald radar beacon (`Taking new projects`).
  - **Perched (Open)**: On click, smoothly glides with spring cubic-bezier easing to crown the top of the glassmorphic modal card (`72px`) with 32px of dedicated breathing space above the content.
- **Interactive Chromatic States**: Clicking the orb when open cycles through DotNif studio color states (*Electric Cyan*, *Tech Indigo*, *Emerald Mint*, *Cyber Violet*, *Platinum White*).

---

## 3. How Centralized Management Works

If DotNif's domain or contact link ever changes in the future, update `MASTER_CONFIG` at the top of `banner.js`:

```javascript
const MASTER_CONFIG = {
  studioDomain: "https://dotnif.com",    // <-- Update here
  contactUrl: "https://dotnif.com/#contact",
  workUrl: "https://dotnif.com/#case-studies",
  ...
};
```

Commit and push to GitHub. Every single redesign website across the web automatically updates instantly.

---

## 4. Architectural Guarantees

- **100% Shadow DOM Shield**: Immune to all host CSS (Tailwind, Bootstrap, resets).
- **Zero Emojis**: Strictly clean SVG icons.
- **Mobile Responsive & Safe Insets**: Fluid layout with touch tracking.
- **Live Interactive Sandbox**: Open `index.html` to customize Name, Title, and URLs in real time.
