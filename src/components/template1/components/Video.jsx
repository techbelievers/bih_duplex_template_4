import React, { useState, useEffect } from "react";
import { API } from "../../../../config.js";
import styles from "../css/Video.module.css";

const Video = () => {
  const [videos, setVideos] = useState([]);
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");

  useEffect(() => {
    fetch(API.VIDEO())
      .then((res) => res.json())
      .then((data) => {
        setVideos(data.property_videos || []);
        setHeading(data.page?.heading || "Videos");
        setSubheading(data.page?.subheading || "");
      })
      .catch(console.error);
  }, []);

  if (!videos.length) return null;

  return (
    <section className={styles.section}>
      <span className={styles.label}>Watch</span>
      <h2 className={styles.title}>{heading}</h2>
      {subheading && <p className={styles.sub}>{subheading}</p>}
      <div className={styles.grid}>
        {videos.map((video) => (
          <div key={video.id} className={styles.video}>
            <iframe
              src={`https://www.youtube.com/embed/${video.youtube_video_id}`}
              title="Property video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className={styles.iframe}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Video;
