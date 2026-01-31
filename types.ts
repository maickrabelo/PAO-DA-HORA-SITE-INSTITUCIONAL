export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: 'paes' | 'doces' | 'salgados' | 'bebidas';
  imageUrl: string;
}

export interface BlogPost {
  id: number;
  title: string;
  date: string;
  imageUrl: string;
  excerpt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum ViewState {
  HOME = 'HOME',
  ABOUT = 'ABOUT',
  ADMIN = 'ADMIN'
}

export interface SiteImages {
  logo: string;
  footerLogo: string;
  hero: string;
  historyOld: string;
  historyNew: string;
  services: string;
}