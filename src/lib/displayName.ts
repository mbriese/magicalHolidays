export type UserForDisplay = {
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  title?: string | null;
  preferredName?: string | null;
  displayPreference?: string | null;
};

/**
 * Returns the name used to address the user throughout the app.
 * "preferredName" preference → use preferredName (falls back to firstName).
 * "firstName" preference (default) → use firstName.
 * Legacy "formal" → title + lastName.
 * Legacy "casual" → firstName.
 */
export function getDisplayName(user: UserForDisplay): string {
  const preference = user.displayPreference ?? "firstName";
  const first = (user.firstName ?? "").trim();
  const last = (user.lastName ?? "").trim();
  const preferred = (user.preferredName ?? "").trim();

  if (preference === "preferredName" && preferred) return preferred;
  if (preference === "preferredName" && first) return first;
  if (preference === "firstName" && first) return first;

  // Legacy formal/casual support
  if (preference === "formal" && last) {
    const title = (user.title ?? "").trim();
    return title ? `${title} ${last}` : last;
  }
  if (preference === "casual" && first) return first;

  if (first) return first;
  if (user.name) return user.name;
  return "Account";
}
