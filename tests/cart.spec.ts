import { APIRequestContext } from "@playwright/test";
import { ProductName, SauceCredential, SauceUser, UrlPath } from "../src/fixtures/testData";
import { expect, test } from "./fixtures/base.fixture";

test.describe("Cart behavior", () => {
  let suiteApiContext: APIRequestContext;

  test.beforeAll(async ({ playwright, baseURL }) => {
    suiteApiContext = await playwright.request.newContext({ baseURL });
  });

  test.afterAll(async () => {
    await suiteApiContext.dispose();
  });

  test("keeps selected product from inventory to cart and supports removal", async ({
    page,
    loginPage,
    inventoryPage,
    cartPage
  }) => {
    await test.step("Login and verify inventory page", async () => {
      await loginPage.goto();
      await loginPage.login(SauceUser.STANDARD, SauceCredential.PASSWORD);
      await expect(page).toHaveURL(new RegExp(`${UrlPath.INVENTORY}$`));
      await expect(inventoryPage.productsTitle).toBeVisible();
    });

    await test.step("Add backpack and verify cart badge shows one item", async () => {
      await inventoryPage.addItemToCart(ProductName.BACKPACK);
      await expect(inventoryPage.cartBadge).toBeVisible();
      await expect(inventoryPage.cartBadge).toHaveText("1");
    });

    await test.step("Open cart and verify added product is preserved", async () => {
      await inventoryPage.openCart();
      await expect(page).toHaveURL(new RegExp(`${UrlPath.CART}$`));
      await expect(cartPage.cartItem(ProductName.BACKPACK)).toBeVisible();
    });

    await test.step("Remove product and verify cart item and badge disappear", async () => {
      await cartPage.removeItem(ProductName.BACKPACK);
      await expect(cartPage.cartItem(ProductName.BACKPACK)).toHaveCount(0);
      await expect(inventoryPage.cartBadge).toHaveCount(0);
    });
  });
});
