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

	// Compile timeline events
	const timelineEvents = [];

	timelineEvents.push({
		id: "evt-reg",
		date: beneficiary.dateRegistered,
		title: "Application Submitted",
		description: "Initial registration into the Community Assist system.",
		icon: "📋",
		color: "bg-blue-500",
	});

	if (beneficiary.dateApproved) {
		timelineEvents.push({
			id: "evt-appr",
			date: beneficiary.dateApproved,
			title: "Application Approved",
			description: `Approved by ${beneficiary.approvedBy || "Admin"}`,
			icon: "✅",
			color: "bg-emerald-500",
		});
	}

	if (beneficiary.dateRejected) {
		timelineEvents.push({
			id: "evt-rej",
			date: beneficiary.dateRejected,
			title: "Application Rejected",
			description: `Reason: ${beneficiary.rejectionReason}`,
			icon: "❌",
			color: "bg-red-500",
		});
	}

	beneficiary.programs.forEach((prog, idx) => {
		const progName = programNames.get(prog.programId) || prog.programId;
		timelineEvents.push({
			id: `evt-prog-${idx}`,
			date: prog.enrolledDate,
			title: `Enrolled in Program: ${progName}`,
			description: `Status: ${prog.status}`,
			icon: "🏛️",
			color: "bg-indigo-500",
		});
	});

	releases.forEach((r) => {
		timelineEvents.push({
			id: r.id,
			date: r.dateReleased,
			title: `Benefit Released: ${r.assistanceType}`,
			description: `Amount: ₱${r.amount.toLocaleString()} - Remarks: ${r.remarks || "None"}`,
			icon: "💸",
			color: "bg-emerald-600",
		});
	});

	// Sort chronologically
	timelineEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

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
							Welcome back, {beneficiary.firstName}. Here is the timeline of your benefits and programs.
						</p>
					</div>
					<div className="flex items-center gap-3">
						<AppStatusBadge status={beneficiary.applicationStatus} />
						<PrintButton />
					</div>
				</div>

				<div className="grid gap-8 lg:grid-cols-2">
					{/* Left Col: Unified Timeline */}
					<div className="flex flex-col gap-6">
						<Card>
							<CardHeader>
								<CardTitle>History & Benefits Timeline</CardTitle>
								<CardDescription>A chronological view of your enrollments and received benefits.</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="relative border-l-2 border-zinc-200 ml-4 space-y-8 pb-4">
									{timelineEvents.map((evt, index) => (
										<div key={evt.id} className="relative pl-8">
											<div className={`absolute -left-[17px] top-1 h-8 w-8 rounded-full border-4 border-white ${evt.color} flex items-center justify-center text-sm shadow-sm`}>
												{evt.icon}
											</div>
											<div className="bg-zinc-50 border border-zinc-100 rounded-xl p-4 shadow-sm">
												<p className="text-xs font-semibold text-muted-foreground mb-1">{evt.date}</p>
												<h3 className="text-sm font-bold text-zinc-900">{evt.title}</h3>
												<p className="text-sm text-zinc-600 mt-1">{evt.description}</p>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Right Col: ID Card & Summary */}
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

						{releases.length > 0 && (
							<div className="grid grid-cols-2 gap-4">
								<Card size="sm">
									<CardHeader>
										<CardDescription>Total Benefits</CardDescription>
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
				</div>
			</main>
		</div>
	);
}
