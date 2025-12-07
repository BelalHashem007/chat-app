import { describe,it,expect,vi } from "vitest";
import { render,screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "../Login";


describe("LoginFrom Component", () => {
    it("login button calls the handler when clicked", async () => {
      const submitForm = vi.fn(() => {});
      render(
        <LoginForm onSubmit={submitForm} error={null} disableLoginBtn={false} />
      );

      const user = userEvent.setup();
      const button = screen.getByRole("button", { name: "Log in" });

      await user.type(screen.getByLabelText("Email"), "belal.hashem@gmail.com");
      await user.type(screen.getByLabelText("Password"), "123456");


      await user.click(button);

      expect(submitForm).toHaveBeenCalledOnce();
    });

    it("submit handler not called when button is not clicked", async () => {
      const submitForm = vi.fn(() => {});
      render(
        <LoginForm onSubmit={submitForm} error={null} disableLoginBtn={false} />
      );

      expect(submitForm).not.toHaveBeenCalled();
    });

    it("shows the content of the error message when its there", () => {
      const error = "This error test";
      render(
        <LoginForm onSubmit={() => {}} error={error} disableLoginBtn={false} />
      );

      const erorrMsg = screen.getByText(error);

      expect(erorrMsg).toBeInTheDocument();
    });

    it("button is diabled when prop is true", () => {
      render(
        <LoginForm onSubmit={() => {}} error={null} disableLoginBtn={true} />
      );

      const button = screen.getByRole("button");

      expect(button).toBeDisabled();
    });

    it("button is NOT diabled when prop is FALSE", () => {
      render(
        <LoginForm onSubmit={() => {}} error={null} disableLoginBtn={false} />
      );

      const button = screen.getByRole("button");

      expect(button).not.toBeDisabled();
    });
  });