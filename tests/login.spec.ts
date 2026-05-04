import { APIRequestContext } from "@playwright/test";
import { SauceCredential, SauceUser, UiText, UrlPath } from "../src/fixtures/testData";
import { expect, test } from "./fixtures/base.fixture";

test.describe("Login flow @regression", () => {
  let suiteApiContext: APIRequestContext;

  test.beforeAll(async ({ playwright, baseURL }) => {
    suiteApiContext = await playwright.request.newContext({ baseURL });
  });

  test.afterAll(async () => {
    await suiteApiContext.dispose();
  });

  test("allows standard_user to log in @smoke", async ({ page, loginPage, inventoryPage }) => {
    await test.step("Open login page and verify login form", async () => {
      await loginPage.goto();
      await expect(loginPage.usernameInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();
    });

    await test.step("Login with valid credentials and verify inventory screen", async () => {
      await loginPage.loginAs(SauceUser.STANDARD);
      await expect(page).toHaveURL(new RegExp(`${UrlPath.INVENTORY}$`));
      await expect(inventoryPage.productsTitle).toBeVisible();
      await expect(inventoryPage.productsTitle).toHaveText(UiText.PRODUCTS);
    });
  });

  test("shows error for invalid credentials @regression", async ({ page, loginPage, inventoryPage }) => {
    await test.step("Open login page and confirm submit action is available", async () => {
      await loginPage.goto();
      await expect(loginPage.loginButton).toBeVisible();
    });

    await test.step("Submit invalid credentials and verify the error message", async () => {
      await loginPage.login(SauceUser.INVALID, SauceCredential.WRONG_PASSWORD);
      await expect(loginPage.errorBanner).toBeVisible();
      await expect(loginPage.errorMessage(UiText.INVALID_CREDENTIALS_ERROR)).toBeVisible();
      await expect(page).toHaveURL(new RegExp(`${UrlPath.LOGIN}$`));
      await expect(inventoryPage.productsTitle).toHaveCount(0);
    });
  });

  test("blocks locked_out_user login @regression", async ({ page, loginPage, inventoryPage }) => {
    await test.step("Open login page and confirm submit action is available", async () => {
      await loginPage.goto();
      await expect(loginPage.loginButton).toBeVisible();
    });

    await test.step("Try to login with locked user and verify the error message", async () => {
      await loginPage.loginAs(SauceUser.LOCKED);
      await expect(loginPage.errorBanner).toBeVisible();
      await expect(loginPage.errorMessage(UiText.LOCKED_USER_ERROR)).toBeVisible();
      await expect(page).toHaveURL(new RegExp(`${UrlPath.LOGIN}$`));
      await expect(inventoryPage.productsTitle).toHaveCount(0);
    });
  });

  test("allows standard_user to logout @regression", async ({ page, loginPage, inventoryPage }) => {
    await test.step("Login with standard user and verify inventory screen", async () => {
      await loginPage.goto();
      await loginPage.loginAs(SauceUser.STANDARD);
      await expect(page).toHaveURL(new RegExp(`${UrlPath.INVENTORY}$`));
      await expect(inventoryPage.productsTitle).toBeVisible();
    });

    await test.step("Logout through the side menu and verify login page is shown", async () => {
      await inventoryPage.logout();
      await expect(page).toHaveURL(new RegExp(`${UrlPath.LOGIN}$`));
      await expect(loginPage.loginButton).toBeVisible();
      await expect(loginPage.usernameInput).toBeVisible();
    });
  });
});
