import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { databaseDialect, db } from "./db/database";
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
			},
		},
	},
	plugins: [nextCookies()],
	databaseHooks: {
		user: {
			create: {
				before: async (user, ctx) => {
					const requestedRole = ctx?.body?.role || "user";

					if (requestedRole === "admin") {
						const existingAdmins = await db
							.selectFrom("user")
							.selectAll()
							.where("role", "=", "admin")
							.limit(1)
							.execute();

						if (existingAdmins.length > 0) {
							throw new APIError("BAD_REQUEST", {
								message:
									"An admin user already exists. Cannot create another admin.",
							});
						}
					}

					return {
						data: {
							...user,
							role: requestedRole,
						},
					};
				},
			},
		},
	},
});
