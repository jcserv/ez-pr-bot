/* eslint-disable @typescript-eslint/no-var-requires */
import { GetNameByIDCommand } from ".";

const { WebClient } = require("@slack/web-api");

jest.mock("@slack/web-api");

describe("GetNameByID", () => {
  function mockClientResponse(response: any) {
    WebClient.mockImplementation(() => {
      return {
        users: {
          info: () => {
            return response;
          },
        },
      };
    });
  }

  test("happy path", async () => {
    const mockResponse = {
      ok: true,
      user: {
        real_name: "john.doe",
      },
    };

    mockClientResponse(mockResponse);
    const client = new WebClient({});
    const cmd = new GetNameByIDCommand(client, "U123");

    const username = await cmd.handle();
    expect(username).toBe("john.doe");
  });
});
