// @ts-nocheck
import { defineConfig } from "kysely-ctl";
import dotenv from "dotenv";
import { databaseDialect } from "../lib/db/database";

dotenv.config();

export default defineConfig({
	// replace me with a real dialect instance OR a dialect name + `dialectConfig` prop.
	dialect: databaseDialect,
	migrations: {
		migrationFolder: "lib/db/migrations",
	},
	//   plugins: [],
	seeds: {
		seedFolder: "lib/db/seeds",
	},
});
