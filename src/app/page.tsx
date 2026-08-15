import { Suspense } from "react";
import Hero from "@/components/Hero";
import CategoryTiles from "@/components/CategoryTiles";
import BenefitsBar from "@/components/BenefitsBar";
import FeaturedProducts from "@/components/FeaturedProducts";
import PromoBanners from "@/components/PromoBanners";
import { getCategories, getFeaturedProducts } from "@/lib/data";

export const revalidate = 300;

export default function HomePage() {
  return (
    <>
      <Hero />
      <Suspense fallback={<CategorySkeleton />}>
        <HomeCategories />
      </Suspense>
      <BenefitsBar />
      <Suspense fallback={<ProductsSkeleton />}>
        <HomeFeatured />
      </Suspense>
      <PromoBanners />
    </>
  );
}

async function HomeCategories() {
  const categories = await getCategories();
  return <CategoryTiles categories={categories} />;
}

async function HomeFeatured() {
  const featured = await getFeaturedProducts(8);
  return <FeaturedProducts products={featured} />;
}

function CategorySkeleton() {
  return (
    <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-3 px-4 py-12 sm:grid-cols-3 lg:grid-cols-6 sm:px-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-40 animate-pulse rounded-3xl bg-white/80" />
      ))}
    </div>
  );
}

function ProductsSkeleton() {
  return (
    <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-4 px-4 py-12 lg:grid-cols-4 sm:px-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-80 animate-pulse rounded-3xl bg-white/80" />
      ))}
    </div>
  );
}
