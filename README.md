# Quaderno della Cucina — Mara & Ste

App web a file singolo (`index.html`) per la pianificazione settimanale dei pasti.
Nessuna build, nessuna dipendenza esterna: si apre e basta.

## Come funziona

Tutto — dati e logica — vive in `index.html`:
- Un oggetto `DATA` con 188 ricette (catalogo estratto da un file Excel originale),
  di cui **106 già "curate"** con ingredienti reali, procedimento, tempi e link
  (vedi `DATA.recipeDetails`).
- Persistenza lato utente tramite `window.storage` (menù della settimana, spesa
  spuntata, inventario freezer, ecc. — vive nel browser, non in questo repo).

Le 4 tab dell'app: **Menù** (settimana corrente + generatore automatico),
**Spesa** (lista aggiornata in automatico in base al menù, per giorno o per
reparto), **Prep** (ricettario filtrabile per categoria/tempo/stagione/ecc.),
**Dispensa** (inventario + freezer).

## File in `data/`

- `raw-xlsx-export.json` — estrazione grezza del foglio Excel originale
  ("Quaderno della cucina"), con tutte le 188 ricette e i loro campi originali
  (categoria, tempo, preparazione anticipata, freezer, avanzi, stagione).
  Usalo come fonte quando devi curare una nuova ricetta e vuoi sapere il nome
  esatto, la categoria originale ecc.
- `app-data-current.json` — lo stato completo attualmente incorporato in
  `index.html` (`DATA`). È il file da modificare se aggiorni le ricette:
  poi va reiniettato in `index.html` (vedi sotto).

## Cosa manca

**82 ricette su 188** non hanno ancora `recipeDetails` (ingredienti precisi,
procedimento, tempo esatto, link). Per queste, l'app mostra solo i metadati
del foglio originale e un avviso "ingredienti non ancora salvati" nella lista
della spesa.

Per completarne una: cerca la ricetta online (2-3 fonti italiane affidabili),
scrivi ingredienti/procedimento con parole proprie (mai copiare testo, per
diritto d'autore), aggiungi una entry a `DATA.recipeDetails` nello stesso
formato delle altre 106, e aggiorna `DATA.recipeIngredientsInitial` per quella
ricetta. Poi rigenera `index.html` sostituendo il blocco `const DATA = {...}`
con il JSON aggiornato.

## Tassonomia dei filtri

Ogni ricetta ha, oltre ai campi originali del foglio:
- `categoriaNew`: una delle 8 — pasta, riso, carne, pesce, legumi, uova,
  verdure, forno
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
  🥦 verdure, 🥧 forno
