type PasswordAuthenticator = {
  signInWithPassword: (credentials: {
    email: string;
    password: string;
  }) => Promise<{ error: unknown | null }>;
};

export async function signInWithPassword(
  authenticator: PasswordAuthenticator,
  email: string,
  password: string,
): Promise<{ authenticated: boolean }> {
  const { error } = await authenticator.signInWithPassword({ email, password });

  return { authenticated: error === null };
}
