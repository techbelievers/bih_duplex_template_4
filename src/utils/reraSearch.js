import axios from "axios";
import { API, WEBSITE_DOMAIN } from "../../config.js";

/**
 * The `get-properties` API does not include RERA (MahaRERA) ids on each
 * listing, so they cannot be searched directly. This helper fetches the RERA
 * id(s) for every property in the background and attaches them as a
 * `rera_ids` array, allowing users to search a property by its RERA number.
 *
 * Results are cached in sessionStorage (keyed by domain) so the extra network
 * calls only happen once per browsing session, and requests are run with a
 * limited concurrency pool to avoid hammering the API.
 */

const CACHE_KEY = `bih_rera_map_${WEBSITE_DOMAIN}`;
const CONCURRENCY = 6;
const REQUEST_TIMEOUT = 10000;

const readCache = () => {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const writeCache = (map) => {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(map));
  } catch {
    /* sessionStorage may be unavailable (private mode / quota) — ignore */
  }
};

const fetchReraIdsForSlug = async (slug) => {
  try {
    const { data } = await axios.get(API.MAHARERA_STUDIO(slug), {
      timeout: REQUEST_TIMEOUT,
    });
    const rera = Array.isArray(data?.rera) ? data.rera : [];
    return rera.map((item) => item?.rera_id).filter(Boolean);
  } catch {
    // A missing/failed RERA lookup shouldn't break the listing — treat as none.
    return [];
  }
};

/**
 * Attach `rera_ids` to every property. Returns a new array; never throws.
 * @param {Array<object>} properties
 * @returns {Promise<Array<object>>}
 */
export const enrichPropertiesWithRera = async (properties) => {
  if (!Array.isArray(properties) || properties.length === 0) return properties;

  const cache = readCache();
  const results = { ...cache };
  const pending = properties.filter(
    (p) => p?.property_slug && !(p.property_slug in results)
  );

  if (pending.length > 0) {
    let index = 0;
    const worker = async () => {
      while (index < pending.length) {
        const slug = pending[index++].property_slug;
        results[slug] = await fetchReraIdsForSlug(slug);
      }
    };
    const poolSize = Math.min(CONCURRENCY, pending.length);
    await Promise.all(Array.from({ length: poolSize }, worker));
    writeCache(results);
  }

  return properties.map((p) => ({
    ...p,
    rera_ids: results[p?.property_slug] || [],
  }));
};

/**
 * True when `query` matches one of a property's RERA ids (case-insensitive,
 * substring). Safe to call before enrichment has completed.
 */
export const matchesRera = (property, query) => {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return false;
  return (property?.rera_ids || []).some((id) =>
    String(id).toLowerCase().includes(q)
  );
};
