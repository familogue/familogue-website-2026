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
};