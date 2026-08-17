import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const { token } = await req.json();
    if (!token) {
      return Response.json({ error: 'Missing token' }, { status: 400 });
    }

    const links = await base44.asServiceRole.entities.RequisitionLink.filter({ token });
    const link = links[0];

    if (!link || link.active === false) {
      return Response.json({ error: 'Invalid or inactive link' }, { status: 404 });
    }

    return Response.json({ department_name: link.department_name });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}