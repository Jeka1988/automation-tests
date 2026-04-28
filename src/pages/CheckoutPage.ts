import { Locator, Page } from "@playwright/test";
import { UiText } from "../fixtures/testData";

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  get firstNameInput(): Locator {
    return this.page.getByPlaceholder("First Name");
  }

  get lastNameInput(): Locator {
    return this.page.getByPlaceholder("Last Name");
  }

  get postalCodeInput(): Locator {
    return this.page.getByPlaceholder("Zip/Postal Code");
  }

  get continueButton(): Locator {
    return this.page.getByRole("button", { name: UiText.CONTINUE });
  }

  get finishButton(): Locator {
    return this.page.getByRole("button", { name: UiText.FINISH });
  }

  get completeHeader(): Locator {
    return this.page.getByText(UiText.CHECKOUT_SUCCESS, { exact: true });
  }

  get errorBanner(): Locator {
    return this.page.getByText(UiText.CHECKOUT_ERROR_PREFIX, { exact: false });
  }

  errorMessage(message: UiText): Locator {
    return this.page.getByText(message, { exact: true });
  }

  async fillCustomerInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  async finishOrder(): Promise<void> {
    await this.finishButton.click();
  }
}
