import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { validRoles } from "@/lib/permissions";

export async function proxy(request: NextRequest) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	// Admin routes restricted to admin role
	if (
		request.nextUrl.pathname.startsWith("/admin") &&
		session.user.role !== validRoles.admin
	) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login|signup|/|track).*)"],
};
