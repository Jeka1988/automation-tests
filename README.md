# SauceDemo Automation Tests (POM)

Demo UI automation project for [SauceDemo](https://www.saucedemo.com/) using:

- Playwright
- TypeScript
- Page Object Model (POM)
- Typed fixtures for page object injection
- Enum-driven test data and expected texts

## Framework Rules

- Use Page Object Model with clear separation:
  - `src/pages` for page classes
  - `tests` for `.spec.ts` files
- Use web-first locators:
  - prioritize `getByRole`, `getByPlaceholder`, `getByText`
  - use `getByTestId` only when role/text/placeholder is not reliable
- Use web-first assertions only (`await expect(locator).toBeVisible()`, `toHaveText()`, `toHaveURL()`)
- Do not use hard sleeps (`page.waitForTimeout()` is not used)
- Use fixtures so page objects are automatically available in tests
- Use enums for reusable texts, credentials, and product names
- Use `beforeAll` / `afterAll` for suite setup-teardown resources
- Keep all element actions inside page object methods
- Tests may use `expect(...)` with page-object locators for readable assertions
- Use `test.step(...)` and keep each step action paired with immediate assertions
- For negative scenarios, enforce 3-part verification:
  1. expected error appears
  2. blocked/redirected state is confirmed
  3. success-only markers are absent

## Covered Scenarios

- Valid login with `standard_user`
- Invalid login credentials error
- Locked user validation (`locked_out_user`)
- Logout flow for `standard_user`
- End-to-end purchase flow:
  - Add product to cart
  - Checkout with customer details
  - Verify success page
- Cart behavior:
  - Verify item is preserved from inventory to cart
  - Remove item and verify cart becomes empty
- Failed purchase validations:
  - Missing first name
  - Missing last name
  - Missing postal code
- Inventory sorting:
  - Name A-Z and Z-A
  - Price low-high and high-low
- Product details:
  - Open details, verify product data, add to cart, return to products
- Protected routes:
  - Direct access to inventory/cart/checkout routes redirects to login
- Checkout overview totals:
  - Verify subtotal, tax, and total calculation

## Demo Credentials

SauceDemo publishes these usernames on the login page:

- `standard_user`
- `locked_out_user`
- `problem_user`
- `performance_glitch_user`
- `error_user`
- `visual_user`

Password for all demo users: `secret_sauce`

## Project Structure

```
automation-tests/
  src/
    fixtures/
      testData.ts
    pages/
      LoginPage.ts
      InventoryPage.ts
      CartPage.ts
      CheckoutPage.ts
      ProductDetailsPage.ts
  .cursor/
    rules/
      playwright-pom-architecture.mdc
      playwright-test-style.mdc
      playwright-negative-verification.mdc
  .github/
    workflows/
      playwright.yml
  .auth/
    standard-user.json (generated)
  tests/
    authenticated/
      auth-session.spec.ts
    fixtures/
      base.fixture.ts
    setup/
      auth.setup.ts
    cart.spec.ts
    checkout-negative.spec.ts
    checkout-overview.spec.ts
    inventory.spec.ts
    login.spec.ts
    product-details.spec.ts
    protected-routes.spec.ts
    purchase-flow.spec.ts
  playwright.config.ts
  tsconfig.json
```

## Enum Model

Shared values are centralized in `src/fixtures/testData.ts` using enums:

- `SauceUser`
- `SauceCredential`
- `ProductName`
- `ProductSort`
- `CheckoutInputValue`
- `UiText`
- `UrlPath`

This keeps specs free of repeated string literals.

## Fixture Pattern

Tests import `test` and `expect` from `tests/fixtures/base.fixture.ts` instead of directly from Playwright:

```ts
import { test, expect } from "./fixtures/base.fixture";
```

Each test receives initialized page objects as fixtures:

- `loginPage`
- `inventoryPage`
- `cartPage`
- `checkoutPage`
- `productDetailsPage`

## Cursor Project Rules

The project includes always-on Cursor rules in `.cursor/rules/`:

- `playwright-pom-architecture.mdc`
- `playwright-test-style.mdc`
- `playwright-negative-verification.mdc`

These rules persist your standards for:

- POM interaction boundaries (actions in page objects)
- web-first locator and assertion strategy
- strict negative-path verification to avoid false positives

## Suite Hooks Pattern

Each spec file uses suite hooks to manage shared setup-teardown resources:

- `beforeAll` creates a suite API request context
- `afterAll` disposes that context to keep lifecycle management explicit and clean

Business actions (login, cart operations, checkout actions) remain inside test bodies to preserve test isolation.

## Step-Based Test Style

Tests are split into `test.step(...)` sections where every step:

- performs a focused user action
- immediately validates the expected state with `expect(...)`
- keeps Playwright reports easy to debug when failures happen

## Setup

```bash
npm install
npx playwright install
```

To override the app URL:

```bash
BASE_URL=https://www.saucedemo.com npm test
```

## Run Tests

```bash
npm test
```

Typecheck:

```bash
npm run typecheck
```

Run tests serially:

```bash
npm run test:serial
```

Run smoke tests:

```bash
npm run test:smoke
```

Run regression tests:

```bash
npm run test:regression
```

Run per-browser:

```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

Run headed:

```bash
npm run test:headed
```

Open HTML report:

```bash
npm run report
```

## Test Tagging

- `@smoke`: critical happy paths (for example login success and purchase flow)
- `@regression`: broader coverage suites (cart, checkout negatives, sorting, protected routes, details, totals)

## Auth Storage Setup (Optional)

The config includes an optional authenticated flow:

- `tests/setup/auth.setup.ts` logs in as `standard_user` and saves `.auth/standard-user.json`
- `chromium-auth` project uses that storage state
- `tests/authenticated/auth-session.spec.ts` validates pre-authenticated access

This keeps login tests independent while allowing fast authenticated checks.

## CI

GitHub Actions workflow: `.github/workflows/playwright.yml`

Pipeline steps:

- `npm ci`
- `npx playwright install --with-deps`
- `npm run typecheck`
- `npm test`
- upload Playwright artifacts