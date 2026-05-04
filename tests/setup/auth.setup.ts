import { expect, test } from "@playwright/test";
import { SauceCredential, SauceUser, UrlPath } from "../../src/fixtures/testData";

test("authenticate standard user and save storage state", async ({ page }) => {
  await page.goto(UrlPath.LOGIN);
  await page.getByPlaceholder("Username").fill(SauceUser.STANDARD);
  await page.getByPlaceholder("Password").fill(SauceCredential.PASSWORD);
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(new RegExp(`${UrlPath.INVENTORY}$`));
  await page.context().storageState({ path: ".auth/standard-user.json" });
});
