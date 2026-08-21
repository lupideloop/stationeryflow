# StationeryFlow

An all-in-one inventory management system for tracking stationery stock, purchases, departmental transfers, and monthly stock takes — with automated low-stock alerts, consumption analytics, and a self-service requisition portal for departments.

## What it does

- **Master Stock** — a live register of every stock item, with quantity in/out, unit cost, total value and low-stock status computed automatically.
- **Purchases & Transfers** — record incoming stock and outgoing departmental issues (single or bulk entry); stock levels and valuations update automatically.
- **Monthly Summary & Reports** — department- and item-level consumption analytics, top-consumed items, and low-stock warnings.
- **Stock Take** — start a monthly physical audit snapshot and reconcile found vs. recorded quantities.
- **Requisitions** — admins generate a per-department link; department staff submit stock requests through a public form that looks up live stock levels, without needing an account.
- **Elara** — an in-app AI assistant that answers questions about stock levels, purchase history, and transfer history in plain language.
- **Configuration** — departments and stock categories are defined per account, so the app adapts to how your organization is structured.

Data is isolated per account: each user (or admin) only sees the stock, purchases and transfers they own, enforced via row-level security on every core entity.

## Run Locally

Run the full local development environment from the project root:

```bash
base44 dev
```

`base44 dev` starts the local Base44 development backend and, when this app is configured for it, also starts the frontend dev server for you. Use the frontend URL printed by the command.

### Run Only The Frontend

If you only want to work on the frontend against the hosted Base44 backend:

```bash
npm run dev
```

Open the local URL printed by Vite.

### Environment Variables

For frontend-only development, create or update `.env.local` in the project root:

```bash
VITE_BASE44_APP_ID=your_app_id
VITE_BASE44_APP_BASE_URL=https://your-app.base44.app
VITE_BASE44_FUNCTIONS_VERSION=your_functions_version   # optional
```

- `VITE_BASE44_APP_ID` identifies the Base44 app.
- `VITE_BASE44_APP_BASE_URL` tells the Base44 Vite plugin where to send local `/api` requests — point it at your deployed app URL to use the hosted backend from a local frontend.
- `VITE_BASE44_FUNCTIONS_VERSION` pins a specific backend functions deployment (optional).

When you use `base44 dev`, these values are injected for you, so `.env.local` is mainly needed for frontend-only workflows.

## Data Model

| Entity | Purpose |
|---|---|
| `StockItem` | Master record per item: category, qty in/out, stock level, unit cost, total value, minimum level, status. |
| `Purchase` | An incoming stock transaction; increases the linked `StockItem`'s `qty_in` and updates its unit cost. |
| `Transfer` | An outgoing issue to a department; increases the linked `StockItem`'s `qty_out`. |
| `StockTake` | A monthly physical-audit snapshot per `StockItem`, comparing recorded vs. found quantity. |
| `Requisition` | A department's stock request submitted through the public requisition form, with items matched against live `StockItem` records. |
| `RequisitionLink` | A tokenized, per-department link used to access the public requisition form. |
| `Department` / `Category` | Self-configured lists used across forms and reports. |
| `AppSettings` | Per-account settings, e.g. the notification email for low-stock alerts. |

## Where the backend config lives

Base44 backend configuration (entities, functions, workflows, agents) lives under `base44/` in this repository:

- `base44/entities/` — entity schemas and row-level security rules
- `base44/functions/` — backend functions (Google Sheets import, requisition link generation/submission, low-stock alert email)
- `base44/workflows/` — scheduled/triggered automations (e.g. the low-stock alert workflow)
- `base44/agents/` — the Elara AI assistant configuration
- `base44/config.jsonc` — project-level Base44 config

## Publish Your Changes

After pushing your changes to git, open the Base44 dashboard and publish the app:

```bash
base44 dashboard open
```

## Docs & Support

Documentation: [https://docs.base44.com/Integrations/Using-GitHub](https://docs.base44.com/Integrations/Using-GitHub)

Base44 CLI command reference: [https://docs.base44.com/developers/references/cli/commands/introduction](https://docs.base44.com/developers/references/cli/commands/introduction)

Support: [https://app.base44.com/support](https://app.base44.com/support)