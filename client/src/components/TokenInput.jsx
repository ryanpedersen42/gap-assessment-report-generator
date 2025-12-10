import React from "react";

export default function TokenInput({ token, setToken, region, setRegion }) {
  return (
    <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 12 }}>
      <h3 style={{ marginTop: 0 }}>0) API Token</h3>

      <label style={{ display: "block", marginBottom: 8 }}>
        <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>Region</div>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          style={{ width: "100%", padding: 8, borderRadius: 8 }}
        >
          <option value="https://public-api.drata.com/public/v2">North America</option>
          <option value="https://public-api.eu.drata.com/public/v2">Europe</option>
          <option value="https://public-api.apac.drata.com/public/v2">APAC</option>
        </select>
      </label>

      <label style={{ display: "block" }}>
        <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>Bearer Token</div>
        <input
          type="password"
          placeholder="Paste Drata API token here"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          style={{ width: "100%", padding: 8, borderRadius: 8 }}
        />
      </label>

      <p style={{ fontSize: 12, color: "#777", marginTop: 8 }}>
        Token is stored only in this browser session.
      </p>
    </div>
  );
}