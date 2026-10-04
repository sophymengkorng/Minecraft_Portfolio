import { describe, expect, it } from "vitest";
import { consoleApiUrl, DEFAULT_CONSOLE_API_URL } from "@/config/console";

describe("consoleApiUrl", () => {
  it("defaults to the production console when unset or blank", () => {
    expect(consoleApiUrl(undefined).href).toBe(DEFAULT_CONSOLE_API_URL);
    expect(consoleApiUrl("  ").href).toBe(DEFAULT_CONSOLE_API_URL);
  });

  it("accepts https and strips a trailing slash", () => {
    expect(consoleApiUrl("https://console.example.com/api/v1/").href).toBe(
      "https://console.example.com/api/v1",
    );
  });

  it("allows plain http only for a console on this machine", () => {
    expect(consoleApiUrl("http://127.0.0.1:8000/api/v1").port).toBe("8000");
    expect(consoleApiUrl("http://localhost:8000/api/v1").hostname).toBe("localhost");
    expect(() => consoleApiUrl("http://console.cachewraith.com/api/v1")).toThrow("must use https://");
    expect(() => consoleApiUrl("http://10.0.0.5/api/v1")).toThrow("must use https://");
  });

  it("rejects other schemes and junk", () => {
    expect(() => consoleApiUrl("ftp://console.cachewraith.com")).toThrow("must use https://");
    expect(() => consoleApiUrl("not a url")).toThrow("not a valid URL");
  });
});
