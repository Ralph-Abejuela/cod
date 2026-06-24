"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export type SignUpState = { error: string } | null;

export async function signUp(
    _prevState: SignUpState,
    formData: FormData,
): Promise<SignUpState> {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const role = formData.get("role") as string;

    if (password !== confirmPassword) {
        return { error: "Passwords do not match" };
    }

    if (password.length < 8) {
        return { error: "Password must be at least 8 characters" };
    }

    try {
        await auth.api.signUpEmail({
            body: { name, email, password, role },
            headers: await headers(),
        });
        redirect("/");
    } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error))
        return { error: err.message ?? "Sign up failed" };
    }
}
