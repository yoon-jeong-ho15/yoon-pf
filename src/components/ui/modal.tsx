"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

// Interface defining the state and control methods exposed by ModalContext.
interface ModalContextType {
  isOpen: boolean;    // Indicates whether the modal overlay is currently visible
  open: () => void;   // Function to open the modal
  close: () => void;  // Function to close the modal
}

// React Context to manage and propagate modal state across compound components.
const ModalContext = createContext<ModalContextType | null>(null);

/**
 * Custom hook to consume the ModalContext.
 * Guarantees subcomponents (e.g. ModalTrigger, ModalContent) are used within a <Modal> parent.
 */
export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a Modal parent");
  }
  return context;
}

/**
 * Root Modal component providing context state to all nested subcomponents.
 * Maintains open/close state locally and shares control via ModalContext.
 */
export function Modal({ children, defaultOpen = false }: { children: React.ReactNode; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <ModalContext.Provider value={{ isOpen, open, close }}>
      {children}
    </ModalContext.Provider>
  );
}

/**
 * ModalTrigger component acts as the trigger element to open the modal.
 * Supports rendering custom trigger elements via the `asChild` prop using React.cloneElement.
 */
export function ModalTrigger({ children, asChild, className }: { children: React.ReactNode; asChild?: boolean; className?: string }) {
  const { open } = useModal();

  // If asChild is true and children is a valid React element, delegate click handler and classes to the child element
  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{ onClick?: React.MouseEventHandler, className?: string }>;
    return React.cloneElement(child, {
      onClick: (e: React.MouseEvent) => {
        open();
        if (child.props.onClick) {
          child.props.onClick(e);
        }
      },
      className: cn(child.props.className, className),
    });
  }

  // Default fallback: renders standard HTML button element
  return (
    <button type="button" onClick={open} className={className}>
      {children}
    </button>
  );
}

/**
 * ModalContent component renders the modal backdrop and dialog body using React Portal.
 * Handles client-side mounting SSR safety, scroll locking on document body, and ESC key listener.
 */
export function ModalContent({ children, className }: { children: React.ReactNode; className?: string }) {
  const { isOpen, close } = useModal();
  const [mounted, setMounted] = useState(false);

  // Client-side mount tracking to avoid SSR/hydration mismatch when using createPortal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Effect hook: Prevents body scrolling while modal is active and binds 'Escape' key handler to close modal
  useEffect(() => {
    if (!isOpen) return;

    // Save initial overflow style and lock document body scroll
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    // Close modal when pressing the Escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handleKeyDown);

    // Clean up event listener and restore original body scroll behavior on close/unmount
    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, close]);

  // Render nothing if modal is not open or element hasn't mounted on client
  if (!isOpen || !mounted) return null;

  // Teleport the modal DOM nodes directly into document.body to break out of parent stacking contexts
  return createPortal(
    <div className="fixed inset-0 z-999 flex items-center justify-center p-4">
      {/* Backdrop overlay: dark semi-transparent layer with blur effect; closes modal on click */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={close}
        aria-hidden="true"
      />
      {/* Modal Dialog Container: main card content container with entrance animation and ARIA attributes */}
      <div
        className={cn(
          "relative z-999 bg-surface rounded-lg shadow-xl border border-muted p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200",
          className
        )}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

/**
 * ModalHeader wraps top section of modal content, providing structure and layout spacing for title/description.
 */
export function ModalHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex flex-col gap-1.5 mb-4", className)}>{children}</div>;
}

/**
 * ModalTitle component renders accessible semantic heading element (h2) for the modal title.
 */
export function ModalTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h2 className={cn("text-lg font-semibold tracking-tight text-foreground", className)}>{children}</h2>;
}

/**
 * ModalDescription component renders auxiliary textual context or instructions inside the modal.
 */
export function ModalDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("text-sm text-text-muted mt-2", className)}>{children}</div>;
}

/**
 * ModalClose component acts as a trigger to dismiss/close the modal dialog.
 * Supports `asChild` prop delegation similar to ModalTrigger.
 */
export function ModalClose({ children, asChild, className }: { children: React.ReactNode; asChild?: boolean; className?: string }) {
  const { close } = useModal();

  // If asChild is true and children is a valid React element, delegate close handler and styles
  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{ onClick?: React.MouseEventHandler, className?: string }>;
    return React.cloneElement(child, {
      onClick: (e: React.MouseEvent) => {
        close();
        if (child.props.onClick) {
          child.props.onClick(e);
        }
      },
      className: cn(child.props.className, className),
    });
  }

  // Default fallback: standard HTML button element
  return (
    <button type="button" onClick={close} className={className}>
      {children}
    </button>
  );
}
