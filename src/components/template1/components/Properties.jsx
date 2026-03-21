import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../css/Properties.module.css";
import { API } from "../../../../config.js";

const PropertiesSection = () => {
  const [properties, setProperties] = useState([]);
  const [sectionInfo, setSectionInfo] = useState({ heading: "", subheading: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

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

  const handleViewAll = () => {
    setShowAll(true);
    setTimeout(() => {
      document.getElementById("properties")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
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
        <span className={styles.cardPrice}>₹ {property.property_price} Lakhs *</span>
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
        <div className={styles.headAction}>
          {showAll ? (
            <button type="button" className={styles.viewAllBtn} onClick={() => setShowAll(false)}>
              Show less
            </button>
          ) : (
            <button type="button" className={styles.viewAllBtn} onClick={handleViewAll}>
              View all
            </button>
          )}
        </div>
      </div>

      {showAll ? (
        <div className={styles.gridAll}>
          {properties.map((property) => renderCard(property))}
        </div>
      ) : (
        <div className={styles.scrollWrap}>
          <div className={styles.track}>
          {properties.map((property) => (
            renderCard(property)
          ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default PropertiesSection;
