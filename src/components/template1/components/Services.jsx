import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../css/Services.module.css";
import { API } from "../../../../config.js";

const Services = () => {
  const [headerData, setHeaderData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(API.HEADER())
      .then((res) => setHeaderData(res.data))
      .catch(() => setError("Failed to load"));
  }, []);

  if (error) return <div className={styles.error}>{error}</div>;
  if (!headerData) return <section className={styles.section}><div className={styles.loading}>Loading…</div></section>;

  const sublocationDisplay = headerData.sublocation !== "Default Sublocation" ? headerData.sublocation : "";

  return (
    <section className={styles.section}>
      <span className={styles.label}>At a glance</span>
      <div className={styles.grid}>
        <div className={styles.card}>
          <img src={headerData.logo} alt="Builder" className={styles.cardImg} />
          <h3 className={styles.cardTitle}>{headerData.builder_name}</h3>
        </div>
        <div className={styles.card}>
          <img src="https://www.buyindiahomes.in/location2.png" alt="Location" className={styles.cardImg} />
          <h3 className={styles.cardTitle}>{sublocationDisplay || "Location"}</h3>
          <p className={styles.cardSub}>{headerData.location}</p>
        </div>
        <div className={styles.card}>
          <img src="https://www.buyindiahomes.in/apartment_2.png" alt="Property" className={styles.cardImg} />
          <h3 className={styles.cardTitle}>{headerData.property_type_price_range_text}</h3>
          <p className={styles.cardSub}>{headerData.property_area_min_max}</p>
          {headerData.property_last_updated && (
            <p className={styles.cardMeta}>Updated: {headerData.property_last_updated}</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Services;
