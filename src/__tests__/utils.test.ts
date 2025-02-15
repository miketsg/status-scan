import { computeHash } from "../utils";

describe("computeHash", () => {
  it("should return a valid SHA256 hash for given content", () => {
    const content = "Hello, World!";
    const hash = computeHash(content);
    expect(hash).toHaveLength(64);
    // Expected SHA256 hash for "Hello, World!" (without newline)
    expect(hash).toEqual(
      "315f5bdb76d078c43b8ac0064e4a016461e1e29c8e02d4b6e5f8c8ef8c7f70c6"
    );
  });
});
