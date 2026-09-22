// ============================================================
// wakeel.connect — /guides data (legal information articles)
// All articles are ORIGINAL, general legal information about
// Pakistan, written for this site. They are not legal advice.
// relatedAreaSlugs must be valid slugs from PRACTICE_AREAS.
// ============================================================

export interface Guide {
  slug: string;
  titleEn: string;
  titleUr: string;
  excerptEn: string;
  excerptUr: string;
  categoryEn: "Family" | "Criminal" | "Property" | "Digital";
  categoryUr: string;
  readMinutes: number;
  updatedAt: string;
  bodyEn: string[];
  bodyUr: string[];
  relatedAreaSlugs: string[];
}

/** Shown on every guide page — general information, not advice. */
export const GUIDE_DISCLAIMER_EN =
  "This article shares general information, not legal advice. For your case, consult a verified lawyer.";
export const GUIDE_DISCLAIMER_UR =
  "یہ مضمون عمومی معلومات ہے، قانونی مشورہ نہیں۔ اپنے کیس کے لیے تصدیق شدہ وکیل سے رابطہ کریں۔";

export const GUIDE_CATEGORIES = [
  { slug: "family", en: "Family", ur: "خاندان" },
  { slug: "criminal", en: "Criminal", ur: "فوجداری" },
  { slug: "property", en: "Property", ur: "جائیداد" },
  { slug: "digital", en: "Digital", ur: "ڈیجیٹل" },
] as const;

export const GUIDES: Guide[] = [
  {
    slug: "khula-process-pakistan",
    titleEn: "How Khula Works in Pakistan",
    titleUr: "پاکستان میں خلع کا طریقہ کار",
    excerptEn: "A simple guide to how a wife can end a marriage through court in Pakistan — steps, documents, and what to expect.",
    excerptUr: "پاکستان میں بیوی عدالت کے ذریعے نکاح کیسے ختم کر سکتی ہے — مراحل، دستاویزات اور توقعات کی سادہ رہنمائی۔",
    categoryEn: "Family",
    categoryUr: "خاندان",
    readMinutes: 6,
    updatedAt: "2026-09-20",
    relatedAreaSlugs: ["family-law"],
    bodyEn: [
      "Khula is the right of a wife in Pakistan to end her marriage through the court when she can no longer live with her husband. It is different from divorce given by the husband (talaq). With khula, the wife herself approaches the family court and asks the judge to dissolve the marriage.",
      "To start a khula case, the wife files a suit in the family court of the district where she lives. She will need her CNIC, the nikahnama (marriage certificate), and any evidence that supports her reasons — for example, that the marriage is unhappy or that there are serious problems between the couple. A lawyer drafts the plaint (the written case) and files it for her.",
      "After the case is filed, the court sends a notice to the husband and gives both sides a chance to speak. Pakistani family courts are required to try reconciliation first — the judge will ask both the husband and wife whether the marriage can be saved. If the wife clearly says she cannot continue, the court moves ahead with the case.",
      "During the hearing, the wife gives her statement and the court hears both sides. The judge also looks at the issue of haq mehr (dower). If the mehr has not yet been paid to the wife, the court often orders it to be paid when the khula decree is granted. If the wife received benefits she agreed to return, the court may mention that in its order too.",
      "When the court is satisfied, it passes a decree of dissolution of marriage. This decree is then sent to the Union Council, which issues a certificate of effectiveness of divorce after the required waiting period. The Union Council certificate is the final official proof that the marriage has ended, so do not forget to collect it.",
      "A common question is how long khula takes. Every case is different, but a straightforward khula case in the family court usually takes several months. If the husband contests the case strongly, it can take longer. Keeping your documents ready and attending every hearing helps the case move faster.",
      "Many women worry about what happens to their children during a khula case. Child custody is a separate matter in the eyes of the court — the mother or father can file a separate custody application, and the judge decides based on what is best for the child, not on who filed for khula.",
    ],
    bodyUr: [
      "خلع بیوی کا وہ حق ہے جس کے ذریعے وہ عدالت سے نکاح ختم کرا سکتی ہے جب وہ شوہر کے ساتھ مزید نہ رہ سکے۔ خلع کا مقدمہ فیملی کورٹ میں دائر کیا جاتا ہے، جہاں بیوی کو اپنا شناختی کارڈ، نکاح نامہ اور اپنے مؤقف کے ثبوت پیش کرنے ہوتے ہیں۔",
      "مقدمہ دائر ہونے کے بعد عدالت شوہر کو نوٹس بھیجتی ہے اور دونوں فریقوں کو بات کرنے کا موقع دیتی ہے۔ پہلے عدالت صلح کی کوشش کرتی ہے، اور اگر بیوی واضح طور پر کہے کہ وہ ساتھ نہیں رہ سکتی تو عدالت کارروائی آگے بڑھاتی ہے۔",
      "عدالت حق مہر کے معاملے کو بھی دیکھتی ہے۔ اگر مہر ابھی ادا نہیں ہوا تو خلع کی ڈگری کے ساتھ اس کی ادائیگی کا حکم بھی دیا جا سکتا ہے۔ ڈگری کے بعد یونین کونسل سے طلاق مؤثر ہونے کا سرٹیفکیٹ لینا نہ بھولیں، یہی حتمی سرکاری ثبوت ہے۔",
      "بچوں کی تحویل خلع سے الگ معاملہ ہے — عدالت بچے کے بہترین مفاد کو دیکھ کر فیصلہ کرتی ہے۔ اپنے کیس کی صحیح رہنمائی کے لیے کسی تجربہ کار وکیل سے مشورہ ضرور کریں۔",
    ],
  },
  {
    slug: "fir-kaise-darj-karain",
    titleEn: "How to File an FIR in Pakistan",
    titleUr: "پاکستان میں ایف آئی آر کیسے درج کرائیں",
    excerptEn: "What an FIR is, which police station to visit, what to write in your application, and what to do if the police refuse.",
    excerptUr: "ایف آئی آر کیا ہے، کس تھانے جائیں، درخواست میں کیا لکھیں، اور اگر پولیس انکار کرے تو کیا کریں۔",
    categoryEn: "Criminal",
    categoryUr: "فوجداری",
    readMinutes: 5,
    updatedAt: "2026-09-20",
    relatedAreaSlugs: ["criminal-law"],
    bodyEn: [
      "An FIR (First Information Report) is the written record of a crime reported to the police. It is the first and most important step in a criminal case — without an FIR, the police cannot officially start investigating. Crimes like theft, robbery, assault, fraud and harassment are all reported through an FIR.",
      "You should go to the police station whose area covers the place where the crime happened. For example, if your mobile was snatched in a market, report it at the police station responsible for that market. Take your CNIC with you, and if you have any evidence — photos, videos, receipts, or witness names — take those too.",
      "Write a simple, clear application in your own words. Mention the date, time and place of the incident, what exactly happened, and the names or descriptions of the people involved if you know them. Keep the language simple and stick to the facts — there is no need for difficult legal words.",
      "When you hand the application to the duty officer, read the FIR carefully before signing it. Make sure the facts, names, dates and times are written correctly. You have the right to get a free copy of the FIR — always take your copy and keep it safe, because you will need its number for every future step of the case.",
      "Sometimes the police refuse to register an FIR or delay the matter. If that happens, you can approach a senior police officer, such as the SHO of the station or the DSP/SP of the area, with a written complaint. You can also file an application before the Justice of Peace (usually a sessions judge) asking the court to order the police to register the FIR.",
      "After the FIR is registered, the investigation begins. The investigating officer may call you for your statement or to identify suspects. Cooperate with the investigation, keep copies of every document, and note down the name and contact of the investigating officer. If you feel the investigation is unfair, a criminal lawyer can guide you on your legal options.",
    ],
    bodyUr: [
      "ایف آئی آر (فرسٹ انفارمیشن رپورٹ) پولیس کو جرم کی اطلاع کا تحریری ریکارڈ ہے۔ یہ فوجداری کیس کا پہلا اور سب سے اہم مرحلہ ہے — اس کے بغیر پولیس باضابطہ تفتیش شروع نہیں کر سکتی۔ چوری، ڈکیتی، مار پیٹ اور دھوکہ دہی جیسے جرائم کی اطلاع ایف آئی آر کے ذریعے دی جاتی ہے۔",
      "آپ کو اس تھانے جانا چاہیے جس کے علاقے میں جرم ہوا ہو۔ اپنا شناختی کارڈ ساتھ لے جائیں اور سادہ الفاظ میں درخواست لکھیں جس میں تاریخ، وقت، جگہ اور واقعے کی تفصیل ہو۔ دستخط کرنے سے پہلے ایف آئی آر غور سے پڑھیں اور اس کی مفت کاپی ضرور لیں۔",
      "اگر پولیس ایف آئی آر درج کرنے سے انکار کرے تو آپ ایس ایچ او یا ڈی ایس پی/ایس پی کو تحریری شکایت دے سکتے ہیں، یا جسٹس آف پیس (سیشن جج) کے پاس درخواست دائر کر کے پولیس کو ایف آئی آر درج کرنے کا حکم دلوا سکتے ہیں۔",
      "تفتیش کے دوران تفتیشی افسر سے تعاون کریں، ہر دستاویز کی کاپی سنبھال کر رکھیں۔ اگر آپ کو لگے کہ تفتیش غیر منصفانہ ہے تو فوجداری وکیل سے رہنمائی لیں۔",
    ],
  },
  {
    slug: "property-registry-transfer-pakistan",
    titleEn: "Property Registry & Transfer Guide",
    titleUr: "جائیداد کی رجسٹری اور منتقلی",
    excerptEn: "How property ownership is legally transferred in Pakistan — registry, mutation, and the documents that protect your money.",
    excerptUr: "پاکستان میں جائیداد کی ملکیت قانونی طور پر کیسے منتقل ہوتی ہے — رجسٹری، انتقال اور آپ کے پیسے کی حفاظت کرنے والی دستاویزات۔",
    categoryEn: "Property",
    categoryUr: "جائیداد",
    readMinutes: 7,
    updatedAt: "2026-09-20",
    relatedAreaSlugs: ["property-law"],
    bodyEn: [
      "Buying property in Pakistan is a big investment, and the transfer of ownership must be done properly to protect your money. Ownership of most urban property is transferred through a registered sale deed (registry) at the office of the sub-registrar, followed by mutation (intiqal) in the land revenue record.",
      "Before you pay anything, verify the title of the property. Ask the seller for the fard (ownership record), check it against the land record authority's online record where available, and confirm that the person selling is the real owner. Also check whether there is any loan, court case or stay order on the property. A title check by a lawyer before buying can save you from years of trouble.",
      "Once the title is clear, the buyer and seller agree on the price and usually sign a bayana (token/advance agreement). The bayana receipt should mention the total price, the advance paid, and the date by which the final registry will be done. Never pay a large advance without a written agreement signed by both sides.",
      "The registry itself is done before the sub-registrar. Both parties appear with their CNICs, two witnesses, and the draft sale deed prepared by a deed writer or lawyer. Government taxes and stamp duty are paid at this stage — the exact rates depend on the property's location and government valuation. After registration, you receive the registered sale deed, which is your main proof of ownership.",
      "After the registry, get the mutation (intiqal) entered in the revenue record so that the property appears in your name in official records. In housing societies, you must also get the transfer done in the society's own record and obtain a transfer letter. Keep every document — sale deed, mutation, tax receipts — in a safe file.",
      "Fraud in property deals is common: double selling, fake ownership documents, and land under dispute. Red flags include a seller who refuses to show original documents, pressure to pay in cash without receipts, or a price far below the market rate. If anything feels wrong, stop and get a lawyer to verify the documents before you pay.",
      "Remember that registry laws, tax rates and procedures can differ between provinces and between city areas and housing societies. This guide explains the general process, but for your specific property, a property lawyer in your city can confirm the exact steps and costs.",
    ],
    bodyUr: [
      "پاکستان میں جائیداد خریدنا بڑی سرمایہ کاری ہے، اور ملکیت کی منتقلی درست طریقے سے ہونی چاہیے۔ زیادہ تر شہری جائیداد کی منتقلی سب رجسٹرار کے دفتر میں رجسٹرڈ سیل ڈیڈ (رجسٹری) کے ذریعے ہوتی ہے، اس کے بعد ریونیو ریکارڈ میں انتقال درج کرایا جاتا ہے۔",
      "پیسے دینے سے پہلے جائیداد کی ملکیت کی تصدیق کریں۔ بیچنے والے سے فرد مانگیں، لینڈ ریکارڈ سے ملائیں، اور دیکھیں کہ جائیداد پر کوئی قرض، مقدمہ یا اسٹے تو نہیں۔ خریدنے سے پہلے وکیل سے ٹائٹل چیک کرانا آپ کو برسوں کی پریشانی سے بچا سکتا ہے۔",
      "رجسٹری سب رجسٹرار کے سامنے ہوتی ہے جہاں دونوں فریق شناختی کارڈ اور گواہوں کے ساتھ پیش ہوتے ہیں، اور سرکاری ٹیکس و اسٹامپ ڈیوٹی ادا کی جاتی ہے۔ رجسٹری کے بعد ریونیو ریکارڈ میں انتقال اور سوسائٹی میں ٹرانسفر ضرور کرائیں۔",
      "جائیداد کے لین دین میں دھوکہ عام ہے — اصل کاغذات نہ دکھانا، رسید کے بغیر نقد رقم کا دباؤ، یا مارکیٹ سے بہت کم قیمت خطرے کی علامتیں ہیں۔ ہر صوبے اور سوسائٹی کے طریقے میں فرق ہو سکتا ہے، اس لیے اپنے شہر کے جائیداد کے وکیل سے مشورہ کریں۔",
    ],
  },
  {
    slug: "tenant-rights-pakistan",
    titleEn: "Tenant Rights in Pakistan",
    titleUr: "پاکستان میں کرایہ دار کے حقوق",
    excerptEn: "What every tenant should know — rent agreements, security deposits, eviction rules, and how rent disputes are handled.",
    excerptUr: "ہر کرایہ دار کو کیا معلوم ہونا چاہیے — کرایہ نامہ، سیکیورٹی ڈپازٹ، بے دخلی کے اصول اور کرائے کے تنازعات کا حل۔",
    categoryEn: "Property",
    categoryUr: "جائیداد",
    readMinutes: 5,
    updatedAt: "2026-09-20",
    relatedAreaSlugs: ["property-law"],
    bodyEn: [
      "Millions of Pakistanis live in rented homes, and the rent agreement is the most important document for a tenant. A proper rent agreement should be in writing and mention the monthly rent, the security deposit, the duration of tenancy, who pays for repairs, and the notice period for ending the tenancy. A verbal agreement is much harder to prove if a dispute arises.",
      "Your security deposit is your money. The landlord can only deduct from it for genuine reasons written in the agreement — such as unpaid rent or damage beyond normal wear and tear. Always pay rent through a traceable method like a bank transfer or cheque, and keep the receipts. Cash payments without receipts are a common cause of disputes.",
      "A landlord cannot simply throw you out or lock the house. In Pakistan, eviction of a tenant generally requires an order from the rent controller (the relevant court or tribunal in your province). The landlord must give proper notice and follow the legal process. Changing locks, cutting water or electricity, or throwing out your belongings to force you to leave is not the legal way.",
      "Rent increases must follow the terms of your agreement. If the agreement says rent can increase by a certain amount each year, that is what applies. A sudden, unfair increase in the middle of the agreement period can be challenged. Similarly, the landlord is usually responsible for major structural repairs, while the tenant handles minor day-to-day maintenance — your agreement should make this clear.",
      "If a dispute arises — over eviction, deposit refund, or repairs — try to resolve it in writing first, keeping copies of all messages. If that fails, either side can approach the rent controller in their district. Having your written agreement, rent receipts and photos of the property's condition will make your case much stronger.",
      "Before signing any rent agreement, read it fully and do not sign blank pages. If any clause seems unfair — for example, a very short notice period or an unusually large deposit — discuss it with the landlord or get a lawyer to review the agreement. A small fee for a legal review is far cheaper than a big dispute later.",
    ],
    bodyUr: [
      "پاکستان میں لاکھوں لوگ کرائے کے گھروں میں رہتے ہیں، اور کرایہ نامہ کرایہ دار کی سب سے اہم دستاویز ہے۔ اس میں ماہانہ کرایہ، سیکیورٹی ڈپازٹ، کرائے کی مدت، مرمت کی ذمہ داری اور نوٹس کی مدت تحریری طور پر درج ہونی چاہیے۔",
      "مالک مکان آپ کو زبردستی نہیں نکال سکتا — بے دخلی کے لیے عام طور پر رینٹ کنٹرولر (عدالت) کے حکم کی ضرورت ہوتی ہے۔ تالے بدلنا، بجلی پانی بند کرنا یا سامان باہر پھینکنا قانونی طریقہ نہیں۔ کرایہ ہمیشہ بینک یا چیک سے دیں اور رسیدیں سنبھال کر رکھیں۔",
      "تنازع کی صورت میں پہلے تحریری طور پر حل کی کوشش کریں، اور اگر بات نہ بنے تو ضلع کے رینٹ کنٹرولر سے رجوع کیا جا سکتا ہے۔ کرایہ نامہ پر دستخط سے پہلے اسے مکمل پڑھیں، اور اگر کوئی شق غیر منصفانہ لگے تو وکیل سے جائزہ کرائیں۔",
    ],
  },
  {
    slug: "nikahnama-key-clauses",
    titleEn: "Nikahnama: Key Clauses to Know",
    titleUr: "نکاح نامہ کی اہم شقیں",
    excerptEn: "The nikahnama is more than a formality — understand haq mehr, special conditions, and why every column matters before you sign.",
    excerptUr: "نکاح نامہ صرف رسمی دستاویز نہیں — حق مہر، خصوصی شرائط اور دستخط سے پہلے ہر کالم کی اہمیت کو سمجھیں۔",
    categoryEn: "Family",
    categoryUr: "خاندان",
    readMinutes: 5,
    updatedAt: "2026-09-20",
    relatedAreaSlugs: ["family-law"],
    bodyEn: [
      "The nikahnama is the official marriage contract in Pakistan, and it is a legal document — not just a formality. Once signed and registered, its clauses decide important rights of both the husband and the wife. Reading and understanding it before signing is one of the most important things a couple and their families can do.",
      "Haq mehr (dower) is the amount or property that the husband gives or promises to the wife as part of the marriage. The nikahnama records how much the mehr is and whether it is paid immediately (muajjal) or deferred (ghair muajjal). If the marriage ends, an unpaid mehr becomes the wife's legal right, so this clause should be filled carefully and honestly.",
      "One of the most important clauses is the one about the wife's right to divorce (talaq-e-tafweez). If the families agree, this clause can give the wife the delegated right to end the marriage herself. Many nikahnamas leave this column crossed out or blank without discussion — families should talk about it openly before the nikah.",
      "The nikahnama also has a column for special conditions. This is where the couple can write any agreed terms — for example, that the wife will be allowed to continue her education or work, or where the couple will live. Anything written here becomes part of the contract, so use this column instead of relying on verbal promises.",
      "Make sure every column is filled properly and nothing important is left blank or crossed out carelessly. Both parties should get their own attested copy of the nikahnama after registration and keep it safe — you will need it for khula, divorce, visa, and inheritance matters later.",
      "If there is any confusion about a clause, ask the nikah khawan to explain it before signing, or consult a family lawyer. A few minutes of clarity on the wedding day can prevent years of legal disputes later.",
    ],
    bodyUr: [
      "نکاح نامہ پاکستان میں شادی کا سرکاری معاہدہ ہے، اور یہ ایک قانونی دستاویز ہے — محض رسم نہیں۔ دستخط اور رجسٹریشن کے بعد اس کی شقیں میاں بیوی دونوں کے اہم حقوق طے کرتی ہیں۔ دستخط سے پہلے اسے پڑھنا اور سمجھنا بہت ضروری ہے۔",
      "حق مہر وہ رقم یا جائیداد ہے جو شوہر بیوی کو دیتا ہے یا دینے کا وعدہ کرتا ہے۔ نکاح نامہ میں مہر کی رقم اور یہ درج ہوتا ہے کہ وہ فوری ہے یا مؤخر۔ طلاقِ تفویض کی شق بیوی کو خود نکاح ختم کرنے کا حق دے سکتی ہے — اس پر شادی سے پہلے کھل کر بات ہونی چاہیے۔",
      "خصوصی شرائط کے کالم میں طے شدہ باتیں لکھوائیں، مثلاً بیوی کی تعلیم یا ملازمت جاری رکھنے کی اجازت۔ ہر کالم درست پر کریں، رجسٹریشن کے بعد اپنی تصدیق شدہ کاپی ضرور لیں اور سنبھال کر رکھیں۔ کسی شق میں الجھن ہو تو نکاح خواں سے وضاحت لیں یا فیملی وکیل سے مشورہ کریں۔",
    ],
  },
  {
    slug: "cybercrime-complaint-fia",
    titleEn: "Reporting Cybercrime to FIA",
    titleUr: "ایف آئی اے میں سائبر کرائم کی شکایت",
    excerptEn: "Online harassment, fake accounts, blackmail and fraud — how to file a cybercrime complaint with the FIA Cybercrime Wing.",
    excerptUr: "آن لائن ہراسانی، جعلی اکاؤنٹس، بلیک میلنگ اور فراڈ — ایف آئی اے سائبر کرائم ونگ میں شکایت کیسے درج کرائیں۔",
    categoryEn: "Digital",
    categoryUr: "ڈیجیٹل",
    readMinutes: 5,
    updatedAt: "2026-09-20",
    relatedAreaSlugs: ["cybercrime-law"],
    bodyEn: [
      "Cybercrime in Pakistan — online harassment, blackmail with private photos, fake social media accounts, and online fraud — is handled by the FIA Cybercrime Wing under the PECA law (Prevention of Electronic Crimes Act). You do not have to suffer in silence; there is a proper legal channel for these complaints.",
      "The first step is to preserve evidence. Take screenshots of the harassing messages, fake profiles, or fraudulent posts, including the profile links, dates and times. Do not delete the messages, and do not engage further with the harasser — arguing with them often makes things worse and can damage your case.",
      "You can file a complaint with the FIA Cybercrime Wing by visiting your nearest FIA cybercrime reporting centre or using their official online complaint portal. Write your complaint clearly: who you are, what happened, when it started, and the links or screenshots of the evidence. Keep a copy of your complaint and note down the complaint number you receive.",
      "After you file the complaint, the FIA may call you to record your statement or ask for more evidence. Cooperate fully and share only what is relevant. If the harassment involves threats or blackmail, tell the FIA officer clearly — urgent threats are taken seriously.",
      "Online financial fraud — fake investment schemes, prize scams, or someone tricking you into sending money — should also be reported to the FIA, and to your bank immediately so the transaction can be flagged. Never share your bank OTPs or passwords with anyone, no matter who they claim to be.",
      "Many victims, especially women, hesitate to report because of shame or fear. Remember that the law protects complainants, and FIA officers deal with such cases every day. If you are unsure how to write the complaint or what will happen next, a cybercrime lawyer can guide you through the process confidentially.",
    ],
    bodyUr: [
      "پاکستان میں سائبر کرائم — آن لائن ہراسانی، نجی تصاویر سے بلیک میلنگ، جعلی اکاؤنٹس اور آن لائن فراڈ — کی شکایت ایف آئی اے سائبر کرائم ونگ میں پیکا قانون کے تحت درج ہوتی ہے۔ آپ کو خاموش رہنے کی ضرورت نہیں، اس کے لیے باقاعدہ قانونی راستہ موجود ہے۔",
      "پہلا قدم ثبوت محفوظ کرنا ہے۔ ہراساں کرنے والے پیغامات، جعلی پروفائلز اور فراڈ پوسٹس کے اسکرین شاٹس لیں جن میں لنک، تاریخ اور وقت نظر آئے۔ پیغامات ڈیلیٹ نہ کریں اور ہراساں کرنے والے سے بحث نہ کریں۔",
      "آپ قریبی ایف آئی اے سائبر کرائم رپورٹنگ سینٹر جا کر یا ان کے سرکاری آن لائن پورٹل سے شکایت درج کرا سکتے ہیں۔ شکایت میں واضح لکھیں کہ کیا ہوا، کب شروع ہوا، اور ثبوت کے لنک منسلک کریں۔ شکایت نمبر نوٹ کر کے رکھیں۔",
      "آن لائن مالی فراڈ کی صورت میں فوراً اپنے بینک کو بھی اطلاع دیں۔ کبھی اپنا بینک او ٹی پی یا پاس ورڈ کسی کو نہ بتائیں۔ بہت سے متاثرین شرم یا ڈر کی وجہ سے رپورٹ نہیں کرتے — یاد رکھیں قانون شکایت کنندہ کا تحفظ کرتا ہے، اور سائبر کرائم وکیل خفیہ رہنمائی دے سکتا ہے۔",
    ],
  },
  {
    slug: "bail-process-pakistan",
    titleEn: "How Bail Works in Pakistan",
    titleUr: "پاکستان میں ضمانت کا طریقہ",
    excerptEn: "Arrested or fearing arrest? Understand pre-arrest and post-arrest bail, surety, and what the court looks at.",
    excerptUr: "گرفتار ہیں یا گرفتاری کا خدشہ؟ ضمانت قبل از گرفتاری اور بعد از گرفتاری، ضمانتی اور عدالت کن باتوں کو دیکھتی ہے — جانیں۔",
    categoryEn: "Criminal",
    categoryUr: "فوجداری",
    readMinutes: 6,
    updatedAt: "2026-09-20",
    relatedAreaSlugs: ["criminal-law"],
    bodyEn: [
      "Bail means the court allows an accused person to remain free (or be released from custody) while their case continues, in exchange for a guarantee that they will appear for trial. Bail is not a declaration of innocence — it is a temporary relief so that a person is not punished by long imprisonment before their case is even decided.",
      "There are two main types of bail. Pre-arrest bail (often called protective or anticipatory bail) is sought when a person fears they will be arrested — the court can grant bail before the arrest happens. Post-arrest bail is sought after the person has already been arrested and is in police or judicial custody.",
      "To get bail, a lawyer files a bail petition before the relevant court — usually the sessions court or the high court, depending on the case. The petition explains the facts, why the accused deserves bail, and offers surety. The court then hears both the accused's lawyer and the prosecution before deciding.",
      "The court looks at several things: how serious the offence is, what evidence exists so far, whether the accused is likely to run away or interfere with witnesses, and how long the trial is expected to take. For less serious offences, bail is often granted more easily; for very serious offences, the court examines the case more strictly.",
      "Surety is the guarantee the court takes. It can be a cash amount deposited with the court or a person (a surety) who promises to pay a fixed amount if the accused does not appear. The surety amount is fixed by the judge. If the accused attends all hearings, the surety is returned or released at the end of the case.",
      "If bail is granted, the accused must follow the conditions set by the court — usually, to appear at every hearing and not to leave the area without permission. Missing hearings without a good reason can lead to cancellation of bail and re-arrest. Always keep in close contact with your lawyer about hearing dates.",
      "If bail is refused by one court, the order can usually be challenged in a higher court. Bail matters move fast and depend heavily on how the petition is argued, so getting an experienced criminal lawyer quickly is the single most important step.",
    ],
    bodyUr: [
      "ضمانت کا مطلب ہے کہ عدالت ملزم کو مقدمے کے دوران آزاد رہنے (یا حراست سے رہا ہونے) کی اجازت دیتی ہے، اس ضمانت پر کہ وہ ٹرائل میں پیش ہوگا۔ ضمانت بے گناہی کا اعلان نہیں — یہ عارضی ریلیف ہے تاکہ فیصلے سے پہلے طویل قید کی سزا نہ ملے۔",
      "ضمانت کی دو اہم قسمیں ہیں: گرفتاری سے پہلے کی ضمانت (جب گرفتاری کا خدشہ ہو) اور گرفتاری کے بعد کی ضمانت۔ وکیل متعلقہ عدالت میں ضمانت کی درخواست دائر کرتا ہے جس میں حقائق، ضمانت کے اسباب اور ضمانتی کی پیشکش ہوتی ہے۔",
      "عدالت جرم کی سنگینی، اب تک کے شواہد، ملزم کے فرار یا گواہوں پر اثر انداز ہونے کے امکان کو دیکھتی ہے۔ ضمانتی رقم جج طے کرتا ہے، اور تمام پیشیوں پر حاضری کی صورت میں یہ واپس مل جاتی ہے۔",
      "ضمانت ملنے پر عدالت کی شرائط پر عمل کریں — ہر پیشی پر حاضر ہوں۔ بغیر وجہ پیشی چھوڑنے پر ضمانت منسوخ ہو سکتی ہے۔ ضمانت کے معاملات تیزی سے چلتے ہیں، اس لیے تجربہ کار فوجداری وکیل سے جلد رابطہ سب سے اہم قدم ہے۔",
    ],
  },
  {
    slug: "child-custody-basics",
    titleEn: "Child Custody Basics in Pakistan",
    titleUr: "پاکستان میں بچوں کی تحویل کے بنیادی اصول",
    excerptEn: "Who gets custody after separation, what 'best interest of the child' means, visitation schedules, and maintenance.",
    excerptUr: "علیحدگی کے بعد بچہ کس کے پاس رہے گا، 'بچے کا بہترین مفاد' کا کیا مطلب ہے، ملاقات کا شیڈول اور نان نفقہ۔",
    categoryEn: "Family",
    categoryUr: "خاندان",
    readMinutes: 6,
    updatedAt: "2026-09-20",
    relatedAreaSlugs: ["family-law"],
    bodyEn: [
      "When parents separate in Pakistan, the question of who the children will live with is decided by the family court (guardian court). The single most important rule the court follows is the welfare and best interest of the child — not the wishes or rights of the parents. Every custody decision is measured against what is best for the child.",
      "In practice, courts in Pakistan generally prefer that very young children stay with their mother, because the law recognises the mother's natural role in early care. As children grow older, the court listens more carefully to the circumstances of both parents. There is no fixed age written in stone — each case is decided on its own facts.",
      "The parent who does not get custody is usually given a visitation schedule — fixed days and times to meet the child. This schedule is part of the court order and must be followed. Stopping the other parent from meeting the child without a court order can harm your own case, so always follow the schedule the court sets.",
      "Custody and maintenance are separate issues. The father is generally responsible for the financial maintenance (nan nafqah) of the children — their food, clothing, education and medical care — regardless of who has custody. The court can fix a monthly maintenance amount based on the father's income, and this can be claimed in a separate application.",
      "To file for custody, a parent approaches the guardian/family court in the district where the child lives. The application explains why custody should be given, and the court may also speak to the child if they are old enough to express a preference. Keep school records, medical records and any proof of your involvement in the child's life — these help the court see the full picture.",
      "Custody orders are not always permanent. If circumstances change significantly — for example, if a parent moves away, remarries in a way that affects the child, or neglects the child — either parent can ask the court to review the arrangement. The court will again ask one question: what is best for the child now?",
      "Custody disputes are emotionally difficult for everyone, especially the children. Avoid using children against the other parent, keep them out of courtroom conflict as much as possible, and get a family lawyer who will protect both your rights and your child's wellbeing.",
    ],
    bodyUr: [
      "پاکستان میں والدین کی علیحدگی پر بچے کس کے پاس رہیں گے، اس کا فیصلہ فیملی کورٹ (گارڈین کورٹ) کرتی ہے۔ عدالت کا سب سے اہم اصول بچے کی فلاح اور بہترین مفاد ہے — والدین کی خواہشات نہیں۔ ہر فیصلہ اسی پیمانے پر ہوتا ہے۔",
      "عام طور پر عدالتیں بہت چھوٹے بچوں کی تحویل ماں کو دینا پسند کرتی ہیں۔ جس والدین کو تحویل نہیں ملتی، اسے بچے سے ملاقات کا شیڈول دیا جاتا ہے جس پر عمل لازم ہے۔ تحویل اور نان نفقہ الگ معاملات ہیں — بچوں کے اخراجات کی ذمہ داری عام طور پر والد پر ہوتی ہے چاہے تحویل کسی کے پاس ہو۔",
      "تحویل کے لیے اس ضلع کی فیملی کورٹ سے رجوع کیا جاتا ہے جہاں بچہ رہتا ہے۔ اسکول اور طبی ریکارڈ اور بچے کی دیکھ بھال میں آپ کے کردار کے ثبوت سنبھال کر رکھیں۔ حالات بدلنے پر عدالت تحویل کے انتظام پر نظرثانی بھی کر سکتی ہے۔",
      "بچوں کو دوسرے والدین کے خلاف استعمال نہ کریں اور انہیں عدالتی تنازع سے دور رکھیں۔ اپنے حقوق اور بچے کی فلاح دونوں کے تحفظ کے لیے فیملی وکیل سے مشورہ کریں۔",
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

export function guidesByCategory(cat: string): Guide[] {
  if (!cat || cat === "all") return GUIDES;
  return GUIDES.filter((g) => g.categoryEn.toLowerCase() === cat.toLowerCase());
}
