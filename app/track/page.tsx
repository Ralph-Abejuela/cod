"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { verifyAndGetBeneficiaryAction } from "@/app/actions/beneficiary";

export default function TrackApplicationPage() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		const formData = new FormData(e.currentTarget);
		const controlNumber = formData.get("controlNumber") as string;
		const lastName = formData.get("lastName") as string;

		if (!controlNumber || !lastName) {
			setError("Please provide both Control Number and Last Name.");
			setIsLoading(false);
			return;
		}

		const result = await verifyAndGetBeneficiaryAction(controlNumber, lastName);

		if (!result) {
			setError("Application not found. Please check your Control Number and Last Name.");
			setIsLoading(false);
			return;
		}

		// Success, navigate to the tracking details
		router.push(`/beneficiary/track/${controlNumber.trim().toUpperCase()}`);
	}

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-[#fafaf9] p-4 font-sans selection:bg-zinc-200">
			{/* Navbar snippet to go back home */}
			<div className="absolute top-0 left-0 w-full p-6 flex items-center justify-between">
				<Link href="/" className="flex items-center gap-2">
					<div className="h-6 w-6 rounded bg-zinc-900 flex items-center justify-center">
						<span className="text-white text-xs font-bold leading-none">CA</span>
					</div>
					<span className="text-lg font-semibold tracking-tight text-zinc-900">
						Community Assist
					</span>
				</Link>
			</div>

			<Card className="w-full max-w-lg shadow-xl shadow-zinc-200/50 border-zinc-100 rounded-2xl bg-white p-2">
				<CardContent className="p-8 sm:p-10">
					<div className="mb-8 text-center sm:text-left">
						<h1 className="text-2xl font-serif sm:text-3xl font-semibold tracking-tight text-zinc-900 mb-2">
							Track Your Application
						</h1>
						<p className="text-zinc-500 text-sm sm:text-base leading-relaxed">
							Enter your Control Number and Last Name to view your status and benefits.
						</p>
					</div>

					<form onSubmit={onSubmit} className="flex flex-col gap-6">
						<Field>
							<FieldLabel htmlFor="controlNumber" className="text-zinc-700 font-medium">Control Number</FieldLabel>
							<Input
								id="controlNumber"
								name="controlNumber"
								placeholder="e.g. BNFY-2026-0001"
								required
								className="h-12 border-zinc-200 bg-zinc-50/50 focus-visible:ring-zinc-900 rounded-xl"
							/>
						</Field>

						<Field>
							<FieldLabel htmlFor="lastName" className="text-zinc-700 font-medium">Last Name</FieldLabel>
							<Input
								id="lastName"
								name="lastName"
								placeholder="e.g. Dela Cruz"
								required
								className="h-12 border-zinc-200 bg-zinc-50/50 focus-visible:ring-zinc-900 rounded-xl"
							/>
						</Field>

						{error && (
							<div className="rounded-lg bg-red-50 p-4 border border-red-100">
								<p className="text-sm text-red-600 font-medium">{error}</p>
							</div>
						)}

						<Button
							type="submit"
							disabled={isLoading}
							className="mt-2 h-12 w-full bg-zinc-900 text-white hover:bg-zinc-800 rounded-xl text-base shadow-sm"
						>
							{isLoading ? "Verifying..." : "Track Application"}
						</Button>
					</form>
				</CardContent>
			</Card>

			<p className="mt-8 text-center text-sm text-zinc-500">
				Not registered?{" "}
				<Link
					href="/beneficiary"
					className="font-medium text-zinc-900 underline underline-offset-4 hover:text-zinc-700 transition-colors"
				>
					Register here
				</Link>
			</p>
		</div>
	);
}
