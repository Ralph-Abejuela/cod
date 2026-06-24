"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

const avatarColors = [
	"bg-red-500",
	"bg-orange-500",
	"bg-amber-500",
	"bg-yellow-500",
	"bg-lime-500",
	"bg-green-500",
	"bg-emerald-500",
	"bg-teal-500",
	"bg-cyan-500",
	"bg-sky-500",
	"bg-blue-500",
	"bg-indigo-500",
	"bg-violet-500",
	"bg-purple-500",
	"bg-fuchsia-500",
	"bg-pink-500",
	"bg-rose-500",
];

function hashString(str: string): number {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	return Math.abs(hash);
}

function getInitials(name: string): string {
	const trimmed = name.trim();
	if (!trimmed) return "??";
	const parts = trimmed.split(/\s+/);
	if (parts.length >= 2) {
		return (parts[0][0] + parts[1][0]).toUpperCase();
	}
	return trimmed.slice(0, 2).toUpperCase();
}

export function UserAvatar() {
	const router = useRouter();
	const { data: session, isPending } = authClient.useSession();

	if (isPending || !session?.user) return null;

	const { user } = session;
	const initials = getInitials(user.name ?? user.email ?? "");
	const colorClass = avatarColors[hashString(user.id) % avatarColors.length];

	async function handleSignOut() {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => router.push("/login"),
			},
		});
	}

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Avatar className="cursor-pointer">
					<AvatarFallback className={colorClass + " text-white"}>
						{initials}
					</AvatarFallback>
				</Avatar>
			</PopoverTrigger>
			<PopoverContent align="end" className="w-56">
				<div className="flex flex-col gap-1 px-1 pt-1">
					<p className="truncate text-sm font-medium">{user.name}</p>
					<p className="truncate text-xs text-muted-foreground">{user.email}</p>
					{user.role && (
						<p className="text-xs text-muted-foreground capitalize">
							{user.role}
						</p>
					)}
				</div>
				<Separator className="my-2" />
				<Button
					variant="ghost"
					className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
					onClick={handleSignOut}
				>
					Sign out
				</Button>
			</PopoverContent>
		</Popover>
	);
}
