import { APIRequestContext } from "@playwright/test";
import { UrlPath } from "../src/fixtures/testData";
import { expect, test } from "./fixtures/base.fixture";

const protectedRoutes = [UrlPath.INVENTORY, UrlPath.CART, UrlPath.CHECKOUT_STEP_ONE] as const;

test.describe("Protected route access", () => {
  let suiteApiContext: APIRequestContext;

  test.beforeAll(async ({ playwright, baseURL }) => {
    suiteApiContext = await playwright.request.newContext({ baseURL });
  });

  test.afterAll(async () => {
    await suiteApiContext.dispose();
  });

  for (const route of protectedRoutes) {
    test(`redirects unauthenticated user from ${route} to login`, async ({ page, loginPage }) => {
      await test.step(`Navigate to protected route ${route}`, async () => {
        await loginPage.gotoPath(route);
      });

      await test.step("Verify login page is displayed", async () => {
        await expect(page).toHaveURL(new RegExp(`${UrlPath.LOGIN}$`));
        await expect(loginPage.loginButton).toBeVisible();
        await expect(loginPage.usernameInput).toBeVisible();
      });
    });
  }
});
