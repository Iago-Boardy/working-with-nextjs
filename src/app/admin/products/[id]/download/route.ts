import db from "@/db/db";
import fs from "fs/promises";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params: { id } }: { params: { id: string }}) {
  // Buscar produto no banco de dados
  const product = await db.product.findUnique({ 
    where: { id }, 
    select: { filePath: true, name: true } 
  });

  // Verificar se o produto foi encontrado
  if (product == null) return notFound()

  // Obter o tamanho do arquivo
  const { size } = await fs.stat(product.filePath)
  const file = await fs.readFile(product.filePath)
  const extension = product.filePath.split(".").pop()

  return new NextResponse(file, { headers: { 
    "Content-Disposition": `attachement; filename="${product.name}.${extension}"`,  //AQUI EM RESUMO BAIXAMOS AS IMAGENS
    "Content-Length": size.toString(),
  }})

}
