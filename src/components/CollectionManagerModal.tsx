import React, { useState } from 'react';
import {
  X,
  Plus,
  Layers,
  ShoppingBag,
  Package,
  Trash2,
  Edit3,
  Check,
  Upload,
  Download,
  RotateCcw,
  Sparkles,
  Camera,
} from 'lucide-react';
import { Collection, Product, Order, GarmentCategory } from '../types';
import { SAMPLE_MODEST_PHOTOS } from '../data/initialData';
import { formatPrice } from '../utils/formatters';

interface CollectionManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  collections: Collection[];
  products: Product[];
  orders: Order[];
  onSaveCollection: (collection: Collection) => void;
  onDeleteCollection: (collectionId: string) => void;
  onSaveProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onResetCatalog: () => void;
  onOpenPhotoStudio: (product: Product) => void;
}

export const CollectionManagerModal: React.FC<CollectionManagerModalProps> = ({
  isOpen,
  onClose,
  collections,
  products,
  orders,
  onSaveCollection,
  onDeleteCollection,
  onSaveProduct,
  onDeleteProduct,
  onResetCatalog,
  onOpenPhotoStudio,
}) => {
  const [activeTab, setActiveTab] = useState<'collections' | 'products' | 'orders'>('collections');
  const [isEditingCollection, setIsEditingCollection] = useState(false);
  const [collectionFormData, setCollectionFormData] = useState<Partial<Collection>>({
    name: '',
    tagline: '',
    description: '',
    season: "Spring / Summer '26",
    coverImage: SAMPLE_MODEST_PHOTOS[0].url,
    isActive: true,
  });

  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [productFormData, setProductFormData] = useState<Partial<Product>>({
    title: '',
    price: 150,
    salePrice: undefined,
    collectionId: collections[0]?.id || '',
    category: 'Abayas',
    description: '',
    fabrics: ['100% Premium Medina Silk'],
    colors: [
      { name: 'Onyx Black', hex: '#1A1817', inStock: true },
      { name: 'Warm Taupe', hex: '#9E8B7A', inStock: true },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    lengths: ['52"', '54"', '56"', '58"', '60"'],
    images: [
      {
        id: 'img-new-main',
        url: SAMPLE_MODEST_PHOTOS[0].url,
        alt: 'Garment primary view',
        isPrimary: true,
      },
    ],
    inStock: 20,
    careInstructions: 'Dry clean recommended or gentle cold hand wash.',
    fitNotes: 'True to modest sizing with generous loose silhouette.',
  });

  if (!isOpen) return null;

  // Collection Handlers
  const handleStartNewCollection = () => {
    setCollectionFormData({
      id: undefined,
      name: '',
      tagline: '',
      description: '',
      season: "New Capsule '26",
      coverImage: SAMPLE_MODEST_PHOTOS[Math.floor(Math.random() * SAMPLE_MODEST_PHOTOS.length)].url,
      isActive: true,
    });
    setIsEditingCollection(true);
  };

  const handleEditCollection = (col: Collection) => {
    setCollectionFormData({ ...col });
    setIsEditingCollection(true);
  };

  const handleSaveCollectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!collectionFormData.name) {
      alert('Please enter a collection name');
      return;
    }

    const id = collectionFormData.id || `col-${Date.now()}`;
    const slug =
      collectionFormData.slug ||
      collectionFormData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const finalized: Collection = {
      id,
      name: collectionFormData.name,
      slug,
      tagline: collectionFormData.tagline || 'Curated modest fashion',
      description:
        collectionFormData.description ||
        'Crafted with premium natural fabrics and serene silhouettes.',
      coverImage: collectionFormData.coverImage || SAMPLE_MODEST_PHOTOS[0].url,
      isActive: collectionFormData.isActive ?? true,
      season: collectionFormData.season || "Collection '26",
    };

    onSaveCollection(finalized);
    setIsEditingCollection(false);
  };

  // Product Handlers
  const handleStartNewProduct = () => {
    setProductFormData({
      id: undefined,
      title: '',
      price: 165,
      collectionId: collections[0]?.id || '',
      category: 'Abayas',
      description: 'Handcrafted luxury modest garment tailored with graceful drape and fluid lines.',
      fabrics: ['100% Imported Medina Silk'],
      colors: [
        { name: 'Onyx Black', hex: '#1C1A18', inStock: true },
        { name: 'Warm Taupe', hex: '#9E8B7A', inStock: true },
        { name: 'Champagne Sand', hex: '#E0D4C5', inStock: true },
      ],
      sizes: ['S', 'M', 'L', 'XL'],
      lengths: ['52"', '54"', '56"', '58"', '60"'],
      images: [
        {
          id: `img-${Date.now()}`,
          url: SAMPLE_MODEST_PHOTOS[Math.floor(Math.random() * SAMPLE_MODEST_PHOTOS.length)].url,
          alt: 'Product front preview',
          isPrimary: true,
        },
      ],
      inStock: 25,
      careInstructions: 'Delicate hand wash cold or specialist dry clean. Steam on low.',
      fitNotes: 'Full modest coverage with relaxed shoulder drop.',
    });
    setIsEditingProduct(true);
  };

  const handleEditProduct = (prod: Product) => {
    setProductFormData({ ...prod });
    setIsEditingProduct(true);
  };

  const handleSaveProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productFormData.title || !productFormData.price) {
      alert('Please fill out the title and price.');
      return;
    }

    const id = productFormData.id || `byr-${Date.now()}`;
    const slug =
      productFormData.slug ||
      productFormData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const finalized: Product = {
      id,
      title: productFormData.title,
      slug,
      price: Number(productFormData.price),
      salePrice: productFormData.salePrice ? Number(productFormData.salePrice) : undefined,
      collectionId: productFormData.collectionId || collections[0]?.id || 'col-default',
      category: (productFormData.category as GarmentCategory) || 'Abayas',
      description: productFormData.description || '',
      fabrics: productFormData.fabrics || ['Premium Fabric'],
      colors: productFormData.colors || [{ name: 'Black', hex: '#000000', inStock: true }],
      sizes: productFormData.sizes || ['S', 'M', 'L'],
      lengths: productFormData.lengths || ['54"', '56"'],
      images: productFormData.images || [
        {
          id: 'img-def',
          url: SAMPLE_MODEST_PHOTOS[0].url,
          alt: productFormData.title,
          isPrimary: true,
        },
      ],
      inStock: Number(productFormData.inStock || 10),
      careInstructions: productFormData.careInstructions || 'Dry clean recommended.',
      fitNotes: productFormData.fitNotes || 'Modest loose cut.',
      badge: productFormData.badge,
    };

    onSaveProduct(finalized);
    setIsEditingProduct(false);
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify({ collections, products }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `byrohaa_catalog_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
  };

  return (
    <div
      id="collection-manager-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#1A1816]/75 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[820px] bg-[#FAF8F5] text-[#24211E] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-[#E8DFC8]/60">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EBE4D8] bg-[#F5EFE6]">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-[#2D241A] text-[#FAF8F5]">
              <Layers className="w-5 h-5 text-[#D9C4A5]" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-serif-brand font-semibold text-[#1F1B16]">
                  byrohaa Brand Studio
                </h2>
                <span className="text-xs bg-[#8C6D46]/20 text-[#6B4F2C] px-2 py-0.5 rounded-full font-medium">
                  Collection & Inventory Manager
                </span>
              </div>
              <p className="text-xs text-[#7A7268]">
                Easily launch new collections, manage garments, and audit customer checkouts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#D5CBB9] hover:bg-[#F2EADB] text-xs text-[#4A4033] rounded-lg transition"
              title="Backup store catalog"
            >
              <Download className="w-3.5 h-3.5" /> Export Data
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#7A7268] hover:text-[#1F1B16] hover:bg-[#EBE4D8] rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between border-b border-[#EBE4D8] bg-white px-6">
          <div className="flex gap-6">
            <button
              onClick={() => {
                setActiveTab('collections');
                setIsEditingCollection(false);
              }}
              className={`py-3.5 text-xs font-semibold tracking-wider uppercase transition border-b-2 flex items-center gap-2 ${
                activeTab === 'collections'
                  ? 'border-[#8C6D46] text-[#4A3722]'
                  : 'border-transparent text-[#857B6F] hover:text-[#2A231C]'
              }`}
            >
              <Layers className="w-4 h-4" /> Collections ({collections.length})
            </button>

            <button
              onClick={() => {
                setActiveTab('products');
                setIsEditingProduct(false);
              }}
              className={`py-3.5 text-xs font-semibold tracking-wider uppercase transition border-b-2 flex items-center gap-2 ${
                activeTab === 'products'
                  ? 'border-[#8C6D46] text-[#4A3722]'
                  : 'border-transparent text-[#857B6F] hover:text-[#2A231C]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" /> Garments & Abayas ({products.length})
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`py-3.5 text-xs font-semibold tracking-wider uppercase transition border-b-2 flex items-center gap-2 ${
                activeTab === 'orders'
                  ? 'border-[#8C6D46] text-[#4A3722]'
                  : 'border-transparent text-[#857B6F] hover:text-[#2A231C]'
              }`}
            >
              <Package className="w-4 h-4" /> Secure Orders ({orders.length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'collections' && !isEditingCollection && (
              <button
                id="add-new-collection-btn"
                onClick={handleStartNewCollection}
                className="px-3 py-1.5 bg-[#2E2419] hover:bg-[#1A140E] text-[#FAF8F5] text-xs rounded-lg font-medium flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5 text-[#C9A982]" /> New Collection
              </button>
            )}
            {activeTab === 'products' && !isEditingProduct && (
              <button
                id="add-new-product-btn"
                onClick={handleStartNewProduct}
                className="px-3 py-1.5 bg-[#2E2419] hover:bg-[#1A140E] text-[#FAF8F5] text-xs rounded-lg font-medium flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5 text-[#C9A982]" /> Add Garment
              </button>
            )}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#FAF8F5]">
          {/* TAB 1: COLLECTIONS */}
          {activeTab === 'collections' && (
            <div>
              {isEditingCollection ? (
                /* Collection Edit Form */
                <form
                  onSubmit={handleSaveCollectionSubmit}
                  className="bg-white p-6 rounded-2xl border border-[#EBE4D8] max-w-2xl mx-auto space-y-4 shadow-sm"
                >
                  <div className="flex justify-between items-center border-b border-[#EBE4D8] pb-3">
                    <h3 className="font-serif-brand text-lg font-semibold text-[#24211E]">
                      {collectionFormData.id ? 'Edit Collection' : 'Create New byrohaa Collection'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsEditingCollection(false)}
                      className="text-xs text-[#7A7268] hover:underline"
                    >
                      Back to list
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#4A433A] uppercase tracking-wider">
                        Collection Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramadan & Eid '26 Atelier"
                        value={collectionFormData.name}
                        onChange={(e) =>
                          setCollectionFormData({ ...collectionFormData, name: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CBB9] focus:outline-none focus:ring-1 focus:ring-[#8C6D46]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#4A433A] uppercase tracking-wider">
                        Season / Capsule Tag
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Spring / Eid '26"
                        value={collectionFormData.season}
                        onChange={(e) =>
                          setCollectionFormData({ ...collectionFormData, season: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CBB9] focus:outline-none focus:ring-1 focus:ring-[#8C6D46]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#4A433A] uppercase tracking-wider">
                      Tagline
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Lustrous silks, fluid pleats, and opulent modest silhouettes"
                      value={collectionFormData.tagline}
                      onChange={(e) =>
                        setCollectionFormData({ ...collectionFormData, tagline: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CBB9] focus:outline-none focus:ring-1 focus:ring-[#8C6D46]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#4A433A] uppercase tracking-wider">
                      Collection Story & Description
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Describe the fabric inspiration, modesty philosophy, and design aesthetic..."
                      value={collectionFormData.description}
                      onChange={(e) =>
                        setCollectionFormData({
                          ...collectionFormData,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CBB9] focus:outline-none focus:ring-1 focus:ring-[#8C6D46]"
                    />
                  </div>

                  {/* Cover Photo */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#4A433A] uppercase tracking-wider">
                      Cover Image URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={collectionFormData.coverImage}
                        onChange={(e) =>
                          setCollectionFormData({
                            ...collectionFormData,
                            coverImage: e.target.value,
                          })
                        }
                        className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#D5CBB9] focus:outline-none focus:ring-1 focus:ring-[#8C6D46]"
                      />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pt-1">
                      {SAMPLE_MODEST_PHOTOS.slice(0, 5).map((photo, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() =>
                            setCollectionFormData({
                              ...collectionFormData,
                              coverImage: photo.url,
                            })
                          }
                          className={`w-14 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition ${
                            collectionFormData.coverImage === photo.url
                              ? 'border-[#8C6D46] scale-105'
                              : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={photo.url} alt="preset" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="col-active"
                      checked={collectionFormData.isActive}
                      onChange={(e) =>
                        setCollectionFormData({
                          ...collectionFormData,
                          isActive: e.target.checked,
                        })
                      }
                      className="rounded accent-[#8C6D46]"
                    />
                    <label htmlFor="col-active" className="text-xs text-[#4A433A] font-medium">
                      Publish immediately to storefront navigation
                    </label>
                  </div>

                  <div className="flex justify-end gap-2 pt-4 border-t border-[#EBE4D8]">
                    <button
                      type="button"
                      onClick={() => setIsEditingCollection(false)}
                      className="px-4 py-2 text-xs text-[#7A7268] hover:text-[#1F1B16]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#2D241A] text-white rounded-xl text-xs font-medium hover:bg-[#1C1610] transition"
                    >
                      Save Collection
                    </button>
                  </div>
                </form>
              ) : (
                /* Collection Cards Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {collections.map((col) => {
                    const count = products.filter((p) => p.collectionId === col.id).length;
                    return (
                      <div
                        key={col.id}
                        className="bg-white rounded-2xl p-4 border border-[#EBE4D8] shadow-sm flex gap-4 overflow-hidden group hover:border-[#C9A982] transition"
                      >
                        <div className="w-24 h-32 rounded-xl overflow-hidden shrink-0 bg-[#EBE4D8]">
                          <img
                            src={col.coverImage}
                            alt={col.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-semibold tracking-wider uppercase text-[#8C6D46]">
                                {col.season}
                              </span>
                              <span className="text-[11px] bg-[#FAF5ED] text-[#6E5D4B] px-2 py-0.5 rounded-full border border-[#EBE4D8]">
                                {count} Garments
                              </span>
                            </div>
                            <h3 className="font-serif-brand font-medium text-base text-[#1F1B16] mt-1">
                              {col.name}
                            </h3>
                            <p className="text-xs text-[#7A7268] line-clamp-2 mt-1">
                              {col.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-[#F2ECE1]">
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                                col.isActive
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-amber-50 text-amber-700'
                              }`}
                            >
                              {col.isActive ? 'Active on Store' : 'Draft / Hidden'}
                            </span>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleEditCollection(col)}
                                className="p-1.5 text-[#7A7268] hover:text-[#1F1B16] hover:bg-[#FAF5ED] rounded-lg transition"
                                title="Edit Collection"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              {collections.length > 1 && (
                                <button
                                  onClick={() => {
                                    if (
                                      confirm(
                                        `Delete collection "${col.name}"? Products in this collection will remain.`
                                      )
                                    ) {
                                      onDeleteCollection(col.id);
                                    }
                                  }}
                                  className="p-1.5 text-[#7A7268] hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                  title="Delete Collection"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: GARMENTS & PRODUCTS */}
          {activeTab === 'products' && (
            <div>
              {isEditingProduct ? (
                /* Product Edit Form */
                <form
                  onSubmit={handleSaveProductSubmit}
                  className="bg-white p-6 rounded-2xl border border-[#EBE4D8] max-w-2xl mx-auto space-y-4 shadow-sm"
                >
                  <div className="flex justify-between items-center border-b border-[#EBE4D8] pb-3">
                    <h3 className="font-serif-brand text-lg font-semibold text-[#24211E]">
                      {productFormData.id ? 'Edit Garment Details' : 'Add New byrohaa Garment'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsEditingProduct(false)}
                      className="text-xs text-[#7A7268] hover:underline"
                    >
                      Back to list
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#4A433A] uppercase tracking-wider">
                        Garment Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Layla Crepe Kimono Abaya"
                        value={productFormData.title}
                        onChange={(e) =>
                          setProductFormData({ ...productFormData, title: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CBB9] focus:outline-none focus:ring-1 focus:ring-[#8C6D46]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#4A433A] uppercase tracking-wider">
                        Collection Assignment
                      </label>
                      <select
                        value={productFormData.collectionId}
                        onChange={(e) =>
                          setProductFormData({ ...productFormData, collectionId: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CBB9] focus:outline-none focus:ring-1 focus:ring-[#8C6D46]"
                      >
                        {collections.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#4A433A] uppercase tracking-wider">
                        Category
                      </label>
                      <select
                        value={productFormData.category}
                        onChange={(e) =>
                          setProductFormData({
                            ...productFormData,
                            category: e.target.value as GarmentCategory,
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CBB9] focus:outline-none focus:ring-1 focus:ring-[#8C6D46]"
                      >
                        <option value="Abayas">Abayas</option>
                        <option value="Hijabs & Scarves">Hijabs & Scarves</option>
                        <option value="Modest Sets">Modest Sets</option>
                        <option value="Kimonos & Kaftans">Kimonos & Kaftans</option>
                        <option value="Occasion Wear">Occasion Wear</option>
                        <option value="Prayer Sets">Prayer Sets</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#4A433A] uppercase tracking-wider">
                        Price (USD) *
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={productFormData.price}
                        onChange={(e) =>
                          setProductFormData({ ...productFormData, price: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CBB9] focus:outline-none focus:ring-1 focus:ring-[#8C6D46]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#4A433A] uppercase tracking-wider">
                        Stock Quantity
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={productFormData.inStock}
                        onChange={(e) =>
                          setProductFormData({
                            ...productFormData,
                            inStock: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CBB9] focus:outline-none focus:ring-1 focus:ring-[#8C6D46]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#4A433A] uppercase tracking-wider">
                      Product Description & Modest Silhouette
                    </label>
                    <textarea
                      rows={2}
                      value={productFormData.description}
                      onChange={(e) =>
                        setProductFormData({ ...productFormData, description: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CBB9] focus:outline-none focus:ring-1 focus:ring-[#8C6D46]"
                    />
                  </div>

                  {/* Primary Photo Quick Link */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#4A433A] uppercase tracking-wider">
                      Primary Photo URL
                    </label>
                    <input
                      type="url"
                      value={productFormData.images?.[0]?.url || ''}
                      onChange={(e) => {
                        const newUrl = e.target.value;
                        const existing = productFormData.images || [];
                        setProductFormData({
                          ...productFormData,
                          images: [
                            {
                              id: 'img-1',
                              url: newUrl,
                              alt: productFormData.title || 'Garment image',
                              isPrimary: true,
                            },
                            ...existing.slice(1),
                          ],
                        });
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CBB9] focus:outline-none focus:ring-1 focus:ring-[#8C6D46]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4 border-t border-[#EBE4D8]">
                    <button
                      type="button"
                      onClick={() => setIsEditingProduct(false)}
                      className="px-4 py-2 text-xs text-[#7A7268] hover:text-[#1F1B16]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#2D241A] text-white rounded-xl text-xs font-medium hover:bg-[#1C1610] transition"
                    >
                      Save Garment
                    </button>
                  </div>
                </form>
              ) : (
                /* Products Table / Cards */
                <div className="space-y-3">
                  {products.map((prod) => {
                    const primaryImg =
                      prod.images.find((i) => i.isPrimary)?.url || prod.images[0]?.url;
                    const col = collections.find((c) => c.id === prod.collectionId);

                    return (
                      <div
                        key={prod.id}
                        className="bg-white p-3.5 rounded-2xl border border-[#EBE4D8] flex items-center justify-between gap-4 shadow-sm hover:border-[#C9A982] transition"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-18 rounded-xl overflow-hidden bg-[#F5EFE6] shrink-0 relative group">
                            <img src={primaryImg} alt={prod.title} className="w-full h-full object-cover" />
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] uppercase font-semibold text-[#8C6D46]">
                                {col?.name || 'Collection'}
                              </span>
                              <span className="text-xs text-[#8A8175]">• {prod.category}</span>
                            </div>
                            <h4 className="font-serif-brand font-medium text-sm text-[#1F1B16]">
                              {prod.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs font-semibold text-[#24211E]">
                                {formatPrice(prod.price)}
                              </span>
                              <span className="text-[11px] text-[#7A7268]">
                                Stock: {prod.inStock} units
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onOpenPhotoStudio(prod)}
                            className="px-3 py-1.5 bg-[#FAF5ED] hover:bg-[#F2EADB] text-[#6E5D4B] border border-[#D5CBB9] rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
                            title="Open Photo Studio to filter and edit images"
                          >
                            <Camera className="w-3.5 h-3.5 text-[#8C6D46]" /> Edit Photo
                          </button>

                          <button
                            onClick={() => handleEditProduct(prod)}
                            className="p-2 text-[#7A7268] hover:text-[#1F1B16] hover:bg-[#F5EFE6] rounded-lg transition"
                            title="Edit details"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Delete garment "${prod.title}"?`)) {
                                onDeleteProduct(prod.id);
                              }
                            }}
                            className="p-2 text-[#7A7268] hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete garment"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SECURE ORDERS AUDIT */}
          {activeTab === 'orders' && (
            <div>
              {orders.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-[#D1C5B2] p-8">
                  <div className="w-12 h-12 rounded-full bg-[#FAF5ED] text-[#8C6D46] flex items-center justify-center mx-auto mb-3">
                    <Package className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif-brand text-base font-semibold text-[#1F1B16]">
                    No Orders Recorded Yet
                  </h3>
                  <p className="text-xs text-[#7A7268] mt-1 max-w-sm mx-auto">
                    When customers complete checkouts using the 256-bit encrypted checkout workflow,
                    their confirmed orders and shipping details will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-white p-4 rounded-2xl border border-[#EBE4D8] shadow-sm space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F4EFE6] pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#1F1B16]">
                            {ord.orderNumber}
                          </span>
                          <span className="text-xs text-[#8A8175]">
                            {new Date(ord.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {ord.status}
                          </span>
                          <span className="font-semibold text-xs text-[#1F1B16]">
                            {formatPrice(ord.total, ord.currency)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-[#8A8175] block uppercase text-[10px] tracking-wider font-semibold">
                            Recipient & Delivery
                          </span>
                          <p className="font-medium text-[#24211E]">{ord.customer.fullName}</p>
                          <p className="text-[#665D50]">
                            {ord.customer.address}, {ord.customer.city}, {ord.customer.country}
                          </p>
                          <p className="text-[#8A8175]">
                            {ord.customer.email} • {ord.customer.phone}
                          </p>
                        </div>

                        <div>
                          <span className="text-[#8A8175] block uppercase text-[10px] tracking-wider font-semibold">
                            Order Items ({ord.items.length})
                          </span>
                          <div className="space-y-1 mt-0.5">
                            {ord.items.map((it) => (
                              <div key={it.id} className="flex justify-between text-[#4A4033]">
                                <span>
                                  {it.quantity}x {it.title} ({it.selectedLength}, {it.selectedColor.name})
                                </span>
                                <span className="font-mono">{formatPrice(it.price * it.quantity, ord.currency)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#EBE4D8] bg-[#F4EFE6] flex items-center justify-between text-xs text-[#7A7268]">
          <button
            onClick={onResetCatalog}
            className="hover:text-red-700 flex items-center gap-1.5 transition"
            title="Reset catalog back to curated default products"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Restore Default Catalog
          </button>

          <span>byrohaa Merchant Engine v1.0 • Changes saved locally</span>
        </div>
      </div>
    </div>
  );
};
