import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Beneficiary table
  await db.schema
    .createTable('beneficiary')
    .addColumn('id', 'varchar(255)', (col) => col.primaryKey())
    .addColumn('firstName', 'varchar(255)', (col) => col.notNull())
    .addColumn('middleName', 'varchar(255)')
    .addColumn('lastName', 'varchar(255)', (col) => col.notNull())
    .addColumn('dateOfBirth', 'varchar(255)', (col) => col.notNull())
    .addColumn('gender', 'varchar(50)', (col) => col.notNull())
    .addColumn('civilStatus', 'varchar(50)', (col) => col.notNull())
    .addColumn('contactNumber', 'varchar(50)', (col) => col.notNull())
    .addColumn('email', 'varchar(255)')
    .addColumn('barangay', 'varchar(255)', (col) => col.notNull())
    .addColumn('municipality', 'varchar(255)', (col) => col.notNull())
    .addColumn('province', 'varchar(255)', (col) => col.notNull())
    .addColumn('applicationStatus', 'varchar(50)', (col) => col.notNull())
    .addColumn('dateRegistered', 'varchar(255)', (col) => col.notNull())
    .addColumn('dateApproved', 'varchar(255)')
    .addColumn('dateRejected', 'varchar(255)')
    .addColumn('dateReleased', 'varchar(255)')
    .addColumn('rejectionReason', 'text')
    .addColumn('approvedBy', 'varchar(255)')
    .execute()

  // Program Enrollment table
  await db.schema
    .createTable('program_enrollment')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('beneficiaryId', 'varchar(255)', (col) => col.references('beneficiary.id').onDelete('cascade').notNull())
    .addColumn('program', 'varchar(100)', (col) => col.notNull())
    .addColumn('enrolledDate', 'varchar(255)', (col) => col.notNull())
    .addColumn('status', 'varchar(50)', (col) => col.notNull())
    .execute()

  // Benefit Release table
  await db.schema
    .createTable('benefit_release')
    .addColumn('id', 'varchar(255)', (col) => col.primaryKey())
    .addColumn('beneficiaryId', 'varchar(255)', (col) => col.references('beneficiary.id').onDelete('cascade').notNull())
    .addColumn('program', 'varchar(100)', (col) => col.notNull())
    .addColumn('assistanceType', 'varchar(255)', (col) => col.notNull())
    .addColumn('amount', 'integer', (col) => col.notNull())
    .addColumn('dateReleased', 'varchar(255)', (col) => col.notNull())
    .addColumn('releasingOfficer', 'varchar(255)', (col) => col.notNull())
    .addColumn('remarks', 'text')
    .execute()

  // Claim table (for backward compatibility)
  await db.schema
    .createTable('claim')
    .addColumn('id', 'varchar(255)', (col) => col.primaryKey())
    .addColumn('beneficiaryId', 'varchar(255)', (col) => col.references('beneficiary.id').onDelete('cascade').notNull())
    .addColumn('program', 'varchar(100)', (col) => col.notNull())
    .addColumn('description', 'text', (col) => col.notNull())
    .addColumn('amount', 'integer', (col) => col.notNull())
    .addColumn('dateClaimed', 'varchar(255)', (col) => col.notNull())
    .addColumn('status', 'varchar(50)', (col) => col.notNull())
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('claim').ifExists().execute()
  await db.schema.dropTable('benefit_release').ifExists().execute()
  await db.schema.dropTable('program_enrollment').ifExists().execute()
  await db.schema.dropTable('beneficiary').ifExists().execute()
}
