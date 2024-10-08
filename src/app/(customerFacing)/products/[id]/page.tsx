import db from "@/db/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/formatters";

export default async function ProductDetailPage({ params: { id } }: { params: { id: string } }) {
  const product = await db.product.findUnique({
    where: { id }
  });

  if (!product) return notFound();

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row items-start">
        <div className="relative w-full md:w-1/2 h-96 mb-4 md:mb-0">
          <Image src={product.imagePath} alt={product.name} fill className="object-cover rounded-md" />
        </div>
        <div className="md:w-1/2 md:pl-8">
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <p className="text-xl font-semibold text-yellow-950 mb-4">
            {formatCurrency(product.priceInCents / 100)}
          </p>
          <Link href={`/products/${product.id}/purchase`}>
            <button className="bg-yellow-950 text-white px-6 py-2 rounded-md hover:bg-yellow-800 transition">
              Comprar
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
