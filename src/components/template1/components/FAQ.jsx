import React, { useState, useEffect } from "react";
import { API } from "../../../../config.js";
import styles from "../css/FAQ.module.css";

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    fetch(API.FAQ())
      .then((res) => res.json())
      .then((data) => {
        const list = data.faqs || [];
        setFaqs(list);
        setOpenId(list[0]?.id ?? null);
        setHeading(data.page?.[0]?.heading || "FAQ");
        setSubheading(data.page?.[0]?.subheading || "");
      })
      .catch(console.error);
  }, []);

  if (!faqs.length) return null;

  const toggle = (id) => setOpenId((current) => (current === id ? null : id));

  return (
    <section id="faq" className={styles.section}>
      <div className={styles.head}>
        <span className={styles.label}>FAQ</span>
        <h2 className={styles.title}>{heading}</h2>
        {subheading && <p className={styles.sub}>{subheading}</p>}
      </div>

      <div className={styles.accordion}>
        {faqs.map((faq, index) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className={`${styles.item} ${isOpen ? styles.itemOpen : ""}`}
            >
              <button
                type="button"
                className={styles.trigger}
                onClick={() => toggle(faq.id)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${faq.id}`}
                id={`faq-question-${faq.id}`}
              >
                <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
                <span className={styles.triggerText}>{faq.faq_title}</span>
                <span className={styles.icon} aria-hidden>{isOpen ? "−" : "+"}</span>
              </button>
              <div
                id={`faq-answer-${faq.id}`}
                className={`${styles.answer} ${isOpen ? styles.answerOpen : ""}`}
                role="region"
                aria-labelledby={`faq-question-${faq.id}`}
                aria-hidden={!isOpen}
              >
                <div className={styles.answerInner} dangerouslySetInnerHTML={{ __html: faq.faq_content }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQ;
