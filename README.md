# Luma website

Official website project for Luma by swibes. React, TypeScript, Vite, Tailwind CSS, Motion and Lucide. This project is independent of the desktop application.

## Run on Windows

Use Node.js 22 LTS or later. In this directory:

```powershell
npm.cmd ci
npm.cmd run dev
```

Open the Local URL printed by Vite. Keep the terminal open. Stop with Ctrl+C. `npm.cmd` avoids PowerShell's npm.ps1 execution-policy issue; administrator access is unnecessary.

```powershell
npm.cmd test
npm.cmd run build
npm.cmd run preview
```

The build is in `dist/`. Preview serves that build locally. Do not open index.html directly from File Explorer.

## Maintain

- `src/config.ts`: official repository, download allowlist, cache lifetime.
- `src/lib/`: GitHub response validation, selection and caching.
- `src/components/`: navigation, previews and reusable UI.
- `src/Home.tsx`, `src/Pages.tsx`, `src/Changelog.tsx`: site content. Changelog loads separately so its Markdown renderer is not downloaded for other secondary pages.
- `src/styles.css`: responsive design and reduced-motion rules.
- `public/assets/brand/`: official public release assets.
- `public/assets/screenshots/`: reserved for approved real screenshots.

Content was checked against the public Luma 2.1.4 / Lyra 1.0.0 release source. Recheck product claims when those versions change. Dynamic release metadata does not automatically change editorial product claims.

The current product previews are labeled illustrations, not screenshots. To replace the hero, add an approved WebP or PNG under `public/assets/screenshots/` and set `productAssets.hero` in `src/product-assets.ts` with its relative asset path, descriptive alt text, exact width and height, and caption. For example: `{ path: 'screenshots/home.webp', alt: 'Luma home in the Classic layout', width: 1600, height: 1000, caption: 'Luma 2.1.4 · Classic layout' }`. Use the actual image dimensions. A missing image falls back to the labeled illustration. The theme previews remain illustrations until individually replaced with authentic captures. Never copy profiles, cookie files, private media or personal portraits into public assets.

## GitHub releases

The browser requests up to 100 public releases without a token. Drafts are excluded; prereleases are labeled and excluded from the main download. Windows ZIP is preferred over EXE. Asset names, versions, upload state, size and official HTTPS destination are checked. Source archives and Lyra packages cannot become the Windows download. Unknown future naming conventions fall back to GitHub Releases until config is updated.

Release metadata is cached in localStorage for 15 minutes. Network failure shows a message on release pages and directs downloads to GitHub. Markdown is rendered without raw HTML or external images. Never put a GitHub token in a VITE variable.

## GitHub Pages — only after approval

No deployment has been performed. A manual-only workflow is included. Create a separate website repository, add these project files (excluding node_modules and dist), and enable Settings → Pages → GitHub Actions. Run the Deploy website workflow manually after approval. It builds using the repository name as the base path. Hash routes allow page refreshes on static hosting.

For a custom domain, configure DNS and Pages settings, add a CNAME file under public, and set the repository variable BASE_PATH to `/`. For a user-site repository, also set BASE_PATH to `/`. Otherwise leave it unset to use `/repository-name/`.

Before publishing, set absolute Open Graph image and canonical URLs for the approved domain in index.html. No domain is assumed in this local project.

## Verification

Automated release tests cover stable selection, drafts/prereleases, malformed data, unrelated/source/old assets, untrusted destinations and API failures. Production compilation checks TypeScript. Browser verification must include desktop and mobile navigation, FAQ search, theme switches, keyboard focus, reduced motion and an offline reload. Current illustrations should be replaced with approved product captures before treating the visual presentation as final.

## Provenance

Brand SVG/PNG files and theme colors originate from the public source archive attached to https://github.com/swibes/Luma/releases/tag/v2.1.4 . Public identity: swibes. No analytics or account collection is implemented.
