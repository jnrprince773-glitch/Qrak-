const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-5.4-mini';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
  if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: 'QRAK AI is not configured yet. Add OPENAI_API_KEY in Vercel environment variables.' });

  try {
    const { message, projects } = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    if (typeof message !== 'string' || !message.trim()) return res.status(400).json({ error: 'A message is required.' });
    if (message.length > 4000) return res.status(400).json({ error: 'Message is too long.' });

    const safeProjects = Array.isArray(projects) ? projects.slice(0, 40).map(p => ({
      name: String(p?.name || ''),
      category: String(p?.category || ''),
      status: String(p?.status || ''),
      stack: String(p?.stack || ''),
      description: String(p?.description || ''),
      notes: String(p?.notes || ''),
      github: String(p?.github || ''),
      live: String(p?.live || '')
    })) : [];

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        input: [
          {
            role: 'system',
            content: [{
              type: 'input_text',
              text: 'You are QRAK AI, the project command-center assistant. Help the user organize, plan, review, debug, and improve their software projects. Use the supplied vault context when relevant. Be practical and concise. Never claim to have changed files or deployed anything unless the user actually did so.'
            }]
          },
          {
            role: 'user',
            content: [{
              type: 'input_text',
              text: `QRAK PROJECT VAULT:\n${JSON.stringify(safeProjects, null, 2)}\n\nUSER REQUEST:\n${message.trim()}`
            }]
          }
        ],
        max_output_tokens: 900
      })
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data?.error?.message || 'OpenAI request failed.' });

    const text = typeof data.output_text === 'string'
      ? data.output_text
      : (data.output || []).flatMap(item => item.content || []).map(part => part.text || '').filter(Boolean).join('\n').trim();

    return res.status(200).json({ text: text || 'QRAK AI returned an empty response.' });
  } catch (error) {
    return res.status(500).json({ error: error?.message || 'Unexpected server error.' });
  }
}
