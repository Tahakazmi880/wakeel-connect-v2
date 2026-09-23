/**
 * Original illustrated practice-area / legal-issue icons for wakeel.connect.
 * Flat-illustration style (light circle backdrop + simple shapes) drawn from
 * scratch — no third-party or oladoc artwork. Each icon is self-contained SVG.
 */

const BG = "#E7EFFA";
const NAVY = "#1E3A5F";
const BLUE = "#3B82C4";
const LIGHT = "#9FC1E8";
const BRASS = "#C9A227";
const GOLD = "#D2A24A";
const SKIN = "#F0C297";
const RED = "#D64545";
const WHITE = "#FFFFFF";

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
      <circle cx="32" cy="32" r="30" fill={BG} />
      {children}
    </svg>
  );
}

function FamilyLawIcon() {
  return (
    <Frame>
      <circle cx="25" cy="19" r="7" fill={SKIN} />
      <rect x="17" y="28" width="16" height="21" rx="8" fill={NAVY} />
      <circle cx="44" cy="27" r="5.5" fill={SKIN} />
      <rect x="37.5" y="34" width="13" height="15" rx="6.5" fill={BLUE} />
    </Frame>
  );
}

function CriminalLawIcon() {
  return (
    <Frame>
      <rect x="16" y="10" width="32" height="11" rx="3" fill={NAVY} />
      <rect x="16" y="10" width="7" height="11" fill={BLUE} />
      <rect x="41" y="10" width="7" height="11" fill={BLUE} />
      <rect x="29.5" y="21" width="5" height="26" rx="2.5" fill={BRASS} />
      <rect x="18" y="50" width="28" height="5" rx="2.5" fill="#8A6D3B" />
    </Frame>
  );
}

function PropertyLawIcon() {
  return (
    <Frame>
      <rect x="42" y="14" width="5" height="9" fill="#8A6D3B" />
      <polygon points="10,30 32,12 54,30" fill={NAVY} />
      <rect x="16" y="30" width="32" height="19" fill={BLUE} />
      <rect x="28" y="39" width="8" height="10" fill={BG} />
      <rect x="20" y="34" width="6" height="6" fill={GOLD} />
    </Frame>
  );
}

function CorporateLawIcon() {
  return (
    <Frame>
      <rect x="20" y="13" width="24" height="38" fill={NAVY} />
      {[21, 29, 37].map((y) =>
        [24, 32, 40].map((x) => <rect key={`${x}-${y}`} x={x} y={y} width="4" height="5" fill={LIGHT} />),
      )}
      <rect x="28" y="43" width="8" height="8" fill={BRASS} />
    </Frame>
  );
}

function TaxLawIcon() {
  return (
    <Frame>
      <rect x="20" y="9" width="24" height="46" rx="4" fill={NAVY} />
      <rect x="24" y="13" width="16" height="8" rx="1.5" fill={LIGHT} />
      {[28, 36, 44].map((y) =>
        [26, 32, 38].map((x) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="2.6" fill={x === 38 && y === 44 ? BRASS : BG} />
        )),
      )}
    </Frame>
  );
}

function ImmigrationLawIcon() {
  return (
    <Frame>
      <circle cx="27" cy="34" r="16" fill={BLUE} />
      <ellipse cx="27" cy="34" rx="7" ry="16" fill="none" stroke={BG} strokeWidth="2" />
      <line x1="11" y1="34" x2="43" y2="34" stroke={BG} strokeWidth="2" />
      <line x1="14" y1="26" x2="40" y2="26" stroke={BG} strokeWidth="1.4" opacity="0.7" />
      <line x1="14" y1="42" x2="40" y2="42" stroke={BG} strokeWidth="1.4" opacity="0.7" />
      <polygon points="44,10 55,19 44,23 46.5,17" fill={NAVY} />
    </Frame>
  );
}

function LabourLawIcon() {
  return (
    <Frame>
      <path d="M18,37 a14,14 0 0 1 28,0 z" fill={GOLD} />
      <rect x="29" y="20" width="6" height="13" rx="3" fill="#B98A2E" />
      <rect x="14" y="37" width="36" height="5.5" rx="2.75" fill="#B98A2E" />
    </Frame>
  );
}

function BankingLawIcon() {
  return (
    <Frame>
      <polygon points="32,10 12,24 52,24" fill={NAVY} />
      {[18, 27, 36, 45].map((x) => (
        <rect key={x} x={x} y="28" width="5" height="18" fill={BLUE} />
      ))}
      <rect x="14" y="46" width="36" height="5" rx="2" fill={NAVY} />
      <circle cx="46" cy="14" r="6.5" fill={GOLD} />
      <circle cx="46" cy="14" r="4" fill="none" stroke="#B98A2E" strokeWidth="1.6" />
    </Frame>
  );
}

function ConstitutionalLawIcon() {
  return (
    <Frame>
      <rect x="30.5" y="10" width="3" height="37" fill={NAVY} />
      <rect x="15" y="13" width="34" height="3.4" rx="1.7" fill={NAVY} />
      <line x1="18" y1="17" x2="12" y2="30" stroke={NAVY} strokeWidth="1.8" />
      <line x1="18" y1="17" x2="24" y2="30" stroke={NAVY} strokeWidth="1.8" />
      <path d="M10,30 a8,5.5 0 0 0 16,0 z" fill={BRASS} />
      <line x1="46" y1="17" x2="40" y2="30" stroke={NAVY} strokeWidth="1.8" />
      <line x1="46" y1="17" x2="52" y2="30" stroke={NAVY} strokeWidth="1.8" />
      <path d="M38,30 a8,5.5 0 0 0 16,0 z" fill={BRASS} />
      <rect x="24" y="47" width="16" height="4.5" rx="2.25" fill={NAVY} />
    </Frame>
  );
}

function CivilLawIcon() {
  return (
    <Frame>
      <rect x="20" y="9" width="24" height="42" rx="3" fill={WHITE} stroke={NAVY} strokeWidth="2.5" />
      <polygon points="44,9 44,17 36,9" fill={LIGHT} />
      <line x1="25" y1="22" x2="39" y2="22" stroke={BLUE} strokeWidth="2.4" strokeLinecap="round" />
      <line x1="25" y1="28" x2="39" y2="28" stroke={BLUE} strokeWidth="2.4" strokeLinecap="round" />
      <line x1="25" y1="34" x2="34" y2="34" stroke={LIGHT} strokeWidth="2.4" strokeLinecap="round" />
      <polygon points="28,44 32,53 36,44" fill="#B03A3A" />
      <circle cx="32" cy="40" r="7" fill={RED} />
      <circle cx="32" cy="40" r="4.4" fill="none" stroke={WHITE} strokeWidth="1.6" />
    </Frame>
  );
}

function CybercrimeLawIcon() {
  return (
    <Frame>
      <path d="M32,9 L48,15 V29 C48,41 40,50 32,55 C24,50 16,41 16,29 V15 Z" fill={NAVY} />
      <rect x="26" y="30" width="12" height="10" rx="2" fill={GOLD} />
      <path d="M28.5,30 v-3 a3.5,3.5 0 0 1 7,0 v3" fill="none" stroke={GOLD} strokeWidth="2.6" />
      <circle cx="32" cy="35" r="1.8" fill={NAVY} />
    </Frame>
  );
}

function ConsumerLawIcon() {
  return (
    <Frame>
      <path d="M22,22 h20 l-2.2,28 h-15.6 z" fill={BLUE} />
      <path d="M26,22 a6,6 0 0 1 12,0" fill="none" stroke={NAVY} strokeWidth="2.6" />
      <polyline points="27,35 31,39 38,30" fill="none" stroke={WHITE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </Frame>
  );
}

function ArbitrationIcon() {
  return (
    <Frame>
      <path d="M18,32 a14,14 0 0 1 22,-9" fill="none" stroke={BLUE} strokeWidth="4" strokeLinecap="round" />
      <polygon points="40,15 41,25 33,21" fill={BLUE} />
      <path d="M46,32 a14,14 0 0 1 -22,9" fill="none" stroke={BRASS} strokeWidth="4" strokeLinecap="round" />
      <polygon points="24,49 23,39 31,43" fill={BRASS} />
    </Frame>
  );
}

/* ---------- legal-issue icons ---------- */

function DivorceIcon() {
  return (
    <Frame>
      <path
        d="M32,51 C20,41 14,33 14,25 C14,18 19,14 24,14 C28,14 31,17 32,20 C33,17 36,14 40,14 C45,14 50,18 50,25 C50,33 44,41 32,51 Z"
        fill={RED}
      />
      <polyline points="33,17 28,25 34,31 29,39 33,47" fill="none" stroke={WHITE} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </Frame>
  );
}

function HandcuffsIcon() {
  return (
    <Frame>
      <circle cx="22" cy="33" r="8" fill="none" stroke={NAVY} strokeWidth="4" />
      <circle cx="42" cy="33" r="8" fill="none" stroke={NAVY} strokeWidth="4" />
      <rect x="28" y="29" width="8" height="8" rx="2" fill={BRASS} />
      <line x1="22" y1="25" x2="22" y2="18" stroke={NAVY} strokeWidth="3" strokeLinecap="round" />
      <line x1="42" y1="25" x2="42" y2="18" stroke={NAVY} strokeWidth="3" strokeLinecap="round" />
    </Frame>
  );
}

function ContractIcon() {
  return (
    <Frame>
      <rect x="17" y="12" width="24" height="34" rx="3" fill={WHITE} stroke={NAVY} strokeWidth="2.5" />
      <polygon points="41,12 41,20 33,12" fill={LIGHT} />
      <line x1="22" y1="24" x2="36" y2="24" stroke={BLUE} strokeWidth="2.4" strokeLinecap="round" />
      <line x1="22" y1="30" x2="36" y2="30" stroke={BLUE} strokeWidth="2.4" strokeLinecap="round" />
      <line x1="22" y1="36" x2="31" y2="36" stroke={LIGHT} strokeWidth="2.4" strokeLinecap="round" />
      <rect x="40" y="34" width="4.5" height="18" rx="2.25" fill={BRASS} transform="rotate(35 42 43)" />
      <polygon points="47,50 51,55 45,54" fill={NAVY} />
    </Frame>
  );
}

function IdBadgeIcon() {
  return (
    <Frame>
      <rect x="20" y="15" width="24" height="34" rx="4" fill={WHITE} stroke={NAVY} strokeWidth="2.5" />
      <rect x="20" y="15" width="24" height="9" rx="4" fill={NAVY} />
      <circle cx="28" cy="32" r="5" fill={SKIN} />
      <rect x="23" y="38" width="10" height="7" rx="3.5" fill={BLUE} />
      <line x1="37" y1="30" x2="41" y2="30" stroke={LIGHT} strokeWidth="2.4" strokeLinecap="round" />
      <line x1="37" y1="35" x2="41" y2="35" stroke={LIGHT} strokeWidth="2.4" strokeLinecap="round" />
      <line x1="37" y1="40" x2="41" y2="40" stroke={LIGHT} strokeWidth="2.4" strokeLinecap="round" />
    </Frame>
  );
}

const AREA_ICONS: Record<string, () => React.ReactNode> = {
  "family-law": FamilyLawIcon,
  "criminal-law": CriminalLawIcon,
  "property-law": PropertyLawIcon,
  "corporate-law": CorporateLawIcon,
  "tax-law": TaxLawIcon,
  "immigration-law": ImmigrationLawIcon,
  "labour-law": LabourLawIcon,
  "banking-finance": BankingLawIcon,
  "constitutional-law": ConstitutionalLawIcon,
  "civil-law": CivilLawIcon,
  "cybercrime-law": CybercrimeLawIcon,
  "consumer-law": ConsumerLawIcon,
  arbitration: ArbitrationIcon,
};

const ISSUE_ICONS: Record<string, () => React.ReactNode> = {
  divorce: DivorceIcon,
  "property-dispute": PropertyLawIcon,
  bail: HandcuffsIcon,
  contract: ContractIcon,
  "tax-notice": TaxLawIcon,
  termination: IdBadgeIcon,
  fraud: CybercrimeLawIcon,
};

export function PracticeAreaIcon({ slug }: { slug: string }) {
  const Icon = AREA_ICONS[slug] ?? CivilLawIcon;
  return <Icon />;
}

export function LegalIssueIcon({ id }: { id: string }) {
  const Icon = ISSUE_ICONS[id] ?? CivilLawIcon;
  return <Icon />;
}

/** Common legal issues for the "Search lawyer by legal issue" row. */
export const LEGAL_ISSUES: { id: string; q: string; nameEn: string; nameUr: string }[] = [
  { id: "divorce", q: "divorce khula", nameEn: "Divorce & Khula", nameUr: "طلاق و خلع" },
  { id: "property-dispute", q: "property dispute", nameEn: "Property Dispute", nameUr: "جائیداد کا تنازع" },
  { id: "bail", q: "bail", nameEn: "Bail & Arrest", nameUr: "ضمانت و گرفتاری" },
  { id: "contract", q: "contract", nameEn: "Business Contract", nameUr: "کاروباری معاہدہ" },
  { id: "tax-notice", q: "tax", nameEn: "FBR Tax Notice", nameUr: "ایف بی آر ٹیکس نوٹس" },
  { id: "termination", q: "termination", nameEn: "Wrongful Termination", nameUr: "ناحق برطرفی" },
  { id: "fraud", q: "fraud", nameEn: "Online Fraud", nameUr: "آن لائن فراڈ" },
];
