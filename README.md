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
  tests/
    fixtures/
      base.fixture.ts
    cart.spec.ts
    checkout-negative.spec.ts
    checkout-overview.spec.ts
    inventory.spec.ts
    login.spec.ts
    product-details.spec.ts
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

## Run Tests

```bash
npm test
```

Run headed:

```bash
npm run test:headed
```

Open HTML report:

```bash
npm run report
```