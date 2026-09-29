// Test automatici di CookPOP: aprono l'app vera in Chromium headless (via
// Playwright), con Firebase bloccato — lo stato vive solo in localStorage —
// e controllano le parti più delicate della logica.
//
//   node tests/run.js            tutti i test
//   node tests/run.js rollover   solo quelli il cui nome contiene "rollover"
//
// Serve Playwright con Chromium: `npm i -D playwright && npx playwright
// install chromium`, oppure uno già installato globalmente (vedi loadPlaywright).
const http = require('http');
const fs = require('fs');
const path = require('path');

function loadPlaywright(){
  const candidates = ['playwright', '/opt/node22/lib/node_modules/playwright'];
  for(const c of candidates){ try{ return require(c); }catch(e){} }
  console.error('Playwright non trovato: npm i -D playwright');
  process.exit(2);
}
const { chromium } = loadPlaywright();

const ROOT = path.resolve(__dirname, '..');
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.json':'application/json', '.png':'image/png', '.svg':'image/svg+xml' };
function startServer(){
  const server = http.createServer((req, res)=>{
    const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html';
    const file = path.join(ROOT, rel);
    if(!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()){ res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise(r => server.listen(0, '127.0.0.1', ()=> r(server)));
}

const tests = [];
const test = (name, fn, opts) => tests.push({ name, fn, opts });
function assert(cond, msg){ if(!cond) throw new Error(msg || 'asserzione fallita'); }
function eq(a, b, msg){ if(JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${msg || 'diversi'}: ${JSON.stringify(a)} ≠ ${JSON.stringify(b)}`); }

// Apre l'app. `saved` (facoltativo) è lo stato personale già in cache, come
// lo troverebbe un utente di ritorno; il "Novità" è segnato come già visto.
async function openApp(ctx, baseUrl, saved){
  const page = await ctx.newPage();
  page.errors = [];
  page.on('pageerror', e => page.errors.push(e.message));
  if(saved) await page.addInitScript(s => localStorage.setItem('quaderno-state-default', s), JSON.stringify(saved));
  await page.goto(baseUrl + '/index.html');
  await page.waitForFunction(() => typeof state !== 'undefined' && document.querySelector('#panel') && document.querySelector('#panel').children.length > 0, null, { timeout: 15000 });
  await page.evaluate(() => { state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, { [whatsNewViewerKey()]: WHATS_NEW.version }); render(); });
  return page;
}

// ---------------------------------------------------------------- test

test('avvio: nessun errore e tutte le schede si disegnano', async ({ page }) => {
  for(const tab of ['menu', 'spesa', 'dispensa', 'prep']){
    const len = await page.evaluate(t => { state.tab = t; render(); return document.querySelector('#panel').innerHTML.length; }, tab);
    assert(len > 200, `scheda ${tab} vuota`);
  }
  eq(page.errors, [], 'errori JS');
});

test('catalogo: DATA caricato da catalog.js', async ({ page }) => {
  const n = await page.evaluate(() => Object.keys(DATA.recipeDetails).length);
  assert(n > 100, `solo ${n} ricette`);
});

test('generatore: settimana nuova piena, pranzo e cena diversi, niente contorni da soli', async ({ page }) => {
  const res = await page.evaluate(() => {
    state.extraWeeks = []; generateWeek(1);
    const out = [];
    for(let i = 0; i < 7; i++) for(const meal of ['pranzo','cena']){
      const m = effectiveMeal(1, i, meal);
      out.push({ i, meal, p: m.principale, tip: m.principale ? (getRecipeMeta(m.principale) || {}).tipologia : null, linked: !!state.dayLinks[`1_${i}_${meal}`] });
    }
    return out;
  });
  const empty = res.filter(r => !r.p && !r.linked);
  eq(empty.map(r => `${r.i}_${r.meal}`), [], 'pasti vuoti');
  const sideOnly = res.filter(r => r.tip === 'contorno');
  eq(sideOnly.map(r => r.p), [], 'contorno come piatto principale');
  for(let i = 0; i < 7; i++){
    const [p, c] = res.filter(r => r.i === i);
    if(p.p && c.p && !p.linked && !c.linked) assert(p.p !== c.p, `giorno ${i}: stesso piatto a pranzo e cena`);
  }
});

test('generatore: i pasti bloccati restano uguali', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.extraWeeks = []; generateWeek(1);
    const before = effectiveMeal(1, 2, 'cena').principale;
    state.mealLocked['1_2_cena'] = true;
    generateWeek(1);
    return [before, effectiveMeal(1, 2, 'cena').principale];
  });
  eq(r[1], r[0], 'pasto bloccato cambiato');
});

test('rollover: la settimana dopo diventa la corrente, con le sue chiavi', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.extraWeeks = []; generateWeek(1);
    const prev = new Date(upcomingSaturday()); prev.setDate(prev.getDate() - 7);
    state.week0Start = isoLocalDate(prev); // come se i dati fossero di sabato scorso
    const next = effectiveMeal(1, 3, 'cena').principale;
    state.mealLocked = { '0_1_cena': true, '1_3_cena': true };
    state.cooks = { '1_4_cena': 'ste' };
    state.shopChecked = { 'd1_cena_x': true, 'd1_3_pranzo_y': true };
    render();
    return { now: effectiveMeal(0, 3, 'cena').principale, next, extra: state.extraWeeks.length,
      locked: state.mealLocked, cooks: state.cooks, shop: state.shopChecked, start: state.week0Start, want: isoLocalDate(upcomingSaturday()) };
  });
  eq(r.start, r.want, 'week0Start');
  eq(r.now, r.next, 'menù non spostato');
  eq(r.extra, 0, 'settimane extra');
  eq(r.locked, { '0_3_cena': true }, 'blocchi');
  eq(r.cooks, { '0_4_cena': 'ste' }, 'cuochi');
  eq(r.shop, { 'd3_pranzo_y': true }, 'spunte Spesa');
  eq(r.start, r.want, 'week0Start');
});

test('rollover: nessuno spostamento se la settimana è quella giusta', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.mealLocked = { '0_1_cena': true }; render(); render();
    return state.mealLocked;
  });
  eq(r, { '0_1_cena': true });
});

test('sync: buildFirebasePatch scrive solo le chiavi cambiate', async ({ page }) => {
  const patch = await page.evaluate(() => buildFirebasePatch(
    { shopChecked: { a: true, b: true }, tab: 'menu', extraWeeks: [1] },
    { shopChecked: { a: true, c: true }, tab: 'menu', extraWeeks: [] },
    ['shopChecked']));
  eq(patch, { 'shopChecked/b': true, 'shopChecked/c': null, extraWeeks: [1] });
});

test('migrazioni: uno stato vecchio (una ricetta al giorno) viene convertito', async ({ page }) => {
  // pagina aperta con lo stato vecchio in cache, vedi `saved` più sotto
  const r = await page.evaluate(() => ({
    cena: state.weekOverrides[2] && state.weekOverrides[2].cena && state.weekOverrides[2].cena.principale,
    link: state.dayLinks['0_3_cena'],
    cooks: state.cooks,
    qty: state.pantryItems['pasta'] && state.pantryItems['pasta'].qty,
    tempo: state.weekTempoBase,
    flags: MIGRATIONS.every(m => state[m.flag] === true)
  }));
  eq(r.cena, 'Pasta al pesto', 'weekOverrides');
  eq(r.link, '0_2_cena', 'dayLinks');
  eq(r.cooks, { '0_2_cena': 'mara' }, 'cooks');
  eq(r.qty, 1, 'quantità dispensa');
  eq(r.tempo, 'veloce', 'tempo');
  assert(r.flags, 'flag di migrazione non tutti a true');
  eq(page.errors, [], 'errori JS');
}, {
  saved: {
    weekOverrides: { 2: 'Pasta al pesto' }, weekOverridePicked: { 2: true },
    dayLinks: { '0_3': '0_2' }, cooks: { '0_2': 'mara' },
    pantryItems: { pasta: { nome: 'Pasta', quantita: '2 pacchi' } },
    dayTempoCap: { 0: 'veloce', 1: 'veloce', 2: 'veloce', 3: 'normale' }
  }
});

test('digitazione: il cursore resta dov\'era anche se la ricerca ridisegna la pagina', async ({ page }) => {
  await page.evaluate(() => { state.tab = 'prep'; state.prepSearchOpen = true; render(); });
  await page.click('#f-search');
  await page.keyboard.type('psta');
  for(let k = 0; k < 3; k++) await page.keyboard.press('ArrowLeft');
  await page.keyboard.type('a');
  const r = await page.evaluate(() => { const el = document.activeElement; return { id: el.id, value: el.value, caret: el.selectionStart }; });
  eq(r, { id: 'f-search', value: 'pasta', caret: 2 });
});

test('offline: dopo la prima apertura l\'app si apre anche senza rete', async ({ page }) => {
  await page.waitForFunction(() => navigator.serviceWorker.getRegistration().then(r => !!(r && r.active)), null, { timeout: 10000 });
  await page.reload(); // ora sotto il controllo del service worker: i file finiscono in cache
  await page.waitForFunction(() => navigator.serviceWorker.controller && document.querySelector('#panel').children.length > 0);
  await page.context().setOffline(true);
  await page.reload();
  await page.waitForFunction(() => typeof state !== 'undefined' && document.querySelector('#panel').children.length > 0, null, { timeout: 15000 });
  const n = await page.evaluate(() => Object.keys(DATA.recipeDetails).length);
  assert(n > 100, 'catalogo non caricato offline');
  await page.context().setOffline(false);
});

test('layout: ricette aggiuntive dal nome lungo vanno a capo senza allargare la pagina', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const r = await page.evaluate(() => {
    const long = Object.keys(DATA.recipeDetails).sort((a, b) => b.length - a.length);
    const i = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1; // oggi, così il pasto è visibile
    state.tab = 'menu'; writeMealPrincipale(state.weekOverrides, i, 'cena', 'Pasta al pesto');
    setMealContorni(0, i, 'cena', [long[0], long[1]]); render();
    return { page: document.documentElement.scrollWidth, chips: document.querySelectorAll('.contorni-row .status-badge').length };
  });
  eq(r.chips, 2, 'chip visibili');
  assert(r.page <= 390, `pagina larga ${r.page}px`);
});

test('spesa: quantità dello stesso ingrediente sommate', async ({ page }) => {
  const r = await page.evaluate(() => [
    combineQtyTexts(['200 g', '150 g']),
    combineQtyTexts(['200 g', '200 g']),             // doppioni: prima ne restava uno solo
    combineQtyTexts(['2 spicchi', '2 spicchi', '1 spicchio']),
    combineQtyTexts(['500 g', '1 kg']),
    combineQtyTexts(['q.b.', 'q.b.']),
    combineQtyTexts(['1 cucchiaio', '1 cucchiaio', 'q.b.']),
    combineQtyTexts(['100 ml', '2 cucchiai'])
  ]);
  eq(r, ['350 g', '400 g', '5 spicchi', '1,5 kg', 'q.b.', '2 cucchiai + q.b.', '100 ml + 2 cucchiai']);
});

test('ricette: tutte hanno un link alla fonte, anche se modificate senza link', async ({ page }) => {
  const r = await page.evaluate(() => {
    const without = Object.keys(DATA.recipeDetails).filter(n => !DATA.recipeDetails[n].link);
    state.recipeEdits['Carbonara'] = { link: '' };
    return { without, carbonara: getRecipeDetails('Carbonara').link };
  });
  eq(r.without, [], 'ricette senza link');
  assert(/^https:\/\//.test(r.carbonara), 'link perso dalla ricetta modificata');
});

test('finestre: dialog accessibile, fuoco dentro, Tab intrappolato, Esc chiude e ridà il fuoco', async ({ page }) => {
  await page.evaluate(() => { state.tab = 'prep'; state.prepSearchOpen = true; render(); });
  await page.focus('[data-open-filters]');
  await page.keyboard.press('Enter');
  const open = await page.evaluate(() => {
    const d = document.querySelector('[role="dialog"]');
    const title = d && document.getElementById(d.getAttribute('aria-labelledby'));
    return {
      dialog: !!d, modal: d && d.getAttribute('aria-modal'), title: title && title.textContent.trim(),
      focusInside: !!d && d.contains(document.activeElement),
      tabsInert: document.querySelector('nav.tabs').inert,
      closeLabel: d && d.querySelector('.filters-close-btn') && d.querySelector('.filters-close-btn').getAttribute('aria-label')
    };
  });
  eq(open.dialog, true, 'role=dialog');
  eq(open.modal, 'true', 'aria-modal');
  assert(open.title, 'titolo della finestra');
  eq(open.focusInside, true, 'fuoco dentro la finestra');
  eq(open.tabsInert, true, 'barra delle schede inerte');
  eq(open.closeLabel, 'Chiudi', 'etichetta del bottone ✕');
  for(let k = 0; k < 40; k++) await page.keyboard.press('Tab');
  eq(await page.evaluate(() => document.querySelector('[role="dialog"]').contains(document.activeElement)), true, 'Tab esce dalla finestra');
  await page.keyboard.press('Escape');
  const closed = await page.evaluate(() => ({ open: state.filtersOpen, focus: document.activeElement && document.activeElement.hasAttribute('data-open-filters'), tabsInert: document.querySelector('nav.tabs').inert }));
  eq(closed, { open: false, focus: true, tabsInert: false });
});

test('finestre: Impostazioni dal menu in alto, Esc chiude una alla volta', async ({ page }) => {
  await page.click('#topbar-menu-btn');
  eq(await page.evaluate(() => document.getElementById('topbar-menu').getAttribute('role')), 'dialog', 'menu come dialog');
  await page.click('[data-topbar-menu-settings]');
  const r = await page.evaluate(() => { const d = document.querySelector('#settings-backdrop [role="dialog"]'); return { dialog: !!d, focus: !!d && d.contains(document.activeElement), panelInert: !!document.getElementById('panel').closest('[inert]') }; });
  eq(r, { dialog: true, focus: true, panelInert: true });
  await page.keyboard.press('Escape');
  eq(await page.evaluate(() => ({ open: isSettingsBackdropOpen(), panelInert: !!document.getElementById('panel').closest('[inert]') })), { open: false, panelInert: false });
  eq(page.errors, [], 'errori JS');
});

test('generatore: settimane equilibrate secondo le linee guida (30 settimane)', async ({ page }) => {
  const r = await page.evaluate(() => {
    const slots = weekPlanSlots(), seq = weekEatenSequence(slots);
    const problems = [];
    for(let n = 0; n < 30; n++){
      const days = pickWeekRecipes();
      const picks = slots.map(s => days[s.day][s.meal].principale);
      const prot = {}, base = {};
      seq.forEach(({ slot }) => { const x = picks[slot]; prot[recipeProteina(x)] = (prot[recipeProteina(x)] || 0) + 1; base[recipeBase(x)] = (base[recipeBase(x)] || 0) + 1; });
      Object.entries(WEEK_PROTEINA_TARGETS).forEach(([k, [mi, ma]]) => { const c = prot[k] || 0; if(c < mi || c > ma) problems.push(`${k}=${c}`); });
      if((base.pasta || 0) > WEEK_BASE_TARGETS.pasta[1]) problems.push(`pasta=${base.pasta}`);
      if(new Set(picks.map(x => x.nome)).size !== picks.length) problems.push('ricetta ripetuta');
      slots.forEach(s => { const m = days[s.day][s.meal]; if(!recipeGivesVeg(m.principale) && !m.contorni.some(recipeGivesVeg)) problems.push(`senza verdura ${s.day}_${s.meal}`); });
      for(let k = 1; k < seq.length; k++){
        if(seq[k].slot === seq[k-1].slot) continue;
        const a = recipeProteina(picks[seq[k-1].slot]), b = recipeProteina(picks[seq[k].slot]);
        if(a === b && a !== 'nessuna') problems.push(`${a} due volte di fila`);
      }
    }
    return problems;
  });
  eq(r, [], 'settimane fuori equilibrio');
});

test('generatore: un pasto bloccato conta nell\'equilibrio', async ({ page }) => {
  const r = await page.evaluate(() => {
    const salmone = getRecipeMeta('Trancio di salmone al forno');
    const days = pickWeekRecipes({ '4_cena': salmone });
    const pesci = [];
    days.forEach((d, i) => ['pranzo','cena'].forEach(m => { if(d[m] && recipeProteina(d[m].principale) === 'pesce') pesci.push(`${i}_${m}`); }));
    return { kept: days[4].cena.principale.nome, pesci: pesci.length };
  });
  eq(r.kept, 'Trancio di salmone al forno', 'pasto bloccato cambiato');
  assert(r.pesci >= 2 && r.pesci <= 3, `pesce ${r.pesci} volte`);
});

test('ricette: base e proteina modificabili da "Modifica ricetta"', async ({ page }) => {
  await page.evaluate(() => { state.tab = 'prep'; state.recipeEditName = 'Pasta al pesto'; render(); });
  eq(await page.$eval('#edit-base', el => el.value), 'pasta', 'base mostrata');
  await page.selectOption('#edit-proteina', 'formaggi');
  await page.click('[data-save-recipe-edit]');
  eq(await page.evaluate(() => recipeProteina(getRecipeMeta('Pasta al pesto'))), 'formaggi');
});

test('generatore: legumi 3-4 volte in ogni stagione', async ({ page }) => {
  const r = await page.evaluate(() => {
    const orig = currentSeasonKey, out = {};
    const slots = weekPlanSlots(), seq = weekEatenSequence(slots);
    for(const season of ['primavera','estate','autunno','inverno']){
      window.currentSeasonKey = () => season;
      const counts = [];
      for(let n = 0; n < 10; n++){
        const days = pickWeekRecipes();
        counts.push(seq.filter(({ slot }) => { const s = slots[slot]; return recipeProteina(days[s.day][s.meal].principale) === 'legumi'; }).length);
      }
      out[season] = counts.filter(c => c < 3 || c > 4);
    }
    window.currentSeasonKey = orig;
    return out;
  });
  eq(r, { primavera: [], estate: [], autunno: [], inverno: [] }, 'settimane con legumi fuori da 3-4');
});

test('spesa: la nota di una riga dice solo giorno e pasto, senza il nome della ricetta', async ({ page }) => {
  const notes = await page.evaluate(() => {
    const i = (new Date().getDay() + 6) % 7;
    writeMealPrincipale(state.weekOverrides, i, 'cena', 'Pasta e lenticchie');
    return [...new Set(buildShopFlat().filter(it => it.isRecipe).map(it => it.contextShort))];
  });
  assert(notes.length > 0, 'nessuna riga dalla ricetta');
  notes.forEach(n => { assert(!n.includes('lenticchie'), `nota con il nome della ricetta: ${n}`); assert(/· (Pranzo|Cena)$/.test(n), `nota inattesa: ${n}`); });
});

test('foto del piatto: si carica ridotta, si vede nella scheda e si può rimuovere', async ({ page }) => {
  await page.evaluate(() => {
    window.__photos = {};
    window.cookpopSync = {
      load: async path => window.__photos[path] || null,
      save: async (path, data) => { if(data === null) delete window.__photos[path]; else window.__photos[path] = data; },
      patch: async () => {}, onChange: () => {}
    };
    state.tab = 'prep'; state.expandedRecipe = 'Carbonara'; render();
  });
  await page.waitForSelector('[data-recipe-photo-input]', { state: 'attached' });
  // immagine di prova 3000x2000 generata nel browser
  const png = await page.evaluate(() => { const c = document.createElement('canvas'); c.width = 3000; c.height = 2000; const x = c.getContext('2d'); x.fillStyle = '#c33'; x.fillRect(0, 0, 3000, 2000); return c.toDataURL('image/png').split(',')[1]; });
  await page.setInputFiles('[data-recipe-photo-input]', { name: 'piatto.png', mimeType: 'image/png', buffer: Buffer.from(png, 'base64') });
  await page.waitForSelector('.recipe-photo img');
  const saved = await page.evaluate(() => { const v = Object.values(window.__photos)[0]; const img = document.querySelector('.recipe-photo img'); return { keys: Object.keys(window.__photos), jpeg: v.data.startsWith('data:image/jpeg'), size: v.data.length, w: img.naturalWidth }; });
  eq(saved.keys, ['recipe-photos/Carbonara'], 'percorso');
  assert(saved.jpeg && saved.size < 300000, `foto troppo grande: ${saved.size}`);
  eq(saved.w, 1024, 'lato lungo ridotto a 1024');
  await page.click('[data-recipe-photo-remove]');
  await page.waitForSelector('.recipe-photo img', { state: 'detached' });
  eq(await page.evaluate(() => Object.keys(window.__photos)), [], 'foto rimossa');
  await page.click('.undo-toast button');
  await page.waitForSelector('.recipe-photo img');
  eq(page.errors, [], 'errori JS');
});

test('ricette: gradimento visibile e modificabile con un tocco, senza perdere altre modifiche', async ({ page }) => {
  await page.evaluate(() => { state.recipeEdits['Carbonara'] = { ricordare: 'nota mia' }; state.tab = 'prep'; state.expandedRecipe = 'Carbonara'; render(); });
  eq(await page.evaluate(() => ({ active: !!document.querySelector('.grad-chip.active'), grad: getRecipeMeta('Carbonara').gradimento })), { active: false, grad: '' }, 'senza gradimento di partenza');
  await page.click('[data-set-gradimento="Carbonara"][data-grad="preferita"]');
  const r = await page.evaluate(() => ({ grad: getRecipeMeta('Carbonara').gradimento, nota: getRecipeDetails('Carbonara').ricordare, active: document.querySelector('.grad-chip.active').dataset.grad }));
  eq(r, { grad: 'preferita', nota: 'nota mia', active: 'preferita' });
  await page.evaluate(() => { state.expandedRecipe = null; render(); });
  eq(await page.$eval('[data-toggle-recipe="Carbonara"] .grad-icon', el => el.textContent), '❤️', 'icona nella card');
  await page.evaluate(() => { state.recipeEditName = 'Carbonara'; render(); });
  await page.selectOption('#edit-gradimento', 'ogni-tanto');
  await page.click('[data-save-recipe-edit]');
  eq(await page.evaluate(() => getRecipeMeta('Carbonara').gradimento), 'ogni-tanto', 'da Modifica ricetta');
});

test('ingredienti: "Unisci con…" unisce due nomi in ricette, Dispensa e note, con Annulla', async ({ page }) => {
  const before0 = await page.evaluate(() => {
    upsertPantryItem('Passata', 'dispensa', 2);
    upsertPantryItem('Passata di pomodoro', 'dispensa', 1);
    state.ingredientNotes['passata di pomodoro'] = 'quella in bottiglia';
    state.tab = 'dispensa'; state.pantryEditKey = 'passata di pomodoro'; render();
    return { n: recipesUsingIngredient('Passata di pomodoro').length, a: state.pantryItems['passata di pomodoro'].qty, b: state.pantryItems['passata'].qty };
  });
  const { n: before, a: qtyOld, b: qtyNew } = before0;
  assert(before > 5, 'ricette con la passata');
  await page.click('[data-open-merge]');
  await page.fill('#merge-search', 'passata');
  await page.click('[data-merge-pick="Passata"]');
  const summary = await page.$eval('.merge-effects', el => el.textContent);
  assert(summary.includes(`${before} ricette`), `riepilogo: ${summary}`);
  await page.click('[data-merge-confirm]');
  const r = await page.evaluate(() => ({
    oldRecipes: recipesUsingIngredient('Passata di pomodoro').length,
    newRecipes: recipesUsingIngredient('Passata').length,
    qty: state.pantryItems['passata'] && state.pantryItems['passata'].qty,
    oldItem: !!state.pantryItems['passata di pomodoro'],
    note: state.ingredientNotes['passata'],
    edit: state.pantryEditKey
  }));
  eq(r, { oldRecipes: 0, newRecipes: before, qty: qtyOld + qtyNew, oldItem: false, note: 'quella in bottiglia', edit: 'passata' });
  await page.click('.undo-toast button');
  const undone = await page.evaluate(() => ({ recipes: recipesUsingIngredient('Passata di pomodoro').length, old: state.pantryItems['passata di pomodoro'].qty, nuovo: state.pantryItems['passata'].qty }));
  eq(undone, { recipes: before, old: qtyOld, nuovo: qtyNew }, 'annulla');
  eq(page.errors, [], 'errori JS');
});

test('ingredienti: unire A in B dopo B in A non crea un giro', async ({ page }) => {
  const r = await page.evaluate(() => {
    mergeIngredientInto('Pomodorini', 'Pomodori');
    mergeIngredientInto('Pomodori', 'Pomodorini');
    return [resolveIngredientName('Pomodori'), resolveIngredientName('Pomodorini')];
  });
  eq(r, ['Pomodorini', 'Pomodorini']);
});

test('dispensa: scadenza con scelte rapide, sezione In scadenza, si tiene finché c\'è scorta', async ({ page }) => {
  await page.evaluate(() => { upsertPantryItem('Mozzarella', 'frigo', 1); upsertPantryItem('Ricotta', 'frigo', 1); state.tab = 'dispensa'; state.pantryView = 'cibo'; state.pantryEditKey = 'mozzarella'; render(); });
  await page.click('[data-scadenza-quick="3"]');
  const r1 = await page.evaluate(() => ({ iso: state.pantryItems['mozzarella'].scadenza, want: addDaysIso(3) }));
  eq(r1.iso, r1.want, '+3 giorni');
  await page.fill('#pantry-edit-scadenza', await page.evaluate(() => addDaysIso(20)));
  await page.dispatchEvent('#pantry-edit-scadenza', 'change');
  eq(await page.evaluate(() => daysUntilDate(state.pantryItems['mozzarella'].scadenza)), 20, 'data scelta');
  const r2 = await page.evaluate(() => {
    state.pantryItems['mozzarella'].scadenza = addDaysIso(1);
    state.pantryItems['ricotta'].scadenza = addDaysIso(-1);
    state.pantryEditKey = null; render();
    const names = [...document.querySelectorAll('.expiring-group .inv-name')].map(b => b.childNodes[0].textContent.trim());
    const badges = [...document.querySelectorAll('.expiring-group .exp-badge')].map(b => b.textContent);
    upsertPantryItem('Mozzarella', 'frigo', 1);            // ne compro un'altra: resta la scadenza vicina
    const kept = state.pantryItems['mozzarella'].scadenza === addDaysIso(1);
    state.pantryItems['ricotta'].qty = 0; upsertPantryItem('Ricotta', 'frigo', 1); // era finita: confezione nuova
    return { names, badges, kept, ricotta: state.pantryItems['ricotta'].scadenza || null };
  });
  eq(r2, { names: ['Ricotta', 'Mozzarella'], badges: ['Scaduto ieri', 'Scade domani'], kept: true, ricotta: null });
  eq(page.errors, [], 'errori JS');
});

test('generatore: usa gli ingredienti in scadenza in tempo, senza perdere equilibrio', async ({ page }) => {
  const r = await page.evaluate(() => {
    const slots = weekPlanSlots(), seq = weekEatenSequence(slots);
    const run = withExpiry => {
      state.pantryItems = {};
      upsertPantryItem('Mozzarella', 'frigo', 2);
      if(withExpiry) state.pantryItems['mozzarella'].scadenza = addDaysIso(3);
      let inTime = 0, balanced = 0;
      const t0 = performance.now();
      for(let n = 0; n < 15; n++){
        const days = pickWeekRecipes({}, 0);
        const picks = slots.map(s => days[s.day][s.meal].principale);
        if(weekPlanScore(picks, slots, seq) === 0) balanced++;
        if((days.expiringUsed || []).includes('Mozzarella')) inTime++;
      }
      return { inTime, balanced, ms: Math.round((performance.now() - t0) / 15) };
    };
    return { con: run(true), senza: run(false) };
  });
  assert(r.con.inTime >= 12, `mozzarella usata in tempo solo ${r.con.inTime}/15 volte`);
  eq(r.con.balanced, 15, 'settimane equilibrate con la scadenza');
  eq(r.senza.balanced, 15, 'settimane equilibrate senza');
  assert(r.con.ms < 300, `generazione lenta: ${r.con.ms} ms`);
});

async function swipeRight(page, selector, dx){
  const box = await page.locator(selector).first().boundingBox();
  const y = box.y + box.height / 2, x = box.x + 40;
  await page.mouse.move(x, y); await page.mouse.down();
  for(let i = 1; i <= 8; i++) await page.mouse.move(x + dx * i / 8, y + 1);
  await page.mouse.up();
  await page.waitForTimeout(100);
}

test('spesa: swipe a destra toglie la riga (lungo subito, breve col cestino), con Annulla; il tocco spunta ancora', async ({ page }) => {
  await page.evaluate(() => {
    state.shopExtras = { e1: { ingrediente: 'Carciofi', qta: '4' }, e2: { ingrediente: 'Asparagi', qta: '1' }, e3: { ingrediente: 'Radicchio', qta: '1' } };
    state.tab = 'spesa'; state.shopView = 'reparto'; render();
  });
  const row = name => `.swipe-wrap[data-swipe-label="${name}"] .swipe-content`;
  await swipeRight(page, row('Carciofi'), 220);
  const r1 = await page.evaluate(() => ({ gone: !state.shopExtras.e1, checked: !!state.shopChecked.e1, toast: state.undoToast && state.undoToast.message }));
  eq(r1, { gone: true, checked: false, toast: 'Carciofi tolto dalla lista' });
  await page.click('.undo-toast button');
  eq(await page.evaluate(() => !!state.shopExtras.e1), true, 'annulla');
  await swipeRight(page, row('Asparagi'), 100);
  eq(await page.evaluate(() => revealedSwipeId), 'shop:e2', 'cestino rivelato');
  await page.click('.swipe-wrap[data-swipe-label="Asparagi"] .swipe-trash');
  eq(await page.evaluate(() => !!state.shopExtras.e2), false, 'tolto col cestino');
  await page.click(row('Radicchio') + ' .item-name');
  eq(await page.evaluate(() => !!state.shopChecked.e3), true, 'il tocco spunta ancora');
  eq(page.errors, [], 'errori JS');
});

test('dispensa: swipe a destra segna la voce come finita (quantità 0, in Spesa tra i Finiti) con Annulla', async ({ page }) => {
  await page.evaluate(() => { upsertPantryItem('Carciofi', 'frigo', 3); state.pantryItems['carciofi'].unit = 'pz'; state.tab = 'dispensa'; state.pantryView = 'cibo'; render(); });
  await swipeRight(page, '.swipe-wrap[data-swipe-pantry="carciofi"] .swipe-content', 220);
  eq(await page.evaluate(() => ({ qty: state.pantryItems['carciofi'].qty, unit: state.pantryItems['carciofi'].unit, visible: !!document.querySelector('[data-swipe-pantry="carciofi"]'), finiti: buildShopFlat().some(it => it.context === 'Finiti in Dispensa' && it.ingrediente === 'Carciofi'), select: !!state.pantrySelectMode, edit: state.pantryEditKey })),
    { qty: 0, unit: 'pz', visible: false, finiti: true, select: false, edit: null });
  await page.click('.undo-toast button');
  eq(await page.evaluate(() => state.pantryItems['carciofi'] && state.pantryItems['carciofi'].qty), 3, 'annulla');
});

test('backup: scarica e ripristina i dati, con Annulla; un file sbagliato viene rifiutato', async ({ page }) => {
  const r = await page.evaluate(() => {
    upsertPantryItem('Carciofi', 'frigo', 3);
    state.shopExtras = { e1: { ingrediente: 'Asparagi', qta: '1' } };
    const backup = JSON.parse(JSON.stringify(buildBackup()));
    delete state.pantryItems['carciofi'];
    state.shopExtras = {};
    const bad = restoreBackup({ foo: 1 }, () => true);
    const ok = restoreBackup(backup, () => true);
    const restored = { carciofi: state.pantryItems['carciofi'] && state.pantryItems['carciofi'].qty, extra: !!state.shopExtras.e1 };
    return { format: backup.format, bad, ok, restored, toast: state.undoToast && state.undoToast.message };
  });
  eq(r, { format: 'cookpop-backup', bad: 'Questo file non è un backup di CookPOP.', ok: null, restored: { carciofi: 3, extra: true }, toast: 'Backup ripristinato' });
  await page.click('.undo-toast button');
  eq(await page.evaluate(() => ({ carciofi: !!state.pantryItems['carciofi'], extra: !!state.shopExtras.e1 })), { carciofi: false, extra: false }, 'annulla');
  eq(page.errors, [], 'errori JS');
});

test('menù: riepilogo equilibrio della settimana, aggiornato dopo i cambi a mano', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.extraWeeks = []; generateWeek(1);
    const before = weekBalance(1);
    const rosse = allRecipeMetas().filter(isMainDish).filter(x => recipeProteina(x) === 'carne-rossa').slice(0, 3).map(x => x.nome);
    rosse.forEach((n, k) => writeMealPrincipale(weekOverridesRef(1), WEEK_DISPLAY_ORDER[4 + k], 'cena', n));
    const after = weekBalance(1);
    state.tab = 'menu'; render();
    return { planned: before.planned, okBefore: before.items.every(it => it.status === 'ok'), rossaAfter: after.items.find(it => it.key === 'carne-rossa').status, html: document.querySelectorAll('.week-balance').length >= 1, warn: !!document.querySelector('.balance-pill.is-high') };
  });
  eq(r, { planned: 14, okBefore: true, rossaAfter: 'high', html: true, warn: true });
  eq(page.errors, [], 'errori JS');
});

test('ricette: "Con quello che ho" mostra ciò che si fa con la Dispensa, prima chi usa le cose in scadenza', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.pantryItems = {};
    upsertPantryItem('Zucchine', 'frigo', 4); state.pantryItems['zucchine'].scadenza = addDaysIso(1);
    upsertPantryItem('Uova', 'frigo', 6);
    state.tab = 'prep'; state.prepPantryMode = false; render();
    const all = document.querySelectorAll('.recipe-card').length;
    document.querySelector('[data-toggle-pantry-mode]').click();
    const cards = [...document.querySelectorAll('.recipe-card')];
    const first = cards[0];
    return { all, fewer: cards.length > 0 && cards.length < all, firstExp: !!first.querySelector('.pantry-match-exp'), noWater: !document.body.textContent.includes('manca Acqua'), on: state.prepPantryMode };
  });
  eq(r, { all: r.all, fewer: true, firstExp: true, noWater: true, on: true });
  eq(page.errors, [], 'errori JS');
});

test('spesa: i freschi spostati in Dispensa hanno la scadenza stimata, da confermare o sistemare', async ({ page }) => {
  await page.evaluate(() => {
    ['zucchine','petto di pollo','spaghetti'].forEach(k => delete state.pantryItems[k]);
    state.shopExtras = { e1: { ingrediente: 'Zucchine', qta: '4' }, e2: { ingrediente: 'Petto di pollo', qta: '1' }, e3: { ingrediente: 'Spaghetti', qta: '1' } };
    state.shopChecked = { e1: true, e2: true, e3: true }; state.tab = 'spesa'; state.shopView = 'reparto'; render();
  });
  await page.click('#move-checked-to-pantry');
  const r1 = await page.evaluate(() => ({ keys: expiryConfirmKeys().sort(), zucchine: daysUntilDate(state.pantryItems['zucchine'].scadenza), pollo: daysUntilDate(state.pantryItems['petto di pollo'].scadenza), spaghetti: state.pantryItems['spaghetti'].scadenza || null, modal: !!document.querySelector('[data-exp-confirm-shift]') }));
  eq(r1, { keys: ['petto di pollo', 'zucchine'], zucchine: 5, pollo: 2, spaghetti: null, modal: true });
  await page.click('[data-exp-confirm-shift="zucchine"][data-exp-shift="1"]');
  await page.click('[data-exp-confirm-toggle="petto di pollo"]');
  eq(await page.evaluate(() => ({ z: daysUntilDate(state.pantryItems['zucchine'].scadenza), p: state.pantryItems['petto di pollo'].scadenza || null })), { z: 6, p: null }, 'sistemate');
  await page.click('.filters-modal-footer [data-exp-confirm-close]');
  eq(await page.evaluate(() => ({ open: !!document.querySelector('[data-exp-confirm-shift]'), z: daysUntilDate(state.pantryItems['zucchine'].scadenza) })), { open: false, z: 6 }, 'chiusa');
  eq(page.errors, [], 'errori JS');
});

test('pane: segnando il pasto come mangiato si tolgono i panini (cena sempre, pranzo solo nel weekend)', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.extraWeeks = []; generateWeek(1);
    Object.keys(state.pantryItems).filter(k => ['pane','panini','panino'].includes(k)).forEach(k => delete state.pantryItems[k]);
    upsertPantryItem('Pane', 'dispensa', 6);
    state.tab = 'menu'; render();
    const click = sel => document.querySelector(sel).click();
    const out = { lunchMon: mealHasBread(0, 'pranzo'), lunchSat: mealHasBread(5, 'pranzo'), dinnerTue: mealHasBread(1, 'cena') };
    // cena di martedì: modale con 1 panino, + ne fa 2
    click('[data-toggle-done="1_1_cena"]');
    out.modalBread = state.doneModalBread;
    click('[data-done-bread="1"]');
    click('[data-confirm-done="1_1_cena"]');
    out.afterDinner = state.pantryItems['pane'].qty;
    // pranzo di sabato come avanzo della cena di venerdì: si toglie subito, con Annulla
    state.dayLinks['1_5_pranzo'] = '1_4_cena'; render();
    click('[data-toggle-done="1_5_pranzo"]');
    out.afterLeftover = state.pantryItems['pane'].qty;
    out.toast = state.undoToast && state.undoToast.message;
    return out;
  });
  eq(r, { lunchMon: false, lunchSat: true, dinnerTue: true, modalBread: 1, afterDinner: 4, afterLeftover: 3, toast: 'Tolto il pane: ne restano 3' });
  await page.click('.undo-toast button');
  eq(await page.evaluate(() => ({ qty: state.pantryItems['pane'].qty, done: !!(weekMealsDoneRef(1)[5] && weekMealsDoneRef(1)[5].pranzo) })), { qty: 4, done: false }, 'annulla');
  eq(page.errors, [], 'errori JS');
});

test('gradimento: nessuno di partenza, la migrazione toglie quelli salvati, e si vota da "Ricetta fatta!"', async ({ page }) => {
  const r = await page.evaluate(() => {
    const noneInCatalog = DATA.recipes.every(x => !x.gradimento);
    state.recipeEdits['Carbonara'] = { gradimento: 'preferita', ricordare: 'nota' };
    state.gradimentoReset1 = false; runMigrations();
    const migrated = { grad: getRecipeMeta('Carbonara').gradimento, nota: getRecipeDetails('Carbonara').ricordare };
    state.extraWeeks = []; generateWeek(1);
    writeMealPrincipale(weekOverridesRef(1), 1, 'cena', 'Carbonara');
    state.tab = 'menu'; render();
    document.querySelector('[data-toggle-done="1_1_cena"]').click();
    document.querySelector('.done-grad [data-set-gradimento="Carbonara"][data-grad="ci-piace"]').click();
    return { noneInCatalog, migrated, voted: getRecipeMeta('Carbonara').gradimento, modalOpen: state.doneModalDay === '1_1_cena' };
  });
  eq(r, { noneInCatalog: true, migrated: { grad: '', nota: 'nota' }, voted: 'ci-piace', modalOpen: true });
  eq(page.errors, [], 'errori JS');
});

test('spesa: il pane per i pasti in menù meno quello in Dispensa; si aggiorna se ne compri meno', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.extraWeeks = []; generateWeek(1);
    Object.keys(state.pantryItems).filter(k => ['pane','panini','panino'].includes(k)).forEach(k => delete state.pantryItems[k]);
    const meals = breadMealsAhead();
    upsertPantryItem('Pane', 'dispensa', 3);
    const row = buildShopFlat().find(it => it.key.startsWith('bread_'));
    state.shopDismissed[row.key] = true; // comprato/tolto
    upsertPantryItem('Pane', 'dispensa', 2);
    const row2 = buildShopFlat().find(it => it.key.startsWith('bread_'));
    state.pantryItems['pane'].qty = 100;
    const none = buildShopFlat().some(it => it.key.startsWith('bread_'));
    return { atLeastWeek: meals >= 9, qta: row.qta === String(meals - 3), dept: classifyDept(row.ingrediente), again: !!row2 && row2.qta === String(meals - 5), none };
  });
  eq(r, { atLeastWeek: true, qta: true, dept: 'pane', again: true, none: false });
});

test('menù: avviso di ciò che scade presto, "Cosa cucino" apre Con quello che ho, ✕ lo chiude fino a domani', async ({ page }) => {
  await page.evaluate(() => { upsertPantryItem('Zucchine', 'frigo', 3); state.pantryItems['zucchine'].scadenza = addDaysIso(1); state.tab = 'menu'; render(); });
  eq(await page.evaluate(() => { const b = document.querySelector('.expiry-banner'); return b && b.textContent.includes('Zucchine') && b.textContent.includes('domani'); }), true, 'avviso');
  await page.click('[data-expiry-cook]');
  eq(await page.evaluate(() => ({ tab: state.tab, mode: state.prepPantryMode })), { tab: 'prep', mode: true }, 'cosa cucino');
  await page.evaluate(() => { state.tab = 'menu'; render(); });
  await page.click('[data-dismiss-expiry-banner]');
  eq(await page.evaluate(() => !!document.querySelector('.expiry-banner')), false, 'chiuso');
  eq(page.errors, [], 'errori JS');
});

test('backup: promemoria se non c\'è un backup recente, sparisce dopo averlo scaricato', async ({ page }) => {
  const r = await page.evaluate(() => {
    localStorage.removeItem(LAST_BACKUP_KEY);
    const before = backupOverdue();
    localStorage.setItem(LAST_BACKUP_KEY, isoLocalDate(new Date(Date.now() - 40 * 86400000)));
    const old = backupOverdue();
    localStorage.setItem(LAST_BACKUP_KEY, isoLocalDate(new Date()));
    return { before, old, now: backupOverdue(), html: backupStatusHtml().includes('Ultimo backup') };
  });
  eq(r, { before: true, old: true, now: false, html: true });
});

// ---------------------------------------------------------------- runner

(async () => {
  const filter = process.argv[2] || '';
  const server = await startServer();
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch();
  let failed = 0;
  for(const t of tests.filter(t => t.name.includes(filter))){
    const ctx = await browser.newContext();
    await ctx.route(/gstatic\.com|firebase/, r => r.abort());
    try{
      const page = await openApp(ctx, baseUrl, t.opts && t.opts.saved);
      await Promise.race([t.fn({ page }), new Promise((_, rej) => setTimeout(() => rej(new Error('timeout (60s)')), 60000))]);
      console.log('  ✓', t.name);
    }catch(e){
      failed++;
      console.log('  ✗', t.name, '\n     ', e.message.split('\n')[0]);
    }
    await ctx.close();
  }
  await browser.close();
  server.close();
  console.log(failed ? `\n${failed} test falliti` : '\ntutti i test passati');
  process.exit(failed ? 1 : 0);
})();
