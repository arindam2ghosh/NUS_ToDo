# Product Requirements Document (PRD)

## Product
**TodoMatic** — a simple task management UI built with React + Vite.

## Context
The app currently supports:
- Creating tasks, listing tasks, and marking tasks complete/incomplete.
- Filtering tasks by **All / Active / Completed**.
- Editing and deleting tasks.
- Basic focus management for accessibility (e.g., focus moves to the list heading after delete; edit field receives focus).

---

## Proposed Production Requirements (new)

### PRD-001 — Improve button styling (demo-friendly UI)
**Requirement**: Update the app's button colors/styles to make primary actions and destructive actions visually distinct.

**Acceptance Criteria**:
- “Add” and “Save” use a consistent primary style.
- “Delete” remains clearly destructive.
- Filter buttons have a clear selected state.
- All buttons have a hover state.

### PRD-002 — Add a simple banner / navigation panel
**Requirement**: Add a small top banner that shows the app title and a short subtitle (e.g., “React + Vite demo”), plus a compact area for quick info.

**Acceptance Criteria**:
- A new UI region is visible at the top (or side) on all screens.
- The banner includes a title and one line of descriptive text.
- The banner includes one small info item (choose one): task count, current filter name, or today’s date.

### PRD-003 — Add a due date field to each task
**Requirement**: Each task can optionally store a due date, which is displayed in the task item and editable.

**Acceptance Criteria**:
- When adding a task, the user can optionally set a due date.
- Each task displays its due date when present (e.g., “Due: 2026-02-04”).
- Editing a task allows updating the due date.
- If no due date is set, the UI shows nothing extra (no placeholder text).

---

## Release Checklist (informational)
- `yarn lint` passes.
- `yarn build` succeeds.
- Manual smoke test in `yarn preview` verifies add/edit/delete/filter flows.
