# Brian Aquino's Portfolio

A personal portfolio for websites, web applications, and design work.

**Live site:** https://bmaquino-lab.github.io/PORTFOLIO-WEBSITE/

## Projects

- [Daluyan](https://daluyan-kapwa-uplb.web.app/) — a digital home for KAPWA sa UPLB.
- LTO Project — an interactive, browser-only demo based on the [LTOProject frontend](https://github.com/BMAquino-lab/LTOProject). It uses fictional records and is not an official government service. Changes are stored only in the visitor's browser and can be reset in the demo.

## Run locally

Serve this folder with a static server, for example:

```sh
python -m http.server 8000
```

Open http://localhost:8000/. The site is published from the repository root by GitHub Pages.

The LTO demo's source is in `lto-source/`; the built files are in `lto/`. To rebuild the demo:

```sh
cd lto-source
pnpm install --frozen-lockfile
pnpm run build
```
