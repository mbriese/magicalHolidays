/**
 * Compute how we address the user based on their preference.
 * Formal: "Title + Lastname" (or just "Lastname" if no title) | Casual: "Firstname"
 * Default is formal (title + lastName).
 */
export type UserForDisplay = {
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  title?: string | null;
  displayPreference?: string | null;
};

export function getDisplayName(user: UserForDisplay): string {
  const preference = user.displayPreference ?? "formal";
  const first = (user.firstName ?? "").trim();
  const last = (user.lastName ?? "").trim();
  const title = (user.title ?? "").trim();

  if (preference === "formal" && last) {
    const prefix = title ? `${title} ` : "";
    return `${prefix}${last}`.trim();
  }
  if (first) return first;
  if (user.name) return user.name;
  return "Account";
}
