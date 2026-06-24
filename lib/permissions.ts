export const validRoles = {
	admin: "admin",
	staff: "staff",
	user: "user",
} as const;

export type Role = keyof typeof validRoles;
