/* eslint-disable @typescript-eslint/no-var-requires */
import { SlackMessage } from "../../types";
import { PostMessageCommand } from ".";

const { WebClient } = require("@slack/web-api");

jest.mock("@slack/web-api");

describe("PostMessageCommand", () => {
  function mockClientResponse(response: any) {
    WebClient.mockImplementation(() => {
      return {
        chat: {
          postMessage: () => {
            return response;
          },
        },
      };
    });
  }

  test("happy path", async () => {
    const mockResponse = {
      ok: true,
    };

    mockClientResponse(mockResponse);
    const client = new WebClient({});
    const cmd = new PostMessageCommand(client, new SlackMessage([], "", ""));
    const result = await cmd.handle();
    expect(result.ok).toBeTruthy();
  });
});
