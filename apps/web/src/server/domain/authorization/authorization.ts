export type UserRole = "reader" | "analyst" | "approver" | "administrator";

export type ClientAction =
  | "read_client_data"
  | "use_chat"
  | "generate_report"
  | "create_draft"
  | "approve_draft"
  | "manage_client";

export type UserAccess = {
  id: string;
  role: UserRole;
  clientIds: readonly string[];
};

type AuthorizationRequestBase = {
  user: UserAccess;
  clientId: string;
};

export type AuthorizationRequest =
  | (AuthorizationRequestBase & {
      action: Exclude<ClientAction, "approve_draft">;
    })
  | (AuthorizationRequestBase & {
      action: "approve_draft";
      draftCreatorId: string;
    });

export type AuthorizationDecision =
  | { allowed: true }
  | {
      allowed: false;
      reason: "client_not_assigned" | "permission_denied" | "self_approval";
    };

const permissionsByRole: Record<UserRole, readonly ClientAction[]> = {
  reader: ["read_client_data"],
  analyst: ["read_client_data", "use_chat", "generate_report", "create_draft"],
  approver: ["read_client_data", "approve_draft"],
  administrator: ["read_client_data", "manage_client"],
};

export function authorizeClientAction(
  request: AuthorizationRequest,
): AuthorizationDecision {
  if (!request.user.clientIds.includes(request.clientId)) {
    return { allowed: false, reason: "client_not_assigned" };
  }

  if (!permissionsByRole[request.user.role].includes(request.action)) {
    return { allowed: false, reason: "permission_denied" };
  }

  if (
    request.action === "approve_draft" &&
    request.draftCreatorId === request.user.id
  ) {
    return { allowed: false, reason: "self_approval" };
  }

  return { allowed: true };
}
