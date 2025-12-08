import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../Login";
import { createMemoryRouter, RouterProvider } from "react-router";

const mockNavigate = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockSignin = vi.fn((email, pass) =>
  Promise.resolve({ user: { email, pass }, error: null })
);

const mockGuestSignin = vi.fn(() =>
  Promise.resolve({ user: "blah", error: null })
);

vi.mock("../../../firebase/firebase_auth/authentication", async () => {
  const actual = await vi.importActual(
    "../../../firebase/firebase_auth/authentication"
  );
  return {
    ...actual,
    guestSignIn: () => mockGuestSignin(),
    signIn: (email, pass) => mockSignin(email, pass),
  };
});

const mockStoreNewUserProfile = vi.fn();

vi.mock("../../../firebase/firebase_db/database", async () => {
  const actual = await vi.importActual(
    "../../../firebase/firebase_db/database"
  );
  return {
    ...actual,
    storeNewUserProfile: async () => mockStoreNewUserProfile(),
  };
});

const testRoute = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/chat",
    element: <h1>Welcome to chat!</h1>,
  },
];

describe("Login Component", () => {
  beforeEach(() => {
    const router = createMemoryRouter(testRoute, {
      initialEntries: ["/login"],
    });

    render(<RouterProvider router={router} />);
  });

  describe("Login button", () => {
    beforeEach(async () => {});

    it("on submit, Read form data. Call sign in function and navigate to chat if successful.", async () => {
      const user = userEvent.setup();
      const button = screen.getByRole("button", { name: "Log in" });

      await user.type(screen.getByLabelText("Email"), "belal.hashem@gmail.com");
      await user.type(screen.getByLabelText("Password"), "123456aa");
      await user.click(button);

      expect(mockSignin).toHaveBeenCalledOnce();
      expect(mockNavigate).toHaveBeenCalledWith("/chat");
      expect(mockSignin).toHaveBeenCalledExactlyOnceWith(
        "belal.hashem@gmail.com",
        "123456aa"
      );
    });

    it("on submit, display error if login is unsuccessful", async () => {
      mockSignin.mockResolvedValueOnce({ user: null, error: "This is error" });

      const user = userEvent.setup();
      const button = screen.getByRole("button", { name: "Log in" });

      await user.type(screen.getByLabelText("Email"), "belal.hashem@gmail.com");
      await user.type(screen.getByLabelText("Password"), "123456aa");
      await user.click(button);

      const errorDiv = await screen.findByText("This is error");

      expect(mockSignin).toHaveBeenCalledOnce();
      expect(errorDiv).toBeInTheDocument();
    });
  });

  describe("Guest button", () => {
    it("on guest submit sucess, navigate to chat and store the user details", async () => {
      const user = userEvent.setup();
      const button = screen.getByTestId("guestBtn");

      await user.click(button);

      expect(mockGuestSignin).toHaveBeenCalledOnce();
      expect(mockStoreNewUserProfile).toHaveBeenCalledOnce();
      expect(mockNavigate).toHaveBeenCalledWith("/chat");
    });

    it("on guest submit failure, show error message", async () => {
      mockGuestSignin.mockResolvedValueOnce({
        user: null,
        error: "error Test",
      });

      const user = userEvent.setup();
      const button = screen.getByTestId("guestBtn");

      await user.click(button);

      const errorDiv = await screen.findByText("error Test");

      expect(mockGuestSignin).toHaveBeenCalledOnce();
      expect(mockStoreNewUserProfile).not.toHaveBeenCalled();
      expect(errorDiv).toBeInTheDocument();
    });
  });
});
