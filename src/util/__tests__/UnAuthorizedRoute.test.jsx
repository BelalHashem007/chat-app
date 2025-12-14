import { describe,it,expect,vi,beforeEach } from "vitest";
import { screen,render } from "@testing-library/react";
import UnAuthorizedRoute from "../UnAuthorizedRoute"

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

describe("UnAuthorizedRoute Component", () => {
  describe("When auth is loading", () => {
    beforeEach(() => {
      mockUseAuthContext.mockReturnValue({
        loading: true,
        isAuthenticated: null,
      });
      render(
        <UnAuthorizedRoute>
          <FakeComponent />
        </UnAuthorizedRoute>
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
        <UnAuthorizedRoute>
          <FakeComponent />
        </UnAuthorizedRoute>
      );
    });

    it("navigates to /chat", () => {
      expect(mockNavigate).toHaveBeenCalledExactlyOnceWith("/chat");
    });
  });

  describe("When auth is false", () => {
    beforeEach(() => {
      mockUseAuthContext.mockReturnValue({
        loading: null,
        isAuthenticated: false,
      });
      render(
        <UnAuthorizedRoute>
          <FakeComponent />
        </UnAuthorizedRoute>
      );
    });

    it("renders children", () => {
      expect(screen.queryByTestId("fakeChild")).toBeInTheDocument();
    });
  });
});
