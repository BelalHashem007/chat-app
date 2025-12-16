import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, render, waitFor, fireEvent } from "@testing-library/react";
import ChatOptions from "../ChatOptions";
import userEvent from "@testing-library/user-event";
import ToastProvider from "../../toast/ToastProvider";
import { useState } from "react";

const mockRemoveContact = vi.fn(
  () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve({ error: null, isRemoved: true });
      }, 100);
    })
);

const mockLeaveGroup = vi.fn(
  () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve({ error: null, didLeave: true });
      }, 100);
    })
);

const mockDeleteGroup = vi.fn(
  () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve({ error: null, isDeleted: true });
      }, 100);
    })
);

const mockSetSelectedChat = vi.fn();
const mockIsChatLoading = vi.fn(() => false);

vi.mock("../../../../firebase/firebase_db/database", () => {
  return {
    removeContact: (...args) => mockRemoveContact(...args),
    leaveGroup: (...args) => mockLeaveGroup(...args),
    deleteGroup: (...args) => mockDeleteGroup(...args),
  };
});

const fakeDmChat = {
  isGroupChat: false,
  id: "123",
};
const fakeGroupChat = {
  isGroupChat: true,
  id: "1234",
  adminUids: ["u2"],
  activeParticipantsUids: ["u1", "u2"],
};

const fakeGroupChatWithOneUser = {
  isGroupChat: true,
  id: "12345",
  adminUids: ["u1"],
  activeParticipantsUids: ["u1"],
};

const currentUser = {
  uid: "u1",
  displayName: "Belal",
};

const contact = {
  uid: "u2",
  displayName: "Ahmed",
};

vi.mock("../../../../util/context/authContext", () => {
  return {
    useAuthContext: () => ({ user: currentUser }),
  };
});

const TestWrapper = ({ chat }) => {
  const [isChatLoading, setIsChatLoading] = useState(false);

  return (
    <ChatOptions
      setIsChatLoading={setIsChatLoading}
      isChatLoading={isChatLoading}
      selectedChat={chat}
      setSelectedChat={mockSetSelectedChat}
      contact={contact}
    />
  );
};

describe("ChatOptions Component", () => {
  describe("Rendering", () => {
    it("renders options button", () => {
      render(<ChatOptions selectedChat={fakeDmChat} />);
      expect(screen.getByTestId("optionsBtn")).toBeInTheDocument();
    });
  });

  describe("When chat is a dm chat", () => {
    it("only Remove contact button exist", async () => {
      render(<ChatOptions selectedChat={fakeDmChat} />);

      const user = userEvent.setup();

      await user.click(screen.getByTestId("optionsBtn"));

      expect(screen.getByTestId("RemoveContactBtn")).toBeInTheDocument();
      expect(screen.queryByTestId("LeaveGroupBtn")).not.toBeInTheDocument();
      expect(screen.queryByTestId("DeleteGroupBtn")).not.toBeInTheDocument();
    });

    describe("When Remove contact button is clicked", () => {
      describe("Removes chat successfully", () => {
        beforeEach(async () => {
          render(
            <ToastProvider>
              <ChatOptions
                selectedChat={fakeDmChat}
                contact={contact}
                setIsChatLoading={() => {}}
                setSelectedChat={mockSetSelectedChat}
                isChatLoading={mockIsChatLoading()}
                useData={currentUser}
              />
            </ToastProvider>
          );
          const user = userEvent.setup();

          await user.click(screen.getByTestId("optionsBtn"));
          await user.click(screen.getByTestId("RemoveContactBtn"));
        });
        it("calls removeContact", () => {
          expect(mockRemoveContact).toHaveBeenCalledTimes(1);
        });
        it("set the selected chat to null", async () => {
          await waitFor(() =>
            expect(mockSetSelectedChat).toHaveBeenCalledExactlyOnceWith(null)
          );
        });
        it("shows a message that the contact is now removed", async () => {
          expect(
            await screen.findByText("Contact has been removed.")
          ).toBeInTheDocument();
        });
      });

      describe("Failed to remove chat", () => {
        beforeEach(async () => {
          mockRemoveContact.mockResolvedValueOnce({
            error: "test",
            isRemoved: false,
          });
          render(
            <ToastProvider>
              <ChatOptions
                selectedChat={fakeDmChat}
                contact={contact}
                setIsChatLoading={() => {}}
                setSelectedChat={mockSetSelectedChat}
                isChatLoading={mockIsChatLoading()}
              />
            </ToastProvider>
          );

          const user = userEvent.setup();

          await user.click(screen.getByTestId("optionsBtn"));
          await user.click(screen.getByTestId("RemoveContactBtn"));
        });

        it("calls removeContact with correct arguments", () => {
          expect(mockRemoveContact).toHaveBeenCalledTimes(1);
        });

        it("shows a message that tells the user the removal failed", async () => {
          expect(
            await screen.findByText("Failed to remove a contact.")
          ).toBeInTheDocument();
        });
      });

      it("disables the button until success or failure", async () => {
        render(
          <ToastProvider>
            <TestWrapper chat={fakeDmChat} />
          </ToastProvider>
        );
        const user = userEvent.setup();

        await user.click(screen.getByTestId("optionsBtn"));
        await user.click(screen.getByTestId("RemoveContactBtn"));

        expect(screen.getByTestId("RemoveContactBtn")).toBeDisabled();

        await waitFor(() =>
          expect(screen.getByTestId("RemoveContactBtn")).not.toBeDisabled()
        );
      });
    });
  });

  describe("When chat is a group chat", () => {
    it("only leave group is active for everyone IF activeParticipants > 1", async () => {
      render(<ChatOptions selectedChat={fakeGroupChat} />);

      const user = userEvent.setup();

      await user.click(screen.getByTestId("optionsBtn"));

      expect(screen.queryByTestId("RemoveContactBtn")).not.toBeInTheDocument();
      expect(screen.getByTestId("LeaveGroupBtn")).toBeInTheDocument();
      expect(screen.queryByTestId("DeleteGroupBtn")).not.toBeInTheDocument();
    });

    it("leave group is not active when activeParticipants = 1", async () => {
      render(<ChatOptions selectedChat={fakeGroupChatWithOneUser} />);

      const user = userEvent.setup();

      await user.click(screen.getByTestId("optionsBtn"));
      expect(screen.queryByTestId("LeaveGroupBtn")).not.toBeInTheDocument();
    });

    it("delete group is active IF user is also an admin in the group", async () => {
      render(<ChatOptions selectedChat={fakeGroupChatWithOneUser} />);

      const user = userEvent.setup();

      await user.click(screen.getByTestId("optionsBtn"));
      expect(screen.queryByTestId("DeleteGroupBtn")).toBeInTheDocument();
    });

    describe("When leave group is clicked", () => {
      describe("Leaves group successfully", () => {
        beforeEach(async () => {
          render(
            <ToastProvider>
              <ChatOptions
                setIsChatLoading={() => {}}
                setSelectedChat={mockSetSelectedChat}
                selectedChat={fakeGroupChat}
              />
            </ToastProvider>
          );
          const user = userEvent.setup();

          await user.click(screen.getByTestId("optionsBtn"));
          await user.click(screen.getByTestId("LeaveGroupBtn"));
        });

        it("calls leave group with correct arguments", () => {
          expect(mockLeaveGroup).toHaveBeenCalledExactlyOnceWith(
            fakeGroupChat,
            currentUser.uid
          );
        });

        it("calls setSelectedChat with null", async () => {
          await waitFor(() => {
            expect(mockSetSelectedChat).toHaveBeenCalledExactlyOnceWith(null);
          });
        });

        it("shows a message that leaving the group was success", async () => {
          await waitFor(() => {
            expect(
              screen.getByText("You have left the group.")
            ).toBeInTheDocument();
          });
        });
      });

      describe("Leaving the group failed", () => {
        beforeEach(async () => {
          mockLeaveGroup.mockResolvedValueOnce({
            error: "testerror",
            didLeave: false,
          });
          render(
            <ToastProvider>
              <ChatOptions
                setIsChatLoading={() => {}}
                setSelectedChat={mockSetSelectedChat}
                selectedChat={fakeGroupChat}
              />
            </ToastProvider>
          );
          const user = userEvent.setup();

          await user.click(screen.getByTestId("optionsBtn"));
          await user.click(screen.getByTestId("LeaveGroupBtn"));
        });

        it("calls leavGroup with correct arguments", () => {
          expect(mockLeaveGroup).toHaveBeenCalledExactlyOnceWith(
            fakeGroupChat,
            currentUser.uid
          );
        });

        it("shows an error message", async () => {
          await waitFor(() => {
            expect(
              screen.getByText("Failed to leave group.")
            ).toBeInTheDocument();
          });
        });
      });

      it("disables the button until success or failure", async () => {
        render(
          <ToastProvider>
            <TestWrapper chat={fakeGroupChat} />
          </ToastProvider>
        );
        const user = userEvent.setup();

        await user.click(screen.getByTestId("optionsBtn"));
        await user.click(screen.getByTestId("LeaveGroupBtn"));

        expect(screen.getByTestId("LeaveGroupBtn")).toBeDisabled();

        await waitFor(() =>
          expect(screen.getByTestId("LeaveGroupBtn")).not.toBeDisabled()
        );
      });
    });

    describe("When delete group is clicked", () => {
      describe("When delete is successful", () => {
        beforeEach(async () => {
          render(
            <ToastProvider>
              <ChatOptions
                setIsChatLoading={() => {}}
                setSelectedChat={mockSetSelectedChat}
                selectedChat={fakeGroupChatWithOneUser}
              />
            </ToastProvider>
          );
          const user = userEvent.setup();

          await user.click(screen.getByTestId("optionsBtn"));
          await user.click(screen.getByTestId("DeleteGroupBtn"));
        });

        it("calls deleteGroup with correct arguments", () => {
          expect(mockDeleteGroup).toHaveBeenCalledTimes(1);
        });

        it("calls setSelectedChat with null", async () => {
          await waitFor(() =>
            expect(mockSetSelectedChat).toHaveBeenCalledExactlyOnceWith(null)
          );
        });

        it("shows a message that the group is deleted", async () => {
          await waitFor(() =>
            expect(
              screen.getByText("Group is deleted successfully.")
            ).toBeInTheDocument()
          );
        });
      });

      describe("When delete fails", () => {
        beforeEach(async () => {
          mockDeleteGroup.mockResolvedValueOnce({
            error: "test error",
            isDeleted: false,
          });
          render(
            <ToastProvider>
              <ChatOptions
                setIsChatLoading={() => {}}
                setSelectedChat={mockSetSelectedChat}
                selectedChat={fakeGroupChatWithOneUser}
              />
            </ToastProvider>
          );
          const user = userEvent.setup();

          await user.click(screen.getByTestId("optionsBtn"));
          await user.click(screen.getByTestId("DeleteGroupBtn"));
        });

        it("calls deleteGroup with correct arguments", () => {
          expect(mockDeleteGroup).toHaveBeenCalledTimes(1);
        });

        it("shows a message that the group deletion failed", async () => {
          await waitFor(() =>
            expect(
              screen.getByText("Failed to delete group.")
            ).toBeInTheDocument()
          );
        });
      });

      it("disables the button until success or failure",async()=>{
         render(
          <ToastProvider>
            <TestWrapper chat={fakeGroupChatWithOneUser} />
          </ToastProvider>
        );
        const user = userEvent.setup();

        await user.click(screen.getByTestId("optionsBtn"));
        await user.click(screen.getByTestId("DeleteGroupBtn"));

        expect(screen.getByTestId("DeleteGroupBtn")).toBeDisabled();

        await waitFor(() =>
          expect(screen.getByTestId("DeleteGroupBtn")).not.toBeDisabled()
        );
      })
    });
  });

  describe("when clicked twice",()=>{
    beforeEach(async()=>{
      render(<ChatOptions selectedChat={fakeDmChat} />);
      const user = userEvent.setup();

      await user.click(screen.getByTestId("optionsBtn"))
      await user.click(screen.getByTestId("optionsBtn"))
    })
    it("closes",()=>{
      expect(screen.queryByTestId("RemoveContactBtn")).not.toBeInTheDocument();
    });
  });

  describe("when clicked outside of the body",()=>{
    beforeEach(async()=>{
      render(<ChatOptions selectedChat={fakeDmChat} />);
      const user = userEvent.setup();

      await user.click(screen.getByTestId("optionsBtn"))
      fireEvent.mouseDown(document)
    })
    it("closes",()=>{
      expect(screen.queryByTestId("RemoveContactBtn")).not.toBeInTheDocument();
    });
  })
});
