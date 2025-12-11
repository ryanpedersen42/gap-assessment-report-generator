import React from "react";

export default function WorkspaceSelect({ workspaces, value, onChange, loading, disabled }) {
  return (
    <div style={{
      background: "#ffffff",
      padding: "28px 40px",
      borderBottom: "2px solid #e1e4e8",
      borderRight: "1px solid #e1e4e8",
      position: "relative"
    }}>
      {/* Número de sección */}
      <div style={{
        position: "absolute",
        left: 12,
        top: 28,
        fontSize: 20,
        fontWeight: 700,
        color: "#0066ff"
      }}>
        1)
      </div>

      <h3 style={{
        color: "#1a1f36",
        fontSize: 18,
        fontWeight: 600,
        margin: "0 0 20px 0",
        paddingLeft: 24
      }}>
        Select workspace
      </h3>

      <label style={{ display: "block" }}>
        <div style={{
          color: "#4a5568",
          fontSize: 13,
          fontWeight: 500,
          marginBottom: 8,
          textTransform: "uppercase",
          letterSpacing: "0.5px"
        }}>
          Workspace
        </div>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={loading || disabled}
          style={{
            width: "100%",
            padding: "12px 16px",
            border: "2px solid #e1e4e8",
            borderRadius: 8,
            fontSize: 14,
            color: value ? "#1a1f36" : "#a0aec0",
            background: "#ffffff",
            transition: "all 0.2s ease",
            cursor: "pointer",
            fontWeight: value ? 500 : 400
          }}
        >
          <option value="">{loading ? "Loading..." : "Select a workspace"}</option>
          {workspaces.map(w => (
            <option key={w.id} value={w.id}>{w.name}</option>
          ))}
        </select>
      </label>
    </div>
  );
}