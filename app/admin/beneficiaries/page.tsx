"use client";

import React, { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";
import {
	type Beneficiary,
	type ApplicationStatus,
	type ProgramItem,
} from "@/lib/beneficiary-data";
import {
	getAdminBeneficiariesAction,
	updateApplicationStatusAction,
	recordBenefitReleaseAction,
	getProgramsAction,
} from "@/app/actions/beneficiary";

function AdminStatusBadge({ status }: { status: ApplicationStatus }) {
	switch (status) {
		case "Pending":
			return (
				<Badge
					variant="outline"
					className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
				>
					Pending
				</Badge>
			);
		case "Approved":
			return (
				<Badge variant="default" className="bg-blue-500">
					Approved
				</Badge>
			);
		case "Rejected":
			return <Badge variant="destructive">Rejected</Badge>;
		case "Released":
			return (
				<Badge variant="default" className="bg-emerald-500">
					Released
				</Badge>
			);
	}
}

export default function AdminBeneficiariesPage() {
	const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
	const [programsList, setProgramsList] = useState<ProgramItem[]>([]);
	const [search, setSearch] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	
	const [sortBy, setSortBy] = useState("date-desc");
	const [filterProgram, setFilterProgram] = useState("all");

	// States for actions (mocking modal behavior with inline forms for simplicity)
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [actionType, setActionType] = useState<"status" | "release" | null>(
		null,
	);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Status change form
	const [newStatus, setNewStatus] = useState<ApplicationStatus>("Pending");
	const [rejectReason, setRejectReason] = useState("");

	// Release form
	const [amount, setAmount] = useState("");
	const [assistanceType, setAssistanceType] = useState("");

	React.useEffect(() => {
		async function load() {
			const [data, programs] = await Promise.all([
				getAdminBeneficiariesAction(),
				getProgramsAction(),
			]);
			setBeneficiaries(data);
			setProgramsList(programs);
			setIsLoading(false);
		}
		load();
	}, []);

	const programNames = new Map(programsList.map((p) => [p.id, p.name]));

	const filtered = beneficiaries
		.filter((b) => {
			const matchesSearch =
				b.firstName.toLowerCase().includes(search.toLowerCase()) ||
				b.lastName.toLowerCase().includes(search.toLowerCase()) ||
				b.id.toLowerCase().includes(search.toLowerCase());
			
			const mainProgram = b.programs[0]?.programId || "";
			const matchesProgram = filterProgram === "all" || mainProgram === filterProgram;

			return matchesSearch && matchesProgram;
		})
		.sort((a, b) => {
			if (sortBy === "date-desc") {
				return new Date(b.dateRegistered).getTime() - new Date(a.dateRegistered).getTime();
			} else if (sortBy === "date-asc") {
				return new Date(a.dateRegistered).getTime() - new Date(b.dateRegistered).getTime();
			} else if (sortBy === "name-asc") {
				return a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName);
			} else if (sortBy === "name-desc") {
				return b.lastName.localeCompare(a.lastName) || b.firstName.localeCompare(a.firstName);
			} else if (sortBy === "id-asc") {
				return a.id.localeCompare(b.id);
			} else if (sortBy === "id-desc") {
				return b.id.localeCompare(a.id);
			} else if (sortBy === "location-asc") {
				return a.province.localeCompare(b.province) || a.municipality.localeCompare(b.municipality);
			} else if (sortBy === "location-desc") {
				return b.province.localeCompare(a.province) || b.municipality.localeCompare(a.municipality);
			} else if (sortBy === "program-asc") {
				const progA = a.programs[0]?.programId || "";
				const progB = b.programs[0]?.programId || "";
				return progA.localeCompare(progB);
			} else if (sortBy === "program-desc") {
				const progA = a.programs[0]?.programId || "";
				const progB = b.programs[0]?.programId || "";
				return progB.localeCompare(progA);
			} else if (sortBy === "status-asc") {
				return a.applicationStatus.localeCompare(b.applicationStatus);
			} else if (sortBy === "status-desc") {
				return b.applicationStatus.localeCompare(a.applicationStatus);
			}
			return 0;
		});

	async function handleStatusChange(e: React.FormEvent) {
		e.preventDefault();
		if (!selectedId) return;
		setIsSubmitting(true);

		const result = await updateApplicationStatusAction(
			selectedId,
			newStatus,
			rejectReason,
		);

		if (result.success) {
			const data = await getAdminBeneficiariesAction();
			setBeneficiaries(data);
			cancelAction();
		}
		setIsSubmitting(false);
	}

	async function handleRecordRelease(e: React.FormEvent) {
		e.preventDefault();
		if (!selectedId) return;
		setIsSubmitting(true);

		const beneficiary = beneficiaries.find((b) => b.id === selectedId);

		const result = await recordBenefitReleaseAction({
			beneficiaryId: selectedId,
			program: beneficiary?.programs[0]?.programId || "4ps",
			assistanceType,
			amount: Number(amount),
			dateReleased: new Date().toISOString().split("T")[0],
			releasingOfficer: "Admin User", // Simplified for now
			remarks: "Processed via Admin Dashboard",
		});

		if (result.success) {
			const data = await getAdminBeneficiariesAction();
			setBeneficiaries(data);
			cancelAction();
		}
		setIsSubmitting(false);
	}

	function cancelAction() {
		setSelectedId(null);
		setActionType(null);
		setRejectReason("");
		setAmount("");
		setAssistanceType("");
	}

	return (
		<div className="min-h-screen bg-background flex flex-col">
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
						<span className="text-sm font-medium">
							Admin: Application Management
						</span>
					</div>
					<Link href="/dashboard">
						<Button variant="outline" size="sm">
							Back to Dashboard
						</Button>
					</Link>
				</div>
			</header>

			<main className="flex-1 p-6 mx-auto w-full max-w-7xl">
				<div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
					<div>
						<h1 className="text-2xl font-bold tracking-tight">
							Beneficiary Applications
						</h1>
						<p className="text-sm text-muted-foreground">
							Review registrations, update status, and record benefit releases.
						</p>
					</div>
					<div className="flex flex-col sm:flex-row gap-3">
						<Select value={filterProgram} onValueChange={setFilterProgram}>
							<SelectTrigger className="w-full sm:w-40 bg-background">
								<SelectValue placeholder="All Programs" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Programs</SelectItem>
								{programsList.map((p) => (
									<SelectItem key={p.id} value={p.id}>
										{p.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Select value={sortBy} onValueChange={setSortBy}>
							<SelectTrigger className="w-full sm:w-56 bg-background">
								<SelectValue placeholder="Sort By" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="date-desc">Date Applied (Newest)</SelectItem>
								<SelectItem value="date-asc">Date Applied (Oldest)</SelectItem>
								<SelectItem value="name-asc">Name (A-Z)</SelectItem>
								<SelectItem value="name-desc">Name (Z-A)</SelectItem>
								<SelectItem value="id-asc">Control Number (A-Z)</SelectItem>
								<SelectItem value="id-desc">Control Number (Z-A)</SelectItem>
								<SelectItem value="location-asc">Location (A-Z)</SelectItem>
								<SelectItem value="location-desc">Location (Z-A)</SelectItem>
								<SelectItem value="program-asc">Program (A-Z)</SelectItem>
								<SelectItem value="program-desc">Program (Z-A)</SelectItem>
								<SelectItem value="status-asc">Status (A-Z)</SelectItem>
								<SelectItem value="status-desc">Status (Z-A)</SelectItem>
							</SelectContent>
						</Select>

						<Input
							placeholder="Search by ID or name..."
							className="w-full sm:w-64 bg-background"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>
				</div>

				<Card>
					<CardContent className="p-0">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Control Number</TableHead>
									<TableHead>Name</TableHead>
									<TableHead>Location</TableHead>
									<TableHead>Program</TableHead>
									<TableHead>Date Applied</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filtered.map((b) => {
									const mainProgram =
										programNames.get(b.programs[0]?.programId || "") ||
										b.programs[0]?.programId ||
										"None";
									const isActionRow = selectedId === b.id;

									return (
										<React.Fragment key={b.id}>
											<TableRow className={isActionRow ? "bg-muted/30" : ""}>
												<TableCell className="font-mono text-xs font-medium">
													{b.id}
												</TableCell>
												<TableCell className="font-medium">
													{b.firstName} {b.lastName}
												</TableCell>
												<TableCell className="text-xs text-muted-foreground">
													{b.municipality}, {b.province}
												</TableCell>
												<TableCell>
													<Badge variant="secondary" className="text-[10px]">
														{mainProgram}
													</Badge>
												</TableCell>
												<TableCell className="text-xs text-muted-foreground">
													{b.dateRegistered}
												</TableCell>
												<TableCell>
													<AdminStatusBadge status={b.applicationStatus} />
												</TableCell>
												<TableCell className="text-right space-x-2">
													<Button
														variant="outline"
														size="sm"
														className="h-7 text-xs"
														onClick={() => {
															setSelectedId(b.id);
															setActionType("status");
															setNewStatus(b.applicationStatus);
														}}
													>
														Update Status
													</Button>
													{(b.applicationStatus === "Approved" ||
														b.applicationStatus === "Released") && (
														<Button
															variant="secondary"
															size="sm"
															className="h-7 text-xs"
															onClick={() => {
																setSelectedId(b.id);
																setActionType("release");
															}}
														>
															Record Release
														</Button>
													)}
												</TableCell>
											</TableRow>

											{/* Inline Action Forms */}
											{isActionRow && actionType === "status" && (
												<TableRow className="bg-muted/30 hover:bg-muted/30">
													<TableCell colSpan={7} className="p-4">
														<form
															onSubmit={handleStatusChange}
															className="flex flex-col sm:flex-row items-end gap-4 bg-background p-4 rounded-lg border"
														>
															<Field className="w-48">
																<FieldLabel>New Status</FieldLabel>
																<Select
																	value={newStatus}
																	onValueChange={(v: ApplicationStatus) =>
																		setNewStatus(v)
																	}
																>
																	<SelectTrigger>
																		<SelectValue />
																	</SelectTrigger>
																	<SelectContent>
																		<SelectItem value="Pending">
																			Pending
																		</SelectItem>
																		<SelectItem value="Approved">
																			Approved
																		</SelectItem>
																		<SelectItem value="Rejected">
																			Rejected
																		</SelectItem>
																		<SelectItem value="Released">
																			Released
																		</SelectItem>
																	</SelectContent>
																</Select>
															</Field>

															{newStatus === "Rejected" && (
																<Field className="flex-1">
																	<FieldLabel>Reason for Rejection</FieldLabel>
																	<Input
																		required
																		value={rejectReason}
																		onChange={(e) =>
																			setRejectReason(e.target.value)
																		}
																		placeholder="e.g., Incomplete documents"
																	/>
																</Field>
															)}

															<div className="flex gap-2 shrink-0">
																<Button
																	type="button"
																	variant="ghost"
																	onClick={cancelAction}
																>
																	Cancel
																</Button>
																<Button type="submit">Save Status</Button>
															</div>
														</form>
													</TableCell>
												</TableRow>
											)}

											{isActionRow && actionType === "release" && (
												<TableRow className="bg-muted/30 hover:bg-muted/30">
													<TableCell colSpan={7} className="p-4">
														<form
															onSubmit={handleRecordRelease}
															className="flex flex-col sm:flex-row items-end gap-4 bg-background p-4 rounded-lg border border-emerald-500/30"
														>
															<div className="w-full sm:w-auto font-semibold text-sm mr-4 shrink-0 text-emerald-600">
																Record Benefit Release
															</div>
															<Field className="w-48">
																<FieldLabel>Assistance Type</FieldLabel>
																<Input
																	required
																	value={assistanceType}
																	onChange={(e) =>
																		setAssistanceType(e.target.value)
																	}
																	placeholder="e.g. Cash Aid"
																/>
															</Field>
															<Field className="w-32">
																<FieldLabel>Amount (₱)</FieldLabel>
																<Input
																	required
																	type="number"
																	min="0"
																	value={amount}
																	onChange={(e) => setAmount(e.target.value)}
																	placeholder="1000"
																/>
															</Field>

															<div className="flex gap-2 shrink-0 ml-auto">
																<Button
																	type="button"
																	variant="ghost"
																	onClick={cancelAction}
																>
																	Cancel
																</Button>
																<Button
																	type="submit"
																	className="bg-emerald-600 hover:bg-emerald-700"
																>
																	Confirm Release
																</Button>
															</div>
														</form>
													</TableCell>
												</TableRow>
											)}
										</React.Fragment>
									);
								})}
								{filtered.length === 0 && (
									<TableRow>
										<TableCell colSpan={7} className="h-24 text-center">
											No applications found.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</main>
		</div>
	);
}
