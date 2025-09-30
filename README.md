FC Fulbert — Déploiement GitHub Pages & SEO

Ce dépôt contient le site statique du club FC Fulbert. Il est prévu pour être hébergé sur GitHub Pages (branche `main` ou `gh-pages`). Ci-dessous les étapes et conseils SEO.

Déploiement GitHub Pages

- Créez un dépôt GitHub nommé `fcfulbert` (ou poussez ce dépôt).
- Dans les paramètres du dépôt (Settings → Pages), configurez la source sur `main` (dossier `/ (root)`), ou créez une branche `gh-pages` selon votre flux.
- Si vous utilisez un nom de domaine personnalisé, ajoutez un fichier `CNAME` contenant votre nom de domaine à la racine.

SEO et bonnes pratiques incluses

- `index.html` : meta tags essentiels ajoutés (title, description, canonical, robots).
- Open Graph & Twitter Card : images pointent vers `/img/image.png` et incluent `alt`.
- JSON-LD : données structurées (`SportsTeam` + `Event`) pour améliorer l'affichage dans les SERP.
- `sitemap.xml` : présent et lié depuis `index.html` et `robots.txt`.
- `robots.txt` : autorise l'accès et référence la sitemap.
- Accessibilité : skip link, attributs `alt`, balises `time` avec `datetime`.

Recommandations supplémentaires

- Remplacez l'URL `https://alancheramy28400.github.io/fcfulbert/` par votre domaine de production si vous en avez un (dans `index.html`, `sitemap.xml`, `robots.txt`, et JSON-LD).
- Générer une image sociale dédiée `og-image.jpg` (1200×630 px) et placez-la dans `img/` pour de meilleurs aperçus.
- Ajouter des pages supplémentaires (À propos, Politique de confidentialité, Pages équipes) et mettre à jour `sitemap.xml` en conséquence.
- Activer HTTPS (GitHub Pages le propose automatiquement pour `github.io`).
- Surveillez les performances SEO via Google Search Console et soumettez le `sitemap.xml`.

Fichiers modifiés/ajoutés

- `index.html` : meta & social améliorés, canonical, sitemap link.
- `robots.txt` : sitemap corrigé.
- `README.md` : ce fichier (instructions et recommandations).

Si vous voulez, je peux :
- Générer une image OG 1200×630 automatiquement et l'ajouter dans `img/`.
- Mettre à jour `sitemap.xml` pour inclure toutes les URLs du site.
- Ajouter un fichier `CNAME` si vous avez un nom de domaine personnalisé.
