import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const { item_id, details, stock_level, minimum_stock_level } = await req.json();

    const users = await base44.asServiceRole.entities.User.list();
    const admins = users.filter((u) => u.role === 'admin');
    const recipients = admins.length ? admins : users;
    const emails = new Set(recipients.map((u) => u.email).filter(Boolean));

    const settingsList = await base44.asServiceRole.entities.AppSettings.list();
    const notificationEmail = settingsList[0]?.notification_email;
    if (notificationEmail) emails.add(notificationEmail);

    const subject = `Low Stock Alert: ${details || item_id}`;
    const body = `The item "${details || item_id}" (Code: ${item_id}) has reached its minimum stock level.\n\nCurrent stock: ${stock_level}\nMinimum stock level: ${minimum_stock_level}\n\nPlease arrange a restock soon.`;

    for (const email of emails) {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: email,
        subject,
        body,
      });
    }

    return Response.json({ sent: emails.size });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}