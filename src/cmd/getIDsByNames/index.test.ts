/* eslint-disable @typescript-eslint/no-var-requires */
import { GetIDsByNamesCommand } from ".";

const { WebClient } = require("@slack/web-api");

jest.mock("@slack/web-api");

describe("GetIDsByNamesCommand", () => {
  function mockClientResponse(response: any) {
    WebClient.mockImplementation(() => {
      return {
        users: {
          list: () => {
            return response;
          },
        },
      };
    });
  }

  test("happy path", async () => {
    const mockResponse = {
      ok: true,
      members: [
        {
          id: "U123",
          name: "john.doe",
        },
      ],
    };

    mockClientResponse(mockResponse);
    const client = new WebClient({});
    const cmd = new GetIDsByNamesCommand(client, ["john.doe"]);

    const username = await cmd.handle();
    expect(username).toStrictEqual(["U123"]);
  });
});
