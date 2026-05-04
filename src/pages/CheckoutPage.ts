import { Locator, Page } from "@playwright/test";
import { ProductName, UiText } from "../fixtures/testData";

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

  get summaryItemTotalLabel(): Locator {
    return this.page.getByTestId("subtotal-label");
  }

  get summaryTaxLabel(): Locator {
    return this.page.getByTestId("tax-label");
  }

  get summaryTotalLabel(): Locator {
    return this.page.getByTestId("total-label");
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

  overviewProduct(itemName: ProductName): Locator {
    return this.page.getByRole("link", { name: itemName });
  }

  async getItemTotalAmount(): Promise<number> {
    const text = await this.summaryItemTotalLabel.textContent();
    return this.extractCurrency(text ?? "");
  }

  async getTaxAmount(): Promise<number> {
    const text = await this.summaryTaxLabel.textContent();
    return this.extractCurrency(text ?? "");
  }

  async getTotalAmount(): Promise<number> {
    const text = await this.summaryTotalLabel.textContent();
    return this.extractCurrency(text ?? "");
  }

  private extractCurrency(raw: string): number {
    const normalized = raw.replace(/[^\d.]/g, "");
    return Number(normalized);
  }
}
