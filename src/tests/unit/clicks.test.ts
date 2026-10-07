import { afterEach, describe, expect, it, vi } from "vitest";
import { clickUrl, isProjectLink, sendClick } from "@/modules/portfolio/clicks";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("clickUrl", () => {
  it("builds the project's click endpoint and escapes the slug", () => {
    const endpoint = "https://console.cachewraith.com/api/v1/portfolio/projects";
    expect(clickUrl(endpoint, "wraithnote")).toBe(`${endpoint}/wraithnote/clicks`);
    expect(clickUrl(endpoint, "a/../b")).toBe(`${endpoint}/a%2F..%2Fb/clicks`);
  });
});

describe("isProjectLink", () => {
  it("accepts only live and repo", () => {
    expect(isProjectLink("live")).toBe(true);
    expect(isProjectLink("repo")).toBe(true);
    expect(isProjectLink("cover")).toBe(false);
    expect(isProjectLink(null)).toBe(false);
  });
});

describe("sendClick", () => {
  it("beacons the link as a form body", () => {
    const sendBeacon = vi.fn(() => true);
    const fetch = vi.fn();
    vi.stubGlobal("navigator", { sendBeacon });
    vi.stubGlobal("fetch", fetch);

    sendClick("https://c.example/clicks", "repo");

    const [url, body] = sendBeacon.mock.calls[0] as unknown as [string, URLSearchParams];
    expect(url).toBe("https://c.example/clicks");
    expect(body.toString()).toBe("link=repo");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("falls back to a keepalive fetch when the beacon isn't queued", () => {
    vi.stubGlobal("navigator", { sendBeacon: () => false });
    const fetch = vi.fn(async () => new Response(null));
    vi.stubGlobal("fetch", fetch);

    sendClick("https://c.example/clicks", "live");

    expect(fetch).toHaveBeenCalledWith(
      "https://c.example/clicks",
      expect.objectContaining({ method: "POST", keepalive: true, mode: "no-cors" }),
    );
  });

  it("never throws when the request is blocked", () => {
    vi.stubGlobal("navigator", {
      sendBeacon: () => {
        throw new TypeError("blocked");
      },
    });
    expect(() => sendClick("https://c.example/clicks", "live")).not.toThrow();
  });
});
