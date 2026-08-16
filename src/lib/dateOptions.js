export const MONTHS = [
  { value: "01", label: "January" }, { value: "02", label: "February" },
  { value: "03", label: "March" }, { value: "04", label: "April" },
  { value: "05", label: "May" }, { value: "06", label: "June" },
  { value: "07", label: "July" }, { value: "08", label: "August" },
  { value: "09", label: "September" }, { value: "10", label: "October" },
  { value: "11", label: "November" }, { value: "12", label: "December" }
];

export function getYearOptions() {
  const current = new Date().getFullYear();
  const years = [];
  for (let y = current - 3; y <= current + 1; y++) years.push(y);
  return years;
}

export function currentMonthYear() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return { month: m, year: String(d.getFullYear()) };
}