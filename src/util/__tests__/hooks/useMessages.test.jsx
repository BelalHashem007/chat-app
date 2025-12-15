import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import useMessages from "../../hooks/useMessages";

const fakeMessages = [
  { id: 1, text: "hello" },
  { id: 2, text: "ahmed" },
  { id: 3, text: "belal" },
];

const mockUnsubscriber = vi.fn();
const mockSubscriber = vi.fn((callback) => {
  callback(fakeMessages);
  return mockUnsubscriber;
});

vi.mock("../../../firebase/firebase_db/database", () => {
  return {
    subscribeToChatMessages: (id, callback) => mockSubscriber(callback),
  };
});

describe("useMessages Hook", () => {
  describe("on intial mount", () => {
    it("returns empty messages", () => {
      const { result } = renderHook(() => useMessages());

      expect(result.current).toEqual([]);
    });
  });

  describe("on subscribing", () => {
    it("returns correct messages", () => {
      const { result } = renderHook(() => useMessages({id:500}));

      expect(result.current).toEqual(fakeMessages);
    });
  });

  describe("on unmounting", () => {
    it("unsubscribes and returns empty messages", () => {
      const { unmount } = renderHook(() => useMessages({id:500}));
      mockUnsubscriber.mockClear()
        unmount()
      expect(mockUnsubscriber).toHaveBeenCalledTimes(1);
    });
  });
});
