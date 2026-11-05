/**
 * DotNif Studio — Centralized Concept Redesign Banner & Floating Live Orb Card
 *
 * A self-contained, zero-dependency Web Component that injects a luxury dark tech
 * redesign card & interactive WebGL eye-tracking Live Orb into any client website.
 *
 * Encapsulated via Shadow DOM: 100% immune to host styles.
 *
 * Content Modes:
 *   1. Redesign Concept (Name, Title, and Original URL):
 *      <script src="https://dotnif-banner.vercel.app/banner.js"
 *              data-name="Zero Lifestyle"
 *              data-title="Concept Redesign"
 *              data-original="https://zerolifestyle.co"></script>
 *
 *   2. New Concept Experience:
 *      <script src="https://dotnif-banner.vercel.app/banner.js" data-concept="Avelo Carbon"></script>
 *
 *   3. Plain Simple Text Showcase (Zero parameters):
 *      <script src="https://dotnif-banner.vercel.app/banner.js"></script>
 *
 * @license MIT
 * @see https://github.com/dotnif/dotnif-banner
 */
(function () {
  "use strict";

  // Prevent duplicate registration
  if (window.customElements && window.customElements.get("dotnif-redesign-banner")) {
    return;
  }

  /* ── 1. MASTER CENTRAL CONFIGURATION (Single Point of Truth) ── */
  const MASTER_CONFIG = {
    studioDomain: "https://dotnif.com",
    contactUrl: "https://dotnif.com/#contact",
    workUrl: "https://dotnif.com/#case-studies",
    brandName: "DOTNIF",
    defaultAccent: "#33D2FF",
    defaultBg: "#070B1D",
  };

  /* ── 2. SVG ASSETS (Strictly Clean SVGs, Zero Emojis) ── */
  const SVGS = {
    logo: `<svg width="18" height="15" viewBox="0 0 845 716" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="matrix(1,0,0,1,-3501.80194,-923.127261)">
        <g transform="matrix(1,0,0,1,3501.80194,920.407261)">
          <path d="M844.3,611.27L844.3,637.45C844.3,682.03 808.16,718.17 763.58,718.17L605.38,718.17C572.25,718.17 540.79,703.59 519.37,678.31L286.82,403.79C252.93,366.94 211.17,338.21 164.64,319.72L66.43,280.7C44.37,270.15 30.32,247.86 30.32,223.4L30.32,58.42C30.32,27.66 55.26,2.72 86.02,2.72L261.45,2.72C280.39,2.72 298.56,10.24 311.96,23.64L805.2,516.88C830.23,541.92 844.3,575.87 844.3,611.27Z" fill="#33D2FF"/>
        </g>
        <g transform="matrix(1,0,0,1,3501.80194,920.407261)">
          <path d="M844.3,106.23L844.3,611.27C844.3,575.87 830.23,541.92 805.2,516.88L602.4,314.08L602.4,33.79C602.4,16.63 616.32,2.72 633.48,2.72L740.78,2.72C797.95,2.72 844.3,49.06 844.3,106.23Z" fill="#4C6FFF"/>
        </g>
        <g transform="matrix(1,0,0,1,3501.80194,920.407261)">
          <circle cx="147.73" cy="537.1" r="147.73" fill="#4C6FFF"/>
        </g>
      </g>
    </svg>`,
    externalLink: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
      <polyline points="15 3 21 3 21 9"></polyline>
      <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>`,
    arrowRight: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>`,
    close: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>`,
  };

  /* ── 3. LIVE ORB WEBGL COLOR PRESETS ── */
  const ORB_PRESETS = [
    { name: "Electric Cyan", body: [0.2, 0.82, 1.0], eye: [0.98, 0.98, 0.98] },
    { name: "Tech Indigo", body: [0.26, 0.39, 1.0], eye: [0.98, 0.98, 0.98] },
    { name: "Emerald Mint", body: [0.06, 0.72, 0.5], eye: [0.98, 0.98, 0.98] },
    { name: "Cyber Violet", body: [0.55, 0.36, 0.96], eye: [0.98, 0.98, 0.98] },
    { name: "Platinum White", body: [0.97, 0.98, 0.98], eye: [0.05, 0.05, 0.08] },
  ];

  /* ── 4. WEBGL SHADERS ── */
  const VERT_SHADER = `
    attribute vec2 a_position;
    void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
  `;

  const FRAG_SHADER = `
    precision highp float;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_look;
    uniform float u_blink;
    uniform vec3 u_body;
    uniform vec3 u_eye;

    vec3 orient(vec3 p, vec2 look) {
      float yaw = look.x * 0.92, pitch = -look.y * 0.78;
      float cy = cos(yaw), sy = sin(yaw), cp = cos(pitch), sp = sin(pitch);
      vec3 q = vec3(p.x, p.y * cp - p.z * sp, p.y * sp + p.z * cp);
      return vec3(q.x * cy + q.z * sy, q.y, -q.x * sy + q.z * cy);
    }

    float eyeMask(vec3 n, vec3 e, vec3 right, vec3 up, float halfH, float rad) {
      float facing = dot(n, e);
      float x = dot(n, right) - dot(e, right);
      float y = dot(n, up) - dot(e, up);
      y -= clamp(y, -halfH, halfH);
      float d = length(vec2(x, y)) - rad;
      float fill = 1.0 - smoothstep(-0.015, 0.015, d);
      return fill * smoothstep(0.12, 0.32, facing);
    }

    void main() {
      vec2 uv = (gl_FragCoord.xy / u_resolution) * 2.0 - 1.0;
      float aspect = u_resolution.x / max(u_resolution.y, 1.0);
      uv.x *= aspect;
      float radius = 0.94;
      vec2 p = uv / radius;
      float r2 = dot(p, p);
      float edge = 1.0 - smoothstep(0.985, 1.012, sqrt(max(r2, 0.0)));
      if (edge <= 0.001) { gl_FragColor = vec4(0.0); return; }

      float z = sqrt(max(1.0 - r2, 0.0));
      vec3 n = normalize(vec3(p, z));
      vec2 look = u_look;
      float lm = length(look);
      if (lm > 1.0) look /= lm;

      vec3 right = orient(vec3(1.0, 0.0, 0.0), look);
      vec3 up = orient(vec3(0.0, 1.0, 0.0), look);
      vec3 eL = orient(normalize(vec3(-0.32, 0.08, 1.0)), look);
      vec3 eR = orient(normalize(vec3(0.32, 0.08, 1.0)), look);

      float halfH = mix(0.128, 0.012, u_blink);
      float rad = mix(0.054, 0.062, u_blink);
      float eyes = max(eyeMask(n, eL, right, up, halfH, rad), eyeMask(n, eR, right, up, halfH, rad));

      // Specular 3D rim lighting
      vec3 light = normalize(vec3(0.4, 0.6, 1.0));
      float spec = pow(max(dot(n, light), 0.0), 18.0) * 0.22;
      vec3 body = u_body + vec3(spec);

      vec3 col = mix(body, u_eye, clamp(eyes, 0.0, 1.0));
      gl_FragColor = vec4(col * edge, edge);
    }
  `;

  /* ── 5. INTELLIGENT BRAND NAME FORMATTER ── */
  function formatBrandName(str) {
    if (!str) return "Client Project";

    // If explicit spaces, hyphens or underscores exist
    if (/[\s\-_]/.test(str)) {
      return str
        .split(/[\s\-_]+/)
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
    }

    const lower = str.toLowerCase();
    const known = {
      zerolifestyle: "Zero Lifestyle",
      dadducharger: "Daddu Charger",
      janfranko: "Jan Franko",
      avelocarbon: "Avelo Carbon",
    };
    if (known[lower]) return known[lower];

    // Split compound words via common suffixes
    const m = lower.match(
      /^([a-z0-9]+?)(lifestyle|charger|studio|design|agency|tech|store|shop|lab|hub|group|wear|app|pay|carbon|motor)$/
    );
    if (m) {
      const p1 = m[1].charAt(0).toUpperCase() + m[1].slice(1);
      const p2 = m[2].charAt(0).toUpperCase() + m[2].slice(1);
      return `${p1} ${p2}`;
    }

    // Default title case
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /* ── 6. THREE CONTENT VERSIONS RESOLUTION ── */
  function parseConfig(el) {
    const scriptEl =
      document.currentScript ||
      document.querySelector("script[data-original], script[data-concept], script[data-mode], script[data-type], script[data-name], script[data-title], script[src*='banner.js']");

    const rawOriginal = (
      el?.dataset?.original ||
      el?.getAttribute?.("data-original") ||
      scriptEl?.dataset?.original ||
      ""
    ).trim();

    const rawConcept = (
      el?.dataset?.concept ||
      el?.getAttribute?.("data-concept") ||
      scriptEl?.dataset?.concept ||
      ""
    ).trim();

    const rawTitle = (
      el?.dataset?.title ||
      el?.getAttribute?.("data-title") ||
      scriptEl?.dataset?.title ||
      ""
    ).trim();

    const rawName = (
      el?.dataset?.name ||
      el?.getAttribute?.("data-name") ||
      el?.dataset?.client ||
      el?.getAttribute?.("data-client") ||
      scriptEl?.dataset?.name ||
      scriptEl?.dataset?.client ||
      ""
    ).trim();

    const explicitMode = (
      el?.dataset?.mode ||
      el?.getAttribute?.("data-mode") ||
      el?.dataset?.type ||
      el?.getAttribute?.("data-type") ||
      scriptEl?.dataset?.mode ||
      scriptEl?.dataset?.type ||
      ""
    ).toLowerCase().trim();

    // Mode 1: New Concept
    if (explicitMode === "new" || rawConcept || rawOriginal.startsWith("new:")) {
      const nameVal = rawName || rawConcept || rawOriginal.replace(/^new:\s*/i, "") || "New Flagship Concept";
      return {
        mode: "new",
        title: rawTitle || "New Concept",
        clientName: formatBrandName(nameVal),
        originalUrl: "",
      };
    }

    // Mode 2: Plain Simple Text Version (When no params provided, or explicitly set to text/plain/simple)
    if (explicitMode === "text" || explicitMode === "plain" || explicitMode === "simple" || (!rawOriginal && !rawName && !rawTitle && !rawConcept)) {
      return {
        mode: "text",
        title: rawTitle || "Studio Showcase",
        clientName: "",
        originalUrl: "",
      };
    }

    // Mode 3: Redesign Concept (When data-original URL, data-name, or data-title is provided)
    const redesignTitle = rawTitle || "Concept Redesign";
    let targetUrl = "";
    let derivedName = rawName;

    if (rawOriginal) {
      const isUrl = /^https?:\/\//i.test(rawOriginal) || rawOriginal.includes(".");
      if (isUrl) {
        targetUrl = rawOriginal;
        if (!/^https?:\/\//i.test(targetUrl)) targetUrl = "https://" + targetUrl;

        if (!derivedName) {
          let hostname = "";
          try {
            hostname = new URL(targetUrl).hostname.replace(/^www\./i, "");
          } catch (e) {
            hostname = rawOriginal.replace(/^https?:\/\/(www\.)?/i, "").split("/")[0];
          }
          derivedName = hostname.split(".")[0];
        }
      } else if (!derivedName) {
        derivedName = rawOriginal;
      }
    }

    return {
      mode: "redesign",
      title: redesignTitle,
      clientName: formatBrandName(derivedName || "Client Project"),
      originalUrl: targetUrl,
    };
  }

  /* ── 7. WEB COMPONENT IMPLEMENTATION ── */
  class DotNifRedesignBanner extends HTMLElement {
    static get observedAttributes() {
      return [
        "data-original",
        "data-concept",
        "data-mode",
        "data-type",
        "data-client",
        "data-name",
        "data-title"
      ];
    }

    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this._isOpen = false;
      this._presetIdx = 0;
      this._lookTarget = { x: 0, y: 0 };
      this._lookCurrent = { x: 0, y: 0 };
      this._blink = 0;
      this._blinkTarget = 0;
      this._animId = null;
      this._nextBlinkTime = performance.now() + 2500;
      this._onMouseMove = this._onMouseMove.bind(this);
      this._onTouchMove = this._onTouchMove.bind(this);
      this._onKeyDown = this._onKeyDown.bind(this);
      this._onResize = this._onResize.bind(this);
    }

    attributeChangedCallback(name, oldVal, newVal) {
      if (oldVal !== newVal && this.isConnected) {
        this._config = parseConfig(this);
        this.render();
        this.initWebGL();
        this.bindEvents();
        if (this._isOpen) {
          this.positionOrbOnCard();
        }
      }
    }

    connectedCallback() {
      this._config = parseConfig(this);
      this.render();
      this.initWebGL();
      this.bindEvents();
    }

    disconnectedCallback() {
      if (this._animId) cancelAnimationFrame(this._animId);
      window.removeEventListener("mousemove", this._onMouseMove);
      window.removeEventListener("touchmove", this._onTouchMove);
      window.removeEventListener("keydown", this._onKeyDown);
      window.removeEventListener("resize", this._onResize);
    }

    render() {
      const { mode, title, clientName, originalUrl } = this._config;

      let eyebrowLabel = title;
      let statusText = "Taking projects";
      let titleHtml = "";
      let descHtml = "";
      let tagsHtml = "";
      let actionsHtml = "";

      if (mode === "redesign") {
        eyebrowLabel = title || "Concept Redesign";
        titleHtml = `<h2 class="dn-title">${clientName}</h2>`;
        descHtml = `Architected by DotNif Studio — featuring high-performance Next.js engineering, sub-second latency, and conversion-focused UX.`;
        tagsHtml = `
          <span class="dn-tag">Next.js</span>
          <span class="dn-tag">WordPress</span>
          <span class="dn-tag">WooCommerce</span>
          <span class="dn-tag">SEO</span>
        `;
        actionsHtml = `
          ${
            originalUrl
              ? `<a href="${originalUrl}" target="_blank" rel="noopener noreferrer" class="dn-btn dn-btn-white">
                  Original Site
                  ${SVGS.externalLink}
                </a>`
              : `<a href="${MASTER_CONFIG.contactUrl}" target="_blank" rel="noopener noreferrer" class="dn-btn dn-btn-white">
                  Book a Call
                </a>`
          }
          <a href="${MASTER_CONFIG.studioDomain}" target="_blank" rel="noopener noreferrer" class="dn-btn dn-btn-blue">
            DotNif Studio
            ${SVGS.arrowRight}
          </a>
        `;
      } else if (mode === "new") {
        eyebrowLabel = title || "New Concept";
        statusText = "Featured Build";
        titleHtml = `<h2 class="dn-title">${clientName}</h2>`;
        descHtml = `Designed & engineered from the ground up by DotNif Studio — bespoke interactive web experience, ultra-fast TTFB, and forward-thinking aesthetics.`;
        tagsHtml = `
          <span class="dn-tag">Next.js</span>
          <span class="dn-tag">TypeScript</span>
          <span class="dn-tag">Tailwind</span>
          <span class="dn-tag">Full-Stack</span>
        `;
        actionsHtml = `
          <a href="${MASTER_CONFIG.contactUrl}" target="_blank" rel="noopener noreferrer" class="dn-btn dn-btn-white">
            Book a Call
          </a>
          <a href="${MASTER_CONFIG.studioDomain}" target="_blank" rel="noopener noreferrer" class="dn-btn dn-btn-blue">
            DotNif Studio
            ${SVGS.arrowRight}
          </a>
        `;
      } else {
        // Plain Simple Text Version
        eyebrowLabel = title || "Studio Showcase";
        titleHtml = `<h2 class="dn-title dn-title-studio">Websites engineered for <span class="dn-gradient">growth.</span></h2>`;
        descHtml = `Boutique web studio building fast Next.js, WordPress and high-conversion e-commerce systems with sub-second performance.`;
        tagsHtml = `
          <span class="dn-tag">Next.js</span>
          <span class="dn-tag">WordPress</span>
          <span class="dn-tag">Shopify</span>
          <span class="dn-tag">Technical SEO</span>
        `;
        actionsHtml = `
          <a href="${MASTER_CONFIG.contactUrl}" target="_blank" rel="noopener noreferrer" class="dn-btn dn-btn-white">
            Book a Call
          </a>
          <a href="${MASTER_CONFIG.workUrl}" target="_blank" rel="noopener noreferrer" class="dn-btn dn-btn-blue">
            Our Portfolio
            ${SVGS.arrowRight}
          </a>
        `;
      }

      this.shadowRoot.innerHTML = `
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');

          :host {
            all: initial;
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 2147483640;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            -webkit-font-smoothing: antialiased;
            color-scheme: dark;
          }

          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }

          /* Radar pulse keyframes for availability beacon */
          @keyframes dnPulse {
            0% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.6); }
            70% { box-shadow: 0 0 0 8px rgba(52, 211, 153, 0); }
            100% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0); }
          }

          @keyframes dnRing {
            0% { transform: scale(1); opacity: 0.8; }
            100% { transform: scale(1.6); opacity: 0; }
          }

          /* Ambient dimming backdrop */
          .dn-backdrop {
            position: fixed;
            inset: 0;
            background: radial-gradient(circle at 50% 50%, rgba(9, 11, 23, 0.72), rgba(5, 7, 16, 0.88));
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transition: opacity 0.4s ease, visibility 0.4s;
            z-index: 1;
          }
          .dn-backdrop.is-open {
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
          }

          /* Luxury Modal Card Centered Wrapper */
          .dn-card-wrapper {
            position: fixed;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            pointer-events: none;
            z-index: 2;
          }

          .dn-card {
            position: relative;
            width: 100%;
            max-width: 390px;
            border-radius: 28px;
            padding: 1px;
            background: linear-gradient(155deg, rgba(110, 170, 255, 0.75), rgba(255, 255, 255, 0.08) 38%, rgba(60, 110, 255, 0.5));
            box-shadow: 0 32px 70px -14px rgba(25, 60, 200, 0.65), 0 4px 14px rgba(0, 0, 0, 0.4);
            opacity: 0;
            transform: scale(0.94);
            visibility: hidden;
            pointer-events: none;
            transition: opacity 0.35s ease, transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.35s;
          }

          .dn-card.is-open {
            opacity: 1;
            transform: scale(1);
            visibility: visible;
            pointer-events: auto;
          }

          .dn-card-inner {
            position: relative;
            overflow: hidden;
            border-radius: 27px;
            /* 68px top padding guarantees 32px of clean breathing space below the perched orb */
            padding: 68px 26px 26px;
            text-align: center;
            background: radial-gradient(130% 70% at 50% 0%, rgba(47, 107, 255, 0.45), rgba(47, 107, 255, 0) 65%),
                        radial-gradient(90% 60% at 0% 100%, rgba(51, 214, 255, 0.14), rgba(51, 214, 255, 0) 60%),
                        #070B1D;
            color: #FFFFFF;
          }

          /* Ambient backlight behind the crowned orb */
          .dn-card-crown-glow {
            position: absolute;
            top: -30px;
            left: 50%;
            transform: translateX(-50%);
            width: 150px;
            height: 90px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(51, 210, 255, 0.3) 0%, rgba(67, 100, 255, 0.12) 50%, transparent 70%);
            pointer-events: none;
            filter: blur(14px);
          }

          /* Close button */
          .dn-close-btn {
            position: absolute;
            top: 16px;
            right: 16px;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(255, 255, 255, 0.06);
            color: #AAB5D8;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.15s ease, transform 0.15s ease, color 0.15s ease;
            z-index: 5;
          }
          .dn-close-btn:hover {
            background: rgba(255, 255, 255, 0.14);
            color: #FFFFFF;
            transform: scale(1.05);
          }
          .dn-close-btn:active {
            transform: scale(0.92);
          }

          /* Balanced metadata bar (Pill badge + Status) */
          .dn-meta-bar {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 12px;
          }

          .dn-brand-pill {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 10px 4px 8px;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.12);
            font-family: 'Space Grotesk', system-ui, sans-serif;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.12em;
            color: #C7D2F5;
            text-transform: uppercase;
          }

          .dn-status-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 10px;
            border-radius: 999px;
            background: rgba(16, 185, 129, 0.1);
            border: 1px solid rgba(16, 185, 129, 0.22);
            font-size: 11px;
            font-weight: 500;
            color: #34D399;
          }

          .dn-status-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #10B981;
            animation: dnPulse 2.2s infinite;
          }

          /* Typography & Hierarchy */
          .dn-eyebrow-label {
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            color: #8E94A5;
            margin-bottom: 2px;
          }

          .dn-title {
            font-family: 'Space Grotesk', system-ui, sans-serif;
            font-size: 27px;
            line-height: 1.15;
            font-weight: 700;
            letter-spacing: -0.02em;
            color: #FFFFFF;
          }

          .dn-title-studio {
            font-size: 24px;
            font-weight: 600;
          }

          .dn-gradient {
            background: linear-gradient(90deg, #6EA8FF, #33D2FF);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
          }

          /* Description */
          .dn-desc {
            margin: 10px 0 0;
            font-size: 13px;
            line-height: 1.55;
            color: #AAB5D8;
          }

          /* Tech tags */
          .dn-tags {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 6px;
            margin-top: 14px;
          }

          .dn-tag {
            padding: 4px 10px;
            border-radius: 999px;
            background: rgba(59, 108, 255, 0.16);
            border: 1px solid rgba(110, 170, 255, 0.25);
            font-size: 11px;
            font-weight: 500;
            color: #C7D8FF;
            letter-spacing: 0.02em;
          }

          /* Action Buttons: Guaranteed 1-line balanced layout */
          .dn-actions {
            display: flex;
            gap: 10px;
            margin-top: 22px;
          }

          .dn-btn {
            flex: 1;
            height: 44px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            border-radius: 999px;
            font-size: 13px;
            font-weight: 600;
            text-decoration: none;
            white-space: nowrap;
            padding: 0 14px;
            cursor: pointer;
            transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
          }

          .dn-btn-white {
            background: #FFFFFF;
            color: #070B1D;
          }
          .dn-btn-white:hover {
            transform: translateY(-1.5px);
            box-shadow: 0 8px 22px -6px rgba(255, 255, 255, 0.35);
          }
          .dn-btn-white:active {
            transform: scale(0.96);
          }

          .dn-btn-blue {
            background: linear-gradient(135deg, #2F6BFF, #4A8DFF);
            color: #FFFFFF;
            box-shadow: 0 8px 20px -8px rgba(47, 107, 255, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.25);
          }
          .dn-btn-blue:hover {
            transform: translateY(-1.5px);
            filter: brightness(1.12);
          }
          .dn-btn-blue:active {
            transform: scale(0.96);
          }

          /* ── THE LIVE ORB (Smooth Transition from Corner to Card Crown) ── */
          .dn-orb-trigger {
            position: fixed;
            z-index: 3;
            margin: 0;
            padding: 0;
            border: 0;
            cursor: pointer;
            border-radius: 50%;
            pointer-events: auto;
            background: radial-gradient(circle at 32% 26%, #C4D4FF 0, #7894FF 22%, #4364FF 54%, #1F2FB0 100%);
            box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2),
                        0 10px 28px -6px rgba(67, 100, 255, 0.8),
                        0 0 42px 4px rgba(67, 100, 255, 0.4);
            transition: top 0.65s cubic-bezier(0.34, 1.25, 0.5, 1),
                        left 0.65s cubic-bezier(0.34, 1.25, 0.5, 1),
                        right 0.65s cubic-bezier(0.34, 1.25, 0.5, 1),
                        bottom 0.65s cubic-bezier(0.34, 1.25, 0.5, 1),
                        width 0.65s cubic-bezier(0.34, 1.25, 0.5, 1),
                        height 0.65s cubic-bezier(0.34, 1.25, 0.5, 1),
                        transform 0.15s ease,
                        filter 0.15s ease;
          }

          /* Parked Closed State: Bottom Right Corner */
          .dn-orb-trigger.is-closed {
            right: 24px;
            bottom: 24px;
            width: 60px;
            height: 60px;
            left: auto;
            top: auto;
          }

          /* Perched Open State: Crown of the Center Card */
          .dn-orb-trigger.is-open {
            width: 72px;
            height: 72px;
            /* Coordinates set mathematically by positionOrbOnCard() */
          }

          .dn-orb-trigger:hover {
            filter: brightness(1.12);
          }
          .dn-orb-trigger:active {
            transform: scale(0.92);
          }

          /* Outer radar ring when closed */
          .dn-orb-trigger::after {
            content: "";
            position: absolute;
            inset: -4px;
            border-radius: 50%;
            border: 1.5px solid rgba(110, 150, 255, 0.7);
            opacity: 0;
            pointer-events: none;
          }
          .dn-orb-trigger.is-closed::after {
            animation: dnRing 2.4s ease-out infinite;
          }

          /* Green dot indicator on the orb */
          .dn-orb-beacon {
            position: absolute;
            right: 2px;
            bottom: 4px;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #10B981;
            border: 2px solid #070B1D;
            box-sizing: border-box;
            animation: dnPulse 2.2s infinite;
            transition: opacity 0.3s;
          }
          .dn-orb-trigger.is-open .dn-orb-beacon {
            opacity: 0;
            pointer-events: none;
          }

          /* WebGL canvas element */
          .dn-canvas {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            display: block;
            pointer-events: none;
          }

          /* Responsive adjustments */
          @media (max-width: 480px) {
            .dn-card {
              max-width: calc(100vw - 32px);
            }
            .dn-orb-trigger.is-closed {
              right: 16px;
              bottom: 16px;
              width: 52px;
              height: 52px;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .dn-status-dot, .dn-orb-trigger::after, .dn-orb-beacon {
              animation: none;
            }
            .dn-orb-trigger, .dn-card, .dn-backdrop {
              transition: none !important;
            }
          }
        </style>

        <!-- Ethereal Backdrop -->
        <div class="dn-backdrop" id="dnBackdrop"></div>

        <!-- Center Card Container -->
        <div class="dn-card-wrapper">
          <aside class="dn-card" id="dnCard" aria-label="DOTNIF web studio redesign">
            <div class="dn-card-crown-glow"></div>
            <div class="dn-card-inner">
              <button type="button" class="dn-close-btn" id="dnCloseBtn" aria-label="Close modal">
                ${SVGS.close}
              </button>

              <div class="dn-meta-bar">
                <div class="dn-brand-pill">
                  ${SVGS.logo}
                  <span>${MASTER_CONFIG.brandName}</span>
                </div>
                <div class="dn-status-badge">
                  <span class="dn-status-dot"></span>
                  ${statusText}
                </div>
              </div>

              <div class="dn-eyebrow-label">${eyebrowLabel}</div>
              ${titleHtml}
              <p class="dn-desc">${descHtml}</p>

              <div class="dn-tags">
                ${tagsHtml}
              </div>

              <div class="dn-actions">
                ${actionsHtml}
              </div>
            </div>
          </aside>
        </div>

        <!-- The Interactive WebGL Live Orb -->
        <button type="button" class="dn-orb-trigger is-closed" id="dnOrb" aria-label="DOTNIF orb: toggle studio card" aria-expanded="false">
          <canvas class="dn-canvas" id="dnCanvas" width="144" height="144"></canvas>
          <span class="dn-orb-beacon"></span>
        </button>
      `;

      this.$backdrop = this.shadowRoot.getElementById("dnBackdrop");
      this.$card = this.shadowRoot.getElementById("dnCard");
      this.$closeBtn = this.shadowRoot.getElementById("dnCloseBtn");
      this.$orb = this.shadowRoot.getElementById("dnOrb");
      this.$canvas = this.shadowRoot.getElementById("dnCanvas");
    }

    bindEvents() {
      // Toggle card open on orb click
      this.$orb.addEventListener("click", () => {
        if (!this._isOpen) {
          this.open();
        } else {
          // If already open, clicking the orb cycles through color presets
          this.cyclePreset();
        }
      });

      // Close handlers
      this.$closeBtn.addEventListener("click", () => this.close());
      this.$backdrop.addEventListener("click", () => this.close());

      // Global window tracking
      window.addEventListener("mousemove", this._onMouseMove, { passive: true });
      window.addEventListener("touchmove", this._onTouchMove, { passive: true });
      window.addEventListener("keydown", this._onKeyDown);
      window.addEventListener("resize", this._onResize, { passive: true });
    }

    _onMouseMove(e) {
      if (!this.$orb) return;
      const rect = this.$orb.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      // Horizontal tracking
      const dx = (e.clientX - cx) / (window.innerWidth / 2);

      // Vertically inverted fix:
      // When cursor is above the orb (e.clientY < cy), (cy - e.clientY) is positive,
      // correctly directing the gaze UP towards the pointer.
      const dy = (cy - e.clientY) / (window.innerHeight / 2);

      this._lookTarget.x = Math.max(-1, Math.min(1, dx * 1.5));
      this._lookTarget.y = Math.max(-1, Math.min(1, dy * 1.5));
    }

    _onTouchMove(e) {
      if (e.touches && e.touches[0]) {
        this._onMouseMove(e.touches[0]);
      }
    }

    _onKeyDown(e) {
      if (e.key === "Escape" && this._isOpen) {
        this.close();
      }
    }

    _onResize() {
      if (this._isOpen) {
        this.positionOrbOnCard();
      }
    }

    open() {
      this._isOpen = true;
      this.$backdrop.classList.add("is-open");
      this.$card.classList.add("is-open");
      this.$orb.classList.remove("is-closed");
      this.$orb.classList.add("is-open");
      this.$orb.setAttribute("aria-expanded", "true");

      // Position immediately with static layout metrics
      this.positionOrbOnCard();

      // And ensure perfect positioning on next frame
      requestAnimationFrame(() => {
        this.positionOrbOnCard();
      });

      // Spontaneous blink on open
      this._blinkTarget = 1;
      setTimeout(() => { this._blinkTarget = 0; }, 180);
    }

    close() {
      this._isOpen = false;
      this.$backdrop.classList.remove("is-open");
      this.$card.classList.remove("is-open");
      this.$orb.classList.remove("is-open");
      this.$orb.classList.add("is-closed");
      this.$orb.setAttribute("aria-expanded", "false");

      // Reset inline coordinates so CSS returns it to bottom right
      this.$orb.style.left = "";
      this.$orb.style.top = "";
      this.$orb.style.right = "";
      this.$orb.style.bottom = "";

      // Quick blink on dismissal
      this._blinkTarget = 1;
      setTimeout(() => { this._blinkTarget = 0; }, 180);
    }

    positionOrbOnCard() {
      if (!this.$card || !this.$orb) return;
      // Untransformed static layout metrics (immune to CSS scale/translate animations)
      const cardW = this.$card.offsetWidth;
      const cardH = this.$card.offsetHeight;
      const cardLeft = (window.innerWidth - cardW) / 2;
      const cardTop = (window.innerHeight - cardH) / 2;

      const orbSize = 72;
      const targetLeft = cardLeft + (cardW - orbSize) / 2;
      // Perch cleanly half above the card edge, half into the crown pedestal
      const targetTop = cardTop - orbSize / 2;

      this.$orb.style.left = `${Math.round(targetLeft)}px`;
      this.$orb.style.top = `${Math.round(targetTop)}px`;
      this.$orb.style.right = "auto";
      this.$orb.style.bottom = "auto";
    }

    cyclePreset() {
      this._presetIdx = (this._presetIdx + 1) % ORB_PRESETS.length;
      // Quick blink reaction on color change
      this._blinkTarget = 1;
      setTimeout(() => { this._blinkTarget = 0; }, 160);
    }

    /* ── 8. WEBGL ENGINE INITIALIZATION ── */
    initWebGL() {
      const gl = this.$canvas.getContext("webgl", { alpha: true, antialias: true });
      if (!gl) {
        console.warn("[DotNif Orb] WebGL not supported; using CSS fallback.");
        return;
      }

      function createShader(type, src) {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
          console.error("[DotNif Orb Shader Error]", gl.getShaderInfoLog(s));
          gl.deleteShader(s);
          return null;
        }
        return s;
      }

      const vs = createShader(gl.VERTEX_SHADER, VERT_SHADER);
      const fs = createShader(gl.FRAGMENT_SHADER, FRAG_SHADER);
      const prog = gl.createProgram();
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);

      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.error("[DotNif Orb Program Error]", gl.getProgramInfoLog(prog));
        return;
      }

      gl.useProgram(prog);

      // Full quad buffer
      const posBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
        -1,  1,
         1, -1,
         1,  1,
      ]), gl.STATIC_DRAW);

      const aPos = gl.getAttribLocation(prog, "a_position");
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      const uRes = gl.getUniformLocation(prog, "u_resolution");
      const uTime = gl.getUniformLocation(prog, "u_time");
      const uLook = gl.getUniformLocation(prog, "u_look");
      const uBlink = gl.getUniformLocation(prog, "u_blink");
      const uBody = gl.getUniformLocation(prog, "u_body");
      const uEye = gl.getUniformLocation(prog, "u_eye");

      gl.viewport(0, 0, 144, 144);
      gl.uniform2f(uRes, 144, 144);

      const startTime = performance.now();

      const renderLoop = (now) => {
        // Smooth gaze tracking physics (Lerp)
        const lerpFactor = 0.085;
        this._lookCurrent.x += (this._lookTarget.x - this._lookCurrent.x) * lerpFactor;
        this._lookCurrent.y += (this._lookTarget.y - this._lookCurrent.y) * lerpFactor;

        // Periodic spontaneous organic blinks
        if (now > this._nextBlinkTime) {
          this._blinkTarget = 1;
          this._nextBlinkTime = now + 3000 + Math.random() * 3500;
          setTimeout(() => { this._blinkTarget = 0; }, 140);
        }

        // Smooth blink interpolation
        this._blink += (this._blinkTarget - this._blink) * 0.35;

        // Current color preset
        const preset = ORB_PRESETS[this._presetIdx];

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.uniform1f(uTime, (now - startTime) * 0.001);
        gl.uniform2f(uLook, this._lookCurrent.x, this._lookCurrent.y);
        gl.uniform1f(uBlink, this._blink);
        gl.uniform3f(uBody, preset.body[0], preset.body[1], preset.body[2]);
        gl.uniform3f(uEye, preset.eye[0], preset.eye[1], preset.eye[2]);

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        this._animId = requestAnimationFrame(renderLoop);
      };

      this._animId = requestAnimationFrame(renderLoop);
    }
  }

  // Define custom element
  customElements.define("dotnif-redesign-banner", DotNifRedesignBanner);

  // Auto-mount into document body
  function mount() {
    if (!document.querySelector("dotnif-redesign-banner")) {
      const el = document.createElement("dotnif-redesign-banner");
      document.body.appendChild(el);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
