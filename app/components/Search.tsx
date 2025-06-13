'use client'
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
type User = {
  id: string;
  username: string;
  email: string;
  fullName?: string;
};
export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [results, setResults] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(searchParams.get("query")?.toString() || "");
  const [searched, setSearched] = useState(false);
  const { replace } = useRouter();

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
      setResults([]);
      setSearched(false);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const fetchResults = async () => {
      const query = searchParams.get("query");
      if (!query) {
        setResults([]);
        setSearched(false);
        return;
      }
      try {
        const response = await fetch(`/api/search?query=${query}`);
        if (!response.ok) throw new Error("Failed to fetch search results");
        const data = await response.json();
        setResults(data);
        setSearched(true);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setResults([]);
        setSearched(true);
      }
    };
    fetchResults();
  }, [searchParams]);

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-1/2 rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 z-20 bg-white"
        value={searchTerm}
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        style={{ position: "relative" }}
      />
      <FaSearch className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900 z-30" />
      {/* Results dropdown */}
      <AnimatePresence>
        {searchTerm && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 mt-[46px] w-1/2 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
          >
            {results.length > 0 ? (
              results.map((user) => (
                <li key={user.id} className="p-2 hover:bg-gray-100">
                  <a href={`/${user.username}`} className="text-blue-600 hover:underline">
                    {user.fullName || user.username} ({user.email})
                  </a>
                </li>
              ))
            ) : (
              searched && (
                <li className="p-2 text-gray-500">No results found</li>
              )
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}