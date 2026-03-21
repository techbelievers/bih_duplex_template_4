import React, { useState, useEffect } from "react";
import { API } from "../../../../../config.js";
import { motion } from "framer-motion";
import styles from "./LocationMap.module.css";

const CompactLocation = ({slug}) => {
  const [mapData, setMapData] = useState({ heading: "", map: "" });
  const [locationData, setLocationData] = useState([]);
  const [locationDataHeading, setLocationDataHeading] = useState("");
  const [activeTab, setActiveTab] = useState("0–5 km");

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const response = await fetch(API.LOCATION_MAP_STUDIO(slug));
        const data = await response.json();
        setMapData({
          heading: data.heading || "Location",
          map: data.map || "",
        });
      } catch (error) {
        console.error("Error fetching map data:", error);
      }
    };

    const fetchLocationData = async () => {
      try {
        const response = await fetch(API.LOCATION_ADVANTAGES_STUDIO(slug));
        const data = await response.json();
        setLocationData(data.location_advantages || []);
        setLocationDataHeading(data.page?.[0]?.heading || "Location highlights");
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    };

    fetchMapData();
    fetchLocationData();
  }, [slug]);

  // Group locations by distance ranges
  const groupedLocations = {
    "0–5 km": locationData.filter((item) => parseFloat(item.distance) <= 5),
    "5–10 km": locationData.filter(
      (item) => parseFloat(item.distance) > 5 && parseFloat(item.distance) <= 10
    ),
    "10+ km": locationData.filter((item) => parseFloat(item.distance) > 10),
  };

  return (
    <section id="location" className={styles.locationSection}>
      {/* Map Section */}
     
      <div className={styles.mapWrapper}>
      <span className={styles.label}>Location</span>
      <h2 className={styles.heading}>{mapData.heading}</h2>
        <div
          className={styles.map}
          dangerouslySetInnerHTML={{ __html: mapData.map }}
        ></div>
        {/* <div className={styles.clipOverlay}></div> */}
      </div>

      {/* Highlights Section */}
      <div className={styles.highlightsSection}>
      <h2 className={styles.heading}>{locationDataHeading}</h2>
        <div className={styles.tabs}>
          {Object.keys(groupedLocations).map((tab) => (
            <button
              key={tab}
              className={`${styles.tabButton} ${
                activeTab === tab ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <motion.div
          className={styles.groupItems}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={activeTab}
        >
          {groupedLocations[activeTab].map((item) => (
            <div key={item.id} className={styles.locationCard}>
              <div className={styles.imageWrapper}>
                <img
                  src={item.location_image}
                  alt={item.location}
                  className={styles.image}
                />
              </div>
              <div className={styles.textWrapper}>
                <h4 className={styles.locationName}>{item.location}</h4>
                <p className={styles.distance}>{item.distance}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CompactLocation;
