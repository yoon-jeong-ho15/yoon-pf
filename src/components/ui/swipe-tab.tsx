"use client";

import React, { createContext, useContext, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { useSwipeScroll } from "@/hooks/useSwipeScroll";
import { cn } from "@/lib/utils";

interface SwipeTabContextType {
  scrollToElement: (element: HTMLElement) => void;
}

const SwipeTabContext = createContext<SwipeTabContextType | null>(null);

export interface SwipeTabProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const SwipeTabRoot = forwardRef<HTMLDivElement, SwipeTabProps>(
  ({ children, className, ...props }, ref) => {
    const scrollRef = useSwipeScroll<HTMLDivElement>();

    useImperativeHandle(ref, () => scrollRef.current!);

    const scrollToElement = (element: HTMLElement) => {
      const container = scrollRef.current;
      if (!container) return;

      requestAnimationFrame(() => {
        const containerRect = container.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();

        // element의 왼쪽 절대 거리 + 현재 scrollLeft - 컨테이너 왼쪽 절대 거리 = 컨테이너 기준 relative left
        const relativeLeft = elementRect.left - containerRect.left + container.scrollLeft;

        const containerWidth = container.clientWidth;
        const elementWidth = element.clientWidth;

        // 중앙에 오도록 대상 scrollLeft 계산
        const targetScrollLeft = relativeLeft - (containerWidth / 2) + (elementWidth / 2);

        container.scrollTo({
          left: targetScrollLeft,
          behavior: "smooth",
        });
      });
    };

    return (
      <SwipeTabContext.Provider value={{ scrollToElement }}>
        <div
          ref={scrollRef}
          className={cn(
            "flex overflow-x-hidden select-none cursor-grab active:cursor-grabbing",
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </SwipeTabContext.Provider>
    );
  }
);

SwipeTabRoot.displayName = "SwipeTab";

// 다형성 컴포넌트(Polymorphic Component) 타입 정의
type AsProp<T extends React.ElementType> = {
  as?: T;
};

type PolymorphicRef<T extends React.ElementType> = React.ComponentPropsWithRef<T>["ref"];

type PolymorphicProps<T extends React.ElementType, Props = {}> = Props &
  AsProp<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof Props | "as">;

interface SwipeTabItemProps extends React.HTMLAttributes<HTMLElement> {
  active?: boolean;
  children?: React.ReactNode;
}

const SwipeTabItemInner = forwardRef<HTMLElement, SwipeTabItemProps & AsProp<React.ElementType>>(
  ({ as, active, children, className, ...props }, ref) => {
    const context = useContext(SwipeTabContext);
    const localRef = useRef<HTMLElement>(null);

    // refs를 병합하여 노출
    useImperativeHandle(ref, () => localRef.current!);

    useEffect(() => {
      if (active && context && localRef.current) {
        context.scrollToElement(localRef.current);
      }
    }, [active, context]);

    const Component = as || "button";

    return (
      <Component
        ref={localRef as any}
        className={cn("shrink-0", className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

SwipeTabItemInner.displayName = "SwipeTab.Item";

type SwipeTabItemComponent = <T extends React.ElementType = "button">(
  props: PolymorphicProps<T, SwipeTabItemProps> & { ref?: PolymorphicRef<T> }
) => React.ReactNode;

const SwipeTabItem = SwipeTabItemInner as unknown as SwipeTabItemComponent;

// Compound Component binding
const SwipeTab = Object.assign(SwipeTabRoot, {
  Item: SwipeTabItem,
});

export default SwipeTab;
