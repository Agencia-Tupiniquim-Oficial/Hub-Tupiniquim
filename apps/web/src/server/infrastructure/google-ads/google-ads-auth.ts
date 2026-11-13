import { getVercelOidcToken } from "@vercel/oidc";
import { ExternalAccountClient } from "google-auth-library";
import { z } from "zod";
import { GoogleAdsAuthenticationError } from "../../application/google-ads/google-ads-customer-reader";

const googleAdsScope = "https://www.googleapis.com/auth/adwords";

const environmentSchema = z.object({
  GOOGLE_ADS_GCP_PROJECT_NUMBER: z.string().regex(/^\d+$/),
  GOOGLE_ADS_SERVICE_ACCOUNT_EMAIL: z
    .string()
    .email()
    .refine((email) => email.endsWith(".iam.gserviceaccount.com")),
  GOOGLE_ADS_WIF_POOL_ID: z.string().regex(/^[a-z][a-z0-9-]{3,31}$/),
  GOOGLE_ADS_WIF_PROVIDER_ID: z.string().regex(/^[a-z][a-z0-9-]{3,31}$/),
});

type GoogleAdsAccessTokenClient = {
  getAccessToken: () => Promise<{ token?: string | null }>;
};

export type GoogleAdsAccessTokenProviderDependencies = {
  environment: Readonly<Record<string, string | undefined>>;
  getVercelOidcToken: () => Promise<string>;
  createExternalAccountClient: (
    options: Parameters<typeof ExternalAccountClient.fromJSON>[0],
  ) => GoogleAdsAccessTokenClient | null;
};

export function createGoogleAdsAccessTokenProvider({
  environment,
  getVercelOidcToken: fetchVercelOidcToken,
  createExternalAccountClient,
}: GoogleAdsAccessTokenProviderDependencies) {
  return {
    async getAccessToken(): Promise<string> {
      const config = environmentSchema.safeParse(environment);
      if (!config.success) {
        throw new GoogleAdsAuthenticationError({ cause: config.error });
      }

      let vercelOidcToken: string;
      try {
        vercelOidcToken = await fetchVercelOidcToken();
      } catch (error) {
        throw new GoogleAdsAuthenticationError({ cause: error });
      }

      const {
        GOOGLE_ADS_GCP_PROJECT_NUMBER: projectNumber,
        GOOGLE_ADS_SERVICE_ACCOUNT_EMAIL: serviceAccountEmail,
        GOOGLE_ADS_WIF_POOL_ID: poolId,
        GOOGLE_ADS_WIF_PROVIDER_ID: providerId,
      } = config.data;

      let client: GoogleAdsAccessTokenClient | null;
      try {
        client = createExternalAccountClient({
          type: "external_account",
          audience: `//iam.googleapis.com/projects/${projectNumber}/locations/global/workloadIdentityPools/${poolId}/providers/${providerId}`,
          subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
          token_url: "https://sts.googleapis.com/v1/token",
          service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${serviceAccountEmail}:generateAccessToken`,
          subject_token_supplier: {
            getSubjectToken: async () => vercelOidcToken,
          },
          scopes: [googleAdsScope],
        });
      } catch (error) {
        throw new GoogleAdsAuthenticationError({ cause: error });
      }

      if (!client) {
        throw new GoogleAdsAuthenticationError();
      }

      try {
        const { token } = await client.getAccessToken();
        if (!token) {
          throw new GoogleAdsAuthenticationError();
        }

        return token;
      } catch (error) {
        if (error instanceof GoogleAdsAuthenticationError) {
          throw error;
        }

        throw new GoogleAdsAuthenticationError({ cause: error });
      }
    },
  };
}

export const googleAdsAccessTokenProvider = createGoogleAdsAccessTokenProvider({
  environment: process.env,
  getVercelOidcToken: () => getVercelOidcToken(),
  createExternalAccountClient: (options) =>
    ExternalAccountClient.fromJSON(options),
});
