/**
 * Ponte Google Home -> CookPOP per la lista della spesa.
 *
 * Flusso completo:
 *   1. Dici "Ok Google, aggiungi X alla lista della spesa".
 *   2. Un'automazione IFTTT (Google Assistant -> Google Sheets) scrive una
 *      riga nel foglio Google a cui questo script è collegato.
 *   3. Questo script, chiamato da un trigger installabile "On change" sul
 *      foglio, legge le righe nuove e le scrive in Firebase, nello stesso
 *      path (quaderno-state/shopExtras) che CookPOP già legge in tempo
 *      reale — quindi l'ingrediente compare in Spesa da solo, senza che
 *      l'app debba fare nulla di diverso da oggi.
 *
 * Setup — vedi il messaggio di chat per la procedura passo passo completa
 * (creazione del foglio, dell'applet IFTTT e del trigger). In breve:
 *   - Estensioni > Apps Script sul foglio, incolla questo file.
 *   - Impostazioni progetto > Proprietà script: aggiungi COOKPOP_EMAIL e
 *     COOKPOP_PASSWORD (uno dei due account di login di CookPOP).
 *   - Trigger (icona a orologio) > Aggiungi trigger: funzione
 *     syncNewRowsToCookPOP, origine "Dal foglio di lavoro", evento
 *     "Al momento della modifica".
 *   - La prima volta esegui la funzione manualmente dall'editor per
 *     autorizzare i permessi richiesti da Google.
 */

const COOKPOP_API_KEY = 'AIzaSyDVlyYgyJ1rTtyitMc3xoNhvBm3HPpC0g8';
const COOKPOP_DATABASE_URL = 'https://cookpop-c91d6-default-rtdb.europe-west1.firebasedatabase.app';

function syncNewRowsToCookPOP() {
  const props = PropertiesService.getScriptProperties();
  const email = props.getProperty('COOKPOP_EMAIL');
  const password = props.getProperty('COOKPOP_PASSWORD');
  if (!email || !password) {
    throw new Error('Manca COOKPOP_EMAIL o COOKPOP_PASSWORD nelle Proprietà script del progetto.');
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const lastRow = sheet.getLastRow();
  const lastProcessed = Number(props.getProperty('LAST_ROW_PROCESSED') || 0);
  if (lastRow <= lastProcessed) return; // niente di nuovo da sincronizzare

  const idToken = signIn_(email, password);

  // Colonna A = testo detto a Google Home (vedi come IFTTT scrive la riga:
  // il campo {{TextField}} va per primo nell'azione "Add row to spreadsheet").
  const values = sheet.getRange(lastProcessed + 1, 1, lastRow - lastProcessed, 1).getValues();
  values.forEach(function (row) {
    const text = (row[0] || '').toString().trim();
    if (!text) return;
    addToShoppingList_(text, idToken);
  });

  props.setProperty('LAST_ROW_PROCESSED', String(lastRow));
}

function signIn_(email, password) {
  const resp = UrlFetchApp.fetch(
    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + COOKPOP_API_KEY,
    {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({ email: email, password: password, returnSecureToken: true })
    }
  );
  return JSON.parse(resp.getContentText()).idToken;
}

function addToShoppingList_(ingrediente, idToken) {
  UrlFetchApp.fetch(
    COOKPOP_DATABASE_URL + '/quaderno-state/shopExtras.json?auth=' + idToken,
    {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({ ingrediente: ingrediente, qta: '' })
    }
  );
}
