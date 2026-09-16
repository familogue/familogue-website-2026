import { describe, expect, it } from "vitest";
import { CATEGORY_ORDER, getAllServices, getServicesByCategory } from "@/utils/sdk/services";
import { getAllTeamMembers, ROLE_ORDER } from "@/utils/sdk/team";
import enMessages from "../../messages/en.json";
import zhMessages from "../../messages/zh.json";

describe("service categories", () => {
  it("every published service has a valid category", () => {
    for (const service of getAllServices("en")) {
      expect(CATEGORY_ORDER, `${service.slug} has category "${service.category}"`)
        .toContain(service.category);
    }
  });

  it("every category is labelled in both locales", () => {
    for (const category of CATEGORY_ORDER) {
      for (const messages of [enMessages, zhMessages]) {
        const entry = (messages as unknown as Record<string, Record<string, { name: string; tagline: string; }>>)
          .ServiceCategories[category];
        expect(entry?.name, category).toBeTruthy();
        expect(entry?.tagline, category).toBeTruthy();
      }
    }
  });

  it("groups published services without dropping any", () => {
    const grouped = getServicesByCategory("en").flatMap((g) => g.services);
    expect(grouped).toHaveLength(getAllServices("en").length);
  });
});

describe("team", () => {
  const team = getAllTeamMembers("en");
  const serviceSlugs = new Set(getAllServices("en").map((s) => s.slug));

  it("every member has a known role", () => {
    for (const member of team) {
      expect(ROLE_ORDER, member.slug).toContain(member.role);
    }
  });

  it("every referenced service slug exists and is published", () => {
    for (const member of team) {
      for (const slug of member.services) {
        expect([...serviceSlugs], `${member.slug} -> ${slug}`).toContain(slug);
      }
    }
  });

  it("every role is labelled in both locales", () => {
    for (const role of ROLE_ORDER) {
      for (const messages of [enMessages, zhMessages]) {
        const labels = (messages as unknown as Record<string, Record<string, string>>).TeamRoles;
        expect(labels[role], role).toBeTruthy();
      }
    }
  });

  it("member slugs are unique", () => {
    const slugs = team.map((m) => m.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
