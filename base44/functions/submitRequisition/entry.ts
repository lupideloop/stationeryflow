import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const { token, requester_name, items } = await req.json();

    if (!token || !requester_name || !Array.isArray(items) || items.length === 0) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const links = await base44.asServiceRole.entities.RequisitionLink.filter({ token });
    const link = links[0];

    if (!link || link.active === false) {
      return Response.json({ error: 'Invalid or inactive link' }, { status: 404 });
    }

    const ownerId = link.created_by_id;
    const stockItems = await base44.asServiceRole.entities.StockItem.filter({ created_by_id: ownerId });

    const matchedItems = items.map((entry) => {
      const searchTerm = String(entry.item_name || '').toLowerCase().trim();
      const match = stockItems.find((si) => {
        const itemId = String(si.item_id || '').toLowerCase();
        const details = String(si.details || '').toLowerCase();
        return itemId === searchTerm || details.includes(searchTerm) || (details && searchTerm.includes(details));
      });
      return {
        item_name: entry.item_name,
        quantity: entry.quantity,
        matched_item_id: match ? match.item_id : '',
        stock_level: match ? match.stock_level : null,
      };
    });

    const requisition = await base44.asServiceRole.entities.Requisition.create({
      request_date: new Date().toISOString().split('T')[0],
      requester_name,
      department: link.department_name,
      status: 'Pending',
      items: matchedItems,
      owner_user_id: ownerId,
    });

    return Response.json({ success: true, id: requisition.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}