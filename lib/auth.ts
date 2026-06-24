import { betterAuth } from "better-auth";
import { databaseDialect } from "./db/database";

export const auth = betterAuth({
   database: {
        dialect: databaseDialect,
        type: "postgres",
    },
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 6,
    },
});