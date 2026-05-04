import { APIRequestContext } from "@playwright/test";
import {
  CheckoutInputValue,
  ProductName,
  SauceUser,
  UiText,
  UrlPath
} from "../src/fixtures/testData";
import { expect, test } from "./fixtures/base.fixture";

const checkoutValidationScenarios = [
  {
    name: "fails when first name is missing",
    firstName: CheckoutInputValue.EMPTY,
    lastName: CheckoutInputValue.LAST_NAME,
    postalCode: CheckoutInputValue.POSTAL_CODE,
    expectedError: UiText.FIRST_NAME_REQUIRED_ERROR
  },
  {
    name: "fails when last name is missing",
    firstName: CheckoutInputValue.FIRST_NAME,
    lastName: CheckoutInputValue.EMPTY,
    postalCode: CheckoutInputValue.POSTAL_CODE,
    expectedError: UiText.LAST_NAME_REQUIRED_ERROR
  },
  {
    name: "fails when postal code is missing",
    firstName: CheckoutInputValue.FIRST_NAME,
    lastName: CheckoutInputValue.LAST_NAME,
    postalCode: CheckoutInputValue.EMPTY,
    expectedError: UiText.POSTAL_CODE_REQUIRED_ERROR
  }
] as const;

test.describe("Checkout validation", () => {
  let suiteApiContext: APIRequestContext;

  test.beforeAll(async ({ playwright, baseURL }) => {
    suiteApiContext = await playwright.request.newContext({ baseURL });
  });

  test.afterAll(async () => {
    await suiteApiContext.dispose();
  });

  for (const scenario of checkoutValidationScenarios) {
    test(scenario.name, async ({ page, loginPage, inventoryPage, cartPage, checkoutPage }) => {
      await test.step("Login and navigate to checkout step one", async () => {
        await loginPage.goto();
        await loginPage.loginAs(SauceUser.STANDARD);
        await expect(page).toHaveURL(new RegExp(`${UrlPath.INVENTORY}$`));
        await inventoryPage.addItemToCart(ProductName.BACKPACK);
        await inventoryPage.openCart();
        await expect(page).toHaveURL(new RegExp(`${UrlPath.CART}$`));
        await cartPage.proceedToCheckout();
        await expect(page).toHaveURL(new RegExp(`${UrlPath.CHECKOUT_STEP_ONE}$`));
      });

      await test.step("Submit incomplete checkout form and verify validation error", async () => {
        await checkoutPage.fillCustomerInfo(scenario.firstName, scenario.lastName, scenario.postalCode);
        await expect(page).toHaveURL(new RegExp(`${UrlPath.CHECKOUT_STEP_ONE}$`));
        await expect(checkoutPage.errorBanner).toBeVisible();
        await expect(checkoutPage.errorMessage(scenario.expectedError)).toBeVisible();
      });
    });
  }
});
