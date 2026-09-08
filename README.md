# CookPOP

App web a file singolo (`index.html`) per la pianificazione settimanale dei pasti.
Nessuna build: si apre e basta. Online su https://phoenis.github.io/CookPOP/

## Come funziona

Dati e logica vivono in `app.js` (un oggetto `DATA` incorporato come JSON
compatto in cima al file, più tutta la logica dell'app), lo stile in
`style.css`, `index.html` li carica entrambi:
- Un oggetto `DATA` con **237 ricette** (vedi `DATA.recipeDetails`): la
  maggior parte "curate" con ingredienti reali, procedimento, tempi e (dove
  trovato) link alla fonte; 48 importate più di recente hanno ingredienti e
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

### Spazi multipli

Più nuclei familiari possono usare lo stesso CookPOP senza vedere i dati
personali gli uni degli altri, ma condividendo la stessa curatela di
ricette/ingredienti. Login sempre email/password Firebase Auth "finti" (email
che contiene solo un nome, password a scelta — non servono account reali):
l'email determina lo **spazio** (vedi `SPACE_ROUTES` in `app.js`), che a sua
volta determina il percorso Firebase per i dati personali:

- `mara`/`ste` → spazio `default` → percorso `quaderno-state` (quello di
  sempre, mai rinominato/spostato)
- `cugina` → spazio `cugina` → percorso `spaces/cugina/state`
- `mamma` → spazio `mamma` → percorso `spaces/mamma/state`

Condiviso da **tutti** gli spazi, su un percorso a sé (`catalog-state`,
`CATALOG_STATE_PATH` in app.js): ricette aggiunte/modificate/nascoste,
ingredienti delle ricette, sinonimi ingredienti (`ingredientRenames`), gruppi
Dispensa (`pantryGroups`, es. "Pasta corta") — vedi `CATALOG_FIELDS`. Tutto il
resto (dispensa reale, menù della settimana, spesa, chi cucina, colori
profilo, note personali su un ingrediente) resta nel percorso personale dello
spazio, isolato dagli altri.

**Aggiungere un nuovo spazio**: (1) in Firebase Console → Authentication,
crea un nuovo utente email/password con un'email che contiene il nome dello
spazio (es. `zia@qualcosa.it`); (2) aggiungi una riga a `SPACE_ROUTES` in
`app.js` (`{ id: 'zia', match: ['zia'], path: 'spaces/zia/state' }`); (3)
aggiorna le regole del Realtime Database (vedi sotto) se non coprono già
`spaces/*` in generale.

**Regole del Realtime Database**: devono permettere lettura/scrittura (a
qualunque utente autenticato, stesso livello di sicurezza "finto" del login)
sia sul percorso storico `quaderno-state`, sia su `catalog-state`, sia su
tutto l'albero `spaces` — tre blocchi allo stesso livello, con le stesse
regole che ha oggi `quaderno-state`, es.:
```json
{
  "rules": {
    "quaderno-state": { ".read": "auth != null", ".write": "auth != null" },
    "catalog-state":  { ".read": "auth != null", ".write": "auth != null" },
    "spaces":         { ".read": "auth != null", ".write": "auth != null" }
  }
}
```
(adatta la condizione `auth != null` a quella che le regole attuali usano già
per `quaderno-state`, se diversa — l'importante è che `catalog-state` e
`spaces` abbiano la stessa).

Il primo avvio in assoluto con `catalog-state` ancora vuoto copia lì dentro
la curatela già presente nello spazio `default` (se c'è), una volta sola —
vedi il commento nel blocco `if(route.id === 'default')` di `loadState()` in
app.js. Gli spazi nuovi la trovano quindi già pronta, senza doverla rifare.

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
  `app.js` (`DATA`), byte-per-byte identico al JSON che segue `const DATA = `
  sulla prima riga del file. È il file da modificare se aggiorni le ricette:
  poi va reiniettato in `app.js` sostituendo quella riga.

## Curatela delle ricette

La maggior parte delle ricette ha ormai `recipeDetails` completo (ingredienti
precisi, procedimento, tempo esatto, e link alla fonte dove trovato). Fanno
eccezione 48 ricette importate da un CSV categorizzato dall'utente (settembre
2026): hanno ingredienti e metadati (categoria, tempo, stagioni, tipologia,
ecc.) ma `procedimento: []` vuoto — vanno curate una per una seguendo il
processo qui sotto prima di considerarle complete.

Per curare o correggere una ricetta: cerca fonti italiane affidabili (2-3),
scrivi ingredienti/procedimento con parole proprie (mai copiare testo, per
diritto d'autore), aggiorna la entry in `DATA.recipeDetails` nello stesso
formato delle altre, e allinea `DATA.recipeIngredientsInitial` per quella
ricetta. Poi rigenera `app.js` sostituendo la prima riga (`const DATA = {...}`)
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
