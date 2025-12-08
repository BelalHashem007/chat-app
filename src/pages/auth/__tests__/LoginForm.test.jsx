import { describe,it,expect,vi } from "vitest";
import { render,screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "../Login";


describe("LoginFrom Component", () => {

    it("renders correct form",()=>{
      render(<LoginForm onSubmit={()=>{}} error={null} disableLoginBtn={false}/>)

      const email = screen.getByRole("textbox",{name:"Email"});
      const pass = screen.getByLabelText("Password");
      const button = screen.getByRole("button",{name:"Log in"})

      expect(email).toBeInTheDocument();
      expect(pass).toBeInTheDocument();
      expect(button).toBeInTheDocument();
    });

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

    it("shows the content of the error message when its there", () => {
      const error = "This error test";
      render(
        <LoginForm onSubmit={() => {}} error={error} disableLoginBtn={false} />
      );

      const erorrMsg = screen.getByText(error);

      expect(erorrMsg).toBeInTheDocument();
    });

    it("login button is diabled when prop is true and shows (Logging in...) text", () => {
      render(
        <LoginForm onSubmit={() => {}} error={null} disableLoginBtn={true} />
      );

      const button = screen.getByRole("button");

      expect(button).toBeDisabled();
      expect(button).toHaveTextContent("Logging in...")
    });

    it("Form passes correct data to onSumbit handler", async () => {
        const submitForm = vi.fn((e) => {
          e.preventDefault();
        });
        render(
          <LoginForm onSubmit={submitForm} error={null} disableBtn={false} />
        );
    
        const user = userEvent.setup();
        const button = screen.getByRole("button", { name: "Log in" });
    
        const testData = {
          mail: "test@example.com",
          password: "securepassword",
        };
    
        await user.type(screen.getByLabelText("Email"), testData.mail);
        await user.type(screen.getByLabelText("Password"), testData.password);
    
        await user.click(button);
    
        expect(submitForm).toHaveBeenCalledOnce();
    
        const formEvent = submitForm.mock.calls[0][0];
        const formData = new FormData(formEvent.target);
        const data = Object.fromEntries(formData.entries());
    
        expect(data).toEqual(testData)
      });
  });