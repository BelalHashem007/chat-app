import { describe, it, expect, vi } from "vitest";
import { screen, render } from "@testing-library/react";
import Profile from "../Profile";
import { createMemoryRouter, RouterProvider } from "react-router";
import userEvent from "@testing-library/user-event";

vi.mock("../../../../util/context/authContext", () => {
  return {
    useAuthContext: () => ({ user: { uid: "123" } }),
  };
});

const userData = {
  displayName: "Ahmed",
  email: "ahmed@test.com",
  photoURL: null,
};

const mockUpdateUserName = vi.fn();

vi.mock("../../../../firebase/firebase_db/database",()=>{
    return {
        updateUserName:(uid,name)=>mockUpdateUserName(name),
    }
})

function renderProfile(data) {
  const testRoutes = [
    {
      path: "/chat",
      element: <Profile userData={data} />,
    },
  ];
  const router = createMemoryRouter(testRoutes, {
    initialEntries: ["/chat"],
  });

  render(<RouterProvider router={router} />);
}

describe("Profile", () => {
  it("render name and email for non-anonymous users", () => {
    renderProfile(userData);
    expect(screen.getByText(userData.displayName)).toBeInTheDocument();
    expect(screen.getByText(userData.email)).toBeInTheDocument();
  });

  it("render name and guestId for anonymous users", () => {
    renderProfile({
      ...userData,
      isAnonymous: true,
      guestId: "rr44",
    });

    expect(screen.getByText(userData.displayName)).toBeInTheDocument();
    expect(screen.getByText("rr44")).toBeInTheDocument();
  });

  it("renders input with value (name) to update when edit button is clicked",async()=>{
    renderProfile(userData);

    const user = userEvent.setup();

    await user.click(screen.getByTestId("editBtn"));

    expect(screen.getByRole("textbox",{name:"Edit name"})).toBeInTheDocument();
    expect(screen.getByRole("textbox",{name:"Edit name"})).toHaveValue(userData.displayName);
  });

  it("calls updateUserName when submitting the new name with correct data.",async()=>{
    renderProfile(userData);

    const user = userEvent.setup();

    await user.click(screen.getByTestId("editBtn"));
    await user.type(screen.getByRole("textbox",{name:"Edit name"}),"Wael");
    await user.click(screen.getByTestId("updateBtn"));
    
    expect(mockUpdateUserName).toHaveBeenCalledExactlyOnceWith(userData.displayName+"Wael")
  });
});
