import { describe, expect, it, vi } from "vitest";
import {
  GoogleAdsAuthenticationError,
  GoogleAdsApiError,
  type GoogleAdsCustomerReader,
} from "../../../../../server/application/google-ads/google-ads-customer-reader";
import { createGoogleAdsAccountsHandler } from "./route-handler";

describe("Google Ads accounts route", () => {
  it("requires an authenticated administrator before reading accounts", async () => {
    const listAccessibleCustomers = vi.fn<GoogleAdsCustomerReader["listAccessibleCustomers"]>();
    const handler = createGoogleAdsAccountsHandler({
      getCurrentUser: async () => null,
      customerReader: { listAccessibleCustomers },
    });

    const response = await handler();

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "unauthorized" });
    expect(listAccessibleCustomers).not.toHaveBeenCalled();
  });

  it("does not allow a non-administrator to enumerate accounts", async () => {
    const listAccessibleCustomers = vi.fn<GoogleAdsCustomerReader["listAccessibleCustomers"]>();
    const handler = createGoogleAdsAccountsHandler({
      getCurrentUser: async () => ({
        id: "user-analyst",
        email: "analyst@example.test",
        role: "analyst",
      }),
      customerReader: { listAccessibleCustomers },
    });

    const response = await handler();

    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ error: "forbidden" });
    expect(listAccessibleCustomers).not.toHaveBeenCalled();
  });

  it("returns accessible customer IDs to an administrator", async () => {
    const listAccessibleCustomers = vi
      .fn<GoogleAdsCustomerReader["listAccessibleCustomers"]>()
      .mockResolvedValue([{ customerId: "1234567890" }]);
    const handler = createGoogleAdsAccountsHandler({
      getCurrentUser: async () => ({
        id: "user-admin",
        email: "admin@example.test",
        role: "administrator",
      }),
      customerReader: { listAccessibleCustomers },
    });

    const response = await handler();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      accounts: [{ customerId: "1234567890" }],
    });
  });

  it("returns a sanitized error when Google Ads rejects the request", async () => {
    const listAccessibleCustomers = vi
      .fn<GoogleAdsCustomerReader["listAccessibleCustomers"]>()
      .mockRejectedValue(new GoogleAdsApiError(403));
    const handler = createGoogleAdsAccountsHandler({
      getCurrentUser: async () => ({
        id: "user-admin",
        email: "admin@example.test",
        role: "administrator",
      }),
      customerReader: { listAccessibleCustomers },
    });

    const response = await handler();

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ error: "google_ads_unavailable" });
  });

  it("requests authentication configuration when credentials are unavailable", async () => {
    const listAccessibleCustomers = vi
      .fn<GoogleAdsCustomerReader["listAccessibleCustomers"]>()
      .mockRejectedValue(new GoogleAdsAuthenticationError());
    const handler = createGoogleAdsAccountsHandler({
      getCurrentUser: async () => ({
        id: "user-admin",
        email: "admin@example.test",
        role: "administrator",
      }),
      customerReader: { listAccessibleCustomers },
    });

    const response = await handler();

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      error: "google_ads_authentication_failed",
    });
  });
});
