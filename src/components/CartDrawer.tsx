import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Tag,
  Check,
  Percent,
} from 'lucide-react';
import { CartItem, Currency } from '../types';
import { formatPrice } from '../utils/formatters';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currency: Currency;
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedToCheckout: (appliedDiscount: number, promoCode?: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; percent: number } | null>(null);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeShippingThreshold = 150;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const discountAmount = appliedPromo ? (subtotal * appliedPromo.percent) / 100 : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = promoInput.trim().toUpperCase();
    if (clean === 'ROHAA10') {
      setAppliedPromo({ code: clean, percent: 10 });
      setPromoError(null);
    } else if (clean === 'EID2026' || clean === 'EIDMUBARAK') {
      setAppliedPromo({ code: clean, percent: 15 });
      setPromoError(null);
    } else {
      setPromoError('Invalid code. Try "ROHAA10" or "EID2026".');
    }
  };

  return (
    <div
      id="cart-drawer-overlay"
      className="fixed inset-0 z-50 bg-[#1A1816]/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200"
    >
      <div className="w-full max-w-md bg-[#FAF8F5] h-full shadow-2xl flex flex-col justify-between border-l border-[#EBE4D8] animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-[#EBE4D8] bg-[#F5EFE6] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#8C6D46]" />
            <h3 className="font-serif-brand font-semibold text-lg text-[#1F1B16]">
              Your Modest Bag ({cartItems.reduce((acc, it) => acc + it.quantity, 0)})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#7A7268] hover:text-[#1F1B16] rounded-full hover:bg-[#EBE4D8] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-[#FAF5ED] px-5 py-3 border-b border-[#EBE4D8]">
          <div className="flex justify-between items-center text-xs text-[#524638] font-medium mb-1.5">
            {remainingForFreeShipping > 0 ? (
              <span>
                Add{' '}
                <strong className="text-[#8C6D46]">
                  {formatPrice(remainingForFreeShipping, currency)}
                </strong>{' '}
                more for complimentary express shipping
              </span>
            ) : (
              <span className="text-emerald-800 flex items-center gap-1 font-semibold">
                <Check className="w-3.5 h-3.5 text-emerald-600" /> You unlocked Free Express Shipping!
              </span>
            )}
            <span className="text-[11px] text-[#8A8175]">Target: $150</span>
          </div>
          <div className="w-full h-1.5 bg-[#E6DDCF] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#8C6D46] transition-all duration-300"
              style={{ width: `${progressToFreeShipping}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#FAF5ED] text-[#A69784] flex items-center justify-center mx-auto">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h4 className="font-serif-brand text-lg text-[#24211E]">Your bag is currently empty</h4>
              <p className="text-xs text-[#7A7268] max-w-xs mx-auto">
                Explore our handcrafted abayas, silk sets, and fine hijabs to begin your collection.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2 bg-[#2D241A] text-[#FAF8F5] text-xs font-medium rounded-xl hover:bg-[#1A140E] transition"
              >
                Explore Atelier
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-3.5 p-3 rounded-xl bg-white border border-[#EBE4D8] shadow-sm relative group"
              >
                <div className="w-16 h-22 rounded-lg overflow-hidden bg-[#F5EFE6] shrink-0 border border-[#EBE4D8]">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-serif-brand font-medium text-sm text-[#1F1B16] line-clamp-1">
                        {item.title}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-[#A69C8E] hover:text-red-600 transition"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-[11px] text-[#6E6457]">
                      <span className="flex items-center gap-1">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block"
                          style={{ backgroundColor: item.selectedColor.hex }}
                        />
                        {item.selectedColor.name}
                      </span>
                      <span>•</span>
                      <span>Length: {item.selectedLength}</span>
                      {item.selectedSize && (
                        <>
                          <span>•</span>
                          <span>Size: {item.selectedSize}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center border border-[#D5CBB9] rounded-lg overflow-hidden bg-[#FAF8F5]">
                      <button
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="px-2 py-0.5 text-xs text-[#524638] hover:bg-[#EBE4D8]"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-semibold text-[#24211E]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-0.5 text-xs text-[#524638] hover:bg-[#EBE4D8]"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-medium text-xs text-[#1F1B16]">
                      {formatPrice(item.price * item.quantity, currency)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Promo Section */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-[#EBE4D8] bg-[#F5EFE6] space-y-3">
            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="space-y-1">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-[#8A8175] absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Voucher code (e.g. ROHAA10)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-[#D5CBB9] bg-white focus:outline-none focus:ring-1 focus:ring-[#8C6D46] uppercase"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#FAF8F5] border border-[#D5CBB9] hover:bg-white text-xs font-medium text-[#4A4033] rounded-xl transition"
                >
                  Apply
                </button>
              </div>

              {appliedPromo && (
                <p className="text-[11px] text-emerald-800 font-medium flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-600" />
                  Code {appliedPromo.code} applied ({appliedPromo.percent}% discount)
                </p>
              )}
              {promoError && <p className="text-[11px] text-red-600">{promoError}</p>}
            </form>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-[#6E6457] pt-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal, currency)}</span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Discount ({appliedPromo.percent}%)</span>
                  <span>-{formatPrice(discountAmount, currency)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{remainingForFreeShipping === 0 ? 'FREE' : 'Calculated at checkout'}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-semibold text-[#1F1B16] pt-1 border-t border-[#E0D5C3]">
                <span>Estimated Total</span>
                <span className="text-base text-[#8C6D46] font-serif-brand font-bold">
                  {formatPrice(finalTotal, currency)}
                </span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              id="proceed-to-checkout-btn"
              onClick={() => onProceedToCheckout(discountAmount, appliedPromo?.code)}
              className="w-full py-3 bg-[#2D241A] hover:bg-[#1A140E] text-[#FAF8F5] rounded-xl text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg transition"
            >
              Proceed to Secure Checkout <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-[#8A8175] pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8C6D46]" />
              <span>256-bit SSL Encrypted • Discreet & Modest Packaging</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
