"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useId, useCallback } from "react";
import { cn } from "@/lib/utils";

interface ModalContextType {
  titleId: string;
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a Modal parent");
  }
  return context;
}

export function Modal({ children, defaultOpen = false }: { children: React.ReactNode; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const titleId = useId();
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <ModalContext.Provider value={{ isOpen, open, close, titleId }}>
      {children}
    </ModalContext.Provider>
  );
}

export function ModalTrigger({ children, asChild, className }: { children: React.ReactNode; asChild?: boolean; className?: string }) {
  const { open } = useModal();

  // If asChild is true and children is a valid React element, delegate click handler and classes to the child element
  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{ onClick?: React.MouseEventHandler, className?: string }>;
    return React.cloneElement(child, {
      onClick: (e: React.MouseEvent) => {
        child.props.onClick?.(e);
        if (!e.defaultPrevented) open();
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

interface ModalDialogProps extends React.AriaAttributes {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

// Native modal dialogs make the background inert, contain keyboard focus,
// and restore focus to the opener when closed.
export function ModalDialog({
  isOpen,
  onClose,
  children,
  className = "max-w-lg max-h-[90vh] border-muted",
  bodyClassName = "p-6",
  ...ariaProps
}: ModalDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen || !dialog) return;

    const originalOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";

    return () => {
      dialog.close();
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      tabIndex={-1}
      aria-modal="true"
      {...ariaProps}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none border-0 bg-transparent p-4 text-foreground open:flex items-center justify-center backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div
        className={cn(
          "relative bg-surface rounded-lg shadow-xl border w-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200",
          className,
        )}
      >
        <div className={cn("overflow-y-auto scrollbar-minimal flex-1 min-h-0", bodyClassName)}>
          {children}
        </div>
      </div>
    </dialog>
  );
}

export function ModalContent({ children, className }: { children: React.ReactNode; className?: string }) {
  const { isOpen, close, titleId } = useModal();
  return (
    <ModalDialog isOpen={isOpen} onClose={close} aria-labelledby={titleId} className={className}>
      {isOpen && children}
    </ModalDialog>
  );
}

export function ModalHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex flex-col gap-1.5 mb-4", className)}>{children}</div>;
}

export function ModalTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  const { titleId } = useModal();
  return <h2 id={titleId} className={cn("text-lg font-semibold tracking-tight text-foreground", className)}>{children}</h2>;
}

export function ModalDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("text-sm text-text-muted mt-2", className)}>{children}</div>;
}

export function ModalClose({ children, asChild, className }: { children: React.ReactNode; asChild?: boolean; className?: string }) {
  const { close } = useModal();

  // If asChild is true and children is a valid React element, delegate close handler and styles
  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{ onClick?: React.MouseEventHandler, className?: string }>;
    return React.cloneElement(child, {
      onClick: (e: React.MouseEvent) => {
        child.props.onClick?.(e);
        if (!e.defaultPrevented) close();
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
