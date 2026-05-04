import { APIRequestContext } from "@playwright/test";
import { ProductName, SauceUser, UrlPath } from "../src/fixtures/testData";
import { expect, test } from "./fixtures/base.fixture";

test.describe("Cart behavior @regression", () => {
  let suiteApiContext: APIRequestContext;

  test.beforeAll(async ({ playwright, baseURL }) => {
    suiteApiContext = await playwright.request.newContext({ baseURL });
  });

  test.afterAll(async () => {
    await suiteApiContext.dispose();
  });

  test("keeps selected product from inventory to cart and supports removal @regression", async ({
    page,
    loginPage,
    inventoryPage,
    cartPage
  }) => {
    await test.step("Login and verify inventory page", async () => {
      await loginPage.goto();
      await loginPage.loginAs(SauceUser.STANDARD);
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

  test("supports multiple items, remove one item, and continue shopping @regression", async ({
    page,
    loginPage,
    inventoryPage,
    cartPage
  }) => {
    const selectedProducts = [ProductName.BACKPACK, ProductName.BIKE_LIGHT] as const;

    await test.step("Login and verify inventory page", async () => {
      await loginPage.goto();
      await loginPage.loginAs(SauceUser.STANDARD);
      await expect(page).toHaveURL(new RegExp(`${UrlPath.INVENTORY}$`));
      await expect(inventoryPage.productsTitle).toBeVisible();
    });

    await test.step("Add two products and verify cart badge", async () => {
      await inventoryPage.addItemsToCart([...selectedProducts]);
      await expect(inventoryPage.cartBadge).toHaveText("2");
    });

    await test.step("Open cart and verify both products are listed", async () => {
      await inventoryPage.openCart();
      await expect(page).toHaveURL(new RegExp(`${UrlPath.CART}$`));
      await expect(cartPage.cartItem(ProductName.BACKPACK)).toBeVisible();
      await expect(cartPage.cartItem(ProductName.BIKE_LIGHT)).toBeVisible();
    });

    await test.step("Remove one product and verify cart updates", async () => {
      await cartPage.removeItem(ProductName.BIKE_LIGHT);
      await expect(cartPage.cartItem(ProductName.BIKE_LIGHT)).toHaveCount(0);
      await expect(cartPage.cartItem(ProductName.BACKPACK)).toBeVisible();
      await expect(inventoryPage.cartBadge).toHaveText("1");
    });

    await test.step("Continue shopping and verify inventory page", async () => {
      await cartPage.continueShopping();
      await expect(page).toHaveURL(new RegExp(`${UrlPath.INVENTORY}$`));
      await expect(inventoryPage.productsTitle).toBeVisible();
    });
  });
});
