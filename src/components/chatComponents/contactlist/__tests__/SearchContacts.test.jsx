import { describe, it, expect, beforeEach,vi } from "vitest";
import { screen, render } from "@testing-library/react";
import SearchContacts from "../SearchContacts";
import userEvent from "@testing-library/user-event";

const currentUser = {
  uid: "u1",
  displayName: "Belal"
};
const chats = [
  // -------- DM 1 --------
  {
    chatId: "chat_dm_1",
    isGroupChat: false,
    enrichedParticipants: [
      {
        uid: "u1",
        displayName: "Belal" // current user
      },
      {
        uid: "u2",
        displayName: "Ahmed"
      }
    ]
  },

  // -------- DM 2 --------
  {
    chatId: "chat_dm_2",
    isGroupChat: false,
    enrichedParticipants: [
      {
        uid: "u1",
        displayName: "Belal" // current user
      },
      {
        uid: "u3",
        displayName: "Sara"
      }
    ]
  },

  // -------- GROUP CHAT --------
  {
    chatId: "chat_group_1",
    isGroupChat: true,
    groupName: "Friends Group",
    enrichedParticipants: [
      {
        uid: "u1",
        displayName: "Belal" // current user
      },
      {
        uid: "u4",
        displayName: "Mohamed"
      },
      {
        uid: "u5",
        displayName: "Laila"
      }
    ]
  }
];


vi.mock("../../../../util/context/authContext",()=>{
  return {
    useAuthContext: ()=>({user:currentUser})
  }
})

describe("SearchContacts Component", () => {
  describe("Rendering", () => {
    const mockSetActiveChats = vi.fn();
    beforeEach(() => {
      render(<SearchContacts chats={chats} setActiveChats={mockSetActiveChats} />);
    });

    it("renders accessible textbox",()=>{
        expect(screen.getByRole("textbox",{name:"Search contacts"}));
    });

    it("calls setActiveChats with all the chats at first render",()=>{
      expect(mockSetActiveChats).toHaveBeenCalledExactlyOnceWith(chats)
    })
  });

  describe("When user type in the textbox",()=>{
    const mockSetActiveChats = vi.fn();
    beforeEach(()=>{
      render(<SearchContacts chats={chats} setActiveChats={mockSetActiveChats} />);
    });

    it("filters by displayName correctly for DMs chats",async()=>{
      const user = userEvent.setup();

      await user.type(screen.getByRole("textbox",{name:"Search contacts"}),"Ahmed");
      expect(mockSetActiveChats).toHaveBeenLastCalledWith([chats[0]]);
    });

    it("doesn`t care about lower/upper case",async()=>{
      const user = userEvent.setup();

      await user.type(screen.getByRole("textbox",{name:"Search contacts"}),"sara");
      expect(mockSetActiveChats).toHaveBeenLastCalledWith([chats[1]]);
    });

    it("filters by groupName correctly for group chats",async()=>{
      const user = userEvent.setup();

      await user.type(screen.getByRole("textbox",{name:"Search contacts"}),"friends");
      expect(mockSetActiveChats).toHaveBeenLastCalledWith([chats[2]])
    });

    it("reset all chats when making the input empty",async()=>{
      const user = userEvent.setup();

      await user.type(screen.getByRole("textbox",{name:"Search contacts"}),"friends");
      expect(mockSetActiveChats).toHaveBeenLastCalledWith([chats[2]]);

      await user.clear(screen.getByRole("textbox",{name:"Search contacts"}));
      expect(mockSetActiveChats).toHaveBeenLastCalledWith(chats);
    });
  })

});
