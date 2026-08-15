import Hero from "@/components/Hero";
import CategoryTiles from "@/components/CategoryTiles";
import BenefitsBar from "@/components/BenefitsBar";
import FeaturedProducts from "@/components/FeaturedProducts";
import PromoBanners from "@/components/PromoBanners";
import { getCategories, getFeaturedProducts } from "@/lib/data";

/** Se revalida cada 5 min: el catálogo cambia poco y así el home vuela. */
export const revalidate = 300;

export default async function HomePage() {
  const [categories, featured] = await Promise.all([
    getCategories(),
    getFeaturedProducts(8),
  ]);

  return (
    <>
      <Hero />
      <CategoryTiles categories={categories} />
      <BenefitsBar />
      <FeaturedProducts products={featured} />
      <PromoBanners />
    </>
  );
}
