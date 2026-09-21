import React, { useState } from 'react';
import { Camera, ShoppingBag, Heart, Eye } from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice, getFilterStyle } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  currency: Currency;
  onSelectProduct: (product: Product) => void;
  onOpenPhotoStudio: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  onSelectProduct,
  onOpenPhotoStudio,
  onQuickAdd,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const primaryImage =
    product.images.find((img) => img.isPrimary) || product.images[0] || {
      id: 'default',
      url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80',
      alt: product.title,
      isPrimary: true,
    };

  const secondaryImage =
    product.images.find((img) => !img.isPrimary) || primaryImage;

  const activeImage = isHovered && secondaryImage ? secondaryImage : primaryImage;

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-[#EBE4D8] hover:border-[#C9A982] hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Stage */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F4EFE6] cursor-pointer">
        <img
          src={activeImage.url}
          alt={activeImage.alt || product.title}
          onClick={() => onSelectProduct(product)}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          style={{
            filter: getFilterStyle(activeImage.filters),
          }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          {product.badge && (
            <span className="px-2.5 py-1 bg-[#1A1816]/85 backdrop-blur-md text-[#FAF8F5] text-[10px] uppercase font-semibold tracking-wider rounded-md shadow-sm">
              {product.badge}
            </span>
          )}
          {product.salePrice && (
            <span className="px-2.5 py-1 bg-[#8C6D46] text-[#FAF8F5] text-[10px] uppercase font-semibold tracking-wider rounded-md shadow-sm">
              Sale
            </span>
          )}
        </div>

        {/* Floating Quick Action Icons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          {/* Direct "Edit Picture" Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenPhotoStudio(product);
            }}
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-[#3E342A] hover:bg-[#2D241A] hover:text-[#FAF8F5] flex items-center justify-center shadow-md transition-transform duration-200 hover:scale-110"
            title="Edit Garment Photos & Filters"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>

          {/* Wishlist toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsWishlisted(!isWishlisted);
            }}
            className={`w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md transition-transform duration-200 hover:scale-110 ${
              isWishlisted ? 'text-red-500 fill-red-500' : 'text-[#5C5247] hover:text-red-500'
            }`}
            title="Save to Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Quick Add Overlay on Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd(product);
            }}
            className="w-full py-2.5 bg-[#1F1B16]/90 hover:bg-[#1A1816] backdrop-blur-md text-[#FAF8F5] text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg transition"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#D9C4A5]" /> Quick Add to Bag
          </button>
        </div>
      </div>

      {/* Garment Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Color Dots */}
          <div className="flex items-center gap-1.5 mb-2">
            {product.colors.slice(0, 4).map((color, idx) => (
              <span
                key={idx}
                title={color.name}
                className="w-3 h-3 rounded-full border border-black/15 shrink-0"
                style={{ backgroundColor: color.hex }}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-[10px] text-[#8C8377]">+{product.colors.length - 4}</span>
            )}
          </div>

          <h3
            onClick={() => onSelectProduct(product)}
            className="font-serif-brand text-base font-medium text-[#1F1B16] hover:text-[#8C6D46] cursor-pointer transition line-clamp-1"
          >
            {product.title}
          </h3>

          <p className="text-xs text-[#7A7268] line-clamp-1 mt-0.5">
            {product.fabrics[0] || product.category}
          </p>
        </div>

        {/* Pricing & Length note */}
        <div className="flex items-baseline justify-between mt-3 pt-2 border-t border-[#F2ECE1]">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-[#1F1B16]">
              {formatPrice(product.salePrice || product.price, currency)}
            </span>
            {product.salePrice && (
              <span className="text-xs text-[#9E9589] line-through">
                {formatPrice(product.price, currency)}
              </span>
            )}
          </div>

          <span className="text-[11px] text-[#8A8175]">Lengths: 52"-60"</span>
        </div>
      </div>
    </div>
  );
};
