import { APIResponse, expect, test as base } from "@playwright/test";

type HomepageAssets = {
  scripts: string[];
  styles: string[];
  origin: string;
};

type ApiClient = {
  get: (pathOrUrl: string) => Promise<APIResponse>;
  getText: (pathOrUrl: string) => Promise<{ response: APIResponse; body: string }>;
  getHomepage: () => Promise<{ response: APIResponse; body: string }>;
  getFirstPartyStaticAssets: () => Promise<HomepageAssets>;
};

type ApiFixtures = {
  apiClient: ApiClient;
};

const unique = (values: string[]): string[] => [...new Set(values)];

const extractAttribute = (tag: string, attribute: string): string | null => {
  const attributeRegex = new RegExp(`${attribute}\\s*=\\s*["']([^"']+)["']`, "i");
  return tag.match(attributeRegex)?.[1] ?? null;
};

const extractScriptSrcs = (html: string): string[] => {
  const scriptTagRegex = /<script\b[^>]*>/gi;
  const srcs: string[] = [];
  let match: RegExpExecArray | null = scriptTagRegex.exec(html);

  while (match) {
    const src = extractAttribute(match[0], "src");
    if (src) {
      srcs.push(src);
    }
    match = scriptTagRegex.exec(html);
  }

  return unique(srcs);
};

const extractStylesheetHrefs = (html: string): string[] => {
  const linkTagRegex = /<link\b[^>]*>/gi;
  const hrefs: string[] = [];
  let match: RegExpExecArray | null = linkTagRegex.exec(html);

  while (match) {
    const tag = match[0];
    const rel = extractAttribute(tag, "rel");
    const href = extractAttribute(tag, "href");

    if (rel && href && /\bstylesheet\b/i.test(rel)) {
      hrefs.push(href);
    }

    match = linkTagRegex.exec(html);
  }

  return unique(hrefs);
};

export const test = base.extend<ApiFixtures>({
  apiClient: async ({ request, baseURL }, use) => {
    if (!baseURL) {
      throw new Error("baseURL must be configured for API tests.");
    }

    const resolveUrl = (pathOrUrl: string): string => new URL(pathOrUrl, baseURL).toString();

    const get = async (pathOrUrl: string): Promise<APIResponse> =>
      request.get(resolveUrl(pathOrUrl), { failOnStatusCode: false });

    const getText = async (pathOrUrl: string): Promise<{ response: APIResponse; body: string }> => {
      const response = await get(pathOrUrl);
      const body = await response.text();
      return { response, body };
    };

    const getHomepage = async (): Promise<{ response: APIResponse; body: string }> => getText("/");

    const getFirstPartyStaticAssets = async (): Promise<HomepageAssets> => {
      const { body } = await getHomepage();
      const scripts = extractScriptSrcs(body);
      const styles = extractStylesheetHrefs(body);
      const appOrigin = new URL(baseURL).origin;

      const normalize = (assetUrl: string): string => new URL(assetUrl, baseURL).toString();
      const isFirstPartyStatic = (assetUrl: string): boolean => {
        const parsed = new URL(normalize(assetUrl));
        return parsed.origin === appOrigin && parsed.pathname.startsWith("/static/");
      };

      return {
        scripts: scripts.map(normalize).filter(isFirstPartyStatic),
        styles: styles.map(normalize).filter(isFirstPartyStatic),
        origin: appOrigin
      };
    };

    await use({
      get,
      getText,
      getHomepage,
      getFirstPartyStaticAssets
    });
  }
});

export { expect };
