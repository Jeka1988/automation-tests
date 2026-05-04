import { APIRequestContext } from "@playwright/test";
import { ProductName, SauceUser, UrlPath, productPriceByName } from "../src/fixtures/testData";
import { expect, test } from "./fixtures/base.fixture";

test.describe("Product details", () => {
  let suiteApiContext: APIRequestContext;

  test.beforeAll(async ({ playwright, baseURL }) => {
    suiteApiContext = await playwright.request.newContext({ baseURL });
  });

  test.afterAll(async () => {
    await suiteApiContext.dispose();
  });

  test("opens details, adds product to cart, and returns to inventory", async ({
    page,
    loginPage,
    inventoryPage,
    productDetailsPage
  }) => {
    const selectedProduct = ProductName.BACKPACK;

    await test.step("Login and open product details page", async () => {
      await loginPage.goto();
      await loginPage.loginAs(SauceUser.STANDARD);
      await expect(page).toHaveURL(new RegExp(`${UrlPath.INVENTORY}$`));
      await inventoryPage.openProductDetails(selectedProduct);
      await expect(page).toHaveURL(new RegExp(`${UrlPath.INVENTORY_ITEM}.*`));
    });

    await test.step("Verify product details are displayed", async () => {
      await expect(productDetailsPage.productName).toHaveText(selectedProduct);
      await expect(productDetailsPage.productDescription).toBeVisible();
      await expect(productDetailsPage.productPrice).toHaveText(`$${productPriceByName[selectedProduct]}`);
    });

    await test.step("Add product to cart from details and verify cart badge", async () => {
      await productDetailsPage.addToCart();
      await expect(inventoryPage.cartBadge).toHaveText("1");
    });

    await test.step("Return to products list", async () => {
      await productDetailsPage.backToProducts();
      await expect(page).toHaveURL(new RegExp(`${UrlPath.INVENTORY}$`));
      await expect(inventoryPage.productsTitle).toBeVisible();
    });
  });
});
