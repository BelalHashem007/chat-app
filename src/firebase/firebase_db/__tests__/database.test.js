import { describe, it, expect, vi, beforeEach } from "vitest";
import * as dbObject from "../database";

const mockSetDoc = vi.fn();
const mockServerTimestamp = vi.fn();
const mockDoc = vi.fn();
const mockNanoid = vi.fn();
const mockGetDocs = vi.fn();

const fakeUser = {
  uid: "test_uid_123",
  email: "TestUser@Email.com",
  displayName: "Test User",
  photoURL: "https://example.com/avatar.png",
  isAnonymous: false,
};

const fakeGuestUser = {
  uid: "test_uid_123",
  email: null,
  displayName: "Test User",
  photoURL: "https://example.com/avatar.png",
  isAnonymous: true,
};

const fakeDataObjects = [
  {
    id:1,
    data: () => ({ uid: 1, displayName: "Belal" }),
  },
  {
    id:2,
    data: () => ({ uid: 2, displayName: "Aisha" }),
  },
  {
    id:3,
    data: () => ({ uid: 3, displayName: "Omar" }),
  },
  {
    id:4,
    data: () => ({ uid: 4, displayName: "Sara" }),
  },
  {
    id:5,
    data: () => ({ uid: 5, displayName: "Khalid" }),
  },
];

vi.mock("firebase/firestore", () => {
  return {
    serverTimestamp: () => mockServerTimestamp(),
    setDoc: (...args) => mockSetDoc(...args),
    doc: (...args) => mockDoc(...args),
    getFirestore: () => ({ name: "fakedb" }),
    query: vi.fn(),
    getDocs: () => mockGetDocs(),
    collection:()=>{},
    where:()=>{},
  };
});

vi.mock("nanoid", () => {
  return {
    nanoid: (...args) => mockNanoid(...args),
  };
});

describe("storeNewUserProfile", () => {
  describe("When success on storing user", () => {
    it("creates new user with correct details", async () => {
      const result = await dbObject.storeNewUserProfile(fakeUser);

      expect(result.uid).toBe(fakeUser.uid);
      expect(result.displayName).toBe(fakeUser.displayName);
      expect(result.email).toBe(fakeUser.email);
      expect(result.photoURL).toBe(fakeUser.photoURL);
      expect(result.isAnonymous).toBe(fakeUser.isAnonymous);
    });
  });
  describe("When success on storing anonymous user", () => {
    mockNanoid.mockReturnValue("testid");
    it("creates new user with correct details", async () => {
      const result = await dbObject.storeNewUserProfile(fakeGuestUser);

      expect(result.uid).toBe(fakeGuestUser.uid);
      expect(result.displayName).toBe(fakeGuestUser.displayName);
      expect(result.email).toBe(fakeGuestUser.email);
      expect(result.photoURL).toBe(fakeGuestUser.photoURL);
      expect(result.isAnonymous).toBe(fakeGuestUser.isAnonymous);
      expect(result.guestId).toBe("testid");
    });
  });

  describe("When failing on storing user/anonymous user", () => {
    it("returns the error", async () => {
      mockSetDoc.mockRejectedValue(new Error("test"));
      const result = await dbObject.storeNewUserProfile(fakeUser);

      expect(result.message).toBe("test");
    });
  });
});

describe("searchUsers", () => {
  describe("When searchterm doesn`t exist", () => {
    it("returns early", async () => {
      const result = await dbObject.searchUsers();

      expect(result).toEqual({ data: [], error: null });
    });
  });

  describe("When search successed", () => {
    beforeEach(() => {
      mockGetDocs
        .mockResolvedValueOnce(fakeDataObjects)
        .mockResolvedValueOnce({ docs: [], forEach: () => {} })
        .mockResolvedValueOnce({docs:fakeDataObjects.slice(1, 3)});
    });
    it("remove current user and current user contacts from result", async() => {
        const result = await dbObject.searchUsers("ttt",1);

        expect(result.data).toEqual([{id:4,uid:4,displayName: "Sara"},{id:5,uid:5,displayName: "Khalid"}])
    });
  });

  describe("When search fails", () => {
    it("returns error",async()=>{
        mockGetDocs.mockRejectedValueOnce(new Error("fake error"));
        const result = await dbObject.searchUsers("ttt",1);

        expect(result.data).toEqual([]);
        expect(result.error).toBe("Something went wrong. Please try again.")
    })
  });
});

