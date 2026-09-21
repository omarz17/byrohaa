import React from 'react';
import { Sparkles, Shield, Truck, Package, ArrowRight, Layers } from 'lucide-react';
import { Collection } from '../types';

interface HeroBannerProps {
  currentCollection?: Collection;
  onExploreCollection: () => void;
  onOpenStudio: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  currentCollection,
  onExploreCollection,
  onOpenStudio,
}) => {
  return (
    <div className="relative overflow-hidden bg-[#F2EADB] border-b border-[#E8DFC8]">
      {/* Editorial Main Stage */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text & Brand Philosophy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#D5CBB9] text-[#6E5D4B] text-xs font-medium tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#8C6D46]" />
              <span>{currentCollection?.season || "Atelier '26 Edition"}</span>
            </div>

            <h1 className="font-serif-brand text-4xl sm:text-5xl lg:text-6xl font-normal text-[#1A1816] tracking-tight leading-[1.12]">
              {currentCollection?.name || 'Contemporary Modest Elegance'}
            </h1>

            <p className="text-sm sm:text-base text-[#594E41] max-w-xl leading-relaxed font-light">
              {currentCollection?.description ||
                'Tailored with fluid Medina silk, Japanese matte crepe, and pure European linen. Designed with expansive silhouettes and customizable abaya lengths for effortless modesty.'}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreCollection}
                className="px-6 py-3 bg-[#2D241A] hover:bg-[#1A140E] text-[#FAF8F5] rounded-xl text-xs font-medium tracking-wider uppercase flex items-center gap-2 shadow-md transition"
              >
                Shop Collection <ArrowRight className="w-3.5 h-3.5 text-[#D9C4A5]" />
              </button>

              <button
                onClick={onOpenStudio}
                className="px-5 py-3 bg-white/90 hover:bg-white text-[#3E342A] border border-[#D5CBB9] rounded-xl text-xs font-medium tracking-wide flex items-center gap-2 shadow-sm transition"
              >
                <Layers className="w-3.5 h-3.5 text-[#8C6D46]" /> Manage Collections
              </button>
            </div>
          </div>

          {/* Right Editorial Visual Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm lg:max-w-none">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/60 bg-[#E8DFC8]">
                <img
                  src={
                    currentCollection?.coverImage ||
                    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80'
                  }
                  alt={currentCollection?.name || 'byrohaa Modest Collection'}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating aesthetic stamp */}
              <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-[#EBE4D8] max-w-[200px]">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C6D46] block">
                  Craftsmanship
                </span>
                <p className="text-xs text-[#2E2822] font-medium mt-0.5 leading-snug">
                  100% Opaque & Non-Clinging Silhouettes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Craft Value Pillars */}
      <div className="bg-[#FAF8F5] border-t border-[#EBE4D8] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-[#52473A]">
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-[#8C6D46] shrink-0" />
              <div>
                <span className="font-semibold block text-[#1F1B16]">Modest Cut Guarantee</span>
                <span className="text-[11px] text-[#7A7268]">Zero transparency guaranteed</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4 text-[#8C6D46] shrink-0" />
              <div>
                <span className="font-semibold block text-[#1F1B16]">Tailored Lengths 50"-60"</span>
                <span className="text-[11px] text-[#7A7268]">Customized modest drop</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-[#8C6D46] shrink-0" />
              <div>
                <span className="font-semibold block text-[#1F1B16]">Tracked Express Courier</span>
                <span className="text-[11px] text-[#7A7268]">Discrete signed parcel</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[#8C6D46] shrink-0" />
              <div>
                <span className="font-semibold block text-[#1F1B16]">Keepsake Gift Pouch</span>
                <span className="text-[11px] text-[#7A7268]">Free luxury satin dustbag</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
