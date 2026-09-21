import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  SlidersHorizontal,
  Layers,
  Sparkles,
  Camera,
  Heart,
  Globe,
  Menu,
  X,
} from 'lucide-react';
import { Currency, Collection, GarmentCategory } from '../types';

interface NavbarProps {
  collections: Collection[];
  activeCollectionId: string | 'all';
  activeCategory: GarmentCategory;
  currency: Currency;
  cartCount: number;
  searchQuery: string;
  onSelectCollection: (colId: string | 'all') => void;
  onSelectCategory: (cat: GarmentCategory) => void;
  onChangeCurrency: (curr: Currency) => void;
  onSearchChange: (q: string) => void;
  onOpenCart: () => void;
  onOpenCollectionStudio: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  collections,
  activeCollectionId,
  activeCategory,
  currency,
  cartCount,
  searchQuery,
  onSelectCollection,
  onSelectCategory,
  onChangeCurrency,
  onSearchChange,
  onOpenCart,
  onOpenCollectionStudio,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const categories: GarmentCategory[] = [
    'All',
    'Abayas',
    'Hijabs & Scarves',
    'Modest Sets',
    'Kimonos & Kaftans',
    'Occasion Wear',
    'Prayer Sets',
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EBE4D8] transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-[#2D241A] text-[#FAF8F5] text-[11px] px-4 py-1.5 flex items-center justify-between font-medium">
        <div className="hidden sm:flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A982]" />
          <span>New Collection: Ramadan & Eid Atelier '26</span>
        </div>

        <div className="mx-auto sm:mx-0 flex items-center gap-1.5">
          <span>Complimentary express delivery on orders over $150</span>
          <span className="hidden md:inline text-[#C9A982] font-semibold">| Code: ROHAA10</span>
        </div>

        {/* Currency Picker */}
        <div className="flex items-center gap-1 text-[11px]">
          <Globe className="w-3 h-3 text-[#A69784]" />
          <select
            value={currency}
            onChange={(e) => onChangeCurrency(e.target.value as Currency)}
            className="bg-transparent text-[#FAF8F5] border-none focus:outline-none cursor-pointer font-medium"
          >
            <option value="USD" className="bg-[#2D241A] text-white">USD ($)</option>
            <option value="AED" className="bg-[#2D241A] text-white">AED (AED)</option>
            <option value="SAR" className="bg-[#2D241A] text-white">SAR (SAR)</option>
            <option value="GBP" className="bg-[#2D241A] text-white">GBP (£)</option>
            <option value="EUR" className="bg-[#2D241A] text-white">EUR (€)</option>
          </select>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile menu trigger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#4A4033] hover:text-[#1F1B16] rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Left: Collections Quick Switcher (Desktop) */}
          <div className="hidden lg:flex items-center gap-6 text-xs font-medium text-[#6B6154]">
            <button
              onClick={() => onSelectCollection('all')}
              className={`transition hover:text-[#1F1B16] ${
                activeCollectionId === 'all'
                  ? 'text-[#1F1B16] font-semibold border-b-2 border-[#8C6D46] pb-1'
                  : ''
              }`}
            >
              All Designs
            </button>

            {collections.slice(0, 3).map((col) => (
              <button
                key={col.id}
                onClick={() => onSelectCollection(col.id)}
                className={`transition hover:text-[#1F1B16] ${
                  activeCollectionId === col.id
                    ? 'text-[#1F1B16] font-semibold border-b-2 border-[#8C6D46] pb-1'
                    : ''
                }`}
              >
                {col.name}
              </button>
            ))}
          </div>

          {/* Center Brand Identity */}
          <div className="text-center flex flex-col items-center">
            <button
              onClick={() => {
                onSelectCollection('all');
                onSelectCategory('All');
              }}
              className="group text-center"
            >
              <span className="font-serif-brand text-3xl sm:text-4xl font-medium tracking-[0.2em] text-[#1F1B16] block group-hover:opacity-85 transition">
                byrohaa
              </span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-[#8C6D46] block -mt-1 font-sans-brand font-medium">
                Modest Atelier
              </span>
            </button>
          </div>

          {/* Right Utilities: Search, Studio Button, Cart */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[#5E5447] hover:text-[#1F1B16] transition rounded-full hover:bg-[#F2ECE1]"
              title="Search garments"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Brand Studio & Collection Manager Quick Pill */}
            <button
              id="open-studio-pill-btn"
              onClick={onOpenCollectionStudio}
              className="px-3.5 py-2 bg-[#2D241A] hover:bg-[#1A140E] text-[#FAF8F5] rounded-full text-xs font-medium flex items-center gap-1.5 shadow-sm transition group"
              title="Add new collections, edit garments, and manage photo filters"
            >
              <Layers className="w-3.5 h-3.5 text-[#C9A982] group-hover:rotate-12 transition duration-200" />
              <span className="hidden sm:inline">Store Studio</span>
            </button>

            {/* Shopping Bag Trigger */}
            <button
              id="open-bag-btn"
              onClick={onOpenCart}
              className="relative p-2.5 bg-white border border-[#D5CBB9] hover:border-[#8C6D46] text-[#24211E] rounded-full shadow-sm transition"
              title="View your modest bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#8C6D46] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Collapsible Search Input */}
        {searchOpen && (
          <div className="py-3 border-t border-[#EBE4D8] animate-in fade-in duration-150">
            <div className="relative max-w-md mx-auto">
              <Search className="w-4 h-4 text-[#8A8175] absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search abayas, silks, hijabs, lengths..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                autoFocus
                className="w-full pl-10 pr-10 py-2 text-xs rounded-xl border border-[#D5CBB9] bg-white focus:outline-none focus:ring-1 focus:ring-[#8C6D46]"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-2.5 text-xs text-[#8A8175] hover:text-[#24211E]"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}

        {/* Sub-navigation: Garment Categories Ribbon */}
        <div className="hidden md:flex items-center justify-center gap-6 py-2.5 border-t border-[#F2ECE1] overflow-x-auto text-xs font-medium">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`transition hover:text-[#1F1B16] whitespace-nowrap ${
                activeCategory === cat
                  ? 'text-[#8C6D46] font-semibold'
                  : 'text-[#7A7268]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF8F5] border-b border-[#EBE4D8] p-6 space-y-4 animate-in slide-in-from-top duration-200">
          <div>
            <span className="text-[10px] uppercase font-semibold text-[#8C6D46] tracking-wider block mb-2">
              Collections
            </span>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  onSelectCollection('all');
                  setMobileMenuOpen(false);
                }}
                className="text-left text-sm text-[#24211E] font-medium"
              >
                All Collections
              </button>
              {collections.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    onSelectCollection(c.id);
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-sm text-[#5C5247]"
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-[#EBE4D8]">
            <span className="text-[10px] uppercase font-semibold text-[#8C6D46] tracking-wider block mb-2">
              Categories
            </span>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    onSelectCategory(cat);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs ${
                    activeCategory === cat
                      ? 'bg-[#2D241A] text-white'
                      : 'bg-white border border-[#D5CBB9] text-[#4A4033]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-[#EBE4D8]">
            <button
              onClick={() => {
                onOpenCollectionStudio();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 bg-[#2D241A] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
            >
              <Layers className="w-4 h-4 text-[#C9A982]" /> Open Store & Collection Studio
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
