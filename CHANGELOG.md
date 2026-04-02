# Changelog

## [Unreleased] — 2026-04-02

### Refactoring
- Découpage du fichier unique `index.html` en 3 fichiers séparés : `index.html` (HTML, 174 lignes), `style.css` (CSS, 671 lignes), `app.js` (JS, 566 lignes)

---

## [1.4.0] — 2026-04-01

### Modifié
- Correction de l'URL du lien LIVE BreizhChrono dans la section Timeline

---

## [1.3.0] — 2026-03-31

### Ajouté
- **Météo en temps réel** via l'API Open-Meteo : prévisions heure par heure (5h–14h) le jour de course, avec icône météo, température, vent, probabilité de pluie
- Fallback sur un lien Météo France si l'API est indisponible
- Mise en évidence de l'heure courante dans le bandeau météo (le jour J)

### Modifié
- Correction du label météo et alignement centré du bandeau

---

## [1.2.0] — 2026-03-31

### Ajouté
- **Bouton LIVE** avec animation clignotante dans l'en-tête de la section Timeline, lié au suivi BreizhChrono en temps réel
- Animation `pulse` sur le marqueur coureur actif dans la carte

---

## [1.1.0] — 2026-03-31

### Ajouté
- **Boutons d'urgence** dans le hero (contacts Marilia et Brigitte, liens `tel:`)
- Correction du calcul d'affichage des durées (`fmtDuration`)

---

## [1.0.0] — 2026-03-31

### Ajouté
- Page compagnon mobile-first pour l'équipe JPPJR (relais 4×25km, UT Oléron 2026)
- Countdown temps réel vers le départ (4 avril 2026, 5h30)
- Timeline interactive avec sélecteur d'allure par coureur (3:45–6:30 /km, pas de 5s), persistance `localStorage`
- Carte Leaflet : tracé GPX simplifié (740 points), marqueurs relais, ravitos liquides, départ/arrivée
- Marqueur coureur actif animé, position interpolée sur le tracé en fonction des allures
- Section types de sol : répartition % et km par relayeur (13 catégories, données GPX × OpenStreetMap)
- Checklist matériel obligatoire 4×25km, cochable, persistante (`localStorage`)
- Infos parking par point de relais (Château, Grand-Village, Domino, Gautrelle)
- Infos supporters : village trail, restauration, soins, douches, règles
- Liens utiles : site officiel, carto parcours, FAQ, météo
