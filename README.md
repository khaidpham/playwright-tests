# 🎭 Playwright Tests

Welcome to the `playwright-tests` repository!  
This project contains a robust suite of automated end-to-end and API tests using [Microsoft Playwright](https://playwright.dev/). It leverages a modular structure with reusable Page Object Models (POMs) and clean test organization to ensure reliability, speed, and maintainability.

---

## 📦 Features

- ✅ Cross-browser testing (Chromium, Firefox, WebKit)
- 🔐 Authentication setup with reusable sessions
- 🔄 Page Object Model structure for reusability and clarity
- 📸 Visual regression testing with custom pixel diff thresholds
- 🔗 API testing using Playwright's `APIRequestContext`
- 🚦 CI/CD-friendly configuration (GitHub Actions ready)

---

## 🚀 Getting Started

### 1. Clone the repo
```
git clone https://github.com/khaidpham/playwright-tests.git
cd playwright-tests
```

### 2. Install dependencies
```
npm install
```

### 3. Run tests using npm scripts

- `npm run test` -- run tests on all projects - "npx playwright test"
- `npm run test:chromium` -- run tests on chromium - "npx playwright test --project=chromium"
- `npm run test:first` -- run tests with @first tag - "npx playwright test --grep @first"
- `npm run test:local` -- run tests against local dev - "BASE_URL=http://localhost:4200 npx playwright test"
- `npm run test:report` -- run tests then open report - "npx playwright test && npx playwright show-report",
- `npm run test:ui` -- run test in ui mode - "npx playwright test --ui"

### 4. Run test using npx
- `npx playwright test --ui` -- open the Playwrite Test UI
- `npx playwright test --update-snapshots` -- save new visual snapshots 
- `npx playwright test -g "visual test"` -- run a test with a specific title
- `npx playwright test --last-failed` -- run last failed tests
- `npx playwright test tests/home.spec.ts:8` -- run a spefic test file and line number

### 5. Debug tests
- `npx playwright test tests/home.spec.ts --debug` -- debug a specific test 

### 6. Project Structure
```
playwright-tests/
├── tests/                             # All test specs and setup files
│   ├── auth.setup.ts                  # Reusable authentication session
│   ├── practice-home.spec.ts          # Home page UI tests for pacticesoftwaretesting.com
│   ├── practice-login.spec.ts         # Login flow validation for pacticesoftwaretesting.com
│   ├── paylocity-home.spec.ts         # Home page UI tests for Paylocity public website
│   └── postman-echo-api.spec.ts       # API tests for postman-echo.com
│
├── page-objects/                      # Page Object Models (POM)
│   ├── login-page.pom.ts              # Login page abstraction
│   └── account-page.pom.ts            # Account page abstraction
│
├── playwright.config.ts               # Playwright test runner configuration
├── tsconfig.json                      # TypeScript configuration
└── README.md                          # Project documentation
```

### 🔗 API Testing Sample
```
const response = await apiContext.post('/post', {
  data: { message: 'Hello, Playwright!' }
});
expect(response.status()).toBe(200);
expect(await response.json()).toMatchObject({ data: { message: 'Hello, Playwright!' } });
```
## 👨‍💻 Maintainer
Built and maintained by Khai Pham —
QA Engineer | SDET | Test Automation Architect

💼 [@khaidpham](https://github.com/khaidpham)  
🔗 [LinkedIn](https://www.linkedin.com/in/khaidpham/)
