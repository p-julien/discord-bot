import { getTimeBeforeMarioStrickerRelease } from "../../src/cron/mario-striker";

describe("get time before mario stricker release", () => {
  test("should return a string", () => {
    const result = getTimeBeforeMarioStrickerRelease();
    expect(typeof result).toBe("string");
  });
});
