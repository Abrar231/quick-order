"use client"

import { createContext, useContext, useState, useEffect } from "react"

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])

  useEffect(() => {
    (async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/cart`);
            const jsonResponse = await response.json();
            if(jsonResponse.success){
                setCart(jsonResponse.data || [])
            }
        } catch (error) {
            console.error("Failed to load cart data", error)
        }
    })();
  }, []);

  const addToCart = async (product) => {
    const existingItem = cart.length > 0 ? cart.find((item) => item._id === product._id) : false;
    if(!existingItem){
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/cart`, {body: JSON.stringify({variantId: product._id, quantity: 1}), method: 'POST', headers: {'Content-Type': 'application/json'}})
        const jsonResponse = await response.json();
        if(jsonResponse.success){
            setCart((prevCart) => [...prevCart, { ...product, quantity: 1 }])
        }
    }
  }

  const removeFromCart = async (id) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/cart`, {body: JSON.stringify({variantId: id}), method: 'DELETE', headers: {'Content-Type': 'application/json'}});
    const jsonResponse = await response.json();
    if(jsonResponse.success){
        setCart((prevCart) => prevCart.filter((item) => item._id !== id))
    }
  }

  const updateQuantity = async (id, newQuantity) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/cart`, {body: JSON.stringify({variantId: id, quantity: newQuantity}), method: 'POST', headers: {'Content-Type': 'application/json'}});
    const jsonResponse = await response.json();
    if(jsonResponse.success){
        setCart((prevCart) => prevCart.map((item) => (item._id === id ? { ...item, quantity: newQuantity } : {...item})))
    }
  }

  const clearCart = () => {
    setCart([])
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}

