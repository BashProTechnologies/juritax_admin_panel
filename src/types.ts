export interface Stat {
  id: string;
  label: string;
  value: number;
  icon: string;
}

export interface Service {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  background_image?: string;
  status: 'Aktiv' | 'Deaktiv' | 'Gözləmədə';
  features: string[];
  updated_at: string;
}

export interface SocialMedia {
  id: string;
  name: string;
  url: string;
  status: 'Aktiv' | 'Deaktiv';
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  image: string;
  category_id: number;
  brand_id: number;
  status: 'Aktiv' | 'Deaktiv';
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Brand {
  id: number;
  name: string;
}

export interface Certificate {
  id: number;
  title: string;
  image: string;
  status: 'Aktiv' | 'Deaktiv';
}

export interface CertificateSettings {
  title: string;
  subtitle: string;
  is_enabled: boolean;
}

export interface Client {
  id: number;
  name?: string;
  logo: string;
  status: 'Aktiv' | 'Deaktiv';
  created_at: string;
}

export interface ClientSettings {
  title: string;
  subtitle: string;
  is_enabled: boolean;
}

export interface ContactInfo {
  id: number;
  hero_title: string;
  hero_subtitle: string;
  button_text: string;
  phone: string;
  email: string;
  address: string;
  map_url: string;
}

export interface Log {
  id: number;
  action: string;
  details: string;
  created_at: string;
}

export interface CorporateInfo {
  id: number;
  hero_title: string;
  hero_subtitle: string;
  main_image: string;
  values: string; // JSON string array of objects {title, description, icon}
}

export interface TeamMember {
  id: number;
  name: string;
  position: string;
  description: string;
  image: string;
  linkedin_url: string;
  show_linkedin: boolean;
  status: 'Aktiv' | 'Deaktiv';
}

export interface BlogPost {
  id: number;
  title: string;
  subtitle: string;
  content: string;
  image: string;
  slug: string;
  status: 'Aktiv' | 'Deaktiv';
  created_at: string;
  updated_at: string;
}

export interface Settings {
  id: string;
  value: string;
}

export interface Subscriber {
  id: number;
  email: string;
  created_at: string;
}
