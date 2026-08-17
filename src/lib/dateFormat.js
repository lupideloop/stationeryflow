// Converts an ISO date string ("YYYY-MM-DD", from <input type="date">) to "DD/MM/YYYY",
// matching the format used by imported Transfer/Purchase records.
export function toDisplayDate(isoDate) {
  if (!isoDate) return isoDate;
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) return isoDate;
  return `${day}/${month}/${year}`;
}