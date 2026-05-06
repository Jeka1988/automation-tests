import { expect, test } from "../fixtures/api.fixture";

test.describe("API static asset contract", () => {
  test("first-party JavaScript assets are available", async ({ apiClient }) => {
    const assets = await apiClient.getFirstPartyStaticAssets();

    expect(assets.scripts.length).toBeGreaterThan(0);

    for (const scriptUrl of assets.scripts) {
      const response = await apiClient.get(scriptUrl);
      const contentType = response.headers()["content-type"] ?? "";

      expect(response.status(), `Expected JS asset to return 200: ${scriptUrl}`).toBe(200);
      expect(contentType, `Expected JS content type for: ${scriptUrl}`).toMatch(/javascript|ecmascript/i);
    }
  });

  test("first-party CSS assets are available", async ({ apiClient }) => {
    const assets = await apiClient.getFirstPartyStaticAssets();

    expect(assets.styles.length).toBeGreaterThan(0);

    for (const stylesheetUrl of assets.styles) {
      const response = await apiClient.get(stylesheetUrl);
      const contentType = response.headers()["content-type"] ?? "";

      expect(response.status(), `Expected CSS asset to return 200: ${stylesheetUrl}`).toBe(200);
      expect(contentType, `Expected CSS content type for: ${stylesheetUrl}`).toContain("text/css");
    }
  });

  test("asset URLs are same-origin first-party static assets", async ({ apiClient }) => {
    const assets = await apiClient.getFirstPartyStaticAssets();
    const allAssets = [...assets.scripts, ...assets.styles];

    expect(allAssets.length).toBeGreaterThan(0);

    for (const assetUrl of allAssets) {
      const parsed = new URL(assetUrl);
      expect(parsed.origin, `Expected same-origin asset: ${assetUrl}`).toBe(assets.origin);
      expect(parsed.pathname.startsWith("/static/"), `Expected /static/ path for: ${assetUrl}`).toBeTruthy();
    }
  });
});
