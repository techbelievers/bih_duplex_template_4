import React, { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../../../config.js";
import styles from "../css/ContactUs.module.css";

const ContactUs = () => {
  const [data, setData] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email_id: "",
    phone_number: "",
    message: "",
    note: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(API.CONTACT_US())
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await axios.post(API.postContactUs, formData);
      setSuccess(true);
      setFormData({ first_name: "", last_name: "", email_id: "", phone_number: "", message: "", note: "" });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactPhone = data?.contact_us?.contact_phone || "+91-81818-17136";
  const contactName = data?.contact_us?.name || "Get in touch";
  const contactDetail = data?.contact_us?.detail || "We'd love to hear from you.";

  return (
    <section id="contact" className={styles.section}>
      <div className={styles.layout}>
        {/* Left: navy panel with headline + CTA */}
        <div className={styles.infoPanel}>
          <span className={styles.infoLabel}>Contact</span>
          <h2 className={styles.infoTitle}>{contactName}</h2>
          <div className={styles.infoText} dangerouslySetInnerHTML={{ __html: contactDetail }} />
          <a href={`tel:${contactPhone.replace(/\s/g, "")}`} className={styles.phoneCta}>
            <span className={styles.phoneCtaLabel}>Call us</span>
            <span className={styles.phoneCtaValue}>{contactPhone}</span>
          </a>
        </div>
        {/* Right: form card */}
        <div className={styles.formPanel}>
          <h3 className={styles.formTitle}>Send a message</h3>
          {success && (
            <div className={styles.success}>
              <p>Message sent. We&apos;ll get back to you soon.</p>
            </div>
          )}
          {error && <p className={styles.err}>{error}</p>}
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.row}>
              <input type="text" name="first_name" placeholder="First name *" value={formData.first_name} onChange={handleChange} required className={styles.input} />
              <input type="text" name="last_name" placeholder="Last name *" value={formData.last_name} onChange={handleChange} required className={styles.input} />
            </div>
            <input type="tel" name="phone_number" placeholder="Phone *" value={formData.phone_number} onChange={handleChange} required maxLength={10} pattern="\d{10}" className={styles.input} />
            <input type="email" name="email_id" placeholder="Email" value={formData.email_id} onChange={handleChange} className={styles.input} />
            <textarea name="message" placeholder="Message" value={formData.message} onChange={handleChange} rows={4} className={styles.textarea} />
            <button type="submit" disabled={isSubmitting} className={styles.btn}>
              {isSubmitting ? "Sending…" : "Send message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
