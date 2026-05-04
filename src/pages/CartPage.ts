import { Locator, Page } from "@playwright/test";
import { ProductName, UiText } from "../fixtures/testData";

export class CartPage {
  constructor(private readonly page: Page) {}

  get continueShoppingButton(): Locator {
    return this.page.getByRole("button", { name: "Continue Shopping" });
  }

  get checkoutButton(): Locator {
    return this.page.getByRole("button", { name: UiText.CHECKOUT });
  }

  cartItem(itemName: ProductName): Locator {
    return this.page.getByRole("link", { name: itemName });
  }

  cartItemPrice(itemName: ProductName): Locator {
    return this.page
      .locator(".cart_item")
      .filter({ has: this.cartItem(itemName) })
      .locator(".inventory_item_price");
  }

  removeFromCartButton(itemName: ProductName): Locator {
    const productSlug = itemName.toLowerCase().replace(/\s+/g, "-");
    return this.page.getByTestId(`remove-${productSlug}`);
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async removeItem(itemName: ProductName): Promise<void> {
    await this.removeFromCartButton(itemName).click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async getCartItemPriceText(itemName: ProductName): Promise<string> {
    const text = await this.cartItemPrice(itemName).textContent();
    return text?.trim() ?? "";
  }
}
