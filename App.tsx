
import React, { useState, useEffect } from 'react';
import { INITIAL_BLOG_POSTS } from './constants';
import { ViewState, SiteImages, BlogPost } from './types';
import AdminPanel from './components/AdminPanel';
import BakerChat from './components/BakerChat';
import { dbService } from './services/dbService';
import { 
  ShoppingBag, Menu, X, Instagram, Facebook, MapPin, 
  Quote, Briefcase, CheckCircle2, Clock, Users, Flame, 
  Award, Settings, Loader2, Star, AlertCircle
} from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(() => {
    const isUrlAdmin = window.location.pathname.includes('/admin') || window.location.hash === '#admin';
    return isUrlAdmin ? ViewState.ADMIN : ViewState.HOME;
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [products, setProducts] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(INITIAL_BLOG_POSTS);
  
  const defaultImages: SiteImages = {
    logo: 'https://promo.paodahoraevoce.com/assets/logo-pao-6hfdDllO.png', 
    footerLogo: 'https://promo.paodahoraevoce.com/assets/logo-pao-6hfdDllO.png',
    hero: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    historyOld: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    historyNew: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    services: 'https://bonaliment.com.br/wp-content/uploads/2025/02/Coffee-Break-e-Brunch-1-edited.jpg'
  };

  const [siteImages, setSiteImages] = useState<SiteImages>(defaultImages);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [fetchedProducts, fetchedBlog, fetchedImages] = await Promise.all([
          dbService.getProducts().catch(() => []),
          dbService.getBlogPosts().catch(() => []),
          dbService.getSiteImages(defaultImages).catch(() => defaultImages)
        ]);

        if (fetchedProducts?.length > 0) setProducts(fetchedProducts);
        if (fetchedBlog?.length > 0) setBlogPosts(fetchedBlog);
        setSiteImages(fetchedImages || defaultImages);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError("Não foi possível carregar os dados. Verifique a conexão.");
        // Não travamos o site se o Firebase falhar, apenas usamos os fallbacks.
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

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

  const NavButton = ({ label, sectionId, active }: { label: string, sectionId?: string, active: boolean }) => (
    <button
      onClick={() => {
        if (sectionId) scrollToSection(sectionId);
      }}
      className={`text-sm font-bold uppercase tracking-wider transition-all duration-300 relative group font-sans ${
        active ? 'text-brand-brown' : 'text-brand-blue hover:text-brand-brown'
      }`}
    >
      {label}
      <span className={`absolute -bottom-1 left-0 h-0.5 bg-brand-wheat transition-all duration-300 ${active ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
    </button>
  );

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-beige p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-serif font-bold text-brand-blue mb-2">Algo deu errado</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="bg-brand-brown text-white px-6 py-2 rounded-lg font-bold">
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-beige">
        <div className="text-center">
           <Loader2 size={48} className="animate-spin text-brand-brown mx-auto mb-4" />
           <p className="font-serif text-brand-blue font-bold tracking-wide">Acendendo o forno...</p>
        </div>
      </div>
    );
  }

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
      
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-brand-wheat/20 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => scrollToSection('top')}
          >
            {siteImages.logo ? (
              <img src={siteImages.logo} alt="Logo" className="h-16 md:h-20 w-auto object-contain" />
            ) : (
              <div className="bg-brand-brown text-white p-2.5 rounded-lg transition-transform group-hover:rotate-12">
                <ShoppingBag size={24} />
              </div>
            )}
          </div>

          <nav className="hidden md:flex gap-8 items-center">
            <NavButton label="Início" sectionId="top" active={true} />
            <NavButton label="História" sectionId="historia" active={false} />
            <NavButton label="Serviços" sectionId="servicos" active={false} />
            <NavButton label="Contato" sectionId="contato" active={false} />
          </nav>

          <button 
            className="md:hidden text-brand-brown"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-brand-beige border-t border-brand-wheat/30 p-6 flex flex-col gap-6 shadow-xl absolute w-full z-50">
            <NavButton label="Início" sectionId="top" active={true} />
            <NavButton label="História" sectionId="historia" active={false} />
            <NavButton label="Serviços" sectionId="servicos" active={false} />
            <NavButton label="Contato" sectionId="contato" active={false} />
          </div>
        )}
      </header>

      <main className="flex-1" id="top">
        
        {/* HERO SECTION */}
        <div className="relative min-h-[600px] flex items-center bg-brand-blue">
          <div className="absolute inset-0 z-0 opacity-40">
            <img src={siteImages.hero} alt="Pães frescos" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-blue via-brand-blue/80 to-transparent z-0"></div>
          
          <div className="relative z-10 container mx-auto px-6 pt-10">
            <div className="max-w-2xl space-y-8">
              <div className="inline-flex items-center gap-2 bg-brand-wheat/20 border border-brand-wheat/30 px-4 py-1.5 rounded-full text-brand-wheat text-xs font-bold tracking-widest uppercase backdrop-blur-sm">
                <Award size={14} /> Tradição desde 2006
              </div>
              <h2 className="text-4xl md:text-6xl font-serif font-bold leading-[1.15] text-white">
                Pão fresquinho <span className="text-brand-wheat italic">o dia todo.</span><br/>
                Como fazemos desde o início.
              </h2>
              <p className="text-lg text-brand-beige/80 font-light leading-relaxed">
                Produção diária, ingredientes de verdade e receitas que aperfeiçoamos há mais de 18 anos em frente ao Parque de Exposições.
              </p>
              <div className="pt-6">
                <button 
                  onClick={() => scrollToSection('contato')}
                  className="px-10 py-4 bg-brand-wheat text-white font-bold rounded-lg hover:bg-brand-brown transition-all shadow-lg flex items-center gap-2 uppercase tracking-wide"
                >
                  <MapPin size={20} /> Onde Estamos
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* WHY CHOOSE US */}
        <div className="py-24 bg-brand-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h3 className="text-brand-wheat font-bold uppercase tracking-widest text-sm mb-3">Nossos Diferenciais</h3>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-blue">Qualidade em cada detalhe</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: <Flame size={32} />, title: "Sempre Quentinho", desc: "Nossos fornos não param. Pão francês saindo a toda hora." },
                { icon: <Users size={32} />, title: "Tradição Familiar", desc: "Uma história que começou com os primos José Maria e Clevson." },
                { icon: <Star size={32} />, title: "Ingredientes Selecionados", desc: "Manteiga de verdade e farinhas de alta qualidade em nossas receitas." }
              ].map((item, idx) => (
                <div key={idx} className="bg-brand-beige/20 p-8 rounded-xl border border-brand-wheat/10 hover:shadow-md transition-all group text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-brand-wheat mx-auto mb-6 shadow-sm group-hover:bg-brand-wheat group-hover:text-white transition-colors">
                    {item.icon}
                  </div>
                  <h4 className="text-xl font-bold font-serif text-brand-blue mb-3">{item.title}</h4>
                  <p className="text-gray-600 leading-relaxed text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* OUR HISTORY */}
        <div id="historia" className="py-24 bg-brand-beige">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="w-full lg:w-1/2 space-y-8">
                <h3 className="text-brand-wheat font-bold uppercase tracking-widest text-sm">Nossa História</h3>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-blue leading-tight">
                  De um sonho pequeno <br/>
                  <span className="text-brand-brown italic">à sua rotina diária.</span>
                </h2>
                <div className="prose prose-lg text-gray-700 space-y-6">
                  <p>
                    Em 2006, os primos <strong>José Maria</strong> e <strong>Clevson</strong> começaram esta jornada. Sem experiência prévia, mas com muita disposição, aprenderam a arte da panificação no dia a dia.
                  </p>
                  <p>
                    Hoje, a Pão da Hora é referência local. Mantemos os mesmos valores do primeiro dia: <strong>Qualidade, Honestidade e Acolhimento.</strong>
                  </p>
                </div>
              </div>
              <div className="w-full lg:w-1/2 grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-3">
                  <img src={siteImages.historyOld} alt="Nossa Origem" className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-xl border-4 border-white transform -rotate-2" />
                  <p className="text-center font-serif italic text-brand-brown text-sm font-bold">Nossa Origem (2006)</p>
                </div>
                <div className="flex flex-col gap-3 pt-12">
                  <img src={siteImages.historyNew} alt="Padaria Hoje" className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-xl border-4 border-white transform rotate-2" />
                  <p className="text-center font-serif italic text-brand-brown text-sm font-bold">Padaria Pão da Hora Hoje</p>
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
                    <span>Nossos Serviços</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight">Soluções para o seu dia</h2>
                  <p className="text-brand-beige/80 text-lg leading-relaxed">
                    Além do atendimento em nossa loja, oferecemos parcerias para empresas e eventos, garantindo sempre produtos frescos e de qualidade.
                  </p>
                  <ul className="grid grid-cols-1 gap-4">
                    <li className="flex items-center gap-2 font-bold"><CheckCircle2 className="text-brand-wheat" size={20} /> Coffee Break Empresarial</li>
                    <li className="flex items-center gap-2 font-bold"><CheckCircle2 className="text-brand-wheat" size={20} /> Fornecimento para Restaurantes</li>
                    <li className="flex items-center gap-2 font-bold"><CheckCircle2 className="text-brand-wheat" size={20} /> Produtos de Fabricação Própria</li>
                  </ul>
               </div>
               <div className="relative">
                  <img src={siteImages.services} alt="Serviços" className="relative rounded-2xl shadow-2xl w-full h-[400px] object-cover" />
               </div>
            </div>
          </div>
        </div>

        {/* TESTIMONIALS */}
        <div className="py-24 bg-brand-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-blue">Quem prova, recomenda</h2>
                    <div className="w-16 h-1 bg-brand-wheat mx-auto mt-4"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                      { name: "Maria Silva", role: "Cliente fiel", text: "O melhor pão da região! Sempre fresquinho e o atendimento é dez." },
                      { name: "João Souza", role: "Morador do bairro", text: "Passo aqui todo dia antes do trabalho. O pão de queijo é viciante." },
                      { name: "Ana Costa", role: "Cliente", text: "Lugar acolhedor e produtos de muita qualidade. Recomendo a todos." }
                    ].map((test, i) => (
                       <div key={i} className="bg-brand-beige/10 p-8 rounded-xl border border-brand-wheat/20 relative shadow-sm">
                          <Quote className="text-brand-wheat/20 absolute top-6 right-6" size={40} />
                          <p className="text-gray-600 italic mb-6">"{test.text}"</p>
                          <h4 className="font-bold text-brand-blue font-serif">{test.name}</h4>
                          <span className="text-xs text-brand-wheat uppercase font-bold tracking-widest">{test.role}</span>
                       </div>
                    ))}
                </div>
            </div>
        </div>

        {/* LOCATION */}
        <div id="contato" className="bg-brand-brown text-white py-20">
           <div className="container mx-auto px-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                   <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Venha nos visitar</h2>
                   <p className="text-brand-beige/80 text-lg mb-8">Estamos na Fernando Costa, em frente ao Parque de Exposições. Pão quente a toda hora esperando por você.</p>
                   <ul className="space-y-6">
                     <li className="flex items-start gap-4">
                       <MapPin className="text-brand-wheat" />
                       <div>
                         <h4 className="font-bold uppercase text-xs tracking-widest mb-1">Endereço</h4>
                         <p className="text-brand-beige/70">Rua Fernando Costa, 123 - Centro (Em frente ao Parque)</p>
                       </div>
                     </li>
                     <li className="flex items-start gap-4">
                       <Clock className="text-brand-wheat" />
                       <div>
                         <h4 className="font-bold uppercase text-xs tracking-widest mb-1">Horários</h4>
                         <p className="text-brand-beige/70">Segunda a Sábado: 06h às 20h | Domingos: 07h às 12h</p>
                       </div>
                     </li>
                   </ul>
                </div>
                <div className="h-[350px] rounded-xl overflow-hidden shadow-2xl border-4 border-white/10">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.2960416237096!2d-46.6333!3d-23.5505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zRmVybmFuZG8gQ29zdGE!5e0!3m2!1spt-BR!2sbr!4v1600000000000!5m2!1spt-BR!2sbr" 
                      width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" 
                      title="Mapa"
                    ></iframe>
                </div>
             </div>
           </div>
        </div>

      </main>

      {/* Baker AI Chatbot Integration */}
      <BakerChat />

      {/* Footer */}
      <footer className="bg-brand-blue text-brand-beige pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                 {siteImages.footerLogo ? (
                   <img src={siteImages.footerLogo} alt="Logo" className="h-12 w-auto object-contain" />
                 ) : (
                   <ShoppingBag size={24} className="text-brand-wheat" />
                 )}
              </div>
              <p className="text-sm opacity-80 leading-relaxed max-w-xs">
                Qualidade, honestidade e pão quentinho a toda hora. Tradição familiar no coração da cidade.
              </p>
            </div>
            
            <div>
              <h4 className="text-brand-wheat font-bold mb-6 font-serif uppercase tracking-wider text-xs">Links Úteis</h4>
              <ul className="space-y-3 text-sm opacity-80">
                <li><button onClick={() => scrollToSection('top')} className="hover:text-brand-wheat transition-colors">Início</button></li>
                <li><button onClick={() => scrollToSection('historia')} className="hover:text-brand-wheat transition-colors">Historia</button></li>
                <li><button onClick={() => scrollToSection('servicos')} className="hover:text-brand-wheat transition-colors">Serviços</button></li>
                <li><button onClick={() => scrollToSection('contato')} className="hover:text-brand-wheat transition-colors">Contato</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-brand-wheat font-bold mb-6 font-serif uppercase tracking-wider text-xs">Siga-nos</h4>
              <div className="flex gap-4">
                <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-brand-wheat hover:text-brand-blue transition-all"><Instagram size={20} /></a>
                <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-brand-wheat hover:text-brand-blue transition-all"><Facebook size={20} /></a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex justify-between items-center text-[10px] uppercase tracking-widest opacity-60">
            <p>&copy; {new Date().getFullYear()} Padaria Pão da Hora. Todos os direitos reservados.</p>
            <button onClick={() => setView(ViewState.ADMIN)} className="text-brand-beige hover:text-white flex items-center gap-1">
              <Settings size={12} /> Painel
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default App;
