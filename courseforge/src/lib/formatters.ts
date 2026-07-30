/**
 * Formats user emails into clean, human-readable display names
 */
export function formatInstructorName(email: string | undefined | null): string {
  if (!email) return "Instructor";
  
  const lowerEmail = email.toLowerCase();
  
  if (lowerEmail.includes("muhammad.abdullah") || lowerEmail.includes("muhammad_abdullah")) {
    return "Muhammad Abdullah";
  }

  const prefix = email.split("@")[0] || "Instructor";
  
  // Format emails like rehmoz.rana or afnan.ahmad into "Rehmoz Rana", "Afnan Ahmad"
  return prefix
    .split(/[._-]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
