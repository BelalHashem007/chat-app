import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignupForm } from "../Signup";

describe("SignupFrom Component", () => {
  it("renders correct form", () => {
    render(
      <SignupForm onSubmit={() => {}} error={null} disableBtn={false} />
    );

    const email = screen.getByRole("textbox", { name: "Email" });
    const pass = screen.getByLabelText("Password");
    const confirmPass = screen.getByLabelText("Confirm Password");
    const button = screen.getByRole("button", { name: "Create account" });

    expect(email).toBeInTheDocument();
    expect(pass).toBeInTheDocument();
    expect(confirmPass).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it("create account button calls the handler when clicked", async () => {
    const submitForm = vi.fn(() => {});
    render(
      <SignupForm onSubmit={submitForm} error={null} disableBtn={false} />
    );

    const user = userEvent.setup();
    const button = screen.getByRole("button", { name: "Create account" });

    await user.type(screen.getByLabelText("Email"), "belal.hashem@gmail.com");
    await user.type(screen.getByLabelText("Password"), "123456");
    await user.type(screen.getByLabelText("Confirm Password"), "123456");

    await user.click(button);

    expect(submitForm).toHaveBeenCalledOnce();
  });

  it("shows the content of the error message when its there", () => {
    const error = "This error test";
    render(<SignupForm onSubmit={() => {}} error={error} disableBtn={false} />);

    const erorrMsg = screen.getByText(error);

    expect(erorrMsg).toBeInTheDocument();
  });

  it("create account button is diabled when prop is true and shows (Creating account...) text", () => {
    render(<SignupForm onSubmit={() => {}} error={null} disableBtn={true} />);

    const button = screen.getByRole("button");

    expect(button).toBeDisabled();
    expect(button).toHaveTextContent("Creating account...");
  });

  it("Form passes correct data to onSumbit handler", async () => {
    const submitForm = vi.fn((e) => {
      e.preventDefault();
    });
    render(
      <SignupForm onSubmit={submitForm} error={null} disableBtn={false} />
    );

    const user = userEvent.setup();
    const button = screen.getByRole("button", { name: "Create account" });

    const testData = {
      mail: "test@example.com",
      password: "securepassword",
      confirmPassword: "securepassword",
    };

    await user.type(screen.getByLabelText("Email"), testData.mail);
    await user.type(screen.getByLabelText("Password"), testData.password);
    await user.type(
      screen.getByLabelText("Confirm Password"),
      testData.confirmPassword
    );

    await user.click(button);

    expect(submitForm).toHaveBeenCalledOnce();

    const formEvent = submitForm.mock.calls[0][0];
    const formData = new FormData(formEvent.target);
    const data = Object.fromEntries(formData.entries());

    expect(data).toEqual(testData);
  });
});
