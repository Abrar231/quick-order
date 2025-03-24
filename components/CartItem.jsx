import { useState } from "react";
import { useCart } from "@/lib/cart-context"
import Image from "next/image"
import { ArrowLeft, Trash2, Plus, Minus } from "lucide-react"

function CartItem({item}) {
    const { cart, removeFromCart, updateQuantity, clearCart } = useCart()
    const [imageSrc, setImageSrc] = useState(item.images[0])
    const [loading, setLoading] = useState(false)
    const handleError = () => {
        setImageSrc('/default-image.jpg');
    };

    return (
        <div className="flex items-center p-4 border-b ">
            <div className="relative w-16 h-16 mr-4">
                <Image src={imageSrc} onError={handleError} alt={item.title} fill className="object-contain" />
            </div>
            <div className="flex-1">
                <h3 className="font-medium line-clamp-1">{item.title}</h3>
                <p className="text-gray-500 text-sm">${item.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center">
                <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    disabled={item.quantity <= 1 || loading}
                    className="p-1 rounded-full border disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                    <Minus size={16} />
                </button>
                <span className="mx-2 w-8 text-center">{item.quantity}</span>
                <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="p-1 rounded-full border disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    <Plus size={16} />
                </button>
            </div>
            <button onClick={() => removeFromCart(item._id)} className="ml-4 text-red-500 cursor-pointer">
                <Trash2 size={18} />
            </button>
        </div>
    );
}

export default CartItem;