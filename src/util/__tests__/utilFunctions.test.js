import { describe, it, expect, vi } from "vitest";
import * as utilObject from "../utilFunctions";

const palette = [
  "#e67e22",
  "#d35400",
  "#c0392b",
  "#8e44ad",
  "#2980b9",
  "#16a085",
  "#27ae60",
  "#2ecc71",
  "#f39c12",
  "#f1c40f",
  "#e74c3c",
  "#9b59b6",
  "#3498db",
  "#1abc9c",
  "#2ecc71",
];
const adjectives = [
  "Quick",
  "Silent",
  "Mighty",
  "Blue",
  "Brave",
  "Calm",
  "Swift",
  "Clever",
  "Lucky",
  "Bright",
];
const animals = [
  "Fox",
  "Tiger",
  "Eagle",
  "Panda",
  "Wolf",
  "Hawk",
  "Lion",
  "Falcon",
  "Otter",
  "Bear",
];

describe("pickPaletteColor", () => {
  it("returns the same color for the same text", () => {
    const result1 = utilObject.pickPaletteColor("ahmed");
    const result2 = utilObject.pickPaletteColor("ahmed");

    expect(result1).toBe(result2);
  });

  it("should return a color that exists in the palette", () => {
    const input = ["rania", "Haidy", "Belal Hashem"];

    input.forEach((inp) => {
      expect(palette).contain(utilObject.pickPaletteColor(inp));
    });
  });

  it("should return the first color for no text", () => {
    expect(utilObject.pickPaletteColor("")).toBe(palette[0]);
  });

  it("should return the first color for any non text input", () => {
    expect(utilObject.pickPaletteColor(123)).toBe(palette[0]);
    expect(utilObject.pickPaletteColor({})).toBe(palette[0]);
    expect(utilObject.pickPaletteColor([1, 2, 3])).toBe(palette[0]);
    expect(utilObject.pickPaletteColor(true)).toBe(palette[0]);
  });
});

describe("generateRandomName", () => {
  it("returns correct structure", () => {
    vi.spyOn(globalThis.Math, "random").mockReturnValue(0);

    expect(utilObject.generateRandomName()).toBe(
      `${adjectives[0]}${animals[0]}${0}`
    );
  });
});

describe("otherAdminsExist", () => {
  it("returns true when there exist other admins outside of the user", () => {
    const chat = { adminUids: ["1", "2", "3"] };
    const result = utilObject.otherAdminsExist(chat, "1");

    expect(result).toBe(true);
  });

  it("returns false when user is the only admin", () => {
    const chat = { adminUids: ["1"] };
    const result = utilObject.otherAdminsExist(chat, "1");

    expect(result).toBe(false);
  });
});

describe("getMessageDate", () => {
  it("returns a timestring if date is today", () => {
    const currentDay = new Date();
    const timestamp = { seconds: currentDay.getTime() / 1000 };
    const localTimeString = currentDay.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const result = utilObject.getMessageDate(timestamp);

    expect(result).toBe(localTimeString);
  });

  it("returns Yesterday if date was yesterday and forChatWindow options is false", () => {
    const currentDay = new Date();
    const yesterday = new Date(currentDay);
    yesterday.setDate(currentDay.getDate()-1);
    const timestamp = { seconds: yesterday.getTime() / 1000 };

    const result = utilObject.getMessageDate(timestamp);

    expect(result).toBe("Yesterday");
  });

  it("returns Yesterday + timestring if date was yesterday and forChatWindow options is true", () => {
    const currentDay = new Date();
    const yesterday = new Date(currentDay);
    yesterday.setDate(currentDay.getDate()-1);
    const timestamp = { seconds: yesterday.getTime() / 1000 };
    const localTimeString = currentDay.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const result = utilObject.getMessageDate(timestamp,{forChatWindow:true});

    expect(result).toBe(`Yesterday, ${localTimeString}`);
  });

  it("returns month+day if date was even longer than yesterday and forChatWindow options is false", () => {
    const currentDay = new Date();
    const moreThanYesterday = new Date(currentDay);
    moreThanYesterday.setDate(currentDay.getDate()-3);
    const timestamp = { seconds: moreThanYesterday.getTime() / 1000 };
    const dateString = moreThanYesterday.toLocaleDateString([], { month: "short", day: "numeric" });

    const result = utilObject.getMessageDate(timestamp);

    expect(result).toBe(dateString);
  });

  it("returns dayOfWeek and time if date was less than a week ago and forChatWindow options is true", () => {
    const currentDay = new Date();
    const moreThanYesterday = new Date(currentDay);
    moreThanYesterday.setDate(currentDay.getDate()-3);
    const timestamp = { seconds: moreThanYesterday.getTime() / 1000 };
    const dateString = moreThanYesterday.toLocaleDateString([], { weekday:"short"});
    const localTimeString = currentDay.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const result = utilObject.getMessageDate(timestamp,{forChatWindow:true});

    expect(result).toBe(`${dateString}, ${localTimeString}`);
  });

  it("returns year+month+day if date was longer than a week and forChatWindow options is true", () => {
    const currentDay = new Date();
    const moreThanYesterday = new Date(currentDay);
    moreThanYesterday.setDate(currentDay.getDate()-8);
    const timestamp = { seconds: moreThanYesterday.getTime() / 1000 };
    const dateString = moreThanYesterday.toLocaleDateString([], { month:"short", day:"numeric",year:"numeric",});

    const result = utilObject.getMessageDate(timestamp,{forChatWindow:true});

    expect(result).toBe(`${dateString}`);
  });
});
