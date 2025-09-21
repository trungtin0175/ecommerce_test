import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login/Login";
import MainLayout from "./components/layouts/mainLayout";
import Home from "./pages/Home/Home";
import CartPage from "./pages/Cart";
import { Toaster } from "react-hot-toast";
import CheckoutPage from "./pages/Checkout/Checkout";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Route>

        <Route path="*" element={<div>404 Page</div>} />
      </Routes>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default App;
