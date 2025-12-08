import { describe,it,expect, vi } from "vitest";
import { render,screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Signup from "../Signup";
import { createMemoryRouter, RouterProvider } from "react-router";


const mockCreateUser = vi.fn(()=>Promise.resolve({user:"unga",error:null}))

vi.mock("../../../firebase/firebase_auth/authentication",async()=>{
    const actual = await vi.importActual("../../../firebase/firebase_auth/authentication");
    return {
        ...actual,
        createUser: ()=>mockCreateUser(),
    }
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
describe("Signup Component",()=>{

    it("Validate that pass and confirm pass match and show error message if not",async()=>{
        const router = createMemoryRouter(testRoute,{initialEntries:["/signup"]});
        render(<RouterProvider router={router}/>)

        const user = userEvent.setup();
        const button = screen.getByRole("button",{name:"Create account"});


        await user.type(screen.getByLabelText("Email"),"test@test.com");
        await user.type(screen.getByLabelText("Password"),"22");
        await user.type(screen.getByLabelText("Confirm Password"),"11");

        await user.click(button);

        const errorDiv = await screen.findByText("Password and Confirm Password don`t match");

        expect(mockCreateUser).not.toHaveBeenCalled();
        expect(errorDiv).toBeInTheDocument();
    });


})