"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Heart, ShoppingCart, MessageCircle, Ruler, Star, Info, Minus, Plus, X, Calendar, MapPin, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGetProductDetailsforCustomerQuery, useAddToCartWishListMutation } from '@/redux/features/home/homeSlice';
import url from '@/redux/api/baseUrl';
import toast from 'react-hot-toast';
import { useEventProductAddMutation, useGetEventsForProductAddQuery } from '@/redux/features/event/eventSlice';
import { useAuth } from '@/hooks/useAuth';
import { addToGuestCart } from '@/lib/guestCart';

interface ProductDetailsProps {
  productId?: string | null;
}

export default function ProductDetails({ productId }: ProductDetailsProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [showEventModal, setShowEventModal] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [zoomActive, setZoomActive] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [previewTop, setPreviewTop] = useState(0);
  const mainImageRef = useRef<HTMLImageElement>(null);
  const mainImageAreaRef = useRef<HTMLDivElement>(null);

  const ZOOM_SCALE = 3.2;
  const PREVIEW_SIZE = 380;

  const { data: productData, isLoading } = useGetProductDetailsforCustomerQuery(
    productId || "",
    {
      skip: !productId,
    },
  );

  const { data: eventdata } = useGetEventsForProductAddQuery(undefined);
  const [addproductToEvent] = useEventProductAddMutation();

  const events = Array.isArray(eventdata?.data?.data)
    ? eventdata?.data?.data
    : [];

  const handleAddToEvent = async (eventId: string) => {
    try {
      const data = {
        event: eventId,
        product: product._id,
      };
      const res = await addproductToEvent(data).unwrap();
      if (res?.success) {
        toast.success("Product added to event!");
        setShowEventModal(false);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add to event");
    }
  };

  const [addToCartWishList] = useAddToCartWishListMutation();
  const { isLoggedIn, requireLogin } = useAuth();

  const product = productData?.data || null;

  useEffect(() => {
    setSelectedImageIndex(0);
    setShowLightbox(false);
    setZoomActive(false);
  }, [productId, product?._id]);

  useEffect(() => {
    setZoomActive(false);
  }, [selectedImageIndex]);

  const handleImageZoomMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const img = mainImageRef.current;
      const area = mainImageAreaRef.current;
      if (!img || !area) return;

      const areaRect = area.getBoundingClientRect();
      const imgRect = img.getBoundingClientRect();
      const x = ((e.clientX - imgRect.left) / imgRect.width) * 100;
      const y = ((e.clientY - imgRect.top) / imgRect.height) * 100;

      if (x < 0 || x > 100 || y < 0 || y > 100) {
        setZoomActive(false);
        return;
      }

      const cursorY = e.clientY - areaRect.top;
      let clampedTop: number;
      if (PREVIEW_SIZE >= areaRect.height - 16) {
        clampedTop = (areaRect.height - PREVIEW_SIZE) / 2;
      } else {
        clampedTop = Math.min(
          Math.max(cursorY - PREVIEW_SIZE / 2, 8),
          areaRect.height - PREVIEW_SIZE - 8,
        );
      }

      setZoomActive(true);
      setZoomPos({ x, y });
      setPreviewTop(clampedTop);
    },
    [PREVIEW_SIZE],
  );

  const handleImageZoomLeave = useCallback(() => {
    setZoomActive(false);
  }, []);

  // Size-guide active tab. Hoisted above any early returns so the hook order
  // stays stable between the loading render and the loaded render.
  const [activeSizeTab, setActiveSizeTab] = useState<string>(
    "Topwear (Shirts, T-Shirts, Jackets)",
  );

  useEffect(() => {
    if (!showSizeGuide) return;
    const cat = String(
      product?.product_category || product?.category || "",
    ).toLowerCase();
    if (/(shoe|sneaker|boot|footwear|sandal)/.test(cat)) {
      setActiveSizeTab("Footwear / Shoe Size Conversion");
    } else if (/(pant|jean|trouser|bottom|short)/.test(cat)) {
      setActiveSizeTab("Bottomwear (Pants, Jeans, Trousers)");
    } else {
      setActiveSizeTab("Topwear (Shirts, T-Shirts, Jackets)");
    }
  }, [showSizeGuide, product]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-gray-950 via-purple-900/15 to-black text-white flex items-center justify-center">
        <div className="text-purple-400 text-xl">
          Loading product details...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-gray-950 via-purple-900/15 to-black text-white flex items-center justify-center">
        <div className="text-red-400 text-xl">Product not found</div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      addToGuestCart(product, { quantity, size: selectedSize });
      toast.success("Added to cart!");
      return;
    }
    try {
      const data = {
        product: product._id,
        saveType: "cart",
      };
      const res = await addToCartWishList(data).unwrap();
      if (res?.success) {
        toast.success("Added to cart!");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add to cart");
    }
  };

  const handleAddToWishlist = async () => {
    if (!requireLogin("Please sign in to save items to your wishlist")) return;
    try {
      const data = {
        product: product._id,
        saveType: "wishlist",
      };
      const res = await addToCartWishList(data).unwrap();
      if (res?.success) {
        toast.success("Added to wishlist!");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add to wishlist");
    }
  };

  const handleOpenEventModal = () => {
    if (!requireLogin("Please sign in to add items to an event")) return;
    setShowEventModal(true);
  };

  const handleCustomDesign = (e: React.MouseEvent) => {
    if (isLoggedIn) return;
    e.preventDefault();
    requireLogin("Please sign in to start a custom design");
  };

  // ───────────────────────────────────────────────────────────────────
  // SIZE GUIDE — multi-tab. Each tab = one category with its own columns +
  // rows. Generic table renderer iterates `columns` to drive both <th>s and
  // <td>s, so you can swap rows/columns per chart without touching JSX.
  // ───────────────────────────────────────────────────────────────────
  type SizeChart = {
    columns: string[];
    rows: Record<string, string>[];
  };

  const SIZE_CHARTS: Record<string, SizeChart> = {
    "Topwear (Shirts, T-Shirts, Jackets)": {
      columns: ["Size", "Chest", "Waist", "Neck", "Sleeves"],
      rows: [
        { Size: "XS",  Chest: "32-34", Waist: "26-28", Neck: "14.0", Sleeves: "32" },
        { Size: "S",   Chest: "35-37", Waist: "29-31", Neck: "15.0", Sleeves: "33" },
        { Size: "M",   Chest: "38-40", Waist: "32-34", Neck: "16.0", Sleeves: "34" },
        { Size: "L",   Chest: "41-43", Waist: "35-37", Neck: "17.0", Sleeves: "35" },
        { Size: "XL",  Chest: "44-46", Waist: "38-40", Neck: "18.0", Sleeves: "36" },
        { Size: "2XL", Chest: "47-49", Waist: "41-43", Neck: "19.0", Sleeves: "37" },
      ],
    },
    "Bottomwear (Pants, Jeans, Trousers)": {
      columns: ["Size", "Waist", "Hips", "Inseam"],
      rows: [
        { Size: "S (28-30)", Waist: "29-31", Hips: "35-37", Inseam: "30" },
        { Size: "M (32)",    Waist: "32-34", Hips: "38-40", Inseam: "32" },
        { Size: "L (34)",    Waist: "35-37", Hips: "41-43", Inseam: "32" },
        { Size: "XL (36)",   Waist: "38-40", Hips: "44-46", Inseam: "34" },
        { Size: "2XL (38)",  Waist: "41-43", Hips: "47-49", Inseam: "34" },
      ],
    },
    "Footwear / Shoe Size Conversion": {
      columns: ["Alpha Size", "US Men", "US Women", "UK Size", "EU Size", "CM"],
      rows: [
        { "Alpha Size": "XS",  "US Men": "5 - 6",   "US Women": "6.5 - 7.5",   "UK Size": "4.5 - 5.5", "EU Size": "37 - 38", CM: "23.8" },
        { "Alpha Size": "S",   "US Men": "7 - 8",   "US Women": "8.5 - 9.5",   "UK Size": "6 - 7",     "EU Size": "40 - 41", CM: "25.4" },
        { "Alpha Size": "M",   "US Men": "9 - 10",  "US Women": "10.5 - 11.5", "UK Size": "8 - 9",     "EU Size": "42 - 43", CM: "27.0" },
        { "Alpha Size": "L",   "US Men": "11 - 12", "US Women": "12.5 - 13.5", "UK Size": "10 - 11",   "EU Size": "44 - 45", CM: "28.6" },
        { "Alpha Size": "XL",  "US Men": "13 - 14", "US Women": "14.5 - 15.5", "UK Size": "12 - 13",   "EU Size": "46 - 47", CM: "30.2" },
        { "Alpha Size": "2XL", "US Men": "15+",     "US Women": "16.5+",       "UK Size": "14+",       "EU Size": "48+",     CM: "31.8" },
      ],
    },
  };

  // Short labels for the tab strip (full names are long).
  const SIZE_TABS: { key: string; short: string; long: string; kind: "clothing" | "shoe" }[] = [
    { key: "Topwear (Shirts, T-Shirts, Jackets)",  short: "Topwear",  long: "Topwear (Shirts, T-Shirts, Jackets)",  kind: "clothing" },
    { key: "Bottomwear (Pants, Jeans, Trousers)", short: "Bottomwear", long: "Bottomwear (Pants, Jeans, Trousers)", kind: "clothing" },
    { key: "Footwear / Shoe Size Conversion",     short: "Footwear",  long: "Footwear / Shoe Size Conversion",     kind: "shoe" },
  ];

  const activeTab =
    SIZE_TABS.find((t) => t.key === activeSizeTab) || SIZE_TABS[0];

  const renderChart = (tabKey: string) => {
    const chart = SIZE_CHARTS[tabKey];
    if (!chart) return null;
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-purple-500/30">
              {chart.columns.map((col) => (
                <th key={col} className="text-left py-3 px-4 font-semibold whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chart.rows.map((row, idx) => (
              <tr
                key={`${row[chart.columns[0]] || idx}`}
                className="border-b border-purple-500/20 hover:bg-purple-900/20"
              >
                {chart.columns.map((col, ci) => (
                  <td
                    key={col}
                    className={`py-3 px-4 whitespace-nowrap ${ci === 0 ? "font-medium" : ""}`}
                  >
                    {row[col] ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const SizeGuideModal = () => (
    <div className="fixed inset-0 bg-black/90 flex mt-12 items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-gradient-to-r from-gray-950 via-purple-900/15 to-black border border-purple-500/30 rounded-3xl max-w-3xl w-full relative animate-fadeIn">
        <button
          onClick={() => setShowSizeGuide(false)}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-800/50 hover:bg-gray-700 flex items-center justify-center transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-purple-400" />
            <h2 className="text-2xl font-cormorant font-semibold">Size Guide</h2>
          </div>
        </div>

        {/* Category tabs */}
        <div className="px-6 pt-4 border-b border-gray-700/50 overflow-x-auto">
          <div className="flex gap-2 min-w-max pb-3">
            {SIZE_TABS.map((t) => {
              const active = t.key === activeSizeTab;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setActiveSizeTab(t.key)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                    active
                      ? "bg-purple-600 text-white"
                      : "bg-purple-900/30 text-gray-300 hover:bg-purple-900/50"
                  }`}
                  title={t.long}
                >
                  {t.short}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <p className="text-xs uppercase tracking-wider text-purple-300/80 font-medium">
            {activeTab.long}
          </p>
          {renderChart(activeTab.key)}

          <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">How to Measure</h3>
            <div className="space-y-3 text-sm">
              {activeTab.key === "Footwear / Shoe Size Conversion" && (
                <p className="text-gray-400">
                  Stand on a flat surface, place your heel against a wall, then
                  measure from the wall to the tip of your longest toe. Match
                  the result (in cm) against the chart for your region.
                </p>
              )}

              {activeTab.key === "Topwear (Shirts, T-Shirts, Jackets)" && (
                <>
                  <div>
                    <h4 className="font-semibold mb-1">Chest</h4>
                    <p className="text-gray-400">Measure around the fullest part of your chest, keeping the tape horizontal.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Waist</h4>
                    <p className="text-gray-400">Measure around the narrowest part of your natural waistline.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Neck</h4>
                    <p className="text-gray-400">Measure around the base of your neck where a shirt collar sits.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Sleeves</h4>
                    <p className="text-gray-400">From the center back of the neck, across the shoulder, down to the wrist.</p>
                  </div>
                </>
              )}

              {activeTab.key === "Bottomwear (Pants, Jeans, Trousers)" && (
                <>
                  <div>
                    <h4 className="font-semibold mb-1">Waist</h4>
                    <p className="text-gray-400">Measure around where you normally wear your trousers (just above the hip bone).</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Hips</h4>
                    <p className="text-gray-400">Measure around the fullest part of your hips.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Inseam</h4>
                    <p className="text-gray-400">From the crotch seam straight down to the hem of the pant leg.</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Legacy shoe-only modal kept for backwards compatibility — no longer rendered.
  const ShoeSizeGuide = () => {
    const usaSizes = [
      "5",
      "5.5",
      "6",
      "6.5",
      "7",
      "7.5",
      "8",
      "8.5",
      "9",
      "9.5",
      "10",
      "10.5",
      "11",
      "11.5",
      "12",
      "12.5",
      "13",
    ];
    const europeSizes = [
      "35",
      "36",
      "37",
      "38",
      "39",
      "40",
      "41",
      "42",
      "43",
      "44",
      "45",
      "46",
      "47",
    ];

    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-gradient-to-r from-gray-950 via-purple-900/15 to-black border-1 border-blue-500/50 rounded-3xl max-w-2xl w-full relative animate-fadeIn">
          <button
            onClick={() => setShowSizeGuide(false)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-800/50 hover:bg-gray-700 flex items-center justify-center transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <Ruler className="w-5 h-5 text-purple-400" />
              <h2 className="text-2xl font-cormorant font-semibold">
                USA Shoe Sizes
              </h2>
            </div>
          </div>

          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <div>
              <h3 className="text-lg font-semibold mb-4 font-cormorant flex items-center gap-2">
                <Ruler className="w-4 h-4 font-cormorant text-purple-400" />
                USA Shoe Sizes
              </h3>
              <div className="grid grid-cols-5 md:grid-cols-8 gap-2">
                {usaSizes.map((size) => (
                  <button
                    key={size}
                    className="px-4 py-3 bg-purple-900/30 border border-purple-500/10 rounded-lg hover:bg-purple-600 hover:border-purple-600 transition-colors text-center font-medium"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 font-cormorant flex items-center gap-2">
                <Ruler className="w-4 h-4 text-purple-400" />
                Europe Shoe Sizes
              </h3>
              <div className="grid grid-cols-5 md:grid-cols-8 gap-2">
                {europeSizes.map((size) => (
                  <button
                    key={size}
                    className="px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg hover:bg-purple-600 hover:border-purple-600 transition-colors text-center font-medium"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Clothing Size Guide Component
  const ClothingSizeGuide = () => {
    // const sizeData = [
    //   {
    //     size: "XS",
    //     chest: "30-32",
    //     waist: "24-26",
    //     hips: "32-34",
    //     inseam: "28-30",
    //     sleeve: "30-32",
    //   },
    //   {
    //     size: "S",
    //     chest: "32-34",
    //     waist: "26-28",
    //     hips: "34-36",
    //     inseam: "30-31",
    //     sleeve: "31-32",
    //   },
    //   {
    //     size: "M",
    //     chest: "36-38",
    //     waist: "28-30",
    //     hips: "36-38",
    //     inseam: "31-32",
    //     sleeve: "32-33",
    //   },
    //   {
    //     size: "L",
    //     chest: "40-42",
    //     waist: "32-34",
    //     hips: "40-42",
    //     inseam: "32-33",
    //     sleeve: "33-34",
    //   },
    //   {
    //     size: "XL",
    //     chest: "44-46",
    //     waist: "36-38",
    //     hips: "44-46",
    //     inseam: "33-34",
    //     sleeve: "34-35",
    //   },
    //   {
    //     size: "2XL",
    //     chest: "48-50",
    //     waist: "40-42",
    //     hips: "48-50",
    //     inseam: "34-35",
    //     sleeve: "35-36",
    //   },
    //   {
    //     size: "3XL",
    //     chest: "52-54",
    //     waist: "44-46",
    //     hips: "52-54",
    //     inseam: "35-36",
    //     sleeve: "36-37",
    //   },
    // ];

const sizeData = [
  {
    size: "XS",
    chest: "76.2-81.3",
    waist: "61.0-66.0",
    hips: "81.3-86.4",
    inseam: "71.1-76.2",
    sleeve: "76.2-81.3",
  },
  {
    size: "S",
    chest: "81.3-86.4",
    waist: "66.0-71.1",
    hips: "86.4-91.4",
    inseam: "76.2-78.7",
    sleeve: "78.7-81.3",
  },
  {
    size: "M",
    chest: "91.4-96.5",
    waist: "71.1-76.2",
    hips: "91.4-96.5",
    inseam: "78.7-81.3",
    sleeve: "81.3-83.8",
  },
  {
    size: "L",
    chest: "101.6-106.7",
    waist: "81.3-86.4",
    hips: "101.6-106.7",
    inseam: "81.3-83.8",
    sleeve: "83.8-86.4",
  },
  {
    size: "XL",
    chest: "111.8-116.8",
    waist: "91.4-96.5",
    hips: "111.8-116.8",
    inseam: "83.8-86.4",
    sleeve: "86.4-88.9",
  },
  {
    size: "2XL",
    chest: "121.9-127.0",
    waist: "101.6-106.7",
    hips: "121.9-127.0",
    inseam: "86.4-88.9",
    sleeve: "88.9-91.4",
  },
  {
    size: "3XL",
    chest: "132.1-137.2",
    waist: "111.8-116.8",
    hips: "132.1-137.2",
    inseam: "88.9-91.4",
    sleeve: "91.4-94.0",
  },
];


    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-gradient-to-r from-gray-950 via-purple-900/15 to-black rounded-3xl max-w-3xl w-full relative animate-fadeIn">
          <button
            onClick={() => setShowSizeGuide(false)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-800/50 hover:bg-gray-700 flex items-center justify-center transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <Ruler className="w-5 h-5 text-purple-400" />
              <h2 className="text-2xl font-semibold">Size Guide</h2>
            </div>
          </div>

          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <div>
              <button className="px-8 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium">
                Measurement
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-purple-500/30">
                    <th className="text-left py-3 px-4 font-semibold">Size</th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Chest(cm)
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Waist(cm)
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Hips(cm)
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Inseam(cm)
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Sleeve(cm)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sizeData.map((row, index) => (
                    <tr
                      key={index}
                      className="border-b border-purple-500/20 hover:bg-purple-900/20"
                    >
                      <td className="py-3 px-4">{row.size}</td>
                      <td className="py-3 px-4">{row.chest}</td>
                      <td className="py-3 px-4">{row.waist}</td>
                      <td className="py-3 px-4">{row.hips}</td>
                      <td className="py-3 px-4">{row.inseam}</td>
                      <td className="py-3 px-4">{row.sleeve}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">How to Measure</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-1">Chest/Bust:</h4>
                  <p className="text-gray-400">
                    Measure around the fullest part of your chest, keeping the
                    tape horizontal.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Waist:</h4>
                  <p className="text-gray-400">
                    Measure around the narrowest part of your waist, usually
                    just above the button.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Hips:</h4>
                  <p className="text-gray-400">
                    Measure around the fullest part of your hips, usually just
                    above the button.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Sleeve:</h4>
                  <p className="text-gray-400">
                    Measure from center back of neck, across shoulder down to
                    bottomhole.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Inseam:</h4>
                  <p className="text-gray-400">
                    Measure from center back of waist, across shoulder down to
                    bottomhole.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const rawImages =
    product.product_images?.filter((img: string) => Boolean(img)) || [];
  const productImages =
    rawImages.length > 0
      ? [...new Set(rawImages as string[])]
      : product.image
        ? [product.image]
        : [];

  const getImageUrl = (img: string) =>
    img.startsWith("http") ? img : `${url}/${img}`;

  const currentImageUrl =
    productImages.length > 0
      ? getImageUrl(
          productImages[selectedImageIndex] ?? productImages[0],
        )
      : "/images/jacket.png";

  const goToPrevImage = () => {
    if (productImages.length <= 1) return;
    setSelectedImageIndex(
      (prev) => (prev - 1 + productImages.length) % productImages.length,
    );
  };

  const goToNextImage = () => {
    if (productImages.length <= 1) return;
    setSelectedImageIndex((prev) => (prev + 1) % productImages.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-950 via-purple-900/15 to-black text-white mt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="container mx-auto mb-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center text-purple-400 hover:text-purple-300 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-purple-600/40 cursor-pointer flex items-center justify-center">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </div>
          </button>
          <h1 className="text-2xl font-semibold text-gray-300 font-cormorant">
            Product Details
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image Gallery */}
          <div className="space-y-4 overflow-visible">
            <div className="flex flex-col-reverse md:flex-row gap-3 overflow-visible">
              {/* Thumbnail strip */}
              {productImages.length > 1 && (
                <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[min(520px,70vw)] pb-1 md:pb-0 custom-scrollbar md:w-[76px] flex-shrink-0">
                  {productImages.map((src: string, i: number) => (
                    <button
                      key={`${src}-${i}`}
                      type="button"
                      onClick={() => setSelectedImageIndex(i)}
                      aria-label={`View image ${i + 1}`}
                      aria-current={selectedImageIndex === i}
                      className={`flex-shrink-0 w-[68px] h-[68px] md:w-[72px] md:h-[72px] rounded-lg overflow-hidden border-2 bg-white transition-all duration-200 ${
                        selectedImageIndex === i
                          ? "border-[#6100FF] ring-2 ring-[#6100FF]/40 shadow-md shadow-purple-500/25 scale-[1.02]"
                          : "border-gray-200 hover:border-purple-400 opacity-75 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={getImageUrl(src)}
                        alt={`${product.product_name} thumbnail ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Main image */}
              <div className="relative flex-1 min-w-0 overflow-visible">
                <div
                  ref={mainImageAreaRef}
                  className="relative bg-white rounded-xl overflow-hidden group shadow-lg shadow-black/20"
                >
                  <div
                    className="relative aspect-square flex items-center justify-center p-4 sm:p-6 cursor-zoom-in md:cursor-crosshair"
                    onClick={() => setShowLightbox(true)}
                    onMouseMove={handleImageZoomMove}
                    onMouseLeave={handleImageZoomLeave}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setShowLightbox(true);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label="Open image in full screen"
                  >
                    <img
                      ref={mainImageRef}
                      key={currentImageUrl}
                      src={currentImageUrl}
                      alt={product.product_name || "Product"}
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 select-none"
                      draggable={false}
                    />

                    {productImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          goToPrevImage();
                        }}
                        aria-label="Previous image"
                        className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          goToNextImage();
                        }}
                        aria-label="Next image"
                        className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                        {selectedImageIndex + 1} / {productImages.length}
                      </span>
                    </>
                  )}

                  <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/40 text-white hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <ZoomIn className="w-4 h-4" />
                  </div>

                  {product?.isMixable && (
                    <span className="absolute top-3 left-3 bg-blue-500 text-white px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium z-10">
                      Mix Design
                    </span>
                  )}
                  </div>
                </div>

                {/* Round zoom preview — beside image, follows hover vertically */}
                {zoomActive && (
                  <div
                    className="hidden md:block absolute z-40 pointer-events-none"
                    style={{
                      width: PREVIEW_SIZE,
                      height: PREVIEW_SIZE,
                      left: "calc(100% + 20px)",
                      top: previewTop,
                    }}
                  >
                    <div
                      className="w-full h-full rounded-full border-4 border-[#6100FF] shadow-2xl shadow-purple-500/40 overflow-hidden bg-white ring-4 ring-purple-500/10"
                      style={{
                        backgroundImage: `url(${currentImageUrl})`,
                        backgroundSize: `${ZOOM_SCALE * 100}%`,
                        backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                        backgroundRepeat: "no-repeat",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToWishlist}
                className="w-full bg-[#6100FF] hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Heart className="w-5 h-5" />
                Add to Wishlist
              </button>
              <button
                onClick={handleAddToCart}
                className="w-full border border-[#6100FF] hover:bg-purple-900/30 text-[#6100FF] cursor-pointer py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button
                onClick={handleOpenEventModal}
                className="w-full border border-[#6100FF] hover:bg-purple-900/30 text-[#6100FF] cursor-pointer py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Add to Event
              </button>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="space-y-4">
            {/* Product Title & Rating */}
            <div>
              <h1 className="text-3xl font-bold font-cormorant mb-2">
                {product.product_name || product.name}
              </h1>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.review_rating || product.rating || 0) ? "fill-yellow-400 text-yellow-400" : "fill-gray-600 text-gray-600"}`}
                    />
                  ))}
                </div>
                <span
                  onClick={() =>
                    router.push(`/product/review?productId=${product._id}`)
                  }
                  className="text-sm cursor-pointer text-purple-400"
                >
                  ({product.review_count || product.reviews || 0} Reviews)
                </span>
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-gray-800/50 border border-[#6100FF] rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {product.vendor?.name?.charAt(0) ||
                        product.vendor?.charAt(0) ||
                        "V"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">
                      {product.vendor?.name || product.vendor || "Vendor"}
                    </p>
                    <p className="text-xs text-gray-400">
                      Trusted seller with quality products
                    </p>
                  </div>
                </div>
                <button
                  // onClick={() => handleSendMessageAuto(product.vendor?._id)}
                  onClick={() =>
                    router.push(`/messaging?vendorId=${product.vendor?._id}`)
                  }
                  className="bg-[#6100FF] hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat
                </button>
              </div>
            </div>

            {/* Price & Stock Status */}
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                {product.discount?.percentage && (
                  <span className="text-l line-through text-gray-500">
                    ₵
                    {(
                      product.product_price *
                      (1 + product.discount.percentage / 100)
                    ).toFixed(2)}
                  </span>
                )}
                <span className="text-4xl font-semibold text-[#6100FF]">
                  ₵
                  {product.product_price?.toFixed(2) ||
                    product.price?.toFixed(2)}
                </span>
              </div>
              <div className="">
                <span className="text-sm text-gray-400">
                  Valid till December 30,2025
                </span>
                <br />
                <span className="text-sm text-gray-400">
                  Weight: {product.product_weight?.amount || 100}{" "}
                  {product.product_weight?.unit || "gram"}
                </span>
              </div>
            </div>

            {/* Mix Design Available */}
            {(product.isMixable || product.isCustom) && (
              <div className="bg-purple-900/20 border border-[#6100FF] rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Info className="w-5 h-5 text-purple-400" />
                  <h3 className="font-medium font-cormorant text-2xl text-purple-300">
                    {product.isMixable
                      ? "Mix Design Available"
                      : "Custom Design Available"}
                  </h3>
                </div>
                <p className="text-sm text-gray-300 mb-4">
                  {product.isMixable
                    ? "This product supports custom mix-mixing! You can combine elements from different products to create your unique style."
                    : "This product can be customized according to your preferences."}
                </p>
                <button
                  onClick={() => {
                    if (
                      !requireLogin("Please sign in to start a custom design")
                    )
                      return;
                    router.push(`/top-products`);
                  }}
                  className="w-full bg-[#912DAD] hover:bg-purple-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors"
                >
                  Start {product.isMixable ? "Mix Design" : "Custom Design"}
                </button>
              </div>
            )}

            {/* Description */}
            <div className="bg-gray-800/50 border border-[#6100FF] rounded-lg p-4">
              <h3 className="font-medium font-cormorant text-2xl mb-2">
                Description
              </h3>
              <p className="text-sm text-gray-400">
                {product.product_description || product.description}
              </p>
            </div>

            {/* Size Selection */}
            <div className="bg-gray-800/50 border border-[#6100FF] rounded-lg p-4">
              <h3 className="font-medium mb-3 font-cormorant text-2xl">
                Select Size
              </h3>
              <div className="flex flex-wrap gap-2">
                {(product.product_stocks || [{ size: "M", stock: 10 }]).map(
                  (stockItem: {
                    _id?: string;
                    size: string;
                    stock: number;
                  }) => (
                    <button
                      key={stockItem._id || stockItem.size}
                      onClick={() => setSelectedSize(stockItem.size)}
                      disabled={stockItem.stock === 0}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors border ${
                        selectedSize === stockItem.size
                          ? "bg-purple-600 border-purple-600 text-white"
                          : stockItem.stock === 0
                            ? "bg-gray-900 border-gray-700 text-gray-500 cursor-not-allowed"
                            : "bg-gray-800 border-[#6100FF] hover:bg-gray-700 text-gray-300"
                      }`}
                    >
                      {stockItem.size}
                      {stockItem.stock === 0 && " (Out)"}
                      {stockItem.stock > 0 && ` (${stockItem.stock})`}
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="bg-gray-800/50 border border-[#6100FF] rounded-lg p-4">
              <h3 className="font-medium mb-3 font-cormorant text-2xl">
                Quantity
              </h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center justify-center transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-lg font-medium w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center justify-center transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3.5 px-4 rounded-lg font-medium transition-all"
            >
              <div className="flex items-center justify-center space-x-2">
                <ShoppingCart className="w-5 h-5" />
                <span>
                  Add to Cart - ₵
                  {(
                    (product.product_price || product.price || 0) * quantity
                  ).toFixed(2)}
                </span>
              </div>
            </button>

            {/* Additional Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Link
                href={`/messaging?vendorId=${product.vendor?._id || product.vendor}`}
              >
                <button className="bg-gray-800/50 cursor-pointer border w-full border-[#6100FF] hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat</span>
                </button>
              </Link>

              <button
                onClick={() => setShowSizeGuide(true)}
                className="bg-gray-800/50 border border-[#6100FF] hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Ruler className="w-4 h-4" />
                <span>Size Guide</span>
              </button>
            </div>

            {/* Custom Design Feature - Show only if product.isCustom is true */}
            {product.isCustom && (
              <div className="bg-purple-900/20 border border-purple-600 rounded-lg p-4">
                <h3 className="font-medium mb-2 text-purple-300">
                  Custom Design Feature
                </h3>
                <p className="text-sm text-gray-300 mb-4">
                  This design supports custom mix-mixing! You can combine
                  elements from different products to create your unique style.
                </p>
                <Link
                  href={`/design-request?productId=${product._id}`}
                  onClick={handleCustomDesign}
                >
                  <button className="w-full cursor-pointer bg-[#912DAD] hover:bg-purple-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors">
                    Custom Design
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Lightbox */}
      {showLightbox && (
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={() => setShowLightbox(false)}
        >
          <button
            type="button"
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
            aria-label="Close gallery"
          >
            <X className="w-5 h-5" />
          </button>

          {productImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevImage();
                }}
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNextImage();
                }}
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div
            className="relative max-w-5xl w-full max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentImageUrl}
              alt={product.product_name || "Product"}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
            {productImages.length > 1 && (
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-full px-2 custom-scrollbar">
                {productImages.map((src: string, i: number) => (
                  <button
                    key={`lightbox-${src}-${i}`}
                    type="button"
                    onClick={() => setSelectedImageIndex(i)}
                    className={`flex-shrink-0 w-14 h-14 rounded-md overflow-hidden border-2 transition-all ${
                      selectedImageIndex === i
                        ? "border-[#6100FF] ring-2 ring-[#6100FF]/50"
                        : "border-white/20 hover:border-white/50 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={getImageUrl(src)}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Event Selection Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-black border border-gray-800 rounded-3xl max-w-lg w-full relative animate-fadeIn">
            <button
              onClick={() => setShowEventModal(false)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-800/50 hover:bg-gray-700 flex items-center justify-center transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center pt-8 pb-6 border-b border-gray-800">
              <h2 className="text-2xl font-semibold">Choose an Event</h2>
              <p className="text-gray-400 text-sm mt-2">
                Select an event to add this product
              </p>
            </div>

            <div className="p-6 space-y-4 max-h-[50vh] overflow-y-auto custom-scrollbar">
              {events.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No events found</p>
                  <button
                    onClick={() => {
                      setShowEventModal(false);
                      router.push("/settings/events");
                    }}
                    className="mt-4 text-purple-400 hover:text-purple-300 text-sm"
                  >
                    Create an event
                  </button>
                </div>
              ) : (
                events?.map((event: any) => (
                  <label
                    key={event._id}
                    className={`relative flex items-start p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                      selectedEventId === event._id
                        ? "border-purple-500 bg-purple-900/20"
                        : "border-gray-700 bg-gray-900/30 hover:border-purple-500/50 hover:bg-purple-900/10"
                    }`}
                  >
                    <input
                      type="radio"
                      name="event"
                      value={event._id}
                      checked={selectedEventId === event._id}
                      onChange={() => setSelectedEventId(event._id)}
                      className="w-5 h-5 text-purple-600 bg-gray-800 border-gray-600 focus:ring-purple-500 focus:ring-2 mt-1"
                    />
                    <div className="ml-3 flex-1">
                      <h3 className="text-lg font-semibold mb-3">
                        {event.title}
                      </h3>

                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {event.eventDate
                            ? new Date(event.eventDate).toLocaleDateString(
                                "en-US",
                                {
                                  dateStyle: "medium",
                                },
                              )
                            : "Date not set"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span>{event.address}</span>
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            event.purchaseOption === "creator"
                              ? "bg-purple-600/20 text-purple-400"
                              : "bg-blue-600/20 text-blue-400"
                          }`}
                        >
                          {event.purchaseOption === "creator"
                            ? "Buy Creator"
                            : "By Participants"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {event?.participant.leanght || 0} participants
                        </span>
                      </div>
                    </div>
                  </label>
                ))
              )}
            </div>

            <div className="p-6 border-t border-gray-800 flex gap-3">
              <button
                onClick={() => setShowEventModal(false)}
                className="flex-1 px-6 py-3 rounded-xl border border-gray-700 hover:bg-gray-800 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  selectedEventId && handleAddToEvent(selectedEventId)
                }
                disabled={!selectedEventId}
                className={`flex-1 px-6 py-3 rounded-xl font-medium transition-colors ${
                  selectedEventId
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                    : "bg-gray-800 text-gray-500 cursor-not-allowed"
                }`}
              >
                Add Product to Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Size Guide Modal — tabs per category, view-only */}
      {showSizeGuide && <SizeGuideModal />}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(75, 85, 99, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(147, 51, 234, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(147, 51, 234, 0.7);
        }
      `}</style>
    </div>
  );
}
