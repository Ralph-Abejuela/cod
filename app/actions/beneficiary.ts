"use server";

import { db } from "@/lib/db/database";
import type {
	Beneficiary,
	ProgramEnrollment,
	BenefitRelease,
	ApplicationStatus,
	ProgramItem,
} from "@/lib/beneficiary-data";
import { revalidatePath } from "next/cache";

// Generate ID Helper
function generateBeneficiaryId() {
	const randomStr = Math.floor(Math.random() * 9000 + 1000).toString();
	return `BNFY-2026-${randomStr}`;
}

export async function getProgramsAction(): Promise<ProgramItem[]> {
	try {
		return await db.selectFrom("program").selectAll().execute();
	} catch (error) {
		console.error("Error fetching programs:", error);
		return [];
	}
}

export async function registerBeneficiaryAction(data: Omit<Beneficiary, "id">) {
	try {
		const id = generateBeneficiaryId();

		// Insert beneficiary
		await db
			.insertInto("beneficiary")
			.values({
				id,
				firstName: data.firstName,
				middleName: data.middleName || null,
				lastName: data.lastName,
				dateOfBirth: data.dateOfBirth,
				gender: data.gender,
				civilStatus: data.civilStatus,
				contactNumber: data.contactNumber,
				email: data.email || null,
				barangay: data.barangay,
				municipality: data.municipality,
				province: data.province,
				applicationStatus: data.applicationStatus,
				dateRegistered: data.dateRegistered,
			})
			.execute();

		// Insert program enrollment if exists
		if (data.programs && data.programs.length > 0) {
			await db
				.insertInto("program_enrollment")
				.values(
					data.programs.map((p) => ({
						beneficiaryId: id,
						programId: p.programId,
						enrolledDate: p.enrolledDate,
						status: p.status,
					})),
				)
				.execute();
		}

		revalidatePath("/admin/beneficiaries");
		revalidatePath("/dashboard");
		return { success: true, id };
	} catch (error) {
		console.error("Error registering beneficiary:", error);
		return { success: false, error: "Failed to register beneficiary." };
	}
}

export async function verifyAndGetBeneficiaryAction(
	controlNumber: string,
	lastName: string,
) {
	try {
		const b = await db
			.selectFrom("beneficiary")
			.selectAll()
			.where("id", "=", controlNumber.trim().toUpperCase())
			.executeTakeFirst();

		if (!b || b.lastName.toLowerCase() !== lastName.trim().toLowerCase()) {
			return null;
		}

		const programs = await db
			.selectFrom("program_enrollment")
			.selectAll()
			.where("beneficiaryId", "=", b.id)
			.execute();

		const releases = await db
			.selectFrom("benefit_release")
			.selectAll()
			.where("beneficiaryId", "=", b.id)
			.execute();

		return {
			beneficiary: {
				...b,
				programs: programs as ProgramEnrollment[],
			} as Beneficiary,
			releases: releases as BenefitRelease[],
		};
	} catch (error) {
		console.error("Error verifying beneficiary:", error);
		return null;
	}
}

export async function getBeneficiaryByIdAction(id: string) {
	try {
		const cleanId = decodeURIComponent(id).trim().toUpperCase();
		const b = await db
			.selectFrom("beneficiary")
			.selectAll()
			.where("id", "=", cleanId)
			.executeTakeFirst();

		if (!b) return null;

		const programs = await db
			.selectFrom("program_enrollment")
			.selectAll()
			.where("beneficiaryId", "=", cleanId)
			.execute();

		const releases = await db
			.selectFrom("benefit_release")
			.selectAll()
			.where("beneficiaryId", "=", cleanId)
			.execute();

		return {
			beneficiary: {
				...b,
				programs: programs as ProgramEnrollment[],
			} as Beneficiary,
			releases: releases as BenefitRelease[],
		};
	} catch (error) {
		console.error("Error fetching beneficiary:", error);
		return null;
	}
}

export async function getAdminBeneficiariesAction(): Promise<Beneficiary[]> {
	try {
		const beneficiaries = await db
			.selectFrom("beneficiary")
			.selectAll()
			.execute();
		const programs = await db
			.selectFrom("program_enrollment")
			.selectAll()
			.execute();

		return beneficiaries.map((b) => ({
			...b,
			middleName: b.middleName || "",
			email: b.email || "",
			dateApproved: b.dateApproved || undefined,
			dateRejected: b.dateRejected || undefined,
			dateReleased: b.dateReleased || undefined,
			rejectionReason: b.rejectionReason || undefined,
			approvedBy: b.approvedBy || undefined,
			programs: programs
				.filter((p) => p.beneficiaryId === b.id)
				.map((p) => ({
					programId: p.programId,
					enrolledDate: p.enrolledDate,
					status: p.status,
				})),
		})) as Beneficiary[];
	} catch (error) {
		console.error("Error fetching admin beneficiaries:", error);
		return [];
	}
}

export async function updateApplicationStatusAction(
	id: string,
	status: ApplicationStatus,
	reason?: string,
) {
	try {
		const now = new Date().toISOString().split("T")[0];
		const updatePayload: Record<string, unknown> = {
			applicationStatus: status,
		};

		if (status === "Approved") {
			updatePayload.dateApproved = now;
			updatePayload.approvedBy = "Admin User";
		} else if (status === "Rejected") {
			updatePayload.dateRejected = now;
			updatePayload.rejectionReason = reason;
		} else if (status === "Released") {
			updatePayload.dateReleased = now;
		}

		await db
			.updateTable("beneficiary")
			.set(updatePayload)
			.where("id", "=", id)
			.execute();

		revalidatePath("/admin/beneficiaries");
		revalidatePath("/dashboard");
		revalidatePath(`/beneficiary/track/${id}`);
		return { success: true };
	} catch (error) {
		console.error("Error updating status:", error);
		return { success: false, error: "Failed to update status." };
	}
}

export async function recordBenefitReleaseAction(
	data: Omit<BenefitRelease, "id">,
) {
	try {
		const randomStr = Math.floor(Math.random() * 900 + 100).toString();
		const id = `REL-${randomStr}`;

		await db
			.insertInto("benefit_release")
			.values({
				id,
				beneficiaryId: data.beneficiaryId,
				program: data.program,
				assistanceType: data.assistanceType,
				amount: data.amount,
				dateReleased: data.dateReleased,
				releasingOfficer: data.releasingOfficer,
				remarks: data.remarks || null,
			})
			.execute();

		// Mark beneficiary as released as well
		await db
			.updateTable("beneficiary")
			.set({
				applicationStatus: "Released",
				dateReleased: data.dateReleased,
			})
			.where("id", "=", data.beneficiaryId)
			.execute();

		revalidatePath("/admin/beneficiaries");
		revalidatePath("/dashboard");
		revalidatePath(`/beneficiary/track/${data.beneficiaryId}`);
		return { success: true };
	} catch (error) {
		console.error("Error recording release:", error);
		return { success: false, error: "Failed to record release." };
	}
}

export async function getDashboardStatsAction() {
	try {
		const totalBeneficiaries = await db
			.selectFrom("beneficiary")
			.select((eb) => eb.fn.count("id").as("count"))
			.executeTakeFirst();
		const activeApps = await db
			.selectFrom("beneficiary")
			.select((eb) => eb.fn.count("id").as("count"))
			.where("applicationStatus", "in", ["Pending", "Approved"])
			.executeTakeFirst();
		const pendingReviews = await db
			.selectFrom("beneficiary")
			.select((eb) => eb.fn.count("id").as("count"))
			.where("applicationStatus", "=", "Pending")
			.executeTakeFirst();
		const totalReleased = await db
			.selectFrom("benefit_release")
			.select((eb) => eb.fn.sum("amount").as("sum"))
			.executeTakeFirst();

		// program stats - join with program table to get display name
		const programCounts = await db
			.selectFrom("program_enrollment")
			.innerJoin("program", "program.id", "program_enrollment.programId")
			.select(["programId", "program.name"])
			.select((eb) => eb.fn.count("program_enrollment.id").as("count"))
			.groupBy(["programId", "program.name"])
			.execute();

		const pendingProgramCounts = await db
			.selectFrom("program_enrollment")
			.innerJoin(
				"beneficiary",
				"beneficiary.id",
				"program_enrollment.beneficiaryId",
			)
			.select(["programId"])
			.select((eb) => eb.fn.count("program_enrollment.id").as("count"))
			.where("beneficiary.applicationStatus", "=", "Pending")
			.groupBy("programId")
			.execute();

		return {
			totalBeneficiaries: Number(totalBeneficiaries?.count || 0),
			activeApps: Number(activeApps?.count || 0),
			pendingReviews: Number(pendingReviews?.count || 0),
			totalReleased: Number(totalReleased?.sum || 0),
			programs: programCounts.map((pc) => ({
				name: pc.name,
				count: Number(pc.count || 0),
				pending: Number(
					pendingProgramCounts.find((pp) => pp.programId === pc.programId)
						?.count || 0,
				),
			})),
		};
	} catch (error) {
		console.error("Error fetching dashboard stats:", error);
		return null;
	}
}

export async function globalSearchAction(query: string) {
	try {
		if (!query || query.trim() === "") return [];

		const searchStr = `%${query.toLowerCase()}%`;
		const searchStrUpper = `%${query.toUpperCase()}%`;

		// Search by ID, First Name, Last Name
		const results = await db
			.selectFrom("beneficiary")
			.selectAll()
			.where((eb) =>
				eb.or([
					eb("id", "like", searchStrUpper),
					eb("firstName", "ilike", searchStr),
					eb("lastName", "ilike", searchStr),
				]),
			)
			.limit(10)
			.execute();

		return results;
	} catch (error) {
		console.error("Error in global search:", error);
		return [];
	}
}

export async function updateBeneficiaryAction(
	id: string,
	data: Partial<Omit<Beneficiary, "id">>,
	programId?: string,
) {
	try {
		const updatePayload: Record<string, unknown> = {
			firstName: data.firstName,
			middleName: data.middleName || null,
			lastName: data.lastName,
			dateOfBirth: data.dateOfBirth,
			gender: data.gender,
			civilStatus: data.civilStatus,
			contactNumber: data.contactNumber,
			email: data.email || null,
			barangay: data.barangay,
			municipality: data.municipality,
			province: data.province,
		};

		// Filter out undefined fields to only update what's provided
		const filteredPayload = Object.fromEntries(
			Object.entries(updatePayload).filter(([_, v]) => v !== undefined),
		);

		if (Object.keys(filteredPayload).length > 0) {
			await db
				.updateTable("beneficiary")
				.set(filteredPayload)
				.where("id", "=", id)
				.execute();
		}

		if (programId) {
			const existingEnrollment = await db
				.selectFrom("program_enrollment")
				.selectAll()
				.where("beneficiaryId", "=", id)
				.executeTakeFirst();

			if (existingEnrollment) {
				if (existingEnrollment.programId !== programId) {
					await db
						.updateTable("program_enrollment")
						.set({ programId })
						.where("beneficiaryId", "=", id)
						.execute();
				}
			} else {
				await db
					.insertInto("program_enrollment")
					.values({
						beneficiaryId: id,
						programId,
						enrolledDate: new Date().toISOString().split("T")[0],
						status: "Active",
					})
					.execute();
			}
		}

		revalidatePath("/admin/beneficiaries");
		revalidatePath("/dashboard");
		return { success: true };
	} catch (error) {
		console.error("Error updating beneficiary:", error);
		return { success: false, error: "Failed to update beneficiary details." };
	}
}

export async function deleteBeneficiaryAction(id: string) {
	try {
		// Delete related records first (if foreign keys don't cascade)
		await db
			.deleteFrom("benefit_release")
			.where("beneficiaryId", "=", id)
			.execute();
		await db
			.deleteFrom("program_enrollment")
			.where("beneficiaryId", "=", id)
			.execute();

		// Then delete the beneficiary
		await db.deleteFrom("beneficiary").where("id", "=", id).execute();

		revalidatePath("/admin/beneficiaries");
		revalidatePath("/dashboard");
		return { success: true };
	} catch (error) {
		console.error("Error deleting beneficiary:", error);
		return { success: false, error: "Failed to delete beneficiary." };
	}
}

export async function getRecentActivityAction() {
	try {
		// Fetch latest beneficiaries (Approved, Pending, Rejected)
		const recentBeneficiaries = await db
			.selectFrom("beneficiary")
			.select(["id", "firstName", "lastName", "applicationStatus", "dateRegistered", "dateApproved", "dateRejected"])
			.orderBy("dateRegistered", "desc")
			.limit(10)
			.execute();

		// Fetch latest benefit releases
		const recentReleases = await db
			.selectFrom("benefit_release")
			.innerJoin("beneficiary", "beneficiary.id", "benefit_release.beneficiaryId")
			.select([
				"benefit_release.id",
				"beneficiary.firstName",
				"beneficiary.lastName",
				"benefit_release.assistanceType",
				"benefit_release.dateReleased",
			])
			.orderBy("benefit_release.dateReleased", "desc")
			.limit(10)
			.execute();

		// Combine and format them
		const activity = [];
		
		for (const b of recentBeneficiaries) {
			let date = b.dateRegistered;
			let action = "Submitted Application";
			if (b.applicationStatus === "Approved") {
				action = "Approved Application";
				date = b.dateApproved || b.dateRegistered;
			} else if (b.applicationStatus === "Rejected") {
				action = "Rejected Application";
				date = b.dateRejected || b.dateRegistered;
			}

			activity.push({
				id: b.id,
				user: `${b.firstName} ${b.lastName}`,
				action,
				status: b.applicationStatus,
				date,
			});
		}

		for (const r of recentReleases) {
			activity.push({
				id: r.id,
				user: `${r.firstName} ${r.lastName}`,
				action: `Released ${r.assistanceType}`,
				status: "Completed",
				date: r.dateReleased,
			});
		}

		// Sort by date descending and take top 10
		return activity
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
			.slice(0, 10);
	} catch (error) {
		console.error("Error fetching recent activity:", error);
		return [];
	}
}

export async function getTeamMembersAction() {
	try {
		const team = await db
			.selectFrom("user")
			.select(["id", "name", "role", "image"])
			.execute();
		return team;
	} catch (error) {
		console.error("Error fetching team members:", error);
		return [];
	}
}
