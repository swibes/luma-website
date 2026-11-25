# Verification record

## Layout and interactions

Checked in the user's Chrome preview:

- Desktop hero, navigation to Downloads and Changelog, Explore Features anchor.
- Theme preview changes from Midnight to Ocean without a page reload.
- Mobile Downloads, Support and Lyra at 400px; menu opens, navigates and closes.
- FAQ search filters to the GPU topic and its disclosure opens correctly.
- Changelog at 393px and 320px; release notes and dates remain within the viewport.
- Homepage at 320px: fixed grid overflow and header positioning; menu verified visible and usable afterward.
- Download and Lyra calls to action have consistent paragraph spacing; mobile buttons fit their cards.
- Chrome's fresh console showed no application errors or issues in the checked views. React's development-tools suggestion is expected in development.

These are Chrome viewport checks, not physical-device or cross-browser certification. Reduced-motion CSS and MotionConfig are implemented; a physical screen-reader audit has not been performed.

## Automated checks

`npm.cmd test` covers release selection, malformed assets, source and unrelated files, draft/prerelease exclusion, URL validation, mismatched URL filenames, API/network failures, fresh and expired caches, retry recovery, corrupt/unavailable storage, Markdown content safety and the privacy page.

`npm.cmd run build` checks TypeScript and produces the static Vite build. `npm.cmd run format:check` checks source formatting.

## Before public launch

- Replace the clearly identified interface illustrations with approved Luma and Lyra screenshots if desired. No actual product captures were included in the public source archive.
- Supply the final domain to configure absolute social-preview URLs and canonical metadata.
- Review on physical target devices and the intended production domain.
- Run the manual deployment workflow only after explicit approval.

No website deployment or GitHub publication has been performed.

## Final refinement pass

- 21 automated tests passed, including Escape closing mobile navigation and restoring toggle focus, and screenshot failure restoring an honestly labeled illustration.
- Production build passed after the component changes.
- Rechecked the updated homepage in Chrome.
- Waveforms pause offscreen and respect reduced motion; no bundle-size reduction is claimed.
- Hero screenshot configuration now reserves intrinsic image dimensions and includes a missing-image fallback.

## Page loading and deployment preparation

- 23 automated tests pass, including page-load failure recovery without losing access to official releases.
- Changelog is now its own lazy-loaded module. The other secondary-page module is 14.29 kB (5.20 kB gzip), compared with the previous combined 183.52 kB module. This measures build output, not a network-speed benchmark.
- Release-note headings are nested below the page and version headings rather than introducing additional top-level headings.
- The independently loaded Changelog was opened and visually checked in Chrome with actual release notes.
- Both the normal production build and a separate `/luma-website/` base-path build passed. The latter's HTML was checked for correctly prefixed script, stylesheet and favicon paths. The workflow itself has not been run remotely.

## Phase status

1. Architecture, visual system, navigation and hero: implemented.
2. Product sections, interactive color previews and responsive layout: implemented with clearly labeled interface illustrations.
3. Lyra, Downloads, Changelog, Support and Privacy: implemented against verified public-source facts.
4. GitHub metadata, download selection, caching and recovery: implemented and tested.
5. Motion, keyboard support and performance refinement: implemented; browser checks documented above, with physical-device and assistive-technology review still outstanding.
6. Production build, instructions and manual deployment preparation: complete locally. Approved product screenshots, final domain metadata and publication approval remain launch inputs.
