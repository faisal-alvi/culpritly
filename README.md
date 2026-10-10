# Culpritly landing page

Static pre-sell landing page for Culpritly (https://culpritly.com), built for GitHub Pages.

Plain HTML and CSS. No build step, no frameworks, no trackers, no JavaScript.

## Files

```
index.html            Landing page (with SoftwareApplication + FAQPage JSON-LD)
privacy.html          Privacy page
404.html              Not found page (GitHub Pages serves this automatically)
assets/css/style.css  All styles (dark by default, light via prefers-color-scheme)
assets/img/           Logo mark, favicon, Open Graph image
CNAME                 Custom domain for GitHub Pages (culpritly.com)
robots.txt            Allows all crawlers, points to the sitemap
sitemap.xml           Home and privacy URLs
.nojekyll             Tells GitHub Pages to serve files as they are
```

## Preview locally

From this folder:

```sh
python3 -m http.server 8080
```

Then open http://localhost:8080. Stop the server with Ctrl+C.

Asset paths are root-relative (`/assets/...`), so serve the folder itself as the web root rather than opening `index.html` from the file system.

## Deploy to GitHub Pages

1. Create a GitHub repository (for example `culpritly-site`) and push this folder to its `main` branch.
2. In the repository, go to Settings > Pages.
3. Under "Build and deployment", set Source to "Deploy from a branch", branch `main`, folder `/ (root)`, and save.
4. Under "Custom domain", enter `culpritly.com` and save. The `CNAME` file in this repo already contains it.

## DNS for the custom domain

At your domain registrar or DNS provider, add these records.

Apex domain (`culpritly.com`), four A records:

| Type | Host | Value           |
|------|------|-----------------|
| A    | @    | 185.199.108.153 |
| A    | @    | 185.199.109.153 |
| A    | @    | 185.199.110.153 |
| A    | @    | 185.199.111.153 |

Optional IPv6 (AAAA records for `@`): `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`.

`www` subdomain, one CNAME record:

| Type  | Host | Value               |
|-------|------|---------------------|
| CNAME | www  | `<user>.github.io`  |

Replace `<user>` with the GitHub username or organization that owns the repository. Remove any other A, AAAA or CNAME records on `@` and `www` that point elsewhere (such as registrar parking pages).

DNS can take from a few minutes up to 24 hours to update. You can check with:

```sh
dig culpritly.com +short
dig www.culpritly.com +short
```

## Enable HTTPS

Once GitHub shows the DNS check as successful in Settings > Pages, tick "Enforce HTTPS". The certificate can take a little while to be issued after DNS resolves. If the checkbox is greyed out, wait and refresh.

Recommended: verify the domain for your account or organization (GitHub Settings > Pages > Verified domains) so nobody else can claim it on GitHub Pages.

## Editing notes

- All booking buttons link to https://calendly.com/faisalalvi33/new-meeting and open in a new tab.
- Contact email is hello@culpritly.com.
- The FAQ appears twice: once in the visible page and once in the FAQPage JSON-LD in `<head>`. Keep them in sync when editing.
- `assets/img/og-image.png` is the social sharing image (1200 x 630). Regenerate it if the headline changes.
- Keep `lastmod` in `sitemap.xml` current when content changes.
