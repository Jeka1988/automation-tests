import { APIRequestContext } from "@playwright/test";
import {
  CheckoutInputValue,
  ProductName,
  SauceUser,
  UrlPath,
  productPriceByName
} from "../src/fixtures/testData";
import { expect, test } from "./fixtures/base.fixture";

test.describe("Checkout overview totals @regression", () => {
  let suiteApiContext: APIRequestContext;

  test.beforeAll(async ({ playwright, baseURL }) => {
    suiteApiContext = await playwright.request.newContext({ baseURL });
  });

  test.afterAll(async () => {
    await suiteApiContext.dispose();
  });

  test("shows correct subtotal, tax, and total @regression", async ({ page, loginPage, inventoryPage, cartPage, checkoutPage }) => {
    const selectedProducts = [ProductName.BACKPACK, ProductName.BIKE_LIGHT] as const;
    const expectedSubtotal = selectedProducts.reduce((sum, product) => sum + productPriceByName[product], 0);

    await test.step("Login and add two products", async () => {
      await loginPage.goto();
      await loginPage.loginAs(SauceUser.STANDARD);
      await expect(page).toHaveURL(new RegExp(`${UrlPath.INVENTORY}$`));
      await inventoryPage.addItemsToCart([...selectedProducts]);
      await expect(inventoryPage.cartBadge).toHaveText("2");
    });

    await test.step("Open cart and proceed to checkout overview", async () => {
      await inventoryPage.openCart();
      await expect(page).toHaveURL(new RegExp(`${UrlPath.CART}$`));
      await cartPage.proceedToCheckout();
      await expect(page).toHaveURL(new RegExp(`${UrlPath.CHECKOUT_STEP_ONE}$`));
      await checkoutPage.fillCustomerInfo(
        CheckoutInputValue.FIRST_NAME,
        CheckoutInputValue.LAST_NAME,
        CheckoutInputValue.POSTAL_CODE
      );
      await expect(page).toHaveURL(new RegExp(`${UrlPath.CHECKOUT_STEP_TWO}$`));
    });

    await test.step("Verify selected products in overview", async () => {
      await expect(checkoutPage.overviewProduct(ProductName.BACKPACK)).toBeVisible();
      await expect(checkoutPage.overviewProduct(ProductName.BIKE_LIGHT)).toBeVisible();
    });

    await test.step("Verify subtotal, tax, and final total math", async () => {
      const itemTotal = await checkoutPage.getItemTotalAmount();
      const tax = await checkoutPage.getTaxAmount();
      const total = await checkoutPage.getTotalAmount();

      expect(itemTotal).toBe(expectedSubtotal);
      expect(tax).toBeGreaterThan(0);
      expect(total).toBeCloseTo(itemTotal + tax, 2);
    });
  });
});
