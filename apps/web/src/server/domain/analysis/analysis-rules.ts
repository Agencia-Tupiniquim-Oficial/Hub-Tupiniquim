export type CampaignEvidenceInput = {
  qualifiedLeadCount: number;
  minimumSampleSize: number;
};

export type CampaignEvidenceAssessment = {
  sampleStatus: "insufficient_sample" | "ready_for_review";
  sampleSize: number;
  requiredSampleSize: number;
};

export type RecommendationArea = "CAMPAIGN" | "SITE" | "SALES_PROCESS";

export type Recommendation = {
  area: RecommendationArea;
  summary: string;
};

export type RecommendationsByArea = Record<RecommendationArea, Recommendation[]>;

export function assessCampaignEvidence(
  input: CampaignEvidenceInput,
): CampaignEvidenceAssessment {
  if (!Number.isSafeInteger(input.qualifiedLeadCount) || input.qualifiedLeadCount < 0) {
    throw new RangeError("qualifiedLeadCount must be a non-negative integer");
  }

  if (!Number.isSafeInteger(input.minimumSampleSize) || input.minimumSampleSize < 1) {
    throw new RangeError("minimumSampleSize must be a positive integer");
  }

  return {
    sampleStatus:
      input.qualifiedLeadCount < input.minimumSampleSize
        ? "insufficient_sample"
        : "ready_for_review",
    sampleSize: input.qualifiedLeadCount,
    requiredSampleSize: input.minimumSampleSize,
  };
}

export function groupRecommendationsByArea(
  recommendations: readonly Recommendation[],
): RecommendationsByArea {
  const grouped: RecommendationsByArea = {
    CAMPAIGN: [],
    SITE: [],
    SALES_PROCESS: [],
  };

  for (const recommendation of recommendations) {
    grouped[recommendation.area].push(recommendation);
  }

  return grouped;
}
