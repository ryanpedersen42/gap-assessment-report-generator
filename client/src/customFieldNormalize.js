// Rename-proof map: label key + stable cf:<id> key.
// This matches what App.jsx expects to import as deriveCustomFieldMap.

export function deriveCustomFieldMap(customFields) {
  const map = {};

  for (const cf of customFields || []) {
    const idKey = cf?.id != null ? `cf:${cf.id}` : null;
    const labelKey = cf?.label || cf?.name || null;

    const raw =
      cf?.value ??
      cf?.selectedOption ??
      cf?.textValue ??
      cf?.numberValue ??
      null;

    const value = {
      id: cf?.id,
      label: cf?.label || cf?.name || "",
      type: cf?.type || cf?.fieldType || "unknown",
      raw,
      text: raw == null ? "" : String(raw)
    };

    if (labelKey) map[labelKey] = value;
    if (idKey) map[idKey] = value;
  }

  return map;
}