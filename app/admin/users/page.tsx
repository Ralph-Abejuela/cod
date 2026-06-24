import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import UsersTable from "@/components/UsersTable";

export default async function AdminUsersPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	return <UsersTable currentUserId={session?.user.id} />;
}
