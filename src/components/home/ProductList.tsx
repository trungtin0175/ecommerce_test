import React, { useEffect, useState } from "react";
import ProductItem from "./ProductItemCard";
import { useProducts, useSearchProducts } from "../../hooks/actions/useProduct";
import SearchComponent from "../common/SearchComponent";
import { useAddToCart } from "../../hooks/actions/useCart";
import { useUserId } from "../../hooks/actions/useUser";
import type { ICartProduct } from "../../interfaces/ICart";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setCartCount } from "../../features/cart/cartSlice";

const ProductList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useProducts(20);

  const {
    data: searchData,
    isLoading: isSearchLoading,
    error: searchError,
  } = useSearchProducts(searchQuery);

  const dispatch = useDispatch();

  const addToCartMutation = useAddToCart();
  const allProducts = data?.pages.flatMap((page) => page.products) || [];
  const searchProducts = searchData?.products || [];
  const userId = useUserId();

  useEffect(() => {
    if (searchQuery) return;

    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 1000 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, searchQuery]);

  const handleViewDetail = (id: number) => {
    console.log("View detail for product:", id);
  };

  const handleAddToCart = (id: number) => {
    const newProduct = { id, quantity: 1 };

    addToCartMutation.mutate(
      {
        userId: userId || 0,
        products: [newProduct],
      },
      {
        onSuccess: (response) => {
          const addedProduct = response.products[0];

          const cartData = sessionStorage.getItem("cart_items");
          const cartList = cartData ? JSON.parse(cartData) : [];

          const existingIndex = cartList.findIndex(
            (item: ICartProduct) => item.id === addedProduct.id
          );

          if (existingIndex > -1) {
            cartList[existingIndex].quantity += 1;
            cartList[existingIndex].total =
              cartList[existingIndex].price * cartList[existingIndex].quantity;
          } else {
            cartList.push(addedProduct);
          }

          sessionStorage.setItem("cart_items", JSON.stringify(cartList));
          const newCount = cartList.reduce(
            (sum: number, item: ICartProduct) => sum + item.quantity,
            0
          );
          dispatch(setCartCount(newCount));
          toast.success("Product added to cart successfully!");
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message || "Failed to add product to cart!"
          );
        },
      }
    );
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (error && !searchQuery) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center py-8">
          <p className="text-red-600">
            Error loading products: {error.message}
          </p>
        </div>
      </div>
    );
  }

  if (searchError && searchQuery) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center py-8">
          <p className="text-red-600">
            Error searching products: {searchError.message}
          </p>
        </div>
      </div>
    );
  }

  const productsToRender = searchQuery ? searchProducts : allProducts;
  const loading = searchQuery
    ? isSearchLoading
    : isLoading || isFetchingNextPage;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Product List
        </h2>
        <p className="text-gray-600 text-lg">
          Discover our amazing collection of products
        </p>
      </div>

      <div className="my-[20px]">
        <SearchComponent onSearch={handleSearch} />
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
        {productsToRender.map((product) => (
          <ProductItem
            key={product.id}
            product={product}
            onViewDetail={handleViewDetail}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">
            {isSearchLoading
              ? "Searching products..."
              : isLoading
              ? "Loading products..."
              : "Loading more products..."}
          </span>
        </div>
      )}

      {!searchQuery && !hasNextPage && allProducts.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">All products displayed</p>
        </div>
      )}

      {productsToRender.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">No products found</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
