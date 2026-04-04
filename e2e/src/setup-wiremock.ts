export async function postStub(baseUrl: string, stub: string): Promise<void> {
  const url = `${baseUrl}/__admin/mappings`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: stub,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`WireMock POST ${url} failed: ${res.status} ${text}`);
  }
}

export async function resetStubs(baseUrl: string): Promise<void> {
  await fetch(`${baseUrl}/__admin/reset`, {method: "POST"});
}
