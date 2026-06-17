import axios from "axios";

const API = axios.create({
    baseURL: "https://fakestoreapi.com",
});

export const getAllProducts = async () => {
    const response = await API.get("/products");
    return response.data;
};

export const getSingleProduct = async (id) => {
    const response = await API.get(`/products/${id}`);
    return response.data;
};

export const deleteProduct = async (id) => {
    const response = await API.delete(`/products/${id}`);
    return response.data;
};

export const addProduct = async (product) => {
    const response = await API.post("/products", product);
    return response.data;
};
export const updateProduct = async (id, updatedProduct) => {
    const response = await API.put(`/products/${id}`, updatedProduct);
    return response.data;
};

export const getAllCart = async () => {
    const response = await API.get("/carts")
    return response.data;
}

export const getCartById = async (id) => {
    const response = await API.get(`/carts/${id}`);
    return response.data;
};

export const deleteCart = async (id) => {
    const response = await API.delete(`/carts/${id}`);
    return response.data;
};

export const addCart = async (cart) => {
    const response = await API.post("/carts", cart);
    return response.data;
};

export const updateCart = async (id, cart) => {
    const response = await API.put(`/carts/${id}`, cart);
    return response.data;
};