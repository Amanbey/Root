/**
 * ROOT – COMPREHENSIVE MULTILINGUAL TRANSLATION DICTIONARY
 * Supports:
 * - English (en) [DEFAULT]
 * - Amharic (am) – አማርኛ
 * - Afaan Oromoo (om) – Oromo
 * 
 * RULE: Zero mixing of languages. Every string must render strictly in the selected language.
 */

import { SupportedLanguage } from '@/lib/types';

export interface Translations {
  // Brand & Global
  brand_name: string;
  brand_tagline: string;
  footer_text: string;

  // Navigation
  nav_home: string;
  nav_dashboard: string;
  nav_diagnose: string;
  nav_community: string;
  nav_profile: string;
  nav_sign_in: string;
  nav_sign_out: string;
  nav_register: string;
  nav_language: string;

  // Common Actions & Statuses
  action_submit: string;
  action_submitting: string;
  action_cancel: string;
  action_save: string;
  action_saving: string;
  action_saved: string;
  action_retry: string;
  action_refresh: string;
  action_filter: string;
  action_search: string;
  action_view_advice: string;
  action_view_all: string;
  action_ask_question: string;
  action_share_remedy: string;
  action_verified_by_farmers: string;
  action_verify_remedy: string;
  action_edit_profile: string;

  // Connectivity & Offline
  status_online: string;
  status_offline: string;
  status_offline_banner: string;
  status_syncing: string;
  status_queued_local: string;
  status_cached_ready: string;
  status_synced_success: string;
  status_sync_now: string;

  // Offline Screen
  offline_screen_title: string;
  offline_screen_subtitle: string;
  offline_screen_description: string;
  offline_screen_feature1: string;
  offline_screen_feature2: string;
  offline_screen_feature3: string;
  offline_screen_btn_retry: string;
  offline_screen_btn_diagnose: string;

  // Homepage
  home_badge: string;
  home_hero_title: string;
  home_hero_highlight: string;
  home_hero_description: string;
  home_btn_ask: string;
  home_btn_dashboard: string;
  home_metric_offline: string;
  home_metric_offline_sub: string;
  home_metric_agents: string;
  home_metric_agents_sub: string;
  home_metric_cost: string;
  home_metric_cost_sub: string;
  home_council_title: string;
  home_council_subtitle: string;
  home_agent_orchestrator_title: string;
  home_agent_orchestrator_desc: string;
  home_agent_orchestrator_tag: string;
  home_agent_diagnostic_title: string;
  home_agent_diagnostic_desc: string;
  home_agent_diagnostic_tag: string;
  home_agent_context_title: string;
  home_agent_context_desc: string;
  home_agent_context_tag: string;
  home_agent_knowledge_title: string;
  home_agent_knowledge_desc: string;
  home_agent_knowledge_tag: string;
  home_agent_advisor_title: string;
  home_agent_advisor_desc: string;
  home_agent_advisor_tag: string;

  // Dashboard Page
  dash_welcome: string;
  dash_subtitle: string;
  dash_verified_farmer: string;
  dash_season_radar: string;
  dash_total_inquiries: string;
  dash_total_inquiries_sub: string;
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
  dash_hectares: string;

  // Diagnose Page & Form
  diag_badge: string;
  diag_title: string;
  diag_subtitle: string;
  diag_field_crop: string;
  diag_field_crop_placeholder: string;
  diag_field_title: string;
  diag_field_title_placeholder: string;
  diag_field_symptoms: string;
  diag_field_symptoms_placeholder: string;
  diag_field_photo: string;
  diag_field_photo_hint: string;
  diag_field_photo_uploading: string;
  diag_field_region: string;
  diag_field_zone: string;
  diag_btn_submit: string;
  diag_btn_submitting: string;
  diag_council_working: string;
  diag_council_step_init: string;
  diag_council_step_diagnostic: string;
  diag_council_step_context: string;
  diag_council_step_knowledge: string;
  diag_council_step_advisor: string;
  diag_council_finished: string;
  diag_recent_title: string;
  diag_recent_sub: string;
  diag_offline_saved_title: string;
  diag_offline_saved_desc: string;
  diag_offline_saved_empty: string;
  diag_open_offline_card: string;

  // Advice Card Presentation
  card_title: string;
  card_confidence: string;
  card_confirmed: string;
  card_urgency: string;
  card_urgency_immediate: string;
  card_urgency_high: string;
  card_urgency_moderate: string;
  card_urgency_low: string;
  card_scientific_name: string;
  card_probable_cause: string;
  card_visual_symptoms: string;
  card_immediate_actions: string;
  card_organic_remedies: string;
  card_chemical_controls: string;
  card_preventive_measures: string;
  card_local_context: string;
  card_season_action: string;
  card_pesticide_warning: string;
  card_feedback_prompt: string;
  card_feedback_helpful: string;
  card_feedback_unhelpful: string;
  card_feedback_thanks: string;
  card_cached_badge: string;
  card_back_to_diagnose: string;

  // Community Page
  comm_badge: string;
  comm_title: string;
  comm_subtitle: string;
  comm_btn_share: string;
  comm_search_placeholder: string;
  comm_filter_all_crops: string;
  comm_filter_all_regions: string;
  comm_empty_title: string;
  comm_empty_desc: string;
  comm_verified_count: string;
  comm_btn_verify: string;
  comm_btn_verified: string;
  comm_modal_title: string;
  comm_modal_crop: string;
  comm_modal_problem: string;
  comm_modal_problem_placeholder: string;
  comm_modal_symptoms: string;
  comm_modal_symptoms_placeholder: string;
  comm_modal_solution: string;
  comm_modal_solution_placeholder: string;
  comm_modal_region: string;
  comm_modal_zone: string;
  comm_modal_btn_publish: string;
  comm_modal_btn_publishing: string;

  // Farmer Profile Page
  prof_title: string;
  prof_subtitle: string;
  prof_context_active: string;
  prof_personal_info: string;
  prof_full_name: string;
  prof_phone: string;
  prof_geographic: string;
  prof_region: string;
  prof_zone_name: string;
  prof_woreda: string;
  prof_agro_zone: string;
  prof_farm_details: string;
  prof_language: string;
  prof_farm_size: string;
  prof_main_crops: string;
  prof_btn_save: string;
  prof_btn_saving: string;
  prof_success_msg: string;

  // Auth Pages
  auth_login_title: string;
  auth_login_subtitle: string;
  auth_email: string;
  auth_password: string;
  auth_btn_login: string;
  auth_btn_logging_in: string;
  auth_no_account: string;
  auth_register_link: string;
  auth_register_title: string;
  auth_register_subtitle: string;
  auth_btn_register: string;
  auth_btn_registering: string;
  auth_has_account: string;
  auth_login_link: string;

  // Seasonal Advisory Radar
  season_priority: string;
  season_actions_heading: string;
  season_alerts_heading: string;

  // Additional Dashboard Actions & Stats
  dash_action_ask_sub: string;
  dash_action_comm_title: string;
  dash_action_comm_sub: string;
  dash_action_prof_title: string;
  dash_action_prof_sub: string;
  dash_stat_resolved_advice: string;
  dash_stat_ai_ready: string;
  dash_stat_confidence_confirmed: string;

  // PWA & Installation
  pwa_install_title: string;
  pwa_install_sub: string;
  pwa_btn_install: string;
  pwa_installed: string;

  // Agent Council Timeline
  timeline_council_title: string;
  timeline_council_sub: string;
  timeline_agent_orchestrator: string;
  timeline_agent_diagnostic: string;
  timeline_agent_context: string;
  timeline_agent_knowledge: string;
  timeline_agent_advisor: string;
  timeline_agent_critic: string;

  // Auth Form Labels & Helpers
  auth_register_header_title: string;
  auth_register_header_sub: string;
  auth_field_fullname: string;
  auth_field_phone: string;
  auth_field_preferred_language: string;
  auth_btn_complete_registration: string;
  auth_return_home: string;
  auth_sign_in_here: string;
  auth_logging_out: string;
  auth_login_header_sub: string;
  auth_register_farmer_link: string;
  auth_reg_success_msg: string;

  // Offline Indicators
  offline_banner_queued: string;
  offline_banner_connected_queued: string;
}

export type TranslationKey = keyof Translations;

export const translations: Record<SupportedLanguage, Translations> = {
  // =========================================================================
  // 1. ENGLISH (DEFAULT)
  // =========================================================================
  en: {
    // Brand & Global
    brand_name: 'Root',
    brand_tagline: 'Agro-Advisory Platform',
    footer_text: 'Root Ethiopia • Agro-Ecological Advisory Engine • 100% Offline-First Multi-Agent Architecture',

    // Navigation
    nav_home: 'Home',
    nav_dashboard: 'Dashboard',
    nav_diagnose: 'Diagnose',
    nav_community: 'Community',
    nav_profile: 'Profile',
    nav_sign_in: 'Sign In',
    nav_sign_out: 'Logout',
    nav_register: 'Register',
    nav_language: 'Language',

    // Common Actions & Statuses
    action_submit: 'Submit Problem',
    action_submitting: 'Submitting...',
    action_cancel: 'Cancel',
    action_save: 'Save Profile',
    action_saving: 'Saving...',
    action_saved: 'Saved Successfully',
    action_retry: 'Try Again',
    action_refresh: 'Refresh',
    action_filter: 'Filter by Crop',
    action_search: 'Search remedies...',
    action_view_advice: 'View Advice Card',
    action_view_all: 'View All',
    action_ask_question: 'New Crop Diagnosis',
    action_share_remedy: 'Share Field Remedy',
    action_verified_by_farmers: 'Farmers Verified',
    action_verify_remedy: 'Verify Remedy',
    action_edit_profile: 'Edit Farm Profile',

    // Connectivity & Offline
    status_online: 'Online',
    status_offline: 'Offline Mode Active',
    status_offline_banner: 'Offline Mode Active • Local AI & cached records ready',
    status_syncing: 'Synchronizing offline diagnoses to cloud...',
    status_queued_local: 'Queued locally in IndexedDB',
    status_cached_ready: 'Available without internet',
    status_synced_success: 'Connected • All local diagnoses synchronized!',
    status_sync_now: 'Sync Now',

    // Offline Screen
    offline_screen_title: 'Working Fully Offline',
    offline_screen_subtitle: 'No internet connection detected on your device.',
    offline_screen_description: 'Root was built from the ground up for Ethiopian smallholder farmers. When working in remote fields without cell towers or data, your app remains 100% operational.',
    offline_screen_feature1: 'Local Multi-Agent Agronomy AI continues analyzing crops',
    offline_screen_feature2: 'Diagnoses and queries are securely saved in your phone’s memory',
    offline_screen_feature3: 'Auto-sync uploads your records immediately when signal returns',
    offline_screen_btn_retry: 'Check Connection',
    offline_screen_btn_diagnose: 'Start Offline Diagnosis',

    // Homepage
    home_badge: 'Offline-First Multi-Agent Agronomy',
    home_hero_title: 'Practical Crop Advice,',
    home_hero_highlight: 'Even With Zero Internet.',
    home_hero_description: 'Diagnose pest damage, blight, and nutrient deficiencies directly in the field. Root deploys an offline-first team of specialized AI agents running on local intelligence and peer-verified Ethiopian agricultural knowledge.',
    home_btn_ask: 'Ask a Crop Question',
    home_btn_dashboard: 'Farmer Dashboard',
    home_metric_offline: '100%',
    home_metric_offline_sub: 'Offline Usable',
    home_metric_agents: '5+',
    home_metric_agents_sub: 'Collaborative Agents',
    home_metric_cost: '0 ETB',
    home_metric_cost_sub: 'Farmer Cost',
    home_council_title: 'Collaborative Agent Council',
    home_council_subtitle: 'How specialized agents collaborate before delivering your verified Advice Card',
    home_agent_orchestrator_title: 'Orchestrator Agent',
    home_agent_orchestrator_desc: 'Coordinates specialized agents, synthesizes findings, and manages real-time farmer timelines.',
    home_agent_orchestrator_tag: 'Lead Coordinator',
    home_agent_diagnostic_title: 'Diagnostic Agent',
    home_agent_diagnostic_desc: 'Analyzes visual symptoms, blight patterns, pest infestations, and crop leaf discolorations.',
    home_agent_diagnostic_tag: 'Vision & Symptom AI',
    home_agent_context_title: 'Local Context Agent',
    home_agent_context_desc: 'Adapts advice to Ethiopian agro-ecological zones (Weyna Dega, Dega, Kolla), soils & rainy seasons.',
    home_agent_context_tag: 'Ethiopian Agronomy',
    home_agent_knowledge_title: 'Community Knowledge Agent',
    home_agent_knowledge_desc: 'Matches current problem against peer-verified farmer solutions stored in vector memory.',
    home_agent_knowledge_tag: 'Local Farmer Memory',
    home_agent_advisor_title: 'Advisor Agent',
    home_agent_advisor_desc: 'Produces actionable, low-cost, pesticide-safe step-by-step Advice Cards with zero jargon.',
    home_agent_advisor_tag: 'Structured Cards',

    // Dashboard Page
    dash_welcome: 'Welcome, Farmer',
    dash_subtitle: 'Your personal agricultural advisory hub and farm diagnostic center.',
    dash_verified_farmer: 'Verified Smallholder Farmer',
    dash_season_radar: 'Ethiopian Agro-Ecological Season Radar',
    dash_total_inquiries: 'Total Inquiries',
    dash_total_inquiries_sub: 'Field diagnostic queries',
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
    dash_hectares: 'Hectares',

    // Diagnose Page & Form
    diag_badge: 'Multi-Agent Advisory System • Step 1',
    diag_title: 'Diagnose Crop Problem',
    diag_subtitle: 'Submit your crop symptoms or upload a field photo. Root’s Diagnostic Agent will analyze the pathogen and generate a structured Advice Card.',
    diag_field_crop: 'Select Crop',
    diag_field_crop_placeholder: 'Choose affected crop...',
    diag_field_title: 'Problem Title or Summary',
    diag_field_title_placeholder: 'e.g., Yellow rust spots covering wheat leaves',
    diag_field_symptoms: 'Detailed Symptoms & Field Observations',
    diag_field_symptoms_placeholder: 'Describe what the leaves, stems, or roots look like. When did you notice it? How severe is the spread across your plot?',
    diag_field_photo: 'Field Crop Photo (Optional)',
    diag_field_photo_hint: 'Upload or snap a photo of the affected leaf, fruit, or stem for AI visual inspection.',
    diag_field_photo_uploading: 'Uploading photo to secure cloud storage...',
    diag_field_region: 'Region',
    diag_field_zone: 'Agro-Ecological Zone',
    diag_btn_submit: 'Diagnose Crop Problem',
    diag_btn_submitting: 'Consulting Multi-Agent Council...',
    diag_council_working: '5-Agent Council In Session',
    diag_council_step_init: 'Orchestrator Agent initializing pipeline',
    diag_council_step_diagnostic: 'Diagnostic Agent analyzing leaf pathology',
    diag_council_step_context: 'Local Context Agent tailoring to agro-ecological zone',
    diag_council_step_knowledge: 'Community Knowledge Agent searching peer memory',
    diag_council_step_advisor: 'Advisor Agent synthesizing structured Advice Card',
    diag_council_finished: 'Analysis Complete! Redirecting to Advice Card...',
    diag_recent_title: 'Your Recent Diagnoses',
    diag_recent_sub: 'Peer-verified and saved to device',
    diag_offline_saved_title: 'Offline Saved Advice Cards',
    diag_offline_saved_desc: 'Stored locally in IndexedDB on this device for instant access in remote fields without cellular network.',
    diag_offline_saved_empty: 'No offline advice cards cached yet. Submitted cards are automatically stored here.',
    diag_open_offline_card: 'Open Offline Card',

    // Advice Card Presentation
    card_title: 'Crop Diagnosis & Action Plan',
    card_confidence: 'Confidence Score',
    card_confirmed: 'Confirmed Pathogen',
    card_urgency: 'Urgency Level',
    card_urgency_immediate: 'Immediate Action Required',
    card_urgency_high: 'High Priority',
    card_urgency_moderate: 'Moderate Priority',
    card_urgency_low: 'Low Priority / Monitoring',
    card_scientific_name: 'Scientific Pathogen Name',
    card_probable_cause: 'Probable Cause & Symptoms',
    card_visual_symptoms: 'Observed Visual Indicators',
    card_immediate_actions: 'Immediate Actions (Next 24-48 Hours)',
    card_organic_remedies: 'Organic & Low-Cost Remedies',
    card_chemical_controls: 'Chemical Treatments (Safe Application)',
    card_preventive_measures: 'Preventive Measures for Next Cycle',
    card_local_context: 'Ethiopian Agro-Ecological Context',
    card_season_action: 'Recommended Seasonal Action',
    card_pesticide_warning: 'Safety Warning: Wear protective face covering and boots. Never spray near open water bodies or beehives.',
    card_feedback_prompt: 'Was this agronomic advice helpful to your farm?',
    card_feedback_helpful: 'Helpful',
    card_feedback_unhelpful: 'Not Helpful',
    card_feedback_thanks: 'Thank you for your feedback! Your vote helps calibrate local recommendations for Ethiopian farmers.',
    card_cached_badge: 'Available Offline on Device',
    card_back_to_diagnose: 'Back to Diagnoses',

    // Community Page
    comm_badge: 'Peer-to-Peer Agronomy Knowledge',
    comm_title: 'Community Knowledge Hub',
    comm_subtitle: 'Explore peer-verified traditional and organic farming remedies from fellow smallholders across Ethiopia, or share your own proven solution.',
    comm_btn_share: 'Share Field Remedy',
    comm_search_placeholder: 'Search remedies by crop, pest, or method...',
    comm_filter_all_crops: 'All Crops',
    comm_filter_all_regions: 'All Regions',
    comm_empty_title: 'No peer remedies matched this filter',
    comm_empty_desc: 'Be the first Ethiopian farmer to share a proven remedy for this crop!',
    comm_verified_count: 'Farmers Verified',
    comm_btn_verify: 'Verify Remedy',
    comm_btn_verified: 'Verified by You',
    comm_modal_title: 'Share a Field-Proven Farming Remedy',
    comm_modal_crop: 'Crop Type',
    comm_modal_problem: 'Problem Title',
    comm_modal_problem_placeholder: 'e.g., Eragrostis tef Lodging Suppression Using Ash',
    comm_modal_symptoms: 'Symptoms Observed',
    comm_modal_symptoms_placeholder: 'Describe what the crop looked like before the treatment...',
    comm_modal_solution: 'Proven Solution / Preparation Method',
    comm_modal_solution_placeholder: 'Step-by-step how you prepared and applied this organic or low-cost remedy...',
    comm_modal_region: 'Your Region',
    comm_modal_zone: 'Agro-Ecological Zone',
    comm_modal_btn_publish: 'Publish Remedy to Community',
    comm_modal_btn_publishing: 'Publishing to Community...',

    // Farmer Profile Page
    prof_title: 'Farmer Profile & Context',
    prof_subtitle: 'Your agro-ecological context is used by the Local Context Agent to deliver tailored recommendations.',
    prof_context_active: 'Local Context Active',
    prof_personal_info: 'Personal Information',
    prof_full_name: 'Full Name',
    prof_phone: 'Phone Number',
    prof_geographic: 'Geographic Location',
    prof_region: 'Region',
    prof_zone_name: 'Zone / Sub-Region',
    prof_woreda: 'Woreda / District',
    prof_agro_zone: 'Agro-Ecological Zone',
    prof_farm_details: 'Farm Details',
    prof_language: 'Preferred Advisory Language',
    prof_farm_size: 'Total Farm Size (Hectares)',
    prof_main_crops: 'Primary Cultivated Crops',
    prof_btn_save: 'Save Profile',
    prof_btn_saving: 'Saving Profile...',
    prof_success_msg: 'Profile updated successfully! AI agents will now adapt advice to your farm context.',

    // Auth Pages
    auth_login_title: 'Sign In to Root',
    auth_login_subtitle: 'Access your field diagnoses, advisory history, and offline cards.',
    auth_email: 'Email Address',
    auth_password: 'Password',
    auth_btn_login: 'Sign In',
    auth_btn_logging_in: 'Signing In...',
    auth_no_account: 'Do not have an account?',
    auth_register_link: 'Register as a Farmer',
    auth_register_title: 'Farmer Registration',
    auth_register_subtitle: 'Join Root to get AI crop diagnostics and local agronomy advice.',
    auth_btn_register: 'Create Farmer Account',
    auth_btn_registering: 'Creating Account...',
    auth_has_account: 'Already have an account?',
    auth_login_link: 'Sign In',

    // Seasonal Advisory Radar
    season_priority: 'Seasonal Priority:',
    season_actions_heading: 'Critical Seasonal Actions',
    season_alerts_heading: 'Active Seasonal Pest Alerts',

    // Additional Dashboard Actions & Stats
    dash_action_ask_sub: 'Submit photo or leaf symptoms',
    dash_action_comm_title: 'Community Remedies',
    dash_action_comm_sub: 'Peer-verified regional solutions',
    dash_action_prof_title: 'Farm Profile',
    dash_action_prof_sub: 'Update zone and registered crops',
    dash_stat_resolved_advice: 'Resolved with Advice',
    dash_stat_ai_ready: '100% Multi-Agent AI ready',
    dash_stat_confidence_confirmed: 'Confirmed',

    // PWA & Installation
    pwa_install_title: 'Install Root App',
    pwa_install_sub: '100% offline in field',
    pwa_btn_install: 'Install',
    pwa_installed: 'Installed',

    // Agent Council Timeline
    timeline_council_title: '5-Agent Agronomic Council',
    timeline_council_sub: 'Specialized local AI agents collaborating on disease diagnosis & organic remedy synthesis.',
    timeline_agent_orchestrator: 'Council Orchestrator',
    timeline_agent_diagnostic: 'Diagnostic Agent',
    timeline_agent_context: 'Local Context Agent',
    timeline_agent_knowledge: 'Community Knowledge Agent',
    timeline_agent_advisor: 'Advisor Agent',
    timeline_agent_critic: 'Safety Critic Agent',

    // Auth Form Labels & Helpers
    auth_register_header_title: 'Create Farmer Profile',
    auth_register_header_sub: 'Customize advice to your region, elevation, and main crops',
    auth_field_fullname: 'Full Name',
    auth_field_phone: 'Phone Number',
    auth_field_preferred_language: 'Preferred Advisory Language',
    auth_btn_complete_registration: 'Complete Registration',
    auth_return_home: 'Return to Home',
    auth_sign_in_here: 'Sign In here',
    auth_logging_out: 'Logging out...',
    auth_login_header_sub: 'Access your field diagnoses, advice cards, and offline sync',
    auth_register_farmer_link: 'Register Farmer Profile',
    auth_reg_success_msg: 'Registration successful! You can now sign in with your credentials below.',

    // Offline Indicators
    offline_banner_queued: 'items queued',
    offline_banner_connected_queued: 'Connected • items awaiting sync',
  },

  // =========================================================================
  // 2. AMHARIC (አማርኛ)
  // =========================================================================
  am: {
    // Brand & Global
    brand_name: 'ሩት',
    brand_tagline: 'የግብርና ምክር መድረክ',
    footer_text: 'ሩት ኢትዮጵያ • የግብርና ስነ-ምህዳር ምክር ስርዓት • 100% ከመስመር ውጭ የሚሰራ አርቴፊሻል ኢንተለጀንስ',

    // Navigation
    nav_home: 'መነሻ',
    nav_dashboard: 'ዳሽቦርድ',
    nav_diagnose: 'ምርመራ',
    nav_community: 'ማህበረሰብ',
    nav_profile: 'መገለጫ',
    nav_sign_in: 'ግባ',
    nav_sign_out: 'ውጣ',
    nav_register: 'ተመዝገብ',
    nav_language: 'ቋንቋ',

    // Common Actions & Statuses
    action_submit: 'ችግሩን ላክ',
    action_submitting: 'በመላክ ላይ...',
    action_cancel: 'ይቅር',
    action_save: 'መረጃ አስቀምጥ',
    action_saving: 'በማስቀመጥ ላይ...',
    action_saved: 'በትክክል ተቀምጧል',
    action_retry: 'እንደገና ሞክር',
    action_refresh: 'አድስ',
    action_filter: 'በሰብል ለይ',
    action_search: 'የገበሬዎች መፍትሔዎችን ፈልግ...',
    action_view_advice: 'የምክር ካርድ ይመልከቱ',
    action_view_all: 'ሁሉንም ይመልከቱ',
    action_ask_question: 'አዲስ የሰብል ምርመራ',
    action_share_remedy: 'የእርሻ ተሞክሮ አጋራ',
    action_verified_by_farmers: 'ገበሬዎች አረጋግጠዋል',
    action_verify_remedy: 'ተሞክሮውን አረጋግጥ',
    action_edit_profile: 'የእርሻ መገለጫ አሻሽል',

    // Connectivity & Offline
    status_online: 'ኢንተርኔት አለ',
    status_offline: 'ከመስመር ውጭ ይሰራል',
    status_offline_banner: 'ከመስመር ውጭ (Offline) • በስልክዎ ላይ የተቀመጠው AI ይሰራል',
    status_syncing: 'ከደመናው ጋር በማመሳሰል ላይ...',
    status_queued_local: 'በስልክዎ ማህደረ-ትውስታ ውስጥ ተቀምጧል',
    status_cached_ready: 'ያለ ኢንተርኔት ይሰራል',
    status_synced_success: 'ተገናኝቷል • ሁሉም ምርመራዎች ተመሳስለዋል!',
    status_sync_now: 'አሁን አመሳስል',

    // Offline Screen
    offline_screen_title: 'ሙሉ በሙሉ ያለ ኢንተርኔት ይሰራል',
    offline_screen_subtitle: 'በስልክዎ ላይ ምንም የኢንተርኔት ግንኙነት አልተገኘም።',
    offline_screen_description: 'ሩት የተገነባው ለኢትዮጵያ አርሶ አደሮች ነው። የሞባይል ኔትወርክ በሌለበት ሩቅ እርሻ ውስጥ ቢሆኑም አፑ 100% ያለ ምንም መቆራረጥ ስራውን ይቀጥላል።',
    offline_screen_feature1: 'የውስጥ የግብርና ኤአይ ወኪሎች የሰብል በሽታዎችን ይመረምራሉ',
    offline_screen_feature2: 'የምርመራ ጥያቄዎች እና ካርዶች በስልክዎ ውስጥ በደህንነት ይቀመጣሉ',
    offline_screen_feature3: 'ኔትወርክ ሲገኝ መረጃዎች በራሳቸው ወደ ደመናው ይላካሉ',
    offline_screen_btn_retry: 'ግንኙነትን ፈትሽ',
    offline_screen_btn_diagnose: 'ያለ ኢንተርኔት ምርመራ ጀምር',

    // Homepage
    home_badge: 'ከመስመር ውጭ የሚሰራ የባለብዙ ወኪል AI ግብርና',
    home_hero_title: 'ተግባራዊ የሰብል ምክር፣',
    home_hero_highlight: 'ያለ ምንም ኢንተርኔት።',
    home_hero_description: 'የተባይ ጉዳት፣ አረም እና የምግብ እጥረትን በቀጥታ ከማሳዎ ይመርምሩ። ሩት በአካባቢያዊ እውቀት እና በኢትዮጵያ አርሶ አደሮች ተሞክሮ የሚሰራ የኤአይ ቡድን ያቀርባል።',
    home_btn_ask: 'የሰብል ጥያቄ ይጠይቁ',
    home_btn_dashboard: 'የገበሬው ዳሽቦርድ',
    home_metric_offline: '100%',
    home_metric_offline_sub: 'ከመስመር ውጭ የሚሰራ',
    home_metric_agents: '5+',
    home_metric_agents_sub: 'ልዩ የኤአይ ወኪሎች',
    home_metric_cost: '0 ብር',
    home_metric_cost_sub: 'ለሁሉም አርሶ አደር ነፃ',
    home_council_title: 'የተቀናጀ የባለሙያ ወኪሎች ምክር ቤት',
    home_council_subtitle: 'ልዩ ወኪሎች የተረጋገጠውን የምክር ካርድ ለእርስዎ ከማድረሳቸው በፊት እንዴት እንደሚተባበሩ',
    home_agent_orchestrator_title: 'አስተባባሪ ወኪል',
    home_agent_orchestrator_desc: 'ልዩ ወኪሎችን ያስተባብራል፣ የምርመራ ውጤቶችን ያጠቃልላል፣ እና የእርምጃዎችን ቅደም ተከተል ይመራል።',
    home_agent_orchestrator_tag: 'ዋና አስተባባሪ',
    home_agent_diagnostic_title: 'የምርመራ ወኪል',
    home_agent_diagnostic_desc: 'የቅጠል፣ የግንድ እና የፍሬ ምልክቶችን ይመረምራል፤ የበሽታ አምጪ ተህዋስያንን ይለያል።',
    home_agent_diagnostic_tag: 'የእይታ እና የምልክት ኤአይ',
    home_agent_context_title: 'የአካባቢ ስነ-ምህዳር ወኪል',
    home_agent_context_desc: 'ምክሩን ከኢትዮጵያ የአየር ንብረት ዞኖች (ወይና ደጋ፣ ደጋ፣ ቆላ)፣ ከአፈር ዓይነት እና ከወቅት ጋር ያስማማል።',
    home_agent_context_tag: 'የኢትዮጵያ ግብርና',
    home_agent_knowledge_title: 'የማህበረሰብ እውቀት ወኪል',
    home_agent_knowledge_desc: 'ያጋጠመዎትን ችግር በሌሎች አርሶ አደሮች ከተሞከሩ እና ከተረጋገጡ መፍትሔዎች ጋር ያዛምዳል።',
    home_agent_knowledge_tag: 'የአርሶ አደሮች ማህደረ-ትውስታ',
    home_agent_advisor_title: 'አማካሪ ወኪል',
    home_agent_advisor_desc: 'ተግባራዊ፣ አነስተኛ ወጪ የሚጠይቁ እና ከኬሚካል ጥንቃቄ ጋር የተዘጋጁ የምክር ካርዶችን ያዘጋጃል።',
    home_agent_advisor_tag: 'የተሟላ የምክር ካርድ',

    // Dashboard Page
    dash_welcome: 'እንኳን ደህና መጡ ገበሬ',
    dash_subtitle: 'የእርስዎ የግል የግብርና አማካሪ እና የእርሻ ምርመራ ማዕከል።',
    dash_verified_farmer: 'የተረጋገጠ አርሶ አደር',
    dash_season_radar: 'የኢትዮጵያ ወቅታዊ የግብርና የቀን መቁጠሪያ',
    dash_total_inquiries: 'ጠቅላላ ምርመራዎች',
    dash_total_inquiries_sub: 'የተጠየቁ የሰብል ጥያቄዎች',
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
    dash_hectares: 'ሄክታር',

    // Diagnose Page & Form
    diag_badge: 'የባለብዙ ወኪል የምክር ስርዓት • ደረጃ 1',
    diag_title: 'የሰብል ችግር ምርመራ',
    diag_subtitle: 'የሰብልዎን ምልክቶች ይግለጹ ወይም የማሳ ፎቶ ይላኩ። የሩት የምርመራ ወኪል በሽታውን ተንትኖ የተሟላ የምክር ካርድ ያዘጋጃል።',
    diag_field_crop: 'ሰብል ይምረጡ',
    diag_field_crop_placeholder: 'የተጎዳውን ሰብል ይምረጡ...',
    diag_field_title: 'የችግሩ ርዕስ ወይም ማጠቃለያ',
    diag_field_title_placeholder: 'ምሳሌ፦ በስንዴ ቅጠሎች ላይ ቢጫ ወይም ብርቱካናማ ብናኝ',
    diag_field_symptoms: 'ዝርዝር የበሽታ ምልክቶች እና የማሳ ምልከታ',
    diag_field_symptoms_placeholder: 'ቅጠሎቹ፣ ግንዱ ወይም ፍሬው ምን እንደሚመስል ይግለጹ። መቼ ጀመረ? በማሳዎ ላይ ምን ያህል ተሰራጭቷል?',
    diag_field_photo: 'የማሳ ፎቶ (ከተፈለገ)',
    diag_field_photo_hint: 'የተጎዳውን ቅጠል ወይም ግንድ ፎቶ በማንሳት ለኤአይ እይታ ይላኩ።',
    diag_field_photo_uploading: 'ፎቶውን ወደ ደመና ማከማቻ በመላክ ላይ...',
    diag_field_region: 'ክልል',
    diag_field_zone: 'የአየር ንብረት ዞን',
    diag_btn_submit: 'የሰብል ችግሩን መርምር',
    diag_btn_submitting: 'የባለሙያ ወኪሎች ምክር ቤት እየመረመረ ነው...',
    diag_council_working: 'የ5ቱ ኤአይ ወኪሎች ምክር ቤት በስራ ላይ ነው',
    diag_council_step_init: 'አስተባባሪው ወኪል የምርመራ ሂደቱን በማስጀመር ላይ ነው',
    diag_council_step_diagnostic: 'የምርመራ ወኪሉ የቅጠሉን በሽታ በመተንተን ላይ ነው',
    diag_council_step_context: 'የአካባቢ ስነ-ምህዳር ወኪሉ ምክሩን ከዞንዎ ጋር በማስማማት ላይ ነው',
    diag_council_step_knowledge: 'የማህበረሰብ እውቀት ወኪሉ ከአርሶ አደሮች ተሞክሮ በመፈለግ ላይ ነው',
    diag_council_step_advisor: 'አማካሪው ወኪል የተሟላ የምክር ካርድ በማዘጋጀት ላይ ነው',
    diag_council_finished: 'ምርመራው ተጠናቋል! ወደ ምክር ካርዱ በመቀየር ላይ...',
    diag_recent_title: 'የቅርብ ጊዜ ምርመራዎችዎ',
    diag_recent_sub: 'በአርሶ አደሮች የተረጋገጠ እና በስልክዎ ላይ የተቀመጠ',
    diag_offline_saved_title: 'ያለ ኢንተርኔት የተቀመጡ የምክር ካርዶች',
    diag_offline_saved_desc: 'በሩቅ እርሻዎች ውስጥ ያለ ኔትወርክ በቅጽበት እንዲያገኟቸው በስልክዎ ውስጣዊ ማህደረ-ትውስታ ውስጥ ተቀምጠዋል።',
    diag_offline_saved_empty: 'እስካሁን የተቀመጠ የምክር ካርድ የለም። አዳዲስ ካርዶች በራሳቸው እዚህ ይቀመጣሉ።',
    diag_open_offline_card: 'ካርዱን ያለ ኢንተርኔት ክፈት',

    // Advice Card Presentation
    card_title: 'የሰብል ምርመራ እና የተግባር ዕቅድ',
    card_confidence: 'የእርግጠኝነት መጠን',
    card_confirmed: 'የተረጋገጠ የበሽታ አምጪ',
    card_urgency: 'የአስቸኳይነት ደረጃ',
    card_urgency_immediate: 'አስቸኳይ እርምጃ ያስፈልገዋል',
    card_urgency_high: 'ከፍተኛ ቅድሚያ',
    card_urgency_moderate: 'መካከለኛ ቅድሚያ',
    card_urgency_low: 'ዝቅተኛ ቅድሚያ / ክትትል',
    card_scientific_name: 'ሳይንሳዊ የበሽታ ስም',
    card_probable_cause: 'መንስኤ እና ምልክቶች',
    card_visual_symptoms: 'የታዩ የእይታ ምልክቶች',
    card_immediate_actions: 'አስቸኳይ እርምጃዎች (በሚቀጥሉት 24-48 ሰዓታት)',
    card_organic_remedies: 'ተፈጥሯዊ እና አነስተኛ ወጪ መፍትሔዎች',
    card_chemical_controls: 'የኬሚካል አማራጮች (ጥንቃቄ የተሞላበት አጠቃቀም)',
    card_preventive_measures: 'ለቀጣይ ወቅት የሚወሰዱ የመከላከያ እርምጃዎች',
    card_local_context: 'የኢትዮጵያ ስነ-ምህዳራዊ ሁኔታ',
    card_season_action: 'ወቅታዊ እርምጃ',
    card_pesticide_warning: 'የደህንነት ማስጠንቀቂያ፦ የመከላከያ ጭምብል እና ጓንት ያድርጉ። ከውሃ ምንጮች እና ከንብ ማነቢያዎች አጠገብ በፍጹም አይርጩ።',
    card_feedback_prompt: 'ይህ የግብርና ምክር ለእርሻዎ ጠቃሚ ነበር?',
    card_feedback_helpful: 'ጠቃሚ ነው',
    card_feedback_unhelpful: 'ጠቃሚ አይደለም',
    card_feedback_thanks: 'ስለ አስተያየትዎ እናመሰግናለን! ድምጽዎ ለሌሎች የኢትዮጵያ አርሶ አደሮች ይጠቅማል።',
    card_cached_badge: 'ያለ ኢንተርኔት በስልክዎ ላይ ይሰራል',
    card_back_to_diagnose: 'ወደ ምርመራዎች ተመለስ',

    // Community Page
    comm_badge: 'የአርሶ አደሮች የእርስ በርስ ተሞክሮ ልውውጥ',
    comm_title: 'የማህበረሰብ እውቀት ማዕከል',
    comm_subtitle: 'በኢትዮጵያ አርሶ አደሮች የተሞከሩ እና የተረጋገጡ ተፈጥሯዊ መፍትሔዎችን ይመልከቱ፣ ወይም የራስዎን የተፈተነ ተሞክሮ ያጋሩ።',
    comm_btn_share: 'የእርሻ ተሞክሮ ያጋሩ',
    comm_search_placeholder: 'በሰብል፣ በበሽታ ወይም በመፍትሔ ይፈልጉ...',
    comm_filter_all_crops: 'ሁሉም ሰብሎች',
    comm_filter_all_regions: 'ሁሉም ክልሎች',
    comm_empty_title: 'ምንም የተመዘገበ ተሞክሮ አልተገኘም',
    comm_empty_desc: 'ለዚህ ሰብል የተፈተነ መፍትሔ በማጋራት የመጀመሪያው አርሶ አደር ይሁኑ!',
    comm_verified_count: 'ገበሬዎች አረጋግጠዋል',
    comm_btn_verify: 'ተሞክሮውን አረጋግጥ',
    comm_btn_verified: 'በእርስዎ ተረጋግጧል',
    comm_modal_title: 'የተፈተነ የእርሻ ተሞክሮ ያጋሩ',
    comm_modal_crop: 'የሰብል ዓይነት',
    comm_modal_problem: 'የችግሩ / የበሽታው ስም',
    comm_modal_problem_placeholder: 'ምሳሌ፦ የጤፍ ማረፊያን በአመድ መከላከል',
    comm_modal_symptoms: 'የታዩ ምልክቶች',
    comm_modal_symptoms_placeholder: 'ህክምናው ከመደረጉ በፊት ሰብሉ ምን ይመስል እንደነበር ይግለጹ...',
    comm_modal_solution: 'የተፈተነ ተፈጥሯዊ መፍትሔ / ዝግጅት',
    comm_modal_solution_placeholder: 'ይህን ተፈጥሯዊ መፍትሔ እንዴት እንዳዘጋጁትና እንደተጠቀሙበት ደረጃ በደረጃ ይግለጹ...',
    comm_modal_region: 'ክልልዎ',
    comm_modal_zone: 'የአየር ንብረት ዞን',
    comm_modal_btn_publish: 'ለማህበረሰቡ አጋራ',
    comm_modal_btn_publishing: 'በማጋራት ላይ...',

    // Farmer Profile Page
    prof_title: 'የአርሶ አደር መገለጫ እና ሁኔታ',
    prof_subtitle: 'የአካባቢዎ ስነ-ምህዳር መረጃ ትክክለኛ የኤአይ ምክር ለእርስዎ ለማቅረብ ያገለግላል።',
    prof_context_active: 'የአካባቢ ሁኔታ ንቁ ነው',
    prof_personal_info: 'የግል መረጃ',
    prof_full_name: 'ሙሉ ስም',
    prof_phone: 'ስልክ ቁጥር',
    prof_geographic: 'መልክዓ ምድራዊ አቀማመጥ',
    prof_region: 'ክልል',
    prof_zone_name: 'ዞን',
    prof_woreda: 'ወረዳ',
    prof_agro_zone: 'የአየር ንብረት ዞን',
    prof_farm_details: 'የእርሻ መረጃ',
    prof_language: 'የምክር ቋንቋ ምርጫ',
    prof_farm_size: 'ጠቅላላ የእርሻ ስፋት (በሄክታር)',
    prof_main_crops: 'የሚያመርቷቸው ዋና ዋና ሰብሎች',
    prof_btn_save: 'መረጃ አስቀምጥ',
    prof_btn_saving: 'በማስቀመጥ ላይ...',
    prof_success_msg: 'መገለጫዎ በትክክል ተዘምኗል! የኤአይ ወኪሎች ምክራቸውን ለእርሻዎ ሁኔታ ያዘጋጃሉ።',

    // Auth Pages
    auth_login_title: 'ወደ ሩት ይግቡ',
    auth_login_subtitle: 'የሰብል ምርመራዎችዎን እና የምክር ካርዶችዎን ያግኙ።',
    auth_email: 'ኢሜይል አድራሻ',
    auth_password: 'የይለፍ ቃል',
    auth_btn_login: 'ግባ',
    auth_btn_logging_in: 'በመግባት ላይ...',
    auth_no_account: 'መለያ የለዎትም?',
    auth_register_link: 'እንደ አርሶ አደር ይመዝገቡ',
    auth_register_title: 'የአርሶ አደር ምዝገባ',
    auth_register_subtitle: 'ነፃ የሰብል ምርመራ እና አካባቢያዊ የግብርና ምክር ለማግኘት ይመዝገቡ።',
    auth_btn_register: 'መለያ ፍጠር',
    auth_btn_registering: 'በመፍጠር ላይ...',
    auth_has_account: 'ቀደም ሲል መለያ አለዎት?',
    auth_login_link: 'ግባ',

    // Seasonal Advisory Radar
    season_priority: 'የወቅቱ ዋና ትኩረት፦',
    season_actions_heading: 'ወቅታዊ ተግባራት',
    season_alerts_heading: 'የተባይ እና በሽታ ማስጠንቀቂያ',

    // Additional Dashboard Actions & Stats
    dash_action_ask_sub: 'የሰብል ፎቶ ወይም ምልክቶችን ይላኩ',
    dash_action_comm_title: 'የገበሬዎች ተሞክሮ',
    dash_action_comm_sub: 'በአርሶ አደሮች የተረጋገጡ መፍትሔዎች',
    dash_action_prof_title: 'የእርሻ መገለጫ',
    dash_action_prof_sub: 'ዞን እና ዋና ሰብሎችን ያዘምኑ',
    dash_stat_resolved_advice: 'በምክር ካርድ የተፈታ',
    dash_stat_ai_ready: '100% ኤአይ ዝግጁ ነው',
    dash_stat_confidence_confirmed: 'ተረጋግጧል',

    // PWA & Installation
    pwa_install_title: 'የሩት መተግበሪያን ጫን',
    pwa_install_sub: '100% ያለ ኢንተርኔት ይሰራል',
    pwa_btn_install: 'ጫን',
    pwa_installed: 'ተጭኗል',

    // Agent Council Timeline
    timeline_council_title: 'የ5ቱ የግብርና ኤጀንቶች ጉባኤ',
    timeline_council_sub: 'ልዩ የኤአይ ወኪሎች በጋራ በመሆን የበሽታ ምርመራ እና የተፈጥሮ መፍትሔዎችን ያዘጋጃሉ።',
    timeline_agent_orchestrator: 'አስተባባሪ ኤጀንት',
    timeline_agent_diagnostic: 'የበሽታ መርማሪ ኤጀንት',
    timeline_agent_context: 'የአካባቢ አውድ ኤጀንት',
    timeline_agent_knowledge: 'የማህበረሰብ እውቀት ኤጀንት',
    timeline_agent_advisor: 'ዋና አማካሪ ኤጀንት',
    timeline_agent_critic: 'የደህንነት ተቆጣጣሪ',

    // Auth Form Labels & Helpers
    auth_register_header_title: 'የአርሶ አደር መገለጫ ፍጠር',
    auth_register_header_sub: 'ምክሩን እንደ ክልልዎ፣ ከፍታዎ እና ዋና ሰብሎችዎ ያስተካክሉ',
    auth_field_fullname: 'ሙሉ ስም',
    auth_field_phone: 'ስልክ ቁጥር',
    auth_field_preferred_language: 'የሚመርጡት ቋንቋ',
    auth_btn_complete_registration: 'ምዝገባውን አጠናቅቅ',
    auth_return_home: 'ወደ መነሻ ገጽ ተመለስ',
    auth_sign_in_here: 'እዚህ ይግቡ',
    auth_logging_out: 'በመውጣት ላይ...',
    auth_login_header_sub: 'የሰብል ምርመራዎችዎን፣ የምክር ካርዶችዎን እና ከመስመር ውጭ ስራዎችን ያግኙ',
    auth_register_farmer_link: 'የአርሶ አደር መገለጫ ይመዝገቡ',
    auth_reg_success_msg: 'ምዝገባው በተሳካ ሁኔታ ተጠናቋል! አሁን ባስገቡት መረጃ መግባት ይችላሉ።',

    // Offline Indicators
    offline_banner_queued: 'ምርመራዎች በመጠባበቅ ላይ',
    offline_banner_connected_queued: 'ተገናኝቷል • ለማመሳሰል የተዘጋጁ ምርመራዎች',
  },

  // =========================================================================
  // 3. AFAAN OROMOO (OROMO)
  // =========================================================================
  om: {
    // Brand & Global
    brand_name: 'Ruut',
    brand_tagline: 'Wiirtuu Gorsa Qonnaa',
    footer_text: 'Ruut Itoophiyaa • Wiirtuu Gorsa Qonnaa • 100% Toora Irraa Ala AI Hojjetu',

    // Navigation
    nav_home: 'Fuula Dura',
    nav_dashboard: 'Daashboordii',
    nav_diagnose: 'Qorannoo',
    nav_community: 'Hawaasa',
    nav_profile: 'Eenyummaa',
    nav_sign_in: 'Seeni',
    nav_sign_out: 'Bahi',
    nav_register: 'Galmaa’i',
    nav_language: 'Afaan',

    // Common Actions & Statuses
    action_submit: 'Rakkoo Ergi',
    action_submitting: 'Ergamaa jira...',
    action_cancel: 'Dhiisi',
    action_save: 'Oolchi',
    action_saving: 'Olkaa’amaa jira...',
    action_saved: 'Milkaa’inaan kuufameera',
    action_retry: 'Irra Deebi’i',
    action_refresh: 'Haaromsi',
    action_filter: 'Midhaaniin Calali',
    action_search: 'Furmaata hawaasaa barbaadi...',
    action_view_advice: 'Kaardii Gorsaa Ilaali',
    action_view_all: 'Hunda Ilaali',
    action_ask_question: 'Qorannoo Midhaanii Haaraa',
    action_share_remedy: 'Muuxannoo Qonnaa Qoodi',
    action_verified_by_farmers: 'Qonnoonni Mirkaneessan',
    action_verify_remedy: 'Muuxannoo Mirkaneessi',
    action_edit_profile: 'Eenyummaa Qonnaa Fooyyessi',

    // Connectivity & Offline
    status_online: 'Toora Irra Jira',
    status_offline: 'Toora Irraa Ala Hojjeta',
    status_offline_banner: 'Toora Irraa Ala • AI n bilbila keessan irratti ni hojjeta',
    status_syncing: 'Waliin hidhamaa jira...',
    status_queued_local: 'Kuusaa bilbilaa keessa kuufameera',
    status_cached_ready: 'Interneetii malee hojjeta',
    status_synced_success: 'Hidhameera • Qorannoowwan hundi qindaa’aniiru!',
    status_sync_now: 'Amma Hidhisi',

    // Offline Screen
    offline_screen_title: 'Guutummaatti Interneetii Malee Hojjeta',
    offline_screen_subtitle: 'Bilbila keessan irratti interneetiin hin jiru.',
    offline_screen_description: 'Ruut qonnaan bultoota Itoophiyaatiif qophaa’e. Bakka fagoo tajaajilli neetworkii hin jirre keessattis appiin kun 100% hojii isaa itti fufa.',
    offline_screen_feature1: 'Gareen AI keessaa rakkoo midhaanii qorachuun gorsa kenna',
    offline_screen_feature2: 'Qorannoon keessan bilbila keessan keessatti eegumsaan kuufama',
    offline_screen_feature3: 'Yommuu neetworkiin deebi’u ofumaan gara kuusaa deema',
    offline_screen_btn_retry: 'Hidhata Mirkaneessi',
    offline_screen_btn_diagnose: 'Interneetii Malee Qorannoo Eegali',

    // Homepage
    home_badge: 'Agro-AI Toora Irraa Ala Waliin Hojjetu',
    home_hero_title: 'Gorsa Qonnaa Qabatamaa,',
    home_hero_highlight: 'Interneetii Malee.',
    home_hero_description: 'Miidhaa ilbiisaa, dhukkuba baalaa fi hanqina soorata biyyee lafa qonnaa keessan irratti qoradhaa. Ruut garee AI gorsa qonnaa Itoophiyaa irratti hundaa’e dhiyeessa.',
    home_btn_ask: 'Gaaffii Midhaanii Gaafadhu',
    home_btn_dashboard: 'Daashboordii Qonnaan Bulaa',
    home_metric_offline: '100%',
    home_metric_offline_sub: 'Toora Malee Hojjeta',
    home_metric_agents: '5+',
    home_metric_agents_sub: 'Gareewwan AI',
    home_metric_cost: '0 Qr',
    home_metric_cost_sub: 'Qonnaan Bulaaf Bilisa',
    home_council_title: 'Koree AI Waliin Hojjetan',
    home_council_subtitle: 'Akkaataa ogeeyyiin AI waliin hojjetanii kaardii gorsaa qopheessan',
    home_agent_orchestrator_title: 'Garee Qindeessaa',
    home_agent_orchestrator_desc: 'Gareewwan ogeeyyii qindeessa, bu’aa qorannoo walitti qaba, fi tarkaanfiiwwan qajeelcha.',
    home_agent_orchestrator_tag: 'Qindeessaa Ol’aanaa',
    home_agent_diagnostic_title: 'Garee Qorannoo',
    home_agent_diagnostic_desc: 'Mallattoolee baalaa, jirmaa fi firii qorata; gosa dhukkubaa adda baasa.',
    home_agent_diagnostic_tag: 'AI Ilaalchaa fi Mallattoo',
    home_agent_context_title: 'Garee Haala Qilleensaa',
    home_agent_context_desc: 'Gorsa kana kutaalee qilleensaa (Baddaa-Daree, Baddaa, Gammoojjii) fi waqtii waliin wal simsiisa.',
    home_agent_context_tag: 'Qonna Itoophiyaa',
    home_agent_knowledge_title: 'Garee Beekumsa Hawaasaa',
    home_agent_knowledge_desc: 'Rakkoo dhiyaate muuxannoo qonnaan bultootaa kanaan dura mirkanaa’e waliin wal bira qaba.',
    home_agent_knowledge_tag: 'Kuusaa Qonnaan Bulaa',
    home_agent_advisor_title: 'Garee Gorsaa',
    home_agent_advisor_desc: 'Kaardii gorsaa qabatamaa, baasii xiqqaa fi keemikaala of eeggannoon fayyadamu qopheessa.',
    home_agent_advisor_tag: 'Kaardii Gorsaa Guutuu',

    // Dashboard Page
    dash_welcome: 'Baga nagaan dhuftan Qonnaan bulaa',
    dash_subtitle: 'Wiirtuu gorsa qonnaa fi qorannoo lafa qonnaa keessan.',
    dash_verified_farmer: 'Qonnaan Bulaa Mirkanaa’e',
    dash_season_radar: 'Haala Qilleensaa fi Waqtii Qonnaa Itoophiyaa',
    dash_total_inquiries: 'Waliigala Qorannoowwan',
    dash_total_inquiries_sub: 'Qorannoowwan dhiyaatan',
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
    dash_hectares: 'Hektaara',

    // Diagnose Page & Form
    diag_badge: 'Sirna Gorsa AI • Sadarkaa 1',
    diag_title: 'Qorannoo Rakkoo Midhaanii',
    diag_subtitle: 'Mallattoolee midhaanii galchaa yookiin suuraa ergaa. AI n qoratee kaardii gorsaa qopheessa.',
    diag_field_crop: 'Midhaan Filadhu',
    diag_field_crop_placeholder: 'Midhaan miidhame filadhu...',
    diag_field_title: 'Mata Duree Rakkoo',
    diag_field_title_placeholder: 'Fkn: Baala qamadii irratti daakuu keelloo mul’atu',
    diag_field_symptoms: 'Mallattoolee Guutuu fi Hubannoo Lafa Qonnaa',
    diag_field_symptoms_placeholder: 'Baalli, jirmi yookiin firii akkam akka ta’e ibsaa. Yoom eegale? Midhaan meeqatu miidhame?',
    diag_field_photo: 'Suuraa Lafa Qonnaa (Filannoo)',
    diag_field_photo_hint: 'Suuraa dhiyoo baala yookiin jirma miidhamee ergaa.',
    diag_field_photo_uploading: 'Suuraan olkaa’amaa jira...',
    diag_field_region: 'Naannoo',
    diag_field_zone: 'Kuta Qilleensaa',
    diag_btn_submit: 'Rakkoo Midhaanii Qoradhu',
    diag_btn_submitting: 'Gareen AI qorachaa jira...',
    diag_council_working: 'Gareewwan AI 5 hojii irra jiru',
    diag_council_step_init: 'Qindeessaan adeemsa qorannoo eegalaera',
    diag_council_step_diagnostic: 'Gareen qorannoo dhukkuba baalaa xiinxalaa jira',
    diag_council_step_context: 'Gareen qilleensaa gorsa kana kutaalee naannoo waliin simsiisaa jira',
    diag_council_step_knowledge: 'Gareen beekumsaa muuxannoo qonnaan bultootaa barbaadaa jira',
    diag_council_step_advisor: 'Gareen gorsaa kaardii gorsaa xumuraa jira',
    diag_council_finished: 'Qorannoon xumurameera! Gara kaardii gorsaatti darbaa jira...',
    diag_recent_title: 'Qorannoowwan Dhiyoo Keessan',
    diag_recent_sub: 'Qonnootaan mirkanaa’ee bilbila irratti kuufame',
    diag_offline_saved_title: 'Kaardiiwwan Gorsaa Interneetii Malee Kuufaman',
    diag_offline_saved_desc: 'Bakka interneetiin hin jirretti battalatti akka argattaniif bilbila keessan keessatti kuufamaniiru.',
    diag_offline_saved_empty: 'Kaardiin kuufame hin jiru. Kaardiiwwan haaraan ofumaan asitti kuufamu.',
    diag_open_offline_card: 'Kaardii Toora Malee Bani',

    // Advice Card Presentation
    card_title: 'Qorannoo Midhaanii fi Karoora Hojii',
    card_confidence: 'Hammam Mirkanaa’e',
    card_confirmed: 'Dhukkuba Mirkanaa’e',
    card_urgency: 'Sadarkaa Ariifachiisummaa',
    card_urgency_immediate: 'Tarkaanfii Ariifachiisaa Barbaada',
    card_urgency_high: 'Dursa Ol’aanaa',
    card_urgency_moderate: 'Dursa Giddu-galeessaa',
    card_urgency_low: 'Hordoffii / Dursa Xiqqaa',
    card_scientific_name: 'Maqaa Saayinsii Dhukkubaa',
    card_probable_cause: 'Sababa fi Mallattoolee',
    card_visual_symptoms: 'Mallattoolee Mul’atan',
    card_immediate_actions: 'Tarkaanfiiwwan Ariifachiisoo (Sa’aatii 24-48 keessatti)',
    card_organic_remedies: 'Furmaata Uumamaa fi Baasii Xiqqaa',
    card_chemical_controls: 'Filannoowwan Keemikaalaa (Of Eeggannoon)',
    card_preventive_measures: 'Tarkaanfiiwwan Ittisa Fuulduraa',
    card_local_context: 'Haala Qilleensa Naannoo Itoophiyaa',
    card_season_action: 'Tarkaanfii Waqtii',
    card_pesticide_warning: 'Akeekkachiisa Nageenyaa: Uffata eegumsaa uffadhaa. Madda bishaanii fi gaagura dammaa irraa fageessaa biifaa.',
    card_feedback_prompt: 'Gorsi kun qonnaa keessaniif faayidaa qabaa?',
    card_feedback_helpful: 'Faayidaa Qaba',
    card_feedback_unhelpful: 'Faayidaa Hin Qabu',
    card_feedback_thanks: 'Yaada keessaniif galatoomaa! Sagaleen keessan qonnaan bultoota biroofis ni fayyada.',
    card_cached_badge: 'Interneetii Malee Bilbila Irratti Hojjeta',
    card_back_to_diagnose: 'Gara Qorannoowwaniitti Deebi’i',

    // Community Page
    comm_badge: 'Beekumsa Qonnaan Bulaa Walii Wajjinii',
    comm_title: 'Wiirtuu Beekumsa Hawaasaa',
    comm_subtitle: 'Furmaata uumamaa qonnaan bultoota Itoophiyaatiin mirkanaa’e ilaalaa, yookiin muuxannoo keessan qoodaa.',
    comm_btn_share: 'Muuxannoo Qonnaa Qoodi',
    comm_search_placeholder: 'Midhaaniin, ilbiisaan, yookiin furmaataan barbaadi...',
    comm_filter_all_crops: 'Midhaan Hunda',
    comm_filter_all_regions: 'Naannoo Hunda',
    comm_empty_title: 'Muuxannoon barbaaddan hin argamne',
    comm_empty_desc: 'Midhaan kanaaf furmaata qooduun qonnaan bulaa jalqabaa ta’aa!',
    comm_verified_count: 'Qonnoonni Mirkaneessan',
    comm_btn_verify: 'Muuxannoo Mirkaneessi',
    comm_btn_verified: 'Isiniin Mirkanaa’eera',
    comm_modal_title: 'Muuxannoo Qonnaa Mirkanaa’e Qoodaa',
    comm_modal_crop: 'Gosa Midhaanii',
    comm_modal_problem: 'Mata Duree Rakkoo',
    comm_modal_problem_placeholder: 'Fkn: Daaraadhaan Xaafii jigaa ittisuu',
    comm_modal_symptoms: 'Mallattoolee Mul’atan',
    comm_modal_symptoms_placeholder: 'Yaaliin dura midhaan maal fakkaata ture...',
    comm_modal_solution: 'Furmaata Uumamaa / Qophii',
    comm_modal_solution_placeholder: 'Furmaata kana akkamitti akka qopheessitanii fi fayyadamtani tartiibaan ibsaa...',
    comm_modal_region: 'Naannoo Keessan',
    comm_modal_zone: 'Kuta Qilleensaa',
    comm_modal_btn_publish: 'Hawaasaaf Qoodi',
    comm_modal_btn_publishing: 'Qoodamaa jira...',

    // Farmer Profile Page
    prof_title: 'Eenyummaa Qonnaan Bulaa fi Haala Naannoo',
    prof_subtitle: 'Odeeffannoon qilleensaa gorsa AI sirrii ta’e isiniif kennuuf fayyada.',
    prof_context_active: 'Haalli Naannoo Hojii Irra Jira',
    prof_personal_info: 'Odeeffannoo Dhuunfaa',
    prof_full_name: 'Maqaa Guutuu',
    prof_phone: 'Lakkoofsa Bilbilaa',
    prof_geographic: 'Bakka Teessumaa',
    prof_region: 'Naannoo',
    prof_zone_name: 'Godina',
    prof_woreda: 'Aanaa',
    prof_agro_zone: 'Kuta Qilleensaa',
    prof_farm_details: 'Odeeffannoo Qonnaa',
    prof_language: 'Filannoo Afaan Gorsaa',
    prof_farm_size: 'Bal’ina Lafa Qonnaa (Hektaaraan)',
    prof_main_crops: 'Gosa Midhaanii Oomishtan',
    prof_btn_save: 'Oolchi',
    prof_btn_saving: 'Olkaa’amaa jira...',
    prof_success_msg: 'Eenyummaan keessan milkaa’inaan fooyya’eera! AI n gorsa isaa haala qonnaa keessaniin qopheessa.',

    // Auth Pages
    auth_login_title: 'Gara Ruut Seenaa',
    auth_login_subtitle: 'Qorannoowwan midhaanii fi kaardiiwwan gorsaa keessan argadhaa.',
    auth_email: 'Teessoo Imeelii',
    auth_password: 'Jecha Icceetii',
    auth_btn_login: 'Seeni',
    auth_btn_logging_in: 'Seenamaa jira...',
    auth_no_account: 'Akkaawuntii hin qabdanii?',
    auth_register_link: 'Akka Qonnaan Bulaatti Galmaa’aa',
    auth_register_title: 'Galmee Qonnaan Bulaa',
    auth_register_subtitle: 'Gorsa qonnaa bilisaa fi qorannoo midhaaniif galmaa’aa.',
    auth_btn_register: 'Akkaawuntii Uumi',
    auth_btn_registering: 'Uumamaa jira...',
    auth_has_account: 'Duraan akkaawuntii qabduu?',
    auth_login_link: 'Seeni',

    // Seasonal Advisory Radar
    season_priority: 'Xiyyeeffannoo Waqtii:',
    season_actions_heading: 'Tarkaanfiiwwan Waqtii',
    season_alerts_heading: 'Akeekkachiisa Ilbiisotaa',

    // Additional Dashboard Actions & Stats
    dash_action_ask_sub: 'Suuraa fi mallattoolee ergi',
    dash_action_comm_title: 'Muuxannoo Hawaasaa',
    dash_action_comm_sub: 'Furmaata mirkanaa’e ilaali',
    dash_action_prof_title: 'Eenyummaa Qonnaa',
    dash_action_prof_sub: 'Kuta qilleensaa haaromsi',
    dash_stat_resolved_advice: 'Gorsaan Furameera',
    dash_stat_ai_ready: '100% AI n Qophii Dha',
    dash_stat_confidence_confirmed: 'Mirkanaa’eera',

    // PWA & Installation
    pwa_install_title: 'Appii Ruut Fe’adhaa',
    pwa_install_sub: '100% Toora irraa ala hojjeta',
    pwa_btn_install: 'Fe’adhu',
    pwa_installed: 'Fe’ameera',

    // Agent Council Timeline
    timeline_council_title: 'Koreen AI 5',
    timeline_council_sub: 'Gareewwan AI qorannoo dhukkubaa fi qophii furmaata uumamaa irratti waliin hojjetan.',
    timeline_agent_orchestrator: 'Qindeessaa AI',
    timeline_agent_diagnostic: 'Qorataa Dhukkubaa',
    timeline_agent_context: 'Garee Qilleensa Naannoo',
    timeline_agent_knowledge: 'Garee Beekumsa Hawaasaa',
    timeline_agent_advisor: 'Garee Gorsaa',
    timeline_agent_critic: 'Eegduu Nageenyaa',

    // Auth Form Labels & Helpers
    auth_register_header_title: 'Eenyummaa Qonnaan Bulaa Uumi',
    auth_register_header_sub: 'Gorsa akka naannoo, olka’iinsa fi midhaan keessaniitti qopheessaa',
    auth_field_fullname: 'Maqaa Guutuu',
    auth_field_phone: 'Lakkoofsa Bilbilaa',
    auth_field_preferred_language: 'Afaan Filatamaa',
    auth_btn_complete_registration: 'Galmee Xumuri',
    auth_return_home: 'Gara Fuula Duraatti Deebi’i',
    auth_sign_in_here: 'Asitti Seenaa',
    auth_logging_out: 'Bahaa jira...',
    auth_login_header_sub: 'Qorannoo midhaanii, kaardii gorsaa fi toora ala hojjetu argadhaa',
    auth_register_farmer_link: 'Eenyummaa Qonnaan Bulaa Galmeessi',
    auth_reg_success_msg: 'Galmeen milkaa’inaan xumurameera! Amma seensaan fayyadamaa.',

    // Offline Indicators
    offline_banner_queued: 'eeggachaa jiru',
    offline_banner_connected_queued: 'Hidhameera • walitti hidhamuuf kan eegan',
  },
};

/**
 * Localized Crop Names
 */
export const localizedCrops: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    Teff: 'Teff',
    Wheat: 'Wheat',
    Maize: 'Maize',
    Coffee: 'Coffee',
    Barley: 'Barley',
    Sorghum: 'Sorghum',
    Enset: 'Enset',
    'Faba Bean': 'Faba Bean',
    Chickpea: 'Chickpea',
    Sesame: 'Sesame',
    Potato: 'Potato',
    Tomato: 'Tomato',
    Onion: 'Onion',
    Other: 'Other',
  },
  am: {
    Teff: 'ጤፍ',
    Wheat: 'ስንዴ',
    Maize: 'በቆሎ',
    Coffee: 'ቡና',
    Barley: 'ገብስ',
    Sorghum: 'ማሽላ',
    Enset: 'እንሰት',
    'Faba Bean': 'ባቄላ',
    Chickpea: 'ሽምብራ',
    Sesame: 'ሰሊጥ',
    Potato: 'ድንች',
    Tomato: 'ቲማቲም',
    Onion: 'ሽንኩርት',
    Other: 'ሌሎች',
  },
  om: {
    Teff: 'Xaafii',
    Wheat: 'Qamadii',
    Maize: 'Boqqoolloo',
    Coffee: 'Buna',
    Barley: 'Garbuu',
    Sorghum: 'Mishingaa',
    Enset: 'Qoccoo',
    'Faba Bean': 'Baaqelaa',
    Chickpea: 'Shumburaa',
    Sesame: 'Saalxaa',
    Potato: 'Dinnicha',
    Tomato: 'Timaatima',
    Onion: 'Qullubbii',
    Other: 'Kan Biraa',
  },
};

/**
 * Localized Agro-Ecological Zones
 */
export const localizedZones: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    'Weyna Dega': 'Weyna Dega (Midland)',
    Dega: 'Dega (Highland)',
    Kolla: 'Kolla (Lowland)',
    Bereha: 'Bereha (Arid)',
  },
  am: {
    'Weyna Dega': 'ወይና ደጋ (መካከለኛ)',
    Dega: 'ደጋ (ከፍተኛ)',
    Kolla: 'ቆላ (ዝቅተኛ)',
    Bereha: 'በረሃ (ደረቅ)',
  },
  om: {
    'Weyna Dega': 'Baddaa-Daree',
    Dega: 'Baddaa',
    Kolla: 'Gammoojjii',
    Bereha: 'Gammoojjii Cimaa',
  },
};

/**
 * Localized Ethiopian Regions
 */
export const localizedRegions: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    Oromia: 'Oromia',
    Amhara: 'Amhara',
    Tigray: 'Tigray',
    Sidama: 'Sidama',
    'Central Ethiopia': 'Central Ethiopia',
    'South Ethiopia': 'South Ethiopia',
    Somali: 'Somali',
    'Benishangul-Gumuz': 'Benishangul-Gumuz',
    Afar: 'Afar',
    Gambella: 'Gambella',
    Harari: 'Harari',
    'South West Ethiopia': 'South West Ethiopia',
    'Addis Ababa': 'Addis Ababa',
    'Dire Dawa': 'Dire Dawa',
  },
  am: {
    Oromia: 'ኦሮሚያ',
    Amhara: 'አማራ',
    Tigray: 'ትግራይ',
    Sidama: 'ሲዳማ',
    'Central Ethiopia': 'ማዕከላዊ ኢትዮጵያ',
    'South Ethiopia': 'ደቡብ ኢትዮጵያ',
    Somali: 'ሶማሌ',
    'Benishangul-Gumuz': 'ቤንሻንጉል ጉሙዝ',
    Afar: 'አፋር',
    Gambella: 'ጋምቤላ',
    Harari: 'ሐረሪ',
    'South West Ethiopia': 'ደቡብ ምዕራብ ኢትዮጵያ',
    'Addis Ababa': 'አዲስ አበባ',
    'Dire Dawa': 'ድሬዳዋ',
  },
  om: {
    Oromia: 'Oromiyaa',
    Amhara: 'Amaara',
    Tigray: 'Tigraay',
    Sidama: 'Sidaamaa',
    'Central Ethiopia': 'Itoophiyaa Giddu-galeessaa',
    'South Ethiopia': 'Itoophiyaa Kibbaa',
    Somali: 'Somaalee',
    'Benishangul-Gumuz': 'Beniishaangul Gumuz',
    Afar: 'Afaar',
    Gambella: 'Gambellaa',
    Harari: 'Hararii',
    'South West Ethiopia': 'Kibba Lixa Itoophiyaa',
    'Addis Ababa': 'Finfinnee',
    'Dire Dawa': 'Dirree Dawaa',
  },
};
