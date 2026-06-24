"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
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

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [pending, setPending] = useState(false);

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		setError(null);
		setPending(true);

		try {
			const { error: signInError } = await authClient.signIn.email({
				email,
				password,
			});
			if (signInError) {
				setError(
					signInError.message ?? signInError.statusText ?? "Sign in failed",
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
					<CardTitle>Sign in</CardTitle>
					<CardDescription>Enter your email below to sign in</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="flex flex-col gap-4">
						<Field>
							<FieldLabel htmlFor="email">Email</FieldLabel>
							<Input
								id="email"
								type="email"
								placeholder="you@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="password">Password</FieldLabel>
							<Input
								id="password"
								type="password"
								placeholder="Enter your password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</Field>
						{error && (
							<p className="text-xs/relaxed text-destructive">{error}</p>
						)}
						<Button type="submit" disabled={pending} className="w-full">
							{pending ? "Signing in…" : "Sign in"}
						</Button>
						<p className="text-center text-xs text-muted-foreground">
							Don&apos;t have an account?{" "}
							<Link
								href="/signup"
								className="font-medium text-foreground underline-offset-4 hover:underline"
							>
								Sign up
							</Link>
						</p>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
