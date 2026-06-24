import { db } from "@/lib/db/database";
import type {
	BeneficiariesData,
	ApplicationStatusData,
	ProgramUtilizationData,
} from "@/components/reports/types";

export type ReportType =
	| "beneficiaries"
	| "application-status"
	| "program-utilization";

export async function buildBeneficiariesData(): Promise<BeneficiariesData> {
	const beneficiaries = await db
		.selectFrom("beneficiary")
		.selectAll()
		.orderBy("lastName")
		.execute();

	return {
		report: {
			generated: new Date().toISOString().split("T")[0],
			total: beneficiaries.length,
		},
		beneficiaries: beneficiaries.map((b) => ({
			first: b.firstName,
			middle: b.middleName || "",
			last: b.lastName,
			gender: b.gender,
			contact: b.contactNumber,
			barangay: b.barangay,
			municipality: b.municipality,
			status: b.applicationStatus,
			registered: b.dateRegistered,
		})),
	};
}

export async function buildApplicationStatusData(): Promise<ApplicationStatusData> {
	const beneficiaries = await db
		.selectFrom("beneficiary")
		.selectAll()
		.orderBy("applicationStatus")
		.orderBy("lastName")
		.execute();

	const statuses = ["Pending", "Approved", "Rejected", "Released"];
	const groups = statuses
		.map((status) => {
			const filtered = beneficiaries.filter(
				(b) => b.applicationStatus === status,
			);
			return filtered.length > 0
				? {
						status,
						count: filtered.length,
						beneficiaries: filtered.map((b) => ({
							first: b.firstName,
							middle: b.middleName || "",
							last: b.lastName,
							barangay: b.barangay,
							municipality: b.municipality,
							registered: b.dateRegistered,
						})),
					}
				: null;
		})
		.filter(Boolean);

	return {
		report: {
			generated: new Date().toISOString().split("T")[0],
		},
		groups: groups as ApplicationStatusData["groups"],
	};
}

export async function buildProgramUtilizationData(): Promise<ProgramUtilizationData> {
	const programs = await db.selectFrom("program").selectAll().execute();

	const enrollments = await db
		.selectFrom("program_enrollment")
		.innerJoin(
			"beneficiary",
			"beneficiary.id",
			"program_enrollment.beneficiaryId",
		)
		.select([
			"program_enrollment.beneficiaryId",
			"program_enrollment.programId",
			"program_enrollment.status as enrollmentStatus",
			"beneficiary.applicationStatus",
			"beneficiary.firstName",
			"beneficiary.middleName",
			"beneficiary.lastName",
		])
		.execute();

	const releases = await db.selectFrom("benefit_release").selectAll().execute();

	let totalEnrollments = 0;
	let grandTotalReleases = 0;

	const programData = programs.map((prog) => {
		const progEnrollments = enrollments.filter((e) => e.programId === prog.id);
		const enrolled = progEnrollments.length;
		totalEnrollments += enrolled;

		const pending = progEnrollments.filter(
			(e) => e.applicationStatus === "Pending",
		).length;
		const approved = progEnrollments.filter(
			(e) =>
				e.applicationStatus === "Approved" ||
				e.applicationStatus === "Released",
		).length;

		const progReleases = releases.filter((r) => r.program === prog.name);
		const totalReleased = progReleases.reduce(
			(sum, r) => sum + Number(r.amount),
			0,
		);
		grandTotalReleases += totalReleased;

		const releaseItems = progReleases.map((r) => {
			const ben = enrollments.find((e) => e.beneficiaryId === r.beneficiaryId);
			return {
				beneficiary_first: ben?.firstName || "",
				beneficiary_last: ben?.lastName || "",
				beneficiary_middle: ben?.middleName || "",
				assistance_type: r.assistanceType,
				amount: Number(r.amount).toFixed(2),
				date: r.dateReleased,
			};
		});

		return {
			name: prog.name,
			enrolled,
			pending,
			approved,
			total_released: totalReleased.toFixed(2),
			releases: releaseItems,
		};
	});

	return {
		report: {
			generated: new Date().toISOString().split("T")[0],
			total_enrollments: totalEnrollments,
			total_releases: grandTotalReleases.toFixed(2),
		},
		programs: programData,
	};
}
