import { SupportedLanguage } from '@/lib/types';

/**
 * Checks whether text contains Ethiopic / Ge'ez Unicode characters (range U+1200 - U+137F)
 */
export function hasEthiopicScript(text?: string | null): boolean {
  if (!text) return false;
  return /[\u1200-\u137F]/.test(text);
}

/**
 * Common Afaan Oromoo agricultural and conversational keywords
 */
const OROMO_KEYWORDS = [
  'waagii',
  'dhukkuba',
  'dhibee',
  'baala',
  'muka',
  'midhaan',
  'qamadii',
  'boqqolloo',
  'buna',
  'xaafii',
  'jirma',
  'hiddi',
  'daaraa',
  'farra',
  'hoji',
  'biyyo',
  'koree',
  'akkami',
  'maloo',
  'argame',
  'miidhame',
  'nyaatame',
  'goge',
  'keelloo',
  'barii',
  'rooba',
  'bona',
  'arfaasaa',
  'ganna',
  'birraa',
  'balee',
  'sirri',
  'qonnaan',
  'bulaa',
];

/**
 * Checks whether text contains typical Afaan Oromoo keywords
 */
export function hasAfaanOromoKeywords(text?: string | null): boolean {
  if (!text) return false;
  const lower = text.toLowerCase();
  return OROMO_KEYWORDS.some((word) => lower.includes(word));
}

/**
 * Resolves the specific language the user is using to ask the agent.
 * Precedence:
 * 1. If text contains Ethiopic/Ge'ez script -> 'am' (Amharic)
 * 2. If text contains Afaan Oromoo terms -> 'om' (Afaan Oromoo)
 * 3. If a preferredLanguage is explicitly provided and is 'am', 'om', or 'en' -> use it
 * 4. Default to 'en' (English)
 */
export function resolveUserLanguage(
  text?: string | null,
  preferredLanguage?: SupportedLanguage | null
): SupportedLanguage {
  if (text && hasEthiopicScript(text)) {
    return 'am';
  }
  if (text && hasAfaanOromoKeywords(text)) {
    return 'om';
  }
  if (preferredLanguage === 'am' || preferredLanguage === 'om' || preferredLanguage === 'en') {
    return preferredLanguage;
  }
  return 'en';
}

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  en: 'English',
  am: 'Amharic (አማርኛ)',
  om: 'Afaan Oromoo',
};
