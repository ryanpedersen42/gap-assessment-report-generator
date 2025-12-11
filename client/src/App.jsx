import React, { useEffect, useMemo, useState } from "react";
import { getWorkspaces, getControls } from "./api.js";
import TokenInput from "./components/TokenInput.jsx";
import WorkspaceSelect from "./components/WorkspaceSelect.jsx";
import FieldSelect from "./components/FieldSelect.jsx";
import ControlsTable from "./components/ControlsTable.jsx";
import { statusRank, DEFAULT_STATUS_ORDER } from "./customFields.js";
import { deriveCustomFieldMap } from "./customFieldNormalize.js";

export default function App() {
  const [token, setToken] = useState("");
  const [base, setBase] = useState("https://public-api.drata.com/public/v2");

  const [workspaces, setWorkspaces] = useState([]);
  const [workspaceId, setWorkspaceId] = useState("");

  const [controls, setControls] = useState([]);
  const [fieldKeys, setFieldKeys] = useState([]);

  const [filterFieldKey, setFilterFieldKey] = useState("");
  const [filterValue, setFilterValue] = useState("");

  const [includeFieldKeys, setIncludeFieldKeys] = useState([]);
  const [sortByFilterField, setSortByFilterField] = useState(true);
  const [includeMappings, setIncludeMappings] = useState(false);

  const [loadingWs, setLoadingWs] = useState(false);
  const [loadingControls, setLoadingControls] = useState(false);
  const [error, setError] = useState("");

  // Load workspaces after token is entered
  useEffect(() => {
    if (!token) return;
    (async () => {
      setLoadingWs(true);
      setError("");
      try {
        const data = await getWorkspaces(base, token);
        setWorkspaces(data.workspaces || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoadingWs(false);
      }
    })();
  }, [token, base]);

  // Load controls for selected workspace
  useEffect(() => {
    if (!token || !workspaceId) return;

    (async () => {
      setLoadingControls(true);
      setError("");

      try {
        const listResp = await getControls(base, workspaceId, token);
        const rawControls = listResp.controls || [];

        const normalized = rawControls.map(c => {
          const customFields = Array.isArray(c.customFields) ? c.customFields : [];
          return {
            id: c.id,
            name: c.name ?? c.code ?? "—",
            code: c.code ?? "",
            readiness: c.readiness ?? c.status ?? "—",
            customFields,
            cfMap: deriveCustomFieldMap(customFields),
            raw: c  // keep full raw for frameworkTags fallback
          };
        });

        const customFieldKeys = Array.from(
          normalized.reduce((set, c) => {
            Object.keys(c.cfMap || {}).forEach(k => set.add(k));
            return set;
          }, new Set())
        ).sort();

        setControls(normalized);
        setFieldKeys(customFieldKeys);

        setFilterFieldKey("");
        setFilterValue("");
        setIncludeFieldKeys([]);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoadingControls(false);
      }
    })();
  }, [token, base, workspaceId]);

  const filteredSortedControls = useMemo(() => {
    let out = controls;

    if (filterFieldKey && filterValue) {
      out = out.filter(c => {
        const v = c.cfMap?.[filterFieldKey]?.raw;
        return String(v ?? "").toLowerCase().trim() ===
               String(filterValue).toLowerCase().trim();
      });
    }

    if (sortByFilterField && filterFieldKey) {
      out = [...out].sort((a, b) => {
        const av = a.cfMap?.[filterFieldKey]?.raw;
        const bv = b.cfMap?.[filterFieldKey]?.raw;
        return statusRank(av, DEFAULT_STATUS_ORDER) -
               statusRank(bv, DEFAULT_STATUS_ORDER);
      });
    }

    return out;
  }, [controls, filterFieldKey, filterValue, sortByFilterField]);

  return (
    <div style={{
      maxWidth: 1200,
      margin: "40px auto",
      background: "#ffffff",
      borderRadius: 12,
      boxShadow: "0 4px 20px rgba(26, 31, 54, 0.08)",
      overflow: "hidden"
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0066ff 0%, #0052cc 100%)",
        padding: "32px 40px",
        borderRadius: "12px 12px 0 0",
        boxShadow: "0 2px 8px rgba(0, 102, 255, 0.15)"
      }}>
        <h1 style={{
          color: "#ffffff",
          fontSize: 28,
          fontWeight: 700,
          margin: "0 0 12px 0",
          letterSpacing: "-0.5px"
        }}>
          Controls Custom Fields Report
        </h1>
        <p style={{
          color: "rgba(255, 255, 255, 0.9)",
          fontSize: 14,
          fontWeight: 400,
          margin: 0,
          lineHeight: 1.5
        }}>
          Paste a token, choose a workspace, then filter & include custom field columns.
        </p>
        <div style={{
          width: 60,
          height: 4,
          background: "#00c48c",
          marginTop: 16,
          borderRadius: 2
        }} />
      </div>

      {/* Error Banner */}
      {error && (
        <div style={{
          background: "#ffe8e6",
          color: "#cc2e24",
          borderLeft: "4px solid #ff3b30",
          padding: "16px 20px",
          margin: "20px 40px",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          fontSize: 14,
          fontWeight: 500
        }}>
          <span style={{ marginRight: 12, fontSize: 20 }}>⚠️</span>
          {error}
        </div>
      )}

      <TokenInput token={token} setToken={setToken} region={base} setRegion={setBase} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
        <WorkspaceSelect
          workspaces={workspaces}
          value={workspaceId}
          onChange={setWorkspaceId}
          loading={loadingWs}
          disabled={!token}
        />

        <FieldSelect
          fieldKeys={fieldKeys}
          filterFieldKey={filterFieldKey}
          onFilterFieldKey={setFilterFieldKey}
          filterValue={filterValue}
          onFilterValue={setFilterValue}
          includeFieldKeys={includeFieldKeys}
          onIncludeFieldKeys={setIncludeFieldKeys}
          sortByFilterField={sortByFilterField}
          onSortByFilterField={setSortByFilterField}
          disabled={!workspaceId || loadingControls || !token}
        />
      </div>

      <div style={{
        background: "#ffffff",
        padding: "20px 40px",
        borderBottom: "2px solid #e1e4e8"
      }}>
        <label style={{
          display: "flex",
          alignItems: "center",
          padding: 16,
          background: "#f7f8fa",
          borderRadius: 8,
          border: "1px solid #e1e4e8",
          cursor: "pointer",
          transition: "all 0.2s ease"
        }}>
          <input
            type="checkbox"
            checked={includeMappings}
            onChange={(e) => setIncludeMappings(e.target.checked)}
            disabled={!workspaceId || loadingControls}
            style={{
              width: 18,
              height: 18,
              marginRight: 12,
              cursor: "pointer",
              accentColor: "#0066ff"
            }}
          />
          <span style={{
            color: "#1a1f36",
            fontSize: 14,
            fontWeight: 500
          }}>
            Include mapped frameworks & requirements
          </span>
        </label>
      </div>

      <ControlsTable
        controls={filteredSortedControls}
        includeFieldKeys={includeFieldKeys}
        filterFieldKey={filterFieldKey}
        includeMappings={includeMappings}
        loading={loadingControls}
      />
    </div>
  );
}