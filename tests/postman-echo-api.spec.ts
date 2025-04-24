import { test, expect, request } from '@playwright/test';
import { execSync } from 'child_process';

test.describe('Postman Echo API Tests', () => {
  let apiContext;

  test.beforeAll(async ({ playwright }) => {
    apiContext = await request.newContext({
      baseURL: 'https://postman-echo.com',
      extraHTTPHeaders: {
        'Accept': 'application/json',
      },
    });
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  // Basic HTTP Methods Tests
  test.describe('Basic HTTP Methods', () => {
    test('GET request with query params', async () => {
      const response = await apiContext.get('/get?foo=bar');
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.args.foo).toBe('bar');
    });

    test('POST request with JSON body', async () => {
      const response = await apiContext.post('/post', {
        data: { name: 'Playwright', type: 'Test' }
      });
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.data.name).toBe('Playwright');
      expect(body.data.type).toBe('Test');
    });

    test('PUT request with body', async () => {
      const response = await apiContext.put('/put', {
        data: { update: 'true' }
      });
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.data.update).toBe('true');
    });

    test('PATCH request with body', async () => {
      const response = await apiContext.patch('/patch', {
        data: { patched: 'yes' }
      });
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.data.patched).toBe('yes');
    });

    test('DELETE request method check', async () => {
      const response = await apiContext.delete('/delete');
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body).toHaveProperty('url', 'https://postman-echo.com/delete');
    });
  });

  // Headers Tests
  test.describe('Headers', () => {
    test('should include sent headers in response', async () => {
      const response = await apiContext.post('/post', {
        data: { msg: 'hello' },
        headers: {
          'X-Custom-Header': 'test-value',
          'Content-Type': 'application/json'
        }
      });

      const body = await response.json();
      expect(body.headers).toHaveProperty('x-custom-header', 'test-value');
      expect(body.headers).toHaveProperty('content-type');
      expect(body.headers['content-type']).toContain('application/json');
    });

    test('Headers validation', async () => {
      const response = await apiContext.get('/headers');
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.headers).toHaveProperty('host');
      expect(body.headers).toHaveProperty('accept', 'application/json');
    });

    test('Response headers can be set via query params', async () => {
      const response = await apiContext.get('/response-headers?Content-Type=application/xml&Cache-Control=no-cache');
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('application/xml');
      expect(response.headers()['cache-control']).toBe('no-cache');
    });
  });

  // Request Body Tests
  test.describe('Request Body', () => {
    test('should handle nested objects in the body', async () => {
      const payload = {
        user: {
          id: 123,
          profile: {
            name: 'John',
            email: 'john@example.com'
          }
        }
      };

      const response = await apiContext.post('/post', {
        data: payload
      });

      const body = await response.json();
      expect(body.data).toEqual(payload);
      expect(body.data.user.profile.email).toBe('john@example.com');
    });

    test('should return body as raw text for non-JSON content', async () => {
      const rawText = 'plain text message';

      const response = await apiContext.post('/post', {
        headers: {
          'Content-Type': 'text/plain'
        },
        data: rawText
      });

      const body = await response.json();
      expect(body.data).toBe(rawText);
    });

    test('should handle URL-encoded form data', async () => {
      const formData = new URLSearchParams();
      formData.append('field1', 'value1');
      formData.append('field2', 'value2');

      const response = await apiContext.post('/post', {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: formData.toString()
      });

      const body = await response.json();
      expect(body.form).toHaveProperty('field1', 'value1');
      expect(body.form).toHaveProperty('field2', 'value2');
    });

    test('should handle arrays in JSON body', async () => {
      const payload = {
        items: [
          { id: 1, name: 'Item 1' },
          { id: 2, name: 'Item 2' },
          { id: 3, name: 'Item 3' }
        ]
      };

      const response = await apiContext.post('/post', {
        data: payload
      });

      const body = await response.json();
      expect(body.data.items).toHaveLength(3);
      expect(body.data.items[0].name).toBe('Item 1');
      expect(body.data.items[1].name).toBe('Item 2');
      expect(body.data.items[2].name).toBe('Item 3');
    });
  });

  // Authentication Tests
  test.describe('Authentication', () => {
    test('Basic Auth - successful authentication', async () => {
      // Create a new context with authentication
      const authContext = await request.newContext({
        baseURL: 'https://postman-echo.com',
        httpCredentials: {
          username: 'postman',
          password: 'password'
        }
      });

      const response = await authContext.get('/basic-auth');
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.authenticated).toBe(true);

      await authContext.dispose();
    });

    test('Basic Auth - failed authentication', async () => {
      // Create a new context with wrong credentials
      const authContext = await request.newContext({
        baseURL: 'https://postman-echo.com',
        httpCredentials: {
          username: 'wronguser',
          password: 'invalidpass'
        }
      });

      const response = await authContext.get('/basic-auth');
      expect(response.status()).toBe(401);

      await authContext.dispose();
    });

    // test('Digest Auth - successful authentication', async () => {
      // Create a new context with authentication
      // const authContext = await request.newContext({
      //   baseURL: 'https://postman-echo.com',
      //   httpCredentials: {
      //     username: 'postman',
      //     password: 'password'
      //   }
      // });

      // const response = await authContext.get('/digest-auth');
      // httpCredentials is only applicable for Basic authentication
      // Digest authentication is not supported in Playwright's request context
      // curl --digest -u postman:password https://postman-echo.com/digest-auth
      // expect(response.status()).toBe(200);
      // const body = await response.json();
      // expect(body.authenticated).toBe(true);

  //     await authContext.dispose();
  //   });

    test('Digest Auth - using Curl in Playwright', async () => {
      const curlCommand = 'curl --silent --digest -u postman:password https://postman-echo.com/digest-auth';
      const result = execSync(curlCommand).toString();

      // You can parse it if it's JSON
      const json = JSON.parse(result);
      expect(json).toHaveProperty('authenticated');
      expect(json.authenticated).toBe(true);
    });
  });

  // Status Codes Tests
  test.describe('Status Codes', () => {
    test('should return 200 OK status', async () => {
      const response = await apiContext.get('/status/200');
      expect(response.status()).toBe(200);
    });

    test('should return 201 Created status', async () => {
      const response = await apiContext.get('/status/201');
      expect(response.status()).toBe(201);
    });

    test('should return 400 Bad Request status', async () => {
      const response = await apiContext.get('/status/400');
      expect(response.status()).toBe(400);
    });

    test('should return 401 Unauthorized status', async () => {
      const response = await apiContext.get('/status/401');
      expect(response.status()).toBe(401);
    });

    test('should return 403 Forbidden status', async () => {
      const response = await apiContext.get('/status/403');
      expect(response.status()).toBe(403);
    });

    test('should return 404 Not Found status', async () => {
      const response = await apiContext.get('/status/404');
      expect(response.status()).toBe(404);
    });

    test('should return 500 Internal Server Error status', async () => {
      const response = await apiContext.get('/status/500');
      expect(response.status()).toBe(500);
    });

    test('should return 502 Bad Gateway status', async () => {
      const response = await apiContext.get('/status/502');
      expect(response.status()).toBe(502);
    });

    test('should return 503 Service Unavailable status', async () => {
      const response = await apiContext.get('/status/503');
      expect(response.status()).toBe(503);
    });
  });

  // Cookies Tests
  test.describe('Cookies', () => {
    test('should set cookies and return them', async () => {
      const response = await apiContext.get('/cookies/set?cookie1=value1&cookie2=value2');
      expect(response.status()).toBe(200);
      
      // The response should contain the cookies
      const body = await response.json();
      expect(body.cookies).toHaveProperty('cookie1', 'value1');
      expect(body.cookies).toHaveProperty('cookie2', 'value2');
    });

    test('should get all cookies', async () => {
      // First set some cookies
      await apiContext.get('/cookies/set?test1=value1&test2=value2');
      
      // Then get all cookies
      const response = await apiContext.get('/cookies');
      expect(response.status()).toBe(200);
      
      const body = await response.json();
      expect(body.cookies).toHaveProperty('test1', 'value1');
      expect(body.cookies).toHaveProperty('test2', 'value2');
    });

    test('should delete cookies', async () => {
      // First set some cookies
      await apiContext.get('/cookies/set?toDelete=deleteMe&toKeep=keepMe');
      
      // Then delete one cookie
      const response = await apiContext.get('/cookies/delete?toDelete');
      expect(response.status()).toBe(200);
      
      // Verify the cookie was deleted
      const body = await response.json();
      expect(body.cookies).not.toHaveProperty('toDelete');
      expect(body.cookies).toHaveProperty('toKeep', 'keepMe');
    });
  });

  // Redirects Tests
  test.describe('Redirects', () => {
    test('should follow redirect to specified URL', async () => {
      const response = await apiContext.get('/redirect-to?url=https://postman-echo.com/get?redirected=true');
      expect(response.status()).toBe(200);
      
      const body = await response.json();
      expect(body.args).toHaveProperty('redirected', 'true');
    });

    test('should follow redirect with specified status code', async () => {
      const response = await apiContext.get('/redirect-to?url=https://postman-echo.com/get?redirected=true&status=302');
      expect(response.status()).toBe(200);
      
      const body = await response.json();
      expect(body.args).toHaveProperty('redirected', 'true');
    });

    test('should verify redirect response details', async () => {
      // We'll use a custom fetch to examine the redirect response
      // since Playwright automatically follows redirects
      const response = await fetch('https://postman-echo.com/redirect-to?url=https://postman-echo.com/get&status=301', {
        redirect: 'manual' 
        });
      
      // Verify it's a redirect status
      expect(response.status).toBe(302);
      
      const locationUrl = response.headers.get('location');
      expect(locationUrl).toBe('https://postman-echo.com/get');
      
      // Verify we can still get the content by following redirects manually
      // Only proceed if we have a valid location URL
      if (locationUrl) {
        const finalResponse = await fetch(locationUrl);
        expect(finalResponse.status).toBe(200);
        const data = await finalResponse.json();
        expect(data).toHaveProperty('url');
      } else {
        // If we don't have a location header, the test should fail
        expect(locationUrl).not.toBeNull();
      }
    });
  });

  // Delay Tests
  test.describe('Delays', () => {
    test('should handle delayed response', async () => {
      const startTime = Date.now();
      const response = await apiContext.get('/delay/1');
      const endTime = Date.now();
      
      expect(response.status()).toBe(200);
      expect(endTime - startTime).toBeGreaterThanOrEqual(1000);
      
      const body = await response.json();
      expect(body).toHaveProperty('delay', '1');
    });

    test('should timeout on long delayed response', async () => {
      // Create a new context with a short timeout
      const timeoutContext = await request.newContext({
        baseURL: 'https://postman-echo.com',
        timeout: 1000 // 1 second timeout
      });

      try {
        await timeoutContext.get('/delay/3'); // 3 second delay
        // If we get here, the test should fail
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toContain('Request timed out after 1000ms');
      } finally {
        await timeoutContext.dispose();
      }
    });
  });

  // Compression Tests
  test.describe('Compression', () => {
    test('should handle gzip compressed response', async () => {
      const response = await apiContext.get('/gzip');
      expect(response.status()).toBe(200);
      
      const body = await response.json();
      expect(body).toHaveProperty('gzipped', true);
    });

    test('should handle deflate compressed response', async () => {
      const response = await apiContext.get('/deflate');
      expect(response.status()).toBe(200);
      
      const body = await response.json();
      expect(body).toHaveProperty('deflated', true);
    });
  });

  // Streaming Tests
  test.describe('Streaming', () => {
    test('should handle streamed response', async () => {
      const response = await apiContext.get('/stream/3');
      expect(response.status()).toBe(200);

      // console.log('Response headers', response.headers());
      expect(response.headers()['transfer-encoding']).toBe('chunked');
    });
  });

  // IP Tests
  test.describe('IP', () => {
    test('should return client IP address', async () => {
      const response = await apiContext.get('/ip');
      expect(response.status()).toBe(200);
      
      const body = await response.json();
      expect(body).toHaveProperty('ip');
      // IP address should match IPv4 or IPv6 format
      expect(body.ip).toMatch(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$|^[0-9a-fA-F:]+$/);
    });
  });

  // Error Handling Tests
  test.describe('Error Handling', () => {
    test('should handle 404 error for non-existent endpoint', async () => {
      const response = await apiContext.get('/non-existent-endpoint');
      expect(response.status()).toBe(404);
    });

    test('should handle invalid JSON in request body', async () => {
      // Send an invalid JSON string
      const response = await apiContext.post('/post', {
        headers: {
          'Content-Type': 'application/json'
        },
        data: '{invalid json'
      });
      
      expect(response.status()).toBe(200); // Postman Echo doesn't validate JSON
      const body = await response.json();
      expect(body.data).toContain('{invalid json');
    });

    test('should handle empty request body', async () => {
      const response = await apiContext.post('/post');
      expect(response.status()).toBe(200);
      
      const body = await response.json();
      expect(body.data).toEqual({});
    });
  });

  // Response Format Tests
  test.describe('Response Formats', () => {
    test('should handle JSON response format', async () => {
      const response = await apiContext.get('/get?format=json');
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('application/json');
      
      // Should parse as JSON without error
      const body = await response.json();
      expect(body).toHaveProperty('args');
    });

    test('should handle XML response format', async () => {
      const response = await apiContext.get('/response-headers?Content-Type=application/xml');
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('application/xml');
      
      // Get response as text
      const text = await response.text();
      expect(text).toContain('application/xml');
    });

    test('should handle HTML response format', async () => {
      const response = await apiContext.get('/response-headers?Content-Type=text/html');
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('text/html');
      
      // Get response as text
      const text = await response.text();
      expect(text).toContain('text/html');
    });
  });
});