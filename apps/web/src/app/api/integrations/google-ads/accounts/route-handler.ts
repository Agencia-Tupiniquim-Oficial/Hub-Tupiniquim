import {
  GoogleAdsAuthenticationError,
  GoogleAdsApiError,
  type GoogleAdsCustomerReader,
} from "../../../../../server/application/google-ads/google-ads-customer-reader";
import type { CurrentAppUser } from "../../../../../server/application/auth/current-user";

type GoogleAdsAccountsHandlerDependencies = {
  getCurrentUser: () => Promise<CurrentAppUser | null>;
  customerReader: GoogleAdsCustomerReader;
};

export function createGoogleAdsAccountsHandler({
  getCurrentUser,
  customerReader,
}: GoogleAdsAccountsHandlerDependencies): () => Promise<Response> {
  return async function getGoogleAdsAccounts(): Promise<Response> {
    const user = await getCurrentUser();

    if (!user?.email) {
      return Response.json(
        { error: "unauthorized" },
        { status: 401, headers: { "Cache-Control": "no-store" } },
      );
    }

    if (user.role !== "administrator") {
      return Response.json(
        { error: "forbidden" },
        { status: 403, headers: { "Cache-Control": "no-store" } },
      );
    }

    try {
      const accounts = await customerReader.listAccessibleCustomers();
      return Response.json(
        { accounts },
        { headers: { "Cache-Control": "no-store" } },
      );
    } catch (error) {
      if (error instanceof GoogleAdsAuthenticationError) {
        return Response.json(
          { error: "google_ads_authentication_failed" },
          { status: 503, headers: { "Cache-Control": "no-store" } },
        );
      }

      if (error instanceof GoogleAdsApiError) {
        return Response.json(
          { error: "google_ads_unavailable" },
          { status: 502, headers: { "Cache-Control": "no-store" } },
        );
      }

      throw error;
    }
  };
}
