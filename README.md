# CookPOP

App web a file singolo (`index.html`) per la pianificazione settimanale dei pasti.
Nessuna build: si apre e basta. Online su https://phoenis.github.io/CookPOP/

## Come funziona

Il catalogo ricette vive in `catalog.js` (una sola riga: `const DATA = {...}`
come JSON compatto), la logica dell'app in `app.js`, lo stile in `style.css`;
`index.html` li carica in quest'ordine (`catalog.js` prima di `app.js`). Tenere
il catalogo separato permette al browser di non riscaricarlo quando cambia
solo la logica: se modifichi `catalog.js` alza il suo `?v=` in `index.html`.
- Un oggetto `DATA` con **267 ricette** (vedi `DATA.recipeDetails`): la
  maggior parte "curate" con ingredienti reali, procedimento e tempi; tutte
  hanno un `link` a una ricetta di riferimento online; 48 importate più di recente hanno ingredienti e
  metadati completi ma `procedimento: []` ancora da scrivere (vedi Curatela
  delle ricette più sotto).
- Persistenza su Firebase Realtime Database, divisa su **due livelli** (vedi
  "Spazi multipli" più sotto): un percorso **condiviso** con la curatela del
  catalogo ricette/ingredienti, e un percorso **personale per spazio**
  (nucleo familiare) con dispensa/menù/spesa — chi apre la pagina con un
  account dello stesso spazio legge/scrive lo stesso stato personale, con
  aggiornamenti in tempo reale su tutti i dispositivi. La configurazione
  Firebase (progetto `cookpop-c91d6`) è incorporata in `app.js`. Se Firebase
  non è raggiungibile (rete assente), l'app resta funzionante in locale su
  `localStorage` come cache/fallback.

### Famiglie

Ogni famiglia ha dati propri e separati: dispensa, menù, spesa, chi cucina,
persone, **e anche il catalogo** (ricette aggiunte/modificate/nascoste,
ingredienti, gruppi) e le foto delle ricette.

- **Famiglie di prima** (`SPACE_ROUTES` in `app.js`): si riconoscono
  dall'email, che contiene un nome.
  - `mara`/`ste` → `quaderno-state` + catalogo `catalog-state` (mai spostati)
  - `cugina` → `spaces/cugina/state` + `spaces/cugina/catalog`
  - `mamma` → `spaces/mamma/state` + `spaces/mamma/catalog`
  `cugina` e `mamma` alla prima apertura partono da una copia del catalogo
  originale (`seedFromShared`), poi vanno per conto loro.
- **Famiglie nuove**: `families/<id>/{meta,members,state,catalog,photos}`.
  L'account dice a quale famiglia appartiene con `userFamily/<uid>`.
  Si parte dalle sole ricette di base.

**Creare un account**: nella schermata di accesso, "Non hai un account?
Creane uno" (email + password). Chi non è di una famiglia di prima vede
"La tua famiglia":
- **Ho un codice**: un codice invito (8 caratteri, monouso, si crea da
  Impostazioni → Persone → "Invita una persona con un codice") scritto in
  `invites/<codice>`;
- **Creo una famiglia**: serve un **codice di creazione**, che si inserisce a
  mano nella console Firebase: Realtime Database → `creationCodes` → aggiungi
  una chiave a piacere (es. `MARA2026`) con valore `true`. Si consuma al primo
  uso: ne serve uno per ogni famiglia nuova.

**Regole del Realtime Database**: il file `database.rules.json` contiene le
regole da incollare in Console → Realtime Database → Regole. Prima di
pubblicarle sostituisci `EMAIL_MARA`, `EMAIL_STE`, `EMAIL_CUGINA`,
`EMAIL_MAMMA` con le email esatte dei 4 account di prima (servono perché i loro
dati non hanno ancora un'appartenenza nel database, quindi si riconoscono
dall'email). Controlla con "Playground" che un account di prima legga ancora
`quaderno-state` e che un account nuovo no. Le famiglie nuove sono protette da
`families/<id>/members/<uid>`: solo chi è tra i membri legge e scrive.

L'integrazione Google Home (`scripts/google-home-shopping-sync.gs`) accede con
l'account che le assegni: deve essere uno di quelli di `EMAIL_MARA`/`EMAIL_STE`.

Le 4 tab dell'app: **Menù** (settimana corrente + generatore automatico),
**Spesa** (lista aggiornata in automatico in base al menù, per giorno o per
reparto), **Prep** (ricettario filtrabile per categoria/tempo/stagione/ecc.),
**Dispensa** (inventario + freezer).

## Aggiungere alla spesa dettando a Google Home

`scripts/google-home-shopping-sync.gs` collega Google Home alla lista della
spesa di CookPOP passando per un'automazione IFTTT e un foglio Google, senza
bisogno di un vero server: chi dice "Ok Google, aggiungi X alla lista della
spesa" lo vede comparire in Spesa come se l'avesse scritto a mano dall'app.
Il file spiega il collegamento nei commenti in testa; è indipendente dal
resto dell'app (non viene incorporato in `index.html`).

## File in `data/`

- `raw-xlsx-export.json` — estrazione grezza del foglio Excel originale
  ("Quaderno della cucina"), con tutte le 188 ricette e i loro campi originali
  (categoria, tempo, preparazione anticipata, freezer, avanzi, stagione).
  Usalo come fonte quando devi curare una nuova ricetta e vuoi sapere il nome
  esatto, la categoria originale ecc.
- `app-data-current.json` — lo stato completo attualmente incorporato in
  `catalog.js` (`DATA`), byte-per-byte identico al JSON che segue `const DATA = `
  nel file. È il file da modificare se aggiorni le ricette: poi va reiniettato
  in `catalog.js` sostituendo quella riga.

## Curatela delle ricette

La maggior parte delle ricette ha ormai `recipeDetails` completo (ingredienti
precisi, procedimento, tempo esatto e link alla fonte). Fanno
eccezione 48 ricette importate da un CSV categorizzato dall'utente (settembre
2026): hanno ingredienti e metadati (categoria, tempo, stagioni, tipologia,
ecc.) ma `procedimento: []` vuoto — vanno curate una per una seguendo il
processo qui sotto prima di considerarle complete.

Per curare o correggere una ricetta: cerca fonti italiane affidabili (2-3),
scrivi ingredienti/procedimento con parole proprie (mai copiare testo, per
diritto d'autore), aggiorna la entry in `DATA.recipeDetails` nello stesso
formato delle altre, e allinea `DATA.recipeIngredientsInitial` per quella
ricetta. Poi rigenera `catalog.js` sostituendo la sua riga (`const DATA = {...}`)
con il JSON aggiornato di `app-data-current.json`.

Ogni ingrediente va tenuto come voce separata in `ingredienti` — mai
raggruppato tipo `"Sale e pepe"` o `"Carota, sedano, cipolla"` — perché il
riconoscimento "ce l'ho in Dispensa" confronta i nomi esatti, e un ingrediente
combinato non trova mai corrispondenza. Va bene solo quando è davvero un solo
ingrediente usato in più modi (es. `"Limone (scorza e succo)"`) o una scelta
tra alternative (es. `"Filetti di pesce bianco (orata, branzino o simili)"`).

Per lo stesso motivo, usa un nome coerente con quello già usato altrove nel
catalogo invece di inventarne uno nuovo per dettagli di preparazione (es.
`"Pepe"` non `"Pepe nero"`, `"Prezzemolo"` non `"Prezzemolo fresco tritato"`):
il taglio/formato si scrive nella quantità o nel procedimento, non nel nome —
altrimenti la stessa cosa compare come due ingredienti diversi in Dispensa e
il confronto "ce l'ho" si rompe. Fanno eccezione i casi in cui il nome
descrive davvero un prodotto diverso da comprare (es. `"Ricotta"` vs
`"Ricotta salata"`, `"Farina"` vs `"Farina di ceci"`).

## Tassonomia dei filtri

Ogni ricetta ha, oltre ai campi originali del foglio:
- `categoriaNew`: una delle 9 — pasta, riso, carne, pesce, legumi, uova,
  verdure, forno, dolci
- `tipologia`: portata del pasto, indipendente da `categoriaNew` (una
  bistecca è "carne" come categoria ma "secondo" come tipologia) — antipasto,
  primo, secondo, contorno, unico (piatto unico), dolce. Il generatore
  automatico (`pickWeekRecipes`) sceglie il principale da tutto il catalogo
  tranne i dolci, e abbina un contorno solo quando il principale scelto è un
  "secondo"
- `tempoBucket`: express (≤20min), veloce (20-30), normale (30-45),
  lunga (45-90), progetto (>90)
- `pianificazione`: nessuna, ammollo, scongelamento, marinatura,
  impasto-lievitazione, prep-anticipata
- `stagioni`: array tra primavera/estate/autunno/inverno/tutto
- `freezerNew`: non-adatta, congelabile, meal-prep, base
- `avanziNew`: ottima, buona, meglio-fatta
- `gradimento`: ci-piace, ogni-tanto (dato scarsamente discriminante nel
  foglio originale — quasi tutto era ❤️)
- `attrezzatura`: array, popolato solo per le ricette curate

Queste classificazioni sono state derivate euristicamente dai dati originali
(vedi cronologia chat per la logica esatta); se aggiungi ricette nuove, segui
lo stesso schema per coerenza con i filtri esistenti.

## Note di stile già applicate (da rispettare se tocchi la UI)

- Font: Fraunces (titoli), Inter (corpo), JetBrains Mono (dati/etichette)
- Palette: verde scuro/fondo, carta chiara per le card, oro/senape come
  accento primario, tonalità acciaio per il freezer, grigio neutro per i tag
  tempo
- Icone categoria: 🍝 pasta, 🍚 riso, 🥩 carne, 🐟 pesce, 🫘 legumi, 🥚 uova,
  🥦 verdure, 🥧 forno, 🍰 dolci

## Test

`tests/run.js` apre l'app vera in Chromium headless (Playwright), con Firebase
bloccato, e controlla le parti più delicate: avvio senza errori, generatore
della settimana, pasti bloccati, passaggio automatico del sabato, patch di
sincronizzazione e migrazioni di uno stato vecchio.

    npm i -D playwright && npx playwright install chromium   # una volta
    node tests/run.js              # tutti
    node tests/run.js rollover     # solo quelli che contengono "rollover"

Le migrazioni una tantum dello stato stanno in `MIGRATIONS` (app.js), in
ordine: se ne aggiungi una, mettila in fondo con un flag nuovo.

## Offline e cache

`sw.js` è un service worker, registrato da `app.js`:
- la pagina va sempre prima in rete (se non risponde entro 4 s si usa la copia salvata);
- i file con `?v=` si servono dalla cache, e una versione nuova sostituisce la vecchia;
- Firebase non passa dal service worker.

Dopo la prima apertura l'app si apre anche senza rete, con i dati dell'ultima
sincronizzazione. Per pubblicare una modifica basta alzare il `?v=` del file in
`index.html`, come sempre. "Aggiorna app" resta l'azzeramento totale: cancella
cache e service worker e ricarica.
