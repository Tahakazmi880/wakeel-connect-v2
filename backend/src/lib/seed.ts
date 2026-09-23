// ============================================================
// wakeel.connect — database seed (reference data + demo lawyers)
// Shared by the local tsx script (prisma/seed.ts) and the
// production bootstrapper (src/lib/bootstrap.ts).
//
// Reference data: cities, practice areas, languages.
// Demo lawyers are flagged isSeedData = true and carry "(Demo)"
// in their display names. They must NEVER be presented as real
// verified lawyers — the frontend filters them out of public
// listings.
//
// Idempotent: safe to run multiple times (upserts everywhere).
// ============================================================

import { Role, VerificationStatus } from "@prisma/client";
import type { PrismaClient } from "@prisma/client";

// ---------------- Reference data ----------------

const CITIES = [
  { slug: "karachi", nameEn: "Karachi", nameUr: "کراچی", province: "Sindh" },
  { slug: "lahore", nameEn: "Lahore", nameUr: "لاہور", province: "Punjab" },
  { slug: "islamabad", nameEn: "Islamabad", nameUr: "اسلام آباد", province: "Islamabad Capital Territory" },
  { slug: "rawalpindi", nameEn: "Rawalpindi", nameUr: "راولپنڈی", province: "Punjab" },
  { slug: "faisalabad", nameEn: "Faisalabad", nameUr: "فیصل آباد", province: "Punjab" },
  { slug: "multan", nameEn: "Multan", nameUr: "ملتان", province: "Punjab" },
  { slug: "peshawar", nameEn: "Peshawar", nameUr: "پشاور", province: "Khyber Pakhtunkhwa" },
  { slug: "quetta", nameEn: "Quetta", nameUr: "کوئٹہ", province: "Balochistan" },
  { slug: "hyderabad", nameEn: "Hyderabad", nameUr: "حیدرآباد", province: "Sindh" },
  { slug: "sukkur", nameEn: "Sukkur", nameUr: "سکھر", province: "Sindh" },
  { slug: "sialkot", nameEn: "Sialkot", nameUr: "سیالکوٹ", province: "Punjab" },
  { slug: "gujranwala", nameEn: "Gujranwala", nameUr: "گوجرانوالہ", province: "Punjab" },
  { slug: "bahawalpur", nameEn: "Bahawalpur", nameUr: "بہاولپور", province: "Punjab" },
];

const PRACTICE_AREAS = [
  { slug: "family-law", nameEn: "Family Law", nameUr: "خاندانی قانون", description: "Divorce, khula, child custody, maintenance and inheritance matters.", sortOrder: 1 },
  { slug: "criminal-law", nameEn: "Criminal Law", nameUr: "فوجداری قانون", description: "Bail, trials, appeals and quashment petitions.", sortOrder: 2 },
  { slug: "property-law", nameEn: "Property Law", nameUr: "جائیداد کا قانون", description: "Title disputes, possession suits, registry and transfer matters.", sortOrder: 3 },
  { slug: "corporate-law", nameEn: "Corporate Law", nameUr: "کارپوریٹ قانون", description: "Company formation, contracts, compliance and mergers.", sortOrder: 4 },
  { slug: "tax-law", nameEn: "Tax Law", nameUr: "ٹیکس قانون", description: "Income tax, sales tax, FBR notices and tribunal appeals.", sortOrder: 5 },
  { slug: "immigration-law", nameEn: "Immigration Law", nameUr: "امیگریشن قانون", description: "Visas, deportation defence and citizenship matters.", sortOrder: 6 },
  { slug: "labour-law", nameEn: "Labour & Employment", nameUr: "محنت کشوں کا قانون", description: "Wrongful termination, wages, and workplace disputes.", sortOrder: 7 },
  { slug: "banking-finance", nameEn: "Banking & Finance", nameUr: "بینکاری و مالیات", description: "Loan defaults, banking court cases and recovery suits.", sortOrder: 8 },
  { slug: "constitutional-law", nameEn: "Constitutional Law", nameUr: "آئینی قانون", description: "Writ petitions, fundamental rights and public interest litigation.", sortOrder: 9 },
  { slug: "civil-law", nameEn: "Civil Litigation", nameUr: "دیوانی مقدمات", description: "Civil suits, injunctions, damages and appeals.", sortOrder: 10 },
  { slug: "cybercrime-law", nameEn: "Cybercrime Law", nameUr: "سائبر کرائم قانون", description: "Online harassment, fraud and PECA cases.", sortOrder: 11 },
  { slug: "consumer-law", nameEn: "Consumer Protection", nameUr: "صارفین کے حقوق", description: "Faulty goods and services, consumer court claims.", sortOrder: 12 },
  { slug: "arbitration", nameEn: "Arbitration & Mediation", nameUr: "ثالثی و مصالحت", description: "Out-of-court dispute resolution and settlements.", sortOrder: 13 },
];

const LANGUAGES = [
  { code: "ur", nameEn: "Urdu", nameUr: "اردو" },
  { code: "en", nameEn: "English", nameUr: "انگریزی" },
  { code: "pa", nameEn: "Punjabi", nameUr: "پنجابی" },
  { code: "sd", nameEn: "Sindhi", nameUr: "سندھی" },
  { code: "ps", nameEn: "Pashto", nameUr: "پشتو" },
];

// ---------------- Demo lawyers (NOT real) ----------------

interface DemoLawyer {
  phone: string;
  fullName: string;
  slug: string;
  displayName: string;
  headline: string;
  citySlug: string;
  yearsExperience: number;
  feePaisa: number;
  barCouncil: string;
  barCouncilNo: string;
  courts: string[];
  practiceAreaSlugs: string[];
  langCodes: string[];
  chamberName: string;
  chamberAddress: string;
}

const DEMO_LAWYERS: DemoLawyer[] = [
  {
    phone: "+923001234501",
    fullName: "Ahmed Raza",
    slug: "ahmed-raza-demo",
    displayName: "Ahmed Raza (Demo)",
    headline: "Family & property disputes, Lahore High Court",
    citySlug: "lahore",
    yearsExperience: 12,
    feePaisa: 300000,
    barCouncil: "Punjab Bar Council",
    barCouncilNo: "PBC-DEMO-001",
    courts: ["Lahore High Court", "District Courts Lahore"],
    practiceAreaSlugs: ["family-law", "property-law"],
    langCodes: ["ur", "en", "pa"],
    chamberName: "Raza Law Chamber",
    chamberAddress: "14-D, Davis Road, Lahore",
  },
  {
    phone: "+923001234502",
    fullName: "Fatima Khan",
    slug: "fatima-khan-demo",
    displayName: "Fatima Khan (Demo)",
    headline: "Criminal defence & cybercrime, Karachi",
    citySlug: "karachi",
    yearsExperience: 8,
    feePaisa: 250000,
    barCouncil: "Sindh Bar Council",
    barCouncilNo: "SBC-DEMO-002",
    courts: ["Sindh High Court", "City Courts Karachi"],
    practiceAreaSlugs: ["criminal-law", "cybercrime-law"],
    langCodes: ["ur", "en", "sd"],
    chamberName: "Khan Legal Associates",
    chamberAddress: "Office 301, Clifton Centre, Karachi",
  },
  {
    phone: "+923001234503",
    fullName: "Muhammad Bilal",
    slug: "muhammad-bilal-demo",
    displayName: "Muhammad Bilal (Demo)",
    headline: "Corporate & tax advisory, Islamabad",
    citySlug: "islamabad",
    yearsExperience: 15,
    feePaisa: 500000,
    barCouncil: "Islamabad Bar Council",
    barCouncilNo: "IBC-DEMO-003",
    courts: ["Islamabad High Court", "Supreme Court of Pakistan"],
    practiceAreaSlugs: ["corporate-law", "tax-law"],
    langCodes: ["ur", "en"],
    chamberName: "Bilal & Partners",
    chamberAddress: "Suite 12, Blue Area, Islamabad",
  },
  {
    phone: "+923001234504",
    fullName: "Ayesha Malik",
    slug: "ayesha-malik-demo",
    displayName: "Ayesha Malik (Demo)",
    headline: "Immigration & labour matters, Rawalpindi",
    citySlug: "rawalpindi",
    yearsExperience: 6,
    feePaisa: 200000,
    barCouncil: "Punjab Bar Council",
    barCouncilNo: "PBC-DEMO-004",
    courts: ["Lahore High Court Rawalpindi Bench", "District Courts Rawalpindi"],
    practiceAreaSlugs: ["immigration-law", "labour-law"],
    langCodes: ["ur", "en", "pa"],
    chamberName: "Malik Law Office",
    chamberAddress: "House 7, Satellite Town, Rawalpindi",
  },
];

const SEED_QA: { title: string; body: string; authorName: string; areaSlug: string; answer: string }[] = [
  {
    title: "Khula lene ka tareeqa kya hai Pakistan mein?",
    body: "Main apne shohar se khula lena chahti hun. Court ka process kya hai, kitna time lagta hai, aur kya kharcha aata hai?",
    authorName: "Ayesha K.",
    areaSlug: "family-law",
    answer:
      "Khula family court mein case file karke li jati hai. Aap ko apna nikahnama, CNIC aur wajah bayan karke plaint file karna hota hai. Court reconciliation ki koshish karta hai; nakaami par khula ka decree jari hota hai, jo Union Council mein 90 din ke baad effective hota hai. Aam tor par 3–6 mahine lagte hain. Yeh aam maloomat hai, qanooni mashwara nahi — apne case ke liye kisi wakeel se raabta karein.",
  },
  {
    title: "Property par qabza ho gaya hai, kya karun?",
    body: "Mere plot par kisi ne qabza kar liya hai. Registry mere naam par hai. Fori kya action le sakta hun?",
    authorName: "Bilal M.",
    areaSlug: "property-law",
    answer:
      "Registry aap ke naam par hai to aap civil court mein possession ka dawa (suit for possession) file kar sakte hain, aur urgent relief ke liye stay order / interim injunction ki darkhwast de sakte hain. Qabze ke saboot (registry, fard, photos) sambhal kar rakhein aur police report bhi darj karwayein. Yeh aam maloomat hai, qanooni mashwara nahi.",
  },
  {
    title: "Bail ka process kya hai criminal case mein?",
    body: "Mere bhai ko police ne giraftar kiya hai. Zamanat kaise hogi aur kitna kharcha aayega?",
    authorName: "Imran S.",
    areaSlug: "criminal-law",
    answer:
      "Zamanat (bail) ka case sessions court mein bail petition file karke lara jata hai. Wakeel FIR, giraftari ki wajah aur saboot dekh kar petition tayyar karta hai. Fees case ki noiyat par hoti hai — wakeel.connect par criminal lawyers ki fees profile par likhi hoti hai. Fori tor par kisi criminal wakeel se raabta karein. Yeh aam maloomat hai, qanooni mashwara nahi.",
  },
  {
    title: "Bank loan default par kya ho sakta hai?",
    body: "Maine bank se loan liya tha, ab ada nahi kar pa raha. Bank ne notice bheja hai. Kya ghar nilam ho sakta hai?",
    authorName: "Farhan A.",
    areaSlug: "banking-finance",
    answer:
      "Banking court mein recovery suit file ho sakta hai, aur agar property mortgage hai to us ki nilami ka khatra hota hai. Notice ka jawab waqt par dena zaroori hai — aksar bank settlement ya rescheduling par raazi ho jata hai. Apne loan documents le kar banking ke wakeel se fori mashwara lein. Yeh aam maloomat hai, qanooni mashwara nahi.",
  },
];

// ---------------- FAQs (bilingual; describe existing features only) ----------------

const FAQS: {
  question: string;
  questionUr: string;
  answer: string;
  answerUr: string;
  category: string;
  sortOrder: number;
}[] = [
  {
    question: "How do I book a lawyer?",
    questionUr: "وکیل کی بکنگ کیسے کروں؟",
    answer:
      "Find a lawyer in the directory, open their profile, pick a date and time slot, and verify your phone number with the 6-digit code we send you. Your booking is then sent to the lawyer for confirmation.",
    answerUr:
      "ڈائریکٹری میں وکیل تلاش کریں، ان کا پروفائل کھولیں، تاریخ اور وقت منتخب کریں، اور موبائل نمبر پر آنے والے 6 ہندسوں کے کوڈ سے تصدیق کریں۔ اس کے بعد آپ کی بکنگ وکیل کو بھیجی جائے گی۔",
    category: "booking",
    sortOrder: 1,
  },
  {
    question: "Is my phone number shown to everyone?",
    questionUr: "کیا میرا فون نمبر سب کو نظر آتا ہے؟",
    answer:
      "No. Your phone number is only shared with the lawyer after your booking is confirmed, so they can contact you about your appointment.",
    answerUr:
      "نہیں۔ آپ کا فون نمبر صرف اس وکیل کو دکھایا جاتا ہے جس کی بکنگ کنفرم ہو جائے، تاکہ وہ ملاقات کے بارے میں آپ سے رابطہ کر سکے۔",
    category: "booking",
    sortOrder: 2,
  },
  {
    question: 'What does "Fee on request" mean?',
    questionUr: "’فیس معلوم کریں‘ کا کیا مطلب ہے؟",
    answer:
      "It means the lawyer has not published a fixed consultation fee. Please confirm the fee with the lawyer before your appointment.",
    answerUr:
      "اس کا مطلب ہے کہ وکیل نے مشاورت کی فیس مقرر کر کے نہیں بتائی۔ براہ کرم ملاقات سے پہلے فیس وکیل سے کنفرم کر لیں۔",
    category: "booking",
    sortOrder: 3,
  },
  {
    question: "Can I consult a lawyer online?",
    questionUr: "کیا میں آن لائن مشورہ لے سکتا ہوں؟",
    answer:
      "Lawyers marked as offering online consultation can advise you remotely. The call itself happens over the phone with the lawyer — video calls inside the app are not available yet.",
    answerUr:
      "جو وکیل آن لائن مشورے کی سہولت دیتے ہیں وہ دور سے آپ کی رہنمائی کر سکتے ہیں۔ کال فون پر ہوتی ہے — ایپ کے اندر ویڈیو کال کی سہولت ابھی دستیاب نہیں۔",
    category: "booking",
    sortOrder: 4,
  },
  {
    question: "How do I ask a free legal question?",
    questionUr: "مفت قانونی سوال کیسے پوچھوں؟",
    answer:
      "Go to the Q&A section, write your question with a few details, and submit it. Questions are reviewed before they appear publicly.",
    answerUr:
      "سوال و جواب کے سیکشن میں جائیں، اپنا سوال چند تفصیلات کے ساتھ لکھیں اور بھیج دیں۔ سوالات عوامی طور پر ظاہر ہونے سے پہلے جانچے جاتے ہیں۔",
    category: "qna",
    sortOrder: 5,
  },
  {
    question: "How are lawyers verified on wakeel.connect?",
    questionUr: "wakeel.connect پر وکلا کی تصدیق کیسے ہوتی ہے؟",
    answer:
      "Lawyers sign up on the platform and submit their CNIC and Bar Council documents. Our team reviews the documents and only then is the profile listed publicly as a reviewed profile.",
    answerUr:
      "وکیل پلیٹ فارم پر رجسٹر ہوتے ہیں اور اپنا شناختی کارڈ اور بار کونسل کے دستاویزات جمع کراتے ہیں۔ ہماری ٹیم دستاویزات کی جانچ کرتی ہے اور اس کے بعد ہی پروفائل عوامی طور پر ظاہر ہوتا ہے۔",
    category: "general",
    sortOrder: 6,
  },
  {
    question: "What documents do I need to join as a lawyer?",
    questionUr: "وکیل کے طور پر شامل ہونے کے لیے کون سے دستاویزات چاہئیں؟",
    answer:
      "You will need your CNIC (front and back) and your Bar Council certificate. You can also add your degree and a profile photo. Documents are uploaded privately during signup and reviewed by our team.",
    answerUr:
      "آپ کو اپنا شناختی کارڈ (سامنے اور پیچھے) اور بار کونسل کا سرٹیفکیٹ درکار ہوگا۔ آپ اپنی ڈگری اور پروفائل تصویر بھی شامل کر سکتے ہیں۔ دستاویزات رجسٹریشن کے دوران نجی طور پر اپ لوڈ ہوتی ہیں اور ہماری ٹیم ان کی جانچ کرتی ہے۔",
    category: "documents",
    sortOrder: 7,
  },
];

// ---------------- Institutional partners (confirmed real clients only) ----------------

const PARTNERS: { name: string; logoUrl: string }[] = [
  { name: "Amreli Steels", logoUrl: "/partners/amreli-steels.png" },
  { name: "JS Bank", logoUrl: "/partners/js-bank.png" },
  { name: "BankIslami", logoUrl: "/partners/bankislami.png" },
  { name: "Halan", logoUrl: "/partners/halan.png" },
  { name: "Pakistan Rangers Sindh", logoUrl: "/partners/pakistan-rangers.png" },
  { name: "PTCL", logoUrl: "/partners/ptcl.png" },
  { name: "STEVTA", logoUrl: "/partners/stevta.png" },
  { name: "Pathfinder Group", logoUrl: "/partners/pathfinder-group.png" },
  { name: "Wackenhut", logoUrl: "/partners/wackenhut.png" },
  { name: "CITADEL", logoUrl: "/partners/citadel.png" },
  { name: "DevTects", logoUrl: "/partners/devtects.png" },
  { name: "AsaanPay", logoUrl: "/partners/asaanpay.png" },
  { name: "SMS Technologies", logoUrl: "/partners/sms-technologies.png" },
  { name: "SMS Services", logoUrl: "/partners/sms-services.png" },
  { name: "iPath", logoUrl: "/partners/ipath.png" },
  { name: "VRG", logoUrl: "/partners/vrg.png" },
];

// ---------------- Seed ----------------

export async function seedDatabase(prisma: PrismaClient): Promise<void> {
  for (const c of CITIES) {
    await prisma.city.upsert({
      where: { slug: c.slug },
      update: { nameEn: c.nameEn, nameUr: c.nameUr, province: c.province },
      create: c,
    });
  }
  console.log(`seeded ${CITIES.length} cities`);

  for (const p of PRACTICE_AREAS) {
    await prisma.practiceArea.upsert({
      where: { slug: p.slug },
      update: { nameEn: p.nameEn, nameUr: p.nameUr, description: p.description, sortOrder: p.sortOrder },
      create: p,
    });
  }
  console.log(`seeded ${PRACTICE_AREAS.length} practice areas`);

  for (const l of LANGUAGES) {
    await prisma.language.upsert({
      where: { code: l.code },
      update: { nameEn: l.nameEn, nameUr: l.nameUr },
      create: l,
    });
  }
  console.log(`seeded ${LANGUAGES.length} languages`);

  for (const s of SEED_QA) {
    const area = await prisma.practiceArea.findUnique({ where: { slug: s.areaSlug } });
    const existing = await prisma.forumQuestion.findFirst({ where: { title: s.title, isSeed: true } });
    if (!existing && area) {
      await prisma.forumQuestion.create({
        data: {
          authorName: s.authorName,
          areaId: area.id,
          title: s.title,
          body: s.body,
          isSeed: true,
          isLocked: true,
          answers: {
            create: { authorName: "wakeel.connect Legal Team", body: s.answer, isSeed: true },
          },
        },
      });
    }
  }
  console.log(`seeded ${SEED_QA.length} forum Q&A samples`);

  for (const d of DEMO_LAWYERS) {
    const city = await prisma.city.findUniqueOrThrow({ where: { slug: d.citySlug } });

    const user = await prisma.user.upsert({
      where: { phone: d.phone },
      update: {},
      create: {
        phone: d.phone,
        fullName: d.fullName,
        role: Role.LAWYER,
      },
    });

    const lawyer = await prisma.lawyer.upsert({
      where: { slug: d.slug },
      update: {},
      create: {
        userId: user.id,
        slug: d.slug,
        displayName: d.displayName,
        headline: d.headline,
        bio: "Demo profile for development only. Not a real lawyer.",
        cityId: city.id,
        yearsExperience: d.yearsExperience,
        consultationFeePaisa: d.feePaisa,
        courts: d.courts,
        barCouncil: d.barCouncil,
        barCouncilNo: d.barCouncilNo,
        verificationStatus: VerificationStatus.APPROVED,
        verifiedAt: new Date(),
        isListed: true,
        isSeedData: true,
      },
    });

    await prisma.chamber.upsert({
      where: { id: `${lawyer.id}-primary` },
      update: {},
      create: {
        id: `${lawyer.id}-primary`,
        lawyerId: lawyer.id,
        name: d.chamberName,
        address: d.chamberAddress,
        cityId: city.id,
        isPrimary: true,
      },
    });

    for (const [i, slug] of d.practiceAreaSlugs.entries()) {
      const pa = await prisma.practiceArea.findUniqueOrThrow({ where: { slug } });
      await prisma.lawyerPracticeArea.upsert({
        where: { lawyerId_practiceAreaId: { lawyerId: lawyer.id, practiceAreaId: pa.id } },
        update: {},
        create: { lawyerId: lawyer.id, practiceAreaId: pa.id, isPrimary: i === 0 },
      });
    }

    for (const code of d.langCodes) {
      await prisma.lawyerLanguage.upsert({
        where: { lawyerId_langCode: { lawyerId: lawyer.id, langCode: code } },
        update: {},
        create: { lawyerId: lawyer.id, langCode: code },
      });
    }

    // Mon–Fri 09:00–17:00 (minutes since midnight)
    for (let dow = 1; dow <= 5; dow++) {
      await prisma.weeklyAvailability.upsert({
        where: {
          lawyerId_dayOfWeek_startTime: { lawyerId: lawyer.id, dayOfWeek: dow, startTime: 540 },
        },
        update: {},
        create: { lawyerId: lawyer.id, dayOfWeek: dow, startTime: 540, endTime: 1020 },
      });
    }
  }
  console.log(`seeded ${DEMO_LAWYERS.length} demo lawyers (isSeedData=true)`);

  for (const f of FAQS) {
    const existing = await prisma.faq.findFirst({ where: { question: f.question } });
    if (!existing) {
      await prisma.faq.create({ data: f });
    }
  }
  console.log(`seeded ${FAQS.length} FAQs`);

  for (const [i, p] of PARTNERS.entries()) {
    const existing = await prisma.partner.findFirst({ where: { name: p.name } });
    if (existing) {
      await prisma.partner.update({
        where: { id: existing.id },
        data: { logoUrl: p.logoUrl, sortOrder: i + 1, isActive: true },
      });
    } else {
      await prisma.partner.create({ data: { name: p.name, logoUrl: p.logoUrl, sortOrder: i + 1 } });
    }
  }
  console.log(`seeded ${PARTNERS.length} partners`);
}
