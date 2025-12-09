import { describe,it,expect, beforeEach,vi } from "vitest";
import { screen,render, fireEvent } from "@testing-library/react";
import ContactOptions from "../ContactOptions";
import userEvent from "@testing-library/user-event";

describe("ContactOptions Component",()=>{

    describe("Menu",()=>{
        beforeEach(()=>{
            render(<ContactOptions setShowAddContact={()=>{}} setShowAddGroup={()=>{}}/>)
        })
        it("opens when clicked",async()=>{
            expect(screen.queryByRole("button",{name:"New contact"})).not.toBeInTheDocument();

            const user = userEvent.setup();

            await user.click(screen.queryByRole("button",{name:"Menu"}));

            expect(screen.queryByRole("button",{name:"New contact"})).toBeInTheDocument();
            expect(screen.queryByRole("button",{name:"New group"})).toBeInTheDocument();
        });

        it("closes when clicked twice",async()=>{
            const user = userEvent.setup();

            await user.click(screen.queryByRole("button",{name:"Menu"}));
            await user.click(screen.queryByRole("button",{name:"Menu"}));

            expect(screen.queryByRole("button",{name:"New contact"})).not.toBeInTheDocument();
            expect(screen.queryByRole("button",{name:"New group"})).not.toBeInTheDocument();
        });

        it("closes when clicked outside of it",async ()=>{
            const user = userEvent.setup();

            await user.click(screen.queryByRole("button",{name:"Menu"}));

            expect(screen.queryByRole("button",{name:"New contact"})).toBeInTheDocument();

            fireEvent.mouseDown(document);

            expect(screen.queryByRole("button",{name:"New contact"})).not.toBeInTheDocument();
            expect(screen.queryByRole("button",{name:"New group"})).not.toBeInTheDocument();
        })
    });

    describe("New contact button",()=>{
        const mockSetShowAddContact = vi.fn()
         beforeEach(async()=>{
            render(<ContactOptions setShowAddContact={mockSetShowAddContact} setShowAddGroup={()=>{}}/>)
            const user = userEvent.setup();

            await user.click(screen.queryByRole("button",{name:"Menu"}));
            await user.click(screen.queryByRole("button",{name:"New contact"}));
        });

        it("on click calls setShowAddContact with (true) and closes menu",()=>{
            expect(mockSetShowAddContact).toHaveBeenCalledTimes(1);
            expect(screen.queryByRole("button",{name:"New contact"})).not.toBeInTheDocument();
        });
    });

    describe("New group button",()=>{
        const mockSetShowAddGroup = vi.fn()
         beforeEach(async()=>{
            render(<ContactOptions setShowAddContact={()=>{}} setShowAddGroup={mockSetShowAddGroup}/>)
            const user = userEvent.setup();

            await user.click(screen.queryByRole("button",{name:"Menu"}));
            await user.click(screen.queryByRole("button",{name:"New group"}));
        });

        it("on click calls setShowAddGroup with (true) and closes menu",()=>{
            expect(mockSetShowAddGroup).toHaveBeenCalledTimes(1);
            expect(screen.queryByRole("button",{name:"New group"})).not.toBeInTheDocument();
        });
    });
})