import React, { useState } from "react";
import { addCart } from "../services/api";

const CartModal = ({ isOpen, onClose, onCartAdded, products }) => {
    const [cartProducts, setCartProducts] = useState([
        { productId: "", quantity: 1 }
    ]);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleAddRow = () => {
        setCartProducts((prev) => [...prev, { productId: "", quantity: 1 }]);
    };

    const handleRemoveRow = (index) => {
        if (cartProducts.length <= 1) return;
        setCartProducts((prev) => prev.filter((_, i) => i !== index));
    };

    const handleChange = (index, field, value) => {
        setCartProducts((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, [field]: field === "quantity" ? Math.max(1, Number(value)) : Number(value) } : item
            )
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validProducts = cartProducts.filter(
            (p) => p.productId !== "" && p.quantity >= 1
        );

        if (validProducts.length === 0) return;

        const cartPayload = {
            userId: 1,
            date: new Date().toISOString(),
            products: validProducts.map((p) => ({
                productId: Number(p.productId),
                quantity: Number(p.quantity)
            }))
        };

        setSubmitting(true);
        try {
            await addCart(cartPayload);
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setCartProducts([{ productId: "", quantity: 1 }]);
                onCartAdded?.();
                onClose();
            }, 1200);
        } catch (error) {
            console.error("Failed to create cart:", error);
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            <div
                className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
                style={{ animation: "modalSlideIn 0.3s ease-out" }}
            >
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">
                                🛒
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    Create New Cart
                                </h2>
                                <p className="text-indigo-200 text-xs mt-0.5">
                                    Add products to a new cart
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition cursor-pointer"
                        >
                            ❌
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                        {cartProducts.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100"
                            >
                                <div className="flex-1">
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                                        Product
                                    </label>
                                    <select
                                        value={item.productId}
                                        onChange={(e) =>
                                            handleChange(index, "productId", e.target.value)
                                        }
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                                        required
                                    >
                                        <option value="">Select product</option>
                                        {products?.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.title?.length > 35
                                                    ? `${p.title.slice(0, 35)}...`
                                                    : p.title}{" "}
                                                — ${p.price?.toFixed(2)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="w-20">
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                                        Qty
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) =>
                                            handleChange(index, "quantity", e.target.value)
                                        }
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center"
                                        required
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handleRemoveRow(index)}
                                    disabled={cartProducts.length <= 1}
                                    className={`mt-5 w-8 h-8 rounded-lg flex items-center justify-center text-sm transition cursor-pointer ${cartProducts.length <= 1
                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        : "bg-red-100 text-red-600 hover:bg-red-200"
                                        }`}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={handleAddRow}
                        className="mt-3 w-full py-2.5 rounded-xl border-2 border-dashed border-indigo-300 text-indigo-600 text-sm font-semibold hover:bg-indigo-50 hover:border-indigo-400 transition cursor-pointer flex items-center justify-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Another Product
                    </button>
                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition cursor-pointer ${success
                                ? "bg-green-500"
                                : submitting
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-200"
                                }`}
                        >
                            {success
                                ? "✓ Cart Created!"
                                : submitting
                                    ? "Creating..."
                                    : "🛒 Create Cart"}
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                @keyframes modalSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px) scale(0.97);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
            `}</style>
        </div>
    );
};

export default CartModal;