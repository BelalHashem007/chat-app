import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, render } from "@testing-library/react";
import Chat from "../Chat";
import userEvent from "@testing-library/user-event";

const fakeCurrentUser = {
  uid: 123,
  displayName: "Belal",
};

const fakeChats = [{ id: 1 }, { id: 2 }, { id: 3 }];

const mockUnsubscribeChats = vi.fn();
const mockUnsubscribeUser = vi.fn()

const mockListenerToChats = vi.fn((uid, callback) => {
  callback(fakeChats);
  return mockUnsubscribeChats;
});

const mockListenerToUser = vi.fn((uid, callback) => {
  callback(fakeCurrentUser);
  return mockUnsubscribeUser;
});

vi.mock("../../../firebase/firebase_db/database", () => {
  return {
    subscribeToUserChats: (...args) => mockListenerToChats(...args),
    subscribeToCurrentUser: (...args) => mockListenerToUser(...args),
  };
});

vi.mock("../../../util/context/authContext", () => {
  return {
    useAuthContext: () => ({ user: fakeCurrentUser }),
  };
});

vi.mock("../../../components/chatComponents/sidebar/Sidebar", () => {
  return {
    default: ({ setActiveComponent }) => {
      return (
        <>
          <button
            data-testid="profileBtn"
            onClick={() => setActiveComponent("profile")}
          >
            profile
          </button>
          <button
            data-testid="chatsBtn"
            onClick={() => setActiveComponent("contactList")}
          >
            chats
          </button>
        </>
      );
    },
  };
});

vi.mock("../../../components/chatComponents/profile/Profile", () => {
  return {
    default: () => {
      return <div data-testid="profileComponent">this is profile</div>;
    },
  };
});

vi.mock("../ContactList", () => {
  return {
    default: ({ chats }) => {
      return (
        <div data-testid="contactListComponent">
          this is contactlist{" "}
          <ul>
            {chats.map((chat) => (
              <li data-testid="chat">{chat.id}</li>
            ))}
          </ul>
        </div>
      );
    },
  };
});

describe("Chat Component", () => {
  it("renders contactlist on the screen by default", () => {
    render(<Chat />);
    expect(screen.getByTestId("contactListComponent")).toBeInTheDocument();
  });

  describe("When clicking on profile", () => {
    beforeEach(async () => {
      render(<Chat />);

      const user = userEvent.setup();

      await user.click(screen.getByTestId("profileBtn"));
    });
    it("renders profile instead of contactlist", () => {
      expect(screen.getByTestId("profileComponent")).toBeInTheDocument();
      expect(
        screen.queryByTestId("contactListComponent")
      ).not.toBeInTheDocument();
    });
  });

  describe("When clicking on chats", () => {
    beforeEach(async () => {
      render(<Chat />);

      const user = userEvent.setup();

      await user.click(screen.getByTestId("profileBtn"));
      await user.click(screen.getByTestId("chatsBtn"));
    });
    it("renders contactlist", () => {
      expect(screen.queryByTestId("profileComponent")).not.toBeInTheDocument();
      expect(screen.getByTestId("contactListComponent")).toBeInTheDocument();
    });
  });

  describe("When mounting", () => {
    beforeEach(() => {
      render(<Chat />);
    });
    it("fetches chats by calling subscribeToUserChats and shows correct number of chats", () => {
      expect(mockListenerToChats).toHaveBeenCalledExactlyOnceWith(
        fakeCurrentUser.uid,
        expect.any(Function)
      );
      expect(screen.getAllByTestId("chat")).toHaveLength(fakeChats.length);
    });
    it("fetches current user data by calling subscribeToCurrentUser", () => {
      expect(mockListenerToUser).toHaveBeenCalledExactlyOnceWith(
        fakeCurrentUser.uid,
        expect.any(Function)
      );
    });
  });

  describe("When unmounting",()=>{
    beforeEach(() => {
      const {unmount}=render(<Chat />);
      unmount();
    });
    it("calls unsubscribe for chats listener",()=>{
        expect(mockUnsubscribeChats).toHaveBeenCalledTimes(1);
    });
    it("calls unsubscribe for user listener",()=>{
        expect(mockListenerToUser).toHaveBeenCalledTimes(1);
    })
  })
});
