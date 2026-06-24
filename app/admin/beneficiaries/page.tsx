"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
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
	updateBeneficiaryAction,
	deleteBeneficiaryAction,
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
	const [filterStatus, setFilterStatus] = useState("all");

	// States for actions (mocking modal behavior with inline forms for simplicity)
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [actionType, setActionType] = useState<"status" | "release" | null>(
		null,
	);
	const [editTarget, setEditTarget] = useState<Beneficiary | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<Beneficiary | null>(null);
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
			const matchesProgram =
				filterProgram === "all" || mainProgram === filterProgram;

			const matchesStatus =
				filterStatus === "all" || b.applicationStatus === filterStatus;

			return matchesSearch && matchesProgram && matchesStatus;
		})
		.sort((a, b) => {
			if (sortBy === "date-desc") {
				return (
					new Date(b.dateRegistered).getTime() -
					new Date(a.dateRegistered).getTime()
				);
			} else if (sortBy === "date-asc") {
				return (
					new Date(a.dateRegistered).getTime() -
					new Date(b.dateRegistered).getTime()
				);
			} else if (sortBy === "name-asc") {
				return (
					a.lastName.localeCompare(b.lastName) ||
					a.firstName.localeCompare(b.firstName)
				);
			} else if (sortBy === "name-desc") {
				return (
					b.lastName.localeCompare(a.lastName) ||
					b.firstName.localeCompare(a.firstName)
				);
			} else if (sortBy === "id-asc") {
				return a.id.localeCompare(b.id);
			} else if (sortBy === "id-desc") {
				return b.id.localeCompare(a.id);
			} else if (sortBy === "location-asc") {
				return (
					a.province.localeCompare(b.province) ||
					a.municipality.localeCompare(b.municipality)
				);
			} else if (sortBy === "location-desc") {
				return (
					b.province.localeCompare(a.province) ||
					b.municipality.localeCompare(a.municipality)
				);
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

	async function handleEditSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!editTarget) return;
		setIsSubmitting(true);

		const formData = new FormData(e.currentTarget);
		const data = {
			firstName: formData.get("firstName") as string,
			lastName: formData.get("lastName") as string,
			province: formData.get("province") as string,
			municipality: formData.get("municipality") as string,
			barangay: formData.get("barangay") as string,
			contactNumber: formData.get("contactNumber") as string,
		};
		const programId = formData.get("programId") as string;

		const result = await updateBeneficiaryAction(
			editTarget.id,
			data,
			programId,
		);
		if (result.success) {
			const updated = await getAdminBeneficiariesAction();
			setBeneficiaries(updated);
			setEditTarget(null);
		}
		setIsSubmitting(false);
	}

	async function handleDelete() {
		if (!deleteTarget) return;
		setIsSubmitting(true);
		const result = await deleteBeneficiaryAction(deleteTarget.id);
		if (result.success) {
			const updated = await getAdminBeneficiariesAction();
			setBeneficiaries(updated);
			setDeleteTarget(null);
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
		<>
			<div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">
						Beneficiary Applications
					</h1>
					<p className="text-sm text-muted-foreground">
						Review registrations, update status, and record benefit releases.
					</p>
				</div>
				<div className="flex flex-col sm:flex-row flex-wrap gap-3">
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

					<Select value={filterStatus} onValueChange={setFilterStatus}>
						<SelectTrigger className="w-full sm:w-40 bg-background">
							<SelectValue placeholder="All Statuses" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Statuses</SelectItem>
							<SelectItem value="Pending">Pending</SelectItem>
							<SelectItem value="Approved">Approved</SelectItem>
							<SelectItem value="Released">Released</SelectItem>
							<SelectItem value="Rejected">Rejected</SelectItem>
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
													Status
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
														Release
													</Button>
												)}
												<Button
													variant="outline"
													size="sm"
													className="h-7 text-xs"
													onClick={() => setEditTarget(b)}
												>
													Edit
												</Button>
												<Button
													variant="destructive"
													size="sm"
													className="h-7 text-xs"
													onClick={() => setDeleteTarget(b)}
												>
													Delete
												</Button>
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

			<Dialog
				open={!!editTarget}
				onOpenChange={(open) => !open && setEditTarget(null)}
			>
				<DialogContent className="sm:max-w-[500px]">
					<DialogHeader>
						<DialogTitle>Edit Beneficiary</DialogTitle>
						<DialogDescription>
							Update basic information for {editTarget?.firstName}{" "}
							{editTarget?.lastName}.
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
						<div className="grid grid-cols-2 gap-4">
							<Field>
								<FieldLabel>First Name</FieldLabel>
								<Input
									name="firstName"
									defaultValue={editTarget?.firstName}
									required
								/>
							</Field>
							<Field>
								<FieldLabel>Last Name</FieldLabel>
								<Input
									name="lastName"
									defaultValue={editTarget?.lastName}
									required
								/>
							</Field>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<Field>
								<FieldLabel>Contact Number</FieldLabel>
								<Input
									name="contactNumber"
									defaultValue={editTarget?.contactNumber}
									required
								/>
							</Field>
							<Field>
								<FieldLabel>Barangay</FieldLabel>
								<Input
									name="barangay"
									defaultValue={editTarget?.barangay}
									required
								/>
							</Field>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<Field>
								<FieldLabel>Municipality</FieldLabel>
								<Input
									name="municipality"
									defaultValue={editTarget?.municipality}
									required
								/>
							</Field>
							<Field>
								<FieldLabel>Province</FieldLabel>
								<Input
									name="province"
									defaultValue={editTarget?.province}
									required
								/>
							</Field>
						</div>
						<div className="grid grid-cols-1 gap-4">
							<Field>
								<FieldLabel>Program</FieldLabel>
								<Select
									name="programId"
									defaultValue={editTarget?.programs?.[0]?.programId}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select a program" />
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
						</div>
						<DialogFooter className="mt-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => setEditTarget(null)}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting ? "Saving..." : "Save Changes"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<Dialog
				open={!!deleteTarget}
				onOpenChange={(open) => !open && setDeleteTarget(null)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Beneficiary</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete{" "}
							<strong>
								{deleteTarget?.firstName} {deleteTarget?.lastName}
							</strong>
							? This will permanently remove their application and any
							associated release records. This action cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setDeleteTarget(null)}
							disabled={isSubmitting}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleDelete}
							disabled={isSubmitting}
						>
							{isSubmitting ? "Deleting..." : "Delete Permanently"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
