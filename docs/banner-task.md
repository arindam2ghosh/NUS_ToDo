# Task: PRD-002 — Add Top Banner Component

**Feature ID**: PRD-002  
**Priority**: Medium  
**Estimated Effort**: 2-3 hours  
**Dependencies**: None

---

## Objective

Add a visually distinct top banner to the TodoMatic app that displays the app title, subtitle, and dynamic task count. The banner should be responsive and enhance the demo-friendly UI.

---

## Step-by-Step Implementation Plan

### Step 1: Create Banner Component File
**Action**: Create new presentational component for the banner.

**File**: [src/components/Banner.jsx](../src/components/Banner.jsx)

**Initial structure**:
```jsx
function Banner(props) {
  return (
    <div className="app-banner">
      <div className="app-banner__content">
        <div className="app-banner__left">
          <h1 className="app-banner__title">TodoMatic</h1>
          <p className="app-banner__subtitle">React + Vite demo</p>
        </div>
        <div className="app-banner__right">
          <p className="app-banner__info">
            {props.activeCount} {props.activeCount === 1 ? 'active task' : 'active tasks'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Banner;
```

**Rationale**: 
- Pure presentational component (no state).
- Props-driven for testability.
- Semantic HTML (`<h1>` for title, `<p>` for subtitle/info).

---

### Step 2: Compute Active Task Count in App
**Action**: Calculate `activeCount` in [src/App.jsx](../src/App.jsx) and pass to Banner.

**Changes**:
```jsx
// Add import at top
import Banner from "./components/Banner";

// Inside App component, after filter logic:
const activeTaskCount = tasks.filter((task) => !task.completed).length;

// In return statement, add Banner before existing <h1>:
return (
  <div className="todoapp stack-large">
    <Banner activeCount={activeTaskCount} currentFilter={filter} />
    <h1>TodoMatic</h1>
    {/* rest of existing JSX */}
  </div>
);
```

**Files affected**: [src/App.jsx](../src/App.jsx)

**Line locations**:
- Import: After line 4 (after other imports)
- activeTaskCount: Around line 26 (after `filter` state, before `toggleTaskCompleted`)
- Banner render: Line ~106 (right after opening `<div className="todoapp">`)

---

### Step 3: Update Main Title Styling
**Action**: Adjust existing `<h1>TodoMatic</h1>` to avoid duplication.

**Decision**: Keep existing `<h1>` as secondary heading, or remove it?

**Recommended approach**: 
- Remove standalone `<h1>TodoMatic</h1>` (line ~107 in App.jsx) since title is now in banner.
- Keep `<h2 id="list-heading">` as main heading for task list.

**Changes**:
```jsx
return (
  <div className="todoapp stack-large">
    <Banner activeCount={activeTaskCount} currentFilter={filter} />
    {/* Remove: <h1>TodoMatic</h1> */}
    <Form addTask={addTask} />
    {/* rest remains unchanged */}
  </div>
);
```

**Files affected**: [src/App.jsx](../src/App.jsx) line ~107

---

### Step 4: Add Banner Styles
**Action**: Create CSS for banner layout and appearance.

**File**: [src/index.css](../src/index.css)

**Add after "General app styles" section** (around line 150):

```css
/* Banner styles */
.app-banner {
  background-color: #fafafa;
  border-bottom: 1px solid #e0e0e0;
  margin: -1rem -1rem 2rem -1rem; /* Negative margins to extend to edges */
  padding: 1.5rem 1rem;
}

@media screen and (min-width: 550px) {
  .app-banner {
    margin: -4rem -4rem 2rem -4rem; /* Match todoapp padding on larger screens */
    padding: 2rem 4rem;
  }
}

.app-banner__content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 50rem;
  margin: 0 auto;
}

@media screen and (min-width: 620px) {
  .app-banner__content {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.app-banner__left {
  flex: 1;
}

.app-banner__title {
  font-size: 2.4rem;
  font-weight: 600;
  margin: 0;
  color: #212529;
  line-height: 1.2;
}

@media screen and (min-width: 620px) {
  .app-banner__title {
    font-size: 3rem;
  }
}

.app-banner__subtitle {
  font-size: 1.4rem;
  color: #6c757d;
  margin: 0.4rem 0 0 0;
  font-weight: 300;
}

@media screen and (max-width: 549px) {
  .app-banner__subtitle {
    font-size: 1.2rem;
  }
}

.app-banner__right {
  display: flex;
  align-items: center;
}

.app-banner__info {
  font-size: 1.6rem;
  color: #495057;
  margin: 0;
  font-weight: 500;
  white-space: nowrap;
}

@media screen and (min-width: 620px) {
  .app-banner__info {
    font-size: 1.8rem;
  }
}
```

**Rationale**:
- Negative margins extend banner to container edges.
- Flexbox provides responsive layout (stack on mobile, row on desktop).
- Color palette consistent with existing app (grays).
- Typography hierarchy: title > info > subtitle.

---

### Step 5: Handle Edge Case — Zero Tasks
**Action**: Verify banner displays correctly when no tasks exist.

**Test scenario**: Fresh app with empty task list.

**Expected behavior**: Banner shows "0 active tasks".

**Verification**: Add conditional check in Banner component (already handled by pluralization logic).

---

### Step 6: Optional Enhancement — Show Current Filter
**Action**: Display current filter name in banner info.

**Changes to Banner.jsx**:
```jsx
function Banner(props) {
  const filterText = props.currentFilter !== 'All' 
    ? ` · ${props.currentFilter} filter` 
    : '';
  
  return (
    <div className="app-banner">
      <div className="app-banner__content">
        <div className="app-banner__left">
          <h1 className="app-banner__title">TodoMatic</h1>
          <p className="app-banner__subtitle">React + Vite demo</p>
        </div>
        <div className="app-banner__right">
          <p className="app-banner__info">
            {props.activeCount} {props.activeCount === 1 ? 'active task' : 'active tasks'}
            {filterText}
          </p>
        </div>
      </div>
    </div>
  );
}
```

**Files affected**: [src/components/Banner.jsx](../src/components/Banner.jsx)

**Decision**: This is optional; keep it simple for Phase 1 (remove `filterText` if not needed).

---

### Step 7: Update Tests (if test framework exists)
**Action**: If unit tests exist, add snapshot test for Banner.

**File**: `src/components/Banner.test.jsx` (create if testing)

**Example test** (React Testing Library):
```jsx
import { render, screen } from '@testing-library/react';
import Banner from './Banner';

test('renders title and subtitle', () => {
  render(<Banner activeCount={3} currentFilter="All" />);
  expect(screen.getByText('TodoMatic')).toBeInTheDocument();
  expect(screen.getByText('React + Vite demo')).toBeInTheDocument();
});

test('displays active task count', () => {
  render(<Banner activeCount={5} currentFilter="All" />);
  expect(screen.getByText('5 active tasks')).toBeInTheDocument();
});

test('handles singular task count', () => {
  render(<Banner activeCount={1} currentFilter="All" />);
  expect(screen.getByText('1 active task')).toBeInTheDocument();
});
```

**Note**: Only add if project has testing configured; otherwise skip.

---

### Step 8: Accessibility Review
**Action**: Ensure banner meets accessibility standards.

**Checks**:
1. **Heading hierarchy**: Banner `<h1>` is top-level; list heading is `<h2>` (correct hierarchy).
2. **Color contrast**: 
   - Title (#212529 on #fafafa) must meet 4.5:1 ratio.
   - Subtitle (#6c757d on #fafafa) must meet 4.5:1 ratio.
   - Info text (#495057 on #fafafa) must meet 4.5:1 ratio.
3. **Semantic HTML**: Use `<header>` tag instead of `<div>` for banner?

**Recommended change**: Update Banner to use `<header>` for semantics:
```jsx
return (
  <header className="app-banner">
    {/* content remains same */}
  </header>
);
```

---

### Step 9: Responsive Testing
**Action**: Test banner on multiple viewport sizes.

**Test viewports**:
- Mobile (375px width): Banner stacks vertically.
- Tablet (768px width): Banner displays in row.
- Desktop (1024px+ width): Banner displays in row with max-width.

**Commands**:
```bash
yarn dev
# Open http://localhost:5173 in browser
# Use DevTools responsive mode to test viewports
```

**Verification**:
- No horizontal scrolling on mobile.
- Text is readable at all sizes.
- Subtitle hides or wraps gracefully on small screens.

---

### Step 10: Lint and Build
**Action**: Validate changes and ensure successful build.

**Commands**:
```bash
yarn lint
yarn build
yarn preview
```

**Expected**: No errors, banner visible at top of app.

---

## Playwright Testing Plan

### Test File: `tests/banner.spec.js`

#### Test 1: Banner Visibility
**Goal**: Verify banner is visible on page load.

```javascript
import { test, expect } from '@playwright/test';

test.describe('PRD-002: Top Banner', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4173');
  });

  test('Banner is visible on page load', async ({ page }) => {
    const banner = page.locator('.app-banner');
    await expect(banner).toBeVisible();
  });

  test('Banner displays app title', async ({ page }) => {
    const title = page.locator('.app-banner__title');
    await expect(title).toHaveText('TodoMatic');
  });

  test('Banner displays subtitle', async ({ page }) => {
    const subtitle = page.locator('.app-banner__subtitle');
    await expect(subtitle).toHaveText('React + Vite demo');
  });
});
```

---

#### Test 2: Active Task Count Display
**Goal**: Verify banner shows correct active task count.

```javascript
test('Banner shows correct active task count initially', async ({ page }) => {
  // Assuming default tasks in main.jsx
  const info = page.locator('.app-banner__info');
  const infoText = await info.textContent();
  
  // Should show count of non-completed tasks
  expect(infoText).toMatch(/\d+ active task(s)?/);
});

test('Banner updates when task is added', async ({ page }) => {
  // Get initial count
  const info = page.locator('.app-banner__info');
  const initialText = await info.textContent();
  const initialCount = parseInt(initialText.match(/(\d+)/)[1]);
  
  // Add a new task
  await page.fill('#new-todo-input', 'New task for banner test');
  await page.click('button[type="submit"]');
  
  // Wait for update
  await page.waitForTimeout(100);
  
  // Verify count increased
  const newText = await info.textContent();
  const newCount = parseInt(newText.match(/(\d+)/)[1]);
  expect(newCount).toBe(initialCount + 1);
});

test('Banner updates when task is completed', async ({ page }) => {
  // Add a task
  await page.fill('#new-todo-input', 'Task to complete');
  await page.click('button[type="submit"]');
  
  // Get current count
  const info = page.locator('.app-banner__info');
  const beforeText = await info.textContent();
  const beforeCount = parseInt(beforeText.match(/(\d+)/)[1]);
  
  // Complete the task
  const checkbox = page.locator('input[type="checkbox"]').last();
  await checkbox.check();
  
  // Wait for update
  await page.waitForTimeout(100);
  
  // Verify count decreased
  const afterText = await info.textContent();
  const afterCount = parseInt(afterText.match(/(\d+)/)[1]);
  expect(afterCount).toBe(beforeCount - 1);
});

test('Banner updates when task is deleted', async ({ page }) => {
  // Add a task
  await page.fill('#new-todo-input', 'Task to delete');
  await page.click('button[type="submit"]');
  
  // Get current count
  const info = page.locator('.app-banner__info');
  const beforeText = await info.textContent();
  const beforeCount = parseInt(beforeText.match(/(\d+)/)[1]);
  
  // Delete the task
  const deleteButton = page.getByRole('button', { name: /delete task to delete/i });
  await deleteButton.click();
  
  // Wait for update
  await page.waitForTimeout(100);
  
  // Verify count decreased
  const afterText = await info.textContent();
  const afterCount = parseInt(afterText.match(/(\d+)/)[1]);
  expect(afterCount).toBe(beforeCount - 1);
});
```

---

#### Test 3: Singular vs Plural Text
**Goal**: Verify correct grammar for task count.

```javascript
test('Banner shows singular "task" when count is 1', async ({ page }) => {
  // Clear all tasks first (assuming this is possible via UI or direct manipulation)
  // For simplicity, we'll add exactly 1 task
  
  // Reload to reset state
  await page.reload();
  
  // If there are existing tasks, this test may need adjustment
  // Add one task
  await page.fill('#new-todo-input', 'Only task');
  await page.click('button[type="submit"]');
  
  // Check the task
  const checkboxes = page.locator('input[type="checkbox"]');
  const count = await checkboxes.count();
  
  // Complete all but one
  for (let i = 0; i < count - 1; i++) {
    await checkboxes.nth(i).check();
  }
  
  await page.waitForTimeout(100);
  
  const info = page.locator('.app-banner__info');
  const infoText = await info.textContent();
  
  expect(infoText).toMatch(/1 active task(?!s)/); // "1 active task" not "tasks"
});

test('Banner shows plural "tasks" when count is not 1', async ({ page }) => {
  // Add multiple tasks
  await page.fill('#new-todo-input', 'First task');
  await page.click('button[type="submit"]');
  
  await page.fill('#new-todo-input', 'Second task');
  await page.click('button[type="submit"]');
  
  await page.waitForTimeout(100);
  
  const info = page.locator('.app-banner__info');
  const infoText = await info.textContent();
  
  expect(infoText).toMatch(/\d+ active tasks/); // "X active tasks" with 's'
});

test('Banner shows "0 active tasks" when all completed', async ({ page }) => {
  // Complete all tasks
  const checkboxes = page.locator('input[type="checkbox"]');
  const count = await checkboxes.count();
  
  for (let i = 0; i < count; i++) {
    await checkboxes.nth(i).check();
  }
  
  await page.waitForTimeout(100);
  
  const info = page.locator('.app-banner__info');
  const infoText = await info.textContent();
  
  expect(infoText).toBe('0 active tasks');
});
```

---

#### Test 4: Responsive Layout
**Goal**: Verify banner adapts to different screen sizes.

```javascript
test('Banner stacks vertically on mobile', async ({ page }) => {
  // Set viewport to mobile size
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('http://localhost:4173');
  
  const content = page.locator('.app-banner__content');
  
  // Check flex-direction is column
  const flexDirection = await content.evaluate((el) => 
    window.getComputedStyle(el).flexDirection
  );
  expect(flexDirection).toBe('column');
});

test('Banner displays horizontally on desktop', async ({ page }) => {
  // Set viewport to desktop size
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto('http://localhost:4173');
  
  const content = page.locator('.app-banner__content');
  
  // Check flex-direction is row
  const flexDirection = await content.evaluate((el) => 
    window.getComputedStyle(el).flexDirection
  );
  expect(flexDirection).toBe('row');
});

test('Banner subtitle is visible on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto('http://localhost:4173');
  
  const subtitle = page.locator('.app-banner__subtitle');
  await expect(subtitle).toBeVisible();
  
  // Font size should be larger
  const fontSize = await subtitle.evaluate((el) => 
    window.getComputedStyle(el).fontSize
  );
  expect(parseFloat(fontSize)).toBeGreaterThanOrEqual(14);
});
```

---

#### Test 5: Visual Styling
**Goal**: Verify banner has correct styling (background, border, etc.).

```javascript
test('Banner has light background color', async ({ page }) => {
  const banner = page.locator('.app-banner');
  
  const bgColor = await banner.evaluate((el) => 
    window.getComputedStyle(el).backgroundColor
  );
  
  // #fafafa = rgb(250, 250, 250)
  expect(bgColor).toBe('rgb(250, 250, 250)');
});

test('Banner has bottom border', async ({ page }) => {
  const banner = page.locator('.app-banner');
  
  const borderBottom = await banner.evaluate((el) => 
    window.getComputedStyle(el).borderBottom
  );
  
  expect(borderBottom).toContain('1px');
  expect(borderBottom).toContain('solid');
});

test('Banner title is bold', async ({ page }) => {
  const title = page.locator('.app-banner__title');
  
  const fontWeight = await title.evaluate((el) => 
    window.getComputedStyle(el).fontWeight
  );
  
  // 600 = semi-bold
  expect(parseInt(fontWeight)).toBeGreaterThanOrEqual(600);
});

test('Banner subtitle has muted color', async ({ page }) => {
  const subtitle = page.locator('.app-banner__subtitle');
  
  const color = await subtitle.evaluate((el) => 
    window.getComputedStyle(el).color
  );
  
  // #6c757d = rgb(108, 117, 125)
  expect(color).toBe('rgb(108, 117, 125)');
});
```

---

#### Test 6: Accessibility
**Goal**: Verify banner is accessible to screen readers and keyboard users.

```javascript
test('Banner uses semantic header element', async ({ page }) => {
  const header = page.locator('header.app-banner');
  await expect(header).toBeVisible();
});

test('Banner title is an h1 heading', async ({ page }) => {
  const title = page.locator('.app-banner__title');
  
  const tagName = await title.evaluate((el) => el.tagName.toLowerCase());
  expect(tagName).toBe('h1');
});

test('Banner has proper heading hierarchy', async ({ page }) => {
  // h1 should be banner title
  const h1 = page.locator('h1');
  await expect(h1).toHaveText('TodoMatic');
  
  // h2 should be task list heading
  const h2 = page.locator('h2#list-heading');
  await expect(h2).toBeVisible();
  
  // No h3 before h2
  const h3 = page.locator('h3').first();
  const h2Exists = await h2.count() > 0;
  const h3Exists = await h3.count() > 0;
  
  if (h3Exists) {
    // Verify h2 comes before h3 in DOM order
    const h2Index = await page.evaluate(() => {
      const h2 = document.querySelector('h2#list-heading');
      return Array.from(document.querySelectorAll('*')).indexOf(h2);
    });
    
    const h3Index = await page.evaluate(() => {
      const h3 = document.querySelector('h3');
      return Array.from(document.querySelectorAll('*')).indexOf(h3);
    });
    
    expect(h2Index).toBeLessThan(h3Index);
  }
});

test('Banner text has sufficient contrast', async ({ page }) => {
  const title = page.locator('.app-banner__title');
  
  const color = await title.evaluate((el) => 
    window.getComputedStyle(el).color
  );
  const bgColor = await title.evaluate((el) => 
    window.getComputedStyle(el.closest('.app-banner')).backgroundColor
  );
  
  // Simple contrast check (detailed calculation in button tests)
  // #212529 on #fafafa has high contrast
  expect(color).toBe('rgb(33, 37, 41)');
  expect(bgColor).toBe('rgb(250, 250, 250)');
  
  // These colors have >10:1 contrast ratio (well above 4.5:1 requirement)
});
```

---

### Test Execution

**Setup**:
```bash
# Install Playwright (if not already)
yarn add -D @playwright/test
npx playwright install

# Build and start preview server
yarn build
yarn preview &
```

**Run tests**:
```bash
npx playwright test tests/banner.spec.js
npx playwright test tests/banner.spec.js --headed
npx playwright test tests/banner.spec.js --ui
```

**Expected results**: All tests pass (✓).

---

## Acceptance Criteria Checklist

- [ ] Banner component is visible at top of app
- [ ] Banner displays "TodoMatic" title
- [ ] Banner displays "React + Vite demo" subtitle
- [ ] Banner shows active task count (e.g., "3 active tasks")
- [ ] Count uses singular "task" when count is 1
- [ ] Count updates dynamically when tasks are added/completed/deleted
- [ ] Banner stacks vertically on mobile (< 550px)
- [ ] Banner displays horizontally on desktop (≥ 620px)
- [ ] Banner has light background (#fafafa) and bottom border
- [ ] Title, subtitle, and info text have sufficient contrast (WCAG AA)
- [ ] Banner uses semantic `<header>` element
- [ ] Heading hierarchy is correct (h1 → h2)
- [ ] `yarn lint` passes with no errors
- [ ] `yarn build` succeeds
- [ ] All Playwright tests pass

---

## Rollback Plan

If issues arise, remove Banner component and restore original heading:

```bash
# Remove Banner component
rm src/components/Banner.jsx

# Revert App.jsx changes
git checkout HEAD -- src/App.jsx

# Revert CSS changes (remove banner styles)
git checkout HEAD -- src/index.css
```

Or manually restore the standalone `<h1>TodoMatic</h1>` in App.jsx.

---

**End of Task Document**
