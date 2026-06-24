export const validRoles = {
	admin: "admin",
	staff: "staff",
} as const;

export type Role = keyof typeof validRoles;
