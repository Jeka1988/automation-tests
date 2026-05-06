import { expect, test } from "../fixtures/api.fixture";

test.describe("API negative HTTP contract", () => {
  test("unknown route returns 404", async ({ apiClient }) => {
    const response = await apiClient.get("/not-a-real-route");
    expect(response.status()).toBe(404);
  });

  test("missing first-party static asset returns 404", async ({ apiClient }) => {
    const response = await apiClient.get("/static/js/does-not-exist.js");
    expect(response.status()).toBe(404);
  });
});
