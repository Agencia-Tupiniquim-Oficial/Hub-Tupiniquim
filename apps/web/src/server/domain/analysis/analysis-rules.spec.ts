import { describe, expect, it } from "vitest";
import {
  assessCampaignEvidence,
  groupRecommendationsByArea,
} from "./analysis-rules";
import type { Recommendation } from "./analysis-rules";

describe("assessCampaignEvidence", () => {
  it("marca a evidência como insuficiente abaixo da amostra mínima", () => {
    const assessment = assessCampaignEvidence({
      qualifiedLeadCount: 4,
      minimumSampleSize: 5,
    });

    expect(assessment.sampleStatus).toBe("insufficient_sample");
  });

  it("libera a evidência para revisão no limite sem declarar uma vencedora", () => {
    expect(
      assessCampaignEvidence({
        qualifiedLeadCount: 5,
        minimumSampleSize: 5,
      }),
    ).toEqual({
      sampleStatus: "ready_for_review",
      sampleSize: 5,
      requiredSampleSize: 5,
    });
  });

  it("rejeita uma amostra mínima que não seja um inteiro positivo", () => {
    expect(() =>
      assessCampaignEvidence({
        qualifiedLeadCount: 4,
        minimumSampleSize: 0,
      }),
    ).toThrow(RangeError);
  });

  it("rejeita uma quantidade de contatos qualificados negativa", () => {
    expect(() =>
      assessCampaignEvidence({
        qualifiedLeadCount: -1,
        minimumSampleSize: 5,
      }),
    ).toThrow(RangeError);
  });
});

describe("groupRecommendationsByArea", () => {
  it("mantém recomendações separadas por campanha, site e processo comercial", () => {
    const recommendations: readonly Recommendation[] = [
      { area: "SITE", summary: "Validar os formulários" },
      { area: "CAMPAIGN", summary: "Revisar termos de busca" },
      { area: "SALES_PROCESS", summary: "Classificar os contatos" },
    ];

    expect(groupRecommendationsByArea(recommendations)).toEqual({
      CAMPAIGN: [{ area: "CAMPAIGN", summary: "Revisar termos de busca" }],
      SITE: [{ area: "SITE", summary: "Validar os formulários" }],
      SALES_PROCESS: [{ area: "SALES_PROCESS", summary: "Classificar os contatos" }],
    });
  });
});
