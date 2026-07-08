"use client";
import { useFilterContext } from "@/context/FilterContext";
import { useGetHomeCategoriesQuery } from "@/redux/features/home/homeSlice";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const FashionSearchNav = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") || "";
  // Hide the category tab row whenever a search query is active in the URL.
  const isSearching = !!urlQuery.trim();
  const { setSelectedCategory, setSearchQuery } = useFilterContext();
  const [activeTab, setActiveTab] = useState("");
  const [searchQuery, setSearchQueryLocal] = useState(urlQuery);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const tabContainerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: categoriesRes } = useGetHomeCategoriesQuery({});
  const categories = categoriesRes?.data ?? [];

  const tabColors = [
    "bg-blue-500",
    "bg-purple-600",
    "bg-gray-700",
    "bg-pink-500",
    "bg-green-600",
  ];

  const handleTabClick = (category: { _id: string; name: string }) => {
    setActiveTab(category._id);
    setSelectedCategory(category.name);
    router.push(`/category/${encodeURIComponent(category.name.toLowerCase())}`);
  };

  // Push the new query into the URL. Use `replace` (not `push`) so live-typing
  // doesn't pollute history with every keystroke — back button still works.
  const applySearch = (value: string) => {
    const q = value.trim();
    router.replace(q ? `/?q=${encodeURIComponent(q)}` : "/");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQueryLocal(value);
    setSearchQuery(value);

    // Debounce so we don't fire on every keystroke
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => applySearch(value), 300);
  };

  const submitSearch = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    applySearch(searchQuery);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitSearch();
    }
  };

  // Keep the input in sync if the URL `q` is changed by something else
  // (back/forward navigation, clearing the search via "Cancel", etc.).
  useEffect(() => {
    setSearchQueryLocal(urlQuery);
  }, [urlQuery]);

  // Cleanup pending debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // iOS Safari fires scroll events when the keyboard opens — keep search visible
      if (isSearchFocused || window.innerWidth < 1024) {
        setIsVisible(true);
        return;
      }

      const currentScrollY = window.scrollY;
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isSearchFocused]);

  useEffect(() => {
    const checkScroll = () => {
      const container = tabContainerRef.current;
      if (container) {
        const { scrollLeft, scrollWidth, clientWidth } = container;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
      }
    };

    const container = tabContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      checkScroll();
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScroll);
      }
    };
  }, []);

  const scrollTabs = (direction: "left" | "right") => {
    const container = tabContainerRef.current;
    if (container) {
      const scrollAmount = 200;
      const targetScroll =
        direction === "left"
          ? container.scrollLeft - scrollAmount
          : container.scrollLeft + scrollAmount;
      container.scrollTo({ left: targetScroll, behavior: "smooth" });
    }
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    document.documentElement.classList.add("home-search-active");
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
    document.documentElement.classList.remove("home-search-active");
  };

  useEffect(() => {
    return () => {
      document.documentElement.classList.remove("home-search-active");
    };
  }, []);

  return (
    <div
      className={`fixed inset-x-0 top-[4.5rem] sm:top-[5rem] z-50 overflow-hidden bg-gradient-to-r from-black via-[#0f0924] to-black text-white shadow-lg ${
        isVisible || isSearchFocused ? "translate-y-0" : "-translate-y-full"
      } ${isSearchFocused ? "" : "transition-transform duration-300 ease-in-out"}`}
    >
      <div className="w-full max-w-full overflow-hidden px-2 sm:px-4">
        {/* Search Bar — same mobile pattern as Vendors page */}
        <div className="py-2 sm:py-4">
          <div className="max-w-full sm:max-w-4xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 min-w-0">
            <div className="relative flex-1 w-full min-w-0">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                inputMode="search"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                enterKeyHint="search"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                placeholder="Find your perfect tailor, design, or outfit"
                className="global-search-input w-full min-w-0 box-border border border-gray-700 bg-transparent rounded-lg pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-base sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              type="button"
              onClick={submitSearch}
              className="shrink-0 w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 sm:px-8 py-2.5 sm:py-3 rounded-lg transition-colors text-sm"
            >
              Search
            </button>
          </div>
        </div>

        {/* Tab Navigation — hidden while searching or input focused */}
        <div className={`relative overflow-hidden ${isSearching || isSearchFocused ? "hidden" : ""}`}>
          {/* Left Arrow Button - Mobile Only */}
          {showLeftArrow && (
            <button
              onClick={() => scrollTabs("left")}
              className="lg:hidden absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/80 hover:bg-black text-white p-2 rounded-full shadow-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Right Arrow Button - Mobile Only */}
          {showRightArrow && (
            <button
              onClick={() => scrollTabs("right")}
              className="lg:hidden absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/80 hover:bg-black text-white p-2 rounded-full shadow-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {/* Fade indicators */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none lg:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none lg:hidden" />

          <div
            ref={tabContainerRef}
            className="flex items-center container mx-auto gap-2 sm:gap-3 px-1 sm:px-2 pb-3 sm:pb-4 overflow-x-auto scrollbar-hide"
          >
            {categories.map(
              (category: { _id: string; name: string }, index: number) => (
                <button
                  key={category._id}
                  onClick={() => handleTabClick(category)}
                  className={`${
                    activeTab === category._id
                      ? tabColors[index % tabColors.length]
                      : "border border-gray-700 bg-[#080715]"
                  } px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium whitespace-nowrap hover:opacity-90 transition-all flex-shrink-0`}
                >
                  {category.name}
                </button>
              ),
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior-x: contain;
        }
        :global(.global-search-input) {
          -webkit-appearance: none;
          appearance: none;
          touch-action: manipulation;
        }
      `}</style>
    </div>
  );
};

export default FashionSearchNav;
