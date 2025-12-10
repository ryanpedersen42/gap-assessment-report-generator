async function drataFetch(base, path, token, cursor) {
    const u = new URL(`${base}${path}`);
    if (cursor) u.searchParams.set("cursor", cursor);
  
    const r = await fetch(u.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
  
    if (!r.ok) {
      const text = await r.text().catch(() => "");
      throw new Error(`Drata API error ${r.status}: ${text || r.statusText}`);
    }
    return r.json();
  }
  
  export async function getWorkspaces(base, token) {
    let cursor = null;
    const all = [];
  
    do {
      const data = await drataFetch(base, "/workspaces", token, cursor);
      all.push(...(data?.data || []));
      cursor = data?.pagination?.cursor || null;
    } while (cursor);
  
    return { workspaces: all.map(w => ({ id: w.id, name: w.name })) };
  }
  
  export async function getControls(base, workspaceId, token) {
    let cursor = null;
    const all = [];
  
    do {
      const path = `/workspaces/${encodeURIComponent(workspaceId)}/controls`;
      const u = new URL(`${base}${path}`);
      u.searchParams.append("expand[]", "customFields");
      if (cursor) u.searchParams.set("cursor", cursor);
  
      const r = await fetch(u.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
  
      if (!r.ok) {
        const text = await r.text().catch(() => "");
        throw new Error(`Drata API error ${r.status}: ${text || r.statusText}`);
      }
  
      const data = await r.json();
      all.push(...(data?.data || []));
      cursor = data?.pagination?.cursor || null;
    } while (cursor);
  
    return { controls: all };
  }