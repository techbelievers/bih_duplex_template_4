import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { API } from "../../../../../config.js";
import styles from "./HeroBanner.module.css";

const HeroBanner = ({ propertyDetails, slug, servicesData: initialServiceData, galleryData: initialGalleryData }) => {
  const formSectionRef = useRef(null);
  const [galleryData, setGalleryData] = useState(initialGalleryData || []);
  const [servicesData, setServicesData] = useState(initialServiceData || {});
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email_id: "",
    phone_number: "",
    message: "",
    note: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    if (!initialGalleryData) {
      fetch(API.GALLERY_STUDIO(slug))
        .then((res) => res.json())
        .then((data) => setGalleryData(data.property_photos || []))
        .catch(console.error);
    } else setGalleryData(initialGalleryData);
  }, [slug, initialGalleryData]);

  useEffect(() => {
    if (galleryData.length > 1) {
      const t = setInterval(() => setCurrentImageIndex((i) => (i + 1) % galleryData.length), 5000);
      return () => clearInterval(t);
    }
  }, [galleryData.length]);

  useEffect(() => {
    if (!initialServiceData || Object.keys(initialServiceData).length === 0) {
      axios.get(API.HEADER_STUDIO(slug)).then((r) => setServicesData(r.data)).catch(console.error);
    } else setServicesData(initialServiceData);
  }, [slug, initialServiceData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(API.postContactUs, { ...formData, note: slug ?? "" });
      setFormSubmitted(true);
      setFormData({ first_name: "", last_name: "", email_id: "", phone_number: "", message: "", note: "" });
      setTimeout(() => window.location.replace("/thank-you"), 1500);
    } catch {
      setSubmitError("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!propertyDetails) return <div className={styles.loading}>Loading…</div>;

  const allImages =
    galleryData.length > 0
      ? galleryData.map((p) => p.photo)
      : [propertyDetails.property_featured_photo || "/default-image.jpg"];

  const hasKeyInfo = servicesData?.location || servicesData?.builder_name || servicesData?.property_type_price_range_text;

  return (
    <section className={styles.hero}>
      {/* Full-bleed background slider */}
      <div className={styles.bg}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            className={styles.slide}
            style={{ backgroundImage: `url(${allImages[currentImageIndex]})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        </AnimatePresence>
        <div className={styles.overlay} />
      </div>
      <div className={styles.spacer} aria-hidden />

      {/* Slider controls - bottom right */}
      {allImages.length > 1 && (
        <div className={styles.sliderControls}>
          <div className={styles.dots}>
            {allImages.map((_, i) => (
              <button
                key={i}
                type="button"
                className={i === currentImageIndex ? styles.dotActive : styles.dot}
                onClick={() => setCurrentImageIndex(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
          <span className={styles.counter}>{currentImageIndex + 1} / {allImages.length}</span>
        </div>
      )}

      {/* Content wrapper: card + form - responsive alignment */}
      <div className={styles.heroContent}>
      <div className={styles.card}>
        <span className={styles.badge}>Featured property</span>
        <h2 className={styles.title}>{propertyDetails.property_name || "Property"}</h2>
        {propertyDetails.tagline && <p className={styles.tagline}>{propertyDetails.tagline}</p>}

        {hasKeyInfo && (
          <div className={styles.pills}>
            {servicesData.location && (
              <span className={styles.pill}><strong>Location</strong> {servicesData.location}</span>
            )}
            {servicesData.builder_name && (
              <span className={styles.pill}><strong>Builder</strong> {servicesData.builder_name}</span>
            )}
            {servicesData.property_type_price_range_text && (
              <span className={styles.pill}><strong>Type</strong> {servicesData.property_type_price_range_text}</span>
            )}
          </div>
        )}

        <div className={styles.ctaRow}>
          <a href="#price" className={styles.ctaPrimary}>View pricing</a>
          <button
            type="button"
            className={styles.ctaSecondary}
            onClick={() => {
              setFormOpen(true);
              setTimeout(() => formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
            }}
          >
            Request callback
          </button>
        </div>
      </div>

      {/* Enquiry strip */}
      <div ref={formSectionRef} className={styles.formSection} id="request-callback">
        <div className={styles.formCard}>
          {servicesData?.property_builder_photo && (
            <div className={styles.builderLogo}>
              <img src={servicesData.property_builder_photo} alt={servicesData.builder_name || "Builder"} />
            </div>
          )}
          <h2 className={styles.formTitle}>
            {formOpen ? `I'm interested in ${propertyDetails?.property_name || "this property"}` : "Interested? Get a callback"}
          </h2>
          {!formOpen ? (
            <button type="button" className={styles.formToggle} onClick={() => setFormOpen(true)}>
              Share your details
            </button>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formRow}>
                <input type="text" name="first_name" placeholder="First name *" value={formData.first_name} onChange={handleInputChange} required />
                <input type="text" name="last_name" placeholder="Last name *" value={formData.last_name} onChange={handleInputChange} required />
              </div>
              <input type="tel" name="phone_number" placeholder="Phone *" value={formData.phone_number} onChange={handleInputChange} required maxLength={10} pattern="\d{10}" />
              <input type="email" name="email_id" placeholder="Email" value={formData.email_id} onChange={handleInputChange} />
              <textarea name="message" placeholder="Message" value={formData.message} onChange={handleInputChange} rows={2} />
              {submitError && <p className={styles.formError}>{submitError}</p>}
              {formSubmitted && <p className={styles.formSuccess}>Thank you. Redirecting…</p>}
              <div className={styles.formActions}>
                <button type="button" className={styles.formCancel} onClick={() => setFormOpen(false)}>Cancel</button>
                <button type="submit" className={styles.formSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Sending…" : "Send"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      </div>
    </section>
  );
};

export default HeroBanner;
