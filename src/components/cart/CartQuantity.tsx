import { Minus, Plus } from "lucide-react";

interface Props {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
}

export default function CartQuantityControl({
  quantity,
  onDecrease,
  onIncrease,
}: Props) {
  return (
    <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
      <button
        onClick={onDecrease}
        className="px-2 sm:px-3 py-2 hover:bg-gray-100 disabled:opacity-50 transition-colors"
        disabled={quantity <= 1}
      >
        <Minus size={14} className="sm:w-4 sm:h-4" />
      </button>
      <span className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium min-w-[28px] sm:min-w-[32px] text-center">
        {quantity}
      </span>
      <button
        onClick={onIncrease}
        className="px-2 sm:px-3 py-2 hover:bg-gray-100 transition-colors"
      >
        <Plus size={14} className="sm:w-4 sm:h-4" />
      </button>
    </div>
  );
}
