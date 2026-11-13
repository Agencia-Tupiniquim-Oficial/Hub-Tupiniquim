import { z } from "zod";
import { resolveCurrentAppUser } from "@/server/application/auth/current-user";
import { createSupabaseServerClient } from "@/server/infrastructure/supabase/server";

const userRoleSchema = z.enum([
  "reader",
  "analyst",
  "approver",
  "administrator",
]);

export async function getCurrentAppUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError && authError.name !== "AuthSessionMissingError") {
    throw new Error("Unable to validate the Supabase session.", {
      cause: authError,
    });
  }

  if (!user) {
    return null;
  }

  return resolveCurrentAppUser({
    getAuthenticatedUser: async () => ({
      id: user.id,
      email: user.email ?? null,
    }),
    getProfileRole: async (userId) => {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        throw new Error("Unable to load the authenticated user's profile.", {
          cause: error,
        });
      }

      if (!profile) {
        return null;
      }

      const result = userRoleSchema.safeParse(profile.role);
      if (!result.success) {
        throw new Error("The authenticated user's profile has an invalid role.", {
          cause: result.error,
        });
      }

      return result.data;
    },
  });
}
