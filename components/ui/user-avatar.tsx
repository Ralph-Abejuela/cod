"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export function UserAvatar() {
	const { data: session, isPending } = authClient.useSession();
	const router = useRouter();
	const [open, setOpen] = useState(false);

	if (isPending) return null;

	const name = session?.user?.name ?? "U";
	const initials = name.slice(0, 2).toUpperCase();

	const handleLogout = async () => {
		await authClient.signOut();
		setOpen(false);
		router.push("/login");
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<button
					type="button"
					className="flex size-10 items-center justify-center rounded-full bg-zinc-800 text-sm font-medium text-white hover:bg-zinc-700"
				>
					{initials}
				</button>
			</PopoverTrigger>
			<PopoverContent side="bottom" align="end" className="w-56 p-4">
				<div className="flex flex-col gap-3">
					<div>
						<p className="text-sm font-medium">{session?.user?.name}</p>
						<p className="text-xs text-zinc-500">{session?.user?.email}</p>
					</div>
					<Button variant="outline" size="sm" onClick={handleLogout}>
						Logout
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
}
