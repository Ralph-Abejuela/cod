"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, ArrowDownAZ, ArrowUpZA, Filter } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { globalSearchAction } from "@/app/actions/beneficiary";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type FilterType = "all" | "beneficiaries" | "staff";
type SortOrder = "asc" | "desc" | "none";

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  
  const [filter, setFilter] = React.useState<FilterType>("all");
  const [sort, setSort] = React.useState<SortOrder>("none");
  
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

  // Enhanced local search: includes name and role
  const filteredTeam = query 
    ? teamMembers.filter((m) => 
        m.name.toLowerCase().includes(query.toLowerCase()) || 
        m.role.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  // Apply sorting
  let displayBeneficiaries = [...results];
  let displayTeam = [...filteredTeam];

  if (sort === "asc") {
    displayBeneficiaries.sort((a, b) => a.lastName.localeCompare(b.lastName));
    displayTeam.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === "desc") {
    displayBeneficiaries.sort((a, b) => b.lastName.localeCompare(a.lastName));
    displayTeam.sort((a, b) => b.name.localeCompare(a.name));
  }

  // Handle filter visibility
  const showBeneficiaries = filter === "all" || filter === "beneficiaries";
  const showStaff = filter === "all" || filter === "staff";

  const totalResults = (showBeneficiaries ? displayBeneficiaries.length : 0) + 
                       (showStaff ? displayTeam.length : 0);

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
          className="top-[20%] translate-y-0 gap-0 p-0 shadow-2xl sm:max-w-[550px] overflow-hidden rounded-xl border bg-popover text-popover-foreground flex flex-col" 
          showCloseButton={false}
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Search Database</DialogTitle>
          </DialogHeader>
          
          {/* Input Area */}
          <div className="flex items-center border-b px-3 shrink-0">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              placeholder="Search by name, ID, or role..."
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>

          {/* Filters & Sort Controls */}
          <div className="flex items-center justify-between border-b bg-muted/20 px-3 py-2 shrink-0">
            <div className="flex items-center gap-2">
              <Filter className="h-3 w-3 text-muted-foreground" />
              <div className="flex bg-muted rounded-md p-0.5">
                <button 
                  onClick={() => setFilter("all")}
                  className={`px-2.5 py-1 text-xs font-medium rounded-sm transition-colors ${filter === "all" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  All
                </button>
                <button 
                  onClick={() => setFilter("beneficiaries")}
                  className={`px-2.5 py-1 text-xs font-medium rounded-sm transition-colors ${filter === "beneficiaries" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Beneficiaries
                </button>
                <button 
                  onClick={() => setFilter("staff")}
                  className={`px-2.5 py-1 text-xs font-medium rounded-sm transition-colors ${filter === "staff" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Staff (Roles)
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setSort(sort === "asc" ? "desc" : sort === "desc" ? "none" : "asc")}
                className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md transition-colors ${sort !== "none" ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground"}`}
                title="Toggle Sort (Ascending / Descending / Relevance)"
              >
                {sort === "asc" ? <ArrowDownAZ className="h-3.5 w-3.5" /> : sort === "desc" ? <ArrowUpZA className="h-3.5 w-3.5" /> : <ArrowDownAZ className="h-3.5 w-3.5 opacity-50" />}
                Sort
              </button>
            </div>
          </div>
          
          {/* Results Area */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-[150px] max-h-[350px]">
            {isLoading && (
              <div className="py-12 text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span>Searching database...</span>
              </div>
            )}

            {!isLoading && query && totalResults === 0 && (
              <div className="py-12 text-center text-sm text-muted-foreground flex flex-col items-center gap-1">
                <Search className="h-8 w-8 opacity-20 mb-2" />
                <span className="font-medium">No results found for "{query}"</span>
                <span className="text-xs opacity-70">Try searching a different name, role, or ID.</span>
              </div>
            )}

            {!isLoading && showBeneficiaries && displayBeneficiaries.length > 0 && (
              <div className="p-1">
                <div className="px-3 py-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase bg-muted/30">
                  Beneficiaries ({displayBeneficiaries.length})
                </div>
                <div className="p-1">
                  {displayBeneficiaries.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => handleSelect(b.id)}
                      className="group flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2.5 text-sm hover:bg-muted hover:text-accent-foreground text-left transition-colors"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {b.firstName} {b.lastName}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {b.id}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full ${
                          b.applicationStatus === 'Approved' ? 'bg-green-500/10 text-green-600 dark:text-green-400' :
                          b.applicationStatus === 'Rejected' ? 'bg-red-500/10 text-red-600 dark:text-red-400' :
                          b.applicationStatus === 'Released' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                          'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                        }`}>
                          {b.applicationStatus}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!isLoading && showBeneficiaries && showStaff && displayBeneficiaries.length > 0 && displayTeam.length > 0 && (
              <div className="h-px bg-border mx-2" />
            )}

            {!isLoading && showStaff && displayTeam.length > 0 && (
              <div className="p-1">
                <div className="px-3 py-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase bg-muted/30">
                  Staff Members ({displayTeam.length})
                </div>
                <div className="p-1">
                  {displayTeam.map((m) => (
                    <button
                      key={m.name}
                      onClick={() => setOpen(false)}
                      className="group flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2.5 text-sm hover:bg-muted hover:text-accent-foreground text-left transition-colors"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {m.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {m.role}
                        </span>
                      </div>
                      <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                        {m.initials}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Show recent searches or helper text when empty */}
            {!query && !isLoading && (
              <div className="py-12 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
                <Search className="h-6 w-6 opacity-20" />
                <span>Type a name, ID, or role to search...</span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
