import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import styles from "../css/Properties.module.css";
import { API } from "../../../../config.js";

const PropertiesSection = () => {
  const [properties, setProperties] = useState([]);
  const [sectionInfo, setSectionInfo] = useState({ heading: "", subheading: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(API.GET_PROPERTIES(), { timeout: 10000 });
        setProperties(response.data.property_details || []);
        if (response.data.page?.[0]) {
          setSectionInfo({
            heading: response.data.page[0].heading,
            subheading: response.data.page[0].subheading,
          });
        }
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError("Failed to fetch properties");
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const filteredProperties = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return properties;
    return properties.filter((property) => {
      const haystack = [
        property.property_name,
        property.builder_name,
        property.sub_location,
        property.property_location_name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [properties, query]);

  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.state}>
          <div className={styles.spinner} />
          <p>Loading properties...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.section}>
        <div className={styles.stateError}>
          <p>{error}</p>
          <p className={styles.stateSub}>Please try refreshing the page.</p>
        </div>
      </section>
    );
  }

  if (!properties?.length) {
    return (
      <section className={styles.section}>
        <div className={styles.state}>
          <h3>No properties available</h3>
          <p>Check back soon for new listings.</p>
        </div>
      </section>
    );
  }

  const openStudio = (slug) => {
    window.location.href = `/${slug}`;
  };

  const renderCard = (property) => (
    <article
      key={property.id}
      className={styles.card}
      onClick={() => openStudio(property.property_slug)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openStudio(property.property_slug);
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className={styles.cardImage}>
        <img
          src={`https://buyindiahomes.in/uploads/property_featured_photos/${property.property_featured_photo || "default-image.jpg"}`}
          alt={property.property_name || "Property"}
          onError={(e) => { e.target.src = "/default-image.jpg"; }}
        />
        <span className={styles.cardPrice}>₹ {property.property_price} {property.price_unit} *</span>
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{property.property_name || "Premium Property"}</h3>
        {property.builder_name && (
          <p className={styles.cardMeta}>{property.builder_name}</p>
        )}
        {(property.sub_location || property.property_location_name) && (
          <p className={styles.cardLocation}>
            {[property.sub_location, property.property_location_name].filter(Boolean).join(", ")}
          </p>
        )}
        <span className={styles.cardCta}>View details</span>
      </div>
    </article>
  );

  return (
    <section id="properties" className={styles.section}>
      <div className={styles.head}>
        <span className={styles.headLabel}>Our developments</span>
        <h2 className={styles.headTitle}>{sectionInfo.heading || "Discover"}</h2>
        {sectionInfo.subheading && (
          <p className={styles.headSub}>{sectionInfo.subheading}</p>
        )}
      </div>

      <div className={styles.searchWrap}>
        <div className={styles.searchBox}>
          <svg
            className={styles.searchIcon}
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by name, builder or location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search properties"
          />
          {query && (
            <button
              type="button"
              className={styles.searchClear}
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              &times;
            </button>
          )}
        </div>
      </div>

      {filteredProperties.length ? (
        <div className={styles.grid}>
          {filteredProperties.map((property) => renderCard(property))}
        </div>
      ) : (
        <div className={styles.state}>
          <h3>No matches found</h3>
          <p>Try a different name, builder or location.</p>
        </div>
      )}
    </section>
  );
};

export default PropertiesSection;
