Guide analytics rapide — quelles métriques et où les trouver

Pré-requis : configurer Google Analytics 4 et remplacer `G-XXXXXXXXXX` par votre Measurement ID dans `index.html`. Attendre 24–48h pour que les données apparaissent.

Métriques demandées et où les trouver (GA4)

1) Nombre de visiteurs uniques
- GA4 appelle cela "Utilisateurs" ou "Utilisateurs actifs".
- Dans GA4 : Reports → Life cycle → Acquisition → Overview ou User acquisition; filtrez la période.
- Vous pouvez voir Utilisateurs (Total) et Utilisateurs nouveaux.

2) Nombre de nouveaux visiteurs
- GA4 : User acquisition → Nouveau(s) utilisateur(s) (New users). Comparez période sur période.

3) D'où viennent les visiteurs ?
- GA4 : Acquisition → User acquisition ou Traffic acquisition.
- Champs utiles : `session_source`, `session_medium`, `session_campaign` (ex: google / organic, direct, referral, social).
- Pour local, utilisez `geo` → Country / City.

4) Quelle est la source du trafic ?
- Même endroit que ci-dessus : Traffic acquisition montre les canaux (Organic Search, Direct, Referral, Social, Paid).
- En cliquant sur une ligne, vous verrez pages d'atterrissage correspondantes.

5) Temps moyen passé sur le site
- GA4 propose "Average engagement time" (temps moyen d'engagement). Dans Reports → Engagement → Overview.
- Privilégiez "engaged sessions" plutôt que simplement durée brute (GA4 compute l'engagement différemment que UA).

6) Taux de rebond
- GA4 a supprimé la métrique classique "bounce rate" par défaut mais fournit "engagement rate" et vous pouvez calculer le bounce rate = 1 - engagement_rate. Voir Engagement → Pages and screens.

7) Panier moyen du site
- Explication : "panier moyen" = average order value (AOV) — uniquement pertinent pour un site e‑commerce.
- Pour un club : si vous vendez des cotisations en ligne, définir un événement `purchase` avec la valeur monétaire dans GA4; AOV = revenue / number_of_purchases.
- Si vous n'avez pas d'e-commerce, ignorez ou remplacez par "valeur de conversion" (ex: inscriptions signées) et suivez le nombre d'inscriptions et la valeur estimée par inscription.

Événements instrumentés (déjà ajoutés)
- `signup_submit` (method: site_form) — envoyé lorsque le formulaire d'inscription est soumis et simulé.
- `share` (method: web_share | copy_clipboard | copy_execCommand) — envoyé lors d'un partage.
- `cta_click` (label, href) — envoyé pour les CTA hero et floating.

Conseils GDPR / confidentialité
- Vous devez afficher une bannière de consentement si vous collectez des données personnelles et activer les cookies analytiques seulement après consentement (selon GDPR).
- Outils : Cookiebot, Osano, ou un script de consentement simple.

Exemples de rapports rapides à créer
- Rapport "Acquisition locale" : filtrez par city=Chartres et affichez sources, utilisateurs, nouvelles sessions.
- Rapport "Conversions" : évènements `signup_submit` par source/medium (combien d'inscriptions par canal).
- Rapport "Engagement" : average engagement time par page (identifier pages faibles).

Si vous voulez que je :
- A : Remplace le snippet GA4 par un script de consentement (faire apparaître la bannière avant chargement),
- B : Ajoute un petit script de mesure local (log dans localStorage ou envoi à un endpoint) en attendant GA4,
- C : Crée des rapports GA4 prédéfinis (il faut accès au compte GA4 pour les configurer),
- D : Met en place une collecte réelle d'inscriptions (Formspree/Netlify) et tracker les conversions `purchase`/`signup`.

Choisissez A/B/C/D ou dites-moi quelle action prioriser.
