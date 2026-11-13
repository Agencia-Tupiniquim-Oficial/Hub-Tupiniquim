import { describe, expect, it, vi } from "vitest";
import { signInWithPassword } from "./sign-in";

describe("signInWithPassword", () => {
  it("accepts valid credentials", async () => {
    const authenticate = vi.fn().mockResolvedValue({ error: null });

    await expect(
      signInWithPassword({ signInWithPassword: authenticate }, "admin@example.test", "valid-password"),
    ).resolves.toEqual({ authenticated: true });
  });

  it("rejects invalid credentials without exposing provider details", async () => {
    const authenticate = vi
      .fn()
      .mockResolvedValue({ error: new Error("provider-specific authentication details") });

    await expect(
      signInWithPassword({ signInWithPassword: authenticate }, "admin@example.test", "wrong-password"),
    ).resolves.toEqual({ authenticated: false });
  });
});
