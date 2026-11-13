import { getCurrentAppUser } from "../../../../../server/infrastructure/auth/current-user";
import { googleAdsAccessTokenProvider } from "../../../../../server/infrastructure/google-ads/google-ads-auth";
import { createGoogleAdsCustomerReader } from "../../../../../server/infrastructure/google-ads/google-ads-rest-adapter";
import { createGoogleAdsAccountsHandler } from "./route-handler";

export const dynamic = "force-dynamic";

const customerReader = createGoogleAdsCustomerReader({
  accessTokenProvider: googleAdsAccessTokenProvider,
});

const handler = createGoogleAdsAccountsHandler({
  getCurrentUser: getCurrentAppUser,
  customerReader,
});

export const GET = handler;
