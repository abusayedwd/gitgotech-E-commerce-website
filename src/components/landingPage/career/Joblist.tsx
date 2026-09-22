"use client";

import { useGetCareersQuery } from "@/redux/features/career/careerSlice";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  DollarSign,
  Filter,
  MapPin,
  Search,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { RiTimeZoneLine } from "react-icons/ri";

const Joblist = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("searchQ") || "",
  );
  const [debouncedSearch, setDebouncedSearch] = useState(
    searchParams.get("searchQ") || "",
  );
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [isLocationOpen, setIsLocationOpen] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 10;

  // Sync search query from URL parameters
  useEffect(() => {
    const urlSearchQ = searchParams.get("searchQ") || "";
    const urlCountry = searchParams.get("country") || "";
    setSearchQuery(urlSearchQ);
    setDebouncedSearch(urlSearchQ);
    setSelectedCountry(urlCountry);
  }, [searchParams]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Pass searchQ and country to the API for server-side filtering
  const { data: joblistData, isLoading } = useGetCareersQuery({
    page,
    limit,
    searchQ: debouncedSearch,
    country: selectedCountry,
  });

  const jobs = joblistData?.data || [];
  const totalPages = joblistData?.totalPages || 1;

  // console.log(jobs);

  // Extract unique countries from job list
  const countries = useMemo(() => {
    const uniqueCountries = Array.from(
      new Set(jobs.map((job: any) => job.country)),
    ) as string[];
    return uniqueCountries;
  }, [jobs]);

  // Handler for search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
    // Update URL with search query
    if (searchQuery.trim()) {
      router.push(`/careers?searchQ=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/careers");
    }
  };

  // Handler for country change
  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setPage(1); // Reset to first page on country change
    // Update URL with country
    const params = new URLSearchParams();
    if (searchQuery) params.set("searchQ", searchQuery);
    if (country) params.set("country", country);
    router.push(`/careers?${params.toString()}`);
  };

  // Handler for page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-black light:bg-white text-white light:text-gray-900">
      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* ── Sidebar ── */}
          <aside className="w-56 shrink-0">
            {/* Filter toggle button */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-5 py-2 bg-purple-600 rounded-full hover:bg-purple-700 transition-colors text-sm font-medium mb-6"
            >
              <Filter size={16} />
              Filter
            </button>

            {isFilterOpen && (
              <div>
                {/* Search */}
                <form onSubmit={handleSearch} className="mb-5">
                  <div className="relative mb-2">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                      size={16}
                    />
                    <input
                      type="text"
                      placeholder="Search by job title..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-gray-900 light:bg-white border border-gray-700 light:border-gray-300 rounded-lg text-sm text-white light:text-gray-900 placeholder-gray-500 light:placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm text-white font-medium transition-colors"
                  >
                    Search
                  </button>
                </form>

                {/* Select Location */}
                <button
                  onClick={() => setIsLocationOpen(!isLocationOpen)}
                  className="flex items-center justify-between w-full text-white light:text-gray-900 text-base font-semibold mb-4 hover:text-purple-400 transition-colors"
                >
                  <span>Select Location</span>
                  {isLocationOpen ? (
                    <ChevronUp size={18} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-400" />
                  )}
                </button>

                {isLocationOpen && (
                  <div className="space-y-3">
                    {/* All */}
                    <RadioOption
                      id="all"
                      label="All Countries"
                      checked={selectedCountry === ""}
                      onChange={() => handleCountryChange("")}
                    />
                    {countries.map((country) => (
                      <RadioOption
                        key={country}
                        id={country}
                        label={country}
                        checked={selectedCountry === country}
                        onChange={() => handleCountryChange(country)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </aside>

          {/* ── Job Grid ── */}
          <main className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                <span className="ml-3 text-gray-400 light:text-gray-500">Loading jobs...</span>
              </div>
            ) : jobs.length === 0 ? (
              <div className="flex items-center justify-center py-20 text-gray-400 light:text-gray-500">
                No jobs found matching your criteria.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {jobs.map((job: any) => (
                    <JobCard
                      key={job._id}
                      job={job}
                      onView={() =>
                        router.push(`/careers/job-details?id=${job._id}`)
                      }
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="px-4 py-2 bg-gray-900 light:bg-white border border-gray-700 light:border-gray-300 rounded-lg text-sm text-white light:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed hover:border-purple-500 transition-colors"
                    >
                      Previous
                    </button>

                    <span className="text-gray-400 light:text-gray-500 text-sm">
                      Page {page} of {totalPages}
                    </span>

                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      className="px-4 py-2 bg-gray-900 light:bg-white border border-gray-700 light:border-gray-300 rounded-lg text-sm text-white light:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed hover:border-purple-500 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

/* ─── Radio Option ─── */
const RadioOption = ({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) => (
  <label
    htmlFor={`loc-${id}`}
    className="flex items-center gap-3 cursor-pointer group"
  >
    <input
      type="radio"
      id={`loc-${id}`}
      name="location"
      value={id}
      checked={checked}
      onChange={onChange}
      className="sr-only"
    />
    {/* Custom circle */}
    <div
      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
        checked
          ? "border-purple-500 bg-purple-500"
          : "border-gray-600 group-hover:border-purple-400"
      }`}
    >
      {checked && <div className="w-2 h-2 rounded-full bg-white" />}
    </div>
    <span
      className={`text-sm transition-colors ${checked ? "text-white light:text-gray-900 font-medium" : "text-gray-400 light:text-gray-500 group-hover:text-gray-300"}`}
    >
      {label}
    </span>
  </label>
);

/* ─── Job Card ─── */
const JobCard = ({ job, onView }: { job: any; onView: () => void }) => (
  <div className="bg-[#111111] light:bg-white border border-gray-800 light:border-gray-200 rounded-xl p-5 flex flex-col gap-4 hover:border-blue-500/40 hover:shadow-[0_0_16px_rgba(99,102,241,0.2)] transition-all duration-300 group">
    {/* Title */}
    <h3
      className="text-xl font-bold leading-snug text-white light:text-gray-900"
      style={{ fontFamily: "Georgia, serif" }}
    >
      {job.title}
    </h3>

    {/* Meta */}
    <div className="space-y-1.5 text-sm text-gray-400 light:text-gray-500">
      <div className="flex items-center gap-2">
        <MapPin size={16} className="text-white light:text-gray-700 shrink-0" />
        <span>
          {job.country}
          {job.address ? ` - ${job.address}` : ""}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <DollarSign size={16} className="text-white light:text-gray-700 shrink-0" />
        <span>{job.salary}</span>
      </div>
      <div className="flex items-center gap-2">
        <RiTimeZoneLine size={16} className="text-white light:text-gray-700 shrink-0" />
        <span>{job.jobType}</span>
      </div>
    </div>

    {/* Description */}
    <p className="text-gray-400 light:text-gray-500 text-sm leading-relaxed line-clamp-2">
      {job.description}
    </p>

    {/* CTA */}
    <button
      onClick={onView}
      className="w-full py-2.5 rounded-lg font-medium text-sm text-white flex items-center justify-center gap-2
        bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700
        transition-all duration-300 group"
    >
      View Details
      <ChevronRight
        size={16}
        className="group-hover:translate-x-0.5 transition-transform"
      />
    </button>
  </div>
);

export default Joblist;
