import test from 'node:test';
import assert from 'node:assert/strict';
import {
  hasEthiopicScript,
  hasAfaanOromoKeywords,
  resolveUserLanguage,
  LANGUAGE_LABELS,
} from '@/lib/i18n/detect-language';

test('detect-language: hasEthiopicScript correctly identifies Ge\'ez/Ethiopic script', () => {
  // Amharic sample words
  assert.strictEqual(hasEthiopicScript('ጤፍ'), true);
  assert.strictEqual(hasEthiopicScript('ስንዴ ላይ ቢጫ ዝገት ታይቷል'), true);
  assert.strictEqual(hasEthiopicScript('ሰላም ጤና ይስጥልኝ'), true);
  assert.strictEqual(hasEthiopicScript('የቡና ቅጠል በሽታ'), true);

  // Non-Ethiopic text
  assert.strictEqual(hasEthiopicScript('Teff rust on leaves'), false);
  assert.strictEqual(hasEthiopicScript('Waagii qamadii'), false);
  assert.strictEqual(hasEthiopicScript('12345 !@#$%^&*()'), false);
  assert.strictEqual(hasEthiopicScript(''), false);
  assert.strictEqual(hasEthiopicScript(null), false);
  assert.strictEqual(hasEthiopicScript(undefined), false);
});

test('detect-language: hasAfaanOromoKeywords detects agricultural Oromo terminology', () => {
  // Afaan Oromoo agricultural keywords
  assert.strictEqual(hasAfaanOromoKeywords('Waagii qamadii baala irratti'), true);
  assert.strictEqual(hasAfaanOromoKeywords('Dhukkuba boqqolloo arge'), true);
  assert.strictEqual(hasAfaanOromoKeywords('Buna koo farra dhibee barbaada'), true);
  assert.strictEqual(hasAfaanOromoKeywords('Qonnaan bulaa naannoo Oromiyaa'), true);
  assert.strictEqual(hasAfaanOromoKeywords('Midhaan koo gogeera'), true);

  // English & Amharic text should not match
  assert.strictEqual(hasAfaanOromoKeywords('Wheat stripe rust spotted on stem'), false);
  assert.strictEqual(hasAfaanOromoKeywords('ስንዴ'), false);
  assert.strictEqual(hasAfaanOromoKeywords(''), false);
  assert.strictEqual(hasAfaanOromoKeywords(null), false);
  assert.strictEqual(hasAfaanOromoKeywords(undefined), false);
});

test('detect-language: resolveUserLanguage respects language hierarchy and fallbacks', () => {
  // 1. Ethiopic script always resolves to 'am'
  assert.strictEqual(resolveUserLanguage('የስንዴ ዝገት ምልክት አለው'), 'am');
  assert.strictEqual(resolveUserLanguage('ጤፍ እንዴት ማከም እችላለሁ?', 'en'), 'am'); // Script overrides preferred language

  // 2. Afaan Oromoo terms resolve to 'om'
  assert.strictEqual(resolveUserLanguage('Waagii qamadii akkamiin wal\'aanna?'), 'om');
  assert.strictEqual(resolveUserLanguage('Dhibee boqqolloo naannoo Baddaa-daree', 'en'), 'om');

  // 3. Explicit preferredLanguage fallback when English text is provided
  assert.strictEqual(resolveUserLanguage('My crops are yellowing rapidly', 'am'), 'am');
  assert.strictEqual(resolveUserLanguage('My crops are yellowing rapidly', 'om'), 'om');
  assert.strictEqual(resolveUserLanguage('My crops are yellowing rapidly', 'en'), 'en');

  // 4. Default fallback to 'en'
  assert.strictEqual(resolveUserLanguage('Yellow spots on the leaves'), 'en');
  assert.strictEqual(resolveUserLanguage(''), 'en');
  assert.strictEqual(resolveUserLanguage(null), 'en');
  assert.strictEqual(resolveUserLanguage(undefined), 'en');
});

test('detect-language: LANGUAGE_LABELS contains all supported languages', () => {
  assert.strictEqual(LANGUAGE_LABELS.en, 'English');
  assert.strictEqual(LANGUAGE_LABELS.am, 'Amharic (አማርኛ)');
  assert.strictEqual(LANGUAGE_LABELS.om, 'Afaan Oromoo');
});
