export type GoogleAdsCustomer = {
  customerId: string;
};

export interface GoogleAdsCustomerReader {
  listAccessibleCustomers(): Promise<readonly GoogleAdsCustomer[]>;
}

export class GoogleAdsApiError extends Error {
  constructor(readonly status: number) {
    super("Google Ads API request failed.");
    this.name = "GoogleAdsApiError";
  }
}

export class GoogleAdsAuthenticationError extends Error {
  constructor(options?: ErrorOptions) {
    super("Google Ads credentials did not provide an access token.", options);
    this.name = "GoogleAdsAuthenticationError";
  }
}
