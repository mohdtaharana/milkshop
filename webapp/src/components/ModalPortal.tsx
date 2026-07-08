import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface ModalPortalProps {
  children: React.ReactNode;
  onClose?: () => void;
}

export const ModalPortal: React.FC<ModalPortalProps> = ({ children, onClose }) => {
  const portalRef = useRef<HTMLDivElement | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  if (!portalRef.current) {
    portalRef.current = document.createElement("div");
    portalRef.current.setAttribute("data-modal-portal", "true");
  }

  useEffect(() => {
    const el = portalRef.current!;
    document.body.appendChild(el);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current?.();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      if (document.body.contains(el)) document.body.removeChild(el);
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return createPortal(children, portalRef.current);
};
