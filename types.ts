

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  year: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  link?: string;
  technologies: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link?: string;
}

export interface Language {
  id: string;
  language: string;
  proficiency: string;
}

export interface Profile {
  fullName: string;
  title: string;
  email: string;
  phone?: string;
  location?: string;
  summary: string;
  linkedin?: string;
  github?: string;
  skills: string[];
  profilePicture?: string;
}

export type TemplateId = 'modern' | 'classic' | 'creative' | 'ats' | 'minimal' | 'tech' | 'bold' | 'clean' | 'custom';

export type SectionLayout = 'standard' | 'centered' | 'split' | 'grid' | 'cards' | 'minimal';
export type HeaderLayout = 'standard' | 'centered' | 'minimal';

export interface SectionConfig {
    visible: boolean;
    bgColor: string;
    textColor: string;
    layout: SectionLayout;
}

export interface CustomTheme {
    fontHeading: string;
    fontBody: string;
    primaryColor: string;
    accentColor: string;
    headerLayout: HeaderLayout;
    sections: {
        hero: SectionConfig;
        about: SectionConfig;
        experience: SectionConfig;
        projects: SectionConfig;
        education: SectionConfig;
        contact: SectionConfig;
    }
}

export interface Portfolio {
  id: string;
  name: string;
  lastModified: number;
  templateId: TemplateId;
  profile: Profile;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  customTheme?: CustomTheme;
}

export interface TemplateProps {
  data: Portfolio;
  isPreview?: boolean;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  EDITOR = 'EDITOR',
  PREVIEW = 'PREVIEW'
}