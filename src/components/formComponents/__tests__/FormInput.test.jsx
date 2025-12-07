import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FormInput from "../FormInput";

describe("Form Input", () => {
  const mockInput = {
    name: "testInput",
    label: "testLabel",
    type: "text",
    autoComplete: "off",
  };

  it("input has correct attributes if provided",()=>{
    render(<FormInput {...mockInput}/>)
    const input = screen.getByRole("textbox");
    

    expect(input).toHaveAttribute("autoComplete",mockInput.autoComplete);
    expect(input).toHaveAttribute("type",mockInput.type);
    expect(input).toHaveAttribute("name",mockInput.name);
    
  });

  it("label has correct attributes if provided",()=>{
    render(<FormInput {...mockInput}/>)
    const label = screen.getByText(mockInput.label);

    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute("for",mockInput.name)
  })

});
