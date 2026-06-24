import { Pool } from "pg";

const pool = new Pool({
  connectionString: "postgres://postgres:admin123@localhost:5432/codex2026"
});

async function seed() {
  const targetId = "BNFY-2026-8403";
  
  // Check if it exists
  const res = await pool.query("SELECT * FROM beneficiary WHERE id = $1", [targetId]);
  if (res.rows.length === 0) {
    console.log("Inserting beneficiary...");
    await pool.query(`
      INSERT INTO beneficiary (id, "firstName", "lastName", "dateOfBirth", gender, "civilStatus", "contactNumber", barangay, municipality, province, "applicationStatus", "dateRegistered", "dateApproved", "approvedBy", "dateReleased")
      VALUES ($1, 'Juan', 'Dela Cruz', '1980-01-01', 'Male', 'Married', '09123456789', 'Barangay 1', 'Sample City', 'Sample Province', 'Released', '2026-01-15', '2026-01-20', 'Admin User', '2026-02-01')
    `, [targetId]);

    console.log("Inserting program enrollment...");
    await pool.query(`
      INSERT INTO program_enrollment ("beneficiaryId", "programId", "enrolledDate", status)
      VALUES ($1, '4ps', '2026-01-15', 'Active')
    `, [targetId]);
    
    await pool.query(`
      INSERT INTO program_enrollment ("beneficiaryId", "programId", "enrolledDate", status)
      VALUES ($1, 'aics', '2026-03-10', 'Active')
    `, [targetId]);

    console.log("Inserting releases...");
    await pool.query(`
      INSERT INTO benefit_release (id, "beneficiaryId", program, "assistanceType", amount, "dateReleased", "releasingOfficer", remarks)
      VALUES 
      ('REL-1001', $1, '4ps', 'Cash Subsidy', 3000, '2026-02-01', 'Admin User', 'First Tranche'),
      ('REL-1002', $1, '4ps', 'Cash Subsidy', 3000, '2026-04-01', 'Admin User', 'Second Tranche'),
      ('REL-1003', $1, 'aics', 'Medical Assistance', 5000, '2026-05-15', 'Admin User', 'Hospitalization support')
    `, [targetId]);
    
    console.log("Seeded successfully!");
  } else {
    console.log("Beneficiary already exists.");
  }
  
  await pool.end();
}

seed().catch(console.error);
