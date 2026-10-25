/**
 * ROOT – AGENT 2: LOCAL CONTEXT AGENT
 * Adapts agronomic diagnoses to Ethiopian agro-ecological zones (Dega, Weyna Dega, Kolla, Bereha),
 * local soil dynamics, altitude bands, and seasonal weather patterns (Belg vs. Meher).
 * Generates output strictly in the specific language used by the farmer (Amharic, Afaan Oromoo, or English).
 */

import { AgroEcologicalZone, SupportedLanguage } from '@/lib/types';
import { CouncilContextInput, DiagnosticAgentOutput, LocalContextAgentOutput } from './types';
import { resolveUserLanguage } from '@/lib/i18n/detect-language';

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

const MULTILINGUAL_ZONE_PROFILES: Record<SupportedLanguage, Record<AgroEcologicalZone, ZoneProfile>> = {
  en: {
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
  },
  am: {
    'Weyna Dega': {
      altitude: '1,500ሜ – 2,400ሜ (ወይና ደጋ / መካከለኛ ደጋ)',
      climate: 'ተስማሚ ሞቃታማ የአየር ንብረት፣ 18°C–24°C፣ 800–1200ሚሜ ዝናብ',
      commonSoils: ['ከባድ የኮትቻ አፈር (ጥቁር አፈር)', 'ቀይ ለም አፈር (ኒቲሶል)'],
      seasonalRisks: {
        meher: 'በኮትቻ አፈር ላይ ውኃ መተኛት የስር መታፈንን እና የፈንገስ መራባትን ያባብሳል። የውኃ መውረጃ ቦዮች የግድ ያስፈልጋሉ።',
        belg: 'ያልተጠበቀ የበልግ ዝናብ መቆራረጥ ለጋ ቡቃያዎችን ሊጎዳ ይችላል፤ ቅጠል አፊዶችን በንቃት ይከታተሉ።',
        bega: 'ከመከር በኋላ በንፋስ የሚጓጓዙ የዝገት እና የዋግ ስፖሮች በሜዳዎች ላይ መሰራጨት።',
      },
      recommendedOrganicInputs: [
        'የእንጨት አመድ ከባህር ዛፍ እንጨት ለቅጠል ርጭትና ስፖርን ለመግታት',
        'በከባድ ጥቁር አፈር ላይ ውኃ እንዳይተኛ ከፍ ያሉ ድልድሎችና ቦዮች (BBM) ማዘጋጀት',
        'የበሰበሰ የበሬ ፍግ ውህድ ከሳማ ጋር ቅጠልን ለማጠንከር ማዘጋጀት',
        'በአቅራቢያ ካሉ ቆላማ ወንዞች የሚገኝ የኒም (Neem) ፍሬ ጭማቂ',
      ],
    },
    'Dega': {
      altitude: '> 2,400ሜ (ቀዝቃዛ ደጋ)',
      climate: 'ቀዝቃዛ፣ 10°C–16°C፣ የበረዶ ቅዝቃዜና የጠዋት ጉም',
      commonSoils: ['አሲዳማ ቀይ አፈር', 'ሉቪሶል', 'አንዶሶል'],
      seasonalRisks: {
        meher: 'ተከታታይ የቅጠል እርጥበት (>6 ሰዓታት በየቀኑ) ለስንዴ ቢጫ ዝገት እና ለድንች ብላይት ምቹ ሁኔታ ይፈጥራል።',
        belg: 'የበረዶ መምታት ለፈንገስ በሽታዎች መግቢያ በር ይፈጥራል።',
        bega: 'ከባድ የሌሊት ውርጭ እና የማለዳ ፀሐይ መቃጠል ስጋቶች።',
      },
      recommendedOrganicInputs: [
        'የደጋ አፈር አሲዳማነትን ለማስተካከል እና ሲሊካን ለመጨመር የግብርና ኖራ ወይም ጥሩ የእንጨት አመድ',
        'ለ5 ቀናት የዳመቀ የሳማ ውህድ እንደ ተፈጥሮአዊ ማነቃቂያ',
        'የሌሊት ቅዝቃዜን ለመቀነስ በሰብል ረድፎች መካከል የገለባ ሙልች መጎዝጎዝ',
        'የአካባቢ ዛፎችን (ኮሶ፣ ጥድ) እንደ ንፋስ መከላከያ ማቆየት',
      ],
    },
    'Kolla': {
      altitude: '500ሜ – 1,500ሜ (ሞቃታማ ቆላ)',
      climate: 'ሞቃታማ ከፊል ደረቅ፣ 25°C–32°C፣ ተለዋዋጭ ዝናብ (400–700ሚሜ)',
      commonSoils: ['ፍሉቪሶል', 'አሸዋማ ለም አፈር', 'ቨርቲክ አፈር'],
      seasonalRisks: {
        meher: 'ከፍተኛ ሙቀት የተባዮችን እድገት ያፋጥናል፤ የመኸር ሰራዊት ተምች እና አንበጣ በፍጥነት ይራባሉ።',
        belg: 'የረዘመ ድርቅ ተክሎችን በማዳከም ለተባይ ተጋላጭ ያደርጋቸዋል።',
        bega: 'ከፍተኛ መድረቅ፤ በጎተራ ውስጥ እህል አጥቂ ተባዮች መብዛት።',
      },
      recommendedOrganicInputs: [
        'በአካባቢው የሚገኝ የኒም ፍሬ ውህድ (50ግ/ሊ ውኃ) ርጭት',
        'ፑሽ-ፑል ዘዴ፡ ማሳውን በዝሆኔ ሳር ማጠርና በመካከል ዴስሞዲየም መዝራት',
        'አባጨጓሬን ለማፈን ንጹህ ደረቅ አሸዋ ወይም አመድ በቅጠል እምብርት ውስጥ ማድረግ',
        'የአፈር እርጥበትን ለመጠበቅ የሰብል ተረፈ ምርት መጎዝጎዝ',
      ],
    },
    'Bereha': {
      altitude: '< 500ሜ (በረሃ / ደረቅ)',
      climate: 'እጅግ ሞቃትና ደረቅ፣ >33°C፣ አነስተኛ ዝናብ (<300ሚሜ)',
      commonSoils: ['ጨዋማ አፈር', 'አሸዋማ የበረሃ አፈር'],
      seasonalRisks: {
        meher: 'ድንገተኛ የጎርፍ ፍሳሽ ተከትሎ የአፈር ላይኛው ክፍል መድረቅና መሰነጣጠቅ።',
        belg: 'ከፍተኛ ሙቀት የተክሎችን እድገት መግታት።',
        bega: 'በመስኖ ወቅት በስር ዙሪያ የጨው ክምችት መጨመር።',
      },
      recommendedOrganicInputs: [
        'የስር ሙቀትን ለመቀነስና ጨው እንዳይከማች የኮምፖስት ሙልች መጠቀም',
        'ውኃ እንዳይተን ጠብታ መስኖ ወይም የሸክላ ማሰሮ መስኖ መጠቀም',
        'ድርቅ ተቋቋሚ ዛፎችን (ግራር እና ሽፈራው) እንደ ከለላ ማቆየት',
      ],
    },
  },
  om: {
    'Weyna Dega': {
      altitude: '1,500m – 2,400m (Baddaa-daree)',
      climate: 'Qilleensa madaalawaa baddaa-daree, 18°C–24°C, rooba 800–1200mm',
      commonSoils: ['Biyyoo Kotichaa (biyyoo gurraacha furdaa)', 'Biyyoo Diimaa gabbataa'],
      seasonalRisks: {
        meher: 'Biyyoo kotichaa keessatti bishaan dhangala\'uun dhibee fi fangasii baay\'isa. Bo\'oo baasuun murteessaadha.',
        belg: 'Roobni arfaasaa caccabee dhaabbachuun biqila miidhuu danda\'a; ilbiisota hordofaa.',
        bega: 'Erga haamamee booda bubbeen kottee dhibee waagii gara biraatti geessuu danda\'a.',
      },
      recommendedOrganicInputs: [
        'Daaraa muka baargamoo qulqulluu baala irratti firfirsuun fangasii ittisuu',
        'Biyyoo kotichaa keessatti bishaan akka hin taaneef bo\'oo bal\'aa (BBM) qopheessuu',
        'Dikee loonii bilchaate doobbii (Samaa) wajjin makuun baala jabeessuu',
        'Dhangala\'aa firii Niimii laga gammoojjii dhihoo irraa argamu biifuu',
      ],
    },
    'Dega': {
      altitude: '> 2,400m (Baddaa qabbanaawaa)',
      climate: 'Qabbanaawaa, 10°C–16°C, fixeensa halkanii fi hurrii ganamaa',
      commonSoils: ['Biyyoo Diimaa dhangaggaa\'aa', 'Luvisols', 'Andosols'],
      seasonalRisks: {
        meher: 'Baalli yeroo dheeraa jiidhee turuun (>sa\'a 6) waagii qamadii keelloo fi dhaala dinnichaa saffisiisa.',
        belg: 'Cabiin halkanii madaa uumuun fangasiif karaa bana.',
        bega: 'Qabbana cimaa halkan fi aduu barii gubaa fidu.',
      },
      recommendedOrganicInputs: [
        'Dhangaggaa\'ummaa biyyoo sirreessuuf nooraa qonnaa ykn daaraa muka qulqulluu fayyadamuu',
        'Dhangala\'aa doobbii (Samaa) guyyaa 5 bulfame akka dandeettii biqilaa cimsuutti biifuu',
        'Jijjiirama qabbana halkan hir\'isuuf haphata cidii sarara jidduutti afuu',
        'Mukkeen dhalootaa (Heexoo, Birbira) akka gaaddisa bubbeetti eeggachuu',
      ],
    },
    'Kolla': {
      altitude: '500m – 1,500m (Gammoojjii ho\'aa)',
      climate: 'Ho\'aa, rooba muraasa (400–700mm), 25°C–32°C',
      commonSoils: ['Biyyoo cirracha madaalawaa', 'Biyyoo Vertic'],
      seasonalRisks: {
        meher: 'Ho\'i guddaan wal-hormaata ilbiisotaa saffisiisa: Raammoo boqqolloo fi hawaannisa baay\'isa.',
        belg: 'Gogiinsi dheerachuun biqila laaffisee dhibeef saaxila.',
        bega: 'Gogiinsa cimaa; gootaraa keessatti ilbiisota callaa nyaatan baay\'isuu.',
      },
      recommendedOrganicInputs: [
        'Dhangala\'aa firii Niimii (50g/L bishaan) biifuu',
        'Teeknolojii Push-Pull: Maasaa naannessanii Saari-harbaa dhaabuu, gidduutti Desmodium facaasuu',
        'Cirracha gogaa ykn daaraa muka handhuura boqqolloo keessa buusuun raammoo dhabamsiisuu',
        'Jiidhinsa lafaa eeguuf kosiin lafa uffisuu',
      ],
    },
    'Bereha': {
      altitude: '< 500m (Gammoojjii lafa baddaa hin taane / Gammoojjii hamaa)',
      climate: 'Ho\'aa fi gogaa cimaa, >33°C, rooba gadi aanaa (<300mm)',
      commonSoils: ['Biyyoo sogidda qabu', 'Cirracha gammoojjii'],
      seasonalRisks: {
        meher: 'Lolaan tasaa erga darbee booda gubbaan lafaa dafee gogee baqaquu.',
        belg: 'Ho\'i hamaa guddina biqilaa dhaabuu.',
        bega: 'Yeroo bishaan lafatti naqan sogiddi hiddi jalaatti kuulamuu.',
      },
      recommendedOrganicInputs: [
        'Ho\'a lafaa hir\'isuu fi sogidda ittisuuf kompoostii afuu',
        'Bishaan akka hin hurrineef jallisi bifa cobsaa fayyadamuu',
        'Mukkeen gammoojjii dandamatan (Laaftoo fi Moringaa) dallaa gochuu',
      ],
    },
  },
};

function getSeasonalInfo(lang: SupportedLanguage): { name: string; description: string; phase: 'meher' | 'belg' | 'bega' } {
  const month = new Date().getMonth() + 1; // 1 to 12

  if (month >= 6 && month <= 10) {
    if (lang === 'am') {
      return {
        name: 'መኸር',
        description: 'መኸር (ዋናው የክረምት ወቅት) – ከፍተኛ እርጥበትና የሰብል እድገት ደረጃ።',
        phase: 'meher',
      };
    }
    if (lang === 'om') {
      return {
        name: 'Ganna',
        description: 'Waqtii Ganna (Rooba Guddaa) – Yeroo biqilli saffisaan guddatu fi jiidhinni olka\'u.',
        phase: 'meher',
      };
    }
    return {
      name: 'Meher',
      description: 'Meher (Main Rainy Season / Kiremt) – Peak crop vegetative and reproductive stage with high humidity.',
      phase: 'meher',
    };
  }

  if (month >= 2 && month <= 5) {
    if (lang === 'am') {
      return {
        name: 'በልግ',
        description: 'በልግ (የአጭር ዝናብ ወቅት) – ለደጋማ እርሻ ዝግጅት እና ለበልግ ሰብሎች ወሳኝ መስኮት።',
        phase: 'belg',
      };
    }
    if (lang === 'om') {
      return {
        name: 'Arfaasaa',
        description: 'Waqtii Arfaasaa (Rooba Giddu-galeessaa) – Yeroo qophii maasaa fi sanyii arfaasaa.',
        phase: 'belg',
      };
    }
    return {
      name: 'Belg',
      description: 'Belg (Short Rains Season) – Critical moisture window for highland preparation and belg crops.',
      phase: 'belg',
    };
  }

  if (lang === 'am') {
    return {
      name: 'በጋ',
      description: 'በጋ (የደረቅ / የመከር ወቅት) – እህል መብሰያ፣ ማጨጃ፣ ውቂያ እና የተረፈ እርጥበት አያያዝ።',
      phase: 'bega',
    };
  }
  if (lang === 'om') {
    return {
      name: 'Bona',
      description: 'Waqtii Bona (Qooraa fi Haamaa) – Yeroo callaan bilchaatu, haamamu fi kuufamu.',
      phase: 'bega',
    };
  }
  return {
    name: 'Bega',
    description: 'Bega (Dry / Harvest Season) – Maturation, threshing, storage, and residual moisture management.',
    phase: 'bega',
  };
}

export async function executeLocalContextAgent(
  input: CouncilContextInput,
  diagnosticOutput: DiagnosticAgentOutput
): Promise<LocalContextAgentOutput> {
  const lang = resolveUserLanguage(input.symptoms, input.preferredLanguage);
  const zone = input.agroZone || 'Weyna Dega';
  const region = input.region || 'Oromia';

  const zoneDict = MULTILINGUAL_ZONE_PROFILES[lang] || MULTILINGUAL_ZONE_PROFILES.en;
  const zoneProfile = zoneDict[zone] || zoneDict['Weyna Dega'];
  const seasonInfo = getSeasonalInfo(lang);

  const seasonRisk =
    seasonInfo.phase === 'meher'
      ? zoneProfile.seasonalRisks.meher
      : seasonInfo.phase === 'belg'
      ? zoneProfile.seasonalRisks.belg
      : zoneProfile.seasonalRisks.bega;

  let soilAndAltitudeFactors: string[] = [];
  let localizedRemedies: string[] = [];
  let culturalPractices: string[] = [];
  let contextNotes = '';

  if (lang === 'am') {
    soilAndAltitudeFactors = [
      `የከፍታ ክልል፡ ${zoneProfile.altitude}፣ ${zoneProfile.climate}`,
      `በ${region} በስፋት የሚገኙ የአፈር ዓይነቶች፡ ${zoneProfile.commonSoils.join('፣ ')}`,
      `የወቅቱ ስጋት (${seasonInfo.name})፡ ${seasonRisk}`,
    ];

    localizedRemedies = [
      ...zoneProfile.recommendedOrganicInputs,
      `ውድ የዩሪያ ማዳበሪያን ሳያስፈልግ ናይትሮጅንን ለመጨመር በሚቀጥለው ዙር ከባህላዊ የኢትዮጵያ ጥራጥሬዎች (ባቄላ ወይም ሽምብራ) ጋር ማፈራረቅ።`,
    ];

    culturalPractices = [
      'በከባድ የኮትቻ (ጥቁር) አፈር ላይ ውኃ እንዳይተኛ 30 ሳ.ሜ ከፍ ያሉ ቦዮችን ወይም የውኃ መውረጃ መስመሮችን ማዘጋጀት።',
      'ለፈንገስና ለተባይ መሸሸጊያ የሚሆኑ የዱር ሳርና አረሞችን ከማሳው ዙሪያ ማጽዳት።',
      'የአካባቢውን የወረዳ ግብርና ጽህፈት ቤት የልማት ጣቢያ ባለሙያ (DA) ለተጨማሪ ድጋፍ ማማከር።',
    ];

    contextNotes = `ለ${region} ክልል በ${zone} የአየር ንብረት ቀጠና (${zoneProfile.altitude}) የተዘጋጀ። የአሁን ወቅት፡ የ${seasonInfo.name} ወቅት። ለ${diagnosticOutput.diagnosisName} የቀረበ ማሳሰቢያ፡ በአካባቢ በሚገኙ ግብዓቶች (የእንጨት አመድ፣ ኒም፣ ቦዮች) ላይ የተመሰረተ።`;
  } else if (lang === 'om') {
    soilAndAltitudeFactors = [
      `Olka'iinsa lafaa: ${zoneProfile.altitude}, ${zoneProfile.climate}`,
      `Gosa biyyoo ${region} keessatti baay'atan: ${zoneProfile.commonSoils.join(', ')}`,
      `Akeekkachiisa waqtii (${seasonInfo.name}): ${seasonRisk}`,
    ];

    localizedRemedies = [
      ...zoneProfile.recommendedOrganicInputs,
      `Xaa'oo gatii qabu utuu hin barbaadin naayitiroojiinii dabaluuf marsaa itti aanutti midhaan dheedhii (baaqelaa ykn shumburaa) wajjin dabareen facaasuu.`,
    ];

    culturalPractices = [
      'Biyyoo kotichaa (gurraacha) keessatti bishaan akka hin dhangalaaneef bo\'oo seentimeetira 30 baasuu.',
      'Aramaa fi marga dhibee fi ilbiisa baatan qarqara maasaa irraa haxaa\'anii qulqulleessuu.',
      'Gorsa dabalataaf ogeessa misooma qonnaa (DA) aanaa qunnamsiisuu.',
    ];

    contextNotes = `Naannoo ${region} qilleensa ${zone} (${zoneProfile.altitude}) qophaa'e. Waqtii ammaa: Waqtii ${seasonInfo.name}. Dhibee ${diagnosticOutput.diagnosisName} ittisuuf qabeenya naannoo (daaraa muka, niimii, bo'oo) fayyadamuun qophaa'e.`;
  } else {
    soilAndAltitudeFactors = [
      `Altitude band: ${zoneProfile.altitude} with ${zoneProfile.climate}`,
      `Predominant soil types in ${region}: ${zoneProfile.commonSoils.join(', ')}`,
      `Seasonal alert (${seasonInfo.name}): ${seasonRisk}`,
    ];

    localizedRemedies = [
      ...zoneProfile.recommendedOrganicInputs,
      `Rotate fields next cycle with traditional Ethiopian legumes (e.g. Faba bean / Bakela or Chickpea / Shimbra) to enrich nitrogen without expensive chemical urea.`,
    ];

    culturalPractices = [
      'Establish 30cm raised beds or contour drainage furrows to stop stagnant water on heavy black Vertisols.',
      'Clear wild grass weed borders around plots that serve as alternate spore/pest reservoirs.',
      'Consult local Woreda Agricultural Office Development Agent (DA) for localized quarantine alerts.',
    ];

    contextNotes = `Targeted for ${region} in the ${zone} agro-ecological zone (${zoneProfile.altitude}). Current seasonal context: ${seasonInfo.name} season. Pathogen alert for ${diagnosticOutput.diagnosisName}: adapted to locally accessible resources (wood ash, neem, BBM ridges).`;
  }

  return {
    agroZone: zone,
    seasonRecommendation: `${seasonInfo.description} ${seasonRisk}`,
    altitudeRange: zoneProfile.altitude,
    soilFactors: soilAndAltitudeFactors,
    localizedRemedies,
    culturalPractices,
    contextNotes,
  };
}
