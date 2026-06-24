"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	registerBeneficiaryAction,
	verifyAndGetBeneficiaryAction,
	getProgramsAction,
} from "@/app/actions/beneficiary";
import { getProvinces, getMunicipalities, getBarangays } from "@/app/actions/locations";
import type { ProgramItem } from "@/lib/beneficiary-data";

// ---------------------------------------------------------------------------
// Live Beneficiary ID Card Preview
// ---------------------------------------------------------------------------
export function BeneficiaryCard({
	firstName,
	middleName,
	lastName,
	dateOfBirth,
	gender,
	barangay,
	municipality,
	province,
	program,
	controlNumber,
	status,
}: {
	firstName?: string;
	middleName?: string;
	lastName?: string;
	dateOfBirth?: string;
	gender?: string;
	barangay?: string;
	municipality?: string;
	province?: string;
	program?: string;
	controlNumber?: string;
	status?: string;
}) {
	const fullName =
		[firstName, middleName, lastName].filter(Boolean).join(" ") || "Full Name";

	return (
		<div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0038a8] via-[#0038a8] to-[#ce1126] p-[1px]">
			<div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d1b3e] via-[#162752] to-[#3b1520] p-6">
				{/* Decorative circles */}
				<div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#fcd116]/10" />
				<div className="pointer-events-none absolute -left-6 -bottom-6 h-24 w-24 rounded-full bg-[#0038a8]/20" />

				{/* Header */}
				<div className="relative mb-4 text-center">
					<p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#fcd116]/80">
						Republic of the Philippines
					</p>
					<p className="text-[8px] uppercase tracking-[0.2em] text-white/50">
						Government Beneficiary Card
					</p>
				</div>

				{/* Control Number */}
				<div className="mb-4">
					<p className="text-[9px] font-medium uppercase tracking-[0.2em] text-white/40">
						Control Number
					</p>
					<p className="mt-0.5 font-mono text-xl font-bold tracking-[0.15em] text-white">
						{controlNumber || "BNFY-XXXX-XXXX"}
					</p>
				</div>

				{/* Info grid */}
				<div className="grid grid-cols-3 gap-x-3 gap-y-2">
					<div className="col-span-2">
						<p className="text-[8px] font-medium uppercase tracking-[0.15em] text-white/40">
							Full Name
						</p>
						<p className="mt-0.5 text-sm font-semibold text-white truncate">
							{fullName}
						</p>
					</div>
					<div>
						<p className="text-[8px] font-medium uppercase tracking-[0.15em] text-white/40">
							Gender
						</p>
						<p className="mt-0.5 text-sm font-semibold text-white">
							{gender || "—"}
						</p>
					</div>
					<div>
						<p className="text-[8px] font-medium uppercase tracking-[0.15em] text-white/40">
							Date of Birth
						</p>
						<p className="mt-0.5 text-xs font-medium text-white/90">
							{dateOfBirth || "—"}
						</p>
					</div>
					<div>
						<p className="text-[8px] font-medium uppercase tracking-[0.15em] text-white/40">
							Program
						</p>
						<p className="mt-0.5 text-xs font-medium text-[#fcd116]">
							{program || "—"}
						</p>
					</div>
					<div>
						<p className="text-[8px] font-medium uppercase tracking-[0.15em] text-white/40">
							Status
						</p>
						<p className="mt-0.5 text-xs font-medium text-emerald-400">
							{status || "Pending"}
						</p>
					</div>
				</div>

				{/* Address */}
				<div className="mt-3 border-t border-white/10 pt-2">
					<p className="text-[8px] font-medium uppercase tracking-[0.15em] text-white/40">
						Address
					</p>
					<p className="mt-0.5 text-[11px] text-white/80 truncate">
						{[barangay, municipality, province].filter(Boolean).join(", ") ||
							"—"}
					</p>
				</div>
			</div>
		</div>
	);
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------
export default function BeneficiaryPage() {
	const router = useRouter();

	// Programs list from DB
	const [programsList, setProgramsList] = useState<ProgramItem[]>([]);

	useEffect(() => {
		getProgramsAction().then(setProgramsList);
	}, []);

	// Locations list from actions
	const [provincesList, setProvincesList] = useState<any[]>([]);
	const [municipalitiesList, setMunicipalitiesList] = useState<any[]>([]);
	const [barangaysList, setBarangaysList] = useState<any[]>([]);
	
	const [selectedProvCode, setSelectedProvCode] = useState("");
	const [selectedCitymunCode, setSelectedCitymunCode] = useState("");

	useEffect(() => {
		getProvinces().then(setProvincesList);
	}, []);

	useEffect(() => {
		if (selectedProvCode) {
			getMunicipalities(selectedProvCode).then(setMunicipalitiesList);
		} else {
			setMunicipalitiesList([]);
		}
		// Reset dependents
		setSelectedCitymunCode("");
		setMunicipality("");
		setBarangay("");
	}, [selectedProvCode]);

	useEffect(() => {
		if (selectedCitymunCode) {
			getBarangays(selectedCitymunCode).then(setBarangaysList);
		} else {
			setBarangaysList([]);
		}
		// Reset dependents
		setBarangay("");
	}, [selectedCitymunCode]);

	// Form state
	const [firstName, setFirstName] = useState("");
	const [middleName, setMiddleName] = useState("");
	const [lastName, setLastName] = useState("");
	const [dateOfBirth, setDateOfBirth] = useState("");
	const [gender, setGender] = useState("");
	const [civilStatus, setCivilStatus] = useState("");
	const [contactNumber, setContactNumber] = useState("");
	const [email, setEmail] = useState("");
	const [barangay, setBarangay] = useState("");
	const [municipality, setMunicipality] = useState("");
	const [province, setProvince] = useState("");
	const [program, setProgram] = useState("");
	const [success, setSuccess] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Track state
	const [trackId, setTrackId] = useState("");
	const [trackLastName, setTrackLastName] = useState("");
	const [trackError, setTrackError] = useState("");
	const [isTrackSubmitting, setIsTrackSubmitting] = useState(false);

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		
		// Phone Validation
		const phoneRegex = /^(09|\+639)\d{9}$/;
		if (!phoneRegex.test(contactNumber)) {
			alert("Please enter a valid Philippine mobile number (e.g. 09171234567 or +639171234567).");
			return;
		}

		setIsSubmitting(true);
		setSuccess(null);

		const result = await registerBeneficiaryAction({
			firstName,
			middleName,
			lastName,
			dateOfBirth,
			gender: gender as "Male" | "Female",
			civilStatus: civilStatus as
				| "Single"
				| "Married"
				| "Widowed"
				| "Separated",
			contactNumber,
			email,
			barangay,
			municipality,
			province,
			programs: program
				? [
						{
							programId: program,
							enrolledDate: new Date().toISOString().split("T")[0],
							status: "Enrolled",
						},
					]
				: [],
			applicationStatus: "Pending",
			dateRegistered: new Date().toISOString().split("T")[0],
		});

		setIsSubmitting(false);

		if (result.success) {
			setSuccess(result.id!);

			// Reset form
			setFirstName("");
			setMiddleName("");
			setLastName("");
			setDateOfBirth("");
			setGender("");
			setCivilStatus("");
			setContactNumber("");
			setEmail("");
			setBarangay("");
			setMunicipality("");
			setProvince("");
			setSelectedProvCode("");
			setSelectedCitymunCode("");
			setProgram("");
		}
	}

	async function handleTrack(e: FormEvent) {
		e.preventDefault();
		setTrackError("");
		setIsTrackSubmitting(true);

		if (!trackId || !trackLastName) {
			setTrackError("Please fill in both fields.");
			setIsTrackSubmitting(false);
			return;
		}

		const verified = await verifyAndGetBeneficiaryAction(
			trackId,
			trackLastName,
		);
		setIsTrackSubmitting(false);

		if (verified) {
			router.push(`/beneficiary/track/${verified.beneficiary.id}`);
		} else {
			setTrackError("No matching record found. Please check your details.");
		}
	}

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
					<div className="flex items-center gap-3">
						<Link
							href="/dashboard"
							className="text-lg font-semibold tracking-tight"
						>
							CAMS
						</Link>
						<Separator orientation="vertical" className="h-5" />
						<span className="text-sm text-muted-foreground">
							Beneficiary Management
						</span>
					</div>
					<nav className="flex items-center gap-2">
						<Link href="/dashboard">
							<Button variant="ghost" size="sm">
								Dashboard
							</Button>
						</Link>
						<Link href="/beneficiary">
							<Button variant="ghost" size="sm" className="font-semibold">
								Beneficiaries
							</Button>
						</Link>
					</nav>
				</div>
			</header>

			<main className="mx-auto max-w-7xl px-6 py-8">
				{/* Page heading */}
				<div className="mb-8">
					<h1 className="text-2xl font-semibold tracking-tight">
						Beneficiaries
					</h1>
					<p className="text-sm text-muted-foreground">
						Register for a government program or track your existing
						application.
					</p>
				</div>

				{/* ---- Two-column layout ---- */}
				<div className="grid gap-8 lg:grid-cols-2">
					{/* LEFT: Registration Form */}
					<div>
						<Card>
							<CardHeader>
								<CardTitle>Register New Beneficiary</CardTitle>
								<CardDescription>
									Fill in the details below. The card preview updates in
									real-time.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<form onSubmit={handleSubmit} className="flex flex-col gap-5">
									{/* Name row */}
									<div className="grid gap-4 sm:grid-cols-3">
										<Field>
											<FieldLabel htmlFor="reg-first">First Name</FieldLabel>
											<Input
												id="reg-first"
												placeholder="Maria"
												value={firstName}
												onChange={(e) => setFirstName(e.target.value)}
												required
											/>
										</Field>
										<Field>
											<FieldLabel htmlFor="reg-middle">Middle Name</FieldLabel>
											<Input
												id="reg-middle"
												placeholder="Santos"
												value={middleName}
												onChange={(e) => setMiddleName(e.target.value)}
											/>
										</Field>
										<Field>
											<FieldLabel htmlFor="reg-last">Last Name</FieldLabel>
											<Input
												id="reg-last"
												placeholder="Dela Cruz"
												value={lastName}
												onChange={(e) => setLastName(e.target.value)}
												required
											/>
										</Field>
									</div>

									{/* DOB + Gender */}
									<div className="grid gap-4 sm:grid-cols-2">
										<Field>
											<FieldLabel htmlFor="reg-dob">Date of Birth</FieldLabel>
											<Input
												id="reg-dob"
												type="date"
												max={new Date().toISOString().split("T")[0]}
												value={dateOfBirth}
												onChange={(e) => setDateOfBirth(e.target.value)}
												required
											/>
										</Field>
										<Field>
											<FieldLabel>Gender</FieldLabel>
											<Select value={gender} onValueChange={setGender}>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select gender" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="Male">Male</SelectItem>
													<SelectItem value="Female">Female</SelectItem>
												</SelectContent>
											</Select>
										</Field>
									</div>

									{/* Civil Status + Contact */}
									<div className="grid gap-4 sm:grid-cols-2">
										<Field>
											<FieldLabel>Civil Status</FieldLabel>
											<Select
												value={civilStatus}
												onValueChange={setCivilStatus}
											>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select status" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="Single">Single</SelectItem>
													<SelectItem value="Married">Married</SelectItem>
													<SelectItem value="Widowed">Widowed</SelectItem>
													<SelectItem value="Separated">Separated</SelectItem>
												</SelectContent>
											</Select>
										</Field>
										<Field>
											<FieldLabel htmlFor="reg-contact">
												Contact Number
											</FieldLabel>
											<Input
												id="reg-contact"
												type="tel"
												inputMode="numeric"
												maxLength={13}
												placeholder="09171234567"
												pattern="^(09|\+639)\d{9}$"
												title="Valid Philippine mobile number starting with 09 or +639 followed by 9 digits"
												value={contactNumber}
												onChange={(e) => {
													const val = e.target.value.replace(/[^\d+]/g, '');
													if (val.length <= 13) setContactNumber(val);
												}}
												required
											/>
										</Field>
									</div>

									{/* Email */}
									<Field>
										<FieldLabel htmlFor="reg-email">Email Address</FieldLabel>
										<Input
											id="reg-email"
											type="email"
											placeholder="maria@email.com"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
										/>
									</Field>

									<Separator />

									{/* Address */}
									<div className="grid gap-4 sm:grid-cols-3">
										<Field>
											<FieldLabel>Province</FieldLabel>
											<Select 
												value={selectedProvCode} 
												onValueChange={(code) => {
													setSelectedProvCode(code);
													const prov = provincesList.find(p => p.provCode === code);
													setProvince(prov ? prov.provDesc : "");
												}}
											>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select Province" />
												</SelectTrigger>
												<SelectContent>
													{provincesList.map(p => (
														<SelectItem key={p.provCode} value={p.provCode}>{p.provDesc}</SelectItem>
													))}
												</SelectContent>
											</Select>
										</Field>
										<Field>
											<FieldLabel>Municipality</FieldLabel>
											<Select 
												value={selectedCitymunCode} 
												onValueChange={(code) => {
													setSelectedCitymunCode(code);
													const mun = municipalitiesList.find(m => m.citymunCode === code);
													setMunicipality(mun ? mun.citymunDesc : "");
												}}
												disabled={!selectedProvCode}
											>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select Municipality" />
												</SelectTrigger>
												<SelectContent>
													{municipalitiesList.map(m => (
														<SelectItem key={m.citymunCode} value={m.citymunCode}>{m.citymunDesc}</SelectItem>
													))}
												</SelectContent>
											</Select>
										</Field>
										<Field>
											<FieldLabel>Barangay</FieldLabel>
											<Select 
												value={barangay} 
												onValueChange={(desc) => setBarangay(desc)}
												disabled={!selectedCitymunCode}
											>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select Barangay" />
												</SelectTrigger>
												<SelectContent>
													{barangaysList.map(b => (
														<SelectItem key={b.brgyCode} value={b.brgyDesc}>{b.brgyDesc}</SelectItem>
													))}
												</SelectContent>
											</Select>
										</Field>
									</div>

									{/* Program */}
									<Field>
										<FieldLabel>Program</FieldLabel>
										<Select value={program} onValueChange={setProgram}>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Select a government program" />
											</SelectTrigger>
											<SelectContent>
												{programsList.map((p) => (
													<SelectItem key={p.id} value={p.id}>
														{p.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</Field>

									{success && (
										<p className="text-xs font-medium text-emerald-600">
											✓ Beneficiary registered successfully! Your control number
											is <strong>{success}</strong>.
										</p>
									)}

									<Button
										type="submit"
										className="w-full"
										disabled={isSubmitting}
									>
										{isSubmitting ? "Registering..." : "+ Register Beneficiary"}
									</Button>
								</form>
							</CardContent>
						</Card>
					</div>

					{/* RIGHT: Live Card Preview + Track Application */}
					<div className="flex flex-col gap-6">
						{/* Live Card Preview */}
						<div>
							<p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
								Card Preview
							</p>
							<BeneficiaryCard
								firstName={firstName}
								middleName={middleName}
								lastName={lastName}
								dateOfBirth={dateOfBirth}
								gender={gender}
								barangay={barangay}
								municipality={municipality}
								province={province}
								program={
									programsList.find((p) => p.id === program)?.name || program
								}
								controlNumber="" // Control number assigned after approval
								status="Pending"
							/>
						</div>

						<Separator />

						{/* Track Application */}
						<Card>
							<CardHeader>
								<CardTitle>Track Your Application</CardTitle>
								<CardDescription>
									Enter your Control Number and Last Name to view your status
									and benefits.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<form onSubmit={handleTrack} className="flex flex-col gap-4">
									<Field>
										<FieldLabel htmlFor="track-id">Control Number</FieldLabel>
										<Input
											id="track-id"
											placeholder="e.g. BNFY-2026-0001"
											value={trackId}
											onChange={(e) => setTrackId(e.target.value)}
											required
										/>
									</Field>
									<Field>
										<FieldLabel htmlFor="track-lastname">Last Name</FieldLabel>
										<Input
											id="track-lastname"
											placeholder="e.g. Dela Cruz"
											value={trackLastName}
											onChange={(e) => setTrackLastName(e.target.value)}
											required
										/>
									</Field>
									{trackError && (
										<p className="text-xs text-destructive">{trackError}</p>
									)}
									<Button
										type="submit"
										variant="secondary"
										className="w-full"
										disabled={isTrackSubmitting}
									>
										{isTrackSubmitting ? "Searching..." : "Track Application"}
									</Button>
								</form>
							</CardContent>
						</Card>
					</div>
				</div>
			</main>
		</div>
	);
}
