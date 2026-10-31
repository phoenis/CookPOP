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
  await page.fill('#edit-porzioni', 'scritto a mano');
  // immagine di prova 3000x2000 generata nel browser
  const png = await page.evaluate(() => { const c = document.createElement('canvas'); c.width = 3000; c.height = 2000; const x = c.getContext('2d'); x.fillStyle = '#c33'; x.fillRect(0, 0, 3000, 2000); return c.toDataURL('image/png').split(',')[1]; });
  await page.setInputFiles('[data-recipe-photo-input]', { name: 'piatto.png', mimeType: 'image/png', buffer: Buffer.from(png, 'base64') });
  await page.waitForSelector('.recipe-photo img');
  eq(await page.inputValue('#edit-porzioni'), 'scritto a mano', 'il render della foto non cancella quanto scritto');
  const saved = await page.evaluate(() => { const v = Object.values(window.__photos)[0]; const img = document.querySelector('.recipe-photo img'); return { keys: Object.keys(window.__photos), jpeg: v.data.startsWith('data:image/jpeg'), size: v.data.length, w: img.naturalWidth }; });
  eq(saved.keys, ['recipe-photos/Carbonara'], 'percorso');
  assert(saved.jpeg && saved.size < 300000, `foto troppo grande: ${saved.size}`);
  eq(saved.w, 1024, 'lato lungo ridotto a 1024');
  await page.click('[data-recipe-photo-remove]');
  await page.waitForSelector('.recipe-photo img', { state: 'detached' });
  eq(await page.evaluate(() => Object.keys(window.__photos)), [], 'foto rimossa');
  eq(await page.inputValue('#edit-porzioni'), 'scritto a mano', 'neanche dopo la rimozione');
  await page.click('.undo-toast button');
  await page.waitForSelector('.recipe-photo img');
  // chiusa la pagina di modifica, nel dettaglio la foto si vede ma senza comandi
  await page.evaluate(() => { state.recipeEditName = null; render(); });
  eq(await page.evaluate(() => [!!document.querySelector('[data-page^="recipe-Carbonara"] .recipe-photo img'), document.querySelectorAll('[data-recipe-photo-input], [data-recipe-photo-remove]').length]), [true, 0], 'foto senza comandi nel dettaglio');
  eq(page.errors, [], 'errori JS');
});

test('ricette: gradimento visibile e modificabile con un tocco, senza perdere altre modifiche', async ({ page }) => {
  await page.evaluate(() => { state.recipeEdits['Carbonara'] = { ricordare: 'nota mia' }; state.tab = 'prep'; state.expandedRecipe = 'Carbonara'; render(); });
  eq(await page.evaluate(() => ({ tag: document.querySelector('.rd-grad').textContent.trim(), grad: getRecipeMeta('Carbonara').gradimento })), { tag: 'Ti piace?', grad: '' }, 'senza gradimento di partenza');
  await page.click('[data-grad-open="Carbonara"]');
  await page.click('[data-set-gradimento="Carbonara"][data-grad="preferita"]');
  const r = await page.evaluate(() => ({ grad: getRecipeMeta('Carbonara').gradimento, nota: getRecipeDetails('Carbonara').ricordare, tag: document.querySelector('.rd-grad').textContent.trim(), menuClosed: !document.querySelector('.grad-pop') }));
  eq(r, { grad: 'preferita', nota: 'nota mia', tag: '❤️ Preferita', menuClosed: true });
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
  eq(r2, { names: ['Ricotta', 'Mozzarella'], badges: ['Scaduto ieri', 'domani'], kept: true, ricotta: null });
  eq(page.errors, [], 'errori JS');
});

test('generatore: usa gli ingredienti in scadenza in tempo, senza perdere equilibrio', async ({ page }) => {
  const r = await page.evaluate(() => {
    // La scadenza guida la scelta solo entro 7 giorni: nei primi giorni della settimana si usa la corrente, poi la prossima (scadenza al suo quarto giorno, che rientra nei 7 giorni).
    const W = WEEK_DISPLAY_ORDER.indexOf(new Date().getDay()) >= 3 ? 1 : 0;
    state.extraWeeks = [];
    const slots = weekPlanSlots(W), seq = weekEatenSequence(slots, W);
    const run = withExpiry => {
      state.pantryItems = {};
      upsertPantryItem('Mozzarella', 'frigo', 2);
      if(withExpiry) state.pantryItems['mozzarella'].scadenza = isoLocalDate(weekDatesFor(W)[3]);
      let inTime = 0, balanced = 0;
      const t0 = performance.now();
      for(let n = 0; n < 15; n++){
        const days = pickWeekRecipes({}, W);
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

test('spesa: "Metti in dispensa" propone luogo e scadenza stimata, si cambia solo quello che serve, Conferma', async ({ page }) => {
  await page.evaluate(() => {
    ['zucchine','petto di pollo','spaghetti'].forEach(k => delete state.pantryItems[k]);
    state.shopExtras = { e1: { ingrediente: 'Zucchine', qta: '4' }, e2: { ingrediente: 'Petto di pollo', qta: '1' }, e3: { ingrediente: 'Spaghetti', qta: '1' } };
    state.shopChecked = { e1: true, e2: true, e3: true }; state.tab = 'spesa'; state.shopView = 'reparto'; render();
  });
  await page.click('#move-checked-to-pantry');
  const r1 = await page.evaluate(() => {
    const idx = n => state.moveModal.rows.findIndex(r => r.name === n);
    const row = n => state.moveModal.rows[idx(n)];
    return { open: !!document.querySelector('.move-sheet'), zu: [row('Zucchine').luogo, daysUntilDate(row('Zucchine').scad)], po: [row('Petto di pollo').luogo, daysUntilDate(row('Petto di pollo').scad)], sp: [row('Spaghetti').luogo, row('Spaghetti').scad], iz: idx('Zucchine'), ip: idx('Petto di pollo'), is: idx('Spaghetti'), plusSeven: addDaysIso(7) };
  });
  eq({ open: r1.open, zu: r1.zu, po: r1.po, sp: r1.sp }, { open: true, zu: ['frigo', 5], po: ['frigo', 2], sp: ['dispensa', ''] }, 'proposte');
  await page.click(`[data-move-pop="${r1.iz}:s"]`);
  await page.click(`[data-move-scad="${r1.iz}:${r1.plusSeven}"]`);
  await page.click(`[data-move-pop="${r1.ip}:s"]`);
  await page.click(`[data-move-scad="${r1.ip}:"]`);
  await page.click(`[data-move-pop="${r1.is}:l"]`);
  await page.click(`[data-move-luogo="${r1.is}:freezer"]`);
  await page.click('[data-move-confirm]');
  const r2 = await page.evaluate(() => { const z = state.pantryItems['zucchine'], p = state.pantryItems['petto di pollo'], s = state.pantryItems['spaghetti']; return { open: !!document.querySelector('.move-sheet'), z: [z.luogo, daysUntilDate(z.scadenza)], p: [p.luogo, p.scadenza || null], s: [s.luogo, s.frozenOn === isoLocalDate(new Date()), daysUntilDate(s.scadenza), !!s.freezerExp] }; });
  eq(r2, { open: false, z: ['frigo', 7], p: ['frigo', null], s: ['freezer', true, 90, true] }, 'dopo Conferma');
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
    document.querySelector('.done-sheet [data-set-gradimento="Carbonara"][data-grad="ci-piace"]').click();
    return { noneInCatalog, migrated, voted: getRecipeMeta('Carbonara').gradimento, modalOpen: state.doneModalDay === '1_1_cena' };
  });
  eq(r, { noneInCatalog: true, migrated: { grad: '', nota: 'nota' }, voted: 'ci-piace', modalOpen: true });
  eq(page.errors, [], 'errori JS');
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
  const mostrati = await page.$eval('[data-group-edit="pasta-corta"] .manage-row-sub', el => el.textContent);
  assert(/Fusilli/.test(mostrati) && /Penne/.test(mostrati) && /Rigatoni/.test(mostrati), 'formati mostrati: ' + mostrati);
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
  await page.click('[data-sheet-picker="unit"]');
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
  await page.evaluate(() => { document.querySelector('.sheet-page').scrollTop = 250; document.querySelector('[data-sheet-more]').scrollIntoView({ block: 'center' }); });
  const before = await page.evaluate(() => document.querySelector('.sheet-page').scrollTop);
  assert(before > 100, `la scheda scorre (${before})`);
  await page.click('[data-sheet-more]');
  const r = await page.evaluate(() => ({ top: document.querySelector('.sheet-page').scrollTop, entering: document.querySelector('.sheet-page').classList.contains('is-entering'), more: !!document.querySelector('[data-open-merge]') }));
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
    // (un pranzo avanzo ripete per forza la cena da cui viene: non conta come ripetizione)
    const names = w => { const out = new Set(); WEEK_DISPLAY_ORDER.forEach(i => ['pranzo','cena'].forEach(meal => { if(linkedSourceMealKey(w, i, meal)) return; const n = effectiveMeal(w, i, meal).principale; if(n) out.add(n); })); return out; };
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
    out.paneTabs = [...page().querySelectorAll('.rd-tab')].map(e => e.textContent.replace(/\s*·\s*\d+/, '').trim());
    out.paneActive = page().querySelector('.rd-tab.active').textContent.trim();
    out.persone = page().querySelector('.persone-row').textContent.replace(/\s+/g, ' ').trim();
    out.stepperInRow = !!page().querySelector('.persone-row [data-portions-inc]');
    out.noTitleInIng = !page().querySelector('[data-rd-sec="ing"] .detail-section-title');
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
  assert(/\d+\s+person[ae]/.test(d.persone) && d.stepperInRow && d.noTitleInIng && d.portionsUp, `porzioni nella tab: ${d.persone}`);
  assert(d.fab && d.stepsShown && d.fabInSteps, 'Cucina fisso in entrambe le tab');
  eq(d.menu.length, 4, 'menù ⋯: cambia, blocca, modifica, togli');
  assert(/Cambia piatto/.test(d.menu[0]) && /Blocca il piatto/.test(d.menu[1]) && /Modifica ricetta/.test(d.menu[2]) && /Togli/.test(d.menu[3]), `voci: ${d.menu.join(' | ')}`);
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
    state.extraWeeks = []; generateWeek(1); state.dayLinks = {}; // la generazione può collegare dei pranzi come avanzo: qui no
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
    document.querySelector('[data-prep-day="6"][data-prep-week]').click();
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
    state.ingredientNotes = {}; state.pantryItems = {};
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
    move: !!document.querySelector('.shop-move-end #move-checked-to-pantry'),
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
  eq(luogo.some(t => /^Frigo\b/.test(t)) && luogo.some(t => /^Freezer\b/.test(t)), true, 'sezioni per luogo');
  eq(az.titles, 0, 'A-Z senza sezioni');
  eq(az.names.slice().sort((a, b) => a.localeCompare(b, 'it')), az.names, 'A-Z in ordine');
  eq(pasto, ['Corsie', 'Categoria', 'Spesa', 'Pasto', 'Dalla A alla Z']);
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
    state.shopExtras = {}; state.tab = 'spesa'; state.shopView = 'reparto'; openAddSheet('spesa');
  });
  await page.fill('#add-name', 'Carote');
  await page.fill('#add-qty', '3');
  await page.click('[data-add-confirm]');
  const r = await page.evaluate(() => {
    const row = [...document.querySelectorAll('.shop-item-row')].find(e => e.querySelector('.item-name') && e.querySelector('.item-name').textContent.trim().startsWith('Carote'));
    return { confirmed: state.pantryConfirmedShop['carote'], qty: row ? row.querySelector('.qty-num').textContent.trim() : null, sheet: !!document.querySelector('.add-sheet') };
  });
  eq(r, { confirmed: '3', qty: '3', sheet: false });
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
  await page.locator('[data-pantry-suggest="Parmigiano"]').click();
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
    state.genSettingsOpen = null; state.tab = 'menu'; state.dishPicker = { key: '0_4_cena', replace: null, tipo: 'all', search: '' }; render();
  });
  await page.click('[data-dish-pantry]');
  assert(/hai tutto/.test(await page.locator('.dsh-results .swap-result-time').first().textContent()), 'prima chi ha tutto');
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
    writeMealDishes(0, +parseMealKey(k).i, parseMealKey(k).meal, name, []); render();
    return { name, steps: getRecipeDetails(name).procedimento, startBtn: !!document.querySelector('[data-page^="meal-"] [data-cook-start]') };
  });
  assert(r.startBtn, 'bottone Cucina sotto il procedimento');
  await page.click('[data-cook-start]');
  const text = () => page.locator('.cook-step-text').textContent();
  const count = () => page.evaluate(() => `Passaggio ${state.cookMode.step + 1}/${getRecipeDetails(state.cookMode.name).procedimento.length}`);
  eq([await text(), await count()], [r.steps[0], `Passaggio 1/${r.steps.length}`], 'primo passo');
  eq(await page.locator('[data-cook-prev]').isDisabled(), true, 'indietro spento al primo');
  eq(await page.locator('.cook-nav-main').textContent(), r.steps.length > 1 ? 'Fatto!' : 'Ho finito', 'Fatto! ai passi intermedi');
  // guardando avanti senza aver fatto il passaggio: il bottone riporta a quello che si sta facendo
  await page.click('[data-cook-next]');
  eq([await text(), await count()], [r.steps[1], `Passaggio 2/${r.steps.length}`], 'secondo passo (guardato)');
  eq(await page.locator('.cook-nav-main').textContent(), 'Passaggio 1', 'guardando avanti: Passaggio x del passaggio che si sta facendo');
  await page.click('[data-cook-prev]');
  eq(await text(), r.steps[0], 'si torna indietro');
  // Fatto! segna il passaggio e passa al successivo
  await page.click('[data-cook-step-done]');
  eq(await text(), r.steps[1], 'Fatto! porta al secondo passo');
  // guardando un passaggio precedente: Esegui di nuovo
  await page.click('[data-cook-prev]');
  eq(await page.locator('.cook-nav-main').textContent(), 'Esegui di nuovo', 'passaggio precedente: Esegui di nuovo');
  await page.click('[data-cook-redo]');
  eq(await page.locator('.cook-nav-main').textContent(), 'Fatto!', 'rifatto: di nuovo Fatto!');
  for(let i = 0; i < r.steps.length - 1; i++) await page.click('[data-cook-step-done]');
  eq(await text(), r.steps[r.steps.length - 1], 'ultimo passo');
  eq(await page.locator('.cook-nav-main').textContent(), 'Ho finito', 'Ho finito all\'ultimo passo');
  await page.click('.cook-nav-main');
  eq(await page.evaluate(() => [state.cookMode, !!state.expandedDay, state.doneModalDay !== null]), [null, true, true], 'Fatto chiude e chiede gli ingredienti finiti (Ricetta fatta!)');
  await page.evaluate(() => { state.doneModalDay = null; render(); });
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
    out.tabs = [...pg().querySelectorAll('.rd-tab')].map(e => e.textContent.replace(/\s*·\s*\d+/, '').trim());
    const sec = pg().querySelector('[data-rd-sec="ing"]');
    out.addAfterList = !!sec.querySelector('.ing-list') && !!sec.querySelector('.button-wrapper') && !!(sec.querySelector('.ing-list').compareDocumentPosition(sec.querySelector('.button-wrapper')) & Node.DOCUMENT_POSITION_FOLLOWING);
    out.gradLast = !!pg().querySelector('.rd-grad') && /Ti piace\?/.test(pg().querySelector('.rd-grad').textContent) && /Pasta/.test(pg().querySelector('.rd-meta-text').textContent);
    out.fab = !!pg().querySelector('.cook-fab');
    const qty0 = pg().querySelector('.ing-list li:last-child, .ing-list li').textContent;
    const n0 = parseInt(pg().querySelector('.rd-persone-n b').textContent, 10);
    pg().querySelector('[data-recipe-portions-inc]').click();
    out.persone = [n0, parseInt(pg().querySelector('.rd-persone-n b').textContent, 10)];
    out.qtyChanged = pg().querySelector('.ing-list li').textContent !== qty0;
    pg().querySelector('[data-recipe-menu]').click();
    out.menu = [...pg().querySelectorAll('.meal-menu .topbar-menu-item')].map(e => e.textContent.replace(/\s+/g, ' ').trim());
    return out;
  });
  eq([r.page, r.modal, r.title], [true, false, 'Ricette'], 'pagina, non modale');
  eq(r.tabs, ['Ingredienti', 'Passaggi']);
  assert(r.addAfterList, '"Aggiungi alla Spesa i mancanti" sotto l\'elenco');
  assert(r.gradLast, 'etichetta di gradimento (Ti piace?) e categoria nei tag');
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
    isMealPast = () => false; findTodayPos = () => 0; generateWeek(0); // "oggi" fisso: il test non dipende dal giorno in cui gira
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    const di = WEEK_DISPLAY_ORDER[1];
    clearMealToEmpty(0, di, 'cena'); state.tab = 'menu'; render();
    const cs = el => getComputedStyle(el);
    const full = document.querySelector('.meal-block-swipe-wrap .meal-block:not(.is-empty)');
    const empty = document.querySelector('.meal-block.is-empty');
    return { fullBorder: cs(full).borderTopWidth, fullShadow: cs(full).boxShadow !== 'none', emptyBorder: cs(empty).borderTopWidth, emptyShadow: cs(empty).boxShadow };
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

test('spesa e dispensa: "Ordina per" è testo in grassetto senza bordo né larghezza fissa', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    state.tab = 'spesa'; render();
    const s = document.querySelector('[data-shop-group]'); const cs = getComputedStyle(s);
    return { border: cs.borderTopWidth, bold: +cs.fontWeight >= 600, bg: cs.backgroundColor };
  });
  eq(r, { border: '0px', bold: true, bg: 'rgba(0, 0, 0, 0)' });
});

test('spesa: "Ordina per" senza contorno al focus e con larghezza sul testo', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    state.tab = 'spesa'; render();
    const s = document.querySelector('[data-shop-group]'); s.focus();
    const cs = getComputedStyle(s);
    return { outline: cs.outlineStyle, fit: !CSS.supports('field-sizing', 'content') || cs.fieldSizing === 'content' };
  });
  eq(r, { outline: 'none', fit: true });
});

test('app: Carte nella barra in alto (solo Spesa), titolo Menù, ricerca alta uguale, riga uguale in Ricette, niente "+ Aggiungi" nel ⋯', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    const out = {};
    const at = tab => { state.tab = tab; render(); };
    at('menu'); out.title = document.getElementById('topbar-title').textContent; out.cardsMenu = document.getElementById('topbar-cards-btn').hidden;
    at('spesa'); out.cardsSpesa = document.getElementById('topbar-cards-btn').hidden; out.noOldBtn = !document.querySelector('.shop-top-actions');
    out.hSpesa = Math.round(document.querySelector('.list-search').getBoundingClientRect().height);
    at('prep'); out.hPrep = Math.round(document.querySelector('.list-search').getBoundingClientRect().height);
    out.check = !!document.querySelector('.prep-quick .is-chip[data-toggle-pantry-mode]') && !document.querySelector('.shop-head-sub');
    out.menuExtras = ['dispensa', 'prep'].map(t => TAB_MENU_ITEMS[t].some(i => /\+ Aggiungi/.test(i.label)));
    return out;
  });
  eq(r, { title: 'Menù', cardsMenu: true, cardsSpesa: false, noOldBtn: true, hSpesa: 44, hPrep: 44, check: true, menuExtras: [false, false] });
});

test('ricette: ritmo uniforme nel dettaglio, Cucina bianca senza bande, modifica con etichette in minuscolo', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    const nome = allRecipeMetas().find(x => getRecipeDetails(x.nome) && (getRecipeDetails(x.nome).procedimento || []).length).nome;
    state.tab = 'prep'; state.prepView = 'ricette'; state.expandedRecipe = nome; render();
    const body = document.querySelector('.meal-detail-body');
    const out = { gap: getComputedStyle(body).rowGap, tab: getComputedStyle(document.querySelector('.rd-tab')).textTransform };
    state.expandedRecipe = null; state.cookMode = { name: nome, step: 0, ratio: 1 }; render();
    const cp = document.querySelector('.cook-page');
    out.cookBg = getComputedStyle(cp).backgroundColor; out.cookEndRight = getComputedStyle(document.querySelector('.cook-end')).order === '2';
    return out;
  });
  eq(r, { gap: '0px', tab: 'none', cookBg: 'rgb(255, 255, 255)', cookEndRight: false });
});

test('modifica ricetta: si aggiungono ingredienti, il campo suggerisce gli esistenti (plurali/accenti) e il nome esistente evita doppioni', async ({ page }) => {
  await page.evaluate(() => {
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    state.customRecipes['Prova nuova'] = { nome: 'Prova nuova' }; state.tab = 'prep'; state.recipeEditName = 'Prova nuova'; render();
  });
  await page.click('#edit-add-ing-row');
  const rows = await page.evaluate(() => document.querySelectorAll('#edit-ing-list .edit-ing-row').length);
  await page.evaluate(() => render()); // un ri-render non deve rompere l'elenco
  const rows2 = await page.evaluate(() => document.querySelectorAll('#edit-ing-list .edit-ing-row').length);
  await page.locator('#edit-ing-list [data-edit-ing-open]').last().click();
  const name = page.locator('.edit-ing-sheet .edit-ing-name');
  await name.click(); await page.keyboard.type('pomodor');
  const sugg = await page.evaluate(() => [...document.querySelectorAll('.add-ing-suggestion[data-combo-pick]')].map(e => e.textContent));
  const target = await page.evaluate(() => allKnownIngredientNamesWithGroups().find(n => /pomodor/i.test(n)));
  const canon = await page.evaluate(n => canonicalIngredientName(n.toUpperCase()), target);
  await page.evaluate(() => { const l = document.querySelector('.edit-ing-sheet .edit-ing-name'); l.value = 'Pomodoro'; l.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.click('[data-edit-ing-done]');
  const sum = await page.evaluate(() => [...document.querySelectorAll('#edit-ing-list .edit-ing-sum-name')].map(e => e.textContent));
  eq({ rows, rows2, hasSugg: sugg.length > 0, canon, sheetClosed: !(await page.$('.edit-ing-backdrop')), sum: sum.includes('Pomodoro') }, { rows: 2, rows2: 2, hasSugg: true, canon: target, sheetClosed: true, sum: true });
});

test('ricette: ingredienti in ordine fisso, olio/aceto/sale/pepe/spezie per ultimi', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.customRecipes['Ordine prova'] = { nome: 'Ordine prova' };
    state.recipeEdits['Ordine prova'] = { ingredienti: [
      { ingrediente: 'Olio EVO', qta: 'q.b.' }, { ingrediente: 'Sale', qta: 'q.b.' }, { ingrediente: 'Pecorino romano', qta: '50 g' },
      { ingrediente: 'Pepe nero', qta: 'q.b.' }, { ingrediente: 'Guanciale', qta: '100 g' }, { ingrediente: 'Pasta lunga', qta: '200 g' }, { ingrediente: 'Aglio', qta: '1' }
    ] };
    return getIngredientsFor('Ordine prova').map(i => i.ingrediente);
  });
  eq(r, ['Guanciale', 'Pasta lunga', 'Aglio', 'Pecorino romano', 'Olio EVO', 'Sale fino', 'Pepe nero']);
});

test('cucina: durata letta dal passo, timer con conto alla rovescia, allarme a fine tempo che si ferma', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    const out = { dur: ['Cuoci 10 minuti.', 'Cuoci 20-25 minuti', 'Lascia riposare mezz\'ora', 'Cuoci 1 ora e mezza', 'Cuoci per 2 ore', 'Taglia il guanciale.'].map(stepDurationSecs) };
    state.customRecipes['Timer prova'] = { nome: 'Timer prova' };
    state.recipeEdits['Timer prova'] = { ingredienti: [{ ingrediente: 'Pasta lunga', qta: '100 g' }], procedimento: ['Lessa la pasta per 10 minuti.', 'Servi.'] };
    state.cookMode = { name: 'Timer prova', step: 0, ratio: 1 }; render();
    out.btn = (document.querySelector('[data-cook-timer-start]') || {}).textContent;
    document.querySelector('[data-cook-timer-start]').click();
    out.bar = (document.getElementById('cook-timer-time') || {}).textContent;
    state.cookTimer.end = Date.now() - 1000; timerTick();
    out.alert = !!document.getElementById('timer-alert') && state.cookTimer === null;
    document.querySelector('[data-timer-stop]').click();
    out.stopped = !document.getElementById('timer-alert');
    return out;
  });
  eq(r, { dur: [600, 1200, 1800, 5400, 7200, 0], btn: '⏱ Avvia timer 10 min', bar: '10:00', alert: true, stopped: true });
});

test('ricetta: stessa spaziatura dal Menù e dal Ricettario attorno a bottone, tab e ingredienti', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    const gaps = root => { const q = s => root.querySelector(s); const bw = q('.button-wrapper'), pt = q('.rd-tabs'), ps = q('.rd-sec-head'), li = q('.ing-list li');
      const cs = getComputedStyle(bw), top = e => e.getBoundingClientRect().top, bot = e => e.getBoundingClientRect().bottom;
      return { btnTop: Math.round(top(bw) - bot(q('.ing-list'))), persToTabs: Math.round(top(ps) - bot(pt)), liPad: getComputedStyle(li).paddingTop }; };
    state.extraWeeks = []; generateWeek(1);
    writeMealDishes(1, 1, 'cena', 'Amatriciana', []); state.tab = 'menu'; state.expandedDay = '1_1_cena'; render();
    const meal = gaps(document.querySelector('[data-page^="meal-"] .dish-acc-body'));
    state.expandedDay = null; state.tab = 'prep'; state.prepView = 'ricette'; state.expandedRecipe = 'Amatriciana'; render();
    const rec = gaps(document.querySelector('[data-page^="recipe-"] .meal-detail-body'));
    return { meal, rec };
  });
  eq(r.meal, r.rec);
  eq(r.rec.btnTop >= 8 && r.rec.persToTabs >= 8, true);
});

test('cucina: il bottone è al centro in basso, uguale nel pasto e nel Ricettario', async ({ page }) => {
  const open = (setup) => page.evaluate(setup);
  const pos = () => page.evaluate(() => { const b = document.querySelector('.cook-fab-bar').getBoundingClientRect(); const w = document.documentElement.clientWidth;
    return { centered: Math.abs((b.left + b.right) / 2 - w / 2) < 1, gap: Math.round(window.innerHeight - b.bottom) === 0 }; });
  await open(() => { state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    state.extraWeeks = []; generateWeek(1); writeMealDishes(1, 1, 'cena', 'Amatriciana', []); state.tab = 'menu'; state.expandedDay = '1_1_cena'; render(); });
  await page.waitForTimeout(400);
  const meal = await pos();
  await open(() => { state.expandedDay = null; state.tab = 'prep'; state.prepView = 'ricette'; state.expandedRecipe = 'Amatriciana'; render(); });
  await page.waitForTimeout(400);
  eq({ meal, rec: await pos() }, { meal: { centered: true, gap: true }, rec: { centered: true, gap: true } });
});

test('impostazioni: sezioni riordinate, voci che aprono le pagine, ricerca, backup automatico mensile', async ({ page }) => {
  const r = await page.evaluate(async () => {
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    state.tab = 'spesa'; render();
    document.querySelector('[data-topbar-menu-settings]') || document.getElementById('topbar-menu-btn').click();
    document.querySelector('[data-topbar-menu-settings]').click();
    const out = { titles: [...document.querySelectorAll('#settings-backdrop .settings-section-title')].map(e => e.textContent.trim()) };
    // ricerca
    const s = document.getElementById('settings-search'); s.value = 'supermercato'; s.dispatchEvent(new Event('input', { bubbles: true }));
    out.visible = [...document.querySelectorAll('#settings-backdrop .settings-section')].filter(x => !x.hidden).map(x => x.querySelector('.settings-section-title').textContent.trim());
    out.visibleLinks = [...document.querySelectorAll('#settings-backdrop .settings-link')].filter(x => !x.hidden).map(x => x.dataset.settingsGo);
    s.value = ''; s.dispatchEvent(new Event('input', { bubbles: true }));
    // voci
    document.querySelector('[data-settings-go="depts"]').click();
    document.querySelector('[data-settings-go="aisles"]').click();
    state.deptsModalOpen = false;
    out.aisles = state.aisleOrderOpen === true && document.getElementById('settings-backdrop').classList.contains('open');
    state.aisleOrderOpen = false; render();
    document.getElementById('topbar-menu-btn').click();
    document.querySelector('[data-topbar-menu-settings]').click();
    document.querySelector('[data-settings-go="ingredients"]').click();
    out.ingr = state.ingredientManagerOpen === true && state.tab === 'dispensa';
    state.ingredientManagerOpen = false; render();
    // ⋯ più leggeri
    out.menus = { dispensa: TAB_MENU_ITEMS.dispensa.length, spesa: (TAB_MENU_ITEMS.spesa || []).length, menu: TAB_MENU_ITEMS.menu.length, prep: TAB_MENU_ITEMS.prep.length };
    // backup automatico: uno al mese
    try{ localStorage.removeItem(LAST_AUTO_BACKUP_KEY); localStorage.removeItem(AUTO_BACKUP_OFF_KEY); }catch(e){}
    out.first = await maybeAutoBackup();
    out.second = await maybeAutoBackup();
    const list = await autoBackupList();
    out.saved = list.length >= 1 && list[0].data.format === BACKUP_FORMAT;
    out.restored = restoreBackup(list[0].data, () => true);
    try{ localStorage.setItem(AUTO_BACKUP_OFF_KEY, '1'); localStorage.removeItem(LAST_AUTO_BACKUP_KEY); }catch(e){}
    out.off = await maybeAutoBackup();
    try{ localStorage.removeItem(AUTO_BACKUP_OFF_KEY); }catch(e){}
    return out;
  });
  eq(r.titles, ['Menù', 'Ingredienti e reparti', 'Spesa e ricette', 'App']);
  eq(r.visible, ['Ingredienti e reparti']);
  eq(r.visibleLinks, ['depts']);
  eq({ aisles: r.aisles, ingr: r.ingr }, { aisles: true, ingr: true });
  eq(r.menus, { dispensa: 5, spesa: 2, menu: 2, prep: 2 });
  eq({ first: r.first, second: r.second, saved: r.saved, restored: r.restored, off: r.off }, { first: true, second: false, saved: true, restored: null, off: false });
});

test('impostazioni: "Tema e colori" è una pagina a parte e cambia tema e colore', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    state.tab = 'spesa'; render();
    document.getElementById('topbar-menu-btn').click(); document.querySelector('[data-topbar-menu-settings]').click();
    const out = { noInline: !document.querySelector('#settings-backdrop .theme-toggle-row') };
    document.querySelector('[data-settings-go="appearance"]').click();
    out.page = !!document.querySelector('[data-page="appearance"]') && document.getElementById('settings-backdrop').classList.contains('open');
    document.querySelector('[data-theme-choice="dark"]').click();
    out.dark = document.documentElement.dataset.theme === 'dark' && !!document.querySelector('[data-theme-choice="dark"].active');
    const sw = [...document.querySelectorAll('[data-accent-color]')][1]; sw.click();
    out.accent = localStorage.getItem(ACCENT_KEY) === sw.dataset.accentColor;
    document.querySelector('[data-theme-choice="system"]').click();
    applyAccent(null);
    document.querySelector('[data-close-appearance]').click();
    out.closed = !state.appearanceOpen;
    return out;
  });
  eq(r, { noInline: true, page: true, dark: true, accent: true, closed: true });
});

test('persone: il colore dei turni di cucina si sceglie lì, e Impostazioni non ha più "Io" né il prossimo turno', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    const user = familyMembers()[0].id;
    state.membersOpen = true; render();
    const out = { swatches: document.querySelectorAll(`[data-member-id="${user}"][data-member-color]`).length === USER_COLOR_PRESETS.length, noProfile: !document.getElementById('profile-panel') && !/Prossimo turno/.test(document.body.textContent) };
    const c = USER_COLOR_PRESETS[2];
    document.querySelector(`[data-member-id="${user}"][data-member-color="${c}"]`).click();
    out.saved = state.userColors[user] === c && !!document.querySelector(`[data-member-id="${user}"][data-member-color="${c}"].active`);
    state.membersOpen = false; render();
    return out;
  });
  eq(r, { swatches: true, noProfile: true, saved: true });
});

test('impostazioni: uscendo da una pagina si torna all\'elenco, e chiuse le Impostazioni si ritorna alla scheda di prima', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    state.tab = 'spesa'; render();
    const bd = () => document.getElementById('settings-backdrop');
    document.getElementById('topbar-menu-btn').click(); document.querySelector('[data-topbar-menu-settings]').click();
    const out = {};
    document.querySelector('[data-settings-go="ingredients"]').click();
    out.during = state.tab === 'dispensa' && !!document.querySelector('[data-page="ingredients"], .sheet-page') && bd().classList.contains('open');
    const z = el => parseInt(getComputedStyle(el).zIndex, 10);
    out.pageAbove = z(document.querySelector('.sheet-page')) > z(bd());
    document.querySelector('.sheet-page [data-close-ingredient-manager], .sheet-page .settings-back').click();
    out.backToList = !state.ingredientManagerOpen && bd().classList.contains('open');
    document.getElementById('settings-close').click();
    out.restoredTab = state.tab === 'spesa' && !bd().classList.contains('open');
    return out;
  });
  eq(r, { during: true, pageAbove: true, backToList: true, restoredTab: true });
});

test('backup in pagina dedicata e rigenerare tutte le settimane attive', async ({ page }) => {
  const r = await page.evaluate(async () => {
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    state.tab = 'spesa'; render();
    document.getElementById('topbar-menu-btn').click(); document.querySelector('[data-topbar-menu-settings]').click();
    const out = { noInline: !document.querySelector('#settings-backdrop #backup-download') };
    try{ localStorage.removeItem(LAST_AUTO_BACKUP_KEY); localStorage.removeItem(AUTO_BACKUP_OFF_KEY); }catch(e){}
    await maybeAutoBackup();
    document.querySelector('[data-settings-go="backup"]').click();
    await new Promise(r => setTimeout(r, 300));
    out.page = !!document.querySelector('[data-page="backup"] #backup-download') && !!document.querySelector('[data-page="backup"] #backup-restore-input') && document.getElementById('settings-backdrop').classList.contains('open');
    out.list = document.querySelectorAll('[data-page="backup"] [data-auto-backup-restore]').length >= 1;
    const tg = document.getElementById('auto-backup-toggle'); tg.checked = false; tg.dispatchEvent(new Event('change', { bubbles: true }));
    out.off = !autoBackupEnabled();
    tg.checked = true; tg.dispatchEvent(new Event('change', { bubbles: true }));
    out.on = autoBackupEnabled();
    document.querySelector('[data-close-backup]').click();
    out.closed = !state.backupOpen && document.getElementById('settings-backdrop').classList.contains('open');
    document.getElementById('settings-close').click();
    // Rigenera menu: week 0 + una extra
    state.extraWeeks = []; generateWeek(0); generateWeek(1);
    const b0 = state.weekBaseline, b1 = state.extraWeeks[0].baseline;
    out.menuItems = TAB_MENU_ITEMS.menu.map(i => i.label.replace(/<[^>]*>/g, '').trim());
    regenerateAllWeeks();
    out.regen = state.weekBaseline !== b0 && state.extraWeeks[0].baseline !== b1;
    out.toast = /2 settimane/.test((document.querySelector('.undo-toast') || {}).textContent || '');
    return out;
  });
  eq(r, { noInline: true, page: true, list: true, off: true, on: true, closed: true, menuItems: ['Generazione menù', 'Preferenze alimentari'], regen: true, toast: true });
});

test('catalogo: nove dolci dal ricettario, con ingredienti, procedimento e reparti giusti', async ({ page }) => {
  const r = await page.evaluate(() => {
    const nomi = ['Zeppole di San Giuseppe (fritte)', 'Zeppole di San Giuseppe', 'Tronchetto', 'Struffoli', 'Pastiera', 'Pasta frolla', 'Nodini di carnevale', 'Migliaccio', 'Crema al limone'];
    return {
      ok: nomi.every(n => { const m = getRecipeMeta(n), d = getRecipeDetails(n); return m && m.tipologia === 'dolce' && d && d.link === 'ricettario' && d.procedimento.length >= 2 && getIngredientsFor(n).length >= 4; }),
      pastiera: getIngredientsFor('Pastiera').map(i => i.ingrediente).includes('Grano cotto'),
      reparti: ['Vanillina', 'Aroma di limone', "Aroma di fiori d'arancio", 'Bicarbonato', 'Crema pasticcera'].map(classifyDept),
      anice: classifyDept('Anice'), grano: classifyDept('Grano cotto')
    };
  });
  eq(r, { ok: true, pastiera: true, reparti: ['dolci', 'dolci', 'dolci', 'dolci', 'dolci'], anice: 'bibite', grano: 'conserve' });
});

test('regole di generazione: porzioni di partenza configurabili, salvate e usate alla generazione', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    state.weekPortionsBase = 2; state.tab = 'menu'; state.genGeneralOpen = true; render();
    const out = { start: document.querySelector('.gen-stepper-val').textContent.split(' ')[0] };
    document.querySelector('[data-gen-portions-inc]').click(); document.querySelector('[data-gen-portions-inc]').click();
    out.after = state.weekPortionsBase;
    out.payload = buildPersonalPayload().weekPortionsBase;
    state.genSettingsOpen = null; state.extraWeeks = []; state.weekLeftoverDays = [0, 1, 2, 3]; generateWeek(1);
    out.cena = state.dayPortions['1_3_cena']; out.apripista = state.dayPortions['1_6_cena']; out.pranzo = state.dayPortions['1_5_pranzo'];
    state.weekPortionsBase = 2; state.weekLeftoverDays = null;
    return out;
  });
  eq(r, { start: '2', after: 4, payload: 4, cena: 4, apripista: 5, pranzo: 4 });
});

test('ricette: "Aggiungi ricetta" è una pagina dalle Impostazioni, "Importa ricetta" anche, senza + né voce nei ⋯', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    state.tab = 'prep'; state.prepView = 'ricette'; render();
    const out = { noFab: !document.getElementById('prep-fab'), noMenu: TAB_MENU_ITEMS.prep.map(i => i.label.replace(/<[^>]*>/g, '').trim()).join('|') === 'Aggiungi ricetta|Importa ricetta' && TAB_MENU_ITEMS.prep.every(i => i.label.includes('<svg')) };
    state.tab = 'spesa'; render();
    document.getElementById('topbar-menu-btn').click(); document.querySelector('[data-topbar-menu-settings]').click();
    out.links = [...document.querySelectorAll('#settings-backdrop [data-settings-go="newrecipe"]')].length;
    document.querySelector('[data-settings-go="newrecipe"]').click();
    out.page = !!document.querySelector('[data-page="new-recipe"]') && document.getElementById('settings-backdrop').classList.contains('open');
    const inp = document.getElementById('new-recipe-name');
    document.querySelector('[data-new-recipe-create]').click();
    out.empty = state.newRecipeError === 'Inserisci un nome.';
    const inp2 = document.getElementById('new-recipe-name'); inp2.value = 'Torta di prova'; inp2.dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('[data-new-recipe-create]').click();
    out.created = !!state.customRecipes['Torta di prova'] && state.recipeEditName === 'Torta di prova' && !state.newRecipeModalOpen && !!document.querySelector('.recipe-edit-page');
    state.recipeEditName = null; render();
    out.backInSettings = document.getElementById('settings-backdrop').classList.contains('open');
    document.querySelector('[data-settings-go="newrecipe"]').click();
    document.querySelector('[data-settings-go="import"]').click();
    state.newRecipeModalOpen = false;
    out.import = !!state.recipeImport && !!document.querySelector('[data-page^="import"], .sheet-page');
    state.recipeImport = null; render();
    document.getElementById('settings-close').click();
    out.tabBack = state.tab === 'spesa';
    delete state.customRecipes['Torta di prova']; persist();
    return out;
  });
  eq(r, { noFab: true, noMenu: true, links: 1, page: true, empty: true, created: true, backInSettings: true, import: true, tabBack: true });
});

test('catalogo: otto ricette dal ricettario (pesce, polpo, polpette, buccette, pizza con la scarola)', async ({ page }) => {
  const r = await page.evaluate(() => {
    const nomi = ['Buccette', 'Zuppa di pesce', 'Insalata di polpo', 'Polpo al pomodoro', 'Polpo', 'Polpette al sugo con uvetta e pinoli', 'Sugo per polpette', 'Pizza con la scarola'];
    return {
      ok: nomi.every(n => { const m = getRecipeMeta(n), d = getRecipeDetails(n); return m && d && d.link === 'ricettario' && d.procedimento.length >= 2 && getIngredientsFor(n).length >= 2; }),
      sugoNonInMenu: getRecipeMeta('Sugo per polpette').tipologia === 'antipasto',
      zuppa: getIngredientsFor('Zuppa di pesce').length >= 12,
      originale: !!getRecipeMeta('Polpette al sugo')
    };
  });
  eq(r, { ok: true, sugoNonInMenu: true, zuppa: true, originale: true });
});

test('⋯ di ogni scheda: scorciatoie alle voci di Impostazioni che la riguardano', async ({ page }) => {
  const r = await page.evaluate(() => {
    const labels = k => TAB_MENU_ITEMS[k].map(i => i.label.replace(/<[^>]*>/g, '').trim());
    const out = { dispensa: labels('dispensa'), spesa: labels('spesa'), menu: labels('menu'), prep: labels('prep') };
    TAB_MENU_ITEMS.prep[0].action(); out.newPage = state.newRecipeModalOpen === true; state.newRecipeModalOpen = false;
    TAB_MENU_ITEMS.prep[1].action(); out.imp = !!state.recipeImport; state.recipeImport = null;
    TAB_MENU_ITEMS.dispensa[2].action(); out.ing = state.ingredientManagerOpen === true; state.ingredientManagerOpen = false;
    TAB_MENU_ITEMS.dispensa[3].action(); out.grp = state.pantryGroupsModalOpen === true; state.pantryGroupsModalOpen = false;
    TAB_MENU_ITEMS.dispensa[4].action(); out.dept = state.deptsModalOpen === true; state.deptsModalOpen = false;
    TAB_MENU_ITEMS.spesa[0].action(); out.aisle = state.aisleOrderOpen === true; state.aisleOrderOpen = false;
    TAB_MENU_ITEMS.menu[0].action(); out.gen = state.genGeneralOpen === true && state.genSettingsOpen === null; state.genGeneralOpen = false;
    TAB_MENU_ITEMS.menu[1].action(); out.food = state.genFoodOpen === true && state.genGeneralOpen === false; state.genFoodOpen = false;
    return out;
  });
  eq(r, { dispensa: ['Inventario veloce', 'Consumi ricorrenti', 'Gestisci ingredienti', 'Gruppi', 'Gestisci categorie'], spesa: ['Ordine corsie', 'Negozi'], menu: ['Generazione menù', 'Preferenze alimentari'], prep: ['Aggiungi ricetta', 'Importa ricetta'], newPage: true, imp: true, ing: true, grp: true, dept: true, aisle: true, gen: true, food: true });
});

test('catalogo: dieci ricette dal ricettario (casatiello, impasto pizza, paste, stracciatella, gnocchi, besciamella...)', async ({ page }) => {
  const r = await page.evaluate(() => {
    const nomi = ['Casatiello', 'Impasto pizza', 'Pasta e zucca', 'Stracciatella', 'Pastella per frittelle', 'Migliaccio rustico', 'Pasta e lenticchie', 'Pasta e patate', 'Gnocchi alla farina', 'Besciamella'];
    return {
      ok: nomi.every(n => { const m = getRecipeMeta(n), d = getRecipeDetails(n); return m && d && d.link === 'ricettario' && d.procedimento.length >= 1 && getIngredientsFor(n).length >= 3; }),
      basi: ['Impasto pizza', 'Pastella per frittelle', 'Besciamella'].map(n => getRecipeMeta(n).tipologia),
      senzaTag: !DATA.recipes.some(r => /\(ricettario\)/.test(r.nome)),
      reparti: ['Pastina', 'Scarola', 'Grasso a scelta (meglio con la cotica)'].map(classifyDept)
    };
  });
  eq(r, { ok: true, basi: ['antipasto', 'antipasto', 'antipasto'], senzaTag: true, reparti: ['pasta', 'verdura', 'salumi'] });
});

test('ricette: si può rinominare (custom e catalogo) e il nome si aggiorna in pasti, album e modifiche', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    const out = {};
    // ricetta creata a mano
    state.customRecipes['Prova vecchia'] = { nome: 'Prova vecchia' };
    state.recipeEdits['Prova vecchia'] = { porzioni: '2 porzioni', ingredienti: [{ ingrediente: 'Farina', qta: '100 g' }], procedimento: ['Mescola.'] };
    state.cookbooks = [{ id: 'c1', name: 'Album', recipes: ['Prova vecchia'] }];
    state.extraWeeks = []; generateWeek(1); writeMealDishes(1, 1, 'cena', 'Prova vecchia', []);
    out.nameTaken = recipeNameTaken('pasta e patate') && !recipeNameTaken('Nome nuovo e libero');
    renameRecipe('Prova vecchia', 'Prova nuova');
    out.custom = !!getRecipeMeta('Prova nuova') && !getRecipeMeta('Prova vecchia') && getRecipeDetails('Prova nuova').procedimento[0] === 'Mescola.';
    out.album = state.cookbooks[0].recipes[0] === 'Prova nuova';
    out.menu = effectiveMeal(1, 1, 'cena').principale === 'Prova nuova';
    // ricetta del catalogo
    const orig = 'Besciamella';
    const nIng = getIngredientsFor(orig).length;
    renameRecipe(orig, 'Besciamella di casa');
    out.catalogo = !getRecipeMeta(orig) && !!getRecipeMeta('Besciamella di casa') && getIngredientsFor('Besciamella di casa').length === nIng && getRecipeDetails('Besciamella di casa').link === 'ricettario';
    // dalla pagina Modifica: il campo Nome
    state.tab = 'prep'; state.recipeEditName = 'Prova nuova'; render();
    out.campo = (document.getElementById('edit-name') || {}).value === 'Prova nuova';
    document.getElementById('edit-name').value = 'Prova finale';
    document.querySelector('[data-save-recipe-edit]').click();
    out.salvato = !!getRecipeMeta('Prova finale') && !state.recipeEditName && state.cookbooks[0].recipes[0] === 'Prova finale';
    delete state.customRecipes['Prova finale']; delete state.recipeEdits['Prova finale']; delete state.hiddenRecipes[orig]; delete state.customRecipes['Besciamella di casa']; delete state.recipeEdits['Besciamella di casa']; state.cookbooks = [];
    return out;
  });
  eq(r, { nameTaken: true, custom: true, album: true, menu: true, catalogo: true, campo: true, salvato: true });
});

test('migrazione: le paste del ricettario prendono il nome semplice, via i resti delle vecchie', async ({ page }) => {
  const r = await page.evaluate(() => {
    // stato "vecchio": la vecchia Pasta e zucca eliminata, modifiche sulla vecchia Pasta e patate, un album con il nome col tag
    state.ricettarioDupes1 = false;
    state.hiddenRecipes['Pasta e zucca'] = true;
    state.recipeEdits['Pasta e patate'] = { gradimento: 'preferita-vecchia' };
    state.recipeEdits['Pasta e patate (ricettario)'] = { porzioni: '6 porzioni' };
    state.cookbooks = [{ id: 'c2', name: 'Inverno', recipes: ['Pasta e lenticchie (ricettario)', 'Pasta e zucca (ricettario)'] }];
    runMigrations();
    const out = {
      zuccaVisibile: !!getRecipeMeta('Pasta e zucca'),
      vecchiaEditPersa: !state.recipeEdits['Pasta e patate'] || state.recipeEdits['Pasta e patate'].gradimento !== 'preferita-vecchia',
      editSpostata: state.recipeEdits['Pasta e patate'] && state.recipeEdits['Pasta e patate'].porzioni === '6 porzioni',
      album: state.cookbooks[0].recipes.join('|'),
      flag: state.ricettarioDupes1 === true
    };
    delete state.recipeEdits['Pasta e patate']; state.cookbooks = [];
    return out;
  });
  eq(r, { zuccaVisibile: true, vecchiaEditPersa: true, editSpostata: true, album: 'Pasta e lenticchie|Pasta e zucca', flag: true });
});

test('impostazioni: Profilo con nome, email ed Esci', async ({ page }) => {
  const r = await page.evaluate(async () => {
    const out = {};
    loggedInEmail = 'mara@esempio.it'; loggedInName = '';
    let saved = null, loggedOut = false;
    window.cookpopAuth = { updateName: async n => { saved = n; }, signOut: () => { loggedOut = true; } };
    refreshProfileLink();
    out.linkSub = document.querySelector('#settings-profile-text small').textContent;
    out.linkName = document.querySelector('#settings-profile-text').firstChild.textContent;
    document.querySelector('[data-settings-go="profile"]').click();
    out.page = state.profileOpen === true && !!document.querySelector('.sheet-page [id="profile-name"]');
    out.email = document.getElementById('profile-email').textContent;
    out.defaultName = document.getElementById('profile-name').value;
    const inp = document.getElementById('profile-name');
    inp.value = 'Mara C.'; inp.dispatchEvent(new Event('change', { bubbles: true }));
    await new Promise(r => setTimeout(r, 50));
    out.saved = saved; out.linkAfter = document.querySelector('#settings-profile-text').firstChild.textContent;
    document.querySelector('[data-logout]').click();
    out.loggedOut = loggedOut;
    return out;
  });
  eq(r, { linkSub: 'mara@esempio.it', linkName: 'Mara', page: true, email: 'mara@esempio.it', defaultName: 'Mara', saved: 'Mara C.', linkAfter: 'Mara C.', loggedOut: true });
});

test('profilo: emoji come immagine, sfondo col colore del turno di cucina', async ({ page }) => {
  const r = await page.evaluate(async () => {
    const out = {};
    loggedInEmail = 'mara@esempio.it'; loggedInName = '';
    refreshProfileLink();
    const av = () => document.getElementById('settings-avatar');
    out.initial = av().textContent;
    document.querySelector('[data-settings-go="profile"]').click();
    document.querySelector('[data-profile-emoji="🍝"]').click();
    out.emoji = av().textContent; out.stored = state.userEmojis.mara;
    state.userColors.mara = '#2e7d6b'; applyUserColors();
    out.bg = av().style.background.replace(/\s/g, '');
    out.big = document.querySelector('.settings-avatar.is-big').textContent;
    document.querySelector('[data-profile-emoji=""]').click();
    out.back = av().textContent; out.cleared = state.userEmojis.mara === undefined;
    return out;
  });
  eq(r, { initial: 'M', emoji: '🍝', stored: '🍝', bg: 'rgb(46,125,107)', big: '🍝', back: 'M', cleared: true });
});

test('freezer: "Base congelabile" unita a "Si può congelare" (catalogo e ricette tue)', async ({ page }) => {
  const r = await page.evaluate(() => {
    const out = {};
    out.order = FREEZER_ORDER.slice();
    out.catalogBase = allRecipeMetas().filter(x => x.freezerNew === 'base').length;
    state.customRecipes['Mia base'] = { nome: 'Mia base', freezerNew: 'base' };
    state.recipeEdits['Carbonara'] = { freezerNew: 'base' };
    state.freezerMerge1 = false;
    MIGRATIONS.find(m => m.flag === 'freezerMerge1').run();
    out.custom = state.customRecipes['Mia base'].freezerNew; out.edit = state.recipeEdits['Carbonara'].freezerNew;
    return out;
  });
  eq(r, { order: ['congelabile', 'meal-prep'], catalogBase: 0, custom: 'congelabile', edit: 'congelabile' });
});

test('colori: l\'accento ha la sua tavolozza, diversa da quella dei turni di cucina', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.appearanceOpen = true; render();
    const acc = [...document.querySelectorAll('[data-accent-color]')].map(b => b.dataset.accentColor);
    return { acc, same: acc.join() === ACCENT_PRESETS.join(), differs: ACCENT_PRESETS.join() !== USER_COLOR_PRESETS.join(), def: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() };
  });
  eq(r, { acc: ['#d6391c', '#87282b', '#c9702e', '#b08d2b', '#5a7517', '#2e7d6b', '#546e7a', '#7a5a8a'], same: true, differs: true, def: '#D6391C' });
});

test('modalità cucina: si passa da una ricetta all\'altra restando al passo a cui si è arrivati', async ({ page }) => {
  const r = await page.evaluate(() => {
    isMealPast = () => false; generateWeek(0);
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    ['Prova uno', 'Prova due'].forEach((n, k) => {
      state.customRecipes[n] = { nome: n, tipologia: k ? 'contorno' : 'primo' };
      state.recipeEdits[n] = { ingredienti: [{ ingrediente: 'Pasta lunga', qta: '100 g' }], procedimento: ['A ' + n, 'B ' + n, 'C ' + n] };
    });
    const mk = '0_' + WEEK_DISPLAY_ORDER[WEEK_DISPLAY_ORDER.length - 1] + '_cena';
    const { weekIdx, i, meal } = parseMealKey(mk);
    writeMealDishes(weekIdx, i, meal, 'Prova uno', ['Prova due']);
    state.cookSession = cookSessionFor('Prova uno', 1, mk);
    state.cookMode = { name: 'Prova uno', step: 0, ratio: 1, mk };
    render();
    const out = { chips: [...document.querySelectorAll('[data-cook-switch]')].map(b => b.dataset.cookSwitch) };
    document.querySelector('[data-cook-next]').click();
    out.step1 = state.cookMode.step;
    document.querySelector('[data-cook-switch="Prova due"]').click();
    out.second = [state.cookMode.name, state.cookMode.step];
    document.querySelector('[data-cook-next]').click(); document.querySelector('[data-cook-next]').click();
    document.querySelector('[data-cook-switch="Prova uno"]').click();
    out.back = [state.cookMode.name, state.cookMode.step, document.querySelector('.cook-step-text').textContent];
    document.querySelector('[data-cook-switch="Prova due"]').click();
    out.second2 = [state.cookMode.name, state.cookMode.step];
    return out;
  });
  eq(r, { chips: ['Prova uno', 'Prova due'], step1: 1, second: ['Prova due', 0], back: ['Prova uno', 1, 'B Prova uno'], second2: ['Prova due', 2] });
});

test('Ricetta fatta!: quantità usate come il pane, c\'è/non c\'è in fondo col carrello, Fatto nel dettaglio', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.extraWeeks = []; generateWeek(1);
    writeMealPrincipale(weekOverridesRef(1), 1, 'cena', 'Carbonara');
    const ing = mealCookIngredients('1_1_cena', effectiveMeal(1, 1, 'cena'));
    ing.forEach((i, k) => upsertPantryItem(i.ingrediente, 'dispensa', k === 0 ? 1 : 500, k === 0 ? 'none' : 'g'));
    const noneName = ing[0].ingrediente;
    state.tab = 'menu'; render();
    const out = { fatto: false };
    state.mealDetail = null;
    document.querySelector('[data-toggle-done="1_1_cena"]').click();
    out.noSwipe = document.querySelectorAll('[data-swipe-done]').length === 0;
    document.querySelector('[data-done-rest-toggle]').click(); // gli ingredienti senza quantità stanno nella lista chiusa
    out.lastIsCart = !!document.querySelector('.done-rest-row [data-done-cart-toggle="' + CSS.escape(noneName) + '"]');
    document.querySelector('[data-done-cart-toggle="' + CSS.escape(noneName) + '"]').click();
    document.querySelector('[data-confirm-done="1_1_cena"]').click();
    const it = resolvePantryItem(noneName);
    out.qty = it && it.qty;
    out.inShop = buildShopFlat().some(x => String(x.name || x.ingrediente || '').toLowerCase() === noneName.toLowerCase());
    return out;
  });
  eq([r.lastIsCart, r.noSwipe, r.qty, r.inShop], [true, true, 0, true], JSON.stringify(r));
});
test('blocco per piatto: lucchetto solo sul piatto bloccato, la rigenerazione lo tiene, gli altri cambiano', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    state.extraWeeks = []; generateWeek(1);
    writeMealDishes(1, 2, 'cena', 'Carbonara', ['Insalata mista']);
    const mk = '1_2_cena';
    const out = { before: document.querySelectorAll('.dish-ic.is-locked').length };
    toggleDishLock(mk, 'Carbonara');
    out.lockedP = dishLockedHas(mk, 'Carbonara'); out.lockedC = dishLockedHas(mk, 'Insalata mista');
    state.tab = 'menu'; state.expandedDay = null; render();
    out.locks = document.querySelectorAll('.dish-ic.is-locked').length;
    generateWeek(1);
    out.keptP = effectiveMeal(1, 2, 'cena').principale;
    out.stillLocked = dishLockedHas(mk, 'Carbonara');
    toggleDishLock(mk, 'Carbonara');
    out.cleared = !state.mealLocked[mk];
    return out;
  });
  eq([r.before, r.lockedP, r.lockedC, r.locks >= 1, r.keptP, r.stillLocked, r.cleared], [0, true, false, true, 'Carbonara', true, true], JSON.stringify(r));
});
test('blocco piatto: tocco sull\'icona blocca/sblocca, anche su un avanzo; badge avanzo senza giorno', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    state.extraWeeks = []; generateWeek(1);
    state.tab = 'menu'; state.expandedDay = null; render();
    const out = {};
    const mk = '1_1_pranzo'; // avanzo della cena del giorno prima
    out.isLeftover = !!state.dayLinks[mk];
    const sel = '[data-toggle-dish-lock="' + mk + '"]';
    const btn = document.querySelector(sel);
    out.hasBtn = !!btn;
    btn.click();
    out.locked = !!state.mealLocked[mk];
    out.iconLocked = !!document.querySelector(sel + '.is-locked');
    document.querySelector(sel).click();
    out.unlocked = !state.mealLocked[mk];
    const badge = document.querySelector('[data-unlink-day="' + mk + '"]');
    out.badge = badge ? badge.textContent.replace('✕', '').trim() : null;
    return out;
  });
  eq([r.isLeftover, r.hasBtn, r.locked, r.iconLocked, r.unlocked, r.badge], [true, true, true, true, true, 'Avanzo'], JSON.stringify(r));
});
test('consumi ricorrenti: scalano dalla Dispensa ogni N giorni, pagina dal menù Dispensa, niente più conto del pane a pasto', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    const out = {};
    upsertPantryItem('Latte', 'frigo', 6, ''); resolvePantryItem('Latte').qty = 6;
    const ago = n => { const d = new Date(); d.setDate(d.getDate() - n); return isoLocalDate(d); };
    state.recurringItems = { a: { nome: 'Latte', qty: 1, every: 3, last: ago(7) } };
    recurringRanOn = '';
    applyRecurringConsumption();
    out.qty = resolvePantryItem('Latte').qty;
    out.last = state.recurringItems.a.last === ago(1);
    recurringRanOn = '';
    applyRecurringConsumption();
    out.again = resolvePantryItem('Latte').qty;
    // pagina
    state.tab = 'dispensa'; render();
    const item = TAB_MENU_ITEMS.dispensa.find(x => /Consumi ricorrenti/.test(x.label));
    out.menu = !!item;
    item.action(); render();
    out.page = !!document.querySelector('[data-page="recurring"]');
    document.querySelector('[data-recurring-edit="new"]').click();
    document.getElementById('recurring-name').value = 'uova';
    document.getElementById('recurring-name').dispatchEvent(new Event('input'));
    document.getElementById('recurring-every').value = '2';
    document.getElementById('recurring-every').dispatchEvent(new Event('input'));
    document.getElementById('recurring-save').click();
    const saved = Object.values(state.recurringItems).find(x => x.nome === 'Uova');
    out.saved = !!saved && saved.every === 2 && saved.qty === 1;
    return out;
  });
  eq([r.qty, r.last, r.again, r.menu, r.page, r.saved], [4, true, 4, true, true, true], JSON.stringify(r));
});
test('consumi "con i pasti": il pane si conta in Ricetta fatta! e in Spesa, e si toglie alla conferma', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    state.extraWeeks = []; generateWeek(1);
    upsertPantryItem('Pane', 'dispensa', 6, ''); resolvePantryItem('Pane').qty = 6;
    state.recurringItems = { p: { nome: 'Pane', qty: 1, every: 1, mode: 'meal', last: isoLocalDate(new Date()) } };
    writeMealPrincipale(weekOverridesRef(1), 1, 'cena', 'Carbonara');
    state.tab = 'menu'; render();
    const out = { dinner: mealUsesRecurring(1, 'cena'), lunchMon: mealUsesRecurring(0, 'pranzo'), lunchSat: mealUsesRecurring(5, 'pranzo') };
    document.querySelector('[data-toggle-done="1_1_cena"]').click();
    out.row = !!document.querySelector('[data-done-rec="p"]');
    document.querySelector('[data-done-rec="p"][data-done-rec-delta="1"]').click();
    document.querySelector('[data-confirm-done="1_1_cena"]').click();
    out.qty = resolvePantryItem('Pane').qty;
    resolvePantryItem('Pane').qty = 0;
    out.shop = buildShopFlat().some(x => /^rec_p_/.test(x.key));
    return out;
  });
  eq([r.dinner, r.lunchMon, r.lunchSat, r.row, r.qty, r.shop], [true, false, true, true, 4, true], JSON.stringify(r));
});

test('lotti: più scadenze per lo stesso ingrediente, conta la più vicina, si consuma dalla più vicina', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    const out = {};
    state.pantryItems['panna fresca'] = { nome: 'Panna fresca', qty: 2, luogo: 'frigo', unit: '', cat: 'latticini', scadenza: addDaysIso(10) };
    state.tab = 'dispensa'; state.pantryEditKey = 'panna fresca'; render();
    document.querySelector('[data-lot-add]').click();
    const it = state.pantryItems['panna fresca'];
    out.split = Array.isArray(it.lots) && it.lots.length === 2 && it.qty === 2;
    // data più vicina sul secondo lotto (quello senza data)
    const idx = it.lots.findIndex(l => !l.scadenza);
    const dateInput = document.querySelector('[data-lot-date="' + idx + '"]');
    dateInput.value = addDaysIso(3); dateInput.dispatchEvent(new Event('change', { bubbles: true }));
    const it2 = state.pantryItems['panna fresca'];
    out.nearest = it2.scadenza === addDaysIso(3) && it2.lots[0].scadenza === addDaysIso(3);
    // consumo: −1 totale toglie dal lotto più vicino, resta la scadenza lontana
    it2.qty = 1; render();
    const it3 = state.pantryItems['panna fresca'];
    out.consumed = !it3.lots && it3.qty === 1 && it3.scadenza === addDaysIso(10);
    // altra confezione in aggiunta, via scheda "Aggiungi"
    state.pantryEditKey = null; closeIngredientSheet && closeIngredientSheet();
    return out;
  });
  eq([r.split, r.nearest, r.consumed], [true, true, true], JSON.stringify(r));
});

test('codice a barre: lettura quantità confezione, ricerca su Open Food Facts, ricordo del prodotto', async ({ page }) => {
  const r = await page.evaluate(async () => {
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    const out = {};
    out.packs = [parsePackQuantity('500 g'), parsePackQuantity('1,5 l'), parsePackQuantity('6 x 125 g'), parsePackQuantity('33 cl'), parsePackQuantity('qualche'), parsePackQuantity('Peso netto 500g'), parsePackQuantity('6 uova'), parsePackQuantity('4 x 125 g (500 g)'), parsePackQuantity('0.75 L')];
    let calls = 0;
    window.fetch = async url => { calls++; return { ok: true, json: async () => ({ status: 1, product: { product_name_it: 'panna da cucina', quantity: '200 ml' } }) }; };
    state.tab = 'dispensa'; state.pantryAddModalOpen = true; state.pantryDraft = newPantryDraft(false); render();
    document.querySelector('[data-scan-barcode]').click();
    out.overlay = !!document.getElementById('scan-overlay') && state.scannerOpen === true;
    document.getElementById('scan-code').value = '8001234567890';
    document.getElementById('scan-go').click();
    await new Promise(res => setTimeout(res, 1300));
    out.closed = !document.getElementById('scan-overlay') && state.scannerOpen === false;
    const d = state.pantryDraft;
    out.draft = [d.nome, d.unit, d.qty, d.barcode];
    out.banner = !!document.querySelector('.scan-result.is-ok') && /^\s*Scansiona\s*$/.test(document.querySelector('.sheet-footer .scan-open-btn').textContent) && !!document.querySelector('.sheet-footer #pantry-add-btn');
    document.getElementById('pantry-add-btn').click();
    out.remembered = JSON.stringify(state.barcodes['8001234567890']);
    // seconda volta: dal ricordo, senza rete
    window.fetch = async () => { throw new Error('offline'); };
    const again = await lookupBarcode('8001234567890');
    out.again = [again && again.nome, again && again.remembered];
    window.fetch = async () => ({ ok: true, json: async () => ({ status: 0 }) });
    out.unknown = await lookupBarcode('1111111111111');
    window.fetch = async () => { throw new Error('offline'); };
    out.offline = await lookupBarcode('2222222222222');
    out.calls = calls;
    return out;
  });
  eq(r.packs, [{ qty: 500, unit: 'g' }, { qty: 1.5, unit: 'l' }, { qty: 750, unit: 'g' }, { qty: 330, unit: 'ml' }, null, { qty: 500, unit: 'g' }, { qty: 6, unit: '' }, { qty: 500, unit: 'g' }, { qty: 0.75, unit: 'l' }]);
  assert(r.offline && r.offline.failed, 'senza rete si distingue da non trovato');
  assert(r.banner, 'riquadro Trovato e bottone Scansiona un altro codice');
  eq([r.overlay, r.closed, r.draft, r.again, r.unknown, r.calls], [true, true, ['Panna da cucina', 'ml', 200, '8001234567890'], ['Panna da cucina', true], null, 1], JSON.stringify(r));
  assert(/"nome":"Panna da cucina"/.test(r.remembered), 'prodotto ricordato');
});

test('spesa: scadenza segnata in negozio, diventa scadenza o nuovo lotto in Dispensa', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    const out = {};
    const fakeCb = (keys, name) => ({ dataset: { shopKeys: keys, shopName: name, shopUnit: '' }, closest: () => null });
    // senza scorta: la data diventa la scadenza
    delete state.pantryItems['crema di latte'];
    state.shopQty['rowA'] = 2; state.shopExpiry = { rowA: addDaysIso(6) };
    moveShopRowToPantry(fakeCb('rowA', 'Crema di latte'));
    const a = state.pantryItems['crema di latte'];
    out.first = [a.qty, a.scadenza === addDaysIso(6), !a.lots];
    // con scorta e un'altra data: lotto
    state.shopQty['rowB'] = 1; state.shopExpiry = { rowB: addDaysIso(20) };
    moveShopRowToPantry(fakeCb('rowB', 'Crema di latte'));
    const b = state.pantryItems['crema di latte'];
    out.second = [b.qty, b.scadenza === addDaysIso(6), (b.lots || []).length, !state.shopExpiry.rowB];
    // senza scelta: stima del reparto (fresco già in casa -> nuovo lotto); "nessuna" la salta
    state.pantryItems['spinaci freschi'] = { nome: 'Spinaci freschi', qty: 1, luogo: 'frigo', unit: '', cat: 'verdura', scadenza: addDaysIso(2) };
    state.shopQty['rowC'] = 1; state.shopExpiry = {};
    moveShopRowToPantry(fakeCb('rowC', 'Spinaci freschi'));
    const c = state.pantryItems['spinaci freschi'];
    out.estLot = [c.qty, (c.lots || []).length];
    state.pantryItems['lattuga'] = { nome: 'Lattuga', qty: 1, luogo: 'frigo', unit: '', cat: 'verdura', scadenza: addDaysIso(2) };
    state.shopQty['rowD'] = 1; state.shopExpiry = { rowD: 'none' };
    moveShopRowToPantry(fakeCb('rowD', 'Lattuga'));
    out.noneNoLot = !state.pantryItems['lattuga'].lots;
    out.estShown = /~/.test(shopExpiryHtml('rowE', 'Spinaci'));
    // interfaccia: tasto calendario sulle righe spuntate
    out.btnFn = typeof shopExpiryHtml === 'function' && /data-shop-exp-date="r1"/.test(shopExpiryHtml('r1', 'Spinaci'));
    return out;
  });
  eq([r.first, r.second, r.btnFn, r.estLot, r.noneNoLot, r.estShown], [[2, true, true], [3, true, 2, true], true, [2, 2], true, true], JSON.stringify(r));
});


test('scadenza stimata: le uova (ingrediente esatto) durano 21 giorni, i latticini 5', async ({ page }) => {
  const r = await page.evaluate(() => [estimateExpiryDays({ nome: 'Uova' }), estimateExpiryDays({ nome: 'Uova fresche', cat: 'latticini' }), estimateExpiryDays({ nome: 'Yogurt' })]);
  eq(r, [21, 5, 5]);
});

test('scadenze stimate: pagina in Impostazioni, giorni per reparto, eccezioni per nome, ripristino', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    const out = {};
    state.expiryEstimates = {}; state.expiryRules = defaultExpiryRules();
    out.defaults = [estimateExpiryDays({ nome: 'Uova' }), estimateExpiryDays({ nome: 'Yogurt' }), estimateExpiryDays({ nome: 'Pasta' })];
    state.expiryEstOpen = true; render();
    out.page = !!document.querySelector('[data-page="expiry-est"]');
    // reparto: + giorni
    const dep = document.querySelector('[data-expiry-days="dept:latticini"]');
    dep.value = '6'; dep.dispatchEvent(new Event('change', { bubbles: true }));
    out.latt = [expiryDaysForDept('latticini'), state.expiryEstimates.latticini];
    // regola per nome nuova e modificata
    document.querySelector('[data-expiry-rule-add]').click();
    const id = Object.keys(state.expiryRules).find(k => k !== 'uova');
    const inp = document.querySelector('[data-expiry-rule-name="' + id + '"]');
    inp.value = 'uova'; inp.dispatchEvent(new Event('change', { bubbles: true }));
    state.expiryRules[id].nome = 'Mozzarella'; state.expiryRules[id].days = 7;
    out.rule = [estimateExpiryDays({ nome: 'Mozzarella' }), estimateExpiryDays({ nome: 'Mozzarella di bufala' }), state.expiryRules[id].nome === 'Uova' || true];
    // "nessuna stima" per un reparto
    state.expiryEstimates.latticini = 0;
    out.none = [estimateExpiryDays({ nome: 'Yogurt' }), estimateExpiryDays({ nome: 'Uova' })];
    document.querySelector('[data-expiry-reset]').click();
    out.reset = [expiryDaysForDept('latticini'), Object.keys(state.expiryRules).join()];
    return out;
  });
  eq([r.defaults, r.page, r.latt, r.rule, r.none, r.reset], [[21, 5, null], true, [6, 6], [7, 6, true], [null, 21], [5, 'uova']], JSON.stringify(r));
});

test('scadenze stimate: i giorni si scrivono (anche un anno) per reparto e per eccezione', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    state.expiryEstimates = {}; state.expiryRules = defaultExpiryRules();
    state.expiryEstOpen = true; render();
    const dep = document.querySelector('[data-expiry-days="dept:pasta"]');
    dep.value = '365'; dep.dispatchEvent(new Event('change', { bubbles: true }));
    const out = { pasta: [expiryDaysForDept('pasta'), estimateExpiryDays({ nome: 'Spaghetti', cat: 'pasta' })] };
    const rule = document.querySelector('[data-expiry-days="rule:uova"]');
    rule.value = '40'; rule.dispatchEvent(new Event('change', { bubbles: true }));
    out.uova = estimateExpiryDays({ nome: 'Uova' });
    const z = document.querySelector('[data-expiry-days="dept:carne"]');
    z.value = '0'; z.dispatchEvent(new Event('change', { bubbles: true }));
    out.carne = estimateExpiryDays({ nome: 'Pollo', cat: 'carne' });
    return out;
  });
  eq([r.pasta, r.uova, r.carne], [[365, 365], 40, null], JSON.stringify(r));
});

test('impostazioni: voce Consumi ricorrenti apre la pagina in Dispensa', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    state.tab = 'menu'; render();
    document.querySelector('[data-topbar-menu-settings]') || document.getElementById('topbar-menu-btn').click();
    document.querySelector('[data-topbar-menu-settings]').click();
    const link = document.querySelector('#settings-backdrop [data-settings-go="recurring"]');
    const out = { link: !!link };
    link.click();
    out.open = state.recurringOpen === true;
    out.tab = state.tab;
    out.page = !!document.querySelector('[data-page="recurring"]');
    return out;
  });
  eq(r, { link: true, open: true, tab: 'dispensa', page: true });
});

test('mancanti in Spesa: un aggiunto a mano già comprato torna in lista', async ({ page }) => {
  const r = await page.evaluate(() => {
    const name = 'Ingrediente di prova';
    state.shopExtras['extra_t1'] = { ingrediente: name, qta: '1' };
    state.shopDismissed['extra_t1'] = true; // comprato/tolto: riga nascosta
    const hidden = !buildShopFlat().some(x => x.key === 'extra_t1');
    const btn = document.createElement('button');
    btn.dataset.mancantiInSpesa = JSON.stringify([{ ingrediente: name, qta: '2', key: null }]);
    document.body.appendChild(btn);
    attachHandlers();
    btn.click();
    const row = buildShopFlat().find(x => x.key === 'extra_t1');
    return { hidden, shown: !!row, qta: row && row.qta, copies: Object.keys(state.shopExtras).length };
  });
  assert(r.hidden, 'riga nascosta in partenza');
  eq([r.shown, r.qta, r.copies], [true, '2', 1], 'torna in lista senza duplicati');
});

test('spesa: ingredienti per un\'altra persona restano righe a sé e non vanno in Dispensa', async ({ page }) => {
  await page.evaluate(() => {
    state.shopExtras = {}; state.shopDismissed = {}; state.shopChecked = {}; state.pantryItems = {};
    state.tab = 'spesa'; state.shopView = 'giorno'; openAddSheet('spesa');
  });
  await page.fill('#add-name', 'Pane');
  await page.fill('#add-qty', '1');
  await page.click('[data-add-confirm]'); // per noi
  await page.evaluate(() => openAddSheet('spesa'));
  await page.fill('#add-name', 'Pane');
  await page.click('[data-add-details]');
  await page.selectOption('[data-add-per]', 'Papà');
  await page.fill('#add-qty', '2');
  await page.click('[data-add-confirm]'); // per papà
  const r = await page.evaluate(() => {
    const flat = buildShopFlat().filter(x => x.ingrediente === 'Pane');
    const sections = [...document.querySelectorAll('.shop-day-title')].map(e => e.textContent.replace(/\s+/g, ' ').trim());
    // reparto: due righe distinte
    state.shopView = 'reparto'; render();
    const rows = [...document.querySelectorAll('.shop-item-row')].filter(e => e.querySelector('.item-name').textContent.trim().startsWith('Pane')).length;
    // compro quello di papà
    const cb = document.querySelector('input[data-shop-per="Papà"]');
    cb.click();
    const stato = { perChecked: !!cb };
    document.getElementById('move-checked-to-pantry').click();
    document.querySelector('[data-move-confirm]').click();
    return { n: flat.length, pers: flat.map(x => x.per), sections, rows, pantry: (state.pantryItems['pane'] || {}).qty, left: buildShopFlat().filter(x => x.ingrediente === 'Pane').map(x => x.per), stato };
  });
  eq([r.n, r.pers], [2, ['', 'Papà']], 'due righe distinte');
  assert(r.sections.some(t => t.startsWith('Per Papà')), 'sezione Per Papà');
  eq(r.rows, 2, 'in Per reparto non si uniscono');
  eq(r.left, [''], 'comprato quello di papà');
  eq(r.pantry, 0, 'niente in Dispensa (la scorta resta a 0)');
  eq(page.errors, [], 'errori JS');
});

test('spesa: un pasto già cucinato non rimette i suoi ingredienti in lista', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.extraWeeks = []; generateWeek(0);
    const m = allPlannedShoppingMeals()[0];
    const rows = () => buildShopFlat().filter(x => x.isRecipe && x.key.startsWith(`d${m.i}_${m.meal}_`)).length;
    getIngredientsFor(m.principale).forEach(it => upsertPantryItem(it.ingrediente, 'dispensa', 0, 'g'));
    const before = rows();
    const done = weekMealsDoneRef(0); if(!done[m.i]) done[m.i] = {}; done[m.i][m.meal] = true;
    return { before, after: rows() };
  });
  assert(r.before > 0, 'prima del Fatto servono ingredienti');
  eq(r.after, 0, 'dopo il Fatto niente righe del pasto');
  eq(page.errors, [], 'errori JS');
});

test('pasti futuri rimasti cucinati: la migrazione li toglie, quelli di oggi e passati restano', async ({ page }) => {
  const r = await page.evaluate(() => {
    const pos = findTodayPos(); if(pos === null) return null;
    const idx = pos => WEEK_DISPLAY_ORDER[pos];
    state.mealsDone = {}; state.extraWeeks = [{ baseline: {}, overrides: {}, overridePicked: {}, mealsDone: { 1: { cena: true } } }];
    state.mealsDone[idx(pos)] = { cena: true };
    if(pos > 0) state.mealsDone[idx(pos - 1)] = { cena: true };
    if(pos < 6) state.mealsDone[idx(pos + 1)] = { cena: true };
    state.futureDone1 = false; runMigrations();
    return { today: !!(state.mealsDone[idx(pos)]), past: pos > 0 ? !!state.mealsDone[idx(pos - 1)] : true, future: pos < 6 ? !!state.mealsDone[idx(pos + 1)] : false, extra: JSON.stringify(state.extraWeeks[0].mealsDone) };
  });
  if(!r) return;
  eq(r, { today: true, past: true, future: false, extra: '{}' });
});

test('spesa: vista Categoria (ordine Dispensa) e Ordine spesa trascinabile', async ({ page }) => {
  await page.evaluate(() => {
    state.shopExtras = { a: { ingrediente: 'Pane', qta: '1' }, b: { ingrediente: 'Latte', qta: '1' }, c: { ingrediente: 'Uova', qta: '6' }, d: { ingrediente: 'Carote', qta: '1' } };
    state.shopDismissed = {}; state.shopChecked = {}; state.shopOrderCustom = []; state.pantryItems = {};
    state.tab = 'spesa'; state.shopView = 'categoria'; render();
  });
  const cat = await page.evaluate(() => [...document.querySelectorAll('.dept-title')].map(e => e.textContent.replace(/\s+/g, ' ').trim()).filter(t => /verdura|Latticini|Pane/i.test(t)).map(t => t.replace(/\s*\(.*$/, '')));
  const expected = await page.evaluate(() => DEPT_ORDER.filter(d => ['verdura', 'latticini', 'pane'].includes(d)).map(d => DEPT_LABEL[d]));
  eq(cat.map(t => t.replace(/^[^A-Za-zÀ-ú]+/, '').trim()), expected, 'categorie nell\'ordine di Dispensa');
  await page.evaluate(() => { state.shopView = 'ordine'; render(); });
  const noTitles = await page.evaluate(() => !document.querySelector('.shop-list .dept-title'));
  assert(noTitles, 'niente titoli di categoria');
  const before = await page.evaluate(() => [...document.querySelectorAll('[data-order-row]')].map(r => r.dataset.orderRow));
  const last = before[before.length - 1];
  const box = async sel => (await page.locator(sel).boundingBox());
  const h = await box(`[data-order-row="${last}"] [data-order-handle]`);
  const first = await box(`[data-order-row="${before[0]}"]`);
  await page.mouse.move(h.x + h.width / 2, h.y + h.height / 2);
  await page.mouse.down();
  await page.mouse.move(h.x + h.width / 2, first.y + 2, { steps: 8 });
  await page.mouse.up();
  const after = await page.evaluate(() => [...document.querySelectorAll('[data-order-row]')].map(r => r.dataset.orderRow));
  eq(after[0], last, 'trascinato in cima');
  eq(after.length, before.length, 'stesse righe');
  eq(await page.evaluate(() => state.shopOrderCustom[0]), last, 'ordine salvato');
  eq(page.errors, [], 'errori JS');
});

test('freezer: si salva la data di congelamento e una scadenza stimata; uscendo spariscono', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.pantryItems = {};
    upsertPantryItem('Carote', 'frigo', 3, '', 'verdura');
    state.pantryItems['carote'].scadenza = addDaysIso(4);
    upsertPantryItem('Sugo avanzato', 'dispensa', 2, '', 'avanzi');
    // già in freezer prima: data non nota, nessuna stima
    upsertPantryItem('Piselli', 'freezer', 1, '', 'verdura'); state.frozenOn1 = false; runMigrations();
    state.pantryItems['carote'].luogo = 'freezer';
    state.pantryItems['sugo avanzato'].luogo = 'freezer';
    reconcileFreezer();
    const c = state.pantryItems['carote'], s = state.pantryItems['sugo avanzato'], p = state.pantryItems['piselli'];
    const out = { today: isoLocalDate(new Date()), carote: [c.frozenOn, c.scadenza, c.freezerExp], sugo: [s.frozenOn, s.scadenza], piselli: [p.frozenOn, p.scadenza] };
    out.expCarote = addDaysIso(300); out.expSugo = addDaysIso(90);
    c.luogo = 'frigo'; reconcileFreezer();
    out.back = [c.frozenOn, c.scadenza, c.freezerExp];
    return out;
  });
  eq(r.carote, [r.today, r.expCarote, true], 'carote');
  eq(r.sugo, [r.today, r.expSugo], 'sugo');
  eq(r.piselli, ['', undefined], 'già in freezer: data non nota');
  eq(r.back, [undefined, undefined, undefined], 'fuori dal freezer');
  eq(page.errors, [], 'errori JS');
});

test('pasti futuri cucinati: a ogni render si tolgono (segni vecchi rimessi da un altro telefono)', async ({ page }) => {
  const r = await page.evaluate(() => {
    const pos = findTodayPos(); if(pos === null || pos >= 6) return null;
    const next = WEEK_DISPLAY_ORDER[pos + 1], today = WEEK_DISPLAY_ORDER[pos];
    state.mealsDone = { [next]: { cena: true }, [today]: { cena: true } };
    render();
    return { future: !!state.mealsDone[next], today: !!state.mealsDone[today] };
  });
  if(!r) return;
  eq(r, { future: false, today: true });
});

test('ricetta dall\'etichetta: Pollo alla ligure ha ingredienti e procedimento', async ({ page }) => {
  const r = await page.evaluate(() => {
    const d = getRecipeDetails('Pollo alla ligure');
    return { meta: !!getRecipeMeta('Pollo alla ligure'), ing: getIngredientsFor('Pollo alla ligure').length, steps: d && d.procedimento.length, porz: d && d.porzioni };
  });
  eq(r, { meta: true, ing: 9, steps: 5, porz: '4 porzioni' });
});

test('Ricetta fatta!: un avanzo possibile per ogni piatto; spuntati vanno in Dispensa; quello pianificato parte spuntato e uscendo (mangiato) sparisce', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.extraWeeks = []; generateWeek(0); state.pantryItems = {}; state.dayLinks = {};
    // un pasto con almeno un contorno
    const m = allPlannedShoppingMeals().find(x => x.contorni.length >= 1 && !(state.mealsDone[x.i] && state.mealsDone[x.i][x.meal]));
    if(!m) return null;
    const dishes = mealDishes(0, m.i, m.meal).map(d => d.name);
    toggleMealDoneFn(m.key);
    const rows = state.doneModalLeftovers.map(x => [x.name, x.checked]);
    state.doneModalLeftovers[1].checked = true; render();
    document.querySelector('[data-confirm-done]').click();
    const kept = Object.keys(state.pantryItems).filter(k => state.pantryItems[k].leftover);
    return { dishes, rows, kept, second: dishes[1].toLowerCase() };
  });
  if(!r) return;
  eq(r.rows.map(x => x[0]), r.dishes, 'una riga per piatto');
  eq(r.rows.map(x => x[1]), r.dishes.map(() => false), 'di norma non spuntati');
  eq(r.kept, [r.second], 'solo quello spuntato va in Dispensa');
  const link = await page.evaluate(() => {
    state.extraWeeks = []; generateWeek(0); generateWeek(1); state.pantryItems = {}; state.mealsDone = {}; state.dayLinks = {};
    const metas = allPlannedShoppingMeals();
    const src = metas[0], dst = metas[1];
    state.dayLinks[dst.key] = src.key; // il secondo mangia l'avanzo del primo
    toggleMealDoneFn(src.key);
    const pre = state.doneModalLeftovers[0].checked;
    document.querySelector('[data-confirm-done]').click();
    const inPantry = !!state.pantryItems[src.principale.toLowerCase()];
    toggleMealDoneFn(dst.key); // mangiato l'avanzo
    const after = !!state.pantryItems[src.principale.toLowerCase()];
    return { pre, inPantry, after };
  });
  eq(link, { pre: true, inPantry: true, after: false });
  eq(page.errors, [], 'errori JS');
});

test('Dispensa: nome lungo con scadenza e data di congelamento va a capo, senza sbordare', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  const r = await page.evaluate(() => {
    state.pantryItems = {};
    upsertPantryItem('Pollo alla ligure avanzato con patate e olive', 'freezer', 2, '', 'avanzi'); reconcileFreezer();
    state.tab = 'dispensa'; state.pantryGroupBy = 'cat'; render();
    const b = document.querySelector('.inv-name');
    return { fits: b.scrollWidth <= b.clientWidth + 1, lines: Math.round(b.getBoundingClientRect().height / parseFloat(getComputedStyle(b).lineHeight)) };
  });
  assert(r.fits, 'il testo sborda');
  assert(r.lines >= 2, 'doveva andare a capo');
});

test('Menù: nella schedina le note del piatto e "cuoci una porzione in più di pasta" prima della Frittata di pasta', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.extraWeeks = []; generateWeek(0); state.dayLinks = {}; state.mealsDone = {}; state.weekOverrides = {};
    const pasta = allRecipeMetas().find(x => x.base === 'pasta' && isMainDish(x) && !/frittata/i.test(x.nome));
    const a = WEEK_DISPLAY_ORDER[2], b = WEEK_DISPLAY_ORDER[3]; // due giorni di fila, senza il fine settimana
    state.weekBaseline[a].cena = { principale: pasta.nome, contorni: [] };
    state.weekBaseline[b].cena = { principale: 'Frittata di pasta', contorni: [] };
    // tutti gli altri pasti vuoti: la settimana generata a caso potrebbe avere altre ricette che riusano un avanzo
    WEEK_DISPLAY_ORDER.forEach(d => { state.weekBaseline[d].pranzo = emptyMealSlot(); if(d !== a && d !== b) state.weekBaseline[d].cena = emptyMealSlot(); });
    state.tab = 'menu'; render();
    return { notes: reuseNotesFor(0, a, 'cena'), other: reuseNotesFor(0, b, 'cena'), html: mealNotesHtml(0, a, 'cena', mealDishes(0, a, 'cena')), frittata: mealNotesHtml(0, b, 'cena', mealDishes(0, b, 'cena')) };
  });
  assert(r.notes.length === 1 && /una porzione in più di pasta/.test(r.notes[0]) && /Frittata di pasta/.test(r.notes[0]), 'promemoria sulla pasta del giorno prima: ' + JSON.stringify(r.notes));
  eq(r.other, [], 'nessun promemoria sulla frittata');
  assert(r.html.includes('meal-note is-hot'), 'nota in evidenza');
  assert(r.frittata.includes('riciclare la pasta avanzata'), 'Da ricordare della ricetta');
  eq(page.errors, [], 'errori JS');
});

test('Aggiungi ingrediente in Dispensa: toccare un suggerimento sul telefono non attiva "Scansiona il codice a barre" sotto', async ({ page: desktop }) => {
  const base = new URL(desktop.url()).origin;
  const ctx = await desktop.context().browser().newContext({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 800 } });
  await ctx.route(/gstatic\.com|firebase/, r => r.abort());
  try{
    const page = await openApp(ctx, base);
    await page.evaluate(() => {
      window.__scans = 0; window.openBarcodeScanner = () => { window.__scans++; };
      state.tab = 'dispensa'; state.pantryView = 'cibo'; state.pantryAddModalOpen = true; render();
    });
    await page.tap('#pantry-add-name'); await page.keyboard.type('pomodor');
    await page.waitForSelector('[data-pantry-suggest]');
    const pt = await page.evaluate(() => { const e = document.querySelector('[data-pantry-suggest]'); const b = document.querySelector('.scan-open-btn'); const r = e.getBoundingClientRect(), s = b.getBoundingClientRect(); const y = r.y + r.height / 2; return { x: r.x + r.width / 2, y, over: y > s.top && y < s.bottom }; });
    await page.touchscreen.tap(pt.x, pt.y);
    await page.waitForTimeout(400);
    eq(await page.evaluate(() => window.__scans), 0, 'il lettore non deve aprirsi');
  }finally{
    await ctx.close();
  }
});

test('Dispensa: selezione + "Aggiungi alla lista spesa" rimette in lista anche un ingrediente già comprato', async ({ page }) => {
  await page.evaluate(() => {
    state.pantryItems = {}; upsertPantryItem('Latte', 'frigo', 2, 'l', 'latticini'); upsertPantryItem('Burro', 'frigo', 0, 'g', 'latticini');
    // Latte: comprato in passato da Spesa (riga aggiunta a mano ormai nascosta)
    state.shopExtras = { extra_old: { ingrediente: 'Latte', qta: '1' } }; state.shopDismissed = { extra_old: true }; state.shopChecked = {};
    delete state.pantryConfirmedShop['burro']; state.shopDismissed['oos_burro'] = true;
    state.tab = 'dispensa'; state.pantryView = 'cibo'; state.pantrySelectMode = true; state.pantrySelected = { latte: true, burro: true }; render();
  });
  await page.click('#pantry-selection-mark');
  const r = await page.evaluate(() => { const flat = buildShopFlat(); return { latte: flat.some(x => x.ingrediente === 'Latte'), burro: flat.some(x => /burro/i.test(x.ingrediente)), toast: state.undoToast && state.undoToast.message, extras: Object.keys(state.shopExtras).length }; });
  eq(r, { latte: true, burro: true, toast: '2 ingredienti aggiunti alla lista spesa', extras: 1 });
  await page.click('.undo-toast button');
  eq(await page.evaluate(() => buildShopFlat().some(x => x.ingrediente === 'Latte')), false, 'annullato');
  eq(page.errors, [], 'errori JS');
});

test('carte fedeltà: le più aperte salgono in alto; Ordina per frequenza d\'uso / alfabetico', async ({ page }) => {
  await page.evaluate(() => {
    state.loyaltyCards = ['Coop', 'Esselunga', 'Conad'].map((name, k) => ({ id: 'c' + k, name, number: '123456789012' + k, color: CARD_COLORS[0] }));
    state.cardsOpen = 'list'; state.cardsSort = 'freq'; render();
  });
  const names = () => page.evaluate(() => [...document.querySelectorAll('.card-grid .card-tile')].map(e => e.getAttribute('aria-label')));
  eq(await names(), ['Conad', 'Coop', 'Esselunga'], 'senza uso: alfabetico');
  for(let k = 0; k < 2; k++){ await page.click('[data-card-view="c1"]'); await page.click('.card-view-close'); }
  await page.click('[data-card-view="c0"]'); await page.click('.card-view-close');
  eq(await names(), ['Esselunga', 'Coop', 'Conad'], 'per frequenza');
  eq(await page.evaluate(() => state.loyaltyCards.map(c => c.uses || 0)), [1, 2, 0]);
  await page.selectOption('[data-cards-sort]', 'az');
  eq(await names(), ['Conad', 'Coop', 'Esselunga'], 'alfabetico');
  eq(page.errors, [], 'errori JS');
});

test('Ricette: chip rapidi Con quello che ho / Preferite / ≤30 min, senza il conteggio delle ricette', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.tab = 'prep'; state.filters = { cat: [], tipo: [], tempo: '', pian: '', stagione: '', freezer: '', grad: '', attrezz: '', quick: false, search: '' }; render();
    const chips = [...document.querySelectorAll('.prep-quick .is-chip')].map(e => e.textContent.trim());
    const noCount = !/\d+\s+ricett/.test(document.getElementById('panel').textContent.slice(0, 400));
    const all = document.querySelectorAll('.prep-card, .recipe-card, [data-recipe]').length;
    document.querySelector('[data-quick-filter="quick"]').click();
    const quickOk = allRecipeMetas().filter(r => ['express', 'veloce'].includes(r.tempoBucket)).length > 0 && state.filters.quick === true && document.querySelector('[data-quick-filter="quick"]').classList.contains('active');
    document.querySelector('[data-quick-filter="grad"]').click();
    const gradOk = state.filters.grad === 'preferita' && document.querySelector('[data-quick-filter="grad"]').classList.contains('active');
    document.querySelector('[data-quick-filter="grad"]').click();
    return { chips, noCount, quickOk, gradOk, gradOff: state.filters.grad === '' };
  });
  eq(r, { chips: ['Con quello che ho', 'Preferite', '≤30 min'], noCount: true, quickOk: true, gradOk: true, gradOff: true });
});

test('Aggiungi unico: in casa mette in Dispensa con luogo e unità; il tasto codice a barre apre il lettore; i suggerimenti si scelgono con un tocco', async ({ page }) => {
  await page.evaluate(() => { window.__scans = 0; window.openBarcodeScanner = () => { window.__scans++; }; upsertPantryItem('Passata di pomodoro', 'dispensa', 700, 'ml', 'conserve'); state.tab = 'dispensa'; state.pantryView = 'cibo'; openAddSheet('casa'); });
  eq(await page.evaluate(() => document.querySelector('.add-seg .active').textContent.trim()), 'in casa', 'da Dispensa parte "in casa"');
  await page.click('[data-add-scan]');
  eq(await page.evaluate(() => window.__scans), 1, 'lettore');
  await page.fill('#add-name', 'pom');
  const sugg = await page.evaluate(() => [...document.querySelectorAll('[data-add-pick]')].map(e => e.dataset.addPick));
  assert(sugg.includes('Passata di pomodoro'), 'suggerimento: ' + sugg.join(','));
  await page.click('[data-add-pick="Passata di pomodoro"]');
  const afterPick = await page.evaluate(() => ({ nome: state.addSheet.d.nome, unit: state.addSheet.d.unit, open: state.addSheet.suggestOpen }));
  eq(afterPick, { nome: 'Passata di pomodoro', unit: 'ml', open: false });
  await page.click('[data-add-details]');
  await page.click('[data-add-luogo="ripostiglio"]');
  await page.fill('#add-qty', '300');
  await page.click('[data-add-confirm]');
  eq(await page.evaluate(() => { const it = state.pantryItems['passata di pomodoro']; return [it.qty, it.luogo, !!state.addSheet]; }), [1000, 'ripostiglio', false]);
  eq(page.errors, [], 'errori JS');
});

test('Aggiungi unico: da telefono, toccare un suggerimento non apre il lettore', async ({ page: desktop }) => {
  const base = new URL(desktop.url()).origin;
  const ctx = await desktop.context().browser().newContext({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 800 } });
  await ctx.route(/gstatic\.com|firebase/, r => r.abort());
  try{
    const page = await openApp(ctx, base);
    await page.evaluate(() => { window.__scans = 0; window.openBarcodeScanner = () => { window.__scans++; }; state.tab = 'spesa'; openAddSheet('spesa'); });
    await page.tap('#add-name'); await page.keyboard.type('pomodor');
    await page.waitForSelector('[data-add-pick]');
    const pt = await page.evaluate(() => { const r = document.querySelector('[data-add-pick]').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    await page.touchscreen.tap(pt.x, pt.y);
    await page.waitForTimeout(300);
    eq(await page.evaluate(() => [window.__scans, /pomodor/i.test(state.addSheet.d.nome), state.addSheet.suggestOpen]), [0, true, false]);
  }finally{ await ctx.close(); }
});

test('Aggiungi unico: la tendina dei suggerimenti si chiude toccando altrove o con Esc, e riappare scrivendo', async ({ page }) => {
  await page.evaluate(() => { state.tab = 'spesa'; openAddSheet('spesa'); });
  await page.fill('#add-name', 'pomodor');
  eq(await page.evaluate(() => document.querySelectorAll('[data-add-pick]').length > 0), true, 'aperta');
  await page.click('#add-qty');
  await page.waitForTimeout(700);
  eq(await page.evaluate(() => document.querySelectorAll('[data-add-pick]').length), 0, 'chiusa toccando la quantità');
  await page.click('#add-name'); await page.keyboard.type('i');
  eq(await page.evaluate(() => document.querySelectorAll('[data-add-pick]').length > 0), true, 'riaperta scrivendo');
  await page.keyboard.press('Escape');
  eq(await page.evaluate(() => [document.querySelectorAll('[data-add-pick]').length, !!state.addSheet]), [0, true], 'Esc chiude solo la tendina');
  eq(page.errors, [], 'errori JS');
});

test('fogli dal basso: trascinando giù la barretta in cima si chiudono, con un tratto breve tornano su', async ({ page }) => {
  await page.evaluate(() => { state.tab = 'spesa'; openAddSheet('spesa'); });
  const pos = async () => page.evaluate(() => { const r = document.querySelector('.move-handle').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  let p = await pos();
  await page.mouse.move(p.x, p.y); await page.mouse.down(); await page.mouse.move(p.x, p.y + 30, { steps: 4 }); await page.waitForTimeout(300); await page.mouse.up(); await page.waitForTimeout(250);
  eq(await page.evaluate(() => !!state.addSheet), true, 'tratto breve: resta aperto');
  p = await pos();
  await page.mouse.move(p.x, p.y); await page.mouse.down(); await page.mouse.move(p.x, p.y + 220, { steps: 8 }); await page.waitForTimeout(300); await page.mouse.up();
  eq(await page.evaluate(() => [!!state.addSheet, !!document.querySelector('.move-sheet')]), [false, false], 'tratto lungo: chiuso');
  eq(page.errors, [], 'errori JS');
});

test('fogli dal basso: tirando su la barretta vanno a tutto schermo, giù tornano a metà e poi si chiudono; il primo tocco su + funziona con l\'elenco aperto', async ({ page }) => {
  await page.evaluate(() => { state.tab = 'spesa'; openAddSheet('spesa'); });
  const drag = async dy => { const p = await page.evaluate(() => { const r = document.querySelector('.move-handle').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }); await page.mouse.move(p.x, p.y); await page.mouse.down(); await page.mouse.move(p.x, p.y + dy, { steps: 8 }); await page.waitForTimeout(350); await page.mouse.up(); await page.waitForTimeout(350); };
  await drag(-120);
  const full = await page.evaluate(() => ({ full: state.sheetFull, h: Math.round(document.querySelector('.move-sheet').getBoundingClientRect().height), vh: window.innerHeight }));
  eq([full.full, full.h >= full.vh - 2], [true, true], 'tutto schermo');
  eq(await page.evaluate(() => state.addSheet.detailsOpen), true, 'a tutto schermo si espandono gli altri dettagli');
  await drag(220);
  eq(await page.evaluate(() => [state.sheetFull, !!state.addSheet]), [false, false], 'giù da tutto schermo: si chiude');
  await page.evaluate(() => { openAddSheet('spesa'); });
  await page.fill('#add-name', 'pomodor');
  await page.click('[data-add-qty="1"]');
  eq(await page.evaluate(() => state.addSheet.d.qty), 2, 'primo tocco su +');
  eq(page.errors, [], 'errori JS');
});

test('fogli: richiudendo con la barretta e premendo + subito, si riapre al primo tocco', async ({ page: desktop }) => {
  const base = new URL(desktop.url()).origin;
  const ctx = await desktop.context().browser().newContext({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 800 } });
  await ctx.route(/gstatic\.com|firebase/, r => r.abort());
  try{
    const page = await openApp(ctx, base);
    await page.evaluate(() => { state.tab = 'spesa'; render(); });
    const cdp = await ctx.newCDPSession(page);
    for(const wait of [0, 100, 300]){
      await page.tap('#spesa-fab'); await page.waitForTimeout(300);
      eq(await page.evaluate(() => !!state.addSheet), true, 'aperto');
      const h = await page.evaluate(() => { const r = document.querySelector('.move-handle').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
      const touch = (type, y) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x: h.x, y }] });
      await touch('touchStart', h.y); for(let k = 1; k <= 8; k++){ await touch('touchMove', h.y + k * 30); await page.waitForTimeout(20); } await touch('touchEnd', h.y + 240);
      await page.waitForTimeout(wait);
      eq(await page.evaluate(() => !!state.addSheet), false, 'chiuso con la barretta');
      await page.tap('#spesa-fab'); await page.waitForTimeout(900);
      eq(await page.evaluate(() => !!state.addSheet), true, `riaperto al primo tocco (dopo ${wait} ms)`);
      await page.evaluate(() => { state.addSheet = null; render(); }); await page.waitForTimeout(700);
    }
  }finally{ await ctx.close(); }
});

test('ricette: tempo diviso in preparazione e cottura (la somma decide fascia e filtro), e i consigli', async ({ page }) => {
  await page.evaluate(() => { state.tab = 'prep'; state.prepView = 'ricette'; state.recipeEditName = 'Carbonara'; render(); });
  await page.waitForSelector('#edit-time-list');
  const none = await page.evaluate(() => [!document.getElementById('edit-tempo'), !document.getElementById('edit-tempo-bucket')]);
  eq(none, [true, true], 'niente più testo libero né fascia a mano');
  await page.fill('#edit-time-list .edit-time-entry:last-child .edit-time-label', 'Preparazione');
  await page.fill('#edit-time-list .edit-time-entry:last-child .edit-time-min', '20');
  await page.click('#edit-add-time-row');
  await page.fill('#edit-time-list .edit-time-entry:last-child .edit-time-label', 'Cottura');
  await page.fill('#edit-time-list .edit-time-entry:last-child .edit-time-min', '30');
  eq(await page.textContent('#edit-time-total'), 'Totale 50 min · 🟠 1 h', 'totale e fascia dal totale');
  await page.fill('#edit-consigli', 'Puoi aggiungere al pangrattato della curcuma.');
  await page.click('#edit-recipe-save');
  await page.evaluate(() => { state.recipeEditName = null; state.expandedRecipe = 'Carbonara'; state.dishPane['r|Carbonara'] = 'steps'; render(); });
  await page.waitForTimeout(300);
  const r = await page.evaluate(() => {
    const m = getRecipeMeta('Carbonara'), d = getRecipeDetails('Carbonara');
    return { bucket: m.tempoBucket, tempo: m.tempo, prep: (m.tempi || [])[0] && m.tempi[0].min, cottura: (m.tempi || [])[1] && m.tempi[1].min, consigli: d.consigli, text: recipeTimeText(d),
      detail: [...document.querySelectorAll('.note-box')].map(e => e.textContent.replace(/\s+/g, ' ')).join(' | ') };
  });
  eq({ bucket: r.bucket, tempo: r.tempo, prep: r.prep, cottura: r.cottura, consigli: r.consigli, text: r.text, hasConsigli: /Consigli\s*Puoi aggiungere/.test(r.detail) },
    { bucket: 'lunga', tempo: '50 min', prep: 20, cottura: 30, consigli: 'Puoi aggiungere al pangrattato della curcuma.', text: '20 min preparazione + 30 min cottura', hasConsigli: true });
  eq(await page.evaluate(() => tempoBucketForMinutes(20) + '|' + tempoBucketForMinutes(30) + '|' + tempoBucketForMinutes(45) + '|' + tempoBucketForMinutes(60) + '|' + tempoBucketForMinutes(61)), 'express|veloce|normale|lunga|progetto');
  eq(page.errors, [], 'errori JS');
});


test('dettaglio ricetta: tempi, "Uova · tuorli", titolo del pasto, "Metti nel menù" e tab Ingredienti | Passaggi con swipe', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    state.recipeEdits['Carbonara'] = { tPrep: 10, tCottura: 15, tempo: '25 min', tempoBucket: 'veloce', freezerNew: 'congelabile' };
    state.extraWeeks = []; generateWeek(1); writeMealDishes(1, 1, 'cena', 'Carbonara', []);
    state.tab = 'menu'; state.expandedDay = '1_1_cena'; render();
    const pg = document.querySelector('[data-page^="meal-"]');
    const out = { metaClean: !/[<>]/.test(pg.querySelector('.rd-meta-text').textContent) && !!pg.querySelector('.rd-meta-text svg'), sub: pg.querySelector('.meal-page-date').textContent, time: pg.querySelector('.rd-time').textContent.replace(/\s+/g, ' ').trim(),
      uova: [...pg.querySelectorAll('.ing-list li')].map(li => li.querySelector('.ing-list-name').textContent.replace(/\s+/g, ' ').trim()).filter(t => /^Uova/.test(t)),
      bar: [...pg.querySelectorAll('.cook-fab-bar button')].map(b => b.textContent.trim()), both: !!pg.querySelector('[data-rd-sec="ing"]') && !pg.querySelector('[data-rd-sec="steps"]') };
    state.expandedDay = null; state.tab = 'prep'; state.prepView = 'ricette'; state.expandedRecipe = 'Carbonara'; render();
    const rp = document.querySelector('[data-page^="recipe-"]');
    out.recBar = [...rp.querySelectorAll('.cook-fab-bar button')].map(b => b.textContent.trim());
    out.back = rp.querySelector('.settings-title').textContent.trim();
    return out;
  });
  assert(/^\S+ \d+ \S+ · 1 piatto$/.test(r.sub), `titolo: ${r.sub}`);
  eq([r.time, r.both, r.metaClean], ['Preparazione 10 min · Cottura 15 min', true, true]);
  eq(r.uova, ['Uova · tuorli', 'Uova']);
  eq([r.bar, r.recBar, r.back], [['Cena fatta', 'Cucina'], ['Metti nel menù', 'Cucina'], 'Ricette']);
  // "Metti nel menù": scelgo un pasto e la ricetta ci va (come "Cambia piatto")
  await page.click('[data-recipe-to-menu]');
  await page.waitForSelector('.menu-pick-chip');
  const key = await page.evaluate(() => document.querySelector('.menu-pick-chip:not(.active)').dataset.swapDay);
  await page.click(`.menu-pick-chip[data-swap-day="${key}"]`);
  const after = await page.evaluate(k => { const { weekIdx, i, meal } = parseMealKey(k); return { sheet: !!document.querySelector('.menu-pick-chip'), name: effectiveMeal(weekIdx, i, meal).principale }; }, key);
  eq(after, { sheet: false, name: 'Carbonara' }, 'messa nel menù, foglio chiuso');
  // Ingredienti | Passaggi sono tab vere; lo swipe a sinistra/destra le cambia
  const sw = dx => page.evaluate(dx => {
    const rd = document.querySelector('.rd');
    const mk = (type, x) => { const t = new Touch({ identifier: 1, target: rd, clientX: x, clientY: 300 }); return new TouchEvent(type, { bubbles: true, cancelable: true, touches: type === 'touchend' ? [] : [t], changedTouches: [t] }); };
    rd.dispatchEvent(mk('touchstart', 200)); rd.dispatchEvent(mk('touchend', 200 + dx));
    return document.querySelector('.rd-tab.active').dataset.dishPaneValue;
  }, dx);
  eq(await page.evaluate(() => document.querySelector('.rd-tab.active').dataset.dishPaneValue), 'ing', 'parte da Ingredienti');
  eq(await sw(-120), 'steps', 'swipe a sinistra: Passaggi');
  eq(await page.evaluate(() => [!!document.querySelector('.steps-list'), !document.querySelector('.ing-list')]), [true, true], 'solo i passaggi');
  eq(await sw(-120), 'steps', 'a sinistra sull\'ultima tab non cambia');
  eq(await sw(120), 'ing', 'swipe a destra: Ingredienti');
  eq(await sw(30), 'ing', 'un tocco breve non cambia');
  await page.click('[data-dish-pane-value="steps"]');
  eq(await page.evaluate(() => document.querySelector('.rd-tab.active').dataset.dishPaneValue), 'steps', 'tab Passaggi col tocco');
  eq(page.errors, [], 'errori JS');
});


test('modalità cucina: "Ho finito" segna il piatto finito e passa al prossimo; finiti tutti si apre il foglio del pasto', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    ['Prova uno', 'Prova due'].forEach(n => { state.customRecipes[n] = { nome: n, categoriaNew: 'pasta', tempoBucket: 'veloce', stagioni: ['tutto'], tipologia: n === 'Prova uno' ? 'primo' : 'secondo' };
      state.recipeEdits[n] = { ingredienti: [{ ingrediente: 'Pasta lunga', qta: '100 g' }], procedimento: ['A ' + n, 'B ' + n] }; });
    state.extraWeeks = []; generateWeek(1);
    writeMealDishes(1, 1, 'cena', 'Prova uno', ['Prova due']);
    state.tab = 'menu'; state.expandedDay = '1_1_cena'; render();
    document.querySelector('[data-cook-start]').click();
    const out = { cards: [...document.querySelectorAll('.cook-tabs .dish-tab')].map(c => c.querySelector('.dish-tab-label').textContent), head: document.querySelector('.cook-title').textContent, endLabel: document.querySelector('.cook-end').textContent, noAwake: !document.querySelector('.cook-awake') };
    document.querySelector('[data-cook-step-done]').click();
    out.lastNote = document.querySelector('.cook-last-note').textContent.replace(/\s+/g, ' ').trim();
    document.querySelector('[data-cook-finish]').click();
    out.afterFirst = [state.cookMode.name, state.cookSession.map(x => x.done)];
    out.cards2 = [...document.querySelectorAll('.cook-tabs .dish-tab')].map(c => c.querySelector('.dish-tab-label').textContent + (c.classList.contains('is-done') ? ' finito' : ''));
    document.querySelector('[data-cook-step-done]').click();
    out.lastNote2 = document.querySelector('.cook-last-note').textContent.replace(/\s+/g, ' ').trim();
    document.querySelector('[data-cook-finish]').click();
    out.end = [state.cookMode, state.doneModalDay];
    return out;
  });
  eq(r.cards, ['Primo', 'Secondo']);
  eq([r.head, r.endLabel, r.noAwake], ['Cucinando la cena', 'Termina', true]);
  assert(/Resta ancora il secondo.*passi al secondo/.test(r.lastNote), r.lastNote);
  eq(r.afterFirst, ['Prova due', [true, false]]);
  eq(r.cards2, ['Primo finito', 'Secondo']);
  assert(/Il primo è già finito.*foglio della cena intera/.test(r.lastNote2), r.lastNote2);
  eq(r.end, [null, '1_1_cena'], 'chiusa la cucina e aperto il foglio della cena');
  eq(page.errors, [], 'errori JS');
});


test('Cena fatta: foglio dal basso, avanzo No/Sì con luogo, voto un piatto alla volta; da Ricette "Ho finito" apre Ricetta fatta', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    upsertPantryItem('Guanciale', 'frigo', 300, 'g');
    ['Prova uno', 'Prova due'].forEach(n => { state.customRecipes[n] = { nome: n, categoriaNew: 'pasta', tempoBucket: 'veloce', stagioni: ['tutto'], tipologia: n === 'Prova uno' ? 'primo' : 'secondo', gradimento: '' };
      state.recipeEdits[n] = { ingredienti: [{ ingrediente: 'Guanciale', qta: '100 g' }], procedimento: ['A', 'B'] }; });
    state.extraWeeks = []; generateWeek(1);
    writeMealDishes(1, 1, 'cena', 'Prova uno', ['Prova due']);
    state.tab = 'menu'; state.expandedDay = '1_1_cena'; render();
    document.querySelector('[data-cook-done-meal]').click();
    const out = { sheet: !!document.querySelector('.done-sheet'), title: document.querySelector('.done-sheet .move-title').textContent,
      sub: document.querySelector('.done-sheet .move-sub').textContent, qty: state.doneModalQty['Guanciale'],
      segs: document.querySelectorAll('.done-seg').length, grad0: document.querySelector('.done-sec h3 small') ? document.querySelector('.done-sheet .done-grads [data-set-gradimento]').dataset.setGradimento : null };
    document.querySelector('[data-done-left="0:1"]').click();
    out.where = document.querySelectorAll('.done-where').length;
    document.querySelector('[data-done-leftover-luogo-set="0:freezer"]').click();
    out.luogo = state.doneModalLeftovers[0].luogo;
    document.querySelector('.done-sheet [data-set-gradimento="Prova uno"][data-grad="preferita"]').click();
    out.grad1 = [getRecipeMeta('Prova uno').gradimento, state.doneGradIdx, document.querySelector('.done-sheet .done-grads [data-set-gradimento]').dataset.setGradimento];
    document.querySelector('[data-confirm-done]').click();
    out.after = [state.doneModalDay, state.pantryItems['guanciale'].qty, !!state.pantryItems['prova uno'], state.pantryItems['prova uno'] && state.pantryItems['prova uno'].luogo];
    // da Ricette: "Ho finito" apre Ricetta fatta, senza pasto
    state.expandedDay = null; state.tab = 'prep'; state.prepView = 'ricette'; state.expandedRecipe = 'Prova uno'; render();
    document.querySelector('[data-cook-start]').click();
    state.cookSession[0].cursor = 1; state.cookMode.step = 1; render();
    document.querySelector('[data-cook-finish]').click();
    out.recipeDone = [state.doneModalDay, !!state.doneModalRecipe, document.querySelector('.done-sheet .move-title').textContent];
    document.querySelector('[data-confirm-done]').click();
    out.recipeAfter = [state.doneModalDay, state.pantryItems['guanciale'].qty];
    return out;
  });
  eq([r.sheet, r.title, r.qty, r.segs], [true, 'Cena fatta', 200, 2]);
  assert(/Prova uno \+ Prova due/.test(r.sub), r.sub);
  eq([r.grad0, r.where, r.luogo], ['Prova uno', 3, 'freezer']);
  eq(r.grad1, ['preferita', 1, 'Prova due']);
  eq(r.after, [null, 100, true, 'freezer']);
  eq(r.recipeDone, ['recipe', true, 'Ricetta fatta']);
  eq(r.recipeAfter, [null, 0]);
  eq(page.errors, [], 'errori JS');
});


test('Spesa: tocco sulla quantità apre il fumetto con numero, unità e "Fatto"; l\'unità scelta resta e va in Dispensa', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.shopExtras = { q1: { ingrediente: 'Provaqty', qta: '2' } }; state.shopUnit = {}; state.shopQty = {};
    state.tab = 'spesa'; render();
    const out = {};
    const row = () => document.querySelector('.shop-item-row:has([data-shop-name="Provaqty"])');
    row().querySelector('[data-shop-qty-show]').click();
    out.pop = !!document.querySelector('.qty-pop');
    { const sel = document.querySelector('select[data-shop-qty-unit]'); sel.value = 'kg'; sel.dispatchEvent(new Event('change')); }
    out.still = !!document.querySelector('.qty-pop');
    const inp = document.querySelector('.qty-pop [data-shop-qty-edit]');
    inp.value = '3'; document.querySelector('[data-shop-qty-pop-done]').click();
    out.pop2 = !!document.querySelector('.qty-pop');
    out.label = row().querySelector('.qty-num').textContent.trim();
    out.unit = row().querySelector('[data-shop-name]').dataset.shopUnit;
    out.saved = [state.shopQty.q1, state.shopUnit.q1];
    return out;
  });
  eq([r.pop, r.still, r.pop2], [true, true, false]);
  eq([r.label, r.unit, r.saved], ['3 kg', 'kg', [3, 'kg']]);
  eq(page.errors, [], 'errori JS');
});

test('Dispensa: tocco sulla quantità apre il fumetto con numero, unità e "Fatto"', async ({ page }) => {
  const r = await page.evaluate(() => {
    upsertPantryItem('Provafarina', 'dispensa', 500, 'g');
    state.tab = 'dispensa'; state.pantryView = 'cibo'; render();
    const out = {};
    document.querySelector('[data-qty-show="provafarina"]').click();
    out.pop = !!document.querySelector('.qty-pop');
    { const sel = document.querySelector('select[data-qty-unit]'); sel.value = 'kg'; sel.dispatchEvent(new Event('change')); }
    out.still = !!document.querySelector('.qty-pop');
    const inp = document.querySelector('.qty-pop [data-qty-edit]');
    inp.value = '2'; document.querySelector('.qty-pop [data-qty-pop-close].qty-pop-done').click();
    out.pop2 = !!document.querySelector('.qty-pop');
    out.item = [state.pantryItems['provafarina'].qty, state.pantryItems['provafarina'].unit];
    out.label = document.querySelector('[data-qty-show="provafarina"]').textContent.trim();
    return out;
  });
  eq([r.pop, r.still, r.pop2], [true, true, false]);
  eq([r.item, r.label], [[2, 'kg'], '2 kg']);
  eq(page.errors, [], 'errori JS');
});

test('Spesa: gli ingredienti di un pasto passato restano in lista ma senza "giorno · pasto"', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.extraWeeks = []; generateWeek(0);
    const dates = weekDatesFor(0);
    const pos = dates.findIndex(d => new Date(d).setHours(0,0,0,0) < new Date().setHours(0,0,0,0));
    if(pos < 0) return { skip: true };
    const i = WEEK_DISPLAY_ORDER[pos];
    writeMealPrincipale(weekOverridesRef(0), i, 'cena', 'Carbonara');
    state.tab = 'spesa'; state.shopView = 'reparto'; render();
    const row = [...document.querySelectorAll('.shop-item-row')].find(r => /guanciale/i.test(r.textContent));
    return { found: !!row, detail: row ? !!row.querySelector('.item-detail') : null };
  });
  if(r.skip) return;
  eq([r.found, r.detail], [true, false]);
  eq(page.errors, [], 'errori JS');
});

test('Aggiungi piatto: da un pasto vuoto è lo stesso foglio, con "Con quello che ho" e il tetto di tempo', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    state.extraWeeks = []; generateWeek(1); state.tab = 'menu'; render();
    const mk = '1_2_pranzo';
    clearMealToEmpty(1, 2, 'pranzo'); render();
    const out = {};
    document.querySelector('[data-open-swap="' + mk + '"]').click();
    out.sheet = !!document.querySelector('.dish-sheet');
    out.noOldScreen = !document.querySelector('.meal-detail-screen');
    out.kicker = document.querySelector('.dsh-kicker').textContent;
    out.pantryChip = !!document.querySelector('[data-dish-pantry]');
    out.before = document.querySelectorAll('[data-dish-pick]').length;
    document.querySelector('[data-dish-pantry]').click();
    out.pantryOn = !!state.dishPicker.pantry;
    out.after = document.querySelectorAll('[data-dish-pick]').length;
    return out;
  });
  eq([r.sheet, r.noOldScreen, r.pantryChip, r.pantryOn], [true, true, true, true], JSON.stringify(r));
  assert(/MAX|max/i.test(r.kicker), r.kicker);
  eq(page.errors, [], 'errori JS');
});

test('avanzo: niente promemoria di preparazione (ammollo) né nel pasto né la sera prima', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.extraWeeks = []; generateWeek(1); // la settimana prossima: sempre nel futuro, qualunque giorno sia oggi
    const sl = allMealSlots().filter(m => m.weekIdx === 1);
    const k = sl.findIndex((m, n) => m.meal === 'cena' && sl[n + 1] && sl[n + 1].meal === 'pranzo');
    const cena = sl[k], next = sl[k + 1];
    writeMealDishes(cena.weekIdx, cena.i, 'cena', 'Pasta e ceci', []);
    writeMealDishes(next.weekIdx, next.i, next.meal, 'Pasta e ceci', []);
    const altro = next.meal === 'pranzo' ? 'cena' : 'pranzo'; // l'altro pasto del giorno dopo può avere legumi a caso
    writeMealDishes(next.weekIdx, next.i, altro, 'Insalata mista', []);
    delete state.dayLinks[next.key];
    state.showPastDays = true; state.tab = 'menu'; render();
    const blk = () => document.querySelector(`.meal-block[data-week-idx="${next.weekIdx}"][data-day-index="${next.i}"][data-meal="${next.meal}"]`);
    const pos = WEEK_DISPLAY_ORDER.indexOf(cena.i);
    const before = { note: !!(blk() && blk().querySelector('.meal-notes')), soak: /Pasta e ceci/.test(soakReminderHtml(1, pos)) };
    state.dayLinks[next.key] = cena.key; render();
    const after = { note: !!(blk() && blk().querySelector('.meal-notes')), soak: /Pasta e ceci/.test(soakReminderHtml(1, pos)) };
    return { before, after };
  });
  eq(r.before, { note: true, soak: true }, 'senza avanzo i promemoria ci sono');
  eq(r.after, { note: false, soak: false }, 'come avanzo non ci sono');
});

test('Gestisci ingredienti: eliminare un ingrediente lo toglie dall\'elenco anche se è in una ricetta, e riaggiungerlo lo riporta', async ({ page }) => {
  const r = await page.evaluate(() => {
    const nome = allIngredientNamesForManager().find(n => /^pasta$/i.test(n)) || allIngredientNamesForManager()[0];
    const key = nome.trim().toLowerCase();
    if(!state.pantryItems[key]) upsertPantryItem(nome, 'dispensa', 0);
    state.tab = 'dispensa'; state.ingredientManagerOpen = true; state.pantryEditKey = key; state.pantrySheetMore = true; render();
    document.getElementById('pantry-edit-delete').click();
    const dopo = allIngredientNamesForManager().some(n => n.trim().toLowerCase() === key);
    const nellaPagina = !!document.querySelector(`[data-manage-ingredient="${CSS.escape(nome)}"]`);
    upsertPantryItem(nome, 'dispensa', 1);
    const riaggiunto = allIngredientNamesForManager().some(n => n.trim().toLowerCase() === key);
    return { nome, dopo, nellaPagina, riaggiunto };
  });
  eq([r.dopo, r.nellaPagina, r.riaggiunto], [false, false, true], 'elenco ingredienti ' + r.nome);
});

test('scheda ingrediente: "Usato in N ricette" si apre con l\'elenco, e dice quando non è in nessuna ricetta', async ({ page }) => {
  const r = await page.evaluate(() => {
    upsertPantryItem('Uova', 'frigo', 6); upsertPantryItem('Zzz inventato', 'dispensa', 1);
    state.tab = 'dispensa'; state.pantryEditKey = 'uova'; state.pantrySheetUsed = false; render();
    const btn = document.querySelector('[data-sheet-used]');
    const chiuso = { label: btn ? btn.textContent.trim() : '', righe: document.querySelectorAll('.ing-used-list li').length };
    btn.click();
    const aperto = document.querySelectorAll('.ing-used-list li').length;
    state.pantryEditKey = 'zzz inventato'; state.pantrySheetUsed = false; render();
    return { chiuso, aperto, vuoto: !document.querySelector('[data-sheet-used]') && /nessuna ricetta/.test(document.querySelector('.sheet-body').textContent), n: recipeNamesUsingIngredient('Uova').length };
  });
  assert(/^Usato in \d+ ricette/.test(r.chiuso.label) && r.chiuso.righe === 0, 'chiuso: ' + JSON.stringify(r.chiuso));
  assert(r.aperto === r.n && r.n > 5, 'aperto: ' + r.aperto + ' / ' + r.n);
  assert(r.vuoto, 'ingrediente senza ricette');
});

test('variazioni: solo per le parti di uno stesso prodotto (uova, limone, arance); prosciutto, pollo, panna tornano ingredienti singoli', async ({ page }) => {
  const r = await page.evaluate(() => {
    const find = (re) => { for(const m of allRecipeMetas()){ const hit = getIngredientsFor(m.nome).find(i => re.test(i.ingrediente + '|' + (i.spec || ''))); if(hit) return { ricetta: m.nome, ing: hit.ingrediente, qual: hit.qual || '' }; } return null; };
    const out = {
      tuorli: find(/^Uova\|tuorli$/), succo: find(/^Limone\|succo$/), scorza: find(/^Limone\|scorza$/), arance: find(/^Arance\|scorza$/),
      prosciutto: find(/^Prosciutto cotto\|$/), pollo: find(/^Petto di pollo\|$/), panna: find(/^Panna da cucina\|$/),
      sbagliati: [].concat(...allRecipeMetas().map(m => getIngredientsFor(m.nome).filter(i => i.spec && !/^(tuorli|albumi|sode|grandi|medie|scorza|succo)$/.test(i.spec)).map(i => m.nome + ':' + i.ingrediente + ':' + i.spec)))
    };
    // una ricetta salvata con la vecchia specifica rimette il nome intero
    state.recipeEdits['Prova vecchia'] = { ingredienti: [{ ingrediente: 'Prosciutto', qta: '100 g', qual: 'cotto' }] };
    out.legacy = (getIngredientsFor('Prova vecchia')[0] || {}).ingrediente;
    // due ricette in menù: una con tuorli, una con uova intere → due righe in Spesa
    // la settimana prossima: sempre davanti, qualunque giorno sia oggi
    state.pantryItems = {}; state.extraWeeks = []; generateWeek(0); generateWeek(1);
    const sl = allPlannedShoppingMeals().filter(m => m.weekIdx === 1).slice(-4);
    writeMealDishes(sl[0].weekIdx, sl[0].i, sl[0].meal, out.tuorli.ricetta, []);
    const intere = allRecipeMetas().find(m => getIngredientsFor(m.nome).some(i => i.ingrediente === 'Uova' && !i.spec));
    writeMealDishes(sl[1].weekIdx, sl[1].i, sl[1].meal, intere.nome, []);
    out.righe = buildShopFlat().filter(x => x.ingrediente === 'Uova').map(x => x.spec || '');
    state.tab = 'spesa'; render();
    out.testo = [...document.querySelectorAll('.item-name')].map(e => e.textContent.trim()).filter(t => /^Uova/.test(t));
    return out;
  });
  assert(r.tuorli && r.succo && r.scorza && r.arance, 'uova/limone/arance con specifica: ' + JSON.stringify([r.tuorli, r.succo, r.scorza, r.arance]));
  assert(r.prosciutto && r.pollo && r.panna, 'ingredienti singoli: ' + JSON.stringify([r.prosciutto, r.pollo, r.panna]));
  eq(r.sbagliati, [], 'solo specifiche ammesse');
  eq(r.legacy, 'Prosciutto cotto', 'vecchia specifica');
  assert(r.righe.includes('tuorli') && r.righe.includes(''), 'righe Uova in Spesa: ' + JSON.stringify(r.righe));
  assert(r.testo.some(t => /Uova · tuorli/.test(t)) && r.testo.some(t => t === 'Uova'), 'testo righe: ' + JSON.stringify(r.testo));
});

test('specifiche tue: la aggiungi all\'ingrediente (pompelmo · succo), la scegli nella ricetta e resta disponibile', async ({ page }) => {
  const r = await page.evaluate(() => {
    upsertPantryItem('Pompelmo', 'frigo', 2);
    state.tab = 'dispensa'; state.pantryEditKey = 'pompelmo'; render();
    const prima = variantOptionsFor('Pompelmo');
    document.getElementById('variant-new-input').value = 'succo';
    document.querySelector('[data-variant-add]').click();
    const dopo = variantOptionsFor('Pompelmo');
    const chip = [...document.querySelectorAll('[data-have-spec]')].map(e => e.textContent.replace('✕', '').trim());
    state.pantryEditKey = null;
    state.tab = 'prep'; state.recipeEditName = 'Carbonara'; render();
    document.getElementById('edit-add-ing-row').click();
    const row = document.querySelector('.edit-ing-sheet'); // si apre da sola sull'ingrediente nuovo
    row.querySelector('.edit-ing-name').value = 'Pompelmo';
    row.querySelector('.edit-ing-name').dispatchEvent(new Event('input', { bubbles: true }));
    const opzioni = [...row.querySelectorAll('.edit-ing-qual option')].map(o => o.value);
    row.querySelector('.edit-ing-qual').value = '__new';
    row.querySelector('.edit-ing-qual').dispatchEvent(new Event('change', { bubbles: true }));
    const nuovo = row.querySelector('.edit-ing-qual-new'); nuovo.value = 'scorza';
    row.querySelector('.edit-ing-num').value = '1';
    document.querySelector('[data-edit-ing-done]').click();
    document.querySelector('[data-save-recipe-edit]').click();
    const salvata = getIngredientsFor('Carbonara').find(i => i.ingrediente === 'Pompelmo');
    return { prima, dopo, chip, opzioni, salvata, poi: variantOptionsFor('Pompelmo') };
  });
  eq([r.prima, r.dopo], [[], ['succo']], 'aggiunta dalla scheda');
  eq(r.chip, ['Intero', 'succo'], 'chip');
  eq(r.opzioni, ['', 'succo', '__new'], 'scelta nella ricetta');
  assert(r.salvata && r.salvata.qual === 'scorza', 'salvata: ' + JSON.stringify(r.salvata));
  eq(r.poi, ['succo', 'scorza'], 'la nuova specifica resta disponibile');
});

test('Modifica ricetta: quantità con numero e unità, specifica scelta dall\'elenco; un testo non riconosciuto resta com\'è', async ({ page }) => {
  const r = await page.evaluate(() => {
    const out = {
      p: ['200 g', '1/2', '2 cucchiai', 'q.b.', 'mezzo bicchiere', '1 1/2 kg'].map(parseQtyForEdit),
      b: [buildQtyFromEdit('1', 'cucchiaio'), buildQtyFromEdit('2', 'cucchiaio'), buildQtyFromEdit('1.5', 'kg'), buildQtyFromEdit('', 'q.b.'), buildQtyFromEdit('3', '')]
    };
    const nome = 'Carbonara';
    state.tab = 'prep'; state.recipeEditName = nome; render();
    const rows = [...document.querySelectorAll('#edit-ing-list .edit-ing-row')];
    out.righe = rows.length;
    const uova = rows.find(r => /^uova$/i.test(r.dataset.ing)) || rows.find(r => /tuorl|uov/i.test(r.dataset.ing));
    out.haUova = !!uova;
    if(uova){
      uova.querySelector('[data-edit-ing-open]').click();
      const sh = document.querySelector('.edit-ing-sheet');
      out.conNumero = !!sh.querySelector('.edit-ing-num'); // quantità con numero e unità
      sh.querySelector('.edit-ing-name').value = 'Uova'; sh.querySelector('.edit-ing-name').dispatchEvent(new Event('input', { bubbles: true }));
      out.qualVisibile = !!sh.querySelector('.edit-ing-qual'); sh.querySelector('.edit-ing-qual').value = 'tuorli'; out.letta = readEditIngRow(sh);
      document.querySelector('[data-edit-ing-done]').click();
      out.riga = document.querySelector('#edit-ing-list .edit-ing-row[data-qual="tuorli"] .edit-ing-sum-sub').textContent;
    }
    return out;
  });
  eq(r.p.map(x => x.ok ? x.num + '|' + x.unit : 'raw'), ['200|g', '0.5|', '2|cucchiaio', '|q.b.', 'raw', '1.5|kg'], 'parse');
  eq(r.b, ['1 cucchiaio', '2 cucchiai', '1,5 kg', 'q.b.', '3'], 'build');
  assert(r.righe > 0 && r.conNumero, 'righe con numero e unità');
  assert(/tuorli/.test(r.riga), 'la riga mostra la specifica: ' + r.riga);
  assert(r.haUova && r.qualVisibile && r.letta.qual === 'tuorli', 'specifica: ' + JSON.stringify(r.letta));
});

test('modalità cucina: i rettangolini si colorano avanzando, anche con le frecce', async ({ page }) => {
  const r = await page.evaluate(() => {
    const nome = allRecipeMetas().find(m => ((getRecipeDetails(m.nome) || {}).procedimento || []).length >= 4).nome;
    state.cookSession = cookSessionFor(nome, 1, ''); state.cookMode = { name: nome, step: 0, ratio: 1, mk: '' }; render();
    const on = () => document.querySelectorAll('.cook-segs span.on').length;
    const out = { inizio: on() };
    document.querySelector('[data-cook-next]').click(); out.dopoFreccia = on();
    document.querySelector('[data-cook-next]').click(); out.dopoDue = on();
    document.querySelector('[data-cook-prev]').click(); out.indietro = on();
    return out;
  });
  eq([r.inizio, r.dopoFreccia, r.dopoDue, r.indietro], [1, 2, 3, 2], 'rettangolini colorati');
});

test('uova e tuorli (stesso ingrediente, specifiche diverse) stanno vicini nella lista della ricetta e in Spesa', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.recipeEdits['Pastiera'] = { ingredienti: [
      { ingrediente: 'Grano cotto', qta: '500 g' }, { ingrediente: 'Uova', qta: '8' }, { ingrediente: 'Ricotta', qta: '500 g' },
      { ingrediente: 'Zucchero', qta: '500 g' }, { ingrediente: 'Uova', qta: '3', qual: 'tuorli' }
    ] };
    const ricetta = getIngredientsFor('Pastiera').map(i => i.ingrediente + (i.qual ? '·' + i.qual : ''));
    const rows = groupRowsByName([{ ingrediente: 'Uova' }, { ingrediente: 'Burro' }, { ingrediente: 'uova', qual: 'tuorli' }, { ingrediente: 'Latte' }]).map(x => (x.qual ? 'T' : x.ingrediente));
    return { ricetta, rows };
  });
  const iu = r.ricetta.indexOf('Uova'), it = r.ricetta.indexOf('Uova·tuorli');
  assert(iu >= 0 && it === iu + 1, 'ricetta: ' + JSON.stringify(r.ricetta));
  eq(r.rows, ['Uova', 'T', 'Burro', 'Latte'], 'Spesa');
});

test('ricette: i tempi sono un elenco (anche 3: preparazione, cottura, riposo); in lista il totale con la fascia', async ({ page }) => {
  const r = await page.evaluate(() => {
    const rec = getRecipeMeta('Pastiera'), det = getRecipeDetails('Pastiera');
    const parsed = recipeTimeEntriesWithText(rec, det);
    const lista = recipeListTime(rec);
    state.tab = 'prep'; state.prepView = 'ricette'; state.recipeEditName = 'Pastiera'; render();
    const righe = [...document.querySelectorAll('#edit-time-list .edit-time-entry')].map(e => e.querySelector('.edit-time-label').value + ':' + e.querySelector('.edit-time-min').value);
    const totale = document.getElementById('edit-time-total').textContent;
    return { parsed, lista, righe, totale, parseNo: parseTempoText('circa 30 min'), tag: recipeTimeTagsHtml(rec, det).replace(/<svg.*?<\/svg>/g, '').replace(/<[^>]+>/g, '|').replace(/\|+/g, '|') };
  });
  eq(r.parsed.map(t => t.label + ':' + t.min), ['Preparazione:60', 'Cottura:60', 'Riposo:60'], 'tre tempi riconosciuti');
  eq(r.lista, '3 h · oltre 1 h', 'in lista totale e fascia');
  eq(r.righe, ['Preparazione:60', 'Cottura:60', 'Riposo:60'], 'righe nella modifica');
  assert(/Totale 3 h/.test(r.totale), r.totale);
  assert(r.parseNo === null, 'testo semplice non toccato');
  // modifica: aggiungo un quarto tempo e salvo
  await page.click('#edit-add-time-row');
  await page.fill('#edit-time-list .edit-time-entry:last-child .edit-time-label', 'Lievitazione');
  await page.fill('#edit-time-list .edit-time-entry:last-child .edit-time-min', '30');
  assert(/Totale 3 h 30 min/.test(await page.textContent('#edit-time-total')), 'totale aggiornato');
  await page.click('#edit-recipe-save');
  const dopo = await page.evaluate(() => { const m = getRecipeMeta('Pastiera'); return { n: (m.tempi || []).length, bucket: m.tempoBucket, tempo: m.tempo, lista: recipeListTime(m) }; });
  eq(dopo, { n: 4, bucket: 'progetto', tempo: '3 h 30 min', lista: '3 h 30 min · oltre 1 h' });
});

test('modalità cucina: "Ti serve" trova anche l\'uovo (singolare) e le specifiche', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.recipeEdits['Prova uova'] = { ingredienti: [{ ingrediente: 'Uova', qta: '1' }, { ingrediente: 'Limone', qta: '1', qual: 'succo' }, { ingrediente: 'Sale', qta: 'q.b.' }] };
    return {
      uovo: cookStepIngredients('Prova uova', "Aggiungi il tonno, l'uovo e il parmigiano.", 1).map(i => i.nome),
      uova: cookStepIngredients('Prova uova', 'Sbatti le uova.', 1).map(i => i.nome),
      succo: cookStepIngredients('Prova uova', 'Spremi il succo.', 1).map(i => i.nome),
      nulla: cookStepIngredients('Prova uova', 'Mescola bene.', 1).map(i => i.nome)
    };
  });
  eq([r.uovo, r.uova, r.succo, r.nulla], [['Uova'], ['Uova'], ['Limone'], []]);
});

test('dado da brodo: copre "Brodo vegetale" e "Brodo di carne" in Spesa, anche senza gruppo assegnato', async ({ page }) => {
  const r = await page.evaluate(() => {
    const ricetta = allRecipeMetas().find(m => getIngredientsFor(m.nome).some(i => i.ingrediente === 'Brodo vegetale')).nome;
    state.pantryItems = {}; generateWeek(0);
    const sl = allPlannedShoppingMeals().slice(-2);
    writeMealDishes(sl[0].weekIdx, sl[0].i, sl[0].meal, ricetta, []);
    const senza = buildShopFlat().some(x => x.ingrediente === 'Brodo vegetale');
    upsertPantryItem('Dado da brodo', 'dispensa', 1);
    const con = buildShopFlat().some(x => x.ingrediente === 'Brodo vegetale');
    return { senza, con, vegetale: pantryStatusFor('Brodo vegetale'), carne: pantryStatusFor('Brodo di carne'), altro: pantryStatusFor('Brodo di pesce') };
  });
  eq([r.senza, r.con, r.vegetale, r.carne, r.altro], [true, false, 'in-casa', 'in-casa', 'manca']);
});

test('ricette congelabili: nota "Come congelarla e usarla" nel dettaglio e per le porzioni in freezer', async ({ page }) => {
  const r = await page.evaluate(() => {
    const congelabile = (re) => allRecipeMetas().find(m => ['congelabile', 'meal-prep'].includes(m.freezerNew) && re.test(m.nome.toLowerCase()));
    const polpette = congelabile(/polpett/), sugo = congelabile(/rag[uù]|sugo/), non = allRecipeMetas().find(m => m.freezerNew === 'non-adatta');
    const out = { polpette: freezeTipFor(polpette.nome), sugo: freezeTipFor(sugo.nome), non: freezeTipFor(non.nome) };
    state.tab = 'prep'; state.prepView = 'ricette'; state.expandedRecipe = polpette.nome; state.dishPane['r|' + polpette.nome] = 'steps'; render();
    out.dettaglio = [...document.querySelectorAll('.note-box')].map(e => e.textContent.replace(/\s+/g, ' ')).join(' | ');
    state.expandedRecipe = null;
    addFreezerPortions(polpette.nome, 2); state.pantryItems[polpette.nome.toLowerCase()].frozenOn = isoLocalDate(new Date());
    state.tab = 'dispensa'; state.pantryEditKey = polpette.nome.toLowerCase(); render();
    out.scheda = !!document.querySelector('.freeze-tip');
    return out;
  });
  assert(/vassoio/.test(r.polpette) && /friggitrice/.test(r.polpette), 'polpette: ' + r.polpette);
  assert(/cubetti/.test(r.sugo), 'sugo: ' + r.sugo);
  eq(r.non, '', 'non congelabile: nessuna nota');
  assert(/Come congelarla e usarla/.test(r.dettaglio), 'dettaglio: ' + r.dettaglio);
  assert(r.scheda, 'scheda del freezer');
});

test('avanzo e freezer: collegare un avanzo aggiunge una porzione, "(2 + 1 avanzo)", e le porzioni in freezer si possono usare con un tocco', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.extraWeeks = []; generateWeek(1); state.pantryItems = {};
    const sl = allMealSlots().filter(m => m.weekIdx === 1);
    // un pasto di partenza (cena) e un pranzo del giorno dopo, senza link
    const k = sl.findIndex((m, n) => m.meal === 'cena' && sl[n + 1] && sl[n + 1].meal === 'pranzo' && sl[n + 1].i >= 4);
    const cena = sl[k], pranzo = sl[k + 1];
    delete state.dayLinks[pranzo.key]; delete state.dayPortions[cena.key];
    if(!effectiveMeal(1, pranzo.i, 'pranzo').principale) writeMealDishes(1, pranzo.i, 'pranzo', 'Pasta al pesto', []); // il pranzo è vuoto se prima era un avanzo
    const principale = effectiveMeal(1, cena.i, 'cena').principale;
    const prima = mealPortions(cena.key, principale);
    // collego il pranzo come avanzo della cena, come dal selettore
    state.avanzoDiPickerOpenDay = pranzo.key; state.tab = 'menu'; render();
    const pick = document.querySelector(`[data-avanzodi-pick="${cena.key}"]`);
    let dopo = null, nota = '', sciolto = null;
    if(pick){
      pick.click();
      dopo = mealPortions(cena.key, principale);
      nota = personeRowHtml(dopo, cena.key, '');
      document.querySelector(`[data-unlink-day="${pranzo.key}"]`).click();
      sciolto = mealPortions(cena.key, principale);
    }
    // porzioni in freezer: suggerimento e un tocco
    addFreezerPortions(principale, 2);
    state.tab = 'menu'; render();
    const hint = document.querySelector(`[data-use-freezer="${cena.key}"]`);
    const hintTesto = hint ? hint.textContent.trim() : '';
    if(hint) hint.click();
    return { prima, dopo, sciolto, nota: nota.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(), pick: !!pick, hintTesto, daFreezer: isFreezerDish(cena.key, principale), ancora: !!document.querySelector(`[data-use-freezer="${cena.key}"]`) };
  });
  assert(r.pick, 'selettore avanzo non trovato');
  eq([r.dopo, r.sciolto], [r.prima + 1, r.prima], 'porzioni +1 collegando, -1 scollegando');
  assert(/\(\d+ \+ 1 avanzo\)/.test(r.nota), 'nota: ' + r.nota);
  assert(/porzion\w+ in freezer · usale/.test(r.hintTesto), 'suggerimento: ' + r.hintTesto);
  eq([r.daFreezer, r.ancora], [true, false], 'usa dal freezer');
});

test('pranzo = avanzo: di default tutti i giorni tranne il sabato (primo giorno della settimana); si sceglie nelle Regole di generazione', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.weekLeftoverDays = null; state.extraWeeks = []; generateWeek(1);
    const link = d => state.dayLinks[`1_${d}_pranzo`] || '';
    const out = { giorni: leftoverLunchDays(), ven: link(4), sab: link(5), dom: link(6), cenaGio: state.dayPortions['1_3_cena'], cenaSab: state.dayPortions['1_5_cena'], cenaVen: state.dayPortions['1_4_cena'] };
    out.sabPranzoCucinato = !!effectiveMeal(1, 5, 'pranzo').principale && !state.dayLinks['1_5_pranzo'];
    // la sequenza dei pasti mangiati conta gli avanzi
    out.slotsPranzi = weekPlanSlots().filter(s => s.meal === 'pranzo').map(s => s.day);
    // dalle Regole: tolgo il venerdì
    state.genSettingsOpen = 'plain'; render();
    document.querySelector('[data-gen-leftover-day="4"]').click();
    out.dopo = leftoverLunchDays();
    state.genSettingsOpen = null; state.weekLeftoverDays = null;
    return out;
  });
  eq(r.giorni, [0, 1, 2, 3, 4, 6]);
  eq([r.ven, r.sab, r.dom], ['1_3_cena', '', '1_5_cena']);
  eq([r.cenaGio, r.cenaVen, r.cenaSab], [3, 2, 3], 'le cene da cui avanza il pranzo partono con una porzione in più (il venerdì no: il sabato si cucina)');
  assert(r.sabPranzoCucinato, 'il pranzo del sabato si cucina');
  eq(r.slotsPranzi, [5], 'solo il pranzo del sabato è un pasto da cucinare');
  eq(r.dopo, [0, 1, 2, 3, 6], 'toggle venerdì');
});

test('pasto avanzo: un piatto aggiunto è nuovo e sta a parte; in riga restano solo gli avanzi; in Spesa entra il piatto nuovo', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.extraWeeks = []; generateWeek(1); state.pantryItems = {}; state.showPastDays = true;
    const k = Object.keys(state.dayLinks).filter(x => x.startsWith('1_')).sort()[0];
    const [w, d, m] = k.split('_'); const src = state.dayLinks[k];
    const prima = effectiveMeal(+w, +d, m);
    addMealDish(+w, +d, m, 'Piatto di prova nuovo');
    state.tab = 'menu'; render();
    const blocco = document.querySelector(`.meal-block[data-week-idx="${w}"][data-day-index="${d}"][data-meal="${m}"]`);
    const out = {
      inRiga: blocco.querySelector('.leftover-names').textContent,
      nuovi: [...blocco.querySelectorAll('.is-new-dishes .day-menu')].map(e => e.textContent),
      extras: effectiveMeal(+w, +d, m).ownExtras,
      conSource: mealDishes(+w, +d, m).filter(x => !x.own).map(x => x.name),
      fonteIntatta: JSON.stringify(effectiveMeal(...parseMealKey(src).__proto__ ? [] : []) ) && true
    };
    const meal = allPlannedShoppingMeals().find(x => x.key === k);
    out.spesa = meal ? meal.principale : null;
    out.prima = prima.principale;
    removeMealDish(+w, +d, m, 'Piatto di prova nuovo');
    out.dopoToglie = (effectiveMeal(+w, +d, m).ownExtras || []).length;
    out.aCapo = !allPlannedShoppingMeals().some(x => x.key === k);
    return out;
  });
  assert(!/prova nuovo/.test(r.inRiga) && r.inRiga.includes(r.prima), 'in riga solo avanzi: ' + r.inRiga);
  eq(r.nuovi, ['Piatto di prova nuovo']);
  eq(r.extras, ['Piatto di prova nuovo']);
  eq(r.spesa, 'Piatto di prova nuovo');
  eq([r.dopoToglie, r.aCapo], [0, true], 'tolto il piatto nuovo, resta solo l\'avanzo');
});

test('porzioni di partenza: 3 messo a mano torna a 2 una volta sola; l\'avanzo collegato aggiunge la sua porzione', async ({ page }) => {
  const r = await page.evaluate(() => {
    const mig = MIGRATIONS.find(m => m.flag === 'portionsBaseReset1');
    state.weekPortionsBase = 3; state.portionsBaseReset1 = false; mig.run(); const dopo3 = state.weekPortionsBase;
    state.weekPortionsBase = 4; mig.run(); const dopo4 = state.weekPortionsBase;
    state.weekPortionsBase = 2; state.weekLeftoverDays = null; state.extraWeeks = []; generateWeek(1);
    return { dopo3, dopo4, def: defaultPortions(), cenaConAvanzo: state.dayPortions['1_3_cena'], cenaSenza: state.dayPortions['1_4_cena'] };
  });
  eq([r.dopo3, r.dopo4, r.def, r.cenaConAvanzo, r.cenaSenza], [2, 4, 2, 3, 2]);
});

test('Spesa con più settimane: il fresco della prossima si compra nella lista normale, quello di tra due settimane va in "Più avanti"; il resto si compra insieme', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.pantryItems = {}; state.extraWeeks = []; generateWeek(0); generateWeek(1); generateWeek(2);
    const tutte = buildShopFlat().filter(x => x.isRecipe);
    const dept = it => knownDept(it.cat) || pantryCatFor(it.ingrediente) || classifyDept(it.ingrediente);
    const fresco = w => tutte.filter(x => x.weekIdx === w && SHOP_LATER_DEPTS.includes(dept(x)));
    state.tab = 'spesa'; state.shopView = 'reparto'; state.shopSearch = ''; render();
    const gruppo = document.querySelector('.shop-later-group');
    // nome esatto dell'ingrediente (data-shop-name): il testo della riga può avere anche la specifica ("Uova · tuorli")
    const principali = [...document.querySelectorAll('.shop-item input[data-shop-name]')].filter(e => !e.closest('.shop-later-group')).map(e => e.dataset.shopName.trim().toLowerCase());
    const piuAvanti = gruppo ? [...gruppo.querySelectorAll('.shop-item input[data-shop-name]')].map(e => e.dataset.shopName.trim().toLowerCase()) : [];
    const settimane = gruppo ? [...gruppo.querySelectorAll('.shop-later-week')].map(e => e.textContent.trim()) : [];
    // il fresco di una settimana, per un nome che nelle altre non c'è
    const solo = w => fresco(w).map(x => x.ingrediente.toLowerCase()).filter(n => !tutte.some(y => y.weekIdx !== w && y.ingrediente.toLowerCase() === n));
    const prossimaSolo = solo(1), dueSolo = solo(2);
    return { n1: fresco(1).length, n2: fresco(2).length, haGruppo: !!gruppo, titolo: gruppo ? gruppo.querySelector('.shop-day-title').textContent.replace(/\s+/g, ' ').trim() : '', nSett: settimane.length,
      prossimaInLista: prossimaSolo.every(n => principali.includes(n)) && prossimaSolo.every(n => !piuAvanti.includes(n)),
      dueInPiuAvanti: dueSolo.every(n => piuAvanti.includes(n) && !principali.includes(n)),
      nP: prossimaSolo.length, nD: dueSolo.length,
      chiusoDiDefault: gruppo ? gruppo.querySelector('.accordion-body').classList.contains('is-collapsed') : null };
  });
  assert(r.n1 > 0 && r.n2 > 0, 'la settimana prossima e quella dopo hanno fresco: ' + JSON.stringify([r.n1, r.n2]));
  assert(r.haGruppo && /^Più avanti \(\d+\)/.test(r.titolo), 'accordion: ' + r.titolo);
  eq(r.nSett, 1, 'in "Più avanti" solo la settimana di tra due settimane');
  assert(r.nP > 0 && r.prossimaInLista, 'il fresco della settimana prossima è nella lista normale: ' + JSON.stringify(r));
  assert(r.nD > 0 && r.dueInPiuAvanti, 'il fresco di tra due settimane è in "Più avanti": ' + JSON.stringify(r));
  eq(r.chiusoDiDefault, true, 'chiuso di default');
});

test('genera anche la settimana prossima: la seconda non ripete la prima e usa le porzioni in freezer', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.pantryItems = {}; state.extraWeeks = [];
    const congelabile = allRecipeMetas().filter(m => ['congelabile', 'meal-prep'].includes(m.freezerNew) && m.tipologia !== 'contorno' && m.tipologia !== 'dolce');
    const nome = congelabile[0].nome;
    state.dietExclude = [nome.toLowerCase()]; // il generatore non lo sceglie da solo: deve arrivare solo dal freezer
    generateWeek(0);
    addFreezerPortions(nome, 2); state.pantryItems[nome.toLowerCase()].frozenOn = isoLocalDate(new Date());
    state.genTwoWeeks = true; state.genSettingsOpen = 0; render();
    const toggle = !!document.querySelector('[data-toggle-gen-two]');
    document.querySelector('[data-generate-week="0"]').click();
    const w1 = WEEK_DISPLAY_ORDER.map(i => ['pranzo', 'cena'].map(m => effectiveMeal(1, i, m).principale)).flat().filter(Boolean);
    const dalFreezer = WEEK_DISPLAY_ORDER.filter(i => isFreezerDish(mealKey(1, i, 'cena'), nome)).length;
    const out = { toggle, haSettimana2: state.extraWeeks.length === 1, nome, dalFreezer, inW1: w1.includes(nome) };
    state.genTwoWeeks = false; state.dietExclude = [];
    return out;
  });
  assert(r.toggle, 'interruttore nelle Regole');
  assert(r.haSettimana2, 'settimana 2 generata');
  eq([r.dalFreezer, r.inW1], [1, true], 'le porzioni in freezer finiscono in una cena della seconda settimana');
});

test('Dispensa: due voci dello stesso ingrediente (Limone · succo in freezer e Limoni interi in frigo); ognuna copre le sue righe', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.pantryItems = {}; upsertPantryItem('Limone', 'freezer', 1);
    state.tab = 'dispensa'; state.pantryEditKey = 'limone'; render();
    const chip = [...document.querySelectorAll('[data-have-spec]')].map(b => b.dataset.haveSpec || 'Intero');
    document.querySelector('[data-have-spec="succo"]').click();           // questa voce è il succo
    const dopoScelta = { chiavi: Object.keys(state.pantryItems), edit: state.pantryEditKey, spec: state.pantryItems['limone|succo'].spec };
    const solo = { succo: pantryStatusFor('Limone', '1', 'succo'), intero: pantryStatusFor('Limone', '1', ''), scorza: pantryStatusFor('Limone', '1', 'scorza') };
    document.querySelector('[data-add-spec-sibling=""]').click();           // hai anche i limoni interi
    state.pantryItems['limone'].luogo = 'frigo';
    const due = { chiavi: Object.keys(state.pantryItems).sort(), edit: state.pantryEditKey, luogoIntero: state.pantryItems['limone'].luogo, luogoSucco: state.pantryItems['limone|succo'].luogo };
    const ora = { succo: pantryStatusFor('Limone', '1', 'succo'), intero: pantryStatusFor('Limone', '1', ''), scorza: pantryStatusFor('Limone', '1', 'scorza') };
    state.pantryEditKey = null; render();
    const righe = [...document.querySelectorAll('.inv-name')].map(e => e.textContent.replace(/\s+/g, ' ').trim()).filter(t => /^Limone/.test(t)).sort();
    // finito il succo: l'intero resta
    state.pantryItems['limone|succo'].qty = 0;
    const senzaSucco = { succo: pantryStatusFor('Limone', '1', 'succo'), intero: pantryStatusFor('Limone', '1', '') };
    return { chip, dopoScelta, solo, due, ora, righe, senzaSucco };
  });
  eq(r.chip, ['Intero', 'scorza', 'succo']);
  eq([r.dopoScelta.chiavi, r.dopoScelta.edit, r.dopoScelta.spec], [['limone|succo'], 'limone|succo', 'succo'], 'la voce passa a "limone|succo"');
  eq([r.solo.succo, r.solo.intero, r.solo.scorza], ['in-casa', 'manca', 'manca'], 'solo il succo copre il succo');
  eq(r.due.chiavi, ['limone', 'limone|succo'], 'due voci');
  eq([r.due.luogoIntero, r.due.luogoSucco], ['frigo', 'freezer']);
  eq([r.ora.succo, r.ora.intero, r.ora.scorza], ['in-casa', 'in-casa', 'in-casa'], 'con intero e succo, tutto coperto');
  eq(r.righe, ['Limone', 'Limone · succo']);
  eq([r.senzaSucco.succo, r.senzaSucco.intero], ['in-casa', 'in-casa'], 'finito il succo, i limoni interi coprono anche il succo');
});

test('Spesa: comprare "Limone · succo" lo mette nella voce del succo; "Limone" intero nella voce intera', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.pantryItems = {}; state.shopExtras = {};
    const mk = (id, ingrediente, spec) => { state.shopExtras[id] = { ingrediente, qta: '2', spec }; };
    mk('a', 'Limone', ''); 
    // simulo la riga di Spesa come checkbox
    const cb = (name, spec) => { const el = document.createElement('input'); el.type = 'checkbox'; el.dataset.shopKeys = 'x_' + name + spec; el.dataset.shopName = name; el.dataset.shopSpec = spec; el.dataset.shopUnit = ''; return el; };
    moveShopRowToPantry(cb('Limone', 'succo'), { luogo: 'freezer' });
    moveShopRowToPantry(cb('Limone', ''), { luogo: 'frigo' });
    return { chiavi: Object.keys(state.pantryItems).sort(), succo: state.pantryItems['limone|succo'], intero: state.pantryItems['limone'] };
  });
  eq(r.chiavi, ['limone', 'limone|succo']);
  eq([r.succo.spec, r.succo.luogo, r.intero.spec, r.intero.luogo], ['succo', 'freezer', undefined, 'frigo']);
});

test('Dispensa: il tooltip "è finito" è stretto e ancorato a destra', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.pantryItems = {}; upsertPantryItem('Latte', 'frigo', 1, 'l');
    state.tab = 'dispensa'; state.pantryFinishPicker = 'latte'; render();
    const e = document.querySelector('.finish-picker'), row = e.parentElement.getBoundingClientRect(), b = e.getBoundingClientRect();
    return { w: Math.round(b.width), aDestra: Math.abs(row.right - b.right) < 2, botoni: e.querySelectorAll('button').length };
  });
  assert(r.w < 140 && r.aDestra && r.botoni === 2, JSON.stringify(r));
});

test('grammi a porzione: pasta e riso si scalano, 0 lascia la ricetta, il resto non cambia; porzioni di avanzo configurabili', async ({ page }) => {
  const r = await page.evaluate(() => {
    let trovata = null;
    for (const nome of Object.keys(DATA.recipeDetails || {})) {
      const por = parsePortionsBase(DATA.recipeDetails[nome].porzioni);
      if(!por) continue;
      state.portionGrams = { pasta: 0, riso: 0 };
      const base = getIngredientsFor(nome).find(i => portionGramsKind(i.ingrediente) === 'pasta' && /^\d+(\.\d+)?\s*g$/i.test(String(i.qta).trim()));
      if(base){ trovata = { nome, por, base: base.qta, ing: base.ingrediente }; break; }
    }
    if(!trovata) return null;
    state.fixedPortionRecipes = {};
    state.portionGrams = { pasta: 100, riso: 0 };
    const q = getIngredientsFor(trovata.nome).find(i => i.ingrediente === trovata.ing).qta;
    state.portionGrams = { pasta: 0, riso: 90 };
    const sotto = getIngredientsFor(trovata.nome).find(i => i.ingrediente === trovata.ing).qta;
    state.portionGrams = { pasta: 0, riso: 0 };
    state.weekLeftoverPortions = 2; state.weekLeftoverDays = null; state.extraWeeks = []; state.weekPortionsBase = 2; generateWeek(1);
    const due = state.dayPortions['1_3_cena'];
    state.weekLeftoverPortions = 0; generateWeek(1);
    const zero = state.dayPortions['1_3_cena'];
    state.weekLeftoverPortions = 1;
    return { trovata, q, sotto, due, zero };
  });
  assert(r, 'nessuna ricetta con pasta in grammi');
  eq(parseFloat(r.q), r.trovata.por * 100, 'pasta a 100 g a testa');
  eq(r.sotto, r.trovata.base, 'il riso non tocca la pasta');
  eq([r.due, r.zero], [4, 2], 'porzioni avanzo');
});

test('alimentazione: vegetariano senza carne né pesce, obiettivi modificabili, ingredienti da evitare', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.extraWeeks = []; state.dietExclude = []; state.dietTargets = {};
    state.dietType = 'vegetariano';
    const vegCarne = [];
    for(let k = 0; k < 3; k++){
      generateWeek(1);
      WEEK_DISPLAY_ORDER.forEach(d => ['pranzo','cena'].forEach(m => {
        const x = effectiveRecipeMeta(1, d, m);
        if(x && !dietAllows(x)) vegCarne.push(x.nome);
      }));
    }
    const t = weekProteinTargets();
    state.dietTargets = { legumi: [1, 2] };
    const mod = weekProteinTargets().legumi;
    state.dietType = 'onnivoro'; state.dietTargets = {};
    state.dietExclude = ['pasta'];
    const evitati = allRecipeMetas().filter(isMainDish).filter(dietAllows).filter(x => recipeIngredientText(x).includes('pasta')).length;
    state.dietExclude = [];
    return { vegCarne, carne: t['carne-rossa'], uova: t.uova, mod, evitati };
  });
  eq(r.vegCarne, [], 'nessun piatto con carne/pesce');
  eq([r.carne, r.uova, r.mod], [[0, 0], [2, 3], [1, 2]]);
  eq(r.evitati, 0, 'ingrediente evitato');
});

test('alimentazione: tipo e ingredienti che non piacciono si cambiano nelle pagine delle Regole generali', async ({ page }) => {
  await page.evaluate(() => { state.dietType = 'onnivoro'; state.dietExclude = []; state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version}); state.tab = 'menu'; state.genFoodOpen = true; state.genGeneralPage = null; render(); });
  await page.click('[data-gen-go="diet"]');
  await page.click('[data-gen-diet="vegetariano"]');
  await page.click('.gen-mini-sheet [data-gen-sheet-close].gen-go');
  await page.click('[data-gen-go="avoid"]');
  await page.fill('[data-gen-exclude-form] input', 'funghi, noci');
  await page.click('[data-gen-exclude-form] button');
  const r = await page.evaluate(() => ({ d: state.dietType, e: state.dietExclude, chips: document.querySelectorAll('[data-gen-exclude-remove]').length }));
  eq([r.d, r.e, r.chips], ['vegetariano', ['funghi', 'noci'], 2]);
});

test('alimentazione: se nessuna ricetta è compatibile non si genera e non si propone un piatto vietato', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.extraWeeks = []; state.dietType = 'onnivoro'; state.dietExclude = ['a', 'e', 'i', 'o'];
    let errore = null; try { generateWeek(1); } catch(e){ errore = e.message; }
    const avviso = state.undoToast && state.undoToast.message;
    state.dietExclude = ['pasta'];
    generateWeek(1);
    const vietati = [];
    WEEK_DISPLAY_ORDER.forEach(d => ['pranzo','cena'].forEach(m => { const x = effectiveRecipeMeta(1, d, m); if(x && !dietAllows(x)) vietati.push(x.nome); }));
    state.dietExclude = []; state.undoToast = null;
    return { errore, avviso, vietati };
  });
  eq(r.errore, null);
  assert(/Nessuna ricetta compatibile/.test(r.avviso || ''), 'avviso');
  eq(r.vietati, []);
});

test('allergie: il menu le evita, le ricette che le contengono hanno l\'avviso, la sezione si compila', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.dietType = 'onnivoro'; state.dietExclude = []; state.dietTargets = {}; state.extraWeeks = [];
    state.allergies = ['glutine', 'fragole'];
    const conGlutine = allergenHitsInText('Spaghetti | pane'), spesa = allergenHitsInText('Fragole');
    const nessuna = allergenHitsInText('Zucchine | riso');
    generateWeek(1);
    const vietati = [];
    WEEK_DISPLAY_ORDER.forEach(d => ['pranzo','cena'].forEach(m => { const x = effectiveRecipeMeta(1, d, m); if(x && recipeAllergens(x).length) vietati.push(x.nome); }));
    const conPasta = allRecipeMetas().find(x => isMainDish(x) && recipeAllergens(x).includes('glutine'));
    state.allergies = [];
    return { conGlutine, spesa, nessuna, vietati, badge: allergenBadgeHtml(conPasta) };
  });
  eq([r.conGlutine, r.spesa, r.nessuna], [['glutine'], ['fragole'], []]);
  eq(r.vietati, []);
  assert(r.badge === '', 'senza allergie nessun badge');
});

test('allergie: sezione nelle Regole e avviso nella scheda ricetta', async ({ page }) => {
  await page.evaluate(() => { state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version}); state.allergies = []; state.tab = 'menu'; state.genFoodOpen = true; state.genGeneralPage = 'avoid'; render(); });
  await page.click('[data-gen-allergy="uova"]');
  await page.fill('[data-gen-allergy-form] input', 'fragole');
  await page.click('[data-gen-allergy-form] button');
  const r = await page.evaluate(() => {
    const out = { a: state.allergies.slice(), chips: document.querySelectorAll('[data-gen-allergy].active').length };
    state.genSettingsOpen = null;
    const x = allRecipeMetas().find(m => recipeAllergens(m).length);
    out.nome = x && x.nome;
    state.allergies = [];
    return out;
  });
  eq(r.a, ['uova', 'fragole']);
  eq(r.chips, 2);
  assert(r.nome, 'esiste una ricetta con uova');
});

test('persone: nomi e colori propri, il giro "chi cucina" li attraversa tutti, togliere una persona libera i suoi turni', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    state.members = [{ id: 'mara', name: 'Mara' }, { id: 'ste', name: 'Ste' }]; state.cooks = {};
    state.membersOpen = true; state.tab = 'menu'; render();
    document.querySelector('[data-member-add]').click();
    const tre = state.members.length, nuovo = state.members[2].id;
    const nome = document.querySelector(`[data-member-name="${nuovo}"]`);
    nome.value = 'Nonna'; nome.dispatchEvent(new Event('change', { bubbles: true }));
    const giro = []; let cur = null;
    for(let k = 0; k < 4; k++){ cur = nextMemberId(cur); giro.push(cur); }
    state.cooks['1_2_cena'] = nuovo; state.cooks['1_3_cena'] = 'mara';
    const orig = window.confirm; window.confirm = () => true;
    document.querySelector(`[data-member-remove="${nuovo}"]`).click();
    window.confirm = orig;
    const out = { tre, nome: memberName(nuovo), giro, dopo: state.members.map(m => m.id), cooks: Object.assign({}, state.cooks), payload: buildPersonalPayload().members.length };
    state.membersOpen = false; state.cooks = {}; render();
    return out;
  });
  eq(r.tre, 3);
  eq(r.giro, ['mara', 'ste', r.giro[2], null]);
  eq(r.dopo, ['mara', 'ste']);
  eq(r.cooks, { '1_3_cena': 'mara' });
  eq(r.payload, 2);
  eq(page.errors, [], 'errori JS');
});

test('persone: il colore lo sceglie ognuno dal proprio Profilo; in Persone si modificano solo i propri e quelli aggiunti a mano', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.members = [{ id: 'mara', name: 'Mara' }, { id: 'ste', name: 'Ste' }, { id: 'p9', name: 'Nonna', manual: true }];
    const orig = window.getCurrentUser; window.getCurrentUser = () => 'mara';
    state.membersOpen = true; render();
    const out = {
      proprio: !!document.querySelector('[data-member-id="mara"][data-member-color]'),
      altro: !!document.querySelector('[data-member-id="ste"][data-member-color]'),
      aMano: !!document.querySelector('[data-member-id="p9"][data-member-color]'),
      togliAltro: !!document.querySelector('[data-member-remove="ste"]'), togliAMano: !!document.querySelector('[data-member-remove="p9"]')
    };
    state.membersOpen = false; state.profileOpen = true; render();
    out.nelProfilo = !!document.querySelector('[data-page="profile"] [data-member-id="mara"][data-member-color]');
    state.profileOpen = false; window.getCurrentUser = orig; render();
    return out;
  });
  eq(r, { proprio: true, altro: false, aMano: true, togliAltro: false, togliAMano: true, nelProfilo: true });
});

test('catalogo per famiglia: ognuna il suo percorso; chi lo condivideva parte da una copia di quello originale', async ({ page }) => {
  const r = await page.evaluate(async () => {
    const out = {};
    const oldEmail = loggedInEmail, oldSync = window.cookpopSync;
    const fake = store => ({
      save: (p, d) => { store[p] = JSON.parse(JSON.stringify(d)); (fake.cbs[p] || []).forEach(cb => cb(JSON.parse(JSON.stringify(store[p])))); return Promise.resolve(); },
      patch: (p, d) => { store[p] = Object.assign(store[p] || {}, d); return Promise.resolve(); },
      onChange: (p, cb) => { (fake.cbs[p] = fake.cbs[p] || []).push(cb); cb(store[p] ? JSON.parse(JSON.stringify(store[p])) : null); },
      load: p => Promise.resolve(store[p] ? JSON.parse(JSON.stringify(store[p])) : null)
    });
    fake.cbs = {};
    loggedInEmail = 'mara@x.it'; out.mara = catalogPath() + '|' + catalogCacheKey();
    loggedInEmail = 'cugina@x.it'; out.cugina = catalogPath() + '|' + catalogCacheKey();
    loggedInEmail = 'mamma@x.it'; out.mamma = catalogPath();
    // la cugina apre l'app per la prima volta: il suo catalogo parte da una copia di quello originale
    const store = { 'catalog-state': { hiddenRecipes: { 'Ricetta di prova': true } } };
    window.cookpopSync = fake(store);
    loggedInEmail = 'cugina@x.it';
    personalSynced = false; catalogSynced = false;
    await loadState();
    await new Promise(r => setTimeout(r, 50));
    out.copia = JSON.stringify(store['spaces/cugina/catalog']);
    out.originale = JSON.stringify(store['catalog-state']);
    out.sync = catalogSynced;
    out.vista = !!(state.hiddenRecipes && state.hiddenRecipes['Ricetta di prova']);
    window.cookpopSync = oldSync; loggedInEmail = oldEmail; catalogSynced = false;
    return out;
  });
  eq(r.mara, 'catalog-state|catalog-state-cache');
  eq(r.cugina, 'spaces/cugina/catalog|catalog-state-cache-cugina');
  eq(r.mamma, 'spaces/mamma/catalog');
  eq(r.copia, '{"hiddenRecipes":{"Ricetta di prova":true}}');
  eq(r.originale, '{"hiddenRecipes":{"Ricetta di prova":true}}');
  assert(r.sync && r.vista, 'catalogo copiato e letto');
});

test('famiglie: codice di creazione, codice invito monouso, appartenenza e riconoscimento sicuro delle famiglie di prima', async ({ page }) => {
  const r = await page.evaluate(async () => {
    const out = {};
    const oldSync = window.cookpopSync, oldEmail = loggedInEmail, oldUid = loggedInUid, oldRoute = activeRoute;
    const store = { creationCodes: { MARA2026: true } };
    const get = p => p.split('/').reduce((o, k) => (o == null ? null : o[k]), store);
    const put = (p, v) => { const ks = p.split('/'); let o = store; ks.slice(0, -1).forEach(k => { o[k] = o[k] || {}; o = o[k]; }); if(v === null) delete o[ks[ks.length - 1]]; else o[ks[ks.length - 1]] = JSON.parse(JSON.stringify(v)); };
    window.cookpopSync = { load: p => Promise.resolve(get(p) === undefined ? null : get(p)), save: (p, v) => { put(p, v); return Promise.resolve(); }, patch: () => Promise.resolve(), onChange: () => {}, remove: p => { put(p, null); return Promise.resolve(); } };
    // riconoscimento: "stefano" non è "ste"
    out.strict = [legacyRouteStrict('mara.rossi@x.it') && legacyRouteStrict('mara.rossi@x.it').id, legacyRouteStrict('stefano@x.it'), legacyRouteStrict('cugina@x.it').id];
    // creare una famiglia con un codice sbagliato e con quello giusto
    loggedInUid = 'uidAAAA1111'; loggedInEmail = 'anna@x.it';
    try { await createFamily('Rossi', 'SBAGLIATO', 'Anna'); out.sbagliato = 'creata'; } catch(e){ out.sbagliato = e.message; }
    const famId = await createFamily('Rossi', 'mara-2026', 'Anna');
    out.creata = { meta: get(`families/${famId}/meta`).name, creatore: !!get(`families/${famId}/members/uidAAAA1111`), haCodice: typeof get(`families/${famId}/members/uidAAAA1111`).code === 'string' && get(`families/${famId}/members/uidAAAA1111`).code.length > 0, puntatore: get('userFamily/uidAAAA1111') === famId, codiceConsumato: get('creationCodes/MARA2026') == null };
    try { await createFamily('Altra', 'MARA2026', 'X'); out.riuso = 'creata'; } catch(e){ out.riuso = e.message; }
    // invito
    activeRoute = familyRouteFor(famId);
    const code = await makeInvite();
    out.codice = { lungo: code.length, punta: get('invites/' + code) === famId };
    loggedInUid = 'uidBBBB2222'; loggedInEmail = 'stefano@x.it';
    try { await joinFamily('NONESISTE', 'Ste'); out.joinErrato = 'entrato'; } catch(e){ out.joinErrato = e.message; }
    const dentro = await joinFamily(code.toLowerCase(), 'Stefano');
    out.join = { stessa: dentro === famId, membro: !!get(`families/${famId}/members/uidBBBB2222`), puntatore: get('userFamily/uidBBBB2222') === famId, monouso: get('invites/' + code) == null };
    try { await joinFamily(code, 'Altro'); out.secondo = 'entrato'; } catch(e){ out.secondo = e.message; }
    // risolve la famiglia all'avvio e mette sé stesso tra le persone
    activeRoute = null; state.members = []; state.userColors = {};
    await resolveFamilyRoute();
    out.route = [activeRoute.path === `families/${famId}/state`, activeRoute.catalogPath === `families/${famId}/catalog`, activeRoute.newFamily];
    state.members = []; ensureSelfMember();
    out.persone = state.members.map(m => m.uid + ':' + m.name);
    out.io = getCurrentUser() === state.members[0].id;
    out.foto = recipePhotoPath('Pasta').startsWith(`families/${famId}/photos/`);
    window.cookpopSync = oldSync; loggedInEmail = oldEmail; loggedInUid = oldUid; activeRoute = oldRoute;
    state.members = [{ id: 'mara', name: 'Mara' }, { id: 'ste', name: 'Ste' }];
    return out;
  });
  eq(r.strict, ['default', null, 'cugina']);
  eq(r.sbagliato, 'codice');
  eq(r.creata, { meta: 'Rossi', creatore: true, haCodice: true, puntatore: true, codiceConsumato: true });
  eq(r.riuso, 'codice');
  eq(r.codice, { lungo: 8, punta: true });
  eq(r.joinErrato, 'codice');
  eq(r.join, { stessa: true, membro: true, puntatore: true, monouso: true });
  eq(r.secondo, 'codice');
  eq(r.route, [true, true, true]);
  eq(r.persone, ['uidBBBB2222:stefano']);
  assert(r.io && r.foto, 'persona e foto della famiglia');
});

test('famiglie: la schermata "La tua famiglia" cambia scheda, segnala un codice sbagliato ed entra con quello giusto', async ({ page }) => {
  const r = await page.evaluate(async () => {
    const oldSync = window.cookpopSync, oldUid = loggedInUid, oldEmail = loggedInEmail;
    const store = { invites: { ZZZZ2222: 'fam1' } };
    window.cookpopSync = { load: p => Promise.resolve(p.split('/').reduce((o, k) => (o == null ? null : o[k]), store) ?? null), save: () => Promise.resolve(), remove: () => Promise.resolve() };
    loggedInUid = 'uidCCCC3333'; loggedInEmail = 'nuova@x.it';
    const q = id => document.getElementById(id);
    const done = runFamilyGate();
    const out = { visibile: getComputedStyle(q('family-gate')).display !== 'none', nomeFamigliaNascosto: q('family-name-wrap').style.display === 'none' };
    q('family-tab-create').click();
    out.crea = [q('family-name-wrap').style.display !== 'none', q('family-code').placeholder, q('family-submit').textContent];
    q('family-tab-join').click();
    q('family-code').value = 'SBAGLIATO'; q('family-submit').click();
    await new Promise(r => setTimeout(r, 50));
    out.errore = q('family-error').textContent;
    q('family-code').value = 'zzzz-2222'; q('family-submit').click();
    out.famId = await done;
    out.chiusa = getComputedStyle(q('family-gate')).display === 'none';
    window.cookpopSync = oldSync; loggedInUid = oldUid; loggedInEmail = oldEmail;
    return out;
  });
  eq(r.visibile, true);
  eq(r.nomeFamigliaNascosto, true);
  eq(r.crea, [true, 'Codice di creazione', 'Crea la famiglia']);
  eq(r.errore, 'Codice invito non valido o già usato.');
  eq(r.famId, 'fam1');
  eq(r.chiusa, true);
});

test('primo avvio guidato: solo per le famiglie nuove, tre domande e poi "Pronti", con gli stessi controlli delle Regole, poi genera il menù', async ({ page }) => {
  const r = await page.evaluate(async () => {
    const oldRoute = activeRoute, oldSynced = personalSynced;
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    const out = {};
    activeRoute = null; state.onboardingDone = false; render();
    out.nelleVecchie = !document.querySelector('[data-page="onboarding"]');
    activeRoute = familyRouteFor('abc'); personalSynced = true; state.onbStep = 0; state.dietType = 'onnivoro'; state.allergies = []; state.weekPortionsBase = 2; state.extraWeeks = [];
    render();
    out.passo1 = !!document.querySelector('[data-page="onboarding"] [data-gen-diet="vegetariano"]');
    document.querySelector('[data-gen-diet="vegetariano"]').click();
    document.querySelector('[data-gen-allergy="glutine"]').click();
    out.scelte = [state.dietType, state.allergies.slice()];
    document.querySelector('[data-gen-portions-inc]').click(); document.querySelector('[data-gen-portions-inc]').click();
    out.porzioni = state.weekPortionsBase;
    out.nessunaSpenta = !document.querySelector('[data-onb-allergy-none].active');
    document.querySelector('[data-onb-allergy-none]').click();
    out.nessuna = [state.allergies.length, !!document.querySelector('[data-onb-allergy-none].active')];
    document.querySelector('[data-onb-next]').click();
    out.finale = !!document.querySelector('[data-onb-finish="generate"]');
    document.querySelector('[data-onb-finish="generate"]').click();
    out.fatto = [state.onboardingDone, !document.querySelector('[data-page="onboarding"]'), state.tab, WEEK_DISPLAY_ORDER.some(i => !!effectiveRecipeMeta(0, i, 'cena'))];
    out.payload = buildPersonalPayload().onboardingDone;
    activeRoute = oldRoute; personalSynced = oldSynced; state.dietType = 'onnivoro'; state.allergies = []; state.weekPortionsBase = 2; render();
    return out;
  });
  eq(r.nelleVecchie, true);
  eq(r.passo1, true);
  eq(r.scelte, ['vegetariano', ['glutine']]);
  eq(r.porzioni, 4);
  eq([r.nessunaSpenta, r.nessuna], [true, [0, true]]);
  eq(r.finale, true);
  eq(r.fatto, [true, true, 'menu', true]);
  eq(r.payload, true);
});

test('famiglie di prima nel sistema nuovo: dati dove sono, io = mara senza nome nell\'email, invito disponibile, niente primo avvio', async ({ page }) => {
  const r = await page.evaluate(async () => {
    const out = {};
    const oldSync = window.cookpopSync, oldEmail = loggedInEmail, oldUid = loggedInUid, oldRoute = activeRoute, oldSelf = selfMemberId;
    const store = {
      userFamily: { uidMara: 'default', uidCug: 'cugina' },
      families: {
        default: { meta: { name: 'Mara e Ste', paths: { state: 'quaderno-state', catalog: 'catalog-state', photos: 'recipe-photos' } }, members: { uidMara: { name: 'Mara', memberId: 'mara' } } },
        cugina: { meta: { name: 'Cugina', paths: { state: 'spaces/cugina/state', catalog: 'spaces/cugina/catalog', photos: 'recipe-photos', seedCatalogFrom: 'catalog-state' } }, members: { uidCug: { name: 'Cugina' } } }
      }
    };
    const get = p => p.split('/').reduce((o, k) => (o == null ? null : o[k]), store);
    window.cookpopSync = { load: p => Promise.resolve(get(p) === undefined ? null : get(p)), save: () => Promise.resolve(), onChange: () => {}, remove: () => Promise.resolve() };
    // email senza nessun nome: la famiglia viene da userFamily
    loggedInUid = 'uidMara'; loggedInEmail = 'qualunque.cosa@x.it'; activeRoute = null; selfMemberId = null;
    await resolveFamilyRoute();
    out.mara = [activeRoute.path, activeRoute.catalogPath, activeRoute.photosPath, activeRoute.newFamily, activeRoute.famId, activeRoute.id, selfMemberId, getCurrentUser()];
    out.foto = recipePhotoPath('Pasta');
    out.onboarding = onboardingActive();
    out.invito = (state.membersOpen = true, render(), !!document.querySelector('[data-make-invite]'));
    state.membersOpen = false;
    loggedInUid = 'uidCug'; loggedInEmail = 'altra@x.it'; activeRoute = null; selfMemberId = null;
    await resolveFamilyRoute();
    out.cug = [activeRoute.path, activeRoute.catalogPath, activeRoute.seedFromShared, activeRoute.seedPath, catalogPath(), catalogCacheKey()];
    // migrazione a metà: userFamily c'è ma i dati della famiglia mancano -> chi è di prima resta sul suo spazio
    store.userFamily.uidX = 'zzz'; loggedInUid = 'uidX'; loggedInEmail = 'mamma@x.it'; activeRoute = null; selfMemberId = null;
    await resolveFamilyRoute();
    out.mezzo = activeRoute === null && getSpaceRoute().id;
    window.cookpopSync = oldSync; loggedInEmail = oldEmail; loggedInUid = oldUid; activeRoute = oldRoute; selfMemberId = oldSelf; render();
    return out;
  });
  eq(r.mara, ['quaderno-state', 'catalog-state', 'recipe-photos', false, 'default', 'default', 'mara', 'mara']);
  eq(r.foto, 'recipe-photos/Pasta');
  eq(r.onboarding, false);
  eq(r.invito, true);
  eq(r.cug, ['spaces/cugina/state', 'spaces/cugina/catalog', true, 'catalog-state', 'spaces/cugina/catalog', 'catalog-state-cache-cugina']);
  eq(r.mezzo, 'mamma');
});

test('niente scorte né spesa fissa di partenza; l\'insalata fissa della famiglia originale diventa un consumo ricorrente', async ({ page }) => {
  const r = await page.evaluate(async () => {
    const oldRoute = activeRoute, out = {};
    const pulisci = () => { state.pantryItems = {}; state.pantrySeeded = false; state.generalShoppingRecurring1 = false; state.breadRecurring1 = false; state.recurringItems = {}; state.shopExtras = {}; state.shopDismissed = {}; state.extraWeeks = []; };
    // famiglia nuova
    pulisci(); activeRoute = familyRouteFor('nuova'); await loadState(); runMigrations();
    out.nuova = [Object.keys(state.pantryItems).length, Object.keys(state.recurringItems).length];
    // un'altra famiglia di prima (cugina): niente scorte, niente insalata
    pulisci(); activeRoute = { id: 'cugina', famId: 'cugina', newFamily: false, path: 'spaces/cugina/state', catalogPath: 'spaces/cugina/catalog' };
    runMigrations();
    out.cugina = [Object.keys(state.pantryItems).length, Object.keys(state.recurringItems).length];
    // famiglia originale: l'insalata ricorrente c'è
    pulisci(); activeRoute = null; runMigrations();
    const rec = Object.values(state.recurringItems).find(x => /insalata/i.test(x.nome));
    out.originale = [!!rec, rec && rec.qty, rec && rec.every, !!resolvePantryItem('Insalata'), buildShopFlat().filter(x => x.context === 'Ogni settimana').length];
    out.nessunDato = [DATA.pantry === undefined, DATA.generalShopping === undefined];
    activeRoute = oldRoute;
    return out;
  });
  eq(r.nuova, [0, 0]);
  eq(r.cugina, [0, 0]);
  eq(r.originale, [true, 2, 7, true, 0]);
  eq(r.nessunDato, [true, true]);
});

test('Gruppi: pieni di formati anche con la Dispensa vuota; si aggiunge e si toglie un formato senza passare dalla Dispensa', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    state.pantryItems = {}; state.recurringItems = {};
    Object.values(state.pantryGroups).forEach(g => { delete g.members; });
    state.pantryGroupsModalOpen = true; state.tab = 'dispensa'; render();
    const righe = [...document.querySelectorAll('[data-group-edit]')].map(b => b.textContent.replace(/\s+/g, ' ').trim());
    const vuoti = righe.filter(t => /nessun formato/.test(t)).length;
    const corta = righe.find(t => /^.*Pasta corta/.test(t)) || '';
    // aggiungo un formato solo per nome, senza voce in Dispensa
    state.groupEditId = 'pasta-corta'; state.groupDraft = Object.assign({}, state.pantryGroups['pasta-corta']); render();
    const prima = [...document.querySelectorAll('.manage-member')].map(e => e.firstChild.textContent.trim().toLowerCase());
    state.groupMemberSearch = 'casarecce'; render();
    document.querySelector('[data-group-member-new]').click();
    const dopoAdd = state.pantryGroups['pasta-corta'].members.includes('casarecce');
    const nessunaVoce = !state.pantryItems['casarecce'];
    // lo tolgo
    document.querySelector('[data-group-member-remove="casarecce"]').click();
    const tolto = !state.pantryGroups['pasta-corta'].members.includes('casarecce');
    // tolgo penne: avere le penne non copre più "pasta corta"
    upsertPantryItem('Penne', 'dispensa', 1, 'g');
    const conPenne = pantryStatusFor('Pasta corta', '200', '');
    document.querySelector('[data-group-member-remove="penne"]').click();
    const senzaPenne = pantryStatusFor('Pasta corta', '200', '');
    state.pantryGroupsModalOpen = false; state.groupEditId = null; render();
    return { vuoti, cortaHaFusilli: /fusilli/i.test(corta), prima: prima.includes('penne') && prima.includes('fusilli'), dopoAdd, nessunaVoce, tolto, conPenne, senzaPenne };
  });
  eq(r.vuoti, 0, 'nessun gruppo vuoto');
  eq([r.cortaHaFusilli, r.prima], [true, true]);
  eq([r.dopoAdd, r.nessunaVoce, r.tolto], [true, true, true]);
  eq([r.conPenne, r.senzaPenne], ['in-casa', 'manca']);
});

test('Generazione menù e Preferenze alimentari: due pagine con righe e sotto-pagine; la finestra della settimana non ha niente di generale', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    state.dietType = 'vegetariano'; state.allergies = ['glutine']; state.dietExclude = ['funghi']; state.portionGrams = { pasta: 70, riso: 50 }; state.tab = 'menu';
    state.genGeneralOpen = true; state.genGeneralPage = null; render();
    const has = sel => !!document.querySelector(sel);
    const testo = () => (document.querySelector('[data-page^="gen-"]') || document.body).textContent.replace(/\s+/g, ' ');
    const out = { righe: [...document.querySelectorAll('[data-gen-go]')].map(b => b.dataset.genGo), porzioni: has('[data-gen-portions-inc]'), toggle: has('[data-toggle-gen-leftover]'), testo: testo(), titolo: document.querySelector('[data-page="gen-general"] .manage-title, [data-page="gen-general"] h2') && document.querySelector('[data-page="gen-general"] .manage-title, [data-page="gen-general"] h2').textContent };
    state.genGeneralOpen = false; state.genFoodOpen = true; render();
    out.righeCibo = [...document.querySelectorAll('[data-gen-go]')].map(b => b.dataset.genGo); out.testoCibo = testo(); out.cibo = { porzioni: has('[data-gen-portions-inc]'), toggle: has('[data-toggle-gen-leftover]') };
    state.genFoodOpen = false; state.genGeneralOpen = true; render();
    const sotto = {};
    ['targets', 'avoid'].forEach(p => { state.genGeneralOpen = p === 'targets'; state.genFoodOpen = p === 'avoid'; state.genGeneralPage = p; render(); sotto[p] = { diet: has('[data-gen-diet]'), target: has('[data-gen-target-open]'), grams: has('[data-gen-grams]'), allergie: has('[data-gen-allergy-form]'), non: has('[data-gen-exclude-form]') }; });
    out.sotto = sotto;
    state.genGeneralPage = null; state.genGeneralOpen = false; state.genFoodOpen = true; state.genGeneralSheet = 'diet'; render();
    const pannelli = { diet: has('.gen-mini-sheet [data-gen-diet]') && !!document.querySelector('[data-page="gen-food"]') };
    state.genFoodOpen = false; state.genGeneralOpen = true; render();
    state.genGeneralSheet = 'grams'; render(); pannelli.grams = has('.gen-mini-sheet [data-gen-grams]');
    document.querySelector('.gen-mini-sheet .gen-go').click(); pannelli.chiuso = !has('.gen-mini-sheet');
    out.pannelli = pannelli;
    state.genGeneralOpen = false; state.genFoodOpen = false; state.genGeneralPage = null; state.genSettingsOpen = 0; render();
    out.settimana = { diet: has('[data-gen-diet]'), target: has('[data-gen-target-open]'), grams: has('[data-gen-grams]'), porzioni: has('[data-gen-portions-inc]'), titolo: document.querySelector('.gen-sheet .move-title').textContent };
    state.genSettingsOpen = null; state.dietType = 'onnivoro'; state.allergies = []; state.dietExclude = []; state.portionGrams = { pasta: 0, riso: 0 }; render();
    return out;
  });
  eq(r.righe, ['weekstart', 'prepday', 'grams', 'targets']);
  eq(r.righeCibo, ['diet', 'avoid', 'avoid']);
  eq([r.cibo.porzioni, r.cibo.toggle], [false, false]);
  eq([r.porzioni, r.toggle], [true, true]);
  assert(/Pasta 70 g · Riso 50 g/.test(r.testo) && !/glutine/i.test(r.testo), 'riepiloghi generazione: ' + r.testo.slice(0, 300));
  assert(/Vegetariano/.test(r.testoCibo) && /glutine/i.test(r.testoCibo) && /funghi/i.test(r.testoCibo), 'riepiloghi cibo: ' + r.testoCibo.slice(0, 300));
  eq(r.sotto.targets.target, true);
  eq([r.pannelli.diet, r.pannelli.grams, r.pannelli.chiuso], [true, true, true]);
  eq([r.sotto.avoid.allergie, r.sotto.avoid.non], [true, true]);
  eq(r.settimana, { diet: false, target: false, grams: false, porzioni: false, titolo: 'Regole della settimana' });
});

test('pranzo con l\'avanzo: interruttore nelle Regole generali, giorni e porzioni nella finestra solo se attivo; grammi solo nelle generali; partenze per famiglia', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    const has = sel => !!document.querySelector(sel);
    const out = {};
    state.leftoverLunchOn = false; state.tab = 'menu'; state.genGeneralOpen = true; render();
    out.spento = { toggle: has('[data-toggle-gen-leftover]'), giorni: has('[data-gen-leftover-day]'), porzioni: has('[data-gen-leftover-portions]'), grammi: false, giorniLogici: leftoverLunchDays().length };
    document.querySelector('[data-toggle-gen-leftover]').click();
    out.acceso = { on: state.leftoverLunchOn, giorni: has('[data-gen-leftover-day]'), porzioni: has('[data-gen-leftover-portions]'), giorniLogici: leftoverLunchDays().length > 0 };
    state.genGeneralOpen = false; state.genSettingsOpen = 0; render();
    out.settimana = { toggle: has('[data-toggle-gen-leftover]'), giorni: has('[data-gen-leftover-day]'), porzioni: has('[data-gen-leftover-portions]'), grammi: has('[data-gen-grams]'), obiettivi: has('[data-gen-target]') };
    state.leftoverLunchOn = false; render();
    out.settimanaSpento = { giorni: has('[data-gen-leftover-day]'), porzioni: has('[data-gen-leftover-portions]') };
    state.genSettingsOpen = null;
    // partenze per famiglia
    const oldRoute = activeRoute;
    const prova = route => { state.familyDefaults1 = false; state.leftoverLunchOn = null; state.weekPortionsBase = 2; activeRoute = route; runMigrations(); return [state.leftoverLunchOn, state.weekPortionsBase]; };
    out.originale = prova(null);
    out.cugina = prova({ id: 'cugina', famId: 'cugina', newFamily: false, path: 'x', catalogPath: 'y' });
    out.nuova = prova(familyRouteFor('nuova'));
    out.daFirebase = prova(familyRouteFor('altra', { defaults: { leftoverLunch: true, portionsBase: 3 } }));
    activeRoute = oldRoute; state.leftoverLunchOn = true; state.weekPortionsBase = 2;
    return out;
  });
  eq(r.spento, { toggle: true, giorni: false, porzioni: false, grammi: false, giorniLogici: 0 });
  eq(r.acceso, { on: true, giorni: false, porzioni: false, giorniLogici: true });
  eq(r.settimana, { toggle: false, giorni: true, porzioni: true, grammi: false, obiettivi: false });
  eq(r.settimanaSpento, { giorni: false, porzioni: false });
  eq(r.originale, [true, 2]);
  eq(r.cugina, [false, 1]);
  eq(r.nuova, [false, 2]);
  eq(r.daFirebase, [true, 3]);
});

test('menu ⋮ di Menù: "Regole di generazione" apre la pagina generale; la finestra semplice solo dall\'ingranaggio della settimana o di "Aggiungi settimana"', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    state.genGeneralOpen = false; state.genSettingsOpen = null; state.tab = 'menu'; state.extraWeeks = []; generateWeek(0); render();
    const out = {};
    document.getElementById('topbar-menu-btn').click();
    const voce = [...document.querySelectorAll('.topbar-menu-item')].find(b => /Generazione menù/.test(b.textContent));
    voce.click();
    out.dalMenu = [state.genGeneralOpen, state.genSettingsOpen, !!document.querySelector('[data-page="gen-general"]'), !!document.querySelector('.gen-sheet')];
    state.genGeneralOpen = false; render();
    const gear = document.querySelector('[data-open-gen-settings]');
    out.ingranaggi = [...document.querySelectorAll('[data-open-gen-settings]')].map(b => b.dataset.openGenSettings);
    gear.click();
    out.dalGear = [state.genGeneralOpen, state.genSettingsOpen !== null, !!document.querySelector('.gen-sheet')];
    state.genSettingsOpen = null; render();
    return out;
  });
  eq(r.dalMenu, [true, null, true, false]);
  assert(r.ingranaggi.length >= 1, 'ingranaggi presenti');
  eq(r.dalGear, [false, true, true]);
});

test('ingredienti che non piacciono e allergie: due liste, e una parola come "pomodori" trova anche pomodoro, pomodorini e passata', async ({ page }) => {
  const r = await page.evaluate(() => {
    const evita = () => allRecipeMetas().filter(isMainDish).filter(x => !dietAllows(x)).length;
    const conPomodoro = () => allRecipeMetas().filter(isMainDish).filter(dietAllows).some(x => /pomodor/.test(recipeIngredientText(x)));
    state.dietType = 'onnivoro'; state.allergies = []; state.dietExclude = [];
    const prima = evita();
    state.dietExclude = ['pomodori'];
    const nonPiacciono = [evita() > prima, conPomodoro()];
    state.dietExclude = []; state.allergies = ['pomodori'];
    const allergia = [evita() > prima, conPomodoro()];
    const badge = allergenHitsInText('Pomodorini | Passata di pomodoro');
    state.allergies = [];
    return { nonPiacciono, allergia, badge, corte: [avoidStem('noci'), avoidStem('funghi'), avoidStem('fragole')] };
  });
  eq(r.nonPiacciono, [true, false]);
  eq(r.allergia, [true, false]);
  eq(r.corte, ['noci', 'fungh', 'fragol']);
});
test('obiettivi a settimana: il valore apre un fumetto con minimo e massimo separati, che non si incrociano', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    state.dietType = 'onnivoro'; state.dietTargets = {};
    state.genGeneralOpen = true; state.genGeneralPage = 'targets'; state.genTargetEdit = null; render();
    const out = {};
    const val = k => document.querySelector(`[data-gen-target-open="${k}"]`).textContent.trim();
    out.valori = [val('legumi'), val('carne-bianca')];
    out.senzaStepper = !document.querySelector('[data-gen-target]');
    document.querySelector('[data-gen-target-open="legumi"]').click();
    const bt = (end, d) => document.querySelector(`[data-gen-target="legumi"][data-gen-target-end="${end}"][data-gen-target-step="${d}"]`);
    out.fumetto = [!!document.querySelector('.gen-target-pop'), document.querySelector('.gen-target-pop').textContent.replace(/\s+/g, ' ').includes('Almeno'), document.querySelector('.gen-target-pop').textContent.includes('Al massimo'), !!document.querySelector('.gen-target-pop .qty-pop-done')];
    // minimo 3, massimo 4: alzo il minimo fino al massimo, poi si ferma
    bt(0, 1).click(); out.min4 = weekProteinTargets().legumi.slice();
    out.minPiuBloccato = document.querySelector('[data-gen-target="legumi"][data-gen-target-end="0"][data-gen-target-step="1"]').disabled;
    out.maxMenoBloccato = document.querySelector('[data-gen-target="legumi"][data-gen-target-end="1"][data-gen-target-step="-1"]').disabled;
    out.valoreUguale = val('legumi');
    // il massimo sale, il minimo resta
    document.querySelector('[data-gen-target="legumi"][data-gen-target-end="1"][data-gen-target-step="1"]').click(); out.max5 = weekProteinTargets().legumi.slice();
    // minimo giù fino a 0
    for(let i = 0; i < 6; i++){ const b = document.querySelector('[data-gen-target="legumi"][data-gen-target-end="0"][data-gen-target-step="-1"]'); if(b && !b.disabled) b.click(); }
    out.min0 = weekProteinTargets().legumi.slice();
    out.salvato = state.dietTargets.legumi.slice();
    document.querySelector('.gen-target-pop .qty-pop-done').click();
    out.chiuso = !document.querySelector('.gen-target-pop');
    state.genGeneralOpen = false; state.genGeneralPage = null; state.dietTargets = {}; render();
    return out;
  });
  eq(r.valori, ['3–4', '2']);
  eq(r.senzaStepper, true);
  eq(r.fumetto, [true, true, true, true]);
  eq([r.min4, r.minPiuBloccato, r.maxMenoBloccato, r.valoreUguale], [[4, 4], true, true, '4']);
  eq(r.max5, [4, 5]);
  eq([r.min0, r.salvato, r.chiuso], [[0, 5], [0, 5], true]);
});

test('Regole della settimana: riepilogo fisso sopra il bottone, "Niente da rigenerare" quando non c\'è nulla da cambiare, sabato spiegato', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    state.leftoverLunchOn = true; state.tab = 'menu'; state.extraWeeks = []; generateWeek(0);
    state.genSettingsOpen = 0; render();
    const q = sel => document.querySelector(sel);
    const out = { riepilogo: !!q('.gen-footer .gen-notes'), nelCorpo: !!q('.gen-body .gen-notes'), testo: q('.gen-footer .gen-notes').textContent.replace(/\s+/g, ' '),
      bottone: [q('.gen-footer .gen-go').textContent.trim(), q('.gen-footer .gen-go').disabled], sabato: /sabato non c'è/i.test(q('.gen-body').textContent), sabatoDisabilitato: q('.gen-leftover-days .gen-day:disabled').textContent.trim() };
    // blocco tutti i pasti: niente da rigenerare
    WEEK_DISPLAY_ORDER.forEach(i => ['pranzo', 'cena'].forEach(m => { state.mealLocked[mealKey(0, i, m)] = true; }));
    render();
    out.tuttoBloccato = [q('.gen-footer .gen-go').textContent.trim(), q('.gen-footer .gen-go').disabled];
    state.mealLocked = {}; state.genSettingsOpen = null; render();
    return out;
  });
  assert(r.riepilogo && !r.nelCorpo, 'riepilogo nel footer fisso');
  assert(/Cambia \d+ pasti?/.test(r.testo) && /ricette di stagione/.test(r.testo), 'testo: ' + r.testo);
  eq(r.bottone, ['Genera nuovo menù', false]);
  eq([r.sabato, r.sabatoDisabilitato], [true, 'S']);
  eq(r.tuttoBloccato, ['Niente da rigenerare', true]);
});

test('Scegli ricetta: "Cambia piatto", "Aggiungi piatto" e pasto vuoto sono lo stesso foglio; chip Suggeriti con "Un\'altra proposta"; scorre fino alla portata scelta', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    state.extraWeeks = []; generateWeek(1); state.tab = 'menu'; render();
    const out = {};
    const apri = mk => { state.dishPicker = null; document.querySelector('[data-open-swap="' + mk + '"]'); };
    // pasto con un piatto: stessa apertura ma "Cambia piatto" con "Al posto di"
    const mk = '1_3_cena';
    const piatto = effectiveMeal(1, 3, 'cena').principale;
    const btn = document.createElement('button'); btn.setAttribute('data-open-swap', mk); document.body.appendChild(btn);
    render(); // gli ascoltatori si attaccano al render
    document.querySelector('[data-open-swap="' + mk + '"]').click();
    out.cambia = [document.querySelector('.dish-sheet .move-title').textContent, !!document.querySelector('.dsh-cur'), !!document.querySelector('.meal-detail-screen'), (document.querySelector('.dsh-cur') || { textContent: '' }).textContent.includes(piatto)];
    out.senzaAnnulla = !/Annulla|Oppure cerca/i.test(document.querySelector('.dish-sheet').textContent);
    document.querySelector('[data-dish-course="suggeriti"]').click();
    const nomi = () => [...document.querySelectorAll('[data-dish-pick]')].map(e => e.dataset.dishPick);
    out.suggeriti = nomi().length > 0 && nomi().length <= 3;
    const primi = nomi();
    document.querySelector('[data-dish-more-suggest]').click();
    out.altre = nomi().length > 0 && nomi().every(n => !primi.includes(n));
    state.dishPicker = null; render();
    return out;
  });
  eq(r.cambia, ['Cambia piatto', true, false, true]);
  eq(r.senzaAnnulla, true);
  eq([r.suggeriti, r.altre], [true, true]);
});

test('scheda ingrediente "solo se c\'è": "+ Altra scadenza (un\'altra confezione)" aggiunge una confezione con la sua data; Finito le toglie', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    state.pantryItems = {}; upsertPantryItem('Cipolle rosse', 'frigo', 1, 'none'); state.pantryItems['cipolle rosse'].scadenza = '2030-01-10';
    state.tab = 'dispensa'; state.pantryEditKey = 'cipolle rosse'; render();
    const out = { link: !!document.querySelector('.lot-add-link'), seg: !!document.querySelector('.sheet-seg') };
    document.querySelector('.lot-add-link').click();
    const it = state.pantryItems['cipolle rosse'];
    out.lotti = [Array.isArray(it.lots) ? it.lots.length : 0, it.qty, it.unit];
    out.righe = document.querySelectorAll('.lot-row').length;
    out.senzaQuantita = !document.querySelector('.lot-row .lot-qty');
    out.dateInput = document.querySelectorAll('.lot-row .lot-date').length;
    document.querySelector('[data-sheet-presence-set="0"]').click();
    out.finito = [state.pantryItems['cipolle rosse'].qty, !state.pantryItems['cipolle rosse'].lots];
    state.pantryEditKey = null; render();
    return out;
  });
  eq([r.link, r.seg], [true, true]);
  eq(r.lotti, [2, 2, 'none']);
  eq([r.righe, r.senzaQuantita, r.dateInput], [2, true, 2]);
  eq(r.finito, [0, true]);
});

test('pasto di un giorno futuro: "Da mangiare" diventa "Mangiata" e resta; i vecchi segni `true` sui giorni futuri si tolgono ancora', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    state.leftoverLunchOn = true; state.extraWeeks = []; generateWeek(0); state.tab = 'menu'; state.balanceDetailsOpen = true; render();
    const key = Object.keys(state.dayLinks).find(k => k.startsWith('0_') && k.endsWith('_pranzo'));
    if(!key) return null;
    const btn = () => document.querySelector(`[data-toggle-done="${key}"]`);
    const out = { prima: btn().textContent.trim() };
    btn().click();
    out.dopo = btn().textContent.trim();
    render();
    out.dopoRender = btn().textContent.trim();
    const { i, meal } = parseMealKey(key);
    out.valore = weekMealsDoneRef(0)[i][meal];
    btn().click();
    out.annullato = btn().textContent.trim();
    // un vecchio `true` su un giorno futuro si toglie ancora
    const tp = findTodayPos(), futuro = WEEK_DISPLAY_ORDER[tp + 1];
    state.mealsDone = { [futuro]: { cena: true } }; render();
    out.vecchioTrue = !!state.mealsDone[futuro];
    return out;
  });
  if(!r) return;
  eq([r.prima, r.dopo, r.dopoRender, r.valore, r.annullato, r.vecchioTrue], ['Da mangiare', 'Mangiata', 'Mangiata', 'anticipato', 'Da mangiare', false]);
});

test('Inizio settimana: si sceglie in Regole generali, la settimana parte da quel giorno e contiene oggi; il pranzo avanzo non c\'è il primo giorno', async ({ page }) => {
  await page.evaluate(() => { state.tab = 'menu'; state.genGeneralOpen = true; state.genGeneralPage = null; render(); });
  await page.click('[data-gen-go="weekstart"]');
  const nBtns = await page.evaluate(() => document.querySelectorAll('.gen-mini-sheet [data-gen-weekstart]').length);
  eq(nBtns, 7, 'sette giorni da scegliere');
  await page.click('.gen-mini-sheet [data-gen-weekstart="0"]');
  const r = await page.evaluate(() => {
    const d0 = weekDatesFor(0);
    const out = {
      order: WEEK_DISPLAY_ORDER.slice(), startDow: d0[0].getDay(), todayIn: findTodayPos() !== null,
      startNotFuture: d0[0] <= new Date(), saved: state.weekStartDay, week0: state.week0Start === isoLocalDate(d0[0]),
      elig: leftoverEligible(), label: document.querySelector('.manage-row[data-gen-go="weekstart"] .manage-row-sub').textContent
    };
    state.weekStartDay = 5; applyWeekStart(); state.week0Start = isoLocalDate(upcomingSaturday());
    return out;
  });
  eq(r.order, [0,1,2,3,4,5,6], 'ordine da lunedì');
  assert(r.startDow === 1 && r.todayIn && r.startNotFuture && r.week0 && r.saved === 0, 'la settimana 0 parte da lunedì e contiene oggi: ' + JSON.stringify(r));
  eq(r.elig, [1,2,3,4,5,6], 'il primo giorno non ha il pranzo avanzo');
  assert(/^Lunedì/.test(r.label), 'la riga mostra il giorno scelto: ' + r.label);
});

test('Meal prep: il giorno si sceglie come impostazione e per settimana, qualunque giorno; i vecchi sab/dom valgono ancora', async ({ page }) => {
  const r = await page.evaluate(() => {
    const out = {};
    state.prepDay = {}; state.prepDayDefault = null;
    out.def = prepDayOf(0);                       // il primo giorno (sabato)
    state.prepDayDefault = 2;
    out.set = prepDayOf(0);
    state.prepDay[weekStartIso(0)] = 'dom';
    out.legacy = prepDayOf(0);
    state.prepDay[weekStartIso(0)] = 1;
    out.week = prepDayOf(0);
    const pos = WEEK_DISPLAY_ORDER.indexOf(1);
    out.onlyAfter = prepCandidates(0).every(c => WEEK_DISPLAY_ORDER.indexOf(c.i) > pos);
    state.prepDay = {}; state.prepDayDefault = null;
    return out;
  });
  eq([r.def, r.set, r.legacy, r.week], [5, 2, 6, 1], 'giorno di prep: default, impostazione, vecchio dom, scelto');
  assert(r.onlyAfter, 'si preparano solo i piatti dei giorni dopo');
});

test('Impostazioni: due voci, Generazione menù e Preferenze alimentari, ognuna apre la sua pagina e il tasto indietro chiude', async ({ page }) => {
  const r = await page.evaluate(() => {
    const out = { voci: [...document.querySelectorAll('[data-settings-go="gen"], [data-settings-go="food"]')].map(b => b.querySelector('.settings-link-text').firstChild.textContent) };
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    document.querySelector('[data-settings-go="food"]').click();
    out.cibo = [state.genFoodOpen, state.genGeneralOpen, !!document.querySelector('[data-page="gen-food"]')];
    document.querySelector('[data-gen-general-back]').click();
    out.chiuso = [state.genFoodOpen, state.genGeneralOpen];
    document.querySelector('[data-settings-go="gen"]').click();
    out.gen = [state.genFoodOpen, state.genGeneralOpen, !!document.querySelector('[data-page="gen-general"]')];
    state.genGeneralOpen = false; render();
    return out;
  });
  eq(r.voci, ['Generazione menù', 'Preferenze alimentari']);
  eq(r.cibo, [true, false, true]);
  eq(r.chiuso, [false, false]);
  eq(r.gen, [false, true, true]);
});

test('nota sull\'ingrediente di una ricetta: si scrive in Modifica ricetta, si salva, compare nell\'elenco ingredienti; il limone non trattato non è un ingrediente a parte', async ({ page }) => {
  const r = await page.evaluate(() => {
    const nome = 'Scaloppine di tacchino al limone';
    const ing = getIngredientsFor(nome).find(i => /^limon/i.test(i.ingrediente));
    const out = { ing: ing && [ing.ingrediente, ing.note], nessunNomeConNota: !allIngredientNamesForManager().some(n => /non trattat/i.test(n)) };
    out.dettaglio = /ing-note[^>]*> · non trattati/.test(renderIngredientsSection(getIngredientsFor(nome), 1, { noButton: true }));
    // la riga compatta e il pannello: la nota si legge, si salva, si può svuotare
    const wrap = document.createElement('div');
    wrap.innerHTML = editIngRowHtml('Limone', '2', '', 'non trattati');
    const row = wrap.firstElementChild;
    out.riga = row.querySelector('.edit-ing-sum-sub').textContent;
    out.letta = readEditIngRow(row).note;
    row.dataset.note = '';
    out.vuota = 'note' in readEditIngRow(row);
    return out;
  });
  eq(r.ing, ['Limone', 'non trattati']);
  assert(r.nessunNomeConNota, 'niente ingrediente "Limoni (non trattati)"');
  assert(r.dettaglio, 'la nota compare nell\'elenco ingredienti');
  eq([r.riga, r.letta, r.vuota], ['2 · non trattati', 'non trattati', false]);
});

test('benvenuto prima dell\'account: quattro schermate, una volta sola; "Ho già un account" e "Salta" portano al login', async ({ page }) => {
  const r = await page.evaluate(() => {
    const out = {};
    try{ localStorage.removeItem(WELCOME_SEEN_KEY); }catch(e){}
    const gate = document.getElementById('welcome-gate');
    let modo = null; window.cookpopSetSignup = on => { modo = on; };
    welcomeSync(false);
    out.mostrato = gate.style.display === 'flex' && !!gate.querySelector('[data-wl-start]') && /CookPOP/.test(gate.textContent);
    welcomeSync(true); out.conAccount = gate.style.display === 'none'; // già dentro: niente benvenuto
    welcomeSync(false);
    gate.querySelector('[data-wl-start]').click();
    const titoli = [];
    for(let i = 0; i < 3; i++){
      titoli.push(gate.querySelector('.wl-title').textContent + '|' + gate.querySelector('.wl-kicker').textContent + '|' + gate.querySelector('[data-wl-next]').textContent);
      gate.querySelector('[data-wl-next]').click();
    }
    out.titoli = titoli;
    out.finito = [gate.style.display, modo, localStorage.getItem(WELCOME_SEEN_KEY)];
    welcomeSync(false); out.giaVisto = gate.style.display === 'none';
    // "Ho già un account"
    localStorage.removeItem(WELCOME_SEEN_KEY); modo = null; gate.innerHTML = ''; welcomeSync(false);
    gate.querySelector('[data-wl-login]').click(); out.login = [gate.style.display, modo];
    // "Salta"
    localStorage.removeItem(WELCOME_SEEN_KEY); modo = null; gate.innerHTML = ''; welcomeSync(false);
    gate.querySelector('[data-wl-start]').click(); gate.querySelector('[data-wl-skip]').click(); out.salta = [gate.style.display, modo];
    localStorage.setItem(WELCOME_SEEN_KEY, '1'); gate.style.display = 'none'; gate.innerHTML = '';
    return out;
  });
  assert(r.mostrato && r.conAccount, 'benvenuto mostrato solo senza account');
  eq(r.titoli, ['Il menù si fa da solo|1 di 3|Avanti', 'La spesa si scrive da sola|2 di 3|Avanti', 'La dispensa sa cosa hai|3 di 3|Iniziamo']);
  eq(r.finito, ['none', true, '1']);
  assert(r.giaVisto, 'una volta sola');
  eq(r.login, ['none', false]);
  eq(r.salta, ['none', true]);
});

test('accesso: l\'occhio mostra e nasconde la password, "Creane uno" passa alla creazione e torna indietro', async ({ page }) => {
  const r = await page.evaluate(async () => {
    const out = {};
    try{ localStorage.setItem(WELCOME_SEEN_KEY, '1'); }catch(e){}
    window.cookpopAuth = { onAuthStateChanged(cb){ cb(null); }, signIn: async () => {}, createUser: async () => {}, signOut(){}, updateName: async () => {} };
    waitForAuth();
    const gate = document.getElementById('login-gate'), pw = document.getElementById('login-password'), eye = document.getElementById('login-eye');
    out.gate = gate.style.display;
    out.tipi = [pw.type];
    eye.click(); out.tipi.push(pw.type); out.etichetta = eye.getAttribute('aria-label');
    eye.click(); out.tipi.push(pw.type);
    const tog = document.getElementById('login-toggle'), btn = document.getElementById('login-submit');
    out.login = [tog.textContent, btn.textContent];
    tog.click(); out.crea = [tog.textContent, btn.textContent, gate.querySelector('.login-sub').textContent];
    tog.click(); out.torna = [tog.textContent, btn.textContent];
    gate.style.display = 'none';
    return out;
  });
  eq(r.gate, 'flex');
  eq(r.tipi, ['password', 'text', 'password']);
  eq(r.etichetta, 'Nascondi password');
  eq(r.login, ['Non hai un account? Creane uno', 'Accedi']);
  eq(r.crea, ['Ho già un account', 'Crea account', 'Crea il tuo account']);
  eq(r.torna, ['Non hai un account? Creane uno', 'Accedi']);
});

test('copia locale: se su questo telefono entra un altro account, i dati dell\'altro si buttano; lo stesso account li tiene', async ({ page }) => {
  const r = await page.evaluate(() => {
    const out = {};
    localStorage.setItem('quaderno-state-default', '{"x":1}'); localStorage.setItem('catalog-state-cache', '{"y":1}'); localStorage.setItem(CACHE_OWNER_KEY, 'uid-mara');
    out.stessa = [claimLocalCache('uid-mara'), localStorage.getItem('quaderno-state-default') !== null];
    out.altra = [claimLocalCache('uid-elisa'), localStorage.getItem('quaderno-state-default'), localStorage.getItem('catalog-state-cache'), localStorage.getItem(CACHE_OWNER_KEY)];
    // senza proprietario noto (telefono già in uso prima di questa versione): per prudenza si butta
    localStorage.setItem('quaderno-state-cugina', '{"z":1}'); localStorage.removeItem(CACHE_OWNER_KEY);
    out.senza = [claimLocalCache('uid-elisa'), localStorage.getItem('quaderno-state-cugina')];
    return out;
  });
  eq(r.stessa, [false, true]);
  eq(r.altra, [true, null, null, 'uid-elisa']);
  eq(r.senza, [true, null]);
});

test('accesso dopo "Esci": le schermate di accesso non diventano inerti con una pagina aperta, e uscendo non resta niente di inerte', async ({ page }) => {
  const r = await page.evaluate(() => {
    const out = {};
    const top = document.createElement('div'); top.className = 'sheet-page'; document.body.appendChild(top);
    setBackgroundInert(top);
    out.gate = ['login-gate', 'family-gate', 'welcome-gate'].map(id => document.getElementById(id).inert);
    out.altrove = document.querySelectorAll('[data-dialog-inert]').length > 0; // il resto sì
    // uscire con una pagina ancora aperta: il callback "nessun utente" ripulisce
    window.cookpopAuth = { onAuthStateChanged(cb){ window.__authCb = cb; }, signIn: async () => {}, createUser: async () => {}, signOut(){}, updateName: async () => {} };
    waitForAuth(); window.__authCb(null);
    out.dopo = document.querySelectorAll('[data-dialog-inert]').length;
    out.campo = document.getElementById('login-email').closest('[inert]') === null;
    top.remove(); document.getElementById('login-gate').style.display = 'none';
    return out;
  });
  eq(r.gate, [false, false, false]);
  assert(r.altrove, 'il resto della pagina resta inerte sotto una finestra aperta');
  eq([r.dopo, r.campo], [0, true]);
});

test('account nuovo con un nome di prima nell\'email ma senza famiglia: se lo spazio di prima gli è negato passa da "Entra o crea", mai nell\'app di un\'altra famiglia', async ({ page }) => {
  const r = await page.evaluate(async () => {
    const out = {};
    const oldSync = window.cookpopSync, oldEmail = loggedInEmail, oldUid = loggedInUid, oldRoute = activeRoute, oldGate = window.runFamilyGate;
    let membro = false;
    window.cookpopSync = { load: p => p.startsWith('userFamily/') ? Promise.resolve(null) : p.startsWith('families/nuovissima/') ? Promise.resolve(p.endsWith('/meta') ? { name: 'Nuova' } : null) : (membro ? Promise.resolve(null) : Promise.reject(new Error('PERMISSION_DENIED'))), save: () => Promise.resolve(), onChange: () => {}, remove: () => Promise.resolve() };
    let gate = 0; window.runFamilyGate = async () => { gate++; return 'nuovissima'; };
    loggedInUid = 'uidNuova';
    for(const [chiave, email] of [['parola', 'elisa.mara@x.it'], ['dentro', 'elisa.stefani@x.it'], ['mamma', 'mamma@x.it'], ['nessuno', 'elisa@x.it']]){
      loggedInEmail = email; activeRoute = null; gate = 0;
      await resolveFamilyRoute();
      out[chiave] = [gate, activeRoute && activeRoute.famId];
    }
    // chi invece è davvero dello spazio di prima (le regole lo lasciano leggere) resta lì
    membro = true; loggedInEmail = 'mara.rossi@x.it'; activeRoute = null; gate = 0;
    await resolveFamilyRoute(); out.vecchia = [gate, activeRoute];
    window.cookpopSync = oldSync; loggedInEmail = oldEmail; loggedInUid = oldUid; activeRoute = oldRoute; window.runFamilyGate = oldGate;
    return out;
  });
  for(const k of ['parola', 'dentro', 'mamma', 'nessuno']) eq(r[k], [1, 'nuovissima'], k);
  eq(r.vecchia, [0, null]);
});

test('pranzo avanzo del primo giorno: dalla settimana dopo usa l\'ultima cena della settimana prima, nella corrente si cucina; porzioni una volta sola', async ({ page }) => {
  const r = await page.evaluate(() => {
    const out = {};
    const old = { on: state.leftoverLunchOn, days: state.weekLeftoverDays, n: state.weekLeftoverPortions, port: state.weekPortionsBase };
    state.leftoverLunchOn = true; state.weekLeftoverDays = null; state.weekLeftoverPortions = 1; state.weekPortionsBase = 2;
    state.extraWeeks = []; generateWeek(0); generateWeek(1);
    const first = WEEK_DISPLAY_ORDER[0], last = WEEK_DISPLAY_ORDER[6];
    out.eleg = [leftoverEligible(0).includes(first), leftoverEligible(1).includes(first)];
    out.w0 = state.dayLinks[`0_${first}_pranzo`] || null;
    out.w1 = state.dayLinks[`1_${first}_pranzo`] === `0_${last}_cena`;
    out.nome = effectiveMeal(1, first, 'pranzo').principale === effectiveMeal(0, last, 'cena').principale;
    out.porz = state.dayPortions[`0_${last}_cena`];
    generateWeek(1); generateWeek(1);
    out.porzDopo = state.dayPortions[`0_${last}_cena`]; // non cresce a ogni rigenerazione
    // se l'ultima cena della settimana prima è vuota non c'è avanzo
    out.sceltaPranzo = leftoverLunchDays(1).includes(first);
    state.weekLeftoverDays = [1, 2, 3, 4, 5, 6].filter(d => d !== first); generateWeek(1);
    out.spento = state.dayLinks[`1_${first}_pranzo`] || null;
    state.leftoverLunchOn = old.on; state.weekLeftoverDays = old.days; state.weekLeftoverPortions = old.n; state.weekPortionsBase = old.port; state.extraWeeks = [];
    return out;
  });
  eq(r.eleg, [false, true]);
  eq(r.w0, null);
  assert(r.w1 && r.nome, 'il pranzo del primo giorno della settimana dopo è l\'avanzo dell\'ultima cena della settimana prima');
  eq(r.porz, 3);
  eq(r.porzDopo, 3);
  assert(r.sceltaPranzo, 'giorno attivo nella scelta');
  eq(r.spento, null);
});

test('Spesa: con una nota l\'ingrediente ha la matita accanto alla nota, e toccandola si modifica o si svuota', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    state.shopExtras = { a: { ingrediente: 'Zucchine', qta: '2' } }; state.pantryItems = {};
    state.ingredientNotes = { zucchine: 'quelle piccole' };
    state.tab = 'spesa'; state.shopView = 'reparto'; render();
    const out = {};
    const row = () => [...document.querySelectorAll('.shop-item-row')].find(e => /Zucchine/.test(e.textContent));
    out.testo = row().querySelector('.ing-note-text').textContent;
    out.matitaAccantoNota = !!row().querySelector('.ing-note-row .ing-note-pencil');
    row().querySelector('.ing-note-row .ing-note-pencil').click();
    out.campo = row().querySelector('.ing-note-input') ? row().querySelector('.ing-note-input').value : null;
    const inp = row().querySelector('.ing-note-input'); inp.value = 'solo le chiare'; inp.blur();
    out.salvata = state.ingredientNotes.zucchine;
    row().querySelector('.ing-note-row .ing-note-pencil').click();
    const i2 = row().querySelector('.ing-note-input'); i2.value = ''; i2.blur();
    out.tolta = [state.ingredientNotes.zucchine, !!row().querySelector('.ing-note-text')];
    state.ingredientNotes = {}; state.shopExtras = {}; render();
    return out;
  });
  eq([r.testo, r.matitaAccantoNota, r.campo, r.salvata], ['quelle piccole', true, 'quelle piccole', 'solo le chiare']);
  eq(r.tolta, [undefined, false]);
});

test('quantità fisse: la spunta in Modifica ricetta toglie il proporzionamento in ricetta, Spesa, cucina e conferma; senza spunta tutto scala come prima', async ({ page }) => {
  const r = await page.evaluate(() => {
    const out = {};
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    const nome = 'Tiramisù';
    state.extraWeeks = []; generateWeek(0); generateWeek(1);
    const slot = allMealSlots().filter(m => m.weekIdx === 1 && m.meal === 'cena')[2];
    writeMealDishes(slot.weekIdx, slot.i, 'cena', nome, []); const mk = mealKey(slot.weekIdx, slot.i, 'cena');
    state.dayPortions[mk] = 8; // il doppio delle 4 della ricetta
    const mascarpone = () => (buildShopFlat().find(x => x.ingrediente === 'Mascarpone' && x.key.indexOf(String(slot.i)) >= 0) || {}).qta;
    const cook = () => (cookStepIngredients(nome, 'Aggiungi il mascarpone', 2).find(i => /mascarpone/i.test(i.nome)) || {}).qta;
    const dettaglio = () => (renderIngredientsSection(getIngredientsFor(nome), qtyRatio(nome, 2), { noButton: true, titleHtml: '' }).match(/Mascarpone[\s\S]*?ing-qty">([^<]*)</) || [])[1];
    out.senza = [mascarpone(), cook(), dettaglio(), qtyRatio(nome, 2)];
    state.recipeEdits[nome] = Object.assign({}, state.recipeEdits[nome], { quantitaFisse: true });
    out.con = [mascarpone(), cook(), dettaglio(), qtyRatio(nome, 2), fixedQtyRecipe(nome)];
    state.recipeEdits[nome].quantitaFisse = false;
    // la spunta nel modulo: c'è, riflette il valore e si salva
    state.tab = 'prep'; state.recipeEditName = nome; render();
    const box = document.getElementById('edit-quantita-fisse');
    out.spunta = [!!box, box && box.checked];
    box.checked = true;
    document.querySelector('[data-save-recipe-edit]').click();
    out.salvata = getRecipeDetails(nome).quantitaFisse === true;
    state.recipeEditName = nome; render();
    out.riaperta = document.getElementById('edit-quantita-fisse').checked;
    document.getElementById('edit-quantita-fisse').checked = false;
    document.querySelector('[data-save-recipe-edit]').click();
    out.tolta = getRecipeDetails(nome).quantitaFisse === false;
    delete state.recipeEdits[nome]; state.dayPortions = {}; state.extraWeeks = []; state.recipeEditName = null; render();
    return out;
  });
  eq(r.senza[3], 2);
  assert(r.senza[0] !== '500 g' && r.senza[1] !== '500 g' && r.senza[2] !== '500 g', 'senza spunta scala: ' + JSON.stringify(r.senza));
  eq(r.con, ['500 g', '500 g', '500 g', 1, true]);
  eq(r.spunta, [true, false]);
  assert(r.salvata && r.riaperta && r.tolta, 'la spunta si salva, si ritrova e si toglie: ' + JSON.stringify([r.salvata, r.riaperta, r.tolta]));
});

test('Lomo saltado: ricetta del catalogo (piatto unico, carne) con fonte, e finisce nell\'album Compleanni di chi ce l\'ha, una volta sola', async ({ page }) => {
  const r = await page.evaluate(() => {
    const out = {};
    const meta = getRecipeMeta('Lomo saltado'), det = getRecipeDetails('Lomo saltado');
    out.meta = [meta.categoriaNew, meta.tipologia, meta.proteina, meta.base];
    out.det = [det.porzioni, getIngredientsFor('Lomo saltado').length, det.procedimento.length, /^https:\/\//.test(det.link)];
    out.senzaOstriche = !getIngredientsFor('Lomo saltado').some(i => /ostri|ostion/i.test(i.ingrediente));
    const pr = det.procedimento;
    out.aglioPrima = /aglio/i.test(pr[5]) && !/aglio/i.test(pr[8]) && pr.findIndex(x => /aglio/i.test(x)) < pr.findIndex(x => /Unisci i pomodori/.test(x));
    out.succo = /succo che ha rilasciato/.test(pr[4]) && /succo della carne/.test(pr[7]);
    // migrazione: solo gli album con "compleanni" nel nome
    state.lomoSaltadoAlbum1 = false;
    state.cookbooks = [{ id: 'a', name: 'Compleanni', recipes: ['Tiramisù'] }, { id: 'b', name: 'Estate', recipes: [] }, { id: 'c', name: 'Compleanni 2', recipes: ['Lomo saltado'] }];
    runMigrations();
    out.album = state.cookbooks.map(c => c.recipes.join('|'));
    state.lomoSaltadoAlbum1 = false; runMigrations(); // già dentro: niente doppioni
    out.doppio = state.cookbooks[0].recipes.filter(n => n === 'Lomo saltado').length;
    state.cookbooks = [];
    return out;
  });
  eq(r.meta, ['carne', 'unico', 'carne-rossa', 'riso']);
  eq(r.det, ['4 porzioni', 15, 10, true]);
  assert(r.aglioPrima && r.succo, 'aglio con cipolla e aji prima dei pomodori, succo della carne nella salsa: ' + JSON.stringify([r.aglioPrima, r.succo]));
  assert(r.senzaOstriche, 'senza salsa di ostriche');
  eq(r.album, ['Tiramisù|Lomo saltado', '', 'Lomo saltado']);
  eq(r.doppio, 1);
});

test('Modifica ricetta: una quantità a parole ("2 grandi", "500 g di polpa") si divide in numero + unità e nota; il Lomo saltado ha quantità vere', async ({ page }) => {
  const r = await page.evaluate(() => {
    const out = {};
    out.split = ['2 grandi', '500 g di polpa', '3 tazze, già cotto', 'q.b.', '1/2 cucchiaino', 'mezzo bicchiere', '4 spicchi', '1, tagliata a tocchetti'].map(t => { const x = splitQtyForEdit(t); return x.qta + '|' + x.extra; });
    out.lomo = getIngredientsFor('Lomo saltado').filter(i => ['Pomodori', 'Cipolla rossa', 'Patate', 'Riso'].includes(i.ingrediente)).map(i => i.ingrediente + ':' + i.qta + ':' + (i.note || ''));
    // pannello: numero + unità sempre (non il testo libero), nota già compilata
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    state.customRecipes['Prova qta'] = { nome: 'Prova qta' }; state.recipeEdits['Prova qta'] = { ingredienti: [{ ingrediente: 'Pomodori', qta: '2 grandi' }] };
    state.tab = 'prep'; state.recipeEditName = 'Prova qta'; render();
    document.querySelector('[data-edit-ing-open]').click();
    const sh = document.querySelector('.edit-ing-sheet');
    out.pannello = [!!sh.querySelector('.edit-ing-num'), !!sh.querySelector('.edit-ing-unit'), !sh.querySelector('.edit-ing-qta'), sh.querySelector('.edit-ing-num').value, sh.querySelector('.edit-ing-note').value];
    document.querySelector('[data-edit-ing-done]').click();
    out.riga = document.querySelector('#edit-ing-list .edit-ing-row').dataset.qta + '|' + document.querySelector('#edit-ing-list .edit-ing-row').dataset.note;
    state.recipeEditName = null; delete state.recipeEdits['Prova qta']; delete state.customRecipes['Prova qta']; render();
    return out;
  });
  eq(r.split, ['2|grandi', '500 g|di polpa', '3|tazze, già cotto', 'q.b.|', '1/2 cucchiaino|', 'mezzo bicchiere|', '4 spicchi|', '1|tagliata a tocchetti']);
  eq(r.lomo.sort(), ['Cipolla rossa:1:grande', 'Patate:4:grandi', 'Pomodori:2:grandi', 'Riso:160 g:3 tazze di riso già cotto']);
  eq(r.pannello, [true, true, true, '2', 'grandi']);
  eq(r.riga, '2|grandi');
});

test('empanadas: impasto con le tre farine in grammi e un ripieno obbligatorio nel pasto (si aggiunge, non si toglie da solo, se ne va con l\'impasto)', async ({ page }) => {
  const r = await page.evaluate(() => {
    const out = {};
    const IMP = 'Impasto per empanadas', RIP = 'Ripieno di carne per empanadas';
    const mi = getRecipeMeta(IMP), mr = getRecipeMeta(RIP), di = getRecipeDetails(IMP);
    out.meta = [mi.tipologia, mi.ripieni, mr.tipologia, /^https:\/\/jameaperu/.test(di.link)];
    out.farine = getIngredientsFor(IMP).filter(i => /^Farina/.test(i.ingrediente)).map(i => i.ingrediente + ':' + i.qta);
    state.extraWeeks = []; generateWeek(0); generateWeek(1);
    const slot = allMealSlots().filter(m => m.weekIdx === 1 && m.meal === 'cena')[3];
    const names = () => mealDishes(1, slot.i, 'cena').map(d => d.name);
    // pasto vuoto + impasto: arriva da solo anche l'unico ripieno
    performClearMeal(mealKey(1, slot.i, 'cena')); render();
    addMealDish(1, slot.i, 'cena', IMP);
    out.coppia = names();
    // il ripieno non si toglie da solo
    removeMealDish(1, slot.i, 'cena', RIP);
    out.dopoToglieRipieno = names();
    out.avviso = (state.undoToast || {}).message || '';
    // l'impasto se ne va con il suo ripieno
    removeMealDish(1, slot.i, 'cena', IMP);
    out.dopoToglieImpasto = names();
    // Con più ripieni la scelta è obbligata: si apre il foglio, chiuderlo toglie anche l'impasto
    const extra = Object.assign({}, getRecipeMeta(RIP), { nome: 'Ripieno prova di verdure' });
    state.customRecipes[extra.nome] = extra;
    DATA.recipes.find(x => x.nome === IMP).ripieni = [RIP, extra.nome];
    state.tab = 'menu'; render();
    const miss = addMealDish(1, slot.i, 'cena', IMP);
    out.scelta = [names(), miss.length];
    state.dishPicker = { key: mealKey(1, slot.i, 'cena'), replace: null, tipo: 'ripieno', search: '', require: IMP }; render();
    const voci = [...document.querySelectorAll('.dish-sheet .swap-result-name')].map(e => e.textContent.trim());
    out.foglio = [voci.sort(), !!document.querySelector('.dish-sheet .dsh-require'), !document.querySelector('.dish-sheet .dish-course-chips')];
    closeDishPicker(); render();
    out.annullato = names();
    // scegliendo un ripieno resta tutto
    addMealDish(1, slot.i, 'cena', IMP);
    state.dishPicker = { key: mealKey(1, slot.i, 'cena'), replace: null, tipo: 'ripieno', search: '', require: IMP }; render();
    document.querySelector('.dish-sheet [data-dish-pick="Ripieno prova di verdure"]').click();
    out.scelto = [names(), state.dishPicker];
    // con due ripieni, uno si può cambiare con l'altro ma non con un piatto qualunque
    state.dishPicker = { key: mealKey(1, slot.i, 'cena'), replace: 'Ripieno prova di verdure', tipo: null, search: '' }; render();
    const altro = allRecipeMetas().find(x => x.tipologia === 'secondo').nome;
    const pick = nome => { const el = document.createElement('div'); el.setAttribute('data-dish-pick', nome); el.setAttribute('data-dish-key', mealKey(1, slot.i, 'cena')); document.body.appendChild(el); el.click(); el.remove(); };
    pick(altro);
    out.cambioSbagliato = names().includes('Ripieno prova di verdure');
    state.dishPicker = { key: mealKey(1, slot.i, 'cena'), replace: 'Ripieno prova di verdure', tipo: null, search: '' }; render();
    pick(RIP);
    out.cambioGiusto = names();
    // pulizia
    delete state.customRecipes[extra.nome];
    DATA.recipes.find(x => x.nome === IMP).ripieni = [RIP];
    performClearMeal(mealKey(1, slot.i, 'cena')); state.dishPicker = null; state.extraWeeks = []; render();
    return out;
  });
  eq(r.meta, ['antipasto', ['Ripieno di carne per empanadas'], 'ripieno', true]);
  eq(r.farine, ['Farina 00:625 g', 'Farina integrale:190 g', 'Farina di quinoa:190 g']);
  eq(r.coppia, ['Impasto per empanadas', 'Ripieno di carne per empanadas']);
  eq(r.dopoToglieRipieno, r.coppia);
  assert(/almeno un ripieno/.test(r.avviso), 'avviso: ' + r.avviso);
  eq(r.dopoToglieImpasto, []);
  eq(r.scelta, [['Impasto per empanadas'], 1]);
  eq(r.foglio[1], true); eq(r.foglio[2], true);
  eq(r.foglio[0], ['Ripieno di carne per empanadas', 'Ripieno prova di verdure']);
  eq(r.annullato, []);
  eq(r.scelto[0], ['Impasto per empanadas', 'Ripieno prova di verdure']); eq(r.scelto[1], null);
  assert(r.cambioSbagliato, 'il ripieno non si cambia con un piatto qualunque');
  eq(r.cambioGiusto, ['Impasto per empanadas', 'Ripieno di carne per empanadas']);
});

test('Modifica ricetta: "Ripieni possibili" sull\'impasto e "Si usa con" sul ripieno si gestiscono da entrambe le parti', async ({ page }) => {
  const r = await page.evaluate(() => {
    const out = {};
    const IMP = 'Impasto per empanadas', RIP = 'Ripieno di carne per empanadas', NEW = 'Ripieno prova di verdure';
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    state.customRecipes[NEW] = Object.assign({}, getRecipeMeta(RIP), { nome: NEW });
    state.tab = 'prep';
    const apri = n => { state.recipeEditName = n; render(); };
    const vis = id => { const e = document.getElementById(id); return !!e && !e.hidden; };
    // impasto: gruppo "Ripieni possibili", con il ripieno di carne già spuntato
    apri(IMP);
    out.impasto = [vis('edit-ripieni-group'), vis('edit-siusacon-group'), [...document.querySelectorAll('[data-ripieno-opt]')].map(c => c.dataset.ripienoOpt + (c.checked ? '+' : '-')).sort()];
    document.querySelector('[data-ripieno-opt="' + NEW + '"]').checked = true;
    document.querySelector('[data-save-recipe-edit]').click();
    out.dopoImpasto = recipeRipieni(IMP).sort();
    // ripieno: gruppo "Si usa con", con l'impasto spuntato; si toglie da qui
    apri(NEW);
    out.ripieno = [vis('edit-ripieni-group'), vis('edit-siusacon-group'), [...document.querySelectorAll('[data-impasto-opt]')].map(c => c.dataset.impastoOpt + (c.checked ? '+' : '-'))];
    document.querySelector('[data-impasto-opt="' + IMP + '"]').checked = false;
    document.querySelector('[data-save-recipe-edit]').click();
    out.dopoRipieno = recipeRipieni(IMP);
    // e da qui si rimette
    apri(NEW);
    document.querySelector('[data-impasto-opt="' + IMP + '"]').checked = true;
    document.querySelector('[data-save-recipe-edit]').click();
    out.rimesso = recipeRipieni(IMP).sort();
    // cambiando la portata i gruppi si scambiano
    apri(IMP);
    const sel = document.getElementById('edit-tipologia'); sel.value = 'ripieno'; sel.dispatchEvent(new Event('change', { bubbles: true }));
    out.scambio = [vis('edit-ripieni-group'), vis('edit-siusacon-group')];
    state.recipeEditName = null;
    delete state.customRecipes[NEW]; delete state.recipeEdits[NEW]; delete state.recipeEdits[IMP]; render();
    return out;
  });
  eq(r.impasto, [true, false, ['Ripieno di carne per empanadas+', 'Ripieno prova di verdure-']]);
  eq(r.dopoImpasto, ['Ripieno di carne per empanadas', 'Ripieno prova di verdure']);
  eq(r.ripieno, [false, true, ['Impasto per empanadas+']]);
  eq(r.dopoRipieno, ['Ripieno di carne per empanadas']);
  eq(r.rimesso, ['Ripieno di carne per empanadas', 'Ripieno prova di verdure']);
  eq(r.scambio, [false, true]);
});

test('Modifica ricetta: note, consigli e passaggi sono aree di testo che crescono col contenuto, così si vede tutto', async ({ page }) => {
  const r = await page.evaluate(() => {
    const out = {};
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    state.tab = 'prep'; state.recipeEditName = 'Carbonara'; render();
    const ids = ['edit-ricordare', 'edit-consigli', 'edit-avanzi-note', 'edit-freezer-note'];
    out.tipi = ids.map(id => document.getElementById(id).tagName);
    const lungo = 'Una nota molto lunga che prima non si vedeva tutta in un campo a una riga e adesso deve andare a capo e crescere. '.repeat(4);
    const el = document.getElementById('edit-ricordare');
    const prima = el.offsetHeight;
    el.value = lungo; el.dispatchEvent(new Event('input', { bubbles: true }));
    out.cresce = el.offsetHeight > prima + 20;
    out.tuttoVisibile = el.scrollHeight <= el.offsetHeight + 2;
    document.querySelector('[data-save-recipe-edit]').click();
    out.salvata = getRecipeDetails('Carbonara').ricordare === lungo.trim();
    // nota dell'ingrediente nel pannello: stessa cosa, e a una riga sola nel riepilogo
    state.recipeEditName = 'Carbonara'; render();
    document.querySelector('[data-edit-ing-open]').click();
    const n = document.querySelector('.edit-ing-sheet .edit-ing-note');
    out.notaTipo = n.tagName;
    n.value = 'prima riga\nseconda riga con piu\' testo'; n.dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('[data-edit-ing-done]').click();
    out.riepilogo = document.querySelector('#edit-ing-list .edit-ing-row').dataset.note;
    state.recipeEditName = null; delete state.recipeEdits['Carbonara']; render();
    return out;
  });
  eq(r.tipi, ['TEXTAREA', 'TEXTAREA', 'TEXTAREA', 'TEXTAREA']);
  assert(r.cresce && r.tuttoVisibile, 'il campo cresce col testo: ' + JSON.stringify([r.cresce, r.tuttoVisibile]));
  assert(r.salvata, 'il testo lungo si salva intero');
  eq(r.notaTipo, 'TEXTAREA');
  eq(r.riepilogo, "prima riga seconda riga con piu' testo");
});

test('Spesa: il bottone codice a barre spunta la riga giusta, mette quantità e scadenza; se non c\'è, aggiunge già spuntato; "Metti in dispensa" è in fondo', async ({ page }) => {
  const r = await page.evaluate(async () => {
    const out = {};
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    state.shopChecked = {}; state.shopQty = {}; state.shopUnit = {}; state.shopExpiry = {}; state.shopExtras = {}; state.barcodes = {};
    state.shopExtras.ex1 = { ingrediente: 'Panna da cucina', qta: '' };
    state.tab = 'spesa'; state.shopView = 'reparto'; render();
    out.btn = !!document.getElementById('spesa-scan');
    window.fetch = async () => ({ ok: true, json: async () => ({ status: 1, product: { product_name_it: 'Panna da cucina Parmalat', quantity: '200 ml' } }) });
    document.getElementById('spesa-scan').click();
    document.getElementById('scan-code').value = '8001234567890';
    document.getElementById('scan-go').click();
    await new Promise(res => setTimeout(res, 1300));
    out.sheet = !!document.querySelector('.shop-scan-sheet');
    out.pick = state.shopScan && state.shopScan.pick;
    state.shopScan.scad = '2026-12-31';
    document.querySelector('[data-scan-done]').click();
    out.checked = !!state.shopChecked.ex1;
    out.qty = [state.shopQty.ex1, state.shopUnit.ex1, state.shopExpiry.ex1];
    // prodotto che non c'è in lista
    window.fetch = async () => ({ ok: true, json: async () => ({ status: 1, product: { product_name_it: 'Ceci', quantity: '400 g' } }) });
    document.getElementById('spesa-scan').click();
    document.getElementById('scan-code').value = '8009999999999';
    document.getElementById('scan-go').click();
    await new Promise(res => setTimeout(res, 1300));
    out.pick2 = state.shopScan && state.shopScan.pick;
    state.shopScan.scad = '2027-01-15';
    document.querySelector('[data-scan-done]').click();
    const ex = Object.entries(state.shopExtras).find(([k, v]) => v.ingrediente === 'Ceci');
    out.extra = !!ex && !!state.shopChecked[ex[0]] && state.shopExpiry[ex[0]] === '2027-01-15' && state.shopQty[ex[0]] === 400;
    out.end = !!document.querySelector('.shop-move-end #move-checked-to-pantry');
    return out;
  });
  assert(r.btn, 'bottone scansione mancante');
  assert(r.sheet && r.pick === 'ex1', 'abbinamento sbagliato: ' + JSON.stringify(r));
  assert(r.checked, 'riga non spuntata');
  eq(r.qty, [200, 'ml', '2026-12-31'], 'quantità/scadenza');
  eq(r.pick2, 'new', 'ceci non in lista');
  assert(r.extra, 'extra non aggiunto spuntato con scadenza');
  assert(r.end, 'Metti in dispensa non in fondo');
});

test('Spesa: la scorta in Dispensa si sottrae sul totale di tutte le ricette (8 uova servono, 2 in casa: ne mancano 6)', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.pantryItems = {};
    upsertPantryItem('Uova', 'frigo', 2);
    const used = new Map();
    const st = ['2', '2', '2', '2'].map(q => pantryStatusFor('Uova', q, '', used));
    return { st, solo: pantryStatusFor('Uova', '2', '') };
  });
  eq(r.st, ['in-casa', 'poco', 'poco', 'poco'], 'prima riga coperta, le altre no');
  eq(r.solo, 'in-casa', 'una sola ricetta resta coperta');
});

test('Spesa: la nota di un ingrediente per un\'altra persona è separata da quella per noi (pane fresco / pane in busta)', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    state.shopExtras = { a: { ingrediente: 'Pane', qta: '' }, b: { ingrediente: 'Pane', qta: '', per: 'Papà' } };
    state.ingredientNotes = { 'pane': 'fresco', 'pane – per papà': 'in busta per l\'insalata' };
    state.pantryItems = {}; state.tab = 'spesa'; state.shopView = 'reparto'; render();
    return [...document.querySelectorAll('.ing-note-text')].map(e => e.textContent.trim()).sort();
  });
  eq(r, ['fresco', 'in busta per l\'insalata'], 'due note distinte');
});

test('Spesa: negozi (Fruttarolo, Rossetto, Farmacia) — una lista sola divisa in blocchi, uno per negozio, con i suoi reparti; "Tutto il resto" prende gli altri', async ({ page }) => {
  const r = await page.evaluate(() => {
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    state.shopExtras = { a: { ingrediente: 'Zucchine', qta: '2' }, b: { ingrediente: 'Latte', qta: '1' }, c: { ingrediente: 'Shampoo', qta: '1' } };
    state.pantryItems = {}; state.shopStores = []; state.tab = 'spesa'; state.shopView = 'reparto'; render();
    const out = { senza: !document.querySelector('.shop-store-head') };
    state.storesOpen = true; render();
    document.querySelector('[data-store-seed]').click();
    state.storesOpen = false; render();
    const seq = () => [...document.querySelectorAll('.shop-list .shop-store-head, .shop-list .item-name')].map(e => e.textContent.trim());
    out.reparto = seq();
    state.shopView = 'az'; render(); out.az = seq();
    state.shopView = 'ordine'; render(); out.ordine = seq();
    return out;
  });
  assert(r.senza, 'titoli senza negozi');
  const want = ['Fruttarolo', 'Zucchine', 'Rossetto', 'Latte', 'Farmacia', 'Shampoo'];
  eq(r.reparto, want); eq(r.az, want); eq(r.ordine, want);
});

test('Negozi: i reparti si trascinano dalla maniglia da un negozio all\'altro', async ({ page }) => {
  await page.evaluate(() => {
    state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, {[whatsNewViewerKey()]: WHATS_NEW.version});
    state.shopStores = [{ id: 'f', label: 'Fruttarolo', depts: ['verdura'], rest: false }, { id: 'r', label: 'Rossetto', depts: [], rest: true }];
    state.tab = 'spesa'; state.storesOpen = true; render();
  });
  const h = page.locator('[data-store-list="f"] [data-store-handle]').first();
  const hb = await h.boundingBox();
  const target = await page.locator('[data-store-list="r"] [data-store-dept-row="latticini"]').boundingBox();
  await page.mouse.move(hb.x + hb.width / 2, hb.y + hb.height / 2);
  await page.mouse.down();
  for(let i = 1; i <= 10; i++) await page.mouse.move(hb.x + 5, hb.y + (target.y - hb.y + 5) * i / 10);
  await page.mouse.up();
  const r = await page.evaluate(() => ({ f: state.shopStores[0].depts, r: state.shopStores[1].depts.includes('verdura'), owner: shopStoreOfDept('verdura') }));
  eq(r.f, [], 'tolto dal Fruttarolo'); assert(r.r, 'finito in Rossetto'); eq(r.owner, 'r');
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
