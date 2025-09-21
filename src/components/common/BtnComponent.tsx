import React from "react";
import type { LucideIcon } from "lucide-react";

interface BtnComponentProps {
  text: string;
  onClick: () => void;
  backgroundColor?: string;
  textColor?: string;
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  className?: string;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
}

const BtnComponent: React.FC<BtnComponentProps> = ({
  text,
  onClick,
  backgroundColor = "bg-blue-600",
  textColor = "text-white",
  size = "medium",
  disabled = false,
  className = "",
  icon: Icon,
  iconPosition = "left",
}) => {
  const sizeClasses = {
    small: "px-3 py-2 text-xs sm:px-4 sm:text-sm",
    medium: "px-4 py-2.5 text-sm sm:px-5",
    large: "px-5 py-3 text-base sm:px-6",
  };

  const iconSizes = {
    small: 14,
    medium: 16,
    large: 18,
  };

  const getHoverClass = (bgClass: string) => {
    if (bgClass.includes("blue")) return "hover:bg-blue-700";
    if (bgClass.includes("green")) return "hover:bg-green-700";
    if (bgClass.includes("red")) return "hover:bg-red-700";
    if (bgClass.includes("gray")) return "hover:bg-gray-700";
    return "hover:opacity-90";
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${backgroundColor} 
        ${textColor} 
        ${sizeClasses[size]}
        ${getHoverClass(backgroundColor)}
        rounded-lg
        font-semibold
        transition-all
        duration-200
        transform
        hover:scale-105
        active:scale-95
        disabled:opacity-50
        disabled:cursor-not-allowed
        disabled:hover:scale-100
        flex
        items-center
        justify-center
        gap-2
        shadow-sm
        hover:shadow-md
        focus:outline-none
        focus:ring-2
        focus:ring-offset-2
        focus:ring-blue-500
        w-full
        ${className}
      `}
    >
      {Icon && iconPosition === "left" && <Icon size={iconSizes[size]} />}
      <span className="font-medium">{text}</span>
      {Icon && iconPosition === "right" && <Icon size={iconSizes[size]} />}
    </button>
  );
};

export default BtnComponent;
