import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import db from "@/db/db";
import { Product } from "@prisma/client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import Image from "next/image";
import fulls from "@/app/assets/banner-fita-regua.webp";
import fullhs from "@/app/assets/banner-cremosissimo-2.webp";
import { cache } from "@/lib/cache";

const getMostPopularProducts = cache(() =>  {
  return db.product.findMany({
    where: { isAvaliableForPurchase: true },
    orderBy: { orders: { _count: "desc" } },
    take: 6,
  });
}, ["/", "getMostPopularProducts"], {revalidate: 60 * 60 * 24})    //Essa chave deve ser unica, e foi configurado o nextCache para isso no lib do projeto, visando melhor desempenho do projeto

const getNewestProducts = cache(() => {
  return db.product.findMany({
    where: { isAvaliableForPurchase: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });
}, ["/", "getNewestProducts"], { revalidate: 60 * 60 * 24 }); // Unique key and revalidate after 24 hours


export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      <Banner src={fulls} alt="banner" />

      <div className="container mx-auto px-4 max-w-[1164px]">
        <ProductGridSection title="Mais Populares" productsFetcher={getMostPopularProducts} />
        <LargeBox />
        <PlaceholderSection />
        <SectionTitle title="-- Produtos Sazonais --" />
        <ProductGridSection title="Recentes" productsFetcher={getNewestProducts} />
      </div>


      <Banner src={fullhs} alt="completo" />
    </main>
  );
}

type ProductGridSectionProps = {
  title: string;
  productsFetcher: () => Promise<Product[]>;
};

function ProductGridSection({ productsFetcher, title }: ProductGridSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <h2 className="text-3xl font-bold">{title}</h2>
        <Button asChild variant={"outline"}>
          <Link href="/products" className="space-x-2 flex items-center">
            <span>Ver Mais</span>
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <Suspense
          fallback={
            <>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </>
          }
        >
          <ProductSuspense productsFetcher={productsFetcher} />
        </Suspense>
      </div>
    </div>
  );
}

async function ProductSuspense({ productsFetcher }: { productsFetcher: () => Promise<Product[]> }) {
  const products = await productsFetcher();
  return (
    <>
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </>
  );
}

interface BannerProps {
  src: StaticImageData;
  alt: string;
}

function Banner({ src, alt }: BannerProps) {
  return <Image src={src} className="w-full h-auto" alt={alt} priority />;
}

function PlaceholderSection() {
  return <div className="w-full border border-black h-96 shadow-md mb-8 mt-8 rounded-xl"></div>;
}

function LargeBox() {
  return <div className="w-full h-64 bg-gray-200 mb-8">/* Conteúdo da LargeBox */</div>;
}

interface SectionTitleProps {
  title: string;
}

function SectionTitle({ title }: SectionTitleProps) {
  return (
    <div className="flex justify-center mb-8">
      <h1 className="text-2xl font-semibold">{title}</h1>
    </div>
  );
}
