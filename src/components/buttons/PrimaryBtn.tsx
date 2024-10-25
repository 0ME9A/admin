import React from "react";

interface PrimaryBtnProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const PrimaryBtn: React.FC<PrimaryBtnProps> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <button
      className={`bg-accent-500 text-white py-2 md:py-3 px-5 md:px-7 rounded-full shadow-md hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-accent-300 focus:ring-opacity-50 capitalize whitespace-nowrap ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default PrimaryBtn;
