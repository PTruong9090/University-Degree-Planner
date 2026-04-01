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
        rounded-xl border border-[var(--border)]
        bg-[rgba(255,250,245,0.96)] px-3 py-1.5 text-xs text-[var(--text)]
        shadow-lg
        whitespace-nowrap
      "
    >
      {children}
    </div>,
    document.body
  );
}
