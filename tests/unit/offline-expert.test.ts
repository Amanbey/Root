import test from 'node:test';
import assert from 'node:assert/strict';
import { generateOfflineAdviceCard } from '@/lib/offline/offline-expert';

test('offline-expert: generates fully formed offline AdviceCard in English', () => {
  const card = generateOfflineAdviceCard({
    cropType: 'Teff',
    symptoms: 'Orange brown powdery pustules and lodging on stems',
    region: 'Amhara',
    agroZone: 'Weyna Dega',
    preferredLanguage: 'en',
  });

  assert.ok(card.id.startsWith('offline-card-'));
  assert.ok(card.question_id.startsWith('offline-q-'));
  assert.strictEqual(card.primary_crop, 'Teff');
  assert.strictEqual(card.diagnosis_name, 'Teff Rust');
  assert.strictEqual(card.scientific_name, 'Uromyces eragrostidis');
  assert.ok(card.confidence_score >= 50);
  assert.ok(['low', 'medium', 'high', 'critical'].includes(card.urgency));
  assert.ok(card.visual_indicators.length > 0);
  assert.ok(card.probable_causes.length > 0);
  assert.ok(card.immediate_actions.length > 0);
  assert.ok(card.organic_remedies.length > 0);
  assert.ok(card.chemical_remedies.length > 0);
  assert.ok(card.preventive_measures.length > 0);
  assert.ok(card.local_context_notes.includes('Amhara'));
  assert.ok(card.agent_summary.includes('100% Offline Engine'));
});

test('offline-expert: generates localized offline AdviceCard in Amharic when Ethiopic script is entered', () => {
  const card = generateOfflineAdviceCard({
    cropType: 'Wheat',
    symptoms: 'በስንዴ ቅጠሎች ላይ ቢጫ ዝገት መሰል መስመሮች ታይተዋል',
    region: 'Oromia',
    agroZone: 'Dega',
  });

  assert.strictEqual(card.primary_crop, 'Wheat');
  assert.strictEqual(card.diagnosis_name, 'የስንዴ ቢጫ ዝገት (Wheat Stripe / Yellow Rust)');
  assert.ok(card.agent_summary.includes('100% ከመስመር ውጭ'));
  assert.ok(card.local_context_notes.includes('ከመስመር ውጭ የተዘጋጀ የምክር አገልግሎት'));
  assert.ok(card.organic_remedies.length > 0);
});

test('offline-expert: generates localized offline AdviceCard in Afaan Oromoo when Oromo keywords are entered', () => {
  const card = generateOfflineAdviceCard({
    cropType: 'Maize',
    symptoms: 'Raammoo boqqolloo baala irratti dhibee uumeera',
    region: 'Oromia',
    agroZone: 'Weyna Dega',
  });

  assert.strictEqual(card.primary_crop, 'Maize');
  assert.strictEqual(card.diagnosis_name, 'Ilbiisa Raayyaa / Raammoo Boqqolloo (Fall Armyworm)');
  assert.ok(card.agent_summary.includes('100% Ogeessa Toora-malee'));
  assert.ok(card.local_context_notes.includes('Gorsi toora-malee'));
  assert.ok(card.immediate_actions.length > 0);
});
