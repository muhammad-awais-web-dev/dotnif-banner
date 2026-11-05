# DotNif Redesign Banner

A centralized, luxury dark-tech concept redesign banner and embed widget for **DotNif Engineering Studio**.

Paste one line into any client website redesign, and manage styling, messaging, and destination URLs across all concept sites from this single GitHub repository.

---

## 1. Quick Start

Add this single `<script>` tag before the closing `</body>` tag on any redesigned website:

```html
<script 
  src="https://<your-username>.github.io/dotnif-banner/banner.js" 
  data-client="Zero Lifestyle"
  data-original-url="https://zerolifestyle.co"
  data-case-study="https://dotnif.com/projects/zero-lifestyle"
  async>
</script>
```

### Alternatively via jsDelivr CDN
```html
<script 
  src="https://cdn.jsdelivr.net/gh/<your-username>/dotnif-banner@main/banner.js" 
  data-client="Zero Lifestyle"
  async>
</script>
```

---

## 2. Supported Parameters

All parameters are optional and configured via `data-*` attributes on the script tag:

| Attribute | Default | Description |
| :--- | :--- | :--- |
| `data-client` | Auto-detected | The brand name of the client (e.g. `Zero Lifestyle`). |
| `data-original-url` | `""` | Link to the original client site for before/after comparison. |
| `data-case-study` | `""` | Link to the deep-dive case study on DotNif. |
| `data-position` | `bottom-right` | Position on screen: `bottom-right`, `bottom-left`, `bottom-center`, `top-right`, `top-left`. |
| `data-collapsed` | `false` | When `true`, starts in compact pill mode instead of expanded card. |
| `data-show-metrics`| `true` | Show the `99+ Core Web Vitals · Sub-second TTFB` pill. |
| `data-accent` | `#33D2FF` | Hex color for badge, glowing dot, and button highlights. |
| `data-cta-text` | `Scope Your Sprint` | Text for the primary action button. |
| `data-contact-url` | `https://dotnif.com/#contact` | Override target for primary CTA button. |

---

## 3. How to Change Your Studio Domain Later

If DotNif's primary domain ever changes (e.g. to `dotnif.studio` or `dotnif.io`), edit the top of `banner.js`:

```javascript
const MASTER_CONFIG = {
  studioDomain: "https://dotnif.com",    // <-- Update this single line
  contactUrl: "https://dotnif.com/#contact",
  ...
};
```

Commit and push to GitHub. Every single redesigned website will instantly route to your new domain with zero redeployments.

---

## 4. Key Architectural Features

- **Shadow DOM Style Isolation**: Fully encapsulated. Host site CSS (Tailwind, Bootstrap, WordPress) will never break the banner, and the banner's styles will never leak into the host page.
- **Zero Emojis**: Strictly clean SVG icons (Lucide-style).
- **Session Dismiss Memory**: When dismissed, the banner remembers closed state in `sessionStorage` so it doesn't annoy repeat visitors.
- **Responsive**: Safe-area insets on mobile (`env(safe-area-inset-bottom)`) and smooth collapse/expand transitions.

---

## 5. Live Interactive Playground

Open `index.html` or visit the GitHub Pages deployment to customize parameters in real time and copy generated snippets.
