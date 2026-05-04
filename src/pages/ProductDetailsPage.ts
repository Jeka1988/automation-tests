import { Locator, Page } from "@playwright/test";

export class ProductDetailsPage {
  constructor(private readonly page: Page) {}

  get productName(): Locator {
    return this.page.getByTestId("inventory-item-name");
  }

  get productDescription(): Locator {
    return this.page.getByTestId("inventory-item-desc");
  }

  get productPrice(): Locator {
    return this.page.getByTestId("inventory-item-price");
  }

  get backToProductsButton(): Locator {
    return this.page.getByRole("button", { name: "Back to products" });
  }

  get addToCartButton(): Locator {
    return this.page.getByRole("button", { name: "Add to cart" });
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async backToProducts(): Promise<void> {
    await this.backToProductsButton.click();
  }
}
