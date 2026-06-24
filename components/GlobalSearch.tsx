"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { globalSearchAction } from "@/app/actions/beneficiary";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  // Debounce the query to avoid spamming the database
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
      const data = await globalSearchAction(debouncedQuery);
      setResults(data);
      setIsLoading(false);
    }
    performSearch();
  }, [debouncedQuery]);

  const handleSelect = (id: string) => {
    setOpen(false);
    // Directly navigate to the track page of that beneficiary (assuming admin or secure environment)
    // Or we could navigate to admin details. Since tracking is available by ID, let's go there.
    router.push(`/beneficiary/track/${id}`);
  };

  // Mock static team members to search as requested
  const teamMembers = [
    { name: "Dir. Jose Manalo", role: "Admin", initials: "JM" },
    { name: "Dir. Ana Reyes", role: "Releasing Officer", initials: "AR" },
    { name: "Engr. Pedro Santos", role: "Reviewer", initials: "PS" },
    { name: "Carlos Tan", role: "Clerk", initials: "CT" },
  ];

  const filteredTeam = teamMembers.filter((m) =>
    m.name.toLowerCase().includes(query.toLowerCase())
  );

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

      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false} className="flex size-full flex-col overflow-hidden rounded-xl bg-popover text-popover-foreground">
          <CommandInput 
            placeholder="Search beneficiaries, staff, or programs..." 
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? "Searching..." : "No results found."}
            </CommandEmpty>

            {results.length > 0 ? (
              <CommandGroup heading="Beneficiaries (Database)">
                {results.map((b) => (
                  <CommandItem
                    key={b.id}
                    value={b.id + " " + b.firstName + " " + b.lastName}
                    onSelect={() => handleSelect(b.id)}
                    className="cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {b.firstName} {b.lastName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ID: {b.id} &middot; Status: {b.applicationStatus}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}

            {results.length > 0 && filteredTeam.length > 0 ? <CommandSeparator /> : null}

            {filteredTeam.length > 0 ? (
              <CommandGroup heading="Staff Members (Internal)">
                {filteredTeam.map((m) => (
                  <CommandItem key={m.name} value={m.name} onSelect={() => setOpen(false)}>
                    <div className="flex flex-col">
                      <span className="font-medium">{m.name}</span>
                      <span className="text-xs text-muted-foreground">{m.role}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
