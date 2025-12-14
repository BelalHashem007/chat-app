import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, render } from "@testing-library/react";
import ContactList from "../ContactList";
import userEvent from "@testing-library/user-event";

const fakeCurrentUser = {
  uid: 123,
  displayName: "Belal",
};

const fakeChats = [{ id: 1 }, { id: 2 }, { id: 3 }];

vi.mock("../../../util/context/authContext", () => {
  return {
    useAuthContext: () => ({ user: fakeCurrentUser }),
  };
});

vi.mock("../../../components/chatComponents/contactlist/Contact",()=>{
    return {default:()=>{}}
})

vi.mock("../../../components/chatComponents/addGroup/AddGroup",()=>{
    return {default:()=>{}}
})

describe("ContactList Component", () => {
  describe("When clicking on a chat", () => {
    const mockSetSelectedChat = vi.fn();
    beforeEach(async() => {
      render(
        <ContactList
          selectedChat={null}
          setSelectedChat={mockSetSelectedChat}
          chats={fakeChats}
          activeChats={fakeChats}
          setActiveChats={() => {}}
        />
      );

      const user = userEvent.setup()

      await user.click(screen.getAllByRole("listitem",{name:"contact"})[0]);
    });

    it("calls setSelectedChat with the clicked chat",()=>{
        expect(mockSetSelectedChat).toHaveBeenCalledExactlyOnceWith(fakeChats[0]);
    })
  });
});
