# Vasudha Pharma Chem Limited — Website

Static corporate website for **Vasudha Pharma Chem Limited**.

## GitHub Pages

1. Create a new GitHub repository (public for free Pages).
2. Upload the contents of this folder to the repo **root** (not inside another folder).
3. Repo **Settings → Pages**:
   - Source: **Deploy from a branch**
   - Branch: `main` (or `master`)
   - Folder: **/ (root)**
4. Save. After 1–2 minutes open:
   `https://<your-username>.github.io/<repo-name>/`

## Local preview

Open `index.html` or `home.html` in a browser, or run:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`

## Notes

- Large statutory PDFs may be in a separate `vasudha-large-pdfs.zip` — extract them into `assets/secretarial/statutory/` (and sustainability PDF into `assets/`) so all links work.
- Contact form is front-end only (no server mail).
