import { Collection, Product } from '../types';

export const INITIAL_COLLECTIONS: Collection[] = [
  {
    id: 'col-ramadan-eid-26',
    name: "Ramadan & Eid '26 Atelier",
    slug: 'ramadan-eid-26',
    tagline: 'Lustrous silks, fluid pleats, and opulent modest silhouettes',
    description:
      'A celebration of ceremonial grace. Handcrafted with imported Medina silk and textured crepe, featuring extended modest lengths and cascading hemlines.',
    coverImage:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80',
    isActive: true,
    season: "Spring / Eid '26",
  },
  {
    id: 'col-minimal-abaya',
    name: 'The Minimalist Abaya',
    slug: 'minimal-abaya',
    tagline: 'Modern bisht silhouettes and seamless monochrome cuts',
    description:
      'Clean architectural lines for everyday modest sophistication. Cut from durable Japanese matte crepe that drapes with zero transparency.',
    coverImage:
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
    isActive: true,
    season: 'Permanent Collection',
  },
  {
    id: 'col-pure-linen',
    name: 'Oasis Pure Linen',
    slug: 'pure-linen',
    tagline: 'Breathable, organic modest co-ords and airy kimono robes',
    description:
      'Naturally cooling European washed linen designed for warm climates and relaxed afternoons. Uncluttered elegance in desert sand and sage hues.',
    coverImage:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
    isActive: true,
    season: 'Resort 2026',
  },
  {
    id: 'col-hijab-suite',
    name: 'The Hijab & Scarf Suite',
    slug: 'hijab-suite',
    tagline: 'Premium modal, pleated chiffon, and liquid silk scarves',
    description:
      'Unsurpassed non-slip comfort and breathability. Measured in generous maxi dimensions for effortless full-coverage styling.',
    coverImage:
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80',
    isActive: true,
    season: 'Essentials',
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'byr-001',
    title: 'Noor Medina Silk Open Abaya',
    slug: 'noor-medina-silk-open-abaya',
    price: 185,
    salePrice: 165,
    collectionId: 'col-ramadan-eid-26',
    category: 'Abayas',
    description:
      'A masterpiece of modern modesty. The Noor Abaya is tailored from ultra-soft Medina silk that flows weightlessly without clinging. Includes discreet interior snap buttons and matching waist tie for versatile open or closed styling.',
    fabrics: ['100% Premium Medina Silk', 'Subtle natural sheen', 'Breathable weave'],
    colors: [
      { name: 'Onyx Black', hex: '#1A1817', inStock: true },
      { name: 'Warm Taupe', hex: '#9E8B7A', inStock: true },
      { name: 'Champagne Pearl', hex: '#E6DDD4', inStock: true },
      { name: 'Desert Sage', hex: '#7D8A7C', inStock: true },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    lengths: ['52"', '54"', '56"', '58"', '60"'],
    images: [
      {
        id: 'img-1-1',
        url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80',
        alt: 'Noor Medina Silk Open Abaya in Warm Taupe front view',
        isPrimary: true,
      },
      {
        id: 'img-1-2',
        url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80',
        alt: 'Noor Medina Silk Open Abaya drape detail',
        isPrimary: false,
      },
      {
        id: 'img-1-3',
        url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
        alt: 'Noor Abaya fabric texture and sleeve cut',
        isPrimary: false,
      },
    ],
    isNew: true,
    isBestseller: true,
    inStock: 18,
    careInstructions: 'Dry clean recommended or gentle hand wash cold with silk detergent. Line dry in shade. Low steam iron.',
    fitNotes: 'True to modest sizing. Designed with a loose, graceful drape. Select your standard length (height 5’4” typically wears 54”).',
    badge: 'Eid Collection',
  },
  {
    id: 'byr-002',
    title: 'Safiyya Pleated Batwing Kaftan',
    slug: 'safiyya-pleated-batwing-kaftan',
    price: 210,
    collectionId: 'col-ramadan-eid-26',
    category: 'Occasion Wear',
    description:
      'Crafted for celebratory gatherings and Eid evenings. The Safiyya Kaftan showcases precision micro-pleating along the shoulders that cascade into an expansive, regal batwing silhouette.',
    fabrics: ['Crepe de Chine & Satin Finish', 'Fully opaque lining included'],
    colors: [
      { name: 'Oyster Champagne', hex: '#D6C7B2', inStock: true },
      { name: 'Deep Emerald', hex: '#2A443B', inStock: true },
      { name: 'Midnight Navy', hex: '#1C2638', inStock: true },
    ],
    sizes: ['Free Size (Fits XS - 2XL)'],
    lengths: ['54"', '56"', '58"'],
    images: [
      {
        id: 'img-2-1',
        url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80',
        alt: 'Safiyya Pleated Batwing Kaftan portrait',
        isPrimary: true,
      },
      {
        id: 'img-2-2',
        url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=900&q=80',
        alt: 'Safiyya Kaftan back view and sweep',
        isPrimary: false,
      },
    ],
    isNew: true,
    inStock: 12,
    careInstructions: 'Specialist dry clean only to preserve precision pleating.',
    fitNotes: 'Generous oversized batwing silhouette. Effortless drape that suits all body profiles while providing complete coverage.',
    badge: 'Limited Atelier',
  },
  {
    id: 'byr-003',
    title: 'Ayla Structured Japanese Crepe Bisht',
    slug: 'ayla-structured-crepe-bisht',
    price: 165,
    collectionId: 'col-minimal-abaya',
    category: 'Abayas',
    description:
      'Inspired by the timeless Arabian bisht, the Ayla abaya merges clean contemporary lines with traditional dignity. Features wide cuff details and a reinforced collar that stays crisp throughout the day.',
    fabrics: ['Heavy Japanese Matte Crepe', 'Zero static & wrinkle resistant'],
    colors: [
      { name: 'Charcoal Cocoa', hex: '#3B332F', inStock: true },
      { name: 'Desert Sand', hex: '#D9C8B4', inStock: true },
      { name: 'Raw Olive', hex: '#585C4F', inStock: true },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    lengths: ['52"', '54"', '56"', '58"', '60"'],
    images: [
      {
        id: 'img-3-1',
        url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80',
        alt: 'Ayla Structured Bisht in Charcoal front view',
        isPrimary: true,
      },
      {
        id: 'img-3-2',
        url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80',
        alt: 'Ayla Bisht sleeve detail',
        isPrimary: false,
      },
    ],
    isBestseller: true,
    inStock: 24,
    careInstructions: 'Machine wash delicate at 30°C. Hang on wide hanger immediately. Minimal steaming required.',
    fitNotes: 'Traditional Bisht cut (extra wide bust and sleeve circumference for full coverage modesty).',
    badge: 'Core Essential',
  },
  {
    id: 'byr-004',
    title: 'Lina Relaxed Modest Linen 2-Piece Set',
    slug: 'lina-relaxed-modest-linen-set',
    price: 145,
    salePrice: 125,
    collectionId: 'col-pure-linen',
    category: 'Modest Sets',
    description:
      'A versatile two-piece ensemble consisting of an extended tunic blouse with high modest neck and wide-leg matching trousers with elasticated back waist and deep pockets.',
    fabrics: ['100% Pre-washed European Flax Linen', 'Hypoallergenic & cooling'],
    colors: [
      { name: 'Oatmeal Milk', hex: '#EBE5DA', inStock: true },
      { name: 'Sunbaked Clay', hex: '#B57962', inStock: true },
      { name: 'Dusty Moss', hex: '#737F6C', inStock: true },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    lengths: ['Standard Trousers (40" length)', 'Long Trousers (43" length)'],
    images: [
      {
        id: 'img-4-1',
        url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
        alt: 'Lina Modest Linen 2-Piece Set in Oatmeal',
        isPrimary: true,
      },
      {
        id: 'img-4-2',
        url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80',
        alt: 'Lina Set trousers and hemline',
        isPrimary: false,
      },
    ],
    isNew: true,
    inStock: 15,
    careInstructions: 'Machine wash cool with mild detergent. Reshape while damp. Linen softens beautifully with every wash.',
    fitNotes: 'Generous relaxed fit. Tunic provides below-hip modest coverage.',
    badge: 'Summer Favorite',
  },
  {
    id: 'byr-005',
    title: 'Zahra Silk-Finish Maxi Kimono Duster',
    slug: 'zahra-silk-finish-maxi-kimono',
    price: 135,
    collectionId: 'col-pure-linen',
    category: 'Kimonos & Kaftans',
    description:
      'An ethereal layering layer designed to effortlessly elevate slip dresses and casual sets. Tailored with wide bell sleeves and an elongated dramatic hemline that ripples with movement.',
    fabrics: ['Textured Viscose-Silk blend', 'Subtle slub texture with fluid movement'],
    colors: [
      { name: 'Ivory Sand', hex: '#F0EAE1', inStock: true },
      { name: 'Warm Terracotta', hex: '#9C5C48', inStock: true },
      { name: 'Soft Cocoa', hex: '#5A473E', inStock: true },
    ],
    sizes: ['Petite (Under 5’3”)', 'Regular (5’4” - 5’7”)', 'Tall (5’8”+)'],
    lengths: ['52"', '56"', '60"'],
    images: [
      {
        id: 'img-5-1',
        url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80',
        alt: 'Zahra Silk-Finish Maxi Kimono Duster in Ivory',
        isPrimary: true,
      },
      {
        id: 'img-5-2',
        url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
        alt: 'Zahra Kimono styling with layered modest set',
        isPrimary: false,
      },
    ],
    isBestseller: false,
    inStock: 10,
    careInstructions: 'Hand wash gently cold, lay flat to dry. Steam on low.',
    fitNotes: 'Designed as a fluid outer layer with an open front and generous armholes.',
  },
  {
    id: 'byr-006',
    title: 'Rawdah Modal & Silk Maxi Hijab',
    slug: 'rawdah-modal-silk-maxi-hijab',
    price: 34,
    collectionId: 'col-hijab-suite',
    category: 'Hijabs & Scarves',
    description:
      'Our signature luxury everyday scarf. Woven from sustainable Austrian micro-modal infused with pure silk threads. Non-slip, cloud-soft, and generously sized (200cm x 85cm) for all draping styles without bulk.',
    fabrics: ['80% Austrian Modal, 20% Mulberry Silk', 'Breathable zero-sweat technology'],
    colors: [
      { name: 'Nude Almond', hex: '#D5BFA8', inStock: true },
      { name: 'Espresso', hex: '#3E2F26', inStock: true },
      { name: 'Soft Pistachio', hex: '#A2B099', inStock: true },
      { name: 'Dusty Rose', hex: '#C2988E', inStock: true },
      { name: 'Pure Chalk', hex: '#F7F5F0', inStock: true },
    ],
    sizes: ['Maxi 200cm x 85cm'],
    lengths: ['Standard Maxi'],
    images: [
      {
        id: 'img-6-1',
        url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80',
        alt: 'Rawdah Modal & Silk Maxi Hijab draped elegantly',
        isPrimary: true,
      },
      {
        id: 'img-6-2',
        url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80',
        alt: 'Rawdah Scarf texture and fine-rolled hem',
        isPrimary: false,
      },
    ],
    isBestseller: true,
    inStock: 50,
    careInstructions: 'Hand wash or use laundry mesh bag on gentle cycle. Air dry. No pins required.',
    fitNotes: '200cm length allows for multi-layered chest and back coverage.',
    badge: '5-Star Rated',
  },
  {
    id: 'byr-007',
    title: 'Maryam Silk Satin Slip & Tie Abaya Set',
    slug: 'maryam-silk-satin-slip-abaya-set',
    price: 195,
    collectionId: 'col-ramadan-eid-26',
    category: 'Abayas',
    description:
      'A complete two-piece coordinated modest outfit. Includes a full-coverage sleeveless inner slip dress with round neckline and an exquisite sheer organza-sheen outer abaya with delicate cuff ties.',
    fabrics: ['Heavy Liquid Satin & Organza weave', 'Non-see through inner slip'],
    colors: [
      { name: 'Muted Champagne', hex: '#E2D5C3', inStock: true },
      { name: 'Black Caviar', hex: '#161413', inStock: true },
      { name: 'Sage Celadon', hex: '#8C9A8B', inStock: true },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    lengths: ['52"', '54"', '56"', '58"'],
    images: [
      {
        id: 'img-7-1',
        url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=900&q=80',
        alt: 'Maryam Silk Satin Slip & Tie Abaya Set',
        isPrimary: true,
      },
      {
        id: 'img-7-2',
        url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80',
        alt: 'Maryam Abaya set movement and drape',
        isPrimary: false,
      },
    ],
    isNew: true,
    inStock: 14,
    careInstructions: 'Dry clean recommended. Can be cool steamed.',
    fitNotes: 'Slip is tailored straight with side slits below knee for ease of movement. Outer abaya is loose and fluid.',
    badge: 'Complete 2-Piece Set',
  },
  {
    id: 'byr-008',
    title: 'Sakinah Travel & Home Prayer Dress Set',
    slug: 'sakinah-travel-prayer-dress-set',
    price: 78,
    salePrice: 68,
    collectionId: 'col-minimal-abaya',
    category: 'Prayer Sets',
    description:
      'Engineered for spiritual tranquility. An all-in-one head-to-toe prayer dress with integrated soft jersey scarf and elasticated wrist cuffs that prevent sleeves from slipping during ruku and sujud. Comes with compact travel pouch.',
    fabrics: ['Ultra-light Breathable Cotton Rayon', 'Cooling & opaque weave'],
    colors: [
      { name: 'Soft Pearl Gray', hex: '#DCDAD7', inStock: true },
      { name: 'Dusty Lavender', hex: '#9E949E', inStock: true },
      { name: 'Earthy Olive', hex: '#666C5E', inStock: true },
    ],
    sizes: ['One Size (Comfortably fits 5’0” to 5’10”)'],
    lengths: ['Full Length 160cm sweep'],
    images: [
      {
        id: 'img-8-1',
        url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80',
        alt: 'Sakinah Prayer Dress Set front view',
        isPrimary: true,
      },
      {
        id: 'img-8-2',
        url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80',
        alt: 'Sakinah Prayer Set matching pouch',
        isPrimary: false,
      },
    ],
    isBestseller: true,
    inStock: 32,
    careInstructions: 'Machine wash warm, gentle spin. Fast drying fabric.',
    fitNotes: 'One-piece design with attached hijab. Easy slip-on style without pins.',
    badge: 'Travel Essential',
  },
];

export const CURRENCY_CONFIGS: Record<string, { symbol: string; rate: number }> = {
  USD: { symbol: '$', rate: 1.0 },
  AED: { symbol: 'AED ', rate: 3.67 },
  SAR: { symbol: 'SAR ', rate: 3.75 },
  GBP: { symbol: '£', rate: 0.79 },
  EUR: { symbol: '€', rate: 0.92 },
};

export const SAMPLE_MODEST_PHOTOS = [
  {
    title: 'Editorial Studio Taupe',
    url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Minimalist Architecture Monochrome',
    url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Natural Linen Neutral',
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Graceful Draped Scarf',
    url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Opulent Batwing Kaftan',
    url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Golden Hour Sunset Silhouette',
    url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Soft Sage Layering Robe',
    url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Terracotta Desert Modest Set',
    url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80',
  },
];
