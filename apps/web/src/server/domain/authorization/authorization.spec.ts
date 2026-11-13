import { describe, expect, it } from "vitest";
import { authorizeClientAction } from "./authorization";

describe("authorizeClientAction", () => {
  it("allows a reader to view data for an assigned client", () => {
    expect(
      authorizeClientAction({
        user: { id: "reader-1", role: "reader", clientIds: ["client-a"] },
        clientId: "client-a",
        action: "read_client_data",
      }),
    ).toEqual({ allowed: true });
  });

  it("does not allow a reader to create a draft", () => {
    expect(
      authorizeClientAction({
        user: { id: "reader-1", role: "reader", clientIds: ["client-a"] },
        clientId: "client-a",
        action: "create_draft",
      }),
    ).toEqual({ allowed: false, reason: "permission_denied" });
  });

  it("allows an analyst to create a draft but not approve it", () => {
    const user = { id: "analyst-1", role: "analyst" as const, clientIds: ["client-a"] };

    expect(
      authorizeClientAction({
        user,
        clientId: "client-a",
        action: "create_draft",
      }),
    ).toEqual({ allowed: true });

    expect(
      authorizeClientAction({
        user,
        clientId: "client-a",
        action: "approve_draft",
        draftCreatorId: "another-user",
      }),
    ).toEqual({ allowed: false, reason: "permission_denied" });
  });

  it("allows an assigned approver to approve another user's draft", () => {
    expect(
      authorizeClientAction({
        user: { id: "approver-1", role: "approver", clientIds: ["client-a"] },
        clientId: "client-a",
        action: "approve_draft",
        draftCreatorId: "analyst-1",
      }),
    ).toEqual({ allowed: true });
  });

  it("prevents an approver from approving their own draft", () => {
    expect(
      authorizeClientAction({
        user: { id: "approver-1", role: "approver", clientIds: ["client-a"] },
        clientId: "client-a",
        action: "approve_draft",
        draftCreatorId: "approver-1",
      }),
    ).toEqual({ allowed: false, reason: "self_approval" });
  });

  it("requires explicit client assignment even for administrators", () => {
    expect(
      authorizeClientAction({
        user: { id: "admin-1", role: "administrator", clientIds: [] },
        clientId: "client-a",
        action: "manage_client",
      }),
    ).toEqual({ allowed: false, reason: "client_not_assigned" });
  });

  it("denies access to another client even when the user has a different assignment", () => {
    expect(
      authorizeClientAction({
        user: { id: "analyst-1", role: "analyst", clientIds: ["client-a"] },
        clientId: "client-b",
        action: "read_client_data",
      }),
    ).toEqual({ allowed: false, reason: "client_not_assigned" });
  });

  it("allows an assigned administrator to manage the client", () => {
    expect(
      authorizeClientAction({
        user: { id: "admin-1", role: "administrator", clientIds: ["client-a"] },
        clientId: "client-a",
        action: "manage_client",
      }),
    ).toEqual({ allowed: true });
  });
});
