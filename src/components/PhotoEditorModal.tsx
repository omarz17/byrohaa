import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Sliders,
  Sparkles,
  RotateCcw,
  Check,
  Image as ImageIcon,
  Eye,
  Trash2,
  Plus,
  ArrowRight,
  Sun,
  Contrast,
  Palette,
  Flame,
} from 'lucide-react';
import { Product, ProductImage, ImageFilterSettings } from '../types';
import { SAMPLE_MODEST_PHOTOS } from '../data/initialData';
import { getFilterStyle } from '../utils/formatters';

interface PhotoEditorModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onSaveProduct: (updatedProduct: Product) => void;
}

const DEFAULT_FILTERS: ImageFilterSettings = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  warmth: 0,
  aspectRatio: '3:4',
  preset: 'original',
};

export const PhotoEditorModal: React.FC<PhotoEditorModalProps> = ({
  product,
  isOpen,
  onClose,
  onSaveProduct,
}) => {
  const [images, setImages] = useState<ProductImage[]>(() => {
    return product.images.length > 0
      ? JSON.parse(JSON.stringify(product.images))
      : [
          {
            id: 'img-new-1',
            url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80',
            alt: product.title,
            isPrimary: true,
            filters: { ...DEFAULT_FILTERS },
          },
        ];
  });

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'tune' | 'presets' | 'replace' | 'library'>('tune');
  const [compareMode, setCompareMode] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const currentImage = images[selectedImageIndex] || images[0];
  const currentFilters: ImageFilterSettings = currentImage?.filters || { ...DEFAULT_FILTERS };

  const updateFilters = (newFilters: Partial<ImageFilterSettings>) => {
    setImages((prev) =>
      prev.map((img, idx) => {
        if (idx === selectedImageIndex) {
          return {
            ...img,
            filters: {
              ...(img.filters || DEFAULT_FILTERS),
              ...newFilters,
            },
          };
        }
        return img;
      })
    );
  };

  const handleApplyPreset = (presetKey: ImageFilterSettings['preset']) => {
    let presetAdjustments: Partial<ImageFilterSettings> = { preset: presetKey };

    switch (presetKey) {
      case 'warm_editorial':
        presetAdjustments = {
          preset: presetKey,
          brightness: 104,
          contrast: 106,
          saturation: 96,
          warmth: 35,
        };
        break;
      case 'desert_sand':
        presetAdjustments = {
          preset: presetKey,
          brightness: 98,
          contrast: 110,
          saturation: 85,
          warmth: 48,
        };
        break;
      case 'golden_hour':
        presetAdjustments = {
          preset: presetKey,
          brightness: 106,
          contrast: 108,
          saturation: 115,
          warmth: 55,
        };
        break;
      case 'crisp_linen':
        presetAdjustments = {
          preset: presetKey,
          brightness: 105,
          contrast: 112,
          saturation: 90,
          warmth: 8,
        };
        break;
      case 'noir':
        presetAdjustments = {
          preset: presetKey,
          brightness: 95,
          contrast: 125,
          saturation: 0,
          warmth: 0,
        };
        break;
      case 'original':
      default:
        presetAdjustments = {
          preset: 'original',
          brightness: 100,
          contrast: 100,
          saturation: 100,
          warmth: 0,
        };
        break;
    }

    updateFilters(presetAdjustments);
    showNotice(`Applied "${presetKey.replace('_', ' ')}" preset`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setImages((prev) =>
          prev.map((img, idx) => {
            if (idx === selectedImageIndex) {
              return {
                ...img,
                url: dataUrl,
              };
            }
            return img;
          })
        );
        showNotice('Photo uploaded successfully');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustomUrl = () => {
    if (!customUrlInput.trim()) return;
    setImages((prev) =>
      prev.map((img, idx) => {
        if (idx === selectedImageIndex) {
          return {
            ...img,
            url: customUrlInput.trim(),
          };
        }
        return img;
      })
    );
    setCustomUrlInput('');
    showNotice('Image URL updated');
  };

  const handleSelectSamplePhoto = (url: string) => {
    setImages((prev) =>
      prev.map((img, idx) => {
        if (idx === selectedImageIndex) {
          return {
            ...img,
            url,
          };
        }
        return img;
      })
    );
    showNotice('Library photo applied');
  };

  const handleAddNewPhotoSlot = () => {
    const newId = `img-${Date.now()}`;
    const newImg: ProductImage = {
      id: newId,
      url: SAMPLE_MODEST_PHOTOS[images.length % SAMPLE_MODEST_PHOTOS.length].url,
      alt: `${product.title} view ${images.length + 1}`,
      isPrimary: images.length === 0,
      filters: { ...DEFAULT_FILTERS },
    };
    setImages((prev) => [...prev, newImg]);
    setSelectedImageIndex(images.length);
    showNotice('Added new photo slot');
  };

  const handleDeleteCurrentPhoto = () => {
    if (images.length <= 1) {
      alert('A product must maintain at least one photograph.');
      return;
    }
    const updated = images.filter((_, idx) => idx !== selectedImageIndex);
    if (!updated.some((img) => img.isPrimary)) {
      updated[0].isPrimary = true;
    }
    setImages(updated);
    setSelectedImageIndex(Math.max(0, selectedImageIndex - 1));
    showNotice('Photo removed');
  };

  const handleSetPrimary = (index: number) => {
    setImages((prev) =>
      prev.map((img, idx) => ({
        ...img,
        isPrimary: idx === index,
      }))
    );
    showNotice('Set as primary cover image');
  };

  const showNotice = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleSaveAll = () => {
    const updatedProduct: Product = {
      ...product,
      images,
    };
    onSaveProduct(updatedProduct);
    onClose();
  };

  return (
    <div
      id="photo-editor-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#1A1816]/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[820px] bg-[#FAF8F5] text-[#24211E] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-[#E8DFC8]/50">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EBE4D8] bg-[#F4EFE6]/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide uppercase bg-[#D9C4A5]/40 text-[#4A3B2C]">
                <Sparkles className="w-3.5 h-3.5" /> byrohaa Photo Studio
              </span>
              <span className="text-xs text-[#7A7268]">Editing: {product.title}</span>
            </div>
            <h2 className="text-xl font-serif-brand font-medium text-[#1F1B16] mt-0.5">
              Refine & Edit Garment Photography
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {statusMessage && (
              <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 bg-[#4A3B2C] text-[#FAF8F5] text-xs rounded-full animate-in fade-in duration-150">
                <Check className="w-3 h-3 text-[#D9C4A5]" /> {statusMessage}
              </span>
            )}
            <button
              id="close-photo-editor-btn"
              onClick={onClose}
              className="p-2 text-[#7A7268] hover:text-[#1F1B16] hover:bg-[#EBE4D8]/60 rounded-full transition"
              title="Close editor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Studio Body: Split Preview & Controls */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Left Canvas Preview Area (7 cols on lg) */}
          <div className="lg:col-span-7 bg-[#1F1B16] p-6 flex flex-col justify-between items-center relative overflow-hidden">
            {/* Top Toolbar overlay */}
            <div className="w-full flex items-center justify-between z-10">
              <div className="flex items-center gap-2 bg-[#2D2822]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#443D34]">
                <span className="text-xs text-[#D8CEBE]">Aspect:</span>
                {(['3:4', '4:5', '1:1'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => updateFilters({ aspectRatio: ratio })}
                    className={`text-xs px-2 py-0.5 rounded transition ${
                      currentFilters.aspectRatio === ratio
                        ? 'bg-[#C9A982] text-[#1A1816] font-semibold'
                        : 'text-[#D8CEBE] hover:text-white'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCompareMode(!compareMode)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    compareMode
                      ? 'bg-[#C9A982] text-[#1A1816]'
                      : 'bg-[#2D2822]/80 text-[#D8CEBE] hover:text-white border border-[#443D34]'
                  }`}
                  title="Toggle original vs adjusted photo"
                >
                  <Eye className="w-3.5 h-3.5" />
                  {compareMode ? 'Showing Original' : 'Compare Original'}
                </button>

                <button
                  onClick={() => handleApplyPreset('original')}
                  className="p-1.5 bg-[#2D2822]/80 text-[#D8CEBE] hover:text-white rounded-lg border border-[#443D34]"
                  title="Reset all filter adjustments"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main Stage Image Preview */}
            <div className="my-auto flex items-center justify-center w-full max-h-[460px]">
              <div
                className={`relative overflow-hidden rounded-xl shadow-2xl transition-all duration-300 border border-[#3E372E] ${
                  currentFilters.aspectRatio === '3:4'
                    ? 'aspect-[3/4] h-[440px]'
                    : currentFilters.aspectRatio === '4:5'
                    ? 'aspect-[4/5] h-[440px]'
                    : 'aspect-square h-[400px]'
                }`}
              >
                <img
                  src={currentImage?.url}
                  alt={currentImage?.alt || 'Garment preview'}
                  className="w-full h-full object-cover transition-all duration-200"
                  style={{
                    filter: compareMode ? 'none' : getFilterStyle(currentFilters),
                  }}
                />

                {compareMode && (
                  <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded text-[11px] text-white tracking-wide uppercase font-semibold">
                    Original Unfiltered
                  </div>
                )}

                {currentImage?.isPrimary && (
                  <div className="absolute bottom-3 left-3 bg-[#C9A982] text-[#1A1816] px-2.5 py-1 rounded text-[11px] font-semibold tracking-wider uppercase">
                    Primary Cover Photo
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Gallery Thumbnails Carousel */}
            <div className="w-full z-10 pt-3 border-t border-[#362F27] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-[80%]">
                {images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-12 h-14 rounded-md overflow-hidden shrink-0 border-2 transition ${
                      selectedImageIndex === idx
                        ? 'border-[#C9A982] ring-2 ring-[#C9A982]/30 scale-105'
                        : 'border-[#443D34] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`Thumb ${idx + 1}`}
                      className="w-full h-full object-cover"
                      style={{ filter: getFilterStyle(img.filters) }}
                    />
                    {img.isPrimary && (
                      <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#C9A982] rounded-bl" />
                    )}
                  </button>
                ))}

                <button
                  onClick={handleAddNewPhotoSlot}
                  className="w-12 h-14 rounded-md border-2 border-dashed border-[#5A4F42] hover:border-[#C9A982] flex flex-col items-center justify-center text-[#A69784] hover:text-white transition shrink-0"
                  title="Add new photo angle"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {!currentImage?.isPrimary && (
                  <button
                    onClick={() => handleSetPrimary(selectedImageIndex)}
                    className="px-2.5 py-1 bg-[#2D2822] hover:bg-[#3D352B] text-[#D8CEBE] text-xs rounded border border-[#443D34] transition"
                  >
                    Set Cover
                  </button>
                )}
                {images.length > 1 && (
                  <button
                    onClick={handleDeleteCurrentPhoto}
                    className="p-1.5 bg-[#2D2822] hover:bg-red-950/60 text-[#D8CEBE] hover:text-red-300 text-xs rounded border border-[#443D34] transition"
                    title="Remove this photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Controls Panel (5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col h-full bg-[#FAF8F5] border-l border-[#EBE4D8] overflow-hidden">
            {/* Control Tabs */}
            <div className="grid grid-cols-4 border-b border-[#EBE4D8] bg-[#F5EFE6]">
              <button
                onClick={() => setActiveTab('tune')}
                className={`py-3 text-xs font-semibold tracking-wider uppercase transition flex flex-col items-center gap-1 ${
                  activeTab === 'tune'
                    ? 'border-b-2 border-[#8C6D46] text-[#4A3722] bg-[#FAF8F5]'
                    : 'text-[#7D7366] hover:text-[#2E271F]'
                }`}
              >
                <Sliders className="w-4 h-4" />
                Adjust
              </button>
              <button
                onClick={() => setActiveTab('presets')}
                className={`py-3 text-xs font-semibold tracking-wider uppercase transition flex flex-col items-center gap-1 ${
                  activeTab === 'presets'
                    ? 'border-b-2 border-[#8C6D46] text-[#4A3722] bg-[#FAF8F5]'
                    : 'text-[#7D7366] hover:text-[#2E271F]'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Filters
              </button>
              <button
                onClick={() => setActiveTab('replace')}
                className={`py-3 text-xs font-semibold tracking-wider uppercase transition flex flex-col items-center gap-1 ${
                  activeTab === 'replace'
                    ? 'border-b-2 border-[#8C6D46] text-[#4A3722] bg-[#FAF8F5]'
                    : 'text-[#7D7366] hover:text-[#2E271F]'
                }`}
              >
                <Upload className="w-4 h-4" />
                Upload
              </button>
              <button
                onClick={() => setActiveTab('library')}
                className={`py-3 text-xs font-semibold tracking-wider uppercase transition flex flex-col items-center gap-1 ${
                  activeTab === 'library'
                    ? 'border-b-2 border-[#8C6D46] text-[#4A3722] bg-[#FAF8F5]'
                    : 'text-[#7D7366] hover:text-[#2E271F]'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                Catalog
              </button>
            </div>

            {/* Scrollable controls content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* TAB 1: Fine-Tune Adjustments */}
              {activeTab === 'tune' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider font-semibold text-[#6E6457]">
                      Light & Tone Calibration
                    </span>
                    <button
                      onClick={() =>
                        updateFilters({
                          brightness: 100,
                          contrast: 100,
                          saturation: 100,
                          warmth: 0,
                        })
                      }
                      className="text-xs text-[#8C6D46] hover:underline"
                    >
                      Reset sliders
                    </button>
                  </div>

                  {/* Brightness */}
                  <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-[#EBE4D8]">
                    <div className="flex justify-between text-xs font-medium text-[#4A433A]">
                      <span className="flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5 text-[#C9A982]" /> Brightness
                      </span>
                      <span className="font-mono text-[#8C6D46]">{currentFilters.brightness}%</span>
                    </div>
                    <input
                      type="range"
                      min="60"
                      max="140"
                      value={currentFilters.brightness}
                      onChange={(e) => updateFilters({ brightness: Number(e.target.value) })}
                      className="w-full accent-[#8C6D46] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-[#A69C8E]">
                      <span>Dim (-40%)</span>
                      <span>Neutral</span>
                      <span>Luminous (+40%)</span>
                    </div>
                  </div>

                  {/* Contrast */}
                  <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-[#EBE4D8]">
                    <div className="flex justify-between text-xs font-medium text-[#4A433A]">
                      <span className="flex items-center gap-1.5">
                        <Contrast className="w-3.5 h-3.5 text-[#C9A982]" /> Contrast
                      </span>
                      <span className="font-mono text-[#8C6D46]">{currentFilters.contrast}%</span>
                    </div>
                    <input
                      type="range"
                      min="70"
                      max="140"
                      value={currentFilters.contrast}
                      onChange={(e) => updateFilters({ contrast: Number(e.target.value) })}
                      className="w-full accent-[#8C6D46] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-[#A69C8E]">
                      <span>Soft Flat</span>
                      <span>Balanced</span>
                      <span>Deep Punchy</span>
                    </div>
                  </div>

                  {/* Warmth / Editorial Tone */}
                  <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-[#EBE4D8]">
                    <div className="flex justify-between text-xs font-medium text-[#4A433A]">
                      <span className="flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-[#C9A982]" /> Warmth / Desert Glow
                      </span>
                      <span className="font-mono text-[#8C6D46]">+{currentFilters.warmth}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="80"
                      value={currentFilters.warmth}
                      onChange={(e) => updateFilters({ warmth: Number(e.target.value) })}
                      className="w-full accent-[#8C6D46] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-[#A69C8E]">
                      <span>Cool Neutral</span>
                      <span>Warm Sand</span>
                      <span>Rich Amber</span>
                    </div>
                  </div>

                  {/* Saturation */}
                  <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-[#EBE4D8]">
                    <div className="flex justify-between text-xs font-medium text-[#4A433A]">
                      <span className="flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5 text-[#C9A982]" /> Color Vibrancy
                      </span>
                      <span className="font-mono text-[#8C6D46]">{currentFilters.saturation}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="180"
                      value={currentFilters.saturation}
                      onChange={(e) => updateFilters({ saturation: Number(e.target.value) })}
                      className="w-full accent-[#8C6D46] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-[#A69C8E]">
                      <span>Muted</span>
                      <span>Standard</span>
                      <span>Vivid</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Curated Brand Presets */}
              {activeTab === 'presets' && (
                <div className="space-y-4">
                  <p className="text-xs text-[#6E6457]">
                    Hand-crafted editorial color profiles tailored specifically for abaya draping, silk sheen, and modest fabrics:
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        key: 'original' as const,
                        name: 'Clean Neutral',
                        tag: 'True to Life',
                        desc: 'Unfiltered, accurate colorway',
                      },
                      {
                        key: 'warm_editorial' as const,
                        name: 'Warm Editorial',
                        tag: 'Atelier Signature',
                        desc: 'Soft champagne highlights & subtle warmth',
                      },
                      {
                        key: 'desert_sand' as const,
                        name: 'Oasis Sand',
                        tag: 'Earth Tone',
                        desc: 'Refined warm terracotta & linen depth',
                      },
                      {
                        key: 'golden_hour' as const,
                        name: 'Golden Hour',
                        tag: 'Eid Radiance',
                        desc: 'Luminous sunset glow on silk textures',
                      },
                      {
                        key: 'crisp_linen' as const,
                        name: 'Crisp Linen',
                        tag: 'High Definition',
                        desc: 'Sharp weave clarity & modern contrast',
                      },
                      {
                        key: 'noir' as const,
                        name: 'Silhouetted Noir',
                        tag: 'Monochrome',
                        desc: 'Timeless high-contrast black & white',
                      },
                    ].map((preset) => (
                      <button
                        key={preset.key}
                        onClick={() => handleApplyPreset(preset.key)}
                        className={`text-left p-3.5 rounded-xl border transition flex flex-col justify-between h-28 ${
                          currentFilters.preset === preset.key
                            ? 'bg-[#F2EADB] border-[#8C6D46] ring-1 ring-[#8C6D46]'
                            : 'bg-white border-[#EBE4D8] hover:border-[#C9A982]'
                        }`}
                      >
                        <div>
                          <span className="text-[10px] font-semibold text-[#8C6D46] tracking-wider uppercase">
                            {preset.tag}
                          </span>
                          <h4 className="text-sm font-medium text-[#24211E]">{preset.name}</h4>
                        </div>
                        <p className="text-[11px] text-[#786E61] line-clamp-2">{preset.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: Upload from Device or URL */}
              {activeTab === 'replace' && (
                <div className="space-y-6">
                  {/* File Upload Box */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="p-6 border-2 border-dashed border-[#D1C5B2] hover:border-[#8C6D46] rounded-2xl bg-white text-center cursor-pointer transition group"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="w-12 h-12 rounded-full bg-[#FAF5ED] group-hover:bg-[#F2EADB] text-[#8C6D46] flex items-center justify-center mx-auto mb-3 transition">
                      <Upload className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-semibold text-[#24211E]">
                      Upload New Photo from Device
                    </h4>
                    <p className="text-xs text-[#7A7268] mt-1">
                      Drag and drop high-res garment shot, or browse (JPG, PNG, WebP)
                    </p>
                  </div>

                  <div className="relative flex items-center justify-center">
                    <div className="border-t border-[#EBE4D8] w-full" />
                    <span className="bg-[#FAF8F5] px-3 text-xs text-[#998F82] uppercase tracking-wider">
                      Or paste direct image URL
                    </span>
                  </div>

                  {/* Direct Image URL input */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#4A433A] uppercase tracking-wider">
                      Direct Photo Link (CDN / Unsplash / Shopify)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={customUrlInput}
                        onChange={(e) => setCustomUrlInput(e.target.value)}
                        className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-[#D5CBB9] bg-white focus:outline-none focus:ring-1 focus:ring-[#8C6D46]"
                      />
                      <button
                        onClick={handleApplyCustomUrl}
                        disabled={!customUrlInput.trim()}
                        className="px-4 py-2.5 bg-[#4A3B2C] hover:bg-[#382B1E] disabled:opacity-40 text-white rounded-xl text-xs font-medium transition"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: Curated Modest Library */}
              {activeTab === 'library' && (
                <div className="space-y-3">
                  <p className="text-xs text-[#6E6457]">
                    Select from verified high-resolution modest editorial imagery to instantly update this garment angle:
                  </p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {SAMPLE_MODEST_PHOTOS.map((sample, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectSamplePhoto(sample.url)}
                        className="group relative rounded-xl overflow-hidden aspect-[3/4] border border-[#EBE4D8] cursor-pointer hover:shadow-md transition"
                      >
                        <img
                          src={sample.url}
                          alt={sample.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                          <span className="text-[11px] text-white font-medium line-clamp-1">
                            {sample.title}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions Footer */}
            <div className="p-4 border-t border-[#EBE4D8] bg-[#F4EFE6] flex items-center justify-between">
              <button
                onClick={onClose}
                className="px-4 py-2.5 text-xs text-[#665D50] hover:text-[#1F1B16] font-medium transition"
              >
                Cancel
              </button>

              <button
                id="save-photo-changes-btn"
                onClick={handleSaveAll}
                className="px-6 py-2.5 bg-[#2E2419] hover:bg-[#1A140E] text-[#FAF8F5] rounded-xl text-xs font-medium tracking-wide flex items-center gap-2 shadow-md transition"
              >
                <Check className="w-4 h-4 text-[#C9A982]" />
                Save & Apply to Garment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
