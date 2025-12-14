import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, render } from "@testing-library/react";
import WindowPage from "../WindowPage";
import userEvent from "@testing-library/user-event";

const fakeChat = {
  id: 1,
  lastMessageSenderUid: "",
  lastMessageSenderDisplayName: "",
  lastMessage: "",
  allTimeParticipantsUids: ["u1", "u2"],
  lastMessageDate: null,
  activeParticipantsUids: ["u1", "u2"],
  isGroupChat: false,
  enrichedParticipants: [
    {
      uid: "u1",
      displayName: "Unknown User",
    },
    {
      email_lower: null,
      email: null,
      updatedAt: {
        type: "firestore/timestamp/1.0",
        seconds: 1765215295,
        nanoseconds: 589000000,
      },
      guestId: "rYBKwxl7",
      isAnonymous: true,
      photoURL: null,
      displayName: "CalmOtter947",
      createdAt: {
        type: "firestore/timestamp/1.0",
        seconds: 1765209433,
        nanoseconds: 784000000,
      },
      uid: "u2",
      guestId_lower: "rybkwxl7",
    },
  ],
};

const fakeCurrentUser = {
  uid: "u1",
  displayName: "Belal",
  email: "belal@gmail.com",
};

const fakeMessages = [
  {
    id: "NewMessageId1",
    timestamp: {
      type: "firestore/timestamp/1.0",
      seconds: 1765475594,
      nanoseconds: 404000000,
    },
    senderDisplayName: "Belal",
    senderPhotoURL: null,
    text: "shesh",
    senderUid: "u1",
    chatId: "1",
  },
  {
    id: "NewMessageId2",
    timestamp: {
      type: "firestore/timestamp/1.0",
      seconds: 1765475594,
      nanoseconds: 404000000,
    },
    senderDisplayName: "Ahmed",
    senderPhotoURL: null,
    text: "shesh",
    senderUid: "u2",
    chatId: "1",
  },
];

const mockUnSubscribe = vi.fn();
const mockListener = vi.fn((contactUid, callback) => {
  callback({ status: "online" });
  return mockUnSubscribe;
});

vi.mock("../../../firebase/firebase_RTdb/rtdb", () => {
  return {
    listenToUserOnlineStatus: (...args) => mockListener(...args),
  };
});

vi.mock("../../../util/hooks/useMessages", () => {
  return {
    default: () => fakeMessages,
  };
});

vi.mock("../../../util/context/authContext", () => {
  return {
    useAuthContext: () => ({ user: fakeCurrentUser }),
  };
});

vi.mock("../../../components/chatComponents/chatwindow/Window", () => {
  return {
    default: ({ selectedChat }) => {
      return selectedChat ? (
        <div data-testid="thereIsChat">chat is here</div>
      ) : (
        <div data-testid="noChat">no chat</div>
      );
    },
  };
});

vi.mock(
  "../../../components/chatComponents/chatwindow/ContactInfoComponent",
  () => {
    return {
      default: ({ contact,contactOnlineStatus }) => {
        return (
          <>
            <div data-testid="ContactInfoComponent">
              this is ContactInfoComponent
            </div>
            {contact && <div>{contact.displayName}</div>}
            {contactOnlineStatus && (
              <div>
                {contactOnlineStatus.status == "online" ? "online" : "offline"}
              </div>
            )}
          </>
        );
      },
    };
  }
);

vi.mock("../../../components/chatComponents/chatwindow/ChatOptions", () => {
  return {
    default: () => {
      return <div data-testid="ChatOptions">this is ChatOptions</div>;
    },
  };
});

describe("WindowPage Component", () => {
  describe("When there is no selectedChat", () => {
    beforeEach(() => {
      render(
        <WindowPage
          selectedChat={null}
          setSelectedChat={() => {}}
          setIsChatLoading={() => {}}
          isChatLoading={false}
        />
      );
    });
    it("shows window component only", () => {
      expect(screen.getByTestId("noChat")).toBeInTheDocument();
      expect(screen.queryByTestId("thereIsChat")).not.toBeInTheDocument();
      expect(
        screen.queryByTestId("ContactInfoComponent")
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId("ChatOptions")).not.toBeInTheDocument();
    });
  });

  describe("When is a selectedChat", () => {
    beforeEach(() => {
      render(
        <WindowPage
          selectedChat={fakeChat}
          setSelectedChat={() => {}}
          setIsChatLoading={() => {}}
          isChatLoading={false}
        />
      );
    });

    it("shows window, contactinfo, chatoptions", () => {
      expect(screen.queryByTestId("noChat")).not.toBeInTheDocument();
      expect(screen.queryByTestId("thereIsChat")).toBeInTheDocument();
      expect(screen.queryByTestId("ContactInfoComponent")).toBeInTheDocument();
      expect(screen.queryByTestId("ChatOptions")).toBeInTheDocument();
    });
  });

  describe("When clicking back button", () => {
    it("calls setSelectedChat with null", async () => {
      const mockSetSelectedChat = vi.fn();
      render(
        <WindowPage
          selectedChat={fakeChat}
          setSelectedChat={mockSetSelectedChat}
          setIsChatLoading={() => {}}
          isChatLoading={false}
        />
      );

      const user = userEvent.setup();

      await user.click(screen.getByRole("button", { name: "back" }));

      expect(mockSetSelectedChat).toHaveBeenCalledExactlyOnceWith(null);
    });
  });

  describe("When chat is dm", () => {
    describe("Calculating contact details",()=>{
        beforeEach(() => {
        render(
          <WindowPage
            selectedChat={fakeChat}
            setSelectedChat={() => {}}
            setIsChatLoading={() => {}}
            isChatLoading={false}
          />
        );
      });

      it("passes correct contact prop",()=>{
        expect(screen.getByText(fakeChat.enrichedParticipants[1].displayName)).toBeInTheDocument();
      })
    })
    describe("When subscribing to contact status", () => {
      beforeEach(() => {
        render(
          <WindowPage
            selectedChat={fakeChat}
            setSelectedChat={() => {}}
            setIsChatLoading={() => {}}
            isChatLoading={false}
          />
        );
      });

      it("shows status", () => {
        expect(screen.getByText("online")).toBeInTheDocument();
      });
    });
  });

  describe("When chat is a group",()=>{
    beforeEach(()=>{
        fakeChat.isGroupChat = true;
         render(
          <WindowPage
            selectedChat={fakeChat}
            setSelectedChat={() => {}}
            setIsChatLoading={() => {}}
            isChatLoading={false}
          />
        );
    });

    it("doesn`t calculate contact details and contact prop is null",()=>{
        expect(screen.queryByText(fakeChat.enrichedParticipants[1].displayName)).not.toBeInTheDocument();
    });

    it("doesn`t calculate status details and contactOnlineStatus is null",()=>{
        expect(screen.queryByText("online")).not.toBeInTheDocument();
        expect(mockListener).toHaveBeenCalledTimes(0);
    });
  })
});
