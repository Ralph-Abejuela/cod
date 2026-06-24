"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import type { ReportType } from "@/lib/report-data";

const reportTypes: {
	id: ReportType;
	title: string;
	description: string;
}[] = [
	{
		id: "beneficiaries",
		title: "Beneficiaries Report",
		description:
			"Complete list of all registered beneficiaries with personal details, contact info, and application status.",
	},
	{
		id: "application-status",
		title: "Application Status Report",
		description:
			"Beneficiaries grouped by application status — Pending, Approved, Rejected, and Released.",
	},
	{
		id: "program-utilization",
		title: "Program Utilization Report",
		description:
			"Enrollment counts per program, pending vs approved breakdown, and benefit release summary.",
	},
];

export default function ReportPage() {
	const [loading, setLoading] = useState<ReportType | null>(null);

	function handleGenerate(type: ReportType) {
		setLoading(type);
		window.open(`/api/reports/${type}`, "_blank");
		setTimeout(() => setLoading(null), 2000);
	}

	return (
		<div className="flex min-h-screen flex-col bg-background">
			<header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="mx-auto flex h-14 w-full items-center justify-between px-6">
					<div className="flex items-center gap-3">
						<Link
							href="/dashboard"
							className="text-lg font-semibold tracking-tight"
						>
							CAMS
						</Link>
						<Separator orientation="vertical" className="h-5" />
						<span className="text-sm font-medium">Reports</span>
					</div>
					<Link href="/dashboard">
						<Button variant="outline" size="sm">
							Back to Dashboard
						</Button>
					</Link>
				</div>
			</header>

			<main className="mx-auto w-full max-w-4xl flex-1 p-6">
				<div className="mb-6">
					<h1 className="text-2xl font-bold tracking-tight">
						Generate Reports
					</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						Select a report type to generate a PDF document.
					</p>
				</div>

				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{reportTypes.map((report) => (
						<Card key={report.id} className="flex flex-col">
							<CardHeader>
								<div className="flex items-center gap-2">
									<FileText className="h-5 w-5 text-primary" />
									<CardTitle className="text-base">{report.title}</CardTitle>
								</div>
								<CardDescription>{report.description}</CardDescription>
							</CardHeader>
							<CardFooter className="mt-auto pt-2">
								<Button
									className="w-full"
									disabled={loading === report.id}
									onClick={() => handleGenerate(report.id)}
								>
									{loading === report.id ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Generating...
										</>
									) : (
										"Generate PDF"
									)}
								</Button>
							</CardFooter>
						</Card>
					))}
				</div>
			</main>
		</div>
	);
}
