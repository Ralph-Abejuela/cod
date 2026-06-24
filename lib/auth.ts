import { betterAuth } from "better-auth";
import { databaseDialect } from "./db/database";
import { admin } from "better-auth/plugins";
import { ac, allRoles } from "./permissions";

export const auth = betterAuth({
   database: {
        dialect: databaseDialect,
        type: "postgres",
    },
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 6,
    },
    plugins: [admin({ac, roles: allRoles})]
});