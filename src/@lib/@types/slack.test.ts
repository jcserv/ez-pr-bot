import { ZodError } from "zod";

import {
  ChannelSchema,
  toMention,
  toMentions,
  UserGroupAsMentionSchema,
  userGroupErrorMsg,
  UserGroupSchema,
} from ".";

describe("toMentions", () => {
  test("empty array, should return empty array", () => {
    expect(toMentions([])).toStrictEqual([]);
  });

  test("single length usernames w/o @, should return converted mention", () => {
    expect(toMentions(["jane.doe"])).toStrictEqual(["@jane.doe"]);
  });

  test("single length usernames with @, should return unchanged", () => {
    expect(toMentions(["@jane.doe"])).toStrictEqual(["@jane.doe"]);
  });

  test("mixed usage, should return as mentions", () => {
    expect(toMentions(["jane.doe", "john.doe", "@bob"])).toStrictEqual([
      "@jane.doe",
      "@john.doe",
      "@bob",
    ]);
  });
});

describe("toMention", () => {
  test("empty string, should return @empty string", () => {
    expect(toMention("")).toStrictEqual("@");
  });

  test("single length username w/o @, should return converted mention", () => {
    expect(toMention("jane.doe")).toStrictEqual("@jane.doe");
  });

  test("single length username with @, should return unchanged", () => {
    expect(toMention("@jane.doe")).toStrictEqual("@jane.doe");
  });
});

describe("UserGroupSchema", () => {
  test("valid user group, should be parsed", () => {
    const input = "<!subteam^S01ABC2DEFG|@ez-pr-devs>";
    expect(UserGroupSchema.parse(input)).toStrictEqual(input);
  });

  const expectedInvalidUserGroupErr = new ZodError([
    {
      validation: "regex",
      code: "invalid_string",
      message: userGroupErrorMsg,
      path: [],
    },
  ]);

  test("empty string, should return validation error", () => {
    try {
      UserGroupSchema.parse("");
    } catch (error) {
      expect(error).toStrictEqual(expectedInvalidUserGroupErr);
    }
  });

  test("mention, should return validation error", () => {
    try {
      UserGroupSchema.parse("@jane.doe");
    } catch (error) {
      expect(error).toStrictEqual(expectedInvalidUserGroupErr);
    }
  });
});

describe("UserGroupAsMentionSchema", () => {
  test("valid user group, should be parse out mention", () => {
    const input = "<!subteam^S01ABC2DEFG|@ez-pr-devs>";
    expect(UserGroupAsMentionSchema.parse(input)).toStrictEqual("@ez-pr-devs");
  });
});

describe("ChannelSchema Validate", () => {
  test("channel, should be valid", () => {
    const input = "channel";
    expect(ChannelSchema.parse(input)).toStrictEqual(input);
  });

  test("#channel, should be valid", () => {
    const input = "#channel";
    expect(ChannelSchema.parse(input)).toStrictEqual(input);
  });

  test("#channel with spaces at front/back, should be valid", () => {
    expect(ChannelSchema.parse("  #channel  ")).toStrictEqual("#channel");
  });
});
