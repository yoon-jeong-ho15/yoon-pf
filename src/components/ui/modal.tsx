"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface ModalContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a Modal");
  }
  return context;
}

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

export function ModalTrigger({ children, asChild, className }: { children: React.ReactNode; asChild?: boolean; className?: string }) {
  const { open } = useModal();

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

  return (
    <button type="button" onClick={open} className={className}>
      {children}
    </button>
  );
}

export function ModalContent({ children, className }: { children: React.ReactNode; className?: string }) {
  const { isOpen, close } = useModal();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    
    // Prevent scrolling on body when modal is open
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, close]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={close} 
        aria-hidden="true"
      />
      <div 
        className={cn(
          "relative z-50 bg-surface rounded-lg shadow-xl border border-muted p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200", 
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

export function ModalHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex flex-col gap-1.5 mb-4", className)}>{children}</div>;
}

export function ModalTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h2 className={cn("text-lg font-semibold tracking-tight text-foreground", className)}>{children}</h2>;
}

export function ModalDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("text-sm text-text-muted mt-2", className)}>{children}</div>;
}

export function ModalClose({ children, asChild, className }: { children: React.ReactNode; asChild?: boolean; className?: string }) {
  const { close } = useModal();

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

  return (
    <button type="button" onClick={close} className={className}>
      {children}
    </button>
  );
}
