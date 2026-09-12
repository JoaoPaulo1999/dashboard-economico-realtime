const REFRESH_SECONDS = 10;
const fallback = {
  gdpAnnual: '3,4%', gdpQuarter: '0,50%', gdpReal: 'R$ 3,20 tri', gdpCapita: 'R$ 55.247', selic: '15,00%', ipca: '5,35%', cdi: '13,90%', cdiDaily: '0,05%', igpm: '4,20%',
  usd: 'R$ 5,42', usdTourism: 'R$ 5,67', eur: 'R$ 6,33', cny: 'R$ 0,76', jpy: 'R$ 0,037', ibov: '138.963', sp500: '6.388', nikkei: '42.807', shanghai: '3.807', eurostoxx: '5.445',
  iron: 'US$ 101,20', soy: 'US$ 1.027', corn: 'US$ 421,50', coffee: 'US$ 3,86', gold: 'US$ 3.371', oil: 'US$ 71,40', sugar: 'US$ 16,90', pulp: 'US$ 650,00', beef: 'US$ 6.180', ibcr: '--', ibcrNorte: '-2,75%', ibcrNordeste: '3,60%', ibcrCentroOeste: '4,84%', ibcrSudeste: '-0,08%', ibcrSul: '-1,60%', tradeYear: '+US$ 54,1 bi', tradeExportsYear: 'US$ 242,7 bi', tradeImportsYear: 'US$ 188,5 bi', tradeExportsMonth: 'US$ 24,1 bi', tradeImportsMonth: 'US$ 19,0 bi', tradeBalanceMonth: '+US$ 5,1 bi', tradeQ1: '+14,4', tradeQ2: '+27,6', tradeQ3: '+12,2', tradeQ4: '--'
};
const ids = Object.keys(fallback);
const byId = id => document.getElementById(id);
const setText = (id, value) => {
  const element = byId(id);
  if (!element) return;
  element.textContent = value;
  const card = element.closest('.metric-card, .market-card, .trade-card');
  if (card) {
    card.classList.remove('is-updating');
    void card.offsetWidth;
    card.classList.add('is-updating');
  }
};
function renderFallback() { ids.forEach(id => setText(id, 'N/D')); }
function setMarketChanges() {
  ['usdChange','usdTourismChange','eurChange','cnyChange','jpyChange','ibovChange','sp500Change','nikkeiChange','shanghaiChange','eurostoxxChange','ironChange','soyChange','cornChange','coffeeChange','goldChange','oilChange','sugarChange','pulpChange','beefChange'].forEach(id => setText(id, 'N/D'));
}
const comparisons = {
  gdpAnnual: '+0,4 pp', gdpQuarter: '+0,3 pp', gdpReal: '+1,1%', gdpCapita: '+6,1%', selic: '0,0 pp', ipca: '-0,3 pp', cdi: '0,0 pp', cdiDaily: '0,0 pp', igpm: '+0,2 pp', ibcCurrent: '+0,4%', ibcMonthly: '+0,4%', ibcYearly: '+2,0%', ibcrNorte: 'N/D', ibcrNordeste: 'N/D', ibcrCentroOeste: 'N/D', ibcrSudeste: 'N/D', ibcrSul: 'N/D', agro: '+1,0%', industry: '-1,4%', services: '-0,5%', taxes: '-1,0%',
  usd: '+0,24%', usdTourism: '+0,24%', eur: '+0,51%', cny: '+0,28%', jpy: '-0,16%', ibov: '+1,18%', sp500: '+0,42%', nikkei: '-0,18%', shanghai: '+0,31%', eurostoxx: '+0,27%',
  iron: '-1,42%', soy: '+0,68%', corn: '-0,35%', coffee: '+1,24%', gold: '+0,51%', oil: '+0,44%', sugar: '-0,76%', pulp: '+0,21%', beef: '+0,60%', ibcr: '+0,2%'
};
const sparkPatterns = [
  '2,18 12,15 22,17 32,10 42,13 52,7 62,9 72,4',
  '2,16 12,18 22,12 32,14 42,8 52,11 62,6 72,8',
  '2,9 12,14 22,10 32,15 42,9 52,12 62,5 72,7',
  '2,17 12,12 22,15 32,9 42,11 52,5 62,8 72,3'
];
function addComparison(container, value) {
  if (!container || container.querySelector('.comparison-line')) return;
  const negative = value.startsWith('-');
  if (value === 'N/D') {
    const unavailable = document.createElement('div');
    unavailable.className = 'comparison-line';
    unavailable.innerHTML = '<span>N/D</span><small>não publicado</small>';
    container.append(unavailable);
    return;
  }
  const basePattern = sparkPatterns[Math.floor(Math.random() * sparkPatterns.length)];
  const pattern = negative ? basePattern.split(' ').map(point => {
    const [x, y] = point.split(',').map(Number);
    return `${x},${22 - y}`;
  }).join(' ') : basePattern;
  const line = document.createElement('div');
  line.className = `comparison-line ${negative ? 'comparison-negative' : 'comparison-positive'}`;
  line.innerHTML = `<span>${negative ? '▼' : '▲'} ${value}</span><svg class="sparkline" viewBox="0 0 74 22" aria-hidden="true"><polyline points="${pattern}"></polyline></svg><small>vs. anterior</small>`;
  container.append(line);
}
function renderComparisons() {
  document.querySelectorAll('.metric-card[data-metric]').forEach(card => addComparison(card, comparisons[card.dataset.metric]));
  [['usd', 0], ['usdTourism', 1], ['eur', 2], ['cny', 3], ['jpy', 4]].forEach(([id, index]) => addComparison(document.querySelectorAll('.currency-row')[index], comparisons[id]));
  ['ibov', 'sp500', 'nikkei', 'shanghai', 'eurostoxx'].forEach((id, index) => addComparison(document.querySelectorAll('.index-row')[index], comparisons[id]));
  ['iron', 'soy', 'corn', 'coffee', 'gold', 'oil', 'sugar', 'pulp', 'beef'].forEach((id, index) => addComparison(document.querySelectorAll('.commodity-grid>div')[index], comparisons[id]));
}
function enableCommodityInteractions() {
  document.querySelectorAll('.commodity-icon').forEach(image => image.remove());
  document.querySelectorAll('.commodity-grid>div').forEach(card => {
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-pressed', 'false');
    const toggle = () => {
      const selected = card.classList.toggle('is-selected');
      card.setAttribute('aria-pressed', String(selected));
    };
    card.addEventListener('click', toggle);
    card.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggle(); } });
  });
}
function markNegativeNumbers() {
  document.querySelectorAll('.value, .currency-row strong, .index-row strong, .commodity-grid strong, .trade-card strong, .quarter-values b, .forecast-row strong').forEach(element => {
    const text = element.textContent.trim();
    element.classList.toggle('negative-number', /^-\d/.test(text));
    element.classList.toggle('positive-number', /^\+\d/.test(text));
  });
}
function formatTrade(value) {
  const billions = value / 1000;
  return `${billions >= 0 ? '+' : '-'}US$ ${Math.abs(billions).toFixed(1).replace('.', ',')} bi`;
}
function formatTradeAmount(value) {
  return `US$ ${(value / 1000).toFixed(1).replace('.', ',')} bi`;
}
function formatQuarterTrade(value) {
  return `${value >= 0 ? '+' : '-'}${Math.abs(value / 1000).toFixed(1).replace('.', ',')}`;
}
let stateGdpRows = [];
let stateGdpPage = 0;
const STATE_GDP_PAGE_SIZE = 6;
function renderStateGdp() {
  const list = byId('stateGdpList');
  if (!list || !stateGdpRows.length) return;
  const pageCount = Math.ceil(stateGdpRows.length / STATE_GDP_PAGE_SIZE);
  const page = stateGdpRows.slice(stateGdpPage * STATE_GDP_PAGE_SIZE, stateGdpPage * STATE_GDP_PAGE_SIZE + STATE_GDP_PAGE_SIZE);
  list.innerHTML = page.map(row => `<div class="state-gdp-row"><span>${row.name}</span><strong>R$ ${(row.value / 1_000_000).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} bi</strong></div>`).join('');
  setText('stateGdpNote', `IBGE / SIDRA · ${page[0].year} · página ${stateGdpPage + 1}/${pageCount}`);
  stateGdpPage = (stateGdpPage + 1) % pageCount;
}
async function updateStateGdp() {
  const rows = await fetchJson('https://apisidra.ibge.gov.br/values/t/5938/n3/all/v/37/p/last');
  stateGdpRows = rows.filter(row => row.D1C && row.V && row.V !== '-' && row.D1N).map(row => ({ name: row.D1N, value: Number(row.V), year: row.D3N })).filter(row => Number.isFinite(row.value)).sort((a, b) => b.value - a.value);
  if (!stateGdpRows.length) throw new Error('PIB estadual indisponível');
  renderStateGdp();
}
async function updateTradeBalance() {
  const now = new Date();
  const year = now.getFullYear();
  const page = await fetch(`https://balanca.economia.gov.br/balanca/pg_principal_bc/principais_resultados.html?atualizacao=${Date.now()}`, { cache: 'no-store', signal: AbortSignal.timeout(8000) }).then(response => response.text());
  const documentPage = new DOMParser().parseFromString(page, 'text/html');
  const parseValue = value => Number(value.replace(/\./g, '').replace(',', '.').replace(/[^0-9.-]/g, ''));
  const rows = [...documentPage.querySelectorAll('tr')].map(row => [...row.querySelectorAll('th,td')].map(cell => cell.textContent.trim())).filter(row => row.length >= 8);
  const monthRows = rows.filter(row => /^\d{2}\/\d{4}$/.test(row[0]) && row[0].endsWith(`/${year}`));
  const currentRow = monthRows.reduce((latest, row) => Number(row[0].slice(0, 2)) > Number(latest[0].slice(0, 2)) ? row : latest);
  const accumulatedRow = rows.find(row => row[0].includes(`${year}`) && /Jan-/.test(row[0]));
  if (!currentRow || !accumulatedRow) throw new Error('Tabela MDIC indisponível');
  const totalExports = parseValue(accumulatedRow[1]);
  const totalImports = parseValue(accumulatedRow[3]);
  const currentExports = parseValue(currentRow[1]);
  const currentImports = parseValue(currentRow[3]);
  const total = totalExports - totalImports;
  const currentBalance = currentExports - currentImports;
  const quarters = [0, 0, 0, 0];
  const monthly = monthRows.map(row => {
    const [month] = row[0].split('/').map(Number);
    const exportValue = parseValue(row[1]);
    const importValue = parseValue(row[3]);
    quarters[Math.floor((month - 1) / 3)] += exportValue - importValue;
    return { month, exportValue, importValue, balance: exportValue - importValue };
  });
  setText('tradeYear', formatTrade(total));
  setText('tradeExportsYear', formatTradeAmount(totalExports));
  setText('tradeImportsYear', formatTradeAmount(totalImports));
  setText('tradeExportsMonth', formatTradeAmount(currentExports));
  setText('tradeImportsMonth', formatTradeAmount(currentImports));
  setText('tradeBalanceMonth', formatTrade(currentBalance));
  quarters.forEach((value, index) => setText(`tradeQ${index + 1}`, value ? formatQuarterTrade(value) : '--'));
  renderTradeCharts(monthly, quarters);
  markNegativeNumbers();
}
function renderTradeCharts(monthly, quarters) {
  const maxMonthly = Math.max(...monthly.map(item => Math.max(item.exportValue, item.importValue)), 1);
  byId('monthlyChart').innerHTML = monthly.map(item => `<div class="month-bars"><i style="height:${item.exportValue / maxMonthly * 100}%"></i><b style="height:${item.importValue / maxMonthly * 100}%"></b><small>${item.month}M</small></div>`).join('');
  const maxQuarter = Math.max(...quarters.map(value => Math.abs(value)), 1);
  byId('quarterChart').innerHTML = quarters.map((value, index) => `<div class="quarter-bar"><i class="${value < 0 ? 'negative-bar' : ''}" style="height:${value ? Math.max(8, Math.abs(value) / maxQuarter * 100) : 0}%"></i><small>${index + 1}T</small><b>${value ? formatQuarterTrade(value) : '--'}</b></div>`).join('');
}
function renderTradeFallback() { renderTradeCharts([], [0, 0, 0, 0]); }
function clearTradeValues() {
  ['tradeYear', 'tradeExportsYear', 'tradeImportsYear', 'tradeExportsMonth', 'tradeImportsMonth', 'tradeBalanceMonth', 'tradeQ1', 'tradeQ2', 'tradeQ3', 'tradeQ4'].forEach(id => setText(id, 'N/D'));
}
async function fetchJson(url) { const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(8000) }); if (!response.ok) throw new Error(response.status); return response.json(); }
function parseNumericValue(value) {
  if (value == null || value === '') return Number.NaN;
  const raw = String(value).trim();
  if (!raw) return Number.NaN;
  const cleaned = raw.replace(/[^0-9,.-]/g, '');
  if (!cleaned) return Number.NaN;
  if (cleaned.includes(',') && cleaned.includes('.')) {
    const lastComma = cleaned.lastIndexOf(',');
    const lastDot = cleaned.lastIndexOf('.');
    const decimalSeparator = lastComma > lastDot ? ',' : '.';
    const sanitized = decimalSeparator === ',' ? cleaned.replace(/\./g, '').replace(',', '.') : cleaned.replace(/,/g, '');
    return Number(sanitized);
  }
  if (cleaned.includes(',')) return Number(cleaned.replace(',', '.'));
  if (cleaned.includes('.')) {
    const parts = cleaned.split('.');
    if (parts.length > 2) return Number(parts.join(''));
    if (parts[1] && parts[1].length <= 2) return Number(cleaned);
    return Number(parts.join(''));
  }
  return Number(cleaned);
}
function formatPercent(value) { return `${Number(value).toFixed(2).replace('.', ',')}%`; }
function formatRealValue(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 'N/D';
  const abs = Math.abs(number);
  if (abs >= 1_000_000_000_000) return `R$ ${(number / 1_000_000_000_000).toFixed(2).replace('.', ',')} tri`;
  if (abs >= 1_000_000_000) return `R$ ${(number / 1_000_000_000).toFixed(2).replace('.', ',')} bi`;
  if (abs >= 1_000_000) return `R$ ${(number / 1_000_000).toFixed(2).replace('.', ',')} mi`;
  if (abs >= 1_000) return `R$ ${(number / 1_000).toFixed(2).replace('.', ',')} mil`;
  return `R$ ${number.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}`;
}
async function fetchFocus(indicator) {
  const filter = encodeURIComponent(`Indicador eq '${indicator}'`);
  const url = `https://olinda.bcb.gov.br/olinda/servico/Expectativas/versao/v1/odata/ExpectativasMercadoAnuais?$top=1&$orderby=Data%20desc&$filter=${filter}&$format=json`;
  const result = await fetchJson(url);
  return result.value?.[0];
}
async function fetchFocusProjections(indicator) {
  const filter = encodeURIComponent(`Indicador eq '${indicator}'`);
  const url = `https://olinda.bcb.gov.br/olinda/servico/Expectativas/versao/v1/odata/ExpectativasMercadoAnuais?$top=100&$orderby=Data%20desc&$filter=${filter}&$format=json`;
  const result = await fetchJson(url);
  const currentYear = new Date().getFullYear();
  const latestByYear = new Map();
  (result.value || []).forEach(row => {
    const referenceYear = Number(row.DataReferencia);
    if (referenceYear >= currentYear && !latestByYear.has(referenceYear)) latestByYear.set(referenceYear, row);
  });
  return [...latestByYear.values()].sort((a, b) => Number(a.DataReferencia) - Number(b.DataReferencia)).slice(0, 4);
}
function renderForecast(id, rows, type = 'percent') {
  const formatValue = type === 'dollar' ? value => `R$ ${Number(value).toFixed(2).replace('.', ',')}` : formatPercent;
  byId(id).innerHTML = rows.map((row, index) => `<div class="forecast-row ${index === 0 ? 'current' : ''}"><span>${row.DataReferencia}</span><strong>${formatValue(row.Mediana)}</strong></div>`).join('');
}
async function updateFocusProjections() {
  const [selic, ipca, pib, dollar] = await Promise.all([fetchFocusProjections('Selic'), fetchFocusProjections('IPCA'), fetchFocusProjections('PIB Total'), fetchFocusProjections('Câmbio')]);
  renderForecast('forecastSelic', selic);
  renderForecast('forecastIpca', ipca);
  renderForecast('forecastPib', pib);
  renderForecast('forecastDollar', dollar, 'dollar');
}
async function updateCurrentSelic() {
  const today = new Date();
  const date = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
  const data = await fetchJson(`https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados?formato=json&dataInicial=01/01/${today.getFullYear()}&dataFinal=${date}`);
  const latest = data.at(-1);
  if (latest?.valor) setText('selic', formatPercent(latest.valor));
}
async function updateCurrentCdi() {
  const data = await fetchJson('https://api.bcb.gov.br/dados/serie/bcdata.sgs.12/dados/ultimos/1?formato=json');
  const latest = data.at(-1);
  if (latest?.valor) {
    const dailyRate = Number(latest.valor) / 100;
    const annualRate = (Math.pow(1 + dailyRate, 252) - 1) * 100;
    setText('cdi', formatPercent(annualRate));
    setText('cdiDaily', formatPercent(latest.valor));
  }
}
async function fetchSidra(table, variable) {
  const url = `https://apisidra.ibge.gov.br/values/t/${table}/n1/1/v/${variable}/p/last%208`;
  const rows = await fetchJson(url);
  return (rows || []).filter(row => Number.isFinite(parseNumericValue(row.V)));
}
async function fetchIpeadataLatest(seriesId) {
  throw new Error(`Fonte legada desativada: ${seriesId}`);
}
async function updateQuarterlyGdp() {
  const rows = await fetchJson('https://apisidra.ibge.gov.br/values/t/5932/n1/1/v/6561/p/last/c11255/90707');
  const latest = rows.find(row => Number.isFinite(parseNumericValue(row.V)));
  if (!latest) throw new Error('PIB trimestral indisponível');
  setText('gdpQuarter', formatPercent(parseNumericValue(latest.V)));
}
async function updateGdpRealLevel() {
  const rows = await fetchJson('https://apisidra.ibge.gov.br/values/t/2072/n1/1/v/933/p/last');
  const latest = rows.find(row => row.D2C === '933' && Number.isFinite(parseNumericValue(row.V)));
  if (!latest) throw new Error('PIB nominal indisponível');
  setText('gdpReal', formatRealValue(Number(latest.V) * 1_000_000));
}
async function updateGdpPerCapita() {
  const [gdpRows, populationRows] = await Promise.all([fetchJson('https://apisidra.ibge.gov.br/values/t/2072/n1/1/v/933/p/last'), fetchJson('https://apisidra.ibge.gov.br/values/t/6579/n1/1/v/9324/p/last%201')]);
  const gdp = gdpRows.find(row => row.D2C === '933' && Number.isFinite(parseNumericValue(row.V)));
  const population = parseNumericValue(populationRows?.find(row => row.V && row.V !== 'Valor')?.V);
  if (!gdp || !Number.isFinite(population) || population === 0) throw new Error('PIB per capita indisponível');
  setText('gdpCapita', formatRealValue((Number(gdp.V) * 1_000_000 * 4) / population));
}
async function updateIgpM() {
  const rows = await fetchJson('https://api.bcb.gov.br/dados/serie/bcdata.sgs.189/dados/ultimos/13?formato=json');
  const values = rows.map(row => parseNumericValue(row.valor)).filter(Number.isFinite);
  if (values.length < 12) throw new Error('IGP-M indisponível');
  const accumulated = values.slice(-12).reduce((total, value) => total * (1 + value / 100), 1) - 1;
  setText('igpm', formatPercent(accumulated * 100));
}
async function updateCommodityPrices() {
  const commodities = [
    ['iron', 'TIO=F'], ['soy', 'ZS=F'], ['corn', 'ZC=F'], ['coffee', 'KC=F'],
    ['gold', 'GC=F'], ['oil', 'CL=F'], ['sugar', 'SB=F'], ['beef', 'LE=F']
  ];
  await Promise.all(commodities.map(async ([id, symbol]) => {
    try {
      const result = await fetchJson(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=5d`);
      const chart = result.chart?.result?.[0];
      const prices = chart?.indicators?.quote?.[0]?.close?.filter(Number.isFinite) || [];
      const current = prices.at(-1);
      const previous = prices.at(-2);
      if (!Number.isFinite(current)) throw new Error('cotação indisponível');
      setText(id, `US$ ${current.toFixed(2).replace('.', ',')}`);
      if (Number.isFinite(previous) && previous !== 0) setText(`${id}Change`, `${((current / previous - 1) * 100 >= 0 ? '+' : '')}${((current / previous - 1) * 100).toFixed(2).replace('.', ',')}%`);
    } catch (error) { setText(id, 'N/D'); setText(`${id}Change`, 'N/D'); }
  }));
}
async function updateMarketIndices() {
  const indices = [
    ['ibov', '%5EBVSP'], ['sp500', '%5EGSPC'], ['nikkei', '%5EN225'], ['shanghai', '000001.SS'], ['eurostoxx', '%5ESTOXX50E']
  ];
  const updated = await Promise.all(indices.map(async ([id, symbol]) => {
    try {
      const result = await fetchJson(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1m&range=1d`);
      const meta = result.chart?.result?.[0]?.meta;
      if (!meta?.regularMarketPrice || !meta.previousClose) return false;
      const change = (meta.regularMarketPrice / meta.previousClose - 1) * 100;
      setText(id, Number(meta.regularMarketPrice).toLocaleString('pt-BR', { maximumFractionDigits: 2 }));
      setText(`${id}Change`, `${change >= 0 ? '+' : ''}${change.toFixed(2).replace('.', ',')}%`);
      return true;
    } catch (error) { return false; }
  }));
  return updated.some(Boolean);
}
const majorStocks = [
  ['PETR4', 'Petrobras', 'PETR4.SA'], ['VALE3', 'Vale', 'VALE3.SA'], ['ITUB4', 'Itaú Unibanco', 'ITUB4.SA'],
  ['BBDC4', 'Bradesco', 'BBDC4.SA'], ['BBAS3', 'Banco do Brasil', 'BBAS3.SA'], ['ABEV3', 'Ambev', 'ABEV3.SA'],
  ['WEGE3', 'WEG', 'WEGE3.SA'], ['CMIG4', 'Cemig', 'CMIG4.SA'], ['RENT3', 'Localiza', 'RENT3.SA'], ['SUZB3', 'Suzano', 'SUZB3.SA'],
  ['MGLU3', 'Magazine Luiza', 'MGLU3.SA'], ['LREN3', 'Lojas Renner', 'LREN3.SA'], ['RADL3', 'Raia Drogasil', 'RADL3.SA'],
  ['PRIO3', 'PRIO', 'PRIO3.SA'], ['CSAN3', 'Cosan', 'CSAN3.SA'], ['KLBN11', 'Klabin', 'KLBN11.SA'],
  ['GGBR4', 'Gerdau', 'GGBR4.SA'], ['TOTS3', 'Totvs', 'TOTS3.SA'], ['VIVT3', 'Telefônica Brasil', 'VIVT3.SA'], ['EQTL3', 'Equatorial', 'EQTL3.SA']
];
let stockUniverse = [
  ...majorStocks,
  ['B3SA3', 'B3', 'B3SA3.SA'], ['BRAP4', 'Bradespar', 'BRAP4.SA'], ['CCRO3', 'CCR', 'CCRO3.SA'], ['CPFE3', 'CPFL Energia', 'CPFE3.SA'],
  ['CSNA3', 'CSN', 'CSNA3.SA'], ['CYRE3', 'Cyrela', 'CYRE3.SA'], ['DXCO3', 'Dexco', 'DXCO3.SA'], ['EMBR3', 'Embraer', 'EMBR3.SA'],
  ['ENGI11', 'Energisa', 'ENGI11.SA'], ['FLRY3', 'Fleury', 'FLRY3.SA'], ['IRBR3', 'IRB Brasil', 'IRBR3.SA'], ['ITSA4', 'Itaúsa', 'ITSA4.SA'],
  ['JHSF3', 'JHSF', 'JHSF3.SA'], ['LOGG3', 'Log Commercial', 'LOGG3.SA'], ['LWSA3', 'Locaweb', 'LWSA3.SA'],
  ['MULT3', 'Multiplan', 'MULT3.SA'], ['NTCO3', 'Natura', 'NTCO3.SA'], ['PCAR3', 'Pão de Açúcar', 'PCAR3.SA'], ['PETZ3', 'Petz', 'PETZ3.SA'],
  ['POMO4', 'Marcopolo', 'POMO4.SA'], ['POSI3', 'Positivo', 'POSI3.SA'], ['RAIL3', 'Rumo', 'RAIL3.SA'], ['SBSP3', 'Sabesp', 'SBSP3.SA'],
  ['SLCE3', 'SLC Agrícola', 'SLCE3.SA'], ['SMTO3', 'São Martinho', 'SMTO3.SA'], ['TIMS3', 'TIM', 'TIMS3.SA'], ['TRPL4', 'ISA Energia', 'TRPL4.SA'],
  ['USIM5', 'Usiminas', 'USIM5.SA'], ['VAMO3', 'Vamos', 'VAMO3.SA'], ['YDUQ3', 'Yduqs', 'YDUQ3.SA'], ['ALPA4', 'Alpargatas', 'ALPA4.SA'],
  ['AZUL4', 'Azul', 'AZUL4.SA'], ['CVCB3', 'CVC Brasil', 'CVCB3.SA'], ['HYPE3', 'Hypera', 'HYPE3.SA'], ['MRFG3', 'Marfrig', 'MRFG3.SA'],
  ['ODPV3', 'Odontoprev', 'ODPV3.SA'], ['MOVI3', 'Movida', 'MOVI3.SA'], ['ZAMP3', 'Zamp', 'ZAMP3.SA'], ['PSSA3', 'Porto Seguro', 'PSSA3.SA'], ['BLAU3', 'Blau Farmacêutica', 'BLAU3.SA']
];
const STOCK_PAGE_SIZE = 20;
let stockPage = 1;
let stockApiUniverseLoaded = false;
function getStockPage() {
  const pageCount = Math.ceil(stockUniverse.length / STOCK_PAGE_SIZE);
  const start = stockPage * STOCK_PAGE_SIZE;
  stockPage = (stockPage + 1) % pageCount;
  return { stocks: stockUniverse.slice(start, start + STOCK_PAGE_SIZE), page: stockPage === 0 ? pageCount : stockPage, pageCount };
}
function renderStockList(stocks, targetId = 'stockList') {
  const container = byId(targetId);
  if (!container) return;
  container.innerHTML = stocks.map(stock => `<div class="stock-row"><b>${stock.ticker}</b><span>${stock.name}</span><strong>${stock.price == null ? 'N/D' : `R$ ${stock.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</strong><em class="stock-change ${stock.change >= 0 ? 'positive-number' : 'negative-number'}">${stock.change == null ? 'N/D' : `${stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2).replace('.', ',')}%`}</em></div>`).join('');
}
async function updateGrowingStocks() {
  try {
    const result = await fetchJson('https://brapi.dev/api/quote/list?sortBy=name&sortOrder=asc');
    const listedStocks = (result.stocks || [])
      .filter(stock => stock.type === 'stock' && stock.stock)
      .sort((a, b) => a.stock.localeCompare(b.stock))
      .map(stock => [stock.stock, stock.name || stock.stock, `${stock.stock}.SA`, Number.isFinite(Number(stock.close)) ? Number(stock.close) : null, Number.isFinite(Number(stock.change)) ? Number(stock.change) : null]);
    const uniqueStocks = [...new Map(listedStocks.map(stock => [stock[0], stock])).values()];
    if (uniqueStocks.length) {
      stockUniverse = uniqueStocks;
      stockApiUniverseLoaded = true;
    }
  } catch (error) { /* usa a lista de contingência quando a listagem pública estiver indisponível */ }
  const selected = getStockPage();
  if (stockApiUniverseLoaded) {
    const stocks = selected.stocks.map(([ticker, name, symbol, price, change]) => ({ ticker, name, price, change }));
    renderStockList(stocks.sort((a, b) => (b.change ?? -Infinity) - (a.change ?? -Infinity)));
    setText('stocksNote', `${stockUniverse.length} ações B3 · página ${selected.page}/${selected.pageCount} · próxima em 10s`);
    return stocks.some(stock => stock.price != null);
  }
  const stocks = await Promise.all(selected.stocks.map(async ([ticker, name, symbol]) => {
    try {
      const result = await fetchJson(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=5d`);
      const chart = result.chart?.result?.[0];
      const meta = chart?.meta || {};
      const prices = chart?.indicators?.quote?.[0]?.close?.filter(Number.isFinite) || [];
      const price = Number.isFinite(meta.regularMarketPrice) ? meta.regularMarketPrice : prices.at(-1);
      const previousClose = meta.previousClose ?? meta.chartPreviousClose ?? prices.at(-2);
      if (!Number.isFinite(price) || !Number.isFinite(previousClose)) throw new Error('cotação indisponível');
      return { ticker, name, price, change: (price / previousClose - 1) * 100 };
    } catch (error) { return { ticker, name, price: null, change: null }; }
  }));
  renderStockList(stocks.sort((a, b) => (b.change ?? -Infinity) - (a.change ?? -Infinity)));
  setText('stocksNote', `${stockUniverse.length} ações monitoradas · página ${selected.page}/${selected.pageCount} · próxima em 10s`);
  return stocks.some(stock => stock.price != null);
}
let sp500Universe = [];
let sp500Page = 0;
async function loadSp500Universe() {
  const response = await fetch('https://en.wikipedia.org/wiki/List_of_S%26P_500_companies', { cache: 'no-store', signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error('Composição do S&P 500 indisponível');
  const html = await response.text();
  const page = new DOMParser().parseFromString(html, 'text/html');
  const table = [...page.querySelectorAll('table.wikitable')].find(item => item.textContent.includes('Symbol') && item.textContent.includes('Security'));
  const rows = [...(table?.querySelectorAll('tbody tr') || [])];
  sp500Universe = rows.map(row => {
    const cells = row.querySelectorAll('td');
    const ticker = cells[0]?.textContent.trim().replace(/\s+/g, '').replace(/\./g, '-');
    const name = cells[1]?.textContent.replace(/\[[^\]]+\]/g, '').trim();
    return ticker && name ? [ticker, name] : null;
  }).filter(Boolean);
  if (!sp500Universe.length) throw new Error('Lista do S&P 500 vazia');
}
async function fetchYahooStock(ticker, name) {
  try {
    const result = await fetchJson(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=5d`);
    const chart = result.chart?.result?.[0];
    const meta = chart?.meta || {};
    const prices = chart?.indicators?.quote?.[0]?.close?.filter(Number.isFinite) || [];
    const price = Number.isFinite(meta.regularMarketPrice) ? meta.regularMarketPrice : prices.at(-1);
    const previousClose = meta.previousClose ?? meta.chartPreviousClose ?? prices.at(-2);
    if (!Number.isFinite(price) || !Number.isFinite(previousClose)) throw new Error('cotação indisponível');
    return { ticker, name, price, change: (price / previousClose - 1) * 100 };
  } catch (error) { return { ticker, name, price: null, change: null }; }
}
async function updateSp500Stocks() {
  if (!sp500Universe.length) await loadSp500Universe();
  const pageCount = Math.ceil(sp500Universe.length / STOCK_PAGE_SIZE);
  const start = sp500Page * STOCK_PAGE_SIZE;
  const selected = sp500Universe.slice(start, start + STOCK_PAGE_SIZE);
  sp500Page = (sp500Page + 1) % pageCount;
  const stocks = await Promise.all(selected.map(([ticker, name]) => fetchYahooStock(ticker, name)));
  renderStockList(stocks.sort((a, b) => (b.change ?? -Infinity) - (a.change ?? -Infinity)), 'sp500List');
  setText('sp500Note', `${sp500Universe.length} ações · página ${sp500Page === 0 ? pageCount : sp500Page}/${pageCount} · próxima em 10s`);
  return stocks.some(stock => stock.price != null);
}
async function updateIbcBr() {
  const data = await fetchJson('https://api.bcb.gov.br/dados/serie/bcdata.sgs.24363/dados/ultimos/13?formato=json');
  const values = data.map(item => Number(item.valor));
  const current = values.at(-1);
  const previous = values.at(-2);
  const yearAgo = values.at(-13);
  if (current != null) setText('ibcCurrent', current.toFixed(2).replace('.', ','));
  if (current != null && previous) setText('ibcMonthly', formatPercent((current / previous - 1) * 100));
  if (current != null && yearAgo) setText('ibcYearly', formatPercent((current / yearAgo - 1) * 100));
  ['agro', 'industry', 'services', 'taxes'].forEach(id => setText(id, 'N/D'));
}
async function updateActivityComposition() {
  const today = new Date();
  const sources = Array.from({ length: 8 }, (_, offset) => {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    const stamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    return `https://www.bcb.gov.br/content/indeco/indicadoresselecionados/ies-${stamp}.xlsx`;
  });
  let response;
  for (const source of sources) {
    try {
      const candidate = await fetch(`${source}?atualizacao=${Date.now()}`, { cache: 'no-store', signal: AbortSignal.timeout(5000) });
      if (candidate.ok) { response = candidate; break; }
    } catch (error) { /* tenta a próxima publicação */ }
  }
  if (!response) throw new Error('Composição da atividade indisponível');
  const workbook = XLSX.read(await response.arrayBuffer(), { type: 'array' });
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets['Tab 1'], { header: 1, defval: '' });
  const headerIndex = rows.findIndex(row => row[0] === 'SGS');
  const dataRows = rows.slice(headerIndex + 1).filter(row => typeof row[0] === 'number' && [8, 9, 10, 11].every(index => Number.isFinite(Number(row[index]))));
  const latest = dataRows.at(-1);
  const previous = dataRows.at(-2);
  if (!latest || !previous) throw new Error('Série setorial sem dados');
  [['agro', 8], ['industry', 9], ['services', 10], ['taxes', 11]].forEach(([id, index]) => {
    const value = (Number(latest[index]) / Number(previous[index]) - 1) * 100;
    setText(id, formatPercent(value));
  });
}
async function updateIbcrRegional() {
  const source = `https://www.bcb.gov.br/content/indeco/indicadoresselecionados/ies-02.xlsx?atualizacao=${Date.now()}`;
  const response = await fetch(source, { cache: 'no-store', signal: AbortSignal.timeout(5000) });
  if (!response.ok) throw new Error('Fonte IBCR indisponível');
  const workbook = XLSX.read(await response.arrayBuffer(), { type: 'array' });
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 });
  const dataRows = rows.slice(8).filter(row => typeof row[0] === 'number' && row.slice(1, 6).some(value => typeof value === 'number'));
  const latest = dataRows.at(-1);
  const previous = dataRows.at(-2);
  if (!latest || !previous) throw new Error('Planilha regional sem dados');
  ['ibcrNorte', 'ibcrNordeste', 'ibcrSudeste', 'ibcrSul', 'ibcrCentroOeste'].forEach((id, index) => {
    const currentValue = Number(latest[index + 1]);
    const previousValue = Number(previous[index + 1]);
    setText(id, formatPercent((currentValue / previousValue - 1) * 100));
  });
}
async function refreshPublicData() {
  let connected = false;
  try {
    const rates = await fetchJson('https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,CNY-BRL,JPY-BRL');
    if (rates.USDBRL) { setText('usd', `R$ ${Number(rates.USDBRL.bid).toFixed(2).replace('.', ',')}`); setText('usdTourism', `R$ ${(Number(rates.USDBRL.bid) * 1.10).toFixed(2).replace('.', ',')}`); connected = true; }
    if (rates.EURBRL) setText('eur', `R$ ${Number(rates.EURBRL.bid).toFixed(2).replace('.', ',')}`);
    if (rates.CNYBRL) setText('cny', `R$ ${Number(rates.CNYBRL.bid).toFixed(2).replace('.', ',')}`);
    if (rates.JPYBRL) setText('jpy', `R$ ${Number(rates.JPYBRL.bid).toFixed(3).replace('.', ',')}`);
  } catch (error) { /* fallback keeps the dashboard readable when a public API is unavailable */ }
  try {
    const [selic, ipca, pib] = await Promise.all([
      fetchFocus('Selic'),
      fetchFocus('IPCA'),
      fetchFocus('PIB Total')
    ]);
    if (ipca?.Mediana != null) setText('ipca', formatPercent(ipca.Mediana));
    if (pib?.Mediana != null) setText('gdpAnnual', formatPercent(pib.Mediana));
    connected = Boolean(selic || ipca || pib);
  } catch (error) { /* Focus can reject browser requests depending on network policy */ }
  try { await updateCurrentSelic(); connected = true; } catch (error) { /* BCB may be temporarily unavailable */ }
  try { await updateCurrentCdi(); connected = true; } catch (error) { /* BCB may be temporarily unavailable */ }
  try { await updateQuarterlyGdp(); connected = true; } catch (error) { /* PIB trimestral may be temporarily unavailable */ }
  try { await updateGdpRealLevel(); connected = true; } catch (error) { /* PIB em nível may be temporarily unavailable */ }
  try { await updateGdpPerCapita(); connected = true; } catch (error) { /* PIB per capita sem fonte pública configurada */ }
  try { await updateIgpM(); connected = true; } catch (error) { setText('igpm', 'N/D'); /* IGP-M pode estar temporariamente indisponível */ }
  try { connected = (await updateMarketIndices()) || connected; } catch (error) { /* Yahoo Finance pode estar temporariamente indisponível */ }
  try { connected = (await updateGrowingStocks()) || connected; } catch (error) { /* ações podem estar temporariamente indisponíveis */ }
  try { connected = (await updateSp500Stocks()) || connected; } catch (error) { setText('sp500Note', 'Fonte do S&P 500 indisponível'); /* composição ou cotações podem estar temporariamente indisponíveis */ }
  try { await updateIbcBr(); connected = true; } catch (error) { /* IBC-Br may be temporarily unavailable */ }
  try { await updateActivityComposition(); connected = true; } catch (error) { /* composição pode estar temporariamente indisponível */ }
  try { await updateIbcrRegional(); connected = true; } catch (error) { /* planilha regional pode estar indisponível */ }
  try { await updateCommodityPrices(); connected = true; } catch (error) { /* commodities podem estar temporariamente indisponíveis */ }
  try { await updateFocusProjections(); connected = true; } catch (error) { /* Focus can be temporarily unavailable */ }
  try { await updateStateGdp(); connected = true; } catch (error) { setText('stateGdpNote', 'IBGE / SIDRA indisponível'); /* PIB estadual pode estar temporariamente indisponível */ }
  markNegativeNumbers();
  try { await updateTradeBalance(); connected = true; } catch (error) { renderTradeFallback(); clearTradeValues(); markNegativeNumbers(); /* MDIC pode estar indisponível */ }
  setText('source-status', connected ? 'conectadas' : 'modo referência');
  setText('footer-date', `Atualizado ${new Date().toLocaleDateString('pt-BR')}`);
}
let updateInProgress = false;
async function updatePublicData() {
  if (updateInProgress) return;
  updateInProgress = true;
  remaining = REFRESH_SECONDS;
  setText('countdown', `${remaining}s`);
  byId('progress-bar').style.width = '0%';
  try {
    await refreshPublicData();
    setText('last-update', new Date().toLocaleTimeString('pt-BR'));
  } finally {
    updateInProgress = false;
  }
}
let remaining = REFRESH_SECONDS;
function tick() {
  if (updateInProgress) return;
  remaining = remaining <= 1 ? 0 : remaining - 1;
  setText('countdown', `${remaining}s`);
  byId('progress-bar').style.width = `${((REFRESH_SECONDS - remaining) / REFRESH_SECONDS) * 100}%`;
}
const refreshButton = byId('refresh-now');
if (refreshButton) {
  refreshButton.addEventListener('click', async () => {
    const button = refreshButton;
    button.disabled = true;
    button.textContent = 'Atualizando…';
    try {
      await updatePublicData();
    } finally {
      button.disabled = false;
      button.textContent = 'Atualizar agora';
    }
  });
}
document.querySelector('#balanca').after(document.querySelector('#futuro'));
renderStockList(stockUniverse.slice(0, STOCK_PAGE_SIZE).map(([ticker, name]) => ({ ticker, name, price: null, change: null })));
renderFallback(); renderTradeFallback(); setMarketChanges(); renderComparisons(); markNegativeNumbers(); enableCommodityInteractions(); updatePublicData(); setInterval(tick, 1000); setInterval(updatePublicData, REFRESH_SECONDS * 1000);
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') updatePublicData(); });
window.addEventListener('online', updatePublicData);
