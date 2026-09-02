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
  **Dispensa** — ognuna con icona + etichetta. Si cambia anche con swipe
  orizzontale sul contenuto, non solo toccando le icone.
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
- **Card di ogni giorno**: nome del giorno + data, pallino "chi cucina"
  (iniziale sola se chiuso, nome esteso se la card è aperta — tocco cicla
  nessuno→lei→lui→nessuno), icona categoria pasto. Sotto, nome ricetta
  (tocco = espande/comprime i dettagli), tempo di preparazione, ed
  eventuali badge di stato accanto al tempo — "Cucinata", "Cambiata",
  "Avanzo di [giorno]" — ognuno tocca-per-annullare (rispettivamente:
  torna da mangiare, torna alla ricetta originale, scollega dal giorno
  sorgente).
- **Card aperta** (tap sul nome ricetta): mostra tag categoria/tempo/
  stagione/freezer/avanzi/pianificazione, lista ingredienti con stato
  rispetto alla Dispensa (pallino colorato: in casa/poco/manca), bottone
  "Aggiungi N ingredienti mancanti" (li mette in Spesa), procedimento se
  disponibile, note, link alla fonte, bottone "Modifica ricetta" (apre la
  **modale Modifica ricetta**, condivisa con la tab Ricette — nome, tempo,
  categoria, freezer, avanzi, ingredienti e procedimento modificabili in
  linea, chiusura con Annulla/Salva).
- **Riga bottoni sotto la card**: "Mangiata"/"Da mangiare" (tocco = apre la
  **modale "Ricetta fatta!"** con lo stepper delle quantità rimaste in
  Dispensa per ogni ingrediente tracciato, da confermare — oppure segna
  diretto se il giorno è un "avanzo", niente da scalare due volte); "Cambia"
  (apre un pannello inline con ricerca ricette + suggerimenti contestuali,
  per sostituire la ricetta di quel giorno); "È avanzata" (apre un pannello
  con l'elenco dei giorni successivi, per collegare oggi come sorgente di
  avanzi di un giorno futuro); "È avanzo di" (stesso pannello ma con i
  giorni *precedenti*, per collegare un giorno già passato come sorgente —
  utile quando la sua card non è più visibile).
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
  logica ad accordion). I giorni già passati non compaiono più in questa
  vista.
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

- Barra filtri (categoria multi-selezione, tempo, pianificazione, stagione,
  avanzi, freezer, gradimento, attrezzatura, ricerca testo) dietro un
  bottone che apre la **modale Filtri**, con contatore dei filtri attivi.
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
  avanzata/È avanzo di), che si aprono *dentro* la card invece che sopra
  tutto lo schermo.
- **Colore identità**: ogni persona ha un colore scelto tra 8 preimpostati
  (pannello profilo), usato per il pallino "chi cucina" nel Menù.

---

## Elenco screenshot da fare

Per completare il pacchetto, cattura (idealmente su telefono, nella
risoluzione che usi davvero):

1. Menù — vista di default (settimana corrente, nessuna card aperta)
2. Menù — una card giorno aperta, con ricetta completa
3. Menù — banner "Oggi/Domani cucini tu" visibile
4. Menù — banner "Ieri hai mangiato X?" visibile
5. Menù — modale "Impostazioni generazione" aperta
6. Menù — modale "Ricetta fatta!" aperta
7. Menù — pannello "Cambia" o "È avanzata" aperto dentro una card
8. Menù — "Mostra giorni precedenti" espanso
9. Impostazioni (foglio) aperto, con pannello profilo
10. Spesa — vista "Per reparto", alcune sezioni aperte e altre chiuse
11. Spesa — vista "Per giorno"
12. Spesa — sezione "Finiti" aperta con una riga selezionata
13. Spesa — modale "Aggiungi ingrediente" con suggerimenti visibili
14. Ricette — elenco filtrato, con la modale Filtri aperta
15. Ricette — una card espansa con ingredienti/procedimento
16. Ricette — modale "Nuova ricetta"
17. Dispensa — vista "Per categoria"
18. Dispensa — vista "Per luogo"
19. Dispensa — modalità selezione attiva (icona-spunta + barra in fondo)
20. Dispensa — sezione "Finiti"
21. Dispensa — modale "Aggiungi ingrediente"
22. Login
