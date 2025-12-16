import React, { useState, useRef, useEffect } from 'react';
import { PRODUCTS, INITIAL_BLOG_POSTS } from './constants';
import { ViewState, Product, SiteImages, BlogPost } from './types';
import ProductCard from './components/ProductCard';
import AdminPanel from './components/AdminPanel';
import { dbService } from './services/dbService';
import { 
  ShoppingBag, Menu, X, Instagram, Facebook, MapPin, 
  ChevronRight, Star, Quote, ArrowLeft, ArrowRight, Sparkles, 
  Briefcase, CheckCircle2, Clock, Users, Truck, Flame, 
  Award, ShieldCheck, MessageCircle,
  Settings, Loader2
} from 'lucide-react';
import BakerChat from './components/BakerChat';

const App: React.FC = () => {
  // Inicializa a view baseada na URL atual. Se for /admin, abre direto no Admin.
  const [view, setView] = useState<ViewState>(() => {
    const path = window.location.pathname;
    return path.startsWith('/admin') ? ViewState.ADMIN : ViewState.HOME;
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filter, setFilter] = useState<string>('todos');
  const [loading, setLoading] = useState(true);
  
  // State initialization
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(INITIAL_BLOG_POSTS);
  
  const defaultImages: SiteImages = {
    logo: '', 
    footerLogo: '',
    hero: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    historyOld: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    historyNew: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    services: 'https://images.unsplash.com/photo-1519659528534-7fd733a832a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  };

  const [siteImages, setSiteImages] = useState<SiteImages>(defaultImages);

  // Sincroniza a URL com o estado da View
  useEffect(() => {
    if (view === ViewState.ADMIN) {
      window.history.pushState({}, '', '/admin');
    } else {
      // Se estivesse no admin e saiu, volta a URL para a raiz
      if (window.location.pathname.startsWith('/admin')) {
        window.history.pushState({}, '', '/');
      }
    }
  }, [view]);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/admin')) {
        setView(ViewState.ADMIN);
      } else {
        setView(ViewState.HOME);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // --- LOAD FROM FIREBASE ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const [fetchedProducts, fetchedBlog, fetchedImages] = await Promise.all([
          dbService.getProducts(),
          dbService.getBlogPosts(),
          dbService.getSiteImages(defaultImages)
        ]);

        if (fetchedProducts.length > 0) setProducts(fetchedProducts);
        if (fetchedBlog.length > 0) setBlogPosts(fetchedBlog);
        setSiteImages(fetchedImages);
      } catch (error) {
        console.error("Erro ao carregar dados do Firebase:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Shortcut for Admin Panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + Shift + A to open Admin
      if (e.ctrlKey && e.shiftKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setView(ViewState.ADMIN);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredProducts = filter === 'todos' 
    ? products 
    : products.filter(p => p.category === filter);

  const favoriteProducts = products.filter(p => [1, 3, 4, 6].includes(p.id));

  const scrollFavorites = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = 340;
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const scrollToSection = (sectionId: string) => {
    setView(ViewState.HOME);
    setMobileMenuOpen(false);
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  const NavButton = ({ label, targetView, sectionId, active }: { label: string, targetView: ViewState, sectionId?: string, active: boolean }) => (
    <button
      onClick={() => {
        if (sectionId) {
          scrollToSection(sectionId);
        } else {
          setView(targetView);
          setMobileMenuOpen(false);
          window.scrollTo(0, 0);
        }
      }}
      className={`text-sm font-bold uppercase tracking-wider transition-all duration-300 relative group font-sans ${
        active 
          ? 'text-brand-brown' 
          : 'text-brand-blue hover:text-brand-brown'
      }`}
    >
      {label}
      <span className={`absolute -bottom-1 left-0 h-0.5 bg-brand-wheat transition-all duration-300 ${active ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
    </button>
  );

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-beige">
        <div className="text-center">
           <Loader2 size={48} className="animate-spin text-brand-brown mx-auto mb-4" />
           <p className="font-serif text-brand-blue font-bold">Acendendo o forno...</p>
        </div>
      </div>
    );
  }

  // If in Admin View
  if (view === ViewState.ADMIN) {
    return (
      <AdminPanel 
        products={products}
        setProducts={setProducts}
        siteImages={siteImages}
        setSiteImages={setSiteImages}
        blogPosts={blogPosts}
        setBlogPosts={setBlogPosts}
        onLogout={() => setView(ViewState.HOME)}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-white font-sans selection:bg-brand-brown selection:text-white">
      
      {/* Header - Clean & Elegant */}
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-brand-wheat/20 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => scrollToSection('top')}
          >
            {siteImages.logo ? (
              <img src={siteImages.logo} alt="Logo Pão da Hora" className="h-20 md:h-24 w-auto object-contain" />
            ) : (
              <div className="bg-brand-brown text-white p-2.5 rounded-lg transition-transform group-hover:rotate-12">
                <ShoppingBag size={24} />
              </div>
            )}
            
            {/* Texto do cabeçalho removido conforme solicitado */}
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8 items-center">
            <NavButton label="Início" targetView={ViewState.HOME} sectionId="top" active={view === ViewState.HOME} />
            <NavButton label="História" targetView={ViewState.HOME} sectionId="historia" active={false} />
            <NavButton label="Cardápio" targetView={ViewState.MENU} active={view === ViewState.MENU} />
            <NavButton label="Serviços" targetView={ViewState.HOME} sectionId="servicos" active={false} />
            <NavButton label="Contato" targetView={ViewState.HOME} sectionId="contato" active={false} />
            <button 
               onClick={() => { setView(ViewState.MENU); window.scrollTo(0,0); }}
               className="bg-brand-brown text-white px-6 py-2.5 rounded font-bold hover:bg-brand-blue transition-colors text-sm shadow-md hover:shadow-lg uppercase tracking-wide border border-transparent hover:border-brand-wheat"
            >
              Encomendar
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-brand-brown"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-brand-beige border-t border-brand-wheat/30 p-6 flex flex-col gap-6 shadow-xl absolute w-full z-50">
            <NavButton label="Início" targetView={ViewState.HOME} sectionId="top" active={view === ViewState.HOME} />
            <NavButton label="História" targetView={ViewState.HOME} sectionId="historia" active={false} />
            <NavButton label="Cardápio" targetView={ViewState.MENU} active={view === ViewState.MENU} />
            <NavButton label="Serviços" targetView={ViewState.HOME} sectionId="servicos" active={false} />
            <NavButton label="Contato" targetView={ViewState.HOME} sectionId="contato" active={false} />
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1" id="top">
        
        {/* HERO SECTION */}
        {view === ViewState.HOME && (
          <div className="animate-fadeIn">
            <div className="relative min-h-[700px] flex items-center bg-brand-blue">
              {/* Background Image with Overlay */}
              <div className="absolute inset-0 z-0 opacity-40">
                <img 
                  src={siteImages.hero} 
                  alt="Balcão de padaria com pães frescos" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-brand-blue via-brand-blue/80 to-transparent z-0"></div>
              
              <div className="relative z-10 container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 pt-10">
                <div className="space-y-8 animate-slideRight">
                  
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 bg-brand-wheat/20 border border-brand-wheat/30 px-4 py-1.5 rounded-full text-brand-wheat text-xs font-bold tracking-widest uppercase backdrop-blur-sm">
                    <Award size={14} /> Tradição desde 2006
                  </div>

                  {/* Headline */}
                  <h2 className="text-4xl md:text-6xl font-serif font-bold leading-[1.15] text-white">
                    Pão fresquinho <span className="text-brand-wheat italic">o dia todo.</span><br/>
                    Como fazemos desde 2006.
                  </h2>
                  
                  {/* Subhead */}
                  <p className="text-lg text-brand-beige/80 max-w-lg font-light leading-relaxed">
                    Produção diária, ingredientes de verdade e receitas que aperfeiçoamos há mais de 18 anos.
                  </p>

                  {/* Micro Provas Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
                    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/10">
                      <Users className="text-brand-wheat shrink-0" size={20} />
                      <span className="text-sm text-white font-medium">+1000 pessoas passam por aqui todos os dias</span>
                    </div>
                    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/10">
                      <Truck className="text-brand-wheat shrink-0" size={20} />
                      <span className="text-sm text-white font-medium">+250 famílias e empresas atendidas diariamente</span>
                    </div>
                    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/10">
                      <Flame className="text-brand-wheat shrink-0" size={20} />
                      <span className="text-sm text-white font-medium">Fornos que nunca desligam</span>
                    </div>
                    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/10">
                      <Clock className="text-brand-wheat shrink-0" size={20} />
                      <span className="text-sm text-white font-medium">Produtos sempre fresquinhos</span>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="pt-6 flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={() => { setView(ViewState.MENU); window.scrollTo(0, 0); }}
                      className="px-8 py-4 bg-brand-wheat text-brand-blue font-bold rounded-lg hover:bg-white transition-all shadow-lg flex items-center justify-center gap-2 uppercase tracking-wide"
                    >
                      <Menu size={20} /> Ver Cardápio
                    </button>
                    <button 
                      className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-brand-blue transition-all flex items-center justify-center gap-2 uppercase tracking-wide"
                      onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
                    >
                      <MessageCircle size={20} /> Encomendar
                    </button>
                    <button 
                      onClick={() => scrollToSection('contato')}
                      className="px-8 py-4 bg-brand-brown/50 text-white font-bold rounded-lg hover:bg-brand-brown transition-all flex items-center justify-center gap-2 uppercase tracking-wide backdrop-blur-sm"
                    >
                      <MapPin size={20} /> Como Chegar
                    </button>
                  </div>
                  
                </div>
              </div>
            </div>

            {/* SECOND SECTION - WHY CHOOSE US */}
            <div className="py-24 bg-brand-white">
              <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                  <h3 className="text-brand-brown font-bold uppercase tracking-widest text-sm mb-3">Nossos Diferenciais</h3>
                  <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-blue">Por que nos escolher?</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    {
                      icon: <Flame size={32} />,
                      title: "Pão sempre fresco",
                      desc: "Porque é assado o dia todo. Nossos fornos ficam ligados o dia todo. O resultado você sente na primeira mordida."
                    },
                    {
                      icon: <Users size={32} />,
                      title: "Consistência Garantida",
                      desc: "1000 pessoas por dia não voltam por acaso. O movimento é grande, mas o motivo é simples: entregar a mesma qualidade todos os dias."
                    },
                    {
                      icon: <Truck size={32} />,
                      title: "250 entregas diárias",
                      desc: "Assinantes recebem nossos produtos em casa ou no trabalho. Com qualidade, determinação e processos que garantem a excelência."
                    },
                    {
                      icon: <Star size={32} />,
                      title: "Ingredientes Especiais",
                      desc: "Farinha boa muda o pão. Queijo bom muda o pão de queijo. Manteiga de verdade muda tudo. E usamos tudo isso."
                    },
                    {
                      icon: <Award size={32} />,
                      title: "Receitas de Gerações",
                      desc: "Combinações únicas e aprimoradas ao longo de quase duas décadas. Unindo as melhores receitas de Vó e os últimos lançamentos."
                    },
                    {
                      icon: <ShieldCheck size={32} />,
                      title: "Equipe Treinada",
                      desc: "Profissionais preparados ensinando do zero o padrão Pão da Hora, sempre prontos para te receber com um sorriso."
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-brand-beige/30 p-8 rounded-xl border border-brand-wheat/20 hover:border-brand-wheat hover:shadow-lg transition-all group">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-brand-brown mb-6 shadow-sm group-hover:bg-brand-brown group-hover:text-white transition-colors">
                        {item.icon}
                      </div>
                      <h4 className="text-xl font-bold font-serif text-brand-blue mb-3">{item.title}</h4>
                      <p className="text-gray-600 leading-relaxed text-sm md:text-base">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* OUR HISTORY SECTION */}
            <div id="historia" className="py-24 bg-brand-beige">
              <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                  
                  {/* Text Content */}
                  <div className="w-full lg:w-1/2 space-y-8 order-2 lg:order-1">
                    <h3 className="text-brand-brown font-bold uppercase tracking-widest text-sm">Nossa História</h3>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-blue leading-tight">
                      A Pão da Hora começou pequena. <br/>
                      <span className="text-brand-brown italic">Muito pequena.</span>
                    </h2>
                    
                    <div className="prose prose-lg text-gray-700 space-y-6">
                      <p>
                        Em 2006, os primos <strong className="text-brand-blue">José Maria</strong> e <strong className="text-brand-blue">Clevson</strong> olharam para uma padaria e viram algo simples: <em>“Isso aqui pode mudar nossa vida”</em>.
                      </p>
                      <p>
                        Sem curso, sem experiência, sem glamour. Só trabalho. Aprenderam fazendo, errando, corrigindo e tentando de novo. A receita do pão francês mudava a cada erro, até ficar do jeito que todo mundo conhece hoje.
                      </p>
                      <p>
                        Os anos passaram. Os filhos entraram para o negócio, trazendo processos, organização e modernidade. Mas uma coisa não mudou - e não vai mudar: <strong>Qualidade, Honestidade, Transparência e Acolhimento.</strong>
                      </p>
                      <p>
                        Hoje somos dezenas, fazemos parte da rotina local e seguimos crescendo. E mantemos o mesmo propósito do primeiro dia: Ser o porto seguro do seu dia. O lugar onde o cheiro de pão quentinho faz o mundo parecer mais simples.
                      </p>
                    </div>
                  </div>

                  {/* Image Collage (Old vs New) */}
                  <div className="w-full lg:w-1/2 order-1 lg:order-2">
                    <div className="relative h-[600px] w-full">
                      {/* Old Photo style */}
                      <div className="absolute top-0 right-0 w-3/4 h-3/5 z-10 transform rotate-2 hover:rotate-0 transition-transform duration-500 shadow-2xl border-8 border-white">
                         <img 
                           src={siteImages.historyOld} 
                           alt="Início em 2006" 
                           className="w-full h-full object-cover sepia-[.4]"
                         />
                         <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-2 py-1 font-bold font-mono">2006</div>
                      </div>
                      
                      {/* New Photo style */}
                      <div className="absolute bottom-0 left-0 w-3/4 h-3/5 z-20 transform -rotate-2 hover:rotate-0 transition-transform duration-500 shadow-2xl border-8 border-white">
                         <img 
                           src={siteImages.historyNew} 
                           alt="Padaria Hoje" 
                           className="w-full h-full object-cover"
                         />
                         <div className="absolute bottom-4 right-4 bg-brand-wheat text-brand-blue text-xs px-2 py-1 font-bold font-mono">HOJE</div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* QUERIDINHOS / HIGHLIGHTS */}
            <div className="py-24 bg-white overflow-hidden">
              <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-12 items-center">
                  
                  <div className="w-full lg:w-1/3 space-y-8">
                    <h3 className="text-brand-brown font-bold uppercase tracking-widest text-sm">Clássicos da Casa</h3>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-blue leading-[1.1]">
                      Os queridinhos <br/> da <span className="text-brand-brown relative inline-block">
                        Pão da Hora
                        <Sparkles className="absolute -top-4 -right-6 text-brand-wheat" size={28} fill="currentColor" />
                      </span>
                    </h2>
                    <p className="text-gray-600">Receitas que nossos clientes amam e pedem todos os dias.</p>
                    
                    <div className="flex gap-4 pt-2">
                      <button 
                        onClick={() => scrollFavorites('left')}
                        className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:text-brand-brown hover:border-brand-brown transition-all duration-300"
                      >
                        <ArrowLeft size={24} />
                      </button>
                      <button 
                        onClick={() => scrollFavorites('right')}
                        className="w-12 h-12 rounded-full bg-brand-brown text-white hover:bg-brand-blue flex items-center justify-center transition-all duration-300 shadow-lg"
                      >
                        <ArrowRight size={24} />
                      </button>
                    </div>
                  </div>

                  <div className="w-full lg:w-2/3">
                    <div 
                      ref={scrollContainerRef}
                      className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8 pt-2 pl-2"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      {favoriteProducts.map(product => (
                        <div key={product.id} className="min-w-[280px] sm:min-w-[300px] snap-start">
                          <ProductCard product={product} />
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* SERVICES SECTION */}
            <div id="servicos" className="py-24 bg-brand-blue text-white">
              <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                   <div className="space-y-8">
                      <div className="flex items-center gap-2 text-brand-wheat font-bold uppercase tracking-wider text-sm">
                        <Briefcase size={18} />
                        <span>Soluções Corporativas</span>
                      </div>
                      <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight">Coffee Break Empresarial</h2>
                      <p className="text-brand-beige/80 text-lg leading-relaxed">
                        Leve a Pão da Hora para seu escritório. Transforme reuniões e eventos corporativos em momentos deliciosos com nossos cardápios personalizados.
                      </p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <li className="flex items-center gap-2"><CheckCircle2 className="text-brand-wheat" size={20} /> Entrega Pontual</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="text-brand-wheat" size={20} /> Faturamento para PJ</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="text-brand-wheat" size={20} /> Menu Personalizado</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="text-brand-wheat" size={20} /> Produtos Frescos</li>
                      </ul>
                      <button className="mt-4 bg-brand-wheat text-brand-blue px-8 py-3 rounded font-bold hover:bg-white transition-colors">
                        Solicitar Orçamento
                      </button>
                   </div>
                   <div className="relative">
                      <div className="absolute inset-0 bg-brand-wheat/20 rounded-2xl transform rotate-3"></div>
                      <img src={siteImages.services} alt="Coffee Break" className="relative rounded-2xl shadow-2xl transform -rotate-3 hover:rotate-0 transition-all duration-500 w-full" />
                   </div>
                </div>
              </div>
            </div>

            {/* TESTIMONIALS */}
            <div className="py-24 bg-brand-beige/30">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-blue">
                            Quem prova, recomenda
                        </h2>
                        <div className="w-16 h-1 bg-brand-brown mx-auto mt-4"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                          { name: "Maria Silva", role: "Cliente há 10 anos", text: "O melhor pão de queijo que já comi em toda a cidade! O atendimento é sempre impecável." },
                          { name: "João Souza", role: "Empresário", text: "A baguete de fermentação natural mudou meus cafés da manhã de domingo. Qualidade europeia." },
                          { name: "Ana Costa", role: "Arquiteta", text: "Ambiente acolhedor e os doces são maravilhosos. O sonho de doce de leite é divino!" }
                        ].map((test, i) => (
                           <div key={i} className="bg-white p-8 rounded-xl shadow-sm border border-brand-wheat/20 relative">
                              <Quote className="text-brand-wheat absolute top-6 right-6" size={40} />
                              <div className="flex gap-1 text-brand-wheat mb-4">
                                {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="currentColor" />)}
                              </div>
                              <p className="text-gray-600 italic mb-6">"{test.text}"</p>
                              <div>
                                <h4 className="font-bold text-brand-blue font-serif">{test.name}</h4>
                                <span className="text-xs text-brand-brown uppercase tracking-wider">{test.role}</span>
                              </div>
                           </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* BLOG SECTION (Placeholder) */}
            <div className="py-20 bg-white">
              <div className="container mx-auto px-6">
                 <div className="flex justify-between items-end mb-12">
                    <div>
                      <h3 className="text-brand-brown font-bold uppercase tracking-widest text-sm mb-2">Novidades</h3>
                      <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-blue">Blog Pão da Hora</h2>
                    </div>
                    <button className="hidden md:flex items-center gap-2 text-brand-brown font-bold hover:text-brand-blue transition-colors">
                      Ler todos os artigos <ArrowRight size={18} />
                    </button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {blogPosts.map((post) => (
                      <div key={post.id} className="group cursor-pointer">
                        <div className="overflow-hidden rounded-lg mb-4 aspect-video">
                          <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <span className="text-xs text-brand-brown font-bold uppercase tracking-wider">{post.date}</span>
                        <h4 className="text-xl font-serif font-bold text-brand-blue mt-2 group-hover:text-brand-brown transition-colors">{post.title}</h4>
                      </div>
                    ))}
                 </div>
              </div>
            </div>

            {/* LOCATION SECTION */}
            <div id="contato" className="bg-brand-brown text-white py-20 relative overflow-hidden">
               <div className="container mx-auto px-6 relative z-10">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                       <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Estamos logo ali</h2>
                       <p className="text-brand-beige/80 text-lg mb-8">
                         Na Fernando Costa, em frente ao Parque de Exposições. Um local de fácil acesso para você passar antes ou depois do trabalho.
                       </p>
                       <ul className="space-y-6">
                         <li className="flex items-start gap-4">
                           <div className="bg-white/10 p-3 rounded-full"><MapPin className="text-brand-wheat" /></div>
                           <div>
                             <h4 className="font-bold text-lg">Endereço</h4>
                             <p className="text-brand-beige/70">Rua Fernando Costa, 123 - Centro</p>
                             <p className="text-brand-beige/70">Em frente ao Parque de Exposições</p>
                           </div>
                         </li>
                         <li className="flex items-start gap-4">
                           <div className="bg-white/10 p-3 rounded-full"><Clock className="text-brand-wheat" /></div>
                           <div>
                             <h4 className="font-bold text-lg">Horários</h4>
                             <p className="text-brand-beige/70">Segunda a Sexta: 06h às 20h</p>
                             <p className="text-brand-beige/70">Sábados e Domingos: 07h às 19h</p>
                           </div>
                         </li>
                       </ul>
                    </div>
                    <div className="h-[400px] w-full bg-brand-beige/10 rounded-xl overflow-hidden shadow-2xl border border-brand-wheat/30 relative flex items-center justify-center group">
                        {/* Interactive Map Iframe */}
                        <iframe 
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.2960416237096!2d-46.6333!3d-23.5505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zRmVybmFuZG8gQ29zdGE!5e0!3m2!1spt-BR!2sbr!4v1600000000000!5m2!1spt-BR!2sbr" 
                          width="100%" 
                          height="100%" 
                          style={{ border: 0, filter: 'grayscale(0.3) contrast(1.1) sepia(0.2)' }} 
                          allowFullScreen 
                          loading="lazy" 
                          referrerPolicy="no-referrer-when-downgrade"
                          className="absolute inset-0"
                          title="Mapa da Padaria"
                        ></iframe>
                        <div className="absolute inset-0 bg-brand-blue/10 pointer-events-none"></div>
                        
                        <button 
                          onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=Rua+Fernando+Costa,+123+-+Centro', '_blank')}
                          className="relative z-10 bg-white text-brand-blue px-6 py-2.5 rounded-full font-bold hover:scale-105 transition-transform shadow-lg flex items-center gap-2 text-sm border-2 border-brand-blue"
                        >
                          <MapPin size={18} /> Ver no Google Maps
                        </button>
                    </div>
                 </div>
               </div>
            </div>

          </div>
        )}

        {/* MENU VIEW */}
        {view === ViewState.MENU && (
          <div className="animate-fadeIn min-h-screen bg-brand-beige/20 pb-20">
            <div className="bg-brand-blue py-20 text-center px-4">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Nosso Cardápio</h2>
              <p className="text-brand-wheat text-lg">Sabores que contam nossa história</p>
            </div>

            <div className="container mx-auto px-6 -mt-10">
              <div className="bg-white p-4 rounded-xl shadow-lg flex flex-wrap justify-center gap-3 md:gap-6 mb-12 border border-brand-wheat/20">
                {['todos', 'paes', 'doces', 'salgados', 'bebidas'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-6 py-2 rounded capitalize font-bold transition-all duration-300 text-sm md:text-base font-sans tracking-wide ${
                      filter === cat
                        ? 'bg-brand-brown text-white shadow-md'
                        : 'text-gray-500 hover:bg-brand-beige hover:text-brand-brown'
                    }`}
                  >
                    {cat === 'paes' ? 'Pães' : cat}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* BAKER CHATBOT */}
        <BakerChat />

      </main>

      {/* Footer */}
      <footer className="bg-brand-blue text-brand-beige border-t border-brand-wheat/10 pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                 {siteImages.footerLogo ? (
                    <img src={siteImages.footerLogo} alt="Logo Pão da Hora Rodapé" className="h-12 w-auto object-contain" />
                 ) : siteImages.logo ? (
                    <img src={siteImages.logo} alt="Logo Pão da Hora" className="h-12 w-auto object-contain bg-white/10 p-1 rounded" />
                 ) : (
                   <div className="bg-brand-wheat p-1.5 rounded text-brand-blue"><ShoppingBag size={20} /></div>
                 )}
                 <span className="font-serif font-bold text-2xl text-white">Pão da Hora</span>
              </div>
              <p className="mb-6 text-sm leading-relaxed opacity-80">
                O porto seguro do seu dia. O lugar onde o cheiro de pão quentinho faz o mundo parecer mais simples.
              </p>
              <div className="flex gap-4">
                <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-brand-wheat hover:text-brand-blue transition-all"><Instagram size={20} /></a>
                <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-brand-wheat hover:text-brand-blue transition-all"><Facebook size={20} /></a>
              </div>
            </div>
            
            <div>
              <h4 className="text-brand-wheat font-bold mb-6 font-serif uppercase tracking-wider text-sm">Explorar</h4>
              <ul className="space-y-3 text-sm opacity-80">
                <li><button onClick={() => setView(ViewState.HOME)} className="hover:text-brand-wheat transition-colors">Início</button></li>
                <li><button onClick={() => { setView(ViewState.MENU); window.scrollTo(0,0); }} className="hover:text-brand-wheat transition-colors">Cardápio</button></li>
                <li><button onClick={() => scrollToSection('historia')} className="hover:text-brand-wheat transition-colors">Nossa História</button></li>
                <li><button onClick={() => scrollToSection('servicos')} className="hover:text-brand-wheat transition-colors">Para Empresas</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-brand-wheat font-bold mb-6 font-serif uppercase tracking-wider text-sm">Legal</h4>
              <ul className="space-y-3 text-sm opacity-80">
                <li><a href="#" className="hover:text-brand-wheat transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-brand-wheat transition-colors">Política de Privacidade</a></li>
                <li><a href="#" className="hover:text-brand-wheat transition-colors">Trabalhe Conosco</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-brand-wheat font-bold mb-6 font-serif uppercase tracking-wider text-sm">Newsletter</h4>
              <p className="text-sm opacity-80 mb-4">Receba novidades e promoções exclusivas.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Seu e-mail" className="bg-white/10 border border-white/20 rounded px-3 py-2 text-sm w-full focus:outline-none focus:border-brand-wheat" />
                <button className="bg-brand-wheat text-brand-blue px-3 py-2 rounded font-bold hover:bg-white transition-colors"><ChevronRight size={18} /></button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs opacity-60">
            <p>&copy; {new Date().getFullYear()} Padaria Pão da Hora. Todos os direitos reservados.</p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <p>Desde 2006 fazendo história.</p>
              <button 
                onClick={() => setView(ViewState.ADMIN)}
                className="text-brand-beige hover:text-white transition-colors p-1"
                title="Acesso Administrativo"
              >
                <Settings size={14} />
              </button>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default App;