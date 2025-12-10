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
    <div style={{ display: "grid", gap: 10 }}>
      <label>
        <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>Filter field</div>
        <select
          value={filterFieldKey}
          onChange={(e) => onFilterFieldKey(e.target.value)}
          disabled={disabled}
          style={{ width: "100%", padding: 8, borderRadius: 8 }}
        >
          <option value="">No filter</option>
          {options.map(k => <option key={k} value={k}>{k}</option>)}
        </select>
      </label>

      <label>
        <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>Filter value</div>
        <input
          value={filterValue}
          onChange={(e) => onFilterValue(e.target.value)}
          disabled={disabled || !filterFieldKey}
          placeholder='e.g. "fully"'
          style={{ width: "100%", padding: 8, borderRadius: 8 }}
        />
      </label>

      <label>
        <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>Include fields as columns</div>
        <select
          multiple
          value={includeFieldKeys}
          onChange={(e) => {
            const vals = Array.from(e.target.selectedOptions).map(o => o.value);
            onIncludeFieldKeys(vals);
          }}
          disabled={disabled}
          style={{ width: "100%", padding: 8, borderRadius: 8, minHeight: 120 }}
        >
          {options.map(k => <option key={k} value={k}>{k}</option>)}
        </select>
      </label>

      <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type="checkbox"
          checked={sortByFilterField}
          onChange={(e) => onSortByFilterField(e.target.checked)}
          disabled={disabled || !filterFieldKey}
        />
        <span>Sort by filter field using default order</span>
      </label>
    </div>
  );
}