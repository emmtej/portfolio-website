import { describe, expect, it } from "vitest";
import { getItalianGreetingWordClass, splitGreetingWords } from "./header-title";

describe("splitGreetingWords", () => {
  it("splits the greeting into words", () => {
    expect(splitGreetingWords("Hello World")).toEqual(["Hello", "World"]);
  });
});

describe("getItalianGreetingWordClass", () => {
  it("colors the first two italian greeting words", () => {
    expect(getItalianGreetingWordClass(0)).toBe("text-it-green");
    expect(getItalianGreetingWordClass(1)).toBe("text-it-red");
    expect(getItalianGreetingWordClass(2)).toBeUndefined();
  });
});
