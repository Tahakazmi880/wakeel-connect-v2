import { LAWYERS, formatPKR, type PracticeArea } from "./data";

export interface AreaGuide {
  whoEn: string;
  whoUr: string;
  whenEn: string[];
  whenUr: string[];
}

/**
 * Short, honest SEO content per practice area — oladoc-style
 * "Who is / when to visit / what it costs" blocks. Fee ranges are
 * computed from real listed fees, never invented.
 */
export const AREA_GUIDES: Record<string, AreaGuide> = {
  "family-law": {
    whoEn: "A family lawyer handles divorce, khula, child custody, maintenance (kharcha) and inheritance cases in Pakistan's family courts — in plain language, without confusing legal jargon.",
    whoUr: "خاندانی وکیل طلاق، خلع، بچوں کی تحویل، نان نفقہ اور وراثت کے مقدمات فیملی عدالتوں میں لڑتا ہے — سادہ زبان میں۔",
    whenEn: ["You are considering divorce or khula", "There is a dispute over child custody or visitation", "You need to claim or defend maintenance / inheritance"],
    whenUr: ["طلاق یا خلع کا ارادہ ہو", "بچوں کی تحویل پر اختلاف ہو", "نان نفقہ یا وراثت کا دعویٰ ہو"],
  },
  "criminal-law": {
    whoEn: "A criminal lawyer defends you in FIR cases, bail petitions, trials and appeals — from the police station to the High Court.",
    whoUr: "فوجداری وکیل ایف آئی آر، ضمانت، ٹرائل اور اپیل کے مقدمات میں آپ کا دفاع کرتا ہے — تھانے سے ہائی کورٹ تک۔",
    whenEn: ["An FIR has been registered against you or a loved one", "You need bail before arrest or after arrest", "You want to challenge a conviction on appeal"],
    whenUr: ["آپ یا کسی عزیز کے خلاف ایف آئی آر درج ہوئی ہو", "گرفتاری سے پہلے یا بعد میں ضمانت چاہیے ہو", "سزا کے خلاف اپیل کرنی ہو"],
  },
  "property-law": {
    whoEn: "A property lawyer handles title disputes, possession suits, registry, transfer and inheritance of plots, houses and commercial property.",
    whoUr: "جائیداد کا وکیل ملکیت کے جھگڑے، قبضے کے مقدمات، رجسٹری، انتقال اور وراثت کے معاملات دیکھتا ہے۔",
    whenEn: ["Someone has occupied your plot or house", "You are buying property and want the documents verified", "There is a family dispute over inherited property"],
    whenUr: ["کسی نے آپ کے پلاٹ یا مکان پر قبضہ کیا ہو", "جائیداد خرید رہے ہوں اور کاغذات چیک کرانے ہوں", "وراثتی جائیداد پر خاندانی جھگڑا ہو"],
  },
  "corporate-law": {
    whoEn: "A corporate lawyer helps register companies, draft contracts, and stay compliant with SECP, tax and labour regulations.",
    whoUr: "کارپوریٹ وکیل کمپنی رجسٹر کرانے، معاہدے بنانے اور SECP و ٹیکس قوانین کی پابندی میں مدد کرتا ہے۔",
    whenEn: ["You are starting a company or startup", "You need a contract drafted or reviewed", "You received a regulatory notice"],
    whenUr: ["کمپنی یا اسٹارٹ اپ شروع کر رہے ہوں", "معاہدہ بنوانا یا چیک کرانا ہو", "کسی ادارے کا نوٹس موصول ہوا ہو"],
  },
  "tax-law": {
    whoEn: "A tax lawyer deals with income tax, FBR notices, audits and appeals before the tax tribunals.",
    whoUr: "ٹیکس وکیل انکم ٹیکس، ایف بی آر نوٹس، آڈٹ اور ٹیکس ٹربیونل میں اپیل کے معاملات دیکھتا ہے۔",
    whenEn: ["You received an FBR notice or audit letter", "You want to appeal a tax assessment", "Your business needs tax planning"],
    whenUr: ["ایف بی آر کا نوٹس یا آڈٹ لیٹر ملا ہو", "ٹیکس کے تعین کے خلاف اپیل کرنی ہو", "کاروبار کے لیے ٹیکس پلاننگ چاہیے ہو"],
  },
  "immigration-law": {
    whoEn: "An immigration lawyer helps with visas, deportation defence, asylum and citizenship matters.",
    whoUr: "امیگریشن وکیل ویزا، ڈیپورٹیشن سے دفاع، پناہ اور شہریت کے معاملات میں مدد کرتا ہے۔",
    whenEn: ["Your visa application was refused", "You or a family member faces deportation", "You are applying for citizenship or residency abroad"],
    whenUr: ["ویزا کی درخواست مسترد ہوئی ہو", "آپ یا خاندان کے کسی فرد کو ڈیپورٹیشن کا سامنا ہو", "غیر ملک کی شہریت یا رہائش کے لیے درخواست دے رہے ہوں"],
  },
  "labour-law": {
    whoEn: "A labour lawyer fights wrongful termination, unpaid wages, and workplace harassment cases.",
    whoUr: "محنت کشوں کا وکیل غیر قانونی برطرفی، تنخواہ کی عدم ادائیگی اور ہراسانی کے مقدمات لڑتا ہے۔",
    whenEn: ["You were fired unfairly", "Your employer is not paying wages or benefits", "You face harassment at work"],
    whenUr: ["آپ کو ناحق نوکری سے نکالا گیا ہو", "آجر تنخواہ یا مراعات نہ دے رہا ہو", "کام کی جگہ ہراسانی کا سامنا ہو"],
  },
  "banking-finance": {
    whoEn: "A banking lawyer handles loan defaults, banking court cases, and disputes with banks and financial institutions.",
    whoUr: "بینکاری وکیل قرض کی نادہندگی، بینکنگ کورٹ کے مقدمات اور بینکوں سے تنازعات دیکھتا ہے۔",
    whenEn: ["A bank has filed a recovery suit against you", "Your account was frozen or marked defaulter", "You need advice before signing a loan agreement"],
    whenUr: ["بینک نے آپ کے خلاف ریکوری کا دعویٰ دائر کیا ہو", "آپ کا اکاؤنٹ منجمد یا ڈیفالٹر قرار دیا گیا ہو", "قرض کے معاہدے پر دستخط سے پہلے مشورہ چاہیے ہو"],
  },
  "constitutional-law": {
    whoEn: "A constitutional lawyer files writ petitions and defends fundamental rights in the High Courts and Supreme Court.",
    whoUr: "آئینی وکیل رٹ پٹیشن دائر کرتا ہے اور ہائی کورٹس و سپریم کورٹ میں بنیادی حقوق کا دفاع کرتا ہے۔",
    whenEn: ["A government authority acted against the law", "Your fundamental rights were violated", "You need a writ against an illegal order"],
    whenUr: ["کسی سرکاری ادارے نے قانون کے خلاف اقدام کیا ہو", "آپ کے بنیادی حقوق کی خلاف ورزی ہوئی ہو", "غیر قانونی حکم کے خلاف رٹ چاہیے ہو"],
  },
  "cybercrime-law": {
    whoEn: "A cybercrime lawyer handles online harassment, blackmail, fraud and PECA cases with FIA's cybercrime wing.",
    whoUr: "سائبر کرائم وکیل آن لائن ہراسانی، بلیک میلنگ، فراڈ اور PECA کے مقدمات FIA سائبر کرائم ونگ میں دیکھتا ہے۔",
    whenEn: ["Someone is harassing or blackmailing you online", "Your photos or data were shared without consent", "You lost money to online fraud"],
    whenUr: ["کوئی آپ کو آن لائن ہراساں یا بلیک میل کر رہا ہو", "آپ کی تصاویر یا ڈیٹا بغیر اجازت شیئر ہوا ہو", "آن لائن فراڈ میں رقم ضائع ہوئی ہو"],
  },
  "consumer-law": {
    whoEn: "A consumer protection lawyer files claims for faulty goods and services in consumer courts.",
    whoUr: "صارفین کے حقوق کا وکیل ناقص اشیا اور خدمات کے خلاف کنزیومر کورٹ میں دعویٰ دائر کرتا ہے۔",
    whenEn: ["You bought a faulty product the seller won't replace", "A service provider took your money and disappeared", "You want compensation for defective goods"],
    whenUr: ["ناقص چیز خریدی اور دکاندار واپس نہ کر رہا ہو", "سروس فراہم کرنے والا رقم لے کر غائب ہو گیا ہو", "ناقص اشیا کا ہرجانہ چاہیے ہو"],
  },
  arbitration: {
    whoEn: "An arbitration and mediation lawyer settles disputes out of court — faster and cheaper than a full trial.",
    whoUr: "ثالثی و مصالحت کا وکیل عدالت سے باہر تنازعات حل کراتا ہے — مکمل مقدمے سے تیز اور سستا۔",
    whenEn: ["Both sides want to avoid a long court case", "Your contract requires arbitration", "You want a private, confidential settlement"],
    whenUr: ["دونوں فریق طویل مقدمے سے بچنا چاہتے ہوں", "آپ کے معاہدے میں ثالثی لازمی ہو", "نجی اور خفیہ تصفیہ چاہیے ہو"],
  },
};

/** Min–max consultation fee currently listed for a practice area, or null. */
export function feeRangeForArea(areaSlug: string): string | null {
  const fees = LAWYERS.filter((l) => l.practiceAreaSlugs.includes(areaSlug)).map(
    (l) => l.consultationFeePaisa
  );
  if (fees.length === 0) return null;
  const min = Math.min(...fees);
  const max = Math.max(...fees);
  return min === max ? formatPKR(min) : `${formatPKR(min)} – ${formatPKR(max)}`;
}

export function areaGuide(area: PracticeArea): AreaGuide {
  return AREA_GUIDES[area.slug] ?? {
    whoEn: area.description,
    whoUr: area.nameUr,
    whenEn: ["You have a legal problem in this area"],
    whenUr: ["اس شعبے میں آپ کو قانونی مسئلہ ہو"],
  };
}
