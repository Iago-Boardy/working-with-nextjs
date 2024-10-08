import db from "@/db/db"
import { notFound } from "next/navigation"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export default async function PurchasePage( { params: { id}} : {params: {id: string}}) {
  const product = await db.product.findUnique({
  where: {id} })
  if (product == null) return notFound();

  stripe.paymentIntents.create

  return <h1>Hi Bro</h1>
}