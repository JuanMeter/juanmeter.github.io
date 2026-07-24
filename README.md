# MeterWise website

Statische, responsieve bedrijfswebsite voor **MeterWise**. De website positioneert MeterWise rond AI-strategie, AI-governance, risicobeheersing en ISO/IEC 42001-readiness.

De publieke inhoud vertaalt het interne koersdocument naar een commerciële klantreis, zonder interne prijs- en verkoophypotheses, fictieve cases of certificeringsgaranties te publiceren.

## Paginastructuur

| Route | Functie |
|---|---|
| `/` | **Over MeterWise**: brede hoofdpagina met merkintro, kernpropositie, samenvattingen en doorverwijzingen |
| `/diensten/` | Verdieping van de QuickScan, Governance Scan, implementatie, ISO-readiness en continuïteit |
| `/aanpak/` | Werkwijze, zeven beoordelingsdomeinen, vier bewijsniveaus en 30/60/90-dagenroadmap |
| `/voor-wie/` | Koopsignalen, relevante sectoren, fitcriteria en een korte zelfcheck |
| `/kennismaking/` | Interactief formulier in drie stappen voor een vrijblijvende kennismaking |

De hoofdnavigatie is op alle inhoudspagina’s gelijk. “Over MeterWise” verwijst naar `/`, waardoor de hoofdpagina niet onnodig op een tweede URL wordt gedupliceerd.

## Belangrijkste functionaliteit

### Landingintro

- Schermvullende zwarte merkintro.
- De twee verticale logodelen staan vanaf het begin rechts van de tekst en sluiten tijdens het scrollen recht omlaag.
- Er is geen cursorreactie meer op het logo, de achtergrondscène of de gloed.
- Alleen de tekst **“Intelligentie. Met controle.”** reageert subtiel op een fijne muisaanwijzer.
- Op touchapparaten worden de zwaarste decoratieve animaties uitgeschakeld.
- De oogvormen en korte sluitlijn verschijnen wanneer het MW-logo compleet is.
- `prefers-reduced-motion` krijgt een rustige, volledig gevormde variant.

### Algemene website

- Responsive sticky navigatie met mobiel menu.
- Duidelijke primaire en secundaire acties.
- Scroll-progressindicator en terug-naar-bovenknop.
- Toegankelijke reveal-animaties met reduced-motionfallback.
- Unieke titels, descriptions en Open Graph-metadata per route.
- Frameworkvrij: HTML, CSS en vanilla JavaScript.

### Kennismakingsformulier

1. Keuze van gespreksonderwerp.
2. Organisatiegegevens en gewenste start.
3. Contactgegevens, toestemming en verzending.

Zonder externe formulierdienst opent de website een voorbereide e-mail aan `meterwise@outlook.com`. Met een geldig Formspree-endpoint kan het formulier rechtstreeks verzenden.

## Projectstructuur

```text
.
├── index.html
├── styles.css
├── pages.css
├── script.js
├── README.md
├── assets/
│   ├── favicon.svg
│   ├── landing-mark-body.svg
│   ├── landing-mark-eyes.svg
│   ├── meterwise-banner.avif
│   ├── meterwise-banner.webp
│   ├── meterwise-banner.png
│   └── og-image.jpg
├── diensten/
│   └── index.html
├── aanpak/
│   └── index.html
├── voor-wie/
│   └── index.html
└── kennismaking/
    ├── index.html
    ├── kennismaking.css
    └── kennismaking.js
```

## Lokaal bekijken

Start vanuit de projectmap een lokale webserver:

```powershell
python -m http.server 8000
```

Open vervolgens:

- [http://localhost:8000/](http://localhost:8000/)
- [http://localhost:8000/diensten/](http://localhost:8000/diensten/)
- [http://localhost:8000/aanpak/](http://localhost:8000/aanpak/)
- [http://localhost:8000/voor-wie/](http://localhost:8000/voor-wie/)
- [http://localhost:8000/kennismaking/](http://localhost:8000/kennismaking/)

Gebruik bij voorkeur geen `file://`, omdat absolute routes dan niet hetzelfde werken als op GitHub Pages.

## Inhoud beheren

### Over MeterWise — `index.html`

| Onderdeel | HTML-locatie | Inhoud |
|---|---|---|
| Landingintro | `.landing-copy` | Merkregel, grote introductietekst en korte belofte |
| Hoofdpropositie | `section.hero` | Hoofdkop, uitleg, CTA’s en drie vertrouwenspunten |
| Waarom MeterWise | `section.intro` | Het probleem dat AI sneller groeit dan de beheersing |
| Dienstenoverzicht | `#diensten` | Korte samenvatting van de drie belangrijkste routes |
| Aanpakoverzicht | `#aanpak` | Vier stappen van inventarisatie tot activatie |
| Concrete output | `.scan-output` | Zes resultaten van de Governance Scan |
| Doelgroepenoverzicht | `#voor-wie` | Drie brede toepassingsomgevingen |
| Slot-CTA | `#contact` | Vraag, toelichting en knop naar kennismaking |

De kaarten op de hoofdpagina zijn bewust compact. Verdiepende uitleg hoort op de subpagina’s.

### Diensten — `diensten/index.html`

| Anker | Inhoud |
|---|---|
| `#dienstenoverzicht` | Productlijn van oriënteren naar verankeren |
| `#quickscan` | Doel en opbrengst van de AI QuickScan |
| `#governance-scan` | Kernproduct, belofte en concrete deliverables |
| `#implementatie` | Inrichting van rollen, beleid, processen en bewijs |
| ISO/IEC 42001-blok | Readinesspositie en afbakening ten opzichte van certificering |
| `#continuiteit` | Periodieke herbeoordeling en onderhoud |

### Aanpak — `aanpak/index.html`

| Anker | Inhoud |
|---|---|
| `#principes` | Context, proportionaliteit en aantoonbaarheid |
| `#werkwijze` | Intake, inventarisatie, beoordeling en activatie |
| `#domeinen` | Zeven vaste beoordelingsdomeinen |
| `#bewijs` | Bestaat, toegewezen, werkt en aantoonbaar |
| `#resultaat` | Acties voor de eerste 30, 60 en 90 dagen |

### Voor wie — `voor-wie/index.html`

| Anker | Inhoud |
|---|---|
| `#signalen` | Commerciële, bestuurlijke, operationele en risicosignalen |
| `#sectoren` | Zes relevante sectoromgevingen |
| `#fit` | Sterke fit en situaties waarin een andere eerste stap beter is |
| `#vragen` | Vijf diagnostische vragen voor bezoekers |

### Kennismaking — `kennismaking/index.html`

| Onderdeel | Locatie |
|---|---|
| Introductie en verwachtingen | `.meeting-intro` |
| Gespreksonderwerpen | Eerste `.form-step` |
| Organisatievragen | Tweede `.form-step` |
| Contactgegevens | Derde `.form-step` |
| Formspree-endpoint | `data-endpoint` op het formulier |
| E-mailfallback | `mailto:meterwise@outlook.com` in `kennismaking.js` |

## Vormgeving en interactie aanpassen

- Globale kleuren, typografie, homepage en landingintro: `styles.css`.
- Gedeelde vormgeving van Diensten, Aanpak en Voor wie: `pages.css`.
- Scroll-, navigatie-, reveal- en landinglogica: `script.js`.
- Kennismakingspagina: `kennismaking/kennismaking.css` en `kennismaking/kennismaking.js`.

De belangrijkste globale variabelen staan bovenaan `styles.css`:

```css
:root {
  --orange: #FF4F18;
  --black: #00101F;
  --blue: #001D3F;
  --container: 1180px;
}
```

### Landinganimatie

De verticale startafstand van de twee logodelen staat in `.landing-stage`:

```css
--mark-top-offset: -96px;
--mark-bottom-offset: -28px;
```

Beide waarden zijn negatief, zodat beide delen uitsluitend recht omlaag bewegen. De mobiele afstanden staan in de mediaquery voor maximaal `640px`.

De cursorreactie staat alleen op `.landing-title`. JavaScript luistert uitsluitend naar pointerbeweging boven die titel en alleen bij een fijne muisaanwijzer.

## Formspree instellen

Vul in `kennismaking/index.html` het endpoint in:

```html
<form
  id="kennismaking-form"
  data-meeting-form
  data-endpoint="https://formspree.io/f/JOUW-ID"
>
```

Test daarna de ontvangst, spambeveiliging en privacytekst. Zonder endpoint blijft de e-mailfallback actief.

## Publiceren via GitHub Pages

1. Commit de gewijzigde bestanden op een featurebranch.
2. Push de branch naar GitHub.
3. Controleer de branch of open een pull request naar `main`.
4. Merge naar de branch die onder **Settings → Pages** als publicatiebron staat.
5. Laat de Pages-bron op `/ (root)` staan.

Controleer dat een bestaand `CNAME`-bestand behouden blijft. DNS-records voor e-mail (`MX`, `SPF`, `DKIM`, `DMARC`) staan los van de websitebestanden.

Aanbevolen workflow:

```text
feature branch → preview → pull request → merge → GitHub Pages
```

## Toegankelijkheid en performance

- Semantische navigatie, koppen, secties en formulieren.
- Skiplinks en zichtbare toetsenbordfocus.
- Mobiel menu met `aria-expanded` en Escape-ondersteuning.
- `prefers-reduced-motion` voor bezoekers die minder beweging kiezen.
- Geen cursorlisteners op touchapparaten.
- Decoratieve mobiele landinganimaties zijn beperkt.
- AVIF en WebP met PNG-fallback voor de hoofdbanner.
- Geen zware externe JavaScriptbibliotheek.

## Bewuste inhoudelijke grenzen

- Geen interne prijsbanden, verkooptargets of pilotquota.
- Geen fictieve cases, testimonials of resultaten.
- Geen garantie op ISO/IEC 42001-certificering.
- MeterWise wordt niet als certificerende instelling gepositioneerd.
- ISO/IEC 42001 is een managementsysteemkader en mogelijke readiness-route wanneer dat zakelijk relevant is.

## Contact

- Website: [meterwise.nl](https://meterwise.nl/)
- E-mail: [meterwise@outlook.com](mailto:meterwise@outlook.com)

© MeterWise. Alle rechten voorbehouden.
