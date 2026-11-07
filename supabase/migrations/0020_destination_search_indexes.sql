-- ==============================================================================
-- 0020: Destination & Package Search Optimization Indexes
-- ==============================================================================
-- Development Agency: Automate Stack
-- Project: The Tour Vision (Pune, Maharashtra, India)
--
-- Adds expression indexes for fast case-insensitive search queries on
-- destination names, countries, regions, and package titles.
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_destinations_name_lower 
    ON public.destinations (lower(name));

CREATE INDEX IF NOT EXISTS idx_destinations_country_lower 
    ON public.destinations (lower(country));

CREATE INDEX IF NOT EXISTS idx_destinations_region_lower 
    ON public.destinations (lower(region));

CREATE INDEX IF NOT EXISTS idx_packages_title_lower 
    ON public.packages (lower(title));
