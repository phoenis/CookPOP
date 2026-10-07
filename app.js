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
const GRAD_ICON = { 'preferita':'❤️', 'ci-piace':'🙂', 'ogni-tanto':'😐', 'da-provare':'🧪' };

const ATTREZZ_LABEL = { 'Padella':'Padella', 'Pentola':'Pentola', 'Forno':'Forno', 'Piastra':'Piastra', 'Moulinex':'Moulinex', 'Frullatore':'Frullatore', 'Fritto':'Fritto' };
const ATTREZZ_ORDER = ['Padella','Pentola','Forno','Piastra','Moulinex','Frullatore','Fritto'];

// 'avanzi' è sempre il primo reparto (vedi ordine sotto): non è mai
// indovinato da classifyDept (nessun ingrediente "è" avanzo per nome), lo
// assegna solo l'utente — dalla modale "Ricetta fatta!" o a mano da
// "Gestisci ingredienti". Come ogni reparto, la sezione compare in Dispensa/
// Spesa solo quando contiene almeno una voce (stesso filtro presenza già
// usato per tutti gli altri, vedi DEPT_ORDER.filter più sotto).
const DEPT_ORDER = ['avanzi', 'verdura','carne','salumi','pesce','latticini','pane','pasta','legumi','conserve','base','salse','dolci','surgelati','bibite','altro','pulizia','igiene','cucina-casa','altro-casa','finiti'];
const DEPT_LABEL = { avanzi:'Avanzi', verdura:'Frutta e verdura', carne:'Carne', salumi:'Salumi', pesce:'Pesce', latticini:'Latticini e uova', pane:'Pane e sostituti', pasta:'Pasta, riso e cereali', legumi:'Legumi', conserve:'Pomodoro e conserve', base:'Olio, aceto e spezie', salse:'Salse e brodi', dolci:'Dolci e forno', surgelati:'Surgelati', bibite:'Bevande', finiti:'Finiti', altro:'Altro', pulizia:'Pulizia', igiene:'Igiene e cura', 'cucina-casa':'Cucina', 'altro-casa':'Altro' };
const DEPT_ICON = { avanzi:'🥡', verdura:'🥦', carne:'🥩', salumi:'🥓', pesce:'🐟', latticini:'🧀', pane:'🍞', pasta:'🍝', legumi:'🫘', conserve:'🥫', base:'🫒', salse:'🥣', dolci:'🍰', surgelati:'❄️', bibite:'🍷', finiti:'🗑️', altro:'🛒', pulizia:'🧽', igiene:'🧴', 'cucina-casa':'🧻', 'altro-casa':'📦' };
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
// Ordine dei reparti in Spesa, come si gira il supermercato: prima la casa
// (detersivi, igiene...), poi il fresco, poi gli scaffali, i surgelati in
// fondo per non scongelarli nel carrello. Le categorie create a mano vanno
// in fondo al loro gruppo (casa o cibo), prima del rispettivo "Altro".
// L'ordine si può cambiare a mano ("Ordine corsie" in Spesa): resta in
// state.shopAisleCustom, e una categoria nata dopo si aggiunge in fondo.
const SHOP_AISLE_FOOD = ['verdura','pane','salumi','latticini','carne','pesce','pasta','legumi','conserve','salse','base','dolci','bibite'];
function defaultShopAisles(){
  const casa = DEPT_ORDER.filter(d => isNonFoodDept(d) && d !== 'altro-casa');
  const food = SHOP_AISLE_FOOD.concat(DEPT_ORDER.filter(d => !isNonFoodDept(d) && !SHOP_AISLE_FOOD.includes(d) && !['avanzi','altro','surgelati','finiti'].includes(d)));
  return casa.concat(['altro-casa'], food, ['altro','surgelati']).filter(d => DEPT_LABEL[d]);
}
function shopAisles(){
  const def = defaultShopAisles();
  const custom = ((typeof state !== 'undefined' && state.shopAisleCustom) || []).filter(d => def.includes(d));
  return custom.concat(def.filter(d => !custom.includes(d)));
}
function shopAisleOrder(){
  return ['avanzi'].concat(shopAisles(), ['finiti']);
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
// Scorta "bassa" (numero in rosso in Dispensa): per pezzi, g e ml sotto 1;
// per kg e litri, che si contano a decimi, sotto 0,2 (0,7 l di passata è
// una scorta normale, non poca).
function pantryQtyIsLow(it){
  if(!it || typeof it.qty !== 'number' || it.unit === 'none') return false;
  return it.qty < ((it.unit === 'kg' || it.unit === 'l') ? 0.2 : 1);
}
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
  // Reparti alimentari come le corsie del supermercato (ottobre 2026). Vince
  // la prima regola che corrisponde, quindi prima i nomi che contengono la
  // parola chiave di un altro reparto: "Colla di pesce" non è pesce, "Farina
  // di ceci" non è un legume, "Fagiolini" non sono fagioli, "Pasta sfoglia"
  // non è pasta, "Tonno sott'olio" non è olio, "Ragù di carne" non è carne.
  ['surgelat','surgelati'], ['congelat','surgelati'], ['gelato','surgelati'], ['bastoncini','surgelati'],
  ['colla di pesce','dolci'], ['brodo','salse'], ['dado','salse'], ['dadi','salse'], ['aglio in polvere','base'], ['aranciata','bibite'],
  ['latte di cocco','salse'], ['tahina','salse'], ['robiola','latticini'], ['bagoss','latticini'], ['fagiolini','verdura'],
  ['fette biscottate','pane'], ['pangrattato','pane'], ['lievito','dolci'], ['olive','conserve'], // "denocciolate" contiene "nocciol"
  // Dolci e forno: farine, zucchero, lievito, cacao, frutta secca...
  ['pasta sfoglia','dolci'], ['pasta frolla','dolci'], ['pasta brisé','dolci'],
  ['farina di mais','pasta'], ['polenta','pasta'], ['farina','dolci'], ['zucchero','dolci'], ['cacao','dolci'], ['cioccolat','dolci'],
  ['vaniglia','dolci'], ['savoiardi','dolci'], ['canditi','dolci'], ['uvetta','dolci'], ['pinoli','dolci'], ['noci','dolci'],
  ['nocciol','dolci'], ['mandorl','dolci'], ['pistacch','dolci'], ['miele','dolci'], ['marmellat','dolci'], ['confettur','dolci'], ['biscott','dolci'],
  // Pasta, riso e cereali.
  ['gnocchi','pasta'], ['farro','pasta'], ['orzo','pasta'], ['cous cous','pasta'], ['couscous','pasta'], ['quinoa','pasta'], ['semol','pasta'],
  ['cereali','pasta'], ['riso','pasta'], ['pasta','pasta'], ['spaghetti','pasta'], ['rigatoni','pasta'], ['orecchiette','pasta'], ['trenette','pasta'],
  ['trofie','pasta'], ['cannelloni','pasta'], ['sfoglie','pasta'], ['lasagn','pasta'], ['tortellini','pasta'], ['ravioli','pasta'], ['tagliatelle','pasta'], ['vialone','pasta'],
  // Pomodoro e conserve (anche pesce e verdure in scatola o sott'olio).
  ['concentrato','conserve'], ['polpa di pomodoro','conserve'], ['passata','conserve'], ['pelati','conserve'], ['conserva','conserve'],
  ["sott'olio",'conserve'], ['sottaceti','conserve'], ['in scatola','conserve'], ['tonno','conserve'], ['acciugh','conserve'],
  ['capperi','conserve'], ['mais','conserve'], ['carciofini','conserve'],
  // Salse e brodi.
  ['ragù','salse'], ['sugo','salse'], ['pesto','salse'], ['maionese','salse'], ['senape','salse'], ['besciamella','salse'], ['ketchup','salse'], ['salsa','salse'],
  // Legumi, secchi o già cotti.
  ['ceci','legumi'], ['fagioli','legumi'], ['lenticchie','legumi'], ['fave','legumi'], ['legumi','legumi'], ['cannellini','legumi'], ['borlotti','legumi'], ['già cotti','legumi'],
  ['salmone','pesce'], ['gamber','pesce'], ['merluzzo','pesce'], ['branzino','pesce'], ['alici','pesce'], ['platessa','pesce'], ['sgombro','pesce'], ['seppi','pesce'],
  ['vongole','pesce'], ['cozze','pesce'], ['pesce','pesce'], ['baccal','pesce'], ['orata','pesce'], ['polpo','pesce'], ['calamar','pesce'],
  ['prosciutto','salumi'], ['pancetta','salumi'], ['guanciale','salumi'], ['speck','salumi'], ['salame','salumi'], ['mortadella','salumi'], ['bresaola','salumi'], ['lardo','salumi'], ['wurstel','salumi'],
  ['manzo','carne'], ['pollo','carne'], ['maiale','carne'], ['salsiccia','carne'], ['tacchino','carne'], ['vitello','carne'], ['agnello','carne'], ['straccetti','carne'],
  ['macinat','carne'], ['coniglio','carne'], ['carne','carne'], ['arista','carne'], ['controfiletto','carne'], ['scamone','carne'], ['cappello del prete','carne'], ['muscolo','carne'],
  ['cappone','carne'], ['cosce','carne'], ['petto','carne'], ['cotenna','carne'], ['spiedini','carne'], ['bistecc','carne'], ['spezzatino','carne'],
  ['mozzarella','latticini'], ['ricotta','latticini'], ['parmigiano','latticini'], ['formaggio','latticini'], ['grana','latticini'], ['latte','latticini'], ['burro','latticini'],
  ['yogurt','latticini'], ['stracchino','latticini'], ['provola','latticini'], ['burrata','latticini'], ['brie','latticini'], ['caciocavallo','latticini'], ['fontina','latticini'],
  ['gorgonzola','latticini'], ['taleggio','latticini'], ['mascarpone','latticini'], ['pecorino','latticini'], ['provolone','latticini'], ['scamorza','latticini'],
  ['panna','latticini'], ['latticello','latticini'], ['uova','latticini'], ['uovo','latticini'],
  ['pane','pane'], ['panini','pane'], ['piadin','pane'], ['cracker','pane'], ['grissini','pane'],
  // Olio, aceto e spezie. "peperoncino" e "peperon" (peperone/peperoni) prima
  // di "pepe", che altrimenti li intercetterebbe essendo una loro sottostringa.
  ['peperoncino','base'], ['peperon','verdura'],
  ['sale','base'], ['olio','base'], ['pepe','base'], ['aceto','base'], ['spezie','base'],
  // Erbe: secche tra le spezie, fresche (rosmarino, salvia, basilico...) con la verdura.
  ['rosmarino secco','base'], ['salvia secca','base'], ['basilico secco','base'], ['prezzemolo secco','base'], ['erbe secche','base'], ['origano','base'], ['timo','base'], ['alloro','base'], ['cannella','base'], ['paprika','base'], ['noce moscata','base'], ['curry','base'],
  ['curcuma','base'], ['cumino','base'], ['zafferano','base'], ['chiodi di garofano','base'],
  ['melanzan','verdura'], ['zucchin','verdura'], ['patat','verdura'], ['insalat','verdura'], ['pomodor','verdura'], ['basilico','verdura'], ['frutta','verdura'], ['verdura','verdura'], ['cipoll','verdura'], ['carot','verdura'], ['aglio','verdura'],
  ['melone','verdura'], ['anguria','verdura'], ['mela','verdura'], ['pera','verdura'], ['limon','verdura'], ['arancia','verdura'], ['banan','verdura'], ['fragol','verdura'], ['uva','verdura'],
  ['cipoll','verdura'], ['borettan','verdura'], ['scalogno','verdura'], ['porr','verdura'], ['sedano','verdura'], ['finocchi','verdura'],
  ['carciof','verdura'], ['funghi','verdura'], ['broccol','verdura'], ['cavolfior','verdura'], ['verza','verdura'], ['cime di rapa','verdura'],
  ['friariell','verdura'], ['spinaci','verdura'], ['bietol','verdura'], ['asparag','verdura'], ['cetriol','verdura'], ['radicchio','verdura'], ['cicoria','verdura'], ['zenzero','verdura'],
  ['rucola','verdura'], ['zucca','verdura'], ['piselli','verdura'], ['verdur','verdura'], ['prezzemolo','verdura'], ['salvia','verdura'], ['rosmarino','verdura'],
  ['menta','verdura'], ['aneto','verdura'], ['aranc','verdura'], ['mele','verdura'], ['pere','verdura'],
  ['acqua','bibite'], ['bibit','bibite'], ['birra','bibite'], ['succo di frutta','bibite'], ['tè freddo','bibite'], ['vino','bibite'], ['liquor','bibite'],
  [/\brum\b/,'bibite'], ['caffè','bibite'], ['spumante','bibite'], ['prosecco','bibite'],
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
// Ingredienti di una ricetta che non risultano in casa, già scalati. Le
// quantità si incollano qui (invece di far ri-derivare al click gli
// ingredienti dal solo nome ricetta) perché un pasto può unire più ricette.
// idx = posizione nell'array ing, la stessa che usa buildShopFlat per
// costruire la chiave dayIngKey di questo stesso ingrediente/ricetta/pasto.
function missingIngredients(ing, ratio, ctx){
  ratio = ratio || 1;
  return ing.map((it, idx) => ({ it, idx }))
    .filter(({it}) => pantryStatusFor(it.ingrediente, scaleQtyText(it.qta, ratio)) !== 'in-casa')
    .map(({it, idx}) => ({
      ingrediente: it.ingrediente,
      qta: scaleQtyText(it.qta, ratio) || '',
      key: ctx ? dayIngKey(ctx.weekIdx, ctx.i, ctx.meal, ctx.role, ing, idx) : null
    }));
}
function mancantiButtonHtml(mancanti){
  if(!mancanti.length) return '';
  return `<div class="button-wrapper"><button class="btn is-small" data-mancanti-in-spesa="${escapeAttr(JSON.stringify(mancanti))}"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--tabler" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M4 19a2 2 0 1 0 4 0a2 2 0 1 0-4 0m11 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0"></path><path d="M17 17H6V3H4"></path><path d="m6 5l14 1l-1 7H6"></path></g></svg> Aggiungi ${mancanti.length} ingredient${mancanti.length===1?'e':'i'}</button></div>`;
}
// --- Modalità cucina ------------------------------------------------------
// Un passo del procedimento per schermata, a caratteri grandi, con Indietro e
// Avanti (anche scorrendo col dito). Lo schermo resta acceso finché è aperta.
// Bottone "Cucina" flottante e fisso, qualunque tab (Ingredienti/Passaggi) sia
// aperta: solo se la ricetta ha un procedimento.
function cookFabHtml(name, ratio){
  const det = getRecipeDetails(name);
  if(!det || !det.procedimento || !det.procedimento.length) return '';
  return `<button type="button" class="cook-fab" data-cook-start="${escapeAttr(name)}" data-cook-ratio="${ratio || 1}"><span aria-hidden="true">🍳</span> Cucina</button>`;
}
// Tab Ingredienti | Passaggi dentro il piatto (stato in state.dishPane).
function paneTabsHtml(paneKey, pane){
  const tab = (v, label) => `<button type="button" class="pane-tab${pane === v ? ' active' : ''}" role="tab" aria-selected="${pane === v}" data-dish-pane="${escapeAttr(paneKey)}" data-dish-pane-value="${v}">${label}</button>`;
  return `<div class="pane-tabs" role="tablist">${tab('ing', 'Ingredienti')}${tab('steps', 'Passaggi')}</div>`;
}
// "Per 2 persone": nel pasto con − e + per cambiare il numero (era nel menù ⋯).
function personeRowHtml(n, mk, recipeName){
  if(!n) return '';
  const word = n === 1 ? 'persona' : 'persone';
  if(recipeName) return `<div class="persone-row"><span>Per</span><span class="qty-stepper"><button type="button" class="qty-btn" data-recipe-portions-dec="${escapeAttr(recipeName)}" aria-label="Diminuisci porzioni">−</button><span class="qty-num">${n}</span><button type="button" class="qty-btn" data-recipe-portions-inc="${escapeAttr(recipeName)}" aria-label="Aumenta porzioni">+</button></span><span>${word}</span></div>`;
  if(!mk) return `<div class="persone-row"><span>Per ${n} ${word}</span></div>`;
  return `<div class="persone-row"><span>Per</span><span class="qty-stepper"><button type="button" class="qty-btn" data-portions-dec="${mk}" aria-label="Diminuisci porzioni">−</button><span class="qty-num">${n}</span><button type="button" class="qty-btn" data-portions-inc="${mk}" aria-label="Aumenta porzioni">+</button></span><span>${word}</span></div>`;
}
// Ingredienti che servono in un passo: quelli il cui nome (una parola
// significativa, senza l'ultima vocale per reggere singolare/plurale) compare
// nel testo del passo. Euristica semplice: nessun abbinamento = nessun elenco.
const COOK_SKIP_WORDS = new Set(['fresco','fresca','freschi','fresche','tritato','tritata','grattugiato','grattugiata','polvere','intero','intera','medio','media','grande','piccolo','piccola','circa','sodo','maturo','matura','extra','vergine','extravergine']);
function cookStepIngredients(name, stepText, ratio){
  const text = (stepText || '').toLowerCase();
  return getIngredientsFor(name).filter(it=>{
    const words = (it.ingrediente || '').toLowerCase().split(/[^a-zàèéìòù]+/).filter(w => w.length >= 4 && !COOK_SKIP_WORDS.has(w));
    return words.some(w => text.includes(w.length > 4 ? w.slice(0, -1) : w));
  }).map(it => ({ nome: it.ingrediente, qta: scaleQtyText(it.qta, ratio) || '' }));
}
// --- Timer in modalità cucina --------------------------------------------
// Durata scritta nel passo ("10 minuti", "mezz'ora", "1 ora e mezza"): se c'è,
// il passo mostra "Avvia timer" (suona e vibra qui nell'app, finché resta
// aperta) e, su Android, "Nell'orologio" (timer vero del telefono, suona anche
// a schermo bloccato). Con un intervallo ("20-25 minuti") vale il minimo.
function stepDurationSecs(text){
  const t = String(text || '').toLowerCase();
  const num = s => parseFloat(String(s).replace(',', '.'));
  let m;
  if((m = /(\d+(?:[.,]\d+)?)\s*(?:[-–]\s*\d+(?:[.,]\d+)?\s*)?(?:ore|ora|h)\b(?:\s*e\s*(\d+)\s*(?:minut[oi]|min)\b|\s*e\s*mezza\b)?/.exec(t))){
    const extra = m[2] ? num(m[2]) * 60 : /e\s*mezza/.test(m[0]) ? 1800 : 0;
    return Math.round(num(m[1]) * 3600 + extra);
  }
  if(/un['’]?\s*ora\s*e\s*mezza/.test(t)) return 5400;
  if(/un['’]\s*ora\b|\buna\s+ora\b/.test(t)) return 3600;
  if(/mezz['’]?\s*ora/.test(t)) return 1800;
  if(/quarto\s+d['’]\s*ora/.test(t)) return 900;
  if((m = /(\d+(?:[.,]\d+)?)\s*(?:[-–]\s*\d+(?:[.,]\d+)?\s*)?(?:minut[oi]|min)\b/.exec(t))) return Math.round(num(m[1]) * 60);
  return 0;
}
function formatTimerClock(secs){
  secs = Math.max(0, Math.round(secs));
  const h = Math.floor(secs / 3600), mi = Math.floor((secs % 3600) / 60), s = secs % 60;
  const p = n => String(n).padStart(2, '0');
  return h ? `${h}:${p(mi)}:${p(s)}` : `${p(mi)}:${p(s)}`;
}
function formatTimerLabel(secs){
  if(secs >= 3600){ const h = Math.floor(secs / 3600), mi = Math.round((secs % 3600) / 60); return mi ? `${h} h ${mi} min` : `${h} h`; }
  return `${Math.round(secs / 60)} min`;
}
let timerAudioCtx = null, timerRingTimer = null;
function timerPrimeAudio(){
  try{
    const AC = window.AudioContext || window.webkitAudioContext;
    if(!AC) return;
    if(!timerAudioCtx) timerAudioCtx = new AC();
    if(timerAudioCtx.state === 'suspended') timerAudioCtx.resume();
  }catch(e){}
}
function timerBeepOnce(){
  try{
    if(!timerAudioCtx) return;
    [0, 0.25, 0.5].forEach(off=>{
      const o = timerAudioCtx.createOscillator(), g = timerAudioCtx.createGain();
      o.type = 'sine'; o.frequency.value = 880;
      g.gain.setValueAtTime(0.0001, timerAudioCtx.currentTime + off);
      g.gain.exponentialRampToValueAtTime(0.5, timerAudioCtx.currentTime + off + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, timerAudioCtx.currentTime + off + 0.2);
      o.connect(g); g.connect(timerAudioCtx.destination);
      o.start(timerAudioCtx.currentTime + off); o.stop(timerAudioCtx.currentTime + off + 0.22);
    });
  }catch(e){}
  try{ if(navigator.vibrate) navigator.vibrate([300, 150, 300, 150, 300]); }catch(e){}
}
function timerStopRinging(){
  if(timerRingTimer){ clearInterval(timerRingTimer); timerRingTimer = null; }
  try{ if(navigator.vibrate) navigator.vibrate(0); }catch(e){}
  const el = document.getElementById('timer-alert'); if(el) el.remove();
}
function timerStartRinging(label){
  timerStopRinging();
  const el = document.createElement('div');
  el.id = 'timer-alert'; el.className = 'timer-alert'; el.setAttribute('role', 'alertdialog'); el.setAttribute('aria-label', 'Timer finito');
  el.innerHTML = `<div class="timer-alert-text">⏱ Timer finito${label ? ` · ${escapeHtml(label)}` : ''}</div><button type="button" class="timer-alert-stop" data-timer-stop>Ferma</button>`;
  document.body.appendChild(el);
  timerBeepOnce();
  let n = 0;
  timerRingTimer = setInterval(()=>{ if(++n > 40) return timerStopRinging(); timerBeepOnce(); }, 1500);
}
function timerTick(){
  const t = state.cookTimer;
  if(!t) return;
  const left = Math.ceil((t.end - Date.now()) / 1000);
  if(left <= 0){
    const label = t.label;
    state.cookTimer = null;
    timerStartRinging(label);
    render();
    return;
  }
  const el = document.getElementById('cook-timer-time');
  if(el) el.textContent = formatTimerClock(left);
}
setInterval(timerTick, 1000);
document.addEventListener('visibilitychange', ()=>{ if(!document.hidden) timerTick(); });
document.addEventListener('click', e=>{
  const start = e.target.closest('[data-cook-timer-start]');
  if(start){
    const secs = parseInt(start.dataset.cookTimerStart, 10) || 0;
    if(!secs) return;
    timerPrimeAudio();
    state.cookTimer = { end: Date.now() + secs * 1000, total: secs, label: formatTimerLabel(secs) };
    render();
    return;
  }
  if(e.target.closest('[data-cook-timer-cancel]')){ state.cookTimer = null; render(); return; }
  if(e.target.closest('[data-timer-stop]')){ timerStopRinging(); return; }
  const phone = e.target.closest('[data-cook-timer-phone]');
  if(phone){
    const secs = parseInt(phone.dataset.cookTimerPhone, 10) || 0;
    if(!secs) return;
    timerPrimeAudio();
    const msg = encodeURIComponent((state.cookMode && state.cookMode.name) || 'CookPOP');
    const url = `intent:#Intent;action=android.intent.action.SET_TIMER;i.android.intent.extra.alarm.LENGTH=${secs};S.android.intent.extra.alarm.MESSAGE=${msg};B.android.intent.extra.alarm.SKIP_UI=true;end`;
    // Se l'Orologio si apre, la pagina passa in secondo piano: niente da fare.
    // Se dopo un attimo siamo ancora qui, il telefono non l'ha aperto: parte
    // il timer dell'app, così il tempo non va perso.
    let left = false;
    const onLeave = ()=>{ left = true; };
    document.addEventListener('visibilitychange', onLeave, { once: true });
    window.addEventListener('pagehide', onLeave, { once: true });
    window.addEventListener('blur', onLeave, { once: true });
    const a = document.createElement('a');
    a.href = url; a.style.display = 'none';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>{
      document.removeEventListener('visibilitychange', onLeave);
      window.removeEventListener('pagehide', onLeave);
      window.removeEventListener('blur', onLeave);
      if(left || document.hidden || state.cookTimer) return;
      state.cookTimer = { end: Date.now() + secs * 1000, total: secs, label: formatTimerLabel(secs), note: 'Orologio non aperto: timer nell\'app' };
      render();
    }, 1500);
  }
});
function cookTimerHtml(stepText){
  const secs = stepDurationSecs(stepText);
  const running = state.cookTimer;
  const isAndroid = /android/i.test(navigator.userAgent || '');
  const bar = running ? `<div class="cook-timer-bar"><span aria-hidden="true">⏱</span><b id="cook-timer-time">${formatTimerClock(Math.ceil((running.end - Date.now()) / 1000))}</b><span class="cook-timer-label">${escapeHtml(running.note || ('Timer ' + running.label))}</span><button type="button" class="cook-timer-cancel" data-cook-timer-cancel>Annulla</button></div>` : '';
  const btns = secs ? `<div class="cook-timer-row"><button type="button" class="cook-timer-btn" data-cook-timer-start="${secs}">⏱ Avvia timer ${formatTimerLabel(secs)}</button>${isAndroid ? `<button type="button" class="cook-timer-btn is-ghost" data-cook-timer-phone="${secs}">Nell'orologio</button>` : ''}</div>` : '';
  return { bar, btns };
}
function renderCookModePage(){
  const cm = state.cookMode;
  if(!cm) return '';
  const det = getRecipeDetails(cm.name);
  const steps = (det && det.procedimento) || [];
  if(!steps.length) return '';
  const total = steps.length;
  const step = Math.min(Math.max(0, cm.step || 0), total - 1);
  const isFirst = step === 0, isLast = step === total - 1;
  const ings = cookStepIngredients(cm.name, steps[step], cm.ratio || 1);
  const ingHtml = ings.length ? `
    <section class="cook-section">
      <h3 class="cook-section-title">Ingredienti</h3>
      <ul class="cook-ings">${ings.map(i => `<li>${i.qta ? `<b>${escapeHtml(i.qta)}</b> ` : ''}${escapeHtml(i.nome.charAt(0).toLowerCase() + i.nome.slice(1))}</li>`).join('')}</ul>
    </section>` : '';
  const timerUi = cookTimerHtml(steps[step]);
  return `
  <div class="sheet-page cook-page${pageEntering('cook') ? ' is-entering' : ''}" data-page="cook">
    <header class="cook-head">
      <button type="button" class="cook-end" data-close-cook>Termina</button>
      <h2 class="cook-title">${escapeHtml(cm.name)}</h2>
    </header>
    ${timerUi.bar}
    <div class="cook-bar" role="progressbar" aria-valuemin="1" aria-valuemax="${total}" aria-valuenow="${step + 1}"><span style="width:${Math.round((step + 1) / total * 100)}%"></span></div>
    <div class="cook-body" data-cook-swipe>
      <section class="cook-section cook-step">
        <div class="cook-step-count">Passaggio ${step + 1}/${total}</div>
        <p class="cook-step-text">${escapeHtml(steps[step])}</p>
        ${timerUi.btns}
      </section>
      ${ingHtml}
    </div>
    <div class="cook-footer">
      <div class="cook-nav">
        <button type="button" class="cook-nav-back" data-cook-prev aria-label="Passo precedente" ${isFirst ? 'disabled' : ''}>←</button>
        <button type="button" class="cook-nav-next" ${isLast ? 'data-close-cook' : 'data-cook-next'}>Fatto!</button>
      </div>
    </div>
  </div>`;
}
function renderIngredientsSection(ing, ratio, ctx, persone, titleOverride){
  ratio = ratio || 1;
  persone = persone || (ctx && ctx.persone) || 0;
  if(!ing.length) return `<div class="ing-empty">Nessun ingrediente salvato per questa ricetta ancora.</div>`;
  const STATUS_LABEL = { 'in-casa':'In casa', 'poco':'Scorta bassa', 'manca':'Manca' };
  const rows = ing.map(it=>{
    const scaledQta = scaleQtyText(it.qta, ratio);
    const status = pantryStatusFor(it.ingrediente, scaledQta);
    return `<li><span class="ing-list-name">${escapeHtml(it.ingrediente)}</span><span class="ing-status ${status}" title="${escapeAttr(STATUS_LABEL[status])}"></span><span style="color:var(--sage)">${escapeHtml(scaledQta||'')}</span></li>`;
  }).join('');
  const titleHtml = titleOverride !== undefined ? titleOverride : (ctx && ctx.titleHtml !== undefined) ? ctx.titleHtml : `<div class="detail-section-title"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--tabler" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M4 19a2 2 0 1 0 4 0a2 2 0 1 0-4 0m11 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0"></path><path d="M17 17H6V3H4"></path><path d="m6 5l14 1l-1 7H6"></path></g></svg> Ingredienti${persone ? ` per ${persone} ${persone === 1 ? 'persona' : 'persone'}` : ''}</div>`;
  const mancantiBtn = (ctx && ctx.noButton) ? '' : mancantiButtonHtml(missingIngredients(ing, ratio, ctx));
  return `<div class="detail-section">${titleHtml}<ul class="ing-list">${rows}</ul>${mancantiBtn}</div>`;
}

// Un piatto del pasto nel dettaglio: una fisarmonica, uguale per tutti i
// piatti (portata + nome, si apre e si chiude), con dentro foto, tag,
// gradimento, ingredienti, procedimento, note e le azioni del singolo piatto.
// ratio scala le quantità sulle porzioni del pasto, rispetto alle porzioni
// base di QUESTA ricetta. "Aggiungi N ingredienti" non sta qui ma una volta
// sola per tutto il pasto (vedi renderMealDetailScreen).
function renderDishAccordion(dsh, ratio, ctx, isOpen, fixed, asPanel){
  const name = dsh.name;
  const mk = mealKey(ctx.weekIdx, ctx.i, ctx.meal);
  const rec = getRecipeMeta(name);
  const det = getRecipeDetails(name);
  const ing = getIngredientsFor(name);
  const paneKey = mk + '|' + name;
  const pane = state.dishPane[paneKey] || 'ing';
  const ingHtml = renderIngredientsSection(ing, ratio, Object.assign({ noButton: true, titleHtml: personeRowHtml(ctx.persone, ctx.canPortions ? mk : '') }, ctx));
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
  const fromFreezer = isFreezerDish(mk, name);
  const plan = getDishPlan(mk, name);
  const freezerInfo = fromFreezer
    ? `<div class="dish-freezer-note">❄️ Dal freezer: niente da comprare. In freezer: ${freezerPortionsOf(name)} porzioni. La sera prima ricordati di tirarlo fuori.</div>`
    : (canFreeze(name) ? `<button type="button" class="btn is-chip dish-double${plan.double ? ' active' : ''}" data-prep-double data-prep-key="${mk}" data-prep-name="${escapeAttr(name)}" aria-pressed="${!!plan.double}">❄️ ${plan.double ? 'Doppia dose: metà in freezer' : 'Fai doppia dose e congela metà'}</button>` : '');
  // Nel dettaglio del pasto il piatto attivo (scelto dalla tab) è un pannello
  // sempre aperto: niente chevron né apri/chiudi.
  const head = asPanel ? `
    <div class="dish-acc-head is-static">
      <span class="dish-text"><span class="dish-acc-name">${escapeHtml(name)}</span></span>
    </div>` : `
    <button type="button" class="dish-acc-head" data-dish-toggle="${mk}" data-dish-toggle-name="${escapeAttr(name)}" aria-expanded="${isOpen}">
      <span class="dish-ic" aria-hidden="true">${tipoIcon(dsh.tipo)}</span>
      <span class="dish-text"><span class="dish-course">${escapeHtml(courseLabel(dsh.tipo))}</span><span class="dish-acc-name">${escapeHtml(name)}</span></span>
      <span class="dish-acc-chev" aria-hidden="true">${isOpen ? '▴' : '▾'}</span>
    </button>`;
  return `
  <div class="dish-acc${isOpen ? ' open' : ''}${asPanel ? ' is-panel' : ''}">
    ${head}
    ${isOpen ? `<div class="dish-acc-body">
      ${rec ? recipePhotoHtml(name) : ''}
      ${tagsHtml}
      ${freezerInfo}
      ${paneTabsHtml(paneKey, pane)}
      ${pane === 'ing' ? `
      ${ctx.mancantiHtml || ''}
      ${ingHtml}
      ${addFormHtml}` : `
      ${stepsHtml || '<div class="ing-empty">Nessun procedimento salvato per questa ricetta.</div>'}
      ${noteBox}
      ${rec ? gradimentoPickerHtml(name) : ''}
      ${linkHtml ? `<div class="button-wrapper">${linkHtml}</div>` : ''}`}
    </div>` : ''}
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
    ...(finalGroup ? { group: finalGroup } : {}),
    // La scadenza resta finché c'è ancora scorta (vale quella della confezione
    // già in casa, la più vicina); se era finita, quella nuova non si conosce.
    ...(currentQty > 0 && existing && existing.scadenza ? { scadenza: existing.scadenza } : {})
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
  const pantryKey = (cb.dataset.shopName||'').trim().toLowerCase();
  const before = state.pantryItems[pantryKey];
  const hadStock = !!(before && typeof before.qty === 'number' && before.qty > 0);
  upsertPantryItem(cb.dataset.shopName, 'dispensa', qty, unit);
  rowKey.split(',').forEach(k=>{ state.shopDismissed[k] = true; });
  // Fresco appena comprato (senza scorta prima): scadenza stimata dal reparto,
  // da confermare o sistemare subito (renderExpiryConfirmModal).
  const it = state.pantryItems[pantryKey];
  const est = hadStock ? null : estimateExpiryDays(it);
  if(it && !it.scadenza && est !== null){
    it.scadenza = addDaysIso(est);
    if(!state.expiryConfirm.includes(pantryKey)) state.expiryConfirm.push(pantryKey);
  }
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
  for(const [kw, dept] of DEPT_RULES){ if(typeof kw === 'string' ? s.includes(kw) : kw.test(s)) return dept; }
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
// --- Foto del piatto --------------------------------------------------------
// Una foto per ricetta, per ricordarsi com'è venuto il piatto. Non sta nel
// catalogo (lo appesantirebbe per tutti a ogni sincronizzazione) ma in un
// percorso Firebase a sé, RECIPE_PHOTOS_PATH/<nome ricetta>, letto solo
// quando si apre quella ricetta. La foto si riduce sul telefono prima di
// salvarla (lato lungo 1024 px, JPEG ~100-200 KB). Condivisa come il
// catalogo: la vede chiunque apra la stessa ricetta.
const RECIPE_PHOTOS_PATH = 'recipe-photos';
const recipePhotoCache = {}; // nome -> { status:'loading'|'ok'|'none'|'error', src }
function recipePhotoPath(name){ return `${RECIPE_PHOTOS_PATH}/${fbKeyEncode(name)}`; }
function ensureRecipePhoto(name){
  if(!name || recipePhotoCache[name] || !window.cookpopSync || !window.cookpopSync.load) return;
  recipePhotoCache[name] = { status:'loading' };
  window.cookpopSync.load(recipePhotoPath(name)).then(val=>{
    recipePhotoCache[name] = val && val.data ? { status:'ok', src: val.data } : { status:'none' };
    render();
  }).catch(()=>{ recipePhotoCache[name] = { status:'error' }; render(); });
}
// editable = false (dettaglio): solo la foto, se c'è. editable = true (pagina
// "Modifica ricetta"): anche aggiungi / cambia / rimuovi.
function recipePhotoHtml(name, editable){
  if(!name || !window.cookpopSync) return '';
  ensureRecipePhoto(name);
  const c = recipePhotoCache[name] || { status:'loading' };
  if(c.status === 'loading') return '';
  if(!editable) return c.status === 'ok' ? `<figure class="recipe-photo"><img src="${escapeAttr(c.src)}" alt="Foto del piatto: ${escapeAttr(name)}"></figure>` : '';
  const input = label => `<label class="btn is-chip recipe-photo-btn">${label}<input type="file" accept="image/*" hidden data-recipe-photo-input="${escapeAttr(name)}"></label>`;
  if(c.status === 'saving') return `<div class="recipe-photo-actions"><span class="section-sub">Salvataggio della foto…</span></div>`;
  const error = c.message ? `<div class="recipe-photo-error">${escapeHtml(c.message)}</div>` : '';
  if(c.status === 'ok') return `
    <figure class="recipe-photo"><img src="${escapeAttr(c.src)}" alt="Foto del piatto: ${escapeAttr(name)}"></figure>
    <div class="recipe-photo-actions">${input('📷 Cambia foto')}<button type="button" class="btn is-chip" data-recipe-photo-remove="${escapeAttr(name)}">Rimuovi foto</button></div>${error}`;
  return `<div class="recipe-photo-actions">${input('📷 Aggiungi una foto del piatto')}</div>${error}`;
}
function loadImageFile(file){
  return new Promise((resolve, reject)=>{
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = ()=>{ URL.revokeObjectURL(url); resolve(img); };
    img.onerror = ()=>{ URL.revokeObjectURL(url); reject(new Error('immagine non leggibile')); };
    img.src = url;
  });
}
async function resizeImageToDataUrl(file, maxSide = 1024, maxChars = 300000){
  const img = await loadImageFile(file);
  const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.naturalWidth * scale);
  canvas.height = Math.round(img.naturalHeight * scale);
  canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
  let quality = 0.8, out = canvas.toDataURL('image/jpeg', quality);
  while(out.length > maxChars && quality > 0.4){ quality -= 0.1; out = canvas.toDataURL('image/jpeg', quality); }
  return out;
}
const PHOTO_SAVE_ERROR = 'Foto non salvata: controlla la connessione. Se il problema resta, in Firebase manca la regola per "recipe-photos" (vedi README).';
async function saveRecipePhoto(name, dataUrl){
  const prev = recipePhotoCache[name];
  recipePhotoCache[name] = { status:'saving' };
  render();
  try{
    await window.cookpopSync.save(recipePhotoPath(name), dataUrl ? { data: dataUrl, updatedAt: Date.now(), by: whatsNewViewerKey() } : null);
    recipePhotoCache[name] = dataUrl ? { status:'ok', src: dataUrl } : { status:'none' };
  }catch(e){
    recipePhotoCache[name] = Object.assign({}, prev && prev.status !== 'saving' ? prev : { status:'none' }, { message: PHOTO_SAVE_ERROR });
  }
  render();
}
document.addEventListener('change', async e=>{
  const input = e.target.closest && e.target.closest('[data-recipe-photo-input]');
  if(!input || !input.files || !input.files[0]) return;
  const name = input.dataset.recipePhotoInput;
  try{
    const dataUrl = await resizeImageToDataUrl(input.files[0]);
    await saveRecipePhoto(name, dataUrl);
  }catch(err){
    recipePhotoCache[name] = Object.assign({}, recipePhotoCache[name], { message: 'Questa immagine non si riesce a leggere: prova con un\'altra foto.' });
    render();
  }
});
document.addEventListener('click', e=>{
  const btn = e.target.closest && e.target.closest('[data-recipe-photo-remove]');
  if(!btn) return;
  const name = btn.dataset.recipePhotoRemove;
  const prev = recipePhotoCache[name];
  saveRecipePhoto(name, null).then(()=>{
    if(prev && prev.status === 'ok' && recipePhotoCache[name].status === 'none') showUndoToast('Foto rimossa', ()=> saveRecipePhoto(name, prev.src));
  });
});

// Finestra "Unisci con…": prima si sceglie il nome da tenere (con ricerca),
// poi un riepilogo di cosa cambia e la conferma. Vedi mergeIngredientInto.
function closeMergeIngredient(){
  state.mergeIngredientFrom = null;
  state.mergeIngredientTarget = null;
  state.mergeIngredientSearch = '';
}
function renderMergeIngredientModal(){
  const from = state.mergeIngredientFrom;
  if(!from) return '';
  const fromKey = from.trim().toLowerCase();
  const target = state.mergeIngredientTarget;
  let body;
  if(target){
    const toKey = target.trim().toLowerCase();
    const a = state.pantryItems[fromKey], b = state.pantryItems[toKey];
    const qtyText = it => it && typeof it.qty === 'number' ? `${it.qty}${it.unit ? ' ' + it.unit : ''}` : '0';
    const sameUnit = !a || !b || !a.unit || !b.unit || a.unit === b.unit;
    const recipes = recipesUsingIngredient(from).length;
    const lines = [
      recipes ? `Le ${recipes === 1 ? 'ricetta che usa' : recipes + ' ricette che usano'} «${escapeHtml(from)}» useranno «${escapeHtml(target)}».` : `Nessuna ricetta usa «${escapeHtml(from)}».`,
      a && typeof a.qty === 'number' && a.qty > 0
        ? (sameUnit ? `In Dispensa le quantità si sommano: ${escapeHtml(qtyText(b))} + ${escapeHtml(qtyText(a))}.` : `In Dispensa resta la quantità di «${escapeHtml(target)}» (${escapeHtml(qtyText(b))}): le unità sono diverse, quella di «${escapeHtml(from)}» (${escapeHtml(qtyText(a))}) non si somma.`)
        : '',
      `Anche in Spesa e nelle note «${escapeHtml(from)}» diventa «${escapeHtml(target)}».`
    ].filter(Boolean);
    body = `
      <p class="merge-summary"><b>${escapeHtml(from)}</b> → <b>${escapeHtml(target)}</b></p>
      <ul class="merge-effects">${lines.map(l=>`<li>${l}</li>`).join('')}</ul>
      <div class="filters-modal-footer">
        <button type="button" class="btn is-outline" data-merge-back>Indietro</button>
        <button type="button" class="btn is-solid mini-add-btn" data-merge-confirm>Unisci</button>
      </div>`;
  } else {
    const search = (state.mergeIngredientSearch || '').trim().toLowerCase();
    const names = allIngredientNamesForManager().filter(n => n.trim().toLowerCase() !== fromKey && (!search || n.toLowerCase().includes(search)));
    body = `
      <p class="section-sub">Scegli il nome da tenere: «${escapeHtml(from)}» sparirà e diventerà quello, nelle ricette, in Dispensa e in Spesa.</p>
      <div class="search-field">
        <input class="input-search" type="search" id="merge-search" placeholder="Cerca il nome da tenere…" value="${escapeAttr(state.mergeIngredientSearch || '')}">
      </div>
      <div class="ingredient-manager-list">
        ${names.map(n=>`<button type="button" class="ingredient-manager-row" data-merge-pick="${escapeAttr(n)}"><span class="dept-icon">${DEPT_ICON[knownDept((state.pantryItems[n.trim().toLowerCase()]||{}).cat) || classifyDept(n)]}</span><span class="ingredient-manager-name">${escapeHtml(n)}</span></button>`).join('') || `<p class="ing-empty">Nessun ingrediente trovato.</p>`}
      </div>`;
  }
  return `
    <div class="filters-modal-backdrop is-second" data-close-merge>
      <div class="filters-modal" data-stop-close>
        <div class="filters-modal-header">
          <h3>Unisci «${escapeHtml(from)}»</h3>
          <button class="btn is-icon filters-close-btn" data-close-merge>✕</button>
        </div>
        ${body}
      </div>
    </div>`;
}
// In fase di cattura: dentro Modifica ingrediente i click vengono fermati
// (stopPropagation sul primo [data-stop-close] del pannello, vedi
// attachHandlers) e non arriverebbero mai fin qui risalendo.
document.addEventListener('click', e=>{
  const t = e.target.closest ? e.target : null;
  if(!t) return;
  const open = t.closest('[data-open-merge]');
  if(open){ state.mergeIngredientFrom = open.dataset.openMerge; state.mergeIngredientTarget = null; state.mergeIngredientSearch = ''; render(); return; }
  // Chiude toccando lo sfondo o la ✕, non un punto qualsiasi dentro la finestra.
  const close = t.closest('[data-close-merge]');
  if(close && (t === close || close.tagName === 'BUTTON')){ closeMergeIngredient(); render(); return; }
  const pick = t.closest('[data-merge-pick]');
  if(pick){ state.mergeIngredientTarget = pick.dataset.mergePick; render(); return; }
  if(t.closest('[data-merge-back]')){ state.mergeIngredientTarget = null; render(); return; }
  if(t.closest('[data-merge-confirm]')){
    const from = state.mergeIngredientFrom, to = state.mergeIngredientTarget;
    if(!from || !to) return;
    const snap = JSON.parse(JSON.stringify(MERGE_SNAPSHOT_FIELDS.reduce((o, f)=>{ o[f] = state[f]; return o; }, {})));
    const prevEditKey = state.pantryEditKey;
    mergeIngredientInto(from, to);
    closeMergeIngredient();
    const toKey = to.trim().toLowerCase();
    state.pantryEditKey = state.pantryItems[toKey] ? toKey : null;
    persist(); render();
    showUndoToast(`«${from}» unito a «${to}»`, ()=>{
      MERGE_SNAPSHOT_FIELDS.forEach(f=>{ state[f] = snap[f] || {}; });
      state.pantryEditKey = prevEditKey && state.pantryItems[prevEditKey] ? prevEditKey : null;
      persist(); render();
    });
  }
}, true);
document.addEventListener('input', e=>{
  if(e.target && e.target.id === 'merge-search'){ state.mergeIngredientSearch = e.target.value; render(); }
});

// Fonte della ricetta: un indirizzo web diventa "Vedi ricetta" (si apre in
// una nuova scheda); un testo qualsiasi (es. "ricettario", per le ricette
// copiate da un quaderno) si mostra così com'è, senza link.
// Gradimento della ricetta, visibile e modificabile con un tocco dalla scheda
// (prima solo come filtro, e cambiarlo voleva dire passare da "Modifica
// ricetta"). Si salva come le altre modifiche al catalogo (state.recipeEdits),
// aggiungendosi a quelle già fatte invece di sostituirle.
function gradimentoPickerHtml(name){
  const r = getRecipeMeta(name);
  if(!r) return '';
  return `
    <div class="grad-picker" role="group" aria-label="Gradimento">
      <span class="grad-picker-label">Vi piace?</span>
      ${GRAD_ORDER.map(g=>`<button type="button" class="btn is-chip grad-chip${r.gradimento===g?' active':''}" aria-pressed="${r.gradimento===g}" data-set-gradimento="${escapeAttr(name)}" data-grad="${g}">${escapeHtml(GRAD_LABEL[g])}</button>`).join('')}
    </div>`;
}
document.addEventListener('click', e=>{
  const chip = e.target.closest && e.target.closest('[data-set-gradimento]');
  if(!chip) return;
  const name = chip.dataset.setGradimento;
  const grad = chip.dataset.grad;
  if(!GRAD_ORDER.includes(grad) || (getRecipeMeta(name) || {}).gradimento === grad) return;
  state.recipeEdits[name] = Object.assign({}, state.recipeEdits[name], { gradimento: grad });
  persist(); render();
}, true); // in cattura: dentro le finestre (es. "Ricetta fatta!") il primo [data-stop-close] ferma la risalita
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
  'pasta-corta': { group:{ label:'Pasta corta', matchName:'pasta corta', cat:'pasta' }, members:['fusilli','penne','pennette','rigatoni','mezze maniche','farfalle','sedani','sedanini','ditalini','tubetti','tortiglioni','pipe','conchiglie','conchiglioni','orecchiette','gomiti','caserecce','gemelli','pasta mista'] },
  'pasta-lunga': { group:{ label:'Pasta lunga', matchName:'pasta lunga', cat:'pasta' }, members:['spaghetti','spaghettoni','linguine','tagliatelle','bucatini','tonnarelli','fettuccine','vermicelli','capellini','trenette','pappardelle','trofie'] },
  'farina': { group:{ label:'Farina', matchName:'farina', cat:'dolci' }, members:['farina 00','farina 0','manitoba','farina manitoba','farina di grano tenero'] },
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
    if(state.pantryConfirmedShop[oldKey]){ state.pantryConfirmedShop[newKey] = state.pantryConfirmedShop[oldKey]; delete state.pantryConfirmedShop[oldKey]; }
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
  return sortRecipeIngredients(list.map(it=>{
    const displayName = resolveIngredientName(it.ingrediente, renames);
    return displayName === it.ingrediente ? it : Object.assign({}, it, { ingrediente: displayName });
  }));
}
// Ordine fisso degli ingredienti in ogni ricetta: prima gli ingredienti
// principali (carne, pesce, salumi, pasta, legumi, pane), poi verdura,
// latticini e uova, conserve e il resto; per ultimi i condimenti (olio, aceto,
// sale, pepe, spezie). A parità di gruppo resta l'ordine scritto nella ricetta.
const RECIPE_ING_ORDER = ['carne','pesce','salumi','pasta','legumi','pane','verdura','latticini','conserve','salse','dolci','surgelati','bibite','altro'];
function recipeIngredientRank(name){
  const dept = classifyDept(name);
  if(dept === 'base'){
    const n = String(name || '').toLowerCase();
    const sub = /\bolio\b/.test(n) ? 0 : /\baceto\b/.test(n) ? 1 : /\bsale\b/.test(n) ? 2 : 3;
    return 100 + sub;
  }
  const i = RECIPE_ING_ORDER.indexOf(dept);
  return i < 0 ? RECIPE_ING_ORDER.length : i;
}
function sortRecipeIngredients(list){
  return list.map((it, idx) => ({ it, idx, r: recipeIngredientRank(it.ingrediente) }))
    .sort((x, y) => x.r - y.r || x.idx - y.idx).map(x => x.it);
}
// Nome finale di un ingrediente seguendo i sinonimi (quelli curati e quelli
// creati dall'app, che hanno la precedenza), con protezione dai giri chiusi.
function resolveIngredientName(name, renames){
  renames = renames || Object.assign({}, CURATED_INGREDIENT_RENAMES, state.ingredientRenames);
  let displayName = name;
  const seen = new Set();
  let key = (displayName||'').trim().toLowerCase();
  while(renames[key] && !seen.has(key)){
    seen.add(key);
    displayName = renames[key];
    key = displayName.trim().toLowerCase();
  }
  return displayName;
}

// "Unisci con…" (da Modifica ingrediente, anche partendo da Gestisci
// ingredienti): due nomi che sono la stessa cosa diventano uno solo, senza
// dover chiedere di scriverlo nel codice (CURATED_INGREDIENT_RENAMES).
// - ricette: il vecchio nome diventa un sinonimo del nuovo (ingredientRenames,
//   condiviso con tutti gli spazi come il resto del catalogo); chi puntava già
//   al vecchio nome viene rediretto al nuovo;
// - Dispensa: una voce sola; quantità sommate se hanno la stessa unità (o
//   nessuna), altrimenti resta quella del nome tenuto; unità, categoria,
//   gruppo e luogo presi dal vecchio solo dove il nuovo non li ha;
// - Spesa: "da comprare", righe aggiunte a mano e nota passano al nuovo nome.
const MERGE_SNAPSHOT_FIELDS = ['ingredientRenames','pantryItems','pantryConfirmedShop','shopDismissed','shopExtras','ingredientNotes','pantrySelected'];
function mergeIngredientInto(fromName, toName){
  const fromKey = (fromName||'').trim().toLowerCase();
  const to = (toName||'').trim();
  const toKey = to.toLowerCase();
  if(!fromKey || !toKey || fromKey === toKey) return;
  // Se il nome tenuto era a sua volta un sinonimo che riporta al vecchio,
  // lo si fissa su se stesso: altrimenti i due si rimanderebbero a vicenda.
  if(resolveIngredientName(to).trim().toLowerCase() === fromKey) state.ingredientRenames[toKey] = to;
  for(const k in state.ingredientRenames){
    if(k !== toKey && (state.ingredientRenames[k]||'').trim().toLowerCase() === fromKey) state.ingredientRenames[k] = to;
  }
  state.ingredientRenames[fromKey] = to;

  const old = state.pantryItems[fromKey];
  if(old){
    const cur = state.pantryItems[toKey];
    if(cur){
      const sameUnit = !old.unit || !cur.unit || old.unit === cur.unit;
      if(sameUnit && typeof old.qty === 'number') cur.qty = (typeof cur.qty === 'number' ? cur.qty : 0) + old.qty;
      ['unit','cat','group','luogo'].forEach(f=>{ if(!cur[f] && old[f]) cur[f] = old[f]; });
      if(old.scadenza && (!cur.scadenza || old.scadenza < cur.scadenza)) cur.scadenza = old.scadenza; // vale la più vicina
    } else {
      state.pantryItems[toKey] = Object.assign({}, old, { nome: to });
    }
    delete state.pantryItems[fromKey];
  }
  if(state.pantryConfirmedShop[fromKey]){ state.pantryConfirmedShop[toKey] = state.pantryConfirmedShop[fromKey]; delete state.pantryConfirmedShop[fromKey]; }
  if(state.shopDismissed['oos_'+fromKey]){ delete state.shopDismissed['oos_'+fromKey]; }
  if(state.pantrySelected) delete state.pantrySelected[fromKey];
  Object.values(state.shopExtras || {}).forEach(it=>{
    if(it && (it.ingrediente||'').trim().toLowerCase() === fromKey) it.ingrediente = to;
  });
  if(state.ingredientNotes[fromKey]){
    if(!state.ingredientNotes[toKey]) state.ingredientNotes[toKey] = state.ingredientNotes[fromKey];
    delete state.ingredientNotes[fromKey];
  }
}
function recipesUsingIngredient(name){
  const key = (name||'').trim().toLowerCase();
  return allRecipeMetas().filter(r => getIngredientsFor(r.nome).some(it => (it.ingrediente||'').trim().toLowerCase() === key));
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
// Chiave per confrontare i nomi degli ingredienti: minuscolo, senza accenti né
// spazi doppi. Lo "stem" toglie l'ultima vocale, così "pomodori" trova "pomodoro".
function ingMatchKey(s){ return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim(); }
function ingMatchStem(k){ return k.length > 3 ? k.replace(/[aeiou]$/, '') : k; }
// Se il nome scritto coincide (a meno di maiuscole/accenti) con uno esistente si
// usa quello esistente, per non creare doppioni; altrimenti resta come scritto.
function canonicalIngredientName(name){
  const k = ingMatchKey(name);
  if(!k) return name;
  const hit = allKnownIngredientNamesWithGroups().find(n => ingMatchKey(n) === k);
  return hit || name;
}
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
    const raw = input.value.trim();
    const q = ingMatchKey(raw);
    if(!q){ list.innerHTML = ''; return; }
    const pool = allKnownIngredientNamesWithGroups();
    const stem = ingMatchStem(q);
    const matches = pool.filter(n => { const k = ingMatchKey(n); return k.includes(q) || (stem.length >= 3 && k.includes(stem)); })
      .sort((x, y) => (ingMatchKey(y).startsWith(q) ? 1 : 0) - (ingMatchKey(x).startsWith(q) ? 1 : 0))
      .slice(0, 8);
    const exact = pool.some(n => ingMatchKey(n) === q);
    let html = matches.map(n=>`<button type="button" class="add-ing-suggestion" data-combo-pick>${escapeHtml(n)}</button>`).join('');
    if(!exact) html += `<button type="button" class="add-ing-suggestion add-ing-suggestion-new" data-combo-create>+ Crea "${escapeHtml(raw)}" come nuovo ingrediente</button>`;
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
    'pasta-corta': { label:'Pasta corta', matchName:'pasta corta', cat:'pasta' },
    'pasta-lunga': { label:'Pasta lunga', matchName:'pasta lunga', cat:'pasta' },
    'riso-carnaroli-vialone': { label:'Riso Carnaroli o Vialone Nano', matchName:'riso carnaroli o vialone nano', cat:'pasta' },
    'provolone-brie': { label:'Provolone o brie', matchName:'provolone o brie', cat:'latticini' },
    'zucchero-miele': { label:'Zucchero o miele', matchName:'zucchero o miele', cat:'dispensa' },
    'rosmarino-alloro': { label:'Rosmarino o alloro', matchName:'rosmarino o alloro', cat:'dispensa' },
    'guanciale-pancetta': { label:'Guanciale o pancetta', matchName:'guanciale o pancetta', cat:'salumi' },
    'basilico-menta': { label:'Basilico o menta', matchName:'basilico o menta', cat:'verdura' },
    'olio-burro': { label:'Olio EVO o burro', matchName:'olio evo o burro', cat:'dispensa' },
    'grana-parmigiano': { label:'Grana o parmigiano a scaglie', matchName:'grana o parmigiano a scaglie', cat:'latticini' }
  },
  pantryGroupsModalOpen: false,
  deptsModalOpen: false, // non persistito: modale "Gestisci categorie" aperta/chiusa
  customDepts: {}, // categorie create dall'utente, condivise tra gli spazi (vedi applyCustomDepts)
  shopSearch: '', // non persistito: filtro testuale della lista Spesa
  pantryGroupBy: 'cat', // 'cat' | 'luogo' | 'az' — "Ordina per" in Dispensa, non persistito come shopView
  pantryView: 'cibo', // 'cibo' | 'casa' — non persistito (vedi persist()): stesso motivo di shopView
  pantrySearch: '', // non persistito: filtro testuale corrente in Dispensa, si resetta a ogni apertura dell'app
  ingredientManagerOpen: false, // non persistito: modale "Gestisci ingredienti" aperta/chiusa
  ingredientManagerSearch: '', // non persistito: filtro testuale corrente lì dentro
  recipeImport: null, // non persistito: { name, link, text } della pagina "Importa ricetta"
  cookbooks: [], // Libro di cucina: album di ricette [{ id, name, recipes:[nomi] }] (vedi renderCookbooksView)
  prepView: 'ricette', // non persistito: 'ricette' | 'libro' (interruttore in basso in Ricette)
  cookbookOpenId: null, cookbookPickOpen: false, cookbookUseOpen: false, cookbookMenuOpen: false, cookbookPickSearch: '', cookbookNameDraft: null, albumForRecipe: null, // non persistiti: pagine/modali del Libro di cucina
  shopAisleCustom: [], // ordine corsie della Spesa scelto a mano (vedi shopAisles)
  aisleOrderOpen: false, // non persistito: pagina "Ordine corsie"
  loyaltyCards: [], // carte fedeltà [{ id, name, number, color, format }] (vedi renderCardsPages)
  cardsOpen: null, cardViewId: null, cardDraft: null, cardScanMsg: '', cardsImport: null, cardsSearch: '', cardsListUnder: false, // non persistiti: pagine Carte
  inventoryOpen: false, // non persistito: pagina "Inventario veloce" aperta
  inventoryFilter: 'todo', inventorySearch: '', inventoryKeep: {}, // non persistiti: filtro/ricerca, e righe col Sì ancora aperte (in attesa di OK)
  inventoryAnswered: null, // risposte dell'inventario (in localStorage, vedi inventoryAnswers)
  ingredientManagerFilter: 'tutti', // non persistito: 'tutti' | 'casa' (in Dispensa) | 'no'
  deptEditId: null, // non persistito: categoria aperta in modifica ('new' per una nuova)
  deptDraft: null, // non persistito: { icon, label, nonFood } della categoria in modifica
  groupEditId: null, // non persistito: gruppo aperto in modifica ('new' per uno nuovo)
  groupDraft: null, // non persistito: { label, matchName, cat, matchTouched }
  groupMemberSearch: '', // non persistito: ricerca "Aggiungi un formato" nel gruppo in modifica
  expiryConfirm: [], // non persistito: chiavi di Dispensa con scadenza stimata da confermare (renderExpiryConfirmModal)
  balanceDetailsOpen: false, // non persistito: spiegazione sotto la riga dell'equilibrio nel Menù
  prepPantryMode: false, // non persistito: Ricette in modalità "Con quello che ho"
  whatsNewSeen: null, // vecchio: una sola "già vista" per tutto lo spazio — non più usato, vedi whatsNewSeenBy
  whatsNewSeenBy: {}, // { persona: ultima WHATS_NEW.version chiusa } — per persona, non per spazio (vedi renderWhatsNewModal)
  pantryEditingKey: null,
  linkNoteEditingKey: null, // dayKey della nota "Variante" attualmente in modifica (Menù, giorni avanzo)
  pantryLuogoPicker: null,
  pantryFinishPicker: null, // ephemeral: chiave della voce di Dispensa arrivata a 0, in attesa di "+" (in lista spesa) o cestino (tra i Finiti)
  pantrySectionCollapsed: {}, // id sezione (luogo_X / cat_X) -> true se chiusa; aperta di default se assente
  pantrySelectMode: false, // true dopo una pressione lunga: un tap semplice seleziona/deseleziona invece di aprire il luogo-picker
  pantrySelected: {}, // pantryKey -> true, selezione corrente in Dispensa (qualsiasi riga, non solo Finiti; non persistita)
  shopFinitiOpen: false, // accordion "Finiti", condiviso da Per reparto e Per giorno, chiuso di default
  shopSectionCollapsed: {}, // id sezione (reparto_X / giorno_X) -> true se chiusa; aperta di default se assente
  pantryConfirmedShop: {}, // pantryKey -> true (o la quantità scritta in "Aggiungi", es. "2 kg"), ingrediente finito "aggiunto alla lista": in Spesa/per reparto esce dal blocco Finiti e si mescola nel suo reparto vero
  pantryEditKey: null,
  recipeHistory: [], // [{ nome, dal: 'AAAA-MM-GG' }]: ricette delle settimane finite, per non ripeterle subito (vedi recentRecipeNames)
  pantryDraft: null, // non persistito: bozza della scheda "Nuovo ingrediente"
  pantrySheetPicker: null, // non persistito: 'cat' | 'group', elenco aperto nella scheda ingrediente
  pantrySheetMore: false, // non persistito: sezione "Altro" della scheda aperta
  mergeIngredientFrom: null, // non persistito: "Unisci con…" aperto per questo nome (vedi mergeIngredientInto)
  mergeIngredientTarget: null, // non persistito: nome scelto con cui unire, in attesa di conferma
  mergeIngredientSearch: '', // non persistito: ricerca nella scelta
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
  genPantryOnly: false, // non persistito: "Solo con quello che ho" nelle Regole di generazione
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
  prepDay: {}, // { 'AAAA-MM-GG' (sabato d'inizio settimana): 'sab'|'dom' } giorno di prep di quella settimana
  dishPlan: {}, // { mealKey: [{ name, prep, double, done, frozen }] } meal prep e doppia dose per piatto (vedi renderPrepBox)
  freezerDishes: {}, // { mealKey: [nomi] } piatti presi dal freezer: niente Spesa, porzioni scalate a pasto cucinato
  prepSuggOpen: {}, // ephemeral: settimana -> suggerimenti di prep aperti
  dishPicker: null, // ephemeral: {key: mealKey, replace: nome del piatto da cambiare o null, tipo, search} per "+ piatto"/"Cambia" del singolo piatto
  cookTimer: null, // ephemeral: { end (ms), total (s), label } timer del passo in modalità cucina
  cookMode: null, // ephemeral: { name, step } modalità cucina (un passo per schermata)
  recipePortions: {}, // ephemeral: ricetta -> persone scelte nel dettaglio del Ricettario
  recipeMenuOpen: false, // ephemeral: menù ⋯ del dettaglio ricetta
  dishPane: {}, // ephemeral: "mealKey|piatto" (o "r|ricetta") -> 'ing' | 'steps', tab dentro il piatto
  dishTab: {}, // ephemeral: mealKey -> nome del piatto attivo nella tab del dettaglio del pasto
  mealDetailMenuOpen: false, // ephemeral: menù ⋯ (porzioni) del dettaglio del pasto
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
  doneModalBread: 0, // ephemeral: panini da togliere dalla Dispensa alla conferma di "Ricetta fatta!" (vedi mealHasBread)
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
// Link "#carte=…" (dati in base64url: [[negozio, numero, formato, colore], …]):
// importa delle carte fedeltà dopo una conferma (vedi renderCardsPages). Il
// frammento dopo # non arriva a nessun server; tolto subito dall'indirizzo.
// [[negozio, numero, formato, colore, logo (data:image/…)], …]
function parseCardsImport(list){
  return (Array.isArray(list) ? list : []).filter(c => Array.isArray(c) && c[0] && c[1]).map(c => ({
    name: String(c[0]), number: String(c[1]), format: c[2] || undefined, color: c[3] || undefined,
    logo: typeof c[4] === 'string' && /^data:image\/(png|jpeg|webp);base64,/.test(c[4]) ? c[4] : undefined
  }));
}
function readCardsImportFromHash(){
  const m = /^#carte=([A-Za-z0-9_-]+)/.exec(window.location.hash);
  if(!m) return false;
  try{
    const b64 = m[1].replace(/-/g, '+').replace(/_/g, '/');
    const bin = atob(b64 + '='.repeat((4 - b64.length % 4) % 4));
    const list = JSON.parse(new TextDecoder().decode(Uint8Array.from(bin, c => c.charCodeAt(0))));
    state.cardsImport = parseCardsImport(list);
  }catch(e){ state.cardsImport = null; }
  history.replaceState(null, '', location.pathname + location.search + '#spesa');
  return true;
}
if(readCardsImportFromHash()) state.tab = 'spesa';
state.tab = tabFromHash();
window.addEventListener('hashchange', ()=>{
  if(readCardsImportFromHash()){ state.tab = 'spesa'; render(); return; }
  const next = tabFromHash();
  if(next !== state.tab){ state.tab = next; render(); }
});

// Sincronizzazione condivisa via Firebase Realtime Database: chiunque apra la
// pagina legge/scrive lo stesso stato, con aggiornamenti in tempo reale tra
// dispositivi diversi. Import dinamico per restare in un unico <script> classico.
const firebaseReady = (async ()=>{
  try{
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js");
    const { getDatabase, ref, set: fbSet, update: fbUpdate, onValue, get: fbGet } = await import("https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js");
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
      onChange(path, cb){ onValue(ref(db, path), (snap)=>cb(snap.val())); },
      // Lettura una tantum (niente ascolto continuo): per le foto delle
      // ricette, che si scaricano solo quando si apre quella ricetta.
      load(path){ return fbGet(ref(db, path)).then(snap => snap.val()); }
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
      'riso-carnaroli-vialone': { label:'Riso Carnaroli o Vialone Nano', matchName:'riso carnaroli o vialone nano', cat:'pasta' },
      'provolone-brie': { label:'Provolone o brie', matchName:'provolone o brie', cat:'latticini' },
      'zucchero-miele': { label:'Zucchero o miele', matchName:'zucchero o miele', cat:'dispensa' },
      'rosmarino-alloro': { label:'Rosmarino o alloro', matchName:'rosmarino o alloro', cat:'dispensa' },
      'guanciale-pancetta': { label:'Guanciale o pancetta', matchName:'guanciale o pancetta', cat:'salumi' },
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
  }},
  // 21. Una tantum: gradimento azzerato su tutte le ricette (richiesta di
  // Mara, ottobre 2026): si ricomincia a votarle sul serio quando si segnano
  // cucinate. Il catalogo (catalog.js) è già senza gradimento; qui si tolgono
  // quelli salvati nelle modifiche e nelle ricette aggiunte a mano. Il
  // catalogo è condiviso tra gli spazi: gira solo nello spazio di casa, così
  // l'apertura dell'app da un altro spazio non cancella i voti dati dopo.
  { flag: 'gradimentoReset1', run(){
    if(getSpaceRoute().id !== 'default') return;
    Object.values(state.recipeEdits || {}).forEach(edit=>{ if(edit && 'gradimento' in edit) edit.gradimento = ''; });
    Object.values(state.customRecipes || {}).forEach(r=>{ if(r && 'gradimento' in r) r.gradimento = ''; });
  }},
  // 22. Una tantum: nuove categorie alimentari, come le corsie del
  // supermercato (ottobre 2026). "Uova" confluisce in "Latticini e uova",
  // "Dispensa e condimenti" sparisce, nascono Salumi, Pasta, Conserve, Salse
  // e Dolci. Le voci nelle categorie rimescolate si riclassificano dal nome
  // (se il nome non dice niente restano dov'erano, o finiscono in Altro se
  // la loro categoria non esiste più); verdura, surgelati, avanzi, casa e le
  // categorie create a mano non si toccano. I nomi/emoji personalizzati delle
  // categorie rimescolate si tolgono, altrimenti coprirebbero quelli nuovi.
  { flag: 'deptsRegrouped1', run(){
    const RESHUFFLED = ['carne','pesce','latticini','uova','pane','legumi','base','dispensa','bibite','altro'];
    const GONE = { uova:'latticini', dispensa:'' };
    const recat = (cat, name) => {
      if(!RESHUFFLED.includes(cat)) return cat;
      const auto = classifyDept(name || '');
      if(auto !== 'altro') return auto;
      return cat in GONE ? GONE[cat] : cat;
    };
    Object.values(state.pantryItems || {}).forEach(it=>{ if(it && it.cat) it.cat = recat(it.cat, it.nome); });
    Object.values(state.shopExtras || {}).forEach(it=>{ if(it && it.cat) it.cat = recat(it.cat, it.ingrediente); });
    Object.values(state.pantryGroups || {}).forEach(g=>{ if(g && g.cat) g.cat = recat(g.cat, g.matchName || g.label); });
    const custom = state.customDepts || {};
    RESHUFFLED.forEach(id=>{ if(custom[id]) delete custom[id]; });
  }},
  // 23. Una tantum: il rosmarino fresco va con la verdura come la salvia (era
  // tra le spezie), e ciò che nel nome è surgelato/congelato va in Surgelati
  // qualunque cosa sia, così in Spesa sta in fondo con gli altri surgelati.
  { flag: 'deptsRegrouped2', run(){
    const fix = (cat, name) => {
      const auto = classifyDept(name || '');
      if(auto === 'surgelati' && cat && !isNonFoodDept(cat)) return 'surgelati';
      if(cat === 'base' && auto === 'verdura') return 'verdura';
      return cat;
    };
    Object.values(state.pantryItems || {}).forEach(it=>{ if(it && it.cat) it.cat = fix(it.cat, it.nome); });
    Object.values(state.shopExtras || {}).forEach(it=>{ if(it && it.cat) it.cat = fix(it.cat, it.ingrediente); });
    Object.values(state.pantryGroups || {}).forEach(g=>{ if(g && g.cat) g.cat = fix(g.cat, g.matchName || g.label); });
  }},
  // 24. Una tantum (richiesta di Mara, ottobre 2026): tutti gli ingredienti
  // rimessi in categoria con le regole nuove, anche quelli scelti a mano in
  // una categoria di base. Restano dove sono: le categorie create a mano, gli
  // avanzi, i prodotti per la casa e ciò che il nome non fa riconoscere.
  { flag: 'deptsRegrouped3', run(){
    const fix = (cat, name) => {
      if(!cat || cat === 'avanzi' || !BASE_DEPT_LABEL[cat] || isNonFoodDept(cat)) return cat;
      const auto = classifyDept(name || '');
      return auto === 'altro' || isNonFoodDept(auto) ? cat : auto;
    };
    Object.values(state.pantryItems || {}).forEach(it=>{ if(it && it.cat) it.cat = fix(it.cat, it.nome); });
    Object.values(state.shopExtras || {}).forEach(it=>{ if(it && it.cat) it.cat = fix(it.cat, it.ingrediente); });
    Object.values(state.pantryGroups || {}).forEach(g=>{ if(g && g.cat) g.cat = fix(g.cat, g.matchName || g.label); });
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
const PERSONAL_DICT_FIELDS = ['whatsNewSeenBy','shopChecked','shopDismissed','shopExtras','shopQty','pantryChecked','pantryConfirmedShop','weekOverrides','weekOverridePicked','weekBaseline','weekTempoExceptions','notifDismissed','mealsDoneReminderDismissed','dayLinks','dayLinkNotes','dayPortions','mealLocked','cooks','shopAssignees','ingredientNotes','mealsDone','pantryItems','userColors','prepDay','dishPlan','freezerDishes'];
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
// Un pasto vuoto non può essere bloccato né essere "avanzo di" un altro, né
// fare da avanzo per un altro: ogni volta che si salva, blocchi e
// collegamenti rimasti su un pasto senza ricetta (svuotato, piatto tolto,
// ricetta eliminata) se ne vanno.
function dropEmptyMealFlags(){
  const isEmpty = key => {
    try{ const { weekIdx, i, meal } = parseMealKey(key); return !effectiveMeal(weekIdx, i, meal).principale; }
    catch(e){ return false; }
  };
  Object.keys(state.mealLocked || {}).forEach(k=>{ if(isEmpty(k)) delete state.mealLocked[k]; });
  Object.keys(state.dayLinks || {}).forEach(k=>{
    if(isEmpty(state.dayLinks[k])){ delete state.dayLinks[k]; delete state.dayLinkNotes[k]; }
  });
}
function persist(){
  purgeFinishedLeftovers();
  dropEmptyMealFlags();
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
    whatsNewSeenBy: state.whatsNewSeenBy,
    recipeHistory: state.recipeHistory,
    prepDay: state.prepDay,
    dishPlan: state.dishPlan,
    freezerDishes: state.freezerDishes,
    loyaltyCards: state.loyaltyCards,
    shopAisleCustom: state.shopAisleCustom,
    cookbooks: state.cookbooks
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
// La Dispensa nel generatore: a parità di equilibrio (weekPlanScore, a
// punti interi) si preferisce la settimana che usa quello che scade — in un
// pasto che cade prima della scadenza, più conta quanto più è vicina — e poi,
// di poco, quella con più ingredienti già in casa (esclusi sale, olio e
// spezie, reparto "base"). pantryPlanScore vale sempre meno di 1 punto:
// non può mai far perdere equilibrio, sceglie solo tra settimane equivalenti.
const PANTRY_EXPIRY_HORIZON = 7; // giorni: oltre, la scadenza non guida la scelta
// Voci di Dispensa (cibo, con scorta) che scadono entro PANTRY_EXPIRY_HORIZON:
// chiave voce -> giorni alla scadenza.
function pantryExpiringMap(){
  const expiring = {};
  Object.entries(state.pantryItems).forEach(([key, it])=>{
    const d = pantryExpiryDays(it);
    if(d !== null && d >= 0 && d <= PANTRY_EXPIRY_HORIZON && !isNonFoodDept(knownDept(it.cat) || classifyDept(it.nome))) expiring[key] = d;
  });
  return expiring;
}
// Quanto di una ricetta c'è già in Dispensa (sale, olio e spezie esclusi,
// reparto "base", e l'acqua): usato dal generatore e da "Con quello che ho"
// in Ricette.
// exp: voci in scadenza che la ricetta userebbe, { key, nome, d }.
function recipePantryMatch(nome, expiring){
  const ings = getIngredientsFor(nome).filter(it => it.ingrediente && classifyDept(it.ingrediente) !== 'base' && !/^acqua\b/i.test(it.ingrediente.trim()));
  const missing = [];
  let have = 0;
  const exp = [];
  ings.forEach(it=>{
    if(pantryStatusFor(it.ingrediente, it.qta) === 'manca') missing.push(it.ingrediente);
    else have++;
    const p = resolvePantryItem(it.ingrediente);
    const key = p && (p.nome || '').trim().toLowerCase();
    if(key && expiring[key] !== undefined && !exp.some(e => e.key === key)) exp.push({ key, nome: p.nome, d: expiring[key] });
  });
  return { total: ings.length, have, missing, cov: ings.length ? have / ings.length : 0, exp };
}
function buildPantryPlanContext(weekIdx, slots){
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dates = weekDatesFor(weekIdx || 0);
  const slotOffset = slots.map(s=>{
    const d = dates[WEEK_DISPLAY_ORDER.indexOf(s.day)];
    return Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()) - today) / 86400000);
  });
  const expiring = pantryExpiringMap();
  const expMax = Object.values(expiring).reduce((sum, d) => sum + 1 / (1 + d), 0);
  const cache = new Map();
  function recipeInfo(r){
    if(cache.has(r.nome)) return cache.get(r.nome);
    const m = recipePantryMatch(r.nome, expiring);
    const info = { cov: m.cov, exp: m.exp };
    cache.set(r.nome, info);
    return info;
  }
  return { slotOffset, expiring, expMax, recipeInfo, active: expMax > 0 || Object.values(state.pantryItems).some(it => typeof it.qty === 'number' && it.qty > 0) };
}
function pantryPlanScore(picks, ctx){
  if(!ctx || !ctx.active) return 0;
  const covered = {};
  let cov = 0;
  picks.forEach((r, i)=>{
    const info = ctx.recipeInfo(r);
    cov += info.cov;
    const off = ctx.slotOffset[i];
    info.exp.forEach(e=>{
      if(off >= 0 && off <= e.d) covered[e.key] = 1 / (1 + e.d);
    });
  });
  const expScore = ctx.expMax ? Object.values(covered).reduce((a, b) => a + b, 0) / ctx.expMax : 0;
  return -(0.6 * expScore + 0.35 * (picks.length ? cov / picks.length : 0));
}
// Ingredienti in scadenza usati da una settimana già scelta (per dirlo dopo
// la generazione): nomi delle voci di Dispensa, dalla più urgente.
function expiringUsedByPlan(picks, ctx){
  const used = new Set();
  picks.forEach((r, i)=> ctx.recipeInfo(r).exp.forEach(e=>{ if(ctx.slotOffset[i] >= 0 && ctx.slotOffset[i] <= e.d) used.add(e.key); }));
  return [...used].sort((a, b) => ctx.expiring[a] - ctx.expiring[b]).map(k => state.pantryItems[k].nome);
}
// "Solo con quello che ho": le ricette (con ingredienti salvati) a cui manca
// meno, partendo da quelle a cui non manca niente. Se non bastano per i
// pasti da riempire si allarga a quelle a cui manca 1 cosa, poi 2, ecc.
function pantryOnlyPool(list, need, expiring){
  const scored = list.map(r => ({ r, m: recipePantryMatch(r.nome, expiring) })).filter(x => x.m.total);
  if(!scored.length) return list;
  let k = 0;
  while(scored.filter(x => x.m.missing.length <= k).length < need && k < 50) k++;
  return scored.filter(x => x.m.missing.length <= k).map(x => x.r);
}
function pickWeekRecipes(fixed, weekIdx){
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
  const pantryCtx = buildPantryPlanContext(weekIdx, slots);
  const fixedAt = slots.map(s => fixed[`${s.day}_${s.meal}`] || null);
  const fixedNames = new Set(fixedAt.filter(Boolean).map(r => r.nome));
  const pantryOnly = !!state.genPantryOnly;
  if(pantryOnly){
    // Con quello che ho, la stagione conta meno: si parte da tutte le ricette.
    const need = fixedAt.filter(f => !f).length;
    pool = pantryOnlyPool(allRecipeMetas().filter(isMainDish).filter(r => !fixedNames.has(r.nome)), need, pantryCtx.expiring);
  }
  const recent = recentRecipeNames(weekIdx);
  const recentScore = picks => picks.reduce((sum, r) => sum + (recent.has(r.nome) && !fixedNames.has(r.nome) ? RECENT_PENALTY : 0), 0);
  const totalScore = picks => weekPlanScore(picks, slots, seq) + recentScore(picks) + pantryPlanScore(picks, pantryCtx);
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
    let score = totalScore(picks);
    // Senza Dispensa di mezzo ci si ferma all'equilibrio perfetto (0); con la
    // Dispensa si continua a cercare, finché per un po' non migliora più.
    let sinceBetter = 0;
    for(let it = 0; it < 1500 && (pantryCtx.active ? sinceBetter < 400 || score >= 1 : score > 0); it++){
      sinceBetter++;
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
      const nextScore = totalScore(next);
      if(nextScore < score) sinceBetter = 0;
      if(nextScore <= score){ picks = next; score = nextScore; }
    }
    return { picks, score };
  }
  let best = null;
  for(let attempt = 0; attempt < 6; attempt++){
    const res = improve(randomWeek());
    if(!best || res.score < best.score) best = res;
    if(best.score === 0 && !pantryCtx.active) break;
  }
  const picks = best.picks;

  const days = [];
  for(let day = 0; day < 7; day++) days.push({ cena: null, pranzo: null });
  slots.forEach((s, i)=>{ days[s.day][s.meal] = { principale: picks[i], contorni: [] }; });
  // Verdura a ogni pasto: un contorno dove il piatto non ne ha. Senza
  // ripetere lo stesso contorno nella settimana, finché ce ne sono.
  const usedContorni = new Set();
  const shuffledContorni = shuffle(contorniPool);
  slots.forEach((s, si)=>{
    const m = days[s.day][s.meal];
    if(recipeGivesVeg(m.principale)) return;
    // prima i contorni con una verdura che scade entro questo pasto
    const urgent = r => pantryCtx.recipeInfo(r).exp.some(e => pantryCtx.slotOffset[si] >= 0 && pantryCtx.slotOffset[si] <= e.d) ? 1 : 0;
    const fitsAll = withinCap(shuffledContorni, s.day, s.meal).slice().sort((a, b) => urgent(b) - urgent(a));
    // Solo con quello che ho: un contorno solo se c'è tutto, altrimenti niente.
    const fits = pantryOnly ? fitsAll.filter(r => { const m = recipePantryMatch(r.nome, pantryCtx.expiring); return m.total && !m.missing.length; }) : fitsAll;
    const contorno = fits.find(r => !usedContorni.has(r.nome)) || fits[0];
    if(!contorno) return; // nessun contorno di stagione: va bene comunque
    usedContorni.add(contorno.nome);
    m.contorni.push(contorno);
  });
  const allPicks = slots.map(s => days[s.day][s.meal]).flatMap(m => [m.principale, ...m.contorni]);
  const allOffsets = slots.flatMap(s => { const m = days[s.day][s.meal]; return Array(1 + m.contorni.length).fill(pantryCtx.slotOffset[slots.indexOf(s)]); });
  days.expiringUsed = expiringUsedByPlan(allPicks, Object.assign({}, pantryCtx, { slotOffset: allOffsets }));
  // Pasti generati (non bloccati) a cui manca ancora qualcosa da comprare.
  days.pantryShort = pantryOnly ? slots.filter((s, i) => !fixedAt[i] && recipePantryMatch(picks[i].nome, pantryCtx.expiring).missing.length).length : 0;
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

// --- Piatti di un pasto ------------------------------------------------------
// In memoria un pasto resta {principale, contorni[]} (lo usano generatore,
// avanzi, Spesa e sincronizzazione), ma a video tutti i piatti hanno lo
// stesso peso e stanno nell'ordine in cui si mangiano: lo decide la
// tipologia della ricetta, non chi è il "principale". A parità di portata
// resta l'ordine in cui sono stati aggiunti. Il piatto unico sta tra primo e
// secondo; una ricetta fuori catalogo (senza portata) va in fondo.
const ICON_SWAP = '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="1em" height="1em" viewBox="0 0 256 256"><path fill="currentColor" d="M228 48v48a12 12 0 0 1-12 12h-48a12 12 0 0 1 0-24h19l-7.8-7.8a75.55 75.55 0 0 0-53.32-22.26h-.43a75.5 75.5 0 0 0-53.06 21.63a12 12 0 1 1-16.78-17.16a99.38 99.38 0 0 1 69.87-28.47h.52a99.42 99.42 0 0 1 70.2 29.29L204 67V48a12 12 0 0 1 24 0m-44.39 132.43a75.5 75.5 0 0 1-53.09 21.63h-.43a75.55 75.55 0 0 1-53.32-22.26L69 172h19a12 12 0 0 0 0-24H40a12 12 0 0 0-12 12v48a12 12 0 0 0 24 0v-19l7.8 7.8a99.42 99.42 0 0 0 70.2 29.26h.56a99.38 99.38 0 0 0 69.87-28.47a12 12 0 0 0-16.78-17.16Z"></path></svg>';
const COURSE_ORDER = ['antipasto','primo','unico','secondo','contorno','dolce'];
function dishCourse(name){
  const r = getRecipeMeta(name);
  return (r && r.tipologia) || '';
}
function courseLabel(tipo){ return tipo === 'unico' ? 'Piatto unico' : (TIPO_LABEL[tipo] || 'Piatto'); }
// role come in dayIngKey/buildShopFlat: 'p' il principale, 'c0'/'c1'... gli altri.
function mealDishes(weekIdx, i, meal){
  const m = effectiveMeal(weekIdx, i, meal);
  if(!m.principale) return [];
  const list = [{ name: m.principale, role: 'p' }].concat((m.contorni || []).map((c, ci) => ({ name: c, role: `c${ci}` })));
  const rank = t => { const k = COURSE_ORDER.indexOf(t); return k < 0 ? COURSE_ORDER.length : k; };
  list.forEach((d, idx) => { d.tipo = dishCourse(d.name); d.idx = idx; });
  return list.sort((a, b) => rank(a.tipo) - rank(b.tipo) || a.idx - b.idx);
}
// Salva il pasto come override {principale, contorni}. Se cambia il principale,
// chi era "avanzo di" questo pasto perde il collegamento (come dopo "Cambia").
function writeMealDishes(weekIdx, i, meal, principale, contorni){
  const key = mealKey(weekIdx, i, meal);
  const before = effectiveMeal(weekIdx, i, meal).principale;
  const map = weekOverridesRef(weekIdx);
  if(!map[i]) map[i] = emptyDaySlot();
  map[i][meal] = { principale, contorni };
  const picked = weekOverridePickedRef(weekIdx);
  if(!picked[i]) picked[i] = {};
  picked[i][meal] = true;
  if(before !== principale) unlinkDaysPointingTo(key);
}
// Copia di ciò che un cambio di piatto può toccare, per "Annulla".
function snapshotMealDishes(weekIdx, i, meal){
  const key = mealKey(weekIdx, i, meal);
  const om = weekOverridesRef(weekIdx), pm = weekOverridePickedRef(weekIdx);
  return {
    slot: om[i] && om[i][meal] ? JSON.parse(JSON.stringify(om[i][meal])) : undefined,
    picked: pm[i] ? pm[i][meal] : undefined,
    links: snapshotMealLinks(key),
    plan: state.dishPlan && state.dishPlan[key] ? JSON.parse(JSON.stringify(state.dishPlan[key])) : undefined,
    freezer: state.freezerDishes && state.freezerDishes[key] ? state.freezerDishes[key].slice() : undefined
  };
}
function restoreMealDishes(weekIdx, i, meal, snap){
  const om = weekOverridesRef(weekIdx), pm = weekOverridePickedRef(weekIdx);
  if(snap.slot !== undefined){ if(!om[i]) om[i] = emptyDaySlot(); om[i][meal] = snap.slot; }
  else if(om[i]) delete om[i][meal];
  if(snap.picked !== undefined){ if(!pm[i]) pm[i] = {}; pm[i][meal] = snap.picked; }
  else if(pm[i]) delete pm[i][meal];
  restoreMealLinks(snap.links);
  const key = mealKey(weekIdx, i, meal);
  if(snap.plan) state.dishPlan[key] = snap.plan; else if(state.dishPlan) delete state.dishPlan[key];
  if(snap.freezer) state.freezerDishes[key] = snap.freezer; else if(state.freezerDishes) delete state.freezerDishes[key];
}
// Un piatto tolto o sostituito si porta via il suo prep/doppia dose e il
// segno "dal freezer".
function forgetDish(weekIdx, i, meal, name){
  const key = mealKey(weekIdx, i, meal);
  dropDishPlan(key, name);
  setFreezerDish(key, name, false);
}
function addMealDish(weekIdx, i, meal, name){
  const m = effectiveMeal(weekIdx, i, meal);
  if(!m.principale){ writeMealDishes(weekIdx, i, meal, name, []); return; }
  if(m.principale === name || m.contorni.includes(name)) return;
  setMealContorni(weekIdx, i, meal, m.contorni.concat(name));
}
// Sostituisce un solo piatto, lasciando gli altri come sono.
function replaceMealDish(weekIdx, i, meal, oldName, newName){
  const m = effectiveMeal(weekIdx, i, meal);
  if(oldName === newName) return;
  if(m.principale === oldName && linkedSourceMealKey(weekIdx, i, meal)) return; // l'avanzo segue la sua fonte
  forgetDish(weekIdx, i, meal, oldName);
  if(m.principale === oldName){
    writeMealDishes(weekIdx, i, meal, newName, m.contorni.filter(c => c !== newName));
    return;
  }
  if(m.principale === newName){ setMealContorni(weekIdx, i, meal, m.contorni.filter(c => c !== oldName)); return; }
  const next = m.contorni.map(c => c === oldName ? newName : c);
  setMealContorni(weekIdx, i, meal, next.filter((c, idx) => next.indexOf(c) === idx));
}
// Toglie un piatto. Se era il principale, il primo degli altri ne prende il
// posto; se era l'unico piatto, il pasto si svuota (come "Svuota il pasto").
function removeMealDish(weekIdx, i, meal, name){
  const key = mealKey(weekIdx, i, meal);
  const m = effectiveMeal(weekIdx, i, meal);
  if(m.principale === name){
    if(linkedSourceMealKey(weekIdx, i, meal)) return;
    if(!m.contorni.length){ performClearMeal(key); return; }
    const snap = snapshotMealDishes(weekIdx, i, meal);
    forgetDish(weekIdx, i, meal, name);
    writeMealDishes(weekIdx, i, meal, m.contorni[0], m.contorni.slice(1));
    persist(); render();
    showUndoToast('Piatto tolto', ()=>{ restoreMealDishes(weekIdx, i, meal, snap); persist(); render(); });
    return;
  }
  const snap = snapshotMealDishes(weekIdx, i, meal);
  forgetDish(weekIdx, i, meal, name);
  setMealContorni(weekIdx, i, meal, m.contorni.filter(c => c !== name));
  persist(); render();
  showUndoToast('Piatto tolto', ()=>{ restoreMealDishes(weekIdx, i, meal, snap); persist(); render(); });
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
  const prevLocked = state.mealLocked[key];
  const prevPointing = Object.keys(state.dayLinks).filter(k => state.dayLinks[k] === key).map(k => ({ k, note: state.dayLinkNotes[k] }));
  clearMealToEmpty(weekIdx, i, meal);
  state.mealOverflowOpen = null;
  persist(); render();
  showUndoToast('Pasto svuotato', ()=>{
    if(prevLocked) state.mealLocked[key] = prevLocked;
    prevPointing.forEach(({ k, note })=>{ state.dayLinks[k] = key; if(note !== undefined) state.dayLinkNotes[k] = note; });
    if(prevLink !== undefined) state.dayLinks[key] = prevLink;
    if(prevLinkNote !== undefined) state.dayLinkNotes[key] = prevLinkNote;
    if(prevPortions !== undefined) state.dayPortions[key] = prevPortions;
    if(prevOverrideSlot !== undefined){
      const om = weekOverridesRef(weekIdx);
      if(!om[i]) om[i] = emptyDaySlot();
      om[i][meal] = prevOverrideSlot;
    } else {
      // Prima non c'era override (la ricetta veniva dalla proposta): via il
      // "vuoto" messo da Svuota, così torna quella.
      const om = weekOverridesRef(weekIdx);
      if(om[i]) om[i][meal] = emptyMealSlot();
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
const WEEK_KEYED_FIELDS = ['mealLocked','dayLinks','dayLinkNotes','dayPortions','cooks','dishPlan','freezerDishes'];
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
    rememberWeekRecipes(isoLocalDate(new Date(y, m-1, d + 7 * k)));
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
// Varietà tra settimane: il generatore evita (con una penalità, non un
// divieto) le ricette delle altre settimane già in Menù e quelle mangiate
// nelle ultime RECENT_WEEKS settimane. Prima non aveva memoria e, a parità di
// equilibrio, sceglieva sempre le ricette con gli ingredienti già in casa:
// poche decine di piatti, sempre quelli. La penalità (3) pesa meno di un
// punto di equilibrio mancato (10): meglio ripetere che sbilanciare.
const RECENT_WEEKS = 3;
const RECENT_PENALTY = 3;
function rememberWeekRecipes(weekStartIso){
  const names = new Set();
  WEEK_DISPLAY_ORDER.forEach(i => ['pranzo','cena'].forEach(meal => { const n = effectiveMeal(0, i, meal).principale; if(n) names.add(n); }));
  const kept = (state.recipeHistory || []).filter(h => !names.has(h.nome));
  names.forEach(nome => kept.push({ nome, dal: weekStartIso }));
  // Oltre le settimane che contano non serve ricordarle.
  const [y, m, d] = weekStartIso.split('-').map(Number);
  const limit = isoLocalDate(new Date(y, m - 1, d - 7 * (RECENT_WEEKS + 1)));
  state.recipeHistory = kept.filter(h => h.dal >= limit);
}
function recentRecipeNames(weekIdx){
  const target = weekIdx || 0;
  const names = new Set();
  [0, ...state.extraWeeks.map((_, n) => n + 1)].filter(w => w !== target).forEach(w =>
    WEEK_DISPLAY_ORDER.forEach(i => ['pranzo','cena'].forEach(meal => { const n = effectiveMeal(w, i, meal).principale; if(n) names.add(n); })));
  const start = weekDatesFor(target)[0];
  const limit = isoLocalDate(new Date(start.getFullYear(), start.getMonth(), start.getDate() - 7 * RECENT_WEEKS));
  (state.recipeHistory || []).forEach(h => { if(h.dal >= limit) names.add(h.nome); });
  return names;
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
// Pasto già passato (solo settimana corrente): i giorni prima di oggi, e il
// pranzo di oggi dalle 15. Rigenerare la settimana non lo tocca, come un
// pasto bloccato: ormai è andato.
function isMealPast(weekIdx, i, meal){
  if(weekIdx !== 0) return false;
  const todayPos = findTodayPos();
  if(todayPos === null) return false;
  const pos = WEEK_DISPLAY_ORDER.indexOf(i);
  return pos < todayPos || (pos === todayPos && meal === 'pranzo' && isTodayLunchPast());
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
      const past = isMealPast(weekIdx, li, lm);
      if(state.mealLocked[lkey] || past){
        lockedMeals.push({ i: li, meal: lm, past, data: effectiveMeal(weekIdx, li, lm), link: linkedSourceMealKey(weekIdx, li, lm),
          portions: state.dayPortions[lkey], done: !!(state.mealsDone[li] && state.mealsDone[li][lm]) && weekIdx === 0 });
      }
    });
  }
  // I pasti bloccati restano com'erano, ma pesano sull'equilibrio della settimana.
  const fixed = {};
  lockedMeals.forEach(({i, meal, data, link})=>{
    const meta = !link && data.principale ? getRecipeMeta(data.principale) : null;
    if(meta && (meal === 'cena' || i >= 4)) fixed[`${i}_${meal}`] = meta;
  });
  const days = pickWeekRecipes(fixed, weekIdx);
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
    lockedMeals.forEach(({i, meal, past, data, link, portions, done})=>{
      const lkey = `${weekIdx}_${i}_${meal}`;
      // Pasto passato: resta tale e quale, anche vuoto, con porzioni,
      // avanzo e "cucinato".
      if(past){
        targetBaseline[i][meal] = { principale: data.principale || '', contorni: (data.contorni || []).slice() };
        if(link) state.dayLinks[lkey] = link; else delete state.dayLinks[lkey];
        if(portions !== undefined) state.dayPortions[lkey] = portions;
        if(done){ if(!state.mealsDone[i]) state.mealsDone[i] = {}; state.mealsDone[i][meal] = true; }
        return;
      }
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
  const used = (days.expiringUsed || []).slice();
  used.pantryShort = days.pantryShort || 0;
  return used;
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
const TOPBAR_TITLE = { menu:'Menù', spesa:'Spesa', prep:'Ricette', dispensa:'Dispensa' };
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
// Solo le novità dell'ultimo aggiornamento (richiesta di Mara): a ogni
// aggiornamento si sostituiscono le voci, non si aggiungono in cima.
const WHATS_NEW = {
  version: '2026-12-06',
  title: 'Novità',
  items: [
    'Impostazioni riordinate: Io, Aspetto, Il mio menù, Ingredienti e Dispensa (ingredienti, gruppi, categorie, ordine corsie), Carte fedeltà, Backup, App. In alto c\'è una ricerca.',
    'Backup automatico: una volta al mese l\'app salva da sola una copia su questo telefono (le ultime 3), da ripristinare da Impostazioni. Si può spegnere.',
    'I tre puntini sono più leggeri: Dispensa (Inventario veloce), Ricette (Importa), Menù (Rigenera la settimana). Il resto è in Impostazioni.'
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
// Carta fedeltà o modalità cucina aperte: lo schermo resta acceso (Screen Wake
// Lock) finché sono a video. La luminosità invece un'app web non può alzarla.
let cardWakeLock = null;
function syncCardWakeLock(){
  const want = !!(state.cardViewId || state.cookMode) && document.visibilityState === 'visible';
  if(want && !cardWakeLock && navigator.wakeLock){
    cardWakeLock = 'pending';
    navigator.wakeLock.request('screen').then(lock=>{
      if(!(state.cardViewId || state.cookMode)){ lock.release().catch(()=>{}); cardWakeLock = null; return; }
      cardWakeLock = lock;
      lock.addEventListener('release', ()=>{ if(cardWakeLock === lock) cardWakeLock = null; });
    }).catch(()=>{ cardWakeLock = null; });
  } else if(!want && cardWakeLock && cardWakeLock !== 'pending'){
    cardWakeLock.release().catch(()=>{});
    cardWakeLock = null;
  }
}
// Il blocco cade da solo quando l'app va in background: al ritorno si riprende.
document.addEventListener('visibilitychange', syncCardWakeLock);
// "Modifica ricetta" legge i campi dal DOM al momento di Salva: se un render
// (foto caricata, avviso, sincronizzazione…) rifacesse la pagina da zero si
// perderebbe quanto scritto. Si salva quindi il modulo, con i valori messi
// negli attributi, e lo si rimette dopo il render (la foto si rinfresca).
function captureRecipeEditForm(){
  const form = document.getElementById('edit-recipe-form');
  if(!form || !state.recipeEditName) return null;
  form.querySelectorAll('input').forEach(i=>{ if(i.type === 'file') return; i.setAttribute('value', i.value); });
  form.querySelectorAll('textarea').forEach(t=>{ t.textContent = t.value; });
  form.querySelectorAll('select option').forEach(o=>{ if(o.selected) o.setAttribute('selected', ''); else o.removeAttribute('selected'); });
  return { name: state.recipeEditName, html: form.innerHTML };
}
function restoreRecipeEditForm(snap){
  if(!snap || state.recipeEditName !== snap.name) return;
  const form = document.getElementById('edit-recipe-form');
  if(!form) return;
  const fresh = (form.querySelector('#edit-photo-area') || {}).innerHTML;
  form.innerHTML = snap.html;
  // L'istantanea contiene i campi ingrediente già "avvolti" dall'autocompletamento
  // (senza i suoi ascoltatori): si toglie l'involucro, lo ricrea attachHandlers.
  form.querySelectorAll('.add-ing-combo').forEach(w=>{
    const inp = w.querySelector('input');
    if(inp){ delete inp.dataset.comboAttached; w.parentNode.insertBefore(inp, w); }
    w.remove();
  });
  const area = form.querySelector('#edit-photo-area');
  if(area && fresh !== undefined) area.innerHTML = fresh;
}
function render(){
  applyCustomDepts();
  if(personalSynced || !window.cookpopSync) rolloverWeeksIfNeeded();
  document.querySelectorAll('nav.tabs button').forEach(b=>{ b.classList.toggle('active', b.dataset.tab === state.tab); });
  const topbarTitle = document.getElementById('topbar-title');
  if(topbarTitle) topbarTitle.textContent = TOPBAR_TITLE[state.tab] || 'CookPOP';
  const topbarCards = document.getElementById('topbar-cards-btn');
  if(topbarCards) topbarCards.hidden = state.tab !== 'spesa';
  const panel = document.getElementById('panel');
  const focus = captureFocus(panel);
  const scrolls = captureInnerScroll(panel);
  const editSnap = captureRecipeEditForm();
  dialogOpenerBeforeRender = describeElement(document.activeElement);
  let html = '';
  if(state.tab === 'menu') html = renderMenu();
  if(state.tab === 'spesa') html = renderSpesa();
  if(state.tab === 'prep') html = renderPrep();
  if(state.tab === 'dispensa') html = renderDispensa();
  // Una sola scrittura: con "innerHTML +=" il browser riserializzava e
  // riparsava l'intero pannello per ogni pezzo aggiunto (3 volte a render).
  panel.innerHTML = html + renderAislesPage() + renderRecipeImportPage() + renderCookbookModals() + renderCardsPages() + renderCookModePage() + renderUndoToast() + renderWhatsNewModal();
  restoreRecipeEditForm(editSnap);
  endPageRender();
  attachHandlers();
  syncCardWakeLock();
  restoreInnerScroll(panel, scrolls);
  restoreFocus(panel, focus);
  reconcileModalHistory();
}
// Le pagine e finestre che scorrono per conto loro (scheda ingrediente,
// schermate a tutto schermo, finestre lunghe) vengono ricreate a ogni render:
// senza questo, aprire un elenco o una sezione al loro interno le riportava
// in cima, come se si fosse cambiato pagina.
const INNER_SCROLL_SELECTOR = '.sheet-page, .meal-detail-screen, .filters-modal-backdrop';
function innerScrollKey(el){
  // data-dialog-inert va e viene con le finestre sopra (vedi reconcileModalHistory):
  // non deve cambiare la chiave, se no chiudendo una finestra la pagina sotto
  // tornava in cima.
  const attrs = [...el.attributes].filter(a => a.name.startsWith('data-') && a.name !== 'data-dialog-inert').map(a => a.name + '=' + a.value).join(',');
  return el.className.split(' ')[0] + '|' + attrs;
}
function captureInnerScroll(panel){
  const out = {};
  panel.querySelectorAll(INNER_SCROLL_SELECTOR).forEach(el=>{ if(el.scrollTop) out[innerScrollKey(el)] = el.scrollTop; });
  return out;
}
function restoreInnerScroll(panel, scrolls){
  panel.querySelectorAll(INNER_SCROLL_SELECTOR).forEach(el=>{
    const top = scrolls[innerScrollKey(el)];
    if(top) el.scrollTop = top;
  });
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
  [()=> !!state.cookMode, ()=>{ state.cookMode = null; }],
  [()=> !!state.cookbookNameDraft, ()=>{ state.cookbookNameDraft = null; }],
  [()=> !!state.recipeImport, ()=>{ state.recipeImport = null; }],
  [()=> !!state.albumForRecipe, ()=>{ state.albumForRecipe = null; }],
  [()=> expiryConfirmKeys().length > 0, ()=>{ closeExpiryConfirm(); }],
  [()=> !!state.recipeEditName, ()=>{ state.recipeEditName = null; }],
  [()=> !!state.doneModalLeftoverPickerOpen, ()=>{ state.doneModalLeftoverPickerOpen = false; }],
  [()=> !!state.doneModalLeftoverCatPickerOpen, ()=>{ state.doneModalLeftoverCatPickerOpen = false; }],
  [()=> state.doneModalDay !== null, ()=>{ state.doneModalDay = null; state.doneModalQty = {}; state.doneQtyEditingKey = null; state.doneModalFinished = {}; state.doneModalLeftover = ''; state.doneModalLeftoverLuogo = 'frigo'; state.doneModalLeftoverCat = 'avanzi'; state.doneModalLeftoverChecked = false; state.doneModalLeftoverPickerOpen = false; state.doneModalLeftoverCatPickerOpen = false; }],
  [()=> !!state.mealOverflowOpen, ()=>{ state.mealOverflowOpen = null; }],
  [()=> state.genSettingsOpen !== null, ()=>{ state.genSettingsOpen = null; }],
  [()=> !!state.pantryGroupsModalOpen && !!state.groupEditId, ()=>{ closeGroupEdit(); }],
  [()=> !!state.pantryGroupsModalOpen, ()=>{ state.pantryGroupsModalOpen = false; closeGroupEdit(); }],
  [()=> !!state.deptsModalOpen && !!state.deptEditId, ()=>{ closeDeptEdit(); }],
  [()=> !!state.deptsModalOpen, ()=>{ state.deptsModalOpen = false; closeDeptEdit(); }],
  [()=> !!state.pantryLuogoPicker, ()=>{ state.pantryLuogoPicker = null; }],
  [()=> !!state.pantryFinishPicker, ()=>{ state.pantryFinishPicker = null; }],
  [()=> !!state.mergeIngredientFrom, ()=>{ closeMergeIngredient(); }],
  [()=> !!state.pantrySheetPicker && !!(state.pantryEditKey || state.pantryAddModalOpen), ()=>{ state.pantrySheetPicker = null; }],
  [()=> !!state.pantryEditKey, ()=>{ closeIngredientSheet(); }],
  [()=> !!state.pantryAddModalOpen, ()=>{ closeIngredientSheet(); }],
  // Sotto la scheda ingrediente (che si apre da qui): si chiude dopo di lei.
  [()=> !!state.cardsImport, ()=>{ state.cardsImport = null; }],
  [()=> !!state.cardViewId, ()=>{ state.cardViewId = null; }],
  [()=> !!state.aisleOrderOpen, ()=>{ state.aisleOrderOpen = false; }],
  [()=> state.cardsOpen === 'form', ()=>{ closeCardForm(); }],
  [()=> !!state.cardsOpen, ()=>{ state.cardsOpen = null; state.cardsListUnder = false; state.cardDraft = null; }],
  [()=> !!state.inventoryOpen, ()=>{ state.inventoryOpen = false; }],
  [()=> !!state.ingredientManagerOpen, ()=>{ state.ingredientManagerOpen = false; }],
  [()=> !!state.addIngModalOpen, ()=>{ state.addIngModalOpen = false; state.addIngDraft = null; }],
  [()=> !!state.newRecipeModalOpen, ()=>{ state.newRecipeModalOpen = false; }],
  [()=> !!state.filtersOpen, ()=>{ state.filtersOpen = false; }],
  [()=> !!state.swapOpenDay, ()=>{ state.swapOpenDay = null; }],
  [()=> !!state.linkPickerOpenDay, ()=>{ state.linkPickerOpenDay = null; }],
  [()=> !!state.avanzoDiPickerOpenDay, ()=>{ state.avanzoDiPickerOpenDay = null; }],
  [()=> !!state.dishPicker, ()=>{ state.dishPicker = null; }],
  [()=> !!state.expandedRecipe && !!state.recipeMenuOpen, ()=>{ state.recipeMenuOpen = false; }],
  [()=> !!state.expandedRecipe, ()=>{ state.expandedRecipe = null; }],
  [()=> !!state.cookbookMenuOpen, ()=>{ state.cookbookMenuOpen = false; }],
  [()=> !!state.cookbookUseOpen, ()=>{ state.cookbookUseOpen = false; }],
  [()=> !!state.cookbookPickOpen, ()=>{ state.cookbookPickOpen = false; state.cookbookPickSearch = ''; }],
  [()=> !!state.cookbookOpenId, ()=>{ state.cookbookOpenId = null; }],
  [()=> !!state.expandedDay && !!state.mealDetailMenuOpen, ()=>{ state.mealDetailMenuOpen = false; }],
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
const DIALOG_LAYER_SELECTOR = '.filters-modal-backdrop, .meal-detail-screen, .sheet-page, .card-view, #settings-backdrop.open, #topbar-menu-backdrop.open';
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
  // Il menù ⋯ dentro una pagina (porzioni, album) non è una finestra a sé: se
  // lo fosse, la pagina e il suo sfondo diventerebbero inerti e il menù non
  // si potrebbe più chiudere. Solo il menù della topbar ha il suo strato.
  if(layer.id === 'topbar-menu-backdrop') return layer.querySelector('.topbar-menu') || layer;
  return layer.querySelector('.filters-modal, .settings-page') || layer;
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

// Pagina "Modifica ricetta" (non più una modale), condivisa da Menù e Prep (stessa pagina,
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

  const formHtml = `
        <div class="filter-groups" id="edit-recipe-form">
          <div class="filter-group">
            <div class="filter-group-label">Foto del piatto</div>
            <div id="edit-photo-area">${recipePhotoHtml(name, true)}</div>
          </div>
          <div class="filter-group">
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M128 20a108 108 0 1 0 108 108A108.12 108.12 0 0 0 128 20m0 192a84 84 0 1 1 84-84a84.09 84.09 0 0 1-84 84m68-84a12 12 0 0 1-12 12h-56a12 12 0 0 1-12-12V72a12 12 0 0 1 24 0v44h44a12 12 0 0 1 12 12"></path></svg> Tempo (etichetta mostrata)</div>
            <input type="text" id="edit-tempo" value="${escapeAttr(rec.tempo || '')}">
          </div>
          <div class="filter-group">
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M128 20a108 108 0 1 0 108 108A108.12 108.12 0 0 0 128 20m0 192a84 84 0 1 1 84-84a84.09 84.09 0 0 1-84 84m68-84a12 12 0 0 1-12 12h-56a12 12 0 0 1-12-12V72a12 12 0 0 1 24 0v44h44a12 12 0 0 1 12 12"></path></svg> Fascia di tempo (usata per filtrare in Ricette)</div>
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
            <div class="filter-group-label">❤️ Gradimento</div>
            <select id="edit-gradimento">
              ${GRAD_ORDER.includes(rec.gradimento) ? '' : '<option value="" selected>—</option>'}
              ${GRAD_ORDER.map(g=>`<option value="${g}" ${rec.gradimento===g?'selected':''}>${escapeHtml(GRAD_LABEL[g])}</option>`).join('')}
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
        </div>`;
  const footer = `
    <div class="edit-footer">
      <button type="button" class="btn is-outline is-danger" id="edit-recipe-delete" data-delete-recipe="${escapeAttr(name)}">Elimina</button>
      <button type="button" class="btn is-solid" id="edit-recipe-save" data-save-recipe-edit="${escapeAttr(name)}">Salva</button>
    </div>`;
  return managePageHtml({ key: 'recipe-edit-' + name, title: 'Modifica ricetta', closeAttr: 'data-close-recipe-edit', body: `<p class="section-sub edit-recipe-name">${escapeHtml(name)}</p>${formHtml}`, footer, extraClass: 'recipe-edit-page' });
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

  // Linea del pasto: tutti i piatti allo stesso livello, nell'ordine in cui
  // si mangiano (vedi mealDishes), ognuno con la sua portata, il suo "Cambia"
  // e la sua ✕. In un avanzo il piatto ereditato non si tocca da qui: si
  // scollega con la ✕ del badge "Avanzo di". Le schermate di scelta sono a
  // tutto schermo (render*Screen() più sotto, invocate da renderMenu()).
  const dishes = name ? mealDishes(weekIdx, i, meal) : [];
  const prepChosen = name ? new Set(prepCandidates(weekIdx).filter(c => c.chosen && c.mk === mk).map(c => c.name)) : new Set();
  const dishTag = n => {
    if(isFreezerDish(mk, n)) return ' · ❄️ dal freezer';
    const plan = getDishPlan(mk, n);
    const bits = [];
    if(prepChosen.has(n)) bits.push(plan.done ? '🔪 pronto' : '🔪 prep');
    if(plan.double) bits.push('×2');
    return bits.length ? ' · ' + bits.join(' ') : '';
  };
  const dishesHtml = name ? `
    <div class="dish-line">
      ${dishes.map(dsh=>{
        const fixed = !!linkSource && dsh.role === 'p';
        return `
      <div class="dish-item">
        <span class="dish-ic" aria-hidden="true">${tipoIcon(dsh.tipo)}</span>
        <div class="dish-text">
          <div class="dish-course">${escapeHtml(courseLabel(dsh.tipo))}<span class="dish-tag">${escapeHtml(dishTag(dsh.name))}</span></div>
          <span class="day-menu" data-toggle-day="${mk}">${escapeHtml(dsh.name)}</span>
        </div>
        ${fixed ? '' : `<div class="dish-actions">
          <button type="button" class="btn is-icon dish-act" data-open-dish-picker="${mk}" data-dish-replace="${escapeAttr(dsh.name)}" aria-label="Cambia ${escapeAttr(dsh.name)}">${ICON_SWAP}</button>
          <button type="button" class="btn is-icon dish-act" data-dish-remove="${mk}" data-dish-name="${escapeAttr(dsh.name)}" aria-label="Togli ${escapeAttr(dsh.name)}">✕</button>
        </div>`}
      </div>`;
      }).join('')}
      <button type="button" class="btn dish-add" data-open-dish-picker="${mk}" aria-label="Aggiungi un piatto" title="Aggiungi un piatto"><span class="dish-add-ic" aria-hidden="true">+</span></button>
    </div>` : '';

  // Un pasto vuoto non è mai "cucinato", anche se è rimasta la spunta di una
  // ricetta che prima c'era (prima la nascondeva per caso il CSS della riga
  // del tempo, che a pasto vuoto spariva insieme alla spunta).
  const isDone = !!name && !!(weekMealsDoneRef(weekIdx)[i] && weekMealsDoneRef(weekIdx)[i][meal]);
  // Chi cucina: in basso a sinistra nella card, accanto a "Da cucinare".
  // Un'unica fonte: iniziale sola a blocco chiuso, nome per esteso ad aperto.
  const cookPillHtml = ()=>{
    const cook = state.cooks[mk];
    const cookLabel = cook ? (state.expandedDay === mk ? 'Cucina ' + COOK_LABEL[cook] : COOK_LABEL[cook][0]) : '?';
    return `<button type="button" class="cook-pill${cook ? ' cook-'+cook : ' cook-empty'}" data-toggle-cook="${mk}" aria-label="Chi cucina: tocca per cambiare">${escapeHtml(cookLabel)}</button>`;
  };
  // Un pasto bloccato non viene toccato da "Rigenera settimana" (vedi
  // generateWeek). Solo sui pasti normali: un pranzo-avanzo segue sempre il
  // principale del collegamento, bloccarlo non avrebbe un effetto chiaro.
  const isLocked = !!name && !!state.mealLocked[mk];
  let swapControls;
  if(linkSource){
    swapControls = `
    <div class="section-footer">
      <div class="section-footer-row avanzo-note-row">
        ${state.linkNoteEditingKey === mk
          ? `<input type="text" class="avanzo-note-input" placeholder="Variante (facoltativa, es. fatta a frittata)" value="${escapeAttr(state.dayLinkNotes[mk] || '')}" data-link-note="${mk}">`
          : (state.dayLinkNotes[mk] ? `<span class="avanzo-note-text" data-link-note-show="${mk}">${escapeHtml(state.dayLinkNotes[mk])}</span>` : '')}
      </div>
      <div class="section-footer-row meal-foot">
      ${cookPillHtml()}
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
      <div class="section-footer-row meal-foot">
        ${cookPillHtml()}
        <button class="btn is-chip is-eat ${isDone ? 'active' : ''}" data-toggle-done="${mk}">${isDone ? '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--fe" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="m6 10l-2 2l6 6L20 8l-2-2l-8 8z"></path></svg> Cucinata' : '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--bx" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M12 10h-2V3H8v7H6V3H4v8c0 1.654 1.346 3 3 3h1v7h2v-7h1c1.654 0 3-1.346 3-3V3h-2zm7-7h-1c-1.159 0-2 1.262-2 3v8h2v7h2V4a1 1 0 0 0-1-1"></path></svg> Da cucinare'}</button>
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
      if(rec.prep && !/^(no\b|variabile|dipende)/i.test(rec.prep)) metaLines.push(`<b>Preparazione anticipata:</b> ${escapeHtml(rec.prep)}`);
      if(rec.freezer === 'Sì') metaLines.push(`<b>Nota:</b> congela bene — valuta doppia dose per il freezer`);
    } else if(name) {
      metaLines.push(`<b>Nota:</b> ricetta non presente nel catalogo, dettagli non disponibili`);
    }
  } else {
    if(d.ricordare && d.ricordare !== 'Niente') metaLines.push(`<b>Da ricordare:</b> ${escapeHtml(d.ricordare)}`);
    if(d.nota) metaLines.push(`<b>Nota:</b> ${escapeHtml(d.nota)}`);
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
    ${linkSource ? `<button type="button" class="status-badge status-avanzo" data-unlink-day="${mk}">Avanzo di ${escapeHtml(sourceGiorno)} <span class="status-badge-reset">✕</span></button>${!state.dayLinkNotes[mk] && state.linkNoteEditingKey !== mk ? `<button type="button" class="avanzo-note-pencil" data-link-note-show="${mk}" aria-label="Aggiungi una variante (es. fatta a frittata)">${PENCIL_ICON_SVG}</button>` : ''}` : ''}
    ${isLocked ? `<span class="status-badge status-locked">Bloccat${meal==='cena'?'a':'o'}</span>` : ''}
  `;

  const isOpen = state.expandedDay === mk;
  // Un'unica fonte per "chi cucina": iniziale sola a blocco chiuso, nome per
  // esteso a blocco aperto.

  const mealBlockHtml = `
  <div class="meal-block${isDone ? ' done' : ''}${isOpen ? ' open' : ''}${name ? '' : ' is-empty'}" data-week-idx="${weekIdx}" data-day-index="${i}" data-meal="${meal}">
    <div class="day-meal">
      <div class="meal-block-label">${escapeHtml(MEAL_LABEL[meal])}${timeDisplay ? `<span class="meal-block-time"> · ${escapeHtml(timeDisplay)}</span>` : ''}</div>
      ${name && !linkSource ? `<button type="button" class="btn is-icon meal-overflow-btn" data-open-meal-overflow="${mk}" aria-label="Altre azioni"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="1em" height="1em" viewBox="0 0 24 24"><circle cx="5" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="19" cy="12" r="2" fill="currentColor"/></svg></button>` : ''}
      <div class="day-row-side display-none">
        ${currentCat ? `<span class="cat-icon" title="${escapeAttr(CAT_LABEL[currentCat])}">${catIcon(currentCat)}</span>` : ''}
      </div>
    </div>
    ${name ? dishesHtml : `
    <button type="button" class="day-menu-row day-menu-empty" data-open-swap="${mk}">+</button>`}
    ${(doneTag || statusBadges.trim()) ? `<div class="recipe-info">
      ${doneTag}
      ${statusBadges}
    </div>` : ''}
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
      if(rec.prep && !/^(no\b|variabile|dipende)/i.test(rec.prep)) metaLines.push(`<b>Preparazione anticipata:</b> ${escapeHtml(rec.prep)}`);
    } else if(name) {
      metaLines.push(`<b>Nota:</b> ricetta non presente nel catalogo, dettagli non disponibili`);
    }
  } else {
    if(d.ricordare && d.ricordare !== 'Niente') metaLines.push(`<b>Da ricordare:</b> ${escapeHtml(d.ricordare)}`);
    if(d.nota) metaLines.push(`<b>Nota:</b> ${escapeHtml(d.nota)}`);
  }

  // Porzioni: valgono per tutto il pasto. La base è quella del principale
  // (o del primo piatto che ne ha una), e ogni piatto scala le sue quantità
  // rispetto alle proprie porzioni base.
  const dishes = mealDishes(weekIdx, i, meal);
  const baseOf = n => { const dt = getRecipeDetails(n); return dt ? parsePortionsBase(dt.porzioni) : null; };
  const basePortions = name ? (baseOf(name) || dishes.map(x => baseOf(x.name)).find(Boolean) || null) : null;
  const currentPortions = basePortions ? (state.dayPortions[mk] || basePortions) : null;
  // Una tab per piatto (Primo, Secondo, Contorno…): si vede solo quello attivo.
  const missing = [];
  const dishInfos = dishes.map(dsh=>{
    const dBase = baseOf(dsh.name);
    const ratio = (dBase && currentPortions) ? currentPortions / dBase : 1;
    const ctx = { weekIdx, i, meal, role: dsh.role, persone: currentPortions || 0, canPortions: !!basePortions };
    missing.push(...missingIngredients(getIngredientsFor(dsh.name), ratio, ctx));
    return { dsh, ratio, ctx };
  });
  const mancantiHtml = mancantiButtonHtml(missing);
  dishInfos.forEach(x => { x.ctx.mancantiHtml = mancantiHtml; });
  const activeName = state.dishTab[mk];
  const activeIdx = Math.max(0, dishInfos.findIndex(x => x.dsh.name === activeName));
  const seenCourse = {};
  // A destra, fisso, il cerchio tratteggiato "+" come nella card del pasto.
  const addDishBtn = `<button type="button" class="btn dish-add dish-tabs-add" data-open-dish-picker="${mk}" aria-label="Aggiungi un piatto" title="Aggiungi un piatto"><span class="dish-add-ic" aria-hidden="true">+</span></button>`;
  const tabsHtml = `
    <div class="dish-tabs-row">
    <div class="dish-tabs" role="tablist">
      ${dishInfos.map(({ dsh }, idx)=>{
        const label = courseLabel(dsh.tipo);
        seenCourse[label] = (seenCourse[label] || 0) + 1;
        const text = seenCourse[label] > 1 ? `${label} ${seenCourse[label]}` : label;
        return `<button type="button" class="dish-tab${idx === activeIdx ? ' active' : ''}" role="tab" aria-selected="${idx === activeIdx}" data-dish-tab="${mk}" data-dish-tab-name="${escapeAttr(dsh.name)}"><span class="dish-ic" aria-hidden="true">${tipoIcon(dsh.tipo)}</span><span class="dish-tab-label">${escapeHtml(text)}</span></button>`;
      }).join('')}
    </div>
    ${addDishBtn}
    </div>`;
  const act = dishInfos[activeIdx];
  const fixedDish = !!linkSource && !!act && act.dsh.role === 'p';
  const dishesHtml = act ? renderDishAccordion(act.dsh, act.ratio, act.ctx, true, fixedDish, true) : '';
  const dayMetaHtml = metaLines.length ? `<div class="day-meta">${metaLines.map(l=>`<div>${l}</div>`).join('')}</div>` : '';
  const mealTop = dayMetaHtml ? `<div class="meal-detail-top">${dayMetaHtml}</div>` : '';
  // Impostazioni ⋯ (in alto a destra): le azioni sul piatto attivo, sempre
  // nello stesso ordine — cambia, modifica la ricetta, togli. Le porzioni sono
  // nella tab Ingredienti, il "+" per aggiungere un piatto accanto alle tab.
  const actName = act ? act.dsh.name : '';
  const menuItems = !act ? [] : [
    fixedDish ? null : { label: `${ICON_SWAP} Cambia piatto`, attrs: `data-open-dish-picker="${mk}" data-dish-replace="${escapeAttr(actName)}"` },
    getRecipeMeta(actName) ? { label: `✏️ Modifica ricetta`, attrs: `data-open-recipe-edit="${escapeAttr(actName)}"` } : null,
    fixedDish ? null : { label: `✕ Togli dal pasto`, attrs: `data-dish-remove="${mk}" data-dish-name="${escapeAttr(actName)}"`, danger: true }
  ].filter(Boolean);
  const menuAction = menuItems.length ? `<button type="button" class="btn is-icon meal-menu-btn" data-meal-menu aria-label="Impostazioni del piatto" aria-expanded="${!!state.mealDetailMenuOpen}">${DOTS_ICON_SVG}</button>` : '';
  const menuHtml = menuItems.length && state.mealDetailMenuOpen ? `
      <div class="meal-menu-backdrop" data-meal-menu-close></div>
      <div class="topbar-menu meal-menu" role="menu">
        ${menuItems.map(it => `<button type="button" class="topbar-menu-item${it.danger ? ' color-delete' : ''}" role="menuitem" ${it.attrs}>${it.label}</button>`).join('')}
      </div>` : '';
  const cookFab = act ? cookFabHtml(act.dsh.name, act.ratio) : '';

  // Pagina a tutto schermo con freccia Indietro, come la scheda ingrediente
  // della Dispensa (prima era una modale).
  return managePageHtml({ key: 'meal-' + mk, title: `${escapeHtml(MEAL_LABEL[meal])} <span class="meal-page-date">${escapeHtml(d.giorno)} ${escapeHtml(dateLabel)}</span>`, closeAttr: 'data-close-meal-detail', action: menuAction, body: `
    <div class="meal-detail-body${cookFab ? ' has-cook-fab' : ''}">
      ${name ? `
      ${mealTop}
      ${tabsHtml}
      <div class="dish-acc-list">${dishesHtml}</div>` : `
      <div class="ing-empty">Nessuna ricetta scelta per questo pasto.</div>
      <button type="button" class="btn is-outline dish-add-wide" data-open-swap="${mk}">Scegli una ricetta</button>`}
      ${menuHtml}
      ${cookFab}
    </div>` });
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
  // "Con quello che ho": piatti da pasto per cui hai tutto in casa, poi
  // quelli a cui manca poco (almeno metà degli ingredienti), dal meno al più.
  const swapMatches = {};
  if(f.cat === 'pantry'){
    const expiring = pantryExpiringMap();
    results = results.filter(isMainDish);
    results.forEach(r=>{ swapMatches[r.nome] = recipePantryMatch(r.nome, expiring); });
    results = results.filter(r => swapMatches[r.nome].total && (!swapMatches[r.nome].missing.length || swapMatches[r.nome].cov >= 0.5));
    results.sort((a, b) => (swapMatches[a.nome].missing.length - swapMatches[b.nome].missing.length) || (swapMatches[b.nome].exp.length - swapMatches[a.nome].exp.length) || IT_COLLATOR_BASE.compare(a.nome, b.nome));
  }
  const swapMissingHtml = m => !m ? '' : `<span class="swap-result-missing">${m.missing.length ? `manca ${m.missing.slice(0, 2).map(escapeHtml).join(', ')}${m.missing.length > 2 ? ` e altri ${m.missing.length - 2}` : ''}` : 'hai tutto'}</span>`;
  const resultsHtml = results.slice(0, 60).map(r=>`
    <div class="swap-result" data-swap-pick="${escapeAttr(r.nome)}" data-swap-day="${mk}">
      <span class="swap-result-icon">${catIcon(r.categoriaNew)}</span>
      <span class="swap-result-name">${escapeHtml(r.nome)}${swapMissingHtml(swapMatches[r.nome])}</span>
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
            <button class="btn is-chip ${f.cat==='pantry'?'active':''}" data-swap-cat="pantry" data-swap-day="${mk}">🧺 Con quello che ho</button>
          </div>
          <div class="swap-results">
            ${resultsHtml || `<div class="ing-empty">${f.cat === 'pantry' ? 'Con quello che hai in Dispensa non trovo ricette: prova "Tutte le categorie".' : 'Nessuna ricetta trovata.'}</div>`}
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
// "+ piatto" e "Cambia" del singolo piatto: prima si sceglie la portata
// (chip), poi si vedono solo quelle ricette; la ricerca resta dentro la
// portata scelta, o su tutto con "Tutte". Un pasto "avanzo" può comunque
// avere piatti tutti suoi (vedi setMealContorni/effectiveMeal).
function defaultDishCourse(dishes){
  const have = new Set(dishes.map(x => x.tipo));
  if(have.has('primo') || have.has('secondo')) return have.has('contorno') ? (have.has('antipasto') ? 'dolce' : 'antipasto') : 'contorno';
  return have.has('contorno') ? 'secondo' : 'contorno';
}
function renderDishPickerScreen(){
  const dp = state.dishPicker;
  const { weekIdx, i, meal } = parseMealKey(dp.key);
  if(meal !== 'pranzo' && meal !== 'cena') return '';
  const mk = dp.key;
  const d = DATA.week1[i];
  const dateLabel = formatShortDate(weekDatesFor(weekIdx)[WEEK_DISPLAY_ORDER.indexOf(parseInt(i,10))]);
  const dishes = mealDishes(weekIdx, i, meal);
  const inMeal = new Set(dishes.map(x => x.name));
  if(!dp.tipo) dp.tipo = dp.replace ? (dishCourse(dp.replace) || 'all') : defaultDishCourse(dishes);
  const search = dp.search || '';
  const frozen = freezerMeals();
  if(dp.tipo === 'freezer' && !frozen.length) dp.tipo = 'all';
  const frozenNames = new Set(frozen.map(it => it.nome));
  let results = allRecipeMetas().filter(r => !inMeal.has(r.nome));
  if(dp.tipo === 'freezer') results = results.filter(r => frozenNames.has(r.nome));
  else if(dp.tipo !== 'all') results = results.filter(r => r.tipologia === dp.tipo);
  if(search) results = results.filter(r => r.nome.toLowerCase().includes(search.toLowerCase()));
  const resultsHtml = results.slice(0, 60).map(r=>`
    <div class="swap-result" data-dish-pick="${escapeAttr(r.nome)}" data-dish-key="${mk}">
      <span class="swap-result-icon">${catIcon(r.categoriaNew)}</span>
      <span class="swap-result-name">${escapeHtml(r.nome)}</span>
      <span class="swap-result-time">${dp.tipo === 'freezer' ? `❄️ ${freezerPortionsOf(r.nome)} porz.` : escapeHtml(TEMPO_LABEL[r.tempoBucket])}</span>
    </div>`).join('');
  const chips = (frozen.length ? `<button type="button" class="btn is-chip ${dp.tipo==='freezer'?'active':''}" data-dish-course="freezer">❄️ Dal freezer</button>` : '') + COURSE_ORDER.map(t => `<button type="button" class="btn is-chip ${dp.tipo===t?'active':''}" data-dish-course="${t}">${tipoIcon(t)} ${escapeHtml(courseLabel(t))}</button>`).join('')
    + `<button type="button" class="btn is-chip ${dp.tipo==='all'?'active':''}" data-dish-course="all">Tutte</button>`;
  return `
  <div class="meal-detail-screen">
    <div class="filters-modal">
      <div class="meal-detail-header">
        <div class="meal-detail-header-text">
          <div class="meal-detail-kicker">${escapeHtml(MEAL_LABEL[meal])} · ${escapeHtml(d.giorno)} ${escapeHtml(dateLabel)}</div>
          <div class="meal-detail-title">${dp.replace ? `Cambia «${escapeHtml(dp.replace)}»` : 'Aggiungi piatto'}</div>
        </div>
        <button type="button" class="btn is-icon meal-detail-close" data-close-dish-picker aria-label="Chiudi">✕</button>
      </div>
      <div class="meal-detail-body">
        <div class="swap-panel">
          <div class="filter-group-label">Portata</div>
          <div class="swap-cat-chips dish-course-chips">${chips}</div>
          <input type="search" class="swap-search" placeholder="Cerca una ricetta…" data-dish-search="${mk}" value="${escapeAttr(search)}">
          <div class="swap-results">
            ${resultsHtml || '<div class="ing-empty">Nessuna ricetta trovata.</div>'}
            ${results.length > 60 ? `<div class="ing-empty">Altri ${results.length-60} risultati — affina la ricerca.</div>` : ''}
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

// Card di un giorno intero: intestazione (nome/data) + i due blocchi pasto,
// pranzo e cena. isPastCard non è più usato per lo stile del singolo pasto
// (era .day-card-past) ma resta sulla card per coerenza col resto del Menù.
// --- Meal prep e freezer ------------------------------------------------------
// Il giorno di prep (sabato o domenica, settimana per settimana) ha in cima
// alla sua card la lista di cosa preparare per i giorni dopo: i piatti
// "🍱 Meal prep" ci finiscono da soli, gli altri che si possono fare prima
// (congelabili, basi, preparazioni anticipate) sono proposti con un "+".
// Ogni piatto ha poi la sua "doppia dose": Spesa ne compra il doppio e,
// quando è pronto (spuntato nel prep o pasto segnato cucinato), metà finisce
// in Dispensa nel freezer come porzioni di quella ricetta. Da lì si
// rimette in un pasto con "+ piatto" → "Dal freezer": niente ingredienti in
// Spesa, la sera prima il promemoria di scongelarlo, e a pasto cucinato le
// porzioni scendono.
// state.dishPlan[mealKey] = [{ name, prep, double, done, frozen }]: un array
// (non un oggetto per nome) perché i nomi delle ricette possono contenere
// caratteri non ammessi nelle chiavi di Firebase ("/", ".").
// state.freezerDishes[mealKey] = [nomi dei piatti presi dal freezer].
const PREP_DAYS = { sab: 5, dom: 6 };
function weekStartIso(weekIdx){ return isoLocalDate(weekDatesFor(weekIdx)[0]); }
function prepDayOf(weekIdx){ return (state.prepDay && state.prepDay[weekStartIso(weekIdx)]) || 'sab'; }
function dishPlanList(mk){ return (state.dishPlan && state.dishPlan[mk]) || []; }
function getDishPlan(mk, name){ return dishPlanList(mk).find(p => p.name === name) || {}; }
function setDishPlan(mk, name, patch){
  if(!state.dishPlan) state.dishPlan = {};
  const list = dishPlanList(mk).slice();
  const idx = list.findIndex(p => p.name === name);
  const next = Object.assign({ name }, idx >= 0 ? list[idx] : {}, patch);
  if(idx >= 0) list[idx] = next; else list.push(next);
  state.dishPlan[mk] = list;
}
function dropDishPlan(mk, name){
  if(!state.dishPlan || !state.dishPlan[mk]) return;
  const list = state.dishPlan[mk].filter(p => p.name !== name);
  if(list.length) state.dishPlan[mk] = list; else delete state.dishPlan[mk];
}
function isFreezerDish(mk, name){ return ((state.freezerDishes && state.freezerDishes[mk]) || []).includes(name); }
function setFreezerDish(mk, name, on){
  if(!state.freezerDishes) state.freezerDishes = {};
  const list = (state.freezerDishes[mk] || []).filter(n => n !== name);
  if(on) list.push(name);
  if(list.length) state.freezerDishes[mk] = list; else delete state.freezerDishes[mk];
}
// Quanto di un piatto si cucina davvero per il pasto: 0 se arriva dal
// freezer, 2 con la doppia dose, altrimenti 1. Vale per Spesa e per la
// finestra "Ricetta fatta!".
function dishCookFactor(mk, name){
  if(isFreezerDish(mk, name)) return 0;
  return getDishPlan(mk, name).double ? 2 : 1;
}
// Ingredienti da scalare dalla Dispensa a pasto cucinato, ognuno col suo
// fattore (0 = dal freezer, quindi escluso; 2 = doppia dose).
function mealCookIngredients(mk, mealData){
  const names = (mealData.principale ? [mealData.principale] : []).concat(mealData.contorni || []);
  const out = [];
  names.forEach(n => {
    const factor = dishCookFactor(mk, n);
    if(factor) getIngredientsFor(n).forEach(it => out.push(Object.assign({}, it, { factor })));
  });
  return out;
}
function canFreeze(name){ const r = getRecipeMeta(name); return !!r && r.freezerNew && r.freezerNew !== 'non-adatta'; }
function canPrepAhead(name){
  const r = getRecipeMeta(name);
  return !!r && ((r.freezerNew && r.freezerNew !== 'non-adatta') || (r.pianificazione && r.pianificazione !== 'nessuna'));
}
function mealPortions(mk, principale){
  const det = principale ? getRecipeDetails(principale) : null;
  return state.dayPortions[mk] || (det && parsePortionsBase(det.porzioni)) || 2;
}
// Porzioni di una ricetta nel freezer (voce di Dispensa segnata frozenMeal).
function freezerPortionsOf(name){
  const it = state.pantryItems[(name || '').trim().toLowerCase()];
  return it && it.frozenMeal && typeof it.qty === 'number' ? it.qty : 0;
}
function freezerMeals(){
  return Object.values(state.pantryItems).filter(it => it.frozenMeal && typeof it.qty === 'number' && it.qty > 0 && getRecipeMeta(it.nome));
}
function addFreezerPortions(name, portions){
  const key = name.trim().toLowerCase();
  upsertPantryItem(name, 'freezer', portions, '', 'avanzi');
  const it = state.pantryItems[key];
  it.luogo = 'freezer';
  it.leftover = true;
  it.frozenMeal = true;
}
function takeFreezerPortions(name, portions){
  const it = state.pantryItems[(name || '').trim().toLowerCase()];
  if(!it || !it.frozenMeal) return;
  it.qty = Math.max(0, (it.qty || 0) - portions);
}
// Doppia dose pronta (prep spuntato o pasto cucinato, quello che viene
// prima): la metà in più va nel freezer, una volta sola.
function freezeDoubleIfReady(weekIdx, i, meal, name){
  const mk = mealKey(weekIdx, i, meal);
  const plan = getDishPlan(mk, name);
  if(!plan.double || plan.frozen) return 0;
  const n = mealPortions(mk, effectiveMeal(weekIdx, i, meal).principale);
  addFreezerPortions(name, n);
  setDishPlan(mk, name, { frozen: true });
  return n;
}
// Piatti che si possono preparare nel giorno di prep: quelli dei giorni
// dopo, fino a venerdì. chosen = già in lista; gli altri sono suggerimenti.
function prepCandidates(weekIdx){
  const startPos = WEEK_DISPLAY_ORDER.indexOf(PREP_DAYS[prepDayOf(weekIdx)]);
  const out = [];
  WEEK_DISPLAY_ORDER.forEach((i, pos) => {
    if(pos <= startPos) return;
    ['pranzo', 'cena'].forEach(meal => {
      const mk = mealKey(weekIdx, i, meal);
      const linked = !!linkedSourceMealKey(weekIdx, i, meal);
      mealDishes(weekIdx, i, meal).forEach(dsh => {
        if((linked && dsh.role === 'p') || isFreezerDish(mk, dsh.name) || !canPrepAhead(dsh.name)) return;
        const plan = getDishPlan(mk, dsh.name);
        const r = getRecipeMeta(dsh.name);
        const chosen = plan.prep === undefined ? r.freezerNew === 'meal-prep' : !!plan.prep;
        out.push({ mk, i, meal, name: dsh.name, plan, chosen });
      });
    });
  });
  return out;
}
function renderPrepBox(weekIdx, i){
  const day = prepDayOf(weekIdx);
  if(PREP_DAYS[day] !== parseInt(i, 10)) return '';
  const cands = prepCandidates(weekIdx);
  if(!cands.length) return '';
  const iso = weekStartIso(weekIdx);
  const forLabel = c => `${DATA.week1[c.i].giorno.slice(0, 3).toLowerCase()} ${MEAL_LABEL[c.meal].toLowerCase()}`;
  const chosen = cands.filter(c => c.chosen), others = cands.filter(c => !c.chosen);
  const doneCount = chosen.filter(c => c.plan.done).length;
  const rowAttrs = c => `data-prep-key="${c.mk}" data-prep-name="${escapeAttr(c.name)}"`;
  const chosenHtml = chosen.map(c => `
      <div class="prep-row${c.plan.done ? ' is-done' : ''}">
        <button type="button" class="prep-check" data-prep-done ${rowAttrs(c)} aria-pressed="${!!c.plan.done}" aria-label="Fatto">${c.plan.done ? '✓' : ''}</button>
        <div class="prep-row-text"><span class="prep-row-name">${escapeHtml(c.name)}</span><span class="prep-row-for">per ${escapeHtml(forLabel(c))}${c.plan.double ? ' · doppia dose, metà in freezer' : ''}</span></div>
        ${canFreeze(c.name) ? `<button type="button" class="btn prep-double${c.plan.double ? ' active' : ''}" data-prep-double ${rowAttrs(c)} aria-pressed="${!!c.plan.double}" aria-label="Doppia dose, metà in freezer">❄️ ×2</button>` : ''}
        <button type="button" class="btn is-icon dish-act" data-prep-toggle ${rowAttrs(c)} aria-label="Togli dal prep">✕</button>
      </div>`).join('');
  const othersOpen = !!(state.prepSuggOpen && state.prepSuggOpen[iso]);
  const othersHtml = others.length ? `
      <button type="button" class="prep-sugg-toggle" data-prep-sugg="${iso}">${othersOpen ? '▴' : '▾'} Si possono preparare prima (${others.length})</button>
      ${othersOpen ? others.map(c => `
      <div class="prep-row is-sugg">
        <div class="prep-row-text"><span class="prep-row-name">${escapeHtml(c.name)}</span><span class="prep-row-for">per ${escapeHtml(forLabel(c))}</span></div>
        <button type="button" class="btn prep-add" data-prep-toggle ${rowAttrs(c)}>+ prep</button>
      </div>`).join('') : ''}` : '';
  return `
      <div class="prep-box">
        <div class="prep-head">
          <span class="prep-title">🔪 Prep${chosen.length ? ` <span class="prep-count">${doneCount}/${chosen.length}</span>` : ''}</span>
          <span class="prep-day-chips" role="group" aria-label="Giorno di prep">
            ${Object.keys(PREP_DAYS).map(d => `<button type="button" class="btn is-chip${day === d ? ' active' : ''}" data-prep-day="${d}" data-prep-week="${iso}" aria-pressed="${day === d}">${d === 'sab' ? 'Sab' : 'Dom'}</button>`).join('')}
          </span>
        </div>
        ${chosen.length ? `<div class="prep-list">${chosenHtml}</div>` : '<div class="prep-empty">Niente in lista: aggiungi qui sotto cosa preparare.</div>'}
        ${othersHtml}
      </div>`;
}

// Promemoria della sera: se domani (pranzo o cena) c'è un piatto con legumi
// secchi da mettere a bagno, la card di oggi lo dice in un riquadro sotto la
// cena, sempre visibile senza aprire il dettaglio. Vale solo per le ricette
// che lo chiedono davvero (ammollo nella preparazione anticipata o legumi
// "secchi" tra gli ingredienti): con i legumi già cotti non serve.
const SOAK_LEGUMI_RE = /\b(ceci|fagiol\w*|lenticch\w*|fave|cicerch\w*|borlott\w*|cannellin\w*|piselli)\b/i;
function dishNeedsSoak(name){
  const r = getRecipeMeta(name);
  if(r && /ammollo/i.test(r.prep || '')) return true;
  return getIngredientsFor(name).some(it => SOAK_LEGUMI_RE.test(it.ingrediente || '') && /secch/i.test(it.ingrediente || ''));
}
// Il giorno dopo nell'ordine di visualizzazione (la settimana parte dal
// sabato); dall'ultimo giorno si passa al primo della settimana seguente.
function nextDayRef(weekIdx, pos){
  if(pos < WEEK_DISPLAY_ORDER.length - 1) return { weekIdx, i: WEEK_DISPLAY_ORDER[pos+1] };
  return { weekIdx: weekIdx + 1, i: WEEK_DISPLAY_ORDER[0] };
}
function dishNeedsOvernightMarinade(name){
  const r = getRecipeMeta(name);
  if(!r || r.pianificazione !== 'marinatura') return false;
  const det = getRecipeDetails(name);
  return /notte/i.test(((det && det.ricordare) || '') + ' ' + (r.prep || ''));
}
// Riquadro "Stasera, per domani" sotto la cena: ammollo dei legumi,
// marinatura di una notte, e cosa tirare fuori dal freezer.
function soakReminderHtml(weekIdx, pos){
  const nx = nextDayRef(weekIdx, pos);
  if(nx.weekIdx > 0 && !state.extraWeeks[nx.weekIdx - 1]) return '';
  const groups = [
    { ic: '💧', label: 'Ammollo dei legumi', items: [] },
    { ic: '❄️', label: 'Togli dal freezer', items: [] },
    { ic: '🥩', label: 'Marinatura', items: [] }
  ];
  ['pranzo', 'cena'].forEach(meal => {
    const mk = mealKey(nx.weekIdx, nx.i, meal);
    mealDishes(nx.weekIdx, nx.i, meal).forEach(dsh => {
      const what = `<b>${escapeHtml(dsh.name)}</b> (${escapeHtml(MEAL_LABEL[meal].toLowerCase())})`;
      if(isFreezerDish(mk, dsh.name)){ groups[1].items.push(what); return; }
      if(dishNeedsSoak(dsh.name)) groups[0].items.push(what);
      if(dishNeedsOvernightMarinade(dsh.name)) groups[2].items.push(what);
    });
  });
  const lines = groups.filter(g => g.items.length);
  if(!lines.length) return '';
  return `
      <div class="soak-note" role="note">
        <span class="soak-note-title">Stasera, per domani</span>
        ${lines.map(g => `<div class="soak-note-line"><span class="soak-note-ic" aria-hidden="true">${g.ic}</span><span>${g.label}: ${g.items.join(', ')}</span></div>`).join('')}
      </div>`;
}

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
      ${isPastCard ? '' : renderPrepBox(weekIdx, i)}
      ${hidePranzo ? '' : renderMealBlock(weekIdx, i, 'pranzo', pos, weekDates, isPastCard, d, dateLabel, isToday)}
      ${renderMealBlock(weekIdx, i, 'cena', pos, weekDates, isPastCard, d, dateLabel, isToday)}
      ${isPastCard ? '' : soakReminderHtml(weekIdx, pos)}
    </div>
  </div>`;
}

// Un elemento [data-close-*] chiude la sua finestra: un bottone (✕, Fatto,
// Annulla) sempre, lo sfondo solo se il tocco è proprio sullo sfondo, fuori
// dalla finestra. Prima si contava sullo stopPropagation del primo
// [data-stop-close] del pannello, che vale per una finestra sola: con una
// finestra aperta sopra un'altra (es. "Gestisci categorie" da "Aggiungi
// ingrediente") ogni tocco dentro quella di sopra la chiudeva.
function closeDeptEdit(){ state.deptEditId = null; state.deptDraft = null; }
function closeGroupEdit(){ state.groupEditId = null; state.groupDraft = null; state.groupMemberSearch = ''; }
function closeIngredientSheet(){
  state.pantryEditKey = null;
  state.pantryAddModalOpen = false;
  state.pantryDraft = null;
  state.pantrySheetPicker = null;
  state.pantrySheetMore = false;
}
function isCloseTap(e, el){
  return el.tagName === 'BUTTON' || e.target === el;
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
      <div class="settings-field-label">Il tuo colore nei turni di cucina</div>
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

// Equilibrio della settimana, come la vede il generatore (WEEK_*_TARGETS):
// conta le proteine dei pasti effettivamente in Menù, avanzi compresi (ogni
// pasto mangiato conta, come in weekEatenSequence), anche dopo i cambi a
// mano. I "pochi" si segnalano solo a settimana quasi piena: con metà dei
// pasti ancora da decidere mancherebbe sempre tutto.
const BALANCE_FULL_FROM = 12;
function weekBalance(weekIdx){
  const prot = {}, base = {};
  let planned = 0;
  WEEK_DISPLAY_ORDER.forEach(i=>{
    ['pranzo','cena'].forEach(meal=>{
      const r = effectiveRecipeMeta(weekIdx, i, meal);
      if(!r) return;
      planned++;
      const p = recipeProteina(r), b = recipeBase(r);
      prot[p] = (prot[p] || 0) + 1;
      base[b] = (base[b] || 0) + 1;
    });
  });
  const checkLow = planned >= BALANCE_FULL_FROM;
  const status = (count, [min, max]) => count > max ? 'high' : (checkLow && count < min ? 'low' : 'ok');
  const items = PROTEINA_ORDER.filter(k => k !== 'nessuna').map(k=>({ key:k, count: prot[k] || 0, range: WEEK_PROTEINA_TARGETS[k], status: status(prot[k] || 0, WEEK_PROTEINA_TARGETS[k]) }))
    .filter(it => it.key !== 'salumi' || it.count > 0);
  const pasta = { key:'pasta', count: base.pasta || 0, range: WEEK_BASE_TARGETS.pasta, status: status(base.pasta || 0, WEEK_BASE_TARGETS.pasta) };
  return { planned, checkLow, items, pasta };
}
// Una riga sola di iconcine col conteggio (🫘 3 · 🐟 2 ...), colorate se
// troppe (rosso) o poche (giallo), e in fondo ✓ a settimana equilibrata o
// "8/14" se mancano ancora pasti. Un tocco apre/chiude la spiegazione a parole.
const PROTEINA_ICON = { legumi:'🫘', pesce:'🐟', 'carne-bianca':'🍗', 'carne-rossa':'🥩', salumi:'🥓', uova:'🥚', formaggi:'🧀' };
function renderWeekBalance(weekIdx){
  const bal = weekBalance(weekIdx);
  if(!bal.planned) return '';
  const label = it => (PROTEINA_LABEL[it.key] || 'Pasta').toLowerCase();
  const shown = bal.items.concat(bal.pasta.status === 'high' ? [bal.pasta] : []);
  const pills = shown.map(it => `<span class="balance-pill is-${it.status}" aria-label="${escapeAttr(`${PROTEINA_LABEL[it.key] || 'Pasta'}: ${it.count}`)}">${it.key === 'pasta' ? '🍝' : PROTEINA_ICON[it.key]}<b>${it.count}</b></span>`).join('');
  const low = bal.items.filter(it => it.status === 'low').map(it => `${label(it)} ${it.count} (almeno ${it.range[0]})`);
  const high = shown.filter(it => it.status === 'high').map(it => `${label(it)} ${it.count} (massimo ${it.range[1]})`);
  const notes = [];
  if(low.length) notes.push(`Pochi: ${low.join(' · ')}`);
  if(high.length) notes.push(`Troppi: ${high.join(' · ')}`);
  const warn = notes.length > 0;
  const end = warn ? '' : (bal.checkLow ? '<span class="balance-end is-ok" aria-label="Settimana equilibrata">✓</span>' : `<span class="balance-end" aria-label="${bal.planned} pasti su 14 decisi">${bal.planned}/14</span>`);
  const detail = warn ? notes.join('. ') : (bal.checkLow ? 'Settimana equilibrata.' : `${bal.planned} pasti su 14 decisi: quello che manca si valuta a settimana quasi piena.`);
  const open = !!state.balanceDetailsOpen;
  return `<div class="week-balance">
      <button type="button" class="balance-pills" data-toggle-balance-details aria-expanded="${open}" aria-label="Equilibrio della settimana">${pills}${end}</button>
      ${open ? `<p class="balance-verdict${warn ? ' is-warn' : ''}">${escapeHtml(detail)} <span class="balance-legend">${Object.keys(PROTEINA_ICON).map(k => `${PROTEINA_ICON[k]} ${escapeHtml(PROTEINA_LABEL[k].toLowerCase())}`).concat(['🍝 pasta (solo se è troppa)']).join(' · ')}</span></p>` : ''}
    </div>`;
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
      ${renderWeekBalance(weekIdx)}
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

  // "In scadenza" anche nel Menù: quello che scade entro EXPIRY_SOON_DAYS
  // (o è già scaduto ma c'è ancora), con un tocco su "Cosa cucino" per le
  // ricette che lo usano (Ricette → Con quello che ho). Chiuso, non torna
  // fino a domani su questo telefono.
  let expiryBanner = '';
  if(!expiryBannerDismissedToday()){
    const soon = Object.values(state.pantryItems)
      .map(it => ({ it, d: pantryExpiryDays(it) }))
      .filter(x => x.d !== null && x.d <= EXPIRY_SOON_DAYS && !isNonFoodDept(knownDept(x.it.cat) || classifyDept(x.it.nome)))
      .sort((a, b) => a.d - b.d);
    if(soon.length){
      const when = d => d < 0 ? 'scaduto' : d === 0 ? 'oggi' : d === 1 ? 'domani' : `tra ${d} giorni`;
      const list = soon.slice(0, 3).map(x => `<b>${escapeHtml(x.it.nome)}</b> (${when(x.d)})`).join(', ') + (soon.length > 3 ? ` e altri ${soon.length - 3}` : '');
      expiryBanner = `
        <div class="eaten-reminder-banner expiry-banner">
          <span>⏰ Scade presto: ${list}</span>
          <div class="eaten-reminder-actions">
            <button type="button" class="btn is-solid mini-add-btn" data-expiry-cook>Cosa cucino</button>
            <button type="button" class="btn is-ghost" data-dismiss-expiry-banner aria-label="Chiudi fino a domani">✕</button>
          </div>
        </div>`;
    }
  }

  let doneModal = '';
  if(state.doneModalDay !== null){
    const { weekIdx: doneWeekIdx, i: di, meal: doneMeal } = parseMealKey(state.doneModalDay);
    const doneMealData = effectiveMeal(doneWeekIdx, di, doneMeal);
    const doneName = doneMealData.principale || '';
    const doneIng = mealCookIngredients(state.doneModalDay, doneMealData);
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
    const breadIt = breadPantryItem();
    const showBread = mealHasBread(di, doneMeal) && !recipeListsBread(uniqueIng);
    const breadRowHtml = !showBread ? '' : (breadCountable(breadIt) ? `
      <div class="done-ing-list done-bread">
        <div class="done-ing-row">
          <span>🍞 ${escapeHtml(breadIt.nome)}<span class="done-bread-left">${breadIt.qty > 0 ? `In Dispensa: ${breadIt.qty}, ne restano ${Math.max(0, breadIt.qty - state.doneModalBread)}` : 'Finito in Dispensa'}</span></span>
          <span class="qty-stepper">
            <button class="qty-btn" type="button" data-done-bread="-1" aria-label="Un panino in meno">−</button>
            <span class="qty-num">${state.doneModalBread}</span>
            <button class="qty-btn" type="button" data-done-bread="1" aria-label="Un panino in più">+</button>
          </span>
        </div>
      </div>` : `
      <div class="done-ing-list done-bread"><div class="done-ing-row untracked"><span>🍞 Pane</span><span class="done-ing-hint">${breadIt ? 'in Dispensa non è a pezzi' : 'non in dispensa'}</span></div></div>`);
    doneModal = `
    <div class="filters-modal-backdrop" data-close-done-modal>
      <div class="filters-modal" data-stop-close>
        <div class="filters-modal-header">
          <h3>Ricetta fatta! 🎉</h3>
          <button class="btn is-icon filters-close-btn" data-close-done-modal>✕</button>
        </div>
        <p class="section-sub" style="margin-top:-8px;">Quanto ne hai usato per questo pasto? Alla conferma lo tolgo dalla Dispensa — il resto degli ingredienti non cambia.</p>
        ${doneName && getRecipeMeta(doneName) ? `<div class="done-grad">${gradimentoPickerHtml(doneName)}</div>` : ''}
        ${breadRowHtml}
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
      let lockedCount = 0, pastCount = 0, totalMeals = 0;
      for(let d = 0; d < 7; d++){
        ['pranzo','cena'].forEach(m=>{
          if(m === 'pranzo' && !(d===4||d===5||d===6)) return;
          totalMeals++;
          if(isMealPast(genSettingsTargetWeek, d, m)) pastCount++;
          else if(state.mealLocked[`${genSettingsTargetWeek}_${d}_${m}`]) lockedCount++;
        });
      }
      regenCount = totalMeals - lockedCount - pastCount;
      const kept = [lockedCount ? `i <b>${lockedCount} bloccati</b>` : '', pastCount ? `i <b>${pastCount} già passati</b>` : ''].filter(Boolean).join(' e ');
      regenNote = kept ? `Rigenerare sostituisce <b>${regenCount} pasti</b> e conserva ${kept}.` : '';
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
          ${genSettingsTargetWeek !== null ? `<div class="filter-group">
            <div class="filter-group-label">Ingredienti</div>
            <div class="tempo-base-list">
              <button type="button" class="tempo-base-row${state.genPantryOnly ? ' active' : ''}" data-toggle-gen-pantry aria-pressed="${!!state.genPantryOnly}"><span>🧺 Solo con quello che ho in casa</span>${state.genPantryOnly ? '<span class="tempo-base-check">✓</span>' : ''}</button>
            </div>
            ${state.genPantryOnly ? '<p class="section-sub" style="margin:0.5rem 0 0;">Prima le ricette per cui hai tutto. Se non bastano, quelle a cui manca meno.</p>' : ''}
          </div>` : ''}
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
  const dishPickerScreen = state.dishPicker ? renderDishPickerScreen() : '';
  return `
    ${eatenReminderBanner}
    ${expiryBanner}
    ${reminderBanner}
    ${weekSections}
    ${doneModal}
    ${renderRecipeEditModal()}
    ${genSettingsModal}
    ${mealDetailScreen}
    ${swapScreen}
    ${linkPickerScreen}
    ${avanzoDiPickerScreen}
    ${dishPickerScreen}
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
      // Dal freezer: niente da comprare. Doppia dose: il doppio.
      const factor = dishCookFactor(mk, name);
      if(!factor) return;
      const ingList = getIngredientsFor(name);
      ingList.forEach((it,idx)=>{
        const key = dayIngKey(weekIdx, i, meal, role, ingList, idx);
        if(state.shopDismissed[key]) return;
        // Le quantità scalate valgono solo finché non è già stato spuntato:
        // quello già preso non deve cambiare retroattivamente se poi si aggiustano le porzioni.
        const qta = state.shopChecked[key] ? it.qta : scaleQtyText(it.qta, ratio * factor);
        // Se in Dispensa ce n'è già abbastanza, non compare proprio in Spesa
        // (niente riga da vedere/spuntare) — a meno che non l'avessi già
        // esplicitamente de-spuntato in passato per dire "mi serve comunque".
        if(pantryStatusFor(it.ingrediente, qta) === 'in-casa' && state.shopChecked[key] !== false) return;
        flat.push({ key, ingrediente:it.ingrediente, qta, dove:it.dove, note:it.note, context, contextShort, isRecipe: true });
      });
    });
  });
  const bread = breadShopNeed();
  if(bread && !state.shopDismissed[bread.key]) flat.push({ key: bread.key, ingrediente: bread.nome, qta: String(bread.need), dove:'', note:'', context:'Pane per i pasti', contextShort:`Pane per ${bread.meals} pasti` });
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
    const confirmedShop = state.pantryConfirmedShop[pantryKey];
    flat.push({ key, ingrediente:it.nome, qta: typeof confirmedShop === 'string' ? confirmedShop : '', dove:'', note:'', context:'Finiti in Dispensa', contextShort:'Finiti in Dispensa', confirmed: !!confirmedShop });
  });
  return flat;
}

function renderSpesa(){
  // Chi ha già scorta sufficiente in Dispensa non compare proprio qui (vedi
  // buildShopFlat) — se serve comunque, si riaggiunge a mano con "+". Una
  // riga è spuntata solo se l'hai spuntata tu: niente più spunta automatica
  // "ce l'hai già" in base alla Dispensa (faceva partire già spuntato un
  // ingrediente aggiunto a mano proprio perché serviva comunque).
  const shopQuery = (state.shopSearch || '').trim().toLowerCase();
  const mainFlat = buildShopFlat().filter(it => !shopQuery || (it.ingrediente || '').toLowerCase().includes(shopQuery));

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
      : `<span class="ing-note-row">${ingNote ? `<span class="ing-note-text" data-ing-note-show="${escapeAttr(ingNoteKey)}">${escapeHtml(ingNote)}</span>` : ''}</span>`;
    return `
    <div class="swipe-wrap" data-swipe-id="shop:${escapeAttr(rowKey)}" data-swipe-shop="${escapeAttr(rowKey)}" data-swipe-label="${escapeAttr(ingrediente)}">
    <button type="button" class="swipe-trash" tabindex="-1" aria-label="Elimina ${escapeAttr(ingrediente)}">${TRASH_ICON_SVG}</button>
    <div class="shop-item-row swipe-content">
      <label class="shop-item ${checked?'checked':''}">
        <input type="checkbox" data-shop-keys="${rowKey}" data-shop-name="${escapeAttr(ingrediente)}" data-shop-unit="${escapeAttr(unit)}" ${checked?'checked':''}>
        <span>
          <span class="item-name">${escapeHtml(ingrediente)}${isPartial ? `<span class="partial-mark" title="Spuntato solo per ${checkedCount} giorno/i su ${keys.length}, non per tutti">◐</span>` : ''}${!ingNote && !editingIngNote ? `<button type="button" class="ing-note-pencil" data-ing-note-show="${escapeAttr(ingNoteKey)}" aria-label="Aggiungi una nota">${PENCIL_ICON_SVG}</button>` : ''}</span>
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
    </div>
    </div>`;
  }

  let body = '';
  let hasFinitiThisView = false;
  // Le righe spuntate escono dalle loro sezioni e finiscono in "Completati",
  // in fondo a tutto, con "Sposta in dispensa": togliere la spunta le
  // rimette al loro posto, così un errore si corregge al volo (ha preso il
  // posto della vecchia "Modalità spesa", che spostava subito in Dispensa).
  const completedMap = {};
  const addCompleted = it => {
    const k = (it.ingrediente || '').trim().toLowerCase();
    if(!completedMap[k]) completedMap[k] = { ingrediente: it.ingrediente, qtas: [], keys: [] };
    completedMap[k].qtas.push(...(it.qtas || [it.qta]));
    completedMap[k].keys.push(...(it.keys || [it.key]));
  };
  if(state.shopView === 'reparto' || state.shopView === 'az'){
    // Solo reparto merceologico, niente più negozio: si compra dove capita.
    // I "Finiti in Dispensa" vanno nel loro reparto dedicato invece che in "Altro"
    // (o nel reparto merceologico vero, che a colpo d'occhio non spiegherebbe il perché sono lì)
    // — a meno che non siano stati segnati "da comprare" da Spesa: a quel punto si mescolano
    // nel loro reparto vero, tra le sezioni normali.
    const classified = mainFlat.map(it=>{
      // Nota: il "dove sta" (freezer) non conta, il pane per esempio si compra
      // fresco e si congela a casa: va in Surgelati solo ciò che è surgelato
      // nel nome o messo a mano in quella categoria.
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
      if(it.dept !== 'finiti' && isItemChecked(it.keys, it.ingrediente)){ addCompleted(it); return; }
      if(!byDept[it.dept]) byDept[it.dept] = [];
      byDept[it.dept].push(it);
    });

    // In ordine di corsia (vedi shopAisleOrder), "Finiti" ultimo.
    const deptsPresent = DEPT_ORDER.filter(dept => byDept[dept] && byDept[dept].length);
    let sortedDepts = shopAisleOrder().filter(d => deptsPresent.includes(d));
    // "Dalla A alla Z": una lista sola senza sezioni (i Finiti restano a parte, in fondo).
    if(state.shopView === 'az'){
      byDept.__az = mergedList.filter(it => it.dept !== 'finiti' && !isItemChecked(it.keys, it.ingrediente)).sort((a, b) => IT_COLLATOR.compare(a.ingrediente, b.ingrediente));
      sortedDepts = (byDept.__az.length ? ['__az'] : []).concat(deptsPresent.includes('finiti') ? ['finiti'] : []);
    }
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
      if(dept === '__az') return `<div class="shop-day-group shop-az">${rowsHtml}</div>`;
      const sectionId = `reparto_${dept}`;
      const isOpen = !state.shopSectionCollapsed[sectionId];
      return `
      <div class="shop-day-group">
        <div class="dept-title finished-toggle${isOpen ? ' open' : ''}" data-toggle-shop-section="${sectionId}">
          <span class="dept-icon">${DEPT_ICON[dept] || ''}</span>${escapeHtml(DEPT_LABEL[dept])}
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
      const allDayItems = Object.values(mergedDay).map(it => ({ ...it, qta: combineQtyTexts(it.qtas) }));
      giornoMergedAll.push(...allDayItems);
      const mergedDayItems = allDayItems.filter(it => { if(isItemChecked(it.keys, it.ingrediente)){ addCompleted(it); return false; } return true; });
      if(allDayItems.length && !mergedDayItems.length) return '';
      if(shopQuery && !allDayItems.length) return '';
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
    const notDone = it => { if(isItemChecked([it.key], it.ingrediente)){ addCompleted(it); return false; } return true; };
    const genContext = mainFlat.filter(it => it.context === 'Ogni settimana').filter(notDone);
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
    const extraContext = mainFlat.filter(it => it.context === 'Aggiunti a mano').filter(notDone);
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

  const completedList = Object.values(completedMap).sort((a, b) => IT_COLLATOR.compare(a.ingrediente, b.ingrediente));
  if(completedList.length){
    body += `
      <div class="shop-day-group shop-completed">
        <div class="dept-title">Completati</div>
        <div class="accordion-body">${completedList.map(it => itemRow(it.keys, it.ingrediente, combineQtyTexts(it.qtas), '', '', true)).join('')}</div>
        <div class="shop-completed-actions">
          <button type="button" class="btn is-text" id="reset-shop">Togli le spunte</button>
          <button type="button" class="btn is-outline color-delete" id="delete-checked-shop">Elimina</button>
          <button type="button" class="btn is-solid" id="move-checked-to-pantry">Sposta in dispensa</button>
        </div>
      </div>`;
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
    ${listSearchHtml('shop-search', state.shopSearch, 'Cerca nella lista…')}
    <div class="shop-head">
      <div class="shop-head-title">
        <span class="shop-head-sub">${displayTotal} ${displayTotal === 1 ? 'articolo' : 'articoli'}${displayDone ? ` · ${displayDone} ${displayDone === 1 ? 'preso' : 'presi'}` : ''}</span>
      </div>
      <label class="shop-group-by"><span>Ordina per</span>
        <select data-shop-group aria-label="Ordina per">
          ${[['reparto','Corsia'],['giorno','Pasto'],['az','Dalla A alla Z']].map(([v,l]) => `<option value="${v}" ${state.shopView === v ? 'selected' : ''}>${l}</option>`).join('')}
        </select>
      </label>
    </div>
    <div class="shop-list">${body}</div>
          
    
  ${addIngModal}
  ${renderExpiryConfirmModal()}
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
  const basePers = det ? parsePortionsBase(det.porzioni) : null;
  const nPers = basePers ? (state.recipePortions[name] || basePers) : 0;
  const rRatio = basePers ? nPers / basePers : 1;
  const recPane = state.dishPane['r|' + name] || 'ing';
  const ingHtml = renderIngredientsSection(ing, rRatio, { noButton: true, titleHtml: personeRowHtml(nPers, '', name) }, nPers);
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
  // Impostazioni ⋯ in alto a destra: modifica la ricetta, album.
  const nAlbum = cookbooksWith(name).length;
  const menuItems = [
    { label: '✏️ Modifica ricetta', attrs: `data-open-recipe-edit="${escapeAttr(name)}"` },
    { label: `📚 ${nAlbum ? `In ${nAlbum} album` : 'Aggiungi a un album'}`, attrs: `data-album-for="${escapeAttr(name)}"` }
  ];
  const menuAction = `<button type="button" class="btn is-icon meal-menu-btn" data-recipe-menu aria-label="Impostazioni della ricetta" aria-expanded="${!!state.recipeMenuOpen}">${DOTS_ICON_SVG}</button>`;
  const menuHtml = state.recipeMenuOpen ? `
      <div class="meal-menu-backdrop" data-recipe-menu-close></div>
      <div class="topbar-menu meal-menu" role="menu">
        ${menuItems.map(it => `<button type="button" class="topbar-menu-item" role="menuitem" ${it.attrs}>${it.label}</button>`).join('')}
      </div>` : '';
  // "Aggiungi N ingredienti" in alto nella tab Ingredienti (quantità scalate sulle persone scelte).
  const mancantiTop = mancantiButtonHtml(missingIngredients(ing, rRatio));
  const cookFab = cookFabHtml(name, rRatio);
  return managePageHtml({ key: 'recipe-' + name, title: escapeHtml(name), closeAttr: `data-toggle-recipe="${escapeAttr(name)}"`, action: menuAction, body: `
    <div class="meal-detail-body${cookFab ? ' has-cook-fab' : ''}">
      ${recipePhotoHtml(name)}
      ${tagsHtml}
      ${paneTabsHtml('r|' + name, recPane)}
      ${recPane === 'ing' ? `${mancantiTop}${ingHtml}${addFormHtml}` : `${stepsHtml || '<div class="ing-empty">Nessun procedimento salvato per questa ricetta.</div>'}${noteBox}${linkHtml ? `<div class="button-wrapper">${linkHtml}</div>` : ''}`}
      ${gradimentoPickerHtml(name)}
      ${menuHtml}
      ${cookFab}
    </div>` });
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
  // "Con quello che ho": solo le ricette con almeno metà degli ingredienti
  // in Dispensa o che usano qualcosa in scadenza; in cima quelle che usano
  // le cose più urgenti con più ingredienti già in casa (urgenza + copertura,
  // entrambe tra 0 e circa 1), a parità quelle a cui manca meno. Gli altri filtri
  // restano validi (es. solo primi, solo di stagione).
  const pantryMode = !!state.prepPantryMode;
  const matches = {};
  if(pantryMode){
    const expiring = pantryExpiringMap();
    list.forEach(r=>{ matches[r.nome] = recipePantryMatch(r.nome, expiring); });
    const urgency = m => m.exp.reduce((sum, e) => sum + 1 / (1 + e.d), 0);
    list = list.filter(r => matches[r.nome].total && (matches[r.nome].cov >= 0.5 || matches[r.nome].exp.length));
    list.sort((a,b)=>{
      const ma = matches[a.nome], mb = matches[b.nome];
      return ((urgency(mb) + mb.cov) - (urgency(ma) + ma.cov)) || (ma.missing.length - mb.missing.length) || IT_COLLATOR_BASE.compare(a.nome, b.nome);
    });
  }
  const pantryMatchHtml = m=>{
    if(!m) return '';
    const missingText = m.missing.length
      ? `manca ${m.missing.slice(0, 3).map(escapeHtml).join(', ')}${m.missing.length > 3 ? ` e altri ${m.missing.length - 3}` : ''}`
      : 'hai tutto';
    const exp = m.exp.slice().sort((a, b) => a.d - b.d).map(e => `<span class="pantry-match-exp">${escapeHtml(e.nome)} ${e.d === 0 ? 'scade oggi' : e.d === 1 ? 'scade domani' : `scade tra ${e.d} giorni`}</span>`).join('');
    return `<div class="pantry-match"><span class="pantry-match-count${m.missing.length ? '' : ' is-all'}">${m.have} su ${m.total} in casa · ${missingText}</span>${exp}</div>`;
  };
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
          ${pantryMatchHtml(matches[r.nome])}
        </div>
        <div class="day-row-side">
          ${GRAD_ICON[r.gradimento] ? `<span class="grad-icon" title="${escapeAttr(stripHtml(GRAD_LABEL[r.gradimento]))}" aria-label="${escapeAttr(stripHtml(GRAD_LABEL[r.gradimento]))}">${GRAD_ICON[r.gradimento]}</span>` : ''}
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

  const prepSwitch = `<div class="pantry-kind-switch" role="group" aria-label="Ricette o Libro di cucina">
      <button type="button" class="pantry-kind-btn${state.prepView !== 'libro' ? ' active' : ''}" data-prep-view="ricette" aria-label="Ricette" aria-pressed="${state.prepView !== 'libro'}">${CHEF_ICON_SVG}</button>
      <span class="pantry-kind-sep" aria-hidden="true"></span>
      <button type="button" class="pantry-kind-btn${state.prepView === 'libro' ? ' active' : ''}" data-prep-view="libro" aria-label="Libro di cucina" aria-pressed="${state.prepView === 'libro'}">${BOOK_ICON_SVG}</button>
    </div>`;
  if(state.prepView === 'libro'){
    return `
    <div class="cookbook-view">${renderCookbooksView()}</div>
    ${renderCookbookPage()}
    ${renderCookbookPicker()}
    ${renderCookbookUse()}
    ${renderRecipeEditModal()}
    ${recipeDetailScreen}
    ${prepSwitch}
    <div class="buttons-fixed">
      <button class="btn is-fixed" type="button" data-cookbook-new aria-label="Nuovo album"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></button>
    </div>`;
  }

  return `
    <p class="section-sub">${totalCount} ricette — tocca una ricetta per vedere gli ingredienti</p>
    <div class="prep-search-row">
      ${listSearchHtml('f-search', state.filters.search, 'Cerca una ricetta…')}
      <button class="btn is-filters prep-filters-btn${activeCount ? ' active' : ''}" type="button" data-open-filters><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M10 18h4v-2h-4zM3 6v2h18V6zm3 7h12v-2H6z"></path></svg>Filtri${activeCount ? ` (${activeCount})` : ''}</button>
    </div>

    ${filtersModal}
    <div class="shop-head">
      <div class="shop-head-title"><span class="shop-head-sub">${list.length} ${list.length === 1 ? 'ricetta' : 'ricette'}</span></div>
      <button type="button" class="pantry-check${pantryMode ? ' active' : ''}" data-toggle-pantry-mode role="checkbox" aria-checked="${pantryMode}"><span class="pantry-check-box" aria-hidden="true"></span>Con quello che ho</button>
    </div>
    </div>
    ${pantryMode ? `<p class="pantry-mode-note">Ricette con almeno metà degli ingredienti in Dispensa, prima quelle che usano cose in scadenza. Sale, olio e spezie non contano.</p>` : ''}
    <div class="accordion-body">${cards || (pantryMode
      ? '<p class="pantry-mode-empty">Nessuna ricetta si fa con quello che c\'è in Dispensa. Aggiungi quello che hai in casa, o togli qualche filtro.</p>'
      : '<p style="color:var(--sage);font-size:13px;">Nessuna ricetta corrisponde ai filtri.</p>')}</div>
    ${renderRecipeEditModal()}
    ${newRecipeModal}
    ${recipeDetailScreen}
    ${prepSwitch}
    <div class="buttons-fixed">
      <button class="btn is-fixed" id="prep-fab" type="button" aria-label="Aggiungi ricetta"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M228 128a12 12 0 0 1-12 12h-76v76a12 12 0 0 1-24 0v-76H40a12 12 0 0 1 0-24h76V40a12 12 0 0 1 24 0v76h76a12 12 0 0 1 12 12"></path></svg></button>
    </div>
  `;
}

// Scadenze in Dispensa: data facoltativa per voce (pantryItems[key].scadenza,
// "AAAA-MM-GG"). Conta solo finché la voce ha scorta. Entro EXPIRY_SOON_DAYS
// la voce compare anche in "In scadenza" in cima alla Dispensa.
const EXPIRY_SOON_DAYS = 3;
function daysUntilDate(iso){
  if(!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  if(!y || !m || !d) return null;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((new Date(y, m - 1, d) - today) / 86400000);
}
function addDaysIso(days){
  const d = new Date();
  d.setDate(d.getDate() + days);
  return isoLocalDate(d);
}
function pantryExpiryDays(it){
  return it && typeof it.qty === 'number' && it.qty > 0 ? daysUntilDate(it.scadenza) : null;
}
// Scadenza stimata per i freschi che entrano in Dispensa dalla Spesa, in
// giorni da oggi, per reparto: una stima prudente per la confezione tipica,
// da confermare o correggere subito (vedi renderExpiryConfirmModal). Niente
// stima per il resto (pasta, conserve, surgelati...) né per ciò che sta in freezer.
// Pane: a cena ogni giorno e anche a pranzo sabato e domenica si mangia
// pane (BREAD_PER_MEAL panini, nella finestra si cambia con + e −);
// un pasto non impostato non conta. Si toglie dalla Dispensa quando il pasto
// si segna come mangiato, così la voce "Pane" dice quando sta finendo (a 0
// finisce in Spesa tra i Finiti, come il resto). Conta solo una voce a pezzi:
// in grammi o "solo presenza" non si saprebbe quanto togliere.
const BREAD_NAMES = ['Pane', 'Panini', 'Panino'];
const BREAD_PER_MEAL = 1;
function mealHasBread(i, meal){
  return meal === 'cena' || (meal === 'pranzo' && (Number(i) === 5 || Number(i) === 6));
}
function breadPantryItem(){
  let fallback = null;
  for(const n of BREAD_NAMES){
    const it = resolvePantryItem(n);
    if(!it) continue;
    if(typeof it.qty === 'number' && it.qty > 0) return it;
    if(!fallback) fallback = it;
  }
  return fallback;
}
function breadCountable(it){ return !!(it && (it.unit || '') === '' ); }
// Il pane è già tra gli ingredienti della ricetta (es. "uovo/pane"): lo conta la ricetta.
function recipeListsBread(ingredients){
  const bread = breadPantryItem();
  // Anche "Pane casereccio", "Panini al latte"... (non pangrattato né pan di Spagna).
  return ingredients.some(it => (bread && resolvePantryItem(it.ingrediente) === bread) || /^(pane|panini|panino)\b/i.test((it.ingrediente || '').trim()));
}
// Pane da comprare: 1 panino per ogni pasto col pane ancora da mangiare (da
// oggi in poi, settimane in più comprese; solo pasti impostati e non ancora
// segnati), meno quelli già in Dispensa. Una riga sola in Spesa: la chiave
// cambia col numero, così dopo aver comprato meno del necessario (o se il menù
// cambia) la riga torna per il resto, anche se quella di prima era spuntata.
function breadMealsAhead(){
  let count = 0;
  const startPos = findTodayPos() ?? 0;
  const weeks = [0, ...state.extraWeeks.map((_,n)=>n+1)];
  weeks.forEach(weekIdx=>{
    const done = weekMealsDoneRef(weekIdx);
    WEEK_DISPLAY_ORDER.forEach((i, pos)=>{
      if(weekIdx === 0 && pos < startPos) return;
      ['pranzo','cena'].forEach(meal=>{
        if(!mealHasBread(i, meal)) return;
        if(weekIdx === 0 && pos === startPos && meal === 'pranzo' && isTodayLunchPast()) return;
        if(done[i] && done[i][meal]) return;
        if(effectiveMeal(weekIdx, i, meal).principale) count++;
      });
    });
  });
  return count;
}
function breadShopNeed(){
  const it = breadPantryItem();
  if(it && !breadCountable(it)) return null;
  const meals = breadMealsAhead();
  const have = it && typeof it.qty === 'number' ? Math.max(0, it.qty) : 0;
  const need = meals * BREAD_PER_MEAL - have;
  if(need <= 0) return null;
  return { key: `bread_${need}`, nome: it ? it.nome : 'Pane', need, meals };
}
const EXPIRY_BANNER_KEY = 'cookpop-expiry-banner-closed';
function expiryBannerDismissedToday(){
  try{ return localStorage.getItem(EXPIRY_BANNER_KEY) === isoLocalDate(new Date()); }catch(e){ return false; }
}
function takeBread(n){
  const it = breadPantryItem();
  if(!n || !breadCountable(it) || !(it.qty > 0)) return null;
  const prev = it.qty;
  it.qty = Math.max(0, prev - n);
  return { it, prev };
}
const EXPIRY_ESTIMATE_DAYS = { verdura:5, carne:2, pesce:2, latticini:5, uova:21 };
function estimateExpiryDays(it){
  if(!it || it.luogo === 'freezer') return null;
  const dept = knownDept(it.cat) || classifyDept(it.nome);
  return EXPIRY_ESTIMATE_DAYS[dept] ?? null;
}
// Finestra "Scadenze stimate": una riga per fresco appena spostato in
// Dispensa, con la data stimata già salvata. − e + la spostano di un giorno,
// "Nessuna" la toglie (e "Stima" la rimette); "Va bene" chiude e basta.
function expiryConfirmKeys(){
  // Dopo "Annulla" la voce sparisce o torna senza scorta: non c'è più niente da confermare.
  return state.expiryConfirm.filter(k => state.pantryItems[k] && state.pantryItems[k].qty > 0);
}
function closeExpiryConfirm(){ state.expiryConfirm = []; }
function renderExpiryConfirmModal(){
  const keys = expiryConfirmKeys();
  if(!keys.length) return '';
  const rows = keys.map(k=>{
    const it = state.pantryItems[k];
    const days = it.scadenza ? daysUntilDate(it.scadenza) : null;
    const [y, m, d] = (it.scadenza || '').split('-').map(Number);
    const dateLabel = it.scadenza ? new Date(y, m - 1, d).toLocaleDateString('it-IT', { weekday:'short', day:'numeric', month:'short' }) : '';
    const when = days === null ? 'Nessuna scadenza' : days <= 0 ? 'Oggi' : days === 1 ? 'Domani' : `Tra ${days} giorni`;
    return `<div class="exp-confirm-row">
      <div class="exp-confirm-info">
        <div class="exp-confirm-name">${escapeHtml(it.nome)}</div>
        <div class="exp-confirm-when">${when}${dateLabel ? ` · ${escapeHtml(dateLabel)}` : ''}</div>
      </div>
      ${it.scadenza ? `<div class="qty-stepper exp-confirm-stepper">
        <button type="button" class="btn is-icon" data-exp-confirm-shift="${escapeAttr(k)}" data-exp-shift="-1" aria-label="Un giorno prima"${days !== null && days <= 0 ? ' disabled' : ''}>−</button>
        <button type="button" class="btn is-icon" data-exp-confirm-shift="${escapeAttr(k)}" data-exp-shift="1" aria-label="Un giorno dopo">+</button>
      </div>
      <button type="button" class="btn is-text exp-confirm-toggle" data-exp-confirm-toggle="${escapeAttr(k)}">Nessuna</button>`
      : `<button type="button" class="btn is-text exp-confirm-toggle" data-exp-confirm-toggle="${escapeAttr(k)}">Stima</button>`}
    </div>`;
  }).join('');
  return `
    <div class="filters-modal-backdrop is-second" data-exp-confirm-close>
      <div class="filters-modal" data-stop-close>
        <div class="filters-modal-header">
          <h3>Scadenze stimate</h3>
          <button class="btn is-icon filters-close-btn" data-exp-confirm-close>✕</button>
        </div>
        <p class="exp-confirm-sub">${keys.length > 1 ? 'Ho stimato le scadenze di quello che hai appena comprato. Vanno bene o le sistemi?' : 'Ho stimato la scadenza di quello che hai appena comprato. Va bene o la sistemi?'}</p>
        <div class="exp-confirm-list">${rows}</div>
        <div class="filters-modal-footer">
          <button class="btn is-solid" type="button" data-exp-confirm-close>Va bene</button>
        </div>
      </div>
    </div>`;
}
function expiryBadgeHtml(days, iso){
  if(days === null) return '';
  const [y, m, d] = iso.split('-');
  let text, level;
  if(days < 0){ text = days === -1 ? 'Scaduto ieri' : 'Scaduto'; level = 'is-expired'; }
  else if(days === 0){ text = 'Scade oggi'; level = 'is-expired'; }
  else if(days === 1){ text = 'Scade domani'; level = 'is-soon'; }
  else if(days <= EXPIRY_SOON_DAYS){ text = `Scade tra ${days} giorni`; level = 'is-soon'; }
  else if(days <= 7){ text = `Scade tra ${days} giorni`; level = 'is-later'; }
  else { text = `Scad. ${d}/${m}`; level = 'is-later'; }
  return `<span class="exp-badge ${level}">${text}</span>`;
}

// --- Scheda ingrediente ------------------------------------------------------
// Una pagina sola per aggiungere e modificare un ingrediente (o un prodotto
// di casa): in cima nome, quantità, luogo e scadenza, che si usano di più;
// categoria e gruppo come righe che si aprono in un elenco; unità, "Unisci
// con…" ed Elimina sotto "Altro". Il pulsante in fondo resta sempre visibile.
const UNIT_SHORT = { '':'pezzi', g:'g', kg:'kg', ml:'ml', l:'l', none:"solo c'è / non c'è" };
function newPantryDraft(home){
  return { nome:'', qty:1, luogo:'dispensa', unit:'', cat:'', group:'', scadenza:'', home: !!home };
}
function sheetIsHome(it, isNew){
  return isNew ? !!it.home : isNonFoodDept(knownDept(it.cat) || classifyDept(it.nome));
}
// Categoria mostrata: quella scelta, o quella automatica dal nome (un
// prodotto di casa non riconosciuto va in Casa › Altro, come alla conferma).
function sheetDept(it, home){
  const auto = classifyDept(it.nome || '');
  return knownDept(it.cat) || (home && !isNonFoodDept(auto) ? 'altro-casa' : auto);
}
function sheetDeptLabelHtml(it, home){
  const d = sheetDept(it, home);
  return `${DEPT_ICON[d] || ''} ${escapeHtml(DEPT_LABEL[d] || '')}${knownDept(it.cat) ? '' : ' <span class="sheet-hint-inline">automatica</span>'}`;
}
// Pagine a tutto schermo (scheda ingrediente, categorie, gruppi, ingredienti):
// l'animazione di apertura solo la prima volta che una pagina compare, non a
// ogni render (aprire un elenco al suo interno la faceva ripartire).
let shownPages = new Set(), shownPagesNext = new Set();
function pageEntering(key){
  shownPagesNext.add(key);
  return !shownPages.has(key);
}
function endPageRender(){
  shownPages = shownPagesNext;
  shownPagesNext = new Set();
}
const BACK_ICON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 256 256" width="100%" height="100%"><path fill="currentColor" d="M165.66 202.34a8 8 0 0 1-11.32 11.32l-80-80a8 8 0 0 1 0-11.32l80-80a8 8 0 0 1 11.32 11.32L91.31 128Z"></path></svg>';
// Guscio comune: intestazione con freccia Indietro, corpo, piede opzionale.
function managePageHtml({ key, title, closeAttr, body, footer, action, extraClass }){
  return `
  <div class="sheet-page${extraClass ? ' ' + extraClass : ''}${pageEntering(key) ? ' is-entering' : ''}" data-page="${escapeAttr(key)}">
    <header class="settings-header">
      <button class="btn is-icon settings-back" type="button" ${closeAttr} aria-label="Indietro">${BACK_ICON_SVG}</button>
      <h2 class="settings-title">${title}</h2>
      ${action || ''}
    </header>
    <div class="settings-body sheet-body">${body}</div>
    ${footer ? `<div class="sheet-footer">${footer}</div>` : ''}
  </div>`;
}
// Aggiungi in Dispensa: il nome può essere di una voce che c'è già (anche
// finita). Scelta dai suggerimenti, la bozza prende luogo, unità, categoria,
// gruppo e scadenza di quella voce, e "Aggiungi" ne aumenta la quantità.
function existingPantryFor(nome){
  return state.pantryItems[(nome || '').trim().toLowerCase()] || null;
}
function pantryHaveHintHtml(nome){
  const ex = existingPantryFor(nome);
  if(!ex) return '';
  const q = typeof ex.qty === 'number' ? ex.qty : 0;
  const txt = q <= 0 ? 'finito' : ex.unit === 'none' ? 'ce l\'hai già' : `ne hai già ${q}${ex.unit && ex.unit !== 'none' ? ' ' + (UNIT_SHORT[ex.unit] || ex.unit) : ''}`;
  return `<span class="sheet-hint-inline sheet-have-hint">${escapeHtml(txt.charAt(0).toUpperCase() + txt.slice(1))}</span>`;
}
function fillDraftFromPantry(d, nome){
  const ex = existingPantryFor(nome);
  d.nome = ex ? ex.nome : nome;
  if(!ex) return;
  d.luogo = ex.luogo || 'dispensa';
  d.unit = ex.unit || '';
  d.cat = ex.cat || '';
  d.group = ex.group || '';
  d.scadenza = (typeof ex.qty === 'number' && ex.qty > 0 && ex.scadenza) || '';
  if(d.unit === 'none') d.qty = 1;
  d.home = isNonFoodDept(knownDept(d.cat) || classifyDept(d.nome));
}
function pantryAddSuggestions(q){
  q = (q || '').trim().toLowerCase();
  if(!q) return [];
  const rank = n => n.toLowerCase().startsWith(q) ? 0 : 1;
  const inPantry = Object.values(state.pantryItems).map(it => it.nome).filter(n => n && n.toLowerCase().includes(q));
  const seen = new Set(inPantry.map(n => n.toLowerCase()));
  const others = allKnownIngredientNames().filter(n => n.toLowerCase().includes(q) && !seen.has(n.toLowerCase()));
  const sort = arr => arr.sort((a, b) => rank(a) - rank(b) || IT_COLLATOR.compare(a, b));
  return sort(inPantry).concat(sort(others)).slice(0, 8);
}
function renderIngredientSheet(it, isNew){
  const sheetKey = 'sheet-' + (isNew ? 'new' : state.pantryEditKey);
  const entering = pageEntering(sheetKey);
  const home = sheetIsHome(it, isNew);
  const noun = home ? 'prodotto' : 'ingrediente';
  const unit = it.unit || '';
  const picker = state.pantrySheetPicker;
  const closeAttr = isNew ? 'data-close-pantry-add-modal' : 'data-close-pantry-edit';
  const qtyHtml = unit === 'none'
    ? `<label class="sheet-presence"><input type="checkbox" data-sheet-presence ${it.qty > 0 ? 'checked' : ''}> In casa</label>`
    : `<span class="qty-stepper sheet-stepper">
        <button class="qty-btn" type="button" data-sheet-qty="-1" aria-label="Diminuisci">−</button>
        <input type="number" inputmode="decimal" min="0" step="${qtyStepFor(unit)}" class="qty-input" id="pantry-edit-qty" value="${it.qty}" aria-label="Quantità">
        <button class="qty-btn" type="button" data-sheet-qty="1" aria-label="Aumenta">+</button>
        <span class="sheet-unit">${escapeHtml(UNIT_SHORT[unit] || unit)}</span>
      </span>`;
  const luoghi = LUOGO_ORDER.map(l=>`<button type="button" class="sheet-luogo${(it.luogo||'dispensa')===l?' active':''}" data-sheet-luogo="${l}" aria-pressed="${(it.luogo||'dispensa')===l}"><span class="sheet-luogo-icon">${LUOGO_ICON[l]}</span><span>${escapeHtml(LUOGO_LABEL[l])}</span></button>`).join('');
  const days = it.scadenza ? daysUntilDate(it.scadenza) : null;
  const scadenzaHtml = home ? '' : `
        <div class="settings-field">
          <div class="settings-field-label">Scadenza ${it.scadenza ? expiryBadgeHtml(days, it.scadenza) : '<span class="sheet-hint-inline">nessuna</span>'}</div>
          <div class="chip-row scadenza-quick">
            <button type="button" class="btn is-chip${it.scadenza ? '' : ' active'}" data-scadenza-clear>Nessuna</button>
            <button type="button" class="btn is-chip" data-scadenza-quick="3">+3 giorni</button>
            <button type="button" class="btn is-chip" data-scadenza-quick="7">+1 settimana</button>
            <button type="button" class="btn is-chip" data-scadenza-quick="30">+1 mese</button>
            <label class="btn is-chip sheet-date-chip">📅 Data…<input type="date" id="pantry-edit-scadenza" value="${escapeAttr(it.scadenza || '')}" aria-label="Scegli la data di scadenza"></label>
          </div>
        </div>`;
  // Righe che si aprono in un elenco (categoria, gruppo), una alla volta.
  const pickRow = (key, label, valueHtml) => `
        <button type="button" class="sheet-row" data-sheet-picker="${key}" aria-expanded="${picker === key}">
          <span class="sheet-row-label">${label}</span>
          <span class="sheet-row-value" ${key === 'cat' ? 'id="sheet-cat-value"' : ''}>${valueHtml}</span>
          <span class="sheet-row-chevron" aria-hidden="true">${picker === key ? '▴' : '▾'}</span>
        </button>`;
  const deptList = DEPT_ORDER.filter(d => d !== 'finiti' && d !== 'avanzi' && (home ? isNonFoodDept(d) : !isNonFoodDept(d)))
    .sort((a, b) => IT_COLLATOR.compare(DEPT_LABEL[a], DEPT_LABEL[b]));
  const autoDept = classifyDept(it.nome || '');
  const catPicker = picker !== 'cat' ? '' : `
        <div class="sheet-options" role="listbox" aria-label="Categoria">
          <button type="button" class="sheet-option${it.cat ? '' : ' active'}" data-sheet-cat="">✨ Automatica <span class="sheet-hint-inline">(${escapeHtml(DEPT_LABEL[home && !isNonFoodDept(autoDept) ? 'altro-casa' : autoDept])})</span></button>
          ${deptList.map(d => `<button type="button" class="sheet-option${it.cat === d ? ' active' : ''}" data-sheet-cat="${d}">${DEPT_ICON[d]} ${escapeHtml(DEPT_LABEL[d])}</button>`).join('')}
          <button type="button" class="sheet-option is-muted" data-sheet-cat="${home ? 'altro' : 'altro-casa'}">↔ ${home ? 'È un alimento (sposta in Cibo)' : 'È un prodotto per la casa (sposta in Casa)'}</button>
          <button type="button" class="sheet-option is-link" data-open-depts>🏷️ Gestisci categorie…</button>
        </div>`;
  const groups = Object.entries(state.pantryGroups);
  const groupPicker = picker !== 'group' ? '' : `
        <div class="sheet-options" role="listbox" aria-label="Gruppo">
          <button type="button" class="sheet-option${it.group ? '' : ' active'}" data-sheet-group="">Nessuno</button>
          ${groups.map(([id, g]) => `<button type="button" class="sheet-option${it.group === id ? ' active' : ''}" data-sheet-group="${escapeAttr(id)}">${escapeHtml(g.label)}</button>`).join('')}
          <button type="button" class="sheet-option is-link" data-open-pantry-groups>🗂️ Gestisci gruppi…</button>
        </div>`;
  const units = home ? HOME_UNITS.concat(unit && !HOME_UNITS.includes(unit) ? [unit] : []) : UNIT_ORDER;
  const more = !!state.pantrySheetMore;
  return `
  <div class="sheet-page${entering ? ' is-entering' : ''}" data-sheet-page>
    <header class="settings-header">
      <button class="btn is-icon settings-back" type="button" ${closeAttr} aria-label="Indietro"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 256 256" width="100%" height="100%"><path fill="currentColor" d="M165.66 202.34a8 8 0 0 1-11.32 11.32l-80-80a8 8 0 0 1 0-11.32l80-80a8 8 0 0 1 11.32 11.32L91.31 128Z"></path></svg></button>
      <h2 class="settings-title">${isNew ? (existingPantryFor(it.nome) ? `Aggiungi ${noun}` : `Nuovo ${noun}`) : `Modifica ${noun}`}</h2>
    </header>
    <div class="settings-body sheet-body">
      <section class="settings-section">
        <div class="settings-card">
          ${isNew ? '<div class="add-ing-combo">' : ''}<input type="text" class="sheet-name" id="${isNew ? 'pantry-add-name' : 'pantry-edit-name'}" value="${escapeAttr(it.nome)}" placeholder="${home ? 'Es. Detersivo piatti' : 'Es. Zucchine'}" aria-label="Nome" autocomplete="off">${isNew ? '<div class="add-ing-suggestions" id="pantry-add-suggest"></div></div>' : ''}
          <div class="settings-field sheet-qty-row">
            <div class="settings-field-label">${unit === 'none' ? 'Ce l\'hai?' : (isNew && existingPantryFor(it.nome) ? 'Quanto ne aggiungi' : 'Quantità')}${isNew ? pantryHaveHintHtml(it.nome) : ''}</div>
            ${qtyHtml}
          </div>
          <div class="settings-field">
            <div class="settings-field-label">Dove sta</div>
            <div class="sheet-luoghi">${luoghi}</div>
          </div>
          ${scadenzaHtml}
        </div>
      </section>
      <section class="settings-section">
        <div class="settings-card sheet-rows">
          ${pickRow('cat', 'Categoria', sheetDeptLabelHtml(it, home))}
          ${catPicker}
          ${home ? '' : pickRow('group', 'Gruppo', it.group && state.pantryGroups[it.group] ? escapeHtml(state.pantryGroups[it.group].label) : '<span class="sheet-hint-inline">nessuno</span>')}
          ${groupPicker}
        </div>
        ${home ? '' : '<p class="settings-note">Il gruppo unisce più formati (es. Fusilli e Penne in "Pasta corta"): una ricetta che chiede pasta corta li trova tutti.</p>'}
      </section>
      <section class="settings-section">
        <button type="button" class="sheet-more-toggle" data-sheet-more aria-expanded="${more}">Altro ${more ? '▴' : '▾'}</button>
        ${more ? `
        <div class="settings-card">
          <div class="settings-field">
            <div class="settings-field-label">Unità</div>
            <div class="chip-row">${units.map(u => `<button type="button" class="btn is-chip${unit === u ? ' active' : ''}" data-sheet-unit="${u}">${escapeHtml(UNIT_SHORT[u] || u)}</button>`).join('')}</div>
            <p class="settings-card-text">${home ? 'Pezzi per contarli, oppure solo se ce l\'hai o no.' : 'Serve a capire se ne hai abbastanza per una ricetta (es. 500 g di pasta).'}</p>
          </div>
          ${isNew ? '' : `
          <div class="settings-field">
            <button type="button" class="btn is-outline is-block" data-open-merge="${escapeAttr(it.nome)}">🔗 Unisci con un doppione…</button>
            <button type="button" class="btn is-outline is-block color-delete" id="pantry-edit-delete">Elimina dalla Dispensa</button>
          </div>`}
        </div>` : ''}
      </section>
    </div>
    <div class="sheet-footer">
      ${isNew
        ? `<button class="btn is-solid is-block" id="pantry-add-btn" type="button">Aggiungi</button>`
        : `<button class="btn is-solid is-block" type="button" data-close-pantry-edit>Fatto</button>`}
    </div>
  </div>`;
}

// --- Gestisci categorie ------------------------------------------------------
// Un elenco da leggere (emoji, nome, quante voci in Dispensa); un tocco apre
// la modifica dentro la riga stessa. Le modifiche stanno in una bozza
// (state.deptDraft) finché non si preme Salva, così un render non le perde.
function deptItemCount(id){
  return Object.values(state.pantryItems).filter(it => typeof it.qty === 'number' && it.qty > 0 && (knownDept(it.cat) || classifyDept(it.nome)) === id).length;
}
function deptEditCardHtml(id){
  const d = state.deptDraft || {};
  const isNew = id === 'new';
  const isBase = !isNew && !!BASE_DEPT_LABEL[id];
  const customized = isBase && state.customDepts && state.customDepts[id];
  return `
      <div class="manage-edit" data-dept-edit-card="${escapeAttr(id)}">
        <div class="manage-edit-row">
          <input type="text" class="dept-icon-input" id="dept-edit-icon" value="${escapeAttr(d.icon || '')}" placeholder="🏷️" aria-label="Emoji" autocomplete="off">
          <input type="text" id="dept-edit-label" value="${escapeAttr(d.label || '')}" placeholder="${escapeAttr(isBase ? BASE_DEPT_LABEL[id] : 'Nome (es. Animali)')}" aria-label="Nome" autocomplete="off">
        </div>
        ${isBase ? '' : `<div class="chip-row">
          <button type="button" class="btn is-chip${d.nonFood ? '' : ' active'}" data-dept-draft-type="cibo">Cibo</button>
          <button type="button" class="btn is-chip${d.nonFood ? ' active' : ''}" data-dept-draft-type="casa">Casa</button>
        </div>`}
        <div class="manage-edit-actions">
          ${isNew ? '' : isBase
            ? (customized ? `<button type="button" class="btn is-text" data-dept-reset="${escapeAttr(id)}">Ripristina originale</button>` : '<span></span>')
            : `<button type="button" class="btn is-text color-delete" data-dept-delete="${escapeAttr(id)}">Elimina</button>`}
          <span class="manage-edit-buttons">
            <button type="button" class="btn is-outline" data-dept-edit-cancel>Annulla</button>
            <button type="button" class="btn is-solid" id="dept-edit-save">${isNew ? 'Aggiungi' : 'Salva'}</button>
          </span>
        </div>
      </div>`;
}
function renderDeptsPage(){
  const editing = state.deptEditId;
  const sorted = DEPT_ORDER.filter(d => d !== 'finiti').sort((a, b) => IT_COLLATOR.compare(DEPT_LABEL[a], DEPT_LABEL[b]));
  const row = id => editing === id ? deptEditCardHtml(id) : `
      <button type="button" class="manage-row" data-dept-edit="${escapeAttr(id)}">
        <span class="manage-row-icon">${DEPT_ICON[id] || ''}</span>
        <span class="manage-row-main">${escapeHtml(DEPT_LABEL[id])}${BASE_DEPT_LABEL[id] ? '' : ' <span class="manage-tag">tua</span>'}</span>
        <span class="manage-row-side">${(n => n ? `${n} in Dispensa` : '')(deptItemCount(id))}</span>
        <span class="manage-row-chevron" aria-hidden="true">›</span>
      </button>`;
  const section = (title, ids) => `
      <section class="settings-section">
        <h3 class="settings-section-title">${title}</h3>
        <div class="settings-card manage-list">${ids.map(row).join('')}</div>
      </section>`;
  const body = `
      <p class="settings-note manage-intro">Sono i reparti della Spesa e le sezioni della Dispensa. Tocca una categoria per cambiarle nome o emoji.</p>
      <section class="settings-section">
        ${editing === 'new' ? `<div class="settings-card">${deptEditCardHtml('new')}</div>` : `<button type="button" class="btn is-outline is-block" data-dept-edit="new">+ Nuova categoria</button>`}
      </section>
      ${section('Cibo', sorted.filter(d => !isNonFoodDept(d)))}
      ${section('Casa', sorted.filter(isNonFoodDept))}`;
  return managePageHtml({ key: 'depts', title: 'Categorie', closeAttr: 'data-close-depts', body });
}

// --- Gestisci gruppi ---------------------------------------------------------
// Ogni gruppo mostra i formati che contiene; un tocco apre la modifica nella
// riga: nome, nome nelle ricette (di solito uguale, si aggiorna da solo),
// categoria suggerita, formati da aggiungere o togliere.
function groupMembers(id){
  return Object.entries(state.pantryItems).filter(([, it]) => it.group === id).sort((a, b) => IT_COLLATOR.compare(a[1].nome, b[1].nome));
}
function groupEditCardHtml(id){
  const g = state.groupDraft || {};
  const isNew = id === 'new';
  const members = isNew ? [] : groupMembers(id);
  const q = (state.groupMemberSearch || '').trim().toLowerCase();
  const candidates = !q ? [] : Object.entries(state.pantryItems)
    .filter(([, it]) => it.group !== id && !isNonFoodDept(knownDept(it.cat) || classifyDept(it.nome)) && it.nome.toLowerCase().includes(q))
    .sort((a, b) => IT_COLLATOR.compare(a[1].nome, b[1].nome)).slice(0, 6);
  const exact = q && Object.values(state.pantryItems).some(it => it.nome.toLowerCase() === q);
  return `
      <div class="manage-edit" data-group-edit-card="${escapeAttr(id)}">
        <label class="manage-field"><span>Nome</span>
          <input type="text" id="group-edit-label" value="${escapeAttr(g.label || '')}" placeholder="Es. Pasta corta" autocomplete="off"></label>
        <label class="manage-field"><span>Nelle ricette si chiama</span>
          <input type="text" id="group-edit-match" value="${escapeAttr(g.matchName || '')}" placeholder="es. pasta corta" autocomplete="off"></label>
        <label class="manage-field"><span>Categoria suggerita</span>
          <select id="group-edit-cat"><option value="">Nessuna</option>${deptOptionsHtml(g.cat || '', 'cibo')}</select></label>
        ${isNew ? '' : `
        <div class="manage-field"><span>Formati nel gruppo</span>
          <div class="manage-members">
            ${members.length ? members.map(([key, it]) => `<span class="manage-member">${escapeHtml(it.nome)}<button type="button" data-group-member-remove="${escapeAttr(key)}" aria-label="Togli ${escapeAttr(it.nome)} dal gruppo">✕</button></span>`).join('') : '<span class="sheet-hint-inline">Nessun formato ancora.</span>'}
          </div>
          <input type="search" id="group-member-search" value="${escapeAttr(state.groupMemberSearch || '')}" placeholder="Aggiungi un formato (es. Fusilli)" autocomplete="off">
          ${q ? `<div class="manage-suggestions">
            ${candidates.map(([key, it]) => `<button type="button" class="btn is-chip" data-group-member-add="${escapeAttr(key)}">+ ${escapeHtml(it.nome)}</button>`).join('')}
            ${exact ? '' : `<button type="button" class="btn is-chip" data-group-member-new="${escapeAttr(state.groupMemberSearch.trim())}">+ «${escapeHtml(state.groupMemberSearch.trim())}»</button>`}
          </div>` : ''}
        </div>`}
        <div class="manage-edit-actions">
          ${isNew ? '<span></span>' : `<button type="button" class="btn is-text color-delete" data-group-delete="${escapeAttr(id)}">Elimina gruppo</button>`}
          <span class="manage-edit-buttons">
            <button type="button" class="btn is-outline" data-group-edit-cancel>${isNew ? 'Annulla' : 'Chiudi'}</button>
            <button type="button" class="btn is-solid" id="group-edit-save">${isNew ? 'Crea' : 'Salva'}</button>
          </span>
        </div>
      </div>`;
}
function renderGroupsPage(){
  const editing = state.groupEditId;
  const rows = Object.entries(state.pantryGroups).sort((a, b) => IT_COLLATOR.compare(a[1].label, b[1].label)).map(([id, g]) => {
    if(editing === id) return groupEditCardHtml(id);
    const members = groupMembers(id).map(([, it]) => it.nome);
    return `
      <button type="button" class="manage-row" data-group-edit="${escapeAttr(id)}">
        <span class="manage-row-icon">${g.cat && DEPT_ICON[g.cat] ? DEPT_ICON[g.cat] : '🗂️'}</span>
        <span class="manage-row-main">${escapeHtml(g.label)}
          <span class="manage-row-sub">${members.length ? escapeHtml(members.join(', ')) : 'nessun formato ancora'}</span></span>
        <span class="manage-row-chevron" aria-hidden="true">›</span>
      </button>`;
  }).join('');
  const body = `
      <p class="settings-note manage-intro">Un gruppo unisce più formati sotto il nome che usano le ricette: se hai Fusilli o Penne, una ricetta che chiede "pasta corta" risulta in casa.</p>
      <section class="settings-section">
        ${editing === 'new' ? `<div class="settings-card">${groupEditCardHtml('new')}</div>` : `<button type="button" class="btn is-outline is-block" data-group-edit="new">+ Nuovo gruppo</button>`}
      </section>
      <section class="settings-section">
        <div class="settings-card manage-list">${rows || '<p class="settings-card-text">Nessun gruppo.</p>'}</div>
      </section>`;
  return managePageHtml({ key: 'groups', title: 'Gruppi', closeAttr: 'data-close-pantry-groups', body });
}

// --- Gestisci ingredienti ----------------------------------------------------
// Tutti gli ingredienti noti (Dispensa, ricette, Spesa a mano), divisi per
// categoria, con filtro Tutti / In Dispensa / Non in Dispensa. Un tocco apre
// la scheda sopra l'elenco: tornando indietro si ritrova l'elenco com'era.
function renderIngredientManagerPage(){
  const search = (state.ingredientManagerSearch || '').trim().toLowerCase();
  const filter = state.ingredientManagerFilter || 'tutti';
  const inStock = name => { const it = state.pantryItems[name.trim().toLowerCase()]; return !!(it && typeof it.qty === 'number' && it.qty > 0); };
  const names = allIngredientNamesForManager()
    .filter(n => !search || n.toLowerCase().includes(search))
    .filter(n => filter === 'tutti' || (filter === 'casa' ? inStock(n) : !inStock(n)));
  const byDept = {};
  names.forEach(n => {
    const it = state.pantryItems[n.trim().toLowerCase()];
    const d = knownDept(it && it.cat) || classifyDept(n);
    (byDept[d] = byDept[d] || []).push(n);
  });
  const depts = Object.keys(byDept).sort((a, b) => (isNonFoodDept(a) - isNonFoodDept(b)) || IT_COLLATOR.compare(DEPT_LABEL[a] || a, DEPT_LABEL[b] || b));
  const rowHtml = name => {
    const it = state.pantryItems[name.trim().toLowerCase()];
    const status = inStock(name) ? `${it.qty}${it.unit && it.unit !== 'none' ? ' ' + it.unit : ''} · ${LUOGO_LABEL[it.luogo || 'dispensa']}` : '';
    return `
        <button type="button" class="manage-row" data-manage-ingredient="${escapeAttr(name)}">
          <span class="manage-row-main">${escapeHtml(name)}</span>
          <span class="manage-row-side">${escapeHtml(status)}</span>
          <span class="manage-row-chevron" aria-hidden="true">›</span>
        </button>`;
  };
  const filters = [['tutti', 'Tutti'], ['casa', 'In Dispensa'], ['no', 'Non in Dispensa']];
  const body = `
      <div class="manage-toolbar">
        <div class="search-field">
          <input class="input-search" type="search" id="ingredient-manager-search" placeholder="Cerca ingrediente…" value="${escapeAttr(state.ingredientManagerSearch || '')}" autocomplete="off">
          ${state.ingredientManagerSearch ? `<button type="button" class="search-clear" id="ingredient-manager-search-clear" aria-label="Cancella ricerca">${CLEAR_ICON_SVG}</button>` : ''}
        </div>
        <div class="chip-row">${filters.map(([v, l]) => `<button type="button" class="btn is-chip${filter === v ? ' active' : ''}" data-ingredient-filter="${v}">${l}</button>`).join('')}</div>
      </div>
      ${depts.length ? depts.map(d => `
      <section class="settings-section">
        <h3 class="settings-section-title">${DEPT_ICON[d] || ''} ${escapeHtml(DEPT_LABEL[d] || d)} <span class="manage-count">${byDept[d].length}</span></h3>
        <div class="settings-card manage-list">${byDept[d].sort((a, b) => IT_COLLATOR.compare(a, b)).map(rowHtml).join('')}</div>
      </section>`).join('') : '<p class="settings-note">Nessun ingrediente trovato.</p>'}`;
  return managePageHtml({ key: 'ingredients', title: 'Ingredienti', closeAttr: 'data-close-ingredient-manager', body });
}

// --- Inventario veloce -------------------------------------------------------
// Il "giro della casa" per riempire la Dispensa in una volta: tutti gli
// ingredienti noti (ricette, Dispensa, spesa di ogni settimana), divisi per
// categoria, con "Sì / No" e, per il sì, quantità e luogo sulla stessa riga.
// Ogni risposta si applica subito alla Dispensa, quindi si può smettere e
// riprendere quando si vuole: le risposte date (solo per sapere cosa resta
// "da fare") restano in questo telefono, in localStorage.
const INVENTORY_KEY = 'cookpop-inventory-answers';
function inventoryAnswers(){
  if(!state.inventoryAnswered){
    try{ state.inventoryAnswered = JSON.parse(localStorage.getItem(INVENTORY_KEY) || '{}') || {}; }
    catch(e){ state.inventoryAnswered = {}; }
  }
  return state.inventoryAnswered;
}
function saveInventoryAnswers(){
  try{ localStorage.setItem(INVENTORY_KEY, JSON.stringify(state.inventoryAnswered || {})); }catch(e){}
}
const LUOGO_BY_DEPT = { verdura:'frigo', carne:'frigo', salumi:'frigo', pesce:'frigo', latticini:'frigo', surgelati:'freezer' };
// Dove sta di solito: conserve e secchi in dispensa anche se di pesce o
// legumi (tonno in scatola, ceci secchi), il fresco in frigo, i surgelati in freezer.
function inventoryGuessLuogo(name, dept){
  if(/scatol|secch|barattol|vasett|sott'?olio|conserv|in brick|uht|polvere|liofilizz/i.test(name)) return 'dispensa';
  if(/surgelat|congelat/i.test(name)) return 'freezer';
  return LUOGO_BY_DEPT[dept] || 'dispensa';
}
function inventoryDept(name){
  const it = state.pantryItems[name.trim().toLowerCase()];
  return knownDept(it && it.cat) || classifyDept(name);
}
function inventoryNames(){
  return allIngredientNamesForManager().filter(n => !isNonFoodDept(inventoryDept(n)));
}
// Quantità proposta al primo "Sì": un pacco tipico per chi si misura in
// grammi/millilitri, uno per il resto. Si corregge subito con − e +.
function inventoryDefaultQty(unit){
  if(unit === 'g') return 500;
  if(unit === 'ml') return 1000;
  if(unit === 'kg' || unit === 'l') return 1;
  return 1;
}
// Sì: la voce entra (o resta) in Dispensa e la riga si apre per quantità,
// unità e luogo; si chiude, e sparisce da "Da fare", con OK. No: chiude
// subito. Quello che è già in Dispensa parte già aperto col Sì e i suoi
// dati, da confermare con OK o correggere.
function inventorySetHas(name, has){
  const key = name.trim().toLowerCase();
  const answers = inventoryAnswers();
  const it = state.pantryItems[key];
  if(has){
    const dept = inventoryDept(name);
    const unit = it ? (it.unit || '') : (PANTRY_UNIT_BY_NAME[key] || '');
    if(!(it && typeof it.qty === 'number' && it.qty > 0)){
      upsertPantryItem(name, (it && it.luogo) || inventoryGuessLuogo(name, dept), unit === 'none' ? 1 : inventoryDefaultQty(unit), unit, (it && it.cat) || dept);
    }
    delete state.shopDismissed['oos_' + key];
    delete answers[key];
    state.inventoryKeep[key] = true;
  } else {
    // Era in Dispensa e non c'è più: a 0, senza farlo comparire tra i
    // "Finiti" in Spesa (è un inventario, non una lista della spesa).
    if(it && typeof it.qty === 'number' && it.qty > 0){
      it.qty = 0;
      state.shopDismissed['oos_' + key] = true;
    }
    answers[key] = 'no';
    delete state.inventoryKeep[key];
  }
  saveInventoryAnswers();
}
function inventoryConfirm(name){
  const key = name.trim().toLowerCase();
  inventoryAnswers()[key] = 'si';
  delete state.inventoryKeep[key];
  saveInventoryAnswers();
}
function renderInventoryPage(){
  const answers = inventoryAnswers();
  const names = inventoryNames();
  const search = (state.inventorySearch || '').trim().toLowerCase();
  const filter = state.inventoryFilter || 'todo';
  const answerOf = n => answers[n.trim().toLowerCase()];
  const inStock = n => { const it = state.pantryItems[n.trim().toLowerCase()]; return !!(it && typeof it.qty === 'number' && it.qty > 0); };
  const done = names.filter(n => answerOf(n)).length;
  const shown = names
    .filter(n => !search || n.toLowerCase().includes(search))
    .filter(n => filter === 'tutti' || (filter === 'si' ? inStock(n) : !answerOf(n)));
  const byDept = {};
  shown.forEach(n => { const d = inventoryDept(n); (byDept[d] = byDept[d] || []).push(n); });
  const depts = DEPT_ORDER.filter(d => byDept[d]).concat(Object.keys(byDept).filter(d => !DEPT_ORDER.includes(d)));
  const rowHtml = name => {
    const key = name.trim().toLowerCase();
    const it = state.pantryItems[key];
    const ans = answerOf(name);
    const has = ans !== 'no' && inStock(name);
    const open = has && ans !== 'si';
    const unit = it ? (it.unit || '') : '';
    const attr = `data-inv-name="${escapeAttr(name)}"`;
    const luogo = (it && it.luogo) || 'dispensa';
    const details = has ? `
        <div class="inv-q-details">
          ${unit === 'none' ? '<span class="inv-q-presence">In casa</span>' : `
          <span class="qty-stepper inv-q-stepper">
            <button class="qty-btn" type="button" data-inv-qty="-1" ${attr} aria-label="Diminuisci">−</button>
            <input type="number" inputmode="decimal" min="0" step="${qtyStepFor(unit)}" class="qty-input inv-q-qty" value="${it.qty}" data-inv-qty-input ${attr} aria-label="Quantità">
            <button class="qty-btn" type="button" data-inv-qty="1" ${attr} aria-label="Aumenta">+</button>
          </span>`}
          <select class="inv-q-unit" data-inv-unit ${attr} aria-label="Unità">
            ${UNIT_ORDER.map(u => `<option value="${u}" ${unit === u ? 'selected' : ''}>${escapeHtml(UNIT_SHORT[u] || u)}</option>`).join('')}
          </select>
          <span class="inv-q-luoghi" role="group" aria-label="Dove">
            ${LUOGO_ORDER.map(l => `<button type="button" class="btn is-icon inv-q-luogo${luogo === l ? ' active' : ''}" data-inv-luogo="${l}" ${attr} aria-label="${escapeAttr(LUOGO_LABEL[l])}" aria-pressed="${luogo === l}" title="${escapeAttr(LUOGO_LABEL[l])}">${LUOGO_ICON[l]}</button>`).join('')}
            <span class="inv-q-luogo-name">${escapeHtml(LUOGO_LABEL[luogo])}</span>
            ${open ? `<button type="button" class="btn is-solid inv-q-ok" data-inv-ok ${attr}>OK</button>` : ''}
          </span>
        </div>` : '';
    return `
      <div class="inv-q-row${ans ? ' is-answered' : ''}${open ? ' is-open' : ''}">
        <div class="inv-q-top">
          <span class="inv-q-name">${escapeHtml(name.charAt(0).toUpperCase() + name.slice(1))}</span>
          <span class="inv-q-answers">
            <button type="button" class="btn inv-q-btn${has ? ' active is-yes' : ''}" data-inv-has="1" ${attr} aria-pressed="${has}">Sì</button>
            <button type="button" class="btn inv-q-btn${ans === 'no' ? ' active is-no' : ''}" data-inv-has="0" ${attr} aria-pressed="${ans === 'no'}">No</button>
          </span>
        </div>
        ${details}
      </div>`;
  };
  const filters = [['todo', `Da fare (${names.length - done})`], ['si', 'Ce l\'ho'], ['tutti', 'Tutti']];
  const pct = names.length ? Math.round(done / names.length * 100) : 0;
  const body = `
      <div class="inv-q-progress">
        <div class="inv-q-progress-text"><b>${done}</b> su ${names.length} ingredienti · ${pct}%</div>
        <div class="inv-q-bar"><span style="width:${pct}%"></span></div>
        <p class="settings-note">Sì o No per ogni ingrediente. Col Sì scrivi quanto e scegli dove, poi OK: la riga sparisce da "Da fare". Quello che hai già in Dispensa parte coi suoi dati, basta controllare e dare OK. Si salva da solo.</p>
      </div>
      <div class="manage-toolbar">
        <div class="search-field">
          <input class="input-search" type="search" id="inventory-search" placeholder="Cerca ingrediente…" value="${escapeAttr(state.inventorySearch || '')}" autocomplete="off">
        </div>
        <div class="chip-row">${filters.map(([v, l]) => `<button type="button" class="btn is-chip${filter === v ? ' active' : ''}" data-inv-filter="${v}">${escapeHtml(l)}</button>`).join('')}</div>
      </div>
      ${depts.length ? depts.map(d => `
      <section class="settings-section">
        <h3 class="settings-section-title">${DEPT_ICON[d] || ''} ${escapeHtml(DEPT_LABEL[d] || d)} <span class="manage-count">${byDept[d].length}</span></h3>
        <div class="settings-card inv-q-list">${byDept[d].sort((a, b) => IT_COLLATOR.compare(a, b)).map(rowHtml).join('')}</div>
      </section>`).join('') : `<p class="settings-note">${filter === 'todo' && !search ? 'Fatto! Hai risposto per tutti gli ingredienti.' : 'Nessun ingrediente trovato.'}</p>`}`;
  return managePageHtml({ key: 'inventory', title: 'Inventario veloce', closeAttr: 'data-close-inventory', body });
}

function renderDispensa(){
  // Un'unica lista per dispensa/ripostiglio/frigo/freezer, distinti solo
  // dall'icona del luogo (si cambia toccandola). Si riempie da sola quando
  // si spunta un articolo in Spesa, e si modifica liberamente a mano. Una
  // voce senza quantità (0) non compare: la quantità è un contatore che si
  // vede solo una volta impostato.
  const searchTerm = state.pantrySearch.trim().toLowerCase();
  const items = Object.entries(state.pantryItems)
    .map(([key, it])=>({ key, nome: it.nome, qty: it.qty, unit: it.unit || '', luogo: it.luogo || 'dispensa', cat: it.cat, scadenza: it.scadenza || '' }))
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
    <div class="swipe-wrap" data-swipe-id="pantry:${escapeAttr(it.key)}" data-swipe-pantry="${escapeAttr(it.key)}">
    <button type="button" class="swipe-trash" tabindex="-1" aria-label="${escapeAttr(it.nome)}: finito">${TRASH_ICON_SVG}</button>
    <div class="inv-item swipe-content" data-pantry-row="${escapeAttr(it.key)}">
      <button class="btn is-icon luogo-picker-opt is-selected${isSelected ? ' picking' : ''}" data-luogo-value="${escapeAttr(LUOGO_LABEL[it.luogo])}" data-luogo-toggle="${escapeAttr(it.key)}" type="button" title="Luogo: ${escapeAttr(LUOGO_LABEL[it.luogo])} — tocca per scegliere">${luogoIconContent}</button>
      ${state.pantryLuogoPicker === it.key ? `
      <div class="luogo-picker-backdrop" data-luogo-picker-close></div>
      <div class="luogo-picker">
        ${LUOGO_ORDER.map(l=>`<button type="button" class="btn is-icon luogo-picker-opt${l===it.luogo?' active':''}" data-luogo-set="${escapeAttr(it.key)}" data-luogo-value="${l}" title="${escapeAttr(LUOGO_LABEL[l])}">${LUOGO_ICON[l]}</button>`).join('')}
      </div>` : ''}
      ${state.pantryFinishPicker === it.key ? `
      <div class="luogo-picker-backdrop" data-finish-picker-close></div>
      <div class="luogo-picker finish-picker" role="dialog" aria-label="${escapeAttr(it.nome)} è finito">
        <button type="button" class="btn is-icon luogo-picker-opt" data-finish-tolist="${escapeAttr(it.key)}" title="Aggiungi alla lista spesa" aria-label="Aggiungi alla lista spesa"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg></button>
        <button type="button" class="btn is-icon luogo-picker-opt" data-finish-trash="${escapeAttr(it.key)}" title="Metti tra i Finiti" aria-label="Metti tra i Finiti">${TRASH_ICON_SVG}</button>
      </div>` : ''}
      <button class="btn is-text inv-name" data-pantry-edit="${escapeAttr(it.key)}" type="button">${escapeHtml(it.nome)}${it.scadenza ? expiryBadgeHtml(daysUntilDate(it.scadenza), it.scadenza) : ''}</button>
      ${it.unit === 'none'
        ? `<label class="presence-toggle"><input type="checkbox" ${it.qty > 0 ? 'checked' : ''} data-presence-toggle="${escapeAttr(it.key)}"></label>`
        : `<span class="qty-stepper">
        <button class="qty-btn" type="button" data-qty-dec="${escapeAttr(it.key)}" aria-label="Diminuisci">−</button>
        ${editing
          ? `<input type="number" min="0" step="${step}" class="qty-input" value="${it.qty}" data-qty-edit="${escapeAttr(it.key)}">${it.unit ? `<span class="qty-unit">${escapeHtml(it.unit)}</span>` : ''}`
          : `<span class="qty-num${pantryQtyIsLow(it) ? ' low' : ''}" data-qty-show="${escapeAttr(it.key)}">${it.qty}${it.unit ? ' ' + escapeHtml(it.unit) : ''}</span>`}
      </span>`}
    </div>
    </div>
    `;
  }
/*       <button class="btn-remove" data-inv-remove="${escapeAttr(it.key)}" type="button" aria-label="Elimina ${escapeAttr(it.nome)}"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 256 256"><path fill="currentColor" d="M216 48h-40v-8a24 24 0 0 0-24-24h-48a24 24 0 0 0-24 24v8H40a8 8 0 0 0 0 16h8v144a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V64h8a8 8 0 0 0 0-16M96 40a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8v8H96Zm96 168H64V64h128Zm-80-104v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0m48 0v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0"></path></svg></button>
 */
  let body;
  const pantryShownCount = items.filter(it => isNonFoodDept(knownDept(it.cat) || classifyDept(it.nome)) === (state.pantryView === 'casa')).length;
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
    // In cima, solo in Cibo: quello che scade a breve (o è già scaduto),
    // dal più urgente. Le voci restano anche nella loro categoria.
    const expiring = wantNonFood ? [] : items
      .filter(it => it.scadenza && !isNonFoodDept(knownDept(it.cat) || classifyDept(it.nome)))
      .map(it => ({ it, days: daysUntilDate(it.scadenza) }))
      .filter(x => x.days !== null && x.days <= EXPIRY_SOON_DAYS)
      .sort((a, b) => a.days - b.days || IT_COLLATOR.compare(a.it.nome, b.it.nome));
    const expiringHtml = expiring.length ? `
      <div class="shop-day-group expiring-group">
        <div class="dept-title"><span class="dept-icon">⏰</span>In scadenza</div>
        <div class="accordion-body">${expiring.map(x => itemRow(x.it)).join('')}</div>
      </div>` : '';
    body = expiringHtml + (!depts.length
      ? `<p class="ing-empty">${searchTerm ? `Nessun prodotto trovato per "${escapeHtml(state.pantrySearch.trim())}" in ${wantNonFood ? 'Casa' : 'Cibo'}.` : (wantNonFood ? 'Nessun prodotto per la casa, per ora — tocca il + per aggiungerne uno (detersivi, igiene, carta forno...).' : 'Nessun alimento, per ora.')}</p>`
      : pantryGroupsHtml());
    // Ordina per (come la Spesa): categoria, luogo o una lista sola A-Z.
    function pantrySection(sectionId, iconHtml, label, list){
      const isOpen = !state.pantrySectionCollapsed[sectionId];
      return `
      <div class="shop-day-group">
        <div class="dept-title finished-toggle${isOpen ? ' open' : ''}" data-toggle-pantry-section="${sectionId}">
          <span class="dept-icon">${iconHtml}</span>${escapeHtml(label)}
          <svg class="finished-chevron" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 256 256"><path fill="currentColor" d="m213.66 101.66l-80 80a8 8 0 0 1-11.32 0l-80-80a8 8 0 0 1 11.32-11.32L128 164.69l74.34-74.35a8 8 0 0 1 11.32 11.32"/></svg>
        </div>
        <div class="accordion-body${isOpen ? '' : ' is-collapsed'}">
          ${list.sort((a,b)=>IT_COLLATOR.compare(a.nome, b.nome)).map(itemRow).join('')}
        </div>
      </div>`;
    }
    function pantryGroupsHtml(){
      const shown = depts.flatMap(d => byDept[d]);
      if(state.pantryGroupBy === 'az') return `<div class="shop-day-group shop-az">${shown.sort((a,b)=>IT_COLLATOR.compare(a.nome, b.nome)).map(itemRow).join('')}</div>`;
      if(state.pantryGroupBy === 'luogo'){
        return LUOGO_ORDER.map(l => {
          const list = shown.filter(it => it.luogo === l);
          return list.length ? pantrySection(`luogo_${l}`, LUOGO_ICON[l], LUOGO_LABEL[l], list) : '';
        }).join('');
      }
      return depts.map(d => pantrySection(`cat_${d}`, DEPT_ICON[d], DEPT_LABEL[d], byDept[d])).join('');
    }
  }

  // Scheda ingrediente: Modifica e Aggiungi sono la stessa pagina (vedi
  // renderIngredientSheet). In Modifica ogni cambio si salva subito; in
  // Aggiungi si lavora su una bozza (state.pantryDraft) che entra in Dispensa
  // solo con "Aggiungi".
  const editItem = state.pantryEditKey ? state.pantryItems[state.pantryEditKey] : null;
  if(!editItem && state.pantryAddModalOpen && !state.pantryDraft) state.pantryDraft = newPantryDraft(state.pantryView === 'casa');
  const sheetItem = editItem || (state.pantryAddModalOpen ? state.pantryDraft : null);
  const editModal = sheetItem ? renderIngredientSheet(sheetItem, !editItem) : '';
  const mergeModal = renderMergeIngredientModal();
  const addModal = '';
/*           <button class="btn is-ghost reset-btn" data-close-pantry-add-modal>Annulla</button>
 */
  const groupsModal = state.pantryGroupsModalOpen ? renderGroupsPage() : '';
  const deptsModal = state.deptsModalOpen ? renderDeptsPage() : '';
  const ingredientManagerModal = state.ingredientManagerOpen ? renderIngredientManagerPage() : '';
  const inventoryPage = state.inventoryOpen ? renderInventoryPage() : '';

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
    ${state.pantrySelectMode ? '' : `<div class="pantry-kind-switch" role="group" aria-label="Cibo o Casa">
      <button type="button" class="pantry-kind-btn${state.pantryView!=='casa'?' active':''}" data-pantry-view="cibo" aria-label="Cibo" aria-pressed="${state.pantryView!=='casa'}">${FOOD_ICON_SVG}</button>
      <span class="pantry-kind-sep" aria-hidden="true"></span>
      <button type="button" class="pantry-kind-btn${state.pantryView==='casa'?' active':''}" data-pantry-view="casa" aria-label="Casa" aria-pressed="${state.pantryView==='casa'}">${HOME_ICON_SVG}</button>
    </div>`}
    ${listSearchHtml('pantry-search', state.pantrySearch, 'Cerca in Dispensa…')}
    <div class="shop-head">
      <div class="shop-head-title"><span class="shop-head-sub">${pantryShownCount} ${state.pantryView === 'casa' ? (pantryShownCount === 1 ? 'prodotto' : 'prodotti') : (pantryShownCount === 1 ? 'ingrediente' : 'ingredienti')}</span></div>
      <label class="shop-group-by"><span>Ordina per</span>
        <select data-pantry-group aria-label="Ordina per">
          ${[['cat','Categoria'],['luogo','Luogo'],['az','Dalla A alla Z']].map(([v,l]) => `<option value="${v}" ${state.pantryGroupBy === v ? 'selected' : ''}>${l}</option>`).join('')}
        </select>
      </label>
    </div>
    <div class="shop-list pantry-list">${body}</div>
    <div class="save-hint"></div>
    ${ingredientManagerModal}
    ${inventoryPage}
    ${editModal}
    ${addModal}
    ${groupsModal}
    ${deptsModal}
    ${mergeModal}
    <div class="buttons-fixed">
      <button type="button" class="btn is-fixed is-secondary" id="pantry-toggle-all-sections">${(Object.entries(state.pantrySectionCollapsed).some(([id,val]) => val && id.startsWith('cat_'))) ? '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--iconoir" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m17 8l-5-5l-5 5m10 8l-5 5l-5-5"></path></svg>' : '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--iconoir" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m17 4l-5 5l-5-5m10 16l-5-5l-5 5"></path></svg>'}</button>
      ${`<button class="btn is-fixed" id="pantry-fab" type="button" aria-label="${state.pantryView === 'casa' ? 'Aggiungi prodotto' : 'Aggiungi ingrediente'}"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M228 128a12 12 0 0 1-12 12h-76v76a12 12 0 0 1-24 0v-76H40a12 12 0 0 1 0-24h76V40a12 12 0 0 1 24 0v76h76a12 12 0 0 1 12 12"></path></svg></button>`}
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

  document.querySelectorAll('[data-shop-group]').forEach(sel=>{
    sel.addEventListener('change', ()=>{ state.shopView = sel.value; render(); });
  });
  document.querySelectorAll('[data-shop-view]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      state.shopView = e.target.dataset.shopView;
      render();
    });
  });

  document.querySelectorAll('.shop-item input[type=checkbox]').forEach(cb=>{
    cb.addEventListener('change', e=>{
      // La spunta segna solo "preso": la riga passa in "Completati" e la
      // Dispensa si aggiorna con "Sposta in dispensa" (vedi renderSpesa).
      e.target.dataset.shopKeys.split(',').forEach(k=>{ state.shopChecked[k] = e.target.checked; });
      persist(); render();
    });
  });
  document.querySelectorAll('[data-exp-confirm-close]').forEach(el=> el.addEventListener('click', e=>{
    if(e.target !== el) return; // tocco dentro la finestra (sfondo = el solo se toccato lui)
    closeExpiryConfirm(); render();
  }));
  document.querySelectorAll('[data-exp-confirm-shift]').forEach(btn=> btn.addEventListener('click', ()=>{
    const it = state.pantryItems[btn.dataset.expConfirmShift];
    if(!it || !it.scadenza) return;
    const days = daysUntilDate(it.scadenza) + parseInt(btn.dataset.expShift, 10);
    it.scadenza = addDaysIso(Math.max(0, days));
    persist(); render();
  }));
  document.querySelectorAll('[data-exp-confirm-toggle]').forEach(btn=> btn.addEventListener('click', ()=>{
    const it = state.pantryItems[btn.dataset.expConfirmToggle];
    if(!it) return;
    if(it.scadenza) delete it.scadenza;
    else { const est = estimateExpiryDays(it); it.scadenza = addDaysIso(est ?? 3); }
    persist(); render();
  }));
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
      // L'unità dalla select si aggiunge solo se il campo Quantità è un
      // numero "pulito" (es. "2"): se hai scritto qualcosa di tuo (es.
      // "1 rotolo") lo rispetto così com'è, senza aggiungere altro in coda.
      const rawQta = qtaInput.value.trim();
      const qta = (unitSelect && unitSelect.value && /^[\d.,]*$/.test(rawQta))
        ? `${rawQta || '1'} ${unitSelect.value}`
        : rawQta;
      if(pantryIt && typeof pantryIt.qty === 'number' && pantryIt.qty <= 0){
        // La quantità scritta resta sulla riga riattivata (prima si perdeva:
        // la riga dei Finiti non ha quantità sua).
        state.pantryConfirmedShop[pantryKey] = qta || true;
        delete state.shopDismissed[`oos_${pantryKey}`];
        if(catSelect && catSelect.value) pantryIt.cat = catSelect.value;
      } else {
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
      if(!isCloseTap(e, el)) return;
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
      if(!isCloseTap(e, el)) return;
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
      state.dishPicker = null;
      render();
    });
  });
  document.querySelectorAll('[data-open-link-picker]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const key = e.currentTarget.dataset.openLinkPicker;
      state.linkPickerOpenDay = state.linkPickerOpenDay === key ? null : key;
      state.avanzoDiPickerOpenDay = null;
      state.swapOpenDay = null;
      state.dishPicker = null;
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
      state.dishPicker = null;
      state.mealOverflowOpen = null;
      render();
    });
  });
  document.querySelectorAll('[data-dish-search]').forEach(inp=>{
    inp.addEventListener('input', e=>{
      if(!state.dishPicker) return;
      state.dishPicker.search = e.target.value;
      render(); // fuoco e cursore: vedi restoreFocus
    });
  });
  // Piatti del pasto (apri scelta, scegli, togli, portata, fisarmonica): delegati su document, vedi in
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
      const used = generateWeek(weekIdx);
      const usedText = used.length ? ` · usa ${used.slice(0, 2).join(' e ')}${used.length > 2 ? ` e altri ${used.length - 2}` : ''} prima che scada${used.length > 1 ? 'no' : ''}` : '';
      const pantryText = state.genPantryOnly ? (used.pantryShort ? ` · per ${used.pantryShort} past${used.pantryShort === 1 ? 'o' : 'i'} manca qualcosa` : ' · hai già tutto') : '';
      showUndoToast((state.genPantryOnly ? 'Menù con quello che hai' : 'Menù rigenerato') + pantryText + usedText, ()=>{
        restorePlanningState(snap);
        persist(); render();
      });
    });
  });
  document.querySelectorAll('[data-toggle-gen-pantry]').forEach(btn=>{
    btn.addEventListener('click', ()=>{ state.genPantryOnly = !state.genPantryOnly; render(); });
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
      if(!isCloseTap(e, el)) return;
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
        // modale di aggiornamento Dispensa. Il pane invece si mangia anche con
        // l'avanzo: si toglie qui, con Annulla.
        if(!mealsDone[i]) mealsDone[i] = {};
        mealsDone[i][meal] = true;
        const took = mealHasBread(i, meal) ? takeBread(BREAD_PER_MEAL) : null;
        persist(); render();
        if(took) showUndoToast(`Tolto il pane: ${took.it.qty ? `ne restano ${took.it.qty}` : 'è finito'}`, ()=>{
          took.it.qty = took.prev;
          clearMealFlag(weekMealsDoneRef(weekIdx), i, meal);
          persist(); render();
        });
      } else {
        const mealData = effectiveMeal(weekIdx, i, meal);
        // Stessa scala porzioni usata ovunque (Spesa, dettaglio ricetta): la
        // quantità precompilata è quella davvero usata per QUESTO pasto, non
        // quella "di base" della ricetta.
        const det = mealData.principale ? getRecipeDetails(mealData.principale) : null;
        const basePortions = det ? parsePortionsBase(det.porzioni) : null;
        const ratio = basePortions ? (state.dayPortions[key] || basePortions) / basePortions : 1;
        // Per piatto: niente ingredienti per quelli presi dal freezer, il
        // doppio per quelli fatti in doppia dose (vedi dishCookFactor).
        const allIng = mealCookIngredients(key, mealData);
        const qtyMap = {};
        allIng.forEach(it=>{
          // resolvePantryItem (non un lookup diretto per nome): un ingrediente
          // con alternative tra parentesi ("Farina 00 (o mix con Manitoba)")
          // o parte di un gruppo va risolto come ovunque in Dispensa/Spesa.
          const pantryIt = resolvePantryItem(it.ingrediente);
          if(pantryIt && typeof pantryIt.qty === 'number' && pantryIt.unit !== 'none'){
            qtyMap[it.ingrediente] = (qtyMap[it.ingrediente] || 0) + usedQtyForPantry(pantryIt.unit, it.qta, ratio * it.factor);
          }
        });
        state.doneModalDay = key;
        state.doneModalBread = mealHasBread(i, meal) ? BREAD_PER_MEAL : 0;
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
      if(!isCloseTap(e, el)) return;
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
      if(!isCloseTap(e, el)) return;
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
  document.querySelectorAll('[data-done-bread]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      state.doneModalBread = Math.max(0, state.doneModalBread + parseInt(btn.dataset.doneBread, 10));
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
      const doneMealData = effectiveMeal(weekIdx, i, meal);
      const doneIngAll = (doneMealData.principale ? getIngredientsFor(doneMealData.principale) : []).concat(doneMealData.contorni.reduce((acc,c)=>acc.concat(getIngredientsFor(c)), []));
      if(mealHasBread(i, meal) && !recipeListsBread(doneIngAll)) takeBread(state.doneModalBread);
      state.doneModalBread = 0;
      // Freezer: le porzioni prese per questo pasto scendono; la metà in più
      // di una doppia dose (se non già messa via dal prep) ci va adesso.
      const doneMk = mealKey(weekIdx, i, meal);
      const donePortions = mealPortions(doneMk, doneMealData.principale);
      mealDishes(weekIdx, i, meal).forEach(dsh => {
        if(isFreezerDish(doneMk, dsh.name)) takeFreezerPortions(dsh.name, donePortions);
        else freezeDoubleIfReady(weekIdx, i, meal, dsh.name);
      });
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
      state.mealDetailMenuOpen = false;
      render();
    });
  });
  document.querySelectorAll('[data-recipe-menu]').forEach(el=>{
    el.addEventListener('click', ()=>{ state.recipeMenuOpen = !state.recipeMenuOpen; render(); });
  });
  document.querySelectorAll('[data-recipe-menu-close]').forEach(el=>{
    el.addEventListener('click', ()=>{ state.recipeMenuOpen = false; render(); });
  });
  const recipePortionsStep = (name, delta)=>{
    const det = getRecipeDetails(name);
    const base = det ? parsePortionsBase(det.porzioni) : null;
    if(!base) return;
    state.recipePortions[name] = Math.max(1, (state.recipePortions[name] || base) + delta);
    render();
  };
  document.querySelectorAll('[data-recipe-portions-inc]').forEach(el=> el.addEventListener('click', ()=> recipePortionsStep(el.dataset.recipePortionsInc, 1)));
  document.querySelectorAll('[data-recipe-portions-dec]').forEach(el=> el.addEventListener('click', ()=> recipePortionsStep(el.dataset.recipePortionsDec, -1)));
  document.querySelectorAll('[data-meal-menu]').forEach(el=>{
    el.addEventListener('click', ()=>{ state.mealDetailMenuOpen = !state.mealDetailMenuOpen; render(); });
  });
  document.querySelectorAll('[data-meal-menu-close]').forEach(el=>{
    el.addEventListener('click', ()=>{ state.mealDetailMenuOpen = false; render(); });
  });
  document.querySelectorAll('[data-cook-start]').forEach(el=>{
    el.addEventListener('click', ()=>{ state.cookMode = { name: el.dataset.cookStart, step: 0, ratio: parseFloat(el.dataset.cookRatio) || 1 }; render(); });
  });
  document.querySelectorAll('[data-close-cook]').forEach(el=>{
    el.addEventListener('click', ()=>{ state.cookMode = null; render(); });
  });
  const cookGo = delta=>{
    const cm = state.cookMode; if(!cm) return;
    const det = getRecipeDetails(cm.name);
    const total = ((det && det.procedimento) || []).length;
    const next = Math.min(Math.max(0, (cm.step || 0) + delta), total - 1);
    if(next === cm.step) return;
    cm.step = next;
    render();
  };
  document.querySelectorAll('[data-cook-prev]').forEach(el=> el.addEventListener('click', ()=> cookGo(-1)));
  document.querySelectorAll('[data-cook-next]').forEach(el=> el.addEventListener('click', ()=> cookGo(1)));
  // Scorrere con il dito: a sinistra passo avanti, a destra indietro.
  document.querySelectorAll('[data-cook-swipe]').forEach(el=>{
    let x0 = null, y0 = null;
    el.addEventListener('touchstart', e=>{ const t = e.changedTouches[0]; x0 = t.clientX; y0 = t.clientY; }, { passive: true });
    el.addEventListener('touchend', e=>{
      if(x0 === null) return;
      const t = e.changedTouches[0], dx = t.clientX - x0, dy = t.clientY - y0;
      x0 = null;
      if(Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) cookGo(dx < 0 ? 1 : -1);
    }, { passive: true });
  });
  document.querySelectorAll('[data-dish-pane]').forEach(el=>{
    el.addEventListener('click', ()=>{ state.dishPane[el.dataset.dishPane] = el.dataset.dishPaneValue; render(); });
  });
  document.querySelectorAll('[data-dish-tab]').forEach(el=>{
    el.addEventListener('click', ()=>{ state.dishTab[el.dataset.dishTab] = el.dataset.dishTabName; render(); });
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
      state.recipeMenuOpen = false;
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
      if(!isCloseTap(e, el)) return;
      state.recipeEditName = null;
      render();
    });
  });
  const recipeEditModal = document.querySelector('.recipe-edit-page');
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
        ingrediente: canonicalIngredientName(row.querySelector('.edit-ing-name').value.trim()),
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
        gradimento: document.getElementById('edit-gradimento').value,
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
      if(!isCloseTap(e, el)) return;
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
      if(!isCloseTap(e, el)) return;
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
  const shopSearch = document.getElementById('shop-search');
  if(shopSearch) shopSearch.addEventListener('input', e=>{ state.shopSearch = e.target.value; render(); });
  document.querySelectorAll('[data-search-clear]').forEach(btn=> btn.addEventListener('click', ()=>{
    const id = btn.dataset.searchClear;
    if(id === 'shop-search') state.shopSearch = '';
    else if(id === 'f-search') state.filters.search = '';
    else if(id === 'cookbook-pick-search') state.cookbookPickSearch = '';
    else state.pantrySearch = '';
    render();
    const el = document.getElementById(id);
    if(el) el.focus();
  }));
  const pantrySearch = document.getElementById('pantry-search');
  if(pantrySearch) pantrySearch.addEventListener('input', e=>{ state.pantrySearch = e.target.value; render(); });
  // "+" di Ricette: stesso modale di "+ Aggiungi ricetta" nel menu ⋯
  // (nascosto mentre la ricerca è aperta, come in Dispensa).
  const prepFab = document.getElementById('prep-fab');
  if(prepFab) prepFab.addEventListener('click', ()=>{ state.newRecipeModalOpen = true; state.newRecipeError = ''; render(); });
  document.querySelectorAll('[data-dismiss-expiry-banner]').forEach(btn=> btn.addEventListener('click', ()=>{
    try{ localStorage.setItem(EXPIRY_BANNER_KEY, isoLocalDate(new Date())); }catch(e){}
    render();
  }));
  document.querySelectorAll('[data-expiry-cook]').forEach(btn=> btn.addEventListener('click', ()=>{
    state.prepPantryMode = true;
    location.hash = '#prep';
    state.tab = 'prep';
    render();
    window.scrollTo(0, 0);
  }));
  document.querySelectorAll('[data-toggle-balance-details]').forEach(btn=> btn.addEventListener('click', ()=>{
    state.balanceDetailsOpen = !state.balanceDetailsOpen;
    render();
  }));
  document.querySelectorAll('[data-toggle-pantry-mode]').forEach(btn=> btn.addEventListener('click', ()=>{
    state.prepPantryMode = !state.prepPantryMode;
    render();
  }));
  // "+" di Dispensa: stesso modale di "+ Aggiungi ingrediente" nel menu ⋯
  // (titolo/categoria di ripiego seguono la vista Cibo/Casa aperta).
  const pantryFab = document.getElementById('pantry-fab');
  if(pantryFab) pantryFab.addEventListener('click', ()=>{ state.pantryAddModalOpen = true; render(); });

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

  document.querySelectorAll('[data-pantry-group]').forEach(sel=>{
    sel.addEventListener('change', ()=>{ state.pantryGroupBy = sel.value; render(); });
  });
  document.querySelectorAll('[data-pantry-view]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      // btn, non e.target: il tocco cade spesso sull'icona SVG dentro il bottone.
      state.pantryView = btn.dataset.pantryView;
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
    row.addEventListener('swipestart', cancelPress); // uno swipe non è una pressione lunga
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
  document.querySelectorAll('.swipe-wrap[data-swipe-shop]').forEach(wrap=>{
    attachSwipeToDelete(wrap, ()=> removeShopRowWithUndo(wrap.dataset.swipeShop, wrap.dataset.swipeLabel));
  });
  document.querySelectorAll('.swipe-wrap[data-swipe-pantry]').forEach(wrap=>{
    attachSwipeToDelete(wrap, ()=>{
      const key = wrap.dataset.swipePantry;
      // Come col "−" a zero: chiede "+" (lista spesa) o cestino (Finiti).
      if(isLeftoverPantryItem(state.pantryItems[key])) finishPantryItemWithUndo(key);
      else { state.pantryFinishPicker = key; render(); }
    });
  });
  document.querySelectorAll('[data-finish-picker-close]').forEach(el=>{
    el.addEventListener('click', ()=>{ state.pantryFinishPicker = null; render(); });
  });
  document.querySelectorAll('[data-finish-tolist]').forEach(btn=>{
    btn.addEventListener('click', e=> confirmPantryFinish(e.currentTarget.dataset.finishTolist, true));
  });
  document.querySelectorAll('[data-finish-trash]').forEach(btn=>{
    btn.addEventListener('click', e=> confirmPantryFinish(e.currentTarget.dataset.finishTrash, false));
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
      const next = Math.max(0, Math.round(((typeof it.qty === 'number' ? it.qty : 0) - step) * 100) / 100);
      if(next <= 0 && !isLeftoverPantryItem(it)){ state.pantryFinishPicker = key; render(); return; }
      it.qty = next;
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
      if(!e.currentTarget.checked && !isLeftoverPantryItem(it)){ state.pantryFinishPicker = key; render(); return; }
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
        const next = Number.isNaN(n) ? 0 : Math.max(0, n);
        if(next <= 0 && !isLeftoverPantryItem(it)) state.pantryFinishPicker = key;
        else it.qty = next;
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
  document.querySelectorAll('[data-close-pantry-add-modal]').forEach(el=>{
    el.addEventListener('click', e=>{
      if(!isCloseTap(e, el)) return;
      closeIngredientSheet();
      render();
    });
  });
  document.querySelectorAll('[data-open-pantry-groups]').forEach(btn=>{
    btn.addEventListener('click', ()=>{ state.pantryGroupsModalOpen = true; render(); });
  });
  document.querySelectorAll('[data-close-pantry-groups]').forEach(el=>{
    el.addEventListener('click', e=>{
      if(!isCloseTap(e, el)) return;
      state.pantryGroupsModalOpen = false;
      closeGroupEdit();
      render();
    });
  });
  document.querySelectorAll('[data-close-inventory]').forEach(el=>{
    el.addEventListener('click', e=>{
      if(!isCloseTap(e, el)) return;
      state.inventoryOpen = false;
      persist(); render();
    });
  });
  document.querySelectorAll('[data-inv-filter]').forEach(btn=> btn.addEventListener('click', ()=>{
    state.inventoryFilter = btn.dataset.invFilter;
    state.inventoryKeep = {};
    render();
  }));
  document.querySelectorAll('[data-inv-qty-input]').forEach(inp=> inp.addEventListener('change', e=>{
    const name = e.target.dataset.invName;
    const it = state.pantryItems[name.trim().toLowerCase()];
    const n = parseFloat(String(e.target.value).replace(',', '.'));
    if(!it || Number.isNaN(n)) return;
    it.qty = Math.max(0, Math.round(n * 100) / 100);
    if(it.qty === 0) inventorySetHas(name, false);
    persist(); render();
  }));
  document.querySelectorAll('[data-inv-unit]').forEach(sel=> sel.addEventListener('change', e=>{
    const it = state.pantryItems[e.target.dataset.invName.trim().toLowerCase()];
    if(!it) return;
    if(e.target.value) it.unit = e.target.value; else delete it.unit;
    if(it.unit === 'none') it.qty = 1;
    persist(); render();
  }));
  const inventorySearch = document.getElementById('inventory-search');
  if(inventorySearch) inventorySearch.addEventListener('input', e=>{
    state.inventorySearch = e.target.value;
    render(); // fuoco e cursore: vedi restoreFocus
  });
  document.querySelectorAll('[data-close-ingredient-manager]').forEach(el=>{
    el.addEventListener('click', e=>{
      if(!isCloseTap(e, el)) return;
      state.ingredientManagerOpen = false;
      render();
    });
  });
  document.querySelectorAll('[data-ingredient-filter]').forEach(btn=> btn.addEventListener('click', ()=>{
    state.ingredientManagerFilter = btn.dataset.ingredientFilter;
    render();
  }));
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
      state.pantryEditKey = key; // l'elenco resta aperto sotto: Indietro ci torna
      persist(); render();
    });
  });
  // Gruppi: la modifica si apre nella riga; nome, nome nelle ricette e
  // categoria stanno nella bozza finché non si salva (un render non li perde).
  document.querySelectorAll('[data-group-edit]').forEach(btn=> btn.addEventListener('click', ()=>{
    const id = btn.dataset.groupEdit;
    const g = state.pantryGroups[id] || { label:'', matchName:'', cat:'' };
    state.groupEditId = id;
    state.groupDraft = { label: g.label, matchName: g.matchName, cat: g.cat || '', matchTouched: id !== 'new' && g.matchName !== (g.label || '').toLowerCase() };
    state.groupMemberSearch = '';
    render();
    const inp = document.getElementById('group-edit-label');
    if(inp && id === 'new') inp.focus();
  }));
  document.querySelectorAll('[data-group-edit-cancel]').forEach(btn=> btn.addEventListener('click', ()=>{ closeGroupEdit(); render(); }));
  const groupLabelInput = document.getElementById('group-edit-label');
  const groupMatchInput = document.getElementById('group-edit-match');
  if(groupLabelInput && state.groupDraft) groupLabelInput.addEventListener('input', e=>{
    state.groupDraft.label = e.target.value;
    // Il nome nelle ricette segue il nome finché non lo cambi a mano.
    if(!state.groupDraft.matchTouched){
      state.groupDraft.matchName = e.target.value.trim().toLowerCase();
      if(groupMatchInput) groupMatchInput.value = state.groupDraft.matchName;
    }
  });
  if(groupMatchInput && state.groupDraft) groupMatchInput.addEventListener('input', e=>{
    state.groupDraft.matchName = e.target.value;
    state.groupDraft.matchTouched = true;
  });
  const groupCatSelect = document.getElementById('group-edit-cat');
  if(groupCatSelect && state.groupDraft) groupCatSelect.addEventListener('change', e=>{ state.groupDraft.cat = e.target.value; });
  const groupSaveBtn = document.getElementById('group-edit-save');
  if(groupSaveBtn) groupSaveBtn.addEventListener('click', ()=>{
    const d = state.groupDraft; if(!d) return;
    const label = (d.label || '').trim();
    const matchName = (d.matchName || label).trim().toLowerCase();
    if(!label){ if(groupLabelInput) groupLabelInput.focus(); return; }
    if(state.groupEditId === 'new'){
      const slug = label.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-+|-+$)/g,'') || 'gruppo';
      let id = slug, n = 2;
      while(state.pantryGroups[id]) id = `${slug}-${n++}`;
      state.pantryGroups[id] = { label, matchName, cat: d.cat || '' };
      persist();
      // Appena creato si resta nella sua modifica, per aggiungere i formati.
      state.groupEditId = id;
      state.groupDraft = { label, matchName, cat: d.cat || '', matchTouched: d.matchTouched };
      render();
      const s2 = document.getElementById('group-member-search'); if(s2) s2.focus();
      return;
    }
    const g = state.pantryGroups[state.groupEditId];
    if(g){ g.label = label; g.matchName = matchName; g.cat = d.cat || ''; }
    closeGroupEdit();
    persist(); render();
  });
  const groupMemberSearch = document.getElementById('group-member-search');
  if(groupMemberSearch) groupMemberSearch.addEventListener('input', e=>{ state.groupMemberSearch = e.target.value; render(); });
  const addToGroup = key=>{
    const it = state.pantryItems[key]; const g = state.pantryGroups[state.groupEditId];
    if(!it || !g) return;
    it.group = state.groupEditId;
    if(!it.cat && g.cat) it.cat = g.cat;
    state.groupMemberSearch = '';
    persist(); render();
    const inp = document.getElementById('group-member-search'); if(inp) inp.focus();
  };
  document.querySelectorAll('[data-group-member-add]').forEach(btn=> btn.addEventListener('click', ()=> addToGroup(btn.dataset.groupMemberAdd)));
  document.querySelectorAll('[data-group-member-new]').forEach(btn=> btn.addEventListener('click', ()=>{
    const name = btn.dataset.groupMemberNew;
    const key = name.trim().toLowerCase();
    if(!state.pantryItems[key]) upsertPantryItem(name, 'dispensa', 0);
    addToGroup(key);
  }));
  document.querySelectorAll('[data-group-member-remove]').forEach(btn=> btn.addEventListener('click', ()=>{
    const it = state.pantryItems[btn.dataset.groupMemberRemove];
    if(it){ delete it.group; persist(); render(); }
  }));
  document.querySelectorAll('[data-group-delete]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const id = e.currentTarget.dataset.groupDelete;
      const prev = state.pantryGroups[id];
      const members = Object.entries(state.pantryItems).filter(([, it]) => it.group === id).map(([k]) => k);
      delete state.pantryGroups[id];
      // Le voci di Dispensa che lo usavano restano, solo senza più un gruppo:
      // non è un dato perso, si può riassegnare in un secondo momento.
      members.forEach(k => { delete state.pantryItems[k].group; });
      closeGroupEdit();
      persist(); render();
      showUndoToast(`Gruppo "${prev.label}" eliminato`, ()=>{
        state.pantryGroups[id] = prev;
        members.forEach(k => { if(state.pantryItems[k]) state.pantryItems[k].group = id; });
        persist(); render();
      });
    });
  });

  document.querySelectorAll('[data-open-depts]').forEach(btn=>{
    btn.addEventListener('click', ()=>{ state.deptsModalOpen = true; render(); });
  });
  document.querySelectorAll('[data-close-depts]').forEach(el=>{
    el.addEventListener('click', e=>{
      if(!isCloseTap(e, el)) return;
      state.deptsModalOpen = false;
      closeDeptEdit();
      render();
    });
  });
  // Categorie: la modifica si apre nella riga, con una bozza salvata solo
  // con Salva. Per una categoria di base la voce in customDepts si crea al
  // primo cambio; svuotare un campo la riporta al nome/emoji originale.
  document.querySelectorAll('[data-dept-edit]').forEach(btn=> btn.addEventListener('click', ()=>{
    const id = btn.dataset.deptEdit;
    state.deptEditId = id;
    state.deptDraft = id === 'new'
      ? { icon: '', label: '', nonFood: state.pantryView === 'casa' }
      : { icon: DEPT_ICON[id] || '', label: DEPT_LABEL[id] || '', nonFood: isNonFoodDept(id) };
    render();
    const inp = document.getElementById('dept-edit-label');
    if(inp && id === 'new') inp.focus();
  }));
  document.querySelectorAll('[data-dept-edit-cancel]').forEach(btn=> btn.addEventListener('click', ()=>{ closeDeptEdit(); render(); }));
  const deptIconInput = document.getElementById('dept-edit-icon');
  const deptLabelInput = document.getElementById('dept-edit-label');
  if(deptIconInput && state.deptDraft) deptIconInput.addEventListener('input', e=>{ state.deptDraft.icon = e.target.value; });
  if(deptLabelInput && state.deptDraft) deptLabelInput.addEventListener('input', e=>{ state.deptDraft.label = e.target.value; });
  document.querySelectorAll('[data-dept-draft-type]').forEach(btn=> btn.addEventListener('click', ()=>{
    if(!state.deptDraft) return;
    state.deptDraft.nonFood = btn.dataset.deptDraftType === 'casa';
    render();
  }));
  const deptSaveBtn = document.getElementById('dept-edit-save');
  if(deptSaveBtn) deptSaveBtn.addEventListener('click', ()=>{
    const d = state.deptDraft; const id = state.deptEditId;
    if(!d || !id) return;
    const label = (d.label || '').trim(), icon = (d.icon || '').trim();
    if(!state.customDepts) state.customDepts = {};
    if(id === 'new'){
      if(!label){ if(deptLabelInput) deptLabelInput.focus(); return; }
      // Prefisso "c-": non si scontra mai con gli id delle categorie di base.
      const slug = 'c-' + (label.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-+|-+$)/g,'') || 'categoria');
      let nid = slug, n = 2;
      while(state.customDepts[nid]) nid = `${slug}-${n++}`;
      state.customDepts[nid] = Object.assign({ label, icon: icon || '🏷️' }, d.nonFood ? { nonFood: true } : {});
    } else if(BASE_DEPT_LABEL[id]){
      const o = Object.assign({}, state.customDepts[id]);
      if(label && label !== BASE_DEPT_LABEL[id]) o.label = label; else delete o.label;
      if(icon && icon !== BASE_DEPT_ICON[id]) o.icon = icon; else delete o.icon;
      if(o.label || o.icon) state.customDepts[id] = o; else delete state.customDepts[id];
    } else if(state.customDepts[id]){
      if(label) state.customDepts[id].label = label;
      state.customDepts[id].icon = icon || '🏷️';
      if(d.nonFood) state.customDepts[id].nonFood = true; else delete state.customDepts[id].nonFood;
    }
    closeDeptEdit();
    persist(); render();
  });
  document.querySelectorAll('[data-dept-reset]').forEach(btn=> btn.addEventListener('click', ()=>{
    delete state.customDepts[btn.dataset.deptReset];
    closeDeptEdit();
    persist(); render();
  }));
  document.querySelectorAll('[data-dept-delete]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const id = e.currentTarget.dataset.deptDelete;
      const prev = state.customDepts[id];
      // Chi la usava torna alla categoria automatica (dal nome): le voci di
      // Dispensa, gli aggiunti a mano in Spesa e i gruppi che la suggerivano.
      const users = { pantry: [], shop: [], groups: [] };
      Object.entries(state.pantryItems).forEach(([k, it])=>{ if(it.cat === id){ users.pantry.push(k); delete it.cat; } });
      Object.entries(state.shopExtras).forEach(([k, it])=>{ if(it.cat === id){ users.shop.push(k); delete it.cat; } });
      Object.entries(state.pantryGroups).forEach(([k, g])=>{ if(g.cat === id){ users.groups.push(k); g.cat = ''; } });
      delete state.customDepts[id];
      closeDeptEdit();
      persist(); render();
      showUndoToast(`Categoria "${prev ? prev.label : ''}" eliminata`, ()=>{
        state.customDepts[id] = prev;
        users.pantry.forEach(k=>{ if(state.pantryItems[k]) state.pantryItems[k].cat = id; });
        users.shop.forEach(k=>{ if(state.shopExtras[k]) state.shopExtras[k].cat = id; });
        users.groups.forEach(k=>{ if(state.pantryGroups[k]) state.pantryGroups[k].cat = id; });
        persist(); render();
      });
    });
  });
  document.querySelectorAll('[data-pantry-edit]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      state.pantryEditKey = e.currentTarget.dataset.pantryEdit;
      render();
    });
  });
  document.querySelectorAll('[data-close-pantry-edit]').forEach(el=>{
    el.addEventListener('click', e=>{
      if(!isCloseTap(e, el)) return;
      closeIngredientSheet(); render();
    });
  });
  // Scheda ingrediente: in Modifica ogni cambio va subito in Dispensa (e si
  // salva), in Aggiungi cambia solo la bozza finché non si preme "Aggiungi".
  const sheetTarget = ()=> state.pantryEditKey ? state.pantryItems[state.pantryEditKey] : (state.pantryAddModalOpen ? state.pantryDraft : null);
  const sheetChanged = ()=>{ if(state.pantryEditKey) persist(); render(); };
  const editNameInput = document.getElementById('pantry-edit-name');
  if(editNameInput){
    editNameInput.addEventListener('change', e=>{
      state.pantryEditKey = renamePantryItem(state.pantryEditKey, e.target.value);
      persist(); render();
    });
  }
  // Nome della bozza: niente render a ogni tasto (la tastiera resta aperta),
  // si aggiorna solo la categoria automatica mostrata.
  const addNameInput = document.getElementById('pantry-add-name');
  if(addNameInput && state.pantryDraft){
    const suggestEl = document.getElementById('pantry-add-suggest');
    const showSuggest = ()=>{
      if(!suggestEl) return;
      const q = addNameInput.value.trim().toLowerCase();
      const list = pantryAddSuggestions(q);
      // Già scritto per intero: niente elenco con la sola voce uguale.
      suggestEl.innerHTML = list.length === 1 && list[0].toLowerCase() === q ? '' : list.map(n=>{
        const ex = existingPantryFor(n);
        const meta = ex ? `<span class="sheet-hint-inline">${LUOGO_ICON[ex.luogo || 'dispensa'] || ''} ${typeof ex.qty === 'number' && ex.qty > 0 ? 'in Dispensa' : 'finito'}</span>` : '';
        return `<button type="button" class="add-ing-suggestion" data-pantry-suggest="${escapeAttr(n)}">${escapeHtml(n)} ${meta}</button>`;
      }).join('');
    };
    addNameInput.addEventListener('input', e=>{
      state.pantryDraft.nome = e.target.value;
      const v = document.getElementById('sheet-cat-value');
      if(v) v.innerHTML = sheetDeptLabelHtml(state.pantryDraft, !!state.pantryDraft.home);
      showSuggest();
    });
    addNameInput.addEventListener('focus', showSuggest);
    addNameInput.addEventListener('blur', ()=>{ setTimeout(()=>{ if(suggestEl) suggestEl.innerHTML = ''; }, 150); });
    // Scritto a mano per intero il nome di una voce che c'è già: stessi
    // dati che se l'avessi scelta dall'elenco.
    addNameInput.addEventListener('change', ()=>{
      const d = state.pantryDraft;
      if(!d || !existingPantryFor(d.nome)) return;
      fillDraftFromPantry(d, d.nome.trim());
      render();
    });
    // pointerdown, non click: precede il blur del campo, che altrimenti
    // svuoterebbe l'elenco prima del tocco.
    if(suggestEl) suggestEl.addEventListener('pointerdown', e=>{
      const btn = e.target.closest('[data-pantry-suggest]');
      if(!btn) return;
      e.preventDefault();
      fillDraftFromPantry(state.pantryDraft, btn.dataset.pantrySuggest);
      state.pantrySheetPicker = null;
      render();
      // Scelto: via la tastiera e l'elenco, si passa a quantità e luogo.
      const inp = document.getElementById('pantry-add-name');
      if(inp) inp.blur();
      const sug = document.getElementById('pantry-add-suggest');
      if(sug) sug.innerHTML = '';
    });
    addNameInput.addEventListener('keydown', e=>{ if(e.key === 'Enter') addNameInput.blur(); });
  }
  document.querySelectorAll('[data-sheet-qty]').forEach(btn=> btn.addEventListener('click', ()=>{
    const it = sheetTarget(); if(!it) return;
    const step = qtyStepFor(it.unit) * parseInt(btn.dataset.sheetQty, 10);
    it.qty = Math.max(0, Math.round(((typeof it.qty === 'number' ? it.qty : 0) + step) * 100) / 100);
    sheetChanged();
  }));
  const editQtyInput = document.getElementById('pantry-edit-qty');
  if(editQtyInput){
    editQtyInput.addEventListener('change', e=>{
      const it = sheetTarget(); if(!it) return;
      const n = parseFloat(String(e.target.value).replace(',', '.'));
      it.qty = Number.isNaN(n) ? 0 : Math.max(0, n);
      sheetChanged();
    });
  }
  document.querySelectorAll('[data-sheet-presence]').forEach(cb=> cb.addEventListener('change', ()=>{
    const it = sheetTarget(); if(!it) return;
    it.qty = cb.checked ? 1 : 0;
    sheetChanged();
  }));
  document.querySelectorAll('[data-sheet-luogo]').forEach(btn=> btn.addEventListener('click', ()=>{
    const it = sheetTarget(); if(!it) return;
    it.luogo = btn.dataset.sheetLuogo;
    sheetChanged();
  }));
  const setEditScadenza = iso=>{
    const it = sheetTarget(); if(!it) return;
    if(iso) it.scadenza = iso; else delete it.scadenza;
    sheetChanged();
  };
  const editScadenzaInput = document.getElementById('pantry-edit-scadenza');
  if(editScadenzaInput) editScadenzaInput.addEventListener('change', e=> setEditScadenza(e.target.value));
  document.querySelectorAll('[data-scadenza-quick]').forEach(btn=>{
    btn.addEventListener('click', e=> setEditScadenza(addDaysIso(parseInt(e.currentTarget.dataset.scadenzaQuick, 10))));
  });
  document.querySelectorAll('[data-scadenza-clear]').forEach(btn=>{
    btn.addEventListener('click', ()=> setEditScadenza(''));
  });
  document.querySelectorAll('[data-sheet-picker]').forEach(btn=> btn.addEventListener('click', ()=>{
    state.pantrySheetPicker = state.pantrySheetPicker === btn.dataset.sheetPicker ? null : btn.dataset.sheetPicker;
    render();
  }));
  document.querySelectorAll('[data-sheet-cat]').forEach(btn=> btn.addEventListener('click', ()=>{
    const it = sheetTarget(); if(!it) return;
    const v = btn.dataset.sheetCat;
    if(v) it.cat = v; else delete it.cat;
    if(it === state.pantryDraft) it.home = isNonFoodDept(sheetDept(it, it.home));
    state.pantrySheetPicker = null;
    sheetChanged();
  }));
  document.querySelectorAll('[data-sheet-group]').forEach(btn=> btn.addEventListener('click', ()=>{
    const it = sheetTarget(); if(!it) return;
    const v = btn.dataset.sheetGroup;
    if(v) it.group = v; else delete it.group;
    // Categoria precompilata dal gruppo solo se non era già scelta a mano.
    const group = state.pantryGroups[v];
    if(!it.cat && group && group.cat) it.cat = group.cat;
    state.pantrySheetPicker = null;
    sheetChanged();
  }));
  document.querySelectorAll('[data-sheet-unit]').forEach(btn=> btn.addEventListener('click', ()=>{
    const it = sheetTarget(); if(!it) return;
    const v = btn.dataset.sheetUnit;
    if(v) it.unit = v; else delete it.unit;
    sheetChanged();
  }));
  document.querySelectorAll('[data-sheet-more]').forEach(btn=> btn.addEventListener('click', ()=>{
    state.pantrySheetMore = !state.pantrySheetMore;
    render();
  }));
  const pantryAddBtn = document.getElementById('pantry-add-btn');
  if(pantryAddBtn) pantryAddBtn.addEventListener('click', ()=>{
    const d = state.pantryDraft; if(!d) return;
    const nome = (d.nome || '').trim();
    if(!nome){ const inp = document.getElementById('pantry-add-name'); if(inp) inp.focus(); return; }
    // Dalla vista Casa, un prodotto che la categoria automatica non
    // riconosce come "di casa" finisce in Casa › Altro invece che nel cibo.
    let cat = d.cat || '';
    if(!cat && d.home && !isNonFoodDept(classifyDept(nome))) cat = 'altro-casa';
    const key = nome.toLowerCase();
    const prevItem = state.pantryItems[key] ? Object.assign({}, state.pantryItems[key]) : null;
    upsertPantryItem(nome, d.luogo, d.unit === 'none' ? (d.qty > 0 ? 1 : 0) : d.qty, d.unit || '', cat, d.group || '');
    const added = state.pantryItems[key];
    if(added){
      // Voce che c'era già: vale quello scelto nella scheda (es. il luogo).
      added.luogo = d.luogo || added.luogo;
      if(d.unit === 'none') added.qty = d.qty > 0 ? 1 : 0;
      if(d.scadenza) added.scadenza = d.scadenza;
    }
    // Se è finito nell'altra vista (es. "Detersivo" aggiunto da Cibo), ci
    // si sposta lì: altrimenti sembrerebbe non essere stato aggiunto.
    state.pantryView = isNonFoodDept(knownDept(cat) || classifyDept(nome)) ? 'casa' : 'cibo';
    closeIngredientSheet();
    persist(); render();
    showUndoToast(`${nome} aggiunto`, ()=>{ if(prevItem) state.pantryItems[key] = prevItem; else delete state.pantryItems[key]; persist(); render(); });
  });
  const editDeleteBtn = document.getElementById('pantry-edit-delete');
  if(editDeleteBtn){
    editDeleteBtn.addEventListener('click', ()=>{
      const key = state.pantryEditKey;
      const prev = state.pantryItems[key];
      delete state.pantryItems[key];
      closeIngredientSheet();
      persist(); render();
      if(prev) showUndoToast(`${prev.nome} eliminato`, ()=>{ state.pantryItems[key] = prev; persist(); render(); });
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
// chi voleva scorrere lateralmente dentro la pagina — ora vive solo sulla
// barra: nel contenuto lo swipe su una riga la elimina (Menù, Spesa, Dispensa).
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

// Voci aggiuntive del menu "tre puntini" specifiche della tab aperta in quel
// momento — vedi TAB_MENU_ITEMS più sotto. "Impostazioni" c'è sempre, in
// testa, indipendentemente dalla tab.
const TAB_MENU_ITEMS = {
  dispensa: [
    { label: '📝 Inventario veloce', action: ()=>{ state.inventoryOpen = true; state.inventoryKeep = {}; } }
  ],
  menu: [
    { label: '🔄 Rigenera la settimana', action: ()=>{ state.genSettingsOpen = 0; } }
  ],
  prep: [
    { label: '📥 Importa da un reel o da un testo', action: ()=>{ state.recipeImport = { name: '', link: '', text: '' }; } }
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
    if(profilePanel){
      profilePanel.innerHTML = renderProfilePanel();
      const section = document.getElementById('profile-section');
      if(section) section.hidden = !profilePanel.innerHTML;
    }
    refreshThemeRow();
    refreshAccentRow();
    refreshBackupStatus();
    settingsBackdrop.classList.add('open');
    settingsBackdrop.scrollTop = 0;
    reconcileModalHistory();
  };
  const close = ()=>{ settingsBackdrop.classList.remove('open'); reconcileModalHistory(); };
  if(settingsClose) settingsClose.addEventListener('click', close);

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
// Swipe verso destra per eliminare una riga (Spesa, Dispensa), come le card
// del Menù: uno swipe breve rivela il cestino sotto (un tocco lì elimina),
// uno lungo elimina subito; sempre con "Annulla". Struttura:
// .swipe-wrap[data-swipe-id] > button.swipe-trash + .swipe-content (la riga).
// Non parte da campi, stepper e icona del luogo, che hanno i loro gesti; a
// swipe iniziato avvisa la riga (evento "swipestart") così la pressione lunga
// di Dispensa non scatta, e il tocco finale non spunta/apre nulla.
// Cibo/Casa in Dispensa (interruttore flottante in basso): posate e casetta.
const FOOD_ICON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>';
const HOME_ICON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>';
// Campo di ricerca sempre visibile in cima a Spesa e Dispensa.
function listSearchHtml(id, value, placeholder){
  return `<div class="list-search">${SEARCH_ICON_SVG}<input class="input-search" type="search" id="${id}" placeholder="${escapeAttr(placeholder)}" value="${escapeAttr(value || '')}" autocomplete="off">${value ? `<button type="button" class="list-search-clear" data-search-clear="${id}" aria-label="Cancella ricerca">✕</button>` : ''}</div>`;
}
// Ricette / Libro di cucina (interruttore in basso in Ricette).
const CHEF_ICON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1Z"/><path d="M6 17h12"/></svg>';
const BOOK_ICON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>';
const DOTS_ICON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 256 256"><path fill="currentColor" d="M112 60a16 16 0 1 1 16 16a16 16 0 0 1-16-16m16 52a16 16 0 1 0 16 16a16 16 0 0 0-16-16m0 68a16 16 0 1 0 16 16a16 16 0 0 0-16-16"/></svg>';
const PENCIL_ICON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 256 256"><path fill="currentColor" d="M227.31 73.37L182.63 28.68a16 16 0 0 0-22.63 0L36.69 152A15.86 15.86 0 0 0 32 163.31V208a16 16 0 0 0 16 16h44.69a15.86 15.86 0 0 0 11.31-4.69L227.31 96a16 16 0 0 0 0-22.63M92.69 208H48v-44.69l88-88L180.69 120ZM192 108.68L147.31 64l24-24L216 84.68Z"/></svg>';
const TRASH_ICON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 256 256"><path fill="currentColor" d="M216 48h-40v-8a24 24 0 0 0-24-24h-48a24 24 0 0 0-24 24v8H40a8 8 0 0 0 0 16h8v144a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V64h8a8 8 0 0 0 0-16M96 40a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8v8H96Zm96 168H64V64h128Zm-80-104v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0m48 0v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0"></path></svg>';
const SWIPE_REVEAL = 80, SWIPE_AUTO = 170;
let revealedSwipeId = null; // riga col cestino rivelato: sopravvive ai render
function attachSwipeToDelete(wrap, onDelete){
  const content = wrap.querySelector('.swipe-content');
  const id = wrap.dataset.swipeId;
  if(!content) return;
  let tracking = false, swiping = false, justSwiped = false, startX = 0, startY = 0;
  const setTx = px=>{ content.style.transform = px ? `translateX(${px}px)` : ''; };
  if(revealedSwipeId === id) setTx(SWIPE_REVEAL);
  const doDelete = ()=>{ revealedSwipeId = null; onDelete(); };
  wrap.querySelector('.swipe-trash').addEventListener('click', doDelete);
  content.addEventListener('pointerdown', e=>{
    tracking = !e.target.closest('input, select, textarea, .qty-stepper, [data-luogo-toggle], .luogo-picker, .luogo-picker-backdrop, .ing-note-row');
    swiping = false;
    startX = e.clientX; startY = e.clientY;
  });
  content.addEventListener('pointermove', e=>{
    if(!tracking) return;
    const dx = e.clientX - startX, dy = e.clientY - startY;
    if(!swiping){
      if(Math.hypot(dx, dy) < 10) return;
      if(dx > 0 && Math.abs(dx) > Math.abs(dy)){
        swiping = true;
        content.classList.add('swiping');
        content.dispatchEvent(new CustomEvent('swipestart'));
        try{ content.setPointerCapture(e.pointerId); }catch(err){}
      } else { tracking = false; return; }
    }
    setTx(Math.max(0, Math.min(dx, SWIPE_AUTO + 40)));
  });
  const end = dx=>{
    content.classList.remove('swiping');
    justSwiped = true;
    setTimeout(()=>{ justSwiped = false; }, 400);
    if(dx >= SWIPE_AUTO){ doDelete(); return; }
    if(dx >= SWIPE_REVEAL){ setTx(SWIPE_REVEAL); revealedSwipeId = id; }
    else { setTx(0); if(revealedSwipeId === id) revealedSwipeId = null; }
  };
  content.addEventListener('pointerup', e=>{ if(swiping){ swiping = false; end(e.clientX - startX); } tracking = false; });
  content.addEventListener('pointercancel', ()=>{ if(swiping){ swiping = false; end(0); } tracking = false; });
  // Il tocco che chiude uno swipe (o che tocca una riga col cestino aperto,
  // per richiuderla) non deve anche spuntare la voce o aprirne la modifica.
  content.addEventListener('click', e=>{
    if(justSwiped){ e.preventDefault(); e.stopPropagation(); return; }
    if(revealedSwipeId === id){ e.preventDefault(); e.stopPropagation(); setTx(0); revealedSwipeId = null; }
  }, true);
}
// Toglie una riga di Spesa (anche unita da più giorni: chiavi separate da
// virgola), con Annulla. Prima era il cestino sulla riga, senza Annulla.
function removeShopRowWithUndo(rowKey, label){
  const keys = rowKey.split(',');
  const prev = keys.map(k => ({ k, extra: state.shopExtras[k], dismissed: state.shopDismissed[k] }));
  keys.forEach(k=>{
    if(state.shopExtras[k]) delete state.shopExtras[k];
    else state.shopDismissed[k] = true;
  });
  persist(); render();
  showUndoToast(`${label || 'Voce'} tolto dalla lista`, ()=>{
    prev.forEach(({ k, extra, dismissed })=>{
      if(extra) state.shopExtras[k] = extra;
      if(dismissed === undefined) delete state.shopDismissed[k]; else state.shopDismissed[k] = dismissed;
    });
    persist(); render();
  });
}
// Swipe in Dispensa = "l'ho finito": quantità a 0, come arrivarci col "−".
// La voce resta (unità, categoria, luogo, gruppo) e compare in Spesa tra i
// "Finiti in Dispensa"; eliminarla del tutto resta in Modifica ingrediente.
function finishPantryItemWithUndo(key){
  const it = state.pantryItems[key];
  if(!it) return;
  const prevQty = it.qty;
  const wasSelected = !!state.pantrySelected[key];
  it.qty = 0;
  delete state.pantrySelected[key];
  persist(); render();
  showUndoToast(`${it.nome} finito: è in Spesa tra i Finiti`, ()=>{
    const cur = state.pantryItems[key];
    if(cur) cur.qty = prevQty;
    if(wasSelected) state.pantrySelected[key] = true;
    persist(); render();
  });
}
// Scorta arrivata a 0 con −, spunta o numero scritto: invece di finire
// subito tra i Finiti chiede con un tooltip sulla riga (come quello del
// luogo): "+" = in lista spesa nel suo reparto, cestino = tra i Finiti come
// prima. Toccare fuori annulla: la quantità resta quella di prima.
function confirmPantryFinish(key, toList){
  const it = state.pantryItems[key];
  state.pantryFinishPicker = null;
  if(!it){ render(); return; }
  const prevQty = it.qty;
  const hadConfirmed = key in state.pantryConfirmedShop, prevConfirmed = state.pantryConfirmedShop[key];
  const wasSelected = !!state.pantrySelected[key];
  it.qty = 0;
  delete state.pantrySelected[key];
  if(toList) state.pantryConfirmedShop[key] = true;
  persist(); render();
  showUndoToast(toList ? `${it.nome} aggiunto alla lista spesa` : `${it.nome} finito: è in Spesa tra i Finiti`, ()=>{
    const cur = state.pantryItems[key];
    if(cur) cur.qty = prevQty;
    if(hadConfirmed) state.pantryConfirmedShop[key] = prevConfirmed; else delete state.pantryConfirmedShop[key];
    if(wasSelected) state.pantrySelected[key] = true;
    persist(); render();
  });
}
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

// Piatti di un pasto (+ piatto, Cambia/✕ del singolo piatto, portata nella
// scelta, fisarmonica nel dettaglio): delegati su document una sola volta,
// invece che riagganciati riga per riga a ogni render come il resto di
// attachHandlers() — nessuna riga resta senza handler dopo un re-render ravvicinato.
// Una voce del menù ⋯ del dettaglio chiude il menù prima di fare la sua azione.
document.addEventListener('click', e=>{
  if(e.target.closest('.meal-menu .topbar-menu-item')){ state.mealDetailMenuOpen = false; state.recipeMenuOpen = false; }
}, true);
document.addEventListener('click', e=>{
  const openEl = e.target.closest('[data-open-dish-picker]');
  if(openEl){
    state.dishPicker = { key: openEl.dataset.openDishPicker, replace: openEl.dataset.dishReplace || null, tipo: null, search: '' };
    state.swapOpenDay = null;
    state.linkPickerOpenDay = null;
    state.avanzoDiPickerOpenDay = null;
    render();
    return;
  }
  if(e.target.closest('[data-close-dish-picker]')){ state.dishPicker = null; render(); return; }
  const courseEl = e.target.closest('[data-dish-course]');
  if(courseEl && state.dishPicker){ state.dishPicker.tipo = courseEl.dataset.dishCourse; render(); return; }
  const pickEl = e.target.closest('[data-dish-pick]');
  if(pickEl && state.dishPicker){
    const { weekIdx, i, meal } = parseMealKey(pickEl.dataset.dishKey);
    const name = pickEl.dataset.dishPick;
    const oldName = state.dishPicker.replace;
    const snap = snapshotMealDishes(weekIdx, i, meal);
    if(oldName) replaceMealDish(weekIdx, i, meal, oldName, name);
    else addMealDish(weekIdx, i, meal, name);
    if(state.dishPicker.tipo === 'freezer') setFreezerDish(mealKey(weekIdx, i, meal), name, true);
    state.dishPicker = null;
    persist(); render();
    if(oldName) showUndoToast('Piatto cambiato', ()=>{ restoreMealDishes(weekIdx, i, meal, snap); persist(); render(); });
    return;
  }
  const removeEl = e.target.closest('[data-dish-remove]');
  if(removeEl){
    const { weekIdx, i, meal } = parseMealKey(removeEl.dataset.dishRemove);
    removeMealDish(weekIdx, i, meal, removeEl.dataset.dishName);
    return;
  }
  const invEl = e.target.closest('[data-inv-has],[data-inv-qty],[data-inv-luogo],[data-inv-ok]');
  if(invEl){
    const name = invEl.dataset.invName;
    const it = state.pantryItems[name.trim().toLowerCase()];
    if(invEl.hasAttribute('data-inv-ok')) inventoryConfirm(name);
    else if(invEl.hasAttribute('data-inv-has')) inventorySetHas(name, invEl.dataset.invHas === '1');
    else if(it && invEl.hasAttribute('data-inv-qty')){
      const step = qtyStepFor(it.unit || '');
      it.qty = Math.max(0, Math.round(((it.qty || 0) + step * Number(invEl.dataset.invQty)) * 100) / 100);
      if(it.qty === 0) inventorySetHas(name, false);
    } else if(it) it.luogo = invEl.dataset.invLuogo;
    persist(); render();
    return;
  }
  const prepEl = e.target.closest('[data-prep-done],[data-prep-double],[data-prep-toggle]');
  if(prepEl){
    const mk = prepEl.dataset.prepKey, name = prepEl.dataset.prepName;
    const { weekIdx, i, meal } = parseMealKey(mk);
    const plan = getDishPlan(mk, name);
    const unfreeze = ()=>{ if(plan.frozen){ takeFreezerPortions(name, mealPortions(mk, effectiveMeal(weekIdx, i, meal).principale)); setDishPlan(mk, name, { frozen: false }); } };
    if(prepEl.hasAttribute('data-prep-done')){
      setDishPlan(mk, name, { done: !plan.done });
      if(!plan.done) freezeDoubleIfReady(weekIdx, i, meal, name); else unfreeze();
    } else if(prepEl.hasAttribute('data-prep-double')){
      if(plan.double) unfreeze();
      setDishPlan(mk, name, { double: !plan.double });
      if(!plan.double && plan.done) freezeDoubleIfReady(weekIdx, i, meal, name);
    } else {
      const cand = prepCandidates(weekIdx).find(c => c.mk === mk && c.name === name);
      setDishPlan(mk, name, { prep: !(cand && cand.chosen) });
    }
    persist(); render();
    return;
  }
  const prepDayEl = e.target.closest('[data-prep-day]');
  if(prepDayEl){
    if(!state.prepDay) state.prepDay = {};
    state.prepDay[prepDayEl.dataset.prepWeek] = prepDayEl.dataset.prepDay;
    persist(); render();
    return;
  }
  const suggEl = e.target.closest('[data-prep-sugg]');
  if(suggEl){
    const iso = suggEl.dataset.prepSugg;
    state.prepSuggOpen[iso] = !state.prepSuggOpen[iso];
    render();
    return;
  }
});

// --- Carte fedeltà -------------------------------------------------------------
// Come Stocard: le tessere dei negozi (nome, numero, colore) salvate nello
// spazio, da mostrare in cassa col codice a barre a tutto schermo. Si
// gestiscono da Impostazioni → Carte fedeltà e si aprono da Spesa → Carte.
// Il codice si disegna qui (EAN-13/EAN-8 se il numero lo è, altrimenti
// Code 128); il numero si può scrivere o leggere con la fotocamera
// (BarcodeDetector, su Android con Chrome).
const CARD_COLORS = ['#e03c1e', '#1e88e5', '#43a047', '#f9a825', '#8e24aa', '#ef6c00', '#00897b', '#5d4037', '#37474f'];
const EAN_L = ['0001101','0011001','0010011','0111101','0100011','0110001','0101111','0111011','0110111','0001011'];
const EAN_G = ['0100111','0110011','0011011','0100001','0011101','0111001','0000101','0010001','0001001','0010111'];
const EAN_R = ['1110010','1100110','1101100','1000010','1011100','1001110','1010000','1000100','1001000','1110100'];
const EAN_PARITY = ['LLLLLL','LLGLGG','LLGGLG','LLGGGL','LGLLGG','LGGLLG','LGGGLL','LGLGLG','LGLGGL','LGGLGL'];
const CODE128 = ['212222','222122','222221','121223','121322','131222','122213','122312','132212','221213','221312','231212','112232','122132','122231','113222','123122','123221','223211','221132','221231','213212','223112','312131','311222','321122','321221','312212','322112','322211','212123','212321','232121','111323','131123','131321','112313','132113','132311','211313','231113','231311','112133','112331','132131','113123','113321','133121','313121','211331','231131','213113','213311','213131','311123','311321','331121','312113','312311','332111','314111','221411','431111','111224','111422','121124','121421','141122','141221','112214','112412','122114','122411','142112','142211','241211','221114','413111','241112','134111','111242','121142','121241','114212','124112','124211','411212','421112','421211','212141','214121','412121','111143','111341','131141','114113','114311','411113','411311','113141','114131','311141','411131','211412','211214','211232','2331112'];
// Code 39 (n = stretto, w = largo; barra/spazio alternati, 9 elementi).
const CODE39 = { '0':'nnnwwnwnn','1':'wnnwnnnnw','2':'nnwwnnnnw','3':'wnwwnnnnn','4':'nnnwwnnnw','5':'wnnwwnnnn','6':'nnwwwnnnn','7':'nnnwnnwnw','8':'wnnwnnwnn','9':'nnwwnnwnn','A':'wnnnnwnnw','B':'nnwnnwnnw','C':'wnwnnwnnn','D':'nnnnwwnnw','E':'wnnnwwnnn','F':'nnwnwwnnn','G':'nnnnnwwnw','H':'wnnnnwwnn','I':'nnwnnwwnn','J':'nnnnwwwnn','K':'wnnnnnnww','L':'nnwnnnnww','M':'wnwnnnnwn','N':'nnnnwnnww','O':'wnnnwnnwn','P':'nnwnwnnwn','Q':'nnnnnnwww','R':'wnnnnnwwn','S':'nnwnnnwwn','T':'nnnnwnwwn','U':'wwnnnnnnw','V':'nwwnnnnnw','W':'wwwnnnnnn','X':'nwnnwnnnw','Y':'wwnnwnnnn','Z':'nwwnwnnnn','-':'nwnnnnwnw','.':'wwnnnnwnn',' ':'nwwnnnwnn','*':'nwnnwnwnn','$':'nwnwnwnnn','/':'nwnwnnnwn','+':'nwnnnwnwn','%':'nnnwnwnwn' };
function code39Modules(text){
  const chars = ('*' + text.toUpperCase().replace(/[^0-9A-Z\-. $/+%]/g, '') + '*').split('');
  return chars.map(ch => CODE39[ch].split('').map((w, idx) => (idx % 2 === 0 ? '1' : '0').repeat(w === 'w' ? 3 : 1)).join('')).join('0');
}
// QR (modo byte, correzione M, versioni 1–10): abbastanza per i numeri e i
// codici delle carte. Segue lo standard ISO 18004 (come la libreria di
// riferimento di Nayuki), maschera scelta col punteggio di penalità.
const QR_M = [null, [10,[[1,16]]], [16,[[1,28]]], [26,[[1,44]]], [18,[[2,32]]], [24,[[2,43]]], [16,[[4,27]]], [18,[[4,31]]], [22,[[2,38],[2,39]]], [22,[[3,36],[2,37]]], [26,[[4,43],[1,44]]]];
const QR_ALIGN = [null, [], [6,18], [6,22], [6,26], [6,30], [6,34], [6,22,38], [6,24,42], [6,26,46], [6,28,50]];
function gfMul(a, b){ let r = 0; for(let i = 7; i >= 0; i--){ r = (r << 1) ^ ((r >>> 7) * 0x11D); r ^= ((b >>> i) & 1) * a; } return r & 0xFF; }
function rsDivisor(degree){
  const res = new Array(degree).fill(0); res[degree - 1] = 1; let root = 1;
  for(let i = 0; i < degree; i++){
    for(let j = 0; j < degree; j++){ res[j] = gfMul(res[j], root); if(j + 1 < degree) res[j] ^= res[j + 1]; }
    root = gfMul(root, 0x02);
  }
  return res;
}
function rsRemainder(data, div){
  const res = new Array(div.length).fill(0);
  data.forEach(b => { const f = b ^ res.shift(); res.push(0); div.forEach((d, i) => { res[i] ^= gfMul(d, f); }); });
  return res;
}
function qrMatrix(text){
  const bytes = Array.from(new TextEncoder().encode(text));
  let ver = 1;
  const dataCap = v => QR_M[v][1].reduce((a, [n, k]) => a + n * k, 0);
  while(ver <= 10 && 4 + (ver < 10 ? 8 : 16) + bytes.length * 8 > dataCap(ver) * 8) ver++;
  if(ver > 10) return null;
  const bits = [];
  const put = (val, len) => { for(let i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1); };
  put(4, 4); put(bytes.length, ver < 10 ? 8 : 16); bytes.forEach(b => put(b, 8));
  const capBits = dataCap(ver) * 8;
  put(0, Math.min(4, capBits - bits.length));
  put(0, (8 - bits.length % 8) % 8);
  const data = [];
  for(let i = 0; i < bits.length; i += 8) data.push(parseInt(bits.slice(i, i + 8).join(''), 2));
  for(let pad = 0xEC; data.length < dataCap(ver); pad ^= 0xEC ^ 0x11) data.push(pad);
  const [ecLen, groups] = QR_M[ver];
  const div = rsDivisor(ecLen);
  const blocks = []; let off = 0;
  groups.forEach(([n, k]) => { for(let b = 0; b < n; b++){ const d = data.slice(off, off + k); off += k; blocks.push({ d, e: rsRemainder(d, div) }); } });
  const out = [];
  const maxK = Math.max(...blocks.map(b => b.d.length));
  for(let i = 0; i < maxK; i++) blocks.forEach(b => { if(i < b.d.length) out.push(b.d[i]); });
  for(let i = 0; i < ecLen; i++) blocks.forEach(b => out.push(b.e[i]));
  const size = ver * 4 + 17;
  const mod = Array.from({ length: size }, () => new Array(size).fill(false));
  const fn = Array.from({ length: size }, () => new Array(size).fill(false));
  const set = (x, y, dark) => { mod[y][x] = dark; fn[y][x] = true; };
  for(let i = 0; i < size; i++){ set(6, i, i % 2 === 0); set(i, 6, i % 2 === 0); }
  const finder = (cx, cy) => { for(let dy = -4; dy <= 4; dy++) for(let dx = -4; dx <= 4; dx++){ const x = cx + dx, y = cy + dy; if(x < 0 || y < 0 || x >= size || y >= size) continue; const d = Math.max(Math.abs(dx), Math.abs(dy)); set(x, y, d !== 2 && d !== 4); } };
  finder(3, 3); finder(size - 4, 3); finder(3, size - 4);
  const al = QR_ALIGN[ver];
  al.forEach((ay, i) => al.forEach((ax, j) => {
    if((i === 0 && j === 0) || (i === 0 && j === al.length - 1) || (i === al.length - 1 && j === 0)) return;
    for(let dy = -2; dy <= 2; dy++) for(let dx = -2; dx <= 2; dx++) set(ax + dx, ay + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
  }));
  const drawFormat = mask => {
    const d = (0 << 3) | mask; let rem = d;
    for(let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    const b = ((d << 10) | rem) ^ 0x5412;
    const bit = i => ((b >>> i) & 1) === 1;
    for(let i = 0; i <= 5; i++) set(8, i, bit(i));
    set(8, 7, bit(6)); set(8, 8, bit(7)); set(7, 8, bit(8));
    for(let i = 9; i < 15; i++) set(14 - i, 8, bit(i));
    for(let i = 0; i < 8; i++) set(size - 1 - i, 8, bit(i));
    for(let i = 8; i < 15; i++) set(8, size - 15 + i, bit(i));
    set(8, size - 8, true);
  };
  drawFormat(0);
  if(ver >= 7){
    let rem = ver; for(let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1F25);
    const b = (ver << 12) | rem;
    for(let i = 0; i < 18; i++){ const dark = ((b >>> i) & 1) === 1; const a = size - 11 + i % 3, c = Math.floor(i / 3); set(a, c, dark); set(c, a, dark); }
  }
  let k = 0;
  for(let right = size - 1; right >= 1; right -= 2){
    if(right === 6) right = 5;
    for(let v = 0; v < size; v++) for(let j = 0; j < 2; j++){
      const x = right - j, up = ((right + 1) & 2) === 0, y = up ? size - 1 - v : v;
      if(!fn[y][x] && k < out.length * 8){ mod[y][x] = ((out[k >>> 3] >>> (7 - (k & 7))) & 1) === 1; k++; }
    }
  }
  const maskFn = [(x,y)=>(x+y)%2===0,(x,y)=>y%2===0,(x,y)=>x%3===0,(x,y)=>(x+y)%3===0,(x,y)=>(Math.floor(x/3)+Math.floor(y/2))%2===0,(x,y)=>x*y%2+x*y%3===0,(x,y)=>(x*y%2+x*y%3)%2===0,(x,y)=>((x+y)%2+x*y%3)%2===0];
  const applyMask = m => { for(let y = 0; y < size; y++) for(let x = 0; x < size; x++) if(!fn[y][x] && maskFn[m](x, y)) mod[y][x] = !mod[y][x]; };
  const penalty = () => {
    let p = 0, dark = 0;
    for(let y = 0; y < size; y++){ let run = 1; for(let x = 1; x < size; x++){ if(mod[y][x] === mod[y][x-1]){ run++; if(run === 5) p += 3; else if(run > 5) p++; } else run = 1; } }
    for(let x = 0; x < size; x++){ let run = 1; for(let y = 1; y < size; y++){ if(mod[y][x] === mod[y-1][x]){ run++; if(run === 5) p += 3; else if(run > 5) p++; } else run = 1; } }
    for(let y = 0; y < size - 1; y++) for(let x = 0; x < size - 1; x++){ const c = mod[y][x]; if(c === mod[y][x+1] && c === mod[y+1][x] && c === mod[y+1][x+1]) p += 3; }
    mod.forEach(r => r.forEach(c => { if(c) dark++; }));
    return p + Math.floor(Math.abs(dark * 20 - size * size * 10) / (size * size)) * 10;
  };
  let best = 0, bestP = Infinity;
  for(let m = 0; m < 8; m++){ applyMask(m); drawFormat(m); const p = penalty(); if(p < bestP){ bestP = p; best = m; } applyMask(m); }
  applyMask(best); drawFormat(best);
  return mod;
}
function qrSvg(text){
  const m = qrMatrix(text);
  if(!m) return '';
  const q = 4, n = m.length + q * 2;
  let rects = '';
  m.forEach((row, y) => row.forEach((c, x) => { if(c) rects += `<rect x="${x + q}" y="${y + q}" width="1" height="1"/>`; }));
  return `<svg class="card-qr" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges" role="img" aria-label="QR ${escapeAttr(text)}"><rect width="${n}" height="${n}" fill="#fff"/><g fill="#000">${rects}</g></svg>`;
}
function eanCheckDigit(digits){
  const sum = digits.split('').reverse().reduce((acc, d, idx) => acc + Number(d) * (idx % 2 === 0 ? 3 : 1), 0);
  return String((10 - sum % 10) % 10);
}
// Il codice da disegnare per un numero: EAN se ha la forma (e la cifra di
// controllo) giusta, altrimenti Code 128, che va bene per qualsiasi testo.
// format = quello letto dalla foto (BarcodeDetector: 'code_128', 'ean_13',
// 'code_39', 'qr_code'...) quando c'è: la cassa si aspetta quel codice lì.
function cardBarcodeKind(number, format){
  if(format === 'qr_code') return 'qr';
  if(format === 'code_39') return 'code39';
  if(format === 'code_128') return 'code128';
  if(/^\d{13}$/.test(number) && eanCheckDigit(number.slice(0, 12)) === number[12]) return 'ean13';
  if(/^\d{12}$/.test(number) && eanCheckDigit(number.slice(0, 11)) === number[11]) return 'upca';
  if(/^\d{8}$/.test(number) && eanCheckDigit(number.slice(0, 7)) === number[7]) return 'ean8';
  return 'code128';
}
// Moduli (1 = barra, 0 = spazio) del codice.
function barcodeModules(number, format){
  const kind = cardBarcodeKind(number, format);
  if(kind === 'code39') return code39Modules(number);
  if(kind === 'ean13' || kind === 'upca'){
    const n = kind === 'upca' ? '0' + number : number;
    const parity = EAN_PARITY[Number(n[0])];
    let m = '101';
    for(let k = 1; k <= 6; k++) m += (parity[k - 1] === 'L' ? EAN_L : EAN_G)[Number(n[k])];
    m += '01010';
    for(let k = 7; k <= 12; k++) m += EAN_R[Number(n[k])];
    return m + '101';
  }
  if(kind === 'ean8'){
    let m = '101';
    for(let k = 0; k < 4; k++) m += EAN_L[Number(number[k])];
    m += '01010';
    for(let k = 4; k < 8; k++) m += EAN_R[Number(number[k])];
    return m + '101';
  }
  // Code 128: set C per le coppie di cifre (numeri lunghi, più compatto),
  // set B per tutto il resto.
  const codes = [];
  const allDigits = /^\d+$/.test(number) && number.length % 2 === 0;
  if(allDigits){
    codes.push(105);
    for(let k = 0; k < number.length; k += 2) codes.push(Number(number.slice(k, k + 2)));
  } else {
    codes.push(104);
    for(const ch of number){
      const c = ch.charCodeAt(0);
      codes.push(c >= 32 && c <= 127 ? c - 32 : 0);
    }
  }
  const check = codes.reduce((acc, c, idx) => acc + c * (idx === 0 ? 1 : idx), 0) % 103;
  codes.push(check, 106);
  let m = '';
  codes.forEach(c => { CODE128[c].split('').forEach((w, idx) => { m += (idx % 2 === 0 ? '1' : '0').repeat(Number(w)); }); });
  return m;
}
function barcodeSvg(number, format){
  if(format === 'qr_code') return qrSvg(number);
  const m = barcodeModules(number, format);
  const quiet = 10, w = m.length + quiet * 2, h = 60;
  let x = quiet, rects = '';
  for(let k = 0; k < m.length; k++){
    if(m[k] !== '1') continue;
    let run = 1;
    while(m[k + run] === '1') run++;
    rects += `<rect x="${k + quiet}" y="0" width="${run}" height="${h}"/>`;
    k += run - 1;
  }
  return `<svg class="card-barcode" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" role="img" aria-label="Codice a barre ${escapeAttr(number)}"><rect width="${w}" height="${h}" fill="#fff"/><g fill="#000">${rects}</g></svg>`;
}
function cardColor(card){ return card.color || CARD_COLORS[0]; }
// Testo scuro sui colori chiari (carte bianche come Iper o laFeltrinelli).
function cardInk(color){
  const m = /^#?([0-9a-f]{6})$/i.exec(color || '');
  if(!m) return '#fff';
  const n = parseInt(m[1], 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  return (0.299 * r + 0.587 * g + 0.114 * b) > 170 ? '#1a1a1a' : '#fff';
}
function cardStyle(color){ return `--card-color:${escapeAttr(color)};--card-ink:${cardInk(color)}`; }
function newCardDraft(){ return { id: null, name: '', number: '', color: CARD_COLORS[(state.loyaltyCards || []).length % CARD_COLORS.length] }; }
// Tessera: col logo, se c'è (il nome resta per la ricerca e per i lettori di
// schermo), altrimenti il nome in grande sul colore della carta.
function cardTileHtml(card, attr){
  const inner = card.logo
    ? `<img class="card-tile-logo" src="${escapeAttr(card.logo)}" alt="">`
    : `<span class="card-tile-name">${escapeHtml(card.name)}</span>`;
  return `<button type="button" class="card-tile${card.logo ? ' has-logo' : ''}" ${attr} style="${cardStyle(cardColor(card))}" aria-label="${escapeAttr(card.name)}">${inner}</button>`;
}
function sortedCards(){ return (state.loyaltyCards || []).slice().sort((a, b) => IT_COLLATOR.compare(a.name, b.name)); }
// La pagina (elenco/gestione) resta sotto anche con una carta aperta o
// l'import da confermare: sono finestre sopra, non un cambio di pagina, così
// chiudendole l'elenco non rifà l'animazione d'ingresso.
// --- Ordine corsie (Spesa) ---------------------------------------------------
// I reparti della Spesa nell'ordine in cui si gira il proprio supermercato:
// si trascinano dalla maniglia ⠿ (la riga si sposta nel DOM mentre il dito
// scorre, l'ordine si salva al rilascio) oppure con le frecce su/giù.
function renderAislesPage(){
  if(!state.aisleOrderOpen) return '';
  const list = shopAisles();
  const rows = list.map((d, i) => `
      <div class="manage-row aisle-row" data-aisle-row="${escapeAttr(d)}">
        <span class="aisle-handle" data-aisle-handle aria-hidden="true">⠿</span>
        <span class="manage-row-icon">${DEPT_ICON[d] || ''}</span>
        <span class="manage-row-main">${escapeHtml(DEPT_LABEL[d])}${d === 'altro-casa' ? ' (casa)' : ''}</span>
        <button type="button" class="btn is-icon aisle-move" data-aisle-move="${escapeAttr(d)}" data-dir="-1" aria-label="Sposta su" ${i === 0 ? 'disabled' : ''}>↑</button>
        <button type="button" class="btn is-icon aisle-move" data-aisle-move="${escapeAttr(d)}" data-dir="1" aria-label="Sposta giù" ${i === list.length - 1 ? 'disabled' : ''}>↓</button>
      </div>`).join('');
  const body = `
      <p class="settings-note manage-intro">L'ordine dei reparti nella lista della Spesa: mettili come li trovi girando il tuo supermercato. Trascinali dalla maniglia ⠿ o usa le frecce.</p>
      <section class="settings-section"><div class="settings-card manage-list">${rows}</div></section>
      ${(state.shopAisleCustom || []).length ? '<button type="button" class="btn is-outline is-block" data-aisle-reset>Ripristina ordine originale</button>' : ''}`;
  return managePageHtml({ key: 'aisles', title: 'Ordine corsie', closeAttr: 'data-close-aisles', body });
}
document.addEventListener('click', e=>{
  const t = e.target;
  if(t.closest('[data-open-aisles]')){ state.aisleOrderOpen = true; render(); return; }
  const closeEl = t.closest('[data-close-aisles]');
  if(closeEl){
    if(!isCloseTap(e, closeEl)) return;
    state.aisleOrderOpen = false; render(); return;
  }
  const move = t.closest('[data-aisle-move]');
  if(move){
    const list = shopAisles();
    const i = list.indexOf(move.dataset.aisleMove), j = i + Number(move.dataset.dir);
    if(i < 0 || j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    state.shopAisleCustom = list;
    persist(); render(); return;
  }
  if(t.closest('[data-aisle-reset]')){ state.shopAisleCustom = []; persist(); render(); }
}, true);
(function(){
  let drag = null; // { row, list, scroller, pointerId, lastY, raf }
  const autoScroll = () => {
    if(!drag) return;
    const r = drag.scroller.getBoundingClientRect(), edge = 48;
    const dy = drag.lastY < r.top + edge ? -8 : drag.lastY > r.bottom - edge ? 8 : 0;
    if(dy){ drag.scroller.scrollTop += dy; reorder(); }
    drag.raf = requestAnimationFrame(autoScroll);
  };
  const reorder = () => {
    const rows = [...drag.list.querySelectorAll('[data-aisle-row]')].filter(r => r !== drag.row);
    const next = rows.find(r => { const b = r.getBoundingClientRect(); return drag.lastY < b.top + b.height / 2; });
    if(next){ if(drag.row.nextElementSibling !== next) drag.list.insertBefore(drag.row, next); }
    else if(drag.list.lastElementChild !== drag.row) drag.list.appendChild(drag.row);
  };
  document.addEventListener('pointerdown', e=>{
    const handle = e.target.closest('[data-aisle-handle]');
    if(!handle) return;
    const row = handle.closest('[data-aisle-row]');
    e.preventDefault();
    drag = { row, list: row.parentElement, scroller: row.closest('.sheet-body') || document.scrollingElement, pointerId: e.pointerId, lastY: e.clientY };
    row.classList.add('is-dragging');
    drag.raf = requestAnimationFrame(autoScroll);
  });
  document.addEventListener('pointermove', e=>{
    if(!drag || e.pointerId !== drag.pointerId) return;
    e.preventDefault();
    drag.lastY = e.clientY;
    reorder();
  }, { passive: false });
  const end = e=>{
    if(!drag || e.pointerId !== drag.pointerId) return;
    cancelAnimationFrame(drag.raf);
    const order = [...drag.list.querySelectorAll('[data-aisle-row]')].map(r => r.dataset.aisleRow);
    drag.row.classList.remove('is-dragging');
    drag = null;
    if(order.join() !== shopAisles().join()){ state.shopAisleCustom = order; persist(); }
    render();
  };
  document.addEventListener('pointerup', end);
  document.addEventListener('pointercancel', end);
})();

// --- Libro di cucina ---------------------------------------------------------
// Album di ricette per le occasioni (il menù di Natale, le cene con gli
// amici...): state.cookbooks, per spazio. Un album tiene solo i nomi delle
// ricette; una ricetta eliminata sparisce dall'album da sola (getRecipeMeta).
function cookbooksList(){ return (state.cookbooks || []).filter(c => c && c.id); }
function cookbookById(id){ return cookbooksList().find(c => c.id === id) || null; }
function cookbookRecipes(cb){ return (cb && cb.recipes || []).filter(n => getRecipeMeta(n)); }
function cookbooksWith(name){ return cookbooksList().filter(c => (c.recipes || []).includes(name)); }
function cookbookThumbHtml(name){
  ensureRecipePhoto(name);
  const c = recipePhotoCache[name];
  if(c && c.status === 'ok') return `<img src="${escapeAttr(c.src)}" alt="">`;
  const r = getRecipeMeta(name);
  return `<span class="cookbook-thumb-emoji">${r ? catIcon(r.categoriaNew) : '🍽️'}</span>`;
}
function renderCookbooksView(){
  const list = cookbooksList();
  const cards = list.map(cb => {
    const rs = cookbookRecipes(cb);
    const thumbs = rs.slice(0, 3).map((n, i) => `<span class="cookbook-photo p${i}">${cookbookThumbHtml(n)}</span>`).join('');
    return `
      <button type="button" class="cookbook-card" data-cookbook-open="${escapeAttr(cb.id)}">
        <span class="cookbook-stack">${thumbs || '<span class="cookbook-photo p0 is-empty">📖</span>'}</span>
        <span class="cookbook-front">
          <span class="cookbook-name">${escapeHtml(cb.name)}</span>
          <span class="cookbook-count">${rs.length} ${rs.length === 1 ? 'ricetta' : 'ricette'}</span>
        </span>
      </button>`;
  }).join('');
  return `
    ${list.length ? '' : '<p class="cookbook-intro">Raccogli le ricette in album per le occasioni: il menù di Natale, le cene con gli amici, i dolci delle feste…</p>'}
    <div class="cookbook-grid">
      ${cards}
      <button type="button" class="cookbook-card is-new" data-cookbook-new>
        <span class="cookbook-add">+</span>
        <span class="cookbook-new-label">Nuovo album</span>
      </button>
    </div>`;
}
function renderCookbookPage(){
  const cb = cookbookById(state.cookbookOpenId);
  if(!cb) return '';
  const rs = cookbookRecipes(cb);
  const rows = rs.map(n => `
      <div class="cookbook-row">
        <button type="button" class="cookbook-row-main" data-toggle-recipe="${escapeAttr(n)}">
          <span class="cookbook-row-thumb">${cookbookThumbHtml(n)}</span>
          <span class="cookbook-row-name">${escapeHtml(n)}</span>
        </button>
        <button type="button" class="btn is-icon cookbook-row-remove" data-cookbook-remove="${escapeAttr(n)}" aria-label="Togli ${escapeAttr(n)} dall'album">✕</button>
      </div>`).join('');
  const body = `
      ${rs.length ? `<div class="settings-card cookbook-rows">${rows}</div>` : '<p class="settings-note">Album vuoto: aggiungi le ricette che vuoi tenere insieme.</p>'}
      ${rs.length ? '<button type="button" class="btn is-outline is-block cookbook-use-btn" data-cookbook-use>🍽️ Usa nel menù</button>' : ''}
      <button type="button" class="btn is-solid is-block cookbook-add-btn" data-cookbook-pick>+ Aggiungi ricette</button>
      ${state.cookbookMenuOpen ? `
      <div class="cookbook-menu-backdrop" data-cookbook-menu-close></div>
      <div class="topbar-menu cookbook-menu" role="menu">
        <button type="button" class="topbar-menu-item" role="menuitem" data-cookbook-rename="${escapeAttr(cb.id)}">✏️ Rinomina</button>
        <button type="button" class="topbar-menu-item color-delete" role="menuitem" data-cookbook-delete="${escapeAttr(cb.id)}">🗑️ Elimina album</button>
      </div>` : ''}`;
  const action = `<button type="button" class="btn is-icon cookbook-menu-btn" data-cookbook-menu aria-label="Impostazioni album" aria-expanded="${!!state.cookbookMenuOpen}">${DOTS_ICON_SVG}</button>`;
  return managePageHtml({ key: 'cookbook', title: escapeHtml(cb.name), closeAttr: 'data-close-cookbook', body, action });
}
function renderCookbookPicker(){
  const cb = state.cookbookPickOpen && cookbookById(state.cookbookOpenId);
  if(!cb) return '';
  const q = (state.cookbookPickSearch || '').trim().toLowerCase();
  const inAlbum = new Set(cb.recipes || []);
  const all = allRecipeMetas().filter(r => !q || r.nome.toLowerCase().includes(q)).sort((a, b) => IT_COLLATOR_BASE.compare(a.nome, b.nome));
  const rows = all.map(r => `
      <label class="cookbook-pick-row">
        <input type="checkbox" data-cookbook-pick-toggle="${escapeAttr(r.nome)}" ${inAlbum.has(r.nome) ? 'checked' : ''}>
        <span class="cookbook-row-name">${escapeHtml(r.nome)}</span>
        <span class="cat-icon">${catIcon(r.categoriaNew)}</span>
      </label>`).join('');
  const body = `
      ${listSearchHtml('cookbook-pick-search', state.cookbookPickSearch, 'Cerca una ricetta…')}
      <div class="settings-card cookbook-pick-list">${rows || '<p class="settings-note">Nessuna ricetta trovata.</p>'}</div>`;
  return managePageHtml({ key: 'cookbook-pick', title: `Aggiungi a “${escapeHtml(cb.name)}”`, closeAttr: 'data-close-cookbook-pick', body, footer: '<button type="button" class="btn is-solid is-block" data-close-cookbook-pick>Fatto</button>' });
}
// "Usa nel menù": tutte le ricette dell'album in un pasto (pranzo o cena) dei
// giorni in programma, da oggi in poi. Il piatto principale è il primo primo/
// piatto unico/secondo dell'album (o la prima ricetta), le altre vanno accanto.
function cookbookMealDishes(cb){
  const rs = cookbookRecipes(cb);
  const main = rs.find(n => ['primo','unico','secondo'].includes(dishCourse(n))) || rs[0];
  return { principale: main, contorni: rs.filter(n => n !== main) };
}
function renderCookbookUse(){
  const cb = state.cookbookUseOpen && cookbookById(state.cookbookOpenId);
  if(!cb) return '';
  const todayPos = findTodayPos() ?? 0;
  const slots = allMealSlots().filter(m => m.weekIdx !== 0 || WEEK_DISPLAY_ORDER.indexOf(m.i) >= todayPos);
  const days = [];
  slots.forEach(m => {
    const k = m.weekIdx + '_' + m.i;
    let d = days.find(x => x.k === k);
    if(!d){ d = { k, label: `${m.giorno} ${m.dateLabel}`, meals: [] }; days.push(d); }
    d.meals.push(m);
  });
  const body = `
      <p class="settings-note">Scegli il pasto: le ${cookbookRecipes(cb).length} ricette di «${escapeHtml(cb.name)}» prendono il suo posto.</p>
      ${days.map(d => `
      <section class="settings-section">
        <h3 class="settings-section-title">${escapeHtml(d.label)}</h3>
        <div class="cookbook-use-meals">
          ${d.meals.map(m => `<button type="button" class="cookbook-use-meal" data-cookbook-use-slot="${escapeAttr(m.key)}"><span class="cookbook-use-meal-label">${escapeHtml(MEAL_LABEL[m.meal])}</span><span class="cookbook-use-meal-now">${m.name ? escapeHtml(m.name) : 'Vuoto'}</span></button>`).join('')}
        </div>
      </section>`).join('')}`;
  return managePageHtml({ key: 'cookbook-use', title: 'Usa nel menù', closeAttr: 'data-close-cookbook-use', body });
}
// Modali globali (sopra anche il dettaglio ricetta): nome album, "Aggiungi a un album".
function renderCookbookModals(){
  let html = '';
  const forName = state.albumForRecipe;
  if(forName){
    const list = cookbooksList();
    html += `
    <div class="filters-modal-backdrop" data-close-album-for>
      <div class="filters-modal" data-stop-close>
        <div class="filters-modal-header"><h3>Album</h3><button class="btn is-icon filters-close-btn" data-close-album-for>✕</button></div>
        <p class="settings-note">Scegli in quali album mettere «${escapeHtml(forName)}».</p>
        <div class="album-for-list">
          ${list.map(cb => { const on = (cb.recipes || []).includes(forName); return `<button type="button" class="album-for-row${on ? ' active' : ''}" data-album-for-toggle="${escapeAttr(cb.id)}" aria-pressed="${on}"><span class="album-for-check">${on ? '✓' : ''}</span>${escapeHtml(cb.name)}</button>`; }).join('')}
          <button type="button" class="album-for-row is-new" data-cookbook-new data-for-recipe="${escapeAttr(forName)}"><span class="album-for-check">+</span>Nuovo album</button>
        </div>
        <div class="filters-modal-footer"><button class="btn is-solid mini-add-btn" data-close-album-for>Fatto</button></div>
      </div>
    </div>`;
  }
  const d = state.cookbookNameDraft;
  if(d){
    html += `
    <div class="filters-modal-backdrop" data-close-cookbook-name>
      <div class="filters-modal" data-stop-close>
        <div class="filters-modal-header"><h3>${d.id ? 'Rinomina album' : 'Nuovo album'}</h3><button class="btn is-icon filters-close-btn" data-close-cookbook-name>✕</button></div>
        <div class="filter-groups"><div class="filter-group">
          <div class="filter-group-label">Nome</div>
          <input type="text" id="cookbook-name" placeholder="Es. Menù di Natale" value="${escapeAttr(d.name || '')}" autocomplete="off">
        </div></div>
        <div class="filters-modal-footer"><button class="btn is-solid mini-add-btn" id="cookbook-name-save" type="button">${d.id ? 'Salva' : 'Crea'}</button></div>
      </div>
    </div>`;
  }
  return html;
}
function saveCookbookName(){
  const d = state.cookbookNameDraft;
  if(!d) return;
  const name = (d.name || '').trim();
  if(!name){ const el = document.getElementById('cookbook-name'); if(el) el.focus(); return; }
  state.cookbooks = cookbooksList();
  if(d.id){
    const cb = cookbookById(d.id);
    if(cb) cb.name = name;
  } else {
    const cb = { id: 'cb' + Date.now().toString(36), name, recipes: d.forRecipe ? [d.forRecipe] : [] };
    state.cookbooks.push(cb);
    if(!d.forRecipe) state.cookbookOpenId = cb.id;
  }
  state.cookbookNameDraft = null;
  persist(); render();
}
document.addEventListener('input', e=>{
  if(e.target.id === 'cookbook-name' && state.cookbookNameDraft) state.cookbookNameDraft.name = e.target.value;
  if(e.target.id === 'cookbook-pick-search'){ state.cookbookPickSearch = e.target.value; render(); }
});
document.addEventListener('keydown', e=>{ if(e.target.id === 'cookbook-name' && e.key === 'Enter'){ e.preventDefault(); saveCookbookName(); } });
document.addEventListener('change', e=>{
  const name = e.target.dataset && e.target.dataset.cookbookPickToggle;
  if(!name) return;
  const cb = cookbookById(state.cookbookOpenId);
  if(!cb) return;
  cb.recipes = (cb.recipes || []).filter(n => n !== name);
  if(e.target.checked) cb.recipes.push(name);
  persist(); render();
});
document.addEventListener('click', e=>{
  const t = e.target;
  const pv = t.closest('[data-prep-view]');
  if(pv){ state.prepView = pv.dataset.prepView; render(); return; }
  const newBtn = t.closest('[data-cookbook-new]');
  if(newBtn){ state.cookbookNameDraft = { id: null, name: '', forRecipe: newBtn.dataset.forRecipe || null }; render(); const el = document.getElementById('cookbook-name'); if(el) el.focus(); return; }
  // Prima le azioni dentro le finestre, poi la chiusura toccando lo sfondo
  // (lo sfondo contiene la finestra: closest lo troverebbe comunque).
  if(t.closest('#cookbook-name-save')){ saveCookbookName(); return; }
  const nameClose = t.closest('[data-close-cookbook-name]');
  if(nameClose){ if(!isCloseTap(e, nameClose)) return; state.cookbookNameDraft = null; render(); return; }
  const open = t.closest('[data-cookbook-open]');
  if(open){ state.cookbookOpenId = open.dataset.cookbookOpen; render(); return; }
  const close = t.closest('[data-close-cookbook]');
  if(close){ if(!isCloseTap(e, close)) return; state.cookbookOpenId = null; state.cookbookMenuOpen = false; render(); return; }
  if(t.closest('[data-cookbook-menu]')){ state.cookbookMenuOpen = !state.cookbookMenuOpen; render(); return; }
  if(t.closest('[data-cookbook-menu-close]')){ state.cookbookMenuOpen = false; render(); return; }
  if(t.closest('[data-cookbook-use]')){ state.cookbookUseOpen = true; render(); return; }
  const useClose = t.closest('[data-close-cookbook-use]');
  if(useClose){ if(!isCloseTap(e, useClose)) return; state.cookbookUseOpen = false; render(); return; }
  const useSlot = t.closest('[data-cookbook-use-slot]');
  if(useSlot){
    const cb = cookbookById(state.cookbookOpenId);
    const { weekIdx, i, meal } = parseMealKey(useSlot.dataset.cookbookUseSlot);
    if(!cb) return;
    const { principale, contorni } = cookbookMealDishes(cb);
    if(!principale) return;
    const snap = snapshotMealDishes(weekIdx, i, meal);
    writeMealDishes(weekIdx, i, meal, principale, contorni);
    state.cookbookUseOpen = false;
    persist(); render();
    const slot = allMealSlots().find(m => m.key === useSlot.dataset.cookbookUseSlot);
    showUndoToast(`«${cb.name}» a ${MEAL_LABEL[meal].toLowerCase()} di ${slot ? slot.giorno.toLowerCase() + ' ' + slot.dateLabel : 'quel giorno'}`, ()=>{ restoreMealDishes(weekIdx, i, meal, snap); persist(); render(); });
    return;
  }
  if(t.closest('[data-cookbook-pick]')){ state.cookbookPickOpen = true; state.cookbookPickSearch = ''; render(); return; }
  const pickClose = t.closest('[data-close-cookbook-pick]');
  if(pickClose){ if(!isCloseTap(e, pickClose)) return; state.cookbookPickOpen = false; state.cookbookPickSearch = ''; render(); return; }
  const rm = t.closest('[data-cookbook-remove]');
  if(rm){
    const cb = cookbookById(state.cookbookOpenId);
    if(!cb) return;
    const before = (cb.recipes || []).slice();
    cb.recipes = before.filter(n => n !== rm.dataset.cookbookRemove);
    persist(); render();
    showUndoToast('Tolta dall\'album', ()=>{ cb.recipes = before; persist(); render(); });
    return;
  }
  const ren = t.closest('[data-cookbook-rename]');
  if(ren){ state.cookbookMenuOpen = false; const cb = cookbookById(ren.dataset.cookbookRename); if(cb){ state.cookbookNameDraft = { id: cb.id, name: cb.name }; render(); const el = document.getElementById('cookbook-name'); if(el) el.focus(); } return; }
  const del = t.closest('[data-cookbook-delete]');
  if(del){
    const before = cookbooksList().map(c => ({ ...c, recipes: (c.recipes || []).slice() }));
    state.cookbooks = cookbooksList().filter(c => c.id !== del.dataset.cookbookDelete);
    state.cookbookOpenId = null; state.cookbookMenuOpen = false;
    persist(); render();
    showUndoToast('Album eliminato', ()=>{ state.cookbooks = before; persist(); render(); });
    return;
  }
  const af = t.closest('[data-album-for]');
  if(af){ state.albumForRecipe = af.dataset.albumFor; render(); return; }
  const aft = t.closest('[data-album-for-toggle]');
  if(aft){
    const cb = cookbookById(aft.dataset.albumForToggle), name = state.albumForRecipe;
    if(!cb || !name) return;
    const has = (cb.recipes || []).includes(name);
    cb.recipes = (cb.recipes || []).filter(n => n !== name);
    if(!has) cb.recipes.push(name);
    persist(); render();
    return;
  }
  const afClose = t.closest('[data-close-album-for]');
  if(afClose){ if(!isCloseTap(e, afClose)) return; state.albumForRecipe = null; render(); return; }
}, true);

// --- Importa ricetta (da Instagram o da un testo) ----------------------------
// CookPOP è nel menu "Condividi" del telefono (share_target nel manifest):
// condividendo un reel arriva qui con il link. Instagram non passa la
// didascalia, quindi la si incolla a mano e parseRecipeText ne ricava nome,
// ingredienti (con quantità) e procedimento, da controllare prima di salvare.
const RECIPE_UNIT_RE = '(?:kg|g|gr|grammi|hg|mg|l|lt|litri?|ml|cl|dl|cucchiai(?:ni|no)?|cucchiaio|tazz(?:a|e|ina|ine)|bicchier(?:e|i)|spicchi(?:o)?|fett(?:a|e)|pizzic(?:o|hi)|foglie|foglia|rametti?|mazzett(?:o|i)|bustin(?:a|e)|confezion(?:e|i)|scatolett(?:a|e)|vasett(?:o|i)|noce|pz|pezzi)';
function parseIngredientLine(line){
  let s = line.replace(/^[\s\-–—•·*▪️▫️◾◽✅✔️☑️🔸🔹👉➡️►▶️→]+/u, '').replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '').trim();
  s = s.replace(/[.;,]+$/, '').trim();
  if(!s) return null;
  const qb = /\b(q\.?\s?b\.?|quanto basta)\b/i;
  let m = s.match(new RegExp('^(\\d+(?:[.,]\\d+)?(?:\\s*[-/]\\s*\\d+(?:[.,]\\d+)?)?)\\s*(' + RECIPE_UNIT_RE + ')?\\.?\\s+(?:di\\s+|d\')?(.+)$', 'i'));
  if(m) return { ingrediente: capitalizeFirst(m[3].trim()), qta: (m[1] + (m[2] ? ' ' + m[2] : '')).replace(',', '.').trim() };
  m = s.match(new RegExp('^(.+?)[\\s:,-]+(\\d+(?:[.,]\\d+)?(?:\\s*[-/]\\s*\\d+)?)\\s*(' + RECIPE_UNIT_RE + ')?\\.?$', 'i'));
  if(m) return { ingrediente: capitalizeFirst(m[1].trim()), qta: (m[2] + (m[3] ? ' ' + m[3] : '')).replace(',', '.').trim() };
  if(qb.test(s)) return { ingrediente: capitalizeFirst(s.replace(qb, '').replace(/[\s:,-]+$/, '').trim()), qta: 'q.b.' };
  const words = { mezzo:'1/2', mezza:'1/2', un:'1', uno:'1', una:'1', due:'2', tre:'3', quattro:'4', cinque:'5', sei:'6' };
  m = s.match(/^(mezz[oa]|un[oa]?|due|tre|quattro|cinque|sei)\s+(.+)$/i);
  if(m) return { ingrediente: capitalizeFirst(m[2].replace(/^(?:di\s+|d')/i, '').trim()), qta: words[m[1].toLowerCase()] };
  return { ingrediente: capitalizeFirst(s), qta: '' };
}
function capitalizeFirst(s){ return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
function parseRecipeText(text){
  const lines = String(text || '').replace(/\r/g, '').split('\n').map(l => l.trim());
  const isHashtags = l => /^(#\S+\s*)+$/.test(l);
  const ingHeader = /^[^a-z0-9]*ingredienti\b/i, stepHeader = /^[^a-z0-9]*(procedimento|preparazione|metodo|come si fa|istruzioni|steps?)\b/i;
  const qtyLike = new RegExp('(^\\s*[-•·*▪️✅👉]|\\d+\\s*' + RECIPE_UNIT_RE + '\\b|\\bq\\.?\\s?b\\.?)', 'iu');
  let name = '', mode = '', ingredienti = [], procedimento = [], porzioni = '';
  lines.forEach(l => {
    if(!l || isHashtags(l)) return;
    if(ingHeader.test(l)){
      mode = 'ing';
      let rest = l.replace(ingHeader, '');
      // "(per 2 persone):" accanto al titolo: sono le porzioni, non un ingrediente.
      const por = rest.match(/per\s+(\d+)\s*(persone|porzioni|pers\.?)?/i);
      if(por){ porzioni = por[1] + ' ' + (por[2] && /porz/i.test(por[2]) ? 'porzioni' : 'persone'); rest = rest.replace(/\(?\s*per\s+\d+[^)]*\)?/i, ''); }
      rest = rest.replace(/^[^a-z0-9]+/i, '').trim();
      if(rest) rest.split(/,\s*/).forEach(x => { const it = parseIngredientLine(x); if(it && it.ingrediente) ingredienti.push(it); });
      return;
    }
    if(stepHeader.test(l)){ mode = 'steps'; const rest = l.replace(stepHeader, '').replace(/^[^a-z0-9]+/i, ''); if(rest) procedimento.push(rest); return; }
    if(mode === 'ing'){
      if(qtyLike.test(l) || l.length < 45){ const it = parseIngredientLine(l); if(it && it.ingrediente) ingredienti.push(it); return; }
      mode = 'steps';
    }
    if(mode === 'steps'){ procedimento.push(l.replace(/^\s*(\d+[.)]|[-•·*▪️👉➡️])\s*/u, '')); return; }
    if(!name){ name = l.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '').replace(/\s+/g, ' ').trim().slice(0, 70); return; }
    if(qtyLike.test(l) && /\d/.test(l)){ const it = parseIngredientLine(l); if(it) ingredienti.push(it); }
  });
  procedimento = procedimento.map(p => p.replace(/#\S+/g, '').trim()).filter(Boolean);
  // Titoli tutti in maiuscolo (frequenti nelle didascalie): in minuscolo con l'iniziale grande.
  if(name && name === name.toUpperCase() && /[A-Z]/.test(name)) name = name.toLowerCase();
  return { name: capitalizeFirst(name), ingredienti, procedimento, porzioni };
}
function renderRecipeImportPage(){
  const d = state.recipeImport;
  if(!d) return '';
  const parsed = parseRecipeText(d.text);
  const name = d.name || parsed.name;
  const preview = d.text ? `
      <section class="settings-section">
        <h3 class="settings-section-title">Ingredienti trovati (${parsed.ingredienti.length})</h3>
        <div class="settings-card import-preview">${parsed.ingredienti.length ? parsed.ingredienti.map(it => `<div class="import-ing"><span>${escapeHtml(it.ingrediente)}</span><span class="import-qta">${escapeHtml(it.qta)}</span></div>`).join('') : '<p class="settings-note">Nessuno: controlla che ci sia la parola «Ingredienti» o le quantità.</p>'}</div>
      </section>
      <section class="settings-section">
        <h3 class="settings-section-title">Procedimento (${parsed.procedimento.length} passaggi)</h3>
        <div class="settings-card import-preview">${parsed.procedimento.length ? `<ol class="import-steps">${parsed.procedimento.map(p => `<li>${escapeHtml(p)}</li>`).join('')}</ol>` : '<p class="settings-note">Nessun passaggio trovato.</p>'}</div>
      </section>
      <p class="settings-note">Dopo il salvataggio si apre la modifica: lì correggi quello che serve e scegli categoria e stagione.</p>` : '';
  const body = `
      <section class="settings-section">
        <div class="settings-card import-form">
          <label class="import-label">Nome<input type="text" id="import-name" value="${escapeAttr(name)}" placeholder="Es. Pasta con zucca e salsiccia" autocomplete="off"></label>
          <label class="import-label">Link (reel o sito)<input type="url" id="import-link" value="${escapeAttr(d.link || '')}" placeholder="https://www.instagram.com/reel/…" autocomplete="off"></label>
          <label class="import-label">Testo della ricetta
            <textarea id="import-text" rows="7" placeholder="Apri il reel, tocca la didascalia, copiala e incollala qui">${escapeHtml(d.text || '')}</textarea>
          </label>
          <button type="button" class="btn is-outline" data-import-paste>📋 Incolla dagli appunti</button>
        </div>
      </section>
      ${preview}`;
  const footer = `<button type="button" class="btn is-solid is-block" data-import-save ${name ? '' : 'disabled'}>Salva ricetta</button>`;
  return managePageHtml({ key: 'recipe-import', title: 'Importa ricetta', closeAttr: 'data-close-import', body, footer });
}
function saveRecipeImport(){
  const d = state.recipeImport;
  if(!d) return;
  const parsed = parseRecipeText(d.text);
  let name = (d.name || parsed.name || '').trim();
  if(!name) return;
  const taken = n => !!getRecipeMeta(n) || !!state.customRecipes[n] || Object.keys(recipeByName).some(k => k.toLowerCase() === n.toLowerCase());
  if(taken(name)){ let k = 2; while(taken(`${name} (${k})`)) k++; name = `${name} (${k})`; }
  state.customRecipes[name] = { nome: name };
  state.recipeEdits[name] = Object.assign({}, state.recipeEdits[name], { ingredienti: parsed.ingredienti, procedimento: parsed.procedimento, link: (d.link || '').trim() }, parsed.porzioni ? { porzioni: parsed.porzioni } : {});
  state.recipeImport = null;
  state.tab = 'prep'; state.prepView = 'ricette';
  state.recipeEditName = name;
  persist(); render();
}
// Arrivo dal menu "Condividi": ?share_url=…&share_text=…&share_title=…
function readShareTarget(){
  const q = new URLSearchParams(location.search);
  if(!q.has('share_url') && !q.has('share_text') && !q.has('share_title')) return false;
  const all = [q.get('share_url'), q.get('share_text'), q.get('share_title')].filter(Boolean).join('\n');
  const link = (all.match(/https?:\/\/\S+/) || [''])[0];
  const text = [q.get('share_text'), q.get('share_title')].filter(Boolean).join('\n').replace(link, '').trim();
  state.recipeImport = { name: '', link, text };
  state.tab = 'prep';
  history.replaceState(null, '', location.pathname + location.hash);
  return true;
}
readShareTarget();
document.addEventListener('input', e=>{
  const d = state.recipeImport;
  if(!d) return;
  if(e.target.id === 'import-name'){ d.name = e.target.value; const b = document.querySelector('[data-import-save]'); if(b) b.disabled = !(d.name.trim() || parseRecipeText(d.text).name); }
  if(e.target.id === 'import-link') d.link = e.target.value;
  if(e.target.id === 'import-text'){ d.text = e.target.value; clearTimeout(window.__importT); window.__importT = setTimeout(render, 400); }
});
document.addEventListener('click', e=>{
  const t = e.target;
  if(t.closest('[data-import-save]')){ saveRecipeImport(); return; }
  if(t.closest('[data-import-paste]')){
    if(!navigator.clipboard || !navigator.clipboard.readText){ const el = document.getElementById('import-text'); if(el) el.focus(); return; }
    navigator.clipboard.readText().then(txt => {
      if(!state.recipeImport || !txt) return;
      const link = (txt.match(/https?:\/\/\S+/) || [''])[0];
      if(link && !state.recipeImport.link) state.recipeImport.link = link;
      state.recipeImport.text = (state.recipeImport.text ? state.recipeImport.text + '\n' : '') + txt.replace(link, '').trim();
      render();
    }).catch(()=>{ const el = document.getElementById('import-text'); if(el) el.focus(); });
    return;
  }
  const close = t.closest('[data-close-import]');
  if(close){ if(!isCloseTap(e, close)) return; state.recipeImport = null; render(); }
}, true);

function renderCardsPages(){ return cardsPageHtml() + cardsOverlayHtml(); }
function cardsOverlayHtml(){
  const cards = state.loyaltyCards || [];
  if(state.cardsImport && state.cardsImport.length){
    const have = new Set(cards.map(c => c.number));
    const fresh = state.cardsImport.filter(c => !have.has(c.number));
    const logos = state.cardsImport.filter(c => c.logo && cards.some(x => x.number === c.number && !x.logo));
    const todo = fresh.length + logos.length;
    return `
  <div class="filters-modal-backdrop" data-cards-import-cancel>
    <div class="filters-modal" data-stop-close role="dialog" aria-label="Importa carte">
      <div class="filters-modal-header"><h3>Importa carte fedeltà</h3><button class="btn is-icon filters-close-btn" data-cards-import-cancel>✕</button></div>
      <p class="settings-note">${fresh.length ? `${fresh.length} carte da aggiungere${fresh.length < state.cardsImport.length ? ` (${state.cardsImport.length - fresh.length} le hai già)` : ''}:` : (logos.length ? 'Hai già queste carte.' : 'Hai già tutte queste carte.')}</p>
      <div class="card-import-list">${fresh.map(c => `<span class="card-import-chip" style="${cardStyle(c.color || CARD_COLORS[0])}">${escapeHtml(c.name)}</span>`).join('')}</div>
      ${logos.length ? `<p class="settings-note">E ${logos.length} loghi per le carte che hai già.</p>` : ''}
      <div class="filters-modal-footer">
        <button class="btn is-ghost" data-cards-import-cancel>Annulla</button>
        ${todo ? '<button class="btn is-solid" data-cards-import-ok>Importa</button>' : ''}
      </div>
    </div>
  </div>`;
  }
  if(state.cardViewId){
    const card = cards.find(c => c.id === state.cardViewId);
    if(card) return `
  <div class="card-view" data-close-card-view role="dialog" aria-label="${escapeAttr(card.name)}">
    <div class="card-view-inner" data-stop-close>
      <div class="card-view-head${card.logo ? ' has-logo' : ''}" style="${cardStyle(cardColor(card))}">
        ${card.logo ? `<img class="card-view-logo" src="${escapeAttr(card.logo)}" alt="${escapeAttr(card.name)}">` : `<span>${escapeHtml(card.name)}</span>`}
        <button type="button" class="btn is-icon card-view-close" data-close-card-view aria-label="Chiudi">✕</button>
      </div>
      <div class="card-view-code">${barcodeSvg(card.number, card.format)}</div>
      <div class="card-view-number">${escapeHtml(card.number)}</div>
      <p class="settings-note">Alza la luminosità se il lettore non lo legge.</p>
      <button type="button" class="btn is-outline card-view-edit" data-card-edit="${escapeAttr(card.id)}">✎ Modifica</button>
    </div>
  </div>`;
  }
  return '';
}
// Elenco (con "+" in alto per aggiungerne una) e, sopra, la scheda della
// carta da aggiungere o modificare (dal "+" o da "Modifica" nella carta
// aperta): l'elenco resta disegnato sotto, così tornando indietro non rientra.
function cardsPageHtml(){
  const cards = state.loyaltyCards || [];
  if(!state.cardsOpen) return '';
  let html = '';
  if(state.cardsOpen === 'list' || state.cardsListUnder){
    const q = (state.cardsSearch || '').trim().toLowerCase();
    const shown = sortedCards().filter(c => !q || c.name.toLowerCase().includes(q));
    const body = cards.length ? `
      <div class="search-field card-search">
        <input class="input-search" type="search" id="cards-search" placeholder="Cerca una carta…" value="${escapeAttr(state.cardsSearch || '')}" autocomplete="off">
      </div>
      ${shown.length ? `<div class="card-grid">${shown.map(c => cardTileHtml(c, `data-card-view="${escapeAttr(c.id)}"`)).join('')}</div>` : '<p class="settings-note">Nessuna carta con questo nome.</p>'}` : `
      <p class="settings-note">Nessuna carta salvata. Tocca + in alto per aggiungere le tessere dei negozi che usi, poi le mostri in cassa da qui.</p>`;
    html += managePageHtml({ key: 'cards', title: 'Carte fedeltà', closeAttr: 'data-close-cards', body,
      action: '<button type="button" class="btn is-icon settings-action" data-card-add aria-label="Aggiungi carta">+</button>' });
  }
  if(state.cardsOpen === 'form'){
    const d = state.cardDraft || (state.cardDraft = newCardDraft());
    const canScan = 'BarcodeDetector' in window;
    const body = `
      <section class="settings-section">
        <div class="settings-card card-form">
          <label class="settings-field-label" for="card-name">Negozio</label>
          <input type="text" id="card-name" class="input-search" placeholder="Es. Esselunga" value="${escapeAttr(d.name)}" data-card-field="name" autocomplete="off">
          <label class="settings-field-label" for="card-number">Numero della carta</label>
          <div class="card-number-row">
            <input type="text" id="card-number" class="input-search" inputmode="text" placeholder="Il numero sotto il codice a barre" value="${escapeAttr(d.number)}" data-card-field="number" autocomplete="off">
            ${canScan ? `<label class="btn is-outline card-scan">📷 Scansiona<input type="file" accept="image/*" capture="environment" id="card-scan-input" hidden></label>` : ''}
          </div>
          ${state.cardScanMsg ? `<p class="settings-note">${escapeHtml(state.cardScanMsg)}</p>` : ''}
          <div class="settings-field-label">Logo</div>
          <div class="card-logo-row">
            ${d.logo ? `<img class="card-manage-logo is-big" src="${escapeAttr(d.logo)}" alt="" style="background:${escapeAttr(d.color || CARD_COLORS[0])}">` : ''}
            <label class="btn is-outline card-scan">🖼️ ${d.logo ? 'Cambia' : 'Scegli immagine'}<input type="file" accept="image/*" id="card-logo-input" hidden></label>
            ${d.logo ? '<button type="button" class="btn is-ghost" data-card-logo-remove>Togli</button>' : ''}
          </div>
          <div class="settings-field-label">Colore</div>
          <div class="card-colors">${CARD_COLORS.concat(d.color && !CARD_COLORS.includes(d.color) ? [d.color] : []).map(col => `<button type="button" class="card-color${d.color === col ? ' active' : ''}" data-card-color="${col}" style="background:${col}" aria-label="Colore" aria-pressed="${d.color === col}"></button>`).join('')}</div>
          ${d.number.trim() ? `<div class="card-preview">${barcodeSvg(d.number.trim(), d.format)}</div>` : ''}
          <button type="button" class="btn is-solid is-block" data-card-save ${d.name.trim() && d.number.trim() ? '' : 'disabled'}>${d.id ? 'Salva' : 'Aggiungi'}</button>
          ${d.id ? `<button type="button" class="btn is-outline is-block settings-item-danger" data-card-delete="${escapeAttr(d.id)}">Elimina carta</button>` : ''}
        </div>
      </section>`;
    html += managePageHtml({ key: 'cards-form', title: d.id ? 'Modifica carta' : 'Nuova carta', closeAttr: 'data-close-card-form', body });
  }
  return html;
}
// Chiude la scheda carta: si torna all'elenco se c'era sotto, altrimenti si esce.
function closeCardForm(){
  state.cardsOpen = state.cardsListUnder ? 'list' : null;
  state.cardsListUnder = false;
  state.cardDraft = null;
  state.cardScanMsg = '';
}
function openCardForm(draft){
  state.cardsListUnder = state.cardsOpen === 'list' || !!state.cardViewId || state.cardsListUnder;
  state.cardsOpen = 'form';
  state.cardViewId = null;
  state.cardDraft = draft;
  state.cardScanMsg = '';
}
// Logo: ridotto sul telefono (max 360×160) prima di salvarlo con la carta.
async function loadCardLogo(file){
  if(!file || !state.cardDraft) return;
  try{
    const bmp = await createImageBitmap(file);
    const k = Math.min(1, 360 / bmp.width, 160 / bmp.height);
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(bmp.width * k)); c.height = Math.max(1, Math.round(bmp.height * k));
    c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
    let url = c.toDataURL('image/webp', 0.85);
    if(!url.startsWith('data:image/webp')) url = c.toDataURL('image/png');
    state.cardDraft.logo = url;
  }catch(e){ state.cardScanMsg = 'Non riesco a leggere l\'immagine.'; }
  render();
}
async function scanCardImage(file){
  if(!file || !('BarcodeDetector' in window)) return;
  try{
    const detector = new BarcodeDetector();
    const bitmap = await createImageBitmap(file);
    const found = await detector.detect(bitmap);
    if(!found.length){ state.cardScanMsg = 'Codice non trovato: riprova più vicino, o scrivi il numero.'; render(); return; }
    const d = state.cardDraft || (state.cardDraft = newCardDraft());
    d.number = found[0].rawValue;
    d.format = found[0].format;
    state.cardScanMsg = 'Letto! Controlla il numero.';
  }catch(e){
    state.cardScanMsg = 'Non riesco a leggere la foto: scrivi il numero.';
  }
  render();
}
document.addEventListener('click', e=>{
  const t = e.target;
  const closeEl = t.closest('[data-close-cards]');
  if(closeEl){
    if(!isCloseTap(e, closeEl)) return;
    state.cardsOpen = null; state.cardsListUnder = false; state.cardDraft = null; state.cardScanMsg = '';
    render(); return;
  }
  const formClose = t.closest('[data-close-card-form]');
  if(formClose){
    if(!isCloseTap(e, formClose)) return;
    closeCardForm(); render(); return;
  }
  if(t.closest('[data-card-add]')){ openCardForm(newCardDraft()); render(); return; }
  const viewClose = t.closest('[data-close-card-view]');
  if(viewClose && (viewClose.tagName === 'BUTTON' || e.target === viewClose)){ state.cardViewId = null; render(); return; }
  const impCancel = t.closest('[data-cards-import-cancel]');
  if(impCancel && (impCancel.tagName === 'BUTTON' || e.target === impCancel)){ state.cardsImport = null; render(); return; }
  if(t.closest('[data-cards-import-ok]') && state.cardsImport){
    const have = new Set((state.loyaltyCards || []).map(c => c.number));
    const added = state.cardsImport.filter(c => !have.has(c.number)).map((c, idx) => Object.assign({ id: 'c' + Date.now().toString(36) + idx, name: c.name, number: c.number, color: c.color || CARD_COLORS[idx % CARD_COLORS.length] }, c.format ? { format: c.format } : {}));
    const before = JSON.parse(JSON.stringify(state.loyaltyCards || []));
    added.forEach((c, idx) => { const src = state.cardsImport.find(x => x.number === c.number); if(src && src.logo) c.logo = src.logo; });
    const withLogos = (state.loyaltyCards || []).map(c => {
      if(c.logo) return c;
      const src = state.cardsImport.find(x => x.number === c.number && x.logo);
      return src ? Object.assign({}, c, { logo: src.logo }, src.color ? { color: src.color } : {}) : c;
    });
    state.loyaltyCards = withLogos.concat(added);
    state.cardsImport = null;
    state.cardsOpen = 'list';
    state.cardsListUnder = false;
    state.cardDraft = null;
    persist(); render();
    showUndoToast(added.length ? `${added.length} carte importate` : 'Loghi aggiunti', ()=>{ state.loyaltyCards = before; persist(); render(); });
    return;
  }
  const open = t.closest('[data-open-cards]');
  if(open){ state.cardsOpen = 'list'; render(); return; }
  const manage = t.closest('[data-cards-manage]');
  if(manage){ closeSettingsBackdrop(); state.cardsOpen = 'list'; state.cardsListUnder = false; render(); return; }
  const view = t.closest('[data-card-view]');
  if(view){ state.cardViewId = view.dataset.cardView; render(); return; }
  const color = t.closest('[data-card-color]');
  if(color && state.cardDraft){ state.cardDraft.color = color.dataset.cardColor; render(); return; }
  const edit = t.closest('[data-card-edit]');
  if(edit){
    const c = (state.loyaltyCards || []).find(x => x.id === edit.dataset.cardEdit);
    if(c){ openCardForm(Object.assign({}, c)); render(); }
    return;
  }
  if(t.closest('[data-card-logo-remove]') && state.cardDraft){ delete state.cardDraft.logo; render(); return; }
  const del = t.closest('[data-card-delete]');
  if(del){
    const prev = (state.loyaltyCards || []).slice();
    const c = prev.find(x => x.id === del.dataset.cardDelete);
    state.loyaltyCards = prev.filter(x => x.id !== del.dataset.cardDelete);
    if(state.cardsOpen === 'form') closeCardForm();
    persist(); render();
    if(c) showUndoToast(`Carta ${c.name} eliminata`, ()=>{ state.loyaltyCards = prev; persist(); render(); });
    return;
  }
  if(t.closest('[data-card-save]') && state.cardDraft){
    const d = state.cardDraft;
    const name = d.name.trim(), number = d.number.trim().replace(/\s+/g, '');
    if(!name || !number) return;
    const card = { id: d.id || ('c' + Date.now().toString(36)), name, number, color: d.color || CARD_COLORS[0] };
    if(d.format && d.number.trim().replace(/\s+/g, '') === number) card.format = d.format;
    if(d.logo) card.logo = d.logo;
    const list = (state.loyaltyCards || []).filter(x => x.id !== card.id);
    const idx = (state.loyaltyCards || []).findIndex(x => x.id === card.id);
    if(idx >= 0) list.splice(idx, 0, card); else list.push(card);
    state.loyaltyCards = list;
    closeCardForm();
    if(!state.cardsOpen) state.cardsOpen = 'list';
    persist(); render();
  }
}, true); // in cattura: dentro le finestre il primo [data-stop-close] ferma la risalita
document.addEventListener('input', e=>{
  if(e.target.id === 'cards-search'){ state.cardsSearch = e.target.value; render(); return; }
  const f = e.target.dataset && e.target.dataset.cardField;
  if(!f || !state.cardDraft) return;
  state.cardDraft[f] = e.target.value;
  if(f === 'number') delete state.cardDraft.format;
  // Il bottone Aggiungi si attiva da solo, senza ridisegnare (il campo resta com'è).
  const save = document.querySelector('[data-card-save]');
  if(save) save.disabled = !(state.cardDraft.name.trim() && state.cardDraft.number.trim());
});
document.addEventListener('change', e=>{
  if(e.target.id === 'card-number' || e.target.id === 'card-name') render();
  if(e.target.id === 'card-scan-input') scanCardImage(e.target.files && e.target.files[0]);
  if(e.target.id === 'card-logo-input') loadCardLogo(e.target.files && e.target.files[0]);
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

// --- Backup dei dati ---------------------------------------------------------
// "Scarica backup" (Impostazioni) salva un file JSON con i dati personali dello
// spazio (Dispensa, menù, spesa, chi cucina...) e il catalogo condiviso
// (ricette modificate o create, sinonimi, gruppi, categorie): le stesse due
// parti che si salvano su Firebase (buildPersonalPayload/buildCatalogPayload).
// "Ripristina" li rimette com'erano nel file, dopo una conferma, e si
// sincronizza come ogni altra modifica; "Annulla" torna a prima del
// ripristino. Le foto dei piatti non sono incluse (stanno a parte).
const BACKUP_FORMAT = 'cookpop-backup';
function buildBackup(){
  return {
    format: BACKUP_FORMAT,
    version: 1,
    createdAt: new Date().toISOString(),
    space: getSpaceRoute().id,
    personal: JSON.parse(JSON.stringify(buildPersonalPayload())),
    catalog: JSON.parse(JSON.stringify(buildCatalogPayload()))
  };
}
function applyBackupParts(personal, catalog){
  Object.keys(personal || {}).forEach(k=>{ state[k] = personal[k]; });
  CATALOG_FIELDS.forEach(f=>{ if(catalog && f in catalog) state[f] = catalog[f] || {}; });
}
// Ultimo backup scaricato da questo telefono (solo qui, non sincronizzato):
// in Impostazioni si vede quando, e dopo BACKUP_REMIND_DAYS lo ricorda,
// anche nel menu ⋮.
const LAST_BACKUP_KEY = 'cookpop-last-backup';
const BACKUP_REMIND_DAYS = 30;
function lastBackupDate(){
  try{ return localStorage.getItem(LAST_BACKUP_KEY) || null; }catch(e){ return null; }
}
function backupOverdue(){
  const last = lastBackupDate();
  if(!last) return true;
  const d = daysUntilDate(last);
  return d === null || -d > BACKUP_REMIND_DAYS;
}
const LAST_AUTO_BACKUP_KEY = 'cookpop-last-auto-backup';
const AUTO_BACKUP_OFF_KEY = 'cookpop-auto-backup-off';
const AUTO_BACKUP_EVERY_DAYS = 30;
const AUTO_BACKUP_KEEP = 3;
function autoBackupEnabled(){
  try{ return localStorage.getItem(AUTO_BACKUP_OFF_KEY) !== '1'; }catch(e){ return true; }
}
function lastAutoBackupDate(){
  try{ return localStorage.getItem(LAST_AUTO_BACKUP_KEY) || null; }catch(e){ return null; }
}
function backupDateLabel(iso){
  const [y, m, d] = String(iso).split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('it-IT', { day:'numeric', month:'long', year:'numeric' });
}
function backupStatusHtml(){
  const dates = [lastBackupDate(), lastAutoBackupDate()].filter(Boolean).sort();
  const last = dates[dates.length - 1];
  if(!last) return '<span class="backup-status">Ancora nessun backup su questo telefono.</span>';
  return `<span class="backup-status">Ultimo backup il ${backupDateLabel(last)}.</span>`;
}
// Copie automatiche: una al mese, nel database del browser di questo telefono
// (IndexedDB), le ultime AUTO_BACKUP_KEEP. Servono per tornare indietro dopo un
// errore; per averne una fuori dal telefono c'è "Scarica backup".
function autoBackupDb(){
  return new Promise((resolve, reject)=>{
    if(!window.indexedDB) return reject(new Error('no-idb'));
    const req = indexedDB.open('cookpop-backups', 1);
    req.onupgradeneeded = ()=>{ req.result.createObjectStore('snaps', { keyPath:'id' }); };
    req.onsuccess = ()=> resolve(req.result);
    req.onerror = ()=> reject(req.error);
  });
}
async function autoBackupList(){
  try{
    const db = await autoBackupDb();
    return await new Promise((resolve, reject)=>{
      const req = db.transaction('snaps').objectStore('snaps').getAll();
      req.onsuccess = ()=> resolve((req.result || []).sort((x, y) => y.id.localeCompare(x.id)));
      req.onerror = ()=> reject(req.error);
    });
  }catch(e){ return []; }
}
async function autoBackupSave(snap){
  const db = await autoBackupDb();
  await new Promise((resolve, reject)=>{
    const tx = db.transaction('snaps', 'readwrite');
    tx.objectStore('snaps').put(snap);
    tx.oncomplete = resolve; tx.onerror = ()=> reject(tx.error);
  });
  const all = await autoBackupList();
  if(all.length > AUTO_BACKUP_KEEP){
    const tx = db.transaction('snaps', 'readwrite');
    all.slice(AUTO_BACKUP_KEEP).forEach(s => tx.objectStore('snaps').delete(s.id));
  }
}
async function maybeAutoBackup(){
  if(!autoBackupEnabled()) return false;
  // Solo a dati caricati: altrimenti si salverebbe una copia vuota.
  if(window.cookpopSync && !personalSynced) return false;
  const last = lastAutoBackupDate();
  if(last){
    const d = daysUntilDate(last);
    if(d !== null && -d < AUTO_BACKUP_EVERY_DAYS) return false;
  }
  try{
    const today = isoLocalDate(new Date());
    await autoBackupSave({ id: today, data: buildBackup() });
    try{ localStorage.setItem(LAST_AUTO_BACKUP_KEY, today); }catch(e){}
    refreshBackupStatus();
    return true;
  }catch(e){ return false; }
}
async function refreshAutoBackupList(){
  const el = document.getElementById('auto-backup-list');
  if(!el) return;
  const all = await autoBackupList();
  el.innerHTML = all.length
    ? `<div class="settings-field-label">Copie automatiche su questo telefono</div>` + all.map(s => `<div class="auto-backup-row"><span>${escapeHtml(backupDateLabel(s.id))}</span><button type="button" class="btn is-chip" data-auto-backup-restore="${escapeAttr(s.id)}">Ripristina</button></div>`).join('')
    : '';
}
function refreshBackupStatus(){
  const el = document.getElementById('backup-status');
  if(el) el.innerHTML = backupStatusHtml();
  const tg = document.getElementById('auto-backup-toggle');
  if(tg) tg.checked = autoBackupEnabled();
  refreshAutoBackupList();
}
function downloadBackup(){
  try{ localStorage.setItem(LAST_BACKUP_KEY, isoLocalDate(new Date())); }catch(e){}
  refreshBackupStatus();
  const data = buildBackup();
  const blob = new Blob([JSON.stringify(data, null, 1)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `cookpop-backup-${isoLocalDate(new Date())}.json`;
  document.body.appendChild(a);
  a.click();
  setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); }, 1000);
}
// Ritorna un messaggio d'errore, o null se il file è stato ripristinato.
function restoreBackup(data, confirmFn){
  if(!data || data.format !== BACKUP_FORMAT || !data.personal || !data.catalog) return 'Questo file non è un backup di CookPOP.';
  const when = data.createdAt ? new Date(data.createdAt).toLocaleString('it-IT', { day:'numeric', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit' }) : 'data sconosciuta';
  const otherSpace = data.space && data.space !== getSpaceRoute().id ? `\n\nAttenzione: è il backup di un altro spazio ("${data.space}").` : '';
  const ok = (confirmFn || window.confirm)(`Ripristinare il backup del ${when}?\n\nDispensa, menù, spesa e ricette tornano come erano allora, su tutti i dispositivi (il catalogo delle ricette anche per gli altri spazi). Subito dopo potrai ancora annullare.${otherSpace}`);
  if(!ok) return null;
  const before = { personal: JSON.parse(JSON.stringify(buildPersonalPayload())), catalog: JSON.parse(JSON.stringify(buildCatalogPayload())) };
  applyBackupParts(data.personal, data.catalog);
  persist(); render();
  showUndoToast('Backup ripristinato', ()=>{ applyBackupParts(before.personal, before.catalog); persist(); render(); });
  return null;
}
(function(){
  const dl = document.getElementById('backup-download');
  if(dl) dl.addEventListener('click', downloadBackup);
  const input = document.getElementById('backup-restore-input');
  if(input) input.addEventListener('change', async ()=>{
    const file = input.files && input.files[0];
    input.value = '';
    if(!file) return;
    let data = null;
    try{ data = JSON.parse(await file.text()); }catch(e){ /* non è JSON */ }
    const err = restoreBackup(data);
    if(err) window.alert(err);
    else closeSettingsBackdrop();
  });
})();

(function(){
  const tg = document.getElementById('auto-backup-toggle');
  if(tg) tg.addEventListener('change', ()=>{
    try{ if(tg.checked) localStorage.removeItem(AUTO_BACKUP_OFF_KEY); else localStorage.setItem(AUTO_BACKUP_OFF_KEY, '1'); }catch(e){}
    if(tg.checked) maybeAutoBackup();
  });
  const list = document.getElementById('auto-backup-list');
  if(list) list.addEventListener('click', async e=>{
    const b = e.target.closest('[data-auto-backup-restore]');
    if(!b) return;
    const snap = (await autoBackupList()).find(s => s.id === b.dataset.autoBackupRestore);
    if(!snap) return;
    const err = restoreBackup(snap.data);
    if(err) window.alert(err); else closeSettingsBackdrop();
  });
  // Copia del mese: poco dopo l'avvio (a dati caricati) e quando si torna all'app.
  setTimeout(maybeAutoBackup, 10000);
  document.addEventListener('visibilitychange', ()=>{ if(!document.hidden) setTimeout(maybeAutoBackup, 3000); });
})();

// Impostazioni: voci che aprono le pagine di gestione, e ricerca.
document.addEventListener('click', e=>{
  const go = e.target.closest('[data-settings-go]');
  if(!go) return;
  const what = go.dataset.settingsGo;
  closeSettingsBackdrop();
  if(what === 'gen'){ state.tab = 'menu'; state.genSettingsOpen = 'plain'; }
  else if(what === 'ingredients'){ state.tab = 'dispensa'; state.ingredientManagerOpen = true; }
  else if(what === 'groups'){ state.tab = 'dispensa'; state.pantryGroupsModalOpen = true; }
  else if(what === 'depts'){ state.tab = 'dispensa'; state.deptsModalOpen = true; }
  else if(what === 'aisles'){ state.aisleOrderOpen = true; }
  render();
});
(function(){
  const input = document.getElementById('settings-search');
  if(!input) return;
  input.addEventListener('input', ()=>{
    const q = ingMatchKey(input.value);
    document.querySelectorAll('#settings-backdrop .settings-section').forEach(sec=>{
      const title = ingMatchKey((sec.querySelector('.settings-section-title') || {}).textContent);
      const links = [...sec.querySelectorAll('.settings-link')];
      const secHit = !q || ingMatchKey(sec.textContent).includes(q);
      links.forEach(l => { l.hidden = !!q && !title.includes(q) && !ingMatchKey(l.textContent).includes(q); });
      sec.hidden = !secHit || (links.length > 0 && links.every(l => l.hidden));
    });
  });
})();

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
