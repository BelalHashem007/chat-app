import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  screen,
  render,
  waitForElementToBeRemoved,
  waitFor,
} from "@testing-library/react";
import OtherGroupOptions from "../OtherGroupOptions";
import userEvent from "@testing-library/user-event";
import ToastProvider from "../../toast/ToastProvider";

const fakeUser = { uid: 123, displayName: "Ahmed", email: "ahmed@test.com" };

const fakeUser2 = {
  uid: 1234,
  displayName: "Mohamed",
  email: "mohamed@test.com",
};

vi.mock("../../../../util/context/authContext", () => {
  return {
    useAuthContext: () => ({ user: fakeUser }),
  };
});

const mockCreateNewChatRoom = vi.fn(
  () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          isChatCreated: true,
          error: null,
        });
      }, 100);
    })
);

vi.mock("../../../../firebase/firebase_db/database", () => {
  return {
    createNewChatRoom: (...args) => mockCreateNewChatRoom(...args),
  };
});

describe("OtherGroupOptions Component", () => {
  describe("Rendering", () => {
    beforeEach(() => {
      render(
        <OtherGroupOptions
          setShowOptions={() => {}}
          selectedContacts={[]}
          handleClosingAddGroup={() => {}}
        />
      );
    });

    it("renders textbox for group name", () => {
      expect(
        screen.getByRole("textbox", { name: "Group Name" })
      ).toBeInTheDocument();
    });

    it("renders disabled submitBtn if group name is empty", () => {
      expect(screen.getByTestId("submitBtn")).toHaveAttribute("disabled");
    });

    it("renders enabled submitBtn if group name is NOT empty", async () => {
      const user = userEvent.setup();

      await user.type(
        screen.getByRole("textbox", { name: "Group Name" }),
        "123"
      );
      expect(screen.getByTestId("submitBtn")).not.toHaveAttribute("disabled");
    });

    it("renders a back button", () => {
      expect(screen.getByTestId("backBtn")).toBeInTheDocument();
    });
  });

  describe("When submit button is clicked", () => {
    beforeEach(async () => {
      render(
        <ToastProvider>
          <OtherGroupOptions
            setShowOptions={() => {}}
            selectedContacts={[]}
            handleClosingAddGroup={() => {}}
          />
        </ToastProvider>
      );
      const user = userEvent.setup();

      await user.type(
        screen.getByRole("textbox", { name: "Group Name" }),
        "test"
      );
      await user.click(screen.getByTestId("submitBtn"));
    });

    it("calls createNewChatRoom with correct arguements", () => {
      expect(mockCreateNewChatRoom).toHaveBeenCalledTimes(1);
      expect(mockCreateNewChatRoom).toHaveBeenCalledWith(
        fakeUser,
        [fakeUser],
        true,
        "test",
        [fakeUser.uid]
      );
    });

    it("shows a loading message while creating chat", async () => {
      expect(
        await screen.findByTestId("loadingForCreatingChat")
      ).toBeInTheDocument();

      await waitForElementToBeRemoved(() =>
        screen.queryByTestId("loadingForCreatingChat")
      );
    });
  });

  describe("When submission is successfull", () => {
    const mockSetShowOptions = vi.fn();
    const mockHandleClosingAddGroup = vi.fn();
    beforeEach(async () => {
      render(
        <ToastProvider>
          <OtherGroupOptions
            setShowOptions={mockSetShowOptions}
            selectedContacts={[fakeUser2]}
            handleClosingAddGroup={mockHandleClosingAddGroup}
          />
        </ToastProvider>
      );
      const user = userEvent.setup();

      await user.type(
        screen.getByRole("textbox", { name: "Group Name" }),
        "test"
      );
      await user.click(screen.getByTestId("submitBtn"));
    });

    it("shows a success message", async () => {
      expect(
        await screen.findByText("Your group has been created.")
      ).toBeInTheDocument();
    });

    it("calls handleClosingAddGroup", async () => {
      await waitFor(() =>
        expect(mockHandleClosingAddGroup).toHaveBeenCalledTimes(1)
      );
    });

    it("calls setShowOptions with (false)", async () => {
      await waitFor(() =>
        expect(mockSetShowOptions).toHaveBeenCalledExactlyOnceWith(false)
      );
    });
  });

  describe("When submission is not successfull", () => {
    beforeEach(async () => {
      mockCreateNewChatRoom.mockResolvedValueOnce(
        new Promise((resolve) =>
          setTimeout(() => {
            resolve({
              isChatCreated: false,
              error: "error test",
            });
          }, 100)
        )
      );
      render(
        <ToastProvider>
          <OtherGroupOptions
            setShowOptions={() => {}}
            selectedContacts={[fakeUser2]}
            handleClosingAddGroup={() => {}}
          />
        </ToastProvider>
      );
      const user = userEvent.setup();

      await user.type(
        screen.getByRole("textbox", { name: "Group Name" }),
        "test"
      );
      await user.click(screen.getByTestId("submitBtn"));
    });

    it("shows error message",async()=>{
        expect( await screen.findByText("Something went wrong. Please try again.")).toBeInTheDocument();
    })
  });

  describe("When back button is clicked",()=>{
    const mockSetShowOptions = vi.fn();
    beforeEach(async()=>{
        render(<OtherGroupOptions
          setShowOptions={mockSetShowOptions}
          selectedContacts={[]}
          handleClosingAddGroup={() => {}}
        />)

        const user = userEvent.setup();

        await user.click(screen.getByTestId("backBtn"))
    })
    it("calls setShowOptions with (false)",()=>{
        expect(mockSetShowOptions).toHaveBeenCalledTimes(1);
    })
  });
});
