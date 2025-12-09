import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, render } from "@testing-library/react";
import AddGroup from "../AddGroup";
import userEvent from "@testing-library/user-event";

const dmChat = {
  isGroupChat: false,
  createdAt: "timestamp",
  enrichedParticipants: [
    {
      uid: "userA", // current user
      email: "me@example.com",
      displayName: "Me",
      isAnonymous: false,
    },
    {
      uid: "userB",
      email: null,
      displayName: "John Doe",
      isAnonymous: true,
      guestId: "12345",
    },
  ],
};
const groupChat = {
  isGroupChat: true,
  groupName: "Friends Group",
  adminUids: ["userA"],
  createdAt: "timestamp",
  groupProfileURL: null,
  enrichedParticipants: [
    {
      uid: "userA", // current user
      email: "me@example.com",
      displayName: "Me",
      isAnonymous: false,
    },
    {
      uid: "userC",
      email: "sarah@example.com",
      displayName: "Sarah Connor",
      isAnonymous: false,
    },
    {
      uid: "guest123",
      email: null,
      displayName: "Guest User",
      isAnonymous: true,
      guestId: "1234",
    },
  ],
};

const chats = [dmChat, groupChat];

const mockSetShowAddGroup = vi.fn();

const fakeMe = {
  uid: "userA", // current user
  email: "me@example.com",
  displayName: "Me",
  isAnonymous: false,
};

vi.mock("../../../../util/context/authContext", () => {
  return {
    useAuthContext: () => ({ user: fakeMe }),
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

    it("render disabled next button by default", () => {
      expect(screen.getByTestId("NextBtn")).toHaveAttribute("disabled");
    });

    it("render enabled next button When there is a selected contact", async () => {
      const user = userEvent.setup();

      await user.click(screen.getByTestId("addContactToGroup"));

      expect(screen.getByTestId("NextBtn")).not.toHaveAttribute("disabled");
    });

    it("remove current user from contacts", () => {
      expect(screen.getByTestId("contactName")).not.toHaveTextContent(
        fakeMe.displayName
      );
    });

    it("remove groups from contacts", () => {
      expect(screen.queryByText("Sarah Connor")).not.toBeInTheDocument();
      expect(screen.queryByText("Guest User#1234")).not.toBeInTheDocument();
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

    it("remove all the selected contacts", async () => {
      const user = userEvent.setup();

      await user.click(screen.getByTestId("addContactToGroup"));
      expect(screen.getByTestId("selectedWrapper")).toBeInTheDocument();
      await user.click(screen.getByTestId("closeBtn"));
      expect(screen.queryByTestId("selectedWrapper")).not.toBeInTheDocument();
    });
  });

  describe("When showAddGroup set to false", () => {
    beforeEach(() => {
      render(
        <AddGroup
          chats={chats}
          showAddGroup={false}
          setShowAddGroup={() => {}}
        />
      );
    });

    it("has inert attribute", () => {
      expect(screen.getByTestId("AddGroupWrapper")).toHaveAttribute("inert");
    });
  });

  describe("When showAddGroup set to true", () => {
    beforeEach(() => {
      render(
        <AddGroup
          chats={chats}
          showAddGroup={true}
          setShowAddGroup={() => {}}
        />
      );
    });

    it("doesn`t have  inert attribute", () => {
      expect(screen.getByTestId("AddGroupWrapper")).not.toHaveAttribute(
        "inert"
      );
    });
  });

  describe("When searching", () => {
    beforeEach(() => {
      render(
        <AddGroup
          chats={chats}
          showAddGroup={true}
          setShowAddGroup={() => {}}
        />
      );
    });

    it("shows contacts that has the search term", async () => {
      const user = userEvent.setup();

      await user.type(
        screen.getByRole("textbox", { name: "Search for contacts" }),
        "John"
      );

      expect(
        screen.getByText((content) => {
          const hasText = (text) => content.includes(text);
          return hasText("John Doe");
        })
      ).toBeInTheDocument();
    });

    it("doesn`t care about lower or upper case",async()=>{
      const user = userEvent.setup();

      await user.type(
        screen.getByRole("textbox", { name: "Search for contacts" }),
        "doe"
      );

      expect(
        screen.getByText((content) => {
          const hasText = (text) => content.includes(text);
          return hasText("John Doe");
        })
      ).toBeInTheDocument();
    });

    it("doesn`t show contacts that don`t have the search term", async () => {
      const user = userEvent.setup();

      await user.type(
        screen.getByRole("textbox", { name: "Search for contacts" }),
        "bebe"
      );

      expect(
        screen.queryByText((content) => {
          const hasText = (text) => content.includes(text);
          return hasText("John Doe");
        })
      ).not.toBeInTheDocument();
    });

  });
});
