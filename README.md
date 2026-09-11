# DeskFlow — IT Service Desk & Ticket Management System

A role-based IT Service Desk built with **React + TypeScript + Vite**, styled with **Tailwind CSS**, and backed by **JSON Server** as a mock REST API. Admins, Support Agents, and Employees each get a dedicated dashboard, ticket workflow, and permission set.

## Project overview

DeskFlow lets employees raise IT tickets, support agents work an assigned queue, and admins manage the whole desk — users, categories, assignment, and the full ticket lifecycle (Open → Assigned → In Progress → Pending → Resolved → Closed, with Cancel and Reopen paths). All data is served from a local `db.json` file via JSON Server, so the app runs entirely offline with no external API keys.

## Technologies used

- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router v6
- Axios
- JSON Server (mock REST backend)

## Project structure

```
src/
├── components/       # Reusable UI: Navbar, Sidebar, Dashboard, Tickets, Users, Categories, common
├── pages/             # Route-level views: Login, Dashboard, Tickets, Users, Categories, Profile
├── services/          # Axios-based API calls (ticketService, userService, categoryService, commentService, authService)
├── types/             # Shared TypeScript interfaces
├── context/           # AuthContext, ToastContext
├── hooks/             # useAuth, useToast
├── routes/            # AppRoutes, ProtectedRoute (role-based route guarding)
└── utils/             # permissions.ts (RBAC rules), validators.ts, dateUtils.ts
db.json                # Mock database: users, tickets, comments, categories
```

## Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the mock backend** (JSON Server, runs on port 4000)
   ```bash
   npm run server
   ```

3. **Start the React app** (in a second terminal, runs on port 5173)
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser. Both the JSON Server and the Vite dev server need to be running at the same time.

## Login credentials

| Role           | Email                        | Password      |
|----------------|-------------------------------|---------------|
| Admin          | admin@deskflow.io             | Admin@123     |
| Support Agent  | agent1@deskflow.io            | Agent@123     |
| Support Agent  | agent2@deskflow.io            | Agent@123     |
| Employee       | employee@deskflow.io          | Employee@123  |
| Employee       | priya.menon@deskflow.io       | Employee@123  |

The login screen also has one-click buttons that fill these in for you.

## API endpoints (JSON Server)

Base URL: `http://localhost:4000`

| Resource   | Endpoints                                                                 |
|------------|----------------------------------------------------------------------------|
| Users      | `GET/POST /users`, `GET/PUT/PATCH/DELETE /users/:id`                      |
| Tickets    | `GET/POST /tickets`, `GET/PUT/PATCH/DELETE /tickets/:id`                  |
| Comments   | `GET/POST /comments`, `GET/PUT/PATCH/DELETE /comments/:id` (filter with `?ticketId=`) |
| Categories | `GET/POST /categories`, `GET/PUT/PATCH/DELETE /categories/:id`            |

## Role permissions

| Feature              | Admin | Support Agent | Employee     |
|-----------------------|-------|----------------|--------------|
| Dashboard              | Full  | Own data       | Own data     |
| Create ticket           | Yes   | Yes            | Yes          |
| View all tickets        | Yes   | No             | No           |
| View assigned tickets   | Yes   | Yes            | No           |
| View own tickets        | Yes   | Yes            | Yes          |
| Edit ticket              | Yes   | Assigned only  | Own & Open   |
| Delete ticket            | Yes   | No             | No           |
| Assign / Reassign ticket | Yes   | No             | No           |
| Update status            | Yes   | Assigned only  | Limited      |
| Update priority          | Yes   | Assigned only  | No           |
| Add comments             | Yes   | Yes            | Own tickets  |
| Add resolution           | Yes   | Yes            | No           |
| Manage users             | Yes   | No             | No           |
| Manage categories        | Yes   | No             | No           |

Route access, navigation items, and in-page actions are all driven by `src/utils/permissions.ts`, checked both when rendering (hiding actions the user can't take) and before every state-changing update.

## Ticket lifecycle

```
Open → Assigned → In Progress → Pending → Resolved → Closed
Open → Cancelled
Pending → In Progress
Resolved → Reopened (→ In Progress)
```

The set of status buttons shown on a ticket's detail page is computed per role from the ticket's current status — see `nextAllowedStatuses` in `src/utils/permissions.ts`.

## Deployment

The frontend can be deployed to **Netlify** or **Vercel**:

1. Push this repository to GitHub.
2. Import it into Netlify/Vercel, with build command `npm run build` and publish directory `dist`.
3. Since JSON Server is a local mock backend, deploy it separately (e.g. Render, Railway, or any Node host) and update `API_BASE_URL` in `src/services/api.ts` to point at the deployed backend URL before building.

## Notes

- All sample data (users, tickets, comments, categories) lives in `db.json` and resets whenever you edit that file — this is a mock backend intended for development and demos, not production use (passwords are stored in plain text in `db.json` for simplicity).
- Ticket IDs, activity history, and resolution timestamps are generated client-side when records are created or updated.
