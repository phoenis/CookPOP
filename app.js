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
const TIPO_LABEL = { antipasto:'Antipasto', ripieno:'Ripieno', primo:'Primo', secondo:'Secondo', contorno:'Contorno', unico:'Piatto unico', dolce:'Dolce' };
const TIPO_ICON = { antipasto:'🥗', ripieno:'🥟', primo:'🍜', secondo:'🍖', contorno:'🥕', unico:'🍽️', dolce:'🍰' };
function tipoIcon(t){ return TIPO_ICON[t] || '🍴'; }
// "dolce" è un valore di tipologia valido come gli altri (compare nei filtri,
// nell'editor ricetta) ma pickWeekRecipes lo esclude a monte dal pool di
// candidati per il principale di un pasto — un dolce non deve mai poter
// finire scelto come piatto forte di pranzo/cena dal generatore automatico.
const TIPO_ORDER = ['antipasto','ripieno','primo','secondo','contorno','unico','dolce'];

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

const FREEZER_LABEL = { 'non-adatta':'❄️ Non adatta', 'congelabile':'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M227.65 149.14a12 12 0 0 1-8.79 14.51l-20.67 5.08l5.4 20.16a12 12 0 0 1-23.18 6.22l-7.29-27.2L140 148.78V187l20.48 20.48a12 12 0 0 1-17 17L128 209l-15.51 15.52a12 12 0 0 1-17-17L116 187v-38.22l-33.12 19.13l-7.29 27.2a12 12 0 0 1-23.18-6.22l5.4-20.16l-20.67-5.08a12 12 0 1 1 5.72-23.3l27.89 6.85L104 128l-33.25-19.2l-27.89 6.85A11.8 11.8 0 0 1 40 116a12 12 0 0 1-2.85-23.65l20.67-5.08l-5.4-20.16a12 12 0 0 1 23.18-6.22l7.29 27.2L116 107.21V69L95.52 48.48a12 12 0 0 1 17-17L128 47l15.51-15.52a12 12 0 1 1 17 17L140 69v38.24l33.12-19.12l7.29-27.2a12 12 0 0 1 23.18 6.22l-5.4 20.16l20.67 5.08A12 12 0 0 1 216 116a11.8 11.8 0 0 1-2.87-.35l-27.89-6.85L152 128l33.25 19.2l27.89-6.85a12 12 0 0 1 14.51 8.79"></path></svg> Si può congelare', 'meal-prep':'🍱 Meal prep' };
const FREEZER_ORDER = ['congelabile','meal-prep'];

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
// Reparti freschi e non congelabili: della settimana dopo si comprano più avanti.
const SHOP_LATER_DEPTS = ['verdura', 'latticini'];
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
// "Ordine spesa": parte dall'ordine corsia (poi A–Z dentro la corsia) e
// applica l'ordine scelto a mano (state.shopOrderCustom). Gli ingredienti con
// una posizione scelta si dispongono nei posti che occupano, secondo quella
// scelta; i nuovi restano dove li metterebbe la corsia.
function shopOrderApply(items, aisleIdx){
  const base = items.slice().sort((a, b) => (aisleIdx(a) - aisleIdx(b)) || IT_COLLATOR.compare(a.ingrediente, b.ingrediente));
  const custom = (typeof state !== 'undefined' && state.shopOrderCustom) || [];
  const pos = new Map(custom.map((n, i) => [n, i]));
  const slots = [];
  base.forEach((it, i) => { if(pos.has(shopOrderKey(it))) slots.push(i); });
  const known = base.filter(it => pos.has(shopOrderKey(it))).sort((a, b) => pos.get(shopOrderKey(a)) - pos.get(shopOrderKey(b)));
  slots.forEach((slot, n) => { base[slot] = known[n]; });
  return base;
}
function shopOrderKey(it){ return (it.ingrediente || '').trim().toLowerCase() + (it.per ? '\u0001' + it.per : ''); }
// Dopo un trascinamento: l'ordine visibile diventa quello scelto, e chi non è
// in lista oggi tiene il suo posto accanto al vicino che aveva prima.
function shopOrderMerge(visible){
  const old = (state.shopOrderCustom || []).slice();
  const result = visible.slice();
  const vis = new Set(visible);
  old.forEach((n, i)=>{
    if(vis.has(n)) return;
    let at = 0;
    for(let k = i - 1; k >= 0; k--){ const idx = result.indexOf(old[k]); if(idx >= 0){ at = idx + 1; break; } }
    result.splice(at, 0, n);
  });
  return result;
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
// Tutte le icone dei luoghi: stessa griglia 24, stesso tratto (1.75), nessun riempimento.
const LUOGO_ICON = {
  dispensa:'<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h20"/><path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"/><path d="m4 8 16-4"/><path d="m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8"/></svg>',
  ripostiglio:'<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>',
  frigo:'<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 6a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z"/><path d="M5 10h14"/><path d="M9 6v1"/><path d="M9 14v3"/></svg>',
  freezer:'<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="m4.93 7 14.14 10"/><path d="M19.07 7 4.93 17"/></svg>',
  giardino:'<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>'
};
const DEPT_RULES = [
  // Dolci tradizionali (Zeppole, Pastiera, Struffoli...): aromi, vanillina, bicarbonato, creme e amarene stanno con i dolci.
  ['pastina','pasta'], ['scarola','verdura'], ['grasso a scelta','salumi'],
  ['aroma di','dolci'], ['vanillina','dolci'], ['bicarbonato','dolci'], ['crema pasticcera','dolci'], ['amarene','dolci'], ['grano cotto','conserve'], ['anice','bibite'],
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
// Una voce di Dispensa per ogni coppia ingrediente + specifica: "limone" (intero)
// e "limone|succo" possono esistere insieme.
function pantryKeyFor(name, spec){
  const k = String(name || '').trim().toLowerCase();
  const sp = String(spec || '').trim().toLowerCase();
  return sp ? `${k}|${sp}` : k;
}
// Cambia la chiave di una voce di Dispensa (es. "limone" → "limone|succo")
// portandosi dietro i riferimenti.
function pantryRekey(oldKey, newKey){
  const it = state.pantryItems[oldKey];
  if(!it || state.pantryItems[newKey]) return false;
  state.pantryItems[newKey] = it; delete state.pantryItems[oldKey];
  if(state.pantryConfirmedShop[oldKey] !== undefined){ state.pantryConfirmedShop[newKey] = state.pantryConfirmedShop[oldKey]; delete state.pantryConfirmedShop[oldKey]; }
  if(Array.isArray(state.expiryConfirm)) state.expiryConfirm = state.expiryConfirm.map(k => k === oldKey ? newKey : k);
  if(state.shopDismissed['oos_' + oldKey] !== undefined){ state.shopDismissed['oos_' + newKey] = state.shopDismissed['oos_' + oldKey]; delete state.shopDismissed['oos_' + oldKey]; }
  if(state.pantrySelected && state.pantrySelected[oldKey]){ state.pantrySelected[newKey] = state.pantrySelected[oldKey]; delete state.pantrySelected[oldKey]; }
  if(state.pantryEditKey === oldKey) state.pantryEditKey = newKey;
  return true;
}
// Cosa è questa voce: intero (spec vuota) o una parte. Falso se quella voce c'è già.
function setPantryItemSpec(key, spec){
  const it = state.pantryItems[key]; if(!it) return false;
  const newKey = pantryKeyFor(it.nome, spec);
  if(newKey === key) return true;
  if(state.pantryItems[newKey]) return false;
  if(spec) it.spec = spec; else delete it.spec;
  return pantryRekey(key, newKey);
}
// "Hai anche…": una seconda voce dello stesso ingrediente con un'altra specifica
// (es. il succo in freezer e i limoni interi in frigo), nello stesso posto.
function addPantrySibling(key, spec){
  const it = state.pantryItems[key]; if(!it) return;
  const newKey = pantryKeyFor(it.nome, spec);
  if(!state.pantryItems[newKey]){
    upsertPantryItem(it.nome, it.luogo || 'dispensa', 1, it.unit || undefined, it.cat, it.group, spec);
  }
  state.pantryEditKey = newKey;
}
function resolvePantryItem(ingrediente, spec){
  let fallback = null;
  for(const cand of splitIngredientCandidates(ingrediente)){
    const key = cand.toLowerCase();
    // Se la riga chiede una parte (es. il succo) conta prima la voce di quella parte
    // (anche "Limone · succo" in freezer); poi l'ingrediente intero, che copre tutto.
    // Una riga che chiede l'intero non è coperta da una parte sola.
    const part = spec ? state.pantryItems[pantryKeyFor(cand, spec)] : null;
    if(part){
      if(typeof part.qty === 'number' && part.qty > 0) return part;
      if(!fallback) fallback = part;
    }
    const direct = state.pantryItems[key];
    if(direct){
      if(typeof direct.qty === 'number' && direct.qty > 0) return direct;
      if(!fallback) fallback = direct;
      continue;
    }
    if(part) continue;
    const groupEntry = Object.entries(state.pantryGroups || {}).find(([id,g]) => (g.matchName||'').trim().toLowerCase() === key);
    const group = groupEntry ? groupEntry[0] : null;
    if(!group) continue;
    const memberKeys = groupMemberKeys(group);
    const inGroup = (k, it) => it.group === group || memberKeys.includes(k); // es. "Dado" copre "Brodo vegetale" anche se non è assegnato al gruppo
    const inStock = Object.entries(state.pantryItems).find(([k, it]) => inGroup(k, it) && typeof it.qty === 'number' && it.qty > 0);
    if(inStock) return inStock[1];
    if(!fallback){
      const anyInGroup = Object.entries(state.pantryItems).find(([k, it]) => inGroup(k, it));
      if(anyInGroup) fallback = anyInGroup[1];
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
function pantryStatusFor(ingrediente, neededQtaText, spec){
  const it = resolvePantryItem(ingrediente, spec);
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
// Ricette con quantità fisse (es. una torta: gli ingredienti non cambiano con le
// porzioni): la spunta in Modifica ricetta le salva come quantitaFisse.
function fixedQtyRecipe(name){
  const d = getRecipeDetails(name);
  return !!((d && d.quantitaFisse) || (state.fixedPortionRecipes || {})[name]);
}
function qtyRatio(name, ratio){ return fixedQtyRecipe(name) ? 1 : (ratio || 1); }
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
    .filter(({it}) => pantryStatusFor(it.ingrediente, scaleQtyText(it.qta, ratio), it.spec) !== 'in-casa')
    .map(({it, idx}) => ({
      ingrediente: it.ingrediente,
      qta: scaleQtyText(it.qta, ratio) || '',
      key: ctx ? dayIngKey(ctx.weekIdx, ctx.i, ctx.meal, ctx.role, ing, idx) : null
    }));
}
function mancantiButtonHtml(mancanti){
  if(!mancanti.length) return '';
  return `<div class="button-wrapper"><button class="btn is-small" data-mancanti-in-spesa="${escapeAttr(JSON.stringify(mancanti))}"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--tabler" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M4 19a2 2 0 1 0 4 0a2 2 0 1 0-4 0m11 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0"></path><path d="M17 17H6V3H4"></path><path d="m6 5l14 1l-1 7H6"></path></g></svg> Aggiungi alla Spesa ${mancanti.length===1?'il mancante':`i ${mancanti.length} mancanti`}</button></div>`;
}
// --- Modalità cucina ------------------------------------------------------
// Un passo del procedimento per schermata, a caratteri grandi, con Indietro e
// Avanti (anche scorrendo col dito). Lo schermo resta acceso finché è aperta.
// Bottone "Cucina" flottante e fisso, qualunque tab (Ingredienti/Passaggi) sia
// aperta: solo se la ricetta ha un procedimento.
// Ricette da cucinare insieme: i piatti dello stesso pasto che hanno un
// procedimento, ognuno con la sua scala di porzioni. Si passa dall'una
// all'altra restando al passo a cui si è arrivati in ciascuna.
function cookSessionFor(name, ratio, mk){
  const list = [{ name, step: 0, ratio: ratio || 1, done: false, cursor: 0 }];
  if(!mk) return list;
  const { weekIdx, i, meal } = parseMealKey(mk);
  const dishes = mealDishes(weekIdx, i, meal);
  const baseOf = n => { const dt = getRecipeDetails(n); return dt ? parsePortionsBase(dt.porzioni) : null; };
  const principale = effectiveMeal(weekIdx, i, meal).principale;
  const basePortions = (principale && baseOf(principale)) || dishes.map(x => baseOf(x.name)).find(Boolean) || null;
  const current = basePortions ? (state.dayPortions[mk] || basePortions) : null;
  dishes.forEach(d=>{
    if(d.name === name) return;
    const det = getRecipeDetails(d.name);
    if(!det || !det.procedimento || !det.procedimento.length) return;
    const b = baseOf(d.name);
    list.push({ name: d.name, step: 0, ratio: (b && current) ? current / b : 1, done: false, cursor: 0 });
  });
  return list;
}
function cookSwitchTo(name){
  const cm = state.cookMode; if(!cm || cm.name === name) return;
  const cur = state.cookSession.find(x => x.name === cm.name);
  if(cur) cur.step = cm.step || 0;
  const target = state.cookSession.find(x => x.name === name);
  if(!target) return;
  state.cookMode = { name: target.name, step: target.step || 0, ratio: target.ratio || 1, mk: cm.mk };
  render();
}
function cookSwitcherHtml(cm){
  const list = state.cookSession;
  if(!list || list.length < 2) return '';
  // Le stesse schede dei piatti del dettaglio del pasto (icona + portata, la
  // attiva sottolineata); un piatto finito ha la spunta.
  const seen = {};
  return `<div class="dish-tabs-row cook-tabs"><div class="dish-tabs" role="tablist" aria-label="Piatti in cucina">${list.map(x=>{
    const active = x.name === cm.name;
    const tipo = dishCourse(x.name);
    const label = courseLabel(tipo);
    seen[label] = (seen[label] || 0) + 1;
    const text = seen[label] > 1 ? `${label} ${seen[label]}` : label;
    return `<button type="button" class="dish-tab${active ? ' active' : ''}${x.done ? ' is-done' : ''}" role="tab" aria-selected="${active}" aria-label="${escapeAttr(x.name)}" title="${escapeAttr(x.name)}" data-cook-switch="${escapeAttr(x.name)}"><span class="dish-ic" aria-hidden="true">${tipoIcon(tipo)}</span><span class="dish-tab-label">${escapeHtml(text)}</span>${x.done ? '<span class="cook-tab-check" aria-hidden="true">✓</span>' : ''}</button>`;
  }).join('')}</div></div>`;
}
function cookFabHtml(name, ratio, mk){
  const det = getRecipeDetails(name);
  const hasSteps = !!(det && det.procedimento && det.procedimento.length);
  // Piè di pagina a due bottoni: a sinistra "Cena fatta" (dal pasto, se non è
  // ancora fatto: apre "Cena fatta" senza passare dalla cucina) oppure, da
  // Ricette, "Metti nel menù"; a destra "Cucina".
  let left = '';
  if(mk){
    const { weekIdx, i, meal } = parseMealKey(mk);
    const md = weekMealsDoneRef(weekIdx);
    if(!(md[i] && md[i][meal])) left = `<button type="button" class="cook-fab cook-fab-done" data-cook-done-meal="${escapeAttr(mk)}">${MEAL_LABEL[meal]} ${meal === 'cena' ? 'fatta' : 'fatto'}</button>`;
  } else {
    left = `<button type="button" class="cook-fab cook-fab-done" data-recipe-to-menu="${escapeAttr(name)}">Metti nel menù</button>`;
  }
  if(!left && !hasSteps) return '';
  return `<div class="cook-fab-bar">${left}${hasSteps ? `<button type="button" class="cook-fab" data-cook-start="${escapeAttr(name)}" data-cook-ratio="${ratio || 1}"${mk ? ` data-cook-meal="${escapeAttr(mk)}"` : ''}>Cucina</button>` : ''}</div>`;
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
  // "(2 + 1 avanzo)": quante porzioni sono per questo pasto e quante per gli avanzi che lo seguono.
  const k = Object.keys(state.dayLinks || {}).filter(x => state.dayLinks[x] === mk).length;
  const ex = k * leftoverPortionsN();
  const avanzi = k > 0 && ex > 0 && n > ex ? `<span class="persone-avanzi">(${n - ex} + ${ex} ${ex === 1 ? 'avanzo' : 'avanzi'})</span>` : '';
  return `<div class="persone-row"><span>Per</span><span class="qty-stepper"><button type="button" class="qty-btn" data-portions-dec="${mk}" aria-label="Diminuisci porzioni">−</button><span class="qty-num">${n}</span><button type="button" class="qty-btn" data-portions-inc="${mk}" aria-label="Aumenta porzioni">+</button></span><span>${word}</span>${avanzi}</div>`;
}
// Ingredienti che servono in un passo: quelli il cui nome (una parola
// significativa, senza l'ultima vocale per reggere singolare/plurale) compare
// nel testo del passo. Euristica semplice: nessun abbinamento = nessun elenco.
const COOK_SKIP_WORDS = new Set(['fresco','fresca','freschi','fresche','tritato','tritata','grattugiato','grattugiata','polvere','intero','intera','medio','media','grande','piccolo','piccola','circa','sodo','maturo','matura','extra','vergine','extravergine']);
function cookStepIngredients(name, stepText, ratio){
  ratio = qtyRatio(name, ratio);
  const text = (stepText || '').toLowerCase();
  return getIngredientsFor(name).filter(it=>{
    // Anche la specifica (tuorli, succo…) conta; "uova" → "uov" regge "l'uovo".
    const words = `${it.ingrediente || ''} ${it.spec || ''}`.toLowerCase().split(/[^a-zàèéìòù]+/).filter(w => w.length >= 4 && !COOK_SKIP_WORDS.has(w));
    return words.some(w => text.includes(w === 'uova' ? 'uov' : (w.length > 4 ? w.slice(0, -1) : w)));
  }).map(it => ({ nome: it.ingrediente, qta: scaleQtyText(it.qta, ratio) || '' }));
}
// --- Timer in modalità cucina --------------------------------------------
// Durata scritta nel passo ("10 minuti", "mezz'ora", "1 ora e mezza"): se c'è,
// il passo mostra "Avvia timer" (suona e vibra qui nell'app, finché resta
// aperta). Con un intervallo ("20-25 minuti") vale il minimo.
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
});
function cookTimerHtml(stepText){
  const secs = stepDurationSecs(stepText);
  const running = state.cookTimer;
  const bar = running ? `<div class="cook-timer-bar"><span aria-hidden="true">⏱</span><b id="cook-timer-time">${formatTimerClock(Math.ceil((running.end - Date.now()) / 1000))}</b><span class="cook-timer-label">${escapeHtml(running.note || ('Timer ' + running.label))}</span><button type="button" class="cook-timer-cancel" data-cook-timer-cancel>Annulla</button></div>` : '';
  const btns = secs ? `<div class="cook-timer-row"><button type="button" class="cook-timer-btn" data-cook-timer-start="${secs}">⏱ Avvia timer ${formatTimerLabel(secs)}</button></div>` : '';
  return { bar, btns };
}
// "Consiglio" della ricetta: compare al passaggio che ne parla (una parola
// lunga in comune), altrimenti al primo.
function cookTipFor(det, steps, step){
  const tip = (det && det.consigli || '').trim();
  if(!tip) return '';
  const words = t => (t.toLowerCase().match(/[a-zàèéìòù]{5,}/g) || []).map(w => w.slice(0, 5));
  const tipWords = new Set(words(tip));
  const hits = steps.map(t => words(t).filter(w => tipWords.has(w)).length);
  const best = Math.max(...hits);
  const target = best > 0 ? hits.indexOf(best) : 0;
  return step === target ? tip : '';
}
const COOK_ARTICLE = { primo: 'Il primo', secondo: 'Il secondo', contorno: 'Il contorno', antipasto: "L'antipasto", dolce: 'Il dolce', unico: 'Il piatto unico' };
function cookLastNote(cm){
  const list = state.cookSession || [];
  const others = list.filter(x => x.name !== cm.name);
  const meal = cm.mk ? MEAL_LABEL[parseMealKey(cm.mk).meal].toLowerCase() : '';
  if(!others.length) return meal ? `Ultimo passaggio. Con “Ho finito” si apre il foglio della ${meal} intera.` : 'Ultimo passaggio. Con “Ho finito” si apre il foglio “Ricetta fatta”.';
  const open = others.filter(x => !x.done);
  const lab = x => (COOK_ARTICLE[dishCourse(x.name)] || 'Il piatto');
  if(open.length){
    const art = x => (COOK_ARTICLE[dishCourse(x.name)] || 'Il piatto');
    const to = x => ({ antipasto: "all'antipasto" }[dishCourse(x.name)] || `al ${courseLabel(dishCourse(x.name)).toLowerCase()}`);
    const rest = open.map(x => art(x).toLowerCase()).join(' e ');
    return `Ultimo passaggio di ${cm.name}. ${open.length === 1 ? 'Resta' : 'Restano'} ancora ${rest}: con “Ho finito” passi ${to(open[0])}.`;
  }
  const done = others.map(lab);
  return `Ultimo passaggio della ${meal || 'ricetta'}. ${done.length === 1 ? `${done[0]} è già finito` : `${done.join(' e ').replace(/ (Il|L')/g, m => m.toLowerCase())} sono già finiti`}: con “Ho finito” si apre il foglio della ${meal} intera.`;
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
  const multi = (state.cookSession || []).length > 1;
  const ings = cookStepIngredients(cm.name, steps[step], cm.ratio || 1);
  const base = det ? parsePortionsBase(det.porzioni) : null;
  const persone = base ? Math.round(base * (cm.ratio || 1)) : 0;
  const hasQty = ings.some(i => i.qta && !/^q\.?\s?b/i.test(i.qta));
  const ingHtml = ings.length ? `
    <section class="cook-need">
      <h3 class="cook-need-title">Ti serve${persone && hasQty ? ` · per ${persone}` : ''}</h3>
      <ul class="cook-need-list">${ings.map(i => `<li><span>${escapeHtml(i.nome)}</span><b>${escapeHtml(i.qta || '')}</b></li>`).join('')}</ul>
    </section>` : '';
  const tip = cookTipFor(det, steps, step);
  const BULB = '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 256 256" width="1.25em" height="1.25em"><path fill="currentColor" d="M176 232a8 8 0 0 1-8 8H88a8 8 0 0 1 0-16h80a8 8 0 0 1 8 8m40-128a87.55 87.55 0 0 1-33.64 69.21A16.24 16.24 0 0 0 176 186v6a16 16 0 0 1-16 16H96a16 16 0 0 1-16-16v-6a16 16 0 0 0-6.23-12.66A87.59 87.59 0 0 1 40 104.49C39.74 56.83 78.26 17.14 125.88 16A88 88 0 0 1 216 104m-16 0a72 72 0 0 0-73.74-72c-39 .92-70.47 33.39-70.26 72.39a71.65 71.65 0 0 0 27.64 56.3A32 32 0 0 1 96 186v6h64v-6a32.15 32.15 0 0 1 12.47-25.35A71.65 71.65 0 0 0 200 104m-16.11-9.34a57.6 57.6 0 0 0-46.56-46.55a8 8 0 0 0-2.66 15.78c16.57 2.79 30.63 16.85 33.44 33.45A8 8 0 0 0 176 104a9 9 0 0 0 1.35-.11a8 8 0 0 0 6.54-9.23"/></svg>';
  const tipHtml = tip ? `<p class="cook-tip">${BULB}<span><b>Consiglio:</b> ${escapeHtml(tip)}</span></p>` : '';
  const timerUi = cookTimerHtml(steps[step]);
  // "cursor" è il passaggio che si sta facendo; "step" quello che si sta guardando.
  const cur = (state.cookSession || []).find(x => x.name === cm.name);
  const cursor = Math.min(Math.max(0, cur ? (cur.cursor || 0) : step), total - 1);
  const where = isLast ? 'Ultimo passaggio' : `Passaggio ${step + 1} di ${total}`;
  const lastNote = isLast ? cookLastNote(cm) : '';
  const segs = Array.from({ length: total }, (_, i) => `<span class="${i <= Math.max(cursor, step) ? 'on' : ''}"></span>`).join('');
  const cooking = cm.mk ? (parseMealKey(cm.mk).meal === 'cena' ? 'Cucinando la cena' : 'Cucinando il pranzo') : `Cucinando ${cm.name}`;
  return `
  <div class="sheet-page cook-page${pageEntering('cook') ? ' is-entering' : ''}" data-page="cook">
    <header class="cook-head">
      <h2 class="cook-title">${escapeHtml(cooking)}</h2>
      <button type="button" class="cook-end" data-close-cook>Termina</button>
    </header>
    ${cookSwitcherHtml(cm)}
    ${timerUi.bar}
    <div class="cook-segs" role="progressbar" aria-valuemin="1" aria-valuemax="${total}" aria-valuenow="${step + 1}">${segs}</div>
    <div class="cook-body" data-cook-swipe>
      <section class="cook-step">
        <div class="cook-step-count">${escapeHtml(where)}</div>
        <p class="cook-step-text">${escapeHtml(steps[step])}</p>
        ${timerUi.btns}
      </section>
      ${ingHtml}
      ${tipHtml}
    </div>
    <div class="cook-footer">
      ${lastNote ? `<div class="cook-last-note"><span class="cook-last-ic" aria-hidden="true">✓</span><span>${escapeHtml(lastNote)}</span></div>` : ''}
      <div class="cook-nav">
        <button type="button" class="cook-arrow" data-cook-prev aria-label="Passaggio precedente" ${isFirst ? 'disabled' : ''}><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 256 256" width="1.25em" height="1.25em"><path fill="currentColor" d="M224 128a8 8 0 0 1-8 8H59.31l58.35 58.34a8 8 0 0 1-11.32 11.32l-72-72a8 8 0 0 1 0-11.32l72-72a8 8 0 0 1 11.32 11.32L59.31 120H216a8 8 0 0 1 8 8"/></svg></button>
        ${step === cursor
          ? (isLast ? '<button type="button" class="cook-nav-main" data-cook-finish>Ho finito</button>' : '<button type="button" class="cook-nav-main" data-cook-step-done>Fatto!</button>')
          : step > cursor
            ? `<button type="button" class="cook-nav-main is-quiet" data-cook-goto="${cursor}">Passaggio ${cursor + 1}</button>`
            : `<button type="button" class="cook-nav-main is-quiet" data-cook-redo>Esegui di nuovo</button>`}
        <button type="button" class="cook-arrow" data-cook-next aria-label="Passaggio successivo" ${isLast ? 'disabled' : ''}><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 256 256" width="1.25em" height="1.25em"><path fill="currentColor" d="M221.66 133.66l-72 72a8 8 0 0 1-11.32-11.32L196.69 136H40a8 8 0 0 1 0-16h156.69l-58.35-58.34a8 8 0 0 1 11.32-11.32l72 72a8 8 0 0 1 0 11.32"/></svg></button>
      </div>
    </div>
  </div>`;
}
function renderIngredientsSection(ing, ratio, ctx, persone, titleOverride){
  ratio = ratio || 1;
  persone = persone || (ctx && ctx.persone) || 0;
  if(!ing.length) return `<div class="ing-empty">Nessun ingrediente salvato per questa ricetta ancora.</div>`;
  const STATUS_LABEL = { 'in-casa':'In casa', 'poco':'Scorta bassa', 'manca':'Manca' };
  const seen = new Set();
  const rows = ing.map(it=>{
    const scaledQta = scaleQtyText(it.qta, ratio);
    const status = pantryStatusFor(it.ingrediente, scaledQta, it.spec);
    seen.add(status);
    return `<li><span class="ing-list-name">${escapeHtml(it.ingrediente)}${it.qual ? `<small class="ing-qual"> · ${escapeHtml(it.qual)}</small>` : ''}${it.note ? `<small class="ing-qual ing-note"> · ${escapeHtml(it.note)}</small>` : ''}</span><span class="ing-qty">${escapeHtml(scaledQta||'')}</span><span class="ing-status ${status}" title="${escapeAttr(STATUS_LABEL[status])}"></span></li>`;
  }).join('');
  const titleHtml = titleOverride !== undefined ? titleOverride : (ctx && ctx.titleHtml !== undefined) ? ctx.titleHtml : `<div class="detail-section-title"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--tabler" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M4 19a2 2 0 1 0 4 0a2 2 0 1 0-4 0m11 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0"></path><path d="M17 17H6V3H4"></path><path d="m6 5l14 1l-1 7H6"></path></g></svg> Ingredienti${persone ? ` per ${persone} ${persone === 1 ? 'persona' : 'persone'}` : ''}</div>`;
  const legend = ctx && ctx.legend ? `<div class="rd-legend"><span><i class="ing-status in-casa"></i> in casa</span>${seen.has('poco') ? '<span><i class="ing-status poco"></i> scorta bassa</span>' : ''}<span><i class="ing-status manca"></i> da comprare</span></div>` : '';
  const mancantiBtn = (ctx && ctx.noButton) ? '' : mancantiButtonHtml(missingIngredients(ing, ratio, ctx));
  return `<div class="detail-section">${titleHtml}${legend}<ul class="ing-list">${rows}</ul>${mancantiBtn}</div>`;
}

// Un piatto del pasto nel dettaglio: una fisarmonica, uguale per tutti i
// piatti (portata + nome, si apre e si chiude), con dentro foto, tag,
// gradimento, ingredienti, procedimento, note e le azioni del singolo piatto.
// ratio scala le quantità sulle porzioni del pasto, rispetto alle porzioni
// base di QUESTA ricetta. "Aggiungi N ingredienti" non sta qui ma una volta
// sola per tutto il pasto (vedi renderMealDetailScreen).
// Il dettaglio di una ricetta è lo stesso dal Menù e da Ricette: tag (tempi
// divisi in preparazione e cottura, categoria, stagione...), riga delle
// persone, e le note una per una ("Consigli" prima dei passaggi).
const CLOCK_TAG_SVG = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M128 20a108 108 0 1 0 108 108A108.12 108.12 0 0 0 128 20m0 192a84 84 0 1 1 84-84a84.09 84.09 0 0 1-84 84m68-84a12 12 0 0 1-12 12h-56a12 12 0 0 1-12-12V72a12 12 0 0 1 24 0v44h44a12 12 0 0 1 12 12"></path></svg>';
const CAL_TAG_SVG = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M208 32h-24v-8a8 8 0 0 0-16 0v8H88v-8a8 8 0 0 0-16 0v8H48a16 16 0 0 0-16 16v160a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16M72 48v8a8 8 0 0 0 16 0v-8h80v8a8 8 0 0 0 16 0v-8h24v32H48V48Zm136 160H48V96h160zm-96-88v64a8 8 0 0 1-16 0v-51.06l-4.42 2.22a8 8 0 0 1-7.16-14.32l16-8A8 8 0 0 1 112 120m59.16 30.45L152 176h16a8 8 0 0 1 0 16h-32a8 8 0 0 1-6.4-12.8l28.78-38.37a8 8 0 1 0-13.31-8.83a8 8 0 1 1-13.85-8A24 24 0 0 1 176 136a23.76 23.76 0 0 1-4.84 14.45"></path></svg>';
const NOTE_TITLE_SVG = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M88 96a8 8 0 0 1 8-8h64a8 8 0 0 1 0 16H96a8 8 0 0 1-8-8m8 40h64a8 8 0 0 0 0-16H96a8 8 0 0 0 0 16m32 16H96a8 8 0 0 0 0 16h32a8 8 0 0 0 0-16m96-104v108.69a15.86 15.86 0 0 1-4.69 11.31L168 219.31a15.86 15.86 0 0 1-11.31 4.69H48a16 16 0 0 1-16-16V48a16 16 0 0 1 16-16h160a16 16 0 0 1 16 16M48 208h104v-48a8 8 0 0 1 8-8h48V48H48Zm120-40v28.7l28.69-28.7Z"></path></svg>';
function recipeTimeTagsHtml(rec, det){
  const entries = recipeTimeEntriesWithText(rec, det);
  if(entries.length){
    return entries.map((t, i) => `<span class="tag tempo">${i === 0 ? CLOCK_TAG_SVG + ' ' : ''}${escapeHtml(t.label || 'Tempo')} ${formatMinutes(t.min)}</span>`).join('');
  }
  return `<span class="tag tempo">${det && det.tempo ? CLOCK_TAG_SVG + ' ' + escapeHtml(det.tempo) : escapeHtml(TEMPO_LABEL[rec.tempoBucket])}</span>`;
}
function recipeTagsHtml(name){
  const rec = getRecipeMeta(name), det = getRecipeDetails(name);
  if(!rec) return `<div class="ing-empty">Ricetta non presente nel catalogo — solo ingredienti disponibili qui.</div>`;
  return `
    <div class="detail-tags">
      ${recipeTimeTagsHtml(rec, det)}
      <span class="tag">${catIcon(rec.categoriaNew)} ${escapeHtml(CAT_LABEL[rec.categoriaNew])}</span>
      <span class="tag season">${rec.stagioni.map(s=>escapeHtml(STAGIONE_LABEL[s])).join(', ')}</span>
      ${(rec.freezerNew && rec.freezerNew !== 'non-adatta') ? `<span class="tag freezer">${FREEZER_LABEL[rec.freezerNew]}</span>` : ''}
      ${rec.pianificazione!=='nessuna' ? `<span class="tag">${CAL_TAG_SVG} ${escapeHtml(PIAN_LABEL[rec.pianificazione])}</span>` : ''}
      ${gradTagHtml(name)}
    </div>`;
}
function recipeNoteBoxHtml(title, text){
  return `<div class="detail-section note-box"><div class="detail-section-title">${NOTE_TITLE_SVG} ${title}</div><div class="detail-extra-note">${escapeHtml(text)}</div></div>`;
}
// { before: Consigli (sopra i passaggi), after: le altre note (sotto) }
// "Come congelarla e usarla": un consiglio breve per tipo di preparazione, per
// le ricette che si possono congelare. Vale anche per le porzioni in freezer.
function freezeTipFor(name){
  const r = getRecipeMeta(name);
  if(!r || !['congelabile', 'meal-prep'].includes(r.freezerNew)) return '';
  const n = String(name || '').toLowerCase(), cat = r.categoriaNew || '';
  const label = ' Scrivi nome e data sull\'etichetta.';
  if(/polpett|burger|cotolett|crocchett|nugget|frittell|arancin|suppl|medaglion|svizzer/.test(n))
    return 'Congelale in fila su un vassoio con carta forno per circa 2 ore, poi tutte insieme in un sacchetto: non si attaccano e ne prendi quante ne servono. Dal freezer vanno direttamente in forno o friggitrice ad aria, senza scongelare.' + label;
  if(/sugo|rag[uù]|salsa|crema|vellutata|zuppa|minestr|passato|pesto|brodo|besciamella|soffritto|dado/.test(n))
    return 'Congela a cubetti (stampi per ghiaccio) o in sacchetti piatti, schiacciando via l\'aria. Non serve scongelare: sciogli direttamente nel pentolino con un po\' d\'acqua o di brodo, oppure usa il microonde con la funzione defrost.' + label;
  if(/pancake|waffle|muffin|focaccia|pizza|torta|biscott|pane\b/.test(n) || cat === 'dolci')
    return 'Separa le fette con carta forno e congela in un sacchetto. Scalda direttamente nel tostapane, in friggitrice ad aria o in forno.' + label;
  if(r.base === 'pasta' || r.base === 'riso' || r.base === 'cereali' || r.proteina === 'legumi')
    return 'Porziona in monoporzioni e congela in sacchetti piatti o contenitori. Scalda dal freezer in pentola con un goccio d\'acqua o di brodo, senza scongelare.' + label;
  if(cat === 'carne' || cat === 'pesce')
    return 'Raffredda del tutto, porziona e congela in sacchetti piatti, senza aria. Scongela in frigorifero la sera prima (mai a temperatura ambiente) e poi scalda.' + label;
  return 'Raffredda del tutto, porziona e congela in sacchetti piatti, senza aria. Scongela in frigorifero la sera prima e poi scalda.' + label;
}
function recipeNotesHtml(det, name){
  if(!det) return { before: '', after: '' };
  const tip = name ? freezeTipFor(name) : '';
  return {
    before: det.consigli ? recipeNoteBoxHtml('Consigli', det.consigli) : '',
    after: [
      det.ricordare && det.ricordare !== 'Niente' ? recipeNoteBoxHtml('Da ricordare', det.ricordare) : '',
      det.avanzi ? recipeNoteBoxHtml('Avanzi', det.avanzi) : '',
      det.freezer ? recipeNoteBoxHtml('Freezer', det.freezer) : '',
      tip ? recipeNoteBoxHtml('Come congelarla e usarla', tip) : ''
    ].join('')
  };
}
function recipePersoneHtml(personeRow){ return personeRow ? `<div class="detail-persone">${personeRow}</div>` : ''; }
// --- Dettaglio ricetta: una pagina sola, uguale dal Menù e da Ricette ---------
// Titolo, tempi, categoria e gradimento; tab-àncora Ingredienti | Passaggi
// (scorrono alla sezione); ingredienti con − persone + e pallini in casa /
// da comprare; passaggi con le note ("Consigli" prima).
// "Metti nel menù" (dal dettaglio di una ricetta in Ricette): sceglie il pasto
// dei prossimi giorni; la scelta passa dallo stesso gestore di "Cambia piatto"
// (data-swap-pick), quindi con Annulla.
function renderMenuPickSheet(){
  const name = state.menuPick;
  if(!name) return '';
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const rows = [];
  [0, 1].forEach(weekIdx => {
    weekDatesFor(weekIdx).forEach((date, pos) => {
      if(date < today) return;
      const i = WEEK_DISPLAY_ORDER[pos];
      const label = date.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' }).replace('.', '');
      const chips = ['pranzo', 'cena'].map(meal => {
        const cur = effectiveMeal(weekIdx, i, meal).principale || '';
        return `<button type="button" class="menu-pick-chip${cur === name ? ' active' : ''}" data-swap-pick="${escapeAttr(name)}" data-swap-day="${mealKey(weekIdx, i, meal)}"><b>${MEAL_LABEL[meal]}</b><small>${cur ? escapeHtml(cur) : 'vuoto'}</small></button>`;
      }).join('');
      rows.push(`<div class="menu-pick-row"><span class="menu-pick-day">${escapeHtml(label.charAt(0).toUpperCase() + label.slice(1))}</span>${chips}</div>`);
    });
  });
  return `
  <div class="move-backdrop" data-menu-pick-close>
    <div class="move-sheet" role="dialog" aria-label="Metti nel menù" data-stop-close>
      <div class="move-handle" aria-hidden="true"></div>
      <h2 class="move-title">Metti nel menù</h2>
      <p class="move-sub">${escapeHtml(name)} · scegli il pasto. Prende il posto di quello che c'è.</p>
      <div class="move-list menu-pick-list">${rows.join('')}</div>
      <div class="move-footer"><button type="button" class="btn is-outline" data-menu-pick-close>Indietro</button></div>
    </div>
  </div>`;
}
document.addEventListener('click', e=>{
  const open = e.target.closest && e.target.closest('[data-recipe-to-menu]');
  if(open){ state.menuPick = open.dataset.recipeToMenu; render(); return; }
  if(!state.menuPick) return;
  const pick = e.target.closest('[data-swap-pick]');
  if(pick){ state.menuPick = null; return; } // il gestore del pick ridisegna
  const close = e.target.closest('[data-menu-pick-close]');
  if(close && !(e.target.closest('[data-stop-close]') && !close.matches('.btn'))){ state.menuPick = null; render(); }
}, true);
// Tab Ingredienti | Passaggi del dettaglio: restano sotto l'intestazione mentre
// si scorre; uno swipe a sinistra/destra sul contenuto passa all'altra tab.
function rdHeaderOffset(page){
  const h = page.querySelector('.settings-header');
  return h ? h.getBoundingClientRect().height : 0;
}
document.addEventListener('scroll', e=>{
  const page = e.target;
  if(!page || !page.classList || !page.classList.contains('sheet-page')) return;
  const tabs = page.querySelector('.rd-tabs'); if(!tabs) return;
  tabs.style.setProperty('--rd-top', rdHeaderOffset(page) + 'px');
}, true);
(function(){
  let t0 = null;
  document.addEventListener('touchstart', e=>{
    const rd = e.target.closest && e.target.closest('.rd');
    if(!rd || e.touches.length !== 1 || e.target.closest('input, textarea, select, .grad-pop')){ t0 = null; return; }
    t0 = { x: e.touches[0].clientX, y: e.touches[0].clientY, rd };
  }, { passive: true });
  document.addEventListener('touchend', e=>{
    if(!t0) return;
    const { x, y, rd } = t0; t0 = null;
    const c = e.changedTouches[0]; if(!c) return;
    const dx = c.clientX - x, dy = c.clientY - y;
    if(Math.abs(dx) < 60 || Math.abs(dx) < 1.5 * Math.abs(dy)) return;
    const tabs = [...rd.querySelectorAll('.rd-tab')];
    const cur = tabs.findIndex(b => b.classList.contains('active'));
    const next = tabs[cur + (dx < 0 ? 1 : -1)];
    if(next) next.click();
  }, { passive: true });
})();
function rdTimeHtml(rec, det){
  const clock = '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 256 256" width="1em" height="1em"><path fill="currentColor" d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88m64-88a8 8 0 0 1-8 8h-56a8 8 0 0 1-8-8V72a8 8 0 0 1 16 0v48h48a8 8 0 0 1 8 8"/></svg>';
  const entries = recipeTimeEntriesWithText(rec, det);
  const text = entries.length
    ? entries.map(t => `${escapeHtml(t.label || 'Tempo')} <b>${formatMinutes(t.min)}</b>`).join(' · ')
    : `<b>${escapeHtml((det && det.tempo) || TEMPO_LABEL[rec.tempoBucket] || '')}</b>`;
  return `<div class="rd-time">${clock}<span>${text}</span></div>`;
}
function rdMetaText(rec){
  const bits = [CAT_LABEL[rec.categoriaNew], rec.stagioni.map(x => STAGIONE_LABEL[x]).join(', ')].filter(Boolean).map(escapeHtml);
  // L'etichetta del freezer è già HTML (icona + testo): non va riscritta come testo.
  if(rec.freezerNew && rec.freezerNew !== 'non-adatta') bits.push(FREEZER_LABEL[rec.freezerNew]);
  return bits.join(' · ');
}
function rdGradHtml(name){
  const r = getRecipeMeta(name); if(!r) return '';
  const open = state.gradPicker === name;
  const label = GRAD_LABEL[r.gradimento] || 'Ti piace?';
  return `<span class="grad-tag-wrap rd-grad-wrap"><button type="button" class="rd-grad${r.gradimento ? '' : ' is-empty'}" data-grad-open="${escapeAttr(name)}" aria-expanded="${open}">${label}</button>${open ? `
    <div class="grad-pop-backdrop" data-grad-close></div>
    <div class="grad-pop" role="menu">${GRAD_ORDER.map(g=>`<button type="button" class="grad-pop-opt${r.gradimento===g?' active':''}" role="menuitem" data-set-gradimento="${escapeAttr(name)}" data-grad="${g}">${GRAD_LABEL[g]}</button>`).join('')}</div>` : ''}</span>`;
}
// "− 3 persone +": stessi attributi di personeRowHtml (i gestori sono quelli).
function rdPersoneHtml(n, mk, recipeName){
  if(!n) return '';
  const word = n === 1 ? 'persona' : 'persone';
  const dec = recipeName ? `data-recipe-portions-dec="${escapeAttr(recipeName)}"` : (mk ? `data-portions-dec="${mk}"` : '');
  const inc = recipeName ? `data-recipe-portions-inc="${escapeAttr(recipeName)}"` : (mk ? `data-portions-inc="${mk}"` : '');
  if(!dec) return `<div class="persone-row rd-persone"><span class="rd-persone-n"><b>${n}</b> ${word}</span></div>`;
  return `<div class="persone-row rd-persone"><button type="button" class="rd-round" ${dec} aria-label="Diminuisci porzioni">−</button><span class="rd-persone-n"><b>${n}</b> ${word}</span><button type="button" class="rd-round" ${inc} aria-label="Aumenta porzioni">+</button></div>`;
}
function recipeDetailBodyHtml(name, o){
  const rec = getRecipeMeta(name), det = getRecipeDetails(name);
  const steps = (det && det.procedimento) || [];
  const notes = recipeNotesHtml(det, name);
  const ingHtml = renderIngredientsSection(o.ing, o.ratio, Object.assign({ noButton: true, titleHtml: '', legend: true }, o.ctx || {}), o.persone, '');
  const stepsHtml = steps.length
    ? `<ol class="steps-list">${steps.map(t=>`<li>${escapeHtml(t)}</li>`).join('')}</ol>`
    : '<div class="ing-empty">Nessun procedimento salvato per questa ricetta.</div>';
  const addFormHtml = det ? '' : `
    <div class="add-ing-form">
      <input type="text" placeholder="Ingrediente" data-rning="${escapeAttr(name)}">
      <input type="text" placeholder="Quantità" data-rnqta="${escapeAttr(name)}">
      <button class="btn is-solid" data-add-ing-recipe="${escapeAttr(name)}">+ aggiungi ingrediente</button>
    </div>`;
  const head = rec ? `
    ${rdTimeHtml(rec, det)}
    <div class="rd-meta"><span class="rd-meta-text">${rdMetaText(rec)}</span>${rdGradHtml(name)}</div>` : `<div class="ing-empty">Ricetta non presente nel catalogo — solo ingredienti disponibili qui.</div>`;
  const pane = state.dishPane[o.paneKey] || 'ing';
  const tabBtn = (v, label) => `<button type="button" class="rd-tab${pane === v ? ' active' : ''}" role="tab" aria-selected="${pane === v}" data-dish-pane="${escapeAttr(o.paneKey)}" data-dish-pane-value="${v}">${label}</button>`;
  return `
  <div class="rd" data-rd="${escapeAttr(name)}">
    <h1 class="rd-title">${escapeHtml(name)}</h1>
    ${head}
    ${o.extraTop || ''}
    <div class="rd-tabs" role="tablist">${tabBtn('ing', 'Ingredienti')}${tabBtn('steps', `Passaggi${steps.length ? ` · ${steps.length}` : ''}`)}</div>
    ${pane === 'ing' ? `
    <section class="rd-sec" data-rd-sec="ing">
      <div class="rd-sec-head"><h2>Ingredienti</h2>${o.personeHtml || ''}</div>
      ${ingHtml}
      ${o.mancantiHtml || ''}
      ${addFormHtml}
    </section>` : `
    <section class="rd-sec" data-rd-sec="steps">
      ${notes.before}
      ${stepsHtml}
      ${notes.after}
      ${o.linkHtml || ''}
    </section>`}
  </div>`;
}
function renderDishAccordion(dsh, ratio, ctx, isOpen, fixed, asPanel){
  const name = dsh.name;
  const mk = mealKey(ctx.weekIdx, ctx.i, ctx.meal);
  const rec = getRecipeMeta(name);
  const det = getRecipeDetails(name);
  const ing = getIngredientsFor(name);
  const paneKey = mk + '|' + name;
  const pane = state.dishPane[paneKey] || 'ing';
  const ingHtml = renderIngredientsSection(ing, qtyRatio(name, ratio), Object.assign({ noButton: true, titleHtml: '' }, ctx));
  const personeHtml = recipePersoneHtml(personeRowHtml(ctx.persone, ctx.canPortions ? mk : ''));
  const tagsHtml = recipeTagsHtml(name);
  const stepsHtml = det && det.procedimento && det.procedimento.length
    ? `<div class="detail-section"><ol class="steps-list">${det.procedimento.map(s=>`<li>${escapeHtml(s)}</li>`).join('')}</ol></div>`
    : '';
  const notes = recipeNotesHtml(det, name);
  const linkHtml = sourceLinkHtml(det);
  const addFormHtml = det ? '' : `
    <div class="add-ing-form">
      <input type="text" placeholder="Ingrediente" data-rning="${escapeAttr(name)}">
      <input type="text" placeholder="Quantità" data-rnqta="${escapeAttr(name)}">
      <button class="btn is-solid" data-add-ing-recipe="${escapeAttr(name)}">+ aggiungi ingrediente</button>
    </div>`;
  const fromFreezer = isFreezerDish(mk, name);
  const plan = getDishPlan(mk, name);
  const haveFrozen = freezerPortionsOf(name);
  const useFreezerBtn = (!fromFreezer && haveFrozen > 0) ? `<button type="button" class="btn is-chip dish-use-freezer" data-use-freezer="${mk}" data-use-freezer-name="${escapeAttr(name)}">❄️ Usa le ${haveFrozen} ${haveFrozen === 1 ? 'porzione' : 'porzioni'} in freezer</button>` : '';
  const freezerInfo = useFreezerBtn + (fromFreezer
    ? `<div class="dish-freezer-note">❄️ Dal freezer: niente da comprare. In freezer: ${freezerPortionsOf(name)} porzioni. La sera prima ricordati di tirarlo fuori.</div>`
    : (canFreeze(name) ? `<button type="button" class="btn is-chip dish-double${plan.double ? ' active' : ''}" data-prep-double data-prep-key="${mk}" data-prep-name="${escapeAttr(name)}" aria-pressed="${!!plan.double}">❄️ ${plan.double ? 'Doppia dose: metà in freezer' : 'Fai doppia dose e congela metà'}</button>${haveFrozen > 0 ? `<span class="dish-freezer-have">Ne hai già ${haveFrozen} in freezer</span>` : ''}` : ''));
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
  if(asPanel){
    // Nel pasto il piatto attivo è la pagina di dettaglio ricetta, la stessa di Ricette.
    return `
  <div class="dish-acc is-panel open">
    <div class="dish-acc-body">
      ${rec ? recipePhotoHtml(name) : ''}
      ${recipeDetailBodyHtml(name, { paneKey: paneKey, ing, ratio, ctx, persone: ctx.persone,
        personeHtml: rdPersoneHtml(ctx.persone, ctx.canPortions ? mk : '', ''),
        mancantiHtml: dishCookFactor(mk, name) ? mancantiButtonHtml(missingIngredients(ing, ratio, ctx)) : '', extraTop: freezerInfo, linkHtml: linkHtml ? `<div class="button-wrapper">${linkHtml}</div>` : '' })}
    </div>
  </div>`;
  }
  return `
  <div class="dish-acc${isOpen ? ' open' : ''}${asPanel ? ' is-panel' : ''}">
    ${head}
    ${isOpen ? `<div class="dish-acc-body">
      ${rec ? recipePhotoHtml(name) : ''}
      ${tagsHtml}
      ${personeHtml}
      ${freezerInfo}
      ${paneTabsHtml(paneKey, pane)}
      ${pane === 'ing' ? `
      ${ctx.mancantiHtml || ''}
      ${ingHtml}
      ${addFormHtml}` : `
      ${notes.before}
      ${stepsHtml || '<div class="ing-empty">Nessun procedimento salvato per questa ricetta.</div>'}
      ${notes.after}
      ${linkHtml ? `<div class="button-wrapper">${linkHtml}</div>` : ''}`}
    </div>` : ''}
  </div>`;
}

// Inventario unico (dispensa/ripostiglio/frigo/freezer distinti solo dal
// campo luogo): le stesse voci vengono anche aggiunte/incrementate in
// automatico quando si spunta un articolo in Spesa. Quantità = un contatore
// numerico (stepper +/- in UI); finché non è impostata (o è 0) la voce non
// compare nell'elenco.
function upsertPantryItem(nome, luogo, amount, unit, cat, group, spec){
  const trimmedName = (nome||'').trim();
  if(!trimmedName) return;
  const key = pantryKeyFor(trimmedName, spec);
  if(state.hiddenIngredients) delete state.hiddenIngredients[trimmedName.toLowerCase()]; // lo riaggiungi: torna nell'elenco
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
    ...((spec || (existing && existing.spec)) ? { spec: spec || existing.spec } : {}),
    // La scadenza resta finché c'è ancora scorta (vale quella della confezione
    // già in casa, la più vicina); se era finita, quella nuova non si conosce.
    ...(currentQty > 0 && existing && existing.scadenza ? { scadenza: existing.scadenza } : {}),
    ...(newQty > 0 && existing && existing.lots ? { lots: existing.lots } : {})
  };
  // Torna in scorta: una volta rifinito serve una nuova conferma esplicita da Spesa.
  if(newQty > 0) delete state.pantryConfirmedShop[key];
}

// Sposta in Dispensa la riga di Spesa di una checkbox (upsert + dismiss):
// stessa logica di "Sposta in dispensa" per la spunta multipla, riusata
// anche dalla spunta singola quando "Modalità spesa" è attiva.
// Scadenza segnata in negozio: sulle righe spuntate un tasto calendario apre
// un piccolo elenco (+3 giorni, +1 settimana, +1 mese, data, nessuna). La data
// resta legata alla riga e, a "Sposta in Dispensa", diventa la scadenza della
// voce, o di un nuovo lotto se ne hai già in casa (vedi lotti).
// Scadenza stimata dal reparto per un articolo (solo freschi): data ISO o ''.
function shopExpiryEstimate(name){
  const key = (name || '').trim().toLowerCase();
  const pantry = state.pantryItems[key] || resolvePantryItem(name);
  const est = estimateExpiryDays(pantry || { nome: name });
  return est === null || est === undefined ? '' : addDaysIso(est);
}
// state.shopExpiry[riga]: data scelta, 'none' = tolta, assente = stima. Sulla
// riga c'è direttamente la data (la stima parte già compilata, con "~"): un
// tocco apre il selettore data del telefono, la ✕ la toglie. O data o niente.
function shopExpiryHtml(rowKey, name){
  const choice = (state.shopExpiry || {})[rowKey];
  const estIso = shopExpiryEstimate(name);
  const iso = choice === 'none' ? '' : (choice || estIso);
  const isEst = !choice && !!estIso;
  const label = iso ? (isEst ? '~' : '') + new Date(iso + 'T00:00:00').toLocaleDateString('it-IT', { day: 'numeric', month: 'short' }) : 'Scadenza';
  return `
      <span class="shop-exp-wrap">
        <label class="shop-exp-chip${iso ? ' has-date' : ''}${isEst ? ' is-estimate' : ''}" aria-label="${iso ? 'Scadenza ' + escapeAttr(label) : 'Segna la scadenza'}">
          ${uiIcon('calendar')}<span class="shop-exp-label">${escapeHtml(label)}</span>
          <input type="date" data-shop-exp-date="${escapeAttr(rowKey)}" value="${escapeAttr(iso)}" aria-label="Scadenza">
        </label>
        ${iso ? `<button type="button" class="btn is-icon shop-exp-clear" data-shop-exp-clear="${escapeAttr(rowKey)}" aria-label="Togli la scadenza">✕</button>` : ''}
      </span>`;
}
// La scadenza segnata in negozio entra in Dispensa: sulla voce se non ne avevi,
// altrimenti come nuovo lotto accanto a quello che c'era (before = voce prima
// dell'aggiunta).
function applyShopExpiry(pantryKey, added, iso, before){
  const it = state.pantryItems[pantryKey];
  if(!it || !iso) return;
  const hadStock = !!(before && typeof before.qty === 'number' && before.qty > 0);
  if(!hadStock || it.unit === 'none'){ it.scadenza = iso; return; }
  const lots = (Array.isArray(before.lots) ? before.lots : [{ qty: before.qty, scadenza: before.scadenza || '' }]).map(l => ({ qty: l.qty, scadenza: l.scadenza || '' }));
  lots.push({ qty: added, scadenza: iso });
  it.lots = lots;
  normalizeLots(it);
}
// Dati di una riga di Spesa (dal checkbox nel DOM, o già pronti): chiave/i
// della riga, nome, unità, "per chi" e quantità di partenza dello stepper.
function shopRowInfo(cb){
  if(!cb.dataset) return cb;
  const stepperBtn = cb.closest && cb.closest('.shop-item-row') ? cb.closest('.shop-item-row').querySelector('[data-shop-qty-inc]') : null;
  const qtyEl = cb.closest && cb.closest('.shop-item-row') ? cb.closest('.shop-item-row').querySelector('.qty-num') : null;
  return { rowKey: cb.dataset.shopKeys, name: cb.dataset.shopName, spec: cb.dataset.shopSpec || '', unit: cb.dataset.shopUnit, per: cb.dataset.shopPer || '',
    qtyDefault: parseFloat(stepperBtn && stepperBtn.dataset.shopQtyDefault), qtyLabel: qtyEl ? qtyEl.textContent.trim() : '' };
}
// opts (dalla finestra "Metti in dispensa"): luogo scelto e scadenza ('' = nessuna,
// data ISO); senza opts vale la scadenza segnata in negozio o la stima.
function moveShopRowToPantry(cb, opts){
  const info = shopRowInfo(cb);
  const rowKey = info.rowKey;
  // Per un'altra persona: si è comprato, ma non entra nella nostra Dispensa.
  if(info.per){
    rowKey.split(',').forEach(k=>{ state.shopDismissed[k] = true; });
    if(state.shopExpiry) delete state.shopExpiry[rowKey];
    return;
  }
  const fallback = info.qtyDefault;
  const rawQty = (typeof state.shopQty[rowKey] === 'number') ? state.shopQty[rowKey] : (Number.isNaN(fallback) || fallback === undefined ? 0 : fallback);
  // Quantità non indicata (segnaposto "–"): conta come 1, cioè "c'è".
  const qty = rawQty > 0 ? rawQty : 1;
  // Se in Dispensa è già impostata "Non mostrare" per questo ingrediente,
  // quella scelta manuale vince sempre: la quantità della ricetta ("12 g"
  // di sale, es.) non deve poterla resettare a un'unità tracciabile.
  const pantryKey = pantryKeyFor(info.name, info.spec);
  const existingUnit = (state.pantryItems[pantryKey] || {}).unit;
  const unit = existingUnit === 'none' ? 'none' : (info.unit || undefined);
  const before = state.pantryItems[pantryKey];
  const hadStock = !!(before && typeof before.qty === 'number' && before.qty > 0);
  upsertPantryItem(info.name, (opts && opts.luogo) || 'dispensa', qty, unit, undefined, undefined, info.spec);
  if(opts && opts.luogo && state.pantryItems[pantryKey]) state.pantryItems[pantryKey].luogo = opts.luogo;
  rowKey.split(',').forEach(k=>{ state.shopDismissed[k] = true; });
  const shopChoice = opts ? (opts.scad ? opts.scad : 'none') : (state.shopExpiry || {})[rowKey];
  if(shopChoice && shopChoice !== 'none') applyShopExpiry(pantryKey, qty, shopChoice, before);
  if(state.shopExpiry) delete state.shopExpiry[rowKey];
  const it = state.pantryItems[pantryKey];
  // In freezer: la data di congelamento è oggi; se la scadenza è quella stimata
  // per il freezer resta segnata come stima (vedi reconcileFreezer).
  if(it && opts && opts.luogo === 'freezer' && it.frozenOn === undefined){
    it.frozenOn = isoLocalDate(new Date());
    if(opts.scad && opts.scad === addDaysToIso(it.frozenOn, freezerDaysFor(it))) it.freezerExp = true; else delete it.freezerExp;
  }
  if(opts) return;
  // Senza una scelta in negozio vale la scadenza stimata dal reparto (freschi):
  // da confermare subito se non ne avevi, altrimenti nuovo lotto con la stima.
  const est = shopChoice === undefined ? estimateExpiryDays(it) : null;
  if(it && est !== null){
    if(!hadStock){
      if(!it.scadenza){
        it.scadenza = addDaysIso(est);
        if(!state.expiryConfirm.includes(pantryKey)) state.expiryConfirm.push(pantryKey);
      }
    } else applyShopExpiry(pantryKey, qty, addDaysIso(est), before);
  }
}

// Cattura lo stato di Dispensa/Spesa toccato da moveShopRowToPantry prima di
// eseguirla, per poter offrire "Annulla" sia sulla spunta singola in
// Modalità spesa sia sullo spostamento multiplo dal foglio di selezione.
function snapshotShopRowForUndo(cb){
  const info = shopRowInfo(cb);
  const rowKeys = info.rowKey.split(',');
  const pantryKey = pantryKeyFor(info.name, info.spec);
  return {
    pantryKey,
    hadPantryItem: Object.prototype.hasOwnProperty.call(state.pantryItems, pantryKey),
    prevPantryItem: state.pantryItems[pantryKey] ? {...state.pantryItems[pantryKey]} : undefined,
    hadConfirmedShop: Object.prototype.hasOwnProperty.call(state.pantryConfirmedShop, pantryKey),
    prevConfirmedShop: state.pantryConfirmedShop[pantryKey],
    rowKeys,
    rowKey: info.rowKey,
    prevExpiry: (state.shopExpiry || {})[info.rowKey],
    prevDismissed: rowKeys.map(k=>state.shopDismissed[k])
  };
}
function restoreShopRowSnapshot(snap){
  if(snap.hadPantryItem) state.pantryItems[snap.pantryKey] = snap.prevPantryItem;
  else delete state.pantryItems[snap.pantryKey];
  if(snap.hadConfirmedShop) state.pantryConfirmedShop[snap.pantryKey] = snap.prevConfirmedShop;
  else delete state.pantryConfirmedShop[snap.pantryKey];
  if(snap.prevExpiry){ if(!state.shopExpiry) state.shopExpiry = {}; state.shopExpiry[snap.rowKey] = snap.prevExpiry; }
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
// Rinomina una ricetta ovunque: dati, pasti già pianificati, album e foto.
// Il nome è la chiave di tutto, e le ricette del catalogo (statico) non si
// possono rinominare davvero: diventano una copia propria col nuovo nome e
// l'originale si nasconde.
function renameStringsInTree(node, from, to){
  if(Array.isArray(node)){
    node.forEach((v, i)=>{ if(v === from) node[i] = to; else renameStringsInTree(v, from, to); });
  } else if(node && typeof node === 'object'){
    Object.keys(node).forEach(k=>{ const v = node[k]; if(v === from) node[k] = to; else renameStringsInTree(v, from, to); });
  }
}
function renameRecipeRefs(from, to){
  ['weekBaseline','weekOverrides','weekOverridePicked','extraWeeks','dishPlan','freezerDishes'].forEach(f=>{ if(state[f]) renameStringsInTree(state[f], from, to); });
  (state.cookbooks || []).forEach(cb=>{ if(Array.isArray(cb.recipes)) cb.recipes = cb.recipes.map(n => n === from ? to : n); });
  if(state.expandedRecipe === from) state.expandedRecipe = to;
}
function moveRecipeKeys(from, to){
  ['recipeEdits','recipeIngredients'].forEach(f=>{
    const dict = state[f];
    if(dict && Object.prototype.hasOwnProperty.call(dict, from)){ dict[to] = dict[from]; delete dict[from]; }
  });
}
function recipeNameTaken(name){
  const k = name.trim().toLowerCase();
  return Object.keys(recipeByName).concat(Object.keys(state.customRecipes)).some(n => n.toLowerCase() === k);
}
async function moveRecipePhoto(from, to){
  if(!window.cookpopSync || !window.cookpopSync.load) return;
  try{
    const val = await window.cookpopSync.load(recipePhotoPath(from));
    if(!val || !val.data) return;
    await window.cookpopSync.save(recipePhotoPath(to), { data: val.data, updatedAt: val.updatedAt || Date.now(), by: val.by || whatsNewViewerKey() });
    await window.cookpopSync.save(recipePhotoPath(from), null);
    delete recipePhotoCache[from]; delete recipePhotoCache[to];
    render();
  }catch(e){ /* la foto resta col vecchio nome: non è grave */ }
}
function renameRecipe(from, to){
  if(!from || !to || from === to) return;
  const staticMeta = recipeByName[from];
  if(staticMeta){
    state.customRecipes[to] = Object.assign({}, staticMeta, { nome: to });
    state.recipeEdits[to] = Object.assign({}, DATA.recipeDetails[from] || {}, state.recipeEdits[from] || {});
    delete state.recipeEdits[from];
    if(state.recipeIngredients[from]){ state.recipeIngredients[to] = state.recipeIngredients[from]; delete state.recipeIngredients[from]; }
    state.hiddenRecipes[from] = true;
  } else {
    state.customRecipes[to] = Object.assign({}, state.customRecipes[from], { nome: to });
    delete state.customRecipes[from];
    moveRecipeKeys(from, to);
  }
  delete state.hiddenRecipes[to];
  renameRecipeRefs(from, to);
  moveRecipePhoto(from, to);
}
// Tempo di una ricetta: preparazione + cottura (minuti). Il totale decide la
// fascia usata dai filtri e dal generatore; "tempo" resta il testo mostrato.
function tempoBucketForMinutes(min){
  return min <= 20 ? 'express' : min <= 30 ? 'veloce' : min <= 45 ? 'normale' : min <= 60 ? 'lunga' : 'progetto';
}
function formatMinutes(min){
  if(min < 60) return `${min} min`;
  const h = Math.floor(min / 60), m = min % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}
// I tempi di una ricetta sono un elenco, come gli ingredienti: ognuno ha un
// nome (Preparazione, Cottura, Riposo…) e dei minuti. Il totale è la somma e
// decide la fascia. Vecchio formato: solo tPrep / tCottura.
const TIME_LABELS = ['Preparazione', 'Cottura', 'Riposo', 'Lievitazione', 'Marinatura', 'Raffreddamento'];
function recipeTimeEntries(x){
  if(x && Array.isArray(x.tempi)){
    return x.tempi.map(t => ({ label: String((t && t.label) || '').trim(), min: Math.max(0, Math.round(Number(t && t.min) || 0)) })).filter(t => t.min > 0 || t.label);
  }
  const out = [];
  const p = x && x.tPrep != null && x.tPrep !== '' ? Number(x.tPrep) : null;
  const c = x && x.tCottura != null && x.tCottura !== '' ? Number(x.tCottura) : null;
  if(Number.isFinite(p)) out.push({ label: 'Preparazione', min: p });
  if(Number.isFinite(c)) out.push({ label: 'Cottura', min: c });
  return out;
}
// "1 ora + 1 ora di cottura + 1 ora di riposo nel forno" -> tre voci. Solo se
// ogni parte si capisce; altrimenti null e il testo resta com'è.
function parseTempoText(text){
  const t = String(text || '').trim();
  if(!/\+/.test(t)) return null;
  const parts = t.split('+').map(x => x.trim()).filter(Boolean);
  const out = [];
  for(let k = 0; k < parts.length; k++){
    const p = parts[k].toLowerCase();
    let m = p.match(/(\d+(?:[.,]\d+)?)\s*(ore|ora|h)\b/), min = null;
    if(m) min = Math.round(parseFloat(m[1].replace(',', '.')) * 60);
    else if((m = p.match(/(\d+)\s*(minuti|min|m)\b/))) min = parseInt(m[1], 10);
    else if(/mezz'?\s*ora/.test(p)) min = 30;
    if(min == null) return null;
    const label = /cottur|forno/.test(p) && !/riposo/.test(p) ? 'Cottura' : /riposo/.test(p) ? 'Riposo' : /lievit/.test(p) ? 'Lievitazione' : /marin/.test(p) ? 'Marinatura' : /prep/.test(p) || k === 0 ? 'Preparazione' : 'Tempo';
    out.push({ label, min });
  }
  return out.length > 1 ? out : null;
}
function recipeTimeEntriesWithText(rec, det){
  const e = recipeTimeEntries(rec).filter(t => t.min > 0);
  if(e.length) return e;
  return parseTempoText((det && det.tempo) || (rec && rec.tempo)) || [];
}
function recipeTimeTotal(entries){ return entries.reduce((n, t) => n + (t.min || 0), 0); }
// Nell'elenco Ricette: con più tempi, il totale e la fascia ("3 h · oltre 1 h").
function recipeListTime(r){
  const e = recipeTimeEntriesWithText(r, getRecipeDetails(r.nome));
  if(e.length < 2) return r.tempo;
  const tot = recipeTimeTotal(e);
  return `${formatMinutes(tot)} · ${tempoShortLabel(tempoBucketForMinutes(tot))}`;
}
function recipeTimeText(x){
  return recipeTimeEntries(x).filter(t => t.min > 0).map(t => `${formatMinutes(t.min)} ${t.label.toLowerCase()}`).join(' + ');
}
function editTimeEntryHtml(label, min){
  return `
    <div class="edit-time-entry">
      <input type="text" class="edit-time-label" list="edit-time-labels" placeholder="Es. Cottura" aria-label="Che tempo è" value="${escapeAttr(label || '')}">
      <span class="edit-time-input"><input type="number" inputmode="numeric" min="0" step="5" class="edit-time-min" aria-label="Minuti" value="${min != null && min !== '' ? escapeAttr(String(min)) : ''}" placeholder="–"> min</span>
      <button type="button" class="btn is-outline is-icon is-danger edit-row-remove" data-remove-row aria-label="Rimuovi tempo">✕</button>
    </div>`;
}
function editTimeTotalHtml(entries, rec){
  const tot = recipeTimeTotal(entries);
  if(!entries.some(t => t.min > 0)) return rec && rec.tempo ? `Ora: ${escapeHtml(rec.tempo)} (${escapeHtml(TEMPO_LABEL[rec.tempoBucket] || '')}). Aggiungi i tempi: il totale decide la fascia.` : 'Aggiungi i tempi (preparazione, cottura, riposo…): il totale decide la fascia.';
  return `Totale ${formatMinutes(tot)} · ${escapeHtml(TEMPO_LABEL[tempoBucketForMinutes(tot)])}`;
}
function readEditTimeEntries(){
  return Array.from(document.querySelectorAll('#edit-time-list .edit-time-entry')).map(row => ({
    label: row.querySelector('.edit-time-label').value.trim(),
    min: Math.max(0, parseInt(row.querySelector('.edit-time-min').value, 10) || 0)
  })).filter(t => t.min > 0);
}
// Salvataggio dal form: con almeno un tempo il totale rifà testo e fascia;
// senza, restano quelli che la ricetta aveva già.
function editTimeFromForm(rec){
  const tempi = readEditTimeEntries().map(t => ({ label: t.label || 'Tempo', min: t.min }));
  if(!tempi.length) return { tempi: null, tPrep: null, tCottura: null, tempo: rec.tempo || '', tempoBucket: rec.tempoBucket || 'normale' };
  const tot = recipeTimeTotal(tempi);
  return { tempi, tPrep: null, tCottura: null, tempo: formatMinutes(tot), tempoBucket: tempoBucketForMinutes(tot) };
}
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
// Le foto sono per famiglia (le famiglie di prima continuano a condividere quelle già caricate).
function recipePhotoPath(name){
  const r = activeRoute;
  const base = r && r.photosPath ? r.photosPath : (r && r.newFamily ? `families/${r.famId}/photos` : RECIPE_PHOTOS_PATH);
  return `${base}/${fbKeyEncode(name)}`;
}
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
  return `<label class="recipe-photo-drop">+ Aggiungi foto<input type="file" accept="image/*" hidden data-recipe-photo-input="${escapeAttr(name)}"></label>${error}`;
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
// Etichetta di gradimento nei dettagli ricetta: al tocco apre un piccolo
// menu per cambiarlo; se vuoto dice "Ti piace?".
function gradTagHtml(name){
  const r = getRecipeMeta(name);
  if(!r) return '';
  const label = GRAD_LABEL[r.gradimento] || 'Ti piace?';
  const open = state.gradPicker === name;
  return `<span class="grad-tag-wrap"><button type="button" class="tag grad-tag${r.gradimento ? '' : ' is-empty'}" data-grad-open="${escapeAttr(name)}" aria-expanded="${open}">${label}</button>${open ? `
    <div class="grad-pop-backdrop" data-grad-close></div>
    <div class="grad-pop" role="menu">${GRAD_ORDER.map(g=>`<button type="button" class="grad-pop-opt${r.gradimento===g?' active':''}" role="menuitem" data-set-gradimento="${escapeAttr(name)}" data-grad="${g}">${GRAD_LABEL[g]}</button>`).join('')}</div>` : ''}</span>`;
}
document.addEventListener('click', e=>{
  const o = e.target.closest && e.target.closest('[data-grad-open]');
  if(o){ const n = o.dataset.gradOpen; state.gradPicker = state.gradPicker === n ? null : n; render(); return; }
  if(e.target.closest && e.target.closest('[data-grad-close]')){ state.gradPicker = null; render(); }
});
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
  state.gradPicker = null;
  if(!GRAD_ORDER.includes(grad) || (getRecipeMeta(name) || {}).gradimento === grad){ render(); return; }
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
// Variazioni: un ingrediente solo (uova, prosciutto, latte, panna, pollo) e la
// specifica ("tuorli", "cotto", "petto"…) come dettaglio. In Dispensa e in
// Spesa resta una voce sola; la ricetta dice quale variazione serve, e in
// Spesa la si legge sotto il nome. La chiave è il nome scritto nella ricetta
// (minuscolo), il valore [ingrediente, variazione].
const CURATED_INGREDIENT_VARIANTS = {
  'tuorli':['Uova','tuorli'], 'albumi':['Uova','albumi'], 'albume':['Uova','albumi'], 'uova sode':['Uova','sode'],
  'uova (grandi)':['Uova','grandi'], 'uova medie (a temperatura ambiente)':['Uova','medie'],
  'limone (scorza)':['Limone','scorza'], 'limone (succo)':['Limone','succo'], 'scorza di limone':['Limone','scorza'],
  'scorza di limone (grattugiata)':['Limone','scorza'], 'succo di limone':['Limone','succo'],
  "scorza d'arancia":['Arance','scorza'], "bucce d'arancia":['Arance','scorza']
};
// Le specifiche proposte per un ingrediente: solo per quelli di cui si usa una
// parte (si compra comunque l'uovo, il limone, l'arancia). Altre specifiche
// le aggiungi tu (state.ingredientVariants, vedi variantOptionsFor).
const INGREDIENT_VARIANT_OPTIONS = {
  'uova':['tuorli','albumi','sode'], 'limone':['scorza','succo'], 'limoni':['scorza','succo'],
  'arance':['scorza','succo'], 'arancia':['scorza','succo']
};
function variantOptionsFor(name){
  const k = ingMatchKey(name || '');
  const custom = (state.ingredientVariants && state.ingredientVariants[k]) || [];
  return [...new Set([...(INGREDIENT_VARIANT_OPTIONS[k] || []), ...custom])];
}
function addIngredientVariant(name, variant){
  const k = ingMatchKey(name || ''), v = String(variant || '').trim();
  if(!k || !v || variantOptionsFor(name).includes(v)) return;
  state.ingredientVariants = state.ingredientVariants || {};
  (state.ingredientVariants[k] = state.ingredientVariants[k] || []).push(v);
}
function removeIngredientVariant(name, variant){
  const k = ingMatchKey(name || ''), list = (state.ingredientVariants || {})[k];
  if(!list) return;
  state.ingredientVariants[k] = list.filter(x => x !== variant);
  if(!state.ingredientVariants[k].length) delete state.ingredientVariants[k];
}
// Specifiche salvate prima che prosciutto, pollo e panna tornassero ingredienti
// singoli: rimettono il nome intero che avevano.
const LEGACY_VARIANT_NAMES = {
  'prosciutto|cotto':'Prosciutto cotto', 'prosciutto|crudo':'Prosciutto crudo', 'pollo|petto':'Petto di pollo', 'pollo|coscia':'Cosce di pollo',
  'pollo|petto o coscia':'Pollo a pezzi (cosce o petto)', 'panna|da cucina':'Panna da cucina', 'panna|da montare':'Panna fresca'
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
  'brodo-vegetale': { group:{ label:'Brodo vegetale', matchName:'brodo vegetale', cat:'dispensa' }, members:['dado','dado vegetale','dado da brodo','dado per brodo','dado di verdure','brodo vegetale','brodo granulare','brodo vegetale granulare','brodo vegetale in dadi'] },
  'brodo-carne': { group:{ label:'Brodo di carne', matchName:'brodo di carne', cat:'dispensa' }, members:['dado','dado di carne','dado da brodo','dado per brodo','brodo di carne','brodo granulare'] },
  'carne-macinata': { group:{ label:'Carne macinata', matchName:'carne macinata', cat:'carne' }, members:['carne macinata mista','carne macinata di manzo','macinato','macinato misto','macinato di manzo'] }
};
// Gli altri gruppi "X o Y": i nomi che ne fanno parte, uguali per tutte le
// famiglie. Insieme a CURATED_PANTRY_GROUPS formano l'elenco di partenza dei
// formati di ogni gruppo (vedi groupMemberKeys): i gruppi sono "pieni" anche
// con la Dispensa vuota.
const OTHER_GROUP_MEMBERS = {
  'riso-carnaroli-vialone': ['riso carnaroli','carnaroli','riso vialone nano','vialone nano'],
  'provolone-brie': ['provolone','brie'],
  'zucchero-miele': ['zucchero','miele'],
  'rosmarino-alloro': ['rosmarino','alloro'],
  'guanciale-pancetta': ['guanciale','pancetta'],
  'basilico-menta': ['basilico','menta'],
  'olio-burro': ['olio evo','burro'],
  'grana-parmigiano': ['grana','parmigiano']
};
function groupBaseMembers(id){
  return [...new Set([...((CURATED_PANTRY_GROUPS[id] || {}).members || []), ...(OTHER_GROUP_MEMBERS[id] || [])])];
}
// I formati di un gruppo, come chiavi minuscole: quelli scelti dalla famiglia
// (g.members, se l'ha modificato) oppure l'elenco di partenza, più le voci di
// Dispensa assegnate al gruppo.
function groupMemberKeys(id){
  const g = (state.pantryGroups || {})[id] || {};
  const base = Array.isArray(g.members) ? g.members : groupBaseMembers(id);
  const fromPantry = Object.entries(state.pantryItems || {}).filter(([, it]) => it.group === id).map(([k]) => k);
  return [...new Set([...base, ...fromPantry])];
}
function groupMemberLabel(key){
  const it = (state.pantryItems || {})[key];
  return it && it.nome ? it.nome : key.charAt(0).toUpperCase() + key.slice(1);
}
// Un gruppo modificato a mano tiene la sua lista: la si crea dall'elenco di partenza.
function materializeGroupMembers(id){
  const g = state.pantryGroups[id];
  if(g && !Array.isArray(g.members)) g.members = groupMemberKeys(id);
  return g;
}
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
// Grammi a porzione scelti nelle Regole (state.portionGrams: pasta, riso; 0 =
// come scritto nella ricetta). La quantità della ricetta ("320 g" per 4
// porzioni) si porta ai grammi scelti a testa. Solo righe in grammi di pasta o
// riso nei piatti dove sono l'ingrediente principale, con porzioni note.
const PORTION_GRAMS_KIND = [
  ['pasta', /^(pasta|spaghett|penne|rigaton|fusill|linguin|tagliatell|bucatin|mezze maniche|tortigliond|farfall|orecchiett|trofie|paccheri|maltagliati|cavatelli|ditalini|tubett|sedani|vermicelli|fettuccine)/i],
  ['riso', /^riso\b/i]
];
function portionGramsKind(ingName){
  const n = String(ingName || '').trim();
  const hit = PORTION_GRAMS_KIND.find(([, re]) => re.test(n));
  return hit ? hit[0] : '';
}
function applyPortionGrams(recipeName, it){
  const kind = portionGramsKind(it.ingrediente);
  const target = kind && state.portionGrams ? parseInt(state.portionGrams[kind], 10) : 0;
  if(!kind || !(target > 0) || (state.fixedPortionRecipes || {})[recipeName]) return it;
  const m = String(it.qta || '').trim().match(/^(\d+(?:[.,]\d+)?)\s*(g|kg)$/i);
  const det = getRecipeDetails(recipeName);
  const por = det ? parsePortionsBase(det.porzioni) : null;
  if(!m || !por) return it;
  const grams = parseFloat(m[1].replace(',', '.')) * (m[2].toLowerCase() === 'kg' ? 1000 : 1);
  const implied = grams / por;
  if(implied < 30 || implied > 200) return it; // non è una porzione di pasta/riso a testa (es. contorno, quantità strane)
  const out = Math.round(target * por / 5) * 5;
  return Object.assign({}, it, { qta: out >= 1000 ? `${String(out / 1000).replace('.', ',')} kg` : `${out} g` });
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
    const legacy = it.qual && LEGACY_VARIANT_NAMES[ingMatchKey(it.ingrediente) + '|' + it.qual];
    if(legacy) it = Object.assign({}, it, { ingrediente: legacy, qual: '' });
    if(it.qual && !it.spec) it = Object.assign({}, it, { spec: it.qual }); // specifica scelta da te (salvata come qual)
    const variant = !it.qual && CURATED_INGREDIENT_VARIANTS[(it.ingrediente || '').trim().toLowerCase()];
    if(variant) return Object.assign({}, it, { ingrediente: resolveIngredientName(variant[0], renames), qual: variant[1], spec: variant[1] });
    const displayName = resolveIngredientName(it.ingrediente, renames);
    if(displayName === it.ingrediente) return applyPortionGrams(name, it);
    // Il nome scritto nella ricetta ("Tuorli") resta come dettaglio accanto al
    // nome unificato ("Uova · tuorli"); se è solo una variante dello stesso
    // nome (singolare/plurale, "Sale" / "Sale fino") non si ripete.
    const orig = (it.ingrediente || '').trim().toLowerCase(), shown = displayName.toLowerCase();
    const qual = orig.slice(0, 3) === shown.slice(0, 3) ? '' : orig;
    return applyPortionGrams(name, Object.assign({}, it, { ingrediente: displayName, qual: it.qual || qual }));
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
  // A parità di posto, le righe con lo stesso nome (Uova e Uova · tuorli) stanno vicine.
  const first = {};
  list.forEach((it, idx) => { const k = (it.ingrediente || '').trim().toLowerCase(); if(!(k in first)) first[k] = idx; });
  return list.map((it, idx) => ({ it, idx, r: recipeIngredientRank(it.ingrediente), f: first[(it.ingrediente || '').trim().toLowerCase()] }))
    .sort((x, y) => x.r - y.r || x.f - y.f || x.idx - y.idx).map(x => x.it);
}
// Righe con lo stesso ingrediente (specifiche diverse) una dopo l'altra, nell'ordine in cui compare il nome la prima volta.
function groupRowsByName(rows){
  const order = [], by = {};
  rows.forEach(r => { const k = (r.ingrediente || '').trim().toLowerCase(); if(!by[k]){ by[k] = []; order.push(k); } by[k].push(r); });
  return order.flatMap(k => by[k]);
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
  return Array.from(names.values()).filter(n => !(state.hiddenIngredients || {})[n.trim().toLowerCase()]).sort((a,b)=>IT_COLLATOR.compare(a, b));
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
function attachIngredientCombobox(input, opts){
  opts = opts || {};
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
    const pool = opts.pool ? opts.pool() : allKnownIngredientNamesWithGroups();
    const stem = ingMatchStem(q);
    const matches = pool.filter(n => { const k = ingMatchKey(n); return k.includes(q) || (stem.length >= 3 && k.includes(stem)); })
      .sort((x, y) => (ingMatchKey(y).startsWith(q) ? 1 : 0) - (ingMatchKey(x).startsWith(q) ? 1 : 0))
      .slice(0, 8);
    const exact = pool.some(n => ingMatchKey(n) === q);
    let html = matches.map(n=>`<button type="button" class="add-ing-suggestion" data-combo-pick>${escapeHtml(n)}</button>`).join('');
    if(!exact && !opts.noCreate) html += `<button type="button" class="add-ing-suggestion add-ing-suggestion-new" data-combo-create>+ Crea "${escapeHtml(raw)}" come nuovo ingrediente</button>`;
    list.innerHTML = html;
  }
  input.addEventListener('input', renderSuggestions);
  input.addEventListener('focus', renderSuggestions);
  // mousedown con preventDefault: il campo non perde il fuoco (e la lista non
  // sparisce per il blur) prima che il tap sul suggerimento venga registrato.
  // La scelta si fa però al click, non al mousedown: se la lista sparisce
  // prima, su telefono il click del tap cade sull'elemento che sta sotto (es.
  // "Scansiona il codice a barre") e lo attiva.
  list.addEventListener('mousedown', e=>{ if(e.target.closest('[data-combo-pick],[data-combo-create]')) e.preventDefault(); });
  list.addEventListener('click', e=>{
    const pick = e.target.closest('[data-combo-pick]');
    if(pick){ e.preventDefault(); e.stopPropagation(); input.value = pick.textContent; list.innerHTML = ''; input.dispatchEvent(new Event('change', {bubbles:true})); return; }
    const create = e.target.closest('[data-combo-create]');
    if(create){ e.preventDefault(); e.stopPropagation(); list.innerHTML = ''; input.dispatchEvent(new Event('change', {bubbles:true})); }
  });
  input.addEventListener('blur', ()=>{ setTimeout(()=>{ list.innerHTML = ''; }, 150); });
}

const state = {
  tab: 'menu',
  shopChecked: {},
  shopDismissed: {},
  shopExtras: {},
  shopQty: {},
  shopUnit: {}, // rowKey di Spesa -> unità scelta a mano nel fumetto della quantità ('' = pezzi)
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
  generalShoppingRecurring1: false,
  lomoSaltadoAlbum1: false,
  familyDefaults1: false,
  pantryQtyMigrated: false,
  pantryUtilityLuogoMigrated: false,
  pantryUnitReviewed: false,
  pantryGroupMigrated: false,
  pantryGroupMigrated2: false,
  pantryNamesCurated1: false,
  pantryNamesCurated2: false,
  pantryGroupMigrated3: false,
  pantrySpecKeys1: false, // una tantum: le voci di Dispensa con una specifica passano alla chiave "nome|specifica"
  portionsBaseReset1: false, // una tantum: porzioni di partenza 3 (messe a mano per coprire l'avanzo) tornano a 2: l'avanzo collegato aggiunge la sua porzione da solo
  pantryGroupsBrodo: false, // una tantum: gruppi "Brodo vegetale" e "Brodo di carne" (il dado li copre)
  shopKeysByName1: false,
  baseDeptMigrated1: false,
  ricettarioDupes1: false,
  freezerMerge1: false,
  userColorsBright1: false,
  userColorsLight1: false,
  breadRecurring1: false,
  expiryRules1: false,
  expiryRules2: false,
  futureDone1: false,
  frozenOn1: false,
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
  shopOrderCustom: [], // ordine "Ordine spesa" scelto a mano: nomi (minuscoli) degli ingredienti, anche di quelli non più in lista (vedi shopOrderApply)
  shopAisleCustom: [], // ordine corsie della Spesa scelto a mano (vedi shopAisles)
  settingsReturnTab: null, // ephemeral: scheda da ripristinare quando si chiudono le Impostazioni
  backupOpen: false, // non persistito: pagina "Backup"
  inviteCode: '', // non persistito: ultimo codice invito mostrato in Persone
  onbStep: 0, // non persistito: passo del primo avvio guidato
  genGeneralOpen: false, // non persistito: pagina "Generazione menù"
  genFoodOpen: false, // non persistito: pagina "Preferenze alimentari"
  genGeneralSheet: null, // non persistito: pannellino aperto sulle Regole generali (grams | diet)
  genTargetEdit: null, // non persistito: categoria degli obiettivi con il fumetto aperto
  genGeneralPage: null, // non persistito: sotto-pagina aperta (diet, targets, grams, avoid)
  membersOpen: false, // non persistito: pagina "Persone"
  appearanceOpen: false, // non persistito: pagina "Tema e colori"
  gradPicker: null, // ephemeral: nome della ricetta con il menu del gradimento aperto
  profileOpen: false, // non persistito: pagina "Profilo"
  aisleOrderOpen: false, // non persistito: pagina "Ordine corsie"
  cardsSort: 'freq', // ordine delle carte fedeltà: 'freq' (le più aperte in alto) | 'az'
  loyaltyCards: [], // carte fedeltà [{ id, name, number, color, format }] (vedi renderCardsPages)
  cardsOpen: null, cardViewId: null, cardDraft: null, cardScanMsg: '', cardsImport: null, cardsSearch: '', cardsListUnder: false, // non persistiti: pagine Carte
  expiryEstimates: {}, // reparto -> giorni di scadenza stimata scelti da te (0 = nessuna stima); assente = valore di partenza
  expiryRules: {}, // id -> { match: 'parole, separate, da virgola', days }: eccezioni per nome (es. uova 21 giorni), vincono sul reparto
  expiryEstOpen: false, // non persistito: pagina "Scadenze stimate"
  shopExpiry: {}, // rowKey di Spesa -> scadenza (YYYY-MM-DD) segnata in negozio; passa in Dispensa quando sposti la riga
  barcodes: {}, // codice a barre -> { nome, cat, unit, qty }: prodotti già scansionati, col nome scelto da te
  scannerOpen: false, // non persistito: lettore di codici a barre aperto
  recurringItems: {}, // id -> { nome, qty, every, last }: ingredienti che si consumano a ritmo fisso (qty ogni `every` giorni); `last` = ultimo giorno già scalato dalla Dispensa
  doneModalMeal: {}, // ephemeral: id consumo ricorrente "a pasto" -> quanto togliere dalla Dispensa alla conferma di "Ricetta fatta!"
  recurringOpen: false, // non persistito: pagina "Consumi ricorrenti" aperta
  recurringEditId: null, // non persistito: 'new' o id in modifica
  recurringDraft: null, // non persistito: { nome, qty, every }
  inventoryOpen: false, // non persistito: pagina "Inventario veloce" aperta
  inventoryFilter: 'todo', inventorySearch: '', inventoryKeep: {}, // non persistiti: filtro/ricerca, e righe col Sì ancora aperte (in attesa di OK)
  inventoryAnswered: null, // risposte dell'inventario (in localStorage, vedi inventoryAnswers)
  ingredientManagerFilter: 'tutti', // non persistito: 'tutti' | 'casa' (in Dispensa) | 'no'
  deptEditId: null, // non persistito: categoria aperta in modifica ('new' per una nuova)
  deptDraft: null, // non persistito: { icon, label, nonFood } della categoria in modifica
  groupEditId: null, // non persistito: gruppo aperto in modifica ('new' per uno nuovo)
  groupDraft: null, // non persistito: { label, matchName, cat, matchTouched }
  groupMemberSearch: '', // non persistito: ricerca "Aggiungi un formato" nel gruppo in modifica
  sheetFull: false, // non persistito: i fogli dal basso (Aggiungi, Metti in dispensa) tirati su a tutto schermo
  addSheet: null, // non persistito: finestra "Aggiungi" unica ({mode:'spesa'|'casa', d: bozza come newPantryDraft, per, perNew, detailsOpen, suggestOpen, luogoUser})
  moveModal: null, // non persistito: finestra "Metti in dispensa" ({rows:[{rowKey,name,unit,per,qtyDefault,qtyLabel,luogo,scad,userScad}], open})
  expiryConfirm: [], // non persistito: chiavi di Dispensa con scadenza stimata da confermare (renderExpiryConfirmModal)
  balanceDetailsOpen: false, // non persistito: spiegazione sotto la riga dell'equilibrio nel Menù
  prepPantryMode: false, // non persistito: Ricette in modalità "Con quello che ho"
  whatsNewSeen: null, // vecchio: una sola "già vista" per tutto lo spazio — non più usato, vedi whatsNewSeenBy
  whatsNewSeenBy: {}, // { persona: ultima WHATS_NEW.version chiusa } — per persona, non per spazio (vedi renderWhatsNewModal)
  pantryEditingKey: null,
  linkNoteEditingKey: null, // dayKey della nota "Variante" attualmente in modifica (Menù, giorni avanzo)
  pantryLuogoPicker: null,
  pantryFinishPicker: null, // ephemeral: chiave della voce di Dispensa arrivata a 0, in attesa del carrello (in lista spesa) o cestino (tra i Finiti)
  pantrySectionCollapsed: {}, // id sezione (luogo_X / cat_X) -> true se chiusa; aperta di default se assente
  pantrySelectMode: false, // true dopo una pressione lunga: un tap semplice seleziona/deseleziona invece di aprire il luogo-picker
  pantrySelected: {}, // pantryKey -> true, selezione corrente in Dispensa (qualsiasi riga, non solo Finiti; non persistita)
  shopLaterOpen: false, // non persistito: accordion "Più avanti" (fresco delle settimane dopo)
  shopFinitiOpen: false, // accordion "Finiti", condiviso da Per reparto e Per giorno, chiuso di default
  shopSectionCollapsed: {}, // id sezione (reparto_X / giorno_X) -> true se chiusa; aperta di default se assente
  pantryConfirmedShop: {}, // pantryKey -> true (o la quantità scritta in "Aggiungi", es. "2 kg"), ingrediente finito "aggiunto alla lista": in Spesa/per reparto esce dal blocco Finiti e si mescola nel suo reparto vero
  pantryEditKey: null,
  recipeHistory: [], // [{ nome, dal: 'AAAA-MM-GG' }]: ricette delle settimane finite, per non ripeterle subito (vedi recentRecipeNames)
  pantryDraft: null, // non persistito: bozza della scheda "Aggiungi ingrediente"
  pantrySheetPicker: null, // non persistito: 'cat' | 'group', elenco aperto nella scheda ingrediente
  pantrySheetMore: false, // non persistito: sezione "Altro" della scheda aperta
  pantrySheetUsed: false, // non persistito: elenco "Usato in…" della scheda aperto
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
  leftoverLunchOn: false, // pranzo = avanzo della sera prima: attivo o no (Regole di generazione); si imposta per famiglia, vedi leftoverLunchOn1
  weekLeftoverDays: null, // giorni con il pranzo = avanzo della cena di ieri (null = tutti quelli possibili)
  portionGrams: { pasta: 0, riso: 0 }, // grammi a porzione di pasta e riso (0 = come nella ricetta)
  onboardingDone: false, // primo avvio guidato delle famiglie nuove completato
  dietType: 'onnivoro', // onnivoro | pescetariano | vegetariano (Regole di generazione)
  dietTargets: {}, // obiettivi settimanali cambiati a mano: { proteina: [min, max] }
  allergies: [], // allergie/intolleranze: chiavi di ALLERGEN_PRESETS o parole libere
  dietExclude: [], // ingredienti da evitare nella generazione
  weekLeftoverPortions: 1, // porzioni in più per ogni avanzo collegato
  weekPortionsBase: 2, // porzioni di partenza di ogni pasto generato (Regole di generazione); le cene da cui avanza il pranzo dopo partono con una in più
  genTwoWeeks: false, // non persistito: nelle Regole di generazione, genera anche la settimana prossima
  genPantryOnly: false, // non persistito: "Solo con quello che ho" nelle Regole di generazione
  weekTempoExceptions: {},
  userEmojis: {}, // emoji del profilo scelta da ciascun utente (vuota = iniziale del nome)
  members: [{ id: 'mara', name: 'Mara' }, { id: 'ste', name: 'Ste' }], // le persone della famiglia (nome; colore in userColors, emoji in userEmojis)
  userColors: { mara:'#ff7a66', ste:'#ff6f9c' }, // colore identità scelto da ciascun utente (profilo in Impostazioni)
  notifDismissed: {}, // mealKey ("weekIdx_i_meal") -> true, promemoria "tocca a te cucinare" già chiuso per quel pasto
  mealsDoneReminderDismissed: {}, // mealKey ("weekIdx_i_meal") -> true, promemoria "ieri hai mangiato X?" già chiuso per quel pasto (senza segnarlo mangiato)
  genSettingsOpen: null, // null = chiuso; 'plain' = solo impostazioni (da "Aggiungi settimana"); un numero = impostazioni + genera/rigenera per quella settimana (dal titolo settimana)
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
  prepDay: {}, // { 'AAAA-MM-GG' (primo giorno della settimana): 0-6 (Lun=0) } giorno di prep di quella settimana; i vecchi 'sab'|'dom' valgono ancora
  weekStartDay: 5, // primo giorno della settimana nel Menù (0=Lun ... 6=Dom), di solito il giorno della spesa; default sabato
  prepDayDefault: null, // giorno di meal prep di default (0-6); null = il primo giorno della settimana
  dishPlan: {}, // { mealKey: [{ name, prep, double, done, frozen }] } meal prep e doppia dose per piatto (vedi renderPrepBox)
  freezerDishes: {}, // { mealKey: [nomi] } piatti presi dal freezer: niente Spesa, porzioni scalate a pasto cucinato
  prepSuggOpen: {}, // ephemeral: settimana -> suggerimenti di prep aperti
  dishPicker: null, // ephemeral: {key: mealKey, replace: nome del piatto da cambiare o null, tipo, search} per "+ piatto"/"Cambia" del singolo piatto
  cookTimer: null, // ephemeral: { end (ms), total (s), label } timer del passo in modalità cucina
  cookMode: null, // ephemeral: { name, step, ratio, mk } modalità cucina (un passo per schermata)
  cookSession: [], // ephemeral: le ricette che si cucinano insieme (stesso pasto) con il passo a cui sono: { name, step, ratio }
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
  ingredientVariants: {}, // nome in minuscolo -> [specifiche] aggiunte da te (es. pompelmo: succo); si compra comunque l'ingrediente
  hiddenIngredients: {}, // nome in minuscolo -> true: ingredienti "eliminati" da Gestisci ingredienti (il nome può restare in qualche ricetta, quindi si nasconde dall'elenco)
  hiddenRecipes: {}, // nome -> true: ricette del catalogo "eliminate" (DATA.recipes è statico, quindi si nascondono invece di rimuoverle)
  newRecipeModalOpen: false,
  newRecipeError: '',
  newRecipeName: '', // ephemeral: nome scritto nella pagina "Aggiungi ricetta"
  expandedDay: null,
  expandedRecipe: null,
  swapOpenDay: null,
  swapFilters: {},
  mealsDone: {}, // {i: {pranzo:bool, cena:bool}}
  menuPick: null, // ephemeral: nome della ricetta per cui è aperto "Metti nel menù"
  doneModalRecipe: null, // ephemeral: { name, ratio } se "Ricetta fatta" è aperta da una ricetta (senza pasto)
  doneGradIdx: 0, // ephemeral: di quale piatto si sta dando il voto nel foglio "Cena fatta"
  doneRestOpen: false, // ephemeral: aperta la lista "Altri N non erano in Dispensa"
  doneModalDay: null, // chiave "weekIdx_i" del giorno per cui è aperta la modale "Ricetta fatta!" (sempre riferita alla cena, come il resto della UI in questo stadio)
  doneModalQty: {},
  doneQtyEditingKey: null, // ephemeral: nome ingrediente il cui campo "quanto ne hai usato" è in modifica diretta (modale "Ricetta fatta!")
  doneModalFinished: {}, // ephemeral: nome ingrediente "a spanne" (unit 'none') -> true se spuntato "L'hai finito?" nella modale "Ricetta fatta!"; non presente = non spuntato
  doneModalLeftovers: [], // ephemeral: una riga per piatto del pasto in "Ricetta fatta!" ({name, luogo, cat, checked, pickerOpen, catPickerOpen}); spuntata = va in Dispensa alla conferma
  filtersOpen: false, // { [dayIndex]: {search:'', cat:'same'|'all'} }
  filters: { cat:[], tipo:[], tempo:'', pian:'', stagione:'', freezer:'', grad:'', attrezz:'', quick:false, search:'' } // cat e tipo sono multi-selezione (array), gli altri restano a valore singolo
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
    const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } = await import("https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js");
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
      load(path){ return fbGet(ref(db, path)).then(snap => snap.val()); },
      remove(path){ return fbSet(ref(db, path), null); }
    };
    const auth = getAuth(app);
    window.cookpopAuth = {
      signIn(email, password){ return signInWithEmailAndPassword(auth, email, password); },
      createUser(email, password){ return createUserWithEmailAndPassword(auth, email, password); },
      signOut(){ return signOut(auth); },
      updateName(name){ return auth.currentUser ? updateProfile(auth.currentUser, { displayName: name }) : Promise.reject(new Error('non connesso')); },
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
let loggedInUid = null;
let loggedInName = ''; // nome del profilo (Firebase Auth displayName), se impostato
// Schermate di benvenuto (prima dell'account): presentazione in 4 schermate, una
// volta sola per dispositivo. "Ho già un account" e "Salta" portano al login.
const WELCOME_SEEN_KEY = 'cookpop-welcome-seen';
function welcomeSeen(){
  try{ return localStorage.getItem(WELCOME_SEEN_KEY) === '1'; }catch(e){ return true; }
}
function wlImg(name){ return `<img class="wl-hamster wl-hamster-${name}" src="assets/welcome/${name}.webp" alt="" onerror="this.style.visibility='hidden'">`; }
const WELCOME_SLIDES = [
  { title: 'Il menù si fa da solo', img: 'menu', btn: 'Avanti',
    text: 'Ogni settimana CookPOP propone pranzi e cene con le tue ricette, tenendo conto di tempo, stagione e di quello che hai in casa. Se un piatto non ti va, lo cambi con un tocco.',
    card: `<div class="wl-pill" aria-hidden="true"><span>🫘 3</span><span>·</span><span>🐟 2</span><span>·</span><span>🥚 1</span></div>
      <div class="wl-card" aria-hidden="true"><div class="wl-card-k">Ven 23 · Pranzo · ≤20 min</div>
        <div class="wl-dish"><span class="wl-dish-ic">🍗</span><span class="wl-dish-t"><b>Secondo</b>Platessa alla mugnaia</span></div>
        <div class="wl-dish"><span class="wl-dish-ic">🥕</span><span class="wl-dish-t"><b>Contorno</b>Rucola e grana</span></div></div>` },
  { title: 'La spesa si scrive da sola', img: 'spesa', btn: 'Avanti',
    text: 'Gli ingredienti del menù finiscono nella lista, già divisi per reparto e senza quello che hai già. Al supermercato spunti e vai: a casa li metti in dispensa con un tocco.',
    card: `<div class="wl-card" aria-hidden="true">
        <div class="wl-group">🥦 Frutta e verdura</div>
        <div class="wl-row is-done"><span class="wl-check on">✓</span><span class="wl-row-n">Limoni</span><span class="wl-row-q">2</span></div>
        <div class="wl-row"><span class="wl-check"></span><span class="wl-row-n">Rucola</span><span class="wl-row-q">100 g</span></div>
        <div class="wl-row"><span class="wl-check"></span><span class="wl-row-n">Zucchine</span><span class="wl-row-q">3</span></div>
        <div class="wl-group">🐟 Pesce</div>
        <div class="wl-row"><span class="wl-check"></span><span class="wl-row-n">Filetti di platessa</span><span class="wl-row-q">400 g</span></div></div>` },
  { title: 'La dispensa sa cosa hai', img: 'dispensa', btn: 'Iniziamo',
    text: 'Vedi cosa c’è in frigo, in freezer e in dispensa, e cosa sta per scadere. Con “Cosa cucino” trovi subito una ricetta per usarlo.',
    card: `<div class="wl-card" aria-hidden="true">
        <div class="wl-group">⏰ In scadenza</div>
        <div class="wl-row"><span class="wl-ico"><i class="wl-fridge"></i></span><span class="wl-row-n">Latte</span><span class="wl-badge is-warn">tra 2 gg</span></div>
        <div class="wl-row"><span class="wl-ico"><i class="wl-fridge"></i></span><span class="wl-row-n">Panna da cucina</span><span class="wl-badge is-warn">tra 3 gg</span></div>
        <div class="wl-group">🧀 Latticini e uova</div>
        <div class="wl-row"><span class="wl-ico"><i class="wl-fridge"></i></span><span class="wl-row-n">Uova</span><span class="wl-badge">4 nov</span></div>
        <div class="wl-row"><span class="wl-ico">❄️</span><span class="wl-row-n">Sugo</span><span class="wl-badge is-freeze">dal 23 ott</span></div></div>` }
];
function welcomeHtml(step){
  if(step <= 0){
    return `
    <div class="wl-screen">
      <div class="wl-hero is-tall">${wlImg('ciao')}
        <h1 class="wl-logo">CookPOP</h1>
        <p class="wl-sub">Il menù della settimana, la spesa e la dispensa, in un posto solo.</p>
      </div>
      <div class="wl-actions">
        <button type="button" class="btn is-solid is-block" data-wl-start>Inizia</button>
        <button type="button" class="login-link wl-link" data-wl-login>Ho già un account</button>
      </div>
    </div>`;
  }
  const i = Math.min(WELCOME_SLIDES.length, step) - 1, sl = WELCOME_SLIDES[i];
  return `
    <div class="wl-screen">
      <div class="wl-hero">${sl.card}${wlImg(sl.img)}</div>
      <div class="wl-panel">
        <span class="wl-kicker">${i + 1} di ${WELCOME_SLIDES.length}</span>
        <h2 class="wl-title">${escapeHtml(sl.title)}</h2>
        <p class="wl-text">${escapeHtml(sl.text)}</p>
      </div>
      <div class="wl-nav">
        <button type="button" class="wl-skip" data-wl-skip>Salta</button>
        <span class="wl-dots" aria-hidden="true">${WELCOME_SLIDES.map((_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('')}</span>
        <button type="button" class="btn is-solid wl-next" data-wl-next>${escapeHtml(sl.btn)}</button>
      </div>
    </div>`;
}
let welcomeStep = 0;
function renderWelcome(step){
  const el = document.getElementById('welcome-gate');
  if(!el) return;
  welcomeStep = step;
  el.innerHTML = welcomeHtml(step);
  el.querySelectorAll('img').forEach(im => { im.addEventListener('error', () => { im.style.visibility = 'hidden'; }); });
}
// Dopo il benvenuto si va al login: "Ho già un account" sul form di accesso,
// "Salta" / "Iniziamo" sulla creazione dell'account.
function finishWelcome(createAccount){
  try{ localStorage.setItem(WELCOME_SEEN_KEY, '1'); }catch(e){}
  const el = document.getElementById('welcome-gate');
  if(el) el.style.display = 'none';
  if(window.cookpopSetSignup) window.cookpopSetSignup(!!createAccount);
}
function welcomeSync(loggedIn){
  const el = document.getElementById('welcome-gate');
  if(!el) return;
  const show = !loggedIn && !welcomeSeen();
  el.style.display = show ? 'flex' : 'none';
  if(show && !el.firstElementChild) renderWelcome(0);
}
document.addEventListener('click', e=>{
  const t = e.target;
  if(!t.closest || !t.closest('#welcome-gate')) return;
  if(t.closest('[data-wl-start]')){ renderWelcome(1); return; }
  if(t.closest('[data-wl-login]')){ finishWelcome(false); return; }
  if(t.closest('[data-wl-skip]')){ finishWelcome(true); return; }
  if(t.closest('[data-wl-next]')){ if(welcomeStep >= WELCOME_SLIDES.length) finishWelcome(true); else renderWelcome(welcomeStep + 1); }
});

// La copia locale dei dati (per partire subito, anche offline) è di chi ha fatto
// l'accesso: se su questo telefono entra un altro account, la copia dell'altro si
// butta, così non si vedono le cose di un'altra famiglia. Si rilegge da Firebase.
const CACHE_OWNER_KEY = 'cookpop-cache-owner';
function claimLocalCache(uid){
  if(!uid) return false;
  let wiped = false;
  try{
    if(localStorage.getItem(CACHE_OWNER_KEY) !== uid){
      Object.keys(localStorage).forEach(k => {
        if(k.indexOf('quaderno-state-') === 0 || k.indexOf('catalog-state-cache') === 0 || k === 'cookpop-inventory-answers'){ localStorage.removeItem(k); wiped = true; }
      });
      localStorage.setItem(CACHE_OWNER_KEY, uid);
    }
  }catch(e){}
  return wiped;
}

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
      loggedInUid = user ? user.uid : null;
      loggedInName = user && user.displayName ? user.displayName : '';
      if(typeof refreshProfileLink === 'function') refreshProfileLink();
      gate.style.display = user ? 'none' : 'flex';
      if(!user) setBackgroundInert(null); // dopo "Esci" niente deve restare inerte sotto il login
      welcomeSync(!!user);
      if(user) claimLocalCache(user.uid);
      if(logoutBtn) logoutBtn.style.display = user ? 'block' : 'none';
      if(user && !resolved){ resolved = true; resolve(); }
    });

    let signupMode = false;
    const toggleBtn = document.getElementById('login-toggle');
    const subEl = gate.querySelector('.login-sub');
    function setSignupMode(on){
      signupMode = on;
      submitBtn.textContent = on ? 'Crea account' : 'Accedi';
      if(subEl) subEl.textContent = on ? 'Crea il tuo account' : 'Accedi per continuare';
      if(toggleBtn) toggleBtn.textContent = on ? 'Ho già un account' : 'Non hai un account? Creane uno';
      passInput.autocomplete = on ? 'new-password' : 'current-password';
      errorBox.textContent = '';
    }
    if(toggleBtn) toggleBtn.addEventListener('click', ()=> setSignupMode(!signupMode));
    // Occhio: mostra/nasconde la password mentre la scrivi.
    const eyeBtn = document.getElementById('login-eye');
    if(eyeBtn) eyeBtn.addEventListener('click', ()=>{
      const show = passInput.type === 'password';
      passInput.type = show ? 'text' : 'password';
      eyeBtn.setAttribute('aria-pressed', String(show));
      eyeBtn.setAttribute('aria-label', show ? 'Nascondi password' : 'Mostra password');
      eyeBtn.classList.toggle('on', show);
    });
    window.cookpopSetSignup = setSignupMode;
    async function doLogin(){
      errorBox.textContent = '';
      submitBtn.disabled = true;
      try{
        if(signupMode){
          if(passInput.value.length < 6){ errorBox.textContent = 'La password deve avere almeno 6 caratteri.'; submitBtn.disabled = false; return; }
          await window.cookpopAuth.createUser(emailInput.value.trim(), passInput.value);
        } else {
          await window.cookpopAuth.signIn(emailInput.value.trim(), passInput.value);
        }
      }catch(e){
        const code = (e && e.code) || '';
        errorBox.textContent = !signupMode ? 'Email o password non corretti.'
          : code.includes('email-already-in-use') ? 'Esiste già un account con questa email.'
          : code.includes('invalid-email') ? 'Questa email non sembra valida.'
          : code.includes('weak-password') ? 'La password è troppo debole.'
          : 'Non sono riuscito a creare l\'account.';
      }
      submitBtn.disabled = false;
    }
    submitBtn.addEventListener('click', doLogin);
    passInput.addEventListener('keydown', (e)=>{ if(e.key === 'Enter') doLogin(); });
    if(logoutBtn) logoutBtn.addEventListener('click', ()=> window.cookpopAuth.signOut());
  });
}

// --- Famiglie con codice invito ---------------------------------------------
// userFamily/<uid> dice a quale famiglia appartiene un account. Entrare in una
// famiglia richiede un codice invito (invites/<codice> → id famiglia, monouso);
// crearne una nuova richiede un codice di creazione (creationCodes/<codice>),
// che si mette a mano nella console Firebase. Le regole di sicurezza
// (database.rules.json) fanno rispettare tutto questo anche lato server.
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function randomCode(n){
  const out = [];
  const buf = new Uint32Array(n);
  (window.crypto || window.msCrypto).getRandomValues(buf);
  for(let i = 0; i < n; i++) out.push(CODE_ALPHABET[buf[i] % CODE_ALPHABET.length]);
  return out.join('');
}
function normalizeCode(c){ return (c || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); }
async function joinFamily(code, name){
  const sync = window.cookpopSync;
  code = normalizeCode(code);
  if(!sync || !loggedInUid) throw new Error('offline');
  const famId = code ? await sync.load('invites/' + code) : null;
  if(!famId) throw new Error('codice');
  await sync.save(`families/${famId}/members/${loggedInUid}`, { code, name: name || '' });
  await sync.save('userFamily/' + loggedInUid, famId);
  try{ await sync.remove('invites/' + code); }catch(e){ /* codice già consumato: va bene */ }
  return famId;
}
async function createFamily(familyName, code, name){
  const sync = window.cookpopSync;
  code = normalizeCode(code);
  if(!sync || !loggedInUid) throw new Error('offline');
  const ok = code ? await sync.load('creationCodes/' + code) : null;
  if(!ok) throw new Error('codice');
  const famId = randomCode(10).toLowerCase();
  await sync.save(`families/${famId}/meta`, { name: familyName || '', createdBy: loggedInUid, code });
  // Il codice c'è anche qui: le regole lo leggono per capire se è un invito, e
  // senza (null) l'espressione va in errore e la scrittura viene rifiutata.
  await sync.save(`families/${famId}/members/${loggedInUid}`, { name: name || '', creator: true, code });
  await sync.save('userFamily/' + loggedInUid, famId);
  try{ await sync.remove('creationCodes/' + code); }catch(e){ /* già consumato */ }
  return famId;
}
// Un nuovo codice invito per la famiglia (monouso), da dare a chi deve entrare.
async function makeInvite(){
  const sync = window.cookpopSync, r = activeRoute;
  if(!sync || !r || !r.famId) throw new Error('nessuna famiglia');
  const code = randomCode(8);
  await sync.save('invites/' + code, r.famId);
  return code;
}
// Trova la famiglia di questo account all'avvio. Chi non ne ha una e non è
// uno degli account di prima passa dalla schermata "Entra o crea".
async function resolveFamilyRoute(){
  const sync = window.cookpopSync;
  if(!sync || !loggedInUid){ activeRoute = null; return; }
  const cacheKey = 'cookpop-family-' + loggedInUid;
  let famId = null;
  try{
    famId = await Promise.race([sync.load('userFamily/' + loggedInUid), new Promise((_, rej)=> setTimeout(()=> rej(new Error('timeout')), 5000))]);
  }catch(e){
    try{ famId = localStorage.getItem(cacheKey); }catch(_){}
    if(!famId){ activeRoute = legacyRouteStrict(loggedInEmail) === null && loggedInEmail ? { id: 'sola-lettura', path: 'senza-rete/state', catalogPath: 'senza-rete/catalog', newFamily: true } : legacyRouteFor(loggedInEmail); return; }
  }
  if(!famId){
    // Un account senza famiglia assegnata che ha nell'email un nome di prima
    // (anche dentro una parola, es. "stefano"): si prova a leggere lo spazio di
    // prima; se le regole lo negano non è di quella famiglia e passa da "Entra o
    // crea". Il nome nell'email, da solo, non basta mai.
    const legacy = legacyRouteStrict(loggedInEmail) || legacyRouteFor(loggedInEmail);
    if(legacy && loggedInEmail){
      try{ await sync.load(legacy.path + '/week0Start'); activeRoute = null; return; }catch(e){ /* non è dei loro */ }
    }
    famId = await runFamilyGate();
  }
  try{ localStorage.setItem(cacheKey, famId); }catch(e){}
  const info = await loadFamilyInfo(famId);
  // Collegata ma senza i dati di dove stanno (migrazione a metà): chi è di una
  // famiglia di prima resta sul suo spazio, invece di trovarne uno vuoto.
  if(!info.meta && legacyRouteStrict(loggedInEmail)){ activeRoute = null; return; }
  selfMemberId = info.memberId;
  activeRoute = familyRouteFor(famId, info.meta);
}
function runFamilyGate(){
  return new Promise((resolve)=>{
    const gate = document.getElementById('family-gate');
    if(!gate){ resolve(null); return; }
    const q = id => document.getElementById(id);
    let mode = 'join';
    const render = ()=>{
      q('family-tab-join').classList.toggle('active', mode === 'join');
      q('family-tab-create').classList.toggle('active', mode === 'create');
      q('family-name-wrap').style.display = mode === 'create' ? '' : 'none';
      q('family-code').placeholder = mode === 'create' ? 'Codice di creazione' : 'Codice invito';
      q('family-submit').textContent = mode === 'create' ? 'Crea la famiglia' : 'Entra';
      q('family-error').textContent = '';
    };
    q('family-tab-join').onclick = ()=>{ mode = 'join'; render(); };
    q('family-tab-create').onclick = ()=>{ mode = 'create'; render(); };
    q('family-out').onclick = ()=> window.cookpopAuth && window.cookpopAuth.signOut();
    q('family-submit').onclick = async ()=>{
      const err = q('family-error'), btn = q('family-submit');
      err.textContent = ''; btn.disabled = true;
      try{
        const name = q('family-user-name').value.trim() || (loggedInEmail || '').split('@')[0];
        const famId = mode === 'create'
          ? await createFamily(q('family-name').value.trim(), q('family-code').value, name)
          : await joinFamily(q('family-code').value, name);
        gate.style.display = 'none';
        resolve(famId);
      }catch(e){
        err.textContent = e && e.message === 'codice' ? (mode === 'create' ? 'Codice di creazione non valido.' : 'Codice invito non valido o già usato.') : 'Non sono riuscito, riprova tra poco.';
      }
      btn.disabled = false;
    };
    render();
    gate.style.display = 'flex';
  });
}
// Chi ha un accesso nuovo compare tra le persone della famiglia al primo avvio.
function ensureSelfMember(){
  const r = activeRoute;
  if(!r || !r.famId || !loggedInUid || selfMemberId) return;
  const list = familyMembers();
  if(list.some(m => m.uid === loggedInUid)) return;
  const id = 'u' + loggedInUid.slice(0, 8).toLowerCase();
  const used = new Set(list.map(m => memberColor(m.id)));
  const name = loggedInName || (loggedInEmail || '').split('@')[0] || 'Io';
  state.members = [...list, { id, name, uid: loggedInUid }];
  state.userColors = Object.assign({}, state.userColors, { [id]: USER_COLOR_PRESETS.find(c => !used.has(c)) || USER_COLOR_PRESETS[0] });
  persist();
}

// Chi sta usando l'app ora: dedotto dall'account con cui ha fatto login
// (le due email contengono "mara"/"ste"), non serve più un toggle manuale.
function getCurrentUser(){
  if(selfMemberId && familyMembers().some(x => x.id === selfMemberId)) return selfMemberId;
  const byUid = loggedInUid && familyMembers().find(x => x.uid === loggedInUid);
  if(byUid) return byUid.id;
  if(activeRoute && activeRoute.famId) return null;
  const email = (loggedInEmail || '').toLowerCase();
  const m = familyMembers().find(x => email.includes(x.id));
  return m ? m.id : null;
}
// Le persone della famiglia: nome e colore propri, al posto dei due nomi fissi
// di prima. Gli id 'mara' e 'ste' restano quelli dei dati già salvati.
const MEMBERS_MAX = 6;
function familyMembers(){
  const list = Array.isArray(state.members) ? state.members.filter(m => m && m.id) : [];
  if(list.length || (activeRoute && activeRoute.newFamily)) return list;
  return [{ id: 'mara', name: 'Mara' }, { id: 'ste', name: 'Ste' }];
}
function memberById(id){ return familyMembers().find(m => m.id === id) || null; }
function memberName(id){ const m = memberById(id); return m && m.name ? m.name : (id ? id.charAt(0).toUpperCase() + id.slice(1) : ''); }
function memberColor(id){
  if(state.userColors && state.userColors[id]) return state.userColors[id];
  const i = familyMembers().findIndex(m => m.id === id);
  return USER_COLOR_PRESETS[(i < 0 ? 0 : i) % USER_COLOR_PRESETS.length];
}
// Nome e colore li decide ognuno per sé (dal Profilo); in Persone si
// modificano solo i propri e quelli delle persone aggiunte a mano, che non
// hanno un accesso (es. i bambini, la nonna).
function canEditMember(id){
  const me = getCurrentUser(), m = memberById(id);
  return !me || me === id || !!(m && m.manual);
}
// Chi viene dopo nel giro "nessuno → persona 1 → persona 2 → … → nessuno".
function nextMemberId(cur){
  const ids = familyMembers().map(m => m.id);
  if(!cur) return ids[0];
  const i = ids.indexOf(cur);
  return i >= 0 && i < ids.length - 1 ? ids[i + 1] : null;
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
const CATALOG_STATE_PATH = 'catalog-state'; // catalogo della famiglia originale: le altre famiglie ne hanno uno proprio
// catalogPath: dove sta il catalogo della famiglia (ricette curate, ingredienti,
// gruppi). seedFromShared: alla prima apertura si parte da una copia di quello
// originale, per le famiglie che finora lo condividevano; una famiglia nuova
// parte invece dalle sole ricette di base.
const SPACE_ROUTES = [
  { id: 'default', match: ['mara','ste'], path: 'quaderno-state', catalogPath: CATALOG_STATE_PATH },
  { id: 'cugina', match: ['cugina'], path: 'spaces/cugina/state', catalogPath: 'spaces/cugina/catalog', seedFromShared: true },
  { id: 'mamma', match: ['mamma'], path: 'spaces/mamma/state', catalogPath: 'spaces/mamma/catalog', seedFromShared: true }
];
function catalogPath(){ return getSpaceRoute().catalogPath || CATALOG_STATE_PATH; }
function catalogCacheKey(){ const r = getSpaceRoute(); return r.id === 'default' ? 'catalog-state-cache' : 'catalog-state-cache-' + r.id; }
// Famiglie nate dopo (con codice invito): il percorso dipende dall'id della
// famiglia, che si legge da userFamily/<uid> all'avvio (vedi resolveFamilyRoute).
// meta.paths (scritto a mano nella console per le famiglie di prima) dice dove
// stanno i loro dati, che non vengono spostati: stato, catalogo, foto.
function familyRouteFor(famId, meta){
  const p = meta && meta.paths;
  if(p && p.state){
    return { id: famId, famId, newFamily: false, path: p.state, catalogPath: p.catalog || `families/${famId}/catalog`, photosPath: p.photos || null,
      seedFromShared: !!p.seedCatalogFrom, seedPath: p.seedCatalogFrom || null, defaults: (meta && meta.defaults) || {} };
  }
  return { id: 'f-' + famId, famId, newFamily: true, path: `families/${famId}/state`, catalogPath: `families/${famId}/catalog`, defaults: (meta && meta.defaults) || {} };
}
// Chi sono io tra le persone della famiglia (families/<id>/members/<uid>/memberId):
// vale per le famiglie di prima, dove "mara" e "ste" esistevano già nei dati.
let selfMemberId = null;
async function loadFamilyInfo(famId){
  const sync = window.cookpopSync, key = 'cookpop-family-info-' + loggedInUid + '-' + famId;
  const withTimeout = p => Promise.race([p, new Promise((_, rej)=> setTimeout(()=> rej(new Error('timeout')), 5000))]);
  try{
    const [meta, me] = await Promise.all([
      withTimeout(sync.load(`families/${famId}/meta`)),
      withTimeout(sync.load(`families/${famId}/members/${loggedInUid}`))
    ]);
    const info = { meta: meta || null, memberId: me && me.memberId ? me.memberId : null };
    try{ localStorage.setItem(key, JSON.stringify(info)); }catch(e){}
    return info;
  }catch(e){
    try{ const c = localStorage.getItem(key); if(c) return JSON.parse(c); }catch(_){}
    return { meta: null, memberId: null };
  }
}
let activeRoute = null;
// Le famiglie di prima si riconoscono dall'email; chi ha un accesso nuovo non
// finisce mai nello spazio di default per sbaglio. Senza email (offline) resta
// lo spazio originale, come sempre.
function legacyRouteFor(email){
  email = (email || '').toLowerCase();
  if(!email) return SPACE_ROUTES[0];
  return SPACE_ROUTES.find(r => r.match.some(m => email.includes(m))) || null;
}
// Riconoscimento sicuro: il nome deve essere una parola intera dell'email
// ("mara.rossi@…" sì, "stefano@…" no), così chi si registra adesso non finisce
// per sbaglio nello spazio di un'altra famiglia.
function legacyRouteStrict(email){
  const local = (email || '').toLowerCase().split('@')[0];
  const words = local.split(/[^a-z]+/).filter(Boolean);
  return SPACE_ROUTES.find(r => r.match.some(m => words.includes(m))) || null;
}
function getSpaceRoute(){
  return activeRoute || legacyRouteFor(loggedInEmail) || SPACE_ROUTES[0];
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
const CATALOG_FIELDS = ['recipeIngredients','ingredientRenames','recipeEdits','customRecipes','hiddenRecipes','hiddenIngredients','ingredientVariants','pantryGroups','customDepts'];
function decodeCatalogSaved(saved){
  if(saved.recipeIngredients) saved.recipeIngredients = decodeKeysFromFirebase(saved.recipeIngredients);
  if(saved.ingredientRenames) saved.ingredientRenames = decodeKeysFromFirebase(saved.ingredientRenames);
  if(saved.recipeEdits) saved.recipeEdits = decodeKeysFromFirebase(saved.recipeEdits);
  if(saved.customRecipes) saved.customRecipes = decodeKeysFromFirebase(saved.customRecipes);
  if(saved.hiddenRecipes) saved.hiddenRecipes = decodeKeysFromFirebase(saved.hiddenRecipes);
  if(saved.hiddenIngredients) saved.hiddenIngredients = decodeKeysFromFirebase(saved.hiddenIngredients);
  if(saved.ingredientVariants) saved.ingredientVariants = decodeKeysFromFirebase(saved.ingredientVariants);
  return saved;
}
function encodeCatalogForFirebase(payload){
  return JSON.parse(JSON.stringify({
    ...payload,
    recipeIngredients: encodeKeysForFirebase(payload.recipeIngredients),
    ingredientRenames: encodeKeysForFirebase(payload.ingredientRenames),
    recipeEdits: encodeKeysForFirebase(payload.recipeEdits),
    customRecipes: encodeKeysForFirebase(payload.customRecipes),
    hiddenRecipes: encodeKeysForFirebase(payload.hiddenRecipes),
    hiddenIngredients: encodeKeysForFirebase(payload.hiddenIngredients),
    ingredientVariants: encodeKeysForFirebase(payload.ingredientVariants)
  }));
}
// Tavolozza di colori preimpostati tra cui scegliere il proprio "colore identità"
// (profilo in Impostazioni): solo toni abbastanza scuri/saturi da restare leggibili
// col testo chiaro sopra (--bg) del cook-pill.
const USER_COLOR_PRESETS = ['#ff7a66','#ff6f9c','#ffae42','#ffd23f','#6fe07a','#3fe0c8','#6bb6ff','#c293ff'];
const USER_COLOR_PRESETS_BRIGHT = ['#ff3b1d','#ff2d6f','#ff8a00','#ffb800','#2fd24f','#00c2a8','#2d8cff','#a75cff'];
const USER_COLOR_PRESETS_OLD = ['#d6391c','#87282b','#c9702e','#b08d2b','#5a7517','#2e7d6b','#546e7a','#7a5a8a'];
// Colore d'accento dell'app: tavolozza a sé (non cambia con quella dei turni di cucina).
const ACCENT_PRESETS = USER_COLOR_PRESETS_OLD;
function applyUserColors(){
  familyMembers().forEach(m => document.documentElement.style.setProperty('--user-color-' + m.id, memberColor(m.id)));
  if(typeof refreshProfileLink === 'function') refreshProfileLink();
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
  if(meta) meta.setAttribute('content', isDark ? '#121212' : '#f3f2f2');
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
  // Il colore scelto in Tema cambia solo i tre token d'accento del design system
  // (--gold e --gold-dark ne sono alias); --gold-rgb serve a ombre e sfumature.
  if(!hex){
    ['--accent', '--accent-text', '--accent-soft', '--gold-rgb'].forEach(p => root.removeProperty(p));
    return;
  }
  root.setProperty('--accent', hex);
  root.setProperty('--accent-text', `color-mix(in srgb, ${hex} 78%, var(--text))`);
  root.setProperty('--accent-soft', `color-mix(in srgb, ${hex} 15%, transparent)`);
  root.setProperty('--gold-rgb', hexToRgbTriplet(hex).join(','));
}

// Se per un attimo l'accento è stato scelto dalla tavolozza nuova dei turni di
// cucina, torna al colore corrispondente della sua tavolozza.
(function(){
  try{
    // Il rosso d'accento di prima (#e03c1e) è diventato quello del design system (#d6391c).
    if((localStorage.getItem(ACCENT_KEY) || '').toLowerCase() === '#e03c1e') localStorage.setItem(ACCENT_KEY, '#d6391c');
    const a = localStorage.getItem(ACCENT_KEY);
    const i = a ? USER_COLOR_PRESETS.indexOf(a) : -1;
    if(i >= 0 && !ACCENT_PRESETS.includes(a)) applyAccent(ACCENT_PRESETS[i]);
  }catch(e){}
})();

// Migrazioni una tantum dello stato personale, in ordine di arrivo: ognuna
// gira una sola volta per spazio (il suo flag in state, salvato su Firebase
// con gli altri dati personali — vedi buildPersonalPayload) e poi mai più.
// Per aggiungerne una: nuova voce IN FONDO con un flag mai usato prima (non
// rinominare né riordinare quelle esistenti: il flag è ciò che ricorda che è
// già stata fatta). Girano in init, subito dopo loadState, vedi runMigrations.
const MIGRATIONS = [
  // 1. Il vecchio elenco statico di scorte (DATA.pantry) non esiste più: la
  // Dispensa parte vuota. Il flag resta per chi l'aveva già popolata.
  { flag: 'pantrySeeded', run(){} },
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
  { flag: 'pantrySpecKeys1', run(){
    Object.keys(state.pantryItems).forEach(key => {
      const it = state.pantryItems[key];
      if(!it || !it.spec || key.includes('|')) return;
      pantryRekey(key, pantryKeyFor(it.nome || key, it.spec));
    });
  }},
  { flag: 'portionsBaseReset1', run(){
    if(parseInt(state.weekPortionsBase, 10) === 3) state.weekPortionsBase = 2;
  }},
  { flag: 'pantryGroupsBrodo', run(){
    ['brodo-vegetale', 'brodo-carne'].forEach(id => { if(!state.pantryGroups[id]) state.pantryGroups[id] = Object.assign({}, CURATED_PANTRY_GROUPS[id].group); });
  }},
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
  // Le tre paste del ricettario (Pasta e zucca / patate / lenticchie) hanno preso
  // il posto delle versioni del catalogo con lo stesso nome: via le modifiche e gli
  // "eliminata" rimasti alle vecchie, e quelle col "(ricettario)" nel nome passano
  // al nome semplice (pasti, album, modifiche comprese).
  // 22. Una tantum: "Base congelabile" e "Si può congelare" diventano una sola
  // voce ("Si può congelare"): le ricette tue con 'base' passano a 'congelabile'
  // (il catalogo è già aggiornato in catalog.js).
  // 23. Una tantum: colori dei turni di cucina più saturi e luminosi; quelli
  // già scelti passano al corrispondente della nuova tavolozza.
  // 24. Una tantum: colori dei turni più chiari; chi aveva la versione "luminosa"
  // di poco fa passa a quella chiara corrispondente.
  { flag: 'expiryRules1', run(){
    // Le uova stanno in Latticini (5 giorni) ma durano molto di più: regola per nome.
    if(!state.expiryRules) state.expiryRules = {};
    if(!Object.keys(state.expiryRules).length) state.expiryRules = defaultExpiryRules();
  } },
  { flag: 'expiryRules2', run(){
    // Le eccezioni passano da parole del nome a ingrediente preciso: ogni parola
    // che coincide con un ingrediente noto diventa una regola su quel nome.
    const rules = state.expiryRules || {};
    const known = new Map(allKnownIngredientNames().concat(Object.values(state.pantryItems || {}).map(it => it.nome)).map(n => [String(n).trim().toLowerCase(), n]));
    const next = {};
    Object.entries(rules).forEach(([id, r])=>{
      if(r.nome){ next[id] = r; return; }
      String(r.match || '').split(/[,;]/).map(w => w.trim().toLowerCase()).filter(Boolean).forEach(w=>{
        if(known.has(w)) next[w.replace(/\W+/g, '-')] = { nome: known.get(w), days: Number(r.days) || 0 };
      });
    });
    state.expiryRules = next;
  } },
  { flag: 'breadRecurring1', run(){
    // Il pane a pasto (cena + weekend a pranzo) era un conteggio a parte: ora è
    // un consumo ricorrente "con i pasti", gestito da Dispensa ⋯.
    if(!state.recurringItems) state.recurringItems = {};
    if(Object.values(state.recurringItems).some(r => r.mode === 'meal')) return;
    const it = ['pane', 'panini', 'panino'].map(k => state.pantryItems && state.pantryItems[k]).find(Boolean);
    if(it) state.recurringItems['rpane'] = { nome: it.nome, qty: 1, every: 1, mode: 'meal', last: isoLocalDate(new Date()) };
  } },
  // La riga fissa "Insalata, 2 cespi ogni settimana" era della famiglia
  // originale: ora è un consumo ricorrente (Impostazioni → Consumi ricorrenti),
  // come il latte. Solo per quella famiglia.
  { flag: 'generalShoppingRecurring1', run(){
    if(getSpaceRoute().id !== 'default') return;
    if(!state.recurringItems) state.recurringItems = {};
    if(Object.values(state.recurringItems).some(r => /^insalata/i.test(r.nome || ''))) return;
    if(!resolvePantryItem('Insalata')){ upsertPantryItem('Insalata', 'frigo', 0); }
    const it = resolvePantryItem('Insalata');
    if(it && typeof it.qty !== 'number') it.qty = 0;
    state.recurringItems['rinsalata'] = { nome: it ? it.nome : 'Insalata', qty: 2, every: 7, mode: 'time', last: isoLocalDate(new Date()) };
  } },
  // Impostazioni di partenza di ogni famiglia: pranzo con l'avanzo e porzioni.
  // Si possono dare da Firebase (families/<id>/meta/defaults: { leftoverLunch,
  // portionsBase }); altrimenti la famiglia originale lo tiene attivo e con 2
  // porzioni, la cugina lo ha spento e parte da 1, le altre spento e 2.
  { flag: 'familyDefaults1', run(){
    const r = getSpaceRoute();
    const fallback = { default: { leftoverLunch: true }, cugina: { leftoverLunch: false, portionsBase: 1 } }[r.id] || { leftoverLunch: false };
    const d = Object.assign({}, fallback, r.defaults || {});
    state.leftoverLunchOn = !!d.leftoverLunch;
    if(Number.isFinite(d.portionsBase) && d.portionsBase >= 1) state.weekPortionsBase = Math.min(12, Math.round(d.portionsBase));
  } },
  // "Lomo saltado" (nuova nel catalogo): chi ha un album "Compleanni" la trova già dentro.
  { flag: 'lomoSaltadoAlbum1', run(){
    (state.cookbooks || []).forEach(cb => {
      if(cb && /compleann/i.test(cb.name || '') && Array.isArray(cb.recipes) && !cb.recipes.includes('Lomo saltado')) cb.recipes.push('Lomo saltado');
    });
  } },
  { flag: 'userColorsLight1', run(){
    Object.keys(state.userColors || {}).forEach(u=>{
      const i = USER_COLOR_PRESETS_BRIGHT.indexOf(state.userColors[u]);
      if(i >= 0) state.userColors[u] = USER_COLOR_PRESETS[i];
    });
  } },
  { flag: 'userColorsBright1', run(){
    Object.keys(state.userColors || {}).forEach(u=>{
      const i = USER_COLOR_PRESETS_OLD.indexOf(state.userColors[u]);
      if(i >= 0) state.userColors[u] = USER_COLOR_PRESETS[i];
    });
  } },
  { flag: 'freezerMerge1', run(){
    Object.values(state.recipeEdits || {}).forEach(e=>{ if(e && e.freezerNew === 'base') e.freezerNew = 'congelabile'; });
    Object.values(state.customRecipes || {}).forEach(r=>{ if(r && r.freezerNew === 'base') r.freezerNew = 'congelabile'; });
  } },
  { flag: 'ricettarioDupes1', run(){
    [['Pasta e zucca', 'Pasta e zucca (ricettario)'], ['Pasta e patate', 'Pasta e patate (ricettario)'], ['Pasta e lenticchie', 'Pasta e lenticchie (ricettario)']].forEach(([plain, tagged])=>{
      delete state.recipeEdits[plain]; delete state.recipeIngredients[plain]; delete state.hiddenRecipes[plain];
      if(state.hiddenRecipes[tagged]){ state.hiddenRecipes[plain] = true; delete state.hiddenRecipes[tagged]; }
      if(state.customRecipes[tagged]){ state.customRecipes[plain] = Object.assign({}, state.customRecipes[tagged], { nome: plain }); delete state.customRecipes[tagged]; }
      moveRecipeKeys(tagged, plain);
      renameRecipeRefs(tagged, plain);
    });
  } },
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
  // Pasti di giorni futuri rimasti "cucinati" dopo il passaggio di settimana
  // (un telefono non aggiornato rimetteva i vecchi segni sulla nuova
  // settimana): si tolgono una volta sola. Vedi anche onChange in loadState.
  // Ciò che è già in freezer non ha una data di congelamento nota: resta senza
  // (stringa vuota), solo quello che ci entra da ora la segna.
  { flag: 'frozenOn1', run(){
    Object.values(state.pantryItems || {}).forEach(it=>{ if(it && it.luogo === 'freezer' && it.frozenOn === undefined) it.frozenOn = ''; });
  }},
  { flag: 'futureDone1', run(){ clearFutureMealsDone(); }},
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
  // Una famiglia nuova parte senza persone: la prima è chi crea/entra (vedi
  // ensureSelfMember), non i due nomi della famiglia originale.
  // Niente scorte né spesa fissa di partenza: quelle di prima sono della famiglia originale.
  if(route.newFamily){ state.members = []; state.userColors = {}; state.pantrySeeded = true; }
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
    const catalogCached = localStorage.getItem(catalogCacheKey());
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
        // Passaggio di settimana fatto da un altro telefono: Firebase non
        // salva i campi svuotati, quindi qui mancano e la Object.assign li
        // lascerebbe com'erano — i vecchi "cucinato" e blocchi della
        // settimana passata finivano sulla nuova. Si svuotano.
        if(saved.week0Start && state.week0Start && saved.week0Start !== state.week0Start){
          WEEK_KEYED_FIELDS.concat(WEEK_SHOP_FIELDS, ['mealsDone','weekOverrides','weekOverridePicked','weekBaseline']).forEach(f=>{ if(!(f in saved)) saved[f] = {}; });
          if(!('extraWeeks' in saved)) saved.extraWeeks = [];
        }
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

  // Catalogo ricette/ingredienti: uno per famiglia (vedi SPACE_ROUTES) — chi
  // cura una ricetta o rinomina un ingrediente lo fa solo per la sua famiglia.
  await new Promise((resolve)=>{
    let done = false, seeding = false;
    window.cookpopSync.onChange(catalogPath(), (saved)=>{
      if(saved){
        seeding = false;
        decodeCatalogSaved(saved);
        // Stessa cautela del percorso personale qui sopra: una modifica al
        // catalogo (es. una ricetta curata) fatta mentre si aspettava questa
        // risposta non deve sparire sotto lo snapshot del server.
        const localEdits = buildFirebasePatch(buildCatalogPayload(), lastSyncedCatalog, CATALOG_DICT_FIELDS);
        Object.assign(state, saved);
        applyFirebasePatch(localEdits);
        try{ localStorage.setItem(catalogCacheKey(), JSON.stringify(saved)); }catch(e){}
        lastSyncedCatalog = JSON.parse(JSON.stringify(saved));
      } else if(route.seedFromShared){
        // Famiglia che finora usava il catalogo originale: alla prima apertura
        // se ne prende una copia (così com'è su Firebase) nel suo percorso; il
        // listener la rilegge appena scritta.
        // Finché la copia non è arrivata non si scrive nulla (catalogSynced
        // resta falso): la riga sotto lo riattiva alla lettura successiva.
        lastSyncedCatalog = {};
        seeding = true;
        window.cookpopSync.load(route.seedPath || CATALOG_STATE_PATH).then(base=>{
          if(base) return window.cookpopSync.save(catalogPath(), base);
          catalogSynced = true; render();
          if(catalogSaveDeferred){ catalogSaveDeferred = false; persist(); }
        }).catch(e=>{ console.error('Copia del catalogo fallita', e); catalogSynced = true; });
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
      } else {
        lastSyncedCatalog = {}; // famiglia nuova: solo le ricette di base
      }
      if(!seeding){ catalogSynced = true; render(); if(catalogSaveDeferred){ catalogSaveDeferred = false; persist(); } }
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
const PERSONAL_DICT_FIELDS = ['userEmojis','whatsNewSeenBy','shopChecked','shopDismissed','shopExtras','shopQty','shopUnit','pantryChecked','pantryConfirmedShop','weekOverrides','weekOverridePicked','weekBaseline','weekTempoExceptions','notifDismissed','mealsDoneReminderDismissed','dayLinks','dayLinkNotes','dayPortions','mealLocked','cooks','shopAssignees','ingredientNotes','mealsDone','pantryItems','recurringItems','barcodes','shopExpiry','expiryEstimates','expiryRules','userColors','prepDay','dishPlan','freezerDishes'];
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
    shopUnit: state.shopUnit,
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
    weekPortionsBase: state.weekPortionsBase,
    portionGrams: state.portionGrams,
    weekLeftoverPortions: state.weekLeftoverPortions,
    onboardingDone: state.onboardingDone,
    dietType: state.dietType,
    dietTargets: state.dietTargets,
    dietExclude: state.dietExclude,
    allergies: state.allergies,
    leftoverLunchOn: state.leftoverLunchOn,
    weekStartDay: state.weekStartDay,
    prepDayDefault: state.prepDayDefault,
    weekLeftoverDays: state.weekLeftoverDays,
    weekTempoExceptions: state.weekTempoExceptions,
    userColors: state.userColors,
    members: state.members,
    userEmojis: state.userEmojis,
    notifDismissed: state.notifDismissed,
    mealsDoneReminderDismissed: state.mealsDoneReminderDismissed,
    pantryConfirmedShop: state.pantryConfirmedShop,
    cooks: state.cooks,
    shopAssignees: state.shopAssignees,
    appliedForcedWeekVersion: state.appliedForcedWeekVersion,
    mealsDone: state.mealsDone,
    ingredientNotes: state.ingredientNotes,
    pantryItems: state.pantryItems,
    recurringItems: state.recurringItems,
    barcodes: state.barcodes,
    shopExpiry: state.shopExpiry,
    expiryEstimates: state.expiryEstimates,
    expiryRules: state.expiryRules,
    week0Start: state.week0Start,
    whatsNewSeen: state.whatsNewSeen,
    whatsNewSeenBy: state.whatsNewSeenBy,
    recipeHistory: state.recipeHistory,
    prepDay: state.prepDay,
    dishPlan: state.dishPlan,
    freezerDishes: state.freezerDishes,
    loyaltyCards: state.loyaltyCards,
    cardsSort: state.cardsSort,
    shopAisleCustom: state.shopAisleCustom,
    shopOrderCustom: state.shopOrderCustom,
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
    try{ localStorage.setItem(catalogCacheKey(), JSON.stringify(catalogPayload)); }catch(e){}
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
          saveCatalog = window.cookpopSync.patch(catalogPath(), catalogPatch)
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
    // I piatti dell'avanzo seguono la fonte; quelli aggiunti a questo pasto
    // (override.contorni) sono piatti nuovi, a parte: ownExtras.
    const ownOverride = readMealSlot(weekOverridesRef(weekIdx), i, meal);
    const own = (ownOverride && ownOverride.contorni) || [];
    const base = source.contorni || [];
    const extra = own.filter((c, k) => c !== source.principale && !base.includes(c) && own.indexOf(c) === k);
    return { principale: source.principale, contorni: base.concat(extra), ownExtras: extra };
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

// La settimana visualizzata parte dal giorno scelto in Regole generali (di
// default il sabato, giorno della spesa) e finisce il giorno prima: DATA.week1 resta indicizzato Lun(0)...Dom(6) come
// prima (weekOverrides/weekBaseline/mealsDone usano ancora questi indici),
// qui si cambia solo l'ORDINE con cui i 7 giorni vengono mostrati.
const WEEK_DISPLAY_ORDER = [5,6,0,1,2,3,4];
// Il primo giorno è un'impostazione (Regole generali): l'array si riscrive sul
// posto, così chi lo usa vede sempre l'ordine attuale.
function weekStartIdx(){
  const n = parseInt(state.weekStartDay, 10);
  return n >= 0 && n <= 6 ? n : 5;
}
function applyWeekStart(){
  const st = weekStartIdx();
  WEEK_DISPLAY_ORDER.splice(0, 7, ...[0,1,2,3,4,5,6].map(k => (st + k) % 7));
}
function dayNameOf(i){ return DATA.week1[i].giorno; }

// Giorno che apre la settimana "corrente" (quella che contiene oggi): se oggi è
// quel giorno è oggi stesso, altrimenti l'ultima volta che è passato — così la
// settimana 0 include sempre la data di oggi ed è possibile evidenziarla nel Menù.
// (Il nome viene da quando era sempre il sabato.)
function upcomingSaturday(){
  applyWeekStart();
  const today = new Date();
  const day = today.getDay(); // 0=dom, 1=lun ... 6=sab
  const daysSinceSaturday = (day - (weekStartIdx() + 1) % 7 + 7) % 7;
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
        if(linkedSourceMealKey(weekIdx, i, meal)){
          // Avanzo: gli ingredienti sono già quelli della fonte, ma i piatti aggiunti a questo pasto sono nuovi.
          const extras = (effectiveMeal(weekIdx, i, meal).ownExtras || []);
          if(!extras.length) return;
          meals.push({
            weekIdx, i, meal,
            key: mealKey(weekIdx, i, meal),
            giorno: DATA.week1[i].giorno,
            dateLabel: formatShortDate(dates[pos]),
            isPast: new Date(dates[pos]).setHours(0,0,0,0) < new Date().setHours(0,0,0,0),
            principale: extras[0],
            contorni: extras.slice(1),
            dishLabel: extras.join(', ')
          });
          return;
        }
        const mealData = effectiveMeal(weekIdx, i, meal);
        if(!mealData.principale) return;
        meals.push({
          weekIdx, i, meal,
          key: mealKey(weekIdx, i, meal),
          giorno: DATA.week1[i].giorno,
          dateLabel: formatShortDate(dates[pos]),
          isPast: new Date(dates[pos]).setHours(0,0,0,0) < new Date().setHours(0,0,0,0),
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
  const scored = allRecipeMetas().filter(r => isMainDish(r) && dietAllows(r) && !inPlan.has(r.nome) && !(exclude && exclude.has(r.nome))).map(r=>{
    const isLong = r.tempoBucket === 'progetto' || r.tempoBucket === 'lunga';
    const isFreezable = r.freezerNew === 'congelabile';
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
  const exc = state.weekTempoExceptions[`${day}_${meal}`];
  if(exc) return exc;
  const base = state.weekTempoBase || 'progetto';
  // Sabato e domenica c'è più tempo: se non hai messo una regola per quel
  // pasto, ammettono anche le ricette lunghe (altrimenti il generatore pesca
  // sempre tra le poche ricette veloci e le settimane si somigliano tutte).
  if((day === 5 || day === 6) && TEMPO_ORDER.indexOf(base) < TEMPO_ORDER.indexOf('lunga')) return 'lunga';
  return base;
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
const DIET_TYPES = { onnivoro: 'Onnivoro', pescetariano: 'Pescetariano', vegetariano: 'Vegetariano' };
const DIET_TARGETS = {
  onnivoro: {},
  pescetariano: { pesce:[3,4], 'carne-bianca':[0,0], 'carne-rossa':[0,0], salumi:[0,0] },
  vegetariano: { legumi:[3,5], pesce:[0,0], 'carne-bianca':[0,0], 'carne-rossa':[0,0], salumi:[0,0], uova:[2,3], formaggi:[2,3] }
};
function dietTypeNow(){ return DIET_TYPES[state.dietType] ? state.dietType : 'onnivoro'; }
function weekProteinTargets(){
  const out = Object.assign({}, WEEK_PROTEINA_TARGETS, DIET_TARGETS[dietTypeNow()]);
  Object.entries(state.dietTargets || {}).forEach(([k, r]) => { if(out[k] && Array.isArray(r) && r.length === 2) out[k] = [r[0], r[1]]; });
  return out;
}
const DIET_MEAT_WORDS = ['manzo','vitello','bistecca','brasato','ossibuch','macinata','agnello','maiale','arista','lonza','costine','cotenna','spezzatino','hamburger','pollo','tacchino','coniglio','salsiccia','salsicce','prosciutto','speck','pancetta','guanciale','mortadella','salame','wurstel','brodo di carne','bresaola'];
const DIET_FISH_WORDS = ['salmone','merluzzo','tonno','baccalà','orata','branzino','pesce','gamberi','gamberetti','vongole','cozze','polpo','calamari','seppie','acciughe','alici','sgombro'];
const ALLERGEN_PRESETS = {
  'glutine': ['pasta','spaghett','penne','rigaton','fusill','linguin','tagliatell','bucatin','maccheron','farfall','orecchiett','trofie','paccheri','ditalini','lasagn','gnocchi','pane','pangrattato','crostini','cracker','fette biscottate','piadina','tortilla','pizza','farina','semola','couscous','cous cous','orzo','farro','seitan','grano','biscott','sfoglia','brisée','pasta frolla','bulgur','avena'],
  'latte e latticini': ['latte','panna','burro','formaggi','formaggio','mozzarella','ricotta','parmigiano','grana','pecorino','gorgonzola','taleggio','provola','scamorza','fontina','stracchino','burrata','mascarpone','yogurt','besciamella','caciocavallo','philadelphia','feta','halloumi','robiola','caciotta','fiocchi di latte','crescenza','emmental'],
  'uova': ['uova','uovo','tuorl','albume','albumi','maionese','frittata'],
  'frutta a guscio': ['noci','noce','mandorl','nocciol','pistacch','anacardi','pinoli','arachidi','frutta secca','pecan'],
  'pesce': ['salmone','merluzzo','tonno','baccalà','orata','branzino','pesce','acciughe','alici','sgombro','trota','nasello','platessa','sogliola','stoccafisso'],
  'crostacei e molluschi': ['gamberi','gamberetti','scampi','aragosta','granchio','vongole','cozze','polpo','calamari','seppie','ostriche','molluschi','crostacei','frutti di mare']
};
// Una parola scritta a mano ("pomodori", "fragole") si cerca senza l'ultima vocale,
// così trova anche singolare e derivati (pomodoro, pomodorini, fragola).
function avoidStem(w){ w = (w || '').trim().toLowerCase(); return w.length >= 5 ? w.replace(/[aeiou]$/, '') : w; }
function allergenHitsInText(txt){
  txt = (txt || '').toLowerCase();
  return (state.allergies || []).filter(k => (ALLERGEN_PRESETS[k] || [avoidStem(k)]).some(w => w && txt.includes(w)));
}
function recipeAllergens(r){ return (state.allergies || []).length ? allergenHitsInText(recipeIngredientText(r) + ' | ' + (r.nome || '')) : []; }
function allergenBadgeHtml(r){
  const hits = r ? recipeAllergens(r) : [];
  return hits.length ? `<span class="allergen-badge" title="Contiene ${escapeAttr(hits.join(', '))}">⚠ ${escapeHtml(hits.join(', '))}</span>` : '';
}
function dietAllows(r){
  const txt = recipeIngredientText(r) + ' | ' + (r.nome || '').toLowerCase();
  const diet = dietTypeNow();
  if(diet !== 'onnivoro' && has(txt, DIET_MEAT_WORDS)) return false;
  if(diet === 'vegetariano' && has(txt, DIET_FISH_WORDS)) return false;
  if(allergenHitsInText(txt).length) return false;
  return !(state.dietExclude || []).some(w => w && txt.includes(avoidStem(w)));
}
// Toglie le ricette che non vanno bene. Mai un piatto vietato per riempire il
// menu: se non bastano, si ripetono quelle che ci sono (e vanno aggiunte ricette).
function dietFilter(list){ return list.filter(dietAllows); }
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
// Giorni in cui il pranzo è l'avanzo della cena di ieri (Regole di generazione).
// Il primo giorno della settimana (di default il sabato): la sua "cena di ieri" è
// l'ultima della settimana prima. Nella settimana in corso quella non c'è più
// (la settimana finita si scarta), quindi il suo pranzo si cucina sempre; dalle
// settimane dopo c'è ancora, e il pranzo può esserne l'avanzo.
function firstDayLeftoverSource(weekIdx){
  if(!(weekIdx >= 1)) return null;
  const last = WEEK_DISPLAY_ORDER[WEEK_DISPLAY_ORDER.length - 1];
  return effectiveMeal(weekIdx - 1, last, 'cena').principale ? mealKey(weekIdx - 1, last, 'cena') : null;
}
function leftoverEligible(weekIdx){
  const first = WEEK_DISPLAY_ORDER[0];
  return [0,1,2,3,4,5,6].filter(d => d !== first || !!firstDayLeftoverSource(weekIdx));
}
function leftoverPortionsN(){
  const n = parseInt(state.weekLeftoverPortions, 10);
  return n >= 0 && n <= 4 ? n : 1;
}
// I giorni scelti (una scelta sola per tutte le settimane): in una settimana
// valgono solo quelli che hanno davvero una cena di ieri.
function leftoverDaysRaw(){
  const a = state.weekLeftoverDays;
  return Array.isArray(a) ? a.slice() : [0,1,2,3,4,5,6];
}
function leftoverLunchDays(weekIdx){
  if(!state.leftoverLunchOn) return [];
  const ok = leftoverEligible(weekIdx);
  return leftoverDaysRaw().filter(d => ok.includes(d));
}
function weekPlanSlots(weekIdx){
  const slots = [];
  for(let day = 0; day < 7; day++){
    if(!leftoverLunchDays(weekIdx).includes(day)) slots.push({ day, meal:'pranzo' });
    slots.push({ day, meal:'cena' });
  }
  return slots; // nell'ordine in cui si mangia (pranzi lun-gio a parte: sono avanzi)
}
// Sequenza dei 14 pasti mangiati: indice nello slots + se è un avanzo.
function weekEatenSequence(slots, weekIdx){
  const idx = (day, meal) => slots.findIndex(s => s.day === day && s.meal === meal);
  const seq = [];
  for(let day = 0; day < 7; day++){
    if(leftoverLunchDays(weekIdx).includes(day)){
      // L'avanzo del primo giorno viene dalla settimana prima: qui non conta.
      if(day !== WEEK_DISPLAY_ORDER[0]) seq.push({ slot: idx((day + 6) % 7, 'cena'), leftover: true });
    }
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
  Object.entries(weekProteinTargets()).forEach(([k, range]) => { score += 10 * targetDistance(prot[k] || 0, range); });
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
    if(pantryStatusFor(it.ingrediente, it.qta, it.spec) === 'manca') missing.push(it.ingrediente);
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
  let pool = dietFilter(allRecipeMetas().filter(isMainDish).filter(inSeason));
  if(pool.length < 20) pool = dietFilter(allRecipeMetas().filter(isMainDish)); // fallback di sicurezza, non dovrebbe servire
  const contorniPool = dietFilter(allRecipeMetas().filter(r => r.tipologia === 'contorno' && inSeason(r) && recipeGivesVeg(r)));
  const rand = n => Math.floor(Math.random() * n);
  const shuffle = arr => { const a = arr.slice(); for(let i = a.length - 1; i > 0; i--){ const j = rand(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const withinCap = (list, day, meal)=>{
    const capIdx = TEMPO_ORDER.indexOf(getTempoCap(day, meal));
    if(capIdx >= TEMPO_ORDER.length - 1) return list;
    const allowed = TEMPO_ORDER.slice(0, capIdx + 1);
    const limited = list.filter(r => allowed.includes(r.tempoBucket));
    return limited.length ? limited : list; // rispetta il tetto se possibile
  };

  const slots = weekPlanSlots(weekIdx);
  const seq = weekEatenSequence(slots, weekIdx);
  const pantryCtx = buildPantryPlanContext(weekIdx, slots);
  const fixedAt = slots.map(s => fixed[`${s.day}_${s.meal}`] || null);
  const fixedNames = new Set(fixedAt.filter(Boolean).map(r => r.nome));
  const pantryOnly = !!state.genPantryOnly;
  if(pantryOnly){
    // Con quello che ho, la stagione conta meno: si parte da tutte le ricette.
    const need = fixedAt.filter(f => !f).length;
    pool = pantryOnlyPool(dietFilter(allRecipeMetas().filter(isMainDish)).filter(r => !fixedNames.has(r.nome)), need, pantryCtx.expiring);
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
// Collegare un pasto come "avanzo di" aggiunge una porzione al pasto di
// partenza (si cucina per chi mangia ora + chi mangia l'avanzo); scollegarlo la toglie.
function bumpSourcePortions(sourceKey, delta){
  if(!sourceKey || !/^\d+_\d+_(pranzo|cena)$/.test(sourceKey)) return;
  const { weekIdx, i, meal } = parseMealKey(sourceKey);
  const m = effectiveMeal(weekIdx, i, meal);
  if(!m || !m.principale) return;
  state.dayPortions[sourceKey] = Math.max(1, mealPortions(sourceKey, m.principale) + delta);
}
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
const COURSE_ORDER = ['antipasto','ripieno','primo','unico','secondo','contorno','dolce'];
function dishCourse(name){
  const r = getRecipeMeta(name);
  return (r && r.tipologia) || '';
}
function courseLabel(tipo){ return tipo === 'unico' ? 'Piatto unico' : (TIPO_LABEL[tipo] || 'Piatto'); }
// role come in dayIngKey/buildShopFlat: 'p' il principale, 'c0'/'c1'... gli altri.
// Blocco per piatto: state.mealLocked[mk] è un elenco di nomi di piatti
// (principale/contorni) che la rigenerazione non tocca. `true` è il vecchio
// blocco dell'intero pasto: vale per tutti i piatti.
function dishLockedHas(mk, name){
  const v = state.mealLocked[mk];
  return v === true || (Array.isArray(v) && v.includes(name));
}
function toggleDishLock(mk, name){
  const { weekIdx, i, meal } = parseMealKey(mk);
  const names = mealDishes(weekIdx, i, meal).map(d => d.name);
  const v = state.mealLocked[mk];
  let cur = v === true ? names.slice() : (Array.isArray(v) ? v.filter(n => names.includes(n)) : []);
  cur = cur.includes(name) ? cur.filter(n => n !== name) : cur.concat(name);
  if(cur.length) state.mealLocked[mk] = cur; else delete state.mealLocked[mk];
}
function mealDishes(weekIdx, i, meal){
  const m = effectiveMeal(weekIdx, i, meal);
  if(!m.principale) return [];
  const list = [{ name: m.principale, role: 'p' }].concat((m.contorni || []).map((c, ci) => ({ name: c, role: `c${ci}` })));
  const rank = t => { const k = COURSE_ORDER.indexOf(t); return k < 0 ? COURSE_ORDER.length : k; };
  list.forEach((d, idx) => { d.tipo = dishCourse(d.name); d.idx = idx; if((m.ownExtras || []).includes(d.name)) d.own = true; });
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
// Ricette che vogliono un ripieno (campo "ripieni" della ricetta, es. l'impasto
// delle empanadas): il pasto che le contiene deve avere almeno uno dei loro
// ripieni. Con una sola scelta si aggiunge da sé; con più scelte si sceglie
// (vedi dishPicker.require); se manca, il pasto lo dice.
function recipeRipieni(name){
  const r = getRecipeMeta(name);
  return r && Array.isArray(r.ripieni) ? r.ripieni.filter(n => getRecipeMeta(n)) : [];
}
function mealMissingRipieno(weekIdx, i, meal){
  const names = mealDishes(weekIdx, i, meal).map(d => d.name);
  return names.map(n => ({ name: n, options: recipeRipieni(n) })).filter(x => x.options.length && !x.options.some(o => names.includes(o)));
}
function autoFillRipieni(weekIdx, i, meal){
  for(let g = 0; g < 6; g++){
    const one = mealMissingRipieno(weekIdx, i, meal).find(x => x.options.length === 1);
    if(!one) break;
    addMealDishRaw(weekIdx, i, meal, one.options[0]);
  }
  return mealMissingRipieno(weekIdx, i, meal);
}
// Un ripieno che nessun altro piatto del pasto richiede più (tolto l'impasto) se ne va con lui.
function dropOrphanRipieni(weekIdx, i, meal, oldName){
  recipeRipieni(oldName).forEach(o => {
    const names = mealDishes(weekIdx, i, meal).map(d => d.name);
    if(!names.includes(o)) return;
    if(names.some(n => n !== o && recipeRipieni(n).includes(o))) return;
    removeMealDishRaw(weekIdx, i, meal, o, true);
  });
}
// Il ripieno che regge un impasto del pasto non si toglie da solo.
function lastRipienoOf(weekIdx, i, meal, name){
  const names = mealDishes(weekIdx, i, meal).map(d => d.name);
  return names.find(n => n !== name && recipeRipieni(n).includes(name) && !recipeRipieni(n).some(o => o !== name && names.includes(o))) || null;
}
function addMealDish(weekIdx, i, meal, name){
  addMealDishRaw(weekIdx, i, meal, name);
  return autoFillRipieni(weekIdx, i, meal);
}
function addMealDishRaw(weekIdx, i, meal, name){
  const m = effectiveMeal(weekIdx, i, meal);
  if(!m.principale){ writeMealDishes(weekIdx, i, meal, name, []); return; }
  if(m.principale === name || m.contorni.includes(name)) return;
  if(linkedSourceMealKey(weekIdx, i, meal)){ setMealContorni(weekIdx, i, meal, (m.ownExtras || []).concat(name)); return; }
  setMealContorni(weekIdx, i, meal, m.contorni.concat(name));
}
// Sostituisce un solo piatto, lasciando gli altri come sono.
function replaceMealDish(weekIdx, i, meal, oldName, newName){
  replaceMealDishRaw(weekIdx, i, meal, oldName, newName);
  dropOrphanRipieni(weekIdx, i, meal, oldName);
  return autoFillRipieni(weekIdx, i, meal);
}
function replaceMealDishRaw(weekIdx, i, meal, oldName, newName){
  const m = effectiveMeal(weekIdx, i, meal);
  if(oldName === newName) return;
  if(m.principale === oldName && linkedSourceMealKey(weekIdx, i, meal)) return; // l'avanzo segue la sua fonte
  if(linkedSourceMealKey(weekIdx, i, meal)){
    // Solo i piatti aggiunti a questo pasto si sostituiscono; gli avanzi seguono la fonte.
    if(!(m.ownExtras || []).includes(oldName)) return;
    forgetDish(weekIdx, i, meal, oldName);
    const next = m.ownExtras.map(c => c === oldName ? newName : c);
    setMealContorni(weekIdx, i, meal, next.filter((c, idx) => next.indexOf(c) === idx));
    return;
  }
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
  const holder = lastRipienoOf(weekIdx, i, meal, name);
  if(holder){ showNotice(`Serve almeno un ripieno per «${holder}»: per toglierlo, togli prima l'impasto.`); return; }
  const snap0 = snapshotMealDishes(weekIdx, i, meal);
  const hadOrphans = recipeRipieni(name).some(o => mealDishes(weekIdx, i, meal).some(d => d.name === o));
  removeMealDishRaw(weekIdx, i, meal, name, hadOrphans);
  if(!hadOrphans) return;
  dropOrphanRipieni(weekIdx, i, meal, name);
  persist(); render();
  showUndoToast('Piatto tolto', ()=>{ restoreMealDishes(weekIdx, i, meal, snap0); persist(); render(); });
}
function removeMealDishRaw(weekIdx, i, meal, name, quiet){
  const key = mealKey(weekIdx, i, meal);
  const m = effectiveMeal(weekIdx, i, meal);
  if(m.principale === name){
    if(linkedSourceMealKey(weekIdx, i, meal)) return;
    if(!m.contorni.length){ performClearMeal(key); return; }
    const snap = snapshotMealDishes(weekIdx, i, meal);
    forgetDish(weekIdx, i, meal, name);
    writeMealDishes(weekIdx, i, meal, m.contorni[0], m.contorni.slice(1));
    if(quiet) return;
    persist(); render();
    showUndoToast('Piatto tolto', ()=>{ restoreMealDishes(weekIdx, i, meal, snap); persist(); render(); });
    return;
  }
  const linked = !!linkedSourceMealKey(weekIdx, i, meal);
  if(linked && !(m.ownExtras || []).includes(name)) return; // un avanzo segue la sua fonte
  const snap = snapshotMealDishes(weekIdx, i, meal);
  forgetDish(weekIdx, i, meal, name);
  setMealContorni(weekIdx, i, meal, (linked ? m.ownExtras : m.contorni).filter(c => c !== name));
  if(quiet) return;
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
// Ciclo nessuno -> persone della famiglia -> nessuno, un tap alla volta, senza modali.
function toggleCook(dayKey){
  const next = nextMemberId(state.cooks[dayKey]);
  if(next) state.cooks[dayKey] = next; else delete state.cooks[dayKey];
  persist(); render();
}
function toggleShopAssignee(store){
  const next = nextMemberId(state.shopAssignees[store]);
  if(next) state.shopAssignees[store] = next; else delete state.shopAssignees[store];
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
// Porzioni di partenza dei pasti (Regole di generazione), da 1 a 12.
function defaultPortions(){
  const n = parseInt(state.weekPortionsBase, 10);
  return n >= 1 && n <= 12 ? n : 2;
}
function generateWeek(weekIdx){
  // Settimana extra nuova (non ancora esistente): qualunque stato rimasto con
  // il suo numero (blocchi, avanzi, porzioni... di una settimana eliminata in
  // passato, quando non venivano ripuliti) non le appartiene — si cancella,
  // altrimenti un vecchio blocco la lasciava con giorni vuoti.
  if(!allRecipeMetas().some(r => isMainDish(r) && dietAllows(r))){
    showUndoToast('Nessuna ricetta compatibile con le Regole: togli qualche ingrediente da evitare o aggiungi ricette', ()=>{});
    return;
  }
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
      const lv = state.mealLocked[lkey];
      const curData = effectiveMeal(weekIdx, li, lm);
      const curNames = [curData.principale].concat(curData.contorni || []).filter(Boolean);
      const lockedNames = lv === true ? curNames : (Array.isArray(lv) ? lv.filter(n => curNames.includes(n)) : []);
      if(lv && !lockedNames.length && !past) delete state.mealLocked[lkey]; // blocco su piatti spariti
      if(lockedNames.length || past){
        lockedMeals.push({ i: li, meal: lm, past, lockedNames, whole: lv === true, data: curData, link: linkedSourceMealKey(weekIdx, li, lm),
          portions: state.dayPortions[lkey], done: !!(state.mealsDone[li] && state.mealsDone[li][lm]) && weekIdx === 0 });
      }
    });
  }
  // Un avanzo bloccato è lo stesso piatto della cena da cui viene: si blocca
  // anche quella (se è di questa settimana), altrimenti cambierebbe sotto.
  lockedMeals.slice().forEach(lm=>{
    if(lm.past || !lm.link || !lm.lockedNames.includes(lm.data.principale)) return;
    const m = /^(\d+)_(\d+)_(pranzo|cena)$/.exec(lm.link);
    if(!m || parseInt(m[1], 10) !== weekIdx) return;
    const si = parseInt(m[2], 10), sm = m[3];
    if(lockedMeals.some(x => x.i === si && x.meal === sm)) return;
    const sdata = effectiveMeal(weekIdx, si, sm);
    if(!sdata.principale) return;
    lockedMeals.push({ i: si, meal: sm, past: false, lockedNames: [sdata.principale], whole: false, data: sdata, link: linkedSourceMealKey(weekIdx, si, sm),
      portions: state.dayPortions[`${weekIdx}_${si}_${sm}`], done: !!(state.mealsDone[si] && state.mealsDone[si][sm]) && weekIdx === 0 });
  });
  // I pasti bloccati restano com'erano, ma pesano sull'equilibrio della settimana.
  const fixed = {};
  lockedMeals.forEach(({i, meal, data, link, past, lockedNames})=>{
    const meta = !link && data.principale && (past || lockedNames.includes(data.principale)) ? getRecipeMeta(data.principale) : null;
    if(meta && (meal === 'cena' || !leftoverLunchDays(weekIdx).includes(i))) fixed[`${i}_${meal}`] = meta;
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
  leftoverLunchDays(weekIdx).forEach(i => {
    if(i === WEEK_DISPLAY_ORDER[0]){
      // Primo giorno: avanzo dell'ultima cena della settimana prima (che deve
      // coprire anche questo pranzo: porzioni in più, una volta sola).
      const src = firstDayLeftoverSource(weekIdx);
      if(!src) return;
      state.dayLinks[`${weekIdx}_${i}_pranzo`] = src;
      const want = defaultPortions() + leftoverPortionsN();
      const { weekIdx: sw, i: si, meal: sm } = parseMealKey(src);
      const m = effectiveMeal(sw, si, sm);
      if(m && m.principale && mealPortions(src, m.principale) < want) state.dayPortions[src] = want;
      return;
    }
    const sourceDay = (i - 1 + 7) % 7;
    state.dayLinks[`${weekIdx}_${i}_pranzo`] = `${weekIdx}_${sourceDay}_cena`;
  });
  // Porzioni di base: 2, tranne le cene "apripista" di Dom/Lun/Mar/Mer (indici
  // 6,0,1,2 — quelle da cui Lun-Gio pranzo prende l'avanzo), che partono a 3
  // per coprire anche il pranzo del giorno dopo.
  const sourceDays = leftoverLunchDays(weekIdx).filter(d => d !== WEEK_DISPLAY_ORDER[0]).map(d => (d + 6) % 7);
  for(let i = 0; i < 7; i++){
    const basePor = defaultPortions();
    state.dayPortions[`${weekIdx}_${i}_cena`] = sourceDays.includes(i) ? basePor + leftoverPortionsN() : basePor;
    if(!leftoverLunchDays(weekIdx).includes(i)) state.dayPortions[`${weekIdx}_${i}_pranzo`] = basePor;
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
    lockedMeals.forEach(({i, meal, past, data, link, portions, done, lockedNames, whole})=>{
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
      const gen = targetBaseline[i][meal] || { principale: '', contorni: [] };
      const lockP = lockedNames.includes(data.principale);
      const lockedC = (data.contorni || []).filter(c => lockedNames.includes(c) && getRecipeMeta(c));
      let validContorni;
      if(whole) validContorni = (data.contorni || []).filter(c => getRecipeMeta(c));
      else validContorni = lockedC.concat((gen.contorni || []).filter(c => !lockedC.includes(c) && c !== (lockP ? data.principale : gen.principale))).slice(0, Math.max((gen.contorni || []).length, lockedC.length));
      targetBaseline[i][meal] = { principale: lockP ? data.principale : gen.principale, contorni: validContorni };
      if(lockP){ if(link) state.dayLinks[lkey] = link; else delete state.dayLinks[lkey]; }
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
// Mette nelle cene della settimana le porzioni che hai già in freezer (al più
// due, le più vecchie per prime): "Dal freezer", niente ingredienti in Spesa.
function placeFreezerMeals(weekIdx, max){
  const plannedNames = new Set(allPlannedMeals().map(m => m.name));
  const frozen = freezerMeals().filter(it => !plannedNames.has(it.nome)).sort((a, b) => String(a.frozenOn || '9999').localeCompare(String(b.frozenOn || '9999')));
  const placed = [];
  const todayIso = isoLocalDate(new Date());
  for(const it of frozen){
    if(placed.length >= (max || 2)) break;
    const slot = WEEK_DISPLAY_ORDER.map(i => ({ i, meal: 'cena' })).find(({ i, meal }) => {
      const mk = mealKey(weekIdx, i, meal);
      if(state.mealLocked[mk] || isMealPast(weekIdx, i, meal)) return false;
      if(Object.values(state.dayLinks).includes(mk)) return false; // da questa cena avanza un pranzo
      if(placed.some(p => p.mk === mk)) return false;
      return !!effectiveMeal(weekIdx, i, meal).principale;
    });
    if(!slot) break;
    const mk = mealKey(weekIdx, slot.i, slot.meal);
    const m = effectiveMeal(weekIdx, slot.i, slot.meal);
    writeMealDishes(weekIdx, slot.i, slot.meal, it.nome, (m.contorni || []).filter(c => c !== it.nome));
    setFreezerDish(mk, it.nome, true);
    placed.push({ mk, name: it.nome });
  }
  return placed;
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
// Icone SVG delle impostazioni e dei menù ⋯ (stile unico, tratto 2). La
// rotellina è la stessa del titolo settimana nel Menù.
const UI_ICONS = {
  'palette': '<path d="M12 21a9 9 0 0 1 0-18c4.97 0 9 3.582 9 8c0 1.06-.474 2.078-1.318 2.828c-.844.75-1.989 1.172-3.182 1.172h-2.5a2 2 0 0 0-1 3.75a1.3 1.3 0 0 1-1 2.25"/><path d="M8.5 10.5a1 1 0 1 0 2 0a1 1 0 1 0-2 0m3-3a1 1 0 1 0 2 0a1 1 0 1 0-2 0m3 3a1 1 0 1 0 2 0a1 1 0 1 0-2 0"/>',
  'plus': '<path d="M12 5v14M5 12h14"/>',
  'barcode': '<path d="M4 7V6a2 2 0 0 1 2-2h2M4 17v1a2 2 0 0 0 2 2h2m8-16h2a2 2 0 0 1 2 2v1m-4 13h2a2 2 0 0 0 2-2v-1M8 8v8m3-8v8m3-8v8m3-8v8"/>',
  'lock': '<path d="M5 13a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z"/><path d="M11 16a1 1 0 1 0 2 0a1 1 0 1 0-2 0m-3-5V7a4 4 0 1 1 8 0v4"/>',
  'download': '<path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/><path d="m7 11l5 5l5-5M12 4v12"/>',
  'upload': '<path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/><path d="m7 9l5-5l5 5M12 4v12"/>',
  'database': '<path d="M4 6a8 3 0 1 0 16 0a8 3 0 1 0-16 0"/><path d="M4 6v6a8 3 0 0 0 16 0V6"/><path d="M4 12v6a8 3 0 0 0 16 0v-6"/>',
  'tag': '<path d="M7.5 7.5a.5.5 0 1 0 1 0a.5.5 0 1 0-1 0"/><path d="M3 6v5.172a2 2 0 0 0 .586 1.414l7.71 7.71a2.41 2.41 0 0 0 3.408 0l5.592-5.592a2.41 2.41 0 0 0 0-3.408l-7.71-7.71A2 2 0 0 0 11.172 3H6a3 3 0 0 0-3 3"/>',
  'sort': '<path d="m3 9l4-4l4 4M7 5v14m14-4l-4 4l-4-4m4 4V5"/>',
  'refresh': '<path d="M20 11A8.1 8.1 0 0 0 4.5 9M4 5v4h4m-4 4a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"/>',
  'clipboard-list': '<path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><path d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2m0 7h.01M13 12h2M9 16h.01M13 16h2"/>',
  'clipboard': '<path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><path d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2"/>',
  'list-details': '<path d="M13 5h8m-8 4h5m-5 6h8m-8 4h5"/><path d="M3 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1zm0 10a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/>',
  'category': '<path d="M4 4h6v6H4zm0 10h6v6H4zm10-10h6v6h-6z"/><path d="M14 17a3 3 0 1 0 6 0a3 3 0 1 0-6 0"/>',
  'power': '<path d="M7 6a7.75 7.75 0 1 0 10 0M12 4v8"/>',
  'camera': '<path d="M5 7h1a2 2 0 0 0 2-2a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2"/><path d="M9 13a3 3 0 1 0 6 0a3 3 0 1 0-6 0"/>',
  'photo': '<path d="M15 8h.01"/><path d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z"/><path d="m3 16l5-5c.928-.893 2.072-.893 3 0l5 5"/><path d="m14 14l1-1c.928-.893 2.072-.893 3 0l3 3"/>',
  'link': '<path d="m9 15l6-6"/><path d="m11 6l.463-.536a5 5 0 0 1 7.071 7.072L18 13m-5 5l-.397.534a5.07 5.07 0 0 1-7.127 0a4.97 4.97 0 0 1 0-7.071L6 11"/>',
  'calendar': '<path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm12-4v4M8 3v4m-4 4h16"/>',
  'wand': '<path d="m6 21l15-15l-3-3L3 18z"/><path d="m15 6l3 3M9 3a2 2 0 0 0 2 2a2 2 0 0 0-2 2a2 2 0 0 0-2-2a2 2 0 0 0 2-2m10 11a2 2 0 0 0 2 2a2 2 0 0 0-2 2a2 2 0 0 0-2-2a2 2 0 0 0 2-2"/>',
  'swap': '<path d="M21 7H3m15-3l3 3l-3 3M3 17h18M6 14l-3 3l3 3"/>',
  'pencil': '<path d="M4 20h4L18.5 9.5a2.828 2.828 0 1 0-4-4L4 16zm9.5-13.5l4 4"/>',
  'heart': '<path d="M19.5 12.572L12 20l-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.572"/>',
  'egg': '<path d="M12 3C8.5 3 5.5 9 5.5 13.5a6.5 6.5 0 0 0 13 0C18.5 9 15.5 3 12 3"/>',
  'wheat': '<path d="M12 21V9m0 0c0-2.5 1.2-4 3.5-5c0 2.5-1.2 4-3.5 5m0 0c0-2.5-1.2-4-3.5-5c0 2.5 1.2 4 3.5 5m0 6c0-2.5 1.2-4 3.5-5c0 2.5-1.2 4-3.5 5m0 0c0-2.5-1.2-4-3.5-5c0 2.5 1.2 4 3.5 5"/>',
  'user': '<path d="M8 7a4 4 0 1 0 8 0a4 4 0 1 0-8 0M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>',
  'cards': '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 10h19M6.5 15h4"/>'};
const UI_GEAR_SVG = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="ui-ico" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32"><path fill="currentColor" d="M27 16.76v-1.53l1.92-1.68A2 2 0 0 0 29.3 11l-2.36-4a2 2 0 0 0-1.73-1a2 2 0 0 0-.64.1l-2.43.82a11 11 0 0 0-1.31-.75l-.51-2.52a2 2 0 0 0-2-1.61h-4.68a2 2 0 0 0-2 1.61l-.51 2.52a11.5 11.5 0 0 0-1.32.75l-2.38-.86A2 2 0 0 0 6.79 6a2 2 0 0 0-1.73 1L2.7 11a2 2 0 0 0 .41 2.51L5 15.24v1.53l-1.89 1.68A2 2 0 0 0 2.7 21l2.36 4a2 2 0 0 0 1.73 1a2 2 0 0 0 .64-.1l2.43-.82a11 11 0 0 0 1.31.75l.51 2.52a2 2 0 0 0 2 1.61h4.72a2 2 0 0 0 2-1.61l.51-2.52a11.5 11.5 0 0 0 1.32-.75l2.42.82a2 2 0 0 0 .64.1a2 2 0 0 0 1.73-1l2.28-4a2 2 0 0 0-.41-2.51ZM25.21 24l-3.43-1.16a8.9 8.9 0 0 1-2.71 1.57L18.36 28h-4.72l-.71-3.55a9.4 9.4 0 0 1-2.7-1.57L6.79 24l-2.36-4l2.72-2.4a8.9 8.9 0 0 1 0-3.13L4.43 12l2.36-4l3.43 1.16a8.9 8.9 0 0 1 2.71-1.57L13.64 4h4.72l.71 3.55a9.4 9.4 0 0 1 2.7 1.57L25.21 8l2.36 4l-2.72 2.4a8.9 8.9 0 0 1 0 3.13L27.57 20Z"></path><path fill="currentColor" d="M16 22a6 6 0 1 1 6-6a5.94 5.94 0 0 1-6 6m0-10a3.91 3.91 0 0 0-4 4a3.91 3.91 0 0 0 4 4a3.91 3.91 0 0 0 4-4a3.91 3.91 0 0 0-4-4"></path></svg>';
function uiIcon(name){
  if(name === 'gear') return UI_GEAR_SVG;
  return `<svg class="ui-ico" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${UI_ICONS[name] || ''}</svg>`;
}
const SEARCH_ICON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="10" cy="10" r="7"></circle><path d="m21 21-6-6"></path></g></svg>';

// Modale "Novità": compare una volta sola per persona al prossimo caricamento
// (su tutti i suoi dispositivi) quando `version` è diversa da quella che ha
// già chiuso (state.whatsNewSeenBy), poi resta chiusa finché non si cambia di nuovo
// `version`. NON è automatica a ogni deploy — resta `null` di default, e va
// valorizzata a mano solo quando si vuole davvero annunciare qualcosa.
// Solo le novità dell'ultimo aggiornamento (richiesta di Mara): a ogni
// aggiornamento si sostituiscono le voci, non si aggiungono in cima.
const WHATS_NEW = {
  version: '2027-02-09',
  title: 'Novità',
  items: [
    'Menù: nella scheda del pasto compaiono le note dei piatti ("Da ricordare") e il promemoria di cucinare una porzione in più di pasta o riso quando il giorno dopo c\'è una ricetta che lo riusa (es. Frittata di pasta).',
    'Nuova ricetta dall\'etichetta del pollo: Pollo alla ligure (pollo, patate, olive taggiasche e vermouth, tutto in teglia). Le porzioni sono 4: l\'etichetta non le indicava.'
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
  form.querySelectorAll('input').forEach(i=>{ if(i.type === 'file') return; if(i.type === 'checkbox'){ if(i.checked) i.setAttribute('checked', ''); else i.removeAttribute('checked'); return; } i.setAttribute('value', i.value); });
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
// La data del giorno resta appiccicata sotto topbar + titolo settimana: la loro
// altezza cambia (testo grande, a capo), quindi la misuriamo invece di fissarla.
function syncMenuStickyTop(){
  const bar = document.querySelector('.topbar'), title = document.querySelector('.week-title.is-menu');
  if(!bar || !title) return;
  document.documentElement.style.setProperty('--menu-sticky-top', (bar.offsetHeight + title.offsetHeight) + 'px');
}
window.addEventListener('resize', syncMenuStickyTop);
function render(){
  applyWeekStart();
  requestAnimationFrame(syncMenuStickyTop);
  applyCustomDepts();
  if(personalSynced || !window.cookpopSync) rolloverWeeksIfNeeded();
  if(personalSynced || !window.cookpopSync) applyRecurringConsumption();
  if(personalSynced || !window.cookpopSync) reconcileAllLots();
  if(personalSynced || !window.cookpopSync) reconcileFreezer();
  if((personalSynced || !window.cookpopSync) && clearFutureMealsDone()) persist();
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
  panel.innerHTML = html + renderNewRecipePage() + renderBackupPage() + renderAppearancePage() + renderGenGeneralPage() + renderMembersPage() + renderOnboardingPage() + renderProfilePage() + renderAislesPage() + renderExpiryEstimatesPage() + renderRecipeImportPage() + renderCookbookModals() + renderCardsPages() + renderCookModePage() + renderAddSheet() + renderUndoToast() + renderWhatsNewModal();
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
  // Le voci di Impostazioni che aprono pagine di Dispensa/Menù cambiano la
  // scheda sotto: chiuse le Impostazioni si torna a quella di prima.
  if(state.settingsReturnTab){ state.tab = state.settingsReturnTab; state.settingsReturnTab = null; }
}
function isTopbarMenuOpen(){
  const el = document.getElementById('topbar-menu-backdrop');
  return !!(el && el.classList.contains('open'));
}
function closeTopbarMenu(){
  const el = document.getElementById('topbar-menu-backdrop');
  if(el) el.classList.remove('open');
}
// Il fumetto della quantità resta tutto in vista anche quando la tastiera si
// apre: centrato subito e di nuovo quando la tastiera ha finito di salire.
function keepQtyPopVisible(){
  const go = ()=>{ const el = document.querySelector('.qty-pop'); if(el) el.scrollIntoView({ block: 'center', behavior: 'auto' }); };
  go(); setTimeout(go, 350);
}
const MODAL_CHECKS = [
  [()=> !!state.shopQtyEditingKey, ()=>{ state.shopQtyEditingKey = null; }],
  [()=> !!state.pantryEditingKey, ()=>{ state.pantryEditingKey = null; }],
  [()=> !!state.menuPick, ()=>{ state.menuPick = null; }],
  [()=> !!state.cookMode, ()=>{ state.cookMode = null; }],
  [()=> !!state.cookbookNameDraft, ()=>{ state.cookbookNameDraft = null; }],
  [()=> !!state.recipeImport, ()=>{ state.recipeImport = null; }],
  [()=> !!state.albumForRecipe, ()=>{ state.albumForRecipe = null; }],
  [()=> !!state.addSheet, ()=>{ state.addSheet = null; }],
  [()=> !!state.moveModal, ()=>{ closeMoveModal(); }],
  [()=> expiryConfirmKeys().length > 0, ()=>{ closeExpiryConfirm(); }],
  [()=> !!document.querySelector('.edit-ing-backdrop'), ()=>{ closeEditIngSheet(true); }],
  [()=> !!state.recipeEditName, ()=>{ state.recipeEditName = null; }],
  [()=> state.doneModalLeftovers.some(r => r.pickerOpen), ()=>{ state.doneModalLeftovers.forEach(r => { r.pickerOpen = false; }); }],
  [()=> state.doneModalLeftovers.some(r => r.catPickerOpen), ()=>{ state.doneModalLeftovers.forEach(r => { r.catPickerOpen = false; }); }],
  [()=> state.doneModalDay !== null, ()=>{ closeDoneSheet(); }],
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
  [()=> !!state.backupOpen, ()=>{ state.backupOpen = false; }],
  [()=> !!state.genGeneralSheet, ()=>{ state.genGeneralSheet = null; }],
  [()=> !!state.genTargetEdit, ()=>{ state.genTargetEdit = null; }],
  [()=> !!state.genGeneralPage, ()=>{ state.genGeneralPage = null; state.genTargetEdit = null; }],
  [()=> !!state.genGeneralOpen || !!state.genFoodOpen, ()=>{ state.genGeneralOpen = false; state.genFoodOpen = false; state.genGeneralPage = null; state.genGeneralSheet = null; }],
  [()=> !!state.membersOpen, ()=>{ state.membersOpen = false; }],
  [()=> !!state.appearanceOpen, ()=>{ state.appearanceOpen = false; }],
  [()=> !!state.gradPicker, ()=>{ state.gradPicker = null; }],
  [()=> !!state.profileOpen, ()=>{ state.profileOpen = false; }],
  [()=> !!state.aisleOrderOpen, ()=>{ state.aisleOrderOpen = false; }],
  [()=> state.cardsOpen === 'form', ()=>{ closeCardForm(); }],
  [()=> !!state.cardsOpen, ()=>{ state.cardsOpen = null; state.cardsListUnder = false; state.cardDraft = null; }],
  [()=> !!state.expiryEstOpen, ()=>{ state.expiryEstOpen = false; }],
  [()=> !!state.scannerOpen, ()=>{ closeBarcodeScanner(); }],
  [()=> !!state.recurringOpen && !!state.recurringEditId, ()=>{ state.recurringEditId = null; state.recurringDraft = null; }],
  [()=> !!state.recurringOpen, ()=>{ state.recurringOpen = false; }],
  [()=> !!state.inventoryOpen, ()=>{ state.inventoryOpen = false; }],
  [()=> !!state.ingredientManagerOpen, ()=>{ state.ingredientManagerOpen = false; }],
  [()=> !!state.addIngModalOpen, ()=>{ state.addIngModalOpen = false; state.addIngDraft = null; }],
  [()=> !!state.newRecipeModalOpen, ()=>{ state.newRecipeModalOpen = false; }],
  [()=> !!state.filtersOpen, ()=>{ state.filtersOpen = false; }],
  [()=> !!state.swapOpenDay, ()=>{ state.swapOpenDay = null; }],
  [()=> !!state.linkPickerOpenDay, ()=>{ state.linkPickerOpenDay = null; }],
  [()=> !!state.avanzoDiPickerOpenDay, ()=>{ state.avanzoDiPickerOpenDay = null; }],
  [()=> !!state.dishPicker, ()=>{ closeDishPicker(); }],
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
const DIALOG_LAYER_SELECTOR = '.filters-modal-backdrop, .meal-detail-screen, .sheet-page, .card-view, .move-backdrop, #settings-backdrop.open, #topbar-menu-backdrop.open';
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
  if(layer.classList.contains('move-backdrop')) return layer.querySelector('.move-sheet') || layer;
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
      // Le schermate di accesso (login, famiglia, benvenuto) non si rendono mai
      // inerti: dopo "Esci" da una pagina aperta restavano senza poter scrivere.
      if(sib === node || /^(SCRIPT|STYLE|LINK)$/.test(sib.tagName) || sib.classList.contains('undo-toast') || /^(login-gate|family-gate|welcome-gate)$/.test(sib.id)) return;
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
let pushAfterPop = false;
let suppressTimer = null;
function reconcileModalHistory(){
  syncDialogs();
  const openCount = countOpenModals();
  if(openCount > modalHistoryDepth){
    // Un "indietro" per una finestra appena chiusa è ancora in corso (arriva
    // dopo qualche centinaio di ms): aggiungere subito la nuova entry la farebbe
    // saltare e la finestra appena riaperta si richiuderebbe. Si aspetta il
    // popstate e poi si registra.
    if(suppressPopstateNav){ pushAfterPop = true; return; }
    for(let i = modalHistoryDepth; i < openCount; i++) history.pushState({ cookpopModalDepth: i + 1 }, '');
    modalHistoryDepth = openCount;
  } else if(openCount < modalHistoryDepth){
    const delta = modalHistoryDepth - openCount;
    modalHistoryDepth = openCount;
    suppressPopstateNav = true;
    clearTimeout(suppressTimer);
    // Se il popstate non arriva (es. cronologia senza entry): non resta in attesa.
    suppressTimer = setTimeout(()=>{ if(suppressPopstateNav){ suppressPopstateNav = false; if(pushAfterPop){ pushAfterPop = false; reconcileModalHistory(); } } }, 1500);
    history.go(-delta);
  }
}
window.addEventListener('popstate', ()=>{
  if(suppressPopstateNav){
    suppressPopstateNav = false; clearTimeout(suppressTimer);
    if(pushAfterPop){ pushAfterPop = false; reconcileModalHistory(); }
    return;
  }
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
// Un avviso senza "Annulla".
function showNotice(message){ showUndoToast(message, null); }
function renderUndoToast(){
  if(!state.undoToast) return '';
  return `
  <div class="undo-toast">
    <span class="undo-toast-message">${escapeHtml(state.undoToast.message)}</span>
    ${state.undoToast.undoFn ? '<button type="button" class="btn is-text undo-toast-btn" data-undo-toast>Annulla</button>' : ''}
  </div>`;
}

// Quantità degli ingredienti di una ricetta: numero + unità scelta da un
// elenco, invece del testo scritto a mano. Un testo che non si riconosce
// ("mezzo bicchiere", "3-4") resta com'è, in un campo di testo.
const QTY_UNIT_OPTIONS = [
  ['', 'pezzi', 'pezzi'], ['g', 'g', 'g'], ['kg', 'kg', 'kg'], ['ml', 'ml', 'ml'], ['l', 'l', 'l'],
  ['cucchiaio', 'cucchiaio', 'cucchiai'], ['cucchiaino', 'cucchiaino', 'cucchiaini'], ['spicchio', 'spicchio', 'spicchi'],
  ['pizzico', 'pizzico', 'pizzichi'], ['bicchiere', 'bicchiere', 'bicchieri'], ['fetta', 'fetta', 'fette'],
  ['foglia', 'foglia', 'foglie'], ['rametto', 'rametto', 'rametti'], ['mazzetto', 'mazzetto', 'mazzetti'], ['ciuffo', 'ciuffo', 'ciuffi'],
  ['costa', 'costa', 'coste'], ['confezione', 'confezione', 'confezioni'], ['lattina', 'lattina', 'lattine'], ['noce', 'noce', 'noci'], ['q.b.', 'q.b.', 'q.b.']
];
function parseQtyForEdit(text){
  const t = String(text || '').trim();
  if(!t) return { ok: true, num: '', unit: '' };
  if(/^q\.?\s?b\.?$/i.test(t)) return { ok: true, num: '', unit: 'q.b.' };
  const m = t.match(/^(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:[.,]\d+)?)\s*(.*)$/);
  if(!m) return { ok: false };
  let n = m[1];
  if(/\//.test(n)){ const mixed = n.match(/^(\d+)\s+(\d+)\/(\d+)$/); n = mixed ? +mixed[1] + (+mixed[2] / +mixed[3]) : (+n.split('/')[0] / +n.split('/')[1]); }
  else n = parseFloat(n.replace(',', '.'));
  if(!isFinite(n)) return { ok: false };
  const rest = m[2].trim().toLowerCase();
  if(!rest) return { ok: true, num: String(n), unit: '' };
  const hit = QTY_UNIT_OPTIONS.find(u => u[0] && (u[1] === rest || u[2] === rest));
  return hit ? { ok: true, num: String(n), unit: hit[0] } : { ok: false };
}
// Una quantità scritta a parole ("2 grandi", "500 g di polpa") si divide in
// quantità vera (numero + unità, che combacia con Dispensa e Spesa) e il resto,
// che diventa nota. Senza un numero in testa resta com'è.
function splitQtyForEdit(text){
  const t = String(text || '').trim();
  if(!t || parseQtyForEdit(t).ok) return { qta: t, extra: '' };
  const m = t.match(/^(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:[.,]\d+)?)\s*(.*)$/);
  if(!m) return { qta: t, extra: '' };
  const rest = m[2].trim(), low = rest.toLowerCase();
  const names = [];
  QTY_UNIT_OPTIONS.forEach(u => { if(u[0]){ names.push(u[1]); names.push(u[2]); } });
  names.sort((a, b) => b.length - a.length);
  const hit = names.find(n => low.startsWith(n) && !/[a-zàèéìòù]/.test(low.charAt(n.length) || ' '));
  if(hit) return { qta: `${m[1]} ${rest.slice(0, hit.length)}`, extra: rest.slice(hit.length).replace(/^[\s,;:\-–]+/, '').trim() };
  return { qta: m[1], extra: rest.replace(/^[\s,;:\-–]+/, '').trim() };
}
function buildQtyFromEdit(num, unit){
  const n = String(num || '').trim();
  if(unit === 'q.b.') return 'q.b.';
  if(!n) return '';
  const v = parseFloat(n.replace(',', '.'));
  const shown = isFinite(v) ? String(v).replace('.', ',') : n;
  const u = QTY_UNIT_OPTIONS.find(o => o[0] === unit);
  if(!unit || !u) return shown;
  return `${shown} ${isFinite(v) && v === 1 ? u[1] : u[2]}`;
}
// Ogni ingrediente è una riga compatta (nome, quantità · parte · nota): i dati
// stanno negli attributi e si cambiano toccando la riga, nel pannello
// "Ingrediente n di N" (openEditIngSheet).
function editIngSubHtml(qta, qual, note){
  const parts = [qta ? escapeHtml(qta) : '', qual ? escapeHtml(qual) : '', note ? `<em>${escapeHtml(note)}</em>` : ''].filter(Boolean);
  return parts.join(' · ');
}
function editIngRowHtml(ingrediente, qta, qual, note){
  return `
    <div class="edit-ing-row" data-ing="${escapeAttr(ingrediente || '')}" data-qta="${escapeAttr(qta || '')}" data-qual="${escapeAttr(qual || '')}" data-note="${escapeAttr(note || '')}">
      <button type="button" class="edit-ing-summary" data-edit-ing-open aria-label="Modifica ${escapeAttr(ingrediente || 'ingrediente')}">
        <span class="edit-ing-sum-name">${escapeHtml(ingrediente || 'Nuovo ingrediente')}</span>
        <span class="edit-ing-sum-sub">${editIngSubHtml(qta, qual, note)}</span>
      </button>
      <button type="button" class="btn is-icon edit-row-remove" data-remove-row aria-label="Rimuovi ${escapeAttr(ingrediente || 'riga')}">✕</button>
    </div>`;
}
function editIngQtyHtml(qta){
  const p = parseQtyForEdit(qta);
  return p.ok
    ? `<input type="number" inputmode="decimal" min="0" step="any" class="edit-ing-num" placeholder="Qtà" aria-label="Quantità" value="${escapeAttr(p.num)}">
       <select class="edit-ing-unit" aria-label="Unità">${QTY_UNIT_OPTIONS.map(u => `<option value="${escapeAttr(u[0])}"${p.unit === u[0] ? ' selected' : ''}>${escapeHtml(u[2])}</option>`).join('')}</select>`
    : `<input type="text" class="edit-ing-qta" placeholder="Quantità" aria-label="Quantità" value="${escapeAttr(qta || '')}">`;
}
// La specifica (tuorli, succo…): scelta tra quelle dell'ingrediente, oppure
// una nuova che scrivi tu (resta poi disponibile per quell'ingrediente).
function editIngQualOptionsHtml(name, cur){
  const opts = variantOptionsFor(name);
  if(cur && !opts.includes(cur)) opts.push(cur);
  return ['', ...opts].map(v => `<option value="${escapeAttr(v)}"${(cur || '') === v ? ' selected' : ''}>${v ? escapeHtml(v) : 'Specifica…'}</option>`).join('') + '<option value="__new">+ Nuova specifica…</option>';
}
function editIngQualHtml(name, qual){
  return `<select class="edit-ing-qual" aria-label="Specifica">${editIngQualOptionsHtml(name, qual)}</select>`;
}
// Le scelte dipendono dall'ingrediente: si aggiornano quando cambia il nome.
function refreshEditIngQual(row){
  const sel = row.querySelector('.edit-ing-qual'); if(!sel) return;
  sel.innerHTML = editIngQualOptionsHtml(row.querySelector('.edit-ing-name').value, sel.value === '__new' ? '' : sel.value);
}
function switchEditIngQualToNew(sel){
  const inp = document.createElement('input');
  inp.type = 'text'; inp.className = 'edit-ing-qual-new'; inp.placeholder = 'Nuova specifica'; inp.setAttribute('aria-label', 'Nuova specifica');
  sel.replaceWith(inp); inp.focus();
}
function readEditIngRow(row){
  if(row.dataset && row.dataset.ing !== undefined){
    const qual = (row.dataset.qual || '').trim(), note = (row.dataset.note || '').trim();
    return { ingrediente: canonicalIngredientName((row.dataset.ing || '').trim()), qta: (row.dataset.qta || '').trim(), ...(qual ? { qual } : {}), ...(note ? { note } : {}) };
  }
  const raw = row.querySelector('.edit-ing-qta');
  const qta = raw ? raw.value.trim() : buildQtyFromEdit(row.querySelector('.edit-ing-num').value, row.querySelector('.edit-ing-unit').value);
  const q = row.querySelector('.edit-ing-qual-new') || row.querySelector('.edit-ing-qual');
  const qual = q && q.value !== '__new' ? q.value.trim() : '';
  const note = ((row.querySelector('.edit-ing-note') || {}).value || '').trim();
  return { ingrediente: canonicalIngredientName(row.querySelector('.edit-ing-name').value.trim()), qta, ...(qual ? { qual } : {}), ...(note ? { note } : {}) };
}
// Pannello "Ingrediente n di N": nome, quantità, quale parte, nota. Chiuderlo
// (✕ o fuori) tiene le modifiche; "Togli" toglie l'ingrediente.
let editIngRowRef = null;
function closeEditIngSheet(apply){
  const bd = document.querySelector('.edit-ing-backdrop');
  const row = editIngRowRef;
  editIngRowRef = null;
  if(!bd) return;
  const sheet = bd.querySelector('.edit-ing-sheet');
  if(row && row.isConnected && apply){
    const v = readEditIngRow(sheet);
    if(!v.ingrediente){ row.remove(); }
    else {
      const rawName = sheet.querySelector('.edit-ing-name').value.trim();
      row.outerHTML = editIngRowHtml(rawName, v.qta, v.qual || '', v.note || '');
    }
  }
  bd.remove();
}
function openEditIngSheet(row){
  closeEditIngSheet(true);
  const page = document.querySelector('.recipe-edit-page');
  if(!page || !row) return;
  const rows = [...document.querySelectorAll('#edit-ing-list .edit-ing-row')];
  const d = row.dataset;
  const isNew = !d.ing;
  const sq = splitQtyForEdit(d.qta);
  const noteStart = d.note || sq.extra;
  const bd = document.createElement('div');
  bd.className = 'move-backdrop edit-ing-backdrop';
  bd.innerHTML = `
    <div class="move-sheet edit-ing-sheet" role="dialog" aria-label="Ingrediente">
      <div class="move-handle" aria-hidden="true"></div>
      <div class="dsh-head">
        <div class="dsh-head-text">
          <span class="dsh-kicker">Ingrediente ${rows.indexOf(row) + 1} di ${rows.length}</span>
          <h2 class="move-title">${escapeHtml(d.ing || 'Nuovo ingrediente')}</h2>
        </div>
        <button type="button" class="btn is-icon dsh-close" data-edit-ing-close aria-label="Chiudi"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
      </div>
      <div class="gen-body edit-ing-sheet-body">
        <div class="edit-ing-field"><label class="edit-ing-lab">Nome</label>
          <input type="text" class="edit-ing-name" placeholder="Ingrediente" value="${escapeAttr(d.ing || '')}"></div>
        <div class="edit-ing-field"><label class="edit-ing-lab">Quantità</label>
          <div class="edit-ing-fields">${editIngQtyHtml(sq.qta)}</div></div>
        <div class="edit-ing-field"><label class="edit-ing-lab">Quale parte</label>
          <div class="edit-ing-qualbox">${editIngQualHtml(d.ing, d.qual)}</div>
          <p class="edit-ing-hint">Es. scorza, succo, solo i gambi. Lascia vuoto se serve tutto.</p></div>
        <div class="edit-ing-field"><label class="edit-ing-lab">Nota <span class="edit-ing-opt">· facoltativa</span></label>
          <input type="text" class="edit-ing-note" maxlength="60" autocomplete="off" aria-label="Nota sull'ingrediente" value="${escapeAttr(noteStart)}">
          <p class="edit-ing-hint">Es. “non trattati”, “bio”, “ben maturi”.</p></div>
      </div>
      <div class="edit-ing-footer">
        <button type="button" class="btn is-text edit-ing-remove" data-edit-ing-remove>Togli</button>
        <button type="button" class="btn is-solid" data-edit-ing-done>Fatto</button>
      </div>
    </div>`;
  page.appendChild(bd);
  editIngRowRef = row;
  const sheet = bd.querySelector('.edit-ing-sheet');
  sheet.addEventListener('click', e => e.stopPropagation());
  bd.addEventListener('click', e => { if(e.target === bd) closeEditIngSheet(true); });
  bd.querySelectorAll('[data-edit-ing-close], [data-edit-ing-done]').forEach(b => b.addEventListener('click', () => closeEditIngSheet(true)));
  bd.querySelector('[data-edit-ing-remove]').addEventListener('click', () => {
    const r = editIngRowRef; closeEditIngSheet(false); if(r && r.isConnected) r.remove();
  });
  attachIngredientCombobox(sheet.querySelector('.edit-ing-name'));
  if(isNew) sheet.querySelector('.edit-ing-name').focus();
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
    .map(it => editIngRowHtml(it.ingrediente, it.qta, it.spec, it.note)).join('');

  const editTimeEntries = recipeTimeEntriesWithText(rec, getRecipeDetails(name));
  const editTimeEntriesHtml = (editTimeEntries.length ? editTimeEntries : [{ label: '', min: '' }]).map(t => editTimeEntryHtml(t.label, t.min || '')).join('');
  const stepRowsHtml = (procedimento.length ? procedimento : [''])
    .map(s => editStepRowHtml(s)).join('');

  const formHtml = `
        <div class="filter-groups" id="edit-recipe-form">
          <div class="filter-group">
            <div class="filter-group-label">${uiIcon('pencil')} Nome</div>
            <input type="text" id="edit-name" value="${escapeAttr(name)}" autocomplete="off">
          </div>
          <div class="filter-group">
            <div class="filter-group-label">${uiIcon('photo')} Foto del piatto</div>
            <div id="edit-photo-area">${recipePhotoHtml(name, true)}</div>
          </div>
          <div class="filter-group">
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M128 20a108 108 0 1 0 108 108A108.12 108.12 0 0 0 128 20m0 192a84 84 0 1 1 84-84a84.09 84.09 0 0 1-84 84m68-84a12 12 0 0 1-12 12h-56a12 12 0 0 1-12-12V72a12 12 0 0 1 24 0v44h44a12 12 0 0 1 12 12"></path></svg> Tempo</div>
            <div id="edit-time-list">${editTimeEntriesHtml}</div>
            <datalist id="edit-time-labels">${TIME_LABELS.map(l => `<option value="${escapeAttr(l)}"></option>`).join('')}</datalist>
            <button type="button" class="btn is-text edit-add-row" id="edit-add-time-row">+ aggiungi tempo</button>
            <p class="settings-note" id="edit-time-total">${editTimeTotalHtml(editTimeEntries, rec)}</p>
          </div>
          <div class="filter-group">
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--bx" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M12 10h-2V3H8v7H6V3H4v8c0 1.654 1.346 3 3 3h1v7h2v-7h1c1.654 0 3-1.346 3-3V3h-2zm7-7h-1c-1.159 0-2 1.262-2 3v8h2v7h2V4a1 1 0 0 0-1-1"></path></svg> Porzioni</div>
            <input type="text" id="edit-porzioni" value="${escapeAttr((det && det.porzioni) || '')}">
            <label class="edit-fixed-qty"><input type="checkbox" id="edit-quantita-fisse"${det && det.quantitaFisse ? ' checked' : ''}><span>Quantità fisse: non cambiano con le porzioni (es. una torta)</span></label>
          </div>
          <div class="filter-group">
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--bx" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M12 10h-2V3H8v7H6V3H4v8c0 1.654 1.346 3 3 3h1v7h2v-7h1c1.654 0 3-1.346 3-3V3h-2zm7-7h-1c-1.159 0-2 1.262-2 3v8h2v7h2V4a1 1 0 0 0-1-1"></path></svg> Categoria</div>
            <select id="edit-categoria">
              ${CAT_ORDER.map(c=>`<option value="${c}" ${rec.categoriaNew===c?'selected':''}>${catIcon(c)} ${escapeHtml(CAT_LABEL[c])}</option>`).join('')}
            </select>
          </div>
          <div class="filter-group">
            <div class="filter-group-label">${uiIcon('tag')} Tipologia (portata)</div>
            <select id="edit-tipologia">
              ${TIPO_ORDER.map(t=>`<option value="${t}" ${(rec.tipologia||'primo')===t?'selected':''}>${tipoIcon(t)} ${escapeHtml(TIPO_LABEL[t])}</option>`).join('')}
            </select>
          </div>
          <div class="filter-group">
            <div class="filter-group-label">${uiIcon('heart')} Gradimento</div>
            <select id="edit-gradimento">
              ${GRAD_ORDER.includes(rec.gradimento) ? '' : '<option value="" selected>—</option>'}
              ${GRAD_ORDER.map(g=>`<option value="${g}" ${rec.gradimento===g?'selected':''}>${escapeHtml(GRAD_LABEL[g])}</option>`).join('')}
            </select>
          </div>
          <div class="filter-group">
            <div class="filter-group-label">${uiIcon('wheat')} Base di carboidrati</div>
            <select id="edit-base">
              ${BASE_ORDER.map(b=>`<option value="${b}" ${recipeBase(rec)===b?'selected':''}>${escapeHtml(BASE_LABEL[b])}</option>`).join('')}
            </select>
          </div>
          <div class="filter-group">
            <div class="filter-group-label">${uiIcon('egg')} Fonte di proteine</div>
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
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M208 32h-24v-8a8 8 0 0 0-16 0v8H88v-8a8 8 0 0 0-16 0v8H48a16 16 0 0 0-16 16v160a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16M72 48v8a8 8 0 0 0 16 0v-8h80v8a8 8 0 0 0 16 0v-8h24v32H48V48Zm136 160H48V96h160zm-96-88v64a8 8 0 0 1-16 0v-51.06l-4.42 2.22a8 8 0 0 1-7.16-14.32l16-8A8 8 0 0 1 112 120m59.16 30.45L152 176h16a8 8 0 0 1 0 16h-32a8 8 0 0 1-6.4-12.8l28.78-38.37a8 8 0 1 0-13.31-8.83a8 8 0 1 1-13.85-8A24 24 0 0 1 176 136a23.76 23.76 0 0 1-4.84 14.45"></path></svg> Pianificazione</div>
            <select id="edit-pianificazione">
              ${PIAN_ORDER.map(p=>`<option value="${p}" ${rec.pianificazione===p?'selected':''}>${escapeHtml(PIAN_LABEL[p])}</option>`).join('')}
            </select>
          </div>
          <div class="filter-group">
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--tabler" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M4 19a2 2 0 1 0 4 0a2 2 0 1 0-4 0m11 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0"></path><path d="M17 17H6V3H4"></path><path d="m6 5l14 1l-1 7H6"></path></g></svg> Ingredienti</div>
            <div id="edit-ing-list" class="edit-ing-list">${ingRowsHtml}</div>
            <button type="button" class="btn is-text edit-add-link" id="edit-add-ing-row">+ Aggiungi ingrediente</button>
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
            <div class="filter-group-label">${uiIcon('pencil')} Consigli</div>
            <textarea id="edit-consigli" rows="3" placeholder="Es. Puoi aggiungere al pangrattato della curcuma, che darà colore e aroma">${escapeHtml((det && det.consigli) || '')}</textarea>
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
            <div class="filter-group-label">${uiIcon('link')} Link fonte</div>
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
// Note del piatto nella schedina del pasto: il "Da ricordare" della ricetta e,
// per chi riusa un avanzo (es. Frittata di pasta, recipe.riusaAvanzo =
// ['pasta','riso']), il promemoria sul pasto che lo precede: "cuoci una
// porzione in più di pasta", che altrimenti per abitudine non si fa.
function mealSlotsInOrder(){
  const out = [];
  [0].concat(state.extraWeeks.map((_, n) => n + 1)).forEach(w => WEEK_DISPLAY_ORDER.forEach(i => ['pranzo','cena'].forEach(meal => out.push({ weekIdx: w, i, meal }))));
  return out;
}
function leftoverSourceFor(slots, idx, bases){
  for(let k = idx - 1; k >= Math.max(0, idx - 4); k--){
    let sl = slots[k];
    const link = linkedSourceMealKey(sl.weekIdx, sl.i, sl.meal);
    if(link){ const p = parseMealKey(link); sl = { weekIdx: parseInt(p.weekIdx, 10), i: parseInt(p.i, 10), meal: p.meal }; }
    const meta = effectiveRecipeMeta(sl.weekIdx, sl.i, sl.meal);
    if(!meta) continue;
    const b = recipeBase(meta);
    if(bases.includes(b)) return { ...sl, base: b };
  }
  return null;
}
function reuseNotesFor(weekIdx, i, meal){
  const mk = mealKey(weekIdx, i, meal);
  const slots = mealSlotsInOrder();
  const notes = [];
  slots.forEach((t, idx)=>{
    const meta = effectiveRecipeMeta(t.weekIdx, t.i, t.meal);
    if(!meta || !Array.isArray(meta.riusaAvanzo) || !meta.riusaAvanzo.length) return;
    if(linkedSourceMealKey(t.weekIdx, t.i, t.meal)) return;
    const done = weekMealsDoneRef(t.weekIdx);
    if(done[t.i] && done[t.i][t.meal]) return;
    const src = leftoverSourceFor(slots, idx, meta.riusaAvanzo);
    if(!src || mealKey(src.weekIdx, src.i, src.meal) !== mk) return;
    notes.push(`Cuoci una porzione in più di ${(BASE_LABEL[src.base] || src.base).toLowerCase()}: ${DATA.week1[t.i].giorno.toLowerCase()} serve per ${meta.nome}.`);
  });
  return notes;
}
function mealNotesHtml(weekIdx, i, meal, dishes){
  const notes = reuseNotesFor(weekIdx, i, meal).map(t => ({ t, hot: true }));
  mealMissingRipieno(weekIdx, i, meal).forEach(x => notes.unshift({ t: `Manca il ripieno per «${x.name}»: aggiungilo con + piatto.`, hot: true }));
  // Un avanzo è già cucinato: i promemoria di preparazione (ammollo, marinatura…) non servono.
  const isLeftover = !!linkedSourceMealKey(weekIdx, i, meal);
  if(!isLeftover) dishes.forEach(dsh=>{
    const det = getRecipeDetails(dsh.name);
    const r = det && det.ricordare && det.ricordare !== 'Niente' ? String(det.ricordare).trim() : '';
    if(r) notes.push({ t: (dishes.length > 1 ? dsh.name + ': ' : '') + r, hot: false });
  });
  if(!notes.length) return '';
  return `<div class="meal-notes">${notes.map(n => `<div class="meal-note${n.hot ? ' is-hot' : ''}"><span class="meal-note-ic" aria-hidden="true">💡</span><span>${escapeHtml(n.t)}</span></div>`).join('')}</div>`;
}
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
  // Pasto-avanzo: niente portate né azioni per piatto, ma una riga sola più
  // discreta — icona dell'avanzo e i piatti uno dopo l'altro, col "+".
  // La matita per la variante sta subito dopo il nome dell'avanzo.
  const leftoverPencil = (name && linkSource && !state.dayLinkNotes[mk] && state.linkNoteEditingKey !== mk)
    ? `<button type="button" class="avanzo-note-pencil" data-link-note-show="${mk}" aria-label="Aggiungi una variante (es. fatta a frittata)">${PENCIL_ICON_SVG}</button>` : '';
  const addDishBtn = `<button type="button" class="btn dish-add" data-open-dish-picker="${mk}" aria-label="Aggiungi un piatto" title="Aggiungi un piatto"><span class="dish-add-ic" aria-hidden="true">+</span></button>`;
  const dishItemHtml = dsh => {
    const fixed = !!linkSource && dsh.role === 'p';
    return `
      <div class="dish-item">
        <button type="button" class="dish-ic${dishLockedHas(mk, dsh.name) ? ' is-locked' : ''}" data-toggle-dish-lock="${mk}" data-dish-name="${escapeAttr(dsh.name)}" aria-pressed="${dishLockedHas(mk, dsh.name)}" aria-label="${dishLockedHas(mk, dsh.name) ? 'Sblocca' : 'Blocca'} ${escapeAttr(dsh.name)}">${dishLockedHas(mk, dsh.name) ? uiIcon('lock') : tipoIcon(dsh.tipo)}</button>
        <div class="dish-text">
          <div class="dish-course">${escapeHtml(courseLabel(dsh.tipo))}<span class="dish-tag">${escapeHtml(dishTag(dsh.name))}</span></div>
          <span class="day-menu" data-toggle-day="${mk}">${escapeHtml(dsh.name)}</span>
          ${freezerPortionsOf(dsh.name) > 0 && !isFreezerDish(mk, dsh.name) && !fixed ? `<button type="button" class="dish-freezer-hint" data-use-freezer="${mk}" data-use-freezer-name="${escapeAttr(dsh.name)}">❄️ ${freezerPortionsOf(dsh.name)} ${freezerPortionsOf(dsh.name) === 1 ? 'porzione' : 'porzioni'} in freezer · usale</button>` : ''}
        </div>
        ${fixed ? '' : `<div class="dish-actions">
          <button type="button" class="btn is-icon dish-act" data-open-dish-picker="${mk}" data-dish-replace="${escapeAttr(dsh.name)}" aria-label="Cambia ${escapeAttr(dsh.name)}">${ICON_SWAP}</button>
          <button type="button" class="btn is-icon dish-act" data-dish-remove="${mk}" data-dish-name="${escapeAttr(dsh.name)}" aria-label="Togli ${escapeAttr(dsh.name)}">✕</button>
        </div>`}
      </div>`;
  };
  // Pasto avanzo: in riga restano solo gli avanzi (icona su grigio, nomi uno dopo
  // l'altro); i piatti aggiunti a questo pasto sono nuovi e stanno a parte.
  const leftoverDishes = dishes.filter(d => !d.own), newDishes = dishes.filter(d => d.own);
  const leftoverHtml = (name && linkSource) ? `
    <div class="dish-line is-leftover">
      <div class="leftover-line"><button type="button" class="dish-ic leftover-ic${dishLockedHas(mk, dishes[0].name) ? ' is-locked' : ''}" data-toggle-dish-lock="${mk}" data-dish-name="${escapeAttr(dishes[0].name)}" aria-pressed="${dishLockedHas(mk, dishes[0].name)}" aria-label="Avanzo: blocca o sblocca il pasto">🥡</button><span class="leftover-names">${leftoverDishes.map(dsh => `<span class="day-menu" data-toggle-day="${mk}">${escapeHtml(dsh.name)}</span>`).join('<span class="leftover-sep"> + </span>')}${leftoverPencil}</span></div>
      ${newDishes.length ? '' : addDishBtn}
    </div>${newDishes.length ? `
    <div class="dish-line is-new-dishes">${newDishes.map(dishItemHtml).join('')}${addDishBtn}</div>` : ''}` : '';
  const dishesHtml = leftoverHtml || (name ? `
    <div class="dish-line">
      ${dishes.map(dishItemHtml).join('')}
      ${addDishBtn}
    </div>` : '');

  // Un pasto vuoto non è mai "cucinato", anche se è rimasta la spunta di una
  // ricetta che prima c'era (prima la nascondeva per caso il CSS della riga
  // del tempo, che a pasto vuoto spariva insieme alla spunta).
  const isDone = !!name && !!(weekMealsDoneRef(weekIdx)[i] && weekMealsDoneRef(weekIdx)[i][meal]);
  // Chi cucina: in basso a sinistra nella card, accanto a "Da cucinare".
  // Un'unica fonte: iniziale sola a blocco chiuso, nome per esteso ad aperto.
  const cookPillHtml = ()=>{
    const cook = state.cooks[mk];
    const cookName = cook ? memberName(cook) : '';
    const cookLabel = cook ? (state.expandedDay === mk ? 'Cucina ' + cookName : cookName.charAt(0).toUpperCase()) : '?';
    return `<button type="button" class="cook-pill${cook ? ' has-member' : ' cook-empty'}"${cook ? ` style="--mc:${escapeAttr(memberColor(cook))}"` : ''} data-toggle-cook="${mk}" aria-label="Chi cucina: tocca per cambiare">${escapeHtml(cookLabel)}</button>`;
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
    if(d.consigli) metaLines.push(`<b>Consigli:</b> ${escapeHtml(d.consigli)}`);
    if(d.nota) metaLines.push(`<b>Nota:</b> ${escapeHtml(d.nota)}`);
  }

  // Badge di stato accanto al tempo. "Cucinato" non è più un badge
  // chiudibile: si dice una volta sola nel titolo barrato (vedi .done .day-menu
  // in CSS) più questa etichettina di conferma — l'annullo sta nel bottone
  // "Cucinata"/"Da cucinare" della riga sotto, non si ripete qui. Lo stesso
  // vale per "Cambiato": l'annullo ("Torna alla ricetta originale") si è
  // spostato nel foglio "⋯". "Avanzo di GG" resta badge-con-✕ (scollega),
  // e "Bloccato" è sola lettura (l'annullo sta nel lucchetto/nel foglio "⋯").
  const doneTag = ''; // lo stato "Cucinata" si legge e si cambia già nel bottone in basso a destra
  const statusBadges = '';

  const isOpen = state.expandedDay === mk;
  // Un'unica fonte per "chi cucina": iniziale sola a blocco chiuso, nome per
  // esteso a blocco aperto.

  const mealBlockHtml = `
  <div class="meal-block${isDone ? ' done' : ''}${isOpen ? ' open' : ''}${name ? '' : ' is-empty'}" data-week-idx="${weekIdx}" data-day-index="${i}" data-meal="${meal}">
    <div class="day-meal">
      <div class="meal-block-label">${escapeHtml(MEAL_LABEL[meal])}${timeDisplay ? `<span class="meal-block-time"> · ${escapeHtml(timeDisplay)}</span>` : ''}</div>
      ${name && linkSource ? `<button type="button" class="status-badge status-avanzo meal-avanzo-badge" data-unlink-day="${mk}" aria-label="Avanzo: scollega">Avanzo <span class="status-badge-reset">✕</span></button>` : ''}
      ${name && !linkSource ? `<button type="button" class="btn is-icon meal-overflow-btn" data-open-meal-overflow="${mk}" aria-label="Altre azioni"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="1em" height="1em" viewBox="0 0 24 24"><circle cx="5" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="19" cy="12" r="2" fill="currentColor"/></svg></button>` : ''}
      <div class="day-row-side display-none">
        ${currentCat ? `<span class="cat-icon" title="${escapeAttr(CAT_LABEL[currentCat])}">${catIcon(currentCat)}</span>` : ''}
      </div>
    </div>
    ${name ? dishesHtml + (isDone ? '' : mealNotesHtml(weekIdx, i, meal, dishes)) : `
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
    if(d.consigli) metaLines.push(`<b>Consigli:</b> ${escapeHtml(d.consigli)}`);
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
    if(dishCookFactor(mk, dsh.name)) missing.push(...missingIngredients(getIngredientsFor(dsh.name), qtyRatio(dsh.name, ratio), ctx)); // dal freezer: niente da comprare
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
        return `<button type="button" class="dish-tab${idx === activeIdx ? ' active' : ''}" role="tab" aria-selected="${idx === activeIdx}" data-dish-tab="${mk}" data-dish-tab-name="${escapeAttr(dsh.name)}"><span class="dish-ic${dishLockedHas(mk, dsh.name) ? ' is-locked' : ''}" role="button" data-toggle-dish-lock="${mk}" data-dish-name="${escapeAttr(dsh.name)}" aria-label="${dishLockedHas(mk, dsh.name) ? 'Sblocca' : 'Blocca'} ${escapeAttr(dsh.name)}">${dishLockedHas(mk, dsh.name) ? uiIcon('lock') : tipoIcon(dsh.tipo)}</span><span class="dish-tab-label">${escapeHtml(text)}</span></button>`;
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
    { label: dishLockedHas(mk, actName) ? `${uiIcon('lock')} Sblocca il piatto` : `${uiIcon('lock')} Blocca il piatto`, attrs: `data-toggle-dish-lock="${mk}" data-dish-name="${escapeAttr(actName)}"` },
    getRecipeMeta(actName) ? { label: `✏️ Modifica ricetta`, attrs: `data-open-recipe-edit="${escapeAttr(actName)}"` } : null,
    fixedDish ? null : { label: `✕ Togli dal pasto`, attrs: `data-dish-remove="${mk}" data-dish-name="${escapeAttr(actName)}"`, danger: true }
  ].filter(Boolean);
  const menuAction = menuItems.length ? `<button type="button" class="btn is-icon meal-menu-btn" data-meal-menu aria-label="Impostazioni del piatto" aria-expanded="${!!state.mealDetailMenuOpen}">${DOTS_ICON_SVG}</button>` : '';
  const menuHtml = menuItems.length && state.mealDetailMenuOpen ? `
      <div class="meal-menu-backdrop" data-meal-menu-close></div>
      <div class="topbar-menu meal-menu" role="menu">
        ${menuItems.map(it => `<button type="button" class="topbar-menu-item${it.danger ? ' color-delete' : ''}" role="menuitem" ${it.attrs}>${it.label}</button>`).join('')}
      </div>` : '';
  const cookFab = act ? cookFabHtml(act.dsh.name, act.ratio, mk) : '';
  const longDate = weekDatesFor(weekIdx)[pos].toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });
  const mealHeaderSub = `${longDate.charAt(0).toUpperCase()}${longDate.slice(1)} · ${dishes.length} ${dishes.length === 1 ? 'piatto' : 'piatti'}`;

  // Pagina a tutto schermo con freccia Indietro, come la scheda ingrediente
  // della Dispensa (prima era una modale).
  return managePageHtml({ key: 'meal-' + mk, title: `${escapeHtml(MEAL_LABEL[meal])}<span class="meal-page-date">${escapeHtml(mealHeaderSub)}</span>`, closeAttr: 'data-close-meal-detail', action: menuAction, body: `
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
// Chiudere la scelta del ripieno obbligatorio annulla anche l'impasto appena aggiunto.
function closeDishPicker(){
  const dp = state.dishPicker;
  if(!dp) return;
  if(dp.require){
    const { weekIdx, i, meal } = parseMealKey(dp.key);
    removeMealDishRaw(weekIdx, i, meal, dp.require, true);
    persist();
  }
  state.dishPicker = null;
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
  // "Suggeriti": poche proposte per questo giorno (solo cena), con il motivo; "Un'altra proposta" ne mostra di diverse.
  const canSuggest = meal === 'cena';
  if(dp.tipo === 'suggeriti' && !canSuggest) dp.tipo = 'all';
  const suggestMotivo = {};
  if(dp.tipo === 'suggeriti'){
    dp.suggestSeen = dp.suggestSeen || [];
    if(!dp.suggestNow || !dp.suggestNow.length){
      const sug = suggestSwaps(weekIdx, parseInt(i, 10), new Set(dp.suggestSeen));
      dp.suggestNow = sug.map(x => x.r.nome);
      dp.suggestMotivi = {};
      sug.forEach(x => { dp.suggestMotivi[x.r.nome] = x.motivo; });
      dp.suggestNow.forEach(n => dp.suggestSeen.push(n));
    }
    results = results.filter(r => dp.suggestNow.includes(r.nome));
    results.forEach(r => { suggestMotivo[r.nome] = (dp.suggestMotivi || {})[r.nome] || ''; });
  } else if(dp.tipo === 'freezer') results = results.filter(r => frozenNames.has(r.nome));
  else if(dp.tipo !== 'all') results = results.filter(r => r.tipologia === dp.tipo);
  if(search) results = results.filter(r => r.nome.toLowerCase().includes(search.toLowerCase()));
  if(dp.require){ const ok = recipeRipieni(dp.require); results = results.filter(r => ok.includes(r.nome)); }
  // "Con quello che ho": prima chi ha tutto in casa, poi a cui manca poco
  // (almeno metà degli ingredienti), dal meno al più mancante.
  const pantryMatches = {};
  if(dp.pantry){
    const expiring = pantryExpiringMap();
    results.forEach(r=>{ pantryMatches[r.nome] = recipePantryMatch(r.nome, expiring); });
    results = results.filter(r => pantryMatches[r.nome].total && (!pantryMatches[r.nome].missing.length || pantryMatches[r.nome].cov >= 0.5));
    results.sort((a, b) => (pantryMatches[a.nome].missing.length - pantryMatches[b.nome].missing.length) || (pantryMatches[b.nome].exp.length - pantryMatches[a.nome].exp.length) || IT_COLLATOR_BASE.compare(a.nome, b.nome));
  }
  const pantryNote = m => !m ? '' : (m.missing.length ? ` · manca ${m.missing.slice(0, 2).map(escapeHtml).join(', ')}${m.missing.length > 2 ? ` e altri ${m.missing.length - 2}` : ''}` : ' · hai tutto');
  const resultsHtml = results.slice(0, 60).map(r=>`
    <div class="swap-result" data-dish-pick="${escapeAttr(r.nome)}" data-dish-key="${mk}">
      <span class="swap-result-icon">${catIcon(r.categoriaNew)}</span>
      <span class="swap-result-name">${escapeHtml(r.nome)}${allergenBadgeHtml(r)}</span>
      <span class="swap-result-time">${dp.tipo === 'suggeriti' && suggestMotivo[r.nome] ? escapeHtml(suggestMotivo[r.nome]) : dp.tipo === 'freezer' ? `❄️ ${freezerPortionsOf(r.nome)} porz.` : escapeHtml(String(TEMPO_LABEL[r.tempoBucket] || '').replace(/^\S+\s/, ''))}${pantryNote(pantryMatches[r.nome])}</span>
    </div>`).join('');
  const chips = `<button type="button" class="btn is-chip ${dp.pantry?'active':''}" data-dish-pantry aria-pressed="${!!dp.pantry}">🧺 Con quello che ho</button><span class="dsh-chip-sep" aria-hidden="true"></span>`
    + `<button type="button" class="btn is-chip ${dp.tipo==='all'?'active':''}" data-dish-course="all">Tutte</button>`
    + (canSuggest ? `<button type="button" class="btn is-chip ${dp.tipo==='suggeriti'?'active':''}" data-dish-course="suggeriti">✨ Suggeriti</button>` : '')
    + (frozen.length ? `<button type="button" class="btn is-chip ${dp.tipo==='freezer'?'active':''}" data-dish-course="freezer">❄️ Dal freezer</button>` : '')
    + COURSE_ORDER.map(t => `<button type="button" class="btn is-chip ${dp.tipo===t?'active':''}" data-dish-course="${t}">${tipoIcon(t)} ${escapeHtml(courseLabel(t))}</button>`).join('');
  const replaced = dp.replace ? dishes.find(x => x.name === dp.replace) : null;
  const curHtml = dp.replace ? `<div class="dsh-cur"><span class="dsh-cur-ic" aria-hidden="true">${tipoIcon(replaced ? replaced.tipo : dishCourse(dp.replace))}</span><span>Al posto di <b>${escapeHtml(dp.replace)}</b></span></div>` : '';
  return `
  <div class="move-backdrop" data-dish-picker-backdrop>
    <div class="move-sheet dish-sheet" role="dialog" aria-label="${dp.require ? 'Scegli il ripieno' : dp.replace ? 'Cambia piatto' : 'Aggiungi piatto'}">
      <div class="move-handle" aria-hidden="true"></div>
      <div class="dsh-head">
        <div class="dsh-head-text">
          <span class="dsh-kicker">${escapeHtml(MEAL_LABEL[meal])} · ${escapeHtml(d.giorno.slice(0,3).toLowerCase())} ${escapeHtml(dateLabel.toLowerCase())} · max ${escapeHtml(tempoShortLabel(getTempoCap(i, meal)).replace(/^circa\s+/, ''))}</span>
          <h2 class="move-title">${dp.require ? 'Scegli il ripieno' : dp.replace ? 'Cambia piatto' : 'Aggiungi piatto'}</h2>
        </div>
        <button type="button" class="btn is-icon dsh-close" data-close-dish-picker aria-label="Chiudi"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
      </div>
      ${curHtml}
      <label class="dsh-search"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" aria-hidden="true"><circle cx="10" cy="10" r="7"></circle><path d="m21 21-6-6"></path></svg><input type="search" class="swap-search" placeholder="Cerca una ricetta…" data-dish-search="${mk}" value="${escapeAttr(search)}" autocomplete="off"></label>
      ${dp.require ? `<p class="gen-note dsh-require">«${escapeHtml(dp.require)}» ha bisogno di un ripieno: scegline uno. Se chiudi, anche l'impasto viene tolto.</p>` : `<div class="dsh-chips dish-course-chips" role="group" aria-label="Portata">${chips}</div>`}
      <div class="swap-results dsh-results">
        ${resultsHtml || '<div class="ing-empty">Nessuna ricetta trovata.</div>'}
        ${results.length > 60 ? `<div class="ing-empty">Altri ${results.length-60} risultati — affina la ricerca.</div>` : ''}
        ${dp.tipo === 'suggeriti' ? `<button type="button" class="btn is-text gen-add-exc dsh-more" data-dish-more-suggest>↻ Un'altra proposta</button>` : ''}
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
function weekStartIso(weekIdx){ return isoLocalDate(weekDatesFor(weekIdx)[0]); }
// Giorno (0=Lun ... 6=Dom) in cui si fa il meal prep di quella settimana: quello
// scelto per la settimana, se no quello di default, se no il primo giorno.
function prepDayOf(weekIdx){
  const v = state.prepDay && state.prepDay[weekStartIso(weekIdx)];
  const n = v === 'sab' ? 5 : v === 'dom' ? 6 : parseInt(v, 10);
  if(n >= 0 && n <= 6) return n;
  const d = parseInt(state.prepDayDefault, 10);
  return d >= 0 && d <= 6 ? d : WEEK_DISPLAY_ORDER[0];
}
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
    if(factor) getIngredientsFor(n).forEach(it => out.push(Object.assign({}, it, { factor, fixed: fixedQtyRecipe(n) })));
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
  return state.dayPortions[mk] || (det && parsePortionsBase(det.porzioni)) || defaultPortions();
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
  const startPos = WEEK_DISPLAY_ORDER.indexOf(prepDayOf(weekIdx));
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
  if(day !== parseInt(i, 10)) return '';
  const cands = prepCandidates(weekIdx);
  // Senza piatti da preparare il riquadro sparisce, ma se il giorno l'hai scelto
  // tu resta, per poterlo cambiare.
  if(!cands.length && !(state.prepDay && state.prepDay[weekStartIso(weekIdx)])) return '';
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
            ${WEEK_DISPLAY_ORDER.map(d => `<button type="button" class="btn is-chip${day === d ? ' active' : ''}" data-prep-day="${d}" data-prep-week="${iso}" aria-pressed="${day === d}" aria-label="${escapeAttr(dayNameOf(d))}">${escapeHtml(dayNameOf(d).slice(0, 3))}</button>`).join('')}
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
    if(linkedSourceMealKey(nx.weekIdx, nx.i, meal)) return; // avanzo: già cucinato
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
  const hidePranzo = isToday && !isPastCard && isTodayLunchPast() && !state.balanceDetailsOpen;

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
  state.pantrySheetUsed = false;
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
  const items = PROTEINA_ORDER.filter(k => k !== 'nessuna').map(k=>({ key:k, count: prot[k] || 0, range: weekProteinTargets()[k], status: status(prot[k] || 0, weekProteinTargets()[k]) }))
    .filter(it => (it.key !== 'salumi' || it.count > 0) && (it.range[1] > 0 || it.count > 0));
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

  // Gli ultimi 3 giorni passati (e il pranzo di oggi dopo le 15) si vedono
  // aprendo il dettaglio dell'equilibrio, chiusi di default: servono soprattutto per rimediare a uno scollegamento
  // avanzi fatto per sbaglio, riaprendo la card sorgente originale.
  const pastPositions = weekIdx === 0 ? allPositions.filter(pos => pos < startPos).slice(-3) : [];
  const pastDays = (state.balanceDetailsOpen && pastPositions.length)
    ? pastPositions.map(pos=> renderDayCard(weekIdx, WEEK_DISPLAY_ORDER[pos], pos, weekDates, true)).join('')
    : '';

  const days = pastDays + positions.map(pos=> renderDayCard(weekIdx, WEEK_DISPLAY_ORDER[pos], pos, weekDates)).join('');

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
// --- Foglio "Cena fatta" / "Ricetta fatta" ----------------------------------
// Foglio dal basso: quanto togliere dalla Dispensa (− e +), gli ingredienti che
// non c'erano (chiusi), i consumi "con i pasti", cosa è avanzato (No/Sì) e,
// una ricetta alla volta, com'era (facoltativo).
// "Cena fatta": Sì/No dell'avanzo, lista "Altri N", voto un piatto alla volta.
document.addEventListener('click', e=>{
  if(state.doneModalDay === null || !e.target.closest) return;
  const left = e.target.closest('[data-done-left]');
  if(left){
    const [idx, v] = left.dataset.doneLeft.split(':');
    const row = state.doneModalLeftovers[parseInt(idx, 10)];
    if(row){ row.checked = v === '1'; render(); }
    return;
  }
  if(e.target.closest('[data-done-rest-toggle]')){ state.doneRestOpen = !state.doneRestOpen; render(); return; }
  if(e.target.closest('[data-done-grad-next]')){ state.doneGradIdx = (state.doneGradIdx || 0) + 1; render(); return; }
  if(e.target.closest('.done-sheet [data-set-gradimento]')){ state.doneGradIdx = (state.doneGradIdx || 0) + 1; render(); }
}, true); // in cattura: il foglio ferma la risalita dei tocchi ([data-stop-close])
// "Ricetta fatta" da una ricetta (senza pasto): stesse quantità, scalate sulle persone.
function openRecipeDone(name, ratio){
  const qtyMap = {};
  getIngredientsFor(name).forEach(it=>{
    const pantryIt = resolvePantryItem(it.ingrediente);
    if(pantryIt && typeof pantryIt.qty === 'number' && pantryIt.unit !== 'none') qtyMap[it.ingrediente] = (qtyMap[it.ingrediente] || 0) + usedQtyForPantry(pantryIt.unit, it.qta, qtyRatio(name, ratio));
  });
  state.doneModalRecipe = { name, ratio: ratio || 1 };
  state.doneModalDay = 'recipe';
  state.doneModalQty = qtyMap; state.doneQtyEditingKey = null; state.doneModalFinished = {}; state.doneModalMeal = {};
  state.doneModalLeftovers = [{ name, luogo: 'frigo', cat: 'avanzi', checked: false, pickerOpen: false, catPickerOpen: false }];
  state.doneGradIdx = 0; state.doneRestOpen = false;
  render();
}
function closeDoneSheet(){
  state.doneModalDay = null; state.doneModalRecipe = null;
  state.doneModalQty = {}; state.doneQtyEditingKey = null;
  state.doneModalFinished = {}; state.doneModalMeal = {};
  state.doneModalLeftovers = []; state.doneGradIdx = 0; state.doneRestOpen = false;
}
function renderDoneSheet(){
  if(state.doneModalDay === null){ state.doneGradIdx = 0; return ''; }
  const doneRecipe = state.doneModalRecipe;
  let dishNames, doneIng, title, persone;
  if(doneRecipe){
    dishNames = [doneRecipe.name];
    doneIng = getIngredientsFor(doneRecipe.name).map(it => Object.assign({}, it, { factor: 1 }));
    title = 'Ricetta fatta';
    const base = parsePortionsBase((getRecipeDetails(doneRecipe.name) || {}).porzioni);
    persone = base ? Math.round(base * (doneRecipe.ratio || 1)) : 0;
  } else {
    const { weekIdx, i, meal } = parseMealKey(state.doneModalDay);
    const mealData = effectiveMeal(weekIdx, i, meal);
    dishNames = mealDishes(weekIdx, i, meal).map(d => d.name).filter(Boolean);
    doneIng = mealCookIngredients(state.doneModalDay, mealData);
    title = `${MEAL_LABEL[meal]} ${meal === 'cena' ? 'fatta' : 'fatto'}`;
    persone = mealPortions(state.doneModalDay, mealData.principale);
  }
  const qtyMap = state.doneModalQty || {};
  const finishedMap = state.doneModalFinished || {};
  const seen = new Set();
  const uniqueIng = doneIng.filter(it=>{
    const key = (it.ingrediente || '').trim().toLowerCase();
    if(seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const CART_SVG = '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1.25em" height="1.25em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7"><circle cx="9" cy="20" r="1.25"/><circle cx="18" cy="20" r="1.25"/><path d="M3 4h2l2.4 11h11l2-8H6.2"/></g></svg>';
  const unitTxt = (n, unit) => `${n}${unit ? ' ' + escapeHtml(unit) : ''}`;
  const stepperHtml = (decAttr, incAttr, valueHtml) => `<span class="done-stepper"><button type="button" class="rd-round" ${decAttr} aria-label="Diminuisci">−</button>${valueHtml}<button type="button" class="rd-round" ${incAttr} aria-label="Aumenta">+</button></span>`;
  const qtyRows = [], restRows = [];
  uniqueIng.forEach(it=>{
    const name = it.ingrediente;
    const pantryIt = resolvePantryItem(name);
    if(!pantryIt){
      restRows.push(`<div class="done-rest-row"><span>${escapeHtml(name)}</span><small>non in Dispensa</small></div>`);
      return;
    }
    if(Object.prototype.hasOwnProperty.call(qtyMap, name) && pantryIt.unit !== 'none'){
      const unit = pantryIt.unit || '';
      const step = qtyStepFor(unit);
      const used = qtyMap[name];
      const have = pantryIt.qty || 0;
      const left = Math.max(0, Math.round((have - used) * 100) / 100);
      const editingThis = state.doneQtyEditingKey === name;
      qtyRows.push(`
      <div class="done-row">
        <div class="done-row-main"><b>${escapeHtml(name)}</b><small>${have > 0 ? (left > 0 ? `ne restano ${unitTxt(left, unit)}` : 'finiti') : 'finito in Dispensa'}</small></div>
        ${stepperHtml(`data-done-qty-dec="${escapeAttr(name)}"`, `data-done-qty-inc="${escapeAttr(name)}"`, editingThis
          ? `<span class="done-qty"><input type="number" min="0" step="${step}" class="qty-input" value="${used}" data-done-qty-edit="${escapeAttr(name)}">${unit ? `<span class="qty-unit">${escapeHtml(unit)}</span>` : ''}</span>`
          : `<span class="done-qty" data-done-qty-show="${escapeAttr(name)}">${unitTxt(used, unit)}</span>`)}
      </div>`);
      return;
    }
    const inCart = !!finishedMap[name];
    restRows.push(`<div class="done-rest-row"><span>${escapeHtml(name)}</span><button type="button" class="btn is-icon done-cart-btn${inCart ? ' active' : ''}" data-done-cart-toggle="${escapeAttr(name)}" aria-pressed="${inCart}" title="${inCart ? 'In lista spesa' : 'È finito? Metti in lista spesa'}">${CART_SVG}</button></div>`);
  });
  const dispensaHtml = qtyRows.length ? `
    <section class="done-sec"><h3>Tolgo dalla Dispensa</h3>${qtyRows.join('')}</section>` : '';
  const restHtml = restRows.length ? `
    <section class="done-sec done-rest">
      <button type="button" class="done-rest-toggle${state.doneRestOpen ? ' open' : ''}" data-done-rest-toggle aria-expanded="${!!state.doneRestOpen}">${qtyRows.length ? `Altri ${restRows.length} non erano in Dispensa` : `${restRows.length} ingredienti non in Dispensa`}<span aria-hidden="true">${state.doneRestOpen ? '▴' : '▾'}</span></button>
      ${state.doneRestOpen ? `<div class="done-rest-list">${restRows.join('')}</div>` : ''}
    </section>` : '';
  const recRows = doneRecipe ? '' : mealRecurringList().filter(r => state.doneModalMeal && Object.prototype.hasOwnProperty.call(state.doneModalMeal, r.id)).map(r=>{
    const it = recurringPantryItem(r);
    const n = state.doneModalMeal[r.id];
    if(!recurringCountable(it)) return `<div class="done-row"><div class="done-row-main"><b>${escapeHtml(r.nome)}</b><small>${it ? 'in Dispensa non si conta' : 'non in Dispensa'}</small></div></div>`;
    const uTxt = it.unit ? ' ' + escapeHtml(UNIT_SHORT[it.unit] || it.unit) : '';
    const rest = Math.max(0, Math.round((it.qty - n) * 100) / 100);
    return `
    <div class="done-row">
      <div class="done-row-main"><b>${escapeHtml(it.nome)}</b><small>${n}${uTxt} a pasto${it.qty > 0 && rest === 0 ? ' · era l\'ultimo' : ''}</small>${it.qty > 0 && rest === 0 ? '<span class="done-chip">va in Spesa</span>' : ''}</div>
      ${stepperHtml(`data-done-rec="${escapeAttr(r.id)}" data-done-rec-delta="-1"`, `data-done-rec="${escapeAttr(r.id)}" data-done-rec-delta="1"`, `<span class="done-qty">${n}${uTxt}</span>`)}
    </div>`;
  }).join('');
  const recHtml = recRows ? `<section class="done-sec"><h3>Consumi con i pasti</h3>${recRows}</section>` : '';
  const leftHtml = state.doneModalLeftovers.length ? `
    <section class="done-sec"><h3>Ne è avanzato?</h3>
      ${state.doneModalLeftovers.map((row, idx) => `
      <div class="done-left" data-done-leftover-row="${idx}">
        <div class="done-left-top"><b>${escapeHtml(row.name || 'Avanzo')}</b>
          <span class="done-seg" role="group"><button type="button" class="${row.checked ? '' : 'on'}" data-done-left="${idx}:0">No</button><button type="button" class="${row.checked ? 'on' : ''}" data-done-left="${idx}:1">Sì</button></span>
        </div>
        ${row.checked ? `<div class="done-left-where">${LUOGO_ORDER.filter(l => ['frigo', 'freezer', 'dispensa'].includes(l)).map(l => `<button type="button" class="move-chip done-where${l === row.luogo ? ' is-edited' : ''}" data-done-leftover-luogo-set="${idx}:${l}">${LUOGO_ICON[l] || ''} ${escapeHtml(LUOGO_LABEL[l])}</button>`).join('')}</div>` : ''}
      </div>`).join('')}
    </section>` : '';
  const gradNames = dishNames.filter(n => getRecipeMeta(n));
  const gi = Math.min(state.doneGradIdx || 0, gradNames.length);
  const gradName = gradNames[gi];
  const gradHtml = gradName ? `
    <section class="done-sec"><h3>Com'era ${escapeHtml(gradName)}? <small>facoltativo${gradNames[gi + 1] ? ` · <button type="button" class="done-next" data-done-grad-next>poi ${escapeHtml(gradNames[gi + 1])} ›</button>` : ''}</small></h3>
      <div class="done-grads">${GRAD_ORDER.map(g => `<button type="button" class="done-grad-chip${(getRecipeMeta(gradName) || {}).gradimento === g ? ' active' : ''}" data-set-gradimento="${escapeAttr(gradName)}" data-grad="${g}">${escapeHtml(GRAD_LABEL[g])}</button>`).join('')}</div>
    </section>` : '';
  return `
  <div class="move-backdrop done-backdrop" data-close-done-modal>
    <div class="move-sheet done-sheet${state.sheetFull ? ' is-full' : ''}" role="dialog" aria-label="${escapeAttr(title)}" data-stop-close>
      <div class="move-handle" aria-hidden="true"></div>
      <h2 class="move-title">${escapeHtml(title)}</h2>
      <p class="move-sub">${escapeHtml(dishNames.join(' + '))}${persone ? ` · per ${persone}` : ''}</p>
      <div class="move-list done-list">
        ${uniqueIng.length ? dispensaHtml + restHtml : '<div class="ing-empty">Nessun ingrediente salvato per questa ricetta.</div>'}
        ${recHtml}
        ${leftHtml}
        ${gradHtml}
      </div>
      <div class="move-footer">
        <button type="button" class="btn is-outline" data-close-done-modal>Annulla</button>
        <button type="button" class="btn is-solid" data-confirm-done="${escapeAttr(state.doneModalDay)}">Fatto</button>
      </div>
    </div>
  </div>`;
}
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
      const when = d => d < 0 ? 'scaduto' : d === 0 ? 'oggi' : d === 1 ? 'domani' : `tra ${d} gg`;
      const list = soon.slice(0, 3).map(x => `<b>${escapeHtml(x.it.nome)}</b> (${when(x.d)})`).join(', ') + (soon.length > 3 ? ` e altri ${soon.length - 3}` : '');
      expiryBanner = `
        <div class="eaten-reminder-banner expiry-banner">
          <span class="expiry-lbl">⏰ Scade presto</span>
          <span class="expiry-txt">${list}</span>
          <div class="eaten-reminder-actions">
            <button type="button" class="btn is-solid mini-add-btn" data-expiry-cook>Cosa cucino</button>
            <button type="button" class="btn is-ghost" data-dismiss-expiry-banner aria-label="Chiudi fino a domani">✕</button>
          </div>
        </div>`;
    }
  }

  const doneModal = renderDoneSheet();

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
          if(m === 'pranzo' && leftoverLunchDays(genSettingsTargetWeek).includes(d)) return;
          totalMeals++;
          if(isMealPast(genSettingsTargetWeek, d, m)) pastCount++;
          else if(state.mealLocked[`${genSettingsTargetWeek}_${d}_${m}`]) lockedCount++;
        });
      }
      regenCount = totalMeals - lockedCount - pastCount;
      const kept = [lockedCount ? `tiene ${lockedCount === 1 ? '' : 'i '}<b>${lockedCount} ${lockedCount === 1 ? 'bloccato' : 'bloccati'}</b>` : '', pastCount ? `${lockedCount ? '' : 'tiene '}${pastCount === 1 ? '' : 'i '}<b>${pastCount} ${pastCount === 1 ? 'già passato' : 'già passati'}</b>` : ''].filter(Boolean).join(' e ');
      regenNote = `Cambia <b>${regenCount} ${regenCount === 1 ? 'pasto' : 'pasti'}</b>${kept ? ', ' + kept : ''}.`;
    }
    const tempoChipLabel = { express:'≤20 min', veloce:'30 min', normale:'30–45 min', lunga:'1 h', progetto:'oltre 1 h' };
    const dayInitial = d => DATA.week1[d].giorno.slice(0, 1);
    const lw = genSettingsTargetWeek !== null ? genSettingsTargetWeek : 0;
    const cookedLunches = 7 - leftoverLunchDays(lw).length;
    const hintText = genSettingsTargetWeek === 0
      ? `${state.genTwoWeeks ? 'Per ciascuna settimana: ' : ''}${7 + cookedLunches} ricette di stagione: 7 cene${cookedLunches ? ` e ${cookedLunches} ${cookedLunches === 1 ? 'pranzo' : 'pranzi'}` : ''}.`
      : '';
    const weekForLabel = genSettingsTargetWeek !== null ? genSettingsTargetWeek : 0;
    return `
    <div class="move-backdrop" data-close-gen-settings>
      <div class="move-sheet gen-sheet" role="dialog" aria-label="Regole della settimana" data-stop-close>
        <div class="move-handle" aria-hidden="true"></div>
        <div class="dsh-head">
          <div class="dsh-head-text">
            <span class="dsh-kicker">Settimana del ${escapeHtml(weekLabelFor(weekForLabel))}</span>
            <h2 class="move-title">Regole della settimana</h2>
          </div>
          <button type="button" class="btn is-icon dsh-close" data-close-gen-settings aria-label="Chiudi"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
        </div>
        <div class="gen-body">
          <div class="gen-group">
            <div class="gen-label">Tempo massimo, tutti i giorni</div>
            <div class="chip-row">${TEMPO_ORDER.map(t => `<button type="button" class="btn is-chip${state.weekTempoBase === t ? ' active' : ''}" data-set-tempo-base="${t}" aria-pressed="${state.weekTempoBase === t}">${escapeHtml(tempoChipLabel[t])}</button>`).join('')}</div>
          </div>
          ${state.leftoverLunchOn ? `
          <div class="gen-group">
            <div class="gen-label">Pranzo con l'avanzo della sera prima</div>
            <div class="gen-days gen-leftover-days">${[0,1,2,3,4,5,6].map(d => {
              const eligible = leftoverEligible(lw).includes(d), on = leftoverLunchDays(lw).includes(d);
              return `<button type="button" class="gen-day${on ? ' active' : ''}"${eligible ? ` data-gen-leftover-day="${d}" aria-pressed="${on}"` : ` disabled title="${escapeAttr(dayNameOf(d))}, primo giorno della settimana, il pranzo si cucina sempre"`} aria-label="${escapeAttr(DATA.week1[d].giorno)}">${escapeHtml(dayInitial(d))}</button>`;
            }).join('')}</div>
            <p class="gen-note">${leftoverEligible(lw).includes(WEEK_DISPLAY_ORDER[0]) ? `${escapeHtml(dayNameOf(WEEK_DISPLAY_ORDER[0]))} usa l'avanzo dell'ultima cena della settimana prima.` : `${escapeHtml(dayNameOf(WEEK_DISPLAY_ORDER[0]))} non c'è: è il primo giorno della settimana, il pranzo si cucina sempre.`}</p>
          </div>
          <div class="gen-group gen-row">
            <div class="gen-label">Porzioni per ogni avanzo</div>
            <div class="gen-stepper"><button type="button" class="qty-btn" data-gen-leftover-portions="-1" aria-label="Meno porzioni di avanzo" ${leftoverPortionsN() <= 0 ? 'disabled' : ''}>−</button><span class="gen-stepper-val">${leftoverPortionsN() === 0 ? 'nessuna' : leftoverPortionsN() + (leftoverPortionsN() === 1 ? ' porzione' : ' porzioni')}</span><button type="button" class="qty-btn" data-gen-leftover-portions="1" aria-label="Più porzioni di avanzo" ${leftoverPortionsN() >= 4 ? 'disabled' : ''}>+</button></div>
          </div>
          ` : ''}
          ${genSettingsTargetWeek !== null ? `<div class="gen-group gen-toggle-row">
            <button type="button" class="gen-toggle" data-toggle-gen-pantry role="switch" aria-checked="${!!state.genPantryOnly}"><span class="gen-toggle-text"><span aria-hidden="true">🧺</span> Solo con quello che ho in casa</span><span class="gen-switch${state.genPantryOnly ? ' on' : ''}" aria-hidden="true"></span></button>
            ${state.genPantryOnly ? '<p class="gen-note">Prima le ricette per cui hai tutto. Se non bastano, quelle a cui manca meno.</p>' : ''}
          </div>` : ''}
          ${genSettingsTargetWeek === 0 ? `<div class="gen-group gen-toggle-row">
            <button type="button" class="gen-toggle" data-toggle-gen-two role="switch" aria-checked="${!!state.genTwoWeeks}"><span class="gen-toggle-text"><span aria-hidden="true">🗓️</span> Genera anche la settimana prossima</span><span class="gen-switch${state.genTwoWeeks ? ' on' : ''}" aria-hidden="true"></span></button>
            <p class="gen-note">Senza ripetere ricette e usando il freezer; i freschi si comprano dopo.</p>
          </div>` : ''}
          <div class="gen-group">
            <div class="gen-label">Eccezioni</div>
            ${excRowsHtml || ''}
            ${excPickerHtml}
            <button type="button" class="btn is-text gen-add-exc" data-toggle-tempo-exception-picker>+ Aggiungi un'eccezione</button>
          </div>
        </div>
        <div class="gen-footer">
          ${hintText || (genSettingsTargetWeek !== null && regenNote) ? `<div class="gen-notes">${hintText ? `<p class="gen-hint">${hintText}</p>` : ''}${genSettingsTargetWeek !== null && regenNote ? `<p class="gen-hint">${regenNote}</p>` : ''}</div>` : ''}
          ${genSettingsTargetWeek !== null
            ? `<button class="btn is-solid gen-go" data-generate-week="${genSettingsTargetWeek}"${regenCount ? '' : ' disabled'}>${!regenCount ? 'Niente da rigenerare' : genSettingsTargetWeek === 0 ? 'Genera nuovo menù' : `Rigenera ${regenCount} pasti`}</button>
               ${genSettingsTargetWeek > 0 ? `<button type="button" class="btn is-text color-delete gen-remove" data-remove-week="${genSettingsTargetWeek}">Elimina questa settimana</button>` : ''}`
            : `<button class="btn is-solid gen-go" data-close-gen-settings>Fatto</button>`}
        </div>
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
// Persone per cui si fa la spesa oltre a noi: quelle già usate nella lista,
// "Papà" sempre proposto.
function shopPeople(){
  const names = ['Papà'];
  Object.values(state.shopExtras || {}).forEach(it=>{
    const p = (it && it.per || '').trim();
    if(p && !names.some(n => n.toLowerCase() === p.toLowerCase())) names.push(p);
  });
  return names;
}
// Un pasto già cucinato ("Fatto") ha già scalato gli ingredienti dalla
// Dispensa: non deve più chiederli in Spesa (prima, scesa la scorta, le sue
// righe ricomparivano una dopo l'altra a ogni pasto fatto).
function isMealDoneAt(weekIdx, i, meal){
  const done = weekMealsDoneRef(weekIdx);
  return !!(done && done[i] && done[i][meal]);
}
function buildShopFlat(){
  const flat = [];
  allPlannedShoppingMeals().forEach(({weekIdx,i,meal,key:mk,giorno,dateLabel,isPast,principale,contorni,dishLabel})=>{
    if(isMealDoneAt(weekIdx, i, meal)) return;
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
    // Pasto già passato: l'ingrediente resta in lista ma senza dire di quale pasto era.
    const contextShort = isPast ? '' : `${giorno.slice(0,3)} ${dateLabel.split(' ')[0]} · ${MEAL_LABEL[meal]}`;
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
        const qta = state.shopChecked[key] ? it.qta : scaleQtyText(it.qta, qtyRatio(name, ratio) * factor);
        // Se in Dispensa ce n'è già abbastanza, non compare proprio in Spesa
        // (niente riga da vedere/spuntare) — a meno che non l'avessi già
        // esplicitamente de-spuntato in passato per dire "mi serve comunque".
        if(pantryStatusFor(it.ingrediente, qta, it.spec) === 'in-casa' && state.shopChecked[key] !== false) return;
        flat.push({ key, ingrediente:it.ingrediente, qta, dove:it.dove, note:it.note, spec:it.spec || '', context, contextShort, isRecipe: true, weekIdx });
      });
    });
  });
  recurringShopNeeds().forEach(n=>{
    if(state.shopDismissed[n.key]) return;
    flat.push({ key: n.key, ingrediente: n.nome, qta: String(n.need), dove:'', note:'', context: `${n.nome} per i pasti`, contextShort: `${n.nome} per ${n.meals} pasti` });
  });
  Object.entries(state.shopExtras).forEach(([id, it])=>{
    if(state.shopDismissed[id]) return;
    // Per un'altra persona (it.per, es. "Papà"): si compra insieme ma resta una
    // riga a sé, in una sezione sua, e non entra mai nella nostra Dispensa.
    const ctx = it.per ? `Per ${it.per}` : 'Aggiunti a mano';
    flat.push({ key:id, ingrediente:it.ingrediente, qta:it.qta, dove:'', note:'', context:ctx, contextShort:ctx, cat: it.cat, per: it.per || '' });
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
    flat.push({ key, ingrediente:it.nome, spec: it.spec || '', qta: typeof confirmedShop === 'string' ? confirmedShop : '', dove:'', note:'', context:'Finiti in Dispensa', contextShort:'Finiti in Dispensa', confirmed: !!confirmedShop });
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
  const allShopFlat = buildShopFlat().filter(it => !shopQuery || (it.ingrediente || '').toLowerCase().includes(shopQuery));
  // Con più settimane pianificate si compra insieme tutto ciò che si conserva
  // (pasta, pane e carne che si congelano…), ma frutta, verdura e latticini
  // freschi della settimana dopo si comprano più avanti: stanno a parte.
  // Il fresco della settimana prossima si compra insieme al resto: "Più avanti" è per quello di tra due settimane o più.
  const isLaterRow = it => it.isRecipe && it.weekIdx >= 2 && SHOP_LATER_DEPTS.includes(knownDept(it.cat) || pantryCatFor(it.ingrediente) || classifyDept(it.ingrediente));
  const laterFlat = allShopFlat.filter(isLaterRow);
  const mainFlat = allShopFlat.filter(it => !isLaterRow(it));

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

  function itemRow(keys, ingrediente, qta, note, subtitle, forcedChecked, per, qual){
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
    const baseUnit = hasAmount ? (parsedQta.unit || '') : (['g','kg','ml','l'].includes(pantryUnit) ? pantryUnit : '');
    const unit = typeof (state.shopUnit || {})[rowKey] === 'string' ? state.shopUnit[rowKey] : baseUnit;
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
      : `<span class="ing-note-row">${ingNote ? `<span class="ing-note-text" data-ing-note-show="${escapeAttr(ingNoteKey)}">${escapeHtml(ingNote)}</span><button type="button" class="ing-note-pencil" data-ing-note-show="${escapeAttr(ingNoteKey)}" aria-label="Modifica la nota">${PENCIL_ICON_SVG}</button>` : ''}</span>`;
    return `
    <div class="swipe-wrap" data-swipe-id="shop:${escapeAttr(rowKey)}" data-swipe-shop="${escapeAttr(rowKey)}" data-swipe-label="${escapeAttr(ingrediente)}">
    <button type="button" class="swipe-trash" tabindex="-1" aria-label="Elimina ${escapeAttr(ingrediente)}">${TRASH_ICON_SVG}</button>
    <div class="shop-item-row swipe-content">
      <label class="shop-item ${checked?'checked':''}">
        <input type="checkbox" data-shop-keys="${rowKey}" data-shop-name="${escapeAttr(ingrediente)}" data-shop-spec="${escapeAttr(qual || '')}" ${per ? `data-shop-per="${escapeAttr(per)}" ` : ''}data-shop-unit="${escapeAttr(unit)}" ${checked?'checked':''}>
        <span>
          <span class="item-name">${escapeHtml(ingrediente)}${allergenHitsInText(ingrediente).length ? `<span class="allergen-badge" title="Controlla l'etichetta">⚠</span>` : ''}${qual ? `<small class="ing-qual"> · ${escapeHtml(qual)}</small>` : ''}${isPartial ? `<span class="partial-mark" title="Spuntato solo per ${checkedCount} giorno/i su ${keys.length}, non per tutti">◐</span>` : ''}${!ingNote && !editingIngNote ? `<button type="button" class="ing-note-pencil" data-ing-note-show="${escapeAttr(ingNoteKey)}" aria-label="Aggiungi una nota">${PENCIL_ICON_SVG}</button>` : ''}</span>
          ${(subtitle || note) ? `<span class="item-detail">${escapeHtml(subtitle||'')}${subtitle && note ? ' · ' : ''}${escapeHtml(note||'')}</span>` : ''}
          ${ingNoteHtml}
        </span>
      </label>
      <span class="qty-stepper" title="Quantità da prendere">
        <button class="qty-btn" type="button" data-shop-qty-dec="${escapeAttr(rowKey)}" data-shop-qty-default="${qtyDefault}" data-shop-qty-step="${step}" aria-label="Diminuisci quantità">−</button>
        ${qty > 0
          ? `<span class="qty-num" data-shop-qty-show="${escapeAttr(rowKey)}">${qty}${unit ? ' ' + escapeHtml(unit) : ''}</span>`
          : `<span class="qty-num qty-placeholder" data-shop-qty-show="${escapeAttr(rowKey)}" title="Quantità non indicata">–</span>`}
        ${editingQty ? `<div class="qty-pop-backdrop" data-shop-qty-pop-close></div>
        <div class="qty-pop" role="dialog" aria-label="Quantità">
          <div class="qty-pop-row">
            <input type="number" inputmode="decimal" min="0" step="${step}" class="qty-input" value="${qty > 0 ? qty : ''}" placeholder="–" data-shop-qty-edit="${escapeAttr(rowKey)}" aria-label="Quantità">
            <select class="qty-pop-unit-sel" data-shop-qty-unit aria-label="Unità">${['', 'g', 'kg', 'ml', 'l'].map(u=>`<option value="${u}"${unit === u ? ' selected' : ''}>${escapeHtml(UNIT_SHORT[u] || u)}</option>`).join('')}</select>
          </div>
          <button type="button" class="btn btn--primary qty-pop-done" data-shop-qty-pop-close data-shop-qty-pop-done>Fatto</button>
        </div>` : ''}
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
    const k = (it.ingrediente || '').trim().toLowerCase() + (it.spec ? '\u0002' + it.spec : '') + (it.per ? '\u0001' + it.per : '');
    if(!completedMap[k]) completedMap[k] = { ingrediente: it.ingrediente, qtas: [], keys: [], per: it.per || '', spec: it.spec || '' };
    completedMap[k].qtas.push(...(it.qtas || [it.qta]));
    completedMap[k].keys.push(...(it.keys || [it.key]));
  };
  if(['reparto','categoria','az','ordine'].includes(state.shopView)){
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
      const mergeKey = (it.ingrediente||'').trim().toLowerCase() + (it.spec ? '\u0002' + it.spec : '') + (it.per ? '\u0001' + it.per : '');
      if(!merged[mergeKey]){
        merged[mergeKey] = { ingrediente: it.ingrediente, qtas: [it.qta], note: it.isRecipe ? it.note : '', dept: it.dept, keys: [it.key], spec: it.spec || '', contexts: it.isRecipe ? [] : (it.per ? [`Per ${it.per}`] : []), per: it.per || '' };
      } else {
        merged[mergeKey].qtas.push(it.qta);
        merged[mergeKey].keys.push(it.key);
        if(it.isRecipe && it.note && !(merged[mergeKey].note || '').split(' · ').includes(it.note)) merged[mergeKey].note = [merged[mergeKey].note, it.note].filter(Boolean).join(' · ');
        // Giorno e pasto non si scrivono sotto l'ingrediente: chi li vuole usa "Ordina per Pasto".
      }
    });
    const mergedList = groupRowsByName(Object.values(merged).map(it => ({ ...it, qta: combineQtyTexts(it.qtas) })));
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
    // "Categoria": reparti nell'ordine che hanno in Dispensa (DEPT_ORDER).
    let sortedDepts = (state.shopView === 'categoria' ? DEPT_ORDER : shopAisleOrder()).filter(d => deptsPresent.includes(d));
    // "Dalla A alla Z": una lista sola senza sezioni (i Finiti restano a parte, in fondo).
    if(state.shopView === 'az'){
      byDept.__az = mergedList.filter(it => it.dept !== 'finiti' && !isItemChecked(it.keys, it.ingrediente)).sort((a, b) => IT_COLLATOR.compare(a.ingrediente, b.ingrediente));
      sortedDepts = (byDept.__az.length ? ['__az'] : []).concat(deptsPresent.includes('finiti') ? ['finiti'] : []);
    }
    // "Ordine spesa": lista unica, senza titoli, trascinabile (vedi shopOrderApply).
    if(state.shopView === 'ordine'){
      const aisleRank = new Map(shopAisleOrder().map((d, i) => [d, i]));
      byDept.__az = shopOrderApply(mergedList.filter(it => it.dept !== 'finiti' && !isItemChecked(it.keys, it.ingrediente)), it => aisleRank.has(it.dept) ? aisleRank.get(it.dept) : 999);
      sortedDepts = (byDept.__az.length ? ['__az'] : []).concat(deptsPresent.includes('finiti') ? ['finiti'] : []);
    }
    hasFinitiThisView = deptsPresent.includes('finiti');

    body = sortedDepts.map(dept => {
      const isFinitiDept = dept === 'finiti';
      const items = byDept[dept];
      const finitiCheckedCount = isFinitiDept ? items.filter(it=>isItemChecked(it.keys, it.ingrediente)).length : 0;
      const rowsHtml = items.map(it=>itemRow(it.keys, it.ingrediente, it.qta, it.note, it.contexts.join(' + '), undefined, it.per, it.spec)).join('');
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
      if(dept === '__az' && state.shopView === 'ordine'){
        return `<div class="shop-day-group shop-az shop-order-list">${items.map(it => `<div class="shop-order-row" data-order-row="${escapeAttr(shopOrderKey(it))}"><span class="aisle-handle" data-order-handle aria-label="Trascina per spostare" role="button">⠿</span><div class="shop-order-item">${itemRow(it.keys, it.ingrediente, it.qta, it.note, it.contexts.join(' + '), undefined, it.per)}</div></div>`).join('')}</div>`;
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
      .filter(({weekIdx, i, meal}) => (weekIdx !== 0 || WEEK_DISPLAY_ORDER.indexOf(i) >= todayPos) && !isMealDoneAt(weekIdx, i, meal))
      .map(({weekIdx,i,meal,giorno,dateLabel,dishLabel,principale,contorni})=>{
      const context = `${giorno} ${dateLabel} · ${MEAL_LABEL[meal]} · ${dishLabel}`;
      const dayItems = mainFlat.filter(it => it.context === context);
      const mergedDay = {};
      dayItems.forEach(it=>{
        const mergeKey = (it.ingrediente||'').trim().toLowerCase() + (it.spec ? '\u0002' + it.spec : '');
        if(!mergedDay[mergeKey]) mergedDay[mergeKey] = { ingrediente: it.ingrediente, qtas: [it.qta], note: it.note, dove: it.dove, keys: [it.key], spec: it.spec || '' };
        else { mergedDay[mergeKey].qtas.push(it.qta); mergedDay[mergeKey].keys.push(it.key); }
      });
      const allDayItems = groupRowsByName(Object.values(mergedDay).map(it => ({ ...it, qta: combineQtyTexts(it.qtas) })));
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
        ? mergedDayItems.map(it=>itemRow(it.keys, it.ingrediente, it.qta, it.note, it.dove, undefined, undefined, it.spec)).join('')
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
    const perSections = [...new Set(mainFlat.filter(it => it.per).map(it => it.per))].map(per => {
      const rowsPer = mainFlat.filter(it => it.per === per).filter(notDone);
      if(!rowsPer.length) return '';
      const secId = 'giorno_per-' + per.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const perOpen = !state.shopSectionCollapsed[secId];
      return `
      <div class="shop-day-group">
        <div class="shop-day-title finished-toggle${perOpen ? ' open' : ''}" data-toggle-shop-section="${escapeAttr(secId)}">
          Per ${escapeHtml(per)}
          <svg class="finished-chevron" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 256 256"><path fill="currentColor" d="m213.66 101.66l-80 80a8 8 0 0 1-11.32 0l-80-80a8 8 0 0 1 11.32-11.32L128 164.69l74.34-74.35a8 8 0 0 1 11.32 11.32Z"/></svg>
        </div>
        <div class="accordion-body${perOpen ? '' : ' is-collapsed'}">${rowsPer.map(it=>itemRow([it.key], it.ingrediente, it.qta, '', '', undefined, per)).join('')}</div>
      </div>`;
    }).join('');
    body += perSections;
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

  // "Più avanti": il fresco di tra due settimane o più, chiuso di default.
  const laterRows = laterFlat.filter(it => !state.shopChecked[it.key]);
  if(laterRows.length){
    const byWeek = {};
    laterRows.forEach(it => { (byWeek[it.weekIdx] = byWeek[it.weekIdx] || {}); const k = (it.ingrediente || '').trim().toLowerCase() + (it.spec ? '\u0002' + it.spec : ''); (byWeek[it.weekIdx][k] = byWeek[it.weekIdx][k] || { ingrediente: it.ingrediente, spec: it.spec || '', keys: [], qtas: [] }); byWeek[it.weekIdx][k].keys.push(it.key); byWeek[it.weekIdx][k].qtas.push(it.qta); });
    body += `
      <div class="shop-day-group shop-later-group">
        <div class="shop-day-title finished-toggle${state.shopLaterOpen ? ' open' : ''}" data-toggle-shop-later>
          Più avanti (${laterRows.length})
          <svg class="finished-chevron" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 256 256"><path fill="currentColor" d="m213.66 101.66l-80 80a8 8 0 0 1-11.32 0l-80-80a8 8 0 0 1 11.32-11.32L128 164.69l74.34-74.35a8 8 0 0 1 11.32 11.32"/></svg>
        </div>
        <div class="accordion-body${state.shopLaterOpen ? '' : ' is-collapsed'}">
          <p class="section-sub shop-later-note">Frutta, verdura e latticini freschi di tra due settimane o più: si comprano più avanti.</p>
          ${Object.keys(byWeek).sort().map(w => `<div class="shop-later-week">Settimana del ${escapeHtml(weekLabelFor(parseInt(w, 10)))}</div>${Object.values(byWeek[w]).sort((a, b) => IT_COLLATOR.compare(a.ingrediente, b.ingrediente)).map(r => itemRow(r.keys, r.ingrediente, combineQtyTexts(r.qtas), '', '', undefined, undefined, r.spec)).join('')}`).join('')}
        </div>
      </div>`;
  }

  const completedList = Object.values(completedMap).sort((a, b) => IT_COLLATOR.compare(a.ingrediente, b.ingrediente));
  if(completedList.length){
    body += `
      <div class="shop-day-group shop-completed">
        <div class="dept-title">Completati</div>
        <div class="accordion-body">${completedList.map(it => itemRow(it.keys, it.ingrediente, combineQtyTexts(it.qtas), '', it.per ? `Per ${it.per}` : '', true, it.per, it.spec)).join('')}</div>
        <div class="shop-completed-actions">
          <button type="button" class="btn is-text" id="reset-shop">Togli le spunte</button>
          <button type="button" class="btn is-outline color-delete" id="delete-checked-shop">Elimina</button>
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
  const addIngDraft = state.addIngDraft || {};
  const addIngIsNew = !!addIngQuery && !state.pantryItems[addIngQuery] && !addIngDraft.per;
  const addIngQta = addIngDraft.qta !== undefined ? addIngDraft.qta : (matchedPantryUnit ? '1' : '');
  const addIngUnit = addIngDraft.unit !== undefined ? addIngDraft.unit : matchedPantryUnit;
  const addIngCat = addIngDraft.cat !== undefined ? addIngDraft.cat : matchedPantryCat;
  const addIngPer = addIngDraft.per || '';
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
            <div class="filter-group-label">Per chi</div>
            <select id="shop-add-per">
              <option value="">Noi</option>
              ${shopPeople().map(p=>`<option value="${escapeAttr(p)}" ${addIngPer===p?'selected':''}>${escapeHtml(p)}</option>`).join('')}
              <option value="__new" ${addIngPer==='__new'?'selected':''}>Un'altra persona…</option>
            </select>
            ${addIngPer === '__new' ? `<input type="text" id="shop-add-per-new" class="add-per-new" placeholder="Nome (es. Nonna)" value="${escapeAttr(addIngDraft.perNew || '')}" autocomplete="off">` : ''}
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
    ${missingBanner}
    ${listSearchHtml('shop-search', state.shopSearch, 'Cerca nella lista…')}
    <div class="shop-head">
      ${(total && ['reparto','categoria','giorno'].includes(state.shopView)) ? `<button type="button" class="btn is-text shop-toggle-all" id="shop-toggle-all-sections">${(Object.entries(state.shopSectionCollapsed).some(([id,val]) => val && id.startsWith(state.shopView === 'reparto' || state.shopView === 'categoria' ? 'reparto_' : 'giorno_'))) ? 'Apri tutti' : 'Chiudi tutti'}</button>` : '<span></span>'}
      <label class="shop-group-by"><span>Ordina per</span>
        <select data-shop-group aria-label="Ordina per">
          ${[['reparto','Corsie'],['categoria','Categoria'],['ordine','Spesa'],['giorno','Pasto'],['az','Dalla A alla Z']].map(([v,l]) => `<option value="${v}" ${state.shopView === v ? 'selected' : ''}>${l}</option>`).join('')}
        </select>
      </label>
    </div>
    <div class="shop-list">${body}</div>
          
    
  ${renderExpiryConfirmModal()}
  ${renderMoveModal()}
    ${displayDoneShoppable ? `<div class="buttons-fixed is-checked"><button type="button" class="btn is-solid is-total shop-move-btn" id="move-checked-to-pantry">Metti in dispensa (${displayDoneShoppable})</button></div>` : ''}
    <div class="buttons-fixed">
      ${`<button class="btn is-fixed" id="spesa-fab" type="button" aria-label="Aggiungi ingrediente"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M228 128a12 12 0 0 1-12 12h-76v76a12 12 0 0 1-24 0v-76H40a12 12 0 0 1 0-24h76V40a12 12 0 0 1 24 0v76h76a12 12 0 0 1 12 12"></path></svg></button>`}
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
  const tagsHtml = recipeTagsHtml(name);
  const basePers = det ? parsePortionsBase(det.porzioni) : null;
  const nPers = basePers ? (state.recipePortions[name] || basePers) : 0;
  const rRatio = basePers && !fixedQtyRecipe(name) ? nPers / basePers : 1;
  const recPane = state.dishPane['r|' + name] || 'ing';
  const ingHtml = renderIngredientsSection(ing, rRatio, { noButton: true, titleHtml: '' }, nPers);
  const personeHtml = recipePersoneHtml(personeRowHtml(nPers, '', name));
  const stepsHtml = det && det.procedimento && det.procedimento.length
    ? `<div class="detail-section"><ol class="steps-list">${det.procedimento.map(s=>`<li>${escapeHtml(s)}</li>`).join('')}</ol></div>`
    : '';
  const notes = recipeNotesHtml(det, name);
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
  return managePageHtml({ key: 'recipe-' + name, title: '<span class="rd-back-label">Ricette</span>', closeAttr: `data-toggle-recipe="${escapeAttr(name)}"`, action: menuAction, body: `
    <div class="meal-detail-body${cookFab ? ' has-cook-fab' : ''}">
      ${recipeAllergens(r).length ? `<div class="allergen-banner" role="alert">⚠ Contiene ${escapeHtml(recipeAllergens(r).join(', '))}</div>` : ''}
      ${recipePhotoHtml(name)}
      ${recipeDetailBodyHtml(name, { paneKey: 'r|' + name, ing, ratio: rRatio, ctx: {}, persone: nPers, personeHtml: rdPersoneHtml(nPers, '', name),
        mancantiHtml: mancantiTop, linkHtml: linkHtml ? `<div class="button-wrapper">${linkHtml}</div>` : '' })}
      ${menuHtml}
      ${cookFab}
    </div>` });
}

function renderPrep(){
  let list = allRecipeMetas().filter(r=>{
    if(state.filters.cat.length && !state.filters.cat.includes(r.categoriaNew)) return false;
    if(state.filters.tipo.length && !state.filters.tipo.includes(r.tipologia)) return false;
    if(state.filters.tempo && r.tempoBucket !== state.filters.tempo) return false;
    if(state.filters.quick && !['express','veloce'].includes(r.tempoBucket)) return false;
    if(state.filters.pian && r.pianificazione !== state.filters.pian) return false;
    if(state.filters.stagione && !(r.stagioni.includes(state.filters.stagione) || r.stagioni.includes('tutto'))) return false;
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
          <span class="day-time">${escapeHtml(recipeListTime(r))}</span>
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

  const activeCount = ['tempo','pian','stagione','freezer','grad','attrezz','quick'].filter(k=>state.filters[k]).length + (state.filters.cat.length ? 1 : 0) + (state.filters.tipo.length ? 1 : 0);

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
    ${renderMenuPickSheet()}
    ${renderDoneSheet()}
    ${prepSwitch}
    <div class="buttons-fixed">
    </div>`;
  }

  return `
    <p class="section-sub">Tocca una ricetta per vedere gli ingredienti</p>
    <div class="prep-search-row">
      ${listSearchHtml('f-search', state.filters.search, 'Cerca una ricetta…')}
      <button class="btn is-filters prep-filters-btn${activeCount ? ' active' : ''}" type="button" data-open-filters><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M10 18h4v-2h-4zM3 6v2h18V6zm3 7h12v-2H6z"></path></svg>Filtri${activeCount ? ` (${activeCount})` : ''}</button>
    </div>

    ${filtersModal}
    <div class="chip-row prep-quick">
      <button type="button" class="btn is-chip${pantryMode ? ' active' : ''}" data-toggle-pantry-mode aria-pressed="${pantryMode}">Con quello che ho</button>
      <button type="button" class="btn is-chip${state.filters.grad === 'preferita' ? ' active' : ''}" data-quick-filter="grad" aria-pressed="${state.filters.grad === 'preferita'}">Preferite</button>
      <button type="button" class="btn is-chip${state.filters.quick ? ' active' : ''}" data-quick-filter="quick" aria-pressed="${!!state.filters.quick}">≤30 min</button>
    </div>
    ${pantryMode ? `<p class="pantry-mode-note">Ricette con almeno metà degli ingredienti in Dispensa, prima quelle che usano cose in scadenza. Sale, olio e spezie non contano.</p>` : ''}
    <div class="accordion-body">${cards || (pantryMode
      ? '<p class="pantry-mode-empty">Nessuna ricetta si fa con quello che c\'è in Dispensa. Aggiungi quello che hai in casa, o togli qualche filtro.</p>'
      : '<p style="color:var(--sage);font-size:13px;">Nessuna ricetta corrisponde ai filtri.</p>')}</div>
    ${renderRecipeEditModal()}
    ${recipeDetailScreen}
    ${renderMenuPickSheet()}
    ${renderDoneSheet()}
    ${prepSwitch}
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
// Lotti: lo stesso ingrediente con più scadenze (due panne). it.lots =
// [{ qty, scadenza }] ordinati per data; it.qty resta il totale e it.scadenza
// la più vicina, così tutto il resto (banner, "In scadenza", Menù) funziona
// com'era. Chi toglie scorta (−, Ricetta fatta!, consumi) tocca solo it.qty:
// normalizeLots toglie dal lotto che scade prima, o aggiunge un lotto senza
// data se la scorta è salita. Un solo lotto resta una voce semplice.
const LOT_NO_DATE = '9999-99-99';
function normalizeLots(it){
  if(!it || !Array.isArray(it.lots)) return false;
  const r2 = n => Math.round(n * 100) / 100;
  const sig = () => JSON.stringify([it.lots || null, it.qty, it.scadenza || '']);
  const before = sig();
  const key = l => l.scadenza || LOT_NO_DATE;
  const sortLots = a => a.sort((x, y) => key(x) < key(y) ? -1 : key(x) > key(y) ? 1 : 0);
  let lots = it.lots.map(l => ({ qty: r2(Number(l.qty) || 0), scadenza: l.scadenza || '' })).filter(l => l.qty > 0);
  sortLots(lots);
  const target = typeof it.qty === 'number' ? it.qty : 0;
  const total = r2(lots.reduce((n, l) => n + l.qty, 0));
  if(total > target){
    let extra = r2(total - target);
    lots.forEach(l => { if(extra <= 0) return; const cut = Math.min(l.qty, extra); l.qty = r2(l.qty - cut); extra = r2(extra - cut); });
    lots = lots.filter(l => l.qty > 0);
  } else if(total < target){
    const blank = lots.find(l => !l.scadenza);
    if(blank) blank.qty = r2(blank.qty + target - total); else lots.push({ qty: r2(target - total), scadenza: '' });
  }
  const merged = [];
  lots.forEach(l => {
    const m = l.scadenza && merged.find(x => x.scadenza === l.scadenza);
    if(m) m.qty = r2(m.qty + l.qty); else merged.push(l);
  });
  sortLots(merged);
  if(merged.length <= 1 || target <= 0){
    delete it.lots;
    if(merged[0] && merged[0].scadenza) it.scadenza = merged[0].scadenza;
    else if(merged.length) delete it.scadenza;
  } else {
    it.lots = merged;
    const first = merged.find(l => l.scadenza);
    if(first) it.scadenza = first.scadenza; else delete it.scadenza;
  }
  return sig() !== before;
}
// Freezer: quando un ingrediente o un piatto ci entra (da qualunque strada:
// icona del luogo, scheda, avanzo congelato...) si salva la data (it.frozenOn)
// e la scadenza stimata dal congelamento (it.freezerExp = la scadenza è una
// stima, si può correggere a mano). Quando esce o finisce, la data sparisce.
// Giorni di conservazione in freezer per reparto; avanzi e piatti pronti 90.
const FREEZER_DAYS = { verdura:300, carne:150, salumi:60, pesce:90, latticini:90, pane:90, avanzi:90 };
const FREEZER_DEFAULT_DAYS = 90;
function freezerDaysFor(it){
  if(it.frozenMeal || it.leftover) return 90;
  const dept = knownDept(it.cat) || classifyDept(it.nome || '');
  return FREEZER_DAYS[dept] || FREEZER_DEFAULT_DAYS;
}
function addDaysToIso(iso, days){
  const [y, m, d] = iso.split('-').map(Number);
  return isoLocalDate(new Date(y, m - 1, d + days));
}
function applyFreezerExpiry(it){
  if(!it.frozenOn) return;
  const est = addDaysToIso(it.frozenOn, freezerDaysFor(it));
  if(Array.isArray(it.lots)) it.lots = [{ qty: it.qty, scadenza: est }];
  it.scadenza = est;
  it.freezerExp = true;
}
function clearFreezerExpiry(it){
  if(it.freezerExp){ delete it.scadenza; delete it.lots; }
  delete it.freezerExp;
}
function reconcileFreezer(){
  let changed = false;
  Object.values(state.pantryItems || {}).forEach(it=>{
    if(!it) return;
    const stocked = typeof it.qty === 'number' && it.qty > 0;
    if(it.luogo === 'freezer' && stocked){
      if(it.frozenOn === undefined){ it.frozenOn = isoLocalDate(new Date()); applyFreezerExpiry(it); changed = true; }
    } else if(it.frozenOn !== undefined){
      delete it.frozenOn; clearFreezerExpiry(it); changed = true;
    }
  });
  if(changed) persist();
}
// Un pasto di un giorno futuro non può essere già cucinato: se compare "cucinato"
// è un segno vecchio (settimana passata) rimesso da un telefono non aggiornato
// che lo risincronizza. Lo si toglie ogni volta, non solo una volta.
// Segno "fatto" di un pasto: `true` per oggi e i giorni passati; per un pasto dei giorni dopo (es. l'avanzo
// di domani mangiato in anticipo) 'anticipato', così non si confonde con un vecchio `true` rimasto su un
// giorno futuro (rimesso da un altro telefono con una versione vecchia), che invece si toglie a ogni disegno.
function doneValueFor(weekIdx, i){
  const tp = findTodayPos();
  const pos = WEEK_DISPLAY_ORDER.indexOf(parseInt(i, 10));
  return (weekIdx > 0 || (tp !== null && pos > tp)) ? 'anticipato' : true;
}
function clearFutureMealsDone(){
  let changed = false;
  const dropOld = (md, day) => {
    if(!md || !md[day]) return;
    Object.keys(md[day]).forEach(m => { if(md[day][m] === true){ delete md[day][m]; changed = true; } });
    if(!Object.keys(md[day]).length){ delete md[day]; changed = true; }
  };
  const todayPos = findTodayPos();
  if(todayPos !== null){
    WEEK_DISPLAY_ORDER.forEach((i, pos)=>{ if(pos > todayPos) dropOld(state.mealsDone, i); });
  }
  (state.extraWeeks || []).forEach(w => { if(w && w.mealsDone) Object.keys(w.mealsDone).forEach(day => dropOld(w.mealsDone, day)); });
  return changed;
}
function reconcileAllLots(){
  let changed = false;
  Object.values(state.pantryItems || {}).forEach(it => { if(it.lots && normalizeLots(it)) changed = true; });
  if(changed) persist();
}
function pantryExpiryDays(it){
  return it && typeof it.qty === 'number' && it.qty > 0 ? daysUntilDate(it.scadenza) : null;
}
// Scadenza stimata per i freschi che entrano in Dispensa dalla Spesa, in
// giorni da oggi, per reparto: una stima prudente per la confezione tipica,
// da confermare o correggere subito (vedi renderExpiryConfirmModal). Niente
// stima per il resto (pasta, conserve, surgelati...) né per ciò che sta in freezer.
// Consumi ricorrenti (Dispensa ⋯): ingredienti che finiscono a ritmo fisso,
// es. pane 1 al giorno, latte 1 ogni 3 giorni. Ogni `every` giorni si scala
// `qty` dalla scorta in Dispensa (a 0 finisce in Spesa tra i Finiti, come il
// resto). `last` è l'ultimo giorno già scalato: aprire l'app dopo qualche
// giorno recupera i cicli passati. Solo voci con unità (non "solo presenza").
let recurringRanOn = '';
const CHEV_DOWN_SVG = '<svg class="manage-chev" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9l6 6l6-6"/></svg>';
const CHEV_UP_SVG = '<svg class="manage-chev" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 15l6-6l6 6"/></svg>';
function recurringList(){
  return Object.entries(state.recurringItems || {}).map(([id, r]) => Object.assign({ id }, r));
}
function recurringSummary(r, unit){
  const u = unit && unit !== 'none' ? ' ' + (UNIT_SHORT[unit] || unit) : '';
  if(r.mode === 'meal') return `${r.qty}${u} a pasto (cena, sabato e domenica a pranzo)`;
  return `${r.qty}${u} ${r.every === 1 ? 'al giorno' : `ogni ${r.every} giorni`}`;
}
// Consumi "con i pasti" (mode 'meal', es. il pane): `qty` a pasto, a cena ogni
// giorno e a pranzo sabato e domenica; un pasto non impostato non conta. Si
// toglie dalla Dispensa quando il pasto si segna come mangiato (con − / + in
// "Ricetta fatta!"), e in Spesa si compra quanto serve per i pasti ancora da
// mangiare, meno la scorta. Se la ricetta lo elenca già tra gli ingredienti,
// lo conta la ricetta.
function mealRecurringList(){ return recurringList().filter(r => r.mode === 'meal'); }
function mealUsesRecurring(i, meal){
  return meal === 'cena' || (meal === 'pranzo' && (Number(i) === 5 || Number(i) === 6));
}
function recurringPantryItem(r){ return resolvePantryItem(r.nome); }
function recurringCountable(it){ return !!(it && typeof it.qty === 'number' && it.unit !== 'none'); }
function recipeListsRecurring(ingredients, r){
  const it = recurringPantryItem(r);
  const nm = (r.nome || '').trim().toLowerCase();
  return ingredients.some(x => (it && resolvePantryItem(x.ingrediente) === it) || (nm && (x.ingrediente || '').trim().toLowerCase().split(/[\s(]/)[0] === nm.split(/\s/)[0] && /^(pane|panini|panino)$/.test(nm)));
}
function recurringMealsAhead(){
  let count = 0;
  const startPos = findTodayPos() ?? 0;
  const weeks = [0, ...state.extraWeeks.map((_,n)=>n+1)];
  weeks.forEach(weekIdx=>{
    const done = weekMealsDoneRef(weekIdx);
    WEEK_DISPLAY_ORDER.forEach((i, pos)=>{
      if(weekIdx === 0 && pos < startPos) return;
      ['pranzo','cena'].forEach(meal=>{
        if(!mealUsesRecurring(i, meal)) return;
        if(weekIdx === 0 && pos === startPos && meal === 'pranzo' && isTodayLunchPast()) return;
        if(done[i] && done[i][meal]) return;
        if(effectiveMeal(weekIdx, i, meal).principale) count++;
      });
    });
  });
  return count;
}
// Righe di Spesa: una per consumo a pasto. La chiave cambia col numero, così
// dopo aver comprato meno del necessario (o se il menù cambia) la riga torna.
function recurringShopNeeds(){
  const list = mealRecurringList();
  if(!list.length) return [];
  const meals = recurringMealsAhead();
  return list.map(r=>{
    const it = recurringPantryItem(r);
    if(it && !recurringCountable(it)) return null;
    const have = it && typeof it.qty === 'number' ? Math.max(0, it.qty) : 0;
    const need = Math.round((meals * r.qty - have) * 100) / 100;
    if(need <= 0) return null;
    return { key: `rec_${r.id}_${need}`, nome: it ? it.nome : r.nome, need, meals };
  }).filter(Boolean);
}
function takeRecurringMeal(counts){
  const took = [];
  Object.entries(counts || {}).forEach(([id, n])=>{
    const r = (state.recurringItems || {})[id];
    const it = r && recurringPantryItem(r);
    if(!(n > 0) || !recurringCountable(it) || !(it.qty > 0)) return;
    const prev = it.qty;
    it.qty = Math.max(0, Math.round((prev - n) * 100) / 100);
    took.push({ it, prev });
  });
  return took;
}
function applyRecurringConsumption(){
  const list = recurringList();
  if(!list.length) return;
  const today = isoLocalDate(new Date());
  if(recurringRanOn === today) return;
  recurringRanOn = today;
  let changed = false;
  list.forEach(r=>{
    if(r.mode === 'meal') return;
    const every = Math.max(1, parseInt(r.every, 10) || 1);
    const since = r.last ? -daysUntilDate(r.last) : 0;
    const cycles = Math.floor(since / every);
    if(!(cycles > 0)) return;
    const it = resolvePantryItem(r.nome);
    if(it && typeof it.qty === 'number' && it.unit !== 'none') it.qty = Math.max(0, Math.round((it.qty - cycles * r.qty) * 100) / 100);
    const d = new Date(); d.setDate(d.getDate() - (since - cycles * every));
    state.recurringItems[r.id].last = isoLocalDate(d);
    changed = true;
  });
  if(changed) persist();
}
function recurringEditCardHtml(id){
  const d = state.recurringDraft || { nome: '', qty: 1, every: 1, mode: 'time' };
  const isNew = id === 'new';
  return `
      <div class="manage-edit" data-recurring-edit-card="${escapeAttr(id)}">
        ${isNew ? '' : `<button type="button" class="manage-edit-head" data-recurring-cancel aria-expanded="true"><span>${escapeHtml((d.nome || '').charAt(0).toUpperCase() + (d.nome || '').slice(1))}</span>${CHEV_UP_SVG}</button>`}
        <label class="manage-field"><span>Ingrediente</span>
          <input type="text" id="recurring-name" value="${escapeAttr(d.nome || '')}" placeholder="Scegli un ingrediente" autocomplete="off"></label>
        <div class="manage-field"><span>Come si consuma</span>
          <div class="chip-row">
            <button type="button" class="btn is-chip${d.mode === 'meal' ? '' : ' active'}" data-recurring-mode="time">A tempo</button>
            <button type="button" class="btn is-chip${d.mode === 'meal' ? ' active' : ''}" data-recurring-mode="meal">Con i pasti</button>
          </div></div>
        <label class="manage-field"><span>${d.mode === 'meal' ? 'Quanto ne consumo a pasto' : 'Quanto ne consumo'}</span>
          <input type="number" inputmode="decimal" min="0" step="0.5" id="recurring-qty" value="${escapeAttr(d.qty)}"></label>
        ${d.mode === 'meal' ? '<p class="settings-note">Si conta insieme alla ricetta: lo trovi in "Ricetta fatta!" (a cena e sabato e domenica a pranzo) e in Spesa quanto ne serve per i pasti in menù.</p>' : `<label class="manage-field"><span>Ogni quanti giorni</span>
          <input type="number" inputmode="numeric" min="1" step="1" id="recurring-every" value="${escapeAttr(d.every)}"></label>`}
        ${d.error ? `<p class="settings-note color-delete">${d.error === 'name' ? 'Scegli l\'ingrediente dall\'elenco che compare mentre scrivi.' : 'Scrivi ingrediente, quantità e ogni quanti giorni.'}</p>` : ''}
        <div class="manage-edit-actions">
          ${isNew ? '<span></span>' : `<button type="button" class="btn is-text color-delete" data-recurring-delete="${escapeAttr(id)}">Elimina</button>`}
          <span class="manage-edit-buttons">
            <button type="button" class="btn is-outline" data-recurring-cancel>${isNew ? 'Annulla' : 'Chiudi'}</button>
            <button type="button" class="btn is-solid" id="recurring-save">${isNew ? 'Aggiungi' : 'Salva'}</button>
          </span>
        </div>
      </div>`;
}
function renderRecurringPage(){
  const editing = state.recurringEditId;
  const rows = recurringList().sort((a, b) => IT_COLLATOR.compare(a.nome, b.nome)).map(r=>{
    if(editing === r.id) return recurringEditCardHtml(r.id);
    const it = resolvePantryItem(r.nome);
    const unit = it ? it.unit : '';
    let sub = recurringSummary(r, unit);
    if(!it) sub += ' · non in Dispensa';
    else if(typeof it.qty === 'number' && it.unit !== 'none'){
      const left = r.qty > 0 ? Math.floor(it.qty / r.qty) * r.every : 0;
      const uTxt = unit ? ' ' + (UNIT_SHORT[unit] || unit) : '';
      sub += it.qty <= 0 ? ' · finito' : (r.mode === 'meal' ? ` · ne hai ${it.qty}${uTxt}` : ` · ne hai ${it.qty}${uTxt}, bastano ~${left} ${left === 1 ? 'giorno' : 'giorni'}`);
    }
    return `
      <button type="button" class="manage-row" data-recurring-edit="${escapeAttr(r.id)}">
        <span class="manage-row-icon">${uiIcon('refresh')}</span>
        <span class="manage-row-main">${escapeHtml(r.nome.charAt(0).toUpperCase() + r.nome.slice(1))}
          <span class="manage-row-sub">${escapeHtml(sub)}</span></span>
        <span class="manage-row-chevron" aria-hidden="true">${CHEV_DOWN_SVG}</span>
      </button>`;
  }).join('');
  const body = `
      <p class="settings-note manage-intro">Ingredienti che finiscono a ritmo fisso. "A tempo" (es. latte 1 ogni 3 giorni): la Dispensa li scala da sola. "Con i pasti" (es. il pane): si contano insieme alla ricetta. Quando finiscono vanno in Spesa.</p>
      <section class="settings-section">
        ${editing === 'new' ? `<div class="settings-card">${recurringEditCardHtml('new')}</div>` : `<button type="button" class="btn is-outline is-block" data-recurring-edit="new">+ Nuovo consumo</button>`}
      </section>
      <section class="settings-section">
        <div class="settings-card manage-list">${rows || '<p class="settings-card-text">Nessun consumo ricorrente.</p>'}</div>
      </section>`;
  return managePageHtml({ key: 'recurring', title: 'Consumi ricorrenti', closeAttr: 'data-close-recurring', body });
}
const EXPIRY_BANNER_KEY = 'cookpop-expiry-banner-closed';
function expiryBannerDismissedToday(){
  try{ return localStorage.getItem(EXPIRY_BANNER_KEY) === isoLocalDate(new Date()); }catch(e){ return false; }
}
const EXPIRY_ESTIMATE_DAYS = { verdura:5, carne:2, pesce:2, latticini:5 };
function defaultExpiryRules(){ return { uova: { nome: 'Uova', days: 21 } }; }
function expiryDaysForDept(d){
  const o = (state.expiryEstimates || {})[d];
  return o !== undefined ? o : (EXPIRY_ESTIMATE_DAYS[d] || 0);
}
// Eccezioni per ingrediente (state.expiryRules): corrispondenza esatta sul nome
// (maiuscole a parte), valgono più del reparto.
function expiryRuleDays(nome){
  const n = (nome || '').trim().toLowerCase();
  if(!n) return undefined;
  for(const rule of Object.values(state.expiryRules || {})){
    if(rule.nome && String(rule.nome).trim().toLowerCase() === n) return Number(rule.days) || 0;
  }
  return undefined;
}
function estimateExpiryDays(it){
  if(!it || it.luogo === 'freezer') return null;
  const r = expiryRuleDays(it.nome);
  if(r !== undefined) return r > 0 ? r : null;
  const d = expiryDaysForDept(knownDept(it.cat) || classifyDept(it.nome));
  return d > 0 ? d : null;
}
// Finestra "Scadenze stimate": una riga per fresco appena spostato in
// Dispensa, con la data stimata già salvata. − e + la spostano di un giorno,
// "Nessuna" la toglie (e "Stima" la rimette); "Va bene" chiude e basta.
function expiryConfirmKeys(){
  // Dopo "Annulla" la voce sparisce o torna senza scorta: non c'è più niente da confermare.
  return state.expiryConfirm.filter(k => state.pantryItems[k] && state.pantryItems[k].qty > 0);
}
function closeExpiryConfirm(){ state.expiryConfirm = []; }
// --- "Metti in dispensa": riepilogo di quello che hai comprato ---------------
// Per ogni riga spuntata luogo e scadenza sono già proposti (luogo dove sta di
// solito, scadenza stimata, in freezer la durata del congelamento): si tocca
// solo quello che cambia, poi Conferma.
function moveDefaultScad(name, luogo){
  if(luogo === 'freezer'){
    const it = state.pantryItems[(name || '').trim().toLowerCase()] || { nome: name };
    return addDaysIso(freezerDaysFor({ ...it, nome: name }));
  }
  return shopExpiryEstimate(name);
}
function openMoveModal(){
  const rows = [];
  document.querySelectorAll('.shop-item input[type=checkbox]:checked').forEach(cb=>{
    if(cb.closest('.finished-shop-group')) return;
    const info = shopRowInfo(cb);
    const ex = resolvePantryItem(info.name);
    const luogo = (ex && ex.luogo) || inventoryGuessLuogo(info.name, inventoryDept(info.name));
    const chosen = (state.shopExpiry || {})[info.rowKey];
    rows.push({ ...info, luogo, scad: chosen === 'none' ? '' : (chosen || moveDefaultScad(info.name, luogo)), userScad: !!chosen });
  });
  if(!rows.length) return;
  state.moveModal = { rows, pop: null };
  state.sheetFull = false;
  render();
}
function moveScadOptions(row){
  const opts = row.luogo === 'freezer' ? [[3, '+3 giorni'], [30, '+1 mese'], [90, '+3 mesi']] : [[3, '+3 giorni'], [7, '+1 sett.'], [30, '+1 mese']];
  const est = moveDefaultScad(row.name, row.luogo);
  return [...new Set((est ? [est] : []).concat(opts.map(([d]) => addDaysIso(d))))].sort();
}
function moveDateLabel(iso){ return new Date(iso + 'T00:00:00').toLocaleDateString('it-IT', { day:'numeric', month:'short' }); }
// "tra 3 giorni", "tra 1 sett.", "tra 3 mesi" per le date proposte.
function moveDateHint(iso){
  const d = Math.round((new Date(iso + 'T00:00:00') - new Date(new Date().toDateString())) / 86400000);
  if(d <= 0) return 'oggi';
  if(d === 1) return 'domani';
  if(d < 14) return `tra ${d} gg`;
  if(d < 45) return `tra ${Math.round(d / 7)} sett.`;
  return `tra ${Math.round(d / 30)} mesi`;
}
const MOVE_HOUSE_SVG = '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 256 256" width="1em" height="1em"><path fill="currentColor" d="M219.31 108.68l-80-80a16 16 0 0 0-22.62 0l-80 80A15.87 15.87 0 0 0 32 120v96a8 8 0 0 0 8 8h64a8 8 0 0 0 8-8v-48h32v48a8 8 0 0 0 8 8h64a8 8 0 0 0 8-8v-96a15.87 15.87 0 0 0-4.69-11.32ZM208 208h-48v-48a8 8 0 0 0-8-8h-48a8 8 0 0 0-8 8v48H48v-88l80-80l80 80Z"/></svg>';
// Roba per la casa (detersivi...): l'etichetta del luogo è "Casa".
function moveIsHome(r){ return r.luogo === 'dispensa' && isNonFoodDept(inventoryDept(r.name)); }
function moveLuogoChip(r){ return moveIsHome(r) ? `${MOVE_HOUSE_SVG} Casa` : `${LUOGO_ICON[r.luogo] || ''} ${escapeHtml(LUOGO_LABEL[r.luogo])}`; }
// Il menu sotto luogo/scadenza è un fumetto fisso sopra il foglio, ancorato al
// valore toccato (sopra se c'è posto, sennò sotto): non sposta niente.
function movePopStyle(pop){
  const w = 224, h = 232, vw = window.innerWidth, vh = window.innerHeight;
  const left = Math.max(8, Math.min(pop.right - w, vw - w - 8));
  const above = pop.top > h + 8;
  return above ? `left:${Math.round(left)}px; bottom:${Math.round(vh - pop.top + 6)}px;` : `left:${Math.round(left)}px; top:${Math.round(pop.bottom + 6)}px;`;
}
function renderMoveModal(){
  const m = state.moveModal;
  if(!m) return '';
  const pop = m.pop || null;
  const rowsHtml = m.rows.map((r, i)=>{
    const qty = escapeHtml(r.qtyLabel || '');
    if(r.per) return `<div class="move-row is-per"><div class="move-row-main"><span class="move-row-name">${escapeHtml(r.name)}</span><span class="move-row-qty">${qty}</span></div><div class="move-row-note">Per ${escapeHtml(r.per)} · non entra nella tua Dispensa</div></div>`;
    const scadLabel = r.scad ? moveDateLabel(r.scad) : (r.userScad ? 'nessuna' : (moveIsHome(r) ? 'nessuna' : 'Scrivi'));
    const luogoPop = pop && pop.i === i && pop.kind === 'l' ? `
        <div class="move-pop" role="listbox" style="${movePopStyle(pop)}">${LUOGO_ORDER.map(l => `<button type="button" class="move-pop-opt${r.luogo === l ? ' active' : ''}" data-move-luogo="${i}:${l}">${LUOGO_ICON[l] || ''} <span>${escapeHtml(LUOGO_LABEL[l])}</span></button>`).join('')}</div>` : '';
    const est = moveDefaultScad(r.name, r.luogo);
    const scadPop = pop && pop.i === i && pop.kind === 's' ? `
        <div class="move-pop" role="listbox" style="${movePopStyle(pop)}">
          ${moveScadOptions(r).map(iso => `<button type="button" class="move-pop-opt${r.scad === iso ? ' active' : ''}" data-move-scad="${i}:${iso}"><span>${escapeHtml(moveDateLabel(iso))}</span><small>${iso === est && r.luogo === 'freezer' ? `freezer, ${moveDateHint(iso).replace('tra ', '')}` : escapeHtml(moveDateHint(iso))}</small></button>`).join('')}
          <label class="move-pop-opt is-other">Altra data…<input type="date" data-move-date="${i}" value="${escapeAttr(r.scad || '')}"></label>
          <button type="button" class="move-pop-opt${!r.scad ? ' active' : ''}" data-move-scad="${i}:"><span>Nessuna scadenza</span></button>
        </div>` : '';
    return `<div class="move-row${r.edited ? ' is-edited' : ''}">
      <div class="move-row-main"><span class="move-row-name">${escapeHtml(r.name)}</span><span class="move-row-qty">${qty}${r.edited ? ' · modificato' : ''}</span></div>
      <div class="move-cell"><button type="button" class="move-chip${r.edited ? ' is-edited' : ''}" data-move-pop="${i}:l" aria-haspopup="listbox">${moveLuogoChip(r)}</button>${luogoPop}</div>
      <div class="move-cell"><button type="button" class="move-chip${r.scad ? '' : ' is-empty'}${r.edited && r.userScad ? ' is-edited' : ''}" data-move-pop="${i}:s" aria-haspopup="listbox">${escapeHtml(scadLabel)}</button>${scadPop}</div>
    </div>`;
  }).join('');
  return `
  <div class="move-backdrop" data-move-back-bg>
    <div class="move-sheet${state.sheetFull ? ' is-full' : ''}" role="dialog" aria-label="Metti in dispensa" data-stop-close>
      <div class="move-handle" aria-hidden="true"></div>
      <h2 class="move-title">Metti in dispensa</h2>
      <p class="move-sub">Dove sta e scadenza sono già proposte. Tocca un valore per cambiarlo.</p>
      <div class="move-colhead"><span>${m.rows.length} ${m.rows.length === 1 ? 'articolo' : 'articoli'}</span><span>Dove sta</span><span>Scadenza</span></div>
      <div class="move-list${pop ? ' has-pop' : ''}">${rowsHtml}</div>
      <div class="move-footer">
        <button type="button" class="btn is-outline" data-move-back>Indietro</button>
        <button type="button" class="btn is-solid" data-move-confirm>Conferma ${m.rows.length}</button>
      </div>
    </div>
  </div>`;
}
function refreshEditTimeTotal(){
  const el = document.getElementById('edit-time-total'); if(!el) return;
  el.innerHTML = editTimeTotalHtml(readEditTimeEntries(), getRecipeMeta(state.recipeEditName) || {});
}
document.addEventListener('input', e=>{
  if(!e.target.closest || !e.target.closest('.edit-time-min')) return;
  refreshEditTimeTotal();
});
// Ridisegna il foglio tenendo ferma la lista (scorrimento incluso).
function moveRender(){
  const top = (document.querySelector('.move-list') || {}).scrollTop || 0;
  render();
  const l = document.querySelector('.move-list'); if(l) l.scrollTop = top;
}
function closeMoveModal(){ state.moveModal = null; }
// Barretta in cima ai fogli ("Aggiungi", "Metti in dispensa"): trascinandola in
// giù il foglio si chiude (o, se è a tutto schermo, torna a metà); tirandola in
// su si apre a tutto schermo. Sotto una certa distanza torna dov'era.
(function(){
  let drag = null;
  document.addEventListener('pointerdown', e=>{
    const handle = e.target.closest && e.target.closest('.move-handle');
    if(!handle) return;
    const sheet = handle.closest('.move-sheet'); if(!sheet) return;
    e.preventDefault();
    drag = { sheet, handle, pointerId: e.pointerId, startY: e.clientY, dy: 0, t0: Date.now() };
    sheet.style.transition = 'none';
    try{ handle.setPointerCapture(e.pointerId); }catch(err){}
  });
  document.addEventListener('pointermove', e=>{
    if(!drag || e.pointerId !== drag.pointerId) return;
    drag.dy = e.clientY - drag.startY;
    const shown = drag.dy > 0 ? drag.dy : Math.max(drag.dy / 3, -30);
    drag.sheet.style.transform = `translateY(${shown}px)`;
    const bg = drag.sheet.parentElement; if(bg && drag.dy > 0) bg.style.background = `rgba(0,0,0,${0.45 * Math.max(0, 1 - drag.dy / 400)})`;
  });
  const end = e=>{
    if(!drag || e.pointerId !== drag.pointerId) return;
    const { sheet, dy, t0 } = drag; drag = null;
    const fast = Math.abs(dy) > 40 && (Date.now() - t0) < 250;
    if(dy < -50 || (fast && dy < 0)){
      if(!state.sheetFull){ state.sheetFull = true; if(state.addSheet) state.addSheet.detailsOpen = true; render(); return; }
    } else if(dy > 90 || (fast && dy > 0)){
      // Giù chiude, anche da tutto schermo.
      state.sheetFull = false;
      if(state.addSheet) state.addSheet = null;
      else if(state.moveModal) closeMoveModal();
      else if(state.doneModalDay !== null) closeDoneSheet();
      render(); return;
    }
    sheet.style.transition = 'transform .15s'; sheet.style.transform = '';
    const bg = sheet.parentElement; if(bg) bg.style.background = '';
  };
  document.addEventListener('pointerup', end);
  document.addEventListener('pointercancel', end);
})();
document.addEventListener('click', e=>{
  const m = state.moveModal;
  if(!m) return;
  const t = e.target;
  const row = i => m.rows[parseInt(i, 10)];
  if(t.closest('[data-move-back]') || (t.closest('[data-move-back-bg]') && !t.closest('[data-stop-close]'))){ closeMoveModal(); render(); return; }
  const open = t.closest('[data-move-pop]');
  if(open){ const [i, kind] = open.dataset.movePop.split(':'); const r = open.getBoundingClientRect(); m.pop = (m.pop && m.pop.i === parseInt(i, 10) && m.pop.kind === kind) ? null : { i: parseInt(i, 10), kind, left: r.left, right: r.right, top: r.top, bottom: r.bottom }; moveRender(); return; }
  if(m.pop && !t.closest('.move-pop')){ m.pop = null; moveRender(); if(!t.closest('[data-move-confirm]')) return; }
  const lu = t.closest('[data-move-luogo]');
  if(lu){ const [i, l] = lu.dataset.moveLuogo.split(':'); const r = row(i); if(r){ if(r.luogo !== l) r.edited = true; r.luogo = l; if(!r.userScad) r.scad = moveDefaultScad(r.name, l); } m.pop = null; moveRender(); return; }
  const sc = t.closest('[data-move-scad]');
  if(sc){ const idx = sc.dataset.moveScad.indexOf(':'); const r = row(sc.dataset.moveScad.slice(0, idx)); if(r){ r.scad = sc.dataset.moveScad.slice(idx + 1); r.userScad = true; r.edited = true; } m.pop = null; moveRender(); return; }
  if(t.closest('[data-move-confirm]')){
    const snaps = [];
    m.rows.forEach(r=>{ snaps.push(snapshotShopRowForUndo(r)); moveShopRowToPantry(r, { luogo: r.luogo, scad: r.scad }); });
    closeMoveModal(); persist(); render();
    if(snaps.length) showUndoToast(snaps.length === 1 ? 'Spostato in Dispensa' : `${snaps.length} articoli spostati in Dispensa`, ()=>{
      snaps.forEach(restoreShopRowSnapshot);
      persist(); render();
    });
  }
}, true);
document.addEventListener('change', e=>{
  const inp = e.target.closest && e.target.closest('[data-move-date]');
  if(!inp || !state.moveModal) return;
  const r = state.moveModal.rows[parseInt(inp.dataset.moveDate, 10)];
  if(r){ r.scad = inp.value || ''; r.userScad = true; r.edited = true; state.moveModal.pop = null; moveRender(); }
});
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
function frozenOnShort(iso){
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('it-IT', { day:'numeric', month:'short' });
}
function expiryBadgeHtml(days, iso){
  if(days === null) return '';
  let text, level;
  if(days < 0){ text = days === -1 ? 'Scaduto ieri' : 'Scaduto'; level = 'is-expired'; }
  else if(days === 0){ text = 'oggi'; level = 'is-expired'; }
  else if(days === 1){ text = 'domani'; level = 'is-soon'; }
  else if(days <= EXPIRY_SOON_DAYS){ text = `tra ${days} gg`; level = 'is-soon'; }
  else if(days <= 7){ text = `tra ${days} gg`; level = 'is-later'; }
  else { text = frozenOnShort(iso); level = 'is-later'; }
  return `<span class="exp-badge ${level}">${text}</span>`;
}

// --- Scheda ingrediente ------------------------------------------------------
// Una pagina sola per aggiungere e modificare un ingrediente (o un prodotto
// di casa): in cima nome, quantità, luogo e scadenza, che si usano di più;
// categoria e gruppo come righe che si aprono in un elenco; unità, "Unisci
// con…" ed Elimina sotto "Altro". Il pulsante in fondo resta sempre visibile.
const UNIT_SHORT = { '':'pezzi', g:'g', kg:'kg', ml:'ml', l:'l', none:"solo c'è / non c'è" };
// Aggiunge alla Dispensa quello che c'è nella bozza (scheda Aggiungi, o foglio
// Aggiungi unico in modalità "in casa"). Ritorna false se manca il nome.
function commitPantryDraft(d){
    const nome = (d.nome || '').trim();
    if(!nome) return false;
    // Dalla vista Casa, un prodotto che la categoria automatica non
    // riconosce come "di casa" finisce in Casa › Altro invece che nel cibo.
    let cat = d.cat || '';
    if(!cat && d.home && !isNonFoodDept(classifyDept(nome))) cat = 'altro-casa';
    const key = nome.toLowerCase();
    const prevItem = state.pantryItems[key] ? Object.assign({}, state.pantryItems[key]) : null;
    upsertPantryItem(nome, d.luogo, d.unit === 'none' ? (d.qty > 0 ? 1 : 0) : d.qty, d.unit || '', cat, d.group || '');
    if(d.barcode){
      if(!state.barcodes) state.barcodes = {};
      state.barcodes[d.barcode] = { nome, cat: d.cat || '', unit: d.unit || '', qty: d.packQty || 0 };
    }
    const added = state.pantryItems[key];
    if(added){
      // Voce che c'era già: vale quello scelto nella scheda (es. il luogo).
      added.luogo = d.luogo || added.luogo;
      if(d.unit === 'none') added.qty = d.qty > 0 ? 1 : 0;
      if(d.scadenza){
        // Voce già in casa con un'altra scadenza: la nuova confezione è un lotto.
        if(prevItem && typeof prevItem.qty === 'number' && prevItem.qty > 0 && d.unit !== 'none'){
          const lots = (Array.isArray(prevItem.lots) ? prevItem.lots : [{ qty: prevItem.qty, scadenza: prevItem.scadenza || '' }]).map(l => ({ qty: l.qty, scadenza: l.scadenza || '' }));
          lots.push({ qty: d.qty, scadenza: d.scadenza });
          added.lots = lots;
          normalizeLots(added);
        } else added.scadenza = d.scadenza;
      }
    }
    // Se è finito nell'altra vista (es. "Detersivo" aggiunto da Cibo), ci
    // si sposta lì: altrimenti sembrerebbe non essere stato aggiunto.
    state.pantryView = isNonFoodDept(knownDept(cat) || classifyDept(nome)) ? 'casa' : 'cibo';
    closeIngredientSheet();
    state.addSheet = null;
    persist(); render();
    showUndoToast(`${nome} aggiunto`, ()=>{ if(prevItem) state.pantryItems[key] = prevItem; else delete state.pantryItems[key]; persist(); render(); });
  return true;
}

// --- Aggiungi (foglio unico: alla Spesa / in casa) ---------------------------
// Una sola finestra per aggiungere un ingrediente, dalla Spesa (+) o dalla
// Dispensa (+): in alto si sceglie se va in lista ("alla Spesa") o già in
// Dispensa ("in casa"). Nome con suggerimenti e codice a barre, quantità con
// unità, e gli "Altri dettagli" (per chi, reparto, dove sta, scadenza) a scomparsa.
// Tocco su un bottone che deve rispondere sempre al primo tocco: su telefono il
// browser può non generare il click per un tocco subito dopo un trascinamento
// (es. + premuto subito dopo aver chiuso un foglio), ma pointerup arriva. Su
// tocco si agisce al pointerup, col mouse al click; mai due volte.
function onFastTap(el, fn){
  let done = false;
  el.addEventListener('pointerup', e=>{
    if(e.pointerType === 'mouse') return;
    done = true; fn();
  });
  el.addEventListener('click', ()=>{
    if(done){ done = false; return; }
    fn();
  });
}
function openAddSheet(mode){
  const d = newPantryDraft(mode === 'casa' && state.tab === 'dispensa' && state.pantryView === 'casa');
  state.addSheet = { mode, d, per: '', perNew: '', detailsOpen: false, suggestOpen: false, luogoUser: false };
  state.sheetFull = false;
  render();
}
function addSheetSummary(a){
  const d = a.d;
  const per = a.per === '__new' ? (a.perNew || 'un\'altra persona') : a.per;
  const cat = knownDept(d.cat) ? DEPT_LABEL[d.cat] : 'reparto automatico';
  return `${per ? 'Per ' + per : 'Per noi'} · ${cat.toLowerCase()} · ${a.mode === 'casa' ? 'sta in' : 'va in'} ${LUOGO_LABEL[d.luogo || 'dispensa']}`;
}
function renderAddSheet(){
  const a = state.addSheet;
  if(!a) return '';
  const d = a.d, name = (d.nome || '').trim(), q = name.toLowerCase();
  const casa = a.mode === 'casa';
  const unit = d.unit || '';
  const sugg = (a.suggestOpen && q) ? pantryAddSuggestions(q).slice(0, 4) : [];
  const exact = !!q && (sugg.some(n => n.toLowerCase() === q) || !!existingPantryFor(name));
  const matchBold = n => { const i = n.toLowerCase().indexOf(q); return i < 0 ? escapeHtml(n) : `${escapeHtml(n.slice(0, i))}<b>${escapeHtml(n.slice(i, i + q.length))}</b>${escapeHtml(n.slice(i + q.length))}`; };
  const suggHtml = (sugg.length || (a.suggestOpen && q && !exact)) ? `<div class="add-suggest">
      ${sugg.map(n => { const ex = existingPantryFor(n); const meta = ex ? `${escapeHtml(DEPT_LABEL[knownDept(ex.cat) || classifyDept(n)] || '')} · ${typeof ex.qty === 'number' && ex.qty > 0 ? (ex.unit === 'none' ? 'in casa' : ex.qty + ' ' + escapeHtml(UNIT_SHORT[ex.unit || ''] || ex.unit) + ' in casa') : '0 in casa'}` : escapeHtml(DEPT_LABEL[classifyDept(n)] || ''); return `<button type="button" class="add-suggest-row" data-add-pick="${escapeAttr(n)}"><span>${matchBold(n)}</span><span class="add-suggest-meta">${meta}</span></button>`; }).join('')}
      ${!exact ? `<button type="button" class="add-suggest-row add-suggest-new" data-add-create>+ Crea “${escapeHtml(name)}”</button>` : ''}
    </div>` : '';
  const step = qtyStepFor(unit);
  const units = UNIT_ORDER.filter(u => u !== 'none');
  const presence = casa && unit === 'none';
  const detail = a.detailsOpen ? `<div class="add-details">
      ${!casa ? `<div class="add-field-label">Per chi</div>
      <select data-add-per aria-label="Per chi"><option value="">Noi</option>${shopPeople().map(p=>`<option value="${escapeAttr(p)}" ${a.per===p?'selected':''}>${escapeHtml(p)}</option>`).join('')}<option value="__new" ${a.per==='__new'?'selected':''}>Un'altra persona…</option></select>
      ${a.per === '__new' ? `<input type="text" class="add-per-new" data-add-per-new placeholder="Nome (es. Nonna)" value="${escapeAttr(a.perNew || '')}" autocomplete="off">` : ''}` : ''}
      <div class="add-field-label">${casa ? 'Dove sta' : 'Dove va quando lo compri'}</div>
      <div class="add-luoghi">${LUOGO_ORDER.map(l => `<button type="button" class="sheet-luogo${(d.luogo || 'dispensa') === l ? ' active' : ''}" data-add-luogo="${l}" aria-pressed="${(d.luogo || 'dispensa') === l}"><span class="sheet-luogo-icon">${LUOGO_ICON[l] || ''}</span><span>${escapeHtml(LUOGO_LABEL[l])}</span></button>`).join('')}</div>
      ${casa ? `<div class="add-field-label">Scadenza</div>
      <div class="chip-row scadenza-quick">
        <button type="button" class="btn is-chip${d.scadenza ? '' : ' active'}" data-add-scad-clear>Nessuna</button>
        ${[3, 7, 30].map(n => { const iso = addDaysIso(n); return `<button type="button" class="btn is-chip${d.scadenza === iso ? ' active' : ''}" data-add-scad-quick="${n}">${escapeHtml(frozenOnShort(iso))}</button>`; }).join('')}
        ${d.scadenza && ![3, 7, 30].some(n => addDaysIso(n) === d.scadenza) ? `<button type="button" class="btn is-chip active" aria-pressed="true">${escapeHtml(frozenOnShort(d.scadenza))}</button>` : ''}
        <label class="btn is-chip sheet-date-chip">${uiIcon('calendar')} Altra data<input type="date" data-add-scad value="${escapeAttr(d.scadenza || '')}" aria-label="Scegli la data di scadenza"></label>
      </div>` : ''}
      ${casa ? `<div class="add-field-label">Come lo conti</div>
      <select data-add-count aria-label="Come lo conti"><option value="qty" ${unit === 'none' ? '' : 'selected'}>A quantità</option><option value="none" ${unit === 'none' ? 'selected' : ''}>Solo se c'è</option></select>` : ''}
      <div class="add-field-label">Reparto</div>
      <select data-add-cat aria-label="Reparto"><option value="">Automatico (${escapeHtml(DEPT_LABEL[classifyDept(name || '')] || '')})</option>${deptOptionsHtml(d.cat || '')}</select>
      ${(!existingPantryFor(name) && name) ? `<div class="add-field-label">Equivalenti</div>
      <select data-add-group aria-label="Equivalenti"><option value="">Nessuno</option>${Object.entries(state.pantryGroups).map(([id,g])=>`<option value="${id}" ${d.group===id?'selected':''}>${escapeHtml(g.label)}</option>`).join('')}</select>` : ''}
    </div>` : '';
  return `
  <div class="move-backdrop" data-add-bg>
    <div class="move-sheet add-sheet${state.sheetFull ? ' is-full' : ''}" role="dialog" aria-label="Aggiungi" data-stop-close>
      <div class="move-handle" aria-hidden="true"></div>
      <div class="add-head">
        <h2 class="move-title">Aggiungi</h2>
        <div class="add-seg" role="group" aria-label="Dove aggiungere">
          <button type="button" class="${!casa ? 'active' : ''}" data-add-mode="spesa" aria-pressed="${!casa}">alla Spesa</button>
          <button type="button" class="${casa ? 'active' : ''}" data-add-mode="casa" aria-pressed="${casa}">in casa</button>
        </div>
      </div>
      <div class="add-body">
        <div class="add-field${d.scanFlash ? ' scan-flash' : ''}">
          <input type="text" id="add-name" data-add-name placeholder="Es. Zucchine" value="${escapeAttr(d.nome || '')}" aria-label="Nome" autocomplete="off">
          <button type="button" class="add-scan" data-add-scan aria-label="Scansiona il codice a barre">${uiIcon('barcode')}</button>
        </div>
        ${d.scanMsg ? `<div class="scan-result ${d.scanOk ? 'is-ok' : 'is-miss'}" role="status"><span class="scan-result-ic" aria-hidden="true">${d.scanOk ? '✓' : '!'}</span><span>${escapeHtml(d.scanMsg)}</span></div>` : ''}
        ${suggHtml}
        <div class="add-qty-row">
          <span class="add-field-label">${presence ? 'Ce l\'hai?' : 'Quantità'}</span>
          ${presence ? `<span class="seg sheet-seg" role="group" aria-label="Ce l'hai?"><button type="button" class="${d.qty > 0 ? 'active' : ''}" data-add-presence="1" aria-pressed="${d.qty > 0}"><i class="seg-dot is-ok"></i>In casa</button><button type="button" class="${d.qty > 0 ? '' : 'active'}" data-add-presence="0" aria-pressed="${!(d.qty > 0)}"><i class="seg-dot is-no"></i>Finito</button></span>` : `<span class="qty-stepper">
            <button class="qty-btn" type="button" data-add-qty="-1" aria-label="Diminuisci">−</button>
            <input type="number" min="0" step="${step}" class="qty-input" id="add-qty" data-add-qty-input value="${d.qty > 0 ? d.qty : ''}" placeholder="–" aria-label="Quantità">
            <button class="qty-btn" type="button" data-add-qty="1" aria-label="Aumenta">+</button>
          </span>
          <select class="add-unit" data-add-unit aria-label="Unità">${units.map(u=>`<option value="${u}" ${unit===u?'selected':''}>${escapeHtml(UNIT_SHORT[u] || u)}</option>`).join('')}</select>`}
        </div>
        <button type="button" class="add-details-toggle" data-add-details aria-expanded="${a.detailsOpen}">Altri dettagli: <b>${escapeHtml(addSheetSummary(a))}</b> <span class="add-chev" aria-hidden="true">${a.detailsOpen ? '⌃' : '⌄'}</span></button>
        ${detail}
      </div>
      <div class="move-footer add-footer"><button type="button" class="btn is-solid" data-add-confirm>${name ? 'Aggiungi ' + escapeHtml(name.toLowerCase()) : 'Aggiungi'}</button></div>
    </div>
  </div>`;
}
function addSheetCommit(){
  const a = state.addSheet; if(!a) return;
  const d = a.d, nome = (d.nome || '').trim();
  if(!nome){ const inp = document.getElementById('add-name'); if(inp) inp.focus(); return; }
  if(a.mode === 'casa'){ commitPantryDraft(d); return; }
  // alla Spesa
  const per = a.per === '__new' ? (a.perNew || '').trim() : a.per;
  if(a.per === '__new' && !per){ const p = document.querySelector('[data-add-per-new]'); if(p) p.focus(); return; }
  const unit = d.unit && d.unit !== 'none' ? d.unit : '';
  const qta = d.qty > 0 ? `${d.qty}${unit ? ' ' + unit : ''}` : '';
  const snap = JSON.parse(JSON.stringify({ e: state.shopExtras, d: state.shopDismissed, p: state.pantryConfirmedShop, i: state.pantryItems }));
  const pantryKey = nome.toLowerCase();
  const pantryIt = state.pantryItems[pantryKey];
  const catChoice = d.cat || '';
  if(per){
    const id = 'extra_' + Date.now() + '_' + Math.random().toString(36).slice(2,7);
    state.shopExtras[id] = Object.assign({ ingrediente: nome, qta, per }, catChoice ? { cat: catChoice } : {});
  } else if(pantryIt && typeof pantryIt.qty === 'number' && pantryIt.qty <= 0){
    // Finito in Dispensa: si riattiva quella voce (resta un unico record).
    state.pantryConfirmedShop[pantryKey] = qta || true;
    delete state.shopDismissed[`oos_${pantryKey}`];
    if(catChoice) pantryIt.cat = catChoice;
  } else {
    const id = 'extra_' + Date.now() + '_' + Math.random().toString(36).slice(2,7);
    state.shopExtras[id] = catChoice ? { ingrediente: nome, qta, cat: catChoice } : { ingrediente: nome, qta };
    // Ingrediente nuovo: entra subito nell'anagrafica a scorta 0 (categoria,
    // gruppo, luogo e unità scelti qui), in scorta solo quando lo compri.
    if(!pantryIt){
      upsertPantryItem(nome, d.luogo || 'dispensa', 0, unit, catChoice, d.group || '');
      state.shopDismissed[`oos_${pantryKey}`] = true;
    }
  }
  if(d.barcode){
    if(!state.barcodes) state.barcodes = {};
    state.barcodes[d.barcode] = { nome, cat: catChoice, unit: d.unit || '', qty: d.packQty || 0 };
  }
  state.addSheet = null;
  persist(); render();
  showUndoToast(`${nome} aggiunto alla lista`, ()=>{
    state.shopExtras = snap.e; state.shopDismissed = snap.d; state.pantryConfirmedShop = snap.p; state.pantryItems = snap.i;
    persist(); render();
  });
}
document.addEventListener('click', e=>{
  const a = state.addSheet;
  if(!a) return;
  const t = e.target, d = a.d;
  if(a.suggestOpen && !t.closest('.add-suggest') && !t.closest('[data-add-name]')) a.suggestOpen = false;
  if(t.closest('[data-add-bg]') && !t.closest('[data-stop-close]')){ state.addSheet = null; render(); return; }
  const mode = t.closest('[data-add-mode]');
  if(mode){ a.mode = mode.dataset.addMode; render(); return; }
  if(t.closest('[data-add-scan]')){ a.suggestOpen = false; openBarcodeScanner(); return; }
  const pick = t.closest('[data-add-pick]');
  if(pick){ fillDraftFromPantry(d, pick.dataset.addPick); a.suggestOpen = false; if(!a.luogoUser && !existingPantryFor(d.nome)) d.luogo = inventoryGuessLuogo(d.nome, classifyDept(d.nome)); render(); const inp = document.getElementById('add-name'); if(inp) inp.blur(); return; }
  if(t.closest('[data-add-create]')){ a.suggestOpen = false; render(); return; }
  const qtyBtn = t.closest('[data-add-qty]');
  if(qtyBtn){ const step = qtyStepFor(d.unit || '') * parseInt(qtyBtn.dataset.addQty, 10); d.qty = Math.max(0, Math.round(((typeof d.qty === 'number' ? d.qty : 0) + step) * 100) / 100); render(); return; }
  if(t.closest('[data-add-details]')){ a.detailsOpen = !a.detailsOpen; render(); return; }
  const pr = t.closest('[data-add-presence]');
  if(pr){ d.qty = pr.dataset.addPresence === '1' ? 1 : 0; render(); return; }
  if(t.closest('[data-add-scad-clear]')){ d.scadenza = ''; render(); return; }
  const sq = t.closest('[data-add-scad-quick]');
  if(sq){ d.scadenza = addDaysIso(parseInt(sq.dataset.addScadQuick, 10)); render(); return; }
  const lu = t.closest('[data-add-luogo]');
  if(lu){ d.luogo = lu.dataset.addLuogo; a.luogoUser = true; render(); return; }
  if(t.closest('[data-add-confirm]')){ addSheetCommit(); return; }
}, true);
// L'elenco dei suggerimenti si chiude quando il campo nome perde il fuoco (es.
// tocchi la quantità). pointerdown con preventDefault sulle righe: toccando un
// suggerimento il campo non perde il fuoco, così la scelta (al click) funziona.
document.addEventListener('pointerdown', e=>{
  if(state.addSheet && e.target.closest && e.target.closest('.add-suggest')) e.preventDefault();
}, true);
document.addEventListener('focusout', e=>{
  const a = state.addSheet;
  if(!a || !e.target.matches || !e.target.matches('[data-add-name]')) return;
  // Con un po' di ritardo: se chiudessi l'elenco subito, il layout si sposta tra
  // il tocco e il rilascio e il primo tocco su un bottone sotto andrebbe perso.
  setTimeout(()=>{
    if(state.addSheet !== a) return;
    if(document.activeElement && document.activeElement.matches && document.activeElement.matches('[data-add-name]')) return;
    a.suggestOpen = false;
    if(document.querySelector('[data-add-pick],[data-add-create]')) render();
  }, 450);
});
document.addEventListener('keydown', e=>{
  const a = state.addSheet;
  if(a && a.suggestOpen && e.key === 'Escape'){ e.stopPropagation(); a.suggestOpen = false; render(); }
}, true);
document.addEventListener('input', e=>{
  const a = state.addSheet; if(!a) return;
  const t = e.target;
  if(t.matches && t.matches('[data-add-name]')){
    a.d.nome = t.value; a.suggestOpen = true; a.d.scanMsg = ''; a.d.scanOk = false;
    if(!a.luogoUser && !existingPantryFor(t.value)) a.d.luogo = inventoryGuessLuogo(t.value, classifyDept(t.value));
    render();
  } else if(t.matches && t.matches('[data-add-qty-input]')){
    const n = parseFloat(String(t.value).replace(',', '.')); a.d.qty = Number.isNaN(n) ? 0 : Math.max(0, n);
  } else if(t.matches && t.matches('[data-add-per-new]')){ a.perNew = t.value; }
});
document.addEventListener('change', e=>{
  const a = state.addSheet; if(!a) return;
  const t = e.target; if(!t.matches) return;
  if(t.matches('[data-add-unit]')){ a.d.unit = t.value; render(); }
  else if(t.matches('[data-add-count]')){
    if(t.value === 'none'){ a.d.unit = 'none'; a.d.qty = a.d.qty > 0 ? 1 : 0; if(!(a.d.qty > 0)) a.d.qty = 1; }
    else { if(a.d.unit === 'none') a.d.unit = ''; if(!(a.d.qty > 0)) a.d.qty = 1; }
    render();
  }
  else if(t.matches('[data-add-cat]')){ a.d.cat = t.value; render(); }
  else if(t.matches('[data-add-group]')){ a.d.group = t.value; }
  else if(t.matches('[data-add-per]')){ a.per = t.value; render(); }
  else if(t.matches('[data-add-scad]')){ a.d.scadenza = t.value; render(); }
  else if(t.matches('[data-add-name]')){
    // scritto a mano il nome di una voce che c'è già: stessi dati che se l'avessi scelta dall'elenco
    if(existingPantryFor(a.d.nome)){ fillDraftFromPantry(a.d, a.d.nome.trim()); render(); }
  }
});
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
  d.scadenza = ''; // la data della nuova confezione: quella già in casa resta (vedi lotti)
  if(d.unit === 'none') d.qty = 1;
  d.home = isNonFoodDept(knownDept(d.cat) || classifyDept(d.nome));
}
// --- Codice a barre ---------------------------------------------------------
// "Scansiona il codice a barre" nella scheda Aggiungi: la fotocamera legge
// l'EAN (BarcodeDetector, Chrome su Android), il nome si cerca su Open Food
// Facts (gratuito, senza registrazione) e compila la scheda. I prodotti già
// scansionati si ricordano col nome scelto da te (state.barcodes), anche
// senza rete. Dove la fotocamera o il lettore non ci sono, si scrive il numero.
const BARCODE_FORMATS = ['ean_13', 'ean_8', 'upc_a', 'upc_e'];
let scannerStream = null, scannerTimer = null;
// "500 g", "1,5 l", "6 x 125 g", "33 cl" -> { qty, unit } nelle unità dell'app.
function parsePackQuantity(text){
  const t = String(text || '');
  // Peso o volume, anche dentro altre parole ("Peso netto 500 g", "4 x 125 g (500 g)").
  const m = /(?:(\d+)\s*[x×]\s*)?(\d+(?:[.,]\d+)?)\s*(kg|g|ml|cl|l)\b/i.exec(t);
  if(m){
    let qty = parseFloat(m[2].replace(',', '.')) * (m[1] ? parseInt(m[1], 10) : 1);
    let unit = m[3].toLowerCase();
    if(unit === 'cl'){ qty *= 10; unit = 'ml'; }
    if(qty > 0) return { qty: Math.round(qty * 100) / 100, unit };
  }
  // A pezzi ("6 uova", "10 bustine").
  const p = /(\d+)\s*(?:pz|pezzi|uova|bustine|capsule|fette|bastoncini|biscotti|panini|filtri|rotoli)\b/i.exec(t);
  if(p && parseInt(p[1], 10) > 0) return { qty: parseInt(p[1], 10), unit: '' };
  return null;
}
async function lookupBarcode(code){
  const known = (state.barcodes || {})[code];
  if(known) return { nome: known.nome, cat: known.cat || '', unit: known.unit || '', qty: known.qty || 0, remembered: true };
  const ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = ctl ? setTimeout(() => ctl.abort(), 8000) : null;
  try{
    const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(code)}.json?fields=product_name,product_name_it,generic_name_it,quantity`, ctl ? { signal: ctl.signal } : undefined);
    if(!res.ok) return res.status === 404 ? null : { failed: true };
    const data = await res.json();
    const p = data && data.status === 1 && data.product;
    if(!p) return null;
    let nome = (p.product_name_it || p.product_name || p.generic_name_it || '').trim();
    if(!nome) return null;
    nome = nome.charAt(0).toUpperCase() + nome.slice(1);
    const pack = parsePackQuantity(p.quantity);
    return { nome, cat: '', unit: pack ? pack.unit : '', qty: pack ? pack.qty : 0, remembered: false, noPack: !pack };
  }catch(e){ return { failed: true }; }
  finally{ if(timer) clearTimeout(timer); }
}
function applyScannedProduct(code, product){
  const d = state.addSheet ? state.addSheet.d : state.pantryDraft; if(!d) return;
  d.barcode = code;
  if(!product || product.failed){
    d.scanOk = false;
    d.scanMsg = product && product.failed
      ? 'Codice letto, ma non riesco a cercare il prodotto (internet?): scrivi il nome, lo ricorderò per la prossima volta.'
      : 'Prodotto non riconosciuto: scrivi il nome, lo ricorderò per la prossima volta.';
    d.scanFlash = false;
    return;
  }
  fillDraftFromPantry(d, product.nome);
  if(product.cat) d.cat = product.cat;
  if(!existingPantryFor(product.nome) && product.qty > 0 && UNIT_ORDER.includes(product.unit || '')){
    d.unit = product.unit || '';
    d.qty = product.qty;
  }
  d.packQty = product.qty || 0;
  d.scanOk = true;
  d.scanFlash = true;
  const pack = product.qty > 0 ? ` · ${product.qty} ${UNIT_SHORT[product.unit || ''] || product.unit}` : '';
  d.scanMsg = `${product.remembered ? 'Riconosciuto' : 'Trovato'}: ${product.nome}${pack}.${product.noPack ? ' Quantità non indicata sul prodotto: scrivila tu.' : ' Controlla e aggiungi.'}`;
}
function closeBarcodeScanner(){
  clearInterval(scannerTimer); scannerTimer = null;
  if(scannerStream){ scannerStream.getTracks().forEach(t => t.stop()); scannerStream = null; }
  const ov = document.getElementById('scan-overlay'); if(ov) ov.remove();
  state.scannerOpen = false;
}
function openBarcodeScanner(){
  closeBarcodeScanner();
  state.scannerOpen = true;
  const ov = document.createElement('div');
  ov.className = 'scan-overlay'; ov.id = 'scan-overlay';
  ov.innerHTML = `
    <div class="scan-head"><button type="button" class="btn is-icon" id="scan-close" aria-label="Chiudi">✕</button><span>Inquadra il codice a barre</span></div>
    <div class="scan-view"><video id="scan-video" playsinline muted></video><div class="scan-frame"></div></div>
    <p class="scan-msg" id="scan-msg"></p>
    <div class="scan-manual"><input type="text" inputmode="numeric" id="scan-code" placeholder="Oppure scrivi il numero" autocomplete="off"><button type="button" class="btn is-solid" id="scan-go">Cerca</button></div>`;
  document.body.appendChild(ov);
  const msg = t => { const el = document.getElementById('scan-msg'); if(el) el.textContent = t; };
  let found = false;
  const finish = async code => {
    code = String(code || '').replace(/\D/g, '');
    if(found || !code) return;
    found = true;
    // Feedback subito: si ferma l'immagine, il riquadro diventa verde e il
    // telefono vibra; la finestra resta aperta finché non ho il prodotto.
    clearInterval(scannerTimer); scannerTimer = null;
    const v = document.getElementById('scan-video'); if(v) v.pause();
    ov.classList.add('is-found');
    msg(`✓ Codice letto: ${code}`);
    try{ if(navigator.vibrate) navigator.vibrate(60); }catch(e){}
    await new Promise(res => setTimeout(res, 500));
    msg('Cerco il prodotto…');
    const product = await lookupBarcode(code);
    if(!product || product.failed){
      // Niente da compilare: lo si dice qui, in rosso, prima di chiudere.
      ov.classList.remove('is-found'); ov.classList.add('is-miss');
      msg(product && product.failed ? 'Non riesco a cercare il prodotto: controlla internet' : 'Prodotto non riconosciuto');
      await new Promise(res => setTimeout(res, 1600));
    }
    closeBarcodeScanner();
    const scanDraft = state.addSheet ? state.addSheet.d : state.pantryDraft;
    if(scanDraft) applyScannedProduct(code, product);
    if(state.addSheet) state.addSheet.suggestOpen = false;
    render();
    if(scanDraft && !scanDraft.scanOk){ const nm = document.getElementById(state.addSheet ? 'add-name' : 'pantry-add-name'); if(nm) nm.focus(); }
    if(scanDraft) setTimeout(()=>{ scanDraft.scanFlash = false; }, 1600);
  };
  document.getElementById('scan-close').addEventListener('click', ()=>{ closeBarcodeScanner(); render(); });
  const go = ()=>{ const v = (document.getElementById('scan-code').value || '').replace(/\D/g, ''); if(v.length >= 6) finish(v); else msg('Scrivi tutte le cifre del codice.'); };
  document.getElementById('scan-go').addEventListener('click', go);
  document.getElementById('scan-code').addEventListener('keydown', e=>{ if(e.key === 'Enter') go(); });
  render(); // registra la finestra per il tasto Indietro del telefono
  if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){ msg('La fotocamera non è disponibile: scrivi il numero.'); return; }
  navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false }).then(stream=>{
    if(!state.scannerOpen){ stream.getTracks().forEach(t => t.stop()); return; }
    scannerStream = stream;
    const video = document.getElementById('scan-video');
    video.srcObject = stream; video.play().catch(()=>{});
    if(!('BarcodeDetector' in window)){ msg('Questo browser non legge i codici: scrivi il numero.'); return; }
    const detector = new BarcodeDetector({ formats: BARCODE_FORMATS });
    let busy = false;
    scannerTimer = setInterval(async ()=>{
      if(busy || !video.videoWidth) return;
      busy = true;
      try{ const found = await detector.detect(video); if(found.length) finish(found[0].rawValue); }catch(e){}
      busy = false;
    }, 250);
  }).catch(()=> msg('Non riesco ad aprire la fotocamera: scrivi il numero.'));
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
// Ricette che usano un ingrediente (stesso nome a meno di maiuscole/accenti,
// anche come voce di un'alternativa o di una parentesi: vedi
// manageableIngredientNames). Serve a sapere dove è usato prima di eliminarlo.
function recipeNamesUsingIngredient(name){
  const k = ingMatchKey(name);
  if(!k) return [];
  return allRecipeMetas().filter(r => getIngredientsFor(r.nome).some(it => it.ingrediente && (ingMatchKey(it.ingrediente) === k || manageableIngredientNames(it.ingrediente).some(n => ingMatchKey(n) === k)))).map(r => r.nome).sort((x, y) => IT_COLLATOR.compare(x, y));
}
function renderIngredientSheet(it, isNew){
  const sheetKey = 'sheet-' + (isNew ? 'new' : state.pantryEditKey);
  const entering = pageEntering(sheetKey);
  const home = sheetIsHome(it, isNew);
  const noun = home ? 'prodotto' : 'ingrediente';
  const unit = it.unit || '';
  const picker = state.pantrySheetPicker;
  const closeAttr = isNew ? 'data-close-pantry-add-modal' : 'data-close-pantry-edit';
  // Unità accanto alla quantità: un tocco apre un piccolo elenco (come il luogo
  // nelle righe di Dispensa) per cambiarla senza uscire dalla scheda.
  const unitChoices = (home ? HOME_UNITS.concat(unit && !HOME_UNITS.includes(unit) ? [unit] : []) : UNIT_ORDER).filter(u => u !== 'none');
  const unitPickerHtml = `
      <span class="unit-anchor">
        <button type="button" class="sheet-unit-btn" data-sheet-picker="unit" aria-haspopup="listbox" aria-expanded="${picker === 'unit'}" aria-label="Unità di misura: ${escapeAttr(UNIT_SHORT[unit] || unit)}">${escapeHtml(unit === 'none' ? 'solo c\'è' : (UNIT_SHORT[unit] || unit))} <span aria-hidden="true">▾</span></button>
        ${picker === 'unit' ? `
        <div class="luogo-picker-backdrop" data-sheet-picker-close></div>
        <div class="unit-picker" role="listbox" aria-label="Unità di misura">
          ${unitChoices.map(u => `<button type="button" class="unit-picker-opt${unit === u ? ' active' : ''}" role="option" aria-selected="${unit === u}" data-sheet-unit="${u}">${escapeHtml(UNIT_SHORT[u] || u)}</button>`).join('')}
        </div>` : ''}
      </span>`;
  const qtyHtml = unit === 'none'
    ? `<span class="seg sheet-seg" role="group" aria-label="Ce l'hai?"><button type="button" class="${it.qty > 0 ? 'active' : ''}" data-sheet-presence-set="1" aria-pressed="${it.qty > 0}"><i class="seg-dot is-ok"></i>In casa</button><button type="button" class="${it.qty > 0 ? '' : 'active'}" data-sheet-presence-set="0" aria-pressed="${!(it.qty > 0)}"><i class="seg-dot is-no"></i>Finito</button></span>`
    : `<span class="qty-stepper sheet-stepper">
        <button class="qty-btn" type="button" data-sheet-qty="-1" aria-label="Diminuisci">−</button>
        <input type="number" inputmode="decimal" min="0" step="${qtyStepFor(unit)}" class="qty-input" id="pantry-edit-qty" value="${it.qty}" aria-label="Quantità">
        <button class="qty-btn" type="button" data-sheet-qty="1" aria-label="Aumenta">+</button>
        ${unitPickerHtml}
      </span>`;
  const luoghi = LUOGO_ORDER.map(l=>`<button type="button" class="sheet-luogo${(it.luogo||'dispensa')===l?' active':''}" data-sheet-luogo="${l}" aria-pressed="${(it.luogo||'dispensa')===l}"><span class="sheet-luogo-icon">${LUOGO_ICON[l]}</span><span>${escapeHtml(LUOGO_LABEL[l])}</span></button>`).join('');
  const days = it.scadenza ? daysUntilDate(it.scadenza) : null;
  const existingForNew = isNew ? existingPantryFor(it.nome) : null;
  const addsLot = !!(existingForNew && typeof existingForNew.qty === 'number' && existingForNew.qty > 0 && unit !== 'none');
  const canLots = !isNew && !home && typeof it.qty === 'number' && it.qty > 0; // anche per "solo se c'è": un'altra confezione con un'altra data
  const lotsHtml = (canLots && Array.isArray(it.lots)) ? `
        <div class="settings-field">
          <div class="settings-field-label">Scadenze <span class="sheet-hint-inline">una per confezione</span></div>
          <div class="lots-list">
            ${it.lots.map((l, i) => `
            <div class="lot-row">
              ${unit === 'none' ? `<span class="lot-unit lot-n">Confezione ${i + 1}</span>` : `<input type="number" inputmode="decimal" min="0" step="${qtyStepFor(unit)}" class="lot-qty" data-lot-qty="${i}" value="${l.qty}" aria-label="Quantità della confezione ${i + 1}">
              <span class="lot-unit">${escapeHtml(UNIT_SHORT[unit] || unit)}</span>`}
              <input type="date" class="lot-date" data-lot-date="${i}" value="${escapeAttr(l.scadenza || '')}" aria-label="Scadenza della confezione ${i + 1}">
              <button type="button" class="btn is-icon lot-remove" data-lot-remove="${i}" aria-label="Togli questa confezione">✕</button>
              <span class="lot-badge">${l.scadenza ? expiryBadgeHtml(daysUntilDate(l.scadenza), l.scadenza) : '<span class="sheet-hint-inline">nessuna scadenza</span>'}</span>
            </div>`).join('')}
          </div>
          <button type="button" class="btn is-outline is-block" data-lot-add>+ Altra scadenza</button>
        </div>` : '';
  const frozenHtml = (!isNew && !home && it.luogo === 'freezer' && it.frozenOn !== undefined) ? `
        <div class="settings-field">
          <div class="settings-field-label">Congelato il ${it.frozenOn ? '' : '<span class="sheet-hint-inline">data non nota</span>'}</div>
          <div class="chip-row">
            <label class="btn is-chip sheet-date-chip">${uiIcon('calendar')} ${it.frozenOn ? escapeHtml(frozenOnShort(it.frozenOn)) : 'Data…'}<input type="date" id="pantry-edit-frozen" value="${escapeAttr(it.frozenOn || '')}" aria-label="Data di congelamento"></label>
          </div>
          ${it.freezerExp ? '<div class="sheet-hint-inline">La scadenza qui sotto è una stima per il freezer: la puoi cambiare.</div>' : ''}
          ${it.frozenMeal && freezeTipFor(it.nome) ? `<div class="sheet-hint-inline freeze-tip"><b>Come usarla:</b> ${escapeHtml(freezeTipFor(it.nome))}</div>` : ''}
        </div>` : '';
  const scadenzaHtml = home ? '' : frozenHtml + (lotsHtml || `
        <div class="settings-field">
          <div class="settings-field-label">${addsLot ? 'Scadenza della nuova confezione' : 'Scadenza'} ${it.scadenza ? expiryBadgeHtml(days, it.scadenza) : '<span class="sheet-hint-inline">nessuna</span>'}</div>
          <div class="chip-row scadenza-quick">
            <button type="button" class="btn is-chip${it.scadenza ? '' : ' active'}" data-scadenza-clear>Nessuna</button>
            ${[3, 7, 30].map(n => { const iso = addDaysIso(n); return `<button type="button" class="btn is-chip${it.scadenza === iso ? ' active' : ''}" data-scadenza-quick="${n}">${escapeHtml(frozenOnShort(iso))}</button>`; }).join('')}
            ${it.scadenza && ![3, 7, 30].some(n => addDaysIso(n) === it.scadenza) ? `<button type="button" class="btn is-chip active" aria-pressed="true">${escapeHtml(frozenOnShort(it.scadenza))}</button>` : ''}
            <label class="btn is-chip sheet-date-chip">${uiIcon('calendar')} Altra data<input type="date" id="pantry-edit-scadenza" value="${escapeAttr(it.scadenza || '')}" aria-label="Scegli la data di scadenza"></label>
          </div>
          ${canLots ? '<button type="button" class="btn is-text lot-add-link" data-lot-add>+ Altra scadenza (un\'altra confezione)</button>' : ''}
        </div>`);
  // Righe che si aprono in un elenco (categoria, gruppo), una alla volta.
  const pickRow = (key, label, valueHtml, sub) => `
        <button type="button" class="sheet-row${sub ? ' has-sub' : ''}" data-sheet-picker="${key}" aria-expanded="${picker === key}">
          <span class="sheet-row-label">${label}${sub ? `<small>${sub}</small>` : ''}</span>
          <span class="sheet-row-value" ${key === 'cat' ? 'id="sheet-cat-value"' : ''}>${valueHtml}</span>
          <span class="sheet-row-chevron${picker === key ? ' is-open' : ''}" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg></span>
        </button>`;
  const deptList = DEPT_ORDER.filter(d => d !== 'finiti' && d !== 'avanzi' && (home ? isNonFoodDept(d) : !isNonFoodDept(d)))
    .sort((a, b) => IT_COLLATOR.compare(DEPT_LABEL[a], DEPT_LABEL[b]));
  const autoDept = classifyDept(it.nome || '');
  const catPicker = picker !== 'cat' ? '' : `
        <div class="sheet-options" role="listbox" aria-label="Categoria">
          <button type="button" class="sheet-option${it.cat ? '' : ' active'}" data-sheet-cat="">${uiIcon('wand')} Automatica <span class="sheet-hint-inline">(${escapeHtml(DEPT_LABEL[home && !isNonFoodDept(autoDept) ? 'altro-casa' : autoDept])})</span></button>
          ${deptList.map(d => `<button type="button" class="sheet-option${it.cat === d ? ' active' : ''}" data-sheet-cat="${d}">${DEPT_ICON[d]} ${escapeHtml(DEPT_LABEL[d])}</button>`).join('')}
          <button type="button" class="sheet-option is-muted" data-sheet-cat="${home ? 'altro' : 'altro-casa'}">${uiIcon('swap')} ${home ? 'È un alimento (sposta in Cibo)' : 'È un prodotto per la casa (sposta in Casa)'}</button>
          <button type="button" class="sheet-option is-link" data-open-depts>${uiIcon('tag')} Gestisci categorie…</button>
        </div>`;
  const modePicker = picker !== 'mode' ? '' : `
        <div class="sheet-options" role="listbox" aria-label="Come lo conti">
          <button type="button" class="sheet-option${unit === 'none' ? '' : ' active'}" data-sheet-mode="qty">A quantità <span class="sheet-hint-inline">(pezzi, g, ml…)</span></button>
          <button type="button" class="sheet-option${unit === 'none' ? ' active' : ''}" data-sheet-mode="none">Solo se c'è <span class="sheet-hint-inline">(ce l'hai o l'hai finito)</span></button>
        </div>`;
  const groups = Object.entries(state.pantryGroups);
  const groupPicker = picker !== 'group' ? '' : `
        <div class="sheet-options" role="listbox" aria-label="Gruppo">
          <button type="button" class="sheet-option${it.group ? '' : ' active'}" data-sheet-group="">Nessuno</button>
          ${groups.map(([id, g]) => `<button type="button" class="sheet-option${it.group === id ? ' active' : ''}" data-sheet-group="${escapeAttr(id)}">${escapeHtml(g.label)}</button>`).join('')}
          <button type="button" class="sheet-option is-link" data-open-pantry-groups>${uiIcon('category')} Gestisci gruppi…</button>
        </div>`;
  const more = !!state.pantrySheetMore;
  return `
  <div class="sheet-page${entering ? ' is-entering' : ''}" data-sheet-page>
    <header class="settings-header">
      <button class="btn is-icon settings-back" type="button" ${closeAttr} aria-label="Indietro"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 256 256" width="100%" height="100%"><path fill="currentColor" d="M165.66 202.34a8 8 0 0 1-11.32 11.32l-80-80a8 8 0 0 1 0-11.32l80-80a8 8 0 0 1 11.32 11.32L91.31 128Z"></path></svg></button>
      <h2 class="settings-title">${isNew ? `Aggiungi ${noun}` : `Modifica ${noun}`}</h2>
    </header>
    <div class="settings-body sheet-body">
      <section class="settings-section">
        <div class="settings-card">
          ${isNew ? '<div class="add-ing-combo">' : ''}<input type="text" class="sheet-name${it.scanFlash ? ' scan-flash' : ''}" id="${isNew ? 'pantry-add-name' : 'pantry-edit-name'}" value="${escapeAttr(it.nome)}" placeholder="${home ? 'Es. Detersivo piatti' : 'Es. Zucchine'}" aria-label="Nome" autocomplete="off">${isNew ? '<div class="add-ing-suggestions" id="pantry-add-suggest"></div></div>' : ''}
          ${isNew ? `${it.scanMsg ? `<div class="scan-result ${it.scanOk ? 'is-ok' : 'is-miss'}" role="status"><span class="scan-result-ic" aria-hidden="true">${it.scanOk ? '✓' : '!'}</span><span>${escapeHtml(it.scanMsg)}</span></div>` : ''}` : ''}
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
          ${pickRow('mode', 'Come lo conti', unit === 'none' ? 'Solo se c\'è' : 'A quantità')}
          ${modePicker}
          ${pickRow('cat', 'Reparto', sheetDeptLabelHtml(it, home))}
          ${catPicker}
          ${home ? '' : pickRow('group', 'Equivalenti', it.group && state.pantryGroups[it.group] ? escapeHtml(state.pantryGroups[it.group].label) : 'nessuno', 'Es. Fusilli e Penne = Pasta corta')}
          ${groupPicker}
        </div>
      </section>
      ${isNew || home ? '' : (() => { const used = recipeNamesUsingIngredient(it.nome); const open = !!state.pantrySheetUsed && used.length > 0; return `<section class="settings-section">
        ${used.length ? `<button type="button" class="sheet-more-toggle" data-sheet-used aria-expanded="${open}">Usato in ${used.length} ${used.length === 1 ? 'ricetta' : 'ricette'} <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="${open ? 'transform:rotate(180deg)' : ''}"><path d="m6 9 6 6 6-6"/></svg></button>
        ${open ? `<div class="settings-card"><ul class="ing-used-list">${used.map(n => `<li>${escapeHtml(n)}</li>`).join('')}</ul></div>` : ''}` : `<p class="settings-note">Non è in nessuna ricetta.</p>`}
      </section>`; })()}
      ${isNew || home ? '' : (() => {
        const k = ingMatchKey(it.nome), fixed = INGREDIENT_VARIANT_OPTIONS[k] || [], custom = ((state.ingredientVariants || {})[k] || []).filter(v => !fixed.includes(v));
        return `<section class="settings-section">
        <h3 class="settings-section-title">Specifiche</h3>
        <div class="settings-card">
          <p class="settings-note">Se di questo ingrediente usi o hai solo una parte (es. il succo del limone), scegli cosa hai in casa o aggiungi una specifica: nelle ricette la scegli per riga, e in Spesa compri comunque ${escapeHtml(it.nome)}.</p>
          ${fixed.length || custom.length ? (() => {
            const all = [''].concat(fixed, custom), cur = it.spec || '';
            const exists = v => !!state.pantryItems[pantryKeyFor(it.nome, v)];
            const label = v => v || 'Intero';
            const others = all.filter(v => v !== cur && !exists(v));
            return `<div class="gen-label-sm">Questa voce è</div><div class="chip-row variant-chips">
            ${all.map(v => { const taken = v !== cur && exists(v); return `<button type="button" class="btn is-chip${cur === v ? ' active' : ''}" data-have-spec="${escapeAttr(v)}" aria-pressed="${cur === v}"${taken ? ' disabled title="Ce l\'hai già come voce a parte"' : ''}>${escapeHtml(label(v))}${v && custom.includes(v) ? ` <span class="chip-x" data-variant-del="${escapeAttr(v)}" role="button" aria-label="Togli ${escapeAttr(v)}">✕</span>` : ''}</button>`; }).join('')}
          </div>${others.length ? `<div class="gen-label-sm">Hai anche</div><div class="chip-row variant-chips">${others.map(v => `<button type="button" class="btn is-chip" data-add-spec-sibling="${escapeAttr(v)}">+ ${escapeHtml(label(v))}</button>`).join('')}</div>` : ''}`; })() : ''}
          <div class="sheet-variant-add"><input type="text" id="variant-new-input" placeholder="Nuova specifica (es. succo)" autocomplete="off"><button type="button" class="btn is-outline" data-variant-add>Aggiungi</button></div>
        </div>
      </section>`; })()}
      ${isNew ? '' : `<section class="settings-section">
        <button type="button" class="sheet-more-toggle" data-sheet-more aria-expanded="${more}">Altro <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="${more ? 'transform:rotate(180deg)' : ''}"><path d="m6 9 6 6 6-6"/></svg></button>
        ${more ? `
        <div class="settings-card">
          <div class="settings-field">
            <button type="button" class="btn is-outline is-block" data-open-merge="${escapeAttr(it.nome)}">${uiIcon('link')} Unisci con un doppione…</button>
            <button type="button" class="btn is-outline is-block color-delete" id="pantry-edit-delete">Elimina dalla Dispensa</button>
          </div>
        </div>` : ''}
      </section>`}
    </div>
    <div class="sheet-footer">
      ${isNew
        ? `<div class="edit-footer"><button type="button" class="btn is-outline scan-open-btn" data-scan-barcode>${uiIcon('barcode')} Scansiona</button><button class="btn is-solid" id="pantry-add-btn" type="button">Aggiungi</button></div>`
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
        ${isNew ? '' : `<button type="button" class="manage-edit-head" data-dept-edit-cancel aria-expanded="true"><span>${escapeHtml(d.label || DEPT_LABEL[id] || '')}</span>${CHEV_UP_SVG}</button>`}
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
        <span class="manage-row-chevron" aria-hidden="true">${CHEV_DOWN_SVG}</span>
      </button>`;
  const section = (title, ids) => `
      <section class="settings-section">
        <h3 class="settings-section-title">${title}</h3>
        <div class="settings-card manage-list">${ids.map(row).join('')}</div>
      </section>`;
  const body = `
      <p class="settings-note manage-intro">Sono i reparti della Spesa e le sezioni della Dispensa. Tocca un reparto per cambiargli nome o emoji.</p>
      <section class="settings-section">
        <div class="settings-card is-links">
          <button type="button" class="settings-link" data-settings-go="aisles"><span class="settings-link-ico" data-ico="sort"></span><span class="settings-link-text">Ordine nel supermercato<small>L'ordine dei reparti nella lista della spesa</small></span></button>
          <button type="button" class="settings-link" data-settings-go="expiry"><span class="settings-link-ico" data-ico="calendar"></span><span class="settings-link-text">Scadenze stimate<small>Quanti giorni durano i freschi</small></span></button>
        </div>
      </section>
      <section class="settings-section">
        ${editing === 'new' ? `<div class="settings-card">${deptEditCardHtml('new')}</div>` : `<button type="button" class="btn is-outline is-block" data-dept-edit="new">+ Nuovo reparto</button>`}
      </section>
      ${section('Cibo', sorted.filter(d => !isNonFoodDept(d)))}
      ${section('Casa', sorted.filter(isNonFoodDept))}`;
  return managePageHtml({ key: 'depts', title: 'Reparti', closeAttr: 'data-close-depts', body });
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
  const members = isNew ? [] : groupMemberKeys(id).map(k => [k, { nome: groupMemberLabel(k) }]).sort((a, b) => IT_COLLATOR.compare(a[1].nome, b[1].nome));
  const q = (state.groupMemberSearch || '').trim().toLowerCase();
  const candidates = !q ? [] : Object.entries(state.pantryItems)
    .filter(([, it]) => it.group !== id && !isNonFoodDept(knownDept(it.cat) || classifyDept(it.nome)) && it.nome.toLowerCase().includes(q))
    .sort((a, b) => IT_COLLATOR.compare(a[1].nome, b[1].nome)).slice(0, 6);
  const exact = q && Object.values(state.pantryItems).some(it => it.nome.toLowerCase() === q);
  return `
      <div class="manage-edit" data-group-edit-card="${escapeAttr(id)}">
        ${isNew ? '' : `<button type="button" class="manage-edit-head" data-group-edit-cancel aria-expanded="true"><span>${escapeHtml(g.label || '')}</span>${CHEV_UP_SVG}</button>`}
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
    const members = groupMemberKeys(id).map(groupMemberLabel).sort((a, b) => IT_COLLATOR.compare(a, b));
    return `
      <button type="button" class="manage-row" data-group-edit="${escapeAttr(id)}">
        <span class="manage-row-icon">${g.cat && DEPT_ICON[g.cat] ? DEPT_ICON[g.cat] : '🗂️'}</span>
        <span class="manage-row-main">${escapeHtml(g.label)}
          <span class="manage-row-sub">${members.length ? escapeHtml(members.join(', ')) : 'nessun formato ancora'}</span></span>
        <span class="manage-row-chevron" aria-hidden="true">${CHEV_DOWN_SVG}</span>
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
      <section class="settings-section">
        <button type="button" class="btn is-outline is-block" data-manage-ingredient-new>+ Nuovo ingrediente</button>
      </section>
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
    .map(([key, it])=>({ key, nome: it.nome, qty: it.qty, unit: it.unit || '', luogo: it.luogo || 'dispensa', cat: it.cat, scadenza: it.scadenza || '', frozenOn: it.frozenOn || '', spec: it.spec || '' }))
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
      ${state.pantryLuogoPicker === it.key ? `
      <div class="luogo-picker-backdrop" data-luogo-picker-close></div>
      <div class="luogo-picker">
        ${LUOGO_ORDER.map(l=>`<button type="button" class="btn is-icon luogo-picker-opt${l===it.luogo?' active':''}" data-luogo-set="${escapeAttr(it.key)}" data-luogo-value="${l}" title="${escapeAttr(LUOGO_LABEL[l])}">${LUOGO_ICON[l]}</button>`).join('')}
      </div>` : ''}
      ${state.pantryFinishPicker === it.key ? `
      <div class="luogo-picker-backdrop" data-finish-picker-close></div>
      <div class="luogo-picker finish-picker" role="dialog" aria-label="${escapeAttr(it.nome)} è finito">
        <button type="button" class="btn is-icon luogo-picker-opt" data-finish-tolist="${escapeAttr(it.key)}" title="Aggiungi alla lista spesa" aria-label="Aggiungi alla lista spesa"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M4 19a2 2 0 1 0 4 0a2 2 0 1 0-4 0m11 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0"/><path d="M17 17H6V3H4"/><path d="m6 5l14 1l-1 7H6"/></g></svg></button>
        <button type="button" class="btn is-icon luogo-picker-opt" data-finish-trash="${escapeAttr(it.key)}" title="Metti tra i Finiti" aria-label="Metti tra i Finiti">${TRASH_ICON_SVG}</button>
      </div>` : ''}
      <div class="inv-main">
      <button class="btn is-text inv-name" data-pantry-edit="${escapeAttr(it.key)}" type="button">${escapeHtml(it.nome)}${it.spec ? `<small class="ing-qual"> · ${escapeHtml(it.spec)}</small>` : ''}</button>
      <span class="inv-tags">
      <button class="btn is-icon luogo-picker-opt is-selected${isSelected ? ' picking' : ''}" data-luogo-value="${escapeAttr(LUOGO_LABEL[it.luogo])}" data-luogo-toggle="${escapeAttr(it.key)}" type="button" title="Luogo: ${escapeAttr(LUOGO_LABEL[it.luogo])}${it.frozenOn ? escapeAttr(` · congelato il ${it.frozenOn}`) : ''} — tocca per scegliere">${luogoIconContent}${it.frozenOn && it.luogo === 'freezer' && !isSelected ? `<span class="luogo-since">dal ${escapeHtml(frozenOnShort(it.frozenOn))}</span>` : ''}</button>
      ${(it.scadenza || (it.frozenOn && it.luogo !== 'freezer')) ? `<button class="btn is-text inv-badges" data-pantry-edit="${escapeAttr(it.key)}" type="button" tabindex="-1" aria-hidden="true">${it.scadenza ? expiryBadgeHtml(daysUntilDate(it.scadenza), it.scadenza) : ''}${it.frozenOn && it.luogo !== 'freezer' ? `<span class="frozen-on" title="Congelato il ${escapeAttr(it.frozenOn)}">dal ${escapeHtml(frozenOnShort(it.frozenOn))}</span>` : ''}</button>` : ''}
      </span>
      </div>
      ${it.unit === 'none'
        ? `<label class="presence-toggle"><input type="checkbox" ${it.qty > 0 ? 'checked' : ''} data-presence-toggle="${escapeAttr(it.key)}"></label>`
        : `<span class="qty-stepper">
        <button class="qty-btn" type="button" data-qty-dec="${escapeAttr(it.key)}" aria-label="Diminuisci">−</button>
        <span class="qty-num${pantryQtyIsLow(it) ? ' low' : ''}" data-qty-show="${escapeAttr(it.key)}">${it.qty}${it.unit ? ' ' + escapeHtml(it.unit) : ''}</span>
        ${editing ? `<div class="qty-pop-backdrop" data-qty-pop-close></div>
        <div class="qty-pop" role="dialog" aria-label="Quantità">
          <div class="qty-pop-row">
            <input type="number" inputmode="decimal" min="0" step="${step}" class="qty-input" value="${it.qty}" data-qty-edit="${escapeAttr(it.key)}" aria-label="Quantità">
            ${state.pantryView === 'casa' ? '' : `<select class="qty-pop-unit-sel" data-qty-unit aria-label="Unità">${['', 'g', 'kg', 'ml', 'l'].map(u=>`<option value="${u}"${(it.unit || '') === u ? ' selected' : ''}>${escapeHtml(UNIT_SHORT[u] || u)}</option>`).join('')}</select>`}
          </div>
          <button type="button" class="btn btn--primary qty-pop-done" data-qty-pop-close>Fatto</button>
        </div>` : ''}
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
        <div class="dept-title"><span class="dept-icon">⏰</span>In scadenza <small class="dept-num">· ${expiring.length}</small></div>
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
          <span class="dept-icon">${iconHtml}</span>${escapeHtml(label)} <small class="dept-num">· ${list.length}</small>
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
  const recurringPage = state.recurringOpen ? renderRecurringPage() : '';

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
      ${(pantryShownCount && ['cat','luogo'].includes(state.pantryGroupBy)) ? `<button type="button" class="btn is-text shop-toggle-all" id="pantry-toggle-all-sections">${Object.values(state.pantrySectionCollapsed).some(v => v) ? 'Apri tutti' : 'Chiudi tutti'}</button>` : '<span></span>'}
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
    ${recurringPage}
    ${editModal}
    ${addModal}
    ${groupsModal}
    ${deptsModal}
    ${mergeModal}
    <div class="buttons-fixed">
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
  document.querySelectorAll('[data-ning], [data-rning]').forEach(el => attachIngredientCombobox(el));
  // Eccezioni delle scadenze stimate: solo ingredienti che esistono già.
  document.querySelectorAll('.expiry-rule-match').forEach(el => attachIngredientCombobox(el, { noCreate: true, pool: allKnownIngredientNames }));

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
    const popEl = document.querySelector('.qty-pop');
    if(popEl){
      const r = popEl.getBoundingClientRect();
      if(r.bottom > window.innerHeight - 90) popEl.classList.add('is-up');
    }
    shopQtyEditInput.focus({ preventScroll: true });
    keepQtyPopVisible();
    shopQtyEditInput.select();
    const popKey = shopQtyEditInput.dataset.shopQtyEdit;
    // Il numero si legge alla chiusura (Fatto o tocco fuori) e quando cambia
    // l'unità: un solo posto, così il fumetto non perde mai quello che hai scritto.
    const readQty = ()=>{
      const n = parseFloat(shopQtyEditInput.value);
      state.shopQty[popKey] = Number.isNaN(n) ? 0 : Math.max(0, n);
    };
    document.querySelectorAll('select[data-shop-qty-unit]').forEach(sel=>{
      sel.addEventListener('change', ()=>{
        readQty();
        if(!state.shopUnit) state.shopUnit = {};
        state.shopUnit[popKey] = sel.value;
        persist(); render();
      });
    });
    document.querySelectorAll('[data-shop-qty-pop-close]').forEach(el=>{
      el.addEventListener('click', ()=>{
        readQty();
        state.shopQtyEditingKey = null;
        persist(); render();
      });
    });
    shopQtyEditInput.addEventListener('keydown', e=>{ if(e.key === 'Enter'){ readQty(); state.shopQtyEditingKey = null; persist(); render(); } });
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
  if(moveToPantryBtn) moveToPantryBtn.addEventListener('click', ()=> openMoveModal());
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
    const perSelect = document.getElementById('shop-add-per');
    const perNewInput = document.getElementById('shop-add-per-new');
    // Il modale si ridisegna a ogni tasto nel nome: quello che hai già scelto
    // negli altri campi va tenuto da parte, altrimenti tornerebbe ai default.
    const saveDraft = ()=>{
      state.addIngDraft = Object.assign({}, state.addIngDraft, {
        qta: qtaInput.value,
        unit: unitSelect ? unitSelect.value : '',
        cat: catSelect ? catSelect.value : '',
        per: perSelect ? perSelect.value : '',
        perNew: perNewInput ? perNewInput.value : '',
        ...(groupSelect ? { group: groupSelect.value } : {}),
        ...(luogoSelect ? { luogo: luogoSelect.value } : {})
      });
    };
    [qtaInput, unitSelect, catSelect, groupSelect, luogoSelect, perNewInput].forEach(el=>{
      if(el) el.addEventListener(el === qtaInput || el === perNewInput ? 'input' : 'change', saveDraft);
    });
    // Cambiare "Per chi" mostra/nasconde il nome e gruppo/luogo: ridisegna.
    if(perSelect) perSelect.addEventListener('change', ()=>{ saveDraft(); if(document.activeElement && document.activeElement.blur) document.activeElement.blur(); /* niente fuoco che torna sul nome */ state.addIngSuggestOpen = false; state.addIngKeepFocus = perSelect.value === '__new' ? 'per' : 'none'; render(); });
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
      const perChoice = perSelect ? perSelect.value : '';
      const per = perChoice === '__new' ? (perNewInput ? perNewInput.value.trim() : '') : perChoice;
      if(perChoice === '__new' && !per){ if(perNewInput) perNewInput.focus(); return; }
      if(per){
        // Per un'altra persona: una riga a sé (anche se lo stesso ingrediente è
        // già in lista per noi), e niente voce nuova nella nostra Dispensa.
        const id = 'extra_' + Date.now() + '_' + Math.random().toString(36).slice(2,7);
        state.shopExtras[id] = Object.assign({ ingrediente: name, qta, per }, catSelect && catSelect.value ? { cat: catSelect.value } : {});
      } else if(pantryIt && typeof pantryIt.qty === 'number' && pantryIt.qty <= 0){
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
      state.addIngKeepFocus = null;
      state.addIngSuggestOpen = true;
      state.addIngCursorPos = e.target.selectionStart;
      render();
    });
    nameInput.addEventListener('focus', ()=>{ state.addIngSuggestOpen = true; });
    // il re-render sostituisce l'input con uno nuovo: rimette a fuoco e
    // ripristina la posizione del cursore, altrimenti si perderebbero a ogni tasto.
    // (tranne dopo "Per chi": lì il fuoco non deve tornare sul nome.)
    const keepFocus = state.addIngKeepFocus;
    if(keepFocus === 'per'){ const pn = document.getElementById('shop-add-per-new'); if(pn) pn.focus(); }
    else if(!keepFocus && document.activeElement !== nameInput){
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
  if(spesaFab) onFastTap(spesaFab, ()=>{ if(!state.addSheet) openAddSheet('spesa'); });
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
      const anyCollapsed = sectionEls.length ? Array.from(sectionEls).some(el=>!el.classList.contains('open')) : (finitiEls.length > 0 && !state.shopFinitiOpen);
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

  const activeCourseChip = document.querySelector('.dish-course-chips .active');
  if(activeCourseChip && state.dishPicker) activeCourseChip.scrollIntoView({ inline: 'center', block: 'nearest' });
  document.querySelectorAll('[data-open-swap]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      // "Cambia piatto", "Aggiungi piatto" e "Scegli una ricetta" (pasto vuoto) sono lo stesso foglio.
      const key = e.currentTarget.dataset.openSwap;
      const pm = parseMealKey(key);
      if(pm.meal !== 'pranzo' && pm.meal !== 'cena') return;
      const cur = effectiveMeal(pm.weekIdx, pm.i, pm.meal).principale;
      state.dishPicker = { key, replace: cur || null, tipo: null, search: '' };
      state.swapOpenDay = null; state.linkPickerOpenDay = null; state.avanzoDiPickerOpenDay = null;
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
      if(state.dayLinks[targetKey] !== sourceKey) bumpSourcePortions(sourceKey, +leftoverPortionsN());
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
      if(state.dayLinks[targetKey] !== sourceKey) bumpSourcePortions(sourceKey, +leftoverPortionsN());
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
      const prevSrcPortions = prevLink ? state.dayPortions[prevLink] : undefined;
      clearDayLink(key);
      if(prevLink) bumpSourcePortions(prevLink, -leftoverPortionsN());
      persist(); render();
      showUndoToast('Pasto scollegato dall\'avanzo', ()=>{
        if(prevLink !== undefined) state.dayLinks[key] = prevLink;
        if(prevNote !== undefined) state.dayLinkNotes[key] = prevNote;
        if(prevPortions !== undefined) state.dayPortions[key] = prevPortions;
        if(prevLink){ if(prevSrcPortions !== undefined) state.dayPortions[prevLink] = prevSrcPortions; else delete state.dayPortions[prevLink]; }
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
    const trashEl = wrap && wrap.querySelector('.meal-block-trash');
    function setTx(px){ block.style.transform = px ? `translateX(${px}px)` : ''; if(trashEl) trashEl.style.width = px ? `${px}px` : ''; }
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
        // Già tra gli "Aggiunti a mano": se era stato comprato o tolto (la riga
        // resta salvata ma nascosta) va rimessa in vista, non saltata.
        const sameId = Object.keys(state.shopExtras).find(id => !state.shopExtras[id].per && state.shopExtras[id].ingrediente.trim().toLowerCase() === it.ingrediente.trim().toLowerCase());
        if(sameId){
          if(state.shopDismissed[sameId]){
            delete state.shopDismissed[sameId];
            state.shopChecked[sameId] = false;
            if(it.qta) state.shopExtras[sameId].qta = it.qta;
          }
          return;
        }
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
      // "Anche la settimana prossima": la seconda si genera subito dopo, sapendo cosa c'è nella prima,
      // e usa le porzioni che hai in freezer.
      if(state.genTwoWeeks && weekIdx === 0){ generateWeek(1); placeFreezerMeals(1, 2); }
      const usedText = used.length ? ` · usa ${used.slice(0, 2).join(' e ')}${used.length > 2 ? ` e altri ${used.length - 2}` : ''} prima che scada${used.length > 1 ? 'no' : ''}` : '';
      const pantryText = state.genPantryOnly ? (used.pantryShort ? ` · per ${used.pantryShort} past${used.pantryShort === 1 ? 'o' : 'i'} manca qualcosa` : ' · hai già tutto') : '';
      showUndoToast((state.genPantryOnly ? 'Menù con quello che hai' : 'Menù rigenerato') + pantryText + usedText, ()=>{
        restorePlanningState(snap);
        persist(); render();
      });
    });
  });
  document.querySelectorAll('[data-toggle-gen-two]').forEach(btn=>{
    btn.addEventListener('click', ()=>{ state.genTwoWeeks = !state.genTwoWeeks; render(); });
  });
  document.querySelectorAll('[data-toggle-gen-leftover]').forEach(btn=>{
    btn.addEventListener('click', ()=>{ state.leftoverLunchOn = !state.leftoverLunchOn; persist(); render(); });
  });
  document.querySelectorAll('[data-toggle-gen-pantry]').forEach(btn=>{
    btn.addEventListener('click', ()=>{ state.genPantryOnly = !state.genPantryOnly; render(); });
  });
  document.querySelectorAll('[data-remove-week]').forEach(btn=>{
    btn.addEventListener('click', e=>{ removeWeek(parseInt(e.currentTarget.dataset.removeWeek,10)); });
  });
  const addWeekBtn = document.getElementById('add-week');
  if(addWeekBtn) addWeekBtn.addEventListener('click', ()=>{ addWeek(); });
  document.querySelectorAll('[data-open-gen-settings]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const val = e.currentTarget.dataset.openGenSettings;
      state.genSettingsOpen = val === 'plain' ? 'plain' : parseInt(val, 10);
      render();
    });
  });
  document.querySelectorAll('[data-gen-sheet-close]').forEach(el=>{
    el.addEventListener('click', e=>{
      if(!isCloseTap(e, el)) return;
      state.genGeneralSheet = null;
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
  document.querySelectorAll('[data-gen-portions-dec], [data-gen-portions-inc]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const d = btn.hasAttribute('data-gen-portions-inc') ? 1 : -1;
      state.weekPortionsBase = Math.min(12, Math.max(1, defaultPortions() + d));
      persist(); render();
    });
  });
  document.querySelectorAll('[data-gen-weekstart]').forEach(btn=>{
    btn.addEventListener('click', ()=>{ setWeekStartDay(parseInt(btn.dataset.genWeekstart, 10)); render(); });
  });
  document.querySelectorAll('[data-gen-prepday]').forEach(btn=>{
    btn.addEventListener('click', ()=>{ state.prepDayDefault = parseInt(btn.dataset.genPrepday, 10); persist(); render(); });
  });
  document.querySelectorAll('[data-gen-diet]').forEach(btn=>{
    btn.addEventListener('click', ()=>{ state.dietType = btn.dataset.genDiet; state.dietTargets = {}; persist(); render(); });
  });
  document.querySelectorAll('[data-gen-target-open]').forEach(btn=>{
    btn.addEventListener('click', ()=>{ state.genTargetEdit = state.genTargetEdit === btn.dataset.genTargetOpen ? null : btn.dataset.genTargetOpen; render(); });
  });
  document.querySelectorAll('[data-gen-target-close]').forEach(btn=>{
    btn.addEventListener('click', ()=>{ state.genTargetEdit = null; render(); });
  });
  document.querySelectorAll('[data-gen-target]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const k = btn.dataset.genTarget, end = parseInt(btn.dataset.genTargetEnd, 10), d = parseInt(btn.dataset.genTargetStep, 10);
      const r = weekProteinTargets()[k].slice();
      // il minimo non supera il massimo, e il massimo non scende sotto il minimo
      r[end] = end === 0 ? Math.min(r[1], Math.max(0, r[0] + d)) : Math.max(r[0], Math.min(7, r[1] + d));
      state.dietTargets = Object.assign({}, state.dietTargets, { [k]: r });
      persist(); render();
    });
  });
  document.querySelectorAll('[data-gen-allergy]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const k = btn.dataset.genAllergy, cur = state.allergies || [];
      state.allergies = cur.includes(k) ? cur.filter(x => x !== k) : [...cur, k];
      persist(); render();
    });
  });
  document.querySelectorAll('[data-gen-allergy-form]').forEach(form=>{
    form.addEventListener('submit', e=>{
      e.preventDefault();
      const words = form.querySelector('input').value.split(',').map(w => w.trim().toLowerCase()).filter(Boolean);
      if(!words.length) return;
      state.allergies = [...new Set([...(state.allergies || []), ...words])];
      persist(); render();
    });
  });
  document.querySelectorAll('[data-gen-exclude-remove]').forEach(btn=>{
    btn.addEventListener('click', ()=>{ state.dietExclude = (state.dietExclude || []).filter((w, i) => i !== parseInt(btn.dataset.genExcludeRemove, 10)); persist(); render(); });
  });
  document.querySelectorAll('[data-gen-exclude-form]').forEach(form=>{
    form.addEventListener('submit', e=>{
      e.preventDefault();
      const words = form.querySelector('input').value.split(',').map(w => w.trim().toLowerCase()).filter(Boolean);
      if(!words.length) return;
      state.dietExclude = [...new Set([...(state.dietExclude || []), ...words])];
      persist(); render();
    });
  });
  document.querySelectorAll('[data-gen-leftover-portions]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      state.weekLeftoverPortions = Math.min(4, Math.max(0, leftoverPortionsN() + parseInt(btn.dataset.genLeftoverPortions, 10)));
      persist(); render();
    });
  });
  document.querySelectorAll('[data-gen-grams]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const k = btn.dataset.genGrams, step = parseInt(btn.dataset.genGramsStep, 10);
      const cur = parseInt((state.portionGrams || {})[k], 10) || 0;
      // da "come nella ricetta" il primo + parte da 80 g; sotto i 40 g torna a "come nella ricetta"
      let next = cur === 0 ? (step > 0 ? 80 : 0) : cur + step;
      if(next < 40) next = 0;
      state.portionGrams = Object.assign({ pasta: 0, riso: 0 }, state.portionGrams, { [k]: Math.min(150, next) });
      persist(); render();
    });
  });
  document.querySelectorAll('[data-gen-leftover-day]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const d = parseInt(btn.dataset.genLeftoverDay, 10);
      const cur = leftoverDaysRaw();
      state.weekLeftoverDays = (cur.includes(d) ? cur.filter(x => x !== d) : cur.concat(d)).sort((a, b) => a - b);
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

  toggleMealDoneFn = key=>{
      const { weekIdx, i, meal } = parseMealKey(key);
      const mealsDone = weekMealsDoneRef(weekIdx);
      if(mealsDone[i] && mealsDone[i][meal]){
        clearMealFlag(mealsDone, i, meal);
        persist(); render();
      } else if(linkedSourceMealKey(weekIdx, i, meal)){
        // pasto "avanzo": nessun nuovo ingrediente consumato (già scalato sul
        // pasto sorgente), quindi si segna direttamente senza passare dalla
        // modale di aggiornamento Dispensa. I consumi "con i pasti" (pane)
        // valgono anche con l'avanzo: si tolgono qui, con Annulla.
        if(!mealsDone[i]) mealsDone[i] = {};
        mealsDone[i][meal] = doneValueFor(weekIdx, i);
        const counts = {};
        mealRecurringList().forEach(r=>{ if(mealUsesRecurring(i, meal)) counts[r.id] = r.qty; });
        const took = takeRecurringMeal(counts);
        // L'avanzo mangiato esce dalla Dispensa (se c'era come avanzo).
        const eaten = [];
        mealDishes(weekIdx, i, meal).forEach(dsh=>{
          const k = (dsh.name || '').trim().toLowerCase();
          const it = state.pantryItems[k];
          if(it && isLeftoverPantryItem(it) && !it.frozenMeal && typeof it.qty === 'number' && it.qty > 0){ eaten.push({ k, item: { ...it } }); it.qty = 0; }
        });
        persist(); render();
        if(took.length || eaten.length) showUndoToast(`Tolto ${took.map(t => t.it.nome.toLowerCase()).concat(eaten.map(e => e.item.nome.toLowerCase())).join(', ')}`, ()=>{
          took.forEach(t => { t.it.qty = t.prev; });
          eaten.forEach(e => { state.pantryItems[e.k] = e.item; });
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
            qtyMap[it.ingrediente] = (qtyMap[it.ingrediente] || 0) + usedQtyForPantry(pantryIt.unit, it.qta, (it.fixed ? 1 : ratio) * it.factor);
          }
        });
        state.doneModalDay = key;
        state.doneModalQty = qtyMap;
        state.doneQtyEditingKey = null;
        state.doneModalFinished = {};
        state.doneModalMeal = {};
        mealRecurringList().forEach(r=>{ if(mealUsesRecurring(i, meal) && !recipeListsRecurring(allIng, r)) state.doneModalMeal[r.id] = r.qty; });
        // Un avanzo possibile per ogni piatto del pasto (tranne quelli presi dal
        // freezer). Quello che un pasto futuro mangerà come avanzo ("Segna come
        // avanzata") parte già spuntato: deve finire in Dispensa.
        const linkedAhead = Object.values(state.dayLinks).includes(key);
        state.doneModalLeftovers = mealDishes(weekIdx, i, meal)
          .filter(dsh => dsh.name && !isFreezerDish(key, dsh.name))
          .map(dsh => ({ name: dsh.name, luogo: 'frigo', cat: 'avanzi', checked: linkedAhead && dsh.role === 'p', pickerOpen: false, catPickerOpen: false }));
        render();
      }
  };
  document.querySelectorAll('[data-toggle-done]').forEach(btn=>{
    btn.addEventListener('click', e=>toggleMealDoneFn(e.currentTarget.dataset.toggleDone));
  });
  document.querySelectorAll('[data-toggle-dish-lock]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      e.stopPropagation();
      toggleDishLock(e.currentTarget.dataset.toggleDishLock, e.currentTarget.dataset.dishName);
      state.mealDetailMenuOpen = false;
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
      closeDoneSheet();
      render();
    });
  });
  document.querySelectorAll('[data-done-rec]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = btn.dataset.doneRec;
      state.doneModalMeal[id] = Math.max(0, Math.round(((state.doneModalMeal[id] || 0) + parseFloat(btn.dataset.doneRecDelta)) * 100) / 100);
      render();
    });
  });
  document.querySelectorAll('[data-done-cart-toggle]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const name = e.currentTarget.dataset.doneCartToggle;
      state.doneModalFinished[name] = !state.doneModalFinished[name];
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
  const leftRow = idx => state.doneModalLeftovers[parseInt(idx, 10)];
  document.querySelectorAll('[data-done-leftover-input]').forEach(inp=>{
    inp.addEventListener('input', e=>{
      const row = leftRow(e.target.dataset.doneLeftoverInput); if(!row) return;
      row.name = e.target.value;
      render(); // fuoco e cursore: vedi restoreFocus
    });
  });
  document.querySelectorAll('[data-done-leftover-toggle]').forEach(cb=>{
    cb.addEventListener('change', e=>{
      const row = leftRow(e.currentTarget.dataset.doneLeftoverToggle); if(!row) return;
      row.checked = e.currentTarget.checked;
      render();
    });
  });
  document.querySelectorAll('[data-done-leftover-luogo-toggle]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const row = leftRow(e.currentTarget.dataset.doneLeftoverLuogoToggle); if(!row) return;
      const open = !row.pickerOpen;
      state.doneModalLeftovers.forEach(r => { r.pickerOpen = false; r.catPickerOpen = false; });
      row.pickerOpen = open;
      render();
    });
  });
  document.querySelectorAll('[data-done-leftover-luogo-close],[data-done-leftover-cat-close]').forEach(el=>{
    el.addEventListener('click', ()=>{ state.doneModalLeftovers.forEach(r => { r.pickerOpen = false; r.catPickerOpen = false; }); render(); });
  });
  document.querySelectorAll('[data-done-leftover-luogo-set]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const [idx, luogo] = e.currentTarget.dataset.doneLeftoverLuogoSet.split(':');
      const row = leftRow(idx); if(!row) return;
      row.luogo = luogo; row.pickerOpen = false;
      render();
    });
  });
  document.querySelectorAll('[data-done-leftover-cat-toggle]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const row = leftRow(e.currentTarget.dataset.doneLeftoverCatToggle); if(!row) return;
      const open = !row.catPickerOpen;
      state.doneModalLeftovers.forEach(r => { r.pickerOpen = false; r.catPickerOpen = false; });
      row.catPickerOpen = open;
      render();
    });
  });
  document.querySelectorAll('[data-done-leftover-cat-set]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const [idx, cat] = e.currentTarget.dataset.doneLeftoverCatSet.split(':');
      const row = leftRow(idx); if(!row) return;
      row.cat = cat; row.catPickerOpen = false;
      render();
    });
  });
  document.querySelectorAll('[data-confirm-done]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const key = e.currentTarget.dataset.confirmDone;
      const recipeOnly = !!state.doneModalRecipe;
      const { weekIdx, i, meal } = recipeOnly ? {} : parseMealKey(key);
      const qtyMap = state.doneModalQty || {};
      // Le quantità qui sono "quanto ne hai usato": si sottraggono dalla
      // scorta attuale invece di sovrascriverla (prima il campo era "quanto
      // ti resta", da calcolare a mano — vedi commit).
      Object.keys(qtyMap).forEach(ingrediente=>{
        const pantryIt = resolvePantryItem(ingrediente);
        if(pantryIt) pantryIt.qty = Math.max(0, Math.round(((pantryIt.qty||0) - qtyMap[ingrediente]) * 100) / 100);
      });
      // Ingredienti col carrello: scorta a 0 e subito in lista spesa.
      Object.entries(state.doneModalFinished || {}).forEach(([ingrediente, checked])=>{
        if(!checked) return;
        const pantryIt = resolvePantryItem(ingrediente);
        if(!pantryIt) return;
        pantryIt.qty = 0;
        const pKey = Object.keys(state.pantryItems).find(k => state.pantryItems[k] === pantryIt);
        if(pKey) state.pantryConfirmedShop[pKey] = true;
      });
      // Avanzo fisico segnalato dall'utente: voce a sé in Dispensa, come
      // presenza/assenza (nessuna quantità da tracciare) nel luogo scelto —
      // indipendente dal collegamento "Segna come avanzata" (quello vincola
      // un pasto futuro preciso, questo è solo "c'è in dispensa/frigo/...").
      // Il checkbox (deselezionato di default) decide se va aggiunto: il
      // testo da solo non basta, va spuntato esplicitamente.
      state.doneModalLeftovers.forEach(row=>{
        const leftover = (row.name || '').trim();
        if(!row.checked || !leftover) return;
        const leftoverKey = leftover.toLowerCase();
        const existing = state.pantryItems[leftoverKey];
        upsertPantryItem(leftover, row.luogo, 1, 'none', row.cat);
        // Segnato come avanzo (vedi isLeftoverPantryItem) anche se il reparto
        // scelto non è "Avanzi" — ma non se il nome coincide con un
        // ingrediente vero già in Dispensa, che deve restare tale.
        if(!existing || existing.leftover) state.pantryItems[leftoverKey].leftover = true;
      });
      if(!recipeOnly){
        takeRecurringMeal(state.doneModalMeal);
        const doneMealData = effectiveMeal(weekIdx, i, meal);
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
        mealsDone[i][meal] = doneValueFor(weekIdx, i);
      }
      closeDoneSheet();
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
    el.addEventListener('click', ()=>{ const mk = el.dataset.cookMeal || ''; const ratio = parseFloat(el.dataset.cookRatio) || 1; state.cookSession = cookSessionFor(el.dataset.cookStart, ratio, mk); state.cookMode = { name: el.dataset.cookStart, step: 0, ratio, mk }; render(); });
  });
  // "Fatto" all'ultimo passo: chiude la modalità cucina e, se la ricetta è un
  // pasto del Menù non ancora segnato, apre "Ricetta fatta!" per chiedere
  // quali ingredienti sono finiti.
  document.querySelectorAll('[data-cook-switch]').forEach(el=>{
    el.addEventListener('click', ()=> cookSwitchTo(el.dataset.cookSwitch));
  });
  document.querySelectorAll('[data-cook-done-meal]').forEach(el=>{
    el.addEventListener('click', ()=>{ if(toggleMealDoneFn) toggleMealDoneFn(el.dataset.cookDoneMeal); });
  });
  document.querySelectorAll('[data-cook-finish]').forEach(el=>{
    el.addEventListener('click', ()=>{
      const cm = state.cookMode; if(!cm) return;
      // "Ho finito": il piatto risulta finito e si passa al prossimo ancora da
      // fare; quando sono finiti tutti si apre il foglio del pasto.
      const list = state.cookSession || [];
      const cur = list.find(x => x.name === cm.name);
      if(cur){ cur.done = true; cur.step = cm.step || 0; }
      const next = list.find(x => !x.done);
      if(next){ state.cookMode = { name: next.name, step: next.step || 0, ratio: next.ratio || 1, mk: cm.mk }; render(); return; }
      const mk = cm.mk;
      state.cookMode = null; render();
      if(!mk){ openRecipeDone(cm.name, cm.ratio); return; }
      const { weekIdx, i, meal } = parseMealKey(mk);
      const md = weekMealsDoneRef(weekIdx);
      if(!(md[i] && md[i][meal]) && toggleMealDoneFn) toggleMealDoneFn(mk);
    });
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
  const cookSetCursor = n => { const cm = state.cookMode; if(!cm) return; const cur = (state.cookSession || []).find(x => x.name === cm.name); if(cur) cur.cursor = n; };
  document.querySelectorAll('[data-cook-step-done]').forEach(el=> el.addEventListener('click', ()=>{
    const cm = state.cookMode; if(!cm) return;
    const next = (cm.step || 0) + 1;
    cookSetCursor(next); cm.step = next; render();
  }));
  document.querySelectorAll('[data-cook-goto]').forEach(el=> el.addEventListener('click', ()=>{
    const cm = state.cookMode; if(!cm) return;
    cm.step = parseInt(el.dataset.cookGoto, 10) || 0; render();
  }));
  document.querySelectorAll('[data-cook-redo]').forEach(el=> el.addEventListener('click', ()=>{
    const cm = state.cookMode; if(!cm) return;
    cookSetCursor(cm.step || 0); render();
  }));
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
    recipeEditModal.addEventListener('change', e=>{
      if(e.target.matches && e.target.matches('.edit-ing-qual') && e.target.value === '__new') switchEditIngQualToNew(e.target);
    });
    ['input', 'change', 'focusout', 'click'].forEach(ev => recipeEditModal.addEventListener(ev, e=>{
      const row = e.target.closest && e.target.closest('.edit-ing-sheet');
      if(row && !e.target.matches('.edit-ing-qual, .edit-ing-qual-new')) refreshEditIngQual(row);
    }));
    recipeEditModal.addEventListener('click', e=>{
      if(e.target.closest('[data-remove-row]')){
        e.target.closest('.edit-ing-row, .edit-step-row, .edit-time-entry').remove();
        refreshEditTimeTotal();
        return;
      }
      const stagioneChip = e.target.closest('[data-stagione-chip]');
      if(stagioneChip){
        stagioneChip.classList.toggle('active');
        return;
      }
      if(e.target.closest('#edit-add-ing-row')){
        const list = document.getElementById('edit-ing-list');
        list.insertAdjacentHTML('beforeend', editIngRowHtml('', '', ''));
        openEditIngSheet(list.lastElementChild);
        return;
      }
      const ingOpen = e.target.closest('[data-edit-ing-open]');
      if(ingOpen){ openEditIngSheet(ingOpen.closest('.edit-ing-row')); return; }
      if(e.target.closest('#edit-add-time-row')){
        const tl = document.getElementById('edit-time-list');
        tl.insertAdjacentHTML('beforeend', editTimeEntryHtml('', ''));
        tl.lastElementChild.querySelector('.edit-time-label').focus();
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
      let name = e.currentTarget.dataset.saveRecipeEdit;
      const newName = ((document.getElementById('edit-name') || {}).value || '').trim();
      if(!newName){ window.alert('Il nome non può essere vuoto.'); return; }
      if(newName !== name){
        if(recipeNameTaken(newName)){ window.alert('Esiste già una ricetta con questo nome.'); return; }
        renameRecipe(name, newName);
        name = newName;
      }
      const ingredienti = Array.from(document.querySelectorAll('#edit-ing-list .edit-ing-row')).map(readEditIngRow).filter(it=>it.ingrediente);
      // Una specifica nuova resta disponibile per quell'ingrediente.
      ingredienti.forEach(it => { if(it.qual && !variantOptionsFor(it.ingrediente).includes(it.qual)) addIngredientVariant(it.ingrediente, it.qual); });
      const procedimento = Array.from(document.querySelectorAll('#edit-step-list .edit-step-text'))
        .map(el=>el.value.trim()).filter(Boolean);
      const stagioni = Array.from(document.querySelectorAll('#edit-stagioni [data-stagione-chip].active'))
        .map(el=>el.dataset.stagioneChip);
      state.recipeEdits[name] = {
        ...editTimeFromForm(getRecipeMeta(name) || {}),
        porzioni: document.getElementById('edit-porzioni').value.trim(),
        quantitaFisse: !!(document.getElementById('edit-quantita-fisse') || {}).checked,
        categoriaNew: document.getElementById('edit-categoria').value,
        tipologia: document.getElementById('edit-tipologia').value,
        gradimento: document.getElementById('edit-gradimento').value,
        base: document.getElementById('edit-base').value,
        proteina: document.getElementById('edit-proteina').value,
        stagioni: stagioni.length ? stagioni : ['tutto'],
        freezerNew: document.getElementById('edit-freezer-new').value,
        pianificazione: document.getElementById('edit-pianificazione').value,
        ingredienti,
        procedimento,
        ricordare: document.getElementById('edit-ricordare').value.trim(),
        consigli: document.getElementById('edit-consigli').value.trim(),
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
    state.filters = { cat:[], tipo:[], tempo:'', pian:'', stagione:'', freezer:'', grad:'', attrezz:'', quick:false, search: state.filters.search };
    render();
  });

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
  document.querySelectorAll('[data-quick-filter]').forEach(btn=> btn.addEventListener('click', ()=>{
    if(btn.dataset.quickFilter === 'grad') state.filters.grad = state.filters.grad === 'preferita' ? '' : 'preferita';
    else state.filters.quick = !state.filters.quick;
    render();
  }));
  document.querySelectorAll('[data-toggle-pantry-mode]').forEach(btn=> btn.addEventListener('click', ()=>{
    state.prepPantryMode = !state.prepPantryMode;
    render();
  }));
  // "+" di Dispensa: stesso modale di "+ Aggiungi ingrediente" nel menu ⋯
  // (titolo/categoria di ripiego seguono la vista Cibo/Casa aperta).
  const pantryFab = document.getElementById('pantry-fab');
  if(pantryFab) onFastTap(pantryFab, ()=>{ if(!state.addSheet) openAddSheet('casa'); });
  document.querySelectorAll('[data-manage-ingredient-new]').forEach(btn=> btn.addEventListener('click', ()=> openAddSheet('casa')));

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
  [['f-tempo','tempo'],['f-pian','pian'],['f-stagione','stagione'],['f-freezer','freezer'],['f-grad','grad'],['f-attrezz','attrezz']].forEach(([id,key])=>{
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
  document.querySelectorAll('[data-toggle-shop-later]').forEach(el=>{
    el.addEventListener('click', ()=>{ state.shopLaterOpen = !state.shopLaterOpen; render(); });
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
    const snap = JSON.parse(JSON.stringify({ e: state.shopExtras, d: state.shopDismissed, c: state.shopChecked, p: state.pantryConfirmedShop }));
    let added = 0;
    Object.keys(state.pantrySelected).forEach(key=>{
      const it = state.pantryItems[key];
      if(!it) return;
      added++;
      if(typeof it.qty === 'number' && it.qty <= 0){
        // Finito: riusa lo stesso record già in Spesa, non ne crea uno nuovo.
        state.pantryConfirmedShop[key] = true;
        delete state.shopDismissed[`oos_${key}`];
        delete state.shopChecked[`oos_${key}`];
      } else {
        // Ce l'hai ancora ma lo vuoi comunque in lista (es. sta per finire):
        // stessa strada di un'aggiunta manuale da Spesa. Se era già tra gli
        // "Aggiunti a mano" ma comprato o tolto (la riga resta salvata,
        // nascosta) si rimette in vista: prima veniva saltato e non compariva.
        const sameId = Object.keys(state.shopExtras).find(id => !state.shopExtras[id].per && (state.shopExtras[id].ingrediente||'').trim().toLowerCase() === key);
        if(sameId){
          delete state.shopDismissed[sameId];
          state.shopChecked[sameId] = false;
        } else {
          const id = 'extra_' + Date.now() + '_' + Math.random().toString(36).slice(2,7);
          state.shopExtras[id] = { ingrediente: it.nome, qta: '' };
        }
      }
    });
    state.pantrySelectMode = false;
    state.pantrySelected = {};
    persist(); render();
    if(added) showUndoToast(added === 1 ? 'Aggiunto alla lista spesa' : `${added} ingredienti aggiunti alla lista spesa`, ()=>{
      state.shopExtras = snap.e; state.shopDismissed = snap.d; state.shopChecked = snap.c; state.pantryConfirmedShop = snap.p;
      persist(); render();
    });
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
    const popEl = document.querySelector('.qty-pop');
    if(popEl && popEl.getBoundingClientRect().bottom > window.innerHeight - 90) popEl.classList.add('is-up');
    qtyEditInput.focus({ preventScroll: true });
    keepQtyPopVisible();
    qtyEditInput.select();
    const popKey = qtyEditInput.dataset.qtyEdit;
    // Il numero si legge alla chiusura (Fatto, tocco fuori, Invio) e quando
    // cambia l'unità. Da 0 in giù resta la domanda "è finito?" di sempre.
    const readQty = ()=>{
      const it = state.pantryItems[popKey];
      if(!it) return;
      const n = parseFloat(qtyEditInput.value);
      const next = Number.isNaN(n) ? 0 : Math.max(0, n);
      if(next <= 0 && !isLeftoverPantryItem(it)) state.pantryFinishPicker = popKey;
      else it.qty = next;
      if(it.qty > 0) delete state.pantryConfirmedShop[popKey];
    };
    document.querySelectorAll('select[data-qty-unit]').forEach(sel=>{
      sel.addEventListener('change', ()=>{
        const it = state.pantryItems[popKey];
        if(!it) return;
        const n = parseFloat(qtyEditInput.value);
        if(!Number.isNaN(n) && n > 0) it.qty = n;
        if(sel.value) it.unit = sel.value; else delete it.unit;
        persist(); render();
      });
    });
    const closePop = ()=>{ readQty(); state.pantryEditingKey = null; persist(); render(); };
    document.querySelectorAll('[data-qty-pop-close]').forEach(el=> el.addEventListener('click', closePop));
    qtyEditInput.addEventListener('keydown', e=>{ if(e.key === 'Enter') closePop(); });
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
  document.querySelectorAll('[data-close-recurring]').forEach(el=>{
    el.addEventListener('click', e=>{
      if(!isCloseTap(e, el)) return;
      state.recurringOpen = false; state.recurringEditId = null; state.recurringDraft = null;
      persist(); render();
    });
  });
  document.querySelectorAll('[data-recurring-edit]').forEach(btn=> btn.addEventListener('click', ()=>{
    const id = btn.dataset.recurringEdit;
    const r = state.recurringItems[id];
    state.recurringEditId = id;
    state.recurringDraft = r ? { nome: r.nome, qty: r.qty, every: r.every, mode: r.mode === 'meal' ? 'meal' : 'time' } : { nome: '', qty: 1, every: 1, mode: 'time' };
    render();
    const inp = document.getElementById('recurring-name');
    if(inp && id === 'new') inp.focus();
  }));
  document.querySelectorAll('[data-recurring-cancel]').forEach(btn=> btn.addEventListener('click', ()=>{ state.recurringEditId = null; state.recurringDraft = null; render(); }));
  [['recurring-name', 'nome'], ['recurring-qty', 'qty'], ['recurring-every', 'every']].forEach(([elId, field])=>{
    const inp = document.getElementById(elId);
    if(inp && state.recurringDraft){
      inp.addEventListener('input', e=>{ state.recurringDraft[field] = e.target.value; });
      if(field === 'nome') inp.addEventListener('change', e=>{ state.recurringDraft.nome = e.target.value; });
    }
  });
  // Consumo ricorrente: l'ingrediente si sceglie dall'elenco, per non sbagliare il nome.
  const recName = document.getElementById('recurring-name');
  if(recName) attachIngredientCombobox(recName, { noCreate: true, pool: allKnownIngredientNames });
  document.querySelectorAll('[data-recurring-mode]').forEach(btn=> btn.addEventListener('click', ()=>{
    if(state.recurringDraft){ state.recurringDraft.mode = btn.dataset.recurringMode; render(); }
  }));
  const recurringSave = document.getElementById('recurring-save');
  if(recurringSave) recurringSave.addEventListener('click', ()=>{
    const d = state.recurringDraft; if(!d) return;
    let nome = String(d.nome || '').trim();
    const known = nome && allKnownIngredientNames().find(n => n.trim().toLowerCase() === nome.toLowerCase());
    if(nome && !known){ d.error = 'name'; render(); return; }
    if(known) nome = known.trim();
    const qty = parseFloat(String(d.qty).replace(',', '.'));
    const isMeal = d.mode === 'meal';
    const every = isMeal ? 1 : parseInt(d.every, 10);
    if(!nome || !(qty > 0) || !(every >= 1)){ d.error = true; render(); return; }
    const id = state.recurringEditId === 'new' ? 'r' + Date.now().toString(36) : state.recurringEditId;
    const prev = state.recurringItems[id];
    state.recurringItems[id] = { nome, qty, every, mode: isMeal ? 'meal' : 'time', last: prev ? prev.last : isoLocalDate(new Date()) };
    state.recurringEditId = null; state.recurringDraft = null;
    persist(); render();
  });
  document.querySelectorAll('[data-recurring-delete]').forEach(btn=> btn.addEventListener('click', ()=>{
    delete state.recurringItems[btn.dataset.recurringDelete];
    state.recurringEditId = null; state.recurringDraft = null;
    persist(); render();
  }));
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
    const it = state.pantryItems[key]; const g = materializeGroupMembers(state.groupEditId);
    if(!g) return;
    if(!g.members.includes(key)) g.members.push(key);
    if(it){ it.group = state.groupEditId; if(!it.cat && g.cat) it.cat = g.cat; }
    state.groupMemberSearch = '';
    persist(); render();
    const inp = document.getElementById('group-member-search'); if(inp) inp.focus();
  };
  document.querySelectorAll('[data-group-member-add]').forEach(btn=> btn.addEventListener('click', ()=> addToGroup(btn.dataset.groupMemberAdd)));
  document.querySelectorAll('[data-group-member-new]').forEach(btn=> btn.addEventListener('click', ()=>{
    const name = btn.dataset.groupMemberNew;
    addToGroup(name.trim().toLowerCase());
  }));
  document.querySelectorAll('[data-group-member-remove]').forEach(btn=> btn.addEventListener('click', ()=>{
    const key = btn.dataset.groupMemberRemove, g = materializeGroupMembers(state.groupEditId);
    const it = state.pantryItems[key];
    if(g) g.members = g.members.filter(k => k !== key);
    if(it && it.group === state.groupEditId) delete it.group;
    persist(); render();
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
    // pointerdown con preventDefault: il campo non perde il fuoco, quindi
    // l'elenco non si svuota prima del tocco. La scelta si fa però al click:
    // se l'elenco sparisse già al pointerdown, su telefono il click cadrebbe
    // sul bottone che sta sotto ("Scansiona il codice a barre") e lo
    // attiverebbe.
    if(suggestEl){
      suggestEl.addEventListener('pointerdown', e=>{ if(e.target.closest('[data-pantry-suggest]')) e.preventDefault(); });
      suggestEl.addEventListener('click', e=>{
        const btn = e.target.closest('[data-pantry-suggest]');
        if(!btn) return;
        e.preventDefault(); e.stopPropagation();
        fillDraftFromPantry(state.pantryDraft, btn.dataset.pantrySuggest);
        state.pantrySheetPicker = null;
        render();
        // Scelto: via la tastiera e l'elenco, si passa a quantità e luogo.
        const inp = document.getElementById('pantry-add-name');
        if(inp) inp.blur();
        const sug = document.getElementById('pantry-add-suggest');
        if(sug) sug.innerHTML = '';
      });
    }
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
  document.querySelectorAll('[data-sheet-presence-set]').forEach(btn=> btn.addEventListener('click', ()=>{
    const it = sheetTarget(); if(!it) return;
    it.qty = btn.dataset.sheetPresenceSet === '1' ? (it.qty > 0 ? it.qty : 1) : 0;
    if(!(it.qty > 0)) delete it.lots;
    sheetChanged();
  }));
  document.querySelectorAll('[data-sheet-mode]').forEach(btn=> btn.addEventListener('click', ()=>{
    const it = sheetTarget(); if(!it) return;
    if(btn.dataset.sheetMode === 'none'){ it.unit = 'none'; it.qty = it.qty > 0 ? 1 : 0; }
    else { if(it.unit === 'none') delete it.unit; if(!(it.qty > 0)) it.qty = 1; }
    state.pantrySheetPicker = null;
    sheetChanged();
  }));
  document.querySelectorAll('[data-sheet-luogo]').forEach(btn=> btn.addEventListener('click', ()=>{
    const it = sheetTarget(); if(!it) return;
    it.luogo = btn.dataset.sheetLuogo;
    sheetChanged();
  }));
  const frozenInput = document.getElementById('pantry-edit-frozen');
  if(frozenInput) frozenInput.addEventListener('change', e=>{
    const it = sheetTarget(); if(!it) return;
    it.frozenOn = e.target.value || '';
    if(it.frozenOn && (it.freezerExp || !it.scadenza)) applyFreezerExpiry(it);
    sheetChanged();
  });
  const setEditScadenza = iso=>{
    const it = sheetTarget(); if(!it) return;
    if(iso) it.scadenza = iso; else delete it.scadenza;
    delete it.freezerExp; // scelta a mano: non è più una stima
    sheetChanged();
  };
  const lotsOf = it => Array.isArray(it.lots) ? it.lots.map(l => ({ qty: l.qty, scadenza: l.scadenza || '' })) : [{ qty: it.qty, scadenza: it.scadenza || '' }];
  const setLots = (it, lots)=>{
    it.lots = lots;
    delete it.freezerExp; // scadenze scelte a mano
    it.qty = Math.round(lots.reduce((n, l) => n + (Number(l.qty) || 0), 0) * 100) / 100;
    normalizeLots(it);
    sheetChanged();
  };
  document.querySelectorAll('[data-lot-add]').forEach(btn=> btn.addEventListener('click', ()=>{
    const it = sheetTarget(); if(!it || state.pantryAddModalOpen) return;
    const lots = lotsOf(it);
    const total = lots.reduce((n, l) => n + (Number(l.qty) || 0), 0);
    if(!Array.isArray(it.lots) && total > 1) lots[0].qty = Math.round((lots[0].qty - 1) * 100) / 100; // già più pezzi: ne stacco uno
    lots.push({ qty: 1, scadenza: '' });
    setLots(it, lots);
  }));
  document.querySelectorAll('[data-lot-qty]').forEach(inp=> inp.addEventListener('change', e=>{
    const it = sheetTarget(); if(!it) return;
    const lots = lotsOf(it); const l = lots[parseInt(e.target.dataset.lotQty, 10)]; if(!l) return;
    const n = parseFloat(String(e.target.value).replace(',', '.'));
    l.qty = Number.isNaN(n) ? 0 : Math.max(0, n);
    setLots(it, lots);
  }));
  document.querySelectorAll('[data-lot-date]').forEach(inp=> inp.addEventListener('change', e=>{
    const it = sheetTarget(); if(!it) return;
    const lots = lotsOf(it); const l = lots[parseInt(e.target.dataset.lotDate, 10)]; if(!l) return;
    l.scadenza = e.target.value || '';
    setLots(it, lots);
  }));
  document.querySelectorAll('[data-lot-remove]').forEach(btn=> btn.addEventListener('click', ()=>{
    const it = sheetTarget(); if(!it) return;
    const lots = lotsOf(it); lots.splice(parseInt(btn.dataset.lotRemove, 10), 1);
    setLots(it, lots);
  }));
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
  document.querySelectorAll('[data-have-spec]').forEach(btn=> btn.addEventListener('click', e=>{
    if(e.target.closest('[data-variant-del]')) return; // la ✕ toglie la specifica, non la sceglie
    const it = sheetTarget(); if(!it) return;
    if(btn.disabled) return;
    setPantryItemSpec(state.pantryEditKey, btn.dataset.haveSpec);
    persist(); render();
  }));
  document.querySelectorAll('[data-add-spec-sibling]').forEach(btn=> btn.addEventListener('click', ()=>{
    if(!state.pantryEditKey) return;
    addPantrySibling(state.pantryEditKey, btn.dataset.addSpecSibling);
    persist(); render();
  }));
  const addVariantFromSheet = ()=>{
    const it = sheetTarget(); const inp = document.getElementById('variant-new-input');
    if(!it || !inp || !inp.value.trim()) return;
    addIngredientVariant(it.nome, inp.value.trim());
    persist(); render();
  };
  document.querySelectorAll('[data-variant-add]').forEach(btn=> btn.addEventListener('click', addVariantFromSheet));
  const variantInput = document.getElementById('variant-new-input');
  if(variantInput) variantInput.addEventListener('keydown', e=>{ if(e.key === 'Enter'){ e.preventDefault(); addVariantFromSheet(); } });
  document.querySelectorAll('[data-variant-del]').forEach(btn=> btn.addEventListener('click', ()=>{
    const it = sheetTarget(); if(!it) return;
    removeIngredientVariant(it.nome, btn.dataset.variantDel);
    persist(); render();
  }));
  document.querySelectorAll('[data-sheet-unit]').forEach(btn=> btn.addEventListener('click', ()=>{
    const it = sheetTarget(); if(!it) return;
    const v = btn.dataset.sheetUnit;
    if(v) it.unit = v; else delete it.unit;
    state.pantrySheetPicker = null;
    sheetChanged();
  }));
  document.querySelectorAll('[data-sheet-picker-close]').forEach(el=> el.addEventListener('click', ()=>{ state.pantrySheetPicker = null; render(); }));
  document.querySelectorAll('[data-sheet-used]').forEach(btn=> btn.addEventListener('click', ()=>{
    state.pantrySheetUsed = !state.pantrySheetUsed;
    render();
  }));
  document.querySelectorAll('[data-sheet-more]').forEach(btn=> btn.addEventListener('click', ()=>{
    state.pantrySheetMore = !state.pantrySheetMore;
    render();
  }));
  const setShopExpiry = (k, v)=>{
    if(!state.shopExpiry) state.shopExpiry = {};
    state.shopExpiry[k] = v;
    persist(); render();
  };
  document.querySelectorAll('[data-shop-exp-date]').forEach(inp=> inp.addEventListener('change', e=> setShopExpiry(inp.dataset.shopExpDate, e.target.value || 'none')));
  document.querySelectorAll('[data-shop-exp-clear]').forEach(btn=> btn.addEventListener('click', e=>{ e.preventDefault(); e.stopPropagation(); setShopExpiry(btn.dataset.shopExpClear, 'none'); }));
  document.querySelectorAll('[data-scan-barcode]').forEach(btn=> btn.addEventListener('click', ()=> openBarcodeScanner()));
  const pantryAddBtn = document.getElementById('pantry-add-btn');
  if(pantryAddBtn) pantryAddBtn.addEventListener('click', ()=>{
    const d = state.pantryDraft; if(!d) return;
    if(!commitPantryDraft(d)){ const inp = document.getElementById('pantry-add-name'); if(inp) inp.focus(); }
  });
  const editDeleteBtn = document.getElementById('pantry-edit-delete');
  if(editDeleteBtn){
    editDeleteBtn.addEventListener('click', ()=>{
      const key = state.pantryEditKey;
      const prev = state.pantryItems[key];
      const wasHidden = !!(state.hiddenIngredients || {})[key];
      delete state.pantryItems[key];
      // Il nome può stare ancora in una ricetta o in Spesa: oltre alla scorta
      // lo nascondiamo da "Gestisci ingredienti", altrimenti sembra non eliminato.
      state.hiddenIngredients = state.hiddenIngredients || {};
      state.hiddenIngredients[key] = true;
      closeIngredientSheet();
      persist(); render();
      if(prev) showUndoToast(`${prev.nome} eliminato`, ()=>{ if(!wasHidden) delete state.hiddenIngredients[key]; state.pantryItems[key] = prev; persist(); render(); });
    });
  }
}

// "❄️ N porzioni in freezer · usale": il piatto passa a "Dal freezer" (niente da
// comprare in Spesa); Annulla lo rimette com'era.
document.addEventListener('click', e=>{
  const btn = e.target.closest && e.target.closest('[data-use-freezer]');
  if(!btn) return;
  e.preventDefault(); e.stopPropagation();
  const mk = btn.dataset.useFreezer, name = btn.dataset.useFreezerName;
  setFreezerDish(mk, name, true);
  persist(); render();
  showUndoToast('Userai le porzioni dal freezer', ()=>{ setFreezerDish(mk, name, false); persist(); render(); });
}, true);

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
// "Rigenera menu" (⋯ del Menù): rigenera tutte le settimane attive, ognuna come
// col suo "Rigenera" (pasti bloccati e già passati restano), con "Annulla".
function regenerateAllWeeks(){
  const snap = snapshotPlanningState();
  const idxs = [0];
  (state.extraWeeks || []).forEach((w, i) => { if(w) idxs.push(i + 1); });
  idxs.forEach(i => generateWeek(i));
  showUndoToast(`Menù rigenerato: ${idxs.length} ${idxs.length === 1 ? 'settimana' : 'settimane'}`, ()=>{
    restorePlanningState(snap);
    persist(); render();
  });
}
const TAB_MENU_ITEMS = {
  // Scorciatoie alle stesse voci che stanno anche in Impostazioni.
  dispensa: [
    { label: uiIcon('clipboard-list') + ' Inventario veloce', action: ()=>{ state.inventoryOpen = true; state.inventoryKeep = {}; } },
    { label: uiIcon('refresh') + ' Consumi ricorrenti', action: ()=>{ state.recurringOpen = true; state.recurringEditId = null; state.recurringDraft = null; } },
    { label: uiIcon('list-details') + ' Gestisci ingredienti', action: ()=>{ state.ingredientManagerOpen = true; } },
    { label: uiIcon('category') + ' Gruppi', action: ()=>{ state.pantryGroupsModalOpen = true; } },
    { label: uiIcon('tag') + ' Gestisci categorie', action: ()=>{ state.deptsModalOpen = true; } }
  ],
  spesa: [
    { label: uiIcon('sort') + ' Ordine corsie', action: ()=>{ state.aisleOrderOpen = true; } }
  ],
  menu: [
    { label: uiIcon('gear') + ' Generazione menù', action: ()=>{ state.genGeneralOpen = true; state.genGeneralPage = null; } },
    { label: uiIcon('tag') + ' Preferenze alimentari', action: ()=>{ state.genFoodOpen = true; state.genGeneralPage = null; } }
  ],
  prep: [
    { label: uiIcon('plus') + ' Aggiungi ricetta', action: ()=>{ state.newRecipeModalOpen = true; state.newRecipeError = ''; state.newRecipeName = ''; setTimeout(()=>{ const el = document.getElementById('new-recipe-name'); if(el) el.focus(); }, 80); } },
    { label: uiIcon('download') + ' Importa ricetta', action: ()=>{ state.recipeImport = { name: '', link: '', text: '' }; } }
  ]
};


(function(){
  const topbarMenuBtn = document.getElementById('topbar-menu-btn');
  const topbarMenuBackdrop = document.getElementById('topbar-menu-backdrop');
  const topbarMenu = document.getElementById('topbar-menu');
  const settingsBackdrop = document.getElementById('settings-backdrop');
  const settingsClose = document.getElementById('settings-close');
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
    const active = localStorage.getItem(ACCENT_KEY) || ACCENT_PRESETS[0];
    accentRow.innerHTML = ACCENT_PRESETS.map(c=>`<button type="button" class="color-swatch${active===c?' active':''}" style="background:${c}" data-accent-color="${c}" aria-label="Scegli questo colore"></button>`).join('');
  };
  const open = ()=>{
    refreshThemeRow();
    refreshAccentRow();
    refreshBackupStatus();
    settingsBackdrop.classList.add('open');
    settingsBackdrop.scrollTop = 0;
    reconcileModalHistory();
  };
  const close = ()=>{ const back = state.settingsReturnTab; closeSettingsBackdrop(); reconcileModalHistory(); if(back) render(); };
  if(settingsClose) settingsClose.addEventListener('click', close);

  // Menu "tre puntini" della topbar: Impostazioni + le voci di TAB_MENU_ITEMS
  // per la tab corrente, ricalcolate a ogni apertura così restano coerenti
  // anche se nel frattempo si è cambiata tab.
  let currentExtraItems = [];
  const renderTopbarMenuContent = ()=>{
    currentExtraItems = TAB_MENU_ITEMS[state.tab] || [];
    const extraHtml = currentExtraItems.length
      ? currentExtraItems.map((it,idx)=>`<button type="button" class="topbar-menu-item" data-topbar-menu-action="${idx}">${it.label}</button>`).join('')
      : '';
    if(topbarMenu) topbarMenu.innerHTML = `${extraHtml}<button type="button" class="topbar-menu-item" data-topbar-menu-settings>${uiIcon('gear')} Impostazioni</button>`;
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
  const trashEl = wrap.querySelector('.swipe-trash');
  const setTx = px=>{ content.style.transform = px ? `translateX(${px}px)` : ''; if(trashEl) trashEl.style.width = px ? `${px}px` : ''; };
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
let toggleMealDoneFn = null; // segna/apre "Ricetta fatta!" per un pasto (definita in attachHandlers)
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
  if(e.target.closest('[data-close-dish-picker]') || (e.target.matches && e.target.matches('[data-dish-picker-backdrop]'))){ closeDishPicker(); render(); return; }
  if(e.target.closest('[data-dish-pantry]') && state.dishPicker){ state.dishPicker.pantry = !state.dishPicker.pantry; render(); return; }
  const courseEl = e.target.closest('[data-dish-course]');
  if(courseEl && state.dishPicker){ state.dishPicker.tipo = courseEl.dataset.dishCourse; state.dishPicker.suggestNow = null; render(); return; }
  if(e.target.closest('[data-dish-more-suggest]') && state.dishPicker){ state.dishPicker.suggestNow = null; render(); return; }
  const pickEl = e.target.closest('[data-dish-pick]');
  if(pickEl && state.dishPicker){
    const { weekIdx, i, meal } = parseMealKey(pickEl.dataset.dishKey);
    const name = pickEl.dataset.dishPick;
    const oldName = state.dishPicker.replace;
    const snap = snapshotMealDishes(weekIdx, i, meal);
    if(oldName){
      const holder = lastRipienoOf(weekIdx, i, meal, oldName);
      if(holder && !recipeRipieni(holder).includes(name)){ showNotice(`Serve almeno un ripieno per «${holder}»: scegline un altro tra quelli indicati.`); return; }
      replaceMealDish(weekIdx, i, meal, oldName, name);
    } else addMealDish(weekIdx, i, meal, name);
    if(state.dishPicker.tipo === 'freezer') setFreezerDish(mealKey(weekIdx, i, meal), name, true);
    // Un impasto con più ripieni possibili: si sceglie subito, senza non si chiude.
    const stillMissing = mealMissingRipieno(weekIdx, i, meal);
    state.dishPicker = stillMissing.length ? { key: mealKey(weekIdx, i, meal), replace: null, tipo: 'ripieno', search: '', require: stillMissing[0].name } : null;
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
    state.prepDay[prepDayEl.dataset.prepWeek] = parseInt(prepDayEl.dataset.prepDay, 10);
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
// Ordine delle tessere: per frequenza d'uso (quante volte le apri, c.uses; a
// parità, alfabetico) oppure solo alfabetico.
function sortedCards(){
  const byName = (a, b) => IT_COLLATOR.compare(a.name, b.name);
  const freq = state.cardsSort !== 'az';
  return (state.loyaltyCards || []).slice().sort((a, b) => (freq ? ((b.uses || 0) - (a.uses || 0)) : 0) || byName(a, b));
}
// La pagina (elenco/gestione) resta sotto anche con una carta aperta o
// l'import da confermare: sono finestre sopra, non un cambio di pagina, così
// chiudendole l'elenco non rifà l'animazione d'ingresso.
// --- Ordine corsie (Spesa) ---------------------------------------------------
// I reparti della Spesa nell'ordine in cui si gira il proprio supermercato:
// si trascinano dalla maniglia ⠿ (la riga si sposta nel DOM mentre il dito
// scorre, l'ordine si salva al rilascio) oppure con le frecce su/giù.
// "Aggiungi ricetta" (da Impostazioni → Ricette): pagina col nome; "Crea" apre
// subito la pagina Modifica ricetta della nuova ricetta.
function renderNewRecipePage(){
  if(!state.newRecipeModalOpen) return '';
  const body = `
      <section class="settings-section">
        <h3 class="settings-section-title">Nome</h3>
        <div class="settings-card">
          <input type="text" id="new-recipe-name" class="input-search settings-search" placeholder="Es. Pasta al pesto" value="${escapeAttr(state.newRecipeName || '')}" autocomplete="off">
        </div>
        ${state.newRecipeError ? `<p class="settings-note" style="color:var(--tomato);">${escapeHtml(state.newRecipeError)}</p>` : '<p class="settings-note">Poi potrai aggiungere ingredienti, passaggi, foto e tutto il resto.</p>'}
      </section>
      <section class="settings-section">
        <h3 class="settings-section-title">Oppure importala</h3>
        <div class="settings-card is-links">
          <button type="button" class="settings-link" data-settings-go="import"><span class="settings-link-ico" data-ico="download"></span><span class="settings-link-text">Importa ricetta<small>Da un reel, un sito o un testo</small></span></button>
        </div>
      </section>`;
  return managePageHtml({ key: 'new-recipe', title: 'Aggiungi ricetta', closeAttr: 'data-close-new-recipe', body,
    footer: `<button type="button" class="btn is-solid is-block" data-new-recipe-create>Crea</button>` });
}
function createNewRecipeFromPage(){
  const name = (state.newRecipeName || '').trim();
  if(!name){ state.newRecipeError = 'Inserisci un nome.'; render(); return; }
  const nameLower = name.toLowerCase();
  const exists = Object.keys(recipeByName).some(n=>n.toLowerCase()===nameLower)
    || Object.keys(state.customRecipes).some(n=>n.toLowerCase()===nameLower);
  if(exists){ state.newRecipeError = 'Esiste già una ricetta con questo nome.'; render(); return; }
  state.customRecipes[name] = { nome: name };
  state.newRecipeModalOpen = false;
  state.newRecipeError = ''; state.newRecipeName = '';
  // La pagina Modifica ricetta sta nella scheda Ricette.
  if(state.tab !== 'prep'){ if(!state.settingsReturnTab) state.settingsReturnTab = state.tab; state.tab = 'prep'; }
  state.recipeEditName = name;
  persist(); render();
}
document.addEventListener('click', e=>{
  const t = e.target;
  const closeEl = t.closest('[data-close-new-recipe]');
  if(closeEl){
    if(!isCloseTap(e, closeEl)) return;
    state.newRecipeModalOpen = false; state.newRecipeError = ''; state.newRecipeName = ''; render(); return;
  }
  if(t.closest('[data-new-recipe-create]')) createNewRecipeFromPage();
});
document.addEventListener('input', e=>{ if(e.target.id === 'new-recipe-name') state.newRecipeName = e.target.value; });
document.addEventListener('keydown', e=>{ if(e.target.id === 'new-recipe-name' && e.key === 'Enter'){ e.preventDefault(); createNewRecipeFromPage(); } });
// Pagina "Tema e colori" (dalle Impostazioni): chiaro/scuro e colore d'accento,
// validi solo su questo telefono.
// Profilo: nome (salvato sull'account, quindi su tutti i telefoni), email
// dell'account e uscita.
function profileDisplayName(){
  if(loggedInName) return loggedInName;
  const u = getCurrentUser();
  return u ? memberName(u) : '';
}
const PROFILE_EMOJIS = ['👩','👨','🧑','👧','👦','👵','👴','👩‍🍳','👨‍🍳','🧑‍🍳','🍕','🍝','🥗','🍋','🍓','🥑','🌶️','🍅','🧁','🍪','🦊','🐱','🐶','🐼','🦄','🌻','⭐','❤️'];
function profileAvatarChar(){
  const u = getCurrentUser();
  const e = u && state.userEmojis ? state.userEmojis[u] : '';
  return e || (profileDisplayName() || '?').trim().charAt(0).toUpperCase();
}
// Sfondo dell'immagine profilo: il tuo colore del turno di cucina.
function profileAvatarColor(){
  const u = getCurrentUser();
  return u ? memberColor(u) : '#ff7a66';
}
function refreshProfileLink(){
  const el = document.getElementById('settings-profile-text');
  if(!el) return;
  const name = profileDisplayName();
  el.innerHTML = `${escapeHtml(name || 'Il tuo profilo')}<small>${escapeHtml(loggedInEmail || 'Nome, email, esci')}</small>`;
  const av = document.getElementById('settings-avatar');
  if(av){ av.textContent = profileAvatarChar(); av.style.background = profileAvatarColor(); }
}
function renderProfilePage(){
  if(!state.profileOpen) return '';
  const user = getCurrentUser();
  const cur = user ? (state.userEmojis[user] || '') : '';
  const body = `
      <div class="profile-hero"><span class="settings-avatar is-big" style="background:${profileAvatarColor()}">${escapeHtml(profileAvatarChar())}</span></div>
      ${user ? `<section class="settings-section">
        <h3 class="settings-section-title">Immagine e colore</h3>
        <div class="settings-card">
          <div class="emoji-grid">
            <button type="button" class="emoji-opt${cur ? '' : ' active'}" data-profile-emoji="" aria-label="Usa l'iniziale">Aa</button>
            ${PROFILE_EMOJIS.map(e => `<button type="button" class="emoji-opt${cur === e ? ' active' : ''}" data-profile-emoji="${e}">${e}</button>`).join('')}
          </div>
          <input type="text" id="profile-emoji-custom" placeholder="Oppure scrivi un'emoji" autocomplete="off" aria-label="Emoji personalizzata">
          <div class="color-swatch-row">${USER_COLOR_PRESETS.map(c => `<button type="button" class="color-swatch${memberColor(user) === c ? ' active' : ''}" style="background:${c}" data-member-color="${c}" data-member-id="${escapeAttr(user)}" aria-label="Scegli questo colore"></button>`).join('')}</div>
          <p class="settings-note">Il colore è quello con cui compari nel Menù quando tocca a te cucinare, per tutti.</p>
        </div>
      </section>` : ''}
      <section class="settings-section">
        <h3 class="settings-section-title">Il tuo nome</h3>
        <div class="settings-card">
          <input type="text" id="profile-name" value="${escapeAttr(profileDisplayName())}" placeholder="Come ti chiami" autocomplete="off" maxlength="40">
          <p class="settings-note" id="profile-status"></p>
        </div>
      </section>
      <section class="settings-section">
        <h3 class="settings-section-title">Email</h3>
        <div class="settings-card">
          <p class="settings-card-text" id="profile-email">${escapeHtml(loggedInEmail || 'Non hai fatto l\'accesso')}</p>
        </div>
      </section>
      <section class="settings-section">
        <div class="settings-card">
          <button class="btn is-outline is-block settings-item-danger" type="button" data-logout>${uiIcon('power')} Esci</button>
        </div>
      </section>`;
  return managePageHtml({ key: 'profile', title: 'Profilo', closeAttr: 'data-close-profile', body });
}
document.addEventListener('click', e=>{
  const closeEl = e.target.closest('[data-close-profile]');
  if(closeEl){
    if(!isCloseTap(e, closeEl)) return;
    state.profileOpen = false; render(); return;
  }
  if(e.target.closest('[data-logout]') && window.cookpopAuth){
    state.profileOpen = false; closeSettingsBackdrop(); window.cookpopAuth.signOut();
  }
});
function setProfileEmoji(value){
  const u = getCurrentUser();
  if(!u) return;
  if(value) state.userEmojis[u] = value; else delete state.userEmojis[u];
  persist(); refreshProfileLink(); render();
}
document.addEventListener('click', e=>{
  const b = e.target.closest('[data-profile-emoji]');
  if(b) setProfileEmoji(b.dataset.profileEmoji);
});
document.addEventListener('change', e=>{
  if(e.target.id !== 'profile-emoji-custom') return;
  const v = e.target.value.trim();
  if(!v) return;
  const first = (window.Intl && Intl.Segmenter) ? [...new Intl.Segmenter('it', { granularity: 'grapheme' }).segment(v)][0].segment : Array.from(v)[0];
  setProfileEmoji(first);
});
document.addEventListener('change', async e=>{
  if(e.target.id !== 'profile-name') return;
  const name = e.target.value.trim();
  const status = document.getElementById('profile-status');
  if(!window.cookpopAuth || !window.cookpopAuth.updateName){ if(status) status.textContent = 'Non connesso: riprova più tardi.'; return; }
  try{
    await window.cookpopAuth.updateName(name);
    loggedInName = name;
    refreshProfileLink();
    if(status) status.textContent = 'Nome salvato.';
  }catch(err){
    if(status) status.textContent = 'Non sono riuscito a salvare il nome.';
  }
});
// Primo avvio guidato: solo per le famiglie nuove, una volta. Riusa gli stessi
// controlli delle Regole di generazione (stessi data-gen-*, stessi gestori).
function onboardingActive(){ return !!(activeRoute && activeRoute.newFamily && personalSynced && !state.onboardingDone); }
function renderOnboardingPage(){
  if(!onboardingActive()) return '';
  const step = Math.min(1, Math.max(0, state.onbStep || 0));
  const hamster = name => `<img class="onb-hamster" src="assets/welcome/${name}.webp" alt="" onerror="this.style.visibility='hidden'">`;
  if(step === 0){
    const diets = Object.entries(DIET_TYPES).map(([k, l]) => `<button type="button" class="gen-chip${dietTypeNow() === k ? ' active' : ''}" data-gen-diet="${k}" aria-pressed="${dietTypeNow() === k}">${l}</button>`).join('');
    const al = state.allergies || [];
    const allergies = `<button type="button" class="gen-chip${al.length ? '' : ' active'}" data-onb-allergy-none aria-pressed="${!al.length}">Nessuna</button>` + Object.keys(ALLERGEN_PRESETS).map(k => `<button type="button" class="gen-chip${al.includes(k) ? ' active' : ''}" data-gen-allergy="${escapeAttr(k)}" aria-pressed="${al.includes(k)}">${escapeHtml(k)}</button>`).join('');
    return `
  <div class="sheet-page onb-screen" data-page="onboarding">
    <div class="onb-body">
      <div class="onb-top"><button type="button" class="onb-skip" data-onb-skip>Salta</button></div>
      ${hamster('domande')}
      <h1 class="onb-title">Tre domande veloci</h1>
      <p class="onb-text">Servono per il primo menù. Puoi cambiarle quando vuoi in Impostazioni.</p>
      <div class="onb-field"><div class="onb-lab">Quanti siete</div>
        <div class="onb-row"><span>Di solito cucini per</span>
          <span class="gen-stepper"><button type="button" class="qty-btn" data-gen-portions-dec aria-label="Diminuisci porzioni" ${defaultPortions() <= 1 ? 'disabled' : ''}>−</button><span class="gen-stepper-val">${defaultPortions()} ${defaultPortions() === 1 ? 'persona' : 'persone'}</span><button type="button" class="qty-btn" data-gen-portions-inc aria-label="Aumenta porzioni" ${defaultPortions() >= 12 ? 'disabled' : ''}>+</button></span></div></div>
      <div class="onb-field"><div class="onb-lab">Come mangiate</div><div class="onb-chips">${diets}</div></div>
      <div class="onb-field"><div class="onb-lab">Allergie o intolleranze</div><div class="onb-chips">${allergies}</div>
        <p class="onb-note">Il menù le evita, ma controlla sempre le etichette. Le altre le aggiungi dopo, in Preferenze alimentari.</p></div>
    </div>
    <div class="onb-footer"><button type="button" class="btn is-solid is-block" data-onb-next>Avanti</button></div>
  </div>`;
  }
  return `
  <div class="sheet-page onb-screen is-final" data-page="onboarding">
    <div class="onb-hero">${hamster('pronti')}</div>
    <div class="onb-body">
      <h1 class="onb-title">Pronti per la prima settimana</h1>
      <p class="onb-text">Il menù si costruisce con le tue ricette. Puoi aggiungerle da zero, da un reel, da un sito o da un testo, anche con calma.</p>
    </div>
    <div class="onb-footer">
      <button type="button" class="btn is-solid is-block" data-onb-finish="generate">Genera il primo menù</button>
      <button type="button" class="btn is-outline is-block" data-onb-finish="recipes">Prima aggiungo le mie ricette</button>
    </div>
  </div>`;
}
document.addEventListener('click', e=>{
  const t = e.target;
  if(t.closest('[data-onb-next]')){ state.onbStep = 1; render(); return; }
  if(t.closest('[data-onb-allergy-none]')){ state.allergies = []; persist(); render(); return; }
  if(t.closest('[data-onb-skip]')){ state.onboardingDone = true; persist(); render(); return; }
  const fin = t.closest('[data-onb-finish]');
  if(fin){
    state.onboardingDone = true;
    if(fin.dataset.onbFinish === 'generate'){ state.tab = 'menu'; generateWeek(0); }
    else if(fin.dataset.onbFinish === 'recipes'){ state.tab = 'prep'; }
    persist(); render();
  }
});
// --- Regole generali: una pagina con sotto-pagine, come le altre Impostazioni ----------
// Valgono per tutta la famiglia. Quelle di una sola settimana stanno nella finestra
// dell'ingranaggio del Menù.
function genGramsSummary(){
  const g = state.portionGrams || {}, p = [];
  if(g.pasta > 0) p.push('Pasta ' + g.pasta + ' g');
  if(g.riso > 0) p.push('Riso ' + g.riso + ' g');
  return p.length ? p.join(' · ') : 'Come nelle ricette';
}
function genTargetsSummary(){
  const t = weekProteinTargets();
  return PROTEINA_ORDER.filter(k => k !== 'nessuna' && t[k][1] > 0).map(k => `${k === 'salumi' ? 'Salumi' : PROTEINA_LABEL[k]} ${t[k][0] === t[k][1] ? t[k][0] : t[k][0] + '–' + t[k][1]}`).join(' · ');
}
function genTargetRowsHtml(){
  const editing = state.genTargetEdit;
  return PROTEINA_ORDER.filter(k => k !== 'nessuna').map(k => {
    const [mn, mx] = weekProteinTargets()[k];
    const stp = (end, d, v, lab, off) => `<button type="button" data-gen-target="${k}" data-gen-target-end="${end}" data-gen-target-step="${d}" aria-label="${lab} ${PROTEINA_LABEL[k]}" ${off ? 'disabled' : ''}>${d < 0 ? '−' : '+'}</button>`;
    const pop = editing === k ? `
        <div class="qty-pop-backdrop" data-gen-target-close></div>
        <div class="qty-pop gen-target-pop" role="dialog" aria-label="${escapeAttr(PROTEINA_LABEL[k])} a settimana">
          <div class="gen-target-pr"><span>Almeno</span><span class="gen-sts">${stp(0, -1, mn, 'Meno minimo', mn <= 0)}<b>${mn}</b>${stp(0, 1, mn, 'Più minimo', mn >= mx)}</span></div>
          <div class="gen-target-pr"><span>Al massimo</span><span class="gen-sts">${stp(1, -1, mx, 'Meno massimo', mx <= mn)}<b>${mx}</b>${stp(1, 1, mx, 'Più massimo', mx >= 7)}</span></div>
          <button type="button" class="btn btn--primary qty-pop-done" data-gen-target-close>Fatto</button>
        </div>` : '';
    return `<div class="manage-row gen-inline-row"><span class="manage-row-icon">${PROTEINA_ICON[k] || ''}</span><span class="manage-row-main">${PROTEINA_LABEL[k]}</span><span class="gen-rv-wrap"><button type="button" class="gen-rv${editing === k ? ' on' : ''}" data-gen-target-open="${k}" aria-expanded="${editing === k}" aria-label="${escapeAttr(PROTEINA_LABEL[k])}: ${mn === mx ? mn : mn + ' a ' + mx} a settimana. Modifica"><u>${mn === mx ? mn : mn + '–' + mx}</u></button>${pop}</span></div>`;
  }).join('');
}
function genGramsRowsHtml(){
  return ['pasta', 'riso'].map(k => {
    const g = parseInt((state.portionGrams || {})[k], 10) || 0;
    return `<div class="manage-row gen-inline-row"><span class="manage-row-icon">${k === 'pasta' ? '🍝' : '🍚'}</span><span class="manage-row-main">${k === 'pasta' ? 'Pasta' : 'Riso'}</span><span class="gen-stepper"><button type="button" class="qty-btn" data-gen-grams="${k}" data-gen-grams-step="-10" aria-label="Meno grammi di ${k}" ${g <= 0 ? 'disabled' : ''}>−</button><span class="gen-stepper-val">${g > 0 ? g + ' g' : 'come nella ricetta'}</span><button type="button" class="qty-btn" data-gen-grams="${k}" data-gen-grams-step="10" aria-label="Più grammi di ${k}" ${g >= 150 ? 'disabled' : ''}>+</button></span></div>`;
  }).join('');
}
function prepDefaultIdx(){
  const d = parseInt(state.prepDayDefault, 10);
  return d >= 0 && d <= 6 ? d : WEEK_DISPLAY_ORDER[0];
}
// Nuovo primo giorno della settimana. I piatti restano ai giorni della
// settimana (lunedì resta lunedì): cambia da dove parte la settimana, quindi
// i giorni ai bordi possono cambiare data. La settimana 0 riparte da oggi.
function setWeekStartDay(idx){
  if(idx === weekStartIdx()) return;
  state.weekStartDay = idx;
  applyWeekStart();
  state.week0Start = isoLocalDate(upcomingSaturday());
  state.expandedDay = null;
  state.swapOpenDay = null;
  persist();
}
function genGoRow(go, icon, label, value, side){
  return `<button type="button" class="manage-row" data-gen-go="${go}"><span class="manage-row-icon">${icon}</span><span class="manage-row-main">${escapeHtml(label)}${!side && value ? `<span class="manage-row-sub">${escapeHtml(value.charAt(0).toUpperCase() + value.slice(1))}</span>` : ''}</span>${side ? `<span class="manage-row-side">${escapeHtml(value)}</span>` : ''}<span class="manage-row-chevron" aria-hidden="true">›</span></button>`;
}
function genAvoidPageHtml(){
  const allergies = state.allergies || [];
  return `
      <section class="settings-section gen-avoid">
        <h3 class="settings-section-title">⚠️ Allergie e intolleranze</h3>
        <p class="settings-note">Il menù le rispetta. Le ricette che le contengono hanno ⚠️.</p>
        <div class="gen-exclude-chips">${Object.keys(ALLERGEN_PRESETS).map(k => `<button type="button" class="gen-chip${allergies.includes(k) ? ' active' : ''}" data-gen-allergy="${escapeAttr(k)}" aria-pressed="${allergies.includes(k)}">${escapeHtml(k)}</button>`).join('')}${allergies.filter(k => !ALLERGEN_PRESETS[k]).map(w => `<button type="button" class="gen-chip active" data-gen-allergy="${escapeAttr(w)}" aria-label="Togli ${escapeAttr(w)}">${escapeHtml(w)} ✕</button>`).join('')}</div>
        <form class="gen-exclude-form" data-gen-allergy-form><input type="text" class="gen-exclude-input" placeholder="Altro, es. fragole" aria-label="Altra allergia o intolleranza" autocomplete="off"><button type="submit" class="btn is-outline">Aggiungi</button></form>
        <p class="settings-note gen-warn">Legge solo gli ingredienti scritti nelle ricette: non vede tracce o prodotti confezionati. Controlla sempre le etichette.</p>
      </section>
      <section class="settings-section gen-avoid">
        <h3 class="settings-section-title">🚫 Ingredienti che non piacciono</h3>
        <p class="settings-note">Le ricette con questi ingredienti non vengono scelte.</p>
        <div class="gen-exclude-chips">${(state.dietExclude || []).map((w, i) => `<button type="button" class="gen-chip active" data-gen-exclude-remove="${i}" aria-label="Togli ${escapeAttr(w)}">${escapeHtml(w)} ✕</button>`).join('')}</div>
        <form class="gen-exclude-form" data-gen-exclude-form><input type="text" class="gen-exclude-input" placeholder="es. noci, cipolla" aria-label="Ingrediente che non piace" autocomplete="off"><button type="submit" class="btn is-outline">Aggiungi</button></form>
      </section>`;
}
// Due pagine: "Generazione menù" (genGeneralOpen) e "Preferenze alimentari" (genFoodOpen).
function renderGenGeneralPage(){
  if(!state.genGeneralOpen && !state.genFoodOpen) return '';
  const food = !!state.genFoodOpen;
  const sub = state.genGeneralPage || null;
  let title = food ? 'Preferenze alimentari' : 'Generazione menù', body = '';
  if(sub === 'targets'){
    title = 'Obiettivi a settimana';
    body = `<p class="settings-note manage-intro">Quante volte a settimana, tra pranzi e cene. Tocca il numero per scegliere il minimo e il massimo. Sono i numeri in cima al Menù.</p>
      <section class="settings-section"><div class="settings-card manage-list">${genTargetRowsHtml()}</div></section>`;
  } else if(sub === 'avoid'){
    title = 'Da evitare';
    body = genAvoidPageHtml();
  } else if(food){
    const allergies = (state.allergies || []).join(', '), dislikes = (state.dietExclude || []).join(', ');
    body = `
      <p class="settings-note manage-intro">Valgono per tutta la famiglia e per tutte le settimane: il menù le rispetta.</p>
      <section class="settings-section">
        <h3 class="settings-section-title">Cosa si mangia</h3>
        <div class="settings-card manage-list">
          ${genGoRow('diet', '🥗', 'Alimentazione', DIET_TYPES[dietTypeNow()], true)}
        </div>
      </section>
      <section class="settings-section">
        <h3 class="settings-section-title">Da evitare</h3>
        <div class="settings-card manage-list">
          ${genGoRow('avoid', '⚠️', 'Allergie e intolleranze', allergies || 'Nessuna')}
          ${genGoRow('avoid', '🚫', 'Ingredienti che non piacciono', dislikes || 'Nessuno')}
        </div>
      </section>`;
  } else {
    body = `
      <p class="settings-note manage-intro">Valgono per tutte le settimane. Quelle di una sola settimana si cambiano dal Menù, con l'ingranaggio. Cosa mangiare e cosa evitare è in Preferenze alimentari.</p>
      <section class="settings-section">
        <h3 class="settings-section-title">La settimana</h3>
        <div class="settings-card manage-list">
          ${genGoRow('weekstart', '📅', 'Inizio settimana', dayNameOf(WEEK_DISPLAY_ORDER[0]) + ' · di solito il giorno della spesa')}
          ${genGoRow('prepday', '🔪', 'Giorno di meal prep', dayNameOf(prepDefaultIdx()))}
        </div>
      </section>
      <section class="settings-section">
        <h3 class="settings-section-title">Quanto si cucina</h3>
        <div class="settings-card manage-list">
          <div class="manage-row gen-inline-row"><span class="manage-row-icon">👥</span><span class="manage-row-main">Porzioni</span>
            <span class="gen-stepper"><button type="button" class="qty-btn" data-gen-portions-dec aria-label="Diminuisci porzioni" ${defaultPortions() <= 1 ? 'disabled' : ''}>−</button><span class="gen-stepper-val">${defaultPortions()} ${defaultPortions() === 1 ? 'persona' : 'persone'}</span><button type="button" class="qty-btn" data-gen-portions-inc aria-label="Aumenta porzioni" ${defaultPortions() >= 12 ? 'disabled' : ''}>+</button></span></div>
          <div class="manage-row gen-inline-row"><span class="manage-row-icon">🍱</span><span class="manage-row-main">Pranzo con l'avanzo<span class="manage-row-sub">I giorni li scegli ogni settimana</span></span>
            <button type="button" class="gen-toggle gen-toggle-inline" data-toggle-gen-leftover role="switch" aria-checked="${!!state.leftoverLunchOn}" aria-label="Pranzo con l'avanzo"><span class="gen-switch${state.leftoverLunchOn ? ' on' : ''}" aria-hidden="true"></span></button></div>
          ${genGoRow('grams', '🍝', 'Grammi a porzione', genGramsSummary())}
        </div>
      </section>
      <section class="settings-section">
        <h3 class="settings-section-title">Equilibrio</h3>
        <div class="settings-card manage-list">
          ${genGoRow('targets', '⚖️', 'Obiettivi a settimana', genTargetsSummary())}
        </div>
      </section>`;
  }
  return managePageHtml({ key: sub ? 'gen-general-' + sub : food ? 'gen-food' : 'gen-general', title, closeAttr: 'data-gen-general-back', body }) + genGeneralSheetHtml();
}
// "Grammi a porzione" e "Alimentazione": un pannellino dal basso sopra la pagina (DS-RegoleGenerali).
function genGeneralSheetHtml(){
  const which = state.genGeneralSheet;
  if(which !== 'grams' && which !== 'diet' && which !== 'weekstart' && which !== 'prepday') return '';
  const title = { grams: 'Grammi a porzione', diet: 'Alimentazione', weekstart: 'Inizio settimana', prepday: 'Giorno di meal prep' }[which];
  const dayBtns = (attr, cur) => `<div class="gen-days gen-week-days">${WEEK_DISPLAY_ORDER.map(d => `<button type="button" class="gen-day${cur === d ? ' active' : ''}" ${attr}="${d}" aria-pressed="${cur === d}" aria-label="${escapeAttr(dayNameOf(d))}">${escapeHtml(dayNameOf(d).slice(0, 3))}</button>`).join('')}</div>`;
  const body = which === 'weekstart'
    ? `${dayBtns('data-gen-weekstart', WEEK_DISPLAY_ORDER[0])}
       <p class="gen-note">Il giorno da cui parte il Menù: scegli quello in cui fai la spesa. Il menù già fatto resta ai giorni della settimana, quindi i giorni ai bordi possono cambiare data: conviene cambiarlo quando generi la settimana nuova.</p>`
    : which === 'prepday'
    ? `${dayBtns('data-gen-prepday', prepDefaultIdx())}
       <p class="gen-note">Il giorno in cui prepari in anticipo i piatti della settimana. Ogni settimana lo puoi spostare dal riquadro Prep nel Menù.</p>`
    : which === 'grams'
    ? `<p class="gen-note">Le quantità di pasta e riso nelle ricette si portano a questi grammi a testa, in Spesa, nel dettaglio e in cucina.</p>
       <div class="manage-list">${genGramsRowsHtml()}</div>`
    : `<div class="gen-days gen-diet-types">${Object.entries(DIET_TYPES).map(([k, l]) => `<button type="button" class="gen-day gen-diet-btn${dietTypeNow() === k ? ' active' : ''}" data-gen-diet="${k}" aria-pressed="${dietTypeNow() === k}">${l}</button>`).join('')}</div>
       <p class="gen-note">Con pescetariano e vegetariano il menù non sceglie piatti con carne (e con pesce, per i vegetariani) e gli obiettivi settimanali si adattano: li ritocchi in Obiettivi a settimana.</p>`;
  return `
    <div class="move-backdrop gen-mini-backdrop" data-gen-sheet-close>
      <div class="move-sheet gen-sheet gen-mini-sheet" role="dialog" aria-label="${escapeAttr(title)}" data-stop-close>
        <div class="move-handle" aria-hidden="true"></div>
        <div class="dsh-head">
          <div class="dsh-head-text"><h2 class="move-title">${escapeHtml(title)}</h2></div>
          <button type="button" class="btn is-icon dsh-close" data-gen-sheet-close aria-label="Chiudi"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
        </div>
        <div class="gen-body">${body}</div>
        <div class="gen-footer"><button type="button" class="btn is-solid gen-go" data-gen-sheet-close>Fatto</button></div>
      </div>
    </div>`;
}
document.addEventListener('click', e=>{
  const go = e.target.closest('[data-gen-go]');
  if(go && ['grams', 'diet', 'weekstart', 'prepday'].includes(go.dataset.genGo)){ state.genGeneralSheet = go.dataset.genGo; render(); return; }
  if(go){ state.genGeneralPage = go.dataset.genGo; state.genTargetEdit = null; render(); return; }
  const back = e.target.closest('[data-gen-general-back]');
  if(back){
    if(!isCloseTap(e, back)) return;
    state.genTargetEdit = null;
    if(state.genGeneralPage) state.genGeneralPage = null; else { state.genGeneralOpen = false; state.genFoodOpen = false; }
    render();
  }
});
function renderMembersPage(){
  if(!state.membersOpen) return '';
  const list = familyMembers();
  const cards = list.map(m => `
        <div class="settings-card member-card" data-member="${escapeAttr(m.id)}">
          <div class="member-head"><span class="settings-avatar" style="background:${escapeAttr(memberColor(m.id))}" aria-hidden="true">${escapeHtml((((state.userEmojis || {})[m.id]) || memberName(m.id).charAt(0) || '?').toString().toUpperCase())}</span>
            ${canEditMember(m.id)
              ? `<input type="text" class="member-name" data-member-name="${escapeAttr(m.id)}" value="${escapeAttr(m.name || '')}" placeholder="Nome" maxlength="24" autocomplete="off" aria-label="Nome">`
              : `<span class="member-name-fixed">${escapeHtml(memberName(m.id))}</span>`}
          </div>
          ${canEditMember(m.id) ? `<div class="color-swatch-row">${USER_COLOR_PRESETS.map(c => `<button type="button" class="color-swatch${memberColor(m.id) === c ? ' active' : ''}" style="background:${c}" data-member-color="${c}" data-member-id="${escapeAttr(m.id)}" aria-label="Scegli questo colore"></button>`).join('')}</div>` : ''}
          ${list.length > 1 && m.manual ? `<button type="button" class="btn is-outline settings-item-danger member-remove" data-member-remove="${escapeAttr(m.id)}">Togli ${escapeHtml(memberName(m.id))}</button>` : ''}
        </div>`).join('');
  const body = `
      <section class="settings-section">
        <h3 class="settings-section-title">Chi mangia e cucina</h3>
        ${cards}
        ${list.length < MEMBERS_MAX ? `<button type="button" class="btn is-outline is-block" data-member-add>${uiIcon('plus')} Aggiungi una persona</button>` : ''}
        ${activeRoute && activeRoute.famId ? `<div class="settings-card invite-card">
          ${state.inviteCode ? `<div class="invite-code" aria-live="polite">${escapeHtml(state.inviteCode)}</div><p class="settings-note">Dallo a chi deve entrare: vale una volta sola. Dopo aver creato l'account sceglie "Entra" e lo scrive.</p>` : ''}
          <button type="button" class="btn is-outline is-block" data-make-invite>${state.inviteCode ? 'Nuovo codice' : 'Invita una persona con un codice'}</button>
          <p class="settings-note" id="invite-status"></p>
        </div>` : ''}
        <p class="settings-note">Nome e colore compaiono nel Menù, dove si sceglie chi cucina. Ognuno sceglie i propri dal suo Profilo; qui si modificano quelli delle persone aggiunte a mano.</p>
      </section>`;
  return managePageHtml({ key: 'members', title: 'Persone', closeAttr: 'data-close-members', body });
}
document.addEventListener('click', e=>{
  const t = e.target;
  const closeEl = t.closest('[data-close-members]');
  if(closeEl){ if(!isCloseTap(e, closeEl)) return; state.membersOpen = false; render(); return; }
  const col = t.closest('[data-member-color]');
  if(col){ state.userColors[col.dataset.memberId] = col.dataset.memberColor; applyUserColors(); persist(); render(); return; }
  if(t.closest('[data-make-invite]')){
    const st = document.getElementById('invite-status');
    makeInvite().then(code => { state.inviteCode = code; render(); }).catch(() => { if(st) st.textContent = 'Non sono riuscito a creare il codice, riprova.'; });
    return;
  }
  if(t.closest('[data-member-add]')){
    const list = familyMembers();
    if(list.length >= MEMBERS_MAX) return;
    const id = 'p' + Date.now().toString(36);
    const used = new Set(list.map(m => memberColor(m.id)));
    state.members = [...list, { id, name: 'Persona ' + (list.length + 1), manual: true }];
    state.userColors[id] = USER_COLOR_PRESETS.find(c => !used.has(c)) || USER_COLOR_PRESETS[list.length % USER_COLOR_PRESETS.length];
    applyUserColors(); persist(); render(); return;
  }
  const rm = t.closest('[data-member-remove]');
  if(rm){
    const id = rm.dataset.memberRemove, list = familyMembers();
    if(list.length <= 1) return;
    const nome = memberName(id);
    if(!confirm(`Togliere ${nome}? I turni di cucina assegnati a ${nome} restano senza nome.`)) return;
    state.members = list.filter(m => m.id !== id);
    Object.keys(state.cooks).forEach(k => { if(state.cooks[k] === id) delete state.cooks[k]; });
    Object.keys(state.shopAssignees).forEach(k => { if(state.shopAssignees[k] === id) delete state.shopAssignees[k]; });
    persist(); render();
  }
});
document.addEventListener('change', e=>{
  if(!e.target.dataset || !e.target.dataset.memberName) return;
  const m = memberById(e.target.dataset.memberName);
  if(!m) return;
  const name = e.target.value.trim();
  if(!name){ e.target.value = m.name || ''; return; }
  state.members = familyMembers().map(x => x.id === m.id ? Object.assign({}, x, { name }) : x);
  persist(); render();
});
function renderAppearancePage(){
  if(!state.appearanceOpen) return '';
  const theme = currentTheme();
  const accent = localStorage.getItem(ACCENT_KEY) || ACCENT_PRESETS[0];
  const themes = [['system', 'Sistema'], ['light', 'Chiaro'], ['dark', 'Scuro']];
  const user = getCurrentUser();
  const body = `
      <section class="settings-section">
        <h3 class="settings-section-title">Tema</h3>
        <div class="settings-card">
          <div class="theme-toggle-row">${themes.map(([v, l]) => `<button type="button" class="btn is-outline theme-btn${theme === v ? ' active' : ''}" data-theme-choice="${v}">${l}</button>`).join('')}</div>
        </div>
      </section>
      <section class="settings-section">
        <h3 class="settings-section-title">Colore d'accento</h3>
        <div class="settings-card">
          <div class="color-swatch-row">${ACCENT_PRESETS.map(c => `<button type="button" class="color-swatch${accent === c ? ' active' : ''}" style="background:${c}" data-accent-color="${c}" aria-label="Scegli questo colore"></button>`).join('')}</div>
        </div>
        <p class="settings-note">Tema e colore valgono solo su questo telefono.</p>
      </section>`;
  return managePageHtml({ key: 'appearance', title: 'Tema e colori', closeAttr: 'data-close-appearance', body });
}
document.addEventListener('click', e=>{
  const t = e.target;
  const closeEl = t.closest('[data-close-appearance]');
  if(closeEl){
    if(!isCloseTap(e, closeEl)) return;
    state.appearanceOpen = false; render(); return;
  }
  const th = t.closest('[data-theme-choice]');
  if(th){ applyTheme(th.dataset.themeChoice); render(); return; }
  const ac = t.closest('[data-accent-color]');
  if(ac){ applyAccent(ac.dataset.accentColor); render(); return; }
  const uc = t.closest('[data-user-color]');
  if(uc){
    const user = getCurrentUser();
    if(!user) return;
    state.userColors[user] = uc.dataset.userColor;
    applyUserColors(); persist(); render();
  }
});
// --- Scadenze stimate (Impostazioni) ----------------------------------------
// Quanti giorni dura un fresco appena comprato, per reparto, più eccezioni per
// nome (es. le uova). Le stime partono già compilate in Spesa e Dispensa.
function expiryDaysLabel(n){ return n > 0 ? `${n} ${n === 1 ? 'giorno' : 'giorni'}` : 'nessuna stima'; }
function expiryDaysHtml(days, field){
  return `<span class="expiry-days">
    <input type="text" inputmode="numeric" maxlength="4" class="qty-input expiry-days-input" data-expiry-days="${escapeAttr(field)}" value="${days > 0 ? days : '—'}" aria-label="Giorni (— = nessuna stima)" onfocus="this.select()">
    <span class="expiry-days-unit">gg</span>
  </span>`;
}
function expiryIngredientNames(){
  const seen = new Map();
  allKnownIngredientNames().concat(Object.values(state.pantryItems || {}).map(it => it.nome)).forEach(n=>{
    const k = String(n || '').trim().toLowerCase();
    if(k && !seen.has(k)) seen.set(k, String(n).trim());
  });
  return [...seen.values()].sort((a, b) => IT_COLLATOR.compare(a, b));
}
function renderExpiryEstimatesPage(){
  if(!state.expiryEstOpen) return '';
  const depts = DEPT_ORDER.filter(d => d !== 'finiti' && d !== 'avanzi' && !isNonFoodDept(d))
    .sort((a, b) => IT_COLLATOR.compare(DEPT_LABEL[a], DEPT_LABEL[b]));
  const deptRows = depts.map(d => `
      <div class="manage-row expiry-row">
        <span class="manage-row-icon">${DEPT_ICON[d] || ''}</span>
        <span class="manage-row-main">${escapeHtml(DEPT_LABEL[d])}</span>
        ${expiryDaysHtml(expiryDaysForDept(d), 'dept:' + d)}
      </div>`).join('');
  const rules = Object.entries(state.expiryRules || {});
  const ruleRows = rules.map(([id, r]) => `
      <div class="manage-row expiry-row expiry-rule">
        <input type="text" class="expiry-rule-match" data-expiry-rule-name="${escapeAttr(id)}" value="${escapeAttr(r.nome || '')}" placeholder="Scegli un ingrediente" aria-label="Ingrediente" autocomplete="off">
        ${expiryDaysHtml(Number(r.days) || 0, 'rule:' + id)}
        <button type="button" class="btn is-icon" data-expiry-rule-del="${escapeAttr(id)}" aria-label="Togli la regola">✕</button>
      </div>`).join('');
  const body = `
      <p class="settings-note manage-intro">Per i freschi l'app propone una scadenza dalla data di acquisto: qui scegli quanti giorni. Il numero è sempre una stima, la data vera la cambi tu quando spunti in Spesa o nella scheda dell'ingrediente. Scrivi il numero di giorni: con il trattino (—) non propone niente.</p>
      <section class="settings-section">
        <h3 class="settings-section-title">Per reparto</h3>
        <div class="settings-card manage-list">${deptRows}</div>
      </section>
      <section class="settings-section">
        <h3 class="settings-section-title">Eccezioni per ingrediente</h3>
        <p class="settings-note">Valgono più del reparto: per quell'ingrediente preciso si usano i giorni indicati. Scrivi il nome e scegli dall'elenco.</p>
        ${ruleRows ? `<div class="settings-card manage-list">${ruleRows}</div>` : ''}
        <button type="button" class="btn is-outline is-block" data-expiry-rule-add>+ Nuova eccezione</button>
      </section>
      <button type="button" class="btn is-outline is-block" data-expiry-reset>Ripristina i valori di partenza</button>`;
  return managePageHtml({ key: 'expiry-est', title: 'Scadenze stimate', closeAttr: 'data-close-expiry-est', body });
}
document.addEventListener('click', e=>{
  const t = e.target;
  const closeEl = t.closest('[data-close-expiry-est]');
  if(closeEl){
    if(!isCloseTap(e, closeEl)) return;
    state.expiryEstOpen = false; render(); return;
  }
  const del = t.closest('[data-expiry-rule-del]');
  if(del){ delete state.expiryRules[del.dataset.expiryRuleDel]; persist(); render(); return; }
  if(t.closest('[data-expiry-rule-add]')){
    if(!state.expiryRules) state.expiryRules = {};
    state.expiryRules['r' + Date.now().toString(36)] = { nome: '', days: 7 };
    persist(); render();
    const inputs = document.querySelectorAll('.expiry-rule-match'); const last = inputs[inputs.length - 1]; if(last) last.focus();
    return;
  }
  if(t.closest('[data-expiry-reset]')){
    state.expiryEstimates = {}; state.expiryRules = defaultExpiryRules();
    persist(); render(); return;
  }
});
document.addEventListener('change', e=>{
  const dayInp = e.target.closest && e.target.closest('[data-expiry-days]');
  if(dayInp){
    const [kind, id] = [dayInp.dataset.expiryDays.split(':')[0], dayInp.dataset.expiryDays.slice(dayInp.dataset.expiryDays.indexOf(':') + 1)];
    const n = Math.max(0, Math.min(3650, parseInt(dayInp.value, 10) || 0));
    if(kind === 'dept'){
      if(!state.expiryEstimates) state.expiryEstimates = {};
      if(n === (EXPIRY_ESTIMATE_DAYS[id] || 0)) delete state.expiryEstimates[id]; else state.expiryEstimates[id] = n;
    } else if(state.expiryRules && state.expiryRules[id]) state.expiryRules[id].days = n;
    persist(); render();
    return;
  }
  const inp = e.target.closest && e.target.closest('[data-expiry-rule-name]');
  if(!inp) return;
  const r = (state.expiryRules || {})[inp.dataset.expiryRuleName]; if(!r) return;
  const typed = inp.value.trim();
  // Nome esatto dell'ingrediente (come scritto nell'elenco), se c'è.
  const exact = expiryIngredientNames().find(n => n.toLowerCase() === typed.toLowerCase());
  r.nome = exact || typed;
  persist(); render();
});
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

// Trascinamento delle righe in "Ordine spesa": stessa idea delle corsie, con
// la maniglia ⠿ a sinistra di ogni riga.
(function(){
  let drag = null; // { row, list, pointerId, lastY, raf }
  const reorder = () => {
    const rows = [...drag.list.querySelectorAll('[data-order-row]')].filter(r => r !== drag.row);
    const next = rows.find(r => { const b = r.getBoundingClientRect(); return drag.lastY < b.top + b.height / 2; });
    if(next){ if(drag.row.nextElementSibling !== next) drag.list.insertBefore(drag.row, next); }
    else if(drag.list.lastElementChild !== drag.row) drag.list.appendChild(drag.row);
  };
  const autoScroll = () => {
    if(!drag) return;
    const edge = 70, h = window.innerHeight;
    const dy = drag.lastY < edge ? -10 : drag.lastY > h - edge ? 10 : 0;
    if(dy){ window.scrollBy(0, dy); reorder(); }
    drag.raf = requestAnimationFrame(autoScroll);
  };
  document.addEventListener('pointerdown', e=>{
    const handle = e.target.closest && e.target.closest('[data-order-handle]');
    if(!handle) return;
    const row = handle.closest('[data-order-row]');
    e.preventDefault();
    drag = { row, list: row.parentElement, pointerId: e.pointerId, lastY: e.clientY };
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
    const order = [...drag.list.querySelectorAll('[data-order-row]')].map(r => r.dataset.orderRow);
    drag.row.classList.remove('is-dragging');
    drag = null;
    state.shopOrderCustom = shopOrderMerge(order);
    persist(); render();
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
    autoFillRipieni(weekIdx, i, meal);
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
          <button type="button" class="btn is-outline" data-import-paste>${uiIcon('clipboard')} Incolla dagli appunti</button>
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
document.addEventListener('change', e=>{
  const sel = e.target.closest && e.target.closest('[data-cards-sort]');
  if(sel){ state.cardsSort = sel.value === 'az' ? 'az' : 'freq'; persist(); render(); }
});
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
      <label class="shop-group-by cards-sort"><span>Ordina per</span>
        <select data-cards-sort aria-label="Ordina per">
          <option value="freq" ${state.cardsSort !== 'az' ? 'selected' : ''}>Frequenza d'uso</option>
          <option value="az" ${state.cardsSort === 'az' ? 'selected' : ''}>Ordine alfabetico</option>
        </select>
      </label>
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
            ${canScan ? `<label class="btn is-outline card-scan">${uiIcon('camera')} Scansiona<input type="file" accept="image/*" capture="environment" id="card-scan-input" hidden></label>` : ''}
          </div>
          ${state.cardScanMsg ? `<p class="settings-note">${escapeHtml(state.cardScanMsg)}</p>` : ''}
          <div class="settings-field-label">Logo</div>
          <div class="card-logo-row">
            ${d.logo ? `<img class="card-manage-logo is-big" src="${escapeAttr(d.logo)}" alt="" style="background:${escapeAttr(d.color || CARD_COLORS[0])}">` : ''}
            <label class="btn is-outline card-scan">${uiIcon('photo')} ${d.logo ? 'Cambia' : 'Scegli immagine'}<input type="file" accept="image/*" id="card-logo-input" hidden></label>
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
  if(manage){ state.cardsOpen = 'list'; state.cardsListUnder = false; render(); return; }
  const view = t.closest('[data-card-view]');
  if(view){
    state.cardViewId = view.dataset.cardView;
    const opened = (state.loyaltyCards || []).find(c => c.id === state.cardViewId);
    if(opened){ opened.uses = (opened.uses || 0) + 1; persist(); }
    render(); return;
  }
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
  await resolveFamilyRoute();
  await loadState();
  ensureSelfMember();
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
let autoBackupCache = [];
async function refreshAutoBackupCache(){
  const all = await autoBackupList();
  const sig = all.map(s => s.id).join(',');
  if(sig !== autoBackupCache.map(s => s.id).join(',')){
    autoBackupCache = all;
    if(state.backupOpen) render();
  }
}
function refreshBackupStatus(){
  refreshAutoBackupCache();
  if(state.backupOpen) render();
}
function renderBackupPage(){
  if(!state.backupOpen) return '';
  const rows = autoBackupCache.map(s => `<div class="auto-backup-row"><span>${escapeHtml(backupDateLabel(s.id))}</span><button type="button" class="btn is-chip" data-auto-backup-restore="${escapeAttr(s.id)}">Ripristina</button></div>`).join('');
  const body = `
      <p class="settings-note manage-intro">Una copia di Dispensa, menù, spesa e ricette, da ripristinare se qualcosa va storto. Le foto dei piatti non sono incluse.</p>
      <section class="settings-section">
        <h3 class="settings-section-title">Backup su file</h3>
        <div class="settings-card">
          <p class="settings-card-text" id="backup-status">${backupStatusHtml()}</p>
          <div class="backup-row">
            <button class="btn is-outline" id="backup-download" type="button">${uiIcon('download')} Scarica backup</button>
            <label class="btn is-outline backup-restore-label">${uiIcon('upload')} Ripristina da file<input type="file" id="backup-restore-input" accept="application/json,.json" hidden></label>
          </div>
        </div>
      </section>
      <section class="settings-section">
        <h3 class="settings-section-title">Backup automatico</h3>
        <div class="settings-card">
          <label class="settings-toggle"><input type="checkbox" id="auto-backup-toggle" ${autoBackupEnabled() ? 'checked' : ''}><span>Backup automatico ogni mese</span></label>
          <p class="settings-note">Ogni mese l'app salva da sola una copia su questo telefono (tiene le ultime ${AUTO_BACKUP_KEEP}). Per averne una anche fuori dal telefono, scarica il file.</p>
          ${rows ? `<div class="auto-backup-list"><div class="settings-field-label">Copie automatiche su questo telefono</div>${rows}</div>` : ''}
        </div>
      </section>`;
  return managePageHtml({ key: 'backup', title: 'Backup', closeAttr: 'data-close-backup', body });
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
document.addEventListener('click', async e=>{
  const t = e.target;
  const closeEl = t.closest('[data-close-backup]');
  if(closeEl){
    if(!isCloseTap(e, closeEl)) return;
    state.backupOpen = false; render(); return;
  }
  if(t.closest('#backup-download')){ downloadBackup(); render(); return; }
  const rb = t.closest('[data-auto-backup-restore]');
  if(rb){
    const snap = (await autoBackupList()).find(s => s.id === rb.dataset.autoBackupRestore);
    if(!snap) return;
    const err = restoreBackup(snap.data);
    if(err) window.alert(err); else { state.backupOpen = false; closeSettingsBackdrop(); render(); }
  }
});
document.addEventListener('change', async e=>{
  const t = e.target;
  if(t.id === 'auto-backup-toggle'){
    try{ if(t.checked) localStorage.removeItem(AUTO_BACKUP_OFF_KEY); else localStorage.setItem(AUTO_BACKUP_OFF_KEY, '1'); }catch(err){}
    if(t.checked) maybeAutoBackup();
    return;
  }
  if(t.id === 'backup-restore-input'){
    const file = t.files && t.files[0];
    t.value = '';
    if(!file) return;
    let data = null;
    try{ data = JSON.parse(await file.text()); }catch(err){ /* non è JSON */ }
    const err = restoreBackup(data);
    if(err) window.alert(err);
    else { state.backupOpen = false; closeSettingsBackdrop(); render(); }
  }
});
// Copia del mese: poco dopo l'avvio (a dati caricati) e quando si torna all'app.
setTimeout(maybeAutoBackup, 10000);
document.addEventListener('visibilitychange', ()=>{ if(!document.hidden) setTimeout(maybeAutoBackup, 3000); });

// Impostazioni: voci che aprono le pagine di gestione, e ricerca.
document.addEventListener('click', e=>{
  const go = e.target.closest('[data-settings-go]');
  if(!go) return;
  const what = go.dataset.settingsGo;
  // Le Impostazioni restano aperte sotto: chiusa la pagina si torna all'elenco.
  const tabFor = { ingredients:'dispensa', groups:'dispensa', depts:'dispensa', recurring:'dispensa' }[what];
  if(tabFor && state.tab !== tabFor){ if(!state.settingsReturnTab) state.settingsReturnTab = state.tab; state.tab = tabFor; }
  if(what === 'gen'){ state.genGeneralOpen = true; state.genGeneralPage = null; }
  else if(what === 'food'){ state.genFoodOpen = true; state.genGeneralPage = null; }
  else if(what === 'ingredients') state.ingredientManagerOpen = true;
  else if(what === 'groups') state.pantryGroupsModalOpen = true;
  else if(what === 'depts') state.deptsModalOpen = true;
  else if(what === 'aisles') state.aisleOrderOpen = true;
  else if(what === 'expiry') state.expiryEstOpen = true;
  else if(what === 'recurring'){ state.recurringOpen = true; state.recurringEditId = null; state.recurringDraft = null; }
  else if(what === 'members') state.membersOpen = true;
  else if(what === 'appearance') state.appearanceOpen = true;
  else if(what === 'profile') state.profileOpen = true;
  else if(what === 'newrecipe'){ state.newRecipeModalOpen = true; state.newRecipeError = ''; state.newRecipeName = ''; setTimeout(()=>{ const el = document.getElementById('new-recipe-name'); if(el) el.focus(); }, 80); }
  else if(what === 'import'){ if(state.tab !== 'prep' && !state.settingsReturnTab) state.settingsReturnTab = state.tab; state.recipeImport = { name: '', link: '', text: '' }; }
  else if(what === 'backup'){ state.backupOpen = true; refreshAutoBackupCache(); }
  render();
});
document.querySelectorAll('[data-ico]').forEach(el=>{ el.innerHTML = uiIcon(el.dataset.ico); });
refreshProfileLink();
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
  // Versione = il numero di app.js?v=N di questa pagina. Se la pagina sul
  // server ne ha uno più alto, ne è uscita una nuova: sottotitolo + badge.
  const verMatch = ((document.querySelector('script[src*="app.js"]') || {}).src || '').match(/app\.js\?v=(\d+)/);
  const curVer = verMatch ? parseInt(verMatch[1], 10) : null;
  const sub = btn.querySelector('small');
  const paintVersion = isNew => {
    if(sub && curVer) sub.textContent = `Versione ${curVer}${isNew ? ' · nuova disponibile' : ''}`;
    let badge = btn.querySelector('.settings-badge-new');
    if(isNew && !badge){ badge = document.createElement('span'); badge.className = 'settings-badge-new'; badge.textContent = 'Nuova'; btn.appendChild(badge); }
    if(!isNew && badge) badge.remove();
  };
  let lastCheck = 0;
  const checkNewVersion = async ()=>{
    if(!curVer || Date.now() - lastCheck < 60000 || navigator.onLine === false) return;
    lastCheck = Date.now();
    try{
      const res = await fetch(window.location.pathname, { cache: 'no-store' });
      const m = (await res.text()).match(/app\.js\?v=(\d+)/);
      paintVersion(!!m && parseInt(m[1], 10) > curVer);
    }catch(e){ /* offline: resta il testo di base */ }
  };
  paintVersion(false);
  setTimeout(checkNewVersion, 3000);
  const settingsEl = document.getElementById('settings-backdrop');
  if(settingsEl) new MutationObserver(()=>{ if(settingsEl.classList.contains('open')) checkNewVersion(); }).observe(settingsEl, { attributes: true, attributeFilter: ['class'] });
  btn.addEventListener('click', async ()=>{
    btn.disabled = true;
    // Cambia solo il testo: icona, riga e badge restano dove sono.
    const label = btn.querySelector('.settings-link-text');
    if(label){ label.firstChild.nodeValue = 'Aggiornamento…'; const sm = label.querySelector('small'); if(sm) sm.textContent = 'Un attimo, riapro l\'app'; }
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
