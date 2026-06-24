"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { validRoles } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const roleOptions = Object.keys(validRoles);

export default function SignUpPage() {
	const router = useRouter();
	const [role, setRole] = useState(roleOptions[0] ?? "");
	const [error, setError] = useState<string | null>(null);
	const [pending, setPending] = useState(false);

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);

		const formData = new FormData(e.currentTarget);
		const name = formData.get("name") as string;
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;
		const confirmPassword = formData.get("confirmPassword") as string;

		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		if (password.length < 8) {
			setError("Password must be at least 8 characters");
			return;
		}

		setPending(true);

		try {
			const { error: signUpError } = await authClient.signUp.email({
				name,
				email,
				password,
				role,
			});
			if (signUpError) {
				setError(
					signUpError.message ?? signUpError.statusText ?? "Sign up failed",
				);
				return;
			}
			router.push("/");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong");
		} finally {
			setPending(false);
		}
	}

	return (
		<div className="flex min-h-full flex-1 items-center justify-center p-4">
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle>Create an account</CardTitle>
					<CardDescription>
						Enter your details below to create your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="flex flex-col gap-4">
						<Field>
							<FieldLabel htmlFor="name">Full Name</FieldLabel>
							<Input
								id="name"
								name="name"
								type="text"
								placeholder="Juan Dela Cruz"
								required
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="email">Email</FieldLabel>
							<Input
								id="email"
								name="email"
								type="email"
								placeholder="you@example.com"
								required
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="password">Password</FieldLabel>
							<Input
								id="password"
								name="password"
								type="password"
								placeholder="At least 8 characters"
								required
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="confirmPassword">
								Confirm Password
							</FieldLabel>
							<Input
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								placeholder="Re-enter your password"
								required
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="role">Role</FieldLabel>
							<Select value={role} onValueChange={setRole}>
								<SelectTrigger id="role" className="w-full">
									<SelectValue placeholder="Select a role" />
								</SelectTrigger>
								<SelectContent>
									{roleOptions.map((r) => (
										<SelectItem key={r} value={r}>
											{r.charAt(0).toUpperCase() + r.slice(1)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</Field>
						{error && (
							<p className="text-xs/relaxed text-destructive">{error}</p>
						)}
						<Button type="submit" disabled={pending} className="w-full">
							{pending ? "Creating account…" : "Sign up"}
						</Button>
						<p className="text-center text-xs text-muted-foreground">
							Already have an account?{" "}
							<Link
								href="/login"
								className="font-medium text-foreground underline-offset-4 hover:underline"
							>
								Sign in
							</Link>
						</p>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
