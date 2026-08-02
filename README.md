# Meterwise website

Statische, responsieve bedrijfswebsite voor **Meterwise**. De website begint bij het herkenbare klantprobleem — groeiend AI-gebruik zonder volledig overzicht — en positioneert de AI Governance Scan als centrale eerste stap.

De publieke inhoud vertaalt het interne koersdocument naar een commerciële klantreis, zonder interne prijs- en verkoophypotheses, fictieve cases of certificeringsgaranties te publiceren.

## Paginastructuur

| Route | Functie |
|---|---|
| `/` | **Over Meterwise**: brede hoofdpagina met merkintro, kernpropositie, samenvattingen en doorverwijzingen |
| `/diensten/` | Verdieping van de QuickScan, Governance Scan, implementatie, ISO-readiness en continuïteit |
| `/aanpak/` | Werkwijze, zeven beoordelingsdomeinen, vier bewijsniveaus en 30/60/90-dagenroadmap |
| `/voor-wie/` | Koopsignalen, relevante sectoren, fitcriteria en een korte zelfcheck |
| `/ai-act/` | Praktische uitleg, actuele hoofdtijdlijn, eerste maatregelen en de relatie met ISO/IEC 42001 |
| `/kennismaking/` | Interactief formulier in drie stappen voor een vrijblijvende kennismaking |

De hoofdnavigatie is op alle inhoudspagina’s gelijk. “Over Meterwise” verwijst naar `/`, waardoor de hoofdpagina niet onnodig op een tweede URL wordt gedupliceerd.

## Belangrijkste functionaliteit

### Landingintro

- Schermvullende zwarte merkintro.
- De twee verticale logodelen staan vanaf het begin rechts van de tekst en sluiten tijdens het scrollen recht omlaag.
- Er is geen cursorreactie meer op het logo, de achtergrondscène of de gloed.
- Alleen de tekst **“Intelligentie. Met controle.”** reageert subtiel op een fijne muisaanwijzer.
- Op touchapparaten worden de zwaarste decoratieve animaties uitgeschakeld.
- De oogvormen en korte sluitlijn verschijnen wanneer het MW-logo compleet is.
- De technische prototype-labels zijn verwijderd; rechtsboven staan nu relevante vakgebieden.
- `prefers-reduced-motion` krijgt een rustige, volledig gevormde variant.

### Algemene website

- Responsive sticky navigatie met mobiel menu.
- Duidelijke primaire en secundaire acties.
- Het hoofdvenster heet **AI Governance Pulse** en toont de actuele datum, een wisselende governancefocus en drie controleerbare servicemetrics.
- De homepage bevat een herkenningsblok, een eenvoudige AI Act-uitleg, drie redenen om nu te beginnen, een persoonlijk Meterwise-profiel en veelgestelde vragen.
- De AI Governance Scan is zichtbaar het kernproduct; QuickScan, implementatie en readiness zijn aanvullende routes.
- De aparte AI Act-pagina verwijst voor actuele termijnen naar officiële bronnen van de Europese Commissie en Autoriteit Persoonsgegevens.
- Scroll-progressindicator en terug-naar-bovenknop.
- Toegankelijke reveal-animaties met reduced-motionfallback.
- Unieke titels, descriptions en Open Graph-metadata per route.
- Frameworkvrij: HTML, CSS en vanilla JavaScript.

### Kennismakingsformulier

1. Keuze van gespreksonderwerp.
2. Organisatiegegevens en gewenste start.
3. Contactgegevens, toestemming en verzending.

Zonder externe formulierdienst opent de website een voorbereide e-mail aan `meterwise@outlook.com`. Met een geldig Formspree-endpoint kan het formulier rechtstreeks verzenden.

CTA's kunnen het gespreksonderwerp vooraf selecteren met `?onderwerp=governance-scan`, `quickscan`, `implementatie` of `iso-readiness`.

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
│   ├── meterwise-banner.png
│   └── og-image.jpg
├── diensten/
│   └── index.html
├── aanpak/
│   └── index.html
├── voor-wie/
│   └── index.html
├── ai-act/
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
- [http://localhost:8000/ai-act/](http://localhost:8000/ai-act/)
- [http://localhost:8000/kennismaking/](http://localhost:8000/kennismaking/)

Gebruik bij voorkeur geen `file://`, omdat absolute routes dan niet hetzelfde werken als op GitHub Pages.

## Inhoud beheren

### Over Meterwise — `index.html`

| Onderdeel | HTML-locatie | Inhoud |
|---|---|---|
| Landingintro | `.landing-copy` | Merkregel, grote introductietekst en korte belofte |
| Hoofdpropositie | `section.hero` | Hoofdkop, uitleg, CTA’s en drie vertrouwenspunten |
| AI Governance Pulse | `.hero-card` | Actuele datum, wisselende governancefocus, 10 werkdagen, 7 domeinen en 90-dagenactieroute |
| Herkenbare situaties | `#herkenbaar` | Zes signalen van AI-gebruik zonder volledig overzicht of duidelijke afspraken |
| Waarom nu | `#waarom-nu` | Eenvoudige AI Act-uitleg en drie redenen om tijdig te beginnen |
| Dienstenoverzicht | `#diensten` | Korte samenvatting van de drie belangrijkste routes |
| Aanpakoverzicht | `#aanpak` | Drie stappen: inzicht, beoordeling en inrichting |
| Risico en ISO | `.governance-context` | Zakelijke gevolgen van onbeheerst gebruik en de afbakening van ISO/IEC 42001 |
| Concrete output | `.scan-output` | Zes resultaten van de Governance Scan |
| Doelgroepenoverzicht | `#voor-wie` | Drie brede toepassingsomgevingen |
| Over Juan en Groningen | `#over-meterwise` | Oorsprong, werkwijze en vier kenmerken van de samenwerking |
| Veelgestelde vragen | `#veelgestelde-vragen` | Vier korte antwoorden over scan, AI Act en ISO |
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

### AI Act — `ai-act/index.html`

| Anker | Inhoud |
|---|---|
| `#relevantie` | Rollen rond ontwikkelen, aanbieden en gebruiken van AI |
| `#tijdlijn` | Hoofdmomenten vanaf augustus 2024 en genuanceerde verdere fasering |
| `#praktijk` | Zes maatregelen waarmee een organisatie direct kan beginnen |
| `#iso` | Verschil en samenhang tussen de AI Act en ISO/IEC 42001 |
| `#bronnen` | Officiële, actuele bronnen en juridische afbakening |

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
- De AI Act-pagina gebruikt eveneens `pages.css`; de bron- en tijdlijncomponenten staan onder `/* AI Act page */`.
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
- De hoofdbanner gebruikt uitsluitend de originele PNG uit de repository.
- Geen zware externe JavaScriptbibliotheek.

## Bewuste inhoudelijke grenzen

- Geen interne prijsbanden, verkooptargets of pilotquota.
- Geen fictieve cases, testimonials of resultaten.
- Geen garantie op ISO/IEC 42001-certificering.
- Meterwise wordt niet als certificerende instelling gepositioneerd.
- ISO/IEC 42001 is een managementsysteemkader en mogelijke readiness-route wanneer dat zakelijk relevant is.
- De AI Act-pagina biedt praktische oriëntatie en is expliciet geen juridisch advies.
- Wettelijke termijnen worden alleen met links naar officiële bronnen gepubliceerd en moeten periodiek opnieuw worden gecontroleerd.

## Contact

- Website: [meterwise.nl](https://meterwise.nl/)
- E-mail: [meterwise@outlook.com](mailto:meterwise@outlook.com)

© Meterwise. Alle rechten voorbehouden.
