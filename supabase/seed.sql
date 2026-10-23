-- ==============================================================================
-- ROOT – SEED DATA FOR COMMUNITY AGRICULTURAL KNOWLEDGE BASE
-- Verified Ethiopian smallholder remedies across agro-ecological zones
-- ==============================================================================

INSERT INTO public.community_knowledge (
  crop_type,
  problem_title,
  symptoms,
  proven_solution,
  region,
  agro_zone,
  verified_by_farmers_count
) VALUES
(
  'Teff',
  'Teff Rust & Leaf Blotch (የጤፍ ዝገት በሽታ)',
  'Orange-brown pustules on stems and lower leaves, premature leaf yellowing, reduced panicle grain filling.',
  'Mix fine wood ash with diluted neem oil extract (50ml neem extract per 10L water). Spray early morning during tillering stage. Ensure proper field drainage to prevent high humidity in the crop canopy.',
  'Oromia',
  'Weyna Dega',
  42
),
(
  'Coffee',
  'Coffee Berry Disease - CBD (የቡና ፍሬ በሽታ)',
  'Dark sunken lesions on developing green coffee berries, causing premature berry mummification and dropping.',
  'Prune dense shade trees to allow morning sunlight into coffee bushes. Strip and bury all mummified berries from the ground before the Belg rains. Apply mild organic copper spray at the onset of flowering.',
  'Sidama',
  'Weyna Dega',
  89
),
(
  'Maize',
  'Fall Armyworm Infestation (የመኸር ሰራዊት አባጨጓሬ)',
  'Windowpane leaf damage, large ragged feeding holes in whorls, moist sawdust-like frass on stems and cobs.',
  'Intercrop maize with Desmodium and Napier grass (Push-Pull technique). Apply a handful of clean wood ash or dry sand directly into the plant whorls. Spray crushed neem seed cake extract (500g in 10L water) at dusk when larvae feed.',
  'Oromia',
  'Kolla',
  114
),
(
  'Wheat',
  'Wheat Stripe / Yellow Rust (የስንዴ ቢጫ ዝገት)',
  'Parallel yellow streaks and pustules along leaf veins, powdery yellow spore release on touch, stunted ears.',
  'Practice mandatory 2-year crop rotation with chickpeas or faba beans. Sow certified rust-resistant varieties early in the Meher planting window. Avoid excessive nitrogen fertilization which creates soft lush tissue vulnerable to fungal spores.',
  'Amhara',
  'Dega',
  67
),
(
  'Enset',
  'Enset Bacterial Wilt - BXW (የእንሰት ባክቴሪያ አወዛጋቢ በሽታ)',
  'Yellowing and wilting of the innermost heart leaves, slimy bacterial ooze from cut pseudostem, bad odor.',
  'Immediately sterilize machetes and knives in fire or 10% bleach solution between plants. Uproot and bury infected enset plants deep with agricultural lime; never compost diseased pseudostems.',
  'South Ethiopia',
  'Weyna Dega',
  95
);
