import { describe, it, expect, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import useDebouncedSearch from "../../hooks/useDebouncedSearch";

const initialState = {
  results: [],
  isLoading: false,
  error: null,
  noResult: false,
};

const fakeUsers = [
  { uid: 22, displayName: "Belal" },
  { uid: 223, displayName: "Ahmed" },
];

const mockSearchUsers = vi.fn(() =>
  new Promise((resolve)=> setTimeout(() => {
    resolve({data:fakeUsers,error:null})
  }, 200))
);

vi.mock("../../context/authContext", () => {
  return {
    useAuthContext: () => ({ user: { uid: 123 } }),
  };
});

vi.mock("../../../firebase/firebase_db/database", () => {
  return {
    searchUsers: () => mockSearchUsers(),
  };
});

describe("useDebouncedSearch Hook", () => {
  describe("When no search term provided", () => {
    it("gives initial values", () => {
      const { result } = renderHook(() => useDebouncedSearch(""));
      expect(result.current).toEqual(initialState);
    });
  });

  describe("When searching",()=>{
    it("sets isLoading to true and then false after finishing the search",async()=>{
        const { result } = renderHook(() => useDebouncedSearch("ahmed"));
        await waitFor(() => expect(result.current.isLoading).toBe(true));
        await waitFor(() => expect(result.current.isLoading).toBe(false));
    })
  })

  describe("When Search succeeds", () => {
    it("returns the correct states(data,error=null,isLoading=false,noResult=false)", async () => {
      const { result } = renderHook(() => useDebouncedSearch("ahmed"));
      await waitFor(() => {
        expect(result.current.results).toEqual(fakeUsers);
        expect(result.current.noResult).toBe(false);
        expect(result.current.error).toBe(null);
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe("When Search fails", () => {
    it("returns the correct states(data=[],error=Error,isLoading=false,noResult=false)", async () => {
        mockSearchUsers.mockResolvedValueOnce({data:[],error:"error happened"})
      const { result } = renderHook(() => useDebouncedSearch("ahmed"));
      await waitFor(() => {
        expect(result.current.results).toEqual([]);
        expect(result.current.noResult).toBe(false);
        expect(result.current.error).toBe("error happened");
        expect(result.current.isLoading).toBe(false);
      });
    });
  });
});
