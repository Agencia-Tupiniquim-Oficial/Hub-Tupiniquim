import type { UserRole } from "../../domain/authorization/authorization";

export type CurrentAppUser = {
  id: string;
  email: string;
  role: UserRole;
};

type AuthenticatedSupabaseUser = {
  id: string;
  email: string | null;
};

type CurrentAppUserDependencies = {
  getAuthenticatedUser: () => Promise<AuthenticatedSupabaseUser | null>;
  getProfileRole: (userId: string) => Promise<UserRole | null>;
};

export async function resolveCurrentAppUser({
  getAuthenticatedUser,
  getProfileRole,
}: CurrentAppUserDependencies): Promise<CurrentAppUser | null> {
  const user = await getAuthenticatedUser();
  if (!user?.email) {
    return null;
  }

  const role = await getProfileRole(user.id);
  if (!role) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    role,
  };
}
