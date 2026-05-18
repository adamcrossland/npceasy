# NPC Easy

A free, offline-first web app for building and managing NPC and player character stat blocks for **Dungeons & Dragons 5th Edition**. All data is stored locally in your browser — no account, no server, no internet connection required.

**Live app:** [https://npceasy.com](https://npceasy.com)

---

## Who is this for?

- **Game Masters** who want a lightweight, private place to build and track NPCs without relying on proprietary platforms.
- **Players** who want a simple digital character sheet they can use at the table or offline.
- **Homebrew creators** who need to add custom races, classes, spells, feats, and weapons beyond the SRD content.

If you've ever wanted a no-frills, no-account, runs-in-any-browser character manager that you fully own and control, NPC Easy is for you.

---

## Features

- **Collections** — Organize characters into named groups (campaigns, factions, locations).
- **Character Builder** — Full character creation with ability scores, class levels, subclasses, feats, skills, spells, weapons, armor, backgrounds, and personality traits.
- **Character Sheet** — A compact, print-friendly summary with attack rolls, AC, saving throws, skill bonuses, spell slots, class features, and racial traits — all computed automatically.
- **Compendium** — Edit or extend the built-in SRD content. Add custom races, classes, spells, feats, weapons, and fighting styles. Changes are reflected everywhere in the app immediately.
- **Export / Import** — Back up your entire data set to a JSON file and restore it on any browser or device.
- **Offline support** — A service worker caches the app shell so it works without an internet connection after the first visit.
- **No dependencies at runtime** — Alpine.js (via CDN) is the only runtime library. No frameworks, no build-time UI dependencies.

---

## SRD Content

NPC Easy ships with content from the **System Reference Document 5.2.1** by Wizards of the Coast LLC, licensed under the [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/legalcode).

This means all built-in races, classes, spells, feats, backgrounds, weapons, and fighting styles are from the SRD. You are free to add any additional content for your own campaign.

NPC Easy is not affiliated with, endorsed by, or sponsored by Wizards of the Coast LLC.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript |
| Bundler | Vite |
| UI | Alpine.js (CDN) |
| Styling | Tailwind CSS (CDN) |
| Storage | Browser `localStorage` |
| Offline | Service Worker |

There is no backend, no database, and no authentication layer.

---

## Getting Started (Local Development)

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- npm 9 or later

### Install and run

```bash
git clone https://github.com/adamcrossland/npceasy.git
cd npceasy
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for production

```bash
npm run build
```

Output is written to `dist/`. The contents of `dist/` can be served by any static file host.

### Preview the production build locally

```bash
npm run preview
```

### UI test suite (Playwright)

NPC Easy includes a Playwright UI regression suite that you can run on demand before releases or after larger refactors.

```bash
# Run full UI suite headless
npm run test:ui

# Run smoke tests only (fast path)
npm run test:ui:smoke

# Run with browser visible
npm run test:ui:headed

# Open Playwright UI mode for step-by-step debugging
npm run test:ui:debug

# Open the latest HTML report
npm run test:ui:report
```

The test runner starts the Vite dev server automatically and validates key user journeys: navigation, collections, character builder, character sheet, compendium changes, and JSON export.

---

## Forking and Deploying Your Own Instance

NPC Easy is intentionally simple to self-host. There is no server-side component — just static files.


To deploy manually with the SWA CLI:

```bash
npm install -g @azure/static-web-apps-cli
npm run deploy
```

### Deploy to any static host

Build the project (`npm run build`) and upload the `dist/` folder to any static hosting provider:

- **GitHub Pages** — push `dist/` to a `gh-pages` branch or configure Pages to deploy from a GitHub Actions workflow.
- **Netlify** — connect your fork and set the build command to `npm run build` and the publish directory to `dist`.
- **Cloudflare Pages** — same as Netlify: build command `npm run build`, output directory `dist`.
- **Vercel** — import your fork; Vite is auto-detected.

---

## Project Structure

```
src/
  main.ts          # All app logic and Alpine.js component
  armors.ts        # SRD armor data
  backgrounds.ts   # SRD background data
  classes.ts       # SRD class and subclass data
  feats.ts         # SRD feat data
  fightingStyles.ts # SRD fighting style data
  races.ts         # SRD race and subrace data
  spells.ts        # SRD spell data
  weapons.ts       # SRD weapon data
  style.css        # Global styles (Tailwind directives)
public/
  sw.js            # Service worker for offline support
  manifest.webmanifest # PWA manifest
index.html         # App shell
```

---

## Contributing

Bug reports and feature requests are welcome via [GitHub Issues](https://github.com/adamcrossland/npceasy/issues).

Pull requests are also welcome. For significant changes, please open an issue first to discuss what you'd like to change.

---

## License

The application code is released under the [MIT License](LICENSE).

SRD content included in this project is from the System Reference Document 5.2.1 by Wizards of the Coast LLC and is used under the [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/legalcode).

---

## Author

Built by [Adam Crossland](https://crossland.dev). Questions, feedback, and gripes welcome at [adam.crossland@gmail.com](mailto:adam.crossland@gmail.com).
