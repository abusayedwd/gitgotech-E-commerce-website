"use client"

import React, { useMemo, useState } from 'react';
import { ShoppingCart, Eye, Plus, ChevronDown } from 'lucide-react';
import { FaArrowLeft } from 'react-icons/fa';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useGetProductByEventQuery, useGetEventByIdQuery } from '@/redux/features/event/eventSlice';
import url from '@/redux/api/baseUrl';

type Product = {
  _id: string;
  product: {
    _id: string;
    product_name: string;
    product_price: number;
    review_count?: number | null;
    review_rating?: number | null;
    product_images?: string[];
    product_weight?: { unit: string; amount: number } | null;
    product_stocks?: { size: string; stock: number; _id?: string }[];
    showroom?: {
      _id?: string;
      showroom_name?: string;
      location?: { coordinates?: [number, number] } | unknown;
    } | null;
    vendor?: {
      name?: string;
    } | string;
  };
  event: string;
  isOrderd: boolean;
  createdAt: string;
  updatedAt: string;
};

type EventShowroomGroup = {
  _id: string;
  showroom: {
    _id: string;
    showroom_name?: string;
    logo?: string;
    location?: unknown;
  } | null;
  products: Product[];
};

// GET /event/product/get/:eventId doesn't return product_weight (unlike the
// cart endpoint), so fall back to the same default the product page uses
// when weight is missing — otherwise event orders get $0 weight delivery.
const DEFAULT_PRODUCT_WEIGHT = { unit: "gram", amount: 100 };

const buildEventCartItem = (product: Product, size: string, quantity: number) => ({
  productId: product.product._id,
  productName: product.product.product_name,
  productPrice: product.product.product_price,
  productImage: product.product.product_images?.[0] ?? null,
  productWeight: product.product.product_weight ?? DEFAULT_PRODUCT_WEIGHT,
  showroomName: product.product.showroom?.showroom_name ?? null,
  showroomCoordinates:
    (product.product.showroom?.location as any)?.coordinates ?? null,
  size: [{ type: size, quantity }],
});

const ProductCard = ({
  product,
  purchaseOption,
  isSelectable,
  isSelected,
  selectionDisabled,
  onToggleSelect,
  orderSize,
  orderQty,
  onOrderSizeChange,
  onOrderQtyChange,
}: {
  product: Product;
  purchaseOption: string;
  isSelectable: boolean;
  isSelected: boolean;
  selectionDisabled: boolean;
  onToggleSelect: () => void;
  orderSize: string;
  orderQty: number;
  onOrderSizeChange: (size: string) => void;
  onOrderQtyChange: (qty: number) => void;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams()
  const status = searchParams.get("status")
  const eventId = searchParams.get("id")
   const type = searchParams.get('type')

  const isInvited = status === "invited";
  const isParticipator = purchaseOption === 'participator';

  const productData = product.product;
  const imageSrc = productData.product_images?.[0]
    ? `${url}/${productData.product_images[0]}`
    : '/images/jacket.png';

  const vendorName = typeof productData.vendor === 'object'
    ? productData.vendor?.name || 'Vendor'
    : productData.vendor || 'Vendor';

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');

  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "S/28", "M/30", "L/32", "XL/34"];

  const toggleDropdown = () => {
    setOpenDropdown(openDropdown === productData._id ? null : productData._id);
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    setOpenDropdown(null);
  };

  // Participant's own individual checkout (purchaseOption "participator")
  const handleCheckout = () => {
    if (isInvited && isParticipator && !selectedSize) {
      alert('Please select a size before checkout');
      return;
    }
    router.push(`/checkout?productId=${productData._id}&eventId=${product.event}&size=${selectedSize}`);
  };

  const stockItems = productData.product_stocks || [];
  const orderStockInfo = stockItems.find((s) => s.size === orderSize);
  const orderSizeStock = orderStockInfo ? orderStockInfo.stock : 0;

  // Creator's own order — picks size/qty directly, same as adding to cart.
  const handlePlaceSingleOrder = () => {
    if (!orderSize) {
      toast.error('Please select a size first');
      return;
    }
    if (orderSizeStock <= 0 || orderQty > orderSizeStock) {
      toast.error(`Only ${orderSizeStock} in stock for size ${orderSize}`);
      return;
    }
    const eventCartData = [buildEventCartItem(product, orderSize, orderQty)];
    router.push(
      `/checkout?eventId=${product.event}&eventCartData=${encodeURIComponent(
        JSON.stringify(eventCartData),
      )}`,
    );
  };

  const cardContent = (
    <>
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={imageSrc}
          alt={productData.product_name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {isSelectable && (
          <input
            type="checkbox"
            checked={isSelected}
            disabled={selectionDisabled || product.isOrderd}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              e.stopPropagation();
              onToggleSelect();
            }}
            title={
              selectionDisabled
                ? "Deselect designs from the other showroom first — an order can only contain products from one showroom"
                : undefined
            }
            className="absolute top-2 left-2 w-4 h-4 rounded cursor-pointer disabled:cursor-not-allowed z-10"
          />
        )}
        <span className="absolute top-2 right-2 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full">
          {product.isOrderd ? 'Ordered' : 'No Design'}
        </span>
      </div>

      {/* Product Info */}
      <div className="p-3 text-white">
        <div className="flex items-center justify-between mb-1">
          <span className="text-base font-bold">₵{productData.product_price.toFixed(2)}</span>
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`w-2.5 h-2.5 ${i < (productData.review_rating || 0) ? 'fill-yellow-400' : 'fill-gray-600'}`} viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
          </div>
        </div>

        <h3 className="text-sm font-semibold truncate mb-1">{productData.product_name}</h3>

        <div className="flex items-center gap-1.5 mb-2">
          <ShoppingCart className="w-3 h-3 text-red-500" />
          <span className="text-xs text-[#B8B8B8] light:text-gray-500 truncate">{vendorName}</span>
        </div>

        {/* Size Selection for Invited Participator Events */}
        {isInvited && isParticipator && (
          <div className="mb-2">
            <label className="block text-xs font-medium text-gray-300 light:text-gray-700 mb-1">Select Size</label>
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                  selectedSize
                    ? 'bg-[#242428] text-purple-400 border border-purple-500'
                    : 'bg-[#242428] text-gray-400 border border-gray-600'
                } `}
              >
                <span className="font-medium">{selectedSize || 'Select Size'}</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform ${openDropdown === productData._id ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown Menu */}
              {openDropdown === productData._id && (
                <div className="absolute top-full mt-1 left-0 right-0 bg-[#2a2438] border border-purple-500 rounded-lg shadow-xl z-10 max-h-48 overflow-y-auto">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSizeSelect(size)}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-purple-600/30 transition-colors ${
                        selectedSize === size ? 'bg-purple-600/20 text-purple-400 light:bg-purple-100 light:text-purple-700' : 'text-gray-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Size Display */}
            {selectedSize && (
              <div className="mt-2 flex items-center justify-between px-2.5 py-1.5 bg-[#242428] border border-purple-500 rounded-lg">
                <span className="text-gray-300 text-xs">Selected Size:</span>
                <span className="text-purple-400 font-semibold text-sm">{selectedSize}</span>
              </div>
            )}
          </div>
        )}

        {/* Size + Quantity picker for the creator's own order — same as cart */}
        {!isInvited && stockItems.length > 0 && (
          <div className="mb-2" onClick={(e) => e.stopPropagation()}>
            <label className="block text-xs font-medium text-gray-300 light:text-gray-700 mb-1">
              Size & Qty
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {stockItems.map((stock) => (
                <button
                  key={stock.size}
                  type="button"
                  disabled={stock.stock === 0 || product.isOrderd}
                  onClick={() => onOrderSizeChange(stock.size)}
                  className={`px-2 py-1 rounded text-xs font-medium border transition-colors ${
                    orderSize === stock.size
                      ? 'bg-purple-600 border-purple-600 text-white'
                      : stock.stock === 0
                        ? 'bg-gray-900 border-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-800 border-gray-600 hover:border-purple-500 text-gray-300'
                  }`}
                >
                  {stock.size} {stock.stock === 0 ? '(Out)' : `(${stock.stock})`}
                </button>
              ))}
            </div>
            {orderSize && (
              <div className="flex items-center gap-2 bg-[#2E2E34] rounded-full px-2 py-1 w-fit">
                <button
                  type="button"
                  onClick={() => onOrderQtyChange(Math.max(1, orderQty - 1))}
                  disabled={orderQty <= 1}
                  className="w-5 h-5 rounded-full bg-gray-800 hover:bg-gray-700 disabled:opacity-50 flex items-center justify-center text-xs"
                >
                  −
                </button>
                <span className="text-xs font-semibold w-4 text-center">{orderQty}</span>
                <button
                  type="button"
                  onClick={() => onOrderQtyChange(Math.min(orderSizeStock, orderQty + 1))}
                  disabled={orderQty >= orderSizeStock}
                  className="w-5 h-5 rounded-full bg-gray-800 hover:bg-gray-700 disabled:opacity-50 flex items-center justify-center text-xs"
                >
                  +
                </button>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {!isInvited && (
          <div className="flex gap-2">
            {!isParticipator && (
              <button onClick={() => router.push(`/profile/event/view-deaign/select-size?productId=${productData._id}&eventId=${product.event}`)} className="flex-1 border border-purple-600 text-purple-600 py-1.5 rounded-lg text-xs font-medium transition-colors">
                View Size
              </button>
            )}

            <button
              onClick={handlePlaceSingleOrder}
              disabled={product.isOrderd || !orderSize}
              className={`flex-1 w-full py-1.5 rounded-lg text-xs font-medium transition-colors ${
                product.isOrderd || !orderSize
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "cursor-pointer bg-[#6100FF] text-white"
              }`}
            >
              {product.isOrderd
                ? "Order Placed"
                : orderSize
                  ? "Place Order"
                  : "Select a size"}
            </button>
          </div>
        )}

        {/* Checkout Button for Invited Participator */}
        {isInvited && isParticipator && (
          <button
            onClick={handleCheckout}
            disabled={!selectedSize || product.isOrderd}
            className={`flex-1 w-full py-1.5 rounded-lg text-xs font-medium transition-colors ${
              product.isOrderd
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : selectedSize
                  ? "cursor-pointer bg-[#6100FF] text-white hover:bg-purple-700"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
          >
            {product.isOrderd
              ? "Order Placed"
              : selectedSize
                ? `Checkout - Size: ${selectedSize}`
                : "Select Size to Checkout"}
          </button>
        )}
      </div>
    </>
  );

  return (
    <div className="text-white light:text-gray-900 bg-[#1B1B1F] light:bg-white rounded-lg overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow light:border light:border-gray-200">
      {isInvited ? (
        <Link href={`/profile/event/details?id=${productData._id}&type=${type}&eventId=${eventId}&isOrdered=${product.isOrderd}`}>
          <div className="cursor-pointer">
            {cardContent}
          </div>
        </Link>
      ) : (
        cardContent
      )}
    </div>
  );
};

export default function EventViewDeaign() {


 const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const status = searchParams.get('status')
  const isInvited = status === 'invited';

  const {data: eventProduct, isLoading, error} = useGetProductByEventQuery(id)
  // console.log(eventProduct)

  const {data: eventData} = useGetEventByIdQuery(id || '')

  const purchaseOption = eventData?.data?.purchaseOption || 'creator';

  const router = useRouter()

  // /event/product/get/:eventId groups event products by showroom, same as
  // the cart endpoint — data: [{ showroom, products: [...] }]
  const groups: EventShowroomGroup[] = eventProduct?.data || [];
  const totalProducts = groups.reduce(
    (sum, g) => sum + (g.products?.length || 0),
    0,
  );

  // Multi-select — same-showroom designs can be batched into a single order,
  // the same way products from the same showroom are batched in the cart.
  // Sizes/quantities are picked manually here (like the cart), not pulled
  // from participant submissions — that flow is separate ("View Size").
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
  const [orderSizes, setOrderSizes] = useState<Record<string, string>>({});
  const [orderQtys, setOrderQtys] = useState<Record<string, number>>({});

  const entriesById = useMemo(() => {
    const map = new Map<string, { entry: Product; showroomId: string }>();
    groups.forEach((group) => {
      const showroomId = group.showroom?._id || "unknown";
      group.products.forEach((entry) => {
        map.set(entry._id, { entry, showroomId });
      });
    });
    return map;
  }, [groups]);

  const selectedShowroomId = useMemo(() => {
    const selectedIds = Object.keys(selectedItems).filter((k) => selectedItems[k]);
    if (selectedIds.length === 0) return null;
    return entriesById.get(selectedIds[0])?.showroomId ?? null;
  }, [selectedItems, entriesById]);

  const toggleSelectItem = (entryId: string) => {
    setSelectedItems((prev) => {
      const next = { ...prev };
      if (next[entryId]) {
        delete next[entryId];
      } else {
        next[entryId] = true;
      }
      return next;
    });
  };

  const handleOrderSizeChange = (entryId: string, size: string) => {
    setOrderSizes((prev) => ({ ...prev, [entryId]: size }));
    setOrderQtys((prev) => ({ ...prev, [entryId]: 1 }));
  };

  const handleOrderQtyChange = (entryId: string, qty: number) => {
    setOrderQtys((prev) => ({ ...prev, [entryId]: qty }));
  };

  const handleProceedToOrder = (group: EventShowroomGroup) => {
    const selectedEntries = group.products.filter((p) => selectedItems[p._id]);
    if (selectedEntries.length === 0) return;

    const missingSize = selectedEntries.find((entry) => !orderSizes[entry._id]);
    if (missingSize) {
      toast.error(
        `Please select a size for "${missingSize.product.product_name}"`,
      );
      return;
    }

    const eventCartData = selectedEntries.map((entry) =>
      buildEventCartItem(
        entry,
        orderSizes[entry._id],
        orderQtys[entry._id] || 1,
      ),
    );

    router.push(
      `/checkout?eventId=${id}&eventCartData=${encodeURIComponent(
        JSON.stringify(eventCartData),
      )}`,
    );
  };

  return (
    <div className="min-h-screen mt-20 bg-gradient-to-r from-black via-[#0f0924] to-black light:from-white light:via-purple-50 light:to-white  text-white light:text-gray-900">
      {/* Header */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="container mx-auto flex items-center gap-4">

             <button onClick={()=> router.back()} className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#B630F4] to-[#2ACCED] cursor-pointer flex items-center justify-center">
            <FaArrowLeft className='text-black' />
          </div>
        </button>
          <h1 className="text-[32px] font-semibold text-gray-300 light:text-gray-700 font-cormorant hidden md:block">View Design</h1>
        </div>
          <Link href={"/profile/event/add-design"}>
          <button className="flex items-center w-45 py-2 cursor-pointer px-4 gap-2 bg-gradient-to-l from-blue-600 to-cyan-600 text-white px-2  rounded-lg font-medium transition-colors">
            <Plus className="w-5 h-5" />
            Add Design
          </button>
          </Link>

        </div>

        {/* Product Grid — grouped by showroom */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-purple-400 text-xl">Loading products...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-red-400 text-xl">Failed to load products</div>
          </div>
        ) : totalProducts === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center text-gray-400 light:text-gray-500">
              <ShoppingCart className="w-16 h-16 mx-auto mb-4" />
              <p className="text-xl">No products in this event yet</p>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {groups
              .filter((group) => (group.products?.length || 0) > 0)
              .map((group) => {
                const showroomId = group.showroom?._id || "unknown";
                const selectedCount = group.products.filter(
                  (p) => selectedItems[p._id],
                ).length;
                const isOtherShowroomActive =
                  selectedShowroomId !== null && selectedShowroomId !== showroomId;

                return (
                  <div key={group._id}>
                    {/* Showroom header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {group.showroom?.logo && (
                          <img
                            src={`${url}/${group.showroom.logo}`}
                            alt={group.showroom?.showroom_name}
                            className="w-10 h-10 rounded-full object-cover border border-purple-500/40"
                          />
                        )}
                        <div>
                          <h2 className="text-lg font-semibold text-white light:text-gray-900">
                            {group.showroom?.showroom_name || "Showroom"}
                          </h2>
                          {typeof group.showroom?.location === "string" &&
                            group.showroom.location && (
                              <p className="text-xs text-gray-400 light:text-gray-500">
                                {group.showroom.location}
                              </p>
                            )}
                        </div>
                      </div>
                      <span className="text-xs font-medium px-3 py-1 rounded-full bg-purple-600/20 text-purple-300 whitespace-nowrap light:bg-purple-100 light:text-purple-700">
                        {group.products.length}{" "}
                        {group.products.length === 1 ? "product" : "products"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {group.products.map((product) => (
                        <ProductCard
                          key={product._id}
                          product={product}
                          purchaseOption={purchaseOption}
                          isSelectable={!isInvited}
                          isSelected={!!selectedItems[product._id]}
                          selectionDisabled={isOtherShowroomActive}
                          onToggleSelect={() => toggleSelectItem(product._id)}
                          orderSize={orderSizes[product._id] || ""}
                          orderQty={orderQtys[product._id] || 1}
                          onOrderSizeChange={(size) =>
                            handleOrderSizeChange(product._id, size)
                          }
                          onOrderQtyChange={(qty) =>
                            handleOrderQtyChange(product._id, qty)
                          }
                        />
                      ))}
                    </div>

                    {/* Batch order same-showroom designs together, or one at a time */}
                    {!isInvited && selectedCount > 0 && (
                      <div className="mt-4 flex items-center justify-between bg-purple-900/20 light:bg-purple-50 border border-purple-500/30 rounded-xl px-5 py-3">
                        <span className="text-sm text-purple-200 light:text-purple-700">
                          {selectedCount} design{selectedCount === 1 ? "" : "s"} selected
                          from {group.showroom?.showroom_name || "this showroom"}
                        </span>
                        <button
                          onClick={() => handleProceedToOrder(group)}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium bg-[#6100FF] hover:bg-purple-700 text-white"
                        >
                          Proceed to Order ({selectedCount})
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
