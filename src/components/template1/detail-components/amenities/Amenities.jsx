import React, { useState, useEffect } from "react";
import { API } from "../../../../../config.js";
import styles from "./Amenities.module.css";

const Amenities = ({ slug }) => {
  const [amenitiesData, setAmenitiesData] = useState([]);
  const [heading, setHeading] = useState("");
  const [subHeading, setSubHeading] = useState("");

  useEffect(() => {
    const fetchAmenitiesData = async () => {
      try {
        const response = await fetch(API.AMENITIES_STUDIO(slug));
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setAmenitiesData(data.amenities?.amenities || []);
        setHeading(data.amenities?.page?.heading || "Amenities");
        setSubHeading(
          data.amenities?.page?.subheading ||
            "Discover the features that enhance your living experience"
        );
      } catch (error) {
        console.error("Error fetching amenities data:", error);
      }
    };

    fetchAmenitiesData();
  }, [slug]);

  if (!amenitiesData?.length) return null;

  return (
    <section id="amenities" className={styles.section}>
      <div className={styles.container}>
        <header className={styles.header}>
          <span className={styles.label}>Amenities & lifestyle</span>
          <h2 className={styles.title}>{heading}</h2>
          <p className={styles.subtitle}>{subHeading}</p>
        </header>

        <div className={styles.grid}>
          {amenitiesData.map((amenity, index) => (
            <article key={amenity.id} className={styles.card}>
              <div className={styles.media}>
                {amenity.property_amenities_photo ? (
                  <img
                    src={amenity.property_amenities_photo}
                    alt={amenity.amenity_name}
                    className={styles.image}
                    loading="lazy"
                  />
                ) : (
                  <div className={styles.placeholder}>
                    <span className={styles.icon} aria-hidden>✓</span>
                  </div>
                )}
                <span className={styles.badge}>Included</span>
              </div>
              <div className={styles.content}>
                <h3 className={styles.name}>{amenity.amenity_name}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Amenities;
