
import React from "react";

export function Button({ children, onClick, variant }) {
  const className =
    variant === "destructive"
      ? "bg-red-500 text-white px-4 py-2 rounded"
      : "bg-blue-500 text-white px-4 py-2 rounded";
  return <button className={className} onClick={onClick}>{children}</button>;
}

export default Button;
