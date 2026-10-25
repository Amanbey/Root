import test from 'node:test';
import assert from 'node:assert/strict';
import { translations, Translations } from '@/lib/i18n/translations';

test('translations-parity: all languages have 100% key parity with English', () => {
  const enKeys = Object.keys(translations.en) as (keyof Translations)[];
  const amKeys = Object.keys(translations.am) as (keyof Translations)[];
  const omKeys = Object.keys(translations.om) as (keyof Translations)[];

  assert.strictEqual(enKeys.length > 0, true, 'English translations dictionary must not be empty');

  // Check Amharic
  const missingInAm = enKeys.filter((k) => !amKeys.includes(k));
  assert.deepStrictEqual(missingInAm, [], `Amharic dictionary is missing keys: ${missingInAm.join(', ')}`);

  // Check Afaan Oromoo
  const missingInOm = enKeys.filter((k) => !omKeys.includes(k));
  assert.deepStrictEqual(missingInOm, [], `Afaan Oromoo dictionary is missing keys: ${missingInOm.join(', ')}`);

  // Verify non-empty values for all keys in all 3 languages
  for (const key of enKeys) {
    const valEn = translations.en[key];
    const valAm = translations.am[key];
    const valOm = translations.om[key];

    assert.ok(
      typeof valEn === 'string' && valEn.trim().length > 0,
      `Key "${key}" has empty value in English`
    );
    assert.ok(
      typeof valAm === 'string' && valAm.trim().length > 0,
      `Key "${key}" has empty value in Amharic`
    );
    assert.ok(
      typeof valOm === 'string' && valOm.trim().length > 0,
      `Key "${key}" has empty value in Afaan Oromoo`
    );
  }
});

test('translations-parity: recently added auth gateway and prompt keys are fully localized', () => {
  const authKeys: (keyof Translations)[] = [
    'auth_tab_login',
    'auth_tab_register',
    'auth_already_registered_prompt',
    'auth_new_user_prompt',
    'auth_intent_diagnose_title',
    'auth_intent_diagnose_desc',
    'auth_modal_title',
    'auth_modal_subtitle',
    'auth_modal_login_btn',
    'auth_modal_register_btn',
  ];

  for (const k of authKeys) {
    assert.ok(translations.en[k]?.length > 0, `Key "${k}" missing in English`);
    assert.ok(translations.am[k]?.length > 0, `Key "${k}" missing in Amharic`);
    assert.ok(translations.om[k]?.length > 0, `Key "${k}" missing in Afaan Oromoo`);
  }
});
