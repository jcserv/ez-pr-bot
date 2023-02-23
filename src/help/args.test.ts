import { error, ezprHelp, HelpArguments, helpUsage, renderMessage } from ".";
import helpOverview from "./overview.json";

describe("HelpArguments", () => {
  describe("Constructor", () => {
    test("/help, should set message as helpOverview.blocks", () => {
      expect(new HelpArguments("").message).toBe(helpOverview.blocks);
    });

    test("/help usage, should set message as helpUsage", () => {
      expect(new HelpArguments("usage").message).toBe(helpUsage);
    });

    test("/help ezpr, should set message as ezPrHelp", () => {
      expect(new HelpArguments("ezpr").message).toBe(ezprHelp);
    });

    test("/help [unknown topic], should set message as error(topic)", () => {
      expect(new HelpArguments("swag").message).toStrictEqual(error("swag"));
    });
  });

  describe("renderMessage", () => {
    test("topic is empty, should return helpOverview.blocks", () => {
      expect(renderMessage("")).toBe(helpOverview.blocks);
    });

    test("/help usage, should set message as helpUsage", () => {
      expect(renderMessage("usage")).toBe(helpUsage);
    });

    test("/help ezpr, should set message as ezPrHelp", () => {
      expect(renderMessage("ezpr")).toBe(ezprHelp);
    });

    test("/help [unknown topic], should set message as error(topic)", () => {
      expect(renderMessage("swag")).toStrictEqual(error("swag"));
    });
  });
});
