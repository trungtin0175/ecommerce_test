import React, { useState } from "react";
import { Search, X } from "lucide-react";

export default function SearchComponent({
  onSearch,
}: {
  onSearch: (query: string) => void;
}) {
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(search.trim());
  };

  const handleClear = () => {
    setSearch("");
    onSearch("");
  };
  return (
    <>
      <form
        onSubmit={handleSearch}
        className="flex-1 mx-0 relative max-w-lg w-full"
      >
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (e.target.value === "") {
              onSearch("");
            }
          }}
          placeholder="Search products..."
          className="w-full border-1 border-gray-100 rounded-full px-4 py-2 pl-10 pr-10 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-black"
        />

        {search && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-red-600 cursor-pointer"
            >
              <X size={18} />
            </button>
            <button
              type="submit"
              className="text-gray-400 hover:text-blue-600 cursor-pointer"
            >
              <Search size={18} />
            </button>
          </div>
        )}
      </form>
    </>
  );
}
