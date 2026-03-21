import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaPhone } from "react-icons/fa";
import { API } from "../../../../config.js";
import styles from "../css/Header.module.css";
import EnquirePopup from "./EnquirePopup.jsx";

const Header = ({ headerData: initialHeaderData, slug }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerData, setHeaderData] = useState(initialHeaderData || {});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const fetchHeaderData = async () => {
      if (window.requestIdleCallback) {
        requestIdleCallback(() => {
          axios.get(API.HEADER())
            .then((response) => {
              setHeaderData(response.data);
              setLoading(false);
            })
            .catch((err) => {
              console.error("Error fetching header data:", err);
              setError(err);
              setLoading(false);
            });
        }, { timeout: 2000 });
      } else {
        setTimeout(() => {
          axios.get(API.HEADER())
            .then((response) => {
              setHeaderData(response.data);
              setLoading(false);
            })
            .catch((err) => {
              console.error("Error fetching header data:", err);
              setError(err);
              setLoading(false);
            });
        }, 100);
      }
    };
    if (!initialHeaderData) fetchHeaderData();
    else setLoading(false);
  }, [initialHeaderData]);

  if (error) {
    return (
      <div className={styles.error}>
        Error loading header: {error?.message ?? String(error)}
      </div>
    );
  }

  const reservedPaths = ["/blogs", "/privacy-policy", "/thank-you"];
const isPropertiesPage = /^\/[^/]+$/.test(location.pathname) && location.pathname.length > 1 && !reservedPaths.includes(location.pathname);
  const isHomePage = location.pathname === "/";
  const contact = headerData?.contact || headerData?.data?.contact || "+91-81818-17136";
  const logo = headerData?.logo || headerData?.data?.logo || "/default-logo.png";

  const navLinks = isPropertiesPage
    ? [
        { href: "/", label: "Home" },
        { href: "#about", label: "About" },
        { href: "#price", label: "Price" },
        { href: "#amenities", label: "Amenities" },
        { href: "#layouts", label: "Layouts" },
        { href: "#gallery", label: "Gallery" },
        { href: "#location", label: "Location" },
      ]
    : isHomePage
    ? [
        { href: "/", label: "Home" },
        { href: "#properties", label: "Properties" },
        { href: "#blogs", label: "Blogs" },
        { href: "#faq", label: "FAQ" },
      ]
    : [{ href: "/", label: "Home" }];

  return (
    <header className={`${styles.header} ${menuOpen ? styles.headerMenuOpen : ""}`}>
      {/* Row 1: Logo centered, actions right */}
      <div className={styles.topRow}>
        <div className={styles.topRowInner}>
          <Link to="/" className={styles.logoWrap}>
            <img src={logo} alt="Logo" className={styles.logo} />
          </Link>
          <div className={styles.actions}>
            <a href={`tel:${contact.replace(/\s/g, "")}`} className={styles.phoneLink}>
              <span className={styles.phoneLabel}>Call us</span>
              <span className={styles.phoneValue}>{contact}</span>
            </a>
            <button type="button" onClick={() => setIsPopupOpen(true)} className={styles.enquireBtn}>
              Request a callback
            </button>
          </div>
          <button
            type="button"
            className={`${styles.menuBtn} ${menuOpen ? styles.menuBtnOpen : ""}`}
            onClick={toggleMenu}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="site-menu-drawer"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Row 2: Full-width nav strip */}
      <div className={styles.navStrip}>
        <nav className={styles.nav}>
          {navLinks.map((link) => (
            <a key={link.href + link.label} href={link.href} className={styles.navLink}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      {/* Mobile: full-screen overlay (portal → body so layout is viewport-centered, not header-relative) */}
      {menuOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            id="site-menu-drawer"
            className={styles.drawer}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeMenu();
            }}
          >
            <div className={styles.drawerInner} onClick={(e) => e.stopPropagation()}>
              <nav className={styles.drawerNav}>
                {navLinks.map((link) => (
                  <a key={link.href + link.label} href={link.href} onClick={closeMenu} className={styles.drawerLink}>
                    {link.label}
                  </a>
                ))}
              </nav>
              <div className={styles.drawerActions}>
                <a href={`tel:${contact.replace(/\s/g, "")}`} onClick={closeMenu} className={styles.drawerPhone}>
                  <FaPhone /> {contact}
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setIsPopupOpen(true);
                    closeMenu();
                  }}
                  className={styles.drawerEnquire}
                >
                  Request a callback
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {isPopupOpen && <EnquirePopup onClose={() => setIsPopupOpen(false)} slug={slug} />}
    </header>
  );
};

export default Header;
