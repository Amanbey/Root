/**
 * ROOT – MULTILINGUAL ETHIOPIAN AGRONOMIC KNOWLEDGE BASE
 * Native agricultural intelligence for English (en), Amharic (am), and Afaan Oromoo (om).
 * Zero language mixing – authentic agronomic terminology approved for Ethiopian smallholders.
 */

import { SupportedLanguage, UrgencyLevel, EthiopianCrop } from '@/lib/types';

export interface CropKnowledgeProfile {
  diagnosis: string;
  scientific: string;
  confidence: number;
  urgency: UrgencyLevel;
  indicators: string[];
  causes: string[];
  actions: string[];
  organic: string[];
  chemical: string[];
  preventive: string[];
  context: string;
  season: string;
  summary: string;
}

export const AGRONOMY_KNOWLEDGE_BASE: Record<
  SupportedLanguage,
  Record<string, CropKnowledgeProfile>
> = {
  en: {
    teff: {
      diagnosis: 'Teff Rust',
      scientific: 'Uromyces eragrostidis',
      confidence: 93,
      urgency: 'high',
      indicators: [
        'Circular to oblong orange-brown powdery pustules on leaf blades and sheath',
        'Premature chlorosis and drying of lower canopy leaves',
        'Severe lodging due to weakened stem tissue near maturity',
      ],
      causes: [
        'High relative humidity (>80%) and persistent morning dew during tillering',
        'Dense broadcast sowing without line spacing',
        'Continuous teff cultivation without crop rotation',
      ],
      actions: [
        'Stop excessive irrigation or drainage accumulation in field depressions immediately',
        'Dust sieved wood ash along affected field perimeter to suppress spore transfer',
        'Harvest mature portions early to prevent shattering and secondary head mold',
      ],
      organic: [
        'Neem seed water extract: 500g crushed dry neem seeds steeped in 10L water for 12 hours, add 20ml soap and spray weekly',
        'Foliar wood ash spray: mix 1kg clean wood ash with 10L water, let settle, spray supernatant',
      ],
      chemical: [
        'Tilt (Propiconazole 250 EC) or Nativo 75 WG applied at 0.5L/ha only if infestation exceeds 20% before heading',
      ],
      preventive: [
        'Switch to row planting (20cm between rows) using recommended rate of 10-15 kg/ha seed instead of heavy broadcast',
        'Rotate with legumes (chickpea or grass pea) every 2 seasons',
        'Sow certified rust-tolerant varieties (e.g., Quncho / DZ-Cr-387 or Kora / DZ-Cr-438)',
      ],
      context:
        'Widespread across Weyna Dega midlands (1800m - 2400m) in East Shewa, Ada\'a, and West Gojjam during the main Meher season.',
      season: 'Meher Season: Monitor tillering and stem elongation closely following rain cycles.',
      summary:
        'Diagnostic Agent identified Uromyces eragrostidis teff rust based on pustule morphology. Immediate moisture reduction and neem/wood ash application recommended.',
    },
    wheat: {
      diagnosis: 'Wheat Stripe / Yellow Rust',
      scientific: 'Puccinia striiformis f. sp. tritici',
      confidence: 95,
      urgency: 'critical',
      indicators: [
        'Parallel linear stripes of bright yellow powdery pustules along leaf veins',
        'Foliar necrosis giving leaves a scorched, burnt appearance',
        'Stunted spikes with shriveled, light-weight grains',
      ],
      causes: [
        'Cool temperatures (10°C - 15°C) combined with high moisture and fog',
        'Breakdown of seedling resistance in older cultivars (e.g. Kubsa, Digalu)',
        'Wind-borne fungal spores travelling across highland plateaus',
      ],
      actions: [
        'Flag and isolate heavily infected field sections; remove early hotspot plants',
        'Avoid high nitrogen top-dressing which exacerbates fungal multiplication',
        'Consult nearest woreda development agent (DA) for localized quarantine alerts',
      ],
      organic: [
        'Stinging nettle slurry spray: steep 1kg crushed stinging nettle in 10L water for 5 days, spray diluted 1:5 to strengthen leaf cuticle',
        'Garlic-chili extract spray as a mild bio-fungicide during early symptom spotting',
      ],
      chemical: [
        'Rex Duo (Epoxiconazole + Thiophenate-methyl) at 0.75 L/ha or Tilt 250 EC at 0.5 L/ha applied at first stripe detection',
      ],
      preventive: [
        'Plant newly released resistant varieties: Danda\'a, Kakaba, Ogolcho, or Kingbird',
        'Mandatory crop rotation with faba bean, chickpea, or oilseeds',
        'Early sowing in June/July to escape peak late-season highland spore clouds',
      ],
      context:
        'High threat in Dega and Weyna Dega highlands (>2200m) in Arsi, Bale, and North Shewa. Early action prevents up to 70% yield loss.',
      season: 'Late Meher season: Critical vigilance required during boot and heading stages.',
      summary:
        'Diagnostic Agent detected acute Puccinia striiformis yellow rust. High urgency: prompt chemical or bio-fungicide barrier needed to preserve flag leaf photosynthetic area.',
    },
    maize: {
      diagnosis: 'Fall Armyworm',
      scientific: 'Spodoptera frugiperda',
      confidence: 94,
      urgency: 'high',
      indicators: [
        'Windowpaning: transparent patches on young whorl leaves where larvae scraped leaf tissue',
        'Ragged irregular holes resembling shot-hole gun damage',
        'Abundant moist yellowish-brown sawdust-like frass inside the central funnel',
      ],
      causes: [
        'Rapid reproduction cycle accelerated by warm temperatures (25°C - 30°C)',
        'Continuous staggered maize planting providing endless food source',
        'Lack of natural parasitic wasps and predators',
      ],
      actions: [
        'Handpick and destroy egg masses (felt-like patches) and young caterpillars in morning hours',
        'Place a pinch of clean dry soil or fine wood ash directly into each plant whorl to desiccate larvae',
        'Crush and bury fallen cobs and infested tassels',
      ],
      organic: [
        'Neem seed kernel extract (50g/L) sprayed directly into central whorls at dusk when caterpillars are active',
        'Push-pull companion cropping: border with Napier grass to trap moths, intercrop with Desmodium to repel them',
      ],
      chemical: [
        'Coragen 20 SC (Chlorantraniliprole) at 200 ml/ha or Ampligo 150 ZC applied early before larvae bore deep inside cobs',
      ],
      preventive: [
        'Synchronize planting with surrounding farmers within a 2-week window',
        'Maintain field hygiene and destroy volunteer maize stalks between seasons',
        'Intercrop with legumes (haricot beans, cowpeas) to foster ground-dwelling predatory beetles',
      ],
      context:
        'Highly prevalent in Kolla and Weyna Dega maize belts of Rift Valley, Jimma, Wollega, and Southern Ethiopia.',
      season: 'Belg & Meher seasons: Inspect 20 plants across 5 spots weekly from 2-leaf stage.',
      summary:
        'Diagnostic Agent confirmed Spodoptera frugiperda infestation. Immediate whorl treatment with neem/wood ash or targeted biopesticide advised.',
    },
    coffee: {
      diagnosis: 'Coffee Berry Disease (CBD)',
      scientific: 'Colletotrichum kahawae',
      confidence: 91,
      urgency: 'high',
      indicators: [
        'Dark sunken necrotic spots on green expanding coffee berries',
        'Berries become black, hard, and hollow (mummified) prematurely',
        'Infected berries drop to the ground before ripening',
      ],
      causes: [
        'Prolonged leaf wetness (>5 hours) combined with temperatures between 15°C - 22°C',
        'Excessive canopy shade preventing ventilation and morning drying',
        'Presence of mummified infected berries from the previous harvest left on branches',
      ],
      actions: [
        'Hand-strip and burn/bury all blackened mummified berries from trees and soil surface',
        'Prune dense canopy and shade tree branches to allow 40-50% sunlight penetration',
        'Clear weeds beneath bushes to improve under-canopy air circulation',
      ],
      organic: [
        'Copper hydroxide / Bordeaux mixture (1% solution) applied as a preventive protective barrier before Belg rains',
        'Fermented compost extract enriched with Trichoderma to outcompete fungal spores',
      ],
      chemical: [
        'Copper Nordox 75 WG at 3-4 kg/ha or Bellis (Pyraclostrobin + Boscalid) timed with flowering and pinhead berry stage',
      ],
      preventive: [
        'Replace susceptible old coffee trees with certified Jimma Agricultural Research Center (JARC) CBD-resistant cultivars (e.g. 741, 7440, 74110)',
        'Prune old stems on a 5-7 year cycle (stumping)',
        'Maintain balanced organic shade (e.g. Cordia africana, Albizia gummifera)',
      ],
      context:
        'Endemic across Ethiopian forest and garden coffee systems in Sidama, Yirgacheffe, Jimma, Keffa, and Hararghe.',
      season: 'Onset of Belg rains (March/April): Spray protective cover at pinhead stage.',
      summary:
        'Diagnostic Agent identified Colletotrichum kahawae (CBD). Essential to strip old mummies, prune dense canopies, and apply protective copper before rains peak.',
    },
    potato: {
      diagnosis: 'Potato Late Blight',
      scientific: 'Phytophthora infestans',
      confidence: 96,
      urgency: 'critical',
      indicators: [
        'Water-soaked dark brown to black irregular lesions on leaf tips and margins',
        'Delicate white fungal mildew ring visible on the underside of leaves during damp mornings',
        'Rapid stem blackened lesions leading to complete field collapse within days',
      ],
      causes: [
        'Cool temperatures (12°C - 18°C) paired with continuous relative humidity (>90%)',
        'Use of infected seed tubers saved from previous diseased seasons',
        'Dense foliage canopy with poor air drainage',
      ],
      actions: [
        'Immediately destroy initial focal hotspot plants; do not compost blighted vines',
        'Hill up soil ridges around plants to prevent spores washing into developing tubers',
        'Harvest mature tubers on a sunny day; cure skin thoroughly before storage',
      ],
      organic: [
        'Bordeaux mixture (copper sulfate + lime) applied early in morning before blight spreads',
        'Diluted milk spray (1 part fresh cow milk to 9 parts water) as a natural prophylactic anti-fungal barrier',
      ],
      chemical: [
        'Ridomil Gold MZ 68 WG (Mefenoxam + Mancozeb) at 2.5 kg/ha applied as protective barrier',
      ],
      preventive: [
        'Sow certified blight-resistant varieties (e.g. Gudene, Belete, Jalene, or Bubu)',
        'Mandatory 3-year crop rotation: never follow tomatoes or peppers',
        'Plant certified clean seed tubers from trusted agricultural cooperative unions',
      ],
      context:
        'Devastating in Dega highlands (>2400m) of West Shewa (Jeldu), Gamo, and North Shewa.',
      season: 'Meher season: Peak epidemic during prolonged August rainy weeks with dense fog.',
      summary:
        'Diagnostic Agent diagnosed acute Phytophthora infestans late blight. Urgent action required to suppress foliar spread and protect tubers.',
    },
    enset: {
      diagnosis: 'Enset Bacterial Wilt (BXW)',
      scientific: 'Xanthomonas campestris pv. musacearum',
      confidence: 96,
      urgency: 'critical',
      indicators: [
        'Sudden yellowing, wilting, and collapse of the innermost leaf spear while outer leaves appear green',
        'Yellow/brown bacterial ooze seeping from freshly cut pseudostem surfaces',
        'Internal vascular discoloration and premature rotting of the corm (amicho)',
      ],
      causes: [
        'Transmission via unsterilized machetes, knives, or digging hoes contaminated on neighboring diseased plants',
        'Infected planting corm material acquired from untested nurseries',
        'Browsing domestic livestock spreading sap from plant to plant',
      ],
      actions: [
        'CRITICAL: Sterilize all knives and farming tools by flaming with fire or soaking in 10% household bleach between every plant',
        'Immediately dig out and uproot the entire infected enset plant, corm, and roots',
        'Chop infected tissue into pieces inside a pit, cover with lime or dry soil, and leave to decompose away from waterways',
      ],
      organic: [
        'No chemical or organic spray can cure an already infected enset plant; strict field sanitation is the only defense',
        'Apply wood ash and agricultural lime in uprooted spots to accelerate bacterial die-off in soil',
      ],
      chemical: [
        'Chemical bactericides are ineffective and not recommended for enset food systems',
      ],
      preventive: [
        'Quarantine the field section: do not replant enset or banana in the infected spot for at least 6 months',
        'Fencing farm plots to prevent stray cattle, sheep, and goats from chewing on enset leaves',
        'Use only verified disease-free suckers obtained from certified clean community mother nurseries',
      ],
      context:
        'Severe threat across southern Ethiopian enset food security zones (Gurage, Hadiya, Wolaita, Sidama, Gamo).',
      season: 'Year-round threat; heightened during wet season due to frequent farming tool usage.',
      summary:
        'Diagnostic Agent diagnosed acute Xanthomonas bacterial wilt. Critical hygiene alert: sterilize all machetes with fire immediately and uproot the affected plant.',
    },
  },
  am: {
    teff: {
      diagnosis: 'የጤፍ ዝገት በሽታ (Teff Rust)',
      scientific: 'Uromyces eragrostidis',
      confidence: 93,
      urgency: 'high',
      indicators: [
        'በቅጠሎች እና በግንዱ ሽፋን ላይ ክብ እና ረዘም ያሉ ብርቱካናማ-ቡናማ ዱቄት መሰል ቁስሎች (ፑስቱል)',
        'የስር ቅጠሎች ያለጊዜያቸው ቢጫ መሆንና መድረቅ',
        'እህሉ ወደ መብሰያ ሲቃረብ ግንዱ በመዳከሙ ምክንያት ከባድ የሰብል መውደቅ (ሎጅንግ)',
      ],
      causes: [
        'በጤፍ ማብቀያ ወቅት ከፍተኛ እርጥበት (>80%) እና የማለዳ ጤዛ መብዛት',
        'ያለ መስመር ክፍተት በጣም ጥቅጥቅ አድርጎ መዝራት',
        'የሰብል ማፈራረቅ ሳይደረግ በተከታታይ ጤፍ ብቻ ማምረት',
      ],
      actions: [
        'በማሳው ዝቅተኛ ክፍሎች ላይ የሚጠራቀም ውኃን ወይም ከመጠን ያለፈ መስኖ ወዲያውኑ ማስወገድ',
        'የስፖር ስርጭትን ለመግታት የተጣራ የእንጨት አመድ በተጎዳው ክፍል ዙሪያ መበተን',
        'እህሉ እንዳይረግፍ እና ሻጋታ እንዳይይዘው የደረሱትን ክፍሎች ቀድሞ ማጨድ',
      ],
      organic: [
        'የኒም (Neem) ዘር ውህድ፡ 500 ግራም የተፈጨ የኒም ፍሬ በ10 ሊትር ውኃ ውስጥ ለ12 ሰዓት ዘፍዝፎ በማጣራት በየሳምንቱ መርጨት',
        'የእንጨት አመድ ፈሳሽ፡ 1 ኪ.ግ ንጹህ የእንጨት አመድ በ10 ሊትር ውኃ በጥብጦ አሳድሮ የላይኛውን ጥራት መርጨት',
      ],
      chemical: [
        'ቲልት (Tilt / Propiconazole 250 EC) ወይም ናቲቮ (Nativo 75 WG) በሄክታር 0.5 ሊትር በሽታው ከ20% በላይ ከተዛመተ ብቻ መጠቀም',
      ],
      preventive: [
        'የስርጭት ዘራትን ትቶ በመስመር (በ20 ሳ.ሜ ርቀት) በሄክታር ከ10-15 ኪ.ግ ዘር መጠቀም',
        'በየሁለት ዓመቱ ከጥራጥሬ ሰብሎች (ሽምብራ ወይም ጓያ) ጋር ማፈራረቅ',
        'ተከላካይ የሆኑ የጤፍ ዝርያዎችን (እንደ ቁንጮ / DZ-Cr-387 ወይም ኮራ / DZ-Cr-438) መዝራት',
      ],
      context:
        'በዋናው የመኸር ወቅት በምስራቅ ሸዋ፣ አዳማ፣ አዳአ እና ምዕራብ ጎጃም ወይና ደጋ አካባቢዎች በስፋት ይስተዋላል።',
      season: 'የመኸር ወቅት፡ ከዝናብ ዑደት በኋላ የጤፍ ማደግና መክፈት ደረጃዎችን በንቃት ይከታተሉ።',
      summary:
        'የምርመራ ወኪሉ የጤፍ ዝገት በሽታን (Uromyces eragrostidis) በቁስሉ ቅርጽ መሰረት ለይቷል። አፋጣኝ የእርጥበት ቅነሳ እና የአመድ/ኒም ርጭት ይመከራል።',
    },
    wheat: {
      diagnosis: 'የስንዴ ቢጫ ዝገት (Wheat Stripe / Yellow Rust)',
      scientific: 'Puccinia striiformis f. sp. tritici',
      confidence: 95,
      urgency: 'critical',
      indicators: [
        'በቅጠሉ መስመሮች ተከትለው የሚወጡ ቢጫ ዱቄት መሰል ተከታታይ መስመራዊ ዝገቶች',
        'ቅጠሎቹ በእሳት የተቃጠሉ የሚመስል መድረቅ እና መጥቆር',
        'እሸቱ ሳይሞላ መኮማተርና ቀላል ክብደት ያለው ፍሬ መሆን',
      ],
      causes: [
        'ቀዝቃዛ አየር (10°C - 15°C) ከጉም እና ከፍተኛ እርጥበት ጋር ተጣምሮ',
        'አሮጌ የስንዴ ዝርያዎች (ኩብሳ፣ ዲጋሉ) የመከላከል አቅማቸው ማነስ',
        'በደጋማ ሜዳዎች ላይ በንፋስ የሚጓጓዙ የፈንገስ ስፖሮች',
      ],
      actions: [
        'በጣም የተጠቁትን ክፍሎች በፍጥነት ለይቶ የተጎዱትን አዝመራዎች ማስወገድ',
        'የፈንገስ መራባትን የሚያባብሰውን የናይትሮጅን (ዩሪያ) ማዳበሪያ አጠቃቀም መቀነስ',
        'የአካባቢውን የግብርና ልማት ጣቢያ ባለሙያ (DA) ወዲያውኑ ማማከር',
      ],
      organic: [
        'የሳማ (Stinging nettle) ፈሳሽ ርጭት፡ 1 ኪ.ግ ሳማ በ10 ሊትር ውኃ ለ5 ቀናት አቆይቶ በ1፡5 ውኃ በማቅለል ቅጠሉን ለማጠንከር መርጨት',
        'የነጭ ሽንኩርትና የሚጥሚጣ ውህድ መርጨት በመጀመሪያው የበሽታው ጅማሮ ላይ',
      ],
      chemical: [
        'ሬክስ ዱኦ (Rex Duo) 0.75 ሊ/ሄክ ወይም ቲልት (Tilt 250 EC) 0.5 ሊ/ሄክ በመጀመሪያው ቢጫ መስመር መታየት ወቅት መርጨት',
      ],
      preventive: [
        'አዳዲስ ተከላካይ ዝርያዎችን (ዳንዳአ፣ ካካባ፣ ኦጎልቾ ወይም ኪንግበርድ) መጠቀም',
        'ከባቄላ፣ ሽምብራ ወይም የቅባት እህሎች ጋር ማፈራረቅ',
        'በሰኔ/ሐምሌ መጀመሪያ መዝራት የበሽታውን ከፍተኛ ወቅት ለማምለጥ',
      ],
      context:
        'በአርሲ፣ ባሌ እና ሰሜን ሸዋ ደጋማ አካባቢዎች (>2200 ሜ) ከፍተኛ ስጋት ነው። አፋጣኝ እርምጃ እስከ 70% ኪሳራን ያድናል።',
      season: 'የመኸር ማብቂያ ወቅት፡ በስንዴው ቡት እና እሸት ደረጃዎች ላይ ከፍተኛ ጥንቃቄ ያስፈልጋል።',
      summary:
        'የምርመራ ወኪሉ አደገኛውን የስንዴ ቢጫ ዝገት (Puccinia striiformis) ለይቷል። ባንዲራ ቅጠሉን ለመጠበቅ አፋጣኝ የፈንገስ መከላከያ እርምጃ ያስፈልጋል።',
    },
    maize: {
      diagnosis: 'የመኸር ሰራዊት ተምች (Fall Armyworm)',
      scientific: 'Spodoptera frugiperda',
      confidence: 94,
      urgency: 'high',
      indicators: [
        'በለጋ ቅጠሎች ላይ እንደ መስታወት ቀጫጭን የሆኑ የተቧጨሩ ምልክቶች',
        'የተቀደዱና ጥይት የተኮሰባቸው የሚመስሉ የተበሳሱ ቅጠሎች',
        'በበቆሎው ማዕከላዊ ፈንጠዝያ ውስጥ የረጠበ ቢጫ-ቡናማ የመጋዝ ፍቅፋቂ መሰል የተምች እዳሪ',
      ],
      causes: [
        'በሞቃታማ አየር (25°C - 30°C) የተፋጠነ የተምች የመራባት ዑደት',
        'በተከታታይ በተለያየ ጊዜ በቆሎ መዝራት ለተምቹ የማያቋርጥ ምግብ መስጠቱ',
        'የተፈጥሮ አዳኝ ነፍሳትና ተርቦች በአካባቢው ማነስ',
      ],
      actions: [
        'ጠዋት ጠዋት የእንቁላል ክምችቶችንና ትንንሽ አባጨጓሬዎችን በእጅ ለቅሞ ማጥፋት',
        'አባጨጓሬዎቹን ለማፈን ንጹህ ደረቅ አሸዋ ወይም የእንጨት አመድ በቆሎው እምብርት ውስጥ መጨመር',
        'የወደቁትን ቆብጣዎችና የተጠቁትን ክፍሎች ቆፍሮ መቅበር',
      ],
      organic: [
        'የኒም ፍሬ ውህድ (50ግ/ሊትር) ምሽት ላይ አባጨጓሬዎች ሲወጡ በቀጥታ ወደ በቆሎው እምብርት መርጨት',
        'ፑሽ-ፑል (Push-Pull) ዘዴ፡ በቆሎው ዙሪያ የዝሆኔ ሳር (Napier) መትከልና በመካከል ዴስሞዲየም ማብቀል',
      ],
      chemical: [
        'ኮራጅን (Coragen 20 SC) 200 ሚሊ/ሄክ ወይም አምፕሊጎ (Ampligo 150 ZC) ተምቹ ወደ ቆብጣው ውስጥ ዘልቆ ሳይገባ በጊዜ መጠቀም',
      ],
      preventive: [
        'በአካባቢው ካሉ አርሶ አደሮች ጋር በ2 ሳምንት ልዩነት ውስጥ በአንድ ላይ መዝራት',
        'የማሳ ጽዳት መጠበቅና የድሮ የበቆሎ ግንድ ተረፈ ምርቶችን ማስወገድ',
        'አዳኝ ነፍሳትን ለማበረታታት ከቦሎቄ ወይም አተር ጋር ደባልቆ መዝራት',
      ],
      context:
        'በቆላና ወይና ደጋ የስምጥ ሸለቆ፣ ጅማ፣ ወለጋ እና ደቡብ ኢትዮጵያ የበቆሎ ቀጠናዎች በስፋት ይገኛል።',
      season: 'የበልግ እና መኸር ወቅት፡ ከ2 ቅጠል ጀምሮ በየሳምንቱ በ20 ቦታዎች ላይ ቅኝት ያድርጉ።',
      summary:
        'የምርመራ ወኪሉ የመኸር ሰራዊት ተምች (Spodoptera frugiperda) መከሰቱን አረጋግጧል። ወዲያውኑ በእምብርቱ ላይ አመድ/ኒም ማድረግ ይመከራል።',
    },
    coffee: {
      diagnosis: 'የቡና ፍሬ በሽታ (Coffee Berry Disease - CBD)',
      scientific: 'Colletotrichum kahawae',
      confidence: 91,
      urgency: 'high',
      indicators: [
        'በአረንጓዴ የቡና ፍሬዎች ላይ ጥቁር ወደ ውስጥ የሰመጡ የቁስል ምልክቶች',
        'ፍሬዎቹ ሳይበስሉ ያለጊዜያቸው ደርቀው ወደ ጥቁር ድንጋይ መሰል ቅርጽ መቀየር',
        'የተጠቁ ፍሬዎች ከመብሰላቸው በፊት መርገፍ',
      ],
      causes: [
        'የረዘመ የቅጠል እርጥበት (>5 ሰዓት) እና ከ15°C - 22°C የሆነ የሙቀት መጠን',
        'ከመጠን ያለፈ ጥላ አየር እንዳይዘዋወርና የጠዋት ፀሐይ እንዳይደርሰው ማድረጉ',
        'ያለፈው ዓመት የደረቁና የተጠቁ ፍሬዎች በቅርንጫፎች ላይ መቅረታቸው',
      ],
      actions: [
        'በቅርንጫፍና በመሬት ላይ ያሉትን የደረቁና የተጠቁ ጥቁር ፍሬዎችን በሙሉ ለቅሞ ማቃጠል ወይም መቅበር',
        'የቡናውን ዛፍና ጥላ ዛፎችን በመግረዝ ከ40-50% የፀሐይ ብርሃን እንዲገባ ማድረግ',
        'በቡናው ስር ያሉትን አረሞች በማረም የአየር ዝውውርን ማሻሻል',
      ],
      organic: [
        'የቦርዶ ቅልቅል (Bordeaux mixture 1%) ወይም መዳብ (Copper) የበልግ ዝናብ ከመግባቱ በፊት መርጨት',
        'ትሪኮደርማ (Trichoderma) ያለበት የኮምፖስት ፈሳሽ በመርጨት የፈንገስ ስፖሮችን ማዳከም',
      ],
      chemical: [
        'ኮፐር ኖርዶክስ (Copper Nordox 75 WG) 3-4 ኪ.ግ/ሄክታር በፍሬ ማበብ እና ማፍራት ወቅት መርጨት',
      ],
      preventive: [
        'በጅማ የግብርና ምርምር ማዕከል (JARC) የተረጋገጡ በሽታ ተከላካይ ዝርያዎችን (741፣ 7440፣ 74110) መትከል',
        'በየ5-7 ዓመቱ አሮጌ ግንዶችን በመቁረጥ (stumping) ማደስ',
        'ሚዛናዊ የሆነ የጥላ ዛፎችን (ኮሶ፣ ብርቢራ፣ ዋንዛ) ማቆየት',
      ],
      context:
        'በሲዳማ፣ ይርጋጨፌ፣ ጅማ፣ ከፋ እና ሐረርጌ የደንና የጓሮ ቡና ማሳዎች ውስጥ በስፋት ይገኛል።',
      season: 'የበልግ ዝናብ መጀመሪያ (መጋቢት/ሚያዝያ)፡ ፍሬው በትንሽነት ደረጃ ላይ እያለ መከላከያ ይርጩ።',
      summary:
        'የምርመራ ወኪሉ የቡና ፍሬ በሽታን (Colletotrichum kahawae) ለይቷል። አሮጌ ፍሬዎችን ማንሳት፣ ጥላ መግረዝ እና የመዳብ ርጭት ማድረግ ቅድሚያ ይሰጠዋል።',
    },
    potato: {
      diagnosis: 'የድንች ሌት ብላይት (Potato Late Blight)',
      scientific: 'Phytophthora infestans',
      confidence: 96,
      urgency: 'critical',
      indicators: [
        'በቅጠል ጫፎችና ጠርዞች ላይ የረጠበ ጥቁር አረንጓዴ ወይም ቡናማ የቁስል ምልክቶች',
        'ጠዋት በእርጥበት ወቅት በቅጠሉ ስር የሚታይ ነጭ የፈንገስ ሻጋታ ቀለበት',
        'የግንድ መጥቆርና መበስበስ በጥቂት ቀናት ውስጥ ማሳውን በሙሉ ማውደም',
      ],
      causes: [
        'ቀዝቃዛ አየር (12°C - 18°C) ከከፍተኛ እርጥበት (>90%) እና ከጉም ጋር',
        'ካለፈው ወቅት የተበከለ የድንች ዘር እጢ መጠቀም',
        'ጥቅጥቅ ያለ ቅጠልና የአየር ዝውውር እጥረት',
      ],
      actions: [
        'የመጀመሪያዎቹን የተጠቁ ተክሎች ወዲያውኑ ነቅሎ ማጥፋት፤ ለኮምፖስት አለመጠቀም',
        'ስፖሩ ወደ ድንቹ እጢ እንዳይወርድ በድንቹ ዙሪያ አፈሩን ከመር መደለል',
        'በፀሐያማ ቀን ድንቹን ማጨድና ቆዳው እስኪደርቅ በደንብ ማከም',
      ],
      organic: [
        'የቦርዶ ውህድ (የመዳብ ሰልፌት + ኖራ) በማለዳ በሽታው ከመዛመቱ በፊት መርጨት',
        'የላም ወተት ቅልቅል (1 እጅ ወተት ከ9 እጅ ውኃ ጋር) እንደ ተፈጥሮአዊ የፈንገስ መከላከያ',
      ],
      chemical: [
        'ሪዶሚል ጎልድ (Ridomil Gold MZ 68 WG) 2.5 ኪ.ግ/ሄክታር እንደ መከላከያ መጠቀም',
      ],
      preventive: [
        'ተከላካይ ዝርያዎችን (ጉደኔ፣ በለጠ፣ ጃሌኔ ወይም ቡቡ) መጠቀም',
        'የ3 ዓመት የሰብል ማፈራረቅ ማድረግ (ከቲማቲም ወይም ቃሪያ በኋላ በፍጹም አለመዝራት)',
        'ከህብረት ስራ ማህበራት የተረጋገጠ ንጹህ የድንች እጢ ዘር መግዛት',
      ],
      context:
        'በምዕራብ ሸዋ (ጀልዱ)፣ ጋሞ እና ሰሜን ሸዋ ደጋማ አካባቢዎች (>2400 ሜ) ከፍተኛ ውድመት ያደርሳል።',
      season: 'የመኸር ወቅት፡ በነሐሴ ወር በተከታታይ ዝናብና ጉም ወቅት ከፍተኛ ጥንቃቄ ያስፈልጋል።',
      summary:
        'የምርመራ ወኪሉ የድንች ሌት ብላይት (Phytophthora infestans) መከሰቱን አረጋግጧል። አስቸኳይ የንጽህና እና የፈንገስ መከላከያ እርምጃ ካልተወሰደ ማሳው ሊወድም ይችላል።',
    },
    enset: {
      diagnosis: 'የእንሰት ባክቴሪያዊ ዊልት (Enset Bacterial Wilt - BXW)',
      scientific: 'Xanthomonas campestris pv. musacearum',
      confidence: 96,
      urgency: 'critical',
      indicators: [
        'የውጪ ቅጠሎች ለምለም ሆነው እያሉ የውስጠኛው ማዕከላዊ ጦር ቅጠል ድንገት ቢጫ መሆንና መውደቅ',
        'ግንዱ ሲቆረጥ የሚወጣ ቢጫ/ቡናማ ንፍጥ መሰል የባክቴሪያ ፈሳሽ (ኦውዝ)',
        'የእንሰቱ አሚቾ (ስር) ወደ ውስጥ መበስበስና መጥቆር',
      ],
      causes: [
        'በተበከሉ ገጀራዎች፣ ቢላዎችና መቆፈሪያዎች ከአንዱ ዛፍ ወደ ሌላው መተላለፍ',
        'ከተበከለ አካባቢ ያልተረጋገጠ የእንሰት ማባዣ ችግኝ ማምጣት',
        'የቤት እንስሳት የእንሰቱን ቅጠል ሲግጡ በሽታውን ማሰራጨታቸው',
      ],
      actions: [
        'አስቸኳይ ማስጠንቀቂያ፡ ማንኛውንም ቢላዋና ገጀራ በእሳት በማቃጠል ወይም በበረኪና በማጠብ በደንብ ማጽዳት',
        'የተጠቃውን እንሰት ከስሩ (ከነአሚቾው) ሙሉ በሙሉ ነቅሎ ማውጣት',
        'የተነቀለውን እንሰት ጉድጓድ ቆፍሮ ኖራ ወይም አፈር አልብሶ ከውኃ መፋሰሻ ርቆ እንዲበሰብስ ማድረግ',
      ],
      organic: [
        'ለእንሰት ባክቴሪያዊ ዊልት ምንም ዓይነት ኬሚካል ወይም ኦርጋኒክ መድኃኒት የለም፤ የማሳ ንጽህና ብቻ ብቸኛው መከላከያ ነው',
        'ባክቴሪያው እንዲሞት በተነቀለበት ቦታ ላይ የእንጨት አመድና የግብርና ኖራ መበተን',
      ],
      chemical: [
        'ለእንሰት ምግብነት የኬሚካል ባክቴሪያ መድኃኒቶች አይመከሩም',
      ],
      preventive: [
        'በተጠቃው ቦታ ላይ ቢያንስ ለ6 ወራት እንሰት ወይም ሙዝ በፍጹም አለመትከል',
        'ከብቶችና ፍየሎች ወደ እንሰት ማሳ እንዳይገቡ አጥር ማጠር',
        'ከማህበረሰብ የጸዱ ችግኝ ማፍያ ጣቢያዎች ብቻ ንጹህ ችግኝ መጠቀም',
      ],
      context:
        'በደቡብ ኢትዮጵያ የምግብ ዋስትና ቀጠናዎች (ጉራጌ፣ ሀዲያ፣ ወላይታ፣ ሲዳማ፣ ጋሞ) ላይ ትልቅ ስጋት ነው።',
      season: 'ዓመቱን ሙሉ የሚከሰት ስጋት፤ በእርሻ መሳሪያዎች ንክኪ ምክንያት በክረምት ይብሳል።',
      summary:
        'የምርመራ ወኪሉ አደገኛውን የእንሰት ባክቴሪያዊ ዊልት (Xanthomonas) ለይቷል። ገጀራዎችን በእሳት ማምከንና የተጠቃውን እንሰት ወዲያውኑ መንቀል ግዴታ ነው።',
    },
  },
  om: {
    teff: {
      diagnosis: 'Dhibee Waagii Xaafii (Teff Rust)',
      scientific: 'Uromyces eragrostidis',
      confidence: 93,
      urgency: 'high',
      indicators: [
        'Baala fi qola xaafii irratti mallattoo daaraa bifa burtukaana-bunaa ta\'ee mul\'atu',
        'Baallan jalaa yeroo malee keelloo ta\'uu fi goguu',
        'Jirmi laafuu irraa kan ka\'e yeroo gahuuf jedhu lafatti jigee miidhamuu',
      ],
      causes: [
        'Yeroo xaafiin biqilutti jiidhinni qilleensaa olka\'uu (>%80) fi fixeensi ganamaa baay\'achuu',
        'Facaasaa heddummeessuu fi sarara malee walitti qabanii facaasuu',
        'Osoo callaa hin jijjiirin deddeebisanii xaafii qofa oomishuu',
      ],
      actions: [
        'Bakka lafti dhooqa ta\'etti bishaan kuulame hatattamaan bo\'oo baasuun dhangalaasuu',
        'Daaraa qulqulluu calalame bakka miidhame naannessanii firfirsuun faffaca\'uu dhibichaa daangessuu',
        'Xaafii bilchaate akka hin harcanneef saffisaan haamuu',
      ],
      organic: [
        'Dhangala\'aa firii Niimii (Neem): Firii niimii daakame giraama 500 bishaan liitira 10 keessatti sa\'aatii 12 tursiisuun torbanitti marraa tokko biifuu',
        'Dhangala\'aa daaraa muka qulqulluu: Daaraa kiiloo 1 bishaan liitira 10 keessa bulchanii irra dhimbiiluun biifuu',
      ],
      chemical: [
        'Qoricha Tilt (Propiconazole 250 EC) yookiin Nativo 75 WG hektaaratti liitira 0.5 yoo dhibichi %20 ol ta\'e qofa fayyadamuu',
      ],
      preventive: [
        'Facaasaa bifa sararaa (gidduu sararaa seentimeetira 20) sanyii hektaaratti kiiloo 10-15 fayyadamuu',
        'Waggaa lamaan al tokko midhaan dheedhii (shumburaa ykn baaqelaa) wajjin wal-jijjiiranii facaasuu',
        'Sanyii filatamaa dandamanna qabu (kan akka Qunxoo ykn Koraa) fayyadamuu',
      ],
      context:
        'Baddaa-daree Shawaa Bahaa, Ada\'aa, fi Godinaalee Oromiyaa keessatti yeroo gannaa baay\'inaan mudata.',
      season: 'Waqtii Ganna: Yeroo xaafiin dacha\'uu fi daraaru hordoffii cimaa taasisaa.',
      summary:
        'Eejantiin qorannoo dhibee waagii xaafii (Uromyces eragrostidis) adda baaseera. Hatattamaan jiidhinsa hir\'isuu fi daaraa/niimii biifuun gorfama.',
    },
    wheat: {
      diagnosis: 'Waagii Qamadii Boora / Keelloo (Wheat Stripe Rust)',
      scientific: 'Puccinia striiformis f. sp. tritici',
      confidence: 95,
      urgency: 'critical',
      indicators: [
        'Sarara sararaan baala qamadii irratti dhibee waagii keelloo daaraa fakkaatu',
        'Baalli akka waan gubateetti goguu fi maseenuu',
        'Iji qamadii guutuu osoo hin ta\'in huqqachuu fi salphachuu',
      ],
      causes: [
        'Qabbana qilleensaa (Digrii 10°C - 15°C) hurrii fi jiidhinsa wajjin',
        'Sanyiin durii (kan akka Kubsaa fi Digaaluu) dandeettii of-irraa ittisuu dhabuu',
        'Bubbeen qilleensaa kottee dhibichaa baddaa irraa gara baddaatti fiduu',
      ],
      actions: [
        'Bakka dhibichi ka\'e dafanii adda baasuun baala miidhame balleessuu',
        'Xaa\'oo Naayitroojiinii (Yuuriyaa) baay\'isanii kennuu dhaabuu',
        'Ogeessa misooma qonnaa (DA) gandaa hatattamaan qunnamsiisuu',
      ],
      organic: [
        'Dhangala\'aa doobbii (Samaa): Doobbii kiiloo 1 bishaan liitira 10 keessa guyyaa 5 bulchanii 1:5 bishaaniin madaalchisuun biifuu',
        'Makiinaa qullubbii adii fi daadhii mimmicaa biifuun ittisa duraa gochuu',
      ],
      chemical: [
        'Qoricha Rex Duo (0.75 L/ha) yookiin Tilt 250 EC (0.5 L/ha) yeruma sararri keelloo jalqabetti biifuu',
      ],
      preventive: [
        'Sanyii haaraa dandamatoo ta\'an kan akka Danda\'aa, Kakaabaa, Ogolchoo ykn Kingbird facaasuu',
        'Baaqelaa, shumburaa ykn nuugii wajjin dabareen facaasuu',
        'Waqtii facaasaa dursuun (Waxabajjii/Adooleessa) rooba gannaa wajjin wal simsiisuu',
      ],
      context:
        'Baddaa fi Baddaa-daree Arsii, Baalee, fi Shawaa Kaabaa keessatti balaa guddaadha. Hanga %70 oomisha baraara.',
      season: 'Dhuma Ganna: Yeroo iji qamadii daraaruu fi ija godhachuuf qophaa\'u hordoffii cimaa barbaada.',
      summary:
        'Eejantiin qorannoo waagii qamadii keelloo (Puccinia striiformis) adda baaseera. Hatattamaan ittisa gochuun baala qamadii baraaruun murteessaadha.',
    },
    maize: {
      diagnosis: 'Ilbiisa Raayyaa / Raammoo Boqqolloo (Fall Armyworm)',
      scientific: 'Spodoptera frugiperda',
      confidence: 94,
      urgency: 'high',
      indicators: [
        'Baala keessa boqqolloo irratti foddaa calaqqisaa fakkaatu kan raammoon quncise',
        'Uraa gurguddaa akka rasaasaatiin dhoowwamee ciccite fakkaatu',
        'Handhuura boqqolloo keessatti kosii raammoo akka daaraa mukaatti furdate',
      ],
      causes: [
        'Ho\'a qilleensaa (25°C - 30°C) wal-hormaata raammoo saffisiisu',
        'Walgidduutti boqqolloo yeroo adda addaatti facaasanii soorata itti fufiinsa qabu uumuu',
        'Ilbiisota uumamaa raammoo nyaatan dhabamuu',
      ],
      actions: [
        'Hanqaaquu fi ilbiisota xixiqqoo ganama ganama harkaani buqqisanii balleessuu',
        'Biyyoo gogaa qulqulluu ykn daaraa muka calalame handhuura boqqolloo keessa buusuun raammoo ukkaamsuu',
        'Boqqolloo miidhame lafa qotanii keessa awwaaluu',
      ],
      organic: [
        'Dhangala\'aa firii Niimii (50g/L) yeroo galgalaa yemmuu raammoon baatu handhuura keessatti biifuu',
        'Teeknolojii Push-Pull: Naannoo maasaatti Saari-harbaa (Napier) dhaabuu, gidduutti Desmodium facaasuu',
      ],
      chemical: [
        'Qoricha Coragen 20 SC (200 ml/ha) yookiin Ampligo 150 ZC osoo raammoon gara kormaa hin seenin dura biifuu',
      ],
      preventive: [
        'Qonnaan bultoota ollaa wajjin torban 2 keessatti yeroo tokkotti facaasuu',
        'Qulqullina maasaa eeguu fi hafteen boqqolloo darbee akka hin turre gubuu',
        'Boloqqee wajjin makanii facaasuun ilbiisota gargaartuu baay\'isuu',
      ],
      context:
        'Gammoojjii fi Baddaa-daree Riwu Gaadii, Jimmaa, Wallaggaa fi Kibba Itoophiyaa keessatti bal\'inaan jira.',
      season: 'Waqtii Arfaasaa fi Ganna: Sadarkaa baala 2 irraa eegalee torban torbaniin ilaalaa.',
      summary:
        'Eejantiin qorannoo ilbiisa raayyaa boqqolloo (Spodoptera frugiperda) mirkaneesseera. Hatattamaan handhuura boqqollootti daaraa/niimii biifuun barbaachisaadha.',
    },
    coffee: {
      diagnosis: 'Dhibee Firii Bunaa / Wanjaa (Coffee Berry Disease - CBD)',
      scientific: 'Colletotrichum kahawae',
      confidence: 91,
      urgency: 'high',
      indicators: [
        'Firii bunaa magaariisa irratti mallattoon gurraachi gad seene mul\'achuu',
        'Firiin yeroo malee gogee akka dhagaa gurraacha ta\'ee mummummachu',
        'Firiin osoo hin bilchaatin lafatti harca\'uu',
      ],
      causes: [
        'Jiidhinni sa\'aatii 5 ol tursiisuu fi qabbanni 15°C - 22°C wajjin wal simuu',
        'Gaaddisni muka baay\'atee aduu fi qilleensa dhowwuu',
        'Buna darbe kan gogee damee irratti hafe irraa dhibichi daddarbuu',
      ],
      actions: [
        'Buna gogaa gurraacha muka irrattii fi lafatti kufe guuranii gubuu ykn awwaaluu',
        'Dandama bunaa fi gaaddisa muka irraa ciruun aduun %40-50 akka galu gochuu',
        'Aramaa jala bunaa qulqulleessuun qilleensa naannessuu',
      ],
      organic: [
        'Makiinaa Koorperii (Bordeaux mixture %1) roobni arfaasaa seensaan dura biifuu',
        'Dhangala\'aa kompoostii qulqulluu biifuun fangasii ittisuu',
      ],
      chemical: [
        'Qoricha Copper Nordox 75 WG (3-4 kg/ha) yeroo firiin bunaa ija godhatu biifuu',
      ],
      preventive: [
        'Sanyii qorannoo Jimmaatiin ba\'an kan dhibee dandamatan (741, 7440, 74110) dhaabuu',
        'Waggaa 5-7tti buna dullome muranii haareffachuu',
        'Mukkeen gaaddisaa madaalawaa (Wanzaa, Birbira) eeggachuu',
      ],
      context:
        'Sidaamaa, Yirgaacafee, Jimmaa, Kaffa, fi Harargee keessatti dhibee guddaadha.',
      season: 'Jalqaba Rooba Arfaasaa: Yeroo firiin bunaa ija qabatu ittisa gochuun murteessaadha.',
      summary:
        'Eejantiin qorannoo dhibee firii bunaa (Colletotrichum kahawae) adda baaseera. Firii goge dhabamsiisuu fi gaaddisa sirreessuun dursa argata.',
    },
    potato: {
      diagnosis: 'Dhibee Dhaala / Laayit Bulaayit Dinnichaa (Potato Late Blight)',
      scientific: 'Phytophthora infestans',
      confidence: 96,
      urgency: 'critical',
      indicators: [
        'Fiixee fi qarqara baala dinnichaa irratti mallattoo jiidhaa gurraacha\'ee mul\'atu',
        'Jala baalaa irratti ganama fixeensa qabdu dhangala\'aa adii fangasii mul\'achuu',
        'Jirmi dinnichaa gogee guyyoota muraasa keessatti maasaa guutuu barbadeessuu',
      ],
      causes: [
        'Qabbana qilleensaa (12°C - 18°C) jiidhinsa cimaa (>%90) fi hurrii wajjin',
        'Sanyii dinnichaa duraan dhibee qabu facaasuu',
        'Baalli walirra bu\'ee qilleensi gidduu dhabamuu',
      ],
      actions: [
        'Biqila jalqaba miidhame hatattamaan buqqisanii gubuu; kompoostiitti hin dabalinaa',
        'Kottee dhibichaa irraa ittisuuf biyyoo jala dinnichaatti dachaasanii tuuluu',
        'Guyyaa aduutti dinnicha baasuu fi gogaan isaa akka jabaatu gochuu',
      ],
      organic: [
        'Makiinaa Bordo (Bordeaux mixture) ganama barii dhibichi osoo hin tamsaan dura biifuu',
        'Aannan sa\'aa bishaaniin madaalchisuun (1:9) akka ittisa uumamaatti biifuu',
      ],
      chemical: [
        'Qoricha Ridomil Gold MZ 68 WG (2.5 kg/ha) akka ittisa duraatti biifuu',
      ],
      preventive: [
        'Sanyiiwwan dhibee dandamatan (Gudanee, Balaxxee, Jaallannee ykn Bubu) dhaabuu',
        'Waggaa 3f dabaree eeguu; timaatima ykn qaaraa booda facaasuu dhiisuu',
        'Waldaa qonnaan bultootaa irraa sanyii qulqulluu bitachuu',
      ],
      context:
        'Baddaa Shawaa Lixaa (Jalduu), Gaamoo, fi Shawaa Kaabaa (>2400m) keessatti balaa hamaadha.',
      season: 'Waqtii Ganna: Hagayya keessa hurrii fi rooba cimaa keessatti hordoffii barbaada.',
      summary:
        'Eejantiin qorannoo dhibee dhaala dinnichaa (Phytophthora infestans) adda baaseera. Qoricha ittisaa hatattamaan biifuun barbaachisaadha.',
    },
    enset: {
      diagnosis: 'Dhibee Hadheessituu Warqee / Insetii (BXW)',
      scientific: 'Xanthomonas campestris pv. musacearum',
      confidence: 96,
      urgency: 'critical',
      indicators: [
        'Baalli alaa osoo lalisuu baalli keessoo handhuuraa tasa keelloo ta\'ee lafatti jigee caccabuu',
        'Yeroo jirmi qalamu dhangala\'aan baakteriyaa bifa keelloo/bunaa ta\'ee yaa\'uu',
        'Amichi (hiddi) warqee keessaan tortoruu fi dirmammuu',
      ],
      causes: [
        'Haaduu fi qottoo dhibichaan faalame qulqulleessuu dhabuu irraa',
        'Sanyii lafaa dhibee qabu bakka biraatii fiduun dhaabuu',
        'Beelladoonni baala warqee ciniinanii dhibee daddabarsuu',
      ],
      actions: [
        'AKEEKKACHIISA CIMAA: Haaduu fi qottoo kamuu ibiddaan gubanii ykn kulooriiniin dhiqanii qulqulleessuu',
        'Warqee dhibame hiddasaa (amichasaa) wajjin hatattamaan buqqisanii dhabamsiisuu',
        'Boolla keessatti kukkutanii dachee keessa awwaaluun akka tortoru gochuu',
      ],
      organic: [
        'Dhibee baakteriyaa warqeetiif qorichi biifamu hin jiru; qulqullina meeshaa qonnaa eeguu qofatu fala',
        'Bakka buqqifametti daaraa muka fi nooraa firfirsuun baakteriyaa ajjeesuu',
      ],
      chemical: [
        'Qorichi keemikaalaa nyaata warqeetiif gonkumaa hin gorfamu',
      ],
      preventive: [
        'Bakka sanatti ji\'a 6f warqee ykn muuzii deebisanii dhaabuu dhiisuu',
        'Loonii fi re\'oonni gara lafa warqeetti akka hin seenneef dallaa ijaaruu',
        'Bakka qulqulluu qorannoon mirkanaa\'e qofa irraa sanyii fiduu',
      ],
      context:
        'Kibba Itoophiyaa (Guraagee, Hadiyyaa, Walaayittaa, Sidaamaa) keessatti balaa wabii nyaataati.',
      season: 'Waggaa guutuu mudachuu danda\'a; yeroo gannaa meeshaan waan baay\'atuuf ni cimatama.',
      summary:
        'Eejantiin qorannoo dhibee hadheessituu warqee (Xanthomonas) adda baaseera. Haaduu ibiddaan qulqulleessuu fi warqee dhibame buqqisuun dirqama.',
    },
  },
};

/**
 * Returns the matched crop knowledge profile for a given crop and language.
 * Defaults cleanly to wheat profile if crop is not directly matched.
 */
export function getCropKnowledgeProfile(
  cropType: EthiopianCrop | string,
  lang: SupportedLanguage = 'en'
): CropKnowledgeProfile {
  const languageDict = AGRONOMY_KNOWLEDGE_BASE[lang] || AGRONOMY_KNOWLEDGE_BASE.en;
  const normalizedKey = (cropType || 'wheat').toLowerCase().trim();

  if (languageDict[normalizedKey]) {
    return languageDict[normalizedKey];
  }

  // Handle common aliases
  if (normalizedKey.includes('teff') || normalizedKey.includes('xaafii') || normalizedKey.includes('ጤፍ')) {
    return languageDict.teff;
  }
  if (normalizedKey.includes('wheat') || normalizedKey.includes('qamadii') || normalizedKey.includes('ስንዴ')) {
    return languageDict.wheat;
  }
  if (normalizedKey.includes('maize') || normalizedKey.includes('boqqolloo') || normalizedKey.includes('በቆሎ')) {
    return languageDict.maize;
  }
  if (normalizedKey.includes('coffee') || normalizedKey.includes('buna') || normalizedKey.includes('ቡና')) {
    return languageDict.coffee;
  }
  if (normalizedKey.includes('potato') || normalizedKey.includes('dinnicha') || normalizedKey.includes('ድንች')) {
    return languageDict.potato;
  }
  if (normalizedKey.includes('enset') || normalizedKey.includes('warqee') || normalizedKey.includes('እንሰት')) {
    return languageDict.enset;
  }

  // Fallback to wheat
  return languageDict.wheat;
}
