import { describe, it, expect, vi } from "vitest";
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

const mockSignin = vi.fn((email) =>
  Promise.resolve({ user: email, error: null })
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
    signIn: (email) => mockSignin(email),
  };
});

const mockStoreNewUserProfile= vi.fn();

vi.mock("../../../firebase/firebase_db/database", async ()=>{
    const actual = await vi.importActual("../../../firebase/firebase_db/database");
    return {
        ...actual,
        storeNewUserProfile: async ()=>mockStoreNewUserProfile(),
    }
})

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
  describe("Login button", () => {
    it("on submit, read form data call sign in function and navigate to chat if successful", async () => {
      const router = createMemoryRouter(testRoute, {
        initialEntries: ["/login"],
      });

      render(<RouterProvider router={router} />);

      const user = userEvent.setup();
      const button = screen.getByRole("button", { name: "Log in" });

      await user.type(screen.getByLabelText("Email"), "belal.hashem@gmail.com");
      await user.type(screen.getByLabelText("Password"), "123456");
      await user.click(button);

      expect(mockSignin).toHaveBeenCalledOnce();
      expect(mockNavigate).toHaveBeenCalledWith("/chat");
    });

    it("on submit, display error if login is unsuccessful", async () => {
      mockSignin.mockResolvedValue({ user: null, error: "This is error" });

      const router = createMemoryRouter(testRoute, {
        initialEntries: ["/login"],
      });

      render(<RouterProvider router={router} />);

      const user = userEvent.setup();
      const button = screen.getByRole("button", { name: "Log in" });

      await user.type(screen.getByLabelText("Email"), "belal.hashem@gmail.com");
      await user.type(screen.getByLabelText("Password"), "123456");
      await user.click(button);

      const errorDiv = await screen.findByText("This is error");

      expect(mockSignin).toHaveBeenCalledOnce();
      expect(errorDiv).toBeInTheDocument();
    });
  });

  describe("Guest button", () => {
    it("on guest submit sucess, navigate to chat and store the user details", async () => {
      const router = createMemoryRouter(testRoute, {
        initialEntries: ["/login"],
      });

      render(<RouterProvider router={router} />);

      const user = userEvent.setup();
      const button = screen.getByTestId("guestBtn");

      await user.click(button);

      expect(mockGuestSignin).toHaveBeenCalledOnce();
      expect(mockStoreNewUserProfile).toHaveBeenCalledOnce();
    });

    it("on guest submit failure, show error message", async () => {
        mockGuestSignin.mockResolvedValueOnce({user:null,error:"error Test"})

      const router = createMemoryRouter(testRoute, {
        initialEntries: ["/login"],
      });

      render(<RouterProvider router={router} />);

      const user = userEvent.setup();
      const button = screen.getByTestId("guestBtn");

      await user.click(button);

      const errorDiv = await screen.findByText("error Test");

      expect(mockGuestSignin).toHaveBeenCalledOnce();
      expect(mockStoreNewUserProfile).not.toHaveBeenCalledOnce();
      expect(errorDiv).toBeInTheDocument();
    });
  });
});
