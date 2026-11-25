# craigtracey.com

Craig Tracey’s personal website: founder, engineer, AI, and infrastructure. Built with Next.js, React, and CSS; exported as static HTML for Cloudflare Pages. No server or runtime secrets required. Fonts, portrait, company logos, and product screenshots are local, with no third-party asset requests.

## Development

Use Node.js 22 and Yarn 4 (the version is pinned in `package.json`). Enable Corepack if Yarn is unavailable.

```sh
corepack enable
yarn install --immutable
yarn dev
```

Open http://localhost:3000.

## Build

```sh
yarn build
```

The deployable website is generated in `out/`. Do not use `next start` for a static export. To preview the exact production files:

```sh
python3 -m http.server 3000 --directory out
```

## Cloudflare Pages

Connect this Git repository in **Workers & Pages → Create application → Pages → Import an existing Git repository**.

| Setting | Value |
| --- | --- |
| Framework preset | Next.js (Static HTML Export) |
| Production branch | `main` |
| Build command | `yarn build` |
| Build output directory | `out` |
| Root directory | Repository root (or `craigtracey.com` if deploying the parent workspace) |
| Environment variable | `NODE_VERSION=22` |

After the first deployment, add `craigtracey.com` in the Pages project’s **Custom domains** settings and follow Cloudflare’s DNS instructions. Add `www.craigtracey.com` too if desired, and configure a Cloudflare redirect rule to the canonical `https://craigtracey.com` domain.

You can also upload an already-built `out/` folder using Cloudflare Pages Direct Upload. No Workers adapter is needed.

Official deployment reference: https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/

## Cloudflare Workers static hosting

The existing Workers Builds project is named `craigtracey-com`. `wrangler.jsonc` configures it to serve the same static `out/` export, with an explicit compatibility date. No OpenNext adapter is needed.

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Build command | `yarn build` |
| Deploy command | `npx wrangler deploy --assets=./out` |
| Root directory | `/` |
| Environment variable | `NODE_VERSION=22` |

The deploy command can also be simplified to `npx wrangler deploy`, since the assets directory is declared in `wrangler.jsonc`.

## Content

- `src/app/page.tsx`: introduction, projects, expertise, background and social links.
- `src/app/globals.css`: responsive design, illustration styles, and reduced-motion support.
- `src/app/layout.tsx`: page title, description, canonical URL, and social metadata.
- `src/app/opengraph-image.tsx`: social sharing image, generated at build time.
- `src/app/icon.svg` and `src/app/favicon.ico`: site icons.
- `public/robots.txt` and `public/sitemap.xml`: search engine discovery.
- `public/_headers`: Cloudflare Pages response headers.

Featured projects are SixDegree (https://sixdegree.ai/about) and Deft (https://deft.io). Descriptions are based on their public sites. The experience list was supplied by Craig. Contact links point to LinkedIn. No email address is published.

## Image sources

- Portrait: https://sixdegree.ai/craig-tracey.png
- Product screenshots: https://sixdegree.ai and https://deft.io (November 25, 2026)
- Heptio: Accel portfolio company page, https://www.accel.com/companies/heptio
- IBM, VMware, and HubSpot: Simple Icons v11, https://simpleicons.org (brand trademarks remain with their owners)
- Carbonite: https://www.carbonite.com/assets/carbonite/icons/logo.svg
- Netezza: https://commons.wikimedia.org/wiki/File:Netezza-old-Logo.jpg
- Blue Box historical logo: https://logodix.com/logos/793006
- Managing Kubernetes cover: https://learning.oreilly.com/library/cover/9781492033905/500w/
- SixDegree logo and wordmark: https://sixdegree.ai/about (site header)
- Deft logo and wordmark: https://deft.io/icon.svg and https://deft.io (site header)
- Stratus: https://logotyp.us/file/stratus.svg
- Computer Associates: https://commons.wikimedia.org/wiki/File:Computer_Associates_logo.svg
