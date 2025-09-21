import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useEffect } from "react";
import { useUserId } from "../../hooks/actions/useUser";
import { useCartByUser } from "../../hooks/actions/useCart";
import { useDispatch, useSelector } from "react-redux";
import { setCartCount } from "../../features/cart/cartSlice";
import type { RootState } from "../../redux/store";
import type { ICartProduct } from "../../interfaces/ICart";

export default function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const isLoggedIn = !!token;
  const dispatch = useDispatch();
  const userId = useUserId();

  const cartCount = useSelector((state: RootState) => state.cart.count);

  const { data: cartData } = useCartByUser(userId || 0);

  useEffect(() => {
    const sessionCart = sessionStorage.getItem("cart_items");
    if (sessionCart) {
      const parsed = JSON.parse(sessionCart);
      const count = parsed.reduce(
        (sum: number, i: ICartProduct) => sum + i.quantity,
        0
      );
      dispatch(setCartCount(count));
      return;
    }

    if (cartData?.products) {
      const count = cartData.products.reduce((sum, i) => sum + i.quantity, 0);
      dispatch(setCartCount(count));
    }
  }, [cartData, dispatch]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("id");
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between">
        <Link
          to="/"
          className="text-2xl font-extrabold !text-black tracking-wide"
        >
          MyShop
        </Link>

        <div className="flex items-center gap-5">
          <Link
            to="/cart"
            className="relative text-gray-600 hover:text-blue-600 transition"
          >
            <ShoppingCart size={26} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                {cartCount}
              </span>
            )}
          </Link>

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="px-5 py-2 bg-gray-100 text-gray-700 rounded-full shadow-sm hover:bg-gray-200 transition font-medium"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="px-5 py-2 bg-blue-600 !text-white rounded-full shadow-sm hover:bg-blue-700 transition font-medium"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
