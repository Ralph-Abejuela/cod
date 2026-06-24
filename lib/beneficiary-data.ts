export type ApplicationStatus =
	| "Pending"
	| "Approved"
	| "Rejected"
	| "Released";

export interface ProgramItem {
	id: string;
	name: string;
	description: string | null;
}

export interface ProgramEnrollment {
	programId: string;
	enrolledDate: string;
	status: string;
}

export interface Beneficiary {
	id: string;
	firstName: string;
	middleName: string;
	lastName: string;
	dateOfBirth: string;
	gender: string;
	civilStatus: string;
	contactNumber: string;
	email: string;
	barangay: string;
	municipality: string;
	province: string;
	programs: ProgramEnrollment[];
	applicationStatus: ApplicationStatus;
	dateRegistered: string;
	dateApproved?: string;
	dateRejected?: string;
	dateReleased?: string;
	rejectionReason?: string;
	approvedBy?: string;
}

export interface BenefitRelease {
	id: string;
	beneficiaryId: string;
	program: string;
	assistanceType: string;
	amount: number;
	dateReleased: string;
	releasingOfficer: string;
	remarks: string | null;
}

export interface Claim {
	id: string;
	beneficiaryId: string;
	program: string;
	amount: number;
	description: string;
	status: string;
	dateClaimed: string;
}
