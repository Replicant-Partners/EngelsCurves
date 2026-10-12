import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import XLSX from 'xlsx';

const port = Number(process.env.PORT || 8080);
const cacheMs = 15 * 60 * 1000;
const shillerUrl = process.env.SHILLER_URL || 'https://img1.wsimg.com/blobby/go/e5e77e0b-59d1-44d9-ab25-4763ac982e53/downloads/1449043e-a1ed-4e2e-8e9c-7b9a2a064493/ie_data.xls?ver=1791297298731';
const millimanUrl = process.env.MILLIMAN_URL || 'https://www.milliman.com/en/insight/pension-funding-index-october-2026';
let cached;
let cachedAt = 0;

function number(value) {
  const parsed = Number(String(value).replace(/,/g, '').replace('%', ''));
  return Number.isFinite(parsed) ? parsed : null;
}

async function getShillerCape(cutoff) {
  const response = await fetch(shillerUrl, { redirect: 'follow' });
  if (!response.ok) throw new Error(`Shiller returned ${response.status}`);
  const workbook = XLSX.read(Buffer.from(await response.arrayBuffer()), { type: 'buffer' });
  const sheetName = workbook.SheetNames.find(name => name.toLowerCase() === 'data') || workbook.SheetNames[0];
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { range: 7, defval: null });
  const capeKey = Object.keys(rows[0] || {}).find(key => key.toLowerCase().includes('cape'));
  const dateKey = Object.keys(rows[0] || {}).find(key => key.toLowerCase() === 'date');
  if (!capeKey || !dateKey) throw new Error('Shiller CAPE column not found');
  const row = [...rows].reverse().find(item => {
    if (number(item[capeKey]) === null) return false;
    if (!cutoff) return true;
    const rawDate = String(item[dateKey]);
    const match = rawDate.match(/(\d{4})[.\/-](\d{1,2})?/);
    if (!match) return false;
    const month = String(match[2] || '1').padStart(2, '0');
    return `${match[1]}-${month}-01` <= cutoff;
  });
  if (!row) throw new Error('Shiller CAPE observation not found for selected date');
  return { value: number(row[capeKey]), date: String(row[dateKey]), source: shillerUrl };
}

async function getMilliman() {
  const response = await fetch(millimanUrl, { redirect: 'follow' });
  if (!response.ok) throw new Error(`Milliman returned ${response.status}`);
  const html = await response.text();
  const text = html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');
  const ratioMatch = text.match(/funded (?:ratio|status ratio) rose to ([\d.]+)% as of ([A-Za-z]+\s+\d{1,2})/i);
  const discountMatch = text.match(/discount rate (?:rose|increased|decreased|experienced a net increase).*?to ([\d.]+)%/i);
  return {
    fundedRatio: ratioMatch ? number(ratioMatch[1]) : null,
    asOf: ratioMatch ? ratioMatch[2] : null,
    discountRate: discountMatch ? number(discountMatch[1]) : null,
    source: millimanUrl
  };
}

async function marketData(cutoff) {
  const cacheKey = cutoff || 'latest';
  if (cached?.key === cacheKey && Date.now() - cachedAt < cacheMs) return cached.value;
  const cape = await Promise.allSettled([getShillerCape(cutoff)]);
  const milliman = cutoff ? { status: 'fulfilled', value: { unavailableForHistoricalDate: true } } : await Promise.allSettled([getMilliman()]).then(result => result[0]);
  const value = {
    retrievedAt: new Date().toISOString(),
    valuationDate: cutoff || null,
    cape: cape[0].status === 'fulfilled' ? cape[0].value : { error: cape[0].reason.message },
    milliman: milliman.status === 'fulfilled' ? milliman.value : { error: milliman.reason.message }
  };
  cached = { key: cacheKey, value };
  cachedAt = Date.now();
  return value;
}

const server = createServer(async (request, response) => {
  try {
    if (request.url?.startsWith('/api/market-data')) {
      const url = new URL(request.url, `http://${request.headers.host}`);
      const cutoff = url.searchParams.get('date') || undefined;
      if (cutoff && !/^\d{4}-\d{2}-\d{2}$/.test(cutoff)) throw new Error('Invalid date');
      response.setHeader('Content-Type', 'application/json; charset=utf-8');
      response.setHeader('Cache-Control', 'public, max-age=900');
      response.end(JSON.stringify(await marketData(cutoff)));
      return;
    }
    if (request.url === '/' || request.url === '/index.html') {
      response.setHeader('Content-Type', 'text/html; charset=utf-8');
      response.end(await readFile('index.html'));
      return;
    }
    response.statusCode = 404;
    response.end('Not found');
  } catch (error) {
    response.statusCode = 502;
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.end(JSON.stringify({ error: error.message }));
  }
});

server.listen(port, '0.0.0.0', () => console.log(`Engels Curves listening on ${port}`));
