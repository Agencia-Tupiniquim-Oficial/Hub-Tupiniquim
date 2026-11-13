import { describe, expect, it, vi } from "vitest";
import { GoogleAdsAuthenticationError } from "../../application/google-ads/google-ads-customer-reader";
import {
  createGoogleAdsAccessTokenProvider,
  type GoogleAdsAccessTokenProviderDependencies,
} from "./google-ads-auth";

const environment = {
  GOOGLE_ADS_GCP_PROJECT_NUMBER: "123456789012",
  GOOGLE_ADS_SERVICE_ACCOUNT_EMAIL:
    "hub-readonly@example-project.iam.gserviceaccount.com",
  GOOGLE_ADS_WIF_POOL_ID: "vercel",
  GOOGLE_ADS_WIF_PROVIDER_ID: "vercel",
};

describe("Google Ads access token provider", () => {
  it("fails closed when Vercel federation configuration is missing", async () => {
    const getVercelOidcToken = vi.fn<() => Promise<string>>();
    const createExternalAccountClient =
      vi.fn<GoogleAdsAccessTokenProviderDependencies["createExternalAccountClient"]>();
    const provider = createGoogleAdsAccessTokenProvider({
      environment: {},
      getVercelOidcToken,
      createExternalAccountClient,
    });

    await expect(provider.getAccessToken()).rejects.toBeInstanceOf(
      GoogleAdsAuthenticationError,
    );
    expect(getVercelOidcToken).not.toHaveBeenCalled();
    expect(createExternalAccountClient).not.toHaveBeenCalled();
  });

  it("exchanges Vercel OIDC credentials for a Google Ads scoped access token", async () => {
    const getVercelOidcToken = vi
      .fn<() => Promise<string>>()
      .mockResolvedValue("synthetic-vercel-oidc-token");
    const createExternalAccountClient = vi
      .fn<GoogleAdsAccessTokenProviderDependencies["createExternalAccountClient"]>()
      .mockReturnValue({ getAccessToken: async () => ({ token: "synthetic-google-token" }) });
    const provider = createGoogleAdsAccessTokenProvider({
      environment,
      getVercelOidcToken,
      createExternalAccountClient,
    });

    await expect(provider.getAccessToken()).resolves.toBe("synthetic-google-token");
    expect(getVercelOidcToken).toHaveBeenCalledOnce();

    expect(createExternalAccountClient).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "external_account",
        audience:
          "//iam.googleapis.com/projects/123456789012/locations/global/workloadIdentityPools/vercel/providers/vercel",
        subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
        service_account_impersonation_url:
          "https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/hub-readonly@example-project.iam.gserviceaccount.com:generateAccessToken",
        scopes: ["https://www.googleapis.com/auth/adwords"],
        subject_token_supplier: {
          getSubjectToken: expect.any(Function),
        },
      }),
    );
  });

  it("rejects a federated credential response without an access token", async () => {
    const provider = createGoogleAdsAccessTokenProvider({
      environment,
      getVercelOidcToken: vi.fn<() => Promise<string>>().mockResolvedValue("synthetic-token"),
      createExternalAccountClient: vi
        .fn<GoogleAdsAccessTokenProviderDependencies["createExternalAccountClient"]>()
        .mockReturnValue({ getAccessToken: async () => ({ token: null }) }),
    });

    await expect(provider.getAccessToken()).rejects.toBeInstanceOf(
      GoogleAdsAuthenticationError,
    );
  });
});
