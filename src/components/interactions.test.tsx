import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { Modal, ModalClose, ModalContent, ModalTitle, ModalTrigger } from "./ui/modal";
import { MobileMenu } from "./navbar/mobile-menu";
import { FrontmatterItem } from "./ui/frontmatter";
import { DraggableCard } from "./ui/draggable-card";
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

test("frontmatter preserves its layout when given a custom class", async () => {
  await render(<FrontmatterItem label="title" value="Example" variant="review" className="custom-style" />);
  expect(host?.firstElementChild?.classList.contains("custom-style")).toBe(true);
  expect(host?.firstElementChild?.classList.contains("flex")).toBe(true);
  expect(host?.firstElementChild?.classList.contains("border-b")).toBe(true);
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
