import {
  absoluteUrl,
  categoryNameFromItem,
  categoryPath,
  fetchApiJson,
  productPath,
  unwrapList,
} from "@/lib/seo";
import type { MetadataRoute } from "next";

export const revalidate = 3600;

const STATIC_PATHS: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.6 },
  { path: "/faqs", changeFrequency: "monthly", priority: 0.7 },
  { path: "/vendors", changeFrequency: "daily", priority: 0.8 },
  { path: "/showroom", changeFrequency: "daily", priority: 0.8 },
  { path: "/hotdeals", changeFrequency: "daily", priority: 0.8 },
  { path: "/new-arrivals", changeFrequency: "daily", priority: 0.8 },
  { path: "/top-products", changeFrequency: "daily", priority: 0.8 },
  { path: "/ventures", changeFrequency: "weekly", priority: 0.5 },
  { path: "/careers", changeFrequency: "weekly", priority: 0.5 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms-condition", changeFrequency: "yearly", priority: 0.3 },
  { path: "/refund-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/auth/login", changeFrequency: "yearly", priority: 0.2 },
  { path: "/auth/sign-up", changeFrequency: "yearly", priority: 0.2 },
];

function entry(
  path: string,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority: number,
): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency,
    priority,
  };
}

function itemId(item: Record<string, unknown>) {
  const id = item._id ?? item.id;
  return typeof id === "string" && id ? id : "";
}

async function collectProductIds() {
  const ids = new Set<string>();
  const listPaths = [
    "/home/newest-products",
    "/home/top-products",
    "/home/hot-deals",
  ];

  const lists = await Promise.all(listPaths.map((path) => fetchApiJson(path)));
  for (const payload of lists) {
    for (const item of unwrapList(payload)) {
      const id = itemId(item);
      if (id) ids.add(id);
    }
  }

  const categoriesPayload = await fetchApiJson("/home/category");
  const categories = unwrapList(categoriesPayload);
  const categoryNames = categories
    .map(categoryNameFromItem)
    .filter(Boolean)
    .slice(0, 40);

  const byCategory = await Promise.all(
    categoryNames.map((name) =>
      fetchApiJson(`/home/products-by-category/${encodeURIComponent(name)}`),
    ),
  );
  for (const payload of byCategory) {
    for (const item of unwrapList(payload)) {
      const id = itemId(item);
      if (id) ids.add(id);
    }
  }

  return { ids, categoryNames };
}

async function collectShowroomIds() {
  const payload = await fetchApiJson("/showroom/get-all");
  return unwrapList(payload)
    .map(itemId)
    .filter(Boolean);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = STATIC_PATHS.map((item) =>
    entry(item.path, item.changeFrequency, item.priority),
  );

  try {
    const [{ ids, categoryNames }, showroomIds] = await Promise.all([
      collectProductIds(),
      collectShowroomIds(),
    ]);

    for (const name of categoryNames) {
      routes.push(entry(categoryPath(name), "weekly", 0.7));
    }
    for (const id of ids) {
      routes.push(entry(productPath(id), "daily", 0.9));
    }
    for (const id of showroomIds) {
      routes.push(
        entry(`/showroom/view-showroom?showroomId=${encodeURIComponent(id)}`, "weekly", 0.6),
      );
    }
  } catch {
    // Static routes still publish if the API is unreachable.
  }

  return routes;
}
