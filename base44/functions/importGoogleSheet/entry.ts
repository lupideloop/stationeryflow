import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

function extractSpreadsheetId(input) {
  const match = input.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : input.trim();
}

async function fetchTab(spreadsheetId, accessToken, tabName) {
  const range = encodeURIComponent(`'${tabName}'!A2:Z10000`);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (!res.ok) return null;
  const data = await res.json();
  return data.values || [];
}

function toNumber(v) {
  const n = Number(String(v || "0").replace(/[^0-9.-]/g, ""));
  return isNaN(n) ? 0 : n;
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { spreadsheetUrl } = await req.json();
    if (!spreadsheetUrl) return Response.json({ error: 'spreadsheetUrl is required' }, { status: 400 });

    const spreadsheetId = extractSpreadsheetId(spreadsheetUrl);
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');

    const result = { masterStock: 0, purchases: 0, transfers: 0, skippedItems: 0 };

    const existingItems = await base44.asServiceRole.entities.StockItem.list('item_id', 2000);
    const existingIds = new Set(existingItems.map((i) => i.item_id));

    const masterRows = await fetchTab(spreadsheetId, accessToken, 'Master Stock');
    if (masterRows) {
      const newItems = [];
      for (const row of masterRows) {
        const item_id = String(row[0] || '').trim();
        if (!item_id) continue;
        if (existingIds.has(item_id)) { result.skippedItems++; continue; }
        existingIds.add(item_id);
        newItems.push({
          item_id,
          details: String(row[1] || ''),
          category: String(row[2] || 'Other'),
          qty_in: toNumber(row[3]),
          qty_out: toNumber(row[4]),
          stock_level: toNumber(row[5]),
          unit_cost: toNumber(row[6]),
          total_value: toNumber(row[7]),
          minimum_stock_level: toNumber(row[8]),
          status: String(row[9] || 'OK').toLowerCase().includes('low') ? 'Low Stock' : 'OK',
        });
      }
      if (newItems.length) {
        await base44.asServiceRole.entities.StockItem.bulkCreate(newItems);
        result.masterStock = newItems.length;
      }
    }

    const purchaseRows = await fetchTab(spreadsheetId, accessToken, 'Purchase Log');
    if (purchaseRows) {
      const purchases = purchaseRows.filter((r) => r[1]).map((row) => ({
        date: String(row[0] || ''),
        item_id: String(row[1] || ''),
        details: String(row[2] || ''),
        quantity_purchased: toNumber(row[3]),
        unit_price: toNumber(row[4]),
        line_total: toNumber(row[5]),
      }));
      if (purchases.length) {
        await base44.asServiceRole.entities.Purchase.bulkCreate(purchases);
        result.purchases = purchases.length;
      }
    }

    const transferRows = await fetchTab(spreadsheetId, accessToken, 'Transfer Log');
    if (transferRows) {
      const transfers = transferRows.filter((r) => r[1]).map((row) => ({
        date: String(row[0] || ''),
        item_id: String(row[1] || ''),
        details: String(row[2] || ''),
        quantity_issued: toNumber(row[3]),
        department: String(row[4] || 'Other'),
        unit_price: toNumber(row[5]),
        total_cost: toNumber(row[6]),
        month_year: String(row[7] || ''),
      }));
      if (transfers.length) {
        await base44.asServiceRole.entities.Transfer.bulkCreate(transfers);
        result.transfers = transfers.length;
      }
    }

    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}