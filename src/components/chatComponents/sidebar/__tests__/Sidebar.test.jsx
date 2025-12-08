import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Sidebar from "../Sidebar";
import { createMemoryRouter, RouterProvider } from "react-router";
import userEvent from "@testing-library/user-event";

const mockSetActiveComponent = vi.fn();

const mockLogOut = vi.fn(() => true);

vi.mock("../../../../firebase/firebase_auth/authentication", async () => {
  const actual = vi.importActual(
    "../../../../firebase/firebase_auth/authentication"
  );
  return {
    ...actual,
    LogOut: () => mockLogOut(),
  };
});

const mockNavigate = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockUseToastContext = vi.fn();

vi.mock("../../../../util/context/toastContext", () => {
  return {
    useToastContext: () => ({
      showToast: (...args) => mockUseToastContext(...args),
    }),
  };
});

const testRoutes = [
  {
    path: "/chat",
    element: <Sidebar setActiveComponent={mockSetActiveComponent} />,
  },
  {
    path: "/login",
    element: <h1>This is login page!</h1>,
  },
];

describe("Sidebar Component", () => {
  beforeEach(() => {
    const router = createMemoryRouter(testRoutes, {
      initialEntries: ["/chat"],
    });
    render(<RouterProvider router={router} />);
  });

  describe("Renders correctly", () => {
    it("renders Chats", () => {
      expect(screen.getByRole("listitem", { name: "Chats" }));
    });

    it("renders Profile", () => {
      expect(screen.getByRole("listitem", { name: "Profile" }));
    });

    it("renders log out button", () => {
      expect(screen.getByRole("listitem", { name: "Log out" }));
    });
  });

  describe("Calls setActiveComponent correctly", () => {
    it("calls setActiveComponent with correct value when chats is clicked", async () => {
      const user = userEvent.setup();
      const chatBtn = screen.getByTestId("chatsBtn");

      await user.click(chatBtn);

      expect(mockSetActiveComponent).toHaveBeenCalledExactlyOnceWith(
        "contactList"
      );
    });

    it("calls setActiveComponent with correct value when profile is clicked", async () => {
      const user = userEvent.setup();
      const profileBtn = screen.getByTestId("profileBtn");

      await user.click(profileBtn);

      expect(mockSetActiveComponent).toHaveBeenCalledExactlyOnceWith("profile");
    });
  });

  describe("Logout button", () => {
    it("Calls logOut when clicked", async () => {
      const user = userEvent.setup();
      const logoutBtn = screen.getByTestId("logoutBtn");

      await user.click(logoutBtn);

      expect(mockLogOut).toHaveBeenCalledOnce();
    });

    it("if logOut success calls navigate with /login", async () => {
      const user = userEvent.setup();
      const logoutBtn = screen.getByTestId("logoutBtn");

      await user.click(logoutBtn);

      expect(mockNavigate).toHaveBeenCalledExactlyOnceWith("/login");
    });

    it("if logOut fails show error message", async () => {
      mockLogOut.mockResolvedValueOnce(false);

      const user = userEvent.setup();
      const logoutBtn = screen.getByTestId("logoutBtn");

      await user.click(logoutBtn);

      expect(mockUseToastContext).toHaveBeenCalledExactlyOnceWith(
        <p>Sign out failed!</p>
      );
    });
  });
});
