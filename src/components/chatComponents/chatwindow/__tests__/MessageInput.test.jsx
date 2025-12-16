import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, render, waitFor } from "@testing-library/react";
import MessageInput from "../MessageInput";
import userEvent from "@testing-library/user-event";

const mockSendMessage = vi.fn(
  () =>
    new Promise((resolve) =>
      setTimeout(() => {
        resolve(1);
      }, 100)
    )
);

const fakeUser = { uid: 123, displayName: "Belal" };
const fakeChat = {
  id: "123",
};

vi.mock("../../../../firebase/firebase_db/database", () => {
  return {
    sendMessage: (...args) => mockSendMessage(...args),
  };
});

vi.mock("../../../../util/context/authContext", () => {
  return {
    useAuthContext: () => ({ user: fakeUser }),
  };
});

describe("MessageInput Component", () => {
  describe("Rendering", () => {
    beforeEach(() => {
      render(<MessageInput selectedChat={fakeChat} disableBtn={false} userData={fakeUser}/>);
    });

    it("renders a form with textarea, submit btn and emojie picker", () => {
      expect(
        screen.getByRole("form", { name: "Send a message" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("textbox", { name: "Message" })
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Send" })).toBeInTheDocument();
      expect(screen.getByTestId("emojiPicker")).toBeInTheDocument();
    });
  });

  describe("When submitting a message", () => {
    beforeEach(() => {
      render(<MessageInput selectedChat={fakeChat} disableBtn={false} userData={fakeUser}/>);
    });

    it("does nothing if msg is empty", async () => {
      const user = userEvent.setup();

      await user.click(screen.getByRole("button", { name: "Send" }));

      expect(mockSendMessage).toHaveBeenCalledTimes(0);
    });

    describe("When message has a value", () => {
      beforeEach(async () => {
        const user = userEvent.setup();

        await user.type(
          screen.getByRole("textbox", { name: "Message" }),
          "test"
        );
        await user.click(screen.getByRole("button", { name: "Send" }));
      });
      it("empty input field", async () => {
        await waitFor(() =>
          expect(screen.getByRole("textbox", { name: "Message" })).toHaveValue(
            ""
          )
        );
      });

      it("calls sendMessage with correct arguments", async () => {
        expect(mockSendMessage).toHaveBeenCalledExactlyOnceWith(
          "test",
          fakeChat.id,
          fakeUser
        );
      });
    });
  });
});
