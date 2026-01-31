import { db, isConfigured } from '../firebaseConfig';
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { Product, BlogPost, SiteImages } from '../types';

const PRODUCTS_COLLECTION = 'products';
const BLOG_COLLECTION = 'blog';
const SETTINGS_COLLECTION = 'settings';

export const dbService = {
  async getProducts(): Promise<Product[]> {
    if (!isConfigured || !db) return [];
    try {
      const snapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
      return snapshot.docs.map(doc => doc.data() as Product).sort((a, b) => a.id - b.id);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      return [];
    }
  },

  async saveProduct(product: Product) {
    if (!isConfigured || !db) return;
    await setDoc(doc(db, PRODUCTS_COLLECTION, product.id.toString()), product);
  },

  async deleteProduct(id: number) {
    if (!isConfigured || !db) return;
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, id.toString()));
  },

  async getBlogPosts(): Promise<BlogPost[]> {
    if (!isConfigured || !db) return [];
    try {
      const snapshot = await getDocs(collection(db, BLOG_COLLECTION));
      return snapshot.docs.map(doc => doc.data() as BlogPost).sort((a, b) => b.id - a.id);
    } catch (error) {
      console.error("Erro ao buscar blog:", error);
      return [];
    }
  },

  async saveBlogPost(post: BlogPost) {
    if (!isConfigured || !db) return;
    await setDoc(doc(db, BLOG_COLLECTION, post.id.toString()), post);
  },

  async deleteBlogPost(id: number) {
    if (!isConfigured || !db) return;
    await deleteDoc(doc(db, BLOG_COLLECTION, id.toString()));
  },

  async getSiteImages(defaultImages: SiteImages): Promise<SiteImages> {
    if (!isConfigured || !db) return defaultImages;
    try {
      const docRef = doc(db, SETTINGS_COLLECTION, 'images');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { ...defaultImages, ...docSnap.data() } as SiteImages;
      }
      return defaultImages;
    } catch (error) {
      console.error("Erro ao buscar imagens:", error);
      return defaultImages;
    }
  },

  async saveSiteImages(images: SiteImages) {
    if (!isConfigured || !db) return;
    await setDoc(doc(db, SETTINGS_COLLECTION, 'images'), images);
  }
};