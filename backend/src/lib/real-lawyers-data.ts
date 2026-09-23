// Real lawyer profiles extracted from frontend/lib/data.ts (21 non-demo).
// Regenerate: see the extract step in git history. Do not hand-edit.
export interface RealLawyerEntry {
  slug: string; displayName: string; headline: string; bio: string; bioUrdu: string;
  gender: "male" | "female"; citySlug: string; courts: string[]; barCouncil: string;
  practiceAreaSlugs: string[]; langCodes: string[]; chamberName: string; chamberAddress: string;
  education: { degree: string; institution: string; year: number | null }[];
}

export const REAL_LAWYERS_DATA: RealLawyerEntry[] = [
  {
    "slug": "shamsuddin-rajper",
    "displayName": "Mr. Shamsuddin Rajper",
    "headline": "Founder & Senior Advocate · Deputy Attorney General for Pakistan",
    "bio": "Founder and Senior Advocate at Karachi Legal House, Karachi. M.Com, LL.B. Deputy Attorney General for Pakistan (Sindh High Court, Hyderabad Circuit Bench, 2023–present); former Assistant Prosecutor General of Sindh (2008) and former Vice President of the Sindh High Court Bar Association, Sukkur (2019–2020). 24+ years of courtroom practice since founding the chamber in 2002.",
    "bioUrdu": "کراچی لیگل ہاؤس کے بانی اور سینئر ایڈووکیٹ۔ ایم کام، ایل ایل بی۔ ڈپٹی اٹارنی جنرل پاکستان (سندھ ہائی کورٹ، حیدرآباد سرکٹ بینچ)؛ سابق اسسٹنٹ پراسیکیوٹر جنرل سندھ اور سابق نائب صدر سندھ ہائی کورٹ بار ایسوسی ایشن سکھر۔ 2002 سے 24 سال سے زائد عدالتی تجربہ۔",
    "gender": "male",
    "citySlug": "karachi",
    "courts": [
      "Sindh High Court",
      "Supreme Court of Pakistan"
    ],
    "barCouncil": "Sindh Bar Council",
    "practiceAreaSlugs": [
      "constitutional-law",
      "criminal-law"
    ],
    "langCodes": [
      "ur",
      "en",
      "sd"
    ],
    "chamberName": "Karachi Legal House",
    "chamberAddress": "DHA Phase 2, Karachi",
    "education": [
      {
        "degree": "M.Com",
        "institution": "",
        "year": 0
      },
      {
        "degree": "LL.B",
        "institution": "",
        "year": 0
      }
    ]
  },
  {
    "slug": "fayazuddin-rajper",
    "displayName": "Mr. Fayazuddin Rajper",
    "headline": "Managing Partner & Advocate High Court · Corporate Advisory Lead",
    "bio": "Managing Partner and Advocate of the High Court at Karachi Legal House. The founder's elder son, he took charge of the chamber's affairs in 2016 and built its diversified litigation and advisory practice from the Karachi office.",
    "bioUrdu": "کراچی لیگل ہاؤس میں مینیجنگ پارٹنر اور ایڈووکیٹ ہائی کورٹ۔ بانی کے بڑے صاحبزادے — 2016 سے چیمبر کے امور سنبھالے ہوئے ہیں اور کراچی آفس سے لٹیگیشن و ایڈوائزری پریکٹس کو وسعت دی۔",
    "gender": "male",
    "citySlug": "karachi",
    "courts": [
      "Sindh High Court",
      "District Courts Karachi"
    ],
    "barCouncil": "Sindh Bar Council",
    "practiceAreaSlugs": [
      "corporate-law",
      "tax-law"
    ],
    "langCodes": [
      "ur",
      "en"
    ],
    "chamberName": "Karachi Legal House",
    "chamberAddress": "DHA Phase 2, Karachi",
    "education": [
      {
        "degree": "LL.M. in Corporate Law",
        "institution": "",
        "year": 0
      }
    ]
  },
  {
    "slug": "jahangir-shams",
    "displayName": "Mr. Jahangir Shams",
    "headline": "Managing Partner & Advocate High Court · Head of Karachi Office",
    "bio": "Managing Partner and Advocate of the High Court at Karachi Legal House. He joined the chamber's leadership in 2016 alongside his brother, building the firm's litigation and advisory practice from the Karachi head office.",
    "bioUrdu": "کراچی لیگل ہاؤس میں مینیجنگ پارٹنر اور ایڈووکیٹ ہائی کورٹ۔ 2016 میں اپنے بھائی کے ہمراہ چیمبر کی قیادت میں شامل ہوئے اور کراچی ہیڈ آفس سے فرم کی پریکٹس کو آگے بڑھایا۔",
    "gender": "male",
    "citySlug": "karachi",
    "courts": [
      "Sindh High Court",
      "City Courts Karachi"
    ],
    "barCouncil": "Sindh Bar Council",
    "practiceAreaSlugs": [
      "corporate-law",
      "property-law"
    ],
    "langCodes": [
      "ur",
      "en"
    ],
    "chamberName": "Karachi Legal House",
    "chamberAddress": "DHA Phase 2, Karachi",
    "education": [
      {
        "degree": "LL.B. (Hons)",
        "institution": "",
        "year": 0
      }
    ]
  },
  {
    "slug": "raheem-dad-shujrah",
    "displayName": "Mr. Raheem Dad Shujrah",
    "headline": "Senior Associate & Advocate High Court · Corporate & Banking Law",
    "bio": "Senior Associate and Advocate of the High Courts of Pakistan at Shams Law Chamber / Karachi Legal House. Joined the chamber in 2024 with a BBA and an LL.B (Hons.) from the University of London, bridging corporate insight with courtroom proficiency across civil, corporate, banking and constitutional litigation.",
    "bioUrdu": "شمس لا چیمبر / کراچی لیگل ہاؤس میں سینئر ایسوسی ایٹ اور ایڈووکیٹ ہائی کورٹ۔ 2024 میں چیمبر میں شامل ہوئے — بی بی اے اور یونیورسٹی آف لندن سے ایل ایل بی (آنرز)، سول، کارپوریٹ، بینکاری اور آئینی مقدمات میں مہارت۔",
    "gender": "male",
    "citySlug": "karachi",
    "courts": [
      "Sindh High Court",
      "City Courts Karachi"
    ],
    "barCouncil": "Sindh Bar Council",
    "practiceAreaSlugs": [
      "corporate-law",
      "banking-finance"
    ],
    "langCodes": [
      "ur",
      "en",
      "sd"
    ],
    "chamberName": "Karachi Legal House",
    "chamberAddress": "DHA Phase 2, Karachi",
    "education": [
      {
        "degree": "BBA",
        "institution": "",
        "year": 0
      },
      {
        "degree": "LL.B. (Hons.), University of London",
        "institution": "University of London",
        "year": 0
      }
    ]
  },
  {
    "slug": "safia-shams",
    "displayName": "Mrs. Safia Shams",
    "headline": "Senior Associate & Advocate High Court · Family & Civil Law",
    "bio": "Senior Associate and Advocate of the High Courts of Pakistan. MA, LL.B. Former Assistant Registrar at the Office of the Ombudsman (Sindh) and former Visiting Faculty at Shah Abdul Latif University, Khairpur — bringing institutional and academic perspective to administrative, family and civil matters.",
    "bioUrdu": "سینئر ایسوسی ایٹ اور ایڈووکیٹ ہائی کورٹس پاکستان۔ ایم اے، ایل ایل بی۔ سابق اسسٹنٹ رجسٹرار دفتر محتسب سندھ اور سابق وزیٹنگ فیکلٹی شاہ عبداللطیف یونیورسٹی خیرپور۔ انتظامی، خاندانی اور دیوانی مقدمات میں مہارت۔",
    "gender": "female",
    "citySlug": "karachi",
    "courts": [
      "Sindh High Court",
      "City Courts Karachi"
    ],
    "barCouncil": "Sindh Bar Council",
    "practiceAreaSlugs": [
      "family-law",
      "civil-law"
    ],
    "langCodes": [
      "ur",
      "en"
    ],
    "chamberName": "Shams Law Chamber",
    "chamberAddress": "Mezzanine Floor, Building No. 28-C, Old Sunset Boulevard, DHA Phase II, Karachi",
    "education": [
      {
        "degree": "MA",
        "institution": "",
        "year": 0
      },
      {
        "degree": "LL.B",
        "institution": "",
        "year": 0
      }
    ]
  },
  {
    "slug": "sharam-khatoon",
    "displayName": "Miss Sharam Khatoon",
    "headline": "Senior Associate & Advocate High Court · Family & Constitutional Law",
    "bio": "Senior Associate and Advocate of the High Courts of Pakistan. LL.B (Hons.). Appears before the High Courts across the chamber's family, civil and constitutional caseload.",
    "bioUrdu": "سینئر ایسوسی ایٹ اور ایڈووکیٹ ہائی کورٹس پاکستان۔ ایل ایل بی (آنرز)۔ چیمبر کے خاندانی، دیوانی اور آئینی مقدمات میں ہائی کورٹس میں پیش ہوتی ہیں۔",
    "gender": "female",
    "citySlug": "karachi",
    "courts": [
      "Sindh High Court",
      "City Courts Karachi"
    ],
    "barCouncil": "Sindh Bar Council",
    "practiceAreaSlugs": [
      "family-law",
      "constitutional-law"
    ],
    "langCodes": [
      "ur",
      "en"
    ],
    "chamberName": "Shams Law Chamber",
    "chamberAddress": "Mezzanine Floor, Building No. 28-C, Old Sunset Boulevard, DHA Phase II, Karachi",
    "education": [
      {
        "degree": "LL.B (Hons.)",
        "institution": "",
        "year": 0
      }
    ]
  },
  {
    "slug": "saith-ali",
    "displayName": "Mr. Saith Ali",
    "headline": "Associate & Advocate District Courts · Criminal & Civil Law",
    "bio": "Associate and Advocate of the District Courts. LL.B (Hons.) from SZABUL with 3 years of practice — assisting across civil, criminal, family and tax matters with legal research, drafting, client consultation and court proceedings.",
    "bioUrdu": "ایسوسی ایٹ اور ایڈووکیٹ ڈسٹرکٹ کورٹس۔ ایس زیڈ اے بی یو ایل سے ایل ایل بی (آنرز)، 3 سالہ تجربہ۔ دیوانی، فوجداری، خاندانی اور ٹیکس مقدمات میں قانونی تحقیق، ڈرافٹنگ اور عدالتی کارروائی میں معاونت۔",
    "gender": "male",
    "citySlug": "karachi",
    "courts": [
      "City Courts Karachi"
    ],
    "barCouncil": "Sindh Bar Council",
    "practiceAreaSlugs": [
      "criminal-law",
      "civil-law"
    ],
    "langCodes": [
      "ur",
      "en"
    ],
    "chamberName": "Shams Law Chamber",
    "chamberAddress": "Mezzanine Floor, Building No. 28-C, Old Sunset Boulevard, DHA Phase II, Karachi",
    "education": [
      {
        "degree": "LL.B (Hons.), SZABUL",
        "institution": "SZABUL",
        "year": 0
      }
    ]
  },
  {
    "slug": "ali-hyder-khan-mangrio",
    "displayName": "Mr. Ali Hyder Khan Mangrio",
    "headline": "Associate & Advocate District Courts · Criminal & Commercial Law",
    "bio": "Associate of the Karachi office and Advocate of the District Courts. LL.B from the University of London, appearing before the District Courts across the chamber's civil, criminal and commercial caseload.",
    "bioUrdu": "کراچی آفس کے ایسوسی ایٹ اور ایڈووکیٹ ڈسٹرکٹ کورٹس۔ یونیورسٹی آف لندن سے ایل ایل بی۔ چیمبر کے دیوانی، فوجداری اور کمرشل مقدمات میں ڈسٹرکٹ کورٹس میں پیش ہوتے ہیں۔",
    "gender": "male",
    "citySlug": "karachi",
    "courts": [
      "City Courts Karachi"
    ],
    "barCouncil": "Sindh Bar Council",
    "practiceAreaSlugs": [
      "criminal-law",
      "corporate-law"
    ],
    "langCodes": [
      "ur",
      "en"
    ],
    "chamberName": "Shams Law Chamber",
    "chamberAddress": "Mezzanine Floor, Building No. 28-C, Old Sunset Boulevard, DHA Phase II, Karachi",
    "education": [
      {
        "degree": "LL.B, University of London",
        "institution": "University of London",
        "year": 0
      }
    ]
  },
  {
    "slug": "hamza-ali-memon",
    "displayName": "Mr. Hamza Ali Memon",
    "headline": "Associate & Advocate District Courts · Criminal & Property Law",
    "bio": "Associate of the Karachi office and Advocate of the District Courts. LL.B from the University of London, supporting litigation, drafting and client representation across civil, criminal and property matters.",
    "bioUrdu": "کراچی آفس کے ایسوسی ایٹ اور ایڈووکیٹ ڈسٹرکٹ کورٹس۔ یونیورسٹی آف لندن سے ایل ایل بی۔ دیوانی، فوجداری اور جائیداد کے مقدمات میں لٹیگیشن، ڈرافٹنگ اور کلائنٹ نمائندگی میں معاونت۔",
    "gender": "male",
    "citySlug": "karachi",
    "courts": [
      "City Courts Karachi"
    ],
    "barCouncil": "Sindh Bar Council",
    "practiceAreaSlugs": [
      "criminal-law",
      "property-law"
    ],
    "langCodes": [
      "ur",
      "en"
    ],
    "chamberName": "Shams Law Chamber",
    "chamberAddress": "Mezzanine Floor, Building No. 28-C, Old Sunset Boulevard, DHA Phase II, Karachi",
    "education": [
      {
        "degree": "LL.B, University of London",
        "institution": "University of London",
        "year": 0
      }
    ]
  },
  {
    "slug": "shahroz-ahmed",
    "displayName": "Mr. Shahroz Ahmed",
    "headline": "Associate & Advocate District Courts · Criminal & Banking Law",
    "bio": "Associate and Advocate of the District Courts. LL.B (Hons.) from SZABSOL, SALU Khairpur, with over a year of practice across criminal, civil, family, rent and banking matters before the subordinate courts and judicial forums.",
    "bioUrdu": "ایسوسی ایٹ اور ایڈووکیٹ ڈسٹرکٹ کورٹس۔ ایس زیڈ اے بی ایس او ایل، شاہ عبداللطیف یونیورسٹی خیرپور سے ایل ایل بی (آنرز)۔ فوجداری، دیوانی، خاندانی، کرایہ اور بینکاری مقدمات میں ماتحت عدالتوں میں ایک سال سے زائد تجربہ۔",
    "gender": "male",
    "citySlug": "karachi",
    "courts": [
      "City Courts Karachi"
    ],
    "barCouncil": "Sindh Bar Council",
    "practiceAreaSlugs": [
      "criminal-law",
      "banking-finance"
    ],
    "langCodes": [
      "ur",
      "en"
    ],
    "chamberName": "Shams Law Chamber",
    "chamberAddress": "Mezzanine Floor, Building No. 28-C, Old Sunset Boulevard, DHA Phase II, Karachi",
    "education": [
      {
        "degree": "LL.B (Hons.), SZABSOL, SALU Khairpur",
        "institution": "SALU Khairpur",
        "year": 0
      }
    ]
  },
  {
    "slug": "syed-sikandar-ali-shah",
    "displayName": "Mr. Syed Sikandar Ali Shah",
    "headline": "Senior Associate & Advocate High Court · Criminal & Civil Law",
    "bio": "Senior Associate and Advocate of the High Court. Practices across civil and criminal litigation before the High Court and subordinate courts.",
    "bioUrdu": "سینئر ایسوسی ایٹ اور ایڈووکیٹ ہائی کورٹ۔ ہائی کورٹ اور ماتحت عدالتوں میں دیوانی اور فوجداری مقدمات کی پیروی کرتے ہیں۔",
    "gender": "male",
    "citySlug": "hyderabad",
    "courts": [
      "Sindh High Court",
      "District Courts Hyderabad"
    ],
    "barCouncil": "Sindh Bar Council",
    "practiceAreaSlugs": [
      "criminal-law",
      "civil-law"
    ],
    "langCodes": [
      "ur",
      "en"
    ],
    "chamberName": "Shams Law Chamber",
    "chamberAddress": "Labaik Plaza, Near Bismillah CNG, Wadhu Wah Main National Highway, Hyderabad",
    "education": []
  },
  {
    "slug": "abdul-salam-sheikh",
    "displayName": "Mr. Abdul Salam Sheikh",
    "headline": "Senior Associate & Advocate High Court · Civil & Service Matters",
    "bio": "Senior Associate and Advocate of the High Court. Handles civil litigation and service matters before the High Court and subordinate courts.",
    "bioUrdu": "سینئر ایسوسی ایٹ اور ایڈووکیٹ ہائی کورٹ۔ ہائی کورٹ اور ماتحت عدالتوں میں دیوانی مقدمات اور سروس معاملات کی پیروی کرتے ہیں۔",
    "gender": "male",
    "citySlug": "hyderabad",
    "courts": [
      "Sindh High Court",
      "District Courts Hyderabad"
    ],
    "barCouncil": "Sindh Bar Council",
    "practiceAreaSlugs": [
      "civil-law",
      "labour-law"
    ],
    "langCodes": [
      "ur",
      "en"
    ],
    "chamberName": "Shams Law Chamber",
    "chamberAddress": "Labaik Plaza, Near Bismillah CNG, Wadhu Wah Main National Highway, Hyderabad",
    "education": []
  },
  {
    "slug": "abdul-raheem-mahar",
    "displayName": "Mr. Abdul Raheem Mahar",
    "headline": "Senior Associate & Advocate High Court · Criminal & Constitutional Law",
    "bio": "Senior Associate and Advocate of the High Court. Practices criminal and constitutional litigation before the High Court and subordinate courts.",
    "bioUrdu": "سینئر ایسوسی ایٹ اور ایڈووکیٹ ہائی کورٹ۔ ہائی کورٹ اور ماتحت عدالتوں میں فوجداری اور آئینی مقدمات کی پیروی کرتے ہیں۔",
    "gender": "male",
    "citySlug": "hyderabad",
    "courts": [
      "Sindh High Court",
      "District Courts Hyderabad"
    ],
    "barCouncil": "Sindh Bar Council",
    "practiceAreaSlugs": [
      "criminal-law",
      "constitutional-law"
    ],
    "langCodes": [
      "ur",
      "en"
    ],
    "chamberName": "Shams Law Chamber",
    "chamberAddress": "Labaik Plaza, Near Bismillah CNG, Wadhu Wah Main National Highway, Hyderabad",
    "education": []
  },
  {
    "slug": "muhammad-maqsood-maitlo",
    "displayName": "Mr. Muhammad Maqsood Maitlo",
    "headline": "Associate & Advocate · Criminal & Civil Law",
    "bio": "Associate and Advocate practicing civil and criminal litigation before the subordinate courts.",
    "bioUrdu": "ایسوسی ایٹ اور ایڈووکیٹ۔ ماتحت عدالتوں میں دیوانی اور فوجداری مقدمات کی پیروی کرتے ہیں۔",
    "gender": "male",
    "citySlug": "hyderabad",
    "courts": [
      "District Courts Hyderabad"
    ],
    "barCouncil": "Sindh Bar Council",
    "practiceAreaSlugs": [
      "criminal-law",
      "civil-law"
    ],
    "langCodes": [
      "ur",
      "en"
    ],
    "chamberName": "Shams Law Chamber",
    "chamberAddress": "Labaik Plaza, Near Bismillah CNG, Wadhu Wah Main National Highway, Hyderabad",
    "education": []
  },
  {
    "slug": "javed-ali-mahar",
    "displayName": "Mr. Javed Ali Mahar",
    "headline": "Associate & Advocate · Criminal & Banking Law",
    "bio": "Associate and Advocate. BPA, LL.B from Shah Abdul Latif University, Khairpur, with over 2 years of practice across civil, criminal, family, banking and constitutional matters before the trial courts and judicial forums.",
    "bioUrdu": "ایسوسی ایٹ اور ایڈووکیٹ۔ شاہ عبداللطیف یونیورسٹی خیرپور سے بی پی اے، ایل ایل بی۔ ٹرائل کورٹس اور جوڈیشل فورمز میں دیوانی، فوجداری، خاندانی، بینکاری اور آئینی مقدمات میں دو سال سے زائد تجربہ۔",
    "gender": "male",
    "citySlug": "hyderabad",
    "courts": [
      "District Courts Hyderabad"
    ],
    "barCouncil": "Sindh Bar Council",
    "practiceAreaSlugs": [
      "criminal-law",
      "banking-finance"
    ],
    "langCodes": [
      "ur",
      "en"
    ],
    "chamberName": "Shams Law Chamber",
    "chamberAddress": "Labaik Plaza, Near Bismillah CNG, Wadhu Wah Main National Highway, Hyderabad",
    "education": [
      {
        "degree": "BPA",
        "institution": "",
        "year": 0
      },
      {
        "degree": "LL.B, Shah Abdul Latif University, Khairpur",
        "institution": "SALU Khairpur",
        "year": 0
      }
    ]
  },
  {
    "slug": "asad-ali-channa",
    "displayName": "Mr. Asad Ali Channa",
    "headline": "Associate & Advocate · Family & Civil Law",
    "bio": "Associate and Advocate practicing civil and family litigation before the subordinate courts.",
    "bioUrdu": "ایسوسی ایٹ اور ایڈووکیٹ۔ ماتحت عدالتوں میں دیوانی اور خاندانی مقدمات کی پیروی کرتے ہیں۔",
    "gender": "male",
    "citySlug": "hyderabad",
    "courts": [
      "District Courts Hyderabad"
    ],
    "barCouncil": "Sindh Bar Council",
    "practiceAreaSlugs": [
      "family-law",
      "civil-law"
    ],
    "langCodes": [
      "ur",
      "en"
    ],
    "chamberName": "Shams Law Chamber",
    "chamberAddress": "Labaik Plaza, Near Bismillah CNG, Wadhu Wah Main National Highway, Hyderabad",
    "education": []
  },
  {
    "slug": "abdul-jabbar-charan",
    "displayName": "Mr. Abdul Jabbar Charan",
    "headline": "Associate & Advocate High Court · Criminal & Civil Law",
    "bio": "Associate and Advocate of the High Courts of Pakistan. BA, LL.B. Practices civil and criminal litigation before the High Court and subordinate courts.",
    "bioUrdu": "ایسوسی ایٹ اور ایڈووکیٹ ہائی کورٹس پاکستان۔ بی اے، ایل ایل بی۔ ہائی کورٹ اور ماتحت عدالتوں میں دیوانی اور فوجداری مقدمات کی پیروی کرتے ہیں۔",
    "gender": "male",
    "citySlug": "sukkur",
    "courts": [
      "Sindh High Court",
      "District Courts Sukkur"
    ],
    "barCouncil": "Sindh Bar Council",
    "practiceAreaSlugs": [
      "criminal-law",
      "civil-law"
    ],
    "langCodes": [
      "ur",
      "en"
    ],
    "chamberName": "Shams Law Chamber",
    "chamberAddress": "Mushtaq Surhio Building, Workshop Road, Sukkur",
    "education": [
      {
        "degree": "BA",
        "institution": "",
        "year": 0
      },
      {
        "degree": "LL.B",
        "institution": "",
        "year": 0
      }
    ]
  },
  {
    "slug": "muhammad-younis-siyal",
    "displayName": "Mr. Muhammad Younis Siyal",
    "headline": "Associate & Advocate High Court of Sindh · Criminal & Constitutional Law",
    "bio": "Associate and Advocate of the High Court of Sindh. B.A. LL.B (Hons.) from SZABUL, currently in the final year of his LL.M. at the University of Sindh. Practical experience across civil, criminal, family, constitutional and special court matters, with strong expertise in legal drafting, research and court advocacy.",
    "bioUrdu": "ایسوسی ایٹ اور ایڈووکیٹ ہائی کورٹ سندھ۔ ایس زیڈ اے بی یو ایل سے بی اے ایل ایل بی (آنرز)، یونیورسٹی آف سندھ سے ایل ایل ایم (آخری سال)۔ دیوانی، فوجداری، خاندانی، آئینی اور خصوصی عدالتوں کے مقدمات میں عملی تجربہ۔ قانونی ڈرافٹنگ اور تحقیق میں مہارت۔",
    "gender": "male",
    "citySlug": "sukkur",
    "courts": [
      "Sindh High Court",
      "District Courts Sukkur"
    ],
    "barCouncil": "Sindh Bar Council",
    "practiceAreaSlugs": [
      "criminal-law",
      "constitutional-law"
    ],
    "langCodes": [
      "ur",
      "en"
    ],
    "chamberName": "Shams Law Chamber",
    "chamberAddress": "Mushtaq Surhio Building, Workshop Road, Sukkur",
    "education": [
      {
        "degree": "B.A. LL.B (Hons.), SZABUL",
        "institution": "SZABUL",
        "year": 0
      },
      {
        "degree": "LL.M. (final year), University of Sindh",
        "institution": "University of Sindh",
        "year": 0
      }
    ]
  },
  {
    "slug": "ikrama-khan",
    "displayName": "Mr. Ikrama Khan",
    "headline": "Associate & Advocate High Court · Civil & Constitutional Law",
    "bio": "Associate and Advocate of the High Courts of Pakistan. LL.B (Hons.). Practices civil and constitutional litigation before the High Court and subordinate courts.",
    "bioUrdu": "ایسوسی ایٹ اور ایڈووکیٹ ہائی کورٹس پاکستان۔ ایل ایل بی (آنرز)۔ ہائی کورٹ اور ماتحت عدالتوں میں دیوانی اور آئینی مقدمات کی پیروی کرتے ہیں۔",
    "gender": "male",
    "citySlug": "sukkur",
    "courts": [
      "Sindh High Court",
      "District Courts Sukkur"
    ],
    "barCouncil": "Sindh Bar Council",
    "practiceAreaSlugs": [
      "constitutional-law",
      "civil-law"
    ],
    "langCodes": [
      "ur",
      "en"
    ],
    "chamberName": "Shams Law Chamber",
    "chamberAddress": "Mushtaq Surhio Building, Workshop Road, Sukkur",
    "education": [
      {
        "degree": "LL.B (Hons.)",
        "institution": "",
        "year": 0
      }
    ]
  },
  {
    "slug": "babar-ali-rajper",
    "displayName": "Mr. Babar Ali Rajper",
    "headline": "Associate & Advocate High Court · Criminal & Civil Law",
    "bio": "Associate and Advocate of the High Courts of Pakistan. LL.B (Hons.). Practices criminal and civil litigation before the High Court and subordinate courts.",
    "bioUrdu": "ایسوسی ایٹ اور ایڈووکیٹ ہائی کورٹس پاکستان۔ ایل ایل بی (آنرز)۔ ہائی کورٹ اور ماتحت عدالتوں میں فوجداری اور دیوانی مقدمات کی پیروی کرتے ہیں۔",
    "gender": "male",
    "citySlug": "sukkur",
    "courts": [
      "Sindh High Court",
      "District Courts Sukkur"
    ],
    "barCouncil": "Sindh Bar Council",
    "practiceAreaSlugs": [
      "criminal-law",
      "civil-law"
    ],
    "langCodes": [
      "ur",
      "en"
    ],
    "chamberName": "Shams Law Chamber",
    "chamberAddress": "Mushtaq Surhio Building, Workshop Road, Sukkur",
    "education": [
      {
        "degree": "LL.B (Hons.)",
        "institution": "",
        "year": 0
      }
    ]
  },
  {
    "slug": "junaid-malik",
    "displayName": "Mr. Junaid Malik",
    "headline": "Associate & Advocate District Courts · Family & Civil Law",
    "bio": "Associate and Advocate of the District Courts. LL.B (Hons.). Practices civil and family litigation before the subordinate courts.",
    "bioUrdu": "ایسوسی ایٹ اور ایڈووکیٹ ڈسٹرکٹ کورٹس۔ ایل ایل بی (آنرز)۔ ماتحت عدالتوں میں دیوانی اور خاندانی مقدمات کی پیروی کرتے ہیں۔",
    "gender": "male",
    "citySlug": "sukkur",
    "courts": [
      "District Courts Sukkur"
    ],
    "barCouncil": "Sindh Bar Council",
    "practiceAreaSlugs": [
      "family-law",
      "civil-law"
    ],
    "langCodes": [
      "ur",
      "en"
    ],
    "chamberName": "Shams Law Chamber",
    "chamberAddress": "Mushtaq Surhio Building, Workshop Road, Sukkur",
    "education": [
      {
        "degree": "LL.B (Hons.)",
        "institution": "",
        "year": 0
      }
    ]
  }
];
