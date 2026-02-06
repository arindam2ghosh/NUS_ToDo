# Task: PRD-001 — Improve Button Styling

**Feature ID**: PRD-001  
**Priority**: Medium  
**Estimated Effort**: 1-2 hours  
**Dependencies**: None

---

## Objective

Update button styling across the TodoMatic app to create a visually distinct, demo-friendly UI with clear visual hierarchy for primary, destructive, and secondary actions.

---

## Step-by-Step Implementation Plan

### Step 1: Analyze Current Button Classes
**Action**: Audit existing button usage in codebase.

**Files to inspect**:
- [src/components/Form.jsx](../src/components/Form.jsx) — "Add" button
- [src/components/Todo.jsx](../src/components/Todo.jsx) — "Edit", "Delete", "Save", "Cancel" buttons
- [src/components/FilterButton.jsx](../src/components/FilterButton.jsx) — Filter buttons
- [src/index.css](../src/index.css) — Current button styles

**Current button classes**:
- `.btn` — Base button style
- `.btn__primary` — "Add" and "Save" buttons (black background)
- `.btn__danger` — "Delete" button (red background)
- `.toggle-btn` — Filter buttons
- Generic `.btn` — "Edit" and "Cancel" buttons

**Verification**: Run `grep -r "className.*btn" src/components` to confirm all usages.

---

### Step 2: Define Color Palette
**Action**: Establish color scheme for button states.

**Proposed colors**:
```css
/* Primary actions (Add, Save) */
--primary-bg: #0d6efd;           /* Blue */
--primary-bg-hover: #0b5ed7;     /* Darker blue */
--primary-text: #ffffff;

/* Destructive actions (Delete) */
--danger-bg: #dc3545;            /* Red (existing #ca3c3c) */
--danger-bg-hover: #bb2d3b;      /* Darker red */
--danger-text: #ffffff;

/* Secondary actions (Edit, Cancel) */
--secondary-border: #6c757d;     /* Gray */
--secondary-bg: transparent;
--secondary-bg-hover: #f8f9fa;   /* Light gray */
--secondary-text: #212529;

/* Filter buttons */
--filter-border: #d3d3d3;        /* Light gray (existing) */
--filter-border-active: #4d4d4d; /* Dark gray (existing) */
--filter-bg-hover: #f0f0f0;      /* Very light gray */
```

**Contrast verification**: All color combinations must meet WCAG AA (4.5:1 for normal text, 3:1 for large text).

---

### Step 3: Update Primary Button Styles
**Action**: Modify `.btn__primary` class in [src/index.css](../src/index.css).

**Changes**:
```css
.btn__primary {
  background-color: #0d6efd;  /* Change from #000 to blue */
  border-color: #0d6efd;
  color: #fff;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.btn__primary:hover {
  background-color: #0b5ed7;
  border-color: #0a58ca;
}

.btn__primary:active {
  background-color: #0a58ca;
  border-color: #0a53be;
}
```

**Files affected**: [src/index.css](../src/index.css) lines ~103-107

**Testing**: Verify "Add" button (Form) and "Save" button (Todo edit mode) use new colors.

---

### Step 4: Update Destructive Button Styles
**Action**: Enhance `.btn__danger` with hover state.

**Changes**:
```css
.btn__danger {
  background-color: #dc3545;  /* Update from #ca3c3c */
  border-color: #dc3545;
  color: #fff;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.btn__danger:hover {
  background-color: #bb2d3b;
  border-color: #b02a37;
}

.btn__danger:active {
  background-color: #b02a37;
  border-color: #a52834;
}
```

**Files affected**: [src/index.css](../src/index.css) lines ~96-100

**Testing**: Verify "Delete" button darkens on hover.

---

### Step 5: Add Secondary Button Style
**Action**: Create new `.btn__secondary` class for "Edit" and "Cancel" buttons.

**Changes**:
```css
.btn__secondary {
  background-color: transparent;
  border: 0.2rem solid #6c757d;
  color: #212529;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.btn__secondary:hover {
  background-color: #f8f9fa;
  border-color: #565e64;
}

.btn__secondary:active {
  background-color: #e9ecef;
  border-color: #4d5358;
}
```

**Files affected**: 
- [src/index.css](../src/index.css) — Add new class after `.btn__primary`
- [src/components/Todo.jsx](../src/components/Todo.jsx) — Update "Edit" and "Cancel" button classes

**Code changes in Todo.jsx**:
- Line ~53: Change `className="btn todo-cancel"` to `className="btn btn__secondary todo-cancel"`
- Line ~81: Change `className="btn"` to `className="btn btn__secondary"`

---

### Step 6: Update Filter Button Hover State
**Action**: Add hover styles to `.toggle-btn`.

**Changes**:
```css
.btn.toggle-btn {
  border-color: #d3d3d3;
  border-width: 1px;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.btn.toggle-btn:hover {
  background-color: #f0f0f0;
}

.btn.toggle-btn[aria-pressed="true"] {
  background-color: #e9ecef;  /* Add background to active state */
  border-color: #4d4d4d;
  font-weight: 600;
  text-decoration: underline;
}
```

**Files affected**: [src/index.css](../src/index.css) lines ~88-95

**Testing**: Hover over filter buttons and verify background change; selected filter has light gray background.

---

### Step 7: Add Base Button Hover (Fallback)
**Action**: Ensure all buttons have hover state even without explicit class.

**Changes**:
```css
.btn {
  border: 0.2rem solid #4d4d4d;
  cursor: pointer;
  padding: 0.8rem 1rem 0.7rem;
  text-transform: capitalize;
  transition: opacity 0.2s ease;
}

.btn:hover {
  opacity: 0.9;
}
```

**Files affected**: [src/index.css](../src/index.css) lines ~82-87

**Rationale**: Provides fallback hover effect for any buttons without specific hover styles.

---

### Step 8: Verify Focus States
**Action**: Ensure `:focus-visible` styles remain intact after color changes.

**Verification**:
- Tab through all buttons.
- Confirm 3px dashed blue outline appears on focus.
- Verify outline is visible against new button backgrounds.

**No changes needed** (existing `*:focus-visible` rule at line ~7 handles all elements).

---

### Step 9: Lint and Build
**Action**: Validate CSS syntax and ensure no regressions.

**Commands**:
```bash
yarn lint
yarn build
```

**Expected**: No errors, successful build.

---

### Step 10: Manual Visual Inspection
**Action**: Launch preview server and test all button states.

**Commands**:
```bash
yarn preview
```

**Test cases**:
1. Hover over "Add" button → Blue darkens
2. Hover over "Delete" button → Red darkens
3. Hover over "Edit" button → Light gray background appears
4. Hover over "Cancel" button → Light gray background appears
5. Hover over filter buttons → Light gray background appears
6. Click filter button → Selected state has darker background and underline
7. Tab through all buttons → Focus outline visible on all

---

## Playwright Testing Plan

### Test File: `tests/buttons.spec.js`

#### Test 1: Primary Button Styling
**Goal**: Verify "Add" button has correct primary styling.

```javascript
import { test, expect } from '@playwright/test';

test.describe('PRD-001: Button Styling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4173');
  });

  test('Add button has primary styling', async ({ page }) => {
    const addButton = page.getByRole('button', { name: /add/i });
    
    // Check background color (blue)
    const bgColor = await addButton.evaluate((el) => 
      window.getComputedStyle(el).backgroundColor
    );
    expect(bgColor).toBe('rgb(13, 110, 253)'); // #0d6efd
    
    // Check text color (white)
    const textColor = await addButton.evaluate((el) => 
      window.getComputedStyle(el).color
    );
    expect(textColor).toBe('rgb(255, 255, 255)');
  });

  test('Add button hover state changes color', async ({ page }) => {
    const addButton = page.getByRole('button', { name: /add/i });
    
    // Hover and check color change
    await addButton.hover();
    await page.waitForTimeout(300); // Wait for transition
    
    const hoverBgColor = await addButton.evaluate((el) => 
      window.getComputedStyle(el).backgroundColor
    );
    expect(hoverBgColor).toBe('rgb(11, 94, 215)'); // #0b5ed7
  });
});
```

---

#### Test 2: Destructive Button Styling
**Goal**: Verify "Delete" button has correct danger styling.

```javascript
test('Delete button has danger styling', async ({ page }) => {
  // Add a task first
  await page.fill('#new-todo-input', 'Test task');
  await page.click('button[type="submit"]');
  
  const deleteButton = page.getByRole('button', { name: /delete test task/i });
  
  // Check background color (red)
  const bgColor = await deleteButton.evaluate((el) => 
    window.getComputedStyle(el).backgroundColor
  );
  expect(bgColor).toBe('rgb(220, 53, 69)'); // #dc3545
});

test('Delete button hover state changes color', async ({ page }) => {
  // Add a task first
  await page.fill('#new-todo-input', 'Test task');
  await page.click('button[type="submit"]');
  
  const deleteButton = page.getByRole('button', { name: /delete test task/i });
  
  await deleteButton.hover();
  await page.waitForTimeout(300);
  
  const hoverBgColor = await deleteButton.evaluate((el) => 
    window.getComputedStyle(el).backgroundColor
  );
  expect(hoverBgColor).toBe('rgb(187, 45, 59)'); // #bb2d3b
});
```

---

#### Test 3: Secondary Button Styling
**Goal**: Verify "Edit" and "Cancel" buttons have correct secondary styling.

```javascript
test('Edit button has secondary styling', async ({ page }) => {
  // Add a task first
  await page.fill('#new-todo-input', 'Test task');
  await page.click('button[type="submit"]');
  
  const editButton = page.getByRole('button', { name: /edit test task/i });
  
  // Check transparent background
  const bgColor = await editButton.evaluate((el) => 
    window.getComputedStyle(el).backgroundColor
  );
  expect(bgColor).toMatch(/rgba\(0, 0, 0, 0\)|transparent/);
  
  // Check gray border
  const borderColor = await editButton.evaluate((el) => 
    window.getComputedStyle(el).borderColor
  );
  expect(borderColor).toBe('rgb(108, 117, 125)'); // #6c757d
});

test('Edit button hover shows background', async ({ page }) => {
  await page.fill('#new-todo-input', 'Test task');
  await page.click('button[type="submit"]');
  
  const editButton = page.getByRole('button', { name: /edit test task/i });
  
  await editButton.hover();
  await page.waitForTimeout(300);
  
  const hoverBgColor = await editButton.evaluate((el) => 
    window.getComputedStyle(el).backgroundColor
  );
  expect(hoverBgColor).toBe('rgb(248, 249, 250)'); // #f8f9fa
});

test('Cancel button has secondary styling', async ({ page }) => {
  await page.fill('#new-todo-input', 'Test task');
  await page.click('button[type="submit"]');
  
  // Enter edit mode
  const editButton = page.getByRole('button', { name: /edit test task/i });
  await editButton.click();
  
  const cancelButton = page.getByRole('button', { name: /cancel renaming test task/i });
  
  // Check class includes btn__secondary
  const className = await cancelButton.getAttribute('class');
  expect(className).toContain('btn__secondary');
});
```

---

#### Test 4: Filter Button States
**Goal**: Verify filter buttons have correct default and active styling.

```javascript
test('Filter buttons have hover state', async ({ page }) => {
  const allButton = page.getByRole('button', { name: /show all tasks/i });
  
  await allButton.hover();
  await page.waitForTimeout(300);
  
  const hoverBgColor = await allButton.evaluate((el) => 
    window.getComputedStyle(el).backgroundColor
  );
  expect(hoverBgColor).toBe('rgb(240, 240, 240)'); // #f0f0f0
});

test('Active filter button has distinct styling', async ({ page }) => {
  const allButton = page.getByRole('button', { name: /show all tasks/i });
  
  // "All" should be active by default
  const ariaPressed = await allButton.getAttribute('aria-pressed');
  expect(ariaPressed).toBe('true');
  
  // Check active background
  const bgColor = await allButton.evaluate((el) => 
    window.getComputedStyle(el).backgroundColor
  );
  expect(bgColor).toBe('rgb(233, 236, 239)'); // #e9ecef
  
  // Check underline
  const textDecoration = await allButton.evaluate((el) => 
    window.getComputedStyle(el).textDecoration
  );
  expect(textDecoration).toContain('underline');
});

test('Filter button active state changes on click', async ({ page }) => {
  const activeButton = page.getByRole('button', { name: /show active tasks/i });
  
  // Click "Active" filter
  await activeButton.click();
  
  // Verify "Active" is now pressed
  const ariaPressed = await activeButton.getAttribute('aria-pressed');
  expect(ariaPressed).toBe('true');
  
  // Verify "All" is no longer pressed
  const allButton = page.getByRole('button', { name: /show all tasks/i });
  const allPressed = await allButton.getAttribute('aria-pressed');
  expect(allPressed).toBe('false');
});
```

---

#### Test 5: Focus Visibility
**Goal**: Verify all buttons have visible focus outlines.

```javascript
test('All buttons have visible focus outline', async ({ page }) => {
  const addButton = page.getByRole('button', { name: /add/i });
  
  // Focus button via keyboard
  await page.keyboard.press('Tab');
  
  // Check focus outline
  const outline = await addButton.evaluate((el) => {
    const focused = document.activeElement;
    if (focused === el) {
      return window.getComputedStyle(focused).outline;
    }
    return null;
  });
  
  expect(outline).toContain('dashed');
  expect(outline).toContain('3px');
});

test('Keyboard navigation through all buttons works', async ({ page }) => {
  // Tab through all interactive elements
  await page.keyboard.press('Tab'); // Focus input
  await page.keyboard.press('Tab'); // Focus "Add" button
  await page.keyboard.press('Tab'); // Focus first filter button
  await page.keyboard.press('Tab'); // Focus second filter button
  await page.keyboard.press('Tab'); // Focus third filter button
  
  // Verify focus is on "Completed" filter
  const focusedElement = await page.evaluate(() => 
    document.activeElement?.textContent
  );
  expect(focusedElement).toContain('Completed');
});
```

---

#### Test 6: Accessibility - Color Contrast
**Goal**: Verify button text meets WCAG AA contrast requirements.

```javascript
test('Primary button text has sufficient contrast', async ({ page }) => {
  const addButton = page.getByRole('button', { name: /add/i });
  
  const bgColor = await addButton.evaluate((el) => 
    window.getComputedStyle(el).backgroundColor
  );
  const textColor = await addButton.evaluate((el) => 
    window.getComputedStyle(el).color
  );
  
  // Helper function to calculate contrast ratio
  function getContrastRatio(rgb1, rgb2) {
    const getLuminance = (rgb) => {
      const match = rgb.match(/\d+/g);
      const [r, g, b] = match.map(Number);
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };
    
    const l1 = getLuminance(rgb1);
    const l2 = getLuminance(rgb2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }
  
  const contrastRatio = getContrastRatio(bgColor, textColor);
  
  // WCAG AA requires 4.5:1 for normal text, 3:1 for large text (18pt+)
  expect(contrastRatio).toBeGreaterThanOrEqual(3.0); // Large text
});
```

---

### Test Execution

**Setup**:
```bash
# Install Playwright (if not already installed)
yarn add -D @playwright/test

# Install browsers
npx playwright install

# Create test directory
mkdir -p tests
```

**Run tests**:
```bash
# Start preview server in background
yarn preview &

# Run Playwright tests
npx playwright test tests/buttons.spec.js

# Run tests with UI
npx playwright test tests/buttons.spec.js --ui

# Run tests in headed mode (see browser)
npx playwright test tests/buttons.spec.js --headed
```

**Expected results**: All tests pass (✓).

---

## Acceptance Criteria Checklist

- [ ] "Add" and "Save" buttons use consistent blue primary style
- [ ] "Delete" button uses red danger style with darker hover state
- [ ] "Edit" and "Cancel" buttons use gray secondary style with light hover background
- [ ] Filter buttons have light gray hover state
- [ ] Active filter button has gray background and underline
- [ ] All buttons have visible focus outline (3px dashed)
- [ ] All button text meets WCAG AA contrast ratio (≥3:1 for large text)
- [ ] Hover transitions are smooth (0.2s ease)
- [ ] `yarn lint` passes with no errors
- [ ] `yarn build` succeeds
- [ ] All Playwright tests pass

---

## Rollback Plan

If issues arise, revert [src/index.css](../src/index.css) and [src/components/Todo.jsx](../src/components/Todo.jsx) changes:

```bash
git checkout HEAD -- src/index.css src/components/Todo.jsx
```

---

**End of Task Document**
