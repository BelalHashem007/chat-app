import { describe,it,expect,vi } from "vitest";
import { screen,render } from "@testing-library/react";
import DefaultImage from "../DefaultImage";

const mockPickPaletteColor = vi.fn()

vi.mock("../utilFunctions",()=>{
    return {
        pickPaletteColor:(...args)=>mockPickPaletteColor(...args)
    }
})

describe("DefaultImage Component",()=>{
    it("returns nothing when text is empty",()=>{
        render(<DefaultImage text={""}/>)

        expect(screen.queryByTestId("defaultImg")).not.toBeInTheDocument();
    });

    it("returns first letter Capitalized",()=>{
        render(<DefaultImage text={"Belal"}/>)

        expect(screen.queryByTestId("defaultImg")).toHaveTextContent("B");
    });

    it("calls pickPaletteColor with text",()=>{
        render(<DefaultImage text={"Belal"}/>)

        expect(mockPickPaletteColor).toHaveBeenCalledWith("Belal");
    })
})