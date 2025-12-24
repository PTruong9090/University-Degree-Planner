import { createPortal } from "react-dom";

export function Tooltip({ children, rect, visible }) {
  if (!visible || !rect) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: rect.top - 8,
        left: rect.left + rect.width / 2,
        transform: "translate(-50%, -100%)",
        zIndex: 9999,
        pointerEvents: "none",
      }}
      className="
        bg-gray-900 text-white text-xs
        px-2 py-1 rounded shadow-lg
        whitespace-nowrap
      "
    >
      {children}
    </div>,
    document.body
  );
}
