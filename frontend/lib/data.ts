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

export interface Lawyer {
  slug: string;
  displayName: string;
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
  rating: number;
  reviewCount: number;
  reviews: Review[];
  totalConsultations: number;
  isDemo: true;
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

// ---------------- Demo lawyers ----------------

export const LAWYERS: Lawyer[] = [
  {
    slug: "ahmed-raza-demo",
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
