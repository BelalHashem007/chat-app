import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Signup from "../Signup";
import { createMemoryRouter, RouterProvider } from "react-router";

const mockCreateUser = vi.fn((email,pass) =>
  Promise.resolve({ user: {email,pass}, error: null })
);

vi.mock("../../../firebase/firebase_auth/authentication", async () => {
  const actual = await vi.importActual(
    "../../../firebase/firebase_auth/authentication"
  );
  return {
    ...actual,
    createUser: (email,pass) => mockCreateUser(email,pass),
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

const mockStoreNewUserProfile = vi.fn();

vi.mock("../../../firebase/firebase_db/database", async () => {
  const actual = await vi.importActual(
    "../../../firebase/firebase_db/database"
  );

  return {
    ...actual,
    storeNewUserProfile: (...args) => mockStoreNewUserProfile(...args),
  };
});

const testRoute = [
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/chat",
    element: <h1>Welcome to chat!</h1>,
  },
];
describe("Signup Component", () => {
  beforeEach(() => {
    const router = createMemoryRouter(testRoute, {
      initialEntries: ["/signup"],
    });
    render(<RouterProvider router={router} />);
  });

  describe("Validation", () => {
    it("Validate that pass and confirm pass match", async () => {
      const user = userEvent.setup();
      const button = screen.getByRole("button", { name: "Create account" });

      await user.type(screen.getByLabelText("Email"), "test@test.com");
      await user.type(screen.getByLabelText("Password"), "22");
      await user.type(screen.getByLabelText("Confirm Password"), "11");

      await user.click(button);

      const errorDiv = await screen.findByText(
        "Password and Confirm Password don`t match"
      );

      expect(mockCreateUser).not.toHaveBeenCalled();
      expect(errorDiv).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("Validate that pass must be 6 characters at minimum.", async () => {
      const user = userEvent.setup();
      const button = screen.getByRole("button", { name: "Create account" });

      await user.type(screen.getByLabelText("Email"), "test@test.com");
      await user.type(screen.getByLabelText("Password"), "444a2");
      await user.type(screen.getByLabelText("Confirm Password"), "444a2");

      await user.click(button);

      const errorDiv = await screen.findByText(
        "Password Length must be at least 6 characters."
      );

      expect(mockCreateUser).not.toHaveBeenCalled();
      expect(errorDiv).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe("When submission is successful", () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      const button = screen.getByRole("button", { name: "Create account" });

      await user.type(screen.getByLabelText("Email"), "test@test.com");
      await user.type(screen.getByLabelText("Password"), "777aaa");
      await user.type(screen.getByLabelText("Confirm Password"), "777aaa");
      await user.click(button);
    });

    it("calls createUser", async () => {
      expect(mockCreateUser).toHaveBeenCalledOnce();
    });

    it("calls storeNewUserProfile", () => {
      expect(mockStoreNewUserProfile).toHaveBeenCalledOnce();
    });

    it("navigates to chat page", () => {
      expect(mockNavigate).toHaveBeenCalledExactlyOnceWith("/chat");
    });

    it("passes correct data to createUser", () => {
      expect(mockCreateUser).toHaveBeenCalledWith("test@test.com","777aaa");
    });

    it("passes correct data to storeNewUserProfile", () => {
      expect(mockStoreNewUserProfile).toHaveBeenCalledWith({email:"test@test.com",pass:"777aaa"});
    });

  });

  describe("When submission fails",()=>{
    beforeEach(async () => {
      mockCreateUser.mockResolvedValueOnce(Promise.resolve({ user: null, error: "testtt" }))
      const user = userEvent.setup();
      const button = screen.getByRole("button", { name: "Create account" });

      await user.type(screen.getByLabelText("Email"), "test@test.com");
      await user.type(screen.getByLabelText("Password"), "777aaa");
      await user.type(screen.getByLabelText("Confirm Password"), "777aaa");
      await user.click(button);
    });

    it("don`t call storeNewUserProfile",()=>{
      expect(mockStoreNewUserProfile).not.toHaveBeenCalledOnce();
    })

    it("show error message",()=>{
      expect(screen.getByText("testtt")).toBeInTheDocument();
    })

  })
});
