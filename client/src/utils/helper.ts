export function getInitials(name?: string): string {
  if (!name || !name.trim()) return "U";
  return name.trim().charAt(0).toUpperCase();
}

export const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};