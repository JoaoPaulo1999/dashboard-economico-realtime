const ALLOWED_HOSTS = new Set(['query1.finance.yahoo.com', 'query2.finance.yahoo.com']);

export default async function handler(request, response) {
  const target = String(request.query?.url || '');
  let parsed;
  try { parsed = new URL(target); } catch (error) { return response.status(400).json({ error: 'URL inválida' }); }
  if (!ALLOWED_HOSTS.has(parsed.hostname)) return response.status(403).json({ error: 'Fonte não permitida' });
  try {
    const upstream = await fetch(parsed, { headers: { accept: 'application/json' } });
    const body = await upstream.text();
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    return response.status(upstream.status).send(body);
  } catch (error) {
    return response.status(502).json({ error: 'Fonte de mercado indisponível' });
  }
}
