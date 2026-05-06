import { expect, test } from "../fixtures/api.fixture";

test.describe("API app shell contract", () => {
  test("GET / returns the app shell", async ({ apiClient }) => {
    const { response, body } = await apiClient.getHomepage();

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"] ?? "").toContain("text/html");
    expect(body).toContain("Swag Labs");
  });

  test("homepage exposes first-party script and stylesheet assets", async ({ apiClient }) => {
    const assets = await apiClient.getFirstPartyStaticAssets();

    expect(assets.scripts.length).toBeGreaterThan(0);
    expect(assets.styles.length).toBeGreaterThan(0);
  });
});
