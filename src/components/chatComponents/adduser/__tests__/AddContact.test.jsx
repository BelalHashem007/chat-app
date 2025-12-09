import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, render } from "@testing-library/react";
import AddContact from "../AddContact";
import userEvent from "@testing-library/user-event";
import ToastProvider from "../../toast/ToastProvider";

const fakeUser = { uid: 123, displayName: "Ahmed", email: "ahmed@test.com" };

const fakeSearchResults = [fakeUser];

const mockUseDebouncedSearch = vi.fn(() => ({
  results: fakeSearchResults,
  noResult: false,
}));

vi.mock("../../../../util/hooks/useDebouncedSearch", () => {
  return {
    default: () => mockUseDebouncedSearch(),
  };
});

vi.mock("../../../../util/context/authContext", () => {
  return {
    useAuthContext: () => ({ user: fakeUser }),
  };
});

const mockCreateNewChatRoom = vi.fn(() => ({
  isChatCreated: true,
  error: null,
}));

vi.mock("../../../../firebase/firebase_db/database", () => {
  return {
    createNewChatRoom: (...args) => mockCreateNewChatRoom(...args),
  };
});

describe("AddContact Component", () => {
  describe("Rendering", () => {
    beforeEach(() => {
      render(
        <AddContact setShowAddContact={() => {}} showAddContact={true} />
      );
    });

    it("renders back button", () => {
      expect(screen.getByRole("button", { name: "back" })).toBeInTheDocument();
    });

    it("renders heading and a place to put the results in", () => {
      expect(screen.getByRole("heading")).toBeInTheDocument();
      expect(screen.getByTestId("resultWrapper")).toBeInTheDocument();
    });

    it("render searchBar",()=>{
        expect(screen.getByRole("searchbox",{name:"Search contacts"})).toBeInTheDocument();
    });

    it("renders results if it exists", () => {
      expect(screen.getByText("ahmed@test.com")).toBeInTheDocument();
      expect(screen.getByTestId("userPic")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
    });

    
  });

  describe("when clicking add button", () => {
    beforeEach(async () => {
      render(
        <ToastProvider>
          <AddContact setShowAddContact={() => {}} showAddContact={true} />
        </ToastProvider>
      );
      const user = userEvent.setup();
      const searchInp = screen.getByRole("searchbox", {
        name: "Search contacts",
      });

      await user.type(searchInp, "ahmed");
    });

    it("empty search input",async()=>{
        expect(screen.getByRole("searchbox", {name: "Search contacts",})).toHaveValue("ahmed");

        const user = userEvent.setup();
        await user.click(screen.getByRole("button", { name: "Add" }));

        expect(screen.getByRole("searchbox", {name: "Search contacts",})).toHaveValue("");
    });

    it("calls createNewChatRoom with correct arguments",async()=>{
        const user = userEvent.setup();

        await user.click(screen.getByRole("button",{name:"Add"}));

        expect(mockCreateNewChatRoom).toHaveBeenCalledExactlyOnceWith(fakeUser,[fakeUser,fakeUser],false);
    })
  });

  describe("when adding a contact is successfull", () => {
    beforeEach(async () => {
      render(
        <ToastProvider>
          <AddContact setShowAddContact={() => {}} showAddContact={true} />
        </ToastProvider>
      );
      const user = userEvent.setup();
      const addBtn = screen.getByRole("button", { name: "Add" });

      await user.click(addBtn);
    });

    it("shows successMessage", () => {
      expect(screen.getByTestId("successMessage")).toBeInTheDocument();
    });
  });

  describe("when adding a contact fails", () => {
    beforeEach(async () => {
      render(
        <ToastProvider>
          <AddContact setShowAddContact={() => {}} showAddContact={true} />
        </ToastProvider>
      );
      mockCreateNewChatRoom.mockResolvedValueOnce({
        isChatCreated: false,
        error: "test error",
      });

      const user = userEvent.setup();
      const addBtn = screen.getByRole("button", { name: "Add" });

      await user.click(addBtn);
    });

    it("shows failedMessage.", async () => {
      expect(screen.getByTestId("failedMessage")).toBeInTheDocument();
    });
  });

  describe("when back button is clicked", () => {
    it("calls setShowAddContact with (false) argument",async()=>{
        const mockSetShowAddContact = vi.fn()
        render(<AddContact setShowAddContact={mockSetShowAddContact} showAddContact={true}/>)

        const user = userEvent.setup();
        await user.click(screen.getByRole("button",{name:"back"}));

        expect(mockSetShowAddContact).toHaveBeenCalledExactlyOnceWith(false);
    });
  });
});
