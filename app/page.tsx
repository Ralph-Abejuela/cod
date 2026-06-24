import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
	return (
		<div className="flex flex-col min-h-screen bg-[#fafaf9] font-sans text-zinc-900 selection:bg-zinc-200">
			{/* Navbar */}
			<header className="flex h-16 w-full items-center justify-between px-6 sm:px-12 bg-white border-b border-zinc-100">
				<div className="flex items-center gap-2">
					<div className="h-6 w-6 rounded bg-zinc-900 flex items-center justify-center">
						<span className="text-white text-xs font-bold leading-none">CA</span>
					</div>
					<span className="text-lg font-semibold tracking-tight text-zinc-900">
						Community Assist
					</span>
				</div>

				<div className="flex gap-3">
					<Link href="/login">
						<Button variant="ghost" className="text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100">Log in</Button>
					</Link>
					<Link href="/track">
						<Button className="bg-zinc-900 text-white hover:bg-zinc-800">Track Application</Button>
					</Link>
				</div>
			</header>

			{/* Hero Section */}
			<main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 sm:py-32">
				<div className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm font-medium text-zinc-600 mb-8 shadow-sm">
					Welcome home
				</div>
				<h1 className="max-w-4xl text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-zinc-900 mb-6 leading-[1.1]">
					Everyone deserves to feel welcomed.
				</h1>
				<p className="max-w-2xl text-lg sm:text-xl text-zinc-500 mb-10 leading-relaxed">
					Community Assist is a calm, simple place for your neighbors to ask for help — and for your team to answer with care. No queues, no paperwork weight, no one falling through the cracks.
				</p>

				<div className="flex flex-col sm:flex-row gap-4">
					<Link href="/beneficiary">
						<Button size="lg" className="h-14 px-8 text-base bg-zinc-900 text-white hover:bg-zinc-800 w-full sm:w-auto shadow-md">
							Start an Application
						</Button>
					</Link>
					<Link href="/track">
						<Button size="lg" variant="outline" className="h-14 px-8 text-base w-full sm:w-auto bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 shadow-sm">
							Track Existing Application
						</Button>
					</Link>
				</div>
			</main>

			{/* Features Section */}
			<section className="bg-white py-24 px-6 border-t border-zinc-100">
				<div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
					<div>
						<h3 className="text-xl font-semibold mb-3 text-zinc-900">Met with kindness</h3>
						<p className="text-zinc-500 leading-relaxed">Plain language, no jargon. Every step is written like a friend would say it.</p>
					</div>
					<div>
						<h3 className="text-xl font-semibold mb-3 text-zinc-900">Pace that respects you</h3>
						<p className="text-zinc-500 leading-relaxed">Save and return whenever you're ready. No forms vanish, no progress lost.</p>
					</div>
					<div>
						<h3 className="text-xl font-semibold mb-3 text-zinc-900">Private by default</h3>
						<p className="text-zinc-500 leading-relaxed">Your story stays between you and the people verifying your request.</p>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="py-12 border-t border-zinc-100 bg-[#fafaf9] text-center text-zinc-500 text-sm">
				<p>© 2026 Community Assist. Built for the helpers.</p>
			</footer>
		</div>
	);
}
