import React from "react";
import { Star, ShoppingBag } from "lucide-react";
import Action from "./Action";
import type { IProduct } from "../../interfaces/IProduct";

interface ProductItemProps {
  product: IProduct;
  onViewDetail: (id: number) => void;
  onAddToCart: (id: number) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({
  product,
  onViewDetail,
  onAddToCart,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const discountedPrice =
    product.price * (1 - product.discountPercentage / 100);

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
      <div className="relative overflow-hidden">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.discountPercentage > 0 && (
            <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
              -{Math.round(product.discountPercentage)}%
            </span>
          )}
        </div>

        {product.availabilityStatus !== "In Stock" && (
          <div className="absolute top-3 right-3 bg-gray-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
            Out of Stock
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
            {product.category}
          </span>
          {product.brand && (
            <span className="text-xs text-gray-500 font-medium">
              {product.brand}
            </span>
          )}
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
          {product.title}
        </h3>

        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                size={14}
                className={
                  index < Math.floor(product.rating)
                    ? "text-amber-400 fill-amber-400"
                    : "text-gray-200"
                }
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-1">
            {product.rating.toFixed(1)}
          </span>
          <span className="text-xs text-gray-400">
            ({product.reviews?.length || 0})
          </span>
        </div>

        <div className="mb-4 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(discountedPrice)}
            </span>
            {product.discountPercentage > 0 && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 mt-1">
            <ShoppingBag size={12} className="text-gray-400" />
            <span className="text-xs text-gray-500">
              {product.stock} items left
            </span>
          </div>
        </div>

        <div className="mt-auto">
          <Action
            productId={product.id}
            onViewDetail={onViewDetail}
            onAddToCart={onAddToCart}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
