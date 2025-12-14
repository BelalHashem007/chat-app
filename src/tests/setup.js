import { expect, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);

(globalThis.IS_REACT_ACT_ENVIRONMENT = true),
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });