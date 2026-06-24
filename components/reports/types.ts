export interface BeneficiaryRow {
	first: string;
	middle: string;
	last: string;
	gender: string;
	contact: string;
	barangay: string;
	municipality: string;
	status: string;
	registered: string;
}

export interface BeneficiariesData {
	report: { generated: string; total: number };
	beneficiaries: BeneficiaryRow[];
}

export interface StatusGroup {
	status: string;
	count: number;
	beneficiaries: {
		first: string;
		middle: string;
		last: string;
		barangay: string;
		municipality: string;
		registered: string;
	}[];
}

export interface ApplicationStatusData {
	report: { generated: string };
	groups: StatusGroup[];
}

export interface ReleaseItem {
	beneficiary_first: string;
	beneficiary_last: string;
	beneficiary_middle: string;
	assistance_type: string;
	amount: string;
	date: string;
}

export interface ProgramRow {
	name: string;
	enrolled: number;
	pending: number;
	approved: number;
	total_released: string;
	releases: ReleaseItem[];
}

export interface ProgramUtilizationData {
	report: {
		generated: string;
		total_enrollments: number;
		total_releases: string;
	};
	programs: ProgramRow[];
}
