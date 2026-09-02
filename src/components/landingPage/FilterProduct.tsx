"use client";
import { useFilterContext } from "@/context/FilterContext";
import { useGetHomeCategoriesQuery } from "@/redux/features/home/homeSlice";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const FashionSearchNav = () => {
  const router = useRouter();
  const { setSelectedCategory } = useFilterContext();
  const [activeTab, setActiveTab] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const tabContainerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 1024) {
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
  }, [lastScrollY]);

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

  return (
    <div
      className={`fixed inset-x-0 top-[4.5rem] sm:top-[5rem] z-50 overflow-hidden bg-gradient-to-r from-black via-[#0f0924] to-black text-white shadow-lg transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="w-full max-w-full overflow-hidden px-2 sm:px-4">
        <div className="relative overflow-hidden pt-2 sm:pt-3">
          {showLeftArrow && (
            <button
              onClick={() => scrollTabs("left")}
              className="lg:hidden absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/80 hover:bg-black text-white p-2 rounded-full shadow-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {showRightArrow && (
            <button
              onClick={() => scrollTabs("right")}
              className="lg:hidden absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/80 hover:bg-black text-white p-2 rounded-full shadow-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

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
      `}</style>
    </div>
  );
};

export default FashionSearchNav;
