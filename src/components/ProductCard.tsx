'use client';

import { formatCurrency } from "@/lib/formatters";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Heart } from "lucide-react";

type ProductCardProps = {
  id: string;
  name: string;
  priceInCents: number;
  description: string;
  imagePath: string;
};

export function ProductCard({ id, name, priceInCents, description, imagePath }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  const toggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <div className="relative z-10 w-[260px] h-auto bg-white flex flex-col items-center justify-between rounded-xl p-4 text-yellow-950 shadow-md border-[#ebebeb] border-[1px] hover:shadow-lg transition duration-300">
      <div className="absolute top-2 right-2 cursor-pointer z-20" onClick={toggleLike}>
        <Heart className={`transition duration-300 hover:text-red-600 hover:scale-[1.05] ${isLiked ? 'text-red-600 fill-red-600' : ''}`} />
      </div>
      
      <div className="relative w-full h-[150px] mb-2">
        <Image 
          src={imagePath} 
          alt={name} 
          fill 
          className="object-cover rounded-[20px] p-3" 
        />
      </div>
      
      <div className="flex flex-col gap-1 mb-4">
        <h1 className="text-[20px] font-semibold">{name}</h1>
        <p className="text-[#4d2902]/60 text-[13px]">
          {description}
        </p>
      </div>
      
      <div className="w-full flex flex-col gap-2 mt-auto">
        <h1 className="text-[18px] text-yellow-950 font-semibold">
          {formatCurrency(priceInCents / 100)}
        </h1>
        <Link href={`/products/${id}/purchase`}>
          <Button size="sm" className="w-full border rounded-[8px] py-1 text-white bg-yellow-950 hover:bg-white hover:text-yellow-950 hover:border-yellow-950 transition duration-300">
            Comprar
          </Button>
        </Link>
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <Card className="w-[260px] h-[390px] overflow-hidden flex flex-col animate-pulse">
      <div className="w-full h-[150px] bg-gray-300" />
      <CardHeader>
        <CardTitle>
          <div className="w-3/4 h-6 rounded-full bg-gray-300" />
        </CardTitle>
        <CardDescription>
          <div className="w-1/2 h-4 rounded-full bg-gray-300" />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="w-full h-4 rounded-full bg-gray-300" />
        <div className="w-full h-4 rounded-full bg-gray-300" />
        <div className="w-3/4 h-4 rounded-full bg-gray-300" />
      </CardContent>
      <CardFooter>
        <Button className="w-full" disabled size="lg" />
      </CardFooter>
    </Card>
  );
}
