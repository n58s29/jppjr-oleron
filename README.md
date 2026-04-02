# TEAM JPPJR — Ultra Trail de l'Île d'Oléron 2026

Page compagnon mobile-first pour l'équipe **JPPJR** (relais 4×25km) à l'Ultra Trail de l'Île d'Oléron, le 4 avril 2026.

**👉 [Voir la page](https://n58s29.github.io/jppjr/)**

---

## Fonctionnalités

- **Countdown** temps réel vers le départ (5h30)
- **Météo** heure par heure le jour de course (API Open-Meteo, 5h–14h)
- **Contacts d'urgence** en accès direct depuis le hero
- **Timeline** avec allure individuelle par coureur (3:45→6:30 /km, pas de 5s, sauvegarde locale)
- **Bouton LIVE** lié au suivi BreizhChrono en temps réel
- **Carte Leaflet** — tracé GPX, relais, ravitos liquides, parkings, départ/arrivée + marqueur coureur actif animé
- **Types de sol** — répartition % et km par relayeur (13 catégories, données GPX × OpenStreetMap)
- **Checklist matos** obligatoire 4×25km (cochable, persistante)
- **Infos parking** par point de relais
- **Infos supporters** — village, food trucks, soins, douches, programme
- **Liens utiles** — site orga, carto parcours, météo

---

## L'équipe

| Relayeur | Tronçon | Distance | Barrière horaire |
|----------|---------|----------|-----------------|
| 🟢 KLUMY | Départ (Château) → Grand-Village | 25,27 km | — |
| 🔵 SISI | Grand-Village → Domino | 22,97 km | 14h au km 48 |
| 🟠 MAT | Domino → Gautrelle | 28,61 km | 18h au km 75 |
| 🟣 TOTO | Gautrelle → Arrivée (Château) | 24,55 km | — |

---

## Structure

```
jppjr-oleron/
├── index.html   # Structure HTML (nav, hero, sections, footer)
├── style.css    # Tout le CSS (variables, composants, responsive)
└── app.js       # Tout le JS (countdown, météo, timeline, carte, checklist, parking)
```

Zéro build, zéro dépendance serveur. Hébergé sur GitHub Pages.

**Dépendances CDN :**
- [Leaflet 1.9.4](https://leafletjs.com/) — carte interactive
- [OpenStreetMap](https://www.openstreetmap.org/) — tuiles cartographiques
- [Open-Meteo](https://open-meteo.com/) — API météo gratuite

**Persistence locale :**
- `jppjr-paces` — allures sélectionnées par coureur
- `jppjr-gear` — état de la checklist matos

---

## Déployer

```bash
git clone https://github.com/n58s29/jppjr.git
cd jppjr
# Ouvrir index.html dans un navigateur, ou pusher sur main (GitHub Pages activé)
```

---

*Ultra Trail de l'Île d'Oléron — [ut-oleron.fr](https://ut-oleron.fr)*
