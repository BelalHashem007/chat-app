import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, render } from "@testing-library/react";
import ToastProvider from "../ToastProvider";
import { act } from "react";

const mockToastContext = vi.fn();

vi.mock("../../../../util/context/toastContext", () => {
  return {
    ToastContext: ({ value, children }) => {
      mockToastContext(value);
      return <>{children}</>;
    },
  };
});

describe("ToastProvider Component", () => {
  beforeEach(()=>{
    vi.useFakeTimers()
  })
  it("renders children component", () => {
    render(
      <ToastProvider>
        {" "}
        <p>this is child</p>
      </ToastProvider>
    );

    expect(screen.getByText("this is child")).toBeInTheDocument();
  });

  it("renders a message on the screen when passed the message via showToast and disappers after a timeout", async () => {
    
    render(<ToastProvider />);

    const { showToast } = mockToastContext.mock.calls[0][0];
    const message = "Show this message";
    const duration = 5000;

    act(()=>showToast(message,duration))
 

    expect(screen.getByText(message)).toBeInTheDocument();

    
    act(()=>vi.advanceTimersByTime(5000))
    

   expect(screen.queryByText(message)).not.toBeInTheDocument()
  });
});
