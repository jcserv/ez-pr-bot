/* eslint-disable @typescript-eslint/no-var-requires */
import { GetUsersInUserGroupCommand } from ".";

const { WebClient } = require("@slack/web-api");

jest.mock("@slack/web-api");

describe("GetUsersInUserGroupCommand", () => {
  function mockClientResponse(response: any) {
    WebClient.mockImplementation(() => {
      return {
        usergroups: {
          users: {
            list: () => {
              return response;
            },
          },
        },
      };
    });
  }

  test("happy path", async () => {
    const mockResponse = {
      ok: true,
      users: ["U123"],
    };

    mockClientResponse(mockResponse);
    const client = new WebClient({});
    const cmd = new GetUsersInUserGroupCommand(client, "S123");

    const username = await cmd.handle();
    expect(username).toStrictEqual(["U123"]);
  });
});
