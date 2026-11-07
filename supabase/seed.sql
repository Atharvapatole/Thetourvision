-- ==============================================================================
-- THE TOUR VISION - PRODUCTION DEMO SEED DATA (DESTINATIONS & PACKAGES)
-- ==============================================================================
-- Development Agency: Automate Stack
-- Project: The Tour Vision (Pune, Maharashtra, India)
--
-- This script safely populates:
-- 1. Package Categories
-- 2. Destinations (Domestic & International)
-- 3. Curated Tour Packages with full day-by-day JSONB itineraries
--
-- All records are fully idempotent with ON CONFLICT (slug) clauses and use
-- strictly valid UUID literals (RFC 4122 compliant hex strings).
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Package Categories
-- ------------------------------------------------------------------------------
INSERT INTO public.package_categories (id, name, slug, description, icon_name, sort_order)
VALUES
    ('c1111111-1111-1111-1111-111111111111', 'Honeymoon & Romance', 'honeymoon-and-romance', 'Intimate getaways, private pool villas, candlelight beach dinners, and scenic landscapes.', 'Heart', 1),
    ('c2222222-2222-2222-2222-222222222222', 'Luxury Escapes', 'luxury-escapes', 'Five-star royal palaces, bespoke private chauffeurs, premium hospitality, and private charters.', 'Crown', 2),
    ('c3333333-3333-3333-3333-333333333333', 'Family Vacations', 'family-vacations', 'Comfortable pacing, family-friendly resorts, guided sightseeing, and engaging cultural activities.', 'Users', 3),
    ('c4444444-4444-4444-4444-444444444444', 'Adventure & Wildlife', 'adventure-and-wildlife', 'High-altitude treks, deep-sea coral diving, jungle safaris, and exhilarating mountain expeditions.', 'Compass', 4),
    ('c5555555-5555-5555-5555-555555555555', 'Cultural & Heritage', 'cultural-and-heritage', 'Centuries-old fortresses, UNESCO monuments, spiritual river ghats, and authentic regional cuisines.', 'Landmark', 5),
    ('c6666666-6666-6666-6666-666666666666', 'Weekend Getaways from Pune', 'weekend-getaways', 'Short refreshing escapes, monsoon hill retreats, vineyard tours, and coastal drives near Pune.', 'Calendar', 6)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon_name = EXCLUDED.icon_name,
    sort_order = EXCLUDED.sort_order;

-- ------------------------------------------------------------------------------
-- 2. Destinations (Domestic & International)
-- ------------------------------------------------------------------------------
INSERT INTO public.destinations (
    id, name, slug, country, region, is_domestic, tagline, overview, highlights, best_season, climate_info, hero_image, gallery, travel_tips, is_featured, is_published, sort_order
)
VALUES
    (
        'd1111111-1111-1111-1111-111111111111',
        'Kashmir',
        'kashmir-paradise-on-earth',
        'India',
        'North India',
        true,
        'The Paradise on Earth with Alpine Meadows & Dal Lake Shikaras',
        'Surrounded by the snow-capped Pir Panjal and Himalayan ranges, Kashmir is a dreamscape of shimmering lakes, cedar forests, blooming saffron meadows, and historic wooden houseboats.',
        ARRAY['Stay in a luxury cedar houseboat on Dal Lake', 'Gondola ride to Apharwat Peak in Gulmarg (13,780 ft)', 'Pony trek through the Betaab Valley and Aru Valley in Pahalgam', 'Savor traditional multi-course Wazwan delicacies'],
        'March to October for lush greenery; December to February for snow and skiing',
        'Crisp alpine summers (15°C to 25°C) and snowy winters (-2°C to 7°C)',
        'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1600&q=80',
        ARRAY[
            'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1626014303757-6466336e4f32?auto=format&fit=crop&w=1200&q=80'
        ],
        ARRAY['Pre-book Gulmarg Phase 2 Gondola tickets well in advance', 'Carry layered woolens even during autumn evenings', 'Experience early morning floating vegetable market by Shikara'],
        true,
        true,
        1
    ),
    (
        'd2222222-2222-2222-2222-222222222222',
        'Rajasthan',
        'royal-rajasthan',
        'India',
        'Western India',
        true,
        'Land of Maharajas, Golden Sand Dunes & Palace Hospitality',
        'From the pink sandstone facades of Jaipur to the tranquil lakes of Udaipur and the golden fortress of Jaisalmer, Rajasthan immerses you in regal pageantry, folk ballads, and royal luxury.',
        ARRAY['Private heritage tour of Udaipur City Palace & Lake Pichola boat cruise', 'Sunset camel safari and desert stargazing at Sam Sand Dunes', 'Fine dining atop Nahargarh Fort overlooking Jaipur city lights', 'Authentic Laal Maas and Dal Baati Churma dining experiences'],
        'October to March (Pleasant days and cool desert nights)',
        'Warm dry days (20°C to 28°C) and crisp starlit nights (9°C to 14°C)',
        'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=80',
        ARRAY[
            'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1609137144822-5553b9a07153?auto=format&fit=crop&w=1200&q=80'
        ],
        ARRAY['Reserve Lake Pichola boat cruises for golden hour', 'Shop for authentic blue pottery and gemstone jewelry in Jaipur bazaars', 'Allow at least 2 full days for Udaipur to enjoy leisurely palace walks'],
        true,
        true,
        2
    ),
    (
        'd3333333-3333-3333-3333-333333333333',
        'Kerala',
        'kerala-gods-own-country',
        'India',
        'South India',
        true,
        'Gods Own Country: Tranquil Backwaters & Misty Tea Estates',
        'Kerala enchants with emerald backwaters, spice-scented mountain air in Munnar, Ayurvedic rejuvenation sanctuaries, and palm-fringed Arabian Sea coastlines.',
        ARRAY['Private air-conditioned traditional Kettuvallam houseboat cruise in Alleppey', 'Walk through emerald tea carpet hills in Munnar with tea tasting', 'Traditional Kathakali classical dance and Kalaripayattu martial arts display', 'Authentic Kerala Sadya served on banana leaf'],
        'September to March for cool breezy sightseeing; June to August for monsoon Ayurveda',
        'Tropical climate with lush greenery year-round (22°C to 30°C)',
        'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=80',
        ARRAY[
            'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80'
        ],
        ARRAY['Opt for freshly caught Karimeen Pollichathu on your houseboat', 'Book licensed government-approved Ayurvedic wellness treatments only'],
        true,
        true,
        3
    ),
    (
        'd4444444-4444-4444-4444-444444444444',
        'Switzerland & The Alps',
        'switzerland-alps',
        'Switzerland',
        'Central Europe',
        false,
        'Iconic Glacier Peaks, Panoramic Rail Journeys & Crystal Lakes',
        'A masterpiece of European alpine beauty. Ride the Glacier Express across dramatic mountain viaducts, cruise Lake Lucerne, and gaze upon the Matterhorn from luxury mountain chalets.',
        ARRAY['Top of Europe excursion to Jungfraujoch (11,333 ft)', 'Scenic First Cliff Walk by Tissot in Grindelwald', 'Scenic GoldenPass Express train from Interlaken to Montreux', 'Artisanal Swiss fondue and Lindt Master Chocolatier tasting'],
        'May to September for hiking and blooming meadows; December to March for winter sports',
        'Alpine conditions, ranging from 18°C in valleys to below freezing at high peaks',
        'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1600&q=80',
        ARRAY[
            'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
        ],
        ARRAY['The Swiss Travel Pass gives unlimited rail, bus, and boat access', 'Pack comfortable waterproof walking boots and UV-rated sunglasses'],
        true,
        true,
        4
    ),
    (
        'd5555555-5555-5555-5555-555555555555',
        'Bali',
        'bali-indonesia',
        'Indonesia',
        'Southeast Asia',
        false,
        'Island of the Gods: Forest Villas, Sacred Temples & Coastal Sunsets',
        'A harmonious sanctuary where lush jungle ravines meet turquoise Indian Ocean waves. Unwind in cliffside infinity pools, wander terraced rice fields in Ubud, and partake in spiritual temple blessings.',
        ARRAY['Private pool villa stay surrounded by tropical Ubud canopy', 'Sunrise trek to Mount Batur with breakfast above the clouds', 'Sunset seafood dining on the white sands of Jimbaran Bay', 'Handcrafted silver workshops in Celuk and coffee tasting at Luwak plantations'],
        'April to October (Dry season with clear blue skies and ocean breezes)',
        'Warm tropical climate (26°C to 31°C)',
        'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=80',
        ARRAY[
            'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80'
        ],
        ARRAY['Respect dress code (sarong and sash) when entering sacred temples', 'Consider renting a private chauffeured car for seamless day excursions'],
        true,
        true,
        5
    ),
    (
        'd6666666-6666-6666-6666-666666666666',
        'Dubai',
        'dubai-uae',
        'United Arab Emirates',
        'Middle East',
        false,
        'Futuristic Marvels, Desert Glamping & World-Class Shopping',
        'An architectural wonder rising from the Arabian sands. Home to the tallest tower on Earth, opulent shopping malls, Michelin-starred culinary dining, and thrilling dune bashing safaris.',
        ARRAY['At The Top observation deck access at Burj Khalifa (148th floor)', 'Red dune desert safari with quad biking and Arabian barbecue dinner', 'Private sunset yacht charter around Dubai Marina and Atlantis The Palm', 'Miracle Garden and Museum of the Future futuristic exploration'],
        'November to March (Mild sunny winter days, ideal for sightseeing)',
        'Comfortable pleasant weather in winter (22°C to 28°C)',
        'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80',
        ARRAY[
            'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1200&q=80'
        ],
        ARRAY['Book Burj Khalifa sunset slot tickets 3 weeks prior', 'Pre-purchase metro cards for convenient city navigation'],
        true,
        true,
        6
    )
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    country = EXCLUDED.country,
    region = EXCLUDED.region,
    is_domestic = EXCLUDED.is_domestic,
    tagline = EXCLUDED.tagline,
    overview = EXCLUDED.overview,
    highlights = EXCLUDED.highlights,
    best_season = EXCLUDED.best_season,
    climate_info = EXCLUDED.climate_info,
    hero_image = EXCLUDED.hero_image,
    gallery = EXCLUDED.gallery,
    travel_tips = EXCLUDED.travel_tips,
    is_featured = EXCLUDED.is_featured,
    is_published = EXCLUDED.is_published,
    sort_order = EXCLUDED.sort_order;

-- ------------------------------------------------------------------------------
-- 3. Tour Packages (Uses valid hex UUIDs and dynamic FK lookups by slug)
-- ------------------------------------------------------------------------------
INSERT INTO public.packages (
    id, destination_id, category_id, title, slug, summary, description, days, nights, price_inr, discounted_price_inr,
    pricing_type, cover_image, gallery, itinerary, accommodation_grade, hotel_details, inclusions, exclusions, highlights,
    min_travelers, max_travelers, departure_city, seasonal_offer, is_featured, is_published
)
VALUES
    (
        'a1111111-1111-1111-1111-111111111111',
        (SELECT id FROM public.destinations WHERE slug = 'royal-rajasthan' LIMIT 1),
        (SELECT id FROM public.package_categories WHERE slug = 'luxury-escapes' LIMIT 1),
        'Royal Rajasthan Heritage Experience: Jaipur, Jodhpur & Udaipur',
        'royal-rajasthan-heritage-experience',
        'Immerse in the regal grandeur of Rajasthan with 5-star palace hotels, private chauffeur, and sunset cruises on Lake Pichola.',
        'Embark on an enchanting journey through the golden annals of Rajput nobility. Wander through the pink terracotta corridors of Jaipur, climb the impregnable ramparts of Mehrangarh Fort in Jodhpur, and conclude in the Venice of the East, Udaipur, with private candlelit dinners overlooking royal palaces.',
        6, 5, 48500.00, 42999.00,
        'per_person'::public.pricing_type,
        'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
        ARRAY[
            'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80'
        ],
        '[
            {"day": 1, "title": "Arrival in Jaipur - The Pink City", "description": "Private airport greeting in Jaipur. Check into your heritage hotel. Evening visit to Birla Temple followed by a grand traditional welcome dinner with Rajasthani folk music.", "meals": "Dinner", "stay": "Trident Jaipur or Heritage Haveli"},
            {"day": 2, "title": "Jaipur Royal Forts & City Palace", "description": "Morning elephant or jeep ascent to Amber Fort. Marvel at Sheesh Mahal (Palace of Mirrors). Afternoon photo stop at Jal Mahal, Hawa Mahal, and guided tour of City Palace.", "meals": "Breakfast", "stay": "Trident Jaipur"},
            {"day": 3, "title": "Jaipur to Jodhpur - The Blue City", "description": "Scenic morning drive to Jodhpur. Check into hotel. Afternoon exploration of the mighty Mehrangarh Fort towering 400 feet above the blue city houses, followed by Jaswant Thada.", "meals": "Breakfast", "stay": "Welcomhotel by ITC Jodhpur"},
            {"day": 4, "title": "Jodhpur to Udaipur via Ranakpur Jain Temples", "description": "Depart for Udaipur. En route stop at the architectural masterpiece Ranakpur Temple, famed for 1,444 uniquely carved marble pillars. Arrive in Udaipur by late afternoon.", "meals": "Breakfast", "stay": "The Leela Palace or Trident Udaipur"},
            {"day": 5, "title": "Udaipur Romance & Lake Pichola", "description": "Visit the majestic Udaipur City Palace complex, Jagdish Temple, and Sahelion-ki-Bari. Late afternoon private boat cruise on Lake Pichola with views of Jag Mandir.", "meals": "Breakfast", "stay": "Trident Udaipur"},
            {"day": 6, "title": "Farewell Udaipur / Departure", "description": "Leisurely breakfast overlooking the Aravali hills. Assistance and transfer to Udaipur Airport for your flight back to Pune or Mumbai.", "meals": "Breakfast", "stay": "None"}
        ]'::jsonb,
        '5-Star Luxury Heritage Properties',
        'Jaipur: Trident / ITC Rajputana (2 Nights); Jodhpur: Welcomhotel (1 Night); Udaipur: Trident / Fateh Garh (2 Nights)',
        ARRAY[
            '5 Nights accommodation in 5-star heritage hotels',
            'Daily buffet breakfast and 1 grand welcome dinner',
            'Dedicated private air-conditioned Toyota Innova Crysta for all transfers and sightseeing',
            'Private boat cruise on Lake Pichola, Udaipur',
            'English and Hindi speaking licensed palace monument guides',
            'All interstate tolls, parking, and driver allowances'
        ],
        ARRAY[
            'Airfare to Jaipur and return from Udaipur',
            'Personal laundry, beverages, and tips',
            'Monument entry tickets unless pre-arranged',
            '5% GST (added at billing)'
        ],
        ARRAY[
            'Lake Pichola private sunset cruise',
            'Amber Fort jeep ascent & Sheesh Mahal',
            'Marvel at Ranakpur marble carvings',
            'Curated boutique heritage palace stays'
        ],
        2, 12, 'Pune / Mumbai', 'Save ₹5,500 per person on winter bookings', true, true
    ),
    (
        'a2222222-2222-2222-2222-222222222222',
        (SELECT id FROM public.destinations WHERE slug = 'kashmir-paradise-on-earth' LIMIT 1),
        (SELECT id FROM public.package_categories WHERE slug = 'honeymoon-and-romance' LIMIT 1),
        'Kashmir Paradise Odyssey: Srinagar, Gulmarg & Pahalgam',
        'kashmir-paradise-odyssey',
        'Experience heavenly landscapes with Dal Lake houseboat stays, snow-capped Gulmarg Gondola rides, and horse rides in Pahalgam.',
        'Lose your heart to the crown jewel of India. Glide silently across the mirror-like waters of Dal Lake in a cushioned Shikara, ascend into alpine snowdrifts aboard the Gulmarg Gondola, and listen to the murmuring Lidder River in Pahalgam pine forests.',
        7, 6, 36500.00, 31999.00,
        'per_person'::public.pricing_type,
        'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=80',
        ARRAY[
            'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1626014303757-6466336e4f32?auto=format&fit=crop&w=1200&q=80'
        ],
        '[
            {"day": 1, "title": "Arrival in Srinagar & Dal Lake Houseboat", "description": "Meet The Tour Vision representative at Srinagar Airport. Transfer to your luxury cedar houseboat. Relax with hot Kashmiri Kahwa. Evening 2-hour Shikara sunset ride.", "meals": "Dinner", "stay": "Luxury Super Deluxe Houseboat, Dal Lake"},
            {"day": 2, "title": "Srinagar Mughal Gardens & Old City", "description": "Visit the terraced fountains of Shalimar Bagh, Nishat Bagh, and Chashme Shahi. Afternoon visit to the historic Shankaracharya Temple atop Gopadari Hill.", "meals": "Breakfast & Dinner", "stay": "The Grand Mumtaz / Hotel Solar Residency"},
            {"day": 3, "title": "Srinagar to Gulmarg - Meadow of Flowers", "description": "Drive to Gulmarg (8,825 ft). Board the renowned Gondola cable car up to Kongdoori and Apharwat Peak. Enjoy snow activities and breathtaking Himalayan panoramas.", "meals": "Breakfast & Dinner", "stay": "Hotel Pine Palace Resort, Gulmarg"},
            {"day": 4, "title": "Gulmarg to Pahalgam - Valley of Shepherds", "description": "Drive through saffron fields of Pampore and walnut orchards to Pahalgam along the roaring Lidder River. Evening stroll through local markets.", "meals": "Breakfast & Dinner", "stay": "Hotel Heevan / Pine N Peak, Pahalgam"},
            {"day": 5, "title": "Pahalgam - Betaab Valley & Aru Valley", "description": "Excursion to pristine Betaab Valley, named after the Bollywood blockbuster, Chandanwari (starting point of Amarnath Yatra), and charming Aru village.", "meals": "Breakfast & Dinner", "stay": "Hotel Heevan, Pahalgam"},
            {"day": 6, "title": "Pahalgam to Srinagar / Free Leisure Time", "description": "Drive back to Srinagar. Visit local artisanal workshops for authentic Pashmina shawls, walnut wood carving, and saffron. Farewell traditional Wazwan dinner.", "meals": "Breakfast & Dinner", "stay": "Hotel Solar Residency, Srinagar"},
            {"day": 7, "title": "Departure Srinagar", "description": "Morning breakfast. Transfer to Srinagar Airport with fond memories of the paradise valley.", "meals": "Breakfast", "stay": "None"}
        ]'::jsonb,
        'Luxury Houseboat + 4-Star Premium Resorts',
        '1 Night Super Deluxe Houseboat, 3 Nights Srinagar Resort, 1 Night Gulmarg, 2 Nights Pahalgam',
        ARRAY[
            '6 Nights premium accommodation as per itinerary',
            'Breakfast and gourmet dinners every day (MAP Plan)',
            'Complimentary 2-Hour Shikara Ride on Dal Lake',
            'Private vehicle for all airport transfers and inter-city travel',
            'Special Kashmiri Kahwa welcome service'
        ],
        ARRAY[
            'Gulmarg Gondola tickets (must be booked via official JK tourism portal)',
            'Pony rides and union taxi charges in Pahalgam/Gulmarg',
            'Lunch and personal expenses'
        ],
        ARRAY[
            'Romantic Dal Lake Houseboat stay',
            'Apharwat Peak snow vistas in Gulmarg',
            'Lidder riverside walks in Pahalgam',
            'Authentic Kashmiri Kahwa and Saffron tea'
        ],
        2, 10, 'Pune / Mumbai', 'Honeymoon Special: Complimentary floral decor and cake', true, true
    ),
    (
        'a3333333-3333-3333-3333-333333333333',
        (SELECT id FROM public.destinations WHERE slug = 'switzerland-alps' LIMIT 1),
        (SELECT id FROM public.package_categories WHERE slug = 'luxury-escapes' LIMIT 1),
        'Majestic Swiss Alpine Odyssey: Zurich, Lucerne & Interlaken',
        'swiss-alpine-odyssey',
        'Experience the ultimate European vacation with Swiss Travel Pass, Jungfraujoch Top of Europe, Mount Titlis, and Lake Lucerne cruising.',
        'Switzerland is where fairy tales meet engineering brilliance. Glide aboard precision Swiss trains through emerald valleys, ascend into glaciers aboard the world-first revolving Titlis Rotair gondola, and stand at Jungfraujoch surrounded by perpetual ice and snow.',
        7, 6, 178000.00, 164999.00,
        'per_person'::public.pricing_type,
        'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
        ARRAY[
            'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
        ],
        '[
            {"day": 1, "title": "Arrival in Zurich - Gateway to the Alps", "description": "Arrive at Zurich Airport. Activate your 8-Day Swiss Travel Pass. Take the quick 10-minute train into Zurich HB. Check into hotel. Stroll along the famous Bahnhofstrasse and Lake Zurich promenade.", "meals": "None", "stay": "Hotel Glockenhof / Radisson Blu Zurich"},
            {"day": 2, "title": "Zurich to Lucerne - Chapel Bridge & Lion Monument", "description": "Scenic 45-minute train to Lucerne. Walk across the 14th-century wooden Chapel Bridge, visit the poignant Lion Monument, and take a 1-hour panoramic yacht cruise on Lake Lucerne.", "meals": "Breakfast", "stay": "Ameron Hotel Flora Lucerne"},
            {"day": 3, "title": "Mount Titlis Glacier & Rotair Cable Car", "description": "Day trip to Engelberg. Board the Rotair revolving cable car up to Mount Titlis (10,000 ft). Walk the Glacier Cave and cross the Titlis Cliff Walk suspension bridge.", "meals": "Breakfast", "stay": "Ameron Hotel Flora Lucerne"},
            {"day": 4, "title": "Lucerne to Interlaken - Heart of the Bernese Oberland", "description": "Board the scenic Luzern-Interlaken Express across the Brunig Pass. Arrive in Interlaken nestled between Lake Thun and Lake Brienz. Evening stroll at Hohematte.", "meals": "Breakfast", "stay": "Victoria-Jungfrau Grand Hotel / Hotel Interlaken"},
            {"day": 5, "title": "Jungfraujoch - Top of Europe (11,333 ft)", "description": "Board the Eiger Express tri-cable gondola from Grindelwald Terminal followed by the cogwheel railway inside Mount Eiger to Jungfraujoch. Marvel at the Aletsch Glacier, the longest ice stream in the Alps.", "meals": "Breakfast", "stay": "Hotel Interlaken"},
            {"day": 6, "title": "Grindelwald First & Lake Brienz Cruise", "description": "Visit Grindelwald First for the thrilling Tissot Cliff Walk and First Flyer. Afternoon scenic cruise on the turquoise waters of Lake Brienz to Giessbach Falls.", "meals": "Breakfast", "stay": "Hotel Interlaken"},
            {"day": 7, "title": "Departure Zurich / Onward Travel", "description": "Breakfast at hotel. Board the direct train to Zurich Airport for your international flight home.", "meals": "Breakfast", "stay": "None"}
        ]'::jsonb,
        '4-Star Superior Alpine Luxury Hotels',
        'Zurich: 1 Night; Lucerne: 2 Nights; Interlaken: 3 Nights',
        ARRAY[
            '6 Nights in centrally located 4-star superior hotels with daily buffet breakfast',
            '8-Day Swiss Travel Pass in 2nd Class (unlimited trains, buses, and public boats)',
            'Mount Titlis cable car excursion with Ice Flyer',
            'Jungfraujoch Top of Europe cogwheel railway and Eiger Express tickets',
            'Panoramic Lake Lucerne and Lake Brienz cruises'
        ],
        ARRAY[
            'International airfare (ex-Mumbai or Pune)',
            'Schengen Tourist Visa fee and processing',
            'City tourist taxes payable directly at hotels (CHF 3-5 per night)',
            'Meals other than breakfast'
        ],
        ARRAY[
            'Jungfraujoch 11,333 ft Top of Europe',
            'Revolving Titlis Rotair Cable Car',
            'Unlimited travel with Swiss Travel Pass',
            'Cruise on Lake Lucerne & Lake Brienz'
        ],
        2, 8, 'Mumbai / Pune (Connecting)', 'Special Summer Offer: Free upgrade to 1st Class Swiss Rail Pass on select dates', true, true
    ),
    (
        'a4444444-4444-4444-4444-444444444444',
        (SELECT id FROM public.destinations WHERE slug = 'bali-indonesia' LIMIT 1),
        (SELECT id FROM public.package_categories WHERE slug = 'honeymoon-and-romance' LIMIT 1),
        'Romantic Bali: Jungle Retreat & Private Pool Ocean Villa',
        'romantic-bali-jungle-and-ocean-villa',
        'Indulge in Bali magic with 3 nights in an Ubud forest sanctuary and 2 nights in a private pool beachfront villa in Seminyak.',
        'From sacred forest sanctuaries and cascading jungle waterfalls to vibrant beach clubs and cliffside sunsets, this curated Bali itinerary balances intimacy, wellness, and island adventures.',
        6, 5, 52900.00, 46500.00,
        'per_person'::public.pricing_type,
        'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
        ARRAY[
            'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80'
        ],
        '[
            {"day": 1, "title": "Arrival in Denpasar & Ubud Forest Check-in", "description": "Warm flower garland greeting at Ngurah Rai Airport. Private transfer to your luxury jungle resort in Ubud. Evening romantic candlelit dinner.", "meals": "Dinner", "stay": "Komaneka at Bisma / Maya Ubud Resort"},
            {"day": 2, "title": "Ubud Art, Rice Terraces & Jungle Swing", "description": "Visit the famous Tegallalang Rice Terraces, take the iconic Bali Jungle Swing, explore Tirta Empul Holy Water Temple, and walk through the Sacred Monkey Forest.", "meals": "Breakfast", "stay": "Maya Ubud Resort"},
            {"day": 3, "title": "Kintamani Volcano & Traditional Spa Rejuvenation", "description": "Marvel at Mount Batur caldera views in Kintamani. In the afternoon, enjoy a complimentary 90-minute Balinese Aromatherapy couple massage.", "meals": "Breakfast", "stay": "Maya Ubud Resort"},
            {"day": 4, "title": "Ubud to Seminyak Private Pool Villa", "description": "Scenic transfer to coastal Seminyak. Check into your luxury Private Pool Villa. Afternoon relaxing by your private pool. Evening visit to Tanah Lot Sea Temple for sunset.", "meals": "Breakfast", "stay": "The Elysian Boutique Villa Seminyak"},
            {"day": 5, "title": "Uluwatu Sunset Temple & Jimbaran Beach Seafood", "description": "Visit the cliff-top Uluwatu Temple overlooking the roaring Indian Ocean. Witness the hypnotic Kecak & Fire Dance at twilight. Candlelight seafood dinner on Jimbaran Beach.", "meals": "Breakfast & Dinner", "stay": "The Elysian Boutique Villa Seminyak"},
            {"day": 6, "title": "Departure Bali", "description": "Floating breakfast in your private villa pool. Leisurely shopping in Seminyak boutiques before private transfer to Bali Airport.", "meals": "Breakfast", "stay": "None"}
        ]'::jsonb,
        'Luxury Jungle Resort + Private Pool Villa',
        '3 Nights Ubud (Forest Suite), 2 Nights Seminyak (Private Pool Villa)',
        ARRAY[
            '3 Nights Ubud Luxury Resort + 2 Nights Seminyak 1-Bedroom Private Pool Villa',
            'Daily breakfast including 1 signature floating breakfast in your villa pool',
            '90-Minute authentic Balinese couples massage',
            'Private air-conditioned vehicle with English-speaking chauffeur throughout',
            'Uluwatu Kecak Fire Dance tickets and Jimbaran Bay candlelit seafood dinner'
        ],
        ARRAY[
            'International airfare',
            'Indonesia Visa on Arrival (approx. $35 USD per person paid at airport)',
            'Tourism levy fee ($10 USD)',
            'Personal tipping'
        ],
        ARRAY[
            'Signature Floating Breakfast in private villa',
            'Uluwatu sunset cliff temple & Kecak dance',
            'Romantic Jimbaran beach dinner under stars',
            '90-Minute Balinese massage session'
        ],
        2, 6, 'Pune / Mumbai', 'Honeymoon inclusion: Complimentary bottle of sparkling wine and cake', true, true
    )
ON CONFLICT (slug) DO UPDATE SET
    destination_id = EXCLUDED.destination_id,
    category_id = EXCLUDED.category_id,
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    description = EXCLUDED.description,
    days = EXCLUDED.days,
    nights = EXCLUDED.nights,
    price_inr = EXCLUDED.price_inr,
    discounted_price_inr = EXCLUDED.discounted_price_inr,
    pricing_type = EXCLUDED.pricing_type,
    cover_image = EXCLUDED.cover_image,
    gallery = EXCLUDED.gallery,
    itinerary = EXCLUDED.itinerary,
    accommodation_grade = EXCLUDED.accommodation_grade,
    hotel_details = EXCLUDED.hotel_details,
    inclusions = EXCLUDED.inclusions,
    exclusions = EXCLUDED.exclusions,
    highlights = EXCLUDED.highlights,
    min_travelers = EXCLUDED.min_travelers,
    max_travelers = EXCLUDED.max_travelers,
    departure_city = EXCLUDED.departure_city,
    seasonal_offer = EXCLUDED.seasonal_offer,
    is_featured = EXCLUDED.is_featured,
    is_published = EXCLUDED.is_published,
    updated_at = NOW();

-- ------------------------------------------------------------------------------
-- 4. Verification Queries
-- ------------------------------------------------------------------------------
SELECT 'Package Categories' AS table_name, count(*) AS total_records FROM public.package_categories
UNION ALL
SELECT 'Destinations' AS table_name, count(*) AS total_records FROM public.destinations
UNION ALL
SELECT 'Tour Packages' AS table_name, count(*) AS total_records FROM public.packages;
