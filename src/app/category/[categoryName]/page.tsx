import CategoryPageClient from "./CategoryPageClient";
import { createPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

type CategoryPageProps = {
  params: Promise<{ categoryName: string }>;
};

function formatCategoryLabel(value: string) {
  const name = decodeURIComponent(value).replace(/[-_]+/g, " ").trim();
  if (!name) return "Fashion";
  return name.replace(/\b\w/g, (char) => char.toUpperCase());
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { categoryName } = await params;
  const label = formatCategoryLabel(categoryName);

  return createPageMetadata({
    title: `${label} clothing`,
    description: `Shop ${label} on Sleeknit. Browse vendor showrooms for ${label.toLowerCase()} fashion, with delivery in 3–4 days.`,
    path: `/category/${encodeURIComponent(categoryName)}`,
  });
}

export default function CategoryPage() {
  return <CategoryPageClient />;
}
