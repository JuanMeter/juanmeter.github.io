# Meterwise website

Statische, responsieve bedrijfswebsite voor **Meterwise**. De website begint bij het herkenbare klantprobleem — groeiend AI-gebruik zonder volledig overzicht — en presenteert drie duidelijke productroutes: AI QuickScan, AI Governance Scan en AI Governance Program.

Deze repository bevat uitsluitend bestanden die nodig zijn om de publieke website te tonen. Interne koersdocumenten, prijsinformatie en verkoophypotheses horen niet in deze repository.

## Paginastructuur

| Route | Functie |
|---|---|
| `/` | **Over Meterwise**: brede hoofdpagina met merkintro, kernpropositie, samenvattingen en doorverwijzingen |
| `/diensten/` | SaaS-achtige productpagina voor de AI QuickScan, AI Governance Scan en het AI Governance Program |
| `/aanpak/` | Werkwijze, zeven beoordelingsdomeinen, vier bewijsniveaus en 30/60/90-dagenroadmap |
| `/voor-wie/` | Scrollgestuurde ruimtereis met koopsignalen, relevante omgevingen, fitcriteria en een zelfcheck |
| `/ai-act/` | Praktische uitleg, actuele hoofdtijdlijn, eerste maatregelen en de relatie met ISO/IEC 42001 |
| `/contact/` | Rechtstreekse contactgegevens voor korte en concrete vragen |
| `/kennismaking/` | Afzonderlijke intake in drie stappen voor een inhoudelijke kennismaking |
| `/algemene-voorwaarden/` | Algemene voorwaarden voor zakelijke opdrachten en dienstverlening |
| `/privacyverklaring/` | Uitleg over persoonsgegevens, bewaartermijnen, beveiliging en privacyrechten |

De hoofdnavigatie is op alle inhoudspagina’s gelijk. “Over Meterwise” verwijst naar `/`, waardoor de hoofdpagina niet onnodig op een tweede URL wordt gedupliceerd.

## Belangrijkste functionaliteit

### Landingintro

- Schermvullende ruimtecompositie met een vrijstaande aarde en een afzonderlijk maanoppervlak.
- Tijdens het scrollen verschuift het perspectief in één beweging van de aarde naar het maanlandschap.
- De volledige tekstcompositie reageert subtiel op een fijne muisaanwijzer; op touchapparaten blijft deze stil.
- `prefers-reduced-motion` beperkt de beweging zonder de inhoud of leesbaarheid te veranderen.

### Algemene website

- Responsive sticky navigatie met mobiel menu.
- Duidelijke primaire en secundaire acties.
- Contact en kennismaking zijn twee afzonderlijke routes: direct mailen voor een korte vraag, een gestructureerde intake voor een organisatievraagstuk.
- Het hoofdvenster is een kosmische merkvisual met fotorealistische steenfragmenten. Tijdens het scrollen komen de losse delen samen als visuele metafoor voor richting en samenhang.
- De homepage bevat een herkenningsblok, een eenvoudige AI Act-uitleg, drie redenen om nu te beginnen, een persoonlijk Meterwise-profiel en veelgestelde vragen.
- In het oprichtersblok staat de aangeleverde portretfoto van Juan Meter.
- De productlijn bestaat uit de AI QuickScan en AI Governance Scan als vaste pakketten en het AI Governance Program als maatwerkroute.
- De aparte AI Act-pagina verwijst voor actuele termijnen naar officiële bronnen van de Europese Commissie en Autoriteit Persoonsgegevens.
- Diensten, Aanpak, Voor wie en AI Act hebben ieder een eigen kleurwereld en een infographic met een lokale volle-bleed SVG-achtergrond.
- Scroll-progressindicator en terug-naar-bovenknop.
- Toegankelijke reveal-animaties met reduced-motionfallback.
- Unieke titels, descriptions en Open Graph-metadata per route.
- Frameworkvrij: HTML, CSS en vanilla JavaScript.

### Kennismakingsformulier

1. Keuze van gespreksonderwerp.
2. Organisatiegegevens en gewenste start.
3. Contactgegevens, toestemming en verzending.

Met een geldig Formspree-endpoint verzendt het formulier met JavaScript rechtstreeks vanaf de website. De bezoeker blijft op de pagina en ziet daar de laad-, fout- en successtatus. Zonder endpoint wordt niets verstuurd en verschijnt een duidelijke melding met een link naar de contactpagina; er wordt geen e-mailprogramma meer geopend.

CTA's kunnen het gespreksonderwerp vooraf selecteren met `?onderwerp=quickscan`, `governance-scan` of `governance-program`. De oude parameters `implementatie` en `iso-readiness` blijven technisch als doorverwijzing naar het AI Governance Program werken.

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
│   ├── juan-meter.png
│   ├── og-image.jpg
│   ├── landing-space/
│   ├── cosmic/
│   ├── cosmic-panels/
│   └── footer-space/
├── diensten/
│   ├── index.html
│   └── diensten.css
├── aanpak/
│   ├── index.html
│   ├── aanpak.css
│   └── aanpak.js
├── voor-wie/
│   ├── index.html
│   ├── voor-wie.css
│   └── voor-wie.js
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
| Kosmische merkvisual | `[data-cosmic-assembly]` | Fotorealistische steenfragmenten die tijdens het scrollen samenkomen rond een heldere koers |
| Herkenbare situaties | `#herkenbaar` | Zes signalen van AI-gebruik zonder volledig overzicht of duidelijke afspraken |
| Waarom nu | `#waarom-nu` | Eenvoudige AI Act-uitleg en drie redenen om tijdig te beginnen |
| Dienstenoverzicht | `#diensten` | Korte samenvatting van de drie belangrijkste routes |
| Aanpakoverzicht | `#aanpak` | Drie stappen: inzicht, beoordeling en inrichting |
| Risico en ISO | `.governance-context` | Zakelijke gevolgen van onbeheerst gebruik en de afbakening van ISO/IEC 42001 |
| Concrete output | `.scan-output` | Zes resultaten van de Governance Scan |
| Doelgroepenoverzicht | `#voor-wie` | Drie brede toepassingsomgevingen |
| Over Juan en Groningen | `#over-meterwise` | Oorsprong, werkwijze en vier kenmerken van de samenwerking |
| Veelgestelde vragen | `#veelgestelde-vragen` | Vier korte antwoorden over scan, AI Act en ISO |
| Slot-CTA | `#contact` | Gescheiden knoppen naar direct contact en de kennismakingsintake |

De kaarten op de hoofdpagina zijn bewust compact. Verdiepende uitleg hoort op de subpagina’s.

### Diensten — `diensten/index.html`

| Anker | Inhoud |
|---|---|
| `#quickscan` | Doel en opbrengst van de AI QuickScan |
| `#governance-scan` | Doel en positionering van de AI Governance Scan |
| `#governance-program` | Maatwerkroute voor inrichting en structurele verankering |
| `.product-path` | Visuele route van oriënteren naar verankeren |
| `.product-compare` | Compacte vergelijking van vorm en beste startpunt |

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

De Aanpak-pagina is vormgegeven als een lichte **evidence blueprint**. De hero visualiseert de route van scope naar aantoonbare beheersing, de vier fasen vormen een scrollgestuurde werkroute en de roadmap bouwt visueel op van 30 naar 90 dagen. Alle teksten blijven rechtstreeks in `aanpak/index.html` aanpasbaar. De paginaspecifieke vormgeving staat in `aanpak/aanpak.css`; de subtiele schema-, proces- en roadmapinteractie staat in `aanpak/aanpak.js`.

### Voor wie — `voor-wie/index.html`

| Anker | Inhoud |
|---|---|
| `#signalen` | Commerciële, bestuurlijke, operationele en risicosignalen |
| `#sectoren` | Zes relevante sectoromgevingen |
| `#fit` | Sterke fit en situaties waarin een andere eerste stap beter is |
| `#vragen` | Vijf diagnostische vragen voor bezoekers |
| `#advies` | Afsluitend eerlijk eerste advies en twee contactroutes |

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
- De ronde CTA's gebruiken de oorspronkelijke, compacte knopstijl. De globale varianten staan bij `.button`, `.nav-cta` en `.back-to-top` in `styles.css`; de formulierknoppen staan bij `.button` in `kennismaking/kennismaking.css`.
- Gedeelde paginaonderdelen en de basisthema's van de subpagina's: `pages.css`.
- De dienstenpagina gebruikt aanvullend `diensten/diensten.css`; de lichte evidence-blueprint van Aanpak staat in `aanpak/aanpak.css`; de scrollende Voor wie-ervaring staat in `voor-wie/voor-wie.css`.
- De procesvoortgang, actieve hoofdstukken en subtiele blueprintinteractie op Aanpak worden lokaal aangestuurd door `aanpak/aanpak.js`.
- De vloeiende vorm en scrollgestuurde hoofdstukwisselingen van Voor wie worden lokaal getekend door `voor-wie/voor-wie.js`; er wordt geen externe video geladen.
- De bodyclasses `.page-diensten`, `.page-aanpak`, `.page-voor-wie` en `.page-ai-act` blijven de pagina's afbakenen voor gerichte stijlen.
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

De landing gebruikt drie losse beeldlagen uit `assets/landing-space/`: een uitgesneden aarde, een mobiele maanlaag en een grotere maanlaag voor brede schermen. De scrollvoortgang wordt in `script.js` vertaald naar schaal, positie en transparantie, zodat de overgang als één camerabeweging aanvoelt.

De tekst staat in `.landing-copy`. De cursorreactie geldt alleen bij een fijne muisaanwijzer; touchapparaten krijgen geen pointeranimatie.

### Kosmische merkvisual

De hero bevat een scrollgestuurde compositie met fotorealistische steenfragmenten. De HTML staat in `index.html` bij `[data-cosmic-assembly]`, de vormgeving onder `/* 2026-08-10: cosmic alignment hero */` en `/* 2026-08-10: layered cosmic slogan */` in `styles.css`, en de scrollberekening staat in `script.js` bij dezelfde selector. De grote slogan ligt bewust achter een deel van de stenen om visuele diepte te maken.

De transparante PNG-assets staan in `assets/cosmic/`:

- `rock-01-hd.png`: groot, onregelmatig hoofdfragment met extra microdetail;
- `rock-02-hd.png`: langwerpige, gelaagde steen met extra microdetail;
- `rock-03-hd.png`: hoekig fragment met diepe mineraalstructuur en extra microdetail.

Meerdere formaten en rotaties worden met dezelfde drie HD-beelden opgebouwd. De startbeweging van ieder fragment staat als `data-from-x`, `data-from-y`, `data-from-r`, `data-to-r` en `data-from-scale` direct op het betreffende `.cosmic-rock`-element. Zo kan de animatie worden aangepast zonder nieuwe beelden te maken. De slogan en ondersteunende regel staan in `.cosmic-slogan` en `.cosmic-caption` in `index.html`.

De browser ontvangt waar mogelijk de geoptimaliseerde `rock-01-hd.webp`, `rock-02-hd.webp` en `rock-03-hd.webp`. De HD-PNG's blijven als verliesvrije fallback beschikbaar. Dit houdt de zichtbare details hoog zonder de mobiele pagina onnodig met meerdere megabytes per afbeelding te belasten.

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
- De infographicpanelen gebruiken lokale SVG-assets uit `assets/cosmic-panels/`.
- De ruimtebeelden voor landing en footer worden lokaal geladen; er zijn tijdens het bezoeken geen externe beeldverzoeken nodig.
- Geen zware externe JavaScriptbibliotheek.

## Bewuste inhoudelijke grenzen

- Geen interne prijsbanden, verkooptargets of pilotquota.
- Geen fictieve cases, testimonials of resultaten.
- Geen garantie op ISO/IEC 42001-certificering.
- Meterwise wordt niet als certificerende instelling gepositioneerd.
- ISO/IEC 42001 blijft een relevant managementsysteemkader, maar wordt niet als afzonderlijk Meterwise-product gepresenteerd.
- De AI Act-pagina biedt praktische oriëntatie en is expliciet geen juridisch advies.
- Wettelijke termijnen worden alleen met links naar officiële bronnen gepubliceerd en moeten periodiek opnieuw worden gecontroleerd.

## Contact

- Website: [meterwise.nl](https://meterwise.nl/)
- E-mail: [meterwise@outlook.com](mailto:meterwise@outlook.com)

© Meterwise. Alle rechten voorbehouden.
