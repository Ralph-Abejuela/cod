"use server";

import { db } from "@/lib/db/database";
import type { ProgramItem } from "@/lib/beneficiary-data";
import { revalidatePath } from "next/cache";

export async function getProgramsAction(): Promise<ProgramItem[]> {
	try {
		return await db.selectFrom("program").selectAll().execute();
	} catch (error) {
		console.error("Error fetching programs:", error);
		return [];
	}
}

export type ProgramFormState = { success: boolean; error?: string };

export async function createProgramAction(
	formData: FormData,
): Promise<ProgramFormState> {
	try {
		const id = (formData.get("id") as string)?.trim();
		const name = (formData.get("name") as string)?.trim();
		const description = (formData.get("description") as string)?.trim() || "";

		if (!id || !name) {
			return { success: false, error: "ID and Name are required." };
		}

		await db
			.insertInto("program")
			.values({
				id,
				name,
				description: description || null,
			})
			.execute();

		revalidatePath("/admin/programs");
		return { success: true };
	} catch (error) {
		console.error("Error creating program:", error);
		return {
			success: false,
			error: "Failed to create program. The ID may already exist.",
		};
	}
}

export async function updateProgramAction(
	id: string,
	formData: FormData,
): Promise<ProgramFormState> {
	try {
		const name = (formData.get("name") as string)?.trim();
		const description = (formData.get("description") as string)?.trim() || "";

		if (!name) {
			return { success: false, error: "Name is required." };
		}

		await db
			.updateTable("program")
			.set({
				name,
				description: description || null,
			})
			.where("id", "=", id)
			.execute();

		revalidatePath("/admin/programs");
		return { success: true };
	} catch (error) {
		console.error("Error updating program:", error);
		return { success: false, error: "Failed to update program." };
	}
}

export async function deleteProgramAction(id: string) {
	try {
		await db.deleteFrom("program").where("id", "=", id).execute();

		revalidatePath("/admin/programs");
		return { success: true };
	} catch (error) {
		console.error("Error deleting program:", error);
		return {
			success: false,
			error:
				"Cannot delete program — it may have active beneficiary enrollments.",
		};
	}
}
