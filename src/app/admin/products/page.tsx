import { Button } from "@/components/ui/button";
import { PageHeader } from "../_components/PageHeader";
import Link from "next/link";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import db from "@/db/db";
import { CheckCircle2, MoreVertical, XCircle } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ActiveToggleDropdownItem, DeleteDropdownItem } from "./_components/ProductActions";


export default function AdminProductPages() {
  return <>
    <div className="flex justify-between items-center gap-4">
      <PageHeader>Produtos</PageHeader>
      <Button asChild>
        <Link href="/admin/products/new">Adicione um Produto</Link>
      </Button>
    </div>

    <ProductsTable />

  </>
}

async function ProductsTable() {
  const products = await db.product.findMany({ 
    select: {
     id: true, 
     name: true, 
     priceInCents: true, 
     isAvaliableForPurchase: true, 
     _count: { select: { orders: true}}  
    },
    orderBy: { name: "asc"}
  })

  if (products.length === 0) return <p>Nenhum Produto Encontrado</p>

  return <>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-0">
            <span className="sr-only">Disponível para Compra</span>
          </TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>Preço</TableHead>
          <TableHead>Pedidos</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Ações</span>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {products.map(product => (
          <TableRow key={product.id}>
            <TableCell>
              {product.isAvaliableForPurchase ? (
                <>
                  <span className="sr-only">Disponível</span>
                  <CheckCircle2 />
                </>
              ) : (
                <>
                <span className="sr-only">Indisponível</span>
                <XCircle className="stroke-destructive"/>
                </>
              )}
            </TableCell>
            <TableCell>{ product.name}</TableCell>
            <TableCell>{ formatCurrency(product.priceInCents / 100) }</TableCell>
            <TableCell>{ formatNumber(product._count.orders) }</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical/>
                  <span className="sr-only">Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <a download href={`/admin/products/${product.id}/download`}>
                    Baixar
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/products/${product.id}/edit`}>
                    Editar
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator/>

                  <ActiveToggleDropdownItem id={product.id} isAvailableForPurchase={product.isAvaliableForPurchase}/>
                  <DeleteDropdownItem id={product.id} disabled={product._count.orders > 0}/>

                </DropdownMenuContent>
              </DropdownMenu>
              </TableCell>  
          </TableRow>
        ))}
      </TableBody>

    </Table>
  </>
}