"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
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
import { validRoles } from "@/lib/permissions";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import {
	getUsersAction,
	updateUserAction,
	toggleBanUserAction,
	type UserRow,
} from "@/app/actions/user";

export default function UsersTable({
	currentUserId,
}: {
	currentUserId?: string;
}) {
	const [users, setUsers] = useState<UserRow[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [editId, setEditId] = useState<string | null>(null);
	const [banTarget, setBanTarget] = useState<UserRow | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formError, setFormError] = useState<string | null>(null);
	const [showExtra, setShowExtra] = useState(false);

	const loadUsers = () => {
		getUsersAction().then((data) => {
			setUsers(data);
			setIsLoading(false);
		});
	};

	useEffect(() => {
		loadUsers();
	}, []);

	const filtered = users.filter(
		(u) =>
			u.id.toLowerCase().includes(search.toLowerCase()) ||
			u.name.toLowerCase().includes(search.toLowerCase()) ||
			u.email.toLowerCase().includes(search.toLowerCase()) ||
			(u.role || "").toLowerCase().includes(search.toLowerCase()),
	);

	const roleBadge = (role: string | null) => {
		switch (role) {
			case "admin":
				return <Badge variant="default">{role}</Badge>;
			case "staff":
				return <Badge variant="secondary">{role}</Badge>;
			default:
				return <Badge variant="outline">{role || "user"}</Badge>;
		}
	};

	async function handleEdit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!editId) return;
		setIsSubmitting(true);
		setFormError(null);

		const formData = new FormData(e.currentTarget);
		const result = await updateUserAction(editId, formData);

		if (result.success) {
			setEditId(null);
			loadUsers();
		} else if (result.error) {
			setFormError(result.error);
		}
		setIsSubmitting(false);
	}

	async function handleToggleBan(user: UserRow) {
		const result = await toggleBanUserAction(user.id, !user.banned);
		if (result.error) {
			setFormError(result.error);
		} else {
			loadUsers();
		}
		setBanTarget(null);
	}

	function cancelForm() {
		setEditId(null);
		setFormError(null);
	}

	const formatDate = (d: Date) =>
		new Date(d).toLocaleDateString("en-PH", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});

	return (
		<>
			<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Users</h1>
					<p className="text-sm text-muted-foreground">
						Manage user accounts, roles, and account status.
					</p>
				</div>
				<div className="flex gap-3">
					<Input
						placeholder="Search by name, email, or role..."
						className="w-full sm:w-64"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
					<Button
						variant="outline"
						size="icon"
						onClick={() => setShowExtra(!showExtra)}
						title="Toggle extra columns"
					>
						{showExtra ? (
							<EyeOffIcon className="size-4" />
						) : (
							<EyeIcon className="size-4" />
						)}
					</Button>
				</div>
			</div>

			<Card>
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>Role</TableHead>
								<TableHead>Status</TableHead>
								{showExtra && (
									<>
										<TableHead>Email Verified</TableHead>
										<TableHead>Created At</TableHead>
									</>
								)}
								<TableHead className="text-right w-52">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{isLoading ? (
								<TableRow>
									<TableCell
										colSpan={showExtra ? 7 : 5}
										className="h-24 text-center text-muted-foreground"
									>
										Loading...
									</TableCell>
								</TableRow>
							) : filtered.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={showExtra ? 7 : 5}
										className="h-24 text-center"
									>
										No users found.
									</TableCell>
								</TableRow>
							) : (
								filtered.map((user) => {
									const isEditing = editId === user.id;

									return (
										<TableRow
											key={user.id}
											className={
												isEditing
													? "bg-muted/30"
													: user.banned
														? "opacity-60"
														: ""
											}
										>
											{isEditing ? (
												<TableCell colSpan={showExtra ? 7 : 5} className="p-4">
													<form
														onSubmit={handleEdit}
														className="flex flex-col gap-4 bg-background p-4 rounded-lg border"
													>
														<p className="text-sm font-semibold text-foreground">
															Edit:{" "}
															<span className="font-mono text-xs text-muted-foreground">
																{user.id}
															</span>
														</p>
														<div className="grid gap-4 sm:grid-cols-3">
															<Field>
																<FieldLabel htmlFor="edit-name">
																	Name
																</FieldLabel>
																<Input
																	id="edit-name"
																	name="name"
																	defaultValue={user.name}
																	required
																/>
															</Field>
															<Field>
																<FieldLabel htmlFor="edit-email">
																	Email
																</FieldLabel>
																<Input
																	id="edit-email"
																	name="email"
																	type="email"
																	defaultValue={user.email}
																	required
																/>
															</Field>
															<Field>
																<FieldLabel htmlFor="edit-role">
																	Role
																</FieldLabel>
																{user.role === validRoles.admin ? (
																	<div className="flex h-8 w-full items-center rounded-lg border border-input bg-muted px-2.5 text-sm text-muted-foreground">
																		admin
																	</div>
																) : (
																	<select
																		id="edit-role"
																		name="role"
																		defaultValue={user.role || "user"}
																		className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30"
																	>
																		{Object.keys(validRoles)
																			.filter((r) => r !== validRoles.admin)
																			.map((r) => (
																				<option key={r} value={r}>
																					{r}
																				</option>
																			))}
																	</select>
																)}
															</Field>
														</div>
														<div className="flex items-center gap-2">
															<input
																type="hidden"
																name="banned"
																value={user.banned ? "true" : "false"}
															/>
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
																{isSubmitting ? "Saving..." : "Save"}
															</Button>
														</div>
													</form>
												</TableCell>
											) : (
												<>
													<TableCell className="font-medium">
														{user.name}
													</TableCell>
													<TableCell className="text-sm text-muted-foreground">
														{user.email}
													</TableCell>
													<TableCell>{roleBadge(user.role)}</TableCell>
													<TableCell>
														{user.banned ? (
															<Badge variant="destructive">Deactivated</Badge>
														) : (
															<Badge variant="ghost">Active</Badge>
														)}
													</TableCell>
													{showExtra && (
														<>
															<TableCell className="text-sm">
																{user.emailVerified ? (
																	<Badge variant="ghost">Verified</Badge>
																) : (
																	<Badge variant="outline">Unverified</Badge>
																)}
															</TableCell>
															<TableCell className="text-sm text-muted-foreground">
																{formatDate(user.createdAt)}
															</TableCell>
														</>
													)}
													<TableCell className="text-right space-x-2">
														<Button
															variant="outline"
															size="sm"
															className="h-7 text-xs"
															onClick={() => setEditId(user.id)}
															disabled={user.role === validRoles.admin}
															title={
																user.role === validRoles.admin
																	? "Admin role cannot be edited"
																	: undefined
															}
														>
															Edit
														</Button>
														<Button
															variant={user.banned ? "outline" : "destructive"}
															size="sm"
															className="h-7 text-xs"
															onClick={() => setBanTarget(user)}
															disabled={user.id === currentUserId}
															title={
																user.id === currentUserId
																	? "Cannot deactivate yourself"
																	: undefined
															}
														>
															{user.banned ? "Reactivate" : "Deactivate"}
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

			<Dialog
				open={!!banTarget}
				onOpenChange={(open) => !open && setBanTarget(null)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{banTarget?.banned ? "Reactivate User" : "Deactivate User"}
						</DialogTitle>
						<DialogDescription>
							{banTarget?.banned ? (
								<>
									Reactivate <strong>{banTarget?.name}</strong>? They will be
									able to log in again.
								</>
							) : (
								<>
									Deactivate <strong>{banTarget?.name}</strong>? They will not
									be able to log in until reactivated.
								</>
							)}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => setBanTarget(null)}>
							Cancel
						</Button>
						<Button
							variant={banTarget?.banned ? "default" : "destructive"}
							onClick={() => banTarget && handleToggleBan(banTarget)}
						>
							{banTarget?.banned ? "Reactivate" : "Deactivate"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
