import { SearchIcon } from "@heroicons/react/solid";

export default function SearchUsers({ handleSearch }) {
  return (
    <div className="px-3 py-3 border-b border-slate-200 dark:border-slate-800">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon
            className="h-4 w-4 text-slate-400 dark:text-slate-500"
            aria-hidden="true"
          />
        </div>
        <input
          id="search"
          name="search"
          className="block py-2 pl-9 pr-3 w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm rounded-full border border-transparent focus:outline-none focus:border-rose-500 dark:focus:border-rose-500 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          placeholder="Search"
          type="search"
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
    </div>
  );
}
