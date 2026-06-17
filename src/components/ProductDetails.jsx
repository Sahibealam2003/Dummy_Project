import React, { useEffect, useState } from "react";
import { getSingleProduct } from "../services/api";

const ProductDetails = ({ product: initialProduct, onClose, onEdit }) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!initialProduct) return;

            // If ID is non-numeric (e.g. local UUID), use initialProduct directly
            if (isNaN(Number(initialProduct.id))) {
                setProduct(initialProduct);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const data = await getSingleProduct(initialProduct.id);
                setProduct(data);
                setError(null);
            } catch (err) {
                console.error("Error fetching product details:", err);
                // Fall back to initialProduct if fetch fails
                setProduct(initialProduct);
                setError(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [initialProduct]);

    if (!initialProduct) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center  p-4 backdrop-blur-md transition-opacity duration-300 animate-fade-in">

            <div className="absolute inset-0 cursor-pointer" onClick={onClose}></div>

            <div className="relative w-full max-w-3xl scale-100 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 p-6 text-slate-100 shadow-2xl backdrop-blur-xl transition-all duration-300 md:p-8">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors duration-200"
                    aria-label="Close modal"
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {loading ? (
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 animate-pulse mt-4">
                        <div className="h-72 w-full rounded-2xl bg-slate-800"></div>
                        <div className="flex flex-col justify-between space-y-4">
                            <div className="space-y-3">
                                <div className="h-4 w-1/4 rounded bg-slate-800"></div>
                                <div className="h-8 w-3/4 rounded bg-slate-800"></div>
                                <div className="h-4 w-5/6 rounded bg-slate-800"></div>
                                <div className="h-4 w-2/3 rounded bg-slate-800"></div>
                            </div>
                            <div className="h-10 w-1/3 rounded bg-slate-800"></div>
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-950/30 text-rose-500">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <p className="text-slate-300 font-medium">{error}</p>
                        <button
                            onClick={onClose}
                            className="mt-6 rounded-xl bg-slate-800 px-5 py-2 text-sm font-semibold hover:bg-slate-700 transition-colors duration-200"
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 mt-4">
                        <div className="flex h-72 w-full items-center justify-center rounded-2xl bg-white p-6 md:h-96">
                            <img
                                src={product.image}
                                alt={product.title}
                                className="h-full max-h-full object-contain"
                            />
                        </div>

                        <div className="flex flex-col justify-between">
                            <div>
                                <span className="inline-block rounded-full bg-cyan-950/50 border border-cyan-800/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                                    {product.category}
                                </span>

                                <h2 className="mt-3 text-xl font-bold tracking-tight text-white md:text-2xl">
                                    {product.title}
                                </h2>

                                {product.rating && (
                                    <div className="mt-3 flex items-center gap-2">
                                        <div className="flex items-center gap-0.5">
                                        </div>
                                        <span className="text-xs font-semibold text-slate-300">
                                            {product.rating.rate} / 5.0
                                        </span>
                                        <span className="text-xs text-slate-500">
                                            ({product.rating.count} reviews)
                                        </span>
                                    </div>
                                )}

                                <p className="mt-4 text-sm leading-relaxed text-slate-400">
                                    {product.description}
                                </p>
                            </div>


                            <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-6">
                                <div>
                                    <span className="text-xs text-slate-500 block">Price</span>
                                    <span className="text-2xl font-extrabold text-emerald-400">
                                        ${product.price?.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => onEdit(product)}
                                        className="cursor-pointer rounded-xl bg-yellow-600 px-6 py-2.5 text-sm font-semibold hover:bg-yellow-500 hover:text-white text-slate-100 transition-colors duration-200"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="cursor-pointer rounded-xl bg-slate-800 px-6 py-2.5 text-sm font-semibold hover:bg-slate-700 hover:text-white transition-colors duration-200"
                                    >
                                        Close View
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ProductDetails;
