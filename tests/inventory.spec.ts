import { APIRequestContext } from "@playwright/test";
import { ProductSort, SauceUser, UrlPath } from "../src/fixtures/testData";
import { expect, test } from "./fixtures/base.fixture";

test.describe("Inventory sorting", () => {
  let suiteApiContext: APIRequestContext;

  test.beforeAll(async ({ playwright, baseURL }) => {
    suiteApiContext = await playwright.request.newContext({ baseURL });
  });

  test.afterAll(async () => {
    await suiteApiContext.dispose();
  });

  test("supports all product sort options", async ({ page, loginPage, inventoryPage }) => {
    await test.step("Login and verify inventory is loaded", async () => {
      await loginPage.goto();
      await loginPage.loginAs(SauceUser.STANDARD);
      await expect(page).toHaveURL(new RegExp(`${UrlPath.INVENTORY}$`));
      await expect(inventoryPage.productsTitle).toBeVisible();
    });

    await test.step("Sort by name A-Z", async () => {
      await inventoryPage.sortBy(ProductSort.NAME_A_TO_Z);
      const names = await inventoryPage.getVisibleProductNames();
      const expected = [...names].sort((a, b) => a.localeCompare(b));
      expect(names).toEqual(expected);
    });

    await test.step("Sort by name Z-A", async () => {
      await inventoryPage.sortBy(ProductSort.NAME_Z_TO_A);
      const names = await inventoryPage.getVisibleProductNames();
      const expected = [...names].sort((a, b) => b.localeCompare(a));
      expect(names).toEqual(expected);
    });

    await test.step("Sort by price low-high", async () => {
      await inventoryPage.sortBy(ProductSort.PRICE_LOW_TO_HIGH);
      const prices = await inventoryPage.getVisibleProductPrices();
      const expected = [...prices].sort((a, b) => a - b);
      expect(prices).toEqual(expected);
    });

    await test.step("Sort by price high-low", async () => {
      await inventoryPage.sortBy(ProductSort.PRICE_HIGH_TO_LOW);
      const prices = await inventoryPage.getVisibleProductPrices();
      const expected = [...prices].sort((a, b) => b - a);
      expect(prices).toEqual(expected);
    });
  });
});
