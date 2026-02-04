export async function postJson(path, body) {
    const base = process.env.REACT_APP_BACKEND_URL || '';
    const res = await fetch(`${base}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    return res.json();
}