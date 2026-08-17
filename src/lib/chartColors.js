export const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6, var(--chart-1)))",
  "hsl(var(--chart-7, var(--chart-2)))",
  "hsl(var(--chart-8, var(--chart-3)))",
  "hsl(var(--chart-9, var(--chart-4)))",
  "hsl(var(--chart-10, var(--chart-5)))",
  "hsl(var(--chart-11, var(--chart-1)))",
  "hsl(var(--chart-12, var(--chart-2)))",
];

export function getChartColor(index) {
  return CHART_COLORS[index % CHART_COLORS.length];
}