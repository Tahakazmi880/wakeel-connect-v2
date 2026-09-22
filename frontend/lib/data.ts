// ============================================================
// wakeel.connect — frontend mock data (Phase 1: UI first)
// Typed to mirror backend/prisma/schema.prisma. Every lawyer
// here is flagged isDemo: true and carries "(Demo)" in the
// display name — this data must NEVER be presented as real
// verified lawyers. Replaced by the real API in a later phase.
// ============================================================

export interface City {
  slug: string;
  nameEn: string;
  nameUr: string;
  province: string;
}

export interface PracticeArea {
  slug: string;
  nameEn: string;
  nameUr: string;
  description: string;
}

export interface Language {
  code: string;
  nameEn: string;
  nameUr: string;
}

export interface Review {
  id: string;
  clientName: string;
  rating: number; // 1..5
  comment: string;
  date: string;
  verified: boolean;
}

export interface Education {
  degree: string;
  institution: string;
  year: number;
}

export interface ServiceFee {
  nameEn: string;
  nameUr: string;
  feePaisa: number;
}

export interface ExperienceEntry {
  title: string;
  org: string;
  /** "present" or "former" — years are only shown when actually known. */
  status: "present" | "former";
}

export interface Lawyer {
  slug: string;
  displayName: string;
  photo: string; // /lawyers/<slug>.jpg — real photo, or AI portrait on demo profiles
  headline: string;
  bio: string;
  bioUrdu: string;
  gender: "male" | "female";
  citySlug: string;
  yearsExperience: number;
  consultationFeePaisa: number;
  barCouncil: string;
  barCouncilNo: string;
  courts: string[];
  practiceAreaSlugs: string[];
  langCodes: string[];
  chamberName: string;
  chamberAddress: string;
  education: Education[];
  services: ServiceFee[];
  experience?: ExperienceEntry[];
  rating: number;
  reviewCount: number;
  reviews: Review[];
  totalConsultations: number;
  isDemo: boolean;
}

// ---------------- Reference data ----------------

export const CITIES: City[] = [
  { slug: "karachi", nameEn: "Karachi", nameUr: "کراچی", province: "Sindh" },
  { slug: "lahore", nameEn: "Lahore", nameUr: "لاہور", province: "Punjab" },
  { slug: "islamabad", nameEn: "Islamabad", nameUr: "اسلام آباد", province: "Islamabad Capital Territory" },
  { slug: "rawalpindi", nameEn: "Rawalpindi", nameUr: "راولپنڈی", province: "Punjab" },
  { slug: "faisalabad", nameEn: "Faisalabad", nameUr: "فیصل آباد", province: "Punjab" },
  { slug: "multan", nameEn: "Multan", nameUr: "ملتان", province: "Punjab" },
  { slug: "peshawar", nameEn: "Peshawar", nameUr: "پشاور", province: "Khyber Pakhtunkhwa" },
  { slug: "quetta", nameEn: "Quetta", nameUr: "کوئٹہ", province: "Balochistan" },
  { slug: "hyderabad", nameEn: "Hyderabad", nameUr: "حیدرآباد", province: "Sindh" },
  { slug: "sialkot", nameEn: "Sialkot", nameUr: "سیالکوٹ", province: "Punjab" },
  { slug: "gujranwala", nameEn: "Gujranwala", nameUr: "گوجرانوالہ", province: "Punjab" },
  { slug: "bahawalpur", nameEn: "Bahawalpur", nameUr: "بہاولپور", province: "Punjab" },
];

export const PRACTICE_AREAS: PracticeArea[] = [
  { slug: "family-law", nameEn: "Family Law", nameUr: "خاندانی قانون", description: "Divorce, khula, child custody, maintenance and inheritance." },
  { slug: "criminal-law", nameEn: "Criminal Law", nameUr: "فوجداری قانون", description: "Bail, trials, appeals and quashment petitions." },
  { slug: "property-law", nameEn: "Property Law", nameUr: "جائیداد کا قانون", description: "Title disputes, possession suits and transfers." },
  { slug: "corporate-law", nameEn: "Corporate Law", nameUr: "کارپوریٹ قانون", description: "Company formation, contracts and compliance." },
  { slug: "tax-law", nameEn: "Tax Law", nameUr: "ٹیکس قانون", description: "Income tax, FBR notices and tribunal appeals." },
  { slug: "immigration-law", nameEn: "Immigration Law", nameUr: "امیگریشن قانون", description: "Visas, deportation defence and citizenship." },
  { slug: "labour-law", nameEn: "Labour & Employment", nameUr: "محنت کشوں کا قانون", description: "Wrongful termination, wages and workplace disputes." },
  { slug: "banking-finance", nameEn: "Banking & Finance", nameUr: "بینکاری و مالیات", description: "Loan defaults and banking court cases." },
  { slug: "constitutional-law", nameEn: "Constitutional Law", nameUr: "آئینی قانون", description: "Writ petitions and fundamental rights." },
  { slug: "cybercrime-law", nameEn: "Cybercrime Law", nameUr: "سائبر کرائم قانون", description: "Online harassment, fraud and PECA cases." },
  { slug: "consumer-law", nameEn: "Consumer Protection", nameUr: "صارفین کے حقوق", description: "Faulty goods and services, consumer claims." },
  { slug: "arbitration", nameEn: "Arbitration & Mediation", nameUr: "ثالثی و مصالحت", description: "Out-of-court settlements and mediation." },
];

export const LANGUAGES: Language[] = [
  { code: "ur", nameEn: "Urdu", nameUr: "اردو" },
  { code: "en", nameEn: "English", nameUr: "انگریزی" },
  { code: "pa", nameEn: "Punjabi", nameUr: "پنجابی" },
  { code: "sd", nameEn: "Sindhi", nameUr: "سندھی" },
  { code: "ps", nameEn: "Pashto", nameUr: "پشتو" },
];

export interface Court {
  slug: string;
  nameEn: string;
  nameUr: string;
  citySlug: string; // home city of the court
  image?: string; // /courts/<slug>.jpg — real building photo (Wikimedia Commons, CC BY-SA)
}

export const COURTS: Court[] = [
  { slug: "supreme-court-pakistan", nameEn: "Supreme Court of Pakistan", nameUr: "سپریم کورٹ آف پاکستان", citySlug: "islamabad", image: "/courts/supreme-court-pakistan.jpg" },
  { slug: "sindh-high-court", nameEn: "Sindh High Court", nameUr: "سندھ ہائی کورٹ", citySlug: "karachi", image: "/courts/sindh-high-court.jpg" },
  { slug: "lahore-high-court", nameEn: "Lahore High Court", nameUr: "لاہور ہائی کورٹ", citySlug: "lahore", image: "/courts/lahore-high-court.jpg" },
  { slug: "islamabad-high-court", nameEn: "Islamabad High Court", nameUr: "اسلام آباد ہائی کورٹ", citySlug: "islamabad" },
  { slug: "peshawar-high-court", nameEn: "Peshawar High Court", nameUr: "پشاور ہائی کورٹ", citySlug: "peshawar" },
  { slug: "balochistan-high-court", nameEn: "Balochistan High Court", nameUr: "بلوچستان ہائی کورٹ", citySlug: "quetta", image: "/courts/balochistan-high-court.jpg" },
  { slug: "city-courts-karachi", nameEn: "City Courts Karachi", nameUr: "سٹی کورٹس کراچی", citySlug: "karachi", image: "/courts/city-courts-karachi.jpg" },
];

export function getCourt(slug: string): Court | undefined {
  return COURTS.find((c) => c.slug === slug);
}

// ---------------- Demo lawyers ----------------

export const LAWYERS: Lawyer[] = [
  // ============ REAL LAWYERS — Karachi Legal House, Karachi ============
  // Real profiles cross-checked against karachilegalhouse.com and
  // shamslawchamber.com on 2026-09-23.
  // CONFIRMED from the sites: names, titles, education (where listed),
  // practice areas, firm address (DHA Phase 2, Karachi), office hours
  // (Mon-Sat 9 AM - 8 PM), Sindh Bar Council firm reg 663/BC.
  // STILL PLACEHOLDER (client must confirm): consultation fees, years of
  // experience (except founder: 24 yrs continuous practice since 2002),
  // individual bar council numbers. Do NOT treat as final without sign-off.
  {
    slug: "shamsuddin-rajper",
    photo: "/lawyers/shamsuddin-rajper.jpg",
    displayName: "Mr. Shamsuddin Rajper",
    headline: "Founder & Senior Advocate · Deputy Attorney General for Pakistan",
    bio: "Founder and Senior Advocate at Karachi Legal House, Karachi. M.Com, LL.B. Deputy Attorney General for Pakistan (Sindh High Court, Hyderabad Circuit Bench, 2023–present); former Assistant Prosecutor General of Sindh (2008) and former Vice President of the Sindh High Court Bar Association, Sukkur (2019–2020). 24+ years of courtroom practice since founding the chamber in 2002.",
    bioUrdu: "کراچی لیگل ہاؤس کے بانی اور سینئر ایڈووکیٹ۔ ایم کام، ایل ایل بی۔ ڈپٹی اٹارنی جنرل پاکستان (سندھ ہائی کورٹ، حیدرآباد سرکٹ بینچ)؛ سابق اسسٹنٹ پراسیکیوٹر جنرل سندھ اور سابق نائب صدر سندھ ہائی کورٹ بار ایسوسی ایشن سکھر۔ 2002 سے 24 سال سے زائد عدالتی تجربہ۔",
    gender: "male",
    citySlug: "karachi",
    yearsExperience: 24,
    consultationFeePaisa: 1500000,
    barCouncil: "Sindh Bar Council",
    barCouncilNo: "Available on request",
    courts: ["Sindh High Court", "Supreme Court of Pakistan"],
    practiceAreaSlugs: ["constitutional-law", "criminal-law"],
    langCodes: ["ur", "en", "sd"],
    chamberName: "Karachi Legal House",
    chamberAddress: "DHA Phase 2, Karachi",
    education: [
      { degree: "M.Com", institution: "", year: 0 },
      { degree: "LL.B", institution: "", year: 0 },
    ],
    services: [
      { nameEn: "Online Consultation (30 min)", nameUr: "آن لائن مشاورت", feePaisa: 1500000 },
      { nameEn: "Chamber Meeting (30 min)", nameUr: "چیمبر ملاقات", feePaisa: 1500000 },
    ],
    experience: [
      { title: "Founder & Senior Advocate", org: "Karachi Legal House, Karachi", status: "present" },
      { title: "Deputy Attorney General for Pakistan", org: "Sindh High Court, Hyderabad Circuit Bench", status: "present" },
      { title: "Assistant Prosecutor General, Sindh", org: "Government of Sindh", status: "former" },
      { title: "Vice President", org: "Sindh High Court Bar Association, Sukkur", status: "former" },
    ],
    rating: 5.0,
    reviewCount: 0,
    totalConsultations: 0,
    isDemo: false,
    reviews: [],
  },
  {
    slug: "fayazuddin-rajper",
    photo: "/lawyers/fayazuddin-rajper.jpg",
    displayName: "Mr. Fayazuddin Rajper",
    headline: "Managing Partner & Advocate High Court · Corporate Advisory Lead",
    bio: "Managing Partner and Advocate of the High Court at Karachi Legal House. The founder's elder son, he took charge of the chamber's affairs in 2016 and built its diversified litigation and advisory practice from the Karachi office.",
    bioUrdu: "کراچی لیگل ہاؤس میں مینیجنگ پارٹنر اور ایڈووکیٹ ہائی کورٹ۔ بانی کے بڑے صاحبزادے — 2016 سے چیمبر کے امور سنبھالے ہوئے ہیں اور کراچی آفس سے لٹیگیشن و ایڈوائزری پریکٹس کو وسعت دی۔",
    gender: "male",
    citySlug: "karachi",
    yearsExperience: 12,
    consultationFeePaisa: 800000,
    barCouncil: "Sindh Bar Council",
    barCouncilNo: "Available on request",
    courts: ["Sindh High Court", "District Courts Karachi"],
    practiceAreaSlugs: ["corporate-law", "tax-law"],
    langCodes: ["ur", "en"],
    chamberName: "Karachi Legal House",
    chamberAddress: "DHA Phase 2, Karachi",
    education: [{ degree: "LL.M. in Corporate Law", institution: "", year: 0 }],
    services: [
      { nameEn: "Online Consultation (30 min)", nameUr: "آن لائن مشاورت", feePaisa: 800000 },
      { nameEn: "Chamber Meeting (30 min)", nameUr: "چیمبر ملاقات", feePaisa: 800000 },
    ],
    experience: [
      { title: "Managing Partner — Corporate Advisory Lead", org: "Karachi Legal House, Karachi", status: "present" },
      { title: "Took charge of chamber affairs", org: "Shams Law Chamber, Karachi", status: "former" },
    ],
    rating: 5.0,
    reviewCount: 0,
    totalConsultations: 0,
    isDemo: false,
    reviews: [],
  },
  {
    slug: "jahangir-shams",
    photo: "/lawyers/jahangir-shams.jpg",
    displayName: "Mr. Jahangir Shams",
    headline: "Managing Partner & Advocate High Court · Head of Karachi Office",
    bio: "Managing Partner and Advocate of the High Court at Karachi Legal House. He joined the chamber's leadership in 2016 alongside his brother, building the firm's litigation and advisory practice from the Karachi head office.",
    bioUrdu: "کراچی لیگل ہاؤس میں مینیجنگ پارٹنر اور ایڈووکیٹ ہائی کورٹ۔ 2016 میں اپنے بھائی کے ہمراہ چیمبر کی قیادت میں شامل ہوئے اور کراچی ہیڈ آفس سے فرم کی پریکٹس کو آگے بڑھایا۔",
    gender: "male",
    citySlug: "karachi",
    yearsExperience: 14,
    consultationFeePaisa: 800000,
    barCouncil: "Sindh Bar Council",
    barCouncilNo: "Available on request",
    courts: ["Sindh High Court", "City Courts Karachi"],
    practiceAreaSlugs: ["corporate-law", "property-law"],
    langCodes: ["ur", "en"],
    chamberName: "Karachi Legal House",
    chamberAddress: "DHA Phase 2, Karachi",
    education: [{ degree: "LL.B. (Hons)", institution: "", year: 0 }],
    services: [
      { nameEn: "Online Consultation (30 min)", nameUr: "آن لائن مشاورت", feePaisa: 800000 },
      { nameEn: "Chamber Meeting (30 min)", nameUr: "چیمبر ملاقات", feePaisa: 800000 },
    ],
    experience: [
      { title: "Managing Partner — Head of Karachi Office", org: "Karachi Legal House, Karachi", status: "present" },
      { title: "Joined chamber leadership", org: "Shams Law Chamber, Karachi", status: "former" },
    ],
    rating: 5.0,
    reviewCount: 0,
    totalConsultations: 0,
    isDemo: false,
    reviews: [],
  },
  {
    slug: "raheem-dad-shujrah",
    photo: "/lawyers/raheem-dad-shujrah.jpg",
    displayName: "Mr. Raheem Dad Shujrah",
    headline: "Senior Associate & Advocate High Court · Corporate & Banking Law",
    bio: "Senior Associate and Advocate of the High Courts of Pakistan at Shams Law Chamber / Karachi Legal House. Joined the chamber in 2024 with a BBA and an LL.B (Hons.) from the University of London, bridging corporate insight with courtroom proficiency across civil, corporate, banking and constitutional litigation.",
    bioUrdu: "شمس لا چیمبر / کراچی لیگل ہاؤس میں سینئر ایسوسی ایٹ اور ایڈووکیٹ ہائی کورٹ۔ 2024 میں چیمبر میں شامل ہوئے — بی بی اے اور یونیورسٹی آف لندن سے ایل ایل بی (آنرز)، سول، کارپوریٹ، بینکاری اور آئینی مقدمات میں مہارت۔",
    gender: "male",
    citySlug: "karachi",
    yearsExperience: 10,
    consultationFeePaisa: 600000,
    barCouncil: "Sindh Bar Council",
    barCouncilNo: "Available on request",
    courts: ["Sindh High Court", "City Courts Karachi"],
    practiceAreaSlugs: ["corporate-law", "banking-finance"],
    langCodes: ["ur", "en", "sd"],
    chamberName: "Karachi Legal House",
    chamberAddress: "DHA Phase 2, Karachi",
    education: [
      { degree: "BBA", institution: "", year: 0 },
      { degree: "LL.B. (Hons.), University of London", institution: "University of London", year: 0 },
    ],
    services: [
      { nameEn: "Online Consultation (30 min)", nameUr: "آن لائن مشاورت", feePaisa: 600000 },
      { nameEn: "Chamber Meeting (30 min)", nameUr: "چیمبر ملاقات", feePaisa: 600000 },
    ],
    experience: [
      { title: "Senior Associate", org: "Shams Law Chamber / Karachi Legal House, Karachi", status: "present" },
    ],
    rating: 5.0,
    reviewCount: 0,
    totalConsultations: 0,
    isDemo: false,
    reviews: [],
  },
  {
    slug: "ahmed-raza-demo",
    photo: "/lawyers/ahmed-raza-demo.jpg",
    displayName: "Ahmed Raza (Demo)",
    headline: "Family & property disputes · Lahore High Court",
    bio: "Demo profile for development only. Ahmed handles divorce, khula, custody and property title disputes in Lahore, with 12 years of practice before the Lahore High Court and district courts.",
    bioUrdu: "ڈیمو پروفائل — صرف ڈویلپمنٹ کے لیے۔",
    gender: "male",
    citySlug: "lahore",
    yearsExperience: 12,
    consultationFeePaisa: 300000,
    barCouncil: "Punjab Bar Council",
    barCouncilNo: "PBC-DEMO-001",
    courts: ["Lahore High Court", "District Courts Lahore"],
    practiceAreaSlugs: ["family-law", "property-law"],
    langCodes: ["ur", "en", "pa"],
    chamberName: "Raza Law Chamber",
    chamberAddress: "14-D, Davis Road, Lahore",
    education: [
      { degree: "LLB (Hons)", institution: "Punjab University Law College", year: 2012 },
      { degree: "LLM", institution: "Demo University", year: 2014 },
    ],
    services: [
      { nameEn: "Online Consultation (30 min)", nameUr: "آن لائن مشاورت", feePaisa: 300000 },
      { nameEn: "Chamber Meeting (30 min)", nameUr: "چیمبر ملاقات", feePaisa: 300000 },
      { nameEn: "Document Review", nameUr: "دستاویز کی جانچ", feePaisa: 500000 },
      { nameEn: "Court Appearance (per hearing)", nameUr: "عدالت میں پیشی", feePaisa: 1500000 },
    ],
    rating: 4.8,
    reviewCount: 124,
    totalConsultations: 860,
    isDemo: true,
    reviews: [
      { id: "r1", clientName: "Bilal S.", rating: 5, comment: "Bohat achay tareeqay se mera khula ka case handle kiya. Har baat samjhai.", date: "2026-08-14", verified: true },
      { id: "r2", clientName: "Nasreen A.", rating: 5, comment: "Property dispute resolved in 3 months. Very professional.", date: "2026-07-02", verified: true },
      { id: "r3", clientName: "Tariq M.", rating: 4, comment: "Fee thori zyada lagi lekin kaam solid hua.", date: "2026-05-20", verified: true },
    ],
  },
  {
    slug: "fatima-khan-demo",
    photo: "/lawyers/fatima-khan-demo.jpg",
    displayName: "Fatima Khan (Demo)",
    headline: "Criminal defence & cybercrime · Karachi",
    bio: "Demo profile for development only. Fatima specialises in bail matters, criminal trials and PECA cybercrime cases, practising before the Sindh High Court and city courts.",
    bioUrdu: "ڈیمو پروفائل — صرف ڈویلپمنٹ کے لیے۔",
    gender: "female",
    citySlug: "karachi",
    yearsExperience: 8,
    consultationFeePaisa: 250000,
    barCouncil: "Sindh Bar Council",
    barCouncilNo: "SBC-DEMO-002",
    courts: ["Sindh High Court", "City Courts Karachi"],
    practiceAreaSlugs: ["criminal-law", "cybercrime-law"],
    langCodes: ["ur", "en", "sd"],
    chamberName: "Khan Legal Associates",
    chamberAddress: "Office 301, Clifton Centre, Karachi",
    education: [{ degree: "LLB", institution: "S.M. Law College, Karachi", year: 2016 }],
    services: [
      { nameEn: "Online Consultation (30 min)", nameUr: "آن لائن مشاورت", feePaisa: 250000 },
      { nameEn: "Chamber Meeting (30 min)", nameUr: "چیمبر ملاقات", feePaisa: 250000 },
      { nameEn: "Bail Application", nameUr: "ضمانت کی درخواست", feePaisa: 2000000 },
    ],
    rating: 4.9,
    reviewCount: 98,
    totalConsultations: 540,
    isDemo: true,
    reviews: [
      { id: "r4", clientName: "Danish R.", rating: 5, comment: "Bail mil gayi pehli hearing par. Allah unko khush rakhe.", date: "2026-08-30", verified: true },
      { id: "r5", clientName: "Sadia K.", rating: 5, comment: "Cyber harassment case handled with care and confidentiality.", date: "2026-06-11", verified: true },
    ],
  },
  {
    slug: "muhammad-bilal-demo",
    photo: "/lawyers/muhammad-bilal-demo.jpg",
    displayName: "Muhammad Bilal (Demo)",
    headline: "Corporate & tax advisory · Islamabad",
    bio: "Demo profile for development only. Bilal advises companies on formation, contracts, FBR matters and tax tribunal appeals, appearing before the Islamabad High Court and the Supreme Court.",
    bioUrdu: "ڈیمو پروفائل — صرف ڈویلپمنٹ کے لیے۔",
    gender: "male",
    citySlug: "islamabad",
    yearsExperience: 15,
    consultationFeePaisa: 500000,
    barCouncil: "Islamabad Bar Council",
    barCouncilNo: "IBC-DEMO-003",
    courts: ["Islamabad High Court", "Supreme Court of Pakistan"],
    practiceAreaSlugs: ["corporate-law", "tax-law"],
    langCodes: ["ur", "en"],
    chamberName: "Bilal & Partners",
    chamberAddress: "Suite 12, Blue Area, Islamabad",
    education: [
      { degree: "LLB", institution: "International Islamic University, Islamabad", year: 2009 },
      { degree: "LLM (Corporate)", institution: "Demo University", year: 2011 },
    ],
    services: [
      { nameEn: "Online Consultation (30 min)", nameUr: "آن لائن مشاورت", feePaisa: 500000 },
      { nameEn: "Company Registration", nameUr: "کمپنی رجسٹریشن", feePaisa: 7500000 },
      { nameEn: "FBR Notice Reply", nameUr: "ایف بی آر نوٹس کا جواب", feePaisa: 3000000 },
    ],
    rating: 4.7,
    reviewCount: 76,
    totalConsultations: 430,
    isDemo: true,
    reviews: [
      { id: "r6", clientName: "Kamran J.", rating: 5, comment: "Company registration done in 10 days, zero hassle.", date: "2026-07-25", verified: true },
      { id: "r7", clientName: "Farah N.", rating: 4, comment: "Knowledgeable, slightly busy but worth the wait.", date: "2026-04-18", verified: true },
    ],
  },
  {
    slug: "ayesha-malik-demo",
    photo: "/lawyers/ayesha-malik-demo.jpg",
    displayName: "Ayesha Malik (Demo)",
    headline: "Immigration & labour matters · Rawalpindi",
    bio: "Demo profile for development only. Ayesha helps with visa refusals, deportation defence and wrongful termination claims.",
    bioUrdu: "ڈیمو پروفائل — صرف ڈویلپمنٹ کے لیے۔",
    gender: "female",
    citySlug: "rawalpindi",
    yearsExperience: 6,
    consultationFeePaisa: 200000,
    barCouncil: "Punjab Bar Council",
    barCouncilNo: "PBC-DEMO-004",
    courts: ["Lahore High Court (Rawalpindi Bench)", "District Courts Rawalpindi"],
    practiceAreaSlugs: ["immigration-law", "labour-law"],
    langCodes: ["ur", "en", "pa"],
    chamberName: "Malik Law Office",
    chamberAddress: "House 7, Satellite Town, Rawalpindi",
    education: [{ degree: "LLB", institution: "Rawalpindi Law College", year: 2018 }],
    services: [
      { nameEn: "Online Consultation (30 min)", nameUr: "آن لائن مشاورت", feePaisa: 200000 },
      { nameEn: "Visa Refusal Review", nameUr: "ویزا انکار کا جائزہ", feePaisa: 1500000 },
    ],
    rating: 4.8,
    reviewCount: 64,
    totalConsultations: 310,
    isDemo: true,
    reviews: [
      { id: "r8", clientName: "Naveed H.", rating: 5, comment: "Visa refusal ka case dobara file kiya, visa lag gaya.", date: "2026-08-05", verified: true },
    ],
  },
  {
    slug: "usman-tariq-demo",
    photo: "/lawyers/usman-tariq-demo.jpg",
    displayName: "Usman Tariq (Demo)",
    headline: "Property & consumer disputes · Faisalabad",
    bio: "Demo profile for development only. Usman deals with registry disputes, possession suits and consumer court claims in Faisalabad.",
    bioUrdu: "ڈیمو پروفائل — صرف ڈویلپمنٹ کے لیے۔",
    gender: "male",
    citySlug: "faisalabad",
    yearsExperience: 10,
    consultationFeePaisa: 150000,
    barCouncil: "Punjab Bar Council",
    barCouncilNo: "PBC-DEMO-005",
    courts: ["District Courts Faisalabad"],
    practiceAreaSlugs: ["property-law", "consumer-law"],
    langCodes: ["ur", "pa"],
    chamberName: "Tariq Law Chamber",
    chamberAddress: "Karkhana Bazaar, Faisalabad",
    education: [{ degree: "LLB", institution: "Punjab University Law College", year: 2014 }],
    services: [
      { nameEn: "Online Consultation (30 min)", nameUr: "آن لائن مشاورت", feePaisa: 150000 },
      { nameEn: "Chamber Meeting (30 min)", nameUr: "چیمبر ملاقات", feePaisa: 150000 },
    ],
    rating: 4.6,
    reviewCount: 52,
    totalConsultations: 390,
    isDemo: true,
    reviews: [
      { id: "r9", clientName: "Aslam P.", rating: 5, comment: "Registry ka masla hal ho gaya. Shukriya.", date: "2026-06-28", verified: true },
    ],
  },
  {
    slug: "sana-sheikh-demo",
    photo: "/lawyers/sana-sheikh-demo.jpg",
    displayName: "Sana Sheikh (Demo)",
    headline: "Family & labour matters · Multan",
    bio: "Demo profile for development only. Sana focuses on maintenance, custody and workplace disputes for clients across South Punjab.",
    bioUrdu: "ڈیمو پروفائل — صرف ڈویلپمنٹ کے لیے۔",
    gender: "female",
    citySlug: "multan",
    yearsExperience: 7,
    consultationFeePaisa: 180000,
    barCouncil: "Punjab Bar Council",
    barCouncilNo: "PBC-DEMO-006",
    courts: ["District Courts Multan"],
    practiceAreaSlugs: ["family-law", "labour-law"],
    langCodes: ["ur", "en"],
    chamberName: "Sheikh Legal Clinic",
    chamberAddress: "Gulgasht Colony, Multan",
    education: [{ degree: "LLB", institution: "Bahauddin Zakariya University, Multan", year: 2017 }],
    services: [
      { nameEn: "Online Consultation (30 min)", nameUr: "آن لائن مشاورت", feePaisa: 180000 },
      { nameEn: "Chamber Meeting (30 min)", nameUr: "چیمبر ملاقات", feePaisa: 180000 },
    ],
    rating: 4.9,
    reviewCount: 71,
    totalConsultations: 350,
    isDemo: true,
    reviews: [
      { id: "r10", clientName: "Robina S.", rating: 5, comment: "Maintenance case me bohat madad ki. Bohat shukriya.", date: "2026-07-19", verified: true },
    ],
  },
  {
    slug: "imran-yousaf-demo",
    photo: "/lawyers/imran-yousaf-demo.jpg",
    displayName: "Imran Yousaf (Demo)",
    headline: "Criminal & constitutional law · Peshawar",
    bio: "Demo profile for development only. Imran has 18 years before the Peshawar High Court in criminal trials, appeals and writ petitions.",
    bioUrdu: "ڈیمو پروفائل — صرف ڈویلپمنٹ کے لیے۔",
    gender: "male",
    citySlug: "peshawar",
    yearsExperience: 18,
    consultationFeePaisa: 400000,
    barCouncil: "Khyber Pakhtunkhwa Bar Council",
    barCouncilNo: "KPB-DEMO-007",
    courts: ["Peshawar High Court", "District Courts Peshawar"],
    practiceAreaSlugs: ["criminal-law", "constitutional-law"],
    langCodes: ["ur", "en", "ps"],
    chamberName: "Yousaf Law Associates",
    chamberAddress: "Khyber Bazaar, Peshawar",
    education: [{ degree: "LLB", institution: "University of Peshawar", year: 2006 }],
    services: [
      { nameEn: "Online Consultation (30 min)", nameUr: "آن لائن مشاورت", feePaisa: 400000 },
      { nameEn: "Writ Petition Drafting", nameUr: "رٹ پٹیشن", feePaisa: 5000000 },
    ],
    rating: 4.7,
    reviewCount: 88,
    totalConsultations: 720,
    isDemo: true,
    reviews: [
      { id: "r11", clientName: "Fazal R.", rating: 5, comment: "Senior wakeel hain, case ki gehrai samajhte hain.", date: "2026-05-30", verified: true },
    ],
  },
  {
    slug: "hina-aslam-demo",
    photo: "/lawyers/hina-aslam-demo.jpg",
    displayName: "Hina Aslam (Demo)",
    headline: "Family & consumer matters · Hyderabad",
    bio: "Demo profile for development only. Hina serves clients in Hyderabad on family disputes and consumer claims, in Urdu, Sindhi and English.",
    bioUrdu: "ڈیمو پروفائل — صرف ڈویلپمنٹ کے لیے۔",
    gender: "female",
    citySlug: "hyderabad",
    yearsExperience: 5,
    consultationFeePaisa: 120000,
    barCouncil: "Sindh Bar Council",
    barCouncilNo: "SBC-DEMO-008",
    courts: ["District Courts Hyderabad"],
    practiceAreaSlugs: ["family-law", "consumer-law"],
    langCodes: ["ur", "sd", "en"],
    chamberName: "Aslam Law Office",
    chamberAddress: "Latifabad, Hyderabad",
    education: [{ degree: "LLB", institution: "University of Sindh, Jamshoro", year: 2019 }],
    services: [
      { nameEn: "Online Consultation (30 min)", nameUr: "آن لائن مشاورت", feePaisa: 120000 },
      { nameEn: "Chamber Meeting (30 min)", nameUr: "چیمبر ملاقات", feePaisa: 120000 },
    ],
    rating: 4.8,
    reviewCount: 43,
    totalConsultations: 210,
    isDemo: true,
    reviews: [
      { id: "r12", clientName: "Mehwish J.", rating: 5, comment: "Bohat hi achi guidance mili. Highly recommended.", date: "2026-08-22", verified: true },
    ],
  },
  // ---------------- 22 new demo lawyers (content expansion) ----------------
  {
    slug: "sara-ahmed-demo",
    photo: "/lawyers/sara-ahmed-demo.jpg",
    displayName: "Sara Ahmed (Demo)",
    headline: "Family & property matters · Sindh High Court, Karachi",
    bio: "Demo profile for development only. Sara handles khula, custody and property cases before the Sindh High Court, known for clear and patient guidance.",
    bioUrdu: "ڈیمو پروفائل — صرف ڈویلپمنٹ کے لیے۔",
    gender: "female",
    citySlug: "karachi",
    yearsExperience: 9,
    consultationFeePaisa: 280000,
    barCouncil: "Sindh Bar Council",
    barCouncilNo: "SBC-DEMO-009",
    courts: ["Sindh High Court", "City Courts Karachi"],
    practiceAreaSlugs: ["family-law", "property-law"],
    langCodes: ["ur", "en", "sd"],
    chamberName: "Ahmed Law Chamber",
    chamberAddress: "DHA Phase 5, Karachi",
    education: [{ degree: "LLB", institution: "S.M. Law College, Karachi", year: 2015 }],
    services: [
      { nameEn: "Online Consultation (30 min)", nameUr: "آن لائن مشاورت", feePaisa: 280000 },
      { nameEn: "Chamber Meeting (30 min)", nameUr: "چیمبر ملاقات", feePaisa: 280000 },
      { nameEn: "Khula Case Filing", nameUr: "خلع کا کیس", feePaisa: 2500000 },
    ],
    rating: 4.8,
    reviewCount: 112,
    totalConsultations: 480,
    isDemo: true,
    reviews: [
      { id: "r13", clientName: "Hina T.", rating: 5, comment: "Khula ka case bohat araam se handle kiya. Har step samjhaya.", date: "2026-08-19", verified: true },
      { id: "r14", clientName: "Adnan K.", rating: 4, comment: "Property matter resolved professionally.", date: "2026-06-03", verified: true },
    ],
  },
  {
    slug: "danish-ali-demo",
    photo: "/lawyers/danish-ali-demo.jpg",
    displayName: "Danish Ali (Demo)",
    headline: "Criminal defence & bail · Sindh High Court, Karachi",
    bio: "Demo profile for development only. Danish practises criminal defence and bail matters before the Sindh High Court and city courts of Karachi.",
    bioUrdu: "ڈیمو پروفائل — صرف ڈویلپمنٹ کے لیے۔",
    gender: "male",
    citySlug: "karachi",
    yearsExperience: 11,
    consultationFeePaisa: 350000,
    barCouncil: "Sindh Bar Council",
    barCouncilNo: "SBC-DEMO-010",
    courts: ["Sindh High Court", "City Courts Karachi"],
    practiceAreaSlugs: ["criminal-law"],
    langCodes: ["ur", "en"],
    chamberName: "Ali & Associates",
    chamberAddress: "Shahrah-e-Faisal, Karachi",
    education: [{ degree: "LLB", institution: "S.M. Law College, Karachi", year: 2013 }],
    services: [
      { nameEn: "Online Consultation (30 min)", nameUr: "آن لائن مشاورت", feePaisa: 350000 },
      { nameEn: "Chamber Meeting (30 min)", nameUr: "چیمبر ملاقات", feePaisa: 350000 },
      { nameEn: "Bail Application", nameUr: "ضمانت کی درخواست", feePaisa: 2500000 },
    ],
    rating: 4.7,
    reviewCount: 95,
    totalConsultations: 610,
    isDemo: true,
    reviews: [
      { id: "r15", clientName: "Rashid M.", rating: 5, comment: "Bail application strong thi, pehli hearing me kaam ho gaya.", date: "2026-07-28", verified: true },
    ],
  },
  {
    slug: "mariam-siddiqui-demo",
    photo: "/lawyers/mariam-siddiqui-demo.jpg",
    displayName: "Mariam Siddiqui (Demo)",
    headline: "Corporate & tax advisory · Sindh High Court, Karachi",
    bio: "Demo profile for development only. Mariam advises businesses on company law, contracts and FBR tax matters in Karachi.",
    bioUrdu: "ڈیمو پروفائل — صرف ڈویلپمنٹ کے لیے۔",
    gender: "female",
    citySlug: "karachi",
    yearsExperience: 14,
    consultationFeePaisa: 600000,
    barCouncil: "Sindh Bar Council",
    barCouncilNo: "SBC-DEMO-011",
    courts: ["Sindh High Court"],
    practiceAreaSlugs: ["corporate-law", "tax-law"],
    langCodes: ["ur", "en"],
    chamberName: "Siddiqui Corporate Law",
    chamberAddress: "Clifton Block 4, Karachi",
    education: [
      { degree: "LLB", institution: "University of Karachi", year: 2010 },
      { degree: "LLM (Corporate)", institution: "Demo University", year: 2012 },
    ],
    services: [
      { nameEn: "Online Consultation (30 min)", nameUr: "آن لائن مشاورت", feePaisa: 600000 },
      { nameEn: "Company Registration", nameUr: "کمپنی رجسٹریشن", feePaisa: 8000000 },
      { nameEn: "FBR Notice Reply", nameUr: "ایف بی آر نوٹس کا جواب", feePaisa: 3500000 },
    ],
    rating: 4.9,
    reviewCount: 83,
    totalConsultations: 390,
    isDemo: true,
    reviews: [
      { id: "r16", clientName: "Salman V.", rating: 5, comment: "FBR notice ka jawab itna strong tha ke case wahin khatam.", date: "2026-08-08", verified: true },
    ],
  },
  {
    slug: "kamran-shah-demo",
    photo: "/lawyers/kamran-shah-demo.jpg",
    displayName: "Kamran Shah (Demo)",
    headline: "Property title & possession · Sindh High Court, Karachi",
    bio: "Demo profile for development only. Kamran has 16 years in property title disputes, possession suits and registry matters in Karachi.",
    bioUrdu: "ڈیمو پروفائل — صرف ڈویلپمنٹ کے لیے۔",
    gender: "male",
    citySlug: "karachi",
    yearsExperience: 16,
    consultationFeePaisa: 450000,
    barCouncil: "Sindh Bar Council",
    barCouncilNo: "SBC-DEMO-012",
    courts: ["Sindh High Court", "City Courts Karachi"],
    practiceAreaSlugs: ["property-law"],
    langCodes: ["ur", "en", "sd"],
    chamberName: "Shah Property Law Chamber",
    chamberAddress: "Gulshan-e-Iqbal, Karachi",
    education: [{ degree: "LLB", institution: "S.M. Law College, Karachi", year: 2008 }],
    services: [
      { nameEn: "Online Consultation (30 min)", nameUr: "آن لائن مشاورت", feePaisa: 450000 },
      { nameEn: "Chamber Meeting (30 min)", nameUr: "چیمبر ملاقات", feePaisa: 450000 },
      { nameEn: "Title Verification", nameUr: "ملکیت کی تصدیق", feePaisa: 2000000 },
    ],
    rating: 4.8,
    reviewCount: 131,
    totalConsultations: 740,
    isDemo: true,
    reviews: [
      { id: "r17", clientName: "Nadeem A.", rating: 5, comment: "Plot ka qabza wapas dilwaya. Bohat tajurbakar wakeel.", date: "2026-07-15", verified: true },
      { id: "r18", clientName: "Farida S.", rating: 4, comment: "Registry dispute handled well.", date: "2026-05-09", verified: true },
    ],
  },
  {
    slug: "nadia-hussain-demo",
    photo: "/lawyers/nadia-hussain-demo.jpg",
    displayName: "Nadia Hussain (Demo)",
    headline: "Family & cybercrime cases · Sindh High Court, Karachi",
    bio: "Demo profile for development only. Nadia helps families with custody and maintenance, and victims of online harassment with PECA complaints.",
    bioUrdu: "ڈیمو پروفائل — صرف ڈویلپمنٹ کے لیے۔",
    gender: "female",
    citySlug: "karachi",
    yearsExperience: 7,
    consultationFeePaisa: 220000,
    barCouncil: "Sindh Bar Council",
    barCouncilNo: "SBC-DEMO-013",
    courts: ["Sindh High Court"],
    practiceAreaSlugs: ["family-law", "cybercrime-law"],
    langCodes: ["ur", "en"],
    chamberName: "Hussain Legal Aid",
    chamberAddress: "North Nazimabad, Karachi",
    education: [{ degree: "LLB", institution: "University of Karachi", year: 2017 }],
    services: [
      { nameEn: "Online Consultation (30 min)", nameUr: "آن لائن مشاورت", feePaisa: 220000 },
      { nameEn: "Chamber Meeting (30 min)", nameUr: "چیمبر ملاقات", feePaisa: 220000 },
      { nameEn: "Cyber Harassment Complaint", nameUr: "سائبر ہراسانی کی شکایت", feePaisa: 1500000 },
    ],
    rating: 4.9,
    reviewCount: 67,
    totalConsultations: 290,
    isDemo: true,
    reviews: [
      { id: "r19", clientName: "Areeba F.", rating: 5, comment: "Online harassment case me bohat himmat di aur case jeeta.", date: "2026-08-25", verified: true },
    ],
  },
  {
    slug: "faisal-memon-demo",
    photo: "/lawyers/faisal-memon-demo.jpg",
    displayName: "Faisal Memon (Demo)",
    headline: "Banking & corporate disputes · Sindh High Court, Karachi",
    bio: "Demo profile for development only. Faisal represents clients in banking court cases, loan settlements and corporate disputes.",
    bioUrdu: "ڈیمو پروفائل — صرف ڈویلپمنٹ کے لیے۔",
    gender: "male",
    citySlug: "karachi",
    yearsExperience: 10,
    consultationFeePaisa: 500000,
    barCouncil: "Sindh Bar Council",
    barCouncilNo: "SBC-DEMO-014",
    courts: ["Sindh High Court", "Banking Courts Karachi"],
    practiceAreaSlugs: ["banking-finance", "corporate-law"],
    langCodes: ["ur", "en"],
    chamberName: "Memon Financial Law",
    chamberAddress: "PECHS Block 6, Karachi",
    education: [{ degree: "LLB", institution: "S.M. Law College, Karachi", year: 2014 }],
    services: [
      { nameEn: "Online Consultation (30 min)", nameUr: "آن لائن مشاورت", feePaisa: 500000 },
      { nameEn: "Chamber Meeting (30 min)", nameUr: "چیمبر ملاقات", feePaisa: 500000 },
      { nameEn: "Loan Settlement Negotiation", nameUr: "قرض تصفیہ", feePaisa: 4000000 },
    ],
    rating: 4.6,
    reviewCount: 58,
    totalConsultations: 320,
    isDemo: true,
    reviews: [
      { id: "r20", clientName: "Javed I.", rating: 5, comment: "Bank loan case me behtareen settlement karwayi.", date: "2026-06-20", verified: true },
    ],
  },
  {
    slug: "rabia-farooq-demo",
    photo: "/lawyers/rabia-farooq-demo.jpg",
    displayName: "Rabia Farooq (Demo)",
    headline: "Constitutional & writ petitions · Sindh High Court, Karachi",
    bio: "Demo profile for development only. Rabia is a senior advocate with 20 years in constitutional matters and writ petitions, appearing up to the Supreme Court.",
    bioUrdu: "ڈیمو پروفائل — صرف ڈویلپمنٹ کے لیے۔",
    gender: "female",
    citySlug: "karachi",
    yearsExperience: 20,
    consultationFeePaisa: 700000,
    barCouncil: "Sindh Bar Council",
    barCouncilNo: "SBC-DEMO-015",
    courts: ["Sindh High Court", "Supreme Court of Pakistan"],
    practiceAreaSlugs: ["constitutional-law", "criminal-law"],
    langCodes: ["ur", "en"],
    chamberName: "Farooq & Co.",
    chamberAddress: "Bath Island, Karachi",
    education: [
      { degree: "LLB", institution: "University of Karachi", year: 2004 },
      { degree: "LLM", institution: "Demo University", year: 2006 },
    ],
    services: [
      { nameEn: "Online Consultation (30 min)", nameUr: "آن لائن مشاورت", feePaisa: 700000 },
      { nameEn: "Chamber Meeting (30 min)", nameUr: "چیمبر ملاقات", feePaisa: 700000 },
      { nameEn: "Writ Petition Drafting", nameUr: "رٹ پٹیشن", feePaisa: 6000000 },
    ],
    rating: 4.9,
    reviewCount: 142,
    totalConsultations: 890,
    isDemo: true,
    reviews: [
      { id: "r21", clientName: "Hamza R.", rating: 5, comment: "Senior aur qabil wakeel. Writ petition kamyab rahi.", date: "2026-08-11", verified: true },
      { id: "r22", clientName: "Sanaullah B.", rating: 5, comment: "20 saal ka tajurba nazar aata hai.", date: "2026-04-22", verified: true },
    ],
  },
  {
    slug: "asad-mehmood-demo",
    photo: "/lawyers/asad-mehmood-demo.jpg",
    displayName: "Asad Mehmood (Demo)",
    headline: "Labour & consumer rights · Sindh High Court, Karachi",
    bio: "Demo profile for development only. Asad fights wrongful termination and unpaid wage cases for workers across Karachi's industrial areas.",
    bioUrdu: "ڈیمو پروفائل — صرف ڈویلپمنٹ کے لیے۔",
    gender: "male",
    citySlug: "karachi",
    yearsExperience: 9,
    consultationFeePaisa: 200000,
    barCouncil: "Sindh Bar Council",
    barCouncilNo: "SBC-DEMO-016",
    courts: ["Sindh High Court", "City Courts Karachi"],
    practiceAreaSlugs: ["labour-law", "consumer-law"],
    langCodes: ["ur", "en", "sd"],
    chamberName: "Mehmood Labour Law Office",
    chamberAddress: "Korangi Industrial Area, Karachi",
    education: [{ degree: "LLB", institution: "Federal Urdu University, Karachi", year: 2015 }],
    services: [
      { nameEn: "Online Consultation (30 min)", nameUr: "آن لائن مشاورت", feePaisa: 200000 },
      { nameEn: "Chamber Meeting (30 min)", nameUr: "چیمبر ملاقات", feePaisa: 200000 },
      { nameEn: "Wrongful Termination Claim", nameUr: "ناجائز برطرفی کا دعویٰ", feePaisa: 1800000 },
    ],
    rating: 4.7,
    reviewCount: 74,
    totalConsultations: 410,
    isDemo: true,
    reviews: [
      { id: "r23", clientName: "Irfan Q.", rating: 5, comment: "Naukri se nikalne ka case jeeta, wajbat bhi dilwaye.", date: "2026-07-06", verified: true },
    ],
  },
  {
    slug: "shabana-alam-demo",
    photo: "/lawyers/shabana-alam-demo.jpg",
    displayName: "Shabana Alam (Demo)",
    headline: "Family disputes & maintenance · Sindh High Court, Karachi",
    bio: "Demo profile for development only. Shabana specialises in maintenance, dowry and family settlement matters for women in Karachi.",
    bioUrdu: "ڈیمو پروفائل — صرف ڈویلپمنٹ کے لیے۔",
    gender: "female",
    citySlug: "karachi",
    yearsExperience: 12,
    consultationFeePaisa: 300000,
    barCouncil: "Sindh Bar Council",
    barCouncilNo: "SBC-DEMO-017",
    courts: ["Sindh High Court", "City Courts Karachi"],
    practiceAreaSlugs: ["family-law"],
    langCodes: ["ur", "en", "sd"],
    chamberName: "Alam Family Law Clinic",
    chamberAddress: "Malir Halt, Karachi",
    education: [{ degree: "LLB", institution: "University of Karachi", year: 2012 }],
    services: [
      { nameEn: "Online Consultation (30 min)", nameUr: "آن لائن مشاورت", feePaisa: 300000 },
      { nameEn: "Chamber Meeting (30 min)", nameUr: "چیمبر ملاقات", feePaisa: 300000 },
      { nameEn: "Maintenance Case", nameUr: "نان نفقہ کا کیس", feePaisa: 2500000 },
    ],
    rating: 4.8,
    reviewCount: 105,
    totalConsultations: 520,
    isDemo: true,
    reviews: [
      { id: "r24", clientName: "Shazia P.", rating: 5, comment: "Maintenance case me poora saath diya. Bohat shukriya.", date: "2026-08-02", verified: true },
    ],
  },
  {
    slug: "tariq-aziz-demo",
    photo: "/lawyers/tariq-aziz-demo.jpg",
    displayName: "Tariq Aziz (Demo)",
    headline: "Criminal trials & appeals · Lahore High Court",
    bio: "Demo profile for development only. Tariq is a veteran criminal lawyer with 19 years of trials and appeals before the Lahore High Court.",
    bioUrdu: "ڈیمو پروفائل — صرف ڈویلپمنٹ کے لیے۔",
    gender: "male",
    citySlug: "lahore",
    yearsExperience: 19,
    consultationFeePaisa: 500000,
    barCouncil: "Punjab Bar Council",
    barCouncilNo: "PBC-DEMO-018",
    courts: ["Lahore High Court", "District Courts Lahore"],
    practiceAreaSlugs: ["criminal-law"],
    langCodes: ["ur", "en", "pa"],
    chamberName: "Aziz Criminal Defence",
    chamberAddress: "Mozang Road, Lahore",
    education: [{ degree: "LLB", institution: "Punjab University Law College", year: 2005 }],
    services: [
      { nameEn: "Online Consultation (30 min)", nameUr: "آن لائن مشاورت", feePaisa: 500000 },
      { nameEn: "Chamber Meeting (30 min)", nameUr: "چیمبر ملاقات", feePaisa: 500000 },
      { nameEn: "Bail Application", nameUr: "ضمانت کی درخواست", feePaisa: 3000000 },
    ],
    rating: 4.8,
    reviewCount: 137,
    totalConsultations: 810,
    isDemo: true,
    reviews: [
      { id: "r25", clientName: "Munir S.", rating: 5, comment: "Trial ka tajurba kamaal ka. Case dismiss ho gaya.", date: "2026-07-22", verified: true },
    ],
  },
  {
    slug: "saima-nawaz-demo",
    photo: "/lawyers/saima-nawaz-demo.jpg",
    displayName: "Saima Nawaz (Demo)",
    headline: "Family & property law · Lahore High Court",
    bio: "Demo profile for development only. Saima handles khula, custody and property disputes for families in Lahore.",
    bioUrdu: "ڈیمو پروفائل — صرف ڈویلپمنٹ کے لیے۔",
    gender: "female",
    citySlug: "lahore",
    yearsExperience: 8,
    consultationFeePaisa: 250000,
    barCouncil: "Punjab Bar Council",
    barCouncilNo: "PBC-DEMO-019",
    courts: ["Lahore High Court"],
    practiceAreaSlugs: ["family-law", "property-law"],
    langCodes: ["ur", "en", "pa"],
    chamberName: "Nawaz Legal Services",
    chamberAddress: "Model Town, Lahore",
    education: [{ degree: "LLB", institution: "Punjab University Law College", year: 2016 }],
    services: [
      { nameEn: "Online Consultation (30 min)", nameUr: "آن لائن مشاورت", feePaisa: 250000 },
      { nameEn: "Chamber Meeting (30 min)", nameUr: "چیمبر ملاقات", feePaisa: 250000 },
      { nameEn: "Khula Case Filing", nameUr: "خلع کا کیس", feePaisa: 2200000 },
    ],
    rating: 4.7,
    reviewCount: 89,
    totalConsultations: 380,
    isDemo: true,
    reviews: [
      { id: "r26", clientName: "Amina L.", rating: 5, comment: "Bohat narmi se case handle kiya. Allah khush rakhe.", date: "2026-08-17", verified: true },
    ],
  },
  {
    slug: "khalid-mehmood-demo",
    photo: "/lawyers/khalid-mehmood-demo.jpg",
    displayName: "Khalid Mehmood (Demo)",
    headline: "Tax & corporate advisory · Lahore High Court",
    bio: "Demo profile for development only. Khalid advises on FBR notices, tax appeals and company matters in Lahore.",
    bioUrdu: "ڈیمو پروفائل — صرف ڈویلپمنٹ کے لیے۔",
    gender: "male",
    citySlug: "lahore",
    yearsExperience: 13,
    consultationFeePaisa: 550000,
    barCouncil: "Punjab Bar Council",
    barCouncilNo: "PBC-DEMO-020",
    courts: ["Lahore High Court"],
    practiceAreaSlugs: ["tax-law", "corporate-law"],
    langCodes: ["ur", "en"],
    chamberName: "Mehmood Tax Consultants",
    chamberAddress: "Gulberg III, Lahore",
    education: [{ degree: "LLB", institution: "Punjab University Law College", year: 2011 }],
    services: [
      { nameEn: "Online Consultation (30 min)", nameUr: "آن لائن مشاورت", feePaisa: 550000 },
      { nameEn: "Chamber Meeting (30 min)", nameUr: "چیمبر ملاقات", feePaisa: 550000 },
      { nameEn: "FBR Notice Reply", nameUr: "ایف بی آر نوٹس کا جواب", feePaisa: 3500000 },
    ],
    rating: 4.6,
    reviewCount: 71,
    totalConsultations: 350,
    isDemo: true,
    reviews: [
      { id: "r27", clientName: "Bilal C.", rating: 4, comment: "Tax notice ka detailed jawab diya. Satisfied.", date: "2026-06-15", verified: true },
    ],
  },
  {
    slug: "farah-iqbal-demo",
    photo: "/lawyers/farah-iqbal-demo.jpg",
    displayName: "Farah Iqbal (Demo)",
    headline: "Consumer & labour rights · Lahore High Court",
    bio: "Demo profile for development only. Farah takes consumer court claims and workplace disputes in Lahore.",
    bioUrdu: "ڈیمو پروفائل — صرف ڈویلپمنٹ کے لیے۔",
    gender: "female",
    citySlug: "lahore",
    yearsExperience: 6,
    consultationFeePaisa: 180000,
    barCouncil: "Punjab Bar Council",
    barCouncilNo: "PBC-DEMO-021",
    courts: ["Lahore High Court", "District Courts Lahore"],
    practiceAreaSlugs: ["consumer-law", "labour-law"],
    langCodes: ["ur", "en", "pa"],
    chamberName: "Iqbal Consumer Rights",
    chamberAddress: "Johar Town, Lahore",
    education: [{ degree: "LLB", institution: "Lahore Law College", year: 2018 }],
    services: [
      { nameEn: "Online Consultation (30 min)", nameUr: "آن لائن مشاورت", feePaisa: 180000 },
      { nameEn: "Chamber Meeting (30 min)", nameUr: "چیمبر ملاقات", feePaisa: 180000 },
      { nameEn: "Consumer Court Claim", nameUr: "صارف عدالت کا دعویٰ", feePaisa: 1200000 },
    ],
    rating: 4.7,
    reviewCount: 54,
    totalConsultations: 230,
    isDemo: true,
    reviews: [
      { id: "r28", clientName: "Sadia W.", rating: 5, comment: "Faulty fridge ka claim dilwaya. Thank you!", date: "2026-07-30", verified: true },
    ],
  },
  {
    slug: "omar-farooq-demo",
    photo: "/lawyers/omar-farooq-demo.jpg",
    displayName: "Omar Farooq (Demo)",
    headline: "Constitutional & cybercrime law · Islamabad High Court",
    bio: "Demo profile for development only. Omar files writ petitions and handles PECA cybercrime cases before the Islamabad High Court.",
    bioUrdu: "ڈیمو پروفائل — صرف ڈویلپمنٹ کے لیے۔",
    gender: "male",
    citySlug: "islamabad",
    yearsExperience: 12,
    consultationFeePaisa: 600000,
    barCouncil: "Islamabad Bar Council",
    barCouncilNo: "IBC-DEMO-022",
    courts: ["Islamabad High Court", "Supreme Court of Pakistan"],
    practiceAreaSlugs: ["constitutional-law", "cybercrime-law"],
    langCodes: ["ur", "en"],
    chamberName: "Farooq Constitutional Practice",
    chamberAddress: "F-7 Markaz, Islamabad",
    education: [{ degree: "LLB", institution: "International Islamic University, Islamabad", year: 2012 }],
    services: [
      { nameEn: "Online Consultation (30 min)", nameUr: "آن لائن مشاورت", feePaisa: 600000 },
      { nameEn: "Chamber Meeting (30 min)", nameUr: "چیمبر ملاقات", feePaisa: 600000 },
      { nameEn: "Writ Petition Drafting", nameUr: "رٹ پٹیشن", feePaisa: 5000000 },
    ],
    rating: 4.8,
    reviewCount: 92,
    totalConsultations: 470,
    isDemo: true,
    reviews: [
      { id: "r29", clientName: "Usman D.", rating: 5, comment: "Writ petition me kamyabi mili. Bohat qabil wakeel.", date: "2026-08-05", verified: true },
    ],
  },
  {
    slug: "zara-sheikh-demo",
    photo: "/lawyers/zara-sheikh-demo.jpg",
    displayName: "Zara Sheikh (Demo)",
    headline: "Corporate & immigration law · Islamabad High Court",
    bio: "Demo profile for development only. Zara helps startups with company setup and clients with visa refusal cases.",
    bioUrdu: "ڈیمو پروفائل — صرف ڈویلپمنٹ کے لیے۔",
    gender: "female",
    citySlug: "islamabad",
    yearsExperience: 5,
    consultationFeePaisa: 300000,
    barCouncil: "Islamabad Bar Council",
    barCouncilNo: "IBC-DEMO-023",
    courts: ["Islamabad High Court"],
    practiceAreaSlugs: ["corporate-law", "immigration-law"],
    langCodes: ["ur", "en"],
    chamberName: "Sheikh Business & Visa Law",
    chamberAddress: "Blue Area, Islamabad",
    education: [{ degree: "LLB", institution: "Bahria University, Islamabad", year: 2019 }],
    services: [
      { nameEn: "Online Consultation (30 min)", nameUr: "آن لائن مشاورت", feePaisa: 300000 },
      { nameEn: "Chamber Meeting (30 min)", nameUr: "چیمبر ملاقات", feePaisa: 300000 },
      { nameEn: "Visa Refusal Review", nameUr: "ویزا انکار کا جائزہ", feePaisa: 2000000 },
    ],
    rating: 4.7,
    reviewCount: 48,
    totalConsultations: 190,
    isDemo: true,
    reviews: [
      { id: "r30", clientName: "Ali H.", rating: 5, comment: "Startup registration smooth ho gayi.", date: "2026-07-12", verified: true },
    ],
  },
  {
    slug: "nasir-khan-demo",
    photo: "/lawyers/nasir-khan-demo.jpg",
    displayName: "Nasir Khan (Demo)",
    headline: "Criminal & property law · Peshawar High Court",
    bio: "Demo profile for development only. Nasir practises criminal defence and property disputes before the Peshawar High Court.",
    bioUrdu: "ڈیمو پروفائل — صرف ڈویلپمنٹ کے لیے۔",
    gender: "male",
    citySlug: "peshawar",
    yearsExperience: 14,
    consultationFeePaisa: 350000,
    barCouncil: "Khyber Pakhtunkhwa Bar Council",
    barCouncilNo: "KPB-DEMO-024",
    courts: ["Peshawar High Court", "District Courts Peshawar"],
    practiceAreaSlugs: ["criminal-law", "property-law"],
    langCodes: ["ur", "en", "ps"],
    chamberName: "Khan & Brothers",
    chamberAddress: "University Road, Peshawar",
    education: [{ degree: "LLB", institution: "University of Peshawar", year: 2010 }],
    services: [
      { nameEn: "Online Consultation (30 min)", nameUr: "آن لائن مشاورت", feePaisa: 350000 },
      { nameEn: "Chamber Meeting (30 min)", nameUr: "چیمبر ملاقات", feePaisa: 350000 },
      { nameEn: "Bail Application", nameUr: "ضمانت کی درخواست", feePaisa: 2500000 },
    ],
    rating: 4.7,
    reviewCount: 86,
    totalConsultations: 530,
    isDemo: true,
    reviews: [
      { id: "r31", clientName: "Sher A.", rating: 5, comment: "Zameen ka case jeeta. Deendar aur qabil wakeel.", date: "2026-06-25", verified: true },
    ],
  },
  {
    slug: "gulnaz-amin-demo",
    photo: "/lawyers/gulnaz-amin-demo.jpg",
    displayName: "Gulnaz Amin (Demo)",
    headline: "Family law · Peshawar High Court",
    bio: "Demo profile for development only. Gulnaz supports women with khula, custody and maintenance cases in Peshawar.",
    bioUrdu: "ڈیمو پروفائل — صرف ڈویلپمنٹ کے لیے۔",
    gender: "female",
    citySlug: "peshawar",
    yearsExperience: 9,
    consultationFeePaisa: 200000,
    barCouncil: "Khyber Pakhtunkhwa Bar Council",
    barCouncilNo: "KPB-DEMO-025",
    courts: ["Peshawar High Court"],
    practiceAreaSlugs: ["family-law"],
    langCodes: ["ur", "en", "ps"],
    chamberName: "Amin Family Law Office",
    chamberAddress: "Hayatabad Phase 2, Peshawar",
    education: [{ degree: "LLB", institution: "University of Peshawar", year: 2015 }],
    services: [
      { nameEn: "Online Consultation (30 min)", nameUr: "آن لائن مشاورت", feePaisa: 200000 },
      { nameEn: "Chamber Meeting (30 min)", nameUr: "چیمبر ملاقات", feePaisa: 200000 },
      { nameEn: "Khula Case Filing", nameUr: "خلع کا کیس", feePaisa: 2000000 },
    ],
    rating: 4.8,
    reviewCount: 63,
    totalConsultations: 280,
    isDemo: true,
    reviews: [
      { id: "r32", clientName: "Bibi Z.", rating: 5, comment: "Khula case me bohat madad ki. Shukriya.", date: "2026-08-09", verified: true },
    ],
  },
  {
    slug: "abdul-bari-demo",
    photo: "/lawyers/abdul-bari-demo.jpg",
    displayName: "Abdul Bari (Demo)",
    headline: "Constitutional & criminal law · Balochistan High Court",
    bio: "Demo profile for development only. Abdul Bari is a senior advocate with 17 years before the Balochistan High Court in Quetta.",
    bioUrdu: "ڈیمو پروفائل — صرف ڈویلپمنٹ کے لیے۔",
    gender: "male",
    citySlug: "quetta",
    yearsExperience: 17,
    consultationFeePaisa: 400000,
    barCouncil: "Balochistan Bar Council",
    barCouncilNo: "BBC-DEMO-026",
    courts: ["Balochistan High Court", "District Courts Quetta"],
    practiceAreaSlugs: ["constitutional-law", "criminal-law"],
    langCodes: ["ur", "en"],
    chamberName: "Bari Law Chamber",
    chamberAddress: "Jinnah Road, Quetta",
    education: [{ degree: "LLB", institution: "University of Balochistan", year: 2007 }],
    services: [
      { nameEn: "Online Consultation (30 min)", nameUr: "آن لائن مشاورت", feePaisa: 400000 },
      { nameEn: "Chamber Meeting (30 min)", nameUr: "چیمبر ملاقات", feePaisa: 400000 },
      { nameEn: "Writ Petition Drafting", nameUr: "رٹ پٹیشن", feePaisa: 4500000 },
    ],
    rating: 4.8,
    reviewCount: 79,
    totalConsultations: 560,
    isDemo: true,
    reviews: [
      { id: "r33", clientName: "Naseer B.", rating: 5, comment: "Senior wakeel hain, baat me wazan hai.", date: "2026-05-28", verified: true },
    ],
  },
  {
    slug: "zafar-jatoi-demo",
    photo: "/lawyers/zafar-jatoi-demo.jpg",
    displayName: "Zafar Jatoi (Demo)",
    headline: "Property & family disputes · Sindh High Court, Hyderabad",
    bio: "Demo profile for development only. Zafar handles property and family cases in Hyderabad, appearing before the Sindh High Court circuit bench.",
    bioUrdu: "ڈیمو پروفائل — صرف ڈویلپمنٹ کے لیے۔",
    gender: "male",
    citySlug: "hyderabad",
    yearsExperience: 10,
    consultationFeePaisa: 180000,
    barCouncil: "Sindh Bar Council",
    barCouncilNo: "SBC-DEMO-027",
    courts: ["Sindh High Court", "District Courts Hyderabad"],
    practiceAreaSlugs: ["property-law", "family-law"],
    langCodes: ["ur", "sd", "en"],
    chamberName: "Jatoi Legal Chamber",
    chamberAddress: "Qasimabad, Hyderabad",
    education: [{ degree: "LLB", institution: "University of Sindh, Jamshoro", year: 2014 }],
    services: [
      { nameEn: "Online Consultation (30 min)", nameUr: "آن لائن مشاورت", feePaisa: 180000 },
      { nameEn: "Chamber Meeting (30 min)", nameUr: "چیمبر ملاقات", feePaisa: 180000 },
    ],
    rating: 4.6,
    reviewCount: 51,
    totalConsultations: 260,
    isDemo: true,
    reviews: [
      { id: "r34", clientName: "Ghulam S.", rating: 4, comment: "Zameen ke kagzat ka kaam theek hua.", date: "2026-06-08", verified: true },
    ],
  },
  {
    slug: "shazia-qureshi-demo",
    photo: "/lawyers/shazia-qureshi-demo.jpg",
    displayName: "Shazia Qureshi (Demo)",
    headline: "Family & consumer matters · Lahore High Court, Multan",
    bio: "Demo profile for development only. Shazia serves South Punjab clients on family disputes and consumer claims.",
    bioUrdu: "ڈیمو پروفائل — صرف ڈویلپمنٹ کے لیے۔",
    gender: "female",
    citySlug: "multan",
    yearsExperience: 11,
    consultationFeePaisa: 220000,
    barCouncil: "Punjab Bar Council",
    barCouncilNo: "PBC-DEMO-028",
    courts: ["Lahore High Court (Multan Bench)", "District Courts Multan"],
    practiceAreaSlugs: ["family-law", "consumer-law"],
    langCodes: ["ur", "en"],
    chamberName: "Qureshi Law Office",
    chamberAddress: "Bosan Road, Multan",
    education: [{ degree: "LLB", institution: "Bahauddin Zakariya University, Multan", year: 2013 }],
    services: [
      { nameEn: "Online Consultation (30 min)", nameUr: "آن لائن مشاورت", feePaisa: 220000 },
      { nameEn: "Chamber Meeting (30 min)", nameUr: "چیمبر ملاقات", feePaisa: 220000 },
    ],
    rating: 4.8,
    reviewCount: 77,
    totalConsultations: 340,
    isDemo: true,
    reviews: [
      { id: "r35", clientName: "Rukhsana B.", rating: 5, comment: "Family case me insaaf mila. Bohat achi wakeel.", date: "2026-07-19", verified: true },
    ],
  },
  {
    slug: "arslan-chaudhry-demo",
    photo: "/lawyers/arslan-chaudhry-demo.jpg",
    displayName: "Arslan Chaudhry (Demo)",
    headline: "Corporate & banking law · Lahore High Court, Sialkot",
    bio: "Demo profile for development only. Arslan advises Sialkot's exporters and traders on company and banking matters.",
    bioUrdu: "ڈیمو پروفائل — صرف ڈویلپمنٹ کے لیے۔",
    gender: "male",
    citySlug: "sialkot",
    yearsExperience: 8,
    consultationFeePaisa: 280000,
    barCouncil: "Punjab Bar Council",
    barCouncilNo: "PBC-DEMO-029",
    courts: ["Lahore High Court", "District Courts Sialkot"],
    practiceAreaSlugs: ["corporate-law", "banking-finance"],
    langCodes: ["ur", "en", "pa"],
    chamberName: "Chaudhry Trade Law",
    chamberAddress: "Paris Road, Sialkot",
    education: [{ degree: "LLB", institution: "Punjab University Law College", year: 2016 }],
    services: [
      { nameEn: "Online Consultation (30 min)", nameUr: "آن لائن مشاورت", feePaisa: 280000 },
      { nameEn: "Chamber Meeting (30 min)", nameUr: "چیمبر ملاقات", feePaisa: 280000 },
      { nameEn: "Company Registration", nameUr: "کمپنی رجسٹریشن", feePaisa: 6000000 },
    ],
    rating: 4.6,
    reviewCount: 44,
    totalConsultations: 210,
    isDemo: true,
    reviews: [
      { id: "r36", clientName: "Umair E.", rating: 5, comment: "Export business ka legal kaam smooth karwaya.", date: "2026-08-13", verified: true },
    ],
  },
  {
    slug: "mehwish-raza-demo",
    photo: "/lawyers/mehwish-raza-demo.jpg",
    displayName: "Mehwish Raza (Demo)",
    headline: "Immigration & labour law · Lahore High Court, Gujranwala",
    bio: "Demo profile for development only. Mehwish helps with visa refusals and workplace disputes for clients in Gujranwala.",
    bioUrdu: "ڈیمو پروفائل — صرف ڈویلپمنٹ کے لیے۔",
    gender: "female",
    citySlug: "gujranwala",
    yearsExperience: 7,
    consultationFeePaisa: 200000,
    barCouncil: "Punjab Bar Council",
    barCouncilNo: "PBC-DEMO-030",
    courts: ["Lahore High Court", "District Courts Gujranwala"],
    practiceAreaSlugs: ["immigration-law", "labour-law"],
    langCodes: ["ur", "en", "pa"],
    chamberName: "Raza Immigration & Labour Law",
    chamberAddress: "GT Road, Gujranwala",
    education: [{ degree: "LLB", institution: "Gujranwala Law College", year: 2017 }],
    services: [
      { nameEn: "Online Consultation (30 min)", nameUr: "آن لائن مشاورت", feePaisa: 200000 },
      { nameEn: "Chamber Meeting (30 min)", nameUr: "چیمبر ملاقات", feePaisa: 200000 },
      { nameEn: "Visa Refusal Review", nameUr: "ویزا انکار کا جائزہ", feePaisa: 1800000 },
    ],
    rating: 4.7,
    reviewCount: 59,
    totalConsultations: 250,
    isDemo: true,
    reviews: [
      { id: "r37", clientName: "Sajid N.", rating: 5, comment: "Visa case dobara file kiya aur approve ho gaya.", date: "2026-07-08", verified: true },
    ],
  },
];

// ---------------- Helpers ----------------

export function formatPKR(paisa: number): string {
  const pkr = Math.round(paisa / 100);
  return "Rs. " + pkr.toLocaleString("en-PK");
}

export function getCity(slug: string): City | undefined {
  return CITIES.find((c) => c.slug === slug);
}

export function getPracticeArea(slug: string): PracticeArea | undefined {
  return PRACTICE_AREAS.find((p) => p.slug === slug);
}

export function getLawyer(slug: string): Lawyer | undefined {
  return LAWYERS.find((l) => l.slug === slug);
}

export function cityName(slug: string): string {
  return getCity(slug)?.nameEn ?? slug;
}

export function areaName(slug: string): string {
  return getPracticeArea(slug)?.nameEn ?? slug;
}

/** Demo availability: Mon–Fri 09:00–17:00 (mirrors seed data). */
export function isAvailableToday(): boolean {
  const dow = new Date().getDay();
  return dow >= 1 && dow <= 5;
}

export function lawyerAreas(lawyer: Lawyer): PracticeArea[] {
  return lawyer.practiceAreaSlugs
    .map(getPracticeArea)
    .filter((a): a is PracticeArea => Boolean(a));
}

export function lawyerLanguages(lawyer: Lawyer): Language[] {
  return lawyer.langCodes
    .map((c) => LANGUAGES.find((l) => l.code === c))
    .filter((l): l is Language => Boolean(l));
}

export interface SlotDay {
  date: Date;
  label: string;
  sub: string;
  slots: { time: string; taken: boolean }[];
}

/** Next 7 days of 30-min slots, 09:00–16:30, Mon–Fri only. Deterministic "taken" mix. */
export function nextSlotDays(lawyerSlug: string, days = 7): SlotDay[] {
  const out: SlotDay[] = [];
  const seedBase = lawyerSlug.length;
  const today = new Date();
  let added = 0;
  for (let i = 0; added < days && i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dow = d.getDay();
    if (dow === 0 || dow === 6) continue; // closed Sat/Sun
    const slots: { time: string; taken: boolean }[] = [];
    for (let m = 9 * 60; m < 17 * 60; m += 30) {
      const hh = Math.floor(m / 60);
      const mm = m % 60 === 0 ? "00" : "30";
      const ampm = hh >= 12 ? "PM" : "AM";
      const h12 = hh > 12 ? hh - 12 : hh;
      // deterministic pseudo-random "taken" slots
      const taken = (seedBase * 7 + added * 13 + m) % 5 === 0;
      slots.push({ time: `${h12}:${mm} ${ampm}`, taken });
    }
    const label =
      i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString("en-PK", { weekday: "short" });
    out.push({
      date: d,
      label,
      sub: d.toLocaleDateString("en-PK", { day: "numeric", month: "short" }),
      slots,
    });
    added++;
  }
  return out;
}

export interface LawyerFilter {
  city?: string;
  area?: string;
  court?: string;
  q?: string;
  availableToday?: boolean;
  maxFeePaisa?: number;
  minExp?: number;
  gender?: "male" | "female";
  lang?: string;
  mode?: "video" | "chamber";
  sort?: "recommended" | "exp" | "fee" | "rating";
}

export function searchLawyers(f: LawyerFilter): Lawyer[] {
  let list = LAWYERS.filter((l) => {
    if (f.city && l.citySlug !== f.city) return false;
    if (f.area && !l.practiceAreaSlugs.includes(f.area)) return false;
    if (f.court) {
      const court = getCourt(f.court);
      if (!court || !l.courts.some((c) => c.startsWith(court.nameEn))) return false;
    }
    if (f.availableToday && !isAvailableToday()) return false;
    if (f.maxFeePaisa && l.consultationFeePaisa > f.maxFeePaisa) return false;
    if (f.minExp && l.yearsExperience < f.minExp) return false;
    if (f.gender && l.gender !== f.gender) return false;
    if (f.lang && !l.langCodes.includes(f.lang)) return false;
    if (f.q) {
      const q = f.q.toLowerCase();
      const hay =
        `${l.displayName} ${l.headline} ${l.bio} ${lawyerAreas(l).map((a) => a.nameEn + " " + (a.nameUr ?? "")).join(" ")}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  switch (f.sort) {
    case "exp":
      list = [...list].sort((a, b) => b.yearsExperience - a.yearsExperience);
      break;
    case "fee":
      list = [...list].sort((a, b) => a.consultationFeePaisa - b.consultationFeePaisa);
      break;
    case "rating":
      list = [...list].sort((a, b) => b.rating - a.rating);
      break;
    default:
      list = [...list].sort((a, b) => b.rating * Math.log10(b.reviewCount + 10) - a.rating * Math.log10(a.reviewCount + 10));
  }
  return list;
}

export function countByCityArea(citySlug: string, areaSlug: string): number {
  return LAWYERS.filter((l) => l.citySlug === citySlug && l.practiceAreaSlugs.includes(areaSlug)).length;
}

/** Lawyers practising before a high court (also matches "Lahore High Court (Multan Bench)"). */
export function countByCourt(courtSlug: string): number {
  const court = getCourt(courtSlug);
  if (!court) return 0;
  return LAWYERS.filter((l) => l.courts.some((c) => c.startsWith(court.nameEn))).length;
}

/** Mock client bookings for the dashboard demo. */
export interface DemoBooking {
  id: string;
  lawyerSlug: string;
  date: string;
  time: string;
  mode: "video" | "chamber";
  feePaisa: number;
  status: "upcoming" | "completed" | "cancelled";
}

export const DEMO_BOOKINGS: DemoBooking[] = [
  { id: "BK-10231", lawyerSlug: "ahmed-raza-demo", date: "Sat, 27 Sep 2026", time: "10:30 AM", mode: "video", feePaisa: 300000, status: "upcoming" },
  { id: "BK-10187", lawyerSlug: "fatima-khan-demo", date: "12 Sep 2026", time: "04:00 PM", mode: "chamber", feePaisa: 250000, status: "completed" },
  { id: "BK-10102", lawyerSlug: "sana-sheikh-demo", date: "28 Aug 2026", time: "11:00 AM", mode: "video", feePaisa: 180000, status: "cancelled" },
];

/** Mock verification queue for the admin demo. */
export interface PendingLawyer {
  id: string;
  name: string;
  city: string;
  barCouncil: string;
  submittedDaysAgo: number;
}

export const PENDING_VERIFICATIONS: PendingLawyer[] = [
  { id: "v1", name: "Kashif Mehmood", city: "Gujranwala", barCouncil: "Punjab Bar Council", submittedDaysAgo: 1 },
  { id: "v2", name: "Dr. Shazia Noor", city: "Quetta", barCouncil: "Balochistan Bar Council", submittedDaysAgo: 3 },
  { id: "v3", name: "Faisal Iqbal", city: "Sialkot", barCouncil: "Punjab Bar Council", submittedDaysAgo: 5 },
];
