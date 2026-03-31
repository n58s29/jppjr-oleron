# 🏃 Équipe JPPJR — Ultra Trail de l'Île d'Oléron 2026

Page compagnon mobile-first pour l'équipe **JPPJR** (relais 4×25km) à l'Ultra Trail de l'Île d'Oléron, le 4 avril 2026.

**👉 [Voir la page](https://n58s29.github.io/jppjr/)**

## Contenu

- **Countdown** temps réel vers le départ (5h30)
- **Timeline** avec allure individuelle par coureur (3:45→6:30/km, pas de 15s, sauvegarde locale)
- **Carte Leaflet** — relais, ravitos liquides, parkings, départ/arrivée
- **Types de sol** — répartition % et km par relayeur (données GPX × OpenStreetMap)
- **Checklist matos** obligatoire 4×25km (cochable, persistante)
- **Infos parking** par point de relais
- **Infos supporters** — village, food trucks, soins, douches, programme
- **Liens utiles** — site orga, carto parcours, météo

## L'équipe

| Relayeur | Tronçon | Distance |
|----------|---------|----------|
| 🟢 KLUMY | Départ → Grand-Village | 25,27 km |
| 🔵 SISI | Grand-Village → Domino | 22,97 km |
| 🟠 MAT | Domino → Gautrelle | 28,61 km |
| 🟣 TOTO | Gautrelle → Arrivée | 24,55 km |

## Stack

Fichier unique `index.html`, zéro build, zéro dépendance serveur. Hébergé sur GitHub Pages.

- HTML/CSS/JS vanilla
- [Leaflet](https://leafletjs.com/) (CDN) pour la carte
- [OpenStreetMap](https://www.openstreetmap.org/) tiles
- `localStorage` pour la persistance (allures + checklist)
- Données sol issues de l'API Overpass (analyse GPX tous les 10m)

## Déployer

```bash
git clone https://github.com/n58s29/jppjr.git
cd jppjr
# c'est déjà prêt — juste push sur main avec GitHub Pages activé
```

---

*Ultra Trail de l'Île d'Oléron — [ut-oleron.fr](https://ut-oleron.fr)*
