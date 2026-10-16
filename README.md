# www.reallycare.org

The sales website for Plait, built with [Astro](https://astro.build) as a static site and served by a small Node server.

## Working on the site

```sh
npm install
npm run dev        # http://localhost:4321, reloads as you edit
```

- Pages live in `src/pages/`. Blog posts are Markdown files in `src/content/blog/`.
- Feature descriptions are in `src/data/features.ts`. The homepage and the Plait page both use them.
- Price settings (15p rate, £75 minimum) are in `src/components/PriceCalculator.astro`.
- Colours, fonts and light/dark mode are set in `src/styles/global.css`.

### Adding a blog post

Create `src/content/blog/My-Post-Title.md`:

```md
---
slug: My-Post-Title
title: My post title
date: 2026-11-01 10:00:00
description: One sentence for search results and the blog index.
tags: [News]
categories: [Announcement]
---
Post text in Markdown…
```

It will appear at `/2026/11/01/My-Post-Title/`.

## Running in production

```sh
npm ci
npm run build      # writes the site to dist/
npm start          # serves dist/ on port 3003
```

`server/server.mjs`:

- serves `dist/` from memory, with brotli/gzip compression
- sets the security headers, including a Content Security Policy that hashes the site's inline scripts automatically at startup
- redirects old Hexo URLs (`/solutions/`, `/tags/...`, `/privacy.html` for the mobile app, and so on)
- handles the demo form (`POST /api/demo`) by emailing the request, via Amazon SES, to the Plait support inbox

Restart the server after every build, because it loads `dist/` at startup.

### Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `3003` | Port to listen on (TLS is handled by the proxy in front) |
| `DEMO_TO` | `support@reallycare.plaitapp.org` | Where demo requests are sent |
| `DEMO_FROM` | `noreply@reallycare.plaitapp.org` | Sender, on an SES-verified domain |
| `AWS_REGION` | `eu-west-2` | SES region |
| `DEMO_DRY_RUN` | unset | If set, demo requests are logged instead of emailed |

AWS credentials are found through the AWS SDK's standard chain (environment variables, `~/.aws/credentials` or an instance role). They need permission to call `ses:SendEmail` (or `ses:SendRawEmail`).

### Testing the production build locally

```sh
npm run build && DEMO_DRY_RUN=1 PORT=3013 npm start
```
