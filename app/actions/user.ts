"use server";

import { db } from "@/lib/db/database";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { validRoles } from "@/lib/permissions";
export interface UserRow {
	id: string;
	name: string;
	email: string;
	emailVerified: boolean;
	role: string | null;
	banned: boolean | null;
	banReason: string | null;
	createdAt: Date;
}

export async function getUsersAction(): Promise<UserRow[]> {
	try {
		return await db
			.selectFrom("user")
			.selectAll()
			.orderBy("createdAt", "desc")
			.execute();
	} catch (error) {
		console.error("Error fetching users:", error);
		return [];
	}
}

export type UserFormState = { success: boolean; error?: string };

export async function updateUserAction(
	id: string,
	formData: FormData,
): Promise<UserFormState> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session || session.user.role !== validRoles.admin) {
			return { success: false, error: "Unauthorized." };
		}

		const name = (formData.get("name") as string)?.trim();
		const email = (formData.get("email") as string)?.trim();
		const role = (formData.get("role") as string)?.trim();
		const banned = formData.get("banned") === "true";

		if (!name) {
			return { success: false, error: "Name is required." };
		}
		if (!email) {
			return { success: false, error: "Email is required." };
		}

		// Prevent self-demotion/disable
		if (id === session.user.id) {
			return { success: false, error: "Cannot modify your own account here." };
		}

		await db
			.updateTable("user")
			.set({
				name,
				email,
				role,
				banned: banned ? true : null,
				banReason: banned ? "Deactivated by admin" : null,
				banExpires: banned ? new Date("2099-12-31") : null,
			})
			.where("id", "=", id)
			.execute();

		revalidatePath("/admin/users");
		return { success: true };
	} catch (error) {
		console.error("Error updating user:", error);
		return { success: false, error: "Failed to update user." };
	}
}

export async function toggleBanUserAction(
	id: string,
	ban: boolean,
): Promise<UserFormState> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session || session.user.role !== validRoles.admin) {
			return { success: false, error: "Unauthorized." };
		}

		if (id === session.user.id) {
			return { success: false, error: "Cannot deactivate your own account." };
		}

		await db
			.updateTable("user")
			.set({
				banned: ban ? true : null,
				banReason: ban ? "Deactivated by admin" : null,
				banExpires: ban ? new Date("2099-12-31") : null,
			})
			.where("id", "=", id)
			.execute();

		revalidatePath("/admin/users");
		return { success: true };
	} catch (error) {
		console.error("Error toggling user ban:", error);
		return { success: false, error: "Failed to update user status." };
	}
}
