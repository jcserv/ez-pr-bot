import { string, ZodError } from "zod";
import {
  ChannelSchema,
  EstimatedReviewTimeSchema,
  PRDescriptionSchema,
  PRLinkSchema,
} from "./index";

describe("ChannelSchema Validate", () => {
  const expectedInvalidStartsWithErr = new ZodError([
    {
      code: "invalid_string",
      validation: {
        startsWith: "#",
      },
      message: 'Invalid input: must start with "#"',
      path: [],
    },
  ]);

  test("#channel, should be valid", () => {
    const input = "#channel";
    expect(ChannelSchema.parse(input)).toStrictEqual(input);
  });

  test("#channel with spaces at front/back, should be valid", () => {
    expect(ChannelSchema.parse("  #channel  ")).toStrictEqual("#channel");
  });

  test("extra chars at start, should be invalid", () => {
    try {
      ChannelSchema.parse("a#channel");
    } catch (error) {
      expect(error).toStrictEqual(expectedInvalidStartsWithErr);
    }
  });

  test("input does not start with #, should be invalid", () => {
    try {
      ChannelSchema.parse("channel");
    } catch (error) {
      expect(error).toStrictEqual(expectedInvalidStartsWithErr);
    }
  });
});

describe("PRLinkSchema Validate", () => {
  test("valid https github link, should be valid", () => {
    const input = "https://github.com/jcserv/ez-pr-bot/pulls/1";
    expect(PRLinkSchema.parse(input)).toStrictEqual(input);
  });

  test("valid http github link, should be valid", () => {
    const input = "http://github.com/jcserv/ez-pr-bot/pulls/1";
    expect(PRLinkSchema.parse(input)).toStrictEqual(input);
  });

  test("valid http github link with extra spaces at front/bacl, should be valid", () => {
    expect(
      PRLinkSchema.parse("   http://github.com/jcserv/ez-pr-bot/pulls/1  ")
    ).toStrictEqual("http://github.com/jcserv/ez-pr-bot/pulls/1");
  });

  test("invalid link, should be invalid", () => {
    const expectedInvalidURLErr = new ZodError([
      {
        validation: "url",
        code: "invalid_string",
        message: "Invalid url",
        path: [],
      },
    ]);

    try {
      PRLinkSchema.parse("http://github. com/jcserv/ez-pr-bot/pulls/1");
    } catch (error) {
      expect(error).toStrictEqual(expectedInvalidURLErr);
    }
  });
});

describe("EstimatedReviewTimeSchema Validate", () => {
  const expectedRegexErr = new ZodError([
    {
      validation: "regex",
      code: "invalid_string",
      message:
        "Invalid input: must start with 1 or 2 digits and end with a support time unit",
      path: [],
    },
  ]);

  test("1m, should be valid", () => {
    const input = "1m";
    expect(EstimatedReviewTimeSchema.parse(input)).toStrictEqual(input);
  });

  test("15m, should be valid", () => {
    const input = "15m";
    expect(EstimatedReviewTimeSchema.parse(input)).toStrictEqual(input);
  });

  test("5min, should be valid", () => {
    const input = "5min";
    expect(EstimatedReviewTimeSchema.parse(input)).toStrictEqual(input);
  });

  test("5mins, should be valid", () => {
    const input = "5mins";
    expect(EstimatedReviewTimeSchema.parse(input)).toStrictEqual(input);
  });

  test("5 minute, should be valid", () => {
    const input = "5 minute";
    expect(EstimatedReviewTimeSchema.parse(input)).toStrictEqual(input);
  });

  test("1 hour, should be valid", () => {
    const input = "1 hour";
    expect(EstimatedReviewTimeSchema.parse(input)).toStrictEqual(input);
  });

  test("12 hrs, should be valid", () => {
    const input = "12 hrs";
    expect(EstimatedReviewTimeSchema.parse(input)).toStrictEqual(input);
  });

  test("valid input with extra spaces at front/back, should be valid", () => {
    expect(EstimatedReviewTimeSchema.parse("  1m  ")).toStrictEqual("1m");
  });

  test("extra chars at start, should be invalid", () => {
    try {
      EstimatedReviewTimeSchema.parse("a12 hrs");
    } catch (error) {
      expect(error).toStrictEqual(expectedRegexErr);
    }
  });

  test("extra chars at end, should be invalid", () => {
    try {
      EstimatedReviewTimeSchema.parse("12 hrsa");
    } catch (error) {
      expect(error).toStrictEqual(expectedRegexErr);
    }
  });

  test("too many spaces, should be invalid", () => {
    try {
      EstimatedReviewTimeSchema.parse("12  hrs");
    } catch (error) {
      expect(error).toStrictEqual(expectedRegexErr);
    }
  });

  test("too many digits, should be invalid", () => {
    try {
      EstimatedReviewTimeSchema.parse("155m");
    } catch (error) {
      expect(error).toStrictEqual(expectedRegexErr);
    }
  });
});

describe("PRDescriptionSchema Validate", () => {
  test("empty string, should be valid", () => {
    const input = "";
    expect(PRDescriptionSchema.parse(input)).toStrictEqual(input);
  });

  test("happy path description, should be valid", () => {
    const input = "Bug fix for /help command";
    expect(PRDescriptionSchema.parse(input)).toStrictEqual(input);
  });

  test("200 character description, should be valid", () => {
    const input = "a".repeat(200);
    expect(PRDescriptionSchema.parse(input)).toStrictEqual(input);
  });

  test("201 character description, should be invalid", () => {
    const expectedMaxLengthErr = new ZodError([
      {
        code: "too_big",
        maximum: 200,
        type: "string",
        inclusive: true,
        exact: false,
        message: "String must contain at most 200 character(s)",
        path: [],
      },
    ]);
    try {
      PRDescriptionSchema.parse("a".repeat(201));
    } catch (error) {
      expect(error).toStrictEqual(expectedMaxLengthErr);
    }
  });
});
