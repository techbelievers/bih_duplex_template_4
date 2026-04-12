import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { API } from "../../../../config.js";
import styles from "../css/Footer.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faTwitter,
  faLinkedinIn,
  faPinterest,
  faYoutube,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

const iconMap = {
  "fab fa-facebook-f": faFacebookF,
  "fab fa-twitter": faTwitter,
  "fab fa-linkedin-in": faLinkedinIn,
  "fab fa-instagram": faInstagram,
  "fab fa-youtube": faYoutube,
  "fab fa-pinterest-p": faPinterest,
};

const Footer = () => {
  const location = useLocation();
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    fetch(API.FOOTER())
      .then((res) => res.json())
      .then((data) => {
        setFooterData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <footer className={styles.footer}>
        <div className={styles.wrap}>
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <p>Loading…</p>
          </div>
        </div>
      </footer>
    );
  }

  if (error) {
    return (
      <footer className={styles.footer}>
        <div className={styles.wrap}>
          <p className={styles.error}>Unable to load footer.</p>
        </div>
      </footer>
    );
  }

  const { social_icons = [], g_setting = {} } = footerData;
  const phone = g_setting.footer_phone || "+91-98765-43210";
  const logo = g_setting.builder_logo || "/default-logo.png";

  /** Official MahaRERA portal; override via API: footer_agent_rera_url or footer_rera_url */
  const MAHARERA_PORTAL_URL = "https://maharera.mahaonline.gov.in/";
  const reraVerifyUrl =
    (typeof g_setting.footer_agent_rera_url === "string" && g_setting.footer_agent_rera_url.trim()) ||
    (typeof g_setting.footer_rera_url === "string" && g_setting.footer_rera_url.trim()) ||
    MAHARERA_PORTAL_URL;

  return (
    <footer className={styles.footer}>
      {/* Top CTA strip */}
      <div className={styles.ctaStrip}>
        <div className={styles.ctaStripInner}>
          <p className={styles.ctaStripText}>Ready to find your perfect space?</p>
          <div className={styles.ctaStripActions}>
            <a href={`tel:${phone.replace(/\s/g, "")}`} className={styles.ctaStripPhone}>
              {phone}
            </a>
            <a href="#contact" className={styles.ctaStripBtn}>
              Get in touch
            </a>
          </div>
        </div>
      </div>

      <div className={styles.wrap}>
        {/* Centered single column: logo, tagline, links row, social */}
        <div className={styles.main}>
          <div className={styles.brand}>
            <img src={logo} alt="Logo" className={styles.logo} />
            {/* <p className={styles.tagline}>
              Your trusted partner for duplex apartments. MAHARERA certified.
            </p> */}
          </div>
          <div className={styles.linksRow}>
            <a href="#properties">Properties</a>
            <a href="#blogs">Blogs</a>
            <a href="#faq">FAQ</a>
            {isHomePage && <a href="#contact">Contact</a>}
            <Link to="/privacy-policy">Privacy Policy</Link>
          </div>
          <div className={styles.social}>
            {social_icons.map((icon) => (
              <a
                key={icon.id}
                href={icon.social_url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label={icon.social_icon}
              >
                <FontAwesomeIcon icon={iconMap[icon.social_icon] || faLinkedinIn} />
              </a>
            ))}
          </div>
        </div>

        {g_setting.footer_agent_rera && (
          <div className={styles.rera}>
            <span className={styles.reraLabel}>Agent MahaRERA</span>
            <span className={styles.reraNum}>{g_setting.footer_agent_rera}</span>
            <a
              href={reraVerifyUrl}
              className={styles.reraLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on MahaRERA
              <span className={styles.reraLinkIcon} aria-hidden>
                ↗
              </span>
            </a>
          </div>
        )}

        {(g_setting.footer_disclamer || g_setting.footer_disclaimer) && (
          <div className={styles.disclaimer}>
            <p>
              {typeof g_setting.footer_disclamer === "string" && g_setting.footer_disclamer.trim()
                ? g_setting.footer_disclamer
                : typeof g_setting.footer_disclaimer === "string"
                ? g_setting.footer_disclaimer
                : "This website is an informational portal managed by a Maharera-authorized real estate agent. Property prices and availability may change. For accurate details, contact us directly."}
            </p>
          </div>
        )}

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            {g_setting.footer_copyright || "© 2024. All rights reserved."}
          </p>
          <p className={styles.credit}>Made for property seekers</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
