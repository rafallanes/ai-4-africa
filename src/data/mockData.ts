import { Project, School, Ambassador, Company } from "@/types";

export const mockSchools: School[] = [
  {
    id: "sch-1",
    name: "Kibera Girls Academy",
    city: "Nairobi",
    country: "Kenya",
    studentCount: 180,
    ageRange: "13-17",
    trainingLanguage: "English",
    hasMaterials: false,
    preferredDates: "March 2025",
    requiredAmount: 3500,
    contactName: "Mary Wanjiku",
    contactEmail: "mary@kiberagirls.edu.ke",
    validated: true,
  },
  {
    id: "sch-2",
    name: "Lagos Tech Secondary School",
    city: "Lagos",
    country: "Nigeria",
    studentCount: 320,
    ageRange: "14-18",
    trainingLanguage: "English",
    hasMaterials: true,
    preferredDates: "February 2025",
    requiredAmount: 2800,
    contactName: "Emmanuel Okonkwo",
    contactEmail: "e.okonkwo@lagostech.ng",
    validated: true,
  },
];

export const mockAmbassadors: Ambassador[] = [
  {
    id: "amb-1",
    name: "Sarah Chen",
    country: "United States",
    email: "sarah.chen@email.com",
    linkedin: "https://linkedin.com/in/sarahchen",
    cvUrl: "https://drive.google.com/cv-sarahchen",
    expertise: "ML Engineer with 8 years experience in NLP and computer vision",
    motivation: "Passionate about democratizing AI education globally",
    validated: true,
  },
  {
    id: "amb-2",
    name: "Amadou Diallo",
    country: "France",
    email: "a.diallo@email.fr",
    linkedin: "https://linkedin.com/in/amadoudiallo",
    cvUrl: "https://drive.google.com/cv-amadou",
    expertise: "AI researcher specializing in education technology",
    motivation: "Want to give back to my home continent through tech education",
    validated: true,
  },
];

export const mockCompanies: Company[] = [
  {
    id: "comp-1",
    name: "TechForGood Foundation",
    contactName: "Jennifer Martinez",
    contactEmail: "jennifer@techforgood.org",
    logoUrl: undefined,
    commitment: true,
  },
];

export const mockProjects: Project[] = [
  {
    id: "proj-1",
    school: mockSchools[0],
    ambassador: mockAmbassadors[0],
    status: "apadrinado",
    sponsoringCompany: mockCompanies[0],
  },
  {
    id: "proj-2",
    school: mockSchools[1],
    ambassador: mockAmbassadors[1],
    status: "completado",
    finalStudentCount: 315,
    testimonials: "The students were incredibly engaged! Many expressed interest in pursuing AI careers. The workshops exceeded our expectations.",
    mediaUrls: ["https://example.com/photos"],
    comments: "Amadou was fantastic. Would love to host him again for advanced workshops.",
  },
  {
    id: "proj-3",
    school: {
      id: "sch-3",
      name: "Accra Future Academy",
      city: "Accra",
      country: "Ghana",
      studentCount: 220,
      ageRange: "12-16",
      trainingLanguage: "English",
      hasMaterials: false,
      preferredDates: "April 2025",
      requiredAmount: 4200,
      contactName: "Kwame Asante",
      contactEmail: "k.asante@accrafuture.gh",
      validated: true,
    },
    status: "buscando",
  },
];
