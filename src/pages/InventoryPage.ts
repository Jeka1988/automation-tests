import { Locator, Page } from "@playwright/test";
import { ProductName, ProductSort, UiText } from "../fixtures/testData";

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

  get sortDropdown(): Locator {
    return this.page.getByRole("combobox");
  }

  get productNameLabels(): Locator {
    return this.page.getByTestId("inventory-item-name");
  }

  get productPriceLabels(): Locator {
    return this.page.getByTestId("inventory-item-price");
  }

  addToCartButton(itemName: ProductName): Locator {
    const productSlug = itemName.toLowerCase().replace(/\s+/g, "-");
    return this.page.getByTestId(`add-to-cart-${productSlug}`);
  }

  productPrice(itemName: ProductName): Locator {
    return this.page
      .locator(".inventory_item")
      .filter({ has: this.page.getByText(itemName, { exact: true }) })
      .getByTestId("inventory-item-price");
  }

  removeFromCartButton(itemName: ProductName): Locator {
    const productSlug = itemName.toLowerCase().replace(/\s+/g, "-");
    return this.page.getByTestId(`remove-${productSlug}`);
  }

  async addItemToCart(itemName: ProductName): Promise<void> {
    await this.addToCartButton(itemName).click();
  }

  async addItemsToCart(itemNames: ProductName[]): Promise<void> {
    for (const itemName of itemNames) {
      await this.addItemToCart(itemName);
    }
  }

  async removeItemFromCart(itemName: ProductName): Promise<void> {
    await this.removeFromCartButton(itemName).click();
  }

  async sortBy(sort: ProductSort): Promise<void> {
    await this.sortDropdown.selectOption(sort);
  }

  async openProductDetails(itemName: ProductName): Promise<void> {
    await this.page.getByText(itemName, { exact: true }).click();
  }

  async getVisibleProductNames(): Promise<string[]> {
    return this.productNameLabels.allTextContents();
  }

  async getVisibleProductPrices(): Promise<number[]> {
    const labels = await this.productPriceLabels.allTextContents();
    return labels.map((value) => Number(value.replace("$", "")));
  }

  async getProductPriceText(itemName: ProductName): Promise<string> {
    const text = await this.productPrice(itemName).textContent();
    return text?.trim() ?? "";
  }

  async openCart(): Promise<void> {
    await this.shoppingCartLink.click();
  }

  async logout(): Promise<void> {
    await this.openMenuButton.click();
    await this.logoutLink.click();
  }
}
