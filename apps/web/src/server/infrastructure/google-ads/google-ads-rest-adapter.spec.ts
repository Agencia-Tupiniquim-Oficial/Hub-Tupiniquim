import { describe, expect, it, vi } from "vitest";
import {
  GoogleAdsApiError,
  GoogleAdsAuthenticationError,
} from "../../application/google-ads/google-ads-customer-reader";
import { createGoogleAdsCustomerReader } from "./google-ads-rest-adapter";

describe("Google Ads REST customer reader", () => {
  it("uses OAuth and returns accessible customer IDs", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({ resourceNames: ["customers/1234567890"] }),
        { status: 200 },
      ),
    );
    const reader = createGoogleAdsCustomerReader({
      accessTokenProvider: { getAccessToken: async () => "synthetic-access-token" },
      fetcher,
    });

    await expect(reader.listAccessibleCustomers()).resolves.toEqual([
      { customerId: "1234567890" },
    ]);

    expect(fetcher).toHaveBeenCalledWith(
      "https://googleads.googleapis.com/v26/customers:listAccessibleCustomers",
      expect.objectContaining({
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer synthetic-access-token",
        },
      }),
    );
  });

  it("does not expose Google Ads error details when the API rejects a request", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ error: { message: "private upstream detail" } }), {
        status: 403,
      }),
    );
    const reader = createGoogleAdsCustomerReader({
      accessTokenProvider: { getAccessToken: async () => "synthetic-access-token" },
      fetcher,
    });

    await expect(reader.listAccessibleCustomers()).rejects.toMatchObject({
      name: GoogleAdsApiError.name,
      status: 403,
      message: "Google Ads API request failed.",
    });
  });

  it("rejects an invalid successful response instead of reporting an empty account list", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ resourceNames: ["not-a-customer-resource"] }), {
        status: 200,
      }),
    );
    const reader = createGoogleAdsCustomerReader({
      accessTokenProvider: { getAccessToken: async () => "synthetic-access-token" },
      fetcher,
    });

    await expect(reader.listAccessibleCustomers()).rejects.toBeInstanceOf(
      GoogleAdsApiError,
    );
  });

  it("does not call Google Ads without an access token", async () => {
    const fetcher = vi.fn<typeof fetch>();
    const reader = createGoogleAdsCustomerReader({
      accessTokenProvider: { getAccessToken: async () => "" },
      fetcher,
    });

    await expect(reader.listAccessibleCustomers()).rejects.toBeInstanceOf(
      GoogleAdsAuthenticationError,
    );
    expect(fetcher).not.toHaveBeenCalled();
  });
});
