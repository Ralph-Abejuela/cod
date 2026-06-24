import { db } from "./database";
import { dummyBeneficiaries, dummyBenefitReleases, dummyClaims } from "../beneficiary-data";

async function seed() {
  console.log("Seeding database...");

  // Clear existing data
  await db.deleteFrom("claim").execute();
  await db.deleteFrom("benefit_release").execute();
  await db.deleteFrom("program_enrollment").execute();
  await db.deleteFrom("beneficiary").execute();

  // Insert beneficiaries
  for (const b of dummyBeneficiaries) {
    await db.insertInto("beneficiary").values({
      id: b.id,
      firstName: b.firstName,
      middleName: b.middleName || null,
      lastName: b.lastName,
      dateOfBirth: b.dateOfBirth,
      gender: b.gender,
      civilStatus: b.civilStatus,
      contactNumber: b.contactNumber,
      email: b.email || null,
      barangay: b.barangay,
      municipality: b.municipality,
      province: b.province,
      applicationStatus: b.applicationStatus,
      dateRegistered: b.dateRegistered,
      dateApproved: b.dateApproved || null,
      dateRejected: b.dateRejected || null,
      dateReleased: b.dateReleased || null,
      rejectionReason: b.rejectionReason || null,
      approvedBy: b.approvedBy || null,
    }).execute();

    // Insert program enrollments
    if (b.programs && b.programs.length > 0) {
      await db.insertInto("program_enrollment").values(
        b.programs.map((p) => ({
          beneficiaryId: b.id,
          program: p.program,
          enrolledDate: p.enrolledDate,
          status: p.status,
        }))
      ).execute();
    }
  }

  // Insert benefit releases
  if (dummyBenefitReleases.length > 0) {
    await db.insertInto("benefit_release").values(
      dummyBenefitReleases.map(r => ({
        ...r,
        remarks: r.remarks || null
      }))
    ).execute();
  }

  // Insert claims
  if (dummyClaims.length > 0) {
    await db.insertInto("claim").values(dummyClaims).execute();
  }

  console.log("Database seeding completed!");
}

seed().catch(console.error);
