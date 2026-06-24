"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Field, FieldLabel } from "@/components/ui/field";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { ProgramItem } from "@/lib/beneficiary-data";
import {
	getProgramsAction,
	createProgramAction,
	updateProgramAction,
	deleteProgramAction,
} from "@/app/actions/program";

function ProgramsTable() {
	const [programs, setPrograms] = useState<ProgramItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [actionType, setActionType] = useState<"create" | "edit" | null>(null);
	const [editId, setEditId] = useState<string | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<ProgramItem | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formError, setFormError] = useState<string | null>(null);

	const loadPrograms = () => {
		getProgramsAction().then((data) => {
			setPrograms(data);
			setIsLoading(false);
		});
	};

	// Initial load
	useEffect(() => {
		loadPrograms();
	}, []);

	const filtered = programs.filter(
		(p) =>
			p.id.toLowerCase().includes(search.toLowerCase()) ||
			p.name.toLowerCase().includes(search.toLowerCase()) ||
			(p.description || "").toLowerCase().includes(search.toLowerCase()),
	);

	async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setIsSubmitting(true);
		setFormError(null);

		const formData = new FormData(e.currentTarget);
		const result = await createProgramAction(formData);

		if (result.success) {
			setActionType(null);
			loadPrograms();
		} else if (result.error) {
			setFormError(result.error);
		}
		setIsSubmitting(false);
	}

	async function handleEdit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!editId) return;
		setIsSubmitting(true);
		setFormError(null);

		const formData = new FormData(e.currentTarget);
		const result = await updateProgramAction(editId, formData);

		if (result.success) {
			setActionType(null);
			setEditId(null);
			loadPrograms();
		} else if (result.error) {
			setFormError(result.error);
		}
		setIsSubmitting(false);
	}

	async function handleDelete(program: ProgramItem) {
		const result = await deleteProgramAction(program.id);
		if (result.success) {
			loadPrograms();
		}
		setDeleteTarget(null);
	}

	function openEdit(program: ProgramItem) {
		setEditId(program.id);
		setActionType("edit");
	}

	function cancelForm() {
		setActionType(null);
		setEditId(null);
		setFormError(null);
	}

	return (
		<>
			<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Programs</h1>
					<p className="text-sm text-muted-foreground">
						Manage government programs available for beneficiary enrollment.
					</p>
				</div>
				<div className="flex gap-3">
					<Input
						placeholder="Search by ID, name, or description..."
						className="w-full sm:w-64"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
					<Button
						onClick={() => {
							cancelForm();
							setActionType(actionType === "create" ? null : "create");
						}}
						disabled={actionType === "edit"}
					>
						+ Add Program
					</Button>
				</div>
			</div>

			<Card>
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-40">ID</TableHead>
								<TableHead>Name</TableHead>
								<TableHead>Description</TableHead>
								<TableHead className="text-right w-48">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{/* Inline Create Row */}
							{actionType === "create" && (
								<TableRow className="bg-muted/30">
									<TableCell colSpan={4} className="p-4">
										<form
											onSubmit={handleCreate}
											className="flex flex-col gap-4 bg-background p-4 rounded-lg border"
										>
											<p className="text-sm font-semibold text-foreground">
												New Program
											</p>
											<div className="grid gap-4 sm:grid-cols-3">
												<Field>
													<FieldLabel htmlFor="prog-id">ID (slug)</FieldLabel>
													<Input
														id="prog-id"
														name="id"
														placeholder="e.g. senior-citizen"
														required
													/>
												</Field>
												<Field>
													<FieldLabel htmlFor="prog-name">Name</FieldLabel>
													<Input
														id="prog-name"
														name="name"
														placeholder="e.g. Senior Citizen"
														required
													/>
												</Field>
												<Field>
													<FieldLabel htmlFor="prog-desc">
														Description
													</FieldLabel>
													<Textarea
														id="prog-desc"
														name="description"
														placeholder="Brief description"
														rows={1}
													/>
												</Field>
											</div>
											{formError && (
												<p className="text-xs text-destructive">
													{formError}
												</p>
											)}
											<div className="flex gap-2 justify-end">
												<Button
													type="button"
													variant="ghost"
													onClick={cancelForm}
												>
													Cancel
												</Button>
												<Button type="submit" disabled={isSubmitting}>
													{isSubmitting ? "Saving..." : "Save Program"}
												</Button>
											</div>
										</form>
									</TableCell>
								</TableRow>
							)}

							{isLoading ? (
								<TableRow>
									<TableCell
										colSpan={4}
										className="h-24 text-center text-muted-foreground"
									>
										Loading...
									</TableCell>
								</TableRow>
							) : filtered.length === 0 ? (
								<TableRow>
									<TableCell colSpan={4} className="h-24 text-center">
										No programs found.
									</TableCell>
								</TableRow>
							) : (
								filtered.map((program) => {
									const isEditing =
										actionType === "edit" && editId === program.id;

									return (
										<TableRow
											key={program.id}
											className={isEditing ? "bg-muted/30" : ""}
										>
											{isEditing ? (
												<TableCell colSpan={4} className="p-4">
													<form
														onSubmit={handleEdit}
														className="flex flex-col gap-4 bg-background p-4 rounded-lg border"
													>
														<p className="text-sm font-semibold text-foreground">
															Edit:{" "}
															<span className="font-mono text-xs text-muted-foreground">
																{program.id}
															</span>
														</p>
														<div className="grid gap-4 sm:grid-cols-2">
															<Field>
																<FieldLabel htmlFor="edit-name">
																	Name
																</FieldLabel>
																<Input
																	id="edit-name"
																	name="name"
																	defaultValue={program.name}
																	required
																/>
															</Field>
															<Field>
																<FieldLabel htmlFor="edit-desc">
																	Description
																</FieldLabel>
																<Textarea
																	id="edit-desc"
																	name="description"
																	defaultValue={program.description || ""}
																	rows={1}
																/>
															</Field>
														</div>
														{formError && (
															<p className="text-xs text-destructive">
																{formError}
															</p>
														)}
														<div className="flex gap-2 justify-end">
															<Button
																type="button"
																variant="ghost"
																onClick={cancelForm}
															>
																Cancel
															</Button>
															<Button type="submit" disabled={isSubmitting}>
																{isSubmitting ? "Saving..." : "Update Program"}
															</Button>
														</div>
													</form>
												</TableCell>
											) : (
												<>
													<TableCell>
														<code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono font-medium">
															{program.id}
														</code>
													</TableCell>
													<TableCell className="font-medium">
														{program.name}
													</TableCell>
													<TableCell className="text-sm text-muted-foreground max-w-md truncate">
														{program.description || (
															<span className="italic">No description</span>
														)}
													</TableCell>
													<TableCell className="text-right space-x-2">
														<Button
															variant="outline"
															size="sm"
															className="h-7 text-xs"
															onClick={() => {
																cancelForm();
																openEdit(program);
															}}
															disabled={actionType === "create"}
														>
															Edit
														</Button>
														<Button
															variant="destructive"
															size="sm"
															className="h-7 text-xs"
															onClick={() => setDeleteTarget(program)}
															disabled={actionType === "create"}
														>
															Delete
														</Button>
													</TableCell>
												</>
											)}
										</TableRow>
									);
								})
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			{/* Delete Confirmation Dialog */}
			<Dialog
				open={!!deleteTarget}
				onOpenChange={(open) => !open && setDeleteTarget(null)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Program</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete{" "}
							<strong>{deleteTarget?.name}</strong>?
							<br />
							This action cannot be undone. If any beneficiaries are enrolled in
							this program, the deletion will fail.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => setDeleteTarget(null)}>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={() => deleteTarget && handleDelete(deleteTarget)}
						>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}

export default function AdminProgramsPage() {
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
							Admin: Program Management
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
				<ProgramsTable />
			</main>
		</div>
	);
}
