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
});
