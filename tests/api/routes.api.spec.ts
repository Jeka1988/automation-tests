import { UrlPath } from "../../src/fixtures/testData";
import { expect, test } from "../fixtures/api.fixture";

const protectedDeepLinks = [UrlPath.INVENTORY, UrlPath.CART, UrlPath.CHECKOUT_STEP_ONE, UrlPath.CHECKOUT_STEP_TWO, UrlPath.CHECKOUT_COMPLETE];

test.describe("API route behavior contract", () => {
  test("raw protected route requests document current HTTP behavior", async ({ apiClient }) => {
    for (const route of protectedDeepLinks) {
      const response = await apiClient.get(route);
      expect(response.status(), `Expected current raw status 404 for route ${route}`).toBe(404);
    }
  });

  test("login route remains directly available", async ({ apiClient }) => {
    const { response, body } = await apiClient.getHomepage();

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"] ?? "").toContain("text/html");
    expect(body).toContain("Swag Labs");
  });
});
