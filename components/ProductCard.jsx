import { useCart } from "@/lib/cart-context"
import { useState } from "react";
import Image from "next/image";

function ProductCard({product}) {
    const { addToCart } = useCart()
    const [imageSrc, setImageSrc] = useState(product.images? product.images[0] : '/default-image.jpg');
    const handleError = () => {
        setImageSrc('/default-image.jpg');
    };

    return (
        <div className="border rounded-lg p-4 flex flex-col">
            <div className="relative h-48 mb-4">
              <Image src={imageSrc} onError={handleError} alt={product.title} fill className="object-contain" />
            </div>
            <h2 className="text-lg font-semibold mb-2 line-clamp-1">{product.title}</h2>
            <p className="text-gray-600 mb-2 text-sm line-clamp-2">{product.sku}</p>
            <div className="mt-auto flex justify-between items-center">
              <span className="font-bold">${product.price.toFixed(2)}</span>
              <button
                onClick={() => addToCart(product)}
                className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm cursor-pointer"
              >
                Add to Cart
              </button>
            </div>
          </div>
    );
}

export default ProductCard;