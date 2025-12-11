import { describe, it, expect, beforeEach } from "vitest";
import { screen, render } from "@testing-library/react";
import Contact from "../Contact";

const dmChat = {
  id: "dm1",
  isGroupChat: false,
  lastMessage: "Hey, how are you?",
  lastMessageSenderDisplayName: "Alpha",
  lastMessageSenderUid: "user2",
  enrichedParticipants: [
    {
      uid: "user1",
      displayName: "Belal",
      email: "belal@test.com",
    },
    {
      uid: "user2",
      displayName: "Alpha",
      email: "alpha@test.com",
    },
  ],
};

const dmChatWithGuest = {
  id: "dm1",
  isGroupChat: false,
  lastMessage: "Hey, how are you?",
  lastMessageSenderDisplayName: "Belal",
  lastMessageSenderUid: "user1",
  enrichedParticipants: [
    {
      uid: "user1",
      displayName: "Belal",
      email: "belal@test.com",
    },
    {
      uid: "user2",
      displayName: "Beta",
      email: null,
      isAnonymous: true,
      guestId: "rr44",
    },
  ],
};

const groupChat = {
  id: "group1",
  groupName: "Test Group",
  isGroupChat: true,
  lastMessage: "Welcome to the group!",
  lastMessageSenderDisplayName: "Charlie",
  lastMessageSenderUid: "user3",
  enrichedParticipants: [
    {
      uid: "user1",
      displayName: "Belal",
      email: "belal@test.com",
    },
    {
      uid: "user3",
      displayName: "Charlie",
      email: "charlie@test.com",
    },
  ],
};
describe("Contact Component", () => {
  describe("Rendering", () => {
    it("renders nothing if curUserUid is missing", () => {
      render(<Contact chat={dmChat} curUserUid={null} />);
      expect(screen.queryByTestId("contactWrapper")).not.toBeInTheDocument();
    });

    it("renders nothing if chat is missing", () => {
      render(<Contact chat={null} curUserUid={"user1"} />);
      expect(screen.queryByTestId("contactWrapper")).not.toBeInTheDocument();
    });

    it("renders correct details for dm", () => {
      render(<Contact chat={dmChat} curUserUid={"user1"} />);

      expect(screen.getByTestId("userImgDm")).toBeInTheDocument();
      expect(screen.queryByTestId("userImgGroup")).not.toBeInTheDocument();
      expect(screen.getByTestId("contactName")).toHaveTextContent("Alpha");
      expect(screen.getByTestId("lastMsgDate")).toBeInTheDocument();
      expect(screen.getByTestId("lastMsg")).toBeInTheDocument();
    });

    it("renders correct details for group", () => {
      render(<Contact chat={groupChat} curUserUid={"user1"} />);

      expect(screen.queryByTestId("userImgDm")).not.toBeInTheDocument();
      expect(screen.getByTestId("userImgGroup")).toBeInTheDocument();
      expect(screen.getByTestId("contactName")).toHaveTextContent(
        groupChat.groupName
      );
      expect(screen.getByTestId("lastMsgDate")).toBeInTheDocument();
      expect(screen.getByTestId("lastMsg")).toBeInTheDocument();
    });
  });

  describe("When contact is a guest in a dm", () => {
    beforeEach(() => {
      render(<Contact chat={dmChatWithGuest} curUserUid={"user1"} />);
    });

    it("renders guest id with the name", () => {
      screen.debug();

      const name = screen.getByTestId("contactName");
      expect(name).toBeInTheDocument();
      expect(name).toHaveTextContent("Beta #rr44");
    });
  });

  describe("How it renders lastMsg",()=>{
    it("if last message was from current user should be (You: msg)",()=>{
        render(<Contact chat={dmChatWithGuest} curUserUid={"user1"}/>)

        expect(screen.getByTestId("lastMsg")).toHaveTextContent("You: "+dmChatWithGuest.lastMessage)
    });

    it("if last message was from the contact should be (contactName: msg)",()=>{
        render(<Contact chat={dmChat} curUserUid={"user1"}/>)

        expect(screen.getByTestId("lastMsg")).toHaveTextContent(dmChat.lastMessageSenderDisplayName+": "+dmChat.lastMessage)
    });
  });
});
