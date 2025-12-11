import React from "react";

export default function TokenInput({ token, setToken, region, setRegion }) {
  return (
    <div style={{
      background: "#ffffff",
      padding: "28px 40px",
      borderBottom: "2px solid #e1e4e8",
      position: "relative"
    }}>
      <div style={{
        position: "absolute",
        left: 12,
        top: 28,
        fontSize: 20,
        fontWeight: 700,
        color: "#0066ff"
      }}>
        0)
      </div>

      <h3 style={{
        color: "#1a1f36",
        fontSize: 18,
        fontWeight: 600,
        margin: "0 0 20px 0",
        paddingLeft: 24
      }}>
        API Token
      </h3>

      <label style={{ display: "block", marginBottom: 20 }}>
        <div style={{
          color: "#4a5568",
          fontSize: 13,
          fontWeight: 500,
          marginBottom: 8,
          textTransform: "uppercase",
          letterSpacing: "0.5px"
        }}>
          Region
        </div>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 16px",
            border: "2px solid #e1e4e8",
            borderRadius: 8,
            fontSize: 14,
            color: "#1a1f36",
            background: "#ffffff",
            transition: "all 0.2s ease",
            cursor: "pointer"
          }}
        >
          <option value="https://public-api.drata.com/public/v2">North America</option>
          <option value="https://public-api.eu.drata.com/public/v2">Europe</option>
          <option value="https://public-api.apac.drata.com/public/v2">APAC</option>
        </select>
      </label>

      <label style={{ display: "block" }}>
        <div style={{
          color: "#4a5568",
          fontSize: 13,
          fontWeight: 500,
          marginBottom: 8,
          textTransform: "uppercase",
          letterSpacing: "0.5px"
        }}>
          Bearer Token
        </div>
        <input
          type="password"
          placeholder="Paste Drata API token here"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 16px",
            border: "2px solid #e1e4e8",
            borderRadius: 8,
            fontSize: 14,
            color: "#1a1f36",
            background: "#f7f8fa",
            transition: "all 0.2s ease",
            fontFamily: '"Monaco", "Courier New", monospace'
          }}
        />
      </label>

      <p style={{
        display: "block",
        marginTop: 8,
        fontSize: 12,
        color: "#718096",
        fontStyle: "italic"
      }}>
        Token is stored only in this browser session.
      </p>
    </div>
  );
}