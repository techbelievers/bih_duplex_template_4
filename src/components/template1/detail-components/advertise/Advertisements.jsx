import React, { useState, useEffect } from "react";
import { API } from "../../../../../config.js";
import styles from "./Advertisements.module.css";

const Advertisements = ({slug}) => {
  const [ads, setAds] = useState([]);
  const [heading, setHeading] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        const response = await fetch(API.STUDIO_ADVERTISEMENT_SLUG(slug));
        const data = await response.json();
        const advertisements = data.advertisements || [];
        setAds(advertisements);
        setHeading(data.page[0]?.heading || "Featured Advertisements");
      } catch (error) {
        console.error("Error fetching advertisements:", error);
      }
    };

    fetchAdvertisements();

    const updateScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, [slug]);

  useEffect(() => {
    const shouldEnableSlider = ads.length > 3 || !isDesktop;
    if (shouldEnableSlider) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [ads, isDesktop]);

  if (!ads || ads.length === 0) return null;

  const shouldEnableSlider = ads.length > 3 || !isDesktop;

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? ads.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
  };

  return (
    <section className={styles.advertisementSection}>
      <span className={styles.label}>Featured</span>
      <h2 className={styles.heading}>{heading}</h2>
      <div className={styles.sliderContainer}>
        <button className={styles.arrow} onClick={handlePrev}>
          &#9664;
        </button>
        <div
          className={styles.slider}
          style={{
            transform: shouldEnableSlider
              ? `translateX(-${currentIndex * 100}%)`
              : "translateX(0)",
          }}
        >
          {ads.map((ad, index) => (
            <div
              className={`${styles.slide} ${
                shouldEnableSlider ? styles.animatedSlide : ""
              }`}
              key={index}
            >
              {ad.above_category_1 && (
                <a
                  href={ad.above_category_1_url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.adLink}
                >
                  <img
                    src={ad.above_category_1}
                    alt={`Advertisement ${index + 1}`}
                    className={styles.adImage}
                  />
                </a>
              )}
            </div>
          ))}
        </div>
        <button className={styles.arrow} onClick={handleNext}>
          &#9654;
        </button>
      </div>
      {shouldEnableSlider && (
        <div className={styles.dots}>
          {ads.map((_, index) => (
            <span
              key={index}
              className={`${styles.dot} ${
                index === currentIndex ? styles.activeDot : ""
              }`}
              onClick={() => setCurrentIndex(index)}
            ></span>
          ))}
        </div>
      )}
    </section>
  );
};

export default Advertisements;
