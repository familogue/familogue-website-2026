import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import fs from "fs";

const FIXTURE = {
  services: [
    {
      slug: "alpha",
      title: "中文標題",
      title_en: "English Title",
      content: "中文內容",
      content_en: "English content",
      image: "/images/alpha.png",
      status: "Published",
    },
    {
      slug: "beta",
      title: "乙標題",
      title_en: "Beta Title",
      content: "乙內容",
      content_en: "Beta content",
      image: null,
      status: "Archived",
    },
    {
      slug: "gamma",
      title: "丙標題",
      title_en: "Gamma Title",
      content: "丙內容",
      content_en: "Gamma content",
      image: "/images/gamma.png",
      status: "Published",
    },
    {
      slug: "delta",
      title: "丁標題",
      title_en: "Delta Title",
      content: "丁內容",
      content_en: "Delta content",
      image: null,
      status: "Published",
    },
  ],
};

vi.mock("fs");

describe("getAllServices", () => {
  beforeEach(() => {
    vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(FIXTURE));
  });

  afterEach(() => {
    vi.resetModules();
  });

  it("returns only Published rows", async () => {
    const { getAllServices } = await import("src/utils/sdk/services");
    const results = getAllServices("en");
    expect(results.map(r => r.slug)).toEqual(["alpha", "gamma", "delta"]);
  });

  it("maps zh locale fields", async () => {
    const { getAllServices } = await import("src/utils/sdk/services");
    const [first] = getAllServices("zh");
    expect(first.title).toBe("中文標題");
    expect(first.content).toBe("中文內容");
  });

  it("maps en locale fields", async () => {
    const { getAllServices } = await import("src/utils/sdk/services");
    const [first] = getAllServices("en");
    expect(first.title).toBe("English Title");
    expect(first.content).toBe("English content");
  });

  it("maps image to array when present", async () => {
    const { getAllServices } = await import("src/utils/sdk/services");
    const [first] = getAllServices("en");
    expect(first.image).toEqual(["/images/alpha.png"]);
  });

  it("maps null image to empty array", async () => {
    const { getAllServices } = await import("src/utils/sdk/services");
    const results = getAllServices("en");
    const delta = results.find(r => r.slug === "delta")!;
    expect(delta.image).toEqual([]);
  });
});
