// Ordinamento alfabetico italiano: un Intl.Collator riusato è molto più
// veloce di localeCompare(…,'it'), che ne ricrea uno a ogni confronto (nel
// Ricettario, ~2000 confronti a ogni render).
const IT_COLLATOR = new Intl.Collator('it');
const IT_COLLATOR_BASE = new Intl.Collator('it', { sensitivity:'base' });
const CAT_COLOR = {
  'pasta':'var(--sage)', 'riso':'var(--amber)', 'carne':'var(--tomato)', 'pesce':'var(--steel)',
  'legumi':'var(--gold-dark)', 'uova':'var(--amber)', 'verdure':'var(--green-mid)', 'forno':'var(--plum)',
  'dolci':'var(--plum)'
};
function catColor(cat){ return CAT_COLOR[cat] || 'var(--sage)'; }

const CAT_LABEL = {
  'pasta':'Pasta / primi', 'riso':'Riso / risotti / polenta / gnocchi', 'carne':'Carne', 'pesce':'Pesce',
  'legumi':'Legumi', 'uova':'Uova', 'verdure':'Verdure protagoniste / vegetariano', 'forno':'Piatti da forno / rustici / piatti unici',
  'dolci':'Dolci'
};
const CAT_ICON = {
  'pasta':'🍝', 'riso':'🍚', 'carne':'🥩', 'pesce':'🐟', 'legumi':'🫘', 'uova':'🥚', 'verdure':'🥦', 'forno':'🥧', 'dolci':'🍰'
};
function catIcon(cat){ return CAT_ICON[cat] || '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--bx" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M12 10h-2V3H8v7H6V3H4v8c0 1.654 1.346 3 3 3h1v7h2v-7h1c1.654 0 3-1.346 3-3V3h-2zm7-7h-1c-1.159 0-2 1.262-2 3v8h2v7h2V4a1 1 0 0 0-1-1"></path></svg>'; }
const CAT_ORDER = ['pasta','riso','carne','pesce','legumi','uova','verdure','forno','dolci'];

// Tipologia = portata del pasto (primo/secondo/contorno...), indipendente da
// Categoria (che è per ingrediente principale/tecnica): una bistecca è
// "carne" come categoria ma "secondo" come tipologia, e da sola non basta —
// serve un contorno abbinato. Le due classificazioni convivono, non si
// sovrappongono.
const TIPO_LABEL = { antipasto:'Antipasto', primo:'Primo', secondo:'Secondo', contorno:'Contorno', unico:'Piatto unico', dolce:'Dolce' };
const TIPO_ICON = { antipasto:'🥗', primo:'🍜', secondo:'🍖', contorno:'🥕', unico:'🍽️', dolce:'🍰' };
function tipoIcon(t){ return TIPO_ICON[t] || '🍴'; }
// "dolce" è un valore di tipologia valido come gli altri (compare nei filtri,
// nell'editor ricetta) ma pickWeekRecipes lo esclude a monte dal pool di
// candidati per il principale di un pasto — un dolce non deve mai poter
// finire scelto come piatto forte di pranzo/cena dal generatore automatico.
const TIPO_ORDER = ['antipasto','primo','secondo','contorno','unico','dolce'];

const MEAL_LABEL = { pranzo:'Pranzo', cena:'Cena' };

// Nomi delle 5 fasce di durata: usati ovunque (regole della settimana,
// editor ricetta, filtri) per coerenza — vedi anche tempoShortLabel() più
// sotto, che ne deriva la versione breve senza emoji per i punti dove non
// c'è spazio (etichetta accanto al titolo settimana, righe eccezioni...).
const TEMPO_LABEL = { 'express':'⚡ Sotto 20 min', 'veloce':'🟢 Circa 30 min', 'normale':'🟡 30–45 min', 'lunga':'🟠 1 h', 'progetto':'🔴 Oltre 1 h' };
function tempoShortLabel(key){
  return (TEMPO_LABEL[key] || '').replace(/^\S+\s*/, '').toLowerCase();
}
const TEMPO_ORDER = ['express','veloce','normale','lunga','progetto'];

const PIAN_LABEL = { 'nessuna':'Nessuna', 'ammollo':'Ammollo', 'scongelamento':'Scongelamento', 'marinatura':'Marinatura', 'impasto-lievitazione':'Impasto / lievitazione', 'prep-anticipata':'Preparazione anticipata' };
const PIAN_ORDER = ['nessuna','ammollo','scongelamento','marinatura','impasto-lievitazione','prep-anticipata'];

const STAGIONE_LABEL = { 'primavera':'🌸 Primavera', 'estate':'☀️ Estate', 'autunno':'🍂 Autunno', 'inverno':'❄️ Inverno', 'tutto':"🌍 Tutto l'anno" };
const STAGIONE_ORDER = ['primavera','estate','autunno','inverno','tutto'];

const AVANZI_LABEL = { 'ottima':'Ottima per il pranzo dopo', 'buona':'Buona il giorno dopo', 'meglio-fatta':'Meglio appena fatta' };
const AVANZI_ORDER = ['ottima','buona','meglio-fatta'];

const FREEZER_LABEL = { 'non-adatta':'❄️ Non adatta', 'congelabile':'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M227.65 149.14a12 12 0 0 1-8.79 14.51l-20.67 5.08l5.4 20.16a12 12 0 0 1-23.18 6.22l-7.29-27.2L140 148.78V187l20.48 20.48a12 12 0 0 1-17 17L128 209l-15.51 15.52a12 12 0 0 1-17-17L116 187v-38.22l-33.12 19.13l-7.29 27.2a12 12 0 0 1-23.18-6.22l5.4-20.16l-20.67-5.08a12 12 0 1 1 5.72-23.3l27.89 6.85L104 128l-33.25-19.2l-27.89 6.85A11.8 11.8 0 0 1 40 116a12 12 0 0 1-2.85-23.65l20.67-5.08l-5.4-20.16a12 12 0 0 1 23.18-6.22l7.29 27.2L116 107.21V69L95.52 48.48a12 12 0 0 1 17-17L128 47l15.51-15.52a12 12 0 1 1 17 17L140 69v38.24l33.12-19.12l7.29-27.2a12 12 0 0 1 23.18 6.22l-5.4 20.16l20.67 5.08A12 12 0 0 1 216 116a11.8 11.8 0 0 1-2.87-.35l-27.89-6.85L152 128l33.25 19.2l27.89-6.85a12 12 0 0 1 14.51 8.79"></path></svg> Si può congelare', 'meal-prep':'🍱 Meal prep', 'base':'🧱 Base congelabile' };
const FREEZER_ORDER = ['congelabile','meal-prep','base'];

const GRAD_LABEL = { 'preferita':'❤️ Preferita', 'ci-piace':'🙂 Ci piace', 'ogni-tanto':'😐 Ogni tanto', 'da-provare':'🧪 Da provare' };
const GRAD_ORDER = ['preferita','ci-piace','ogni-tanto','da-provare'];

const ATTREZZ_LABEL = { 'Padella':'Padella', 'Pentola':'Pentola', 'Forno':'Forno', 'Piastra':'Piastra', 'Moulinex':'Moulinex', 'Frullatore':'Frullatore', 'Fritto':'Fritto' };
const ATTREZZ_ORDER = ['Padella','Pentola','Forno','Piastra','Moulinex','Frullatore','Fritto'];

// 'avanzi' è sempre il primo reparto (vedi ordine sotto): non è mai
// indovinato da classifyDept (nessun ingrediente "è" avanzo per nome), lo
// assegna solo l'utente — dalla modale "Ricetta fatta!" o a mano da
// "Gestisci ingredienti". Come ogni reparto, la sezione compare in Dispensa/
// Spesa solo quando contiene almeno una voce (stesso filtro presenza già
// usato per tutti gli altri, vedi DEPT_ORDER.filter più sotto).
const DEPT_ORDER = ['avanzi', 'verdura','carne','pesce','latticini','uova','pane','legumi','base','dispensa','surgelati','bibite','altro','pulizia','igiene','cucina-casa','altro-casa','finiti'];
const DEPT_LABEL = { avanzi:'Avanzi', verdura:'Frutta e verdura', carne:'Carne', pesce:'Pesce', latticini:'Latticini e formaggi', uova:'Uova', pane:'Pane, pasta e farine', legumi:'Legumi e conserve', dispensa:'Dispensa e condimenti', surgelati:'Surgelati', base:'Base', bibite:'Bibite', finiti:'Finiti', altro:'Altro', pulizia:'Pulizia', igiene:'Igiene e cura', 'cucina-casa':'Cucina', 'altro-casa':'Altro' };
const DEPT_ICON = { avanzi:'🥡', verdura:'🥦', carne:'🥩', pesce:'🐟', latticini:'🧀', uova:'🥚', pane:'🍞', legumi:'🥫', dispensa:'🫙', surgelati:'❄️', base:'⚙️', bibite:'🥤', finiti:'🗑️', altro:'🛒', pulizia:'🧽', igiene:'🧴', 'cucina-casa':'🧻', 'altro-casa':'📦' };
// Categorie create dall'utente (state.customDepts, nel catalogo condiviso:
// { id: { label, icon } }, vedi "Gestisci categorie" in Dispensa): si
// aggiungono a quelle di base, prima di "Altro". DEPT_ORDER/LABEL/ICON sono
// aggiornati sul posto da applyCustomDepts (chiamata a ogni render), così
// tutto il codice che li usa vede anche quelle nuove.
const BASE_DEPT_ORDER = DEPT_ORDER.slice();
const BASE_DEPT_LABEL = Object.assign({}, DEPT_LABEL);
const BASE_DEPT_ICON = Object.assign({}, DEPT_ICON);
// Categorie "Casa" (non alimentari: detersivi, igiene, carta forno...): in
// Dispensa stanno nella vista Casa invece che in Cibo, in Spesa vengono dopo
// quelle alimentari, e i loro prodotti non compaiono tra i suggerimenti degli
// ingredienti di una ricetta. Quelle di base sono fisse; una categoria creata
// dall'utente è "Casa" se ha nonFood: true.
const BASE_NONFOOD_DEPTS = ['pulizia','igiene','cucina-casa','altro-casa'];
function isNonFoodDept(d){
  if(BASE_NONFOOD_DEPTS.includes(d)) return true;
  const custom = (typeof state !== 'undefined' && state.customDepts) || {};
  return !BASE_DEPT_LABEL[d] && !!(custom[d] && custom[d].nonFood);
}
// Un ingrediente/prodotto è "di casa" se la sua categoria (scelta a mano o
// automatica dal nome) è non alimentare.
function isNonFoodName(name){
  return isNonFoodDept(pantryCatFor(name) || classifyDept(name));
}
// Anche le categorie di base si possono rinominare o cambiare di emoji:
// in quel caso customDepts ha una voce con lo stesso id della categoria di
// base, che ne sovrascrive solo nome/emoji (non si possono eliminare, le
// regole automatiche e il resto dell'app contano su di loro).
function applyCustomDepts(){
  const custom = (typeof state !== 'undefined' && state.customDepts) || {};
  const ids = Object.keys(custom).filter(id => !BASE_DEPT_LABEL[id] && custom[id] && custom[id].label);
  const foodIds = ids.filter(id => !custom[id].nonFood), nonFoodIds = ids.filter(id => custom[id].nonFood);
  const baseFood = BASE_DEPT_ORDER.filter(d => d !== 'altro' && d !== 'finiti' && !BASE_NONFOOD_DEPTS.includes(d));
  const order = baseFood.concat(foodIds, ['altro'], BASE_NONFOOD_DEPTS, nonFoodIds, ['finiti']);
  DEPT_ORDER.length = 0;
  order.forEach(d => DEPT_ORDER.push(d));
  Object.keys(DEPT_LABEL).forEach(d=>{ if(!BASE_DEPT_LABEL[d]){ delete DEPT_LABEL[d]; delete DEPT_ICON[d]; } });
  Object.keys(BASE_DEPT_LABEL).forEach(d=>{
    const o = custom[d];
    DEPT_LABEL[d] = (o && o.label) || BASE_DEPT_LABEL[d];
    DEPT_ICON[d] = (o && o.icon) || BASE_DEPT_ICON[d];
  });
  ids.forEach(id=>{ DEPT_LABEL[id] = custom[id].label; DEPT_ICON[id] = custom[id].icon || '🏷️'; });
}
// Categoria salvata su una voce, solo se esiste ancora (una categoria
// personalizzata può essere stata eliminata, anche da un altro spazio):
// altrimenti '' e si torna alla categoria automatica dal nome.
// <option> delle categorie per un <select>, divise in "Cibo" e "Casa".
// only: 'casa' per le sole categorie non alimentari (form di un prodotto),
// 'cibo' per le sole alimentari (form di un ingrediente, gruppi).
function deptOptionsHtml(selected, only){
  const opt = d => `<option value="${d}" ${selected===d?'selected':''}>${DEPT_ICON[d]} ${escapeHtml(DEPT_LABEL[d])}</option>`;
  // In ordine alfabetico (dentro Cibo e dentro Casa), come in "Gestisci categorie".
  const list = DEPT_ORDER.filter(d => d !== 'finiti').sort((a,b)=> IT_COLLATOR.compare(DEPT_LABEL[a], DEPT_LABEL[b]));
  if(only === 'casa') return list.filter(isNonFoodDept).map(opt).join('');
  if(only === 'cibo') return list.filter(d => !isNonFoodDept(d)).map(opt).join('');
  return `<optgroup label="Cibo">${list.filter(d => !isNonFoodDept(d)).map(opt).join('')}</optgroup><optgroup label="Casa">${list.filter(isNonFoodDept).map(opt).join('')}</optgroup>`;
}
// Unità per un prodotto di casa: solo conteggio generico o presenza/assenza
// (grammi/litri non servono, nessuna ricetta li confronta). L'unità già
// impostata, se diversa, resta tra le opzioni per non perderla in silenzio.
const HOME_UNITS = ['', 'none'];
function homeUnitOptionsHtml(selected){
  const units = HOME_UNITS.concat(selected && !HOME_UNITS.includes(selected) ? [selected] : []);
  return units.map(u=>`<option value="${u}" ${(selected||'')===u?'selected':''}>${escapeHtml(UNIT_LABEL[u])}</option>`).join('');
}
function knownDept(cat){
  return cat && DEPT_LABEL[cat] && cat !== 'finiti' ? cat : '';
}

const LUOGO_ORDER = ['dispensa','ripostiglio','frigo','freezer','giardino'];
const LUOGO_LABEL = { dispensa:'Dispensa', ripostiglio:'Ripostiglio', frigo:'Frigo', freezer:'Freezer', giardino:'Giardino' };

// Unità di misura tracciabili per una voce di Dispensa: '' = pezzi/generico
// (contatore numerico senza unità), le altre abilitano il confronto
// quantitativo con quanto richiesto dalla ricetta (vedi pantryStatusFor).
// 'none' = "Non mostrare": per ingredienti "a spanne" (sale, pepe, spezie...)
// dove non ha senso una quantità precisa — in Dispensa il contatore sparisce
// a favore di una semplice spunta presente/assente (vedi renderDispensa).
// Scelta manuale dell'utente riga per riga, niente rilevamento automatico.
const UNIT_ORDER = ['', 'g', 'kg', 'ml', 'l', 'none'];
const UNIT_LABEL = { '':'pezzi/generico', g:'grammi (g)', kg:'chili (kg)', ml:'millilitri (ml)', l:'litri (l)', none:'Non mostrare (solo presenza/assenza)' };

// Revisione unità di misura per gli ingredienti da dispensa veri (non i
// freschi, comprati a vista) — solo quelli con un'unità in cui ha senso
// confrontare la scorta con quanto serve in ricetta (vedi pantryStatusFor).
// Concordata con l'utente; usata dalla migrazione "pantryUnitReviewed" più
// sotto, che la applica solo dove l'unità non è già stata impostata a mano.
const PANTRY_UNIT_BY_NAME = {
  'farina':'g', 'farina 0':'g', 'farina 00':'g', 'farina di ceci':'g', 'farina di mais':'g', 'farina di mais per polenta':'g',
  'zucchero':'g',
  'pasta':'g', 'pasta corta':'g', 'pasta piccola':'g', 'pasta mista':'g', 'spaghetti':'g', 'rigatoni':'g',
  'riso':'g', 'riso carnaroli':'g', 'riso vialone nano':'g',
  'pangrattato':'g', 'semolino':'g',
  'formaggio grattugiato':'g', 'parmigiano grattugiato':'g', 'parmigiano':'g', 'pecorino grattugiato':'g', 'pecorino romano grattugiato':'g', 'pecorino romano':'g', 'grana grattugiato':'g', 'grana':'g',
  'noci sgusciate':'g', 'pinoli':'g',
  'ceci secchi':'g', 'lenticchie':'g', 'lenticchie secche':'g',
  'concentrato di pomodoro':'g',
  'miele':'g',
  'olio evo':'ml', 'olio di semi':'ml', 'olio per friggere':'ml',
  'aceto':'ml', 'aceto balsamico':'ml', 'aceto di vino bianco':'ml', 'aceto di vino':'ml',
  'latte':'ml', 'panna da cucina':'ml', 'panna':'ml',
  'vino bianco':'ml', 'vino rosso':'ml',
  'passata di pomodoro':'ml', 'passata':'ml'
};
// Passo dello stepper +/- in Dispensa, adeguato all'unità (1g o 1ml alla volta non avrebbe senso).
function qtyStepFor(unit){
  if(unit === 'g' || unit === 'ml') return 50;
  if(unit === 'kg' || unit === 'l') return 0.1;
  return 1;
}
const LUOGO_ICON = { 
  dispensa:'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M253.76 93A12 12 0 0 0 237 90.24l-9 6.44V80a12 12 0 0 0-12-12H40a12 12 0 0 0-12 12v16.68l-9-6.44a12 12 0 1 0-14 19.52l23 16.42V184a36 36 0 0 0 36 36h128a36 36 0 0 0 36-36v-57.82l23-16.42A12 12 0 0 0 253.76 93M204 184a12 12 0 0 1-12 12H64a12 12 0 0 1-12-12V92h152ZM76 40V16a12 12 0 0 1 24 0v24a12 12 0 0 1-24 0m40 0V16a12 12 0 0 1 24 0v24a12 12 0 0 1-24 0m40 0V16a12 12 0 0 1 24 0v24a12 12 0 0 1-24 0"></path></svg>', 
  ripostiglio:'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--heroicons" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m7.875 14.25l1.214 1.942a2.25 2.25 0 0 0 1.908 1.058h2.006c.776 0 1.497-.4 1.908-1.058l1.214-1.942M2.41 9h4.636a2.25 2.25 0 0 1 1.872 1.002l.164.246a2.25 2.25 0 0 0 1.872 1.002h2.092a2.25 2.25 0 0 0 1.872-1.002l.164-.246A2.25 2.25 0 0 1 16.954 9h4.636M2.41 9a2.3 2.3 0 0 0-.16.832V12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 12V9.832c0-.287-.055-.57-.16-.832M2.41 9a2.3 2.3 0 0 1 .382-.632l3.285-3.832a2.25 2.25 0 0 1 1.708-.786h8.43c.657 0 1.281.287 1.709.786l3.284 3.832c.163.19.291.404.382.632M4.5 20.25h15A2.25 2.25 0 0 0 21.75 18v-2.625c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125V18a2.25 2.25 0 0 0 2.25 2.25"></path></svg>', 
  frigo:'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ic" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M8 5h2v3H8zm0 7h2v5H8zm10-9.99L6 2a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.11-.9-1.99-2-1.99M18 20H6v-9.02h12zm0-11H6V4h12z"></path></svg>', 
  freezer:'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M227.65 149.14a12 12 0 0 1-8.79 14.51l-20.67 5.08l5.4 20.16a12 12 0 0 1-23.18 6.22l-7.29-27.2L140 148.78V187l20.48 20.48a12 12 0 0 1-17 17L128 209l-15.51 15.52a12 12 0 0 1-17-17L116 187v-38.22l-33.12 19.13l-7.29 27.2a12 12 0 0 1-23.18-6.22l5.4-20.16l-20.67-5.08a12 12 0 1 1 5.72-23.3l27.89 6.85L104 128l-33.25-19.2l-27.89 6.85A11.8 11.8 0 0 1 40 116a12 12 0 0 1-2.85-23.65l20.67-5.08l-5.4-20.16a12 12 0 0 1 23.18-6.22l7.29 27.2L116 107.21V69L95.52 48.48a12 12 0 0 1 17-17L128 47l15.51-15.52a12 12 0 1 1 17 17L140 69v38.24l33.12-19.12l7.29-27.2a12 12 0 0 1 23.18 6.22l-5.4 20.16l20.67 5.08A12 12 0 0 1 216 116a11.8 11.8 0 0 1-2.87-.35l-27.89-6.85L152 128l33.25 19.2l27.89-6.85a12 12 0 0 1 14.51 8.79"></path></svg>', 
  giardino:'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M227.42 39.86a12 12 0 0 0-11.28-11.28c-39.6-2.33-74.59 2.34-104 13.87C84 53.48 62.31 70.58 49.39 91.9c-17.62 29.11-17.66 64.45-.45 98.19l-17.43 17.43a12 12 0 0 0 17 17l17.43-17.43c16.74 8.54 33.88 12.85 50.45 12.85a91.3 91.3 0 0 0 47.74-13.3c21.32-12.92 38.42-34.62 49.45-62.75c11.5-29.43 16.17-64.43 13.84-104.03m-75.76 146.22C131.57 198.25 108 199.17 83.94 189l84.54-84.54a12 12 0 1 0-17-17L67 172.06c-10.14-24-9.22-47.63 3-67.72c20.91-34.53 70.54-53.72 134-52.25c1.38 63.44-17.81 113.08-52.34 133.99"></path></svg>' 
};
const DEPT_RULES = [
  // Prodotti per la casa (vista Casa in Dispensa): prima di tutto il resto,
  // perché nomi come "Sale per lavastoviglie" o "Aceto per pulizie"
  // conterrebbero parole chiave alimentari.
  ['lavastoviglie','pulizia'], ['per pulizie','pulizia'], ['detersiv','pulizia'], ['ammorbident','pulizia'], ['candeggin','pulizia'],
  ['sgrassator','pulizia'], ['anticalcare','pulizia'], ['detergent','pulizia'], ['brillantant','pulizia'], ['smacchiator','pulizia'],
  ['igienizzant','pulizia'], ['spugn','pulizia'], ['panno','pulizia'], ['sacchi spazzatura','pulizia'], ['sacchi immondizia','pulizia'],
  ['carta igienica','igiene'], ['sapone','igiene'], ['shampoo','igiene'], ['bagnoschiuma','igiene'], ['doccia schiuma','igiene'],
  ['dentifricio','igiene'], ['spazzolin','igiene'], ['deodorant','igiene'], ['assorbent','igiene'], ['cotton fioc','igiene'],
  ['dischetti struccanti','igiene'], ['rasoi','igiene'], ['collutorio','igiene'], ['fazzoletti','igiene'], ['balsamo per capelli','igiene'],
  ['carta forno','cucina-casa'], ['pellicola','cucina-casa'], ['alluminio','cucina-casa'], ['sacchetti','cucina-casa'], ['scottex','cucina-casa'],
  ['carta assorbente','cucina-casa'], ['tovaglioli','cucina-casa'], ['stuzzicadenti','cucina-casa'], ['stuzzicaden','cucina-casa'],
  // Prima di tutto i nomi che contengono la parola chiave di un altro reparto
  // (vince la prima regola che corrisponde): "Colla di pesce" non è pesce,
  // "Farina di ceci" non è un legume, "Fagiolini" non sono fagioli secchi,
  // "Gnocchi di patate"/"Concentrato di pomodoro" non sono verdura fresca.
  ['colla di pesce','dispensa'], ['brodo','dispensa'], ['aglio in polvere','base'], ['aranciata','bibite'],
  ['farina di ceci','pane'], ['gnocchi','pane'], ['fagiolini','verdura'], ['farro','pane'], ['tahina','dispensa'], ['robiola','latticini'], ['bagoss','latticini'], ['cioccolato','dispensa'],
  ['concentrato','legumi'], ['polpa di pomodoro','legumi'],
  ['passata','legumi'], ['pelati','legumi'], ['conserva','legumi'], ['ceci','legumi'], ['fagioli','legumi'], ['lenticchie','legumi'],
  ['salmone','pesce'], ['tonno','pesce'], ['gamber','pesce'], ['merluzzo','pesce'], ['branzino','pesce'], ['acciughe','pesce'], ['pesce','pesce'],
  ['manzo','carne'], ['pollo','carne'], ['maiale','carne'], ['salsiccia','carne'], ['tacchino','carne'], ['vitello','carne'], ['agnello','carne'], ['straccetti','carne'], ['macinato','carne'], ['prosciutto','carne'], ['pancetta','carne'], ['guanciale','carne'], ['coniglio','carne'],
  ['mozzarella','latticini'], ['ricotta','latticini'], ['parmigiano','latticini'], ['formaggio','latticini'], ['grana','latticini'], ['latte','latticini'], ['burro','latticini'], ['yogurt','latticini'], ['stracchino','latticini'], ['provola','latticini'],
  ['uova','uova'], ['uovo','uova'],
  ['pane','pane'], ['farina','pane'], ['pasta','pane'], ['riso','pane'], ['lievito','pane'],
  // Le voci "peperoncino" e "peperon" (stem di peperone/peperoni) vanno controllate
  // prima di "pepe", altrimenti "pepe" le intercetta per prima essendo una sua sottostringa.
  // "Base": sale, pepe, olio, aceto, spezie ed erbe aromatiche secche — i
  // condimenti di base, separati da sughi/conserve di "Dispensa e condimenti".
  ['peperoncino','base'], ['peperon','verdura'],
  ['sale','base'], ['olio','base'], ['pepe','base'], ['aceto','base'], ['zucchero','dispensa'], ['spezie','base'],
  ['origano','base'], ['rosmarino','base'], ['timo','base'], ['alloro','base'], ['cannella','base'], ['paprika','base'], ['noce moscata','base'],
  ['senape','dispensa'], ['miele','dispensa'], ['pangrattato','dispensa'],
  ['surgelat','surgelati'], ['gelato','surgelati'],
  ['melanzan','verdura'], ['zucchin','verdura'], ['patat','verdura'], ['insalat','verdura'], ['pomodor','verdura'], ['basilico','verdura'], ['frutta','verdura'], ['verdura','verdura'], ['cipolla','verdura'], ['carota','verdura'], ['aglio','verdura'],
  ['melone','verdura'], ['anguria','verdura'], ['mela','verdura'], ['pera','verdura'], ['limone','verdura'], ['arancia','verdura'], ['banana','verdura'], ['fragol','verdura'], ['uva','verdura'],
  // Aggiunte per svuotare "Altro" (ingredienti delle ricette che nessuna
  // regola sopra riconosceva).
  ['cipoll','verdura'], ['borettan','verdura'], ['scalogno','verdura'], ['porr','verdura'], ['sedano','verdura'], ['finocchi','verdura'],
  ['carciof','verdura'], ['funghi','verdura'], ['broccol','verdura'], ['cavolfior','verdura'], ['verza','verdura'], ['cime di rapa','verdura'],
  ['friariell','verdura'], ['spinaci','verdura'], ['bietol','verdura'], ['asparag','verdura'], ['cetriol','verdura'], ['radicchio','verdura'],
  ['rucola','verdura'], ['zucca','verdura'], ['piselli','verdura'], ['verdur','verdura'], ['prezzemolo','verdura'], ['salvia','verdura'],
  ['menta','verdura'], ['aneto','verdura'], ['aranc','verdura'], ['mele','verdura'], ['pere','verdura'],
  ['ragù','legumi'], ['carne','carne'], ['arista','carne'], ['controfiletto','carne'], ['scamone','carne'], ['cappello del prete','carne'], ['muscolo','carne'],
  ['cappone','carne'], ['cosce','carne'], ['petto','carne'], ['cotenna','carne'], ['speck','carne'], ['spiedini','carne'],
  ['baccal','pesce'], ['cozze','pesce'], ['vongole','pesce'], ['orata','pesce'], ['polpo','pesce'],
  ['burrata','latticini'], ['brie','latticini'], ['caciocavallo','latticini'], ['fontina','latticini'], ['gorgonzola','latticini'], ['taleggio','latticini'],
  ['mascarpone','latticini'], ['pecorino','latticini'], ['provolone','latticini'], ['scamorza','latticini'], ['panna','latticini'], ['latticello','latticini'],
  ['spaghetti','pane'], ['rigatoni','pane'], ['orecchiette','pane'], ['trenette','pane'], ['trofie','pane'], ['cannelloni','pane'],
  ['sfoglie','pane'], ['tortellini','pane'], ['semol','pane'], ['cereali','pane'], ['panini','pane'], ['savoiardi','pane'], ['vialone','pane'],
  ['legumi','legumi'], ['cannellini','legumi'], ['mais','legumi'],
  ['olive','dispensa'], ['capperi','dispensa'], ['pesto','dispensa'], ['maionese','dispensa'], ['besciamella','dispensa'], ['dadi','dispensa'],
  ['vino','dispensa'], ['cacao','dispensa'], ['caffè','dispensa'], ['vaniglia','dispensa'], ['zafferano','base'], ['chiodi di garofano','base'],
  ['pinoli','dispensa'], ['noci','dispensa'], ['mandorle','dispensa'], ['uvetta','dispensa'], ['marmellat','dispensa'],
  ['acqua','bibite'], ['bibit','bibite'], ['birra','bibite'], ['succo di frutta','bibite'], ['tè freddo','bibite'],
];

// Un nome ingrediente tipo "Scalogno o cipolla" o "Pasta corta (ditalini o
// mista)" descrive alternative intercambiabili: genera, dal più specifico al
// più generico, tutti i singoli nomi che potrebbero corrispondere a una voce
// di Dispensa — il testo intero, il testo prima di un'eventuale parentesi
// finale, e le parti separate da "o"/virgola sia fuori che dentro la
// parentesi. Per un nome senza alternative restituisce solo il nome stesso.
// Alternative scritte in forma abbreviata nelle ricette ("Vino bianco o
// rosso"), dove la divisione automatica sulla "o" darebbe pezzi che da soli
// non sono ingredienti ("rosso"): qui le parti vere, concordate con
// l'utente. Usata sia per riconoscere la scorta in Dispensa
// (splitIngredientCandidates) sia per l'elenco di "Gestisci ingredienti"
// (manageableIngredientNames). Chiavi in minuscolo.
const CURATED_ALTERNATIVE_PARTS = {
  'vino bianco o rosso': ['Vino bianco', 'Vino rosso'],
  'brodo di carne o vegetale': ['Brodo di carne', 'Brodo vegetale'],
  'aceto di vino o di mele': ['Aceto di vino', 'Aceto di mele'],
  'cipolle (borettane o rosse)': ['Cipolle borettane', 'Cipolle rosse'],
  'cannelloni (secchi o sfoglie di pasta fresca)': ['Cannelloni secchi', 'Sfoglie di pasta fresca'],
  'filetti di pesce bianco (orata, branzino o simili)': ['Filetti di pesce bianco', 'Filetti di orata', 'Filetti di branzino'],
  'pollo a pezzi (cosce o petto)': ['Pollo', 'Cosce di pollo', 'Petto di pollo'],
  'pollo a pezzi (cosce o sovracosce)': ['Pollo', 'Cosce di pollo', 'Sovracosce di pollo'],
  'sovracosce di pollo (o petto)': ['Sovracosce di pollo', 'Petto di pollo'],
  'cosce o sovracosce di pollo': ['Cosce di pollo', 'Sovracosce di pollo'],
  'petto di pollo o cosce disossate': ['Petto di pollo', 'Cosce di pollo'],
  'passata di pomodoro o concentrato': ['Passata di pomodoro', 'Concentrato di pomodoro'],
  'manzo per brasato (muscolo o cappello del prete)': ['Manzo per brasato', 'Muscolo di manzo', 'Cappello del prete'],
  'aglio (o mezza cipolla)': ['Aglio', 'Cipolla'],
  'scalogno (o mezza cipolla)': ['Scalogno', 'Cipolla']
};
function splitIngredientCandidates(text){
  const raw = (text||'').trim();
  if(!raw) return [];
  const curated = CURATED_ALTERNATIVE_PARTS[raw.toLowerCase()];
  if(curated) return [...new Set([raw, ...curated])];
  const out = [raw];
  const parenMatch = raw.match(/^(.*?)\s*\(([^()]*)\)\s*$/);
  let base = raw, inner = '';
  if(parenMatch){
    base = parenMatch[1].trim();
    inner = parenMatch[2].trim();
    if(base) out.push(base);
  }
  [base, inner].forEach(part=>{
    if(!part) return;
    part.split(/\s*,\s*|\s+o\s+/i).forEach(p=>{
      const t = p.trim();
      if(t) out.push(t);
    });
  });
  return [...new Set(out)];
}

// Nomi "gestibili" in Dispensa per un ingrediente di ricetta: a differenza
// di splitIngredientCandidates (che serve al confronto "ce l'ho", e per
// questo genera anche il testo intero) qui vogliamo SOLO le voci che ha
// senso avere come riga separata in Dispensa/"Gestisci ingredienti":
// - "Zucchero o miele", "Vino bianco o rosso" (alternative dirette, senza
//   parentesi): sono due prodotti diversi, si spacchettano in due voci —
//   in Dispensa avrai l'uno o l'altro, mai "zucchero o miele" come voce sola.
// - "Scalogno (o mezza cipolla)", "Pasta corta (fusilli o penne)"
//   (parentesi con una vera alternativa dentro, riconosciuta dalla "o"):
//   si spacchetta allo stesso modo, base + parti dentro la parentesi.
// - "Verdure miste (zucchine, carote, spinaci)", "Limone (scorza e succo)"
//   (parentesi solo esplicativa — esempi o uso, nessuna "o" dentro): la
//   parentesi non è un'alternativa da spacchettare, resta solo il nome base
//   ("Verdure miste", "Limone") — spacchettare qui creerebbe voci finte
//   (es. "zucchine" come se fosse un ingrediente a sé in quella ricetta).
function manageableIngredientNames(text){
  const raw = (text||'').trim();
  if(!raw) return [];
  const curated = CURATED_ALTERNATIVE_PARTS[raw.toLowerCase()];
  if(curated) return curated.slice();
  const parenMatch = raw.match(/^(.*?)\s*\(([^()]*)\)\s*$/);
  if(parenMatch){
    const base = parenMatch[1].trim();
    const inner = parenMatch[2].trim();
    if(!/\so\s|^o\s/i.test(inner)) return base ? manageableIngredientNames(base) : [raw];
    const parts = new Set();
    [base, inner.replace(/^o\s+/i, '')].forEach(part=>{
      if(!part) return;
      part.split(/\s*,\s*|\s+o\s+/i).forEach(p=>{ const t = p.trim(); if(t) parts.add(t); });
    });
    return [...parts];
  }
  if(/\so\s/i.test(raw)) return raw.split(/\s*,\s*|\s+o\s+/i).map(p=>p.trim()).filter(Boolean);
  return [raw];
}

// Alcuni ingredienti nelle ricette sono generici ("Pasta corta") ma in
// Dispensa ci sono i formati specifici (Fusilli, Penne...): un ingrediente
// può avere un "gruppo" assegnato in Dispensa (campo Gruppo, in Aggiungi/
// Modifica), e una ricetta che chiede il generico viene soddisfatta da
// qualsiasi voce con lo stesso gruppo. I gruppi sono gestiti dall'utente
// (state.pantryGroups, vedi "Gestisci gruppi" in Dispensa), non più fissi
// nel codice: { label, matchName (il testo esatto che una ricetta usa per il
// generico), cat (categoria suggerita quando scegli il gruppo) }.
//
// Per i nomi con alternative dirette ("Scalogno o cipolla") non serve un
// gruppo: si prova a risolvere ogni singola alternativa (vedi
// splitIngredientCandidates) contro Dispensa o i gruppi, e vince la prima
// che ha scorta > 0 — così avere anche solo uno dei due basta, senza dover
// impostare nulla a mano. Se nessuna alternativa è in scorta, si restituisce
// comunque la prima voce trovata (anche a 0), per mostrare "manca"/"poco"
// invece di far sparire l'ingrediente.
function resolvePantryItem(ingrediente){
  let fallback = null;
  for(const cand of splitIngredientCandidates(ingrediente)){
    const key = cand.toLowerCase();
    const direct = state.pantryItems[key];
    if(direct){
      if(typeof direct.qty === 'number' && direct.qty > 0) return direct;
      if(!fallback) fallback = direct;
      continue;
    }
    const groupEntry = Object.entries(state.pantryGroups || {}).find(([id,g]) => (g.matchName||'').trim().toLowerCase() === key);
    const group = groupEntry ? groupEntry[0] : null;
    if(!group) continue;
    const inStock = Object.values(state.pantryItems).find(it => it.group === group && typeof it.qty === 'number' && it.qty > 0);
    if(inStock) return inStock;
    if(!fallback){
      const anyInGroup = Object.values(state.pantryItems).find(it => it.group === group);
      if(anyInGroup) fallback = anyInGroup;
    }
  }
  return fallback;
}

// Ha scorta reale in Dispensa (qty > 0)? Usata da buildShopFlat per escludere
// del tutto da Spesa gli ingredienti che non servono comprare, e come
// fallback di isItemChecked per il raro caso in cui una riga con scorta resti
// comunque visibile (l'utente l'aveva de-spuntata esplicitamente in passato).
function hasPantryStock(ingrediente){
  const it = resolvePantryItem(ingrediente);
  return !!(it && typeof it.qty === 'number' && it.qty > 0);
}

// Estrae {value, unit} dal primo numero trovato in un testo tipo "300 g",
// "1,5 kg", "1 spicchio" — null se non c'è un numero. unit è tutto ciò che
// segue, minuscolo (può essere vuoto, es. "3"). Un intervallo tipo "150–180 g"
// o "6-12 foglie" (trattino o "–") si salta fino all'unità dopo il secondo
// numero — altrimenti l'unità restava incollata al "180"/"12" e il "\s*[a-zà-
// ù]*" dopo il primo numero non trovava nulla, tornando un'unità vuota anche
// quando c'era eccome (bug reale: la Spesa mostrava "150" senza "g").
function parseQtyValue(text){
  if(!text) return null;
  const m = (''+text).trim().match(/^(\d+(?:[.,]\d+)?)\s*(?:[-–]\s*\d+(?:[.,]\d+)?\s*)?([a-zà-ù]*)/i);
  if(!m) return null;
  const value = parseFloat(m[1].replace(',', '.'));
  if(Number.isNaN(value)) return null;
  return { value, unit: (m[2]||'').toLowerCase() };
}

// Converte peso/volume in un'unità base comune (grammi o millilitri) per un
// confronto numerico affidabile. Le altre unità (pezzi, spicchi, cucchiai...)
// non sono normalizzabili in modo sicuro senza inventare equivalenze, quindi
// restano fuori da questo confronto — vedi pantryStatusFor.
const WEIGHT_TO_GRAMS = { g:1, gr:1, grammi:1, grammo:1, kg:1000, kilo:1000, kilogrammo:1000, kilogrammi:1000 };
const VOLUME_TO_ML = { ml:1, millilitri:1, l:1000, lt:1000, litro:1000, litri:1000 };
function toComparableUnit(value, unit){
  const u = (unit||'').toLowerCase();
  if(WEIGHT_TO_GRAMS[u] !== undefined) return { value: value * WEIGHT_TO_GRAMS[u], base:'g' };
  if(VOLUME_TO_ML[u] !== undefined) return { value: value * VOLUME_TO_ML[u], base:'ml' };
  return null;
}

// Quantità usata di un ingrediente, nell'unità con cui è tracciato in
// Dispensa (per poterla poi sottrarre dalla scorta) — es. ricetta "500 g" su
// una voce di Dispensa tracciata in kg diventa 0.5. Se l'unità di Dispensa è
// generica (pezzi) il numero della ricetta si usa così com'è (es. "2 uova" =
// 2), a prescindere dalla parola usata in ricetta. Se non si riesce a
// interpretare un numero, o le unità non sono comparabili, torna 0 — meglio
// non sottrarre nulla che sottrarre un valore inventato.
function usedQtyForPantry(pantryUnit, qtaText, ratio){
  const parsed = parseQtyValue(scaleQtyText(qtaText, ratio));
  if(!parsed) return 0;
  if(!pantryUnit) return Math.round(parsed.value);
  const have = toComparableUnit(parsed.value, parsed.unit);
  if(!have) return 0;
  if(pantryUnit === 'g') return have.base === 'g' ? Math.round(have.value) : 0;
  if(pantryUnit === 'kg') return have.base === 'g' ? Math.round((have.value/1000)*100)/100 : 0;
  if(pantryUnit === 'ml') return have.base === 'ml' ? Math.round(have.value) : 0;
  if(pantryUnit === 'l') return have.base === 'ml' ? Math.round((have.value/1000)*100)/100 : 0;
  return 0;
}

// Somma le quantità testuali di più occorrenze dello stesso ingrediente (es.
// due ricette che chiedono entrambe "farina", "200 g" e "150 g") invece di
// tenerle su righe separate in Spesa — prima si univano solo se il testo
// combaciava esattamente, quindi "200 g" e "150 g" restavano due righe
// distinte anche se in realtà andavano sommate. Se le unità sono la stessa
// unità di peso/volume riconosciuta (anche miste, es. g + kg) somma nella
// base comune e riformatta; se sono la stessa unità testuale non convertibile
// (es. "spicchio") somma comunque i numeri; altrimenti (q.b., unità diverse
// non comparabili) non inventa un totale e le accosta con "+".
// Singolare/plurale delle unità "a pezzi" più comuni nel catalogo, per
// sommare "2 spicchi" + "1 spicchio" come stessa unità.
const QTY_UNIT_PLURAL = { spicchio:'spicchi', cucchiaio:'cucchiai', cucchiaino:'cucchiaini', pezzo:'pezzi', foglia:'foglie', fetta:'fette', costa:'coste', rametto:'rametti', bustina:'bustine', filetto:'filetti', cespo:'cespi', gambo:'gambi', rotolo:'rotoli', bicchiere:'bicchieri', mazzo:'mazzi', mazzetto:'mazzetti', tazzina:'tazzine', foglio:'fogli', bacca:'bacche', grande:'grandi', media:'medie', medio:'medi', piccola:'piccole', piccolo:'piccoli' };
const QTY_UNIT_SINGULAR = Object.fromEntries(Object.entries(QTY_UNIT_PLURAL).map(([s,p])=>[p,s]));
function singularUnit(u){ return QTY_UNIT_SINGULAR[u] || u; }
function formatQtyNumber(n){ return Number.isInteger(n) ? String(n) : n.toFixed(1).replace('.', ','); }
function combineQtyTexts(qtaTexts){
  const all = qtaTexts.filter(Boolean).map(t=>t.trim()).filter(Boolean);
  if(all.length <= 1) return all[0] || '';
  // Le quantità numeriche si sommano TUTTE, anche se identiche (due ricette
  // da "200 g" fanno 400 g — prima i doppioni si scartavano e ne restava una
  // sola); le voci non numeriche (q.b., "facoltativo"...) si tengono una volta.
  const numeric = [], other = [];
  all.forEach(t=>{ const val = parseQtyValue(t); if(val) numeric.push({ text: t, val }); else if(!other.includes(t)) other.push(t); });
  let parts = [];
  if(numeric.length){
    const unitOf = p => singularUnit(p.val.unit || '');
    const comparable = numeric.map(p => toComparableUnit(p.val.value, p.val.unit));
    if(numeric.every(p => unitOf(p) === unitOf(numeric[0])) && !comparable[0]){
      const total = numeric.reduce((sum,p)=> sum + p.val.value, 0);
      const unit = unitOf(numeric[0]);
      const shownUnit = unit && total > 1 ? (QTY_UNIT_PLURAL[unit] || unit) : unit;
      parts.push(shownUnit ? `${formatQtyNumber(total)} ${shownUnit}` : formatQtyNumber(total));
    } else if(comparable.every(Boolean) && comparable.every(c => c.base === comparable[0].base)){
      const totalBase = comparable.reduce((sum,c)=> sum + c.value, 0);
      const isWeight = comparable[0].base === 'g';
      parts.push(totalBase >= 1000 ? `${formatQtyNumber(totalBase / 1000)} ${isWeight ? 'kg' : 'l'}` : `${Math.round(totalBase)} ${isWeight ? 'g' : 'ml'}`);
    } else {
      parts = numeric.map(p => p.text); // unità non confrontabili: niente totale inventato
    }
  }
  return parts.concat(other).join(' + ');
}

// Stato di un ingrediente rispetto alla Dispensa: 'manca' se assente o a
// quantità zero; 'poco' se in Dispensa ce n'è di meno di quanto richiesto
// (solo quando entrambe le quantità sono in un'unità di peso/volume
// riconosciuta e tracciata sulla voce di Dispensa — vedi UNIT_ORDER);
// altrimenti 'in-casa' (semplice presenza, come prima di avere le unità).
function pantryStatusFor(ingrediente, neededQtaText){
  const it = resolvePantryItem(ingrediente);
  if(!it || typeof it.qty !== 'number' || it.qty <= 0) return 'manca';
  if(!it.unit) return 'in-casa';
  const have = toComparableUnit(it.qty, it.unit);
  const need = neededQtaText ? parseQtyValue(neededQtaText) : null;
  const needComparable = need ? toComparableUnit(need.value, need.unit) : null;
  if(!have || !needComparable || have.base !== needComparable.base) return 'in-casa';
  return have.value >= needComparable.value ? 'in-casa' : 'poco';
}


// Estrae il numero di porzioni base da un testo tipo "3 porzioni" o
// "4 porzioni (base per più pasti)": null se non parsabile (nessuno scaling).
function parsePortionsBase(porzioniText){
  const m = (porzioniText||'').match(/\d+/);
  return m ? parseInt(m[0], 10) : null;
}

// Scala ogni numero trovato nel testo per ratio, lasciando invariato il resto
// (q.b., facoltativo, unità di misura, parentesi...). I numeri piccoli e interi
// (es. spicchi, uova — fino a 12) si arrotondano a step di 0.5 per restare
// realistici; il resto (grammi, ml...) si arrotonda all'intero più vicino.
function scaleQtyText(text, ratio){
  if(!text || !ratio || ratio === 1) return text;
  return text.replace(/\d+(?:[.,]\d+)?/g, numStr=>{
    const n = parseFloat(numStr.replace(',', '.'));
    if(Number.isNaN(n)) return numStr;
    let scaled = n * ratio;
    scaled = (Number.isInteger(n) && n <= 12) ? Math.round(scaled*2)/2 : Math.round(scaled);
    return Number.isInteger(scaled) ? String(scaled) : String(scaled.toFixed(1)).replace('.', ',');
  });
}

// Lista ingredienti di una ricetta con pallino IN CASA/SCORTA BASSA/MANCA
// (da pantryStatusFor) e un'azione per mandare solo quelli da comprare in
// Spesa: condivisa da Menù e Prep, così il comportamento resta identico
// ovunque si apra il dettaglio di una ricetta.
// ratio scala le quantità visualizzate (e quelle mandate in Spesa) per un
// eventuale numero di porzioni diverso da quello base — vedi renderDayCard.
// ctx (opzionale) collega la lista a un pasto pianificato specifico
// ({weekIdx, i, meal, role}, role: 'p' principale o 'c0'/'c1'/... contorni —
// vedi dayIngKey): quando presente, "Aggiungi N ingredienti" riporta quelle
// righe in Spesa nella sezione del pasto invece che tra "Aggiunti a mano" —
// coerente con l'aggregazione automatica di buildShopFlat, che le include già
// di suo a meno che non risultino scartate. Senza ctx (es. ricetta aperta dal
// Ricettario, senza un giorno/pasto a cui è associata) resta "Aggiunti a mano".
function renderIngredientsSection(ing, ratio, ctx){
  ratio = ratio || 1;
  if(!ing.length) return `<div class="ing-empty">Nessun ingrediente salvato per questa ricetta ancora.</div>`;
  const STATUS_LABEL = { 'in-casa':'In casa', 'poco':'Scorta bassa', 'manca':'Manca' };
  const rows = ing.map(it=>{
    const scaledQta = scaleQtyText(it.qta, ratio);
    const status = pantryStatusFor(it.ingrediente, scaledQta);
    return `<li><span class="ing-list-name">${escapeHtml(it.ingrediente)}</span><span class="ing-status ${status}" title="${escapeAttr(STATUS_LABEL[status])}"></span><span style="color:var(--sage)">${escapeHtml(scaledQta||'')}</span></li>`;
  }).join('');
  // Le quantità mancanti si incollano già scalate qui (invece di far
  // ri-derivare al click gli ingredienti dal solo nome ricetta): necessario
  // da quando questa lista può unire più ricette (principale + contorni di
  // uno stesso pasto), che il vecchio "solo nome" non saprebbe più ricostruire.
  // idx = posizione nell'array ing, la stessa che usa buildShopFlat per
  // costruire la chiave dayIngKey di questo stesso ingrediente/ricetta/pasto.
  const mancanti = ing.map((it, idx) => ({ it, idx }))
    .filter(({it}) => pantryStatusFor(it.ingrediente, scaleQtyText(it.qta, ratio)) !== 'in-casa')
    .map(({it, idx}) => ({
      ingrediente: it.ingrediente,
      qta: scaleQtyText(it.qta, ratio) || '',
      key: ctx ? dayIngKey(ctx.weekIdx, ctx.i, ctx.meal, ctx.role, ing, idx) : null
    }));
  const mancantiBtn = mancanti.length
    ? `<div class="button-wrapper"><button class="btn is-small" data-mancanti-in-spesa="${escapeAttr(JSON.stringify(mancanti))}"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--tabler" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M4 19a2 2 0 1 0 4 0a2 2 0 1 0-4 0m11 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0"></path><path d="M17 17H6V3H4"></path><path d="m6 5l14 1l-1 7H6"></path></g></svg> Aggiungi ${mancanti.length} ingredient${mancanti.length===1?'e':'i'}</button></div>`
    : '';
  return `<div class="detail-section"><div class="detail-section-title"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--tabler" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M4 19a2 2 0 1 0 4 0a2 2 0 1 0-4 0m11 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0"></path><path d="M17 17H6V3H4"></path><path d="m6 5l14 1l-1 7H6"></path></g></svg> Ingredienti</div><ul class="ing-list">${rows}</ul>${mancantiBtn}</div>`;
}

// Blocco dettaglio completo (tag categoria/tempo/stagione/ecc, ingredienti con
// pallino dispensa, procedimento, note, link/modifica) per UNA ricetta:
// usato per ogni "ricetta aggiunta" (contorno) di un pasto nel Menù, così ha
// esattamente lo stesso livello di dettaglio del principale invece di finire
// solo mescolata nella lista ingredienti comune del pasto. ratio scala le
// quantità sulle stesse porzioni-obiettivo impostate per il pasto (vedi
// renderMealBlock), calcolato rispetto alle porzioni base di QUESTA ricetta.
function renderContornoDetailBox(name, ratio, ctx){
  const rec = getRecipeMeta(name);
  const det = getRecipeDetails(name);
  const ing = getIngredientsFor(name);
  const ingHtml = renderIngredientsSection(ing, ratio, ctx);
  const tagsHtml = rec ? `
    <div class="detail-tags">
      <span class="tag">${catIcon(rec.categoriaNew)} ${escapeHtml(CAT_LABEL[rec.categoriaNew])}</span>
      <span class="tag tempo">${det ? '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M128 20a108 108 0 1 0 108 108A108.12 108.12 0 0 0 128 20m0 192a84 84 0 1 1 84-84a84.09 84.09 0 0 1-84 84m68-84a12 12 0 0 1-12 12h-56a12 12 0 0 1-12-12V72a12 12 0 0 1 24 0v44h44a12 12 0 0 1 12 12"></path></svg> ' + escapeHtml(det.tempo) : escapeHtml(TEMPO_LABEL[rec.tempoBucket])}</span>
      <span class="tag season">${rec.stagioni.map(s=>escapeHtml(STAGIONE_LABEL[s])).join(', ')}</span>
      ${(rec.freezerNew && rec.freezerNew !== 'non-adatta') ? `<span class="tag freezer">${FREEZER_LABEL[rec.freezerNew]}</span>` : ''}
      <span class="tag"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--tabler" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="m13.62 8.382l1.966-1.967A2 2 0 1 1 19 5a2 2 0 1 1-1.413 3.414l-1.82 1.821m-9.863 8.361c2.733 2.734 5.9 4 7.07 2.829c1.172-1.172-.094-4.338-2.828-7.071c-2.733-2.734-5.9-4-7.07-2.829c-1.172 1.172.094 4.338 2.828 7.071M7.5 16l1 1"></path><path d="M12.975 21.425c3.905-3.906 4.855-9.288 2.121-12.021c-2.733-2.734-8.115-1.784-12.02 2.121"></path></g></svg> ${escapeHtml(AVANZI_LABEL[rec.avanziNew])}</span>
      ${rec.pianificazione!=='nessuna' ? `<span class="tag"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M208 32h-24v-8a8 8 0 0 0-16 0v8H88v-8a8 8 0 0 0-16 0v8H48a16 16 0 0 0-16 16v160a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16M72 48v8a8 8 0 0 0 16 0v-8h80v8a8 8 0 0 0 16 0v-8h24v32H48V48Zm136 160H48V96h160zm-96-88v64a8 8 0 0 1-16 0v-51.06l-4.42 2.22a8 8 0 0 1-7.16-14.32l16-8A8 8 0 0 1 112 120m59.16 30.45L152 176h16a8 8 0 0 1 0 16h-32a8 8 0 0 1-6.4-12.8l28.78-38.37a8 8 0 1 0-13.31-8.83a8 8 0 1 1-13.85-8A24 24 0 0 1 176 136a23.76 23.76 0 0 1-4.84 14.45"></path></svg> ${escapeHtml(PIAN_LABEL[rec.pianificazione])}</span>` : ''}
    </div>` : `<div class="ing-empty">Ricetta non presente nel catalogo — solo ingredienti disponibili qui.</div>`;
  const stepsHtml = det && det.procedimento && det.procedimento.length
    ? `<div class="detail-section"><div class="detail-section-title"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--tabler" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3c1.918 0 3.52 1.35 3.91 3.151A4 4 0 0 1 18 13.874V21H6v-7.126a4 4 0 1 1 2.092-7.723A4 4 0 0 1 12 3M6.161 17.009L18 17"></path></svg> Procedimento</div><ol class="steps-list">${det.procedimento.map(s=>`<li>${escapeHtml(s)}</li>`).join('')}</ol></div>`
    : '';
  const noteExtra = det ? [
      det.ricordare ? `<b>Da ricordare:</b> ${escapeHtml(det.ricordare)}` : '',
      det.avanzi ? `<b>Avanzi:</b> ${escapeHtml(det.avanzi)}` : '',
      det.freezer ? `<b>Freezer:</b> ${escapeHtml(det.freezer)}` : ''
    ].filter(Boolean).map(l=>`<div class="detail-extra-note">${l}</div>`).join('') : '';
  const noteBox = noteExtra ? `<div class="detail-section note-box"><div class="detail-section-title"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M88 96a8 8 0 0 1 8-8h64a8 8 0 0 1 0 16H96a8 8 0 0 1-8-8m8 40h64a8 8 0 0 0 0-16H96a8 8 0 0 0 0 16m32 16H96a8 8 0 0 0 0 16h32a8 8 0 0 0 0-16m96-104v108.69a15.86 15.86 0 0 1-4.69 11.31L168 219.31a15.86 15.86 0 0 1-11.31 4.69H48a16 16 0 0 1-16-16V48a16 16 0 0 1 16-16h160a16 16 0 0 1 16 16M48 208h104v-48a8 8 0 0 1 8-8h48V48H48Zm120-40v28.7l28.69-28.7Z"></path></svg> Note</div>${noteExtra}</div>` : '';
  const linkHtml = sourceLinkHtml(det);
  const addFormHtml = det ? '' : `
    <div class="add-ing-form">
      <input type="text" placeholder="Ingrediente" data-rning="${escapeAttr(name)}">
      <input type="text" placeholder="Quantità" data-rnqta="${escapeAttr(name)}">
      <button class="btn is-solid" data-add-ing-recipe="${escapeAttr(name)}">+ aggiungi ingrediente</button>
    </div>`;
  const editRecipeBtn = rec ? `<button class="btn is-chip" data-open-recipe-edit="${escapeAttr(name)}"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="m230.14 70.54l-44.68-44.69a20 20 0 0 0-28.29 0L33.86 149.17A19.85 19.85 0 0 0 28 163.31V208a20 20 0 0 0 20 20h44.69a19.86 19.86 0 0 0 14.14-5.86L230.14 98.82a20 20 0 0 0 0-28.28M91 204H52v-39l84-84l39 39Zm101-101l-39-39l18.34-18.34l39 39Z"></path></svg> Modifica ricetta</button>` : '';
  const sourceEditBox = (linkHtml || editRecipeBtn) ? `<div class="button-wrapper">${editRecipeBtn}${linkHtml}</div>` : '';
  return `
  <div class="detail-box contorno-detail-box">
    <div class="contorno-detail-title">${escapeHtml(name)}</div>
    ${tagsHtml}
    ${ingHtml}
    ${stepsHtml}
    ${noteBox}
    ${addFormHtml}
    ${sourceEditBox}
  </div>`;
}

// Inventario unico (dispensa/ripostiglio/frigo/freezer distinti solo dal
// campo luogo): le stesse voci vengono anche aggiunte/incrementate in
// automatico quando si spunta un articolo in Spesa. Quantità = un contatore
// numerico (stepper +/- in UI); finché non è impostata (o è 0) la voce non
// compare nell'elenco.
function upsertPantryItem(nome, luogo, amount, unit, cat, group){
  const trimmedName = (nome||'').trim();
  if(!trimmedName) return;
  const key = trimmedName.toLowerCase();
  const existing = state.pantryItems[key];
  const currentQty = (existing && typeof existing.qty === 'number') ? existing.qty : 0;
  const add = (typeof amount === 'number' && !Number.isNaN(amount)) ? amount : 1;
  const finalUnit = unit !== undefined ? unit : (existing && existing.unit) || '';
  const finalCat = cat !== undefined ? cat : (existing && existing.cat) || '';
  const finalGroup = group !== undefined ? group : (existing && existing.group) || '';
  const newQty = currentQty + add;
  state.pantryItems[key] = {
    nome: trimmedName,
    qty: newQty,
    luogo: (existing && existing.luogo) || luogo || 'dispensa',
    ...(finalCat ? { cat: finalCat } : {}),
    ...(finalUnit ? { unit: finalUnit } : {}),
    ...(finalGroup ? { group: finalGroup } : {})
  };
  // Torna in scorta: una volta rifinito serve una nuova conferma esplicita da Spesa.
  if(newQty > 0) delete state.pantryConfirmedShop[key];
}

// Sposta in Dispensa la riga di Spesa di una checkbox (upsert + dismiss):
// stessa logica di "Sposta in dispensa" per la spunta multipla, riusata
// anche dalla spunta singola quando "Modalità spesa" è attiva.
function moveShopRowToPantry(cb){
  const rowKey = cb.dataset.shopKeys;
  const stepperBtn = cb.closest('.shop-item-row')?.querySelector('[data-shop-qty-inc]');
  const fallback = parseFloat(stepperBtn?.dataset.shopQtyDefault);
  const rawQty = (typeof state.shopQty[rowKey] === 'number') ? state.shopQty[rowKey] : (Number.isNaN(fallback) ? 0 : fallback);
  // Quantità non indicata (segnaposto "–"): conta come 1, cioè "c'è".
  const qty = rawQty > 0 ? rawQty : 1;
  // Se in Dispensa è già impostata "Non mostrare" per questo ingrediente,
  // quella scelta manuale vince sempre: la quantità della ricetta ("12 g"
  // di sale, es.) non deve poterla resettare a un'unità tracciabile.
  const existingUnit = (state.pantryItems[(cb.dataset.shopName||'').trim().toLowerCase()] || {}).unit;
  const unit = existingUnit === 'none' ? 'none' : (cb.dataset.shopUnit || undefined);
  upsertPantryItem(cb.dataset.shopName, 'dispensa', qty, unit);
  rowKey.split(',').forEach(k=>{ state.shopDismissed[k] = true; });
}

// Cattura lo stato di Dispensa/Spesa toccato da moveShopRowToPantry prima di
// eseguirla, per poter offrire "Annulla" sia sulla spunta singola in
// Modalità spesa sia sullo spostamento multiplo dal foglio di selezione.
function snapshotShopRowForUndo(cb){
  const rowKeys = cb.dataset.shopKeys.split(',');
  const pantryKey = (cb.dataset.shopName||'').trim().toLowerCase();
  return {
    pantryKey,
    hadPantryItem: Object.prototype.hasOwnProperty.call(state.pantryItems, pantryKey),
    prevPantryItem: state.pantryItems[pantryKey] ? {...state.pantryItems[pantryKey]} : undefined,
    hadConfirmedShop: Object.prototype.hasOwnProperty.call(state.pantryConfirmedShop, pantryKey),
    prevConfirmedShop: state.pantryConfirmedShop[pantryKey],
    rowKeys,
    prevDismissed: rowKeys.map(k=>state.shopDismissed[k])
  };
}
function restoreShopRowSnapshot(snap){
  if(snap.hadPantryItem) state.pantryItems[snap.pantryKey] = snap.prevPantryItem;
  else delete state.pantryItems[snap.pantryKey];
  if(snap.hadConfirmedShop) state.pantryConfirmedShop[snap.pantryKey] = snap.prevConfirmedShop;
  else delete state.pantryConfirmedShop[snap.pantryKey];
  snap.rowKeys.forEach((k,idx)=>{
    const prev = snap.prevDismissed[idx];
    if(prev !== undefined) state.shopDismissed[k] = prev; else delete state.shopDismissed[k];
  });
}

// Rinominare cambia anche la chiave (derivata dal nome): se il nuovo nome
// coincide con un'altra voce già esistente, le quantità si sommano invece
// di perdersi. Ritorna la chiave da usare dopo la modifica.
// La rinomina si propaga anche agli ingredienti delle ricette (vedi
// getIngredientsFor/ingredientRenames), così un nome unificato in Dispensa
// vale ovunque quell'ingrediente compaia — senza dover editare ogni ricetta.
function renamePantryItem(oldKey, newName){
  const trimmed = (newName||'').trim();
  const existing = state.pantryItems[oldKey];
  if(!trimmed || !existing) return oldKey;
  const newKey = trimmed.toLowerCase();
  if(newKey === oldKey){
    existing.nome = trimmed;
    return oldKey;
  }
  if(state.pantryItems[newKey]){
    state.pantryItems[newKey].qty = (state.pantryItems[newKey].qty || 0) + (existing.qty || 0);
  } else {
    state.pantryItems[newKey] = { nome: trimmed, qty: existing.qty, luogo: existing.luogo, cat: existing.cat };
  }
  delete state.pantryItems[oldKey];
  // redirige anche chi puntava già al vecchio nome, per non spezzare la catena
  for(const k in state.ingredientRenames){
    if((state.ingredientRenames[k]||'').trim().toLowerCase() === oldKey) state.ingredientRenames[k] = trimmed;
  }
  state.ingredientRenames[oldKey] = trimmed;
  return newKey;
}

// Categoria scelta a mano in Dispensa per quell'ingrediente (se c'è): vale
// anche in Spesa, così un ingrediente sta nello stesso reparto in entrambe.
function pantryCatFor(ingrediente){
  const it = state.pantryItems[(ingrediente||'').trim().toLowerCase()];
  return knownDept(it && it.cat);
}
function classifyDept(ingrediente){
  const s = (ingrediente||'').toLowerCase();
  for(const [kw, dept] of DEPT_RULES){ if(s.includes(kw)) return dept; }
  return 'altro';
}

const recipeByName = {};
DATA.recipes.forEach(r=>{ recipeByName[r.nome] = r; });

// Catalogo + ricette create a mano (state.customRecipes), unite ovunque prima
// si usava solo DATA.recipes: ricerca, suggerimenti di scambio, generazione
// casuale del menù, elenco in Ricette.
function allRecipeMetas(){
  return DATA.recipes.map(r=>r.nome).concat(Object.keys(state.customRecipes)).map(getRecipeMeta).filter(Boolean);
}

// Le modifiche fatte a mano dall'utente (Menù o Prep, sono la stessa modale)
// vivono in state.recipeEdits e si sovrappongono ai dati statici del catalogo,
// oppure a una ricetta creata da zero (state.customRecipes, non presente nel
// catalogo DATA.recipes): così restano sincronizzate ovunque la ricetta
// compaia, senza duplicare nulla. I default coprono solo i campi che il resto
// del codice legge senza controllo di esistenza (liste/filtri).
// Una ricetta "eliminata" (state.hiddenRecipes) sparisce ovunque: DATA.recipes
// è statico e non si può rimuovere davvero, quindi la si nasconde soltanto.
function getRecipeMeta(name){
  if(state.hiddenRecipes[name]) return null;
  const base = recipeByName[name] || state.customRecipes[name];
  if(!base) return null;
  const edit = state.recipeEdits[name];
  return Object.assign({ stagioni:['tutto'], gradimento:'', attrezzatura:[], tipologia:'primo' }, base, edit);
}
// Fonte della ricetta: un indirizzo web diventa "Vedi ricetta" (si apre in
// una nuova scheda); un testo qualsiasi (es. "ricettario", per le ricette
// copiate da un quaderno) si mostra così com'è, senza link.
function sourceLinkHtml(det){
  const link = det && det.link ? String(det.link).trim() : '';
  if(!link) return '';
  if(!/^https?:\/\//i.test(link)) return `<span class="source-link source-text">Fonte: ${escapeHtml(link)}</span>`;
  return `<a class="source-link" href="${escapeAttr(det.link)}" target="_blank" rel="noopener">Vedi ricetta <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ic" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M6 6v2h8.59L5 17.59L6.41 19L16 9.41V18h2V6z"></path></svg></a>`;
}
function getRecipeDetails(name){
  const base = DATA.recipeDetails[name] || null;
  const edit = state.recipeEdits[name];
  if(!edit) return base;
  const merged = Object.assign({}, base || {}, edit);
  // Una modifica salvata quando la ricetta non aveva ancora un link lo
  // registra vuoto: il link aggiunto poi al catalogo resta comunque visibile.
  if(!merged.link && base && base.link) merged.link = base.link;
  return merged;
}

// Ingredienti "veri" per una ricetta: se è stata modificata a mano uso quelli
// aggiornati, altrimenti quelli curati dal dataset, altrimenti quelli eventualmente
// aggiunti a mano tramite il form rapido. I nomi vengono passati attraverso
// ingredientRenames: rinominare un ingrediente in Dispensa lo aggiorna così ovunque
// compaia nelle ricette, senza toccare i dati statici.
// Nomi ingrediente unificati, concordati con l'utente (doppioni dello stesso
// ingrediente scritto in modi diversi nelle ricette): valgono come sinonimi
// di base, applicati in lettura da getIngredientsFor insieme a quelli creati
// dall'app (state.ingredientRenames, che hanno la precedenza) — così
// funzionano anche sulle ricette modificate dall'app, senza riscriverle.
// Chiavi in minuscolo, come ingredientRenames.
const CURATED_INGREDIENT_RENAMES = {
  'carote':'Carota', 'uovo':'Uova', 'uova sode':'Uova', 'tuorli':'Uova', 'pomodoro':'Pomodori',
  'scorza di limone':'Limone (scorza)',
  'menta fresca':'Menta', 'mentuccia (o menta)':'Menta', 'noci sgusciate':'Noci',
  'olio di semi per friggere':'Olio per friggere',
  'salsiccia (verzini)':'Salsiccia', 'salsiccia di maiale':'Salsiccia',
  'peperoncino fresco':'Peperoncino', 'peperoncino fresco o secco':'Peperoncino', 'peperoni misti (rossi e gialli)':'Peperoni',
  'croste di parmigiano (facoltative)':'Crosta di parmigiano',
  'pecorino romano grattugiato':'Pecorino grattugiato', 'parmigiano a scaglie':'Parmigiano grattugiato',
  'filetti di salmone':'Salmone', 'tranci di salmone':'Salmone',
  'vino rosso corposo':'Vino rosso', 'vino rosso leggero':'Vino rosso', 'funghi misti freschi':'Funghi misti', 'scalogno piccolo':'Scalogno',
  'brodo vegetale o acqua':'Brodo vegetale', 'brodo vegetale o acqua calda':'Brodo vegetale',
  'fettine di vitello (o lombata)':'Fettine di vitello', 'mozzarella o bocconcini':'Mozzarella',
  'piselli (surgelati o già lessati)':'Piselli', 'insalata mista o lattuga':'Insalata',
  'succo di limone':'Limone (succo)',
  'sale':'Sale fino',
  // Nomi generici di un gruppo (vedi CURATED_PANTRY_GROUPS): una ricetta che
  // li chiede viene soddisfatta da qualsiasi voce di Dispensa del gruppo.
  'pasta corta (ditalini o mista)':'Pasta corta', 'pasta corta (ditalini o tubetti)':'Pasta corta',
  'pasta corta (fusilli o mezze maniche)':'Pasta corta', 'pasta corta (fusilli o penne)':'Pasta corta',
  'pasta corta (mezze maniche o penne)':'Pasta corta', 'pasta corta (orecchiette o fusilli)':'Pasta corta',
  'pasta corta (penne o mezze maniche)':'Pasta corta', 'pasta corta (rigatoni o mezze maniche)':'Pasta corta',
  'pasta corta (rigatoni o penne)':'Pasta corta', 'pasta mista o corta':'Pasta corta', 'pasta piccola':'Pasta corta',
  'pasta (linguine o spaghetti)':'Pasta lunga', 'pasta (tonnarelli o spaghetti)':'Pasta lunga', 'spaghetti o bucatini':'Pasta lunga',
  'farina 0 (o mix con manitoba)':'Farina', 'farina 00 (o mix con manitoba)':'Farina',
  'grana o parmigiano a scaglie':'Formaggio grattugiato',
  'olive (verdi e nere)':'Olive', 'olive nere e verdi':'Olive',
  'aceto (balsamico o di vino)':'Aceto'
};
// Gruppi di Dispensa concordati con l'utente: il nome generico usato nelle
// ricette (matchName) e i nomi delle voci di Dispensa che ne fanno parte
// (assegnati una tantum alle voci già presenti, vedi pantryGroupMigrated3).
const CURATED_PANTRY_GROUPS = {
  'pasta-corta': { group:{ label:'Pasta corta', matchName:'pasta corta', cat:'pane' }, members:['fusilli','penne','pennette','rigatoni','mezze maniche','farfalle','sedani','sedanini','ditalini','tubetti','tortiglioni','pipe','conchiglie','conchiglioni','orecchiette','gomiti','caserecce','gemelli','pasta mista'] },
  'pasta-lunga': { group:{ label:'Pasta lunga', matchName:'pasta lunga', cat:'pane' }, members:['spaghetti','spaghettoni','linguine','tagliatelle','bucatini','tonnarelli','fettuccine','vermicelli','capellini','trenette','pappardelle','trofie'] },
  'farina': { group:{ label:'Farina', matchName:'farina', cat:'pane' }, members:['farina 00','farina 0','manitoba','farina manitoba','farina di grano tenero'] },
  'formaggio-grattugiato': { group:{ label:'Formaggio grattugiato', matchName:'formaggio grattugiato', cat:'latticini' }, members:['parmigiano','parmigiano grattugiato','parmigiano reggiano','grana','grana padano','pecorino','pecorino grattugiato','pecorino romano'] },
  'olive': { group:{ label:'Olive', matchName:'olive', cat:'dispensa' }, members:['olive nere','olive verdi','olive taggiasche','olive taggiasche denocciolate','olive nere di gaeta'] },
  'aceto': { group:{ label:'Aceto', matchName:'aceto', cat:'dispensa' }, members:['aceto balsamico','aceto di vino','aceto di vino bianco','aceto di vino rosso','aceto di mele'] },
  'carne-macinata': { group:{ label:'Carne macinata', matchName:'carne macinata', cat:'carne' }, members:['carne macinata mista','carne macinata di manzo','macinato','macinato misto','macinato di manzo'] }
};
// Un ingrediente di ricetta che va diviso in più righe: "Limone (scorza e
// succo)" diventa "Limone (scorza)" + "Limone (succo)". La quantità resta
// sulla prima riga; il succo è dello stesso limone, quindi "q.b." — altrimenti
// in Spesa comparirebbero due limoni per una ricetta sola.
const CURATED_INGREDIENT_SPLITS = {
  'limone (scorza e succo)': [{ ingrediente:'Limone (scorza)' }, { ingrediente:'Limone (succo)', qta:'q.b.' }]
};
// Unisce le voci di Dispensa scritte con uno dei nomi unificati (vedi
// CURATED_INGREDIENT_RENAMES) nella voce col nome nuovo: quantità sommate, e
// unità/categoria/gruppo/luogo presi da quella vecchia solo dove la nuova non
// li ha già; lo stato "da comprare" passa alla voce nuova. Chiamata dalle
// migrazioni una tantum pantryNamesCurated1/2.
function mergeRenamedPantryItems(){
  Object.keys(state.pantryItems).forEach(oldKey=>{
    const target = CURATED_INGREDIENT_RENAMES[oldKey];
    if(!target) return;
    const newKey = target.toLowerCase();
    if(newKey === oldKey) return;
    const old = state.pantryItems[oldKey];
    const cur = state.pantryItems[newKey];
    if(cur){
      if(typeof old.qty === 'number') cur.qty = (typeof cur.qty === 'number' ? cur.qty : 0) + old.qty;
      ['unit','cat','group','luogo'].forEach(f=>{ if(!cur[f] && old[f]) cur[f] = old[f]; });
    } else {
      state.pantryItems[newKey] = Object.assign({}, old, { nome: target });
    }
    delete state.pantryItems[oldKey];
    if(state.pantryConfirmedShop[oldKey]){ state.pantryConfirmedShop[newKey] = true; delete state.pantryConfirmedShop[oldKey]; }
    delete state.shopDismissed['oos_'+oldKey];
  });
}
function getIngredientsFor(name){
  const edit = state.recipeEdits[name];
  const det = DATA.recipeDetails[name];
  let list;
  if(edit && edit.ingredienti) list = edit.ingredienti;
  else if(det) list = det.ingredienti;
  else list = state.recipeIngredients[name] || [];
  list = list.flatMap(it=>{
    const split = CURATED_INGREDIENT_SPLITS[(it.ingrediente||'').trim().toLowerCase()];
    return split ? split.map(part => Object.assign({}, it, part)) : [it];
  });
  const renames = Object.assign({}, CURATED_INGREDIENT_RENAMES, state.ingredientRenames);
  return list.map(it=>{
    let displayName = it.ingrediente;
    const seen = new Set();
    let key = (displayName||'').trim().toLowerCase();
    while(renames[key] && !seen.has(key)){
      seen.add(key);
      displayName = renames[key];
      key = displayName.trim().toLowerCase();
    }
    return displayName === it.ingrediente ? it : Object.assign({}, it, { ingrediente: displayName });
  });
}

// Vocabolario di nomi ingrediente noti, per il suggeritore di "Aggiungi" in
// Spesa: unione dei nomi già in Dispensa (anche finiti) e di quelli usati in
// tutte le ricette — così anche un ingrediente mai avuto in Dispensa ma già
// presente in una ricetta suggerisce il nome esatto, invece di farlo
// reinventare a mano (e magari sbagliare la corrispondenza).
// Insieme di nomi senza doppioni che differiscono solo per maiuscole/spazi
// ("passata" e "Passata"): vince la prima grafia aggiunta — chi chiama
// aggiunge prima i nomi di Dispensa, così resta quella scelta lì.
function caseInsensitiveNameSet(){
  const byKey = new Map();
  return {
    add(name){ const n = (name||'').trim(); const k = n.toLowerCase(); if(n && !byKey.has(k)) byKey.set(k, n); },
    values(){ return byKey.values(); }
  };
}
function allKnownIngredientNames(){
  const names = caseInsensitiveNameSet();
  Object.values(state.pantryItems).forEach(it=>{ if(it.nome) names.add(it.nome.trim()); });
  allRecipeMetas().forEach(r=>{
    getIngredientsFor(r.nome).forEach(it=>{ if(it.ingrediente) names.add(it.ingrediente.trim()); });
  });
  return Array.from(names.values()).sort((a,b)=>IT_COLLATOR.compare(a, b));
}

// Come sopra ma con in più i nomi generici dei gruppi (es. "Pasta corta"),
// per quando si scrive l'ingrediente di una ricetta: scrivere il generico
// invece di un formato specifico fa scattare il riconoscimento per gruppo
// (vedi resolvePantryItem) su qualsiasi formato tu abbia in Dispensa.
function allKnownIngredientNamesWithGroups(){
  const names = caseInsensitiveNameSet();
  // Usata per gli ingredienti delle ricette: i prodotti per la casa
  // (detersivi, igiene...) non c'entrano.
  allKnownIngredientNames().filter(n => !isNonFoodName(n)).forEach(n=>names.add(n));
  Object.values(state.pantryGroups || {}).forEach(g=>{ if(g.label) names.add(g.label.trim()); });
  return Array.from(names.values()).sort((a,b)=>IT_COLLATOR.compare(a, b));
}

// Come allKnownIngredientNames, ma include anche gli extra aggiunti a mano
// in Spesa e la lista "Ogni settimana": per la vista "Gestisci ingredienti"
// in Dispensa serve davvero OGNI nome noto al sistema, non solo quello utile
// al suggeritore dell'autocomplete. Passa ogni nome per
// manageableIngredientNames: un ingrediente di ricetta scritto come
// alternativa ("Zucchero o miele") o con parentesi esplicativa ("Verdure
// miste (zucchine, carote, spinaci)") non è una singola voce sensata da
// gestire in Dispensa così com'è — qui si scompone nelle voci vere.
function allIngredientNamesForManager(){
  const names = caseInsensitiveNameSet();
  Object.values(state.pantryItems).forEach(it=>{ if(it.nome) names.add(it.nome.trim()); });
  allRecipeMetas().forEach(r=>{
    getIngredientsFor(r.nome).forEach(it=>{
      if(!it.ingrediente) return;
      manageableIngredientNames(it.ingrediente).forEach(n=>names.add(n));
    });
  });
  Object.values(state.shopExtras).forEach(it=>{ if(it.ingrediente) names.add(it.ingrediente.trim()); });
  DATA.generalShopping.forEach(it=>{ if(it.ingrediente) names.add(it.ingrediente.trim()); });
  return Array.from(names.values()).sort((a,b)=>IT_COLLATOR.compare(a, b));
}

// Combobox "leggera" per un campo nome-ingrediente creato fuori dal normale
// ciclo render() (righe aggiunte a mano nella modale Modifica ricetta): pura
// manipolazione DOM, non tocca state/render per non perdere quanto già
// scritto nelle altre righe. Suggerisce ingredienti e gruppi noti mentre
// scrivi; se quello che hai scritto non esiste, propone di "crearlo" — un
// tocco esplicito, così un nome nuovo è una scelta voluta e non un refuso.
function attachIngredientCombobox(input){
  if(!input || input.dataset.comboAttached) return;
  input.dataset.comboAttached = '1';
  input.setAttribute('autocomplete', 'off');
  const wrapper = document.createElement('div');
  wrapper.className = 'add-ing-combo';
  input.parentNode.insertBefore(wrapper, input);
  wrapper.appendChild(input);
  const list = document.createElement('div');
  list.className = 'add-ing-suggestions';
  wrapper.appendChild(list);

  function renderSuggestions(){
    const q = input.value.trim().toLowerCase();
    if(!q){ list.innerHTML = ''; return; }
    const pool = allKnownIngredientNamesWithGroups();
    const matches = pool.filter(n => n.toLowerCase().includes(q)).slice(0, 8);
    const exact = pool.some(n => n.toLowerCase() === q);
    let html = matches.map(n=>`<button type="button" class="add-ing-suggestion" data-combo-pick>${escapeHtml(n)}</button>`).join('');
    if(!exact) html += `<button type="button" class="add-ing-suggestion add-ing-suggestion-new" data-combo-create>+ Crea "${escapeHtml(input.value.trim())}" come nuovo ingrediente</button>`;
    list.innerHTML = html;
  }
  input.addEventListener('input', renderSuggestions);
  input.addEventListener('focus', renderSuggestions);
  // mousedown, non click: precede il blur dell'input, altrimenti la lista
  // sparirebbe (per il blur) prima che il tap sul suggerimento venga registrato.
  list.addEventListener('mousedown', e=>{
    const pick = e.target.closest('[data-combo-pick]');
    if(pick){ e.preventDefault(); input.value = pick.textContent; list.innerHTML = ''; input.dispatchEvent(new Event('change', {bubbles:true})); }
    const create = e.target.closest('[data-combo-create]');
    if(create){ e.preventDefault(); list.innerHTML = ''; input.dispatchEvent(new Event('change', {bubbles:true})); }
  });
  input.addEventListener('blur', ()=>{ setTimeout(()=>{ list.innerHTML = ''; }, 150); });
}

const state = {
  tab: 'menu',
  shopChecked: {},
  shopDismissed: {},
  shopExtras: {},
  shopQty: {},
  shopQtyEditingKey: null,
  shopView: 'reparto', // non persistito (vedi persist()): riparte sempre da qui, non "ricorda" l'ultima vista scelta tra un caricamento e l'altro
  addIngModalOpen: false,
  addIngName: '', // ephemeral, non persistito: testo corrente del campo "Ingrediente" in Aggiungi (Spesa)
  addIngSuggestOpen: false, // ephemeral: se il menu dei suggerimenti è visibile
  addIngCursorPos: null, // ephemeral: posizione del cursore da ripristinare dopo il re-render a ogni tasto premuto
  addIngDraft: null, // ephemeral: quantità/unità/categoria/gruppo/luogo già scelti in Aggiungi (Spesa), da non perdere al re-render di ogni tasto nel nome
  pantryAddModalOpen: false,
  pantryChecked: {},
  pantryItems: {},
  pantrySeeded: false,
  pantryQtyMigrated: false,
  pantryUtilityLuogoMigrated: false,
  pantryUnitReviewed: false,
  pantryGroupMigrated: false,
  pantryGroupMigrated2: false,
  pantryNamesCurated1: false,
  pantryNamesCurated2: false,
  pantryGroupMigrated3: false,
  shopKeysByName1: false,
  baseDeptMigrated1: false,
  orphanWeekKeysPurged1: false,
  week0Start: null, // 'AAAA-MM-GG': il sabato a cui appartengono i dati della settimana 0 (vedi rolloverWeeksIfNeeded)
  pantryGroups: {
    'pasta-corta': { label:'Pasta corta', matchName:'pasta corta', cat:'pane' },
    'pasta-lunga': { label:'Pasta lunga', matchName:'pasta lunga', cat:'pane' },
    'riso-carnaroli-vialone': { label:'Riso Carnaroli o Vialone Nano', matchName:'riso carnaroli o vialone nano', cat:'pane' },
    'provolone-brie': { label:'Provolone o brie', matchName:'provolone o brie', cat:'latticini' },
    'zucchero-miele': { label:'Zucchero o miele', matchName:'zucchero o miele', cat:'dispensa' },
    'rosmarino-alloro': { label:'Rosmarino o alloro', matchName:'rosmarino o alloro', cat:'dispensa' },
    'guanciale-pancetta': { label:'Guanciale o pancetta', matchName:'guanciale o pancetta', cat:'carne' },
    'basilico-menta': { label:'Basilico o menta', matchName:'basilico o menta', cat:'verdura' },
    'olio-burro': { label:'Olio EVO o burro', matchName:'olio evo o burro', cat:'dispensa' },
    'grana-parmigiano': { label:'Grana o parmigiano a scaglie', matchName:'grana o parmigiano a scaglie', cat:'latticini' }
  },
  pantryGroupsModalOpen: false,
  deptsModalOpen: false, // non persistito: modale "Gestisci categorie" aperta/chiusa
  customDepts: {}, // categorie create dall'utente, condivise tra gli spazi (vedi applyCustomDepts)
  pantryView: 'cibo', // 'cibo' | 'casa' — non persistito (vedi persist()): stesso motivo di shopView
  pantrySearch: '', // non persistito: filtro testuale corrente in Dispensa, si resetta a ogni apertura dell'app
  ingredientManagerOpen: false, // non persistito: modale "Gestisci ingredienti" aperta/chiusa
  ingredientManagerSearch: '', // non persistito: filtro testuale corrente lì dentro
  prepSearchOpen: false, // non persistito: campo di ricerca ricette (Prep) visibile o ridotto a icona
  pantrySearchOpen: false, // non persistito: campo di ricerca Dispensa visibile o ridotto a icona
  whatsNewSeen: null, // vecchio: una sola "già vista" per tutto lo spazio — non più usato, vedi whatsNewSeenBy
  whatsNewSeenBy: {}, // { persona: ultima WHATS_NEW.version chiusa } — per persona, non per spazio (vedi renderWhatsNewModal)
  pantryEditingKey: null,
  linkNoteEditingKey: null, // dayKey della nota "Variante" attualmente in modifica (Menù, giorni avanzo)
  pantryLuogoPicker: null,
  pantrySectionCollapsed: {}, // id sezione (luogo_X / cat_X) -> true se chiusa; aperta di default se assente
  pantrySelectMode: false, // true dopo una pressione lunga: un tap semplice seleziona/deseleziona invece di aprire il luogo-picker
  pantrySelected: {}, // pantryKey -> true, selezione corrente in Dispensa (qualsiasi riga, non solo Finiti; non persistita)
  shopFinitiOpen: false, // accordion "Finiti", condiviso da Per reparto e Per giorno, chiuso di default
  shopSectionCollapsed: {}, // id sezione (reparto_X / giorno_X) -> true se chiusa; aperta di default se assente
  pantryConfirmedShop: {}, // pantryKey -> true, ingrediente finito "aggiunto alla lista": in Spesa/per reparto esce dal blocco Finiti e si mescola nel suo reparto vero
  pantryEditKey: null,
  mealsModelMigrated: false, // una tantum: passaggio da "una ricetta al giorno" a due pasti (pranzo/cena), ognuno {principale, contorni[]} — vedi il blocco di migrazione più sotto
  mealsModelMigrated2: false, // una tantum: "chi cucina" da per giorno a per pasto
  tempoRulesMigrated: false, // una tantum: dayTempoCap (per giorno 0-6) -> weekTempoBase/weekTempoExceptions (base + eccezioni, pranzo/cena separati ven-dom)
  staleRecipesPurged: false, // una tantum: pulisce i pasti già pianificati che puntano a una ricetta cancellata PRIMA che "Elimina" imparasse a farlo da solo (vedi purgeRecipeFromPlanning)
  weekOverrides: {}, // {i: {pranzo:{principale,contorni[]}, cena:{principale,contorni[]}}}
  weekOverridePicked: {}, // {i: {pranzo:bool, cena:bool}}
  weekBaseline: null, // stessa forma di weekOverrides, riempita dal generatore
  // Tetto di durata per la generazione: un solo valore di base per tutta la
  // settimana (cena tutti i giorni, pranzo dove si genera — ven/sab/dom).
  // "weekTempoExceptions" contiene solo i giorni/pasti che si scostano dalla
  // base, chiave "i_meal" (es. "5_cena", "5_pranzo" — così ven/sab/dom
  // possono avere un tetto diverso tra pranzo e cena dello stesso giorno).
  weekTempoBase: 'normale',
  weekTempoExceptions: {},
  userColors: { mara:'#e03c1e', ste:'#87282b' }, // colore identità scelto da ciascun utente (profilo in Impostazioni)
  notifDismissed: {}, // mealKey ("weekIdx_i_meal") -> true, promemoria "tocca a te cucinare" già chiuso per quel pasto
  mealsDoneReminderDismissed: {}, // mealKey ("weekIdx_i_meal") -> true, promemoria "ieri hai mangiato X?" già chiuso per quel pasto (senza segnarlo mangiato)
  genSettingsOpen: null, // null = chiuso; 'plain' = solo impostazioni (da "Aggiungi settimana"); un numero = impostazioni + genera/rigenera per quella settimana (dal titolo settimana)
  showPastDays: false, // mostra le card degli ultimi 3 giorni passati (nascoste di default) nella settimana corrente
  shopMode: false, // "Modalità spesa" in Spesa: se attiva, spuntare una riga la sposta subito in Dispensa invece di limitarsi a segnarla presa
  extraWeeks: [], // settimane pianificate oltre la prima: [{ baseline:{0..6:{pranzo,cena}}, overrides:{}, overridePicked:{}, mealsDone:{} }, ...]
  dayLinks: {}, // pasto "avanzo" -> pasto sorgente, entrambi come chiave "weekIdx_i_meal" (es. "0_1_pranzo" -> "0_0_cena")
  dayLinkNotes: {}, // pasto "avanzo" -> nota libera (es. "fatta a frittata"), stessa chiave di dayLinks
  dayPortions: {}, // "weekIdx_i_meal" -> numero porzioni scelto per quel pasto (default 2, 3 per le cene-apripista — vedi generateWeek)
  mealLocked: {}, // "weekIdx_i_meal" -> true: la rigenerazione della settimana non lo tocca (vedi generateWeek). Solo pasti non-avanzo.
  cooks: {}, // chiave "weekIdx_i" -> 'mara' | 'ste', chi cucina quel giorno (diventerà per pasto in uno stadio successivo, vedi piano)
  shopAssignees: {}, // reparto -> 'mara' | 'ste' | null, chi se ne occupa alla spesa
  linkPickerOpenDay: null,
  undoToast: null, // { message, undoFn } | null — toast "Annulla" temporaneo, solo di sessione: undoFn è una funzione, quindi va tenuto FUORI dal payload di persist() (mai serializzato)
  mealOverflowOpen: null, // mealKey del pasto per cui è aperto il foglio "⋯" (azioni rare)
  tempoExceptionAdding: null, // null | 'pickingDay' | {day, meal} — stadio del flusso "+ aggiungi un'eccezione" nelle regole della settimana
  avanzoDiPickerOpenDay: null,
  contornoPickerOpenMeal: null, // ephemeral: mealKey del pasto per cui è aperto il pannello "+ contorno"
  recipeIngredients: JSON.parse(JSON.stringify(DATA.recipeIngredientsInitial)),
  ingredientRenames: {},
  ingredientNotes: {}, // nome ingrediente (minuscolo) -> nota libera, mostrata su ogni occorrenza in Spesa qualunque sia il pasto/settimana
  ingNoteEditingKey: null, // ephemeral: nome ingrediente la cui nota è in modifica
  recipeEdits: {},
  recipeEditName: null,
  customRecipes: {}, // nome -> {nome}: ricette create a mano, non presenti nel catalogo DATA.recipes
  hiddenRecipes: {}, // nome -> true: ricette del catalogo "eliminate" (DATA.recipes è statico, quindi si nascondono invece di rimuoverle)
  newRecipeModalOpen: false,
  newRecipeError: '',
  expandedDay: null,
  expandedRecipe: null,
  swapOpenDay: null,
  swapFilters: {},
  mealsDone: {}, // {i: {pranzo:bool, cena:bool}}
  doneModalDay: null, // chiave "weekIdx_i" del giorno per cui è aperta la modale "Ricetta fatta!" (sempre riferita alla cena, come il resto della UI in questo stadio)
  doneModalQty: {},
  doneQtyEditingKey: null, // ephemeral: nome ingrediente il cui campo "quanto ne hai usato" è in modifica diretta (modale "Ricetta fatta!")
  doneModalFinished: {}, // ephemeral: nome ingrediente "a spanne" (unit 'none') -> true se spuntato "L'hai finito?" nella modale "Ricetta fatta!"; non presente = non spuntato
  doneModalLeftover: '', // ephemeral: testo libero "cosa è avanzato" nella modale "Ricetta fatta!", precompilato col nome della ricetta
  doneModalLeftoverLuogo: 'frigo', // ephemeral: luogo scelto per l'avanzo (icona con luogo-picker, come in Dispensa)
  doneModalLeftoverCat: 'avanzi', // ephemeral: reparto scelto per l'avanzo; di default "Avanzi", ma modificabile (es. un sugo che ricongeli va in "Legumi e conserve")
  doneModalLeftoverChecked: false, // ephemeral: se spuntato, l'avanzo va in Dispensa alla conferma; sempre deselezionato al caricamento
  doneModalLeftoverPickerOpen: false, // ephemeral: luogo-picker dell'avanzo aperto/chiuso
  doneModalLeftoverCatPickerOpen: false, // ephemeral: cat-picker (reparto) dell'avanzo aperto/chiuso
  filtersOpen: false, // { [dayIndex]: {search:'', cat:'same'|'all'} }
  filters: { cat:[], tipo:[], tempo:'', pian:'', stagione:'', avanzi:'', freezer:'', grad:'', attrezz:'', search:'' } // cat e tipo sono multi-selezione (array), gli altri restano a valore singolo
};

// Le 4 tab vivono anche come "pagine" via anchor (#menu/#spesa/#prep/#dispensa):
// un reload o il tasto indietro del browser restano sulla tab corrente invece
// di tornare sempre a Menù.
const TAB_KEYS = ['menu', 'spesa', 'prep', 'dispensa'];
function tabFromHash(){
  const h = window.location.hash.replace('#', '');
  return TAB_KEYS.includes(h) ? h : 'menu';
}
state.tab = tabFromHash();
window.addEventListener('hashchange', ()=>{
  const next = tabFromHash();
  if(next !== state.tab){ state.tab = next; render(); }
});

// Sincronizzazione condivisa via Firebase Realtime Database: chiunque apra la
// pagina legge/scrive lo stesso stato, con aggiornamenti in tempo reale tra
// dispositivi diversi. Import dinamico per restare in un unico <script> classico.
const firebaseReady = (async ()=>{
  try{
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js");
    const { getDatabase, ref, set: fbSet, update: fbUpdate, onValue } = await import("https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js");
    const { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } = await import("https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js");
    const firebaseConfig = {
      apiKey: "AIzaSyDVlyYgyJ1rTtyitMc3xoNhvBm3HPpC0g8",
      authDomain: "cookpop-c91d6.firebaseapp.com",
      databaseURL: "https://cookpop-c91d6-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "cookpop-c91d6",
      storageBucket: "cookpop-c91d6.firebasestorage.app",
      messagingSenderId: "384434265113",
      appId: "1:384434265113:web:63e745711537a29f885e88"
    };
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    // Parametrizzato per percorso (non più un ref fisso) perché ora ci sono
    // più percorsi in gioco: uno personale per spazio (dispensa/menù/spesa,
    // isolato) e uno condiviso per il catalogo ricette/ingredienti — vedi
    // SPACE_ROUTES/CATALOG_STATE_PATH più sotto.
    window.cookpopSync = {
      save(path, data){ return fbSet(ref(db, path), data); },
      // Multi-path update: scrive solo le chiavi passate (es. "pantryItems/farina"),
      // lasciando intatto tutto il resto del percorso — vedi buildFirebasePatch/runPersist.
      patch(path, data){ return Object.keys(data).length ? fbUpdate(ref(db, path), data) : Promise.resolve(); },
      onChange(path, cb){ onValue(ref(db, path), (snap)=>cb(snap.val())); }
    };
    const auth = getAuth(app);
    window.cookpopAuth = {
      signIn(email, password){ return signInWithEmailAndPassword(auth, email, password); },
      signOut(){ return signOut(auth); },
      onAuthStateChanged(cb){ onAuthStateChanged(auth, cb); }
    };
  }catch(e){
    console.error('Firebase non disponibile: nessuna sincronizzazione tra dispositivi, uso solo il salvataggio locale', e);
  }
})();

// Firebase Realtime Database vieta "." "#" "$" "/" "[" "]" nelle chiavi, ma
// alcuni nomi di ricetta le contengono (es. "Orata/branzino al forno con
// patate", usato come chiave in recipeIngredients): le codifichiamo solo nel
// payload verso Firebase, lasciando invariato il formato locale/JSON.
function fbKeyEncode(k){ return k.replace(/[%.#$\/\[\]]/g, c => '%'+c.charCodeAt(0).toString(16).padStart(2,'0')); }
function fbKeyDecode(k){ return k.replace(/%([0-9a-fA-F]{2})/g, (_,h) => String.fromCharCode(parseInt(h,16))); }
function encodeKeysForFirebase(obj){
  const out = {};
  for(const k in obj) out[fbKeyEncode(k)] = obj[k];
  return out;
}
function decodeKeysFromFirebase(obj){
  const out = {};
  for(const k in obj) out[fbKeyDecode(k)] = obj[k];
  return out;
}

// Mostra il gate di login finché non c'è un utente autenticato; risolve
// subito se Firebase non è raggiungibile (offline: si procede con la sola
// cache locale, coerente col fallback già previsto in loadState/persist).
let loggedInEmail = null;
function waitForAuth(){
  return new Promise((resolve)=>{
    if(!window.cookpopAuth){ resolve(); return; }
    const gate = document.getElementById('login-gate');
    const emailInput = document.getElementById('login-email');
    const passInput = document.getElementById('login-password');
    const errorBox = document.getElementById('login-error');
    const submitBtn = document.getElementById('login-submit');
    const logoutBtn = document.getElementById('logout-btn');
    let resolved = false;

    window.cookpopAuth.onAuthStateChanged((user)=>{
      loggedInEmail = user ? user.email : null;
      gate.style.display = user ? 'none' : 'flex';
      if(logoutBtn) logoutBtn.style.display = user ? 'block' : 'none';
      if(user && !resolved){ resolved = true; resolve(); }
    });

    async function doLogin(){
      errorBox.textContent = '';
      submitBtn.disabled = true;
      try{
        await window.cookpopAuth.signIn(emailInput.value.trim(), passInput.value);
      }catch(e){
        errorBox.textContent = 'Email o password non corretti.';
      }
      submitBtn.disabled = false;
    }
    submitBtn.addEventListener('click', doLogin);
    passInput.addEventListener('keydown', (e)=>{ if(e.key === 'Enter') doLogin(); });
    if(logoutBtn) logoutBtn.addEventListener('click', ()=> window.cookpopAuth.signOut());
  });
}

// Chi sta usando l'app ora: dedotto dall'account con cui ha fatto login
// (le due email contengono "mara"/"ste"), non serve più un toggle manuale.
function getCurrentUser(){
  const email = (loggedInEmail || '').toLowerCase();
  if(email.includes('mara')) return 'mara';
  if(email.includes('ste')) return 'ste';
  return null;
}

// Spazi diversi (nuclei familiari) che condividono lo stesso account
// Firebase/progetto ma NON i dati personali: stesso schema di sempre per
// riconoscere chi sei (l'email "finta" contiene solo un nome), che qui
// determina anche QUALE percorso Firebase legge/scrive dispensa/menù/spesa
// — ognuno il suo, isolato dagli altri spazi. Aggiungerne uno nuovo (es. un
// altro parente) è solo una riga qui + un nuovo account nella Firebase
// Console con un'email che contiene quel nome, nessun'altra modifica.
// Il catalogo ricette/ingredienti (vedi CATALOG_STATE_PATH) resta invece
// condiviso da tutti gli spazi, non è qui.
const CATALOG_STATE_PATH = 'catalog-state';
const SPACE_ROUTES = [
  { id: 'default', match: ['mara','ste'], path: 'quaderno-state' },
  { id: 'cugina', match: ['cugina'], path: 'spaces/cugina/state' },
  { id: 'mamma', match: ['mamma'], path: 'spaces/mamma/state' }
];
function getSpaceRoute(){
  const email = (loggedInEmail || '').toLowerCase();
  return SPACE_ROUTES.find(r => r.match.some(m => email.includes(m))) || SPACE_ROUTES[0];
}
// Campi del catalogo condiviso: curatela ricette (aggiunte/modificate/
// nascoste), ingredienti delle ricette, sinonimi e definizioni dei gruppi —
// uguali per tutti gli spazi. Le note personali su un ingrediente
// (state.ingredientNotes) restano invece per spazio, apposta. Anche
// pantryGroupMigrated/2 restano fuori da qui pur riguardando i gruppi:
// assegnano il campo "gruppo" alle voci di state.pantryItems, che è
// personale — un flag condiviso farebbe girare quella migrazione una sola
// volta in assoluto (dal primo spazio ad aprire l'app) invece che una volta
// per spazio, lasciando gli altri spazi senza gruppi assegnati alla loro Dispensa.
const CATALOG_FIELDS = ['recipeIngredients','ingredientRenames','recipeEdits','customRecipes','hiddenRecipes','pantryGroups','customDepts'];
function decodeCatalogSaved(saved){
  if(saved.recipeIngredients) saved.recipeIngredients = decodeKeysFromFirebase(saved.recipeIngredients);
  if(saved.ingredientRenames) saved.ingredientRenames = decodeKeysFromFirebase(saved.ingredientRenames);
  if(saved.recipeEdits) saved.recipeEdits = decodeKeysFromFirebase(saved.recipeEdits);
  if(saved.customRecipes) saved.customRecipes = decodeKeysFromFirebase(saved.customRecipes);
  if(saved.hiddenRecipes) saved.hiddenRecipes = decodeKeysFromFirebase(saved.hiddenRecipes);
  return saved;
}
function encodeCatalogForFirebase(payload){
  return JSON.parse(JSON.stringify({
    ...payload,
    recipeIngredients: encodeKeysForFirebase(payload.recipeIngredients),
    ingredientRenames: encodeKeysForFirebase(payload.ingredientRenames),
    recipeEdits: encodeKeysForFirebase(payload.recipeEdits),
    customRecipes: encodeKeysForFirebase(payload.customRecipes),
    hiddenRecipes: encodeKeysForFirebase(payload.hiddenRecipes)
  }));
}
const COOK_LABEL = { mara:'Mara', ste:'Ste' };
// Tavolozza di colori preimpostati tra cui scegliere il proprio "colore identità"
// (profilo in Impostazioni): solo toni abbastanza scuri/saturi da restare leggibili
// col testo chiaro sopra (--bg) del cook-pill.
const USER_COLOR_PRESETS = ['#e03c1e','#87282b','#c9702e','#b08d2b','#5a7517','#2e7d6b','#546e7a','#7a5a8a'];
function applyUserColors(){
  document.documentElement.style.setProperty('--user-color-mara', state.userColors.mara || '#e03c1e');
  document.documentElement.style.setProperty('--user-color-ste', state.userColors.ste || '#87282b');
}

// Tema e colore d'accento: preferenze di QUESTO dispositivo (localStorage,
// non passano da persist()/Firebase) — cambiarle sul proprio telefono non
// cambia nulla sull'altro. Il tema viene già applicato prima del primo
// paint da uno script inline in index.html (per evitare il lampo con i
// colori sbagliati); queste funzioni servono a riapplicarlo quando l'utente
// cambia scelta dalle Impostazioni, e a tenere sincronizzato il meta
// theme-color della barra del browser.
const THEME_KEY = 'cookpop-theme';
const ACCENT_KEY = 'cookpop-accent';
function currentTheme(){
  const t = localStorage.getItem(THEME_KEY);
  return (t === 'light' || t === 'dark') ? t : 'system';
}
function applyTheme(theme){
  if(theme === 'system') localStorage.removeItem(THEME_KEY);
  else localStorage.setItem(THEME_KEY, theme);
  if(theme === 'light' || theme === 'dark') document.documentElement.dataset.theme = theme;
  else delete document.documentElement.dataset.theme;
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const meta = document.getElementById('meta-theme-color');
  if(meta) meta.setAttribute('content', isDark ? '#18191b' : '#f3f2f2');
}
function hexToRgbTriplet(hex){
  const m = hex.replace('#','');
  return [parseInt(m.substring(0,2),16), parseInt(m.substring(2,4),16), parseInt(m.substring(4,6),16)];
}
function darkenHex(hex, amount){
  const [r,g,b] = hexToRgbTriplet(hex);
  const d = c => Math.max(0, Math.round(c * (1 - amount))).toString(16).padStart(2,'0');
  return '#' + d(r) + d(g) + d(b);
}
function applyAccent(hex){
  if(hex) localStorage.setItem(ACCENT_KEY, hex); else localStorage.removeItem(ACCENT_KEY);
  const root = document.documentElement.style;
  if(!hex){
    root.removeProperty('--gold'); root.removeProperty('--gold-dark'); root.removeProperty('--gold-rgb');
    return;
  }
  root.setProperty('--gold', hex);
  root.setProperty('--gold-dark', darkenHex(hex, 0.18));
  root.setProperty('--gold-rgb', hexToRgbTriplet(hex).join(','));
}

// Migrazioni una tantum dello stato personale, in ordine di arrivo: ognuna
// gira una sola volta per spazio (il suo flag in state, salvato su Firebase
// con gli altri dati personali — vedi buildPersonalPayload) e poi mai più.
// Per aggiungerne una: nuova voce IN FONDO con un flag mai usato prima (non
// rinominare né riordinare quelle esistenti: il flag è ciò che ricorda che è
// già stata fatta). Girano in init, subito dopo loadState, vedi runMigrations.
const MIGRATIONS = [
  // 1. Una tantum: porta gli elementi del vecchio elenco statico (DATA.pantry)
  // nell'inventario editabile, così la Dispensa parte già popolata invece
  // che vuota. Il flag evita di rimetterceli se poi vengono rimossi a mano.
  { flag: 'pantrySeeded', run(){
    DATA.pantry.forEach(p=> upsertPantryItem(p.elemento, ''));
  }},
  // 2. Una tantum: rimuove dalla Dispensa 4 voci segnaposto del vecchio elenco
  // statico (mai davvero usate) che restavano a 0 e comparivano di continuo
  // in Spesa sotto "Finiti in Dispensa".
  { flag: 'placeholderPantryRemoved', run(){
    ['pasta sfoglia/brisé','salse','spezie','torte dolci'].forEach(key=>{
      delete state.pantryItems[key];
      delete state.pantryConfirmedShop[key];
      delete state.shopDismissed['oos_'+key];
    });
  }},
  // 3. Una tantum: porta il contenuto dei vecchi 3 cassetti fissi del freezer
  // nell'inventario unico, con luogo "freezer" (porzioni/data/note testuali
  // non hanno più posto nel nuovo modello a quantità numerica).
  { flag: 'freezerSeeded', run(){
    if(state.freezer){
      Object.values(state.freezer).forEach(d=>{
        if(d && d.contenuto && d.contenuto.trim()) upsertPantryItem(d.contenuto, 'freezer');
      });
    }
  }},
  // 4. Una tantum: passa dalla vecchia quantità testuale libera (es. "6-8
  // medie") al nuovo contatore numerico con stepper. Non essendoci un modo
  // sensato di convertire un testo descrittivo in un numero, le voci
  // esistenti partono da 1 (l'utente aggiusta col +/-) invece di sparire.
  // Include anche le vecchie voci del freezer (state.freezerItems, dalla
  // migrazione precedente), che confluiscono qui con luogo "freezer".
  { flag: 'pantryQtyMigrated', run(){
    Object.keys(state.pantryItems).forEach(key=>{
      const it = state.pantryItems[key];
      if(it && typeof it.qty !== 'number'){
        state.pantryItems[key] = { nome: it.nome, qty: 1, luogo: it.luogo || 'dispensa' };
      }
    });
    if(state.freezerItems){
      Object.values(state.freezerItems).forEach(it=>{
        if(it && it.nome) upsertPantryItem(it.nome, 'freezer');
      });
    }
  }},
  // 5. Una tantum: il luogo "utility" è stato rimosso (resta solo come reparto
  // della spesa) — le voci di dispensa che lo usavano passano a "dispensa".
  { flag: 'pantryUtilityLuogoMigrated', run(){
    Object.keys(state.pantryItems).forEach(key=>{
      const it = state.pantryItems[key];
      if(it && it.luogo === 'utility') it.luogo = 'dispensa';
    });
  }},
  // 6. Una tantum: il reparto "Utility" come categoria viene rimosso (ripulisce
  // le voci categorizzate a mano come Utility) — "di solito ce l'ho già" non
  // è più un flag a parte, vedi isStaple/hasPantryStock più sotto.
  { flag: 'pantryStapleMigrated', run(){
    Object.keys(state.pantryItems).forEach(key=>{
      const it = state.pantryItems[key];
      if(!it) return;
      if(it.cat === 'utility') delete it.cat;
    });
  }},
  // 7. Una tantum: assegna l'unità di misura agli ingredienti da dispensa che
  // non ne hanno ancora una, riconoscendoli per nome (vedi PANTRY_UNIT_BY_NAME,
  // concordata con l'utente). Non tocca chi ha già un'unità impostata a mano.
  { flag: 'pantryUnitReviewed', run(){
    Object.keys(state.pantryItems).forEach(key=>{
      const it = state.pantryItems[key];
      if(it && !it.unit && PANTRY_UNIT_BY_NAME[key]) it.unit = PANTRY_UNIT_BY_NAME[key];
    });
  }},
  // 8. Una tantum: i vecchi flag "staple" non servono più (vedi isStaple), li ripulisce.
  { flag: 'pantrySpanneUnitCleared', run(){
    Object.values(state.pantryItems).forEach(it=>{
      if(it && it.staple !== undefined) delete it.staple;
    });
  }},
  // 9. Una tantum: assegna il gruppo "Pasta corta"/"Pasta lunga" ai formati di
  // pasta specifici già in Dispensa, riconoscendoli per nome — da qui in poi
  // il gruppo si assegna dal campo in Aggiungi/Modifica, o si gestisce da
  // "Gestisci gruppi" in Dispensa (state.pantryGroups).
  { flag: 'pantryGroupMigrated', run(){
    const SEED_GROUP_NAMES = {
      'pasta-corta': ['fusilli','penne','pennette','rigatoni','mezze maniche','farfalle','sedani','sedanini','ditalini','tubetti','tortiglioni','pipe','conchiglie','conchiglioni','orecchiette','gomiti','caserecce','gemelli','pasta mista'],
      'pasta-lunga': ['spaghetti','spaghettoni','linguine','tagliatelle','bucatini','tonnarelli','fettuccine','vermicelli','capellini','trenette','pappardelle','trofie']
    };
    Object.keys(state.pantryItems).forEach(key=>{
      const it = state.pantryItems[key];
      if(!it || it.group) return;
      const group = Object.keys(SEED_GROUP_NAMES).find(g => SEED_GROUP_NAMES[g].includes(key));
      if(group) it.group = group;
    });
  }},
  // 10. Una tantum: aggiunge i gruppi "X o Y" isolati (nessuna sovrapposizione con
  // altre coppie alternative nel catalogo ricette, a differenza di es. cipolla,
  // che compare in più coppie diverse e quindi non può stare in un solo gruppo)
  // e assegna il gruppo alle voci di Dispensa già presenti che li riguardano.
  { flag: 'pantryGroupMigrated2', run(){
    const NEW_GROUPS = {
      'riso-carnaroli-vialone': { label:'Riso Carnaroli o Vialone Nano', matchName:'riso carnaroli o vialone nano', cat:'pane' },
      'provolone-brie': { label:'Provolone o brie', matchName:'provolone o brie', cat:'latticini' },
      'zucchero-miele': { label:'Zucchero o miele', matchName:'zucchero o miele', cat:'dispensa' },
      'rosmarino-alloro': { label:'Rosmarino o alloro', matchName:'rosmarino o alloro', cat:'dispensa' },
      'guanciale-pancetta': { label:'Guanciale o pancetta', matchName:'guanciale o pancetta', cat:'carne' },
      'basilico-menta': { label:'Basilico o menta', matchName:'basilico o menta', cat:'verdura' },
      'olio-burro': { label:'Olio EVO o burro', matchName:'olio evo o burro', cat:'dispensa' },
      'grana-parmigiano': { label:'Grana o parmigiano a scaglie', matchName:'grana o parmigiano a scaglie', cat:'latticini' }
    };
    Object.entries(NEW_GROUPS).forEach(([id,g])=>{ if(!state.pantryGroups[id]) state.pantryGroups[id] = g; });
    const SEED_GROUP_NAMES2 = {
      'riso-carnaroli-vialone': ['riso carnaroli','carnaroli','riso vialone nano','vialone nano'],
      'provolone-brie': ['provolone','brie'],
      'zucchero-miele': ['zucchero','miele'],
      'rosmarino-alloro': ['rosmarino','alloro'],
      'guanciale-pancetta': ['guanciale','pancetta'],
      'basilico-menta': ['basilico','menta'],
      'olio-burro': ['olio evo','burro'],
      'grana-parmigiano': ['grana','parmigiano']
    };
    Object.keys(state.pantryItems).forEach(key=>{
      const it = state.pantryItems[key];
      if(!it || it.group) return;
      const group = Object.keys(SEED_GROUP_NAMES2).find(g => SEED_GROUP_NAMES2[g].includes(key));
      if(group) it.group = group;
    });
  }},
  // 11. Una tantum: le voci di Dispensa scritte con uno dei nomi ora unificati
  // (vedi CURATED_INGREDIENT_RENAMES) confluiscono nella voce col nome nuovo:
  // quantità sommate, e unità/categoria/gruppo/luogo presi da quella vecchia
  // solo dove la nuova non li ha già.
  { flag: 'pantryNamesCurated1', run(){
    mergeRenamedPantryItems();
  }},
  // 12. Una tantum: stessa unione per i nomi aggiunti dopo (Sale → Sale fino):
  // la voce "Sale" di Dispensa confluisce in "Sale fino" e sparisce.
  { flag: 'pantryNamesCurated2', run(){
    mergeRenamedPantryItems();
  }},
  // 13. Una tantum: crea i gruppi concordati (CURATED_PANTRY_GROUPS) e li assegna
  // alle voci di Dispensa già presenti che non hanno un gruppo. Il vecchio
  // gruppo "Grana o parmigiano a scaglie" confluisce in "Formaggio
  // grattugiato" (una voce sta in un solo gruppo, e le ricette che lo
  // chiedevano ora chiedono il formaggio grattugiato).
  { flag: 'pantryGroupMigrated3', run(){
    Object.entries(CURATED_PANTRY_GROUPS).forEach(([id, def])=>{ if(!state.pantryGroups[id]) state.pantryGroups[id] = Object.assign({}, def.group); });
    Object.keys(state.pantryItems).forEach(key=>{
      const it = state.pantryItems[key];
      if(!it) return;
      if(it.group === 'grana-parmigiano') it.group = 'formaggio-grattugiato';
      if(it.group) return;
      const id = Object.keys(CURATED_PANTRY_GROUPS).find(g => CURATED_PANTRY_GROUPS[g].members.includes(key));
      if(id) it.group = id;
    });
    delete state.pantryGroups['grana-parmigiano'];
  }},
  // 14. Una tantum: "Base" è diventata una categoria di base (id 'base'). Una
  // categoria "Base" creata a mano (customDepts, catalogo condiviso)
  // confluisce qui: le voci/gruppi che la usavano passano a 'base', l'emoji
  // scelta resta come personalizzazione. In più sale, pepe, olio, aceto,
  // spezie messi a mano in "Dispensa e condimenti" passano a Base.
  { flag: 'baseDeptMigrated1', run(){
    const custom = state.customDepts || {};
    const oldIds = Object.keys(custom).filter(id => !BASE_DEPT_LABEL[id] && custom[id] && !custom[id].nonFood && (custom[id].label || '').trim().toLowerCase() === 'base');
    const toBase = cat => oldIds.includes(cat);
    Object.values(state.pantryItems).forEach(it=>{
      if(!it) return;
      if(toBase(it.cat)) it.cat = 'base';
      else if(it.cat === 'dispensa' && classifyDept(it.nome) === 'base') it.cat = 'base';
    });
    Object.values(state.shopExtras || {}).forEach(it=>{ if(it && (toBase(it.cat) || (it.cat === 'dispensa' && classifyDept(it.ingrediente) === 'base'))) it.cat = 'base'; });
    Object.values(state.pantryGroups || {}).forEach(g=>{ if(g && toBase(g.cat)) g.cat = 'base'; });
    oldIds.forEach(id=>{
      const icon = custom[id].icon;
      if(icon && icon !== BASE_DEPT_ICON.base){ state.customDepts.base = Object.assign({}, state.customDepts.base, { icon }); }
      delete state.customDepts[id];
    });
  }},
  // 15. Una tantum: stato rimasto da settimane extra eliminate prima che
  // removeWeek lo ripulisse (chiavi con un numero di settimana che non
  // esiste più) — si cancella.
  { flag: 'orphanWeekKeysPurged1', run(){
    const weekCount = 1 + state.extraWeeks.length;
    remapWeekKeys(w => w < weekCount ? w : null);
  }},
  // 16. Una tantum: passaggio dal modello "una ricetta per giorno" (weekOverrides/
  // weekBaseline con un nome ricetta come stringa, mealsDone/overridePicked con
  // un booleano) al nuovo modello a due pasti (pranzo/cena, ognuno
  // {principale, contorni[]}). Il valore esistente diventa la cena; il pranzo
  // parte vuoto (lo riempie una rigenerazione della settimana). Le chiavi
  // esistenti di dayLinks/dayLinkNotes/dayPortions ("weekIdx_i", perché finora
  // descrivevano solo la sera) diventano "weekIdx_i_cena" — compresi i valori
  // di dayLinks, che sono anch'essi chiavi verso un pasto sorgente.
  { flag: 'mealsModelMigrated', run(){
    function migrateOverridesOrBaseline(map){
      if(!map) return;
      Object.keys(map).forEach(i=>{
        const val = map[i];
        if(typeof val === 'string') map[i] = { cena: { principale: val, contorni: [] }, pranzo: emptyMealSlot() };
      });
    }
    function migrateBoolMap(map){
      if(!map) return;
      Object.keys(map).forEach(i=>{
        const val = map[i];
        if(typeof val === 'boolean') map[i] = { cena: val, pranzo: false };
      });
    }
    migrateOverridesOrBaseline(state.weekOverrides);
    migrateOverridesOrBaseline(state.weekBaseline);
    migrateBoolMap(state.mealsDone);
    migrateBoolMap(state.weekOverridePicked);
    state.extraWeeks.forEach(w=>{
      migrateOverridesOrBaseline(w.overrides);
      migrateOverridesOrBaseline(w.baseline);
      migrateBoolMap(w.mealsDone);
      migrateBoolMap(w.overridePicked);
    });
    ['dayLinks','dayLinkNotes','dayPortions'].forEach(field=>{
      const map = state[field];
      const renamed = {};
      Object.keys(map).forEach(key=>{
        const newKey = key.split('_').length === 2 ? `${key}_cena` : key;
        renamed[newKey] = map[key];
      });
      state[field] = renamed;
    });
    Object.keys(state.dayLinks).forEach(key=>{
      const val = state.dayLinks[key];
      if(typeof val === 'string' && val.split('_').length === 2) state.dayLinks[key] = `${val}_cena`;
    });
  }},
  // 17. Una tantum: "chi cucina" diventa per pasto invece che per giorno — le
  // chiavi esistenti di state.cooks ("weekIdx_i") descrivevano solo la sera.
  { flag: 'mealsModelMigrated2', run(){
    const renamedCooks = {};
    Object.keys(state.cooks).forEach(key=>{
      const newKey = key.split('_').length === 2 ? `${key}_cena` : key;
      renamedCooks[newKey] = state.cooks[key];
    });
    state.cooks = renamedCooks;
  }},
  // 18. Una tantum: il vecchio dayTempoCap (un valore per giorno 0-6, condiviso
  // da cena e — per ven/sab/dom — anche dal pranzo) diventa una base sola
  // per tutta la settimana, con eccezioni solo dove un giorno si scostava
  // dal valore più comune. Il pranzo ven-sab-dom condivideva lo stesso
  // valore della cena dello stesso giorno: se quel giorno aveva
  // un'eccezione sulla cena, la eredita identica anche sul pranzo.
  { flag: 'tempoRulesMigrated', run(){
    const old = state.dayTempoCap || {};
    function mostCommon(vals){
      const counts = {};
      vals.forEach(v=>{ if(v) counts[v] = (counts[v]||0) + 1; });
      let best = 'normale', bestCount = -1;
      Object.entries(counts).forEach(([k,c])=>{ if(c > bestCount){ best = k; bestCount = c; } });
      return best;
    }
    const base = mostCommon([0,1,2,3,4,5,6].map(d=>old[d]));
    state.weekTempoBase = base;
    state.weekTempoExceptions = {};
    [0,1,2,3,4,5,6].forEach(d=>{
      if(old[d] && old[d] !== base) state.weekTempoExceptions[`${d}_cena`] = old[d];
    });
    [4,5,6].forEach(d=>{
      if(state.weekTempoExceptions[`${d}_cena`]) state.weekTempoExceptions[`${d}_pranzo`] = state.weekTempoExceptions[`${d}_cena`];
    });
  }},
  // 19. Una tantum: ripulisce i pasti già pianificati (settimana corrente + tutte
  // le extra) che puntano a una ricetta ormai cancellata da PRIMA che
  // "Elimina" imparasse a farlo da solo (purgeRecipeFromPlanning) — quei
  // riferimenti restavano orfani per sempre, e senza un vero "Modifica
  // ricetta" da aprire (la ricetta non esiste più: effectiveRecipeMeta torna
  // null) non c'era nemmeno un modo per raggiungere il bottone Elimina e
  // farli ripulire da lì. Stessa identica logica del purge, generalizzata a
  // "qualunque nome che non risolve più" invece di un nome specifico.
  { flag: 'staleRecipesPurged', run(){
    const weekCount = 1 + state.extraWeeks.length;
    for(let weekIdx = 0; weekIdx < weekCount; weekIdx++){
      for(let i = 0; i < 7; i++){
        ['pranzo','cena'].forEach(meal=>{
          const mealData = effectiveMeal(weekIdx, i, meal);
          if(mealData.principale && !getRecipeMeta(mealData.principale)){
            clearMealToEmpty(weekIdx, i, meal);
            delete state.mealLocked[mealKey(weekIdx, i, meal)];
          } else if(mealData.contorni && mealData.contorni.length){
            const validContorni = mealData.contorni.filter(c => getRecipeMeta(c));
            if(validContorni.length !== mealData.contorni.length) setMealContorni(weekIdx, i, meal, validContorni);
          }
        });
      }
    }
  }},
  // 20. Una tantum: le chiavi delle righe di Spesa passano dalla posizione
  // dell'ingrediente al suo nome (vedi dayIngKey): lo stato già salvato
  // (spuntato/tolto/quantità) si sposta sulla chiave nuova, abbinandolo con
  // le ricette attuali dei pasti pianificati.
  { flag: 'shopKeysByName1', run(){
    const moveKey = (oldKey, newKey)=>{
      if(oldKey === newKey) return;
      ['shopChecked','shopDismissed','shopQty'].forEach(field=>{
        const dict = state[field];
        if(dict && Object.prototype.hasOwnProperty.call(dict, oldKey)){
          if(!Object.prototype.hasOwnProperty.call(dict, newKey)) dict[newKey] = dict[oldKey];
          delete dict[oldKey];
        }
      });
    };
    const keyMap = {};
    allPlannedShoppingMeals().forEach(({weekIdx, i, meal, principale, contorni})=>{
      const dishes = [{ role:'p', name: principale }].concat((contorni||[]).map((c,ci)=>({ role:`c${ci}`, name:c })));
      dishes.forEach(({role, name})=>{
        const list = getIngredientsFor(name);
        list.forEach((it, idx)=>{ keyMap[legacyDayIngKey(weekIdx, i, meal, role, idx)] = dayIngKey(weekIdx, i, meal, role, list, idx); });
      });
    });
    Object.entries(keyMap).forEach(([oldKey, newKey])=> moveKey(oldKey, newKey));
    // shopQty può avere chiavi composte (più righe unite in Per reparto,
    // separate da virgola): si rimappa ogni parte.
    Object.keys(state.shopQty || {}).forEach(k=>{
      if(!k.includes(',')) return;
      const mapped = k.split(',').map(part => keyMap[part] || part).join(',');
      if(mapped !== k){ state.shopQty[mapped] = state.shopQty[k]; delete state.shopQty[k]; }
    });
  }}
];
function runMigrations(){
  let changed = false;
  MIGRATIONS.forEach(m=>{
    if(state[m.flag]) return;
    m.run();
    state[m.flag] = true;
    changed = true;
  });
  if(changed) persist();
}

async function loadState(){
  const route = getSpaceRoute();
  const personalKey = 'quaderno-state-' + route.id;
  // Cache locale istantanea (utile a schermo pieno offline o a connessione lenta)
  try{
    const cached = localStorage.getItem(personalKey);
    if(cached){
      const saved = JSON.parse(cached);
      // shopView/pantryView non si caricano più da uno stato salvato prima
      // che smettessero di essere persistiti (vedi persist()): altrimenti un
      // valore vecchio rimasto nella cache locale o su Firebase continuerebbe
      // a sovrascrivere il default "riparti sempre da Per reparto/categoria".
      delete saved.shopView;
      delete saved.pantryView;
      Object.assign(state, saved);
    }
  }catch(e){ /* nessuno stato salvato ancora */ }
  try{
    const catalogCached = localStorage.getItem('catalog-state-cache');
    if(catalogCached) Object.assign(state, JSON.parse(catalogCached));
  }catch(e){ /* nessun catalogo in cache ancora */ }
  // Baseline "locale" prima ancora che Firebase risponda: se l'utente tocca
  // qualcosa mentre aspettiamo ancora la prima risposta vera (onChange più
  // sotto), quel tocco va confrontato con QUESTO stato (cache locale), non
  // con uno vuoto — altrimenti al momento del confronto sembrerebbe che sia
  // cambiato "tutto" (l'intera cache) invece che solo il tocco vero.
  lastSyncedPersonal = JSON.parse(JSON.stringify(buildPersonalPayload()));
  lastSyncedCatalog = JSON.parse(JSON.stringify(buildCatalogPayload()));

  await firebaseReady;
  if(!window.cookpopSync) return;

  // Dati personali (dispensa, menù, spesa, chi cucina...): percorso per
  // spazio (vedi SPACE_ROUTES), isolato dagli altri.
  await new Promise((resolve)=>{
    let done = false;
    window.cookpopSync.onChange(route.path, (saved)=>{
      if(saved){
        if(saved.pantryItems) saved.pantryItems = decodeKeysFromFirebase(saved.pantryItems);
        if(saved.freezerItems) saved.freezerItems = decodeKeysFromFirebase(saved.freezerItems);
        if(saved.ingredientNotes) saved.ingredientNotes = decodeKeysFromFirebase(saved.ingredientNotes);
        delete saved.shopView;
        delete saved.pantryView;
        // Se nel frattempo (mentre aspettavamo QUESTA risposta) l'utente ha
        // già toccato qualcosa, la Object.assign qui sotto la cancellerebbe
        // silenziosamente sovrascrivendola con lo snapshot del server, che
        // non la conosce ancora: la ricalcolo rispetto a lastSyncedPersonal e
        // la riapplico subito dopo, così resta (ed è quella che poi
        // personalSaveDeferred/persist manda davvero su Firebase).
        const localEdits = buildFirebasePatch(buildPersonalPayload(), lastSyncedPersonal, PERSONAL_DICT_FIELDS);
        Object.assign(state, saved);
        applyFirebasePatch(localEdits);
        try{ localStorage.setItem(personalKey, JSON.stringify(saved)); }catch(e){}
        lastSyncedPersonal = JSON.parse(JSON.stringify(saved));
      } else {
        lastSyncedPersonal = {};
      }
      personalSynced = true;
      render();
      if(personalSaveDeferred){ personalSaveDeferred = false; persist(); }
      if(!done){ done = true; resolve(); }
    });
    setTimeout(()=>{ if(!done){ done = true; resolve(); } }, 2500);
  });

  // Catalogo ricette/ingredienti: un solo percorso condiviso da tutti gli
  // spazi (vedi CATALOG_STATE_PATH) — chi cura una ricetta o rinomina un
  // ingrediente lo fa per tutti, non solo per il proprio spazio.
  await new Promise((resolve)=>{
    let done = false;
    window.cookpopSync.onChange(CATALOG_STATE_PATH, (saved)=>{
      if(saved){
        decodeCatalogSaved(saved);
        // Stessa cautela del percorso personale qui sopra: una modifica al
        // catalogo (es. una ricetta curata) fatta mentre si aspettava questa
        // risposta non deve sparire sotto lo snapshot del server.
        const localEdits = buildFirebasePatch(buildCatalogPayload(), lastSyncedCatalog, CATALOG_DICT_FIELDS);
        Object.assign(state, saved);
        applyFirebasePatch(localEdits);
        try{ localStorage.setItem('catalog-state-cache', JSON.stringify(saved)); }catch(e){}
        lastSyncedCatalog = JSON.parse(JSON.stringify(saved));
      } else if(route.id === 'default'){
        // Primissimo avvio in assoluto del catalogo condiviso: se questo è
        // lo spazio originale e ha già curatela fatta (ricette aggiunte/
        // modificate/nascoste, sinonimi, gruppi — arrivata qui dal vecchio
        // formato, un'unica voce quaderno-state che li conteneva tutti),
        // gliela copiamo dentro una volta sola: gli altri spazi la trovano
        // già pronta invece di ripartire da un catalogo vuoto.
        const hasContent = Object.keys(state.customRecipes||{}).length || Object.keys(state.recipeEdits||{}).length
          || Object.keys(state.hiddenRecipes||{}).length || Object.keys(state.ingredientRenames||{}).length
          || Object.keys(state.recipeIngredients||{}).length;
        if(hasContent){
          const seed = {};
          CATALOG_FIELDS.forEach(f=>{ seed[f] = state[f]; });
          window.cookpopSync.save(CATALOG_STATE_PATH, encodeCatalogForFirebase(seed))
            .catch(e=>console.error('Seed catalogo condiviso fallito', e));
          lastSyncedCatalog = JSON.parse(JSON.stringify(seed));
        } else {
          lastSyncedCatalog = {};
        }
      }
      catalogSynced = true;
      render();
      if(catalogSaveDeferred){ catalogSaveDeferred = false; persist(); }
      if(!done){ done = true; resolve(); }
    });
    setTimeout(()=>{ if(!done){ done = true; resolve(); } }, 2500);
  });
}
// Vero solo dopo il primo onChange REALE di Firebase per quel percorso (non
// il timeout di ripiego in loadState, che serve solo a non tenere l'app
// bloccata offline): finché è false non sappiamo ancora se c'è già uno stato
// più recente sul server (scritto da un altro dispositivo) di quello che
// abbiamo in locale/cache — scrivere prima d'allora rischierebbe di
// sovrascriverlo alla cieca con dati vecchi. Vedi runPersist.
let personalSynced = false;
let catalogSynced = false;
// Vero se un salvataggio ha dovuto saltare la scrittura su Firebase perché
// non ancora sincronizzati: appena arriva la prima sincronizzazione reale lo
// ritentiamo (vedi loadState), invece di perdere quella modifica per sempre.
let personalSaveDeferred = false;
let catalogSaveDeferred = false;
// Ultimo payload noto per certo uguale a quello su Firebase: aggiornato sia
// quando arriva un onChange reale (vedi loadState) sia dopo ogni scrittura
// riuscita (vedi runPersist). Sempre un clone indipendente (mai le stesse
// referenze di state.*), altrimenti una mutazione in-place su state
// "sporcherebbe" anche la baseline e il confronto smetterebbe di vedere la
// differenza. Confrontato contro il payload attuale per capire quali chiavi
// scrivere — vedi buildFirebasePatch.
let lastSyncedPersonal = null;
let lastSyncedCatalog = null;
// Campi di personalPayload/catalogPayload che sono dizionari a chiave
// dinamica (ingrediente, mealKey, giorno, id riga di spesa...): li
// confrontiamo chiave per chiave invece che come blocco unico, così due
// dispositivi che toccano chiavi DIVERSE dello stesso campo (es. due
// ingredienti diversi in Dispensa, o un ingrediente in Dispensa e un pasto in
// Menù) non si sovrascrivono più a vicenda in un solo colpo — vince l'ultimo
// arrivato solo sulla singola chiave che entrambi hanno toccato, non su tutto
// il blocco. Tutti gli altri campi di personalPayload (flag di migrazione,
// weekTempoBase, extraWeeks...) restano confrontati per intero: sono o
// scalari o strutture che non hanno una vera "chiave dinamica" di primo
// livello su cui vale la pena scendere.
const PERSONAL_DICT_FIELDS = ['whatsNewSeenBy','shopChecked','shopDismissed','shopExtras','shopQty','pantryChecked','pantryConfirmedShop','weekOverrides','weekOverridePicked','weekBaseline','weekTempoExceptions','notifDismissed','mealsDoneReminderDismissed','dayLinks','dayLinkNotes','dayPortions','mealLocked','cooks','shopAssignees','ingredientNotes','mealsDone','pantryItems','userColors'];
// Il catalogo condiviso è per intero fatto di dizionari a chiave dinamica
// (nome ricetta/ingrediente, id gruppo dispensa) — vedi CATALOG_FIELDS.
const CATALOG_DICT_FIELDS = CATALOG_FIELDS;
// Confronta newPayload con oldPayload (l'ultimo stato noto su Firebase) e
// produce una mappa "percorso relativo -> valore", pronta per un multi-path
// update(): solo le chiavi davvero cambiate finiscono nel risultato, una
// chiave sparita da un campo-dizionario diventa null (Firebase la cancella),
// il resto del percorso non viene toccato. dictFields elenca i campi da
// confrontare chiave per chiave invece che come blocco unico (vedi sopra).
function buildFirebasePatch(newPayload, oldPayload, dictFields){
  oldPayload = oldPayload || {};
  const patch = {};
  for(const field in newPayload){
    const newVal = newPayload[field];
    if(dictFields.includes(field)){
      const newDict = newVal || {};
      const oldDict = oldPayload[field] || {};
      for(const key in newDict){
        if(JSON.stringify(newDict[key]) !== JSON.stringify(oldDict[key])){
          patch[field + '/' + fbKeyEncode(key)] = newDict[key];
        }
      }
      for(const key in oldDict){
        if(!(key in newDict)) patch[field + '/' + fbKeyEncode(key)] = null;
      }
    } else {
      if(newVal === undefined) continue; // come prima: un campo undefined si omette, non si scrive
      if(JSON.stringify(newVal) !== JSON.stringify(oldPayload[field])) patch[field] = newVal;
    }
  }
  return patch;
}
// Inverso di buildFirebasePatch: applica un patch "percorso -> valore" (stessa
// forma, es. {"pantryItems/farina": {...}, "weekTempoBase": "veloce"}) allo
// state live — usato in loadState per non perdere una modifica fatta in
// locale mentre si aspettava ancora la sincronizzazione (vedi lì).
function applyFirebasePatch(patch){
  for(const path in patch){
    const value = patch[path];
    const slash = path.indexOf('/');
    if(slash === -1){
      state[path] = value;
    } else {
      const field = path.slice(0, slash);
      const key = fbKeyDecode(path.slice(slash + 1));
      if(!state[field] || typeof state[field] !== 'object') state[field] = {};
      if(value === null) delete state[field][key];
      else state[field][key] = value;
    }
  }
}
let saveTimeout=null;
// Avanzi in Dispensa (creati da "Cucinata" → avanzo, vedi il modale fatto):
// sono resti di una ricetta, non ingredienti da ricomprare. Riconosciuti dal
// flag leftover (dai nuovi in poi) o dal reparto "Avanzi" (quelli creati
// prima del flag, che di default finivano lì).
function isLeftoverPantryItem(it){
  return !!it && (it.leftover === true || it.cat === 'avanzi');
}
// Un avanzo finito (scorta 0) non resta in Dispensa come un ingrediente
// "finito" da ricomprare: sparisce del tutto. Chiamata da persist(), così
// vale per ogni modo in cui la scorta arriva a 0 (spunta, −, modifica, pasto
// cucinato). Ritorna le voci tolte, per un eventuale "Annulla".
function purgeFinishedLeftovers(){
  const removed = [];
  Object.keys(state.pantryItems).forEach(key=>{
    const it = state.pantryItems[key];
    if(!isLeftoverPantryItem(it) || typeof it.qty !== 'number' || it.qty > 0) return;
    removed.push({ key, item: it, confirmed: state.pantryConfirmedShop[key], dismissed: state.shopDismissed['oos_'+key] });
    delete state.pantryItems[key];
    delete state.pantryConfirmedShop[key];
    delete state.shopDismissed['oos_'+key];
  });
  return removed;
}
function restoreLeftovers(removed){
  removed.forEach(({ key, item, confirmed, dismissed })=>{
    state.pantryItems[key] = item;
    if(confirmed !== undefined) state.pantryConfirmedShop[key] = confirmed;
    if(dismissed !== undefined) state.shopDismissed['oos_'+key] = dismissed;
  });
}
// Per i gesti diretti in Dispensa (spunta di presenza, −): se l'avanzo è
// appena finito lo toglie subito e offre "Annulla" — un tocco sbagliato non
// deve far perdere l'avanzo senza rimedio.
function finishLeftoverWithUndo(key){
  const it = state.pantryItems[key];
  if(!isLeftoverPantryItem(it) || typeof it.qty !== 'number' || it.qty > 0) return false;
  const removed = purgeFinishedLeftovers().filter(r => r.key === key);
  persist(); render();
  showUndoToast(`Avanzo finito: «${it.nome}» tolto dalla Dispensa`, ()=>{
    removed.forEach(r=>{ r.item.qty = 1; });
    restoreLeftovers(removed);
    persist(); render();
  });
  return true;
}
function persist(){
  purgeFinishedLeftovers();
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(runPersist, 350);
}
// Il browser su telefono può sospendere/scaricare la pagina in background
// pochi istanti dopo che la tocchi (cambio app, blocco schermo): se il
// salvataggio con debounce (350ms) non ha ancora avuto il tempo di partire,
// la modifica non arriva né a Firebase né alla cache locale e si perde per
// sempre. flushPendingPersist forza subito il salvataggio in sospeso appena
// la pagina sta per finire in background, invece di fidarsi del timer.
function flushPendingPersist(){
  if(saveTimeout){ clearTimeout(saveTimeout); saveTimeout = null; runPersist(); }
}
document.addEventListener('visibilitychange', ()=>{
  if(document.visibilityState === 'hidden') flushPendingPersist();
});
window.addEventListener('pagehide', flushPendingPersist);
// Il payload personale (dispensa/menù/spesa...) come oggetto piatto pronto per
// il confronto/salvataggio: usato sia da runPersist per scrivere, sia da
// loadState per sapere cos'ha già in locale prima che arrivi la risposta vera
// da Firebase (vedi lastSyncedPersonal/buildFirebasePatch più sotto).
function buildPersonalPayload(){
  const payload = {
    shopChecked: state.shopChecked,
    shopDismissed: state.shopDismissed,
    shopExtras: state.shopExtras,
    shopQty: state.shopQty,
    pantryChecked: state.pantryChecked,
    // shopView/pantryView non persistiti: ogni apertura dell'app riparte da
    // Per reparto/Per categoria (vedi state init), non "ricorda" l'ultima
    // vista toccata nella sessione precedente.
    weekOverrides: state.weekOverrides,
    weekOverridePicked: state.weekOverridePicked,
    weekBaseline: state.weekBaseline,
    extraWeeks: state.extraWeeks,
    dayLinks: state.dayLinks,
    dayLinkNotes: state.dayLinkNotes,
    dayPortions: state.dayPortions,
    mealLocked: state.mealLocked,
    weekTempoBase: state.weekTempoBase,
    weekTempoExceptions: state.weekTempoExceptions,
    userColors: state.userColors,
    notifDismissed: state.notifDismissed,
    mealsDoneReminderDismissed: state.mealsDoneReminderDismissed,
    pantryConfirmedShop: state.pantryConfirmedShop,
    cooks: state.cooks,
    shopAssignees: state.shopAssignees,
    appliedForcedWeekVersion: state.appliedForcedWeekVersion,
    mealsDone: state.mealsDone,
    ingredientNotes: state.ingredientNotes,
    pantryItems: state.pantryItems,
    week0Start: state.week0Start,
    whatsNewSeen: state.whatsNewSeen,
    whatsNewSeenBy: state.whatsNewSeenBy
  };
  MIGRATIONS.forEach(m=>{ payload[m.flag] = !!state[m.flag]; });
  return payload;
}
// Catalogo condiviso (CATALOG_FIELDS): stessa forma per tutti gli spazi, su un
// percorso Firebase a sé — vedi CATALOG_STATE_PATH.
function buildCatalogPayload(){
  const catalogPayload = {};
  CATALOG_FIELDS.forEach(f=>{ catalogPayload[f] = state[f]; });
  return catalogPayload;
}
async function runPersist(){
  saveTimeout = null;
  {
    const route = getSpaceRoute();
    const personalPayload = buildPersonalPayload();
    const catalogPayload = buildCatalogPayload();
    try{ localStorage.setItem('quaderno-state-' + route.id, JSON.stringify(personalPayload)); }catch(e){}
    try{ localStorage.setItem('catalog-state-cache', JSON.stringify(catalogPayload)); }catch(e){}
    try{
      await firebaseReady;
      if(window.cookpopSync){
        // Prima della prima sincronizzazione reale (personalSynced/catalogSynced,
        // vedi loadState) non scriviamo affatto su Firebase: quello che abbiamo
        // in "state" a quel punto è solo cache locale o default, e scriverlo
        // alla cieca rischierebbe di cancellare una modifica più recente fatta
        // nel frattempo da un altro dispositivo. Restiamo comunque salvati in
        // locale (sopra) e ritentiamo il salvataggio su Firebase non appena
        // arriva quella sincronizzazione.
        //
        // Da lì in poi, invece di un set() che sovrascrive l'intero percorso,
        // calcoliamo un patch (buildFirebasePatch) con solo le chiavi
        // davvero cambiate rispetto all'ultimo stato noto (lastSyncedPersonal/
        // lastSyncedCatalog) e lo scriviamo con un multi-path update(): due
        // dispositivi che toccano chiavi diverse (due ingredienti diversi in
        // Dispensa, un ingrediente e un pasto...) non si sovrascrivono più a
        // vicenda — vince l'ultimo arrivato solo sulla singola chiave che
        // entrambi hanno toccato, non su tutto il blocco.
        let savePersonal = Promise.resolve();
        if(personalSynced){
          const personalPatch = JSON.parse(JSON.stringify(
            buildFirebasePatch(personalPayload, lastSyncedPersonal, PERSONAL_DICT_FIELDS)
          ));
          savePersonal = window.cookpopSync.patch(route.path, personalPatch)
            .then(()=>{ lastSyncedPersonal = JSON.parse(JSON.stringify(personalPayload)); });
        } else personalSaveDeferred = true;
        let saveCatalog = Promise.resolve();
        if(catalogSynced){
          const catalogPatch = JSON.parse(JSON.stringify(
            buildFirebasePatch(catalogPayload, lastSyncedCatalog, CATALOG_DICT_FIELDS)
          ));
          saveCatalog = window.cookpopSync.patch(CATALOG_STATE_PATH, catalogPatch)
            .then(()=>{ lastSyncedCatalog = JSON.parse(JSON.stringify(catalogPayload)); });
        } else catalogSaveDeferred = true;
        await Promise.all([savePersonal, saveCatalog]);
      }
      const hint = document.querySelector('.save-hint');
      if(hint){
        hint.textContent = (personalSynced && catalogSynced) ? 'salvato ✓' : 'salvato in locale, in attesa di rete…';
        setTimeout(()=>{ if(hint) hint.textContent=''; }, 1500);
      }
    }catch(e){ console.error('Errore salvataggio', e); }
  }
}

// Settimana 0 = quella "corrente" (DATA.week1 + weekOverrides/weekBaseline/mealsDone
// in cima allo state, come da sempre — invariati per compatibilità con i dati già
// salvati). Settimana N (N>=1) = state.extraWeeks[N-1], una pianificazione aggiuntiva
// creata con "Aggiungi settimana": stessa forma {baseline, overrides, mealsDone}, ma
// senza il foglio originale (DATA.week1) come base, dato che non esiste per definizione.
// Firebase Realtime Database elimina i campi il cui valore è un oggetto vuoto
// ({}): appena una settimana extra viene sincronizzata, "overrides"/"mealsDone"
// (spesso vuoti) possono sparire dal documento salvato. Le funzioni sotto si
// "auto-riparano" ricreandoli al volo se mancano, invece di andare in errore
// leggendo undefined (il bug che rompeva il render di Menù e Spesa).
function weekOverridesRef(weekIdx){
  if(weekIdx === 0) return state.weekOverrides || (state.weekOverrides = {});
  const w = state.extraWeeks[weekIdx-1];
  if(!w) return {};
  return w.overrides || (w.overrides = {});
}
function weekBaselineRef(weekIdx){
  if(weekIdx === 0) return state.weekBaseline;
  const w = state.extraWeeks[weekIdx-1];
  return w ? (w.baseline || null) : null;
}
function weekMealsDoneRef(weekIdx){
  if(weekIdx === 0) return state.mealsDone || (state.mealsDone = {});
  const w = state.extraWeeks[weekIdx-1];
  if(!w) return {};
  return w.mealsDone || (w.mealsDone = {});
}
// Marca solo i giorni la cui ricetta è stata scelta a mano dal catalogo
// ("Cambia ricetta"), non quelli che l'hanno semplicemente ricevuta scambiando
// il giorno con un altro (drag&drop o pulsante Cambia ricetta usato per uno
// scambio): "↺ Originale" ha senso solo per riportare una scelta dal catalogo,
// non per disfare uno scambio, che riguarda l'intera settimana.
function weekOverridePickedRef(weekIdx){
  if(weekIdx === 0) return state.weekOverridePicked || (state.weekOverridePicked = {});
  const w = state.extraWeeks[weekIdx-1];
  if(!w) return {};
  return w.overridePicked || (w.overridePicked = {});
}

// Un pasto (weekOverrides/weekBaseline, chiave "weekIdx_i") è
// { pranzo:{principale,contorni[]}, cena:{principale,contorni[]} } invece di
// una stringa: i due helper sotto centralizzano lettura/scrittura di un
// singolo pasto, così il resto del codice non deve conoscere la forma esatta.
function emptyMealSlot(){ return { principale: null, contorni: [] }; }
function emptyDaySlot(){ return { pranzo: emptyMealSlot(), cena: emptyMealSlot() }; }
// Legge il pasto "meal" del giorno i da una mappa {i: {pranzo,cena}} (weekOverrides
// o weekBaseline): null se il giorno non ha ancora nulla lì.
function readMealSlot(map, i, meal){
  const day = map && map[i];
  const slot = (day && day[meal]) || null;
  if(!slot) return null;
  // Firebase RTDB elimina i campi il cui valore serializza a "vuoto": un array
  // contorni:[] appena scritto sparisce dal documento al giro successivo,
  // lasciando lo slot con solo {principale}. Normalizzo qui, unico punto di
  // lettura, così tutto il resto del codice può contare su .contorni sempre array.
  return { principale: slot.principale != null ? slot.principale : null, contorni: slot.contorni || [] };
}
// Scrive/aggiorna il principale del pasto "meal" del giorno i in una mappa
// {i: {pranzo,cena}}, creando la struttura del giorno/pasto se manca. Azzera i
// contorni: un principale nuovo non eredita il contorno di quello sostituito.
function writeMealPrincipale(map, i, meal, principale){
  if(!map[i]) map[i] = emptyDaySlot();
  map[i][meal] = { principale, contorni: [] };
}
// Cancella solo il pasto "meal" da un giorno di una mappa {i:{pranzo,cena}}
// di soli booleani (weekOverridePicked/mealsDone), lasciando intatto l'altro
// pasto dello stesso giorno.
function clearMealFlag(map, i, meal){
  if(map[i]) delete map[i][meal];
}

// Un pasto "avanzo" (state.dayLinks, chiave "weekIdx_i_meal") rimanda
// semplicemente al pasto sorgente per nome/meta ricetta: stessa ricetta
// ovunque venga letta, senza duplicare nulla. allPlannedShoppingMeals() lo
// esclude dall'aggregazione Spesa (ingredienti già contati sul pasto sorgente); il
// link si rompe da solo se il pasto sorgente cambia ricetta (vedi
// unlinkDaysPointingTo).
function linkedSourceMealKey(weekIdx, i, meal){
  return state.dayLinks[`${weekIdx}_${i}_${meal}`] || null;
}
// Chiave/parsing per un pasto: "weekIdx_i_meal" (es. "0_2_cena"). Centralizza
// il pattern usato ovunque, evitando .split('_') sparsi che romperebbero
// silenziosamente su una chiave con più parti del previsto.
function mealKey(weekIdx, i, meal){ return `${weekIdx}_${i}_${meal}`; }
function parseMealKey(key){
  const [w, i, meal] = key.split('_');
  return { weekIdx: parseInt(w, 10), i, meal };
}
// Sentinella per "Svuota il pasto": un override.principale normalmente
// falsy (null) significa "nessun override, guarda la baseline" — ma svuotare
// deve fermarsi qui e NON ricadere sulla baseline generata. MEAL_EMPTY è un
// principale esplicito e verosimile (truthy) che effectiveMeal/
// effectiveRecipeMeta riconoscono e traducono in "vuoto per davvero" prima
// di guardare oltre. Vedi clearMealToEmpty().
const MEAL_EMPTY = ' meal-empty';
// Risolve un pasto (weekIdx, i, meal) fino a {principale, contorni[]}: segue
// l'eventuale avanzo, poi l'override manuale, poi la generazione automatica,
// poi — solo per la cena della settimana 0, l'unico caso con un foglio
// originale alle spalle — il fallback statico di DATA.week1[i].cena.
// Un pasto "avanzo" eredita sempre il principale dalla fonte (è lo stesso
// piatto riscaldato), ma se ha un proprio override di contorni (aggiunto a
// mano su questo pasto, non sulla fonte) mostra quelli invece di ereditare
// anche i contorni della fonte — così un contorno fresco del giorno si può
// sempre aggiungere anche a un pranzo che è avanzo della cena di ieri.
function effectiveMeal(weekIdx, i, meal){
  const link = linkedSourceMealKey(weekIdx, i, meal);
  if(link){
    const { weekIdx: sw, i: si, meal: sm } = parseMealKey(link);
    const source = effectiveMeal(sw, si, sm);
    const ownOverride = readMealSlot(weekOverridesRef(weekIdx), i, meal);
    if(ownOverride && ownOverride.contorni && ownOverride.contorni.length) return { principale: source.principale, contorni: ownOverride.contorni };
    return source;
  }
  const override = readMealSlot(weekOverridesRef(weekIdx), i, meal);
  if(override && override.principale === MEAL_EMPTY) return { principale: null, contorni: [] };
  if(override && override.principale) return override;
  const baseline = readMealSlot(weekBaselineRef(weekIdx), i, meal);
  if(baseline && baseline.principale) return baseline;
  // Menù di partenza storico (DATA.week1): solo per dati di prima che le
  // settimane scorressero da sole — una settimana passata/nuova vuota resta vuota.
  if(weekIdx === 0 && meal === 'cena' && !state.week0Start && DATA.week1[i].cena) return { principale: DATA.week1[i].cena, contorni: [] };
  return { principale: null, contorni: [] };
}
// Aggiunge/toglie un contorno al pasto "meal" del giorno i senza toccare il
// principale: per un pasto normale blocca l'attuale principale effettivo
// nell'override (così il contorno non fa "perdere" la ricetta generata); per
// un pasto avanzo lascia il principale a null nell'override, cosicché
// effectiveMeal continui a seguire il link per il principale e prenda solo i
// contorni da qui (vedi sopra).
function setMealContorni(weekIdx, i, meal, contorni){
  const map = weekOverridesRef(weekIdx);
  if(!map[i]) map[i] = emptyDaySlot();
  const isLinked = !!linkedSourceMealKey(weekIdx, i, meal);
  map[i][meal] = { principale: isLinked ? null : effectiveMeal(weekIdx, i, meal).principale, contorni };
}
function effectiveRecipeName(weekIdx, i, meal='cena'){
  return effectiveMeal(weekIdx, i, meal).principale || '';
}
// Ricetta "vera" del catalogo per il pasto (weekIdx,i,meal): se sostituita
// manualmente è la sostituzione, se fa parte di un menù generato è la ricetta
// generata, altrimenti (solo cena, settimana 0) si prova ad abbinarla al
// catalogo (catalogMatch).
function effectiveRecipeMeta(weekIdx, i, meal='cena'){
  const link = linkedSourceMealKey(weekIdx, i, meal);
  if(link){ const { weekIdx: sw, i: si, meal: sm } = parseMealKey(link); return effectiveRecipeMeta(sw, si, sm); }
  const override = readMealSlot(weekOverridesRef(weekIdx), i, meal);
  if(override && override.principale === MEAL_EMPTY) return null;
  if(override && override.principale) return getRecipeMeta(override.principale);
  const baseline = readMealSlot(weekBaselineRef(weekIdx), i, meal);
  if(baseline && baseline.principale) return getRecipeMeta(baseline.principale);
  if(weekIdx === 0 && meal === 'cena' && !state.week0Start){
    const match = DATA.week1[i].catalogMatch;
    return match ? getRecipeMeta(match) : null;
  }
  return null;
}
function effectiveCategoria(weekIdx, i, meal='cena'){
  const rec = effectiveRecipeMeta(weekIdx, i, meal);
  if(rec) return rec.categoriaNew;
  return (weekIdx === 0 && meal === 'cena' && !state.week0Start) ? (DATA.week1[i].fallbackCategoria || '') : '';
}

const MONTHS_IT = ['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'];
const MONTHS_IT_SHORT = ['gen','feb','mar','apr','mag','giu','lug','ago','set','ott','nov','dic'];

// La settimana visualizzata parte dal sabato (giorno della spesa) e finisce
// al venerdì successivo: DATA.week1 resta indicizzato Lun(0)...Dom(6) come
// prima (weekOverrides/weekBaseline/mealsDone usano ancora questi indici),
// qui si cambia solo l'ORDINE con cui i 7 giorni vengono mostrati.
const WEEK_DISPLAY_ORDER = [5,6,0,1,2,3,4];

// Sabato che apre la settimana "corrente" (quella che contiene oggi): se oggi è
// sabato è oggi stesso, altrimenti il sabato appena passato — così la settimana 0
// include sempre la data di oggi ed è possibile evidenziarla nel Menù.
function upcomingSaturday(){
  const today = new Date();
  const day = today.getDay(); // 0=dom, 1=lun ... 6=sab
  const daysSinceSaturday = (day + 1) % 7;
  const saturday = new Date(today);
  saturday.setDate(today.getDate() - daysSinceSaturday);
  return saturday;
}
// weekIdx-esima settimana a partire da quella corrente (0 = corrente, 1 = successiva, ...)
function weekDatesFor(weekIdx){
  const saturday = upcomingSaturday();
  saturday.setDate(saturday.getDate() + weekIdx*7);
  return WEEK_DISPLAY_ORDER.map((_,pos)=>{
    const d = new Date(saturday);
    d.setDate(saturday.getDate() + pos);
    return d;
  });
}
function formatShortDate(date){
  return `${date.getDate()} ${MONTHS_IT_SHORT[date.getMonth()]}`;
}
function isSameDay(a, b){
  return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
}
function weekLabelFor(weekIdx){
  const dates = weekDatesFor(weekIdx);
  const saturday = dates[0], friday = dates[6];
  const dm = saturday.getDate(), ds = friday.getDate();
  // Stesso mese: nome intero ("5-11 settembre"). Mesi diversi: abbreviati per
  // stare nello spazio del titolo ("29 ago - 4 set").
  if(saturday.getMonth() === friday.getMonth()) return `${dm}-${ds} ${MONTHS_IT[saturday.getMonth()]}`;
  return `${dm} ${MONTHS_IT_SHORT[saturday.getMonth()]} - ${ds} ${MONTHS_IT_SHORT[friday.getMonth()]}`;
}
// Pasti pianificati "per la spesa": pranzo e cena di ogni giorno pianificato
// (settimana corrente + eventuali extra), nell'ordine di visualizzazione —
// usato da Spesa per aggregare gli ingredienti. Salta i pasti "avanzo" (i
// loro ingredienti sono già contati sul pasto sorgente, altrimenti
// finirebbero comprati due volte) e quelli senza nessuna ricetta scelta.
// dishLabel è il nome mostrato: principale, con gli eventuali contorni
// aggiunti in coda — è anche quello che finisce nel "context" degli
// ingredienti, così principale e contorni di uno stesso pasto si aggregano
// sempre sotto lo stesso titolo di sezione in Spesa.
function allPlannedShoppingMeals(){
  const meals = [];
  const pushWeek = (weekIdx) => {
    const dates = weekDatesFor(weekIdx);
    WEEK_DISPLAY_ORDER.forEach((i,pos)=>{
      ['pranzo','cena'].forEach(meal=>{
        if(linkedSourceMealKey(weekIdx, i, meal)) return;
        const mealData = effectiveMeal(weekIdx, i, meal);
        if(!mealData.principale) return;
        meals.push({
          weekIdx, i, meal,
          key: mealKey(weekIdx, i, meal),
          giorno: DATA.week1[i].giorno,
          dateLabel: formatShortDate(dates[pos]),
          principale: mealData.principale,
          contorni: mealData.contorni,
          dishLabel: mealData.principale + (mealData.contorni.length ? ' + ' + mealData.contorni.join(', ') : '')
        });
      });
    });
  };
  pushWeek(0);
  state.extraWeeks.forEach((w,wi)=> pushWeek(wi+1));
  return meals;
}
// Tutti gli SLOT pasto (pranzo e cena, settimana corrente + eventuali extra),
// nell'ordine di visualizzazione, inclusi quelli ancora vuoti (name: '') —
// usato dal picker "Segna come avanzata" per poter scegliere come bersaglio
// anche un pasto non ancora deciso, non solo sostituire una scelta già fatta.
// A differenza di allPlannedShoppingMeals() (usato da Spesa) NON salta i
// pasti già linkati (restano scegliebili come sorgente/bersaglio) e non
// include i contorni. allPlannedMeals() sotto filtra via gli slot vuoti, per
// tutto il resto (es. "È avanzo di", dove la sorgente deve per forza essere
// un piatto vero già cucinato).
function allMealSlots(){
  const meals = [];
  const pushWeek = (weekIdx) => {
    const dates = weekDatesFor(weekIdx);
    WEEK_DISPLAY_ORDER.forEach((i,pos)=>{
      ['pranzo','cena'].forEach(meal=>{
        meals.push({
          key: mealKey(weekIdx, i, meal),
          weekIdx, i, meal,
          giorno: DATA.week1[i].giorno,
          dateLabel: formatShortDate(dates[pos]),
          name: effectiveRecipeName(weekIdx, i, meal) || ''
        });
      });
    });
  };
  pushWeek(0);
  state.extraWeeks.forEach((w,wi)=> pushWeek(wi+1));
  return meals;
}
function allPlannedMeals(){
  return allMealSlots().filter(m => m.name);
}
// Prossimo pasto, a partire da oggi, in cui cucina "user": scorre la
// settimana corrente (solo dal giorno di oggi in poi) e le settimane extra
// già pianificate, nello stesso ordine di visualizzazione del Menù —
// pranzo prima di cena nello stesso giorno. daysFromToday è 0/1 solo per la
// settimana corrente (usato dal promemoria "oggi/domani cucini tu"), altrimenti null.
function nextCookDayFor(user){
  const startPos = findTodayPos() ?? 0;
  const weeksToCheck = [0, ...state.extraWeeks.map((_,wi)=>wi+1)];
  for(const weekIdx of weeksToCheck){
    const dates = weekDatesFor(weekIdx);
    for(let pos=0; pos<WEEK_DISPLAY_ORDER.length; pos++){
      if(weekIdx===0 && pos<startPos) continue;
      const i = WEEK_DISPLAY_ORDER[pos];
      for(const meal of ['pranzo','cena']){
        const mk = mealKey(weekIdx, i, meal);
        if(state.cooks[mk] === user){
          return {
            dayKey: mk,
            meal,
            giorno: DATA.week1[i].giorno,
            dateLabel: formatShortDate(dates[pos]),
            name: effectiveRecipeName(weekIdx, i, meal),
            daysFromToday: weekIdx===0 ? (pos - startPos) : null
          };
        }
      }
    }
  }
  return null;
}
// Chiave stabile per un ingrediente di un pasto: "role" distingue il
// principale ('p') dai contorni ('c0', 'c1'...), altrimenti due ricette dello
// stesso pasto con un ingrediente alla stessa posizione si scontrerebbero
// sulla stessa chiave. Cambia formato rispetto a prima di avere pranzo/cena
// (era solo "d{i}_{idx}") — le vecchie spunte/dismissioni restano quindi
// orfane invece di riapparire nel posto sbagliato: accettabile, si
// riazzerano da sole al primo giro di spesa dopo l'aggiornamento.
// Chiave di una riga di Spesa per un ingrediente di un pasto pianificato
// (usata da shopChecked/shopDismissed/shopQty). Legata al NOME
// dell'ingrediente, non alla sua posizione nella ricetta: con la posizione,
// cambiando la ricetta di un pasto o aggiungendo/togliendo ingredienti a una
// ricetta, lo stato ("spuntato", "tolto", "mi serve comunque") finiva
// sull'ingrediente che prendeva quel posto — es. un ingrediente che hai già
// in Dispensa ricompariva in Spesa. list/idx: la lista ingredienti del piatto
// e la posizione della voce, per distinguere lo stesso nome ripetuto due
// volte nella stessa ricetta (~2, ~3...).
function ingKeySlug(name){
  return (name||'').trim().toLowerCase().replace(/[^a-z0-9àèéìòù]+/g, '-').replace(/^-+|-+$/g, '') || 'x';
}
function dayIngKey(weekIdx, i, meal, role, list, idx){
  const slug = ingKeySlug(list[idx] && list[idx].ingrediente);
  const occurrence = list.slice(0, idx).filter(it => ingKeySlug(it.ingrediente) === slug).length;
  const name = occurrence ? `${slug}~${occurrence + 1}` : slug;
  return weekIdx === 0 ? `d${i}_${meal}_${role}_${name}` : `d${weekIdx}_${i}_${meal}_${role}_${name}`;
}
// Vecchia chiave per posizione, solo per la migrazione una tantum (vedi
// shopKeysByName1).
function legacyDayIngKey(weekIdx, i, meal, role, idx){
  return weekIdx === 0 ? `d${i}_${meal}_${role}_${idx}` : `d${weekIdx}_${i}_${meal}_${role}_${idx}`;
}

function currentSeasonKey(){
  const m = new Date().getMonth(); // 0=gen ... 11=dic
  if(m >= 2 && m <= 4) return 'primavera';   // mar-mag
  if(m >= 5 && m <= 7) return 'estate';      // giu-ago
  if(m >= 8 && m <= 10) return 'autunno';    // set-nov
  return 'inverno';                          // dic-feb
}

// Sceglie 7 ricette di stagione per una settimana, variando le categorie
// giorno per giorno (da lunedì a venerdì solo ricette fino a 30-45 min).
// Puramente funzionale: non tocca lo state, così è riusabile sia per la
// settimana corrente che per ogni settimana extra aggiunta.
// Al posto di una lunga lista filtrabile, 3 suggerimenti con una motivazione
// esplicita: sotto i 30 minuti nei feriali, progetto/congelabile nel weekend,
// altrimenti una categoria diversa da quella di oggi. i è l'indice originale
// del giorno (0=Lun...6=Dom): 5 e 6 (Sab/Dom) contano come weekend.
// exclude: nomi già proposti in questa sessione del pannello (vedi
// f.suggestSeen in renderMealBlock) — "Un'altra proposta" li passa qui
// invece di richiamare sempre le stesse 3, dato che l'ordinamento per
// punteggio è deterministico.
function suggestSwaps(weekIdx, i, exclude){
  const currentCat = effectiveCategoria(weekIdx, i);
  const inPlan = new Set();
  WEEK_DISPLAY_ORDER.forEach(di => { const n = effectiveRecipeName(weekIdx, di); if(n) inPlan.add(n); });
  const isWeekend = i === 5 || i === 6;
  const WEEKDAY_TEMPO = ['express','veloce','normale'];
  const scored = allRecipeMetas().filter(r => isMainDish(r) && !inPlan.has(r.nome) && !(exclude && exclude.has(r.nome))).map(r=>{
    const isLong = r.tempoBucket === 'progetto' || r.tempoBucket === 'lunga';
    const isFreezable = r.freezerNew === 'congelabile' || r.freezerNew === 'base';
    let motivo;
    if(isWeekend && isLong) motivo = 'Progetto da weekend';
    else if(WEEKDAY_TEMPO.includes(r.tempoBucket)) motivo = 'Sotto i 30–45 minuti';
    else if(isFreezable) motivo = 'Congelabile: doppia porzione';
    else motivo = 'Categoria diversa da oggi';
    let score = isWeekend ? (isLong ? 0 : 2) : (WEEKDAY_TEMPO.includes(r.tempoBucket) ? 0 : 2);
    if(r.categoriaNew === currentCat) score += 1;
    return { r, motivo, score };
  });
  scored.sort((a,b)=> a.score - b.score);
  return scored.slice(0,3);
}

// Tetto di durata effettivo per un giorno+pasto: l'eccezione se c'è,
// altrimenti la base (cena per ogni giorno, pranzo solo ven/sab/dom).
function getTempoCap(day, meal){
  return state.weekTempoExceptions[`${day}_${meal}`] || state.weekTempoBase || 'progetto';
}
// Un piatto "da pasto" (principale): primo, secondo o piatto unico. Contorni
// e antipasti non sono mai il piatto di un pasto (prima potevano esserlo:
// "Insalata verde" come pranzo), i dolci neanche.
const MAIN_TIPOLOGIE = ['primo','secondo','unico'];
function isMainDish(r){ return !!r && MAIN_TIPOLOGIE.includes(r.tipologia); }
// Il piatto dà la porzione di verdura? Sì se tra gli ingredienti c'è una
// verdura "vera" — non quelle da soffritto/aroma (aglio, cipolla, sedano,
// carota, erbe, limone) e non le patate, che sono un carboidrato (Linee
// guida CREA). Senza ingredienti salvati: sì per le verdure e i contorni che
// non siano di patate.
const VEG_AROMATICS = ['aglio','cipoll','scalogno','sedano','carot','prezzemolo','basilico','limone','menta','salvia','rosmarino','alloro','timo','origano','peperoncino','aneto','patat'];
function recipeGivesVeg(r){
  if(!r) return false;
  const ingredienti = getIngredientsFor(r.nome);
  if(!ingredienti.length) return r.categoriaNew === 'verdure' || (r.tipologia === 'contorno' && guessRecipeBase(r) !== 'patate');
  return ingredienti.some(it=>{
    const n = (it.ingrediente || '').toLowerCase();
    return classifyDept(n) === 'verdura' && !VEG_AROMATICS.some(a => n.includes(a));
  });
}
// --- Equilibrio della settimana -------------------------------------------
// Ogni piatto principale ha due etichette: la base di carboidrati e la fonte
// di proteine principale. Il catalogo le ha scritte (campi base/proteina,
// controllate a mano); per le ricette nuove si ricavano dagli ingredienti
// (guessRecipeBase/guessRecipeProteina) e si possono correggere da
// "Modifica ricetta".
const BASE_ORDER = ['pasta','riso','patate','cereali','pane','nessuna'];
const BASE_LABEL = { pasta:'Pasta', riso:'Riso', patate:'Patate e gnocchi', cereali:'Polenta e altri cereali', pane:'Pane, pizza e impasti', nessuna:'Nessuna' };
const PROTEINA_ORDER = ['legumi','pesce','carne-bianca','carne-rossa','salumi','uova','formaggi','nessuna'];
const PROTEINA_LABEL = { legumi:'Legumi', pesce:'Pesce', 'carne-bianca':'Carne bianca', 'carne-rossa':'Carne rossa', salumi:'Salumi e salsiccia', uova:'Uova', formaggi:'Formaggi', nessuna:'Nessuna' };
// Frequenze in pasti a settimana (14 pasti: pranzo e cena, gli avanzi
// contano come un pasto in più), dalle Linee guida CREA 2018 per una sana
// alimentazione: legumi 3-4, pesce 2-3, carne bianca 2, carne rossa 1,
// salumi occasionali, uova 2-4 (1-2 pasti), formaggi circa 3; patate 1-2.
// La pasta andrebbe bene anche ogni giorno: il tetto a 4 è per la varietà.
const WEEK_PROTEINA_TARGETS = { legumi:[3,4], pesce:[2,3], 'carne-bianca':[2,2], 'carne-rossa':[0,1], salumi:[0,1], uova:[1,2], formaggi:[2,3], nessuna:[0,2] };
const WEEK_BASE_TARGETS = { pasta:[0,4], riso:[0,3], patate:[0,2], cereali:[0,3], pane:[0,3], nessuna:[0,5] };
const has = (text, words) => words.some(w => text.includes(w));
function recipeIngredientText(r){
  return getIngredientsFor(r.nome).map(it => (it.ingrediente || '').toLowerCase()).join(' | ');
}
function guessRecipeBase(r){
  const name = (r.nome || '').toLowerCase();
  const ing = recipeIngredientText(r);
  const all = name + ' | ' + ing;
  // Pasta sfoglia/brisé (torte salate) non è pasta; pane raffermo e
  // pangrattato per legare o gratinare non fanno del piatto un piatto di pane.
  if(has(all, ['pasta sfoglia','pasta brisé','torta salata'])) return 'pane';
  if(r.categoriaNew === 'pasta' || has(all, ['pasta','spaghetti','penne','rigatoni','orecchiette','tortellini','lasagn','cannelloni','trofie','bucatini','linguine','tagliatelle','ravioli','tortelli','fusilli','paccheri'])) return 'pasta';
  if(has(all, ['riso','risotto','carnaroli','arborio','vialone'])) return 'riso';
  if(has(all, ['gnocchi'])) return has(all, ['semolino']) ? 'cereali' : 'patate';
  if(has(all, ['polenta','farina di mais','cous cous','couscous','farro','orzo','semolino','cereali'])) return 'cereali';
  if(/\b(pizza|focaccia|pane|crostini|panzanella|piadina)\b/.test(name) || has(ing, ['panini','pane per crostini'])) return 'pane';
  if(has(all, ['patate','patata'])) return 'patate';
  return 'nessuna';
}
function guessRecipeProteina(r){
  const cat = r.categoriaNew;
  if(cat === 'legumi') return 'legumi';
  if(cat === 'pesce') return 'pesce';
  if(cat === 'uova') return 'uova';
  const ing = recipeIngredientText(r) + ' | ' + (r.nome || '').toLowerCase();
  if(has(ing, ['salmone','merluzzo','tonno','baccalà','orata','branzino','pesce','gamberi','vongole','cozze','polpo','calamari','seppie'])) return 'pesce';
  if(has(ing, ['manzo','vitello','bistecca','brasato','ossibuch','macinata','agnello','maiale','arista','lonza','costine','cotenna','spezzatino','hamburger','ragù'])) return 'carne-rossa';
  if(has(ing, ['pollo','tacchino','coniglio'])) return 'carne-bianca';
  if(has(ing, ['salsiccia','salsicce','prosciutto','speck','pancetta','guanciale','mortadella','salame','wurstel'])) return 'salumi';
  if(has(ing.replace(/fagiolini/g, ''), ['ceci','fagioli','lenticchie','legumi','piselli','fave'])) return 'legumi';
  if(cat === 'uova' || has(ing, ['frittata'])) return 'uova';
  if(has(ing, ['mozzarella','ricotta','gorgonzola','taleggio','provola','scamorza','fontina','stracchino','burrata','caciocavallo','formaggi','pecorino','besciamella'])) return 'formaggi';
  if(has(ing, ['uova','uovo'])) return 'uova';
  return 'nessuna';
}
function recipeBase(r){ return (r && BASE_ORDER.includes(r.base)) ? r.base : guessRecipeBase(r); }
function recipeProteina(r){ return (r && PROTEINA_ORDER.includes(r.proteina)) ? r.proteina : guessRecipeProteina(r); }

// Sceglie i pasti della settimana (cena ogni giorno, pranzo solo Ven/Sab/Dom
// — Lun-Gio pranzo sono gli avanzi della cena di ieri, vedi generateWeek).
// Vincoli fissi: solo primi/secondi/piatti unici (isMainDish), di stagione,
// mai ripetuti, entro il tetto di tempo del pasto. Dentro questi vincoli la
// settimana si sceglie per equilibrio (weekPlanScore): proteine e basi
// vicine alle frequenze di WEEK_*_TARGETS, niente stessa proteina o stessa
// base in due pasti di fila, preparazioni lunghe nel weekend, al massimo una
// ricetta "ogni tanto". Si parte da una settimana a caso e la si migliora
// cambiando un piatto alla volta (o scambiandone due) finché il punteggio
// scende; più ripartenze, si tiene la migliore — casuale ma equilibrata.
// Poi la verdura: ogni pasto cucinato che non ne ha (recipeGivesVeg) riceve
// un contorno, e l'avanzo del giorno dopo se lo porta dietro.
// fixed: { 'giorno_pasto': meta } per i pasti bloccati, che contano
// nell'equilibrio ma non si cambiano.
// Ritorna un array di 7 { cena:{principale,contorni[]}, pranzo:{...}|null }
// (metadati completi del catalogo, non ancora nomi — li estrae generateWeek).
const LEFTOVER_SOURCE_DAYS = [6,0,1,2]; // cene che fanno anche da pranzo il giorno dopo
function weekPlanSlots(){
  const slots = [];
  for(let day = 0; day < 7; day++){
    if(day >= 4) slots.push({ day, meal:'pranzo' });
    slots.push({ day, meal:'cena' });
  }
  return slots; // nell'ordine in cui si mangia (pranzi lun-gio a parte: sono avanzi)
}
// Sequenza dei 14 pasti mangiati: indice nello slots + se è un avanzo.
function weekEatenSequence(slots){
  const idx = (day, meal) => slots.findIndex(s => s.day === day && s.meal === meal);
  const seq = [];
  for(let day = 0; day < 7; day++){
    if(day <= 3) seq.push({ slot: idx((day + 6) % 7, 'cena'), leftover: true });
    else seq.push({ slot: idx(day, 'pranzo'), leftover: false });
    seq.push({ slot: idx(day, 'cena'), leftover: false });
  }
  return seq;
}
function targetDistance(count, [min, max]){ return count < min ? min - count : (count > max ? count - max : 0); }
function weekPlanScore(picks, slots, seq){
  let score = 0;
  const prot = {}, base = {};
  seq.forEach(({ slot })=>{
    const r = picks[slot];
    const p = recipeProteina(r), b = recipeBase(r);
    prot[p] = (prot[p] || 0) + 1;
    base[b] = (base[b] || 0) + 1;
  });
  Object.entries(WEEK_PROTEINA_TARGETS).forEach(([k, range]) => { score += 10 * targetDistance(prot[k] || 0, range); });
  Object.entries(WEEK_BASE_TARGETS).forEach(([k, range]) => { score += 6 * targetDistance(base[k] || 0, range); });
  // Varietà tra un pasto e il successivo (un avanzo accanto alla cena da cui
  // viene è lo stesso piatto per forza: non conta).
  for(let k = 1; k < seq.length; k++){
    if(seq[k].slot === seq[k-1].slot) continue;
    const a = picks[seq[k-1].slot], b = picks[seq[k].slot];
    const pa = recipeProteina(a), pb = recipeProteina(b);
    const ba = recipeBase(a), bb = recipeBase(b);
    if(pa === pb && pa !== 'nessuna') score += 4;
    if(ba === bb && ba !== 'nessuna') score += 3;
    if(a.categoriaNew === b.categoriaNew) score += 1;
    if(a.tipologia === b.tipologia) score += 1;
  }
  let ogniTanto = 0;
  picks.forEach((r, i)=>{
    const needsPrep = r.pianificazione && r.pianificazione !== 'nessuna';
    if(needsPrep && slots[i].day < 5) score += 2;
    if(r.gradimento === 'ogni-tanto') ogniTanto++;
  });
  if(ogniTanto > 1) score += 20 * (ogniTanto - 1);
  return score;
}
function pickWeekRecipes(fixed){
  fixed = fixed || {};
  const season = currentSeasonKey();
  const inSeason = r => r.stagioni.includes(season) || r.stagioni.includes('tutto');
  let pool = allRecipeMetas().filter(isMainDish).filter(inSeason);
  if(pool.length < 20) pool = allRecipeMetas().filter(isMainDish); // fallback di sicurezza, non dovrebbe servire
  const contorniPool = allRecipeMetas().filter(r => r.tipologia === 'contorno' && inSeason(r) && recipeGivesVeg(r));
  const rand = n => Math.floor(Math.random() * n);
  const shuffle = arr => { const a = arr.slice(); for(let i = a.length - 1; i > 0; i--){ const j = rand(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const withinCap = (list, day, meal)=>{
    const capIdx = TEMPO_ORDER.indexOf(getTempoCap(day, meal));
    if(capIdx >= TEMPO_ORDER.length - 1) return list;
    const allowed = TEMPO_ORDER.slice(0, capIdx + 1);
    const limited = list.filter(r => allowed.includes(r.tempoBucket));
    return limited.length ? limited : list; // rispetta il tetto se possibile
  };

  const slots = weekPlanSlots();
  const seq = weekEatenSequence(slots);
  const fixedAt = slots.map(s => fixed[`${s.day}_${s.meal}`] || null);
  const fixedNames = new Set(fixedAt.filter(Boolean).map(r => r.nome));
  const candidates = slots.map((s, i) => fixedAt[i] ? [fixedAt[i]] : withinCap(pool.filter(r => !fixedNames.has(r.nome)), s.day, s.meal));

  function randomWeek(){
    const used = new Set(fixedNames);
    return slots.map((s, i)=>{
      if(fixedAt[i]) return fixedAt[i];
      const free = candidates[i].filter(r => !used.has(r.nome));
      const r = free.length ? free[rand(free.length)] : candidates[i][rand(candidates[i].length)];
      used.add(r.nome);
      return r;
    });
  }
  const free = slots.map((s, i) => i).filter(i => !fixedAt[i]);
  function improve(picks){
    let score = weekPlanScore(picks, slots, seq);
    for(let it = 0; it < 1500 && score > 0; it++){
      const next = picks.slice();
      const i = free[rand(free.length)];
      if(Math.random() < 0.3 && free.length > 1){
        // scambio di due pasti (se entrambi i piatti vanno bene nell'altro)
        const j = free[rand(free.length)];
        if(i === j || !candidates[j].includes(picks[i]) || !candidates[i].includes(picks[j])) continue;
        next[i] = picks[j]; next[j] = picks[i];
      } else {
        const used = new Set(picks.map(r => r.nome));
        const r = candidates[i][rand(candidates[i].length)];
        if(used.has(r.nome)) continue;
        next[i] = r;
      }
      const nextScore = weekPlanScore(next, slots, seq);
      if(nextScore <= score){ picks = next; score = nextScore; }
    }
    return { picks, score };
  }
  let best = null;
  for(let attempt = 0; attempt < 6; attempt++){
    const res = improve(randomWeek());
    if(!best || res.score < best.score) best = res;
    if(best.score === 0) break;
  }
  const picks = best.picks;

  const days = [];
  for(let day = 0; day < 7; day++) days.push({ cena: null, pranzo: null });
  slots.forEach((s, i)=>{ days[s.day][s.meal] = { principale: picks[i], contorni: [] }; });
  // Verdura a ogni pasto: un contorno dove il piatto non ne ha. Senza
  // ripetere lo stesso contorno nella settimana, finché ce ne sono.
  const usedContorni = new Set();
  const shuffledContorni = shuffle(contorniPool);
  slots.forEach(s=>{
    const m = days[s.day][s.meal];
    if(recipeGivesVeg(m.principale)) return;
    const fits = withinCap(shuffledContorni, s.day, s.meal);
    const contorno = fits.find(r => !usedContorni.has(r.nome)) || fits[0];
    if(!contorno) return; // nessun contorno di stagione: va bene comunque
    usedContorni.add(contorno.nome);
    m.contorni.push(contorno);
  });
  return days;
}

// Rimuove ogni collegamento "avanzo di" che punta a mealKey: usata ogni volta
// che la ricetta di un pasto cambia, per non lasciare un pasto "fantasma" che
// continua a mostrare una ricetta di cui in realtà non ci sono più avanzi.
function unlinkDaysPointingTo(mealKey){
  Object.keys(state.dayLinks).forEach(k=>{
    if(state.dayLinks[k] === mealKey) clearDayLink(k);
  });
}
// Rimuove tutto ciò che è specifico della ricetta assegnata a un pasto prima
// che cambi identità (collegamento "avanzo di" + nota variante, e l'eventuale
// override porzioni): altrimenti resterebbero agganciati alla nuova ricetta
// per puro riuso della chiave "weekIdx_i_meal", con effetti confusi (es.
// porzioni scalate per una ricetta diversa da quella per cui erano impostate).
function clearDayLink(mealKey){
  delete state.dayLinks[mealKey];
  delete state.dayLinkNotes[mealKey];
  delete state.dayPortions[mealKey];
}
// Cattura link/nota/porzioni di un pasto E di ogni altro pasto che lo aveva
// come "avanzo di" (sciolto da clearDayLink/unlinkDaysPointingTo quando la
// ricetta di "mealKey" cambia — es. dopo uno swap), per poterli ripristinare
// tutti insieme con "Annulla".
function snapshotMealLinks(mealKey){
  const affectedKeys = [mealKey, ...Object.keys(state.dayLinks).filter(k => state.dayLinks[k] === mealKey)];
  return affectedKeys.map(key => ({
    key,
    link: state.dayLinks[key],
    note: state.dayLinkNotes[key],
    portions: state.dayPortions[key]
  }));
}
function restoreMealLinks(snap){
  snap.forEach(({key, link, note, portions})=>{
    if(link !== undefined) state.dayLinks[key] = link; else delete state.dayLinks[key];
    if(note !== undefined) state.dayLinkNotes[key] = note; else delete state.dayLinkNotes[key];
    if(portions !== undefined) state.dayPortions[key] = portions; else delete state.dayPortions[key];
  });
}
// "Svuota il pasto": scioglie un eventuale collegamento avanzo (proprio o di
// chi dipendeva da questo pasto — vuoto non ha più nulla da cui avanzare),
// azzera fatto/scelto-a-mano, e scrive la sentinella MEAL_EMPTY come
// principale — così effectiveMeal si ferma qui invece di ricadere sulla
// baseline generata (vedi effectiveMeal/effectiveRecipeMeta).
function clearMealToEmpty(weekIdx, i, meal){
  const key = mealKey(weekIdx, i, meal);
  clearDayLink(key);
  unlinkDaysPointingTo(key);
  clearMealFlag(weekMealsDoneRef(weekIdx), i, meal);
  clearMealFlag(weekOverridePickedRef(weekIdx), i, meal);
  writeMealPrincipale(weekOverridesRef(weekIdx), i, meal, MEAL_EMPTY);
}
// Svuota un pasto e mostra il toast "Annulla" (ripristina ricetta, eventuale
// collegamento avanzo/nota/porzioni, e i flag fatto/scelto-a-mano) — stessa
// azione richiamata sia da "Svuota il pasto" nel foglio "⋯" sia dallo swipe
// sulla card (vedi attachHandlers).
function performClearMeal(key){
  const { weekIdx, i, meal } = parseMealKey(key);
  const overridesMap = weekOverridesRef(weekIdx);
  const prevOverrideSlot = overridesMap[i] ? overridesMap[i][meal] : undefined;
  const prevLink = state.dayLinks[key];
  const prevLinkNote = state.dayLinkNotes[key];
  const prevPortions = state.dayPortions[key];
  const mealsDoneMap = weekMealsDoneRef(weekIdx);
  const prevDone = mealsDoneMap[i] ? mealsDoneMap[i][meal] : undefined;
  const pickedMap = weekOverridePickedRef(weekIdx);
  const prevPicked = pickedMap[i] ? pickedMap[i][meal] : undefined;
  clearMealToEmpty(weekIdx, i, meal);
  state.mealOverflowOpen = null;
  persist(); render();
  showUndoToast('Pasto svuotato', ()=>{
    if(prevLink !== undefined) state.dayLinks[key] = prevLink;
    if(prevLinkNote !== undefined) state.dayLinkNotes[key] = prevLinkNote;
    if(prevPortions !== undefined) state.dayPortions[key] = prevPortions;
    if(prevOverrideSlot !== undefined){
      const om = weekOverridesRef(weekIdx);
      if(!om[i]) om[i] = emptyDaySlot();
      om[i][meal] = prevOverrideSlot;
    }
    if(prevDone !== undefined){
      const md = weekMealsDoneRef(weekIdx);
      if(!md[i]) md[i] = {};
      md[i][meal] = prevDone;
    }
    if(prevPicked !== undefined){
      const pd = weekOverridePickedRef(weekIdx);
      if(!pd[i]) pd[i] = {};
      pd[i][meal] = prevPicked;
    }
    persist(); render();
  });
}
// Ripulisce ogni riferimento a una ricetta eliminata dalla pianificazione
// (settimana corrente + tutte le extra): un pasto il cui principale
// effettivo era quella ricetta torna vuoto (stesso meccanismo di "Svuota il
// pasto" — scioglie l'eventuale avanzo, sblocca, azzera fatto/scelto-a-mano),
// un contorno che la usava la perde soltanto, principale invariato.
// Altrimenti "Elimina" sul Ricettario toglieva la ricetta dalla lista ma
// non dai pasti già pianificati, che continuavano a mostrarla — e a
// riproporla rigenerando, se il pasto capitava a essere bloccato.
function purgeRecipeFromPlanning(name){
  const weekCount = 1 + state.extraWeeks.length;
  for(let weekIdx = 0; weekIdx < weekCount; weekIdx++){
    for(let i = 0; i < 7; i++){
      ['pranzo','cena'].forEach(meal=>{
        const mealData = effectiveMeal(weekIdx, i, meal);
        if(mealData.principale === name){
          clearMealToEmpty(weekIdx, i, meal);
          delete state.mealLocked[mealKey(weekIdx, i, meal)];
        } else if(mealData.contorni && mealData.contorni.includes(name)){
          setMealContorni(weekIdx, i, meal, mealData.contorni.filter(c => c !== name));
        }
      });
    }
  }
}
// Ciclo nessuno -> mara -> ste -> nessuno, un tap alla volta, senza modali.
function toggleCook(dayKey){
  const cur = state.cooks[dayKey];
  if(!cur) state.cooks[dayKey] = 'mara';
  else if(cur === 'mara') state.cooks[dayKey] = 'ste';
  else delete state.cooks[dayKey];
  persist(); render();
}
function toggleShopAssignee(store){
  const cur = state.shopAssignees[store];
  if(!cur) state.shopAssignees[store] = 'mara';
  else if(cur === 'mara') state.shopAssignees[store] = 'ste';
  else delete state.shopAssignees[store];
  persist(); render();
}
// Stato legato a un pasto con il numero della settimana nella chiave
// ("1_3_cena": settimana 1, giovedì, cena) o nel valore (dayLinks punta a un
// altro pasto). Le righe di Spesa di una settimana extra hanno la forma
// "d<settimana>_<giorno>_<pasto>_..." (quelle della settimana corrente
// "d<giorno>_<pasto>_...", vedi dayIngKey).
const WEEK_KEYED_FIELDS = ['mealLocked','dayLinks','dayLinkNotes','dayPortions','cooks'];
const WEEK_SHOP_FIELDS = ['shopChecked','shopDismissed','shopQty'];
// Riscrive ogni chiave legata a una settimana secondo mapWeek(weekIdx):
// un numero = nuova settimana, null = da cancellare. Usata quando si
// elimina una settimana extra (le successive scalano di una posizione) e
// prima di generare una settimana nuova (niente residui di una vecchia).
function remapWeekKeys(mapWeek){
  const remapMealKey = key=>{
    const m = /^(\d+)_(\d+)_(pranzo|cena)$/.exec(key);
    if(!m) return key;
    const w = mapWeek(parseInt(m[1], 10));
    return w === null ? null : `${w}_${m[2]}_${m[3]}`;
  };
  WEEK_KEYED_FIELDS.forEach(field=>{
    const dict = state[field];
    if(!dict) return;
    const next = {};
    Object.keys(dict).forEach(key=>{
      const newKey = remapMealKey(key);
      if(newKey === null) return;
      let value = dict[key];
      if(field === 'dayLinks'){ value = remapMealKey(value); if(value === null) return; }
      next[newKey] = value;
    });
    state[field] = next;
  });
  const remapShopKey = key=>{
    const m0 = /^d(\d+)_(pranzo|cena)_(.*)$/.exec(key);
    if(m0){ // riga della settimana corrente (0)
      const w0 = mapWeek(0);
      if(w0 === null) return null;
      return w0 === 0 ? key : `d${w0}_${m0[1]}_${m0[2]}_${m0[3]}`;
    }
    const m = /^d(\d+)_(\d+)_(pranzo|cena)_(.*)$/.exec(key);
    if(!m) return key; // voce non di un pasto: invariata
    const w = mapWeek(parseInt(m[1], 10));
    if(w === null) return null;
    return w === 0 ? `d${m[2]}_${m[3]}_${m[4]}` : `d${w}_${m[2]}_${m[3]}_${m[4]}`;
  };
  WEEK_SHOP_FIELDS.forEach(field=>{
    const dict = state[field];
    if(!dict) return;
    const next = {};
    Object.keys(dict).forEach(key=>{
      const parts = key.split(',').map(remapShopKey);
      if(parts.some(k => k === null)) return;
      next[parts.join(',')] = dict[key];
    });
    state[field] = next;
  });
}
// Passaggio di settimana: la settimana 0 è sempre quella che parte dall'ultimo
// sabato (vedi upcomingSaturday), ma i dati non si spostavano da soli — ogni
// sabato il menù della settimana appena finita restava lì con le date nuove,
// e la settimana successiva già pianificata slittava di altri 7 giorni.
// state.week0Start ricorda il sabato a cui appartengono i dati della
// settimana 0: se nel frattempo è arrivato un sabato nuovo, la successiva
// diventa la corrente (una volta per ogni settimana passata), quella finita
// si scarta insieme al suo stato per pasto (vedi remapWeekKeys). Gira solo a
// dati sincronizzati (vedi render), così due telefoni non la fanno due volte.
function isoLocalDate(d){
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function rolloverWeeksIfNeeded(){
  const cur = upcomingSaturday();
  const curIso = isoLocalDate(cur);
  if(state.week0Start === curIso) return false;
  if(!state.week0Start){ state.week0Start = curIso; persist(); return false; }
  const [y, m, d] = state.week0Start.split('-').map(Number);
  const weeks = Math.round((new Date(cur.getFullYear(), cur.getMonth(), cur.getDate()) - new Date(y, m-1, d)) / (7 * 86400000));
  for(let k = 0; k < weeks; k++){
    const next = state.extraWeeks.shift();
    state.weekBaseline = (next && next.baseline) || {};
    state.weekOverrides = (next && next.overrides) || {};
    state.weekOverridePicked = (next && next.overridePicked) || {};
    state.mealsDone = (next && next.mealsDone) || {};
    remapWeekKeys(w => w === 0 ? null : w - 1);
  }
  state.week0Start = curIso; // (anche se l'orologio è tornato indietro: si riallinea e basta)
  state.expandedDay = null;
  state.swapOpenDay = null;
  persist();
  return weeks > 0;
}
// Genera (o rigenera) la settimana weekIdx: 0 è quella corrente (in cima allo
// state, come sempre), weekIdx>=1 crea/sostituisce state.extraWeeks[weekIdx-1].
// Cattura l'intera pianificazione (tutte le settimane) prima di un'azione che
// la tocca in profondità — generateWeek e l'eliminazione di una ricetta dal
// Ricettario: entrambe possono scrivere non solo sulla settimana bersaglio ma
// anche su dayLinks/dayPortions/mealLocked di altre settimane (un avanzo
// sciolto altrove, un blocco invalidato), quindi il ripristino via "Annulla"
// deve coprire tutti questi campi insieme, non solo quelli della settimana
// diretta interessata.
function snapshotPlanningState(){
  return {
    weekBaseline: JSON.parse(JSON.stringify(state.weekBaseline)),
    weekOverrides: JSON.parse(JSON.stringify(state.weekOverrides)),
    weekOverridePicked: JSON.parse(JSON.stringify(state.weekOverridePicked)),
    mealsDone: JSON.parse(JSON.stringify(state.mealsDone)),
    extraWeeks: JSON.parse(JSON.stringify(state.extraWeeks)),
    dayLinks: JSON.parse(JSON.stringify(state.dayLinks)),
    dayLinkNotes: JSON.parse(JSON.stringify(state.dayLinkNotes)),
    dayPortions: JSON.parse(JSON.stringify(state.dayPortions)),
    mealLocked: JSON.parse(JSON.stringify(state.mealLocked))
  };
}
function restorePlanningState(snap){
  state.weekBaseline = snap.weekBaseline;
  state.weekOverrides = snap.weekOverrides;
  state.weekOverridePicked = snap.weekOverridePicked;
  state.mealsDone = snap.mealsDone;
  state.extraWeeks = snap.extraWeeks;
  state.dayLinks = snap.dayLinks;
  state.dayLinkNotes = snap.dayLinkNotes;
  state.dayPortions = snap.dayPortions;
  state.mealLocked = snap.mealLocked;
}
function generateWeek(weekIdx){
  // Settimana extra nuova (non ancora esistente): qualunque stato rimasto con
  // il suo numero (blocchi, avanzi, porzioni... di una settimana eliminata in
  // passato, quando non venivano ripuliti) non le appartiene — si cancella,
  // altrimenti un vecchio blocco la lasciava con giorni vuoti.
  if(weekIdx > 0 && !state.extraWeeks[weekIdx-1]) remapWeekKeys(w => w === weekIdx ? null : w);
  // Pasti bloccati (state.mealLocked) di questa settimana: catturo la loro
  // ricetta effettiva ATTUALE (principale+contorni) e l'eventuale link avanzo
  // prima di rigenerare, per riscriverli identici dopo — vedi il ripristino
  // più sotto. Il generatore li riceve come fissi (vedi pickWeekRecipes):
  // non li cambia, ma ne tiene conto per l'equilibrio della settimana.
  const lockedMeals = [];
  for(let li=0; li<7; li++){
    ['pranzo','cena'].forEach(lm=>{
      const lkey = `${weekIdx}_${li}_${lm}`;
      if(state.mealLocked[lkey]){
        lockedMeals.push({ i: li, meal: lm, data: effectiveMeal(weekIdx, li, lm), link: linkedSourceMealKey(weekIdx, li, lm) });
      }
    });
  }
  // I pasti bloccati restano com'erano, ma pesano sull'equilibrio della settimana.
  const fixed = {};
  lockedMeals.forEach(({i, meal, data, link})=>{
    const meta = !link && data.principale ? getRecipeMeta(data.principale) : null;
    if(meta && (meal === 'cena' || i >= 4)) fixed[`${i}_${meal}`] = meta;
  });
  const days = pickWeekRecipes(fixed);
  const baseline = {};
  days.forEach((d, i) => {
    baseline[i] = {
      cena: { principale: d.cena.principale.nome, contorni: d.cena.contorni.map(c=>c.nome) },
      pranzo: d.pranzo ? { principale: d.pranzo.principale.nome, contorni: d.pranzo.contorni.map(c=>c.nome) } : emptyMealSlot()
    };
  });
  if(weekIdx === 0){
    state.weekBaseline = baseline;
    state.weekOverrides = {};
    state.weekOverridePicked = {};
    state.mealsDone = {};
  } else {
    state.extraWeeks[weekIdx-1] = { baseline, overrides:{}, overridePicked:{}, mealsDone:{} };
  }
  for(let i=0;i<7;i++){
    ['pranzo','cena'].forEach(meal=>{
      const mealKey = `${weekIdx}_${i}_${meal}`;
      clearDayLink(mealKey);
      unlinkDaysPointingTo(mealKey);
    });
  }
  // Pranzo Lun-Gio (indici 0-3) = avanzo automatico della cena di ieri sera:
  // Dom(6)cena->Lun(0)pranzo, Lun(0)cena->Mar(1)pranzo, Mar(1)cena->Mer(2)pranzo,
  // Mer(2)cena->Gio(3)pranzo. È un link come uno scelto a mano con "è avanzo
  // di": sostituibile/rimuovibile allo stesso identico modo.
  for(let i = 0; i <= 3; i++){
    const sourceDay = (i - 1 + 7) % 7;
    state.dayLinks[`${weekIdx}_${i}_pranzo`] = `${weekIdx}_${sourceDay}_cena`;
  }
  // Porzioni di base: 2, tranne le cene "apripista" di Dom/Lun/Mar/Mer (indici
  // 6,0,1,2 — quelle da cui Lun-Gio pranzo prende l'avanzo), che partono a 3
  // per coprire anche il pranzo del giorno dopo.
  for(let i = 0; i < 7; i++){
    state.dayPortions[`${weekIdx}_${i}_cena`] = [6,0,1,2].includes(i) ? 3 : 2;
    if(i === 4 || i === 5 || i === 6) state.dayPortions[`${weekIdx}_${i}_pranzo`] = 2;
  }
  // Ripristino i pasti bloccati: stessa ricetta/contorni di prima nella
  // baseline appena generata, ed eventuale link avanzo preservato al posto
  // di quello appena assegnato dal loop lun-gio sopra (o rimosso, se non ne
  // aveva uno — es. un pranzo bloccato di ven-dom pianificato a mano).
  // Se il principale bloccato non esiste più nel catalogo (ricetta creata a
  // mano e poi eliminata: "Elimina" su una ricetta personalizzata cancella
  // i dati, non li nasconde soltanto), il blocco non ha più nulla di valido
  // da preservare: si scarta e si sblocca, restando sulla ricetta appena
  // generata invece di far "riapparire" una ricetta cancellata a ogni
  // rigenerazione. Stesso controllo sui contorni, uno per uno.
  if(lockedMeals.length){
    const targetBaseline = weekIdx === 0 ? state.weekBaseline : state.extraWeeks[weekIdx-1].baseline;
    lockedMeals.forEach(({i, meal, data, link})=>{
      const lkey = `${weekIdx}_${i}_${meal}`;
      // Blocco su un pasto vuoto, o su una ricetta che non esiste più: non
      // c'è niente da preservare, si sblocca e resta la ricetta appena generata.
      if(!data.principale || !getRecipeMeta(data.principale)){
        delete state.mealLocked[lkey];
        return;
      }
      const validContorni = (data.contorni || []).filter(c => getRecipeMeta(c));
      targetBaseline[i][meal] = { principale: data.principale, contorni: validContorni };
      if(link) state.dayLinks[lkey] = link; else delete state.dayLinks[lkey];
    });
  }
  state.expandedDay = null;
  state.swapOpenDay = null;
  state.genSettingsOpen = null;
  persist();
  render();
}
function addWeek(){
  generateWeek(state.extraWeeks.length + 1);
}
// Rimuove una settimana extra: le successive scalano di una posizione, e con
// loro lo stato che porta il numero di settimana nella chiave (blocchi,
// avanzi, porzioni, chi cucina, spunte di Spesa — vedi remapWeekKeys): quello
// della settimana eliminata sparisce. Prima restava lì e finiva sulla
// settimana che prendeva quel posto (es. vecchi blocchi → giorni vuoti).
function removeWeek(weekIdx){
  if(weekIdx === 0) return;
  const removedIndex = weekIdx - 1;
  const removedWeek = state.extraWeeks[removedIndex];
  const keyedSnap = {};
  WEEK_KEYED_FIELDS.concat(WEEK_SHOP_FIELDS).forEach(f=>{ keyedSnap[f] = JSON.parse(JSON.stringify(state[f] || {})); });
  state.extraWeeks.splice(removedIndex, 1);
  remapWeekKeys(w => w < weekIdx ? w : (w === weekIdx ? null : w - 1));
  state.expandedDay = null;
  state.swapOpenDay = null;
  state.genSettingsOpen = null;
  persist();
  render();
  showUndoToast('Settimana eliminata', ()=>{
    state.extraWeeks.splice(removedIndex, 0, removedWeek);
    Object.assign(state, keyedSnap);
    persist(); render();
  });
}

// Scambia due pasti qualsiasi (anche pranzo con cena, anche tra settimane
// diverse — drag&drop nel Menù): entrambi diventano override manuali,
// coerente con "Cambia ricetta" — il "fatta" non ha più senso dopo lo
// scambio, quindi si azzera per entrambi. Le porzioni restano legate alla
// posizione (giorno+pasto), non seguono la ricetta: scambiare una cena da 3
// porzioni con un pranzo da 2 lascia 3 e 2 dove stavano, si scambia solo
// cosa cucinare (principale e contorni). Un collegamento "avanzo di" invece
// si scioglie: non avrebbe più senso con la ricetta nuova.
// Un pasto vuoto scambiato con uno pieno deve restare vuoto (sentinella
// MEAL_EMPTY), non '' — con '' effectiveMeal ricadrebbe sulla baseline
// generata e al posto del pasto spostato ricomparirebbe la vecchia ricetta.
// I contorni viaggiano insieme al principale: si sposta il piatto intero.
function writeSwappedMeal(map, i, meal, slot){
  writeMealPrincipale(map, i, meal, slot.principale || MEAL_EMPTY);
  if(slot.principale && slot.contorni.length) map[i][meal].contorni = slot.contorni.slice();
}
// Stato "grezzo" di un pasto nelle tre mappe per settimana (override,
// fatto, scelto-a-mano), per poterlo rimettere com'era con "Annulla":
// undefined = la chiave non c'era, e al ripristino va tolta di nuovo (non
// messa a null, altrimenti un pasto generato resterebbe bloccato).
function snapshotMealSlot(weekIdx, i, meal){
  const read = map => (map[i] && map[i][meal] !== undefined) ? JSON.parse(JSON.stringify(map[i][meal])) : undefined;
  return { weekIdx, i, meal,
    override: read(weekOverridesRef(weekIdx)),
    done: read(weekMealsDoneRef(weekIdx)),
    picked: read(weekOverridePickedRef(weekIdx)) };
}
function restoreMealSlot({ weekIdx, i, meal, override, done, picked }){
  [[weekOverridesRef(weekIdx), override, emptyDaySlot], [weekMealsDoneRef(weekIdx), done, ()=>({})], [weekOverridePickedRef(weekIdx), picked, ()=>({})]].forEach(([map, value, makeDay])=>{
    if(value !== undefined){
      if(!map[i]) map[i] = makeDay();
      map[i][meal] = value;
    } else if(map[i]){
      delete map[i][meal];
    }
  });
}
function swapDayRecipes(weekIdxA, i, mealA, weekIdxB, j, mealB){
  if(weekIdxA === weekIdxB && i === j && mealA === mealB) return;
  const slotA = effectiveMeal(weekIdxA, i, mealA);
  const slotB = effectiveMeal(weekIdxB, j, mealB);
  const mealKeyA = mealKey(weekIdxA, i, mealA), mealKeyB = mealKey(weekIdxB, j, mealB);
  const snapA = snapshotMealSlot(weekIdxA, i, mealA), snapB = snapshotMealSlot(weekIdxB, j, mealB);
  const linksSnap = snapshotMealLinks(mealKeyA).concat(snapshotMealLinks(mealKeyB));
  const portionsA = state.dayPortions[mealKeyA], portionsB = state.dayPortions[mealKeyB];
  writeSwappedMeal(weekOverridesRef(weekIdxA), i, mealA, slotB);
  writeSwappedMeal(weekOverridesRef(weekIdxB), j, mealB, slotA);
  clearMealFlag(weekOverridePickedRef(weekIdxA), i, mealA);
  clearMealFlag(weekOverridePickedRef(weekIdxB), j, mealB);
  clearMealFlag(weekMealsDoneRef(weekIdxA), i, mealA);
  clearMealFlag(weekMealsDoneRef(weekIdxB), j, mealB);
  clearDayLink(mealKeyA);
  clearDayLink(mealKeyB);
  unlinkDaysPointingTo(mealKeyA);
  unlinkDaysPointingTo(mealKeyB);
  // Le porzioni restano al pasto (dipendono da chi c'è a tavola, non dal
  // piatto): clearDayLink le ha tolte insieme al link, qui si rimettono.
  if(portionsA !== undefined) state.dayPortions[mealKeyA] = portionsA;
  if(portionsB !== undefined) state.dayPortions[mealKeyB] = portionsB;
  state.swapOpenDay = null;
  persist();
  render();
  showUndoToast('Ricette scambiate', ()=>{
    restoreMealSlot(snapA);
    restoreMealSlot(snapB);
    restoreMealLinks(linksSnap);
    persist(); render();
  });
}

// Titolo nella barra in alto: il nome della tab al posto di "CookPOP",
// tranne nel Menù (resta il nome dell'app — è la schermata principale).
const TOPBAR_TITLE = { menu:'CookPOP', spesa:'Spesa', prep:'Ricette', dispensa:'Dispensa' };
// X per cancellare il testo di un campo di ricerca: stesso tratto
// dell'icona di ricerca qui sotto, dimensionata in em (segue il font del
// campo) e in currentColor (il colore del testo).
const CLEAR_ICON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6 6 18M6 6l12 12"></path></svg>';
const SEARCH_ICON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="10" cy="10" r="7"></circle><path d="m21 21-6-6"></path></g></svg>';

// Modale "Novità": compare una volta sola per persona al prossimo caricamento
// (su tutti i suoi dispositivi) quando `version` è diversa da quella che ha
// già chiuso (state.whatsNewSeenBy), poi resta chiusa finché non si cambia di nuovo
// `version`. NON è automatica a ogni deploy — resta `null` di default, e va
// valorizzata a mano solo quando si vuole davvero annunciare qualcosa.
const WHATS_NEW = {
  version: '2026-09-28',
  title: 'Novità',
  items: [
    'Settimane più equilibrate: il generatore segue le Linee guida CREA — legumi 3-4 volte, pesce 2-3, carne bianca 2, carne rossa e salumi al massimo una, uova e formaggi con misura — e alterna pasta, riso, patate, polenta e pane. La pasta non va oltre 4 pasti.',
    'Verdura a ogni pasto: se il piatto non ne ha, arriva un contorno (le patate non contano come verdura).',
    'In "Modifica ricetta" puoi vedere e correggere base e fonte di proteine di ogni ricetta.',
    'Ogni sabato la settimana passa da sola alla successiva, l\'app si apre anche senza rete, e ogni ricetta ha il suo link alla fonte.'
  ]
};
// Chi l'ha già vista si ricorda per persona (Mara e Ste condividono lo
// stesso spazio: prima, se la chiudeva uno, non compariva più all'altro).
function whatsNewViewerKey(){
  const u = getCurrentUser();
  if(u) return u;
  const name = (loggedInEmail || '').split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
  return name || 'me';
}
function hasSeenWhatsNew(){
  return !WHATS_NEW || (state.whatsNewSeenBy || {})[whatsNewViewerKey()] === WHATS_NEW.version;
}
function markWhatsNewSeen(){
  if(!WHATS_NEW) return;
  if(!state.whatsNewSeenBy) state.whatsNewSeenBy = {};
  state.whatsNewSeenBy[whatsNewViewerKey()] = WHATS_NEW.version;
}
function renderWhatsNewModal(){
  if(hasSeenWhatsNew()) return '';
  return `
  <div class="filters-modal-backdrop" data-close-whats-new>
    <div class="filters-modal" data-stop-close>
      <div class="filters-modal-header">
        <h3>${escapeHtml(WHATS_NEW.title || 'Novità')}</h3>
        <button class="btn is-icon filters-close-btn" data-close-whats-new>✕</button>
      </div>
      <div class="filter-groups">
        <ul class="steps-list">
          ${WHATS_NEW.items.map(i=>`<li>${escapeHtml(i)}</li>`).join('')}
        </ul>
      </div>
      <div class="filters-modal-footer">
        <button class="btn is-solid mini-add-btn" data-close-whats-new>Ho capito</button>
      </div>
    </div>
  </div>`;
}
function render(){
  applyCustomDepts();
  if(personalSynced || !window.cookpopSync) rolloverWeeksIfNeeded();
  document.querySelectorAll('nav.tabs button').forEach(b=>{ b.classList.toggle('active', b.dataset.tab === state.tab); });
  const topbarTitle = document.getElementById('topbar-title');
  if(topbarTitle) topbarTitle.textContent = TOPBAR_TITLE[state.tab] || 'CookPOP';
  const panel = document.getElementById('panel');
  const focus = captureFocus(panel);
  dialogOpenerBeforeRender = describeElement(document.activeElement);
  let html = '';
  if(state.tab === 'menu') html = renderMenu();
  if(state.tab === 'spesa') html = renderSpesa();
  if(state.tab === 'prep') html = renderPrep();
  if(state.tab === 'dispensa') html = renderDispensa();
  // Una sola scrittura: con "innerHTML +=" il browser riserializzava e
  // riparsava l'intero pannello per ogni pezzo aggiunto (3 volte a render).
  panel.innerHTML = html + renderUndoToast() + renderWhatsNewModal();
  attachHandlers();
  restoreFocus(panel, focus);
  reconcileModalHistory();
}
// Il render sostituisce tutto il pannello, compreso il campo in cui si sta
// scrivendo: prima ne ricordo l'identità (id o attributi data-*) e la
// posizione del cursore, dopo rimetto il fuoco sul campo nuovo equivalente.
// Così il cursore resta dov'era (prima ogni campo lo riportava in fondo, e
// correggere una lettera a metà parola era impossibile).
function captureFocus(panel){
  const el = document.activeElement;
  if(!el || !panel.contains(el) || !/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return null;
  let selector = el.tagName.toLowerCase();
  if(el.id) selector += '#' + CSS.escape(el.id);
  else {
    const attrs = [...el.attributes].filter(a => a.name.startsWith('data-'));
    if(!attrs.length) return null;
    selector += attrs.map(a => `[${a.name}="${CSS.escape(a.value)}"]`).join('');
  }
  let start = null, end = null;
  try{ start = el.selectionStart; end = el.selectionEnd; }catch(e){}
  return { selector, start, end };
}
function restoreFocus(panel, focus){
  if(!focus) return;
  const el = panel.querySelector(focus.selector);
  if(!el) return;
  const cur = document.activeElement;
  if(cur && cur !== el && cur !== document.body && panel.contains(cur)) return; // attachHandlers ha già messo il fuoco altrove apposta (es. un campo appena aperto)
  if(cur !== el) el.focus({ preventScroll: true });
  if(typeof focus.start === 'number' && el.value !== undefined){
    const len = el.value.length;
    try{ el.setSelectionRange(Math.min(focus.start, len), Math.min(focus.end, len)); }catch(e){}
  }
}

// --- Tasto "indietro" del telefono chiude modali/schermate invece di uscire
// dall'app --------------------------------------------------------------
// Invece di toccare ogni singolo punto di apertura/chiusura (sono più di
// 15 tra modali, pannelli e schermate a tutto schermo, ognuna con più modi
// di chiudersi — ✕, backdrop, Annulla...), il controllo è centralizzato qui:
// dopo ogni render() contiamo quante ne risultano aperte (isSettingsBackdropOpen
// più tutti i flag di stato) e la confrontiamo con quante ne avevamo "prenotate"
// nella cronologia del browser (modalHistoryDepth), aggiungendo o togliendo
// entry di conseguenza. Il tasto indietro genera un evento popstate: se in
// quel momento la cronologia aveva entry nostre, chiudiamo solo la più "in
// cima" (la prima di MODAL_CHECKS che risulta aperta, elencate dalla più
// annidata/specifica alla più di base) invece di uscire dall'app o saltare
// tra le tab — che restano gestite come sempre dall'hash (#menu/#spesa/...).
function isSettingsBackdropOpen(){
  const el = document.getElementById('settings-backdrop');
  return !!(el && el.classList.contains('open'));
}
function closeSettingsBackdrop(){
  const el = document.getElementById('settings-backdrop');
  if(el) el.classList.remove('open');
}
function isTopbarMenuOpen(){
  const el = document.getElementById('topbar-menu-backdrop');
  return !!(el && el.classList.contains('open'));
}
function closeTopbarMenu(){
  const el = document.getElementById('topbar-menu-backdrop');
  if(el) el.classList.remove('open');
}
const MODAL_CHECKS = [
  [()=> !!state.recipeEditName, ()=>{ state.recipeEditName = null; }],
  [()=> !!state.doneModalLeftoverPickerOpen, ()=>{ state.doneModalLeftoverPickerOpen = false; }],
  [()=> !!state.doneModalLeftoverCatPickerOpen, ()=>{ state.doneModalLeftoverCatPickerOpen = false; }],
  [()=> state.doneModalDay !== null, ()=>{ state.doneModalDay = null; state.doneModalQty = {}; state.doneQtyEditingKey = null; state.doneModalFinished = {}; state.doneModalLeftover = ''; state.doneModalLeftoverLuogo = 'frigo'; state.doneModalLeftoverCat = 'avanzi'; state.doneModalLeftoverChecked = false; state.doneModalLeftoverPickerOpen = false; state.doneModalLeftoverCatPickerOpen = false; }],
  [()=> !!state.mealOverflowOpen, ()=>{ state.mealOverflowOpen = null; }],
  [()=> state.genSettingsOpen !== null, ()=>{ state.genSettingsOpen = null; }],
  [()=> !!state.pantryGroupsModalOpen, ()=>{ state.pantryGroupsModalOpen = false; }],
  [()=> !!state.deptsModalOpen, ()=>{ state.deptsModalOpen = false; }],
  [()=> !!state.ingredientManagerOpen, ()=>{ state.ingredientManagerOpen = false; }],
  [()=> !!state.pantryLuogoPicker, ()=>{ state.pantryLuogoPicker = null; }],
  [()=> !!state.pantryEditKey, ()=>{ state.pantryEditKey = null; }],
  [()=> !!state.pantryAddModalOpen, ()=>{ state.pantryAddModalOpen = false; }],
  [()=> !!state.addIngModalOpen, ()=>{ state.addIngModalOpen = false; state.addIngDraft = null; }],
  [()=> !!state.newRecipeModalOpen, ()=>{ state.newRecipeModalOpen = false; }],
  [()=> !!state.filtersOpen, ()=>{ state.filtersOpen = false; }],
  [()=> !!state.swapOpenDay, ()=>{ state.swapOpenDay = null; }],
  [()=> !!state.linkPickerOpenDay, ()=>{ state.linkPickerOpenDay = null; }],
  [()=> !!state.avanzoDiPickerOpenDay, ()=>{ state.avanzoDiPickerOpenDay = null; }],
  [()=> !!state.contornoPickerOpenMeal, ()=>{ state.contornoPickerOpenMeal = null; }],
  [()=> !!state.expandedRecipe, ()=>{ state.expandedRecipe = null; }],
  [()=> !!state.expandedDay, ()=>{ state.expandedDay = null; }],
  [()=> isSettingsBackdropOpen(), ()=> closeSettingsBackdrop()],
  [()=> isTopbarMenuOpen(), ()=> closeTopbarMenu()],
  [()=> !hasSeenWhatsNew(), ()=>{ markWhatsNewSeen(); persist(); }],
];
function countOpenModals(){
  return MODAL_CHECKS.reduce((n, [isOpen])=> n + (isOpen() ? 1 : 0), 0);
}
// --- Accessibilità delle finestre -------------------------------------------
// Tutte le finestre (modali, schermate a tutto schermo, Impostazioni, menu
// della topbar) passano da qui dopo ogni apertura/chiusura, invece di toccare
// uno per uno i loro template: syncDialogs le marca come dialog (role,
// aria-modal, titolo), sposta il fuoco nella finestra appena aperta, rende
// inerte tutto ciò che sta sotto (lettori di schermo e Tab non ci arrivano),
// e alla chiusura riporta il fuoco sul bottone da cui era stata aperta.
// Esc chiude la finestra in cima, Tab gira solo al suo interno.
const DIALOG_LAYER_SELECTOR = '.filters-modal-backdrop, .meal-detail-screen, #settings-backdrop.open, #topbar-menu-backdrop.open';
const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
let dialogOpenerBeforeRender = null;
let dialogStack = []; // [{ sig, opener }] dal basso verso l'alto
let dialogIdSeq = 0;
// Identità stabile di un elemento tra un render e l'altro (il DOM viene
// ricreato): id oppure i suoi attributi data-*. null se non identificabile.
function describeElement(el){
  if(!el || el === document.body || !el.tagName) return null;
  const tag = el.tagName.toLowerCase();
  if(el.id) return tag + '#' + CSS.escape(el.id);
  const attrs = [...el.attributes].filter(a => a.name.startsWith('data-'));
  if(!attrs.length) return null;
  return tag + attrs.map(a => `[${a.name}="${CSS.escape(a.value)}"]`).join('');
}
function dialogOf(layer){
  return layer.querySelector('.filters-modal, .topbar-menu') || layer;
}
function openDialogLayers(){
  const layers = [...document.querySelectorAll(DIALOG_LAYER_SELECTOR)].filter(el => el.getClientRects().length);
  // In cima: z-index più alto, a parità l'ultimo nel documento.
  const z = el => parseInt(getComputedStyle(el).zIndex, 10) || 0;
  return layers.map((el, i) => ({ el, i, z: z(el) })).sort((a, b) => (a.z - b.z) || (a.i - b.i)).map(x => x.el);
}
function labelDialog(dialog){
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  if(!dialog.hasAttribute('tabindex')) dialog.setAttribute('tabindex', '-1');
  if(dialog.classList.contains('topbar-menu')){ dialog.setAttribute('aria-label', 'Menu'); return; }
  const title = dialog.querySelector('.filters-modal-header h3, .meal-detail-title, h3, h2');
  if(title){
    if(!title.id) title.id = 'dialog-title-' + (++dialogIdSeq);
    dialog.setAttribute('aria-labelledby', title.id);
  }
  dialog.querySelectorAll('button').forEach(b=>{
    if(!b.hasAttribute('aria-label') && b.textContent.trim() === '✕') b.setAttribute('aria-label', 'Chiudi');
  });
}
// Che finestra è (non il suo contenuto: il titolo può cambiare mentre resta
// aperta): classe e attributi data-* del contenitore e del suo bottone ✕.
function dialogSignature(layer){
  const names = el => el ? [...el.attributes].filter(a => a.name.startsWith('data-')).map(a => a.name).join(',') : '';
  const closeBtn = dialogOf(layer).querySelector('.filters-close-btn, .meal-detail-close, [aria-label="Chiudi"]');
  return (layer.id || layer.className) + '|' + names(layer) + '|' + names(closeBtn);
}
function setBackgroundInert(top){
  document.querySelectorAll('[data-dialog-inert]').forEach(el=>{ el.inert = false; el.removeAttribute('data-dialog-inert'); });
  if(!top) return;
  // Risalendo dalla finestra in cima fino a body, tutto ciò che le sta
  // accanto diventa inerte (tranne il toast "Annulla", che deve restare
  // toccabile anche a finestra aperta).
  for(let node = top; node && node !== document.body; node = node.parentElement){
    const parent = node.parentElement;
    if(!parent) break;
    [...parent.children].forEach(sib=>{
      if(sib === node || /^(SCRIPT|STYLE|LINK)$/.test(sib.tagName) || sib.classList.contains('undo-toast')) return;
      if(sib.contains(top)) return;
      sib.inert = true;
      sib.setAttribute('data-dialog-inert', '');
    });
  }
}
function focusIfPresent(selector){
  if(!selector) return false;
  const el = document.querySelector(selector);
  if(!el || !el.getClientRects().length) return false;
  el.focus({ preventScroll: true });
  return document.activeElement === el;
}
function syncDialogs(){
  const layers = openDialogLayers();
  layers.forEach(l => labelDialog(dialogOf(l)));
  const sigs = layers.map(dialogSignature);
  const opener = dialogOpenerBeforeRender || describeElement(document.activeElement);
  dialogOpenerBeforeRender = null;
  // Finestre chiuse (dall'alto): il fuoco torna a chi le aveva aperte.
  let restoreTo = null;
  while(dialogStack.length && !sigs.includes(dialogStack[dialogStack.length - 1].sig)){
    restoreTo = dialogStack.pop().opener;
  }
  dialogStack = dialogStack.filter(d => sigs.includes(d.sig));
  // Finestre nuove: si ricorda il bottone da cui sono state aperte.
  let opened = false;
  sigs.forEach(sig=>{
    if(!dialogStack.some(d => d.sig === sig)){ dialogStack.push({ sig, opener }); opened = true; }
  });
  const top = layers.length ? dialogOf(layers[layers.length - 1]) : null;
  setBackgroundInert(top);
  if(restoreTo && !opened){
    const back = document.querySelector(restoreTo);
    if(back && (!top || top.contains(back)) && focusIfPresent(restoreTo)) return;
  }
  // Fuoco sulla finestra stessa (non sul primo campo: su telefono aprirebbe
  // la tastiera), solo se non è già dentro (es. si sta scrivendo).
  if(top && !top.contains(document.activeElement)) top.focus({ preventScroll: true });
}
document.addEventListener('keydown', e=>{
  if(e.key === 'Escape'){
    for(const [isOpen, close] of MODAL_CHECKS){
      if(isOpen()){ e.preventDefault(); close(); render(); break; }
    }
    return;
  }
  if(e.key !== 'Tab') return;
  const layers = openDialogLayers();
  if(!layers.length) return;
  const dialog = dialogOf(layers[layers.length - 1]);
  const items = [...dialog.querySelectorAll(FOCUSABLE_SELECTOR)].filter(el => el.getClientRects().length);
  if(!items.length){ e.preventDefault(); dialog.focus(); return; }
  const first = items[0], last = items[items.length - 1];
  const inside = dialog.contains(document.activeElement);
  if(e.shiftKey && (!inside || document.activeElement === first || document.activeElement === dialog)){ e.preventDefault(); last.focus(); }
  else if(!e.shiftKey && (!inside || document.activeElement === last)){ e.preventDefault(); first.focus(); }
});

let modalHistoryDepth = 0;
let suppressPopstateNav = false;
function reconcileModalHistory(){
  syncDialogs();
  const openCount = countOpenModals();
  if(openCount > modalHistoryDepth){
    for(let i = modalHistoryDepth; i < openCount; i++) history.pushState({ cookpopModalDepth: i + 1 }, '');
    modalHistoryDepth = openCount;
  } else if(openCount < modalHistoryDepth){
    const delta = modalHistoryDepth - openCount;
    modalHistoryDepth = openCount;
    suppressPopstateNav = true;
    history.go(-delta);
  }
}
window.addEventListener('popstate', ()=>{
  if(suppressPopstateNav){ suppressPopstateNav = false; return; }
  // Se non avevamo entry nostre in cima, questo indietro riguarda solo la
  // normale cronologia delle tab (#menu/#spesa/...): niente da chiudere qui,
  // se ne occupa già il listener hashchange più sopra.
  if(modalHistoryDepth <= 0) return;
  for(const [isOpen, close] of MODAL_CHECKS){
    if(isOpen()){ close(); break; }
  }
  modalHistoryDepth = Math.max(0, modalHistoryDepth - 1);
  render();
});

// Toast "Annulla" generico e temporaneo (es. dopo lo scollegamento di un
// avanzo): mostra il messaggio, sparisce da solo dopo TOAST_MS, o subito se
// si tocca "Annulla" (che richiama undoFn). Non è legato a una tab
// specifica, quindi vive nel render() di livello pagina invece che dentro
// renderMenu()/renderSpesa()/ecc — funziona indipendentemente da dove ti
// trovi quando scatta.
const TOAST_MS = 5000;
let undoToastTimer = null;
function showUndoToast(message, undoFn){
  clearTimeout(undoToastTimer);
  state.undoToast = { message, undoFn };
  render();
  undoToastTimer = setTimeout(()=>{ state.undoToast = null; render(); }, TOAST_MS);
}
function renderUndoToast(){
  if(!state.undoToast) return '';
  return `
  <div class="undo-toast">
    <span class="undo-toast-message">${escapeHtml(state.undoToast.message)}</span>
    <button type="button" class="btn is-text undo-toast-btn" data-undo-toast>Annulla</button>
  </div>`;
}

function editIngRowHtml(ingrediente, qta){
  return `
    <div class="edit-ing-row">
      <input type="text" class="edit-ing-name" placeholder="Ingrediente" value="${escapeAttr(ingrediente||'')}">
      <input type="text" class="edit-ing-qta" placeholder="Quantità" value="${escapeAttr(qta||'')}">
      <button type="button" class="btn is-outline is-icon is-danger edit-row-remove" data-remove-row aria-label="Rimuovi riga">✕</button>
    </div>`;
}
function editStepRowHtml(text){
  return `
    <div class="edit-step-row">
      <textarea class="edit-step-text" rows="2" placeholder="Passaggio">${escapeHtml(text||'')}</textarea>
      <button type="button" class="btn is-outline is-icon is-danger edit-row-remove" data-remove-row aria-label="Rimuovi passaggio">✕</button>
    </div>`;
}

// Modale unica "Modifica ricetta", condivisa da Menù e Prep (stessa modale,
// stesso state.recipeEdits): qualsiasi modifica è quindi automaticamente
// visibile in entrambe le tab, non serve tenerle sincronizzate a mano.
function renderRecipeEditModal(){
  if(!state.recipeEditName) return '';
  const name = state.recipeEditName;
  const rec = getRecipeMeta(name);
  const det = getRecipeDetails(name);
  if(!rec) return '';
  const ingredienti = getIngredientsFor(name);
  const procedimento = (det && det.procedimento) || [];
  const stagioniSet = new Set(rec.stagioni || []);

  const ingRowsHtml = (ingredienti.length ? ingredienti : [{ingrediente:'',qta:''}])
    .map(it => editIngRowHtml(it.ingrediente, it.qta)).join('');

  const stepRowsHtml = (procedimento.length ? procedimento : [''])
    .map(s => editStepRowHtml(s)).join('');

  return `
    <div class="filters-modal-backdrop is-second" data-close-recipe-edit>
      <div class="filters-modal recipe-edit-modal" data-stop-close>
        <div class="filters-modal-header">
          <h3>Modifica ricetta</h3>
          <button class="btn is-icon filters-close-btn" data-close-recipe-edit>✕</button>
        </div>
        <p class="section-sub" style="margin-top:-8px;">${escapeHtml(name)}</p>
        <div class="filter-groups">
          <div class="filter-group">
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M128 20a108 108 0 1 0 108 108A108.12 108.12 0 0 0 128 20m0 192a84 84 0 1 1 84-84a84.09 84.09 0 0 1-84 84m68-84a12 12 0 0 1-12 12h-56a12 12 0 0 1-12-12V72a12 12 0 0 1 24 0v44h44a12 12 0 0 1 12 12"></path></svg> Tempo (etichetta mostrata)</div>
            <input type="text" id="edit-tempo" value="${escapeAttr(rec.tempo || '')}">
          </div>
          <div class="filter-group">
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M128 20a108 108 0 1 0 108 108A108.12 108.12 0 0 0 128 20m0 192a84 84 0 1 1 84-84a84.09 84.09 0 0 1-84 84m68-84a12 12 0 0 1-12 12h-56a12 12 0 0 1-12-12V72a12 12 0 0 1 24 0v44h44a12 12 0 0 1 12 12"></path></svg> Fascia di tempo (usata per filtrare in Prep)</div>
            <select id="edit-tempo-bucket">
              ${TEMPO_ORDER.map(t=>`<option value="${t}" ${rec.tempoBucket===t?'selected':''}>${escapeHtml(TEMPO_LABEL[t])}</option>`).join('')}
            </select>
          </div>
          <div class="filter-group">
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--bx" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M12 10h-2V3H8v7H6V3H4v8c0 1.654 1.346 3 3 3h1v7h2v-7h1c1.654 0 3-1.346 3-3V3h-2zm7-7h-1c-1.159 0-2 1.262-2 3v8h2v7h2V4a1 1 0 0 0-1-1"></path></svg> Porzioni</div>
            <input type="text" id="edit-porzioni" value="${escapeAttr((det && det.porzioni) || '')}">
          </div>
          <div class="filter-group">
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--bx" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M12 10h-2V3H8v7H6V3H4v8c0 1.654 1.346 3 3 3h1v7h2v-7h1c1.654 0 3-1.346 3-3V3h-2zm7-7h-1c-1.159 0-2 1.262-2 3v8h2v7h2V4a1 1 0 0 0-1-1"></path></svg> Categoria</div>
            <select id="edit-categoria">
              ${CAT_ORDER.map(c=>`<option value="${c}" ${rec.categoriaNew===c?'selected':''}>${catIcon(c)} ${escapeHtml(CAT_LABEL[c])}</option>`).join('')}
            </select>
          </div>
          <div class="filter-group">
            <div class="filter-group-label">🍽️ Tipologia (portata)</div>
            <select id="edit-tipologia">
              ${TIPO_ORDER.map(t=>`<option value="${t}" ${(rec.tipologia||'primo')===t?'selected':''}>${tipoIcon(t)} ${escapeHtml(TIPO_LABEL[t])}</option>`).join('')}
            </select>
          </div>
          <div class="filter-group">
            <div class="filter-group-label">🌾 Base di carboidrati</div>
            <select id="edit-base">
              ${BASE_ORDER.map(b=>`<option value="${b}" ${recipeBase(rec)===b?'selected':''}>${escapeHtml(BASE_LABEL[b])}</option>`).join('')}
            </select>
          </div>
          <div class="filter-group">
            <div class="filter-group-label">🥚 Fonte di proteine</div>
            <select id="edit-proteina">
              ${PROTEINA_ORDER.map(p=>`<option value="${p}" ${recipeProteina(rec)===p?'selected':''}>${escapeHtml(PROTEINA_LABEL[p])}</option>`).join('')}
            </select>
            <div class="section-sub">Servono al generatore per una settimana equilibrata.</div>
          </div>
          <div class="filter-group">
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ic" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5c0-2.64-2.05-4.78-4.65-4.96M19 18H6c-2.21 0-4-1.79-4-4s1.79-4 4-4h.71C7.37 7.69 9.48 6 12 6c3.04 0 5.5 2.46 5.5 5.5v.5H19c1.66 0 3 1.34 3 3s-1.34 3-3 3"></path></svg> Stagioni</div>
            <div class="chip-row" id="edit-stagioni">
              ${STAGIONE_ORDER.map(s=>`<button type="button" class="btn is-chip ${stagioniSet.has(s)?'active':''}" data-stagione-chip="${s}">${escapeHtml(STAGIONE_LABEL[s])}</button>`).join('')}
            </div>
          </div>
          <div class="filter-group">
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M227.65 149.14a12 12 0 0 1-8.79 14.51l-20.67 5.08l5.4 20.16a12 12 0 0 1-23.18 6.22l-7.29-27.2L140 148.78V187l20.48 20.48a12 12 0 0 1-17 17L128 209l-15.51 15.52a12 12 0 0 1-17-17L116 187v-38.22l-33.12 19.13l-7.29 27.2a12 12 0 0 1-23.18-6.22l5.4-20.16l-20.67-5.08a12 12 0 1 1 5.72-23.3l27.89 6.85L104 128l-33.25-19.2l-27.89 6.85A11.8 11.8 0 0 1 40 116a12 12 0 0 1-2.85-23.65l20.67-5.08l-5.4-20.16a12 12 0 0 1 23.18-6.22l7.29 27.2L116 107.21V69L95.52 48.48a12 12 0 0 1 17-17L128 47l15.51-15.52a12 12 0 1 1 17 17L140 69v38.24l33.12-19.12l7.29-27.2a12 12 0 0 1 23.18 6.22l-5.4 20.16l20.67 5.08A12 12 0 0 1 216 116a11.8 11.8 0 0 1-2.87-.35l-27.89-6.85L152 128l33.25 19.2l27.89-6.85a12 12 0 0 1 14.51 8.79"></path></svg> Freezer</div>
            <select id="edit-freezer-new">
              <option value="" ${(!rec.freezerNew || rec.freezerNew==='non-adatta')?'selected':''}>Non congelabile</option>
              ${FREEZER_ORDER.map(f=>`<option value="${f}" ${rec.freezerNew===f?'selected':''}>${escapeHtml(stripHtml(FREEZER_LABEL[f]))}</option>`).join('')}
            </select>
          </div>
          <div class="filter-group">
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--tabler" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="m13.62 8.382l1.966-1.967A2 2 0 1 1 19 5a2 2 0 1 1-1.413 3.414l-1.82 1.821m-9.863 8.361c2.733 2.734 5.9 4 7.07 2.829c1.172-1.172-.094-4.338-2.828-7.071c-2.733-2.734-5.9-4-7.07-2.829c-1.172 1.172.094 4.338 2.828 7.071M7.5 16l1 1"></path><path d="M12.975 21.425c3.905-3.906 4.855-9.288 2.121-12.021c-2.733-2.734-8.115-1.784-12.02 2.121"></path></g></svg> Avanzi</div>
            <select id="edit-avanzi-new">
              ${AVANZI_ORDER.map(a=>`<option value="${a}" ${rec.avanziNew===a?'selected':''}>${escapeHtml(AVANZI_LABEL[a])}</option>`).join('')}
            </select>
          </div>
          <div class="filter-group">
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M208 32h-24v-8a8 8 0 0 0-16 0v8H88v-8a8 8 0 0 0-16 0v8H48a16 16 0 0 0-16 16v160a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16M72 48v8a8 8 0 0 0 16 0v-8h80v8a8 8 0 0 0 16 0v-8h24v32H48V48Zm136 160H48V96h160zm-96-88v64a8 8 0 0 1-16 0v-51.06l-4.42 2.22a8 8 0 0 1-7.16-14.32l16-8A8 8 0 0 1 112 120m59.16 30.45L152 176h16a8 8 0 0 1 0 16h-32a8 8 0 0 1-6.4-12.8l28.78-38.37a8 8 0 1 0-13.31-8.83a8 8 0 1 1-13.85-8A24 24 0 0 1 176 136a23.76 23.76 0 0 1-4.84 14.45"></path></svg> Pianificazione</div>
            <select id="edit-pianificazione">
              ${PIAN_ORDER.map(p=>`<option value="${p}" ${rec.pianificazione===p?'selected':''}>${escapeHtml(PIAN_LABEL[p])}</option>`).join('')}
            </select>
          </div>
          <div class="filter-group">
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--tabler" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M4 19a2 2 0 1 0 4 0a2 2 0 1 0-4 0m11 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0"></path><path d="M17 17H6V3H4"></path><path d="m6 5l14 1l-1 7H6"></path></g></svg> Ingredienti</div>
            <div id="edit-ing-list">${ingRowsHtml}</div>
            <button type="button" class="btn is-chip" id="edit-add-ing-row">+ aggiungi ingrediente</button>
          </div>
          <div class="filter-group">
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--tabler" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3c1.918 0 3.52 1.35 3.91 3.151A4 4 0 0 1 18 13.874V21H6v-7.126a4 4 0 1 1 2.092-7.723A4 4 0 0 1 12 3M6.161 17.009L18 17"></path></svg> Procedimento</div>
            <div id="edit-step-list">${stepRowsHtml}</div>
            <button type="button" class="btn is-chip" id="edit-add-step-row">+ aggiungi passaggio</button>
          </div>
          <div class="filter-group">
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M88 96a8 8 0 0 1 8-8h64a8 8 0 0 1 0 16H96a8 8 0 0 1-8-8m8 40h64a8 8 0 0 0 0-16H96a8 8 0 0 0 0 16m32 16H96a8 8 0 0 0 0 16h32a8 8 0 0 0 0-16m96-104v108.69a15.86 15.86 0 0 1-4.69 11.31L168 219.31a15.86 15.86 0 0 1-11.31 4.69H48a16 16 0 0 1-16-16V48a16 16 0 0 1 16-16h160a16 16 0 0 1 16 16M48 208h104v-48a8 8 0 0 1 8-8h48V48H48Zm120-40v28.7l28.69-28.7Z"></path></svg> Da ricordare</div>
            <input type="text" id="edit-ricordare" value="${escapeAttr((det && det.ricordare) || '')}">
          </div>
          <div class="filter-group">
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--tabler" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="m13.62 8.382l1.966-1.967A2 2 0 1 1 19 5a2 2 0 1 1-1.413 3.414l-1.82 1.821m-9.863 8.361c2.733 2.734 5.9 4 7.07 2.829c1.172-1.172-.094-4.338-2.828-7.071c-2.733-2.734-5.9-4-7.07-2.829c-1.172 1.172.094 4.338 2.828 7.071M7.5 16l1 1"></path><path d="M12.975 21.425c3.905-3.906 4.855-9.288 2.121-12.021c-2.733-2.734-8.115-1.784-12.02 2.121"></path></g></svg> Nota avanzi</div>
            <input type="text" id="edit-avanzi-note" value="${escapeAttr((det && det.avanzi) || '')}">
          </div>
          <div class="filter-group">
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M227.65 149.14a12 12 0 0 1-8.79 14.51l-20.67 5.08l5.4 20.16a12 12 0 0 1-23.18 6.22l-7.29-27.2L140 148.78V187l20.48 20.48a12 12 0 0 1-17 17L128 209l-15.51 15.52a12 12 0 0 1-17-17L116 187v-38.22l-33.12 19.13l-7.29 27.2a12 12 0 0 1-23.18-6.22l5.4-20.16l-20.67-5.08a12 12 0 1 1 5.72-23.3l27.89 6.85L104 128l-33.25-19.2l-27.89 6.85A11.8 11.8 0 0 1 40 116a12 12 0 0 1-2.85-23.65l20.67-5.08l-5.4-20.16a12 12 0 0 1 23.18-6.22l7.29 27.2L116 107.21V69L95.52 48.48a12 12 0 0 1 17-17L128 47l15.51-15.52a12 12 0 1 1 17 17L140 69v38.24l33.12-19.12l7.29-27.2a12 12 0 0 1 23.18 6.22l-5.4 20.16l20.67 5.08A12 12 0 0 1 216 116a11.8 11.8 0 0 1-2.87-.35l-27.89-6.85L152 128l33.25 19.2l27.89-6.85a12 12 0 0 1 14.51 8.79"></path></svg> Nota freezer</div>
            <input type="text" id="edit-freezer-note" value="${escapeAttr((det && det.freezer) || '')}">
          </div>
          <div class="filter-group">
            <div class="filter-group-label">🔗 Link fonte</div>
            <input type="text" id="edit-link" value="${escapeAttr((det && det.link) || '')}">
          </div>
        </div>
        <div class="filters-modal-footer">
          <button class="btn is-ghost is-danger reset-btn" id="edit-recipe-delete" data-delete-recipe="${escapeAttr(name)}">Elimina</button>
          <button class="btn is-ghost reset-btn" data-close-recipe-edit>Annulla</button>
          <button class="btn is-solid mini-add-btn" id="edit-recipe-save" data-save-recipe-edit="${escapeAttr(name)}">Salva</button>
        </div>
      </div>
    </div>`;
}

// Un giorno di una qualunque settimana (weekIdx 0 = corrente, >=1 = extra).
// dayKey identifica il giorno in modo univoco tra tutte le settimane mostrate
// insieme, usato per lo state ephemeral (espanso, swap aperto, modale fatta...).
// Un pasto (pranzo o cena) di un giorno di una qualunque settimana (weekIdx 0
// = corrente, >=1 = extra). mk (mealKey) identifica il pasto in modo univoco
// tra tutte le settimane/giorni/pasti mostrati insieme, usato per lo state
// ephemeral (espanso, swap aperto, modale fatta, chi cucina...). d/dateLabel/
// isToday sono già calcolati una volta sola dal giorno (renderDayCard) e
// passati qui, uguali per pranzo e cena dello stesso giorno.
function renderMealBlock(weekIdx, i, meal, pos, weekDates, isPastCard, d, dateLabel, isToday){
  const mk = mealKey(weekIdx, i, meal);
  const linkSource = linkedSourceMealKey(weekIdx, i, meal);
  const sourceGiorno = linkSource ? DATA.week1[parseMealKey(linkSource).i].giorno : '';
  const mealData = effectiveMeal(weekIdx, i, meal);
  const name = mealData.principale || '';
  const contorni = mealData.contorni || [];
  const override = readMealSlot(weekOverridesRef(weekIdx), i, meal);
  const hasOverride = !!(override && override.principale);
  const baseline = readMealSlot(weekBaselineRef(weekIdx), i, meal);
  const isChanged = !!linkSource || weekIdx !== 0 || hasOverride || !!(baseline && baseline.principale);
  const rec = name ? effectiveRecipeMeta(weekIdx, i, meal) : null; // dati di catalogo, se disponibili
  const currentCat = name ? effectiveCategoria(weekIdx, i, meal) : '';

  // "+ ricetta" non ha senso finché il pasto non ha almeno un principale:
  // sparisce insieme al resto (chi cucina, riga bottoni) quando è vuoto —
  // vedi anche il bottone dedicato "Scegli una ricetta" al posto del titolo.
  // Il pannello di ricerca ("+ ricetta" come "Cambia"/"È avanzata"/"È avanzo
  // di") non è più qui: è a tutto schermo, vedi render*Screen() più sotto,
  // invocate una sola volta da renderMenu() in base agli stessi state flag.
  const contorniHtml = name ? `
    <div class="contorni-row">
      ${contorni.map(c=>`<button type="button" class="status-badge" data-contorno-remove="${mk}" data-contorno-name="${escapeAttr(c)}">${escapeHtml(c)} <span class="status-badge-reset">✕</span></button>`).join('')}
      <button type="button" class="btn is-chip is-dashed" data-open-contorno-picker="${mk}">+ ricetta</button>
    </div>` : '';

  const isDone = !!(weekMealsDoneRef(weekIdx)[i] && weekMealsDoneRef(weekIdx)[i][meal]);
  // Un pasto bloccato non viene toccato da "Rigenera settimana" (vedi
  // generateWeek). Solo sui pasti normali: un pranzo-avanzo segue sempre il
  // principale del collegamento, bloccarlo non avrebbe un effetto chiaro.
  const isLocked = !!state.mealLocked[mk];
  let swapControls;
  if(linkSource){
    swapControls = `
    <div class="section-footer">
      <div class="section-footer-row">
        ${state.linkNoteEditingKey === mk
          ? `<input type="text" class="avanzo-note-input" placeholder="Variante (facoltativa, es. fatta a frittata)" value="${escapeAttr(state.dayLinkNotes[mk] || '')}" data-link-note="${mk}">`
          : `<span class="avanzo-note-text" data-link-note-show="${mk}">${state.dayLinkNotes[mk] ? escapeHtml(state.dayLinkNotes[mk]) : 'Nessuna variante'}</span>
             <button type="button" class="btn is-icon" data-link-note-show="${mk}" aria-label="Modifica variante"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="m230.14 70.54l-44.68-44.69a20 20 0 0 0-28.29 0L33.86 149.17A19.85 19.85 0 0 0 28 163.31V208a20 20 0 0 0 20 20h44.69a19.86 19.86 0 0 0 14.14-5.86L230.14 98.82a20 20 0 0 0 0-28.28M91 204H52v-39l84-84l39 39Zm101-101l-39-39l18.34-18.34l39 39Z"></path></svg></button>`}
      </div>
      <div class="section-footer-row">
      <button class="btn is-chip is-eat ${isDone ? 'active' : ''}" data-toggle-done="${mk}">${isDone ? '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--fe" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="m6 10l-2 2l6 6L20 8l-2-2l-8 8z"></path></svg> Mangiata' : '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--bx" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M12 10h-2V3H8v7H6V3H4v8c0 1.654 1.346 3 3 3h1v7h2v-7h1c1.654 0 3-1.346 3-3V3h-2zm7-7h-1c-1.159 0-2 1.262-2 3v8h2v7h2V4a1 1 0 0 0-1-1"></path></svg> Da mangiare'}</button>
      </div>
    </div>`;
  } else {
    // Senza principale non c'è niente da segnare cucinato/cambiare/collegare:
    // la riga bottoni sparisce del tutto (vedi anche il bottone dedicato
    // "Scegli una ricetta" al posto del titolo). Il pannello di ricerca resta
    // però visibile quando aperto — è "Scegli una ricetta" stesso ad aprirlo
    // (data-open-swap), quindi deve poter comparire anche a pasto vuoto.
    const footerButtons = name ? `
    <div class="section-footer">
      <div class="section-footer-row">
        <button class="btn is-chip is-eat ${isDone ? 'active' : ''}" data-toggle-done="${mk}">${isDone ? '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--fe" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="m6 10l-2 2l6 6L20 8l-2-2l-8 8z"></path></svg> Cucinata' : '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--bx" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M12 10h-2V3H8v7H6V3H4v8c0 1.654 1.346 3 3 3h1v7h2v-7h1c1.654 0 3-1.346 3-3V3h-2zm7-7h-1c-1.159 0-2 1.262-2 3v8h2v7h2V4a1 1 0 0 0-1-1"></path></svg> Da cucinare'}</button>
        <button class="btn is-chip is-dashed" data-open-swap="${mk}"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M228 48v48a12 12 0 0 1-12 12h-48a12 12 0 0 1 0-24h19l-7.8-7.8a75.55 75.55 0 0 0-53.32-22.26h-.43a75.5 75.5 0 0 0-53.06 21.63a12 12 0 1 1-16.78-17.16a99.38 99.38 0 0 1 69.87-28.47h.52a99.42 99.42 0 0 1 70.2 29.29L204 67V48a12 12 0 0 1 24 0m-44.39 132.43a75.5 75.5 0 0 1-53.09 21.63h-.43a75.55 75.55 0 0 1-53.32-22.26L69 172h19a12 12 0 0 0 0-24H40a12 12 0 0 0-12 12v48a12 12 0 0 0 24 0v-19l7.8 7.8a99.42 99.42 0 0 0 70.2 29.26h.56a99.38 99.38 0 0 0 69.87-28.47a12 12 0 0 0-16.78-17.16Z"></path></svg> Cambia</button>
        <button type="button" class="btn is-icon meal-overflow-btn" data-open-meal-overflow="${mk}" aria-label="Altre azioni">⋯</button>
        </div>
    </div>` : '';
    // Le azioni rare (È avanzo di, Torna all'originale, Segna come avanzata,
    // Blocca) vivono nel foglio "⋯" invece che come bottoni sempre visibili
    // in riga: stesso stato/handler di sempre (data-open-link-picker ecc. già
    // agganciati altrove), qui li chiudo esplicitamente dopo l'azione perché
    // il foglio ha il suo stopPropagation come gli altri modali (vedi
    // data-stop-close) e non si chiuderebbe da solo col bubbling.
    let overflowModalHtml = '';
    if(name && state.mealOverflowOpen === mk){
      // Nome a cui torna davvero "Torna alla ricetta originale": la baseline
      // (proposta del generatore), o — solo cena, settimana 0 — il piatto
      // del foglio originale se non c'è mai stata una baseline generata.
      const originalName = (baseline && baseline.principale) || (weekIdx === 0 && meal === 'cena' && !state.week0Start ? DATA.week1[i].cena : '') || '';
      const overflowItems = [
        { label:'È avanzo di…', note:'Collega questo pasto a una cena passata: gli ingredienti non tornano in spesa.', attr:`data-open-avanzodi-picker="${mk}"` },
        hasOverride ? { label: originalName ? `Torna a «${originalName}»` : 'Torna alla ricetta originale', note:'Rimette la proposta di partenza del generatore.', attr:`data-reset-swap="${mk}"` } : null,
        { label:'Segna come avanzata', note:'Scegli quale pasto futuro mangerà quello che resta.', attr:`data-open-link-picker="${mk}"` },
        { label: isLocked ? 'Sblocca il pasto' : 'Blocca il pasto', note: isLocked ? 'Torna a essere toccato dalla rigenerazione della settimana.' : 'La rigenerazione della settimana non lo tocca più.', attr:`data-toggle-lock="${mk}"` },
        { label:'Svuota il pasto', note:'Torna "nessuna ricetta scelta". Toglie gli ingredienti dalla lista della spesa.', attr:`data-clear-meal="${mk}"`, danger: true }
      ].filter(Boolean);
      overflowModalHtml = `
      <div class="filters-modal-backdrop" data-close-meal-overflow>
        <div class="filters-modal" data-stop-close>
          <div class="filters-modal-header">
            <h3>${escapeHtml(name)}</h3>
            <button class="btn is-icon filters-close-btn" data-close-meal-overflow>✕</button>
          </div>
          <div class="overflow-actions">
            ${overflowItems.map(it=>`<button type="button" class="overflow-action${it.danger ? ' overflow-action-danger' : ''}" ${it.attr}><span class="overflow-action-label">${escapeHtml(it.label)}</span><span class="overflow-action-note">${escapeHtml(it.note)}</span></button>`).join('')}
          </div>
        </div>
      </div>`;
    }
    swapControls = `${footerButtons}
    ${overflowModalHtml}`;
  }

  // tempo: se cambiato (a mano o generato) e in catalogo, usa il tempo della
  // nuova ricetta; altrimenti quello originale del foglio (solo cena, unica
  // con un foglio originale alle spalle — vedi effectiveMeal). Niente da
  // mostrare se il pasto è vuoto: altrimenti una cena senza principale (es.
  // appena svuotata) restava con il tempo del foglio originale scritto lì
  // ("Variabile" o un numero di minuti), come se qualcosa fosse ancora
  // pianificato.
  const timeDisplay = !name ? '' : (isChanged && rec) ? rec.tempo : (meal === 'cena' ? d.tempo : '');

  // note: se cambiato, ricostruite dalla ricetta scelta; altrimenti quelle
  // originali del foglio (solo cena, settimana corrente — per il pranzo
  // isChanged è sempre vero quando c'è un nome, vedi effectiveMeal).
  let metaLines = [];
  if(isChanged){
    if(rec){
      if(rec.prep && rec.prep !== 'No') metaLines.push(`<b>Preparazione anticipata:</b> ${escapeHtml(rec.prep)}`);
      if(rec.freezer === 'Sì') metaLines.push(`<b>Nota:</b> congela bene — valuta doppia dose per il freezer`);
    } else if(name) {
      metaLines.push(`<b>Nota:</b> ricetta non presente nel catalogo, dettagli non disponibili`);
    }
  } else {
    if(d.ricordare && d.ricordare !== 'Niente') metaLines.push(`<b>Da ricordare:</b> ${escapeHtml(d.ricordare)}`);
    if(d.nota) metaLines.push(`<b>Nota:</b> ${escapeHtml(d.nota)}`);
  }

  // auto reminder: se domani è Legumi, avvisa stasera di mettere in ammollo
  // (solo sul blocco cena: è la cena di oggi il momento buono per l'ammollo
  // in vista della cena di domani — il "domani" segue l'ordine di
  // visualizzazione, non l'indice originale, dato che la settimana parte dal
  // sabato; non attraversa il confine tra una settimana e la successiva)
  let soakChip = '';
  if(meal === 'cena' && pos < WEEK_DISPLAY_ORDER.length - 1){
    const nextCat = effectiveCategoria(weekIdx, WEEK_DISPLAY_ORDER[pos+1], 'cena');
    if(nextCat === 'legumi'){
      soakChip = `<div class="soak-chip">💧 Domani legumi — valuta l'ammollo stasera</div>`;
    }
  }

  // Badge di stato accanto al tempo. "Cucinato" non è più un badge
  // chiudibile: si dice una volta sola nel titolo barrato (vedi .done .day-menu
  // in CSS) più questa etichettina di conferma — l'annullo sta nel bottone
  // "Cucinata"/"Da cucinare" della riga sotto, non si ripete qui. Lo stesso
  // vale per "Cambiato": l'annullo ("Torna alla ricetta originale") si è
  // spostato nel foglio "⋯". "Avanzo di GG" resta badge-con-✕ (scollega),
  // e "Bloccato" è sola lettura (l'annullo sta nel lucchetto/nel foglio "⋯").
  const doneTag = isDone ? `<span class="done-tag">✓ Cucinat${meal==='cena'?'a':'o'}</span>` : '';
  const statusBadges = `
    ${linkSource ? `<button type="button" class="status-badge status-avanzo" data-unlink-day="${mk}">Avanzo di ${escapeHtml(sourceGiorno)} <span class="status-badge-reset">✕</span></button>` : ''}
    ${isLocked ? `<span class="status-badge status-locked">Bloccat${meal==='cena'?'a':'o'}</span>` : ''}
  `;

  const cook = state.cooks[mk];
  const isOpen = state.expandedDay === mk;
  // Un'unica fonte per "chi cucina": iniziale sola a blocco chiuso, nome per
  // esteso a blocco aperto.
  const cookLabel = cook ? (isOpen ? 'Cucina ' + COOK_LABEL[cook] : COOK_LABEL[cook][0]) : '?';
  const cookPill = `<button type="button" class="cook-pill${cook ? ' cook-'+cook : ' cook-empty'}" data-toggle-cook="${mk}" aria-label="Chi cucina: tocca per cambiare">${escapeHtml(cookLabel)}</button>`;

  const mealBlockHtml = `
  <div class="meal-block${isDone ? ' done' : ''}${isOpen ? ' open' : ''}" data-week-idx="${weekIdx}" data-day-index="${i}" data-meal="${meal}">
    <div class="day-meal">
      <div class="meal-block-label">${escapeHtml(MEAL_LABEL[meal])}</div>
      ${name ? cookPill : ''}
      <div class="day-row-side display-none">
        ${currentCat ? `<span class="cat-icon" title="${escapeAttr(CAT_LABEL[currentCat])}">${catIcon(currentCat)}</span>` : ''}
      </div>
    </div>
    ${name ? `
    <div class="day-menu-row">
      <span class="day-menu" data-toggle-day="${mk}">${escapeHtml(name)}</span>
    </div>` : `
    <button type="button" class="day-menu-row day-menu-empty" data-open-swap="${mk}">+</button>`}
    ${contorniHtml}
    <div class="recipe-info">
      <span class="day-time">${escapeHtml(timeDisplay)}</span>
      ${doneTag}
      ${statusBadges}
    </div>
    ${swapControls}
  </div>`;
  // Swipe da sinistra a destra sulla card per svuotare il pasto (come una
  // lista con "scorri per eliminare"): il cestino sta fermo sotto, la card
  // scorre sopra e lo rivela — vedi il gestore del gesto in attachHandlers.
  // Solo quando c'è un principale: un pasto vuoto non ha nulla da svuotare.
  if(!name) return mealBlockHtml;
  return `
  <div class="meal-block-swipe-wrap">
    <button type="button" class="meal-block-trash" data-clear-meal="${mk}" aria-label="Svuota il pasto"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 256 256"><path fill="currentColor" d="M216 48h-40v-8a24 24 0 0 0-24-24h-48a24 24 0 0 0-24 24v8H40a8 8 0 0 0 0 16h8v144a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V64h8a8 8 0 0 0 0-16M96 40a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8v8H96Zm96 168H64V64h128Zm-80-104v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0m48 0v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0"></path></svg></button>
    ${mealBlockHtml}
  </div>`;
}

// Schermata a tutto schermo col dettaglio di un pasto (tag, porzioni,
// ingredienti, procedimento, note, modifica) — sostituisce il vecchio
// accordion inline nella card (vedi state.expandedDay). Calcolata una sola
// volta da renderMenu(), non per ogni blocco pasto: ricalcola in proprio i
// dati che in renderMealBlock erano variabili locali condivise, perché qui
// vive fuori da quella funzione.
function renderMealDetailScreen(weekIdx, i, meal){
  const mk = mealKey(weekIdx, i, meal);
  const d = DATA.week1[i];
  // i arriva da parseMealKey come stringa (key.split('_')): WEEK_DISPLAY_ORDER
  // contiene numeri, .indexOf con una stringa non troverebbe mai nulla
  // (nessuna coercizione con ===) e farebbe fallire tutto il render.
  const pos = WEEK_DISPLAY_ORDER.indexOf(parseInt(i, 10));
  const dateLabel = formatShortDate(weekDatesFor(weekIdx)[pos]);
  const mealData = effectiveMeal(weekIdx, i, meal);
  const name = mealData.principale || '';
  const contorni = mealData.contorni || [];
  const rec = name ? effectiveRecipeMeta(weekIdx, i, meal) : null;
  const linkSource = linkedSourceMealKey(weekIdx, i, meal);
  const override = readMealSlot(weekOverridesRef(weekIdx), i, meal);
  const hasOverride = !!(override && override.principale);
  const baseline = readMealSlot(weekBaselineRef(weekIdx), i, meal);
  const isChanged = !!linkSource || weekIdx !== 0 || hasOverride || !!(baseline && baseline.principale);

  let metaLines = [];
  if(isChanged){
    if(rec){
      if(rec.prep && rec.prep !== 'No') metaLines.push(`<b>Preparazione anticipata:</b> ${escapeHtml(rec.prep)}`);
      if(rec.freezer === 'Sì') metaLines.push(`<b>Nota:</b> congela bene — valuta doppia dose per il freezer`);
    } else if(name) {
      metaLines.push(`<b>Nota:</b> ricetta non presente nel catalogo, dettagli non disponibili`);
    }
  } else {
    if(d.ricordare && d.ricordare !== 'Niente') metaLines.push(`<b>Da ricordare:</b> ${escapeHtml(d.ricordare)}`);
    if(d.nota) metaLines.push(`<b>Nota:</b> ${escapeHtml(d.nota)}`);
  }

  let soakChip = '';
  if(meal === 'cena' && pos < WEEK_DISPLAY_ORDER.length - 1){
    const nextCat = effectiveCategoria(weekIdx, WEEK_DISPLAY_ORDER[pos+1], 'cena');
    if(nextCat === 'legumi'){
      soakChip = `<div class="soak-chip">💧 Domani legumi — valuta l'ammollo stasera</div>`;
    }
  }

  const det = name ? getRecipeDetails(name) : null;
  // Porzioni scelte per questo pasto (default: 2, o quelle base della
  // ricetta se non impostate — vedi generateWeek per il default 2/3),
  // usate per scalare le quantità mostrate qui e — se non già spuntate — in Spesa.
  const basePortions = det ? parsePortionsBase(det.porzioni) : null;
  const currentPortions = basePortions ? (state.dayPortions[mk] || basePortions) : null;
  const portionsRatio = basePortions ? currentPortions / basePortions : 1;
  const ing = name ? getIngredientsFor(name) : [];
  const ingHtml = renderIngredientsSection(ing, portionsRatio, { weekIdx, i, meal, role: 'p' });
  // Ogni contorno ha il proprio dettaglio completo (tag/ingredienti/
  // procedimento/note), scalato sulle stesse porzioni-obiettivo del pasto
  // ma rispetto alle porzioni BASE di quella ricetta (può differire da
  // quella del principale) — non più solo mescolato nella lista sopra.
  const contorniDetailHtml = contorni.map((c,ci)=>{
    const cDet = getRecipeDetails(c);
    const cBase = cDet ? parsePortionsBase(cDet.porzioni) : null;
    const cRatio = (cBase && currentPortions) ? currentPortions / cBase : 1;
    return renderContornoDetailBox(c, cRatio, { weekIdx, i, meal, role: `c${ci}` });
  }).join('');
  const portionsControl = basePortions ? `
    <div class="portions-row">
      <span class="portions-label">Porzioni</span>
      <span class="qty-stepper">
        <button type="button" class="qty-btn" data-portions-dec="${mk}" aria-label="Diminuisci porzioni">−</button>
        <span class="qty-num">${currentPortions}</span>
        <button type="button" class="qty-btn" data-portions-inc="${mk}" aria-label="Aumenta porzioni">+</button>
      </span>
    </div>` : '';
  const tagsHtml = rec ? `
    <div class="detail-tags">
      <span class="tag">${catIcon(rec.categoriaNew)} ${escapeHtml(CAT_LABEL[rec.categoriaNew])}</span>
      <span class="tag tempo">${det ? '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M128 20a108 108 0 1 0 108 108A108.12 108.12 0 0 0 128 20m0 192a84 84 0 1 1 84-84a84.09 84.09 0 0 1-84 84m68-84a12 12 0 0 1-12 12h-56a12 12 0 0 1-12-12V72a12 12 0 0 1 24 0v44h44a12 12 0 0 1 12 12"></path></svg> ' + escapeHtml(det.tempo) : escapeHtml(TEMPO_LABEL[rec.tempoBucket])}</span>
      ${(det && !basePortions) ? `<span class="tag">${escapeHtml(det.porzioni)}</span>` : ''}
      <span class="tag season">${rec.stagioni.map(s=>escapeHtml(STAGIONE_LABEL[s])).join(', ')}</span>
      ${(rec.freezerNew && rec.freezerNew !== 'non-adatta') ? `<span class="tag freezer">${FREEZER_LABEL[rec.freezerNew]}</span>` : ''}
      <span class="tag"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--tabler" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="m13.62 8.382l1.966-1.967A2 2 0 1 1 19 5a2 2 0 1 1-1.413 3.414l-1.82 1.821m-9.863 8.361c2.733 2.734 5.9 4 7.07 2.829c1.172-1.172-.094-4.338-2.828-7.071c-2.733-2.734-5.9-4-7.07-2.829c-1.172 1.172.094 4.338 2.828 7.071M7.5 16l1 1"></path><path d="M12.975 21.425c3.905-3.906 4.855-9.288 2.121-12.021c-2.733-2.734-8.115-1.784-12.02 2.121"></path></g></svg> ${escapeHtml(AVANZI_LABEL[rec.avanziNew])}</span>
      ${rec.pianificazione!=='nessuna' ? `<span class="tag"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M208 32h-24v-8a8 8 0 0 0-16 0v8H88v-8a8 8 0 0 0-16 0v8H48a16 16 0 0 0-16 16v160a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16M72 48v8a8 8 0 0 0 16 0v-8h80v8a8 8 0 0 0 16 0v-8h24v32H48V48Zm136 160H48V96h160zm-96-88v64a8 8 0 0 1-16 0v-51.06l-4.42 2.22a8 8 0 0 1-7.16-14.32l16-8A8 8 0 0 1 112 120m59.16 30.45L152 176h16a8 8 0 0 1 0 16h-32a8 8 0 0 1-6.4-12.8l28.78-38.37a8 8 0 1 0-13.31-8.83a8 8 0 1 1-13.85-8A24 24 0 0 1 176 136a23.76 23.76 0 0 1-4.84 14.45"></path></svg> ${escapeHtml(PIAN_LABEL[rec.pianificazione])}</span>` : ''}
    </div>` : `<div class="ing-empty">${name ? 'Ricetta non presente nel catalogo — solo ingredienti disponibili qui.' : 'Nessuna ricetta scelta per questo pasto.'}</div>`;
  const stepsHtml = det && det.procedimento && det.procedimento.length
    ? `<div class="detail-section"><div class="detail-section-title"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--tabler" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3c1.918 0 3.52 1.35 3.91 3.151A4 4 0 0 1 18 13.874V21H6v-7.126a4 4 0 1 1 2.092-7.723A4 4 0 0 1 12 3M6.161 17.009L18 17"></path></svg> Procedimento</div><ol class="steps-list">${det.procedimento.map(s=>`<li>${escapeHtml(s)}</li>`).join('')}</ol></div>`
    : '';
  const noteExtra = det ? [
      det.ricordare ? `<b>Da ricordare:</b> ${escapeHtml(det.ricordare)}` : '',
      det.avanzi ? `<b>Avanzi:</b> ${escapeHtml(det.avanzi)}` : '',
      det.freezer ? `<b>Freezer:</b> ${escapeHtml(det.freezer)}` : ''
    ].filter(Boolean).map(l=>`<div class="detail-extra-note">${l}</div>`).join('') : '';
  const noteBox = noteExtra ? `<div class="detail-section note-box"><div class="detail-section-title"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M88 96a8 8 0 0 1 8-8h64a8 8 0 0 1 0 16H96a8 8 0 0 1-8-8m8 40h64a8 8 0 0 0 0-16H96a8 8 0 0 0 0 16m32 16H96a8 8 0 0 0 0 16h32a8 8 0 0 0 0-16m96-104v108.69a15.86 15.86 0 0 1-4.69 11.31L168 219.31a15.86 15.86 0 0 1-11.31 4.69H48a16 16 0 0 1-16-16V48a16 16 0 0 1 16-16h160a16 16 0 0 1 16 16M48 208h104v-48a8 8 0 0 1 8-8h48V48H48Zm120-40v28.7l28.69-28.7Z"></path></svg> Note</div>${noteExtra}</div>` : '';
  const linkHtml = sourceLinkHtml(det);
  const addFormHtml = (name && !det) ? `
    <div class="add-ing-form">
      <input type="text" placeholder="Ingrediente" data-ning="${mk}">
      <input type="text" placeholder="Quantità" data-nqta="${mk}">
      <button class="btn is-solid" data-add-ing="${mk}">+ aggiungi ingrediente</button>
    </div>` : '';
  const editRecipeBtn = rec ? `<button class="btn is-chip" data-open-recipe-edit="${escapeAttr(name)}"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="m230.14 70.54l-44.68-44.69a20 20 0 0 0-28.29 0L33.86 149.17A19.85 19.85 0 0 0 28 163.31V208a20 20 0 0 0 20 20h44.69a19.86 19.86 0 0 0 14.14-5.86L230.14 98.82a20 20 0 0 0 0-28.28M91 204H52v-39l84-84l39 39Zm101-101l-39-39l18.34-18.34l39 39Z"></path></svg> Modifica ricetta</button>` : '';
  const sourceEditBox = (linkHtml || editRecipeBtn) ? `<div class="button-wrapper">${editRecipeBtn}${linkHtml}</div>` : '';
  const dayMetaHtml = metaLines.length ? `<div class="day-meta">${metaLines.map(l=>`<div>${l}</div>`).join('')}</div>` : '';

  return `
  <div class="meal-detail-screen">
  <div class="filters-modal">
    <div class="meal-detail-header">
      <div class="meal-detail-header-text">
        <div class="meal-detail-kicker">${escapeHtml(MEAL_LABEL[meal])} · ${escapeHtml(d.giorno)} ${escapeHtml(dateLabel)}</div>
        <div class="meal-detail-title">${escapeHtml(name) || 'Nessuna ricetta scelta'}</div>
      </div>
      <button type="button" class="btn is-icon meal-detail-close" data-close-meal-detail aria-label="Chiudi">✕</button>
    </div>
    <div class="meal-detail-body">
      <div class="detail-box">
        ${tagsHtml}
        ${dayMetaHtml}
        ${soakChip}
        ${portionsControl}
        ${ingHtml}
        ${stepsHtml}
        ${noteBox}
        ${addFormHtml}
        ${sourceEditBox}
      </div>
      ${contorniDetailHtml}
    </div>
     </div>
  </div>`;
}

// Le 4 schermate di scelta ricetta ("Cambia", "È avanzata", "È avanzo di",
// "+ ricetta" per i contorni) — come renderMealDetailScreen, a tutto
// schermo invece che pannelli inline nella card, invocate una sola volta da
// renderMenu() in base agli stessi state flag di sempre (stato/handler
// invariati: solo dove il markup finisce nella pagina è cambiato).
function renderSwapScreen(weekIdx, i, meal){
  const mk = mealKey(weekIdx, i, meal);
  const d = DATA.week1[i];
  const dateLabel = formatShortDate(weekDatesFor(weekIdx)[WEEK_DISPLAY_ORDER.indexOf(parseInt(i,10))]);
  const currentName = effectiveRecipeName(weekIdx, i, meal);
  const currentCat = currentName ? effectiveCategoria(weekIdx, i, meal) : '';
  const contorni = effectiveMeal(weekIdx, i, meal).contorni || [];
  const f = state.swapFilters[mk] || {search:'', cat: currentCat ? 'same' : 'all'};
  state.swapFilters[mk] = f;
  let results = allRecipeMetas();
  if(f.cat === 'same' && currentCat) results = results.filter(r=>r.categoriaNew === currentCat);
  if(f.search) results = results.filter(r=>r.nome.toLowerCase().includes(f.search.toLowerCase()));
  const resultsHtml = results.slice(0, 60).map(r=>`
    <div class="swap-result" data-swap-pick="${escapeAttr(r.nome)}" data-swap-day="${mk}">
      <span class="swap-result-icon">${catIcon(r.categoriaNew)}</span>
      <span class="swap-result-name">${escapeHtml(r.nome)}</span>
      <span class="swap-result-time">${escapeHtml(TEMPO_LABEL[r.tempoBucket])}</span>
    </div>`).join('');
  // "Un'altra proposta" chiede suggerimenti diversi da quelli già mostrati in
  // questa sessione del pannello (f.suggestSeen, accumulato qui a ogni
  // render — suggestSwaps è deterministica, senza questo richiamerebbe
  // sempre le stesse 3).
  f.suggestSeen = f.suggestSeen || [];
  const suggestions = meal === 'cena' ? suggestSwaps(weekIdx, i, new Set(f.suggestSeen)) : [];
  suggestions.forEach(s => f.suggestSeen.push(s.r.nome));
  const suggestionsHtml = suggestions.length ? `
    <div class="swap-suggestions">
      <div class="filter-group-label">Suggeriti per questo giorno</div>
      ${suggestions.map(s=>`
        <button type="button" class="btn swap-suggestion" data-swap-pick="${escapeAttr(s.r.nome)}" data-swap-day="${mk}">
          <span class="swap-suggestion-top"><span class="swap-suggestion-name">${escapeHtml(s.r.nome)}</span><span class="swap-suggestion-time">${escapeHtml(s.r.tempo)}</span></span>
          <span class="swap-suggestion-motivo">${escapeHtml(s.motivo)}</span>
        </button>`).join('')}
    </div>` : '';
  return `
  <div class="meal-detail-screen">
    <div class="filters-modal">
      <div class="meal-detail-header">
        <div class="meal-detail-header-text">
          <div class="meal-detail-kicker">${escapeHtml(d.giorno)} ${escapeHtml(dateLabel)} · ${escapeHtml(MEAL_LABEL[meal].toLowerCase())} · tetto ${escapeHtml(tempoShortLabel(getTempoCap(i, meal)))}</div>
          <div class="meal-detail-title">${escapeHtml(currentName) || 'Scegli una ricetta'}</div>
        </div>
        <button type="button" class="btn is-icon meal-detail-close" data-open-swap="${mk}" aria-label="Chiudi">✕</button>
      </div>
      <div class="meal-detail-body">
        <div class="swap-panel">
          ${suggestionsHtml}
          <div class="filter-group-label">Oppure cerca</div>
          <input type="search" class="swap-search" placeholder="Cerca ricetta…" data-swap-search="${mk}" value="${escapeAttr(f.search)}">
          <div class="swap-cat-chips">
            ${currentCat ? `<button class="btn is-chip ${f.cat==='same'?'active':''}" data-swap-cat="same" data-swap-day="${mk}">${catIcon(currentCat)} Stessa categoria</button>` : ''}
            <button class="btn is-chip ${f.cat==='all'?'active':''}" data-swap-cat="all" data-swap-day="${mk}">Tutte le categorie</button>
          </div>
          <div class="swap-results">
            ${resultsHtml || '<div class="ing-empty">Nessuna ricetta trovata.</div>'}
            ${results.length > 60 ? `<div class="ing-empty">Altri ${results.length-60} risultati — affina la ricerca.</div>` : ''}
          </div>
          <div class="swap-panel-footer">
            ${suggestions.length ? `<button type="button" class="btn is-outline" data-swap-more="${mk}">Un'altra proposta</button>` : ''}
            <button type="button" class="btn is-ghost" data-open-swap="${mk}">Annulla</button>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}
// "È avanzata": scegli un pasto FUTURO che mangerà l'avanzo di questo.
function renderLinkPickerScreen(weekIdx, i, meal){
  const mk = mealKey(weekIdx, i, meal);
  const currentName = effectiveRecipeName(weekIdx, i, meal);
  // Include anche gli slot ancora vuoti: un avanzo si può assegnare a un
  // pasto non ancora deciso, non solo sostituire una scelta già fatta.
  const allMeals = allMealSlots();
  const selfPos = allMeals.findIndex(o => o.key === mk);
  const options = allMeals.filter((o, idx) => idx > selfPos);
  const optionsHtml = options.map(o=>`
    <div class="swap-result" data-link-pick="${o.key}" data-link-day="${mk}">
      <span class="swap-result-name">${escapeHtml(o.giorno)} ${escapeHtml(o.dateLabel)} · ${escapeHtml(MEAL_LABEL[o.meal])}</span>
      <span class="swap-result-time">${o.name ? escapeHtml(o.name) : 'Vuoto'}</span>
    </div>`).join('');
  return `
  <div class="meal-detail-screen">
    <div class="filters-modal">
      <div class="meal-detail-header">
        <div class="meal-detail-header-text">
          <div class="meal-detail-kicker">Segna come avanzata</div>
          <div class="meal-detail-title">${escapeHtml(currentName)}</div>
        </div>
        <button type="button" class="btn is-icon meal-detail-close" data-open-link-picker="${mk}" aria-label="Chiudi">✕</button>
      </div>
      <div class="meal-detail-body">
        <div class="swap-panel">
          <p class="section-sub" style="margin:0 0 8px;">Scegli il pasto in cui lo mangerete:</p>
          <div class="swap-results">
            ${optionsHtml || '<div class="ing-empty">Nessun pasto successivo disponibile.</div>'}
          </div>
        </div>
      </div>
    </div>
  </div>`;
}
// Direzione opposta di "Avanzata": utile quando il pasto sorgente è ormai
// passato (e quindi la sua card non è più raggiungibile per collegarla da
// lì) — si collega da qui, scegliendo tra i pasti precedenti.
function renderAvanzoDiPickerScreen(weekIdx, i, meal){
  const mk = mealKey(weekIdx, i, meal);
  const currentName = effectiveRecipeName(weekIdx, i, meal);
  const allMeals = allPlannedMeals();
  const selfPos = allMeals.findIndex(o => o.key === mk);
  const pastOptions = allMeals.filter((o, idx) => idx < selfPos).reverse();
  const pastOptionsHtml = pastOptions.map(o=>`
    <div class="swap-result" data-avanzodi-pick="${o.key}" data-avanzodi-day="${mk}">
      <span class="swap-result-name">${escapeHtml(o.giorno)} ${escapeHtml(o.dateLabel)} · ${escapeHtml(MEAL_LABEL[o.meal])}</span>
      <span class="swap-result-time">${escapeHtml(o.name)}</span>
    </div>`).join('');
  return `
  <div class="meal-detail-screen">
    <div class="filters-modal">
      <div class="meal-detail-header">
        <div class="meal-detail-header-text">
          <div class="meal-detail-kicker">È avanzo di…</div>
          <div class="meal-detail-title">${escapeHtml(currentName) || 'Scegli una ricetta'}</div>
        </div>
        <button type="button" class="btn is-icon meal-detail-close" data-open-avanzodi-picker="${mk}" aria-label="Chiudi">✕</button>
      </div>
      <div class="meal-detail-body">
        <div class="swap-panel">
          <p class="section-sub" style="margin:0 0 8px;">Scegli il pasto in cui è stato cucinato:</p>
          <div class="swap-results">
            ${pastOptionsHtml || '<div class="ing-empty">Nessun pasto precedente disponibile.</div>'}
          </div>
        </div>
      </div>
    </div>
  </div>`;
}
// "+ ricetta" per i contorni: sempre modificabile a mano, che sia stata
// scelta dal generatore o no — un pasto "avanzo" può comunque averne una
// tutta sua (vedi setMealContorni/effectiveMeal). Niente filtro di
// tipologia: la ricerca elenca tutto il catalogo, come "Cambia".
function renderContornoPickerScreen(weekIdx, i, meal){
  const mk = mealKey(weekIdx, i, meal);
  const mealData = effectiveMeal(weekIdx, i, meal);
  const currentName = mealData.principale || '';
  const contorni = mealData.contorni || [];
  const cf = state.swapFilters[`${mk}_contorno`] || {search:''};
  state.swapFilters[`${mk}_contorno`] = cf;
  let cResults = allRecipeMetas().filter(r => !contorni.includes(r.nome));
  if(cf.search) cResults = cResults.filter(r=>r.nome.toLowerCase().includes(cf.search.toLowerCase()));
  const cResultsHtml = cResults.slice(0, 40).map(r=>`
    <div class="swap-result" data-contorno-pick="${escapeAttr(r.nome)}" data-contorno-day="${mk}">
      <span class="swap-result-icon">${catIcon(r.categoriaNew)}</span>
      <span class="swap-result-name">${escapeHtml(r.nome)}</span>
      <span class="swap-result-time">${escapeHtml(TEMPO_LABEL[r.tempoBucket])}</span>
    </div>`).join('');
  return `
  <div class="meal-detail-screen">
    <div class="filters-modal">
      <div class="meal-detail-header">
        <div class="meal-detail-header-text">
          <div class="meal-detail-kicker">+ ricetta</div>
          <div class="meal-detail-title">${escapeHtml(currentName)}</div>
        </div>
        <button type="button" class="btn is-icon meal-detail-close" data-open-contorno-picker="${mk}" aria-label="Chiudi">✕</button>
      </div>
      <div class="meal-detail-body">
        <div class="swap-panel">
          <input type="search" class="swap-search" placeholder="Cerca una ricetta…" data-contorno-search="${mk}" value="${escapeAttr(cf.search)}">
          <div class="swap-results">
            ${cResultsHtml || '<div class="ing-empty">Nessuna ricetta trovata.</div>'}
            ${cResults.length > 40 ? `<div class="ing-empty">Altri ${cResults.length-40} risultati — affina la ricerca.</div>` : ''}
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

// Card di un giorno intero: intestazione (nome/data) + i due blocchi pasto,
// pranzo e cena. isPastCard non è più usato per lo stile del singolo pasto
// (era .day-card-past) ma resta sulla card per coerenza col resto del Menù.
function renderDayCard(weekIdx, i, pos, weekDates, isPastCard){
  const d = DATA.week1[i];
  const dateLabel = formatShortDate(weekDates[pos]);
  const [dayNumber, month] = dateLabel.split(' ');
  const isToday = isSameDay(weekDates[pos], new Date());
  const pranzoOpen = state.expandedDay === mealKey(weekIdx, i, 'pranzo');
  const cenaOpen = state.expandedDay === mealKey(weekIdx, i, 'cena');
  // Dalle 15 in poi il pranzo di oggi si dà per passato: si nasconde come i
  // giorni precedenti, dietro lo stesso bottone "Mostra pasti precedenti".
  const hidePranzo = isToday && !isPastCard && isTodayLunchPast() && !state.showPastDays;

  return `
  <div class="day-card${(pranzoOpen||cenaOpen) ? ' open' : ''}${isToday ? ' today' : ''}${isPastCard ? ' day-card-past' : ''}" data-week-idx="${weekIdx}" data-day-index="${i}">
    <div class="day-row">
      <div class="day-name">  ${d.giorno.slice(0, 3)}
          <span class="day-number">${dayNumber}</span>
      </div>
    </div>
    <div class="meals-block">
      ${hidePranzo ? '' : renderMealBlock(weekIdx, i, 'pranzo', pos, weekDates, isPastCard, d, dateLabel, isToday)}
      ${renderMealBlock(weekIdx, i, 'cena', pos, weekDates, isPastCard, d, dateLabel, isToday)}
    </div>
  </div>`;
}

// Bottone icona "impostazioni generazione" (giorni veloci): riusato ovunque
// si possa generare/rigenerare/aggiungere una settimana, così apre sempre
// lo stesso modale (renderMenu -> genSettingsModal).
// Pannello profilo nel foglio Impostazioni: nome, prossimo turno di cucina,
// colore identità. Ricostruito ogni volta che il foglio si apre e a ogni
// cambio colore (vedi wiring in fondo al file), non fa parte del render() principale.
function renderProfilePanel(){
  const user = getCurrentUser();
  if(!user) return '';
  const next = nextCookDayFor(user);
  const nextLine = next
    ? `Prossimo turno: <b>${escapeHtml(next.giorno)} ${escapeHtml(next.dateLabel)} · ${escapeHtml(MEAL_LABEL[next.meal])}</b>${next.name ? ' — '+escapeHtml(next.name) : ''}`
    : 'Nessun turno di cucina in programma.';
  const swatches = USER_COLOR_PRESETS.map(c=>`<button type="button" class="color-swatch${state.userColors[user]===c?' active':''}" style="background:${c}" data-user-color="${c}" aria-label="Scegli questo colore"></button>`).join('');
  return `
    <div class="profile-panel">
      <div class="profile-name">${escapeHtml(COOK_LABEL[user])}</div>
      <p class="profile-next-cook">${nextLine}</p>
      <div class="filter-group-label">Il tuo colore</div>
      <div class="color-swatch-row">${swatches}</div>
    </div>`;
}

// Etichetta leggibile invece dell'ingranaggio: "regole: circa 30 min",
// stesso trigger di sempre (apre genSettingsModal) ma si legge da sola
// invece di essere un'icona senza testo.
function genSettingsButton(target){
  return `<button class="btn is-text week-rules-link" type="button" data-open-gen-settings="${target}"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--carbon" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32"><path fill="currentColor" d="M27 16.76v-1.53l1.92-1.68A2 2 0 0 0 29.3 11l-2.36-4a2 2 0 0 0-1.73-1a2 2 0 0 0-.64.1l-2.43.82a11 11 0 0 0-1.31-.75l-.51-2.52a2 2 0 0 0-2-1.61h-4.68a2 2 0 0 0-2 1.61l-.51 2.52a11.5 11.5 0 0 0-1.32.75l-2.38-.86A2 2 0 0 0 6.79 6a2 2 0 0 0-1.73 1L2.7 11a2 2 0 0 0 .41 2.51L5 15.24v1.53l-1.89 1.68A2 2 0 0 0 2.7 21l2.36 4a2 2 0 0 0 1.73 1a2 2 0 0 0 .64-.1l2.43-.82a11 11 0 0 0 1.31.75l.51 2.52a2 2 0 0 0 2 1.61h4.72a2 2 0 0 0 2-1.61l.51-2.52a11.5 11.5 0 0 0 1.32-.75l2.42.82a2 2 0 0 0 .64.1a2 2 0 0 0 1.73-1l2.28-4a2 2 0 0 0-.41-2.51ZM25.21 24l-3.43-1.16a8.9 8.9 0 0 1-2.71 1.57L18.36 28h-4.72l-.71-3.55a9.4 9.4 0 0 1-2.7-1.57L6.79 24l-2.36-4l2.72-2.4a8.9 8.9 0 0 1 0-3.13L4.43 12l2.36-4l3.43 1.16a8.9 8.9 0 0 1 2.71-1.57L13.64 4h4.72l.71 3.55a9.4 9.4 0 0 1 2.7 1.57L25.21 8l2.36 4l-2.72 2.4a8.9 8.9 0 0 1 0 3.13L27.57 20Z"></path><path fill="currentColor" d="M16 22a6 6 0 1 1 6-6a5.94 5.94 0 0 1-6 6m0-10a3.91 3.91 0 0 0-4 4a3.91 3.91 0 0 0 4 4a3.91 3.91 0 0 0 4-4a3.91 3.91 0 0 0-4-4"></path></svg></button>`;
}
function genSettingsButtonAccent(target){
  return `<button class="btn is-double is-right is-accent" type="button" data-open-gen-settings="${target}" aria-label="Impostazioni generazione menù"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--tabler" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37c1 .608 2.296.07 2.572-1.065"></path><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0-6 0"></path></g></svg></button>`;
}

// Un blocco settimana completo: intestazione con data, striscia categorie,
// 7 giorni, e i controlli per generare/rigenerare (e, per le extra, rimuovere).
function renderWeekSection(weekIdx){
  const weekDates = weekDatesFor(weekIdx);
  // Nella settimana corrente non ha senso mostrare le card dei giorni già
  // passati: si parte da oggi. Nelle settimane extra (sempre future) si
  // mostrano tutte. La striscia delle iconcine invece resta sull'intera
  // settimana (anche i giorni passati), per avere sempre colpo d'occhio
  // sulla variazione di categoria durante tutta la settimana.
  const startPos = weekIdx === 0 ? (findTodayPos() ?? 0) : 0;
  const allPositions = [];
  for(let pos=0; pos<WEEK_DISPLAY_ORDER.length; pos++) allPositions.push(pos);
  const positions = allPositions.filter(pos => pos >= startPos);

  const strip = allPositions.map(pos=>{
    const i = WEEK_DISPLAY_ORDER[pos];
    const d = DATA.week1[i];
    const cat = effectiveCategoria(weekIdx, i);
    const isToday = isSameDay(weekDates[pos], new Date());
    // I giorni già passati (pos < startPos) sono visibili solo qui, la loro
    // card è nascosta più sotto — vedi startPos: niente da fare scorrendoci,
    // quindi la classe "past" li marca per uno stile disabilitato via CSS.
    const isPast = pos < startPos;
    return `<div class="balance-chip${isToday ? ' today' : ''}${isPast ? ' past' : ''}" data-scroll-to-day="${weekIdx}_${i}">
      <div class="bd">${d.giorno.slice(0,3)}</div>
      <div class="bc">${cat ? catIcon(cat) : '—'}</div>
    </div>`;
  }).join('');

  // Gli ultimi 3 giorni passati restano raggiungibili dietro un bottone,
  // chiusi di default: servono soprattutto per rimediare a uno scollegamento
  // avanzi fatto per sbaglio, riaprendo la card sorgente originale.
  const pastPositions = weekIdx === 0 ? allPositions.filter(pos => pos < startPos).slice(-3) : [];
  // Il bottone compare anche se non ci sono giorni passati, quando serve solo
  // a rivelare il pranzo di oggi nascosto dopo le 15 (vedi isTodayLunchPast).
  const todayLunchHidden = weekIdx === 0 && isTodayLunchPast();
  const pastToggle = (pastPositions.length || todayLunchHidden) ? `
  <div class="past-days-row">
    <button type="button" class="btn is-chip past-days-toggle" data-toggle-past-days="${weekIdx}">${state.showPastDays ? 'Nascondi' : 'Mostra'} pasti precedenti ${state.showPastDays ? '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M251 123.13c-.37-.81-9.13-20.26-28.48-39.61C196.63 57.67 164 44 128 44S59.37 57.67 33.51 83.52C14.16 102.87 5.4 122.32 5 123.13a12.08 12.08 0 0 0 0 9.75c.37.82 9.13 20.26 28.49 39.61C59.37 198.34 92 212 128 212s68.63-13.66 94.48-39.51c19.36-19.35 28.12-38.79 28.49-39.61a12.08 12.08 0 0 0 .03-9.75m-46.06 33C183.47 177.27 157.59 188 128 188s-55.47-10.73-76.91-31.88A130.4 130.4 0 0 1 29.52 128a130.5 130.5 0 0 1 21.57-28.11C72.54 78.73 98.41 68 128 68s55.46 10.73 76.91 31.89A130.4 130.4 0 0 1 226.48 128a130.5 130.5 0 0 1-21.57 28.12ZM128 84a44 44 0 1 0 44 44a44.05 44.05 0 0 0-44-44m0 64a20 20 0 1 1 20-20a20 20 0 0 1-20 20"></path></svg>' : '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M234.42 162a12 12 0 1 1-20.84 12l-16.86-29.5a127.2 127.2 0 0 1-30.17 13.86l5.29 31.64a12 12 0 0 1-9.87 13.8a11 11 0 0 1-2 .17a12 12 0 0 1-11.82-10l-5.15-30.8a136.5 136.5 0 0 1-30.06 0l-5.1 30.83A12 12 0 0 1 96 204a11 11 0 0 1-2-.17A12 12 0 0 1 84.16 190l5.29-31.72a127.2 127.2 0 0 1-30.17-13.86L42.42 174a12 12 0 1 1-20.84-12L40 129.85a160 160 0 0 1-17.31-18.31a12 12 0 0 1 18.65-15.08C57.38 116.32 85.44 140 128 140s70.62-23.68 86.66-43.54a12 12 0 0 1 18.67 15.08A160 160 0 0 1 216 129.85Z"></path></svg>'}</button>
  </div>` : '';
  const pastDays = (state.showPastDays && pastPositions.length)
    ? pastPositions.map(pos=> renderDayCard(weekIdx, WEEK_DISPLAY_ORDER[pos], pos, weekDates, true)).join('')
    : '';

  const days = pastToggle + pastDays + positions.map(pos=> renderDayCard(weekIdx, WEEK_DISPLAY_ORDER[pos], pos, weekDates)).join('');

  // Genera/Rigenera ed Elimina vivono ora nella modale impostazioni, aperta
  // dal bottoncino sul titolo della settimana (vedi genSettingsModal in renderMenu).
  return `
    <section class="week-section">
      <h2 class="week-title is-menu">Settimana del ${weekLabelFor(weekIdx)} ${genSettingsButton(weekIdx)}</h2>
      <div class="balance-strip">${strip}</div>
      ${days}
    </section>`;
}

// Posizione (0..6, ordine di visualizzazione) del giorno di oggi nella
// settimana 0: c'è sempre, dato che la settimana 0 è ancorata a "oggi"
// (vedi upcomingSaturday). Usata dall'header "Oggi" e per il badge del giorno.
function findTodayPos(){
  const dates = weekDatesFor(0);
  const today = new Date();
  for(let pos=0; pos<WEEK_DISPLAY_ORDER.length; pos++){
    if(isSameDay(dates[pos], today)) return pos;
  }
  return null;
}

// Dalle 15 in poi si dà per scontato che il pranzo di oggi sia già stato
// consumato: usato per nasconderlo di default, come i giorni precedenti.
function isTodayLunchPast(){
  return new Date().getHours() >= 15;
}

// Header "Oggi" in cima al Menù: lo stato della casa (spesa da fare,
// dispensa in esaurimento, domani) — la cena di stasera non è più ripetuta
// qui perché la scheda del giorno corrente è già aperta di default subito
// sotto, nella lista della settimana.
function renderMenu(){
  const weekSections = [0, ...state.extraWeeks.map((_,n)=>n+1)]
    .map(weekIdx => renderWeekSection(weekIdx)).join('');

  // Promemoria "oggi/domani cucini tu", solo in app (niente push): un
  // banner chiudibile, che resta chiuso per quel giorno finché non lo si
  // riapre (stessa logica di dismissione già usata per lo shopping).
  let reminderBanner = '';
  const currentUser = getCurrentUser();
  if(currentUser){
    const next = nextCookDayFor(currentUser);
    if(next && (next.daysFromToday === 0 || next.daysFromToday === 1) && !state.notifDismissed[next.dayKey]){
      const when = next.daysFromToday === 0 ? 'Oggi' : 'Domani';
      reminderBanner = `
      <div class="cook-reminder-banner">
        <span>${when} cucini tu (${escapeHtml(MEAL_LABEL[next.meal].toLowerCase())})${next.name ? ': <b>'+escapeHtml(next.name)+'</b>' : ''}</span>
        <button type="button" class="btn is-icon" data-dismiss-reminder="${next.dayKey}" aria-label="Chiudi promemoria">✕</button>
      </div>`;
    }
  }

  // Promemoria "ieri hai mangiato X?": se il giorno di ieri (nella settimana
  // corrente) aveva una ricetta e nessuno l'ha ancora segnata come Cucinata,
  // lo chiede appena si riapre l'app — altrimenti gli ingredienti restano in
  // Dispensa anche se in realtà sono stati usati. Non copre il salto sabato
  // (ieri = venerdì della settimana appena chiusa, non più raggiungibile).
  let eatenReminderBanner = '';
  {
    const startPos = findTodayPos() ?? 0;
    if(startPos > 0){
      const yestPos = startPos - 1;
      const yestI = WEEK_DISPLAY_ORDER[yestPos];
      const yestKey = mealKey(0, yestI, 'cena');
      const yestMealsDone = weekMealsDoneRef(0);
      const yestName = effectiveRecipeName(0, yestI);
      if(yestName && !(yestMealsDone[yestI] && yestMealsDone[yestI].cena) && !state.mealsDoneReminderDismissed[yestKey]){
        eatenReminderBanner = `
        <div class="eaten-reminder-banner">
          <span>Ieri (${escapeHtml(DATA.week1[yestI].giorno)}) hai mangiato <b>${escapeHtml(yestName)}</b>?</span>
          <div class="eaten-reminder-actions">
            <button type="button" class="btn is-solid mini-add-btn" data-toggle-done="${yestKey}">Sì, segna</button>
            <button type="button" class="btn is-ghost" data-dismiss-eaten-reminder="${yestKey}">No</button>
          </div>
        </div>`;
      }
    }
  }

  let doneModal = '';
  if(state.doneModalDay !== null){
    const { weekIdx: doneWeekIdx, i: di, meal: doneMeal } = parseMealKey(state.doneModalDay);
    const doneMealData = effectiveMeal(doneWeekIdx, di, doneMeal);
    const doneName = doneMealData.principale || '';
    const doneIng = (doneName ? getIngredientsFor(doneName) : []).concat(doneMealData.contorni.reduce((acc,c)=>acc.concat(getIngredientsFor(c)), []));
    const qtyMap = state.doneModalQty || {};
    const finishedMap = state.doneModalFinished || {};
    // Stesso ingrediente può ripetersi tra principale e contorni: una riga sola.
    const seenNames = new Set();
    const uniqueIng = doneIng.filter(it=>{
      const key = (it.ingrediente||'').trim().toLowerCase();
      if(seenNames.has(key)) return false;
      seenNames.add(key);
      return true;
    });
    // Gli ingredienti "a spanne" (unit 'none' in Dispensa, es. sale/pepe) non
    // hanno una quantità da tracciare: non vanno confusi con "non in
    // dispensa" (ci sono, semplicemente non si conta quanto). Finiscono in
    // una sezione a parte più sotto, "L'hai finito?" — di default non
    // spuntata, perché usarne un po' non vuol dire averla esaurita.
    const finishableNames = [];
    const normalRowsHtml = uniqueIng.map(it=>{
      const name = it.ingrediente;
      const pantryIt = resolvePantryItem(name);
      if(pantryIt && pantryIt.unit === 'none'){
        if(typeof pantryIt.qty === 'number' && pantryIt.qty > 0) finishableNames.push(name);
        return '';
      }
      const tracked = Object.prototype.hasOwnProperty.call(qtyMap, name);
      if(!tracked){
        return `<div class="done-ing-row untracked"><span>${escapeHtml(name)}</span><span class="done-ing-hint">non in dispensa</span></div>`;
      }
      const unit = pantryIt.unit || '';
      const step = qtyStepFor(unit);
      const editingThis = state.doneQtyEditingKey === name;
      return `
      <div class="done-ing-row">
        <span>${escapeHtml(name)}</span>
        <span class="qty-stepper">
          <button class="qty-btn" type="button" data-done-qty-dec="${escapeAttr(name)}" aria-label="Diminuisci">−</button>
          ${editingThis
            ? `<input type="number" min="0" step="${step}" class="qty-input" value="${qtyMap[name]}" data-done-qty-edit="${escapeAttr(name)}">${unit ? `<span class="qty-unit">${escapeHtml(unit)}</span>` : ''}`
            : `<span class="qty-num" data-done-qty-show="${escapeAttr(name)}">${qtyMap[name]}${unit ? ' ' + escapeHtml(unit) : ''}</span>`}
          <button class="qty-btn" type="button" data-done-qty-inc="${escapeAttr(name)}" aria-label="Aumenta">+</button>
        </span>
      </div>`;
    }).join('');
    const finishedSectionHtml = finishableNames.length ? `
      <div class="filter-group-label done-finished-title">L'hai finito? Se sì, lo aggiungo alla lista della spesa.</div>
      <div class="done-ing-list">
        ${finishableNames.map(name=>`
        <label class="done-ing-row presence-toggle done-finished-row">
          <span>${escapeHtml(name)}</span>
          <input type="checkbox" ${finishedMap[name] ? 'checked' : ''} data-done-finished-toggle="${escapeAttr(name)}">
        </label>`).join('')}
      </div>` : '';
    doneModal = `
    <div class="filters-modal-backdrop" data-close-done-modal>
      <div class="filters-modal" data-stop-close>
        <div class="filters-modal-header">
          <h3>Ricetta fatta! 🎉</h3>
          <button class="btn is-icon filters-close-btn" data-close-done-modal>✕</button>
        </div>
        <p class="section-sub" style="margin-top:-8px;">Quanto ne hai usato per questo pasto? Alla conferma lo tolgo dalla Dispensa — il resto degli ingredienti non cambia.</p>
        ${uniqueIng.length ? `
        ${normalRowsHtml ? `<div class="done-ing-list">${normalRowsHtml}</div>` : ''}
        ${finishedSectionHtml}
        ` : `<div class="ing-empty">Nessun ingrediente salvato per questa ricetta.</div>`}
        <div class="filter-group done-finished-title">
          <div class="filter-group-label">È avanzato qualcosa?</div>
          <div class="inv-item is-avanzi">
            <div class="picker-anchor">
              <button type="button" class="btn is-icon luogo-picker-opt" data-luogo-value="${escapeAttr(LUOGO_LABEL[state.doneModalLeftoverLuogo])}" data-done-leftover-luogo-toggle title="Luogo: ${escapeAttr(LUOGO_LABEL[state.doneModalLeftoverLuogo])} — tocca per scegliere">${LUOGO_ICON[state.doneModalLeftoverLuogo]}</button>
              ${state.doneModalLeftoverPickerOpen ? `
              <div class="luogo-picker-backdrop" data-done-leftover-luogo-close></div>
              <div class="luogo-picker">
                ${LUOGO_ORDER.map(l=>`<button type="button" class="btn is-icon luogo-picker-opt${l===state.doneModalLeftoverLuogo?' active':''}" data-done-leftover-luogo-set="${l}" data-luogo-value="${escapeAttr(LUOGO_LABEL[l])}" title="${escapeAttr(LUOGO_LABEL[l])}">${LUOGO_ICON[l]}</button>`).join('')}
              </div>` : ''}
            </div>
            <div class="picker-anchor">
              <button type="button" class="btn is-icon luogo-picker-opt" data-done-leftover-cat-toggle title="Reparto: ${escapeAttr(DEPT_LABEL[state.doneModalLeftoverCat])} — tocca per scegliere">${DEPT_ICON[state.doneModalLeftoverCat]}</button>
              ${state.doneModalLeftoverCatPickerOpen ? `
              <div class="luogo-picker-backdrop" data-done-leftover-cat-close></div>
              <div class="luogo-picker is-category">
                ${DEPT_ORDER.filter(d=>d!=='finiti' && !isNonFoodDept(d)).map(d=>`<button type="button" class="btn is-icon luogo-picker-opt${d===state.doneModalLeftoverCat?' active':''}" data-done-leftover-cat-set="${d}" title="${escapeAttr(DEPT_LABEL[d])}">${DEPT_ICON[d]}</button>`).join('')}
              </div>` : ''}
            </div>
            <input type="text" placeholder="es. ${escapeAttr(doneName || 'Avanzo')}" value="${escapeAttr(state.doneModalLeftover || '')}" data-done-leftover-input>
            <label class="presence-toggle"><input type="checkbox" ${state.doneModalLeftoverChecked ? 'checked' : ''} data-done-leftover-toggle></label>
          </div>
        </div>
        <div class="filters-modal-footer">
          <button class="btn is-ghost reset-btn" data-close-done-modal>Annulla</button>
          <button class="btn is-solid mini-add-btn" data-confirm-done="${state.doneModalDay}">Conferma</button>
        </div>
      </div>
    </div>`;
  }

  const genSettingsTargetWeek = typeof state.genSettingsOpen === 'number' ? state.genSettingsOpen : null;
  const genSettingsModal = state.genSettingsOpen !== null ? (()=>{
    // Righe eccezione esistenti, ordinate per giorno poi pranzo/cena.
    const excKeys = Object.keys(state.weekTempoExceptions).sort((a,b)=>{
      const [da, ma] = a.split('_'), [db, mb] = b.split('_');
      return (parseInt(da,10) - parseInt(db,10)) || ma.localeCompare(mb);
    });
    const excRowsHtml = excKeys.map(key=>{
      const [dayStr, exMeal] = key.split('_');
      const day = parseInt(dayStr, 10);
      const dayLabel = DATA.week1[day].giorno.slice(0,3).toUpperCase() + (exMeal === 'pranzo' ? ' pranzo' : '');
      return `
      <div class="tempo-exception-row">
        <span class="tempo-exception-day">${escapeHtml(dayLabel)}</span>
        <span class="tempo-exception-value">${escapeHtml(tempoShortLabel(state.weekTempoExceptions[key]))}</span>
        <button type="button" class="btn is-icon" data-remove-tempo-exception="${key}" aria-label="Togli eccezione">✕</button>
      </div>`;
    }).join('');
    // Giorni/pasti ancora disponibili per una nuova eccezione: cena per ogni
    // giorno che non ne ha già una, pranzo solo ven/sab/dom (indici 4,5,6 —
    // gli unici pranzi generati, lun-gio è avanzo automatico).
    const excOptions = [];
    for(let d = 0; d < 7; d++){
      if(!state.weekTempoExceptions[`${d}_cena`]) excOptions.push({ day:d, meal:'cena', label: DATA.week1[d].giorno.slice(0,3).toUpperCase() });
      if((d===4||d===5||d===6) && !state.weekTempoExceptions[`${d}_pranzo`]) excOptions.push({ day:d, meal:'pranzo', label: DATA.week1[d].giorno.slice(0,3).toUpperCase()+' pranzo' });
    }
    let excPickerHtml = '';
    if(state.tempoExceptionAdding === 'pickingDay'){
      excPickerHtml = `
      <div class="tempo-exception-picker">
        ${excOptions.length ? excOptions.map(o=>`<button type="button" class="btn is-filter" data-pick-tempo-exception-day="${o.day}" data-pick-tempo-exception-meal="${o.meal}">${escapeHtml(o.label)}</button>`).join('') : '<div class="ing-empty">Nessun altro giorno disponibile.</div>'}
      </div>`;
    } else if(state.tempoExceptionAdding && typeof state.tempoExceptionAdding === 'object'){
      const { day: exDay, meal: exMealPicking } = state.tempoExceptionAdding;
      excPickerHtml = `
      <div class="tempo-exception-picker">
        ${TEMPO_ORDER.map(t=>`<button type="button" class="btn is-chip" data-set-tempo-exception-value="${t}">${escapeHtml(tempoShortLabel(t))}</button>`).join('')}
      </div>`;
    }
    // Solo indicativo per la settimana bersaglio: quanti pasti la
    // rigenerazione toccherebbe davvero e quanti bloccati vengono conservati
    // (vedi generateWeek). Lun-gio pranzo non è mai generato (è avanzo).
    let regenNote = '';
    let regenCount = 0;
    if(genSettingsTargetWeek !== null){
      let lockedCount = 0, totalMeals = 0;
      for(let d = 0; d < 7; d++){
        ['pranzo','cena'].forEach(m=>{
          if(m === 'pranzo' && !(d===4||d===5||d===6)) return;
          totalMeals++;
          if(state.mealLocked[`${genSettingsTargetWeek}_${d}_${m}`]) lockedCount++;
        });
      }
      regenCount = totalMeals - lockedCount;
      regenNote = lockedCount > 0 ? `Rigenerare sostituisce <b>${regenCount} pasti</b> e conserva i <b>${lockedCount} bloccati</b>.` : '';
    }
    return `
    <div class="filters-modal-backdrop" data-close-gen-settings>
      <div class="filters-modal" data-stop-close>
        <div class="filters-modal-header">
          <h3>Regole di generazione</h3>
          <button class="btn is-icon filters-close-btn" data-close-gen-settings>✕</button>
        </div>
        <div class="filter-groups">
          <div class="filter-group">
            <div class="filter-group-label">Tempo massimo, tutti i giorni</div>
            <div class="tempo-base-list">
              ${TEMPO_ORDER.map(t=>`<button type="button" class="tempo-base-row${state.weekTempoBase===t?' active':''}" data-set-tempo-base="${t}"><span>${escapeHtml(TEMPO_LABEL[t])}</span>${state.weekTempoBase===t?'<span class="tempo-base-check">✓</span>':''}</button>`).join('')}
            </div>
          </div>
          <div class="filter-group">
            <div class="filter-group-label">Eccezioni</div>
            ${excRowsHtml || '<p class="section-sub" style="margin:0;">Nessuna: tutti i giorni seguono il valore di base.</p>'}
            <button type="button" class="btn is-text" data-toggle-tempo-exception-picker style="margin-top:0.5rem;">+ aggiungi un'eccezione</button>
            ${excPickerHtml}
          </div>
        </div>
        ${genSettingsTargetWeek !== null ? `
        <p class="generate-week-hint">${genSettingsTargetWeek === 0 ? "Sceglie 7 ricette di stagione, variando le categorie giorno per giorno." : ''}</p>
        ${regenNote ? `<p class="section-sub" style="margin:0 0 0.75rem;">${regenNote}</p>` : ''}
        <div class="filters-modal-footer">
          <button class="btn is-solid mini-add-btn" data-generate-week="${genSettingsTargetWeek}">${genSettingsTargetWeek === 0 ? 'Genera nuovo menù' : (regenCount ? `Rigenera ${regenCount} pasti` : 'Rigenera settimana')}</button>
        </div>
        ${genSettingsTargetWeek > 0 ? `<div style="text-align:center;margin-top:0.75rem;"><button type="button" class="btn is-text color-delete" data-remove-week="${genSettingsTargetWeek}">Elimina questa settimana</button></div>` : ''}` : ''}
      </div>
    </div>`;
  })() : '';
/*
        <div class="filters-modal-footer">
          <button class="btn is-solid mini-add-btn" data-close-gen-settings>Fatto</button>
        </div> */
  // Controllo su "meal" valido (non solo "expandedDay valorizzato"): una
  // chiave orfana/malformata rimasta in stato vecchio non deve far comparire
  // una schermata vuota — vedi il bug della vecchia chiave a 2 parti nell'IIFE di init.
  const mealDetailScreen = state.expandedDay ? (()=>{
    const { weekIdx, i, meal } = parseMealKey(state.expandedDay);
    if(meal !== 'pranzo' && meal !== 'cena') return '';
    return renderMealDetailScreen(weekIdx, i, meal);
  })() : '';
  // Le 4 schermate di scelta ricetta: al più una alla volta, gli stessi
  // handler di apertura si escludono già a vicenda (vedi attachHandlers).
  function pickerScreenFor(stateKey, renderFn){
    const key = state[stateKey];
    if(!key) return '';
    const { weekIdx, i, meal } = parseMealKey(key);
    if(meal !== 'pranzo' && meal !== 'cena') return '';
    return renderFn(weekIdx, i, meal);
  }
  const swapScreen = pickerScreenFor('swapOpenDay', renderSwapScreen);
  const linkPickerScreen = pickerScreenFor('linkPickerOpenDay', renderLinkPickerScreen);
  const avanzoDiPickerScreen = pickerScreenFor('avanzoDiPickerOpenDay', renderAvanzoDiPickerScreen);
  const contornoPickerScreen = pickerScreenFor('contornoPickerOpenMeal', renderContornoPickerScreen);
  return `
    ${eatenReminderBanner}
    ${reminderBanner}
    ${weekSections}
    ${doneModal}
    ${renderRecipeEditModal()}
    ${genSettingsModal}
    ${mealDetailScreen}
    ${swapScreen}
    ${linkPickerScreen}
    ${avanzoDiPickerScreen}
    ${contornoPickerScreen}
    <div class="generate-week-block">
      <div class="generate-week-row">
        <button class="btn is-double is-left is-accent" id="add-week">+ Aggiungi settimana</button>
        ${genSettingsButtonAccent('plain')}
      </div>
      <p class="generate-week-hint">Pianifica un'altra settimana con le stesse regole.</p>
    </div>
  `;
}

// Lista piatta di tutti gli articoli di Spesa in questo momento (giorni
// pianificati, basilari settimanali, aggiunti a mano, finiti in Dispensa),
// con contesto e chiave stabile. Fattorizzata fuori da renderSpesa perché
// serve anche a "Svuota spunte" per sapere quali chiavi esistono davvero,
// a prescindere da cosa sia visibile/aperto in quel momento sullo schermo.
function buildShopFlat(){
  const flat = [];
  allPlannedShoppingMeals().forEach(({weekIdx,i,meal,key:mk,giorno,dateLabel,principale,contorni,dishLabel})=>{
    // Le porzioni sono per pasto (non per singola ricetta): il rapporto si
    // calcola una volta sola dal principale e si applica uniformemente anche
    // agli ingredienti dei contorni, così basta un solo stepper per pasto.
    const det = getRecipeDetails(principale);
    const basePortions = det ? parsePortionsBase(det.porzioni) : null;
    const ratio = basePortions ? (state.dayPortions[mk] || basePortions) / basePortions : 1;
    // context/contextShort sono condivisi da principale e contorni: così le
    // loro righe si aggregano sempre sotto lo stesso titolo di sezione in
    // Spesa (un pasto = una sezione, non una per ricetta).
    const context = `${giorno} ${dateLabel} · ${MEAL_LABEL[meal]} · ${dishLabel}`;
    // Nota delle righe in Per reparto: solo giorno e pasto, il nome della
    // ricetta la rendeva troppo lunga (resta nell'intestazione di Per giorno).
    const contextShort = `${giorno.slice(0,3)} ${dateLabel.split(' ')[0]} · ${MEAL_LABEL[meal]}`;
    const dishes = [{ role:'p', name: principale }].concat(contorni.map((c,ci)=>({ role:`c${ci}`, name:c })));
    dishes.forEach(({role, name})=>{
      const ingList = getIngredientsFor(name);
      ingList.forEach((it,idx)=>{
        const key = dayIngKey(weekIdx, i, meal, role, ingList, idx);
        if(state.shopDismissed[key]) return;
        // Le quantità scalate valgono solo finché non è già stato spuntato:
        // quello già preso non deve cambiare retroattivamente se poi si aggiustano le porzioni.
        const qta = state.shopChecked[key] ? it.qta : scaleQtyText(it.qta, ratio);
        // Se in Dispensa ce n'è già abbastanza, non compare proprio in Spesa
        // (niente riga da vedere/spuntare) — a meno che non l'avessi già
        // esplicitamente de-spuntato in passato per dire "mi serve comunque".
        if(pantryStatusFor(it.ingrediente, qta) === 'in-casa' && state.shopChecked[key] !== false) return;
        flat.push({ key, ingrediente:it.ingrediente, qta, dove:it.dove, note:it.note, context, contextShort, isRecipe: true });
      });
    });
  });
  DATA.generalShopping.forEach((it,idx)=>{
    const key = `gen_${idx}`;
    if(state.shopDismissed[key]) return;
    if(pantryStatusFor(it.ingrediente, it.qta) === 'in-casa' && state.shopChecked[key] !== false) return;
    flat.push({ key, ingrediente:it.ingrediente, qta:it.qta, dove:it.dove, note:it.note, context:'Ogni settimana', contextShort:'Ogni settimana' });
  });
  Object.entries(state.shopExtras).forEach(([id, it])=>{
    if(state.shopDismissed[id]) return;
    flat.push({ key:id, ingrediente:it.ingrediente, qta:it.qta, dove:'', note:'', context:'Aggiunti a mano', contextShort:'Aggiunti a mano', cat: it.cat });
  });
  // Ingredienti finiti in Dispensa (qty scesa a 0): la voce di Dispensa non
  // viene mai cancellata quando arriva a 0, resta lì con la sua unità/luogo/
  // categoria — quando la spunti e la sposti in Dispensa aggiorna quello
  // stesso record invece di doverlo ricreare da capo.
  Object.entries(state.pantryItems).forEach(([pantryKey, it])=>{
    const key = `oos_${pantryKey}`;
    // Tornato in scorta: un'eventuale riga "finito" scartata/comprata in
    // passato non vale più — quando finirà di nuovo deve ricomparire qui.
    // (Prima restava scartata per sempre: un ingrediente ricomprato da Spesa
    // e poi finito un'altra volta non tornava più tra i Finiti.)
    if(typeof it.qty === 'number' && it.qty > 0 && (state.shopDismissed[key] || state.shopChecked[key] !== undefined)){ delete state.shopDismissed[key]; delete state.shopChecked[key]; return; }
    if(typeof it.qty !== 'number' || it.qty > 0) return;
    if(isLeftoverPantryItem(it)) return; // un avanzo non si ricompra
    if(state.shopDismissed[key]) return;
    flat.push({ key, ingrediente:it.nome, qta: '', dove:'', note:'', context:'Finiti in Dispensa', contextShort:'Finiti in Dispensa', confirmed: !!state.pantryConfirmedShop[pantryKey] });
  });
  return flat;
}

function renderSpesa(){
  // Chi ha già scorta sufficiente in Dispensa non compare proprio qui (vedi
  // buildShopFlat) — se serve comunque, si riaggiunge a mano con "+". Una
  // riga è spuntata solo se l'hai spuntata tu: niente più spunta automatica
  // "ce l'hai già" in base alla Dispensa (faceva partire già spuntato un
  // ingrediente aggiunto a mano proprio perché serviva comunque).
  const mainFlat = buildShopFlat();

  // Una riga può avere più chiavi quando più occorrenze si uniscono (stessa
  // quantità testuale) in Per reparto: se ne hai spuntata una qualsiasi in
  // Per giorno, la riga unita deve leggersi spuntata anche qui — un de-spuntato
  // esplicito vince comunque, per non perdere di vista quello che manca ancora.
  function isItemChecked(keys){
    if(keys.some(k=>state.shopChecked[k] === false)) return false;
    if(keys.some(k=>state.shopChecked[k] === true)) return true;
    return false;
  }

  const total = mainFlat.length;
  const done = mainFlat.filter(it=>isItemChecked([it.key], it.ingrediente)).length;
  // Le spuntate in "Finiti" hanno le loro azioni dedicate (Elimina/Aggiungi
  // alla lista, vedi la sezione più sotto) — non contano per la barra globale
  // Elimina/Sposta in dispensa, che altrimenti comparirebbe due volte con
  // un'azione ("Sposta in dispensa") che per un ingrediente già in Dispensa
  // non ha senso.
  const doneShoppable = mainFlat.filter(it=> it.context !== 'Finiti in Dispensa' && isItemChecked([it.key], it.ingrediente)).length;
  // Il conteggio mostrato in cima deve contare quello che vedi davvero: in
  // Per giorno ogni occorrenza è una riga (mainFlat), ma in Per reparto più
  // occorrenze dello stesso ingrediente+quantità si uniscono in una riga sola
  // — altrimenti il numero non torna con quante righe hai sotto gli occhi.
  // Di default (Per giorno) coincide con total/done; Per reparto lo
  // ricalcola sulla lista unita non appena è pronta, poco più sotto.
  let displayTotal = total;
  let displayDone = done;
  let displayDoneShoppable = doneShoppable;

  function itemRow(keys, ingrediente, qta, note, subtitle, forcedChecked){
    const checked = forcedChecked !== undefined ? forcedChecked : isItemChecked(keys, ingrediente);
    const rowKey = keys.join(',');
    // La quantità/unità di partenza viene dal testo della ricetta ("300 g",
    // "1 spicchio"...) invece di un generico "1" scollegato — allineato a come
    // Dispensa mostra numero+unità nello stepper. Se il testo non è
    // interpretabile (es. "q.b.", "circa 80 ml") resta il vecchio fallback:
    // un contatore da 1 senza unità, comunque modificabile con +/-. Unità
    // vuota (non "pz") per i conteggi generici, coerente con come Dispensa
    // tratta "pezzi/generico".
    //
    // Quantità non nota (ingrediente finito in Dispensa, "q.b.", "facoltativo",
    // aggiunto a mano senza quantità, unità "Non mostrare"): niente numero
    // inventato ("1", "1 none", "1 g" di pasta) ma un segnaposto "–"; + parte
    // da un passo (1 pezzo, o 50 g/ml se in Dispensa l'ingrediente è tracciato
    // a peso/volume), − fino a 0 torna al segnaposto.
    const parsedQta = parseQtyValue(qta);
    const hasAmount = !!parsedQta && parsedQta.unit !== 'none';
    const pantryUnit = (state.pantryItems[(ingrediente||'').trim().toLowerCase()] || {}).unit;
    const unit = hasAmount ? (parsedQta.unit || '') : (['g','kg','ml','l'].includes(pantryUnit) ? pantryUnit : '');
    const step = qtyStepFor(unit);
    const qty = (typeof state.shopQty[rowKey] === 'number') ? state.shopQty[rowKey] : (hasAmount ? parsedQta.value : 0);
    const qtyDefault = hasAmount ? parsedQta.value : '';
    const editingQty = state.shopQtyEditingKey === rowKey;
    // Solo in Per reparto più occorrenze (giorni diversi) si uniscono in una
    // riga sola: se ne hai spuntata qualcuna ma non tutte, un segno lo dice a
    // colpo d'occhio — altrimenti sembra spuntato (o non spuntato) del tutto
    // mentre in realtà è parziale (es. il sale servito solo per alcune ricette).
    const checkedCount = keys.filter(k=>state.shopChecked[k]===true).length;
    const isPartial = keys.length > 1 && checkedCount > 0 && checkedCount < keys.length;
    // Nota personale legata al nome dell'ingrediente (non al pasto/occorrenza):
    // stessa nota su ogni riga in cui compare, persiste da una settimana
    // all'altra — stesso schema tocca-per-modificare della "Variante" avanzo.
    const ingNoteKey = (ingrediente||'').trim().toLowerCase();
    const ingNote = state.ingredientNotes[ingNoteKey] || '';
    const editingIngNote = state.ingNoteEditingKey === ingNoteKey;
    const ingNoteHtml = editingIngNote
      ? `<span class="ing-note-row"><input type="text" class="ing-note-input" placeholder="Nota per questo ingrediente…" value="${escapeAttr(ingNote)}" data-ing-note="${escapeAttr(ingNoteKey)}"></span>`
      : `<span class="ing-note-row">${ingNote ? `<span class="ing-note-text" data-ing-note-show="${escapeAttr(ingNoteKey)}">📝 ${escapeHtml(ingNote)}</span>` : `<button type="button" class="btn is-text ing-note-add" data-ing-note-show="${escapeAttr(ingNoteKey)}">+ nota</button>`}</span>`;
    return `
    <div class="shop-item-row">
      <label class="shop-item ${checked?'checked':''}">
        <input type="checkbox" data-shop-keys="${rowKey}" data-shop-name="${escapeAttr(ingrediente)}" data-shop-unit="${escapeAttr(unit)}" ${checked?'checked':''}>
        <span>
          <span class="item-name">${escapeHtml(ingrediente)}${isPartial ? `<span class="partial-mark" title="Spuntato solo per ${checkedCount} giorno/i su ${keys.length}, non per tutti">◐</span>` : ''}</span>
          ${(subtitle || note) ? `<span class="item-detail">${escapeHtml(subtitle||'')}${subtitle && note ? ' · ' : ''}${escapeHtml(note||'')}</span>` : ''}
          ${ingNoteHtml}
        </span>
      </label>
      <span class="qty-stepper" title="Quantità da prendere">
        <button class="qty-btn" type="button" data-shop-qty-dec="${escapeAttr(rowKey)}" data-shop-qty-default="${qtyDefault}" data-shop-qty-step="${step}" aria-label="Diminuisci quantità">−</button>
        ${editingQty
          ? `<input type="number" min="0" step="${step}" class="qty-input" value="${qty > 0 ? qty : ''}" placeholder="–" data-shop-qty-edit="${escapeAttr(rowKey)}">${unit ? `<span class="qty-unit">${escapeHtml(unit)}</span>` : ''}`
          : qty > 0
            ? `<span class="qty-num" data-shop-qty-show="${escapeAttr(rowKey)}">${qty}${unit ? ' ' + escapeHtml(unit) : ''}</span>`
            : `<span class="qty-num qty-placeholder" data-shop-qty-show="${escapeAttr(rowKey)}" title="Quantità non indicata">–</span>`}
        <button class="qty-btn" type="button" data-shop-qty-inc="${escapeAttr(rowKey)}" data-shop-qty-default="${qtyDefault}" data-shop-qty-step="${step}" aria-label="Aumenta quantità">+</button>
      </span>
      <button class="btn-remove" data-shop-remove="${rowKey}" type="button" aria-label="Elimina ${escapeAttr(ingrediente)}"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 256 256"><path fill="currentColor" d="M216 48h-40v-8a24 24 0 0 0-24-24h-48a24 24 0 0 0-24 24v8H40a8 8 0 0 0 0 16h8v144a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V64h8a8 8 0 0 0 0-16M96 40a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8v8H96Zm96 168H64V64h128Zm-80-104v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0m48 0v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0"></path></svg></button>
    </div>`;
  }

  let body = '';
  let hasFinitiThisView = false;
  if(state.shopView === 'reparto'){
    // Solo reparto merceologico, niente più negozio: si compra dove capita.
    // I "Finiti in Dispensa" vanno nel loro reparto dedicato invece che in "Altro"
    // (o nel reparto merceologico vero, che a colpo d'occhio non spiegherebbe il perché sono lì)
    // — a meno che non siano stati segnati "da comprare" da Spesa: a quel punto si mescolano
    // nel loro reparto vero, tra le sezioni normali.
    const classified = mainFlat.map(it=>{
      const dept = (it.context === 'Finiti in Dispensa' && !it.confirmed) ? 'finiti' : (knownDept(it.cat) || pantryCatFor(it.ingrediente) || classifyDept(it.ingrediente));
      return {...it, dept};
    });
    // unisco articoli identici (stesso ingrediente) comparsi in più ricette,
    // sommando le quantità invece di tenerne una sola (vedi combineQtyTexts)
    const merged = {};
    classified.forEach(it=>{
      const mergeKey = (it.ingrediente||'').trim().toLowerCase();
      if(!merged[mergeKey]){
        merged[mergeKey] = { ingrediente: it.ingrediente, qtas: [it.qta], note: it.isRecipe ? it.note : '', dept: it.dept, keys: [it.key], contexts: it.isRecipe ? [it.contextShort] : [] };
      } else {
        merged[mergeKey].qtas.push(it.qta);
        merged[mergeKey].keys.push(it.key);
        if(it.isRecipe && !merged[mergeKey].contexts.includes(it.contextShort)) merged[mergeKey].contexts.push(it.contextShort);
      }
    });
    const mergedList = Object.values(merged).map(it => ({ ...it, qta: combineQtyTexts(it.qtas) }));
    displayTotal = mergedList.length;
    displayDone = mergedList.filter(it=>isItemChecked(it.keys, it.ingrediente)).length;
    displayDoneShoppable = mergedList.filter(it=> it.dept !== 'finiti' && isItemChecked(it.keys, it.ingrediente)).length;

    const byDept = {};
    mergedList.forEach(it=>{
      if(!byDept[it.dept]) byDept[it.dept] = [];
      byDept[it.dept].push(it);
    });

    // Alfabetico per nome reparto: prima il cibo (con "Altro" in fondo), poi
    // i prodotti per la casa (col loro "Altro" in fondo), "Finiti" ultimo.
    const deptsPresent = DEPT_ORDER.filter(dept => byDept[dept] && byDept[dept].length);
    const byLabel = (a,b)=> IT_COLLATOR.compare(DEPT_LABEL[a], DEPT_LABEL[b]);
    const sortedDepts = deptsPresent.filter(d => d !== 'altro' && d !== 'finiti' && !isNonFoodDept(d)).sort(byLabel);
    if(deptsPresent.includes('altro')) sortedDepts.push('altro');
    sortedDepts.push(...deptsPresent.filter(d => d !== 'altro-casa' && isNonFoodDept(d)).sort(byLabel));
    if(deptsPresent.includes('altro-casa')) sortedDepts.push('altro-casa');
    if(deptsPresent.includes('finiti')) sortedDepts.push('finiti');
    hasFinitiThisView = deptsPresent.includes('finiti');

    body = sortedDepts.map(dept => {
      const isFinitiDept = dept === 'finiti';
      const items = byDept[dept];
      const finitiCheckedCount = isFinitiDept ? items.filter(it=>isItemChecked(it.keys, it.ingrediente)).length : 0;
      const rowsHtml = items.map(it=>itemRow(it.keys, it.ingrediente, it.qta, it.note, it.contexts.join(' + '))).join('');
      const finishedActions = finitiCheckedCount ? `
        <div class="finished-shop-actions">
          <button type="button" class="btn is-outline color-delete" data-finished-shop-delete>Elimina (${finitiCheckedCount})</button>
          <button type="button" class="btn is-solid" data-finished-shop-addlist>Segna da comprare (${finitiCheckedCount})</button>
        </div>` : '';
      if(isFinitiDept){
        return `
        <div class="dept-block finished-shop-group">
          <div class="dept-title finished-toggle${state.shopFinitiOpen ? ' open' : ''}" data-toggle-shop-finiti>
            <span class="dept-icon">${DEPT_ICON[dept]}</span>${DEPT_LABEL[dept]} (${items.length})
            <svg class="finished-chevron" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 256 256"><path fill="currentColor" d="m213.66 101.66l-80 80a8 8 0 0 1-11.32 0l-80-80a8 8 0 0 1 11.32-11.32L128 164.69l74.34-74.35a8 8 0 0 1 11.32 11.32"></path></svg>
          </div>
          <div class="accordion-body${state.shopFinitiOpen ? '' : ' is-collapsed'}">${rowsHtml}</div>
          ${finishedActions}
        </div>`;
      }
      const sectionId = `reparto_${dept}`;
      const isOpen = !state.shopSectionCollapsed[sectionId];
      return `
      <div class="shop-day-group">
        <div class="dept-title finished-toggle${isOpen ? ' open' : ''}" data-toggle-shop-section="${sectionId}">
          <span class="dept-icon">${DEPT_ICON[dept]}</span>${DEPT_LABEL[dept]}
          <svg class="finished-chevron" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 256 256"><path fill="currentColor" d="m213.66 101.66l-80 80a8 8 0 0 1-11.32 0l-80-80a8 8 0 0 1 11.32-11.32L128 164.69l74.34-74.35a8 8 0 0 1 11.32 11.32"></path></svg>
        </div>
        <div class="accordion-body${isOpen ? '' : ' is-collapsed'}">${rowsHtml}</div>
      </div>`;
    }).join('');
  } else {
    // I giorni già passati della settimana corrente restano fuori, come nel
    // Menù: non serve più fare la spesa per un pasto già cucinato.
    const todayPos = findTodayPos() ?? 0;
    // Principale e contorni dello stesso pasto possono chiedere lo stesso
    // ingrediente (sale, olio, pepe...): senza unire le occorrenze per
    // sezione-pasto come già fa "Per reparto" tra giorni diversi,
    // comparirebbero due righe identiche nella stessa sezione — spuntarne/
    // eliminarne una lascia l'altra lì, sembrando che la spunta "non elimini"
    // l'ingrediente. Accumulo qui le righe unite di ogni sezione per
    // ricalcolare i conteggi in cima coerenti con quello che si vede davvero
    // (stesso motivo del ricalcolo già fatto per "Per reparto" sotto).
    const giornoMergedAll = [];
    body = allPlannedShoppingMeals()
      .filter(({weekIdx, i}) => weekIdx !== 0 || WEEK_DISPLAY_ORDER.indexOf(i) >= todayPos)
      .map(({weekIdx,i,meal,giorno,dateLabel,dishLabel,principale,contorni})=>{
      const context = `${giorno} ${dateLabel} · ${MEAL_LABEL[meal]} · ${dishLabel}`;
      const dayItems = mainFlat.filter(it => it.context === context);
      const mergedDay = {};
      dayItems.forEach(it=>{
        const mergeKey = (it.ingrediente||'').trim().toLowerCase();
        if(!mergedDay[mergeKey]) mergedDay[mergeKey] = { ingrediente: it.ingrediente, qtas: [it.qta], note: it.note, dove: it.dove, keys: [it.key] };
        else { mergedDay[mergeKey].qtas.push(it.qta); mergedDay[mergeKey].keys.push(it.key); }
      });
      const mergedDayItems = Object.values(mergedDay).map(it => ({ ...it, qta: combineQtyTexts(it.qtas) }));
      giornoMergedAll.push(...mergedDayItems);
      // Vuota per due motivi ben diversi: la ricetta non ha ingredienti
      // salvati (va aperta dal Menù per aggiungerli) oppure ce li ha tutti,
      // sono solo già "in casa" e quindi filtrati altrove da buildShopFlat —
      // in quel caso è una buona notizia, non un dato mancante.
      const totalIngCount = getIngredientsFor(principale).length
        + contorni.reduce((n,c)=> n + getIngredientsFor(c).length, 0);
      const rows = mergedDayItems.length
        ? mergedDayItems.map(it=>itemRow(it.keys, it.ingrediente, it.qta, it.note, it.dove)).join('')
        : (totalIngCount > 0
          ? `<div class="ing-empty">✅ Hai tutti gli ingredienti, puoi cucinare!</div>`
          : `<div class="ing-empty">Nessun ingrediente salvato — aprilo dal Menù e aggiungili dalla scheda ricetta.</div>`);
      const sectionId = `giorno_${weekIdx}_${i}_${meal}`;
      const isOpen = !state.shopSectionCollapsed[sectionId];
      return `
      <div class="shop-day-group">
        <div class="shop-day-title finished-toggle${isOpen ? ' open' : ''}" data-toggle-shop-section="${sectionId}">
          <span class="font-weight-bold">${escapeHtml(giorno.slice(0,3))} ${escapeHtml(dateLabel.split(' ')[0])} · ${escapeHtml(MEAL_LABEL[meal])}</span> <span class="spesa-recipe">${escapeHtml(dishLabel)}</span>
          <svg class="finished-chevron" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 256 256"><path fill="currentColor" d="m213.66 101.66l-80 80a8 8 0 0 1-11.32 0l-80-80a8 8 0 0 1 11.32-11.32L128 164.69l74.34-74.35a8 8 0 0 1 11.32 11.32"></path></svg>
        </div>
        <div class="accordion-body${isOpen ? '' : ' is-collapsed'}">${rows}</div>
      </div>`;
    }).join('');
    const nonDayItems = mainFlat.filter(it => !it.isRecipe);
    displayTotal = giornoMergedAll.length + nonDayItems.length;
    displayDone = giornoMergedAll.filter(it=>isItemChecked(it.keys, it.ingrediente)).length
      + nonDayItems.filter(it=>isItemChecked([it.key], it.ingrediente)).length;
    displayDoneShoppable = giornoMergedAll.filter(it=>isItemChecked(it.keys, it.ingrediente)).length
      + nonDayItems.filter(it=> it.context !== 'Finiti in Dispensa' && isItemChecked([it.key], it.ingrediente)).length;
    const genContext = mainFlat.filter(it => it.context === 'Ogni settimana');
    if(genContext.length){
      const genOpen = !state.shopSectionCollapsed['giorno_ogni-settimana'];
      body += `
      <div class="shop-day-group">
        <div class="shop-day-title finished-toggle${genOpen ? ' open' : ''}" data-toggle-shop-section="giorno_ogni-settimana">
          Ogni settimana
          <svg class="finished-chevron" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 256 256"><path fill="currentColor" d="m213.66 101.66l-80 80a8 8 0 0 1-11.32 0l-80-80a8 8 0 0 1 11.32-11.32L128 164.69l74.34-74.35a8 8 0 0 1 11.32 11.32"></path></svg>
        </div>
        <div class="accordion-body${genOpen ? '' : ' is-collapsed'}">${genContext.map(it=>itemRow([it.key], it.ingrediente, it.qta)).join('')}</div>
      </div>`;
    }
    const extraContext = mainFlat.filter(it => it.context === 'Aggiunti a mano');
    if(extraContext.length){
      const extraOpen = !state.shopSectionCollapsed['giorno_aggiunti-a-mano'];
      body += `
      <div class="shop-day-group">
        <div class="shop-day-title finished-toggle${extraOpen ? ' open' : ''}" data-toggle-shop-section="giorno_aggiunti-a-mano">
          Aggiunti a mano
          <svg class="finished-chevron" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 256 256"><path fill="currentColor" d="m213.66 101.66l-80 80a8 8 0 0 1-11.32 0l-80-80a8 8 0 0 1 11.32-11.32L128 164.69l74.34-74.35a8 8 0 0 1 11.32 11.32"></path></svg>
        </div>
        <div class="accordion-body${extraOpen ? '' : ' is-collapsed'}">${extraContext.map(it=>itemRow([it.key], it.ingrediente, it.qta)).join('')}</div>
      </div>`;
    }
    // Chi è già stato segnato "da comprare" (vedi data-finished-shop-addlist)
    // esce da qui: lo si ritrova nella vista Per reparto, mescolato al suo
    // reparto vero — qui in Per giorno non ha un posto naturale dove stare.
    const oosContext = mainFlat.filter(it => it.context === 'Finiti in Dispensa' && !it.confirmed);
    hasFinitiThisView = oosContext.length > 0;
    if(oosContext.length){
      const oosCheckedCount = oosContext.filter(it => state.shopChecked[it.key]).length;
      body += `
      <div class="shop-day-group finished-shop-group">
        <div class="shop-day-title finished-toggle${state.shopFinitiOpen ? ' open' : ''}" data-toggle-shop-finiti>
          Finiti (${oosContext.length})
          <svg class="finished-chevron" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 256 256"><path fill="currentColor" d="m213.66 101.66l-80 80a8 8 0 0 1-11.32 0l-80-80a8 8 0 0 1 11.32-11.32L128 164.69l74.34-74.35a8 8 0 0 1 11.32 11.32"></path></svg>
        </div>
        <div class="accordion-body${state.shopFinitiOpen ? '' : ' is-collapsed'}">${oosContext.map(it=>itemRow([it.key], it.ingrediente, it.qta)).join('')}</div>
        ${oosCheckedCount ? `
        <div class="finished-shop-actions">
          <button type="button" class="btn is-outline color-delete" data-finished-shop-delete>Elimina (${oosCheckedCount})</button>
          <button type="button" class="btn is-solid" data-finished-shop-addlist>Segna da comprare (${oosCheckedCount})</button>
        </div>` : ''}
      </div>`;
    }
  }

  const missingDays = allPlannedShoppingMeals()
    .flatMap(({giorno,dateLabel,principale,contorni})=> [principale, ...contorni].map(nome=>({giorno, dateLabel, nome})))
    .filter(d => !(getIngredientsFor(d.nome) && getIngredientsFor(d.nome).length));
  const missingBanner = missingDays.length ? `
    <div class="missing-ing-banner">
      ⚠️ Ingredienti non ancora salvati per: ${missingDays.map(d=>`${escapeHtml(d.giorno)} ${escapeHtml(d.dateLabel)} (${escapeHtml(d.nome)})`).join(', ')}. Aprili dal Menù per aggiungerli.
    </div>` : '';

  const addIngQuery = (state.addIngName || '').trim().toLowerCase();
  const addIngSuggestions = (addIngQuery && state.addIngSuggestOpen)
    ? allKnownIngredientNames().filter(n => n.toLowerCase().includes(addIngQuery)).slice(0, 8)
    : [];
  // Se il nome scritto coincide con una voce già in Dispensa, l'unità è già
  // nota (es. "Latte" in ml): la propongo di default invece di farla
  // reinventare da capo. Se è nuovo, resta comunque scegliebile dal menu.
  const matchedPantryUnit = (state.pantryItems[addIngQuery] && state.pantryItems[addIngQuery].unit) || '';
  const matchedPantryCat = (state.pantryItems[addIngQuery] && state.pantryItems[addIngQuery].cat) || '';
  // Ingrediente che non è ancora in Dispensa: come in "Aggiungi ingrediente"
  // di Dispensa si sceglie anche gruppo e luogo, e la voce entra subito
  // nell'anagrafica ingredienti (vedi "Aggiungi" in attachHandlers).
  const addIngIsNew = !!addIngQuery && !state.pantryItems[addIngQuery];
  const addIngDraft = state.addIngDraft || {};
  const addIngQta = addIngDraft.qta !== undefined ? addIngDraft.qta : (matchedPantryUnit ? '1' : '');
  const addIngUnit = addIngDraft.unit !== undefined ? addIngDraft.unit : matchedPantryUnit;
  const addIngCat = addIngDraft.cat !== undefined ? addIngDraft.cat : matchedPantryCat;
  const addIngModal = state.addIngModalOpen ? `
    <div class="filters-modal-backdrop" data-close-add-ing-modal>
      <div class="filters-modal" data-stop-close>
        <div class="filters-modal-header">
          <h3>Aggiungi ingrediente</h3>
          <button class="btn is-icon filters-close-btn" data-close-add-ing-modal>✕</button>
        </div>
        <div class="filter-groups">
          <div class="filter-group">
            <div class="filter-group-label">Ingrediente</div>
            <div class="add-ing-combo">
              <input type="text" id="shop-add-name" placeholder="Es. Carta forno" value="${escapeAttr(state.addIngName || '')}" autocomplete="off">
              ${addIngSuggestions.length ? `
              <div class="add-ing-suggestions">
                ${addIngSuggestions.map(n=>`<button type="button" class="add-ing-suggestion" data-pick-ing-suggestion="${escapeAttr(n)}">${escapeHtml(n)}</button>`).join('')}
              </div>` : ''}
            </div>
          </div>
          <div class="filter-group">
            <div class="filter-group-label">Quantità</div>
            <div class="pantry-group-row">
              <input type="text" id="shop-add-qta" placeholder="Es. 1 o 1 rotolo" value="${escapeAttr(addIngQta)}">
              <select id="shop-add-unit" title="Unità (si aggiunge da sola al numero, non serve scriverla)">
                ${UNIT_ORDER.filter(u=>u!=='none').map(u=>`<option value="${u}" ${addIngUnit===u?'selected':''}>${escapeHtml(UNIT_LABEL[u])}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="filter-group">
            <div class="filter-group-label">Categoria (reparto in "Per reparto")</div>
            <select id="shop-add-cat">
              <option value="">Automatica (${escapeHtml(DEPT_LABEL[classifyDept(state.addIngName || '')])})</option>
              ${deptOptionsHtml(addIngCat)}
            </select>
          </div>
          ${addIngIsNew ? `
          <div class="filter-group">
            <div class="filter-group-label">Gruppo (es. un formato di pasta)</div>
            <select id="shop-add-group">
              <option value="">Nessuno</option>
              ${Object.entries(state.pantryGroups).map(([id,g])=>`<option value="${id}" ${addIngDraft.group===id?'selected':''}>${escapeHtml(g.label)}</option>`).join('')}
            </select>
          </div>
          <div class="filter-group">
            <div class="filter-group-label">Luogo (dove va in Dispensa quando lo compri)</div>
            <select id="shop-add-luogo">
              ${LUOGO_ORDER.map(l=>`<option value="${l}" ${addIngDraft.luogo===l?'selected':''}>${LUOGO_ICON[l]} ${LUOGO_LABEL[l]}</option>`).join('')}
            </select>
          </div>` : ''}
        </div>
        <div class="filters-modal-footer">
          <button class="btn is-solid mini-add-btn" id="shop-add-btn" type="button">Aggiungi</button>
        </div>
      </div>
    </div>` : '';
/*           <button class="btn is-ghost reset-btn" data-close-add-ing-modal>Annulla</button>
 */
  return `
    <p class="section-sub">Si aggiorna in automatico in base al menù attuale — quello che hai già in Dispensa non compare qui</p>
    ${missingBanner}
    <div class="view-toggle">
      <button class="view-btn ${state.shopView==='reparto'?'active':''}" data-shop-view="reparto">Per reparto</button>
      <button class="view-btn ${state.shopView!=='reparto'?'active':''}" data-shop-view="giorno">Per giorno</button>
    </div>
    <div class="shop-checks">
    <div class="shop-progress">${displayDone} / ${displayTotal} presi</div>
    </div>
    ${body}
          
    <div class="shop-top-actions">
      <button class="btn is-outline ${state.shopMode ? 'active' : ''}" id="shop-mode-toggle" type="button" title="Se attiva, spuntare una riga la sposta subito in Dispensa"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--tabler" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M4 19a2 2 0 1 0 4 0a2 2 0 1 0-4 0m11 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0"></path><path d="M17 17H6V3H4"></path><path d="m6 5l14 1l-1 7H6"></path></g></svg> Modalità spesa${state.shopMode ? ': ON' : ''}</button>

 ${displayDoneShoppable ? `
  <div class="buttons-fixed is-checked">
      <button class="btn is-outline color-delete" id="delete-checked-shop"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 256 256"><path fill="currentColor" d="M216 48h-40v-8a24 24 0 0 0-24-24h-48a24 24 0 0 0-24 24v8H40a8 8 0 0 0 0 16h8v144a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V64h8a8 8 0 0 0 0-16M96 40a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8v8H96Zm96 168H64V64h128Zm-80-104v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0m48 0v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0"></path></svg> Elimina</button>
      <button class="btn is-outline is-empty" id="reset-shop"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M100 40a12 12 0 0 1 12-12h32a12 12 0 0 1 0 24h-32a12 12 0 0 1-12-12m44 164h-32a12 12 0 0 0 0 24h32a12 12 0 0 0 0-24m64-176h-24a12 12 0 0 0 0 24h20v20a12 12 0 0 0 24 0V48a20 20 0 0 0-20-20m8 72a12 12 0 0 0-12 12v32a12 12 0 0 0 24 0v-32a12 12 0 0 0-12-12m0 72a12 12 0 0 0-12 12v20h-20a12 12 0 0 0 0 24h24a20 20 0 0 0 20-20v-24a12 12 0 0 0-12-12M40 156a12 12 0 0 0 12-12v-32a12 12 0 0 0-24 0v32a12 12 0 0 0 12 12m32 48H52v-20a12 12 0 0 0-24 0v24a20 20 0 0 0 20 20h24a12 12 0 0 0 0-24M40 84a12 12 0 0 0 12-12V52h20a12 12 0 0 0 0-24H48a20 20 0 0 0-20 20v24a12 12 0 0 0 12 12m40-16h96a12 12 0 0 1 12 12v96a12 12 0 0 1-12 12H80a12 12 0 0 1-12-12V80a12 12 0 0 1 12-12m12 96h72V92H92Z"></path></svg> Svuota</button>
      <button class="btn is-solid is-total" id="move-checked-to-pantry"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M220 151.67V216a12 12 0 0 1-12 12H48a12 12 0 0 1-12-12v-64.33a12 12 0 1 1 24 0v52.23h136v-52.23a12 12 0 1 1 24 0M88 183.81h80a12.06 12.06 0 0 0 0-24.11H88a12.06 12.06 0 0 0 0 24.11M96.2 113l75.17 27.49a12.05 12.05 0 0 0 8.21-22.66l-75.17-27.48A12 12 0 0 0 96.2 113M128 49.29l61.29 51.64a12 12 0 0 0 16.9-1.48a12.09 12.09 0 0 0-1.48-17l-61.27-51.63a12 12 0 0 0-16.91 1.49A12.1 12.1 0 0 0 128 49.29"></path></svg> ${displayDoneShoppable}</button>
    </div>
    ` : ''}
    </div>
    
  ${addIngModal}
    <div class="buttons-fixed">
      ${total ? `<button type="button" class="btn is-fixed is-secondary" id="shop-toggle-all-sections">${(Object.entries(state.shopSectionCollapsed).some(([id,val]) => val && id.startsWith(state.shopView === 'reparto' ? 'reparto_' : 'giorno_')) || (hasFinitiThisView && !state.shopFinitiOpen)) ? '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--iconoir" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m17 8l-5-5l-5 5m10 8l-5 5l-5-5"></path></svg>' : '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--iconoir" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m17 4l-5 5l-5-5m10 16l-5-5l-5 5"></path></svg>'}</button>` : ''}
      <button class="btn is-fixed" id="spesa-fab" type="button" aria-label="Aggiungi ingrediente"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M228 128a12 12 0 0 1-12 12h-76v76a12 12 0 0 1-24 0v-76H40a12 12 0 0 1 0-24h76V40a12 12 0 0 1 24 0v76h76a12 12 0 0 1 12 12"></path></svg></button>
        ${displayDoneShoppable ? `

    ` : ''}

    </div>
  `;
}


// Dettaglio ricetta della tab Ricette, a tutto schermo come nel Menù (stesse
// classi CSS .meal-detail-*, riusate senza aggiungerne di nuove) invece che
// ad accordion inline dentro la card.
function renderRecipeDetailScreen(name){
  const r = getRecipeMeta(name);
  if(!r) return '';
  const det = getRecipeDetails(name);
  const ing = getIngredientsFor(name);
  const tagsHtml = `
    <div class="detail-tags">
      <span class="tag season">${r.stagioni.map(s=>escapeHtml(STAGIONE_LABEL[s])).join(', ')}</span>
      ${(r.freezerNew && r.freezerNew !== 'non-adatta') ? `<span class="tag freezer">${FREEZER_LABEL[r.freezerNew]}</span>` : ''}
      <span class="tag"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--tabler" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="m13.62 8.382l1.966-1.967A2 2 0 1 1 19 5a2 2 0 1 1-1.413 3.414l-1.82 1.821m-9.863 8.361c2.733 2.734 5.9 4 7.07 2.829c1.172-1.172-.094-4.338-2.828-7.071c-2.733-2.734-5.9-4-7.07-2.829c-1.172 1.172.094 4.338 2.828 7.071M7.5 16l1 1"></path><path d="M12.975 21.425c3.905-3.906 4.855-9.288 2.121-12.021c-2.733-2.734-8.115-1.784-12.02 2.121"></path></g></svg> ${escapeHtml(AVANZI_LABEL[r.avanziNew])}</span>
      ${r.pianificazione!=='nessuna' ? `<span class="tag"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M208 32h-24v-8a8 8 0 0 0-16 0v8H88v-8a8 8 0 0 0-16 0v8H48a16 16 0 0 0-16 16v160a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16M72 48v8a8 8 0 0 0 16 0v-8h80v8a8 8 0 0 0 16 0v-8h24v32H48V48Zm136 160H48V96h160zm-96-88v64a8 8 0 0 1-16 0v-51.06l-4.42 2.22a8 8 0 0 1-7.16-14.32l16-8A8 8 0 0 1 112 120m59.16 30.45L152 176h16a8 8 0 0 1 0 16h-32a8 8 0 0 1-6.4-12.8l28.78-38.37a8 8 0 1 0-13.31-8.83a8 8 0 1 1-13.85-8A24 24 0 0 1 176 136a23.76 23.76 0 0 1-4.84 14.45"></path></svg> ${escapeHtml(PIAN_LABEL[r.pianificazione])}</span>` : ''}
    </div>`;
  const ingHtml = renderIngredientsSection(ing);
  const stepsHtml = det && det.procedimento && det.procedimento.length
    ? `<div class="detail-section"><div class="detail-section-title"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--tabler" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3c1.918 0 3.52 1.35 3.91 3.151A4 4 0 0 1 18 13.874V21H6v-7.126a4 4 0 1 1 2.092-7.723A4 4 0 0 1 12 3M6.161 17.009L18 17"></path></svg> Procedimento</div><ol class="steps-list">${det.procedimento.map(s=>`<li>${escapeHtml(s)}</li>`).join('')}</ol></div>`
    : '';
  const noteExtra = det ? [
      det.porzioni ? `<b>Porzioni:</b> ${escapeHtml(det.porzioni)}` : '',
      det.ricordare ? `<b>Da ricordare:</b> ${escapeHtml(det.ricordare)}` : '',
      det.avanzi ? `<b>Avanzi:</b> ${escapeHtml(det.avanzi)}` : '',
      det.freezer ? `<b>Freezer:</b> ${escapeHtml(det.freezer)}` : ''
    ].filter(Boolean).map(l=>`<div class="detail-extra-note">${l}</div>`).join('') : '';
  const noteBox = noteExtra ? `<div class="detail-section note-box"><div class="detail-section-title"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M88 96a8 8 0 0 1 8-8h64a8 8 0 0 1 0 16H96a8 8 0 0 1-8-8m8 40h64a8 8 0 0 0 0-16H96a8 8 0 0 0 0 16m32 16H96a8 8 0 0 0 0 16h32a8 8 0 0 0 0-16m96-104v108.69a15.86 15.86 0 0 1-4.69 11.31L168 219.31a15.86 15.86 0 0 1-11.31 4.69H48a16 16 0 0 1-16-16V48a16 16 0 0 1 16-16h160a16 16 0 0 1 16 16M48 208h104v-48a8 8 0 0 1 8-8h48V48H48Zm120-40v28.7l28.69-28.7Z"></path></svg> Note</div>${noteExtra}</div>` : '';
  const linkHtml = sourceLinkHtml(det);
  const addFormHtml = det ? '' : `
    <div class="add-ing-form">
      <input type="text" placeholder="Ingrediente" data-rning="${escapeAttr(name)}">
      <input type="text" placeholder="Quantità" data-rnqta="${escapeAttr(name)}">
      <button class="btn is-solid" data-add-ing-recipe="${escapeAttr(name)}">+ aggiungi ingrediente</button>
    </div>`;
  const editRecipeBtn = `<button class="btn is-chip" data-open-recipe-edit="${escapeAttr(name)}"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="m230.14 70.54l-44.68-44.69a20 20 0 0 0-28.29 0L33.86 149.17A19.85 19.85 0 0 0 28 163.31V208a20 20 0 0 0 20 20h44.69a19.86 19.86 0 0 0 14.14-5.86L230.14 98.82a20 20 0 0 0 0-28.28M91 204H52v-39l84-84l39 39Zm101-101l-39-39l18.34-18.34l39 39Z"></path></svg> Modifica ricetta</button>`;
  return `
  <div class="meal-detail-screen">
  <div class="filters-modal">
    <div class="meal-detail-header">
      <div class="meal-detail-header-text">
        <div class="meal-detail-kicker">Ricetta</div>
        <div class="meal-detail-title">${escapeHtml(name)}</div>
      </div>
      <button type="button" class="btn is-icon meal-detail-close" data-toggle-recipe="${escapeAttr(name)}" aria-label="Chiudi">✕</button>
    </div>
    <div class="meal-detail-body">
      <div class="detail-box">
        ${tagsHtml}
        ${ingHtml}
        ${stepsHtml}
        ${noteBox}
        ${addFormHtml}
        <div class="button-wrapper">${editRecipeBtn}${linkHtml}</div>
      </div>
    </div>
  </div>
  </div>`;
}

function renderPrep(){
  let list = allRecipeMetas().filter(r=>{
    if(state.filters.cat.length && !state.filters.cat.includes(r.categoriaNew)) return false;
    if(state.filters.tipo.length && !state.filters.tipo.includes(r.tipologia)) return false;
    if(state.filters.tempo && r.tempoBucket !== state.filters.tempo) return false;
    if(state.filters.pian && r.pianificazione !== state.filters.pian) return false;
    if(state.filters.stagione && !(r.stagioni.includes(state.filters.stagione) || r.stagioni.includes('tutto'))) return false;
    if(state.filters.avanzi && r.avanziNew !== state.filters.avanzi) return false;
    if(state.filters.freezer && r.freezerNew !== state.filters.freezer) return false;
    if(state.filters.grad && r.gradimento !== state.filters.grad) return false;
    if(state.filters.attrezz && !r.attrezzatura.includes(state.filters.attrezz)) return false;
    if(state.filters.search && !r.nome.toLowerCase().includes(state.filters.search.toLowerCase())) return false;
    return true;
  });
  // In ordine alfabetico per nome (prima seguivano l'ordine del catalogo,
  // con le ricette create a mano in fondo).
  list.sort((a,b)=> IT_COLLATOR_BASE.compare(a.nome, b.nome));
  // Il dettaglio non è più un accordion inline (vedi renderRecipeDetailScreen
  // sopra, a tutto schermo come nel Menù): la card resta sempre nella sua
  // forma compatta, tap ovunque su di essa (data-toggle-recipe è
  // sull'intero .recipe-card, non solo sul titolo).
  const cards = list.map(r=>{
    const det = getRecipeDetails(r.nome);
    return `
    <div class="recipe-card" data-toggle-recipe="${escapeAttr(r.nome)}">
      <div class="recipe-row">
        <div>
          <div class="recipe-title">${escapeHtml(r.nome)}${det ? ' <span class="full-badge" title="Ricetta completa con procedimento"></span>' : ''}</div>
          <span class="day-time">${escapeHtml(r.tempo)}</span>
        </div>
        <div class="day-row-side">
          <span class="cat-icon" title="${escapeAttr(CAT_LABEL[r.categoriaNew])}">${catIcon(r.categoriaNew)}</span>
        </div>
      </div>
    </div>`;
  }).join('');

  function selectHtml(id, label, order, labelMap, current){
    return `<select id="${id}"><option value="">${label}</option>${order.map(v=>`<option value="${v}" ${current===v?'selected':''}>${escapeHtml(stripHtml(labelMap[v]))}</option>`).join('')}</select>`;
  }

  const activeCount = ['tempo','pian','stagione','avanzi','freezer','grad','attrezz'].filter(k=>state.filters[k]).length + (state.filters.cat.length ? 1 : 0) + (state.filters.tipo.length ? 1 : 0);

  const filtersModal = state.filtersOpen ? `
    <div class="filters-modal-backdrop" data-close-filters>
      <div class="filters-modal" data-stop-close>
        <div class="filters-modal-header">
          <h3>Filtri</h3>
          <button class="btn is-icon filters-close-btn" data-close-filters>✕</button>
        </div>
        <div class="filter-groups">
          <div class="filter-group">
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--bx" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M12 10h-2V3H8v7H6V3H4v8c0 1.654 1.346 3 3 3h1v7h2v-7h1c1.654 0 3-1.346 3-3V3h-2zm7-7h-1c-1.159 0-2 1.262-2 3v8h2v7h2V4a1 1 0 0 0-1-1"></path></svg> Categoria</div>
            <div class="chip-row">
              <button class="btn is-filter ${!state.filters.cat.length?'active':''}" data-cat-clear>Tutte</button>
              ${CAT_ORDER.map(c=>`<button class="btn is-filter ${state.filters.cat.includes(c)?'active':''}" data-cat-chip="${c}">${catIcon(c)} ${escapeHtml(CAT_LABEL[c])}</button>`).join('')}
            </div>
          </div>
          <div class="filter-group">
            <div class="filter-group-label">🍽️ Tipologia</div>
            <div class="chip-row">
              <button class="btn is-filter ${!state.filters.tipo.length?'active':''}" data-tipo-clear>Tutte</button>
              ${TIPO_ORDER.map(t=>`<button class="btn is-filter ${state.filters.tipo.includes(t)?'active':''}" data-tipo-chip="${t}">${tipoIcon(t)} ${escapeHtml(TIPO_LABEL[t])}</button>`).join('')}
            </div>
          </div>
          <div class="filter-group">
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M128 20a108 108 0 1 0 108 108A108.12 108.12 0 0 0 128 20m0 192a84 84 0 1 1 84-84a84.09 84.09 0 0 1-84 84m68-84a12 12 0 0 1-12 12h-56a12 12 0 0 1-12-12V72a12 12 0 0 1 24 0v44h44a12 12 0 0 1 12 12"></path></svg> Tempo</div>
            ${selectHtml('f-tempo', 'Tutti i tempi', TEMPO_ORDER, TEMPO_LABEL, state.filters.tempo)}
          </div>
          <div class="filter-group">
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M208 32h-24v-8a8 8 0 0 0-16 0v8H88v-8a8 8 0 0 0-16 0v8H48a16 16 0 0 0-16 16v160a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16M72 48v8a8 8 0 0 0 16 0v-8h80v8a8 8 0 0 0 16 0v-8h24v32H48V48Zm136 160H48V96h160zm-96-88v64a8 8 0 0 1-16 0v-51.06l-4.42 2.22a8 8 0 0 1-7.16-14.32l16-8A8 8 0 0 1 112 120m59.16 30.45L152 176h16a8 8 0 0 1 0 16h-32a8 8 0 0 1-6.4-12.8l28.78-38.37a8 8 0 1 0-13.31-8.83a8 8 0 1 1-13.85-8A24 24 0 0 1 176 136a23.76 23.76 0 0 1-4.84 14.45"></path></svg> Pianificazione</div>
            ${selectHtml('f-pian', 'Qualsiasi', PIAN_ORDER, PIAN_LABEL, state.filters.pian)}
          </div>
          <div class="filter-group">
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ic" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5c0-2.64-2.05-4.78-4.65-4.96M19 18H6c-2.21 0-4-1.79-4-4s1.79-4 4-4h.71C7.37 7.69 9.48 6 12 6c3.04 0 5.5 2.46 5.5 5.5v.5H19c1.66 0 3 1.34 3 3s-1.34 3-3 3"></path></svg> Stagione</div>
            ${selectHtml('f-stagione', 'Tutte le stagioni', STAGIONE_ORDER, STAGIONE_LABEL, state.filters.stagione)}
          </div>
          <div class="filter-group">
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--tabler" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="m13.62 8.382l1.966-1.967A2 2 0 1 1 19 5a2 2 0 1 1-1.413 3.414l-1.82 1.821m-9.863 8.361c2.733 2.734 5.9 4 7.07 2.829c1.172-1.172-.094-4.338-2.828-7.071c-2.733-2.734-5.9-4-7.07-2.829c-1.172 1.172.094 4.338 2.828 7.071M7.5 16l1 1"></path><path d="M12.975 21.425c3.905-3.906 4.855-9.288 2.121-12.021c-2.733-2.734-8.115-1.784-12.02 2.121"></path></g></svg> Avanzi</div>
            ${selectHtml('f-avanzi', 'Qualsiasi', AVANZI_ORDER, AVANZI_LABEL, state.filters.avanzi)}
          </div>
          <div class="filter-group">
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M227.65 149.14a12 12 0 0 1-8.79 14.51l-20.67 5.08l5.4 20.16a12 12 0 0 1-23.18 6.22l-7.29-27.2L140 148.78V187l20.48 20.48a12 12 0 0 1-17 17L128 209l-15.51 15.52a12 12 0 0 1-17-17L116 187v-38.22l-33.12 19.13l-7.29 27.2a12 12 0 0 1-23.18-6.22l5.4-20.16l-20.67-5.08a12 12 0 1 1 5.72-23.3l27.89 6.85L104 128l-33.25-19.2l-27.89 6.85A11.8 11.8 0 0 1 40 116a12 12 0 0 1-2.85-23.65l20.67-5.08l-5.4-20.16a12 12 0 0 1 23.18-6.22l7.29 27.2L116 107.21V69L95.52 48.48a12 12 0 0 1 17-17L128 47l15.51-15.52a12 12 0 1 1 17 17L140 69v38.24l33.12-19.12l7.29-27.2a12 12 0 0 1 23.18 6.22l-5.4 20.16l20.67 5.08A12 12 0 0 1 216 116a11.8 11.8 0 0 1-2.87-.35l-27.89-6.85L152 128l33.25 19.2l27.89-6.85a12 12 0 0 1 14.51 8.79"></path></svg> Freezer</div>
            ${selectHtml('f-freezer', 'Qualsiasi', FREEZER_ORDER, FREEZER_LABEL, state.filters.freezer)}
          </div>
          <div class="filter-group">
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M178 36c-20.09 0-37.92 7.93-50 21.56C115.92 43.93 98.09 36 78 36a66.08 66.08 0 0 0-66 66c0 72.34 105.81 130.14 110.31 132.57a12 12 0 0 0 11.38 0C138.19 232.14 244 174.34 244 102a66.08 66.08 0 0 0-66-66m-5.49 142.36a328.7 328.7 0 0 1-44.51 31.8a328.7 328.7 0 0 1-44.51-31.8C61.82 159.77 36 131.42 36 102a42 42 0 0 1 42-42c17.8 0 32.7 9.4 38.89 24.54a12 12 0 0 0 22.22 0C145.3 69.4 160.2 60 178 60a42 42 0 0 1 42 42c0 29.42-25.82 57.77-47.49 76.36"></path></svg> Gradimento</div>
            ${selectHtml('f-grad', 'Qualsiasi', GRAD_ORDER, GRAD_LABEL, state.filters.grad)}
          </div>
          <div class="filter-group">
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M177.62 159.6a52 52 0 0 1-34 34a12.2 12.2 0 0 1-3.6.55a12 12 0 0 1-3.6-23.45a28 28 0 0 0 18.32-18.32a12 12 0 0 1 22.9 7.2ZM220 144a92 92 0 0 1-184 0c0-28.81 11.27-58.18 33.48-87.28a12 12 0 0 1 17.9-1.33l19.69 19.11L127 19.89a12 12 0 0 1 18.94-5.12C168.2 33.25 220 82.85 220 144m-24 0c0-41.71-30.61-78.39-52.52-99.29l-20.21 55.4a12 12 0 0 1-19.63 4.5L80.71 82.36C67 103.38 60 124.06 60 144a68 68 0 0 0 136 0"></path></svg> Cottura / attrezzatura</div>
            ${selectHtml('f-attrezz', 'Qualsiasi', ATTREZZ_ORDER, ATTREZZ_LABEL, state.filters.attrezz)}
          </div>
        </div>
        <div class="filters-modal-footer">
          <button class="btn is-ghost reset-btn" id="clear-filters">Cancella filtri</button>
          <button class="btn is-solid mini-add-btn" data-close-filters>Applica</button>
        </div>
      </div>
    </div>` : '';

  const totalCount = DATA.recipes.length + Object.keys(state.customRecipes).length;

  const newRecipeModal = state.newRecipeModalOpen ? `
    <div class="filters-modal-backdrop" data-close-new-recipe-modal>
      <div class="filters-modal" data-stop-close>
        <div class="filters-modal-header">
          <h3>Nuova ricetta</h3>
          <button class="btn is-icon filters-close-btn" data-close-new-recipe-modal>✕</button>
        </div>
        <div class="filter-groups">
          <div class="filter-group">
            <div class="filter-group-label">Nome</div>
            <input type="text" id="new-recipe-name" placeholder="Es. Pasta al pesto">
          </div>
        </div>
        ${state.newRecipeError ? `<p class="section-sub" style="color:var(--tomato); margin-top:-8px;">${escapeHtml(state.newRecipeError)}</p>` : ''}
        <div class="filters-modal-footer">
          <button class="btn is-solid mini-add-btn" id="new-recipe-create-btn" type="button">Crea</button>
        </div>
      </div>
    </div>` : '';
/*           <button class="btn is-ghost reset-btn" data-close-new-recipe-modal>Annulla</button>
 */
  const recipeDetailScreen = state.expandedRecipe ? renderRecipeDetailScreen(state.expandedRecipe) : '';

  return `
    <p class="section-sub">${totalCount} ricette — tocca una ricetta per vedere gli ingredienti</p>


    ${filtersModal}
    <div class="shop-checks"><div class="shop-progress">${list.length} ricette trovate</div></div>
    <div class="accordion-body">${cards || '<p style="color:var(--sage);font-size:13px;">Nessuna ricetta corrisponde ai filtri.</p>'}</div>
    ${renderRecipeEditModal()}
    ${newRecipeModal}
    ${recipeDetailScreen}
    <div class="buttons-fixed">
      ${state.prepSearchOpen ? `
              <div class="search_wrapper">
              <div class="input_wrapper">
                <input class="input-search" type="search" id="f-search" placeholder="Cerca ricetta…" value="${escapeAttr(state.filters.search)}">
                <button class="btn is-filters" data-open-filters><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M10 18h4v-2h-4zM3 6v2h18V6zm3 7h12v-2H6z"></path></svg>Filtri${activeCount ? ` (${activeCount})` : ''}</button>
              </div>
      <button type="button" class="btn is-fixed" id="prep-search-close" aria-label="${state.filters.search ? 'Cancella ricerca' : 'Chiudi ricerca'}">✕</button>
      </div>
      ` : `<button type="button" class="btn is-fixed${state.filters.search ? ' active' : ''}" id="prep-search-toggle" aria-label="Cerca ricetta">${SEARCH_ICON_SVG}${state.filters.search ? ' Cerca' : ''}</button>
      <button class="btn is-fixed" id="prep-fab" type="button" aria-label="Aggiungi ricetta"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M228 128a12 12 0 0 1-12 12h-76v76a12 12 0 0 1-24 0v-76H40a12 12 0 0 1 0-24h76V40a12 12 0 0 1 24 0v76h76a12 12 0 0 1 12 12"></path></svg></button>`}
    </div>
  `;
}

function renderDispensa(){
  // Un'unica lista per dispensa/ripostiglio/frigo/freezer, distinti solo
  // dall'icona del luogo (si cambia toccandola). Si riempie da sola quando
  // si spunta un articolo in Spesa, e si modifica liberamente a mano. Una
  // voce senza quantità (0) non compare: la quantità è un contatore che si
  // vede solo una volta impostato.
  const searchTerm = state.pantrySearch.trim().toLowerCase();
  const items = Object.entries(state.pantryItems)
    .map(([key, it])=>({ key, nome: it.nome, qty: it.qty, unit: it.unit || '', luogo: it.luogo || 'dispensa', cat: it.cat }))
    .filter(it => typeof it.qty === 'number' && it.qty > 0)
    .filter(it => !searchTerm || it.nome.toLowerCase().includes(searchTerm));

  function itemRow(it){
    const editing = state.pantryEditingKey === it.key;
    const step = qtyStepFor(it.unit);
    // Selezione multipla: tieni premuto sulla riga per entrare in modalità
    // selezione (l'icona del luogo diventa un segno di spunta), poi basta un
    // tap sulle altre righe — nessuna checkbox separata da imparare. L'icona
    // del luogo resta sempre un tap = cambia luogo, anche in modalità selezione.
    const isSelected = !!state.pantrySelected[it.key];
    const luogoIconContent = isSelected
      ? '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--fe" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="m6 10l-2 2l6 6L20 8l-2-2l-8 8z"></path></svg>'
      : LUOGO_ICON[it.luogo];
    return `
    <div class="inv-item" data-pantry-row="${escapeAttr(it.key)}">
      <button class="btn is-icon luogo-picker-opt is-selected${isSelected ? ' picking' : ''}" data-luogo-value="${escapeAttr(LUOGO_LABEL[it.luogo])}" data-luogo-toggle="${escapeAttr(it.key)}" type="button" title="Luogo: ${escapeAttr(LUOGO_LABEL[it.luogo])} — tocca per scegliere">${luogoIconContent}</button>
      ${state.pantryLuogoPicker === it.key ? `
      <div class="luogo-picker-backdrop" data-luogo-picker-close></div>
      <div class="luogo-picker">
        ${LUOGO_ORDER.map(l=>`<button type="button" class="btn is-icon luogo-picker-opt${l===it.luogo?' active':''}" data-luogo-set="${escapeAttr(it.key)}" data-luogo-value="${l}" title="${escapeAttr(LUOGO_LABEL[l])}">${LUOGO_ICON[l]}</button>`).join('')}
      </div>` : ''}
      <button class="btn is-text inv-name" data-pantry-edit="${escapeAttr(it.key)}" type="button">${escapeHtml(it.nome)}</button>
      ${it.unit === 'none'
        ? `<label class="presence-toggle"><input type="checkbox" ${it.qty > 0 ? 'checked' : ''} data-presence-toggle="${escapeAttr(it.key)}"></label>`
        : `<span class="qty-stepper">
        <button class="qty-btn" type="button" data-qty-dec="${escapeAttr(it.key)}" aria-label="Diminuisci">−</button>
        ${editing
          ? `<input type="number" min="0" step="${step}" class="qty-input" value="${it.qty}" data-qty-edit="${escapeAttr(it.key)}">${it.unit ? `<span class="qty-unit">${escapeHtml(it.unit)}</span>` : ''}`
          : `<span class="qty-num${it.qty <= 1 ? ' low' : ''}" data-qty-show="${escapeAttr(it.key)}">${it.qty}${it.unit ? ' ' + escapeHtml(it.unit) : ''}</span>`}
      </span>`}
    </div>
    `;
  }
/*       <button class="btn-remove" data-inv-remove="${escapeAttr(it.key)}" type="button" aria-label="Elimina ${escapeAttr(it.nome)}"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 256 256"><path fill="currentColor" d="M216 48h-40v-8a24 24 0 0 0-24-24h-48a24 24 0 0 0-24 24v8H40a8 8 0 0 0 0 16h8v144a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V64h8a8 8 0 0 0 0-16M96 40a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8v8H96Zm96 168H64V64h128Zm-80-104v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0m48 0v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0"></path></svg></button>
 */
  let body;
  if(!items.length){
    body = searchTerm
      ? `<p class="ing-empty">Nessun ingrediente trovato per "${escapeHtml(state.pantrySearch.trim())}".</p>`
      : `<p class="ing-empty">Vuota per ora — spunta qualcosa in Spesa o tocca il + per aggiungere un ingrediente.</p>`;
  } else {
    // Vista Cibo o Casa: stesse sezioni per categoria, solo le categorie di
    // quel tipo (vedi isNonFoodDept). Il luogo resta su ogni voce (icona a
    // sinistra), non è più una vista a sé.
    const wantNonFood = state.pantryView === 'casa';
    const byDept = {};
    items.forEach(it=>{ const d = knownDept(it.cat) || classifyDept(it.nome); (byDept[d] = byDept[d] || []).push(it); });
    const depts = DEPT_ORDER.filter(d=>byDept[d] && byDept[d].length && isNonFoodDept(d) === wantNonFood);
    body = !depts.length
      ? `<p class="ing-empty">${searchTerm ? `Nessun prodotto trovato per "${escapeHtml(state.pantrySearch.trim())}" in ${wantNonFood ? 'Casa' : 'Cibo'}.` : (wantNonFood ? 'Nessun prodotto per la casa, per ora — tocca il + per aggiungerne uno (detersivi, igiene, carta forno...).' : 'Nessun alimento, per ora.')}</p>`
      : depts.map(d=>{
      const sectionId = `cat_${d}`;
      const isOpen = !state.pantrySectionCollapsed[sectionId];
      return `
      <div class="shop-day-group">
        <div class="dept-title finished-toggle${isOpen ? ' open' : ''}" data-toggle-pantry-section="${sectionId}">
          <span class="dept-icon">${DEPT_ICON[d]}</span>${DEPT_LABEL[d]}
          <svg class="finished-chevron" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 256 256"><path fill="currentColor" d="m213.66 101.66l-80 80a8 8 0 0 1-11.32 0l-80-80a8 8 0 0 1 11.32-11.32L128 164.69l74.34-74.35a8 8 0 0 1 11.32 11.32"></path></svg>
        </div>
        <div class="accordion-body${isOpen ? '' : ' is-collapsed'}">
          ${byDept[d].sort((a,b)=>IT_COLLATOR.compare(a.nome, b.nome)).map(itemRow).join('')}
        </div>
      </div>`;
    }).join('');
  }

  const editItem = state.pantryEditKey ? state.pantryItems[state.pantryEditKey] : null;
  // Prodotto di casa: niente gruppo e solo unità pezzi/"Non mostrare", come
  // in "Aggiungi prodotto". Le categorie sono solo quelle della sua parte
  // (Cibo o Casa), più un'unica voce "↔" per spostarlo nell'altra se è stato
  // riconosciuto male (finisce nel suo "Altro", poi si sceglie la categoria).
  const editingHome = !!editItem && isNonFoodDept(knownDept(editItem.cat) || classifyDept(editItem.nome));
  const editModal = editItem ? `
    <div class="filters-modal-backdrop" data-close-pantry-edit>
      <div class="filters-modal" data-stop-close>
        <div class="filters-modal-header">
          <h3>${editingHome ? 'Modifica prodotto' : 'Modifica ingrediente'}</h3>
          <button class="btn is-icon filters-close-btn" data-close-pantry-edit>✕</button>
        </div>
        <div class="filter-groups">
          <div class="filter-group">
            <div class="filter-group-label">Nome</div>
            <input type="text" id="pantry-edit-name" value="${escapeAttr(editItem.nome)}">
          </div>
          <div class="filter-group">
            <div class="filter-group-label">Categoria <button type="button" class="btn is-text" data-open-depts>Gestisci</button></div>
            <select id="pantry-edit-cat">
              <option value="">Automatica (${escapeHtml(DEPT_LABEL[classifyDept(editItem.nome)])})</option>
              ${deptOptionsHtml(editItem.cat, editingHome ? 'casa' : 'cibo')}
              <option value="${editingHome ? 'altro' : 'altro-casa'}">${editingHome ? '↔ È un alimento (sposta in Cibo)' : '↔ È un prodotto per la casa (sposta in Casa)'}</option>
            </select>
          </div>
          ${editingHome ? '' : `<div class="filter-group">
            <div class="filter-group-label">Gruppo (es. un formato di pasta) <button type="button" class="btn is-text" data-open-pantry-groups>Gestisci</button></div>
            <select id="pantry-edit-group">
              <option value="">Nessuno</option>
              ${Object.entries(state.pantryGroups).map(([id,g])=>`<option value="${id}" ${editItem.group===id?'selected':''}>${escapeHtml(g.label)}</option>`).join('')}
            </select>
          </div>`}
          <div class="filter-group">
            <div class="filter-group-label">Luogo</div>
            <select id="pantry-edit-luogo">
              ${LUOGO_ORDER.map(l=>`<option value="${l}" ${(editItem.luogo||'dispensa')===l?'selected':''}>${LUOGO_ICON[l]} ${escapeHtml(LUOGO_LABEL[l])}</option>`).join('')}
            </select>
          </div>
          <div class="filter-group">
            <div class="filter-group-label">Quantità</div>
            <input type="number" min="0" step="${qtyStepFor(editItem.unit)}" id="pantry-edit-qty" value="${editItem.qty}">
          </div>
          <div class="filter-group">
            <div class="filter-group-label">${editingHome ? 'Unità' : 'Unità (per confrontare con quanto serve in ricetta)'}</div>
            <select id="pantry-edit-unit">
              ${editingHome ? homeUnitOptionsHtml(editItem.unit) : UNIT_ORDER.map(u=>`<option value="${u}" ${(editItem.unit||'')===u?'selected':''}>${escapeHtml(UNIT_LABEL[u])}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="filters-modal-footer">
          <button class="btn is-outline color-delete" id="pantry-edit-delete"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 256 256"><path fill="currentColor" d="M216 48h-40v-8a24 24 0 0 0-24-24h-48a24 24 0 0 0-24 24v8H40a8 8 0 0 0 0 16h8v144a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V64h8a8 8 0 0 0 0-16M96 40a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8v8H96Zm96 168H64V64h128Zm-80-104v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0m48 0v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0"></path></svg> Elimina</button>
          <button class="btn is-solid mini-add-btn" data-close-pantry-edit>Salva</button>
        </div>
      </div>
    </div>` : '';

  // Dalla vista Casa si aggiunge un prodotto, non un ingrediente: solo
  // categorie Casa, niente gruppo (servono alle ricette), unità solo
  // pezzi/generico o "Non mostrare".
  const addingHome = state.pantryView === 'casa';
  const addModal = state.pantryAddModalOpen ? `
    <div class="filters-modal-backdrop" data-close-pantry-add-modal>
      <div class="filters-modal" data-stop-close>
        <div class="filters-modal-header">
          <h3>${state.pantryView === 'casa' ? 'Aggiungi prodotto' : 'Aggiungi ingrediente'}</h3>
          <button class="btn is-icon filters-close-btn" data-close-pantry-add-modal>✕</button>
        </div>
        <div class="filter-groups">
          <div class="filter-group">
            <div class="filter-group-label">${addingHome ? 'Prodotto' : 'Ingrediente'}</div>
            <input type="text" id="pantry-add-name" placeholder="${state.pantryView === 'casa' ? 'Es. Detersivo piatti' : 'Nuovo ingrediente'}">
          </div>
          <div class="filter-group">
            <div class="filter-group-label">Categoria <button type="button" class="btn is-text" data-open-depts>Gestisci</button></div>
            <select id="pantry-add-cat">
              <option value="">Automatica (dal nome)</option>
              ${deptOptionsHtml('', addingHome ? 'casa' : 'cibo')}
            </select>
          </div>
          ${addingHome ? '' : `<div class="filter-group">
            <div class="filter-group-label">Gruppo (es. un formato di pasta) <button type="button" class="btn is-text" data-open-pantry-groups>Gestisci</button></div>
            <select id="pantry-add-group">
              <option value="">Nessuno</option>
              ${Object.entries(state.pantryGroups).map(([id,g])=>`<option value="${id}">${escapeHtml(g.label)}</option>`).join('')}
            </select>
          </div>`}
          <div class="filter-group">
            <div class="filter-group-label">Luogo</div>
            <select id="pantry-add-luogo">
              ${LUOGO_ORDER.map(l=>`<option value="${l}">${LUOGO_ICON[l]} ${LUOGO_LABEL[l]}</option>`).join('')}
            </select>
          </div>
          <div class="filter-group">
            <div class="filter-group-label">${addingHome ? 'Unità' : 'Unità (per confrontare con quanto serve in ricetta)'}</div>
            <select id="pantry-add-unit">
              ${addingHome ? homeUnitOptionsHtml('') : UNIT_ORDER.map(u=>`<option value="${u}">${escapeHtml(UNIT_LABEL[u])}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="filters-modal-footer">
          <button class="btn is-solid mini-add-btn" id="pantry-add-btn" type="button">Aggiungi</button>
        </div>
      </div>
    </div>` : '';
/*           <button class="btn is-ghost reset-btn" data-close-pantry-add-modal>Annulla</button>
 */
  // Gestione gruppi (Pasta corta/lunga e quelli che l'utente crea): "matchName"
  // è il testo esatto usato nelle ricette per il generico — un gruppo senza
  // corrispondenza in nessuna ricetta è comunque salvabile, semplicemente non
  // farà mai scattare il riconoscimento "ce l'ho" (vedi resolvePantryItem).
  const groupsModal = state.pantryGroupsModalOpen ? `
    <div class="filters-modal-backdrop" data-close-pantry-groups>
      <div class="filters-modal" data-stop-close>
        <div class="filters-modal-header">
          <h3>Gestisci gruppi</h3>
          <button class="btn is-icon filters-close-btn" data-close-pantry-groups>✕</button>
        </div>
        <p class="section-sub">Un gruppo unisce più formati (es. Fusilli, Penne) sotto il nome generico che una ricetta usa (es. "Pasta corta"): se hai scorta di uno qualsiasi dei formati assegnati a quel gruppo, la ricetta risulta "ce l'ho".</p>
        <div class="filter-groups">
          ${Object.entries(state.pantryGroups).map(([id,g])=>`
            <div class="pantry-group-row is-group" data-pantry-group-row="${id}">
              <input type="text" data-group-label="${id}" value="${escapeAttr(g.label)}" placeholder="Nome del gruppo">
              <input type="text" data-group-match="${id}" value="${escapeAttr(g.matchName)}" placeholder="Testo esatto nella ricetta">
              <select data-group-cat="${id}">
                <option value="">Nessuna categoria suggerita</option>
                ${deptOptionsHtml(g.cat, 'cibo')}
              </select>
              <button type="button" class="btn is-icon color-delete" data-group-delete="${id}" aria-label="Elimina gruppo"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 256 256"><path fill="currentColor" d="M216 48h-40v-8a24 24 0 0 0-24-24h-48a24 24 0 0 0-24 24v8H40a8 8 0 0 0 0 16h8v144a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V64h8a8 8 0 0 0 0-16M96 40a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8v8H96Zm96 168H64V64h128Zm-80-104v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0m48 0v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0"></path></svg></button>
            </div>`).join('')}
        </div>
        <div class="filter-groups">
          <div class="filter-group">
            <div class="filter-group-label">Nuovo gruppo</div>
            <input type="text" id="new-group-label" placeholder="Nome (es. Formaggio grattugiato)">
            <input type="text" id="new-group-match" placeholder="Testo esatto come compare nelle ricette">
            <select id="new-group-cat">
              <option value="">Nessuna categoria suggerita</option>
              ${deptOptionsHtml('', 'cibo')}
            </select>
            <button type="button" class="btn is-solid" id="add-group-btn">+ Aggiungi gruppo</button>
          </div>
        </div>
        <div class="filters-modal-footer">
          <button class="btn is-solid mini-add-btn" data-close-pantry-groups>Fatto</button>
        </div>
      </div>
    </div>` : '';

  // Gestione categorie: quelle di base sono fisse (solo mostrate), quelle
  // create dall'utente si rinominano, cambiano emoji o si eliminano — stesso
  // schema di "Gestisci gruppi". Condivise tra gli spazi (state.customDepts).
  // In ordine alfabetico (non in quello dei reparti): qui si cercano per nome.
  // In ordine alfabetico (non in quello dei reparti): qui si cercano per nome.
  // Divise in Cibo e Casa; quelle create dall'utente possono cambiare tipo.
  const sortedDepts = DEPT_ORDER.filter(d => d !== 'finiti').sort((a,b)=>IT_COLLATOR.compare(DEPT_LABEL[a], DEPT_LABEL[b]));
  const deptRowHtml = id=>`
            <div class="pantry-group-row">
              <input type="text" class="dept-icon-input" data-dept-icon="${escapeAttr(id)}" value="${escapeAttr(DEPT_ICON[id] || '')}" placeholder="🏷️" aria-label="Emoji">
              <input type="text" data-dept-label="${escapeAttr(id)}" value="${escapeAttr(DEPT_LABEL[id])}" placeholder="${escapeAttr(BASE_DEPT_LABEL[id] || 'Nome della categoria')}">
              ${BASE_DEPT_LABEL[id] ? '' : `<select class="dept-type-select" data-dept-type="${escapeAttr(id)}" aria-label="Tipo"><option value="cibo" ${isNonFoodDept(id)?'':'selected'}>Cibo</option><option value="casa" ${isNonFoodDept(id)?'selected':''}>Casa</option></select>`}
              ${BASE_DEPT_LABEL[id]
                ? `<span class="dept-delete-spacer" aria-hidden="true"></span>`
                : `<button type="button" class="btn is-icon color-delete" data-dept-delete="${escapeAttr(id)}" aria-label="Elimina categoria"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 256 256"><path fill="currentColor" d="M216 48h-40v-8a24 24 0 0 0-24-24h-48a24 24 0 0 0-24 24v8H40a8 8 0 0 0 0 16h8v144a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V64h8a8 8 0 0 0 0-16M96 40a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8v8H96Zm96 168H64V64h128Zm-80-104v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0m48 0v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0"></path></svg></button>`}
            </div>`;
  const deptsModal = state.deptsModalOpen ? `
    <div class="filters-modal-backdrop" data-close-depts>
      <div class="filters-modal" data-stop-close>
        <div class="filters-modal-header">
          <h3>Gestisci categorie</h3>
          <button class="btn is-icon filters-close-btn" data-close-depts>✕</button>
        </div>
        <p class="section-sub">Le categorie sono i reparti di Spesa e le sezioni di Dispensa, divise in Cibo e Casa (prodotti non alimentari). Tutte si possono rinominare o cambiare di emoji; quelle create da te si possono anche spostare tra Cibo e Casa o eliminare.</p>
        <div class="filter-groups">
          <div class="filter-group">
            <div class="filter-group-label">Cibo</div>
            <div class="dept-list">${sortedDepts.filter(d => !isNonFoodDept(d)).map(deptRowHtml).join('')}</div>
          </div>
          <div class="filter-group">
            <div class="filter-group-label">Casa</div>
            <div class="dept-list">${sortedDepts.filter(isNonFoodDept).map(deptRowHtml).join('')}</div>
          </div>
        </div>
        <div class="filter-groups">
          <div class="filter-group">
            <div class="filter-group-label">Nuova categoria</div>
            <div class="pantry-group-row">
              <input type="text" class="dept-icon-input" id="new-dept-icon" placeholder="🏷️" aria-label="Emoji">
              <input type="text" id="new-dept-label" placeholder="Nome (es. Animali)">
              <select class="dept-type-select" id="new-dept-type" aria-label="Tipo"><option value="cibo" ${state.pantryView === 'casa' ? '' : 'selected'}>Cibo</option><option value="casa" ${state.pantryView === 'casa' ? 'selected' : ''}>Casa</option></select>
            </div>
            <button type="button" class="btn is-solid" id="add-dept-btn">+ Aggiungi categoria</button>
          </div>
        </div>
        <div class="filters-modal-footer">
          <button class="btn is-solid mini-add-btn" data-close-depts>Fatto</button>
        </div>
      </div>
    </div>` : '';

  // "Gestisci ingredienti": anagrafica di OGNI ingrediente noto al sistema
  // (Dispensa, ricette, Spesa aggiunta a mano, "Ogni settimana"), non solo
  // quelli con scorta > 0 — tocca una riga per modificarne categoria/luogo/
  // unità anche se non l'hai mai avuto in Dispensa (riusa l'edit modale
  // esistente: se l'ingrediente non ha ancora una voce in pantryItems, gliene
  // crea una a quantità 0 al primo tocco — resta invisibile nelle viste
  // normali finché non imposti una quantità reale, esattamente come i
  // "Finiti", vedi sotto).
  const ingredientManagerModal = state.ingredientManagerOpen ? (()=>{
    const search = (state.ingredientManagerSearch||'').trim().toLowerCase();
    const names = allIngredientNamesForManager().filter(n => !search || n.toLowerCase().includes(search));
    const rowHtml = name=>{
      const key = name.trim().toLowerCase();
      const it = state.pantryItems[key];
      const cat = knownDept(it && it.cat) || classifyDept(name);
      const statusText = (it && typeof it.qty === 'number' && it.qty > 0)
        ? `${it.qty}${it.unit ? ' ' + it.unit : ''} · ${LUOGO_LABEL[it.luogo || 'dispensa']}`
        : 'Non in dispensa';
      return `
      <button type="button" class="ingredient-manager-row" data-manage-ingredient="${escapeAttr(name)}">
        <span class="dept-icon">${DEPT_ICON[cat]}</span>
        <span class="ingredient-manager-name">${escapeHtml(name)}</span>
        <span class="ingredient-manager-status">${escapeHtml(statusText)}</span>
      </button>`;
    };
    // I prodotti per la casa (categoria non alimentare) in una sezione a sé,
    // dopo gli ingredienti: non si mescolano col cibo.
    const foodNames = names.filter(n => !isNonFoodName(n));
    const homeNames = names.filter(n => isNonFoodName(n));
    const rows = foodNames.map(rowHtml).join('') + (homeNames.length ? `<div class="filter-group-label ingredient-manager-section">Casa</div>${homeNames.map(rowHtml).join('')}` : '');
    return `
    <div class="filters-modal-backdrop" data-close-ingredient-manager>
      <div class="filters-modal" data-stop-close>
        <div class="filters-modal-header">
          <h3>Gestisci ingredienti</h3>
          <button class="btn is-icon filters-close-btn" data-close-ingredient-manager>✕</button>
        </div>
        <p class="section-sub">Tutti gli ingredienti noti al sistema — in Dispensa, nelle ricette o aggiunti a mano in Spesa. Tocca per modificarne categoria, luogo o quantità.</p>
        <div class="search-field">
          <input class="input-search" type="search" id="ingredient-manager-search" placeholder="Cerca ingrediente…" value="${escapeAttr(state.ingredientManagerSearch||'')}">
          ${state.ingredientManagerSearch ? `<button type="button" class="search-clear" id="ingredient-manager-search-clear" aria-label="Cancella ricerca">${CLEAR_ICON_SVG}</button>` : ''}
        </div>
        <div class="ingredient-manager-list">
          ${rows || `<p class="ing-empty">Nessun ingrediente trovato.</p>`}
        </div>
      </div>
    </div>`;
  })() : '';

  // Ingredienti a scorta 0: mai cancellati (vedi Spesa/"Finiti in Dispensa"),
  // in Dispensa non compaiono proprio — niente sezione "Finiti" a parte (tolta
  // su richiesta): si ritrovano in Spesa tra i Finiti e in "Gestisci ingredienti".

  // Barra di selezione globale (pressione lunga su una riga per attivarla):
  // vale per qualsiasi ingrediente, non solo i finiti — anche uno che hai
  // ancora ma di cui vuoi comunque ricomprare, va in Spesa come "Aggiunto a mano".
  // Resta visibile finché sei in modalità selezione, anche a zero selezionati,
  // altrimenti "Deseleziona tutto" sparirebbe proprio quando serve per uscire.
  const pantrySelectedCount = Object.keys(state.pantrySelected).length;
  // Il FAB "+ aggiungi" resta sempre visibile, anche in modalità selezione
  // (prima spariva del tutto non appena selezionavi qualcosa): la barra di
  // selezione (Elimina/Svuota/Segna da comprare) compare in aggiunta, non al
  // suo posto — stesso schema già usato in Spesa per delete-checked-shop.
  const selectionBar = state.pantrySelectMode ? `
    <div class="buttons-fixed is-checked">
      ${pantrySelectedCount ? `<button type="button" class="btn is-outline color-delete" id="pantry-selection-delete"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 256 256"><path fill="currentColor" d="M216 48h-40v-8a24 24 0 0 0-24-24h-48a24 24 0 0 0-24 24v8H40a8 8 0 0 0 0 16h8v144a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V64h8a8 8 0 0 0 0-16M96 40a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8v8H96Zm96 168H64V64h128Zm-80-104v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0m48 0v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0"></path></svg> Elimina</button>` : ''}
      <button type="button" class="btn is-outline is-empty" id="pantry-selection-cancel"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M100 40a12 12 0 0 1 12-12h32a12 12 0 0 1 0 24h-32a12 12 0 0 1-12-12m44 164h-32a12 12 0 0 0 0 24h32a12 12 0 0 0 0-24m64-176h-24a12 12 0 0 0 0 24h20v20a12 12 0 0 0 24 0V48a20 20 0 0 0-20-20m8 72a12 12 0 0 0-12 12v32a12 12 0 0 0 24 0v-32a12 12 0 0 0-12-12m0 72a12 12 0 0 0-12 12v20h-20a12 12 0 0 0 0 24h24a20 20 0 0 0 20-20v-24a12 12 0 0 0-12-12M40 156a12 12 0 0 0 12-12v-32a12 12 0 0 0-24 0v32a12 12 0 0 0 12 12m32 48H52v-20a12 12 0 0 0-24 0v24a20 20 0 0 0 20 20h24a12 12 0 0 0 0-24M40 84a12 12 0 0 0 12-12V52h20a12 12 0 0 0 0-24H48a20 20 0 0 0-20 20v24a12 12 0 0 0 12 12m40-16h96a12 12 0 0 1 12 12v96a12 12 0 0 1-12 12H80a12 12 0 0 1-12-12V80a12 12 0 0 1 12-12m12 96h72V92H92Z"></path></svg> Svuota</button>
      ${pantrySelectedCount ? `<button type="button" class="btn btn is-solid is-total" id="pantry-selection-mark"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--tabler" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M4 19a2 2 0 1 0 4 0a2 2 0 1 0-4 0m11 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0"></path><path d="M17 17H6V3H4"></path><path d="m6 5l14 1l-1 7H6"></path></g></svg> ${pantrySelectedCount}</button>` : ''}
    </div>` : '';

  return `
    <p class="section-sub">Si aggiorna da sola quando spunti qualcosa in Spesa — aggiungi o togli a mano quello che manca</p>
    <div class="view-toggle">
      <button class="view-btn ${state.pantryView!=='casa'?'active':''}" data-pantry-view="cibo">Cibo</button>
      <button class="view-btn ${state.pantryView==='casa'?'active':''}" data-pantry-view="casa">Casa</button>
      
    </div>
    ${body}
    <div class="save-hint"></div>
    ${editModal}
    ${addModal}
    ${groupsModal}
    ${deptsModal}
    ${ingredientManagerModal}
    <div class="buttons-fixed">
      <button type="button" class="btn is-fixed is-secondary" id="pantry-toggle-all-sections">${(Object.entries(state.pantrySectionCollapsed).some(([id,val]) => val && id.startsWith('cat_'))) ? '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--iconoir" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m17 8l-5-5l-5 5m10 8l-5 5l-5-5"></path></svg>' : '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--iconoir" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m17 4l-5 5l-5-5m10 16l-5-5l-5 5"></path></svg>'}</button>
      <div class="search_wrapper">
        ${state.pantrySearchOpen ? `<div class="input_wrapper"><input class="input-search" type="search" id="pantry-search" placeholder="Cerca in Dispensa…" value="${escapeAttr(state.pantrySearch)}"></div>` : ''}
        ${state.pantrySearchOpen
            ? `<button type="button" class="btn is-fixed" id="pantry-search-close" aria-label="${state.pantrySearch ? 'Cancella ricerca' : 'Chiudi ricerca'}">✕</button>`
            : `<button type="button" class="btn is-fixed${state.pantrySearch ? ' active' : ''}" id="pantry-search-toggle" aria-label="Cerca in Dispensa">${SEARCH_ICON_SVG}</button>`}
      </div>
      ${state.pantrySearchOpen ? '' : `<button class="btn is-fixed" id="pantry-fab" type="button" aria-label="${state.pantryView === 'casa' ? 'Aggiungi prodotto' : 'Aggiungi ingrediente'}"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M228 128a12 12 0 0 1-12 12h-76v76a12 12 0 0 1-24 0v-76H40a12 12 0 0 1 0-24h76V40a12 12 0 0 1 24 0v76h76a12 12 0 0 1 12 12"></path></svg></button>`}
    </div>
    ${selectionBar}
  `;
}

function escapeHtml(s){ if(s===undefined || s===null) return ''; return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function escapeAttr(s){ return escapeHtml(s); }
// Per le label che possono contenere un'icona SVG (es. FREEZER_LABEL) usate in
// contesti solo-testo come <option>, dove un tag non può comunque comparire
// come icona: toglie il markup invece di mostrarlo come testo illeggibile.
function stripHtml(s){ return (s||'').replace(/<[^>]*>/g, '').trim(); }

function attachHandlers(){
  // Combobox ingrediente: righe già presenti al momento del render (nuove
  // righe aggiunte dopo, con la modale già aperta, si agganciano da sole nel
  // loro punto di inserimento — vedi #edit-add-ing-row — perché quella parte
  // non passa da un render() completo).
  document.querySelectorAll('.edit-ing-name, [data-ning], [data-rning]').forEach(attachIngredientCombobox);

  document.querySelectorAll('[data-shop-view]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      state.shopView = e.target.dataset.shopView;
      render();
    });
  });

  document.querySelectorAll('.shop-item input[type=checkbox]').forEach(cb=>{
    cb.addEventListener('change', e=>{
      // Normalmente la spunta segna solo "preso/da tenere d'occhio": non
      // tocca la Dispensa, ci pensa poi "Sposta in dispensa" per il gruppo
      // spuntato. In "Modalità spesa" invece ogni spunta sposta subito quella
      // riga in Dispensa, una alla volta, comoda mentre si è al supermercato.
      if(state.shopMode && e.target.checked && !e.target.closest('.finished-shop-group')){
        const snap = snapshotShopRowForUndo(e.target);
        moveShopRowToPantry(e.target);
        persist(); render();
        showUndoToast('Spostato in Dispensa', ()=>{
          restoreShopRowSnapshot(snap);
          persist(); render();
        });
      } else {
        e.target.dataset.shopKeys.split(',').forEach(k=>{ state.shopChecked[k] = e.target.checked; });
        persist(); render();
      }
    });
  });
  const shopModeToggle = document.getElementById('shop-mode-toggle');
  if(shopModeToggle) shopModeToggle.addEventListener('click', ()=>{
    state.shopMode = !state.shopMode;
    persist(); render();
  });
  document.querySelectorAll('[data-shop-qty-inc]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const key = e.currentTarget.dataset.shopQtyInc;
      const step = parseFloat(e.currentTarget.dataset.shopQtyStep) || 1;
      const fallback = parseFloat(e.currentTarget.dataset.shopQtyDefault);
      const current = (typeof state.shopQty[key] === 'number') ? state.shopQty[key] : (Number.isNaN(fallback) ? 0 : fallback);
      state.shopQty[key] = Math.round((current + step) * 100) / 100;
      persist(); render();
    });
  });
  document.querySelectorAll('[data-shop-qty-dec]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const key = e.currentTarget.dataset.shopQtyDec;
      const step = parseFloat(e.currentTarget.dataset.shopQtyStep) || 1;
      const fallback = parseFloat(e.currentTarget.dataset.shopQtyDefault);
      const current = (typeof state.shopQty[key] === 'number') ? state.shopQty[key] : (Number.isNaN(fallback) ? 0 : fallback);
      state.shopQty[key] = Math.max(0, Math.round((current - step) * 100) / 100);
      persist(); render();
    });
  });
  document.querySelectorAll('[data-shop-qty-show]').forEach(el=>{
    el.addEventListener('click', e=>{
      state.shopQtyEditingKey = e.currentTarget.dataset.shopQtyShow;
      render();
    });
  });
  const shopQtyEditInput = document.querySelector('[data-shop-qty-edit]');
  if(shopQtyEditInput){
    shopQtyEditInput.focus();
    shopQtyEditInput.select();
    const commitShopQtyEdit = ()=>{
      const key = shopQtyEditInput.dataset.shopQtyEdit;
      const n = parseFloat(shopQtyEditInput.value);
      state.shopQty[key] = Number.isNaN(n) ? 0 : Math.max(0, n);
      state.shopQtyEditingKey = null;
      persist(); render();
    };
    shopQtyEditInput.addEventListener('blur', commitShopQtyEdit);
    shopQtyEditInput.addEventListener('keydown', e=>{ if(e.key === 'Enter') shopQtyEditInput.blur(); });
  }
  // Nota persistente per ingrediente (vedi ingredientNotes): il tasto/testo
  // vive dentro il <label> della riga, quindi senza preventDefault il click
  // spunterebbe anche la checkbox (comportamento nativo di label+input).
  document.querySelectorAll('[data-ing-note-show]').forEach(el=>{
    el.addEventListener('click', e=>{
      e.preventDefault();
      state.ingNoteEditingKey = e.currentTarget.dataset.ingNoteShow;
      render();
    });
  });
  const ingNoteInput = document.querySelector('[data-ing-note]');
  if(ingNoteInput){
    ingNoteInput.addEventListener('click', e=> e.preventDefault());
    ingNoteInput.focus();
    ingNoteInput.select();
    const commitIngNote = ()=>{
      const key = ingNoteInput.dataset.ingNote;
      const val = ingNoteInput.value.trim();
      if(val) state.ingredientNotes[key] = val; else delete state.ingredientNotes[key];
      state.ingNoteEditingKey = null;
      persist(); render();
    };
    ingNoteInput.addEventListener('blur', commitIngNote);
    ingNoteInput.addEventListener('keydown', e=>{ if(e.key === 'Enter') ingNoteInput.blur(); });
  }
  const deleteCheckedBtn = document.getElementById('delete-checked-shop');
  if(deleteCheckedBtn){
    // Per quello che era già spuntato perché ce l'hai già (in automatico
    // dalla scorta, o a mano): esce dalla lista senza toccare la Dispensa.
    deleteCheckedBtn.addEventListener('click', ()=>{
      const keys = [];
      document.querySelectorAll('.shop-item input[type=checkbox]:checked').forEach(cb=>{
        if(cb.closest('.finished-shop-group')) return;
        cb.dataset.shopKeys.split(',').forEach(k=>keys.push(k));
      });
      const prevDismissed = keys.map(k=>state.shopDismissed[k]);
      keys.forEach(k=>{ state.shopDismissed[k] = true; });
      persist(); render();
      if(keys.length) showUndoToast(keys.length === 1 ? 'Rimosso dalla lista' : `${keys.length} articoli rimossi dalla lista`, ()=>{
        keys.forEach((k,idx)=>{
          const prev = prevDismissed[idx];
          if(prev !== undefined) state.shopDismissed[k] = prev; else delete state.shopDismissed[k];
        });
        persist(); render();
      });
    });
  }
  const moveToPantryBtn = document.getElementById('move-checked-to-pantry');
  if(moveToPantryBtn){
    // Per quello che hai appena comprato: aggiunge alla Dispensa (con la
    // quantità impostata nello stepper) e poi esce dalla lista.
    moveToPantryBtn.addEventListener('click', ()=>{
      const snaps = [];
      document.querySelectorAll('.shop-item input[type=checkbox]:checked').forEach(cb=>{
        if(cb.closest('.finished-shop-group')) return;
        snaps.push(snapshotShopRowForUndo(cb));
        moveShopRowToPantry(cb);
      });
      persist(); render();
      if(snaps.length) showUndoToast(snaps.length === 1 ? 'Spostato in Dispensa' : `${snaps.length} articoli spostati in Dispensa`, ()=>{
        snaps.forEach(restoreShopRowSnapshot);
        persist(); render();
      });
    });
  }
  // Selezionati nella sezione "Finiti" (checkbox spuntata = presa in carico):
  // o si scartano (non li vuoi comprare ora) o si "promuovono" nel loro
  // reparto vero, mescolandosi alle sezioni normali sopra invece di restare
  // isolati nel blocco Finiti (vedi il flag "confirmed" in renderSpesa).
  document.querySelectorAll('[data-finished-shop-delete]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      // A fine azione le righe si deselezionano: la spunta serviva solo a
      // sceglierle, non vuol dire "già preso".
      document.querySelectorAll('.finished-shop-group input[type=checkbox]:checked').forEach(cb=>{
        cb.dataset.shopKeys.split(',').forEach(k=>{ state.shopDismissed[k] = true; delete state.shopChecked[k]; });
      });
      persist(); render();
    });
  });
  document.querySelectorAll('[data-finished-shop-addlist]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.finished-shop-group input[type=checkbox]:checked').forEach(cb=>{
        cb.dataset.shopKeys.split(',').forEach(k=>{
          if(k.startsWith('oos_')) state.pantryConfirmedShop[k.slice(4)] = true;
          delete state.shopChecked[k];
        });
      });
      persist(); render();
    });
  });
  document.querySelectorAll('[data-shop-remove]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      e.currentTarget.dataset.shopRemove.split(',').forEach(k=>{
        if(state.shopExtras[k]) delete state.shopExtras[k];
        else state.shopDismissed[k] = true;
      });
      persist(); render();
    });
  });
  const shopAddBtn = document.getElementById('shop-add-btn');
  if(shopAddBtn){
    const nameInput = document.getElementById('shop-add-name');
    const qtaInput = document.getElementById('shop-add-qta');
    const unitSelect = document.getElementById('shop-add-unit');
    const catSelect = document.getElementById('shop-add-cat');
    const groupSelect = document.getElementById('shop-add-group');
    const luogoSelect = document.getElementById('shop-add-luogo');
    // Il modale si ridisegna a ogni tasto nel nome: quello che hai già scelto
    // negli altri campi va tenuto da parte, altrimenti tornerebbe ai default.
    const saveDraft = ()=>{
      state.addIngDraft = Object.assign({}, state.addIngDraft, {
        qta: qtaInput.value,
        unit: unitSelect ? unitSelect.value : '',
        cat: catSelect ? catSelect.value : '',
        ...(groupSelect ? { group: groupSelect.value } : {}),
        ...(luogoSelect ? { luogo: luogoSelect.value } : {})
      });
    };
    [qtaInput, unitSelect, catSelect, groupSelect, luogoSelect].forEach(el=>{
      if(el) el.addEventListener(el === qtaInput ? 'input' : 'change', saveDraft);
    });
    // Come in Dispensa: scelto un gruppo con la Categoria ancora su
    // "Automatica", la si precompila dal gruppo.
    if(groupSelect) groupSelect.addEventListener('change', e=>{
      const group = state.pantryGroups[e.target.value];
      if(catSelect && !catSelect.value && group && group.cat){ catSelect.value = group.cat; saveDraft(); }
    });
    // Se il nome coincide con un ingrediente già in Dispensa ma a scorta 0,
    // "Aggiungi" non crea una voce doppia: riattiva quello (stessa azione di
    // "Segna da comprare" nella sezione Finiti), così resta un unico record.
    const doAdd = ()=>{
      const name = nameInput.value.trim();
      if(!name) return;
      const pantryKey = name.toLowerCase();
      const pantryIt = state.pantryItems[pantryKey];
      if(pantryIt && typeof pantryIt.qty === 'number' && pantryIt.qty <= 0){
        state.pantryConfirmedShop[pantryKey] = true;
        delete state.shopDismissed[`oos_${pantryKey}`];
        if(catSelect && catSelect.value) pantryIt.cat = catSelect.value;
      } else {
        // L'unità dalla select si aggiunge solo se il campo Quantità è un
        // numero "pulito" (es. "2"): se hai scritto qualcosa di tuo (es.
        // "1 rotolo") lo rispetto così com'è, senza aggiungere altro in coda.
        const rawQta = qtaInput.value.trim();
        const qta = (unitSelect && unitSelect.value && /^[\d.,]*$/.test(rawQta))
          ? `${rawQta || '1'} ${unitSelect.value}`
          : rawQta;
        const id = 'extra_' + Date.now() + '_' + Math.random().toString(36).slice(2,7);
        // Categoria scelta a mano (facoltativa): un ingrediente nuovo, mai
        // visto prima, non ha modo di essere classificato bene da
        // classifyDept (indovina solo da parole chiave note) — vedi il
        // fallback in buildShopFlat/renderSpesa.
        // Gruppo/luogo solo per un ingrediente nuovo (i select compaiono solo
        // allora): servono a moveShopRowToPantry per crearlo in Dispensa completo.
        state.shopExtras[id] = catSelect && catSelect.value ? { ingrediente: name, qta, cat: catSelect.value } : { ingrediente: name, qta };
        // Ingrediente nuovo: entra subito nell'anagrafica (voce di Dispensa a
        // scorta 0, come quando lo apri da "Gestisci ingredienti") con
        // categoria/gruppo/luogo/unità scelti qui — in scorta ci va solo
        // quando lo compri (moveShopRowToPantry ritrova questa voce e ne
        // aumenta la quantità, tenendo luogo/categoria/gruppo). La sua riga
        // "Finiti in Dispensa" si scarta: in lista c'è già come aggiunto a
        // mano, con la quantità scritta qui.
        if(!pantryIt){
          upsertPantryItem(name, luogoSelect ? luogoSelect.value : 'dispensa', 0, unitSelect ? unitSelect.value : '', catSelect ? catSelect.value : '', groupSelect ? groupSelect.value : '');
          state.shopDismissed[`oos_${pantryKey}`] = true;
        }
      }
      state.addIngModalOpen = false;
      state.addIngDraft = null;
      state.addIngName = '';
      state.addIngSuggestOpen = false;
      state.addIngCursorPos = null;
      persist(); render();
    };
    shopAddBtn.addEventListener('click', doAdd);
    [nameInput, qtaInput].forEach(inp=>{
      inp.addEventListener('keydown', e=>{ if(e.key === 'Enter') doAdd(); });
    });
    nameInput.addEventListener('input', e=>{
      state.addIngName = e.target.value;
      state.addIngSuggestOpen = true;
      state.addIngCursorPos = e.target.selectionStart;
      render();
    });
    nameInput.addEventListener('focus', ()=>{ state.addIngSuggestOpen = true; });
    // il re-render sostituisce l'input con uno nuovo: rimette a fuoco e
    // ripristina la posizione del cursore, altrimenti si perderebbero a ogni tasto.
    if(document.activeElement !== nameInput){
      nameInput.focus();
      if(typeof state.addIngCursorPos === 'number') nameInput.setSelectionRange(state.addIngCursorPos, state.addIngCursorPos);
    }
  }
  document.querySelectorAll('[data-pick-ing-suggestion]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      state.addIngName = e.currentTarget.dataset.pickIngSuggestion;
      state.addIngSuggestOpen = false;
      state.addIngCursorPos = state.addIngName.length;
      render();
    });
  });
  const spesaFab = document.getElementById('spesa-fab');
  if(spesaFab) spesaFab.addEventListener('click', ()=>{ state.addIngModalOpen = true; render(); });
  document.querySelectorAll('[data-close-add-ing-modal]').forEach(el=>{
    el.addEventListener('click', e=>{
      if(e.target.hasAttribute('data-stop-close')) return;
      state.addIngModalOpen = false;
      state.addIngDraft = null;
      state.addIngName = '';
      state.addIngSuggestOpen = false;
      state.addIngCursorPos = null;
      render();
    });
  });
  document.querySelectorAll('[data-close-whats-new]').forEach(el=>{
    el.addEventListener('click', e=>{
      if(e.target.hasAttribute('data-stop-close')) return;
      markWhatsNewSeen();
      persist(); render();
    });
  });
  const resetBtn = document.getElementById('reset-shop');
  // Solo le spunte: azzerare anche gli eliminati farebbe ricomparire tutto
  // quello che avevi tolto con "Elimina", gonfiando il conteggio invece di
  // limitarsi a deselezionare. Le spunte si cancellano, non si mettono a
  // "falso": per un ingrediente di ricetta il falso esplicito vuol dire "mi
  // serve comunque" e lo farebbe restare in lista anche se ce l'hai.
  if(resetBtn) resetBtn.addEventListener('click', ()=>{
    const items = buildShopFlat();
    const prevChecked = items.map(it => state.shopChecked[it.key]);
    items.forEach(it => { if(state.shopChecked[it.key] === true) delete state.shopChecked[it.key]; });
    persist(); render();
    showUndoToast('Spunte azzerate', ()=>{
      items.forEach((it, idx)=>{
        const prev = prevChecked[idx];
        if(prev !== undefined) state.shopChecked[it.key] = prev; else delete state.shopChecked[it.key];
      });
      persist(); render();
    });
  });
  const toggleAllSectionsBtn = document.getElementById('shop-toggle-all-sections');
  if(toggleAllSectionsBtn){
    toggleAllSectionsBtn.addEventListener('click', ()=>{
      // Guarda lo stato reale nel DOM (solo le sezioni della vista attuale sono
      // presenti) invece di ricalcolare la stessa logica una seconda volta qui.
      const sectionEls = document.querySelectorAll('[data-toggle-shop-section]');
      const finitiEls = document.querySelectorAll('[data-toggle-shop-finiti]');
      const anyCollapsed = Array.from(sectionEls).some(el=>!el.classList.contains('open')) || (finitiEls.length > 0 && !state.shopFinitiOpen);
      sectionEls.forEach(el=>{
        const id = el.dataset.toggleShopSection;
        if(anyCollapsed) delete state.shopSectionCollapsed[id];
        else state.shopSectionCollapsed[id] = true;
      });
      if(finitiEls.length) state.shopFinitiOpen = anyCollapsed;
      render();
    });
  }
  const pantryToggleAllBtn = document.getElementById('pantry-toggle-all-sections');
  if(pantryToggleAllBtn){
    pantryToggleAllBtn.addEventListener('click', ()=>{
      const sectionEls = document.querySelectorAll('[data-toggle-pantry-section]');
      const anyCollapsed = Array.from(sectionEls).some(el=>!el.classList.contains('open'));
      sectionEls.forEach(el=>{
        const id = el.dataset.togglePantrySection;
        if(anyCollapsed) delete state.pantrySectionCollapsed[id];
        else state.pantrySectionCollapsed[id] = true;
      });
      render();
    });
  }

  document.querySelectorAll('[data-open-swap]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const key = e.target.dataset.openSwap;
      state.swapOpenDay = state.swapOpenDay === key ? null : key;
      state.linkPickerOpenDay = null;
      state.avanzoDiPickerOpenDay = null;
      state.contornoPickerOpenMeal = null;
      render();
    });
  });
  document.querySelectorAll('[data-open-link-picker]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const key = e.currentTarget.dataset.openLinkPicker;
      state.linkPickerOpenDay = state.linkPickerOpenDay === key ? null : key;
      state.avanzoDiPickerOpenDay = null;
      state.swapOpenDay = null;
      state.contornoPickerOpenMeal = null;
      state.mealOverflowOpen = null;
      render();
    });
  });
  document.querySelectorAll('[data-open-avanzodi-picker]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const key = e.currentTarget.dataset.openAvanzodiPicker;
      state.avanzoDiPickerOpenDay = state.avanzoDiPickerOpenDay === key ? null : key;
      state.linkPickerOpenDay = null;
      state.swapOpenDay = null;
      state.contornoPickerOpenMeal = null;
      state.mealOverflowOpen = null;
      render();
    });
  });
  // Contorno: pannello di ricerca uguale a quello di "Cambia", ma filtrato
  // sui soli tipologia="contorno" e senza toccare il principale.
  document.querySelectorAll('[data-open-contorno-picker]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const key = e.currentTarget.dataset.openContornoPicker;
      state.contornoPickerOpenMeal = state.contornoPickerOpenMeal === key ? null : key;
      state.swapOpenDay = null;
      state.linkPickerOpenDay = null;
      state.avanzoDiPickerOpenDay = null;
      render();
    });
  });
  document.querySelectorAll('[data-contorno-search]').forEach(inp=>{
    inp.addEventListener('input', e=>{
      const key = `${e.target.dataset.contornoSearch}_contorno`;
      if(!state.swapFilters[key]) state.swapFilters[key] = {search:''};
      state.swapFilters[key].search = e.target.value;
      render(); // fuoco e cursore: vedi restoreFocus
    });
  });
  // data-contorno-pick/data-contorno-remove: delegati su document, vedi in
  // fondo al file (non ri-agganciati per singolo elemento a ogni render).
  document.querySelectorAll('[data-avanzodi-pick]').forEach(row=>{
    row.addEventListener('click', e=>{
      const el = e.currentTarget;
      const sourceKey = el.dataset.avanzodiPick; // pasto passato scelto, in cui è stato cucinato davvero
      const targetKey = el.dataset.avanzodiDay; // questo pasto, che ne mangia gli avanzi
      const { weekIdx, i, meal } = parseMealKey(targetKey);
      state.dayLinks[targetKey] = sourceKey;
      clearMealFlag(weekOverridesRef(weekIdx), i, meal);
      clearMealFlag(weekOverridePickedRef(weekIdx), i, meal);
      clearMealFlag(weekMealsDoneRef(weekIdx), i, meal);
      state.avanzoDiPickerOpenDay = null;
      persist(); render();
    });
  });
  document.querySelectorAll('[data-link-pick]').forEach(row=>{
    row.addEventListener('click', e=>{
      const el = e.currentTarget;
      const sourceKey = el.dataset.linkDay; // pasto in cui è stato cucinato (dove hai cliccato "Avanzata")
      const targetKey = el.dataset.linkPick; // pasto scelto in cui lo mangerete
      const { weekIdx, i, meal } = parseMealKey(targetKey);
      state.dayLinks[targetKey] = sourceKey;
      clearMealFlag(weekOverridesRef(weekIdx), i, meal);
      clearMealFlag(weekOverridePickedRef(weekIdx), i, meal);
      clearMealFlag(weekMealsDoneRef(weekIdx), i, meal);
      state.linkPickerOpenDay = null;
      persist(); render();
    });
  });
  document.querySelectorAll('[data-unlink-day]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const key = e.currentTarget.dataset.unlinkDay;
      const prevLink = state.dayLinks[key];
      const prevNote = state.dayLinkNotes[key];
      const prevPortions = state.dayPortions[key];
      clearDayLink(key);
      persist(); render();
      showUndoToast('Pasto scollegato dall\'avanzo', ()=>{
        if(prevLink !== undefined) state.dayLinks[key] = prevLink;
        if(prevNote !== undefined) state.dayLinkNotes[key] = prevNote;
        if(prevPortions !== undefined) state.dayPortions[key] = prevPortions;
        persist(); render();
      });
    });
  });
  document.querySelectorAll('[data-link-note-show]').forEach(el=>{
    el.addEventListener('click', e=>{
      state.linkNoteEditingKey = e.currentTarget.dataset.linkNoteShow;
      render();
    });
  });
  const linkNoteInput = document.querySelector('[data-link-note]');
  if(linkNoteInput){ linkNoteInput.focus(); linkNoteInput.select(); }
  document.querySelectorAll('[data-link-note]').forEach(inp=>{
    const commit = e=>{
      const key = e.target.dataset.linkNote;
      const val = e.target.value.trim();
      if(val) state.dayLinkNotes[key] = val; else delete state.dayLinkNotes[key];
      state.linkNoteEditingKey = null;
      persist(); render();
    };
    inp.addEventListener('blur', commit);
    inp.addEventListener('keydown', e=>{ if(e.key === 'Enter') e.target.blur(); });
  });
  // Tre gesti sulla stessa card, tutti a partire dallo stesso pointerdown:
  // tap normale (apre il dettaglio), pressione lunga da ferma (500ms senza
  // spostarsi) per trascinare e scambiare con un altro pasto, e uno swipe
  // rapido verso destra per rivelare il cestino "svuota il pasto" sotto
  // (soglia di spostamento minima per distinguerlo da un tap, poi si segue
  // il dito finché non si supera la soglia di reveal o quella di auto-svuota
  // rilasciando). Esclude bottoni/input/link dal punto di partenza, così non
  // ruba il tocco a "Cambia", al lucchetto, alle chip contorni ecc.
  const TRASH_REVEAL = 80, TRASH_AUTO = 170;
  document.querySelectorAll('.meal-block').forEach(block=>{
    const blockMk = `${block.dataset.weekIdx}_${block.dataset.dayIndex}_${block.dataset.meal}`;
    const wrap = block.closest('.meal-block-swipe-wrap');
    let pressTimer = null;
    let longPressed = false;
    let startX = 0, startY = 0;
    let swiping = false; // una volta capito che è uno swipe verso destra (non tap né pressione lunga)
    function setTx(px){ block.style.transform = px ? `translateX(${px}px)` : ''; }
    // Se questa card era rimasta "rivelata" da prima del render, resta aperta.
    if(wrap && revealedMealKey === blockMk) setTx(TRASH_REVEAL);
    block.addEventListener('pointerdown', e=>{
      if(e.target.closest('button, input, a')) return;
      longPressed = false;
      swiping = false;
      startX = e.clientX; startY = e.clientY;
      const pointerId = e.pointerId;
      pressTimer = setTimeout(()=>{
        longPressed = true;
        startDayDrag(block, e.clientX, e.clientY, pointerId);
      }, 500);
    });
    const cancelPress = ()=>{ clearTimeout(pressTimer); pressTimer = null; };
    block.addEventListener('pointermove', e=>{
      if(longPressed) return; // il trascinamento ha già preso il controllo del gesto
      const dx = e.clientX - startX, dy = e.clientY - startY;
      if(!swiping){
        if(Math.hypot(dx, dy) < 10) return;
        cancelPress();
        // Solo uno swipe verso destra, prevalentemente orizzontale, e solo
        // se la card ha un cestino da rivelare (wrap presente): altrimenti
        // è uno scroll verticale o uno swipe a sinistra, li si lascia
        // passare così non intralciano lo swipe-cambia-tab del contenuto.
        if(wrap && dx > 0 && Math.abs(dx) > Math.abs(dy)) swiping = true;
        else return;
        block.classList.add('swiping');
        // Senza cattura, superata la soglia di reveal il dito può finire
        // fuori dai confini (clippati da overflow:hidden) della card
        // spostata: pointerup/pointermove andrebbero a un altro elemento
        // invece che qui. La cattura tiene tutto il gesto su questo blocco
        // fino al rilascio, indipendentemente da dove finisce il dito.
        try{ block.setPointerCapture(e.pointerId); }catch(err){}
      }
      setTx(Math.max(0, Math.min(dx, TRASH_AUTO + 40)));
    });
    function endSwipe(dx){
      block.classList.remove('swiping');
      if(dx >= TRASH_AUTO){
        performClearMeal(blockMk);
        revealedMealKey = null;
        return;
      }
      if(dx >= TRASH_REVEAL){
        setTx(TRASH_REVEAL);
        revealedMealKey = blockMk;
      } else {
        setTx(0);
        if(revealedMealKey === blockMk) revealedMealKey = null;
      }
    }
    block.addEventListener('pointerup', e=>{
      cancelPress();
      if(swiping){ swiping = false; endSwipe(e.clientX - startX); }
    });
    block.addEventListener('pointerleave', ()=>{ if(!swiping) cancelPress(); });
    block.addEventListener('pointercancel', ()=>{
      cancelPress();
      if(swiping){ swiping = false; endSwipe(0); }
    });
    // Il tap che ha fatto scattare il trascinamento non deve anche aprire il
    // dettaglio a tutto schermo: intercetta il click in fase di cattura,
    // prima che arrivi allo span data-toggle-day (stesso schema del
    // long-press di Dispensa). Un tap mentre il cestino è rivelato lo
    // richiude invece di aprire il dettaglio sotto, a meno che il tocco non
    // sia sul cestino stesso (che ha già la sua azione).
    block.addEventListener('click', e=>{
      if(longPressed){ longPressed = false; e.stopPropagation(); return; }
      if(wrap && revealedMealKey === blockMk){
        setTx(0);
        revealedMealKey = null;
        e.stopPropagation();
      }
    }, true);
  });
  document.querySelectorAll('[data-toggle-cook]').forEach(btn=>{
    btn.addEventListener('click', e=>{ toggleCook(e.currentTarget.dataset.toggleCook); });
  });
  document.querySelectorAll('[data-portions-inc]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const dayKey = e.currentTarget.dataset.portionsInc;
      const { weekIdx, i, meal } = parseMealKey(dayKey);
      const det = getRecipeDetails(effectiveRecipeName(weekIdx, i, meal));
      const base = det ? parsePortionsBase(det.porzioni) : null;
      const current = state.dayPortions[dayKey] || base || 1;
      state.dayPortions[dayKey] = current + 1;
      persist(); render();
    });
  });
  document.querySelectorAll('[data-portions-dec]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const dayKey = e.currentTarget.dataset.portionsDec;
      const { weekIdx, i, meal } = parseMealKey(dayKey);
      const det = getRecipeDetails(effectiveRecipeName(weekIdx, i, meal));
      const base = det ? parsePortionsBase(det.porzioni) : null;
      const current = state.dayPortions[dayKey] || base || 1;
      state.dayPortions[dayKey] = Math.max(1, current - 1);
      persist(); render();
    });
  });
  document.querySelectorAll('[data-toggle-assignee]').forEach(btn=>{
    btn.addEventListener('click', e=>{ toggleShopAssignee(e.currentTarget.dataset.toggleAssignee); });
  });
  document.querySelectorAll('[data-go-tab]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      state.tab = e.currentTarget.dataset.goTab;
      window.location.hash = state.tab;
      render();
    });
  });
  document.querySelectorAll('[data-mancanti-in-spesa]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const mancanti = JSON.parse(e.currentTarget.dataset.mancantiInSpesa);
      mancanti.forEach(it=>{
        if(it.key){
          // Collegato a un pasto pianificato: buildShopFlat lo aggrega già
          // da solo nella sezione di quel pasto, a meno che la riga non
          // risulti scartata (o già spuntata) — qui basta assicurarsi che
          // sia visibile, senza duplicarla come voce "Aggiunti a mano".
          delete state.shopDismissed[it.key];
          state.shopChecked[it.key] = false;
          return;
        }
        const already = Object.values(state.shopExtras).some(x => x.ingrediente.trim().toLowerCase() === it.ingrediente.trim().toLowerCase());
        if(already) return;
        const id = 'extra_' + Date.now() + '_' + Math.random().toString(36).slice(2,7);
        state.shopExtras[id] = { ingrediente: it.ingrediente, qta: it.qta || '' };
      });
      state.tab = 'spesa';
      window.location.hash = 'spesa';
      persist(); render();
    });
  });
  document.querySelectorAll('[data-generate-week]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const weekIdx = parseInt(e.currentTarget.dataset.generateWeek,10);
      const snap = snapshotPlanningState();
      generateWeek(weekIdx);
      showUndoToast('Menù rigenerato', ()=>{
        restorePlanningState(snap);
        persist(); render();
      });
    });
  });
  document.querySelectorAll('[data-remove-week]').forEach(btn=>{
    btn.addEventListener('click', e=>{ removeWeek(parseInt(e.currentTarget.dataset.removeWeek,10)); });
  });
  const addWeekBtn = document.getElementById('add-week');
  if(addWeekBtn) addWeekBtn.addEventListener('click', ()=>{ addWeek(); });

  document.querySelectorAll('[data-toggle-past-days]').forEach(btn=>{
    btn.addEventListener('click', ()=>{ state.showPastDays = !state.showPastDays; render(); });
  });
  document.querySelectorAll('[data-open-gen-settings]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const val = e.currentTarget.dataset.openGenSettings;
      state.genSettingsOpen = val === 'plain' ? 'plain' : parseInt(val, 10);
      render();
    });
  });
  document.querySelectorAll('[data-close-gen-settings]').forEach(el=>{
    el.addEventListener('click', e=>{
      if(e.target.hasAttribute('data-stop-close')) return;
      state.genSettingsOpen = null;
      state.tempoExceptionAdding = null;
      render();
    });
  });
  document.querySelectorAll('[data-dismiss-reminder]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      state.notifDismissed[e.currentTarget.dataset.dismissReminder] = true;
      persist(); render();
    });
  });
  document.querySelectorAll('[data-dismiss-eaten-reminder]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      state.mealsDoneReminderDismissed[e.currentTarget.dataset.dismissEatenReminder] = true;
      persist(); render();
    });
  });
  document.querySelectorAll('[data-set-tempo-base]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      state.weekTempoBase = e.currentTarget.dataset.setTempoBase;
      persist(); render();
    });
  });
  document.querySelectorAll('[data-toggle-tempo-exception-picker]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      state.tempoExceptionAdding = state.tempoExceptionAdding ? null : 'pickingDay';
      render();
    });
  });
  document.querySelectorAll('[data-pick-tempo-exception-day]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const day = parseInt(e.currentTarget.dataset.pickTempoExceptionDay, 10);
      const meal = e.currentTarget.dataset.pickTempoExceptionMeal;
      state.tempoExceptionAdding = { day, meal };
      render();
    });
  });
  document.querySelectorAll('[data-set-tempo-exception-value]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const adding = state.tempoExceptionAdding;
      if(adding && typeof adding === 'object'){
        state.weekTempoExceptions[`${adding.day}_${adding.meal}`] = e.currentTarget.dataset.setTempoExceptionValue;
      }
      state.tempoExceptionAdding = null;
      persist(); render();
    });
  });
  document.querySelectorAll('[data-remove-tempo-exception]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      delete state.weekTempoExceptions[e.currentTarget.dataset.removeTempoException];
      persist(); render();
    });
  });

  document.querySelectorAll('[data-reset-swap]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const key = e.currentTarget.dataset.resetSwap;
      const { weekIdx, i, meal } = parseMealKey(key);
      clearMealFlag(weekOverridesRef(weekIdx), i, meal);
      clearMealFlag(weekOverridePickedRef(weekIdx), i, meal);
      clearMealFlag(weekMealsDoneRef(weekIdx), i, meal);
      clearDayLink(key);
      unlinkDaysPointingTo(key);
      state.swapOpenDay = null;
      state.mealOverflowOpen = null;
      persist(); render();
    });
  });
  document.querySelectorAll('[data-swap-more]').forEach(btn=>{
    // f.suggestSeen è già stato aggiornato con i 3 suggerimenti appena
    // mostrati durante QUESTO render (vedi renderSwapScreen): basta un nuovo
    // render, i prossimi suggeriti li esclude da soli.
    btn.addEventListener('click', ()=>{ render(); });
  });
  document.querySelectorAll('[data-swap-cat]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const i = e.target.dataset.swapDay;
      if(!state.swapFilters[i]) state.swapFilters[i] = {search:'', cat:'same'};
      state.swapFilters[i].cat = e.target.dataset.swapCat;
      render();
    });
  });
  document.querySelectorAll('[data-swap-search]').forEach(inp=>{
    inp.addEventListener('input', e=>{
      const i = e.target.dataset.swapSearch;
      if(!state.swapFilters[i]) state.swapFilters[i] = {search:'', cat:'same'};
      state.swapFilters[i].search = e.target.value;
      render(); // fuoco e cursore: vedi restoreFocus
    });
  });
  document.querySelectorAll('[data-swap-pick]').forEach(row=>{
    row.addEventListener('click', e=>{
      const el = e.currentTarget;
      const key = el.dataset.swapDay;
      const { weekIdx, i, meal } = parseMealKey(key);
      const recipeName = el.dataset.swapPick;
      const overridesMap = weekOverridesRef(weekIdx);
      const prevOverrideSlot = overridesMap[i] ? overridesMap[i][meal] : undefined;
      const pickedMap = weekOverridePickedRef(weekIdx);
      const prevPicked = pickedMap[i] ? pickedMap[i][meal] : undefined;
      const mealsDoneMap = weekMealsDoneRef(weekIdx);
      const prevDone = mealsDoneMap[i] ? mealsDoneMap[i][meal] : undefined;
      const linksSnap = snapshotMealLinks(key);
      writeMealPrincipale(overridesMap, i, meal, recipeName);
      if(!pickedMap[i]) pickedMap[i] = {};
      pickedMap[i][meal] = true;
      clearMealFlag(mealsDoneMap, i, meal);
      clearDayLink(key);
      unlinkDaysPointingTo(key);
      state.swapOpenDay = null;
      persist(); render();
      showUndoToast('Ricetta sostituita', ()=>{
        restoreMealLinks(linksSnap);
        const om = weekOverridesRef(weekIdx);
        if(prevOverrideSlot !== undefined){
          if(!om[i]) om[i] = emptyDaySlot();
          om[i][meal] = prevOverrideSlot;
        } else if(om[i]){
          delete om[i][meal];
        }
        const pd = weekOverridePickedRef(weekIdx);
        if(prevPicked !== undefined){
          if(!pd[i]) pd[i] = {};
          pd[i][meal] = prevPicked;
        } else if(pd[i]){
          delete pd[i][meal];
        }
        if(prevDone !== undefined){
          const md = weekMealsDoneRef(weekIdx);
          if(!md[i]) md[i] = {};
          md[i][meal] = prevDone;
        }
        persist(); render();
      });
    });
  });

  document.querySelectorAll('[data-toggle-done]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const key = e.currentTarget.dataset.toggleDone;
      const { weekIdx, i, meal } = parseMealKey(key);
      const mealsDone = weekMealsDoneRef(weekIdx);
      if(mealsDone[i] && mealsDone[i][meal]){
        clearMealFlag(mealsDone, i, meal);
        persist(); render();
      } else if(linkedSourceMealKey(weekIdx, i, meal)){
        // pasto "avanzo": nessun nuovo ingrediente consumato (già scalato sul
        // pasto sorgente), quindi si segna direttamente senza passare dalla
        // modale di aggiornamento Dispensa.
        if(!mealsDone[i]) mealsDone[i] = {};
        mealsDone[i][meal] = true;
        persist(); render();
      } else {
        const mealData = effectiveMeal(weekIdx, i, meal);
        // Stessa scala porzioni usata ovunque (Spesa, dettaglio ricetta): la
        // quantità precompilata è quella davvero usata per QUESTO pasto, non
        // quella "di base" della ricetta.
        const det = mealData.principale ? getRecipeDetails(mealData.principale) : null;
        const basePortions = det ? parsePortionsBase(det.porzioni) : null;
        const ratio = basePortions ? (state.dayPortions[key] || basePortions) / basePortions : 1;
        const allIng = (mealData.principale ? getIngredientsFor(mealData.principale) : [])
          .concat(mealData.contorni.reduce((acc,c)=>acc.concat(getIngredientsFor(c)), []));
        const qtyMap = {};
        allIng.forEach(it=>{
          // resolvePantryItem (non un lookup diretto per nome): un ingrediente
          // con alternative tra parentesi ("Farina 00 (o mix con Manitoba)")
          // o parte di un gruppo va risolto come ovunque in Dispensa/Spesa.
          const pantryIt = resolvePantryItem(it.ingrediente);
          if(pantryIt && typeof pantryIt.qty === 'number' && pantryIt.unit !== 'none'){
            qtyMap[it.ingrediente] = usedQtyForPantry(pantryIt.unit, it.qta, ratio);
          }
        });
        state.doneModalDay = key;
        state.doneModalQty = qtyMap;
        state.doneQtyEditingKey = null;
        state.doneModalFinished = {};
        state.doneModalLeftover = mealData.principale || '';
        state.doneModalLeftoverLuogo = 'frigo';
        state.doneModalLeftoverCat = 'avanzi';
        state.doneModalLeftoverChecked = false;
        state.doneModalLeftoverPickerOpen = false;
        state.doneModalLeftoverCatPickerOpen = false;
        render();
      }
    });
  });
  document.querySelectorAll('[data-toggle-lock]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const key = e.currentTarget.dataset.toggleLock;
      if(state.mealLocked[key]) delete state.mealLocked[key];
      else state.mealLocked[key] = true;
      state.mealOverflowOpen = null;
      persist(); render();
    });
  });
  document.querySelectorAll('[data-clear-meal]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      performClearMeal(e.currentTarget.dataset.clearMeal);
    });
  });
  document.querySelectorAll('[data-open-meal-overflow]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      state.mealOverflowOpen = e.currentTarget.dataset.openMealOverflow;
      render();
    });
  });
  document.querySelectorAll('[data-close-meal-overflow]').forEach(el=>{
    el.addEventListener('click', e=>{
      if(e.target.hasAttribute('data-stop-close')) return;
      state.mealOverflowOpen = null;
      render();
    });
  });
  document.querySelectorAll('[data-undo-toast]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      clearTimeout(undoToastTimer);
      const fn = state.undoToast && state.undoToast.undoFn;
      state.undoToast = null;
      if(fn) fn();
    });
  });
  document.querySelectorAll('[data-close-done-modal]').forEach(el=>{
    el.addEventListener('click', e=>{
      if(e.target.hasAttribute('data-stop-close')) return;
      state.doneModalDay = null;
      state.doneModalQty = {};
      state.doneQtyEditingKey = null;
      state.doneModalFinished = {};
      state.doneModalLeftover = '';
      state.doneModalLeftoverLuogo = 'frigo';
      state.doneModalLeftoverCat = 'avanzi';
      state.doneModalLeftoverChecked = false;
      state.doneModalLeftoverPickerOpen = false;
      state.doneModalLeftoverCatPickerOpen = false;
      render();
    });
  });
  document.querySelectorAll('[data-done-finished-toggle]').forEach(cb=>{
    cb.addEventListener('change', e=>{
      const name = e.currentTarget.dataset.doneFinishedToggle;
      state.doneModalFinished[name] = e.currentTarget.checked;
      render();
    });
  });
  document.querySelectorAll('[data-done-qty-dec]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const name = e.currentTarget.dataset.doneQtyDec;
      const pantryIt = resolvePantryItem(name);
      const step = qtyStepFor(pantryIt && pantryIt.unit);
      state.doneModalQty[name] = Math.max(0, Math.round(((state.doneModalQty[name]||0) - step) * 100) / 100);
      render();
    });
  });
  document.querySelectorAll('[data-done-qty-inc]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const name = e.currentTarget.dataset.doneQtyInc;
      const pantryIt = resolvePantryItem(name);
      const step = qtyStepFor(pantryIt && pantryIt.unit);
      state.doneModalQty[name] = Math.round(((state.doneModalQty[name]||0) + step) * 100) / 100;
      render();
    });
  });
  document.querySelectorAll('[data-done-qty-show]').forEach(el=>{
    el.addEventListener('click', e=>{
      state.doneQtyEditingKey = e.currentTarget.dataset.doneQtyShow;
      render();
    });
  });
  const doneQtyEditInput = document.querySelector('[data-done-qty-edit]');
  if(doneQtyEditInput){
    doneQtyEditInput.focus();
    doneQtyEditInput.select();
    const commitDoneQtyEdit = ()=>{
      const name = doneQtyEditInput.dataset.doneQtyEdit;
      const n = parseFloat(doneQtyEditInput.value);
      state.doneModalQty[name] = Number.isNaN(n) ? 0 : Math.max(0, n);
      state.doneQtyEditingKey = null;
      render();
    };
    doneQtyEditInput.addEventListener('blur', commitDoneQtyEdit);
    doneQtyEditInput.addEventListener('keydown', e=>{ if(e.key === 'Enter') doneQtyEditInput.blur(); });
  }
  document.querySelectorAll('[data-done-leftover-input]').forEach(inp=>{
    inp.addEventListener('input', e=>{
      state.doneModalLeftover = e.target.value;
      render(); // fuoco e cursore: vedi restoreFocus
    });
  });
  document.querySelectorAll('[data-done-leftover-toggle]').forEach(cb=>{
    cb.addEventListener('change', e=>{
      state.doneModalLeftoverChecked = e.currentTarget.checked;
      render();
    });
  });
  document.querySelectorAll('[data-done-leftover-luogo-toggle]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      state.doneModalLeftoverPickerOpen = !state.doneModalLeftoverPickerOpen;
      state.doneModalLeftoverCatPickerOpen = false;
      render();
    });
  });
  document.querySelectorAll('[data-done-leftover-luogo-close]').forEach(el=>{
    el.addEventListener('click', ()=>{ state.doneModalLeftoverPickerOpen = false; render(); });
  });
  document.querySelectorAll('[data-done-leftover-luogo-set]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      state.doneModalLeftoverLuogo = e.currentTarget.dataset.doneLeftoverLuogoSet;
      state.doneModalLeftoverPickerOpen = false;
      render();
    });
  });
  document.querySelectorAll('[data-done-leftover-cat-toggle]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      state.doneModalLeftoverCatPickerOpen = !state.doneModalLeftoverCatPickerOpen;
      state.doneModalLeftoverPickerOpen = false;
      render();
    });
  });
  document.querySelectorAll('[data-done-leftover-cat-close]').forEach(el=>{
    el.addEventListener('click', ()=>{ state.doneModalLeftoverCatPickerOpen = false; render(); });
  });
  document.querySelectorAll('[data-done-leftover-cat-set]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      state.doneModalLeftoverCat = e.currentTarget.dataset.doneLeftoverCatSet;
      state.doneModalLeftoverCatPickerOpen = false;
      render();
    });
  });
  document.querySelectorAll('[data-confirm-done]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const key = e.currentTarget.dataset.confirmDone;
      const { weekIdx, i, meal } = parseMealKey(key);
      const qtyMap = state.doneModalQty || {};
      // Le quantità qui sono "quanto ne hai usato": si sottraggono dalla
      // scorta attuale invece di sovrascriverla (prima il campo era "quanto
      // ti resta", da calcolare a mano — vedi commit).
      Object.keys(qtyMap).forEach(ingrediente=>{
        const pantryIt = resolvePantryItem(ingrediente);
        if(pantryIt) pantryIt.qty = Math.max(0, Math.round(((pantryIt.qty||0) - qtyMap[ingrediente]) * 100) / 100);
      });
      // Ingredienti "a spanne" spuntati "L'hai finito?": segnati assenti in
      // Dispensa (stesso stato della spunta tolta a mano, vedi presence-toggle)
      // e aggiunti direttamente in Spesa, senza quantità — sono quelli che
      // "si ricomprano e basta", non si scrive mai quanto prenderne.
      Object.entries(state.doneModalFinished || {}).forEach(([ingrediente, checked])=>{
        if(!checked) return;
        const pantryIt = resolvePantryItem(ingrediente);
        if(pantryIt) pantryIt.qty = 0;
        const already = Object.values(state.shopExtras).some(x => x.ingrediente.trim().toLowerCase() === ingrediente.trim().toLowerCase());
        if(!already){
          const id = 'extra_' + Date.now() + '_' + Math.random().toString(36).slice(2,7);
          state.shopExtras[id] = { ingrediente, qta: '' };
        }
      });
      // Avanzo fisico segnalato dall'utente: voce a sé in Dispensa, come
      // presenza/assenza (nessuna quantità da tracciare) nel luogo scelto —
      // indipendente dal collegamento "Segna come avanzata" (quello vincola
      // un pasto futuro preciso, questo è solo "c'è in dispensa/frigo/...").
      // Il checkbox (deselezionato di default) decide se va aggiunto: il
      // testo da solo non basta, va spuntato esplicitamente.
      const leftover = (state.doneModalLeftover || '').trim();
      if(state.doneModalLeftoverChecked && leftover){
        const leftoverKey = leftover.toLowerCase();
        const existing = state.pantryItems[leftoverKey];
        upsertPantryItem(leftover, state.doneModalLeftoverLuogo, 1, 'none', state.doneModalLeftoverCat);
        // Segnato come avanzo (vedi isLeftoverPantryItem) anche se il reparto
        // scelto non è "Avanzi" — ma non se il nome coincide con un
        // ingrediente vero già in Dispensa, che deve restare tale.
        if(!existing || existing.leftover) state.pantryItems[leftoverKey].leftover = true;
      }
      const mealsDone = weekMealsDoneRef(weekIdx);
      if(!mealsDone[i]) mealsDone[i] = {};
      mealsDone[i][meal] = true;
      state.doneModalDay = null;
      state.doneModalQty = {};
      state.doneQtyEditingKey = null;
      state.doneModalFinished = {};
      state.doneModalLeftover = '';
      state.doneModalLeftoverLuogo = 'frigo';
      state.doneModalLeftoverCat = 'avanzi';
      state.doneModalLeftoverChecked = false;
      state.doneModalLeftoverPickerOpen = false;
      state.doneModalLeftoverCatPickerOpen = false;
      persist(); render();
    });
  });

  // Il dettaglio del pasto ora apre a tutto schermo (vedi
  // renderMealDetailScreen) invece che ad accordion nella card: niente più
  // scroll-fino-alla-card, l'overlay è "position:fixed" e parte già in
  // cima da solo, essendo un elemento nuovo a ogni apertura.
  document.querySelectorAll('[data-toggle-day]').forEach(el=>{
    el.addEventListener('click', e=>{
      const key = e.target.dataset.toggleDay;
      state.expandedDay = state.expandedDay !== key ? key : null;
      render();
    });
  });
  document.querySelectorAll('[data-close-meal-detail]').forEach(el=>{
    el.addEventListener('click', ()=>{
      state.expandedDay = null;
      render();
    });
  });
  document.querySelectorAll('[data-scroll-to-day]').forEach(el=>{
    el.addEventListener('click', e=>{
      const [w, i] = e.currentTarget.dataset.scrollToDay.split('_');
      // Solo colpo d'occhio nella striscia: i giorni già passati non hanno una
      // card visibile (vedi startPos in renderWeekSection), il tap non fa nulla.
      const card = document.querySelector(`.day-card[data-week-idx="${CSS.escape(w)}"][data-day-index="${CSS.escape(i)}"]`);
      if(!card) return;
      const topbar = document.querySelector('.topbar');
      const offset = (topbar ? topbar.offsetHeight : 0) + 8;
      const top = card.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  document.querySelectorAll('[data-add-ing]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const key = e.target.dataset.addIng;
      const nameInput = document.querySelector(`[data-ning="${key}"]`);
      const qtaInput = document.querySelector(`[data-nqta="${key}"]`);
      const ingrediente = nameInput.value.trim();
      const qta = qtaInput.value.trim();
      if(!ingrediente) return;
      const { weekIdx, i, meal } = parseMealKey(key);
      const recipeName = effectiveRecipeName(weekIdx, i, meal);
      if(!state.recipeIngredients[recipeName]) state.recipeIngredients[recipeName] = [];
      state.recipeIngredients[recipeName].push({ingrediente, qta, dove:'', note:''});
      persist(); render();
      state.expandedDay = key;
    });
  });

  document.querySelectorAll('[data-toggle-recipe]').forEach(el=>{
    el.addEventListener('click', e=>{
      const name = el.dataset.toggleRecipe;
      state.expandedRecipe = state.expandedRecipe !== name ? name : null;
      render();
    });
  });

  document.querySelectorAll('[data-add-ing-recipe]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const recipeName = e.target.dataset.addIngRecipe;
      const nameInput = document.querySelector(`[data-rning="${CSS.escape(recipeName)}"]`);
      const qtaInput = document.querySelector(`[data-rnqta="${CSS.escape(recipeName)}"]`);
      const ingrediente = nameInput.value.trim();
      const qta = qtaInput.value.trim();
      if(!ingrediente) return;
      if(!state.recipeIngredients[recipeName]) state.recipeIngredients[recipeName] = [];
      state.recipeIngredients[recipeName].push({ingrediente, qta, dove:'', note:''});
      persist(); render();
    });
  });

  document.querySelectorAll('[data-open-recipe-edit]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      state.recipeEditName = e.currentTarget.dataset.openRecipeEdit;
      render();
    });
  });
  document.querySelectorAll('[data-close-recipe-edit]').forEach(el=>{
    el.addEventListener('click', e=>{
      if(e.target.hasAttribute('data-stop-close')) return;
      state.recipeEditName = null;
      render();
    });
  });
  const recipeEditModal = document.querySelector('.recipe-edit-modal');
  if(recipeEditModal){
    // Aggiungere/rimuovere righe o attivare una stagione non richiede un render
    // completo: si manipola solo il DOM del form, per non perdere il testo che
    // si sta scrivendo negli altri campi (a differenza del resto dell'app, che
    // ri-renderizza tutto a ogni modifica).
    recipeEditModal.addEventListener('click', e=>{
      if(e.target.closest('[data-remove-row]')){
        e.target.closest('.edit-ing-row, .edit-step-row').remove();
        return;
      }
      const stagioneChip = e.target.closest('[data-stagione-chip]');
      if(stagioneChip){
        stagioneChip.classList.toggle('active');
        return;
      }
      if(e.target.closest('#edit-add-ing-row')){
        const list = document.getElementById('edit-ing-list');
        list.insertAdjacentHTML('beforeend', editIngRowHtml('', ''));
        attachIngredientCombobox(list.lastElementChild.querySelector('.edit-ing-name'));
        return;
      }
      if(e.target.closest('#edit-add-step-row')){
        document.getElementById('edit-step-list').insertAdjacentHTML('beforeend', editStepRowHtml(''));
        return;
      }
    });
  }
  document.querySelectorAll('[data-save-recipe-edit]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const name = e.currentTarget.dataset.saveRecipeEdit;
      const ingredienti = Array.from(document.querySelectorAll('#edit-ing-list .edit-ing-row')).map(row=>({
        ingrediente: row.querySelector('.edit-ing-name').value.trim(),
        qta: row.querySelector('.edit-ing-qta').value.trim()
      })).filter(it=>it.ingrediente);
      const procedimento = Array.from(document.querySelectorAll('#edit-step-list .edit-step-text'))
        .map(el=>el.value.trim()).filter(Boolean);
      const stagioni = Array.from(document.querySelectorAll('#edit-stagioni [data-stagione-chip].active'))
        .map(el=>el.dataset.stagioneChip);
      state.recipeEdits[name] = {
        tempo: document.getElementById('edit-tempo').value.trim(),
        tempoBucket: document.getElementById('edit-tempo-bucket').value,
        porzioni: document.getElementById('edit-porzioni').value.trim(),
        categoriaNew: document.getElementById('edit-categoria').value,
        tipologia: document.getElementById('edit-tipologia').value,
        base: document.getElementById('edit-base').value,
        proteina: document.getElementById('edit-proteina').value,
        stagioni: stagioni.length ? stagioni : ['tutto'],
        freezerNew: document.getElementById('edit-freezer-new').value,
        avanziNew: document.getElementById('edit-avanzi-new').value,
        pianificazione: document.getElementById('edit-pianificazione').value,
        ingredienti,
        procedimento,
        ricordare: document.getElementById('edit-ricordare').value.trim(),
        avanzi: document.getElementById('edit-avanzi-note').value.trim(),
        freezer: document.getElementById('edit-freezer-note').value.trim(),
        link: document.getElementById('edit-link').value.trim()
      };
      state.recipeEditName = null;
      persist(); render();
    });
  });
  document.querySelectorAll('[data-delete-recipe]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const name = e.currentTarget.dataset.deleteRecipe;
      const planningSnap = snapshotPlanningState();
      const prevRecipeEdit = state.recipeEdits[name];
      const prevRecipeIngredients = state.recipeIngredients[name];
      const prevCustomRecipe = state.customRecipes[name];
      const hadHidden = Object.prototype.hasOwnProperty.call(state.hiddenRecipes, name);
      // Toglie ogni riferimento dalla pianificazione PRIMA di cancellare i
      // dati della ricetta stessa — altrimenti restava scelta (o persino
      // ripescata rigenerando, se il pasto era bloccato) su qualunque
      // pasto che la usava già, pur sparendo dal Ricettario.
      purgeRecipeFromPlanning(name);
      delete state.recipeEdits[name];
      delete state.recipeIngredients[name];
      if(state.customRecipes[name]) delete state.customRecipes[name];
      else state.hiddenRecipes[name] = true;
      if(state.expandedRecipe === name) state.expandedRecipe = null;
      state.recipeEditName = null;
      persist(); render();
      showUndoToast('Ricetta eliminata', ()=>{
        restorePlanningState(planningSnap);
        if(prevRecipeEdit !== undefined) state.recipeEdits[name] = prevRecipeEdit;
        if(prevRecipeIngredients !== undefined) state.recipeIngredients[name] = prevRecipeIngredients;
        if(prevCustomRecipe !== undefined) state.customRecipes[name] = prevCustomRecipe;
        if(hadHidden) state.hiddenRecipes[name] = true; else delete state.hiddenRecipes[name];
        persist(); render();
      });
    });
  });

  document.querySelectorAll('[data-open-filters]').forEach(btn=>{
    btn.addEventListener('click', ()=>{ state.filtersOpen = true; render(); });
  });
  document.querySelectorAll('[data-close-filters]').forEach(el=>{
    el.addEventListener('click', e=>{
      if(e.target.hasAttribute('data-stop-close')) return;
      state.filtersOpen = false; render();
    });
  });
  // Scoperto a #panel: senza, document.querySelector prendeva il PRIMO
  // [data-stop-close] di tutto il documento, che essendo il topbar-menu
  // (nell'header, prima di #panel nel markup) si beccava lui lo
  // stopPropagation a ogni render — bloccando ogni click al suo interno
  // prima che potesse risalire fino al listener sul backdrop del menu.
  const panelEl = document.getElementById('panel');
  const stopClose = panelEl && panelEl.querySelector('[data-stop-close]');
  if(stopClose) stopClose.addEventListener('click', e=>{ e.stopPropagation(); });
  const clearFilters = document.getElementById('clear-filters');
  if(clearFilters) clearFilters.addEventListener('click', ()=>{
    state.filters = { cat:[], tipo:[], tempo:'', pian:'', stagione:'', avanzi:'', freezer:'', grad:'', attrezz:'', search: state.filters.search };
    render();
  });

  document.querySelectorAll('[data-close-new-recipe-modal]').forEach(el=>{
    el.addEventListener('click', e=>{
      if(e.target.hasAttribute('data-stop-close')) return;
      state.newRecipeModalOpen = false;
      state.newRecipeError = '';
      render();
    });
  });
  const newRecipeCreateBtn = document.getElementById('new-recipe-create-btn');
  if(newRecipeCreateBtn){
    const nameInput = document.getElementById('new-recipe-name');
    const doCreate = ()=>{
      const name = nameInput.value.trim();
      if(!name){ state.newRecipeError = 'Inserisci un nome.'; render(); return; }
      const nameLower = name.toLowerCase();
      const exists = Object.keys(recipeByName).some(n=>n.toLowerCase()===nameLower)
        || Object.keys(state.customRecipes).some(n=>n.toLowerCase()===nameLower);
      if(exists){ state.newRecipeError = 'Esiste già una ricetta con questo nome.'; render(); return; }
      state.customRecipes[name] = { nome: name };
      state.newRecipeModalOpen = false;
      state.newRecipeError = '';
      state.recipeEditName = name;
      persist(); render();
    };
    newRecipeCreateBtn.addEventListener('click', doCreate);
    nameInput.addEventListener('keydown', e=>{ if(e.key === 'Enter') doCreate(); });
  }

  const fSearch = document.getElementById('f-search');
  if(fSearch) fSearch.addEventListener('input', e=>{ state.filters.search = e.target.value; render(); });
  const pantrySearch = document.getElementById('pantry-search');
  if(pantrySearch) pantrySearch.addEventListener('input', e=>{ state.pantrySearch = e.target.value; render(); });
  // "+" di Ricette: stesso modale di "+ Aggiungi ricetta" nel menu ⋯
  // (nascosto mentre la ricerca è aperta, come in Dispensa).
  const prepFab = document.getElementById('prep-fab');
  if(prepFab) prepFab.addEventListener('click', ()=>{ state.newRecipeModalOpen = true; state.newRecipeError = ''; render(); });
  const prepSearchToggle = document.getElementById('prep-search-toggle');
  if(prepSearchToggle) prepSearchToggle.addEventListener('click', ()=>{
    state.prepSearchOpen = true;
    render();
    const el = document.getElementById('f-search');
    if(el) el.focus();
  });
  const prepSearchClose = document.getElementById('prep-search-close');
  // Stessa X unica della ricerca in Dispensa (vedi pantry-search-close):
  // con del testo lo cancella, a campo vuoto chiude la ricerca.
  if(prepSearchClose) prepSearchClose.addEventListener('click', ()=>{
    if(state.filters.search){
      state.filters.search = '';
      render();
      const el = document.getElementById('f-search');
      if(el) el.focus();
      return;
    }
    state.prepSearchOpen = false;
    render();
  });
  // "+" di Dispensa: stesso modale di "+ Aggiungi ingrediente" nel menu ⋯
  // (titolo/categoria di ripiego seguono la vista Cibo/Casa aperta).
  const pantryFab = document.getElementById('pantry-fab');
  if(pantryFab) pantryFab.addEventListener('click', ()=>{ state.pantryAddModalOpen = true; render(); });
  const pantrySearchToggle = document.getElementById('pantry-search-toggle');
  if(pantrySearchToggle) pantrySearchToggle.addEventListener('click', ()=>{
    state.pantrySearchOpen = true;
    render();
    const el = document.getElementById('pantry-search');
    if(el) el.focus();
  });
  const pantrySearchClose = document.getElementById('pantry-search-close');
  // Un'unica X (quella nativa del campo di ricerca è nascosta in CSS): con
  // del testo scritto lo cancella e lascia il campo aperto per una nuova
  // ricerca, a campo vuoto chiude la ricerca.
  if(pantrySearchClose) pantrySearchClose.addEventListener('click', ()=>{
    if(state.pantrySearch){
      state.pantrySearch = '';
      render();
      const el = document.getElementById('pantry-search');
      if(el) el.focus();
      return;
    }
    state.pantrySearchOpen = false;
    render();
  });

  document.querySelectorAll('.chip-row [data-f]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const f = e.target.dataset.f, v = e.target.dataset.v;
      state.filters[f] = v;
      render();
    });
  });
  // Categoria: multi-selezione, a differenza degli altri filtri (un solo valore).
  document.querySelectorAll('[data-cat-chip]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const c = e.currentTarget.dataset.catChip;
      const idx = state.filters.cat.indexOf(c);
      if(idx === -1) state.filters.cat.push(c); else state.filters.cat.splice(idx, 1);
      render();
    });
  });
  document.querySelectorAll('[data-cat-clear]').forEach(btn=>{
    btn.addEventListener('click', ()=>{ state.filters.cat = []; render(); });
  });
  // Tipologia: stessa logica multi-selezione di Categoria, dimensione separata.
  document.querySelectorAll('[data-tipo-chip]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const t = e.currentTarget.dataset.tipoChip;
      const idx = state.filters.tipo.indexOf(t);
      if(idx === -1) state.filters.tipo.push(t); else state.filters.tipo.splice(idx, 1);
      render();
    });
  });
  document.querySelectorAll('[data-tipo-clear]').forEach(btn=>{
    btn.addEventListener('click', ()=>{ state.filters.tipo = []; render(); });
  });
  [['f-tempo','tempo'],['f-pian','pian'],['f-stagione','stagione'],['f-avanzi','avanzi'],['f-freezer','freezer'],['f-grad','grad'],['f-attrezz','attrezz']].forEach(([id,key])=>{
    const el = document.getElementById(id);
    if(el) el.addEventListener('change', e=>{ state.filters[key] = e.target.value; render(); });
  });

  document.querySelectorAll('[data-pantry-view]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      state.pantryView = e.target.dataset.pantryView;
      render();
    });
  });
  document.querySelectorAll('[data-toggle-shop-finiti]').forEach(el=>{
    el.addEventListener('click', ()=>{
      state.shopFinitiOpen = !state.shopFinitiOpen;
      render();
    });
  });
  document.querySelectorAll('[data-toggle-shop-section]').forEach(el=>{
    el.addEventListener('click', e=>{
      const id = e.currentTarget.dataset.toggleShopSection;
      state.shopSectionCollapsed[id] = !state.shopSectionCollapsed[id];
      render();
    });
  });
  document.querySelectorAll('[data-toggle-pantry-section]').forEach(el=>{
    el.addEventListener('click', e=>{
      const id = e.currentTarget.dataset.togglePantrySection;
      state.pantrySectionCollapsed[id] = !state.pantrySectionCollapsed[id];
      render();
    });
  });
  const pantrySelectionDeleteBtn = document.getElementById('pantry-selection-delete');
  if(pantrySelectionDeleteBtn) pantrySelectionDeleteBtn.addEventListener('click', ()=>{
    const removed = {};
    Object.keys(state.pantrySelected).forEach(key=>{
      if(state.pantryItems[key]) removed[key] = state.pantryItems[key];
      delete state.pantryItems[key];
    });
    state.pantrySelectMode = false;
    state.pantrySelected = {};
    persist(); render();
    const removedKeys = Object.keys(removed);
    if(removedKeys.length) showUndoToast(removedKeys.length === 1 ? 'Ingrediente eliminato' : `${removedKeys.length} ingredienti eliminati`, ()=>{
      removedKeys.forEach(key=>{ state.pantryItems[key] = removed[key]; });
      persist(); render();
    });
  });
  const pantrySelectionCancelBtn = document.getElementById('pantry-selection-cancel');
  if(pantrySelectionCancelBtn) pantrySelectionCancelBtn.addEventListener('click', ()=>{
    state.pantrySelectMode = false;
    state.pantrySelected = {};
    render();
  });
  const pantrySelectionMarkBtn = document.getElementById('pantry-selection-mark');
  if(pantrySelectionMarkBtn) pantrySelectionMarkBtn.addEventListener('click', ()=>{
    Object.keys(state.pantrySelected).forEach(key=>{
      const it = state.pantryItems[key];
      if(!it) return;
      if(typeof it.qty === 'number' && it.qty <= 0){
        // Finito: riusa lo stesso record già in Spesa, non ne crea uno nuovo.
        state.pantryConfirmedShop[key] = true;
        delete state.shopDismissed[`oos_${key}`];
      } else {
        // Ce l'hai ancora ma lo vuoi comunque in lista (es. sta per finire):
        // stessa strada di un'aggiunta manuale da Spesa, solo se non c'è già.
        const already = Object.values(state.shopExtras).some(ex => (ex.ingrediente||'').trim().toLowerCase() === key);
        if(!already){
          const id = 'extra_' + Date.now() + '_' + Math.random().toString(36).slice(2,7);
          state.shopExtras[id] = { ingrediente: it.nome, qta: '' };
        }
      }
    });
    state.pantrySelectMode = false;
    state.pantrySelected = {};
    persist(); render();
  });
  document.querySelectorAll('[data-luogo-toggle]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const key = e.currentTarget.dataset.luogoToggle;
      state.pantryLuogoPicker = state.pantryLuogoPicker === key ? null : key;
      render();
    });
  });
  // Selezione multipla in Dispensa: pressione lunga sulla riga per entrare in
  // modalità selezione, poi un tap semplice sulle altre righe seleziona/
  // deseleziona. L'icona del luogo resta un'eccezione — un suo tap cambia
  // sempre luogo, anche in modalità selezione, quindi qui si esclude sempre
  // dal toggle (il click page-level la intercetta comunque per prima, in fase
  // di cattura, prima che i bottoni annidati facciano la loro azione normale).
  document.querySelectorAll('[data-pantry-row]').forEach(row=>{
    const key = row.dataset.pantryRow;
    let pressTimer = null;
    let longPressed = false;
    const toggleSelected = ()=>{
      if(state.pantrySelected[key]) delete state.pantrySelected[key];
      else state.pantrySelected[key] = true;
    };
    // Lo stepper +/- resta sempre fuori dalla selezione (né pressione lunga né
    // tap-per-selezionare): altrimenti un doppio tocco rapido per aggiustare
    // la quantità finisce per selezionare la riga invece di cambiare il numero.
    row.addEventListener('pointerdown', e=>{
      if(e.target.closest('[data-luogo-toggle]') || e.target.closest('.qty-stepper')) return;
      longPressed = false;
      pressTimer = setTimeout(()=>{
        longPressed = true;
        state.pantrySelectMode = true;
        toggleSelected();
        render();
      }, 500);
    });
    const cancelPress = ()=> clearTimeout(pressTimer);
    row.addEventListener('pointerup', cancelPress);
    row.addEventListener('pointerleave', cancelPress);
    row.addEventListener('pointercancel', cancelPress);
    row.addEventListener('click', e=>{
      if(longPressed){ longPressed = false; e.stopPropagation(); return; }
      if(!state.pantrySelectMode) return;
      if(e.target.closest('[data-luogo-toggle]') || e.target.closest('.luogo-picker') || e.target.closest('.luogo-picker-backdrop') || e.target.closest('.qty-stepper')) return;
      e.stopPropagation();
      toggleSelected();
      render();
    }, true);
  });
  document.querySelectorAll('[data-luogo-picker-close]').forEach(el=>{
    el.addEventListener('click', ()=>{ state.pantryLuogoPicker = null; render(); });
  });
  document.querySelectorAll('[data-luogo-set]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const it = state.pantryItems[e.currentTarget.dataset.luogoSet];
      if(it) it.luogo = e.currentTarget.dataset.luogoValue;
      state.pantryLuogoPicker = null;
      persist(); render();
    });
  });
  document.querySelectorAll('[data-qty-dec]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const key = e.currentTarget.dataset.qtyDec;
      const it = state.pantryItems[key];
      if(!it) return;
      const step = qtyStepFor(it.unit);
      it.qty = Math.max(0, Math.round(((typeof it.qty === 'number' ? it.qty : 0) - step) * 100) / 100);
      if(finishLeftoverWithUndo(key)) return;
      persist(); render();
    });
  });
  document.querySelectorAll('[data-qty-show]').forEach(el=>{
    el.addEventListener('click', e=>{
      state.pantryEditingKey = e.currentTarget.dataset.qtyShow;
      render();
    });
  });
  // Unità "Non mostrare": una spunta al posto dello stepper. Spuntata = 1
  // (presente), tolta = 0 (finita, va in Finiti — stesso stato di qty=0
  // ovunque nell'app, solo la UI cambia).
  document.querySelectorAll('[data-presence-toggle]').forEach(cb=>{
    cb.addEventListener('change', e=>{
      const key = e.currentTarget.dataset.presenceToggle;
      const it = state.pantryItems[key];
      if(!it) return;
      it.qty = e.currentTarget.checked ? 1 : 0;
      if(it.qty > 0) delete state.pantryConfirmedShop[key];
      if(finishLeftoverWithUndo(key)) return;
      persist(); render();
    });
  });
  const qtyEditInput = document.querySelector('[data-qty-edit]');
  if(qtyEditInput){
    qtyEditInput.focus();
    qtyEditInput.select();
    const commitQtyEdit = ()=>{
      const key = qtyEditInput.dataset.qtyEdit;
      const it = state.pantryItems[key];
      if(it){
        const n = parseFloat(qtyEditInput.value);
        it.qty = Number.isNaN(n) ? 0 : Math.max(0, n);
        if(it.qty > 0) delete state.pantryConfirmedShop[key];
      }
      state.pantryEditingKey = null;
      persist(); render();
    };
    qtyEditInput.addEventListener('blur', commitQtyEdit);
    qtyEditInput.addEventListener('keydown', e=>{ if(e.key === 'Enter') qtyEditInput.blur(); });
  }
  document.querySelectorAll('[data-inv-remove]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      delete state.pantryItems[e.currentTarget.dataset.invRemove];
      persist(); render();
    });
  });
  const pantryAddBtn = document.getElementById('pantry-add-btn');
  if(pantryAddBtn){
    const nameInput = document.getElementById('pantry-add-name');
    const catSelect = document.getElementById('pantry-add-cat');
    const groupSelect = document.getElementById('pantry-add-group');
    const luogoSelect = document.getElementById('pantry-add-luogo');
    const unitSelect = document.getElementById('pantry-add-unit');
    const doAdd = ()=>{
      if(!nameInput.value.trim()) return;
      // Dalla vista Casa, un prodotto che la categoria automatica non
      // riconosce come "di casa" finisce in Casa › Altro invece che nel cibo.
      let cat = catSelect ? catSelect.value : '';
      if(!cat && state.pantryView === 'casa' && !isNonFoodDept(classifyDept(nameInput.value))) cat = 'altro-casa';
      upsertPantryItem(nameInput.value, luogoSelect.value, undefined, unitSelect ? unitSelect.value : '', cat, groupSelect ? groupSelect.value : '');
      // Se è finito nell'altra vista (es. "Detersivo" aggiunto da Cibo), ci
      // si sposta lì: altrimenti sembrerebbe non essere stato aggiunto.
      const addedIsHome = isNonFoodDept(knownDept(cat) || classifyDept(nameInput.value));
      state.pantryView = addedIsHome ? 'casa' : 'cibo';
      state.pantryAddModalOpen = false;
      persist(); render();
    };
    pantryAddBtn.addEventListener('click', doAdd);
    nameInput.addEventListener('keydown', e=>{ if(e.key === 'Enter') doAdd(); });
  }
  document.querySelectorAll('[data-close-pantry-add-modal]').forEach(el=>{
    el.addEventListener('click', e=>{
      if(e.target.hasAttribute('data-stop-close')) return;
      state.pantryAddModalOpen = false;
      render();
    });
  });
  // Se scegli un gruppo mentre la Categoria è ancora su "Automatica", la
  // precompiliamo dal gruppo — ma senza toccarla se l'hai già scelta a mano,
  // e senza chiamare render() (altrimenti il nome già digitato andrebbe perso).
  const addGroupSelect = document.getElementById('pantry-add-group');
  if(addGroupSelect){
    addGroupSelect.addEventListener('change', e=>{
      const catSelect = document.getElementById('pantry-add-cat');
      const group = state.pantryGroups[e.target.value];
      if(catSelect && !catSelect.value && group && group.cat) catSelect.value = group.cat;
    });
  }
  document.querySelectorAll('[data-open-pantry-groups]').forEach(btn=>{
    btn.addEventListener('click', ()=>{ state.pantryGroupsModalOpen = true; render(); });
  });
  document.querySelectorAll('[data-close-pantry-groups]').forEach(el=>{
    el.addEventListener('click', e=>{
      if(e.target.hasAttribute('data-stop-close')) return;
      state.pantryGroupsModalOpen = false;
      render();
    });
  });
  document.querySelectorAll('[data-close-ingredient-manager]').forEach(el=>{
    el.addEventListener('click', e=>{
      if(e.target.hasAttribute('data-stop-close')) return;
      state.ingredientManagerOpen = false;
      render();
    });
  });
  const ingredientManagerSearch = document.getElementById('ingredient-manager-search');
  if(ingredientManagerSearch) ingredientManagerSearch.addEventListener('input', e=>{
    state.ingredientManagerSearch = e.target.value;
    render(); // fuoco e cursore: vedi restoreFocus
  });
  const ingredientManagerSearchClear = document.getElementById('ingredient-manager-search-clear');
  if(ingredientManagerSearchClear) ingredientManagerSearchClear.addEventListener('click', ()=>{
    state.ingredientManagerSearch = '';
    render();
    const el = document.getElementById('ingredient-manager-search');
    if(el) el.focus();
  });
  // Riusa l'edit modale già esistente di Dispensa: se l'ingrediente non ha
  // ancora una voce in pantryItems gliene crea una a quantità 0 (invisibile
  // nelle viste normali finché non imposti una scorta reale, come i
  // "Finiti"), poi apre lo stesso modale di modifica di sempre.
  document.querySelectorAll('[data-manage-ingredient]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const name = e.currentTarget.dataset.manageIngredient;
      const key = name.trim().toLowerCase();
      if(!state.pantryItems[key]) upsertPantryItem(name, 'dispensa', 0);
      state.ingredientManagerOpen = false;
      state.pantryEditKey = key;
      persist(); render();
    });
  });
  document.querySelectorAll('[data-group-label]').forEach(inp=>{
    inp.addEventListener('change', e=>{
      const id = e.currentTarget.dataset.groupLabel;
      if(state.pantryGroups[id]){ state.pantryGroups[id].label = e.currentTarget.value.trim() || state.pantryGroups[id].label; persist(); render(); }
    });
  });
  document.querySelectorAll('[data-group-match]').forEach(inp=>{
    inp.addEventListener('change', e=>{
      const id = e.currentTarget.dataset.groupMatch;
      if(state.pantryGroups[id]){ state.pantryGroups[id].matchName = e.currentTarget.value.trim().toLowerCase(); persist(); render(); }
    });
  });
  document.querySelectorAll('[data-group-cat]').forEach(sel=>{
    sel.addEventListener('change', e=>{
      const id = e.currentTarget.dataset.groupCat;
      if(state.pantryGroups[id]){ state.pantryGroups[id].cat = e.currentTarget.value; persist(); render(); }
    });
  });
  document.querySelectorAll('[data-group-delete]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const id = e.currentTarget.dataset.groupDelete;
      delete state.pantryGroups[id];
      // Le voci di Dispensa che lo usavano restano, solo senza più un gruppo:
      // non è un dato perso, si può riassegnare in un secondo momento.
      Object.values(state.pantryItems).forEach(it=>{ if(it.group === id) delete it.group; });
      persist(); render();
    });
  });
  const addGroupBtn = document.getElementById('add-group-btn');
  if(addGroupBtn){
    addGroupBtn.addEventListener('click', ()=>{
      const labelInput = document.getElementById('new-group-label');
      const matchInput = document.getElementById('new-group-match');
      const catSelect = document.getElementById('new-group-cat');
      const label = labelInput.value.trim();
      const matchName = matchInput.value.trim().toLowerCase();
      if(!label || !matchName) return;
      let slug = label.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-+|-+$)/g,'') || 'gruppo';
      let candidate = slug, n = 2;
      while(state.pantryGroups[candidate]) candidate = `${slug}-${n++}`;
      state.pantryGroups[candidate] = { label, matchName, cat: catSelect.value || '' };
      persist(); render();
    });
  }

  document.querySelectorAll('[data-open-depts]').forEach(btn=>{
    btn.addEventListener('click', ()=>{ state.deptsModalOpen = true; render(); });
  });
  document.querySelectorAll('[data-close-depts]').forEach(el=>{
    el.addEventListener('click', e=>{
      if(e.target.hasAttribute('data-stop-close')) return;
      state.deptsModalOpen = false;
      render();
    });
  });
  // Per una categoria di base la voce in customDepts si crea al primo
  // cambio; svuotare il campo la riporta al nome/emoji originale.
  const deptEntry = id=>{
    if(!state.customDepts) state.customDepts = {};
    if(!state.customDepts[id]) state.customDepts[id] = {};
    return state.customDepts[id];
  };
  document.querySelectorAll('[data-dept-label]').forEach(inp=>{
    inp.addEventListener('change', e=>{
      const id = e.currentTarget.dataset.deptLabel;
      const value = e.currentTarget.value.trim();
      if(BASE_DEPT_LABEL[id]){
        const d = deptEntry(id);
        if(value && value !== BASE_DEPT_LABEL[id]) d.label = value; else delete d.label;
        if(!d.label && !d.icon) delete state.customDepts[id];
      } else if(state.customDepts[id] && value){
        state.customDepts[id].label = value;
      }
      persist(); render();
    });
  });
  document.querySelectorAll('[data-dept-icon]').forEach(inp=>{
    inp.addEventListener('change', e=>{
      const id = e.currentTarget.dataset.deptIcon;
      const value = e.currentTarget.value.trim();
      if(BASE_DEPT_LABEL[id]){
        const d = deptEntry(id);
        if(value && value !== BASE_DEPT_ICON[id]) d.icon = value; else delete d.icon;
        if(!d.label && !d.icon) delete state.customDepts[id];
      } else if(state.customDepts[id]){
        state.customDepts[id].icon = value || '🏷️';
      }
      persist(); render();
    });
  });
  document.querySelectorAll('[data-dept-type]').forEach(sel=>{
    sel.addEventListener('change', e=>{
      const d = state.customDepts[e.currentTarget.dataset.deptType];
      if(!d) return;
      if(e.currentTarget.value === 'casa') d.nonFood = true; else delete d.nonFood;
      persist(); render();
    });
  });
  document.querySelectorAll('[data-dept-delete]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const id = e.currentTarget.dataset.deptDelete;
      delete state.customDepts[id];
      // Chi la usava torna alla categoria automatica (dal nome): le voci di
      // Dispensa, gli aggiunti a mano in Spesa e i gruppi che la suggerivano.
      Object.values(state.pantryItems).forEach(it=>{ if(it.cat === id) delete it.cat; });
      Object.values(state.shopExtras).forEach(it=>{ if(it.cat === id) delete it.cat; });
      Object.values(state.pantryGroups).forEach(g=>{ if(g.cat === id) g.cat = ''; });
      persist(); render();
    });
  });
  const addDeptBtn = document.getElementById('add-dept-btn');
  if(addDeptBtn){
    addDeptBtn.addEventListener('click', ()=>{
      const labelInput = document.getElementById('new-dept-label');
      const iconInput = document.getElementById('new-dept-icon');
      const label = labelInput.value.trim();
      if(!label) return;
      if(!state.customDepts) state.customDepts = {};
      // Prefisso "c-": non si scontra mai con gli id delle categorie di base.
      const slug = 'c-' + (label.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-+|-+$)/g,'') || 'categoria');
      let id = slug, n = 2;
      while(state.customDepts[id]) id = `${slug}-${n++}`;
      const typeSelect = document.getElementById('new-dept-type');
      state.customDepts[id] = Object.assign({ label, icon: iconInput.value.trim() || '🏷️' }, typeSelect && typeSelect.value === 'casa' ? { nonFood: true } : {});
      persist(); render();
    });
  }
  document.querySelectorAll('[data-pantry-edit]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      state.pantryEditKey = e.currentTarget.dataset.pantryEdit;
      render();
    });
  });
  document.querySelectorAll('[data-close-pantry-edit]').forEach(el=>{
    el.addEventListener('click', e=>{
      if(e.target.hasAttribute('data-stop-close')) return;
      state.pantryEditKey = null; render();
    });
  });
  const editNameInput = document.getElementById('pantry-edit-name');
  if(editNameInput){
    editNameInput.addEventListener('change', e=>{
      state.pantryEditKey = renamePantryItem(state.pantryEditKey, e.target.value);
      persist(); render();
    });
  }
  const editCatSelect = document.getElementById('pantry-edit-cat');
  if(editCatSelect){
    editCatSelect.addEventListener('change', e=>{
      const it = state.pantryItems[state.pantryEditKey];
      if(it){
        if(e.target.value) it.cat = e.target.value; else delete it.cat;
        persist(); render();
      }
    });
  }
  const editGroupSelect = document.getElementById('pantry-edit-group');
  if(editGroupSelect){
    editGroupSelect.addEventListener('change', e=>{
      const it = state.pantryItems[state.pantryEditKey];
      if(it){
        if(e.target.value) it.group = e.target.value; else delete it.group;
        // Precompila la categoria dal gruppo solo se non l'avevi già scelta a
        // mano — una scelta manuale esistente vince sempre.
        const group = state.pantryGroups[e.target.value];
        if(!it.cat && group && group.cat) it.cat = group.cat;
        persist(); render();
      }
    });
  }
  const editLuogoSelect = document.getElementById('pantry-edit-luogo');
  if(editLuogoSelect){
    editLuogoSelect.addEventListener('change', e=>{
      const it = state.pantryItems[state.pantryEditKey];
      if(it){ it.luogo = e.target.value; persist(); render(); }
    });
  }
  const editQtyInput = document.getElementById('pantry-edit-qty');
  if(editQtyInput){
    editQtyInput.addEventListener('change', e=>{
      const it = state.pantryItems[state.pantryEditKey];
      if(it){
        const n = parseFloat(e.target.value);
        it.qty = Number.isNaN(n) ? 0 : Math.max(0, n);
        persist(); render();
      }
    });
  }
  const editUnitSelect = document.getElementById('pantry-edit-unit');
  if(editUnitSelect){
    editUnitSelect.addEventListener('change', e=>{
      const it = state.pantryItems[state.pantryEditKey];
      if(it){
        if(e.target.value) it.unit = e.target.value; else delete it.unit;
        persist(); render();
      }
    });
  }
  const editDeleteBtn = document.getElementById('pantry-edit-delete');
  if(editDeleteBtn){
    editDeleteBtn.addEventListener('click', ()=>{
      delete state.pantryItems[state.pantryEditKey];
      state.pantryEditKey = null;
      persist(); render();
    });
  }
}

document.querySelectorAll('nav.tabs button').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    state.tab = btn.dataset.tab;
    window.location.hash = state.tab;
    render();
  });
});

// Sposta di una posizione tra le tab (bordo escluso: niente giro su sé stesse).
function goToTab(delta){
  const idx = TAB_KEYS.indexOf(state.tab);
  const next = TAB_KEYS[Math.min(TAB_KEYS.length - 1, Math.max(0, idx + delta))];
  if(next !== state.tab){
    state.tab = next;
    window.location.hash = next;
    render();
  }
}

// Swipe orizzontale sulla barra in basso per cambiare tab, come in WhatsApp.
// Solo touch (è un gesto mobile): non intercetta il mouse. Prima lo swipe per
// cambiare tab funzionava su tutto il contenuto, ma così rubava il gesto a
// chi voleva scorrere lateralmente dentro la pagina (vedi sotto) — ora vive
// solo sulla barra, che altrimenti si usa solo a tap.
(function(){
  const nav = document.querySelector('nav.tabs');
  if(!nav) return;
  const THRESHOLD = 60, MAX_VERTICAL = 60;
  let startX = 0, startY = 0, tracking = false;
  nav.addEventListener('touchstart', e=>{
    if(e.touches.length !== 1){ tracking = false; return; }
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    tracking = true;
  }, { passive: true });
  nav.addEventListener('touchend', e=>{
    if(!tracking) return;
    tracking = false;
    const t = e.changedTouches[0];
    const dx = t.clientX - startX, dy = t.clientY - startY;
    if(Math.abs(dx) < THRESHOLD || Math.abs(dy) > MAX_VERTICAL) return;
    goToTab(dx < 0 ? 1 : -1);
  }, { passive: true });
})();

// Swipe orizzontale sul contenuto, diviso per metà schermo (non per tab
// coinvolta, come lo swipe sulla barra qui sopra): nella metà inferiore
// cambia tab — così il gesto funziona ovunque, non solo sulla barra stretta
// — nella metà superiore cambia sotto-vista dove ce n'è una (Per reparto/
// Per giorno in Spesa, Per categoria/Per luogo in Dispensa). La metà è
// quella di partenza del dito (clientY vs metà di window.innerHeight), non
// ricalcolata durante il trascinamento. Stessa lista di elementi da
// ignorare (campi, modali) per non interferire con gesti che hanno già un
// loro significato.
(function(){
  const panel = document.getElementById('panel');
  if(!panel) return;
  const THRESHOLD = 60, MAX_VERTICAL = 60;
  let startX = 0, startY = 0, tracking = false, startInBottomHalf = false;
  function shouldIgnore(target){
    // .meal-block-swipe-wrap ha il suo swipe-a-destra (svuota il pasto):
    // senza escluderlo qui, una card nella metà inferiore dello schermo
    // farebbe scattare ANCHE il cambio tab per lo stesso gesto.
    return !!target.closest('.balance-strip, input, textarea, select, .filters-modal-backdrop, .settings-backdrop, .luogo-picker, .luogo-picker-backdrop, .meal-block-swipe-wrap');
  }
  panel.addEventListener('touchstart', e=>{
    if(e.touches.length !== 1 || shouldIgnore(e.target)){ tracking = false; return; }
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    startInBottomHalf = startY > window.innerHeight / 2;
    tracking = true;
  }, { passive: true });
  panel.addEventListener('touchend', e=>{
    if(!tracking) return;
    tracking = false;
    const t = e.changedTouches[0];
    const dx = t.clientX - startX, dy = t.clientY - startY;
    if(Math.abs(dx) < THRESHOLD || Math.abs(dy) > MAX_VERTICAL) return;
    if(startInBottomHalf){
      goToTab(dx < 0 ? 1 : -1);
      return;
    }
    if(state.tab === 'spesa'){
      state.shopView = state.shopView === 'reparto' ? 'giorno' : 'reparto';
      render();
    } else if(state.tab === 'dispensa'){
      state.pantryView = state.pantryView === 'casa' ? 'cibo' : 'casa';
      render();
    }
  }, { passive: true });
})();

// Voci aggiuntive del menu "tre puntini" specifiche della tab aperta in quel
// momento — vedi TAB_MENU_ITEMS più sotto. "Impostazioni" c'è sempre, in
// testa, indipendentemente dalla tab.
const TAB_MENU_ITEMS = {
  dispensa: [
    { label: '🗂️ Gestisci ingredienti', action: ()=>{ state.ingredientManagerOpen = true; } },
    { label: '🏷️ Gestisci categorie', action: ()=>{ state.deptsModalOpen = true; } },
    { label: '+ Aggiungi ingrediente', action: ()=>{ state.pantryAddModalOpen = true; } }
  ],
  prep: [
    { label: '+ Aggiungi ricetta', action: ()=>{ state.newRecipeModalOpen = true; state.newRecipeError = ''; } }
  ]
};

(function(){
  const topbarMenuBtn = document.getElementById('topbar-menu-btn');
  const topbarMenuBackdrop = document.getElementById('topbar-menu-backdrop');
  const topbarMenu = document.getElementById('topbar-menu');
  const settingsBackdrop = document.getElementById('settings-backdrop');
  const settingsClose = document.getElementById('settings-close');
  const profilePanel = document.getElementById('profile-panel');
  const themeRow = document.getElementById('theme-toggle-row');
  const accentRow = document.getElementById('accent-swatch-row');
  if(!topbarMenuBtn || !settingsBackdrop) return;
  const refreshThemeRow = ()=>{
    if(!themeRow) return;
    const active = currentTheme();
    themeRow.querySelectorAll('[data-theme-choice]').forEach(btn=>{
      btn.classList.toggle('active', btn.dataset.themeChoice === active);
    });
  };
  const refreshAccentRow = ()=>{
    if(!accentRow) return;
    const active = localStorage.getItem(ACCENT_KEY) || USER_COLOR_PRESETS[0];
    accentRow.innerHTML = USER_COLOR_PRESETS.map(c=>`<button type="button" class="color-swatch${active===c?' active':''}" style="background:${c}" data-accent-color="${c}" aria-label="Scegli questo colore"></button>`).join('');
  };
  const open = ()=>{
    if(profilePanel) profilePanel.innerHTML = renderProfilePanel();
    refreshThemeRow();
    refreshAccentRow();
    settingsBackdrop.classList.add('open');
    reconcileModalHistory();
  };
  const close = ()=>{ settingsBackdrop.classList.remove('open'); reconcileModalHistory(); };
  if(settingsClose) settingsClose.addEventListener('click', close);
  settingsBackdrop.addEventListener('click', e=>{ if(e.target === settingsBackdrop) close(); });

  // Menu "tre puntini" della topbar: Impostazioni + le voci di TAB_MENU_ITEMS
  // per la tab corrente, ricalcolate a ogni apertura così restano coerenti
  // anche se nel frattempo si è cambiata tab.
  let currentExtraItems = [];
  const renderTopbarMenuContent = ()=>{
    currentExtraItems = TAB_MENU_ITEMS[state.tab] || [];
    const extraHtml = currentExtraItems.length
      ? `<div class="topbar-menu-sep"></div>` + currentExtraItems.map((it,idx)=>`<button type="button" class="topbar-menu-item" data-topbar-menu-action="${idx}">${it.label}</button>`).join('')
      : '';
    if(topbarMenu) topbarMenu.innerHTML = `<button type="button" class="topbar-menu-item" data-topbar-menu-settings>⚙️ Impostazioni</button>${extraHtml}`;
  };
  const openTopbarMenu = ()=>{
    renderTopbarMenuContent();
    if(topbarMenuBackdrop) topbarMenuBackdrop.classList.add('open');
    reconcileModalHistory();
  };
  topbarMenuBtn.addEventListener('click', ()=>{
    if(isTopbarMenuOpen()) closeTopbarMenu(); else openTopbarMenu();
    reconcileModalHistory();
  });
  if(topbarMenuBackdrop){
    topbarMenuBackdrop.addEventListener('click', e=>{
      const settingsItem = e.target.closest('[data-topbar-menu-settings]');
      if(settingsItem){ closeTopbarMenu(); open(); return; }
      const actionBtn = e.target.closest('[data-topbar-menu-action]');
      if(actionBtn){
        const item = currentExtraItems[parseInt(actionBtn.dataset.topbarMenuAction, 10)];
        closeTopbarMenu();
        if(item){ item.action(); persist(); render(); }
        return;
      }
      if(e.target.closest('[data-stop-close]')) return;
      closeTopbarMenu();
      reconcileModalHistory();
    });
  }
  if(profilePanel){
    profilePanel.addEventListener('click', e=>{
      const swatch = e.target.closest('[data-user-color]');
      if(!swatch) return;
      const user = getCurrentUser();
      if(!user) return;
      state.userColors[user] = swatch.dataset.userColor;
      applyUserColors();
      persist();
      profilePanel.innerHTML = renderProfilePanel();
    });
  }
  if(themeRow){
    themeRow.addEventListener('click', e=>{
      const btn = e.target.closest('[data-theme-choice]');
      if(!btn) return;
      applyTheme(btn.dataset.themeChoice);
      refreshThemeRow();
    });
  }
  if(accentRow){
    accentRow.addEventListener('click', e=>{
      const swatch = e.target.closest('[data-accent-color]');
      if(!swatch) return;
      applyAccent(swatch.dataset.accentColor);
      refreshAccentRow();
    });
  }
})();

// Drag&drop per scambiare le ricette di due giorni nel Menù (Pointer Events,
// non l'HTML5 drag&drop nativo: su mobile è quello che funziona in modo affidabile
// sia con dito che con mouse). dragState vive fuori da attachHandlers perché deve
// sopravvivere ai render intermedi; i listener su document vanno registrati una
// sola volta, mentre il pointerdown sull'handle viene ri-agganciato a ogni render
// (l'elemento viene ricreato ogni volta) da attachHandlers.
let dragState = null;
// mealKey del blocco con il cestino "rivelato" dallo swipe (o null): vive
// fuori da attachHandlers per sopravvivere ai render, come dragState —
// altrimenti ogni render (anche per un motivo scollegato) lo dimenticherebbe.
let revealedMealKey = null;
// card è già il .meal-block (niente più maniglia dedicata da cui risalire
// con .closest): chiamata dal timer di pressione lunga in attachHandlers(),
// non più direttamente da un handler pointerdown, quindi prende le
// coordinate/il pointerId espliciti invece di leggerli da un evento.
function startDayDrag(card, clientX, clientY, pointerId){
  const ghost = document.createElement('div');
  ghost.className = 'drag-ghost';
  const recipeEl = card.querySelector('.day-menu');
  ghost.textContent = recipeEl ? recipeEl.textContent : '';
  document.body.appendChild(ghost);
  positionGhost(ghost, clientX, clientY);
  card.classList.add('dragging');
  dragState = { sourceWeekIdx: card.dataset.weekIdx, sourceIndex: card.dataset.dayIndex, sourceMeal: card.dataset.meal, sourceCard: card, ghost, lastTarget: null };
  try{ card.setPointerCapture(pointerId); }catch(err){ /* pointer già rilasciato: il drag prosegue comunque via i listener su document */ }
  lastPointerX = clientX;
  lastPointerY = clientY;
  if(!autoScrollRAF) autoScrollRAF = requestAnimationFrame(autoScrollTick);
}
function positionGhost(ghost, x, y){
  ghost.style.left = (x + 14) + 'px';
  ghost.style.top = (y - 40) + 'px';
}
let lastPointerX = 0, lastPointerY = 0;
let autoScrollRAF = null;
// Con più settimane il giorno di destinazione può essere fuori schermo: tenendo
// il dito vicino al bordo superiore/inferiore durante il trascinamento la pagina
// scorre da sola, come in una lista nativa con drag&drop.
function autoScrollTick(){
  if(!dragState){ autoScrollRAF = null; return; }
  const margin = 80, maxSpeed = 16;
  const vh = window.innerHeight;
  if(lastPointerY < margin){
    window.scrollBy(0, -maxSpeed * (1 - lastPointerY/margin));
    updateDragTarget();
  } else if(lastPointerY > vh - margin){
    window.scrollBy(0, maxSpeed * (1 - (vh - lastPointerY)/margin));
    updateDragTarget();
  }
  autoScrollRAF = requestAnimationFrame(autoScrollTick);
}
document.addEventListener('pointermove', e=>{
  if(!dragState) return;
  lastPointerX = e.clientX;
  lastPointerY = e.clientY;
  positionGhost(dragState.ghost, e.clientX, e.clientY);
  updateDragTarget();
});
// Ricalcola il pasto sotto il dito: sia a ogni movimento sia durante
// l'auto-scroll (dito fermo vicino al bordo, la pagina scorre da sola e sotto
// il dito passa un altro pasto senza che arrivi nessun pointermove —
// altrimenti al rilascio si scambierebbe col pasto di prima dello scroll).
function updateDragTarget(){
  const el = document.elementFromPoint(lastPointerX, lastPointerY);
  // Qualsiasi pasto è un bersaglio valido, anche di tipo diverso (pranzo su
  // cena): le porzioni/l'eventuale collegamento avanzo restano legati alla
  // posizione, non alla ricetta — vedi swapDayRecipes.
  let targetCard = el ? el.closest('.meal-block') : null;
  if(dragState.lastTarget && dragState.lastTarget !== targetCard) dragState.lastTarget.classList.remove('drag-over');
  if(targetCard && targetCard !== dragState.sourceCard){
    targetCard.classList.add('drag-over');
    dragState.lastTarget = targetCard;
  } else {
    dragState.lastTarget = null;
  }
}
// .meal-block ha touch-action: pan-y (serve allo scroll normale della
// pagina): senza questo, appena il dito si sposta in verticale durante il
// trascinamento il browser comincia a scorrere e annulla il gesto con un
// pointercancel — il drag si interrompeva e si poteva scambiare solo con un
// pasto di fianco. Bloccando il touchmove (listener non passivo) mentre è
// attivo un trascinamento, lo scroll lo fa solo l'auto-scroll qui sopra.
document.addEventListener('touchmove', e=>{
  if(dragState && e.cancelable) e.preventDefault();
}, { passive: false });
function endDayDrag(commit){
  if(!dragState) return;
  const { sourceWeekIdx, sourceIndex, sourceMeal, sourceCard, ghost, lastTarget } = dragState;
  ghost.remove();
  sourceCard.classList.remove('dragging');
  if(lastTarget) lastTarget.classList.remove('drag-over');
  dragState = null;
  if(commit && lastTarget) swapDayRecipes(parseInt(sourceWeekIdx,10), parseInt(sourceIndex,10), sourceMeal, parseInt(lastTarget.dataset.weekIdx,10), parseInt(lastTarget.dataset.dayIndex,10), lastTarget.dataset.meal);
}
document.addEventListener('pointerup', ()=> endDayDrag(true));
document.addEventListener('pointercancel', ()=> endDayDrag(false));

// "+ ricetta" (contorni/ricette aggiuntive di un pasto): delegato su document
// una sola volta, invece che riagganciato riga per riga a ogni render come il
// resto di attachHandlers() — elimina qualunque rischio di righe della lista
// che restano senza handler agganciato dopo un re-render ravvicinato.
document.addEventListener('click', e=>{
  const pickEl = e.target.closest('[data-contorno-pick]');
  if(pickEl){
    const { weekIdx, i, meal } = parseMealKey(pickEl.dataset.contornoDay);
    const current = effectiveMeal(weekIdx, i, meal).contorni;
    const name = pickEl.dataset.contornoPick;
    if(!current.includes(name)) setMealContorni(weekIdx, i, meal, current.concat(name));
    state.contornoPickerOpenMeal = null;
    persist(); render();
    return;
  }
  const removeEl = e.target.closest('[data-contorno-remove]');
  if(removeEl){
    const { weekIdx, i, meal } = parseMealKey(removeEl.dataset.contornoRemove);
    const name = removeEl.dataset.contornoName;
    const current = effectiveMeal(weekIdx, i, meal).contorni;
    setMealContorni(weekIdx, i, meal, current.filter(c => c !== name));
    persist(); render();
  }
});

(async function init(){
  await firebaseReady;
  await waitForAuth();
  await loadState();
  applyUserColors();
  runMigrations();
  // Apriva in automatico la cena di oggi al caricamento, ma con una chiave
  // ormai nel vecchio formato a 2 parti (da prima del modello a due pasti):
  // con l'accordion inline era innocuo (il confronto con la chiave a 3 parti
  // di ogni blocco pasto non trovava mai corrispondenza), ma ora che il
  // dettaglio apre a tutto schermo in base al solo "state.expandedDay è
  // valorizzato" (vedi mealDetailScreen in renderMenu), quella chiave rotta
  // faceva aprire una schermata vuota a ogni avvio. Rimosso: Mara ha confermato
  // di preferire nessuna apertura automatica.
  render();
})();

// Service worker (sw.js): apertura veloce e funzionamento offline. Si
// registra a pagina caricata, per non rubare banda al primo avvio.
if('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')){
  window.addEventListener('load', ()=>{ navigator.serviceWorker.register('sw.js').catch(()=>{}); });
}

(function(){
  const btn = document.getElementById('refresh-btn');
  if(!btn) return;
  btn.addEventListener('click', async ()=>{
    btn.disabled = true;
    btn.textContent = '↻ Aggiornamento…';
    try{
      if(window.caches && caches.keys){
        const keys = await caches.keys();
        await Promise.all(keys.map(k=>caches.delete(k)));
      }
      if(navigator.serviceWorker && navigator.serviceWorker.getRegistrations){
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(r=>r.unregister()));
      }
    }catch(e){ /* ignora: procedi comunque col reload forzato sotto */ }
    try{
      // Su iOS, aperta da "Aggiungi a Home", una normale navigazione può
      // restituire una copia cache di sistema anche a Cache API/SW già puliti.
      // cache:'reload' bypassa la cache in lettura ma aggiorna comunque quella
      // HTTP con la risposta fresca, così la navigazione qui sotto (verso lo
      // stesso identico URL) la trova già pronta invece di quella stantia.
      // L'URL dev'essere IDENTICO (query string inclusa, es. "style.css?rev02")
      // a quello che <link>/<script> caricano davvero: la cache HTTP è tenuta
      // per URL completo, quindi rinfrescare "style.css" senza il "?rev02" non
      // tocca affatto la voce di cache che la pagina usa — il CSS restava
      // vecchio anche dopo "Aggiorna app".
      const cssLink = document.querySelector('link[rel="stylesheet"][href*="style.css"]');
      const scriptSrcs = [...document.querySelectorAll('script[src]')].map(s => s.getAttribute('src')).filter(src => !/^https?:/.test(src));
      await Promise.all([
        fetch(window.location.pathname, { cache: 'reload' }),
        fetch(cssLink ? cssLink.getAttribute('href') : 'style.css', { cache: 'reload' })
      ].concat(scriptSrcs.map(src => fetch(src, { cache: 'reload' }))));
    }catch(e){ /* ignora: il reload sotto tenta comunque */ }
    window.location.replace(window.location.pathname);
  });
})();
