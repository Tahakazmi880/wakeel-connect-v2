/**
 * Illustrated lawyer avatars — original flat-vector placeholders used only
 * when a lawyer has no real photo yet. Clearly illustrative (never a fake
 * person's face); replaced automatically once the real photo is supplied.
 */

function AvatarFrame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <svg viewBox="0 0 96 96" className="h-full w-full" role="img" aria-label={label}>
      <defs>
        <radialGradient id="wcl-avbg" cx="50%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#2E4E7D" />
          <stop offset="100%" stopColor="#1B3358" />
        </radialGradient>
      </defs>
      <rect width="96" height="96" fill="url(#wcl-avbg)" />
      {children}
    </svg>
  );
}

export function MaleLawyerAvatar() {
  return (
    <AvatarFrame label="Lawyer avatar placeholder">
      {/* neck + suit */}
      <rect x="43" y="56" width="10" height="12" rx="3" fill="#D9A077" />
      <path d="M18,96 L18,76 Q18,66 30,64 L41,62 L55,62 L66,64 Q78,66 78,76 L78,96 Z" fill="#14284A" />
      <polygon points="41,62 55,62 51,82 45,82" fill="#F4F1E8" />
      <polygon points="46.4,62 49.6,62 48.8,68 48,79 47.2,68" fill="#C9A227" />
      <polygon points="41,62 34,65 44,86 45.5,80" fill="#1B3358" />
      <polygon points="55,62 62,65 52,86 50.5,80" fill="#1B3358" />
      {/* ears + head */}
      <circle cx="33.5" cy="44" r="2.6" fill="#F0C297" />
      <circle cx="62.5" cy="44" r="2.6" fill="#F0C297" />
      <circle cx="48" cy="43" r="14" fill="#F0C297" />
      {/* hair */}
      <path
        d="M33.5,42 C33.5,31 40.5,26.5 48,26.5 C55.5,26.5 62.5,31 62.5,42 L60,42 C60,34.5 54.5,30.5 48,30.5 C41.5,30.5 36,34.5 36,42 Z"
        fill="#23232B"
      />
      <path d="M36,40 q4,-3 8,-1 l-1,3 q-4,-1 -7,1 z" fill="#23232B" />
      <path d="M60,40 q-4,-3 -8,-1 l1,3 q4,-1 7,1 z" fill="#23232B" />
    </AvatarFrame>
  );
}

export function FemaleLawyerAvatar() {
  return (
    <AvatarFrame label="Lawyer avatar placeholder">
      {/* back hair */}
      <ellipse cx="48" cy="44" rx="17.5" ry="19" fill="#3A2A24" />
      {/* neck + blazer */}
      <rect x="43" y="56" width="10" height="12" rx="3" fill="#D9A077" />
      <path d="M18,96 L18,76 Q18,66 30,64 L41,62 L55,62 L66,64 Q78,66 78,76 L78,96 Z" fill="#1E3A5F" />
      <polygon points="40,62 56,62 52,80 44,80" fill="#F4F1E8" />
      <polygon points="40,62 32,65 43,88 44.5,79" fill="#14284A" />
      <polygon points="56,62 64,65 53,88 51.5,79" fill="#14284A" />
      <circle cx="57" cy="72" r="2.4" fill="#C9A227" />
      {/* head */}
      <circle cx="48" cy="42" r="13.5" fill="#F2C19B" />
      {/* front hair framing the face */}
      <path
        d="M33.5,40 C33.5,29 41,24.5 48,24.5 C55,24.5 62.5,29 62.5,40 C62.5,33.5 57.5,29.5 51.5,28.8 L44.5,28.8 C38.5,29.5 33.5,33.5 33.5,40 Z"
        fill="#3A2A24"
      />
      <path d="M33.5,38 q-2.5,13 2.5,22 l6.5,0 q-4.5,-10 -3.5,-22 z" fill="#3A2A24" />
      <path d="M62.5,38 q2.5,13 -2.5,22 l-6.5,0 q4.5,-10 3.5,-22 z" fill="#3A2A24" />
    </AvatarFrame>
  );
}

/** Picks the illustrated placeholder by the lawyer's recorded gender. */
export function PlaceholderAvatar({ gender }: { gender?: string }) {
  return String(gender ?? "").toLowerCase() === "female" ? (
    <FemaleLawyerAvatar />
  ) : (
    <MaleLawyerAvatar />
  );
}
