"use client"

import { formatCurrency } from "@/lib/formatters"
import Stripe, { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import Image from "next/image"


type CheckoutFormProps = {
  product: {
    imagePath: string,
    name: string,
    priceInCents: number,
    description: string
  },
  clientSecret: string
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string)

export default function CheckoutForm({ product, clientSecret }: CheckoutFormProps) {
  return (
    <div className="flex flex-col max-w-5xl w-full space-y-6 text-[24px] font-bold">
      <h1>Pagamentos</h1>
      <div className="flex gap-6 items-start space-y-6">
        {/* Imagem do produto */}
        <div className="flex-shrink-0 w-1/3 aspect-video relative">
          <Image 
            src={product.imagePath} 
            fill 
            alt={product.name} 
            className="object-cover"
          />
        </div>
        
        {/* Detalhes do produto */}
        <div className="flex flex-col justify-between w-2/3 space-y-2">
        <div className="text-lg">
            {formatCurrency(product.priceInCents / 100)}
          </div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="line-clamp-3 text-muted-foreground text-sm">{product.description}</div>
        </div>
      </div>
      
      {/* Formulário de pagamento, ver na internet pois tem documentacao para editar e deixar ele melhor ou mais completo, enfim */}
      <div className="max-w-5xl w-full mx-auto space-y-8">
        <Elements options={{ clientSecret }} stripe={stripePromise}>
          <Form />
        </Elements>
      </div>
    </div>
  )

  function Form() {
    const stripe = useStripe()
    const elements = useElements()
    return <PaymentElement />
  }
}
