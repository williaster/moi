export type ProjectTag =
  | 'visualization'
  | 'web'
  | 'design'
  | 'tool'
  | 'library'
  | 'color'
  | 'physical'
  | 'map';

export type ProjectRole = 'design' | 'engineering' | 'product' | 'prototyping' | 'visualization';

export type ProjectTech = 'TypeScript' | 'JavaScript' | 'GraphQL' | 'Figma' | 'redux' | 'Python';

export type Project = {
  title: string;
  subtitle?: string;
  description?: string;
  thumbnailUrl?: string;
  href: string;
  tags: ProjectTag[];
  date: string | [string, string];
  roles?: ProjectRole[];
};
