import CartQuantityControl from "./CartQuantity";
import { Trash2 } from "lucide-react";
import type { ICartProduct } from "../../interfaces/ICart";

interface Props {
  product: ICartProduct;
  onRemove: (id: number) => void;
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
  selected: boolean;
  onToggleSelect: (id: number) => void;
}
export default function CartItem({
  product,
  onRemove,
  onIncrease,
  onDecrease,
  selected,
  onToggleSelect,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-4 flex-1">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggleSelect(product.id)}
          className="w-5 h-5 accent-blue-600 cursor-pointer flex-shrink-0"
        />

        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border-2 border-gray-200 flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-800 text-sm sm:text-base truncate">
            {product.title}
          </h4>
          <p className="text-gray-500 text-xs sm:text-sm">
            ${product.price.toFixed(2)}
          </p>

          <p className="text-gray-800 font-semibold text-sm sm:hidden mt-1">
            Total: ${(product.price * product.quantity).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
        <CartQuantityControl
          quantity={product.quantity}
          onDecrease={() => onDecrease(product.id)}
          onIncrease={() => onIncrease(product.id)}
        />

        <span className="hidden sm:block font-semibold w-20 text-right text-gray-800">
          ${(product.price * product.quantity).toFixed(2)}
        </span>

        <button
          onClick={() => onRemove(product.id)}
          className="text-red-500 hover:text-red-700 flex-shrink-0 cursor-pointer"
        >
          <Trash2 size={18} className="sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
}
