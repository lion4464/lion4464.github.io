# Jekyll CV Site (GitHub Pages)

This repo is a Jekyll version of your original single-page `index.html`.

## Structure
- `index.html` — page content (uses layout)
- `_layouts/default.html` — main HTML skeleton
- `_includes/header.html` — header/topbar
- `_includes/footer.html` — footer + toast
- `assets/css/style.css` — styles
- `assets/js/main.js` — scripts

## Local run (optional)
```bash
gem install bundler jekyll
jekyll serve
```
Then open http://127.0.0.1:4000

## GitHub Pages
Use **Settings → Pages → Deploy from a branch → main / (root)**.

If you rename repo to `lion4464.github.io` (user site), set `baseurl: ""` in `_config.yml`.
