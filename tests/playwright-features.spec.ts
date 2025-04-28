import { test, expect } from '@playwright/test';

test.describe('Playwright v1.52.0 New Features', () => {
  test('New expect().toContainClass() method', async ({ page }) => {
    // Setup a page with elements having multiple classes
    await page.setContent(`
      <div class="todo-item important done high-priority">Task 1</div>
      <div class="todo-item pending low-priority">Task 2</div>
    `);

    // Using toContainClass to check individual classes
    const firstItem = page.locator('.todo-item').first();
    await expect(firstItem).toContainClass('done'); // Checks just for 'done' class
    await expect(firstItem).toContainClass('important'); // Checks just for 'important' class
    
    // Compare with toHaveClass which needs all classes to match
    await expect(firstItem).toHaveClass('todo-item important done high-priority');
    
    // Check second item
    const secondItem = page.locator('.todo-item').nth(1);
    await expect(secondItem).toContainClass('pending');
    await expect(secondItem).not.toContainClass('done');
  });
  test('Breaking Changes: Glob URL patterns', async ({ page }) => {
    // NOTE: In v1.52.0, glob URL patterns in route() don't support ? and [] anymore
    // Old way (no longer works):
    // await page.route('**/api/items?id=[0-9]+', route => route.fulfill({ body: '[]' }));
    
    // First navigate to a real URL to establish a base
    await page.goto('https://playwright.dev');
    
    // Set up the route before content is loaded - use a simpler pattern
    await page.route(/.*playwright\.dev\/api\/items\?id=\d+/, route => {
      console.log('Route handler triggered for:', route.request().url());
      return route.fulfill({ 
        status: 200,
        body: JSON.stringify([{ id: 1, name: 'Item 1' }]),
        contentType: 'application/json'
      });
    });
    
    // Test the route with a mock API request
    await page.setContent(`
      <base href="https://playwright.dev/">
      <div id="result">Loading...</div>
      <script>
        // Increase timeout to ensure browser is ready
        setTimeout(() => {
          console.log('Making fetch request to https://playwright.dev/api/items?id=123');
          fetch('https://playwright.dev/api/items?id=123')
            .then(r => r.json())
            .then(data => {
              console.log('Received data:', data);
              document.getElementById('result').textContent = JSON.stringify(data);
            })
            .catch(err => {
              console.error('Fetch error:', err);
              document.getElementById('result').textContent = 'Error: ' + err.message;
            });
        }, 500);
      </script>
    `);
    
    // Check that our routing worked, with a longer timeout
    await expect(page.locator('#result')).toContainText('Item 1', { timeout: 10000 });
  });

  test('Breaking Change: route.continue() and Cookie header', async ({ page, context }) => {
    // In v1.52.0, route.continue() no longer allows overriding Cookie header
    // The cookies must be set via browserContext.addCookies() instead
    
    // Set cookies properly via context
    await context.addCookies([
      { name: 'sessionId', value: '123456', url: 'https://playwright.dev' }
    ]);
    
    // Route to demonstrate the changes
    await page.route('**/api/user', async route => {
      // This would no longer work in v1.52.0:
      // await route.continue({ headers: { 'Cookie': 'sessionId=abcdef' } });
      
      // Instead, just continue the route (cookies from browser context will be used)
      await route.continue();
    });
    
    // The test itself
    await page.goto('https://playwright.dev');
  });
}); 