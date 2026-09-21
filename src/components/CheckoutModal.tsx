import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  CreditCard,
  Truck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  Banknote,
  Printer,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import { CartItem, Currency, CustomerDetails, Order } from '../types';
import { formatPrice, generateOrderNumber } from '../utils/formatters';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currency: Currency;
  discountAmount: number;
  promoCodeApplied?: string;
  onOrderCompleted: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  currency,
  discountAmount,
  promoCodeApplied,
  onOrderCompleted,
}) => {
  const [step, setStep] = useState<'details' | 'shipping' | 'payment' | 'authenticating' | 'success'>(
    'details'
  );

  const [customer, setCustomer] = useState<CustomerDetails>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'United Arab Emirates',
    postalCode: '',
    deliveryNotes: '',
  });

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [discretePackaging, setDiscretePackaging] = useState(true);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'cod'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [cardName, setCardName] = useState('');

  // Confirmed order state
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
  const isFreeShipping = subtotal >= 150;
  const shippingCost =
    shippingMethod === 'express' ? 24 : isFreeShipping ? 0 : 12;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'details') {
      if (!customer.fullName || !customer.email || !customer.address || !customer.city) {
        alert('Please complete all required address fields.');
        return;
      }
      setStep('shipping');
    } else if (step === 'shipping') {
      setStep('payment');
    }
  };

  const handleProcessPayment = () => {
    // Show 3D Secure / Simulated bank verification
    setStep('authenticating');

    setTimeout(() => {
      const orderNumber = generateOrderNumber();
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber,
        createdAt: new Date().toISOString(),
        customer,
        items: [...cartItems],
        subtotal,
        discount: discountAmount,
        shippingCost,
        total: finalTotal,
        currency,
        shippingMethod,
        paymentMethod,
        status: 'Confirmed',
      };

      setConfirmedOrder(newOrder);
      setStep('success');
      onOrderCompleted(newOrder);
    }, 2200);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div
      id="secure-checkout-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#1A1816]/75 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-3xl max-h-[92vh] bg-[#FAF8F5] text-[#24211E] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-[#E8DFC8]/60">
        {/* Secure Top Banner */}
        <div className="bg-[#2D241A] text-[#FAF8F5] px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <ShieldCheck className="w-4 h-4 text-[#D9C4A5]" />
            <span className="font-medium tracking-wide">
              byrohaa 256-Bit SSL Encrypted Checkout
            </span>
            <span className="hidden sm:inline-block text-[#9E8E7D]">• PCI DSS Level 1</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-[#C9A982] flex items-center gap-1 font-medium">
              <Lock className="w-3 h-3" /> End-to-End Encrypted
            </span>
            {step !== 'authenticating' && (
              <button
                onClick={onClose}
                className="text-[#B5A898] hover:text-white transition p-1"
                title="Exit checkout"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Progress Tracker (unless on success/authenticating) */}
        {step !== 'success' && step !== 'authenticating' && (
          <div className="bg-[#F5EFE6] px-6 py-3 border-b border-[#EBE4D8] flex items-center justify-between text-xs font-medium">
            <div className="flex items-center gap-2">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  step === 'details'
                    ? 'bg-[#2D241A] text-white font-bold'
                    : 'bg-[#C9A982] text-white'
                }`}
              >
                1
              </span>
              <span className={step === 'details' ? 'text-[#1F1B16] font-semibold' : 'text-[#7D7366]'}>
                Delivery
              </span>
            </div>

            <div className="h-0.5 w-12 bg-[#D9CDBE]" />

            <div className="flex items-center gap-2">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  step === 'shipping'
                    ? 'bg-[#2D241A] text-white font-bold'
                    : step === 'payment'
                    ? 'bg-[#C9A982] text-white'
                    : 'bg-[#D9CDBE] text-[#6E6457]'
                }`}
              >
                2
              </span>
              <span className={step === 'shipping' ? 'text-[#1F1B16] font-semibold' : 'text-[#7D7366]'}>
                Shipping
              </span>
            </div>

            <div className="h-0.5 w-12 bg-[#D9CDBE]" />

            <div className="flex items-center gap-2">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  step === 'payment'
                    ? 'bg-[#2D241A] text-white font-bold'
                    : 'bg-[#D9CDBE] text-[#6E6457]'
                }`}
              >
                3
              </span>
              <span className={step === 'payment' ? 'text-[#1F1B16] font-semibold' : 'text-[#7D7366]'}>
                Secure Payment
              </span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#FAF8F5]">
          {/* STEP 1: CUSTOMER & DELIVERY */}
          {step === 'details' && (
            <form onSubmit={handleNextStep} className="space-y-4 max-w-xl mx-auto">
              <div>
                <h3 className="font-serif-brand text-lg font-semibold text-[#1F1B16]">
                  Contact & Modest Delivery Information
                </h3>
                <p className="text-xs text-[#7A7268]">
                  We package all byrohaa orders with discreet luxury dust covers.
                </p>
              </div>

              <div className="space-y-3 bg-white p-4 rounded-xl border border-[#EBE4D8] shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#4A433A] uppercase tracking-wider">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Fatima Al-Mansoor"
                      value={customer.fullName}
                      onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CBB9] focus:outline-none focus:ring-1 focus:ring-[#8C6D46]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#4A433A] uppercase tracking-wider">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="fatima@example.com"
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CBB9] focus:outline-none focus:ring-1 focus:ring-[#8C6D46]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#4A433A] uppercase tracking-wider">
                      Mobile Phone (for courier SMS) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+971 50 123 4567"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CBB9] focus:outline-none focus:ring-1 focus:ring-[#8C6D46]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#4A433A] uppercase tracking-wider">
                      Country / Region *
                    </label>
                    <select
                      value={customer.country}
                      onChange={(e) => setCustomer({ ...customer, country: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CBB9] focus:outline-none focus:ring-1 focus:ring-[#8C6D46]"
                    >
                      <option value="United Arab Emirates">United Arab Emirates</option>
                      <option value="Saudi Arabia">Saudi Arabia</option>
                      <option value="Qatar">Qatar</option>
                      <option value="Kuwait">Kuwait</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="France">France</option>
                      <option value="Malaysia">Malaysia</option>
                      <option value="Indonesia">Indonesia</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#4A433A] uppercase tracking-wider">
                    Street Address & Villa / Apartment *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Villa 24, Street 12B, Al Safa 2"
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CBB9] focus:outline-none focus:ring-1 focus:ring-[#8C6D46]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#4A433A] uppercase tracking-wider">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Dubai / Riyadh / London"
                      value={customer.city}
                      onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CBB9] focus:outline-none focus:ring-1 focus:ring-[#8C6D46]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#4A433A] uppercase tracking-wider">
                      Postal / ZIP Code
                    </label>
                    <input
                      type="text"
                      placeholder="00000"
                      value={customer.postalCode}
                      onChange={(e) => setCustomer({ ...customer, postalCode: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CBB9] focus:outline-none focus:ring-1 focus:ring-[#8C6D46]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#4A433A] uppercase tracking-wider">
                    Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Leave with building security, or ring door chime"
                    value={customer.deliveryNotes}
                    onChange={(e) => setCustomer({ ...customer, deliveryNotes: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CBB9] focus:outline-none focus:ring-1 focus:ring-[#8C6D46]"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-[#7A7268] hover:text-[#1F1B16] font-medium"
                >
                  Return to Bag
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#2D241A] hover:bg-[#1C1610] text-[#FAF8F5] rounded-xl text-xs font-medium flex items-center gap-2 shadow-md transition"
                >
                  Continue to Shipping <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: SHIPPING OPTIONS */}
          {step === 'shipping' && (
            <div className="space-y-5 max-w-xl mx-auto">
              <div>
                <h3 className="font-serif-brand text-lg font-semibold text-[#1F1B16]">
                  Select Delivery Courier
                </h3>
                <p className="text-xs text-[#7A7268]">
                  Shipping to {customer.fullName} in {customer.city}, {customer.country}
                </p>
              </div>

              <div className="space-y-3">
                <div
                  onClick={() => setShippingMethod('standard')}
                  className={`p-4 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                    shippingMethod === 'standard'
                      ? 'bg-white border-[#8C6D46] ring-1 ring-[#8C6D46]'
                      : 'bg-white/60 border-[#EBE4D8] hover:border-[#D5CBB9]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-[#FAF5ED] text-[#8C6D46]">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-[#24211E]">
                        Standard Modest Tracked Courier
                      </h4>
                      <p className="text-[11px] text-[#7A7268]">
                        Estimated 3-5 business days • Signed on delivery
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-[#24211E]">
                      {isFreeShipping ? 'FREE' : formatPrice(12, currency)}
                    </span>
                    {isFreeShipping && (
                      <span className="block text-[10px] text-emerald-700 font-medium">
                        Order &gt; $150
                      </span>
                    )}
                  </div>
                </div>

                <div
                  onClick={() => setShippingMethod('express')}
                  className={`p-4 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                    shippingMethod === 'express'
                      ? 'bg-white border-[#8C6D46] ring-1 ring-[#8C6D46]'
                      : 'bg-white/60 border-[#EBE4D8] hover:border-[#D5CBB9]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-[#FAF5ED] text-[#8C6D46]">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-[#24211E]">
                        Express Priority Air Courier
                      </h4>
                      <p className="text-[11px] text-[#7A7268]">
                        Guaranteed 1-2 business days • Priority handling
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-[#24211E]">
                      {formatPrice(24, currency)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Discreet Luxury Packaging checkbox */}
              <div className="bg-white p-3.5 rounded-xl border border-[#EBE4D8] flex items-center gap-3">
                <input
                  type="checkbox"
                  id="pkg-discreet"
                  checked={discretePackaging}
                  onChange={(e) => setDiscretePackaging(e.target.checked)}
                  className="rounded accent-[#8C6D46] w-4 h-4"
                />
                <label htmlFor="pkg-discreet" className="text-xs text-[#3E3831] cursor-pointer">
                  <span className="font-semibold block text-[#24211E]">
                    Complimentary byrohaa Keepsake Packaging
                  </span>
                  Includes breathable satin storage dust bag and discrete protective outer box.
                </label>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="text-xs text-[#7A7268] hover:text-[#1F1B16] flex items-center gap-1 font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Delivery
                </button>
                <button
                  type="button"
                  onClick={() => setStep('payment')}
                  className="px-6 py-2.5 bg-[#2D241A] hover:bg-[#1C1610] text-[#FAF8F5] rounded-xl text-xs font-medium flex items-center gap-2 shadow-md transition"
                >
                  Continue to Payment <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT */}
          {step === 'payment' && (
            <div className="space-y-5 max-w-xl mx-auto">
              <div>
                <h3 className="font-serif-brand text-lg font-semibold text-[#1F1B16]">
                  Encrypted Payment
                </h3>
                <p className="text-xs text-[#7A7268]">
                  All transactions are secured with 256-bit encryption. Card details are never stored unencrypted.
                </p>
              </div>

              {/* Payment Method Selector */}
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                    paymentMethod === 'card'
                      ? 'bg-white border-[#8C6D46] shadow-sm ring-1 ring-[#8C6D46]'
                      : 'bg-white/60 border-[#EBE4D8] hover:bg-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#8C6D46]" />
                  <span className="text-xs font-medium text-[#24211E]">Credit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                    paymentMethod === 'apple_pay'
                      ? 'bg-white border-[#8C6D46] shadow-sm ring-1 ring-[#8C6D46]'
                      : 'bg-white/60 border-[#EBE4D8] hover:bg-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-[#8C6D46]" />
                  <span className="text-xs font-medium text-[#24211E]">Apple / G-Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                    paymentMethod === 'cod'
                      ? 'bg-white border-[#8C6D46] shadow-sm ring-1 ring-[#8C6D46]'
                      : 'bg-white/60 border-[#EBE4D8] hover:bg-white'
                  }`}
                >
                  <Banknote className="w-4 h-4 text-[#8C6D46]" />
                  <span className="text-xs font-medium text-[#24211E]">Cash on Delivery</span>
                </button>
              </div>

              {/* Credit Card Inputs with Visual Card */}
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  {/* Visual Luxury Card */}
                  <div className="bg-gradient-to-tr from-[#2A231C] to-[#453A2E] text-[#FAF8F5] p-5 rounded-2xl shadow-xl border border-[#5E5143] space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-serif-brand tracking-widest text-sm text-[#D9C4A5] font-semibold">
                        byrohaa
                      </span>
                      <span className="text-xs text-[#E8DCCF]/80 uppercase tracking-widest font-mono">
                        VISA SECURE
                      </span>
                    </div>

                    <div className="font-mono text-base tracking-widest text-[#FAF8F5]">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </div>

                    <div className="flex justify-between items-end text-xs">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-[#A69784] block">
                          Cardholder
                        </span>
                        <span className="font-medium tracking-wide">
                          {cardName || customer.fullName || 'FATIMA AL-MANSOOR'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] uppercase tracking-wider text-[#A69784] block">
                          Expires
                        </span>
                        <span className="font-mono">{cardExpiry || 'MM/YY'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Form fields */}
                  <div className="bg-white p-4 rounded-xl border border-[#EBE4D8] space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#4A433A] uppercase tracking-wider">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4242 4242 4242 4242"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CBB9] focus:outline-none focus:ring-1 focus:ring-[#8C6D46] font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#4A433A] uppercase tracking-wider">
                          Expiry Date (MM/YY)
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="12/28"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CBB9] focus:outline-none focus:ring-1 focus:ring-[#8C6D46] font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#4A433A] uppercase tracking-wider">
                          Security CVV
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="888"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CBB9] focus:outline-none focus:ring-1 focus:ring-[#8C6D46] font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#4A433A] uppercase tracking-wider">
                        Name on Card
                      </label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder={customer.fullName || 'Fatima Al-Mansoor'}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CBB9] focus:outline-none focus:ring-1 focus:ring-[#8C6D46]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'apple_pay' && (
                <div className="bg-white p-6 rounded-xl border border-[#EBE4D8] text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mx-auto">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-semibold text-[#24211E]">
                    Instant Biometric Checkout
                  </h4>
                  <p className="text-xs text-[#7A7268] max-w-xs mx-auto">
                    Authenticate instantly with Touch ID or Face ID. Your payment tokens are generated securely.
                  </p>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="bg-white p-6 rounded-xl border border-[#EBE4D8] text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#FAF5ED] text-[#8C6D46] flex items-center justify-center mx-auto">
                    <Banknote className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-semibold text-[#24211E]">
                    Cash on Modest Delivery (COD)
                  </h4>
                  <p className="text-xs text-[#7A7268] max-w-xs mx-auto">
                    Pay securely in cash directly to our discreet courier upon inspecting your byrohaa delivery.
                  </p>
                </div>
              )}

              {/* Order Final Summary Box */}
              <div className="bg-[#F5EFE6] p-4 rounded-xl border border-[#EBE4D8] space-y-2 text-xs">
                <div className="flex justify-between text-[#6E6457]">
                  <span>Items Subtotal ({cartItems.reduce((a, b) => a + b.quantity, 0)})</span>
                  <span>{formatPrice(subtotal, currency)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Promotion ({promoCodeApplied || 'Voucher'})</span>
                    <span>-{formatPrice(discountAmount, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#6E6457]">
                  <span>Shipping Courier</span>
                  <span>{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost, currency)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-[#E0D5C3] font-semibold text-sm text-[#1F1B16]">
                  <span>Total Amount Due</span>
                  <span className="text-base text-[#8C6D46] font-serif-brand font-bold">
                    {formatPrice(finalTotal, currency)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  className="text-xs text-[#7A7268] hover:text-[#1F1B16] flex items-center gap-1 font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Shipping
                </button>
                <button
                  id="submit-payment-btn"
                  type="button"
                  onClick={handleProcessPayment}
                  className="px-8 py-3 bg-[#2D241A] hover:bg-[#1C1610] text-[#FAF8F5] rounded-xl text-xs font-medium tracking-wide flex items-center gap-2 shadow-lg transition"
                >
                  <Lock className="w-3.5 h-3.5 text-[#D9C4A5]" />
                  Authorize & Place Order ({formatPrice(finalTotal, currency)})
                </button>
              </div>
            </div>
          )}

          {/* STEP: 3D SECURE AUTHENTICATING SIMULATION */}
          {step === 'authenticating' && (
            <div className="py-16 text-center space-y-4 max-w-sm mx-auto">
              <div className="relative w-16 h-16 mx-auto">
                <div className="w-16 h-16 rounded-full border-4 border-[#EBE4D8] border-t-[#8C6D46] animate-spin" />
                <Lock className="w-5 h-5 text-[#8C6D46] absolute inset-0 m-auto" />
              </div>

              <div>
                <h3 className="font-serif-brand text-lg font-semibold text-[#1F1B16]">
                  Connecting to Secure Bank Gateway
                </h3>
                <p className="text-xs text-[#7A7268] mt-1">
                  Verifying 3D Secure 2.0 cryptogram and encrypting dispatch records...
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 text-[11px] rounded-full font-medium border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit SSL Handshake Verified
              </div>
            </div>
          )}

          {/* STEP 4: ORDER CONFIRMED */}
          {step === 'success' && confirmedOrder && (
            <div className="py-6 space-y-6 max-w-xl mx-auto text-center">
              <div className="w-16 h-16 rounded-full bg-[#FAF5ED] text-[#8C6D46] flex items-center justify-center mx-auto shadow-inner border border-[#E0D5C3]">
                <CheckCircle2 className="w-8 h-8 text-[#8C6D46]" />
              </div>

              <div>
                <span className="text-xs font-semibold tracking-wider uppercase text-[#8C6D46]">
                  Alhamdulillah • Order Confirmed
                </span>
                <h2 className="font-serif-brand text-2xl font-semibold text-[#1F1B16] mt-1">
                  Thank You for Choosing byrohaa
                </h2>
                <p className="text-xs text-[#7A7268] mt-1">
                  Your order <span className="font-mono font-bold text-[#1F1B16]">{confirmedOrder.orderNumber}</span> has been placed securely and dispatched to our atelier team.
                </p>
              </div>

              {/* Order Receipt Card */}
              <div className="bg-white p-5 rounded-2xl border border-[#EBE4D8] text-left space-y-4 shadow-sm text-xs">
                <div className="flex justify-between items-center border-b border-[#F4EFE6] pb-3">
                  <div>
                    <span className="text-[#8A8175] text-[10px] uppercase tracking-wider block">
                      Order Number
                    </span>
                    <span className="font-mono font-bold text-sm text-[#1F1B16]">
                      {confirmedOrder.orderNumber}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[#8A8175] text-[10px] uppercase tracking-wider block">
                      Delivery Window
                    </span>
                    <span className="font-medium text-[#24211E]">
                      {confirmedOrder.shippingMethod === 'express' ? '1 - 2 Days' : '3 - 5 Days'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[#8A8175] text-[10px] uppercase tracking-wider font-semibold block">
                    Garments Ordered
                  </span>
                  {confirmedOrder.items.map((it) => (
                    <div key={it.id} className="flex justify-between items-center py-1">
                      <div className="flex items-center gap-2">
                        <img src={it.image} alt={it.title} className="w-8 h-10 object-cover rounded" />
                        <div>
                          <p className="font-medium text-[#24211E]">{it.title}</p>
                          <p className="text-[11px] text-[#7A7268]">
                            Length: {it.selectedLength} • {it.selectedColor.name} • Qty: {it.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-[#24211E]">
                        {formatPrice(it.price * it.quantity, currency)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-[#F4EFE6] flex justify-between items-center font-bold text-sm text-[#1F1B16]">
                  <span>Total Paid</span>
                  <span className="text-base text-[#8C6D46] font-serif-brand">
                    {formatPrice(confirmedOrder.total, currency)}
                  </span>
                </div>

                <div className="pt-2 text-[11px] text-[#7A7268] bg-[#FAF8F5] p-3 rounded-lg border border-[#EBE4D8]">
                  A confirmation dispatch email and SMS tracking link has been sent to{' '}
                  <span className="font-medium text-[#24211E]">{confirmedOrder.customer.email}</span>.
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  onClick={handlePrintReceipt}
                  className="px-4 py-2.5 bg-white border border-[#D5CBB9] hover:bg-[#F2EADB] text-xs font-medium text-[#4A4033] rounded-xl flex items-center gap-2 transition"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Order Receipt
                </button>

                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#2D241A] hover:bg-[#1C1610] text-[#FAF8F5] text-xs font-medium rounded-xl transition"
                >
                  Return to Storefront
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
