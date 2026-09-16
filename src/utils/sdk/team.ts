import fs from "fs";
import path from "path";
import { TeamMemberRecord, TeamRole } from "src/types";

type TeamRow = {
  slug: string;
  name: string;
  role: TeamRole;
  credentials: string;
  languages: string[];
  content: string;
  content_en: string;
  certifications: string[];
  photo: string | null;
  services: string[];
  status: string;
};

/** Display order of role groups on /our-therapists. */
export const ROLE_ORDER: TeamRole[] = [
  "speech-language-pathologist",
  "occupational-therapist",
  "occupational-therapist-assistant",
  "counsellor",
  "behaviour-analyst",
  "social-skills-instructor",
];

function loadRows(): TeamRow[] {
  const filePath = path.join(process.cwd(), "content/team.json");
  const { team: rows }: { team: TeamRow[] } = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return rows;
}

function toRecord(r: TeamRow, locale: string): TeamMemberRecord {
  return {
    slug: r.slug,
    name: r.name,
    role: r.role,
    credentials: r.credentials,
    languages: r.languages,
    content: locale === "zh" ? r.content : r.content_en,
    certifications: r.certifications,
    photo: r.photo,
    services: r.services,
  };
}

export function getAllTeamMembers(locale: string): TeamMemberRecord[] {
  return loadRows().filter(r => r.status === "Published").map(r => toRecord(r, locale));
}

/** Team members grouped by role, in ROLE_ORDER. Empty roles are dropped. */
export function getTeamByRole(locale: string): { role: TeamRole; members: TeamMemberRecord[]; }[] {
  const all = getAllTeamMembers(locale);
  return ROLE_ORDER
    .map(role => ({ role, members: all.filter(m => m.role === role) }))
    .filter(group => group.members.length > 0);
}

/** Members who deliver a given service, in ROLE_ORDER. Empty when the service has no team. */
export function getTeamForService(slug: string, locale: string): TeamMemberRecord[] {
  return getAllTeamMembers(locale)
    .filter(m => m.services.includes(slug))
    .sort((a, b) => ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role));
}
