import { useEffect, useState } from "react";
import { getAllProducts, deleteProduct, addProduct, updateProduct, getAllCart, addCart } from "../services/api";
import ProductCard from "./ProductCard";
import ProductDetails from "./ProductDetails";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import CartModal from "./CartModal";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);
    const [cartLength, setCartLength] = useState(0)
    console.log(cartLength.length)
    const navigator = useNavigate()
    useEffect(() => {
        fetchCart()
    }, [])

    const fetchCart = async () => {
        const data = await getAllCart();
        const localCarts = JSON.parse(localStorage.getItem('localCarts') || '[]');
        setCartLength([...data, ...localCarts]);
    }

    const loadProducts = async () => {
        try {
            const data = await getAllProducts();
            setProducts(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleDeleteProduct = async (id) => {
        try {
            await deleteProduct(id);
            setProducts((prev) =>
                prev.filter(
                    (product) => product.id !== id
                )
            );
        } catch (error) {
            console.error("Failed to delete product:", error);
        }
    };

    const handleAddProduct = async (productDataFromModal) => {
        const productData = {
            id: uuidv4(),
            title: productDataFromModal.title,
            price: Number(productDataFromModal.price),
            description: productDataFromModal.description,
            category: productDataFromModal.category,
            image:
                productDataFromModal.image ||
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30"
        };

        try {
            await addProduct(productData);

            setProducts((prev) => [
                productData,
                ...prev
            ]);

            setSelectedProduct(productData);
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    };
    const handleUpdateProduct = async (id, updatedData) => {
        try {
            if (!isNaN(Number(id))) {
                await updateProduct(id, updatedData);
            }

            setProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product.id === id ? { ...product, ...updatedData } : product
                )
            );

            setSelectedProduct((prev) => {
                if (prev && prev.id === id) {
                    return { ...prev, ...updatedData };
                }
                return prev;
            });
        } catch (error) {
            console.error("Failed to update product:", error);
            throw error;
        }
    };

    const handleAddToCart = async (productId, quantity) => {
        try {
            const cartPayload = {
                userId: 1,
                date: new Date().toISOString(),
                products: [{ productId: Number(productId), quantity: Number(quantity) }]
            };
            const response = await addCart(cartPayload);
            
            // Save to localStorage since FakeStore API doesn't persist data
            const newCart = {
                id: response.id,
                userId: cartPayload.userId,
                date: cartPayload.date,
                products: cartPayload.products
            };
            const existingCarts = JSON.parse(localStorage.getItem('localCarts') || '[]');
            existingCarts.push(newCart);
            localStorage.setItem('localCarts', JSON.stringify(existingCarts));
            
            setCartLength(prev => [...prev, newCart]);
        } catch (error) {
            console.error("Failed to add to cart:", error);
            throw error;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-800">
                        Product Management
                    </h1>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 shadow-md transition-all duration-200 active:scale-95"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Product
                    </button>
                    <button
                        onClick={() => setIsCartModalOpen(true)}
                        className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:from-indigo-700 hover:to-purple-700 shadow-md transition-all duration-200 active:scale-95"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Create Cart
                    </button>
                    <div onClick={() => navigator('/cart')} className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 shadow-md transition-all duration-200 active:scale-95">🛒{cartLength.length}</div>
                </div>

                {
                    loading ?
                        <div className="text-center text-xl font-semibold text-gray-600">
                            Loading Products...
                        </div>
                        : <div className="grid md:grid-cols-3 gap-6">
                            {
                                products.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onClick={(id) => {
                                            const productData = products.find(
                                                item => item.id === id
                                            );
                                            setSelectedProduct(productData);
                                        }}
                                        onDelete={handleDeleteProduct}
                                        onEdit={(product) => setEditingProduct(product)}
                                        onAddToCart={handleAddToCart}
                                    />
                                ))
                            }
                        </div>
                }

                {
                    selectedProduct &&
                    <ProductDetails
                        product={selectedProduct}
                        onClose={() => setSelectedProduct(null)}
                        onEdit={(product) => {
                            setSelectedProduct(null);
                            setEditingProduct(product);
                        }}
                    />
                }

                <AddProductModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onAdd={handleAddProduct}
                />

                <EditProductModal
                    isOpen={!!editingProduct}
                    onClose={() => setEditingProduct(null)}
                    onUpdate={handleUpdateProduct}
                    product={editingProduct}
                />
                <CartModal
                    isOpen={isCartModalOpen}
                    onClose={() => setIsCartModalOpen(false)}
                    onCartAdded={(newCart) => {
                        if (newCart) {
                            setCartLength(prev => [...prev, newCart]);
                        }
                    }}
                    products={products}
                />
            </div>
        </div>
    );
};

export default ProductList;