import React, { useState } from "react";

const ProductCard = ({ product, onClick, onDelete, onEdit, onAddToCart }) => {
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);
    const [added, setAdded] = useState(false);

    const handleAddToCart = async () => {
        if (quantity < 1) return;
        setAdding(true);
        try {
            await onAddToCart(product.id, quantity);
            setAdded(true);
            setTimeout(() => setAdded(false), 1500);
            setQuantity(1);
        } catch (error) {
            console.error("Failed to add to cart:", error);
        } finally {
            setAdding(false);
        }
    };

    return (
        <div className="relative bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition duration-300">
            <div className="flex justify-center mb-4">
                <img
                    src={product.image}
                    alt={product.title}
                    className="h-40 w-40 object-contain rounded-lg"
                />
            </div>
            <p className="text-sm text-gray-500 mb-2">
                Category:
                <span className="font-medium text-gray-700 ml-1">
                    {product.category}
                </span>
            </p>

            <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-3">
                {product.title.length > 24 ? `${product.title.slice(0, 24)}...` : product.title}
            </h3>
            <div className="mb-4">

                <p className="text-xl font-bold text-green-600">
                    ${product.price?.toFixed(2)}
                </p>


                {
                    product.rating && (

                        <p className="text-yellow-500 mt-1">
                            ⭐ {product.rating.rate}
                        </p>

                    )
                }
            </div>

            {/* Quantity selector + Add to Cart */}
            <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="px-2.5 py-1.5 text-gray-600 hover:bg-gray-100 transition text-sm font-bold cursor-pointer"
                    >
                        −
                    </button>
                    <span className="px-3 py-1.5 text-sm font-semibold text-gray-800 min-w-[32px] text-center">
                        {quantity}
                    </span>
                    <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="px-2.5 py-1.5 text-gray-600 hover:bg-gray-100 transition text-sm font-bold cursor-pointer"
                    >
                        +
                    </button>
                </div>
                <button
                    onClick={handleAddToCart}
                    disabled={adding}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                        added
                            ? "bg-green-500 text-white"
                            : adding
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            : "bg-emerald-600 text-white hover:bg-emerald-700"
                    }`}
                >
                    {added ? "✓ Added!" : adding ? "Adding..." : "🛒 Add to Cart"}
                </button>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={() => onClick(product.id)}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-xs font-semibold"
                >
                    View
                </button>
                <button
                    onClick={() => onEdit(product)}
                    className="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition text-xs font-semibold"
                >
                    Edit
                </button>
                <button
                    onClick={() => onDelete(product.id)}
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition text-xs font-semibold"
                >
                    Delete
                </button>
            </div>


        </div>

    );
};



export default ProductCard;