export const DEFAULT_STATUS_ORDER = [
    "fully",
    "partially",
    "not implemented",
    "n/a",
    "na"
  ];
  
  export function statusRank(v, order = DEFAULT_STATUS_ORDER) {
    const s = String(v || "").toLowerCase().trim();
    const i = order.indexOf(s);
    return i === -1 ? order.length : i;
  }