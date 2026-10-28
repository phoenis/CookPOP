# Portare le famiglie di prima su Firebase

Dopo questo passaggio le email non devono più contenere "mara", "cugina" o "mamma": chi è di quale famiglia sta nel database. I dati restano dove sono, non si spostano.

## Prima di cominciare
Copia gli **UID** dei 4 account: Firebase Console → Authentication → Utenti → colonna "UID utente" (Mara, Ste, cugina, mamma; più l'account di Google Home, se lo usi).

## 1. Carica i dati delle famiglie
1. Apri `families.json` e `userFamily.json` (in questa cartella) e sostituisci `UID_MARA`, `UID_STE`, `UID_CUGINA`, `UID_MAMMA` con gli UID veri.
2. Console → Realtime Database → Dati. Se non esiste, crea il nodo `families`: sul suo menù ⋮ scegli **Importa JSON** e carica `families.json`.
3. Stessa cosa per il nodo `userFamily` con `userFamily.json`.

(Importare su un nodo lo sostituisce: fallo prima di creare famiglie nuove, oppure aggiungi a mano le voci.)

Se usi Google Home, aggiungi l'UID del suo account sotto `families/default/members/<uid>` con `{ "name": "Google Home" }` e `userFamily/<uid>` = `default`.

## 2. Controlla
Aggiorna l'app (versione con le famiglie di prima nel sistema nuovo) e accedi con ogni account: devi vedere gli stessi dati di prima. Un account senza nome nell'email funziona comunque, perché la famiglia arriva da `userFamily`.

## 3. Pubblica le regole
Solo dopo il punto 2: incolla `database.rules.json` in Console → Realtime Database → Regole e pubblica. Non servono più le email: l'accesso ai dati delle famiglie di prima dipende da `families/<id>/members`.
Prova prima nel **Playground** (account Mara su `quaderno-state`: consentito; un account nuovo: negato).

## 4. Inviti e nuove persone
Da Impostazioni → Persone, in ogni famiglia, "Invita una persona con un codice". Per una famiglia nuova serve un codice in `creationCodes` (valore `true`).
