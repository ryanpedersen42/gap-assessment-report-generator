import React, { useMemo } from "react";

export default function FieldSelect({
  fieldKeys,
  filterFieldKey,
  onFilterFieldKey,
  filterValue,
  onFilterValue,
  includeFieldKeys,
  onIncludeFieldKeys,
  sortByFilterField,
  onSortByFilterField,
  disabled
}) {
  const options = useMemo(() => fieldKeys || [], [fieldKeys]);

  return (
    <div style={{
      background: "#ffffff",
      padding: "28px 40px",
      borderBottom: "2px solid #e1e4e8",
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
        2)
      </div>

      <h3 style={{
        color: "#1a1f36",
        fontSize: 18,
        fontWeight: 600,
        margin: "0 0 20px 0",
        paddingLeft: 24
      }}>
        Pick fields
      </h3>

      <div style={{ display: "grid", gap: 16 }}>
        <label>
          <div style={{
            color: "#4a5568",
            fontSize: 13,
            fontWeight: 500,
            marginBottom: 8,
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}>
            Filter field
          </div>
          <select
            value={filterFieldKey}
            onChange={(e) => onFilterFieldKey(e.target.value)}
            disabled={disabled}
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "2px solid #e1e4e8",
              borderRadius: 8,
              fontSize: 14,
              color: filterFieldKey ? "#1a1f36" : "#a0aec0",
              background: "#ffffff",
              transition: "all 0.2s ease",
              cursor: "pointer"
            }}
          >
            <option value="">No filter</option>
            {options.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </label>

        <label>
          <div style={{
            color: "#4a5568",
            fontSize: 13,
            fontWeight: 500,
            marginBottom: 8,
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}>
            Filter value
          </div>
          <input
            value={filterValue}
            onChange={(e) => onFilterValue(e.target.value)}
            disabled={disabled || !filterFieldKey}
            placeholder='e.g. "fully"'
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "2px solid #e1e4e8",
              borderRadius: 8,
              fontSize: 14,
              color: "#1a1f36",
              background: "#ffffff",
              transition: "all 0.2s ease"
            }}
          />
        </label>

        <label>
          <div style={{
            color: "#4a5568",
            fontSize: 13,
            fontWeight: 500,
            marginBottom: 8,
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}>
            Include fields as columns
          </div>
          <select
            multiple
            value={includeFieldKeys}
            onChange={(e) => {
              const vals = Array.from(e.target.selectedOptions).map(o => o.value);
              onIncludeFieldKeys(vals);
            }}
            disabled={disabled}
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "2px solid #e1e4e8",
              borderRadius: 8,
              fontSize: 14,
              color: "#1a1f36",
              background: "#f7f8fa",
              transition: "all 0.2s ease",
              minHeight: 120,
              fontFamily: '"Monaco", "Courier New", monospace',
              lineHeight: 1.6
            }}
          >
            {options.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </label>

        <label style={{
          display: "flex",
          alignItems: "center",
          padding: 12,
          background: "#f7f8fa",
          borderRadius: 8,
          border: "1px solid #e1e4e8",
          cursor: disabled || !filterFieldKey ? "not-allowed" : "pointer"
        }}>
          <input
            type="checkbox"
            checked={sortByFilterField}
            onChange={(e) => onSortByFilterField(e.target.checked)}
            disabled={disabled || !filterFieldKey}
            style={{
              width: 18,
              height: 18,
              marginRight: 10,
              cursor: disabled || !filterFieldKey ? "not-allowed" : "pointer",
              accentColor: "#0066ff"
            }}
          />
          <span style={{
            color: "#4a5568",
            fontSize: 13,
            fontWeight: 500
          }}>
            Sort by filter field using default order
          </span>
        </label>
      </div>
    </div>
  );
}