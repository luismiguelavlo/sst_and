"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";

export type ToastVariant = "success" | "error" | "info";

type ToastOptions = {
  variant?: ToastVariant;
  duration?: number;
};

type ToastState = {
  message: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  showToast: (message: string, options?: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const VARIANT_STYLES: Record<
  ToastVariant,
  { container: string; icon: string; iconName: string }
> = {
  success: {
    container: "bg-inverse-surface text-inverse-on-surface",
    icon: "text-inverse-primary",
    iconName: "check_circle",
  },
  error: {
    container: "bg-error-container text-on-error-container ring-1 ring-error/25",
    icon: "text-error",
    iconName: "error",
  },
  info: {
    container: "bg-primary-container text-on-primary-container",
    icon: "text-primary",
    iconName: "info",
  },
};

const DEFAULT_DURATION: Record<ToastVariant, number> = {
  success: 4000,
  error: 5500,
  info: 4000,
};

export function ToastProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const toastRef = useRef<HTMLDivElement>(null);
  const labelId = useId();

  const dismiss = useCallback(() => {
    setVisible(false);
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    window.setTimeout(() => setToast(null), 280);
  }, []);

  const showToast = useCallback(
    (message: string, options?: ToastOptions) => {
      const variant = options?.variant ?? "success";
      const duration = options?.duration ?? DEFAULT_DURATION[variant];

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      setToast({ message, variant });
      setVisible(false);
      window.requestAnimationFrame(() => {
        setVisible(true);
      });

      timeoutRef.current = window.setTimeout(dismiss, duration);
    },
    [dismiss],
  );

  useEffect(() => {
    if (visible && toastRef.current) {
      toastRef.current.focus({ preventScroll: true });
    }
  }, [visible, toast]);

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    },
    [],
  );

  const styles = toast ? VARIANT_STYLES[toast.variant] : VARIANT_STYLES.success;

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        aria-live={toast?.variant === "error" ? "assertive" : "polite"}
        aria-atomic="true"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[200] flex justify-center px-sm pb-[max(1rem,env(safe-area-inset-bottom))] sm:inset-x-auto sm:right-md sm:bottom-md sm:justify-end sm:px-0"
      >
        {toast ? (
          <div
            ref={toastRef}
            role={toast.variant === "error" ? "alert" : "status"}
            aria-labelledby={labelId}
            tabIndex={-1}
            className={[
              "pointer-events-auto flex w-full max-w-md items-start gap-sm rounded-xl px-md py-sm shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] sm:max-w-sm",
              styles.container,
              visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-8 scale-95 opacity-0",
            ].join(" ")}
          >
            <MaterialIcon
              name={styles.iconName}
              className={["mt-0.5 shrink-0 text-[22px]", styles.icon].join(" ")}
            />
            <p id={labelId} className="min-w-0 flex-1 font-body-md text-body-md leading-snug">
              {toast.message}
            </p>
            <button
              type="button"
              className="shrink-0 rounded-md p-xs opacity-70 transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              aria-label="Cerrar aviso"
              onClick={dismiss}
            >
              <MaterialIcon name="close" className="text-[20px]" />
            </button>
          </div>
        ) : null}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast debe usarse dentro de ToastProvider.");
  }
  return context;
}
