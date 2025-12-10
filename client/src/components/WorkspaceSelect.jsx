import React from "react";

export default function WorkspaceSelect({ workspaces, value, onChange, loading, disabled }) {
  return (
    <label style={{ display: "block" }}>
      <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>Workspace</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading || disabled}
        style={{ width: "100%", padding: 8, borderRadius: 8 }}
      >
        <option value="">{loading ? "Loading..." : "Select a workspace"}</option>
        {workspaces.map(w => (
          <option key={w.id} value={w.id}>{w.name}</option>
        ))}
      </select>
    </label>
  );
}