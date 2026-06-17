import React, { useEffect, useState } from "react";

const EditProductModal = ({ isOpen, onClose, onUpdate, product }) => {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
        }
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (product) {
            setTitle(product.title || "");
            setPrice(product.price !== undefined ? String(product.price) : "");
            setDescription(product.description || "");
            setCategory(product.category || "");
            setImage(product.image || "");
        }
    }, [product, isOpen]);

    if (!isOpen || !product) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await onUpdate(product.id, {
                title,
                price: Number(price),
                description,
                category,
                image
            });
            onClose();
        } catch (error) {
            console.error("Failed to update product:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-slate-950/40 transition-opacity duration-300">

            <div className="absolute inset-0 cursor-pointer" onClick={onClose}></div>

            <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 p-6 text-slate-100 shadow-2xl backdrop-blur-xl transition-all duration-300 md:p-8">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors duration-200"
                    aria-label="Close modal"
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="mb-6">
                    <span className="inline-block rounded-full bg-cyan-950/50 border border-cyan-800/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                        Update
                    </span>
                    <h2 className="mt-2 text-xl font-bold tracking-tight text-white md:text-2xl">
                        Edit Product
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">
                        Modify the details below to update the product information.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                            Product Title
                        </label>
                        <input
                            className="w-full border border-slate-800 bg-slate-950/50 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-slate-600 transition"
                            type="text"
                            placeholder="e.g. Premium Leather Wallet"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                            Description
                        </label>
                        <textarea
                            className="w-full border border-slate-800 bg-slate-950/50 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-slate-600 transition h-24 resize-none"
                            placeholder="Describe the product features and specifications..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                                Price ($)
                            </label>
                            <input
                                className="w-full border border-slate-800 bg-slate-950/50 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-slate-600 transition"
                                type="number"
                                step="0.01"
                                placeholder="29.99"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                                Category
                            </label>
                            <input
                                className="w-full border border-slate-800 bg-slate-950/50 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-slate-600 transition"
                                type="text"
                                placeholder="e.g. Accessories"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                            Image URL (Optional)
                        </label>
                        <input
                            className="w-full border border-slate-800 bg-slate-950/50 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-slate-600 transition"
                            type="text"
                            placeholder="https://example.com/image.jpg"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                        />
                    </div>

                    <button
                        className="w-full mt-6 bg-cyan-600 text-white py-3 rounded-xl hover:bg-cyan-500 font-semibold transition duration-200 shadow-lg shadow-cyan-950/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        type="submit"
                        disabled={submitting}
                    >
                        {submitting ? (
                            <>
                                Updating Product...
                            </>
                        ) : (
                            "Update Product"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProductModal;
