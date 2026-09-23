/**
 * Location helpers — "near me" lawyer discovery.
 *
 * Fully client-side, no external API or key needed:
 * 1. The browser's own geolocation gives us coordinates.
 * 2. We match them against the approximate centers of the cities we serve
 *    with the haversine formula and pick the nearest one.
 */

export interface CityCoord {
  slug: string;
  lat: number;
  lng: number;
}

/** Approximate city centers for the 13 cities in our directory. */
export const CITY_COORDS: CityCoord[] = [
  { slug: "karachi", lat: 24.8607, lng: 67.0011 },
  { slug: "hyderabad", lat: 25.396, lng: 68.3578 },
  { slug: "sukkur", lat: 27.7052, lng: 68.8574 },
  { slug: "lahore", lat: 31.5204, lng: 74.3587 },
  { slug: "gujranwala", lat: 32.1877, lng: 74.1945 },
  { slug: "sialkot", lat: 32.4945, lng: 74.5229 },
  { slug: "faisalabad", lat: 31.4504, lng: 73.135 },
  { slug: "multan", lat: 30.1575, lng: 71.5249 },
  { slug: "bahawalpur", lat: 29.3544, lng: 71.6911 },
  { slug: "islamabad", lat: 33.6844, lng: 73.0479 },
  { slug: "rawalpindi", lat: 33.5651, lng: 73.0169 },
  { slug: "peshawar", lat: 34.0151, lng: 71.5249 },
  { slug: "quetta", lat: 30.1798, lng: 66.975 },
];

const REMEMBER_KEY = "wc-near-city";

function haversineKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) * Math.cos((bLat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

/** Returns the slug of the nearest served city, or null if impossibly far (>400km). */
export function nearestCitySlug(lat: number, lng: number): string | null {
  let best: CityCoord | null = null;
  let bestKm = Infinity;
  for (const c of CITY_COORDS) {
    const km = haversineKm(lat, lng, c.lat, c.lng);
    if (km < bestKm) {
      bestKm = km;
      best = c;
    }
  }
  if (!best || bestKm > 400) return null;
  return best.slug;
}

export type DetectError = "unsupported" | "denied" | "unavailable" | "timeout" | "too-far";

/**
 * Asks the browser for the user's coordinates, then maps them to the
 * nearest served city. Rejects with a DetectError the UI can translate.
 */
export function detectCitySlug(timeoutMs = 12000): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      reject("unsupported" satisfies DetectError);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const slug = nearestCitySlug(pos.coords.latitude, pos.coords.longitude);
        if (slug) resolve(slug);
        else reject("too-far" satisfies DetectError);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) reject("denied" satisfies DetectError);
        else if (err.code === err.TIMEOUT) reject("timeout" satisfies DetectError);
        else reject("unavailable" satisfies DetectError);
      },
      { enableHighAccuracy: false, timeout: timeoutMs, maximumAge: 10 * 60 * 1000 },
    );
  });
}

export function rememberedCitySlug(): string | null {
  try {
    return localStorage.getItem(REMEMBER_KEY);
  } catch {
    return null;
  }
}

export function rememberCitySlug(slug: string) {
  try {
    localStorage.setItem(REMEMBER_KEY, slug);
  } catch {
    /* private mode — ignore */
  }
}
