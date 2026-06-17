import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCartById } from "../services/api";

const SingleCart = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cartItem, setCartItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSingleCart = async () => {
            try {
                setLoading(true);
                const data = await getCartById(id);
                setCartItem(data);
            } catch (error) {
                console.error("Error fetching single cart:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchSingleCart();
    }, [id]);

    if (loading) return <div className="text-center p-10 font-medium">Loading cart details...</div>;
    if (!cartItem) return <div className="text-center p-10 text-red-500">Cart not found!</div>;

    return (
        <div className="max-w-2xl mx-auto my-10 p-6 bg-white border border-gray-200 rounded-xl shadow-xl">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 text-sm font-medium text-blue-600 hover:underline flex items-center gap-1"
            >
                ← Back to All Carts
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">Cart Details</h2>
            <p className="text-sm font-semibold text-gray-500 mb-4">
                Date: {cartItem.date?.split("T")[0]}
            </p>

            <div className="border-t pt-4 space-y-3">
                <h3 className="font-semibold text-gray-700">Products in this cart:</h3>
                {cartItem.products?.map((product, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border">
                        <div>
                            <p className="text-gray-800 font-medium">Product ID: {product.productId}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-600">Qty: <span className="font-bold">{product.quantity}</span></p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SingleCart;
