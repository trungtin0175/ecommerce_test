import CartItem from "./CartItem";
import type { ICartProduct } from "../../interfaces/ICart";

interface Props {
  items: ICartProduct[];
  selectedIds: number[];
  onToggleSelect: (id: number) => void;
  onRemove: (id: number) => void;
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
}

export default function CartList({
  items,
  selectedIds,
  onToggleSelect,
  onRemove,
  onIncrease,
  onDecrease,
}: Props) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16 bg-white rounded-xl shadow-sm">
        <p className="text-gray-500 text-base sm:text-lg">
          🛒 Your cart is empty.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {items.map((item) => (
        <CartItem
          key={item.id}
          product={item}
          selected={selectedIds.includes(item.id)}
          onToggleSelect={onToggleSelect}
          onRemove={onRemove}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
        />
      ))}
    </div>
  );
}
