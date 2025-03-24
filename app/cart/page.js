"use client"

import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import CartItem from "@/components/CartItem"
import Chat from "@/components/Chat"

export default function Cart() {
  const { cart } = useCart()

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <h1 className="text-2xl font-bold mx-auto">My Cart</h1>
      </div>

      {cart.length === 0 ? (
        <div className="w-full flex justify-center py-10">
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded-lg fixed bottom-5 ">
                Go to Home
            </Link>
        </div>
      ) : (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <div className="border rounded-lg overflow-hidden">
                {cart.map((item) => (
                    <div key={item._id}>
                        <CartItem item={item} />
                    </div>
                ))}
                </div>
            </div>
            <div className="lg:col-span-1">
                <div className="border rounded-lg p-4">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                    <span>Items ({cart.length}):</span>
                    <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>Free</span>
                    </div>
                </div>
                <div className="border-t pt-2 mb-4">
                    <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>${totalPrice.toFixed(2)}</span>
                    </div>
                </div>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg mb-2 cursor-not-allowed">Checkout</button>
                <button className="w-full border border-red-500 text-red-500 py-2 rounded-lg cursor-not-allowed">
                    Clear Cart
                </button>
                </div>
            </div>
            </div>
            <div className="flex justify-center">
                <Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded-lg fixed bottom-5 ">
                    Go to Home
                </Link>
            </div>
        </>
      )}
      <Chat />
    </main>
  )
}

