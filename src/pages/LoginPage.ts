import { Locator, Page } from "@playwright/test";
import { SauceCredential, SauceUser, UiText, UrlPath } from "../fixtures/testData";

export class LoginPage {
  constructor(private readonly page: Page) {}

  get usernameInput(): Locator {
    return this.page.getByPlaceholder("Username");
  }

  get passwordInput(): Locator {
    return this.page.getByPlaceholder("Password");
  }

  get loginButton(): Locator {
    return this.page.getByRole("button", { name: UiText.LOGIN });
  }

  get errorBanner(): Locator {
    return this.page.getByText(UiText.LOGIN_ERROR_PREFIX, { exact: false });
  }

  errorMessage(message: UiText): Locator {
    return this.page.getByText(message, { exact: true });
  }

  async goto(): Promise<void> {
    await this.page.goto(UrlPath.LOGIN);
  }

  async gotoPath(path: UrlPath): Promise<void> {
    await this.page.goto(path);
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginAs(user: SauceUser): Promise<void> {
    await this.login(user, SauceCredential.PASSWORD);
  }
}
