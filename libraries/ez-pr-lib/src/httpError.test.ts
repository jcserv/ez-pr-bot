import { HTTPError, isHTTPError } from "./httpError";

describe("Error", () => {
  test("create an error and convert to string", () => {
    const input = "Error occurred";
    const err = new Error(input);
    expect(err.message).toBe(input);
    expect(err.toString()).toBe("Error: " + input);
  });
});

describe("HTTPError", () => {
  test("create a 400 error and convert to string", () => {
    const code = 400;
    const input = "Parameter user_id should be string";
    const err = new HTTPError(code, input);
    expect(err.message).toBe(input);
    expect(err.toString()).toBe("400 Bad Request - " + input);
  });

  test("create a 401 error and convert to string", () => {
    const code = 401;
    const input = "Bot is not authorized";
    const err = new HTTPError(code, input);
    expect(err.message).toBe(input);
    expect(err.toString()).toBe("401 Unauthorized - " + input);
  });

  test("create a 403 error and convert to string", () => {
    const code = 403;
    const input = "Not Allowed";
    const err = new HTTPError(code, input);
    expect(err.message).toBe(input);
    expect(err.toString()).toBe("403 Forbidden - " + input);
  });

  test("create a 404 error and convert to string", () => {
    const code = 404;
    const input = "User does not exist";
    const err = new HTTPError(code, input);
    expect(err.message).toBe(input);
    expect(err.toString()).toBe("404 Not Found - " + input);
  });

  test("create a 500 error and convert to string", () => {
    const code = 500;
    const input = "Request context deadline exceeded";
    const err = new HTTPError(code, input);
    expect(err.message).toBe(input);
    expect(err.GetStatusCode()).toBe(code);
    expect(err.toString()).toBe("500 Internal Server Error - " + input);
  });
});

describe("isHTTPError", () => {
  test("provide HTTPError, should return true", () => {
    const code = 400;
    const input = "Parameter user_id should be string";
    const err = new HTTPError(code, input);
    expect(isHTTPError(err)).toBeTruthy();
  });

  test("provide non-HTTP Error, should return false", () => {
    const input = "Error occurred";
    const err = new Error(input);
    expect(isHTTPError(err)).toBeFalsy();
  });
});
