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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { getDashboardStatsAction } from "@/app/actions/beneficiary";
import { UserAvatar } from "@/components/user-avatar";

// --- Mock data ---
const summaryStats = [
  { title: "Total Beneficiaries", value: "1,284", change: "+12 this month", trend: "up" },
  { title: "Active Applications", value: "56", change: "+3 this week", trend: "up" },
  { title: "Pending Reviews", value: "18", change: "5 urgent", trend: "warn" },
  { title: "Total Released", value: "₱ 12M", change: "₱ 1.2M this month", trend: "up" },
];

const recentActivity = [
  { id: "ACT-001", user: "Maria Santos", action: "Approved Application", status: "Approved", date: "2026-06-24" },
  { id: "ACT-002", user: "Juan Cruz", action: "Submitted Application", status: "Pending", date: "2026-06-24" },
  { id: "ACT-003", user: "Ana Reyes", action: "Released Cash Aid", status: "Completed", date: "2026-06-23" },
  { id: "ACT-004", user: "Carlos Tan", action: "Rejected Application", status: "Under Review", date: "2026-06-23" },
  { id: "ACT-005", user: "Liza Gomez", action: "Released Pension", status: "Completed", date: "2026-06-22" },
];

const programStats = [
  { name: "4Ps", count: 342, pending: 89 },
  { name: "Senior Citizen", count: 256, pending: 41 },
  { name: "PWD", count: 48, pending: 12 },
  { name: "Solo Parent", count: 180, pending: 55 },
  { name: "TUPAD", count: 310, pending: 73 },
  { name: "AICS", count: 148, pending: 22 },
];

const teamMembers = [
  { name: "Dir. Jose Manalo", role: "Admin", initials: "JM" },
  { name: "Dir. Ana Reyes", role: "Releasing Officer", initials: "AR" },
  { name: "Engr. Pedro Santos", role: "Reviewer", initials: "PS" },
  { name: "Carlos Tan", role: "Clerk", initials: "CT" },
];

function getStatusVariant(status: string) {
  switch (status) {
    case "Completed":
      return "secondary" as const;
    case "Pending":
      return "outline" as const;
    case "Under Review":
      return "destructive" as const;
    case "Approved":
      return "default" as const;
    default:
      return "secondary" as const;
  }
}

export default async function DashboardPage() {
  const stats = await getDashboardStatsAction();
  
  const summaryStats = [
    { title: "Total Beneficiaries", value: stats?.totalBeneficiaries || 0, change: "Registered in system" },
    { title: "Active Applications", value: stats?.activeApps || 0, change: "Pending or Approved" },
    { title: "Pending Reviews", value: stats?.pendingReviews || 0, change: "Needs admin action" },
    { title: "Total Released", value: `₱ ${(stats?.totalReleased || 0).toLocaleString()}`, change: "Total benefits distributed" },
  ];

  const recentActivity = [
    { id: "ACT-001", user: "Maria Santos", action: "Approved Application", status: "Approved", date: "2026-06-24" },
    { id: "ACT-002", user: "Juan Cruz", action: "Submitted Application", status: "Pending", date: "2026-06-24" },
    { id: "ACT-003", user: "Ana Reyes", action: "Released Cash Aid", status: "Completed", date: "2026-06-23" },
    { id: "ACT-004", user: "Carlos Tan", action: "Rejected Application", status: "Under Review", date: "2026-06-23" },
    { id: "ACT-005", user: "Liza Gomez", action: "Released Pension", status: "Completed", date: "2026-06-22" },
  ];

  const programStats = stats?.programs || [];
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold tracking-tight">Community Assist</h1>
          </div>
          <nav className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">Dashboard</Button>
            </Link>
            <Link href="/admin/beneficiaries">
              <Button variant="ghost" size="sm" className="font-semibold">Manage Beneficiaries</Button>
            </Link>
            <Link href="/report">
              <Button variant="ghost" size="sm">Reports</Button>
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
          </TabsList>

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
                        <TableCell className="text-right">{item.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="justify-between">
                <p className="text-xs text-muted-foreground">
                  Showing 5 of 128 entries
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
                      {cat.count} total &middot; {cat.pending} pending applications
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
                      {Math.round((cat.pending / cat.count) * 100)}% applications pending review
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
