import { MENU_DATA } from "../utils/data";

export const ITEM_PER_PAGE = 10

export const getMenuForRole = (userRole: string) => {
  return MENU_DATA.filter((item) => item.visible.includes(userRole));
};

export function getInitials(name?: string): string {
  if (!name || !name.trim()) return "U";
  return name.trim().charAt(0).toUpperCase();
}

export const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
