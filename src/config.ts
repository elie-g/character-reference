

function parseBaseUrl(baseUrl: string): string {
  const url = new URL(baseUrl, location.href);
  if (!url.pathname.endsWith('/'))
    url.pathname += '/';
  return url.href;
}

export const UNICODE_BASE_URL = parseBaseUrl(import.meta.env.VITE_UNICODE_BASE_URL);
