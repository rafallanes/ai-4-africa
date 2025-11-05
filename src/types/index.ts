export type ProjectStatus = "buscando" | "apadrinado" | "completado";

export interface School {
  id: string;
  name: string;
  city: string;
  country: string;
  studentCount: number;
  ageRange: string;
  trainingLanguage: string;
  hasMaterials: boolean;
  preferredDates: string;
  requiredAmount: number;
  contactName: string;
  contactEmail: string;
  validated: boolean;
}

export interface Ambassador {
  id: string;
  name: string;
  country: string;
  email: string;
  linkedin?: string;
  cvUrl: string;
  expertise: string;
  motivation: string;
  validated: boolean;
}

export interface Project {
  id: string;
  school: School;
  ambassador?: Ambassador;
  status: ProjectStatus;
  sponsoringCompany?: Company;
  finalStudentCount?: number;
  testimonials?: string;
  mediaUrls?: string[];
  comments?: string;
}

export interface Company {
  id: string;
  name: string;
  contactName: string;
  contactEmail: string;
  logoUrl?: string;
  commitment: boolean;
}
