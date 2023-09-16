'use client';
import { ChangeEvent, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';

const SearchWord = () => {
  const [searchTerm, setSearchTerm] = useState<string>();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const debouncedResults = useMemo(() => {
    return debounce(handleChange, 300);
  }, []);

  return (
    <form className="flex-1">
      <label
        htmlFor="search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only"
      >
        Search
      </label>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>

        <input
          type="search"
          id="search"
          onChange={debouncedResults}
          className="block flex-1 w-full px-4 py-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 outline-none"
          placeholder="Search For a Word..."
          required
        />
      </div>
    </form>
  );
};

export default SearchWord;
