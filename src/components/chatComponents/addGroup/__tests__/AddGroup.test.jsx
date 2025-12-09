import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, render } from "@testing-library/react";
import AddGroup from "../AddGroup";
import userEvent from "@testing-library/user-event";

const chats = [
  {
    id: "eadYxALFf4xLpy14KwbJ",
    lastMessageSenderUid: "",
    allTimeParticipantsUids: [
      "rkJSNbx0pNMQHU3F8m3sJAYzEb42",
      "MI8GsONcU3VUiCMjuW30MB1JtS42",
    ],
    lastMessage: "",
    activeParticipantsUids: [
      "rkJSNbx0pNMQHU3F8m3sJAYzEb42",
      "MI8GsONcU3VUiCMjuW30MB1JtS42",
    ],
    isGroupChat: false,
    createdAt: {
      type: "firestore/timestamp/1.0",
      seconds: 1765290601,
      nanoseconds: 217000000,
    },
    lastMessageDate: null,
    lastMessageSenderDisplayName: "",
    enrichedParticipants: [
      {
        photoURL: null,
        email_lower: "belal.hashem.saleh@gmail.com",
        displayName: "Belal Hashem",
        lastActive: {
          type: "firestore/timestamp/1.0",
          seconds: 1764157375,
          nanoseconds: 648000000,
        },
        email: "belal.hashem.saleh@gmail.com",
        createdAt: {
          type: "firestore/timestamp/1.0",
          seconds: 1764157375,
          nanoseconds: 648000000,
        },
        uid: "rkJSNbx0pNMQHU3F8m3sJAYzEb42",
        updatedAt: {
          type: "firestore/timestamp/1.0",
          seconds: 1764418479,
          nanoseconds: 682000000,
        },
        isAnonymous: true,
        guestId: "rr44",
      },
      {
        uid: "333",
        displayName: "Unknown User",
      },
    ],
  },
];

const mockSetShowAddGroup = vi.fn();

const fakeUser = { uid: 333, displayName: "Ahmed", email: "ahmed@test.com" };

vi.mock("../../../../util/context/authContext", () => {
  return {
    useAuthContext: () => ({ user: fakeUser }),
  };
});

describe("AddGroup Component", () => {
  describe("Rendering", () => {
    beforeEach(() => {
      render(
        <AddGroup
          chats={chats}
          showAddGroup={true}
          setShowAddGroup={() => {}}
        />
      );
    });

    it("render back button", () => {
      expect(screen.getByRole("button", { name: "close" })).toBeInTheDocument();
    });

    it("render search bar", () => {
      expect(
        screen.getByRole("textbox", { name: "Search for contacts" })
      ).toBeInTheDocument();
    });

    it("render add group memebers", () => {
      expect(screen.getByText("Add group members:")).toBeInTheDocument();
    });

    it("render contact details if there is a contact", () => {
      expect(screen.getByTestId("contactImg")).toBeInTheDocument();
      expect(screen.getByTestId("contactName")).toBeInTheDocument();
    });

    it("render guestid if contact is a guest", () => {
      expect(screen.getByTestId("guestId")).toBeInTheDocument();
    });
  });

  describe("When clicking a contact", () => {
    beforeEach(async () => {
      render(
        <AddGroup
          chats={chats}
          showAddGroup={true}
          setShowAddGroup={() => {}}
        />
      );

      const user = userEvent.setup();

      await user.click(screen.getByTestId("addContactToGroup"));
    });

    it("gets added to selectedContacts", () => {
      expect(screen.getByTestId("selectedWrapper")).toBeInTheDocument();
    });

    it("render selectedImg, selectedName, selectedRemoveBtn for each selected contact", () => {
      expect(screen.getByTestId("selectedImg")).toBeInTheDocument();
      expect(screen.getByTestId("selectedName")).toBeInTheDocument();
      expect(screen.getByTestId("selectedRemoveBtn")).toBeInTheDocument();
    });
  });

  describe("When clicking a selectedContactRemoveBtn", () => {
    beforeEach(async () => {
      render(
        <AddGroup
          chats={chats}
          showAddGroup={true}
          setShowAddGroup={() => {}}
        />
      );

      const user = userEvent.setup();

      await user.click(screen.getByTestId("addContactToGroup"));
    });

    it("gets removed from selectedContacts", async () => {
      const user = userEvent.setup();

      expect(screen.getByTestId("selectedWrapper")).toBeInTheDocument();
      await user.click(screen.getByTestId("selectedRemoveBtn"));
      expect(screen.queryByTestId("selectedWrapper")).not.toBeInTheDocument();
    });

    it("rerender the contact details", async () => {
      const user = userEvent.setup();

      expect(screen.queryByTestId("contactImg")).not.toBeInTheDocument();
      expect(screen.queryByTestId("contactName")).not.toBeInTheDocument();
      await user.click(screen.getByTestId("selectedRemoveBtn"));
      expect(screen.getByTestId("contactImg")).toBeInTheDocument();
      expect(screen.getByTestId("contactName")).toBeInTheDocument();
    });
  });

  describe("When clicking next", () => {
    beforeEach(async () => {
      render(
        <AddGroup
          chats={chats}
          showAddGroup={true}
          setShowAddGroup={() => {}}
        />
      );
      const user = userEvent.setup();

      await user.click(screen.getByTestId("addContactToGroup"));
      await user.click(screen.getByRole("button", { name: "Next" }));
    });

    it("renders OtherGroupOptions content", () => {
      expect(
        screen.getByRole("textbox", { name: "Group Name" })
      ).toBeInTheDocument();
    });
  });

  describe("When clicking close", () => {
    beforeEach(async () => {
      render(
        <AddGroup
          chats={chats}
          showAddGroup={true}
          setShowAddGroup={mockSetShowAddGroup}
        />
      );
    });

    it("calls setShowAddGroup with false", async () => {
      const user = userEvent.setup();

      await user.click(screen.getByTestId("closeBtn"));
      expect(mockSetShowAddGroup).toHaveBeenCalledExactlyOnceWith(false);
    });

    it("remove all the selected contacts",async()=>{
        const user = userEvent.setup();

        await user.click(screen.getByTestId("addContactToGroup"))
        expect(screen.getByTestId("selectedWrapper")).toBeInTheDocument();
        await user.click(screen.getByTestId("closeBtn"));
        expect(screen.queryByTestId("selectedWrapper")).not.toBeInTheDocument();
    })
  });

    describe("When showAddGroup set to false",()=>{
    beforeEach(()=>{
      render( <AddGroup
          chats={chats}
          showAddGroup={false}
          setShowAddGroup={()=>{}}
        />);
    });

    it("has inert attribute",()=>{
      expect(screen.getByTestId("AddGroupWrapper")).toHaveAttribute("inert")
    })
  })

  describe("When showAddGroup set to true",()=>{
    beforeEach(()=>{
      render( <AddGroup
          chats={chats}
          showAddGroup={true}
          setShowAddGroup={()=>{}}
        />);
    });

    it("doesn`t have  inert attribute",()=>{
      expect(screen.getByTestId("AddGroupWrapper")).not.toHaveAttribute("inert")
    })
  })
});
