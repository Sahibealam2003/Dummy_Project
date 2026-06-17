import React from "react";
import ProductList from "./components/ProductList";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Cart from "./components/Cart";
import SingleCart from "./components/SingleCart";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen  selection:bg-cyan-500 selection:text-slate-900">
        <main className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/cart/:id" element={<SingleCart />} />
          </Routes>

        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
