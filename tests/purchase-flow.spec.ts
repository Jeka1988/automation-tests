import {
  CheckoutInputValue,
  ProductName,
  SauceCredential,
  SauceUser,
  UiText,
  UrlPath
} from "../src/fixtures/testData";
import { APIRequestContext } from "@playwright/test";
import { expect, test } from "./fixtures/base.fixture";

test.describe("Purchase flow", () => {
  let suiteApiContext: APIRequestContext;

  test.beforeAll(async ({ playwright, baseURL }) => {
    suiteApiContext = await playwright.request.newContext({ baseURL });
  });

  test.afterAll(async () => {
    await suiteApiContext.dispose();
  });

  test("standard_user completes checkout", async ({ page, loginPage, inventoryPage, cartPage, checkoutPage }) => {
    await test.step("Open login page and verify login form", async () => {
      await loginPage.goto();
      await expect(loginPage.usernameInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
    });

    await test.step("Login with standard user and verify inventory page", async () => {
      await loginPage.login(SauceUser.STANDARD, SauceCredential.PASSWORD);
      await expect(page).toHaveURL(new RegExp(`${UrlPath.INVENTORY}$`));
      await expect(inventoryPage.productsTitle).toBeVisible();
    });

    await test.step("Add backpack to cart and verify cart badge", async () => {
      await inventoryPage.addItemToCart(ProductName.BACKPACK);
      await expect(inventoryPage.cartBadge).toBeVisible();
      await expect(inventoryPage.cartBadge).toHaveText("1");
    });

    await test.step("Open cart and verify chosen product exists", async () => {
      await inventoryPage.openCart();
      await expect(page).toHaveURL(new RegExp(`${UrlPath.CART}$`));
      await expect(cartPage.cartItem(ProductName.BACKPACK)).toBeVisible();
    });

    await test.step("Proceed to checkout and complete customer details", async () => {
      await cartPage.proceedToCheckout();
      await expect(page).toHaveURL(new RegExp(`${UrlPath.CHECKOUT_STEP_ONE}$`));
      await checkoutPage.fillCustomerInfo(
        CheckoutInputValue.FIRST_NAME,
        CheckoutInputValue.LAST_NAME,
        CheckoutInputValue.POSTAL_CODE
      );
      await expect(page).toHaveURL(new RegExp(`${UrlPath.CHECKOUT_STEP_TWO}$`));
    });

    await test.step("Finish checkout and verify order success", async () => {
      await checkoutPage.finishOrder();
      await expect(page).toHaveURL(new RegExp(`${UrlPath.CHECKOUT_COMPLETE}$`));
      await expect(checkoutPage.completeHeader).toBeVisible();
      await expect(checkoutPage.completeHeader).toHaveText(UiText.CHECKOUT_SUCCESS);
    });
  });
});
