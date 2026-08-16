import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const { item_id, details, stock_level, minimum_stock_level } = await req.json();

    const users = await base44.asServiceRole.entities.User.list();
    const admins = users.filter((u) => u.role === 'admin');
    const recipients = admins.length ? admins : users;

    const subject = `Low Stock Alert: ${details || item_id}`;
    const body = `The item "${details || item_id}" (Code: ${item_id}) has reached its minimum stock level.\n\nCurrent stock: ${stock_level}\nMinimum stock level: ${minimum_stock_level}\n\nPlease arrange a restock soon.`;

    for (const recipient of recipients) {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: recipient.email,
        subject,
        body,
      });
    }

    return Response.json({ sent: recipients.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}