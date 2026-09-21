import React, { useState } from 'react';
import {
  X,
  Camera,
  ShoppingBag,
  ShieldCheck,
  Ruler,
  Check,
  Sparkles,
  Info,
  ChevronRight,
  Heart,
} from 'lucide-react';
import { Product, Currency, ProductColor } from '../types';
import { formatPrice, getFilterStyle } from '../utils/formatters';

interface ProductModalProps {
  product: Product | null;
  currency: Currency;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (
    product: Product,
    selectedColor: ProductColor,
    selectedSize: string,
    selectedLength: string,
    quantity: number
  ) => void;
  onOpenPhotoStudio: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  currency,
  isOpen,
  onClose,
  onAddToCart,
  onOpenPhotoStudio,
}) => {
  if (!isOpen || !product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.colors[0] || { name: 'Natural', hex: '#E6DDD4', inStock: true }
  );
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [selectedLength, setSelectedLength] = useState<string>(
    product.lengths[1] || product.lengths[0] || '54"'
  );
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  const images = product.images.length > 0 ? product.images : [];
  const currentImage = images[activeImageIndex] || images[0];

  const handleAdd = () => {
    onAddToCart(product, selectedColor, selectedSize, selectedLength, quantity);
    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
      onClose();
    }, 900);
  };

  return (
    <div
      id="product-detail-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#1A1816]/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#FAF8F5] text-[#24211E] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-[#E8DFC8]/60">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/80 hover:bg-white text-[#52483D] hover:text-[#1A1816] rounded-full shadow-md transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal content body */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-y-auto">
          {/* Left: Gallery & Photo Studio trigger */}
          <div className="bg-[#F5EFE6] p-6 flex flex-col justify-between space-y-4">
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-white shadow-md border border-[#EBE4D8]">
              <img
                src={currentImage?.url}
                alt={currentImage?.alt || product.title}
                className="w-full h-full object-cover transition duration-300"
                style={{
                  filter: getFilterStyle(currentImage?.filters),
                }}
              />

              {/* Direct Photo Studio Shortcut */}
              <button
                onClick={() => onOpenPhotoStudio(product)}
                className="absolute top-3 left-3 px-3 py-1.5 bg-[#1F1B16]/85 hover:bg-[#1A1816] backdrop-blur-md text-[#FAF8F5] rounded-xl text-xs font-medium flex items-center gap-1.5 shadow-lg transition"
                title="Edit garment photo filters, tones, and angles"
              >
                <Camera className="w-3.5 h-3.5 text-[#C9A982]" /> Edit This Photo
              </button>
            </div>

            {/* Gallery thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-14 h-18 rounded-lg overflow-hidden shrink-0 border-2 transition ${
                      activeImageIndex === idx
                        ? 'border-[#8C6D46] ring-2 ring-[#8C6D46]/20 scale-105'
                        : 'border-[#E0D5C3] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`Thumb ${idx}`}
                      className="w-full h-full object-cover"
                      style={{ filter: getFilterStyle(img.filters) }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Modest promise banner */}
            <div className="bg-white/80 p-3 rounded-xl border border-[#EBE4D8] flex items-center gap-2.5 text-xs text-[#594E41]">
              <ShieldCheck className="w-4 h-4 text-[#8C6D46] shrink-0" />
              <span>
                <strong>100% Modest Cut Guarantee:</strong> Non-clinging opaque fabric with extended coverage.
              </span>
            </div>
          </div>

          {/* Right: Product Details & Options */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-[11px] uppercase tracking-widest text-[#8C6D46] font-semibold">
                  {product.category} • byrohaa Atelier
                </span>
                <h1 className="font-serif-brand text-2xl sm:text-3xl font-medium text-[#1F1B16] mt-1">
                  {product.title}
                </h1>
                <div className="flex items-baseline gap-3 mt-2">
                  <span className="text-xl font-semibold text-[#1F1B16]">
                    {formatPrice(product.salePrice || product.price, currency)}
                  </span>
                  {product.salePrice && (
                    <span className="text-sm text-[#998F82] line-through">
                      {formatPrice(product.price, currency)}
                    </span>
                  )}
                  <span className="text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    In Stock ({product.inStock} units)
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#594E41] leading-relaxed">
                {product.description}
              </p>

              {/* Color Swatches */}
              <div className="space-y-2 pt-2 border-t border-[#EBE4D8]">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-[#4A433A] uppercase tracking-wider">
                    Color: <span className="font-normal text-[#1F1B16]">{selectedColor.name}</span>
                  </span>
                </div>
                <div className="flex gap-2">
                  {product.colors.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(color)}
                      className={`relative p-1 rounded-full border-2 transition ${
                        selectedColor.name === color.name
                          ? 'border-[#8C6D46] scale-110'
                          : 'border-transparent hover:scale-105'
                      }`}
                      title={color.name}
                    >
                      <span
                        className="block w-6 h-6 rounded-full border border-black/15 shadow-inner"
                        style={{ backgroundColor: color.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Abaya Length Selector (Essential for Modest Wear) */}
              <div className="space-y-2 pt-2 border-t border-[#EBE4D8]">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-[#4A433A] uppercase tracking-wider">
                    Modest Length: <span className="font-normal text-[#1F1B16]">{selectedLength}</span>
                  </span>
                  <button
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    className="text-[#8C6D46] hover:underline flex items-center gap-1"
                  >
                    <Ruler className="w-3.5 h-3.5" /> Height & Length Guide
                  </button>
                </div>

                {/* Length pills */}
                <div className="flex flex-wrap gap-2">
                  {product.lengths.map((len) => (
                    <button
                      key={len}
                      onClick={() => setSelectedLength(len)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                        selectedLength === len
                          ? 'bg-[#2D241A] text-[#FAF8F5] shadow-sm'
                          : 'bg-white border border-[#D5CBB9] text-[#4A4033] hover:border-[#8C6D46]'
                      }`}
                    >
                      {len}
                    </button>
                  ))}
                </div>

                {/* Size guide popup / card */}
                {showSizeGuide && (
                  <div className="bg-[#FAF5ED] p-3 rounded-xl border border-[#D9CEBE] text-xs text-[#594E41] space-y-1.5 animate-in fade-in duration-150">
                    <p className="font-semibold text-[#24211E]">Abaya Height Recommendations:</p>
                    <div className="grid grid-cols-2 gap-1 text-[11px]">
                      <div>52" Length → Height 5’0” - 5’2”</div>
                      <div>54" Length → Height 5’3” - 5’4”</div>
                      <div>56" Length → Height 5’5” - 5’6”</div>
                      <div>58" Length → Height 5’7” - 5’8”</div>
                      <div>60" Length → Height 5’9” - 5’11”</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Fabric & Care Accordion */}
              <div className="pt-2 border-t border-[#EBE4D8] space-y-1.5 text-xs text-[#6E6457]">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#8C6D46]" />
                  <span>
                    <strong>Fabric:</strong> {product.fabrics.join(' • ')}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#8C6D46]" />
                  <span>
                    <strong>Care:</strong> {product.careInstructions}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions: Quantity + Add to Bag */}
            <div className="pt-4 border-t border-[#EBE4D8] space-y-3">
              <div className="flex gap-3">
                <div className="flex items-center border border-[#D5CBB9] rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-xs font-semibold text-[#4A4033] hover:bg-[#F5EFE6]"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-semibold text-[#1F1B16]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-xs font-semibold text-[#4A4033] hover:bg-[#F5EFE6]"
                  >
                    +
                  </button>
                </div>

                <button
                  id="add-to-cart-modal-btn"
                  onClick={handleAdd}
                  disabled={addedToast}
                  className="flex-1 py-3 bg-[#2D241A] hover:bg-[#1A140E] disabled:bg-emerald-700 text-[#FAF8F5] rounded-xl text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg transition"
                >
                  {addedToast ? (
                    <>
                      <Check className="w-4 h-4" /> Added to Modest Bag
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-[#D9C4A5]" /> Add to Bag (
                      {formatPrice((product.salePrice || product.price) * quantity, currency)})
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
