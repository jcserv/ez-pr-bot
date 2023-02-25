import {
  ChannelSchema,
  IsUserGroup,
  toMention,
  toMentions,
  UserGroupToMentionStringSchema,
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

describe("IsUserGroup", () => {
  test("empty string, should return false", () => {
    expect(IsUserGroup("")).toStrictEqual(false);
  });

  test("mention string, should return false", () => {
    expect(IsUserGroup("@jane.doe")).toStrictEqual(false);
  });

  test("valid usergroup string, should return true", () => {
    expect(IsUserGroup("<!subteam^S04HKF5MKRP|@ez-pr-devs>")).toStrictEqual(
      true
    );
  });
});

describe("UserGroupToMentionStringSchema", () => {
  test("valid usergroup string, should return mention", () => {
    expect(
      UserGroupToMentionStringSchema.parse("<!subteam^S04HKF5MKRP|@ez-pr-devs>")
    ).toStrictEqual("@ez-pr-devs");
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
