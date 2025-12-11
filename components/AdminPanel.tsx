import React, { useState } from 'react';
import { Product, SiteImages, BlogPost } from '../types';
import { dbService } from '../services/dbService';
import { 
  Package, Image as ImageIcon, Plus, Trash2, Edit2, Save, X, 
  LogOut, Upload, Search, CheckCircle, AlertCircle, LayoutDashboard,
  FileText, Camera, Loader2
} from 'lucide-react';

interface AdminPanelProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  siteImages: SiteImages;
  setSiteImages: React.Dispatch<React.SetStateAction<SiteImages>>;
  blogPosts: BlogPost[];
  setBlogPosts: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  products, setProducts, siteImages, setSiteImages, blogPosts, setBlogPosts, onLogout 
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'images' | 'blog'>('products');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  // Loading State
  const [isSaving, setIsSaving] = useState(false);
  
  // Forms State
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingBlog, setIsEditingBlog] = useState(false);
  
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({});
  
  const [searchTerm, setSearchTerm] = useState('');

  // Authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin') {
      setIsAuthenticated(true);
    } else {
      alert('Senha incorreta (Dica: admin)');
    }
  };

  // --- IMAGE UPLOAD LOGIC ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validação de tamanho (limite do Firestore é 1MB, vamos avisar com 700kb)
      if (file.size > 700 * 1024) {
        alert("Atenção: Imagem muito grande! Tente usar uma imagem menor que 700KB para garantir que ela seja salva no banco de dados.");
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        callback(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSiteImage = async (key: keyof SiteImages, url: string) => {
    const newImages = { ...siteImages, [key]: url };
    setSiteImages(newImages); // Update UI immediately
    setIsSaving(true);
    try {
      await dbService.saveSiteImages(newImages);
    } catch (error) {
      alert("Erro ao salvar imagem no banco de dados. Verifique o console.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- PRODUCT LOGIC ---
  const handleDeleteProduct = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      // Optimistic update
      setProducts(products.filter(p => p.id !== id));
      try {
        await dbService.deleteProduct(id);
      } catch (error) {
        alert("Erro ao excluir do banco de dados.");
      }
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct.name || !currentProduct.price) return;

    setIsSaving(true);
    let finalProduct: Product;

    if (currentProduct.id) {
      finalProduct = currentProduct as Product;
      setProducts(products.map(p => p.id === currentProduct.id ? finalProduct : p));
    } else {
      const newId = Math.max(...products.map(p => p.id), 0) + 1;
      finalProduct = { ...currentProduct, id: newId } as Product;
      setProducts([...products, finalProduct]);
    }

    try {
      await dbService.saveProduct(finalProduct);
      setIsEditing(false);
      setCurrentProduct({});
    } catch (error) {
      alert("Erro ao salvar produto no banco de dados.");
    } finally {
      setIsSaving(false);
    }
  };

  const openProductModal = (product?: Product) => {
    if (product) {
      setCurrentProduct({ ...product });
    } else {
      setCurrentProduct({ 
        category: 'paes', 
        imageUrl: 'https://placehold.co/400x300?text=Sem+Imagem',
        price: 0
      });
    }
    setIsEditing(true);
  };

  // --- BLOG LOGIC ---
  const handleDeletePost = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta postagem?')) {
      setBlogPosts(blogPosts.filter(p => p.id !== id));
      try {
        await dbService.deleteBlogPost(id);
      } catch (error) {
        alert("Erro ao excluir do banco de dados.");
      }
    }
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPost.title || !currentPost.excerpt) return;

    setIsSaving(true);
    let finalPost: BlogPost;

    if (currentPost.id) {
      finalPost = currentPost as BlogPost;
      setBlogPosts(blogPosts.map(p => p.id === currentPost.id ? finalPost : p));
    } else {
      const newId = Math.max(...blogPosts.map(p => p.id), 0) + 1;
      const today = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
      finalPost = { ...currentPost, id: newId, date: today } as BlogPost;
      setBlogPosts([...blogPosts, finalPost]);
    }

    try {
      await dbService.saveBlogPost(finalPost);
      setIsEditingBlog(false);
      setCurrentPost({});
    } catch (error) {
      alert("Erro ao salvar post no banco de dados.");
    } finally {
      setIsSaving(false);
    }
  };

  const openBlogModal = (post?: BlogPost) => {
    if (post) {
      setCurrentPost({ ...post });
    } else {
      setCurrentPost({ 
        imageUrl: 'https://placehold.co/400x250?text=Capa+do+Post',
        date: new Date().toLocaleDateString('pt-BR')
      });
    }
    setIsEditingBlog(true);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-blue flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-brand-wheat/20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold text-brand-blue mb-2">Área Restrita</h2>
            <p className="text-gray-500">Acesso administrativo Pão da Hora</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-brand-brown mb-2">Senha de Acesso</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-wheat focus:ring-1 focus:ring-brand-wheat transition-all"
                placeholder="Digite a senha..."
              />
            </div>
            <button className="w-full bg-brand-brown text-white py-3 rounded-lg font-bold hover:bg-brand-wheat hover:text-brand-blue transition-all shadow-lg">
              Entrar no Painel
            </button>
            <button 
              type="button" 
              onClick={onLogout}
              className="w-full text-brand-blue text-sm hover:underline"
            >
              Voltar ao site
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-blue text-white flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-brand-wheat/10">
          <h2 className="font-serif font-bold text-xl text-brand-wheat">Pão da Hora</h2>
          <span className="text-xs uppercase tracking-widest text-brand-beige/50">Admin Panel</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'products' ? 'bg-brand-wheat text-brand-blue font-bold shadow-md' : 'text-brand-beige hover:bg-white/10'}`}
          >
            <Package size={20} /> Produtos
          </button>
          <button 
            onClick={() => setActiveTab('blog')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'blog' ? 'bg-brand-wheat text-brand-blue font-bold shadow-md' : 'text-brand-beige hover:bg-white/10'}`}
          >
            <FileText size={20} /> Blog
          </button>
          <button 
            onClick={() => setActiveTab('images')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'images' ? 'bg-brand-wheat text-brand-blue font-bold shadow-md' : 'text-brand-beige hover:bg-white/10'}`}
          >
            <ImageIcon size={20} /> Fotos do Site
          </button>
        </nav>
        <div className="p-4 border-t border-brand-wheat/10">
          <button onClick={onLogout} className="flex items-center gap-2 text-brand-beige hover:text-white transition-colors">
            <LogOut size={18} /> Sair do Sistema
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile Header */}
        <div className="md:hidden bg-brand-blue text-white p-4 flex justify-between items-center">
           <span className="font-bold">Painel Admin</span>
           <button onClick={onLogout}><LogOut size={20} /></button>
        </div>

        <div className="p-8">
          
          {/* Header */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 font-serif">
                {activeTab === 'products' ? 'Gerenciar Cardápio' : 
                 activeTab === 'blog' ? 'Gerenciar Blog' : 'Gerenciar Fotos'}
              </h1>
              <p className="text-gray-500 mt-1">
                {activeTab === 'products' ? `${products.length} itens cadastrados` : 
                 activeTab === 'blog' ? `${blogPosts.length} postagens publicadas` :
                 'Personalize a aparência do site'}
              </p>
            </div>
            {activeTab === 'products' && (
              <button 
                onClick={() => openProductModal()}
                className="bg-brand-brown text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-blue transition-colors shadow-md"
              >
                <Plus size={20} /> Novo Produto
              </button>
            )}
            {activeTab === 'blog' && (
              <button 
                onClick={() => openBlogModal()}
                className="bg-brand-brown text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-blue transition-colors shadow-md"
              >
                <Plus size={20} /> Nova Postagem
              </button>
            )}
          </div>

          {/* PRODUCTS TAB */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Buscar produto por nome ou categoria..." 
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-wheat"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 font-bold text-gray-600 text-sm uppercase tracking-wider">Produto</th>
                      <th className="px-6 py-4 font-bold text-gray-600 text-sm uppercase tracking-wider">Categoria</th>
                      <th className="px-6 py-4 font-bold text-gray-600 text-sm uppercase tracking-wider">Preço</th>
                      <th className="px-6 py-4 font-bold text-gray-600 text-sm uppercase tracking-wider text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map(product => (
                      <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <img src={product.imageUrl} alt={product.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                            <div>
                              <p className="font-bold text-brand-blue">{product.name}</p>
                              <p className="text-xs text-gray-500 truncate max-w-[200px]">{product.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                            ${product.category === 'paes' ? 'bg-orange-100 text-orange-700' : 
                              product.category === 'doces' ? 'bg-pink-100 text-pink-700' :
                              product.category === 'salgados' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-700">
                          R$ {product.price.toFixed(2).replace('.', ',')}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => openProductModal(product)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Excluir"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* BLOG TAB */}
          {activeTab === 'blog' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map(post => (
                <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col group">
                  <div className="relative h-48 overflow-hidden">
                    <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-2 right-2 flex gap-2">
                       <button onClick={() => openBlogModal(post)} className="bg-white/90 p-2 rounded-lg text-blue-600 hover:bg-blue-600 hover:text-white transition-colors shadow">
                         <Edit2 size={16} />
                       </button>
                       <button onClick={() => handleDeletePost(post.id)} className="bg-white/90 p-2 rounded-lg text-red-600 hover:bg-red-600 hover:text-white transition-colors shadow">
                         <Trash2 size={16} />
                       </button>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <span className="text-xs font-bold text-brand-brown uppercase tracking-wider mb-2">{post.date}</span>
                    <h3 className="font-serif font-bold text-xl text-brand-blue mb-3 leading-tight">{post.title}</h3>
                    <p className="text-gray-500 text-sm line-clamp-3 mb-4">{post.excerpt}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* IMAGES TAB */}
          {activeTab === 'images' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.entries(siteImages).map(([key, url]) => (
                <div key={key} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="mb-4 aspect-video rounded-lg overflow-hidden bg-gray-100 border border-gray-200 relative group">
                    <img src={url || 'https://placehold.co/400x300?text=Sem+Imagem'} alt={key} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm font-bold">
                      Visualização
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-blue capitalize mb-2">
                      {key === 'hero' ? 'Banner Principal (Início)' : 
                       key === 'historyOld' ? 'Foto Antiga (História)' :
                       key === 'historyNew' ? 'Foto Atual (História)' : 
                       key === 'logo' ? 'Logomarca do Site' :
                       'Banner Serviços'}
                    </h3>
                    <div className="flex gap-2 items-center mt-2">
                      {isSaving ? (
                        <div className="flex items-center gap-2 text-sm text-brand-brown">
                          <Loader2 size={16} className="animate-spin" /> Salvando...
                        </div>
                      ) : (
                        <label className="flex-1 bg-brand-beige/30 hover:bg-brand-beige text-brand-brown border border-brand-wheat/50 rounded-lg p-2 flex items-center justify-center gap-2 cursor-pointer transition-colors text-sm font-bold">
                          <Upload size={16} /> Alterar Imagem
                          <input 
                            type="file" 
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, (newUrl) => handleSaveSiteImage(key as keyof SiteImages, newUrl))}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* MODAL EDIT/CREATE PRODUCT */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="bg-brand-blue p-6 flex justify-between items-center text-white sticky top-0 z-10">
              <h3 className="font-bold font-serif text-xl">
                {currentProduct.id ? 'Editar Produto' : 'Novo Produto'}
              </h3>
              <button onClick={() => setIsEditing(false)} className="hover:bg-white/10 p-1 rounded">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Nome do Produto</label>
                  <input 
                    required
                    type="text" 
                    value={currentProduct.name || ''}
                    onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand-wheat focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Preço (R$)</label>
                  <input 
                    required
                    type="number" 
                    step="0.10"
                    value={currentProduct.price || ''}
                    onChange={e => setCurrentProduct({...currentProduct, price: parseFloat(e.target.value)})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand-wheat focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Categoria</label>
                  <select 
                    value={currentProduct.category || 'paes'}
                    onChange={e => setCurrentProduct({...currentProduct, category: e.target.value as any})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand-wheat focus:border-transparent outline-none bg-white"
                  >
                    <option value="paes">Pães</option>
                    <option value="doces">Doces</option>
                    <option value="salgados">Salgados</option>
                    <option value="bebidas">Bebidas</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Imagem do Produto</label>
                  
                  {currentProduct.imageUrl && (
                    <img src={currentProduct.imageUrl} alt="Preview" className="h-40 w-full object-cover rounded mb-2 border border-gray-200" />
                  )}
                  
                  <label className="w-full bg-gray-50 hover:bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-colors">
                    <Camera className="text-gray-400 mb-1" size={24} />
                    <span className="text-sm text-gray-500 font-bold">Clique para enviar foto</span>
                    <input 
                      type="file" 
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, (url) => setCurrentProduct({...currentProduct, imageUrl: url}))}
                    />
                  </label>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Descrição</label>
                  <textarea 
                    rows={3}
                    value={currentProduct.description || ''}
                    onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand-wheat focus:border-transparent outline-none"
                  ></textarea>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded font-bold"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="px-6 py-2 bg-brand-blue text-white rounded hover:bg-brand-brown transition-colors font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? <Loader2 className="animate-spin" /> : <Save size={18} />} Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT/CREATE BLOG POST */}
      {isEditingBlog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="bg-brand-blue p-6 flex justify-between items-center text-white sticky top-0 z-10">
              <h3 className="font-bold font-serif text-xl">
                {currentPost.id ? 'Editar Postagem' : 'Nova Postagem'}
              </h3>
              <button onClick={() => setIsEditingBlog(false)} className="hover:bg-white/10 p-1 rounded">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSavePost} className="p-6 space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Título</label>
                  <input 
                    required
                    type="text" 
                    value={currentPost.title || ''}
                    onChange={e => setCurrentPost({...currentPost, title: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand-wheat focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Capa da Postagem</label>
                  
                  {currentPost.imageUrl && (
                    <img src={currentPost.imageUrl} alt="Preview" className="h-40 w-full object-cover rounded mb-2 border border-gray-200" />
                  )}
                  
                  <label className="w-full bg-gray-50 hover:bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-colors">
                    <Camera className="text-gray-400 mb-1" size={24} />
                    <span className="text-sm text-gray-500 font-bold">Clique para enviar foto</span>
                    <input 
                      type="file" 
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, (url) => setCurrentPost({...currentPost, imageUrl: url}))}
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Resumo / Conteúdo</label>
                  <textarea 
                    rows={5}
                    value={currentPost.excerpt || ''}
                    onChange={e => setCurrentPost({...currentPost, excerpt: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand-wheat focus:border-transparent outline-none"
                    placeholder="Escreva um breve resumo..."
                  ></textarea>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsEditingBlog(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded font-bold"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="px-6 py-2 bg-brand-blue text-white rounded hover:bg-brand-brown transition-colors font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? <Loader2 className="animate-spin" /> : <Save size={18} />} Salvar Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;