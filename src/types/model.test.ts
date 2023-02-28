import { ZodError } from "zod";

import {
  ertErrorMsg,
  EstimatedReviewTimeSchema,
  githubErrorMsg,
  PRDescriptionSchema,
  PRLinkSchema,
  PullRequest,
  translateInputToHumanReadable,
} from ".";

describe("PRLinkSchema Validate", () => {
  test("valid https github link, should be valid", () => {
    const input = "https://github.com/jcserv/ez-pr-bot/pulls/1";
    const expected: PullRequest = {
      website: "github",
      org: "jcserv",
      repo: "ez-pr-bot",
      num: "1",
      link: input,
    };
    expect(PRLinkSchema.parse(input)).toStrictEqual(expected);
  });

  test("valid http github link, should be valid", () => {
    const input = "http://github.com/jcserv/ez-pr-bot/pulls/1";
    const expected: PullRequest = {
      website: "github",
      org: "jcserv",
      repo: "ez-pr-bot",
      num: "1",
      link: input,
    };
    expect(PRLinkSchema.parse(input)).toStrictEqual(expected);
  });

  test("valid http bitbucket link, should be valid", () => {
    const input = "https://bitbucket.org/my-company/repo/pull-requests/12345";
    const expected: PullRequest = {
      website: "bitbucket",
      org: "my-company",
      repo: "repo",
      num: "12345",
      link: input,
    };
    expect(PRLinkSchema.parse(input)).toStrictEqual(expected);
  });

  test("valid http gitlab link, should be valid", () => {
    const input = "http://gitlab.com/my-group/my-project/merge_requests/1";
    const expected: PullRequest = {
      website: "gitlab",
      org: "my-group",
      repo: "my-project",
      num: "1",
      link: input,
    };
    expect(PRLinkSchema.parse(input)).toStrictEqual(expected);
  });

  test("valid http github link with extra spaces at front/back, should be valid", () => {
    const expected: PullRequest = {
      website: "github",
      org: "jcserv",
      repo: "ez-pr-bot",
      num: "1",
      link: "http://github.com/jcserv/ez-pr-bot/pulls/1",
    };
    expect(
      PRLinkSchema.parse("   http://github.com/jcserv/ez-pr-bot/pulls/1  ")
    ).toStrictEqual(expected);
  });

  test("invalid link, should be invalid", () => {
    const expectedInvalidURLErr = new ZodError([
      {
        validation: "url",
        code: "invalid_string",
        message: "Invalid url",
        path: [],
      },
      {
        validation: "regex",
        code: "invalid_string",
        message: githubErrorMsg,
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
      message: ertErrorMsg,
      path: [],
    },
  ]);

  test("1m, should be valid", () => {
    const input = "1m";
    const expected = "1 minute";
    expect(EstimatedReviewTimeSchema.parse(input)).toStrictEqual(expected);
  });

  test("15m, should be valid", () => {
    const input = "15m";
    const expected = "15 minutes";
    expect(EstimatedReviewTimeSchema.parse(input)).toStrictEqual(expected);
  });

  test("5min, should be valid", () => {
    const input = "5min";
    const expected = "5 minutes";
    expect(EstimatedReviewTimeSchema.parse(input)).toStrictEqual(expected);
  });

  test("5mins, should be valid", () => {
    const input = "5mins";
    const expected = "5 minutes";
    expect(EstimatedReviewTimeSchema.parse(input)).toStrictEqual(expected);
  });

  test("5 minute, should be valid", () => {
    const input = "5 minute";
    const expected = "5 minutes";
    expect(EstimatedReviewTimeSchema.parse(input)).toStrictEqual(expected);
  });

  test("1 hour, should be valid", () => {
    const input = "1 hour";
    expect(EstimatedReviewTimeSchema.parse(input)).toStrictEqual(input);
  });

  test("12 hrs, should be valid", () => {
    const input = "12 hrs";
    const expected = "12 hours";
    expect(EstimatedReviewTimeSchema.parse(input)).toStrictEqual(expected);
  });

  test("valid input with extra spaces at front/back, should be valid", () => {
    const expected = "1 minute";
    expect(EstimatedReviewTimeSchema.parse("  1m  ")).toStrictEqual(expected);
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

describe("translateInputToHumanReadable", () => {
  test("2h, should return 2 hours", () => {
    expect(translateInputToHumanReadable("2h")).toStrictEqual("2 hours");
  });

  test("2hs, should return 2 hours", () => {
    expect(translateInputToHumanReadable("2hs")).toStrictEqual("2 hours");
  });

  test("2hr, should return 2 hours", () => {
    expect(translateInputToHumanReadable("2hr")).toStrictEqual("2 hours");
  });

  test("2hrs, should return 2 hours", () => {
    expect(translateInputToHumanReadable("2hrs")).toStrictEqual("2 hours");
  });

  test("2hour, should return 2 hours", () => {
    expect(translateInputToHumanReadable("2hour")).toStrictEqual("2 hours");
  });

  test("2hours, should return 2 hours", () => {
    expect(translateInputToHumanReadable("2hours")).toStrictEqual("2 hours");
  });

  test("2 h, should return 2 hours", () => {
    expect(translateInputToHumanReadable("2 h")).toStrictEqual("2 hours");
  });

  test("2 hs, should return 2 hours", () => {
    expect(translateInputToHumanReadable("2 hs")).toStrictEqual("2 hours");
  });

  test("2 hr, should return 2 hours", () => {
    expect(translateInputToHumanReadable("2 hr")).toStrictEqual("2 hours");
  });

  test("2 hrs, should return 2 hours", () => {
    expect(translateInputToHumanReadable("2 hrs")).toStrictEqual("2 hours");
  });

  test("2 hour, should return 2 hours", () => {
    expect(translateInputToHumanReadable("2 hour")).toStrictEqual("2 hours");
  });

  test("2 hours, should return 2 hours", () => {
    expect(translateInputToHumanReadable("2 hours")).toStrictEqual("2 hours");
  });

  test("1hours, should return 1 hour", () => {
    expect(translateInputToHumanReadable("1hours")).toStrictEqual("1 hour");
  });

  test("1h, should return 1 hour", () => {
    expect(translateInputToHumanReadable("1h")).toStrictEqual("1 hour");
  });

  test("1hs, should return 1 hour", () => {
    expect(translateInputToHumanReadable("1hs")).toStrictEqual("1 hour");
  });

  test("1hr, should return 1 hour", () => {
    expect(translateInputToHumanReadable("1hr")).toStrictEqual("1 hour");
  });

  test("1hrs, should return 1 hour", () => {
    expect(translateInputToHumanReadable("1hrs")).toStrictEqual("1 hour");
  });

  test("1hour, should return 1 hour", () => {
    expect(translateInputToHumanReadable("1hour")).toStrictEqual("1 hour");
  });

  test("1 hours, should return 1 hour", () => {
    expect(translateInputToHumanReadable("1 hours")).toStrictEqual("1 hour");
  });

  test("1 h, should return 1 hour", () => {
    expect(translateInputToHumanReadable("1 h")).toStrictEqual("1 hour");
  });

  test("1 hs, should return 1 hour", () => {
    expect(translateInputToHumanReadable("1 hs")).toStrictEqual("1 hour");
  });

  test("1 hr, should return 1 hour", () => {
    expect(translateInputToHumanReadable("1 hr")).toStrictEqual("1 hour");
  });

  test("1 hrs, should return 1 hour", () => {
    expect(translateInputToHumanReadable("1 hrs")).toStrictEqual("1 hour");
  });

  test("1 hour, should return 1 hour", () => {
    expect(translateInputToHumanReadable("1 hour")).toStrictEqual("1 hour");
  });

  test("1m, should return 1 minute", () => {
    expect(translateInputToHumanReadable("1m")).toStrictEqual("1 minute");
  });

  test("1ms, should return 1 minute", () => {
    expect(translateInputToHumanReadable("1ms")).toStrictEqual("1 minute");
  });

  test("1min, should return 1 minute", () => {
    expect(translateInputToHumanReadable("1min")).toStrictEqual("1 minute");
  });

  test("1mins, should return 1 minute", () => {
    expect(translateInputToHumanReadable("1mins")).toStrictEqual("1 minute");
  });

  test("1minute, should return 1 minute", () => {
    expect(translateInputToHumanReadable("1minute")).toStrictEqual("1 minute");
  });

  test("1minutes, should return 1 minute", () => {
    expect(translateInputToHumanReadable("1minutes")).toStrictEqual("1 minute");
  });

  test("1 m, should return 1 minute", () => {
    expect(translateInputToHumanReadable("1 m")).toStrictEqual("1 minute");
  });

  test("1 ms, should return 1 minute", () => {
    expect(translateInputToHumanReadable("1 ms")).toStrictEqual("1 minute");
  });

  test("1 min, should return 1 minute", () => {
    expect(translateInputToHumanReadable("1 min")).toStrictEqual("1 minute");
  });

  test("1 mins, should return 1 minute", () => {
    expect(translateInputToHumanReadable("1 mins")).toStrictEqual("1 minute");
  });

  test("1 minute, should return 1 minute", () => {
    expect(translateInputToHumanReadable("1 minute")).toStrictEqual("1 minute");
  });

  test("1 minutes, should return 1 minute", () => {
    expect(translateInputToHumanReadable("1 minutes")).toStrictEqual(
      "1 minute"
    );
  });

  test("2m, should return 2 minutes", () => {
    expect(translateInputToHumanReadable("2m")).toStrictEqual("2 minutes");
  });

  test("2ms, should return 2 minutes", () => {
    expect(translateInputToHumanReadable("2ms")).toStrictEqual("2 minutes");
  });

  test("2min, should return 2 minutes", () => {
    expect(translateInputToHumanReadable("2min")).toStrictEqual("2 minutes");
  });

  test("2mins, should return 2 minutes", () => {
    expect(translateInputToHumanReadable("2mins")).toStrictEqual("2 minutes");
  });

  test("2minute, should return 2 minutes", () => {
    expect(translateInputToHumanReadable("2minute")).toStrictEqual("2 minutes");
  });

  test("2minutes, should return 2 minutes", () => {
    expect(translateInputToHumanReadable("2minutes")).toStrictEqual(
      "2 minutes"
    );
  });

  test("2 m, should return 2 minutes", () => {
    expect(translateInputToHumanReadable("2 m")).toStrictEqual("2 minutes");
  });

  test("2 ms, should return 2 minutes", () => {
    expect(translateInputToHumanReadable("2 ms")).toStrictEqual("2 minutes");
  });

  test("2 min, should return 2 minutes", () => {
    expect(translateInputToHumanReadable("2 min")).toStrictEqual("2 minutes");
  });

  test("2 mins, should return 2 minutes", () => {
    expect(translateInputToHumanReadable("2 mins")).toStrictEqual("2 minutes");
  });

  test("2 minute, should return 2 minutes", () => {
    expect(translateInputToHumanReadable("2 minute")).toStrictEqual(
      "2 minutes"
    );
  });

  test("2 minutes, should return 2 minutes", () => {
    expect(translateInputToHumanReadable("2 minutes")).toStrictEqual(
      "2 minutes"
    );
  });
});
