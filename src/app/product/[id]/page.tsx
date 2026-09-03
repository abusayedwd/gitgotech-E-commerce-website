import ProductDetails from "@/components/landingPage/ProductDetails";
import JsonLd from "@/components/shared/JsonLd";
import {
  DEFAULT_DESCRIPTION,
  buildProductJsonLd,
  createPageMetadata,
  fetchProductForSeo,
  productPath,
  productSeoDescription,
  productSeoImage,
} from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProductForSeo(id);
  if (!product) {
    return { title: "Page not found" };
  }
  const name = product.product_name || product.name || "Product";

  return createPageMetadata({
    title: name,
    description: productSeoDescription(product) || DEFAULT_DESCRIPTION,
    path: productPath(id),
    image: productSeoImage(product),
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await fetchProductForSeo(id);

  if (!product) notFound();

  return (
    <>
      <JsonLd data={buildProductJsonLd({ ...product, _id: id })} />
      <ProductDetails productId={id} />
    </>
  );
}
