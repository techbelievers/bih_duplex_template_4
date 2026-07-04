import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./KnowYourReturns.module.css";
import { API } from "../../../../../config.js";

const KnowYourReturns = ({ slug }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Standard");

  useEffect(() => {
    const fetchReturnsData = async () => {
      try {
        const response = await fetch(API.KNOW_YOUR_RETURNS_STUDIO(slug));
        const jsonData = await response.json();

        if (!response.ok) throw new Error("Failed to fetch data");
        setData(jsonData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReturnsData();
  }, [slug]);

  if (loading) return null;
  if (error) return null;
  if (!data?.returns?.length) return null;

  const { page, returns } = data;
  const heading = page?.[0]?.heading || "Know Your Returns";
  const filteredReturns = (returns || []).filter((item) => item.type === activeTab);

  return (
    <section className={styles.returnsSection}>
      <div className={styles.contentWrapper}>
        {/* Header Section */}
        <div className={styles.sectionHeader}>
          <div className={styles.logoWrapper}>
            <span className={styles.logoArrow}>▲</span>
            <h2 className={styles.heading}>
              Know Your <span className={styles.highlight}>RETURNS</span>
            </h2>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {["Standard", "Premium"].map((tab) => (
            <motion.button
              key={tab}
              className={`${styles.tab} ${
                activeTab === tab ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab(tab)}
              whileHover={{ scale: 1.05 }}
            >
              {tab}
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className={styles.tabContent}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {filteredReturns.length === 0 ? (
              <div className={styles.emptyState}>
                No data available for {activeTab} returns.
              </div>
            ) : (
              <table className={styles.table}>
                <tbody>
                  <tr>
                    <th>Unit Price (₹)</th>
                    <td>{filteredReturns[0].unit_price}</td>
                  </tr>
                  {/* <tr>
                    <th>Net EMI (₹)</th>
                    <td>{filteredReturns[0].net_emi}</td>
                  </tr> */}
                  <tr>
                    <th>Monthly Net Rent (₹)</th>
                    <td>{filteredReturns[0].monthly_net_emi}</td>
                  </tr>
                  {/* <tr>
                    <th>Monthly Rent with GST (₹)</th>
                    <td>{filteredReturns[0].monthly_rent_with_gst}</td>
                  </tr> */}
                  <tr>
                    <th>Net Rent Annually (₹)</th>
                    <td>{filteredReturns[0].net_rent_annually}</td>
                  </tr>
                  <tr>
                    <th>ROI (on base price)</th>
                    <td>{filteredReturns[0].roi}%</td>
                  </tr>
                </tbody>
              </table>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default KnowYourReturns;
