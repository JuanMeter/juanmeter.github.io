# Meterwise website

Statische, responsieve bedrijfswebsite voor **Meterwise**. De website begint bij het herkenbare klantprobleem — groeiend Ai-gebruik zonder volledig overzicht — en positioneert de Ai Governance Scan als centrale eerste stap.

De publieke inhoud vertaalt het interne koersdocument naar een commerciële klantreis, zonder interne prijs- en verkoophypotheses, fictieve cases of certificeringsgaranties te publiceren.

## Paginastructuur

| Route | Functie |
|---|---|
| `/` | **Over Meterwise**: brede hoofdpagina met merkintro, kernpropositie, samenvattingen en doorverwijzingen |
| `/diensten/` | Verdieping van de QuickScan, Governance Scan, implementatie, ISO-readiness en continuïteit |
| `/aanpak/` | Werkwijze, zeven beoordelingsdomeinen, vier bewijsniveaus en 30/60/90-dagenroadmap |
| `/voor-wie/` | Koopsignalen, relevante sectoren, fitcriteria en een korte zelfcheck |
| `/ai-act/` | Praktische uitleg, actuele hoofdtijdlijn, eerste maatregelen en de relatie met ISO/IEC 42001 |
| `/contact/` | Rechtstreekse contactgegevens voor korte en concrete vragen |
| `/kennismaking/` | Afzonderlijke intake in drie stappen voor een inhoudelijke kennismaking |
| `/algemene-voorwaarden/` | Algemene voorwaarden voor zakelijke opdrachten en dienstverlening |
| `/privacyverklaring/` | Uitleg over persoonsgegevens, bewaartermijnen, beveiliging en privacyrechten |

De hoofdnavigatie is op alle inhoudspagina’s gelijk. “Over Meterwise” verwijst naar `/`, waardoor de hoofdpagina niet onnodig op een tweede URL wordt gedupliceerd.

## Belangrijkste functionaliteit

### Landingintro

- Schermvullende, futuristische merkintro met een bewegende 3D particle-grid.
- De grid vormt een vloeiend landschap dat continu naar de bezoeker beweegt en tijdens het scrollen subtiel versnelt.
- Witte, blauwe en oranje particles mengen de Meterwise-kleuren zonder de tekst te overheersen.
- Het MW-logo zweeft als een helder signaalpunt boven de horizon, met rustige dataringen en een zachte gloed.
- Er is geen cursorreactie op het logo, de particle-grid of de gloed.
- Alleen de tekst **“Intelligentie. Met controle.”** reageert subtiel op een fijne muisaanwijzer.
- Op mobiele apparaten worden minder punten en een lagere renderresolutie gebruikt voor een vloeiende ervaring.
- De technische prototype-labels zijn verwijderd; rechtsboven staan nu relevante vakgebieden.
- `prefers-reduced-motion` krijgt een statisch gerenderde particle-grid zonder doorlopende animaties.

### Algemene website

- Responsive sticky navigatie met mobiel menu.
- Duidelijke primaire en secundaire acties.
- Contact en kennismaking zijn twee afzonderlijke routes: direct mailen voor een korte vraag, een gestructureerde intake voor een organisatievraagstuk.
- Het hoofdvenster is een **Governance Snapshot**: een rustige, niet-bedienbare visualisatie van het Ai-landschap, de prioriteiten en de 30/60/90-dagenactieroute.
- De homepage bevat een herkenningsblok, een eenvoudige Ai Act-uitleg, drie redenen om nu te beginnen, een persoonlijk Meterwise-profiel en veelgestelde vragen.
- In het oprichtersblok staat de aangeleverde portretfoto van Juan Meter.
- De Ai Governance Scan is zichtbaar het kernproduct; QuickScan, implementatie en readiness zijn aanvullende routes.
- De aparte Ai Act-pagina verwijst voor actuele termijnen naar officiële bronnen van de Europese Commissie en Autoriteit Persoonsgegevens.
- Diensten, Aanpak, Voor wie en Ai Act hebben ieder een eigen kleurwereld en een eigen codegebouwde illustratie in de paginaheader.
- Scroll-progressindicator en terug-naar-bovenknop.
- Toegankelijke reveal-animaties met reduced-motionfallback.
- Unieke titels, descriptions en Open Graph-metadata per route.
- Frameworkvrij: HTML, CSS en vanilla JavaScript.

### Kennismakingsformulier

1. Keuze van gespreksonderwerp.
2. Organisatiegegevens en gewenste start.
3. Contactgegevens, toestemming en verzending.

Met een geldig Formspree-endpoint verzendt het formulier met JavaScript rechtstreeks vanaf de website. De bezoeker blijft op de pagina en ziet daar de laad-, fout- en successtatus. Zonder endpoint wordt niets verstuurd en verschijnt een duidelijke melding met een link naar de contactpagina; er wordt geen e-mailprogramma meer geopend.

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
│   ├── juan-meter.png
│   └── og-image.jpg
├── diensten/
│   └── index.html
├── aanpak/
│   └── index.html
├── voor-wie/
│   └── index.html
├── ai-act/
│   └── index.html
├── contact/
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
- [http://localhost:8000/contact/](http://localhost:8000/contact/)
- [http://localhost:8000/kennismaking/](http://localhost:8000/kennismaking/)

Gebruik bij voorkeur geen `file://`, omdat absolute routes dan niet hetzelfde werken als op GitHub Pages.

## Inhoud beheren

### Over Meterwise — `index.html`

| Onderdeel | HTML-locatie | Inhoud |
|---|---|---|
| Landingintro | `.landing-copy` | Merkregel, grote introductietekst en korte belofte |
| Hoofdpropositie | `section.hero` | Hoofdkop, uitleg, CTA’s en drie vertrouwenspunten |
| Governance Snapshot | `.governance-snapshot` | Statische uitleg van Ai-landschap, prioriteiten en 30/60/90-dagenactieroute |
| Herkenbare situaties | `#herkenbaar` | Zes signalen van Ai-gebruik zonder volledig overzicht of duidelijke afspraken |
| Waarom nu | `#waarom-nu` | Eenvoudige Ai Act-uitleg en drie redenen om tijdig te beginnen |
| Dienstenoverzicht | `#diensten` | Korte samenvatting van de drie belangrijkste routes |
| Aanpakoverzicht | `#aanpak` | Drie stappen: inzicht, beoordeling en inrichting |
| Risico en ISO | `.governance-context` | Zakelijke gevolgen van onbeheerst gebruik en de afbakening van ISO/IEC 42001 |
| Concrete output | `.scan-output` | Zes resultaten van de Governance Scan |
| Doelgroepenoverzicht | `#voor-wie` | Drie brede toepassingsomgevingen |
| Over Juan en Groningen | `#over-meterwise` | Oorsprong, werkwijze en vier kenmerken van de samenwerking |
| Veelgestelde vragen | `#veelgestelde-vragen` | Vier korte antwoorden over scan, Ai Act en ISO |
| Slot-CTA | `#contact` | Gescheiden knoppen naar direct contact en de kennismakingsintake |

De kaarten op de hoofdpagina zijn bewust compact. Verdiepende uitleg hoort op de subpagina’s.

### Diensten — `diensten/index.html`

| Anker | Inhoud |
|---|---|
| `#dienstenoverzicht` | Productlijn van oriënteren naar verankeren |
| `#quickscan` | Doel en opbrengst van de Ai QuickScan |
| `#governance-scan` | Kernproduct, belofte en concrete deliverables |
| `#implementatie` | Inrichting van rollen, beleid, processen en bewijs |
| ISO/IEC 42001-blok | Readinesspositie en afbakening ten opzichte van certificering |
| `#continuiteit` | Periodieke herbeoordeling en onderhoud |

### Ai Act — `ai-act/index.html`

| Anker | Inhoud |
|---|---|
| `#relevantie` | Rollen rond ontwikkelen, aanbieden en gebruiken van Ai |
| `#tijdlijn` | Hoofdmomenten vanaf augustus 2024 en genuanceerde verdere fasering |
| `#praktijk` | Zes maatregelen waarmee een organisatie direct kan beginnen |
| `#iso` | Verschil en samenhang tussen de Ai Act en ISO/IEC 42001 |
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

### Contact — `contact/index.html`

| Onderdeel | Locatie |
|---|---|
| Introductie en primaire mailknop | `.contact-copy` |
| Openbare contactgegevens | `.contact-card` |
| Verschil tussen contact en kennismaking | `.contact-route-grid` |
| Contact-e-mailadres | Alle links met `mailto:meterwise@outlook.com` |

### Kennismaking — `kennismaking/index.html`

| Onderdeel | Locatie |
|---|---|
| Introductie en verwachtingen | `.meeting-intro` |
| Gespreksonderwerpen | Eerste `.form-step` |
| Organisatievragen | Tweede `.form-step` |
| Contactgegevens | Derde `.form-step` |
| Formspree-endpoint | `data-endpoint` op het formulier |
| In-page verzending en statussen | `kennismaking/kennismaking.js` |

### Juridische pagina's

| Pagina | Inhoud en beheer |
|---|---|
| `algemene-voorwaarden/index.html` | De 22 artikelen met de zakelijke afspraken van Meterwise |
| `privacyverklaring/index.html` | De 18 onderdelen over gegevensverwerking, beveiliging, cookies en privacyrechten |
| `legal.css` | De gedeelde vormgeving van beide juridische pagina's |

De footer van iedere openbare pagina bevat afzonderlijke links naar **Algemene voorwaarden** en **Privacyverklaring**.

## Nog invullen en periodiek controleren

De juridische pagina's zijn gepubliceerd zonder zichtbare placeholders. Vul onderstaande gegevens aan zodra ze beschikbaar zijn en laat de teksten bij voorkeur juridisch controleren voordat Meterwise betaalde opdrachten aangaat.

- **KvK-nummer:** voeg dit in `algemene-voorwaarden/index.html` toe bij de definitie van Meterwise en in het contactblok onderaan. Voeg het ook toe onder **Wie is verantwoordelijk?** in `privacyverklaring/index.html`.
- **Btw-id:** voeg dit toe aan de contactblokken van beide juridische pagina's zodra het nummer bekend is.
- **Volledig vestigings- of postadres:** de pagina's vermelden nu alleen Appingedam, Nederland. Vervang of vul dit aan als een volledig zakelijk correspondentieadres gepubliceerd moet worden.
- **Leveranciers:** controleer de privacyverklaring wanneer hosting, e-mail, Formspree, cloudopslag, boekhouding, planning, analytics of andere verwerkers wijzigen. Benoem waar nodig de concrete leverancier en sluit een verwerkersovereenkomst.
- **Doorgifte buiten de EER:** controleer voor Formspree en toekomstige clouddiensten waar gegevens worden verwerkt en welke doorgiftewaarborgen gelden.
- **Cookies en analytics:** de huidige tekst gaat uit van functionele cookies en van toestemming wanneer later tracking wordt toegevoegd. Voeg een cookie-banner en apart cookiebeleid toe voordat niet-noodzakelijke tracking actief wordt.
- **Bewaartermijnen:** controleer of de genoemde termijnen van 2 en 5 jaar aansluiten op de uiteindelijke werkprocessen. Financiële administratie moet de toepasselijke fiscale bewaartermijn volgen.
- **Verzekering en aansprakelijkheid:** stem artikel 16 af op de daadwerkelijk afgesloten beroeps- en/of bedrijfsaansprakelijkheidsverzekering.
- **Versiedatum:** pas bij iedere inhoudelijke wijziging `Versie augustus 2026` op beide pagina's aan.
- **Periodieke controle:** beoordeel beide documenten minimaal jaarlijks en wanneer dienstverlening, leveranciers of wetgeving veranderen.

## Vormgeving en interactie aanpassen

- Globale kleuren, typografie, homepage en landingintro: `styles.css`.
- Gedeelde paginaonderdelen én de vier afzonderlijke visuele thema's van Diensten, Aanpak, Voor wie en Ai Act: `pages.css`.
- De bodyclasses `.page-diensten`, `.page-aanpak`, `.page-voor-wie` en `.page-ai-act` bepalen per pagina de kleurwereld, headerillustratie en thematische kaartaccenten.
- De codegebouwde illustraties staan onder `/* Distinct visual chapters */` in `pages.css`; ze gebruiken uitsluitend HTML en CSS en zijn dus vrij van stocklicenties.
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

De particle-grid wordt zonder externe bibliotheken getekend op het canvas `[data-landing-wave]`. De perspectiefprojectie, golfvorm, kleurmenging, snelheid en mobiele puntdichtheid staan in het landinggedeelte van `script.js`.

De visuele compositie van tekst, horizon en het logo-signaal staat onder `/* 2026-08-10: flowing particle-grid landing */` in `styles.css`. De mobiele aanpassingen staan daar direct onder in de mediaqueries voor `940px` en `640px`.

De cursorreactie blijft beperkt tot `.landing-title`. JavaScript luistert uitsluitend naar pointerbeweging boven die titel en alleen bij een fijne muisaanwijzer. De grid en het logo reageren niet op de cursor.

## Formspree instellen voor verzenden vanaf GitHub Pages

GitHub Pages levert alleen statische bestanden en kan zelf geen e-mail versturen. Formspree ontvangt de formuliergegevens en stuurt de melding door naar het gekoppelde e-mailadres, terwijl de bezoeker op `meterwise.nl` blijft.

1. Maak op [formspree.io](https://formspree.io/) een account aan.
2. Maak een nieuw formulier voor **Kennismakingsaanvragen Meterwise**.
3. Koppel en bevestig `meterwise@outlook.com` als notificatieadres.
4. Kopieer het endpoint dat lijkt op `https://formspree.io/f/abcxyzde`.
5. Vul dit endpoint in bij `data-endpoint` in `kennismaking/index.html`. De huidige website is gekoppeld aan formulier `xqpzaaag`:

```html
<form
  id="kennismaking-form"
  data-meeting-form
  data-endpoint="https://formspree.io/f/xqpzaaag"
>
```

6. Beperk in Formspree, indien gewenst, toegestane inzendingen tot `meterwise.nl` en `www.meterwise.nl`.
7. Publiceer de wijziging en verstuur zelf één volledige testaanvraag vanaf de live website.
8. Controleer zowel Outlook als het Formspree-dashboard en markeer de eerste melding zo nodig als vertrouwd.

Zet nooit het wachtwoord van Outlook, een mailserverwachtwoord of een geheime API-sleutel in HTML of JavaScript. Het Formspree-formulier-ID in het endpoint mag wel publiek in de pagina staan.

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
- De oprichtersfoto gebruikt het originele, door Juan aangeleverde PNG-bestand uit `assets/juan-meter.png`.
- De nieuwe paginaillustraties zijn origineel en codegebouwd; er zijn geen externe stockfoto's of illustraties toegevoegd.
- Geen zware externe JavaScriptbibliotheek.

## Bewuste inhoudelijke grenzen

- Geen interne prijsbanden, verkooptargets of pilotquota.
- Geen fictieve cases, testimonials of resultaten.
- Geen garantie op ISO/IEC 42001-certificering.
- Meterwise wordt niet als certificerende instelling gepositioneerd.
- ISO/IEC 42001 is een managementsysteemkader en mogelijke readiness-route wanneer dat zakelijk relevant is.
- De Ai Act-pagina biedt praktische oriëntatie en is expliciet geen juridisch advies.
- Wettelijke termijnen worden alleen met links naar officiële bronnen gepubliceerd en moeten periodiek opnieuw worden gecontroleerd.

## Contact

- Website: [meterwise.nl](https://meterwise.nl/)
- E-mail: [meterwise@outlook.com](mailto:meterwise@outlook.com)

© Meterwise. Alle rechten voorbehouden.
