import { z } from "zod";
import type {
  GoogleAdsCustomer,
  GoogleAdsCustomerReader,
} from "../../application/google-ads/google-ads-customer-reader";
import {
  GoogleAdsApiError,
  GoogleAdsAuthenticationError,
} from "../../application/google-ads/google-ads-customer-reader";

const accessibleCustomersResponseSchema = z.object({
  resourceNames: z.array(z.string().regex(/^customers\/\d{10}$/)),
});

type GoogleAdsAccessTokenProvider = {
  getAccessToken(): Promise<string>;
};

type GoogleAdsCustomerReaderDependencies = {
  accessTokenProvider: GoogleAdsAccessTokenProvider;
  fetcher?: typeof fetch;
};

export function createGoogleAdsCustomerReader({
  accessTokenProvider,
  fetcher = fetch,
}: GoogleAdsCustomerReaderDependencies): GoogleAdsCustomerReader {
  return {
    async listAccessibleCustomers(): Promise<readonly GoogleAdsCustomer[]> {
      const accessToken = await accessTokenProvider.getAccessToken();

      if (!accessToken.trim()) {
        throw new GoogleAdsAuthenticationError();
      }

      const response = await fetcher(
        "https://googleads.googleapis.com/v26/customers:listAccessibleCustomers",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new GoogleAdsApiError(response.status);
      }

      let payload: unknown;
      try {
        payload = await response.json();
      } catch (error) {
        if (error instanceof SyntaxError) {
          throw new GoogleAdsApiError(502);
        }

        throw error;
      }

      const result = accessibleCustomersResponseSchema.safeParse(payload);
      if (!result.success) {
        throw new GoogleAdsApiError(502);
      }

      return result.data.resourceNames.map((resourceName) => ({
        customerId: resourceName.slice("customers/".length),
      }));
    },
  };
}
