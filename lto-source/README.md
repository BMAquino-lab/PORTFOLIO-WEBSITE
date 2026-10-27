# LTO Project portfolio demo

This is adapted from the frontend of [LTOProject](https://github.com/BMAquino-lab/LTOProject). The portfolio build uses a small browser-only data adapter with fictional records; no LTO backend or database is contacted. Resetting clears the demo data in the current browser.

```sh
pnpm install --frozen-lockfile
pnpm run build
```

The build writes static files to `../lto/` for GitHub Pages. The adapter is a demonstration, not an official government service or a replacement for the original backend.

Run pnpm test with Node.js 24 or newer to check the sample-data adapter.
