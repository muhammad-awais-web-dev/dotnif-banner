# DotNif Redesign Banner & Floating Live Orb Card

A centralized, luxury dark-tech concept redesign card and interactive WebGL Live Orb widget for **DotNif Engineering Studio**.

Paste one line into any client website, and control design, messaging, and destination URLs across all concept sites from this single GitHub repository.

---

## 1. Quick Start & Three Content Modes

The script accepts **only one optional parameter** depending on which content mode you need:

### Mode 1: Redesign Concept (URL or Client Name)
For redesigns of existing brand websites. Displays the client name, concept badge, and includes the before/after original website comparison link:
```html
<script src="https://<your-username>.github.io/dotnif-banner/banner.js" data-original="https://zerolifestyle.co" async></script>
```
- **Eyebrow**: `CONCEPT REDESIGN`
- **Headline**: `Zero Lifestyle`
- **Actions**: `Original Site ↗` & `DotNif Studio ↗`

---

### Mode 2: New Concept Experience
For brand-new concepts, flagship prototypes, or greenfield builds where there is no existing original site to link to:
```html
<script src="https://<your-username>.github.io/dotnif-banner/banner.js" data-concept="Avelo Carbon" async></script>
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
<script src="https://cdn.jsdelivr.net/gh/<your-username>/dotnif-banner@main/banner.js" data-original="https://zerolifestyle.co" async></script>
```

---

## 2. The Modified Live Orb WebGL Widget

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
- **Live Interactive Sandbox**: Open `index.html` to test all 3 content modes in real time.
