import React, { useMemo } from "react";
import Papa from "papaparse";

export default function ControlsTable({
  controls,
  includeFieldKeys,
  filterFieldKey,
  includeMappings,
  loading
}) {
  const columns = useMemo(() => {
    const base = [
      { key: "name", label: "Control" },
      { key: "code", label: "Code" },
      { key: "readiness", label: "Readiness" }
    ];

    if (includeMappings) {
      base.push(
        { key: "__frameworks", label: "Mapped Frameworks", isMapping: true },
        { key: "__requirements", label: "Mapped Requirements", isMapping: true }
      );
    }

    const extras = (includeFieldKeys || []).map(k => ({
      key: k,
      label: k,
      isCustom: true
    }));

    if (filterFieldKey && !includeFieldKeys?.includes(filterFieldKey)) {
      base.push({ key: filterFieldKey, label: filterFieldKey, isCustom: true });
    }

    return [...base, ...extras];
  }, [includeMappings, includeFieldKeys, filterFieldKey]);

  function getFrameworkTagsText(c) {
    const tags =
      (Array.isArray(c.frameworkTags) && c.frameworkTags) ||
      (Array.isArray(c.raw?.frameworkTags) && c.raw.frameworkTags) ||
      [];
    return tags.length ? tags.join(", ") : "—";
  }

  function getRequirementsText(c) {
    const reqs =
      (Array.isArray(c.requirements) && c.requirements) ||
      (Array.isArray(c.raw?.requirements) && c.raw.requirements) ||
      [];
    const names = reqs.map(r => r?.name).filter(Boolean);
    return names.length ? names.join(", ") : "—";
  }

  function exportCsv() {
    const rows = (controls || []).map(c => {
      const row = {
        Control: c.name,
        Code: c.code,
        Readiness: c.readiness
      };

      for (const col of columns) {
        if (col.isCustom) {
          row[col.label] = c.cfMap?.[col.key]?.raw ?? "";
        } else if (col.isMapping) {
          if (col.key === "__frameworks") row[col.label] = getFrameworkTagsText(c);
          if (col.key === "__requirements") row[col.label] = getRequirementsText(c);
        }
      }

      return row;
    });

    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "controls-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ marginTop: 0 }}>Report</h3>
        <button onClick={exportCsv} disabled={loading || !controls?.length}>
          Export CSV
        </button>
      </div>

      {loading && <div>Loading controls…</div>}
      {!loading && (!controls || controls.length === 0) && (
        <div>No controls match your filters.</div>
      )}

      {!loading && controls?.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {columns.map(col => (
                  <th
                    key={col.key}
                    style={{
                      textAlign: "left",
                      padding: 8,
                      borderBottom: "1px solid #ddd",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {controls.map(c => (
                <tr key={c.id}>
                  {columns.map(col => (
                    <td
                      key={col.key}
                      style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}
                    >
                      {col.isCustom
                        ? (c.cfMap?.[col.key]?.raw ?? "—")
                        : col.isMapping
                          ? (col.key === "__frameworks"
                              ? getFrameworkTagsText(c)
                              : getRequirementsText(c))
                          : (c[col.key] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}