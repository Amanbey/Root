/**
 * ROOT – ETHIOPIAN AGRO-ECOLOGICAL SEASONAL ADVISORY ENGINE
 * Translates calendar cycles and Ethiopian farming practices into actionable field guidance.
 */

import { AgroEcologicalZone } from '@/lib/types';

export type EthiopianSeason = 'Bega' | 'Belg' | 'Meher';

export interface SeasonalAdvisory {
  season: EthiopianSeason;
  localName: {
    en: string;
    am: string;
    om: string;
  };
  monthsDescription: {
    en: string;
    am: string;
    om: string;
  };
  primaryFocus: {
    en: string;
    am: string;
    om: string;
  };
  criticalActions: {
    en: string[];
    am: string[];
    om: string[];
  };
  pestWarnings: {
    en: string[];
    am: string[];
    om: string[];
  };
  zoneSpecificTips: Record<
    AgroEcologicalZone,
    {
      en: string;
      am: string;
      om: string;
    }
  >;
}

/**
 * Returns the current Ethiopian agricultural season based on current Gregorian month.
 * - October to January: Bega (በጋ / Bona) – Harvest, Threshing, Storage, Dry-Season Irrigation
 * - February to May: Belg (በልግ / Arfaasaa) – Short Rains, Land Preparation & Early Highland Planting
 * - June to September: Meher (መኸር / ክረምት / Ganna) – Main Rains, Cereal Sowing, Vertisol Drainage, Rust Vigilance
 */
export function getCurrentEthiopianSeason(date = new Date()): SeasonalAdvisory {
  const month = date.getMonth() + 1; // 1-12

  if (month >= 10 || month <= 1) {
    // BEGA (October - January)
    return {
      season: 'Bega',
      localName: {
        en: 'Bega Season',
        am: 'የበጋ ወቅት',
        om: 'Waqtii Bonaa',
      },
      monthsDescription: {
        en: 'October – January (Harvest & Post-Harvest Dry Period)',
        am: 'ጥቅምት – ጥር (የመከር፣ የመውቂያ እና የክምችት ወቅት)',
        om: 'Onkololeessa – Amajjii (Waqtii Oomisha Funaanuu fi Kuusuu)',
      },
      primaryFocus: {
        en: 'Threshing cereals, moisture-controlled grain storage, and off-season horticultural irrigation.',
        am: 'ሰብል መሰብሰብ፣ መውቃት፣ እህልን በሄርሜቲክ ከረጢት ማከማቸት እና የመስኖ አትክልት እንክብካቤ።',
        om: 'Midhaan haamuu, dhiituu, korojoo PICS keessatti kuusuu fi qonna jallisii eegaluu.',
      },
      criticalActions: {
        en: [
          'Thresh Teff, Wheat, and Barley promptly to prevent sun bleaching or untimely late frost damage.',
          'Store grain in hermetic triple-layer PICS bags to asphyxiate larger grain borers and weevils without chemicals.',
          'Start furrow or drip irrigation for off-season onions, tomatoes, and potatoes on vertisol plots.',
          'Conserve crop residues for livestock feed and composting rather than burning.',
        ],
        am: [
          'ጤፍ፣ ስንዴ እና ገብስን ቶሎ በመውቃት ከድንገተኛ ውርጭ እና ከአየር መለዋወጥ ይጠብቁ።',
          'እህልን ከተባይ (ነቀዝ) ለመከላከል በሶስት ደርብ ሄርሜቲክ ፒክስ (PICS) ከረጢት ያለ ኬሚካል ያከማቹ።',
          'በመስኖ ለሚመረቱ የሽንኩርት፣ ቲማቲም እና ድንች ሰብሎች ተገቢውን የውሃ ማጠጣት ስራ ያከናውኑ።',
          'የሰብል ገለባን ከማቃጠል ይልቅ ለከብቶች መኖ እና ለማዳበሪያነት (ኮምፖስት) ይጠቀሙበት።',
        ],
        om: [
          'Xaafii, qamadii fi garbuu saffisaan haamuun qorra halkan irraa eegaa.',
          'Midhaan bokkee fi ilbiisota irraa eeguuf korojoo PICS qulqullina qabu keessatti kuusaa.',
          'Qonna jallisiitiin qullubbii, timaatima fi dubaaf bishaan gahaa kennaa.',
          'Gingilchaa fi habaqii midhaanii gubuu mannaa nyaata beeyladaa fi kompoostiif oolchaa.',
        ],
      },
      pestWarnings: {
        en: [
          'Granary Weevil (Sitophilus oryzae) and Angoumois Grain Moth in stored teff and maize.',
          'Fall Armyworm lingering in late-harvest sweet maize stalks.',
          'Aphids and thrips in dry-season irrigated onions and cabbage.',
        ],
        am: [
          'በተከማቸ ጤፍ፣ ስንዴ እና በቆሎ ላይ የሚከሰቱ የነቀዝ እና የእህል እሳት ተባዮች።',
          'በደረቅ መስኖ ሰብሎች (ሽንኩርት እና ጎመን) ላይ የሚከሰቱ ቅማሎች (Aphids) እና ትሪፕስ።',
          'በመጨረሻ በቆሎ አገዳዎች ላይ የሚቀሩ የተምች ተባዮች።',
        ],
        om: [
          'Ilbiisota midhaan kuufame nyaatan (Sitophilus oryzae) xaafii fi boqqoolloo keessatti.',
          'Biifaa fi injiraan qullubbii fi raafuu jallisii miidhan.',
          'Dhangala’aa boqqoolloo irratti hoomaa daawwaa.',
        ],
      },
      zoneSpecificTips: {
        'Weyna Dega': {
          en: 'Midlands (1,500m - 2,400m): Monitor soil moisture loss; protect newly sprouted irrigated seedlings with light straw mulch.',
          am: 'ወይና ደጋ (1,500 - 2,400 ሜትር)፦ የአፈር እርጥበት ቶሎ እንዳይደርቅ የመስኖ ችግኞችን በገለባ ይሸፍኑ።',
          om: 'Baddaa-Dareetti: Jiidhina biyyee eeguuf baala gogaan haguugaa.',
        },
        Dega: {
          en: 'Highlands (>2,400m): Frost risk on clear nights; harvest barley and field peas immediately upon physiological maturity.',
          am: 'ደጋ (ከ2,400 ሜትር በላይ)፦ በጠራራ ሌሊት ውርጭ ሊመታ ስለሚችል ገብስ እና አተር በደረሱ ቅጽበት ይሰብስቡ።',
          om: 'Baddaatti: Qorri halkan midhaan akka hin miine dafaatii haamaa.',
        },
        Kolla: {
          en: 'Lowlands (500m - 1,500m): High temperature evaporation; irrigate in early morning or dusk to minimize water loss.',
          am: 'ቆላ (500 - 1,500 ሜትር)፦ ከፍተኛ ሙቀት ስላለ መስኖን በማለዳ ወይም በማታ ያጠጡ።',
          om: 'Gammoojjiitti: Ho’a waan jiruuf ganama yookiin galgala jallisaa.',
        },
        Bereha: {
          en: 'Arid (<500m): Preserve water table; manage spate irrigation channels carefully.',
          am: 'በረሃ፦ የውሃ እጥረትን ለመቋቋም የተፋሰስ ውሃን በአግባቡ ያዙ።',
          om: 'Gammoojjii Cimaatti: Bishaan kuufamaa qusannoon itti fayyadamaa.',
        },
      },
    };
  } else if (month >= 2 && month <= 5) {
    // BELG (February - May)
    return {
      season: 'Belg',
      localName: {
        en: 'Belg Season',
        am: 'የበልግ ወቅት',
        om: 'Waqtii Arfaasaa',
      },
      monthsDescription: {
        en: 'February – May (Short Rains & Early Highland Sowing)',
        am: 'የካቲት – ግንቦት (የአጭር ዝናብ እና የመጀመሪያ ዘር ወቅት)',
        om: 'Guraandhala – Caamsaa (Rooba Gabaabaa fi Qophii Facaasaa)',
      },
      primaryFocus: {
        en: 'Soil aeration, preparing highland plots for short-cycle maize, barley, and potatoes.',
        am: 'አፈርን ማለስለስ፣ ለበልግ ሰብሎች (ገብስ፣ አጭር በቆሎ እና ድንች) ማሳን ማዘጋጀት።',
        om: 'Biyyoo qopheessuu, boqqoolloo yeroo gabaabaa fi garbuu facaasuu.',
      },
      criticalActions: {
        en: [
          'Plow land early to absorb initial Belg precipitation and expose soil-borne grubs to sunlight.',
          'Select certified fast-maturing drought-tolerant seed varieties for Belg planting.',
          'Reinforce terrace bunds and check-dams to prevent gully erosion on sloped highland fields.',
        ],
        am: [
          'መሬትን አስቀድመው በማረስ የመጀመሪያውን የበልግ ዝናብ አፈር ውስጥ እንዲሰርግ ያድርጉ።',
          'ለበልግ ወቅት ተስማሚ የሆኑ አጫጭር የገብስ፣ በቆሎ እና የድንች ዝርያዎችን ይምረጡ።',
          'በተዳፋት ማሳዎች ላይ የአፈር መሸርሸርን ለመከላከል የእርከን ስራዎችን ያጠናክሩ።',
        ],
        om: [
          'Rooba arfaasaa simachuuf lafa qonnee qopheessaa.',
          'Sanyii filatamaa yeroo gabaabaa keessatti bilchaatu fayyadamaa.',
          'Dhiqama biyyee ittisuuf daagaa fi dallaa jabeessaa.',
        ],
      },
      pestWarnings: {
        en: ['African Armyworm outbreaks following early warm rains.', 'Cutworms severing newly emerged seedlings.'],
        am: ['ከመጀመሪያው ዝናብ በኋላ የሚከሰት የአፍሪካ ተምች (Armyworm)።', 'አዳዲስ ቡቃያዎችን የሚቆርጥ የኩብኩባ ተባይ።'],
        om: ['Dhangala’aa yeroo roobni jalqabu uumamu.', 'Ilbiisa biqiltuu ciru.'],
      },
      zoneSpecificTips: {
        'Weyna Dega': {
          en: 'Plant short-cycle pulses and intercrop with maize to improve nitrogen fixation.',
          am: 'አተር እና ባቄላን ከበቆሎ ጋር ደባልቀው በመዝራት የአፈርን ለምነት ይጨምሩ።',
          om: 'Boqqoolloo waliin oomisha ataraa fi baaqelaa facaasaa.',
        },
        Dega: {
          en: 'Critical Belg barley season; ensure furrows carry excess runoff from steep hills.',
          am: 'ዋነኛ የበልግ ገብስ ወቅት፤ ከደጋማ ተራራ የሚወርድ ውሃ ማሳ ላይ እንዳይተኛ ቦይ ይቅረጹ።',
          om: 'Waqtii garbuu arfaasaa; dhangala’aa bishaanii to’adhaa.',
        },
        Kolla: {
          en: 'Conserve every raindrop using tied-ridges; plant drought-resilient sorghum.',
          am: 'እርጥበትን ለመጠበቅ ሪጅ (Tied-ridges) ያበጁ፤ ድርቅ ቋቋሚ ማሽላ ይዝሩ።',
          om: 'Jiidhina lafaa eeguuf booyii qopheessaa; mishingaa facaasaa.',
        },
        Bereha: {
          en: 'Focus on livestock health and pasture protection.',
          am: 'የእንስሳት ጤና እና የግጦሽ ሳር ጥበቃ ላይ ትኩረት ያድርጉ።',
          om: 'Fayyaa beeyladaa fi eegumsa margaa irratti xiyyeeffadhaa.',
        },
      },
    };
  } else {
    // MEHER (June - September)
    return {
      season: 'Meher',
      localName: {
        en: 'Meher / Kiremt Season',
        am: 'የመኸር ወቅት',
        om: 'Waqtii Gannaa',
      },
      monthsDescription: {
        en: 'June – September (Main Heavy Rains & Primary Cereal Cycle)',
        am: 'ሰኔ – መስከረም (ዋናው የክረምት ዝናብ እና የምርት ወቅት)',
        om: 'Waxabajjii – Fulbaana (Rooba Guddaa fi Oomisha Cimaa)',
      },
      primaryFocus: {
        en: 'Drainage on vertisols, weed eradication, and vigilant monitoring for fungal rusts and blights.',
        am: 'በጥቁር አፈር ላይ የውሃ ማፋሰሻ መስራት፣ አረም ማረም እና የዋግ (Rust) በሽታዎችን መከታተል።',
        om: 'Biyyoo kootichaa irratti bishaan dhangalaasuu, aramaa aramuun wangee to’achuu.',
      },
      criticalActions: {
        en: [
          'Install Broad-Bed and Furrow (BBM) drainage on heavy black clay vertisols to prevent Teff and Wheat root rot.',
          'Scout weekly under cereal leaf canopies for orange/yellow pustules (Stripe & Stem Rust).',
          'Perform timely hand weeding at tillering stage to eliminate nutrient competition.',
        ],
        am: [
          'በከባድ ጥቁር አፈር ላይ ጤፍና ስንዴ እንዳይበሰብሱ ሰፋፊ ቦዮችን (BBM) ይስሩ።',
          'በየሳምንቱ የስንዴ እና የጤፍ ቅጠል ስር ቢጫ ወይም ብርቱካናማ ነጠብጣቦችን (የዋግ በሽታ) ይፈትሹ።',
          'ሰብሉ በሚያሰራበት ወቅት አረምን በወቅቱ በማረም የምግብ እጥረትን ያስወግዱ።',
        ],
        om: [
          'Biyyoo kootichaa irratti biqiltuun akka hin xaxamne booyii bishaanii qopheessaa.',
          'Torbee torbeedhaan baala qamadii jala wangee (rust) ilaalaa.',
          'Aramaa yeroon aramuun midhaan akka jabaatu godhaa.',
        ],
      },
      pestWarnings: {
        en: ['Yellow Stripe Rust (Puccinia striiformis) in cool moist highlands.', 'Teff Shoot Fly on early-sown teff.'],
        am: ['በቀዝቃዛ ደጋማ ቦታዎች የሚከሰተው ቢጫ ዋግ (Yellow Rust)።', 'በጤፍ ቡቃያ ላይ የሚደርሰው የጤፍ ትኋን (Teff Shoot Fly)።'],
        om: ['Dhukkuba Wangee keelloo (Stripe Rust).', 'Ilbiisa xaafii miidhu.'],
      },
      zoneSpecificTips: {
        'Weyna Dega': {
          en: 'Monitor coffee berry disease and rust; maintain shade tree canopy aeration.',
          am: 'የቡና ፍሬ በሽታን (CBD) እና ዝገትን ይከታተሉ፤ ጥላ ዛፎችን በማሳሳት አየር እንዲገባ ያድርጉ።',
          om: 'Dhukkuba bunaa hordofaa; gaaddidduu qilleensa galchu qopheessaa.',
        },
        Dega: {
          en: 'High rainfall saturated soils; ensure field border ditches flow cleanly into natural drains.',
          am: 'ከፍተኛ ዝናብ ስላለ የማሳ ዙሪያ ቦዮች ውሃውን ቶሎ እንዲያወጡት ያጽዱ።',
          om: 'Rooba guddaa waan qabuuf booyiiwwan qulqulleessaa.',
        },
        Kolla: {
          en: 'Maximum biomass production window; apply urea top-dressing right before steady rain.',
          am: 'ጥሩ የምርት ጊዜ፤ ዩሪያ ማዳበሪያን ዝናብ ከመዝነቡ ጥቂት ቀደም ብለው ይጨምሩ።',
          om: 'Roobni osoo hin dhufin xaa’oo Yuuriyaa itti naqaa.',
        },
        Bereha: {
          en: 'Divert river flood waters to dry terraces for soil enrichment.',
          am: 'የወንዝ ጎርፍን ወደ እርሻ በማዞር አፈርን ያዳብሩ።',
          om: 'Lolaa bishaanii gara qonnaatti qajeelchaa.',
        },
      },
    };
  }
}
