import { useEffect, useState } from "react";
import { deleteCart, getAllCart } from "../services/api";
import { useNavigate } from "react-router-dom";

const Cart = () => {
    const [cart, setCart] = useState([]);
    const navigator = useNavigate()
    console.log(cart)
    const fetchCart = async () => {
        const data = await getAllCart();
        const localCarts = JSON.parse(localStorage.getItem('localCarts') || '[]');
        // Merge API carts with locally stored carts (avoid duplicates by id)
        const apiIds = new Set(data.map(c => c.id));
        const uniqueLocalCarts = localCarts.filter(c => !apiIds.has(c.id));
        setCart([...data, ...uniqueLocalCarts]);
    }

    useEffect(() => {
        fetchCart()
    }, []);
    const handleDeleteCart = async (id) => {
        try {
            await deleteCart(id);
            // Also remove from localStorage if it exists there
            const localCarts = JSON.parse(localStorage.getItem('localCarts') || '[]');
            const updatedLocalCarts = localCarts.filter(c => c.id !== id);
            localStorage.setItem('localCarts', JSON.stringify(updatedLocalCarts));
            setCart((prevCart) => prevCart.filter((item) => item.id !== id));
        } catch (error) {
            console.error("Failed to delete cart:", error);
        }
    };

    return (
        <div className="bg-white grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {cart.length > 0 && (
                cart.map((item) => (
                    <div key={item.id} className="bg-white border border-gray-200 rounded-xl shadow-lg p-6">
                        <div className="flex justify-between">
                            <p className="font-semibold text-gray-600">{item.date?.split("T")[0]}</p>
                            <p
                                onClick={() => handleDeleteCart(item.id)}
                                className="text-lg cursor-pointer">❌</p>
                        </div>
                        <div className="mt-4 space-y-2">
                            {item.products?.map((product, index) => (
                                <div
                                    onClick={() => navigator(`/cart/${item.id}`)}
                                    key={index} className="flex justify-between bg-gray-50 p-2 rounded-lg border">
                                    <p className="text-gray-800">
                                        <span className="font-medium">Product ID:</span> {product.productId}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">Quantity:</span> {product.quantity}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                ))
            )}
        </div>
    );
};

export default Cart;
