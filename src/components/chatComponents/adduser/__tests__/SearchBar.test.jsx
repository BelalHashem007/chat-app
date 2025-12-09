import { describe, it, expect, vi } from "vitest";
import { screen, render } from "@testing-library/react";
import { SearchBar } from "../SearchBar";
import userEvent from "@testing-library/user-event";

const fakeSearchResults = [
  { uid: 123, displayName: "Ahmed" },
  { uid: 124, displayName: "Mohamed" },
];

const mockUseDebouncedSearch = vi.fn(() => ({
  results: fakeSearchResults,
  noResult: false,
}));

vi.mock("../../../../util/hooks/useDebouncedSearch", () => {
  return {
    default: () => mockUseDebouncedSearch(),
  };
});

describe("SearchBar Component(AddContact)", () => {
  it("renders a searchbar with a value based on searchTerm", () => {
    render(
      <SearchBar
        setResult={() => {}}
        setSearchTerm={() => {}}
        searchTerm={"ahmed"}
      />
    );

    expect(
      screen.getByRole("searchbox", { name: "Search contacts" })
    ).toHaveValue("ahmed");
  });

  it("calls setSearchTerm with correct value when user types", async () => {
    let term = "";

    const mockSetSearchTerm = vi.fn((value) => {
      term = value;
      rerender(
        <SearchBar
          setResult={() => {}}
          setSearchTerm={mockSetSearchTerm}
          searchTerm={term}
        />
      );
    });

    const { rerender } = render(
      <SearchBar
        setResult={() => {}}
        setSearchTerm={mockSetSearchTerm}
        searchTerm={term}
      />
    );

    const user = userEvent.setup();

    await user.type(
      screen.getByRole("searchbox", { name: "Search contacts" }),
      "abc"
    );

    expect(mockSetSearchTerm).toHaveBeenCalledTimes(3);
    expect(mockSetSearchTerm).toHaveBeenLastCalledWith("abc");
  });

  it("renders noResult when there is no results", () => {
    mockUseDebouncedSearch.mockReturnValueOnce({
      results: [],
      noResult: true,
    });
    render(
      <SearchBar
        setResult={() => {}}
        setSearchTerm={() => {}}
        searchTerm={""}
      />
    );

    expect(screen.getByTestId("noResult")).toBeInTheDocument();
  });

  it("calls setResult with correct results on change", () => {
    const mockSetResult = vi.fn();
    const { rerender } = render(
      <SearchBar
        setResult={mockSetResult}
        setSearchTerm={() => {}}
        searchTerm={"ahmed"}
      />
    );

    expect(mockSetResult).toHaveBeenCalledOnce();
    expect(mockSetResult).toHaveBeenCalledWith(fakeSearchResults)

    mockUseDebouncedSearch.mockReturnValueOnce({
      results: [...fakeSearchResults, { uid: 1234, displayName: "Belal" }],
      noResult: false,
    });

    rerender(
      <SearchBar
        setResult={mockSetResult}
        setSearchTerm={() => {}}
        searchTerm={"ahmed"}
      />
    );
    expect(mockSetResult).toHaveBeenCalledTimes(2);
    expect(mockSetResult).toHaveBeenCalledWith([...fakeSearchResults, { uid: 1234, displayName: "Belal" }])
    
  });
});
