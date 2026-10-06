export async function saveLead(lead: { id: string; name: string; phone?: string }) {
  const response = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lead),
    signal: AbortSignal.timeout(25000),
  });
  const result = await response.json();
  if (!response.ok || result.ok !== true) throw new Error('Unable to save. Please try again.');
}
