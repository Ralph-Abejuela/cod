import Link from "next/link";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getDashboardStatsAction, getRecentActivityAction, getTeamMembersAction } from "@/app/actions/beneficiary";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { validRoles } from "@/lib/permissions";
import { GlobalSearch } from "@/components/GlobalSearch";
import { UserAvatar } from "@/components/user-avatar";
import ProgramsTable from "@/components/ProgramsTable";

export default async function DashboardPage() {
	const [session, stats, recentActivityData, teamData] = await Promise.all([
		auth.api.getSession({ headers: await headers() }),
		getDashboardStatsAction(),
		getRecentActivityAction(),
		getTeamMembersAction(),
	]);
	const isAdmin = session?.user.role === validRoles.admin;

	const summaryStats = [
		{
			title: "Total Beneficiaries",
			value: stats?.totalBeneficiaries || 0,
			change: "Registered in system",
		},
		{
			title: "Active Applications",
			value: stats?.activeApps || 0,
			change: "Pending or Approved",
		},
		{
			title: "Pending Reviews",
			value: stats?.pendingReviews || 0,
			change: "Needs admin action",
		},
		{
			title: "Total Released",
			value: `P ${(stats?.totalReleased || 0).toLocaleString()}`,
			change: "Total benefits distributed",
		},
	];

	const recentActivity = recentActivityData || [];

	const programStats = stats?.programs || [];

	const getStatusVariant = (status: string) => {
		switch (status) {
			case "Completed":
			case "Released":
				return "secondary" as const;
			case "Pending":
				return "outline" as const;
			case "Rejected":
			case "Under Review":
				return "destructive" as const;
			case "Approved":
				return "default" as const;
			default:
				return "secondary" as const;
		}
	};

	const teamMembers = (teamData || []).map((u) => ({
		name: u.name || "Unknown User",
		role: u.role || "User",
		initials: (u.name || "U").substring(0, 2).toUpperCase(),
		image: u.image,
	}));

	return (
		<div className="flex min-h-screen flex-col bg-background">
			{/* Header */}
			<header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
					<div className="flex items-center gap-3">
						<h1 className="text-lg font-semibold tracking-tight">
							Community Assist
						</h1>
						<GlobalSearch />
					</div>
					<nav className="flex items-center gap-2">
						<Link href="/dashboard">
							<Button variant="ghost" size="sm">
								Dashboard
							</Button>
						</Link>
						{isAdmin && (
							<Link href="/admin/beneficiaries">
								<Button variant="ghost" size="sm" className="font-semibold">
									Manage Beneficiaries
								</Button>
							</Link>
						)}
						{isAdmin && (
							<Link href="/admin/users">
								<Button variant="ghost" size="sm">
									Manage Users
								</Button>
							</Link>
						)}
						<Link href="/report">
							<Button variant="ghost" size="sm">
								Reports
							</Button>
						</Link>
						<Separator orientation="vertical" className="mx-1 h-5" />
						<UserAvatar />
					</nav>
				</div>
			</header>

			{/* Main Content */}
			<main className="mx-auto w-full max-w-7xl flex-1 space-y-6 px-6 py-6">
				{/* Page Title */}
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
						<p className="text-sm text-muted-foreground">
							Centralized Assistance Management System overview
						</p>
					</div>
					<Link href="/beneficiary">
						<Button size="sm">+ New Beneficiary (Public Portal)</Button>
					</Link>
				</div>

				{/* Summary Cards */}
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{summaryStats.map((stat) => (
						<Card key={stat.title} size="sm">
							<CardHeader>
								<CardDescription>{stat.title}</CardDescription>
								<CardTitle className="text-2xl">{stat.value}</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-xs text-muted-foreground">{stat.change}</p>
							</CardContent>
						</Card>
					))}
				</div>

				<Separator />

				{/* Tabs Section */}
				<Tabs defaultValue="activity">
					<TabsList>
						<TabsTrigger value="activity">Recent Activity</TabsTrigger>
						<TabsTrigger value="programs">Program Stats</TabsTrigger>
						<TabsTrigger value="team">Team</TabsTrigger>
						{isAdmin && (
							<TabsTrigger value="programs-manage">Manage Programs</TabsTrigger>
						)}
					</TabsList>

					{isAdmin && (
						<TabsContent value="programs-manage">
							<ProgramsTable />
						</TabsContent>
					)}

					{/* Tab: Recent Activity */}
					<TabsContent value="activity">
						<Card>
							<CardHeader>
								<CardTitle>Recent Activity</CardTitle>
								<CardDescription>
									Latest application updates and benefit releases.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>ID</TableHead>
											<TableHead>User</TableHead>
											<TableHead>Action</TableHead>
											<TableHead>Status</TableHead>
											<TableHead className="text-right">Date</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{recentActivity.map((item) => (
											<TableRow key={item.id}>
												<TableCell className="font-medium">{item.id}</TableCell>
												<TableCell>{item.user}</TableCell>
												<TableCell>{item.action}</TableCell>
												<TableCell>
													<Badge variant={getStatusVariant(item.status)}>
														{item.status}
													</Badge>
												</TableCell>
												<TableCell className="text-right">
													{item.date}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</CardContent>
							<CardFooter className="justify-between">
								<p className="text-xs text-muted-foreground">
									Showing {recentActivity.length} recent entries
								</p>
								<Button variant="outline" size="sm">
									View All
								</Button>
							</CardFooter>
						</Card>
					</TabsContent>

					{/* Tab: Program Stats */}
					<TabsContent value="programs">
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{programStats.map((cat) => (
								<Card key={cat.name}>
									<CardHeader>
										<CardTitle>{cat.name}</CardTitle>
										<CardDescription>
											{cat.count} total &middot; {cat.pending} pending
											applications
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="h-2 w-full overflow-hidden rounded-full bg-muted">
											<div
												className="h-full rounded-full bg-primary transition-all"
												style={{
													width: `${Math.round((cat.pending / cat.count) * 100)}%`,
												}}
											/>
										</div>
										<p className="mt-2 text-xs text-muted-foreground">
											{Math.round((cat.pending / cat.count) * 100)}%
											applications pending review
										</p>
									</CardContent>
								</Card>
							))}
						</div>
					</TabsContent>

					{/* Tab: Team */}
					<TabsContent value="team">
						<Card>
							<CardHeader>
								<CardTitle>Team Members</CardTitle>
								<CardDescription>
									People managing and verifying applications.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="grid gap-4 sm:grid-cols-2">
									{teamMembers.map((member) => (
										<div
											key={member.name}
											className="flex items-center gap-3 rounded-lg border p-3"
										>
											<Avatar>
												<AvatarFallback>{member.initials}</AvatarFallback>
											</Avatar>
											<div className="flex-1">
												<p className="text-sm font-medium">{member.name}</p>
												<p className="text-xs text-muted-foreground">
													{member.role}
												</p>
											</div>
											<Badge variant="secondary">{member.role}</Badge>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</main>
		</div>
	);
}
