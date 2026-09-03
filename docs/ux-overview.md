# CookPOP — panoramica UX/UI

Documento preparato per una revisione UX/UI esterna. Descrive ogni schermata,
ogni modale (quando/come/perché si apre e si chiude) e i pattern di
interazione ricorrenti. Non contiene screenshot: in fondo c'è l'elenco di
cosa fotografare per completare il pacchetto da mandare in revisione.

## Cornice generale dell'app

- **Login**: schermata a schermo intero (email + password, via Firebase
  Auth) che blocca tutto finché non sei autenticata. Due soli account
  esistenti (una coppia). Se offline, l'app procede comunque con l'ultimo
  stato salvato in locale.
- **Barra in alto**: nome app a sinistra, icona ingranaggio a destra che
  apre il foglio Impostazioni (vedi sotto). Fissa in cima durante lo scroll.
- **Barra in basso**: 4 tab fisse — **Menù**, **Spesa**, **Ricette**,
  **Dispensa** — ognuna con icona + etichetta. Si cambia tab anche con swipe
  orizzontale sulla barra stessa (gesto solo touch). Lo swipe orizzontale sul
  *contenuto* della pagina è un gesto diverso: cambia la sotto-vista dove ce
  n'è una (Per reparto/Per giorno in Spesa, Per categoria/Per luogo in
  Dispensa) invece di cambiare tab — così i due gesti non si rubano a
  vicenda il tocco.
- **Foglio Impostazioni** (icona ingranaggio): scivola dall'alto/lato,
  contiene il pannello profilo (nome utente, prossimo turno di cucina,
  scelta del colore identità tra 8 preimpostati), il bottone "Aggiorna app"
  (ricarica ignorando la cache) e "Esci". Si chiude con la ✕ o toccando
  fuori dal foglio.

## Tab "Menù"

Schermata principale. Mostra la settimana corrente (sempre ancorata a
oggi→venerdì) più eventuali settimane extra aggiunte a mano, ognuna in una
propria sezione.

**In cima, solo se pertinenti** (spariscono da sole quando non serve):
- Banner "Ieri hai mangiato *ricetta*?" se il giorno prima aveva una
  ricetta mai segnata come cucinata — bottoni "Sì, segna" (apre lo stesso
  flusso di conferma della card, vedi sotto) o "No" (lo mette a tacere per
  quel giorno).
- Banner "Oggi/Domani cucini tu: *ricetta*" per l'utente loggato, se
  qualcuno ha assegnato quel turno — chiudibile con la ✕, resta chiuso per
  quel giorno.

**Ogni sezione settimana**:
- Titolo "Settimana del X-Y" (mesi abbreviati se il range attraversa due
  mesi diversi) con accanto un bottoncino a ingranaggio che apre la
  **modale Impostazioni generazione**: dentro, per ogni giorno della
  settimana una fila di 5 pallini colorati (tempo di preparazione
  crescente) da toccare per fissare il tetto di durata delle ricette che
  verranno generate quel giorno; in fondo un bottone Genera/Rigenera menù
  (etichetta diversa se è la settimana corrente o una extra) e, solo per le
  extra, "Elimina questa settimana". Si chiude con la ✕ o toccando fuori.
- Striscia orizzontale di pallini, uno per giorno della settimana intera
  (anche i giorni già passati, mostrati spenti/disabilitati): icona di
  categoria pasto, tocco = scorrimento automatico alla card di quel giorno.
- Bottone "Mostra/Nascondi giorni precedenti" (compare solo se ci sono
  giorni passati raggiungibili): rivela le card complete degli ultimi 3
  giorni prima di oggi, chiuse di default — servono per rimediare a uno
  scollegamento "avanzi" fatto per sbaglio.
- **Card di ogni giorno**: nome del giorno + data in cima, poi **due blocchi
  pasto separati, Pranzo e Cena** — ogni giorno prevede entrambi, non più
  una ricetta sola. Ogni blocco ha la sua etichetta ("Pranzo"/"Cena"), il
  suo pallino "chi cucina" (uno per pasto, non uno per giorno — iniziale
  sola se il blocco è chiuso, nome esteso se aperto, tocco cicla
  nessuno→lei→lui→nessuno) e la sua icona categoria.
- **Un pasto = ricetta principale + eventuali "ricette aggiunte"**: sotto il
  nome del principale (tocco = espande/comprime i dettagli), tempo di
  preparazione ed eventuali badge di stato — "Cucinata"/"Cucinato",
  "Cambiata"/"Cambiato", "Avanzo di [giorno]" — ognuno tocca-per-annullare
  (rispettivamente: torna da mangiare, torna alla ricetta originale,
  scollega dal pasto sorgente). Sotto, una riga di chip per le ricette
  aggiunte al pasto (tipicamente un contorno, ma può essere qualunque
  ricetta del catalogo — niente vincoli di tipologia): ogni chip si toglie
  con la ✕, più un bottone "+ ricetta" che apre un pannello di ricerca
  identico a "Cambia" per aggiungerne un'altra. Le ricette aggiunte sono
  **sempre modificabili a mano**, indipendentemente dal fatto che le abbia
  scelte il generatore automatico o l'utente — anche un pasto "avanzo" (vedi
  sotto) può avere un contorno tutto suo, fresco, che non fa parte
  dell'avanzo.
- **Pranzo lun-gio = avanzo automatico**: di default il pranzo dal lunedì al
  giovedì è collegato in automatico alla cena della sera prima (badge
  "Avanzo di [giorno]", stesso meccanismo di collegamento manuale "È
  avanzata"/"È avanzo di" descritto sotto) — ma resta un pasto come tutti
  gli altri, sostituibile a mano in qualsiasi momento con "Cambia" o
  scollegabile toccando la ✕ sul badge. Venerdì-domenica il pranzo è
  pianificato liberamente, come una cena qualunque.
- **Blocco pasto aperto** (tap sul nome della ricetta principale): mostra il
  dettaglio completo del principale — tag categoria/tempo/stagione/freezer/
  avanzi/pianificazione, lista ingredienti con stato rispetto alla Dispensa
  (pallino colorato: in casa/poco/manca), bottone "Aggiungi N ingredienti
  mancanti" (li mette in Spesa), procedimento se disponibile, note, link
  alla fonte, bottone "Modifica ricetta" (apre la **modale Modifica
  ricetta**, condivisa con la tab Ricette — nome, tempo, categoria, tipologia,
  freezer, avanzi, ingredienti e procedimento modificabili in linea, più
  "Elimina" per toglierla dal catalogo, chiusura con Annulla/Salva). Sotto
  quello del principale compare **un blocco identico, con lo stesso livello
  di dettaglio, per ciascuna ricetta aggiunta** (contorno o altro) — non solo
  i suoi ingredienti mescolati in un elenco unico, ma tag/procedimento/note/
  link propri, titolati col nome della ricetta. Uno stepper "Porzioni" in
  cima (visibile solo se le porzioni del principale sono un numero
  interpretabile) scala le quantità dell'intero pasto: 2 di base, 3 per le
  cene generate come "apripista" (quelle da cui nascerà l'avanzo del giorno
  dopo) — le ricette aggiunte si scalano di conseguenza, ciascuna rispetto
  alle proprie porzioni base.
- **Riga bottoni sotto il blocco pasto**: "Mangiata"/"Da mangiare" (tocco =
  apre la **modale "Ricetta fatta!"** con lo stepper delle quantità rimaste
  in Dispensa per ogni ingrediente tracciato del pasto — principale e
  ricette aggiunte insieme — da confermare, oppure segna diretto se il
  pasto è un "avanzo", niente da scalare due volte); "Cambia" (apre un
  pannello inline con ricerca ricette + suggerimenti contestuali, per
  sostituire il principale di quel pasto); "È avanzata" (apre un pannello
  con l'elenco dei pasti successivi, per collegare questo pasto come
  sorgente di avanzi di un pasto futuro); "È avanzo di" (stesso pannello ma
  con i pasti *precedenti*, per collegare un pasto già passato come
  sorgente — utile quando il suo blocco non è più visibile).
- **Trascinare per scambiare**: ogni blocco pasto ha una maniglia (⠿) per
  trascinarlo su un altro blocco e scambiare le due ricette — solo tra pasti
  dello stesso tipo (pranzo con pranzo, cena con cena).
- In fondo, "+ Aggiungi settimana" con il proprio ingranaggio impostazioni
  (stessa modale di cui sopra, ma senza il bottone Genera — qui usi il "+"
  stesso per creare la settimana).

## Tab "Spesa"

- Banner d'avviso se qualche ricetta pianificata non ha ancora ingredienti
  salvati (rimanda al Menù per completarla).
- **Selettore vista**: "Per reparto" (Carne, Frutta e verdura, ecc. in
  ordine alfabetico, poi Altro, poi Finiti — tutti accordion apri/chiudi,
  aperti di default) oppure "Per giorno" (una sezione per ogni pasto
  pianificato + "Ogni settimana" + "Aggiunti a mano" + "Finiti", stessa
  logica ad accordion). Il titolo di ogni sezione-pasto mostra il piatto per
  intero (principale + eventuali ricette aggiunte, es. "Bistecca +
  Finocchi"): gli ingredienti di tutte le ricette di quel pasto compaiono
  insieme, sotto lo stesso titolo. I giorni già passati non compaiono più in
  questa vista.
- Contatore "N / M presi", bottone "Espandi tutto"/"Comprimi tutto" (agisce
  su tutte le sezioni della vista corrente in un colpo) e "Svuota spunte"
  (deseleziona tutto, non fa ricomparire ciò che avevi eliminato).
- **Riga ingrediente**: checkbox "preso", nome + quantità/nota, stepper
  quantità (tap sul numero per editarlo a mano), cestino per eliminarlo
  dalla lista.
- Sezione **Finiti**: ingredienti a scorta 0 in Dispensa, popolata da sola.
  Selezionando una o più righe compaiono "Elimina" e "Segna da comprare"
  (quest'ultimo li fa uscire da qui e li mescola nel loro reparto vero,
  tra gli altri ingredienti normali).
- In basso, se hai spuntato qualcosa di "comprabile": "Elimina N spuntati"
  / "Sposta N in dispensa" (aggiunge alla Dispensa con la quantità
  impostata e li toglie dalla lista).
- **Bottone "+" flottante**: apre la **modale "Aggiungi ingrediente"** — un
  campo con suggerimenti in tempo reale (nomi già noti da Dispensa e da
  tutte le ricette) più un campo quantità libero. Se il nome scelto
  corrisponde a un ingrediente già a scorta 0, non duplica: riattiva quel
  record.

## Tab "Ricette" (Prep)

- Barra filtri (categoria multi-selezione, **tipologia/portata**
  multi-selezione — antipasto/primo/secondo/contorno/piatto unico,
  indipendente dalla categoria — tempo, pianificazione, stagione, avanzi,
  freezer, gradimento, attrezzatura, ricerca testo) dietro un bottone che
  apre la **modale Filtri**, con contatore dei filtri attivi.
- Elenco ricette come card compatte (nome, tempo, icona categoria); tap =
  espande la card con lo stesso dettaglio già descritto per il Menù
  (ingredienti, procedimento, note, modifica).
- **Bottone "+" flottante**: apre la **modale "Nuova ricetta"** — nome,
  categoria, tempo, e da lì si parte per compilarne i dettagli con lo
  stesso editor di "Modifica ricetta".

## Tab "Dispensa"

- Selettore vista: "Per categoria" o "Per luogo" (Dispensa, Ripostiglio,
  Frigo, Freezer, Giardino) — sezioni ad accordion come in Spesa, con
  "Espandi tutto"/"Comprimi tutto".
- **Riga ingrediente**: icona del luogo (tap = apre un piccolo selettore a
  icone per cambiarlo), nome (tap = rinomina in linea), stepper quantità,
  cestino.
- **Selezione multipla**: pressione lunga su una riga (non sullo stepper
  +/-, che resta sempre libero) entra in modalità selezione — l'icona del
  luogo di quella riga diventa un segno di spunta. Da lì, un tap semplice
  su altre righe le aggiunge/toglie dalla selezione. In fondo compare una
  barra con "Deseleziona tutto" e, se c'è almeno una riga scelta, "Segna
  da comprare" (manda tutto in Spesa — se un ingrediente è già a scorta 0
  riattiva il suo record, altrimenti lo aggiunge come "Aggiunto a mano").
- Sezione **Finiti** (accordion sempre in fondo, chiuso di default):
  ingredienti a scorta 0, mai cancellati automaticamente — restano lì
  pronti a essere riattivati quando li ricompri.
- **Bottone "+" flottante**: apre la **modale "Aggiungi ingrediente"** di
  Dispensa — nome, luogo, quantità/unità, flag "basilare" (se attivo,
  l'ingrediente parte spuntato in Spesa quando ne hai scorta, senza dover
  spuntarlo ogni settimana a mano).
- Tap su un ingrediente esistente apre la **modale Modifica ingrediente**
  (nome, categoria, luogo, quantità, unità).

## Pattern trasversali

- **Accordion**: usato ovunque per raggruppare liste lunghe (Spesa per
  reparto/giorno, Dispensa per luogo/categoria, "Finiti" in entrambe).
  Titolo di sezione tocca-per-aprire/chiudere, freccetta che ruota 180°.
  Stato ricordato per sezione finché resti nella stessa sessione.
- **Selezione multipla**: stesso gesto (pressione lunga poi tap) sia in
  Dispensa sia nella sezione Finiti di Spesa.
- **Modali**: quasi tutte seguono lo stesso schema — sfondo semitrasparente
  cliccabile per chiudere, intestazione con ✕, corpo scorrevole, footer con
  le azioni. Le uniche eccezioni sono i pannelli inline (Cambia/È
  avanzata/È avanzo di/+ ricetta), che si aprono *dentro* la card invece
  che sopra tutto lo schermo.
- **Swipe orizzontale**: due gesti distinti, solo touch, che non si rubano a
  vicenda il tocco. Sulla **barra in basso**: cambia tab (come in
  WhatsApp), soglia ~60px, tollerante a un po' di deriva verticale. Sul
  **contenuto** della pagina: cambia la sotto-vista dove ce n'è una (Per
  reparto ↔ Per giorno in Spesa, Per categoria ↔ Per luogo in Dispensa) —
  ignorato sopra campi di testo, stepper, la maniglia di trascinamento dei
  pasti e qualunque modale/pannello aperto, per non interferire con gesti
  che lì hanno già un significato loro.
- **Colore identità**: ogni persona ha un colore scelto tra 8 preimpostati
  (pannello profilo), usato per il pallino "chi cucina" nel Menù (uno per
  pasto).

---

## Elenco screenshot da fare

Per completare il pacchetto, cattura (idealmente su telefono, nella
risoluzione che usi davvero):

1. Menù — vista di default (settimana corrente, nessun blocco pasto aperto)
2. Menù — un giorno coi due blocchi Pranzo/Cena visibili, pranzo segnato
   "Avanzo di [giorno]"
3. Menù — un blocco pasto aperto, con ricetta principale completa
4. Menù — un blocco pasto con una ricetta aggiunta (contorno): chip +
   pulsante "+ ricetta", e il dettaglio del contorno espanso sotto quello
   del principale
5. Menù — banner "Oggi/Domani cucini tu" visibile
6. Menù — banner "Ieri hai mangiato X?" visibile
7. Menù — modale "Impostazioni generazione" aperta
8. Menù — modale "Ricetta fatta!" aperta (pasto con principale + contorno)
9. Menù — pannello "Cambia" o "È avanzata" aperto dentro un blocco pasto
10. Menù — "Mostra giorni precedenti" espanso
11. Impostazioni (foglio) aperto, con pannello profilo
12. Spesa — vista "Per reparto", alcune sezioni aperte e altre chiuse
13. Spesa — vista "Per giorno", una sezione-pasto con titolo "Principale +
    Contorno"
14. Spesa — sezione "Finiti" aperta con una riga selezionata
15. Spesa — modale "Aggiungi ingrediente" con suggerimenti visibili
16. Ricette — elenco filtrato, con la modale Filtri aperta (chip Tipologia
    visibili)
17. Ricette — una card espansa con ingredienti/procedimento
18. Ricette — modale "Nuova ricetta"
19. Ricette — modale "Modifica ricetta" con il bottone "Elimina" visibile
20. Dispensa — vista "Per categoria"
21. Dispensa — vista "Per luogo"
22. Dispensa — modalità selezione attiva (icona-spunta + barra in fondo)
23. Dispensa — sezione "Finiti"
24. Dispensa — modale "Aggiungi ingrediente"
25. Login
