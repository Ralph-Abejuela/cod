// ---------------------------------------------------------------------------
// Beneficiary types and dummy data
// Structured to map 1:1 to a future Kysely "beneficiaries" table.
// ---------------------------------------------------------------------------

export type ProgramType =
  | "4Ps"
  | "Senior Citizen"
  | "PWD"
  | "Solo Parent"
  | "TUPAD"
  | "AICS";

// Application workflow: Pending → Approved → Released (or Rejected)
export type ApplicationStatus = "Pending" | "Approved" | "Rejected" | "Released";

export type EnrollmentStatus = "Enrolled" | "Claimed" | "Eligible";

export type ClaimStatus = "Completed" | "Processing" | "Pending";

export interface ProgramEnrollment {
  program: ProgramType;
  enrolledDate: string;
  status: EnrollmentStatus;
}

export interface Claim {
  id: string;
  beneficiaryId: string;
  program: ProgramType;
  description: string;
  amount: number;
  dateClaimed: string;
  status: ClaimStatus;
}

// New: tracks each benefit release with releasing officer details
export interface BenefitRelease {
  id: string;
  beneficiaryId: string;
  program: ProgramType;
  assistanceType: string; // e.g. "Cash Aid", "Food Pack", "Educational Subsidy"
  amount: number;
  dateReleased: string;
  releasingOfficer: string; // e.g. "Dir. Ana Reyes"
  remarks: string;
}

export interface Beneficiary {
  id: string; // e.g. "BNFY-2026-0001"
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "Male" | "Female";
  civilStatus: "Single" | "Married" | "Widowed" | "Separated";
  contactNumber: string;
  email: string;
  // Address
  barangay: string;
  municipality: string;
  province: string;
  // Programs & status
  programs: ProgramEnrollment[];
  applicationStatus: ApplicationStatus;
  dateRegistered: string;
  // Admin fields
  dateApproved?: string;
  dateRejected?: string;
  dateReleased?: string;
  rejectionReason?: string;
  approvedBy?: string;
}

// ---------------------------------------------------------------------------
// Helper: generate initials from name
// ---------------------------------------------------------------------------
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

// ---------------------------------------------------------------------------
// All available programs
// ---------------------------------------------------------------------------
export const ALL_PROGRAMS: ProgramType[] = [
  "4Ps",
  "Senior Citizen",
  "PWD",
  "Solo Parent",
  "TUPAD",
  "AICS",
];

// ---------------------------------------------------------------------------
// Dummy beneficiaries
// ---------------------------------------------------------------------------
export const dummyBeneficiaries: Beneficiary[] = [
  {
    id: "BNFY-2026-0001",
    firstName: "Maria",
    middleName: "Santos",
    lastName: "Dela Cruz",
    dateOfBirth: "1985-03-15",
    gender: "Female",
    civilStatus: "Married",
    contactNumber: "09171234567",
    email: "maria.delacruz@email.com",
    barangay: "Barangay San Isidro",
    municipality: "Quezon City",
    province: "Metro Manila",
    programs: [
      { program: "4Ps", enrolledDate: "2024-01-10", status: "Enrolled" },
      { program: "AICS", enrolledDate: "2025-06-20", status: "Claimed" },
    ],
    applicationStatus: "Released",
    dateRegistered: "2024-01-10",
    dateApproved: "2024-01-15",
    dateReleased: "2024-02-01",
    approvedBy: "Dir. Jose Manalo",
  },
  {
    id: "BNFY-2026-0002",
    firstName: "Juan",
    middleName: "Reyes",
    lastName: "Bautista",
    dateOfBirth: "1958-11-22",
    gender: "Male",
    civilStatus: "Widowed",
    contactNumber: "09289876543",
    email: "juan.bautista@email.com",
    barangay: "Barangay Poblacion",
    municipality: "Lipa",
    province: "Batangas",
    programs: [
      { program: "Senior Citizen", enrolledDate: "2023-07-01", status: "Enrolled" },
      { program: "AICS", enrolledDate: "2025-12-15", status: "Eligible" },
    ],
    applicationStatus: "Released",
    dateRegistered: "2023-07-01",
    dateApproved: "2023-07-10",
    dateReleased: "2023-08-01",
    approvedBy: "Dir. Ana Reyes",
  },
  {
    id: "BNFY-2026-0003",
    firstName: "Ana",
    middleName: "Lim",
    lastName: "Garcia",
    dateOfBirth: "1990-07-08",
    gender: "Female",
    civilStatus: "Single",
    contactNumber: "09351122334",
    email: "ana.garcia@email.com",
    barangay: "Barangay Malinta",
    municipality: "Valenzuela City",
    province: "Metro Manila",
    programs: [
      { program: "PWD", enrolledDate: "2024-05-18", status: "Enrolled" },
    ],
    applicationStatus: "Approved",
    dateRegistered: "2024-05-18",
    dateApproved: "2024-05-25",
    approvedBy: "Dir. Jose Manalo",
  },
  {
    id: "BNFY-2026-0004",
    firstName: "Carlos",
    middleName: "Tan",
    lastName: "Villanueva",
    dateOfBirth: "1978-01-30",
    gender: "Male",
    civilStatus: "Separated",
    contactNumber: "09465544332",
    email: "carlos.villanueva@email.com",
    barangay: "Barangay Tisa",
    municipality: "Cebu City",
    province: "Cebu",
    programs: [
      { program: "TUPAD", enrolledDate: "2025-03-01", status: "Claimed" },
      { program: "Solo Parent", enrolledDate: "2024-09-12", status: "Enrolled" },
    ],
    applicationStatus: "Released",
    dateRegistered: "2024-09-12",
    dateApproved: "2024-09-20",
    dateReleased: "2024-10-05",
    approvedBy: "Dir. Ana Reyes",
  },
  {
    id: "BNFY-2026-0005",
    firstName: "Liza",
    middleName: "Aquino",
    lastName: "Mendoza",
    dateOfBirth: "1995-12-03",
    gender: "Female",
    civilStatus: "Married",
    contactNumber: "09187766554",
    email: "liza.mendoza@email.com",
    barangay: "Barangay San Roque",
    municipality: "Marikina City",
    province: "Metro Manila",
    programs: [
      { program: "4Ps", enrolledDate: "2025-01-20", status: "Enrolled" },
      { program: "AICS", enrolledDate: "2025-08-10", status: "Eligible" },
    ],
    applicationStatus: "Pending",
    dateRegistered: "2025-01-20",
  },
  {
    id: "BNFY-2026-0006",
    firstName: "Roberto",
    middleName: "Cruz",
    lastName: "Pascual",
    dateOfBirth: "1962-05-17",
    gender: "Male",
    civilStatus: "Married",
    contactNumber: "09273344556",
    email: "roberto.pascual@email.com",
    barangay: "Barangay Ilaya",
    municipality: "Davao City",
    province: "Davao del Sur",
    programs: [
      { program: "Senior Citizen", enrolledDate: "2022-11-05", status: "Enrolled" },
      { program: "PWD", enrolledDate: "2023-04-22", status: "Enrolled" },
      { program: "AICS", enrolledDate: "2024-02-14", status: "Claimed" },
    ],
    applicationStatus: "Rejected",
    dateRegistered: "2022-11-05",
    dateRejected: "2022-11-20",
    rejectionReason: "Incomplete documentation — missing PWD certificate",
  },
];

// ---------------------------------------------------------------------------
// Dummy benefit releases
// ---------------------------------------------------------------------------
export const dummyBenefitReleases: BenefitRelease[] = [
  {
    id: "REL-001",
    beneficiaryId: "BNFY-2026-0001",
    program: "4Ps",
    assistanceType: "Educational Subsidy",
    amount: 3000,
    dateReleased: "2024-06-15",
    releasingOfficer: "Dir. Jose Manalo",
    remarks: "SY 2024-2025 educational grant for 2 children",
  },
  {
    id: "REL-002",
    beneficiaryId: "BNFY-2026-0001",
    program: "AICS",
    assistanceType: "Medical Assistance",
    amount: 5000,
    dateReleased: "2025-08-20",
    releasingOfficer: "Engr. Pedro Santos",
    remarks: "Hospitalization assistance — confinement at QC General Hospital",
  },
  {
    id: "REL-003",
    beneficiaryId: "BNFY-2026-0001",
    program: "4Ps",
    assistanceType: "Cash Aid",
    amount: 2500,
    dateReleased: "2025-12-10",
    releasingOfficer: "Dir. Ana Reyes",
    remarks: "Health & nutrition monthly grant — December 2025",
  },
  {
    id: "REL-004",
    beneficiaryId: "BNFY-2026-0002",
    program: "Senior Citizen",
    assistanceType: "Monthly Pension",
    amount: 1000,
    dateReleased: "2026-06-01",
    releasingOfficer: "Dir. Ana Reyes",
    remarks: "Regular monthly pension — June 2026",
  },
  {
    id: "REL-005",
    beneficiaryId: "BNFY-2026-0002",
    program: "Senior Citizen",
    assistanceType: "Cash Aid",
    amount: 6000,
    dateReleased: "2025-12-20",
    releasingOfficer: "Dir. Jose Manalo",
    remarks: "Senior citizen Christmas bonus",
  },
  {
    id: "REL-006",
    beneficiaryId: "BNFY-2026-0004",
    program: "TUPAD",
    assistanceType: "Emergency Employment",
    amount: 4130,
    dateReleased: "2025-04-15",
    releasingOfficer: "Engr. Pedro Santos",
    remarks: "TUPAD wages — 10 days emergency employment, Brgy. Tisa cleanup",
  },
  {
    id: "REL-007",
    beneficiaryId: "BNFY-2026-0004",
    program: "Solo Parent",
    assistanceType: "Cash Aid",
    amount: 1500,
    dateReleased: "2026-03-15",
    releasingOfficer: "Dir. Ana Reyes",
    remarks: "Solo parent quarterly allowance — Q1 2026",
  },
];

// ---------------------------------------------------------------------------
// Dummy claims (kept for backward compatibility)
// ---------------------------------------------------------------------------
export const dummyClaims: Claim[] = [
  {
    id: "CLM-001",
    beneficiaryId: "BNFY-2026-0001",
    program: "4Ps",
    description: "Educational Assistance — SY 2025-2026",
    amount: 3000,
    dateClaimed: "2025-06-15",
    status: "Completed",
  },
  {
    id: "CLM-002",
    beneficiaryId: "BNFY-2026-0001",
    program: "AICS",
    description: "Medical Assistance — Hospitalization",
    amount: 5000,
    dateClaimed: "2025-08-20",
    status: "Completed",
  },
  {
    id: "CLM-003",
    beneficiaryId: "BNFY-2026-0002",
    program: "Senior Citizen",
    description: "Monthly Pension — June 2026",
    amount: 1000,
    dateClaimed: "2026-06-01",
    status: "Completed",
  },
  {
    id: "CLM-004",
    beneficiaryId: "BNFY-2026-0004",
    program: "TUPAD",
    description: "Emergency Employment — 10 days",
    amount: 4130,
    dateClaimed: "2025-04-01",
    status: "Completed",
  },
  {
    id: "CLM-005",
    beneficiaryId: "BNFY-2026-0004",
    program: "Solo Parent",
    description: "Solo Parent Allowance — Q1 2026",
    amount: 1500,
    dateClaimed: "2026-03-15",
    status: "Completed",
  },
];

// ---------------------------------------------------------------------------
// Lookup helpers (replace with Kysely queries later)
// ---------------------------------------------------------------------------
export function getBeneficiaryById(id: string): Beneficiary | undefined {
  return dummyBeneficiaries.find((b) => b.id === id);
}

export function getClaimsForBeneficiary(beneficiaryId: string): Claim[] {
  return dummyClaims.filter((c) => c.beneficiaryId === beneficiaryId);
}

export function getReleasesForBeneficiary(beneficiaryId: string): BenefitRelease[] {
  return dummyBenefitReleases.filter((r) => r.beneficiaryId === beneficiaryId);
}

export function getTotalReleasedAmount(beneficiaryId: string): number {
  return getReleasesForBeneficiary(beneficiaryId).reduce(
    (sum, r) => sum + r.amount,
    0
  );
}

/**
 * Verify beneficiary identity: control number + last name must match.
 * Returns the beneficiary if verified, undefined otherwise.
 */
export function verifyBeneficiary(
  controlNumber: string,
  lastName: string
): Beneficiary | undefined {
  const normalized = controlNumber.trim().toUpperCase();
  const lastNorm = lastName.trim().toLowerCase();
  return dummyBeneficiaries.find(
    (b) =>
      b.id.toUpperCase() === normalized &&
      b.lastName.toLowerCase() === lastNorm
  );
}
