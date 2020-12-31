export type ProjectTag =
  | 'data vis'
  | 'open-source'
  | 'web'
  | 'tool'
  | 'library'
  | 'color'
  | 'physical'
  | 'maps'
  | 'personal-project'
  | 'biology';

export type ProjectRole = 'design' | 'engineering' | 'product' | 'prototyping' | 'visualization';

export type ProjectTech = 'TypeScript' | 'JavaScript' | 'GraphQL' | 'Figma' | 'redux' | 'Python';

export type Project = {
  title: string;
  subtitle?: string;
  description?: string;
  thumbnailUrl?: string;
  externalUrls?: { url: string; label: string }[];
  href: string;
  tags: ProjectTag[];
  dates: [string, string];
  roles?: ProjectRole[];
  employer?: 'personal' | 'airbnb' | 'interana' | 'ucsf' | 'insight';
};
