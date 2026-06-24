"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { globalSearchAction } from "@/app/actions/beneficiary";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const debouncedQuery = useDebounce(query, 300);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  React.useEffect(() => {
    async function performSearch() {
      if (!debouncedQuery) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const data = await globalSearchAction(debouncedQuery);
        setResults(data);
      } catch (e) {
        console.error("Search failed", e);
      } finally {
        setIsLoading(false);
      }
    }
    performSearch();
  }, [debouncedQuery]);

  const handleSelect = (id: string) => {
    setOpen(false);
    router.push(`/beneficiary/track/${id}`);
  };

  const teamMembers = [
    { name: "Dir. Jose Manalo", role: "Admin", initials: "JM" },
    { name: "Dir. Ana Reyes", role: "Releasing Officer", initials: "AR" },
    { name: "Engr. Pedro Santos", role: "Reviewer", initials: "PS" },
    { name: "Carlos Tan", role: "Clerk", initials: "CT" },
  ];

  const filteredTeam = query 
    ? teamMembers.filter((m) => m.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted/80 transition-colors w-full sm:w-64"
      >
        <Search className="h-4 w-4" />
        <span>Search anything...</span>
        <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent 
          className="top-[20%] translate-y-0 gap-0 p-0 shadow-2xl sm:max-w-[500px] overflow-hidden rounded-xl border bg-popover text-popover-foreground" 
          showCloseButton={false}
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Search Database</DialogTitle>
          </DialogHeader>
          
          {/* Input Area */}
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              placeholder="Search beneficiaries, staff, or programs..."
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
          
          {/* Results Area */}
          <div className="max-h-[300px] overflow-y-auto overflow-x-hidden">
            {isLoading && (
              <div className="py-6 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Searching...
              </div>
            )}

            {!isLoading && query && results.length === 0 && filteredTeam.length === 0 && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No results found.
              </div>
            )}

            {!isLoading && results.length > 0 && (
              <div className="p-1">
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  Beneficiaries (Database)
                </div>
                {results.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => handleSelect(b.id)}
                    className="group flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-muted hover:text-accent-foreground text-left transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground group-hover:text-accent-foreground">
                        {b.firstName} {b.lastName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ID: {b.id} &middot; Status: {b.applicationStatus}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {!isLoading && results.length > 0 && filteredTeam.length > 0 && (
              <div className="-mx-1 h-px bg-border" />
            )}

            {!isLoading && filteredTeam.length > 0 && (
              <div className="p-1">
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  Staff Members (Internal)
                </div>
                {filteredTeam.map((m) => (
                  <button
                    key={m.name}
                    onClick={() => setOpen(false)}
                    className="group flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-muted hover:text-accent-foreground text-left transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground group-hover:text-accent-foreground">
                        {m.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {m.role}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {/* Show recent searches or helper text when empty */}
            {!query && !isLoading && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Type a name, ID, or role to search...
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
