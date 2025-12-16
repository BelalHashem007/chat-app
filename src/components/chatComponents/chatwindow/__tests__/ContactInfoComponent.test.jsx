import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, render } from "@testing-library/react";
import ContactInfoComponent from "../ContactInfoComponent";

const fakeDMChat = {
  id: "123",
  isGroupChat: false,
};

const fakeContact = {
  displayName: "Ahmed",
};

const fakeGuestContact = {
  displayName: "Laila",
  isAnonymous: true,
  guestId: "rr44",
};

const fakeGroupChat = {
  id: "1234",
  isGroupChat: true,
  groupName: "test",
  enrichedParticipants: [
    { uid: "11", displayName: "Test" },
    { uid: "22", displayName: "Ola" },
  ],
};

vi.mock("../../../../util/context/authContext",()=>{
  return {
    useAuthContext:()=>({user:{uid:"55"}})
  }
})

describe("ContactInfoComponent", () => {
  describe("Rendering", () => {
    it("renders nothing when there is no contact AND the chat is not group chat", () => {
      render(<ContactInfoComponent contact={null} selectedChat={null} />);
      expect(
        screen.queryByTestId("contactInfoWrapper")
      ).not.toBeInTheDocument();
    });

    describe("When chat is DM", () => {
      it("renders contact details correctly", () => {
        render(
          <ContactInfoComponent
            contact={fakeContact}
            selectedChat={fakeDMChat}
            contactOnlineStatus={{ state: "offline" }}
          />
        );
        expect(screen.getByTestId("contactImg")).toBeInTheDocument();
        expect(screen.getByTestId("contactName")).toHaveTextContent(
          fakeContact.displayName
        );
        expect(screen.getByTestId("contactStatus")).toBeInTheDocument();
      });

      it("renders contact guestid if contact is a guest", () => {
        render(
          <ContactInfoComponent
            contact={fakeGuestContact}
            selectedChat={fakeDMChat}
            contactOnlineStatus={{ state: "offline" }}
          />
        );
        expect(screen.getByTestId("contactName")).toHaveTextContent(
          fakeGuestContact.displayName + "#" + fakeGuestContact.guestId
        );
      });
    });

    describe("When chat is GROUP", () => {
      beforeEach(() => {
        render(
          <ContactInfoComponent contact={null} selectedChat={fakeGroupChat} />
        );
      });
      it("renders correct group details", () => {
        expect(screen.getByTestId("groupImg")).toBeInTheDocument();
        expect(screen.getByTestId("contactName")).toHaveTextContent(
          fakeGroupChat.groupName
        );
        expect(screen.getByText(fakeGroupChat.enrichedParticipants[0].displayName)).toBeInTheDocument();
      });

      it("doesn`t render status", () => {
        expect(screen.queryByTestId("contactStatus")).not.toBeInTheDocument();
      });
    });
  });
});
