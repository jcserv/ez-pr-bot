/* eslint-disable @typescript-eslint/no-var-requires */
import { View } from "@slack/bolt";

import { OpenModalCommand } from ".";

const { WebClient } = require("@slack/web-api");

jest.mock("@slack/web-api");

describe("OpenModalCommand", () => {
  function mockClientResponse(response: any) {
    WebClient.mockImplementation(() => {
      return {
        views: {
          open: () => {
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
    const mockModal = {
      type: "modal",
    };
    const cmd = new OpenModalCommand(client, "trigger-id", mockModal as View);
    const result = await cmd.handle();
    expect(result?.ok).toBeTruthy();
  });
});
