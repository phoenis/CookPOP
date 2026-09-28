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
  await page.evaluate(() => { state.whatsNewSeenBy = Object.assign({}, state.whatsNewSeenBy, { [whatsNewViewerKey()]: WHATS_NEW.version }); });
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
