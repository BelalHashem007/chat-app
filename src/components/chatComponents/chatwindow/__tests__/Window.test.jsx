import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Window from "../Window";

vi.mock("../../../../util/context/authContext", () => {
  return {
    useAuthContext: () => ({
      user: {
        displayName: "Belal Hashem",
        uid: "rkJSNbx0pNMQHU3F8m3sJAYzEb42",
        photoURL: null,
        createdAt: {
          type: "firestore/timestamp/1.0",
          seconds: 1764157375,
          nanoseconds: 648000000,
        },
        updatedAt: {
          type: "firestore/timestamp/1.0",
          seconds: 1764418479,
          nanoseconds: 682000000,
        },
        email: "belal.hashem.saleh@gmail.com",
        email_lower: "belal.hashem.saleh@gmail.com",
      },
    }),
  };
});

const fakeMsgs = [
  {
    id: "fQVaean6SiLYSW1d5Ymz",
    chatId: "oPKWsqSyNJgS5o8RyCL2",
    senderUid: "MI8GsONcU3VUiCMjuW30MB1JtS42",
    senderPhotoURL: null,
    senderDisplayName: "CalmOtter947",
    timestamp: {
      type: "firestore/timestamp/1.0",
      seconds: 1765475396,
      nanoseconds: 666000000,
    },
    text: "yeyeye",
  },
  {
    id: "SpWOpdTe5A2o9QJCEUoU",
    timestamp: {
      type: "firestore/timestamp/1.0",
      seconds: 1765475594,
      nanoseconds: 404000000,
    },
    senderDisplayName: "Belal Hashem",
    senderPhotoURL: null,
    text: "shesh",
    senderUid: "rkJSNbx0pNMQHU3F8m3sJAYzEb42",
    chatId: "oPKWsqSyNJgS5o8RyCL2",
  },
];

const fakeChat = {
  id: "oPKWsqSyNJgS5o8RyCL2",
  isGroupChat: true,
  groupProfileURL: null,
  allTimeParticipantsUids: [
    "rkJSNbx0pNMQHU3F8m3sJAYzEb42",
    "W59OlWdZulccHwI4H1wtp43IeNk1",
    "MI8GsONcU3VUiCMjuW30MB1JtS42",
  ],
  lastMessageSenderDisplayName: "System",
  activeParticipantsUids: ["W59OlWdZulccHwI4H1wtp43IeNk1"],
  lastMessageSenderUid: "system",
  lastMessage: "Belal Hashem Has left the group.",
  groupName: "test",
  createdAt: {
    type: "firestore/timestamp/1.0",
    seconds: 1765457868,
    nanoseconds: 941000000,
  },
  lastMessageDate: {
    type: "firestore/timestamp/1.0",
    seconds: 1765475597,
    nanoseconds: 332000000,
  },
  adminUids: ["W59OlWdZulccHwI4H1wtp43IeNk1"],
  enrichedParticipants: [
    {
      lastActive: {
        type: "firestore/timestamp/1.0",
        seconds: 1764157375,
        nanoseconds: 648000000,
      },
      displayName: "Belal Hashem",
      uid: "rkJSNbx0pNMQHU3F8m3sJAYzEb42",
      photoURL: null,
      createdAt: {
        type: "firestore/timestamp/1.0",
        seconds: 1764157375,
        nanoseconds: 648000000,
      },
      updatedAt: {
        type: "firestore/timestamp/1.0",
        seconds: 1764418479,
        nanoseconds: 682000000,
      },
      email: "belal.hashem.saleh@gmail.com",
      email_lower: "belal.hashem.saleh@gmail.com",
    },
    {
      uid: "W59OlWdZulccHwI4H1wtp43IeNk1",
      displayName: "Unknown User",
    },
    {
      email_lower: null,
      email: null,
      updatedAt: {
        type: "firestore/timestamp/1.0",
        seconds: 1765215295,
        nanoseconds: 589000000,
      },
      guestId: "rYBKwxl7",
      isAnonymous: true,
      photoURL: null,
      displayName: "CalmOtter947",
      createdAt: {
        type: "firestore/timestamp/1.0",
        seconds: 1765209433,
        nanoseconds: 784000000,
      },
      uid: "MI8GsONcU3VUiCMjuW30MB1JtS42",
      guestId_lower: "rybkwxl7",
    },
  ],
};

describe("Window component", () => {
  describe("When there is no selected chat", () => {
    it("renders (You haven`t started a chat yet!)", () => {
      render(<Window selectedChat={null} messages={[]} />);

      expect(screen.getByTestId("notActiveWrapper")).toBeInTheDocument();
      expect(
        screen.getByText("You haven`t started a chat yet!")
      ).toBeInTheDocument();
    });
  });

  describe("When there is a selected chat", () => {
    beforeEach(() => {
      render(<Window selectedChat={fakeChat} messages={fakeMsgs} />);
    });

    it("shows chat messages", () => {
      expect(screen.getByText(fakeMsgs[0].text)).toBeInTheDocument();
      expect(screen.getByText(fakeMsgs[1].text)).toBeInTheDocument();
    });

    it("shows message input", () => {
        expect(screen.getByRole("textbox",{name:"Message"})).toBeInTheDocument();
    });
  });
});
