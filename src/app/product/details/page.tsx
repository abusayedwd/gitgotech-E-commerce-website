import { redirect } from "next/navigation";

export default async function LegacyProductDetailsPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  if (id) redirect(`/product/${id}`);
  redirect("/");
}
