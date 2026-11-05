# DotNif Redesign Banner & Floating Live Orb Card

A centralized, luxury dark-tech concept redesign card and interactive WebGL Live Orb widget for **DotNif Engineering Studio**.

Paste one line into any client website redesign, and control design, messaging, and destination URLs across all concept sites from this single GitHub repository.

---

## 1. Quick Start

Add this single `<script>` tag before the closing `</body>` tag on any redesigned website:

### Option A: For a Specific Client Redesign (Only 1 Optional Parameter)
```html
<script src="https://<your-username>.github.io/dotnif-banner/banner.js" data-original="https://zerolifestyle.co" async></script>
```

### Option B: Pure Studio Showcase Mode (Zero Parameters)
```html
<script src="https://<your-username>.github.io/dotnif-banner/banner.js" async></script>
```

### Alternatively via jsDelivr CDN
```html
<script src="https://cdn.jsdelivr.net/gh/<your-username>/dotnif-banner@main/banner.js" data-original="https://zerolifestyle.co" async></script>
```

---

## 2. The Single Optional Parameter: `data-original`

To keep client integration as simple and frictionless as possible, the script accepts **only one optional parameter**:

| Attribute | Type | Example | Behavior |
| :--- | :--- | :--- | :--- |
| `data-original` | URL or String | `https://zerolifestyle.co` | Automatically formats the client name (`Zero Lifestyle`), personalizes the card heading (`Concept Redesign for Zero Lifestyle`), and provides a direct `View Original Site` button. |
| *(omitted)* | None | *(none)* | Displays the standard DotNif studio presentation card (`Websites engineered for growth`) with `Book a call` and `See our work` buttons. |

> **Note:** If you prefer passing just the brand name (e.g. `data-original="Zero Lifestyle"`), the card adapts gracefully without needing a URL.

---

## 3. The Modified Live Orb WebGL Widget

Integrated directly into the Web Component with zero external libraries:

- **Interactive Eye Tracking**: Mathematical raymarching / spherical distortion shader on HTML `<canvas>` with real-time lerp easing that tracks the cursor and touch coordinates across the host page.
- **Spontaneous Blinks**: Organic blinks trigger every 3–6 seconds automatically, with tactile blink reactions when clicked or opened.
- **Park & Perch Glide Physics**: 
  - **Parked (Closed)**: Floats at the bottom-right corner (`60px`), keeping watch with an active emerald radar beacon (`Taking new projects`).
  - **Perched (Open)**: On click, smoothly glides with spring cubic-bezier easing to crown the top of the glassmorphic modal card (`72px`).
- **Interactive Chromatic States**: Clicking the orb when open cycles through DotNif studio color states (*Electric Cyan*, *Tech Indigo*, *Emerald Mint*, *Cyber Violet*, *Platinum White*).

---

## 4. How Centralized Management Works

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

## 5. Architectural Guarantees

- **100% Shadow DOM Shield**: Immune to all host CSS (Tailwind, Bootstrap, resets).
- **Zero Emojis**: Strictly clean SVG icons.
- **Mobile Responsive & Safe Insets**: Fluid layout with touch tracking.
- **Live Interactive Sandbox**: Open `index.html` to test live presets in real time.
