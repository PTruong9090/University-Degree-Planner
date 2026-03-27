const DEFAULT_HEADERS = {
  "User-Agent": "PlanBear/1.0 (+course availability polling)",
};

export async function fetchUclaOfferingHtml({ offering, fetchImpl = globalThis.fetch }) {
  if (!offering?.sourceUrl) {
    throw new Error("A sourceUrl is required to scrape UCLA offering availability");
  }

  if (typeof fetchImpl !== "function") {
    throw new Error("A fetch implementation is required for UCLA offering scraping");
  }

  const response = await fetchImpl(offering.sourceUrl, {
    headers: DEFAULT_HEADERS,
  });

  if (!response.ok) {
    throw new Error(`UCLA availability request failed with status ${response.status}`);
  }

  return response.text();
}

export async function scrapeUclaOfferingSnapshot({
  offering,
  parseHtml,
  fetchImpl = globalThis.fetch,
}) {
  if (typeof parseHtml !== "function") {
    throw new Error("scrapeUclaOfferingSnapshot requires a parseHtml function");
  }

  const html = await fetchUclaOfferingHtml({ offering, fetchImpl });
  return parseHtml({ html, offering });
}
