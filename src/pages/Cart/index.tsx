import { useEffect, useRef, useState } from "react";
import CartList from "../../components/cart/CartList";
import { useCartByUser, useUpdateCart } from "../../hooks/actions/useCart";
import type { ICartProduct } from "../../interfaces/ICart";
import BtnComponent from "../../components/common/BtnComponent";
import { useNavigate } from "react-router-dom";
import {
  useUserId,
  useIsAuthenticated,
  useUser,
} from "../../hooks/actions/useUser";
import { useDispatch } from "react-redux";
import { setCartCount } from "../../features/cart/cartSlice";
import toast from "react-hot-toast";

const CART_KEY = "cart_items";

export default function CartPage() {
  const userId = useUserId();
  const isAuthenticated = useIsAuthenticated();
  const { isInitialized } = useUser();

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const didInitRef = useRef(false);

  const { data, isLoading, error } = useCartByUser(userId || 0);
  const updateCartMutation = useUpdateCart();
  const dispatch = useDispatch();

  const [items, setItems] = useState<ICartProduct[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isAnySelected, setIsAnySelected] = useState(false);
  const navigate = useNavigate();

  const saveToSession = (products: ICartProduct[]) => {
    sessionStorage.setItem(CART_KEY, JSON.stringify(products));
  };

  const loadFromSession = (): ICartProduct[] => {
    const raw = sessionStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  };

  const updateCartAPI = (updatedItems: ICartProduct[]) => {
    if (!data?.id) return;

    const products = updatedItems.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    }));

    updateCartMutation.mutate(
      {
        cartId: data.id,
        products,
      },
      {
        onError: () => {
          if (data?.products) {
            setItems(data.products);
            saveToSession(data.products);
          }
        },
      }
    );
  };

  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;
    const stored = loadFromSession();
    if (stored.length > 0) {
      setItems(stored);
      dispatch(setCartCount(stored.reduce((sum, i) => sum + i.quantity, 0)));
    } else if (data?.products?.length) {
      setItems(data.products);
      saveToSession(data.products);
      dispatch(
        setCartCount(data.products.reduce((sum, i) => sum + i.quantity, 0))
      );
    }
  }, [data, dispatch]);

  const handleToggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleRemove = (id: number) => {
    const updatedItems = items.filter((i) => i.id !== id);
    setItems(updatedItems);
    saveToSession(updatedItems);
    updateCartAPI(updatedItems);
    setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
    const newCount = updatedItems.reduce((sum, i) => sum + i.quantity, 0);
    dispatch(setCartCount(newCount));

    toast.success("Item removed from cart!");
  };

  useEffect(() => {
    if (!items.length) return;
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      updateCartAPI(items);
    }, 500);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [items]);

  const handleIncrease = (id: number) => {
    const updatedItems = items.map((i) =>
      i.id === id ? { ...i, quantity: i.quantity + 1 } : i
    );
    setItems(updatedItems);
    saveToSession(updatedItems);

    const newCount = updatedItems.reduce((sum, i) => sum + i.quantity, 0);
    dispatch(setCartCount(newCount));
  };

  const handleDecrease = (id: number) => {
    const updatedItems = items.map((i) =>
      i.id === id && i.quantity > 1 ? { ...i, quantity: i.quantity - 1 } : i
    );
    setItems(updatedItems);
    saveToSession(updatedItems);

    const newCount = updatedItems.reduce((sum, i) => sum + i.quantity, 0);
    dispatch(setCartCount(newCount));
  };

  const handleRemoveSelected = () => {
    const updatedItems = items.filter((i) => !selectedIds.includes(i.id));
    setItems(updatedItems);
    saveToSession(updatedItems);
    updateCartAPI(updatedItems);
    setSelectedIds([]);
    const newCount = updatedItems.reduce((sum, i) => sum + i.quantity, 0);
    dispatch(setCartCount(newCount));

    toast.success("Selected items removed from cart!");
  };

  // const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const subtotal = items
    .filter((i) => selectedIds.includes(i.id))
    .reduce((sum, i) => sum + i.price * i.quantity, 0);

  const selectedCount = selectedIds.length;
  const total = subtotal;

  useEffect(() => {
    setIsAnySelected(selectedIds.length > 0);
  }, [selectedIds]);

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      navigate("/login");
    }
  }, [isInitialized, isAuthenticated, navigate]);

  useEffect(() => {
    if (updateCartMutation.isSuccess) {
      console.log("Cart updated successfully!");
    }
  }, [updateCartMutation.isSuccess]);

  if (!isInitialized || isLoading || updateCartMutation.isPending) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <span className="text-sm sm:text-base text-gray-600">
            {!isInitialized
              ? "Initializing user..."
              : isLoading
              ? "Loading cart..."
              : "Updating cart..."}
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !userId) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <span className="text-sm sm:text-base text-gray-600">
            Redirecting to login...
          </span>
        </div>
      </div>
    );
  }

  if (error || updateCartMutation.error) {
    return (
      <div className="text-center py-12 sm:py-16 px-4">
        <p className="text-red-600 text-sm sm:text-base max-w-md mx-auto">
          {error
            ? `Failed to load cart: ${error.message}`
            : `Failed to update cart: ${
                updateCartMutation.error?.message || "Unknown error"
              }`}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Shopping Cart
            </h2>
            {isAnySelected && (
              <div className="w-full sm:w-auto">
                <BtnComponent
                  text="Remove Selected"
                  size="medium"
                  onClick={handleRemoveSelected}
                  className="bg-red-500 hover:bg-red-600 text-white sm:w-auto cursor-pointer"
                />
              </div>
            )}
          </div>
          <CartList
            items={items}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onRemove={handleRemove}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
          />
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md h-fit w-full max-w-md mx-auto lg:mx-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
            Order Summary
          </h3>
          <div className="space-y-3 text-sm sm:text-base text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Selected Items</span>
              <span className="font-medium">{selectedCount}</span>
            </div>
            <div className="border-t pt-3 flex justify-between font-semibold text-gray-900 text-base sm:text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <div className="mt-6">
            <BtnComponent
              text="Proceed to Checkout"
              size="large"
              disabled={!isAnySelected}
              onClick={() =>
                navigate("/checkout", {
                  state: {
                    items: items.filter((i) => selectedIds.includes(i.id)),
                    total,
                    cartId: data?.id,
                  },
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
