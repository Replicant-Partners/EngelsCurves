import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

const port = Number(process.env.PORT || 8080);
const cacheMs = 15 * 60 * 1000;
const millimanUrl = process.env.MILLIMAN_URL || 'https://www.milliman.com/en/insight/pension-funding-index-october-2026';
const shillerData = JSON.parse(await readFile('data/shiller-cape.json', 'utf8'));
let cached;
let cachedAt = 0;

function number(value) {
  const parsed = Number(String(value).replace(/,/g, '').replace('%', ''));
  return Number.isFinite(parsed) ? parsed : null;
}

function getShillerCape(cutoff) {
  const row = [...shillerData.data].reverse().find(item => {
    if (!cutoff) return true;
    const match = String(item.date).match(/(\d{4})[.\/-](\d{1,2})?/);
    if (!match) return false;
    const month = String(match[2] || '1').padStart(2, '0');
    return `${match[1]}-${month}-01` <= cutoff;
  });
  if (!row) throw new Error('Shiller CAPE observation not found for selected date');
  return { value: row.value, date: row.date, source: shillerData.source, snapshotRetrievedAt: shillerData.retrievedAt };
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
    if (request.url === '/calculations.js') {
      response.setHeader('Content-Type', 'text/javascript; charset=utf-8');
      response.end(await readFile('calculations.js'));
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
