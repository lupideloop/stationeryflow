export function computeDerivedFields(item) {
  const qty_in = Number(item.qty_in) || 0;
  const qty_out = Number(item.qty_out) || 0;
  const unit_cost = Number(item.unit_cost) || 0;
  const minimum_stock_level = Number(item.minimum_stock_level) || 0;
  const stock_level = qty_in - qty_out;
  const total_value = Number((stock_level * unit_cost).toFixed(2));
  const status = stock_level <= minimum_stock_level ? "Low Stock" : "OK";
  return { stock_level, total_value, status };
}