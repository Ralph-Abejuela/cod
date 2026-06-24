import type { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	// Create program table
	await db.schema
		.createTable("program")
		.addColumn("id", "varchar(50)", (col) => col.primaryKey())
		.addColumn("name", "varchar(255)", (col) => col.notNull())
		.addColumn("description", "text")
		.execute();

	// Seed programs
	await db
		.insertInto("program")
		.values([
			{
				id: "4ps",
				name: "4Ps",
				description: "Pantawid Pamilyang Pilipino Program",
			},
			{
				id: "senior-citizen",
				name: "Senior Citizen",
				description: "Senior Citizen Benefits and Pension",
			},
			{
				id: "pwd",
				name: "PWD",
				description: "Persons with Disabilities Support",
			},
			{
				id: "solo-parent",
				name: "Solo Parent",
				description: "Solo Parent Welfare Program",
			},
			{
				id: "tupad",
				name: "TUPAD",
				description:
					"Tulong Panghanapbuhay para sa Ating Disadvantaged/Displaced Workers",
			},
			{
				id: "aics",
				name: "AICS",
				description: "Assistance to Individuals in Crisis Situation",
			},
			{
				id: "hololive",
				name: "HOLOLIVE",
				description: "Assistance to Hololive Fans",
			},
		])
		.onConflict((oc) => oc.doNothing())
		.execute();

	// Recreate program_enrollment with programId FK
	await db.schema.dropTable("program_enrollment").execute();

	await db.schema
		.createTable("program_enrollment")
		.addColumn("id", "serial", (col) => col.primaryKey())
		.addColumn("beneficiaryId", "varchar(255)", (col) =>
			col.references("beneficiary.id").onDelete("cascade").notNull(),
		)
		.addColumn("programId", "varchar(50)", (col) =>
			col.references("program.id").onDelete("cascade").notNull(),
		)
		.addColumn("enrolledDate", "varchar(255)", (col) => col.notNull())
		.addColumn("status", "varchar(50)", (col) => col.notNull())
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("program_enrollment").ifExists().execute();

	await db.schema
		.createTable("program_enrollment")
		.addColumn("id", "serial", (col) => col.primaryKey())
		.addColumn("beneficiaryId", "varchar(255)", (col) =>
			col.references("beneficiary.id").onDelete("cascade").notNull(),
		)
		.addColumn("program", "varchar(100)", (col) => col.notNull())
		.addColumn("enrolledDate", "varchar(255)", (col) => col.notNull())
		.addColumn("status", "varchar(50)", (col) => col.notNull())
		.execute();

	await db.schema.dropTable("program").ifExists().execute();
}
