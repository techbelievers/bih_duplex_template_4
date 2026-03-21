import React, { useEffect, useState, useRef } from "react";
import { API } from "../../../../config.js";
import styles from "../css/BankPartner.module.css";

const BankPartner = () => {
  const [banks, setBanks] = useState([]);
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    fetch(API.BANKS())
      .then((res) => res.json())
      .then((data) => {
        setBanks(data.bank?.banks || []);
        setHeading(data.bank?.page?.heading || "Bank partners");
        setSubheading(data.bank?.page?.subheading || "");
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!ref.current || !banks.length) return;
    const id = setInterval(() => {
      ref.current?.scrollBy({ left: 1, behavior: "smooth" });
    }, 25);
    return () => clearInterval(id);
  }, [banks.length]);

  if (!banks.length) return null;

  const list = [...banks, ...banks];

  return (
    <section className={styles.section}>
      <span className={styles.label}>Our partners</span>
      <h2 className={styles.title}>{heading}</h2>
      {subheading && <p className={styles.sub}>{subheading}</p>}
      <div className={styles.scrollWrap}>
        <div className={styles.scroll} ref={ref}>
          <div className={styles.row}>
            {list.map((bank, i) => (
              <div key={`${bank.id}-${i}`} className={styles.card}>
                <img
                  src={bank.property_bank_photo || "/default-bank.png"}
                  alt={bank.bank_name}
                  className={styles.logo}
                />
                <span className={styles.name}>{bank.bank_name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BankPartner;
