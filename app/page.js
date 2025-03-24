"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import ProductCard from "@/components/ProductCard"
import SearchBar from "@/components/SearchBar"
import Chat from "@/components/Chat"
import FileUploadButton from "@/components/FileUploadButton"

export default function Home() {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const handleRemoveProducts = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/product-list`, {method: 'DELETE'})
    const jsonResponse = await response.json()
    if(jsonResponse.success){
      setProducts([])
      console.log('All products removed successfully!')
    }
  }

  useEffect(() => {
    (async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/product-list`)
      const jsonResponse = await response.json()
      if(jsonResponse.success){
        setProducts(jsonResponse.data || [])
        setSearchTerm('')
      }
    })();
  }, [])

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 ">
        <h1 className="text-3xl font-bold ml-4">Quick Order</h1>
        <div className="flex items-center gap-4 mx-4">
          <div className="flex gap-4">
            <FileUploadButton setProducts={setProducts} />
            <button onClick={handleRemoveProducts} className="bg-red-500 font-bold border rounded-lg px-5 py-3" >Remove All Products</button>
          </div>
          <SearchBar setProducts={setProducts} setSearchTerm={setSearchTerm} />
          <Link href="/cart" className="relative">
            <ShoppingCart size={24} />
          </Link>
        </div>
      </header>

      {/* Products Grid */}
      {searchTerm && <h1 className="text-2xl font-bold mb-4">Search Results for &apos;{searchTerm}&apos;:</h1>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products && products.map((product) => (
          <div key={product._id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">No products found matching your search.</p>
        </div>
      )}

      <Chat />
    </main>
  )
}

