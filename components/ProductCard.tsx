import React from 'react';
import { Product } from '../types';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group border border-brand-wheat/20 flex flex-col h-full">
      <div className="relative overflow-hidden aspect-[4/3]">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-3 left-3 bg-brand-blue/90 backdrop-blur-sm px-3 py-1 rounded-sm text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">
          {product.category}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <div className="mb-6 flex-1">
          <h3 className="font-serif text-xl font-bold text-brand-brown mb-2 group-hover:text-brand-wheat transition-colors">{product.name}</h3>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 font-sans">{product.description}</p>
        </div>
        
        <div className="mt-auto pt-4 border-t border-brand-beige">
          <button 
            className="w-full py-3 rounded-lg bg-brand-brown text-white flex items-center justify-center gap-2 hover:bg-brand-blue transition-all duration-300 shadow-md hover:shadow-lg font-bold uppercase tracking-wider text-sm"
            onClick={() => alert(`Você selecionou: ${product.name}. Entre em contato para encomendar!`)}
          >
            <ShoppingCart size={18} /> Selecionar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;