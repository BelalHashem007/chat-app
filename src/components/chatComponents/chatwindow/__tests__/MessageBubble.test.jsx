import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, render } from "@testing-library/react";
import MessageBubble from "../MessageBubble";

const fakeSystemMsg = {
  id: "123",
  timestamp: {
    type: "firestore/timestamp/1.0",
    seconds: 1765475597,
    nanoseconds: 332000000,
  },
  isSystem: true,
  senderDisplayName: "System",
  chatId: "aa11",
  text: "test",
  senderUid: "system",
  senderPhotoURL: null,
};

const fakeCurrentUserMsg = {
  id: "123bb",
  timestamp: {
    type: "firestore/timestamp/1.0",
    seconds: 1765475597,
    nanoseconds: 332000000,
  },
  isSystem: false,
  senderDisplayName: "Belal",
  chatId: "aa11",
  text: "test",
  senderUid: "u1",
  senderPhotoURL: null,
};

const fakeUserMsg = {
  id: "123bb",
  timestamp: {
    type: "firestore/timestamp/1.0",
    seconds: 1765475597,
    nanoseconds: 332000000,
  },
  isSystem: false,
  senderDisplayName: "Ahmed",
  chatId: "aa11",
  text: "test",
  senderUid: "u2",
  senderPhotoURL: null,
};

const currentUser = {
  uid: "u1",
  displayName: "Belal",
  email: "belal@google.com",
};

const contactUser = {
  uid: "u2",
  displayName: "Ahmed",
  email: "ahmed@google.com",
};

const fakeDMChat = {
  id: "aa11",
  isGroupChat: false,
  enrichedParticipants: [currentUser, contactUser],
};

const fakeGroupChat = {
  id: "aa11",
  isGroupChat: true,
  enrichedParticipants: [currentUser, contactUser],
  groupName: "test",
};

vi.mock("../../../../util/context/authContext", () => {
  return {
    useAuthContext: () => ({ user: currentUser }),
  };
});

describe("MessageBubble Component", () => {
  describe("When message is a system Message", () => {
    beforeEach(() => {
      render(<MessageBubble msg={fakeSystemMsg} selectedChat={fakeDMChat} />);
    });

    it("renders system message", () => {
      expect(screen.getByTestId("systemMsg")).toBeInTheDocument();
      expect(screen.queryByTestId("userMsg")).not.toBeInTheDocument();
    });
  });

  describe("When message is a user message", () => {
    describe("When chat is a dm chat", () => {
      beforeEach(() => {
        render(
          <MessageBubble selectedChat={fakeDMChat} msg={fakeCurrentUserMsg} />
        );
      });

      it("renders msg text and date only", () => {
        expect(screen.getByTestId("userMsg")).toHaveTextContent("test");
        expect(screen.getByTestId("userMsgDate")).toBeInTheDocument();

        expect(screen.queryByTestId("systemMsg")).not.toBeInTheDocument();
        expect(screen.queryByTestId("senderImg")).not.toBeInTheDocument();
        expect(screen.queryByTestId("senderName")).not.toBeInTheDocument();
      });
    });
    describe("When chat is a group chat", () => {
      describe("When sender is current user", () => {
        beforeEach(() => {
          render(
            <MessageBubble
              selectedChat={fakeGroupChat}
              msg={fakeCurrentUserMsg}
            />
          );
        });
        it("renders msg text and date only", () => {
          expect(screen.getByTestId("userMsg")).toHaveTextContent("test");
          expect(screen.getByTestId("userMsgDate")).toBeInTheDocument();

          expect(screen.queryByTestId("systemMsg")).not.toBeInTheDocument();
          expect(screen.queryByTestId("senderImg")).not.toBeInTheDocument();
          expect(screen.queryByTestId("senderName")).not.toBeInTheDocument();
        });
      });

      describe("When sender is NOT current user", () => {
        beforeEach(() => {
          render(
            <MessageBubble selectedChat={fakeGroupChat} msg={fakeUserMsg} />
          );
        });

        it("renders msg text, msg date, profile picture and name", () => {
          expect(screen.getByTestId("userMsg")).toHaveTextContent("test");
          expect(screen.getByTestId("userMsgDate")).toBeInTheDocument();

          expect(screen.queryByTestId("systemMsg")).not.toBeInTheDocument();
          expect(screen.queryByTestId("senderImg")).toBeInTheDocument();
          expect(screen.queryByTestId("senderName")).toBeInTheDocument();
        });
      });
    });
  });

  describe("When msg.chatId is not equal to chat.id",()=>{
    beforeEach(()=>{
        render(<MessageBubble selectedChat={fakeDMChat} msg={{chatId:"nnnn"}}/>)
    });
    it("renders nothing",()=>{
        expect(screen.queryByRole("log",{name:"Message"})).not.toBeInTheDocument();
    })
  })
});
