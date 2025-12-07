import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FormButton from "../FormButton";

describe("Form Button", () => {
  const mockButton = { text: "This is a test", type: "submit", disableBtn: false };

  it("button renders with text, type and disabled status if provided", () => {
    render(<FormButton {...mockButton} />);
    const button = screen.getByRole("button");

    expect(button).toHaveTextContent(mockButton.text);
    expect(button).not.toBeDisabled();
    expect(button).toHaveAttribute("type",mockButton.type);
  });
});
