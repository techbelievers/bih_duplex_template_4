import React, { useState, useEffect } from "react";
import { API } from "../../../../config.js";
import styles from "../css/LocationMap.module.css";

const CompactLocation = () => {
  const [mapData, setMapData] = useState({ heading: "", map: "" });
  const [highlights, setHighlights] = useState([]);
  const [show, setShow] = useState(4);

  useEffect(() => {
    fetch(API.LOCATION_MAP())
      .then((res) => res.json())
      .then((data) => setMapData({ heading: data.heading || "Location", map: data.map || "" }))
      .catch(console.error);
    fetch(API.LOCATION_ADVANTAGES())
      .then((res) => res.json())
      .then((data) => setHighlights(data.location_advantages || []))
      .catch(console.error);
  }, []);

  const list = highlights.slice(0, show);
  const hasMore = show < highlights.length;

  return (
    <section id="location" className={styles.section}>
      <h2 className={styles.title}>{mapData.heading}</h2>
      <div className={styles.wrap}>
        {mapData.map && (
          <div className={styles.mapWrap} dangerouslySetInnerHTML={{ __html: mapData.map }} />
        )}
        {highlights.length > 0 && (
        <div className={styles.highlights}>
          {list.map((item) => (
            <div key={item.id} className={styles.card}>
              {item.location_image && (
                <img src={item.location_image} alt={item.location} className={styles.cardImg} />
              )}
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{item.location}</h3>
                {item.distance && <p className={styles.dist}>{item.distance}</p>}
              </div>
            </div>
          ))}
          {hasMore && (
            <button type="button" className={styles.more} onClick={() => setShow((s) => s + 4)}>
              See more
            </button>
          )}
        </div>
        )}
      </div>
    </section>
  );
};

export default CompactLocation;
