import { expect, test } from "../fixtures/base.fixture";
import { UiText, UrlPath } from "../../src/fixtures/testData";

test.describe("Authenticated session @smoke", () => {
  test("loads inventory with pre-authenticated storage state @smoke", async ({ page, inventoryPage }) => {
    await page.goto(UrlPath.INVENTORY);
    await expect(page).toHaveURL(new RegExp(`${UrlPath.INVENTORY}$`));
    await expect(inventoryPage.productsTitle).toHaveText(UiText.PRODUCTS);
  });
});
