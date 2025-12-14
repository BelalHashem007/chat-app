import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Window from "../Window";
import * as reactObject from "react";

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

vi.mock("../MessageBubble", () => {
  return {
    default: ({ msg, selectedChat }) => (
      <div data-testid="msgbubble">{msg.text}</div>
    ),
  };
});

vi.mock("../MessageInput", () => {
  return { default: ({ selectedChat }) => <input data-testid="msgInput" /> };
});



const fakeMsgs = [
  {
    id: "fQVaean6SiLYSW1d5Ymz",
    chatId: "oPKWsqSyNJgS5o8RyCL2",
    senderUid: "MI8GsONcU3VUiCMjuW30MB1JtS42",
    senderDisplayName: "CalmOtter947",
    text: "yeyeye",
  },
  {
    id: "SpWOpdTe5A2o9QJCEUoU",
    senderDisplayName: "Belal Hashem",
    text: "shesh",
    senderUid: "rkJSNbx0pNMQHU3F8m3sJAYzEb42",
    chatId: "oPKWsqSyNJgS5o8RyCL2",
  },
];

const fakeChat = {
  id: "oPKWsqSyNJgS5o8RyCL2",
  isGroupChat: true,
  groupProfileURL: null,
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
      expect(screen.getAllByTestId("msgbubble")).toHaveLength(2);
    });

    it("shows message input", () => {
      expect(screen.getByTestId("msgInput")).toBeInTheDocument();
    });
  });
});
