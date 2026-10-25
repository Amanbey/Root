/**
 * ROOT – MULTILINGUAL TRANSLATION DICTIONARY
 * Supports:
 * - English (en)
 * - Amharic (am) – አማርኛ
 * - Afaan Oromoo (om) – Oromo
 */

import { SupportedLanguage } from '@/lib/types';

export interface Translations {
  // Navigation
  nav_home: string;
  nav_dashboard: string;
  nav_diagnose: string;
  nav_community: string;
  nav_profile: string;
  nav_sign_in: string;
  nav_sign_out: string;
  nav_language: string;

  // Common Actions
  action_submit: string;
  action_submitting: string;
  action_cancel: string;
  action_save: string;
  action_saved: string;
  action_retry: string;
  action_refresh: string;
  action_filter: string;
  action_search: string;
  action_view_advice: string;
  action_ask_question: string;
  action_share_remedy: string;
  action_verified_by_farmers: string;
  action_verify_remedy: string;

  // Offline / Connectivity
  status_online: string;
  status_offline: string;
  status_offline_banner: string;
  status_syncing: string;
  status_queued_local: string;
  status_cached_ready: string;

  // Dashboard
  dash_welcome: string;
  dash_subtitle: string;
  dash_verified_farmer: string;
  dash_season_radar: string;
  dash_total_inquiries: string;
  dash_confirmed_resolutions: string;
  dash_active_crops: string;
  dash_offline_ready: string;
  dash_quick_actions: string;
  dash_recent_diagnoses: string;
  dash_no_diagnoses_yet: string;
  dash_start_first_diagnosis: string;
  dash_community_spotlight: string;
  dash_farm_details: string;
  dash_agro_zone: string;
  dash_region: string;
  dash_farm_size: string;

  // Seasonal Advisory
  season_bega_title: string;
  season_bega_desc: string;
  season_belg_title: string;
  season_belg_desc: string;
  season_meher_title: string;
  season_meher_desc: string;

  // Diagnosis Card
  diag_title: string;
  diag_urgency: string;
  diag_confidence: string;
  diag_immediate_actions: string;
  diag_organic_remedies: string;
  diag_preventive_measures: string;
  diag_was_this_helpful: string;
  diag_yes_helpful: string;
  diag_not_helpful: string;
}

export type TranslationKey = keyof Translations;

export const translations: Record<SupportedLanguage, Translations> = {
  en: {
    // Navigation
    nav_home: 'Home',
    nav_dashboard: 'Dashboard',
    nav_diagnose: 'Diagnose',
    nav_community: 'Community',
    nav_profile: 'Profile',
    nav_sign_in: 'Sign In',
    nav_sign_out: 'Logout',
    nav_language: 'Language',

    // Common Actions
    action_submit: 'Submit Problem',
    action_submitting: 'Submitting...',
    action_cancel: 'Cancel',
    action_save: 'Save Profile',
    action_saved: 'Saved Successfully',
    action_retry: 'Try Again',
    action_refresh: 'Refresh',
    action_filter: 'Filter by Crop',
    action_search: 'Search remedies...',
    action_view_advice: 'View Advice Card',
    action_ask_question: 'New Crop Diagnosis',
    action_share_remedy: 'Share Field Remedy',
    action_verified_by_farmers: 'Farmers Verified',
    action_verify_remedy: 'Verify Remedy',

    // Offline / Connectivity
    status_online: 'Online',
    status_offline: 'Offline Mode',
    status_offline_banner: 'You are offline. Root continues functioning with local AI & cached records.',
    status_syncing: 'Syncing with cloud...',
    status_queued_local: 'Queued locally in IndexedDB',
    status_cached_ready: 'Available without internet',

    // Dashboard
    dash_welcome: 'Welcome, Farmer',
    dash_subtitle: 'Your personal agricultural advisory hub and farm diagnostic center.',
    dash_verified_farmer: 'Verified Smallholder Farmer',
    dash_season_radar: 'Ethiopian Agro-Ecological Season Radar',
    dash_total_inquiries: 'Total Inquiries',
    dash_confirmed_resolutions: 'Confirmed Diagnoses',
    dash_active_crops: 'Active Crops',
    dash_offline_ready: 'Saved Offline Cards',
    dash_quick_actions: 'Quick Action Center',
    dash_recent_diagnoses: 'Recent Crop Diagnoses',
    dash_no_diagnoses_yet: 'No crop diagnoses recorded yet.',
    dash_start_first_diagnosis: 'Start Your First Diagnosis',
    dash_community_spotlight: 'Peer Remedy Spotlight for Your Crops',
    dash_farm_details: 'Farm Details',
    dash_agro_zone: 'Agro-Zone',
    dash_region: 'Region',
    dash_farm_size: 'Farm Size',

    // Seasonal Advisory
    season_bega_title: 'Bega Season (በጋ) – Harvest & Grain Storage',
    season_bega_desc: 'Dry season period. Prioritize threshing, moisture-safe grain storage using hermetic PICS bags against weevils, and drip/furrow irrigation for dry-season vegetables.',
    season_belg_title: 'Belg Season (በልግ) – Short Rains & Early Planting',
    season_belg_desc: 'Short rainy season. Prepare high/midland vertisols for short-cycle barley, maize, and pulse crops. Inspect soil moisture before sowing.',
    season_meher_title: 'Meher Season (መኸር) – Main Rains & Crop Vigilance',
    season_meher_desc: 'Main agricultural cycle. Ensure broad-bed furrow (BBM) drainage on heavy black clay soils. Scout actively for leaf rust and fungal blight.',

    // Diagnosis Card
    diag_title: 'Crop Diagnosis',
    diag_urgency: 'Urgency Level',
    diag_confidence: 'Confidence Score',
    diag_immediate_actions: 'Immediate Actions',
    diag_organic_remedies: 'Organic & Low-Cost Remedies',
    diag_preventive_measures: 'Preventive Measures',
    diag_was_this_helpful: 'Was this advice helpful to your farm?',
    diag_yes_helpful: 'Helpful',
    diag_not_helpful: 'Not Helpful',
  },

  am: {
    // Navigation
    nav_home: 'መነሻ',
    nav_dashboard: 'ዳሽቦርድ',
    nav_diagnose: 'ምርመራ',
    nav_community: 'ማህበረሰብ',
    nav_profile: 'መገለጫ',
    nav_sign_in: 'ግባ',
    nav_sign_out: 'ውጣ',
    nav_language: 'ቋንቋ',

    // Common Actions
    action_submit: 'ችግሩን ላክ',
    action_submitting: 'በመላክ ላይ...',
    action_cancel: 'ይቅር',
    action_save: 'መረጃ አስቀምጥ',
    action_saved: 'በትክክል ተቀምጧል',
    action_retry: 'እንደገና ሞክር',
    action_refresh: 'አድስ',
    action_filter: 'በሰብል ለይ',
    action_search: 'የገበሬዎች መፍትሔዎችን ፈልግ...',
    action_view_advice: 'የምክር ካርድ ይመልከቱ',
    action_ask_question: 'አዲስ የሰብል ምርመራ',
    action_share_remedy: 'የእርሻ ተሞክሮ አጋራ',
    action_verified_by_farmers: 'ገበሬዎች አረጋግጠዋል',
    action_verify_remedy: 'ተሞክሮውን አረጋግጥ',

    // Offline / Connectivity
    status_online: 'ኢንተርኔት አለ',
    status_offline: 'ከመስመር ውጭ (Offline)',
    status_offline_banner: 'ኢንተርኔት የለም። ሩት (Root) በስልክዎ ላይ በተቀመጠው አርቴፊሻል ኢንተለጀንስ አገልግሎት ይሰጣል።',
    status_syncing: 'ከደመናው ጋር በመገናኘት ላይ...',
    status_queued_local: 'በስልክዎ ማህደረ-ትውስታ ውስጥ ተቀምጧል',
    status_cached_ready: 'ያለ ኢንተርኔት ይሰራል',

    // Dashboard
    dash_welcome: 'እንኳን ደህና መጡ ገበሬ',
    dash_subtitle: 'የእርስዎ የግል የግብርና አማካሪ እና የእርሻ ምርመራ ማዕከል።',
    dash_verified_farmer: 'የተረጋገጠ አርሶ አደር',
    dash_season_radar: 'የኢትዮጵያ ወቅታዊ የግብርና የቀን መቁጠሪያ',
    dash_total_inquiries: 'ጠቅላላ ምርመራዎች',
    dash_confirmed_resolutions: 'የተረጋገጡ ምርመራዎች',
    dash_active_crops: 'የሚያመርቷቸው ሰብሎች',
    dash_offline_ready: 'የተቀመጡ የምክር ካርዶች',
    dash_quick_actions: 'ፈጣን አገልግሎቶች',
    dash_recent_diagnoses: 'የቅርብ ጊዜ የሰብል ምርመራዎች',
    dash_no_diagnoses_yet: 'እስካሁን ምንም የተመዘገበ ምርመራ የለም።',
    dash_start_first_diagnosis: 'የመጀመሪያውን ምርመራ ይጀምሩ',
    dash_community_spotlight: 'ለእርስዎ ሰብሎች የተመረጡ የገበሬዎች ተሞክሮዎች',
    dash_farm_details: 'የእርሻ መረጃ',
    dash_agro_zone: 'የአየር ንብረት ዞን',
    dash_region: 'ክልል',
    dash_farm_size: 'የእርሻ ስፋት',

    // Seasonal Advisory
    season_bega_title: 'የበጋ ወቅት (Bega) – የመከር እና የሰብል ክምችት',
    season_bega_desc: 'ደረቅ የበጋ ወቅት። ምርት መሰብሰብ፣ መውቃት፣ እና ምርቱን ከተባይ ለመጠበቅ በሄርሜቲክ ፒክስ (PICS) ከረጢት ማከማቸት ቅድሚያ ይስጡ። ለመስኖ ሰብሎች (ሽንኩርት፣ ቲማቲም) ውሃ ያጠጡ።',
    season_belg_title: 'የበልግ ወቅት (Belg) – አጭር ዝናብ እና የመጀመሪያ ዘር',
    season_belg_desc: 'የበልግ አጭር ዝናብ ወቅት። ለአጭር ጊዜ ሰብሎች (ገብስ፣ በቆሎ፣ አተር) መሬት አዘጋጅተው ይዝሩ። የአፈር እርጥበትን አስቀድመው ያረጋግጡ።',
    season_meher_title: 'የመኸር ወቅት (Meher) – ዋናው ዝናብ እና ጥንቃቄ',
    season_meher_desc: 'ዋናው የምርት ዘመን። በከባድ ጥቁር አፈር ላይ ቦይ በማውጣት ውሃ እንዳይተኛ ያድርጉ። የዋግ (Rust) እና የቅጠል ማበስ በሽታዎችን በንቃት ይከታተሉ።',

    // Diagnosis Card
    diag_title: 'የሰብል ምርመራ',
    diag_urgency: 'የአስቸኳይነት ደረጃ',
    diag_confidence: 'የእርግጠኝነት መጠን',
    diag_immediate_actions: 'አስቸኳይ እርምጃዎች',
    diag_organic_remedies: 'ተፈጥሯዊ እና አነስተኛ ወጪ መፍትሔዎች',
    diag_preventive_measures: 'የመከላከያ እርምጃዎች',
    diag_was_this_helpful: 'ይህ ምክር ለእርሻዎ ጠቃሚ ነበር?',
    diag_yes_helpful: 'ጠቃሚ ነው',
    diag_not_helpful: 'ጠቃሚ አይደለም',
  },

  om: {
    // Navigation
    nav_home: 'Fuula Dura',
    nav_dashboard: 'Daashboordii',
    nav_diagnose: 'Qorannoo',
    nav_community: 'Hawaasa',
    nav_profile: 'Eenyummaa',
    nav_sign_in: 'Seeni',
    nav_sign_out: 'Bahi',
    nav_language: 'Afaan',

    // Common Actions
    action_submit: 'Rakkoo Ergi',
    action_submitting: 'Ergamaa jira...',
    action_cancel: 'Dhiisi',
    action_save: 'Oolchi',
    action_saved: 'Milkaa’inaan kuufameera',
    action_retry: 'Irra Deebi’i',
    action_refresh: 'Haaromsi',
    action_filter: 'Midhaaniin Calali',
    action_search: 'Furmaata hawaasaa barbaadi...',
    action_view_advice: 'Kaardii Gorsaa Ilaali',
    action_ask_question: 'Qorannoo Midhaanii Haaraa',
    action_share_remedy: 'Muuxannoo Qonnaa Qoodi',
    action_verified_by_farmers: 'Qonnoonni Mirkaneessan',
    action_verify_remedy: 'Muuxannoo Mirkaneessi',

    // Offline / Connectivity
    status_online: 'Toora Irra Jira',
    status_offline: 'Toora Irraa Ala (Offline)',
    status_offline_banner: 'Interneetii hin qabdan. Ruut (Root) bilbila keessan irratti AI dhaan tajaajila kenna.',
    status_syncing: 'Waliin hidhamaa jira...',
    status_queued_local: 'Kuusaa bilbilaa keessa kuufameera',
    status_cached_ready: 'Interneetii malee hojjeta',

    // Dashboard
    dash_welcome: 'Baga nagaan dhuftan Qonnaan bulaa',
    dash_subtitle: 'Wiirtuu gorsa qonnaa fi qorannoo lafa qonnaa keessan.',
    dash_verified_farmer: 'Qonnaan Bulaa Mirkanaa’e',
    dash_season_radar: 'Haala Qilleensaa fi Waqtii Qonnaa Itoophiyaa',
    dash_total_inquiries: 'Waliigala Qorannoowwan',
    dash_confirmed_resolutions: 'Qorannoowwan Mirkanaa’an',
    dash_active_crops: 'Midhaan Oomishamu',
    dash_offline_ready: 'Kaardiiwwan Kuufaman',
    dash_quick_actions: 'Tajaajiloota Ariifachiisoo',
    dash_recent_diagnoses: 'Qorannoo Midhaanii Dhiyoo',
    dash_no_diagnoses_yet: 'Hanga ammaatti qorannoon hin galmoofne.',
    dash_start_first_diagnosis: 'Qorannoo Jalqabaa Eegali',
    dash_community_spotlight: 'Muuxannoowwan Qonnaan Bulaa Midhaan Keessaniif',
    dash_farm_details: 'Oodeeffannoo Qonnaa',
    dash_agro_zone: 'Kuta Qilleensaa',
    dash_region: 'Naannoo',
    dash_farm_size: 'Bal’ina Lafa Qonnaa',

    // Seasonal Advisory
    season_bega_title: 'Waqtii Bonaa (Bega) – Oomisha Funaanuu fi Kuusuu',
    season_bega_desc: 'Waqtii gogaa bonaa. Midhaan haamuu, dhiituu, fi jiidha irraa eeguuf korojoo PICS fayyadamuu dursa kennaa. Midhaan jallisiif bishaan kennuu.',
    season_belg_title: 'Waqtii Arfaasaa (Belg) – Rooba Gabaabaa fi Facaasaa',
    season_belg_desc: 'Waqtii rooba gabaabaa. Midhaan yeroo gabaabaa (garbuu, boqqoolloo, atara) lafa qopheessuun facaasaa.',
    season_meher_title: 'Waqtii Gannaa (Meher) – Rooba Guddaa fi Eeggannoo',
    season_meher_desc: 'Waqtii oomisha guddaa. Biyyo kooticha irratti dhangala’aa bishaanii qopheessaa. Dhukkuba wangee (rust) fi baalaa dammaqinaan hordofaa.',

    // Diagnosis Card
    diag_title: 'Qorannoo Midhaanii',
    diag_urgency: 'Sadarkaa Ariifachiisummaa',
    diag_confidence: 'Hammam Mirkanaa’e',
    diag_immediate_actions: 'Tarkaanfiiwwan Ariifachiisoo',
    diag_organic_remedies: 'Furmaata Uumamaa fi Baasii Xiqqaa',
    diag_preventive_measures: 'Tarkaanfiiwwan Ittisaa',
    diag_was_this_helpful: 'Gorsi kun qonnaa keessaniif faayidaa qabaa?',
    diag_yes_helpful: 'Faayidaa Qaba',
    diag_not_helpful: 'Faayidaa Hin Qabu',
  },
};
