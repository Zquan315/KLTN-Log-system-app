const BASE = 'http://localhost:8081';

export function setToken(t: string){ localStorage.setItem('token', t); }
export function getToken(){ return localStorage.getItem('token'); }

async function request(path: string, opts: RequestInit = {}){
  const token = getToken();
  const headers: any = { 'Content-Type': 'application/json', ...(opts.headers||{}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { ...opts, headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const api = {
  login: (username: string, password: string) =>
    request('/auth/login', { method:'POST', body: JSON.stringify({ username, password }) }),

  logs: (params: Record<string, any>) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k,v]) => (v!==undefined && v!==null && v!=='') && q.append(k, String(v)));
    return request('/logs?'+q.toString());
  },

  exportCsv: async (params: Record<string, any>) => {
    const token = getToken();
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k,v]) => (v!==undefined && v!==null && v!=='') && q.append(k, String(v)));
    const res = await fetch(`${BASE}/logs/export?${q.toString()}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'logs.csv'; a.click();
    URL.revokeObjectURL(url);
  }
}
