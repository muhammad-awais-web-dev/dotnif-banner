/**
 * DotNif Studio — Centralized Concept Redesign Banner & Embed Widget
 *
 * A self-contained, zero-dependency Web Component that injects a luxury dark tech
 * concept-redesign badge/modal into any client website redesign.
 *
 * Encapsulated via Shadow DOM: 100% immune to host styles.
 *
 * @license MIT
 * @see https://github.com/dotnif/dotnif-banner
 */
(function () {
  "use strict";

  // Prevent duplicate injection
  if (window.customElements && window.customElements.get("dotnif-redesign-banner")) {
    return;
  }

  /* ── 1. CENTRAL MASTER CONFIGURATION (The Single Point of Truth) ── */
  // When you change your primary agency domain in the future,
  // edit this object right here. Every client site updates automatically.
  const MASTER_CONFIG = {
    studioDomain: "https://dotnif.com",
    contactUrl: "https://dotnif.com/#contact",
    brandName: "DotNif Engineering Studio",
    tagline: "High-performance web architectures & technical SEO.",
    defaultAccent: "#33D2FF",
    defaultBg: "#090A0F",
    defaultText: "#F5F7FF",
    storageKey: "dotnif_banner_dismissed",
  };

  /* ── 2. SVG ICONS (Strictly Clean SVGs, Zero Emojis) ── */
  const ICONS = {
    logo: `<svg width="22" height="19" viewBox="0 0 845 716" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    externalLink: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
      <polyline points="15 3 21 3 21 9"></polyline>
      <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>`,
    arrowUpRight: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="7" y1="17" x2="17" y2="7"></line>
      <polyline points="7 7 17 7 17 17"></polyline>
    </svg>`,
    chevronUp: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="18 15 12 9 6 15"></polyline>
    </svg>`,
    chevronDown: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>`,
    close: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>`,
    pulseCheck: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>`,
  };

  /* ── 3. PARAMETER RESOLUTION HELPER ── */
  function resolveConfig(scriptEl, globalConfig) {
    const ds = scriptEl?.dataset || {};
    const win = globalConfig || window.DOTNIF_BANNER_CONFIG || {};

    const studioUrl = win.studioUrl || ds.studioUrl || MASTER_CONFIG.studioDomain;
    const contactUrl = win.contactUrl || ds.contactUrl || `${studioUrl}/#contact`;

    // Dynamic Client Name Resolution
    let clientName = win.client || ds.client;
    if (!clientName) {
      // Auto-detect from host title or subdomain
      const host = window.location.hostname.replace(/^www\./, "");
      clientName = host.split(".")[0];
      if (clientName) {
        clientName = clientName.charAt(0).toUpperCase() + clientName.slice(1);
      } else {
        clientName = "Client Project";
      }
    }

    return {
      client: clientName,
      studioUrl: studioUrl,
      contactUrl: contactUrl,
      originalUrl: win.originalUrl || ds.originalUrl || "",
      caseStudyUrl: win.caseStudy || ds.caseStudy || "",
      position: win.position || ds.position || "bottom-right",
      theme: win.theme || ds.theme || "dark",
      accent: win.accent || ds.accent || MASTER_CONFIG.defaultAccent,
      ctaText: win.ctaText || ds.ctaText || "Scope Your Sprint",
      headline: win.headline || ds.headline || `Concept Redesign by DotNif`,
      subtext:
        win.subtext ||
        ds.subtext ||
        `An uncommissioned performance engineering redesign showcase for ${clientName}.`,
      showMetrics: (win.showMetrics !== false && ds.showMetrics !== "false"),
      initCollapsed: (win.collapsed === true || ds.collapsed === "true"),
      previewMode: (win.previewMode === true || ds.previewMode === "true"),
    };
  }

  /* ── 4. WEB COMPONENT CLASS WITH SHADOW DOM ── */
  class DotNifRedesignBanner extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this._collapsed = false;
      this._dismissed = false;
    }

    static get observedAttributes() {
      return [
        "data-client",
        "data-original-url",
        "data-case-study",
        "data-position",
        "data-accent",
        "data-cta-text",
        "data-collapsed",
        "data-show-metrics",
      ];
    }

    connectedCallback() {
      this.render();
    }

    attributeChangedCallback() {
      this.render();
    }

    getConfig() {
      const script = document.currentScript || document.querySelector("script[src*='banner.js']");
      const base = resolveConfig(script, window.DOTNIF_BANNER_CONFIG);

      // Element attribute overrides
      return {
        ...base,
        client: this.getAttribute("data-client") || base.client,
        originalUrl: this.getAttribute("data-original-url") || base.originalUrl,
        caseStudyUrl: this.getAttribute("data-case-study") || base.caseStudyUrl,
        position: this.getAttribute("data-position") || base.position,
        accent: this.getAttribute("data-accent") || base.accent,
        ctaText: this.getAttribute("data-cta-text") || base.ctaText,
        initCollapsed:
          this.getAttribute("data-collapsed") === "true" ||
          (!this.hasAttribute("data-collapsed") && base.initCollapsed),
        showMetrics:
          this.getAttribute("data-show-metrics") !== "false" && base.showMetrics,
      };
    }

    render() {
      const config = this.getConfig();

      // Check dismissed state in sessionStorage (unless in live preview mode)
      if (!config.previewMode) {
        try {
          if (sessionStorage.getItem(MASTER_CONFIG.storageKey) === "true") {
            this.style.display = "none";
            return;
          }
        } catch (_) {}
      }

      if (this._collapsed === undefined) {
        this._collapsed = config.initCollapsed;
      }

      // Position CSS Map
      const posMap = {
        "bottom-right": "bottom: 24px; right: 24px;",
        "bottom-left": "bottom: 24px; left: 24px;",
        "bottom-center": "bottom: 24px; left: 50%; transform: translateX(-50%);",
        "top-right": "top: 24px; right: 24px;",
        "top-left": "top: 24px; left: 24px;",
      };
      const posCss = posMap[config.position] || posMap["bottom-right"];

      this.shadowRoot.innerHTML = `
        <style>
          :host {
            --dn-bg: #090A0F;
            --dn-surface: rgba(14, 16, 24, 0.92);
            --dn-border: rgba(255, 255, 255, 0.12);
            --dn-accent: ${config.accent};
            --dn-text: #F5F7FF;
            --dn-muted: #8F95A5;
            --dn-font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, Helvetica, Arial, sans-serif;
            --dn-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
            all: initial;
            display: block;
            position: fixed;
            ${posCss}
            z-index: 2147483647;
            font-family: var(--dn-font);
            box-sizing: border-box;
            user-select: none;
            -webkit-user-select: none;
          }

          *, *::before, *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }

          /* Main Container */
          .dn-wrap {
            position: relative;
            max-width: calc(100vw - 32px);
            width: 380px;
            color: var(--dn-text);
            font-size: 13px;
            line-height: 1.5;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            filter: drop-shadow(0 16px 36px rgba(0, 0, 0, 0.55));
          }

          /* ── COMPACT PILL MODE ── */
          .dn-pill {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 8px 14px 8px 10px;
            border-radius: 999px;
            background: rgba(9, 10, 15, 0.95);
            border: 1px solid var(--dn-border);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            cursor: pointer;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
            transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
          }
          .dn-pill:hover {
            transform: translateY(-2px);
            border-color: var(--dn-accent);
            box-shadow: 0 12px 28px rgba(51, 210, 255, 0.2);
          }
          .dn-pill-dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: var(--dn-accent);
            box-shadow: 0 0 8px var(--dn-accent);
            animation: dnPulse 1.8s infinite ease-in-out;
            flex-shrink: 0;
          }
          .dn-pill-text {
            font-size: 12px;
            font-weight: 600;
            letter-spacing: -0.01em;
            color: var(--dn-text);
            white-space: nowrap;
          }
          .dn-pill-text span {
            color: var(--dn-accent);
          }
          .dn-pill-arrow {
            color: var(--dn-muted);
            display: flex;
            align-items: center;
          }

          /* ── EXPANDED CARD MODE ── */
          .dn-card {
            border-radius: 16px;
            background: var(--dn-surface);
            border: 1px solid var(--dn-border);
            backdrop-filter: blur(28px);
            -webkit-backdrop-filter: blur(28px);
            overflow: hidden;
            box-shadow: 0 20px 48px -10px rgba(0, 0, 0, 0.75), inset 0 1px 1px rgba(255, 255, 255, 0.15);
            animation: dnSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          }

          /* Top Header Bar */
          .dn-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 14px 12px 16px;
            background: rgba(255, 255, 255, 0.03);
            border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          }
          .dn-brand-lockup {
            display: flex;
            align-items: center;
            gap: 9px;
            text-decoration: none;
            color: inherit;
          }
          .dn-badge {
            font-family: var(--dn-mono);
            font-size: 10px;
            font-weight: 600;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            padding: 2.5px 7px;
            border-radius: 999px;
            background: rgba(51, 210, 255, 0.12);
            color: var(--dn-accent);
            border: 1px solid rgba(51, 210, 255, 0.3);
          }
          .dn-controls {
            display: flex;
            align-items: center;
            gap: 4px;
          }
          .dn-btn-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 26px;
            height: 26px;
            border-radius: 6px;
            background: transparent;
            border: 1px solid transparent;
            color: var(--dn-muted);
            cursor: pointer;
            transition: all 0.15s ease;
          }
          .dn-btn-icon:hover {
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(255, 255, 255, 0.12);
            color: var(--dn-text);
          }

          /* Body Content */
          .dn-body {
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .dn-headline {
            font-size: 14px;
            font-weight: 700;
            letter-spacing: -0.015em;
            color: #FFFFFF;
            line-height: 1.35;
          }
          .dn-desc {
            font-size: 12px;
            color: var(--dn-muted);
            line-height: 1.5;
          }
          .dn-desc strong {
            color: var(--dn-text);
            font-weight: 600;
          }

          /* Performance Metrics Chip */
          .dn-metrics {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 10px;
            border-radius: 8px;
            background: rgba(16, 185, 129, 0.08);
            border: 1px solid rgba(16, 185, 129, 0.22);
            font-family: var(--dn-mono);
            font-size: 11px;
            color: #A7F3D0;
            letter-spacing: 0.02em;
          }
          .dn-metrics-badge {
            font-weight: 700;
            color: #10B981;
          }

          /* Actions Grid */
          .dn-actions {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-top: 4px;
          }
          .dn-btn-primary {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 7px;
            width: 100%;
            padding: 10px 14px;
            border-radius: 8px;
            background: #FFFFFF;
            color: #090A0F;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: -0.01em;
            text-decoration: none;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .dn-btn-primary:hover {
            background: var(--dn-accent);
            color: #090A0F;
            box-shadow: 0 4px 16px rgba(51, 210, 255, 0.35);
          }

          .dn-secondary-row {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .dn-btn-secondary {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            padding: 7px 10px;
            border-radius: 7px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: var(--dn-muted);
            font-size: 11px;
            font-weight: 500;
            text-decoration: none;
            cursor: pointer;
            transition: all 0.15s ease;
          }
          .dn-btn-secondary:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.2);
            color: var(--dn-text);
          }

          /* Footer Credit */
          .dn-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 16px 12px;
            font-size: 10px;
            color: rgba(245, 247, 255, 0.4);
            font-family: var(--dn-mono);
          }
          .dn-footer a {
            color: var(--dn-muted);
            text-decoration: none;
            transition: color 0.15s;
          }
          .dn-footer a:hover {
            color: var(--dn-accent);
          }

          /* Keyframe Animations */
          @keyframes dnPulse {
            0% { transform: scale(0.85); opacity: 0.6; }
            50% { transform: scale(1.15); opacity: 1; box-shadow: 0 0 10px var(--dn-accent); }
            100% { transform: scale(0.85); opacity: 0.6; }
          }
          @keyframes dnSlideUp {
            from { opacity: 0; transform: translateY(12px) scale(0.97); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }

          /* Mobile Responsive */
          @media (max-width: 480px) {
            :host {
              left: 14px !important;
              right: 14px !important;
              bottom: calc(14px + env(safe-area-inset-bottom, 0px)) !important;
              transform: none !important;
            }
            .dn-wrap {
              width: 100%;
              max-width: 100%;
            }
          }
        </style>

        <div class="dn-wrap">
          ${
            this._collapsed
              ? `
              <!-- Compact Mode -->
              <div class="dn-pill" id="dn-expand-trigger" role="button" aria-label="Expand concept redesign details">
                <span class="dn-pill-dot"></span>
                ${ICONS.logo}
                <span class="dn-pill-text">Concept Redesign · <span>${config.client}</span></span>
                <span class="dn-pill-arrow">${ICONS.chevronUp}</span>
              </div>
            `
              : `
              <!-- Expanded Mode -->
              <div class="dn-card">
                <!-- Header -->
                <div class="dn-header">
                  <a href="${config.studioUrl}" target="_blank" rel="noopener noreferrer" class="dn-brand-lockup" aria-label="Visit DotNif Studio">
                    ${ICONS.logo}
                    <span class="dn-badge">Concept Spec</span>
                  </a>
                  <div class="dn-controls">
                    <button class="dn-btn-icon" id="dn-collapse-btn" title="Minimize to pill" aria-label="Minimize">
                      ${ICONS.chevronDown}
                    </button>
                    <button class="dn-btn-icon" id="dn-close-btn" title="Close banner" aria-label="Close">
                      ${ICONS.close}
                    </button>
                  </div>
                </div>

                <!-- Body -->
                <div class="dn-body">
                  <div class="dn-headline">
                    ${config.headline}
                  </div>
                  <p class="dn-desc">
                    ${config.subtext}
                  </p>

                  ${
                    config.showMetrics
                      ? `
                    <div class="dn-metrics">
                      ${ICONS.pulseCheck}
                      <span><span class="dn-metrics-badge">99+</span> Core Web Vitals · Sub-second TTFB</span>
                    </div>
                  `
                      : ""
                  }

                  <!-- Action Buttons -->
                  <div class="dn-actions">
                    <a href="${config.contactUrl}" target="_blank" rel="noopener noreferrer" class="dn-btn-primary">
                      <span>${config.ctaText}</span>
                      ${ICONS.arrowUpRight}
                    </a>

                    ${
                      config.originalUrl || config.caseStudyUrl
                        ? `
                      <div class="dn-secondary-row">
                        ${
                          config.originalUrl
                            ? `
                          <a href="${config.originalUrl}" target="_blank" rel="noopener noreferrer" class="dn-btn-secondary">
                            <span>Original Site</span>
                            ${ICONS.externalLink}
                          </a>
                        `
                            : ""
                        }
                        ${
                          config.caseStudyUrl
                            ? `
                          <a href="${config.caseStudyUrl}" target="_blank" rel="noopener noreferrer" class="dn-btn-secondary">
                            <span>Case Study</span>
                            ${ICONS.arrowUpRight}
                          </a>
                        `
                            : ""
                        }
                      </div>
                    `
                        : ""
                    }
                  </div>
                </div>

                <!-- Footer Credit -->
                <div class="dn-footer">
                  <span>Engineered by DotNif</span>
                  <a href="${config.studioUrl}" target="_blank" rel="noopener noreferrer">dotnif.com ↗</a>
                </div>
              </div>
            `
          }
        </div>
      `;

      // Event Bindings
      const expandTrigger = this.shadowRoot.getElementById("dn-expand-trigger");
      if (expandTrigger) {
        expandTrigger.addEventListener("click", () => {
          this._collapsed = false;
          this.render();
        });
      }

      const collapseBtn = this.shadowRoot.getElementById("dn-collapse-btn");
      if (collapseBtn) {
        collapseBtn.addEventListener("click", () => {
          this._collapsed = true;
          this.render();
        });
      }

      const closeBtn = this.shadowRoot.getElementById("dn-close-btn");
      if (closeBtn) {
        closeBtn.addEventListener("click", () => {
          if (!config.previewMode) {
            try {
              sessionStorage.setItem(MASTER_CONFIG.storageKey, "true");
            } catch (_) {}
          }
          this.style.display = "none";
        });
      }
    }
  }

  // Register Web Component
  window.customElements.define("dotnif-redesign-banner", DotNifRedesignBanner);

  /* ── 5. AUTO-INITIALIZATION ── */
  function autoMount() {
    // Only auto-mount if not already present on page
    if (!document.querySelector("dotnif-redesign-banner")) {
      const banner = document.createElement("dotnif-redesign-banner");
      document.body.appendChild(banner);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoMount);
  } else {
    autoMount();
  }
})();
