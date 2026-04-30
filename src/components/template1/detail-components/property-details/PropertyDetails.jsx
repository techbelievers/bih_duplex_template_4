import React, { useState } from 'react';
import styles from './PropertyDetails.module.css';

const PropertyDetails = ({ propertyDetails, error }) => {
  const [activeTab, setActiveTab] = useState('about');
  const [expandedTabs, setExpandedTabs] = useState({
    about: false,
    builders: false,
    info: false,
  });

  const handleReadMore = (tab) => {
    setExpandedTabs((prev) => ({
      ...prev,
      [tab]: !prev[tab],
    }));
  };

  if (!propertyDetails) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div id="about" className={styles.propertyDetailsContainer}>
      {/* Clip Path Background */}
      <div className={styles.clipPathBackground}></div>

      {/* Header */}
      <div className={styles.headerCard}>
        <h2 className={styles.heading}>{propertyDetails.property_name}</h2>
        <p className={styles.propertyTagline}>
          {propertyDetails.tagline || 'Luxury Living at its Best'}
        </p>
      </div>

      {/* Tabs */}
      <div className={styles.tabHeaders}>
        <button
          type="button"
          className={`${styles.tabButton} ${
            activeTab === 'about' ? styles.activeTab : ''
          }`}
          onClick={() => setActiveTab('about')}
        >
          About the Property
        </button>
        <button
          type="button"
          className={`${styles.tabButton} ${
            activeTab === 'builders' ? styles.activeTab : ''
          }`}
          onClick={() => setActiveTab('builders')}
        >
          About the Builders
        </button>
        <button
          type="button"
          className={`${styles.tabButton} ${
            activeTab === 'info' ? styles.activeTab : ''
          }`}
          onClick={() => setActiveTab('info')}
        >
          Additional Information
        </button>
      </div>

      {/* Tab Content */}
      <div className={styles.descriptionCard}>
        <h2 className={styles.sectionHeading}>
          {activeTab === 'about'
            ? 'About the Property'
            : activeTab === 'builders'
            ? 'About the Builders'
            : 'Additional Information'}
        </h2>
        <div
          className={`${styles.description} ${
            expandedTabs[activeTab] ? styles.expanded : ''
          }`}
          dangerouslySetInnerHTML={{
            __html: (() => {
              const desc = activeTab === 'about' ? (propertyDetails.property_description || '') : activeTab === 'builders' ? (propertyDetails.property_specification || '') : (propertyDetails.property_information || '');
              return expandedTabs[activeTab] ? desc : (desc.slice(0, 2000) + (desc.length > 2000 ? '...' : ''));
            })(),
          }}
        />
        <button
          className={styles.readMoreButton}
          onClick={() => handleReadMore(activeTab)}
        >
          {expandedTabs[activeTab] ? 'Read Less' : 'Read More'}
        </button>
      </div>
    </div>
  );
};

export default PropertyDetails;
