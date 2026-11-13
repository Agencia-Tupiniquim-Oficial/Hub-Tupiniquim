import { describe, expect, it, vi } from "vitest";
import { resolveCurrentAppUser } from "./current-user";

describe("resolveCurrentAppUser", () => {
  it("returns no app user when Supabase has no authenticated user", async () => {
    const resolveRole = vi.fn().mockResolvedValue("administrator");

    await expect(
      resolveCurrentAppUser({
        getAuthenticatedUser: async () => null,
        getProfileRole: resolveRole,
      }),
    ).resolves.toBeNull();
  });

  it("fails closed when the authenticated user has no provisioned profile", async () => {
    await expect(
      resolveCurrentAppUser({
        getAuthenticatedUser: async () => ({
          id: "user-123",
          email: "admin@example.test",
        }),
        getProfileRole: async () => null,
      }),
    ).resolves.toBeNull();
  });

  it("uses the role stored in the user's profile", async () => {
    await expect(
      resolveCurrentAppUser({
        getAuthenticatedUser: async () => ({
          id: "user-123",
          email: "admin@example.test",
        }),
        getProfileRole: async () => "administrator",
      }),
    ).resolves.toEqual({
      id: "user-123",
      email: "admin@example.test",
      role: "administrator",
    });
  });
});
