# Playwright example automation framework
Node.js / Typescript automation framework with Playwright
Automation tests for an [example web application](https://practicesoftwaretesting.com )

## Running test using npm scripts
`npm run test` -- run tests on all projects - "npx playwright test"
`npm run test:chromium` -- run tests on chromium - "npx playwright test --project=chromium"
`npm run test:first` -- run tests with @first tag - "npx playwright test --grep @first"
`npm run test:local` -- run tests against local dev - "BASE_URL=http://localhost:4200 npx playwright test"
`npm run test:report` -- run tests then open report - "npx playwright test && npx playwright show-report",
`npm run test:ui` -- run test in ui mode - "npx playwright test --ui"

## Running and debuggin tests
`npx playwright test --update-snapshots` -- save new based snapshots for visual validation
`npx playwright test -g "visual test"` -- run a test with a specific title
`npx playwright test --last-failed` -- run last failed tests
`npx playwright test tests/home.spec.ts:8` -- run a spefic test file and line number
`npx playwright test tests/home.spec.ts --debug` -- debug a specific test 

## Maintainers
The lead maintainers of this project are:
- [@khaidpham](https://github.com/khaidpham) - khaipham@gmail.com