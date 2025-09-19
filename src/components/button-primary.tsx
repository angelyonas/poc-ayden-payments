import React from "react";

interface Props {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  selected?: boolean;
}

export const ButtonPrimary = ({ children, className, onClick, disabled, selected }: Props) => {
  return (
    <button
      type="button"
      className={` text-white p-2 rounded shadow cursor-pointer transition-colors ${className} ${
        selected
          ? "bg-red-900 border-red-600 hover:bg-red-700"
          : "bg-red-600 border-red-900 hover:bg-red-700"
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
