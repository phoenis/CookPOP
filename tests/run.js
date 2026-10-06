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

test('layout: piatti dal nome lungo vanno a capo senza allargare la pagina', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const r = await page.evaluate(() => {
    const long = Object.keys(DATA.recipeDetails).sort((a, b) => b.length - a.length);
    const i = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1; // oggi, così il pasto è visibile
    state.tab = 'menu'; writeMealPrincipale(state.weekOverrides, i, 'cena', 'Pasta al pesto');
    setMealContorni(0, i, 'cena', [long[0], long[1]]); render();
    return { page: document.documentElement.scrollWidth, chips: document.querySelectorAll(`.meal-block[data-day-index="${i}"][data-meal="cena"] .dish-item`).length - 1 };
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
  // nel dettaglio non c'è più "Aggiungi una foto": si carica da Modifica ricetta
  await page.waitForTimeout(200);
  eq(await page.locator('[data-recipe-photo-input]').count(), 0, 'nessun comando foto nel dettaglio');
  await page.evaluate(() => { state.recipeEditName = 'Carbonara'; render(); });
  await page.waitForSelector('[data-recipe-photo-input]', { state: 'attached' });
  eq(await page.evaluate(() => [!!document.querySelector('.filters-modal-backdrop.is-second'), !!document.querySelector('[data-page="recipe-edit-Carbonara"]')]), [false, true], 'pagina, non modale');
  await page.fill('#edit-tempo', 'scritto a mano');
  // immagine di prova 3000x2000 generata nel browser
  const png = await page.evaluate(() => { const c = document.createElement('canvas'); c.width = 3000; c.height = 2000; const x = c.getContext('2d'); x.fillStyle = '#c33'; x.fillRect(0, 0, 3000, 2000); return c.toDataURL('image/png').split(',')[1]; });
  await page.setInputFiles('[data-recipe-photo-input]', { name: 'piatto.png', mimeType: 'image/png', buffer: Buffer.from(png, 'base64') });
  await page.waitForSelector('.recipe-photo img');
  eq(await page.inputValue('#edit-tempo'), 'scritto a mano', 'il render della foto non cancella quanto scritto');
  const saved = await page.evaluate(() => { const v = Object.values(window.__photos)[0]; const img = document.querySelector('.recipe-photo img'); return { keys: Object.keys(window.__photos), jpeg: v.data.startsWith('data:image/jpeg'), size: v.data.length, w: img.naturalWidth }; });
  eq(saved.keys, ['recipe-photos/Carbonara'], 'percorso');
  assert(saved.jpeg && saved.size < 300000, `foto troppo grande: ${saved.size}`);
  eq(saved.w, 1024, 'lato lungo ridotto a 1024');
  await page.click('[data-recipe-photo-remove]');
  await page.waitForSelector('.recipe-photo img', { state: 'detached' });
  eq(await page.evaluate(() => Object.keys(window.__photos)), [], 'foto rimossa');
  eq(await page.inputValue('#edit-tempo'), 'scritto a mano', 'neanche dopo la rimozione');
  await page.click('.undo-toast button');
  await page.waitForSelector('.recipe-photo img');
  // chiusa la pagina di modifica, nel dettaglio la foto si vede ma senza comandi
  await page.evaluate(() => { state.recipeEditName = null; render(); });
  eq(await page.evaluate(() => [!!document.querySelector('[data-page^="recipe-Carbonara"] .recipe-photo img'), document.querySelectorAll('[data-recipe-photo-input], [data-recipe-photo-remove]').length]), [true, 0], 'foto senza comandi nel dettaglio');
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
  await page.click('[data-sheet-more]');
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

test('dispensa: swipe a destra chiede + o cestino; cestino = finita (quantità 0, in Spesa tra i Finiti) con Annulla', async ({ page }) => {
  await page.evaluate(() => { upsertPantryItem('Carciofi', 'frigo', 3); state.pantryItems['carciofi'].unit = 'pz'; state.tab = 'dispensa'; state.pantryView = 'cibo'; render(); });
  await swipeRight(page, '.swipe-wrap[data-swipe-pantry="carciofi"] .swipe-content', 220);
  eq(await page.evaluate(() => [state.pantryFinishPicker, state.pantryItems['carciofi'].qty, !!document.querySelector('.finish-picker')]), ['carciofi', 3, true], 'tooltip dopo lo swipe');
  await page.click('[data-finish-trash="carciofi"]');
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
    writeMealPrincipale(weekOverridesRef(1), 1, 'cena', 'Carbonara'); // ricetta nota, senza pane tra gli ingredienti
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

test('dispensa: il menu dei luoghi si vede (non tagliato dalla riga) e cambia luogo', async ({ page }) => {
  await page.evaluate(() => { upsertPantryItem('Carciofi', 'frigo', 3); state.tab = 'dispensa'; state.pantryView = 'cibo'; render(); });
  await page.click('[data-luogo-toggle="carciofi"]');
  const visible = await page.evaluate(() => {
    const pk = document.querySelector('.luogo-picker');
    if(!pk) return false;
    const r = pk.getBoundingClientRect();
    return pk.contains(document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2));
  });
  eq(visible, true, 'menu visibile');
  await page.click('[data-luogo-set="carciofi"][data-luogo-value="freezer"]');
  eq(await page.evaluate(() => ({ luogo: state.pantryItems['carciofi'].luogo, open: !!document.querySelector('.luogo-picker') })), { luogo: 'freezer', open: false });
  eq(page.errors, [], 'errori JS');
});

test('categorie: dalla scheda "Nuovo ingrediente", modifica dentro la riga; i campi non chiudono la pagina', async ({ page }) => {
  await page.evaluate(() => { state.tab = 'dispensa'; state.pantryView = 'cibo'; state.pantryAddModalOpen = true; render(); });
  await page.click('[data-sheet-picker="cat"]');
  await page.click('[data-open-depts]');
  eq(await page.evaluate(() => ({ depts: state.deptsModalOpen, top: [...document.querySelectorAll('.sheet-page')].pop().dataset.page })), { depts: true, top: 'depts' }, 'categorie sopra la scheda');
  await page.click('[data-dept-edit="new"]');
  await page.click('#dept-edit-label');
  await page.click('#dept-edit-icon');
  await page.fill('#dept-edit-label', 'Animali');
  await page.click('[data-dept-draft-type="casa"]');
  eq(await page.evaluate(() => ({ open: state.deptsModalOpen, label: document.getElementById('dept-edit-label').value })), { open: true, label: 'Animali' }, 'il testo resta dopo il cambio tipo');
  await page.click('#dept-edit-save');
  eq(await page.evaluate(() => Object.values(state.customDepts || {}).some(d => d && d.label === 'Animali' && d.nonFood)), true, 'aggiunta in Casa');
  // Rinomina una categoria di base e ripristina.
  await page.click('[data-dept-edit="verdura"]');
  await page.fill('#dept-edit-label', 'Ortofrutta');
  await page.click('#dept-edit-save');
  eq(await page.evaluate(() => DEPT_LABEL.verdura), 'Ortofrutta', 'rinominata');
  await page.click('[data-dept-edit="verdura"]');
  await page.click('[data-dept-reset="verdura"]');
  eq(await page.evaluate(() => DEPT_LABEL.verdura), 'Frutta e verdura', 'ripristinata');
  await page.keyboard.press('Escape');
  eq(await page.evaluate(() => ({ depts: state.deptsModalOpen, add: state.pantryAddModalOpen })), { depts: false, add: true }, 'Esc chiude solo le categorie');
  eq(page.errors, [], 'errori JS');
});

test('gruppi: formati nel gruppo, aggiunta e rimozione dalla riga, nuovo gruppo col nome nelle ricette automatico', async ({ page }) => {
  await page.evaluate(() => {
    ['Fusilli', 'Penne'].forEach(n => { upsertPantryItem(n, 'dispensa', 1); state.pantryItems[n.toLowerCase()].group = 'pasta-corta'; });
    upsertPantryItem('Farfalle', 'dispensa', 1);
    state.tab = 'dispensa'; state.pantryGroupsModalOpen = true; render();
  });
  eq(await page.$eval('[data-group-edit="pasta-corta"] .manage-row-sub', el => el.textContent), 'Fusilli, Penne', 'formati mostrati');
  await page.click('[data-group-edit="pasta-corta"]');
  await page.fill('#group-member-search', 'farf');
  await page.click('[data-group-member-add="farfalle"]');
  await page.click('[data-group-member-remove="penne"]');
  eq(await page.evaluate(() => ({ farfalle: state.pantryItems['farfalle'].group, penne: state.pantryItems['penne'].group || null })), { farfalle: 'pasta-corta', penne: null }, 'aggiunto e tolto');
  await page.click('[data-group-edit-cancel]');
  await page.click('[data-group-edit="new"]');
  await page.fill('#group-edit-label', 'Formaggi da grattugiare');
  eq(await page.$eval('#group-edit-match', el => el.value), 'formaggi da grattugiare', 'nome nelle ricette automatico');
  await page.click('#group-edit-save');
  eq(await page.evaluate(() => ({ g: Object.values(state.pantryGroups).find(g => g.label === 'Formaggi da grattugiare'), editing: !!state.groupEditId })), { g: { label: 'Formaggi da grattugiare', matchName: 'formaggi da grattugiare', cat: '' }, editing: true }, 'creato e aperto');
  eq(page.errors, [], 'errori JS');
});

test('ingredienti: filtro In Dispensa, divisi per categoria; la scheda si apre sopra e Indietro torna all\'elenco', async ({ page }) => {
  await page.evaluate(() => { upsertPantryItem('Carciofi', 'frigo', 3); state.tab = 'dispensa'; state.ingredientManagerOpen = true; render(); });
  await page.click('[data-ingredient-filter="casa"]');
  const r = await page.evaluate(() => {
    const names = [...document.querySelectorAll('[data-manage-ingredient]')].map(b => b.dataset.manageIngredient);
    return { hasCarciofi: names.includes('Carciofi'), allInStock: names.every(n => { const it = state.pantryItems[n.toLowerCase()]; return it && it.qty > 0; }), sections: document.querySelectorAll('[data-page="ingredients"] .settings-section-title').length > 0 };
  });
  eq(r, { hasCarciofi: true, allInStock: true, sections: true });
  await page.click('[data-manage-ingredient="Carciofi"]');
  eq(await page.evaluate(() => ({ edit: state.pantryEditKey, mgr: state.ingredientManagerOpen })), { edit: 'carciofi', mgr: true }, 'scheda sopra l\'elenco');
  await page.keyboard.press('Escape');
  eq(await page.evaluate(() => ({ edit: state.pantryEditKey, mgr: state.ingredientManagerOpen })), { edit: null, mgr: true }, 'Indietro torna all\'elenco');
  eq(page.errors, [], 'errori JS');
});

test('scheda ingrediente: modifica (quantità, luogo, categoria, gruppo, unità) e aggiunta con bozza e Annulla', async ({ page }) => {
  await page.evaluate(() => { upsertPantryItem('Carciofi', 'frigo', 3); state.tab = 'dispensa'; state.pantryView = 'cibo'; render(); });
  await page.click('[data-pantry-edit="carciofi"]');
  eq(await page.evaluate(() => !!document.querySelector('.sheet-page[role="dialog"]')), true, 'pagina aperta come dialog');
  await page.click('[data-sheet-qty="1"]');
  await page.click('[data-sheet-luogo="freezer"]');
  await page.click('[data-sheet-picker="cat"]');
  await page.click('[data-sheet-cat="surgelati"]');
  await page.click('[data-sheet-more]');
  await page.click('[data-sheet-unit="g"]');
  const it = await page.evaluate(() => state.pantryItems['carciofi']);
  eq({ qty: it.qty, luogo: it.luogo, cat: it.cat, unit: it.unit }, { qty: 4, luogo: 'freezer', cat: 'surgelati', unit: 'g' }, 'modifiche salvate subito');
  await page.click('[data-sheet-picker="cat"]');
  await page.keyboard.press('Escape');
  eq(await page.evaluate(() => ({ picker: state.pantrySheetPicker, open: state.pantryEditKey })), { picker: null, open: 'carciofi' }, 'Esc chiude prima l\'elenco');
  await page.click('.sheet-footer [data-close-pantry-edit]');
  eq(await page.evaluate(() => state.pantryEditKey), null, 'Fatto chiude');
  // Aggiunta: la bozza non tocca la Dispensa finché non si preme Aggiungi.
  await page.evaluate(() => { delete state.pantryItems['burrata']; state.pantryAddModalOpen = true; render(); });
  await page.fill('#pantry-add-name', 'Burrata');
  eq(await page.$eval('#sheet-cat-value', el => el.textContent.includes('Latticini')), true, 'categoria automatica dal nome');
  await page.click('[data-sheet-luogo="frigo"]');
  await page.click('[data-scadenza-quick="3"]');
  eq(await page.evaluate(() => ({ inPantry: !!state.pantryItems['burrata'], name: document.getElementById('pantry-add-name').value })), { inPantry: false, name: 'Burrata' }, 'bozza, nome tenuto');
  await page.click('#pantry-add-btn');
  const added = await page.evaluate(() => { const b = state.pantryItems['burrata']; return { qty: b.qty, luogo: b.luogo, exp: daysUntilDate(b.scadenza), open: state.pantryAddModalOpen, draft: state.pantryDraft }; });
  eq(added, { qty: 1, luogo: 'frigo', exp: 3, open: false, draft: null }, 'aggiunta');
  await page.click('.undo-toast button');
  eq(await page.evaluate(() => !!state.pantryItems['burrata']), false, 'annulla');
  eq(page.errors, [], 'errori JS');
});

test('scheda ingrediente: aprire un elenco o "Altro" non la riporta in cima né rifà l\'animazione', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 600 });
  await page.evaluate(() => { upsertPantryItem('Carciofi', 'frigo', 3); state.tab = 'dispensa'; state.pantryView = 'cibo'; state.pantryEditKey = 'carciofi'; render(); });
  eq(await page.evaluate(() => document.querySelector('.sheet-page').classList.contains('is-entering')), true, 'animazione alla prima apertura');
  await page.evaluate(() => { document.querySelector('.sheet-page').scrollTop = 250; });
  const before = await page.evaluate(() => document.querySelector('.sheet-page').scrollTop);
  assert(before > 100, `la scheda scorre (${before})`);
  await page.click('[data-sheet-more]');
  const r = await page.evaluate(() => ({ top: document.querySelector('.sheet-page').scrollTop, entering: document.querySelector('.sheet-page').classList.contains('is-entering'), more: !!document.querySelector('[data-sheet-unit]') }));
  eq(r, { top: before, entering: false, more: true });
  eq(page.errors, [], 'errori JS');
});

test('ricette: 18 nuove di uova, pesce e legumi, complete e in ogni stagione', async ({ page }) => {
  const r = await page.evaluate(() => {
    const nuove = ['Frittata di spinaci','Frittata di cipolle','Frittata di pasta','Shakshuka (uova nel sugo di pomodoro e peperoni)','Uova e spinaci (alla fiorentina)','Omelette al formaggio',
      'Platessa alla mugnaia','Sgombro al forno con pomodorini e limone','Alici in tortiera gratinate','Cozze alla marinara','Seppie con piselli','Spaghetti al tonno e pomodoro',
      'Dahl di lenticchie rosse con riso','Burger di ceci al forno','Crema di fagioli cannellini con crostini','Chili vegetariano di fagioli e peperoni','Insalata di lenticchie estiva','Purè di fave e cicoria'];
    const problems = [];
    nuove.forEach(n => {
      const m = getRecipeMeta(n), d = getRecipeDetails(n);
      if(!m || !d) return problems.push(`manca ${n}`);
      if(!/^https:\/\//.test(d.link)) problems.push(`link ${n}`);
      if(!d.procedimento.length || !getIngredientsFor(n).length) problems.push(`vuota ${n}`);
      if(!isMainDish(m)) problems.push(`non è un piatto ${n}`);
      if(!['uova','pesce','legumi'].includes(recipeProteina(m))) problems.push(`proteina ${n}`);
      if(m.gradimento) problems.push(`gradimento ${n}`);
      getIngredientsFor(n).forEach(it => { if(classifyDept(it.ingrediente) === 'altro') problems.push(`reparto ${it.ingrediente}`); });
    });
    // Ogni stagione ha almeno una ricetta nuova per ciascuna proteina.
    const seasons = {};
    ['primavera','estate','autunno','inverno'].forEach(season => {
      const inSeason = nuove.map(getRecipeMeta).filter(m => m.stagioni.includes(season) || m.stagioni.includes('tutto'));
      seasons[season] = ['uova','pesce','legumi'].every(p => inSeason.some(m => recipeProteina(m) === p));
    });
    return { problems, seasons };
  });
  eq(r, { problems: [], seasons: { primavera: true, estate: true, autunno: true, inverno: true } });
});

test('generatore: evita le ricette delle ultime settimane e delle altre settimane in Menù', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.extraWeeks = [];
    generateWeek(0);
    const names = w => { const out = new Set(); WEEK_DISPLAY_ORDER.forEach(i => ['pranzo','cena'].forEach(meal => { const n = effectiveMeal(w, i, meal).principale; if(n) out.add(n); })); return out; };
    const week0 = names(0);
    // Il passaggio di settimana ricorda i piatti della settimana finita.
    rememberWeekRecipes(isoLocalDate(weekDatesFor(0)[0]));
    const remembered = [...week0].every(n => state.recipeHistory.some(h => h.nome === n));
    generateWeek(1);
    const week1 = names(1);
    const overlap = [...week1].filter(n => week0.has(n)).length;
    // La storia più vecchia di RECENT_WEEKS settimane non conta più.
    const outside = allRecipeMetas().map(x => x.nome).find(n => !week0.has(n));
    state.recipeHistory = [{ nome: outside, dal: '2000-01-01' }];
    state.extraWeeks = [];
    const old = recentRecipeNames(1).has(outside);
    return { remembered, overlap, old };
  });
  eq(r, { remembered: true, overlap: 0, old: false });
});

// ---------------------------------------------------------------- runner

test('pasto: piatti in ordine di portata, + piatto per portata, Cambia e ✕ del singolo piatto, dettaglio a fisarmonica', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.extraWeeks = []; generateWeek(1);
    const byTipo = t => allRecipeMetas().filter(x => x.tipologia === t).map(x => x.nome);
    const [primo] = byTipo('primo'), [contorno, contorno2] = byTipo('contorno'), [antipasto] = byTipo('antipasto'), [dolce] = byTipo('dolce');
    // principale "primo", poi aggiunti a caso: la card li mette in ordine di portata
    writeMealDishes(1, 1, 'cena', primo, [dolce, contorno, antipasto]);
    state.tab = 'menu'; render();
    const courses = () => [...document.querySelectorAll('.meal-block[data-week-idx="1"][data-day-index="1"][data-meal="cena"] .dish-course')].map(e => e.firstChild.textContent);
    const out = { names: { primo, contorno, contorno2, antipasto, dolce }, order: courses() };
    // + piatto: la portata di partenza è una che manca, si sceglie dai chip
    document.querySelector('[data-open-dish-picker="1_1_cena"]:not([data-dish-replace])').click();
    out.pickerTipo = state.dishPicker.tipo;
    document.querySelector('[data-dish-course="contorno"]').click();
    out.onlyContorni = [...document.querySelectorAll('[data-dish-pick]')].every(e => getRecipeMeta(e.dataset.dishPick).tipologia === 'contorno');
    out.noDuplicate = !document.querySelector(`[data-dish-pick="${CSS.escape(contorno)}"]`);
    document.querySelector(`[data-dish-pick="${CSS.escape(contorno2)}"]`).click();
    out.afterAdd = effectiveMeal(1, 1, 'cena');
    // Cambia del solo dolce: gli altri restano
    document.querySelector(`[data-dish-replace="${CSS.escape(dolce)}"]`).click();
    out.replaceTipo = state.dishPicker.tipo;
    const other = document.querySelector('[data-dish-pick]').dataset.dishPick;
    document.querySelector('[data-dish-pick]').click();
    out.afterReplace = effectiveMeal(1, 1, 'cena');
    out.other = other;
    // ✕ del principale: il primo degli altri prende il suo posto
    document.querySelector(`[data-dish-remove="1_1_cena"][data-dish-name="${CSS.escape(primo)}"]`).click();
    out.afterRemove = effectiveMeal(1, 1, 'cena');
    out.toast = state.undoToast && state.undoToast.message;
    return out;
  });
  const n = r.names;
  eq(r.order, ['Antipasto', 'Primo', 'Contorno', 'Dolce'], 'ordine di portata');
  eq(r.pickerTipo, 'dolce', 'portata di partenza');
  assert(r.onlyContorni && r.noDuplicate, 'solo contorni, senza quelli già nel pasto');
  eq(r.afterAdd, { principale: n.primo, contorni: [n.dolce, n.contorno, n.antipasto, n.contorno2] }, 'aggiunto');
  eq(r.replaceTipo, 'dolce', 'Cambia parte dalla portata del piatto');
  eq(r.afterReplace, { principale: n.primo, contorni: [r.other, n.contorno, n.antipasto, n.contorno2] }, 'cambiato solo il dolce');
  eq(r.afterRemove, { principale: r.other, contorni: [n.contorno, n.antipasto, n.contorno2] }, 'tolto il principale');
  eq(r.toast, 'Piatto tolto', 'annulla');
  await page.click('.undo-toast button');
  eq(await page.evaluate(() => effectiveMeal(1, 1, 'cena').principale), n.primo, 'annullato');
  // Dettaglio: una tab per piatto (nell'ordine di portata), si vede solo l'attivo; dentro, Ingredienti | Passaggi;
  // le porzioni stanno nella tab Ingredienti; le azioni nel menù ⋯; "Cucina" è un bottone fisso.
  const d = await page.evaluate(() => {
    state.expandedDay = '1_1_cena'; render();
    const page = () => document.querySelector('[data-page^="meal-"]');
    const tabs = () => [...page().querySelectorAll('.dish-tab-label')].map(e => e.textContent.trim());
    const out = { tabs: tabs(), shown: page().querySelectorAll('.dish-acc').length, active: page().querySelector('.dish-tab.active .dish-tab-label').textContent.trim(), buttons: page().querySelectorAll('[data-mancanti-in-spesa]').length };
    page().querySelectorAll('.dish-tab')[1].click(); // Primo: ha ingredienti e procedimento
    out.paneTabs = [...page().querySelectorAll('.pane-tab')].map(e => e.textContent.trim());
    out.paneActive = page().querySelector('.pane-tab.active').textContent.trim();
    out.persone = page().querySelector('.persone-row').textContent.replace(/\s+/g, ' ').trim();
    out.stepperInRow = !!page().querySelector('.persone-row [data-portions-inc]');
    out.noTitleInIng = !page().querySelector('.dish-acc .detail-section-title');
    const before = state.dayPortions['1_1_cena'];
    page().querySelector('.persone-row [data-portions-inc]').click();
    out.portionsUp = state.dayPortions['1_1_cena'] !== before;
    out.fab = !!page().querySelector('.cook-fab');
    page().querySelector('[data-dish-pane-value="steps"]').click();
    out.stepsShown = !!page().querySelector('.steps-list') && !page().querySelector('.persone-row');
    out.fabInSteps = !!page().querySelector('.cook-fab');
    page().querySelector('[data-meal-menu]').click();
    out.menu = [...page().querySelectorAll('.meal-menu .topbar-menu-item')].map(e => e.textContent.replace(/\s+/g, ' ').trim());
    out.addInRow = !!page().querySelector('.dish-tabs-row .dish-tabs-add');
    return out;
  });
  eq(d.tabs, ['Antipasto', 'Primo', 'Contorno', 'Contorno 2', 'Dolce'], 'tab per portata');
  eq([d.shown, d.active], [1, 'Antipasto'], 'visibile solo la tab attiva');
  eq(d.paneTabs, ['Ingredienti', 'Passaggi'], 'tab Ingredienti/Passaggi');
  eq(d.paneActive, 'Ingredienti', 'parte da Ingredienti');
  assert(/^Per.*\d+.*person[ae]$/.test(d.persone) && d.stepperInRow && d.noTitleInIng && d.portionsUp, `porzioni nella tab: ${d.persone}`);
  assert(d.fab && d.stepsShown && d.fabInSteps, 'Cucina fisso in entrambe le tab');
  eq(d.menu.length, 3, 'menù ⋯: cambia, modifica, togli');
  assert(/Cambia piatto/.test(d.menu[0]) && /Modifica ricetta/.test(d.menu[1]) && /Togli/.test(d.menu[2]), `voci: ${d.menu.join(' | ')}`);
  assert(d.addInRow, '+ piatto a destra delle tab');
  assert(d.buttons <= 1, 'un solo "Aggiungi ingredienti" per tutto il pasto');
  eq(page.errors, [], 'errori JS');
});

test('ammollo: promemoria sotto la cena del giorno prima, solo per legumi da mettere a bagno', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.extraWeeks = []; generateWeek(1);
    // settimana 1, ordine sab..ven: mar (i=1) viene dopo lun (i=0)
    ['pranzo', 'cena'].forEach(m => WEEK_DISPLAY_ORDER.forEach(i => writeMealDishes(1, i, m, 'Pasta al pesto', [])));
    writeMealDishes(1, 1, 'cena', 'Pasta e ceci', []);
    state.tab = 'menu'; render();
    const noteIn = i => { const c = document.querySelector(`.day-card[data-week-idx="1"][data-day-index="${i}"] .soak-note`); return c ? c.textContent.replace(/\s+/g, ' ').trim() : null; };
    const out = { mon: noteIn(0), tue: noteIn(1) };
    writeMealDishes(1, 1, 'cena', 'Pasta e lenticchie', []); render(); // lenticchie già cotte: niente ammollo
    out.monCanned = noteIn(0);
    out.inCard = !!document.querySelector('[data-page^="meal-"] .soak-note');
    return out;
  });
  assert(r.mon && r.mon.includes('Stasera, per domani') && r.mon.includes('Ammollo dei legumi: Pasta e ceci (cena)'), `lunedì: ${r.mon}`);
  eq([r.tue, r.monCanned, r.inCard], [null, null, false], 'solo quando serve');
  eq(page.errors, [], 'errori JS');
});

test('menù: un pasto vuoto non risulta mai cucinato, anche con una spunta rimasta', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.extraWeeks = []; generateWeek(1);
    clearMealToEmpty(1, 2, 'cena');
    weekMealsDoneRef(1)[2] = { cena: true }; // spunta rimasta da prima
    state.tab = 'menu'; render();
    const b = document.querySelector('.meal-block[data-week-idx="1"][data-day-index="2"][data-meal="cena"]');
    return { done: b.classList.contains('done'), tag: !!b.querySelector('.done-tag') };
  });
  eq(r, { done: false, tag: false });
  eq(page.errors, [], 'errori JS');
});

test('meal prep: lista nel giorno di prep (sabato di default), doppia dose in Spesa e in freezer, piatto dal freezer senza Spesa', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.extraWeeks = []; generateWeek(1);
    ['pranzo', 'cena'].forEach(m => WEEK_DISPLAY_ORDER.forEach(i => writeMealDishes(1, i, m, 'Pasta al pesto', [])));
    const mp = allRecipeMetas().find(x => x.freezerNew === 'meal-prep' && getIngredientsFor(x.nome).length);
    writeMealDishes(1, 2, 'cena', mp.nome, []); // mercoledì
    Object.keys(state.pantryItems).forEach(k => { if(state.pantryItems[k].frozenMeal) delete state.pantryItems[k]; });
    state.tab = 'menu'; render();
    const box = () => document.querySelector('.day-card[data-week-idx="1"][data-day-index="5"] .prep-box');
    const out = { name: mp.nome, inSatBox: !!box() && box().textContent.includes(mp.nome), inSunBox: !!document.querySelector('.day-card[data-week-idx="1"][data-day-index="6"] .prep-box') };
    const ing = getIngredientsFor(mp.nome)[0];
    const shopQty = () => buildShopFlat().filter(x => x.ingrediente === ing.ingrediente && x.context.includes('Mercoledì')).map(x => x.qta).join('|');
    out.qty1 = shopQty();
    box().querySelector('[data-prep-double]').click();
    out.qty2 = shopQty();
    box().querySelector('[data-prep-done]').click();
    out.frozen = freezerPortionsOf(mp.nome);
    out.tag = document.querySelector('.meal-block[data-week-idx="1"][data-day-index="2"][data-meal="cena"] .dish-tag').textContent;
    // venerdì a pranzo: dal freezer → niente Spesa, promemoria giovedì sera
    document.querySelector('.meal-block[data-week-idx="1"][data-day-index="4"][data-meal="pranzo"] [data-open-dish-picker]:not([data-dish-replace])').click();
    document.querySelector('[data-dish-course="freezer"]').click();
    document.querySelector(`[data-dish-pick="${CSS.escape(mp.nome)}"]`).click();
    out.fromFreezer = isFreezerDish('1_4_pranzo', mp.nome);
    out.shopFri = buildShopFlat().some(x => x.ingrediente === ing.ingrediente && x.context.startsWith('Venerdì'));
    const thu = document.querySelector('.day-card[data-week-idx="1"][data-day-index="3"] .soak-note');
    out.thuNote = thu ? thu.textContent.replace(/\s+/g, ' ') : '';
    // sabato: prep spostato
    document.querySelector('[data-prep-day="dom"][data-prep-week]').click();
    out.movedToSun = !!document.querySelector('.day-card[data-week-idx="1"][data-day-index="6"] .prep-box');
    return out;
  });
  assert(r.inSatBox && !r.inSunBox, 'di default il prep è di sabato, col piatto meal prep');
  assert(r.qty1 && r.qty2 && r.qty1 !== r.qty2, `doppia dose in Spesa: ${r.qty1} → ${r.qty2}`);
  assert(r.frozen > 0, 'porzioni in freezer dopo il prep');
  assert(r.tag.includes('pronto') && r.tag.includes('×2'), `etichetta: ${r.tag}`);
  assert(r.fromFreezer && !r.shopFri, 'dal freezer, niente Spesa');
  assert(r.thuNote.includes('Togli dal freezer') && r.thuNote.includes(r.name), `giovedì sera: ${r.thuNote}`);
  assert(r.movedToSun, 'prep spostato a domenica');
  eq(page.errors, [], 'errori JS');
});

test('inventario veloce: Sì apre quantità/unità/luogo e OK la toglie da "Da fare"; No la azzera senza Spesa; quello in Dispensa parte già compilato', async ({ page }) => {
  const r = await page.evaluate(() => {
    try{ localStorage.removeItem('cookpop-inventory-answers'); }catch(e){}
    state.inventoryAnswered = null;
    upsertPantryItem('Pecorino romano', 'frigo', 3, '', 'latticini');
    delete state.pantryItems['tonno in scatola'];
    state.tab = 'dispensa'; state.inventoryOpen = true; state.inventoryFilter = 'todo'; render();
    const row = n => [...document.querySelectorAll('.inv-q-row')].find(r => r.querySelector('.inv-q-name').textContent.toLowerCase() === n);
    const out = { pecPrefilled: !!row('pecorino romano') && row('pecorino romano').querySelector('[data-inv-qty-input]').value === '3' && !!row('pecorino romano').querySelector('[data-inv-ok]') };
    row('tonno in scatola').querySelector('[data-inv-has="1"]').click();
    const tonnoRow = row('tonno in scatola');
    out.tonnoOpen = !!tonnoRow.querySelector('[data-inv-ok]') && tonnoRow.querySelectorAll('[data-inv-luogo]').length;
    out.tonnoLuogo = state.pantryItems['tonno in scatola'].luogo;
    const inp = tonnoRow.querySelector('[data-inv-qty-input]');
    inp.value = '4'; inp.dispatchEvent(new Event('change'));
    row('tonno in scatola').querySelector('[data-inv-luogo="ripostiglio"]').click();
    row('tonno in scatola').querySelector('[data-inv-ok]').click();
    out.tonno = state.pantryItems['tonno in scatola'];
    out.tonnoHidden = !row('tonno in scatola');
    row('pecorino romano').querySelector('[data-inv-has="0"]').click();
    out.pecQty = state.pantryItems['pecorino romano'].qty;
    out.pecHidden = !row('pecorino romano');
    out.inShop = buildShopFlat().some(x => x.ingrediente.toLowerCase() === 'pecorino romano' && x.context === 'Finiti in Dispensa');
    out.doneText = document.querySelector('.inv-q-progress-text').textContent;
    return out;
  });
  assert(r.pecPrefilled, 'pecorino già in Dispensa: riga aperta coi suoi dati');
  eq([r.tonnoOpen, r.tonnoLuogo], [5, 'dispensa'], 'Sì apre la riga con tutti i luoghi');
  eq([r.tonno.qty, r.tonno.luogo, r.tonnoHidden], [4, 'ripostiglio', true], 'quantità scritta, luogo scelto, OK la nasconde');
  eq([r.pecQty, r.pecHidden, r.inShop], [0, true, false], 'No: a 0, nascosta, non in Spesa');
  assert(r.doneText.startsWith('2 su'), r.doneText);
  eq(page.errors, [], 'errori JS');
});
test('carte fedeltà: si aggiungono da Impostazioni, si aprono da Spesa col codice a barre; EAN-13 e Code 128 corretti', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.loyaltyCards = []; state.tab = 'spesa'; render();
    document.querySelector('#settings-backdrop [data-cards-manage]').click();
    document.querySelector('[data-card-add]').click();
    const name = document.getElementById('card-name'), num = document.getElementById('card-number');
    name.value = 'Esselunga'; name.dispatchEvent(new Event('input', { bubbles: true }));
    num.value = '4006381333931'; num.dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('[data-card-save]').click();
    const saved = state.loyaltyCards.map(c => [c.name, c.number]);
    document.querySelector('[data-close-cards]').click();
    document.querySelector('[data-open-cards]').click();
    document.querySelector('[data-card-view]').click();
    const view = document.querySelector('.card-view');
    // EAN-13 4006381333931: 95 moduli, guardie giuste; Code 128 di "ABC-12": start B (211214), stop (2331112)
    const ean = barcodeModules('4006381333931');
    const c128 = barcodeModules('ABC-12');
    return { saved, view: !!view && view.textContent.includes('4006381333931') && !!view.querySelector('svg rect'), kinds: [cardBarcodeKind('4006381333931'), cardBarcodeKind('12345678'), cardBarcodeKind('ABC-12')],
      eanLen: ean.length, eanGuards: ean.slice(0,3) + ean.slice(45,50) + ean.slice(-3), eanFirst: ean.slice(3,10),
      c128Start: c128.slice(0, 11), c128Stop: c128.slice(-13), c128Len: c128.length, sums: CODE128.every((p, i) => p.split('').reduce((a, b) => a + Number(b), 0) === (i === 106 ? 13 : 11)) };
  });
  eq(r.saved, [['Esselunga', '4006381333931']], 'salvata');
  assert(r.view, 'carta a tutto schermo col codice e il numero');
  eq(r.kinds, ['ean13', 'code128', 'code128'], 'tipo di codice');
  eq([r.eanLen, r.eanGuards, r.eanFirst], [95, '10101010101', '0001101'], 'EAN-13');
  eq([r.c128Start, r.c128Stop, r.c128Len, r.sums], ['11010010000', '1100011101011', 11 * 8 + 13, true], 'Code 128');
  eq(page.errors, [], 'errori JS');
});

test('carte fedeltà: Code 39 e QR, import da link #carte= con conferma, senza doppioni', async ({ page }) => {
  const r = await page.evaluate(async () => {
    state.loyaltyCards = [{ id: 'x', name: 'Già qui', number: '0402008090593', color: '#000' }];
    const data = [['Famila', '0402008090593', 'ean_13', '#e5512f'], ['IKEA', '6275980414616639489', 'qr_code', '#0058a3'], ['Intimissimi', '000100022162361', 'code_39', '#000000']];
    const json = new TextEncoder().encode(JSON.stringify(data));
    const b64 = btoa(String.fromCharCode(...json)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    location.hash = '#carte=' + b64;
    await new Promise(res => setTimeout(res, 100));
    const modal = document.querySelector('[data-cards-import-ok]') ? document.querySelector('.card-import-list').textContent : null;
    document.querySelector('[data-cards-import-ok]').click();
    const names = state.loyaltyCards.map(c => c.name);
    state.cardViewId = state.loyaltyCards.find(c => c.name === 'IKEA').id; render();
    const qr = !!document.querySelector('.card-view .card-qr');
    const c39 = code39Modules('A1');
    return { hash: location.hash, modal, names, qr, c39Start: c39.slice(0, 12), qrSize: qrMatrix('6275980414616639489').length };
  });
  eq(r.hash, '#spesa', 'link tolto dall\'indirizzo');
  assert(r.modal && r.modal.includes('IKEA') && !r.modal.includes('Famila'), `conferma: ${r.modal}`);
  eq(r.names, ['Già qui', 'IKEA', 'Intimissimi'], 'importate senza doppioni');
  assert(r.qr, 'IKEA mostra il QR');
  eq([r.c39Start, r.qrSize], ['100010111011', 25], 'Code 39 inizia con *, QR versione 2');
  eq(page.errors, [], 'errori JS');
});

test('carte fedeltà: in ordine alfabetico, ricerca per nome che tiene il fuoco, loghi importati anche per le carte già presenti', async ({ page }) => {
  const logo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
  await page.evaluate(() => {
    state.loyaltyCards = [{ id: 'a', name: 'Penny', number: '2095057969316', color: '#123456' }, { id: 'b', name: 'Famila', number: '0402008090593', color: '#e5512f' }];
    state.tab = 'spesa'; state.cardsOpen = 'list'; render();
  });
  await page.evaluate(list => { state.cardsImport = parseCardsImport(list); render(); }, [['Penny', '2095057969316', 'ean_13', '#e52d21', logo], ['IKEA', '6275980414616639489', 'qr_code', '#0057a4', logo]]);
  await page.waitForSelector('[data-cards-import-ok]');
  await page.click('[data-cards-import-ok]');
  const r1 = await page.evaluate(() => ({
    order: [...document.querySelectorAll('.card-grid .card-tile')].map(e => e.getAttribute('aria-label')),
    penny: state.loyaltyCards.find(c => c.name === 'Penny'),
    ikeaLogo: !!state.loyaltyCards.find(c => c.name === 'IKEA').logo,
    logos: document.querySelectorAll('.card-grid .card-tile-logo').length
  }));
  await page.fill('#cards-search', 'fam');
  const r2 = await page.evaluate(() => ({ shown: [...document.querySelectorAll('.card-grid .card-tile')].map(e => e.getAttribute('aria-label')), focus: document.activeElement && document.activeElement.id }));
  eq(r1.order, ['Famila', 'IKEA', 'Penny'], 'ordine alfabetico');
  eq([!!r1.penny.logo, r1.penny.color, r1.ikeaLogo, r1.logos], [true, '#e52d21', true, 2], 'logo e colore aggiunti a Penny, IKEA nuova col logo');
  eq(r2, { shown: ['Famila'], focus: 'cards-search' }, 'ricerca');
  eq(page.errors, [], 'errori JS');
});

test('carte fedeltà: + in alto apre la scheda nuova, Modifica dalla carta aperta, chiudendo si torna all\'elenco senza che salti in cima', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.loyaltyCards = Array.from({ length: 14 }, (_, k) => ({ id: 'k' + k, name: 'Negozio ' + String.fromCharCode(65 + k), number: String(100000 + k), color: '#e52d21' }));
    state.tab = 'spesa'; state.cardsOpen = 'list'; state.cardsListUnder = false; render();
    const sp = () => document.querySelector('.sheet-page[data-page="cards"]');
    sp().scrollTop = 250;
    const out = { noManageBtn: !document.querySelector('[data-cards-manage]:not(#settings-backdrop *)'), plus: !!document.querySelector('.sheet-page[data-page="cards"] [data-card-add]') };
    document.querySelector('[data-card-view="k12"]').click();
    document.querySelector('.card-view [data-card-edit]').click();
    out.form = document.querySelector('.sheet-page[data-page="cards-form"] .settings-title').textContent;
    const name = document.getElementById('card-name');
    name.value = 'Zeta'; name.dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('[data-card-save]').click();
    out.saved = state.loyaltyCards.find(c => c.id === 'k12').name;
    out.backToList = state.cardsOpen === 'list' && !document.querySelector('[data-page="cards-form"]');
    document.querySelector('[data-card-view="k3"]').click();
    document.querySelector('.card-view-close').click();
    out.scroll = sp().scrollTop;
    out.listEntering = sp().classList.contains('is-entering');
    return out;
  });
  eq([r.noManageBtn, r.plus, r.form, r.saved, r.backToList], [true, true, 'Modifica carta', 'Zeta', true], 'flusso');
  eq([r.scroll, r.listEntering], [250, false], 'l\'elenco resta dov\'era');
  eq(page.errors, [], 'errori JS');
});

test('categorie come le corsie del supermercato: regole dal nome e riclassificazione delle voci già salvate', async ({ page }) => {
  const r = await page.evaluate(() => {
    const auto = ['Tonno sott\'olio', 'Prosciutto crudo', 'Farina 00', 'Spaghetti', 'Passata di pomodoro', 'Ragù di carne', 'Olive taggiasche denocciolate', 'Uova', 'Rum', 'Pangrattato', 'Ceci già cotti', 'Olio EVO'].map(classifyDept);
    state.pantryItems['spaghetti'] = { nome: 'Spaghetti', cat: 'pane', luogo: 'dispensa', qty: 1 };
    state.pantryItems['uova'] = { nome: 'Uova', cat: 'uova', luogo: 'frigo', qty: 6 };
    state.pantryItems['tonno sott\'olio'] = { nome: 'Tonno sott\'olio', cat: 'pesce', luogo: 'dispensa', qty: 2 };
    state.pantryItems['robetta'] = { nome: 'Robetta', cat: 'dispensa', luogo: 'dispensa', qty: 1 };
    state.pantryItems['zucchine'] = { nome: 'Zucchine', cat: 'avanzi', luogo: 'frigo', qty: 1 };
    state.customDepts = Object.assign({}, state.customDepts, { pane: { label: 'Pane, pasta e farine', icon: '🍞' } });
    state.deptsRegrouped1 = false;
    runMigrations();
    applyCustomDepts();
    const c = k => state.pantryItems[k].cat;
    return { auto, cats: [c('spaghetti'), c('uova'), c('tonno sott\'olio'), c('robetta'), c('zucchine')], pane: DEPT_LABEL.pane, uovaGone: !DEPT_LABEL.uova && !DEPT_LABEL.dispensa };
  });
  eq(r.auto, ['conserve', 'salumi', 'dolci', 'pasta', 'conserve', 'salse', 'conserve', 'latticini', 'bibite', 'pane', 'legumi', 'base'], 'regole dal nome');
  eq(r.cats, ['pasta', 'latticini', 'conserve', '', 'avanzi'], 'voci salvate riclassificate');
  eq([r.pane, r.uovaGone], ['Pane e sostituti', true], 'nuovi nomi, vecchie categorie sparite');
  eq(page.errors, [], 'errori JS');
});

test('spesa in ordine di corsia: casa in cima, surgelati in fondo; rosmarino con la verdura', async ({ page }) => {
  const r = await page.evaluate(() => {
    const order = shopAisleOrder();
    const pos = d => order.indexOf(d);
    return {
      casaFirst: pos('pulizia') < pos('verdura') && pos('igiene') < pos('verdura'),
      frozenLast: order.slice(-2).join(','),
      auto: ['Rosmarino', 'Rosmarino secco', 'Salvia', 'Piselli surgelati', 'Merluzzo surgelato', 'Origano'].map(classifyDept)
    };
  });
  eq(r, { casaFirst: true, frozenLast: 'surgelati,finiti', auto: ['verdura', 'base', 'verdura', 'surgelati', 'surgelati', 'base'] });
  eq(page.errors, [], 'errori JS');
});

test('ordine corsie: frecce su/giù in Spesa, ripristino; il freezer non sposta in Surgelati', async ({ page }) => {
  await page.evaluate(() => {
    state.shopAisleCustom = [];
    upsertPantryItem('Piselli', 'freezer', 0);
    state.shopExtras = { x1: { ingrediente: 'Piselli', qta: '' }, x2: { ingrediente: 'Zucchine', qta: '' }, x3: { ingrediente: 'Detersivo piatti', qta: '' } };
    state.tab = 'spesa'; state.shopView = 'reparto'; render();
  });
  const before = await page.evaluate(() => [...document.querySelectorAll('.dept-title')].map(e => e.textContent.trim()).join('|'));
  const iPul = before.indexOf('Pulizia'), iVer = before.indexOf('Frutta e verdura'), iSur = before.indexOf('Surgelati');
  await page.evaluate(() => { state.aisleOrderOpen = true; render(); });
  await page.waitForSelector('[data-page="aisles"]');
  await page.click('[data-aisle-move="verdura"][data-dir="-1"]');
  const r = await page.evaluate(() => ({ first2: shopAisles().slice(0, 6), custom: state.shopAisleCustom.length > 0 }));
  await page.click('[data-aisle-reset]');
  const reset = await page.evaluate(() => state.shopAisleCustom.length);
  eq([iPul >= 0 && iPul < iVer, iSur], [true, -1], 'casa in cima, piselli del freezer restano in Frutta e verdura');
  eq(r.first2.indexOf('verdura') < r.first2.indexOf('altro-casa'), true, 'verdura spostata su');
  eq([r.custom, reset], [true, 0], 'ripristino');
  eq(page.errors, [], 'errori JS');
});

test('ordine corsie: trascinando dalla maniglia la categoria si sposta e l\'ordine si salva', async ({ page }) => {
  await page.evaluate(() => { state.shopAisleCustom = []; state.tab = 'spesa'; state.aisleOrderOpen = true; render(); });
  await page.waitForSelector('[data-page="aisles"]');
  const h = await page.locator('[data-aisle-row="verdura"] [data-aisle-handle]').boundingBox();
  const top = await page.locator('[data-aisle-row]').first().boundingBox();
  await page.mouse.move(h.x + h.width / 2, h.y + h.height / 2);
  await page.mouse.down();
  await page.mouse.move(h.x + h.width / 2, top.y + 4, { steps: 8 });
  await page.mouse.up();
  const r = await page.evaluate(() => ({ first: shopAisles()[0], saved: state.shopAisleCustom[0], dom: document.querySelector('[data-aisle-row]').dataset.aisleRow }));
  eq(r, { first: 'verdura', saved: 'verdura', dom: 'verdura' });
  eq(page.errors, [], 'errori JS');
});

test('lista spesa leggera: tendina Raggruppa per (Corsia, Giorno, A-Z), sezioni senza conteggio, matita per la nota', async ({ page }) => {
  await page.evaluate(() => {
    state.shopExtras = { a: { ingrediente: 'Zucchine', qta: '2' }, b: { ingrediente: 'Detersivo piatti', qta: '' } };
    state.ingredientNotes = {};
    state.tab = 'spesa'; state.shopView = 'reparto'; render();
  });
  const r1 = await page.evaluate(() => ({
    counts: [...document.querySelectorAll('.shop-list .dept-count')].length > 0,
    pencil: !!document.querySelector('.ing-note-pencil'),
    oldNote: !!document.querySelector('.ing-note-add')
  }));
  await page.selectOption('[data-shop-group]', 'az');
  const r2 = await page.evaluate(() => ({ view: state.shopView, sections: document.querySelectorAll('.shop-list .dept-title').length, names: [...document.querySelectorAll('.shop-az .item-name')].map(e => e.textContent.trim()) }));
  await page.click('.shop-az .ing-note-pencil');
  const r3 = await page.evaluate(() => !!document.querySelector('.ing-note-input'));
  eq([r1.counts, r1.pencil, r1.oldNote], [false, true, false], 'niente conteggi, matita');
  eq(r2.view, 'az'); eq(r2.sections, 0, 'A-Z senza sezioni');
  eq(r2.names.slice().sort((a, b) => a.localeCompare(b, 'it')), r2.names, 'in ordine alfabetico');
  eq(r3, true, 'la matita apre la nota');
  eq(page.errors, [], 'errori JS');
});

test('spesa: le righe spuntate vanno in Completati in fondo, togliendo la spunta tornano al loro posto; niente più Modalità spesa', async ({ page }) => {
  await page.evaluate(() => {
    state.shopExtras = { a: { ingrediente: 'Zucchine', qta: '2' }, b: { ingrediente: 'Detersivo piatti', qta: '' } };
    state.shopChecked = {}; state.tab = 'spesa'; state.shopView = 'reparto'; render();
  });
  await page.click('.shop-item input[data-shop-keys="a"]');
  const r1 = await page.evaluate(() => ({
    completed: [...document.querySelectorAll('.shop-completed .item-name')].map(e => e.textContent.trim()),
    last: document.querySelector('.shop-list').lastElementChild.classList.contains('shop-completed'),
    move: !!document.querySelector('.shop-completed #move-checked-to-pantry'),
    mode: !!document.getElementById('shop-mode-toggle')
  }));
  await page.click('.shop-completed input[data-shop-keys="a"]');
  const r2 = await page.evaluate(() => ({ completed: !!document.querySelector('.shop-completed'), back: [...document.querySelectorAll('.shop-list .shop-day-group:not(.shop-completed) .item-name')].some(e => e.textContent.trim() === 'Zucchine') }));
  eq(r1, { completed: ['Zucchine'], last: true, move: true, mode: false });
  eq(r2, { completed: false, back: true }, 'tolta la spunta torna al suo posto');
  eq(page.errors, [], 'errori JS');
});

test('dispensa come la spesa: Cibo/Casa restano, Raggruppa per Categoria/Luogo/A-Z; in Spesa "Pasto"', async ({ page }) => {
  await page.evaluate(() => { upsertPantryItem('Zucchine', 'frigo', 3); upsertPantryItem('Carciofi', 'freezer', 2); state.tab = 'dispensa'; state.pantryView = 'cibo'; state.pantryGroupBy = 'cat'; render(); });
  const toggle = await page.evaluate(() => document.querySelectorAll('[data-pantry-view]').length);
  await page.selectOption('[data-pantry-group]', 'luogo');
  const luogo = await page.evaluate(() => [...document.querySelectorAll('.pantry-list .dept-title')].map(e => e.textContent.trim()));
  await page.selectOption('[data-pantry-group]', 'az');
  const az = await page.evaluate(() => ({ titles: document.querySelectorAll('.pantry-list .dept-title:not(.expiring-group .dept-title)').length, names: [...document.querySelectorAll('.pantry-list .shop-az .inv-name')].map(e => e.textContent.trim()) }));
  await page.evaluate(() => { state.tab = 'spesa'; render(); });
  const pasto = await page.evaluate(() => [...document.querySelectorAll('[data-shop-group] option')].map(o => o.textContent));
  eq(toggle, 2, 'Cibo/Casa');
  eq(luogo.includes('Frigo') && luogo.includes('Freezer'), true, 'sezioni per luogo');
  eq(az.titles, 0, 'A-Z senza sezioni');
  eq(az.names.slice().sort((a, b) => a.localeCompare(b, 'it')), az.names, 'A-Z in ordine');
  eq(pasto, ['Corsia', 'Pasto', 'Dalla A alla Z']);
  eq(page.errors, [], 'errori JS');
});

test('dispensa: un tocco sull\'icona Casa passa subito a Casa (anche toccando il disegno)', async ({ page }) => {
  await page.evaluate(() => { state.tab = 'dispensa'; state.pantryView = 'cibo'; state.pantrySelectMode = false; render(); });
  await page.click('[data-pantry-view="casa"] svg');
  const v1 = await page.evaluate(() => state.pantryView);
  await page.click('[data-pantry-view="cibo"] svg path');
  const v2 = await page.evaluate(() => state.pantryView);
  eq([v1, v2], ['casa', 'cibo']);
  eq(page.errors, [], 'errori JS');
});

test('ricerca sempre visibile in cima a Spesa e Dispensa, filtra mentre scrivi senza perdere il fuoco', async ({ page }) => {
  await page.evaluate(() => {
    state.shopExtras = { a: { ingrediente: 'Zucchine', qta: '2' }, b: { ingrediente: 'Detersivo piatti', qta: '' } };
    state.shopSearch = ''; state.pantrySearch = '';
    upsertPantryItem('Zucchine', 'frigo', 2); upsertPantryItem('Carciofi', 'frigo', 1);
    state.tab = 'spesa'; render();
  });
  await page.click('#shop-search'); await page.keyboard.type('zuc');
  const s = await page.evaluate(() => ({ focus: document.activeElement.id, names: [...document.querySelectorAll('.shop-list .item-name')].map(e => e.textContent.trim()) }));
  await page.click('[data-search-clear="shop-search"]');
  const cleared = await page.evaluate(() => state.shopSearch);
  await page.evaluate(() => { state.tab = 'dispensa'; state.pantryView = 'cibo'; render(); });
  await page.click('#pantry-search'); await page.keyboard.type('carc');
  const d = await page.evaluate(() => ({ focus: document.activeElement.id, names: [...document.querySelectorAll('.pantry-list .inv-name')].map(e => e.textContent.trim()), oldToggle: !!document.getElementById('pantry-search-toggle') }));
  eq(s, { focus: 'shop-search', names: ['Zucchine'] }, 'spesa');
  eq(cleared, '', 'X cancella');
  eq([d.focus, d.names.includes('Carciofi'), d.names.includes('Zucchine'), d.oldToggle], ['pantry-search', true, false, false], 'dispensa');
  eq(page.errors, [], 'errori JS');
});

test('ricette: interruttore Ricette/Libro di cucina, ricerca in alto, album creati, riempiti e usati dalla ricetta', async ({ page }) => {
  await page.evaluate(() => { state.cookbooks = []; state.prepView = 'ricette'; state.filters.search = ''; state.tab = 'prep'; render(); });
  await page.click('#f-search'); await page.keyboard.type('pesto');
  const search = await page.evaluate(() => ({ focus: document.activeElement.id, n: document.querySelectorAll('.recipe-card').length, all: document.querySelectorAll('.recipe-card .recipe-title').length }));
  await page.click('[data-search-clear="f-search"]');
  await page.click('[data-prep-view="libro"] svg');
  await page.click('.cookbook-card.is-new');
  await page.fill('#cookbook-name', 'Menù di Natale');
  await page.click('#cookbook-name-save');
  const created = await page.evaluate(() => ({ n: state.cookbooks.length, open: !!document.querySelector('[data-page="cookbook"]') }));
  await page.click('[data-cookbook-pick]');
  const first = await page.evaluate(() => allRecipeMetas().map(r => r.nome).sort((a, b) => IT_COLLATOR_BASE.compare(a, b))[0]);
  await page.check(`[data-cookbook-pick-toggle="${first}"]`);
  await page.click('.sheet-footer [data-close-cookbook-pick]');
  const inAlbum = await page.evaluate(() => [...document.querySelectorAll('[data-page="cookbook"] .cookbook-row-name')].map(e => e.textContent.trim()));
  await page.evaluate(n => { state.cookbookOpenId = null; state.expandedRecipe = n; render(); }, first);
  await page.click('[data-recipe-menu]');
  await page.click('[data-album-for]');
  await page.click('.album-for-row[data-album-for-toggle]');
  const removed = await page.evaluate(() => state.cookbooks[0].recipes.length);
  eq([search.focus, search.n > 0], ['f-search', true], 'ricerca in alto');
  eq(created, { n: 1, open: true }, 'album creato e aperto');
  eq(inAlbum, [first], 'ricetta aggiunta');
  eq(removed, 0, 'tolta dall\'album dal dettaglio ricetta');
  eq(page.errors, [], 'errori JS');
});

test('libro di cucina: "Usa nel menù" mette le ricette dell\'album nel pasto scelto, con Annulla', async ({ page }) => {
  const names = await page.evaluate(() => {
    const all = allRecipeMetas();
    const primo = all.find(r => r.tipologia === 'primo').nome, contorno = all.find(r => r.tipologia === 'contorno').nome;
    state.cookbooks = [{ id: 'x', name: 'Natale', recipes: [contorno, primo] }];
    state.tab = 'prep'; state.prepView = 'libro'; state.cookbookOpenId = 'x'; render();
    return { primo, contorno };
  });
  await page.click('[data-cookbook-use]');
  const slotKey = await page.evaluate(() => document.querySelector('[data-cookbook-use-slot]').dataset.cookbookUseSlot);
  const before = await page.evaluate(k => { const m = parseMealKey(k); return effectiveMeal(m.weekIdx, m.i, m.meal).principale || null; }, slotKey);
  await page.click(`[data-cookbook-use-slot="${slotKey}"]`);
  const after = await page.evaluate(k => { const m = parseMealKey(k); const e = effectiveMeal(m.weekIdx, m.i, m.meal); return { p: e.principale, c: e.contorni, page: !!document.querySelector('[data-page="cookbook-use"]') }; }, slotKey);
  await page.click('.undo-toast button');
  const undone = await page.evaluate(k => { const m = parseMealKey(k); return effectiveMeal(m.weekIdx, m.i, m.meal).principale || null; }, slotKey);
  eq(after, { p: names.primo, c: [names.contorno], page: false }, 'primo come principale, il resto accanto');
  eq(undone, before, 'annulla');
  eq(page.errors, [], 'errori JS');
});

test('importa ricetta: arrivo dal menu Condividi, didascalia letta in ingredienti e procedimento, salvata come le altre', async ({ page }) => {
  const r = await page.evaluate(() => {
    const p = parseRecipeText(`TORTA DI MELE 🍎\nINGREDIENTI (per 6 persone):\n- 250 g di farina\n- 3 uova\n- zucchero 150 g\n- mezza bustina di lievito\n- cannella q.b.\nPROCEDIMENTO:\n1. Monta le uova con lo zucchero.\n2. Aggiungi farina e lievito.\n#dolci #torta`);
    return p;
  });
  eq(r.name, 'Torta di mele', 'nome');
  eq(r.ingredienti, [
    { ingrediente: 'Farina', qta: '250 g' }, { ingrediente: 'Uova', qta: '3' }, { ingrediente: 'Zucchero', qta: '150 g' },
    { ingrediente: 'Bustina di lievito', qta: '1/2' }, { ingrediente: 'Cannella', qta: 'q.b.' }
  ], 'ingredienti');
  eq([r.procedimento.length, r.porzioni], [2, '6 persone'], 'procedimento e porzioni');
  await page.evaluate(() => { state.recipeImport = { name: '', link: 'https://www.instagram.com/reel/X/', text: 'Crema veloce\nIngredienti:\n200 ml panna\nProcedimento:\nMonta la panna.' }; render(); });
  await page.click('[data-import-save]');
  const saved = await page.evaluate(() => ({ edit: state.recipeEditName, ing: getIngredientsFor('Crema veloce'), link: getRecipeDetails('Crema veloce').link, inList: allRecipeMetas().some(m => m.nome === 'Crema veloce') }));
  eq(saved, { edit: 'Crema veloce', ing: [{ ingrediente: 'Panna', qta: '200 ml' }], link: 'https://www.instagram.com/reel/X/', inList: true });
  eq(page.errors, [], 'errori JS');
});

test('album: Rinomina ed Elimina stanno nel menu ⋯ in alto a destra', async ({ page }) => {
  await page.evaluate(() => { state.cookbooks = [{ id: 'm', name: 'Prova', recipes: [] }]; state.tab = 'prep'; state.prepView = 'libro'; state.cookbookOpenId = 'm'; state.cookbookMenuOpen = false; render(); });
  const before = await page.evaluate(() => !!document.querySelector('[data-page="cookbook"] [data-cookbook-rename]'));
  await page.click('[data-cookbook-menu]');
  await page.click('[data-cookbook-rename]');
  const renameOpen = await page.evaluate(() => ({ draft: !!state.cookbookNameDraft, menu: state.cookbookMenuOpen }));
  await page.evaluate(() => { state.cookbookNameDraft = null; render(); });
  await page.click('[data-cookbook-menu]');
  await page.click('[data-cookbook-delete]');
  const after = await page.evaluate(() => ({ n: state.cookbooks.length, open: state.cookbookOpenId }));
  eq(before, false, 'non più in fondo alla pagina');
  eq(renameOpen, { draft: true, menu: false });
  eq(after, { n: 0, open: null });
  eq(page.errors, [], 'errori JS');
});

test('scheda pasto: ⋯ in alto, chi cucina in basso a sinistra, Da cucinare in basso a destra; avanzo con matita al posto di "Nessuna variante"', async ({ page }) => {
  const r = await page.evaluate(() => {
    const n = allRecipeMetas();
    const sl = allMealSlots().filter(m => m.weekIdx === 0);
    const day = sl.filter(m => m.i === sl[sl.length - 1].i);
    const cena = day.find(m => m.meal === 'cena'), pranzo = day.find(m => m.meal === 'pranzo');
    writeMealDishes(cena.weekIdx, cena.i, 'cena', n.find(x => x.tipologia === 'primo').nome, []);
    state.dayLinks[pranzo.key] = cena.key; delete state.dayLinkNotes[pranzo.key];
    state.showPastDays = true; state.tab = 'menu'; render();
    const blk = meal => document.querySelector(`.meal-block[data-day-index="${cena.i}"][data-meal="${meal}"]`);
    const c = blk('cena'), p = blk('pranzo');
    return {
      found: !!c && !!p,
      dotsTop: !!(c && c.querySelector('.day-meal .meal-overflow-btn')),
      cookBottom: !!(c && c.querySelector('.meal-foot .cook-pill')),
      eatBottom: !!(c && c.querySelector('.meal-foot .is-eat')),
      pencil: !!(p && p.querySelector('.avanzo-note-pencil')),
      noText: !!(p && !p.textContent.includes('Nessuna variante'))
    };
  });
  if(!r.found) return; // giorno passato non visibile: niente da controllare
  eq(r, { found: true, dotsTop: true, cookBottom: true, eatBottom: true, pencil: true, noText: true });
  eq(page.errors, [], 'errori JS');
});

test('spesa: aggiungere un ingrediente finito in Dispensa tiene la quantità scritta', async ({ page }) => {
  await page.evaluate(() => {
    upsertPantryItem('Carote', 'frigo', 0); delete state.pantryConfirmedShop['carote'];
    state.shopExtras = {}; state.tab = 'spesa'; state.shopView = 'reparto'; state.addIngModalOpen = true; state.addIngName = 'Carote'; render();
  });
  await page.fill('#shop-add-qta', '3');
  await page.click('#shop-add-btn');
  const r = await page.evaluate(() => {
    const row = [...document.querySelectorAll('.shop-item-row')].find(e => e.querySelector('.item-name') && e.querySelector('.item-name').textContent.trim().startsWith('Carote'));
    return { confirmed: state.pantryConfirmedShop['carote'], qty: row ? row.querySelector('.qty-num').textContent.trim() : null };
  });
  eq(r, { confirmed: '3', qty: '3' });
  eq(page.errors, [], 'errori JS');
});

test('riordino una tantum: ingredienti rimessi nelle categorie nuove, tranne categorie tue, avanzi e casa', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.customDepts = Object.assign({}, state.customDepts, { mia: { label: 'Mia', icon: '⭐' } });
    state.pantryItems['carote'] = { nome: 'Carote', cat: 'dolci', luogo: 'frigo', qty: 1 };
    state.pantryItems['pinoli'] = { nome: 'Pinoli', cat: 'altro', luogo: 'dispensa', qty: 1 };
    state.pantryItems['mio mix'] = { nome: 'Mio mix', cat: 'pasta', luogo: 'dispensa', qty: 1 };
    state.pantryItems['speck'] = { nome: 'Speck', cat: 'mia', luogo: 'frigo', qty: 1 };
    state.pantryItems['pollo arrosto'] = { nome: 'Pollo arrosto', cat: 'avanzi', luogo: 'frigo', qty: 1 };
    applyCustomDepts();
    state.deptsRegrouped3 = false; runMigrations();
    const c = k => state.pantryItems[k].cat;
    return [c('carote'), c('pinoli'), c('mio mix'), c('speck'), c('pollo arrosto')];
  });
  eq(r, ['verdura', 'dolci', 'pasta', 'mia', 'avanzi']);
  eq(page.errors, [], 'errori JS');
});

test('dispensa: ingrediente finito chiede + (lista spesa) o cestino (Finiti), fuori annulla', async ({ page }) => {
  await page.evaluate(() => {
    upsertPantryItem('Burro', 'frigo', 1); state.pantryItems['burro'].unit = 'pz';
    upsertPantryItem('Zucchero', 'dispensa', 1); state.pantryItems['zucchero'].unit = 'pz';
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    state.tab = 'dispensa'; state.pantryView = 'cibo'; render();
  });
  await page.click('[data-qty-dec="burro"]');
  eq(await page.locator('.finish-picker').count(), 1, 'tooltip aperto');
  await page.click('[data-finish-picker-close]', { position: { x: 5, y: 5 } });
  eq(await page.evaluate(() => [state.pantryItems['burro'].qty, state.pantryFinishPicker]), [1, null], 'fuori annulla');
  await page.click('[data-qty-dec="burro"]');
  await page.click('[data-finish-tolist="burro"]');
  await page.click('[data-qty-dec="zucchero"]');
  await page.click('[data-finish-trash="zucchero"]');
  const r = await page.evaluate(() => {
    const flat = buildShopFlat();
    const f = n => flat.find(x => x.ingrediente === n);
    return [state.pantryItems['burro'].qty, !!f('Burro') && f('Burro').confirmed, state.pantryItems['zucchero'].qty, !!f('Zucchero') && f('Zucchero').confirmed];
  });
  eq(r, [0, true, 0, false]);
  eq(page.errors, [], 'errori JS');
});

test('dispensa +: suggerisce gli ingredienti che hai già e ne copia luogo/unità/categoria; Aggiungi somma la quantità', async ({ page }) => {
  await page.evaluate(() => {
    upsertPantryItem('Parmigiano', 'frigo', 200, 'g', 'latticini');
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    state.tab = 'dispensa'; state.pantryView = 'cibo'; state.pantryAddModalOpen = true; render();
  });
  await page.fill('#pantry-add-name', 'parm');
  eq(await page.locator('[data-pantry-suggest="Parmigiano"]').count(), 1, 'suggerito');
  await page.locator('[data-pantry-suggest="Parmigiano"]').dispatchEvent('pointerdown');
  eq(await page.evaluate(() => { const d = state.pantryDraft; return [d.nome, d.luogo, d.unit, d.cat, document.getElementById('pantry-add-name').value]; }), ['Parmigiano', 'frigo', 'g', 'latticini', 'Parmigiano'], 'bozza compilata');
  await page.click('[data-sheet-luogo="freezer"]');
  await page.fill('#pantry-edit-qty', '100');
  await page.locator('#pantry-edit-qty').dispatchEvent('change');
  await page.click('#pantry-add-btn');
  eq(await page.evaluate(() => { const it = state.pantryItems['parmigiano']; return [it.qty, it.luogo, it.unit, it.cat]; }), [300, 'freezer', 'g', 'latticini']);
  eq(page.errors, [], 'errori JS');
});

test('rigenera settimana: i pasti già passati restano com\'erano (ricetta, porzioni, cucinato)', async ({ page }) => {
  const r = await page.evaluate(() => {
    // Oggi = martedì (pos 3), dopo le 15: passati sab, dom, lun e il pranzo di martedì.
    findTodayPos = () => 3; isTodayLunchPast = () => true;
    const before = {};
    [[5,'cena'],[6,'pranzo'],[0,'cena'],[1,'pranzo']].forEach(([i, m]) => { before[i+'_'+m] = JSON.stringify(effectiveMeal(0, i, m)); });
    state.dayPortions['0_0_cena'] = 5;
    state.mealsDone = { 0: { cena: true } };
    generateWeek(0);
    const after = {};
    Object.keys(before).forEach(k => { const [i, m] = k.split('_'); after[k] = JSON.stringify(effectiveMeal(0, +i, m)); });
    return { same: Object.keys(before).every(k => before[k] === after[k]), portions: state.dayPortions['0_0_cena'], done: !!(state.mealsDone[0] && state.mealsDone[0].cena), past: [isMealPast(0,1,'pranzo'), isMealPast(0,1,'cena'), isMealPast(1,5,'cena')] };
  });
  eq(r, { same: true, portions: 5, done: true, past: [true, false, false] });
  eq(page.errors, [], 'errori JS');
});

test('con quello che ho: genera e cambia un pasto con le ricette per cui hai gli ingredienti', async ({ page }) => {
  const r = await page.evaluate(() => {
    // In Dispensa tutto quello che serve per una ricetta qualsiasi con ingredienti.
    state.weekTempoBase = 'progetto'; state.weekTempoExceptions = {};
    const target = allRecipeMetas().filter(isMainDish).find(x => getIngredientsFor(x.nome).length >= 3);
    state.pantryItems = {};
    getIngredientsFor(target.nome).forEach(it => upsertPantryItem(it.ingrediente, 'dispensa', 100));
    const m = recipePantryMatch(target.nome, {});
    const pool = pantryOnlyPool(allRecipeMetas().filter(isMainDish), 1, {});
    state.genPantryOnly = true;
    const used = generateWeek(0);
    const names = [];
    for(let i = 0; i < 7; i++) ['pranzo', 'cena'].forEach(m => names.push(effectiveMeal(0, i, m).principale));
    return { missing: m.missing.length, inPool: pool.some(x => x.nome === target.nome), poolAllComplete: pool.every(x => !recipePantryMatch(x.nome, {}).missing.length), picked: (() => { const p10 = new Set(pantryOnlyPool(allRecipeMetas().filter(isMainDish), weekPlanSlots().length, {}).map(x => x.nome)); return names.filter((n, k) => n && !state.dayLinks['0_' + Math.floor(k / 2) + '_' + (k % 2 ? 'cena' : 'pranzo')]).every(n => p10.has(n)); })(), short: typeof used.pantryShort };
  });
  eq(r, { missing: 0, inPool: true, poolAllComplete: true, picked: true, short: 'number' });
  await page.evaluate(() => {
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    state.genSettingsOpen = null; state.tab = 'menu'; state.swapOpenDay = '0_4_cena'; render();
  });
  await page.click('[data-swap-cat="pantry"]');
  eq(await page.locator('.swap-result-missing').first().textContent(), 'hai tutto', 'prima chi ha tutto');
  eq(page.errors, [], 'errori JS');
});

test('carte: con una carta aperta lo schermo resta acceso (wake lock), chiusa si rilascia', async ({ page }) => {
  const r = await page.evaluate(async () => {
    const log = [];
    Object.defineProperty(navigator, 'wakeLock', { configurable: true, value: { request: async () => { log.push('req'); const l = new EventTarget(); l.release = async () => { log.push('rel'); }; return l; } } });
    state.cards = [{ id: 'c1', name: 'Prova', number: '123456' }];
    state.cardViewId = 'c1'; render();
    await new Promise(res => setTimeout(res, 50));
    state.cardViewId = null; render();
    await new Promise(res => setTimeout(res, 50));
    return log;
  });
  eq(r, ['req', 'rel']);
  eq(page.errors, [], 'errori JS');
});

test('pasto vuoto: niente blocco né collegamento avanzi; Annulla li rimette', async ({ page }) => {
  const r = await page.evaluate(async () => {
    isMealPast = () => false; // nessun pasto passato: si rigenera tutta la settimana
    generateWeek(0);
    // Lunedì cena (0) fa da avanzo per martedì pranzo (1); la blocco e la svuoto.
    state.mealLocked['0_0_cena'] = true;
    const before = [state.dayLinks['0_1_pranzo'], !!state.mealLocked['0_0_cena']];
    performClearMeal('0_0_cena');
    const after = [state.dayLinks['0_1_pranzo'] || null, !!state.mealLocked['0_0_cena']];
    document.querySelector('.undo-toast button').click();
    const undone = [state.dayLinks['0_1_pranzo'], !!state.mealLocked['0_0_cena']];
    return { before, after, undone };
  });
  eq(r, { before: ['0_0_cena', true], after: [null, false], undone: ['0_0_cena', true] });
  eq(page.errors, [], 'errori JS');
});

test('menù ⋯ del dettaglio pasto: si richiude toccando fuori e con Indietro; i puntini hanno la dimensione di quelli della topbar', async ({ page }) => {
  await page.evaluate(() => {
    isMealPast = () => false; generateWeek(0);
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    const k = ['0_5_cena', '0_6_cena', '0_0_cena', '0_1_cena'].find(k => { const m = parseMealKey(k); return effectiveMeal(m.weekIdx, m.i, m.meal).principale; });
    state.tab = 'menu'; state.expandedDay = k; render();
  });
  const dots = await page.evaluate(() => { const r = document.querySelector('[data-page^="meal-"] .meal-menu-btn svg').getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; });
  eq(dots, [24, 24], 'puntini 24px come in topbar');
  await page.click('[data-meal-menu]');
  eq(await page.evaluate(() => !!state.mealDetailMenuOpen && !!document.querySelector('.meal-menu')), true, 'menù aperto');
  // lo sfondo del menù deve poter ricevere i tocchi (non inerte)
  eq(await page.evaluate(() => { const e = document.elementFromPoint(100, 400); return e && e.className; }), 'meal-menu-backdrop', 'sfondo toccabile');
  await page.mouse.click(100, 400);
  eq(await page.evaluate(() => !!state.mealDetailMenuOpen), false, 'chiuso toccando fuori');
  await page.click('[data-meal-menu]');
  await page.goBack();
  eq(await page.evaluate(() => [!!state.mealDetailMenuOpen, !!state.expandedDay]), [false, true], 'Indietro chiude prima il menù');
  // a destra l'icona sta alla stessa distanza dal bordo della freccia a sinistra
  const gap = await page.evaluate(() => { const c = el => { const r = el.getBoundingClientRect(); return r.left + r.width / 2; }; const back = document.querySelector('[data-page^="meal-"] .settings-back svg'); const dots = document.querySelector('[data-page^="meal-"] .meal-menu-btn svg'); return [Math.round(c(back)), Math.round(innerWidth - c(dots))]; });
  eq(gap[0], gap[1], 'distanza dai bordi uguale');
  eq(page.errors, [], 'errori JS');
});

test('modalità cucina: un passo per schermata, avanti e indietro, Fatto in fondo; Indietro del telefono chiude', async ({ page }) => {
  const r = await page.evaluate(() => {
    isMealPast = () => false; generateWeek(0);
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    const k = ['0_5_cena', '0_6_cena', '0_0_cena', '0_1_cena'].find(k => { const m = parseMealKey(k); const n = effectiveMeal(m.weekIdx, m.i, m.meal).principale; return n && getRecipeDetails(n) && (getRecipeDetails(n).procedimento || []).length > 2; });
    state.tab = 'menu'; state.expandedDay = k; render();
    const name = effectiveMeal(0, +parseMealKey(k).i, parseMealKey(k).meal).principale;
    return { name, steps: getRecipeDetails(name).procedimento, startBtn: !!document.querySelector('[data-page^="meal-"] [data-cook-start]') };
  });
  assert(r.startBtn, 'bottone Cucina sotto il procedimento');
  await page.click('[data-cook-start]');
  const text = () => page.locator('.cook-step-text').textContent();
  const count = () => page.locator('.cook-step-count').textContent();
  eq([await text(), await count()], [r.steps[0], `Passaggio 1/${r.steps.length}`], 'primo passo');
  eq(await page.locator('[data-cook-prev]').isDisabled(), true, 'indietro spento al primo');
  await page.click('[data-cook-next]');
  eq([await text(), await count()], [r.steps[1], `Passaggio 2/${r.steps.length}`], 'secondo passo');
  await page.click('[data-cook-prev]');
  eq(await text(), r.steps[0], 'si torna indietro');
  for(let i = 1; i < r.steps.length; i++) await page.click('[data-cook-next]');
  eq(await text(), r.steps[r.steps.length - 1], 'ultimo passo');
  eq(await page.locator('.cook-nav-next').textContent(), 'Fatto!', 'Fatto! avanza e all\'ultimo chiude');
  await page.click('.cook-nav-next');
  eq(await page.evaluate(() => [state.cookMode, !!state.expandedDay]), [null, true], 'Fatto chiude e resta il pasto');
  await page.click('[data-cook-start]');
  await page.goBack();
  eq(await page.evaluate(() => [state.cookMode, !!state.expandedDay]), [null, true], 'Indietro chiude la modalità cucina');
  eq(page.errors, [], 'errori JS');
});

test('Ricettario: dettaglio ricetta come pagina (tab, persone, Aggiungi in alto, gradimento in fondo, menù ⋯, Cucina)', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    state.tab = 'prep'; state.expandedRecipe = 'Carbonara'; render();
    const pg = () => document.querySelector('[data-page^="recipe-"]');
    const out = { page: !!pg(), modal: !!document.querySelector('.meal-detail-screen'), title: pg().querySelector('.settings-title').textContent.trim() };
    out.tabs = [...pg().querySelectorAll('.pane-tab')].map(e => e.textContent.trim());
    const kids = [...pg().querySelector('.meal-detail-body').children].map(e => e.className.split(' ')[0] || e.tagName);
    out.addBeforeList = kids.indexOf('button-wrapper') >= 0 && kids.indexOf('button-wrapper') < kids.indexOf('detail-section');
    out.gradLast = kids.filter(k => k !== 'cook-fab').pop() === 'grad-picker';
    out.fab = !!pg().querySelector('.cook-fab');
    const qty0 = pg().querySelector('.ing-list li:last-child, .ing-list li').textContent;
    const n0 = parseInt(pg().querySelector('.persone-row .qty-num').textContent, 10);
    pg().querySelector('[data-recipe-portions-inc]').click();
    out.persone = [n0, parseInt(pg().querySelector('.persone-row .qty-num').textContent, 10)];
    out.qtyChanged = pg().querySelector('.ing-list li').textContent !== qty0;
    pg().querySelector('[data-recipe-menu]').click();
    out.menu = [...pg().querySelectorAll('.meal-menu .topbar-menu-item')].map(e => e.textContent.replace(/\s+/g, ' ').trim());
    return out;
  });
  eq([r.page, r.modal, r.title], [true, false, 'Carbonara'], 'pagina, non modale');
  eq(r.tabs, ['Ingredienti', 'Passaggi']);
  assert(r.addBeforeList, '"Aggiungi N ingredienti" sopra l\'elenco');
  assert(r.gradLast, 'gradimento a fondo pagina');
  assert(r.fab, 'Cucina fisso');
  eq(r.persone[1], r.persone[0] + 1, 'persone +1');
  eq(r.qtyChanged, true, 'quantità scalate');
  eq(r.menu.length, 2, 'menù: modifica, album');
  assert(/Modifica ricetta/.test(r.menu[0]) && /album/i.test(r.menu[1]), r.menu.join(' | '));
  await page.goBack();
  eq(await page.evaluate(() => [!!state.recipeMenuOpen, state.expandedRecipe]), [false, 'Carbonara'], 'Indietro chiude prima il menù');
  await page.goBack();
  eq(await page.evaluate(() => state.expandedRecipe), null, 'poi la pagina');
  eq(page.errors, [], 'errori JS');
});

test('menù: card dei pasti senza bordo e con ombra leggera; le card vuote senza bordo né ombra', async ({ page }) => {
  const r = await page.evaluate(() => {
    isMealPast = () => false; generateWeek(0);
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    clearMealToEmpty(0, 1, 'cena'); state.tab = 'menu'; render();
    const cs = el => getComputedStyle(el);
    const full = document.querySelector('.meal-block-swipe-wrap .meal-block:not(.is-empty)');
    const empty = document.querySelector('.meal-block.is-empty');
    return { fullBorder: cs(full).borderTopWidth, fullShadow: cs(full.parentElement).boxShadow !== 'none', emptyBorder: cs(empty).borderTopWidth, emptyShadow: cs(empty).boxShadow };
  });
  eq(r, { fullBorder: '0px', fullShadow: true, emptyBorder: '0px', emptyShadow: 'none' });
});

test('dispensa: la quantità è rossa solo se la scorta è poca per quell\'unità (0,7 l no, 0,1 l sì, mezzo pezzo sì)', async ({ page }) => {
  const r = await page.evaluate(() => [
    pantryQtyIsLow({ qty: 0.7, unit: 'l' }), pantryQtyIsLow({ qty: 0.1, unit: 'l' }), pantryQtyIsLow({ qty: 0.5, unit: 'kg' }),
    pantryQtyIsLow({ qty: 0.5, unit: '' }), pantryQtyIsLow({ qty: 1, unit: '' }), pantryQtyIsLow({ qty: 300, unit: 'g' }), pantryQtyIsLow({ qty: 0, unit: 'none' })
  ]);
  eq(r, [false, true, false, true, false, false, false]);
  await page.evaluate(() => {
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    upsertPantryItem('Passata di pomodoro', 'dispensa', 0.7, 'l'); state.tab = 'dispensa'; state.pantryView = 'cibo'; render();
  });
  eq(await page.locator('[data-qty-show="passata di pomodoro"]').evaluate(el => el.classList.contains('low')), false, 'passata 0,7 l non rossa');
});

test('dispensa: tooltip con ombra leggera e non tagliata dal contenitore dello swipe', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    upsertPantryItem('Burro', 'frigo', 2, 'pz'); state.tab = 'dispensa'; state.pantryView = 'cibo';
    state.pantryLuogoPicker = 'burro'; render();
    const pk = document.querySelector('.luogo-picker');
    const wrap = pk.closest('.swipe-wrap');
    const probe = document.createElement('div'); probe.style.boxShadow = 'var(--shadow-card)'; document.body.appendChild(probe);
    const card = getComputedStyle(probe).boxShadow; probe.remove();
    return { overflow: getComputedStyle(wrap).overflow, same: getComputedStyle(pk).boxShadow === card };
  });
  eq(r, { overflow: 'visible', same: true });
});

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
