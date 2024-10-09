"use client"

import { useState, useEffect } from "react"
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
  const [quantity, setQuantity] = useState(1)
  const [totalPrice, setTotalPrice] = useState(product.priceInCents)

  useEffect(() => {
    setTotalPrice(product.priceInCents * quantity)
  }, [quantity, product.priceInCents])

  const incrementQuantity = () => setQuantity(prev => prev + 1)
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1)

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
            {formatCurrency(totalPrice / 100)}
          </div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="line-clamp-3 text-muted-foreground text-sm">{product.description}</div>
          
          {/* Contador de quantidade */}
          <div className="flex items-center space-x-4 mt-4">
            <button onClick={decrementQuantity} className="px-3 py-1 bg-gray-200 rounded">-</button>
            <span>{quantity}</span>
            <button onClick={incrementQuantity} className="px-3 py-1 bg-gray-200 rounded">+</button>
          </div>
        </div>
      </div>
      
      {/* Formulário de pagamento */}
      <div className="max-w-5xl w-full mx-auto space-y-8">
        <Elements options={{ clientSecret }} stripe={stripePromise}>
          <Form totalPrice={totalPrice} />
        </Elements>
      </div>
    </div>
  )
}

function Form({ totalPrice }: { totalPrice: number }) {
  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!stripe || !elements) return

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "https://example.com/order/confirmation",
      },
    })

    if (result.error) {
      console.error(result.error.message)
    } else {
      // Payment succeeded
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button type="submit" disabled={!stripe} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Pay {formatCurrency(totalPrice / 100)}
      </button>
    </form>
  )
}