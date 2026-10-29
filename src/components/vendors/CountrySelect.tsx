"use client";

import { COUNTRIES } from "@/lib/countries";
import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function CountrySelect({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? COUNTRIES.filter((c) => c.toLowerCase().includes(q)) : COUNTRIES;
  }, [query]);

  // close when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const select = (c: string) => {
    onChange(c);
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-sm font-medium text-gray-300 light:text-gray-600 mb-2">
        Country
      </label>

      <input
        type="text"
        value={open ? query : value}
        placeholder={value || "Search country..."}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault(); // don't submit the form
            if (filtered.length > 0) select(filtered[0]);
          }
          if (e.key === "Escape") {
            setOpen(false);
            setQuery("");
          }
        }}
        autoComplete="off"
        className="w-full bg-[#242428] light:bg-white rounded-lg px-4 py-3 text-white light:text-gray-900 placeholder-gray-500 light:placeholder-gray-400 focus:outline-none focus:border-purple-500 border border-transparent light:border-gray-300"
      />

      {open && (
        <ul className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto rounded-lg bg-[#242428] light:bg-white border border-gray-700 light:border-gray-300 shadow-lg">
          {filtered.length === 0 ? (
            <li className="px-4 py-3 text-sm text-gray-500">No country found</li>
          ) : (
            filtered.map((c) => (
              <li
                key={c}
                onMouseDown={(e) => {
                  e.preventDefault();
                  select(c);
                }}
                className={`px-4 py-2 cursor-pointer text-white light:text-gray-900 hover:bg-purple-600 hover:text-white ${
                  c === value ? "bg-purple-600/30" : ""
                }`}
              >
                {c}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}