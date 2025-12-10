Controls Custom Fields Report (Standalone)

Standalone app to generate a report of Controls filtered/sorted by Custom Fields per workspace.
This is completely separate from the NodeJS risk report dashboard, but it reuses the same core logic:
	•	Always request custom fields via expand[]=customFields
	•	Normalize custom fields into a stable map keyed by both label and stable ID key (cf:<id>) so renames don’t break reports
	•	Cursor pagination until all records are loaded for a selected workspace

⸻

What it does
	1.	Lists all workspaces (for a dropdown).
	2.	After selecting a workspace, fetches all controls in that workspace with custom fields included.
	3.	Builds a union list of custom fields available in that workspace.
	4.	Lets you:
	•	choose a custom field to filter by
	•	enter a filter value (example: fully)
	•	choose additional custom fields to include as columns
	•	optionally sort by the filter field using a stable ordering
	5.	Shows a table and enables CSV export.

Example use case:
	•	Filter/sort by dropdown custom field values: fully, partially, not implemented, N/A
	•	Include a text custom field: assessor notes

Even if labels change later, selecting via the stable cf:<id> key keeps reports valid.

⸻

Repo layout

controls-custom-fields-report/
├─ README.md
├─ package.json
├─ .env.example
├─ server/
│  ├─ index.js
│  ├─ drataClient.js
│  └─ customFields.js
└─ client/
├─ index.html
├─ package.json
├─ vite.config.js
└─ src/
├─ main.jsx
├─ App.jsx
├─ api.js
├─ customFields.js
└─ components/
├─ WorkspaceSelect.jsx
├─ FieldSelect.jsx
└─ ControlsTable.jsx

⸻

Requirements
	•	Node 18+
	•	A Drata Public API token that can read:
	•	Workspaces
	•	Controls
	•	Custom Fields via expansion

⸻

Setup
	1.	Create a new repo folder and add the files from the “all files needed” response into the structure above.
	2.	Create env file:
cp .env.example .env
	4.	Install dependencies:
npm install
	5.	Run in dev mode (server + client):
npm run dev

	•	Server: http://localhost:4000
	•	Client: http://localhost:5173 (proxies /api to server)

⸻

Scripts

From repo root:

Dev

npm run dev

Build client

npm run build

Run production server

npm start

⸻

API behavior

Workspaces dropdown

Server calls:

GET /public/v2/workspaces
	•	Cursor paginated
	•	Mapped to { id, name } for the UI dropdown

Controls list (with custom fields)

Server calls:

GET /public/v2/workspaces/{workspaceId}/controls?expand[]=customFields
	•	Cursor paginated
	•	expand[]=customFields is required or custom fields won’t be returned

⸻

Custom field normalization (rename-proofing)

Each control’s custom fields are normalized into:

cfMap:
	•	label key, if present
	•	stable id key cf:<id> always

Example:

cfMap = {
“Assessor notes”: { raw: “…”, type: “text”, id: 789 },
“cf:789”:         { raw: “…”, type: “text”, id: 789 },

“Implementation status”: { raw: “fully”, type: “dropdown”, id: 456 },
“cf:456”:                { raw: “fully”, type: “dropdown”, id: 456 }
}

UI shows friendly label keys, but you should persist/filter on cf:<id> keys whenever possible since labels can change per workspace or over time.

⸻

Filtering
	•	When a filter field and value are selected, the report includes only controls where:

lowercase(control.cfMap[fieldKey].raw) === lowercase(filterValue)

Missing fields simply don’t match the filter.

⸻

Sorting

If “Sort by filter field using default order” is enabled, the client sorts by:

[“fully”, “partially”, “not implemented”, “n/a”, “na”]

Unknown values sort last.

You can change the ordering in:

client/src/customFields.js

⸻

CSV export

Click “Export CSV” above the table.

Exports:
	•	current filtered + sorted controls
	•	base columns (Control, Code, Readiness)
	•	selected custom-field columns
	•	filter field column (if not already included)

⸻

Troubleshooting

DRATA_API_TOKEN is not set
	•	Verify .env exists at repo root
	•	Ensure the token is present and restart the server

Empty custom fields
	•	Confirm the token has permissions to read custom fields
	•	Ensure the request includes expand[]=customFields

Some controls don’t show certain fields

Expected. Custom fields vary by control. Missing values render as — in UI and empty in CSV.

⸻

Easy extensions
	•	Type-aware filter UI:
	•	if field is dropdown, show options instead of free-text entry
	•	Saved report configs:
	•	persist {workspaceId, filterKey, includeKeys, sortOrder} to localStorage
	•	Multi-workspace export:
	•	iterate workspaces and merge results into one CSV