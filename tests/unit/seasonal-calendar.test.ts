import test from 'node:test';
import assert from 'node:assert/strict';
import { getCurrentEthiopianSeason } from '@/lib/agronomy/seasonal-calendar';
import { AgroEcologicalZone } from '@/lib/types';

test('seasonal-calendar: maps all 12 Gregorian months to correct Ethiopian agricultural seasons', () => {
  // Bega (October - January)
  const begaMonths = [10, 11, 12, 1]; // Oct, Nov, Dec, Jan
  for (const month of begaMonths) {
    const d = new Date(2026, month - 1, 15);
    const advisory = getCurrentEthiopianSeason(d);
    assert.strictEqual(advisory.season, 'Bega', `Month ${month} should be Bega`);
    assert.ok(advisory.localName.en.includes('Bega'));
    assert.ok(advisory.localName.am.includes('በጋ'));
    assert.ok(advisory.localName.om.includes('Bona'));
  }

  // Belg (February - May)
  const belgMonths = [2, 3, 4, 5]; // Feb, Mar, Apr, May
  for (const month of belgMonths) {
    const d = new Date(2026, month - 1, 15);
    const advisory = getCurrentEthiopianSeason(d);
    assert.strictEqual(advisory.season, 'Belg', `Month ${month} should be Belg`);
    assert.ok(advisory.localName.en.includes('Belg'));
    assert.ok(advisory.localName.am.includes('በልግ'));
    assert.ok(advisory.localName.om.includes('Arfaasaa'));
  }

  // Meher (June - September)
  const meherMonths = [6, 7, 8, 9]; // Jun, Jul, Aug, Sep
  for (const month of meherMonths) {
    const d = new Date(2026, month - 1, 15);
    const advisory = getCurrentEthiopianSeason(d);
    assert.strictEqual(advisory.season, 'Meher', `Month ${month} should be Meher`);
    assert.ok(advisory.localName.en.includes('Meher'));
    assert.ok(advisory.localName.am.includes('መኸር'));
    assert.ok(advisory.localName.om.includes('Ganna'));
  }
});

test('seasonal-calendar: provides complete multilingual guidance for all agro-ecological zones', () => {
  const seasons = [
    new Date(2026, 0, 15), // Bega (January)
    new Date(2026, 3, 15), // Belg (April)
    new Date(2026, 7, 15), // Meher (August)
  ];

  const zones: AgroEcologicalZone[] = ['Dega', 'Weyna Dega', 'Kolla', 'Bereha'];

  for (const date of seasons) {
    const adv = getCurrentEthiopianSeason(date);

    // Multilingual actions and warnings
    assert.ok(adv.criticalActions.en.length > 0, `English critical actions present for ${adv.season}`);
    assert.ok(adv.criticalActions.am.length > 0, `Amharic critical actions present for ${adv.season}`);
    assert.ok(adv.criticalActions.om.length > 0, `Oromo critical actions present for ${adv.season}`);

    assert.ok(adv.pestWarnings.en.length > 0, `English pest warnings present for ${adv.season}`);
    assert.ok(adv.pestWarnings.am.length > 0, `Amharic pest warnings present for ${adv.season}`);
    assert.ok(adv.pestWarnings.om.length > 0, `Oromo pest warnings present for ${adv.season}`);

    // All 4 zones present with en, am, om
    for (const zone of zones) {
      const tip = adv.zoneSpecificTips[zone];
      assert.ok(tip, `Zone tip exists for zone "${zone}" in season "${adv.season}"`);
      assert.ok(tip.en.length > 0, `English tip present for "${zone}"`);
      assert.ok(tip.am.length > 0, `Amharic tip present for "${zone}"`);
      assert.ok(tip.om.length > 0, `Oromo tip present for "${zone}"`);
    }
  }
});
