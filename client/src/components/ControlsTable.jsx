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
    <div style={{
      background: "#ffffff",
      padding: "32px 40px",
      borderRadius: "0 0 12px 12px",
      minHeight: 200
    }}>
      {/* Header bar con título y botón */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
        paddingBottom: 16,
        borderBottom: "2px solid #e1e4e8"
      }}>
        <h3 style={{
          color: "#1a1f36",
          fontSize: 20,
          fontWeight: 700,
          margin: 0
        }}>
          Report
        </h3>
        <button
          onClick={exportCsv}
          disabled={loading || !controls?.length}
          style={{
            padding: "10px 20px",
            background: (loading || !controls?.length) ? "#e1e4e8" : "#00c48c",
            color: (loading || !controls?.length) ? "#a0aec0" : "#ffffff",
            border: "none",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: (loading || !controls?.length) ? "not-allowed" : "pointer",
            transition: "all 0.2s ease",
            boxShadow: (loading || !controls?.length) ? "none" : "0 2px 4px rgba(0, 196, 140, 0.2)"
          }}
        >
          Export CSV
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{
          textAlign: "center",
          padding: "60px 20px",
          background: "#f7f8fa",
          borderRadius: 8,
          border: "2px dashed #e1e4e8"
        }}>
          <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }}>⏳</div>
          <p style={{
            color: "#718096",
            fontSize: 16,
            fontWeight: 500,
            margin: 0
          }}>
            Loading controls…
          </p>
        </div>
      )}

      {/* Empty state */}
      {!loading && (!controls || controls.length === 0) && (
        <div style={{
          textAlign: "center",
          padding: "60px 20px",
          background: "#f7f8fa",
          borderRadius: 8,
          border: "2px dashed #e1e4e8"
        }}>
          <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }}>📋</div>
          <p style={{
            color: "#718096",
            fontSize: 16,
            fontWeight: 500,
            margin: 0
          }}>
            No controls match your filters.
          </p>
        </div>
      )}

      {/* Tabla de resultados */}
      {!loading && controls?.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: 0,
            border: "1px solid #e1e4e8",
            borderRadius: 8,
            overflow: "hidden"
          }}>
            <thead style={{
              background: "linear-gradient(180deg, #f7f8fa 0%, #edf2f7 100%)"
            }}>
              <tr>
                {columns.map(col => (
                  <th
                    key={col.key}
                    style={{
                      textAlign: "left",
                      padding: "14px 16px",
                      color: "#1a1f36",
                      fontSize: 13,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      borderBottom: "2px solid #e1e4e8",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {controls.map((c, idx) => (
                <tr
                  key={c.id}
                  style={{
                    transition: "background 0.15s ease"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#f7f8fa"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  {columns.map(col => (
                    <td
                      key={col.key}
                      style={{
                        padding: "12px 16px",
                        color: "#4a5568",
                        fontSize: 14,
                        borderBottom: idx === controls.length - 1 ? "none" : "1px solid #e1e4e8"
                      }}
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