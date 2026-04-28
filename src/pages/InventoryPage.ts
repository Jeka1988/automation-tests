import { Locator, Page } from "@playwright/test";
import { ProductName, UiText } from "../fixtures/testData";

export class InventoryPage {
  constructor(private readonly page: Page) {}

  get productsTitle(): Locator {
    return this.page.getByText(UiText.PRODUCTS, { exact: true });
  }

  get shoppingCartLink(): Locator {
    return this.page.getByTestId("shopping-cart-link");
  }

  get cartBadge(): Locator {
    return this.page.getByTestId("shopping-cart-badge");
  }

  get openMenuButton(): Locator {
    return this.page.getByRole("button", { name: UiText.OPEN_MENU });
  }

  get logoutLink(): Locator {
    return this.page.getByRole("link", { name: UiText.LOGOUT_SIDEBAR_LINK });
  }

  addToCartButton(itemName: ProductName): Locator {
    const productSlug = itemName.toLowerCase().replace(/\s+/g, "-");
    return this.page.getByTestId(`add-to-cart-${productSlug}`);
  }

  removeFromCartButton(itemName: ProductName): Locator {
    const productSlug = itemName.toLowerCase().replace(/\s+/g, "-");
    return this.page.getByTestId(`remove-${productSlug}`);
  }

  async addItemToCart(itemName: ProductName): Promise<void> {
    await this.addToCartButton(itemName).click();
  }

  async removeItemFromCart(itemName: ProductName): Promise<void> {
    await this.removeFromCartButton(itemName).click();
  }

  async openCart(): Promise<void> {
    await this.shoppingCartLink.click();
  }

  async logout(): Promise<void> {
    await this.openMenuButton.click();
    await this.logoutLink.click();
  }
}
