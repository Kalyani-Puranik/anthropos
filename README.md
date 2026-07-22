# Anthropos — Agency Website

A single-page, production-ready website for **Anthropos**, a fictional design and growth studio for software companies. Built with plain HTML, CSS, and JavaScript, animated with [GSAP](https://gsap.com/) + ScrollTrigger. No build step, no framework, no backend.

> **Note on the name:** "Anthropos" is a fictional brand created for this project. It is not affiliated with Anthropic, PBC, or any real company. All portfolio projects, client names, testimonials, statistics, and contact details in this build are illustrative placeholders — replace them with real information before deploying.

---

## Quick start

This is a static site — there's nothing to build or install.

1. Open `index.html` directly in a browser, **or**
2. Serve the folder locally so relative paths and `fetch()` work exactly as they will in production:
   ```bash
   npx serve .
   # or
   python3 -m http.server 8080
   ```
3. Deploy by uploading the whole folder to any static host (Netlify, Vercel, GitHub Pages, S3 + CloudFront, etc.).

## Before you launch — replace these placeholders

| What | Where | Why |
|---|---|---|
| Formspree endpoint | `js/form.js` → `FORMSPREE_ENDPOINT` | The contact form won't deliver submissions until you swap in your own form ID from [formspree.io](https://formspree.io). |
| Domain | `index.html` `<link rel="canonical">`, Open Graph/Twitter tags, JSON-LD, `robots.txt`, `sitemap.xml` | All reference `https://www.anthropos.studio/` as a placeholder domain. |
| Email / phone / address | Contact section in `index.html`, JSON-LD `ProfessionalService` block | Currently fictional placeholder contact details. |
| Portfolio & testimonials | Portfolio and Testimonials sections in `index.html`, plus `images/work-*.svg` | Fictional case studies with illustrative results — replace with real client work and real, permissioned testimonials. |
| Social links | Footer in `index.html` | Point to real profiles or remove. |
| OG share image | `images/og-image.svg` | Works in most modern browsers, but some crawlers (older Facebook/LinkedIn scrapers) only support raster images. Export a 1200×630 PNG of this file (e.g. via a browser screenshot, Figma, or an online SVG-to-PNG tool) for maximum compatibility, then point the `og:image`/`twitter:image` tags at the PNG. |

## Folder structure

```
/
├── index.html
├── robots.txt
├── sitemap.xml
├── README.md
├── css/
│   ├── variables.css     — design tokens (color, type, spacing, radius, motion)
│   ├── reset.css         — baseline reset
│   ├── base.css          — typography, container/grid, buttons, focus states
│   ├── components.css    — nav, cards, forms, accordion, pipeline, cursor
│   ├── sections.css      — per-section layout
│   ├── animations.css    — keyframes + reduced-motion handling
│   └── responsive.css    — tablet / mobile breakpoints
├── js/
│   ├── main.js           — theme persistence, nav state, mobile menu, cursor, accordion
│   ├── animations.js     — all GSAP/ScrollTrigger sequences
│   └── form.js           — Formspree submission + confirmation modal
├── icons/
│   └── favicon.svg       — the orbit-mark brand symbol
└── images/
    ├── og-image.svg
    ├── work-*.svg        — abstract geometric portfolio thumbnails
    └── avatar-*.svg      — abstract geometric testimonial avatars
```

All imagery is original geometric SVG built from the same modular block system as the rest of the UI — there is no stock photography in this build, by design.

## Design system

- **Color:** Deep navy `#1A2A3D` as the dominant surface (~70%), white/gray for text and structure (~20%), coral `#ED524A` reserved strictly for CTAs, links, stats, and hover states (~10%).
- **Type:** Space Grotesk (display), Inter (body), Space Mono (small tracked-out eyebrow labels only — never headings).
- **Grid:** 12-column, 1320px max-width, 140px vertical section padding, 80/32/20px horizontal padding at desktop/tablet/mobile.
- **Signature motif:** the "orbit mark" — a rounded card or shape with a coral circle clipped at its corner. It's the favicon, the nav logo, and the recurring accent across card icons and hero illustration.
- **Dark / light themes:** Navy is the default surface theme (matching the brief's color ratios). The light theme is an inverted alternate — white-dominant surfaces with navy text — toggled via the header switch and remembered in `localStorage`. Neither theme ever flashes the wrong background on load.

## Accessibility

- Semantic landmarks (`header`, `main`, `footer`, `nav`), skip-to-content link, visible focus rings on every interactive element.
- All decorative SVGs are `aria-hidden`; informational images have descriptive `alt` text.
- FAQ accordion and mobile menu manage `aria-expanded` state.
- Respects `prefers-reduced-motion`: GSAP sequences are skipped entirely and content is shown in its final state instead of staying hidden.
- Site remains fully usable with JavaScript disabled (content is visible; only the enhancements are lost) and if the GSAP CDN fails to load.

## Performance notes

- No build tooling or JS framework — just the GSAP/ScrollTrigger CDN bundle plus three small first-party files.
- Portfolio and avatar imagery is hand-built SVG, so there are no large raster assets to optimize or lazy-load beyond what's already marked `loading="lazy"`.
- Google Fonts are loaded with `preconnect` hints; consider self-hosting the three font files if you need to remove the third-party request entirely.

## Browser support

Modern evergreen browsers (Chrome, Edge, Safari, Firefox). `backdrop-filter` and `clamp()` are used for the nav blur and fluid type scale — both are broadly supported, but the site degrades cleanly (solid nav background, fixed type size) where unsupported.
