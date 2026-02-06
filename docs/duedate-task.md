# Task: PRD-003 — Add Due Date Field to Tasks

**Feature ID**: PRD-003  
**Priority**: High  
**Estimated Effort**: 3-4 hours  
**Dependencies**: None

---

## Objective

Add optional due date support to tasks, allowing users to set, edit, and view due dates for each task. Use native HTML5 date input for zero dependencies and accessibility.

---

## Step-by-Step Implementation Plan

### Step 1: Update Data Model in Initial State
**Action**: Add `dueDate` property to initial tasks in [src/main.jsx](../src/main.jsx).

**Changes**:
```jsx
const DATA = [
  { id: "todo-0", name: "Eat", completed: true, dueDate: null },
  { id: "todo-1", name: "Sleep", completed: false, dueDate: "2026-02-08" },
  { id: "todo-2", name: "Repeat", completed: false, dueDate: null }
];
```

**Files affected**: [src/main.jsx](../src/main.jsx)

**Rationale**: 
- Demonstrates due date with/without values.
- ISO format (`YYYY-MM-DD`) matches `<input type="date">` value format.
- `null` for tasks without due date (not empty string).

---

### Step 2: Add Date Input to Form Component
**Action**: Update [src/components/Form.jsx](../src/components/Form.jsx) to include due date input.

**Changes**:

1. **Add state for due date**:
```jsx
import { useState } from "react";

function Form(props) {
  const [name, setName] = useState('');
  const [dueDate, setDueDate] = useState(''); // New state

  // ... rest of component
}
```

2. **Add due date input field** (after task name input):
```jsx
return (
  <form onSubmit={handleSubmit}>
    <h2 className="label-wrapper">
      <label htmlFor="new-todo-input" className="label__lg">
        What needs to be done?
      </label>
    </h2>

    <input
      type="text"
      id="new-todo-input"
      className="input input__lg"
      name="text"
      autoComplete="off"
      value={name}
      onChange={handleChange}
    />
    
    {/* NEW: Due date input */}
    <div className="form-group">
      <label htmlFor="due-date-input" className="label__md">
        Due date (optional)
      </label>
      <input
        type="date"
        id="due-date-input"
        className="input input__md"
        name="dueDate"
        value={dueDate}
        onChange={handleDateChange}
      />
    </div>

    <button type="submit" className="btn btn__primary btn__lg">
      Add
    </button>
  </form>
);
```

3. **Add change handler for date**:
```jsx
function handleDateChange(event) {
  setDueDate(event.target.value);
}
```

4. **Update submit handler** to pass due date:
```jsx
function handleSubmit(event) {
  event.preventDefault();
  props.addTask(name, dueDate || null); // Pass null if empty
  setName("");
  setDueDate(""); // Clear date field
}
```

**Files affected**: [src/components/Form.jsx](../src/components/Form.jsx)

---

### Step 3: Update App Component — addTask Function
**Action**: Modify `addTask` in [src/App.jsx](../src/App.jsx) to accept and store due date.

**Changes**:
```jsx
function addTask(name, dueDate) {
  const newTask = { 
    id: "todo-" + nanoid(), 
    name: name, 
    completed: false,
    dueDate: dueDate || null  // Store null if not provided
  };
  setTasks([...tasks, newTask]);
}
```

**Files affected**: [src/App.jsx](../src/App.jsx) line ~91

**Note**: Change function signature from `addTask(name)` to `addTask(name, dueDate)`.

---

### Step 4: Update App Component — editTask Function
**Action**: Modify `editTask` in [src/App.jsx](../src/App.jsx) to accept and update due date.

**Changes**:
```jsx
function editTask(id, newName, newDueDate) {
  const editedTaskList = tasks.map((task) => {
    if (id === task.id) {
      return { 
        ...task, 
        name: newName,
        dueDate: newDueDate || null  // Update due date
      };
    }
    return task;
  });
  setTasks(editedTaskList);
}
```

**Files affected**: [src/App.jsx](../src/App.jsx) line ~58

**Note**: Change function signature from `editTask(id, newName)` to `editTask(id, newName, newDueDate)`.

---

### Step 5: Pass dueDate Prop to Todo Component
**Action**: Update Todo component instantiation in [src/App.jsx](../src/App.jsx).

**Changes**:
```jsx
const taskList = tasks
  ?.filter(FILTER_MAP[filter])
  .map((task) => (
    <Todo
      id={task.id}
      name={task.name}
      completed={task.completed}
      dueDate={task.dueDate}  // Add new prop
      key={task.id}
      toggleTaskCompleted={toggleTaskCompleted}
      deleteTask={deleteTask}
      editTask={editTask}
    />
  ));
```

**Files affected**: [src/App.jsx](../src/App.jsx) line ~76

---

### Step 6: Create Date Formatting Helper
**Action**: Create utility function to format ISO date to human-readable format.

**Option 1**: Add inline in Todo.jsx (simple approach):
```jsx
function formatDate(isoString) {
  if (!isoString) return null;
  
  const date = new Date(isoString + 'T00:00:00'); // Add time to avoid timezone issues
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options); // "Feb 8, 2026"
}
```

**Option 2**: Create separate utility file (if reused elsewhere):
- File: `src/utils/formatDate.js`
- Export function and import in Todo.jsx

**Recommended**: Option 1 (inline) for now, refactor to Option 2 if needed elsewhere.

---

### Step 7: Display Due Date in Todo View Template
**Action**: Update [src/components/Todo.jsx](../src/components/Todo.jsx) to show due date.

**Changes**:

1. **Add formatDate helper** (inside Todo component or at top of file):
```jsx
function formatDate(isoString) {
  if (!isoString) return null;
  const date = new Date(isoString + 'T00:00:00');
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}
```

2. **Update viewTemplate** to display due date:
```jsx
const viewTemplate = (
  <div className="stack-small">
    <div className="c-cb">
      <input
        id={props.id}
        type="checkbox"
        defaultChecked={props.completed}
        onChange={() => props.toggleTaskCompleted(props.id)}
      />
      <label className="todo-label" htmlFor={props.id}>
        {props.name}
      </label>
    </div>
    
    {/* NEW: Display due date if present */}
    {props.dueDate && (
      <p className="todo-due-date">
        Due: {formatDate(props.dueDate)}
      </p>
    )}
    
    <div className="btn-group">
      <button
        type="button"
        className="btn"
        onClick={() => {
          setEditing(true);
        }}
        ref={editButtonRef}>
        Edit <span className="visually-hidden">{props.name}</span>
      </button>
      <button
        type="button"
        className="btn btn__danger"
        onClick={() => props.deleteTask(props.id)}>
        Delete <span className="visually-hidden">{props.name}</span>
      </button>
    </div>
  </div>
);
```

**Files affected**: [src/components/Todo.jsx](../src/components/Todo.jsx) line ~67-98

---

### Step 8: Add Due Date to Todo Edit Template
**Action**: Update Todo edit form to include date input.

**Changes**:

1. **Add state for newDueDate**:
```jsx
function Todo(props) {
  const [isEditing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDueDate, setNewDueDate] = useState("");  // New state

  // ... rest of component
}
```

2. **Add change handler**:
```jsx
function handleDateChange(event) {
  setNewDueDate(event.target.value);
}
```

3. **Update editingTemplate** to include date input:
```jsx
const editingTemplate = (
  <form className="stack-small" onSubmit={handleSubmit}>
    <div className="form-group">
      <label className="todo-label" htmlFor={props.id}>
        New name for {props.name}
      </label>
      <input
        id={props.id}
        className="todo-text"
        type="text"
        value={newName}
        onChange={handleChange}
        ref={editFieldRef}
      />
    </div>
    
    {/* NEW: Due date input in edit mode */}
    <div className="form-group">
      <label className="todo-label" htmlFor={`${props.id}-date`}>
        Due date (optional)
      </label>
      <input
        id={`${props.id}-date`}
        className="todo-text"
        type="date"
        value={newDueDate}
        onChange={handleDateChange}
      />
    </div>
    
    <div className="btn-group">
      <button
        type="button"
        className="btn todo-cancel"
        onClick={() => setEditing(false)}>
        Cancel
        <span className="visually-hidden">renaming {props.name}</span>
      </button>
      <button type="submit" className="btn btn__primary todo-edit">
        Save
        <span className="visually-hidden">new name for {props.name}</span>
      </button>
    </div>
  </form>
);
```

4. **Pre-fill date when entering edit mode** (useEffect):
```jsx
useEffect(() => {
  if (!wasEditing && isEditing) {
    editFieldRef.current.focus();
    setNewName(props.name);           // Pre-fill name
    setNewDueDate(props.dueDate || ""); // Pre-fill date
  }
}, [wasEditing, isEditing, props.name, props.dueDate]);
```

5. **Update handleSubmit** to pass due date:
```jsx
function handleSubmit(event) {
  event.preventDefault();
  props.editTask(props.id, newName, newDueDate || null);
  setNewName("");
  setNewDueDate("");
  setEditing(false);
}
```

**Files affected**: [src/components/Todo.jsx](../src/components/Todo.jsx)

---

### Step 9: Add CSS Styles for Due Date
**Action**: Add styles for due date display and form inputs in [src/index.css](../src/index.css).

**Changes**:

1. **Add due date text styles** (after todo item styles, around line 250):
```css
/* Due date styles */
.todo-due-date {
  color: #6c757d;
  font-size: 1.4rem;
  margin: 0.4rem 0 0.8rem 0;
  padding-left: 40px; /* Align with task name (checkbox offset) */
}

@media screen and (min-width: 620px) {
  .todo-due-date {
    font-size: 1.6rem;
  }
}
```

2. **Add form group styles for date inputs** (near form styles, around line 80):
```css
.form-group {
  margin-top: 1.2rem;
  margin-bottom: 1.2rem;
}

.label__md {
  font-size: 1.6rem;
  font-weight: 400;
  display: block;
  margin-bottom: 0.4rem;
}

.input__md {
  border: 2px solid #000;
  padding: 1rem;
  font-size: 1.6rem;
  width: 100%;
}

.input__md:focus-visible {
  border-color: #4d4d4d;
  box-shadow: inset 0 0 0 2px;
}

@media screen and (min-width: 620px) {
  .label__md {
    font-size: 1.8rem;
  }
  
  .input__md {
    font-size: 1.8rem;
  }
}
```

3. **Optional: Overdue indicator** (red/orange for past dates):
```css
.todo-due-date--overdue {
  color: #dc3545;
  font-weight: 500;
}
```

**Files affected**: [src/index.css](../src/index.css)

**Note**: To implement overdue indicator, add logic in Todo.jsx:
```jsx
{props.dueDate && (
  <p className={`todo-due-date ${isOverdue(props.dueDate) ? 'todo-due-date--overdue' : ''}`}>
    Due: {formatDate(props.dueDate)}
  </p>
)}

// Helper function
function isOverdue(isoString) {
  const dueDate = new Date(isoString + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return dueDate < today;
}
```

---

### Step 10: Test All Flows
**Action**: Manually test add, edit, view, and delete flows with due dates.

**Test scenarios**:
1. **Add task with due date**: Enter name + date → Submit → Verify displays.
2. **Add task without due date**: Enter name only → Submit → No date shown.
3. **Edit task and add due date**: Edit existing task → Add date → Save → Verify displays.
4. **Edit task and change due date**: Edit task with date → Change date → Save → Verify updates.
5. **Edit task and clear due date**: Edit task with date → Clear date field → Save → Verify removed.
6. **Delete task with due date**: Verify no errors.
7. **Filter tasks**: Verify due dates display correctly in all filter views.

**Commands**:
```bash
yarn dev
# Open http://localhost:5173 and test manually
```

---

### Step 11: Lint and Build
**Action**: Validate all changes and ensure successful build.

**Commands**:
```bash
yarn lint
yarn build
yarn preview
```

**Expected**: No errors, all features working.

---

## Playwright Testing Plan

### Test File: `tests/duedate.spec.js`

#### Test 1: Add Task with Due Date
**Goal**: Verify user can add a task with a due date.

```javascript
import { test, expect } from '@playwright/test';

test.describe('PRD-003: Due Date Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4173');
  });

  test('Can add task with due date', async ({ page }) => {
    // Fill in task name
    await page.fill('#new-todo-input', 'Buy groceries');
    
    // Fill in due date
    await page.fill('#due-date-input', '2026-02-15');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Verify task appears with due date
    const taskName = page.getByText('Buy groceries');
    await expect(taskName).toBeVisible();
    
    const dueDate = page.locator('.todo-due-date').filter({ hasText: 'Feb 15, 2026' });
    await expect(dueDate).toBeVisible();
  });

  test('Can add task without due date', async ({ page }) => {
    await page.fill('#new-todo-input', 'Read documentation');
    // Leave due date empty
    await page.click('button[type="submit"]');
    
    // Verify task appears
    const taskName = page.getByText('Read documentation');
    await expect(taskName).toBeVisible();
    
    // Verify no due date is shown
    const allDueDates = page.locator('.todo-due-date');
    const count = await allDueDates.count();
    
    // Check that "Read documentation" task doesn't have a due date sibling
    const taskParent = page.locator('.todo').filter({ hasText: 'Read documentation' });
    const dueDateInTask = taskParent.locator('.todo-due-date');
    await expect(dueDateInTask).not.toBeVisible();
  });
});
```

---

#### Test 2: Edit Task Due Date
**Goal**: Verify user can edit due dates on existing tasks.

```javascript
test('Can add due date to existing task via edit', async ({ page }) => {
  // Add task without due date
  await page.fill('#new-todo-input', 'Exercise');
  await page.click('button[type="submit"]');
  
  // Enter edit mode
  const editButton = page.getByRole('button', { name: /edit exercise/i });
  await editButton.click();
  
  // Add due date in edit form
  await page.fill('input[type="date"]', '2026-02-20');
  
  // Save
  const saveButton = page.getByRole('button', { name: /save/i });
  await saveButton.click();
  
  // Verify due date appears
  await page.waitForTimeout(100);
  const dueDate = page.locator('.todo-due-date').filter({ hasText: 'Feb 20, 2026' });
  await expect(dueDate).toBeVisible();
});

test('Can change due date via edit', async ({ page }) => {
  // Add task with due date
  await page.fill('#new-todo-input', 'Submit report');
  await page.fill('#due-date-input', '2026-02-10');
  await page.click('button[type="submit"]');
  
  // Enter edit mode
  const editButton = page.getByRole('button', { name: /edit submit report/i });
  await editButton.click();
  
  // Change due date
  const dateInput = page.locator('input[type="date"]').last();
  await dateInput.fill('2026-02-25');
  
  // Save
  const saveButton = page.getByRole('button', { name: /save/i });
  await saveButton.click();
  
  // Verify new due date appears
  await page.waitForTimeout(100);
  const dueDate = page.locator('.todo-due-date').filter({ hasText: 'Feb 25, 2026' });
  await expect(dueDate).toBeVisible();
  
  // Verify old date is gone
  const oldDate = page.locator('.todo-due-date').filter({ hasText: 'Feb 10, 2026' });
  await expect(oldDate).not.toBeVisible();
});

test('Can clear due date via edit', async ({ page }) => {
  // Add task with due date
  await page.fill('#new-todo-input', 'Call client');
  await page.fill('#due-date-input', '2026-02-12');
  await page.click('button[type="submit"]');
  
  // Verify date appears
  let dueDate = page.locator('.todo-due-date').filter({ hasText: 'Feb 12, 2026' });
  await expect(dueDate).toBeVisible();
  
  // Enter edit mode
  const editButton = page.getByRole('button', { name: /edit call client/i });
  await editButton.click();
  
  // Clear due date
  const dateInput = page.locator('input[type="date"]').last();
  await dateInput.fill('');
  
  // Save
  const saveButton = page.getByRole('button', { name: /save/i });
  await saveButton.click();
  
  // Verify date is removed
  await page.waitForTimeout(100);
  const taskParent = page.locator('.todo').filter({ hasText: 'Call client' });
  const dueDateInTask = taskParent.locator('.todo-due-date');
  await expect(dueDateInTask).not.toBeVisible();
});

test('Edit form pre-fills existing due date', async ({ page }) => {
  // Add task with due date
  await page.fill('#new-todo-input', 'Review code');
  await page.fill('#due-date-input', '2026-02-18');
  await page.click('button[type="submit"]');
  
  // Enter edit mode
  const editButton = page.getByRole('button', { name: /edit review code/i });
  await editButton.click();
  
  // Verify date input is pre-filled
  const dateInput = page.locator('input[type="date"]').last();
  const value = await dateInput.inputValue();
  expect(value).toBe('2026-02-18');
});
```

---

#### Test 3: Due Date Display
**Goal**: Verify due dates are displayed correctly in view mode.

```javascript
test('Due date displays in human-readable format', async ({ page }) => {
  await page.fill('#new-todo-input', 'Test formatting');
  await page.fill('#due-date-input', '2026-03-05');
  await page.click('button[type="submit"]');
  
  // Verify formatted date (not ISO format)
  const dueDate = page.locator('.todo-due-date');
  const text = await dueDate.textContent();
  
  expect(text).toContain('Mar 5, 2026');
  expect(text).not.toContain('2026-03-05'); // Should NOT show ISO format
});

test('Due date is prefixed with "Due:"', async ({ page }) => {
  await page.fill('#new-todo-input', 'Check prefix');
  await page.fill('#due-date-input', '2026-02-28');
  await page.click('button[type="submit"]');
  
  const dueDate = page.locator('.todo-due-date');
  const text = await dueDate.textContent();
  
  expect(text).toMatch(/^Due:/);
});

test('Tasks without due date show no extra text', async ({ page }) => {
  await page.fill('#new-todo-input', 'No date task');
  await page.click('button[type="submit"]');
  
  const task = page.locator('.todo').filter({ hasText: 'No date task' });
  const dueDateElement = task.locator('.todo-due-date');
  
  await expect(dueDateElement).not.toBeVisible();
  
  // Verify no placeholder text like "No due date"
  const taskText = await task.textContent();
  expect(taskText).not.toContain('due');
  expect(taskText).not.toContain('Due');
});
```

---

#### Test 4: Due Date with Filters
**Goal**: Verify due dates work correctly with task filtering.

```javascript
test('Due dates visible in "All" filter', async ({ page }) => {
  await page.fill('#new-todo-input', 'Filtered task');
  await page.fill('#due-date-input', '2026-02-22');
  await page.click('button[type="submit"]');
  
  // "All" filter is active by default
  const dueDate = page.locator('.todo-due-date').filter({ hasText: 'Feb 22, 2026' });
  await expect(dueDate).toBeVisible();
});

test('Due dates visible in "Active" filter', async ({ page }) => {
  await page.fill('#new-todo-input', 'Active task with date');
  await page.fill('#due-date-input', '2026-02-24');
  await page.click('button[type="submit"]');
  
  // Switch to Active filter
  const activeButton = page.getByRole('button', { name: /show active tasks/i });
  await activeButton.click();
  
  // Verify due date still visible
  const dueDate = page.locator('.todo-due-date').filter({ hasText: 'Feb 24, 2026' });
  await expect(dueDate).toBeVisible();
});

test('Due dates visible in "Completed" filter', async ({ page }) => {
  await page.fill('#new-todo-input', 'Completed task with date');
  await page.fill('#due-date-input', '2026-02-26');
  await page.click('button[type="submit"]');
  
  // Complete the task
  const checkbox = page.locator('input[type="checkbox"]').last();
  await checkbox.check();
  
  // Switch to Completed filter
  const completedButton = page.getByRole('button', { name: /show completed tasks/i });
  await completedButton.click();
  
  // Verify due date still visible
  const dueDate = page.locator('.todo-due-date').filter({ hasText: 'Feb 26, 2026' });
  await expect(dueDate).toBeVisible();
});
```

---

#### Test 5: Due Date Persistence
**Goal**: Verify due dates persist through task operations.

```javascript
test('Due date persists after task completion', async ({ page }) => {
  await page.fill('#new-todo-input', 'Task to complete');
  await page.fill('#due-date-input', '2026-02-27');
  await page.click('button[type="submit"]');
  
  // Complete task
  const checkbox = page.locator('input[type="checkbox"]').last();
  await checkbox.check();
  
  // Verify due date still visible
  const dueDate = page.locator('.todo-due-date').filter({ hasText: 'Feb 27, 2026' });
  await expect(dueDate).toBeVisible();
  
  // Uncomplete task
  await checkbox.uncheck();
  
  // Verify due date still visible
  await expect(dueDate).toBeVisible();
});

test('Due date is removed when task is deleted', async ({ page }) => {
  await page.fill('#new-todo-input', 'Task to delete');
  await page.fill('#due-date-input', '2026-02-28');
  await page.click('button[type="submit"]');
  
  // Verify due date exists
  let dueDate = page.locator('.todo-due-date').filter({ hasText: 'Feb 28, 2026' });
  await expect(dueDate).toBeVisible();
  
  // Delete task
  const deleteButton = page.getByRole('button', { name: /delete task to delete/i });
  await deleteButton.click();
  
  // Verify due date is gone
  await expect(dueDate).not.toBeVisible();
});
```

---

#### Test 6: Form Behavior
**Goal**: Verify form inputs behave correctly.

```javascript
test('Due date input is optional (can submit empty)', async ({ page }) => {
  await page.fill('#new-todo-input', 'Task without date');
  // Leave date input empty
  
  // Should be able to submit
  await page.click('button[type="submit"]');
  
  // Verify task appears
  const taskName = page.getByText('Task without date');
  await expect(taskName).toBeVisible();
});

test('Form clears due date input after submission', async ({ page }) => {
  await page.fill('#new-todo-input', 'Clear test');
  await page.fill('#due-date-input', '2026-03-01');
  await page.click('button[type="submit"]');
  
  // Verify date input is cleared
  const dateInput = page.locator('#due-date-input');
  const value = await dateInput.inputValue();
  expect(value).toBe('');
});

test('Cancel button in edit mode does not save date changes', async ({ page }) => {
  // Add task with due date
  await page.fill('#new-todo-input', 'Cancel test');
  await page.fill('#due-date-input', '2026-03-10');
  await page.click('button[type="submit"]');
  
  // Enter edit mode
  const editButton = page.getByRole('button', { name: /edit cancel test/i });
  await editButton.click();
  
  // Change due date
  const dateInput = page.locator('input[type="date"]').last();
  await dateInput.fill('2026-03-20');
  
  // Cancel without saving
  const cancelButton = page.getByRole('button', { name: /cancel/i });
  await cancelButton.click();
  
  // Verify original date still shows
  const dueDate = page.locator('.todo-due-date').filter({ hasText: 'Mar 10, 2026' });
  await expect(dueDate).toBeVisible();
  
  // Verify new date doesn't show
  const newDate = page.locator('.todo-due-date').filter({ hasText: 'Mar 20, 2026' });
  await expect(newDate).not.toBeVisible();
});
```

---

#### Test 7: Accessibility
**Goal**: Verify due date inputs are accessible.

```javascript
test('Due date input has associated label', async ({ page }) => {
  const label = page.locator('label[for="due-date-input"]');
  await expect(label).toBeVisible();
  await expect(label).toHaveText(/due date/i);
});

test('Due date input in edit mode has associated label', async ({ page }) => {
  // Add task and enter edit mode
  await page.fill('#new-todo-input', 'Accessibility test');
  await page.click('button[type="submit"]');
  
  const editButton = page.getByRole('button', { name: /edit accessibility test/i });
  await editButton.click();
  
  // Check for label in edit form
  const dateInput = page.locator('input[type="date"]').last();
  const inputId = await dateInput.getAttribute('id');
  
  const label = page.locator(`label[for="${inputId}"]`);
  await expect(label).toBeVisible();
});

test('Due date text has sufficient contrast', async ({ page }) => {
  await page.fill('#new-todo-input', 'Contrast test');
  await page.fill('#due-date-input', '2026-03-15');
  await page.click('button[type="submit"]');
  
  const dueDateElement = page.locator('.todo-due-date');
  
  const color = await dueDateElement.evaluate((el) => 
    window.getComputedStyle(el).color
  );
  
  // #6c757d = rgb(108, 117, 125)
  expect(color).toBe('rgb(108, 117, 125)');
  
  // This color has sufficient contrast against white background (>4.5:1)
});
```

---

### Test Execution

**Setup**:
```bash
# Install Playwright
yarn add -D @playwright/test
npx playwright install

# Build and start preview server
yarn build
yarn preview &
```

**Run tests**:
```bash
npx playwright test tests/duedate.spec.js
npx playwright test tests/duedate.spec.js --headed
npx playwright test tests/duedate.spec.js --ui
npx playwright test tests/duedate.spec.js --debug
```

**Expected results**: All tests pass (✓).

---

## Acceptance Criteria Checklist

- [ ] Users can add optional due date when creating task
- [ ] Due date displays in human-readable format (e.g., "Feb 8, 2026")
- [ ] Due date prefixed with "Due:" label
- [ ] Tasks without due date show no extra text/placeholder
- [ ] Users can add due date to existing task via edit
- [ ] Users can change due date via edit
- [ ] Users can clear due date via edit
- [ ] Edit form pre-fills existing due date
- [ ] Cancel button in edit mode discards date changes
- [ ] Due dates visible in all filter views (All/Active/Completed)
- [ ] Due dates persist after task completion/incompletion
- [ ] Form clears date input after submission
- [ ] Date input has associated label (accessibility)
- [ ] Due date text has sufficient contrast (WCAG AA)
- [ ] Native `<input type="date">` used (zero dependencies)
- [ ] Data stored in ISO format (`YYYY-MM-DD`)
- [ ] `yarn lint` passes with no errors
- [ ] `yarn build` succeeds
- [ ] All Playwright tests pass

---

## Optional Enhancements (Phase 2)

- **Overdue indicator**: Show red/orange text for dates in the past.
- **Date validation**: Prevent dates before current date or very far future.
- **Sort by due date**: Add filter option to sort tasks by due date.
- **Date picker UI**: Use date picker library for better UX (e.g., react-datepicker).
- **Relative dates**: Show "Today", "Tomorrow", "In 3 days" for near dates.

---

## Rollback Plan

If issues arise, revert all changes:

```bash
# Revert all modified files
git checkout HEAD -- src/main.jsx
git checkout HEAD -- src/App.jsx
git checkout HEAD -- src/components/Form.jsx
git checkout HEAD -- src/components/Todo.jsx
git checkout HEAD -- src/index.css
```

Or use `git revert <commit-hash>` for specific commits.

---

**End of Task Document**
