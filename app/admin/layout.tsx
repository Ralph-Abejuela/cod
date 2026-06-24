import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserAvatar } from "@/components/user-avatar";

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
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
						<span className="text-sm font-medium">Admin Panel</span>
					</div>
					<div className="flex items-center gap-3">
						<Link href="/dashboard">
							<Button variant="outline" size="sm">
								Back to Dashboard
							</Button>
						</Link>
						<UserAvatar />

					</div>
				</div>
			</header>
			<main className="flex-1 p-6 mx-auto w-full max-w-7xl">{children}</main>
		</div>
	);
}
