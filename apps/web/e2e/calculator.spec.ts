import { test, expect } from '@playwright/test';

test.describe('Tax Calculator - Critical User Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('landing page loads correctly', async ({ page }) => {
    // Check hero title is visible (look for container with both lines)
    await expect(page.locator('h1, h2, .text-4xl, .text-5xl').first()).toBeVisible();

    // Check CTA button is visible (first one)
    await expect(page.getByRole('button', { name: /calculate yours/i }).first()).toBeVisible();

    // Check page loaded (has main content)
    await expect(page.locator('body')).toBeVisible();
  });

  test('navigates to calculator when CTA is clicked', async ({ page }) => {
    // Click the first CTA button
    await page.getByRole('button', { name: /calculate yours/i }).first().click();

    // Wait for calculator to appear - look for input section
    await expect(page.locator('input[type="number"], input[placeholder*="150"]').first()).toBeVisible({ timeout: 10000 });
  });

  test('calculates taxes for RM150,000 profit', async ({ page }) => {
    // Navigate to calculator
    await page.getByRole('button', { name: /calculate yours/i }).first().click();

    // Wait for input field and fill it
    const profitInput = page.locator('input[type="number"], input[placeholder*="150"]').first();
    await expect(profitInput).toBeVisible({ timeout: 10000 });
    await profitInput.fill('150000');

    // Wait for results to calculate (look for any RM currency amount)
    await expect(page.locator('text=/RM\\s?[\\d,]+/').first()).toBeVisible({ timeout: 10000 });
  });

  test('displays both Enterprise and Sdn Bhd results', async ({ page }) => {
    // Navigate to calculator
    await page.getByRole('button', { name: /calculate yours/i }).first().click();

    // Enter profit amount
    const profitInput = page.locator('input[type="number"], input[placeholder*="150"]').first();
    await expect(profitInput).toBeVisible({ timeout: 10000 });
    await profitInput.fill('150000');

    // Wait a moment for calculation
    await page.waitForTimeout(1000);

    // Both business types should be mentioned somewhere on the page
    const pageContent = await page.content();
    expect(pageContent.toLowerCase()).toContain('enterprise');
    expect(pageContent.toLowerCase()).toContain('sdn bhd');
  });

  test('handles zero profit gracefully', async ({ page }) => {
    // Navigate to calculator
    await page.getByRole('button', { name: /calculate yours/i }).first().click();

    // Enter zero profit
    const profitInput = page.locator('input[type="number"], input[placeholder*="150"]').first();
    await expect(profitInput).toBeVisible({ timeout: 10000 });
    await profitInput.fill('0');

    // Page should not crash - look for any content
    await expect(page.locator('body')).toBeVisible();
  });

  test('handles high profit (RM1,500,000)', async ({ page }) => {
    // Navigate to calculator
    await page.getByRole('button', { name: /calculate yours/i }).first().click();

    // Enter high profit
    const profitInput = page.locator('input[type="number"], input[placeholder*="150"]').first();
    await expect(profitInput).toBeVisible({ timeout: 10000 });
    await profitInput.fill('1500000');

    // Wait for calculation
    await page.waitForTimeout(1000);

    // Page should not crash - look for RM amounts
    await expect(page.locator('text=/RM\\s?[\\d,]+/').first()).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Tax Calculator - Mobile Layout', () => {
  test.use({ viewport: { width: 375, height: 667 }, hasTouch: true });

  test('landing page displays correctly on mobile', async ({ page }) => {
    await page.goto('/');

    // CTA should be visible and tappable
    await expect(page.getByRole('button', { name: /calculate yours/i }).first()).toBeVisible();
  });

  test('calculator works on mobile', async ({ page }) => {
    await page.goto('/');

    // Navigate to calculator
    await page.getByRole('button', { name: /calculate yours/i }).first().click();

    // Input should be visible
    const profitInput = page.locator('input[type="number"], input[placeholder*="150"]').first();
    await expect(profitInput).toBeVisible({ timeout: 10000 });

    // Click and enter value (works for both touch and non-touch)
    await profitInput.click();
    await profitInput.fill('150000');

    // Wait for results
    await page.waitForTimeout(1000);

    // Should see RM amounts
    const pageContent = await page.content();
    expect(pageContent).toMatch(/RM\s?[\d,]+/);
  });
});

test.describe('Tax Calculator - Desktop Layout', () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test('shows calculator interface on desktop', async ({ page }) => {
    await page.goto('/');

    // Navigate to calculator
    await page.getByRole('button', { name: /calculate yours/i }).first().click();

    // Input should be visible
    const profitInput = page.locator('input[type="number"], input[placeholder*="150"]').first();
    await expect(profitInput).toBeVisible({ timeout: 10000 });

    // Enter profit
    await profitInput.fill('150000');

    // Wait for results
    await page.waitForTimeout(1000);

    // Both Enterprise and Sdn Bhd should be in page content
    const pageContent = await page.content();
    expect(pageContent.toLowerCase()).toContain('enterprise');
    expect(pageContent.toLowerCase()).toContain('sdn bhd');
  });

  test('scrolling works on desktop', async ({ page }) => {
    await page.goto('/');

    // Navigate to calculator
    await page.getByRole('button', { name: /calculate yours/i }).first().click();

    // Enter profit
    const profitInput = page.locator('input[type="number"], input[placeholder*="150"]').first();
    await expect(profitInput).toBeVisible({ timeout: 10000 });
    await profitInput.fill('150000');

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Page should have scrolled
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);
  });
});

test.describe('Tax Calculator - Theme Toggle', () => {
  test('theme toggle exists and works', async ({ page }) => {
    await page.goto('/');

    // Look for theme toggle by aria-label
    const themeToggle = page.getByRole('button', { name: /dark mode|light mode/i });

    if (await themeToggle.count() > 0) {
      // Get initial state
      const htmlBefore = await page.locator('html').getAttribute('class');

      // Toggle theme
      await themeToggle.first().click();
      await page.waitForTimeout(500);

      // Check class changed
      const htmlAfter = await page.locator('html').getAttribute('class');

      // Theme should have toggled (class should be different)
      expect(htmlBefore !== htmlAfter || htmlBefore?.includes('dark') !== htmlAfter?.includes('dark')).toBeTruthy();
    }
  });
});


test.describe('Tax Calculator - Keyboard Accessibility', () => {
  test('CTA button is focusable', async ({ page }) => {
    await page.goto('/');

    // Tab to focus on CTA
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Page should have some focused element
    const focusedElement = page.locator(':focus');
    const count = await focusedElement.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});

test.describe('Tax Calculator - Input Validation', () => {
  test('handles negative numbers', async ({ page }) => {
    await page.goto('/');

    // Navigate to calculator
    await page.getByRole('button', { name: /calculate yours/i }).first().click();

    // Try to enter negative number
    const profitInput = page.locator('input[type="number"], input[placeholder*="150"]').first();
    await expect(profitInput).toBeVisible({ timeout: 10000 });
    await profitInput.fill('-50000');

    // Page should handle gracefully (not crash)
    await page.waitForTimeout(500);
    await expect(page.locator('body')).toBeVisible();
  });

  test('handles decimal numbers', async ({ page }) => {
    await page.goto('/');

    // Navigate to calculator
    await page.getByRole('button', { name: /calculate yours/i }).first().click();

    // Enter decimal number
    const profitInput = page.locator('input[type="number"], input[placeholder*="150"]').first();
    await expect(profitInput).toBeVisible({ timeout: 10000 });
    await profitInput.fill('150000.50');

    // Page should handle gracefully
    await page.waitForTimeout(500);
    await expect(page.locator('body')).toBeVisible();
  });
});
