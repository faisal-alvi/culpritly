# Culpritly landing page

Static pre-sell landing page for Culpritly, built for GitHub Pages.

Plain HTML and CSS. No build step, no frameworks, no trackers. The only script is a few lines inline in `404.html`.

## Files

```
index.html            Landing page (with SoftwareApplication + FAQPage JSON-LD)
privacy.html          Privacy page
404.html              Not found page, fully self-contained (inline CSS and logo)
assets/css/style.css  All styles (dark by default, light via prefers-color-scheme)
assets/img/           Logo mark, favicon, Open Graph image
robots.txt            Allows all crawlers, points to the sitemap
sitemap.xml           Home and privacy URLs
.nojekyll             Tells GitHub Pages to serve files as they are
```

## Works at a subpath or at a domain root

All internal links and asset paths are relative (`assets/...`, `privacy.html`, `./`), so the site works both:

- from a GitHub Pages project path, for example `https://faisalalvi.com/culpritly/` or `https://<user>.github.io/culpritly-site/`, and
- later at the root of `https://culpritly.com/`.

`404.html` does not load any external stylesheet or image from the site, because GitHub Pages serves it for missing URLs at any depth, where relative paths would break. A small inline script points its "home" links at `/` on culpritly.com and at the project folder (for example `/culpritly/`) everywhere else.

The canonical URL, `og:url`, `og:image`, `twitter:image`, sitemap and JSON-LD URLs intentionally stay absolute on `https://culpritly.com/`. They become correct as soon as the domain is live.

## Preview locally

From this folder:

```sh
python3 -m http.server 8080
```

Then open http://localhost:8080. Stop the server with Ctrl+C.

To check the subpath setup, serve a parent folder that contains this folder (or a symlink to it), for example `mkdir -p /tmp/sub && ln -s "$PWD" /tmp/sub/culpritly && python3 -m http.server 8081 -d /tmp/sub`, then open http://127.0.0.1:8081/culpritly/.

## Deploy to GitHub Pages (project path, before the domain is bought)

1. Create a GitHub repository (for example `culpritly-site`) and push this folder to its `main` branch.
2. In the repository, go to Settings > Pages.
3. Under "Build and deployment", set Source to "Deploy from a branch", branch `main`, folder `/ (root)`, and save.
4. Leave "Custom domain" empty. The site is served under your account's Pages address plus the repository name, for example `https://faisalalvi.com/culpritly-site/` if your user site uses the faisalalvi.com custom domain, or `https://<user>.github.io/culpritly-site/` otherwise. Name the repository `culpritly` if you want the path to be `/culpritly/`.

## When culpritly.com is bought

### 1. Re-add the CNAME file

There is intentionally no `CNAME` file yet. Once the domain is registered, add it back at the repository root containing exactly:

```
culpritly.com
```

```sh
printf 'culpritly.com' > CNAME && git add CNAME && git commit -m "Add culpritly.com custom domain"
```

Then in Settings > Pages > "Custom domain", enter `culpritly.com` and save.

### 2. DNS records

At the domain registrar or DNS provider, add these records.

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

DNS can take from a few minutes up to 24 hours to update. Check with:

```sh
dig culpritly.com +short
dig www.culpritly.com +short
```

### 3. Enable HTTPS

Once GitHub shows the DNS check as successful in Settings > Pages, tick "Enforce HTTPS". The certificate can take a little while to be issued after DNS resolves. If the checkbox is greyed out, wait and refresh.

Recommended: verify the domain for your account or organization (GitHub Settings > Pages > Verified domains) so nobody else can claim it on GitHub Pages.

## Editing notes

- All booking buttons link to https://calendly.com/faisalalvi33/new-meeting and open in a new tab.
- Contact email is hello@faisalalvi.com.
- The FAQ appears twice: once in the visible page and once in the FAQPage JSON-LD in `<head>`. Keep them in sync when editing.
- Keep internal links relative (no leading `/`) so the subpath setup keeps working.
- `assets/img/og-image.png` is the social sharing image (1200 x 630). Regenerate it if the headline changes.
- Keep `lastmod` in `sitemap.xml` current when content changes.
