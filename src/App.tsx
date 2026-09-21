import React, { useState, useEffect, useMemo } from 'react';
import {
  INITIAL_COLLECTIONS,
  INITIAL_PRODUCTS,
} from './data/initialData';
import {
  Product,
  Collection,
  CartItem,
  Order,
  Currency,
  GarmentCategory,
  ProductColor,
} from './types';
import { STORAGE_KEYS } from './utils/formatters';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { PhotoEditorModal } from './components/PhotoEditorModal';
import { CollectionManagerModal } from './components/CollectionManagerModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import {
  Filter,
  Sparkles,
  Layers,
  Camera,
  ShieldCheck,
  Check,
  ArrowUpDown,
  ShoppingBag,
  Heart,
} from 'lucide-react';

export default function App() {
  // 1. Persistent State: Collections
  const [collections, setCollections] = useState<Collection[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COLLECTIONS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse collections', e);
      }
    }
    return INITIAL_COLLECTIONS;
  });

  // 2. Persistent State: Products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse products', e);
      }
    }
    return INITIAL_PRODUCTS;
  });

  // 3. Persistent State: Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse orders', e);
      }
    }
    return [];
  });

  // 4. Persistent State: Cart
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CART);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
    return [];
  });

  // 5. Currency State
  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENCY) as Currency;
    return saved || 'USD';
  });

  // Save changes to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections));
  }, [collections]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENCY, currency);
  }, [currency]);

  // Filtering & View state
  const [activeCollectionId, setActiveCollectionId] = useState<string | 'all'>('all');
  const [activeCategory, setActiveCategory] = useState<GarmentCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'newest'>('featured');
  const [selectedFabricFilter, setSelectedFabricFilter] = useState<string>('all');

  // Modals & Drawers state
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [selectedProductForPhotoStudio, setSelectedProductForPhotoStudio] = useState<Product | null>(null);
  const [isCollectionStudioOpen, setIsCollectionStudioOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutDiscount, setCheckoutDiscount] = useState(0);
  const [checkoutPromoCode, setCheckoutPromoCode] = useState<string | undefined>(undefined);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Currently displayed collection for hero banner
  const activeHeroCollection = useMemo(() => {
    if (activeCollectionId !== 'all') {
      return collections.find((c) => c.id === activeCollectionId);
    }
    return collections[0];
  }, [collections, activeCollectionId]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((prod) => {
        // Collection match
        if (activeCollectionId !== 'all' && prod.collectionId !== activeCollectionId) {
          return false;
        }
        // Category match
        if (activeCategory !== 'All' && prod.category !== activeCategory) {
          return false;
        }
        // Fabric match
        if (selectedFabricFilter !== 'all') {
          const matchFabric = prod.fabrics.some((f) =>
            f.toLowerCase().includes(selectedFabricFilter.toLowerCase())
          );
          if (!matchFabric) return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = prod.title.toLowerCase().includes(q);
          const matchDesc = prod.description.toLowerCase().includes(q);
          const matchCat = prod.category.toLowerCase().includes(q);
          const matchFabric = prod.fabrics.some((f) => f.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchCat && !matchFabric) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_low') {
          return (a.salePrice || a.price) - (b.salePrice || b.price);
        }
        if (sortBy === 'price_high') {
          return (b.salePrice || b.price) - (a.salePrice || a.price);
        }
        if (sortBy === 'newest') {
          return a.isNew ? -1 : 1;
        }
        return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
      });
  }, [products, activeCollectionId, activeCategory, selectedFabricFilter, searchQuery, sortBy]);

  // Cart Handlers
  const handleAddToCart = (
    product: Product,
    selectedColor: ProductColor,
    selectedSize: string,
    selectedLength: string,
    quantity: number
  ) => {
    const primaryImg =
      product.images.find((i) => i.isPrimary)?.url || product.images[0]?.url;

    const newItem: CartItem = {
      id: `cart-${product.id}-${selectedColor.name}-${selectedLength}-${Date.now()}`,
      productId: product.id,
      title: product.title,
      price: product.salePrice || product.price,
      image: primaryImg,
      selectedColor,
      selectedSize,
      selectedLength,
      quantity,
      category: product.category,
    };

    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (it) =>
          it.productId === product.id &&
          it.selectedColor.name === selectedColor.name &&
          it.selectedLength === selectedLength
      );
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }
      return [...prev, newItem];
    });

    showToast(`Added "${product.title}" to bag`);
  };

  const handleUpdateCartQuantity = (id: string, qty: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    showToast('Item removed from bag');
  };

  const handleProceedToCheckout = (discount: number, promo?: string) => {
    setCheckoutDiscount(discount);
    setCheckoutPromoCode(promo);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderCompleted = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    showToast(`Order ${newOrder.orderNumber} successfully confirmed!`);
  };

  // Product & Photo Management Handlers
  const handleSaveProduct = (updated: Product) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === updated.id);
      if (exists) {
        return prev.map((p) => (p.id === updated.id ? updated : p));
      }
      return [updated, ...prev];
    });
    // If modal currently views this product, update it
    if (selectedProductForDetail?.id === updated.id) {
      setSelectedProductForDetail(updated);
    }
    showToast(`Garment "${updated.title}" updated`);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Garment removed from catalog');
  };

  const handleSaveCollection = (updated: Collection) => {
    setCollections((prev) => {
      const exists = prev.some((c) => c.id === updated.id);
      if (exists) {
        return prev.map((c) => (c.id === updated.id ? updated : c));
      }
      return [updated, ...prev];
    });
    showToast(`Collection "${updated.name}" saved`);
  };

  const handleDeleteCollection = (collectionId: string) => {
    setCollections((prev) => prev.filter((c) => c.id !== collectionId));
    if (activeCollectionId === collectionId) {
      setActiveCollectionId('all');
    }
    showToast('Collection removed');
  };

  const handleResetCatalog = () => {
    if (confirm('Restore default byrohaa collections and garments?')) {
      setCollections(INITIAL_COLLECTIONS);
      setProducts(INITIAL_PRODUCTS);
      localStorage.removeItem(STORAGE_KEYS.COLLECTIONS);
      localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
      showToast('Restored default atelier catalog');
    }
  };

  const totalCartUnits = cartItems.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#24211E] selection:bg-[#E6DDD4]">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2D241A] text-[#FAF8F5] px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-medium border border-[#8C6D46] animate-in fade-in slide-in-from-bottom duration-200">
          <Check className="w-4 h-4 text-[#C9A982]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Navigation */}
      <Navbar
        collections={collections}
        activeCollectionId={activeCollectionId}
        activeCategory={activeCategory}
        currency={currency}
        cartCount={totalCartUnits}
        searchQuery={searchQuery}
        onSelectCollection={(colId) => {
          setActiveCollectionId(colId);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectCategory={setActiveCategory}
        onChangeCurrency={setCurrency}
        onSearchChange={setSearchQuery}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenCollectionStudio={() => setIsCollectionStudioOpen(true)}
      />

      {/* Hero Banner for Collection */}
      <HeroBanner
        currentCollection={activeHeroCollection}
        onExploreCollection={() => {
          const el = document.getElementById('garments-grid-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenStudio={() => setIsCollectionStudioOpen(true)}
      />

      {/* Main Catalog View */}
      <main id="garments-grid-section" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Controls & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#EBE4D8]">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#8C6D46] font-semibold">
              {activeCollectionId === 'all'
                ? 'Complete Atelier Catalog'
                : activeHeroCollection?.name}
            </span>
            <h2 className="font-serif-brand text-2xl font-normal text-[#1F1B16]">
              {activeCategory === 'All' ? 'All Modest Garments' : activeCategory}
              <span className="text-xs font-sans-brand text-[#7A7268] font-normal ml-2">
                ({filteredProducts.length} items)
              </span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Fabric Quick Filter */}
            <div className="flex items-center gap-1.5 bg-white border border-[#D5CBB9] rounded-xl px-2.5 py-1.5 text-xs text-[#524638]">
              <span className="text-[#8C8071]">Fabric:</span>
              <select
                value={selectedFabricFilter}
                onChange={(e) => setSelectedFabricFilter(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer font-medium text-[#1F1B16]"
              >
                <option value="all">All Fabrics</option>
                <option value="Silk">Medina Silk</option>
                <option value="Crepe">Japanese Crepe</option>
                <option value="Linen">Pure Linen</option>
                <option value="Chiffon">Chiffon / Georgette</option>
              </select>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 bg-white border border-[#D5CBB9] rounded-xl px-2.5 py-1.5 text-xs text-[#524638]">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#8C8071]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent focus:outline-none cursor-pointer font-medium text-[#1F1B16]"
              >
                <option value="featured">Featured / Bestseller</option>
                <option value="newest">New Arrivals</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>

            {/* Studio Shortcut Pill */}
            <button
              onClick={() => setIsCollectionStudioOpen(true)}
              className="px-3 py-1.5 bg-[#FAF5ED] hover:bg-[#F2EADB] border border-[#D5CBB9] rounded-xl text-xs font-medium text-[#524638] flex items-center gap-1.5 transition"
              title="Add garments or update collections"
            >
              <Layers className="w-3.5 h-3.5 text-[#8C6D46]" />
              <span>Update Collections</span>
            </button>
          </div>
        </div>

        {/* Garments Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#D1C5B2] p-8 space-y-3">
            <ShoppingBag className="w-10 h-10 text-[#A69784] mx-auto" />
            <h3 className="font-serif-brand text-xl text-[#24211E]">No garments found</h3>
            <p className="text-xs text-[#7A7268] max-w-sm mx-auto">
              No designs matched your current filters. Try resetting the fabric filter or selecting another collection.
            </p>
            <button
              onClick={() => {
                setActiveCollectionId('all');
                setActiveCategory('All');
                setSelectedFabricFilter('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-[#2D241A] text-[#FAF8F5] text-xs font-medium rounded-xl hover:bg-[#1A140E] transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                currency={currency}
                onSelectProduct={(p) => setSelectedProductForDetail(p)}
                onOpenPhotoStudio={(p) => setSelectedProductForPhotoStudio(p)}
                onQuickAdd={(p) => {
                  handleAddToCart(
                    p,
                    p.colors[0],
                    p.sizes[0] || 'M',
                    p.lengths[0] || '54"',
                    1
                  );
                }}
              />
            ))}
          </div>
        )}

        {/* Feature Highlight / Modest Assurance Strip */}
        <div className="mt-16 bg-[#F2EADB] p-8 sm:p-10 rounded-3xl border border-[#E0D5C3] grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="space-y-2 md:col-span-2">
            <span className="text-[10px] uppercase tracking-widest text-[#8C6D46] font-bold">
              The byrohaa Guarantee
            </span>
            <h3 className="font-serif-brand text-2xl font-normal text-[#1F1B16]">
              Uncompromising Modesty, Tailored For Every Height
            </h3>
            <p className="text-xs text-[#635546] leading-relaxed max-w-xl">
              Each byrohaa abaya is crafted with an opaque inner structure, generous shoulder sweep, and length options ranging from 52" to 60" to guarantee a modest drape that touches the top of your shoes without dragging.
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => setIsCollectionStudioOpen(true)}
              className="px-5 py-3 bg-[#2D241A] hover:bg-[#1A140E] text-[#FAF8F5] rounded-xl text-xs font-medium tracking-wide flex items-center justify-center gap-2 shadow-md transition"
            >
              <Layers className="w-4 h-4 text-[#C9A982]" />
              Launch / Update Collections
            </button>
            <p className="text-[11px] text-center text-[#786A5A]">
              Merchant tools: Edit photos, launch seasons, manage inventory
            </p>
          </div>
        </div>
      </main>

      {/* Editorial Footer */}
      <footer className="bg-[#2D241A] text-[#FAF8F5] border-t border-[#44382B] mt-20 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Brand column */}
            <div className="md:col-span-4 space-y-4">
              <span className="font-serif-brand text-3xl font-medium tracking-[0.2em] text-[#FAF8F5] block">
                byrohaa
              </span>
              <p className="text-xs text-[#B5A898] leading-relaxed font-light max-w-sm">
                Contemporary modest atelier dedicated to graceful silhouettes, certified opaque luxury silks, and tailored abayas designed for Muslim women worldwide.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-[#C9A982]">
                <ShieldCheck className="w-4 h-4" />
                <span>256-Bit SSL Encrypted Checkout & Discrete Packing</span>
              </div>
            </div>

            {/* Quick Collections */}
            <div className="md:col-span-3 space-y-3 text-xs">
              <h4 className="font-semibold uppercase tracking-wider text-[#D9C4A5] text-[11px]">
                Active Collections
              </h4>
              <ul className="space-y-2 text-[#B5A898]">
                {collections.map((c) => (
                  <li key={c.id}>
                    <button
                      onClick={() => {
                        setActiveCollectionId(c.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-[#FAF8F5] transition"
                    >
                      {c.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Modest Care & Support */}
            <div className="md:col-span-3 space-y-3 text-xs">
              <h4 className="font-semibold uppercase tracking-wider text-[#D9C4A5] text-[11px]">
                Client Concierge
              </h4>
              <ul className="space-y-2 text-[#B5A898]">
                <li>Abaya Length & Sizing Chart</li>
                <li>Medina Silk & Crepe Care Guide</li>
                <li>Discrete Worldwide Courier Options</li>
                <li>Returns & Modest Fit Exchanges</li>
              </ul>
            </div>

            {/* Merchant Quick Tools */}
            <div className="md:col-span-2 space-y-3 text-xs">
              <h4 className="font-semibold uppercase tracking-wider text-[#D9C4A5] text-[11px]">
                Merchant Access
              </h4>
              <button
                onClick={() => setIsCollectionStudioOpen(true)}
                className="w-full py-2 bg-[#44382B] hover:bg-[#574837] text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition"
              >
                <Layers className="w-3.5 h-3.5 text-[#C9A982]" /> Store Studio
              </button>
            </div>
          </div>

          <div className="pt-8 border-t border-[#44382B] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#9E8F7F] gap-4">
            <p>© {new Date().getFullYear()} byrohaa Modest Atelier. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>Visa</span>
              <span>Mastercard</span>
              <span>Apple Pay</span>
              <span>Cash on Delivery</span>
              <span>SSL Secured</span>
            </div>
          </div>
        </div>
      </footer>

      {/* 1. Garment Detail Inspection Modal */}
      <ProductModal
        product={selectedProductForDetail}
        currency={currency}
        isOpen={!!selectedProductForDetail}
        onClose={() => setSelectedProductForDetail(null)}
        onAddToCart={handleAddToCart}
        onOpenPhotoStudio={(p) => {
          setSelectedProductForDetail(null);
          setSelectedProductForPhotoStudio(p);
        }}
      />

      {/* 2. Visual Photo & Filter Editor Modal ("and i can edite the pics") */}
      {selectedProductForPhotoStudio && (
        <PhotoEditorModal
          product={selectedProductForPhotoStudio}
          isOpen={!!selectedProductForPhotoStudio}
          onClose={() => setSelectedProductForPhotoStudio(null)}
          onSaveProduct={handleSaveProduct}
        />
      )}

      {/* 3. Collection & Product Manager Studio ("that ican easily update with new collections") */}
      <CollectionManagerModal
        isOpen={isCollectionStudioOpen}
        onClose={() => setIsCollectionStudioOpen(false)}
        collections={collections}
        products={products}
        orders={orders}
        onSaveCollection={handleSaveCollection}
        onDeleteCollection={handleDeleteCollection}
        onSaveProduct={handleSaveProduct}
        onDeleteProduct={handleDeleteProduct}
        onResetCatalog={handleResetCatalog}
        onOpenPhotoStudio={(p) => {
          setIsCollectionStudioOpen(false);
          setSelectedProductForPhotoStudio(p);
        }}
      />

      {/* 4. Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        currency={currency}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* 5. 256-Bit Encrypted Secure Checkout ("and a secure checkout process") */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        currency={currency}
        discountAmount={checkoutDiscount}
        promoCodeApplied={checkoutPromoCode}
        onOrderCompleted={handleOrderCompleted}
      />
    </div>
  );
}
