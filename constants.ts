import { Product, BlogPost } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Pão Francês Tradicional",
    description: "Crocante por fora, macio por dentro. A fornada sai a cada hora.",
    price: 1.50,
    category: 'paes',
    imageUrl: "https://picsum.photos/id/1080/400/300"
  },
  {
    id: 2,
    name: "Baguete Rústica",
    description: "Fermentação natural de 48 horas com farinha importada.",
    price: 12.90,
    category: 'paes',
    imageUrl: "https://picsum.photos/id/1062/400/300"
  },
  {
    id: 3,
    name: "Croissant Amanteigado",
    description: "Folhado perfeitamente com manteiga extra.",
    price: 9.50,
    category: 'salgados',
    imageUrl: "https://picsum.photos/id/431/400/300"
  },
  {
    id: 4,
    name: "Sonho de Doce de Leite",
    description: "Massa leve recheada com doce de leite caseiro.",
    price: 6.00,
    category: 'doces',
    imageUrl: "https://picsum.photos/id/493/400/300"
  },
  {
    id: 5,
    name: "Pão de Queijo Mineiro",
    description: "Feito com queijo da Canastra curado.",
    price: 4.50,
    category: 'salgados',
    imageUrl: "https://picsum.photos/id/292/400/300"
  },
  {
    id: 6,
    name: "Torta de Morango",
    description: "Base crocante, creme patissière e morangos frescos.",
    price: 15.00,
    category: 'doces',
    imageUrl: "https://picsum.photos/id/102/400/300"
  },
  {
    id: 7,
    name: "Cappuccino Italiano",
    description: "Expresso, leite vaporizado e cacau em pó.",
    price: 8.90,
    category: 'bebidas',
    imageUrl: "https://picsum.photos/id/425/400/300"
  },
  {
    id: 8,
    name: "Focaccia de Alecrim",
    description: "Com azeite de oliva extra virgem e flor de sal.",
    price: 18.00,
    category: 'paes',
    imageUrl: "https://picsum.photos/id/305/400/300"
  }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  { 
    id: 1,
    title: "Os segredos da Fermentação Natural", 
    date: "12 Out 2023", 
    imageUrl: "https://picsum.photos/id/1080/400/250",
    excerpt: "Descubra como o tempo e a paciência transformam farinha e água em arte."
  },
  { 
    id: 2,
    title: "Cardápio Especial de Natal: Encomende já", 
    date: "05 Nov 2023", 
    imageUrl: "https://picsum.photos/id/102/400/250",
    excerpt: "Nossas rabanadas e panetones artesanais já estão disponíveis para encomenda."
  },
  { 
    id: 3,
    title: "Como conservar seu pão fresco por mais tempo", 
    date: "20 Set 2023", 
    imageUrl: "https://picsum.photos/id/1062/400/250",
    excerpt: "Dicas simples de armazenamento para manter a crocância por dias."
  }
];

export const CONTACT_INFO = {
  phone: "(11) 99999-9999",
  address: "Rua do Trigo, 123 - Bairro Fermento",
  email: "contato@paodahora.com.br"
};