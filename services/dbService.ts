import { db, isConfigured } from '../firebaseConfig';
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { Product, BlogPost, SiteImages } from '../types';

// Coleções
const PRODUCTS_COLLECTION = 'products';
const BLOG_COLLECTION = 'blog';
const SETTINGS_COLLECTION = 'settings';

export const dbService = {
  // --- PRODUTOS ---
  async getProducts(): Promise<Product[]> {
    if (!isConfigured) {
      console.warn("Firebase não configurado. Usando dados locais (Modo Demo).");
      return [];
    }
    try {
      const snapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
      return snapshot.docs.map(doc => doc.data() as Product).sort((a, b) => a.id - b.id);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      return [];
    }
  },

  async saveProduct(product: Product) {
    if (!isConfigured) return;
    try {
      await setDoc(doc(db, PRODUCTS_COLLECTION, product.id.toString()), product);
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      throw error;
    }
  },

  async deleteProduct(id: number) {
    if (!isConfigured) return;
    try {
      await deleteDoc(doc(db, PRODUCTS_COLLECTION, id.toString()));
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      throw error;
    }
  },

  // --- BLOG ---
  async getBlogPosts(): Promise<BlogPost[]> {
    if (!isConfigured) return [];
    try {
      const snapshot = await getDocs(collection(db, BLOG_COLLECTION));
      return snapshot.docs.map(doc => doc.data() as BlogPost).sort((a, b) => b.id - a.id);
    } catch (error) {
      console.error("Erro ao buscar blog:", error);
      return [];
    }
  },

  async saveBlogPost(post: BlogPost) {
    if (!isConfigured) return;
    try {
      await setDoc(doc(db, BLOG_COLLECTION, post.id.toString()), post);
    } catch (error) {
      console.error("Erro ao salvar post:", error);
      throw error;
    }
  },

  async deleteBlogPost(id: number) {
    if (!isConfigured) return;
    try {
      await deleteDoc(doc(db, BLOG_COLLECTION, id.toString()));
    } catch (error) {
      console.error("Erro ao deletar post:", error);
      throw error;
    }
  },

  // --- IMAGENS DO SITE ---
  async getSiteImages(defaultImages: SiteImages): Promise<SiteImages> {
    if (!isConfigured) return defaultImages;
    try {
      const docRef = doc(db, SETTINGS_COLLECTION, 'images');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { ...defaultImages, ...docSnap.data() } as SiteImages;
      } else {
        // Se não existir, tenta criar o inicial (somente se configurado)
        try {
          await setDoc(docRef, defaultImages);
        } catch (e) {
          console.warn("Não foi possível criar imagens iniciais no Firestore.");
        }
        return defaultImages;
      }
    } catch (error) {
      console.error("Erro ao buscar imagens:", error);
      return defaultImages;
    }
  },

  async saveSiteImages(images: SiteImages) {
    if (!isConfigured) return;
    try {
      await setDoc(doc(db, SETTINGS_COLLECTION, 'images'), images);
    } catch (error) {
      console.error("Erro ao salvar imagens:", error);
      throw error;
    }
  }
};