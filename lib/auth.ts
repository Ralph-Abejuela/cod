import { betterAuth } from "better-auth";
import { databaseDialect } from "./db/database";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
	database: {
		dialect: databaseDialect,
		type: "postgres",
	},
	emailAndPassword: {
		enabled: true,
		minPasswordLength: 6,
	},
	user: {
		additionalFields: {
			role: {
				type: "string",
				required: false,
				input: false,
			},
		},
	},
	plugins: [nextCookies()],
	databaseHooks: {
		user: {
			create: {
				before: async (user, ctx) => {
					return {
						data: {
							...user,
							role: ctx?.body?.role || "user",
						},
					};
				},
			},
		},
	},
});
