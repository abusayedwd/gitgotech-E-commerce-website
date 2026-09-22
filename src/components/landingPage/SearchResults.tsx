"use client";

import { useGlobalSearchQuery } from "@/redux/features/home/homeSlice";
import { buildImageUrl } from "@/lib/imageBaseUrl";
import ProductImageSlider from "@/components/shared/ProductImageSlider";
import { Package, Search, Store, User } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

type Vendor = { _id: string; name: string; image?: string };
type Showroom = {
  _id: string;
  showroom_name: string;
  logo?: string;
  showroom_category?: string[];
};
type Product = {
  _id: string;
  product_name: string;
  product_category?: string;
  product_images?: string[];
};

type ResultItem =
  | { type: "vendor"; data: Vendor }
  | { type: "showroom"; data: Showroom }
  | { type: "product"; data: Product };

type SearchResultsProps = {
  query?: string;
  variant?: "page" | "modal";
  onNavigate?: () => void;
};

export default function SearchResults({
  query,
  variant = "page",
  onNavigate,
}: SearchResultsProps = {}) {
  const searchParams = useSearchParams();
  const initialQuery = (query ?? searchParams.get("q") ?? "").trim();
  const isModal = variant === "modal";

  const { data, isLoading, isFetching, isError } = useGlobalSearchQuery(
    { q: initialQuery, page: 1, limit: 10 },
    { skip: !initialQuery },
  );

  const results: ResultItem[] = useMemo(
    () => (Array.isArray(data?.data?.result) ? data.data.result : []),
    [data],
  );

  const grouped = useMemo(() => {
    const products: Product[] = [];
    const showrooms: Showroom[] = [];
    const vendors: Vendor[] = [];
    for (const item of results) {
      if (item.type === "product") products.push(item.data);
      else if (item.type === "showroom") showrooms.push(item.data);
      else if (item.type === "vendor") vendors.push(item.data);
    }
    return { products, showrooms, vendors };
  }, [results]);

  const totalCount = data?.data?.meta?.totalData ?? results.length;

  return (
    <div
      className={
        isModal
          ? "overflow-x-hidden max-w-full text-white px-3 sm:px-4 py-4"
          : "min-h-screen overflow-x-hidden max-w-full bg-gradient-to-r from-black via-[#0f0924] to-black light:from-white light:via-purple-50 light:to-white text-white light:text-gray-900 pt-32 sm:pt-36 md:pt-40 px-4 pb-8"
      }
    >
      <div className={isModal ? "w-full" : "container mx-auto"}>
        {/* Header summary */}
        {initialQuery && (
          <p className={`text-sm text-gray-400 ${isModal ? "mb-4" : "mb-6"}`}>
            {isLoading || isFetching ? (
              <>Searching for &ldquo;<span className="text-white">{initialQuery}</span>&rdquo;...</>
            ) : (
              <>
                {totalCount} result{totalCount === 1 ? "" : "s"} for &ldquo;
                <span className="text-white">{initialQuery}</span>&rdquo;
              </>
            )}
          </p>
        )}

        {/* Empty / loading / error states */}
        {!initialQuery && (
          <EmptyState
            compact={isModal}
            icon={<Search className="w-10 h-10 text-purple-400" />}
            title="Start searching"
            message="Type a vendor, showroom or product name above."
          />
        )}

        {initialQuery && (isLoading || isFetching) && (
          <div className={`flex justify-center ${isModal ? "py-10" : "py-16"}`}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
          </div>
        )}

        {initialQuery && isError && (
          <EmptyState
            compact={isModal}
            icon={<Search className="w-10 h-10 text-red-400" />}
            title="Search failed"
            message="Please try again in a moment."
          />
        )}

        {initialQuery && !isLoading && !isFetching && results.length === 0 && (
          <EmptyState
            compact={isModal}
            icon={<Search className="w-10 h-10 text-purple-400" />}
            title="No results"
            message={`Nothing matched “${initialQuery}”. Try a different keyword.`}
          />
        )}

        {/* Grouped result sections */}
        {!isLoading && !isFetching && results.length > 0 && (
          <div className={isModal ? "space-y-8" : "space-y-12"}>
            {grouped.products.length > 0 && (
              <Section
                title="Products"
                count={grouped.products.length}
                icon={<Package className="w-5 h-5 text-purple-300" />}
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {grouped.products.map((p) => (
                    <ProductCard key={p._id} product={p} onNavigate={onNavigate} />
                  ))}
                </div>
              </Section>
            )}

            {grouped.showrooms.length > 0 && (
              <Section
                title="Showrooms"
                count={grouped.showrooms.length}
                icon={<Store className="w-5 h-5 text-purple-300" />}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {grouped.showrooms.map((s) => (
                    <ShowroomCard key={s._id} showroom={s} onNavigate={onNavigate} />
                  ))}
                </div>
              </Section>
            )}

            {grouped.vendors.length > 0 && (
              <Section
                title="Vendors"
                count={grouped.vendors.length}
                icon={<User className="w-5 h-5 text-purple-300" />}
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {grouped.vendors.map((v) => (
                    <VendorCard key={v._id} vendor={v} onNavigate={onNavigate} />
                  ))}
                </div>
              </Section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────

function Section({
  title,
  count,
  icon,
  children,
}: {
  title: string;
  count: number;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h2 className="text-xl md:text-2xl font-cormorant font-semibold text-white">
          {title}
        </h2>
        <span className="text-xs bg-purple-600/20 text-purple-300 px-2 py-0.5 rounded-full light:bg-purple-100 light:text-purple-700">
          {count}
        </span>
      </div>
      {children}
    </section>
  );
}

function ProductCard({
  product,
  onNavigate,
}: {
  product: Product;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={`/product/${product._id}`}
      onClick={onNavigate}
      className="bg-[#1B1B1F] rounded-lg overflow-hidden group hover:shadow-xl transition-shadow"
    >
      <ProductImageSlider
        images={product.product_images}
        alt={product.product_name}
      />
      <div className="p-3">
        <h3 className="text-white font-medium text-sm truncate">
          {product.product_name}
        </h3>
        {product.product_category && (
          <p className="text-gray-400 text-xs capitalize mt-0.5 truncate">
            {product.product_category}
          </p>
        )}
      </div>
    </Link>
  );
}

function ShowroomCard({
  showroom,
  onNavigate,
}: {
  showroom: Showroom;
  onNavigate?: () => void;
}) {
  const img = buildImageUrl(showroom.logo, "/images/jacket.png");
  return (
    <Link
      href={`/showroom/view-showroom?showroomId=${showroom._id}`}
      onClick={onNavigate}
      className="bg-[#1B1B1F] rounded-xl overflow-hidden group hover:bg-gray-800/50 border border-gray-700/50 transition-all"
    >
      <div className="relative h-32 overflow-hidden bg-gray-900">
        <img
          src={img}
          alt={showroom.showroom_name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      </div>
      <div className="p-3">
        <h3 className="text-white font-semibold text-sm truncate">
          {showroom.showroom_name}
        </h3>
        {showroom.showroom_category && showroom.showroom_category.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {showroom.showroom_category.slice(0, 3).map((cat) => (
              <span
                key={cat}
                className="text-[10px] uppercase tracking-wide bg-purple-600/20 text-purple-300 px-1.5 py-0.5 rounded light:bg-purple-100 light:text-purple-700"
              >
                {cat}
              </span>
            ))}
            {showroom.showroom_category.length > 3 && (
              <span className="text-[10px] text-gray-400">
                +{showroom.showroom_category.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

function VendorCard({
  vendor,
  onNavigate,
}: {
  vendor: Vendor;
  onNavigate?: () => void;
}) {
  const img = buildImageUrl(vendor.image, "");
  return (
    <Link
      href={`/vendors/showrooms?vendorId=${vendor._id}`}
      onClick={onNavigate}
      className="bg-[#1B1B1F] rounded-xl p-4 flex flex-col items-center text-center border border-gray-700/50 hover:border-purple-500 transition-colors"
    >
      <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-3">
        {img ? (
          <img
            src={img}
            alt={vendor.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-white text-2xl font-bold uppercase">
            {vendor.name?.charAt(0) || "V"}
          </span>
        )}
      </div>
      <h3 className="text-white font-medium text-sm truncate w-full">
        {vendor.name}
      </h3>
      <span className="text-[10px] uppercase tracking-wide text-purple-300 mt-1">
        Vendor
      </span>
    </Link>
  );
}

function EmptyState({
  icon,
  title,
  message,
  compact = false,
}: {
  icon: React.ReactNode;
  title: string;
  message: string;
  compact?: boolean;
}) {
  return (
    <div className={`text-center ${compact ? "py-10" : "py-20"}`}>
      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-purple-600/20 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm max-w-md mx-auto">{message}</p>
    </div>
  );
}
