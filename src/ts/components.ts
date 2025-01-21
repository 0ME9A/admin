export interface ServiceDataProps {
  id?: string;
  title: string;
  desc: string;
  url: string;
  img: {
    src: string;
    alt: string;
    size: { w: number; h: number };
  };
}

export interface ProjectFace {
  _id: string;
  title: string;
  address: string;
  desc: string;
  date: string;
  projectType: string[];
  status: "completed" | "ongoing" | string;
  previewImages: string[];
}

export interface GalleryFace {
  _id: string;
  title: string;
  desc: string;
  previewImages: string[];
}

export interface TestimonialFace {
  _id: string; // MongoDB ObjectId as a string
  name: string;
  profession: string;
  message: string;
  rate: number; // Represents rating as a number (4.8 in the example)
  date: string; // ISO date string
  profile: string; // URL to the profile image
  email: string;
}

export interface CountryPhoneCode {
  name: string;
  dial_code: string;
  code: string;
}

export interface CertificateFace {
  _id: string;
  title: string;
  desc: string;
  name: string;
  certSrc: string;
  certId: string;
  createdAt?: string;
  updatedAt?: string;
  issueDate: string;
}

export interface PaginationFace {
   totalProjects: number;
   totalPages: number;
   currentPage: number;
   limit: number;
 }