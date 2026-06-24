import Link from "next/link";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { type ApplicationStatus } from "@/lib/beneficiary-data";
import { BeneficiaryCard } from "../../page"; // Reusing the visual card
import {
	getBeneficiaryByIdAction,
	getProgramsAction,
} from "@/app/actions/beneficiary";
import { PrintButton } from "@/components/PrintButton";

function AppStatusBadge({ status }: { status: ApplicationStatus }) {
	switch (status) {
		case "Pending":
			return (
				<Badge
					variant="outline"
					className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
				>
					Pending Review
				</Badge>
			);
		case "Approved":
			return (
				<Badge
					variant="default"
					className="bg-blue-500 hover:bg-blue-600 print:bg-transparent print:text-black print:border print:border-black"
				>
					Approved
				</Badge>
			);
		case "Rejected":
			return (
				<Badge
					variant="destructive"
					className="print:bg-transparent print:text-black print:border print:border-black"
				>
					Rejected
				</Badge>
			);
		case "Released":
			return (
				<Badge
					variant="default"
					className="bg-emerald-500 hover:bg-emerald-600 print:bg-transparent print:text-black print:border print:border-black"
				>
					Benefits Released
				</Badge>
			);
	}
}

export default async function TrackApplicationPage({
	params,
}: {
	params: { id: string };
}) {
	const { id } = params;
	const data = await getBeneficiaryByIdAction(id);

	if (!data) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-background">
				<Card className="w-full max-w-md text-center">
					<CardHeader>
						<CardTitle>Not Found</CardTitle>
						<CardDescription>
							We could not find an application with this control number.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Link href="/beneficiary">
							<Button>Return to Tracking</Button>
						</Link>
					</CardContent>
				</Card>
			</div>
		);
	}

	const [programs, releases] = await Promise.all([
		getProgramsAction(),
		Promise.resolve(data.releases),
	]);
	const { beneficiary } = data;
	const programNames = new Map(programs.map((p) => [p.id, p.name]));
	const mainProgram =
		programNames.get(beneficiary.programs[0]?.programId || "") ||
		beneficiary.programs[0]?.programId ||
		"None";
	const totalReceived = releases.reduce((sum, r) => sum + r.amount, 0);

	return (
		<div className="min-h-screen bg-background print:bg-white print:min-h-0">
			<header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 print:hidden">
				<div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
					<div className="flex items-center gap-3">
						<Link
							href="/dashboard"
							className="text-lg font-semibold tracking-tight"
						>
							CAMS
						</Link>
						<Separator orientation="vertical" className="h-5" />
						<Link
							href="/beneficiary"
							className="text-sm text-muted-foreground hover:text-foreground"
						>
							Beneficiaries
						</Link>
						<span className="text-sm text-muted-foreground">/</span>
						<span className="text-sm font-medium">Track</span>
					</div>
					<Link href="/beneficiary">
						<Button variant="outline" size="sm">
							Log out
						</Button>
					</Link>
				</div>
			</header>

			{/* Print-only Header */}
			<div className="hidden print:block text-center mb-8 border-b-2 border-black pb-4">
				<h1 className="text-2xl font-bold uppercase tracking-wider">
					Republic of the Philippines
				</h1>
				<p className="text-sm font-semibold mt-1">
					Official Beneficiary Report
				</p>
				<p className="text-xs text-gray-600 mt-2">
					Generated on: {new Date().toLocaleDateString()}
				</p>
			</div>

			<main className="mx-auto max-w-5xl px-6 py-8 print:p-0">
				<div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div>
						<h1 className="text-2xl font-semibold tracking-tight">
							Application Tracker
						</h1>
						<p className="text-sm text-muted-foreground print:text-black">
							Welcome back, {beneficiary.firstName}. Here is the status of your
							application.
						</p>
					</div>
					<div className="flex items-center gap-3">
						<AppStatusBadge status={beneficiary.applicationStatus} />
						<PrintButton />
					</div>
				</div>

				<div className="grid gap-8 lg:grid-cols-2">
					{/* Timeline / Status */}
					<div className="flex flex-col gap-6">
						<Card>
							<CardHeader>
								<CardTitle>Application Timeline</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="relative border-l pl-6 ml-2 space-y-8">
									{/* Step 1: Registered */}
									<div className="relative">
										<div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-primary" />
										<p className="text-sm font-medium">Application Submitted</p>
										<p className="text-xs text-muted-foreground">
											{beneficiary.dateRegistered}
										</p>
									</div>

									{/* Step 2: Approved / Rejected */}
									{beneficiary.applicationStatus === "Rejected" ? (
										<div className="relative">
											<div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-destructive" />
											<p className="text-sm font-medium text-destructive">
												Application Rejected
											</p>
											<p className="text-xs text-muted-foreground">
												{beneficiary.dateRejected}
											</p>
											<p className="mt-1 text-xs font-medium bg-destructive/10 text-destructive p-2 rounded">
												Reason: {beneficiary.rejectionReason}
											</p>
										</div>
									) : (
										<div className="relative">
											<div
												className={`absolute -left-[31px] top-1 h-3 w-3 rounded-full ${beneficiary.dateApproved ? "bg-primary" : "bg-muted border-2 border-primary/50"}`}
											/>
											<p
												className={`text-sm font-medium ${!beneficiary.dateApproved && "text-muted-foreground"}`}
											>
												Application Approved
											</p>
											{beneficiary.dateApproved && (
												<>
													<p className="text-xs text-muted-foreground">
														{beneficiary.dateApproved}
													</p>
													<p className="text-xs text-muted-foreground mt-0.5">
														Approved by: {beneficiary.approvedBy}
													</p>
												</>
											)}
										</div>
									)}

									{/* Step 3: Released (only if not rejected) */}
									{beneficiary.applicationStatus !== "Rejected" && (
										<div className="relative">
											<div
												className={`absolute -left-[31px] top-1 h-3 w-3 rounded-full ${beneficiary.dateReleased ? "bg-emerald-500" : "bg-muted border-2 border-primary/50"}`}
											/>
											<p
												className={`text-sm font-medium ${!beneficiary.dateReleased && "text-muted-foreground"}`}
											>
												Benefits Released
											</p>
											{beneficiary.dateReleased && (
												<p className="text-xs text-muted-foreground">
													{beneficiary.dateReleased}
												</p>
											)}
										</div>
									)}
								</div>
							</CardContent>
						</Card>

						{/* Benefit Summary */}
						{releases.length > 0 && (
							<div className="grid grid-cols-2 gap-4">
								<Card size="sm">
									<CardHeader>
										<CardDescription>Total Benefits Received</CardDescription>
										<CardTitle className="text-2xl text-emerald-600">
											₱{totalReceived.toLocaleString()}
										</CardTitle>
									</CardHeader>
								</Card>
								<Card size="sm">
									<CardHeader>
										<CardDescription>Releases</CardDescription>
										<CardTitle className="text-2xl">
											{releases.length}
										</CardTitle>
									</CardHeader>
								</Card>
							</div>
						)}
					</div>

					{/* Right Col: ID Card & Info */}
					<div className="flex flex-col gap-6">
						<div>
							<p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
								Your Digital ID
							</p>
							<BeneficiaryCard
								firstName={beneficiary.firstName}
								middleName={beneficiary.middleName}
								lastName={beneficiary.lastName}
								dateOfBirth={beneficiary.dateOfBirth}
								gender={beneficiary.gender}
								barangay={beneficiary.barangay}
								municipality={beneficiary.municipality}
								province={beneficiary.province}
								program={mainProgram}
								controlNumber={beneficiary.id}
								status={beneficiary.applicationStatus}
							/>
						</div>
					</div>
				</div>

				<Separator className="my-8" />

				{/* Releases Table */}
				<div className="space-y-4">
					<h2 className="text-lg font-semibold tracking-tight">
						Benefits Received
					</h2>
					<Card>
						<CardContent className="p-0">
							{releases.length > 0 ? (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Date</TableHead>
											<TableHead>Assistance Type</TableHead>
											<TableHead>Program</TableHead>
											<TableHead className="text-right">Amount</TableHead>
											<TableHead>Releasing Officer</TableHead>
											<TableHead>Remarks</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{releases.map((r) => (
											<TableRow key={r.id}>
												<TableCell className="whitespace-nowrap">
													{r.dateReleased}
												</TableCell>
												<TableCell className="font-medium">
													{r.assistanceType}
												</TableCell>
												<TableCell>
													<Badge variant="secondary" className="text-[10px]">
														{r.program}
													</Badge>
												</TableCell>
												<TableCell className="text-right font-semibold text-emerald-600">
													₱{r.amount.toLocaleString()}
												</TableCell>
												<TableCell className="text-xs">
													{r.releasingOfficer}
												</TableCell>
												<TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
													{r.remarks}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							) : (
								<div className="p-8 text-center text-sm text-muted-foreground">
									No benefits have been released yet.
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	);
}
