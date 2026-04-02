interface PeptideFiltersProps {
  search?: string;
  category?: string;
  grade?: string;
  sort?: string;
}

const categoryOptions = [
  { value: "", label: "All categories" },
  { value: "glp-1", label: "GLP-1" },
  { value: "recovery", label: "Recovery" },
  { value: "cosmetic", label: "Cosmetic" },
  { value: "growth", label: "Growth" },
  { value: "research", label: "Research" },
];

const gradeOptions = [
  { value: "", label: "All grades" },
  { value: "ab", label: "A–B only" },
  { value: "tested", label: "Any tested" },
  { value: "all", label: "Include untested" },
];

const sortOptions = [
  { value: "trust", label: "Highest trust" },
  { value: "price", label: "Lowest price" },
  { value: "grade", label: "Highest grade" },
  { value: "vendors", label: "Most vendors" },
  { value: "name", label: "Name" },
];

export function PeptideFilters({ search = "", category = "", grade = "all", sort = "trust" }: PeptideFiltersProps) {
  return (
    <form className="surface-card grid gap-4 rounded-[1.5rem] p-5 md:grid-cols-[minmax(0,1.4fr)_0.8fr_0.8fr_0.8fr]">
      <label className="block">
        <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
          Search
        </span>
        <input
          type="search"
          name="search"
          defaultValue={search}
          placeholder="Search peptides"
          className="w-full rounded-full border bg-[var(--bg-secondary)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)] focus:ring-2 focus:ring-[rgba(22,163,74,0.12)]"
          style={{ borderColor: "var(--border-default)" }}
        />
      </label>

      {[
        { name: "category", label: "Category", value: category, options: categoryOptions },
        { name: "grade", label: "Finnrick grade", value: grade, options: gradeOptions },
        { name: "sort", label: "Sort", value: sort, options: sortOptions },
      ].map((field) => (
        <label key={field.name} className="block">
          <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
            {field.label}
          </span>
          <select
            name={field.name}
            defaultValue={field.value}
            className="w-full rounded-full border bg-[var(--bg-secondary)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[rgba(22,163,74,0.12)]"
            style={{ borderColor: "var(--border-default)" }}
          >
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      ))}

      <div className="flex items-end gap-3 md:col-span-4">
        <button
          type="submit"
          className="rounded-full bg-[var(--accent-primary)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-primary-hover)]"
        >
          Apply filters
        </button>
      </div>
    </form>
  );
}
