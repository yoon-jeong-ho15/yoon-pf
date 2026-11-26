import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, expect, test, vi } from "vitest";
import { cdp, page, userEvent } from "vitest/browser";
import { Modal, ModalClose, ModalContent, ModalTitle, ModalTrigger } from "./ui/modal";
import { MobileMenu } from "./navbar/mobile-menu";
import { FrontmatterItem } from "./ui/frontmatter";
import { DraggableCard } from "./ui/draggable-card";
import ReviewItem from "./(markdown)/reviewitem";
import { MetadataProvider } from "@/hooks/useMetadata";
import "@/app/globals.css";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));


let root: Root | undefined;
let host: HTMLDivElement | undefined;
const originalOverflow = document.body.style.overflow;

async function flushRender(callback: () => void) {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  try {
    await act(callback);
  } finally {
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: false });
  }
}

async function render(children: React.ReactNode) {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  await flushRender(() => root?.render(children));
}

afterEach(async () => {
  await flushRender(() => root?.unmount());
  host?.remove();
  root = undefined;
  document.body.style.overflow = originalOverflow;
  await page.viewport(1024, 768);
});

test("modal keeps background controls out of the tab order and restores focus on Escape", async () => {
  document.body.style.overflow = "scroll";
  await render(
    <>
      <button>Background</button>
      <Modal>
        <ModalTrigger>Open</ModalTrigger>
        <ModalContent>
          <ModalTitle>Details</ModalTitle>
          <ModalClose>Close</ModalClose>
          <a href="#details">Details link</a>
        </ModalContent>
      </Modal>
    </>,
  );
  const trigger = page.getByRole("button", { name: "Open", exact: true });
  await trigger.click();
  await expect.element(page.getByRole("dialog", { name: "Details", exact: true })).toBeVisible();
  await expect.element(page.getByRole("button", { name: "Close", exact: true })).toHaveFocus();
  for (let i = 0; i < 5; i++) {
    await userEvent.keyboard("{Tab}");
    expect(document.activeElement?.textContent).not.toBe("Background");
    expect(document.activeElement).not.toBe(trigger.element());
  }
  expect(document.body.style.overflow).toBe("hidden");
  await userEvent.keyboard("{Escape}");
  await expect.element(trigger).toHaveFocus();
  expect(document.querySelector("dialog")?.open).toBe(false);
  expect(document.body.style.overflow).toBe("scroll");
});

test("mobile menu releases its scroll lock when resized to desktop", async () => {
  await page.viewport(390, 844);
  document.body.style.overflow = "scroll";
  await render(<MobileMenu />);
  await page.getByRole("button", { name: "메뉴 열기" }).click();
  await expect.poll(() => document.body.style.overflow).toBe("hidden");
  await expect.element(page.getByRole("button", { name: "메뉴 닫기" })).toHaveAttribute("aria-expanded", "true");
  await page.viewport(1024, 768);
  await expect.poll(() => document.body.style.overflow).toBe("scroll");
  await expect.element(page.getByRole("button", { name: "메뉴 열기" })).toHaveAttribute("aria-expanded", "false");
});

test("mobile menu closes on Escape and restores focus", async () => {
  await page.viewport(390, 844);
  await render(<MobileMenu />);
  await page.getByRole("button", { name: "메뉴 열기" }).click();
  await userEvent.keyboard("{Escape}");
  await expect.element(page.getByRole("button", { name: "메뉴 열기" })).toHaveFocus();
  await expect.poll(() => document.body.style.overflow).toBe(originalOverflow);
});

test("mobile menu transitions open -> closing -> closed on overlay animationend and ignores child animationend", async () => {
  await page.viewport(390, 844);
  await render(<MobileMenu />);

  const openTrigger = page.getByRole("button", { name: "메뉴 열기" });
  const menuId = openTrigger.element().getAttribute("aria-controls")!;
  expect(menuId).toBeTruthy();
  expect(document.getElementById(menuId)).toBeNull();

  await openTrigger.click();
  const overlay = document.getElementById(menuId) as HTMLElement;
  expect(overlay).not.toBeNull();
  expect(overlay.inert).toBe(false);
  await expect.element(page.getByRole("button", { name: "메뉴 닫기" })).toHaveAttribute("aria-expanded", "true");

  // Trigger close via backdrop click -> enters "closing" state.
  overlay.click();
  await expect.element(page.getByRole("button", { name: "메뉴 열기" })).toHaveAttribute("aria-expanded", "false");
  expect(document.getElementById(menuId)).toBe(overlay);
  expect(overlay.inert).toBe(true);
  expect(overlay.classList.contains("animate-fade-out")).toBe(true);

  // Inner panel's bubbled animationend must not prematurely unmount the overlay.
  const panel = overlay.firstElementChild as HTMLElement;
  panel.dispatchEvent(new AnimationEvent("animationend", { animationName: "slideUp", bubbles: true }));
  expect(document.getElementById(menuId)).toBe(overlay);

  // Overlay unmounts once its own fadeOut animation completes.
  await expect.poll(() => document.getElementById(menuId)).toBeNull();
});

test("mobile menu stays open when reopened while closing even if a stale fadeOut animationend fires", async () => {
  await page.viewport(390, 844);
  await render(<MobileMenu />);

  const trigger = page.getByRole("button", { name: "메뉴 열기" });
  const menuId = trigger.element().getAttribute("aria-controls")!;

  await trigger.click();
  const overlay = document.getElementById(menuId) as HTMLElement;
  overlay.click();
  await expect.poll(() => overlay.inert).toBe(true);

  // Reopen while closing.
  await page.getByRole("button", { name: "메뉴 열기" }).click();
  await expect.element(page.getByRole("button", { name: "메뉴 닫기" })).toHaveAttribute("aria-expanded", "true");
  expect(overlay.inert).toBe(false);
  expect(overlay.classList.contains("animate-fade-in")).toBe(true);

  // A stale fadeOut end event from the earlier close cycle must not close the reopened menu.
  overlay.dispatchEvent(new AnimationEvent("animationend", { animationName: "fadeOut" }));
  expect(document.getElementById(menuId)).toBe(overlay);
  await expect.element(page.getByRole("button", { name: "메뉴 닫기" })).toHaveAttribute("aria-expanded", "true");
});

test("mobile menu closes immediately when animation is omitted via desktop resize or disabled animation", async () => {
  await page.viewport(390, 844);
  await render(<MobileMenu />);

  const trigger = page.getByRole("button", { name: "메뉴 열기" });
  const menuId = trigger.element().getAttribute("aria-controls")!;

  // Closing and then switching to desktop unmounts even though md:hidden omits the CSS animation.
  await trigger.click();
  const overlay = document.getElementById(menuId) as HTMLElement;
  overlay.click();
  await expect.poll(() => overlay.inert).toBe(true);

  await page.viewport(1024, 768);
  await expect.poll(() => document.getElementById(menuId)).toBeNull();

  // Closing when animation is explicitly omitted (animation-name: none) also unmounts immediately.
  await page.viewport(390, 844);
  await page.getByRole("button", { name: "메뉴 열기" }).click();
  const reopenedOverlay = document.getElementById(menuId) as HTMLElement;
  reopenedOverlay.style.animationName = "none";
  reopenedOverlay.click();
  await expect.poll(() => document.getElementById(menuId)).toBeNull();
});

test("frontmatter preserves its layout when given a custom class", async () => {
  await render(<FrontmatterItem label="title" value="Example" variant="review" className="custom-style" />);
  expect(host?.firstElementChild?.classList.contains("custom-style")).toBe(true);
  expect(host?.firstElementChild?.classList.contains("flex")).toBe(true);
  expect(host?.firstElementChild?.classList.contains("border-b")).toBe(true);
});

test("review item preserves field ordering, arbitrary extra fields, vertical link layout, and link preview behavior", async () => {
  const linkUrl = "https://example.com/books/kindred";
  await render(
    <MetadataProvider
      metadataMap={{
        [linkUrl]: {
          url: linkUrl,
          title: "Kindred Preview Title",
          description: "Preview description text",
        },
      }}
    >
      <ReviewItem
        item={{
          slug: ["review", "kindred"],
          itemImage: "/android-chrome-192x192.png",
          frontmatter: {
            link: [linkUrl],
            tags: ["fiction"],
            date: "2024-01-02",
            order: 2,
            author: "Octavia Butler",
            title: "Kindred",
            customNote: "Annotated copy",
          } as unknown as Parameters<typeof ReviewItem>[0]["item"]["frontmatter"],
        }}
      />
    </MetadataProvider>,
  );

  // Hidden fields are not rendered; known fields keep canonical order and trailing extra fields appear.
  const fieldContainer = host?.querySelector(".space-y-7") as HTMLElement;
  const renderedLabels = Array.from(fieldContainer.children).map(
    (row) => row.firstElementChild?.textContent,
  );
  expect(renderedLabels).toEqual(["title", "author", "order", "link", "customNote"]);
  expect(fieldContainer.textContent).not.toContain("2024-01-02");
  expect(fieldContainer.textContent).not.toContain("fiction");
  expect(fieldContainer.textContent).toContain("Annotated copy");

  // Link field uses vertical column layout and renders hoverable domain link with preview popup.
  const linkRow = fieldContainer.children[3] as HTMLElement;
  expect(linkRow.classList.contains("flex-col")).toBe(true);

  const link = page.getByRole("link", { name: "example.com" });
  await expect.element(link).toBeVisible();
  expect(link.element().getAttribute("href")).toBe(linkUrl);

  await link.hover();
  await expect.element(page.getByText("Kindred Preview Title")).toBeVisible();
  await expect.element(page.getByText("Preview description text")).toBeVisible();
});

test("drag handles compose consumer events and leave card bodies scrollable", async () => {
  const onDoubleClick = vi.fn();
  const onPointerDown = vi.fn();
  await render(
    <>
      <DraggableCard>
        <DraggableCard.Handle onPointerDown={onPointerDown} onDoubleClick={onDoubleClick}>Handle</DraggableCard.Handle>
        <p>Scrollable body</p>
      </DraggableCard>
      <div className="mt-40">Drop target</div>
    </>,
  );
  const body = page.getByText("Scrollable body").element();
  expect(getComputedStyle(body.parentElement!).touchAction).toBe("auto");
  expect(getComputedStyle(page.getByText("Handle").element()).touchAction).toBe("none");
  await userEvent.dragAndDrop(page.getByText("Handle"), page.getByText("Drop target"));
  expect(body.parentElement?.style.transform).not.toBe("translate3d(0px, 0px, 0px)");
  await page.getByText("Handle").dblClick();
  expect(onDoubleClick).toHaveBeenCalledOnce();
  expect(onPointerDown).toHaveBeenCalled();
  expect(body.parentElement?.style.transform).toBe("translate3d(0px, 0px, 0px)");
});

test("allows dragging outside container bounds without re-rendering on pointermove, returns inside on release, and resets on double-click", async () => {
  const onRender = vi.fn();
  function RenderProbe() {
    onRender();
    return <span>Card body</span>;
  }

  await render(
    <div id="drag-boundary" style={{ width: "320px", height: "220px", padding: "16px", position: "relative" }}>
      <DraggableCard containerSelector="#drag-boundary" className="w-[140px]">
        <DraggableCard.Handle>Bounded handle</DraggableCard.Handle>
        <RenderProbe />
      </DraggableCard>
    </div>,
  );

  const handle = page.getByText("Bounded handle").element() as HTMLElement;
  const card = handle.parentElement as HTMLElement;
  const boundary = document.getElementById("drag-boundary") as HTMLElement;
  const boundaryRect = boundary.getBoundingClientRect();
  const handleRect = handle.getBoundingClientRect();

  const frameRect = window.frameElement?.getBoundingClientRect();
  const frameOffsetX = frameRect?.left ?? 0;
  const frameOffsetY = frameRect?.top ?? 0;

  const startX = frameOffsetX + handleRect.left + handleRect.width / 2;
  const startY = frameOffsetY + handleRect.top + handleRect.height / 2;
  const targetX = startX + 360;
  const targetY = startY + 280;

  const session = cdp();
  const rendersBeforeDrag = onRender.mock.calls.length;

  await session.send("Input.dispatchMouseEvent", {
    type: "mousePressed",
    x: startX,
    y: startY,
    button: "left",
    buttons: 1,
    clickCount: 1,
  });

  await expect.poll(() => onRender.mock.calls.length).toBe(rendersBeforeDrag + 1);
  const rendersAfterPointerDown = onRender.mock.calls.length;

  for (const step of [0.3, 0.6, 1]) {
    await session.send("Input.dispatchMouseEvent", {
      type: "mouseMoved",
      x: startX + (targetX - startX) * step,
      y: startY + (targetY - startY) * step,
      button: "left",
      buttons: 1,
    });
  }

  // Card moves freely outside the container while dragging without triggering React re-renders.
  const midDragRect = card.getBoundingClientRect();
  expect(midDragRect.right).toBeGreaterThan(boundaryRect.right);
  expect(midDragRect.bottom).toBeGreaterThan(boundaryRect.bottom);
  expect(onRender.mock.calls.length).toBe(rendersAfterPointerDown);

  await session.send("Input.dispatchMouseEvent", {
    type: "mouseReleased",
    x: targetX,
    y: targetY,
    button: "left",
    buttons: 0,
    clickCount: 1,
  });

  // Card returns inside the container boundary once released.
  await expect.poll(() => {
    const releasedRect = card.getBoundingClientRect();
    return (
      releasedRect.left >= boundaryRect.left - 1 &&
      releasedRect.right <= boundaryRect.right + 1 &&
      releasedRect.top >= boundaryRect.top - 1 &&
      releasedRect.bottom <= boundaryRect.bottom + 1
    );
  }).toBe(true);

  const rendersAfterRelease = onRender.mock.calls.length;
  await page.getByText("Bounded handle").dblClick();
  expect(card.style.transform).toBe("translate3d(0px, 0px, 0px)");
  expect(onRender.mock.calls.length).toBe(rendersAfterRelease);
});

test("DraggableCard.Handle respects preventDefault and ignores secondary clicks and interactive children", async () => {
  const preventedPointerDown = vi.fn((e: React.PointerEvent) => e.preventDefault());
  const preventedDoubleClick = vi.fn((e: React.MouseEvent) => e.preventDefault());

  await render(
    <div style={{ display: "flex", flexDirection: "column", gap: "80px" }}>
      <DraggableCard>
        <DraggableCard.Handle onPointerDown={preventedPointerDown}>Prevented drag</DraggableCard.Handle>
        <p>Card A</p>
      </DraggableCard>

      <DraggableCard>
        <DraggableCard.Handle onDoubleClick={preventedDoubleClick}>
          Interactive handle <button type="button">Child action</button>
        </DraggableCard.Handle>
        <p>Card B</p>
      </DraggableCard>

      <div>Remote target</div>
    </div>,
  );

  const cardA = page.getByText("Card A").element().parentElement as HTMLElement;
  const cardB = page.getByText("Card B").element().parentElement as HTMLElement;

  // preventDefault on handle's onPointerDown cancels dragging.
  await userEvent.dragAndDrop(page.getByText("Prevented drag"), page.getByText("Remote target"));
  expect(preventedPointerDown).toHaveBeenCalled();
  expect(cardA.style.transform).toBe("translate3d(0px, 0px, 0px)");

  // Dragging from an interactive child inside the handle does not move the card.
  await userEvent.dragAndDrop(page.getByRole("button", { name: "Child action" }), page.getByText("Remote target"));
  expect(cardB.style.transform).toBe("translate3d(0px, 0px, 0px)");

  // Secondary (right) mouse button drag on the handle does not move the card.
  const handleB = page.getByText("Interactive handle").element() as HTMLElement;
  const handleBRect = handleB.getBoundingClientRect();
  const frameRect = window.frameElement?.getBoundingClientRect();
  const rightStartX = (frameRect?.left ?? 0) + handleBRect.left + handleBRect.width / 2;
  const rightStartY = (frameRect?.top ?? 0) + handleBRect.top + handleBRect.height / 2;
  const session = cdp();
  await session.send("Input.dispatchMouseEvent", {
    type: "mousePressed",
    x: rightStartX,
    y: rightStartY,
    button: "right",
    buttons: 2,
    clickCount: 1,
  });
  await session.send("Input.dispatchMouseEvent", {
    type: "mouseMoved",
    x: rightStartX + 120,
    y: rightStartY + 80,
    button: "right",
    buttons: 2,
  });
  await session.send("Input.dispatchMouseEvent", {
    type: "mouseReleased",
    x: rightStartX + 120,
    y: rightStartY + 80,
    button: "right",
    buttons: 0,
    clickCount: 1,
  });
  expect(cardB.style.transform).toBe("translate3d(0px, 0px, 0px)");

  // Dragging from the handle itself moves the card, and preventDefault on onDoubleClick blocks reset.
  await userEvent.dragAndDrop(page.getByText("Interactive handle"), page.getByText("Remote target"));
  const movedTransform = cardB.style.transform;
  expect(movedTransform).not.toBe("translate3d(0px, 0px, 0px)");

  await page.getByText("Interactive handle").dblClick();
  expect(preventedDoubleClick).toHaveBeenCalledOnce();
  expect(cardB.style.transform).toBe(movedTransform);
});
