/**
 * ROOT – AGENT 2: LOCAL CONTEXT AGENT
 * Adapts agronomic diagnoses to Ethiopian agro-ecological zones (Dega, Weyna Dega, Kolla, Bereha),
 * local soil dynamics, altitude bands, and seasonal weather patterns (Belg vs. Meher).
 */

import { AgroEcologicalZone } from '@/lib/types';
import { CouncilContextInput, DiagnosticAgentOutput, LocalContextAgentOutput } from './types';

interface ZoneProfile {
  altitude: string;
  climate: string;
  commonSoils: string[];
  seasonalRisks: {
    meher: string;
    belg: string;
    bega: string;
  };
  recommendedOrganicInputs: string[];
}

const ZONE_PROFILES: Record<AgroEcologicalZone, ZoneProfile> = {
  'Weyna Dega': {
    altitude: '1,500m – 2,400m (Highland Midlands)',
    climate: 'Temperate highland climate, 18°C–24°C, 800–1200mm rainfall',
    commonSoils: ['Heavy Vertisols (Black clay soil)', 'Nitisols (Red fertile clay)'],
    seasonalRisks: {
      meher: 'Waterlogging in black Vertisols increases root asphyxiation and spore germination. Drainage furrows essential.',
      belg: 'Unpredictable shower breaks may stress young seedlings; watch for moisture-seeking aphid colonies.',
      bega: 'Post-harvest wind dispersal of rust and smut spores across plateau plains.',
    },
    recommendedOrganicInputs: [
      'Wood ash (Amed) from Eucalyptus firewood for foliar dusting and spore suppression',
      'Broad bed and furrow (BBM) ridges to prevent standing water in heavy black soils',
      'Fermented cattle manure slurry with wild stinging nettle (Sama) for leaf cuticle reinforcement',
      'Neem seed kernel extract (accessible in nearby midland river valleys)',
    ],
  },
  'Dega': {
    altitude: '> 2,400m (Cool Highlands)',
    climate: 'Cold, 10°C–16°C, frequent night frost and morning mist/fog',
    commonSoils: ['Acidic Nitisols', 'Luvisols', 'Andosols'],
    seasonalRisks: {
      meher: 'Persistent canopy wetness (>6 hours daily) triggers acute Stripe Rust (Puccinia) and Late Blight epidemics.',
      belg: 'Frost injury creates entry wounds for secondary fungal pathogens.',
      bega: 'Severe night frosts; early morning sun scald.',
    },
    recommendedOrganicInputs: [
      'Agricultural lime or fine wood ash to counteract highland soil acidity and boost silica',
      'Stinging nettle (Sama) extract fermented for 5 days as a natural bio-stimulant',
      'Dense straw mulch between rows to moderate nocturnal soil temperature swings',
      'Windbreaks of indigenous trees (Hagenia abyssinica / Kosso, Juniperus procera)',
    ],
  },
  'Kolla': {
    altitude: '500m – 1,500m (Warm Lowlands)',
    climate: 'Hot, semi-arid, 25°C–32°C, erratic rainfall (400–700mm)',
    commonSoils: ['Fluvisols', 'Arenosols (Sandy loam)', 'Vertic soils'],
    seasonalRisks: {
      meher: 'High heat accelerates insect lifecycle: rapid Fall Armyworm, stem borer, and grasshopper surges.',
      belg: 'Prolonged dry spells cause acute moisture stress, weakening plant natural defenses.',
      bega: 'Severe desiccation; storage pests multiply in farm cribs.',
    },
    recommendedOrganicInputs: [
      'Locally wild-harvested Neem (Azedirachta indica) seed kernel spray (50g/L water)',
      'Push-pull companion planting: border with Napier grass to trap moths, intercrop with Desmodium',
      'Fine dry sand or wood ash placed directly in leaf whorls to desiccate caterpillar larvae',
      'Crop residue mulching to conserve critical soil moisture in hot sandy loams',
    ],
  },
  'Bereha': {
    altitude: '< 500m (Arid / Desert)',
    climate: 'Extremely hot and dry, >33°C, sparse precipitation (<300mm)',
    commonSoils: ['Solonchaks (Saline soils)', 'Sandy desert soils'],
    seasonalRisks: {
      meher: 'Flash runoff followed by rapid crusting of soil surface.',
      belg: 'Extreme heat halts vegetative growth.',
      bega: 'Intense salinity buildup around root zone during irrigation.',
    },
    recommendedOrganicInputs: [
      'Organic compost mulching to lower root temperature and prevent salt crusting',
      'Micro-drip or clay pot sub-surface irrigation to avoid evaporation',
      'Windbreak shelterbelts using drought-hardy Acacia and Moringa stenopetala',
    ],
  },
};

/**
 * Determines current seasonal phase in Ethiopia based on current month
 */
function getCurrentEthiopianSeason(): { name: 'Meher' | 'Belg' | 'Bega'; description: string } {
  const month = new Date().getMonth() + 1; // 1 to 12

  if (month >= 6 && month <= 10) {
    return {
      name: 'Meher',
      description: 'Meher (Main Rainy Season / Kiremt) – Peak crop vegetative and reproductive stage with high humidity.',
    };
  }
  if (month >= 2 && month <= 5) {
    return {
      name: 'Belg',
      description: 'Belg (Short Rains Season) – Critical moisture window for highland preparation and belg crops.',
    };
  }
  return {
    name: 'Bega',
    description: 'Bega (Dry / Harvest Season) – Maturation, threshing, storage, and residual moisture management.',
  };
}

export async function executeLocalContextAgent(
  input: CouncilContextInput,
  diagnosticOutput: DiagnosticAgentOutput
): Promise<LocalContextAgentOutput> {
  const zone = input.agroZone || 'Weyna Dega';
  const region = input.region || 'Oromia';
  const zoneProfile = ZONE_PROFILES[zone] || ZONE_PROFILES['Weyna Dega'];
  const season = getCurrentEthiopianSeason();

  const seasonRisk =
    season.name === 'Meher'
      ? zoneProfile.seasonalRisks.meher
      : season.name === 'Belg'
      ? zoneProfile.seasonalRisks.belg
      : zoneProfile.seasonalRisks.bega;

  const soilAndAltitudeFactors = [
    `Altitude band: ${zoneProfile.altitude} with ${zoneProfile.climate}`,
    `Predominant soil types in ${region}: ${zoneProfile.commonSoils.join(', ')}`,
    `Seasonal alert (${season.name}): ${seasonRisk}`,
  ];

  const localizedRemedies = [
    ...zoneProfile.recommendedOrganicInputs,
    `Rotate fields next cycle with traditional Ethiopian legumes (e.g. Faba bean / Bakela or Chickpea / Shimbra) to enrich nitrogen without expensive chemical urea.`,
  ];

  const culturalPractices = [
    'Establish 30cm raised beds or contour drainage furrows to stop stagnant water on heavy black Vertisols.',
    'Clear wild grass weed borders around plots that serve as alternate spore/pest reservoirs.',
    'Consult local Woreda Agricultural Office Development Agent (DA) for localized quarantine alerts.',
  ];

  const contextNotes = `Targeted for ${region} in the ${zone} agro-ecological zone (${zoneProfile.altitude}). Current seasonal context: ${season.name} season. Pathogen alert for ${diagnosticOutput.diagnosisName}: adapted to locally accessible resources (wood ash, neem, BBM ridges).`;

  return {
    agroZone: zone,
    seasonRecommendation: `${season.description} Action: ${seasonRisk}`,
    altitudeRange: zoneProfile.altitude,
    soilFactors: soilAndAltitudeFactors,
    localizedRemedies,
    culturalPractices,
    contextNotes,
  };
}
