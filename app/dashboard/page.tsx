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

// --- Mock data ---
const summaryStats = [
  { title: "Total Assets", value: "1,284", change: "+12 this month", trend: "up" },
  { title: "Active Users", value: "56", change: "+3 this week", trend: "up" },
  { title: "Pending Requests", value: "18", change: "5 urgent", trend: "warn" },
  { title: "Maintenance Due", value: "7", change: "2 overdue", trend: "down" },
];

const recentActivity = [
  { id: "ACT-001", user: "Maria Santos", action: "Checked out Laptop #L-0421", status: "Completed", date: "2026-06-24" },
  { id: "ACT-002", user: "Juan Cruz", action: "Requested Projector #P-0088", status: "Pending", date: "2026-06-24" },
  { id: "ACT-003", user: "Ana Reyes", action: "Returned Tablet #T-0215", status: "Completed", date: "2026-06-23" },
  { id: "ACT-004", user: "Carlos Tan", action: "Reported damage on Monitor #M-0312", status: "Under Review", date: "2026-06-23" },
  { id: "ACT-005", user: "Liza Gomez", action: "Requested Desktop #D-0190", status: "Approved", date: "2026-06-22" },
];

const assetCategories = [
  { name: "Laptops", count: 342, available: 89 },
  { name: "Desktops", count: 256, available: 41 },
  { name: "Projectors", count: 48, available: 12 },
  { name: "Tablets", count: 180, available: 55 },
  { name: "Monitors", count: 310, available: 73 },
  { name: "Printers", count: 148, available: 22 },
];

const teamMembers = [
  { name: "Maria Santos", role: "IT Admin", initials: "MS" },
  { name: "Juan Cruz", role: "Asset Manager", initials: "JC" },
  { name: "Ana Reyes", role: "Technician", initials: "AR" },
  { name: "Carlos Tan", role: "Technician", initials: "CT" },
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

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold tracking-tight">CAMS</h1>
            <Badge variant="outline" className="text-[10px]">
              v1.0
            </Badge>
          </div>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              Dashboard
            </Button>
            <Button variant="ghost" size="sm">
              Assets
            </Button>
            <Button variant="ghost" size="sm">
              Reports
            </Button>
            <Separator orientation="vertical" className="mx-1 h-5" />
            <Avatar className="h-7 w-7">
              <AvatarImage src="" alt="User" />
              <AvatarFallback className="text-[10px]">AD</AvatarFallback>
            </Avatar>
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
              Centralized Asset Management System overview
            </p>
          </div>
          <Button size="sm">+ New Asset</Button>
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
            <TabsTrigger value="assets">Asset Categories</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>

          {/* Tab: Recent Activity */}
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest asset transactions and requests across the system.
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

          {/* Tab: Asset Categories */}
          <TabsContent value="assets">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {assetCategories.map((cat) => (
                <Card key={cat.name}>
                  <CardHeader>
                    <CardTitle>{cat.name}</CardTitle>
                    <CardDescription>
                      {cat.count} total &middot; {cat.available} available
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Simple progress-like bar */}
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{
                          width: `${Math.round((cat.available / cat.count) * 100)}%`,
                        }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {Math.round((cat.available / cat.count) * 100)}% available
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
                  People managing and maintaining assets.
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
