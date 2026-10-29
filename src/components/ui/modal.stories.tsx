import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { Modal, ModalClose, ModalContent, ModalTitle, ModalTrigger } from "./modal";

const meta = {
  title: "UI/Modal",
  component: Modal,
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FocusRestoration: Story = {
  render: () => (
    <>
      <button type="button">Background action</button>
      <Modal>
        <ModalTrigger>Open dialog</ModalTrigger>
        <ModalContent>
          <ModalTitle>Example dialog</ModalTitle>
          <ModalClose>Close dialog</ModalClose>
          <a href="#example">Dialog link</a>
        </ModalContent>
      </Modal>
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole("button", { name: "Open dialog" });

    await userEvent.click(trigger);
    const dialog = body.getByRole("dialog", { name: "Example dialog" });
    const close = within(dialog).getByRole("button", { name: "Close dialog" });
    await expect(close).toHaveFocus();
    await userEvent.click(close);
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toHaveFocus();
  },
};
