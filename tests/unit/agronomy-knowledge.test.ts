import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getCropKnowledgeProfile,
  AGRONOMY_KNOWLEDGE_BASE,
} from '@/lib/agronomy/knowledge-base';
import { SupportedLanguage } from '@/lib/types';

const CROPS = ['teff', 'wheat', 'maize', 'coffee', 'potato', 'enset'];
const LANGUAGES: SupportedLanguage[] = ['en', 'am', 'om'];

test('agronomy-knowledge: all languages contain profiles for core Ethiopian crops', () => {
  for (const lang of LANGUAGES) {
    const dict = AGRONOMY_KNOWLEDGE_BASE[lang];
    assert.ok(dict, `Knowledge base dictionary exists for language "${lang}"`);

    for (const crop of CROPS) {
      const profile = dict[crop];
      assert.ok(profile, `Profile exists for crop "${crop}" in language "${lang}"`);
      assert.ok(profile.diagnosis.length > 0, `Diagnosis is non-empty for ${crop} (${lang})`);
      assert.ok(profile.scientific.length > 0, `Scientific name is non-empty for ${crop} (${lang})`);
      assert.ok(profile.confidence >= 50 && profile.confidence <= 100, `Confidence is valid (50-100) for ${crop} (${lang})`);
      assert.ok(['low', 'medium', 'high', 'critical'].includes(profile.urgency), `Urgency is valid for ${crop} (${lang})`);
      assert.ok(profile.indicators.length > 0, `Indicators are provided for ${crop} (${lang})`);
      assert.ok(profile.causes.length > 0, `Causes are provided for ${crop} (${lang})`);
      assert.ok(profile.actions.length > 0, `Actions are provided for ${crop} (${lang})`);
      assert.ok(profile.organic.length > 0, `Organic remedies are provided for ${crop} (${lang})`);
      assert.ok(profile.chemical.length > 0, `Chemical remedies are provided for ${crop} (${lang})`);
      assert.ok(profile.preventive.length > 0, `Preventive measures are provided for ${crop} (${lang})`);
      assert.ok(profile.context.length > 0, `Agro-ecological context is non-empty for ${crop} (${lang})`);
      assert.ok(profile.season.length > 0, `Seasonal recommendation is non-empty for ${crop} (${lang})`);
      assert.ok(profile.summary.length > 0, `Agent summary is non-empty for ${crop} (${lang})`);
    }
  }
});

test('agronomy-knowledge: getCropKnowledgeProfile handles aliases across English, Amharic, and Afaan Oromoo', () => {
  // Teff aliases
  const teffEn = getCropKnowledgeProfile('Teff', 'en');
  const teffAm = getCropKnowledgeProfile('ጤፍ', 'am');
  const teffOm = getCropKnowledgeProfile('xaafii', 'om');
  assert.strictEqual(teffEn.diagnosis, 'Teff Rust');
  assert.strictEqual(teffAm.diagnosis, 'የጤፍ ዝገት በሽታ (Teff Rust)');
  assert.strictEqual(teffOm.diagnosis, 'Dhibee Waagii Xaafii (Teff Rust)');

  // Wheat aliases
  const wheatEn = getCropKnowledgeProfile('Wheat', 'en');
  const wheatAm = getCropKnowledgeProfile('ስንዴ', 'am');
  const wheatOm = getCropKnowledgeProfile('qamadii', 'om');
  assert.strictEqual(wheatEn.diagnosis, 'Wheat Stripe / Yellow Rust');
  assert.strictEqual(wheatAm.diagnosis, 'የስንዴ ቢጫ ዝገት (Wheat Stripe / Yellow Rust)');
  assert.strictEqual(wheatOm.diagnosis, 'Waagii Qamadii Boora / Keelloo (Wheat Stripe Rust)');

  // Maize aliases
  const maizeEn = getCropKnowledgeProfile('Maize', 'en');
  const maizeAm = getCropKnowledgeProfile('በቆሎ', 'am');
  const maizeOm = getCropKnowledgeProfile('boqqolloo', 'om');
  assert.strictEqual(maizeEn.diagnosis, 'Fall Armyworm');
  assert.strictEqual(maizeAm.diagnosis, 'የመኸር ሰራዊት ተምች (Fall Armyworm)');
  assert.strictEqual(maizeOm.diagnosis, 'Ilbiisa Raayyaa / Raammoo Boqqolloo (Fall Armyworm)');

  // Coffee aliases
  const coffeeEn = getCropKnowledgeProfile('Coffee', 'en');
  const coffeeAm = getCropKnowledgeProfile('ቡና', 'am');
  const coffeeOm = getCropKnowledgeProfile('buna', 'om');
  assert.strictEqual(coffeeEn.diagnosis, 'Coffee Berry Disease (CBD)');
  assert.strictEqual(coffeeAm.diagnosis, 'የቡና ፍሬ በሽታ (Coffee Berry Disease - CBD)');
  assert.strictEqual(coffeeOm.diagnosis, 'Dhibee Firii Bunaa / Wanjaa (Coffee Berry Disease - CBD)');
});

test('agronomy-knowledge: getCropKnowledgeProfile falls back gracefully to wheat for unknown crops', () => {
  const fallbackProfile = getCropKnowledgeProfile('unknown_exotic_crop', 'en');
  assert.ok(fallbackProfile, 'Returns a valid fallback profile');
  assert.strictEqual(fallbackProfile.diagnosis, 'Wheat Stripe / Yellow Rust');
});
