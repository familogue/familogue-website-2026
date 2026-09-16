export type BlogMetadata = {
  author?: string;
  date?: string;
  type?: string;
  description?: string;
  tags?: string[];
  title?: string;
  image?: string;
};

export type ServiceRecord = {
  title: string;
  content: string;
  slug: string;
  image: string[];
  category: ServiceCategory;
};

export type MediaRecord = {
  outlet: string;
  headline: string;
  date: string;
  url: string;
  thumbnail?: string;
  status: "Published" | "Archived";
};

export type ServiceCategory =
  | "language-acquisition"
  | "therapeutic-services"
  | "community-services";

export type TeamRole =
  | "speech-language-pathologist"
  | "occupational-therapist"
  | "occupational-therapist-assistant"
  | "counsellor"
  | "behaviour-analyst"
  | "social-skills-instructor";

export type TeamMemberRecord = {
  slug: string;
  name: string;
  role: TeamRole;
  credentials: string;
  languages: string[];
  content: string;
  certifications: string[];
  photo: string | null;
  services: string[];
};
