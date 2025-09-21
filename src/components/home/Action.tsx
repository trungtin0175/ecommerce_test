import React from "react";
import { Eye, ShoppingCart } from "lucide-react";
import BtnComponent from "../common/BtnComponent";

interface ActionProps {
  productId: number;
  onViewDetail: (id: number) => void;
  onAddToCart: (id: number) => void;
}

const Action: React.FC<ActionProps> = ({
  productId,
  onViewDetail,
  onAddToCart,
}) => {
  const handleViewDetail = () => {
    onViewDetail(productId);
  };

  const handleAddToCart = () => {
    onAddToCart(productId);
  };

  return (
    <div className="flex flex-col xs:flex-row gap-2 w-full mx-auto">
      <BtnComponent
        text="Details"
        onClick={handleViewDetail}
        backgroundColor="bg-gray-600"
        textColor="text-white"
        size="small"
        className="flex-1 whitespace-nowrap"
        icon={Eye}
        iconPosition="left"
      />
      <BtnComponent
        text="Add to Cart"
        onClick={handleAddToCart}
        backgroundColor="bg-emerald-600"
        textColor="text-white"
        size="small"
        className="flex-1 whitespace-nowrap"
        icon={ShoppingCart}
        iconPosition="left"
      />
    </div>
  );
};

export default Action;
