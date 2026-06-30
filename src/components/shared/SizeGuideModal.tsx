"use client";

import { Ruler, X } from "lucide-react";
import { useEffect, useState } from "react";

type SizeChart = {
  columns: string[];
  rows: Record<string, string>[];
};

type Tab = {
  key: string;
  short: string;
  long: string;
  kind: "clothing" | "shoe";
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

const TABS: Tab[] = [
  { key: "Topwear (Shirts, T-Shirts, Jackets)",  short: "Topwear",    long: "Topwear (Shirts, T-Shirts, Jackets)",  kind: "clothing" },
  { key: "Bottomwear (Pants, Jeans, Trousers)", short: "Bottomwear", long: "Bottomwear (Pants, Jeans, Trousers)", kind: "clothing" },
  { key: "Footwear / Shoe Size Conversion",     short: "Footwear",   long: "Footwear / Shoe Size Conversion",     kind: "shoe" },
];

/** Picks the best tab for the given product category string. */
export function matchSizeGuideTab(rawCategory: string | null | undefined): string {
  const c = String(rawCategory || "").toLowerCase();
  if (/(shoe|sneaker|boot|footwear|sandal)/.test(c)) {
    return "Footwear / Shoe Size Conversion";
  }
  if (/(pant|jean|trouser|bottom|short)/.test(c)) {
    return "Bottomwear (Pants, Jeans, Trousers)";
  }
  return "Topwear (Shirts, T-Shirts, Jackets)";
}

interface Props {
  open: boolean;
  onClose: () => void;
  /** Optional — used to pre-select a tab. Falls back to Topwear. */
  category?: string | null;
}

export default function SizeGuideModal({ open, onClose, category }: Props) {
  const [activeKey, setActiveKey] = useState<string>(
    "Topwear (Shirts, T-Shirts, Jackets)",
  );

  useEffect(() => {
    if (open) setActiveKey(matchSizeGuideTab(category));
  }, [open, category]);

  if (!open) return null;

  const activeTab = TABS.find((t) => t.key === activeKey) || TABS[0];
  const chart = SIZE_CHARTS[activeTab.key];

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <div className="bg-gradient-to-r from-gray-950 via-purple-900/15 to-black border border-purple-500/30 rounded-3xl max-w-3xl w-full relative animate-fadeIn">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-800/50 hover:bg-gray-700 flex items-center justify-center transition-colors z-10 text-white"
          aria-label="Close size guide"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-2 text-white">
            <Ruler className="w-5 h-5 text-purple-400" />
            <h2 className="text-2xl font-cormorant font-semibold">Size Guide</h2>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4 border-b border-gray-700/50 overflow-x-auto">
          <div className="flex gap-2 min-w-max pb-3">
            {TABS.map((t) => {
              const active = t.key === activeKey;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setActiveKey(t.key)}
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

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar text-white">
          <p className="text-xs uppercase tracking-wider text-purple-300/80 font-medium">
            {activeTab.long}
          </p>

          {/* Generic table */}
          {chart && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-purple-500/30">
                    {chart.columns.map((col) => (
                      <th
                        key={col}
                        className="text-left py-3 px-4 font-semibold whitespace-nowrap"
                      >
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
          )}

          {/* How to Measure */}
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
}
