import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, render } from "@testing-library/react";
import ProtectedRoute from "../ProtectedRoute";

const mockUseAuthContext = vi.fn();

const FakeComponent = () => <div data-testid="fakeChild"></div>;

vi.mock("../context/authContext", () => {
  return {
    useAuthContext: () => mockUseAuthContext(),
  };
});

const mockNavigate= vi.fn();

vi.mock("react-router",async()=>{
    const actual = await vi.importActual("react-router");

    return {
        ...actual,
        Navigate: ({to})=>mockNavigate(to)
    }
})

describe("ProtectedRoute Component", () => {
  describe("When auth is loading", () => {
    beforeEach(() => {
      mockUseAuthContext.mockReturnValue({
        loading: true,
        isAuthenticated: null,
      });
      render(
        <ProtectedRoute>
          <FakeComponent />
        </ProtectedRoute>
      );
    });

    it("renders nothing", () => {
      expect(screen.queryByTestId("fakeChild")).not.toBeInTheDocument();
    });
  });

  describe("When auth is true", () => {
    beforeEach(() => {
      mockUseAuthContext.mockReturnValue({
        loading: false,
        isAuthenticated: true,
      });
      render(
        <ProtectedRoute>
          <FakeComponent />
        </ProtectedRoute>
      );
    });

    it("renders children", () => {
      expect(screen.queryByTestId("fakeChild")).toBeInTheDocument();
    });
  });

  describe("When auth is false", () => {
    beforeEach(() => {
      mockUseAuthContext.mockReturnValue({
        loading: null,
        isAuthenticated: false,
      });
      render(
        <ProtectedRoute>
          <FakeComponent />
        </ProtectedRoute>
      );
    });

    it("navigates to login page", () => {
      expect(mockNavigate).toHaveBeenCalledExactlyOnceWith("/login");
    });
  });
});
