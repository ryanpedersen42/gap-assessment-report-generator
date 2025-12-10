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
    <div style={{ fontFamily: "system-ui", padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 6 }}>Controls Custom Fields Report</h1>
      <p style={{ color: "#555", marginTop: 0 }}>
        Paste a token, choose a workspace, then filter & include custom field columns.
      </p>

      {error && (
        <div style={{ background: "#fee", color: "#900", padding: 10, borderRadius: 8, marginBottom: 12 }}>
          {error}
        </div>
      )}

      <TokenInput token={token} setToken={setToken} region={base} setRegion={setBase} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
        <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 12 }}>
          <h3 style={{ marginTop: 0 }}>1) Select workspace</h3>
          <WorkspaceSelect
            workspaces={workspaces}
            value={workspaceId}
            onChange={setWorkspaceId}
            loading={loadingWs}
            disabled={!token}
          />
        </div>

        <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 12 }}>
          <h3 style={{ marginTop: 0 }}>2) Pick fields</h3>
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
      </div>

      <div style={{ marginTop: 16 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <input
            type="checkbox"
            checked={includeMappings}
            onChange={(e) => setIncludeMappings(e.target.checked)}
            disabled={!workspaceId || loadingControls}
          />
          <span>Include mapped frameworks & requirements</span>
        </label>

        <ControlsTable
          controls={filteredSortedControls}
          includeFieldKeys={includeFieldKeys}
          filterFieldKey={filterFieldKey}
          includeMappings={includeMappings}
          loading={loadingControls}
        />
      </div>
    </div>
  );
}